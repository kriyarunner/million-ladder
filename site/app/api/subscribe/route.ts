import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning" }, { status: 400 });
  }

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
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        listIds: [Number(listId)],
        updateEnabled: true,
      }),
    });

    // 201 created, 204 updated (updateEnabled) — begge er success.
    if (res.ok) {
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
