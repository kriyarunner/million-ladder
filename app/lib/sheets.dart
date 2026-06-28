import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import 'app_state.dart';
import 'main.dart';
import 'palette.dart';

/// Robust tal-parser der forstår både dansk og engelsk format,
/// inkl. tusind-separatorer: "1.000.000", "1,000,000", "1.234,56", "1,234.56".
double _num(String s) {
  var x = s.replaceAll(RegExp(r'[^0-9.,]'), '');
  if (x.isEmpty) return 0;
  final lastComma = x.lastIndexOf(',');
  final lastDot = x.lastIndexOf('.');
  final decPos = lastComma > lastDot ? lastComma : lastDot;
  if (decPos == -1) return double.tryParse(x) ?? 0;
  final intPart = x.substring(0, decPos).replaceAll(RegExp(r'[.,]'), '');
  final fracPart = x.substring(decPos + 1).replaceAll(RegExp(r'[.,]'), '');
  // 3+ "decimaler" betyder at separatoren var en tusind-separator, ikke en komma
  if (fracPart.length >= 3) return double.tryParse('$intPart$fracPart') ?? 0;
  return double.tryParse('${intPart.isEmpty ? '0' : intPart}.$fracPart') ?? 0;
}

String _numStr(double v) =>
    v == v.roundToDouble() ? v.toInt().toString() : v.toString();

/// Generisk bekræft-dialog. Returnerer true hvis brugeren bekræfter.
Future<bool> confirmDialog(
    BuildContext context, String title, String body, String confirmLabel) async {
  final t = context.read<AppState>().t;
  final res = await showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      backgroundColor: P.surface,
      title: Text(title, style: const TextStyle(color: P.txt)),
      content: Text(body, style: const TextStyle(color: P.muted)),
      actions: [
        TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text(t.cancel, style: const TextStyle(color: P.muted))),
        TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: Text(confirmLabel,
                style: const TextStyle(color: P.red, fontWeight: FontWeight.w800))),
      ],
    ),
  );
  return res ?? false;
}

Future<void> _show(BuildContext context, Widget child) {
  return showModalBottomSheet(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: true,
    builder: (ctx) => Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
      child: Container(
        decoration: const BoxDecoration(
          color: P.surface,
          border: Border(
            top: BorderSide(color: P.line),
            left: BorderSide(color: P.line),
            right: BorderSide(color: P.line),
          ),
          borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
        ),
        padding: const EdgeInsets.fromLTRB(20, 14, 20, 28),
        child: SafeArea(top: false, child: child),
      ),
    ),
  );
}

Widget _grab() => Center(
      child: Container(
        width: 40,
        height: 5,
        margin: const EdgeInsets.only(bottom: 14),
        decoration: BoxDecoration(
            color: const Color(0xFF2C313A), borderRadius: BorderRadius.circular(99)),
      ),
    );

Widget _title(String t) => Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Text(t, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
    );

Widget _hint(String t) => Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(t, style: const TextStyle(color: P.muted, fontSize: 14)),
    );

Widget _label(String t) => Padding(
      padding: const EdgeInsets.fromLTRB(2, 14, 0, 6),
      child: Text(t,
          style: const TextStyle(
              color: P.muted, fontSize: 12.5, fontWeight: FontWeight.w600)),
    );

Widget _input(TextEditingController c, String hint,
    {bool number = false, bool autofocus = false, ValueChanged<String>? onChanged}) {
  return TextField(
    controller: c,
    autofocus: autofocus,
    onChanged: onChanged,
    keyboardType: number
        ? const TextInputType.numberWithOptions(decimal: true)
        : TextInputType.text,
    style: const TextStyle(color: P.txt, fontSize: 15),
    cursorColor: P.accent,
    decoration: InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: P.muted),
      filled: true,
      fillColor: P.surface2,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(13),
        borderSide: const BorderSide(color: P.line),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(13),
        borderSide: const BorderSide(color: P.accent),
      ),
    ),
  );
}

