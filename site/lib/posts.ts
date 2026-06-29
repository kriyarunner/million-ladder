import type { Lang } from "./i18n";

export type Block =
  | { t: "p"; c: string }
  | { t: "h2"; c: string }
  | { t: "ul"; items: string[] }
  | { t: "quote"; c: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO (YYYY-MM-DD)
  read: string; // fx "5 min"
  tag: string;
  body: Block[];
};

const postsDa: Post[] = [
  {
    slug: "find-de-mest-vaerdifulde-ting",
    title: "Sådan finder du de mest værdifulde ting i dit hjem",
    excerpt:
      "De fleste hjem gemmer på mere værdi, end man tror. Her er de syv steder, det oftest betaler sig at kigge først.",
    date: "2026-06-20",
    read: "5 min",
    tag: "Guide",
    body: [
      { t: "p", c: "Når du begynder at sælge ud af det, du allerede ejer, kan det være svært at vide, hvor du skal starte. Den gode nyhed er, at de fleste hjem gemmer på mere værdi, end man regner med — og den ligger ofte de samme steder. Her er de syv kategorier, det som regel betaler sig at kigge på først." },
      { t: "h2", c: "1. Elektronik du ikke længere bruger" },
      { t: "p", c: "Gamle telefoner, tablets, høretelefoner, opladere og spillekonsoller har ofte en overraskende god andenhåndsværdi. Selv en defekt enhed kan være penge værd som reservedele. Saml det hele ét sted, og tjek hvad lignende modeller sælges for." },
      { t: "h2", c: "2. Tøj og sko af god kvalitet" },
      { t: "p", c: "Mærketøj, sko og tasker, du ikke har brugt det seneste år, sælger fint, hvis de er rene og i god stand. Vær ærlig om slid — det giver tilfredse købere og færre returneringer." },
      { t: "h2", c: "3. Møbler og større ting" },
      { t: "p", c: "En enkelt sofa, et skrivebord eller en cykel kan løfte dig flere trin på én gang. Større ting tager lidt mere arbejde at sælge, men giver til gengæld den største fremgang per handel." },
      { t: "h2", c: "4. Hobby- og samlerting" },
      { t: "p", c: "LEGO, brætspil, bøger, plader, instrumenter og samleobjekter har dedikerede købere, der gerne betaler en fair pris. Niche-ting sælger ofte bedst i grupper og fora for netop den interesse." },
      { t: "h2", c: "5. Værktøj og udstyr" },
      { t: "p", c: "Boremaskiner, havemaskiner, sportsudstyr og køkkenmaskiner, der står ubrugte hen, er nemme at sælge lokalt. Folk leder hele tiden efter velholdt udstyr til en god pris." },
      { t: "h2", c: "6. Det glemte — skuffer, kælder og loft" },
      { t: "p", c: "Kig de steder, du sjældent åbner. Skuffer, kasser i kælderen og ting på loftet er guldgruber for oversete værdier, du for længst har glemt, du havde." },
      { t: "h2", c: "7. Gaver og dubletter" },
      { t: "p", c: "Ubrugte gaver og ting, du har to af, er lette at give slip på. De fylder kun, og de er ofte i ny eller næsten-ny stand — hvilket giver en bedre pris." },
      { t: "quote", c: "Du behøver ikke finde alt på én gang. Find én ting i dag. Det er sådan, momentum starter." },
      { t: "h2", c: "Kom i gang uden at overvælde dig selv" },
      { t: "p", c: "Tag ét rum ad gangen, og sæt en lille bunke til side, du kan sælge i den kommende uge. Når du sælger og geninvesterer roligt, bygger du både kapital og en vane, der holder. Det er hele idéen bag Million Ladder: ét lille trin ad gangen." },
    ],
  },
  {
    slug: "smaa-skridt-slaar-store-spring",
    title: "Derfor slår små skridt store spring",
    excerpt:
      "Store mål mislykkes sjældent på grund af manglende ambition. De mislykkes, fordi springet føles for stort. Her er hvorfor det lille skridt vinder.",
    date: "2026-06-23",
    read: "4 min",
    tag: "Mindset",
    body: [
      { t: "p", c: "En million kroner lyder uoverskueligt. Men de fleste store mål mislykkes ikke på grund af manglende ambition — de mislykkes, fordi det første spring føles for stort til overhovedet at gå i gang. Løsningen er ikke at drømme mindre. Det er at gøre næste skridt mindre." },
      { t: "h2", c: "Hjernen elsker et trin, den kan nå" },
      { t: "p", c: "Når et mål er konkret og lige inden for rækkevidde, er det meget lettere at handle på. \u201eSælg én ting i dag\u201c er noget, du faktisk kan gøre. \u201eTjen en million\u201c er det ikke. Ved at dele rejsen op i 37 trin bliver hvert næste skridt noget, du kan se dig selv tage." },
      { t: "h2", c: "Momentum er stærkere end motivation" },
      { t: "p", c: "Motivation svinger fra dag til dag. Momentum gør ikke. Når du har taget det første lille skridt, er det næste lettere — og det næste igen. Det er ikke viljestyrke, der bærer dig op ad trappen. Det er en kæde af små, færdige handlinger." },
      { t: "quote", c: "Du behøver ikke være hurtig. Du skal bare blive ved med at tage det næste trin." },
      { t: "h2", c: "Små skridt holder, når livet larmer" },
      { t: "p", c: "Store spring kræver perfekte forhold. Små skridt kræver ikke. På en travl dag kan du stadig lægge én ting til salg eller svare en køber. Det er netop derfor, vanen overlever — den passer ind i et almindeligt liv." },
      { t: "h2", c: "Sådan bruger du princippet" },
      { t: "ul", items: ["Gør næste skridt så lille, at du ikke kan sige nej.", "Fejr at du tog skridtet — ikke kun beløbet.", "Geninvestér roligt, så fremgangen bygger på sig selv.", "Mål din uge på handlinger, ikke på humør."] },
      { t: "p", c: "Det er hele filosofien bag Million Ladder. Ikke hurtige penge eller held — bare disciplinen i at tage det næste lille trin, igen og igen." },
    ],
  },
  {
    slug: "billeder-der-saelger",
    title: "Sådan tager du billeder, der sælger",
    excerpt:
      "Gode billeder er den billigste måde at få en bedre pris på. Du behøver ikke et godt kamera — bare et par enkle vaner.",
    date: "2026-06-26",
    read: "4 min",
    tag: "Praktisk",
    body: [
      { t: "p", c: "Når to opslag har samme vare og samme pris, vinder det med de bedste billeder næsten altid. Den gode nyhed: du behøver ikke et dyrt kamera. Din telefon er rigeligt — du skal bare bruge den med omtanke." },
      { t: "h2", c: "Brug dagslys" },
      { t: "p", c: "Tag billederne om dagen ved et vindue. Dagslys er gratis og får farver og detaljer til at fremstå ærligt. Undgå blitz, der laver hårde skygger og får tingene til at se billige ud." },
      { t: "h2", c: "Ryd baggrunden" },
      { t: "p", c: "En ren, neutral baggrund holder fokus på varen. En hvid væg, et bord eller et stykke stof gør underværker. Rod i baggrunden trækker både blikket og prisen ned." },
      { t: "h2", c: "Vis tingen fra flere vinkler" },
      { t: "ul", items: ["Et tydeligt hovedbillede forfra.", "Et par vinkler, der viser formen.", "Et nærbillede af mærke, model eller detaljer.", "Et ærligt billede af eventuelt slid eller fejl."] },
      { t: "quote", c: "Ærlige billeder af slid skaber tillid — og tillid lukker handlen hurtigere." },
      { t: "h2", c: "Hold det skarpt og roligt" },
      { t: "p", c: "Tør linsen af, hold telefonen stille, og tjek at billedet er i fokus, før du lægger op. Et enkelt skarpt billede slår fem slørede hver gang." },
      { t: "h2", c: "Den lille ekstra indsats betaler sig" },
      { t: "p", c: "Fem minutter mere på billederne kan betyde en mærkbart bedre pris og en hurtigere handel. Det er en af de enkleste måder at få mere ud af hvert trin på trappen på." },
    ],
  },
  {
    slug: "ugens-fund-den-glemte-elektronik",
    title: "Den oversete ting i de fleste hjem, der sælger bedst lige nu",
    excerpt:
      "Den ligger i en skuffe hos næsten alle, og den sælger overraskende godt: gammel elektronik. Her er, hvad der er penge værd — og hvordan du får mest for det.",
    date: "2026-06-29",
    read: "5 min",
    tag: "Ugens fund",
    body: [
      { t: "p", c: "Hvis du kun skal kigge ét sted først, så start i skuffen med gammel elektronik. Næsten alle har den — og den sælger overraskende godt, fordi der altid er nogen, der mangler præcis den model, du har lagt væk." },
      { t: "h2", c: "Gamle telefoner er guld" },
      { t: "p", c: "En telefon, du skiftede for et par år siden, har stadig en reel andenhåndsværdi. Selv en med revner i skærmen kan sælges som reservedele. Find opladeren frem, nulstil den, og tag et ærligt billede af både for- og bagside." },
      { t: "h2", c: "Tilbehøret, ingen tænker på" },
      { t: "ul", items: ["Høretelefoner og trådløse propper, du ikke bruger længere.", "Opladere, kabler og adaptere — sælg dem gerne i en samlet pakke.", "Spilcontrollere, gamle konsoller og spil.", "Smartwatches, fitnessbånd og deres remme."] },
      { t: "quote", c: "Det, der bare ligger og fylder hos dig, er præcis det, en anden leder efter lige nu." },
      { t: "h2", c: "Sådan får du mest for det" },
      { t: "p", c: "Slet altid dine data og log ud af konti, før du sælger. Saml tingene ét sted, tjek hvad lignende modeller koster, og vær ærlig om stand. Tillid giver hurtigere handler — og bedre priser." },
      { t: "p", c: "Tag ét kig i den skuffe i dag. Du har sandsynligvis dit næste trin liggende uden at vide det." },
    ],
  },
  {
    slug: "saet-den-rigtige-pris",
    title: "Sådan sætter du den rigtige pris — hver gang",
    excerpt:
      "For høj pris, og ingen skriver. For lav, og du taber penge. Her er en enkel metode til at ramme prisen, der både sælger hurtigt og giver dig mest muligt.",
    date: "2026-07-06",
    read: "5 min",
    tag: "Guide",
    body: [
      { t: "p", c: "Prisen er den enkeltfaktor, der afgør, om din vare sælger i dag eller ligger i ugevis. Sætter du den for højt, skriver ingen. For lavt, og du forærer penge væk. Heldigvis er der en enkel måde at ramme rigtigt." },
      { t: "h2", c: "Start med at undersøge markedet" },
      { t: "p", c: "Søg på din vare, og se hvad lignende ting reelt sælges til — ikke kun hvad de udbydes til. Notér tre priser: den laveste, den typiske og den højeste. Din pris skal ligge et sted mellem den typiske og den høje, hvis din vare er i god stand." },
      { t: "h2", c: "Pris for at sælge, ikke for at vente" },
      { t: "p", c: "Hvis dit mål er momentum op ad trappen, er en hurtig handel ofte mere værd end de sidste 50 kroner. En vare, der sælger på to dage, slår en, der ligger en måned til en lidt højere pris." },
      { t: "ul", items: ["Brug runde, troværdige tal — fx 250 frem for 247.", "Læg lidt luft ind, hvis du forventer at blive budt ned.", "Sæt en samlet pakkepris på små ting, så du slipper for mange handler.", "Sænk prisen lidt efter en uge, hvis der ingen henvendelser er."] },
      { t: "quote", c: "Den bedste pris er ikke den højeste — det er den, der sælger, før du mister gejsten." },
      { t: "h2", c: "Vær klar til at forhandle" },
      { t: "p", c: "De fleste købere byder lidt under. Beslut på forhånd din mindstepris, så du kan svare roligt og hurtigt. Et venligt \u201ejeg kan gå til 200\u201c lukker flere handler end en lang diskussion." },
      { t: "p", c: "Når du gør det her til en vane, bliver hver handel både hurtigere og mere værd — og det er præcis sådan, trappen vokser." },
    ],
  },
  {
    slug: "skriv-en-annonce-der-saelger",
    title: "Skriv en annonce, der sælger på 5 minutter",
    excerpt:
      "En god annonce gør forskellen mellem stilhed og en hurtig handel. Her er den enkle skabelon, du kan genbruge hver gang.",
    date: "2026-07-13",
    read: "4 min",
    tag: "Praktisk",
    body: [
      { t: "p", c: "Du behøver ikke være tekstforfatter for at skrive en annonce, der sælger. Du skal bare give køberen svar på det, de spørger om — hurtigt og ærligt. Her er en skabelon, du kan genbruge hver gang." },
      { t: "h2", c: "Skriv en titel, der er til at søge på" },
      { t: "p", c: "Skriv mærke, model og det vigtigste kendetegn direkte i titlen. Folk søger efter konkrete ord — ikke efter \u201elækker ting sælges\u201c. Jo nemmere du er at finde, jo flere ser din vare." },
      { t: "h2", c: "Fortæl det vigtigste først" },
      { t: "ul", items: ["Hvad er det, og hvilken stand er det i?", "Hvorfor sælger du — kort og ærligt.", "Mål, størrelse eller andre vigtige detaljer.", "Hvordan og hvor handlen kan ske."] },
      { t: "quote", c: "En ærlig annonce sparer jer begge for tid — og giver dig de købere, der rent faktisk vil handle." },
      { t: "h2", c: "Vær ærlig om fejl" },
      { t: "p", c: "Nævn slid og småfejl direkte. Det skaber tillid, færre returneringer og hurtigere handler. Køberen, der ved hvad de får, brokker sig ikke bagefter." },
      { t: "h2", c: "Afslut med et tydeligt næste skridt" },
      { t: "p", c: "Slut af med en venlig opfordring: \u201eSkriv hvis du er interesseret — jeg svarer hurtigt.\u201c Et klart næste skridt gør det nemt for køberen at tage kontakt, og det er der, handlen begynder." },
    ],
  },
];

