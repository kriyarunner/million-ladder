import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { cookies, headers } from "next/headers";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import SignupModalProvider from "@/components/SignupModal";
import { currencyFromCode, defaultCurrencyForLang } from "@/lib/currency";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://millionladder.com"),
  title: "Million Ladder — Fra 0 til 1.000.000 kr. i 37 handler",
  description:
    "Hvem vil ikke være millionær? Ryd op, sælg og geninvester dig op ad trappen — Million Ladder viser altid dit næste trin mod 1.000.000. Gratis. Offline. 2026's vildeste pengeudfordring.",
  applicationName: "Million Ladder",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Million Ladder",
    title: "Million Ladder — 37 handler til en million",
    description:
      "Hvem vil ikke være millionær? Det kræver kun 37 smarte handler at gå fra 0 til 1.000.000 kr. Tag udfordringen.",
    url: "https://millionladder.com/",
    locale: "da_DK",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    // Kun korttype her – titel/beskrivelse/billede arves pr. side fra og:* (lokaliseret).
    card: "summary_large_image",
  },
  icons: {
    icon: [
      // Google bruger ikke favicons under 48px – derfor angives 96/48 først, så
      // søgeresultatet viser M-ikonet i stedet for standard-globussen.
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon-96.png", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06120c",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://millionladder.com/#org",
      name: "Million Ladder",
      url: "https://millionladder.com",
      logo: "https://millionladder.com/icon-512.png",
      sameAs: [
        "https://www.tiktok.com/@millionladderapp",
        "https://www.instagram.com/millionladderapp",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://millionladder.com/#website",
      name: "Million Ladder",
      url: "https://millionladder.com",
      inLanguage: "da-DK",
      publisher: { "@id": "https://millionladder.com/#org" },
    },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const lang = h.get("x-ml-lang") === "en" ? "en" : "da";
  const c = await cookies();
  const savedCcy = c.get("ml_ccy")?.value;
  const initialCcy = savedCcy
    ? currencyFromCode(savedCcy).code
    : defaultCurrencyForLang(lang).code;
  return (
    <html lang={lang}>
      <body className={`${manrope.className} ${display.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CurrencyProvider initialCode={initialCcy}>
          <SignupModalProvider>{children}</SignupModalProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
