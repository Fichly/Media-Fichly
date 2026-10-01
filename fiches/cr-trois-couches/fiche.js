// Fiche LinkedIn · Clément Raymond · lundi 26 octobre 2026
// Post : « Quand un accompagnement Lean se termine, trois choses restent dans l'entreprise. »
// Premier commentaire du post (Buffer) : notre guide pour choisir une formation Lean certifiante → encart.
// Le visuel est la pièce maîtresse : la démarche est une plante en coupe, sol compris. Les feuilles sont
// les outils, la tige les compétences, les racines le système de management. Le consultant arrose, tout
// pousse. Cas 1 : il part (avec l'arrosoir) alors que les racines sont restées en surface ; les mois
// défilent, la tige sèche, les feuilles pâlissent mais restent en place : elles trompent. On rembobine.
// Cas 2 : la hiérarchie arrose, le consultant regarde ; les racines s'enfoncent jusqu'aux rôles, les trois
// questions passent au vert ; il part, la plante continue de pousser.
// Style propre : la plante (croissance organique). Image t = 0 = état final. Boucle de 12,5 s.
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
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.55 + 0.45 * back(p));
  const mod = (a, n) => ((a % n) + n) % n;
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => {
    if (p <= 0) return a;
    if (p >= 1) return b;
    const A = hex(a), B = hex(b);
    return '#' + A.map((v, i) => Math.round(lerp(v, B[i], p)).toString(16).padStart(2, '0')).join('');
  };

  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', DASH = '#b6b6d4';
  const SOIL = '#f2e9cd', SOIL_DEEP = '#ece0bd', PEBBLE = '#e0d1a4', GROUND = '#c8ae76';
  const ROOT = '#a8843f', ROOT_DRY = '#d3c193', GHOST = '#c2a971', GHOST_TEXT = '#a08856';
  const STEM = '#6dac58', STEM_DRY = '#cdbd8e', BUD = '#7dbd67', SPROUT = '#a9d894';
  const LEAF = C.green, LEAF_PALE = '#e1e6d8', LEAF_TXT_PALE = '#909b88', VEIN = '#b7dfa6', VEIN_PALE = '#eef1ea';
  const WATER = C.lightBlue;
  const C_LBL = '#8a5893', M_LBL = '#3b8285';     // étiquettes consultant / manager

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const GY = 792;                 // niveau du sol
  const PX = 440;                 // pied de la plante
  const TOP1 = 538, TOP2 = 506;   // sommet après l'accompagnement, puis après la repousse
  const FRONT = 222, BACKX = 124, OFF = 0;   // celui qui arrose, celui qui regarde, hors cadre
  const PANEL = 712;              // colonne de légende et de vérification
  const PILL_Y = 452;
  const CHIP = { x: 760, y: 423, w: 228, h: 58 };

  const LEAVES = [
    { label: 'Tableaux', side: -1, y: 666, len: 150, t: 2.72 },
    { label: 'Standards', side: 1, y: 636, len: 154, t: 2.88 },
    { label: 'Cartographies', side: -1, y: 602, len: 172, t: 3.04 },
    { label: 'Matrices', side: 1, y: 572, len: 148, t: 3.2 },
  ];
  const LEAF_A = 15, LEAF_W = 30;
  const SPROUTS = [
    { side: -1, y: 522, len: 58, a: 34, t: 10.95 },
    { side: 1, y: 514, len: 54, a: 34, t: 11.1 },
  ];
  const SKILLS = [
    { label: `5${NB}Pourquoi`, side: 1, y: 768, t: 2.5 },
    { label: 'AIC', side: -1, y: 738, t: 2.6 },
    { label: 'VSM', side: 1, y: 708, t: 2.7 },
  ];
  const ROLES = [
    { lines: ['Qui anime', 'les routines'], cx: 170, cy: 962, root: `M ${PX} ${GY + 2} C ${PX - 18} 852, 262 858, 170 931` },
    { lines: ['Qui décide face', 'à un écart'], cx: 320, cy: 1084, root: `M ${PX} ${GY + 2} C ${PX - 6} 900, 334 960, 320 1053` },
    { lines: ['Qui vérifie', 'les actions'], cx: 500, cy: 1084, root: `M ${PX} ${GY + 2} C ${PX + 8} 900, 492 962, 500 1053` },
    { lines: ['Qui fait évoluer', 'les standards'], cx: 616, cy: 962, root: `M ${PX} ${GY + 2} C ${PX + 26} 846, 586 862, 616 931` },
  ];
  const SH = 0.3;                                  // racines en surface : 30 % du chemin
  // Radicelles de la repousse : [racine, point de départ (fraction), décalage de la pointe]
  const ROOTLETS = [[0, 0.45, -36, 58], [1, 0.5, -64, 30], [2, 0.5, 64, 26], [3, 0.42, 40, 66], [1, 0.25, -50, 52], [2, 0.28, 46, 50]];
  const LEG = [
    { n: 1, title: ['Les outils'], y: 590 },
    { n: 2, title: ['Les compétences'], y: 712 },
    { n: 3, title: ['Le système', 'de management'], y: 832 },
  ];
  const CARD = { x: PANEL, y: 924, w: 996 - PANEL, h: 206 };
  const QUESTIONS = [
    ['Les routines ont lieu', `sans le consultant${NB}?`],
    ['Les écarts sont traités', `par les managers${NB}?`],
    ['Un standard a déjà été', `modifié sans lui${NB}?`],
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.2, T_RE = 1.5;                  // l'image finale se replie, puis tout repousse
  const T_STEM = 2.2, STEM_DUR = 0.95;
  const T_ROOT1 = 2.15;                            // racines en surface pendant l'accompagnement
  const T_LEAVE1 = 4.05;                           // cas 1 : il part
  const T_DRY = 4.85, DRY_DUR = 1.05;
  const T_RW = 6.75, RW_DUR = 0.5;                 // on rembobine
  const T_SWAP = 7.45;                             // cas 2 : la hiérarchie prend l'arrosoir
  const T_HAND = T_SWAP + 0.15, HAND_DUR = 0.4;
  const T_TILT2 = T_SWAP + 0.7, T_ROOT2 = T_SWAP + 0.85, ROOT2_DUR = 0.8, ROOT2_STEP = 0.15;
  const REACH = ROLES.map((_, i) => T_ROOT2 + ROOT2_STEP * i + ROOT2_DUR);
  const YES_T = [REACH[0] + 0.05, REACH[1] + 0.05, REACH[3] + 0.05];
  const NO_T = [4.6, 4.75, 4.9];
  const T_LEAVE2 = 10.0;                            // cas 2 : il part
  const T_GROW2 = 10.55;                           // la plante continue de pousser
  const DROP_P = 0.5, DROP_N = 6, DROP_LIFE = 0.42; // arrosage : 6 gouttes toutes les 0,5 s (12,5 = 25 × 0,5)

  const PILLS = [
    { label: `Pendant l’accompagnement${NB}: tout pousse`, kind: 'blue', wins: [[T_RE, 4.0]] },
    { label: `Cas 1${NB}·${NB}Il part, racines en surface`, kind: 'red', wins: [[4.0, T_RW]] },
    { label: `Cas 2${NB}·${NB}La hiérarchie fait, il regarde`, kind: 'blue', wins: [[T_RW, T_LEAVE2]] },
    { label: `Cas 2${NB}·${NB}Il part, la plante continue de pousser`, kind: 'green', wins: [[T_LEAVE2, Infinity]], fin: true },
  ];
  const STATUS = [
    [
      { label: 'en place', kind: 'green', wins: [[3.3, 5.75], [T_RW + 0.15, Infinity]], fin: true },
      { label: 'c’est ce qui trompe', kind: 'yellow', wins: [[5.75, T_RW + 0.15]] },
    ],
    [
      { label: 'pratiquées', kind: 'green', wins: [[2.95, 5.3], [T_RW + 0.15, Infinity]], fin: true },
      { label: 'un souvenir', kind: 'red', wins: [[5.3, T_RW + 0.15]] },
    ],
    [
      { label: 'porté par le consultant', kind: 'yellow', wins: [[3.5, 4.45], [T_RW + 0.2, T_SWAP + 0.8]] },
      { label: 'parti avec lui', kind: 'red', wins: [[4.45, T_RW + 0.2]] },
      { label: 'porté par la hiérarchie', kind: 'green', wins: [[T_SWAP + 0.8, Infinity]], fin: true },
    ],
  ];
  const KINDS = {
    blue: { bg: C.blue, fg: C.white },
    red: { bg: C.pRed, fg: C.tRed, dot: C.red },
    green: { bg: C.pGreen, fg: C.tGreen, dot: C.green },
    yellow: { bg: C.pYellow, fg: C.tYellow, dot: C.yellow },
  };
  // Compteur du temps : [t, texte, sens (1 : monte, −1 : rembobine), couleur]
  const MONTH0 = [0, `+6${NB}mois`, 1, C.tGreen];
  const MONTHS = [[T_RE, 'en cours', -1, C.blue]];
  for (let k = 1; k <= 6; k++) MONTHS.push([4.5 + 0.25 * k, `+${k}${NB}mois`, 1, C.tRed]);
  for (let k = 5; k >= 1; k--) MONTHS.push([T_RW + 0.12 + 0.07 * (5 - k), `+${k}${NB}mois`, -1, C.tRed]);
  MONTHS.push([T_RW + 0.62, 'en cours', -1, C.blue]);
  for (let k = 1; k <= 6; k++) MONTHS.push([T_GROW2 + 0.05 + 0.25 * (k - 1), `+${k}${NB}mois`, 1, C.tGreen]);

  // Visibilité d'un élément à fenêtres : l'ancien sort (0,14 s), puis le nouveau entre (0,22 s, après 0,15 s)
  function vis(t, wins, fin) {
    if (t < T_RE) return fin ? 1 - prog(t, T_OUT, 0.2) : 0;
    let o = 0;
    for (const [a, b] of wins) o += prog(t, a + 0.15, 0.22) * (1 - prog(t, b, 0.14));
    return clamp(o);
  }
  const show = (n, o) => {
    if (o <= 0.001) { n.setAttribute('display', 'none'); return false; }
    n.removeAttribute('display');
    n.setAttribute('opacity', o >= 0.999 ? 1 : f2(o));
    return true;
  };
  // Tracé qui pousse : un tracé terminé perd son pointillé
  function grow(n, L, f) {
    if (f <= 0.001) { n.setAttribute('display', 'none'); return; }
    n.removeAttribute('display');
    if (f >= 0.999) { n.removeAttribute('stroke-dasharray'); n.removeAttribute('stroke-dashoffset'); return; }
    n.setAttribute('stroke-dasharray', f2(L));
    n.setAttribute('stroke-dashoffset', f2(L * (1 - f)));
  }
  const scaleAt = (k, x, y) => (k >= 1 ? '' : `translate(${f2(x)} ${f2(y)}) scale(${k.toFixed(3)}) translate(${f2(-x)} ${f2(-y)})`);

  // ---------- Petits éléments ----------
  function pillShape(parent, x, cy, label, { bg, fg, icon = false, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon) checkDisc(g, x + 31, cy, 12);
    return g;
  }
  function checkDisc(parent, cx, cy, r) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: C.green }, g);
    const k = r / 12;
    el('path', { d: `M ${cx - 5.5 * k} ${cy + 0.5 * k} L ${cx - 1.5 * k} ${cy + 4.5 * k} L ${cx + 5.5 * k} ${cy - 3.5 * k}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2 * Math.max(k, 0.9), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function crossDisc(parent, cx, cy, r) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: C.red }, g);
    const d = r * 0.36;
    el('path', { d: `M ${cx - d} ${cy - d} L ${cx + d} ${cy + d} M ${cx + d} ${cy - d} L ${cx - d} ${cy + d}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // Pastille d'état (légende) : point de couleur + texte
  function statusChip(parent, x, cy, label, kind) {
    const k = KINDS[kind];
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - 15, height: 30, rx: 15, fill: k.bg }, g);
    el('circle', { cx: x + 16, cy, r: 5, fill: k.dot }, g);
    const tx = text(g, x + 29, cy + 5.8, label, { size: 16, weight: 700, fill: k.fg });
    r.setAttribute('width', tx.getBBox().width + 43);
    fit(r, 996, `état ${label}`);
    return g;
  }
  function leafPath(s, L, w) {
    return `M 0 0 C ${f2(s * L * 0.16)} ${f2(-w * 1.2)}, ${f2(s * L * 0.7)} ${f2(-w * 1.05)}, ${f2(s * L)} 0 `
      + `C ${f2(s * L * 0.7)} ${f2(w * 0.95)}, ${f2(s * L * 0.16)} ${f2(w * 1.1)}, 0 0 Z`;
  }
  // Une personne (pieds en 0, 0 ; tournée vers la droite) : renvoie ses parties mobiles
  function person(parent, color, label, lblColor) {
    const g = el('g', {}, parent);
    const lbl = text(g, 0, -154, label, { size: 15, weight: 700, fill: lblColor, anchor: 'middle' });
    const fig = el('g', {}, g);
    const legs = [-7, 7].map(x => {
      const lg = el('g', {}, fig);
      el('rect', { x: x - 5, y: -46, width: 10, height: 46, rx: 5, fill: C.ink }, lg);
      return { lg, x };
    });
    el('rect', { x: -22, y: -110, width: 44, height: 72, rx: 18, fill: color }, fig);
    const arm = el('line', { x1: 10, y1: -94, x2: 28, y2: -72, stroke: color, 'stroke-width': 9, 'stroke-linecap': 'round' }, fig);
    el('rect', { x: -22, y: -110, width: 44, height: 72, rx: 18, fill: 'none', stroke: C.white, 'stroke-opacity': 0.35, 'stroke-width': 2 }, fig);
    el('circle', { cx: 0, cy: -128, r: 17, fill: color }, fig);
    [4.5, 11.5].forEach(x => el('circle', { cx: x, cy: -131, r: 2.3, fill: C.white }, fig));
    return { g, lbl, fig, legs, arm };
  }
  // Arrosoir (poignée en 0, 0 ; bec vers la droite) ; renvoie la position de la pomme
  const ROSE = [39, 3];
  function wateringCan(parent) {
    const g = el('g', {}, parent);
    const c = el('g', { transform: 'translate(3 4)' }, g);
    el('path', { d: 'M -14 10 C -14 -9, 8 -9, 8 10', fill: 'none', stroke: C.blue, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, c);
    el('path', { d: 'M 7 17 L 33 0', fill: 'none', stroke: C.blue, 'stroke-width': 5.5, 'stroke-linecap': 'round' }, c);
    el('ellipse', { cx: 35.5, cy: -1.5, rx: 3.6, ry: 6, fill: C.blue, transform: 'rotate(-33 35.5 -1.5)' }, c);
    el('path', { d: 'M -18 8 L 12 8 L 9.5 34 L -15.5 34 Z', fill: C.blue, stroke: C.blue, 'stroke-width': 4, 'stroke-linejoin': 'round' }, c);
    el('rect', { x: -11, y: 15, width: 16, height: 5, rx: 2.5, fill: C.white, 'fill-opacity': 0.4 }, c);
    return g;
  }
  function bubble(parent, cx, cy, kind) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r: 17, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
    if (kind === '?') text(g, cx, cy + 7.5, '?', { size: 21, weight: 800, fill: C.tRed, anchor: 'middle' });
    else {
      el('path', { d: `M ${cx - 11} ${cy} Q ${cx} ${cy - 10}, ${cx + 11} ${cy} Q ${cx} ${cy + 10}, ${cx - 11} ${cy} Z`, fill: 'none', stroke: C.blue, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, g);
      el('circle', { cx, cy, r: 3.6, fill: C.blue }, g);
    }
    return g;
  }
  function sampler(path) {
    const L = path.getTotalLength();
    const pts = [];
    for (let i = 0; i <= 240; i++) pts.push(path.getPointAtLength(L * i / 240));
    return {
      L,
      at: f => path.getPointAtLength(L * clamp(f)),
      xAtY: y => pts.reduce((b, p) => (Math.abs(p.y - y) < Math.abs(b.y - y) ? p : b), pts[0]).x,
    };
  }

  const S = {};

  function build() {
    D.template({ author: 'clement' });
    D.title('Trois couches,', 'trois durées.');
    D.chapeau('Quand un accompagnement Lean se termine, trois choses restent.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Feuilles', C.blue], [`${NB}: les outils. `, 0], ['Tige', C.blue], [`${NB}: les compétences. `, 0], ['Racines', C.blue], [`${NB}: le système de management.`, 0]]);
    line(384, [['Les racines ne s’enfoncent que quand ', 0], ['la hiérarchie fait elle-même', C.tGreen], ['.', 0]]);

    const defs = el('defs');
    const cpF = el('clipPath', { id: 'frame' }, defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26 }, cpF);
    const cpV = el('clipPath', { id: 'chipValue' }, defs);
    el('rect', { x: CHIP.x + 50, y: CHIP.y + 31, width: CHIP.w - 60, height: 25 }, cpV);
    const lift = el('filter', { id: 'lift', x: '-40%', y: '-40%', width: '180%', height: '180%' }, defs);
    el('feDropShadow', { dx: 0, dy: 8, stdDeviation: 6, 'flood-color': C.ink, 'flood-opacity': 0.22 }, lift);

    // ----- Cadre : l'air, puis le sol en coupe -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG });
    const soil = el('g', { 'clip-path': 'url(#frame)' });
    el('rect', { x: FRAME.x, y: GY, width: FRAME.w, height: FRAME.y + FRAME.h - GY, fill: SOIL }, soil);
    el('path', { d: `M ${FRAME.x} 1000 C 260 984, 470 1016, 700 996 C 820 986, 930 1000, ${FRAME.x + FRAME.w} 992 V 1150 H ${FRAME.x} Z`, fill: SOIL_DEEP }, soil);
    [[104, 842, 9, 5], [262, 822, 6, 4], [574, 818, 7, 4], [664, 874, 10, 6], [108, 1048, 8, 5], [414, 992, 7, 4],
      [640, 1052, 9, 5], [236, 1128, 7, 4], [586, 1130, 6, 4], [412, 1132, 8, 4], [86, 930, 5, 3.5], [690, 1112, 6, 4]]
      .forEach(([cx, cy, rx, ry]) => el('ellipse', { cx, cy, rx, ry, fill: PEBBLE }, soil));
    el('line', { x1: FRAME.x, y1: GY, x2: FRAME.x + FRAME.w, y2: GY, stroke: GROUND, 'stroke-width': 3 }, soil);
    [96, 312, 362, 618, 676, 990].forEach(x => el('path', { d: `M ${x - 6} ${GY} Q ${x - 7} ${GY - 7}, ${x - 10} ${GY - 11} M ${x} ${GY} Q ${x} ${GY - 9}, ${x + 1} ${GY - 14} M ${x + 6} ${GY} Q ${x + 7} ${GY - 6}, ${x + 11} ${GY - 9}`, fill: 'none', stroke: STEM, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, soil));
    el('ellipse', { cx: PX, cy: GY + 9, rx: 8, ry: 5.5, fill: '#b89049' });

    // Repères de la légende (pointillés fins, de la plante vers la colonne de droite)
    [[606, LEG[0].y - 7], [548, LEG[1].y - 7], [560, LEG[2].y - 7]].forEach(([x0, y]) =>
      el('line', { x1: x0, y1: y, x2: PANEL - 2, y2: y, stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' }));

    // ----- Racines et rôles -----
    S.roots = ROLES.map(r => {
      const n = el('path', { d: r.root, fill: 'none', stroke: ROOT, 'stroke-width': 6, 'stroke-linecap': 'round' });
      return { n, sp: sampler(n) };
    });
    S.rootlets = ROOTLETS.map(([ri, f, dx, dy]) => {
      const p = S.roots[ri].sp.at(f);
      const d = `M ${f2(p.x)} ${f2(p.y)} Q ${f2(p.x + dx * 0.55)} ${f2(p.y + dy * 0.2)}, ${f2(p.x + dx)} ${f2(p.y + dy)}`;
      const n = el('path', { d, fill: 'none', stroke: ROOT, 'stroke-width': 3.5, 'stroke-linecap': 'round' });
      return { n, L: n.getTotalLength() };
    });
    S.roles = ROLES.map((r, i) => {
      const mk = solid => {
        const g = el('g');
        const box = el('rect', { y: r.cy - 30, height: 60, rx: 14, fill: solid ? C.white : SOIL, stroke: solid ? C.blue : GHOST, 'stroke-width': solid ? 2.5 : 2, 'stroke-dasharray': solid ? 'none' : '6 5' }, g);
        const t1 = text(g, r.cx, r.cy - 5, r.lines[0], { size: 16, weight: solid ? 800 : 700, fill: solid ? C.blue : GHOST_TEXT, anchor: 'middle' });
        const t2 = text(g, r.cx, r.cy + 16, r.lines[1], { size: 16, weight: 700, fill: solid ? C.ink : GHOST_TEXT, anchor: 'middle' });
        const w = Math.max(t1.getBBox().width, t2.getBBox().width) + 30;
        box.setAttribute('x', f2(r.cx - w / 2));
        box.setAttribute('width', f2(w));
        fit(box, PANEL - 8, `rôle ${i + 1}`, FRAME.x + 14);
        return g;
      };
      return { ghost: mk(false), solid: mk(true), cx: r.cx, cy: r.cy };
    });

    // ----- La plante -----
    const plant = el('g');
    S.stem1 = el('path', { d: `M ${PX} ${GY + 6} C ${PX - 5} 722, ${PX + 6} 630, ${PX} ${TOP1}`, fill: 'none', stroke: STEM, 'stroke-width': 11, 'stroke-linecap': 'round' }, plant);
    S.stem2 = el('path', { d: `M ${PX} ${TOP1} C ${PX - 3} ${TOP1 - 10}, ${PX - 3} ${TOP2 + 12}, ${PX + 1} ${TOP2}`, fill: 'none', stroke: STEM, 'stroke-width': 9.5, 'stroke-linecap': 'round' }, plant);
    S.s1 = sampler(S.stem1);
    S.s2 = sampler(S.stem2);
    // Compétences : petites étiquettes greffées sur la tige
    S.skills = SKILLS.map((k, i) => {
      const x0 = S.s1.xAtY(k.y);
      const g = el('g', {}, plant);
      el('line', { x1: x0, y1: k.y, x2: x0 + k.side * 20, y2: k.y, stroke: STEM, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      const mk = solid => {
        const sg = el('g', {}, g);
        const r = el('rect', { y: k.y - 15, height: 30, rx: 15, fill: solid ? C.white : FRAME_BG, stroke: solid ? STEM : DASH, 'stroke-width': solid ? 2.5 : 2, 'stroke-dasharray': solid ? 'none' : '5 4' }, sg);
        const tx = text(sg, 0, k.y + 5.8, k.label, { size: 16, weight: 700, fill: solid ? C.tGreen : MUTED, anchor: 'middle' });
        const w = tx.getBBox().width + 28;
        const cx = x0 + k.side * (20 + w / 2);
        tx.setAttribute('x', f2(cx));
        r.setAttribute('x', f2(cx - w / 2));
        r.setAttribute('width', f2(w));
        fit(r, PANEL - 30, `compétence ${i + 1}`, FRAME.x + 14);
        return sg;
      };
      const ghost = mk(false), solid = mk(true);
      return { g, ghost, solid, ox: x0, oy: k.y };
    });
    // Outils : les feuilles, avec leur nom
    S.leaves = LEAVES.map((lf, i) => {
      const ax = S.s1.xAtY(lf.y) + lf.side * 4;
      const g = el('g', {}, plant);
      const shape = el('path', { d: leafPath(lf.side, lf.len, LEAF_W / 1.2), fill: LEAF }, g);
      const tx = text(g, lf.side * lf.len * 0.53, 5.6, lf.label, { size: 16, weight: 800, fill: C.tGreen, anchor: 'middle' });
      const tw = tx.getBBox().width;
      if (tw > lf.len * 0.8) console.error(`Débordement : feuille ${lf.label} (${Math.round(tw)} px)`);
      const m = lf.len * 0.53, s = lf.side;
      const vein = el('path', { d: `M ${s * 8} 0 L ${f2(s * (m - tw / 2 - 9))} 0 M ${f2(s * (m + tw / 2 + 9))} 0 L ${s * (lf.len - 12)} 0`, fill: 'none', stroke: VEIN, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
      return { g, shape, tx, vein, ax, ay: lf.y, side: s };
    });
    S.sprouts = SPROUTS.map(sp => {
      const ax = S.s2.xAtY(sp.y) + sp.side * 3;
      const g = el('g', {}, plant);
      el('path', { d: leafPath(sp.side, sp.len, 14), fill: SPROUT }, g);
      el('path', { d: `M ${sp.side * 5} 0 L ${sp.side * (sp.len - 8)} 0`, fill: 'none', stroke: VEIN, 'stroke-width': 1.8, 'stroke-linecap': 'round' }, g);
      return { g, ax, ay: sp.y, side: sp.side, a: sp.a };
    });
    S.bud = el('ellipse', { cx: 0, cy: -5, rx: 5.5, ry: 8.5, fill: BUD }, plant);

    // ----- Arrosage : gouttes et éclaboussures -----
    S.drops = Array.from({ length: DROP_N }, () => ({
      d: el('ellipse', { rx: 3.4, ry: 4.4, fill: WATER }),
      s: el('ellipse', { rx: 4, ry: 1.6, fill: 'none', stroke: WATER, 'stroke-width': 2 }),
    }));

    // ----- Les personnes et l'arrosoir -----
    const people = S.people = el('g', { 'clip-path': 'url(#frame)' });
    S.cons = person(people, C.violet, 'Consultant', C_LBL);
    S.man = person(people, C.teal, 'Manager', M_LBL);
    S.can = wateringCan(people);
    S.qBubble = bubble(D.svg, BACKX, 582, '?');
    S.eyeBubble = bubble(D.svg, BACKX, 582, 'eye');
    fit(S.cons.lbl, 60, 'étiquette consultant', -60);

    // ----- Légende : les trois couches -----
    S.status = LEG.map((lg, i) => {
      el('circle', { cx: PANEL + 16, cy: lg.y - 7, r: 15, fill: C.blue });
      text(D.svg, PANEL + 16, lg.y - 0.5, String(lg.n), { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
      lg.title.forEach((l, k) => fit(text(D.svg, PANEL + 42, lg.y + k * 24, l, { size: 20, weight: 800, fill: C.ink }), 996, `légende ${lg.n}`));
      const cy = lg.y + 34 + (lg.title.length - 1) * 24;
      return STATUS[i].map(st => ({ g: statusChip(D.svg, PANEL + 42, cy, st.label, st.kind), st }));
    });

    // ----- Les trois questions -----
    el('rect', { x: CARD.x, y: CARD.y, width: CARD.w, height: CARD.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    fit(text(D.svg, CARD.x + 18, CARD.y + 30, 'À vérifier avant la fin', { size: 17, weight: 800, fill: C.blue }), CARD.x + CARD.w - 14, 'titre questions');
    S.q = QUESTIONS.map((q, i) => {
      const y = CARD.y + 66 + i * 56;
      const cx = CARD.x + 32, cy = y + 4;
      el('circle', { cx, cy, r: 13, fill: C.white, stroke: DASH, 'stroke-width': 2.5 });
      q.forEach((l, k) => fit(text(D.svg, CARD.x + 56, y + k * 21, l, { size: 17, weight: 700, fill: C.ink }), CARD.x + CARD.w - 10, `question ${i + 1} ligne ${k + 1}`));
      return { no: crossDisc(D.svg, cx, cy, 13), yes: checkDisc(D.svg, cx, cy, 13), cx, cy };
    });

    // ----- Bordure du cadre -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: 'none', stroke: C.line, 'stroke-width': 2 });

    // ----- Compteur du temps (en haut à droite) -----
    el('rect', { x: CHIP.x, y: CHIP.y, width: CHIP.w, height: CHIP.h, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    const ix = CHIP.x + 18, iy = CHIP.y + 15;
    S.cal = el('g');
    el('rect', { x: ix, y: iy, width: 26, height: 27, rx: 5, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, S.cal);
    el('rect', { x: ix, y: iy, width: 26, height: 9, rx: 4, fill: C.blue }, S.cal);
    S.calPage = el('g', {}, S.cal);
    [[ix + 5, iy + 14], [ix + 11, iy + 14], [ix + 17, iy + 14], [ix + 5, iy + 20], [ix + 11, iy + 20]].forEach(([x, y]) => el('rect', { x, y, width: 4, height: 3.5, rx: 1, fill: C.blue }, S.calPage));
    [ix + 7, ix + 19].forEach(x => el('line', { x1: x, y1: iy - 4, x2: x, y2: iy + 3, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.cal));
    // Icône « rembobiner » (pendant le retour en arrière)
    S.rew = el('g');
    el('circle', { cx: ix + 13, cy: iy + 13, r: 16, fill: C.blue }, S.rew);
    [0, 10].forEach(dx => el('path', { d: `M ${ix + 9 + dx} ${iy + 5} L ${ix + 1 + dx} ${iy + 13} L ${ix + 9 + dx} ${iy + 21} Z`, fill: C.white, stroke: C.white, 'stroke-width': 2, 'stroke-linejoin': 'round' }, S.rew));
    S.chipLabels = [['Accompagnement', [[T_RE, 4.62], [T_RW + 0.62, T_GROW2 - 0.1]], false], ['Après son départ', [[4.62, T_RW], [T_GROW2 - 0.1, Infinity]], true], ['On rembobine', [[T_RW, T_RW + 0.62]], false]]
      .map(([l, wins, fin]) => {
        const n = text(D.svg, CHIP.x + 58, CHIP.y + 23, l, { size: 15, weight: 700, fill: MUTED });
        fit(n, CHIP.x + CHIP.w - 10, `compteur ${l}`);
        return { n, wins, fin };
      });
    const vg = el('g', { 'clip-path': 'url(#chipValue)' });
    S.val = [0, 1].map(() => text(vg, CHIP.x + 58, CHIP.y + 49, '', { size: 22, weight: 800, fill: C.ink }));
    ['en cours', `+6${NB}mois`].forEach(v => { S.val[0].textContent = v; fit(S.val[0], CHIP.x + CHIP.w - 10, `compteur ${v}`); });

    // ----- Pastilles d'étape -----
    S.pills = PILLS.map(p => {
      const g = pillShape(D.svg, 92, PILL_Y, p.label, { ...KINDS[p.kind], icon: p.kind === 'green' });
      fit(g, CHIP.x - 14, `pastille ${p.label}`);
      return { g, p };
    });

    D.encart(['Se former pour durer', 'Choisir sa formation Lean', '(lien en commentaire)']);
  }

  // ---------- États à l'instant t ----------
  const rw = t => easeInOut(prog(t, T_RW, RW_DUR));          // rembobinage du cas 1
  const decay = (t, a, d) => (t < T_RE ? 0 : easeInOut(prog(t, a, d)) * (1 - rw(t)));
  function stemG1(t) {
    if (t < T_OUT) return 1;
    if (t < T_RE) return 1 - easeIn(prog(t, 1.28, 0.22));
    return easeInOut(prog(t, T_STEM, STEM_DUR));
  }
  function stemG2(t) {
    if (t < T_OUT) return 1;
    if (t < T_RE) return 1 - easeIn(prog(t, T_OUT, 0.1));
    return easeOut(prog(t, T_GROW2, 0.6));
  }
  function rootF(i, t) {
    if (t < T_OUT) return 1;
    if (t < T_RE) return 1 - easeIn(prog(t, 1.25, 0.25));
    const sh = SH * easeOut(prog(t, T_ROOT1 + 0.1 * i, 0.95));
    return lerp(sh, 1, easeInOut(prog(t, T_ROOT2 + ROOT2_STEP * i, ROOT2_DUR)));
  }
  function rootletF(j, t) {
    if (t < T_OUT) return 1;
    if (t < T_RE) return 1 - easeIn(prog(t, T_OUT, 0.12));
    return easeOut(prog(t, T_GROW2 + 0.1 + 0.12 * j, 0.6));
  }
  // Déploiement d'un organe : 1 à l'état final, se replie à T_OUT, repousse à a (avec dépassement)
  function unfold(t, a, foldAt = T_OUT, dur = 0.45) {
    if (t < T_OUT) return 1;
    if (t < T_RE) return 1 - easeIn(prog(t, foldAt, 0.16));
    const p = prog(t, a, dur);
    return p <= 0 ? 0 : p >= 1 ? 1 : back(p);
  }

  // Personnes : { x, sx (échelle horizontale : 1 vers la plante, −1 dos tourné), o, arm (1 : tient l'arrosoir), env (marche) }
  const env = p => clamp(1.6 * Math.sin(Math.PI * p));
  const turnK = (t, a, from, to, d = 0.12) => { const p = prog(t, a, d); return (p < 0.5 ? from : to) * Math.max(0.001, Math.abs(Math.cos(Math.PI * p))); };
  const walk = (t, a, d, x0, x1, extra) => { const p = prog(t, a, d); return { x: lerp(x0, x1, easeInOut(p)), env: env(p), o: 1, ...extra }; };
  function consultantState(t) {
    if (t < T_RE) return null;
    if (t < T_LEAVE1) { const p = prog(t, 1.62, 0.3); return { x: FRONT, sx: 1, o: p, rise: 10 * (1 - easeOut(p)), arm: 1 }; }
    if (t < T_LEAVE1 + 0.8) return walk(t, T_LEAVE1 + 0.12, 0.68, FRONT, OFF, { sx: turnK(t, T_LEAVE1, 1, -1), arm: 1 });
    if (t < T_RW) return null;
    // Rembobinage : il revient à reculons (dos tourné), puis se retourne
    if (t < T_SWAP) return walk(t, T_RW + 0.05, 0.42, OFF, FRONT, { sx: turnK(t, T_RW + 0.5, -1, 1), arm: 1 });
    if (t < T_LEAVE2) return walk(t, T_SWAP, 0.55, FRONT, BACKX, { sx: 1, arm: t < T_HAND ? 1 : 0 });
    if (t < T_LEAVE2 + 0.8) return walk(t, T_LEAVE2 + 0.12, 0.62, BACKX, OFF, { sx: turnK(t, T_LEAVE2, 1, -1), arm: 0 });
    return null;
  }
  function managerState(t) {
    if (t < T_OUT) return { x: FRONT, sx: 1, o: 1, arm: 1 };
    if (t < T_RE) return { x: FRONT, sx: 1, o: 1 - prog(t, T_OUT, 0.2), arm: 1 };
    if (t < T_SWAP + 0.05) { const p = prog(t, 1.55, 0.3); return { x: BACKX, sx: 1, o: p, rise: 10 * (1 - easeOut(p)), arm: 0 }; }
    return walk(t, T_SWAP + 0.05, 0.55, BACKX, FRONT, { sx: 1, arm: t >= T_HAND + HAND_DUR ? 1 : 0 });
  }
  const handOf = st => [st.x + 28 * st.sx, GY - 72 - (st.rise || 0) + (st.bob || 0)];

  function placePerson(P, st, lblO) {
    if (!st || !show(P.g, st.o)) { P.g.setAttribute('display', 'none'); return; }
    // Marche : jambes et balancement liés à la distance parcourue (les pieds ne glissent pas)
    const ph = st.x / 21 * Math.PI, e = st.env || 0;
    const a = 20 * Math.sin(ph) * e;
    st.bob = -3 * Math.abs(Math.sin(ph)) * e;
    P.g.setAttribute('transform', `translate(${f2(st.x)} ${f2(GY - (st.rise || 0) + st.bob)})`);
    P.fig.setAttribute('transform', st.sx === 1 ? '' : `scale(${st.sx.toFixed(3)} 1)`);
    P.legs.forEach(({ lg, x }, k) => lg.setAttribute('transform', Math.abs(a) > 0.01 ? `rotate(${f2(k ? -a : a)} ${x} -44)` : ''));
    P.arm.setAttribute('x2', st.arm ? 28 : 13);
    P.arm.setAttribute('y2', st.arm ? -72 : -56);
    show(P.lbl, lblO);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    // ----- Plante -----
    const g1 = stemG1(t), g2 = stemG2(t);
    const dry = decay(t, T_DRY, DRY_DUR);
    grow(S.stem1, S.s1.L, g1);
    S.stem1.setAttribute('stroke', mix(STEM, STEM_DRY, dry));
    S.stem1.setAttribute('stroke-width', f2(11 - 2.5 * dry));
    grow(S.stem2, S.s2.L, g2);
    const tip = g2 > 0.001 ? S.s2.at(g2) : S.s1.at(g1);
    if (show(S.bud, clamp(g1 / 0.06))) {
      S.bud.setAttribute('transform', `translate(${f2(tip.x)} ${f2(tip.y)}) scale(${f2(0.4 + 0.6 * clamp(g1 / 0.3))})`);
      S.bud.setAttribute('fill', mix(BUD, STEM_DRY, dry));
    }

    S.leaves.forEach((lf, i) => {
      const k = unfold(t, LEAVES[i].t, T_OUT + 0.03 * (3 - i));
      if (!show(lf.g, k > 0.001 ? 1 : 0)) return;
      const open = t < T_RE ? 1 : easeOut(prog(t, LEAVES[i].t, 0.45));
      const rot = -lf.side * (LEAF_A + 50 * (1 - open));
      lf.g.setAttribute('transform', `translate(${f2(lf.ax)} ${lf.ay}) rotate(${f2(rot)}) scale(${Math.max(k, 0.001).toFixed(3)})`);
      const pale = decay(t, 5.35 + 0.1 * i, 0.6);
      lf.shape.setAttribute('fill', mix(LEAF, LEAF_PALE, pale));
      lf.tx.setAttribute('fill', mix(C.tGreen, LEAF_TXT_PALE, pale));
      lf.vein.setAttribute('stroke', mix(VEIN, VEIN_PALE, pale));
    });
    S.sprouts.forEach((sp, j) => {
      const k = unfold(t, SPROUTS[j].t, T_OUT, 0.5);
      if (!show(sp.g, k > 0.001 ? 1 : 0)) return;
      const open = t < T_RE ? 1 : easeOut(prog(t, SPROUTS[j].t, 0.5));
      sp.g.setAttribute('transform', `translate(${f2(sp.ax)} ${sp.ay}) rotate(${f2(-sp.side * (sp.a + 40 * (1 - open)))}) scale(${Math.max(k, 0.001).toFixed(3)})`);
    });
    S.skills.forEach((sk, i) => {
      const k = unfold(t, SKILLS[i].t, T_OUT + 0.04 * i, 0.4);
      if (!show(sk.g, k > 0.001 ? 1 : 0)) return;
      sk.g.setAttribute('transform', scaleAt(Math.max(k, 0.001), sk.ox, sk.oy));
      const gh = decay(t, 5.0 + 0.15 * i, 0.35);
      show(sk.solid, 1 - gh);
      show(sk.ghost, gh);
    });

    // ----- Racines et rôles -----
    S.roots.forEach((r, i) => {
      grow(r.n, r.sp.L, rootF(i, t));
      r.n.setAttribute('stroke', mix(ROOT, ROOT_DRY, 0.85 * dry));
    });
    S.rootlets.forEach((r, j) => grow(r.n, r.L, rootletF(j, t)));
    S.roles.forEach((r, i) => {
      // Le contour fantôme s'efface d'abord, puis l'étiquette pleine entre (jamais les deux textes ensemble)
      const o = vis(t, [[REACH[i] - 0.09, Infinity]], true);
      const p = t < T_RE ? 1 : prog(t, REACH[i] + 0.06, 0.4);
      if (show(r.solid, o)) r.solid.setAttribute('transform', scaleAt(popScale(p), r.cx, r.cy));
      show(r.ghost, t < T_OUT ? 0 : t < T_RE ? prog(t, T_OUT + 0.21, 0.15) : 1 - prog(t, REACH[i] - 0.05, 0.1));
    });

    // ----- Personnes et arrosoir -----
    const cs = consultantState(t), ms = managerState(t);
    const cLbl = t < T_RE ? 0 : prog(t, 1.75, 0.2) * (1 - prog(t, T_LEAVE1, 0.1)) + prog(t, T_SWAP + 0.65, 0.2) * (1 - prog(t, T_LEAVE2, 0.1));
    const mLbl = t < T_RE ? 1 - prog(t, T_OUT, 0.2) : prog(t, 1.68, 0.2) * (1 - prog(t, T_SWAP - 0.1, 0.1)) + prog(t, T_SWAP + 0.65, 0.2);
    placePerson(S.cons, cs, cLbl);
    placePerson(S.man, ms, mLbl);

    // Arrosoir : dans la main de celui qui arrose, passe d'une main à l'autre en arc
    let can = null;
    if (t < T_RE) can = { h: handOf(ms), sx: 1, o: ms.o, tilt: 28 };
    else if (t < T_HAND) { if (cs) can = { h: handOf(cs), sx: cs.sx, o: cs.o, tilt: 28 * (easeInOut(prog(t, 1.95, 0.2)) - easeInOut(prog(t, 3.8, 0.2))) }; }
    else if (t < T_HAND + HAND_DUR) {
      const q = easeInOut(prog(t, T_HAND, HAND_DUR));
      const a = handOf(cs), b = handOf(ms);
      can = { h: [lerp(a[0], b[0], q), lerp(a[1], b[1], q) - 46 * Math.sin(Math.PI * q)], sx: 1, o: 1, tilt: -16 * Math.sin(Math.PI * q), lifted: true };
    } else can = { h: handOf(ms), sx: 1, o: 1, tilt: 28 * easeInOut(prog(t, T_TILT2, 0.2)) };
    // L'arrosoir passe devant celui qui le tient, derrière l'autre
    const before = t >= T_RE && t < T_HAND ? S.man.g : null;
    if (S.can.nextSibling !== before) S.people.insertBefore(S.can, before);
    if (can && show(S.can, can.o)) {
      S.can.setAttribute('transform', `translate(${f2(can.h[0])} ${f2(can.h[1])}) scale(${can.sx.toFixed(3)} 1) rotate(${f2(can.tilt)})`);
      if (can.lifted) S.can.setAttribute('filter', 'url(#lift)'); else S.can.removeAttribute('filter');
    } else S.can.setAttribute('display', 'none');

    // Gouttes : 6 par période de 0,5 s, tant que quelqu'un arrose
    const watering = ts => { ts = mod(ts, DURATION); return ts < T_OUT || (ts >= 2.1 && ts < 3.8) || ts >= T_ROOT2; };
    const th = can ? can.tilt * Math.PI / 180 : 0;
    const rose = can ? [can.h[0] + can.sx * (ROSE[0] * Math.cos(th) - ROSE[1] * Math.sin(th)), can.h[1] + ROSE[0] * Math.sin(th) + ROSE[1] * Math.cos(th)] : [0, 0];
    S.drops.forEach((dp, k) => {
      const u = mod(t - k * DROP_P / DROP_N, DROP_P);
      const on = can && can.tilt > 20 && watering(t - u);
      const vx = 62 * (can ? can.sx : 1), vy = -6, G = 1100;
      const y = rose[1] + vy * u + 0.5 * G * u * u;
      if (on && y < GY - 3 && u < DROP_LIFE) {
        show(dp.d, can.o);
        dp.d.setAttribute('cx', f2(rose[0] + vx * u));
        dp.d.setAttribute('cy', f2(y));
      } else dp.d.setAttribute('display', 'none');
      // Éclaboussure au contact du sol
      const tl = (-vy + Math.sqrt(vy * vy + 2 * G * (GY - 3 - rose[1]))) / G;
      const us = u - tl;
      if (on && us >= 0 && us < 0.12) {
        show(dp.s, can.o * (1 - us / 0.12));
        dp.s.setAttribute('cx', f2(rose[0] + vx * tl));
        dp.s.setAttribute('cy', GY - 1);
        dp.s.setAttribute('rx', f2(3 + 50 * us));
      } else dp.s.setAttribute('display', 'none');
    });

    // Bulles : « ? » (cas 1, personne n'arrose) puis l'œil du consultant qui regarde (cas 2)
    const bq = t < T_RE ? 0 : prog(t, 4.95, 0.3) * (1 - prog(t, T_RW, 0.14));
    if (show(S.qBubble, clamp(bq / 0.6))) S.qBubble.setAttribute('transform', scaleAt(popScale(prog(t, 4.95, 0.35)), BACKX, 582));
    const be = t < T_RE ? 0 : prog(t, T_SWAP + 0.75, 0.3) * (1 - prog(t, T_LEAVE2, 0.14));
    if (show(S.eyeBubble, clamp(be / 0.6))) S.eyeBubble.setAttribute('transform', scaleAt(popScale(prog(t, T_SWAP + 0.75, 0.35)), BACKX, 582));

    // ----- Légende : états des trois couches -----
    S.status.forEach(list => list.forEach(({ g, st }) => {
      const o = vis(t, st.wins, st.fin);
      if (!show(g, o)) return;
      const a = st.wins.find(([w0, w1]) => t >= w0 && t < w1);
      const dy = t < T_RE || !a ? 0 : 6 * (1 - prog(t, a[0] + 0.15, 0.22));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    }));

    // ----- Questions : ✗ quand il part trop tôt, ✓ quand la hiérarchie fait -----
    S.q.forEach((q, i) => {
      const pn = t < T_RE ? 0 : prog(t, NO_T[i], 0.3) * (1 - prog(t, T_RW, 0.15));
      if (show(q.no, clamp(pn / 0.4))) q.no.setAttribute('transform', scaleAt(popScale(prog(t, NO_T[i], 0.3)), q.cx, q.cy));
      const py = t < T_RE ? 1 - prog(t, T_OUT, 0.2) : prog(t, YES_T[i], 0.3);
      if (show(q.yes, t < T_RE ? py : clamp(py / 0.4))) q.yes.setAttribute('transform', t < T_RE ? '' : scaleAt(popScale(py), q.cx, q.cy));
    });

    // ----- Compteur du temps -----
    S.chipLabels.forEach(({ n, wins, fin }) => show(n, vis(t, wins, fin)));
    let mi = -1;
    if (t >= T_RE) MONTHS.forEach((m, k) => { if (t >= m[0]) mi = k; });
    const cur = mi < 0 ? MONTH0 : MONTHS[mi], prev = mi <= 0 ? MONTH0 : MONTHS[mi - 1];
    const gap = mi >= 0 && mi + 1 < MONTHS.length ? MONTHS[mi + 1][0] - cur[0] : 1;
    const pr = mi < 0 ? 1 : easeOut(prog(t, cur[0], Math.min(0.2, gap - 0.005)));
    const y0 = CHIP.y + 49, HH = 26, dir = cur[2];
    [[S.val[0], cur, dir * HH * (1 - pr)], [S.val[1], prev, -dir * HH * pr]].forEach(([n, m, dy], k) => {
      if (k === 1 && pr >= 1) { n.setAttribute('display', 'none'); return; }
      n.removeAttribute('display');
      n.textContent = m[1];
      n.setAttribute('fill', m[3]);
      n.setAttribute('y', f2(y0 + dy));
    });
    S.calPage.setAttribute('opacity', pr < 1 ? f2(0.3 + 0.7 * Math.abs(1 - 2 * pr)) : 1);
    const rwo = vis(t, [[T_RW, T_RW + 0.62]], false);
    show(S.rew, rwo);
    show(S.cal, t < T_RE ? 1 : 1 - clamp(rwo * 3));

    // ----- Pastilles d'étape : l'ancienne sort avant que la nouvelle entre -----
    S.pills.forEach(({ g, p }) => {
      const o = vis(t, p.wins, p.fin);
      if (!show(g, o)) return;
      const a = p.wins.find(([w0, w1]) => t >= w0 && t < w1);
      const dy = t < T_RE || !a ? 0 : 8 * (1 - prog(t, a[0] + 0.15, 0.22));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
