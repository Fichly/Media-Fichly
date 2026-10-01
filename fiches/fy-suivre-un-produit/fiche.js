// Fiche LinkedIn · page Fichly · jeudi 8 octobre 2026 (Buffer 6abd1896f77cc9bc05186ab1)
// Post : « Vous voulez voir où se perd le temps dans votre atelier ? Une demi-heure et une feuille suffisent
// pour une première version. » Six étapes : choisir un produit, partir du point d'entrée, noter chaque étape
// (transformation, attente, transport, contrôle, stockage), estimer la durée, marquer ce qui transforme,
// additionner. « Le visuel récapitule la grille à reproduire, avec les cinq types d'étapes. »
// Premier commentaire (Buffer) : nos fiches Lean → encart.
// Le visuel EST la fiche : la feuille de relevé, remplie avec un exemple (inventé : un support acier, huit
// étapes, 20 min de transformation pour 6 j 1 h au total). Les pastilles ① à ⑥ des champs et des colonnes
// renvoient aux six étapes du post ; la légende des cinq types est en bas de la feuille.
// Style propre : la grille remplie au crayon. Un crayon bicolore (bleu / rouge) remplit la feuille colonne par
// colonne : l'écriture apparaît sous la mine, les types et les oui / non sont entourés à main levée, le profil
// se trace d'un symbole à l'autre, les durées sont cochées une à une pendant que les deux totaux roulent ;
// puis le crayon se retourne et entoure l'écart en rouge. Image t = 0 = état final. Boucle exacte de 13 s.
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
  const show = (n, on) => { if (on) n.removeAttribute('display'); else n.setAttribute('display', 'none'); };
  const NB = ' ';

  const MUTED = '#7b7ba6', HINT = '#9494b8', CARD_LINE = '#dcdcec', ROW_LINE = '#ebebf4', FAINT = '#cdcde0';
  const TINT = '#f1f1fa', BLANK = '#c6c6dc', WOOD = '#efd3a5';
  const PEN = C.blue, PEN_RED = C.tRed;

  // ---------- Mise en page (la feuille occupe tout le cadre) ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 745 };
  const XL = 92, XR = 988;
  const PILL_CY = 451;
  const FY = 510, HY = 538;                          // champs ① ② et leurs consignes
  const TY0 = 556, HEAD_H = 60, RH = 46, NROW = 8;
  const RY0 = TY0 + HEAD_H, TY1 = RY0 + RH * NROW;   // lignes de 616 à 984
  const COL_TYPE = [364, 636], COL_DUR = [636, 794], COL_TR = [794, 988];
  const TX = [390, 445, 500, 555, 610];              // les cinq symboles
  const DUR_X = 706, TICK_X = 758, OUI_X = 858, NON_X = 926;
  const rowCy = i => RY0 + RH * i + RH / 2;
  const TOT = { y0: 996, y1: 1088, a: [92, 380], c: [700, 988] };
  const GAP = { cx: 540, cy: 1033, rx: 104, ry: 26 };
  const LEG_Y = 1133;

  // ---------- Contenu : les cinq types et l'exemple (inventé, plausible) ----------
  const TYPES = [['Transformation', C.green], ['Attente', C.red], ['Transport', C.lightBlue], ['Contrôle', C.violet], ['Stockage', C.yellow]];
  const ROWS = [
    ['Déchargement au quai', 2, '10', 'min', 10],
    ['Stock matière', 4, '3', 'j', 4320],
    ['Chariot vers la découpe', 2, '10', 'min', 10],
    ['Découpe laser', 0, '12', 'min', 12],
    ['Attente avant pliage', 1, '1', 'j', 1440],
    ['Pliage', 0, '8', 'min', 8],
    ['Contrôle final', 3, '20', 'min', 20],
    ['Stock produits finis', 4, '2', 'j', 2880],
  ].map(([name, type, n, u, min], i) => ({ name, type, dur: `${n}${NB}${u}`, min, oui: type === 0, cy: rowCy(i) }));
  const TOTAL = ROWS.reduce((a, r) => a + r.min, 0);                  // 8 700 min = 6 j 1 h
  const TRANSFO = ROWS.reduce((a, r) => a + (r.oui ? r.min : 0), 0);  // 20 min
  const fmt = m => {
    m = Math.round(m);
    const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mn = m % 60;
    if (!d && !h) return `${mn}${NB}min`;
    if (!d) return `${h}${NB}h${NB}${String(mn).padStart(2, '0')}`;
    if (h) return `${d}${NB}j${NB}${h}${NB}h`;
    return mn ? `${d}${NB}j${NB}${mn}${NB}min` : `${d}${NB}j`;
  };

  // ---------- Chronologie (s) ----------
  const DURATION = 13, END = DURATION - 0.001;
  const T_OUT = 1.2, OUT_DUR = 0.25;                 // l'écriture s'efface, la feuille vierge reste
  const T_ENTER = 1.45, ENTER_DUR = 0.3;            // le crayon arrive
  const OFF = [1160, 1310];                          // hors champ, en bas à droite
  const EXIT_DUR = 0.32;
  let T_EXIT0, T_EXIT1, T_FINAL;
  const PILL_T = [];

  // ---------- Crayon bicolore (repère : mine bleue en 0, mine rouge en PL, axe +x) ----------
  const PL = 160, PEN_ANG = 32;

  // ---------- Petits éléments ----------
  const S = { bullets: [], tints: [] };
  let defs, clipN = 0;

  // Symboles des cinq types (≈ 22 px), centrés en (cx, cy)
  function symbol(parent, k, cx, cy, { fill = 'none', stroke = 'none', sw = 2, s = 1 } = {}) {
    const g = el('g', { transform: `translate(${cx} ${cy})` + (s !== 1 ? ` scale(${s})` : '') }, parent);
    const a = { fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'round' };
    if (k === 0) el('circle', { cx: 0, cy: 0, r: 10.5, ...a }, g);
    if (k === 1) el('path', { d: 'M -9 -10.5 H 0 A 10.5 10.5 0 0 1 0 10.5 H -9 Z', ...a }, g);
    if (k === 2) el('path', { d: 'M -11.5 -4.5 H 1 V -10.5 L 12 0 L 1 10.5 V 4.5 H -11.5 Z', ...a }, g);
    if (k === 3) el('rect', { x: -9.5, y: -9.5, width: 19, height: 19, rx: 2.5, ...a }, g);
    if (k === 4) el('path', { d: 'M -12 -9 H 12 L 0 11 Z', ...a }, g);
    return g;
  }
  // Pastille numérotée (renvoie à l'étape n du post)
  function bullet(parent, cx, cy, n) {
    const g = el('g', { transform: `translate(${f2(cx)} ${f2(cy)})` }, parent);
    const inner = el('g', {}, g);
    el('circle', { cx: 0, cy: 0, r: 11.5, fill: C.blue }, inner);
    text(inner, 0, 5.3, String(n), { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
    S.bullets.push({ inner, n });
  }
  function bulletLabel(parent, x, y, n, str, { size = 17, weight = 700, fill = C.ink, center = false } = {}) {
    const t = text(parent, 0, y, str, { size, weight, fill });
    const w = 31 + t.getBBox().width;
    const x0 = center ? x - w / 2 : x;
    t.setAttribute('x', f2(x0 + 31));
    bullet(parent, x0 + 11.5, y - size * 0.34, n);
    return { t, x0, x1: x0 + w };
  }
  // Écriture au crayon : le texte n'apparaît que jusqu'à la mine (clip qui avance)
  function handText(parent, x, y, str, { size = 19, weight = 500, fill = PEN, anchor = 'start', rot = 0 } = {}) {
    const id = `ecrit${clipN++}`;
    const cp = el('clipPath', { id }, defs);
    const r = el('rect', { x: 0, y: f2(y - size * 1.3), width: 0, height: f2(size * 1.8) }, cp);
    const g = el('g', { 'clip-path': `url(#${id})` }, parent);
    if (rot) g.setAttribute('transform', `rotate(${rot} ${x} ${y})`);
    const t = text(g, x, y, str, { size, weight, fill, anchor });
    const b = t.getBBox();
    r.setAttribute('x', f2(b.x - 3));
    return { g, t, r, x0: b.x, x1: b.x + b.width, w: b.width, y, size, n: str.length };
  }
  // Tracé à main levée (dessiné par stroke-dashoffset)
  function handPath(parent, d, { stroke = PEN, sw = 2.6 } = {}) {
    const n = el('path', { d, fill: 'none', stroke, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
    return { n, len: n.getTotalLength() };
  }
  function drawPath(item, p) {
    show(item.n, p > 0);
    if (p > 0 && p < 1) {
      item.n.setAttribute('stroke-dasharray', `${f2(item.len + 1)} ${f2(item.len + 1)}`);
      item.n.setAttribute('stroke-dashoffset', f2((item.len + 1) * (1 - p)));
    } else {                                         // tracé terminé : plus de pointillé
      item.n.removeAttribute('stroke-dasharray');
      item.n.removeAttribute('stroke-dashoffset');
    }
  }
  // Cercle à main levée : un peu plus d'un tour, sens trigonométrique, qui s'ouvre légèrement
  function loopD(cx, cy, rx, ry, seed = 0, turns = 1.12, grow = 0.07) {
    const pts = [], N = 56, a0 = -2.2 + 0.9 * Math.sin(seed * 1.7);
    for (let i = 0; i <= N; i++) {
      const u = i / N, a = a0 - u * turns * 2 * Math.PI;
      const k = 1 + 0.04 * Math.sin(2 * a + seed * 2.3) + grow * u;
      pts.push(`${f2(cx + 1.2 * u + rx * k * Math.cos(a))} ${f2(cy - 1.3 * u + ry * k * Math.sin(a))}`);
    }
    return `M ${pts.join(' L ')}`;
  }
  function pillShape(parent, x, cy, label, { bg, fg, icon = false, size = 20, h = 40 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 28 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon) {                                      // petit crayon
      const ic = el('g', { transform: `translate(${x + 31} ${cy}) rotate(-45)` }, g);
      el('rect', { x: -10, y: -3.6, width: 15, height: 7.2, rx: 1, fill: fg }, ic);
      el('path', { d: 'M 6.5 -3.6 L 12.5 0 L 6.5 3.6 Z', fill: fg }, ic);
      el('rect', { x: -13.5, y: -3.6, width: 2.4, height: 7.2, rx: 1, fill: fg }, ic);
    }
    return g;
  }
  const line = (y, parts) => {
    const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
    parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
    fit(t, 1020, `explication ${y}`);
  };

  // ---------- Actions du crayon (séquence) ----------
  const ACTS = [];
  const stepStart = {};
  let cur = T_ENTER;
  function seq(step, travel, a) {
    if (stepStart[step] === undefined) stepStart[step] = cur;
    a.step = step; a.t0 = cur + travel; a.t1 = a.t0 + a.dur; cur = a.t1;
    a.start = a.tip(0); a.end = a.tip(1);
    ACTS.push(a);
    return a;
  }
  const textAct = (item, cps, red = false) => ({
    item, red, dur: Math.max(0.12, item.n / cps),
    tip: p => [lerp(item.x0, item.x1, p), item.y - item.size * 0.3 + item.size * 0.2 * Math.sin(p * item.n * Math.PI * 1.6)],
    apply: p => {
      show(item.g, p > 0);
      item.r.setAttribute('width', f2(p >= 1 ? item.w + 8 : Math.max(0, (item.x1 - item.x0) * p + 3)));
    },
  });
  const pathAct = (item, dur, red = false) => ({
    item, red, dur,
    tip: p => { const q = item.n.getPointAtLength(item.len * p); return [q.x, q.y]; },
    apply: p => drawPath(item, p),
  });

  function build() {
    D.template({ author: null });
    D.title('Suivre un produit,', 'du début à la fin.', 1020);
    D.chapeau('Une demi-heure et une feuille suffisent pour une première version.');

    // Explication courte au-dessus du visuel : comment lire la grille
    line(352, [['Une ligne par étape', C.blue], [`${NB}: son type, sa durée, et si elle `, 0], ['transforme le produit', C.tGreen], ['.', 0]]);
    line(384, [['Additionnez', C.blue], [`${NB}: `, 0], ['l’écart', C.tRed], [' entre les deux totaux est votre ', 0], ['premier chantier', C.tRed], ['.', 0]]);

    defs = el('defs');
    const sh = el('filter', { id: 'sheet', x: '-5%', y: '-5%', width: '110%', height: '112%' }, defs);
    el('feDropShadow', { dx: 0, dy: 6, stdDeviation: 9, 'flood-color': C.ink, 'flood-opacity': 0.07 }, sh);
    const blur = el('filter', { id: 'penBlur', x: '-30%', y: '-200%', width: '160%', height: '500%' }, defs);
    el('feGaussianBlur', { stdDeviation: 3.2 }, blur);
    const cpT = el('clipPath', { id: 'table' }, defs);
    el('rect', { x: XL, y: TY0, width: XR - XL, height: TY1 - TY0, rx: 12 }, cpT);

    // ----- La feuille -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: C.white, stroke: C.line, 'stroke-width': 2, filter: 'url(#sheet)' });
    el('rect', { x: XL, y: TY0, width: XR - XL, height: HEAD_H, fill: C.pLav, 'clip-path': 'url(#table)' });

    // Teintes de la colonne en cours (pendant l'animation seulement)
    const tint = (x0, x1) => { const n = el('rect', { x: x0, y: RY0, width: x1 - x0, height: TY1 - RY0, fill: TINT, display: 'none' }); return n; };
    S.tName = tint(XL, COL_TYPE[0]); S.tType = tint(...COL_TYPE); S.tDur = tint(...COL_DUR); S.tTr = tint(...COL_TR);
    S.handUnder = el('g');                           // fonds posés par le crayon (lignes vertes, repères des durées)

    // Grille imprimée
    for (let i = 1; i < NROW; i++) el('line', { x1: XL, y1: RY0 + RH * i, x2: XR, y2: RY0 + RH * i, stroke: ROW_LINE, 'stroke-width': 1.5 });
    el('line', { x1: XL, y1: RY0, x2: XR, y2: RY0, stroke: CARD_LINE, 'stroke-width': 2 });
    [COL_TYPE[0], COL_DUR[0], COL_TR[0]].forEach(x => el('line', { x1: x, y1: TY0, x2: x, y2: TY1, stroke: CARD_LINE, 'stroke-width': 2 }));
    el('rect', { x: XL, y: TY0, width: XR - XL, height: TY1 - TY0, rx: 12, fill: 'none', stroke: CARD_LINE, 'stroke-width': 2 });

    // En-tête de la feuille : à deux
    fit(text(D.svg, XR, PILL_CY + 6, `À deux${NB}: l’un suit le produit, l’autre note`, { size: 16, weight: 500, fill: MUTED, anchor: 'end' }), XR, 'à deux', 640);

    // Champs ① et ②, avec leurs blancs pointillés et la consigne du post
    const f1 = bulletLabel(D.svg, XL, FY, 1, `Produit${NB}:`, { size: 17, weight: 500, fill: MUTED });
    const v1 = f1.x1 + 10;
    el('line', { x1: v1 - 2, y1: FY + 9, x2: 520, y2: FY + 9, stroke: BLANK, 'stroke-width': 2, 'stroke-dasharray': '1.5 5', 'stroke-linecap': 'round' });
    fit(text(D.svg, XL + 31, HY, 'une référence courante, pas un cas exceptionnel', { size: 15, weight: 500, fill: MUTED }), 548, 'consigne produit');
    const F2X = 560;
    const f2b = bulletLabel(D.svg, F2X, FY, 2, `Point d’entrée${NB}:`, { size: 17, weight: 500, fill: MUTED });
    const v2 = f2b.x1 + 10;
    el('line', { x1: v2 - 2, y1: FY + 9, x2: XR, y2: FY + 9, stroke: BLANK, 'stroke-width': 2, 'stroke-dasharray': '1.5 5', 'stroke-linecap': 'round' });
    fit(text(D.svg, F2X + 31, HY, 'réception, magasin ou premier poste', { size: 15, weight: 500, fill: MUTED }), XR, 'consigne entrée');

    // En-têtes des colonnes ③ ④ ⑤
    const H1 = TY0 + 25, H2 = TY0 + 49;
    const hE = bulletLabel(D.svg, XL + 2, H1, 3, 'Étape');
    fit(text(D.svg, hE.x0 + 31, H2, 'une ligne par étape', { size: 15, weight: 500, fill: MUTED }), COL_TYPE[0] - 6, 'consigne étape');
    const hT = bulletLabel(D.svg, (COL_TYPE[0] + COL_TYPE[1]) / 2, H1, 3, 'Type d’étape', { center: true });
    fit(hT.t, COL_TYPE[1] - 6, 'en-tête type', COL_TYPE[0] + 6);
    TX.forEach((x, k) => symbol(D.svg, k, x, H2 - 5, { fill: TYPES[k][1], s: 0.82 }));
    const hD = bulletLabel(D.svg, (COL_DUR[0] + COL_DUR[1]) / 2, H1, 4, 'Durée', { center: true });
    fit(hD.t, COL_DUR[1] - 6, 'en-tête durée', COL_DUR[0] + 6);
    fit(text(D.svg, (COL_DUR[0] + COL_DUR[1]) / 2, H2, 'ordre de grandeur', { size: 15, weight: 500, fill: MUTED, anchor: 'middle' }), COL_DUR[1] - 4, 'consigne durée', COL_DUR[0] + 4);
    const hR = bulletLabel(D.svg, (COL_TR[0] + COL_TR[1]) / 2, H1, 5, 'Transforme ?'.replace(' ', NB), { center: true });
    fit(hR.t, COL_TR[1] - 6, 'en-tête transforme', COL_TR[0] + 6);
    fit(text(D.svg, (COL_TR[0] + COL_TR[1]) / 2, H2, `le reste${NB}: à questionner`, { size: 15, weight: 500, fill: MUTED, anchor: 'middle' }), COL_TR[1] - 4, 'consigne transforme', COL_TR[0] + 4);

    // Lignes imprimées : numéro, cinq symboles en filigrane, « oui » et « non »
    ROWS.forEach((r, i) => {
      text(D.svg, 106, r.cy + 5.5, String(i + 1), { size: 15, weight: 700, fill: HINT, anchor: 'middle' });
      TX.forEach((x, k) => symbol(D.svg, k, x, r.cy, { stroke: FAINT, sw: 2 }));
      text(D.svg, OUI_X, r.cy + 5.5, 'oui', { size: 16, weight: 500, fill: HINT, anchor: 'middle' });
      text(D.svg, NON_X, r.cy + 5.5, 'non', { size: 16, weight: 500, fill: HINT, anchor: 'middle' });
    });

    // Totaux ⑥ et écart (imprimés)
    el('rect', { x: TOT.a[0], y: TOT.y0, width: TOT.a[1] - TOT.a[0], height: TOT.y1 - TOT.y0, rx: 14, fill: C.pGreen });
    el('rect', { x: TOT.c[0], y: TOT.y0, width: TOT.c[1] - TOT.c[0], height: TOT.y1 - TOT.y0, rx: 14, fill: C.pLav });
    const lA = bulletLabel(D.svg, TOT.a[0] + 16, TOT.y0 + 31, 6, 'Temps de transformation', { size: 16, fill: C.tGreen });
    fit(lA.t, TOT.a[1] - 10, 'total transformation');
    bulletLabel(D.svg, TOT.c[0] + 16, TOT.y0 + 31, 6, 'Temps total', { size: 16, fill: C.ink });
    fit(text(D.svg, GAP.cx, TOT.y1 - 5, `l’écart${NB}: votre premier chantier`, { size: 16, weight: 700, fill: C.tRed, anchor: 'middle' }), TOT.c[0] - 6, 'légende écart', TOT.a[1] + 6);

    // Légende des cinq types
    const pre = text(D.svg, 0, LEG_Y, `Les 5 types d’étapes${NB}:`, { size: 16, weight: 700, fill: MUTED });
    const items = TYPES.map(([name]) => text(D.svg, 0, LEG_Y, name, { size: 17, weight: 500, fill: C.ink }));
    const wPre = pre.getBBox().width, ws = items.map(n => n.getBBox().width);
    const SYM = 30, GI = 22;
    const lw = wPre + 18 + ws.reduce((a, w) => a + SYM + w, 0) + GI * 4;
    let lx = 540 - lw / 2;
    pre.setAttribute('x', f2(lx));
    fit(pre, XR, 'légende titre', XL);
    lx += wPre + 18;
    items.forEach((n, k) => {
      symbol(D.svg, k, lx + 11, LEG_Y - 6, { fill: TYPES[k][1], s: 0.86 });
      n.setAttribute('x', f2(lx + SYM));
      fit(n, XR, `légende ${TYPES[k][0]}`, XL);
      lx += SYM + ws[k] + GI;
    });

    // ----- Ce qu'écrit le crayon -----
    S.hand = el('g');
    S.prodW = handText(S.hand, v1, FY, 'Support acier S-120', { size: 20, rot: -0.5 });
    fit(S.prodW.t, 548, 'produit');
    S.entryW = handText(S.hand, v2, FY, 'Réception', { size: 20, rot: 0.4 });
    fit(S.entryW.t, XR, 'point d’entrée');
    const ROT = [-0.6, 0.4, -0.3, 0.5, -0.5, 0.3, -0.4, 0.6];
    ROWS.forEach((r, i) => {
      r.nameW = handText(S.hand, 124, r.cy + 6.5, r.name, { size: 19, rot: ROT[i] });
      fit(r.nameW.t, COL_TYPE[0] - 8, `étape ${i + 1}`);
      r.fill = symbol(S.hand, r.type, TX[r.type], r.cy, { fill: TYPES[r.type][1] });
      r.loop = handPath(S.hand, loopD(TX[r.type], r.cy, 19, 16, i * 1.37 + 0.3));
      if (i) {                                       // profil : d'un symbole entouré au suivant
        const a = [TX[ROWS[i - 1].type], ROWS[i - 1].cy], b = [TX[r.type], r.cy];
        const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
        const rad = 1 / Math.hypot(ux / 22, uy / 19.5);
        const s0 = [a[0] + ux * rad, a[1] + uy * rad], s1 = [b[0] - ux * rad, b[1] - uy * rad];
        const m = [(s0[0] + s1[0]) / 2 - uy * 2.5, (s0[1] + s1[1]) / 2 + ux * 2.5];
        r.line = handPath(S.hand, `M ${f2(s0[0])} ${f2(s0[1])} Q ${f2(m[0])} ${f2(m[1])} ${f2(s1[0])} ${f2(s1[1])}`, { sw: 2.2 });
      }
      r.durW = handText(S.hand, DUR_X, r.cy + 6.5, r.dur, { size: 19, anchor: 'middle', rot: -ROT[i] });
      fit(r.durW.t, TICK_X - 6, `durée ${i + 1}`, COL_DUR[0] + 6);
      r.trLoop = handPath(S.hand, loopD(r.oui ? OUI_X : NON_X, r.cy, 25, 14.5, i * 0.91 + 0.5));
      if (r.oui) {
        r.ouiG = text(S.hand, OUI_X, r.cy + 5.5, 'oui', { size: 16, weight: 700, fill: C.tGreen, anchor: 'middle' });
        r.wash = el('rect', { x: XL, y: r.cy - RH / 2 + 1, width: XR - XL, height: RH - 2, fill: C.pGreen }, S.handUnder);
      }
      r.flash = el('rect', { x: DUR_X - 46, y: r.cy - 16, width: 92, height: 32, rx: 16, fill: r.oui ? '#cfe8c2' : '#dedff2' }, S.handUnder);
      const j = (i % 3) - 1;
      r.tick = handPath(S.hand, `M ${TICK_X} ${r.cy - 1 + j} L ${TICK_X + 5} ${r.cy + 5} L ${TICK_X + 16} ${r.cy - 8 - j}`, { sw: 2.4 });
    });

    // Totaux qui roulent, et l'écart au crayon rouge
    S.cA = text(S.hand, TOT.a[0] + 18, TOT.y1 - 16, fmt(TRANSFO), { size: 30, weight: 800, fill: C.tGreen });
    S.cC = text(S.hand, TOT.c[0] + 18, TOT.y1 - 16, fmt(TOTAL), { size: 30, weight: 800, fill: C.ink });
    fit(S.cA, TOT.a[1] - 10, 'valeur transformation');
    fit(S.cC, TOT.c[1] - 10, 'valeur total');
    S.gapW = handText(S.hand, GAP.cx, GAP.cy + 10, fmt(TOTAL - TRANSFO), { size: 28, weight: 800, fill: PEN_RED, anchor: 'middle' });
    fit(S.gapW.t, GAP.cx + GAP.rx - 8, 'écart', GAP.cx - GAP.rx + 8);
    S.gapLoop = handPath(S.hand, loopD(GAP.cx, GAP.cy, GAP.rx, GAP.ry, 0.4, 1.08, 0.035), { stroke: C.red, sw: 3.2 });
    const ay = GAP.cy + 1, axL = GAP.cx - GAP.rx - 16, axR = GAP.cx + GAP.rx + 16, eL = TOT.a[1] + 10, eR = TOT.c[0] - 10;
    S.arrL = handPath(S.hand, `M ${axL} ${ay} Q ${(axL + eL) / 2} ${ay - 3} ${eL} ${ay} M ${eL + 10} ${ay - 8} L ${eL} ${ay} L ${eL + 10} ${ay + 8}`, { stroke: C.red, sw: 3 });
    S.arrR = handPath(S.hand, `M ${axR} ${ay} Q ${(axR + eR) / 2} ${ay - 3} ${eR} ${ay} M ${eR - 10} ${ay - 8} L ${eR} ${ay} L ${eR - 10} ${ay + 8}`, { stroke: C.red, sw: 3 });

    // ----- Séquence du crayon : une colonne par étape du post -----
    seq(1, ENTER_DUR, textAct(S.prodW, 50));
    seq(2, 0.18, textAct(S.entryW, 50));
    ROWS.forEach((r, i) => { r.nameA = seq(3, i ? 0.07 : 0.2, textAct(r.nameW, 80)); });
    ROWS.forEach((r, i) => {
      if (i) seq(3, 0.02, pathAct(r.line, 0.05));
      r.loopA = seq(3, i ? 0.02 : 0.14, pathAct(r.loop, 0.14));
    });
    ROWS.forEach((r, i) => { r.durA = seq(4, i ? 0.055 : 0.14, textAct(r.durW, 48)); });
    ROWS.forEach((r, i) => { r.trA = seq(5, i ? 0.05 : 0.12, pathAct(r.trLoop, 0.1)); });
    ROWS.forEach((r, i) => { r.tickA = seq(6, i ? 0.045 : 0.1, pathAct(r.tick, 0.07)); });
    S.gapA = seq(6, 0.42, textAct(S.gapW, 30, true));          // le crayon se retourne pendant le trajet
    S.gapLoopA = seq(6, 0.05, pathAct(S.gapLoop, 0.36, true));
    T_EXIT0 = cur; T_EXIT1 = cur + EXIT_DUR; T_FINAL = cur + 0.12;
    console.log(`Sortie du crayon : ${T_EXIT1.toFixed(2)} s, pastille finale : ${(T_FINAL + 0.37).toFixed(2)} s`);
    if (T_EXIT1 > DURATION - 0.75) console.error(`Chronologie trop longue : sortie du crayon à ${T_EXIT1.toFixed(2)} s`);
    PILL_T.push(T_ENTER + 0.05, stepStart[2], stepStart[3], stepStart[4], stepStart[5], stepStart[6], T_FINAL);

    // Teintes : fenêtres [début, fin]
    const win = (acts) => [acts[0].t0 - 0.12, acts[acts.length - 1].t1 + 0.08];
    S.tints = [
      { n: S.tName, wins: [win(ROWS.map(r => r.nameA))] },
      { n: S.tType, wins: [win(ROWS.map(r => r.loopA))] },
      { n: S.tDur, wins: [win(ROWS.map(r => r.durA)), win(ROWS.map(r => r.tickA))] },
      { n: S.tTr, wins: [win(ROWS.map(r => r.trA))] },
    ];

    // ----- Pastilles d'étape -----
    const PILLS = [
      `1${NB}·${NB}Choisissez un produit`,
      `2${NB}·${NB}Partez du point d’entrée`,
      `3${NB}·${NB}Notez chaque étape et son type`,
      `4${NB}·${NB}Estimez la durée`,
      `5${NB}·${NB}Marquez ce qui transforme`,
      `6${NB}·${NB}Additionnez`,
    ];
    S.pills = PILLS.map(l => pillShape(D.svg, XL, PILL_CY, l, { bg: C.blue, fg: C.white }));
    S.pills.push(pillShape(D.svg, XL, PILL_CY, 'La grille à reproduire', { bg: C.blue, fg: C.white, icon: true }));
    S.pills.forEach((p, i) => fit(p, 600, `pastille ${i + 1}`));

    // ----- Le crayon et son ombre -----
    S.penSh = el('g', { filter: 'url(#penBlur)' });
    el('path', { d: `M 0 0 L 27 -8 L ${PL - 27} -8 L ${PL} 0 L ${PL - 27} 8 L 27 8 Z`, fill: C.ink }, S.penSh);
    S.pen = el('g');
    el('rect', { x: 27, y: -8, width: 53, height: 16, fill: C.blue }, S.pen);
    el('rect', { x: 27, y: -8, width: 53, height: 4.6, fill: '#6e6ec6' }, S.pen);
    el('rect', { x: 27, y: 3.4, width: 53, height: 4.6, fill: '#3a3a84' }, S.pen);
    el('rect', { x: 80, y: -8, width: PL - 107, height: 16, fill: C.red }, S.pen);
    el('rect', { x: 80, y: -8, width: PL - 107, height: 4.6, fill: '#f79c9c' }, S.pen);
    el('rect', { x: 80, y: 3.4, width: PL - 107, height: 4.6, fill: '#d25252' }, S.pen);
    el('path', { d: 'M 9 -2.8 L 27 -8 L 27 8 L 9 2.8 Z', fill: WOOD }, S.pen);
    el('path', { d: 'M 26 -8 Q 32 -5.33 26 -2.67 Q 32 0 26 2.67 Q 32 5.33 26 8 Z', fill: WOOD }, S.pen);
    el('path', { d: 'M 0 0 L 9 -2.8 L 9 2.8 Z', fill: C.blue }, S.pen);
    el('path', { d: `M ${PL - 9} -2.8 L ${PL - 27} -8 L ${PL - 27} 8 L ${PL - 9} 2.8 Z`, fill: WOOD }, S.pen);
    el('path', { d: `M ${PL - 26} -8 Q ${PL - 32} -5.33 ${PL - 26} -2.67 Q ${PL - 32} 0 ${PL - 26} 2.67 Q ${PL - 32} 5.33 ${PL - 26} 8 Z`, fill: WOOD }, S.pen);
    el('path', { d: `M ${PL} 0 L ${PL - 9} -2.8 L ${PL - 9} 2.8 Z`, fill: C.tRed }, S.pen);
    el('line', { x1: 80, y1: -8, x2: 80, y2: 8, stroke: C.white, 'stroke-width': 1.5, opacity: 0.6 }, S.pen);

    D.encart(['Aller plus loin', 'Nos fiches Lean', '(lien en commentaire)']);
  }

  // ---------- Position du crayon à l'instant s ----------
  function pencilState(s) {
    if (s < T_ENTER || s >= T_EXIT1) return null;
    let prev = null, next = null;
    for (const a of ACTS) {
      if (s >= a.t0 && s <= a.t1) return { p: a.tip(prog(s, a.t0, a.dur)), lift: 0, flip: a.red ? 1 : 0 };
      if (a.t0 > s) { next = a; break; }
      prev = a;
    }
    const from = prev ? { t: prev.t1, pt: prev.end, red: prev.red } : { t: T_ENTER, pt: OFF, red: false };
    const to = next ? { t: next.t0, pt: next.start, red: next.red } : { t: T_EXIT1, pt: OFF, red: from.red };
    const q = clamp((s - from.t) / (to.t - from.t));
    const e = easeInOut(q);
    const dist = Math.hypot(to.pt[0] - from.pt[0], to.pt[1] - from.pt[1]);
    const lift = clamp(4 + dist * 0.05, 4, 26) * Math.sin(Math.PI * q);
    const flip = to.red && !from.red ? easeInOut(prog(q, 0.12, 0.76)) : from.red ? 1 : 0;
    return { p: [lerp(from.pt[0], to.pt[0], e), lerp(from.pt[1], to.pt[1], e) - lift * 0.4], lift, flip };
  }
  function drawPencil(st) {
    show(S.pen, !!st); show(S.penSh, !!st);
    if (!st) return;
    const [x, y] = st.p;
    const k = 1 + 0.07 * st.lift / 26;
    let sx = Math.cos(Math.PI * st.flip);
    if (Math.abs(sx) < 0.03) sx = sx < 0 ? -0.03 : 0.03;
    const tail = ` rotate(${PEN_ANG}) scale(${k.toFixed(3)}) translate(${PL / 2} 0) scale(${sx.toFixed(3)} 1) translate(${-PL / 2} 0)`;
    S.pen.setAttribute('transform', `translate(${f2(x)} ${f2(y)})` + tail);
    S.penSh.setAttribute('transform', `translate(${f2(x + 2 + st.lift * 0.55)} ${f2(y + 4 + st.lift * 0.95)})` + tail);
    S.penSh.setAttribute('opacity', f2(0.2 - st.lift * 0.0035));
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_OUT + OUT_DUR;
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    S.hand.setAttribute('opacity', f2(fade));
    S.handUnder.setAttribute('opacity', f2(fade));

    // Tout ce que trace le crayon
    ACTS.forEach(a => a.apply(final ? 1 : prog(t, a.t0, a.dur)));

    ROWS.forEach(r => {
      // Le symbole entouré se remplit de sa couleur
      const pf = final ? 1 : prog(t, r.loopA.t0 + r.loopA.dur * 0.55, 0.24);
      show(r.fill, pf > 0);
      const k = popScale(pf);
      r.fill.setAttribute('transform', `translate(${TX[r.type]} ${r.cy})` + (k !== 1 ? ` scale(${f2(k)})` : ''));
      // « oui » : le mot passe en vert, la ligne se teinte
      if (r.oui) {
        const po = final ? 1 : prog(t, r.trA.t0 + r.trA.dur * 0.4, 0.15);
        show(r.ouiG, po > 0);
        r.ouiG.setAttribute('opacity', f2(po));
        const pw = final ? 1 : easeOut(prog(t, r.trA.t0 + r.trA.dur * 0.5, 0.4));
        show(r.wash, pw > 0);
        r.wash.setAttribute('width', f2((XR - XL) * pw));
      }
      // Repère sous la durée cochée
      const pk = final ? 0 : Math.sin(Math.PI * prog(t, r.tickA.t0 - 0.04, 0.42));
      show(r.flash, pk > 0.002);
      r.flash.setAttribute('opacity', f2(pk));
    });

    // Totaux : roulent à chaque coche
    const p0 = final ? 1 : prog(t, ROWS[0].tickA.t0 - 0.2, 0.15);
    show(S.cA, p0 > 0); show(S.cC, p0 > 0);
    S.cA.setAttribute('opacity', f2(p0)); S.cC.setAttribute('opacity', f2(p0));
    let vA = 0, vC = 0, bA = 0, bC = 0;
    ROWS.forEach(r => {
      const q = final ? 1 : easeOut(prog(t, r.tickA.t1 - 0.02, 0.3));
      const bump = final ? 0 : Math.sin(Math.PI * prog(t, r.tickA.t1 - 0.02, 0.3));
      vC += r.min * q; bC = Math.max(bC, bump);
      if (r.oui) { vA += r.min * q; bA = Math.max(bA, bump); }
    });
    S.cA.textContent = fmt(vA); S.cC.textContent = fmt(vC);
    [[S.cA, bA, TOT.a[0] + 18], [S.cC, bC, TOT.c[0] + 18]].forEach(([n, b, x]) => {
      const kb = 1 + 0.07 * b, y = TOT.y1 - 16;
      n.setAttribute('transform', b > 0.002 ? `translate(${x} ${y}) scale(${kb.toFixed(3)}) translate(${-x} ${-y})` : '');
    });

    // Flèches de l'écart, après le cercle rouge
    const pa = final ? 1 : easeInOut(prog(t, S.gapLoopA.t1 - 0.05, 0.3));
    drawPath(S.arrL, pa); drawPath(S.arrR, pa);

    // Teinte de la colonne en cours
    S.tints.forEach(({ n, wins }) => {
      let o = 0;
      if (!final) wins.forEach(([a, b]) => { o = Math.max(o, prog(t, a, 0.2) * (1 - prog(t, b, 0.2))); });
      show(n, o > 0.002);
      n.setAttribute('opacity', f2(o));
    });

    // Pastilles ① à ⑥ de la feuille : battent quand leur étape commence
    S.bullets.forEach(b => {
      const k = final ? 1 : 1 + 0.3 * Math.sin(Math.PI * prog(t, stepStart[b.n] + 0.08, 0.45));
      b.inner.setAttribute('transform', Math.abs(k - 1) > 0.002 ? `scale(${k.toFixed(3)})` : '');
    });

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const last = i === S.pills.length - 1;
      const a = PILL_T[i] + (i ? 0.12 : 0);
      const b = last ? Infinity : PILL_T[i + 1];
      let o, dy;
      if (final) { o = last ? fade : 0; dy = 0; }
      else { o = prog(t, a, 0.25) * (1 - prog(t, b, 0.14)); dy = 8 * (1 - prog(t, a, 0.25)); }
      show(g, o > 0.002);
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy > 0.01 ? `translate(0 ${f2(dy)})` : '');
    });

    drawPencil(final ? null : pencilState(t));
  }

  D.start({ duration: DURATION, build, draw });
})();
