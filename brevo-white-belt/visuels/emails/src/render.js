// node render.js <page.html> <sortie.png> : capture du <svg id="s"> à sa taille réelle, et affiche les erreurs de fit().
const PW = process.env.PW || '/tmp/claude-0/-home-user-Media-Fichly/c1bcbdb8-07c3-5cd6-ab46-c7e161c8db29/scratchpad/pw/node_modules/playwright';
const { chromium } = require(PW);
(async () => {
  const [src, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('pageerror', e.message));
  await p.goto('file://' + src);
  await p.waitForFunction(() => document.title === 'ready', null, { timeout: 8000 }).catch(() => console.log('timeout'));
  await p.waitForTimeout(200);
  console.log('errs', JSON.stringify(await p.evaluate(() => window.ERRS)));
  await (await p.$('#s')).screenshot({ path: out }); await b.close();
})();
