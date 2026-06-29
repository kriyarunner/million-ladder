# Million Ladder — agent-kontekst

**Læs `HANDOVER.md` i repo-roden først.** Den indeholder fuld projekt-status:
struktur, vigtige filer, build-kommandoer, infrastruktur og åbne opgaver.
For iPhone-build: `MAC_SETUP.md`.

## Hurtigt overblik
- **App:** `app/` (Flutter, Android-build på PC, iOS på Mac). Offline-only mobilapp.
- **Web:** `site/` (Next.js → Vercel ved push til `main`). Domæne: millionladder.com.
- **Prototyper:** `prototype/`. Gammel statisk side `web/` er ikke i brug.

## Ufravigelige regler (MÅ IKKE brydes uden aftale)
- Appen er **100% offline** — ingen server, login eller netværkskald. Data i `shared_preferences`.
- **Ingen lyd** (kun haptik). **Ingen push-notifikationer.**
- **Aldrig fake data** i appen (bruger-/downloadtal hører til på web/TikTok når de er reelle).
- Streaks/momentum framet som **disciplin, ikke skyld**.
- Ikke finansiel rådgivning — bevar disclaimers + `/terms`, `/privacy`.
- UI-tekst på **dansk** (EN via i18n i `app/lib/i18n.dart`).

## Build (Windows PowerShell — brug `;` + `if ($?)`, IKKE `&&`)
```powershell
# App (fra app/):  flutter analyze;  flutter build apk --release; if ($?) { flutter install }
# Web (fra site/): npm run dev   |   npm run build   |   git push -> Vercel deployer
```
Build/install og `git push` kræver brugerens godkendelse.
