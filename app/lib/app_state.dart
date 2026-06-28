import 'dart:convert';
import 'dart:ui' as ui;
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'i18n.dart';

const double kTarget = 1000000;

/// FAST trappe – ens for ALLE brugere (samme tal som millionladder.com).
/// Indeks 0 = start (0 kr.), 1 = 100 kr. Store, aftagende hop i starten (man
/// sælger ting man ejer → relativt stor fortjeneste: ~120% → ~60%), derefter
/// præcis 20% pr. trin når beløbet er stort. 37 trin, slutter på 1.000.000.
const List<double> kLadder = [
  0, 100, 219, 448, 857, 1543, 2637, 4213, // store hop (trin 1–7)
  5055, 6066, 7280, 8735, 10483, 12579, 15095, 18114, 21737, 26084, 31301,
  37561, 45073, 54088, 64905, 77887, 93464, 112157, 134588, 161506, 193807,
  232568, 279082, 334898, 401878, 482253, 578704, 694444, 833333, 1000000,
];

/// Antal trin (sidste indeks) = 37.
final int kSteps = kLadder.length - 1;

class Sale {
  final int qty;
  final double unitPrice;
  final int date;
  Sale({required this.qty, required this.unitPrice, required this.date});
  Map<String, dynamic> toJson() => {'qty': qty, 'unitPrice': unitPrice, 'date': date};
  factory Sale.fromJson(Map<String, dynamic> j) =>
      Sale(qty: j['qty'], unitPrice: (j['unitPrice'] as num).toDouble(), date: j['date'] ?? 0);
}

class Trade {
  final String id;
  String name;
  int qty;
  double unitCost;
  String note;
  List<Sale> sales;
  int date;
  Trade({
    required this.id,
    required this.name,
    required this.qty,
    required this.unitCost,
    this.note = '',
    List<Sale>? sales,
    required this.date,
  }) : sales = sales ?? [];

  double get cost => qty * unitCost;
  int get soldQty => sales.fold(0, (a, s) => a + s.qty);
  double get revenue => sales.fold(0.0, (a, s) => a + s.qty * s.unitPrice);
  double get realized => revenue - soldQty * unitCost;
  int get left => qty - soldQty;
  bool get isClosed => soldQty >= qty;

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'qty': qty,
        'unitCost': unitCost,
        'note': note,
        'date': date,
        'sales': sales.map((s) => s.toJson()).toList(),
      };
  factory Trade.fromJson(Map<String, dynamic> j) => Trade(
        id: j['id'],
        name: j['name'] ?? 'Handel',
        qty: j['qty'] ?? 1,
        unitCost: (j['unitCost'] as num?)?.toDouble() ?? 0,
        note: j['note'] ?? '',
        date: j['date'] ?? 0,
        sales: ((j['sales'] as List?) ?? [])
            .map((e) => Sale.fromJson(Map<String, dynamic>.from(e)))
            .toList(),
      );
}

/// Trin der udløser en milepæls-fejring (fuldskærm): 25%, 50%, 75% og 100%.
/// Sorteret stigende, så indeks 0..3 svarer til de fire tiers.
final List<int> kMilestoneSteps = _milestones();
List<int> _milestones() {
  final q = <int>[
    (kSteps * 0.25).round(),
    (kSteps * 0.5).round(),
    (kSteps * 0.75).round(),
    kSteps,
  ];
  return q.toSet().toList()..sort();
}

final Map<int, String> kMilestoneEmoji = {
  for (var i = 0; i < kMilestoneSteps.length; i++)
    kMilestoneSteps[i]: const ['🎉', '⚡️', '💎', '👑'][i.clamp(0, 3)],
};

/// Trin hvor "sæt din drøm"-CTA udløses (første milepæl = 25%).
final int kDreamPromptStep = kMilestoneSteps.isNotEmpty ? kMilestoneSteps.first : 9;

const int _msPerDay = 86400000;

