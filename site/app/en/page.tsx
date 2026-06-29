import type { Metadata } from "next";
import Landing from "@/components/Landing";

export const metadata: Metadata = {
  title: "Million Ladder — From 0 to a million in 37 steps",
  description:
    "Who doesn't want to be a millionaire? Declutter, sell and reinvest your way up the ladder — Million Ladder always shows your next step toward a million. Free. Offline. For iOS & Android.",
  alternates: {
    canonical: "https://millionladder.com/en",
    languages: {
      "da-DK": "https://millionladder.com/",
      en: "https://millionladder.com/en",
      "x-default": "https://millionladder.com/",
    },
  },
  openGraph: {
    title: "Million Ladder — From 0 to a million in 37 steps",
    description:
      "Who doesn't want to be a millionaire? Declutter, sell and reinvest your way up the ladder. Million Ladder always shows your next step toward a million.",
    url: "https://millionladder.com/en",
    locale: "en_US",
    type: "website",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Million Ladder",
  operatingSystem: "iOS, Android",
  applicationCategory: "FinanceApplication",
  description:
    "From 0 to a million in 37 steps. Declutter, sell and reinvest your way up the ladder. Always your next step.",
  url: "https://millionladder.com/en",
  inLanguage: "en",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": "https://millionladder.com/#org" },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Landing lang="en" />
    </>
  );
}
