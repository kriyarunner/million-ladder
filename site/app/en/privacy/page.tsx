import type { Metadata } from "next";
import LegalPage from "../../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy – Million Ladder",
  description:
    "Privacy policy for Million Ladder. The app never asks for your name or email — you stay anonymous.",
  alternates: {
    canonical: "https://millionladder.com/en/privacy",
    languages: {
      "da-DK": "https://millionladder.com/privacy",
      en: "https://millionladder.com/en/privacy",
      "x-default": "https://millionladder.com/privacy",
    },
  },
  openGraph: {
    title: "Privacy – Million Ladder",
    description:
      "Privacy policy for Million Ladder. The app never asks for your name or email — you stay anonymous.",
    url: "https://millionladder.com/en/privacy",
    locale: "en_US",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      lang="en"
      title="Privacy policy"
      updated="30 June 2026"
      intro="We collect as little as possible — and never your name, email or any other personal details in the app. You stay anonymous."
      sections={[
        {
          h: "1. You're anonymous in the app",
          p: "You need no name, email or login to use the app. We cannot identify you as a person.",
        },
        {
          h: "2. Anonymous trade data",
          p: "To make Million Ladder better — and help you reach a million faster — we may collect anonymous information about trades (such as product type, price, category and country). This data is not linked to you and cannot be traced back to you as a person.",
        },
        {
          h: "3. No ads, no selling of personal data",
          p: "The app contains no ads and no third-party advertising trackers. We never sell personal information.",
        },
        {
          h: "4. The website (newsletter)",
          p: "If you sign up with your email, we use it solely for the newsletter and to let you know when the app launches – nothing else. You can unsubscribe at any time. Our hosting may process standard server logs (such as IP address) for operation and security.",
        },
        {
          h: "5. Delete your data",
          p: "You can delete all your data at any time via “Reset journey” in the app, or by uninstalling the app.",
        },
        {
          h: "6. Business transfer",
          p: "If Million Ladder merges or is sold, anonymous data may be included in the transfer.",
        },
        {
          h: "7. Children",
          p: "The app is not directed at children under 13.",
        },
        {
          h: "8. Contact",
          p: "If you have any questions about privacy, you're welcome to contact us.",
        },
      ]}
    />
  );
}