Widget primaryBtn(String label, VoidCallback onTap) => Padding(
      padding: const EdgeInsets.only(top: 18),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: P.accent,
            foregroundColor: const Color(0xFF05130B),
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          onPressed: () {
            HapticFeedback.selectionClick();
            onTap();
          },
          child: Text(label,
              style: const TextStyle(fontSize: 16.5, fontWeight: FontWeight.w800)),
        ),
      ),
    );

Widget ghostBtn(String label, VoidCallback onTap, {Color? color}) => Padding(
      padding: const EdgeInsets.only(top: 10),
      child: SizedBox(
        width: double.infinity,
        child: OutlinedButton(
          style: OutlinedButton.styleFrom(
            backgroundColor: P.surface2,
            foregroundColor: color ?? P.txt,
            padding: const EdgeInsets.symmetric(vertical: 16),
            side: const BorderSide(color: P.line),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          onPressed: onTap,
          child: Text(label,
              style: const TextStyle(fontSize: 16.5, fontWeight: FontWeight.w700)),
        ),
      ),
    );

// ---------------- Indskud ----------------
void showDepositSheet(BuildContext context) {
  final amt = TextEditingController();
  final t = context.read<AppState>().t;
  final fresh = context.read<AppState>().isFresh;
  _show(context, StatefulBuilder(builder: (ctx, _) {
    return Column(mainAxisSize: MainAxisSize.min, children: [
      _grab(),
      Align(alignment: Alignment.centerLeft, child: _title(t.addMoney)),
      Align(
          alignment: Alignment.centerLeft,
          child: _hint(fresh ? t.depositHintFresh : t.depositHint)),
      Align(alignment: Alignment.centerLeft, child: _label(t.amountLabel)),
      _input(amt, '0', number: true, autofocus: true),
      primaryBtn(t.addBtn, () {
        final v = _num(amt.text);
        if (v <= 0) {
          toast(t.enterAmount);
          return;
        }
        final before = context.read<AppState>().addDeposit(v);
        Navigator.pop(ctx);
        revealStep(context, before);
      }),
      ghostBtn(t.cancel, () => Navigator.pop(ctx)),
    ]);
  }));
}

// ---------------- Tag penge ud ----------------
void showWithdrawSheet(BuildContext context) {
  final amt = TextEditingController();
  final st = context.read<AppState>();
  final t = st.t;
  final maxOut = st.cashOnHand;
  _show(context, StatefulBuilder(builder: (ctx, _) {
    return Column(mainAxisSize: MainAxisSize.min, children: [
      _grab(),
      Align(alignment: Alignment.centerLeft, child: _title(t.withdrawTitle)),
      Align(alignment: Alignment.centerLeft, child: _hint(t.withdrawHint)),
      Align(alignment: Alignment.centerLeft, child: _label(t.amountLabel)),
      _input(amt, '0', number: true, autofocus: true),
      Padding(
        padding: const EdgeInsets.only(top: 8, left: 2),
        child: Align(
          alignment: Alignment.centerLeft,
          child: Text(t.withdrawMax(fmt(maxOut)),
              style: const TextStyle(color: P.gold, fontSize: 12.5, fontWeight: FontWeight.w700)),
        ),
      ),
      primaryBtn(t.withdrawBtn, () {
        final v = _num(amt.text);
        if (v <= 0) {
          toast(t.enterAmount);
          return;
        }
        if (v > maxOut) {
          toast(t.withdrawTooMuch);
          return;
        }
        context.read<AppState>().withdraw(v);
        Navigator.pop(ctx);
        toast(t.withdrawn, good: true);
      }),
      ghostBtn(t.cancel, () => Navigator.pop(ctx)),
    ]);
  }));
}

// ---------------- Rediger drøm ----------------
void showDreamSheet(BuildContext context) {
  final st = context.read<AppState>();
  final t = st.t;
  final name = TextEditingController(text: st.dreamName);
  final cost = TextEditingController(text: st.dreamCost > 0 ? _numStr(st.dreamCost) : '');
  _show(context, StatefulBuilder(builder: (ctx, setSheet) {
    final hasName = name.text.trim().isNotEmpty;
    final hasCost = _num(cost.text) > 0;
    return SingleChildScrollView(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        _grab(),
        Align(alignment: Alignment.centerLeft, child: _title(t.dreamLabel)),
        Align(alignment: Alignment.centerLeft, child: _label(t.dreamNameQ)),
        _input(name, t.dreamNameHint,
            autofocus: true, onChanged: (_) => setSheet(() {})),
        if (hasName) ...[
          Align(alignment: Alignment.centerLeft, child: _label(t.dreamCostQ)),
          _input(cost, '0', number: true, onChanged: (_) => setSheet(() {})),
        ],
        if (hasName && hasCost)
          primaryBtn(t.saveChanges, () {
            context.read<AppState>().setDream(name.text, _num(cost.text));
            Navigator.pop(ctx);
            toast(t.dreamSaved, good: true);
          }),
        ghostBtn(t.cancel, () => Navigator.pop(ctx)),
      ]),
    );
  }));
}

