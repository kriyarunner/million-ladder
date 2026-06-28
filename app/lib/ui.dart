import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'palette.dart';

/// Tryk-feedback: skrumper let (97%) ved tryk og giver haptik ved slip.
class Pressable extends StatefulWidget {
  final Widget child;
  final VoidCallback onTap;
  final double scale;
  const Pressable({super.key, required this.child, required this.onTap, this.scale = 0.97});

  @override
  State<Pressable> createState() => _PressableState();
}

class _PressableState extends State<Pressable> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: (_) => setState(() => _down = true),
      onTapCancel: () => setState(() => _down = false),
      onTapUp: (_) {
        setState(() => _down = false);
        HapticFeedback.selectionClick();
        widget.onTap();
      },
      child: AnimatedScale(
        scale: _down ? widget.scale : 1.0,
        duration: const Duration(milliseconds: 100),
        curve: Curves.easeOut,
        child: widget.child,
      ),
    );
  }
}

/// Primær-CTA med en subtil, langsomt glidende gradient + tryk-feedback.
class AnimatedGradientButton extends StatefulWidget {
  final String label;
  final VoidCallback onTap;
  final double height;
  final double radius;
  final double fontSize;
  final Color fg;
  final List<Color> colors;
  final List<BoxShadow>? shadow;
  const AnimatedGradientButton({
    super.key,
    required this.label,
    required this.onTap,
    this.height = 56,
    this.radius = 18,
    this.fontSize = 17,
    this.fg = const Color(0xFF05130B),
    this.colors = const [P.accent, P.accentBright, P.accent],
    this.shadow,
  });

  @override
  State<AnimatedGradientButton> createState() => _AnimatedGradientButtonState();
}

class _AnimatedGradientButtonState extends State<AnimatedGradientButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 3200))
      ..repeat();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.of(context).disableAnimations;
    return Pressable(
      onTap: widget.onTap,
      child: AnimatedBuilder(
        animation: _c,
        builder: (context, _) {
          final dx = -1 + 2 * _c.value; // glidende vindue
          return Container(
            height: widget.height,
            width: double.infinity,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(widget.radius),
              boxShadow: widget.shadow ??
                  [BoxShadow(color: widget.colors.first.withValues(alpha: 0.40), blurRadius: 22, offset: const Offset(0, 6))],
              gradient: reduce
                  ? LinearGradient(colors: [widget.colors.first, widget.colors.first])
                  : LinearGradient(
                      colors: widget.colors,
                      begin: Alignment(dx - 1, 0),
                      end: Alignment(dx + 1, 0),
                    ),
            ),
            child: Text(widget.label,
                style: TextStyle(
                    color: widget.fg, fontSize: widget.fontSize, fontWeight: FontWeight.w800)),
          );
        },
      ),
    );
  }
}
