import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'app_state.dart';
import 'main.dart';
import 'palette.dart';
import 'sheets.dart';

// ---------- fælles widgets ----------
class _Eyebrow extends StatelessWidget {
  final String t;
  const _Eyebrow(this.t);
  @override
  Widget build(BuildContext context) => Text(t.toUpperCase(),
      style: const TextStyle(
          color: P.muted, fontSize: 13, letterSpacing: 1.4, fontWeight: FontWeight.w700));
}

class _Mini extends StatelessWidget {
  final String k;
  final String v;
  final Color? color;
  const _Mini(this.k, this.v, {this.color});
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
            color: P.surface,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: P.line)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(k, style: const TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Text(v, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: color ?? P.txt)),
        ]),
      ),
    );
  }
}

class _Card extends StatelessWidget {
  final Widget child;
  final bool highlight;
  const _Card({required this.child, this.highlight = false});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: highlight
            ? const LinearGradient(
                begin: Alignment.topRight,
                end: Alignment.bottomLeft,
                colors: [Color(0xFF10231A), Color(0xFF0B0D10)])
            : null,
        color: highlight ? null : P.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: highlight ? P.accentDim : P.line),
      ),
      child: child,
    );
  }
}

Widget _tradeRow(BuildContext context, Trade t) {
  final closed = t.isClosed;
  final mono = (t.name.isEmpty ? '?' : t.name.trim()[0]).toUpperCase();
  final sub = closed
      ? 'Lukket · ${t.qty} stk.'
      : (t.soldQty > 0 ? '${t.left} af ${t.qty} tilbage' : '${t.qty} stk. · ${fmt(t.unitCost)}/stk');
  return InkWell(
    onTap: () => showTradeDetailSheet(context, t),
    borderRadius: BorderRadius.circular(18),
    child: Container(
      margin: const EdgeInsets.only(top: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
      decoration: BoxDecoration(
          color: P.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: P.line)),
      child: Row(children: [
        Container(
          width: 44,
          height: 44,
          alignment: Alignment.center,
          decoration: BoxDecoration(
              color: P.surface2, borderRadius: BorderRadius.circular(13), border: Border.all(color: P.line)),
          child: Text(mono,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: P.muted)),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(t.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
            const SizedBox(height: 2),
            Text(sub, style: const TextStyle(color: P.muted, fontSize: 12.5)),
          ]),
        ),
        Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text(t.soldQty > 0 ? signed(t.realized) : fmt(t.cost),
              style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: t.soldQty > 0 ? (t.realized >= 0 ? P.accent : P.red) : P.txt)),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
            decoration: BoxDecoration(
                color: closed ? P.accentDim : const Color(0xFF2A2410),
                borderRadius: BorderRadius.circular(99)),
            child: Text(closed ? 'Lukket' : 'Aktiv',
                style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: closed ? const Color(0xFF9BF3C2) : P.gold)),
          ),
        ]),
      ]),
    ),
  );
}

Widget _newTradeFab(BuildContext context) => Positioned(
      left: 20,
      right: 20,
      bottom: 16,
      child: SizedBox(
        height: 56,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: P.accent,
            foregroundColor: const Color(0xFF05130B),
            elevation: 8,
            shadowColor: P.accent.withValues(alpha: 0.4),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          ),
          onPressed: () => showNewTradeSheet(context),
          child: const Text('+ Ny handel',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
        ),
      ),
    );

