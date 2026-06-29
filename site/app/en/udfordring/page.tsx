import type { Metadata } from "next";
import Challenge from "@/components/Challenge";

export const metadata: Metadata = {
  title: "The 37-day challenge — Million Ladder",
  description:
    "A free, calm day-by-day program: start with something you already own and build the habit that lifts you up the ladder. 37 days, 37 small steps. No login, no promises of fast money.",
  alternates: {
    canonical: "https://millionladder.com/en/udfordring",
    languages: {
      "da-DK": "https://millionladder.com/udfordring",
      en: "https://millionladder.com/en/udfordring",
      "x-default": "https://millionladder.com/udfordring",
    },
  },
  openGraph: {
    title: "The 37-day challenge — Million Ladder",
    description:
      "37 days, 37 small steps. Build the habit behind Million Ladder, one calm step at a time.",
    url: "https://millionladder.com/en/udfordring",
    locale: "en_US",
    type: "website",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "The 37-day Million Ladder challenge",
  description:
    "A free day-by-day program that builds the habit behind Million Ladder: start with something you own, sell, reinvest and climb the ladder.",
  totalTime: "P37D",
  inLanguage: "en",
  step: [
    { "@type": "HowToStep", name: "Find one thing", position: 1 },
    { "@type": "HowToStep", name: "Set an honest price", position: 2 },
    { "@type": "HowToStep", name: "List it for sale", position: 3 },
    { "@type": "HowToStep", name: "Reinvest the profit", position: 4 },
  ],
};

export default function UdfordringPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Challenge lang="en" />
    </>
  );
}
