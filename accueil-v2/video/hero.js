// Vidéo du hero de l'accueil Fichly : canvas 2D, rendu déterministe image par image.
// ?format=16x9 (1920 × 1080) ou ?format=4x5 (1080 × 1350).
// window.HERO = { ready, duration, width, height, format, draw(t) } ; draw(t) ne dépend que de t.
// Contrôles : chaque texte et chaque médaillon visibles sont mesurés ; un débordement des marges
// ou un chevauchement provoque un console.error (repris par outils/rendu-hero.js).
(() => {
  const FORMAT = new URLSearchParams(location.search).get('format') === '4x5' ? '4x5' : '16x9';
  const W = FORMAT === '4x5' ? 1080 : 1920;
  const H = FORMAT === '4x5' ? 1350 : 1080;
  const D = 18;
  const ASSETS = '../../assets/';
  const FONT = 'Montserrat';

  const C = {
    indigo: '#3c4499', indigo100: '#e4e5f3', indigo050: '#f3f4fb',
    ink: '#2c2c2c', ink700: '#4a4a4a', ink500: '#6b6b6b', line: '#e5e5e5', white: '#ffffff',
    night: '#151b43', night2: '#1f2757', nightLine: '#323a6e', onNight2: '#c9cce6',
    blue: '#74a3d6', green: '#8cc978', yellow: '#e6b839', purple: '#aa76b2', teal: '#75bec0',
    coral: '#f16969', lime: '#e0cf35', rust: '#b35a23',
    blue100: '#e3ecf6', green100: '#e8f4e3', yellow100: '#faf0d7', purple100: '#f0e5f2',
    teal100: '#e3f2f2', coral100: '#fce5e5', lime100: '#f8f5d7',
  };
  const RIBBON = [C.indigo, C.green, C.coral, C.yellow, C.blue, C.rust];

  const canvas = document.getElementById('stage');
  canvas.width = W; canvas.height = H;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');

  // ---------- Images ----------
  const IMG = {};
  function load(key, src) {
    return new Promise(res => {
      const im = new Image();
      im.onload = () => { IMG[key] = im; res(); };
      im.onerror = () => { IMG[key] = null; res(); };
      im.src = src;
    }).then(() => IMG[key] && IMG[key].decode ? IMG[key].decode().catch(() => {}) : null);
  }

  const PEOPLE = [
    { key: 'hugo', first: 'Hugo', last: 'Duc', role: 'Co-Fondateur', words: '«\u00a0Créer, tester, transmettre\u00a0»', ring: C.indigo, initials: 'HD' },
    { key: 'boniol', first: 'Clément', last: 'Boniol', role: 'Co-Fondateur', words: '«\u00a0La complexité en clarté\u00a0»', ring: C.yellow, initials: 'CB' },
    { key: 'raymond', first: 'Clément', last: 'Raymond', role: 'Associé', words: '«\u00a0Envie de faire, envie de progresser\u00a0»', ring: C.green, initials: 'CR' },
  ];

  // ---------- Temps et easing ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const lerp = (a, b, p) => a + (b - a) * p;
  // Entrée (s, d) puis sortie (s2, d2) : renvoie l'opacité et la progression d'entrée
  function life(t, s, d, s2, d2) {
    const pin = easeOut(prog(t, s, d));
    const pout = s2 == null ? 0 : easeInOut(prog(t, s2, d2));
    return { a: pin * (1 - pout), pin, pout };
  }

  // ---------- Mesures et contrôles ----------
  const SAFE = Math.round(Math.min(W, H) * 0.05);
  let boxes = [];
  const errors = new Set();
  function record(label, x, y, w, h, group) { boxes.push({ label, x, y, w, h, group }); }
  function checkFrame(t) {
    for (const b of boxes) {
      if (b.x < SAFE - 0.5 || b.y < SAFE - 0.5 || b.x + b.w > W - SAFE + 0.5 || b.y + b.h > H - SAFE + 0.5)
        errors.add(`Hors marges (${FORMAT}, t=${t.toFixed(2)}) : ${b.label}`);
    }
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (a.group !== b.group) continue;
      if (a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1)
        errors.add(`Chevauchement (${FORMAT}, t=${t.toFixed(2)}) : ${a.label} / ${b.label}`);
    }
  }

  // ---------- Primitives ----------
  function font(size, weight = 600, italic = false) { return `${italic ? 'italic ' : ''}${weight} ${size}px ${FONT}`; }
  // Texte : align 'left' | 'center' | 'right' ; y = ligne de base
  function text(str, x, y, { size = 40, weight = 600, italic = false, color = C.ink, align = 'left', alpha = 1, spacing = 0, group = 'g', label } = {}) {
    if (alpha <= 0.001) return 0;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = font(size, weight, italic);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    if (spacing) ctx.letterSpacing = spacing + 'px';
    ctx.fillText(str, x, y);
    const m = ctx.measureText(str);
    ctx.restore();
    const w = m.width;
    const left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    if (alpha > 0.5) record(label || str, left, y - size * 0.8, w, size * 1.05, group);
    return w;
  }
  function measure(str, size, weight = 600, italic = false) {
    ctx.save(); ctx.font = font(size, weight, italic); const w = ctx.measureText(str).width; ctx.restore(); return w;
  }
  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }
  function fillRR(x, y, w, h, r, color, alpha = 1) {
    ctx.save(); ctx.globalAlpha *= alpha; rrect(x, y, w, h, r); ctx.fillStyle = color; ctx.fill(); ctx.restore();
  }
  function shadowRR(x, y, w, h, r, color, alpha = 1) {
    ctx.save(); ctx.globalAlpha *= alpha;
    ctx.shadowColor = 'rgba(44,44,44,0.12)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
    rrect(x, y, w, h, r); ctx.fillStyle = color; ctx.fill(); ctx.restore();
  }
  function ribbon(x, y, w, h, alpha = 1) {
    const seg = w / RIBBON.length;
    ctx.save(); ctx.globalAlpha *= alpha;
    RIBBON.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x + i * seg), y, Math.ceil(seg), h); });
    ctx.restore();
  }
  function logo(cx, cy, h, alpha = 1, group = 'g') {
    const im = IMG.logo; if (!im || alpha <= 0.001) return;
    const w = h * im.naturalWidth / im.naturalHeight;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(im, cx - w / 2, cy - h / 2, w, h); ctx.restore();
    if (alpha > 0.5) record('logo', cx - w / 2, cy - h / 2, w, h, group);
  }
  // Médaillon : photo ronde (ou initiales) et anneau de couleur
  function medallion(p, cx, cy, r, { alpha = 1, scale = 1, ring = p.ring, ringW = Math.max(5, r * 0.08), bg = C.white, group = 'g' } = {}) {
    if (alpha <= 0.001) return;
    const rr = r * scale;
    ctx.save(); ctx.globalAlpha *= alpha;
    ctx.beginPath(); ctx.arc(cx, cy, rr + ringW, 0, Math.PI * 2); ctx.fillStyle = ring; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, rr + ringW * 0.25, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.clip();
    const im = IMG[p.key];
    if (im) {
      ctx.fillStyle = C.indigo050; ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(im, cx - rr, cy - rr, rr * 2, rr * 2);
    } else {
      ctx.fillStyle = C.indigo; ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      ctx.font = font(Math.round(rr * 0.72), 700); ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(p.initials, cx, cy + rr * 0.04);
    }
    ctx.restore(); ctx.restore();
    if (alpha > 0.5) record('médaillon ' + p.last, cx - rr - ringW, cy - rr - ringW, (rr + ringW) * 2, (rr + ringW) * 2, group);
  }
  // Boîte de fiches vue de face : haut coloré, titre, nombre de fiches
  function deck(x, y, w, h, color, title, sub, alpha = 1, rot = 0) {
    if (alpha <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= alpha;
    ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.translate(-w / 2, -h / 2);
    shadowRR(0, 0, w, h, 16, C.white);
    ctx.save(); rrect(0, 0, w, h, 16); ctx.clip();
    ctx.fillStyle = color; ctx.fillRect(0, 0, w, h * 0.42);
    ctx.restore();
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; rrect(0, 0, w, h, 16); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.font = font(Math.round(w * 0.105), 700); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    const pad = w * 0.09;
    const lines = title.split('\n');
    lines.forEach((l, i) => ctx.fillText(l, pad, h * 0.42 + pad + w * 0.1 + i * w * 0.125));
    ctx.fillStyle = C.ink500; ctx.font = font(Math.round(w * 0.085), 500);
    ctx.fillText(sub, pad, h - pad);
    ctx.restore();
  }
  // Fiche qui se retourne : recto (comprendre) puis verso (mettre en place)
  function flipCard(cx, cy, w, h, p, alpha) {
    if (alpha <= 0.001) return;
    const sx = Math.max(0.02, Math.abs(Math.cos(Math.PI * p)));
    const verso = p >= 0.5;
    ctx.save(); ctx.globalAlpha *= alpha;
    ctx.translate(cx, cy); ctx.scale(sx, 1); ctx.translate(-w / 2, -h / 2);
    shadowRR(0, 0, w, h, 18, C.white);
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; rrect(0, 0, w, h, 18); ctx.stroke();
    const pad = w * 0.08;
    if (!verso) {
      ctx.save(); rrect(0, 0, w, h, 18); ctx.clip(); ctx.fillStyle = C.blue; ctx.fillRect(0, 0, w, h * 0.2); ctx.restore();
      ctx.fillStyle = C.ink; ctx.font = font(Math.round(w * 0.075), 700); ctx.textAlign = 'left';
      ctx.fillText('5S', pad, h * 0.13);
      // schéma : cinq pastilles reliées
      const cols = [C.coral, C.yellow, C.lime, C.green, C.blue];
      const y0 = h * 0.38;
      ctx.strokeStyle = C.indigo100; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(pad + w * 0.06, y0); ctx.lineTo(w - pad - w * 0.06, y0); ctx.stroke();
      cols.forEach((c, i) => {
        const x = pad + w * 0.06 + i * (w - 2 * pad - w * 0.12) / 4;
        ctx.beginPath(); ctx.arc(x, y0, w * 0.055, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill();
      });
      // lignes de texte simulées
      ctx.fillStyle = C.line;
      [0.54, 0.61, 0.68].forEach((yy, i) => fillRR(pad, h * yy, (w - 2 * pad) * (i === 2 ? 0.6 : 1), h * 0.028, 6, C.line));
      fillRR(pad, h * 0.78, w - 2 * pad, h * 0.13, 12, C.blue100);
      fillRR(pad + w * 0.05, h * 0.825, (w - 2 * pad) * 0.6, h * 0.028, 6, C.blue);
    } else {
      ctx.save(); rrect(0, 0, w, h, 18); ctx.clip(); ctx.fillStyle = C.indigo; ctx.fillRect(0, 0, w, h * 0.2); ctx.restore();
      [0.33, 0.47, 0.61, 0.75].forEach((yy, i) => {
        ctx.beginPath(); ctx.arc(pad + w * 0.045, h * yy, w * 0.045, 0, Math.PI * 2); ctx.fillStyle = C.green; ctx.fill();
        ctx.strokeStyle = C.white; ctx.lineWidth = w * 0.012; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const k = w * 0.0016, x0 = pad + w * 0.045, y1 = h * yy;
        ctx.beginPath(); ctx.moveTo(x0 - 10 * k, y1 + 1 * k); ctx.lineTo(x0 - 3 * k, y1 + 8 * k); ctx.lineTo(x0 + 11 * k, y1 - 7 * k); ctx.stroke();
        fillRR(pad + w * 0.13, h * yy - h * 0.014, (w - 2 * pad - w * 0.13) * (i % 2 ? 0.7 : 0.95), h * 0.028, 6, C.line);
      });
      fillRR(pad, h * 0.85, w - 2 * pad, h * 0.07, 10, C.indigo050);
    }
    ctx.restore();
  }
  // Ceinture : bande arrondie et nœud
  function belt(x, y, w, h, color, alpha = 1, outline = null) {
    if (alpha <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= alpha;
    fillRR(x, y, w, h, h / 2, color);
    if (outline) { ctx.strokeStyle = outline; ctx.lineWidth = 2; rrect(x, y, w, h, h / 2); ctx.stroke(); }
    const kx = x + w * 0.66;
    fillRR(kx - h * 0.55, y - h * 0.45, h * 1.1, h * 1.9, h * 0.25, color);
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(kx - h * 0.55, y + h * 0.35, h * 1.1, h * 0.12);
    if (outline) { ctx.strokeStyle = outline; rrect(kx - h * 0.55, y - h * 0.45, h * 1.1, h * 1.9, h * 0.25); ctx.stroke(); }
    ctx.restore();
  }
  // Petite pastille ronde (le point indigo de la marque)
  function dot(x, y, r, color, alpha = 1) {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
  }

  // ---------- Texte sur plusieurs lignes ----------
  // line = [[texte, { italic, color, weight }], …] ; renvoie la largeur
  function richLine(line, x, y, size, { align = 'left', alpha = 1, group = 'g', weight = 600, color = C.ink } = {}) {
    const parts = line.map(([str, st = {}]) => ({ str, st, w: measure(str, size, st.weight || weight, !!st.italic) }));
    const total = parts.reduce((s, p) => s + p.w, 0);
    let cx = align === 'center' ? x - total / 2 : x;
    for (const p of parts) {
      text(p.str, cx, y, { size, weight: p.st.weight || weight, italic: !!p.st.italic, color: p.st.color || color, alpha, group });
      cx += p.w;
    }
    return total;
  }
  // Coupe une phrase en lignes de largeur maximale maxW
  function wrap(str, size, maxW, weight = 600, italic = false) {
    const words = str.split(' ');
    const out = []; let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (measure(t, size, weight, italic) > maxW && cur) { out.push(cur); cur = w; } else cur = t;
    }
    if (cur) out.push(cur);
    return out;
  }
  // Ligne d'éléments séparés par le point de la marque
  function dotted(items, x, y, size, { color = C.ink700, dotColor = C.indigo, alpha = 1, group = 'g' } = {}) {
    let cx = x;
    items.forEach((it, i) => {
      const w = text(it, cx, y, { size, weight: 500, color, alpha, group }) || measure(it, size, 500);
      cx += w;
      if (i < items.length - 1) { dot(cx + size * 0.55, y - size * 0.33, size * 0.16, dotColor, alpha); cx += size * 1.1; }
    });
  }

  // ---------- Mises en page ----------
  // La vidéo est affichée à 550-700 px de large sur ordinateur et ~360 px sur mobile :
  // aucun texte sous 38 px dans le cadre (≈ 13 px à l'écran).
  const L16 = {
    logo: { h: 170, y: 440, tagY: 625, tag: 80, ribbonW: 460 },
    heads: { eyebrowY: 160, eyebrow: 40, r: 100, cy: 380, xs: [370, 960, 1550], nameDy: 175, name: 54, roleDy: 232, role: 42, wordsDy: 300, words: 40, wordsLh: 50, wordsW: 540, followY: 960, follow: 54 },
    left: { x: 110, pillY: 210, titleY: 340, title: 76, titleLh: 90, subY: 660, sub: 44, subLh: 58, personY: 900, personR: 72, name: 46, role: 40 },
    fiches: {
      title: [[['Des fiches']], [['pour agir, seul,']], [['dès demain.', { italic: true, color: C.indigo }]]],
      sub: [['Un outil = une fiche'], ['Imprimées en France']],
      decks: [
        { x: 1010, y: 190, w: 220, h: 280, rot: -0.07, c: C.green, t: '40 outils\nde la QSE', s: '40 fiches' },
        { x: 1030, y: 510, w: 220, h: 280, rot: -0.03, c: C.yellow, t: '40 outils de la\nGestion\nde projet', s: '40 fiches' },
        { x: 1620, y: 190, w: 220, h: 280, rot: 0.07, c: C.purple, t: '40 outils\ndes Achats', s: '40 fiches' },
        { x: 1600, y: 510, w: 220, h: 280, rot: 0.03, c: C.teal, t: 'Le guide\nde la VSM', s: '20 fiches' },
      ],
      card: { cx: 1430, cy: 450, w: 330, h: 450 }, labelY: 880, label: 50,
    },
    formations: {
      title: [[['Des formations']], [['pour être', { color: C.white }], [' accompagné', { italic: true, color: C.green }]], [['et certifié.', { italic: true, color: C.green }]]],
      sub: [['80 % de pratique', 'Qualiopi'], ['Green Belt éligible CPF']],
      steps: { x0: 1080, w: 172, gap: 24, base: 940, heights: [170, 290, 410, 530], label: 40 },
    },
    end: { y: 330, r: 92, gap: 280, titleY: 640, title: 104, titleLh: 0, subY: 770, sub: 52 },
  };
  const L45 = {
    logo: { h: 150, y: 560, tagY: 735, tag: 76, ribbonW: 420 },
    heads: { eyebrowY: 150, eyebrow: 40, r: 92, cx: 160 + 92, ys: [340, 660, 980], textX: 400, name: 54, role: 40, words: 40, wordsLh: 48, wordsW: 620, followY: 1250, follow: 44 },
    left: { x: 70, pillY: 130, titleY: 260, title: 80, titleLh: 90, subY: 570, sub: 44, subLh: 56, personY: 1210, personR: 60, name: 44, role: 38 },
    fiches: {
      title: [[['Des fiches']], [['pour agir, seul,']], [['dès demain.', { italic: true, color: C.indigo }]]],
      sub: [['Un outil = une fiche'], ['Imprimées en France']],
      decks: [
        { x: 54, y: 700, w: 190, h: 244, rot: -0.08, c: C.green, t: '40 outils\nde la QSE', s: '40 fiches' },
        { x: 836, y: 700, w: 190, h: 244, rot: 0.08, c: C.purple, t: '40 outils\ndes Achats', s: '40 fiches' },
      ],
      card: { cx: 540, cy: 870, w: 300, h: 400 }, labelY: 1130, label: 46,
    },
    formations: {
      titleSize: 72, titleLh: 84,
      title: [[['Des formations']], [['pour être', { color: C.white }], [' accompagné', { italic: true, color: C.green }]], [['et certifié.', { italic: true, color: C.green }]]],
      sub: [['80 % de pratique', 'Qualiopi'], ['Green Belt éligible CPF']],
      steps: { x0: 80, w: 215, gap: 24, base: 1130, heights: [150, 250, 350, 450], label: 40 },
    },
    end: { y: 430, r: 96, gap: 270, titleY: 700, title: 100, titleLh: 106, subY: 930, sub: 46 },
  };
  const Lt = FORMAT === '4x5' ? L45 : L16;

  // ---------- Scènes ----------
  // Ouverture et fermeture : l'image à t = 0 et à t = D est la même (boucle parfaite)
  function sceneLogo(t) {
    let a;
    if (t < 2.3) a = 1;
    else if (t < 2.9) a = 1 - easeInOut(prog(t, 2.3, 0.6));
    else if (t < 17.1) a = 0;
    else a = easeInOut(prog(t, 17.1, 0.7));
    if (a <= 0.001) return;
    const L = Lt.logo;
    const lift = t < 10 ? -30 * (1 - a) : 30 * (1 - a);
    ctx.save(); ctx.translate(0, lift);
    logo(W / 2, L.y, L.h, a, 'logo');
    text('Le Lean accessible.', W / 2, L.tagY, { size: L.tag, weight: 600, align: 'center', alpha: a, group: 'logo' });
    ribbon(W / 2 - L.ribbonW / 2, L.tagY + 56, L.ribbonW, 14, a);
    ctx.restore();
  }

  function sceneHeads(t) {
    if (t < 2.6 || t > 7.2) return;
    const out = [6.6, 0.5];
    const H_ = Lt.heads;
    const g = 'heads';
    const e = life(t, 2.7, 0.5, ...out);
    const is45 = FORMAT === '4x5';
    text('DERRIÈRE FICHLY', is45 ? H_.cx - H_.r : W / 2, H_.eyebrowY, { size: H_.eyebrow, weight: 700, color: C.indigo, align: is45 ? 'left' : 'center', spacing: 5, alpha: e.a, group: g });
    PEOPLE.forEach((p, i) => {
      const s = 2.9 + i * 0.3;
      const m = life(t, s, 0.55, ...out);
      const ty = life(t, s + 0.2, 0.5, ...out);
      const tw = life(t, s + 0.45, 0.5, ...out);
      const dy = 24 * (1 - ty.pin) - 20 * m.pout;
      const words = wrap(p.words, H_.words, H_.wordsW, 600, true);
      if (is45) {
        const cy = H_.ys[i];
        medallion(p, H_.cx, cy - 20 * m.pout, H_.r, { alpha: m.a, scale: lerp(0.82, 1, m.pin), group: g });
        const x = H_.textX;
        const top = cy - 40 - (words.length - 1) * H_.wordsLh / 2;
        text(`${p.first} ${p.last}`, x, top + dy, { size: H_.name, weight: 700, alpha: ty.a, group: g });
        text(p.role, x, top + 52 + dy, { size: H_.role, weight: 500, color: C.ink500, alpha: ty.a, group: g });
        words.forEach((w, k) => text(w, x, top + 112 + k * H_.wordsLh + dy, { size: H_.words, weight: 600, italic: true, color: C.indigo, alpha: tw.a, group: g }));
      } else {
        const cx = H_.xs[i];
        medallion(p, cx, H_.cy - 20 * m.pout, H_.r, { alpha: m.a, scale: lerp(0.82, 1, m.pin), group: g });
        text(`${p.first} ${p.last}`, cx, H_.cy + H_.nameDy + dy, { size: H_.name, weight: 700, align: 'center', alpha: ty.a, group: g });
        text(p.role, cx, H_.cy + H_.roleDy + dy, { size: H_.role, weight: 500, color: C.ink500, align: 'center', alpha: ty.a, group: g });
        words.forEach((w, k) => text(w, cx, H_.cy + H_.wordsDy + k * H_.wordsLh + dy, { size: H_.words, weight: 600, italic: true, color: C.indigo, align: 'center', alpha: tw.a, group: g }));
      }
    });
    const f = life(t, 4.7, 0.5, ...out);
    const label = 'Suivis par +70 000 professionnels';
    const fw = measure(label, H_.follow, 600) + H_.follow * 0.7;
    const fx = W / 2 - fw / 2;
    const fy = H_.followY + 14 * (1 - f.pin);
    dot(fx + H_.follow * 0.18, fy - H_.follow * 0.33, H_.follow * 0.17, C.indigo, f.a);
    text(label, fx + H_.follow * 0.7, fy, { size: H_.follow, weight: 600, alpha: f.a, group: g });
  }

  function pill(label, x, y, size, bg, fg, alpha, group) {
    if (alpha <= 0.001) return;
    const padX = size * 0.8, h = size * 1.8, sp = size * 0.12;
    const w = measure(label, size, 700) + label.length * sp + padX * 2;
    fillRR(x, y - h / 2, w, h, h / 2, bg, alpha);
    text(label, x + padX, y + size * 0.36, { size, weight: 700, color: fg, spacing: sp, alpha, group });
  }

  // Bloc de gauche commun aux scènes fiches et formations
  function leftBlock(S, kicker, pillBg, pillFg, person, t0, alpha, onNight, g) {
    const L = Lt.left;
    pill(kicker, L.x, L.pillY, 38, pillBg, pillFg, life(t, t0, 0.45).a * alpha, g);
    S.title.forEach((line, i) => {
      const k = life(t, t0 + 0.12 + i * 0.12, 0.55);
      richLine(line, L.x, L.titleY + i * (S.titleLh || L.titleLh) + 20 * (1 - k.pin), S.titleSize || L.title, { alpha: k.a * alpha, group: g, color: onNight ? C.white : C.ink });
    });
    const s = life(t, t0 + 0.6, 0.5);
    S.sub.forEach((items, i) => dotted(items, L.x, L.subY + i * L.subLh, L.sub,
      { color: onNight ? C.onNight2 : C.ink700, dotColor: onNight ? C.green : C.indigo, alpha: s.a * alpha, group: g }));
    const pp = life(t, t0 + 1.0, 0.5);
    const r = L.personR;
    medallion(person, L.x + r + 8, L.personY, r, { alpha: pp.a * alpha, group: g, bg: onNight ? C.night : C.white });
    text(`${person.first} ${person.last}`, L.x + 2 * r + 46, L.personY - 6, { size: L.name, weight: 700, color: onNight ? C.white : C.ink, alpha: pp.a * alpha, group: g });
    text(person.role, L.x + 2 * r + 46, L.personY + L.role + 6, { size: L.role, weight: 500, color: onNight ? C.onNight2 : C.ink500, alpha: pp.a * alpha, group: g });
  }
  let t = 0; // instant courant, partagé par les helpers de scène

  function sceneFiches() {
    if (t < 6.9 || t > 11.6) return;
    const g = 'fiches';
    const S = Lt.fiches;
    leftBlock(S, 'LES FICHES', C.blue100, '#2c4f78', PEOPLE[1], 7.0, 1, false, g);
    S.decks.forEach((d, i) => {
      const k = life(t, 7.35 + i * 0.12, 0.6);
      const dx = (d.x + d.w / 2 < S.card.cx ? -1 : 1) * 60 * (1 - k.pin);
      deck(d.x + dx, d.y + 30 * (1 - k.pin), d.w, d.h, d.c, d.t, d.s, k.a, d.rot * k.pin);
    });
    const c = life(t, 7.6, 0.6);
    const flip = easeInOut(prog(t, 9.0, 0.6));
    flipCard(S.card.cx, S.card.cy + 40 * (1 - c.pin), S.card.w, S.card.h, flip, c.a);
    const la = c.a * (1 - easeInOut(prog(t, 8.85, 0.25)));
    const lb = c.a * easeInOut(prog(t, 9.5, 0.3));
    const lab = (k, v, a) => richLine([[k + ' : ', { color: C.indigo, weight: 700 }], [v, { weight: 500 }]], S.card.cx, S.labelY, S.label, { align: 'center', alpha: a, group: g });
    lab('Recto', 'comprendre', la);
    lab('Verso', 'mettre en place', lb);
  }

  function sceneFormations() {
    // balayage nuit : entrée par la droite (11,0 → 11,5), sortie vers la gauche (15,0 → 15,5)
    if (t < 11.0 || t > 15.5) return;
    const pin = easeInOut(prog(t, 11.0, 0.5));
    const pout = easeInOut(prog(t, 15.0, 0.5));
    const x = W * (1 - pin) - W * pout;
    ctx.fillStyle = C.night; ctx.fillRect(x, 0, W, H);
    ctx.save(); ctx.beginPath(); ctx.rect(x, 0, W, H); ctx.clip();
    const g = 'formations';
    const fade = 1 - easeInOut(prog(t, 14.85, 0.3));
    const S = Lt.formations;
    leftBlock(S, 'LES FORMATIONS', C.night2, C.green, PEOPLE[2], 11.45, fade, true, g);
    const st = S.steps;
    const belts = [{ n: 'White', c: '#f4f4f4' }, { n: 'Yellow', c: C.yellow }, { n: 'Green', c: C.green }, { n: 'Black', c: '#0b0e24', o: '#5a63a8' }];
    belts.forEach((b, i) => {
      const k = life(t, 11.8 + i * 0.22, 0.6);
      const hh = st.heights[i] * k.pin;
      const x0 = st.x0 + i * (st.w + st.gap);
      const a = k.a * fade;
      if (hh > 1) fillRR(x0, st.base - hh, st.w, hh + 14, 16, C.night2, a);
      belt(x0 + 8, st.base - hh - 50, st.w - 16, 26, b.c, a, b.o);
      if (k.pin > 0.6) text(b.n, x0 + st.w / 2, st.base - 30, { size: st.label, weight: 700, color: C.white, align: 'center', alpha: a * prog(k.pin, 0.6, 0.4), group: g, label: 'ceinture ' + b.n });
    });
    ctx.restore();
  }

  function sceneEnd() {
    if (t < 15.3 || t > 17.4) return;
    const out = [16.85, 0.45];
    const g = 'end';
    const E = Lt.end;
    PEOPLE.forEach((p, i) => {
      const k = life(t, 15.45 + i * 0.12, 0.5, ...out);
      const cx = W / 2 + (i - 1) * E.gap;
      medallion(p, cx, E.y + 20 * (1 - k.pin), E.r, { alpha: k.a, scale: lerp(0.85, 1, k.pin), group: g });
    });
    const k = life(t, 15.8, 0.5, ...out);
    const dy = 20 * (1 - k.pin);
    if (E.titleLh) {
      text('Seul ou', W / 2, E.titleY + dy, { size: E.title, weight: 600, align: 'center', alpha: k.a, group: g });
      text('accompagné.', W / 2, E.titleY + E.titleLh + dy, { size: E.title, weight: 600, italic: true, color: C.indigo, align: 'center', alpha: k.a, group: g });
    } else {
      richLine([['Seul ou '], ['accompagné.', { italic: true, color: C.indigo }]], W / 2, E.titleY + dy, E.title, { align: 'center', alpha: k.a, group: g });
    }
    const k2 = life(t, 16.05, 0.5, ...out);
    const lines = wrap('Des fiches et des formations pour apprendre le Lean.', E.sub, W - 2 * SAFE - 40, 500);
    lines.forEach((l, i) => text(l, W / 2, E.subY + i * E.sub * 1.25, { size: E.sub, weight: 500, color: C.ink700, align: 'center', alpha: k2.a, group: g }));
  }

  function draw(time) {
    t = ((time % D) + D) % D;
    boxes = [];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.white; ctx.fillRect(0, 0, W, H);
    sceneLogo(t);
    sceneHeads(t);
    sceneFiches();
    sceneFormations();
    sceneEnd();
    // liseré signature, toujours présent en bas du cadre
    ribbon(0, H - 12, W, 12);
    checkFrame(t);
  }

  const ready = (async () => {
    for (const [w, it] of [[500, false], [600, false], [700, false], [600, true], [700, true]]) await document.fonts.load(font(40, w, it));
    await Promise.all([
      load('logo', ASSETS + 'fichly-logo.png'),
      load('hugo', ASSETS + 'auteurs/hugo-duc.png'),
      load('boniol', ASSETS + 'auteurs/clement-boniol.png'),
      load('raymond', ASSETS + 'auteurs/clement-raymond.png'),
    ]);
    if (!document.fonts.check(font(40, 600))) console.error('Police Montserrat non chargée');
    draw(0);
  })();

  window.HERO = {
    ready, duration: D, width: W, height: H, format: FORMAT, draw,
    errors: () => [...errors],
    hasPhoto: k => !!IMG[k],
  };
})();
