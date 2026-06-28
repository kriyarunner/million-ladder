import 'app_state.dart';

enum AppLang { da, en }

/// Globalt aktivt sprog.
AppLang gLang = AppLang.da;

AppLang langFromCode(String code) =>
    code.toLowerCase().startsWith('da') ? AppLang.da : AppLang.en;

/// En valuta = visningssymbol + talformat. Trappens tal er de samme; kun
/// symbol og tusind-separator skifter.
class Currency {
  final String code; // fx 'USD'
  final String symbol; // fx '$'
  final String flag; // fx '🇺🇸'
  final bool prefix; // symbol før tallet?
  final String sep; // tusind-separator
  const Currency(this.code, this.symbol, this.flag, this.prefix, this.sep);

  String get label => '$flag  $code · $symbol';
}

const List<Currency> kCurrencies = [
  Currency('USD', '\$', '🇺🇸', true, ','),
  Currency('EUR', '€', '🇪🇺', true, '.'),
  Currency('GBP', '£', '🇬🇧', true, ','),
  Currency('DKK', 'kr.', '🇩🇰', false, '.'),
  Currency('SEK', 'kr', '🇸🇪', false, '.'),
  Currency('NOK', 'kr', '🇳🇴', false, '.'),
  Currency('CHF', 'CHF', '🇨🇭', true, '.'),
  Currency('JPY', '¥', '🇯🇵', true, ','),
  Currency('CAD', 'CA\$', '🇨🇦', true, ','),
  Currency('AUD', 'A\$', '🇦🇺', true, ','),
  Currency('INR', '₹', '🇮🇳', true, ','),
];

/// Globalt aktiv valuta – bruges af [fmt]/[signed].
Currency gCurrency = kCurrencies[3]; // DKK som udgangspunkt

Currency currencyFromCode(String? code) =>
    kCurrencies.firstWhere((c) => c.code == code, orElse: () => kCurrencies[3]);

/// Standard-valuta ud fra sprog (kun når brugeren ikke selv har valgt).
Currency defaultCurrencyForLang(AppLang l) => l == AppLang.en ? kCurrencies[0] : kCurrencies[3];

/// Alle brugervendte tekster. Hold call-sites rene ved at tilføje getters/metoder her.
class Tr {
  final AppLang l;
  const Tr(this.l);
  bool get en => l == AppLang.en;

  // fælles
  String get stepWord => en ? 'Step' : 'Trin';
  String stepOf37(int s) => '${en ? 'Step' : 'Trin'} $s/$kSteps';
  String get cancel => en ? 'Cancel' : 'Annullér';
  String get close => en ? 'Close' : 'Luk';
  String get start => en ? 'Start' : 'Start';

  // nav
  String get navHome => en ? 'Home' : 'Home';
  String get navTrades => en ? 'Trades' : 'Handler';
  String get navLadder => en ? 'Ladder' : 'Trappen';
  String get navStats => en ? 'Account' : 'Konto';

