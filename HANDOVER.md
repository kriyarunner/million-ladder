# Million Ladder — Handover (alt en ny agent skal vide)

Sidst opdateret: 2026-06-29. Læs denne fil først. Detaljer om iPhone-build: se `MAC_SETUP.md`.

## Hvad er det
En **offline-only, gratis** mobilapp (Flutter) der motiverer folk til at rydde op, sælge
ting de ikke bruger, og geninvestere op ad en "trappe" fra 0 til 1.000.000 kr. på **37 trin**.
Tænkt som en viral **#MillionLadderChallenge** (TikTok/Instagram: `@millionladderapp`).
Hjemmeside + venteliste: **millionladder.com**.

## Kerneprincipper (MÅ IKKE brydes uden aftale)
- **100% offline** i appen — ingen server, ingen login, ingen netværkskald. Data i `shared_preferences`.
- **Gratis** (plan: evt. 0,99 efter trækkraft — ikke implementeret).
- **Ingen lyd.** Kun haptik.
- **Ingen push-notifikationer.**
- **Aldrig fake data.** Rigtige bruger-/downloadtal hører hjemme på web/TikTok, ikke i appen,
  før vi reelt har tallene.
- Streaks/momentum framet som **disciplin, ikke skyld/stress**.
- Vi er en **motivations- og oprydnings-app**, ikke finansiel rådgivning (se disclaimers + `/terms`, `/privacy`).
- Hold appen **simpel og billig at vedligeholde**.

## Repo-struktur (`c:\Million LADDER`, GitHub: kriyarunner/million-ladder)
- `app/` — **Flutter-appen** (det vigtigste). Build til Android her.
- `site/` — **Next.js-siden** (millionladder.com), deployes automatisk af **Vercel** ved push til `main`.
- `prototype/` — HTML-prototyper. `prototype/design-improvements.html` = interaktiv Før/Efter design-preview.
- `web/` — gammel statisk coming-soon (ikke i brug; siten er `site/`).
- `MAC_SETUP.md` — iPhone-build på Mac (cold start).
- `Million_Ladder_PRD_v0.1.md` — produktbeskrivelse.

## App — vigtige filer (`app/lib/`)
- `main.dart` — entry, theme (font: Manrope), `revealStep()` (fejringer: milepæl/mega-jump/drøm/near-miss + deling), toasts, globale keys.
- `app_state.dart` — al state + beregninger: `kLadder` (37 trin), `curStep`, `capital`, `cashOnHand`, streaks, momentum (`actsThisWeek/LastWeek`), drøm, valuta (`gCurrency`), persistence. Global `fmt()`.
- `screens.dart` — alle skærme (Home, Handler, Trappen, Konto), onboarding, tutorial, fejrings-dialoger, widgets (`_GoalCard`, `_Mini`, `_EmptyTradesCta`, `_ProgressBar`, `_MomentumChip`).
- `sheets.dart` — bottom sheets (køb/salg/sæt-til-salg/indskud/hæv/rediger handel+salg/drøm) + `primaryBtn`/`ghostBtn`.
- `i18n.dart` — `Tr`-klasse, DA/EN strenge (`AppLang`).
- `palette.dart` — farver, skygger (`P.e1`/`P.e2`), display-font-konstant (`P.display` = SpaceGrotesk).
- `ui.dart` — `Pressable` (scale-on-tap) + `AnimatedGradientButton`.
- `share_card.dart` — del-kort (`showSharePreview`).

## Feature-status (implementeret)
Trappe (37 trin, fælles), valuta-valg (DA/EN sprog), onboarding (sælg noget / sæt penge ind — med instant
trin-1-gevinst), transaktioner (ind/ud), rediger handel **og** salg, streaks, milepæle m. emojis,
mega-jump-fejring, drøm (CTA ved første milepæl, fejring ved opnåelse, redigerbar), intro-tutorial,
near-miss ("så tæt på" i guld), momentum-indikator (positiv), milepæls-preview på trappen,
"Din stil"-affirmation på Konto, deling ved trin-op/fejringer. **Design-polish (alle 8):** skygger,
tryk-feedback, tabular figures, Space Grotesk display-font, 3-trins progress + glow, near-miss-guld,
animeret gradient-CTA, løftet bg/surface.

## Sådan bygger/kører du (Windows PowerShell)
> PowerShell: brug `;` + `if ($?) { ... }` til at kæde — IKKE `&&`.

```powershell
# App (Android) — fra app/
flutter analyze
flutter build apk --release; if ($?) { flutter install }   # installerer paa tilsluttet telefon (ThinkPhone 25)
```
- iPhone-build: se `MAC_SETUP.md` (Mac kræves).
- Build/install + git push kræver brugerens **godkendelse** (smart-mode).

```powershell
# Web — fra site/
npm run dev      # lokal preview paa http://localhost:3210
npm run build    # validér
# Deploy: git push origin main  ->  Vercel bygger automatisk
```

## Infrastruktur
- **Domæne:** millionladder.com via **Vercel** (root dir = `site`), DNS hos **Hostinger**.
- **Email/venteliste:** Brevo. Env-vars i Vercel: `BREVO_API_KEY`, `BREVO_LIST_ID`. API-routes: `site/app/api/subscribe`, `site/app/api/count`.
- **Socials:** TikTok + Instagram `@millionladderapp`. Mail: millionladder@gmail.com (vises ikke på web).

## Konventioner
- UI-tekst på **dansk** (EN findes via i18n).
- Commits: `feat(app):` / `feat(site):` / `fix:` / `docs:` (kortfattet, dansk ok).
- Test sker på brugerens fysiske Android (ThinkPhone 25) via `flutter install`.

## Åbne opgaver (to-do)
- Profilbillede-PNG (M-logo 400x400) til TikTok/Instagram
- Screenshots + store-tekster (DK/EN) til App Store / Google Play
- TikTok/IG content-plan + #MillionLadderChallenge-regler
- Challenge-mode (valgfri startkapital) + skarpere ShareCard
- iOS-build på Mac (se MAC_SETUP.md)
- Flere sprog (FR/ES/DE/EN) — vent til ~95% klar
- Social proof på web/TikTok når reelle tal findes (ikke fake i app)
- Valgfrit: spejl `/launch`-preview 1:1 med design-ændringerne

## Historik
Tidligere chat-transskriptioner ligger under `agent-transcripts/` (uden for repoet) hvis dybere kontekst er nødvendig.
