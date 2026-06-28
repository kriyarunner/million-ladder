import 'dart:math' as math;

import 'package:confetti/confetti.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

/// Guld-knap: "✓ Solgt" → vælg en aktiv vare du har solgt.
Widget _soldButton(BuildContext context) => SizedBox(
      height: 52,
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: P.gold,
          foregroundColor: const Color(0xFF1A1505),
          elevation: 8,
          shadowColor: P.gold.withValues(alpha: 0.35),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        onPressed: () {
          HapticFeedback.selectionClick();
          showSellPickerSheet(context);
        },
        child: Text(context.read<AppState>().t.soldBtn,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
      ),
    );

/// Grøn knap: "+ Ny handel" → vælger (køb / sælg noget du ejer).
Widget _newTradeButton(BuildContext context) => SizedBox(
      height: 56,
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: P.accent,
          foregroundColor: const Color(0xFF05130B),
          elevation: 8,
          shadowColor: P.accent.withValues(alpha: 0.4),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        ),
        onPressed: () {
          HapticFeedback.selectionClick();
          showAddActionSheet(context);
        },
        child: Text(context.read<AppState>().t.newTradeFab,
            style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
      ),
    );

/// Flydende handlings-knapper (Home + Handler): Solgt (kun ved varer) + Ny handel.
Widget _tradeActions(BuildContext context, {required bool hasActive}) => Positioned(
      left: 20,
      right: 20,
      bottom: 16,
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        if (hasActive) ...[
          _soldButton(context),
          const SizedBox(height: 10),
        ],
        _newTradeButton(context),
      ]),
    );

// ---------- HOME ----------
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    tabIndex.addListener(_onTab);
    WidgetsBinding.instance.addPostFrameCallback((_) => _maybeShowTutorial());
  }

  void _onTab() {
    if (tabIndex.value == 0) _maybeShowTutorial();
  }

  // Auto-vis intro-guiden de første 3 gange man lander på Home.
  void _maybeShowTutorial() {
    if (!mounted || _busy) return;
    final s = context.read<AppState>();
    if (!s.shouldAutoTutorial) return;
    _busy = true;
    s.markTutorialShown();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      showTutorial(navigatorKey.currentContext ?? context, manual: false)
          .whenComplete(() => _busy = false);
    });
  }

  @override
  void dispose() {
    tabIndex.removeListener(_onTab);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(builder: (context, s, _) {
      final step = s.curStep;
      final cap = s.capital;
      final atTop = step >= kSteps;
      final prev = kLadder[step];
      final pct = atTop ? 1.0 : ((cap - prev) / (s.nextTarget - prev)).clamp(0.0, 1.0);
      return ListView(
          padding: const EdgeInsets.fromLTRB(20, 60, 20, 32),
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
                TextSpan(text: '/$kSteps', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
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
        );
    });
  }
}

class _ProgressBar extends StatefulWidget {
  final double pct;
  const _ProgressBar({required this.pct});
  @override
  State<_ProgressBar> createState() => _ProgressBarState();
}

