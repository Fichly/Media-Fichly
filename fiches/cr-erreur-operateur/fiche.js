// Fiche LinkedIn · Clément Raymond · mardi 20 octobre 2026
// Post : « Pourquoi la pièce est-elle non conforme ? Parce que l'opérateur s'est trompé. »
// Premier commentaire du post (Buffer) : notre article sur la méthode des 5 Pourquoi → encart.
// Le visuel est la pièce maîtresse : une coupe du sol. Une foreuse descend, un pourquoi par couche.
// Elle s'arrête net sur la couche « Erreur opérateur » : son projecteur se braque sur l'opérateur,
// l'action tombe (sensibiliser, rappeler la consigne, reformer)… et le problème remonte à la surface,
// avec un autre opérateur. La règle relance la foreuse : elle brise la couche, traverse les trois
// questions du post et atteint la roche de ce qu'on peut réellement changer.
// Style propre : le forage (coupe géologique, jauge de profondeur, compteur de pourquoi).
// Image t = 0 = état final. Boucle exacte de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeIn = p => p * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const frac = v => v - Math.floor(v);
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  // Visibilité : un élément invisible passe en display="none" (rendu stable)
  const vis = (n, o) => {
    if (o <= 0.002) { n.setAttribute('display', 'none'); return false; }
    n.removeAttribute('display');
    if (o >= 0.998) n.removeAttribute('opacity'); else n.setAttribute('opacity', f2(o));
    return true;
  };
  const scaleAt = (n, cx, cy, k, extra = '') => n.setAttribute('transform',
    (extra ? extra + ' ' : '') + (k === 1 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-cx)} ${f2(-cy)})`));
  // Pseudo-aléatoire déterministe (texture du sol)
  function rng(seed) {
    return () => {
      seed = (seed + 0x6D2B79F5) | 0;
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', HEAD_SOFT = '#cfd0ec';
  const STEEL = '#9d9dc0', OFF = '#b9b9d6';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const BOTTOM = FRAME.y + FRAME.h;            // 1150
  const PY = FRAME.y + 42;                     // pastilles d'étape
  const DX = 200, HOLE = 21;                   // axe de la foreuse, demi-largeur du trou
  const B = [646, 718, 800, 864, 928, 992];    // sol, couche « erreur opérateur », trois questions, roche
  const GROUND = B[0], Y_HIT = B[1], Y_ROCK = B[5];
  const WAVES = [[0, 1], [3, 260], [3.5, 330], [2.5, 210], [3, 290], [3.5, 240]];
  const wave = (i, x) => B[i] + WAVES[i][0] * Math.sin((x - DX) / WAVES[i][1] * 2 * Math.PI);
  const mid = i => (B[i] + B[i + 1]) / 2;
  const LX = 262;                              // début des étiquettes des couches
  const GX = 104, RX = 136;                    // repères et règle de la jauge
  const MOTOR_Y = 566, MOTOR_H = 30, ROD_TOP = MOTOR_Y + MOTOR_H, BIT_H = 44;
  const LAMP = [218, 538];                     // projecteur fixé sur la jambe droite du derrick
  const OP_X = 478, PART_X = 362, PART_Y = 588;
  const CARD = { x: 600, y: 498, w: 390, h: 134 };
  const RULE = { x: 528, y: 498, w: 462, h: 134 };
  const COUNTER = { x: 792, y: 426, w: 196, h: 54 };

  // Couches du sol (de haut en bas)
  const LAYERS = [
    { fill: '#f7f0d8', peb: '#e8dcb6' },   // pourquoi 1
    { fill: '#f8dcdc', peb: '#e9b3b3' },   // « erreur opérateur »
    { fill: '#f1e6c7', peb: '#ddcd9f' },   // pourquoi 2
    { fill: '#ecdfb8', peb: '#d6c48f' },   // pourquoi 3
    { fill: '#e7d8a9', peb: '#cdb97f' },   // pourquoi 4
    { fill: C.blue, peb: '#5a5ab0' },      // la roche
  ];
  const CRUST = LAYERS[1].fill;

  // ---------- Textes (formulations du post) ----------
  const Q = [
    `Pourquoi la pièce est-elle non conforme${NB}?`,
    `Pourquoi l’erreur a-t-elle été possible${NB}?`,
    `Pourquoi n’a-t-elle pas été détectée${NB}?`,
    `Qu’est-ce qui, dans le poste, l’a rendue probable${NB}?`,
  ];
  const Q_LAYER = [0, 2, 3, 4];
  const QUOTE = `«${NB}Parce que l’opérateur s’est trompé.${NB}»`;
  const NOTE = 'Cela décrit ce qui s’est passé, pas une cause racine.';
  const CAUSES = [['Le standard', 'L’outil', 'Le détrompeur'], ['La formation au poste', 'L’organisation']];
  const ACTIONS = ['Sensibiliser', 'Rappeler la consigne', 'Reformer'];
  const RULE_LINES = ['Quand la réponse est', `«${NB}erreur humaine${NB}», on continue.`];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION - 0.001;
  const T_OUT = 1.2, OUT = 0.4, T_START = T_OUT + OUT;   // l'image finale se rembobine
  const T_ALERT = 1.7;                                   // la pièce non conforme
  const T_D1 = 1.95, T_HIT = 2.95;                       // premier pourquoi, arrêt net
  const T_CHIP = 3.0, T_QUOTE = 3.15;
  const T_LAMP = 3.55, T_BEAM = 3.82;                    // le projecteur se braque
  const T_CARD = 4.05, T_TICK = [4.4, 4.75, 5.1];        // l'action
  const T_FIX = 5.35;                                    // l'alerte s'efface, le projecteur s'éteint
  const T_OP_OUT = 5.55, T_OP_IN = 5.85;                 // un autre opérateur
  const T_BUBBLE = 6.15, BUBBLE = 0.5, T_BACK = T_BUBBLE + BUBBLE;  // le problème remonte
  const T_DIM = 6.8;
  const T_CARD_OUT = 7.05, T_RULE = 7.35, T_RULE_TYPE = 7.45, RULE_CPS = 100;
  const T_REV = 7.85, T_D2 = 8.1, T_CRUST = 8.7, T_ROCK = 10.35;
  const T_NOTE = 8.75;
  const T_CHIPS = 10.6, CHIP_STEP = 0.14;
  const CPS = 100, ROLL = 0.3;
  const crossT = y => T_CRUST + (y - B[2]) / (Y_ROCK - B[2]) * (T_ROCK - T_CRUST);
  const T_Q = [T_D1 + 0.05, crossT(B[2]) + 0.03, crossT(B[3]) + 0.03, crossT(B[4]) + 0.03];
  const ROLLS = [[T_OUT + 0.05, 4, 0], [T_D1, 0, 1], [T_CRUST, 1, 2], [crossT(B[3]), 2, 3], [crossT(B[4]), 3, 4]];
  // Repères de la jauge : [centre, contenu, instant où on l'atteint]
  const MARKS = [[mid(0), '1', T_D1], [mid(1), '!', T_HIT], [mid(2), '2', T_CRUST], [mid(3), '3', crossT(B[3])], [mid(4), '4', crossT(B[4])], [1063, 'ok', T_ROCK]];
  const PILLS = [
    [1.6, `1${NB}·${NB}On creuse${NB}: premier pourquoi`, 'b'],
    [3.4, `2${NB}·${NB}La chaîne s’arrête là`, 'r'],
    [6.05, `3${NB}·${NB}Le problème revient, avec un autre opérateur`, 'r'],
    [7.0, `4${NB}·${NB}On continue à creuser`, 'b'],
    [10.45, 'Cause atteinte', 'g'],
  ];
  const SPIN = [[T_D1, T_HIT], [T_REV, T_ROCK]];        // la foreuse tourne
  const spinTime = t => SPIN.reduce((a, [s, e]) => a + clamp(t - s, 0, e - s), 0);

  // Profondeur de la pointe de la foreuse
  function tipY(t) {
    if (t < T_OUT) return Y_ROCK;
    if (t < T_START) return lerp(Y_ROCK, GROUND, easeInOut(prog(t, T_OUT, OUT)));
    if (t < T_D1) return GROUND;
    if (t < T_HIT) { const p = prog(t, T_D1, T_HIT - T_D1); return lerp(GROUND, Y_HIT, (p * p + p) / 2); }  // accélère, puis arrêt net
    if (t < T_D2) return Y_HIT - 5 * Math.sin(Math.PI * prog(t, T_HIT, 0.16));                           // petit recul
    if (t < T_CRUST) { const p = prog(t, T_D2, T_CRUST - T_D2); return lerp(Y_HIT, B[2], p) + 1.2 * Math.sin(t * 70); }
    if (t < T_ROCK) return lerp(B[2], Y_ROCK, prog(t, T_CRUST, T_ROCK - T_CRUST));
    return Y_ROCK - 4 * Math.sin(Math.PI * prog(t, T_ROCK, 0.16));
  }
  const drilling = t => (t > T_D1 && t < T_HIT) || (t > T_D2 && t < T_ROCK);

  // ---------- Petits éléments ----------
  const halo = (n, color, w = 6) => {
    [['stroke', color], ['stroke-width', w], ['stroke-linejoin', 'round'], ['paint-order', 'stroke']].forEach(([k, v]) => n.setAttribute(k, v));
    return n;
  };
  function pillShape(parent, x, cy, label, { bg, fg, icon = false, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon) {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.green }, g);
      el('path', { d: `M ${x + 25.5} ${cy + 0.5} L ${x + 29.5} ${cy + 4.5} L ${x + 36.5} ${cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return g;
  }
  function operator(parent, color) {
    const g = el('g', {}, parent);
    el('path', { d: 'M -21 0 V -24 C -21 -40, 21 -40, 21 -24 V 0 Z', fill: color }, g);
    el('circle', { cx: 0, cy: -53, r: 12.5, fill: color }, g);
    return g;
  }
  function causeChip(parent, x, cy, label) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - 17, height: 34, rx: 17, fill: C.pGreen }, g);
    el('circle', { cx: x + 19, cy, r: 9.5, fill: C.green }, g);
    el('path', { d: `M ${x + 14.5} ${cy + 0.5} L ${x + 17.8} ${cy + 3.8} L ${x + 23.5} ${cy - 2.8}`, fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const tx = text(g, x + 36, cy + 6.3, label, { size: 18, weight: 800, fill: C.tGreen });
    const w = tx.getBBox().width + 52;
    r.setAttribute('width', w);
    return { g, w, cx: x + w / 2, cy };
  }
  // Texte tapé : un nœud, son texte complet
  const typed = (node) => ({ n: node, full: node.textContent });
  const showTyped = (ty, k) => { ty.n.textContent = ty.full.slice(0, Math.max(0, Math.min(ty.full.length, k))); };
  const boundaryPts = (i, x0 = 50, x1 = 1030) => {
    const pts = [];
    for (let x = x0; x <= x1 + 0.1; x += 10) pts.push([x, i === 0 ? GROUND : i >= B.length ? BOTTOM + 20 : wave(i, x)]);
    return pts;
  };
  const ptsD = pts => pts.map((p, k) => `${k ? 'L' : 'M'} ${f2(p[0])} ${f2(p[1])}`).join(' ');

  const S = {};

  function build() {
    D.template({ author: 'clement' });
    D.title(`Erreur opérateur${NB}?`, 'On continue.');
    D.chapeau('Dans beaucoup d’analyses 5 Pourquoi, la chaîne s’arrête là.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Un pourquoi', C.blue], [' par couche', C.blue], [`${NB}: on creuse jusqu’à `, 0], ['ce qu’on peut réellement changer', C.tGreen], ['.', 0]]);
    line(384, [['S’arrêter sur ', 0], [`«${NB}erreur opérateur${NB}»`, C.tRed], [`, c’est un arrêt prématuré${NB}: le problème revient.`, 0]]);

    const defs = el('defs');
    const cpF = el('clipPath', { id: 'frame' }, defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26 }, cpF);
    const lift = el('filter', { id: 'lift', x: '-20%', y: '-30%', width: '140%', height: '170%' }, defs);
    el('feDropShadow', { dx: 0, dy: 8, stdDeviation: 8, 'flood-color': C.ink, 'flood-opacity': 0.16 }, lift);
    const cpRod = el('clipPath', { id: 'rod' }, defs);
    S.rodClip = el('rect', { x: DX - 6, y: ROD_TOP, width: 12, height: 1 }, cpRod);
    const BIT_D = `M -15 ${-BIT_H} H 15 V -17 L 0 0 L -15 -17 Z`;
    const cpBit = el('clipPath', { id: 'bitc' }, defs);
    el('path', { d: BIT_D }, cpBit);
    const cpDigit = el('clipPath', { id: 'digit' }, defs);
    el('rect', { x: COUNTER.x + 14, y: COUNTER.y + 24, width: 26, height: 30 }, cpDigit);

    // Calques, dans l'ordre d'affichage
    const G = {};
    ['frame', 'geo', 'tex', 'rockLine', 'beam', 'surface', 'hole', 'cracks', 'chunks', 'rig', 'fx', 'labels', 'gauge', 'bubble', 'cards', 'border', 'header']
      .forEach(k => { G[k] = el('g'); });
    ['geo', 'tex', 'rockLine', 'cracks'].forEach(k => G[k].setAttribute('clip-path', 'url(#frame)'));

    // ----- Cadre : le ciel de l'atelier, puis la coupe du sol -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG }, G.frame);
    LAYERS.forEach((L, k) => {
      const top = boundaryPts(k), bot = boundaryPts(k + 1).reverse();
      el('path', { d: `${ptsD(top)} ${ptsD(bot).replace(/^M/, 'L')} Z`, fill: L.fill }, G.geo);
    });
    [1, 2, 3, 4].forEach(i => el('path', { d: ptsD(boundaryPts(i)), fill: 'none', stroke: C.ink, 'stroke-opacity': 0.1, 'stroke-width': 2 }, G.geo));
    el('path', { d: ptsD(boundaryPts(5)), fill: 'none', stroke: '#3a3a86', 'stroke-width': 3 }, G.geo);
    el('line', { x1: FRAME.x, y1: GROUND, x2: FRAME.x + FRAME.w, y2: GROUND, stroke: C.ink, 'stroke-width': 3.5 }, G.geo);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: 'none', stroke: C.line, 'stroke-width': 2 }, G.border);

    // ----- Étiquettes des couches -----
    S.q = Q.map((str, k) => {
      const li = Q_LAYER[k];
      const n = halo(text(G.labels, LX, mid(li) + 7, str, { size: 19, weight: 700, fill: C.ink }), LAYERS[li].fill);
      fit(n, 1000, `question ${k + 1}`, LX);
      return typed(n);
    });
    // Couche « erreur opérateur »
    const ccy = mid(1) - 18;
    S.cChip = el('g', {}, G.labels);
    const cr = el('rect', { x: LX, y: ccy - 14, height: 28, rx: 14, fill: C.red }, S.cChip);
    const ct = text(S.cChip, LX + 14, ccy + 6, 'Erreur opérateur', { size: 17, weight: 800, fill: C.white });
    const cw = ct.getBBox().width + 28;
    cr.setAttribute('width', cw);
    S.cChipC = [LX + cw / 2, ccy];
    S.quote = typed(halo(text(G.labels, LX + cw + 12, ccy + 6.5, QUOTE, { size: 18, weight: 700, fill: C.ink }), CRUST));
    fit(S.quote.n, 1000, 'citation');
    S.note = halo(text(G.labels, LX, mid(1) + 27, NOTE, { size: 16, weight: 700, fill: C.tRed }), CRUST);
    fit(S.note, 1000, 'note couche');
    // La roche
    S.rockTitle = text(G.labels, LX, Y_ROCK + 37, 'Ce qu’on peut réellement changer', { size: 19, weight: 800, fill: C.white });
    fit(S.rockTitle, 1000, 'titre roche');
    S.chips = [];
    CAUSES.forEach((row, r) => {
      let x = LX;
      row.forEach(label => {
        const c = causeChip(G.labels, x, 1063 + r * 44, label);
        fit(c.g, 1000, `cause ${label}`);
        S.chips.push(c);
        x += c.w + 12;
      });
    });
    S.caret = el('rect', { x: 0, y: 0, width: 3, height: 22, rx: 1.5, fill: C.blue }, G.labels);

    // ----- Texture du sol (en dehors des étiquettes et du trou) -----
    const boxes = [...S.q.map(q => q.n), S.cChip, S.quote.n, S.note, S.rockTitle, ...S.chips.map(c => c.g)].map(n => n.getBBox());
    const free = (x, y, m) => x > 146 && Math.abs(x - DX) > HOLE + 14 && !(x > DX && x < LX + 6 && y < Y_ROCK) && !boxes.some(b => x > b.x - m && x < b.x + b.width + m && y > b.y - m && y < b.y + b.height + m);
    const rnd = rng(20261020);
    [0, 2, 3, 4].forEach(k => {
      for (let n = 0; n < 34; n++) {
        const x = 150 + rnd() * 860, top = wave(k, x) + (k === 0 ? 0 : 0), bot = wave(k + 1, x);
        const y = top + 10 + rnd() * (bot - top - 20);
        const rx = 2.5 + rnd() * 4.5, ry = 1.8 + rnd() * 2.4;
        if (!free(x, y, 10)) continue;
        el('ellipse', { cx: f2(x), cy: f2(y), rx: f2(rx), ry: f2(ry), fill: LAYERS[k].peb }, G.tex);
      }
    });
    for (let n = 0; n < 60; n++) {   // couche dure : petits traits
      const x = 150 + rnd() * 860, y = wave(1, x) + 9 + rnd() * (wave(2, x) - wave(1, x) - 18);
      if (!free(x, y, 9)) continue;
      el('line', { x1: f2(x - 4), y1: f2(y + 3), x2: f2(x + 4), y2: f2(y - 3), stroke: LAYERS[1].peb, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, G.tex);
    }
    for (let n = 0; n < 40; n++) {   // la roche : facettes
      const x = 70 + rnd() * 940, y = Y_ROCK + 14 + rnd() * 136;
      if (!free(x, y, 12) && x > 146) continue;
      if (Math.abs(x - GX) < 22 && Math.abs(y - 1063) < 22) continue;
      const s = 4 + rnd() * 6;
      el('path', { d: `M ${f2(x)} ${f2(y - s)} L ${f2(x + s * 0.8)} ${f2(y)} L ${f2(x)} ${f2(y + s * 0.7)} L ${f2(x - s * 0.8)} ${f2(y)} Z`, fill: LAYERS[5].peb }, G.tex);
    }

    // La roche s'éclaire quand on l'atteint (tracé vert depuis la foreuse)
    S.rockLines = [boundaryPts(5, 50, DX).reverse(), boundaryPts(5, DX, 1030)].map(pts => {
      const n = el('path', { d: ptsD(pts), fill: 'none', stroke: C.green, 'stroke-width': 4, 'stroke-linecap': 'round' }, G.rockLine);
      return { n, len: n.getTotalLength() };
    });

    // ----- Surface : le poste -----
    el('rect', { x: 296, y: 602, width: 132, height: 9, rx: 3, fill: '#8b8bb3' }, G.surface);
    [306, 411].forEach(x => el('rect', { x, y: 611, width: 7, height: GROUND - 611, fill: '#a9a9c9' }, G.surface));
    S.part = el('rect', { x: PART_X - 17, y: PART_Y, width: 34, height: 14, rx: 3, fill: '#d9d9ea', stroke: C.ink, 'stroke-width': 2 }, G.surface);
    S.alert = el('g', {}, G.surface);
    el('line', { x1: PART_X, y1: 548, x2: PART_X, y2: PART_Y - 3, stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '4 4' }, S.alert);
    const ar = el('rect', { y: 517, height: 30, rx: 15, fill: C.pRed, stroke: C.red, 'stroke-width': 2 }, S.alert);
    const at = text(S.alert, 0, 538, 'Non conforme', { size: 16, weight: 800, fill: C.tRed });
    const aw = at.getBBox().width + 50;
    ar.setAttribute('x', f2(PART_X - aw / 2));
    ar.setAttribute('width', f2(aw));
    at.setAttribute('x', f2(PART_X - aw / 2 + 36));
    el('circle', { cx: f2(PART_X - aw / 2 + 18), cy: 532, r: 9.5, fill: C.red }, S.alert);
    text(S.alert, PART_X - aw / 2 + 18, 537.5, '!', { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
    fit(ar, CARD.x - 20, 'alerte non conforme', 262);
    S.ops = [operator(G.surface, C.teal), operator(G.surface, C.violet)];

    // Projecteur : faisceau et flaque de lumière (sous le poste)
    S.beam = el('g', {}, G.beam);
    S.beamPoly = el('path', { fill: C.yellow, 'fill-opacity': 0.26 }, S.beam);
    el('ellipse', { cx: OP_X, cy: GROUND, rx: 50, ry: 8, fill: C.yellow, 'fill-opacity': 0.5 }, S.beam);

    // ----- Le trou, ses fissures, les éclats -----
    S.holeRect = el('rect', { x: DX - HOLE, y: GROUND, width: HOLE * 2, height: 1, fill: C.ink, 'fill-opacity': 0.14 }, G.hole);
    S.holeWalls = [-HOLE, HOLE].map(dx => el('line', { x1: DX + dx, y1: GROUND, x2: DX + dx, y2: GROUND, stroke: C.ink, 'stroke-opacity': 0.25, 'stroke-width': 2 }, G.hole));
    const ccr = mid(1) + 4;      // la fissure passe entre les deux lignes de la couche
    const crackPaths = [
      `M ${DX - HOLE} ${ccr - 2} L 166 ${ccr + 3} L 150 ${ccr - 3} L 128 ${ccr + 2} L 104 ${ccr - 2} L 80 ${ccr + 3} L 58 ${ccr}`,
      `M ${DX + HOLE} ${ccr - 1} L 240 ${ccr + 3} L 300 ${ccr - 2} L 380 ${ccr + 2} L 470 ${ccr - 2} L 560 ${ccr + 2} L 660 ${ccr - 2} L 760 ${ccr + 2} L 860 ${ccr - 2} L 950 ${ccr + 2} L 1022 ${ccr}`,
      `M ${DX - HOLE} ${Y_HIT + 12} L 168 ${Y_HIT + 4} L 156 ${Y_HIT + 7}`,
      `M ${DX + HOLE} ${B[2] - 10} L 236 ${B[2] - 4} L 246 ${B[2] - 8}`,
      `M ${DX - HOLE} ${B[2] - 8} L 172 ${B[2] - 2}`,
    ];
    S.cracks = crackPaths.map(d => {
      const n = el('path', { d, fill: 'none', stroke: C.tRed, 'stroke-opacity': 0.5, 'stroke-width': 2.2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, G.cracks);
      return { n, len: n.getTotalLength() };
    });
    const rc = rng(7);
    S.chunks = [0, 1, 2, 3, 4, 5].map(k => {
      const side = k % 2 ? 1 : -1, s = 4 + rc() * 3;
      const g = el('g', {}, G.chunks);
      el('path', { d: `M ${-s} ${-s * 0.6} L ${s * 0.3} ${-s} L ${s} ${s * 0.2} L ${-s * 0.2} ${s * 0.9} Z`, fill: LAYERS[1].peb, stroke: C.tRed, 'stroke-opacity': 0.45, 'stroke-width': 1.5 }, g);
      return { g, side, vx: 28 + rc() * 32, vy: 100 + rc() * 50, delay: rc() * 0.18, spin: (rc() - 0.5) * 500 };
    });

    // ----- La foreuse -----
    S.rig = el('g', {}, G.rig);
    const legs = [[158, GROUND, 191, 504], [242, GROUND, 209, 504]];
    const legX = (i, y) => lerp(legs[i][0], legs[i][2], (GROUND - y) / (GROUND - 504));
    legs.forEach(([x1, y1, x2, y2]) => el('line', { x1, y1, x2, y2, stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, S.rig));
    [[552, 600], [600, 552]].forEach(([ya, yb]) => el('line', { x1: f2(legX(0, ya)), y1: ya, x2: f2(legX(1, yb)), y2: yb, stroke: C.ink, 'stroke-width': 2.5, 'stroke-opacity': 0.6 }, S.rig));
    [552, 600].forEach(y => el('line', { x1: f2(legX(0, y)), y1: y, x2: f2(legX(1, y)), y2: y, stroke: C.ink, 'stroke-width': 3 }, S.rig));
    el('line', { x1: DX, y1: 504, x2: DX, y2: MOTOR_Y, stroke: C.ink, 'stroke-width': 2.5 }, S.rig);
    el('rect', { x: DX - 22, y: 494, width: 44, height: 12, rx: 4, fill: C.ink }, S.rig);
    el('rect', { x: 146, y: GROUND - 8, width: 108, height: 8, rx: 3, fill: C.ink }, S.rig);
    // Tige (qui tourne) et trépan
    S.rod = el('rect', { x: DX - 6, y: ROD_TOP, width: 12, height: 1, fill: STEEL }, S.rig);
    S.rodStripes = el('g', {}, el('g', { 'clip-path': 'url(#rod)' }, S.rig));
    for (let y = ROD_TOP - 24; y < Y_ROCK + 12; y += 12) el('line', { x1: DX - 8, y1: y + 6, x2: DX + 8, y2: y - 2, stroke: C.white, 'stroke-opacity': 0.55, 'stroke-width': 2.5 }, S.rodStripes);
    S.bit = el('g', {}, S.rig);
    el('rect', { x: -9, y: -BIT_H - 6, width: 18, height: 8, rx: 2, fill: '#6d6d99' }, S.bit);
    el('path', { d: BIT_D, fill: C.ink }, S.bit);
    S.bitStripes = el('g', {}, el('g', { 'clip-path': 'url(#bitc)' }, S.bit));
    for (let y = -BIT_H - 20; y < 16; y += 11) el('line', { x1: -18, y1: y + 9, x2: 18, y2: y - 5, stroke: '#7d7db0', 'stroke-width': 3 }, S.bitStripes);
    // Tête motrice et son voyant
    el('rect', { x: DX - 24, y: MOTOR_Y, width: 48, height: MOTOR_H, rx: 7, fill: C.blue }, S.rig);
    [-12, -6, 0].forEach(dx => el('line', { x1: DX + dx - 4, y1: MOTOR_Y + 9, x2: DX + dx - 4, y2: MOTOR_Y + 21, stroke: C.white, 'stroke-opacity': 0.45, 'stroke-width': 2, 'stroke-linecap': 'round' }, S.rig));
    S.light = el('circle', { cx: DX + 13, cy: MOTOR_Y + 15, r: 5, fill: OFF }, S.rig);
    // Projecteur
    S.lamp = el('g', {}, S.rig);
    el('rect', { x: 2, y: -7, width: 20, height: 14, rx: 3, fill: C.ink }, S.lamp);
    S.lens = el('rect', { x: 19, y: -8.5, width: 6, height: 17, rx: 2, fill: OFF }, S.lamp);
    el('circle', { cx: LAMP[0], cy: LAMP[1], r: 4.5, fill: C.ink }, S.rig);

    // Déblais, étincelles, onde sur la roche
    S.debris = [0, 1, 2, 3, 4, 5, 6, 7].map(() => el('circle', { r: 2.6, fill: '#bfae7c' }, G.fx));
    S.sparks = el('g', {}, G.fx);
    S.sparkLines = [-172, -148, -124, -100, -80, -56, -32, -8].map(a => ({ a: a * Math.PI / 180, n: el('line', { stroke: C.yellow, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.sparks) }));
    S.ring = el('ellipse', { cx: DX, cy: Y_ROCK, rx: 10, ry: 4, fill: 'none', stroke: C.white, 'stroke-width': 3 }, G.fx);

    // ----- Jauge de profondeur -----
    el('line', { x1: RX, y1: GROUND + 4, x2: RX, y2: Y_ROCK, stroke: C.ink, 'stroke-opacity': 0.22, 'stroke-width': 2 }, G.gauge);
    for (let y = GROUND + 16; y < Y_ROCK; y += 16) el('line', { x1: RX, y1: y, x2: RX + 6, y2: y, stroke: C.ink, 'stroke-opacity': 0.22, 'stroke-width': 2 }, G.gauge);
    B.slice(1).forEach(y => el('line', { x1: RX - 6, y1: y, x2: RX + 10, y2: y, stroke: C.ink, 'stroke-opacity': 0.35, 'stroke-width': 2.5 }, G.gauge));
    S.gaugeFill = el('line', { x1: RX, y1: GROUND, x2: RX, y2: GROUND, stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round' }, G.gauge);
    S.cursor = el('path', { d: 'M 0 0 L 11 -7 L 11 7 Z', fill: C.blue }, G.gauge);
    S.marks = MARKS.map(([cy, label, at], i) => {
      const rock = label === 'ok';
      const pend = el('g', {}, G.gauge);
      el('circle', { cx: GX, cy, r: 14, fill: rock ? 'none' : '#fffaf0', stroke: rock ? C.white : '#b9ab80', 'stroke-opacity': rock ? 0.55 : 1, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, pend);
      if (!rock) text(pend, GX, cy + 5.8, label === '!' ? '?' : label, { size: 16, weight: 800, fill: '#9b8d62', anchor: 'middle' });
      const act = el('g', {}, G.gauge);
      el('circle', { cx: GX, cy, r: 15, fill: rock ? C.green : label === '!' ? C.red : C.blue }, act);
      if (rock) el('path', { d: `M ${GX - 6} ${cy + 0.5} L ${GX - 1.5} ${cy + 5} L ${GX + 6.5} ${cy - 4}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, act);
      else text(act, GX, cy + 6, label, { size: 17, weight: 800, fill: C.white, anchor: 'middle' });
      return { pend, act, cy, at, i };
    });

    // ----- Le problème qui remonte -----
    S.bubble = el('g', {}, G.bubble);
    el('circle', { cx: 0, cy: 0, r: 12, fill: C.red }, S.bubble);
    text(S.bubble, 0, 5.5, '!', { size: 16, weight: 800, fill: C.white, anchor: 'middle' });

    // ----- L'action, puis la règle -----
    S.card = el('g', {}, G.cards);
    el('rect', { x: CARD.x, y: CARD.y, width: CARD.w, height: CARD.h, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2, filter: 'url(#lift)' }, S.card);
    fit(text(S.card, CARD.x + 22, CARD.y + 30, 'L’action, presque toujours la même', { size: 15, weight: 700, fill: MUTED }), CARD.x + CARD.w - 16, 'titre action');
    S.ticks = ACTIONS.map((label, i) => {
      const y = CARD.y + 62 + 28 * i;
      const box = el('rect', { x: CARD.x + 22, y: y - 15, width: 19, height: 19, rx: 5, fill: C.white, stroke: MUTED, 'stroke-width': 2 }, S.card);
      const tick = el('path', { d: `M ${CARD.x + 26.5} ${y - 5.5} L ${CARD.x + 30.5} ${y - 1.5} L ${CARD.x + 37} ${y - 9}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.card);
      fit(text(S.card, CARD.x + 54, y, label, { size: 18, weight: 700, fill: C.ink }), CARD.x + CARD.w - 16, `action ${i + 1}`);
      return { box, tick, len: tick.getTotalLength() };
    });
    S.rule = el('g', {}, G.cards);
    el('rect', { x: RULE.x, y: RULE.y, width: RULE.w, height: RULE.h, rx: 16, fill: C.blue, filter: 'url(#lift)' }, S.rule);
    fit(text(S.rule, RULE.x + 24, RULE.y + 33, 'La règle à appliquer', { size: 15, weight: 700, fill: HEAD_SOFT }), RULE.x + RULE.w - 20, 'titre règle');
    S.ruleLines = RULE_LINES.map((str, i) => {
      const n = text(S.rule, RULE.x + 24, RULE.y + 73 + 32 * i, str, { size: 21, weight: 800, fill: C.white });
      fit(n, RULE.x + RULE.w - 20, `règle ${i + 1}`);
      return typed(n);
    });
    S.ruleCaret = el('rect', { x: 0, y: 0, width: 3, height: 24, rx: 1.5, fill: C.white }, S.rule);

    // ----- Compteur de pourquoi -----
    el('rect', { x: COUNTER.x, y: COUNTER.y, width: COUNTER.w, height: COUNTER.h, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, G.header);
    text(G.header, COUNTER.x + 16, COUNTER.y + 21, 'Profondeur', { size: 15, weight: 700, fill: MUTED });
    const dg = el('g', { 'clip-path': 'url(#digit)' }, G.header);
    S.digits = [0, 1].map(() => text(dg, COUNTER.x + 27, COUNTER.y + 46, '4', { size: 23, weight: 800, fill: C.ink, anchor: 'middle' }));
    S.unit = text(G.header, COUNTER.x + 42, COUNTER.y + 46, 'pourquoi', { size: 23, weight: 800, fill: C.ink });
    fit(S.unit, COUNTER.x + COUNTER.w - 44, 'compteur');
    const ic = el('g', { transform: `translate(${COUNTER.x + COUNTER.w - 25} ${COUNTER.y + COUNTER.h / 2})` }, G.header);
    el('circle', { cx: 0, cy: 0, r: 15, fill: C.blue }, ic);
    el('path', { d: 'M -6 -8 H 6 V -1 L 0 8 L -6 -1 Z', fill: C.white }, ic);
    el('line', { x1: -6, y1: -3, x2: 6, y2: -6, stroke: C.blue, 'stroke-width': 1.8 }, ic);

    // ----- Pastilles d'étape -----
    S.pills = PILLS.map(([, label, k]) => {
      const st = k === 'r' ? { bg: C.pRed, fg: C.tRed } : k === 'g' ? { bg: C.pGreen, fg: C.tGreen, icon: true } : { bg: C.blue, fg: C.white };
      const g = pillShape(G.header, 92, PY, label, st);
      fit(g, COUNTER.x - 16, `pastille ${label}`);
      return g;
    });

    D.encart(['Aller jusqu’à la cause', 'Notre article 5 Pourquoi', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const hold = t < T_OUT;                       // image finale
    const pre = t < T_START;                      // image finale, puis rembobinage
    const fo = pre ? 1 - prog(t, T_OUT, 0.28) : 1;
    const s = pre ? END : t;                      // temps de la séquence
    const blink = Math.floor(t / 0.26) % 2 === 0;
    let caret = null;                             // [nœud tapé, couleur] en cours de frappe

    // ----- Foreuse -----
    const tip = tipY(t);
    let shake = 0;
    const ph = prog(t, T_HIT, 0.4);
    if (!pre && ph > 0 && ph < 1) shake += 4 * Math.sin(ph * Math.PI * 7) * (1 - ph);
    const pr = prog(t, T_REV, T_D2 - T_REV + 0.2);
    if (!pre && pr > 0 && pr < 1) shake += 1.6 * Math.sin(t * 90) * Math.sin(Math.PI * pr);
    const pk = prog(t, T_ROCK, 0.35);
    if (!pre && pk > 0 && pk < 1) shake += 3 * Math.sin(pk * Math.PI * 6) * (1 - pk);
    S.rig.setAttribute('transform', shake ? `translate(${f2(shake)} 0)` : '');
    const bitTop = tip - BIT_H;
    S.rod.setAttribute('height', f2(Math.max(0.01, bitTop - ROD_TOP)));
    S.rodClip.setAttribute('height', f2(Math.max(0.01, bitTop - ROD_TOP)));
    S.bit.setAttribute('transform', `translate(${DX} ${f2(tip)})`);
    const spin = spinTime(pre ? END : t) * 60;
    S.rodStripes.setAttribute('transform', `translate(0 ${f2(spin % 12)})`);
    S.bitStripes.setAttribute('transform', `translate(0 ${f2(spin % 11)})`);
    // Voyant : rouge à l'arrêt sur la couche, vert quand elle tourne
    const stopped = !pre && t >= T_HIT && t < T_REV;
    const running = !pre && (drilling(t) || (t >= T_REV && t < T_D2));
    S.light.setAttribute('fill', stopped ? C.red : running ? C.green : OFF);

    // Trou
    const depth = Math.max(0, tip - GROUND);
    S.holeRect.setAttribute('height', f2(Math.max(0.01, depth)));
    S.holeWalls.forEach(n => n.setAttribute('y2', f2(GROUND + depth)));
    vis(S.holeRect, depth > 0.5 ? 1 : 0);
    S.holeWalls.forEach(n => vis(n, depth > 0.5 ? 1 : 0));

    // Déblais qui remontent le long de la tige pendant le forage
    const dOn = !pre && drilling(t);
    const layerIdx = B.findIndex((b, i) => i + 1 < B.length && tip >= b && tip < B[i + 1]);
    S.debris.forEach((n, k) => {
      if (!dOn || depth < 8) { vis(n, 0); return; }
      const u = frac(t * 2.1 + k / S.debris.length);
      const side = k % 2 ? 1 : -1;
      const y = tip - 18 - 70 * u;
      if (y < GROUND + 4) { vis(n, 0); return; }
      n.setAttribute('cx', f2(DX + side * (16.5 + 1.5 * Math.sin(u * 9 + k))));
      n.setAttribute('cy', f2(y));
      n.setAttribute('fill', LAYERS[Math.max(0, layerIdx)].peb);
      vis(n, 1 - u);
    });
    // Étincelles à l'arrêt net
    const ps = prog(t, T_HIT, 0.32);
    if (!pre && ps > 0 && ps < 1) {
      vis(S.sparks, 1 - ps);
      S.sparkLines.forEach(({ a, n }, k) => {
        const r0 = 6 + 18 * easeOut(ps), r1 = r0 + 7 + (k % 3) * 3;
        n.setAttribute('x1', f2(DX + r0 * Math.cos(a))); n.setAttribute('y1', f2(Y_HIT + r0 * Math.sin(a)));
        n.setAttribute('x2', f2(DX + r1 * Math.cos(a))); n.setAttribute('y2', f2(Y_HIT + r1 * Math.sin(a)));
      });
    } else vis(S.sparks, 0);
    // Onde sur la roche
    const pw = prog(t, T_ROCK, 0.55);
    if (!pre && pw > 0 && pw < 1) {
      S.ring.setAttribute('rx', f2(12 + 70 * easeOut(pw)));
      S.ring.setAttribute('ry', f2(4 + 12 * easeOut(pw)));
      vis(S.ring, 1 - pw);
    } else vis(S.ring, 0);

    // Fissures de la couche « erreur opérateur »
    S.cracks.forEach((c, k) => {
      const p = pre ? 1 : easeOut(prog(t, T_D2 + 0.06 + 0.05 * k, 0.4));
      if (p >= 1) c.n.removeAttribute('stroke-dasharray');
      else { c.n.setAttribute('stroke-dasharray', f2(c.len)); c.n.setAttribute('stroke-dashoffset', f2(c.len * (1 - p))); }
      vis(c.n, pre ? fo : p > 0 ? 1 : 0);
    });
    // Éclats projetés quand la foreuse brise la couche
    S.chunks.forEach(c => {
      const u = t - T_D2 - 0.08 - c.delay;
      if (pre || u <= 0 || u > 0.62) { vis(c.g, 0); return; }
      const x = DX + c.side * (18 + c.vx * u), y = Y_HIT + 8 - c.vy * u + 380 * u * u;
      c.g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(c.spin * u)})`);
      vis(c.g, 1 - prog(u, 0.45, 0.17));
    });
    // La roche s'éclaire
    S.rockLines.forEach(r => {
      const p = pre ? 1 : easeOut(prog(t, T_ROCK, 0.6));
      if (p >= 1) r.n.removeAttribute('stroke-dasharray');
      else { r.n.setAttribute('stroke-dasharray', f2(r.len)); r.n.setAttribute('stroke-dashoffset', f2(r.len * (1 - p))); }
      vis(r.n, pre ? fo : p > 0 ? 1 : 0);
    });

    // ----- Jauge -----
    S.gaugeFill.setAttribute('y2', f2(Math.max(GROUND + 0.01, tip)));
    vis(S.gaugeFill, depth > 0.5 ? 1 : 0);
    S.cursor.setAttribute('transform', `translate(${RX + 3} ${f2(Math.max(GROUND, tip))})`);
    S.marks.forEach(m => {
      let a;
      if (hold) a = 1;
      else if (pre) a = 1 - prog(t, T_OUT + 0.08, 0.25);
      else a = prog(t, m.at, 0.3);
      const k = pre ? 1 : popScale(a);
      vis(m.act, pre ? a : clamp(a / 0.4));
      scaleAt(m.act, GX, m.cy, k);
      vis(m.pend, pre ? 1 - a : 1 - clamp(a / 0.4));
    });

    // ----- Compteur de pourquoi -----
    let from = 4, to = 4, rp = 1;
    for (const [te, a, b] of ROLLS) if (!hold && t >= te) { from = a; to = b; rp = prog(t, te, ROLL); }
    const rollE = easeInOut(rp);
    const [d0, d1] = S.digits;
    d0.textContent = String(from); d1.textContent = String(to);
    const DY = COUNTER.y + 46;
    if (rp >= 1) { vis(d0, 0); d1.setAttribute('y', DY); vis(d1, 1); }
    else {
      const dir = to > from ? 1 : -1;
      d0.setAttribute('y', f2(DY - dir * 30 * rollE)); vis(d0, 1);
      d1.setAttribute('y', f2(DY + dir * 30 * (1 - rollE))); vis(d1, 1);
    }
    const cCol = (hold || (!pre && t >= T_ROCK)) ? C.tGreen : (!pre && t >= T_HIT && t < T_D2) ? C.tRed : C.ink;
    [d0, d1, S.unit].forEach(n => n.setAttribute('fill', cCol));

    // ----- Étiquettes des couches -----
    S.q.forEach((q, k) => {
      if (pre) { showTyped(q, 999); vis(q.n, fo); return; }
      const n = Math.floor((t - T_Q[k]) * CPS);
      showTyped(q, n);
      vis(q.n, n > 0 ? 1 : 0);
      if (n > -4 && n < q.full.length + 6) caret = [q.n, C.blue, 19, n < q.full.length || blink];
    });
    // Couche « erreur opérateur » : l'étiquette tombe, la citation se tape
    const pc = pre ? 1 : prog(t, T_CHIP, 0.35);
    vis(S.cChip, pre ? fo : clamp(pc / 0.4));
    scaleAt(S.cChip, S.cChipC[0], S.cChipC[1], pre ? 1 : popScale(pc));
    if (pre) { showTyped(S.quote, 999); vis(S.quote.n, fo); }
    else {
      const n = Math.floor((t - T_QUOTE) * 80);
      showTyped(S.quote, n);
      vis(S.quote.n, n > 0 ? 1 : 0);
      if (n > -4 && n < S.quote.full.length + 6) caret = [S.quote.n, C.blue, 18, n < S.quote.full.length || blink];
    }
    const pn = pre ? 1 : prog(t, T_NOTE, 0.35);
    vis(S.note, pre ? fo : pn);
    S.note.setAttribute('transform', pn >= 1 ? '' : `translate(0 ${f2(8 * (1 - easeOut(pn)))})`);
    // La roche : titre, puis les causes une à une
    const pt = pre ? 1 : prog(t, T_ROCK + 0.15, 0.3);
    vis(S.rockTitle, pre ? fo : pt);
    S.rockTitle.setAttribute('transform', pt >= 1 ? '' : `translate(0 ${f2(8 * (1 - easeOut(pt)))})`);
    S.chips.forEach((c, k) => {
      const p = pre ? 1 : prog(t, T_CHIPS + CHIP_STEP * k, 0.35);
      vis(c.g, pre ? fo : clamp(p / 0.4));
      scaleAt(c.g, c.cx, c.cy, pre ? 1 : popScale(p));
    });
    // Curseur de frappe
    if (caret && caret[3]) {
      const [node, col, size] = caret;
      const b = node.textContent ? node.getBBox() : null;
      S.caret.setAttribute('x', f2((b ? b.x + b.width : Number(node.getAttribute('x'))) + 3));
      S.caret.setAttribute('y', f2(Number(node.getAttribute('y')) - size * 0.82));
      S.caret.setAttribute('height', f2(size * 1.05));
      S.caret.setAttribute('fill', col);
      vis(S.caret, 1);
    } else vis(S.caret, 0);

    // ----- Surface : la pièce, l'alerte, les opérateurs -----
    let al = 0, ak = 1, adx = 0;
    if (pre) al = fo;
    else if (t < T_FIX) { const p = prog(t, T_ALERT, 0.35); al = clamp(p / 0.4); ak = popScale(p); }
    else if (t < T_BACK) { const p = prog(t, T_FIX, 0.22); al = 1 - p; ak = 1 - 0.4 * easeIn(p); }
    else {
      const p = prog(t, T_BACK, 0.4); al = clamp(p / 0.3); ak = p >= 1 ? 1 : 0.5 + 0.5 * back(p) + 0.15 * Math.sin(Math.PI * p);
      const q = prog(t, T_BACK + 0.15, 0.4); if (q > 0 && q < 1) adx = 4 * Math.sin(q * Math.PI * 6) * (1 - q);
    }
    vis(S.alert, al);
    scaleAt(S.alert, PART_X, 547, ak, adx ? `translate(${f2(adx)} 0)` : '');
    S.part.setAttribute('stroke', al > 0.5 ? C.red : C.ink);
    S.part.setAttribute('stroke-width', al > 0.5 ? 2.5 : 2);

    // Opérateur 1 (au départ) puis opérateur 2 (quand le problème revient)
    const [op1, op2] = S.ops;
    let o1, x1 = OP_X, o2, x2 = OP_X, y2 = 0;
    if (pre) { o2 = 1 - prog(t, T_OUT, 0.25); o1 = prog(t, T_OUT + 0.12, 0.28); }
    else {
      const pout = prog(t, T_OP_OUT, 0.3);
      o1 = 1 - pout; x1 = OP_X + 34 * easeIn(pout);
      const pin = prog(t, T_OP_IN, 0.36);
      o2 = clamp(pin / 0.5); x2 = OP_X + 40 * (1 - easeOut(pin));
      if (pin > 0 && pin < 1) y2 = -3.5 * Math.abs(Math.sin(pin * Math.PI * 3));
    }
    vis(op1, o1); op1.setAttribute('transform', `translate(${f2(x1)} ${GROUND})`);
    vis(op2, o2); op2.setAttribute('transform', `translate(${f2(x2)} ${f2(GROUND + y2)})`);

    // Projecteur : se braque sur l'opérateur, puis s'éteint
    const A_IDLE = 65, A_AIM = Math.atan2(600 - LAMP[1], OP_X - LAMP[0]) * 180 / Math.PI;
    let ang = A_IDLE;
    if (!pre) {
      const pa = prog(t, T_LAMP, 0.3), pb = prog(t, T_FIX + 0.1, 0.3);
      ang = lerp(A_IDLE, A_AIM, pa <= 0 ? 0 : pa >= 1 ? 1 : back(pa)) + (A_IDLE - A_AIM) * easeInOut(pb);
    }
    S.lamp.setAttribute('transform', `translate(${LAMP[0]} ${LAMP[1]}) rotate(${f2(ang)})`);
    let bo = 0;
    if (!pre && t >= T_BEAM) {
      bo = prog(t, T_BEAM, 0.06) * (1 - prog(t, T_FIX, 0.15));
      if (t > T_BEAM + 0.08 && t < T_BEAM + 0.13) bo *= 0.35;   // petit clignement à l'allumage
    }
    S.lens.setAttribute('fill', bo > 0.02 ? C.yellow : OFF);
    if (vis(S.beam, bo)) {
      const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      const P = (lx, ly) => [LAMP[0] + lx * ca - ly * sa, LAMP[1] + lx * sa + ly * ca];
      const m1 = P(25, -7), m2 = P(25, 7);
      S.beamPoly.setAttribute('d', `M ${f2(m1[0])} ${f2(m1[1])} L ${OP_X - 36} 566 L ${OP_X + 44} ${GROUND} L ${f2(m2[0])} ${f2(m2[1])} Z`);
    }

    // Le problème remonte de la couche jusqu'à la pièce
    const pu = prog(t, T_BUBBLE, BUBBLE);
    if (!pre && pu > 0 && pu < 1) {
      let bx, by;
      if (pu < 0.55) { const q = easeInOut(pu / 0.55); bx = 241 + 2 * Math.sin(q * 12); by = lerp(Y_HIT - 6, GROUND - 14, q); }
      else {
        const q = easeOut((pu - 0.55) / 0.45), P0 = [241, GROUND - 14], P1 = [262, 556], P2 = [PART_X, PART_Y - 14];
        bx = (1 - q) * (1 - q) * P0[0] + 2 * (1 - q) * q * P1[0] + q * q * P2[0];
        by = (1 - q) * (1 - q) * P0[1] + 2 * (1 - q) * q * P1[1] + q * q * P2[1];
      }
      S.bubble.setAttribute('transform', `translate(${f2(bx)} ${f2(by)}) scale(${f2(0.7 + 0.3 * pu)})`);
      vis(S.bubble, clamp(pu / 0.1) * (1 - prog(pu, 0.9, 0.1)));
    } else vis(S.bubble, 0);

    // ----- L'action (cases cochées), puis la règle -----
    let co = 0, ck = 1, cdx = 0;
    if (!pre) {
      const pin = prog(t, T_CARD, 0.35), pout = prog(t, T_CARD_OUT, 0.28);
      co = clamp(pin / 0.4) * (1 - 0.55 * prog(t, T_DIM, 0.25)) * (1 - pout);
      ck = popScale(pin);
      cdx = 30 * easeIn(pout);
    }
    if (vis(S.card, co)) {
      scaleAt(S.card, CARD.x + CARD.w / 2, CARD.y + CARD.h / 2, ck, cdx ? `translate(${f2(cdx)} 0)` : '');
      S.ticks.forEach((k, i) => {
        const p = prog(t, T_TICK[i], 0.25);
        k.box.setAttribute('fill', p > 0 ? C.green : C.white);
        k.box.setAttribute('stroke', p > 0 ? C.green : MUTED);
        if (p >= 1) k.tick.removeAttribute('stroke-dasharray');
        else { k.tick.setAttribute('stroke-dasharray', f2(k.len)); k.tick.setAttribute('stroke-dashoffset', f2(k.len * (1 - easeOut(p)))); }
        vis(k.tick, p > 0 ? 1 : 0);
      });
    }
    let ro, rk = 1;
    if (pre) ro = fo;
    else { const p = prog(t, T_RULE, 0.35); ro = clamp(p / 0.4); rk = popScale(p); }
    if (vis(S.rule, ro)) {
      scaleAt(S.rule, RULE.x + RULE.w / 2, RULE.y + RULE.h / 2, rk);
      let n = pre ? 999 : Math.floor((t - T_RULE_TYPE) * RULE_CPS);
      let last = null, typing = false;
      S.ruleLines.forEach(l => {
        const k = clamp(n, 0, l.full.length);
        showTyped(l, k);
        vis(l.n, k > 0 ? 1 : 0);
        if (k > 0 || !last) last = l.n;
        n -= l.full.length;
      });
      const total = RULE_LINES.join('').length, nn = pre ? 999 : Math.floor((t - T_RULE_TYPE) * RULE_CPS);
      typing = !pre && nn > -4 && nn < total + 8;
      if (typing && (nn < total || blink)) {
        const b = last.textContent ? last.getBBox() : null;
        S.ruleCaret.setAttribute('x', f2((b ? b.x + b.width : RULE.x + 24) + 3));
        S.ruleCaret.setAttribute('y', f2(Number(last.getAttribute('y')) - 19));
        vis(S.ruleCaret, 1);
      } else vis(S.ruleCaret, 0);
    }

    // ----- Pastilles d'étape : l'ancienne sort avant que la nouvelle entre -----
    S.pills.forEach((g, i) => {
      const a = PILLS[i][0] + (i ? 0.12 : 0);
      const nxt = i + 1 < PILLS.length ? PILLS[i + 1][0] : Infinity;
      const last = i === PILLS.length - 1;
      const o = pre ? (last ? 1 - prog(t, T_OUT, 0.2) : 0) : prog(t, a, 0.25) * (1 - prog(t, nxt, 0.14));
      const dy = pre ? 0 : 8 * (1 - prog(t, a, 0.25));
      vis(g, o);
      g.setAttribute('transform', dy > 0.01 ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
