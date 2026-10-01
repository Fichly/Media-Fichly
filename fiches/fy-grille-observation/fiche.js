// Fiche LinkedIn · page Fichly · mardi 13 octobre 2026 (Buffer 6abe5ccb0c33e408f7a91913)
// Post : « Observer un poste pendant 30 minutes, tout le monde peut le faire. Revenir avec quelque chose
// d'exploitable, c'est plus rare. » · « Le visuel reprend la grille sur une page, à reproduire sur une feuille A4. »
// Premier commentaire du post : nos fiches Lean → encart.
// Le visuel EST la fiche : la grille d'observation (4 colonnes, ce qu'il faut noter, les 3 règles).
// Style propre : la scène en direct et le relevé horodaté. En haut, le poste vu de côté (magasin,
// opérateur, machine, observateur) et le chronomètre 0:00 → 30:00. Chaque événement se produit dans la
// scène ; au même instant un jeton part de la scène et une ligne horodatée s'écrit au stylo dans la bonne
// colonne de la feuille. Avant / pendant / après : les trois règles se cochent au fil de l'observation.
// Image t = 0 = la grille complète (relevés d'exemple et règles). Boucle exacte de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit, measure } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeIn = p => p * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const k3 = v => Math.max(0.001, v).toFixed(3);
  const scaleAt = (cx, cy, k) => (k === 1 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${k3(k)}) translate(${f2(-cx)} ${f2(-cy)})`);
  const show = (n, on) => n.setAttribute('display', on ? 'inline' : 'none');
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', PAPER_LINE = '#e6e6f0', ARM = '#3a3a8c', METAL = '#b9b9d6';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 742 };
  const SC = { x: 76, y: 424, w: 564, h: 140 };       // la scène, en direct
  const CC = { x: 654, y: 424, w: 350, h: 140 };      // le chronomètre
  const SH = { x: 76, y: 578, w: 928, h: 560 };       // la feuille : la grille à reproduire
  const FLOOR = 548, HOME = 386, MAG = 214, OBX = 596;
  const MACH = { x: 428, y: 466, w: 104 };
  const BIN = { x: 278, y: 490, w: 62 };
  const PARTS = [292, 314];                           // pièces brutes dans le bac
  const TRAY = { x: 410, y: 518 };
  const COL_W = 215, COL_X = [92, 319, 546, 773];
  const Y_HEAD = 636, Y_DEF = 698, Y_NOTE = 768, NOTE_H = 90, Y_ROWS = 868, ROW_H = 46, Y_RULES = 1016;
  const BAR = { x: 670, y: 534, w: 318 };

  // ---------- Contenu de la grille (mots du post) ----------
  const CATS = [
    { name: 'Attentes', col: C.teal, soft: '#e1f1f1', dark: '#2b6466',
      def: `L’opérateur ou la machine attend${NB}: une pièce, une info, une validation, la fin du cycle.`,
      note: [['quand'], ['combien de temps'], ['en attente de quoi']] },
    { name: 'Déplacements', col: C.violet, soft: '#f2e8f4', dark: '#6b3a74',
      def: `L’opérateur quitte sa zone ou fait un geste qui ne transforme rien${NB}: outil, magasin, demi-tour.`,
      note: [['où'], ['pourquoi'], ['combien de fois']] },
    { name: 'Ruptures', col: C.red, soft: C.pRed, dark: C.tRed,
      def: `Le travail s’interrompt${NB}: manque matière, panne, question à poser, priorité qui change.`,
      note: [['la cause annoncée'], ['qui a été sollicité']] },
    { name: 'Retouches', col: C.yellow, soft: C.pYellow, dark: C.tYellow,
      def: `Une opération est refaite ou corrigée${NB}: reprise, ajustement, tri, contrôle en plus.`,
      note: [['sur quoi'], ['comment le défaut', 'a été repéré']] },
  ];
  const RULES = [
    [['Prévenir l’équipe avant', 1], [`, et dire ce qu’on observe${NB}: le travail, pas la personne.`, 0]],
    [['Noter ce qu’on voit', 1], [', pas ce qu’on en pense. L’analyse vient après.', 0]],
    [['Montrer la grille remplie à l’opérateur', 1], [` avant de partir${NB}: il corrige souvent des interprétations.`, 0]],
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.2, ERASE = 0.45, T_SEQ = 1.75;      // l'état final, la gomme, puis la séquence
  const T_C0 = 2.75, T_C1 = 10.25;                    // le chronomètre : 0:00 → 30:00
  const tOf = m => T_C0 + (T_C1 - T_C0) * m / 30;
  const T_P = [1.75, 2.75, 10.3, 11.2];               // pastilles : avant · pendant · après · terminé
  const T_RULE = [2.35, 4.12, 10.8];                  // les règles se cochent

  // Relevés : minute d'observation, colonne, rangée, ce qui est noté (relevés d'exemple)
  const EV = [
    { cat: 0, row: 0, m: 2 + 10 / 60, src: 'op', count: 2, l2: 'fin du cycle machine', wrong: `opérateur lent${NB}?` },
    { cat: 1, row: 0, m: 7 + 20 / 60, src: 'mag', l1: 'magasin', badge: true, l2: 'chercher une clé' },
    { cat: 2, row: 0, m: 14, src: 'bin', l1: 'manque matière', l2: 'chef d’équipe appelé' },
    { cat: 3, row: 0, m: 18 + 40 / 60, src: 'tray', l1: 'pièce 12', l2: 'bavure, vue au toucher' },
    { cat: 1, upd: 1, m: 22, src: 'mag' },            // 2e passage au magasin : « 1 fois » → « 2 fois »
    { cat: 0, row: 1, m: 26 + 20 / 60, src: 'op', count: 3, l2: 'validation qualité' },
  ];
  EV.forEach(e => {
    e.te = tOf(e.m);
    e.tChip = e.te + 0.3;
    e.tL1 = e.te + 0.37;
    e.tBadge = e.te + 0.6;
    e.tL2 = e.te + (e.badge ? 0.66 : 0.62);
  });
  const A1 = EV[0], D1 = EV[1], R1 = EV[2], RE1 = EV[3], D2 = EV[4], A2 = EV[5];
  A1.tWrong = 3.7; A1.tStrike = 4.0; A1.tWrongOut = 4.25; A1.tL2 = 4.4;
  const WALKS = [D1, D2].map(e => [e.te, e.te + 0.47, e.te + 0.62, e.te + 1.04]);
  const GRABS = [3.95, 5.8];                          // l'opérateur prend une pièce dans le bac
  const T_REFILL = [7.0, 7.1];                        // le bac est réapprovisionné
  const TOKEN = 0.33, WIPE1 = 0.2, WIPE2 = 0.32;

  const mmss = M => { const s = Math.floor(M * 60 + 1e-6); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const chronoM = t => (t < T_OUT ? 30 : t < T_C0 ? 30 * (1 - easeInOut(prog(t, T_OUT, 0.4))) : 30 * prog(t, T_C0, T_C1 - T_C0));

  // ---------- Petits éléments ----------
  function rich(parent, x, y, parts, { size = 22, fill = C.ink, bold = C.blue } = {}) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': 500, fill }, parent);
    parts.forEach(([str, b]) => { const sp = el('tspan', b ? { 'font-weight': 700, fill: b === 1 ? bold : b } : {}, t); sp.textContent = str; });
    return t;
  }
  // Paragraphe coupé à la largeur (espaces insécables respectées)
  function wrap(parent, x, y, str, width, { size, weight = 500, fill = C.ink, lh }) {
    const probe = text(parent, x, y, '', { size, weight, fill });
    const lines = [];
    let cur = '';
    str.split(' ').forEach(w => {
      const next = cur ? `${cur} ${w}` : w;
      probe.textContent = next;
      if (probe.getComputedTextLength() > width && cur) { lines.push(cur); cur = w; } else cur = next;
    });
    if (cur) lines.push(cur);
    probe.remove();
    return lines.map((l, i) => text(parent, x, y + i * lh, l, { size, weight, fill }));
  }
  function pillShape(parent, x, cy, label, { bg, fg, icon = false, size = 16, h = 34 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 26 : 0;
    const tx = text(g, x + 16 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', measure(tx).width + 32 + iw);
    if (icon) {
      el('circle', { cx: x + 25, cy, r: 10, fill: C.green }, g);
      el('path', { d: `M ${x + 20.5} ${cy + 0.5} L ${x + 24} ${cy + 4} L ${x + 30} ${cy - 3}`, fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return { g, r };
  }
  // Bulle de parole (pointe vers le bas, en tailX)
  function bubble(parent, cx, by, w, h, tailX) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${tailX - 7} ${by - 1} L ${tailX} ${by + 8} L ${tailX + 7} ${by - 1} Z`, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    el('rect', { x: cx - w / 2, y: by - h, width: w, height: h, rx: h / 2, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
    el('rect', { x: tailX - 5.5, y: by - 2.5, width: 11, height: 3.5, fill: C.white }, g);
    return g;
  }
  function checkDisc(parent, cx, cy, r = 10) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: C.green }, g);
    el('path', { d: `M ${cx - r * 0.45} ${cy + r * 0.05} L ${cx - r * 0.1} ${cy + r * 0.4} L ${cx + r * 0.5} ${cy - r * 0.3}`, fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function hourglass(parent, cx, cy, color) {
    const g = el('g', { transform: `translate(${cx} ${cy})` }, parent);
    el('path', { d: 'M -6 -8 H 6 M -6 8 H 6 M -4.5 -8 C -4.5 -2, 4.5 2, 4.5 8 M 4.5 -8 C 4.5 -2, -4.5 2, -4.5 8', fill: 'none', stroke: color, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g);
    el('path', { d: 'M -2.8 6.5 L 0 3.5 L 2.8 6.5 Z', fill: color }, g);
    return g;
  }
  function wrench(parent) {
    const g = el('g', {}, parent);
    const r = el('g', { transform: 'rotate(-35)' }, g);
    el('rect', { x: -2.2, y: -2, width: 4.4, height: 16, rx: 2.2, fill: C.ink }, r);
    el('circle', { cx: 0, cy: -4, r: 5.2, fill: C.ink }, r);
    el('rect', { x: -1.8, y: -10.5, width: 3.6, height: 6, fill: C.white }, r);
    return g;
  }
  // Silhouette vue de côté (repère : les pieds, tournée vers la droite)
  function figure(parent, { body, helmet = false }) {
    const g = el('g', {}, parent);
    const leg = x => el('line', { x1: x, y1: -20, x2: x, y2: -3.5, stroke: C.ink, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    const legL = leg(-5), legR = leg(5);
    const torso = el('g', {}, g);
    el('rect', { x: -13, y: -55, width: 26, height: 38, rx: 12, fill: body }, torso);
    el('circle', { cx: 0, cy: -67, r: 10.5, fill: body }, torso);
    el('circle', { cx: 5, cy: -68, r: 1.9, fill: C.white }, torso);
    if (helmet) {
      el('path', { d: 'M -11.5 -70 A 11.5 11.5 0 0 1 11.5 -70 Z', fill: C.yellow }, torso);
      el('rect', { x: -12, y: -71.5, width: 28, height: 3.5, rx: 1.75, fill: C.yellow }, torso);
    }
    const arm = el('line', { x1: 3, y1: -46, x2: 9, y2: -27, stroke: helmet ? ARM : '#4f86bf', 'stroke-width': 6.5, 'stroke-linecap': 'round' }, torso);
    return { g, legL, legR, torso, arm };
  }
  function pose(f, x, face, swing, bob, hand) {
    f.g.setAttribute('transform', `translate(${f2(x)} ${FLOOR}) scale(${face.toFixed(3)} 1)`);
    f.legL.setAttribute('x2', f2(-5 + swing));
    f.legR.setAttribute('x2', f2(5 - swing));
    f.torso.setAttribute('transform', bob ? `translate(0 ${f2(-bob)})` : '');
    f.arm.setAttribute('x2', f2(hand[0]));
    f.arm.setAttribute('y2', f2(hand[1]));
  }
  // Compteur qui roule (n → n + 1 selon k) dans une fenêtre découpée
  let clipN = 0;
  function roller(parent, x, y, fmt, { size, weight, fill, anchor = 'start', step = 22 }) {
    const id = `roll${clipN++}`;
    const cp = el('clipPath', { id }, D.svg.querySelector('defs'));
    const cr = el('rect', { x: x - 120, y: y - size - 2, width: 240, height: size + 8 }, cp);
    const g = el('g', { 'clip-path': `url(#${id})` }, parent);
    const a = text(g, x, y, fmt(0), { size, weight, fill, anchor });
    const b = text(g, x, y, fmt(1), { size, weight, fill, anchor });
    return {
      g, a, cr,
      set(n, k) {
        a.textContent = fmt(n);
        b.textContent = fmt(n + 1);
        a.setAttribute('y', f2(y - step * k));
        b.setAttribute('y', f2(y + step * (1 - k)));
        show(b, k > 0);
      },
    };
  }
  // Ligne écrite au stylo : révélée de gauche à droite (découpe)
  function penLine(parent, x, y, str, { size, weight, fill = C.blue }) {
    const id = `pen${clipN++}`;
    const cp = el('clipPath', { id }, D.svg.querySelector('defs'));
    const g = el('g', { 'clip-path': `url(#${id})` }, parent);
    const n = text(g, x, y, str, { size, weight, fill });
    const b = measure(n);
    const cr = el('rect', { x: b.x - 3, y: y - size - 4, width: 0, height: size + 12 }, cp);
    return { g, n, cr, x0: b.x - 3, w: b.width + 6, y };
  }

  const S = { rows: [], writes: [], ticks: [], rules: [] };

  function build() {
    D.template({ author: null });
    D.title('La grille d’observation', 'en 4 colonnes', 1020);
    D.chapeau('Pour revenir de 30 minutes au poste avec quelque chose d’exploitable.');

    // Explication courte au-dessus du visuel
    fit(rich(D.svg, 62, 352, [['En direct, chaque événement vu au poste s’inscrit, ', 0], ['horodaté', 1], [', dans ', 0], ['sa colonne', 1], ['.', 0]]), 1020, 'explication 1');
    fit(rich(D.svg, 62, 384, [['Dans chaque colonne, ', 0], ['ce qu’il faut noter', 1], ['. La grille se reproduit sur une ', 0], ['feuille A4', 1], ['.', 0]]), 1020, 'explication 2');

    const defs = el('defs');
    const paper = el('filter', { id: 'paper', x: '-5%', y: '-5%', width: '110%', height: '115%' }, defs);
    el('feDropShadow', { dx: 0, dy: 5, stdDeviation: 7, 'flood-color': C.ink, 'flood-opacity': 0.1 }, paper);
    const cpErase = el('clipPath', { id: 'erase' }, defs);
    S.eraseRect = el('rect', { x: SH.x, y: SH.y, width: SH.w, height: SH.h }, cpErase);
    const cpTrail = el('clipPath', { id: 'trail' }, defs);
    S.trailRect = el('rect', { x: MAG, y: 540, width: 0, height: 30 }, cpTrail);

    // ----- Cadre -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ===== La scène, en direct =====
    el('rect', { x: SC.x, y: SC.y, width: SC.w, height: SC.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    const sc = el('g');
    el('line', { x1: SC.x + 16, y1: FLOOR, x2: SC.x + SC.w - 16, y2: FLOOR, stroke: '#cfcfe3', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, sc);
    // Trajet vers le magasin (pointillés au sol, révélés derrière l'opérateur)
    S.trail = el('g', { 'clip-path': 'url(#trail)' }, sc);
    el('line', { x1: MAG, y1: 557, x2: HOME, y2: 557, stroke: C.violet, 'stroke-width': 4, 'stroke-dasharray': '0.1 10', 'stroke-linecap': 'round' }, S.trail);
    // Magasin
    el('rect', { x: 96, y: 450, width: 88, height: 21, rx: 5, fill: C.ink }, sc);
    fit(text(sc, 140, 465.5, 'Magasin', { size: 15, weight: 700, fill: C.white, anchor: 'middle' }), 182, 'magasin', 98);
    [100, 180].forEach(x => el('line', { x1: x, y1: 471, x2: x, y2: FLOOR, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, sc));
    [500, 526].forEach(y => el('line', { x1: 100, y1: y, x2: 180, y2: y, stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, sc));
    [[106, 484, 20, C.lightBlue], [130, 486, 18, '#cfcfe3'], [152, 484, 22, C.yellow], [107, 510, 22, '#cfcfe3'], [134, 512, 18, C.lightBlue], [157, 510, 18, C.teal],
      [108, 530, 28, C.lightBlue], [142, 532, 30, '#cfcfe3']].forEach(([x, y, w, c]) => el('rect', { x, y, width: w, height: (y > 528 ? FLOOR : y > 505 ? 526 : 500) - y - 2, rx: 3, fill: c }, sc));
    // Établi et bac de pièces brutes
    el('rect', { x: 262, y: 512, width: 86, height: 7, rx: 3, fill: C.ink }, sc);
    [270, 340].forEach(x => el('line', { x1: x, y1: 519, x2: x, y2: FLOOR, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, sc));
    S.parts = PARTS.map(x => el('rect', { x: x - 8, y: 476, width: 16, height: 16, rx: 3.5, fill: METAL }, sc));
    el('rect', { x: BIN.x, y: BIN.y, width: BIN.w, height: 22, rx: 4, fill: C.lightBlue }, sc);
    el('line', { x1: BIN.x + 10, y1: BIN.y + 8, x2: BIN.x + BIN.w - 10, y2: BIN.y + 8, stroke: C.white, 'stroke-opacity': 0.6, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, sc);
    // Machine
    el('rect', { x: MACH.x + 8, y: FLOOR - 7, width: 14, height: 7, rx: 2, fill: C.ink }, sc);
    el('rect', { x: MACH.x + MACH.w - 22, y: FLOOR - 7, width: 14, height: 7, rx: 2, fill: C.ink }, sc);
    el('rect', { x: MACH.x, y: MACH.y, width: MACH.w, height: FLOOR - 6 - MACH.y, rx: 10, fill: C.blue }, sc);
    el('rect', { x: MACH.x + 12, y: MACH.y + 12, width: 80, height: 20, rx: 5, fill: C.white, 'fill-opacity': 0.92 }, sc);
    el('rect', { x: MACH.x + 18, y: MACH.y + 19, width: 68, height: 6, rx: 3, fill: '#e3e3f0' }, sc);
    S.cycle = el('rect', { x: MACH.x + 18, y: MACH.y + 19, width: 68, height: 6, rx: 3, fill: C.green }, sc);
    el('rect', { x: MACH.x + 12, y: MACH.y + 40, width: 52, height: 28, rx: 5, fill: '#3d3d8e' }, sc);
    S.light = el('circle', { cx: MACH.x + 88, cy: MACH.y + 54, r: 6.5, fill: C.green }, sc);
    el('rect', { x: TRAY.x - 2, y: TRAY.y, width: 22, height: 5, rx: 2, fill: C.ink }, sc);
    // La pièce qui sort de la machine (retouche)
    S.part = el('g', {}, sc);
    S.partBox = el('rect', { x: -8, y: -16, width: 16, height: 16, rx: 3.5, fill: METAL }, S.part);
    S.sparks = el('g', {}, sc);
    [[-14, -22, -20, -28], [13, -24, 19, -31], [-2, -28, -2, -36]].forEach(([x1, y1, x2, y2]) => el('line', { x1, y1, x2, y2, stroke: C.yellow, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, S.sparks));
    S.bad = el('g', {}, sc);
    el('circle', { cx: 0, cy: 0, r: 8.5, fill: C.red }, S.bad);
    el('path', { d: 'M -3 -3 L 3 3 M 3 -3 L -3 3', stroke: C.white, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, S.bad);
    S.good = checkDisc(sc, 0, 0, 8.5);

    // Silhouettes : l'opérateur (casque), l'observateur (planchette)
    S.op = figure(sc, { body: C.blue, helmet: true });
    S.wrench = wrench(sc);
    S.obs = figure(sc, { body: C.lightBlue });
    S.board = el('g', {}, S.obs.torso);
    el('rect', { x: 9, y: -54, width: 17, height: 23, rx: 2.5, fill: C.white, stroke: C.ink, 'stroke-width': 2 }, S.board);
    el('rect', { x: 13.5, y: -57, width: 8, height: 5, rx: 1.5, fill: C.ink }, S.board);
    [-47, -42, -37].forEach(y => el('line', { x1: 12.5, y1: y, x2: 22.5, y2: y, stroke: C.blue, 'stroke-width': 1.6 }, S.board));
    S.pen = el('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: C.yellow, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.obs.torso);

    // Bulles et alertes de la scène
    S.bOp = bubble(sc, HOME, 458, 44, 28, HOME);
    checkDisc(S.bOp, HOME, 444, 9);
    S.bWait = bubble(sc, HOME, 458, 44, 28, HOME);
    hourglass(S.bWait, HOME, 444, C.teal);
    S.bChef = bubble(sc, HOME - 6, 458, 76, 28, HOME);
    fit(text(S.bChef, HOME - 6, 449.5, `Chef${NB}?`, { size: 15, weight: 700, fill: C.tRed, anchor: 'middle' }), HOME + 32, 'bulle chef', HOME - 44);
    const obsLbl = `J’observe le travail`;
    const probe = text(sc, 0, 0, obsLbl, { size: 15, weight: 700 });
    const ow = measure(probe).width + 28;
    probe.remove();
    S.bObs = bubble(sc, SC.x + SC.w - 12 - ow / 2, 458, ow, 28, OBX);
    fit(text(S.bObs, SC.x + SC.w - 12 - ow / 2, 449.5, obsLbl, { size: 15, weight: 700, fill: C.ink, anchor: 'middle' }), SC.x + SC.w - 12, 'bulle observateur', HOME + 30);
    S.alert = el('g', {}, sc);
    el('circle', { cx: 0, cy: 0, r: 11, fill: C.red }, S.alert);
    text(S.alert, 0, 5.5, '!', { size: 16, weight: 800, fill: C.white, anchor: 'middle' });

    // ===== Le chronomètre =====
    el('rect', { x: CC.x, y: CC.y, width: CC.w, height: CC.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    const swx = 697, swy = 506;
    el('rect', { x: swx - 3.5, y: swy - 27, width: 7, height: 5, rx: 1.5, fill: C.blue });
    el('circle', { cx: swx, cy: swy, r: 20, fill: C.white, stroke: C.blue, 'stroke-width': 3.5 });
    S.sector = el('path', { d: '', fill: C.lightBlue, 'fill-opacity': 0.45 });
    S.hand = el('line', { x1: swx, y1: swy, x2: swx, y2: swy - 13, stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round' });
    el('circle', { cx: swx, cy: swy, r: 2.6, fill: C.blue });
    S.sw = { x: swx, y: swy };
    S.digits = text(D.svg, 730, 522, '30:00', { size: 46, weight: 800, fill: C.ink });
    fit(S.digits, 880, 'chrono');
    S.rec = el('g');
    el('circle', { cx: 900, cy: 506, r: 6, fill: C.red }, S.rec);
    fit(text(S.rec, BAR.x + BAR.w, 511.5, 'en direct', { size: 15, weight: 700, fill: C.tRed, anchor: 'end' }), BAR.x + BAR.w, 'en direct', 910);
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: 8, rx: 4, fill: '#e6e6f2' });
    S.barFill = el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: 8, rx: 4, fill: C.blue, 'fill-opacity': 0.35 });
    EV.forEach(e => {
      const g = el('g');
      el('circle', { cx: BAR.x + BAR.w * e.m / 30, cy: BAR.y + 4, r: 6.5, fill: CATS[e.cat].col, stroke: C.white, 'stroke-width': 2 }, g);
      S.ticks.push({ g, e, cx: BAR.x + BAR.w * e.m / 30 });
    });
    text(D.svg, BAR.x, 559, '0:00', { size: 15, weight: 500, fill: MUTED });
    text(D.svg, BAR.x + BAR.w, 559, '30:00', { size: 15, weight: 500, fill: MUTED, anchor: 'end' });

    // Pastilles d'étape (dans la carte du chronomètre)
    const PILLS = [
      [`Avant${NB}: prévenir l’équipe`, C.blue, C.white],
      [`Pendant${NB}: noter ce qu’on voit`, C.blue, C.white],
      [`Après${NB}: montrer la grille`, C.blue, C.white],
      ['Observation terminée', C.pGreen, C.tGreen, true],
    ];
    S.pills = PILLS.map(([label, bg, fg, icon], i) => {
      const p = pillShape(D.svg, 670, 452, label, { bg, fg, icon });
      fit(p.r, BAR.x + BAR.w, `pastille ${i + 1}`);
      return p.g;
    });

    // ===== La feuille : la grille d'observation =====
    const x0 = SH.x, y0 = SH.y, x1 = SH.x + SH.w, y1 = SH.y + SH.h, DOG = 24;
    el('path', { d: `M ${x0 + 8} ${y0} H ${x1 - DOG} L ${x1} ${y0 + DOG} V ${y1 - 8} Q ${x1} ${y1} ${x1 - 8} ${y1} H ${x0 + 8} Q ${x0} ${y1} ${x0} ${y1 - 8} V ${y0 + 8} Q ${x0} ${y0} ${x0 + 8} ${y0} Z`, fill: C.white, stroke: PAPER_LINE, 'stroke-width': 1.5, filter: 'url(#paper)' });
    el('path', { d: `M ${x1 - DOG} ${y0} V ${y0 + DOG - 4} Q ${x1 - DOG} ${y0 + DOG} ${x1 - DOG + 4} ${y0 + DOG} H ${x1} Z`, fill: '#ececf5', stroke: PAPER_LINE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
    // En-tête de la feuille
    const ht = text(D.svg, 100, 609, 'Observation de poste', { size: 19, weight: 800, fill: C.blue });
    let fx = measure(ht).x + measure(ht).width + 28;
    [['Poste', 84], ['Date', 66], ['Observateur', 84]].forEach(([lbl, w]) => {
      const n = text(D.svg, fx, 609, lbl, { size: 15, weight: 500, fill: MUTED });
      const lx = measure(n).x + measure(n).width + 6;
      el('line', { x1: lx, y1: 611, x2: lx + w, y2: 611, stroke: '#c9c9de', 'stroke-width': 1.5 });
      fx = lx + w + 18;
    });
    const dur = rich(D.svg, x1 - DOG - 12, 609, [[`Durée${NB}: `, 0], [`30${NB}min`, C.ink]], { size: 15, fill: MUTED });
    dur.setAttribute('text-anchor', 'end');
    fit(dur, x1 - DOG - 10, 'durée', fx - 10);
    el('line', { x1: 92, y1: 622, x2: 988, y2: 622, stroke: PAPER_LINE, 'stroke-width': 2 });
    // Séparations verticales des colonnes
    COL_X.slice(1).forEach(x => el('line', { x1: x - 6, y1: Y_HEAD, x2: x - 6, y2: Y_ROWS + 3 * ROW_H, stroke: PAPER_LINE, 'stroke-width': 1.5 }));

    S.heads = CATS.map((c, i) => {
      const x = COL_X[i];
      const head = el('rect', { x, y: Y_HEAD, width: COL_W, height: 40, rx: 10, fill: c.soft, 'stroke-width': 2.5, stroke: 'none' });
      el('circle', { cx: x + 22, cy: Y_HEAD + 20, r: 14, fill: c.col });
      text(D.svg, x + 22, Y_HEAD + 26, String(i + 1), { size: 16, weight: 800, fill: C.white, anchor: 'middle' });
      fit(text(D.svg, x + 44, Y_HEAD + 27, c.name, { size: 19, weight: 800, fill: C.ink }), x + COL_W - 8, `colonne ${i + 1}`);
      const lines = wrap(D.svg, x + 8, Y_DEF, c.def, COL_W - 16, { size: 15, weight: 500, fill: C.ink, lh: 19 });
      if (lines.length > 4) console.error(`Débordement : définition ${i + 1} (${lines.length} lignes)`);
      lines.forEach((n, k) => fit(n, x + COL_W - 6, `définition ${i + 1} ligne ${k + 1}`, x));
      // À noter
      el('rect', { x, y: Y_NOTE, width: COL_W, height: NOTE_H, rx: 9, fill: FRAME_BG });
      text(D.svg, x + 12, Y_NOTE + 21, 'À noter', { size: 15, weight: 800, fill: c.dark });
      let ly = Y_NOTE + 42;
      c.note.forEach(parts => parts.forEach((p, k) => {
        if (k === 0) el('circle', { cx: x + 16, cy: ly - 5.5, r: 3, fill: c.col });
        fit(text(D.svg, x + 26, ly, p, { size: 16, weight: 500, fill: C.ink }), x + COL_W - 6, `à noter ${i + 1} · ${p}`);
        ly += 20;
      }));
      if (ly - 20 > Y_NOTE + NOTE_H - 6) console.error(`Débordement : à noter ${i + 1}`);
      // Lignes du relevé (à remplir)
      for (let r = 1; r <= 3; r++) el('line', { x1: x, y1: Y_ROWS + r * ROW_H, x2: x + COL_W, y2: Y_ROWS + r * ROW_H, stroke: '#c9c9de', 'stroke-width': 1.5, 'stroke-dasharray': '1.5 5', 'stroke-linecap': 'round' });
      return head;
    });

    // ----- Les relevés (au stylo bleu) -----
    S.rowsLayer = el('g', { 'clip-path': 'url(#erase)' });
    EV.forEach(e => {
      if (e.upd) return;
      const c = CATS[e.cat], x = COL_X[e.cat], y = Y_ROWS + e.row * ROW_H;
      const R = { e };
      R.flash = el('rect', { x: x - 3, y: y + 1, width: COL_W + 6, height: ROW_H - 3, rx: 7, fill: c.soft }, S.rowsLayer);
      R.chip = el('g', {}, S.rowsLayer);
      const cr = el('rect', { x, y: y + 5, height: 22, rx: 6, fill: c.soft }, R.chip);
      const ct = text(R.chip, x + 7, y + 21, mmss(e.m), { size: 15, weight: 800, fill: c.dark });
      const cw = measure(ct).width + 14;
      cr.setAttribute('width', cw);
      R.chipC = [x + cw / 2, y + 16];
      const lx = x + cw + 8;
      if (e.count) {
        R.count = roller(S.rowsLayer, lx, y + 22, n => `${n}${NB}min`, { size: 16, weight: 700, fill: C.blue });
        R.count.set(e.count, 0);
        fit(R.count.a, x + COL_W - 4, `relevé ${e.cat + 1}.${e.row + 1} durée`);
      } else {
        R.l1 = penLine(S.rowsLayer, lx, y + 22, e.l1, { size: 16, weight: 700 });
        fit(R.l1.n, e.badge ? x + COL_W - 70 : x + COL_W - 4, `relevé ${e.cat + 1}.${e.row + 1} ligne 1`);
        S.writes.push({ w: R.l1, t0: e.tL1, d: WIPE1 });
      }
      if (e.badge) {
        R.badge = el('g', {}, S.rowsLayer);
        const bw = 58, bx = x + COL_W - bw;
        el('rect', { x: bx, y: y + 5, width: bw, height: 22, rx: 11, fill: c.soft }, R.badge);
        R.badgeRoll = roller(R.badge, bx + bw / 2, y + 21, n => `${n}${NB}fois`, { size: 15, weight: 800, fill: c.dark, anchor: 'middle', step: 20 });
        R.badgeRoll.cr.setAttribute('x', bx);
        R.badgeRoll.cr.setAttribute('width', bw);
        R.badgeRoll.cr.setAttribute('y', y + 5);
        R.badgeRoll.cr.setAttribute('height', 22);
        R.badgeRoll.set(2, 0);
        fit(R.badgeRoll.a, bx + bw - 4, 'badge fois', bx + 4);
        R.badgeC = [bx + bw / 2, y + 16];
      }
      R.l2 = penLine(S.rowsLayer, x + 2, y + 41, e.l2, { size: 15, weight: 500 });
      fit(R.l2.n, x + COL_W - 2, `relevé ${e.cat + 1}.${e.row + 1} ligne 2`);
      S.writes.push({ w: R.l2, t0: e.tL2, d: WIPE2 });
      if (e.wrong) {
        R.wrong = penLine(S.rowsLayer, x + 2, y + 41, e.wrong, { size: 15, weight: 500 });
        S.writes.push({ w: R.wrong, t0: e.tWrong, d: 0.25, wrong: true });
        const wb = measure(R.wrong.n);
        R.strikeLen = wb.width + 8;
        R.strike = el('line', { x1: wb.x - 4, y1: y + 36, x2: wb.x + wb.width + 4, y2: y + 35, stroke: C.red, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-dasharray': f2(R.strikeLen), 'stroke-dashoffset': f2(R.strikeLen) }, S.rowsLayer);
        R.strikeG = R.wrong.g;
      }
      S.rows.push(R);
    });
    S.rowOf = e => S.rows.find(R => R.e === e) || S.rows.find(R => R.e === D1);

    // ----- Les trois règles, en pied de grille -----
    el('line', { x1: 92, y1: Y_RULES, x2: 988, y2: Y_RULES, stroke: PAPER_LINE, 'stroke-width': 2 });
    text(D.svg, 100, Y_RULES + 24, 'Trois règles pour que la grille serve vraiment', { size: 15, weight: 800, fill: MUTED });
    RULES.forEach((parts, i) => {
      const y = Y_RULES + 50 + i * 27;
      const hl = el('rect', { x: 0, y: y - 18, width: 0, height: 25, rx: 5, fill: C.pYellow });
      el('circle', { cx: 110, cy: y - 6, r: 10, fill: C.white, stroke: '#c9c9de', 'stroke-width': 2 });
      const chk = checkDisc(D.svg, 110, y - 6, 10);
      const n = rich(D.svg, 130, y, parts, { size: 17, bold: C.ink });
      fit(n, 988, `règle ${i + 1}`);
      const lead = n.firstChild;
      const lb = lead.getBBox();
      hl.setAttribute('x', f2(lb.x - 5));
      S.rules.push({ chk, hl, hw: lb.width + 10, c: [110, y - 6] });
    });

    // Jeton : de la scène vers la colonne
    S.token = el('circle', { cx: 0, cy: 0, r: 9, fill: C.blue, stroke: C.white, 'stroke-width': 3 });
    // Gomme (effacement) et stylo (écriture)
    S.eraser = el('g');
    const er = el('g', { transform: 'rotate(-14)' }, S.eraser);
    el('rect', { x: -26, y: -13, width: 52, height: 26, rx: 6, fill: '#f6c7c7', stroke: C.red, 'stroke-width': 2 }, er);
    el('rect', { x: 2, y: -13, width: 24, height: 26, rx: 6, fill: C.blue }, er);
    el('rect', { x: 2, y: -13, width: 8, height: 26, fill: C.blue }, er);
    S.pencil = el('g');
    const pr = el('g', { transform: 'rotate(-38)' }, S.pencil);
    el('path', { d: 'M 0 0 L 6 -5 L 6 5 Z', fill: '#f2d7a6' }, pr);
    el('path', { d: 'M 0 0 L 2.2 -1.8 L 2.2 1.8 Z', fill: C.ink }, pr);
    el('rect', { x: 6, y: -5, width: 30, height: 10, rx: 1.5, fill: C.yellow }, pr);
    el('rect', { x: 34, y: -5, width: 6, height: 10, rx: 2, fill: C.red }, pr);

    D.encart(['Aller plus loin', 'Nos fiches Lean', '(lien en commentaire)']);
  }

  // ---------- L'opérateur à l'instant s ----------
  const HAND = { rest: [9, -27], reach: [31, -40], up: [23, -60] };
  const mixH = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  const turn = (s, a, from, to, d = 0.09) => lerp(from, to, easeInOut(prog(s, a, d)));
  function opState(s) {
    const st = { x: HOME, face: 1, swing: 0, bob: 0, hand: HAND.rest, carry: 0 };
    for (const [t0, tA, tL, tB] of WALKS) {
      if (s >= t0 && s < tB) {
        if (s < tA) { const p = easeInOut(prog(s, t0, tA - t0)); st.x = lerp(HOME, MAG, p); st.face = turn(s, t0, 1, -1); }
        else if (s < tL) { st.x = MAG; st.face = -1; st.hand = mixH(HAND.rest, HAND.up, Math.sin(Math.PI * prog(s, tA, tL - tA))); }
        else { const p = easeInOut(prog(s, tL, tB - tL)); st.x = lerp(MAG, HOME, p); st.face = turn(s, tL, -1, 1); st.carry = 1; }
        const ph = Math.PI * 6 * Math.abs(HOME - st.x) / (HOME - MAG);
        if (s < tA || s >= tL) { st.swing = 6 * Math.sin(ph); st.bob = 1.8 * Math.abs(Math.sin(ph)); }
        return st;
      }
      if (s >= tB && s < tB + 0.18) st.carry = 1 - prog(s, tB + 0.04, 0.14);
    }
    for (const tg of GRABS) {                          // se tourne vers le bac, prend, charge la machine
      if (s >= tg - 0.14 && s < tg + 0.34) {
        st.face = s < tg + 0.1 ? turn(s, tg - 0.14, 1, -1) : turn(s, tg + 0.1, -1, 1);
        st.hand = s < tg + 0.1 ? mixH(HAND.rest, HAND.reach, Math.sin(Math.PI * prog(s, tg - 0.1, 0.22))) : mixH(HAND.rest, HAND.reach, Math.sin(Math.PI * prog(s, tg + 0.16, 0.18)));
        return st;
      }
    }
    if (s >= R1.te - 0.12 && s < R1.te + 0.3) {        // le bac est vide
      st.face = s < R1.te + 0.18 ? turn(s, R1.te - 0.12, 1, -1) : turn(s, R1.te + 0.18, -1, 1);
      st.hand = mixH(HAND.rest, HAND.reach, Math.sin(Math.PI * prog(s, R1.te - 0.06, 0.24)));
      return st;
    }
    if (s >= RE1.te - 0.05 && s < RE1.te + 0.62) {     // touche la pièce, puis la reprend à la lime
      const k = Math.sin(Math.PI * prog(s, RE1.te - 0.05, 0.67));
      st.hand = mixH(HAND.rest, HAND.reach, Math.min(1, k * 1.6));
      const f = prog(s, RE1.te + 0.18, 0.4);
      if (f > 0 && f < 1) st.hand = [st.hand[0] + 3.5 * Math.sin(f * Math.PI * 8), st.hand[1]];
    }
    return st;
  }
  // Bulle : apparaît en rebond, disparaît vite
  function popBubble(g, s, a, b, cx, cy) {
    const on = s >= a && s < b + 0.12;
    show(g, on);
    if (!on) return;
    const k = popScale(prog(s, a, 0.3)) * (1 - easeIn(prog(s, b, 0.12)));
    g.setAttribute('transform', scaleAt(cx, cy, k));
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_SEQ;
    const s = final ? 99 : t;                          // temps de séquence (99 : tout est fait)
    const M = chronoM(t);
    const running = !final && t >= T_C0 && t < T_C1;

    // ----- Chronomètre -----
    S.digits.textContent = mmss(M);
    S.digits.setAttribute('fill', M >= 30 && !running ? C.tGreen : C.ink);
    const fr = clamp(M / 30), R0 = 18, a = fr * 2 * Math.PI;
    const ex = S.sw.x + R0 * Math.sin(a), ey = S.sw.y - R0 * Math.cos(a);
    S.sector.setAttribute('d', fr <= 0.001 ? '' : fr >= 0.999 ? `M ${S.sw.x} ${S.sw.y - R0} A ${R0} ${R0} 0 1 1 ${S.sw.x - 0.01} ${S.sw.y - R0} Z`
      : `M ${S.sw.x} ${S.sw.y} L ${S.sw.x} ${S.sw.y - R0} A ${R0} ${R0} 0 ${fr > 0.5 ? 1 : 0} 1 ${f2(ex)} ${f2(ey)} Z`);
    S.hand.setAttribute('x2', f2(S.sw.x + 13 * Math.sin(a)));
    S.hand.setAttribute('y2', f2(S.sw.y - 13 * Math.cos(a)));
    show(S.rec, running);
    if (running) S.rec.firstChild.setAttribute('opacity', f2(0.35 + 0.65 * (0.5 + 0.5 * Math.cos((t - T_C0) * Math.PI * 2 / 0.8))));
    S.barFill.setAttribute('width', f2(Math.max(0.001, BAR.w * fr)));
    S.ticks.forEach(({ g, e, cx }) => {
      let k;
      if (t < T_OUT) k = 1;
      else if (t < T_OUT + 0.25) k = 1 - easeIn(prog(t, T_OUT, 0.25));
      else k = popScale(prog(t, e.te, 0.3));
      show(g, k > 0.001);
      g.setAttribute('transform', scaleAt(cx, BAR.y + 4, k));
    });

    // ----- Pastilles : l'ancienne sort avant que la nouvelle entre -----
    S.pills.forEach((g, i) => {
      let o, dy = 0;
      if (final) o = i === 3 ? 1 - prog(t, T_OUT, 0.14) : 0;
      else {
        const a0 = T_P[i] + (i ? 0.12 : 0);
        o = prog(t, a0, 0.25) * (i < 3 ? 1 - prog(t, T_P[i + 1], 0.14) : 1);
        dy = 8 * (1 - easeOut(prog(t, a0, 0.25)));
      }
      show(g, o > 0.001);
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy > 0.01 ? `translate(0 ${f2(dy)})` : '');
    });

    // ----- Scène -----
    const op = opState(s);
    pose(S.op, op.x, op.face, op.swing, op.bob, op.hand);
    show(S.wrench, op.carry > 0.001);
    if (op.carry > 0.001) {
      const hx = op.x + op.face * op.hand[0], hy = FLOOR + op.hand[1] - op.bob;
      S.wrench.setAttribute('transform', `translate(${f2(hx)} ${f2(hy)}) scale(${k3(op.carry)})`);
    }
    // Trajet au sol : se dessine derrière l'opérateur, puis s'efface au retour
    let tw = 0, to = 0;
    for (const [t0, , tL, tB] of WALKS) {
      if (s >= t0 && s < tB + 0.35) { tw = HOME - (s < tL ? op.x : MAG); to = 1 - prog(s, tB, 0.35); }
    }
    S.trailRect.setAttribute('x', f2(HOME - tw));
    S.trailRect.setAttribute('width', f2(Math.max(0.001, tw)));
    show(S.trail, to > 0.001);
    S.trail.setAttribute('opacity', f2(to));
    // Bac : pièces prises, puis réapprovisionné
    S.parts.forEach((p, i) => {
      const taken = s >= GRABS[i] && s < T_REFILL[i];
      show(p, !taken);
      const pd = prog(s, T_REFILL[i], 0.28);
      const dy = s >= T_REFILL[i] && pd < 1 ? -34 * (1 - easeIn(Math.min(1, pd / 0.7))) + (pd > 0.7 ? -4 * Math.sin(Math.PI * (pd - 0.7) / 0.3) : 0) : 0;
      p.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
    // Alerte « bac vide »
    const alertOn = s >= R1.te && s < T_REFILL[0] + 0.1;
    show(S.alert, alertOn);
    if (alertOn) {
      const pin = popScale(prog(s, R1.te, 0.3));
      const pulse = pin >= 1 ? 1 + 0.08 * Math.sin((s - R1.te) * Math.PI * 2 / 0.5) : 1;
      S.alert.setAttribute('transform', `translate(${BIN.x + BIN.w / 2} 464) scale(${k3(pin * pulse * (1 - easeIn(prog(s, T_REFILL[0], 0.1))))})`);
    }
    // Machine : cycle, arrêt pendant la rupture
    const stopped = s >= R1.te && s < T_REFILL[1] + 0.2;
    let cyc = 1;
    if (!final && t >= T_C0 && t < T_C1) {
      if (stopped) cyc = 0;
      else if (s >= T_REFILL[1] + 0.2) cyc = ((s - T_REFILL[1] - 0.2) / 1.0) % 1;
      else cyc = ((s - T_C0 - 0.04) / 1.0 + 1) % 1;
    }
    S.cycle.setAttribute('width', f2(Math.max(0.001, 68 * cyc)));
    S.light.setAttribute('fill', stopped ? C.red : C.green);
    S.light.setAttribute('opacity', stopped && Math.floor(s / 0.18) % 2 ? 0.35 : 1);
    // La pièce à retoucher
    const partOn = s >= RE1.te - 0.18 && s < RE1.te + 0.95;
    show(S.part, partOn);
    if (partOn) {
      const p = easeOut(prog(s, RE1.te - 0.18, 0.18));
      const jit = s > RE1.te + 0.18 && s < RE1.te + 0.58 ? 1.2 * Math.sin(s * 90) : 0;
      S.part.setAttribute('transform', `translate(${f2(lerp(MACH.x + 26, TRAY.x + 9, p) + jit)} ${TRAY.y})`);
      S.part.setAttribute('opacity', f2(1 - prog(s, RE1.te + 0.8, 0.15)));
      S.partBox.setAttribute('fill', s >= RE1.te + 0.62 ? C.green : METAL);
    }
    const sparkOn = s > RE1.te + 0.18 && s < RE1.te + 0.58;
    show(S.sparks, sparkOn);
    if (sparkOn) { S.sparks.setAttribute('transform', `translate(${TRAY.x + 9} ${TRAY.y})`); S.sparks.setAttribute('opacity', Math.floor(s / 0.06) % 2 ? 0.3 : 1); }
    const badOn = s >= RE1.te + 0.02 && s < RE1.te + 0.62;
    show(S.bad, badOn);
    if (badOn) S.bad.setAttribute('transform', `translate(${TRAY.x + 11} ${TRAY.y - 27}) scale(${k3(popScale(prog(s, RE1.te + 0.02, 0.3)) * (1 - easeIn(prog(s, RE1.te + 0.5, 0.12))))})`);
    const gOn = s >= RE1.te + 0.62 && s < RE1.te + 0.95;
    show(S.good, gOn);
    if (gOn) S.good.setAttribute('transform', `translate(${TRAY.x + 11} ${TRAY.y - 27}) scale(${k3(popScale(prog(s, RE1.te + 0.62, 0.3)) * (1 - prog(s, RE1.te + 0.8, 0.15)))})`);
    // Bulles
    popBubble(S.bObs, s, 1.85, 2.6, OBX, 458);
    popBubble(S.bOp, s, 2.12, 2.6, HOME, 458);
    if (s >= 10.6 && s < 11.17) popBubble(S.bOp, s, 10.6, 11.05, HOME, 458);
    popBubble(S.bWait, s, A1.te, A1.te + 2 / 30 * (T_C1 - T_C0), HOME, 458);
    if (s >= A2.te) popBubble(S.bWait, s, A2.te, A2.te + 3 / 30 * (T_C1 - T_C0), HOME, 458);
    popBubble(S.bChef, s, R1.te + 0.2, T_REFILL[0] - 0.05, HOME, 458);
    // Observateur : écrit pendant les relevés, montre la planchette à la fin
    const writing = S.writes.find(w => s >= w.t0 && s < w.t0 + w.d);
    const wig = writing ? Math.sin(s * 70) * 2.2 : 0;
    const showK = Math.sin(Math.PI * prog(s, 10.38, 0.8));
    const obsHand = mixH([21, -40 + wig], [30, -50], showK);
    pose(S.obs, OBX, -1, 0, 0, obsHand);
    S.board.setAttribute('transform', showK > 0.001 ? `translate(${f2(10 * showK)} ${f2(-6 * showK)}) rotate(${f2(-14 * showK)} 17 -42)` : '');
    S.pen.setAttribute('x1', f2(obsHand[0]));
    S.pen.setAttribute('y1', f2(obsHand[1]));
    S.pen.setAttribute('x2', f2(obsHand[0] - 4));
    S.pen.setAttribute('y2', f2(obsHand[1] - 9));
    show(S.pen, showK < 0.05);

    // ----- Relevés -----
    show(S.rowsLayer, !(t >= T_OUT + ERASE && t < T_SEQ));
    let ex0 = SH.x;
    const erasing = t >= T_OUT && t < T_OUT + ERASE;
    if (erasing) ex0 = lerp(SH.x - 34, SH.x + SH.w + 34, easeInOut(prog(t, T_OUT, ERASE)));
    S.eraseRect.setAttribute('x', f2(ex0));
    S.eraseRect.setAttribute('width', f2(Math.max(0.001, SH.x + SH.w + 40 - ex0)));
    show(S.eraser, erasing);
    if (erasing) S.eraser.setAttribute('transform', `translate(${f2(ex0)} ${f2(Y_ROWS + 70 + 44 * Math.sin(prog(t, T_OUT, ERASE) * Math.PI * 7))})`);

    S.rows.forEach(R => {
      const e = R.e;
      // Puce horaire : apparaît quand le jeton arrive
      const pc = popScale(prog(s, e.tChip, 0.3));
      show(R.chip, pc > 0.001);
      R.chip.setAttribute('transform', scaleAt(R.chipC[0], R.chipC[1], pc));
      // Ligne surlignée à l'arrivée (et au 2e passage pour les déplacements)
      let fl = s >= e.tChip ? 1 - prog(s, e.tChip, 0.8) : 0;
      if (e.badge) fl = Math.max(fl, s >= D2.te + TOKEN ? 1 - prog(s, D2.te + TOKEN, 0.8) : 0);
      show(R.flash, fl > 0.001);
      R.flash.setAttribute('opacity', f2(0.9 * fl));
      if (R.count) {
        const v = final ? e.count : clamp(M - e.m, 0, e.count);
        const n = Math.floor(v + 1e-6);
        R.count.set(n, n >= e.count ? 0 : easeInOut(clamp((v - n - 0.72) / 0.28)));
        const pk = popScale(prog(s, e.tL1, 0.3));
        show(R.count.g, pk > 0.001);
        R.count.g.setAttribute('transform', scaleAt(Number(R.count.a.getAttribute('x')) + 20, Y_ROWS + e.row * ROW_H + 16, pk));
      }
      if (R.badge) {
        const pb = popScale(prog(s, e.tBadge, 0.3));
        show(R.badge, pb > 0.001);
        R.badge.setAttribute('transform', scaleAt(R.badgeC[0], R.badgeC[1], pb));
        const kr = final ? 0 : easeInOut(prog(s, D2.te + TOKEN, 0.22));
        if (final || kr >= 1) R.badgeRoll.set(2, 0); else R.badgeRoll.set(1, kr);
      }
      if (R.wrong) {
        const sk = prog(s, e.tStrike, 0.15);
        R.strike.setAttribute('stroke-dashoffset', f2(R.strikeLen * (1 - easeInOut(sk))));
        if (sk >= 1) R.strike.removeAttribute('stroke-dasharray'); else R.strike.setAttribute('stroke-dasharray', f2(R.strikeLen));
        const wo = 1 - prog(s, e.tWrongOut, 0.12);
        const on = s >= e.tWrong && wo > 0.001 && !final;
        show(R.strikeG, on);
        show(R.strike, on && sk > 0);
        R.strikeG.setAttribute('opacity', f2(wo));
        R.strike.setAttribute('opacity', f2(wo));
      }
    });
    // Écriture au stylo
    let pen = null;
    S.writes.forEach(({ w, t0, d }) => {
      const p = final ? 1 : prog(s, t0, d);
      w.cr.setAttribute('width', f2(Math.max(0.001, w.w * p)));
      if (!final && p > 0 && p < 1) pen = [w.x0 + w.w * p, w.y - 4];
    });
    if (!final && s >= A1.tStrike && s < A1.tStrike + 0.15) {
      const R = S.rows[0], b = measure(R.wrong.n);
      pen = [b.x - 4 + (b.width + 8) * prog(s, A1.tStrike, 0.15), Y_ROWS + 36];
    }
    show(S.pencil, !!pen);
    if (pen) S.pencil.setAttribute('transform', `translate(${f2(pen[0])} ${f2(pen[1])})`);

    // Jeton : part de la scène, arrive sur la puce de la bonne colonne
    let tok = null;
    EV.forEach(e => {
      const p = prog(s, e.te, TOKEN);
      if (final || p <= 0 || p >= 1) return;
      const src = { op: [HOME, FLOOR - 40], mag: [MAG - 6, 500], bin: [BIN.x + BIN.w / 2, 486], tray: [TRAY.x + 9, 506] }[e.src];
      const R = S.rowOf(e);
      const dst = e.upd ? R.badgeC : R.chipC;
      const q = easeInOut(p);
      const cx = lerp(src[0], dst[0], 0.3), cy = src[1] - 90;
      const x = (1 - q) * (1 - q) * src[0] + 2 * (1 - q) * q * cx + q * q * dst[0];
      const y = (1 - q) * (1 - q) * src[1] + 2 * (1 - q) * q * cy + q * q * dst[1];
      tok = { x, y, col: CATS[e.cat].col, k: p < 0.15 ? popScale(p / 0.15) : p > 0.85 ? 1 - (p - 0.85) / 0.15 * 0.4 : 1 };
    });
    show(S.token, !!tok);
    if (tok) {
      S.token.setAttribute('cx', f2(tok.x));
      S.token.setAttribute('cy', f2(tok.y));
      S.token.setAttribute('fill', tok.col);
      S.token.setAttribute('r', f2(9 * tok.k));
    }
    // En-tête de colonne qui s'allume à l'arrivée
    S.heads.forEach((h, i) => {
      let k = 0;
      EV.forEach(e => { if (!final && e.cat === i) { const p = prog(s, e.te + TOKEN - 0.05, 0.6); if (p > 0 && p < 1) k = Math.max(k, Math.sin(Math.PI * p)); } });
      h.setAttribute('stroke', k > 0.02 ? CATS[i].col : 'none');
      h.setAttribute('stroke-opacity', f2(k));
    });

    // ----- Règles : cochées au fil de l'observation -----
    S.rules.forEach((r, i) => {
      let k;
      if (t < T_OUT) k = 1;
      else if (t < T_OUT + 0.25) k = 1 - easeIn(prog(t, T_OUT, 0.25));
      else k = popScale(prog(t, T_RULE[i], 0.3));
      show(r.chk, k > 0.001);
      r.chk.setAttribute('transform', scaleAt(r.c[0], r.c[1], k));
      const hp = final ? 0 : prog(t, T_RULE[i] - 0.05, 0.3);
      const ho = final ? 0 : 1 - prog(t, T_RULE[i] + 0.7, 0.3);
      show(r.hl, hp > 0 && ho > 0.001);
      r.hl.setAttribute('width', f2(Math.max(0.001, r.hw * easeOut(hp))));
      r.hl.setAttribute('opacity', f2(ho));
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
