import type { Metadata } from "next";
import LegalPage from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privatliv – Million Ladder",
  description:
    "Privatlivspolitik for Million Ladder. Appen er offline – dine data forlader aldrig din enhed.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privatlivspolitik"
      updated="27. juni 2026"
      intro="Vi indsamler så lidt som overhovedet muligt. Million Ladder er bygget til at fungere offline, så dine data forbliver på din egen enhed."
      sections={[
        {
          h: "1. Appen er offline",
          p: "Alle dine data – handler, indskud og fremskridt – gemmes udelukkende lokalt på din enhed. Vi indsamler, sender eller opbevarer ingen personlige data fra appen.",
        },
        {
          h: "2. Ingen konto",
          p: "Du behøver ikke oprette en konto eller afgive personlige oplysninger for at bruge appen.",
        },
        {
          h: "3. Ingen reklamer eller tracking",
          p: "Appen indeholder ingen reklamer, analyseværktøjer eller tredjeparts-trackere.",
        },
        {
          h: "4. Websitet",
          p: "Hvis du tilmelder dig launch-besked med din e-mail, bruger vi den udelukkende til at give dig besked, når appen lanceres – intet andet. Vores hosting kan behandle almindelige server-logs (fx IP-adresse) til drift og sikkerhed.",
        },
        {
          h: "5. Slet dine data",
          p: "Du kan til enhver tid slette alle dine data via “Nulstil rejse” i appen, eller ved at afinstallere appen.",
        },
        {
          h: "6. Børn",
          p: "Appen er ikke rettet mod børn under 13 år.",
        },
        {
          h: "7. Kontakt",
          p: "Har du spørgsmål om privatliv, er du velkommen til at kontakte os.",
        },
      ]}
    />
  );
}
