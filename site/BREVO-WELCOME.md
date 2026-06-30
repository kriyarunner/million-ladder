# Velkomst-sekvens i Brevo (DA + EN)

Mail 1 (dag 0) sendes **automatisk fra koden** (`app/api/subscribe/route.ts`) i
samme sekund en ny kontakt tilmelder sig — og den sendes nu på kontaktens sprog
(dansk eller engelsk). Mail 2-5 sættes op som **Automations** i Brevo, så de
drypper ud over de første ~2 uger og opbygger tillid (lever værdi før du beder
om noget).

## Sprog-segmentering (vigtigt)
Hver kontakt tagges automatisk med kontaktfeltet **`LANGUAGE`** = `da` eller `en`
ved tilmelding. Det betyder vi kan sende dansk drip til danskere og engelsk drip
til engelske kontakter.

Vi laver derfor **to automations** på samme liste:
- **Welcome DA** — kører kun videre hvis `LANGUAGE = da`
- **Welcome EN** — kører kun videre hvis `LANGUAGE = en`

### Sådan sætter du én automation op
1. **Automations → Create an automation → From scratch.**
2. **Entry point:** "A contact is added to a list" → vælg din liste (samme `BREVO_LIST_ID`).
3. Tilføj et **Condition**-trin lige efter entry:
   - Welcome DA: betingelse **Contact attribute → LANGUAGE → is → da**.
   - Welcome EN: betingelse **Contact attribute → LANGUAGE → is → en**.
   - Sæt automationen til at **stoppe** for kontakter, der ikke matcher (else-grenen).
4. Tilføj mails med **Wait**-trin imellem (kadence nedenfor: dag 2, 5, 9, 14).
5. Brug samme afsender som `BREVO_SENDER_EMAIL` (`hello@millionladder.com`).
6. Gentag for det andet sprog. Aktivér begge.

> Tip: Hold tonen rolig og ærlig. Ingen løfter om penge — fokus er oprydning,
> disciplin og at tage det næste lille trin.

---

# DANSK drip (LANGUAGE = da)

## Mail 1 — automatisk fra koden (dag 0)
**Emne:** Velkommen 🪜 dit første trin mod en million
Live via `route.ts`. Byder velkommen, sætter forventning og giver ét lille
første trin + link til den første guide.

## Mail 2 — Værdi (dag 2)
**Emne:** Det første salg er det sværeste — her er hvordan
Hej,

De fleste går i stå før det første salg, fordi de ikke ved, hvor de skal starte.
Så lad os gøre det nemt: find ÉN ting i dag, du ikke har brugt det seneste år.

Det behøver ikke være stort. En gammel telefon, et par sko, en bog. Læg den til
side, tag et billede ved et vindue, og skriv en kort, ærlig annonce.

Det er hele bevægelsen i Million Ladder: ét lille trin, du faktisk kan tage i dag.

Vil du have de syv steder i hjemmet, der oftest gemmer på værdi?
👉 https://millionladder.com/blog/find-de-mest-vaerdifulde-ting

— Million Ladder

## Mail 3 — Bevis/historie (dag 5)
**Emne:** Hvorfor 37 trin — og ikke "tjen en million"
Hej,

"Tjen en million" er umuligt at handle på. "Sælg én ting i dag" er ikke.

Derfor er rejsen delt op i 37 trin. Hvert trin er lille nok til, at du kan se dig
selv tage det — og det er præcis det, der skaber momentum. Ikke viljestyrke, men
en kæde af små, færdige handlinger.

Læs den korte version her:
👉 https://millionladder.com/blog/smaa-skridt-slaar-store-spring

— Million Ladder

## Mail 4 — Blød intro til appen (dag 9)
**Emne:** Appen, der altid viser dig dit næste trin
Hej,

Når du sælger og geninvesterer, kan det være svært at holde styr på, hvor du er.
Det er det, Million Ladder-appen gør for dig: den viser dig altid præcis, hvad der
skal til for at nå næste trin — og hvor få handler der faktisk er tilbage til toppen.

Den er gratis og kræver ingen konto. Vi siger til, så snart den lander
— du er allerede på listen.

I mellemtiden kan du prøve den gratis 37-dages udfordring:
👉 https://millionladder.com/udfordring

— Million Ladder

## Mail 5 — Opfordring + community (dag 14)
**Emne:** Tag det første trin — vi er med dig
Hej,

Du har nu fået idéen, metoden og værktøjerne. Tilbage er kun det vigtigste: at
tage det første trin.

Vælg én ting. Sælg den i denne uge. Geninvester roligt. Gentag.

Del gerne din rejse og se andres på TikTok og Instagram (@millionladderapp) —
det er sjovere sammen, og du holder lettere momentum.

Vi glæder os til at følge dig op ad trappen.

— Million Ladder
millionladder.com

---

# ENGLISH drip (LANGUAGE = en)

## Mail 1 — sent automatically from code (day 0)
**Subject:** Welcome 🪜 your first step toward a million
Live via `route.ts`. Welcomes, sets expectations and gives one small first step
+ a link to the first guide.

## Mail 2 — Value (day 2)
**Subject:** The first sale is the hardest — here's how
Hi,

Most people stall before their first sale because they don't know where to begin.
So let's make it easy: find ONE thing today you haven't used in the past year.

It doesn't have to be big. An old phone, a pair of shoes, a book. Set it aside,
snap a photo by a window, and write a short, honest listing.

That's the whole Million Ladder move: one small step you can actually take today.

Want the seven places at home that most often hide value?
👉 https://millionladder.com/en/blog/find-de-mest-vaerdifulde-ting

— Million Ladder

## Mail 3 — Proof/story (day 5)
**Subject:** Why 37 steps — and not "make a million"
Hi,

"Make a million" is impossible to act on. "Sell one thing today" isn't.

That's why the journey is split into 37 steps. Each step is small enough that you
can picture yourself taking it — and that's exactly what builds momentum. Not
willpower, but a chain of small, finished actions.

Read the short version here:
👉 https://millionladder.com/en/blog/smaa-skridt-slaar-store-spring

— Million Ladder

## Mail 4 — Soft intro to the app (day 9)
**Subject:** The app that always shows your next step
Hi,

When you sell and reinvest, it's easy to lose track of where you are. That's what
the Million Ladder app does for you: it always shows exactly what it takes to reach
the next step — and how few moves are actually left to the top.

It's free and needs no account. We'll let you know the moment it
lands — you're already on the list.

In the meantime, try the free 37-day challenge:
👉 https://millionladder.com/en/udfordring

— Million Ladder

## Mail 5 — Call to action + community (day 14)
**Subject:** Take the first step — we're with you
Hi,

You've now got the idea, the method and the tools. All that's left is the most
important part: taking the first step.

Pick one thing. Sell it this week. Reinvest calmly. Repeat.

Share your journey and watch others on TikTok and Instagram (@millionladderapp) —
it's more fun together, and momentum comes easier.

We can't wait to follow you up the ladder.

— Million Ladder
millionladder.com

---

## Løbende: Ugens guide (hver mandag)
Når du udgiver en ny guide (ny post i `lib/posts.ts`), send en kort
broadcast-mail. Lav den **to gange** — én til `LANGUAGE = da` og én til
`LANGUAGE = en` (filtrér på kontaktfeltet) — med titel + 1-2 linjers teaser +
link til den rette sprogversion. Hold det kort: ét fund, ét trick, ét link.
