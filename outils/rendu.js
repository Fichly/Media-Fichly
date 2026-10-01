// Rendu d'une fiche : node outils/rendu.js <id> stills [t…] | gif [fps] | mp4 [fps] [--scenario nom]
// stills : PNG de contrôle dans controle/<id>-t<t>.png
// gif    : livrables/<id>.gif, .mp4 et .png (image t = 0), 250 images au plus (limite LinkedIn)
// mp4    : .mp4 et .png sans le GIF (pour un MP4 plus fluide que le GIF : gif puis mp4 25)
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
if (!id) { console.error('Usage : node outils/rendu.js <id> stills [t…] | gif [fps]'); process.exit(1); }
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

(async () => {
  const page_url = 'file://' + path.join(ROOT, 'fiches', id, 'index.html') + (scenario ? `?scenario=${scenario}` : '');
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(page_url);
  await page.evaluate(() => window.FICHE.ready);
  const { duration } = await page.evaluate(() => ({ duration: window.FICHE.duration }));
  // Calque plein cadre quasi transparent : le basculer force Chromium à tout redessiner,
  // sinon l'anti-aliasing des zones redessinées partiellement varie d'une image à l'autre.
  await page.evaluate(() => {
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    Object.entries({ id: '__repaint', x: 0, y: 0, width: 1080, height: 1350, fill: '#000', 'fill-opacity': 0, 'pointer-events': 'none' })
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
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  };

  if (mode === 'stills') {
    const times = rest.length ? rest.map(Number) : [0];
    fs.mkdirSync(path.join(ROOT, 'controle'), { recursive: true });
    for (const t of times) {
      const f = path.join(ROOT, 'controle', `${name}-t${t}.png`);
      await shot(t, f);
      console.log('→', path.relative(ROOT, f));
    }
  } else if (mode === 'gif' || mode === 'mp4') {
    // LinkedIn refuse les GIF de plus de 250 images : la cadence du GIF s'adapte, la durée ne change pas
    const GIF_MAX = 250;
    let fps = Number(rest[0] || 20);
    if (mode === 'gif' && Math.round(duration * fps) > GIF_MAX) {
      fps = GIF_MAX / duration;
      console.log(`GIF limité à ${GIF_MAX} images (LinkedIn) : ${fps.toFixed(2)} i/s`);
    }
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
