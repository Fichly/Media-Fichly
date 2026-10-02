// Version imprimeur d'une carte : chaque face sur une planche de 166 × 228 mm,
// format fini 148 × 210 mm, fond perdu de 3 mm (bandeau, fond, frise, grain), traits de coupe.
// Usage : node deck/gabarit/imprimeur.js <dossier de la fiche> <dossier de sortie>
// À valider avec l'imprimeur (fond perdu demandé, repères, profil couleur) avant tirage.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const [src, outArg] = process.argv.slice(2);
if (!src) { console.error('Usage : node deck/gabarit/imprimeur.js <fiche> [sortie]'); process.exit(1); }
const file = fs.statSync(src).isDirectory() ? path.join(src, 'index.html') : src;
const name = path.basename(path.dirname(path.resolve(file)));
const out = path.resolve(outArg || path.dirname(file));

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  page.on('requestfailed', r => errors.push(`Ressource introuvable : ${r.url()}`));
  await page.goto('file://' + path.resolve(file));
  await page.evaluate(async () => { await document.fonts.ready; if (window.FICHE && window.FICHE.ready) await window.FICHE.ready; });
  await page.evaluate(() => {
    const st = document.createElement('style');
    st.textContent = '@page{size:166mm 228mm;margin:0} @media screen{.face{margin:0}}';
    document.head.appendChild(st);
    document.body.classList.add('imprimeur');
    // traits de coupe : à 3 mm du format fini (hors fond perdu), 5 mm de long, 0,25 pt
    const T = 9, W = 166, H = 228, F = [T, W - T], G = [T, H - T], m = 'stroke="#000" stroke-width="0.09"';
    let traits = '';
    F.forEach(x => { traits += `<line x1="${x}" y1="1" x2="${x}" y2="6" ${m}/><line x1="${x}" y1="${H - 6}" x2="${x}" y2="${H - 1}" ${m}/>`; });
    G.forEach(y => { traits += `<line x1="1" y1="${y}" x2="6" y2="${y}" ${m}/><line x1="${W - 6}" y1="${y}" x2="${W - 1}" y2="${y}" ${m}/>`; });
    document.querySelectorAll('.face').forEach(face => {
      const pl = document.createElement('div');
      pl.className = 'planche';
      face.parentNode.insertBefore(pl, face);
      pl.appendChild(face);
      pl.insertAdjacentHTML('beforeend', `<svg class="reperes" viewBox="0 0 ${W} ${H}">${traits}</svg>`);
    });
  });
  fs.mkdirSync(out, { recursive: true });
  const f = path.join(out, `${name}-imprimeur.pdf`);
  await page.pdf({ path: f, width: '166mm', height: '228mm', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('→', path.relative(process.cwd(), f));
  if (errors.length) { errors.forEach(e => console.error('✗', e)); process.exit(2); }
})();
