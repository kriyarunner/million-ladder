import type { Metadata } from "next";
import Landing from "@/components/Landing";

// Preview af den fulde landingsside. Holdes ude af Google indtil launch.
export const metadata: Metadata = {
  title: "Million Ladder — Fra 0 til 1.000.000 kr. i 37 handler",
  robots: { index: false, follow: false },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Million Ladder",
  operatingSystem: "iOS, Android",
  applicationCategory: "FinanceApplication",
  description:
    "Fra 0 til 1.000.000 kr. i 37 handler. Ryd op, sælg og geninvester dig op ad trappen. Altid dit næste minimums-salg.",
  url: "https://millionladder.com/",
  inLanguage: "da-DK",
  offers: { "@type": "Offer", price: "0", priceCurrency: "DKK" },
};

export default function LaunchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Landing />
    </>
  );
}
