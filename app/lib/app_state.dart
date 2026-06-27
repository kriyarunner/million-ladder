import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

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

class AppState extends ChangeNotifier {
  List<Trade> trades = [];
  List<double> deposits = [];
  SharedPreferences? _prefs;

  Future<void> load() async {
    _prefs = await SharedPreferences.getInstance();
    final raw = _prefs?.getString('ml');
    if (raw != null) {
      try {
        final j = jsonDecode(raw) as Map<String, dynamic>;
        trades = ((j['trades'] as List?) ?? [])
            .map((e) => Trade.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        deposits = ((j['deposits'] as List?) ?? [])
            .map((e) => (e as num).toDouble())
            .toList();
      } catch (_) {}
    }
    notifyListeners();
  }

  void _save() {
    final data = jsonEncode({
      'trades': trades.map((t) => t.toJson()).toList(),
      'deposits': deposits,
    });
    _prefs?.setString('ml', data);
    notifyListeners();
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

  // --- handlinger ---
  int addDeposit(double amount) {
    final before = curStep;
    deposits.add(amount);
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
    _save();
  }

  int sell(String tradeId, int qty, double unitPrice) {
    final t = trades.firstWhere((x) => x.id == tradeId);
    final before = curStep;
    final q = qty.clamp(1, t.left);
    t.sales.add(Sale(qty: q, unitPrice: unitPrice, date: DateTime.now().millisecondsSinceEpoch));
    _save();
    return before;
  }

  void deleteTrade(String tradeId) {
    trades.removeWhere((t) => t.id == tradeId);
    _save();
  }

  void reset() {
    trades = [];
    deposits = [];
    _save();
  }
}

/// Dansk talformatering: tusindtalsseparator '.' + " kr."
String fmt(num n) {
  final v = n.round();
  final neg = v < 0;
  var s = v.abs().toString();
  final buf = StringBuffer();
  for (var i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 == 0) buf.write('.');
    buf.write(s[i]);
  }
  return '${neg ? '-' : ''}${buf.toString()} kr.';
}

String signed(num n) => (n >= 0 ? '+' : '') + fmt(n);
