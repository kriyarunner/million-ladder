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
