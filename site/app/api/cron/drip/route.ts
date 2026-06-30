import { NextResponse } from "next/server";
import type { Lang } from "@/lib/i18n";
import {
  buildDripEmail,
  DRIP_DELAY_DAYS,
  DRIP_STAGES,
  type DripStage,
  SITE_URL,
} from "@/lib/welcomeEmail";
import { signEmail } from "@/lib/unsubscribeToken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAY_MS = 86_400_000;

type BrevoContact = {
  email: string;
  emailBlacklisted?: boolean;
  createdAt?: string;
  attributes?: Record<string, unknown>;
};

function unsubscribeUrl(lang: Lang, email: string): string {
  const base =
    lang === "en" ? `${SITE_URL}/en/unsubscribe` : `${SITE_URL}/unsubscribe`;
  return `${base}?e=${encodeURIComponent(email)}&t=${signEmail(email)}`;
}

function langOf(c: BrevoContact): Lang {
  const raw = c.attributes?.LANGUAGE;
  return typeof raw === "string" && raw.toLowerCase() === "en" ? "en" : "da";
}

function stageOf(c: BrevoContact): number | null {
  const raw = c.attributes?.WELCOME_STAGE;
  if (raw === undefined || raw === null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

async function fetchListContacts(
  apiKey: string,
  listId: string
): Promise<BrevoContact[]> {
  const out: BrevoContact[] = [];
  const limit = 500;
  for (let offset = 0; offset < 50_000; offset += limit) {
    const res = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${listId}/contacts?limit=${limit}&offset=${offset}`,
      {
        headers: { "api-key": apiKey, accept: "application/json" },
        cache: "no-store",
      }
    );
    if (!res.ok) break;
    const data = (await res.json()) as { contacts?: BrevoContact[] };
    const batch = data.contacts ?? [];
    out.push(...batch);
    if (batch.length < limit) break;
  }
  return out;
}

async function sendDrip(
  apiKey: string,
  senderEmail: string,
  senderName: string,
  email: string,
  lang: Lang,
  stage: DripStage
): Promise<boolean> {
  const { subject, html } = buildDripEmail(lang, stage, {
    unsubscribeUrl: unsubscribeUrl(lang, email),
  });
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      replyTo: { email: senderEmail, name: senderName },
      to: [{ email }],
      subject,
      htmlContent: html,
    }),
  });
  return res.ok;
}

async function setStage(
  apiKey: string,
  email: string,
  stage: number
): Promise<boolean> {
  const res = await fetch(
    `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
    {
      method: "PUT",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ attributes: { WELCOME_STAGE: stage } }),
    }
  );
  return res.ok;
}

async function runDrip() {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Million Ladder";

  if (!apiKey || !listId) {
    return { error: "not_configured", sent: 0, scanned: 0 };
  }
  if (!senderEmail) {
    return { error: "no_sender", sent: 0, scanned: 0 };
  }

  const contacts = await fetchListContacts(apiKey, listId);
  const now = Date.now();
  let sent = 0;

  for (const c of contacts) {
    if (!c.email || c.emailBlacklisted) continue;

    const stage = stageOf(c);
    if (stage === null || stage >= 5) continue; // ikke indrulleret eller færdig

    const next = (stage + 1) as DripStage;
    if (!DRIP_STAGES.includes(next)) continue;

    const created = c.createdAt ? Date.parse(c.createdAt) : NaN;
    if (!Number.isFinite(created)) continue;

    const days = (now - created) / DAY_MS;
    if (days < DRIP_DELAY_DAYS[next]) continue;

    const lang = langOf(c);
    const ok = await sendDrip(
      apiKey,
      senderEmail,
      senderName,
      c.email,
      lang,
      next
    );
    if (ok) {
      await setStage(apiKey, c.email, next);
      sent++;
    }
  }

  return { ok: true, scanned: contacts.length, sent };
}

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // ingen secret sat → åben (handlingen er idempotent)
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await runDrip();
    return NextResponse.json(result);
  } catch (e) {
    console.error("Drip cron error:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