// ---------------- Vælger: Køb eller Salg ----------------
Widget _choiceTile(IconData icon, String title, String sub, VoidCallback onTap) =>
    Padding(
      padding: const EdgeInsets.only(top: 10),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          decoration: BoxDecoration(
            color: P.surface2,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: P.line),
          ),
          child: Row(children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                  color: P.accent.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: P.accent, size: 23),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(title,
                    style: const TextStyle(fontSize: 16.5, fontWeight: FontWeight.w800)),
                const SizedBox(height: 2),
                Text(sub, style: const TextStyle(color: P.muted, fontSize: 13)),
              ]),
            ),
            const Icon(Icons.chevron_right, color: P.muted, size: 22),
          ]),
        ),
      ),
    );

void showAddActionSheet(BuildContext context) {
  final t = context.read<AppState>().t;
  _show(context, Column(mainAxisSize: MainAxisSize.min, children: [
    _grab(),
    Align(alignment: Alignment.centerLeft, child: _title(t.addChooseTitle)),
    const SizedBox(height: 6),
    _choiceTile(Icons.sell_outlined, t.sellChoiceTitle, t.sellChoiceSub, () {
      Navigator.pop(context);
      showSellOwnedSheet(context);
    }),
    _choiceTile(Icons.shopping_bag_outlined, t.buyChoiceTitle, t.buyChoiceSub, () {
      Navigator.pop(context);
      showNewTradeSheet(context);
    }),
    ghostBtn(t.cancel, () => Navigator.pop(context)),
  ]));
}

// ---------------- Sæt til salg (opret en vare du ejer, ikke solgt endnu) ----------------
void showSellOwnedSheet(BuildContext context) {
  final name = TextEditingController();
  final t = context.read<AppState>().t;
  _show(context, StatefulBuilder(builder: (ctx, setSheet) {
    final hasName = name.text.trim().isNotEmpty;
    return SingleChildScrollView(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        _grab(),
        Align(alignment: Alignment.centerLeft, child: _title(t.sellChoiceTitle)),
        Align(alignment: Alignment.centerLeft, child: _hint(t.listHint)),
        Align(alignment: Alignment.centerLeft, child: _label(t.listNameQ)),
        _input(name, t.exampleItem,
            autofocus: true, onChanged: (_) => setSheet(() {})),
        if (hasName)
          primaryBtn(t.listForSale, () {
            context.read<AppState>().addTrade(name.text.trim(), 1, 0, '');
            Navigator.pop(ctx);
            toast(t.listedForSale, good: true);
          }),
        ghostBtn(t.cancel, () => Navigator.pop(ctx)),
      ]),
    );
  }));
}

