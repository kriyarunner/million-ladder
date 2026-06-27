import 'app_state.dart';

enum AppLang { da, en }

/// Globalt aktivt sprog – bruges af [fmt]/[signed] så talformat følger sproget.
AppLang gLang = AppLang.da;

AppLang langFromCode(String code) =>
    code.toLowerCase().startsWith('da') ? AppLang.da : AppLang.en;

/// Alle brugervendte tekster. Hold call-sites rene ved at tilføje getters/metoder her.
class Tr {
  final AppLang l;
  const Tr(this.l);
  bool get en => l == AppLang.en;

  // fælles
  String get stepWord => en ? 'Step' : 'Trin';
  String stepOf37(int s) => '${en ? 'Step' : 'Trin'} $s/37';
  String get cancel => en ? 'Cancel' : 'Annullér';
  String get close => en ? 'Close' : 'Luk';
  String get start => en ? 'Start' : 'Start';

  // nav
  String get navHome => en ? 'Home' : 'Home';
  String get navTrades => en ? 'Trades' : 'Handler';
  String get navLadder => en ? 'Ladder' : 'Trappen';
  String get navStats => en ? 'Stats' : 'Statistik';

  // home
  String get yourCapital => en ? 'Your capital' : 'Din kapital';
  String streakLine(int w) => en
      ? (w == 1 ? '1 week streak' : '$w week streak')
      : (w == 1 ? '1 uge i træk' : '$w uger i træk');
  String get streakSub =>
      en ? 'Make at least one trade a week to keep it' : 'Lav mindst én handel om ugen for at holde den';
  String get nextStepCaps => en ? '🎯 NEXT STEP' : '🎯 NÆSTE TRIN';
  String get millionReached => en ? 'Million reached!' : 'Million nået!';
  String missing(String amount) => en ? 'Missing $amount' : 'Mangler $amount';
  String get allConquered =>
      en ? 'You conquered all 37 steps. Legend.' : 'Du har besteget alle 37 trin. Konge.';
  String get tipBefore => en ? 'Your next sale must net at least ' : 'Dit næste salg skal give mindst ';
  String get tipAfter => en ? ' in profit to move up.' : ' i profit for at rykke op.';
  String get cashOnHand => en ? 'Cash on hand' : 'I kassen';
  String get quickDeposit => en ? 'Deposit' : 'Sæt ind';
  String get quickStats => en ? 'Stats' : 'Statistik';
  String get activeTrades => en ? 'Active trades' : 'Aktive handler';
  String get seeAll => en ? 'See all' : 'Se alle';
  String get noActiveTrades => en
      ? 'No active trades yet.\nTap "+ New trade" to start.'
      : 'Ingen aktive handler endnu.\nTryk "+ Ny handel" for at starte.';
  String seeAllTrades(int n) => en ? 'See all $n trades' : 'Se alle $n handler';

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
      ? (weeks == 1 ? 'step 37 in ~1 week' : 'step 37 in ~$weeks weeks')
      : (weeks == 1 ? 'trin 37 om ca. 1 uge' : 'trin 37 om ca. $weeks uger');
  String get youAreHere => en ? 'YOU ARE HERE' : 'DU ER HER';

  // stats
  String get statsEyebrow => en ? 'Stats' : 'Statistik';
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
  String stepXof37(int s) => en ? 'Step $s / 37' : 'Trin $s / 37';
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

  // onboarding
  String get obTitle1 => en ? '37 steps to\n1,000,000' : '37 trin til\n1.000.000 kr.';
  String get obLead1 => en
      ? 'You don\'t start by selling 100 things.\nYou start by selling ONE thing.'
      : 'Du starter ikke med at sælge 100 ting.\nDu starter med at sælge ÉN ting.';
  String get next => en ? 'Next' : 'Næste';
  String get obTitle2 => en ? 'Sell well,\nclimb the ladder' : 'Sælg godt,\nryk op ad trappen';
  String get obLead2 => en
      ? 'Every time you sell at a good profit, you move up.'
      : 'Hver gang du sælger med god fortjeneste, rykker du op.';
  String get understood => en ? 'Got it' : 'Forstået';
  String get obTitle3 => en ? 'Choose your\nstarting capital' : 'Vælg din\nstartkapital';
  String get obSellTitle => en ? 'Sell something you own' : 'Sælg en ting du ejer';
  String get obSellSub => en ? 'Watch, laptop, phone...' : 'Garmin ur, MacBook, iPhone...';
  String get obDepositTitle => en ? 'Add money' : 'Sæt penge ind';
  String get obDepositSub => en ? 'I already have starting capital' : 'Jeg har allerede startkapital';