  // home
  String get yourCapital => en ? 'Your capital' : 'Din kapital';
  String streakLine(int w) => en
      ? (w == 1 ? '1 week streak' : '$w week streak')
      : (w == 1 ? '1 uge i træk' : '$w uger i træk');
  String get streakSub =>
      en ? 'One trade a week builds your discipline' : 'Én handel om ugen bygger din disciplin';
  String get nextStepCaps => en ? '🎯 NEXT STEP' : '🎯 NÆSTE TRIN';
  String get millionReached => en ? 'Million reached!' : 'Million nået!';
  String missing(String amount) => en ? '$amount to next step' : '$amount til næste trin';
  String get allConquered =>
      en ? 'You conquered all $kSteps steps. Legend.' : 'Du har besteget alle $kSteps trin. Konge.';
  String get tipBefore => en ? 'Your next sale must net at least ' : 'Dit næste salg skal give mindst ';
  String get tipAfter => en ? ' in profit to move up.' : ' i profit for at rykke op.';
  String get cashOnHand => en ? 'Ready to invest' : 'Klar til næste';
  String get quickDeposit => en ? 'Deposit' : 'Sæt ind';
  String get quickStats => en ? 'Account' : 'Konto';
  String get activeTrades => en ? 'Active trades' : 'Aktive handler';
  String get seeAll => en ? 'See all' : 'Se alle';
  String get noActiveTrades => en
      ? 'No active trades yet.\nTap "+ New trade" to start.'
      : 'Ingen aktive handler endnu.\nTryk "+ Ny handel" for at starte.';
  String seeAllTrades(int n) => en ? 'See all $n trades' : 'Se alle $n handler';
  String get liquidLabel => en ? 'Liquid' : 'Likvid';
  String get emptyCtaTitle =>
      en ? 'Ready for your next trade?' : 'Klar til næste handel?';
  String get emptyCtaSub => en
      ? 'Sell something else — or buy something to flip.'
      : 'Sælg noget mere — eller køb noget til videresalg.';
  String welcomeBack(int weeks) => en
      ? 'Welcome back! 🔥 $weeks-week streak'
      : 'Velkommen tilbage! 🔥 $weeks ugers streak';

  // trades
  String get yourTradesEyebrow => en ? 'Your trades' : 'Dine handler';
  String get tradesTitle => en ? 'Trades' : 'Handler';
  String tradesSummary(int n, String rev) =>
      en ? '$n trades · $rev revenue' : '$n handler · $rev omsætning';
  String get noTradesYet => en ? 'No trades yet.' : 'Ingen handler endnu.';
  String closedQty(int qty) => en ? 'Closed · $qty pcs.' : 'Lukket · $qty stk.';
  String leftOf(int left, int qty) => en ? '$left of $qty · ' : '$left af $qty · ';
  String sellAtLeast(String price) => en ? 'sell ≥ $price/pc' : 'sælg ≥ $price/stk';
  String get pillClosed => en ? 'Closed' : 'Lukket';
  String get pillActive => en ? 'Active' : 'Aktiv';
  String get newTradeFab => en ? '+ New trade' : '+ Ny handel';

  // ladder
  String get journeyEyebrow => en ? 'The journey' : 'Rejsen';
  String get ladderTitle => en ? 'The Ladder' : 'Trappen';
  String youAreOnStep(int s) => en ? 'YOU ARE ON STEP $s' : 'DU ER PÅ TRIN $s';
  String get reachedMillionCrown => en ? 'You reached the million! 👑' : 'Du nåede millionen! 👑';
  String get paceUnknown => en
      ? 'Make a few trades and we\'ll show when you reach the million.'
      : 'Lav et par handler, så viser vi hvornår du når millionen.';
  String get paceBefore => en ? 'At your current pace: ' : 'Ved dit nuværende tempo: ';
  String paceBold(int weeks) => en
      ? (weeks == 1 ? 'step $kSteps in ~1 week' : 'step $kSteps in ~$weeks weeks')
      : (weeks == 1 ? 'trin $kSteps om ca. 1 uge' : 'trin $kSteps om ca. $weeks uger');
  String get youAreHere => en ? 'YOU ARE HERE' : 'DU ER HER';
  String get hideTaskLabel => en ? 'Hide – show full ladder' : 'Skjul – se hele trappen';
  String get showTaskLabel => en ? 'Show next task' : 'Vis næste opgave';
  String get languageCaption => en ? 'LANGUAGE' : 'SPROG';
  String get currencyCaption => en ? 'CURRENCY' : 'VALUTA';
  String get currencyPickTitle => en ? 'Choose currency' : 'Vælg valuta';

