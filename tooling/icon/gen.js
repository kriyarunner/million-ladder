const sharp = require('sharp');
const path = require('path');

// Million Ladder app-ikon: grøn brand-gradient + guld "M" (vektor, fontuafhængigt).
const defs = `
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2bd576"/>
    <stop offset="1" stop-color="#1fa863"/>
  </linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffe9a8"/>
    <stop offset=".5" stop-color="#ffcf4a"/>
    <stop offset="1" stop-color="#e0a312"/>
  </linearGradient>`;

const M = (w = 106) =>
  `<path d="M 300 730 L 300 300 L 512 540 L 724 300 L 724 730"
     fill="none" stroke="url(#gold)" stroke-width="${w}"
     stroke-linejoin="round" stroke-linecap="round"/>`;

// Fuld-bleed ikon (iOS + legacy Android): grøn baggrund + guld M.
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>${defs}</defs>
  <rect width="1024" height="1024" fill="url(#green)"/>
  ${M()}
</svg>`;

// Android adaptiv-forgrund: gennemsigtig + større guld M (læselig i safe-zone ~66%).
// M skaleres op ~1.35x omkring centrum (512,512) så den fylder mere af det synlige felt.
const fgSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>${defs}</defs>
  <g transform="translate(512 512) scale(1.32) translate(-512 -512)">
    ${M()}
  </g>
</svg>`;

const iconOut = path.resolve(__dirname, '../../app/assets/icon/icon.png');
const fgOut = path.resolve(__dirname, '../../app/assets/icon/icon_foreground.png');

(async () => {
  await sharp(Buffer.from(iconSvg)).resize(1024, 1024).png().toFile(iconOut);
  console.log('Wrote', iconOut);
  await sharp(Buffer.from(fgSvg)).resize(1024, 1024).png().toFile(fgOut);
  console.log('Wrote', fgOut);
})().catch((e) => { console.error(e); process.exit(1); });
