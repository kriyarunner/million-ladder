import type { Metadata } from "next";
import Simulator from "@/components/Simulator";

export const metadata: Metadata = {
  title: "The ladder calculator — How few steps does it take? | Million Ladder",
  description:
    "See how fast small steps can build up when you reinvest the profit. A simple, honest calculation — not a promise of returns.",
  alternates: {
    canonical: "https://millionladder.com/en/simulator",
    languages: {
      "da-DK": "https://millionladder.com/simulator",
      en: "https://millionladder.com/en/simulator",
      "x-default": "https://millionladder.com/simulator",
    },
  },
  openGraph: {
    title: "How few steps does it take? — Million Ladder",
    description:
      "Move the numbers and see the power of reinvesting, step by step.",
    url: "https://millionladder.com/en/simulator",
    locale: "en_US",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function SimulatorPage() {
  return <Simulator lang="en" />;
}