class _ProgressBarState extends State<_ProgressBar> with SingleTickerProviderStateMixin {
  late final AnimationController _pulse =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 1400))..repeat(reverse: true);

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final fill = TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: widget.pct.clamp(0.0, 1.0)),
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
    );

    // Glow til stede fra start og vokser gradvist med fremgangen.
    // easeIn-kurven holder det diskret tidligt og mere intenst tæt på opryk.
    final p = widget.pct.clamp(0.0, 1.0);
    final intensity = Curves.easeIn.transform(p);

    return AnimatedBuilder(
      animation: _pulse,
      builder: (context, child) {
        final t = Curves.easeInOut.transform(_pulse.value); // 0..1
        // pulsen er næsten umærkelig tidligt og mere tydelig tæt på opryk
        final glowAlpha = 0.05 + 0.42 * intensity + 0.13 * intensity * t;
        final blur = 3 + 14 * intensity;
        final spread = 0.2 + 1.6 * intensity;
        return Container(
          height: 16,
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            color: P.surface2,
            borderRadius: BorderRadius.circular(99),
            border: Border.all(
                color: Color.lerp(P.line, P.accent, 0.15 + 0.6 * intensity)!),
            boxShadow: [
              BoxShadow(
                color: P.accent.withValues(alpha: glowAlpha),
                blurRadius: blur,
                spreadRadius: spread,
              ),
            ],
          ),
          child: child,
        );
      },
      child: fill,
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
          padding: const EdgeInsets.fromLTRB(20, 60, 20, 150),
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
        _tradeActions(context, hasActive: s.activeTrades.isNotEmpty),
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
  bool _showTask = true;
  static const double _ext = 60;

  @override
  void initState() {
    super.initState();
    ladderFlash.addListener(_onFlash);
    tabIndex.addListener(_onTab);
  }

  // Standard: opgaven er altid fremme når man kommer (tilbage) til trappen.
  void _onTab() {
    if (tabIndex.value == 2 && !_showTask && mounted) {
      setState(() => _showTask = true);
    }
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
    tabIndex.removeListener(_onTab);
    _ctrl.dispose();
    super.dispose();
  }

  // Tydelig "skjul"-knap under kortene → folder næste opgave + tempo væk.
  Widget _hideTaskButton(Tr t) {
    return GestureDetector(
      onTap: () => setState(() => _showTask = false),
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 13),
        decoration: BoxDecoration(
          color: P.accentDim,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: P.accent),
        ),
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Icon(Icons.visibility_outlined, color: P.accent, size: 19),
          const SizedBox(width: 8),
          Text(t.hideTaskLabel,
              style: const TextStyle(color: P.accent, fontSize: 14, fontWeight: FontWeight.w800)),
          const SizedBox(width: 4),
          const Icon(Icons.keyboard_arrow_up_rounded, color: P.accent, size: 20),
        ]),
      ),
    );
  }

  // Slank bjælke når kortet er foldet væk → beholder målet + tydelig "vis"-knap.
  Widget _showTaskBar(Tr t, {required int step, required double need, required bool atTop}) {
    final nextStep = (step + 1).clamp(0, kSteps);
    return GestureDetector(
      onTap: () => setState(() => _showTask = true),
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0x1AFFCF4A),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0x52FFCF4A)),
        ),
        child: Row(children: [
          Expanded(
            child: Text(atTop ? t.nextTaskDone : '✨ ${t.nextTaskAmount(fmt(need), nextStep)}',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.w800)),
          ),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: BoxDecoration(
              color: const Color(0x33FFCF4A),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              Text(t.showTaskLabel,
                  style: const TextStyle(color: P.gold, fontSize: 13, fontWeight: FontWeight.w800)),
              const SizedBox(width: 4),
              const Icon(Icons.keyboard_arrow_down_rounded, color: P.gold, size: 18),
            ]),
          ),
        ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(builder: (context, s, _) {
      final step = s.curStep;
      final dreamStep = s.dreamStep;
      return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 60, 20, 8),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _Eyebrow(s.t.journeyEyebrow),
            const SizedBox(height: 6),
            Text(s.t.ladderTitle, style: const TextStyle(fontSize: 38, fontWeight: FontWeight.w800, letterSpacing: -1)),
            const SizedBox(height: 10),
            if (_showTask) ...[
              _NextTaskCard(
                  t: s.t,
                  step: step,
                  need: s.needForNext,
                  atTop: step >= kSteps,
                  hasActive: s.activeTrades.isNotEmpty),
              const SizedBox(height: 10),
              _PaceCard(t: s.t, step: step, weeks: s.paceWeeks),
              const SizedBox(height: 10),
              _hideTaskButton(s.t),
            ] else
              _showTaskBar(s.t, step: step, need: s.needForNext, atTop: step >= kSteps),
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
              final isDream = i == dreamStep;
              if (isDream && !cur) {
                bg = const Color(0xFF14130C);
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
                    if (isDream)
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(left: 6, right: 8),
                          child: Text('✨ ${s.dreamName}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                  fontSize: 13, fontWeight: FontWeight.w800, color: P.gold)),
                        ),
                      )
                    else
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
          const SizedBox(height: 12),
          GestureDetector(
            onTap: () {
              HapticFeedback.selectionClick();
              showTransactionsChooser(context);
            },
            behavior: HitTestBehavior.opaque,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              decoration: BoxDecoration(
                color: P.surface2,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: P.line),
              ),
              child: Row(children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: P.accentDim,
                    borderRadius: BorderRadius.circular(11),
                  ),
                  child: const Icon(Icons.swap_vert_rounded, color: P.accent, size: 22),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(s.t.transactions,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 2),
                    Text(s.t.transactionsHint,
                        style: const TextStyle(color: P.muted, fontSize: 12.5)),
                  ]),
                ),
                const Icon(Icons.chevron_right_rounded, color: P.muted, size: 22),
              ]),
            ),
          ),
          const SizedBox(height: 4),
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
          _CurrencyPicker(s: s),
          const SizedBox(height: 12),
          ghostBtn(s.t.dreamEdit, () => showDreamSheet(context)),
          ghostBtn(s.t.shareMyJourney, () => showSharePreview(context)),
          ghostBtn(s.t.tutReplay, () => showTutorial(context, manual: true)),
          ghostBtn(s.t.resetJourney, () => _confirmReset(context), color: P.red),
          const SizedBox(height: 24),
          Text(s.t.disclaimer,
              textAlign: TextAlign.center,
              style: const TextStyle(color: P.muted, fontSize: 11, height: 1.5)),
          const SizedBox(height: 8),
          Text(s.t.termsLine,
              textAlign: TextAlign.center,
              style: const TextStyle(color: P.muted, fontSize: 11, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
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
        Text(s.t.movements, style: const TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600)),
        const SizedBox(height: 6),
        ...List.generate(s.deposits.length, (i) {
          final v = s.deposits[i];
          final isOut = v < 0;
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: Row(children: [
              Text(signed(v),
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: isOut ? P.red : P.accent)),
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
    Widget opt(String emoji, String label, AppLang lang) {
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
            child: Text('$emoji  $label',
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
        Text(s.t.languageCaption, style: const TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600, letterSpacing: 0.4)),
        const SizedBox(height: 8),
        Row(children: [
          opt('🇩🇰', 'Dansk', AppLang.da),
          opt('🇬🇧', 'English', AppLang.en),
        ]),
      ]),
    );
  }
}

