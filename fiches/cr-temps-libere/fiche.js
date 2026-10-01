// Fiche LinkedIn · Clément Raymond · mercredi 7 octobre 2026
// Post : « Réduire les gaspillages ne veut pas dire réduire les effectifs. »
// Premier commentaire du post (Buffer) : guide complet des 8 gaspillages → encart.
// Le visuel est la pièce maîtresse : un flux façon Sankey. Trois tâches inutiles (attente, déplacement,
// ressaisie) sont retirées ; le temps qu'elles libèrent coule en particules jusqu'à un aiguillage, chiffré
// 35 h par semaine. La lame bascule vers « Supprimer une personne » : le flux réduit l'effectif et le
// compteur des gaspillages signalés s'éteint jusqu'à 0. Elle bascule vers « Temps libéré annoncé » : le flux
// se répartit (volume, amélioration, formation, polyvalence) et le compteur monte. Même chiffrage au départ.
// Style propre : l'aiguillage du temps libéré (rubans qui se remplissent, particules, lame qui bascule).
// Image t = 0 = état final. Boucle exacte de 12,5 s (particules périodiques de 2,5 s).
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const backTo = p => (p <= 0 ? 0 : p >= 1 ? 1 : back(p));
  const frac = v => v - Math.floor(v);
  const rnd = i => frac(Math.sin(i * 12.9898 + 4.1414) * 43758.5453);
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => {
    if (p <= 0) return a;
    if (p >= 1) return b;
    const A = hex(a), B = hex(b);
    return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(',')})`;
  };
  const NB = ' ';

  // Un élément invisible passe en display="none" (rendu stable d'une image à l'autre)
  function show(n, o) {
    if (o <= 0.001) { n.setAttribute('display', 'none'); return false; }
    n.removeAttribute('display');
    n.setAttribute('opacity', o >= 0.999 ? 1 : f2(o));
    return true;
  }
  function scaleAt(n, cx, cy, k, extra = '') {
    if (k === 1 && !extra) n.removeAttribute('transform');
    else n.setAttribute('transform', `${extra}${k === 1 ? '' : ` translate(${f2(cx)} ${f2(cy)}) scale(${f2(k)}) translate(${f2(-cx)} ${f2(-cy)})`}`.trim());
  }

  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', DASH = '#b6b6d4';
  const TINT = '#c8d7f0', TINT_R = '#f7cccc', TINT_G = '#cde8bf', GHOST = '#e6e6f1';
  const IDLE = '#c9c9dd', OFF_BG = '#dcdce8', OFF_INK = '#a4a4c0', RED_SOFT = '#eaa3a3';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const K = 2;                                        // px par heure libérée et par semaine
  const HUB = { x: 480, y: 800, r: 46 };
  const TX0 = 380;                                    // entrée du tronc
  const SRC = { x: 92, w: 172, h: 128, ys: [528, 736, 944] };
  const SRC_R = SRC.x + SRC.w;
  const BX = 660;                                     // bord gauche des deux cartes de droite
  const B1 = { x: BX, y: 496, w: 328, h: 232 };
  const B2 = { x: BX, y: 752, w: 328, h: 374 };
  const B1_Y = 590;
  const TL = { x: 388, y: 924, w: 168, h: 202 };   // carte du chiffrage
  const ROWS_Y = [814, 868, 922, 976], ROW_H = 44;
  const BAR_K = 40 / 24;                              // px par gaspillage signalé (même échelle des deux côtés)

  const TASKS = [
    { key: 'attente', name: 'Attente', h: 14 },
    { key: 'deplacement', name: 'Déplacement', h: 9 },
    { key: 'ressaisie', name: 'Ressaisie', h: 12 },
  ];
  const TOTAL = TASKS.reduce((a, b) => a + b.h, 0);  // 35 h
  const USES = [
    { key: 'volume', name: 'Plus de volume', h: 12 },
    { key: 'amelioration', name: 'Plus d’amélioration', h: 9 },
    { key: 'formation', name: 'De la formation', h: 8 },
    { key: 'polyvalence', name: 'De la polyvalence', h: 6 },
  ];
  const BARS1 = [12, 8, 4, 1, 0];                     // gaspillages signalés par mois
  const BARS2 = [12, 15, 18, 21, 24];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, P = 2.5;                     // P : traversée d'une particule (12,5 / 2,5 = 5)
  const T_OUT = 1.2, OUT_DUR = 0.3;
  const PILLS = [
    [1.55, `1${NB}·${NB}Retirer les tâches inutiles`, 'b'],
    [3.75, `2${NB}·${NB}Chiffrer le temps libéré`, 'b'],
    [4.95, `3${NB}·${NB}Aiguillage${NB}: supprimer une personne`, 'r'],
    [8.0, `4${NB}·${NB}Aiguillage${NB}: annoncer le temps libéré`, 'g'],
    [10.95, 'Même chiffrage, effet opposé', 'i'],
  ];
  const T_CARD = [1.6, 1.7, 1.8];
  const T_HUB = 1.9;
  const T_RM = [2.15, 2.5, 2.85];                     // chaque tâche est retirée
  const FILL = 0.6;                                   // le ruban se remplit jusqu'à l'aiguillage
  const T_PULSE = 3.98;
  const T_GHOST = 4.1, T_B1C = 4.22, T_B2C = 4.34, T_CHIPS = 4.55;
  const T_SW1 = 5.05, SW = 0.4;
  const T_B1_ON = 5.3, T_PERSON = 5.95;
  const T_BARS1 = [0, 6.7, 7.0, 7.3, 7.6], T_OFF = 7.9;
  const T_B1_DRAIN = 8.05, T_SW2 = 8.15, T_ANN = 8.45;
  const T_B2_ON = 8.6;
  const T_BARS2 = [0, 9.55, 9.85, 10.15, 10.45];

  // ---------- Géométrie des rubans ----------
  function cubicPts(x0, y0, x1, y1, n = 40) {
    const xm = (x0 + x1) / 2, pts = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3;
      pts.push([a * x0 + (b + c) * xm + d * x1, (a + b) * y0 + (c + d) * y1]);
    }
    return pts;
  }
  function ribbonD(x0, y0, x1, y1, th, tail = 0) {
    const xm = (x0 + x1) / 2, a0 = y0 - th / 2, a1 = y1 - th / 2, b0 = y0 + th / 2, b1 = y1 + th / 2, xe = x1 + tail;
    return `M ${x0} ${f2(a0)} C ${xm} ${f2(a0)}, ${xm} ${f2(a1)}, ${x1} ${f2(a1)} L ${xe} ${f2(a1)} L ${xe} ${f2(b1)} L ${x1} ${f2(b1)} C ${xm} ${f2(b1)}, ${xm} ${f2(b0)}, ${x0} ${f2(b0)} Z`;
  }
  const edgeD = (x0, y0, x1, y1) => { const xm = (x0 + x1) / 2; return `M ${x0} ${f2(y0)} C ${xm} ${f2(y0)}, ${xm} ${f2(y1)}, ${x1} ${f2(y1)}`; };
  let seedN = 0;
  function makeLane(pts, th, n) {
    const seed = ++seedN;
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const offs = [...Array(n)].map((_, k) => (rnd(seed * 31 + k * 7 + 1) - 0.5) * (th - 10));
    const ph = [...Array(n)].map((_, k) => (k + 0.2 + 0.6 * rnd(seed * 17 + k * 3 + 2)) / n);
    return { pts, cum, len: cum[cum.length - 1], th, n, offs, ph, x0: pts[0][0], x1: pts[pts.length - 1][0] };
  }
  function at(L, u) {
    const d = u * L.len;
    let i = 1;
    while (i < L.cum.length - 1 && L.cum[i] < d) i++;
    const p = (d - L.cum[i - 1]) / ((L.cum[i] - L.cum[i - 1]) || 1);
    return [lerp(L.pts[i - 1][0], L.pts[i][0], p), lerp(L.pts[i - 1][1], L.pts[i][1], p)];
  }
  function yAtX(L, x) {
    for (let i = 1; i < L.pts.length; i++) if (L.pts[i][0] >= x) {
      const a = L.pts[i - 1], b = L.pts[i];
      return lerp(a[1], b[1], (x - a[0]) / ((b[0] - a[0]) || 1));
    }
    return L.pts[L.pts.length - 1][1];
  }

  // Lanes : trois sources (jusqu'au centre de l'aiguillage), une branche « personne », quatre branches « annoncé »
  const TOP = HUB.y - TOTAL * K / 2;
  let acc = TOP;
  const SRC_LANES = TASKS.map((tk, i) => {
    const th = tk.h * K, slot = acc + th / 2;
    acc += th;
    const cy = SRC.ys[i] + SRC.h / 2;
    const pts = cubicPts(SRC_R, cy, TX0, slot).concat([[HUB.x, slot]]);
    const L = makeLane(pts, th, Math.round(tk.h * 0.62));
    L.d = ribbonD(SRC_R, cy, TX0, slot, th, HUB.x - TX0);
    return L;
  });
  const LANE1 = makeLane(cubicPts(HUB.x, HUB.y, BX, B1_Y), TOTAL * K, 20);
  LANE1.d = ribbonD(HUB.x, HUB.y, BX, B1_Y, TOTAL * K);
  acc = TOP;
  const LANES2 = USES.map((u, j) => {
    const th = u.h * K, slot = acc + th / 2;
    acc += th;
    const cy = ROWS_Y[j] + ROW_H / 2;
    const L = makeLane(cubicPts(HUB.x, slot, BX, cy), th, Math.max(3, Math.round(u.h * 0.62)));
    L.d = ribbonD(HUB.x, slot, BX, cy, th);
    L.slot = slot; L.cy = cy;
    return L;
  });

  // ---------- Pictos (blancs, repère centré) ----------
  const W2 = { fill: 'none', stroke: C.white, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const ICONS = {
    attente(g) {
      el('path', { d: 'M -6.5 -9.5 H 6.5 M -6.5 9.5 H 6.5', ...W2, 'stroke-width': 2.6 }, g);
      el('path', { d: 'M -5 -9 C -5 -3, -1.2 -2, -1.2 0 C -1.2 2, -5 3, -5 9 H 5 C 5 3, 1.2 2, 1.2 0 C 1.2 -2, 5 -3, 5 -9 Z', ...W2, 'stroke-width': 2.2 }, g);
      el('path', { d: 'M -3.4 8 L 3.4 8 L 0 4 Z', fill: C.white }, g);
    },
    deplacement(g) {
      el('path', { d: 'M -9.5 8.5 C -9.5 -3, 7 5, 7 -6', ...W2, 'stroke-width': 2.6, 'stroke-dasharray': '3.2 3.6' }, g);
      el('path', { d: 'M 2 -8.5 L 7.5 -7 L 7.5 -1.5', ...W2, 'stroke-width': 2.6 }, g);
    },
    ressaisie(g) {
      el('rect', { x: -9, y: -10.5, width: 12.5, height: 15.5, rx: 2.5, ...W2, 'stroke-width': 2.3 }, g);
      el('rect', { x: -3.5, y: -5, width: 12.5, height: 15.5, rx: 2.5, fill: C.blue, stroke: C.white, 'stroke-width': 2.3 }, g);
      [0, 4].forEach(y => el('line', { x1: -0.5, y1: y, x2: 6, y2: y, stroke: C.white, 'stroke-width': 1.8, 'stroke-linecap': 'round' }, g));
    },
    moins(g) {
      el('circle', { cx: -3, cy: -5, r: 4.6, fill: C.white }, g);
      el('path', { d: 'M -11 8.5 C -11 0.5, 5 0.5, 5 8.5 Z', fill: C.white }, g);
      el('line', { x1: 6.5, y1: -4, x2: 12, y2: -4, stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round' }, g);
    },
    megaphone(g) {
      el('path', { d: 'M -9 -3.5 H -3 L 6 -9.5 V 9.5 L -3 3.5 H -9 Z', fill: C.white, stroke: C.white, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
      el('path', { d: 'M -5.5 4 L -3.5 9.5', ...W2, 'stroke-width': 3 }, g);
      el('path', { d: 'M 9.5 -4 C 11.5 -1.5, 11.5 1.5, 9.5 4', ...W2, 'stroke-width': 2.2 }, g);
    },
    volume(g) {
      [[-8, -0.5], [0.5, -0.5], [-3.75, -8.5]].forEach(([x, y]) => el('rect', { x, y, width: 7.5, height: 7, rx: 1.6, fill: C.white }, g));
    },
    amelioration(g) {
      el('path', { d: 'M -8 6 L -3 0.5 L 0.5 3.5 L 7.5 -4.5', ...W2, 'stroke-width': 2.6 }, g);
      el('path', { d: 'M 2.5 -5 H 8 V 0.5', ...W2, 'stroke-width': 2.6 }, g);
    },
    formation(g) {
      el('path', { d: 'M -9.5 -2.5 L 0 -7.5 L 9.5 -2.5 L 0 2.5 Z', fill: C.white }, g);
      el('path', { d: 'M -5.5 0.5 V 4.5 C -2 7.5, 2 7.5, 5.5 4.5 V 0.5', fill: C.white }, g);
      el('path', { d: 'M 8 -1.5 V 4.5', ...W2, 'stroke-width': 1.8 }, g);
    },
    polyvalence(g) {
      el('path', { d: 'M -6 4.5 L 6 4.5 L 0 -5.5 Z', ...W2, 'stroke-width': 1.8 }, g);
      [[-6, 4.5], [6, 4.5], [0, -5.5]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 3.3, fill: C.white }, g));
    },
  };
  const icon = (parent, key, cx, cy, k = 1) => ICONS[key](el('g', { transform: `translate(${cx} ${cy})${k !== 1 ? ` scale(${k})` : ''}` }, parent));

  function person(parent, x, cy, attrs) {
    const g = el('g', { transform: `translate(${x} ${cy})` }, parent);
    el('circle', { cx: 0, cy: -9, r: 7, ...attrs }, g);
    el('path', { d: 'M -11 13 C -11 0.5, 11 0.5, 11 13 Z', ...attrs }, g);
    return g;
  }
  function pillShape(parent, x, cy, label, { bg, fg, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const tx = text(g, x + 20, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40);
    return g;
  }

  // Afficheur à rouleaux (deux chiffres) : les chiffres défilent comme un compteur mécanique
  const DIG = 40;
  function odometer(parent, cx, cy, id) {
    const g = el('g', {}, parent);
    el('rect', { x: cx - 39, y: cy - 23, width: 78, height: 46, rx: 11, fill: OFF_BG }, g);
    const lit = el('rect', { x: cx - 39, y: cy - 23, width: 78, height: 46, rx: 11, fill: C.ink }, g);
    const cp = el('clipPath', { id }, S.defs);
    el('rect', { x: cx - 37, y: cy - 21, width: 74, height: 42, rx: 9 }, cp);
    const win = el('g', { 'clip-path': `url(#${id})` }, g);
    const strips = [cx - 11.5, cx + 11.5].map(x => {
      const sg = el('g', {}, win);
      const nodes = [];
      for (let d = 0; d <= 10; d++) {
        const n = text(sg, x, cy + 11 + d * DIG, String(d % 10), { size: 30, weight: 800, fill: C.white, anchor: 'middle' });
        fit(n, cx + 38, `${id} chiffre`, cx - 38);
        nodes.push(n);
      }
      return { sg, nodes };
    });
    let lastCol = null;
    return {
      g,
      set(v, col, litO) {
        const units = ((v % 10) + 10) % 10, tens = Math.floor(v / 10 + 1e-9) + clamp(units - 9);
        [tens, units].forEach((p, k) => {
          const dy = -p * DIG;
          if (Math.abs(dy) < 1e-4) strips[k].sg.removeAttribute('transform');
          else strips[k].sg.setAttribute('transform', `translate(0 ${f2(dy)})`);
        });
        if (col !== lastCol) { strips.forEach(s => s.nodes.forEach(n => n.setAttribute('fill', col))); lastCol = col; }
        const td = 0.3 + 0.7 * clamp(tens);
        strips[0].sg.setAttribute('opacity', td >= 0.999 ? 1 : f2(td));
        show(lit, litO);
      },
    };
  }

  const S = { src: [], rows: [] };

  function build() {
    D.template({ author: 'clement' });
    D.title('Le temps libéré,', 'décidez où il va.');
    D.chapeau('Réduire les gaspillages ne veut pas dire réduire les effectifs.');

    // Explication courte au-dessus du visuel : comment le lire
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Le flux, c’est le ', 0], ['temps libéré', C.blue], [' par les tâches inutiles qu’on retire.', 0]]);
    line(384, [['Selon l’', 0], ['aiguillage', C.blue], [', le compteur des gaspillages signalés ', 0], ['s’éteint', C.tRed], [' ou ', 0], ['monte', C.tGreen], ['.', 0]]);

    S.defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-60%', y: '-60%', width: '220%', height: '220%' }, S.defs);
    el('feDropShadow', { dx: 0, dy: 6, stdDeviation: 4, 'flood-color': C.ink, 'flood-opacity': 0.25 }, lift);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    S.scene = el('g');
    const L_ghost = el('g', {}, S.scene);
    const L_tint = el('g', {}, S.scene);
    const L_dots = el('g', {}, S.scene);
    const L_top = el('g', {}, S.scene);

    // Rubans : chaque ruban a sa fenêtre de remplissage (clip en x, de xa à xb)
    let cid = 0;
    const clipped = (parent, d, fill) => {
      const id = `rb${cid++}`;
      const cp = el('clipPath', { id }, S.defs);
      const r = el('rect', { x: 0, y: FRAME.y, width: 0, height: FRAME.h }, cp);
      const n = el('path', { d, fill, 'clip-path': `url(#${id})` }, parent);
      return { n, r };
    };
    const dotsFor = L => {
      const g = el('g', {}, L_dots);
      L.dots = L.ph.map(() => el('circle', { cx: 0, cy: 0, r: 3.3, fill: C.blue }, g));
      L.dg = g;
    };
    // Fantômes des deux branches (même épaisseur : même chiffrage), bords pointillés pour la branche « personne »
    S.ghost = el('g', {}, L_ghost);
    const gcp = el('clipPath', { id: 'ghost' }, S.defs);
    S.ghostClip = el('rect', { x: HUB.x, y: FRAME.y, width: 0, height: FRAME.h }, gcp);
    S.ghost.setAttribute('clip-path', 'url(#ghost)');
    el('path', { d: LANE1.d, fill: GHOST }, S.ghost);
    LANES2.forEach(L => el('path', { d: L.d, fill: GHOST }, S.ghost));
    S.ghostEdges = el('g', {}, S.ghost);
    [-1, 1].forEach(sg => el('path', { d: edgeD(HUB.x, HUB.y + sg * TOTAL * K / 2, BX, B1_Y + sg * TOTAL * K / 2), fill: 'none', stroke: DASH, 'stroke-width': 2.2, 'stroke-dasharray': '8 6' }, S.ghostEdges));

    SRC_LANES.forEach(L => { Object.assign(L, clipped(L_tint, L.d, TINT)); dotsFor(L); });
    Object.assign(LANE1, clipped(L_tint, LANE1.d, TINT_R)); dotsFor(LANE1);
    LANES2.forEach(L => { Object.assign(L, clipped(L_tint, L.d, TINT_G)); dotsFor(L); });

    // ----- Les trois tâches inutiles -----
    TASKS.forEach((tk, i) => {
      const x0 = SRC.x, y0 = SRC.ys[i], w = SRC.w, h = SRC.h;
      const g = el('g', {}, L_top);
      const solid = el('rect', { x: x0, y: y0, width: w, height: h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
      const ghost = el('rect', { x: x0 + 1, y: y0 + 1, width: w - 2, height: h - 2, rx: 17, fill: FRAME_BG, stroke: DASH, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, g);
      const content = el('g', {}, g);
      el('circle', { cx: x0 + 38, cy: y0 + 38, r: 21, fill: C.blue }, content);
      icon(content, tk.key, x0 + 38, y0 + 38, 1.15);
      const nm = text(content, x0 + 18, y0 + 88, tk.name, { size: 19, weight: 800, fill: C.ink });
      fit(nm, x0 + w - 12, `tâche ${i + 1}`);
      const nw = nm.getBBox().width;
      const sLen = nw + 10;
      const strike = el('line', { x1: x0 + 13, y1: y0 + 82, x2: x0 + 23 + nw, y2: y0 + 82, stroke: C.red, 'stroke-width': 2.8, 'stroke-linecap': 'round' }, g);
      const before = text(g, x0 + 18, y0 + 113, `${tk.h}${NB}h${NB}/${NB}semaine`, { size: 16, weight: 700, fill: C.tRed });
      const after = text(g, x0 + 18, y0 + 113, `${tk.h}${NB}h libérées`, { size: 16, weight: 700, fill: C.blue });
      fit(before, x0 + w - 12, `tâche ${i + 1} avant`);
      fit(after, x0 + w - 12, `tâche ${i + 1} après`);
      const check = el('g', {}, g);
      el('circle', { cx: 0, cy: 0, r: 13, fill: C.green }, check);
      el('path', { d: 'M -5.5 0.5 L -1.5 4.5 L 6 -3.5', ...W2, 'stroke-width': 3 }, check);
      S.src.push({ g, solid, ghost, content, strike, sLen, before, after, check, cx: x0 + w / 2, cy: y0 + h / 2, chk: [x0 + w - 26, y0 + 30] });
    });

    // ----- Chiffrage du temps libéré, sous le tronc (relié par un pointillé) -----
    S.tl = el('g', {}, L_top);
    el('line', { x1: 430, y1: 842, x2: 430, y2: TL.y - 2, stroke: DASH, 'stroke-width': 2.5, 'stroke-dasharray': '1 6', 'stroke-linecap': 'round' }, S.tl);
    el('rect', { x: TL.x, y: TL.y, width: TL.w, height: TL.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.tl);
    const tcx = TL.x + TL.w / 2;
    const tlFit = (n, l) => fit(n, TL.x + TL.w - 10, l, TL.x + 10);
    tlFit(text(S.tl, tcx, TL.y + 30, 'Temps libéré', { size: 16, weight: 700, fill: MUTED, anchor: 'middle' }), 'temps libéré');
    S.tlVal = text(S.tl, tcx, TL.y + 74, `35${NB}h`, { size: 40, weight: 800, fill: C.blue, anchor: 'middle' });
    tlFit(S.tlVal, 'temps libéré valeur');
    tlFit(text(S.tl, tcx, TL.y + 97, 'par semaine', { size: 16, weight: 500, fill: MUTED, anchor: 'middle' }), 'par semaine');
    // Barre de composition : 14 h + 9 h + 12 h
    const bw = TL.w - 32, bx = TL.x + 16, by = TL.y + 112;
    const bcp = el('clipPath', { id: 'tlbar' }, S.defs);
    el('rect', { x: bx, y: by, width: bw, height: 26, rx: 7 }, bcp);
    el('rect', { x: bx, y: by, width: bw, height: 26, rx: 7, fill: GHOST }, S.tl);
    const bar = el('g', { 'clip-path': 'url(#tlbar)' }, S.tl);
    let sx = bx;
    S.segs = TASKS.map((tk, i) => {
      const w = bw * tk.h / TOTAL;
      const r = el('rect', { x: f2(sx), y: by, width: 0, height: 26, fill: C.lightBlue }, bar);
      const lb = text(S.tl, sx + w / 2, by + 18.5, `${tk.h}${NB}h`, { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
      fit(lb, sx + w - 2, `segment ${i + 1}`, sx + 2);
      if (i) el('line', { x1: f2(sx), y1: by, x2: f2(sx), y2: by + 26, stroke: C.white, 'stroke-width': 2 }, S.tl);
      const seg = { r, lb, w, x: sx };
      sx += w;
      return seg;
    });
    S.poste = el('g', {}, S.tl);
    tlFit(text(S.poste, tcx, TL.y + 166, `≈${NB}1 poste`, { size: 18, weight: 800, fill: C.ink, anchor: 'middle' }), 'poste');
    tlFit(text(S.poste, tcx, TL.y + 188, 'à temps plein', { size: 16, weight: 500, fill: MUTED, anchor: 'middle' }), 'temps plein');

    // ----- Aiguillage -----
    S.hub = el('g', {}, L_top);
    S.ring = el('circle', { cx: HUB.x, cy: HUB.y, r: HUB.r, fill: 'none', stroke: C.blue, 'stroke-width': 3 }, L_top);
    el('circle', { cx: HUB.x, cy: HUB.y, r: HUB.r, fill: C.white, stroke: C.blue, 'stroke-width': 4 }, S.hub);
    const notch = a => [HUB.x + (HUB.r - 9) * Math.cos(a * Math.PI / 180), HUB.y + (HUB.r - 13) * Math.sin(a * Math.PI / 180)];
    S.nUp = el('circle', { cx: f2(notch(-32)[0]), cy: f2(notch(-32)[1]), r: 5, fill: IDLE }, S.hub);
    S.nDown = el('circle', { cx: f2(notch(32)[0]), cy: f2(notch(32)[1]), r: 5, fill: IDLE }, S.hub);
    S.blade = el('g', {}, S.hub);
    el('path', { d: 'M -14 -5 L 18 -5 L 18 -10 L 30 0 L 18 10 L 18 5 L -14 5 Z', fill: C.blue, stroke: C.blue, 'stroke-width': 2, 'stroke-linejoin': 'round' }, S.blade);
    el('circle', { cx: 0, cy: 0, r: 10, fill: C.blue }, S.blade);
    el('circle', { cx: 0, cy: 0, r: 3, fill: C.white }, S.blade);
    fit(text(S.hub, 464, 734, 'Aiguillage', { size: 16, weight: 700, fill: MUTED, anchor: 'middle' }), BX - 10, 'aiguillage', TX0);

    // Même chiffrage au départ des deux branches
    const chip = (x, y) => {
      const g = el('g', {}, L_top);
      const r = el('rect', { y: y - 15, height: 30, rx: 15, fill: C.white, stroke: C.blue, 'stroke-width': 2 }, g);
      const tx = text(g, x, y + 6, `${TOTAL}${NB}h`, { size: 17, weight: 800, fill: C.blue, anchor: 'middle' });
      const w = tx.getBBox().width + 26;
      r.setAttribute('x', f2(x - w / 2));
      r.setAttribute('width', f2(w));
      fit(r, BX - 6, 'pastille 35 h', HUB.x + HUB.r);
      return { g, x, y };
    };
    const CHX = 570;
    S.chips = [chip(CHX, yAtX(LANE1, CHX)), chip(CHX, 858)];

    // ----- Branche « Supprimer une personne » -----
    S.b1 = el('g', {}, L_top);
    S.b1Box = el('rect', { x: B1.x, y: B1.y, width: B1.w, height: B1.h, rx: 20, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.b1);
    S.b1Port = el('rect', { x: BX - 4, y: B1_Y - TOTAL * K / 2, width: 8, height: TOTAL * K, rx: 4, fill: IDLE }, S.b1);
    el('circle', { cx: B1.x + 32, cy: B1.y + 34, r: 17, fill: C.red }, S.b1);
    icon(S.b1, 'moins', B1.x + 31, B1.y + 35, 1);
    fit(text(S.b1, B1.x + 60, B1.y + 41, 'Supprimer une personne', { size: 19, weight: 800, fill: C.tRed }), B1.x + B1.w - 14, 'titre branche 1');
    S.people = [];
    for (let k = 0; k < 8; k++) S.people.push(person(S.b1, B1.x + 54 + k * 32, B1_Y, { fill: C.blue }));
    S.leaver = S.people[7];
    S.leaverX = B1.x + 54 + 7 * 32;
    S.ghostP = person(S.b1, S.leaverX, B1_Y, { fill: 'none', stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '4 3' });
    S.minus1 = el('g', {}, S.b1);
    el('circle', { cx: 0, cy: 0, r: 13, fill: C.red }, S.minus1);
    fit(text(S.minus1, 0, 5.5, '−1', { size: 15, weight: 800, fill: C.white, anchor: 'middle' }), 13, 'bulle −1', -13);
    el('line', { x1: B1.x + 20, y1: B1.y + 140, x2: B1.x + B1.w - 20, y2: B1.y + 140, stroke: CARD_LINE, 'stroke-width': 2 }, S.b1);
    fit(text(S.b1, B1.x + 20, B1.y + 166, 'Gaspillages signalés par mois', { size: 16, weight: 700, fill: MUTED }), B1.x + B1.w - 14, 'compteur 1 libellé');

    // ----- Branche « Temps libéré annoncé » -----
    S.b2 = el('g', {}, L_top);
    S.b2Box = el('rect', { x: B2.x, y: B2.y, width: B2.w, height: B2.h, rx: 20, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.b2);
    S.b2Rings = [0, 1].map(() => el('circle', { cx: B2.x + 32, cy: B2.y + 34, r: 17, fill: 'none', stroke: C.green, 'stroke-width': 3 }, S.b2));
    el('circle', { cx: B2.x + 32, cy: B2.y + 34, r: 17, fill: C.green }, S.b2);
    icon(S.b2, 'megaphone', B2.x + 31, B2.y + 34, 0.95);
    fit(text(S.b2, B2.x + 60, B2.y + 41, 'Temps libéré annoncé', { size: 19, weight: 800, fill: C.tGreen }), B2.x + B2.w - 14, 'titre branche 2');
    USES.forEach((u, j) => {
      const y0 = ROWS_Y[j], cy = y0 + ROW_H / 2, L = LANES2[j];
      const port = el('rect', { x: BX - 4, y: L.cy - L.th / 2, width: 8, height: L.th, rx: 3, fill: IDLE }, S.b2);
      el('rect', { x: B2.x + 20, y: y0, width: B2.w - 40, height: ROW_H, rx: 12, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.b2);
      const on = el('rect', { x: B2.x + 20, y: y0, width: B2.w - 40, height: ROW_H, rx: 12, fill: C.pGreen }, S.b2);
      el('circle', { cx: B2.x + 40, cy, r: 13, fill: IDLE }, S.b2);
      const disc = el('circle', { cx: B2.x + 40, cy, r: 13, fill: C.green }, S.b2);
      icon(S.b2, u.key, B2.x + 40, cy, 0.82);
      fit(text(S.b2, B2.x + 62, cy + 6, u.name, { size: 17, weight: 700, fill: C.ink }), B2.x + B2.w - 66, `usage ${j + 1}`);
      const hrs = text(S.b2, B2.x + B2.w - 32, cy + 6, `${u.h}${NB}h`, { size: 17, weight: 800, fill: C.tGreen, anchor: 'end' });
      fit(hrs, B2.x + B2.w - 28, `usage ${j + 1} heures`, B2.x + B2.w - 70);
      S.rows.push({ port, on, disc, hrs, cy });
    });
    el('line', { x1: B2.x + 20, y1: B2.y + 282, x2: B2.x + B2.w - 20, y2: B2.y + 282, stroke: CARD_LINE, 'stroke-width': 2 }, S.b2);
    fit(text(S.b2, B2.x + 20, B2.y + 308, 'Gaspillages signalés par mois', { size: 16, weight: 700, fill: MUTED }), B2.x + B2.w - 14, 'compteur 2 libellé');

    // Barres mensuelles, flèche de tendance et afficheur de chaque branche
    const meter = (parent, card, base, cy, vals, color, id) => {
      const bars = vals.map((v, k) => {
        const x = card.x + 22 + k * 25;
        const r = el('rect', { x, y: base, width: 17, height: 0, rx: 4, fill: k ? color : C.lightBlue }, parent);
        const zero = v === 0 ? el('rect', { x: x + 0.5, y: base - 3, width: 16, height: 3, rx: 1.5, fill: OFF_INK }, parent) : null;
        return { r, zero, v };
      });
      const ox = card.x + card.w - 22 - 39;
      const arrow = el('path', { d: '', fill: color }, parent);
      const ax = ox - 39 - 17;
      arrow.setAttribute('d', color === C.green
        ? `M ${ax - 8} ${cy + 5} L ${ax + 8} ${cy + 5} L ${ax} ${cy - 7} Z`
        : `M ${ax - 8} ${cy - 5} L ${ax + 8} ${cy - 5} L ${ax} ${cy + 7} Z`);
      return { bars, base, arrow, ax, cy, od: odometer(parent, ox, cy, id) };
    };
    S.m1 = meter(S.b1, B1, B1.y + 218, B1.y + 196, BARS1, C.red, 'od1');
    S.m2 = meter(S.b2, B2, B2.y + 360, B2.y + 338, BARS2, C.green, 'od2');

    // ----- Pastilles d'étape -----
    const STY = { b: { bg: C.blue, fg: C.white }, r: { bg: C.pRed, fg: C.tRed }, g: { bg: C.pGreen, fg: C.tGreen }, i: { bg: C.blue, fg: C.white } };
    S.pills = PILLS.map(([, label, k], i) => {
      const p = pillShape(S.scene, 92, FRAME.y + 46, label, STY[k]);
      fit(p, 980, `pastille ${i + 1}`);
      return p;
    });

    D.encart(['Les 8 gaspillages', 'Notre guide complet', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  // Fenêtre visible d'un ruban (xa → xb) : rubans et particules
  function setLane(L, xa, xb, t) {
    const vis = xb - xa > 0.5;
    if (!show(L.n, vis ? 1 : 0)) { L.dg.setAttribute('display', 'none'); return; }
    L.r.setAttribute('x', f2(xa));
    L.r.setAttribute('width', f2(xb - xa));
    L.dg.removeAttribute('display');
    L.dots.forEach((c, k) => {
      const [x, y] = at(L, frac(t / P + L.ph[k]));
      if (x < xa + 2 || x > xb - 1) { c.setAttribute('display', 'none'); return; }
      c.removeAttribute('display');
      c.setAttribute('cx', f2(x));
      c.setAttribute('cy', f2(y + L.offs[k]));
    });
  }
  function popIn(n, cx, cy, s, t0, d = 0.4) {
    const p = prog(s, t0, d);
    if (!show(n, clamp(p / 0.4))) return 0;
    scaleAt(n, cx, cy, popScale(p));
    return p;
  }
  // Valeur d'un compteur qui suit ses barres
  const meterVal = (vals, times, s) => {
    let v = vals[0];
    for (let k = 1; k < vals.length; k++) v = lerp(v, vals[k], easeInOut(prog(s, times[k], 0.28)));
    return v;
  };
  function drawMeter(m, times, s, color, litO) {
    m.bars.forEach((b, k) => {
      const p = k ? prog(s, times[k], 0.32) : 1;
      const h = b.v * BAR_K * (p <= 0 ? 0 : p >= 1 ? 1 : back(p));
      if (show(b.r, h > 0.3 ? 1 : 0)) { b.r.setAttribute('y', f2(m.base - h)); b.r.setAttribute('height', f2(h)); }
      if (b.zero) show(b.zero, p);
    });
    const v = meterVal(m.bars.map(b => b.v), times, s);
    m.od.set(v, color, litO);
    return v;
  }

  function draw(t) {
    const final = t < T_OUT + OUT_DUR;
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    const s = final ? 99 : t;                         // temps de séquence (image finale = fin de séquence)
    if (!show(S.scene, fade)) return;

    // Tâches inutiles : elles apparaissent, puis sont retirées (contour fantôme, coche, heures libérées)
    S.src.forEach((c, i) => {
      if (!popIn(c.g, c.cx, c.cy, s, T_CARD[i])) return;
      const r = T_RM[i];
      const pg = prog(s, r + 0.15, 0.3);
      show(c.solid, 1 - pg);
      show(c.ghost, pg);
      c.content.setAttribute('opacity', f2(1 - 0.38 * pg));
      const ps = prog(s, r, 0.25);
      if (show(c.strike, ps > 0 ? 1 : 0)) {
        if (ps < 1) { c.strike.setAttribute('stroke-dasharray', f2(c.sLen)); c.strike.setAttribute('stroke-dashoffset', f2(c.sLen * (1 - easeInOut(ps)))); }
        else { c.strike.removeAttribute('stroke-dasharray'); c.strike.removeAttribute('stroke-dashoffset'); }
      }
      const pb = prog(s, r + 0.2, 0.15), pa = prog(s, r + 0.37, 0.22);
      if (show(c.before, 1 - pb)) { if (pb > 0) c.before.setAttribute('transform', `translate(0 ${f2(-6 * pb)})`); else c.before.removeAttribute('transform'); }
      if (show(c.after, pa)) { if (pa < 1) c.after.setAttribute('transform', `translate(0 ${f2(7 * (1 - easeOut(pa)))})`); else c.after.removeAttribute('transform'); }
      const pk = prog(s, r + 0.3, 0.35);
      if (show(c.check, clamp(pk / 0.4))) c.check.setAttribute('transform', `translate(${c.chk[0]} ${c.chk[1]})${pk < 1 ? ` scale(${f2(popScale(pk))})` : ''}`);
    });

    // Rubans des sources : ils se remplissent jusqu'à l'aiguillage
    SRC_LANES.forEach((L, i) => setLane(L, SRC_R, lerp(SRC_R, HUB.x, easeInOut(prog(s, T_RM[i] + 0.25, FILL))), t));

    // Chiffrage : la barre se remplit et le total roule à l'arrivée de chaque ruban, puis « ≈ 1 poste »
    const arr = TASKS.map((tk, i) => easeOut(prog(s, T_RM[i] + 0.25 + FILL - 0.1, 0.35)));
    const tl = TASKS.reduce((a, tk, i) => a + tk.h * arr[i], 0);
    const ptl = prog(s, T_RM[0] + 0.5, 0.35);
    if (show(S.tl, clamp(ptl / 0.4))) {
      scaleAt(S.tl, TL.x + TL.w / 2, TL.y + TL.h / 2, popScale(ptl));
      S.tlVal.textContent = `${Math.round(tl)}${NB}h`;
      const pp = prog(s, T_PULSE, 0.45);
      scaleAt(S.tlVal, TL.x + TL.w / 2, TL.y + 60, pp > 0 && pp < 1 ? 1 + 0.14 * Math.sin(Math.PI * pp) : 1);
      S.segs.forEach((g, i) => { g.r.setAttribute('width', f2(g.w * arr[i])); show(g.lb, prog(arr[i], 0.6, 0.4)); });
      const po = prog(s, T_PULSE + 0.25, 0.35);
      if (show(S.poste, clamp(po / 0.4))) { if (po < 1) S.poste.setAttribute('transform', `translate(0 ${f2(8 * (1 - easeOut(po)))})`); else S.poste.removeAttribute('transform'); }
    }

    // Aiguillage : apparaît, puis la lame bascule (vers le haut, puis vers le bas) avec un « clac »
    if (popIn(S.hub, HUB.x, HUB.y, s, T_HUB)) {
      const p1 = prog(s, T_SW1, SW), p2 = prog(s, T_SW2, SW);
      const ang = p2 > 0 ? lerp(-32, 32, backTo(p2)) : -32 * backTo(p1);
      S.blade.setAttribute('transform', `translate(${HUB.x} ${HUB.y}) rotate(${f2(ang)})`);
      S.nUp.setAttribute('fill', s >= T_SW1 + 0.25 && s < T_SW2 + 0.1 ? C.red : IDLE);
      S.nDown.setAttribute('fill', s >= T_SW2 + 0.25 ? C.green : IDLE);
    }
    let ringP = -1;
    [T_SW1, T_SW2].forEach(ts => { const p = prog(s, ts + SW * 0.75, 0.45); if (p > 0 && p < 1) ringP = p; });
    if (show(S.ring, ringP > 0 ? 0.55 * (1 - ringP) : 0)) S.ring.setAttribute('r', f2(HUB.r + 24 * easeOut(ringP)));

    // Fantômes des deux branches, puis les deux cartes et le même chiffrage
    const gw = (BX - HUB.x) * easeInOut(prog(s, T_GHOST, 0.5));
    if (show(S.ghost, gw > 0.5 ? 1 : 0)) S.ghostClip.setAttribute('width', f2(gw));
    S.chips.forEach((c, k) => popIn(c.g, c.x, c.y, s, T_CHIPS + 0.1 * k, 0.35));

    // Branche « personne » : elle se remplit, puis se vide quand la lame repart
    const b1a = lerp(HUB.x, BX, easeInOut(prog(s, T_B1_DRAIN, 0.6)));
    const b1b = lerp(HUB.x, BX, easeInOut(prog(s, T_B1_ON, 0.6)));
    setLane(LANE1, b1a, b1b, t);
    show(S.ghostEdges, b1b - b1a > 0.5 ? 0 : 1);
    // Branche « annoncé » : quatre rubans qui se remplissent l'un après l'autre
    LANES2.forEach((L, j) => setLane(L, HUB.x, lerp(HUB.x, BX, easeInOut(prog(s, T_B2_ON + 0.07 * j, 0.6))), t));

    // Carte « Supprimer une personne »
    if (popIn(S.b1, B1.x + B1.w / 2, B1.y + B1.h / 2, s, T_B1C, 0.4)) {
      const active = s >= T_B1_ON + 0.45 && s < T_B1_DRAIN + 0.2;
      const after = s >= T_B1_DRAIN + 0.2;
      S.b1Box.setAttribute('stroke', active ? C.red : after ? RED_SOFT : CARD_LINE);
      S.b1Box.setAttribute('stroke-width', active ? 3 : after ? 2.5 : 2);
      if (after) S.b1Box.setAttribute('stroke-dasharray', '9 6'); else S.b1Box.removeAttribute('stroke-dasharray');
      S.b1Port.setAttribute('fill', active ? C.red : IDLE);
      // Une personne est soulevée, puis quitte l'effectif
      const pl = prog(s, T_PERSON, 0.15), pr = prog(s, T_PERSON + 0.15, 0.45);
      if (show(S.leaver, 1 - pr)) {
        const dy = -8 * easeOut(pl) - 10 * easeInOut(pr), k = 1 + 0.08 * easeOut(pl) - 0.2 * easeInOut(pr);
        S.leaver.setAttribute('transform', `translate(${S.leaverX} ${f2(B1_Y + dy)})${k !== 1 ? ` scale(${f2(k)})` : ''}`);
        if (pl > 0) S.leaver.setAttribute('filter', 'url(#lift)'); else S.leaver.removeAttribute('filter');
      }
      show(S.ghostP, prog(s, T_PERSON + 0.4, 0.25));
      const pm = prog(s, T_PERSON + 0.62, 0.35);
      if (show(S.minus1, clamp(pm / 0.4))) S.minus1.setAttribute('transform', `translate(${S.leaverX + 13} ${B1_Y - 20})${pm < 1 ? ` scale(${f2(popScale(pm))})` : ''}`);
      // Le compteur descend jusqu'à 0, puis l'afficheur s'éteint
      const off = prog(s, T_OFF, 0.35);
      drawMeter(S.m1, T_BARS1, s, mix(C.white, OFF_INK, off), 1 - off);
      show(S.m1.arrow, s >= T_BARS1[1] && s < T_OFF ? 1 : 0);
    }

    // Carte « Temps libéré annoncé »
    if (popIn(S.b2, B2.x + B2.w / 2, B2.y + B2.h / 2, s, T_B2C, 0.4)) {
      const active = s >= T_ANN;
      S.b2Box.setAttribute('stroke', active ? C.green : CARD_LINE);
      S.b2Box.setAttribute('stroke-width', active ? 3 : 2);
      S.b2Rings.forEach((r, k) => {
        const p = prog(s, T_ANN + 0.28 * k, 0.6);
        if (show(r, p > 0 && p < 1 ? 0.7 * (1 - p) : 0)) r.setAttribute('r', f2(17 + 20 * easeOut(p)));
      });
      S.rows.forEach((r, j) => {
        const p = prog(s, T_B2_ON + 0.07 * j + 0.5, 0.3);
        show(r.on, p);
        show(r.disc, p);
        r.port.setAttribute('fill', p > 0.5 ? C.green : IDLE);
        const ph = prog(s, T_B2_ON + 0.07 * j + 0.55, 0.4);
        if (show(r.hrs, clamp(ph * 3))) r.hrs.textContent = `${Math.round(USES[j].h * easeOut(ph))}${NB}h`;
      });
      const pc = prog(s, T_BARS2[1] - 0.1, 0.3);
      drawMeter(S.m2, T_BARS2, s, mix(C.white, C.green, pc), 1);
      const pa = prog(s, T_BARS2[1], 0.35);
      if (show(S.m2.arrow, clamp(pa / 0.4))) scaleAt(S.m2.arrow, S.m2.ax, S.m2.cy, popScale(pa));
    }

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = PILLS[i][0] + (i ? 0.12 : 0);
      const b = i + 1 < PILLS.length ? PILLS[i + 1][0] : Infinity;
      const o = prog(s, a, 0.25) * (1 - prog(s, b, 0.14));
      if (show(g, o)) {
        const dy = 8 * (1 - prog(s, a, 0.25));
        if (dy > 0.01) g.setAttribute('transform', `translate(0 ${f2(dy)})`); else g.removeAttribute('transform');
      }
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
