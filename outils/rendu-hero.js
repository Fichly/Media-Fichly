// Rendu de la vidéo du hero de l'accueil : node outils/rendu-hero.js stills <16x9|4x5> [t…] | video <16x9|4x5> | all
// stills : PNG de contrôle dans controle/hero-<format>-t<t>.png
// video  : accueil-v2/media/fichly-hero-<format>-av1.mp4, fichly-hero-<format>.mp4 et les affiches .avif/.webp/.jpg
// Les images sont lues directement sur le canvas (pas de capture d'écran) : rendu exact et déterministe.
// Dépendances : playwright (Chromium) et ffmpeg (FFMPEG=… ou ffmpeg dans le PATH).
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const FPS = 30;
const POSTER_T = 5.6; // les trois têtes, leurs mots et « Suivis par +70 000 professionnels »
const OUT = path.join(ROOT, 'accueil-v2', 'media');
const [mode = 'stills', fmtArg = '16x9', ...rest] = process.argv.slice(2);

async function withPage(format, fn) {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const W = format === '4x5' ? 1080 : 1920, H = format === '4x5' ? 1350 : 1080;
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const errors = [];
  // la photo de Clément Boniol est facultative (médaillon « CB » en repli) : son absence n'est pas une erreur
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  page.on('requestfailed', r => { if (!/clement-boniol\.png$/.test(r.url())) errors.push('Ressource introuvable : ' + r.url()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('file://' + path.join(ROOT, 'accueil-v2', 'video', 'index.html') + '?format=' + format);
  await page.evaluate(() => window.HERO.ready);
  const frame = async t => {
    const url = await page.evaluate(t => { window.HERO.draw(t); return document.getElementById('stage').toDataURL('image/png'); }, t);
    return Buffer.from(url.split(',')[1], 'base64');
  };
  const info = await page.evaluate(() => ({ duration: window.HERO.duration, boniol: window.HERO.hasPhoto('boniol') }));
  await fn({ frame, info, W, H });
  const layoutErrors = await page.evaluate(() => window.HERO.errors());
  await browser.close();
  return [...errors, ...layoutErrors];
}

const size = f => (fs.statSync(f).size / 1e6).toFixed(2) + ' Mo';
const ff = args => execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args], { env: { ...process.env, SVT_LOG: '1' }, stdio: ['ignore', 'pipe', 'inherit'] });

async function stills(format, times) {
  fs.mkdirSync(path.join(ROOT, 'controle'), { recursive: true });
  return withPage(format, async ({ frame }) => {
    for (const t of times) {
      const f = path.join(ROOT, 'controle', `hero-${format}-t${t}.png`);
      fs.writeFileSync(f, await frame(t));
      console.log('→', path.relative(ROOT, f));
    }
  });
}

async function video(format) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `hero-${format}-`));
  let n = 0, boniol = false;
  const errors = await withPage(format, async ({ frame, info }) => {
    n = Math.round(info.duration * FPS);
    boniol = info.boniol;
    for (let i = 0; i < n; i++) fs.writeFileSync(path.join(tmp, `f${String(i).padStart(4, '0')}.png`), await frame(i / FPS));
    fs.writeFileSync(path.join(tmp, 'poster.png'), await frame(POSTER_T));
    // contrôle de la boucle : l'image à t = durée doit être celle de t = 0
    const a = await frame(0), b = await frame(info.duration);
    if (!a.equals(b)) console.error('✗ Boucle imparfaite : t = 0 et t = durée diffèrent');
  });
  fs.mkdirSync(OUT, { recursive: true });
  const seq = path.join(tmp, 'f%04d.png');
  const base = path.join(OUT, `fichly-hero-${format}`);
  // AV1 : très léger, lu par les navigateurs récents
  ff(['-framerate', String(FPS), '-i', seq, '-an', '-c:v', 'libsvtav1', '-preset', '6', '-crf', '40',
    '-g', '150', '-pix_fmt', 'yuv420p', '-svtav1-params', 'tune=0', '-movflags', '+faststart', `${base}-av1.mp4`]);
  // H.264 : repli universel (Safari sans décodeur AV1, anciens appareils)
  ff(['-framerate', String(FPS), '-i', seq, '-an', '-c:v', 'libx264', '-profile:v', 'high', '-level:v', '4.0', '-preset', 'slow',
    '-crf', format === '4x5' ? '27' : '27', '-tune', 'animation', '-g', '150', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${base}.mp4`]);
  const poster = path.join(tmp, 'poster.png');
  ff(['-i', poster, '-q:v', '3', `${base}-poster.jpg`]);
  ff(['-i', poster, '-c:v', 'libwebp', '-quality', '82', `${base}-poster.webp`]);
  ff(['-i', poster, '-c:v', 'libaom-av1', '-still-picture', '1', '-crf', '30', '-cpu-used', '4', '-pix_fmt', 'yuv420p', `${base}-poster.avif`]);
  fs.rmSync(tmp, { recursive: true, force: true });
  for (const ext of ['-av1.mp4', '.mp4', '-poster.avif', '-poster.webp', '-poster.jpg']) {
    const f = base + ext;
    const probe = ext.endsWith('mp4')
      ? execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name,profile,width,height,pix_fmt,r_frame_rate', '-of', 'csv=p=0', f]).toString().trim().replace(/\n/g, ' | ')
      : '';
    console.log('→', path.relative(ROOT, f), size(f), probe);
  }
  console.log(`${format} : ${n} images, ${FPS} i/s, photo de Clément Boniol ${boniol ? 'trouvée' : 'absente (médaillon CB)'}`);
  return errors;
}

(async () => {
  const formats = mode === 'all' ? ['16x9', '4x5'] : [fmtArg];
  let errors = [];
  for (const f of formats) {
    if (mode === 'stills') errors = errors.concat(await stills(f, rest.length ? rest.map(Number) : [0, 1.5, 4, 6.5, 9, 10.5, 13, 15, 16.5, 17.99]));
    else errors = errors.concat(await video(f));
  }
  if (errors.length) { [...new Set(errors)].forEach(e => console.error('✗', e)); process.exit(2); }
})();
