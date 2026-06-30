import { NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/unsubscribeToken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function setBlacklist(
  apiKey: string,
  email: string,
  blacklisted: boolean
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
      body: JSON.stringify({ emailBlacklisted: blacklisted }),
    }
  );
  // 204 = opdateret. 404 = kontakt findes ikke (afmelding er reelt allerede sand).
  return res.ok || res.status === 404;
}

export async function POST(req: Request) {
  let body: { email?: unknown; token?: unknown; action?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const token = typeof body.token === "string" ? body.token : "";
  const action = body.action === "resubscribe" ? "resubscribe" : "unsubscribe";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Ugyldig e-mail" }, { status: 400 });
  }
  if (!verifyEmailToken(email, token)) {
    return NextResponse.json({ error: "Ugyldigt link" }, { status: 403 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Ikke konfigureret" },
      { status: 503 }
    );
  }

  try {
    const ok = await setBlacklist(apiKey, email, action === "unsubscribe");
    if (ok) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Kunne ikke opdatere" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Serverfejl" }, { status: 500 });
  }
}
