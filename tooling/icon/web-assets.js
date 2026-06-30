const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON = path.resolve(__dirname, '../../app/assets/icon/icon.png');
const WEB = path.resolve(__dirname, '../../web');
if (!fs.existsSync(WEB)) fs.mkdirSync(WEB, { recursive: true });

// ---- Favicons / touch icons (resize fra app-ikonet) ----
const sizes = [
  ['favicon-16.png', 16],
  ['favicon-32.png', 32],
  // Google bruger ikke favicons under 48px – 48/96 sikrer M-ikonet i søgeresultater.
  ['favicon-48.png', 48],
  ['favicon-96.png', 96],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

async function favicons() {
  for (const [name, size] of sizes) {
    await sharp(ICON).resize(size, size).png().toFile(path.join(WEB, name));
    console.log('Wrote', name);
  }
}

// ---- OG / social share image (1200x630) ----
function ogImage() {
  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a140e"/><stop offset="1" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2bd576"/><stop offset="1" stop-color="#1fa863"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe9a8"/><stop offset=".5" stop-color="#ffcf4a"/><stop offset="1" stop-color="#e0a312"/>
    </linearGradient>
    <radialGradient id="glow" cx="20%" cy="0%" r="70%">
      <stop offset="0" stop-color="rgba(43,213,118,0.22)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- M tile (guld M på sort) -->
  <rect x="80" y="215" width="200" height="200" rx="48" fill="url(#tile)" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
  <path d="M 130 372 L 130 258 L 180 318 L 230 258 L 230 372"
        fill="none" stroke="url(#gold)" stroke-width="28" stroke-linejoin="round" stroke-linecap="round"/>

  <text x="332" y="236" fill="#ffcf4a" font-family="Manrope" font-weight="800" font-size="26" letter-spacing="6">MILLION LADDER</text>
  <text x="330" y="318" fill="#ffffff" font-family="Manrope" font-weight="800" font-size="66">Fra 0 til 1.000.000 kr.</text>
  <text x="330" y="394" fill="#2bd576" font-family="Manrope" font-weight="800" font-size="66">i 37 handler.</text>
  <text x="332" y="456" fill="#c3cad3" font-family="Manrope" font-weight="600" font-size="30">Ryd op. Sælg. Stig op ad trappen.</text>

  <rect x="332" y="500" width="788" height="16" rx="8" fill="#15181d" stroke="#23272e"/>
  <rect x="332" y="500" width="488" height="16" rx="8" fill="#2bd576"/>
</svg>`;
  try {
    const { Resvg } = require('@resvg/resvg-js');
    const r = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
      font: {
        fontFiles: [path.resolve(__dirname, '../../app/assets/fonts/Manrope.ttf')],
        loadSystemFonts: true,
        defaultFontFamily: 'Manrope',
      },
    });
    fs.writeFileSync(path.join(WEB, 'og-image.png'), r.render().asPng());
    console.log('Wrote og-image.png');
  } catch (e) {
    console.error('OG image skipped:', e.message);
  }
}

(async () => { await favicons(); ogImage(); })();
