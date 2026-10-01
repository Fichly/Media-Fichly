// Couvertures d'article : node outils/couverture.js [handle…]
// Sans argument, rend toutes les couvertures définies dans articles-v2/couvertures/couvertures.js.
// → livrables/articles/fichly-<handle>-couverture.png (1200 × 860)
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PAGE = 'file://' + path.join(ROOT, 'articles-v2', 'couvertures', 'index.html');

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 860 }, deviceScaleFactor: 1 });
  await page.goto(PAGE);
  await page.evaluate(() => window.COUV.ready);
  const handles = process.argv.slice(2).length ? process.argv.slice(2) : await page.evaluate(() => window.COUV.handles);
  const out = path.join(ROOT, 'livrables', 'articles');
  fs.mkdirSync(out, { recursive: true });
  let failed = false;
  for (const h of handles) {
    const errors = [];
    const p = await browser.newPage({ viewport: { width: 1200, height: 860 }, deviceScaleFactor: 1 });
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('pageerror', e => errors.push(String(e)));
    await p.goto(`${PAGE}?a=${h}`);
    await p.evaluate(() => window.COUV.ready);
    const f = path.join(out, `fichly-${h}-couverture.png`);
    await p.screenshot({ path: f, clip: { x: 0, y: 0, width: 1200, height: 860 } });
    console.log('→', path.relative(ROOT, f), (fs.statSync(f).size / 1e6).toFixed(2), 'Mo');
    errors.forEach(e => console.error('  ✗', e));
    failed = failed || errors.length > 0;
    await p.close();
  }
  await browser.close();
  if (failed) process.exit(2);
})();
