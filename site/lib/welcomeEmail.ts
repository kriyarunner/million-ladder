import type { Lang } from "@/lib/i18n";

export const SITE_URL = process.env.SITE_URL || "https://millionladder.com";
const LOGO_URL = `${SITE_URL}/icon-512.png`;

function withLang(lang: Lang, path: string) {
  if (lang === "da") return `${SITE_URL}${path}`;
  return `${SITE_URL}/en${path}`;
}

type Copy = {
  subject: string;
  preheader: string;
  eyebrow: string;
  greeting: string;
  h1: string;
  intro: string;
  stepBadge: string;
  stepTitle: string;
  stepBody: string;
  expectTitle: string;
  expect: string[];
  ctaPrimary: string;
  ctaPrimaryUrl: string;
  ctaSecondary: string;
  ctaSecondaryUrl: string;
  followLead: string;
  signoff: string;
  disclaimer: string;
  unsubPre: string;
  unsubLink: string;
};

function copyFor(lang: Lang): Copy {
  if (lang === "en") {
    return {
      subject: "Welcome 🪜 your first step toward a million",
      preheader:
        "You're on the list. Here's your first small step up the ladder.",
      eyebrow: "YOUR JOURNEY STARTS HERE",
      greeting: "Hi there,",
      h1: "Welcome to Million Ladder",
      intro:
        "Thanks for signing up. The idea is simple: you don't need a fortune to get started — you begin with what you already own.",
      stepBadge: "YOUR FIRST STEP · 5 MIN",
      stepTitle: "Find one thing today",
      stepBody:
        "Look around your home and find <b>one</b> thing you haven't touched in the last year. An old phone, a pair of shoes, a gadget in a drawer. That's not clutter — that's your starting capital. You don't have to sell it yet. Just pick it.",
      expectTitle: "What you can expect from us",
      expect: [
        "<b>One guide every Monday</b> — a single concrete find or trick that can lift you up the ladder.",
        "<b>First word</b> the moment the app and the 37-day challenge go live.",
        "No spam, ever. Just useful things. Unsubscribe anytime.",
      ],
      ctaPrimary: "Read: Find the most valuable things at home →",
      ctaPrimaryUrl: withLang("en", "/blog/find-de-mest-vaerdifulde-ting"),
      ctaSecondary: "Or start the free 37-day challenge →",
      ctaSecondaryUrl: withLang("en", "/udfordring"),
      followLead: "Follow the journey in the meantime:",
      signoff: "See you on the ladder,<br/>— Million Ladder",
      disclaimer:
        "Million Ladder is a motivation and decluttering app. Not financial advice, and we promise no financial gain.",
      unsubPre: "Don't want these emails? ",
      unsubLink: "Unsubscribe here.",
    };
  }
  return {
    subject: "Velkommen 🪜 dit første trin mod en million",
    preheader: "Du er på listen. Her er dit første lille trin op ad trappen.",
    eyebrow: "DIN REJSE STARTER HER",
    greeting: "Hej,",
    h1: "Velkommen til Million Ladder",
    intro:
      "Tak fordi du skrev dig op. Idéen er simpel: du behøver ikke en formue for at komme i gang — du starter med det, du allerede ejer.",
    stepBadge: "DIT FØRSTE TRIN · 5 MIN",
    stepTitle: "Find én ting i dag",
    stepBody:
      "Kig dig omkring derhjemme og find <b>én</b> ting, du ikke har rørt det seneste år. En gammel telefon, et par sko, en dims i en skuffe. Det er ikke rod — det er din startkapital. Du behøver ikke sælge den endnu. Bare vælg den.",
    expectTitle: "Hvad du kan forvente fra os",
    expect: [
      "<b>Én guide hver mandag</b> — ét konkret fund eller trick, der kan løfte dig op ad trappen.",
      "<b>Først besked</b>, i samme øjeblik appen og den 37-dages challenge går live.",
      "Aldrig spam. Kun ting, der gør en forskel. Frameld når som helst.",
    ],
    ctaPrimary: "Læs: Find de mest værdifulde ting i dit hjem →",
    ctaPrimaryUrl: withLang("da", "/blog/find-de-mest-vaerdifulde-ting"),
    ctaSecondary: "Eller prøv den gratis 37-dages udfordring →",
    ctaSecondaryUrl: withLang("da", "/udfordring"),
    followLead: "Følg rejsen i mellemtiden:",
    signoff: "Vi ses på trappen,<br/>— Million Ladder",
    disclaimer:
      "Million Ladder er en motivations- og oprydnings-app. Ikke finansiel rådgivning, og vi lover ingen økonomisk gevinst.",
    unsubPre: "Vil du ikke have flere mails? ",
    unsubLink: "Afmeld her.",
  };
}