  // intro-guide (tutorial)
  String get tutEyebrow => en ? 'QUICK INTRO' : 'HURTIG INTRO';
  String get tutSkip => en ? 'Skip' : 'Spring over';
  String get tutDontShow => en ? "Don't show again" : 'Vis ikke igen';
  String get tutReplay => en ? 'How the app works' : 'Sådan virker appen';
  String get tutTapHere => en ? 'Tap here' : 'Tryk her';
  String get tutLadderPop => en ? '+ a step!' : '+ et trin!';
  String get tutFindUnderKonto =>
      en ? 'You can replay this anytime under Account.' : 'Du kan altid se guiden igen under Konto.';
  // [titel, brødtekst] for hver intro-side
  List<List<String>> get tutPages => en
      ? [
          ['Welcome 👋', 'Here\'s how Million Ladder works – it takes 20 seconds.'],
          ['Sell or buy', 'Tap "+ New trade" and sell something you own – or buy something to flip for profit.'],
          ['Log the sale', 'Once you\'ve sold, tap "✓ Sold" and enter what you got for it.'],
          ['Watch the ladder rise', 'Every good trade moves you up the ladder toward ${fmt(1000000)}.'],
          ['You\'re ready 🚀', 'You start at 0 – no money needed. Just sell ONE thing to get going.'],
        ]
      : [
          ['Velkommen 👋', 'Sådan virker Million Ladder – det tager 20 sekunder.'],
          ['Sælg eller køb', 'Tryk "+ Ny handel" og sælg noget du ejer – eller køb noget du kan sælge med fortjeneste.'],
          ['Registrér salget', 'Når du har solgt, trykker du "✓ Solgt" og skriver hvad du fik for den.'],
          ['Se trappen stige', 'Hver god handel rykker dig op ad trappen mod ${fmt(1000000)}.'],
          ['Du er klar 🚀', 'Du starter på 0 – du behøver ingen penge. Sælg bare ÉN ting for at komme i gang.'],
        ];

  // stats
  String get statsEyebrow => en ? 'Account' : 'Konto';
  String get overview => en ? 'Overview' : 'Overblik';
  String get capitalNetWorth => en ? 'Capital (net worth)' : 'Kapital (formue)';
  String get totalProfit => en ? 'Total profit' : 'Samlet profit';
  String get boundInTrades => en ? 'Tied up in trades' : 'Bundet i handler';
  String get tradeCount => en ? 'Trades' : 'Antal handler';
  String get revenue => en ? 'Revenue' : 'Omsætning';
  String get bestTrade => en ? 'Best trade' : 'Bedste handel';
  String get avgRoi => en ? 'Avg. ROI' : 'Gns. ROI';
  String get yourBadges => en ? 'Your badges' : 'Dine badges';
  String get noBadges => en
      ? 'None yet. Climb the ladder to earn your first.'
      : 'Endnu ingen. Ryk op ad trappen for at optjene dine første.';
  String badgeStep(int k) => en ? 'Step $k' : 'Trin $k';
  String badgeWeeks(int w) => en ? '$w weeks' : '$w uger';
  String get yourStyle => en ? 'Your style' : 'Din style';
  String styleLabel(double avg, bool empty) {
    if (empty) return '—';
    if (avg < 1.5) return en ? 'Steady climber' : 'Stabil klatrer';
    if (avg <= 3) return en ? 'Jumper' : 'Springer';
    return en ? 'Rocket 🚀' : 'Raket 🚀';
  }

