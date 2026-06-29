import type { Lang } from "./i18n";

export type Day = { d: number; title: string; task: string };
export type Week = { n: number; focus: string; intro: string; days: Day[] };

const WEEKS_DA: Week[] = [
  {
    n: 1,
    focus: "Kom godt i gang",
    intro:
      "Den første uge handler ikke om store beløb. Den handler om at komme i gang og mærke, at det faktisk kan lade sig gøre.",
    days: [
      { d: 1, title: "Find én ting", task: "Gå gennem ét rum og find én ting, du ikke har brugt det seneste år." },
      { d: 2, title: "Sæt en ærlig pris", task: "Tjek hvad lignende ting sælges for, og vælg en realistisk pris." },
      { d: 3, title: "Tag gode billeder", task: "Dagslys, ren baggrund, 3–4 vinkler. Gode billeder sælger for dig." },
      { d: 4, title: "Læg den til salg", task: "Vælg én platform og skriv en kort, ærlig beskrivelse." },
      { d: 5, title: "Dit første salg", task: "Svar hurtigt og venligt på henvendelser, og luk handlen i ro." },
      { d: 6, title: "Geninvestér bevidst", task: "Læg gevinsten til side til næste handel i stedet for at bruge den." },
      { d: 7, title: "Log og se trappen", task: "Registrér handlen i Million Ladder og se dit første trin." },
    ],
  },
  {
    n: 2,
    focus: "Byg systemet",
    intro:
      "Nu gør vi det nemt at gentage. Et lille system slår motivation, fordi det virker selv på de dage, hvor du ikke gider.",
    days: [
      { d: 8, title: "Find tre ting mere", task: "Saml en lille bunke, så du altid har noget klar til salg." },
      { d: 9, title: "Lær din platform", task: "Find ud af, hvor netop dine ting sælger bedst." },
      { d: 10, title: "Skriv en skabelon", task: "En kort standardtekst, du kan genbruge til dine opslag." },
      { d: 11, title: "Prissætning der virker", task: "Læg dig lidt over din mindstepris, så der er plads til at forhandle." },
      { d: 12, title: "Rolig forhandling", task: "Bestem din mindstepris på forhånd, og hold fast uden stress." },
      { d: 13, title: "Nem levering", task: "Aftal afhentning eller fast forsendelse, så det er let hver gang." },
      { d: 14, title: "Ugens overblik", task: "Se din fremgang, og ros dig selv for vanen — ikke kun beløbet." },
    ],
  },
  {
    n: 3,
    focus: "Find mere værdi",
    intro:
      "De fleste hjem gemmer på mere værdi, end man tror. I denne uge leder vi systematisk efter den.",
    days: [
      { d: 15, title: "Elektronik", task: "Gamle telefoner, kabler og høretelefoner ligger ofte og samler støv." },
      { d: 16, title: "Tøj & sko", task: "Tag det, du ikke har brugt i et år, og saml det til salg." },
      { d: 17, title: "Møbler & ting", task: "En enkelt større ting kan løfte dig flere trin på én gang." },
      { d: 18, title: "Det glemte", task: "Kig i skuffer, kælder og på loft efter oversete værdier." },
      { d: 19, title: "Køb for at sælge", task: "Prøv én lille, sikker handel: køb billigt, sælg lidt dyrere." },
      { d: 20, title: "Forstå ROI", task: "Læg mærke til din fortjeneste i procent, ikke kun i kroner." },
      { d: 21, title: "Ugens overblik", task: "Hvilke kategorier gav mest? Gør mere af det, der virker." },
    ],
  },
  {
    n: 4,
    focus: "Disciplin & momentum",
    intro:
      "Resultater kommer af at blive ved — også når det er stille. Denne uge styrker vanen frem for at jagte det store spring.",
    days: [
      { d: 22, title: "Hold din streak", task: "Lav én lille handling i dag — også selvom den er lille." },
      { d: 23, title: "Undgå impulskøb", task: "Spørg dig selv: bringer det her mig op eller ned ad trappen?" },
      { d: 24, title: "Geninvestér konsekvent", task: "Behold gevinsten i systemet, ikke i hverdagen." },
      { d: 25, title: "Ryd op i opslag", task: "Opdatér eller fjern det, der ikke er solgt endnu." },
      { d: 26, title: "Fejr en milepæl", task: "Du er forbi en fjerdedel. Læg mærke til, hvor lidt der skulle til." },
      { d: 27, title: "Del din rejse", task: "Vis ét ærligt trin frem — til en ven eller på TikTok." },
      { d: 28, title: "Ugens overblik", task: "Mærk forskellen fra dag 1. Vanen er ved at sidde fast." },
    ],
  },
  {
    n: 5,
    focus: "Skalér & planlæg",
    intro:
      "Den sidste uge handler om at hæve niveauet roligt og lægge en plan, der holder længere end udfordringen.",
    days: [
      { d: 29, title: "En lidt større handel", task: "Tør at tage én handel et niveau op end normalt." },
      { d: 30, title: "Sæt din drøm", task: "Vælg et konkret mål, der betyder noget for dig." },
      { d: 31, title: "Tålmodighed betaler sig", task: "Vent på den rigtige køber frem for at sælge for billigt." },
      { d: 32, title: "Forbedr dine opslag", task: "Bedre titler og billeder giver bedre priser." },
      { d: 33, title: "Gentag det der virker", task: "Dobbelt op på din bedste kategori." },
      { d: 34, title: "Hold tempoet", task: "Små, faste handlinger slår store spring, der ikke holder." },
      { d: 35, title: "Se hvor langt du er", task: "Kig på trappen og hvor få trin, der egentlig er tilbage." },
      { d: 36, title: "Del dit resultat", task: "Et ærligt før/efter motiverer andre — og dig selv." },
      { d: 37, title: "Planlæg de næste 37", task: "Vanen er bygget. Sæt kursen mod din næste milepæl." },
    ],
  },
];

