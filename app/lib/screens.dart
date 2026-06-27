import 'package:confetti/confetti.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'app_state.dart';
import 'i18n.dart';
import 'main.dart';
import 'palette.dart';
import 'share_card.dart';
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
  const _Card({required this.child});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: P.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: P.line),
      ),
      child: child,
    );
  }
}

Widget _tradeRow(BuildContext context, Trade t, AppState s) {
  final closed = t.isClosed;
  final mono = (t.name.isEmpty ? '?' : t.name.trim()[0]).toUpperCase();
  final minP = s.minSalePrice(t);
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
            if (closed)
              Text(s.t.closedQty(t.qty), style: const TextStyle(color: P.muted, fontSize: 12.5))
            else
              Text.rich(
                TextSpan(children: [
                  TextSpan(
                      text: s.t.leftOf(t.left, t.qty),
                      style: const TextStyle(color: P.muted, fontSize: 12.5)),
                  TextSpan(
                      text: s.t.sellAtLeast(fmt(minP)),
                      style: const TextStyle(color: P.gold, fontSize: 12.5, fontWeight: FontWeight.w700)),
                ]),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
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
            child: Text(closed ? s.t.pillClosed : s.t.pillActive,
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
          child: Text(context.read<AppState>().t.newTradeFab,
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
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
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              _Eyebrow(s.t.yourCapital),
              GestureDetector(
                onTap: () => showSharePreview(context),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                      color: P.surface, shape: BoxShape.circle, border: Border.all(color: P.line)),
                  child: const Icon(Icons.ios_share, size: 18, color: P.muted),
                ),
              ),
            ]),
            const SizedBox(height: 6),
            _CountUp(value: cap,
                style: const TextStyle(fontSize: 54, fontWeight: FontWeight.w800, letterSpacing: -1.8, height: 1)),
            const SizedBox(height: 12),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text.rich(TextSpan(children: [
                TextSpan(text: '${s.t.stepWord} ', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                TextSpan(text: '$step', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: P.gold)),
                const TextSpan(text: '/37', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
              ])),
              Text('${(pct * 100).round()}%', style: const TextStyle(color: P.muted, fontSize: 14, fontWeight: FontWeight.w600)),
            ]),
            const SizedBox(height: 12),
            _ProgressBar(pct: pct),
            if (s.streakWeeks >= 1) _StreakBanner(t: s.t, weeks: s.streakWeeks),
            _GoalCard(t: s.t, atTop: atTop, nextTarget: s.nextTarget, need: s.needForNext, near: !atTop && pct >= 0.9),
            const SizedBox(height: 14),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(s.t.cashOnHand, style: const TextStyle(color: P.muted, fontSize: 14)),
              Text(fmt(s.cashOnHand),
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: s.cashOnHand < 0 ? P.red : P.txt)),
            ]),
            const SizedBox(height: 14),
            Row(children: [
              Expanded(child: ghostBtn(s.t.quickDeposit, () => showDepositSheet(context))),
              const SizedBox(width: 12),
              Expanded(child: ghostBtn(s.t.quickStats, () => tabIndex.value = 3)),
            ]),
            const SizedBox(height: 18),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(s.t.activeTrades, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
              GestureDetector(
                  onTap: () => tabIndex.value = 1,
                  child: Text(s.t.seeAll, style: const TextStyle(color: P.accent, fontSize: 14, fontWeight: FontWeight.w600))),
            ]),
            if (s.activeTrades.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 28),
                child: Text(s.t.noActiveTrades,
                    textAlign: TextAlign.center, style: const TextStyle(color: P.muted)),
              )
            else ...[
              ...s.activeTrades.take(2).map((t) => _tradeRow(context, t, s)),
              if (s.activeTrades.length > 2)
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Center(
                    child: GestureDetector(
                      onTap: () => tabIndex.value = 1,
                      child: Text(s.t.seeAllTrades(s.activeTrades.length),
                          style: const TextStyle(color: P.accent, fontWeight: FontWeight.w600, fontSize: 14)),
                    ),
                  ),
                ),
            ],
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
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
          color: P.surface2, borderRadius: BorderRadius.circular(99), border: Border.all(color: P.line)),
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0, end: pct.clamp(0.0, 1.0)),
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeOutCubic,
        builder: (context, v, _) => FractionallySizedBox(
          alignment: Alignment.centerLeft,
          widthFactor: v,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(99),
              gradient: const LinearGradient(colors: [P.accent, Color(0xFF8BF0B8)]),
            ),
          ),
        ),
      ),
    );
  }
}