  String get styleEmpty => en ? 'Make a trade to find your style' : 'Lav en handel for at finde din style';
  String avgJump(String v) => en ? 'Average step jump: $v' : 'Gennemsnitligt trinhop: $v';
  String get currentStep => en ? 'Current step' : 'Aktuelt trin';
  String stepXof37(int s) => en ? 'Step $s / $kSteps' : 'Trin $s / $kSteps';
  String get reachedMillion => en ? 'You reached the million!' : 'Du nåede millionen!';
  String missingToMillion(String amount) =>
      en ? 'Missing $amount to the million' : 'Mangler $amount til millionen';
  String get depositBtn => en ? '+ Add money' : '+ Sæt penge ind';
  String get shareMyJourney => en ? 'Share my journey' : 'Del min rejse';
  String get resetJourney => en ? 'Reset journey' : 'Nulstil rejse';
  String get resetTitle => en ? 'Reset journey?' : 'Nulstil rejse?';
  String get resetBody =>
      en ? 'All trades and deposits will be deleted.' : 'Alle handler og indskud slettes.';
  String get reset => en ? 'Reset' : 'Nulstil';
  String get resetDone => en ? 'Journey reset' : 'Rejsen er nulstillet';
  String get language => en ? 'Language' : 'Sprog';
  String get langCurrencyCaption =>
      en ? 'CHOOSE LANGUAGE & CURRENCY' : 'VÆLG SPROG & VALUTA';

  // onboarding – drøm
  String get obDreamTitle => en ? 'What do you\ndream of?' : 'Hvad drømmer\ndu om?';
  String get obDreamLead => en
      ? 'Write your dream and roughly what it costs. We\'ll place it on your ladder, so you see it every day.'
      : 'Skriv din drøm og hvad den ca. koster. Så placerer vi den på din trappe, så du ser den hver dag.';
  String get dreamNameQ => en ? 'Your dream' : 'Din drøm';
  String get dreamNameHint =>
      en ? 'E.g. a trip, a motorcycle, freedom' : 'F.eks. en rejse, en motorcykel, frihed';
  String get dreamCostQ => en ? 'What does it cost?' : 'Hvad koster den ca.?';
  String dreamAtStep(int step) =>
      en ? '✨ Your dream sits at step $step' : '✨ Din drøm sidder på trin $step';
  String get dreamLabel => en ? 'Your dream' : 'Din drøm';
  String get dreamEdit => en ? 'Edit your dream' : 'Rediger din drøm';
  String get dreamPromptTitle => en ? 'Time to dream big 💭' : 'Tid til at drømme stort 💭';
  String get dreamPromptBody => en
      ? 'You\'re climbing fast. Pick something you really want — we\'ll put it on your ladder so you can see exactly how close you are.'
      : 'Du klatrer hurtigt. Vælg noget du virkelig ønsker dig — så sætter vi det på din trappe, så du kan se præcis hvor tæt du er.';
  String get dreamPromptCta => en ? 'Set my dream' : 'Sæt min drøm';
  String get dreamPromptLater => en ? 'Maybe later' : 'Måske senere';
  String get dreamSaved => en ? 'Dream saved' : 'Drøm gemt';
  String get dreamReachedTitle => en ? 'DREAM REACHED!' : 'DRØM NÅET!';
  String dreamReachedSub(String name) =>
      en ? 'You reached your dream:\n$name' : 'Du nåede din drøm:\n$name';
  String get setNewDream => en ? 'Set a new dream' : 'Sæt en ny drøm';
  String get disclaimer => en
      ? 'Million Ladder is a motivation and decluttering app. It is not financial advice and promises no financial outcome. Your success depends on your own trades.'
      : 'Million Ladder er en motivations- og oprydnings-app. Det er ikke finansiel rådgivning og lover ingen økonomisk gevinst. Din succes afhænger af dine egne handler.';
  String get termsLine =>
      en ? 'Terms & privacy: millionladder.com/terms' : 'Vilkår & privatliv: millionladder.com/terms';

