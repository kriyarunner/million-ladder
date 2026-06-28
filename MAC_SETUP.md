# Million Ladder — iPhone-build på Mac (cold start)

Denne guide er til en Cursor-agent (eller dig) på en **Mac**, der skal hente projektet fra
GitHub og bygge appen på en **fysisk iPhone** for første gang.

- **Repo:** https://github.com/kriyarunner/million-ladder
- **Flutter-projektet ligger i mappen `app/`** (ikke i roden)
- **Bundle ID:** `com.millionladder.millionLadder`
- **Web (`site/`) deployes automatisk af Vercel — rør den ikke for iPhone-build**

---

## 0. Forudsætninger (cold start — installeres én gang)

```bash
# Xcode: installér fra App Store (stor download). Derefter:
sudo xcodebuild -license accept
xcode-select --install            # command line tools (hvis ikke allerede)

# Homebrew (hvis ikke installeret): https://brew.sh
# CocoaPods + Flutter:
brew install cocoapods
brew install --cask flutter        # eller manuel SDK fra flutter.dev

flutter doctor                     # ret alt der vises med [✗]
```

## 1. Hent projektet

```bash
git clone https://github.com/kriyarunner/million-ladder.git
cd million-ladder/app
flutter pub get
```

## 2. iOS-ikoner + pods

```bash
dart run flutter_launcher_icons   # regenererer app-ikon (grøn + guld M)
cd ios && pod install && cd ..
```

## 3. Signering (kræves for fysisk iPhone)

```bash
open ios/Runner.xcworkspace        # ÅBN .xcworkspace, IKKE .xcodeproj
```

I Xcode:
1. Vælg **Runner** i venstre panel → fanen **Signing & Capabilities**.
2. Sæt flueben i **Automatically manage signing**.
3. Vælg dit **Team** (log ind med din Apple ID under Xcode → Settings → Accounts).
4. Bundle ID er `com.millionladder.millionLadder`. Hvis Xcode klager over at det er
   optaget, tilføj et suffix, fx `com.<ditnavn>.millionLadder`.

> Gratis Apple ID virker fint til test, men app'en udløber efter **7 dage** og skal
> bygges igen. Et betalt Developer-program (99 USD/år) fjerner den grænse + giver TestFlight.

## 4. Forbered iPhonen

1. Tilslut iPhone via USB, lås op, og tryk **Trust / Stol på denne computer**.
2. På iPhone: **Indstillinger → Privatliv & sikkerhed → Udviklertilstand (Developer Mode) → TIL**
   → genstart telefonen (kræves på iOS 16+).
3. Bekræft at Flutter ser den:

```bash
flutter devices
```

## 5. Byg og kør på iPhone

```bash
# Debug (hurtigt, til test):
flutter run -d <iphone-id-fra-flutter-devices>

# Release (til rigtig test / hurtigere app):
flutter run --release -d <iphone-id>
```

Første gang på telefonen: gå til **Indstillinger → Generelt → VPN & enhedsadministration**
og **stol på** din udvikler-profil, ellers vil iOS ikke åbne appen.

---

## Hurtig tjekliste hvis noget fejler
- `flutter doctor` skal være grøn for Xcode + CocoaPods.
- Byg ALTID via `ios/Runner.xcworkspace` (ikke `.xcodeproj`).
- Hvis pods driller: `cd ios && pod repo update && pod install`.
- Hvis signering fejler: skift bundle-id til noget unikt under dit eget team.
- Appen er **offline-only** — ingen API-nøgler eller `.env` nødvendige for at bygge.
