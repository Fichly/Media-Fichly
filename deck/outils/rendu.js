// Rendu d'une fiche du deck « Les outils du lean » (A5, 148 × 210 mm, recto-verso).
// Usage : node deck/outils/rendu.js <dossier de la fiche ou index.html> [dossier de sortie] [--dpi 300] [--pdf]
// La page contient deux éléments .face (recto puis verso), chacun de 148 × 210 mm.
// Sorties : <nom>-recto.png et <nom>-verso.png (300 dpi par défaut), <nom>.pdf avec --pdf.
// Contrôles (sortie en erreur s'il y en a) : erreurs console, polices non chargées,
// texte hors de la zone tranquille de 5 mm, texte coupé par un débordement.
// Un élément marqué data-bleed (et ses enfants) peut aller jusqu'au bord ; data-nocheck l'exclut des contrôles.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const argv = process.argv.slice(2);
const flag = name => { const i = argv.indexOf(name); if (i < 0) return null; const v = argv[i + 1]; argv.splice(i, 2); return v; };
const dpi = Number(flag('--dpi') || 300);
const pdfIdx = argv.indexOf('--pdf');
const wantPdf = pdfIdx >= 0; if (wantPdf) argv.splice(pdfIdx, 1);
const [src, outArg] = argv;
if (!src) { console.error('Usage : node deck/outils/rendu.js <fiche> [sortie] [--dpi 300] [--pdf]'); process.exit(1); }

const file = fs.statSync(src).isDirectory() ? path.join(src, 'index.html') : src;
const dir = path.dirname(path.resolve(file));
const name = path.basename(dir);
const out = path.resolve(outArg || dir);
const MM = 96 / 25.4; // px CSS par mm
const SAFE = 5 * MM;

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: Math.ceil(148 * MM) + 40, height: Math.ceil(210 * MM) * 2 + 80 }, deviceScaleFactor: dpi / 96 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  page.on('requestfailed', r => errors.push(`Ressource introuvable : ${r.url()}`));
  await page.goto('file://' + path.resolve(file));
  await page.evaluate(async () => { await document.fonts.ready; if (window.FICHE && window.FICHE.ready) await window.FICHE.ready; });
  await page.waitForTimeout(200);

  const report = await page.evaluate(({ SAFE }) => {
    const issues = [];
    const fonts = [...document.fonts].filter(f => f.status === 'error').map(f => `${f.family} ${f.weight}`);
    if (fonts.length) issues.push(`Polices en échec : ${fonts.join(', ')}`);
    const faces = [...document.querySelectorAll('.face')];
    if (faces.length !== 2) issues.push(`Attendu 2 éléments .face, trouvé ${faces.length}`);
    const label = n => (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).join('.') : n.tagName.toLowerCase()) + ` « ${(n.textContent || '').trim().slice(0, 40)} »`;
    faces.forEach((face, i) => {
      const side = i === 0 ? 'recto' : 'verso';
      const F = face.getBoundingClientRect();
      const walker = document.createTreeWalker(face, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      const seen = new Set();
      while (walker.nextNode()) {
        const t = walker.currentNode;
        if (!t.textContent.trim()) continue;
        const host = t.parentElement;
        if (host.closest('[data-bleed],[data-nocheck]')) continue;
        const cs = getComputedStyle(host);
        if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
        range.selectNodeContents(t);
        for (const r of range.getClientRects()) {
          if (!r.width || !r.height) continue;
          const out = r.left < F.left + SAFE - 0.5 || r.right > F.right - SAFE + 0.5 || r.top < F.top + SAFE - 0.5 || r.bottom > F.bottom - SAFE + 0.5;
          if (out && !seen.has(host)) { seen.add(host); issues.push(`${side} : texte dans la marge de 5 mm : ${label(host)}`); }
        }
      }
      face.querySelectorAll('*').forEach(n => {
        if (n.closest('[data-nocheck]')) return;
        const cs = getComputedStyle(n);
        const clips = /(hidden|clip|auto|scroll)/.test(cs.overflow + cs.overflowX + cs.overflowY);
        if (clips && n !== face && (n.scrollHeight > n.clientHeight + 1 || n.scrollWidth > n.clientWidth + 1) && n.textContent.trim())
          issues.push(`${side} : contenu coupé dans ${label(n)} (${n.scrollWidth}×${n.scrollHeight} pour ${n.clientWidth}×${n.clientHeight})`);
      });
      const R = face.getBoundingClientRect();
      if (Math.abs(R.width - 148 * 96 / 25.4) > 1 || Math.abs(R.height - 210 * 96 / 25.4) > 1)
        issues.push(`${side} : la face mesure ${R.width.toFixed(1)}×${R.height.toFixed(1)} px au lieu de 559,4×793,7`);
    });
    return issues;
  }, { SAFE });

  fs.mkdirSync(out, { recursive: true });
  const faces = await page.$$('.face');
  const names = ['recto', 'verso'];
  for (let i = 0; i < Math.min(2, faces.length); i++) {
    const f = path.join(out, `${name}-${names[i]}.png`);
    const b = await faces[i].boundingBox();
    await page.screenshot({ path: f, animations: 'disabled', clip: { x: b.x, y: b.y, width: 148 * MM, height: 210 * MM } });
    console.log('→', path.relative(process.cwd(), f));
  }
  if (wantPdf) {
    const f = path.join(out, `${name}.pdf`);
    await page.pdf({ path: f, width: '148mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
    console.log('→', path.relative(process.cwd(), f));
  }
  await browser.close();
  const all = [...errors, ...report];
  if (all.length) { all.forEach(e => console.error('✗', e)); process.exit(2); }
  console.log('✓ aucun débordement, aucune erreur');
})();