class _CountUp extends StatelessWidget {
  final double value;
  final TextStyle style;
  const _CountUp({required this.value, required this.style});
  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: value, end: value),
      duration: const Duration(milliseconds: 450),
      curve: Curves.easeOutCubic,
      builder: (context, v, _) => Text(fmt(v), style: style),
    );
  }
}

class _StreakBanner extends StatelessWidget {
  final Tr t;
  final int weeks;
  const _StreakBanner({required this.t, required this.weeks});
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 14),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
          color: P.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: P.line)),
      child: Row(children: [
        const Text('🔥', style: TextStyle(fontSize: 20)),
        const SizedBox(width: 12),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(t.streakLine(weeks),
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
            const SizedBox(height: 2),
            Text(t.streakSub, style: const TextStyle(color: P.muted, fontSize: 12)),
          ]),
        ),
      ]),
    );
  }
}

class _GoalCard extends StatelessWidget {
  final Tr t;
  final bool atTop;
  final bool near;
  final double nextTarget;
  final double need;
  const _GoalCard({required this.t, required this.atTop, required this.near, required this.nextTarget, required this.need});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0x1AFFCF4A),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0x52FFCF4A)),
        boxShadow: near ? [BoxShadow(color: P.gold.withValues(alpha: 0.25), blurRadius: 22)] : null,
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(t.nextStepCaps,
              style: const TextStyle(color: P.gold, fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 0.6)),
          Text(atTop ? t.millionReached : fmt(nextTarget),
              style: const TextStyle(color: Color(0xFFFFE6A3), fontSize: 14, fontWeight: FontWeight.w700)),
        ]),
        const SizedBox(height: 8),
        Text(atTop ? '🏆 ${fmt(kTarget)}' : t.missing(fmt(need)),
            style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800, letterSpacing: -0.5)),
        const SizedBox(height: 12),
        const Divider(color: Color(0x14FFFFFF), height: 1),
        const SizedBox(height: 12),
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('💡  ', style: TextStyle(fontSize: 14)),
          Expanded(
            child: atTop
                ? Text(t.allConquered,
                    style: const TextStyle(color: Color(0xFFDFE6EE), fontSize: 13.5, height: 1.5))
                : Text.rich(
                    TextSpan(children: [
                      TextSpan(text: t.tipBefore),
                      TextSpan(text: fmt(need),
                          style: const TextStyle(color: P.accent, fontWeight: FontWeight.w800)),
                      TextSpan(text: t.tipAfter),
                    ]),
                    style: const TextStyle(color: Color(0xFFDFE6EE), fontSize: 13.5, height: 1.5),
                  ),
          ),
        ]),
      ]),
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
            _Eyebrow(s.t.yourTradesEyebrow),
            const SizedBox(height: 6),
            Text(s.t.tradesTitle, style: const TextStyle(fontSize: 38, fontWeight: FontWeight.w800, letterSpacing: -1)),
            const SizedBox(height: 4),
            Text(s.t.tradesSummary(s.trades.length, fmt(s.totalRevenue)),
                style: const TextStyle(color: P.muted, fontSize: 15)),
            const SizedBox(height: 8),
            if (list.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 40),
                child: Text(s.t.noTradesYet, textAlign: TextAlign.center, style: const TextStyle(color: P.muted)),
              )
            else
              ...list.map((t) => _tradeRow(context, t, s)),
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
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _Eyebrow(s.t.journeyEyebrow),
            const SizedBox(height: 6),
            Text(s.t.ladderTitle, style: const TextStyle(fontSize: 38, fontWeight: FontWeight.w800, letterSpacing: -1)),
            const SizedBox(height: 10),
            _PaceCard(t: s.t, step: step, weeks: s.paceWeeks),
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
              final milestone = kMilestoneSteps.contains(i);
              Color bg = P.surface;
              Color border = P.line;
              if (done) {
                bg = const Color(0xFF0C1A12);
                border = P.accentDim;
              }
              if (milestone) {
                bg = done ? const Color(0xFF1A1606) : const Color(0xFF14130C);
                border = const Color(0xFF6B5718);
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
                        child: Text(s.t.youAreHere,
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Color(0xFF1A1505), letterSpacing: 0.6)),
                      ),
                    Text(i == 0 ? s.t.start : fmt(kLadder[i]),
                        style: TextStyle(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w700,
                            color: milestone ? P.gold : P.txt)),
                    if (milestone)
                      const Padding(
                        padding: EdgeInsets.only(left: 8),
                        child: Text('👑', style: TextStyle(fontSize: 14)),
                      ),
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
          _Eyebrow(s.t.statsEyebrow),
          const SizedBox(height: 6),
          Text(s.t.overview, style: const TextStyle(fontSize: 38, fontWeight: FontWeight.w800, letterSpacing: -1)),
          const SizedBox(height: 16),
          Row(children: [
            _Mini(s.t.capitalNetWorth, fmt(s.capital)),
            const SizedBox(width: 12),
            _Mini(s.t.totalProfit, signed(s.realizedTotal), color: s.realizedTotal >= 0 ? P.accent : P.red),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            _Mini(s.t.cashOnHand, fmt(s.cashOnHand), color: s.cashOnHand < 0 ? P.red : P.txt),
            const SizedBox(width: 12),
            _Mini(s.t.boundInTrades, fmt(s.boundCapital)),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            _Mini(s.t.tradeCount, '${s.trades.length}'),
            const SizedBox(width: 12),
            _Mini(s.t.revenue, fmt(s.totalRevenue)),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            _Mini(s.t.bestTrade, s.trades.isEmpty ? '—' : signed(s.bestTrade), color: P.accent),
            const SizedBox(width: 12),
            _Mini(s.t.avgRoi, s.hasRoi ? '${(s.avgRoi * 100).round()} %' : '—'),
          ]),
          _BadgesCard(t: s.t, step: step, streakWeeks: s.streakWeeks),
          _Card(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(s.t.yourStyle, style: const TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              Text(s.t.styleLabel(s.avgJump, s.jumps.isEmpty),
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              Text(
                  s.jumps.isEmpty ? s.t.styleEmpty : s.t.avgJump(s.avgJump.toStringAsFixed(1)),
                  style: const TextStyle(color: P.muted)),
            ]),
          ),
          _Card(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(s.t.currentStep, style: const TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              Text(s.t.stepXof37(step), style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              Text(step >= kSteps ? s.t.reachedMillion : s.t.missingToMillion(fmt(kTarget - s.capital)),
                  style: const TextStyle(color: P.muted)),
            ]),
          ),
          if (s.deposits.isNotEmpty) _DepositsCard(s: s),
          const SizedBox(height: 18),
          _LangPicker(s: s),
          primaryBtn(s.t.depositBtn, () => showDepositSheet(context)),
          ghostBtn(s.t.shareMyJourney, () => showSharePreview(context)),
          ghostBtn(s.t.resetJourney, () => _confirmReset(context), color: P.red),
        ],
      );
    });
  }

  void _confirmReset(BuildContext context) {
    final t = context.read<AppState>().t;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: P.surface,
        title: Text(t.resetTitle, style: const TextStyle(color: P.txt)),
        content: Text(t.resetBody, style: const TextStyle(color: P.muted)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: Text(t.cancel, style: const TextStyle(color: P.muted))),
          TextButton(
              onPressed: () {
                context.read<AppState>().reset();
                Navigator.pop(ctx);
                tabIndex.value = 0;
                toast(t.resetDone);
              },
              child: Text(t.reset, style: const TextStyle(color: P.red, fontWeight: FontWeight.w800))),
        ],
      ),
    );
  }
}

