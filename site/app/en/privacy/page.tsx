import type { Metadata } from "next";
import LegalPage from "../../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy – Million Ladder",
  description:
    "Privacy policy for Million Ladder. The app is offline – your data never leaves your device.",
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
      "Privacy policy for Million Ladder. The app is offline – your data never leaves your device.",
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
      updated="27 June 2026"
      intro="We collect as little as humanly possible. Million Ladder is built to work offline, so your data stays on your own device."
      sections={[
        {
          h: "1. The app is offline",
          p: "All your data – steps, deposits and progress – is stored solely on your device. We collect, send and store no personal data from the app.",
        },
        {
          h: "2. No account",
          p: "You don't need to create an account or hand over personal details to use the app.",
        },
        {
          h: "3. No ads or tracking",
          p: "The app contains no ads, analytics tools or third-party trackers.",
        },
        {
          h: "4. The website",
          p: "If you sign up for launch notifications with your email, we use it only to let you know when the app launches – nothing else. Our hosting may process standard server logs (such as IP address) for operation and security.",
        },
        {
          h: "5. Delete your data",
          p: "You can delete all your data at any time via “Reset journey” in the app, or by uninstalling the app.",
        },
        {
          h: "6. Children",
          p: "The app is not directed at children under 13.",
        },
        {
          h: "7. Contact",
          p: "If you have any questions about privacy, you're welcome to contact us.",
        },
      ]}
    />
  );
}