// ---------------- Køb (progressiv: navn → pris → knap) ----------------
void showNewTradeSheet(BuildContext context) {
  final name = TextEditingController();
  final cost = TextEditingController();
  final dep = TextEditingController();
  final t = context.read<AppState>().t;
  _show(context, StatefulBuilder(builder: (ctx, setSheet) {
    final cash = context.read<AppState>().cashOnHand;
    final hasName = name.text.trim().isNotEmpty;
    final price = _num(cost.text);
    final hasPrice = price > 0;
    final tooExpensive = hasPrice && price > cash;
    return SingleChildScrollView(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        _grab(),
        Align(alignment: Alignment.centerLeft, child: _title(t.buyTitle)),
        Align(alignment: Alignment.centerLeft, child: _label(t.buyNameQ)),
        _input(name, t.exampleItem,
            autofocus: true, onChanged: (_) => setSheet(() {})),
        if (hasName) ...[
          Align(alignment: Alignment.centerLeft, child: _label(t.buyPriceQ)),
          _input(cost, '0', number: true, onChanged: (_) => setSheet(() {})),
          Padding(
            padding: const EdgeInsets.only(top: 8, left: 2),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                cash <= 0 ? t.noBuyingPower : t.buyingPower(fmt(cash)),
                style: TextStyle(
                    color: cash <= 0 ? P.muted : P.gold,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
        // For dyrt: sæt penge ind uden at forlade købet
        if (hasName && hasPrice && tooExpensive) ...[
          Padding(
            padding: const EdgeInsets.only(top: 10, left: 2),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(t.buyTooExpensive(fmt(price - cash)),
                  style: const TextStyle(color: P.red, fontSize: 13, fontWeight: FontWeight.w700)),
            ),
          ),
          Align(alignment: Alignment.centerLeft, child: _label(t.addMoneyToBuy)),
          Row(children: [
            Expanded(
                child: _input(dep, fmt(price - cash),
                    number: true, onChanged: (_) => setSheet(() {}))),
            const SizedBox(width: 10),
            SizedBox(
              height: 52,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: P.surface2,
                  foregroundColor: P.accent,
                  side: const BorderSide(color: P.accent),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(13)),
                ),
                onPressed: () {
                  final d = _num(dep.text);
                  final amt = d > 0 ? d : (price - cash);
                  context.read<AppState>().addDeposit(amt);
                  dep.clear();
                  setSheet(() {});
                },
                child: Text(t.addInline,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
              ),
            ),
          ]),
        ],
        if (hasName && hasPrice && !tooExpensive)
          primaryBtn(t.addBuyBtn, () {
            context.read<AppState>().addTrade(name.text.trim(), 1, price, '');
            Navigator.pop(ctx);
            toast(t.tradeAdded, good: true);
          }),
        ghostBtn(t.cancel, () => Navigator.pop(ctx)),
      ]),
    );
  }));
}

// ---------------- Solgt: vælg en aktiv vare → hurtigt salg ----------------
void showSellPickerSheet(BuildContext context) {
  final st = context.read<AppState>();
  final t = st.t;
  final active = st.activeTrades.reversed.toList();
  _show(context, Column(mainAxisSize: MainAxisSize.min, children: [
    _grab(),
    Align(alignment: Alignment.centerLeft, child: _title(t.sellPickerTitle)),
    const SizedBox(height: 4),
    if (active.isEmpty)
      Padding(
        padding: const EdgeInsets.symmetric(vertical: 24),
        child: Text(t.sellPickerEmpty,
            textAlign: TextAlign.center, style: const TextStyle(color: P.muted)),
      )
    else
      ConstrainedBox(
        constraints: const BoxConstraints(maxHeight: 360),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: active.map((tr) => _sellPickRow(context, tr)).toList(),
          ),
        ),
      ),
    ghostBtn(t.cancel, () => Navigator.pop(context)),
  ]));
}

