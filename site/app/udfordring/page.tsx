import type { Metadata } from "next";
import Challenge from "@/components/Challenge";

export const metadata: Metadata = {
  title: "Den 37-dages udfordring — Million Ladder",
  description:
    "Et gratis, roligt dag-for-dag program: start med noget du allerede ejer, og byg vanen der løfter dig op ad trappen. 37 dage, 37 små trin. Ingen login, ingen løfter om hurtige penge.",
  alternates: {
    canonical: "https://millionladder.com/udfordring",
    languages: {
      "da-DK": "https://millionladder.com/udfordring",
      en: "https://millionladder.com/en/udfordring",
      "x-default": "https://millionladder.com/udfordring",
    },
  },
  openGraph: {
    title: "Den 37-dages udfordring — Million Ladder",
    description:
      "37 dage, 37 små trin. Byg vanen bag Million Ladder, ét roligt skridt ad gangen.",
    url: "https://millionladder.com/udfordring",
    type: "website",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Den 37-dages Million Ladder-udfordring",
  description:
    "Et gratis dag-for-dag program der bygger vanen bag Million Ladder: start med noget du ejer, sælg, geninvestér og stig op ad trappen.",
  totalTime: "P37D",
  inLanguage: "da-DK",
  step: [
    { "@type": "HowToStep", name: "Find én ting", position: 1 },
    { "@type": "HowToStep", name: "Sæt en ærlig pris", position: 2 },
    { "@type": "HowToStep", name: "Læg den til salg", position: 3 },
    { "@type": "HowToStep", name: "Geninvestér gevinsten", position: 4 },
  ],
};

export default function UdfordringPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Challenge />
    </>
  );
}