void showTransactionsChooser(BuildContext context) {
  final t = context.read<AppState>().t;
  Widget tile(IconData icon, Color color, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.selectionClick();
        Navigator.pop(context);
        onTap();
      },
      behavior: HitTestBehavior.opaque,
      child: Container(
        margin: const EdgeInsets.only(top: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        decoration: BoxDecoration(
          color: P.surface2,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: P.line),
        ),
        child: Row(children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(color: color.withValues(alpha: 0.16), borderRadius: BorderRadius.circular(12)),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(label, style: const TextStyle(fontSize: 16.5, fontWeight: FontWeight.w800)),
          ),
          const Icon(Icons.chevron_right_rounded, color: P.muted, size: 22),
        ]),
      ),
    );
  }

  showModalBottomSheet(
    context: context,
    backgroundColor: P.surface,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
    builder: (ctx) => SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
        child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Padding(
            padding: const EdgeInsets.only(left: 4),
            child: Text(t.transactions,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
          ),
          tile(Icons.add_rounded, P.accent, t.depositBtn, () => showDepositSheet(context)),
          tile(Icons.remove_rounded, P.gold, t.withdrawBtnBig, () => showWithdrawSheet(context)),
        ]),
      ),
    ),
  );
}

void showCurrencyPicker(BuildContext context, AppState s) {
  showModalBottomSheet(
    context: context,
    backgroundColor: P.surface,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
    builder: (ctx) => SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
        child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Text(s.t.currencyPickTitle,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
          ),
          Flexible(
            child: ListView(
              shrinkWrap: true,
              children: kCurrencies.map((c) {
                final active = c.code == s.currency.code;
                return GestureDetector(
                  onTap: () {
                    s.setCurrency(c);
                    Navigator.pop(ctx);
                  },
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                    decoration: BoxDecoration(
                      color: active ? P.accentDim : P.surface2,
                      borderRadius: BorderRadius.circular(13),
                      border: Border.all(color: active ? P.accent : P.line, width: active ? 2 : 1),
                    ),
                    child: Row(children: [
                      Text(c.flag, style: const TextStyle(fontSize: 22)),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text('${c.code} · ${c.symbol}',
                            style: TextStyle(
                                fontSize: 15.5,
                                fontWeight: FontWeight.w700,
                                color: active ? P.accent : P.txt)),
                      ),
                      if (active) const Icon(Icons.check_rounded, color: P.accent, size: 20),
                    ]),
                  ),
                );
              }).toList(),
            ),
          ),
        ]),
      ),
    ),
  );
}