Widget _sellPickRow(BuildContext context, Trade tr) => Padding(
      padding: const EdgeInsets.only(top: 10),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () {
          Navigator.pop(context);
          showQuickSellSheet(context, tr);
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: P.surface2,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: P.line),
          ),
          child: Row(children: [
            Expanded(
              child: Text(tr.name,
                  style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.w700)),
            ),
            Text(fmt(tr.cost),
                style: const TextStyle(color: P.muted, fontSize: 13.5, fontWeight: FontWeight.w600)),
            const SizedBox(width: 8),
            const Icon(Icons.chevron_right, color: P.muted, size: 22),
          ]),
        ),
      ),
    );

// ---------------- Hurtigt salg af én vare (kun pris) ----------------
void showQuickSellSheet(BuildContext context, Trade trade) {
  final price = TextEditingController();
  final t = context.read<AppState>().t;
  _show(context, StatefulBuilder(builder: (ctx, setSheet) {
    final hasPrice = _num(price.text) > 0;
    return SingleChildScrollView(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        _grab(),
        Align(alignment: Alignment.centerLeft, child: _title(trade.name)),
        Align(alignment: Alignment.centerLeft, child: _label(t.sellPriceQ)),
        _input(price, '0', number: true, autofocus: true, onChanged: (_) => setSheet(() {})),
        if (hasPrice)
          primaryBtn(t.logSale, () {
            final p = _num(price.text);
            if (p <= 0) return;
            final before = context.read<AppState>().sell(trade.id, trade.left, p);
            Navigator.pop(ctx);
            revealStep(context, before);
          }),
        ghostBtn(t.cancel, () => Navigator.pop(ctx)),
      ]),
    );
  }));
}

// ---------------- Rediger handel ----------------
void showEditTradeSheet(BuildContext context, Trade t) {
  final name = TextEditingController(text: t.name);
  final cost = TextEditingController(text: t.unitCost == 0 ? '' : _numStr(t.unitCost));
  final tr = context.read<AppState>().t;
  _show(context, StatefulBuilder(builder: (ctx, _) {
    return SingleChildScrollView(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        _grab(),
        Align(alignment: Alignment.centerLeft, child: _title(tr.editTradeTitle)),
        Align(alignment: Alignment.centerLeft, child: _label(tr.nameLabel)),
        _input(name, tr.exampleItem),
        Align(alignment: Alignment.centerLeft, child: _label(tr.buyPrice)),
        _input(cost, '0', number: true),
        primaryBtn(tr.saveChanges, () {
          final nm = name.text.trim().isEmpty ? tr.tradeWord : name.text.trim();
          context.read<AppState>().editTrade(t.id, nm, t.qty, _num(cost.text), '');
          Navigator.pop(ctx);
          toast(tr.tradeUpdated, good: true);
        }),
        ghostBtn(tr.cancel, () => Navigator.pop(ctx)),
      ]),
    );
  }));
}

Future<void> showEditSaleSheet(
    BuildContext context, String tradeId, int index, double price) {
  final priceC = TextEditingController(text: price == 0 ? '' : _numStr(price));
  final tr = context.read<AppState>().t;
  return _show(context, StatefulBuilder(builder: (ctx, _) {
    return SingleChildScrollView(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        _grab(),
        Align(alignment: Alignment.centerLeft, child: _title(tr.editSaleTitle)),
        Align(alignment: Alignment.centerLeft, child: _label(tr.sellPriceQ)),
        _input(priceC, '0', number: true, autofocus: true),
        primaryBtn(tr.saveChanges, () {
          final p = _num(priceC.text);
          if (p <= 0) return;
          context.read<AppState>().editSale(tradeId, index, p);
          Navigator.pop(ctx);
          toast(tr.saleUpdated, good: true);
        }),
        ghostBtn(tr.cancel, () => Navigator.pop(ctx)),
      ]),
    );
  }));
}