  // onboarding
  String get obTitle1 => en ? '$kSteps steps to\n${fmt(1000000)}' : '$kSteps trin til\n${fmt(1000000)}';
  String get obLead1 => en
      ? 'You don\'t need any money to start.\nJust sell ONE thing you own.'
      : 'Du behøver ingen penge for at starte.\nSælg bare ÉN ting du ejer.';
  String get next => en ? 'Next' : 'Næste';
  String get obTitle2 => en ? 'Sell well,\nclimb the ladder' : 'Sælg godt,\nryk op ad trappen';
  String get obLead2 => en
      ? 'Every time you sell at a good profit, you move up.'
      : 'Hver gang du sælger med god fortjeneste, rykker du op.';
  String get understood => en ? 'Got it' : 'Forstået';
  String get obTitle3 => en ? 'What do you\nsell first?' : 'Hvad sælger du\nførst?';
  String get obSellTitle => en ? 'Sell something you own' : 'Sælg en ting du ejer';
  String get obSellSub => en ? 'Clothes, a bike, an old phone...' : 'Tøj, en cykel, en gammel telefon...';
  String get obDepositTitle => en ? 'Add money' : 'Sæt penge ind';
  String get obDepositSub => en ? 'I already have starting capital' : 'Jeg har allerede startkapital';

  // milestone
  String get shareMyLadder => en ? 'Share my ladder' : 'Del min trappe';
  String get shareShort => en ? 'Share' : 'Del';
  String get continueBtn => en ? 'Continue' : 'Fortsæt';
  String milestoneTitle(int step) {
    switch (kMilestoneSteps.indexOf(step)) {
      case 0:
        return en ? '25% there!' : '25% på vej!';
      case 1:
        return en ? 'Halfway!' : 'Halvvejs!';
      case 2:
        return en ? 'Top-tier!' : 'Top-tier!';
      case 3:
        return en ? 'MILLIONAIRE!' : 'MILLIONÆR!';
    }
    return '';
  }

  String milestoneSub(int step) {
    final left = kSteps - step;
    switch (kMilestoneSteps.indexOf(step)) {
      case 0:
        return en ? 'You\'ve built a solid foundation.' : 'Du har bygget et solidt fundament.';
      case 1:
        return en
            ? 'You\'re serious now – money grows fast from here.'
            : 'Du er seriøs nu – pengene vokser hurtigt herfra.';
      case 2:
        return en ? 'Only $left steps left to the million.' : 'Kun $left trin tilbage til millionen.';
      case 3:
        return en ? 'You climbed all $kSteps steps. Insane.' : 'Du besteg alle $kSteps trin. Vanvittigt flot.';
    }
    return '';
  }

  // toasts
  String jumpedUp(int jump, int after) => en
      ? (jump > 1 ? 'Nice! $jump steps up – step $after' : 'Step $after unlocked!')
      : (jump > 1 ? 'Flot! $jump trin op – trin $after' : 'Trin $after låst op!');
  String stillStep(int after) => en ? 'Logged · still step $after' : 'Registreret · stadig trin $after';
  String nearMiss(String amt) => en
      ? '🎯 So close! Only $amt from the next step.'
      : '🎯 Så tæt på! Kun $amt fra næste trin.';
  String get soCloseCaps => en ? 'SO CLOSE!' : 'SÅ TÆT PÅ!';
  String momentumRising(int n) => en
      ? '📈 Momentum rising · $n moves this week'
      : '📈 Momentum stiger · $n handler denne uge';
  String momentumSteady(int n) => en
      ? '🔥 $n moves this week'
      : '🔥 $n handler denne uge';
  String get nextMilestoneTag => en ? 'NEXT MILESTONE' : 'NÆSTE MILEPÆL';
  String affSharp(int roi) => en ? '💎 Sharp trader · ROI $roi%' : '💎 Skarp forhandler · ROI $roi%';
  String affGood(int roi) => en ? '👍 Good margin · ROI $roi%' : '👍 God margin · ROI $roi%';
  String affRoi(int roi) => en ? '📈 ROI $roi%' : '📈 ROI $roi%';

  // mega-jump (multi-trins hop uden milepæl)
  String megaJumpTitle(int jump) => en ? '+$jump STEPS!' : '+$jump TRIN!';
  String megaJumpSub(int before, int after) => en
      ? 'You jumped from step $before to step $after. Exceptional!'
      : 'Du hoppede fra trin $before til trin $after. Exceptionelt!';

