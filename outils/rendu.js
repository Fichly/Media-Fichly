// Rendu d'une fiche : node outils/rendu.js <id> <mode> [arguments] [--scenario nom]
//   livraison [60] [20]  MP4 60 i/s, GIF 20 i/s, affiche PNG (image 0) et planche, en une seule capture
//   controle             images clés dans controle/, couture de la boucle, plus petit texte
//   planche              storyboard livrables/<id>--planche.jpg : l'image clé de chaque temps fort
//   stills [t…]          PNG de contrôle dans controle/<id>-t<t>.png
//   gif [fps]            livrables/<id>.gif, .mp4 et .png à la même cadence (20 i/s par défaut)
//   mp4 [fps]            sans le GIF (mouvements de caméra trop lourds en GIF)
// Dépendances : playwright (Chromium) et ffmpeg (FFMPEG=… ou ffmpeg dans le PATH).
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');
const { execFileSync, spawnSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const si = argv.indexOf('--scenario');
const scenario = si >= 0 ? argv.splice(si, 2)[1] : null;
const [id, mode = 'stills', ...rest] = argv;
const name = scenario ? `${id}--${scenario}` : id;
const MODES = ['livraison', 'controle', 'planche', 'stills', 'gif', 'mp4'];
if (!id || !MODES.includes(mode)) {
  console.error('Usage : node outils/rendu.js <id> livraison | controle | planche | stills [t…] | gif [fps] | mp4 [fps] [--scenario nom]');
  process.exit(1);
}
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const OUT = path.join(ROOT, 'livrables');
const CTRL = path.join(ROOT, 'controle');
const GIF_MAX = 8e6;     // poids maximal d'un GIF dans le fil
const MIN_TEXT = 21;     // plus petit corps de la charte (sous-titres), en px sur 1080
const SEAM_MIN = 0.995;  // SSIM minimal entre la dernière image et la première
const fmt = s => s.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
const pad = i => String(i).padStart(4, '0');
const size = f => `${(fs.statSync(f).size / 1e6).toFixed(2)} Mo`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const problems = [];

(async () => {
  const qs = new URLSearchParams({ rendu: 1 });
  if (scenario) qs.set('scenario', scenario);
  const page_url = 'file://' + path.join(ROOT, 'fiches', id, 'index.html') + '?' + qs;
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(page_url);
  await page.evaluate(() => window.FICHE.ready);
  const { duration, beats, fps, title } = await page.evaluate(() => ({
    duration: FICHE.duration, beats: FICHE.beats, fps: FICHE.fps, title: document.title,
  }));
  const lastFrame = (Math.round(duration * fps) - 1) / fps;
  // Calque plein cadre quasi transparent : le basculer force Chromium à tout redessiner,
  // sinon l'anti-aliasing des zones redessinées partiellement varie d'une image à l'autre.
  await page.evaluate(() => {
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    Object.entries({ id: '__repaint', x: 0, y: 0, width: 1080, height: 1350, fill: '#000', 'fill-opacity': 0, 'pointer-events': 'none' })
      .forEach(([k, v]) => r.setAttribute(k, v));
    document.getElementById('stage').appendChild(r);
  });
  let flip = false;
  const clip = { x: 0, y: 0, width: 1080, height: 1350 };
  const cdp = await page.context().newCDPSession(page);
  // fast : PNG peu compressé, mêmes pixels, environ quatre fois plus rapide (images intermédiaires)
  const shot = async (t, file, { fast = false } = {}) => {
    flip = !flip;
    await page.evaluate(([t, flip]) => {
      document.getElementById('__repaint').setAttribute('fill-opacity', flip ? 0.001 : 0);
      window.FICHE.draw(t);
    }, [t, flip]);
    if (!fast) return page.screenshot({ path: file, clip });
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 }, optimizeForSpeed: true });
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
  };

  // Toute la fiche à `rate` images par seconde, dans un dossier temporaire
  async function capture(rate) {
    const n = Math.round(duration * rate);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
    for (let i = 0; i < n; i++) await shot(i / rate, path.join(dir, `f${pad(i)}.png`), { fast: true });
    return { dir, n };
  }
  const encodeMp4 = (dir, rate, file) => execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(rate), '-i', path.join(dir, 'f%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', file]);
  const encodeGif = (dir, rate, file) => execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(rate), '-i', path.join(dir, 'f%04d.png'),
    '-vf', 'split[a][b];[a]palettegen=max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=none',
    '-loop', '0', file]);
  const checkGif = file => { if (fs.statSync(file).size > GIF_MAX) problems.push(`GIF trop lourd : ${size(file)} (8 Mo maximum)`); };

  // Planche : l'image clé de chaque temps fort, numérotée comme dans le lecteur (touches 1 à 9)
  async function planche() {
    const list = beats.length ? beats : [0, 1, 2, 3, 4, 5].map(k => {
      const t = Math.round((k * duration / 6) * fps) / fps;
      return { t, end: t + duration / 6, label: 'Aucun temps fort déclaré', frame: t };
    });
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-planche-`));
    for (const [i, b] of list.entries()) await shot(b.frame, path.join(dir, `b${i}.png`));
    const cols = list.length <= 4 ? list.length : list.length <= 6 ? 3 : 4;
    const CELL = 360, GAP = 28, PAD = 40;
    const font = w => `@font-face { font-family: Poppins; font-weight: ${w}; src: url(${pathToFileURL(path.join(ROOT, 'assets', 'fonts', `poppins-latin-${w}-normal.woff2`))}) format('woff2'); }`;
    const cells = list.map((b, i) => `
      <figure><img src="b${i}.png" alt="">
        <figcaption><b>${i + 1} · ${fmt(b.t)} → ${fmt(b.end)} s · image clé ${fmt(b.frame)} s</b>${esc(b.label)}</figcaption></figure>`).join('');
    fs.writeFileSync(path.join(dir, 'planche.html'), `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
      ${font(500)} ${font(700)}
      body { margin: 0; padding: ${PAD}px; background: #f3f3f3; color: #23235a; font-family: Poppins; }
      h1 { margin: 0; font-size: 30px; font-weight: 700; color: #4a4aa0; }
      p { margin: 2px 0 28px; font-size: 18px; font-weight: 500; }
      .grille { display: grid; grid-template-columns: repeat(${cols}, ${CELL}px); gap: ${GAP}px; }
      figure { margin: 0; }
      img { display: block; width: ${CELL}px; height: ${CELL * 1.25}px; border-radius: 10px; box-shadow: 0 0 0 1px #e2e2ee; }
      figcaption { margin-top: 10px; font-size: 18px; font-weight: 700; line-height: 1.3; }
      figcaption b { display: block; font-size: 14px; font-weight: 500; color: #4a4aa0; }
    </style></head><body>
      <h1>${esc(title)}</h1>
      <p>${esc(name)} · ${fmt(duration)} s en boucle · ${list.length} temps</p>
      <div class="grille">${cells}</div>
    </body></html>`);
    const p = await browser.newPage({ viewport: { width: PAD * 2 + cols * CELL + (cols - 1) * GAP, height: 600 }, deviceScaleFactor: 1 });
    await p.goto(pathToFileURL(path.join(dir, 'planche.html')).href);
    await p.evaluate(() => Promise.all([500, 700].map(w => document.fonts.load(`${w} 18px Poppins`))));
    fs.mkdirSync(OUT, { recursive: true });
    const file = path.join(OUT, `${name}--planche.jpg`);
    await p.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 88 });
    await p.close();
    fs.rmSync(dir, { recursive: true, force: true });
    return file;
  }

  if (mode === 'stills') {
    const times = rest.length ? rest.map(Number) : [0];
    fs.mkdirSync(CTRL, { recursive: true });
    for (const t of times) {
      const f = path.join(CTRL, `${name}-t${t}.png`);
      await shot(t, f);
      console.log('→', path.relative(ROOT, f));
    }
  } else if (mode === 'controle') {
    fs.mkdirSync(CTRL, { recursive: true });
    const still = async t => {
      const f = path.join(CTRL, `${name}-t${+t.toFixed(2)}.png`);
      await shot(t, f);
      return f;
    };
    const first = await still(0), last = await still(lastFrame);
    const listed = new Set();
    for (const [i, b] of beats.entries()) {
      const f = await still(b.frame);
      listed.add(f);
      console.log(`→ ${path.relative(ROOT, f)}  temps ${i + 1} · ${b.label}`);
    }
    if (!listed.has(first)) console.log(`→ ${path.relative(ROOT, first)}  première image (affiche)`);
    if (!listed.has(last)) console.log(`→ ${path.relative(ROOT, last)}  dernière image`);
    if (!beats.length) problems.push('Aucun temps fort déclaré (G.start({ beats })) : pas de planche ni de repères dans le lecteur');

    // Couture de la boucle : la dernière image doit enchaîner sur la première sans saut
    const r = spawnSync(FFMPEG, ['-i', last, '-i', first, '-lavfi', 'ssim', '-f', 'null', '-'], { encoding: 'utf8' });
    const ssim = Number((r.stderr.match(/All:([\d.]+)/) || [])[1]);
    console.log(`Boucle : SSIM ${ssim.toFixed(4)} entre la dernière image et la première`);
    if (!(ssim >= SEAM_MIN)) problems.push(`Saut à la boucle : SSIM ${ssim.toFixed(4)} (minimum ${SEAM_MIN})`);

    // Lisibilité : plus petits corps de texte
    const texts = await page.evaluate(() => [...document.querySelectorAll('#stage text')]
      .map(n => ({ size: Number(n.getAttribute('font-size')), str: n.textContent })));
    texts.sort((a, b) => a.size - b.size);
    if (texts.length) console.log(`Plus petit texte : ${texts[0].size} px (« ${texts[0].str} »)`);
    texts.filter(x => x.size < MIN_TEXT).forEach(x => problems.push(`Texte trop petit : ${x.size} px (« ${x.str} »), minimum ${MIN_TEXT} px`));
  } else if (mode === 'planche') {
    const f = await planche();
    console.log('→', path.relative(ROOT, f), size(f));
  } else if (mode === 'livraison') {
    const [video = 60, anim = 20] = rest.map(Number);
    if (video % anim) { console.error(`La cadence du GIF (${anim}) doit diviser celle du MP4 (${video})`); process.exit(1); }
    const { dir, n } = await capture(video);
    // GIF : une image sur k, aux mêmes instants qu'un rendu « gif » à cette cadence
    const k = video / anim, gdir = path.join(dir, 'gif');
    fs.mkdirSync(gdir);
    for (let i = 0; i < n; i += k) fs.linkSync(path.join(dir, `f${pad(i)}.png`), path.join(gdir, `f${pad(i / k)}.png`));
    fs.mkdirSync(OUT, { recursive: true });
    const out = ext => path.join(OUT, `${name}.${ext}`);
    await shot(0, out('png'));
    encodeMp4(dir, video, out('mp4'));
    encodeGif(gdir, anim, out('gif'));
    fs.rmSync(dir, { recursive: true, force: true });
    checkGif(out('gif'));
    const board = await planche();
    console.log('→', path.relative(ROOT, out('mp4')), size(out('mp4')), `· ${n} images à ${video} i/s`);
    console.log('→', path.relative(ROOT, out('gif')), size(out('gif')), `· ${Math.ceil(n / k)} images à ${anim} i/s`);
    console.log('→', path.relative(ROOT, out('png')), size(out('png')), '· affiche (image 0)');
    console.log('→', path.relative(ROOT, board), size(board), `· planche (${beats.length || 6} temps)`);
    console.log(`${fmt(duration)} s en boucle`);
  } else if (mode === 'gif' || mode === 'mp4') {
    const rate = Number(rest[0] || 20);
    const { dir, n } = await capture(rate);
    fs.mkdirSync(OUT, { recursive: true });
    const out = ext => path.join(OUT, `${name}.${ext}`);
    await shot(0, out('png'));
    encodeMp4(dir, rate, out('mp4'));
    if (mode === 'gif') { encodeGif(dir, rate, out('gif')); checkGif(out('gif')); }
    fs.rmSync(dir, { recursive: true, force: true });
    for (const ext of mode === 'gif' ? ['gif', 'mp4', 'png'] : ['mp4', 'png']) console.log('→', path.relative(ROOT, out(ext)), size(out(ext)));
    console.log(`${n} images, ${rate} i/s, ${duration} s`);
  }
  await browser.close();
  const all = [...errors, ...problems];
  if (all.length) { all.forEach(e => console.error('✗', e)); process.exit(2); }
})();