/**
 * Bygger velkomst-mailen (HTML + emne) på det valgte sprog. Designet efter
 * adfærdsdesign: ét lille første trin (foot-in-the-door), klare forventninger
 * og én tydelig handling. Ingen overdrevne påstande om antal tilmeldte.
 */
export function buildWelcomeEmail(
  lang: Lang,
  opts: { unsubscribeUrl: string }
): { subject: string; html: string } {
  const c = copyFor(lang);
  const tiktok = "https://www.tiktok.com/@millionladderapp";
  const instagram = "https://www.instagram.com/millionladderapp";

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="dark light" />
<title>${c.h1}</title>
</head>
<body style="margin:0;padding:0;background:#04060a;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#04060a;font-size:1px;line-height:1px;">${c.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#04060a;padding:28px 14px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0b0f15;border:1px solid #1b212b;border-radius:22px;overflow:hidden;">
  <tr><td style="padding:34px 32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <img src="${LOGO_URL}" width="56" height="56" alt="Million Ladder" style="display:block;border-radius:15px;" />
    <div style="margin-top:22px;color:#2bd576;font-size:11px;font-weight:800;letter-spacing:0.14em;">${c.eyebrow}</div>
    <h1 style="margin:10px 0 0;color:#ffffff;font-size:26px;line-height:1.2;font-weight:800;letter-spacing:-0.02em;">${c.h1}</h1>
    <p style="margin:18px 0 0;color:#c3cad3;font-size:15px;line-height:1.65;">${c.greeting}</p>
    <p style="margin:10px 0 0;color:#c3cad3;font-size:15px;line-height:1.65;">${c.intro}</p>
  </td></tr>

  <tr><td style="padding:22px 32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(43,213,118,0.10),rgba(255,207,74,0.08));border:1px solid rgba(43,213,118,0.30);border-radius:16px;">
      <tr><td style="padding:18px 20px;">
        <div style="color:#ffcf4a;font-size:11px;font-weight:800;letter-spacing:0.1em;">${c.stepBadge}</div>
        <div style="margin-top:7px;color:#ffffff;font-size:18px;font-weight:800;">${c.stepTitle}</div>
        <p style="margin:8px 0 0;color:#c3cad3;font-size:14.5px;line-height:1.6;">${c.stepBody}</p>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:26px 32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="color:#ffffff;font-size:15px;font-weight:800;">${c.expectTitle}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
      ${c.expect
        .map(
          (item) => `<tr>
        <td valign="top" style="padding:5px 10px 5px 0;color:#2bd576;font-size:15px;line-height:1.6;">▸</td>
        <td style="padding:5px 0;color:#c3cad3;font-size:14.5px;line-height:1.6;">${item}</td>
      </tr>`
        )
        .join("")}
    </table>
  </td></tr>

  <tr><td style="padding:26px 32px 6px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <a href="${c.ctaPrimaryUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#2bd576,#1fa863);color:#05130b;font-size:15px;font-weight:800;text-decoration:none;padding:15px 22px;border-radius:13px;">${c.ctaPrimary}</a>
    <a href="${c.ctaSecondaryUrl}" style="display:block;text-align:center;margin-top:12px;color:#2bd576;font-size:14px;font-weight:700;text-decoration:none;">${c.ctaSecondary}</a>
  </td></tr>

  <tr><td style="padding:22px 32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <p style="margin:0;color:#c3cad3;font-size:14px;line-height:1.6;">${c.followLead}
      <a href="${tiktok}" style="color:#2bd576;text-decoration:none;font-weight:700;">TikTok</a> ·
      <a href="${instagram}" style="color:#2bd576;text-decoration:none;font-weight:700;">Instagram</a>
    </p>
    <p style="margin:20px 0 0;color:#c3cad3;font-size:14.5px;line-height:1.6;">${c.signoff}</p>
  </td></tr>

  <tr><td style="padding:26px 32px 30px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="border-top:1px solid #1b212b;padding-top:18px;">
      <p style="margin:0;color:#7b828d;font-size:12px;line-height:1.6;">${c.disclaimer}</p>
      <p style="margin:12px 0 0;color:#7b828d;font-size:12px;line-height:1.6;">
        ${c.unsubPre}<a href="${opts.unsubscribeUrl}" style="color:#9aa1ac;text-decoration:underline;">${c.unsubLink}</a><br/>
        Million Ladder · <a href="${SITE_URL}" style="color:#9aa1ac;text-decoration:none;">millionladder.com</a>
      </p>
    </div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject: c.subject, html };
}

// ───────────────────────── Drip-sekvens (mail 2-5) ─────────────────────────

export const DRIP_STAGES = [2, 3, 4, 5] as const;
export type DripStage = (typeof DRIP_STAGES)[number];

// Hvor mange dage efter tilmelding hvert trin tidligst må sendes.
export const DRIP_DELAY_DAYS: Record<DripStage, number> = {
  2: 2,
  3: 5,
  4: 9,
  5: 14,
};

type DripCopy = {
  subject: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  ctaLabel?: string;
  ctaUrl?: string;
};

function dripContent(lang: Lang): Record<DripStage, DripCopy> {
  if (lang === "en") {
    return {
      2: {
        subject: "The first sale is the hardest — here's how",
        eyebrow: "DAY 2 · YOUR NEXT STEP",
        heading: "The first sale is the hardest",
        paragraphs: [
          "Most people stall before their first sale because they don't know where to begin. So let's make it easy: find <b>one</b> thing today you haven't used in the past year.",
          "It doesn't have to be big. An old phone, a pair of shoes, a book. Set it aside, snap a photo by a window, and write a short, honest listing.",
          "That's the whole Million Ladder move: one small step you can actually take today.",
        ],
        ctaLabel: "The 7 places at home that hide value →",
        ctaUrl: withLang("en", "/blog/find-de-mest-vaerdifulde-ting"),
      },
      3: {
        subject: 'Why 37 steps — and not "make a million"',
        eyebrow: "DAY 5 · THE MINDSET",
        heading: "Why 37 steps?",
        paragraphs: [
          '"Make a million" is impossible to act on. "Sell one thing today" isn\'t.',
          "That's why the journey is split into 37 steps. Each step is small enough that you can picture yourself taking it — and that's exactly what builds momentum. Not willpower, but a chain of small, finished actions.",
        ],
        ctaLabel: "Read: small steps beat big leaps →",
        ctaUrl: withLang("en", "/blog/smaa-skridt-slaar-store-spring"),
      },
      4: {
        subject: "The app that always shows your next step",
        eyebrow: "DAY 9 · MEET THE APP",
        heading: "Always your next step",
        paragraphs: [
          "When you sell and reinvest, it's easy to lose track of where you are. That's what the Million Ladder app does for you: it always shows exactly what it takes to reach the next step — and how few moves are actually left to the top.",
          "It's free, 100% offline and needs no account. We'll let you know the moment it lands — you're already on the list.",
        ],
        ctaLabel: "Try the free 37-day challenge →",
        ctaUrl: withLang("en", "/udfordring"),
      },
      5: {
        subject: "Take the first step — we're with you",
        eyebrow: "DAY 14 · OVER TO YOU",
        heading: "Now, take the first step",
        paragraphs: [
          "You've got the idea, the method and the tools. All that's left is the most important part: taking the first step.",
          "Pick one thing. Sell it this week. Reinvest calmly. Repeat.",
          "Share your journey and watch others on TikTok and Instagram (@millionladderapp) — it's more fun together, and momentum comes easier.",
        ],
        ctaLabel: "Start the challenge →",
        ctaUrl: withLang("en", "/udfordring"),
      },
    };
  }
  return {
    2: {
      subject: "Det første salg er det sværeste — her er hvordan",
      eyebrow: "DAG 2 · DIT NÆSTE TRIN",
      heading: "Det første salg er det sværeste",
      paragraphs: [
        "De fleste går i stå før det første salg, fordi de ikke ved, hvor de skal starte. Så lad os gøre det nemt: find <b>én</b> ting i dag, du ikke har brugt det seneste år.",
        "Det behøver ikke være stort. En gammel telefon, et par sko, en bog. Læg den til side, tag et billede ved et vindue, og skriv en kort, ærlig annonce.",
        "Det er hele bevægelsen i Million Ladder: ét lille trin, du faktisk kan tage i dag.",
      ],
      ctaLabel: "De 7 steder i hjemmet, der gemmer på værdi →",
      ctaUrl: withLang("da", "/blog/find-de-mest-vaerdifulde-ting"),
    },
    3: {
      subject: 'Hvorfor 37 trin — og ikke "tjen en million"',
      eyebrow: "DAG 5 · MINDSETTET",
      heading: "Hvorfor 37 trin?",
      paragraphs: [
        '"Tjen en million" er umuligt at handle på. "Sælg én ting i dag" er ikke.',
        "Derfor er rejsen delt op i 37 trin. Hvert trin er lille nok til, at du kan se dig selv tage det — og det er præcis det, der skaber momentum. Ikke viljestyrke, men en kæde af små, færdige handlinger.",
      ],
      ctaLabel: "Læs: små skridt slår store spring →",
      ctaUrl: withLang("da", "/blog/smaa-skridt-slaar-store-spring"),
    },
    4: {
      subject: "Appen, der altid viser dig dit næste trin",
      eyebrow: "DAG 9 · MØD APPEN",
      heading: "Altid dit næste trin",
      paragraphs: [
        "Når du sælger og geninvesterer, kan det være svært at holde styr på, hvor du er. Det er det, Million Ladder-appen gør for dig: den viser dig altid præcis, hvad der skal til for at nå næste trin — og hvor få handler der faktisk er tilbage til toppen.",
        "Den er gratis, 100% offline og kræver ingen konto. Vi siger til, så snart den lander — du er allerede på listen.",
      ],
      ctaLabel: "Prøv den gratis 37-dages udfordring →",
      ctaUrl: withLang("da", "/udfordring"),
    },
    5: {
      subject: "Tag det første trin — vi er med dig",
      eyebrow: "DAG 14 · OVER TIL DIG",
      heading: "Tag nu det første trin",
      paragraphs: [
        "Du har idéen, metoden og værktøjerne. Tilbage er kun det vigtigste: at tage det første trin.",
        "Vælg én ting. Sælg den i denne uge. Geninvester roligt. Gentag.",
        "Del gerne din rejse og se andres på TikTok og Instagram (@millionladderapp) — det er sjovere sammen, og du holder lettere momentum.",
      ],
      ctaLabel: "Start udfordringen →",
      ctaUrl: withLang("da", "/udfordring"),
    },
  };
}

/** Bygger en drip-mail (trin 2-5) på det valgte sprog. */
export function buildDripEmail(
  lang: Lang,
  stage: DripStage,
  opts: { unsubscribeUrl: string }
): { subject: string; html: string } {
  const c = dripContent(lang)[stage];
  const unsubPre =
    lang === "en" ? "Don't want these emails? " : "Vil du ikke have flere mails? ";
  const unsubLink = lang === "en" ? "Unsubscribe here." : "Afmeld her.";
  const disclaimer =
    lang === "en"
      ? "Million Ladder is a motivation and decluttering app. Not financial advice, and we promise no financial gain."
      : "Million Ladder er en motivations- og oprydnings-app. Ikke finansiel rådgivning, og vi lover ingen økonomisk gevinst.";

  const paragraphs = c.paragraphs
    .map(
      (p) =>
        `<p style="margin:14px 0 0;color:#c3cad3;font-size:15px;line-height:1.65;">${p}</p>`
    )
    .join("");

  const cta =
    c.ctaLabel && c.ctaUrl
      ? `<tr><td style="padding:24px 32px 6px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <a href="${c.ctaUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#2bd576,#1fa863);color:#05130b;font-size:15px;font-weight:800;text-decoration:none;padding:15px 22px;border-radius:13px;">${c.ctaLabel}</a>
    </td></tr>`
      : "";

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="dark light" />
<title>${c.heading}</title>
</head>
<body style="margin:0;padding:0;background:#04060a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#04060a;padding:28px 14px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0b0f15;border:1px solid #1b212b;border-radius:22px;overflow:hidden;">
  <tr><td style="padding:34px 32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <img src="${LOGO_URL}" width="52" height="52" alt="Million Ladder" style="display:block;border-radius:14px;" />
    <div style="margin-top:22px;color:#2bd576;font-size:11px;font-weight:800;letter-spacing:0.14em;">${c.eyebrow}</div>
    <h1 style="margin:10px 0 0;color:#ffffff;font-size:24px;line-height:1.25;font-weight:800;letter-spacing:-0.02em;">${c.heading}</h1>
    ${paragraphs}
  </td></tr>
  ${cta}
  <tr><td style="padding:26px 32px 30px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="border-top:1px solid #1b212b;padding-top:18px;">
      <p style="margin:0;color:#7b828d;font-size:12px;line-height:1.6;">${disclaimer}</p>
      <p style="margin:12px 0 0;color:#7b828d;font-size:12px;line-height:1.6;">
        ${unsubPre}<a href="${opts.unsubscribeUrl}" style="color:#9aa1ac;text-decoration:underline;">${unsubLink}</a><br/>
        Million Ladder · <a href="${SITE_URL}" style="color:#9aa1ac;text-decoration:none;">millionladder.com</a>
      </p>
    </div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject: c.subject, html };
}
