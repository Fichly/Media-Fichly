// Capture d'une page HTML quelconque (planche de personnages, d'icônes…) en PNG.
// Usage : node deck/outils/planche.js <page.html> <sortie.png> [largeur=1400] [échelle=2]
// Attend les polices et window.PLANCHE.ready s'il existe ; sort en erreur si la console signale une erreur.
const path = require('path');
const { chromium } = require('playwright');

const [src, out, largeur = 1400, echelle = 2] = process.argv.slice(2);
if (!src || !out) { console.error('Usage : node deck/outils/planche.js <page.html> <sortie.png> [largeur] [échelle]'); process.exit(1); }

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: Number(largeur), height: 900 }, deviceScaleFactor: Number(echelle) });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  page.on('requestfailed', r => errors.push(`Ressource introuvable : ${r.url()}`));
  await page.goto('file://' + path.resolve(src));
  await page.evaluate(async () => { await document.fonts.ready; if (window.PLANCHE && window.PLANCHE.ready) await window.PLANCHE.ready; });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.resolve(out), fullPage: true });
  console.log('→', out);
  await browser.close();
  if (errors.length) { errors.forEach(e => console.error('✗', e)); process.exit(2); }
})();
