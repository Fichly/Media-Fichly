// Gabarit commun des visuels Fichly.
// LinkedIn (1080 × 1350) : fond papier, bandeau six couleurs, logo, badge auteur, encart bas gauche.
// Blog (format lu sur le <svg id="stage">, 1200 × 860 pour les articles) : fond papier, bandeau, logo en haut à droite,
// titre sur une ligne, chute en bas.
// Charge avant fiche.js : helpers SVG, mesures et animations déterministes.
// Utilisation : const G = window.Gabarit; G.template({ author: 'clement' }); … ou G.templateBlog(); …
(() => {
  const svg = document.getElementById('stage');
  const W = Number(svg.getAttribute('width')) || 1080, H = Number(svg.getAttribute('height')) || 1350;
  const RIBBON_H = 18;
  // Chemin des assets relatif à la page (data-assets sur le <svg>, sinon deux niveaux au-dessus)
  const ASSETS = svg.getAttribute('data-assets') || '../../assets/';

  // Palette de la charte (valeurs de C)
  const C = {
    blue: '#4a4aa0', green: '#8cc978', yellow: '#e6b839', red: '#f16969',
    lightBlue: '#74a3d6', teal: '#75bec0', violet: '#aa76b2',
    pGreen: '#e6f3df', pRed: '#fde6e6', pLav: '#ececf5', pYellow: '#f8f3d9',
    tGreen: '#2f5a1f', tRed: '#a83434', tYellow: '#7a5806',
    ink: '#23235a', card: '#fdfdfb', line: '#e2e2ee', white: '#ffffff',
  };
  const RIBBON = ['#f16969', '#75bec0', '#aa76b2', '#8cc978', '#e0cf35', '#74a3d6'];
  const ENCART_BLACK = '#000000'; // première ligne des encarts Fichly

  // Badge auteur : Hugo Duc par défaut, author: 'clement' pour Clément Raymond
  const AUTHORS = {
    hugo: { photo: 'auteurs/hugo-duc.png', x: 892, y: 47, size: 122, first: 'Hugo', last: 'Duc' },
    clement: { photo: 'auteurs/clement-raymond.png', x: 889, y: 45, size: 124, first: 'Clément', last: 'Raymond' },
  };

  const NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs = {}, parent = svg) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, str, { size = 26, weight = 500, fill = C.ink, anchor = 'start' } = {}) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': weight, fill, 'text-anchor': anchor }, parent);
    t.textContent = str;
    return t;
  }
  const measure = node => node.getBBox();

  // Contrôle des débordements : fit() enregistre, checkAll() signale par console.error
  const checks = [];
  const fit = (node, maxRight, label, minLeft = 0) => checks.push({ node, maxRight, minLeft, label });
  function checkAll() {
    for (const { node, maxRight, minLeft, label } of checks) {
      const b = measure(node);
      if (b.x + b.width > maxRight + 0.5 || b.x < minLeft - 0.5)
        console.error(`Débordement : ${label} (${Math.round(b.x)} → ${Math.round(b.x + b.width)}, bornes ${minLeft} → ${maxRight})`);
    }
  }
  function noOverlap(a, b, label, gap = 0) {
    const A = measure(a), B = measure(b);
    if (A.x + A.width + gap > B.x && A.y < B.y + B.height && B.y < A.y + A.height)
      console.error(`Chevauchement : ${label}`);
  }

  // ---------- Easing ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.3; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  function invEaseInOut(y) {
    let lo = 0, hi = 1;
    for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (easeInOut(m) < y) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  // Image complète jusqu'à 1,2 s, effacement du contenu en 0,4 s, puis reconstruction.
  const FADE_START = 1.2, FADE_END = 1.6;
  const fading = t => t >= FADE_START && t < FADE_END;
  const fadeOut = t => 1 - prog(t, FADE_START, FADE_END - FADE_START);

  // Pop avec léger rebond (l'état final est exactement l'identité)
  function pop(g, t, start, cx, cy, dur = 0.35) {
    let s = 1, o = 1;
    if (fading(t)) o = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, start, dur);
      s = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p);
      o = clamp(p / 0.4);
    }
    g.setAttribute('transform', s === 1 ? '' : `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`);
    g.setAttribute('opacity', o);
  }
  // Glisse depuis la gauche
  function slide(g, t, start, dur = 0.45, dx = -140) {
    let x = 0, o = 1;
    if (fading(t)) o = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, start, dur);
      x = p >= 1 ? 0 : dx * (1 - easeOut(p));
      o = clamp(p / 0.5);
    }
    g.setAttribute('transform', x === 0 ? '' : `translate(${x} 0)`);
    g.setAttribute('opacity', o);
  }
  // Monte en fondu
  function rise(g, t, start, dur = 0.4, dy = 18) {
    let y = 0, o = 1;
    if (fading(t)) o = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, start, dur);
      y = p >= 1 ? 0 : dy * (1 - easeOut(p));
      o = clamp(p / 0.6);
    }
    g.setAttribute('transform', y === 0 ? '' : `translate(0 ${y})`);
    g.setAttribute('opacity', o);
  }

  // Petite pulsation d'insistance (identité hors de [t0, t0 + dur])
  function pulse(g, t, t0, cx, cy, amp = 0.08, dur = 0.4) {
    const p = prog(t, t0, dur);
    const s = p > 0 && p < 1 ? 1 + amp * Math.sin(Math.PI * p) : 1;
    g.setAttribute('transform', s === 1 ? '' : `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`);
  }
  // Opacité d'un élément visible sur [t0, t1] (fondus d'entrée et de sortie de d secondes)
  const window01 = (t, t0, t1, d = 0.3) => (t < t0 || t > t1 ? 0 : Math.min(clamp((t - t0) / d), clamp((t1 - t) / d)));

  // ---------- Pictos et vocabulaire ----------
  function check(parent, cx, cy, r, bg = C.green) {
    el('circle', { cx, cy, r, fill: bg }, parent);
    const k = r / 26;
    el('path', {
      d: `M ${cx - 10 * k} ${cy + 1 * k} L ${cx - 3 * k} ${cy + 8 * k} L ${cx + 11 * k} ${cy - 7 * k}`,
      fill: 'none', stroke: C.white, 'stroke-width': 5 * k, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, parent);
  }
  function cross(parent, cx, cy, r, bg = C.red) {
    el('circle', { cx, cy, r, fill: bg }, parent);
    const d = 8.5 * r / 26;
    el('path', {
      d: `M ${cx - d} ${cy - d} L ${cx + d} ${cy + d} M ${cx + d} ${cy - d} L ${cx - d} ${cy + d}`,
      fill: 'none', stroke: C.white, 'stroke-width': 5 * r / 26, 'stroke-linecap': 'round',
    }, parent);
  }
  // Pastille numérotée bleue
  function badgeNum(parent, cx, cy, n, r = 20) {
    el('circle', { cx, cy, r, fill: C.blue }, parent);
    text(parent, cx, cy + r * 0.375, String(n), { size: r * 1.05, weight: 700, fill: C.white, anchor: 'middle' });
  }
  // Étiquette en pilule ; icon: 'check' | 'cross' | null
  function pill(parent, x, cy, label, { size = 21, bg = C.pLav, fg = C.blue, h = 36, pad = 16, icon = null, anchor = 'start' } = {}) {
    const g = el('g', {}, parent);
    const r = el('rect', { y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iconW = icon ? 26 : 0;
    const tx = text(g, 0, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    const w = measure(tx).width + pad * 2 + iconW;
    const x0 = anchor === 'middle' ? x - w / 2 : x;
    r.setAttribute('x', x0);
    r.setAttribute('width', w);
    tx.setAttribute('x', x0 + pad + iconW);
    if (icon === 'check') check(g, x0 + pad + 9, cy, 10, C.green);
    if (icon === 'cross') cross(g, x0 + pad + 9, cy, 10, C.red);
    return { g, w, x: x0, tx };
  }
  const card = (x, y, w, h, parent = svg) => el('rect', { x, y, width: w, height: h, rx: 24, fill: C.card, stroke: C.line, 'stroke-width': 2 }, parent);

  // Texte sur plusieurs lignes, coupé aux espaces pour tenir dans maxW (renvoie le <text> et le nombre de lignes)
  function para(parent, x, y, str, maxW, { size = 22, weight = 500, fill = C.ink, anchor = 'start', lh = 1.3 } = {}) {
    const t = text(parent, x, y, '', { size, weight, fill, anchor });
    const lines = [];
    let cur = '';
    const probe = text(parent, 0, -999, '', { size, weight });
    for (const w of str.split(' ')) {
      const test = cur ? cur + ' ' + w : w;
      probe.textContent = test;
      if (probe.getComputedTextLength() > maxW && cur) { lines.push(cur); cur = w; } else cur = test;
    }
    if (cur) lines.push(cur);
    probe.remove();
    lines.forEach((l, i) => {
      const ts = el('tspan', { x, dy: i === 0 ? 0 : size * lh }, t);
      ts.textContent = l;
    });
    return { t, n: lines.length };
  }
  // Flèche droite ou courbe (d = chemin SVG) terminée par une pointe ouverte
  function arrow(parent, d, { stroke = C.blue, width = 3.5, head = 11, dash = null } = {}) {
    const g = el('g', {}, parent);
    const p = el('path', { d, fill: 'none', stroke, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    if (dash) p.setAttribute('stroke-dasharray', dash);
    const len = p.getTotalLength();
    const a = p.getPointAtLength(len), b = p.getPointAtLength(Math.max(0, len - 1));
    const ang = Math.atan2(a.y - b.y, a.x - b.x);
    const hp = s => `${a.x - head * Math.cos(ang + s)} ${a.y - head * Math.sin(ang + s)}`;
    const h = el('path', { d: `M ${hp(0.5)} L ${a.x} ${a.y} L ${hp(-0.5)}`, fill: 'none', stroke, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    // draw(p) : 0 = rien, 1 = flèche complète (le trait se dessine, la pointe apparaît à la fin)
    const draw = q => {
      p.setAttribute('stroke-dasharray', dash && q >= 1 ? dash : `${len} ${len}`);
      p.setAttribute('stroke-dashoffset', q >= 1 ? 0 : len * (1 - q));
      h.setAttribute('opacity', q >= 0.98 ? 1 : 0);
    };
    return { g, path: p, head: h, len, draw };
  }
  // Machine stylisée (même dessin que les fiches) : k = échelle, largeur 180 k × hauteur 124 k
  function machine(parent, x, y, k = 1, body = C.blue) {
    const g = el('g', { transform: `translate(${x} ${y}) scale(${k})` }, parent);
    el('rect', { x: 0, y: 0, width: 180, height: 124, rx: 16, fill: body }, g);
    el('rect', { x: 16, y: 16, width: 104, height: 40, rx: 8, fill: C.white }, g);
    el('rect', { x: 26, y: 30, width: 84, height: 12, rx: 6, fill: C.pLav }, g);
    const gauge = el('rect', { x: 26, y: 30, width: 84, height: 12, rx: 6, fill: C.green }, g);
    const lights = [
      el('circle', { cx: 148, cy: 26, r: 8, fill: C.lightBlue }, g),
      el('circle', { cx: 148, cy: 50, r: 8, fill: C.green }, g),
    ];
    el('rect', { x: 16, y: 72, width: 148, height: 36, rx: 8, fill: C.white, 'fill-opacity': 0.14 }, g);
    [0, 1, 2, 3].forEach(i => el('rect', { x: 30 + i * 34, y: 80, width: 18, height: 20, rx: 4, fill: C.white, 'fill-opacity': 0.35 }, g));
    return { g, gauge, lights };
  }
  // Carton de pièces (32 × 32 à k = 1), centré sur (x, y)
  function carton(parent, x, y, k = 1, fill = C.yellow) {
    const g = el('g', { transform: `translate(${x} ${y})` }, parent);
    const inner = el('g', k === 1 ? {} : { transform: `scale(${k})` }, g);
    el('rect', { x: -16, y: -16, width: 32, height: 32, rx: 5, fill }, inner);
    el('line', { x1: -9, y1: -5, x2: 9, y2: -5, stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, inner);
    return g;
  }

  // Silhouette (client, opérateur) posée sur floor : hauteur 76 k
  function person(parent, cx, floor, k = 1, fill = C.blue) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 62 * k, r: 14 * k, fill }, g);
    el('path', { d: `M ${cx - 24 * k} ${floor} L ${cx - 24 * k} ${floor - 22 * k} Q ${cx - 24 * k} ${floor - 42 * k} ${cx} ${floor - 42 * k} Q ${cx + 24 * k} ${floor - 42 * k} ${cx + 24 * k} ${floor - 22 * k} L ${cx + 24 * k} ${floor} Z`, fill }, g);
    return g;
  }

  // ---------- Gabarit LinkedIn ----------
  function template({ author = 'hugo' } = {}) {
    // Cadre fixe (data-frame) : fond papier et bandeau ne bougent jamais, même avec la caméra
    el('rect', { x: 0, y: 0, width: W, height: H, fill: '#f3f3f3', 'data-frame': 1 });
    el('image', { href: ASSETS + 'paper.png', x: 0, y: 0, width: W, height: H, 'data-frame': 1 });
    RIBBON.forEach((c, i) => el('rect', { x: i * 180, y: H - RIBBON_H, width: 180, height: RIBBON_H, fill: c, 'data-frame': 1 }));
    el('image', { href: ASSETS + 'fichly-logo.png', x: 884, y: 1228, width: 178, height: 94 });
    const a = AUTHORS[author];
    el('image', { href: ASSETS + a.photo, x: a.x, y: a.y, width: a.size, height: a.size });
    text(svg, 952, 210, a.first, { size: 23, weight: 400, fill: C.blue, anchor: 'middle' });
    text(svg, 952, 243, a.last, { size: 23, weight: 700, fill: C.blue, anchor: 'middle' });
  }

  // ---------- Gabarit blog (paysage) ----------
  function templateBlog() {
    el('rect', { x: 0, y: 0, width: W, height: H, fill: '#f3f3f3', 'data-frame': 1 });
    el('image', { href: ASSETS + 'paper.png', x: 0, y: 0, width: W, height: W * 1350 / 1080, preserveAspectRatio: 'xMidYMin slice', 'data-frame': 1 });
    RIBBON.forEach((c, i) => el('rect', { x: i * W / 6, y: H - RIBBON_H, width: W / 6 + 0.5, height: RIBBON_H, fill: c, 'data-frame': 1 }));
    el('image', { href: ASSETS + 'fichly-logo.png', x: W - 176, y: 26, width: 142, height: 75, 'data-frame': 1 });
  }
  // Titre sur une ligne : début en bleu, fin en blanc dans le cadre bleu
  function blogTitle(a, b, { size = 50, y = 92, maxRight = W - 200 } = {}) {
    const t1 = text(svg, 60, y, a, { size, weight: 800, fill: C.blue });
    const x = a ? measure(t1).x + measure(t1).width + size * 0.5 : 44;
    const kb = el('rect', { x: x - size * 0.25, y: y - size * 0.82, height: size * 1.14, rx: 11, fill: C.blue });
    const t2 = text(svg, x + size * 0.08, y, b, { size, weight: 800, fill: C.white });
    kb.setAttribute('width', measure(t2).width + size * 0.66);
    fit(kb, maxRight, 'cadre du titre');
    return { t1, kb, t2 };
  }
  function blogChapeau(str, { y = 146, maxRight = W - 60 } = {}) {
    const t = text(svg, 60, y, str, { size: 24, weight: 500, fill: C.blue });
    fit(t, maxRight, 'chapeau');
    return t;
  }
  // Chute : la phrase à retenir, en bas au-dessus du bandeau
  function blogChute(str, { y = H - 50 } = {}) {
    const g = el('g');
    el('rect', { x: 44, y: y - 30, width: 6, height: 38, rx: 3, fill: C.blue }, g);
    fit(text(g, 64, y, str, { size: 28, weight: 700, fill: C.blue }), W - 44, 'chute');
    return g;
  }

  // Titre deux lignes en 72 px : ligne 1 bleue, ligne 2 blanche dans le cadre bleu (keyTitle).
  function title(line1, line2, maxRight = 900) {
    const t1 = text(svg, 62, 122, line1, { size: 72, weight: 800, fill: C.blue });
    fit(t1, maxRight, 'titre ligne 1');
    const kb = el('rect', { x: 44, y: 157, height: 82, rx: 12, fill: C.blue });
    const t2 = text(svg, 68, 216, line2, { size: 72, weight: 800, fill: C.white });
    kb.setAttribute('width', measure(t2).width + 48);
    fit(kb, maxRight, 'cadre keyTitle');
    return { t1, kb, t2 };
  }
  function chapeau(str) {
    fit(text(svg, 62, 304, str, { size: 26, weight: 500, fill: C.blue }), 1020, 'chapeau');
  }
  // Chute en deux lignes (30 px, gras, bleu), au-dessus de l'encart
  function chute(l1, l2, parent) {
    const g = parent || el('g');
    fit(text(g, 62, 1108, l1, { size: 30, weight: 700, fill: C.blue }), 1020, 'chute ligne 1');
    fit(text(g, 62, 1148, l2, { size: 30, weight: 700, fill: C.blue }), 1020, 'chute ligne 2');
    return g;
  }

  // Encart bas gauche (fixe) : visuel des guides + appel vers le premier commentaire du post
  function encart(lines) {
    const g = el('g');
    el('image', { href: ASSETS + 'encarts/guides-fichly.png', x: 14, y: 1215, width: 262, height: 117 }, g);
    el('path', { d: 'M 268 1318 C 300 1319, 332 1304, 351 1277', fill: 'none', stroke: C.blue, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, g);
    el('path', { d: 'M 337 1286 L 352 1275 L 354 1293', fill: 'none', stroke: C.blue, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const CX = 512;
    const a = text(g, CX, 1204, lines[0], { size: 26, weight: 700, fill: ENCART_BLACK, anchor: 'middle' });
    const b = text(g, CX, 1235, lines[1], { size: 26, weight: 700, fill: C.blue, anchor: 'middle' });
    const c = text(g, CX, 1270, lines[2], { size: 26, weight: 700, fill: C.blue, anchor: 'middle' });
    const cb = measure(c);
    const x0 = cb.x + 26, x1 = cb.x + cb.width - 6;
    el('path', { d: `M ${x0} 1290 C ${x0 + 44} 1283, ${x0 + 134} 1280, ${x1} 1281`, fill: 'none', stroke: C.green, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, g);
    el('path', { d: `M ${x0 + 36} 1295 C ${x0 + 82} 1291, ${x0 + 152} 1290, ${x1 - 48} 1291`, fill: 'none', stroke: C.green, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, g);
    [a, b, c].forEach((n, i) => fit(n, 870, `encart ligne ${i + 1}`, 290));
    return g;
  }

  // ---------- Caméra ----------
  // Le contenu passe dans un calque « monde » que la caméra zoome ; le cadre fixe reste en place,
  // ce qui garde le GIF léger (le papier ne change pas d'une image à l'autre).
  let world = null;
  function cameraLayer() {
    if (world) return world;
    const holder = el('g', { 'clip-path': clipRect(0, 0, W, H - RIBBON_H).url });
    world = el('g', {}, holder);
    [...svg.children].forEach(n => {
      if (n === holder || n.tagName === 'defs' || n.hasAttribute('data-frame')) return;
      world.appendChild(n);
    });
    return world;
  }
  // Plans : [{ t, cx, cy, w, cut? }]. Entre deux plans, travelling en easeInOut ; cut: true = coupe franche.
  function camera(t, shots) {
    let v = shots[0];
    for (let i = 0; i < shots.length - 1; i++) {
      const a = shots[i], b = shots[i + 1];
      if (t < a.t) break;
      if (t >= b.t) { v = b; continue; }
      if (b.cut) { v = a; break; }
      const e = easeInOut(prog(t, a.t, b.t - a.t));
      v = { cx: a.cx + (b.cx - a.cx) * e, cy: a.cy + (b.cy - a.cy) * e, w: a.w + (b.w - a.w) * e };
      break;
    }
    const w = v.w, h = w * H / W;
    const x = clamp(v.cx - w / 2, 0, W - w), y = clamp(v.cy - h / 2, 0, H - h);
    const k = W / w;
    cameraLayer().setAttribute('transform', w >= W ? '' : `translate(${-x * k} ${-y * k}) scale(${k})`);
  }
  // Contour qui se dessine autour d'un élément (stroke-dashoffset)
  function outline(x, y, w, h, parent = svg) {
    const r = el('rect', { x, y, width: w, height: h, rx: 20, fill: 'none', stroke: C.blue, 'stroke-width': 4, opacity: 0 }, parent);
    const len = 2 * (w + h);
    r.setAttribute('stroke-dasharray', len);
    return (t, t0, t1) => {
      const p = easeOut(prog(t, t0, 0.45));
      r.setAttribute('stroke-dashoffset', len * (1 - p));
      r.setAttribute('opacity', t >= t0 && t < t1 ? 1 : 0);
    };
  }
  // Zone de découpe animable (volet) : renvoie l'id à mettre en clip-path et le rectangle
  let clipN = 0;
  function clipRect(x = 0, y = 0, w = W, h = H) {
    const id = `clip${++clipN}`;
    const defs = svg.querySelector('defs') || el('defs');
    const cp = el('clipPath', { id }, defs);
    const r = el('rect', { x, y, width: w, height: h }, cp);
    return { url: `url(#${id})`, rect: r };
  }

  // Démarrage : polices chargées, scène construite, images décodées, draw(0).
  // scenarios : { nom: draw } ; le scénario vient de l'URL (?scenario=camera), sinon le premier.
  function start({ duration, build, draw, scenarios }) {
    if (scenarios) {
      const wanted = new URLSearchParams(location.search).get('scenario');
      const name = wanted || Object.keys(scenarios)[0];
      if (!scenarios[name]) console.error(`Scénario inconnu : ${name} (${Object.keys(scenarios).join(', ')})`);
      draw = scenarios[name] || Object.values(scenarios)[0];
    }
    const ready = (async () => {
      await Promise.all([400, 500, 600, 700, 800].map(w => document.fonts.load(`${w} 30px Poppins`)));
      await document.fonts.ready;
      build();
      checkAll();
      const imgs = [...svg.querySelectorAll('image')];
      await Promise.all(imgs.map(i => new Promise(res => {
        const im = new Image(); im.onload = im.onerror = res; im.src = new URL(i.getAttribute('href'), location.href).href;
      })));
      draw(0);
    })();
    const loop = t => draw(((t % duration) + duration) % duration);
    window.FICHE = { width: W, height: H, duration, draw: loop, ready };
  }

  // Image fixe (blog) : la scène construite une fois, rien ne bouge
  const image = build => start({ duration: 1, build, draw: () => {} });

  window.Gabarit = {
    W, H, C, svg, el, text, measure, fit, noOverlap,
    clamp, prog, easeOut, easeInOut, back, invEaseInOut,
    FADE_START, FADE_END, fading, fadeOut, pop, slide, rise, pulse, window01,
    check, cross, badgeNum, pill, card, para, arrow, machine, carton, person, image,
    template, title, chapeau, chute, encart, templateBlog, blogTitle, blogChapeau, blogChute, start,
    camera, outline, clipRect,
  };
})();