const WEEKS_EN: Week[] = [
  {
    n: 1,
    focus: "Get going",
    intro:
      "The first week isn't about big amounts. It's about getting started and feeling that it's actually doable.",
    days: [
      { d: 1, title: "Find one thing", task: "Walk through one room and find one thing you haven't used in the past year." },
      { d: 2, title: "Set an honest price", task: "Check what similar items sell for and pick a realistic price." },
      { d: 3, title: "Take good photos", task: "Daylight, clean background, 3–4 angles. Good photos sell for you." },
      { d: 4, title: "List it for sale", task: "Pick one platform and write a short, honest description." },
      { d: 5, title: "Your first sale", task: "Reply quickly and kindly to messages, and close the deal calmly." },
      { d: 6, title: "Reinvest on purpose", task: "Set the profit aside for the next step instead of spending it." },
      { d: 7, title: "Log it and see the ladder", task: "Record it in Million Ladder and see your first step." },
    ],
  },
  {
    n: 2,
    focus: "Build the system",
    intro:
      "Now we make it easy to repeat. A small system beats motivation, because it works even on the days you don't feel like it.",
    days: [
      { d: 8, title: "Find three more things", task: "Gather a small pile so you always have something ready to sell." },
      { d: 9, title: "Learn your platform", task: "Figure out where your kind of items sell best." },
      { d: 10, title: "Write a template", task: "A short, reusable blurb for your listings." },
      { d: 11, title: "Pricing that works", task: "Set it a little above your floor price, so there's room to negotiate." },
      { d: 12, title: "Calm negotiation", task: "Decide your floor price in advance, and hold it without stress." },
      { d: 13, title: "Easy handover", task: "Agree on pickup or a standard shipping option, so it's easy every time." },
      { d: 14, title: "Week in review", task: "Look at your progress, and praise yourself for the habit — not just the amount." },
    ],
  },
  {
    n: 3,
    focus: "Find more value",
    intro:
      "Most homes hold more value than you think. This week we hunt for it systematically.",
    days: [
      { d: 15, title: "Electronics", task: "Old phones, cables and headphones often just sit there gathering dust." },
      { d: 16, title: "Clothes & shoes", task: "Take what you haven't worn in a year and gather it to sell." },
      { d: 17, title: "Furniture & bigger items", task: "A single larger item can lift you several steps at once." },
      { d: 18, title: "The forgotten stuff", task: "Check drawers, the basement and the attic for overlooked value." },
      { d: 19, title: "Buy to sell", task: "Try one small, safe step: buy cheap, sell a little higher." },
      { d: 20, title: "Understand ROI", task: "Notice your profit as a percentage, not just in cash." },
      { d: 21, title: "Week in review", task: "Which categories paid off most? Do more of what works." },
    ],
  },
  {
    n: 4,
    focus: "Discipline & momentum",
    intro:
      "Results come from sticking with it — even when it's quiet. This week strengthens the habit instead of chasing the big leap.",
    days: [
      { d: 22, title: "Keep your streak", task: "Do one small action today — even if it's tiny." },
      { d: 23, title: "Avoid impulse buys", task: "Ask yourself: does this take me up or down the ladder?" },
      { d: 24, title: "Reinvest consistently", task: "Keep the profit in the system, not in everyday spending." },
      { d: 25, title: "Tidy your listings", task: "Update or remove what hasn't sold yet." },
      { d: 26, title: "Celebrate a milestone", task: "You're past a quarter. Notice how little it took." },
      { d: 27, title: "Share your journey", task: "Show one honest step — to a friend or on TikTok." },
      { d: 28, title: "Week in review", task: "Feel the difference from day 1. The habit is starting to stick." },
    ],
  },
  {
    n: 5,
    focus: "Scale & plan",
    intro:
      "The last week is about calmly raising the level and making a plan that outlasts the challenge.",
    days: [
      { d: 29, title: "A slightly bigger step", task: "Dare to take one step a level up from your usual." },
      { d: 30, title: "Set your dream", task: "Pick a concrete goal that means something to you." },
      { d: 31, title: "Patience pays off", task: "Wait for the right buyer instead of selling too cheap." },
      { d: 32, title: "Improve your listings", task: "Better titles and photos mean better prices." },
      { d: 33, title: "Repeat what works", task: "Double down on your best category." },
      { d: 34, title: "Keep the pace", task: "Small, steady actions beat big leaps that don't last." },
      { d: 35, title: "See how far you've come", task: "Look at the ladder and how few steps are actually left." },
      { d: 36, title: "Share your result", task: "An honest before/after motivates others — and you." },
      { d: 37, title: "Plan the next 37", task: "The habit is built. Set course for your next milestone." },
    ],
  },
];

export function getWeeks(lang: Lang): Week[] {
  return lang === "en" ? WEEKS_EN : WEEKS_DA;
}

export const resetConfirm: Record<Lang, string> = {
  da: "Nulstil din fremgang? Det kan ikke fortrydes.",
  en: "Reset your progress? This can't be undone.",
};