// ---------- HOME ----------
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(builder: (context, s, _) {
      final step = s.curStep;
      final cap = s.capital;
      final atTop = step >= kSteps;
      final prev = kLadder[step];
      final pct = atTop ? 1.0 : ((cap - prev) / (s.nextTarget - prev)).clamp(0.0, 1.0);
      return Stack(children: [
        ListView(
          padding: const EdgeInsets.fromLTRB(20, 60, 20, 100),
          children: [
            const _Eyebrow('Din kapital'),
            const SizedBox(height: 6),
            Text(fmt(cap),
                style: const TextStyle(fontSize: 52, fontWeight: FontWeight.w800, letterSpacing: -1.5, height: 1)),
            const SizedBox(height: 8),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text.rich(TextSpan(children: [
                const TextSpan(text: 'Trin ', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
                TextSpan(text: '$step', style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: P.gold)),
                const TextSpan(text: '/37', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
              ])),
              Text(atTop ? 'Million nået!' : 'Næste mål: ${fmt(s.nextTarget)}',
                  style: const TextStyle(color: P.muted, fontSize: 15)),
            ]),
            const SizedBox(height: 14),
            _ProgressBar(pct: pct),
            if (s.isFresh)
              _Card(
                highlight: true,
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Text('KOM I GANG',
                      style: TextStyle(color: Color(0xFFBDF3D4), fontSize: 13, fontWeight: FontWeight.w700, letterSpacing: 0.6)),
                  const SizedBox(height: 6),
                  const Text('Du starter på 0 kr. Vælg hvordan din rejse mod millionen begynder.',
                      style: TextStyle(color: Color(0xFFD6F5E3))),
                  primaryBtn('Sælg en ting du ejer', () => showSellOwnedSheet(context)),
                  ghostBtn('Sæt penge ind', () => showDepositSheet(context)),
                ]),
              )
            else
              _Card(
                highlight: true,
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Text('DIT NÆSTE SALG SKAL MINIMUM GIVE',
                      style: TextStyle(color: Color(0xFFBDF3D4), fontSize: 12.5, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                  const SizedBox(height: 6),
                  Text(atTop ? 'Million!' : signed(s.needForNext),
                      style: const TextStyle(fontSize: 34, fontWeight: FontWeight.w800, color: P.accent, letterSpacing: -0.5)),
                  const SizedBox(height: 6),
                  Text(
                      atTop
                          ? 'Du har besteget alle 37 trin.'
                          : 'Så rammer du trin ${step + 1}. Sælg bedre = spring trin over.',
                      style: const TextStyle(color: P.muted, fontSize: 13)),
                ]),
              ),
            const SizedBox(height: 14),
            Row(children: [
              _Mini('I kassen', fmt(s.cashOnHand), color: s.cashOnHand < 0 ? P.red : P.txt),
              const SizedBox(width: 12),
              _Mini('Bundet i handler', fmt(s.boundCapital)),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              _Mini('Samlet profit', signed(s.realizedTotal), color: s.realizedTotal >= 0 ? P.accent : P.red),
              const SizedBox(width: 12),
              _Mini('Aktive handler', '${s.activeTrades.length}'),
            ]),
            const SizedBox(height: 12),
            ghostBtn('+ Sæt penge ind', () => showDepositSheet(context)),
            const SizedBox(height: 24),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              const Text('Aktive handler', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
              GestureDetector(
                  onTap: () => tabIndex.value = 1,
                  child: const Text('Se alle', style: TextStyle(color: P.accent, fontSize: 14, fontWeight: FontWeight.w600))),
            ]),
            if (s.activeTrades.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 28),
                child: Text('Ingen aktive handler endnu.\nTryk "+ Ny handel" for at starte.',
                    textAlign: TextAlign.center, style: TextStyle(color: P.muted)),
              )
            else
              ...s.activeTrades.map((t) => _tradeRow(context, t)),
          ],
        ),
        _newTradeFab(context),
      ]);
    });
  }
}

class _ProgressBar extends StatelessWidget {
  final double pct;
  const _ProgressBar({required this.pct});
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 14,
      decoration: BoxDecoration(
          color: P.surface2, borderRadius: BorderRadius.circular(99), border: Border.all(color: P.line)),
      child: FractionallySizedBox(
        alignment: Alignment.centerLeft,
        widthFactor: pct,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(99),
            gradient: const LinearGradient(colors: [P.accent, Color(0xFF8BF0B8)]),
          ),
        ),
      ),
    );
  }
}

// ---------- HANDLER ----------
class TradesScreen extends StatelessWidget {
  const TradesScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(builder: (context, s, _) {
      final list = s.trades.reversed.toList();
      return Stack(children: [
        ListView(
          padding: const EdgeInsets.fromLTRB(20, 60, 20, 100),
          children: [
            const _Eyebrow('Dine handler'),
            const SizedBox(height: 6),
            const Text('Handler', style: TextStyle(fontSize: 38, fontWeight: FontWeight.w800, letterSpacing: -1)),
            const SizedBox(height: 4),
            Text('${s.trades.length} handler · ${fmt(s.totalRevenue)} omsætning',
                style: const TextStyle(color: P.muted, fontSize: 15)),
            const SizedBox(height: 8),
            if (list.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 40),
                child: Text('Ingen handler endnu.', textAlign: TextAlign.center, style: TextStyle(color: P.muted)),
              )
            else
              ...list.map((t) => _tradeRow(context, t)),
          ],
        ),
        _newTradeFab(context),
      ]);
    });
  }
}

// ---------- TRAPPEN ----------
class LadderScreen extends StatefulWidget {
  const LadderScreen({super.key});
  @override
  State<LadderScreen> createState() => _LadderScreenState();
}

class _LadderScreenState extends State<LadderScreen> {
  final _ctrl = ScrollController();
  int _flash = -1;
  static const double _ext = 60;

  @override
  void initState() {
    super.initState();
    ladderFlash.addListener(_onFlash);
  }

