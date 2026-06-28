import 'package:flutter/material.dart';

class P {
  // Baggrund + flader (let løftet for OLED-separation, stadig dybsort)
  static const bg = Color(0xFF050608);
  static const surface = Color(0xFF101319);
  static const surface2 = Color(0xFF181C23);
  static const line = Color(0xFF262B33);
  static const txt = Color(0xFFFFFFFF);
  static const muted = Color(0xFF8A909A);
  static const accent = Color(0xFF2BD576);
  static const accentBright = Color(0xFF3FE88C);
  static const accentLight = Color(0xFF8BF0B8);
  static const accentDim = Color(0xFF16613A);
  static const gold = Color(0xFFFFCF4A);
  static const goldSoft = Color(0xFFFFC845);
  static const red = Color(0xFFFF5C5C);

  // Display-/brand-font (helte-tal + titler). Body = Manrope.
  static const display = 'SpaceGrotesk';

  // Elevation-system (subtile skygger → dybde + hierarki)
  static const List<BoxShadow> e1 = [
    BoxShadow(color: Color(0x3D000000), blurRadius: 10, offset: Offset(0, 3)),
  ];
  static const List<BoxShadow> e2 = [
    BoxShadow(color: Color(0x52000000), blurRadius: 18, offset: Offset(0, 6)),
  ];
}
