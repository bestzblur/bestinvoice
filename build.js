// Bundles src/ into one self-contained, offline HTML file: dist/Bestinvoice.html
const fs = require('fs'), path = require('path');
const src = f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const logo = 'data:image/svg+xml;base64,' + Buffer.from(src('logo.svg')).toString('base64');
const fontDir = (pkg) => path.join(__dirname, 'node_modules', '@fontsource', pkg, 'files');
let fonts = '';
// extra document fonts (SIL OFL), pre-subset to Thai + Latin in fonts/
for (const f of fs.readdirSync(path.join(__dirname, 'fonts')).filter(f => f.endsWith('.woff2'))) {
  const [key, w] = f.replace('.woff2', '').split('-');
  fonts += `@font-face{font-family:'BI ${key}';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(__dirname, 'fonts', f)).toString('base64')}) format('woff2')}\n`;
}
for (const [pkg, fam, weights] of [['ibm-plex-sans-thai', 'Plex Thai', [400, 500, 600, 700]]]) {
  for (const w of weights) for (const [sub, range] of [['thai', 'U+0E01-0E5B,U+200C-200D,U+25CC'], ['latin', 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD,U+2713,U+0E3F']]) {
    const f = path.join(fontDir(pkg), `${pkg}-${sub}-${w}-normal.woff2`);
    if (!fs.existsSync(f)) continue;
    fonts += `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${fs.readFileSync(f).toString('base64')}) format('woff2');unicode-range:${range}}\n`;
  }
}
const lib = f => fs.readFileSync(path.join(__dirname, 'node_modules', f), 'utf8');
const js = [lib('qrcode-generator/qrcode.js'), lib('jsqr/dist/jsQR.js'), ...['i18n.js', 'baht.js', 'core.js', 'render.js', 'verify.js', 'app.js', 'designer.js'].map(src)].join('\n;\n').replace(/%%LOGO%%/g, logo);
const html = src('index.html').replace('%%FONTS%%', () => fonts).replace('%%CSS%%', () => src('styles.css')).replace('%%JS%%', () => js.replace(/<\/script/gi, '<\\/script')).replace(/%%LOGO%%/g, logo);
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'Bestinvoice.html'), html);
console.log('dist/Bestinvoice.html', (html.length / 1024).toFixed(0) + ' KB');
