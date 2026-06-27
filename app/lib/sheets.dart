import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'app_state.dart';
import 'main.dart';
import 'palette.dart';

double _num(String s) => double.tryParse(s.trim().replaceAll(',', '.')) ?? 0;

String _numStr(double v) =>
    v == v.roundToDouble() ? v.toInt().toString() : v.toString();

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
    {bool number = false, bool autofocus = false}) {
  return TextField(
    controller: c,
    autofocus: autofocus,
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
          onPressed: onTap,
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

// ---------------- Sælg en ting du ejer ----------------
void showSellOwnedSheet(BuildContext context) {
  final name = TextEditingController();
  final price = TextEditingController();
  final t = context.read<AppState>().t;
  _show(context, StatefulBuilder(builder: (ctx, _) {
    return Column(mainAxisSize: MainAxisSize.min, children: [
      _grab(),
      Align(alignment: Alignment.centerLeft, child: _title(t.sellOwnedTitle)),
      Align(
          alignment: Alignment.centerLeft,
          child: _hint(t.sellOwnedHint)),
      Align(alignment: Alignment.centerLeft, child: _label(t.whatSelling)),
      _input(name, t.exampleItem),
      Align(alignment: Alignment.centerLeft, child: _label(t.soldForLabel)),
      _input(price, '0', number: true),
      primaryBtn(t.logSale, () {
        final p = _num(price.text);
        if (p <= 0) {
          toast(t.enterSalePrice);
          return;
        }
        final nm = name.text.trim().isEmpty ? t.startItem : name.text.trim();
        final before = context.read<AppState>().sellOwned(nm, p);
        Navigator.pop(ctx);
        revealStep(context, before);
      }),
      ghostBtn(t.cancel, () => Navigator.pop(ctx)),
    ]);
  }));
}

// ---------------- Ny handel ----------------
void showNewTradeSheet(BuildContext context) {
  final name = TextEditingController();
  final qty = TextEditingController(text: '1');
  final cost = TextEditingController();
  final note = TextEditingController();
  final t = context.read<AppState>().t;
  _show(context, StatefulBuilder(builder: (ctx, _) {
    return SingleChildScrollView(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        _grab(),
        Align(alignment: Alignment.centerLeft, child: _title(t.newTradeTitle)),
        Align(alignment: Alignment.centerLeft, child: _label(t.nameLabel)),
        _input(name, t.exampleItem),
        Row(children: [
          Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _label(t.qtyLabel),
            _input(qty, '1', number: true),
          ])),
          const SizedBox(width: 12),
          Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _label(t.unitPriceLabel),
            _input(cost, '0', number: true),
          ])),
        ]),
        Align(alignment: Alignment.centerLeft, child: _label(t.commentLabel)),
        _input(note, t.commentHint),
        primaryBtn(t.addTradeBtn, () {
          final nm = name.text.trim().isEmpty ? t.tradeWord : name.text.trim();
          final q = (int.tryParse(qty.text.trim()) ?? 1).clamp(1, 1000000);
          context.read<AppState>().addTrade(nm, q, _num(cost.text), note.text.trim());
          Navigator.pop(ctx);
          toast(t.tradeAdded, good: true);
        }),
        ghostBtn(t.cancel, () => Navigator.pop(ctx)),
      ]),
    );
  }));
}

// ---------------- Rediger handel ----------------
void showEditTradeSheet(BuildContext context, Trade t) {
  final name = TextEditingController(text: t.name);
  final qty = TextEditingController(text: '${t.qty}');
  final cost = TextEditingController(text: t.unitCost == 0 ? '' : _numStr(t.unitCost));
  final note = TextEditingController(text: t.note);
  final tr = context.read<AppState>().t;
  _show(context, StatefulBuilder(builder: (ctx, _) {
    return SingleChildScrollView(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        _grab(),
        Align(alignment: Alignment.centerLeft, child: _title(tr.editTradeTitle)),
        Align(alignment: Alignment.centerLeft, child: _label(tr.nameLabel)),
        _input(name, tr.exampleItem),
        Row(children: [
          Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _label(tr.qtyLabel),
            _input(qty, '1', number: true),
          ])),
          const SizedBox(width: 12),
          Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _label(tr.unitPriceLabel),
            _input(cost, '0', number: true),
          ])),
        ]),
        if (t.soldQty > 0)
          Align(
              alignment: Alignment.centerLeft,
              child: Padding(
                padding: const EdgeInsets.only(top: 6, left: 2),
                child: Text(tr.minQtyNote(t.soldQty),
                    style: const TextStyle(color: P.muted, fontSize: 12.5)),
              )),
        Align(alignment: Alignment.centerLeft, child: _label(tr.commentLabel)),
        _input(note, tr.commentHint),
        primaryBtn(tr.saveChanges, () {
          final nm = name.text.trim().isEmpty ? tr.tradeWord : name.text.trim();
          final q = (int.tryParse(qty.text.trim()) ?? t.qty).clamp(1, 1000000);
          context.read<AppState>().editTrade(t.id, nm, q, _num(cost.text), note.text.trim());
          Navigator.pop(ctx);
          toast(tr.tradeUpdated, good: true);
        }),
        ghostBtn(tr.cancel, () => Navigator.pop(ctx)),
      ]),
    );
  }));
}

// ---------------- Detalje / salg / slet ----------------
void showTradeDetailSheet(BuildContext context, Trade t) {
  final qtyC = TextEditingController(text: '${t.left}');
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
                  onPressed: () {
                    context.read<AppState>().removeSale(t.id, i);
                    qtyC.text = '${t.left}';
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
          Align(
              alignment: Alignment.centerLeft,
              child: _label(tr.sellMax(t.left))),
          _input(qtyC, '${t.left}', number: true),
          Align(alignment: Alignment.centerLeft, child: _label(tr.salePricePerUnit)),
          _input(priceC, '0', number: true),
          primaryBtn(tr.logSale, () {
            final q = (int.tryParse(qtyC.text.trim()) ?? 1).clamp(1, t.left);
            final p = _num(priceC.text);
            final before = context.read<AppState>().sell(t.id, q, p);
            Navigator.pop(ctx);
            revealStep(context, before);
          }),
        ],
        ghostBtn(tr.deleteTrade, () {
          context.read<AppState>().deleteTrade(t.id);
          Navigator.pop(ctx);
          toast(tr.tradeDeleted);
        }, color: P.red),
        ghostBtn(tr.close, () => Navigator.pop(ctx)),
      ]),
    );
  }));
}