// ---------------- Detalje / salg / slet ----------------
void showTradeDetailSheet(BuildContext context, Trade t) {
  final priceC = TextEditingController();
  final tr = context.read<AppState>().t;
  _show(context, StatefulBuilder(builder: (ctx, setSheet) {
    final closed = t.isClosed;
    Widget mini(String k, String v, {Color? c}) => Expanded(
          child: Container(
            margin: const EdgeInsets.only(top: 10),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
                color: P.surface2,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: P.line)),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(k, style: const TextStyle(color: P.muted, fontSize: 12)),
              const SizedBox(height: 4),
              Text(v,
                  style: TextStyle(
                      fontSize: 17, fontWeight: FontWeight.w800, color: c ?? P.txt)),
            ]),
          ),
        );
    return SingleChildScrollView(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        _grab(),
        Row(children: [
          Expanded(child: _title(t.name)),
          IconButton(
            onPressed: () {
              Navigator.pop(ctx);
              showEditTradeSheet(context, t);
            },
            icon: const Icon(Icons.edit_outlined, color: P.muted, size: 22),
            tooltip: tr.edit,
          ),
        ]),
        Row(children: [
          mini(tr.buyPrice, fmt(t.cost)),
          const SizedBox(width: 12),
          mini(tr.soldFor, fmt(t.revenue)),
        ]),
        Row(children: [
          mini(tr.leftLabel, tr.leftOfQty(t.left, t.qty)),
          const SizedBox(width: 12),
          mini(tr.profit, signed(t.realized),
              c: t.realized >= 0 ? P.accent : P.red),
        ]),
        if (t.sales.isNotEmpty) ...[
          Align(alignment: Alignment.centerLeft, child: _label(tr.loggedSales)),
          ...List.generate(t.sales.length, (i) {
            final sale = t.sales[i];
            return Container(
              margin: const EdgeInsets.only(top: 8),
              padding: const EdgeInsets.fromLTRB(14, 6, 6, 6),
              decoration: BoxDecoration(
                  color: P.surface2,
                  borderRadius: BorderRadius.circular(13),
                  border: Border.all(color: P.line)),
              child: Row(children: [
                Text(tr.saleLine(sale.qty, fmt(sale.unitPrice)),
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                const Spacer(),
                Text(fmt(sale.qty * sale.unitPrice),
                    style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.w800, color: P.accent)),
                IconButton(
                  onPressed: () async {
                    await showEditSaleSheet(context, t.id, i, sale.unitPrice);
                    if (!context.mounted) return;
                    setSheet(() {});
                  },
                  icon: const Icon(Icons.edit_outlined, size: 18, color: P.muted),
                  tooltip: tr.edit,
                ),
                IconButton(
                  onPressed: () async {
                    final ok = await confirmDialog(
                        context, tr.removeSaleQ, tr.removeSaleBody, tr.removeSale);
                    if (!ok || !context.mounted) return;
                    context.read<AppState>().removeSale(t.id, i);
                    setSheet(() {});
                    toast(tr.saleRemoved);
                  },
                  icon: const Icon(Icons.close, size: 18, color: P.muted),
                  tooltip: tr.removeSale,
                ),
              ]),
            );
          }),
        ],
        if (closed)
          Padding(
            padding: const EdgeInsets.only(top: 18),
            child: Text(tr.tradeClosed, style: const TextStyle(color: P.muted)),
          )
        else ...[
          Align(alignment: Alignment.centerLeft, child: _label(tr.sellPriceQ)),
          _input(priceC, '0', number: true),
          primaryBtn(tr.logSale, () {
            final p = _num(priceC.text);
            if (p <= 0) return;
            final before = context.read<AppState>().sell(t.id, t.left, p);
            Navigator.pop(ctx);
            revealStep(context, before);
          }),
        ],
        ghostBtn(tr.deleteTrade, () async {
          final ok = await confirmDialog(
              context, tr.deleteTradeQ, tr.deleteTradeBody, tr.deleteTrade);
          if (!ok || !context.mounted) return;
          context.read<AppState>().deleteTrade(t.id);
          if (ctx.mounted) Navigator.pop(ctx);
          toast(tr.tradeDeleted);
        }, color: P.red),
        ghostBtn(tr.close, () => Navigator.pop(ctx)),
      ]),
    );
  }));
}