  // milestone
  String get shareMyLadder => en ? 'Share my ladder' : 'Del min trappe';
  String get continueBtn => en ? 'Continue' : 'Fortsæt';
  String milestoneTitle(int step) {
    switch (step) {
      case 9:
        return en ? '25% there!' : '25% på vej!';
      case 19:
        return en ? 'Halfway!' : 'Halvvejs!';
      case 28:
        return en ? 'Top-tier!' : 'Top-tier!';
      case 37:
        return en ? 'MILLIONAIRE!' : 'MILLIONÆR!';
    }
    return '';
  }

  String milestoneSub(int step) {
    switch (step) {
      case 9:
        return en ? 'You\'ve built a solid foundation.' : 'Du har bygget et solidt fundament.';
      case 19:
        return en
            ? 'You\'re serious now – money grows fast from here.'
            : 'Du er seriøs nu – pengene vokser hurtigt herfra.';
      case 28:
        return en ? 'Only 9 steps left to the million.' : 'Kun 9 trin tilbage til millionen.';
      case 37:
        return en ? 'You climbed all 37 steps. Insane.' : 'Du besteg alle 37 trin. Vanvittigt flot.';
    }
    return '';
  }

  // toasts
  String jumpedUp(int jump, int after) => en
      ? (jump > 1 ? 'Nice! $jump steps up – step $after' : 'Step $after unlocked!')
      : (jump > 1 ? 'Flot! $jump trin op – trin $after' : 'Trin $after låst op!');
  String stillStep(int after) => en ? 'Logged · still step $after' : 'Registreret · stadig trin $after';

  // sheets – deposit
  String get addMoney => en ? 'Add money' : 'Sæt penge ind';
  String get depositHintFresh => en
      ? 'The amount becomes your starting capital on the ladder.'
      : 'Beløbet bliver din startkapital på trappen.';
  String get depositHint =>
      en ? 'The amount is added to your capital and cash.' : 'Beløbet lægges til din kapital og kasse.';
  String get amountLabel => en ? 'Amount' : 'Beløb (kr.)';
  String get addBtn => en ? 'Add' : 'Sæt ind';
  String get enterAmount => en ? 'Enter an amount' : 'Indtast et beløb';

  // sheets – sell owned
  String get sellOwnedTitle => en ? 'Sell something you own' : 'Sælg en ting du ejer';
  String get sellOwnedHint => en
      ? 'E.g. an old watch. The sale price becomes your starting capital.'
      : 'F.eks. et gammelt ur. Salgsprisen bliver din startkapital.';
  String get whatSelling => en ? 'What are you selling?' : 'Hvad sælger du?';
  String get exampleItem => en ? 'E.g. Garmin watch' : 'F.eks. Garmin ur';
  String get soldForLabel => en ? 'Sold for' : 'Solgt for (kr.)';
  String get logSale => en ? 'Log sale' : 'Registrér salg';
  String get enterSalePrice => en ? 'Enter a sale price' : 'Indtast en salgspris';
  String get startItem => en ? 'Starter item' : 'Startgenstand';

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
  String get shareImage => en ? 'Share image' : 'Del billede';
  String get preparing => en ? 'Preparing...' : 'Klargør...';
  String shareTextTop() =>
      en ? 'I climbed all 37 steps on Million Ladder and reached the million! 🪜👑' : 'Jeg besteg alle 37 trin på Million Ladder og nåede millionen! 🪜👑';
  String shareText(int step) => en
      ? 'I\'m on step $step/37 toward ${fmt(kTarget)} with Million Ladder 🪜🚀'
      : 'Jeg er på trin $step/37 på vej mod ${fmt(kTarget)} med Million Ladder 🪜🚀';
}
