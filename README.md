# Million Ladder

Et progressionsspil hvor du bygger kapital gennem gode handler og klatrer 37 trin fra 0 kr. mod 1.000.000 kr. Appen er 100% offline (data gemmes lokalt på enheden) og gratis at bruge.

## Indhold

- `app/` – Flutter-appen (Android + iOS)
- `prototype/` – Klikbar HTML-prototype (åbn `prototype/index.html` i en browser)
- `Million_Ladder_PRD_v0.1.md` – Produktvision / PRD

## Koncept

- Start på 0 kr. Vælg at sælge en ting du ejer eller sætte penge ind.
- Trappen har 37 faste kapitaltrin (~20% vækst pr. trin) op til 1.000.000 kr.
- Appen viser altid hvad dit næste salg minimum skal give for at nå næste trin.
- "I kassen" = likvide penge tilbage = kapital minus det der er bundet i aktivt lager.

## Kør / byg appen

Kræver [Flutter](https://docs.flutter.dev/get-started/install) (stable).

```bash
cd app
flutter pub get
flutter run                 # kør på tilsluttet enhed/emulator
```

### Android

```bash
cd app
flutter build apk --release           # build\app\outputs\flutter-apk\app-release.apk
```

### iOS (kræver macOS + Xcode)

```bash
cd app
flutter pub get
cd ios && pod install && cd ..
flutter build ios --release           # åbn derefter ios/Runner.xcworkspace i Xcode for signering
```

## Teknologi

- Flutter (Material 3, mørkt premium-design)
- `provider` (state) + `shared_preferences` (lokal lagring)
- Ingen backend, ingen konto, ingen løbende udgifter
