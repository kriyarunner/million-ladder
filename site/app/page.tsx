import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Million Ladder — Fra 0 til 1.000.000 kr. i 37 handler | Snart her",
  description:
    "Million Ladder er appen der gør din vej til en million konkret: ryd op, sælg, geninvester. Altid dit næste minimums-salg. Snart på iOS & Android. Skriv dig op.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Million Ladder",
  url: "https://millionladder.com/",
  description:
    "Fra 0 til 1.000.000 kr. i 37 handler. Ryd op, sælg og geninvester dig op ad trappen.",
  inLanguage: "da-DK",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ComingSoon />
    </>
  );
}
