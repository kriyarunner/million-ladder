import type { Metadata } from "next";
import LegalPage from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privatliv – Million Ladder",
  description:
    "Privatlivspolitik for Million Ladder. Vi beder aldrig om dit navn eller din e-mail i appen — du er anonym.",
  alternates: {
    canonical: "/privacy",
    languages: {
      "da-DK": "https://millionladder.com/privacy",
      en: "https://millionladder.com/en/privacy",
      "x-default": "https://millionladder.com/privacy",
    },
  },
  openGraph: {
    title: "Privatliv – Million Ladder",
    description:
      "Privatlivspolitik for Million Ladder. Vi beder aldrig om dit navn eller din e-mail i appen — du er anonym.",
    url: "https://millionladder.com/privacy",
    locale: "da_DK",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privatlivspolitik"
      updated="30. juni 2026"
      intro="Vi indsamler så lidt som muligt — og aldrig dit navn, din e-mail eller andre personlige oplysninger i appen. Du er anonym."
      sections={[
        {
          h: "1. Du er anonym i appen",
          p: "Du behøver hverken navn, e-mail eller login for at bruge appen. Vi kan ikke identificere dig som person.",
        },
        {
          h: "2. Anonyme handelsdata",
          p: "For at gøre Million Ladder bedre — og hjælpe dig hurtigere mod en million — kan vi indsamle anonyme oplysninger om handler (fx produkttype, pris, kategori og land). Disse data er ikke knyttet til dig og kan ikke føres tilbage til dig som person.",
        },
        {
          h: "3. Ingen reklamer, ingen salg af persondata",
          p: "Appen indeholder ingen reklamer og ingen tredjeparts-reklametrackere. Vi sælger aldrig personlige oplysninger.",
        },
        {
          h: "4. Websitet (nyhedsbrev)",
          p: "Hvis du skriver dig op med din e-mail, bruger vi den udelukkende til nyhedsbrevet og til at give dig besked, når appen lanceres – intet andet. Du kan afmelde når som helst. Vores hosting kan behandle almindelige server-logs (fx IP-adresse) til drift og sikkerhed.",
        },
        {
          h: "5. Slet dine data",
          p: "Du kan til enhver tid slette alle dine data via “Nulstil rejse” i appen, eller ved at afinstallere appen.",
        },
        {
          h: "6. Virksomhedsoverdragelse",
          p: "Hvis Million Ladder fusionerer eller sælges, kan anonyme data indgå i overdragelsen.",
        },
        {
          h: "7. Børn",
          p: "Appen er ikke rettet mod børn under 13 år.",
        },
        {
          h: "8. Kontakt",
          p: "Har du spørgsmål om privatliv, er du velkommen til at kontakte os.",
        },
      ]}
    />
  );
}
