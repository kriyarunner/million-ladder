import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
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
    "Ryd op, sælg og geninvester dig op ad trappen. Million Ladder viser altid dit næste trin på vejen mod en million. Gratis. Offline. Årets challenge.",
  applicationName: "Million Ladder",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Million Ladder",
    title: "Million Ladder — 37 handler til en million",
    description:
      "Det kræver kun 37 smarte handler at gå fra 0 til 1.000.000 kr. Følg trappen. Tag challengen.",
    url: "https://millionladder.com/",
    locale: "da_DK",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Million Ladder — 37 handler til en million",
    description:
      "Det kræver kun 37 smarte handler at gå fra 0 til 1.000.000 kr.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06120c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body className={`${manrope.className} ${display.variable}`}>{children}</body>
    </html>
  );
}
