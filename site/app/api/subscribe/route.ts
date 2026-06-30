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

// Opretter LANGUAGE-kontaktfeltet i Brevo hvis det ikke findes. Idempotent:
// findes det allerede, svarer Brevo 400 (som vi ignorerer). Best-effort.
async function ensureLanguageAttribute(apiKey: string) {
  try {
    await fetch(
      "https://api.brevo.com/v3/contacts/attributes/normal/LANGUAGE",
      {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ type: "text" }),
      }
    );
  } catch {
    // ignorér — tagging er best-effort
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
    // Forsøg med sprog-tag. Fejler det (fx feltet findes ikke endnu), opretter
    // vi feltet og prøver igen — og som sidste udvej helt uden tag, så
    // tilmeldingen aldrig blokeres.
    let res = await createContact(apiKey, addr, listId, lang, true);
    if (!res.ok) {
      await ensureLanguageAttribute(apiKey);
      res = await createContact(apiKey, addr, listId, lang, true);
      if (!res.ok) {
        res = await createContact(apiKey, addr, listId, lang, false);
      }
    }

    // 201 created, 204 updated (updateEnabled) — begge er success.
    if (res.ok) {
      // Send kun velkomst ved ny tilmelding (201) for ikke at spamme
      // eksisterende kontakter ved gentagne submits.
      if (res.status === 201) {
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