const postsEn: Post[] = [
  {
    slug: "find-de-mest-vaerdifulde-ting",
    title: "How to find the most valuable things in your home",
    excerpt:
      "Most homes hide more value than you'd think. Here are the seven places it usually pays to look first.",
    date: "2026-06-20",
    read: "5 min",
    tag: "Guide",
    body: [
      { t: "p", c: "When you start selling off what you already own, it can be hard to know where to begin. The good news is that most homes hide more value than you'd expect — and it's usually in the same places. Here are the seven categories it usually pays to look at first." },
      { t: "h2", c: "1. Electronics you no longer use" },
      { t: "p", c: "Old phones, tablets, headphones, chargers and game consoles often have a surprisingly good resale value. Even a broken device can be worth money for parts. Gather it all in one place and check what similar models sell for." },
      { t: "h2", c: "2. Good-quality clothes and shoes" },
      { t: "p", c: "Branded clothes, shoes and bags you haven't used in the past year sell well if they're clean and in good condition. Be honest about wear — it makes for happy buyers and fewer returns." },
      { t: "h2", c: "3. Furniture and larger items" },
      { t: "p", c: "A single sofa, desk or bike can lift you several steps at once. Bigger items take a little more work to sell, but they give you the biggest progress per step." },
      { t: "h2", c: "4. Hobby and collector's items" },
      { t: "p", c: "LEGO, board games, books, records, instruments and collectibles have dedicated buyers who'll happily pay a fair price. Niche items often sell best in groups and forums for that specific interest." },
      { t: "h2", c: "5. Tools and equipment" },
      { t: "p", c: "Drills, garden machines, sports gear and kitchen appliances sitting unused are easy to sell locally. People are always on the lookout for well-kept gear at a good price." },
      { t: "h2", c: "6. The forgotten — drawers, basement and attic" },
      { t: "p", c: "Look in the places you rarely open. Drawers, boxes in the basement and things in the attic are gold mines for overlooked value you forgot you even had." },
      { t: "h2", c: "7. Gifts and duplicates" },
      { t: "p", c: "Unused gifts and things you own two of are easy to let go of. They only take up space, and they're often in new or nearly-new condition — which means a better price." },
      { t: "quote", c: "You don't have to find everything at once. Find one thing today. That's how momentum starts." },
      { t: "h2", c: "Get started without overwhelming yourself" },
      { t: "p", c: "Take one room at a time, and set aside a small pile you can sell in the coming week. When you sell and reinvest calmly, you build both capital and a habit that lasts. That's the whole idea behind Million Ladder: one small step at a time." },
    ],
  },
  {
    slug: "smaa-skridt-slaar-store-spring",
    title: "Why small steps beat big leaps",
    excerpt:
      "Big goals rarely fail for lack of ambition. They fail because the leap feels too big. Here's why the small step wins.",
    date: "2026-06-23",
    read: "4 min",
    tag: "Mindset",
    body: [
      { t: "p", c: "A million sounds overwhelming. But most big goals don't fail for lack of ambition — they fail because the first leap feels too big to even begin. The fix isn't to dream smaller. It's to make your next step smaller." },
      { t: "h2", c: "The brain loves a step it can reach" },
      { t: "p", c: "When a goal is concrete and just within reach, it's far easier to act on. \u201cSell one thing today\u201d is something you can actually do. \u201cEarn a million\u201d isn't. By splitting the journey into 37 steps, each next move becomes something you can picture yourself taking." },
      { t: "h2", c: "Momentum is stronger than motivation" },
      { t: "p", c: "Motivation swings from day to day. Momentum doesn't. Once you've taken the first small step, the next one is easier — and the one after that. It isn't willpower that carries you up the ladder. It's a chain of small, finished actions." },
      { t: "quote", c: "You don't have to be fast. You just have to keep taking the next step." },
      { t: "h2", c: "Small steps survive when life gets noisy" },
      { t: "p", c: "Big leaps need perfect conditions. Small steps don't. On a busy day you can still list one thing or reply to a buyer. That's exactly why the habit survives — it fits into an ordinary life." },
      { t: "h2", c: "How to use the principle" },
      { t: "ul", items: ["Make the next step so small you can't say no.", "Celebrate taking the step — not just the amount.", "Reinvest calmly, so progress builds on itself.", "Measure your week by actions, not by mood."] },
      { t: "p", c: "That's the whole philosophy behind Million Ladder. Not fast money or luck — just the discipline of taking the next small step, again and again." },
    ],
  },
  {
    slug: "billeder-der-saelger",
    title: "How to take photos that sell",
    excerpt:
      "Good photos are the cheapest way to get a better price. You don't need a fancy camera — just a few simple habits.",
    date: "2026-06-26",
    read: "4 min",
    tag: "Practical",
    body: [
      { t: "p", c: "When two listings have the same item at the same price, the one with the best photos almost always wins. The good news: you don't need an expensive camera. Your phone is plenty — you just have to use it with a little care." },
      { t: "h2", c: "Use daylight" },
      { t: "p", c: "Take your photos during the day by a window. Daylight is free and makes colours and details look honest. Avoid flash, which creates harsh shadows and makes things look cheap." },
      { t: "h2", c: "Clear the background" },
      { t: "p", c: "A clean, neutral background keeps the focus on the item. A white wall, a table or a piece of fabric works wonders. Clutter in the background drags down both the eye and the price." },
      { t: "h2", c: "Show the item from several angles" },
      { t: "ul", items: ["One clear main shot from the front.", "A couple of angles that show the shape.", "A close-up of the brand, model or details.", "An honest shot of any wear or flaws."] },
      { t: "quote", c: "Honest photos of wear build trust — and trust closes the deal faster." },
      { t: "h2", c: "Keep it sharp and steady" },
      { t: "p", c: "Wipe the lens, hold the phone still, and check that the shot is in focus before you post. One sharp photo beats five blurry ones every time." },
      { t: "h2", c: "The little extra effort pays off" },
      { t: "p", c: "Five more minutes on the photos can mean a noticeably better price and a faster sale. It's one of the simplest ways to get more out of every step on the ladder." },
    ],
  },
  {
    slug: "ugens-fund-den-glemte-elektronik",
    title: "The overlooked thing in most homes that sells best right now",
    excerpt:
      "It's in a drawer at almost everyone's place, and it sells surprisingly well: old electronics. Here's what's worth money — and how to get the most for it.",
    date: "2026-06-29",
    read: "5 min",
    tag: "Find of the week",
    body: [
      { t: "p", c: "If you only check one place first, start with the drawer full of old electronics. Almost everyone has one — and it sells surprisingly well, because there's always someone who needs exactly the model you put away." },
      { t: "h2", c: "Old phones are gold" },
      { t: "p", c: "A phone you upgraded a couple of years ago still has real resale value. Even one with a cracked screen can sell for parts. Dig out the charger, reset it, and take an honest photo of both the front and the back." },
      { t: "h2", c: "The accessories nobody thinks of" },
      { t: "ul", items: ["Headphones and wireless earbuds you no longer use.", "Chargers, cables and adapters — feel free to sell them as one bundle.", "Game controllers, old consoles and games.", "Smartwatches, fitness bands and their straps."] },
      { t: "quote", c: "What's just sitting there taking up space at your place is exactly what someone else is looking for right now." },
      { t: "h2", c: "How to get the most for it" },
      { t: "p", c: "Always wipe your data and log out of your accounts before you sell. Gather everything in one place, check what similar models go for, and be honest about condition. Trust means faster deals — and better prices." },
      { t: "p", c: "Take a look in that drawer today. You probably have your next step sitting there without knowing it." },
    ],
  },
  {
    slug: "saet-den-rigtige-pris",
    title: "How to set the right price — every time",
    excerpt:
      "Too high, and nobody messages. Too low, and you lose money. Here's a simple method for hitting the price that sells fast and gets you the most.",
    date: "2026-07-06",
    read: "5 min",
    tag: "Guide",
    body: [
      { t: "p", c: "Price is the single factor that decides whether your item sells today or sits for weeks. Set it too high and nobody messages. Too low and you're giving money away. Luckily, there's a simple way to get it right." },
      { t: "h2", c: "Start by checking the market" },
      { t: "p", c: "Search for your item and see what similar things actually sell for — not just what they're listed at. Note three prices: the lowest, the typical and the highest. Your price should sit somewhere between the typical and the high one if your item is in good condition." },
      { t: "h2", c: "Price to sell, not to wait" },
      { t: "p", c: "If your goal is momentum up the ladder, a fast sale is often worth more than squeezing out the last bit of profit. An item that sells in two days beats one that sits for a month at a slightly higher price." },
      { t: "ul", items: ["Use round, believable numbers — e.g. 250 rather than 247.", "Leave a little room if you expect to be haggled down.", "Set a bundle price on small items, so you skip a load of separate deals.", "Drop the price a little after a week if there's no interest."] },
      { t: "quote", c: "The best price isn't the highest — it's the one that sells before you lose your drive." },
      { t: "h2", c: "Be ready to negotiate" },
      { t: "p", c: "Most buyers offer a little under. Decide your floor price in advance, so you can answer calmly and quickly. A friendly \u201cI can do 200\u201d closes more deals than a long discussion." },
      { t: "p", c: "When you make this a habit, every step becomes both faster and more valuable — and that's exactly how the ladder grows." },
    ],
  },
  {
    slug: "skriv-en-annonce-der-saelger",
    title: "Write a listing that sells in 5 minutes",
    excerpt:
      "A good listing is the difference between silence and a fast sale. Here's the simple template you can reuse every time.",
    date: "2026-07-13",
    read: "4 min",
    tag: "Practical",
    body: [
      { t: "p", c: "You don't have to be a copywriter to write a listing that sells. You just have to answer what the buyer is asking — quickly and honestly. Here's a template you can reuse every time." },
      { t: "h2", c: "Write a title people can search for" },
      { t: "p", c: "Put the brand, model and the most important detail right in the title. People search for specific words — not for \u201clovely item for sale\u201d. The easier you are to find, the more people see your item." },
      { t: "h2", c: "Lead with what matters most" },
      { t: "ul", items: ["What is it, and what condition is it in?", "Why are you selling — short and honest.", "Measurements, size or other key details.", "How and where the deal can happen."] },
      { t: "quote", c: "An honest listing saves you both time — and brings you the buyers who actually want to deal." },
      { t: "h2", c: "Be honest about flaws" },
      { t: "p", c: "Mention wear and small faults up front. It builds trust, means fewer returns and faster deals. A buyer who knows what they're getting won't complain later." },
      { t: "h2", c: "End with a clear next step" },
      { t: "p", c: "Finish with a friendly nudge: \u201cMessage me if you're interested — I reply fast.\u201d A clear next step makes it easy for the buyer to reach out, and that's where the deal begins." },
    ],
  },
];

const postsByLang: Record<Lang, Post[]> = { da: postsDa, en: postsEn };

export const upcomingByLang: Record<
  Lang,
  { badge: string; tag: string; title: string; teaser: string }
> = {
  da: {
    badge: "Næste mandag",
    tag: "Ugens fund",
    title: "Sådan forhandler du uden at virke desperat",
    teaser:
      "Hver uge deler vi ét konkret fund eller trick, der faktisk virker. Skriv dig op, så du ikke misser det.",
  },
  en: {
    badge: "Next Monday",
    tag: "Find of the week",
    title: "How to negotiate without seeming desperate",
    teaser:
      "Every week we share one concrete find or trick that actually works. Sign up so you don't miss it.",
  },
};

export function getPosts(lang: Lang): Post[] {
  return postsByLang[lang] ?? postsDa;
}

export function getPost(lang: Lang, slug: string): Post | undefined {
  return getPosts(lang).find((p) => p.slug === slug);
}

/** Alle slugs (samme på tværs af sprog). */
export function allSlugs(): string[] {
  return postsDa.map((p) => p.slug);
}

export function formatDate(iso: string, lang: Lang = "da"): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(lang === "en" ? "en-GB" : "da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
