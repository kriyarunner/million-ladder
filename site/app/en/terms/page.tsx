import type { Metadata } from "next";
import LegalPage from "../../../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms – Million Ladder",
  description:
    "Terms of use for Million Ladder – a motivation and decluttering app. Not financial advice.",
  alternates: {
    canonical: "https://millionladder.com/en/terms",
    languages: {
      "da-DK": "https://millionladder.com/terms",
      en: "https://millionladder.com/en/terms",
      "x-default": "https://millionladder.com/terms",
    },
  },
  openGraph: {
    title: "Terms – Million Ladder",
    description:
      "Terms of use for Million Ladder – a motivation and decluttering app. Not financial advice.",
    url: "https://millionladder.com/en/terms",
    locale: "en_US",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      lang="en"
      title="Terms of use"
      updated="27 June 2026"
      intro="These terms apply to the use of the Million Ladder app and millionladder.com. By using the app, you accept these terms."
      sections={[
        {
          h: "1. What Million Ladder is",
          p: "Million Ladder is a motivation and decluttering app that helps you record your buys and sales and follow your journey toward a symbolic million in 37 steps. It is a tool for structure, discipline and entertainment – not a financial product.",
        },
        {
          h: "2. No financial advice",
          p: "The app does not provide financial, investment, tax or legal advice. All content is for motivation and overview only. Always make your own decisions, with help from a qualified advisor where needed.",
        },
        {
          h: "3. No promise of profit",
          p: "We guarantee no earnings or results. The concept of “37 steps to a million” is a goal and a challenge – not a promise. Your results depend entirely on your own steps and decisions.",
        },
        {
          h: "4. Your responsibility",
          p: "You are responsible for your own buys, sales, pricing, taxes and for complying with applicable law. Only sell items you are legally allowed to sell, and trade responsibly and honestly.",
        },
        {
          h: "5. Disclaimer of liability",
          p: "The app is provided “as is” without warranties of any kind. To the extent permitted by law, we are not liable for any loss, lost profit or damages arising from your use of the app.",
        },
        {
          h: "6. Your data",
          p: "The app works offline, and we never ask for your name or email — you stay anonymous. Read more in our Privacy Policy.",
        },
        {
          h: "7. Changes",
          p: "We may update these terms from time to time. Material changes will be published on this page.",
        },
        {
          h: "8. Governing law",
          p: "These terms are governed by Danish law.",
        },
      ]}
    />
  );
}