class AppState extends ChangeNotifier {
  List<Trade> trades = [];
  List<double> deposits = [];
  List<int> events = []; // tidsstempler for aktivitet (streak)
  List<int> jumps = []; // antal trin pr. opryk (til "din style")
  bool onboarded = false;
  AppLang lang = AppLang.da;
  Currency currency = kCurrencies[3];
  String dreamName = '';
  double dreamCost = 0;
  bool dreamPrompted = false; // "sæt din drøm"-CTA er vist (ved første milepæl)
  int tutorialSeen = 0; // antal gange intro-guiden er vist på Home
  bool tutorialDone = false; // bruger har trykket den væk permanent
  String _lastOpenDay = ''; // yyyy-mm-dd for sidste app-åbning
  bool justReturned = false; // sand hvis appen åbnes på en ny dag (transient)
  SharedPreferences? _prefs;

  static String _dayKey(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  /// Returnerer true én gang hvis brugeren vendte tilbage på en ny dag.
  bool consumeJustReturned() {
    if (!justReturned) return false;
    justReturned = false;
    return true;
  }

  Tr get t => Tr(lang);

  /// Skal intro-guiden vises automatisk på Home? (kun 1. gang)
  bool get shouldAutoTutorial => !tutorialDone && tutorialSeen < 1;

  void markTutorialShown() {
    tutorialSeen++;
    _save();
  }

  void dismissTutorial() {
    tutorialDone = true;
    _save();
  }

  Future<void> load() async {
    _prefs = await SharedPreferences.getInstance();
    final raw = _prefs?.getString('ml');
    String? savedLang;
    String? savedCurrency;
    if (raw != null) {
      try {
        final j = jsonDecode(raw) as Map<String, dynamic>;
        trades = ((j['trades'] as List?) ?? [])
            .map((e) => Trade.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        deposits = ((j['deposits'] as List?) ?? [])
            .map((e) => (e as num).toDouble())
            .toList();
        events = ((j['events'] as List?) ?? []).map((e) => e as int).toList();
        jumps = ((j['jumps'] as List?) ?? []).map((e) => e as int).toList();
        onboarded = j['onboarded'] == true;
        dreamName = (j['dreamName'] as String?) ?? '';
        dreamCost = (j['dreamCost'] as num?)?.toDouble() ?? 0;
        dreamPrompted = j['dreamPrompted'] == true;
        tutorialSeen = (j['tutorialSeen'] as num?)?.toInt() ?? 0;
        tutorialDone = j['tutorialDone'] == true;
        _lastOpenDay = (j['lastOpenDay'] as String?) ?? '';
        savedLang = j['lang'] as String?;
        savedCurrency = j['currency'] as String?;
      } catch (_) {}
    }
    // "Velkommen tilbage": ny dag siden sidste åbning (kun for eksisterende brugere)
    final today = _dayKey(DateTime.now());
    if (onboarded && _lastOpenDay.isNotEmpty && _lastOpenDay != today) {
      justReturned = true;
    }
    _lastOpenDay = today;
    // gemt valg vinder; ellers auto-detektér fra telefonens sprog
    lang = savedLang != null
        ? langFromCode(savedLang)
        : langFromCode(ui.PlatformDispatcher.instance.locale.languageCode);
    gLang = lang;
    // valuta: gemt valg vinder; ellers standard ud fra sprog
    currency = savedCurrency != null ? currencyFromCode(savedCurrency) : defaultCurrencyForLang(lang);
    gCurrency = currency;
    _save(); // persistér opdateret lastOpenDay
    notifyListeners();
  }

  void setLang(AppLang l) {
    lang = l;
    gLang = l;
    _save();
  }

  void setCurrency(Currency c) {
    currency = c;
    gCurrency = c;
    _save();
  }

  void _save() {
    gLang = lang;
    gCurrency = currency;
    final data = jsonEncode({
      'trades': trades.map((t) => t.toJson()).toList(),
      'deposits': deposits,
      'events': events,
      'jumps': jumps,
      'onboarded': onboarded,
      'dreamName': dreamName,
      'dreamCost': dreamCost,
      'dreamPrompted': dreamPrompted,
      'tutorialSeen': tutorialSeen,
      'tutorialDone': tutorialDone,
      'lastOpenDay': _lastOpenDay,
      'lang': lang == AppLang.en ? 'en' : 'da',
      'currency': currency.code,
    });
    _prefs?.setString('ml', data);
    notifyListeners();
  }

  void _logEvent() => events.add(DateTime.now().millisecondsSinceEpoch);

  void setOnboarded() {
    onboarded = true;
    _save();
  }

  void setDream(String name, double cost) {
    dreamName = name.trim();
    dreamCost = cost < 0 ? 0 : cost;
    _save();
  }

  /// Skal "sæt din drøm"-CTA vises? (ingen drøm sat endnu, og ikke spurgt før)
  bool get shouldPromptDream => dreamCost <= 0 && !dreamPrompted;

  void markDreamPrompted() {
    dreamPrompted = true;
    _save();
  }

  /// Trinnet hvor drømmen "nås" (første trin hvis værdi >= drømmens pris).
  int? get dreamStep {
    if (dreamCost <= 0) return null;
    for (var i = 1; i <= kSteps; i++) {
      if (kLadder[i] >= dreamCost) return i;
    }
    return kSteps;
  }

  void recordJump(int gained) {
    if (gained > 0) {
      jumps.add(gained);
      _save();
    }
  }

  // --- beregninger ---
  double get depositsSum => deposits.fold(0.0, (a, d) => a + d);
  double get realizedTotal => trades.fold(0.0, (a, t) => a + t.realized);
  double get capital => depositsSum + realizedTotal;
  double get boundCapital =>
      trades.fold(0.0, (a, t) => a + (t.qty - t.soldQty) * t.unitCost);
  double get cashOnHand => capital - boundCapital;
  double get totalRevenue => trades.fold(0.0, (a, t) => a + t.revenue);
  bool get isFresh => depositsSum == 0 && trades.isEmpty;
  List<Trade> get activeTrades => trades.where((t) => !t.isClosed).toList();

  int get curStep {
    final c = capital;
    var s = 0;
    for (var i = 0; i <= kSteps; i++) {
      if (c >= kLadder[i]) s = i;
    }
    return s;
  }

  double get nextTarget => kLadder[(curStep + 1).clamp(0, kSteps)];
  double get needForNext => (nextTarget - capital).clamp(0, double.infinity);

  /// Hvor langt man er gennem det nuværende trin (0..1).
  double get stepProgress {
    if (curStep >= kSteps) return 1.0;
    final prev = kLadder[curStep];
    final span = nextTarget - prev;
    if (span <= 0) return 1.0;
    return ((capital - prev) / span).clamp(0.0, 1.0);
  }

  double get bestTrade {
    if (trades.isEmpty) return 0;
    return trades.map((t) => t.realized).reduce((a, b) => a > b ? a : b);
  }

  double get avgRoi {
    final r = trades.where((t) => t.cost > 0 && t.soldQty > 0).map((t) => t.realized / t.cost).toList();
    if (r.isEmpty) return 0;
    return r.reduce((a, b) => a + b) / r.length;
  }

  bool get hasRoi => trades.any((t) => t.cost > 0 && t.soldQty > 0);

  int get _curWeek => (DateTime.now().millisecondsSinceEpoch ~/ _msPerDay) ~/ 7;
  int get actsThisWeek => events.where((e) => (e ~/ _msPerDay) ~/ 7 == _curWeek).length;
  int get actsLastWeek => events.where((e) => (e ~/ _msPerDay) ~/ 7 == _curWeek - 1).length;

  /// Antal sammenhængende dage med aktivitet frem til i dag/i går.
  /// Antal uger i træk med mindst én handling (0 hvis brudt).
  int get streakWeeks {
    if (events.isEmpty) return 0;
    final weeks = events.map((e) => (e ~/ _msPerDay) ~/ 7).toSet().toList()..sort((a, b) => b - a);
    final tw = (DateTime.now().millisecondsSinceEpoch ~/ _msPerDay) ~/ 7;
    if (weeks.first < tw - 1) return 0;
    var st = 1;
    for (var i = 1; i < weeks.length; i++) {
      if (weeks[i - 1] - weeks[i] == 1) {
        st++;
      } else {
        break;
      }
    }
    return st;
  }

  /// Estimeret antal uger til trin 37 ved nuværende tempo (null hvis ukendt).
  int? get paceWeeks {
    final step = curStep;
    if (step >= kSteps || step == 0 || events.isEmpty) return null;
    final first = events.reduce((a, b) => a < b ? a : b);
    final weeks = (DateTime.now().millisecondsSinceEpoch - first) / (7 * _msPerDay);
    final w = weeks < 1 / 7 ? 1 / 7 : weeks;
    final rate = step / w;
    if (rate <= 0) return null;
    return ((kSteps - step) / rate).ceil();
  }

  double get avgJump =>
      jumps.isEmpty ? 0 : jumps.reduce((a, b) => a + b) / jumps.length;

  String get styleLabel {
    if (jumps.isEmpty) return '—';
    final a = avgJump;
    if (a < 1.5) return 'Stabil klatrer';
    if (a <= 3) return 'Springer';
    return 'Raket';
  }

  /// Minimum salgspris pr. stk. for at en handel rykker dig til næste trin.
  double minSalePrice(Trade t) {
    if (t.left <= 0) return 0;
    return t.unitCost + needForNext / t.left;
  }

  /// Den højeste milepæl der blev passeret mellem [before] og [after] (eller null).
  int? milestoneBetween(int before, int after) {
    int? hit;
    for (var s = before + 1; s <= after; s++) {
      if (kMilestoneSteps.contains(s)) hit = s;
    }
    return hit;
  }

  // --- handlinger ---
  int addDeposit(double amount) {
    final before = curStep;
    deposits.add(amount);
    _logEvent();
    _save();
    return before;
  }

  /// Hæv penge fra kassen (gemmes som negativt indskud). Maks = kasse.
  void withdraw(double amount) {
    final a = amount.clamp(0, cashOnHand);
    if (a <= 0) return;
    deposits.add(-a.toDouble());
    _save();
  }

  void addTrade(String name, int qty, double unitCost, String note) {
    trades.add(Trade(
      id: 't${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      qty: qty,
      unitCost: unitCost,
      note: note,
      date: DateTime.now().millisecondsSinceEpoch,
    ));
    _logEvent();
    _save();
  }

  int sell(String tradeId, int qty, double unitPrice) {
    final t = trades.firstWhere((x) => x.id == tradeId);
    final before = curStep;
    final q = qty.clamp(1, t.left);
    t.sales.add(Sale(qty: q, unitPrice: unitPrice, date: DateTime.now().millisecondsSinceEpoch));
    _logEvent();
    _save();
    return before;
  }

  void editTrade(String id, String name, int qty, double unitCost, String note) {
    final t = trades.firstWhere((x) => x.id == id);
    t.name = name;
    // antal kan ikke saettes lavere end det allerede solgte
    t.qty = qty < t.soldQty ? t.soldQty : qty;
    t.unitCost = unitCost;
    t.note = note;
    _save();
  }

  void removeDeposit(int index) {
    if (index >= 0 && index < deposits.length) {
      deposits.removeAt(index);
      _save();
    }
  }

  void removeSale(String tradeId, int index) {
    final t = trades.firstWhere((x) => x.id == tradeId);
    if (index >= 0 && index < t.sales.length) {
      t.sales.removeAt(index);
      _save();
    }
  }

  void editSale(String tradeId, int index, double unitPrice) {
    final t = trades.firstWhere((x) => x.id == tradeId);
    if (index >= 0 && index < t.sales.length) {
      final old = t.sales[index];
      t.sales[index] = Sale(qty: old.qty, unitPrice: unitPrice, date: old.date);
      _save();
    }
  }

  void deleteTrade(String tradeId) {
    trades.removeWhere((t) => t.id == tradeId);
    _save();
  }

  void reset() {
    trades = [];
    deposits = [];
    events = [];
    jumps = [];
    onboarded = false;
    dreamName = '';
    dreamCost = 0;
    dreamPrompted = false;
    tutorialSeen = 0;
    tutorialDone = false;
    _save();
  }
}

/// Valuta-korrekt talformat. Følger [gCurrency], fx "1.000 kr." / "$1,000".
String fmt(num n) {
  final c = gCurrency;
  final v = n.round();
  final neg = v < 0;
  final digits = v.abs().toString();
  final buf = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) buf.write(c.sep);
    buf.write(digits[i]);
  }
  final number = buf.toString();
  final sign = neg ? '-' : '';
  if (c.prefix) {
    final last = c.symbol[c.symbol.length - 1];
    final space = RegExp(r'[A-Za-z]').hasMatch(last) ? ' ' : '';
    return '$sign${c.symbol}$space$number';
  }
  return '$sign$number ${c.symbol}';
}

String signed(num n) => (n >= 0 ? '+' : '') + fmt(n);
