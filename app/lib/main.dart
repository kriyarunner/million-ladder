import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import 'app_state.dart';
import 'palette.dart';
import 'screens.dart';

final GlobalKey<ScaffoldMessengerState> messengerKey =
    GlobalKey<ScaffoldMessengerState>();
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

/// Aktuel fane (0 Home, 1 Handler, 2 Trappen, 3 Statistik)
final ValueNotifier<int> tabIndex = ValueNotifier<int>(0);

/// Trin der skal fremhæves på trappen (øges ved hvert kald for at gen-trigge)
final ValueNotifier<int> ladderFlash = ValueNotifier<int>(-1);

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
  ));
  final state = AppState();
  await state.load();
  runApp(
    ChangeNotifierProvider.value(value: state, child: const MillionLadderApp()),
  );
}

/// Viser trappen og fejrer hvis man er rykket op (kaldes efter salg/indskud).
void revealStep(BuildContext context, int beforeStep) {
  final state = context.read<AppState>();
  final after = state.curStep;
  final jump = after - beforeStep;
  if (jump > 0) state.recordJump(jump);
  tabIndex.value = 2;
  // gen-trigger flash selv hvis samme trin
  ladderFlash.value = -1;
  WidgetsBinding.instance.addPostFrameCallback((_) {
    ladderFlash.value = after;
  });
  final ms = state.milestoneBetween(beforeStep, after);
  if (ms != null) {
    HapticFeedback.heavyImpact();
    showMilestone(context, ms);
  } else if (jump > 0) {
    HapticFeedback.heavyImpact();
    _toast(jump > 1 ? 'Flot! $jump trin op – trin $after' : 'Trin $after låst op!',
        good: true);
  } else {
    _toast('Registreret · stadig trin $after');
  }
}

void _toast(String msg, {bool good = false}) {
  messengerKey.currentState
    ?..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(
      content: Text(msg,
          style: TextStyle(
              color: good ? const Color(0xFF05130B) : P.txt,
              fontWeight: FontWeight.w800)),
      backgroundColor: good ? P.accent : P.surface2,
      behavior: SnackBarBehavior.floating,
      duration: const Duration(milliseconds: 1800),
    ));
}

void toast(String msg, {bool good = false}) => _toast(msg, good: good);

class MillionLadderApp extends StatelessWidget {
  const MillionLadderApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Million Ladder',
      debugShowCheckedModeBanner: false,
      scaffoldMessengerKey: messengerKey,
      navigatorKey: navigatorKey,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: P.bg,
        colorScheme: const ColorScheme.dark(
          surface: P.bg,
          primary: P.accent,
        ),
        fontFamily: 'Manrope',
      ),
      home: const RootScaffold(),
    );
  }
}

class RootScaffold extends StatelessWidget {
  const RootScaffold({super.key});
  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(builder: (context, state, _) {
      if (!state.onboarded && state.isFresh) {
        return const OnboardingScreen();
      }
      return ValueListenableBuilder<int>(
        valueListenable: tabIndex,
        builder: (context, index, _) {
          return Scaffold(
            body: IndexedStack(
              index: index,
              children: const [
                HomeScreen(),
                TradesScreen(),
                LadderScreen(),
                StatsScreen(),
              ],
            ),
            bottomNavigationBar: _NavBar(index: index),
          );
        },
      );
    });
  }
}

class _NavBar extends StatelessWidget {
  final int index;
  const _NavBar({required this.index});
  @override
  Widget build(BuildContext context) {
    final items = [
      (Icons.home_outlined, Icons.home, 'Home'),
      (Icons.receipt_long_outlined, Icons.receipt_long, 'Handler'),
      (Icons.stairs_outlined, Icons.stairs, 'Trappen'),
      (Icons.bar_chart_outlined, Icons.bar_chart, 'Statistik'),
    ];
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xF5080A0C),
        border: Border(top: BorderSide(color: P.line)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 64,
          child: Row(
            children: List.generate(items.length, (i) {
              final active = i == index;
              return Expanded(
                child: InkWell(
                  onTap: () => tabIndex.value = i,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(active ? items[i].$2 : items[i].$1,
                          size: 23, color: active ? P.accent : P.muted),
                      const SizedBox(height: 3),
                      Text(items[i].$3,
                          style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: active ? P.accent : P.muted)),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}