class _DepositsCard extends StatelessWidget {
  final AppState s;
  const _DepositsCard({required this.s});
  @override
  Widget build(BuildContext context) {
    return _Card(
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(s.t.deposits, style: const TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600)),
        const SizedBox(height: 6),
        ...List.generate(s.deposits.length, (i) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: Row(children: [
              Text(fmt(s.deposits[i]),
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              const Spacer(),
              IconButton(
                onPressed: () async {
                  final ok = await confirmDialog(
                      context, s.t.deleteDepositQ, s.t.deleteDepositBody, s.t.delete);
                  if (!ok) return;
                  s.removeDeposit(i);
                },
                icon: const Icon(Icons.close, size: 18, color: P.muted),
                tooltip: s.t.deleteDeposit,
              ),
            ]),
          );
        }),
      ]),
    );
  }
}

class _LangPicker extends StatelessWidget {
  final AppState s;
  const _LangPicker({required this.s});
  @override
  Widget build(BuildContext context) {
    Widget opt(String label, AppLang lang) {
      final active = s.lang == lang;
      return Expanded(
        child: GestureDetector(
          onTap: () => s.setLang(lang),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 4),
            padding: const EdgeInsets.symmetric(vertical: 11),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: active ? P.accentDim : P.surface2,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: active ? P.accent : P.line),
            ),
            child: Text(label,
                style: TextStyle(
                    fontWeight: FontWeight.w700,
                    color: active ? P.accent : P.muted)),
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(s.t.language, style: const TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Row(children: [opt('Dansk', AppLang.da), opt('English', AppLang.en)]),
      ]),
    );
  }
}

