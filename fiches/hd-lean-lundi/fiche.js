// Fiche LinkedIn · Hugo Duc · vendredi 30 octobre 2026
// Post : « Pas besoin de budget pour commencer le Lean lundi. »
// Premier commentaire du post (Buffer) : la White Belt gratuite → encart.
// Le visuel est la pièce maîtresse : l'agenda de la semaine. Un curseur de jour descend de lundi à
// vendredi. Lundi, l'horloge se remplit sur 30 minutes au poste et les réponses de l'équipe se collent
// en petites notes. Mardi, elles se regroupent (chaque note envoie son bâtonnet). Mercredi, celle qui
// revient le plus est entourée. Jeudi, la cause est cherchée au poste et l'essai marche. Vendredi, le
// standard s'écrit à la main sur une feuille, punaisée. En bas, ce qu'il n'y a pas, barré. Puis la
// grande flèche de boucle se trace de vendredi à lundi : « Boucle 1 bouclée », le compteur passe à 2
// et le deuxième problème attend son tour.
// Style propre : la semaine qui boucle. Image t = 0 = état final. Boucle exacte de 12,5 s.
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
  const settle = p => { const c = 1.1; return p <= 0 ? 0 : p >= 1 ? 1 : 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const about = (cx, cy, tf) => `translate(${f2(cx)} ${f2(cy)}) ${tf} translate(${f2(-cx)} ${f2(-cy)})`;
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', DASH = '#b6b6d4';
  const GHOST_INK = '#6e6e9c', FOLD = '#ece0a6', RULE = '#dde2f2', MARGIN = '#f4b9b9', INK_PEN = C.blue;

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const PILL_Y = 456;
  const GX = 134, CHIP_W = 108, CHIP_H = 38;          // gouttière des jours et curseur
  const CX0 = 204, CX1 = 866;                         // colonne des événements
  const LUN = { y: 496, h: 160 }, MID = { y: 664, h: 252 };
  const DAYS = [['Lundi', 576], ['Mardi', 706], ['Mercredi', 790], ['Jeudi', 874], ['Vendredi', 984]];
  const SEPS = [660, 748, 832, 920, 1050];
  const GHOST_Y = 1090;

  // Lundi : l'horloge et les notes
  const CLOCK = { x: 264, y: 562, r: 38 };
  const NOTES = [
    ['On cherche la clé de 13', 0], ['Le bac est trop bas', 1], ['Les pièces arrivent tard', 2],
    ['Encore cette clé…', 0], ['Mal au dos avec ce bac', 1], [`Où est la clé${NB}?`, 0],
  ];
  const NW = 256, NH = 30, NX = [326, 592], NY = [544, 578, 612];
  const ROT = [-1.2, 0.9, 0.7, -0.8, -0.6, 1.1];
  // Mardi → jeudi : le regroupement, le choix, la cause
  const GROUPS = [
    { label: 'La clé de 13', color: C.blue },
    { label: 'Le bac trop bas', color: C.teal },
    { label: 'Pièces en retard', color: C.violet },
  ];
  const GY = [730, 770, 810];
  const MARK_X = 454, MARK_DX = 12, COUNT_X = 532, DOT_X = 238, LABEL_X = 258;
  const CAUSE = { x: 564, y: 680, w: 288, h: 220 };
  // Vendredi : la feuille de standard
  const SHEET = { x: 212, y: 932, w: 644, h: 104, rot: -0.6 };
  const HAND = [
    { str: `La clé de 13${NB}: sur son crochet, à droite de l’établi.`, x: 268, y: 988 },
    { str: 'On la remet après chaque réglage.', x: 268, y: 1019 },
  ];
  const PIN = { x: 834, y: 948 };
  // La boucle : de vendredi à lundi
  const ARC_D = 'M 872 984 C 1006 984, 1006 576, 874 576';
  const BADGE = { x: 972, y: 780, r: 34 };

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.2, OUT_DUR = 0.25;                   // l'image finale s'efface, puis la semaine se rejoue
  const T_P = [1.5, 3.3, 8.05, 10.95];                 // pastilles d'étape
  const T_BADGE_IN = 1.6;
  // Lundi
  const T_LCARD = 1.5, T_LHEAD = 1.72, T_CLOCK = 1.65, CLOCK_DUR = 1.5;
  const T_NOTE = NOTES.map((_, k) => 1.8 + 0.24 * k), NOTE_DROP = 0.3;
  // Mardi : chaque note envoie son bâtonnet
  const T_MCARD = 3.35, T_TALLY = 3.45;
  const T_TOK = NOTES.map((_, k) => 3.7 + 0.22 * k), FLY = 0.42, MARK = 0.12;
  // Mercredi : on choisit
  const T_RING = 5.35, RING_DUR = 0.45, T_CRIT = [5.75, 5.92];
  // Jeudi : la cause, au poste, puis l'essai
  const T_CAUSE = 6.2, CPS = 58, T_TYPE = [6.35, 6.85, 7.4], T_OK = 7.95;
  // Vendredi : le standard s'écrit
  const T_SHEET = 8.1, T_SHEAD = 8.35, T_HAND = [8.5, 9.2], HAND_DUR = [0.62, 0.45], T_TICK = 9.78, T_PIN = 9.9;
  // Ce qu'il n'y a pas
  const T_STRIKE = [9.95, 10.1, 10.25], STRIKE = 0.22;
  // La boucle se ferme
  const T_ARC = 10.2, ARC_DUR = 0.72, T_ROLL = 10.92, T_ROW = [11.05, 11.15];
  // Curseur : [t, de, vers, durée]
  const CUR = [[3.3, 0, 1, 0.4], [5.3, 1, 2, 0.35], [6.15, 2, 3, 0.35], [8.05, 3, 4, 0.4], [10.45, 4, 0, 0.5]];

  // Bâtonnet de chaque note dans son groupe
  const markIdx = NOTES.map(([, g], k) => NOTES.slice(0, k).filter(([, h]) => h === g).length);
  const landT = k => T_TOK[k] + FLY;

  // ---------- Petits éléments ----------
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
  const checkPath = (cx, cy, k = 1) => `M ${f2(cx - 5.5 * k)} ${f2(cy + 0.5 * k)} L ${f2(cx - 1.5 * k)} ${f2(cy + 4.5 * k)} L ${f2(cx + 5.5 * k)} ${f2(cy - 3.5 * k)}`;
  function checkDot(parent, cx, cy, r, fill = C.green) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill }, g);
    el('path', { d: checkPath(cx, cy, r / 11), fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  // Texte qui se tape : renvoie le nœud (full = texte complet)
  function typedNode(parent, x, y, str, opts) {
    const n = text(parent, x, y, str, opts);
    n.full = str;
    return n;
  }
  const drawable = (n, len) => { n.setAttribute('stroke-dasharray', f2(len)); n.setAttribute('stroke-dashoffset', f2(len)); n.len = len; return n; };
  const drawTo = (n, p) => n.setAttribute('stroke-dashoffset', f2(n.len * (1 - clamp(p))));

  // Pictos des fantômes (gris, traits)
  const GHOSTS = [
    {
      label: 'Tableau neuf', icon(g) {
        el('rect', { x: -12, y: -10, width: 24, height: 16, rx: 2.5, fill: 'none', stroke: MUTED, 'stroke-width': 2.2 }, g);
        el('path', { d: 'M -6 10 L -3 6 M 6 10 L 3 6', stroke: MUTED, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
        el('path', { d: 'M -7 2 V -1 M -2 2 V -5 M 3 2 V -3', stroke: MUTED, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
      },
    },
    {
      label: 'Formation de trois jours', icon(g) {
        el('path', { d: 'M -13 -3 L 0 -9 L 13 -3 L 0 3 Z', fill: 'none', stroke: MUTED, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
        el('path', { d: 'M -7 0 V 6 C -3 9, 3 9, 7 6 V 0', fill: 'none', stroke: MUTED, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
        el('path', { d: 'M 11 -2 V 5', stroke: MUTED, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
      },
    },
    {
      label: 'Plan de transformation', icon(g) {
        el('rect', { x: -10, y: -12, width: 20, height: 24, rx: 3, fill: 'none', stroke: MUTED, 'stroke-width': 2.2 }, g);
        el('path', { d: 'M -5 -5 H 1 M -3 0 H 5 M 0 5 H 6', stroke: MUTED, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g);
      },
    },
  ];

  const S = { notes: [], tokens: [], marks: [], rows: [], typed: [], hands: [], strikes: [] };

  function build() {
    D.template({ author: 'hugo' });
    D.title('Une boucle,', 'en une semaine.');
    D.chapeau('Pas besoin de budget pour commencer le Lean lundi.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Lundi on ', 0], ['écoute', C.blue], [', dans la semaine on ', 0], ['traite un seul problème', C.blue], [', vendredi on ', 0], ['l’écrit', C.blue], ['.', 0]]);
    line(384, [['Quand l’équipe signale quelque chose, ', 0], ['il se passe quelque chose', C.tGreen], ['.', 0]]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-40%', y: '-60%', width: '180%', height: '240%' }, defs);
    el('feDropShadow', { dx: 0, dy: 8, stdDeviation: 6, 'flood-color': C.ink, 'flood-opacity': 0.24 }, lift);
    const paper = el('filter', { id: 'paper', x: '-5%', y: '-20%', width: '110%', height: '150%' }, defs);
    el('feDropShadow', { dx: 0, dy: 3, stdDeviation: 3.5, 'flood-color': C.ink, 'flood-opacity': 0.13 }, paper);
    const paperLift = el('filter', { id: 'paperLift', x: '-8%', y: '-40%', width: '116%', height: '200%' }, defs);
    el('feDropShadow', { dx: 0, dy: 14, stdDeviation: 10, 'flood-color': C.ink, 'flood-opacity': 0.22 }, paperLift);
    const cpCur = el('clipPath', { id: 'cursor' }, defs);
    S.curClip = el('rect', { x: GX - CHIP_W / 2, y: 0, width: CHIP_W, height: CHIP_H, rx: CHIP_H / 2 }, cpCur);
    const cpDigit = el('clipPath', { id: 'digit' }, defs);
    el('rect', { x: BADGE.x - 18, y: BADGE.y - 1, width: 36, height: 24 }, cpDigit);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- Squelette de l'agenda : jours, séparations, fantômes -----
    el('line', { x1: 194, y1: LUN.y, x2: 194, y2: 1044, stroke: C.line, 'stroke-width': 2 });
    SEPS.forEach(y => el('line', { x1: 86, y1: y, x2: 182, y2: y, stroke: C.line, 'stroke-width': 2, 'stroke-linecap': 'round' }));
    DAYS.forEach(([d, y]) => fit(text(D.svg, GX, y + 6.5, d, { size: 18, weight: 800, fill: MUTED, anchor: 'middle' }), 188, `jour ${d}`, 80));
    // Curseur du jour : pastille bleue, le nom passe en blanc dessous
    S.cursor = el('g');
    el('rect', { x: GX - CHIP_W / 2, y: -CHIP_H / 2, width: CHIP_W, height: CHIP_H, rx: CHIP_H / 2, fill: C.blue }, S.cursor);
    el('path', { d: `M ${GX + CHIP_W / 2 - 2} -7 L ${GX + CHIP_W / 2 + 7} 0 L ${GX + CHIP_W / 2 - 2} 7 Z`, fill: C.blue }, S.cursor);
    const white = el('g', { 'clip-path': 'url(#cursor)' });
    DAYS.forEach(([d, y]) => fit(text(white, GX, y + 6.5, d, { size: 18, weight: 800, fill: C.white, anchor: 'middle' }), GX + CHIP_W / 2 - 6, `curseur ${d}`, GX - CHIP_W / 2 + 6));

    // Ce qu'il n'y a pas : trois fantômes en pointillés
    fit(text(D.svg, GX, GHOST_Y + 6.5, 'Pas de', { size: 18, weight: 800, fill: MUTED, anchor: 'middle' }), 188, 'pas de', 80);
    let gx = CX0;
    S.ghosts = GHOSTS.map((gh, i) => {
      const g = el('g');
      const r = el('rect', { x: gx, y: GHOST_Y - 20, height: 40, rx: 20, fill: 'none', stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
      gh.icon(el('g', { transform: `translate(${gx + 30} ${GHOST_Y})` }, g));
      const lt = text(g, gx + 52, GHOST_Y + 6, gh.label, { size: 17, weight: 700, fill: GHOST_INK });
      fit(lt, 1004, `fantôme ${i + 1} libellé`);
      const lw = lt.getBBox().width;
      const w = 52 + lw + 18;
      r.setAttribute('width', w);
      fit(r, 1004, `fantôme ${i + 1}`);
      const strike = { x0: gx + 48, x1: gx + 52 + lw + 6, label: lt };
      gx += w + 14;
      return { g, lt, strike };
    });
    // Tracé fantôme de la boucle
    el('path', { d: ARC_D, fill: 'none', stroke: DASH, 'stroke-width': 3, 'stroke-dasharray': '2 9', 'stroke-linecap': 'round' });

    // ----- Contenu (s'efface puis se rejoue) -----
    S.content = el('g');
    const K = S.content;

    // Lundi : l'événement « au poste »
    S.lcard = el('g', {}, K);
    S.lcardBox = el('rect', { x: CX0, y: LUN.y, width: CX1 - CX0, height: LUN.h, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.lcard);
    el('rect', { x: CX0 + 8, y: LUN.y + 14, width: 5, height: LUN.h - 28, rx: 2.5, fill: C.blue }, S.lcard);
    S.lhead = text(K, NX[0], LUN.y + 33, `«${NB}Qu’est-ce qui vous empêche de bien travailler${NB}?${NB}»`, { size: 16, weight: 700, fill: C.blue });
    fit(S.lhead, CX1 - 12, 'question lundi');
    // Horloge : 30 minutes au poste
    S.clock = el('g', {}, K);
    el('circle', { cx: CLOCK.x, cy: CLOCK.y, r: CLOCK.r, fill: C.white, stroke: C.ink, 'stroke-width': 3.5 }, S.clock);
    S.sector = el('path', { d: '', fill: C.lightBlue, 'fill-opacity': 0.4 }, S.clock);
    S.rim = el('path', { d: '', fill: 'none', stroke: C.blue, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, S.clock);
    for (let k = 0; k < 12; k++) {
      const a = k * Math.PI / 6, r0 = k % 3 ? 29 : 26;
      el('line', { x1: f2(CLOCK.x + r0 * Math.sin(a)), y1: f2(CLOCK.y - r0 * Math.cos(a)), x2: f2(CLOCK.x + 32 * Math.sin(a)), y2: f2(CLOCK.y - 32 * Math.cos(a)), stroke: k % 3 ? MUTED : C.ink, 'stroke-width': k % 3 ? 1.6 : 2.6, 'stroke-linecap': 'round' }, S.clock);
    }
    S.hand = el('line', { x1: CLOCK.x, y1: CLOCK.y, x2: CLOCK.x, y2: CLOCK.y - 27, stroke: C.blue, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, S.clock);
    el('circle', { cx: CLOCK.x, cy: CLOCK.y, r: 4, fill: C.ink }, S.clock);
    S.minutes = text(K, CLOCK.x, LUN.y + LUN.h - 18, `30${NB}min`, { size: 20, weight: 800, fill: C.blue, anchor: 'middle' });
    fit(S.minutes, NX[0] - 8, 'minutes', CX0 + 16);
    // Les réponses, telles qu'elles viennent
    NOTES.forEach(([str, gi], k) => {
      const x = NX[k % 2], y = NY[Math.floor(k / 2)];
      const g = el('g', {}, K);
      el('rect', { x, y, width: NW, height: NH, rx: 5, fill: C.pYellow }, g);
      el('path', { d: `M ${x + NW - 14} ${y + NH} L ${x + NW} ${y + NH - 14} L ${x + NW} ${y + NH - 5} Q ${x + NW} ${y + NH} ${x + NW - 5} ${y + NH} Z`, fill: FOLD }, g);
      const tx = text(g, x + 12, y + 20.5, str, { size: 16, weight: 700, fill: C.ink });
      fit(tx, x + NW - 30, `note ${k + 1}`);
      const dot = el('circle', { cx: x + NW - 24, cy: y + NH / 2, r: 5.5, fill: GROUPS[gi].color }, g);
      S.notes.push({ g, dot, cx: x + NW / 2, cy: y + NH / 2, dx: x + NW - 24 });
    });

    // Mardi → jeudi : l'événement « un seul problème »
    S.mcard = el('g', {}, K);
    S.mcardBox = el('rect', { x: CX0, y: MID.y, width: CX1 - CX0, height: MID.h, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.mcard);
    el('rect', { x: CX0 + 8, y: MID.y + 14, width: 5, height: MID.h - 28, rx: 2.5, fill: C.blue }, S.mcard);
    S.thead = text(K, 228, MID.y + 32, 'Les réponses, regroupées', { size: 15, weight: 700, fill: MUTED });
    S.thead.setAttribute('letter-spacing', 0.3);
    fit(S.thead, CAUSE.x - 12, 'titre regroupement');
    // Anneau tracé à la main autour du problème choisi
    const ry0 = GY[0] - 21, ry1 = GY[0] + 21;
    S.ring = el('path', { d: `M 250 ${ry0 - 1} C 330 ${ry0 - 4}, 470 ${ry0 - 3}, 530 ${ry0 + 1} C 550 ${ry0 + 3}, 551 ${ry1 - 2}, 532 ${ry1} C 450 ${ry1 + 4}, 300 ${ry1 + 3}, 238 ${ry1 - 1} C 219 ${ry1 - 3}, 218 ${ry0 + 4}, 240 ${ry0 + 1} C 250 ${ry0}, 260 ${ry0 - 2}, 270 ${ry0 - 3}`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round' }, K);
    drawable(S.ring, S.ring.getTotalLength());
    GROUPS.forEach((gr, i) => {
      const g = el('g', {}, K);
      const dot = el('circle', { cx: DOT_X, cy: GY[i], r: 5.5, fill: gr.color }, g);
      fit(text(g, LABEL_X, GY[i] + 6, gr.label, { size: 17, weight: 700, fill: C.ink }), MARK_X - 12, `groupe ${i + 1}`);
      const count = text(g, COUNT_X, GY[i] + 7.5, '3', { size: 21, weight: 800, fill: C.ink, anchor: 'end' });
      fit(count, COUNT_X, `compteur ${i + 1}`, MARK_X + 3 * MARK_DX + 8);
      const badge = el('g', {}, g);
      if (i === 0) checkDot(badge, DOT_X, GY[i], 12);
      else if (i === 1) {
        el('circle', { cx: DOT_X, cy: GY[i], r: 12, fill: C.teal }, badge);
        fit(text(badge, DOT_X, GY[i] + 5.5, '2', { size: 15, weight: 800, fill: C.white, anchor: 'middle' }), DOT_X + 10, 'pastille 2', DOT_X - 10);
      }
      S.rows.push({ g, dot, count, badge });
    });
    // Bâtonnets (un par note)
    NOTES.forEach(([, gi], k) => {
      const mx = MARK_X + MARK_DX * markIdx[k], cy = GY[gi];
      const m = el('line', { x1: mx + 3, y1: cy - 12, x2: mx - 1, y2: cy + 12, stroke: C.ink, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, K);
      drawable(m, Math.hypot(4, 24) + 1);
      S.marks.push({ m, x: mx + 1, y: cy });
    });
    // Critères du choix
    S.crit = ['Revient le plus', 'L’équipe peut le traiter elle-même'].map((str, i) => {
      const g = el('g', {}, K);
      const cy = 852 + i * 30;
      checkDot(g, DOT_X, cy, 10);
      fit(text(g, LABEL_X - 4, cy + 5.5, str, { size: 16, weight: 700, fill: C.tGreen }), CAUSE.x - 16, `critère ${i + 1}`);
      return { g, cy };
    });
    // La cause, cherchée au poste, puis l'essai
    S.cause = el('g', {}, K);
    el('rect', { x: CAUSE.x, y: CAUSE.y, width: CAUSE.w, height: CAUSE.h, rx: 16, fill: C.pLav }, S.cause);
    S.lens = el('g', {}, S.cause);
    el('circle', { cx: 0, cy: 0, r: 7, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, S.lens);
    el('line', { x1: 5.5, y1: 5.5, x2: 11, y2: 11, stroke: C.blue, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, S.lens);
    fit(text(S.cause, CAUSE.x + 42, CAUSE.y + 31, 'Cause, cherchée au poste', { size: 15, weight: 800, fill: C.blue }), CAUSE.x + CAUSE.w - 14, 'titre cause');
    el('line', { x1: CAUSE.x + 18, y1: CAUSE.y + 122, x2: CAUSE.x + CAUSE.w - 18, y2: CAUSE.y + 122, stroke: C.blue, 'stroke-opacity': 0.18, 'stroke-width': 2 }, S.cause);
    [
      [`Pourquoi on la cherche${NB}?`, CAUSE.y + 70, 17, 800, C.ink],
      ['Elle n’a pas de place fixe.', CAUSE.y + 100, 17, 700, C.tRed],
      [`Essai${NB}: un crochet au poste`, CAUSE.y + 152, 16, 700, C.ink],
    ].forEach(([str, y, size, weight, fill], i) => {
      const n = typedNode(S.cause, CAUSE.x + 18, y, str, { size, weight, fill });
      fit(n, CAUSE.x + CAUSE.w - 14, `cause ligne ${i + 1}`);
      S.typed.push(n);
    });
    S.caret = el('rect', { x: 0, y: 0, width: 2.5, height: 21, rx: 1.2, fill: C.blue, opacity: 0 }, S.cause);
    S.ok = el('g', {}, S.cause);
    const okx = CAUSE.x + 18, oky = CAUSE.y + 186;
    const okr = el('rect', { x: okx, y: oky - 16, height: 32, rx: 16, fill: C.pGreen }, S.ok);
    checkDot(S.ok, okx + 18, oky, 10);
    const okt = text(S.ok, okx + 36, oky + 5.5, 'Ça marche', { size: 16, weight: 800, fill: C.tGreen });
    okr.setAttribute('width', okt.getBBox().width + 50);
    fit(okr, CAUSE.x + CAUSE.w - 14, 'ça marche');

    // Vendredi : la feuille de standard, écrite à la main
    S.sheet = el('g', {}, K);
    S.paper = el('rect', { x: SHEET.x, y: SHEET.y, width: SHEET.w, height: SHEET.h, rx: 5, fill: C.white, stroke: CARD_LINE, 'stroke-width': 1.5 }, S.sheet);
    el('line', { x1: 250, y1: SHEET.y, x2: 250, y2: SHEET.y + SHEET.h, stroke: MARGIN, 'stroke-width': 1.6 }, S.sheet);
    [HAND[0].y + 5, HAND[1].y + 5].forEach(y => el('line', { x1: 250, y1: y, x2: SHEET.x + SHEET.w - 14, y2: y, stroke: RULE, 'stroke-width': 1.6 }, S.sheet));
    S.shead = text(S.sheet, 268, SHEET.y + 24, 'STANDARD DU POSTE', { size: 13, weight: 800, fill: C.blue });
    S.shead.setAttribute('letter-spacing', 1.6);
    fit(S.shead, PIN.x - 20, 'en-tête standard', SHEET.x);
    HAND.forEach((h, i) => {
      const cp = el('clipPath', { id: `hand${i}` }, defs);
      const cr = el('rect', { x: h.x - 6, y: h.y - 26, width: 0, height: 36 }, cp);
      const g = el('g', { 'clip-path': `url(#hand${i})` }, S.sheet);
      const tx = text(el('g', { transform: `translate(${h.x} ${h.y}) skewX(-9)` }, g), 0, 0, h.str, { size: 20, weight: 500, fill: INK_PEN });
      const w = tx.getBBox().width;
      fit(tx, SHEET.w - 90, `standard ligne ${i + 1}`);   // dans le repère de la ligne : reste dans la feuille
      S.hands.push({ cr, w, x: h.x, y: h.y });
    });
    const tickX = HAND[1].x + S.hands[1].w + 16, tickY = HAND[1].y - 6;
    S.tick = el('path', { d: `M ${tickX} ${tickY} L ${tickX + 7} ${tickY + 8} L ${tickX + 22} ${tickY - 12}`, fill: 'none', stroke: C.green, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.sheet);
    drawable(S.tick, 40);
    // Punaise
    S.pin = el('g', {}, S.sheet);
    S.pinShadow = el('ellipse', { cx: 4, cy: 6, rx: 9, ry: 6, fill: C.ink, opacity: 0.18 }, S.pin);
    S.pinHead = el('g', {}, S.pin);
    el('circle', { cx: 0, cy: 0, r: 9.5, fill: C.red }, S.pinHead);
    el('circle', { cx: -3, cy: -3, r: 3, fill: C.white, opacity: 0.55 }, S.pinHead);
    // Stylo
    S.pen = el('g', {}, S.sheet);
    const pen = el('g', { transform: 'rotate(28)' }, S.pen);
    el('path', { d: 'M 0 0 L -4.5 -11 L 4.5 -11 Z', fill: C.ink }, pen);
    el('rect', { x: -5, y: -54, width: 10, height: 44, rx: 3, fill: C.blue }, pen);
    el('rect', { x: -5, y: -62, width: 10, height: 10, rx: 3, fill: C.ink }, pen);
    el('rect', { x: 3, y: -58, width: 3, height: 20, rx: 1.5, fill: C.lightBlue }, pen);

    // Ce qu'il n'y a pas : les traits rouges
    S.ghosts.forEach(({ strike }) => {
      const n = el('line', { x1: strike.x0, y1: GHOST_Y - 1, x2: strike.x1, y2: GHOST_Y - 3, stroke: C.red, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, K);
      drawable(n, strike.x1 - strike.x0 + 1);
      S.strikes.push(n);
    });

    // Jetons : la note qui part rejoindre son groupe
    NOTES.forEach(() => {
      const g = el('g', { opacity: 0 }, K);
      el('rect', { x: -15, y: -10, width: 30, height: 20, rx: 4, fill: C.pYellow, stroke: C.white, 'stroke-width': 2 }, g);
      el('path', { d: 'M -9 -3 H 9 M -9 3 H 3', stroke: MUTED, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
      S.tokens.push(g);
    });

    // La boucle : la grande flèche de vendredi à lundi, et son compteur
    S.arc = el('path', { d: ARC_D, fill: 'none', stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, K);
    S.arcLen = S.arc.getTotalLength();
    drawable(S.arc, S.arcLen);
    S.head = el('path', { d: 'M 891 563 L 874 576 L 891 589', fill: 'none', stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, K);
    S.rider = el('circle', { cx: 0, cy: 0, r: 8, fill: C.blue, stroke: C.white, 'stroke-width': 3 }, K);
    S.badge = el('g', {}, K);
    el('circle', { cx: BADGE.x, cy: BADGE.y, r: BADGE.r, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, S.badge);
    fit(text(S.badge, BADGE.x, BADGE.y - 9, 'boucle', { size: 13, weight: 700, fill: MUTED, anchor: 'middle' }), BADGE.x + BADGE.r - 5, 'compteur boucle', BADGE.x - BADGE.r + 5);
    const dg = el('g', { 'clip-path': 'url(#digit)' }, S.badge);
    S.digits = el('g', {}, dg);
    ['1', '2'].forEach((d, i) => fit(text(S.digits, BADGE.x, BADGE.y + 19 + 26 * i, d, { size: 25, weight: 800, fill: C.blue, anchor: 'middle' }), BADGE.x + 18, `chiffre ${d}`, BADGE.x - 18));

    // Pastilles d'étape
    const PILLS = [
      [`1${NB}·${NB}Lundi${NB}: trente minutes au poste`, C.blue, C.white],
      [`2${NB}·${NB}Dans la semaine${NB}: un seul problème`, C.blue, C.white],
      [`3${NB}·${NB}Vendredi${NB}: écrire ce qui a marché`, C.blue, C.white],
      ['Boucle 1 bouclée', C.pGreen, C.tGreen, true],
    ];
    S.pills = PILLS.map(([label, bg, fg, icon]) => {
      const g = pillShape(D.svg, 92, PILL_Y, label, { bg, fg, icon });
      fit(g, 900, `pastille ${label}`);
      return g;
    });

    D.encart(['Par où commencer', 'La White Belt gratuite', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  const show = (n, o) => n.setAttribute('opacity', f2(o));
  const pop = (n, cx, cy, p) => {
    const k = popScale(p);
    n.setAttribute('transform', k === 1 ? '' : about(cx, cy, `scale(${f2(k)})`));
    show(n, clamp(p / 0.4));
  };
  const slideIn = (n, p, dx = 0, dy = 8) => {
    const q = easeOut(p);
    n.setAttribute('transform', q >= 1 ? '' : `translate(${f2(dx * (1 - q))} ${f2(dy * (1 - q))})`);
    show(n, clamp(p / 0.6));
  };
  function cursorY(s) {
    let y = DAYS[0][1];
    for (const [t0, a, b, d] of CUR) if (s >= t0) y = lerp(DAYS[a][1], DAYS[b][1], b ? settle(prog(s, t0, d)) : easeInOut(prog(s, t0, d)));
    return y;
  }
  function sectorPath(m) {
    const a = m / 60 * 2 * Math.PI, R = 33, x = CLOCK.x + R * Math.sin(a), y = CLOCK.y - R * Math.cos(a);
    if (m <= 0.01) return '';
    return `M ${CLOCK.x} ${CLOCK.y} L ${CLOCK.x} ${CLOCK.y - R} A ${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${f2(x)} ${f2(y)} Z`;
  }
  function rimPath(m) {
    const a = m / 60 * 2 * Math.PI, R = CLOCK.r, x = CLOCK.x + R * Math.sin(a), y = CLOCK.y - R * Math.cos(a);
    if (m <= 0.01) return '';
    return `M ${CLOCK.x} ${CLOCK.y - R} A ${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${f2(x)} ${f2(y)}`;
  }

  function draw(t) {
    const final = t < T_OUT + OUT_DUR;                 // image finale (qui s'efface à partir de T_OUT)
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    const s = final ? DURATION : t;                     // temps de séquence (final = fin)
    show(S.content, fade);

    // Curseur du jour
    const cy = cursorY(s);
    S.cursor.setAttribute('transform', `translate(0 ${f2(cy)})`);
    S.curClip.setAttribute('y', f2(cy - CHIP_H / 2));

    // Lundi : la carte, la question, l'horloge
    const lc = easeOut(prog(s, T_LCARD, 0.32));
    S.lcard.setAttribute('transform', lc >= 1 ? '' : about(CX0, LUN.y, `scale(${f2(Math.max(lc, 0.001))} 1)`));
    show(S.lcard, clamp(lc * 3));
    const monday = !final && s >= T_LCARD && s < CUR[0][0] + 0.2;
    S.lcardBox.setAttribute('stroke', monday ? C.blue : CARD_LINE);
    S.lcardBox.setAttribute('stroke-width', monday ? 2.5 : 2);
    slideIn(S.lhead, prog(s, T_LHEAD, 0.3));
    pop(S.clock, CLOCK.x, CLOCK.y, prog(s, T_CLOCK - 0.1, 0.35));
    const m = 30 * prog(s, T_CLOCK + 0.15, CLOCK_DUR);
    S.sector.setAttribute('d', sectorPath(m));
    S.rim.setAttribute('d', rimPath(m));
    S.hand.setAttribute('transform', `rotate(${f2(m * 6)} ${CLOCK.x} ${CLOCK.y})`);
    S.minutes.textContent = `${Math.floor(m + 1e-6)}${NB}min`;
    show(S.minutes, prog(s, T_CLOCK, 0.25));

    // Les notes se collent une à une ; plus tard, chacune envoie son jeton
    S.notes.forEach((n, k) => {
      // la note se plaque sur place : elle descend vers le mur (échelle), se tasse, se cale
      const p = prog(s, T_NOTE[k], NOTE_DROP);
      if (p <= 0) { show(n.g, 0); n.g.removeAttribute('filter'); return; }
      const q = easeIn(p);
      const rot = ROT[k] + 2.5 * (1 - easeOut(p)) * (k % 2 ? -1 : 1);
      let sx = 1 + 0.06 * (1 - q), sy = sx;
      const u = s - T_NOTE[k] - NOTE_DROP;
      if (u >= 0 && u < 0.16) { const w = Math.sin(Math.PI * u / 0.16); sy = 1 - 0.1 * w; sx = 1 + 0.025 * w; }
      // petit soulèvement quand le jeton part
      const lp = prog(s, T_TOK[k], 0.24);
      const lk = lp > 0 && lp < 1 ? 1 + 0.04 * Math.sin(Math.PI * lp) : 1;
      n.g.setAttribute('transform', about(n.cx, n.cy, `rotate(${f2(rot)}) scale(${f2(sx * lk)} ${f2(sy * lk)})`));
      if (p < 1) n.g.setAttribute('filter', 'url(#lift)'); else n.g.removeAttribute('filter');
      show(n.g, clamp(p / 0.35));
      const dp = prog(s, T_TOK[k], 0.3);
      const kd = popScale(dp);
      n.dot.setAttribute('transform', kd === 1 ? '' : about(n.dx, n.cy, `scale(${f2(kd)})`));
      show(n.dot, clamp(dp / 0.4));
    });

    // Mardi → jeudi : la carte et le regroupement
    const mc = easeOut(prog(s, T_MCARD, 0.32));
    S.mcard.setAttribute('transform', mc >= 1 ? '' : about(CX0, MID.y, `scale(${f2(Math.max(mc, 0.001))} 1)`));
    show(S.mcard, clamp(mc * 3));
    const midweek = !final && s >= CUR[0][0] + 0.2 && s < CUR[3][0] + 0.2;
    S.mcardBox.setAttribute('stroke', midweek ? C.blue : CARD_LINE);
    S.mcardBox.setAttribute('stroke-width', midweek ? 2.5 : 2);
    slideIn(S.thead, prog(s, T_TALLY, 0.3));
    const dim = prog(s, T_RING, 0.3), undim = prog(s, T_ROW[1], 0.3);
    S.rows.forEach((r, i) => {
      const p = prog(s, T_TALLY + 0.07 * (i + 1), 0.3);
      const q = easeOut(p);
      r.g.setAttribute('transform', q >= 1 ? '' : `translate(0 ${f2(8 * (1 - q))})`);
      const o = i === 0 ? 1 : i === 1 ? 1 - 0.55 * dim * (1 - undim) : 1 - 0.55 * dim;
      show(r.g, clamp(p / 0.6) * o);
      // compteur : +1 à chaque bâtonnet, petit sursaut
      let n = 0, bump = 0;
      NOTES.forEach(([, g], k) => {
        if (g !== i) return;
        if (s >= landT(k)) n++;
        const b = prog(s, landT(k), 0.28);
        if (b > 0 && b < 1) bump = Math.sin(Math.PI * b);
      });
      r.count.textContent = String(n);
      r.count.setAttribute('transform', bump ? about(COUNT_X - 6, GY[i], `scale(${f2(1 + 0.3 * bump)})`) : '');
      r.count.setAttribute('fill', i === 0 && s >= T_RING ? C.blue : C.ink);
      // pastilles finales : 1 traité, 2 au tour suivant
      if (i < 2) {
        const bp = prog(s, T_ROW[i], 0.35);
        pop(r.badge, DOT_X, GY[i], bp);
        show(r.dot, 1 - clamp(bp / 0.3));
      }
    });
    // Jetons qui volent jusqu'à leur groupe, puis bâtonnets qui se tracent
    S.tokens.forEach((g, k) => {
      const p = prog(s, T_TOK[k], FLY);
      if (final || p <= 0 || p >= 1) { show(g, 0); g.removeAttribute('filter'); return; }
      const n = S.notes[k], mk = S.marks[k];
      const e = easeInOut(p);
      const x = lerp(n.dx, mk.x, e), y = lerp(n.cy, mk.y, e) - 16 * Math.sin(Math.PI * e) - 8 * Math.sin(Math.PI * clamp(p / 0.2)) * (p < 0.2 ? 1 : 0);
      const k0 = p < 0.85 ? 1.15 : lerp(1.15, 0.35, (p - 0.85) / 0.15);
      const rot = (k % 2 ? -14 : 12) * Math.sin(Math.PI * e);
      g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(k0)})`);
      g.setAttribute('filter', 'url(#lift)');
      show(g, clamp(p / 0.12) * (p < 0.9 ? 1 : 1 - (p - 0.9) / 0.1));
    });
    S.marks.forEach(({ m }, k) => drawTo(m, prog(s, landT(k) - 0.04, MARK)));

    // Mercredi : on entoure celle qui revient le plus
    drawTo(S.ring, easeInOut(prog(s, T_RING, RING_DUR)));
    S.crit.forEach((c, i) => pop(c.g, DOT_X, c.cy, prog(s, T_CRIT[i], 0.35)));

    // Jeudi : la cause, au poste, puis l'essai
    const cp = prog(s, T_CAUSE, 0.35);
    slideIn(S.cause, cp, 18, 0);
    const search = !final && s >= T_CAUSE && s < T_OK;
    const la = search ? (s - T_CAUSE) * Math.PI * 2 / 0.9 : 0;
    S.lens.setAttribute('transform', `translate(${f2(CAUSE.x + 24 + 3 * Math.sin(la))} ${f2(CAUSE.y + 25 + 2.5 * Math.cos(la * 1.3))})`);
    let caretOn = null;
    S.typed.forEach((n, i) => {
      const k = final ? n.full.length : Math.max(0, Math.min(n.full.length, Math.floor((s - T_TYPE[i]) * CPS)));
      n.textContent = n.full.slice(0, k);
      if (!final && s >= T_TYPE[i] - 0.08 && k < n.full.length) caretOn = n;
    });
    if (caretOn) {
      const b = caretOn.getBBox();
      S.caret.setAttribute('x', f2((caretOn.textContent ? b.x + b.width : Number(caretOn.getAttribute('x'))) + 2.5));
      S.caret.setAttribute('y', f2(Number(caretOn.getAttribute('y')) - 16));
      show(S.caret, 1);
    } else show(S.caret, 0);
    pop(S.ok, CAUSE.x + 70, CAUSE.y + 186, prog(s, T_OK, 0.35));

    // Vendredi : la feuille arrive, le stylo écrit, la punaise la fixe
    const sp = prog(s, T_SHEET, 0.38);
    const sq = easeOut(sp);
    const scx = SHEET.x + SHEET.w / 2, scy = SHEET.y + SHEET.h / 2;
    S.sheet.setAttribute('transform', `translate(${f2(24 * (1 - sq))} ${f2(46 * (1 - sq))}) ` + about(scx, scy, `rotate(${f2(lerp(-4.5, SHEET.rot, sq))})`));
    show(S.sheet, clamp(sp / 0.3));
    S.paper.setAttribute('filter', sp > 0 && sp < 1 ? 'url(#paperLift)' : 'url(#paper)');
    show(S.shead, prog(s, T_SHEAD, 0.3));
    S.hands.forEach((h, i) => h.cr.setAttribute('width', f2((h.w + 14) * prog(s, T_HAND[i], HAND_DUR[i]))));
    // Le stylo : il se pose, écrit la ligne 1, glisse à la ligne 2, l'écrit, va cocher, puis se relève
    const [h1, h2] = S.hands;
    const e1 = T_HAND[0] + HAND_DUR[0], e2 = T_HAND[1] + HAND_DUR[1];
    const tickX = h2.x + h2.w + 16, tickY = h2.y - 6;
    const wob = (h, p) => h.y - 5 + 2.5 * Math.sin(p * h.w / 8);
    let penX, penY, penLift = 0;
    if (s < T_HAND[0]) { const q = easeOut(prog(s, T_HAND[0] - 0.25, 0.25)); penX = h1.x + 2; penY = h1.y - 5; penLift = 1 - q; }
    else if (s < e1) { const p = prog(s, T_HAND[0], HAND_DUR[0]); penX = h1.x + h1.w * p + 2; penY = wob(h1, p); }
    else if (s < T_HAND[1]) {
      const q = easeInOut(prog(s, e1, T_HAND[1] - e1));
      penX = lerp(h1.x + h1.w + 2, h2.x + 2, q); penY = lerp(h1.y - 5, h2.y - 5, q); penLift = Math.sin(Math.PI * q);
    } else if (s < e2) { const p = prog(s, T_HAND[1], HAND_DUR[1]); penX = h2.x + h2.w * p + 2; penY = wob(h2, p); }
    else if (s < T_TICK) {
      const q = easeInOut(prog(s, e2, T_TICK - e2));
      penX = lerp(h2.x + h2.w + 2, tickX, q); penY = lerp(h2.y - 5, tickY, q); penLift = 0.6 * Math.sin(Math.PI * q);
    } else if (s < T_TICK + 0.16) { const P = S.tick.getPointAtLength(40 * prog(s, T_TICK, 0.16)); penX = P.x; penY = P.y; }
    else { const q = easeOut(prog(s, T_TICK + 0.16, 0.3)); penX = tickX + 22 + 18 * q; penY = tickY - 12 - 6 * q; penLift = q; }
    const pe = final ? 0 : prog(s, T_HAND[0] - 0.25, 0.18) * (1 - prog(s, T_TICK + 0.22, 0.2));
    S.pen.setAttribute('transform', `translate(${f2(penX + 6 * penLift)} ${f2(penY - 14 * penLift)})`);
    show(S.pen, pe);
    drawTo(S.tick, prog(s, T_TICK, 0.16));
    const pp = prog(s, T_PIN, 0.32);
    const pin = pp <= 0 ? 0 : pp >= 1 ? 1 : back(pp);
    S.pin.setAttribute('transform', `translate(${PIN.x} ${f2(PIN.y - 38 * (1 - easeIn(pp)))})`);
    S.pinHead.setAttribute('transform', `scale(${f2(1 + 0.4 * (1 - pin))})`);
    show(S.pin, clamp(pp / 0.25));
    show(S.pinShadow, 0.18 * clamp(pp / 0.6));

    // Ce qu'il n'y a pas : barré, un par un
    S.strikes.forEach((n, i) => drawTo(n, easeInOut(prog(s, T_STRIKE[i], STRIKE))));
    
    // La boucle : la flèche se trace de vendredi à lundi, le compteur passe à 2
    const ap = easeInOut(prog(s, T_ARC, ARC_DUR));
    drawTo(S.arc, ap);
    show(S.arc, ap > 0 ? 1 : 0);
    const hp = prog(s, T_ARC + ARC_DUR - 0.08, 0.3);
    const kh = hp <= 0 ? 0.001 : hp >= 1 ? 1 : back(hp);
    S.head.setAttribute('transform', kh === 1 ? '' : about(874, 576, `scale(${f2(kh)})`));
    show(S.head, clamp(hp / 0.3));
    if (!final && ap > 0 && ap < 1) {
      const P = S.arc.getPointAtLength(S.arcLen * ap);
      S.rider.setAttribute('cx', f2(P.x));
      S.rider.setAttribute('cy', f2(P.y));
      show(S.rider, 1);
    } else show(S.rider, 0);
    const bp = prog(s, T_BADGE_IN, 0.35);
    const roll = easeInOut(prog(s, T_ROLL, 0.35));
    const rb = Math.sin(Math.PI * prog(s, T_ROLL, 0.45));
    const kb = popScale(bp) * (1 + 0.12 * rb);
    S.badge.setAttribute('transform', kb === 1 ? '' : about(BADGE.x, BADGE.y, `scale(${f2(kb)})`));
    show(S.badge, clamp(bp / 0.4));
    S.digits.setAttribute('transform', roll ? `translate(0 ${f2(-26 * roll)})` : '');

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = T_P[i] + (i ? 0.12 : 0);
      let o, dy;
      if (i === S.pills.length - 1) { o = final ? fade : prog(t, a, 0.25); dy = final ? 0 : 8 * (1 - prog(t, a, 0.25)); }
      else { o = final ? 0 : prog(t, a, 0.25) * (1 - prog(t, T_P[i + 1], 0.14)); dy = 8 * (1 - prog(t, a, 0.25)); }
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