  // sheets – deposit
  String get addMoney => en ? 'Add money' : 'Sæt penge ind';
  String get depositHintFresh => en
      ? 'The amount becomes your starting capital on the ladder.'
      : 'Beløbet bliver din startkapital på trappen.';
  String get depositHint =>
      en ? 'The amount is added to your capital and cash.' : 'Beløbet lægges til din kapital og kasse.';
  String get amountLabel => en ? 'Amount' : 'Beløb (${gCurrency.symbol})';
  String get addBtn => en ? 'Add' : 'Sæt ind';
  String get enterAmount => en ? 'Enter an amount' : 'Indtast et beløb';

  // sheets – withdraw
  String get withdrawTitle => en ? 'Withdraw money' : 'Tag penge ud';
  String get withdrawHint => en
      ? 'The amount is taken from your cash on hand.'
      : 'Beløbet trækkes fra din kasse.';
  String withdrawMax(String amount) =>
      en ? 'You can withdraw up to $amount' : 'Du kan hæve op til $amount';
  String get withdrawBtn => en ? 'Withdraw' : 'Tag ud';
  String get withdrawTooMuch => en
      ? 'You can\'t withdraw more than your cash on hand.'
      : 'Du kan ikke hæve mere end du har i kassen.';
  String get withdrawn => en ? 'Money withdrawn' : 'Penge taget ud';
  String get withdrawBtnBig => en ? '− Take money out' : '− Tag penge ud';
  String get movements => en ? 'Deposits & withdrawals' : 'Ind- og udbetalinger';
  String get transactions => en ? 'Transactions' : 'Transaktioner';
  String get transactionsHint =>
      en ? 'Add or take out money' : 'Sæt penge ind eller tag penge ud';

  // buying power (buy sheet)
  String buyingPower(String amount) =>
      en ? 'You can buy for up to $amount' : 'Du kan købe for op til $amount';
  String get noBuyingPower => en
      ? 'No cash to buy with yet — sell something or add money first.'
      : 'Ingen penge at købe for endnu — sælg noget eller sæt penge ind først.';
  String buyTooExpensive(String missing) => en
      ? 'You\'re $missing short. Add the money below to continue.'
      : 'Du mangler $missing. Sæt pengene ind herunder for at fortsætte.';
  String get addMoneyToBuy => en ? 'Add money' : 'Sæt penge ind';
  String get addInline => en ? 'Add' : 'Sæt ind';

  // sælg-vælger (Solgt) + hurtigt salg
  String get soldBtn => en ? '✓ Sold' : '✓ Solgt';
  String get sellPickerTitle =>
      en ? 'Which item did you sell?' : 'Hvilken vare solgte du?';
  String get sellPickerEmpty => en
      ? 'No active items to sell yet. Add a buy or sell something you own.'
      : 'Ingen aktive varer at sælge endnu. Tilføj et køb eller sælg noget du ejer.';
  String get ladderCtaSell => en ? 'Sell an item' : 'Sælg en vare';
  String get ladderCtaTrade => en ? 'Log a trade' : 'Registrér en handel';

  // next task (ladder)
  String get nextTaskEyebrow => en ? '🎯 YOUR NEXT TASK' : '🎯 DIN NÆSTE OPGAVE';
  String nextTaskAmount(String amount, int step) =>
      en ? '$amount to step $step' : '$amount til trin $step';
  String nextTaskSub(String amount) => en
      ? 'Earn $amount more from a sale and you climb a step.'
      : 'Tjen $amount mere på et salg, så rykker du et trin op.';
  String get nextTaskDone => en ? 'You reached the million! 👑' : 'Du nåede millionen! 👑';