class _CurrencyPicker extends StatelessWidget {
  final AppState s;
  const _CurrencyPicker({required this.s});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 12, bottom: 4),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(s.t.currencyCaption,
            style: const TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600, letterSpacing: 0.4)),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: () => showCurrencyPicker(context, s),
          behavior: HitTestBehavior.opaque,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: P.surface2,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: P.line),
            ),
            child: Row(children: [
              Text(s.currency.flag, style: const TextStyle(fontSize: 20)),
              const SizedBox(width: 10),
              Expanded(
                child: Text('${s.currency.code} · ${s.currency.symbol}',
                    style: const TextStyle(fontWeight: FontWeight.w700, color: P.txt)),
              ),
              const Icon(Icons.keyboard_arrow_down_rounded, color: P.muted, size: 22),
            ]),
          ),
        ),
      ]),
    );
  }
}

// ---------- INTRO-GUIDE (animeret tutorial) ----------
Future<void> showTutorial(BuildContext context, {bool manual = false}) {
  return showDialog(
    context: context,
    barrierColor: Colors.black.withValues(alpha: 0.9),
    barrierDismissible: false,
    builder: (ctx) => _TutorialDialog(manual: manual),
  );
}

class _TutorialDialog extends StatefulWidget {
  final bool manual;
  const _TutorialDialog({required this.manual});
  @override
  State<_TutorialDialog> createState() => _TutorialDialogState();
}

