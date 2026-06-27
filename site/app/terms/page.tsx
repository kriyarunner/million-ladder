import type { Metadata } from "next";
import LegalPage from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Vilkår – Million Ladder",
  description:
    "Vilkår for brug af Million Ladder – en motivations- og oprydnings-app. Ikke finansiel rådgivning.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Vilkår for brug"
      updated="27. juni 2026"
      intro="Disse vilkår gælder for brugen af Million Ladder-appen og millionladder.com. Ved at bruge appen accepterer du vilkårene."
      sections={[
        {
          h: "1. Hvad Million Ladder er",
          p: "Million Ladder er en motivations- og oprydnings-app, der hjælper dig med at registrere dine køb og salg og følge din rejse mod en symbolsk million i 37 trin. Det er et værktøj til struktur, disciplin og underholdning – ikke et finansielt produkt.",
        },
        {
          h: "2. Ingen finansiel rådgivning",
          p: "Appen giver ikke finansiel, investerings-, skatte- eller juridisk rådgivning. Alt indhold er udelukkende til motivation og overblik. Træf altid dine egne beslutninger, eventuelt med hjælp fra en kvalificeret rådgiver.",
        },
        {
          h: "3. Intet løfte om gevinst",
          p: "Vi garanterer ingen indtjening eller resultater. Konceptet “37 trin til en million” er et mål og en udfordring – ikke et løfte. Dine resultater afhænger udelukkende af dine egne handler og beslutninger.",
        },
        {
          h: "4. Dit ansvar",
          p: "Du er selv ansvarlig for dine køb, salg, prissætning, skat og for at overholde gældende lovgivning. Sælg kun ting, du lovligt må sælge, og handl ansvarligt og ærligt.",
        },
        {
          h: "5. Ansvarsfraskrivelse",
          p: "Appen leveres “som den er” uden garantier af nogen art. I det omfang loven tillader det, er vi ikke ansvarlige for tab, manglende fortjeneste eller skader, der måtte opstå som følge af brugen af appen.",
        },
        {
          h: "6. Dine data",
          p: "Appen fungerer offline, og dine data gemmes lokalt på din enhed. Læs mere i vores Privatlivspolitik.",
        },
        {
          h: "7. Ændringer",
          p: "Vi kan opdatere disse vilkår fra tid til anden. Væsentlige ændringer offentliggøres på denne side.",
        },
        {
          h: "8. Lovvalg",
          p: "Vilkårene er underlagt dansk ret.",
        },
      ]}
    />
  );
}
