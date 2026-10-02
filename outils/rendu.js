// Rendu d'une fiche : node outils/rendu.js <id> stills [t…] | gif [fps] | mp4 [fps] | story [fps] [--scenario nom]
// <id> : nom d'une fiche LinkedIn (fiches/<id>/) ou chemin d'un dossier contenant index.html (stories/5-pourquoi).
// stills : PNG de contrôle dans controle/<id>-t<t>.png
// gif    : livrables/<id>.gif, .mp4 et .png (image t = 0) ; mp4 : sans le GIF (mouvements de caméra)
// story  : livrables/stories/<id>.mp4 (maître 1080 × 1920), <id>-720.mp4 et .webm (web), <id>.jpg (affiche à FICHE.poster)
//          et <id>-bulle.png (vignette ronde de la rangée de bulles), 30 i/s par défaut
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
const isDir = id && id.includes('/');
const base = isDir ? path.basename(id) : id;
const name = scenario ? `${base}--${scenario}` : base;
if (!id) { console.error('Usage : node outils/rendu.js <id> stills [t…] | gif [fps]'); process.exit(1); }
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

(async () => {
  const page_url = 'file://' + (isDir ? path.join(ROOT, id, 'index.html') : path.join(ROOT, 'fiches', id, 'index.html')) + (scenario ? `?scenario=${scenario}` : '');
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(page_url);
  await page.evaluate(() => window.FICHE.ready);
  const { duration, W, H, poster, bulle } = await page.evaluate(() => ({ duration: window.FICHE.duration, W: window.FICHE.width || 1080, H: window.FICHE.height || 1350, poster: window.FICHE.poster ?? 0, bulle: window.FICHE.bulle || { x: 100, y: 560, s: 880 } }));
  await page.setViewportSize({ width: W, height: H });
  // Calque plein cadre quasi transparent : le basculer force Chromium à tout redessiner,
  // sinon l'anti-aliasing des zones redessinées partiellement varie d'une image à l'autre.
  await page.evaluate(() => {
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    Object.entries({ id: '__repaint', x: 0, y: 0, width: 4000, height: 4000, fill: '#000', 'fill-opacity': 0, 'pointer-events': 'none' })
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
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: W, height: H } });
  };

  if (mode === 'stills') {
    const times = rest.length ? rest.map(Number) : [0];
    fs.mkdirSync(path.join(ROOT, 'controle'), { recursive: true });
    for (const t of times) {
      const f = path.join(ROOT, 'controle', `${name}-t${t}.png`);
      await shot(t, f);
      console.log('→', path.relative(ROOT, f));
    }
  } else if (mode === 'story') {
    const fps = Number(rest[0] || 30);
    const n = Math.round(duration * fps);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
    for (let i = 0; i < n; i++) await shot(i / fps, path.join(tmp, `f${String(i).padStart(4, '0')}.png`));
    const out = path.join(ROOT, 'livrables', 'stories');
    fs.mkdirSync(out, { recursive: true });
    const seq = path.join(tmp, 'f%04d.png');
    const enc = (vf, crf, file) => execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', seq,
      ...(vf ? ['-vf', vf] : []), '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', String(crf),
      '-preset', 'slow', '-g', String(fps * 2), '-an', '-movflags', '+faststart', path.join(out, file)]);
    enc(null, 18, `${name}.mp4`);
    enc('scale=720:1280:flags=lanczos', 26, `${name}-720.mp4`);
    // WebM VP9 en plus : un peu plus léger, et lisible par les Chromium sans H.264
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', seq, '-vf', 'scale=720:1280:flags=lanczos',
      '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-an', path.join(out, `${name}-720.webm`)]);
    const posterFile = path.join(tmp, 'poster.png');
    await shot(poster, posterFile);
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', posterFile, '-vf', 'scale=720:1280:flags=lanczos', '-q:v', '3', path.join(out, `${name}.jpg`)]);
    // Vignette de bulle : carré FICHE.bulle de l'affiche (par défaut la zone du mécanisme, x 100 → 980, y 560 → 1440)
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', posterFile, '-vf', `crop=${bulle.s}:${bulle.s}:${bulle.x}:${bulle.y},scale=240:240:flags=lanczos`, path.join(out, `${name}-bulle.png`)]);
    fs.rmSync(tmp, { recursive: true, force: true });
    for (const f of [`${name}.mp4`, `${name}-720.mp4`, `${name}-720.webm`, `${name}.jpg`, `${name}-bulle.png`])
      console.log('→', path.relative(ROOT, path.join(out, f)), (fs.statSync(path.join(out, f)).size / 1e6).toFixed(2), 'Mo');
    console.log(`${n} images, ${fps} i/s, ${duration} s, affiche à ${poster} s`);
  } else if (mode === 'gif' || mode === 'mp4') {
    const fps = Number(rest[0] || 20);
    const n = Math.round(duration * fps);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
    for (let i = 0; i < n; i++) await shot(i / fps, path.join(tmp, `f${String(i).padStart(4, '0')}.png`));
    const out = path.join(ROOT, 'livrables');
    fs.mkdirSync(out, { recursive: true });
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