class _PaceCard extends StatelessWidget {
  final Tr t;
  final int step;
  final int? weeks;
  const _PaceCard({required this.t, required this.step, required this.weeks});
  @override
  Widget build(BuildContext context) {
    final atTop = step >= kSteps;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: P.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: P.line)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(t.youAreOnStep(step),
            style: const TextStyle(color: P.gold, fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
        const SizedBox(height: 8),
        atTop
            ? Text(t.reachedMillionCrown, style: const TextStyle(fontSize: 14, color: Color(0xFFDFE6EE)))
            : (weeks == null
                ? Text(t.paceUnknown,
                    style: const TextStyle(fontSize: 14, color: Color(0xFFDFE6EE), height: 1.4))
                : Text.rich(
                    TextSpan(children: [
                      TextSpan(text: t.paceBefore),
                      TextSpan(text: t.paceBold(weeks!),
                          style: const TextStyle(color: P.accent, fontWeight: FontWeight.w800)),
                      const TextSpan(text: '.'),
                    ]),
                    style: const TextStyle(fontSize: 14, color: Color(0xFFDFE6EE), height: 1.4),
                  )),
      ]),
    );
  }
}

// ---------- MILEPÆLS-FEJRING ----------
void showMilestone(BuildContext context, int step) {
  if (!kMilestoneSteps.contains(step)) return;
  showDialog(
    context: context,
    barrierColor: Colors.black.withValues(alpha: 0.85),
    builder: (ctx) => _MilestoneDialog(step: step),
  );
}

class _MilestoneDialog extends StatefulWidget {
  final int step;
  const _MilestoneDialog({required this.step});
  @override
  State<_MilestoneDialog> createState() => _MilestoneDialogState();
}