  // sheets – sell owned
  String get sellOwnedTitle => en ? 'Sell something you own' : 'Sælg en ting du ejer';
  String get sellOwnedHint => en
      ? 'E.g. an old watch. The sale price becomes your starting capital.'
      : 'F.eks. et gammelt ur. Salgsprisen bliver din startkapital.';
  String get whatSelling => en ? 'What are you selling?' : 'Hvad sælger du?';
  String get exampleItem => en ? 'E.g. a bike' : 'F.eks. en cykel';
  String get soldForLabel => en ? 'Sold for' : 'Solgt for (${gCurrency.symbol})';
  String get logSale => en ? 'Log sale' : 'Registrér salg';
  String get enterSalePrice => en ? 'Enter a sale price' : 'Indtast en salgspris';
  String get startItem => en ? 'Starter item' : 'Startgenstand';

  // sheets – vælger (køb/salg)
  String get addChooseTitle => en ? 'What do you want to do?' : 'Hvad vil du gøre?';
  String get buyChoiceTitle => en ? 'Buy something and sell it' : 'Køb noget og sælg det';
  String get buyChoiceSub =>
      en ? 'Find a good deal you can profit on' : 'Find en god handel du kan tjene på';
  String get sellChoiceTitle => en ? 'Sell something you own' : 'Sælg noget du ejer';
  String get sellChoiceSub =>
      en ? 'Something used that\'s gathering dust' : 'Noget brugt der samler støv';

  // sheets – køb (progressiv)
  String get buyTitle => en ? 'Log a buy' : 'Registrér køb';
  String get buyNameQ => en ? 'What did you buy?' : 'Hvad købte du?';
  String get buyPriceQ => en ? 'What did you pay?' : 'Hvad gav du for det?';
  String get addBuyBtn => en ? 'Add buy' : 'Tilføj køb';

  // sheets – salg (progressiv)
  String get sellNameQ => en ? 'What did you sell?' : 'Hvad solgte du?';
  String get sellPriceQ => en ? 'What did you get?' : 'Hvad fik du for det?';

  // sheets – sæt til salg (opret vare du ejer)
  String get listNameQ => en ? 'What do you want to sell?' : 'Hvad vil du sælge?';
  String get listForSale => en ? 'Put up for sale' : 'Sæt til salg';
  String get listedForSale => en ? 'Put up for sale' : 'Sat til salg';
  String get listHint => en
      ? 'It goes to your items for sale. Log the sale with ✓ Sold when it sells.'
      : 'Den lægges til dine varer til salg. Registrér salget med ✓ Solgt når den er solgt.';
  String get soldForOptionalQ => en ? 'Sold for? (optional)' : 'Solgt for? (valgfrit)';
  String get soldForOptionalHint => en
      ? 'Already sold it? Enter the price and jump straight up the ladder.'
      : 'Allerede solgt? Skriv prisen og ryk straks op ad trappen.';

  // sheets – new/edit trade
  String get newTradeTitle => en ? 'New trade' : 'Ny handel';
  String get nameLabel => en ? 'Name' : 'Navn';
  String get qtyLabel => en ? 'Quantity' : 'Antal';
  String get unitPriceLabel => en ? 'Price per pc.' : 'Pris pr. stk.';
  String get commentLabel => en ? 'Comment (optional)' : 'Kommentar (valgfri)';
  String get commentHint => en ? 'Where bought, condition...' : 'Hvor købt, stand...';
  String get addTradeBtn => en ? 'Add trade' : 'Tilføj handel';
  String get tradeAdded => en ? 'Trade added' : 'Handel tilføjet';
  String get tradeWord => en ? 'Trade' : 'Handel';
  String get editTradeTitle => en ? 'Edit trade' : 'Rediger handel';
  String minQtyNote(int sold) => en
      ? 'Quantity can\'t be below $sold (already sold).'
      : 'Antal kan ikke være under $sold (allerede solgt).';
  String get saveChanges => en ? 'Save changes' : 'Gem ændringer';
  String get tradeUpdated => en ? 'Trade updated' : 'Handel opdateret';
  String get editSaleTitle => en ? 'Edit sale price' : 'Rediger salgspris';
  String get saleUpdated => en ? 'Sale updated' : 'Salg opdateret';