class _TutorialDialogState extends State<_TutorialDialog> with SingleTickerProviderStateMixin {
  int _page = 0;
  late final AnimationController _anim =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 1600))..repeat();

  @override
  void dispose() {
    _anim.dispose();
    super.dispose();
  }

  void _next(int total) {
    HapticFeedback.selectionClick();
    if (_page < total - 1) {
      setState(() => _page++);
    } else {
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = context.read<AppState>();
    final t = s.t;
    final pages = t.tutPages;
    final total = pages.length;
    return Dialog(
      backgroundColor: P.surface,
      insetPadding: const EdgeInsets.symmetric(horizontal: 22, vertical: 40),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(22, 20, 22, 18),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Row(children: [
            Text(t.tutEyebrow,
                style: const TextStyle(
                    color: P.gold, fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 0.8)),
            const Spacer(),
            GestureDetector(
              onTap: () => Navigator.pop(context),
              child: Text(t.tutSkip,
                  style: const TextStyle(color: P.muted, fontSize: 13, fontWeight: FontWeight.w700)),
            ),
          ]),
          const SizedBox(height: 14),
          SizedBox(
            height: 196,
            child: AnimatedBuilder(
              animation: _anim,
              builder: (context, _) => _illustration(_page, _anim.value, t),
            ),
          ),
          const SizedBox(height: 18),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 250),
            child: Column(
              key: ValueKey(_page),
              children: [
                Text(pages[_page][0],
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 21, fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                Text(pages[_page][1],
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Color(0xFFCDD6DF), fontSize: 14.5, height: 1.45)),
              ],
            ),
          ),
          const SizedBox(height: 18),
          Row(mainAxisAlignment: MainAxisAlignment.center, children: List.generate(total, (i) {
            final on = i == _page;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: on ? 20 : 7,
              height: 7,
              decoration: BoxDecoration(
                  color: on ? P.accent : const Color(0xFF2C313A),
                  borderRadius: BorderRadius.circular(99)),
            );
          })),
          if (_page == total - 1) ...[
            const SizedBox(height: 12),
            Text(t.tutFindUnderKonto,
                textAlign: TextAlign.center,
                style: const TextStyle(color: P.muted, fontSize: 12, fontWeight: FontWeight.w600)),
          ],
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: P.accent,
                foregroundColor: const Color(0xFF05130B),
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              onPressed: () => _next(total),
              child: Text(_page == total - 1 ? t.understood : t.next,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
            ),
          ),
          if (!widget.manual)
            TextButton(
              onPressed: () {
                s.dismissTutorial();
                Navigator.pop(context);
              },
              child: Text(t.tutDontShow,
                  style: const TextStyle(color: P.muted, fontSize: 13, fontWeight: FontWeight.w600)),
            ),
        ]),
      ),
    );
  }

  Widget _illustration(int page, double v, Tr t) {
    switch (page) {
      case 1:
        return _demoButton(v, t, '+ ${t.newTradeFab.replaceAll('+ ', '')}', P.accent, const Color(0xFF05130B));
      case 2:
        return _demoButton(v, t, t.soldBtn, P.gold, const Color(0xFF1A1505));
      case 3:
        return _demoLadder(v, t);
      case 4:
        return _bigEmoji('🚀', v);
      default:
        return _bigEmoji('🪜', v);
    }
  }

  // Stort emoji der "ånder" let.
  Widget _bigEmoji(String e, double v) {
    final scale = 1 + 0.06 * (0.5 - (v - 0.5).abs()) * 2;
    return Center(
      child: Transform.scale(
        scale: scale,
        child: Container(
          width: 130,
          height: 130,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: const Color(0x1AFFCF4A),
            border: Border.all(color: const Color(0x52FFCF4A)),
          ),
          child: Text(e, style: const TextStyle(fontSize: 64)),
        ),
      ),
    );
  }

  // Mock-knap med pulserende "tryk her"-indikator.
  Widget _demoButton(double v, Tr t, String label, Color bg, Color fg) {
    return Center(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Stack(clipBehavior: Clip.none, alignment: Alignment.center, children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 16),
            decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(16)),
            child: Text(label, style: TextStyle(color: fg, fontSize: 16, fontWeight: FontWeight.w800)),
          ),
          Positioned(
            right: -6,
            bottom: -10,
            child: _tapIndicator(v),
          ),
        ]),
        const SizedBox(height: 26),
        Text(t.tutTapHere,
            style: const TextStyle(color: P.gold, fontSize: 13.5, fontWeight: FontWeight.w800)),
      ]),
    );
  }

  Widget _tapIndicator(double v) {
    return SizedBox(
      width: 56,
      height: 56,
      child: Stack(alignment: Alignment.center, children: [
        Container(
          width: 18 + 38 * v,
          height: 18 + 38 * v,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: P.accent.withValues(alpha: (1 - v) * 0.7), width: 2),
          ),
        ),
        Container(
          width: 22,
          height: 22,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white.withValues(alpha: 0.92),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.3), blurRadius: 6)],
          ),
        ),
      ]),
    );
  }

  // Mini-trappe der ligner den rigtige – med beløb – og en guld-markør der stiger.
  Widget _demoLadder(double v, Tr t) {
    final current = (1 + v * 4.999).floor().clamp(1, 5);
    return Center(
      child: SizedBox(
        width: 230,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [5, 4, 3, 2, 1].map((i) {
            final done = i < current;
            final cur = i == current;
            final bg = cur
                ? const Color(0xFF1C1808)
                : (done ? const Color(0xFF0C1A12) : P.surface);
            final border = cur ? P.gold : (done ? P.accentDim : P.line);
            return Container(
              margin: const EdgeInsets.symmetric(vertical: 3),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: border, width: cur ? 2 : 1),
              ),
              child: Row(children: [
                Container(
                  width: 11,
                  height: 11,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: done ? P.accent : (cur ? P.gold : P.surface2),
                    boxShadow:
                        cur ? [BoxShadow(color: P.gold.withValues(alpha: 0.5), blurRadius: 8)] : null,
                  ),
                ),
                const SizedBox(width: 10),
                Text('${t.stepWord} $i',
                    style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w700,
                        color: cur ? P.gold : P.muted)),
                const Spacer(),
                Text(fmt(kLadder[i]),
                    style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: cur ? P.gold : P.txt)),
              ]),
            );
          }).toList(),
        ),
      ),
    );
  }
}

class _NextTaskCard extends StatelessWidget {
  final Tr t;
  final int step;
  final double need;
  final bool atTop;
  final bool hasActive;
  const _NextTaskCard(
      {required this.t,
      required this.step,
      required this.need,
      required this.atTop,
      required this.hasActive});
  @override
  Widget build(BuildContext context) {
    final nextStep = (step + 1).clamp(0, kSteps);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0x1AFFCF4A),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0x52FFCF4A)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(t.nextTaskEyebrow,
            style: const TextStyle(
                color: P.gold, fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 0.6)),
        const SizedBox(height: 8),
        Text(atTop ? t.nextTaskDone : t.nextTaskAmount(fmt(need), nextStep),
            style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, letterSpacing: -0.5)),
        if (!atTop) ...[
          const SizedBox(height: 6),
          Text(t.nextTaskSub(fmt(need)),
              style: const TextStyle(color: Color(0xFFDFE6EE), fontSize: 13.5, height: 1.4)),
          const SizedBox(height: 14),
          if (hasActive) ...[
            _soldButton(context),
            const SizedBox(height: 10),
          ],
          _newTradeButton(context),
        ],
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

