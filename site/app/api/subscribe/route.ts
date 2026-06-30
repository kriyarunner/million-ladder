import { NextResponse } from "next/server";
import type { Lang } from "@/lib/i18n";
import { buildWelcomeEmail, SITE_URL } from "@/lib/welcomeEmail";
import { signEmail } from "@/lib/unsubscribeToken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function unsubscribeUrl(lang: Lang, email: string): string {
  const base = lang === "en" ? `${SITE_URL}/en/unsubscribe` : `${SITE_URL}/unsubscribe`;
  const e = encodeURIComponent(email);
  const t = signEmail(email);
  return `${base}?e=${e}&t=${t}`;
}

// Sender automatisk velkomstmail med det samme på modtagerens sprog. Best-effort:
// fejler den, går selve tilmeldingen stadig igennem. Kræver en verificeret
// afsender i Brevo sat via BREVO_SENDER_EMAIL (fx hello@millionladder.com).
async function sendInstantReply(apiKey: string, toEmail: string, lang: Lang) {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) return; // ingen afsender konfigureret → spring over
  const senderName = process.env.BREVO_SENDER_NAME || "Million Ladder";
  const { subject, html } = buildWelcomeEmail(lang, {
    unsubscribeUrl: unsubscribeUrl(lang, toEmail),
  });

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        replyTo: { email: senderEmail, name: senderName },
        to: [{ email: toEmail }],
        subject,
        htmlContent: html,
      }),
    });
  } catch {
    // Ignorér — velkomstmail er best-effort.
  }
}

// Opretter et kontaktfelt i Brevo hvis det ikke findes. Idempotent: findes det
// allerede, svarer Brevo 400 (som vi ignorerer). Best-effort.
async function ensureAttribute(
  apiKey: string,
  name: string,
  type: "text" | "float"
) {
  try {
    await fetch(
      `https://api.brevo.com/v3/contacts/attributes/normal/${name}`,
      {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ type }),
      }
    );
  } catch {
    // ignorér — tagging er best-effort
  }
}

// Indrullerer en NY kontakt i velkomst-drippet ved at sætte WELCOME_STAGE=1.
// Cron-jobbet rykker dem videre til trin 2-5. Vi gør det kun for nye kontakter
// (201), så eksisterende, der gentilmelder sig, ikke nulstilles. Best-effort.
async function enrollInDrip(apiKey: string, email: string) {
  const put = () =>
    fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: "PUT",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ attributes: { WELCOME_STAGE: 1 } }),
    });
  try {
    let r = await put();
    if (!r.ok) {
      await ensureAttribute(apiKey, "WELCOME_STAGE", "float");
      r = await put();
    }
  } catch {
    // ignorér — drip-indrullering er best-effort
  }
}

// Slår en kontakt op i Brevo. Returnerer null hvis den ikke findes (404), så
// kalderen ved om der er tale om en helt ny tilmelding. Ved ukendte fejl
// antager vi "findes + aktiv" for ikke at risikere dobbelt velkomstmail.
async function getContact(
  apiKey: string,
  email: string
): Promise<{ exists: boolean; blacklisted: boolean }> {
  try {
    const res = await fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
      {
        headers: { "api-key": apiKey, accept: "application/json" },
        cache: "no-store",
      }
    );
    if (res.status === 404) return { exists: false, blacklisted: false };
    if (!res.ok) return { exists: true, blacklisted: false };
    const data = (await res.json()) as { emailBlacklisted?: boolean };
    return { exists: true, blacklisted: Boolean(data?.emailBlacklisted) };
  } catch {
    return { exists: true, blacklisted: false };
  }
}

function createContact(
  apiKey: string,
  email: string,
  listId: string,
  lang: Lang,
  withAttr: boolean
) {
  return fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      email,
      listIds: [Number(listId)],
      updateEnabled: true,
      // Genaktivér altid ved en ægte tilmelding, så en tidligere afmelding
      // (blacklist) fjernes og personen reelt kommer på listen igen.
      emailBlacklisted: false,
      ...(withAttr ? { attributes: { LANGUAGE: lang } } : {}),
    }),
  });
}

export async function POST(req: Request) {
  let payload: { email?: unknown; lang?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning" }, { status: 400 });
  }

  const email = payload.email;
  const lang: Lang = payload.lang === "en" ? "en" : "da";

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Ugyldig e-mail" }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  if (!apiKey || !listId) {
    return NextResponse.json(
      { error: "Tilmelding er ikke konfigureret endnu" },
      { status: 503 }
    );
  }

  try {
    const addr = email.trim();

    // Kend kontaktens nuværende tilstand FØR vi opretter/opdaterer, så vi ved om
    // det er en ny tilmelding eller en gentilmelding efter afmelding.
    const before = await getContact(apiKey, addr);

    // Forsøg med sprog-tag. Fejler det (fx feltet findes ikke endnu), opretter
    // vi feltet og prøver igen — og som sidste udvej helt uden tag, så
    // tilmeldingen aldrig blokeres.
    let res = await createContact(apiKey, addr, listId, lang, true);
    if (!res.ok) {
      await ensureAttribute(apiKey, "LANGUAGE", "text");
      res = await createContact(apiKey, addr, listId, lang, true);
      if (!res.ok) {
        res = await createContact(apiKey, addr, listId, lang, false);
      }
    }

    // 201 created, 204 updated (updateEnabled) — begge er success.
    if (res.ok) {
      // Velkomst + drip skal sendes ved ægte (gen)tilmelding: enten en helt ny
      // kontakt, ELLER en der tidligere havde afmeldt sig (blacklist). En
      // allerede aktiv kontakt, der trykker tilmeld igen, skal IKKE spammes.
      const isNew = !before.exists;
      const isReactivation = before.exists && before.blacklisted;
      if (isNew || isReactivation) {
        await enrollInDrip(apiKey, addr);
        await sendInstantReply(apiKey, addr, lang);
      }
      return NextResponse.json({ ok: true });
    }

    const data = (await res.json().catch(() => ({}))) as { code?: string };
    // Kontakt findes allerede = stadig "på listen", behandl som success.
    if (data?.code === "duplicate_parameter") {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "Kunne ikke tilmelde lige nu" },
      { status: 502 }
    );
  } catch {
    return NextResponse.json({ error: "Serverfejl" }, { status: 500 });
  }
}