class _MilestoneDialogState extends State<_MilestoneDialog> {
  late final ConfettiController _confetti;

  @override
  void initState() {
    super.initState();
    _confetti = ConfettiController(duration: const Duration(seconds: 2));
    _confetti.play();
  }

  @override
  void dispose() {
    _confetti.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final step = widget.step;
    final t = context.read<AppState>().t;
    final emoji = kMilestoneEmoji[step] ?? '🎉';
    return Stack(alignment: Alignment.topCenter, children: [
      Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.all(30),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Text(emoji, style: const TextStyle(fontSize: 72)),
          const SizedBox(height: 14),
          Text(t.milestoneTitle(step),
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: P.txt)),
          const SizedBox(height: 10),
          Text('${t.milestoneSub(step)} (${t.stepOf37(step)})',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xFFCDD6DF), fontSize: 15, height: 1.5)),
          const SizedBox(height: 22),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                backgroundColor: P.surface2,
                foregroundColor: P.txt,
                padding: const EdgeInsets.symmetric(vertical: 15),
                side: const BorderSide(color: P.line),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              onPressed: () => showSharePreview(context, milestoneStep: step),
              child: Text(t.shareMyLadder, style: const TextStyle(fontWeight: FontWeight.w700)),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: P.accent,
                foregroundColor: const Color(0xFF05130B),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              onPressed: () => Navigator.pop(context),
              child: Text(t.continueBtn, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
            ),
          ),
        ]),
      ),
      Align(
        alignment: Alignment.topCenter,
        child: ConfettiWidget(
          confettiController: _confetti,
          blastDirectionality: BlastDirectionality.explosive,
          shouldLoop: false,
          numberOfParticles: 24,
          maxBlastForce: 18,
          minBlastForce: 8,
          gravity: 0.25,
          emissionFrequency: 0.05,
          colors: const [P.accent, P.gold, Colors.white, Color(0xFF8BF0B8)],
        ),
      ),
    ]);
  }
}

// ---------- BADGES ----------
class _BadgesCard extends StatelessWidget {
  final Tr t;
  final int step;
  final int streakWeeks;
  const _BadgesCard({required this.t, required this.step, required this.streakWeeks});
  @override
  Widget build(BuildContext context) {
    final earned = <List<String>>[];
    for (final k in kMilestoneSteps) {
      if (step >= k) earned.add([kMilestoneEmoji[k] ?? '🏅', t.badgeStep(k)]);
    }
    if (streakWeeks >= 2) earned.add(['🔥', t.badgeWeeks(streakWeeks)]);
    return _Card(
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(t.yourBadges, style: const TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600)),
        const SizedBox(height: 12),
        if (earned.isEmpty)
          Text(t.noBadges, style: const TextStyle(color: P.muted, fontSize: 13.5, height: 1.4))
        else
          Wrap(spacing: 10, runSpacing: 10, children: earned.map((b) => _Badge(emoji: b[0], label: b[1])).toList()),
      ]),
    );
  }
}

class _Badge extends StatelessWidget {
  final String emoji;
  final String label;
  const _Badge({required this.emoji, required this.label});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
      decoration: BoxDecoration(
          color: P.surface2,
          borderRadius: BorderRadius.circular(99),
          border: Border.all(color: const Color(0xFF3A3416))),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Text(emoji, style: const TextStyle(fontSize: 16)),
        const SizedBox(width: 7),
        Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: P.gold)),
      ]),
    );
  }
}