// ---------- MEGA-JUMP-FEJRING (multi-trins hop uden milepæl) ----------
void showMegaJump(BuildContext context, int before, int after) {
  showDialog(
    context: context,
    barrierColor: Colors.black.withValues(alpha: 0.85),
    builder: (ctx) => _MegaJumpDialog(before: before, after: after),
  );
}

class _MegaJumpDialog extends StatefulWidget {
  final int before;
  final int after;
  const _MegaJumpDialog({required this.before, required this.after});
  @override
  State<_MegaJumpDialog> createState() => _MegaJumpDialogState();
}

class _MegaJumpDialogState extends State<_MegaJumpDialog> {
  late final ConfettiController _confetti;

  @override
  void initState() {
    super.initState();
    _confetti = ConfettiController(duration: const Duration(seconds: 3));
    _confetti.play();
  }

  @override
  void dispose() {
    _confetti.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = context.read<AppState>().t;
    final jump = widget.after - widget.before;
    return Stack(alignment: Alignment.topCenter, children: [
      Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.all(30),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Text('🚀', style: TextStyle(fontSize: 80)),
          const SizedBox(height: 14),
          Text(t.megaJumpTitle(jump),
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 34, fontWeight: FontWeight.w800, color: P.gold, letterSpacing: 0.5)),
          const SizedBox(height: 10),
          Text(t.megaJumpSub(widget.before, widget.after),
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
              onPressed: () => showSharePreview(context),
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
          numberOfParticles: 40,
          maxBlastForce: 26,
          minBlastForce: 12,
          gravity: 0.22,
          emissionFrequency: 0.05,
          colors: const [P.accent, P.gold, Colors.white, Color(0xFF8BF0B8)],
        ),
      ),
    ]);
  }
}

// ---------- DRØM-NÅET-FEJRING ----------
void showDreamReached(BuildContext context, String dreamName, int step) {
  showDialog(
    context: context,
    barrierColor: Colors.black.withValues(alpha: 0.9),
    builder: (ctx) => _DreamReachedDialog(dreamName: dreamName, step: step),
  );
}

class _DreamReachedDialog extends StatefulWidget {
  final String dreamName;
  final int step;
  const _DreamReachedDialog({required this.dreamName, required this.step});
  @override
  State<_DreamReachedDialog> createState() => _DreamReachedDialogState();
}

class _DreamReachedDialogState extends State<_DreamReachedDialog> {
  late final ConfettiController _confetti;

  @override
  void initState() {
    super.initState();
    _confetti = ConfettiController(duration: const Duration(seconds: 4));
    _confetti.play();
  }

  @override
  void dispose() {
    _confetti.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = context.read<AppState>().t;
    return Stack(alignment: Alignment.topCenter, children: [
      const Positioned.fill(child: GoldRain(count: 26)),
      Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.all(28),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Text('🌟', style: TextStyle(fontSize: 88)),
          const SizedBox(height: 12),
          Text(t.dreamReachedTitle,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 36, fontWeight: FontWeight.w800, color: P.gold, letterSpacing: 1)),
          const SizedBox(height: 12),
          Text(t.dreamReachedSub(widget.dreamName),
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800, height: 1.4)),
          const SizedBox(height: 24),
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
              onPressed: () => showSharePreview(context),
              child: Text(t.shareMyLadder, style: const TextStyle(fontWeight: FontWeight.w700)),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                backgroundColor: P.surface2,
                foregroundColor: P.gold,
                padding: const EdgeInsets.symmetric(vertical: 15),
                side: const BorderSide(color: Color(0xFF574A14)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              onPressed: () {
                Navigator.pop(context);
                showDreamSheet(context);
              },
              child: Text(t.setNewDream, style: const TextStyle(fontWeight: FontWeight.w800)),
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
          numberOfParticles: 60,
          maxBlastForce: 30,
          minBlastForce: 14,
          gravity: 0.2,
          emissionFrequency: 0.06,
          colors: const [P.accent, P.gold, Colors.white, Color(0xFF8BF0B8), Color(0xFFFFE6A3)],
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
  final _dreamName = TextEditingController();
  final _dreamCost = TextEditingController();

  @override
  void dispose() {
    _dreamName.dispose();
    _dreamCost.dispose();
    super.dispose();
  }

  double _parseAmt(String s) {
    final digits = s.replaceAll(RegExp(r'[^0-9]'), '');
    return double.tryParse(digits) ?? 0;
  }

  void _finishWith(void Function(BuildContext) sheet) {
    context.read<AppState>().setOnboarded();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final c = navigatorKey.currentContext;
      if (c != null) sheet(c);
    });
  }

