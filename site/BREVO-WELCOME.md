# Velkomst-sekvens til Brevo (5 mails)

Den første mail (issue #1) sendes allerede automatisk fra koden
(`app/api/subscribe/route.ts`) i samme sekund en ny kontakt tilmelder sig.
De næste fire opsættes som en **Automation** i Brevo, så de drypper ud over de
første ~2 uger og opbygger tillid (research: lever værdi før du beder om noget).

## Sådan sætter du den op i Brevo
1. Gå til **Automations → Create an automation → Welcome message** (eller "From scratch").
2. **Entry point:** "A contact is added to a list" → vælg din liste (samme `BREVO_LIST_ID`).
3. Tilføj mails med **Wait**-trin imellem (se kadence nedenfor).
4. Indsæt emne + tekst fra hver mail herunder. Brug samme afsender som
   `BREVO_SENDER_EMAIL` (skal være verificeret i Brevo).
5. Aktivér automationen.

> Tip: Hold tonen rolig og ærlig. Ingen løfter om penge — fokus er oprydning,
> disciplin og at tage det næste lille trin.

---

## Mail 1 — sendes automatisk fra koden (dag 0)
**Emne:** Velkommen 🪜 Her er dit første trin
Allerede live via `route.ts`. Byder velkommen, sætter forventning (ugens guide
hver mandag + besked ved launch) og linker til den første guide.

---

## Mail 2 — Værdi (dag 2)
**Emne:** Det første salg er det sværeste — her er hvordan
**Tekst:**
Hej,

De fleste går i stå før det første salg, fordi de ikke ved, hvor de skal starte.
Så lad os gøre det nemt: find ÉN ting i dag, du ikke har brugt det seneste år.

Det behøver ikke være stort. En gammel telefon, et par sko, en bog. Læg den til
side, tag et billede ved et vindue, og skriv en kort, ærlig annonce.

Det er hele bevægelsen i Million Ladder: ét lille trin, du faktisk kan tage i dag.

Vil du have de syv steder i hjemmet, der oftest gemmer på værdi?
👉 https://millionladder.com/blog/find-de-mest-vaerdifulde-ting

— Million Ladder

---

## Mail 3 — Bevis/historie (dag 5)
**Emne:** Hvorfor 37 trin — og ikke "tjen en million"
**Tekst:**
Hej,

"Tjen en million" er umuligt at handle på. "Sælg én ting i dag" er ikke.

Derfor er rejsen delt op i 37 trin. Hvert trin er lille nok til, at du kan se dig
selv tage det — og det er præcis det, der skaber momentum. Ikke viljestyrke, men
en kæde af små, færdige handlinger.

Læs den korte version her:
👉 https://millionladder.com/blog/smaa-skridt-slaar-store-spring

— Million Ladder

---

## Mail 4 — Blød intro til appen (dag 9)
**Emne:** Appen, der altid viser dig dit næste trin
**Tekst:**
Hej,

Når du sælger og geninvesterer, kan det være svært at holde styr på, hvor du er.
Det er det, Million Ladder-appen gør for dig: den viser dig altid præcis, hvad der
skal til for at nå næste trin — og hvor få handler der faktisk er tilbage til toppen.

Den er gratis, 100% offline og kræver ingen konto. Vi siger til, så snart den lander
— du er allerede på listen.

I mellemtiden kan du prøve den gratis 37-dages udfordring:
👉 https://millionladder.com/udfordring

— Million Ladder

---

## Mail 5 — Opfordring + community (dag 14)
**Emne:** Tag det første trin — vi er med dig
**Tekst:**
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

## Løbende: Ugens guide (hver mandag)
Når du udgiver en ny guide (ny post i `lib/posts.ts`), send en kort
broadcast-mail til listen med titel + 1-2 linjers teaser + link. Hold det
kort og konkret — ét fund, ét trick, ét link.
