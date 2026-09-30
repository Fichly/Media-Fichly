// Rendu d'une fiche : node outils/rendu.js <id> stills [t…] | gif [fps] | mp4 [fps] [--scenario nom]
// <id> : dossier sous fiches/ (LinkedIn) ou chemin depuis la racine (ex. blog/lean-manufacturing/1-routine)
// stills : PNG de contrôle dans controle/<nom>-t<t>.png
// gif    : livrables/<id>.gif, .mp4 et .png (image t = 0) ; mp4 : sans le GIF (mouvements de caméra)
// Le format (largeur × hauteur) est lu sur la page (window.FICHE).
// Dépendances : playwright (Chromium) et ffmpeg (FFMPEG=… ou ffmpeg dans le PATH).
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const si = argv.indexOf('--scenario');
const scenario = si >= 0 ? argv.splice(si, 2)[1] : null;
const [id, mode = 'stills', ...rest] = argv;
const name = scenario ? `${id}--${scenario}` : id;
// Nom de fichier unique pour les images de contrôle (blog/<article>/<visuel> → blog__<article>__<visuel>)
const base = name.replace(/\//g, '__');
if (!id) { console.error('Usage : node outils/rendu.js <id> stills [t…] | gif [fps]'); process.exit(1); }
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

(async () => {
  const dir = fs.existsSync(path.join(ROOT, 'fiches', id, 'index.html')) ? path.join(ROOT, 'fiches', id) : path.join(ROOT, id);
  const page_url = 'file://' + path.join(dir, 'index.html') + (scenario ? `?scenario=${scenario}` : '');
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(page_url);
  await page.evaluate(() => window.FICHE.ready);
  const { duration, width, height } = await page.evaluate(() => window.FICHE);
  await page.setViewportSize({ width, height });
  // Calque plein cadre quasi transparent : le basculer force Chromium à tout redessiner,
  // sinon l'anti-aliasing des zones redessinées partiellement varie d'une image à l'autre.
  await page.evaluate(() => {
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    Object.entries({ id: '__repaint', x: 0, y: 0, width: window.FICHE.width, height: window.FICHE.height, fill: '#000', 'fill-opacity': 0, 'pointer-events': 'none' })
      .forEach(([k, v]) => r.setAttribute(k, v));
    document.getElementById('stage').appendChild(r);
  });
  let flip = false;
  const shot = async (t, file) => {
    flip = !flip;
    await page.evaluate(([t, flip]) => {
      document.getElementById('__repaint').setAttribute('fill-opacity', flip ? 0.001 : 0);
      window.FICHE.draw(t);
    }, [t, flip]);
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width, height } });
  };

  if (mode === 'stills') {
    const times = rest.length ? rest.map(Number) : [0];
    fs.mkdirSync(path.join(ROOT, 'controle'), { recursive: true });
    for (const t of times) {
      const f = path.join(ROOT, 'controle', `${base}-t${t}.png`);
      await shot(t, f);
      console.log('→', path.relative(ROOT, f));
    }
  } else if (mode === 'gif' || mode === 'mp4') {
    const fps = Number(rest[0] || 20);
    const n = Math.round(duration * fps);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `${base}-`));
    for (let i = 0; i < n; i++) await shot(i / fps, path.join(tmp, `f${String(i).padStart(4, '0')}.png`));
    const out = path.join(ROOT, 'livrables');
    fs.mkdirSync(path.dirname(path.join(out, name)), { recursive: true });
    const seq = path.join(tmp, 'f%04d.png');
    fs.copyFileSync(path.join(tmp, 'f0000.png'), path.join(out, `${name}.png`));
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', seq,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', path.join(out, `${name}.mp4`)]);
    if (mode === 'gif') execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', seq,
      '-vf', 'split[a][b];[a]palettegen=max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=none',
      '-loop', '0', path.join(out, `${name}.gif`)]);
    fs.rmSync(tmp, { recursive: true, force: true });
    for (const ext of mode === 'gif' ? ['gif', 'mp4', 'png'] : ['mp4', 'png']) {
      const f = path.join(out, `${name}.${ext}`);
      console.log('→', path.relative(ROOT, f), (fs.statSync(f).size / 1e6).toFixed(2), 'Mo');
    }
    console.log(`${n} images, ${fps} i/s, ${duration} s`);
  }
  await browser.close();
  if (errors.length) { errors.forEach(e => console.error('✗', e)); process.exit(2); }
})();