  @override
  Widget build(BuildContext context) {
    context.watch<AppState>();
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0.4, -1),
            radius: 1.2,
            colors: [Color(0xFF0C2417), Color(0xFF000000)],
          ),
        ),
        child: Stack(children: [
          const Positioned.fill(child: GoldRain()),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(28, 40, 28, 28),
              child: Column(children: [
                Expanded(child: _buildPage()),
                _bottomAction(),
                const SizedBox(height: 14),
                _dots(),
                const SizedBox(height: 8),
              ]),
            ),
          ),
        ]),
      ),
    );
  }

  Widget _flagPicker() {
    final s = context.read<AppState>();
    Widget flag(String emoji, String label, AppLang lang) {
      final active = s.lang == lang;
      return Expanded(
        child: GestureDetector(
          onTap: () {
            s.setLang(lang);
            setState(() {});
          },
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 5),
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: active ? P.accentDim : P.surface2,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: active ? P.accent : P.line, width: active ? 2 : 1),
            ),
            child: Column(children: [
              Text(emoji, style: const TextStyle(fontSize: 26)),
              const SizedBox(height: 4),
              Text(label,
                  style: TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w700,
                      color: active ? P.accent : P.muted)),
            ]),
          ),
        ),
      );
    }

    return Row(children: [
      flag('🇩🇰', 'Dansk', AppLang.da),
      flag('🇬🇧', 'English', AppLang.en),
    ]);
  }

  Widget _dots() => Row(mainAxisAlignment: MainAxisAlignment.center, children: List.generate(4, (i) {
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
      final s = context.read<AppState>();
      return _PageWrap(children: [
        Text(t.obTitle1,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800, height: 1.15, color: P.txt)),
        const SizedBox(height: 18),
        Text(t.obLead1,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFFCDD6DF), fontSize: 16, height: 1.5)),
        const SizedBox(height: 26),
        Text(t.languageCaption,
            style: const TextStyle(color: P.muted, fontSize: 12.5, fontWeight: FontWeight.w700, letterSpacing: 0.4)),
        const SizedBox(height: 10),
        _flagPicker(),
        const SizedBox(height: 18),
        Text(t.currencyCaption,
            style: const TextStyle(color: P.muted, fontSize: 12.5, fontWeight: FontWeight.w700, letterSpacing: 0.4)),
        const SizedBox(height: 10),
        _obCurrency(s),
      ]);
    } else if (_page == 1) {
      final hasName = _dreamName.text.trim().isNotEmpty;
      return _PageWrap(children: [
        Text(t.obDreamTitle,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800, height: 1.15, color: P.txt)),
        const SizedBox(height: 16),
        Text(t.obDreamLead,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFFCDD6DF), fontSize: 15.5, height: 1.5)),
        const SizedBox(height: 24),
        _obField(_dreamName, t.dreamNameQ, t.dreamNameHint, false),
        if (hasName) ...[
          const SizedBox(height: 12),
          _obField(_dreamCost, t.dreamCostQ, '0', true),
        ],
      ]);
    } else if (_page == 2) {
      final dreamStep = context.read<AppState>().dreamStep;
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
        if (dreamStep != null)
          _ladderRow('${t.stepWord} $dreamStep',
              '✨ ${context.read<AppState>().dreamName}', const Color(0xFF574A14), const Color(0xFF1A1606), gold: true),
        _ladderRow('${t.stepWord} $kSteps', '${fmt(kLadder[kSteps])} 👑', const Color(0xFF574A14), const Color(0xFF1A1606), gold: true),
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

  // Handling-knap fastgjort i bunden – altid synlig over tastaturet.
  Widget _bottomAction() {
    final t = context.read<AppState>().t;
    if (_page == 0) {
      return _obPrimary(t.next, () => setState(() => _page = 1));
    } else if (_page == 1) {
      final hasName = _dreamName.text.trim().isNotEmpty;
      final hasCost = _parseAmt(_dreamCost.text) > 0;
      if (!(hasName && hasCost)) return const SizedBox.shrink();
      return _obPrimary(t.next, () {
        context.read<AppState>().setDream(_dreamName.text, _parseAmt(_dreamCost.text));
        setState(() => _page = 2);
      });
    } else if (_page == 2) {
      return _obPrimary(t.understood, () => setState(() => _page = 3));
    }
    return const SizedBox.shrink();
  }

  Widget _obCurrency(AppState s) => GestureDetector(
        onTap: () => showCurrencyPicker(context, s),
        behavior: HitTestBehavior.opaque,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: P.surface2,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: P.line),
          ),
          child: Row(children: [
            Text(s.currency.flag, style: const TextStyle(fontSize: 22)),
            const SizedBox(width: 12),
            Expanded(
              child: Text('${s.currency.code} · ${s.currency.symbol}',
                  style: const TextStyle(fontWeight: FontWeight.w700, color: P.txt, fontSize: 15.5)),
            ),
            const Icon(Icons.keyboard_arrow_down_rounded, color: P.muted, size: 22),
          ]),
        ),
      );

  Widget _obField(TextEditingController c, String label, String hint, bool number) =>
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label,
            style: const TextStyle(color: P.muted, fontSize: 12.5, fontWeight: FontWeight.w700)),
        const SizedBox(height: 6),
        TextField(
          controller: c,
          autofocus: !number,
          onChanged: (_) => setState(() {}),
          keyboardType:
              number ? const TextInputType.numberWithOptions(decimal: false) : TextInputType.text,
          style: const TextStyle(color: P.txt, fontSize: 16),
          cursorColor: P.accent,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: P.muted),
            filled: true,
            fillColor: P.surface2,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(13), borderSide: const BorderSide(color: P.line)),
            focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(13), borderSide: const BorderSide(color: P.accent)),
          ),
        ),
      ]);

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

