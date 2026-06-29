import type { Metadata } from "next";
import Simulator from "@/components/Simulator";

export const metadata: Metadata = {
  title: "Trappe-beregneren — Hvor få handler skal der til? | Million Ladder",
  description:
    "Se hvor hurtigt små handler kan bygge sig op, når du geninvesterer gevinsten. Et enkelt, ærligt regnestykke — ikke et løfte om afkast.",
  alternates: {
    canonical: "https://millionladder.com/simulator",
    languages: {
      "da-DK": "https://millionladder.com/simulator",
      en: "https://millionladder.com/en/simulator",
      "x-default": "https://millionladder.com/simulator",
    },
  },
  openGraph: {
    title: "Hvor få handler skal der til? — Million Ladder",
    description:
      "Skru på tallene og se styrken i at geninvestere, handel for handel.",
    url: "https://millionladder.com/simulator",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function SimulatorPage() {
  return <Simulator />;
}