  // sheets – detail
  String get edit => en ? 'Edit' : 'Rediger';
  String get buyPrice => en ? 'Buy price' : 'Købspris';
  String get soldFor => en ? 'Sold for' : 'Solgt for';
  String get leftLabel => en ? 'Left' : 'Tilbage';
  String leftOfQty(int left, int qty) => en ? '$left / $qty pcs.' : '$left / $qty stk.';
  String get profit => en ? 'Profit' : 'Profit';
  String get loggedSales => en ? 'Logged sales' : 'Registrerede salg';
  String saleLine(int qty, String price) => en ? '$qty pcs. à $price' : '$qty stk. à $price';
  String get saleRemoved => en ? 'Sale removed' : 'Salg fjernet';
  String get removeSale => en ? 'Remove sale' : 'Fjern salg';
  String get tradeClosed => en ? 'Trade is closed – all sold.' : 'Handel er lukket – alt er solgt.';
  String sellMax(int max) => en ? 'Sell quantity (max $max)' : 'Sælg antal (maks $max)';
  String get salePricePerUnit => en ? 'Sale price per pc.' : 'Salgspris pr. stk.';
  String get deleteTrade => en ? 'Delete trade' : 'Slet handel';
  String get tradeDeleted => en ? 'Trade deleted' : 'Handel slettet';
  String get deleteTradeQ => en ? 'Delete trade?' : 'Slet handel?';
  String get deleteTradeBody =>
      en ? 'The trade and its sales are permanently deleted.' : 'Handlen og dens salg slettes permanent.';
  String get removeSaleQ => en ? 'Remove sale?' : 'Fjern salg?';
  String get removeSaleBody =>
      en ? 'The sale is removed from the trade.' : 'Salget fjernes fra handlen.';

  // deposits (stats)
  String get deposits => en ? 'Deposits' : 'Indskud';
  String get deleteDeposit => en ? 'Delete deposit' : 'Slet indskud';
  String get deleteDepositQ => en ? 'Delete deposit?' : 'Slet indskud?';
  String get deleteDepositBody =>
      en ? 'The deposit is removed from your capital.' : 'Indskuddet fjernes fra din kapital.';
  String get delete => en ? 'Delete' : 'Slet';

  // share card
  String get iAmOn => en ? 'I AM ON' : 'JEG ER PÅ';
  String get iReached => en ? 'I REACHED' : 'JEG NÅEDE';
  String pctToNext(int pct) => en ? '$pct% to next step' : '$pct% mod næste trin';
  String get millionReachedEmoji => en ? 'Million reached 🎉' : 'Million nået 🎉';
  String get cardTagline => en
      ? 'From ${fmt(0)} to ${fmt(kTarget)} — one sale at a time.'
      : 'Fra ${fmt(0)} til ${fmt(kTarget)} — ét salg ad gangen.';
  String get cardTagline2 => en ? 'Free · offline · no ads' : 'Gratis · offline · ingen reklamer';
  String get cardDomain => 'millionladder.com';
  String get shareImage => en ? 'Share image' : 'Del billede';
  String get preparing => en ? 'Preparing...' : 'Klargør...';
  String shareTextTop() =>
      en ? 'I climbed all $kSteps steps on Million Ladder and reached the million! 🪜👑' : 'Jeg besteg alle $kSteps trin på Million Ladder og nåede millionen! 🪜👑';
  String shareText(int step) => en
      ? 'I\'m on step $step/$kSteps toward ${fmt(kTarget)} with Million Ladder 🪜🚀'
      : 'Jeg er på trin $step/$kSteps på vej mod ${fmt(kTarget)} med Million Ladder 🪜🚀';
}