// ---------- GULD-REGN (samme stil som millionladder.com) ----------
class _Coin {
  final double x; // 0..1 vandret
  final double size;
  final double speed;
  final double phase;
  final double drift;
  final double alpha;
  _Coin(this.x, this.size, this.speed, this.phase, this.drift, this.alpha);
}

class GoldRain extends StatefulWidget {
  final int count;
  const GoldRain({super.key, this.count = 16});
  @override
  State<GoldRain> createState() => _GoldRainState();
}

class _GoldRainState extends State<GoldRain> with SingleTickerProviderStateMixin {
  late final AnimationController _c;
  late final List<_Coin> _coins;

  @override
  void initState() {
    super.initState();
    final r = math.Random(7);
    _coins = List.generate(widget.count, (_) {
      return _Coin(
        r.nextDouble(),
        4 + r.nextDouble() * 5,
        0.6 + r.nextDouble() * 0.9,
        r.nextDouble(),
        6 + r.nextDouble() * 16,
        0.18 + r.nextDouble() * 0.28,
      );
    });
    _c = AnimationController(vsync: this, duration: const Duration(seconds: 9))
      ..repeat();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: AnimatedBuilder(
        animation: _c,
        builder: (context, _) => CustomPaint(
          painter: _CoinPainter(_coins, _c.value),
          size: Size.infinite,
        ),
      ),
    );
  }
}

class _CoinPainter extends CustomPainter {
  final List<_Coin> coins;
  final double t;
  _CoinPainter(this.coins, this.t);
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint();
    for (final c in coins) {
      final prog = (t * c.speed + c.phase) % 1.0;
      final y = prog * (size.height + 40) - 20;
      final x = c.x * size.width +
          math.sin((prog * 2 * math.pi) + c.phase * 6) * c.drift;
      p.color = P.gold.withValues(alpha: c.alpha);
      canvas.drawCircle(Offset(x, y), c.size, p);
    }
  }

  @override
  bool shouldRepaint(_CoinPainter old) => old.t != t;
}

class _PageWrap extends StatelessWidget {
  final List<Widget> children;
  const _PageWrap({required this.children});
  @override
  Widget build(BuildContext context) => LayoutBuilder(
        builder: (context, constraints) => SingleChildScrollView(
          // Scrollbar så knappen kan nås over tastaturet (fx ved drømme-beløb).
          padding: const EdgeInsets.only(bottom: 8),
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: children,
            ),
          ),
        ),
      );
}
