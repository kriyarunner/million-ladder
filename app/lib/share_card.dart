import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:path_provider/path_provider.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';

import 'app_state.dart';
import 'i18n.dart';
import 'palette.dart';

/// Åbner en fuldskærms-forhåndsvisning af det brandede dele-kort
/// og lader brugeren dele det som billede via telefonens del-menu.
void showSharePreview(BuildContext context, {int? milestoneStep}) {
  final s = context.read<AppState>();
  Navigator.of(context, rootNavigator: true).push(PageRouteBuilder(
    opaque: false,
    barrierColor: Colors.black.withValues(alpha: 0.88),
    pageBuilder: (context, animation, secondaryAnimation) => _SharePreview(
      lang: s.lang,
      step: s.curStep,
      capital: s.capital,
      nextTarget: s.nextTarget,
      milestoneStep: milestoneStep,
    ),
  ));
}

class _SharePreview extends StatefulWidget {
  final AppLang lang;
  final int step;
  final double capital;
  final double nextTarget;
  final int? milestoneStep;
  const _SharePreview({
    required this.lang,
    required this.step,
    required this.capital,
    required this.nextTarget,
    this.milestoneStep,
  });
  @override
  State<_SharePreview> createState() => _SharePreviewState();
}

class _SharePreviewState extends State<_SharePreview> {
  final GlobalKey _cardKey = GlobalKey();
  bool _busy = false;

  Future<void> _share() async {
    if (_busy) return;
    setState(() => _busy = true);
    try {
      final boundary = _cardKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
      final image = await boundary.toImage(pixelRatio: 3.0);
      final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
      final dir = await getTemporaryDirectory();
      final file = File('${dir.path}/million_ladder_${DateTime.now().millisecondsSinceEpoch}.png');
      await file.writeAsBytes(bytes!.buffer.asUint8List());
      final t = Tr(widget.lang);
      final atTop = widget.step >= kSteps;
      final text = atTop ? t.shareTextTop() : t.shareText(widget.step);
      await SharePlus.instance.share(ShareParams(files: [XFile(file.path)], text: text));
    } catch (_) {
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = Tr(widget.lang);
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(children: [
            Align(
              alignment: Alignment.topRight,
              child: IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.close, color: Colors.white70, size: 28),
              ),
            ),
            Expanded(
              child: Center(
                child: RepaintBoundary(
                  key: _cardKey,
                  child: ShareCard(
                    lang: widget.lang,
                    step: widget.step,
                    capital: widget.capital,
                    nextTarget: widget.nextTarget,
                    milestoneStep: widget.milestoneStep,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: P.accent,
                  foregroundColor: const Color(0xFF05130B),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                ),
                onPressed: _busy ? null : _share,
                icon: _busy
                    ? const SizedBox(
                        width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF05130B)))
                    : const Icon(Icons.ios_share, size: 20),
                label: Text(_busy ? t.preparing : t.shareImage,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
              ),
            ),
            const SizedBox(height: 10),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(t.close, style: const TextStyle(color: P.muted, fontWeight: FontWeight.w600)),
            ),
          ]),
        ),
      ),
    );
  }
}

/// Det visuelle, delbare kort (poster-stil).
class ShareCard extends StatelessWidget {
  final AppLang lang;
  final int step;
  final double capital;
  final double nextTarget;
  final int? milestoneStep;
  const ShareCard({
    super.key,
    required this.lang,
    required this.step,
    required this.capital,
    required this.nextTarget,
    this.milestoneStep,
  });

  @override
  Widget build(BuildContext context) {
    final t = Tr(lang);
    final atTop = step >= kSteps;
    final prev = kLadder[step.clamp(0, kSteps)];
    final pct = atTop ? 1.0 : ((capital - prev) / (nextTarget - prev)).clamp(0.0, 1.0);
    final ms = milestoneStep;

    return Container(
      width: 320,
      padding: const EdgeInsets.fromLTRB(26, 28, 26, 22),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFF2A3A30), width: 1.5),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0E2A1B), Color(0xFF06120C), Color(0xFF000000)],
        ),
        boxShadow: [BoxShadow(color: P.accent.withValues(alpha: 0.12), blurRadius: 40, spreadRadius: 2)],
      ),
      child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(
            width: 30,
            height: 30,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(9),
              gradient: const LinearGradient(colors: [P.accent, Color(0xFF1FA863)]),
            ),
            child: const Text('🪜', style: TextStyle(fontSize: 16)),
          ),
          const SizedBox(width: 10),
          const Text('MILLION LADDER',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, letterSpacing: 1.8, color: Colors.white)),
        ]),
        const SizedBox(height: 26),
        if (ms != null) ...[
          Center(child: Text(kMilestoneEmoji[ms] ?? '🎉', style: const TextStyle(fontSize: 60))),
          const SizedBox(height: 12),
          Center(
            child: Text(t.milestoneTitle(ms),
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: Colors.white, height: 1.1)),
          ),
          const SizedBox(height: 8),
          Center(
            child: Text(t.stepXof37(ms),
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: P.gold)),
          ),
        ] else ...[
          Text(atTop ? t.iReached : t.iAmOn,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 1.6, color: P.muted)),
          const SizedBox(height: 6),
          Text.rich(TextSpan(children: [
            TextSpan(
                text: atTop ? '👑 ${t.stepWord} 37' : '${t.stepWord} $step',
                style: const TextStyle(fontSize: 44, fontWeight: FontWeight.w800, color: Colors.white, height: 1)),
            const TextSpan(
                text: ' / 37',
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: P.muted)),
          ])),
          const SizedBox(height: 10),
          Text(fmt(capital),
              style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800, color: P.gold, letterSpacing: -0.5)),
        ],
        const SizedBox(height: 22),
        _LadderStrip(step: step),
        const SizedBox(height: 14),
        ClipRRect(
          borderRadius: BorderRadius.circular(99),
          child: LinearProgressIndicator(
            value: pct,
            minHeight: 9,
            backgroundColor: const Color(0xFF15201A),
            valueColor: const AlwaysStoppedAnimation(P.accent),
          ),
        ),
        const SizedBox(height: 8),
        Text(atTop ? t.millionReachedEmoji : t.pctToNext((pct * 100).round()),
            style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: P.muted)),
        const SizedBox(height: 22),
        Container(height: 1, color: const Color(0x14FFFFFF)),
        const SizedBox(height: 14),
        Text(t.cardTagline,
            style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w700, color: Colors.white, height: 1.3)),
        const SizedBox(height: 4),
        Text(t.cardTagline2,
            style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: P.accent)),
      ]),
    );
  }
}

class _LadderStrip extends StatelessWidget {
  final int step;
  const _LadderStrip({required this.step});
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 22,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: List.generate(kSteps, (i) {
          final idx = i + 1;
          final done = idx <= step;
          final cur = idx == step;
          final h = 8.0 + (i / (kSteps - 1)) * 12.0;
          return Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 0.8),
              height: cur ? 22 : h,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(2),
                color: cur
                    ? P.gold
                    : done
                        ? P.accent
                        : const Color(0xFF1B2620),
                boxShadow: cur ? [BoxShadow(color: P.gold.withValues(alpha: 0.6), blurRadius: 6)] : null,
              ),
            ),
          );
        }),
      ),
    );
  }
}