// ---------- ONBOARDING (FTUE) ----------
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _page = 0;

  void _finishWith(void Function(BuildContext) sheet) {
    context.read<AppState>().setOnboarded();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final c = navigatorKey.currentContext;
      if (c != null) sheet(c);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0.4, -1),
            radius: 1.2,
            colors: [Color(0xFF0C2417), Color(0xFF000000)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(28, 40, 28, 28),
            child: Column(children: [
              Expanded(child: _buildPage()),
              _dots(),
              const SizedBox(height: 8),
            ]),
          ),
        ),
      ),
    );
  }

  Widget _dots() => Row(mainAxisAlignment: MainAxisAlignment.center, children: List.generate(3, (i) {
        final on = i == _page;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          margin: const EdgeInsets.symmetric(horizontal: 4),
          width: on ? 22 : 8,
          height: 8,
          decoration: BoxDecoration(
              color: on ? P.accent : const Color(0xFF2C313A),
              borderRadius: BorderRadius.circular(99)),
        );
      }));

  Widget _buildPage() {
    final t = context.read<AppState>().t;
    if (_page == 0) {
      return _PageWrap(children: [
        Text(t.obTitle1,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800, height: 1.15, color: P.txt)),
        const SizedBox(height: 18),
        Text(t.obLead1,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFFCDD6DF), fontSize: 16, height: 1.5)),
        const SizedBox(height: 28),
        _obPrimary(t.next, () => setState(() => _page = 1)),
      ]);
    } else if (_page == 1) {
      return _PageWrap(children: [
        Text(t.obTitle2,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800, height: 1.15, color: P.txt)),
        const SizedBox(height: 18),
        Text(t.obLead2,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFFCDD6DF), fontSize: 16, height: 1.5)),
        const SizedBox(height: 24),
        _ladderRow('${t.stepWord} 1', '${fmt(kLadder[1])} ← ${t.start}', const Color(0xFF16613A), const Color(0xFF0C1A12)),
        _ladderRow('${t.stepWord} 10', fmt(kLadder[10]), P.line, P.surface),
        _ladderRow('${t.stepWord} 37', '${fmt(kLadder[37])} 👑', const Color(0xFF574A14), const Color(0xFF1A1606), gold: true),
        const SizedBox(height: 26),
        _obPrimary(t.understood, () => setState(() => _page = 2)),
      ]);
    }
    return _PageWrap(children: [
      Text(t.obTitle3,
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800, height: 1.15, color: P.txt)),
      const SizedBox(height: 24),
      _obChoice(t.obSellTitle, t.obSellSub, true, () => _finishWith(showSellOwnedSheet)),
      const SizedBox(height: 12),
      _obChoice(t.obDepositTitle, t.obDepositSub, false, () => _finishWith(showDepositSheet)),
    ]);
  }

  Widget _ladderRow(String a, String b, Color border, Color bg, {bool gold = false}) => Container(
        margin: const EdgeInsets.only(top: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12), border: Border.all(color: border)),
        child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(a, style: TextStyle(fontWeight: FontWeight.w700, color: gold ? P.gold : P.txt)),
          Text(b, style: TextStyle(fontWeight: FontWeight.w700, color: gold ? P.gold : P.txt)),
        ]),
      );

  Widget _obPrimary(String label, VoidCallback onTap) => SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: P.accent,
            foregroundColor: const Color(0xFF05130B),
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          onPressed: onTap,
          child: Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
        ),
      );

  Widget _obChoice(String title, String sub, bool primary, VoidCallback onTap) => SizedBox(
        width: double.infinity,
        child: Material(
          color: primary ? P.accent : P.surface2,
          borderRadius: BorderRadius.circular(16),
          child: InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: onTap,
            child: Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: primary ? null : Border.all(color: P.line)),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(title,
                    style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: primary ? const Color(0xFF05130B) : P.txt)),
                const SizedBox(height: 4),
                Text(sub,
                    style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w600,
                        color: primary ? const Color(0xCC05130B) : P.muted)),
              ]),
            ),
          ),
        ),
      );
}

class _PageWrap extends StatelessWidget {
  final List<Widget> children;
  const _PageWrap({required this.children});
  @override
  Widget build(BuildContext context) => Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.stretch, children: children),
      );
}
