const sharp = require('sharp');
const path = require('path');

// Million Ladder app-ikon: fuld-bleed grøn gradient + hvidt "M" (vektor, fontuafhængigt).
// Fuld-bleed (ingen intern afrunding) — iOS/Android afrunder selv til den rigtige form.
const svg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2bd576"/>
      <stop offset="1" stop-color="#1fa863"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#g)"/>
  <path d="M 300 730 L 300 300 L 512 540 L 724 300 L 724 730"
        fill="none" stroke="#ffffff" stroke-width="106"
        stroke-linejoin="round" stroke-linecap="round"/>
</svg>`;

const out = path.resolve(__dirname, '../../app/assets/icon/icon.png');

sharp(Buffer.from(svg))
  .resize(1024, 1024)
  .png()
  .toFile(out)
  .then(() => console.log('Wrote', out))
  .catch((e) => { console.error(e); process.exit(1); });
