import 'package:flutter_test/flutter_test.dart';

import 'package:million_ladder/app_state.dart';

void main() {
  test('Trappen har 38 niveauer og rammer 1.000.000', () {
    expect(kLadder.length, kSteps + 1);
    expect(kLadder.first, 0);
    expect(kLadder.last, kTarget);
  });

  test('Kapital, kasse og trin beregnes korrekt', () {
    final s = AppState();
    s.deposits = [1000];
    s.addTrade('Sko', 10, 50, '');
    expect(s.boundCapital, 500);
    expect(s.cashOnHand, 500);
    expect(s.capital, 1000);

    s.sell(s.trades.first.id, 10, 100);
    expect(s.capital, 1500);
    expect(s.boundCapital, 0);
    expect(s.realizedTotal, 500);
  });
}
