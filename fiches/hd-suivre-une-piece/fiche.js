// Fiche LinkedIn · Hugo Duc · lundi 5 octobre 2026
// Post : « Quand je découvre un atelier… Je choisis une pièce. Et je la suis. »
// Premier commentaire du post (Buffer) : article cartographie des flux (VSM) → encart.
// Le visuel est la pièce maîtresse : le plan de l'usine. La pièce le traverse, chronomètre accroché,
// du quai de réception à l'expédition. Elle attend dans un stock, un chariot, une machine, un contrôle :
// l'horloge « dans l'usine » défile en accéléré. À la machine, quelqu'un la transforme : 12 minutes qui
// s'égrènent lentement. En bas, la barre du temps se remplit de rouge, avec un mince filet vert.
// Style propre : le plan d'usine en accéléré. Image t = 0 = état final. Boucle de 14 s.
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
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', GREY = '#d9d9ea', TRACK = '#c9c9e0';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 694 };
  const ZW = 272, ZH = 190, ZX = [104, 404, 704], ZY = [510, 726];
  const ZONES = [
    { key: 'reception', label: 'Réception', x: ZX[0], y: ZY[0] },
    { key: 'stock', label: 'Stock', x: ZX[1], y: ZY[0] },
    { key: 'allee', label: 'Allée', x: ZX[2], y: ZY[0] },
    { key: 'machine', label: 'Machine', x: ZX[2], y: ZY[1] },
    { key: 'controle', label: 'Contrôle', x: ZX[1], y: ZY[1] },
    { key: 'expedition', label: 'Expédition', x: ZX[0], y: ZY[1] },
  ];
  const R1 = 636, R2 = 852;                            // hauteur du parcours dans chaque rangée
  const TRACK_PTS = [[160, R1], [540, R1], [880, R1], [880, R2], [584, R2], [300, R2]];
  const BAR = { x: 104, y: 976, w: 872, h: 36 };

  // ---------- Chronologie (s) et temps de l'usine (h) ----------
  const DURATION = 14;
  const T_OUT = 1.2, OUT_DUR = 0.3;
  const TOTAL_H = 72, PXH = BAR.w / TOTAL_H;
  // Temps de l'usine en fonction du temps de l'animation : les attentes défilent, la transformation non
  const FK = [[1.75, 0], [2.5, 0.5], [3.9, 34.5], [4.3, 35], [5.0, 39], [5.5, 39.3], [6.6, 49.3], [7.8, 49.5], [8.25, 49.75], [9.4, 71.75], [9.9, 72]];
  const TRANSFO = [49.3, 49.5];                       // 12 min
  // Position de la pièce : [t, x, y]
  const TK = [
    [1.75, 178, R1], [2.05, 240, R1], [2.1, 240, R1], [2.5, 540, R1],   // sort du quai, vers le stock
    [3.9, 540, R1], [4.3, 880, R1],                      // vers l'allée
    [5.0, 880, R1], [5.5, 880, R2],                      // sur le chariot
    [6.4, 880, R2], [6.6, 760, R2 - 6],                  // dans la machine
    [7.85, 760, R2 - 6], [8.25, 584, R2],                // vers le contrôle
    [9.05, 584, R2], [9.25, 460, R2 - 12],               // sur la table de contrôle
    [9.5, 460, R2 - 12], [9.9, 182, R2 - 16],            // dans le camion
  ];
  const SEG_T = [[1.75, 2.5], [3.9, 4.3], [5.0, 5.5], [7.85, 8.25], [9.5, 9.9]]; // tracé parcouru, segment par segment
  // Attentes : [zone, début (t), heure de début, durée (h), fin (t)]
  const WAITS = [[1, 2.5, 0.5, 34, 3.9], [2, 4.3, 35, 4, 5.0], [3, 5.5, 39.3, 10, 6.6], [4, 8.25, 49.75, 22, 9.4]];
  const T_FREE = 6.35, T_WORK = 6.6, T_DONE = 7.8, T_MORPH = 7.6;
  const T_CTRL_FREE = 9.0, T_CHECK = 9.3, T_SUM = 9.95;
  const PILLS = [
    [1.6, `Quai de réception${NB}·${NB}lundi 8${NB}h`, 'b'],
    [2.5, `1${NB}·${NB}Elle attend dans un stock`, 'b'],
    [4.3, `2${NB}·${NB}Elle attend un chariot`, 'b'],
    [5.5, `3${NB}·${NB}Elle attend qu’une machine se libère`, 'b'],
    [6.6, 'Quelqu’un la transforme', 'g'],
    [7.85, `4${NB}·${NB}Elle attend un contrôle`, 'b'],
    [9.5, 'Expédiée : 3 jours dans l’usine', 'i'],
  ];

  const factoryH = t => {
    if (t <= FK[0][0]) return 0;
    for (let i = 1; i < FK.length; i++) if (t < FK[i][0]) return lerp(FK[i - 1][1], FK[i][1], (t - FK[i - 1][0]) / (FK[i][0] - FK[i - 1][0]));
    return TOTAL_H;
  };
  const tokenPos = t => {
    if (t <= TK[0][0]) return [TK[0][1], TK[0][2]];
    for (let i = 1; i < TK.length; i++) if (t < TK[i][0]) {
      const a = TK[i - 1], b = TK[i];
      const p = easeInOut((t - a[0]) / (b[0] - a[0]));
      return [lerp(a[1], b[1], p), lerp(a[2], b[2], p)];
    }
    const z = TK[TK.length - 1];
    return [z[1], z[2]];
  };
  const hm = h => { const m = Math.round(h * 60); return `${Math.floor(m / 60)}${NB}h${NB}${String(m % 60).padStart(2, '0')}`; };

  // ---------- Pictos des zones (blancs, ~22 px) ----------
  const ICONS = {
    reception(g) {
      el('path', { d: 'M -9 2 V 8 H 9 V 2', fill: 'none', stroke: C.white, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      el('path', { d: 'M 0 -9 V 3 M -4.5 -1.5 L 0 3 L 4.5 -1.5', fill: 'none', stroke: C.white, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    },
    stock(g) {
      [-1, 9].forEach(y => el('line', { x1: -10, y1: y, x2: 10, y2: y, stroke: C.white, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g));
      [[-9, -8], [1, -8], [-4, 2]].forEach(([x, y]) => el('rect', { x, y, width: 7, height: 6, rx: 1.5, fill: C.white }, g));
    },
    allee(g) {
      el('path', { d: 'M -11 -8 L -7 -4 H 9 L 6 4 H -5 Z', fill: C.white, stroke: C.white, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, g);
      [-3, 5].forEach(x => el('circle', { cx: x, cy: 8.5, r: 2.6, fill: C.white }, g));
    },
    machine(g) {
      for (let k = 0; k < 8; k++) el('rect', { x: -2.2, y: -11, width: 4.4, height: 6, rx: 1, fill: C.white, transform: `rotate(${k * 45})` }, g);
      el('circle', { cx: 0, cy: 0, r: 6.5, fill: 'none', stroke: C.white, 'stroke-width': 3.4 }, g);
    },
    controle(g) {
      el('circle', { cx: -2, cy: -2, r: 6.5, fill: 'none', stroke: C.white, 'stroke-width': 2.8 }, g);
      el('line', { x1: 3, y1: 3, x2: 9, y2: 9, stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    },
    expedition(g) {
      el('rect', { x: -11, y: -7, width: 13, height: 11, rx: 1.5, fill: C.white }, g);
      el('path', { d: 'M 3 -3 H 8 L 11 1 V 4 H 3 Z', fill: C.white }, g);
      [-6, 7].forEach(x => el('circle', { cx: x, cy: 7, r: 2.6, fill: C.white }, g));
    },
  };
  // Petit chronomètre (sur la pièce et dans l'horloge) : renvoie l'aiguille
  function stopwatch(parent, cx, cy, k, color = C.red) {
    const g = el('g', { transform: `translate(${cx} ${cy}) scale(${k})` }, parent);
    el('rect', { x: -3, y: -15, width: 6, height: 4, rx: 1.5, fill: color }, g);
    el('circle', { cx: 0, cy: 0, r: 11, fill: C.white, stroke: color, 'stroke-width': 3 }, g);
    const hand = el('line', { x1: 0, y1: 0, x2: 0, y2: -7, stroke: color, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
    el('circle', { cx: 0, cy: 0, r: 1.8, fill: color }, g);
    return hand;
  }
  function pillShape(parent, x, cy, label, { bg, fg, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const tx = text(g, x + 20, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40);
    return g;
  }
  const piece = (parent, x, y, fill = GREY) => {
    const g = el('g', { transform: `translate(${x} ${y})` }, parent);
    el('rect', { x: -15, y: -15, width: 30, height: 30, rx: 8, fill }, g);
    return g;
  };

  const S = { zones: [], badges: [] };

  function build() {
    D.template({ author: 'hugo' });
    D.title('Suivez une pièce,', 'elle attend.');
    D.chapeau('Du quai de réception jusqu’à l’expédition, chronomètre en main.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Le chronomètre est ', 0], ['sur la pièce', C.blue], [', pas sur les personnes.', 0]]);
    line(384, [['En rouge', C.tRed], [', le temps où elle attend. ', 0], ['En vert', C.tGreen], [', celui où on la transforme.', 0]]);

    const defs = el('defs');
    const cpBar = el('clipPath', { id: 'bar' }, defs);
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: BAR.h / 2 }, cpBar);
    const glow = el('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    el('feDropShadow', { dx: 0, dy: 0, stdDeviation: 6, 'flood-color': C.green, 'flood-opacity': 0.8 }, glow);

    // ----- Cadre et plan de l'usine -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    ZONES.forEach((z, i) => {
      const box = el('rect', { x: z.x, y: z.y, width: ZW, height: ZH, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
      el('circle', { cx: z.x + 30, cy: z.y + 32, r: 17, fill: C.blue });
      ICONS[z.key](el('g', { transform: `translate(${z.x + 30} ${z.y + 32})` }));
      text(D.svg, z.x + 56, z.y + 39, z.label, { size: 19, weight: 800, fill: C.ink });
      S.zones.push({ box });
    });

    // Parcours : pointillés, puis la partie parcourue en bleu
    const pts = TRACK_PTS.map(p => p.join(' ')).join(' L ');
    el('path', { d: `M ${pts}`, fill: 'none', stroke: TRACK, 'stroke-width': 4, 'stroke-dasharray': '1 11', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    S.segs = TRACK_PTS.slice(0, -1).map((a, i) => {
      const b = TRACK_PTS[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const n = el('path', { d: `M ${a.join(' ')} L ${b.join(' ')}`, fill: 'none', stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': f2(len), 'stroke-dashoffset': f2(len), opacity: 0.55 });
      return { n, len };
    });

    // Décors des zones
    // Réception : la porte du quai, d'où sort la pièce
    el('rect', { x: ZX[0] + 18, y: R1 - 42, width: 40, height: 84, rx: 5, fill: '#e6e6f2', stroke: CARD_LINE, 'stroke-width': 2 });
    [1, 2, 3, 4, 5].forEach(k => el('line', { x1: ZX[0] + 22, y1: R1 - 42 + k * 14, x2: ZX[0] + 54, y2: R1 - 42 + k * 14, stroke: CARD_LINE, 'stroke-width': 2 }));
    // Stock : une étagère et les pièces qui y dorment
    el('line', { x1: ZX[1] + 22, y1: R1 + 17, x2: ZX[1] + ZW - 22, y2: R1 + 17, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' });
    [ZX[1] + 52, ZX[1] + 88, ZX[1] + 192, ZX[1] + 228].forEach(x => piece(D.svg, x, R1));
    // Allée : l'aire d'attente au sol
    el('rect', { x: 880 - 46, y: R1 - 40, width: 92, height: 80, rx: 10, fill: 'none', stroke: TRACK, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' });
    // Machine : le bâti, son écran et son voyant
    el('rect', { x: 722, y: R2 - 52, width: 76, height: 100, rx: 12, fill: C.blue });
    el('rect', { x: 732, y: R2 - 42, width: 56, height: 22, rx: 5, fill: C.white, 'fill-opacity': 0.9 });
    S.mBar = el('rect', { x: 736, y: R2 - 35, width: 0, height: 8, rx: 4, fill: C.green });
    S.mLight = el('circle', { cx: 760, cy: R2 + 30, r: 7, fill: C.red });
    S.mPiece = piece(D.svg, 760, R2 - 6, '#b9b9d6');
    // Contrôle : la table, la loupe, et la coche
    el('rect', { x: ZX[1] + 22, y: R2 + 6, width: 76, height: 14, rx: 5, fill: C.lightBlue });
    S.cPiece = piece(D.svg, 460, R2 - 12, '#b9b9d6');
    S.check = el('g');
    el('circle', { cx: 0, cy: 0, r: 15, fill: C.green }, S.check);
    el('path', { d: 'M -6.5 0.5 L -2 5 L 7 -4.5', fill: 'none', stroke: C.white, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.check);
    // Expédition : le camion
    el('rect', { x: ZX[0] + 26, y: R2 - 44, width: 118, height: 60, rx: 8, fill: C.blue });
    el('path', { d: `M ${ZX[0] + 146} ${R2 - 30} H ${ZX[0] + 176} L ${ZX[0] + 196} ${R2 - 8} V ${R2 + 16} H ${ZX[0] + 146} Z`, fill: C.lightBlue, 'stroke-linejoin': 'round' });
    el('rect', { x: ZX[0] + 160, y: R2 - 24, width: 18, height: 12, rx: 3, fill: C.white, 'fill-opacity': 0.85 });
    [ZX[0] + 56, ZX[0] + 170].forEach(x => { el('circle', { cx: x, cy: R2 + 20, r: 11, fill: C.ink }); el('circle', { cx: x, cy: R2 + 20, r: 4, fill: C.white }); });

    // Chariot (passe prendre la pièce dans l'allée)
    S.cart = el('g');
    el('path', { d: 'M 30 -40 L 26 -20', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.cart);
    el('rect', { x: -30, y: -20, width: 56, height: 22, rx: 6, fill: C.violet }, S.cart);
    [-18, 14].forEach(x => el('circle', { cx: x, cy: 8, r: 6, fill: C.ink }, S.cart));

    // La pièce, avec son chronomètre
    S.token = el('g');
    S.ring = el('circle', { cx: 0, cy: 0, r: 29, fill: 'none', stroke: C.green, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': f2(2 * Math.PI * 29), 'stroke-dashoffset': f2(2 * Math.PI * 29), transform: 'rotate(-90)' }, S.token);
    S.raw = el('g', {}, S.token);
    el('rect', { x: -17, y: -17, width: 34, height: 34, rx: 9, fill: C.blue }, S.raw);
    el('circle', { cx: 0, cy: 0, r: 6, fill: C.white }, S.raw);
    S.done = el('g', {}, S.token);
    el('rect', { x: -17, y: -17, width: 34, height: 34, rx: 9, fill: C.green }, S.done);
    el('path', { d: 'M -7 0.5 L -2 5.5 L 7.5 -5', fill: 'none', stroke: C.white, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.done);
    S.tokHand = stopwatch(S.token, 21, -22, 0.95);

    // Badges d'attente (en haut à droite des zones) et « 12 min » à la machine
    WAITS.forEach(([zi]) => {
      const z = ZONES[zi];
      const g = el('g');
      const r = el('rect', { y: z.y + 15, height: 34, rx: 17, fill: C.pRed }, g);
      const tx = text(g, 0, z.y + 39, '', { size: 18, weight: 800, fill: C.tRed, anchor: 'end' });
      S.badges.push({ g, r, tx, right: z.x + ZW - 14 });
    });
    S.green = el('g');
    el('rect', { x: 880 - 50, y: R2 - 18, width: 100, height: 36, rx: 18, fill: C.pGreen }, S.green);
    text(S.green, 880, R2 + 7, `12${NB}min`, { size: 19, weight: 800, fill: C.tGreen, anchor: 'middle' });

    // Horloge « dans l'usine »
    el('rect', { x: 744, y: 428, width: 244, height: 60, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    S.clockHand = stopwatch(D.svg, 774, 460, 1.15, C.blue);
    text(D.svg, 800, 451, 'Dans l’usine', { size: 14, weight: 700, fill: MUTED });
    S.clock = text(D.svg, 800, 478, '', { size: 23, weight: 800, fill: C.ink });

    // Barre du temps de la pièce
    text(D.svg, BAR.x, BAR.y - 14, 'Le temps de la pièce', { size: 17, weight: 700, fill: MUTED });
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: BAR.h / 2, fill: '#e6e6f2' });
    const bar = el('g', { 'clip-path': 'url(#bar)' });
    S.barFill = el('rect', { x: BAR.x, y: BAR.y, width: 0, height: BAR.h, fill: C.red }, bar);
    const gx = BAR.x + (TRANSFO[0] + TRANSFO[1]) / 2 * PXH;
    S.sliver = el('g', {}, bar);
    el('rect', { x: gx - 7, y: BAR.y, width: 14, height: BAR.h, fill: C.card }, S.sliver);
    el('rect', { x: gx - 4, y: BAR.y, width: 8, height: BAR.h, fill: C.green }, S.sliver);
    S.callout = el('g');
    el('line', { x1: gx, y1: BAR.y - 8, x2: gx, y2: BAR.y - 2, stroke: C.green, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, S.callout);
    text(S.callout, gx, BAR.y - 14, `12${NB}min`, { size: 17, weight: 800, fill: C.tGreen, anchor: 'middle' });

    // Bilan sous la barre
    S.sum = el('g');
    el('circle', { cx: BAR.x + 9, cy: BAR.y + 76, r: 9, fill: C.red }, S.sum);
    fit(text(S.sum, BAR.x + 26, BAR.y + 83, `Attente${NB}: 71${NB}h${NB}48${NB}min${NB}·${NB}99,7${NB}%`, { size: 20, weight: 800, fill: C.tRed }), 560, 'bilan attente');
    const st = text(S.sum, BAR.x + BAR.w, BAR.y + 83, `Transformation${NB}: 12${NB}min${NB}·${NB}0,3${NB}%`, { size: 20, weight: 800, fill: C.tGreen, anchor: 'end' });
    el('circle', { cx: st.getBBox().x - 17, cy: BAR.y + 76, r: 9, fill: C.green }, S.sum);
    fit(st, BAR.x + BAR.w, 'bilan transformation', 560);

    // Pastilles d'étape
    S.pills = PILLS.map(([, label, k]) => pillShape(D.svg, 92, 458, label, k === 'g' ? { bg: C.pGreen, fg: C.tGreen } : k === 'i' ? { bg: C.blue, fg: C.white } : { bg: C.blue, fg: C.white }));
    S.pills.forEach((p, i) => fit(p, 730, `pastille ${i + 1}`));

    D.encart(['Cartographier ses flux', 'Notre article sur la VSM', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_OUT + OUT_DUR;
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    const s = final ? DURATION : t;                     // temps de séquence (final = fin)
    const F = factoryH(s);

    // Horloge
    S.clock.textContent = hm(F);
    S.clock.setAttribute('fill', s >= T_WORK && s < T_DONE ? C.tGreen : C.ink);
    S.clock.setAttribute('opacity', f2(final ? fade : 1));
    S.clockHand.setAttribute('transform', `rotate(${f2(F * 720)})`);

    // Pièce
    const [x, y] = tokenPos(s);
    const pin = final ? 1 : prog(t, TK[0][0], 0.35);
    const k = popScale(pin);
    S.token.setAttribute('transform', `translate(${f2(x)} ${f2(y)})` + (k !== 1 ? ` scale(${f2(k)})` : ''));
    S.token.setAttribute('opacity', f2((final ? 1 : clamp(pin / 0.4)) * fade));
    const morph = final ? 1 : prog(t, T_MORPH, 0.2);
    S.raw.setAttribute('opacity', f2(1 - morph));
    S.done.setAttribute('opacity', f2(morph));
    S.tokHand.setAttribute('transform', `rotate(${f2(F * 1440)})`);
    const ringP = final ? 0 : prog(t, T_WORK, T_DONE - T_WORK);
    const L = 2 * Math.PI * 29;
    S.ring.setAttribute('stroke-dashoffset', f2(L * (1 - ringP)));
    S.ring.setAttribute('opacity', !final && t >= T_WORK && t < T_DONE + 0.15 ? 1 : 0);
    if (!final && t >= T_WORK && t < T_DONE) S.token.setAttribute('filter', 'url(#glow)'); else S.token.removeAttribute('filter');

    // Parcours effectué
    S.segs.forEach((sg, i) => {
      const p = final ? 1 : easeInOut(prog(t, SEG_T[i][0], SEG_T[i][1] - SEG_T[i][0]));
      sg.n.setAttribute('stroke-dashoffset', f2(sg.len * (1 - p)));
      sg.n.setAttribute('opacity', f2(0.55 * fade));
    });

    // Chariot : arrive par la droite, emmène la pièce, repart
    let cx = 1010, cy = R1 + 22, co = 0;
    if (!final) {
      if (t >= 4.55 && t < 5.0) { cx = lerp(1010, 880, easeOut(prog(t, 4.55, 0.4))); co = clamp((t - 4.55) / 0.15); }
      else if (t >= 5.0 && t < 5.55) { cx = 880; cy = lerp(R1 + 22, R2 + 22, easeInOut(prog(t, 5.0, 0.5))); co = 1; }
      else if (t >= 5.55 && t < 6.0) { const p = prog(t, 5.55, 0.4); cx = lerp(880, 1010, easeInOut(p)); cy = R2 + 22; co = 1 - prog(t, 5.8, 0.2); }
    }
    S.cart.setAttribute('transform', `translate(${f2(cx)} ${f2(cy)})`);
    S.cart.setAttribute('opacity', f2(co));

    // Zones : contour rouge pendant l'attente, vert pendant la transformation
    S.zones.forEach((z, i) => {
      let col = CARD_LINE, w = 2;
      if (!final) {
        WAITS.forEach(([zi, t0, , , t1]) => { if (zi === i && t >= t0 && t < t1) { col = C.red; w = 3; } });
        if (i === 3 && t >= T_WORK && t < T_DONE) { col = C.green; w = 3.5; }
      }
      z.box.setAttribute('stroke', col);
      z.box.setAttribute('stroke-width', w);
    });

    // Badges d'attente : comptent pendant l'attente, puis restent
    S.badges.forEach((b, i) => {
      const [, t0, h0, dur] = WAITS[i];
      const v = clamp(F - h0, 0, dur);
      const on = final ? 1 : prog(t, t0, 0.3);
      b.tx.textContent = `${Math.round(v)}${NB}h`;
      b.tx.setAttribute('x', f2(b.right - 14));
      const w = b.tx.getBBox().width + 28;
      b.r.setAttribute('x', f2(b.right - w));
      b.r.setAttribute('width', f2(w));
      const kb = popScale(on);
      const cxb = b.right - w / 2, cyb = ZONES[WAITS[i][0]].y + 32;
      b.g.setAttribute('transform', kb === 1 ? '' : `translate(${f2(cxb)} ${cyb}) scale(${f2(kb)}) translate(${f2(-cxb)} ${-cyb})`);
      b.g.setAttribute('opacity', f2(clamp(on / 0.4) * fade));
    });
    const pg = final ? 1 : prog(t, T_DONE + 0.05, 0.35);
    const kg = popScale(pg);
    S.green.setAttribute('transform', kg === 1 ? '' : `translate(880 ${R2}) scale(${f2(kg)}) translate(-880 ${-R2})`);
    S.green.setAttribute('opacity', f2(clamp(pg / 0.4) * fade));

    // Machine : occupée (voyant rouge), libérée, puis elle transforme la pièce
    const busy = !final && t < T_FREE;
    const working = !final && t >= T_WORK && t < T_DONE;
    S.mLight.setAttribute('fill', busy ? C.red : C.green);
    S.mLight.setAttribute('opacity', working && Math.floor(t / 0.2) % 2 ? 0.35 : 1);
    S.mBar.setAttribute('width', f2(48 * (busy ? clamp((t - 1.5) / (T_FREE - 1.5)) : working ? prog(t, T_WORK, T_DONE - T_WORK) : 0)));
    const mp = final ? 1 : prog(t, T_FREE - 0.05, 0.3);
    S.mPiece.setAttribute('transform', `translate(${f2(760 - 70 * easeInOut(mp))} ${R2 - 6})`);
    S.mPiece.setAttribute('opacity', f2(final ? 0 : (1 - mp) * clamp((t - T_OUT - OUT_DUR) / 0.3)));

    // Contrôle : la pièce précédente part, la nôtre est contrôlée
    const cp = final ? 1 : prog(t, T_CTRL_FREE, 0.25);
    S.cPiece.setAttribute('transform', `translate(${f2(460 - 60 * easeInOut(cp))} ${R2 - 12})`);
    S.cPiece.setAttribute('opacity', f2(final ? 0 : (1 - cp) * clamp((t - T_OUT - OUT_DUR) / 0.3)));
    const pc = final ? 1 : prog(t, T_CHECK, 0.35);
    const kc = popScale(pc);
    S.check.setAttribute('transform', `translate(${ZX[1] + 132} ${R2 - 12}) scale(${f2(kc)})`);
    S.check.setAttribute('opacity', f2(clamp(pc / 0.4) * fade));

    // Barre du temps
    S.barFill.setAttribute('width', f2(F * PXH * fade + 0.001));
    const sv = final ? 1 : prog(t, T_WORK, 0.3);
    S.sliver.setAttribute('opacity', f2((F >= TRANSFO[0] ? sv : 0) * fade));
    const pco = final ? 1 : prog(t, T_WORK + 0.1, 0.35);
    S.callout.setAttribute('opacity', f2(pco * fade));
    S.callout.setAttribute('transform', pco >= 1 ? '' : `translate(0 ${f2(8 * (1 - easeOut(pco)))})`);

    // Bilan
    const ps = final ? 1 : prog(t, T_SUM, 0.4);
    S.sum.setAttribute('opacity', f2(ps * fade));
    S.sum.setAttribute('transform', ps >= 1 ? '' : `translate(0 ${f2(14 * (1 - easeOut(ps)))})`);

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = PILLS[i][0] + (i ? 0.12 : 0);
      const b = i + 1 < PILLS.length ? PILLS[i + 1][0] : Infinity;
      let o = final ? (i === PILLS.length - 1 ? fade : 0) : prog(t, a, 0.25) * (1 - prog(t, b, 0.14));
      const dy = final ? 0 : 8 * (1 - prog(t, a, 0.25));
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
