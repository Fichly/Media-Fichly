// Fiche LinkedIn · page Fichly · lundi 26 octobre 2026 (Buffer 6abe5d6decb687b12492f298)
// Post : « Le PDCA tient en quatre lettres. L'appliquer correctement demande surtout de ne sauter aucune étape. »
// Exemple type du post : une ligne met 25 min à redémarrer en début de poste, pour 10 prévues.
// Premier commentaire du post (Buffer) : article sur la méthode PDCA → encart.
// Le visuel EST la fiche : le cycle sur une page, avec cet exemple (à gauche) et une trame vierge (à droite),
// les deux erreurs courantes, et le graphique du temps de démarrage par jour.
// Style propre : la roue et le graphique en direct. Une grande roue PDCA roule le long du graphique, un cran
// (un quart de tour, sans glisser) par étape ; chaque quart s'allume et remplit sa ligne de la fiche.
// Plan pose le départ (25 min), le prévu (10) et l'hypothèse (15). La roue tente de sauter à Act : une
// barrière la bloque (erreur 1). Do : les jours de test s'affichent un à un, en direct. Nouvelle tentative de
// saut : bloquée (erreur 2). Check compare au départ et vérifie l'effet imprévu. Act : la roue boucle le
// cycle, le kit et la fiche de passation entrent dans le standard, qui cale la roue.
// Image t = 0 = état final. Boucle exacte de 13,5 s.
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
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const k3 = v => Math.max(0.001, v).toFixed(3);
  const NB = ' ';
  const RAD = Math.PI / 180;
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', GRID = '#e6e6f0', TICK = '#a3a3c2',
    DASH = '#b6b6d4', GREY_Q = '#e6e6f0', GREY_L = '#a9a9c8';

  // Visible / invisible : display="none" plutôt qu'une opacité nulle
  const show = (n, o) => {
    if (o <= 0.002) { n.setAttribute('display', 'none'); return false; }
    n.removeAttribute('display');
    n.setAttribute('opacity', f2(Math.min(1, o)));
    return true;
  };
  const scaleAt = (n, cx, cy, sx, sy = sx) => n.setAttribute('transform', sx === 1 && sy === 1 ? '' :
    `translate(${f2(cx)} ${f2(cy)}) scale(${k3(sx)} ${k3(sy)}) translate(${f2(-cx)} ${f2(-cy)})`);

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 750 };
  const PILL_Y = 451;
  const PX0 = 150, PX1 = 1000;                // étendue du graphique
  const A = 698, K = 6.8;                     // sol (0 min) et px par minute
  const yOf = m => A - m * K;
  const R = 62;                               // rayon de la roue
  const NOTCH = Math.PI * R / 2;              // un quart de tour roulé sans glisser
  const S4 = 932;
  const ST = [0, 1, 2, 3, 4].map(k => S4 - (4 - k) * NOTCH);   // stations : Plan, Do, Check, Act, bouclé
  const ROW_Y = [732, 815, 898, 981], ROW_H = 75;
  const ROW_X0 = 76, ROW_X1 = 718, TPL_X0 = 730, TPL_X1 = 1004, BX = 154;
  const ERR = { y: 1072, h: 74 };
  const BLOCK = { x0: 656, x1: 864, y0: 604 };

  // ---------- Contenu ----------
  const QUADS = [
    { key: 'P', name: 'Plan', sub: 'comprendre et prévoir', color: C.blue, ang: 225 },
    { key: 'D', name: 'Do', sub: 'tester en petit', color: C.teal, ang: 315 },
    { key: 'C', name: 'Check', sub: 'mesurer et comparer', color: C.violet, ang: 45 },
    { key: 'A', name: 'Act', sub: 'décider', color: C.green, ang: 135 },
  ];
  const BODY = [
    [`3 démarrages observés${NB}: matière pas prête, consignes à l’oral.`,
      `Hypothèse${NB}: kit matière + fiche de passation, sous 15${NB}min.`],
    [`Deux semaines, sur une seule équipe.`,
      `On ne déploie pas une hypothèse.`],
    [`Temps relevé chaque jour, comparé au départ.`,
      `Effet imprévu${NB}: le kit retarde-t-il la fin de poste${NB}?`],
    [`Ça fonctionne${NB}: kit et fiche au standard, puis autres équipes.`,
      `Sinon, retour au Plan avec ce qu’on a appris.`],
  ];
  const PROMPTS = [`Constat, hypothèse`, `Test${NB}: périmètre, durée`, `Mesure, effets imprévus`, `Standard ou nouveau Plan`];

  // ---------- Données (min) ----------
  const BASE_X = [212, 238, 264], BASE_V = [26, 24, 25];
  const TEST_X = Array.from({ length: 10 }, (_, i) => 306 + 26 * i);
  const TEST_V = [22, 19, 17, 16, 14, 15, 13, 14, 12, 13];
  const BR_X = 566;                                         // accolade départ → fin du test

  // ---------- Chronologie (s) ----------
  const DURATION = 13.5;
  const T_OUT = 1.2, OUT = 0.3;                             // l'état final s'efface
  const T_REW = 1.35, REW = 0.7;                            // la roue revient au départ en roulant
  const ROLL = 0.5, ROLLS = [4.45, 7.4, 9.4, 10.5];         // un cran : Plan → Do → Check → Act → bouclé
  const T_LIT = [2.1, ROLLS[0] + ROLL, ROLLS[1] + ROLL, ROLLS[2] + ROLL];
  const T_ROW = T_LIT.map(v => v + 0.06);
  const T_BASE = [2.3, 2.42, 2.54], T_25 = 2.66, T_PREVU = 2.75, T_HYP = 2.95, LINE_DUR = 0.4;
  const HOPS = [{ t: 3.62, st: 0 }, { t: 6.57, st: 1 }];   // tentatives de saut vers Act
  const UP = 0.24, DOWN = 0.3, LAND = 0.16;
  const T_PT = TEST_X.map((_, i) => 5.3 + 0.11 * i);
  const T_GHOSTLINE = 8.05, T_BRACKET = 8.3, T_HYPOK = 8.75, T_EFF = 8.55, T_EFF2 = 9.0;
  const T_BLOCK = ROLLS[3] + ROLL - 0.05, T_FLY = [T_BLOCK + 0.1, T_BLOCK + 0.26], FLY = 0.55;
  const PILLS = [
    { t: 2.0, label: `1${NB}·${NB}Plan${NB}: comprendre et prévoir`, q: QUADS[0] },
    { t: 3.5, label: `Passer de Plan à Act${NB}?`, err: true },
    { t: ROLLS[0], label: `2${NB}·${NB}Do${NB}: tester en petit`, q: QUADS[1] },
    { t: 6.45, label: `Oublier Check${NB}?`, err: true },
    { t: ROLLS[1], label: `3${NB}·${NB}Check${NB}: mesurer et comparer`, q: QUADS[2] },
    { t: ROLLS[2], label: `4${NB}·${NB}Act${NB}: décider`, q: QUADS[3] },
    { t: ROLLS[3], label: `Cycle bouclé, aucune étape sautée`, ok: true },
  ];

  // ---------- Petits éléments ----------
  const sectorPath = (ang, r0, r1) => {
    const a0 = (ang - 45) * RAD, a1 = (ang + 45) * RAD;
    const p = (r, a) => `${f2(r * Math.cos(a))} ${f2(r * Math.sin(a))}`;
    return `M ${p(r1, a0)} A ${r1} ${r1} 0 0 1 ${p(r1, a1)} L ${p(r0, a1)} A ${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`;
  };
  function crossIcon(parent, cx, cy, r = 12, bg = C.red) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: bg }, g);
    const d = r * 0.38;
    el('path', { d: `M ${f2(cx - d)} ${f2(cy - d)} L ${f2(cx + d)} ${f2(cy + d)} M ${f2(cx + d)} ${f2(cy - d)} L ${f2(cx - d)} ${f2(cy + d)}`, stroke: C.white, 'stroke-width': r * 0.27, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function checkIcon(parent, cx, cy, r = 12) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: C.green }, g);
    const s = r / 12;
    el('path', { d: `M ${f2(cx - 5.5 * s)} ${f2(cy + 0.5 * s)} L ${f2(cx - 1.5 * s)} ${f2(cy + 4.5 * s)} L ${f2(cx + 5.5 * s)} ${f2(cy - 3.5 * s)}`, fill: 'none', stroke: C.white, 'stroke-width': 3 * s, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function kitIcon(parent) {           // bac de matière préparé (repère centré)
    const g = el('g', {}, parent);
    el('path', { d: 'M -13 -6 L 13 -6 L 11 10 L -11 10 Z', fill: C.yellow, 'stroke-linejoin': 'round', stroke: C.yellow, 'stroke-width': 2 }, g);
    el('rect', { x: -14, y: -10, width: 28, height: 6, rx: 2, fill: C.tYellow }, g);
    el('rect', { x: -5, y: -1, width: 10, height: 3.5, rx: 1.75, fill: C.white }, g);
    return g;
  }
  function docIcon(parent) {           // fiche de passation
    const g = el('g', {}, parent);
    el('path', { d: 'M -9 -12 H 4 L 10 -6 V 12 H -9 Z', fill: C.white, stroke: C.blue, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, g);
    el('path', { d: 'M 4 -12 V -6 H 10', fill: 'none', stroke: C.blue, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    [-1, 4, 9].forEach(y => el('line', { x1: -5, y1: y - 1, x2: 6, y2: y - 1, stroke: C.blue, 'stroke-width': 2, 'stroke-linecap': 'round' }, g));
    return g;
  }
  function pillShape(parent, x, cy, label, { bg, fg, letter, icon, size = 20, h = 40 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    let tx0 = x + 20;
    if (letter) {
      el('circle', { cx: x + 22, cy, r: 14, fill: C.white }, g);
      text(g, x + 22, cy + 5.5, letter.key, { size: 15, weight: 800, fill: letter.color, anchor: 'middle' });
      tx0 = x + 44;
    }
    if (icon === 'x') { crossIcon(g, x + 29, cy, 12); tx0 = x + 50; }
    if (icon === 'ok') { checkIcon(g, x + 29, cy, 12); tx0 = x + 50; }
    const tx = text(g, tx0, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + (tx0 - x) + 20);
    return g;
  }
  // Texte en plusieurs morceaux : [chaîne, gras ?, couleur ?]
  function rich(parent, x, y, parts, { size = 16, weight = 500, fill = C.ink } = {}) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': weight, fill }, parent);
    parts.forEach(([s, bold, color]) => {
      const sp = el('tspan', bold ? { 'font-weight': 800, fill: color || C.ink } : (color ? { fill: color } : {}), t);
      sp.textContent = s;
    });
    return t;
  }

  const S = { rows: [], tpl: [], pts: [], segs: [], quads: [], cells: [] };

  function build() {
    D.template({ author: null });
    D.title('Le PDCA tient', 'en quatre lettres.', 1020);
    D.chapeau('L’appliquer correctement demande surtout de ne sauter aucune étape.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [[`L’exemple${NB}: une ligne met `, 0], [`25${NB}min`, C.tRed], [' à redémarrer en début de poste, pour ', 0], [`10${NB}prévues`, C.blue], ['.', 0]]);
    line(384, [['La ', 0], ['roue', C.blue], [' n’avance que d’un cran à la fois. À droite de chaque étape, ', 0], ['la trame vierge', C.blue], ['.', 0]]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-60%', y: '-60%', width: '220%', height: '240%' }, defs);
    el('feDropShadow', { dx: 0, dy: 8, stdDeviation: 5, 'flood-color': C.ink, 'flood-opacity': 0.25 }, lift);
    const cpFrame = el('clipPath', { id: 'frame' }, defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26 }, cpFrame);
    const cpGround = el('clipPath', { id: 'ground' }, defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: A - FRAME.y }, cpGround);

    // ----- Cadre -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- Graphique : squelette -----
    fit(text(D.svg, 996, 457, `Temps de démarrage par jour, en${NB}min`, { size: 16, weight: 700, fill: MUTED, anchor: 'end' }), 1004, 'titre du graphique', 560);
    [20, 30].forEach(m => el('line', { x1: PX0, y1: yOf(m), x2: PX1, y2: yOf(m), stroke: GRID, 'stroke-width': 2 }));
    [0, 10, 20, 30].forEach(m => text(D.svg, 138, yOf(m) + 5, String(m), { size: 15, weight: 500, fill: TICK, anchor: 'end' }));
    el('line', { x1: 284, y1: yOf(30), x2: 284, y2: A, stroke: GRID, 'stroke-width': 2, 'stroke-dasharray': '5 6' });

    // Lignes « prévu » et « hypothèse » (révélées par un masque, gauche → droite)
    const dashedLine = (m, color, id) => {
      const cp = el('clipPath', { id }, defs);
      const r = el('rect', { x: PX0, y: yOf(m) - 6, width: PX1 - PX0, height: 12 }, cp);
      const g = el('g', { 'clip-path': `url(#${id})` });
      el('line', { x1: PX0, y1: yOf(m), x2: PX1, y2: yOf(m), stroke: color, 'stroke-width': 3, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' }, g);
      return { g, r };
    };
    S.prevu = dashedLine(10, C.green, 'cpPrevu');
    S.hyp = dashedLine(15, C.blue, 'cpHyp');
    S.prevuLabel = text(D.svg, PX0 + 6, yOf(10) + 22, `Prévu${NB}: 10${NB}min`, { size: 15, weight: 800, fill: C.tGreen });
    S.hypLabel = text(D.svg, PX0 + 6, yOf(15) + 22, `Hypothèse${NB}: sous 15${NB}min`, { size: 15, weight: 800, fill: C.blue });
    fit(S.prevuLabel, 300, 'libellé prévu');
    fit(S.hypLabel, 360, 'libellé hypothèse');
    const hb = S.hypLabel.getBBox();
    S.hypOk = checkIcon(D.svg, hb.x + hb.width + 14, yOf(15) + 17, 9);
    S.hypOkC = [hb.x + hb.width + 14, yOf(15) + 17];

    // Axe (le sol de la roue)
    el('line', { x1: PX0 - 6, y1: A, x2: PX1, y2: A, stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round' });

    // Départ : trois démarrages observés
    S.base = BASE_X.map((x, i) => {
      const g = el('g');
      el('line', { x1: x, y1: A, x2: x, y2: A + 6, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
      el('circle', { cx: x, cy: yOf(BASE_V[i]), r: 7, fill: C.red, stroke: C.white, 'stroke-width': 2.5 }, g);
      return g;
    });
    S.base25 = text(D.svg, 238, yOf(25) - 18, `25${NB}min`, { size: 17, weight: 800, fill: C.tRed, anchor: 'middle' });
    S.baseZone = text(D.svg, 238, A + 24, '3 démarrages', { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
    fit(S.baseZone, 300, 'zone départ', 150);

    // Test : dix jours, en direct
    const tline = el('g');
    TEST_X.forEach((x, i) => {
      if (!i) return;
      const x0 = TEST_X[i - 1], y0 = yOf(TEST_V[i - 1]), y1 = yOf(TEST_V[i]);
      const len = Math.hypot(x - x0, y1 - y0);
      S.segs.push({ n: el('line', { x1: x0, y1: y0, x2: x, y2: y1, stroke: C.blue, 'stroke-opacity': 0.45, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': f2(len), 'stroke-dashoffset': f2(len) }, tline), len });
    });
    S.pts = TEST_X.map((x, i) => {
      const g = el('g');
      el('line', { x1: x, y1: A, x2: x, y2: A + 6, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
      const ok = TEST_V[i] < 15;
      const halo = el('circle', { cx: x, cy: yOf(TEST_V[i]), r: 7, fill: 'none', stroke: ok ? C.green : C.blue, 'stroke-width': 2.5 }, g);
      el('circle', { cx: x, cy: yOf(TEST_V[i]), r: 6.5, fill: ok ? C.green : C.blue, stroke: C.white, 'stroke-width': 2.5 }, g);
      return { g, halo, x, y: yOf(TEST_V[i]) };
    });
    const tz = (TEST_X[0] + TEST_X[9]) / 2;
    S.testZone = text(D.svg, tz, A + 24, `Test${NB}: 2 semaines`, { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
    S.liveZone = el('g');
    S.liveDot = el('circle', { cx: 0, cy: A + 19, r: 5, fill: C.red }, S.liveZone);
    S.liveText = text(S.liveZone, tz + 8, A + 24, '', { size: 15, weight: 800, fill: C.ink, anchor: 'middle' });
    fit(S.testZone, 560, 'zone test', 290);

    // Check : départ en fantôme, accolade et gain
    const cpG = el('clipPath', { id: 'cpGhost' }, defs);
    S.ghostClip = el('rect', { x: 276, y: yOf(25) - 6, width: BR_X - 276, height: 12 }, cpG);
    S.ghostLine = el('g', { 'clip-path': 'url(#cpGhost)' });
    el('line', { x1: 276, y1: yOf(25), x2: BR_X, y2: yOf(25), stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '6 6', 'stroke-linecap': 'round' }, S.ghostLine);
    const by0 = yOf(25) + 2, by1 = yOf(13) - 2;
    S.brLen = (by1 - by0) + 2 * 11;
    S.bracket = el('path', { d: `M ${BR_X} ${by0} V ${by1} M ${BR_X - 7} ${by1 - 9} L ${BR_X} ${by1} L ${BR_X + 7} ${by1 - 9}`, fill: 'none', stroke: C.green, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    S.gain = text(D.svg, BR_X + 12, (by0 + by1) / 2 + 7, '', { size: 18, weight: 800, fill: C.tGreen });
    S.gain.textContent = `−12${NB}min`;
    fit(S.gain, BLOCK.x0 - 4, 'gain');

    // Check : effet imprévu, d'abord question (pointillés) puis vérifié
    S.effQ = el('g');
    const eqr = el('rect', { x: 330, y: 482, height: 34, rx: 17, fill: C.white, stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, S.effQ);
    const eqLens = el('g', { transform: 'translate(352 499)' }, S.effQ);
    el('circle', { cx: -2, cy: -2, r: 6.5, fill: 'none', stroke: MUTED, 'stroke-width': 2.6 }, eqLens);
    el('line', { x1: 3, y1: 3, x2: 8, y2: 8, stroke: MUTED, 'stroke-width': 2.8, 'stroke-linecap': 'round' }, eqLens);
    const eqt = text(S.effQ, 370, 505, `Effet imprévu sur la fin de poste${NB}?`, { size: 16, weight: 700, fill: MUTED });
    eqr.setAttribute('width', eqt.getBBox().width + 58);
    fit(eqr, 760, 'effet imprévu (question)');
    S.effOk = el('g');
    const eor = el('rect', { x: 330, y: 482, height: 34, rx: 17, fill: C.pGreen }, S.effOk);
    checkIcon(S.effOk, 350, 499, 10);
    const eot = text(S.effOk, 368, 505, `Effet imprévu vérifié${NB}: fin de poste non retardée`, { size: 16, weight: 700, fill: C.tGreen });
    eor.setAttribute('width', eot.getBBox().width + 56);
    fit(eor, 860, 'effet imprévu (vérifié)');

    // Act : le standard, qui cale la roue (il sort du sol)
    S.block = el('g', { 'clip-path': 'url(#ground)' });
    S.blockIn = el('g', {}, S.block);
    const bw = BLOCK.x1 - BLOCK.x0, bh = A - BLOCK.y0;
    el('rect', { x: BLOCK.x0, y: BLOCK.y0, width: bw, height: bh + 12, rx: 12, fill: C.white, stroke: C.green, 'stroke-width': 3 }, S.blockIn);
    el('path', { d: `M ${BLOCK.x0 + 1.5} ${BLOCK.y0 + 28} V ${BLOCK.y0 + 12} Q ${BLOCK.x0 + 1.5} ${BLOCK.y0 + 1.5} ${BLOCK.x0 + 12} ${BLOCK.y0 + 1.5} H ${BLOCK.x1 - 12} Q ${BLOCK.x1 - 1.5} ${BLOCK.y0 + 1.5} ${BLOCK.x1 - 1.5} ${BLOCK.y0 + 12} V ${BLOCK.y0 + 28} Z`, fill: C.green }, S.blockIn);
    fit(text(S.blockIn, (BLOCK.x0 + BLOCK.x1) / 2, BLOCK.y0 + 21, 'Standard', { size: 15, weight: 800, fill: C.white, anchor: 'middle' }), BLOCK.x1 - 8, 'titre standard', BLOCK.x0 + 8);
    S.chipT = [
      text(S.blockIn, BLOCK.x0 + 42, BLOCK.y0 + 56, 'Kit matière', { size: 15, weight: 700, fill: C.ink }),
      text(S.blockIn, BLOCK.x0 + 42, BLOCK.y0 + 83, 'Fiche de passation', { size: 15, weight: 700, fill: C.ink }),
    ];
    S.chipT.forEach((n, i) => fit(n, BLOCK.x1 - 8, `standard ligne ${i + 1}`));
    S.chipAt = [[BLOCK.x0 + 22, BLOCK.y0 + 51], [BLOCK.x0 + 22, BLOCK.y0 + 78]];

    // Barrière (tentative de saut) et roue fantôme à la station Act
    S.barrier = el('g');
    el('rect', { x: -8, y: -104, width: 16, height: 104, rx: 8, fill: C.red }, S.barrier);
    crossIcon(S.barrier, 0, -128, 16);
    S.ghost = el('g', { transform: `translate(${f2(ST[3])} ${A - R})` });
    el('circle', { cx: 0, cy: 0, r: R, fill: C.white, 'fill-opacity': 0.5, stroke: DASH, 'stroke-width': 2.5, 'stroke-dasharray': '8 7' }, S.ghost);
    text(S.ghost, 0, 12, 'A', { size: 34, weight: 800, fill: GREY_L, anchor: 'middle' });
    text(S.ghost, 0, -R - 14, `Act${NB}?`, { size: 17, weight: 800, fill: C.tRed, anchor: 'middle' });

    // ----- La roue -----
    S.shadow = el('ellipse', { cx: 0, cy: A + 1, rx: 50, ry: 5, fill: C.ink, opacity: 0.13 });
    S.wheel = el('g');
    S.rot = el('g', {}, S.wheel);
    el('circle', { cx: 0, cy: 0, r: R, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2.5 }, S.rot);
    QUADS.forEach((q, i) => {
      el('path', { d: sectorPath(q.ang, 15, R - 6), fill: GREY_Q, stroke: C.white, 'stroke-width': 4, 'stroke-linejoin': 'round' }, S.rot);
      const lit = el('g', {}, S.rot);
      el('path', { d: sectorPath(q.ang, 15, R - 6), fill: q.color, stroke: C.white, 'stroke-width': 4, 'stroke-linejoin': 'round' }, lit);
      const lx = 35 * Math.cos(q.ang * RAD), ly = 35 * Math.sin(q.ang * RAD);
      const lg = el('g', {}, S.rot);
      const grey = text(lg, 0, 10.5, q.key, { size: 29, weight: 800, fill: GREY_L, anchor: 'middle' });
      const white = text(lg, 0, 10.5, q.key, { size: 29, weight: 800, fill: C.white, anchor: 'middle' });
      S.quads.push({ lit, lg, lx, ly, grey, white });
    });
    el('circle', { cx: 0, cy: 0, r: 13, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.rot);
    el('circle', { cx: 0, cy: 0, r: 4.5, fill: C.ink }, S.wheel);

    // ----- La fiche : une ligne par étape (exemple) + la trame vierge -----
    QUADS.forEach((q, i) => {
      const y0 = ROW_Y[i];
      const card = el('rect', { x: ROW_X0, y: y0, width: ROW_X1 - ROW_X0, height: ROW_H, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
      const tx = ROW_X0 + 16, ty = y0 + (ROW_H - 46) / 2;
      el('rect', { x: tx, y: ty, width: 46, height: 46, rx: 13, fill: GREY_Q });
      const tg = text(D.svg, tx + 23, ty + 32, q.key, { size: 26, weight: 800, fill: GREY_L, anchor: 'middle' });
      const tile = el('g');
      el('rect', { x: tx, y: ty, width: 46, height: 46, rx: 13, fill: q.color }, tile);
      const tw = text(tile, tx + 23, ty + 32, q.key, { size: 26, weight: 800, fill: C.white, anchor: 'middle' });
      const head = rich(D.svg, BX, y0 + 27, [[q.name, true], [`${NB}·${NB}${q.sub}`, false, MUTED]], { size: 18, weight: 700 });
      fit(head, ROW_X1 - 14, `étape ${q.key} titre`);
      // Corps : deux lignes, déroulées de gauche à droite
      const cp = el('clipPath', { id: `cpRow${i}` }, defs);
      const clips = [0, 1].map(k => el('rect', { x: BX - 6, y: y0 + 34 + k * 20, width: ROW_X1 - BX + 6, height: 22 }, cp));
      const body = el('g', { 'clip-path': `url(#cpRow${i})` });
      BODY[i].forEach((s, k) => fit(text(body, BX, y0 + 50 + k * 20, s, { size: 16, weight: 500, fill: C.ink }), ROW_X1 - 14, `étape ${q.key} ligne ${k + 1}`));
      S.rows.push({ card, tile, tg, tw, body, clips, cx: tx + 23, cy: ty + 23 });

      // Trame vierge
      const tb = el('g');
      el('rect', { x: TPL_X0, y: y0, width: TPL_X1 - TPL_X0, height: ROW_H, rx: 18, fill: C.white, 'fill-opacity': 0.55, stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, tb);
      el('circle', { cx: TPL_X0 + 26, cy: y0 + 24, r: 13, fill: C.white, stroke: q.color, 'stroke-width': 2.5 }, tb);
      text(tb, TPL_X0 + 26, y0 + 29.5, q.key, { size: 15, weight: 800, fill: q.color, anchor: 'middle' });
      fit(text(tb, TPL_X0 + 47, y0 + 29.5, PROMPTS[i], { size: 15, weight: 700, fill: MUTED }), TPL_X1 - 10, `trame ${q.key}`);
      [y0 + 50, y0 + 66].forEach(y => el('line', { x1: TPL_X0 + 16, y1: y, x2: TPL_X1 - 16, y2: y, stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '1 6', 'stroke-linecap': 'round' }, tb));
    });
    // Étiquette de la trame, à cheval sur son bord
    const tl = el('g');
    const tlr = el('rect', { y: ROW_Y[0] - 13, height: 26, rx: 13, fill: C.blue }, tl);
    const tlt = text(tl, 0, ROW_Y[0] + 5, 'Trame vierge', { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
    const tlw = tlt.getBBox().width + 28, tlx = (TPL_X0 + TPL_X1) / 2;
    tlt.setAttribute('x', tlx);
    tlr.setAttribute('x', f2(tlx - tlw / 2));
    tlr.setAttribute('width', f2(tlw));

    // ----- Les deux erreurs courantes -----
    el('rect', { x: ROW_X0, y: ERR.y, width: TPL_X1 - ROW_X0, height: ERR.h, rx: 18, fill: C.pRed });
    el('line', { x1: 430, y1: ERR.y + 14, x2: 430, y2: ERR.y + ERR.h - 14, stroke: C.red, 'stroke-opacity': 0.35, 'stroke-width': 2 });
    const cells = [
      { x0: ROW_X0, x1: 430, l1: [['Passer de Plan à Act', true, C.tRed], [`${NB}:`, false]], l2: [['on décide sans avoir testé.', false]] },
      { x0: 430, x1: TPL_X1, l1: [['Oublier Check', true, C.tRed], [`${NB}: on teste, mais personne ne mesure.`, false]], l2: [['L’impression remplace le résultat.', false]] },
    ];
    cells.forEach((c, i) => {
      el('circle', { cx: c.x0 + 32, cy: ERR.y + ERR.h / 2, r: 14, fill: 'none', stroke: C.red, 'stroke-opacity': 0.45, 'stroke-width': 2, 'stroke-dasharray': '5 4' });
      const g = el('g');
      crossIcon(g, c.x0 + 32, ERR.y + ERR.h / 2, 14);
      const a = rich(g, c.x0 + 58, ERR.y + 31, c.l1, { size: 16 });
      const b = rich(g, c.x0 + 58, ERR.y + 54, c.l2, { size: 16 });
      [a, b].forEach((n, k) => fit(n, c.x1 - 12, `erreur ${i + 1} ligne ${k + 1}`));
      S.cells.push({ g, cx: c.x0 + 32, cy: ERR.y + ERR.h / 2 });
    });

    // Objets qui entrent dans le standard (au premier plan pendant leur vol)
    S.kit = kitIcon(D.svg);
    S.doc = docIcon(D.svg);

    // Pastilles d'étape
    S.pills = PILLS.map(p => {
      const g = pillShape(D.svg, 92, PILL_Y, p.label, p.err ? { bg: C.pRed, fg: C.tRed, icon: 'x' } : p.ok ? { bg: C.pGreen, fg: C.tGreen, icon: 'ok' } : { bg: C.blue, fg: C.white, letter: p.q });
      fit(g, 690, `pastille ${p.label}`);
      return g;
    });

    D.encart(['Boucler un PDCA', 'Notre article sur le PDCA', '(lien en commentaire)']);
  }

  // ---------- Mouvement de la roue ----------
  function wheelAt(t) {
    let x;
    if (t < T_REW) x = S4;
    else if (t < T_REW + REW) x = lerp(S4, ST[0], easeInOut(prog(t, T_REW, REW)));
    else {
      x = ST[0];
      ROLLS.forEach((t0, k) => { if (t >= t0) x = lerp(ST[k], ST[k + 1], easeInOut(prog(t, t0, ROLL))); });
    }
    let dx = 0, lift = 0, sx = 1, sy = 1, wob = 0;
    // Le cran s'enclenche : petit tassement à l'arrivée de chaque quart de tour
    [T_REW + REW, ...ROLLS.map(v => v + ROLL)].forEach(te => {
      const v = (t - te) / 0.16;
      if (v >= 0 && v < 1) { sy = 1 - 0.04 * Math.sin(Math.PI * v); sx = 1 + 0.02 * Math.sin(Math.PI * v); }
    });
    HOPS.forEach(h => {
      const u = t - h.t;
      if (u < 0 || u > UP + DOWN + LAND) return;
      if (u < UP) { const q = u / UP; dx = 22 * easeOut(q); lift = 36 * Math.sin(q * Math.PI / 2); }
      else if (u < UP + DOWN) {
        const q = (u - UP) / DOWN;
        dx = 22 * (1 - easeInOut(q)); lift = 36 * (1 - q * q);
        wob = -0.14 * Math.sin(q * Math.PI) ;                 // le choc le fait reculer d'un rien
      } else { const v = (u - UP - DOWN) / LAND; sy = 1 - 0.08 * Math.sin(Math.PI * v); sx = 1 + 0.045 * Math.sin(Math.PI * v); }
    });
    return { x, dx, lift, sx, sy, rot: (x - S4) / R + wob };
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_OUT + OUT;
    const fade = final ? 1 - prog(t, T_OUT, OUT) : 1;
    const vis = (s, d = 0.3) => (final ? fade : prog(t, s, d));
    const pop = (s, d = 0.35) => (final ? 1 : popScale(prog(t, s, d)));

    // Roue
    const w = wheelAt(t);
    const X = w.x + w.dx;
    S.wheel.setAttribute('transform', `translate(${f2(X)} ${f2(A - w.lift)})` + (w.sx !== 1 || w.sy !== 1 ? ` scale(${k3(w.sx)} ${k3(w.sy)})` : '') + ` translate(0 ${-R})`);
    const deg = w.rot / RAD;
    S.rot.setAttribute('transform', `rotate(${f2(deg)})`);
    S.shadow.setAttribute('cx', f2(X));
    S.shadow.setAttribute('rx', f2(50 * (1 - w.lift / 90)));
    S.shadow.setAttribute('opacity', f2(0.13 * (1 - w.lift / 70)));
    // Quarts : allumés (état final, qui s'éteint) ou qui s'allument à leur étape
    S.quads.forEach((q, i) => {
      let o, k = 1;
      if (final) o = fade;
      else { const p = prog(t, T_LIT[i], 0.4); o = clamp(p / 0.25); k = popScale(p); }
      if (show(q.lit, o)) q.lit.setAttribute('transform', k === 1 ? '' : `scale(${k3(k)})`);
      show(q.white, o);
      q.lg.setAttribute('transform', `translate(${f2(q.lx)} ${f2(q.ly)}) rotate(${f2(-deg)})`);
    });

    // Lignes de la fiche
    S.rows.forEach((r, i) => {
      let o, k = 1;
      if (final) o = fade;
      else { const p = prog(t, T_LIT[i], 0.4); o = clamp(p / 0.25); k = popScale(p); }
      if (show(r.tile, o)) scaleAt(r.tile, r.cx, r.cy, k);
      const pw = final ? 1 : prog(t, T_ROW[i], 0.5);
      r.clips.forEach((c, j) => {
        const q = final ? 1 : easeInOut(clamp((pw - 0.35 * j) / 0.65));
        c.setAttribute('width', f2(Math.max(0.01, (ROW_X1 - BX + 6) * q)));
      });
      show(r.body, final ? fade : (pw > 0 ? 1 : 0));
      // Étapes sautées : la ligne clignote en rouge pendant la tentative
      let red = 0;
      if (!final) HOPS.forEach((h, hi) => {
        const skipped = hi === 0 ? [1, 2] : [2];
        if (skipped.includes(i)) { const p = prog(t, h.t + UP, 0.7); if (p > 0 && p < 1) red = Math.max(red, Math.sin(Math.PI * p)); }
      });
      r.card.setAttribute('stroke', red > 0.05 ? C.red : CARD_LINE);
      r.card.setAttribute('stroke-width', f2(2 + 1.5 * red));
    });

    // Départ, prévu, hypothèse
    S.base.forEach((g, i) => { if (show(g, vis(T_BASE[i], 0.2))) scaleAt(g, BASE_X[i], yOf(BASE_V[i]), pop(T_BASE[i], 0.3)); });
    show(S.base25, vis(T_25, 0.3));
    show(S.baseZone, vis(T_BASE[0], 0.3));
    [[S.prevu, T_PREVU, S.prevuLabel], [S.hyp, T_HYP, S.hypLabel]].forEach(([ln, ts, lab]) => {
      const p = final ? 1 : easeInOut(prog(t, ts, LINE_DUR));
      ln.r.setAttribute('width', f2(Math.max(0.01, (PX1 - PX0) * p)));
      show(ln.g, final ? fade : (p > 0 ? 1 : 0));
      show(lab, vis(ts + 0.15, 0.3));
    });
    if (show(S.hypOk, vis(T_HYPOK, 0.3))) scaleAt(S.hypOk, S.hypOkC[0], S.hypOkC[1], pop(T_HYPOK));

    // Jours de test, en direct
    let n = 0;
    S.pts.forEach((p, i) => {
      const ts = T_PT[i];
      if (!final && t >= ts) n = i + 1;
      if (show(p.g, vis(ts, 0.12))) scaleAt(p.g, p.x, p.y, pop(ts, 0.3));
      // Le point du jour pulse tant qu'il est le dernier
      const live = !final && t >= ts && (i === 9 ? t < ts + 0.6 : t < T_PT[i + 1]);
      const u = live ? ((t - ts) % 0.45) / 0.45 : 0;
      p.halo.setAttribute('r', f2(7 + 9 * u));
      p.halo.setAttribute('stroke-opacity', f2(live ? 0.8 * (1 - u) : 0));
    });
    S.segs.forEach((s, i) => {
      const p = final ? 1 : easeOut(prog(t, T_PT[i] + 0.03, 0.11));
      if (p >= 1) s.n.removeAttribute('stroke-dasharray'); else s.n.setAttribute('stroke-dasharray', f2(s.len));
      s.n.setAttribute('stroke-dashoffset', f2(p >= 1 ? 0 : s.len * (1 - p)));
      show(s.n, final ? fade : (p > 0 ? 1 : 0));
    });
    const liveOn = !final && t >= T_PT[0] - 0.05 && t < T_PT[9] + 0.6;
    show(S.liveZone, liveOn ? 1 : 0);
    if (liveOn) {
      S.liveText.textContent = `Jour ${Math.max(1, n)}${NB}/${NB}10`;
      const b = S.liveText.getBBox();
      S.liveDot.setAttribute('cx', f2(b.x - 10));
      S.liveDot.setAttribute('opacity', f2(0.4 + 0.6 * Math.abs(Math.cos(t * Math.PI / 0.6))));
    }
    show(S.testZone, final ? fade : prog(t, T_PT[9] + 0.72, 0.25));

    // Check
    const pg = final ? 1 : easeInOut(prog(t, T_GHOSTLINE, 0.4));
    S.ghostClip.setAttribute('width', f2(Math.max(0.01, (BR_X - 276) * pg)));
    show(S.ghostLine, final ? fade : (pg > 0 ? 1 : 0));
    const pb = final ? 1 : easeInOut(prog(t, T_BRACKET, 0.35));
    if (pb >= 1) S.bracket.removeAttribute('stroke-dasharray'); else S.bracket.setAttribute('stroke-dasharray', f2(S.brLen));
    S.bracket.setAttribute('stroke-dashoffset', f2(pb >= 1 ? 0 : S.brLen * (1 - pb)));
    show(S.bracket, final ? fade : (pb > 0 ? 1 : 0));
    const pc = final ? 1 : prog(t, T_BRACKET + 0.1, 0.5);
    S.gain.textContent = `−${Math.round(12 * easeOut(pc))}${NB}min`;
    show(S.gain, final ? fade : clamp(pc / 0.15));
    // Effet imprévu : la question, puis la réponse vérifiée (l'une sort avant que l'autre entre)
    const qIn = final ? 0 : prog(t, T_EFF, 0.25) * (1 - prog(t, T_EFF2, 0.14));
    if (show(S.effQ, qIn)) scaleAt(S.effQ, 340, 499, popScale(prog(t, T_EFF, 0.3)));
    if (show(S.effOk, vis(T_EFF2 + 0.16, 0.25))) scaleAt(S.effOk, 340, 499, pop(T_EFF2 + 0.16, 0.35));

    // Standard : sort du sol derrière la roue, puis le kit et la fiche y entrent
    const pbk = final ? 1 : easeOut(prog(t, T_BLOCK, 0.4));
    if (show(S.block, final ? fade : (pbk > 0 ? 1 : 0))) S.blockIn.setAttribute('transform', pbk >= 1 ? '' : `translate(0 ${f2((A - BLOCK.y0 + 4) * (1 - pbk))})`);
    [[S.kit, 0], [S.doc, 1]].forEach(([g, i]) => {
      const [x1, y1] = S.chipAt[i];
      const x0 = 662 + 32 * i, y0 = ROW_Y[3] + 37;
      const p = final ? 1 : prog(t, T_FLY[i], FLY);
      const q = easeInOut(p);
      const x = lerp(x0, x1, q), y = lerp(y0, y1, q) - 150 * Math.sin(Math.PI * q);
      const k = 1 + 0.45 * Math.sin(Math.PI * Math.min(1, p * 1.1));
      const landed = p >= 1;
      const o = final ? fade : clamp((t - T_FLY[i]) / 0.12);
      if (show(g, o)) {
        g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})` + (k !== 1 ? ` scale(${k3(k)})` : ''));
        if (!landed && !final) g.setAttribute('filter', 'url(#lift)'); else g.removeAttribute('filter');
      }
      show(S.chipT[i], final ? 1 : prog(t, T_FLY[i] + FLY - 0.05, 0.2));
    });

    // Tentatives de saut : roue fantôme à Act, barrière qui bloque
    let gho = 0, bo = 0, bk = 0, bx = 0, shake = 0;
    if (!final) HOPS.forEach(h => {
      const u = t - h.t;
      gho = Math.max(gho, prog(t, h.t - 0.1, 0.2) * (1 - prog(t, h.t + UP + DOWN + 0.08, 0.2)));
      if (u > -0.05 && u < UP + DOWN + 0.4) {
        bx = ST[h.st] + R + 30;
        const pin = prog(t, h.t + 0.04, 0.16), pout = prog(t, h.t + UP + DOWN + 0.1, 0.22);
        bk = pin <= 0 ? 0 : (pin >= 1 ? 1 : back(pin)) * (1 - easeIn(pout));
        bo = clamp(pin * 3) * (1 - pout);
        const ps = prog(t, h.t + UP, 0.35);
        if (ps > 0 && ps < 1) shake = 7 * Math.sin(ps * Math.PI * 5) * (1 - ps);
      }
    });
    show(S.ghost, gho);
    if (show(S.barrier, bo)) S.barrier.setAttribute('transform', `translate(${f2(bx)} ${A}) rotate(${f2(shake)}) scale(1 ${k3(bk)})`);

    // Erreurs : chaque case arrive au moment où la roue se bloque
    S.cells.forEach((c, i) => {
      const ts = HOPS[i].t + UP + 0.05;
      if (!show(c.g, vis(ts, 0.15))) return;
      const p = final ? 1 : prog(t, ts, 0.5);
      const dx = p > 0 && p < 1 ? 5 * Math.sin(p * Math.PI * 6) * (1 - p) : 0;
      c.g.setAttribute('transform', dx ? `translate(${f2(dx)} 0)` : '');
    });

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const last = i === PILLS.length - 1;
      const a = PILLS[i].t + 0.15;
      let o;
      if (final) o = last ? fade : 0;
      else o = prog(t, a, 0.25) * (last ? 1 : 1 - prog(t, PILLS[i + 1].t, 0.14));
      if (show(g, o)) {
        const dy = final ? 0 : 8 * (1 - prog(t, a, 0.25));
        g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
      }
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
