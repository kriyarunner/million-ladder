import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Sender automatisk kvitteringsmail med det samme. Best-effort: fejler den,
// går selve tilmeldingen stadig igennem. Kræver en verificeret afsender i Brevo
// sat via BREVO_SENDER_EMAIL (fx hej@millionladder.com).
async function sendInstantReply(
  apiKey: string,
  toEmail: string
): Promise<{ step: string; status?: number; body?: string }> {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) return { step: "no_sender_email" }; // ingen afsender konfigureret → spring over
  const senderName = process.env.BREVO_SENDER_NAME || "Million Ladder";

  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
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
        subject: "Velkommen 🪜 Her er dit første trin",
        htmlContent: `<!doctype html><html><body style="margin:0;background:#050608;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#e8ecf1;">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px;">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,#2bd576,#1fa863);font-size:20px;font-weight:800;color:#ffcf4a;">M</div>
    <h1 style="font-size:24px;line-height:1.25;margin:18px 0 0;color:#ffffff;">Velkommen til Million Ladder</h1>
    <p style="font-size:15px;line-height:1.6;color:#c3cad3;margin:16px 0 0;">
      Du er på listen — tak fordi du er med fra start. Her er, hvad du kan forvente:
    </p>
    <ul style="font-size:15px;line-height:1.7;color:#c3cad3;margin:14px 0 0;padding-left:20px;">
      <li><b style="color:#fff;">Ugens guide hver mandag</b> — ét konkret fund eller trick, der løfter dig op ad trappen.</li>
      <li><b style="color:#fff;">Først besked</b>, når appen og 37-dages challengen går live.</li>
      <li>Ingen spam. Frameld når som helst.</li>
    </ul>
    <p style="font-size:15px;line-height:1.6;color:#c3cad3;margin:18px 0 0;">
      Vil du i gang allerede nu? Start her:
    </p>
    <p style="margin:14px 0 0;">
      <a href="https://millionladder.com/blog/find-de-mest-vaerdifulde-ting" style="display:inline-block;background:linear-gradient(135deg,#2bd576,#1fa863);color:#05130b;font-weight:800;font-size:15px;text-decoration:none;padding:13px 22px;border-radius:12px;">Læs: Find de mest værdifulde ting i dit hjem →</a>
    </p>
    <p style="font-size:15px;line-height:1.6;color:#c3cad3;margin:22px 0 0;">
      Følg rejsen i mellemtiden:
      <a href="https://www.tiktok.com/@millionladderapp" style="color:#2bd576;">TikTok</a> ·
      <a href="https://www.instagram.com/millionladderapp" style="color:#2bd576;">Instagram</a>
    </p>
    <p style="font-size:13px;line-height:1.6;color:#8a909a;margin:26px 0 0;">— Million Ladder<br/>millionladder.com</p>
  </div>
</body></html>`,
      }),
    });
    const body = await r.text().catch(() => "");
    return { step: "sent", status: r.status, body: body.slice(0, 300) };
  } catch (e) {
    return { step: "exception", body: String(e).slice(0, 300) };
  }
}

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

    const debug = new URL(req.url).searchParams.get("debug") === "1";

    // 201 created, 204 updated (updateEnabled) — begge er success.
    if (res.ok) {
      // Send kun kvittering ved ny tilmelding (201) for ikke at spamme
      // eksisterende kontakter ved gentagne submits.
      let welcome: { step: string; status?: number; body?: string } = {
        step: "skipped_not_new",
      };
      if (res.status === 201) {
        welcome = await sendInstantReply(apiKey, email.trim());
      }
      if (debug) {
        return NextResponse.json({
          ok: true,
          contactStatus: res.status,
          hasSenderEmail: Boolean(process.env.BREVO_SENDER_EMAIL),
          hasSenderName: Boolean(process.env.BREVO_SENDER_NAME),
          welcome,
        });
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