  void _onFlash() {
    final step = ladderFlash.value;
    if (step < 0) return;
    setState(() => _flash = step);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_ctrl.hasClients) return;
      final target = (step * _ext - 220).clamp(0.0, _ctrl.position.maxScrollExtent);
      _ctrl.animateTo(target, duration: const Duration(milliseconds: 450), curve: Curves.easeOutCubic);
    });
    Future.delayed(const Duration(milliseconds: 1400), () {
      if (mounted) setState(() => _flash = -1);
    });
  }

  @override
  void dispose() {
    ladderFlash.removeListener(_onFlash);
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(builder: (context, s, _) {
      final step = s.curStep;
      return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 60, 20, 8),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: const [
            _Eyebrow('Rejsen'),
            SizedBox(height: 6),
            Text('Trappen', style: TextStyle(fontSize: 38, fontWeight: FontWeight.w800, letterSpacing: -1)),
            SizedBox(height: 4),
            Text('37 trin fra 1.000 kr. til 1.000.000 kr.', style: TextStyle(color: P.muted, fontSize: 15)),
          ]),
        ),
        Expanded(
          child: ListView.builder(
            controller: _ctrl,
            reverse: true,
            itemExtent: _ext,
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
            itemCount: kSteps + 1,
            itemBuilder: (context, i) {
              final done = i < step;
              final cur = i == step;
              final flash = i == _flash;
              Color bg = P.surface;
              Color border = P.line;
              if (done) {
                bg = const Color(0xFF0C1A12);
                border = P.accentDim;
              }
              if (cur) {
                bg = const Color(0xFF1C1808);
                border = const Color(0xFF574A14);
              }
              return Padding(
                padding: const EdgeInsets.only(bottom: 7),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: bg,
                    borderRadius: BorderRadius.circular(13),
                    border: Border.all(color: flash ? P.gold : border, width: flash ? 2 : 1),
                  ),
                  child: Row(children: [
                    Container(
                      width: 13,
                      height: 13,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: done ? P.accent : (cur ? P.gold : P.surface2),
                        border: Border.all(
                            color: done ? P.accent : (cur ? P.gold : const Color(0xFF2C313A)), width: 2),
                        boxShadow: cur ? [BoxShadow(color: P.gold.withValues(alpha: 0.5), blurRadius: 10)] : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    SizedBox(
                        width: 34,
                        child: Text('$i',
                            style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: cur ? P.gold : P.muted))),
                    const Spacer(),
                    if (cur)
                      Container(
                        margin: const EdgeInsets.only(right: 10),
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: P.gold, borderRadius: BorderRadius.circular(99)),
                        child: const Text('DU ER HER',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Color(0xFF1A1505), letterSpacing: 0.6)),
                      ),
                    Text(i == 0 ? 'Start' : fmt(kLadder[i]),
                        style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700)),
                  ]),
                ),
              );
            },
          ),
        ),
      ]);
    });
  }
}

// ---------- STATISTIK ----------
class StatsScreen extends StatelessWidget {
  const StatsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(builder: (context, s, _) {
      final step = s.curStep;
      return ListView(
        padding: const EdgeInsets.fromLTRB(20, 60, 20, 40),
        children: [
          const _Eyebrow('Statistik'),
          const SizedBox(height: 6),
          const Text('Overblik', style: TextStyle(fontSize: 38, fontWeight: FontWeight.w800, letterSpacing: -1)),
          const SizedBox(height: 16),
          Row(children: [
            _Mini('Kapital (formue)', fmt(s.capital)),
            const SizedBox(width: 12),
            _Mini('Samlet profit', signed(s.realizedTotal), color: s.realizedTotal >= 0 ? P.accent : P.red),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            _Mini('I kassen', fmt(s.cashOnHand), color: s.cashOnHand < 0 ? P.red : P.txt),
            const SizedBox(width: 12),
            _Mini('Bundet i handler', fmt(s.boundCapital)),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            _Mini('Antal handler', '${s.trades.length}'),
            const SizedBox(width: 12),
            _Mini('Omsætning', fmt(s.totalRevenue)),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            _Mini('Bedste handel', s.trades.isEmpty ? '—' : signed(s.bestTrade), color: P.accent),
            const SizedBox(width: 12),
            _Mini('Gns. ROI', s.hasRoi ? '${(s.avgRoi * 100).round()} %' : '—'),
          ]),
          _Card(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('Aktuelt trin', style: TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              Text('Trin $step / 37', style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              Text(step >= kSteps ? 'Du nåede millionen!' : 'Mangler ${fmt(kTarget - s.capital)} til millionen',
                  style: const TextStyle(color: P.muted)),
            ]),
          ),
          const SizedBox(height: 18),
          primaryBtn('+ Sæt penge ind', () => showDepositSheet(context)),
          ghostBtn('Nulstil rejse', () => _confirmReset(context), color: P.red),
        ],
      );
    });
  }

  void _confirmReset(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: P.surface,
        title: const Text('Nulstil rejse?', style: TextStyle(color: P.txt)),
        content: const Text('Alle handler og indskud slettes.', style: TextStyle(color: P.muted)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Annullér', style: TextStyle(color: P.muted))),
          TextButton(
              onPressed: () {
                context.read<AppState>().reset();
                Navigator.pop(ctx);
                tabIndex.value = 0;
                toast('Rejsen er nulstillet');
              },
              child: const Text('Nulstil', style: TextStyle(color: P.red, fontWeight: FontWeight.w800))),
        ],
      ),
    );
  }
}
