import 'dart:convert';
import 'dart:math' as math;
import 'dart:ui' as ui;
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'i18n.dart';

const int kSteps = 37;
const double kFirst = 1000;
const double kTarget = 1000000;

/// Trappens 38 niveauer: indeks 0 = start (0 kr.), 1..37 vokser til 1.000.000.
final List<double> kLadder = _buildLadder();
List<double> _buildLadder() {
  final r = math.pow(kTarget / kFirst, 1 / (kSteps - 1)).toDouble();
  final list = <double>[0];
  for (var i = 1; i <= kSteps; i++) {
    list.add((kFirst * math.pow(r, i - 1)).roundToDouble());
  }
  list[kSteps] = kTarget;
  return list;
}

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

/// Trin der udløser en milepæls-fejring (fuldskærm).
const Set<int> kMilestoneSteps = {9, 19, 28, 37};
const Map<int, String> kMilestoneEmoji = {9: '🎉', 19: '⚡️', 28: '💎', 37: '👑'};

const int _msPerDay = 86400000;

class AppState extends ChangeNotifier {
  List<Trade> trades = [];
  List<double> deposits = [];
  List<int> events = []; // tidsstempler for aktivitet (streak)
  List<int> jumps = []; // antal trin pr. opryk (til "din style")
  bool onboarded = false;
  AppLang lang = AppLang.da;
  SharedPreferences? _prefs;

  Tr get t => Tr(lang);

  Future<void> load() async {
    _prefs = await SharedPreferences.getInstance();
    final raw = _prefs?.getString('ml');
    String? savedLang;
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
        savedLang = j['lang'] as String?;
      } catch (_) {}
    }
    // gemt valg vinder; ellers auto-detektér fra telefonens sprog
    lang = savedLang != null
        ? langFromCode(savedLang)
        : langFromCode(ui.PlatformDispatcher.instance.locale.languageCode);
    gLang = lang;
    notifyListeners();
  }

  void setLang(AppLang l) {
    lang = l;
    gLang = l;
    _save();
  }

  void _save() {
    gLang = lang;
    final data = jsonEncode({
      'trades': trades.map((t) => t.toJson()).toList(),
      'deposits': deposits,
      'events': events,
      'jumps': jumps,
      'onboarded': onboarded,
      'lang': lang == AppLang.en ? 'en' : 'da',
    });
    _prefs?.setString('ml', data);
    notifyListeners();
  }

  void _logEvent() => events.add(DateTime.now().millisecondsSinceEpoch);

  void setOnboarded() {
    onboarded = true;
    _save();
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

  int sellOwned(String name, double price) {
    final before = curStep;
    trades.add(Trade(
      id: 't${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      qty: 1,
      unitCost: 0,
      note: 'Startgenstand',
      date: DateTime.now().millisecondsSinceEpoch,
      sales: [Sale(qty: 1, unitPrice: price, date: DateTime.now().millisecondsSinceEpoch)],
    ));
    _logEvent();
    _save();
    return before;
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

  void removeSale(String tradeId, int index) {
    final t = trades.firstWhere((x) => x.id == tradeId);
    if (index >= 0 && index < t.sales.length) {
      t.sales.removeAt(index);
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
    _save();
  }
}

/// Locale-korrekt talformat. Dansk: "1.000 kr." · Engelsk: "$1,000".
String fmt(num n) {
  final v = n.round();
  final neg = v < 0;
  final digits = v.abs().toString();
  final sep = gLang == AppLang.en ? ',' : '.';
  final buf = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) buf.write(sep);
    buf.write(digits[i]);
  }
  final number = buf.toString();
  if (gLang == AppLang.en) return '${neg ? '-' : ''}\$$number';
  return '${neg ? '-' : ''}$number kr.';
}

String signed(num n) => (n >= 0 ? '+' : '') + fmt(n);
