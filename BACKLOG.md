# Million Ladder — Opgaveliste / Backlog

Sidst opdateret: 2026-06-30. Liste over hvad vi mangler, idéer og igangværende arbejde.
Status: ☐ ikke startet · ◐ i gang · ☑ færdig

---

## 🔴 Højeste prioritet — mail-system

- ◐ **Fejl: ingen velkomstmail ved gentilmelding** — når man afmelder og tilmelder
  igen (eller har eksisteret før), fjernede vi ikke "blacklist" og sendte ingen
  velkomst. _Fix lavet 2026-06-30: tjekker kontaktens tilstand først, genaktiverer
  altid, og sender velkomst ved ny ELLER gentilmelding. Skal testes live._
- ☐ Bekræft hele kæden live: ny mail → velkomst · afmeld → gentilmeld → velkomst.

## 🟠 Brand & sociale medier

- ☐ **Byg en Facebook-side** for Million Ladder.
- ☐ **Opret profil på X (Twitter)** — `@millionladderapp` (match TikTok/Instagram).
- ☐ Sørg for ens logo/håndtag/bio på alle platforme (TikTok, Instagram, X, Facebook).

## 🟡 Logo som afsender-ikon i mails (Gmail-avatar)

- ☐ **Google Workspace** for `hello@millionladder.com` + M-logo som profilbillede
  (den realistiske, billige vej til logo-avatar i Gmail nu). ~50 kr./bruger/md.
- ☐ Stram **DMARC** fra `p=none` → `p=quarantine` (gratis, bedre levering, krav for BIMI).
- ☐ _Senere:_ **BIMI + VMC-certifikat** (kræver registreret varemærke + ~8–11k kr./år)
  — den "officielle" brand-logo-måde. Vent til vækst/budget.

## 🔵 Juridisk / compliance

- ☐ **GDPR på hjemmesiden** — cookie-/samtykkebanner hvis nødvendigt, opdateret
  privatlivspolitik (dataindsamling via nyhedsbrev/Brevo), tydeligt samtykke ved
  tilmelding, ret til indsigt/sletning. _Løses når vi er færdige med mail-flowet._

## 🧠 Million Ladder Intelligence (data-spor) — langsigtet exit/investor-tese

> To spor: **APP** (produkt + anonym dataopsamling) og **WEB** (marketing + nyhedsbrev).
> Offentligt "hvorfor": gør vejen til en million hurtigere for brugeren (win-win, sandt).
> Internt "hvorfor": opbyg unikt data-aktiv mod salg/investor (kun internt).
> Princip: ærligt men "snug" — privatliv gøres til en synlig feature.

- ◐ **WEB: fjern hårde "100% offline / ingen sporing"-løfter** og indfør privacy-first
  + anonym data-hook i privatlivspolitik/terms. _Lavet 2026-06-30 (afventer din snak)._
- ☐ **APP: onboarding** der ærligt forklarer anonym dataopsamling + win-win + **opt-out**.
- ☐ De 5 🔒-linjer i appen (ingen navn / ingen e-mail / sælger aldrig persondata /
  kun anonyme handelsdata / slå datadeling fra).
- ☐ **Beslut:** Firebase-projekt (nyt dedikeret?), EU-region (eur3), Blaze-plan, samtykke-model.
- ☐ **Byg:** Firebase Anonymous Auth + Firestore offline-sync (appen forbliver offline-first).
- ☐ **Datamodel:** flad `trades`-collection + nye felter (brand, model, kategori, land,
  region, valuta, trin, app-version) + ny capture-UI i appen.
- ☐ `serverTimestamp()` på alle datoer.
- ☐ **Produkt-standardisering + autocomplete** (fases: fri tekst + voksende katalog først).
- ☐ **BigQuery-eksport** til de tunge analyser (top-varer, ROI, prisudvikling, geografi).
- ☐ **GDPR for dataopsamling:** samtykke/opt-out, EU-residency, sletning, ægte anonymisering.
- ☐ Synlig værdi-feature: **"Se hvad der sælger i dit land"** (bedre datakvalitet + sælgbar).

## 🟢 Idéer (udfyldes løbende)

- ☐ _(dine idéer her — skriv dem til mig, så føjer jeg dem ind)_

---

## ☑ Færdigt for nylig

- ☑ Engelsk + dansk version af app/site (i18n) med valutaomskifter.
- ☑ SEO for begge sprog (titler, hreflang, canonical, OG, JSON-LD).
- ☑ Tilmeldingsmodal + delknap i menuen.
- ☑ Brevo-velkomstmail (DA/EN) med adfærdsdesign + sikkert afmeldingslink.
- ☑ Win-back afmeldingsside (DA/EN).
- ☑ Kode-styret velkomst-drip mail 2–5 (dag 2/5/9/14) via daglig cron.
- ☑ Favicon i 48/96px så Google viser M-ikonet i søgeresultater.
