const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUT = path.resolve(__dirname, 'options');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const M = (stroke, w = 106) =>
  `<path d="M 300 730 L 300 300 L 512 540 L 724 300 L 724 730"
     fill="none" stroke="${stroke}" stroke-width="${w}"
     stroke-linejoin="round" stroke-linecap="round"/>`;

const defs = `
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2bd576"/><stop offset="1" stop-color="#1fa863"/></linearGradient>
  <linearGradient id="dark" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#15181d"/><stop offset="1" stop-color="#000000"/></linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffe9a8"/><stop offset=".5" stop-color="#ffcf4a"/><stop offset="1" stop-color="#e0a312"/></linearGradient>
  <radialGradient id="coin" cx="38%" cy="30%" r="75%">
    <stop offset="0" stop-color="#fff0c2"/><stop offset=".55" stop-color="#ffcf4a"/><stop offset="1" stop-color="#d99a17"/></radialGradient>`;

const variants = {
  // B: sort tile + guld M (sleek, "dollar" via guld uden at blive billigt)
  'opt-b-gold-on-black': `
    <rect width="1024" height="1024" fill="url(#dark)"/>
    ${M('url(#gold)')}`,

  // C: guld-mønt/medaljon + mørkt M (stærkeste "penge"-signal)
  'opt-c-coin': `
    <rect width="1024" height="1024" fill="url(#dark)"/>
    <circle cx="512" cy="512" r="392" fill="url(#coin)"/>
    <circle cx="512" cy="512" r="392" fill="none" stroke="#b6850f" stroke-width="16" opacity=".55"/>
    <circle cx="512" cy="512" r="346" fill="none" stroke="#fff3cf" stroke-width="6" opacity=".4"/>
    ${M('#2a1d05', 96)}`,

  // D: grøn tile + guld M (brand-grøn + penge-guld)
  'opt-d-green-gold': `
    <rect width="1024" height="1024" fill="url(#green)"/>
    ${M('url(#gold)')}`,
};

(async () => {
  for (const [name, body] of Object.entries(variants)) {
    const svg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${body}</svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, name + '.png'));
    console.log('Wrote', name);
  }
})();
