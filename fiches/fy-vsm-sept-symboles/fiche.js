// Fiche LinkedIn · page Fichly · lundi 12 octobre 2026 (Buffer 6abe5cbbecb687b12492d666)
// Post : « Une VSM fait souvent peur à cause de ses symboles. Il en existe des dizaines.
// Pour une première cartographie, sept suffisent. » … « La fiche rassemble ces sept symboles sur une page,
// avec un exemple de carte simple. »
// Premier commentaire du post (Buffer) : article sur la Value Stream Mapping → encart.
// Le visuel EST la fiche : en haut, la légende des sept symboles ; en dessous, une carte simple qui les emploie.
// Style propre : la carte qui s'assemble depuis la légende. Chaque symbole se détache de sa case, vole en arc
// au-dessus du papier (il grandit, son ombre s'écarte), puis se pose à sa place (contour fantôme en pointillés)
// en se tassant. On part du client, à droite ; les données des boîtes se tapent, les flèches d'information se
// tracent, puis la ligne de temps se dessine en créneaux et fait rouler le délai total contre le temps de
// transformation. Image t = 0 = la fiche complète. Boucle exacte de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit, measure, noOverlap } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  const show = (n, on) => { if (on) n.removeAttribute('display'); else n.setAttribute('display', 'none'); };
  const NB = ' ';

  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', SKEL = '#e1e1ee', GHOST = '#b6b6d4', ACTIVE_BG = '#f4f4fb';
  const SW = 2.5;
  const NS = { 'vector-effect': 'non-scaling-stroke' };

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 744 };
  const MAP = { x: 80, y: 668, w: 920, h: 472 };
  const COL = [{ x: 80, w: 408 }, { x: 500, w: 500 }];
  const ROW_Y = [426, 484, 542, 600], ROW_H = 52;
  const CELLS = [
    { name: 'Client et fournisseur', desc: 'les deux bouts du flux', c: 0, r: 0 },
    { name: 'Processus', desc: 'une boîte par étape, avec ses données', c: 1, r: 0 },
    { name: 'Stock', desc: 'quantité ou nombre de jours', c: 0, r: 1 },
    { name: 'Flux poussé', desc: 'produit sans demande du suivant', c: 1, r: 1 },
    { name: 'Transport', desc: 'livraisons et fréquence', c: 0, r: 2 },
    { name: 'Flux d’information', desc: `droit${NB}: manuel · éclair${NB}: électronique`, c: 1, r: 2 },
    { name: 'Ligne de temps', desc: `en bas de la carte${NB}: les attentes en haut, les temps de transformation en bas`, c: 0, r: 3, full: true },
  ];
  // Rangées de la carte
  const TOP_Y = 766;                  // fournisseur, planning, client
  const TRUCK_Y = 826;
  const TRI_Y = 888, QTY_Y = 926, PUSH_Y = 950;
  const PROC_Y = 922;                 // centre des boîtes (868 → 976)
  const YH = 1010, YL = 1046;         // ligne de temps : attente en haut, transformation en bas
  const TOT_Y = 1112;
  const PX = [288, 540, 792];         // centres des processus (largeur 182)
  const SUP_X = 150, CLI_X = 930;

  // ---------- Données de l'exemple (inventées, cohérentes : 400 pièces par jour) ----------
  const PROCS = [
    ['Découpe', [['Cycle', `40${NB}s`], ['Changement', `30${NB}min`], ['Opérateurs', '1']]],
    ['Soudure', [['Cycle', `55${NB}s`], ['Changement', `15${NB}min`], ['Opérateurs', '2']]],
    ['Assemblage', [['Cycle', `50${NB}s`], ['Changement', `5${NB}min`], ['Opérateurs', '2']]],
  ];
  const STOCKS = [[SUP_X, `1${NB}600${NB}p.`], [414, `600${NB}p.`], [666, `800${NB}p.`], [CLI_X, `1${NB}200${NB}p.`]];
  // Ligne de temps : [x0, x1, haut ?, valeur, libellé]
  const TL = [
    [104, 197, 1, 4, `4${NB}j`], [197, 379, 0, 40, `40${NB}s`], [379, 449, 1, 1.5, `1,5${NB}j`], [449, 631, 0, 55, `55${NB}s`],
    [631, 701, 1, 2, `2${NB}j`], [701, 883, 0, 50, `50${NB}s`], [883, 976, 1, 3, `3${NB}j`],
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION;
  const T_OUT = 1.2, OUT = 0.3;
  const STEP_T = [1.55, 2.92, 4.86, 6.12, 7.12, 8.32, 9.9, 11.48]; // sept étapes, puis la fiche terminée
  const SQUASH = 0.14, LIFT = 0.1;
  // Symboles qui volent depuis la légende : [case, symbole, x, y, départ, longueur (flèche), trajectoire]
  // (bow : écart latéral sur le papier, arc : hauteur du vol, yk : descend d'abord), pour contourner l'usine du fournisseur
  const FLIGHTS = [
    [0, 'factory', CLI_X, TOP_Y, 1.62], [0, 'factory', SUP_X, TOP_Y, 1.86],
    [1, 'process', PX[2], PROC_Y, 2.98], [1, 'process', PX[1], PROC_Y, 3.13], [1, 'process', PX[0], PROC_Y, 3.28],
    [2, 'stock', STOCKS[3][0], TRI_Y, 4.92], [2, 'stock', STOCKS[2][0], TRI_Y, 5.04], [2, 'stock', STOCKS[1][0], TRI_Y, 5.16], [2, 'stock', STOCKS[0][0], TRI_Y, 5.28, 0, { bow: 105 }],
    [3, 'push', 930, PUSH_Y, 6.18, 80], [3, 'push', 666, PUSH_Y, 6.28, 58], [3, 'push', 414, PUSH_Y, 6.38, 58], [3, 'push', 150, PUSH_Y, 6.48, 80],
    [4, 'truck', CLI_X, TRUCK_Y, 7.18], [4, 'truck', SUP_X, TRUCK_Y, 7.38, 0, { bow: 125, arc: 18, yk: 2.5 }],
  ];
  const FLY = { factory: 0.62, process: 0.62, stock: 0.58, push: 0.55, truck: 0.6 };
  const LEGEND_SCALE = { factory: 0.6, process: 0.36, stock: 1, push: 1, truck: 1 };
  const land = f => f[4] + FLY[f[1]];
  const T_SHIP = [7.84, 8.04], SHIP_DUR = 0.22;              // camion ↔ stock
  const T_PLAN = 8.38;                                        // le planning apparaît
  const T_E = [8.72, 9.02], E_DUR = 0.4;                      // flèches éclair : client → planning → fournisseur
  const T_M = [9.5, 9.44, 9.38], M_DUR = 0.34;                // flèches droites vers les postes (P3 d'abord)
  const T_TL = 9.98, TL_DUR = 1.3;                            // la ligne de temps se dessine
  const PILLS = [
    `1${NB}·${NB}Client, puis fournisseur`, `2${NB}·${NB}Processus et données`, `3${NB}·${NB}Stocks`, `4${NB}·${NB}Flux poussé`,
    `5${NB}·${NB}Transport`, `6${NB}·${NB}Flux d’information`, `7${NB}·${NB}Ligne de temps`, 'Exemple de carte simple',
  ];

  // ---------- Les symboles (dessinés à l'échelle de la carte, centrés en 0, 0) ----------
  const SYM = {
    factory(g) {
      el('path', { d: 'M -58 31 V -31 L -19.33 -12 V -31 L 19.33 -12 V -31 L 58 -12 V 31 Z', fill: C.pLav, stroke: C.blue, 'stroke-width': SW, 'stroke-linejoin': 'round', ...NS }, g);
      return { hw: 58, hh: 31 };
    },
    process(g) {
      el('rect', { x: -91, y: -54, width: 182, height: 108, rx: 10, fill: C.white }, g);
      el('path', { d: 'M -91 -24 V -44 Q -91 -54 -81 -54 H 81 Q 91 -54 91 -44 V -24 Z', fill: C.blue }, g);
      const sk = el('g', {}, g);
      el('rect', { x: -36, y: -43, width: 72, height: 8, rx: 4, fill: C.white, 'fill-opacity': 0.55 }, sk);
      [-2, 20, 42].forEach(b => {
        el('rect', { x: -79, y: b - 9, width: 76, height: 8, rx: 4, fill: SKEL }, sk);
        el('rect', { x: 41, y: b - 9, width: 38, height: 8, rx: 4, fill: SKEL }, sk);
      });
      el('rect', { x: -91, y: -54, width: 182, height: 108, rx: 10, fill: 'none', stroke: C.blue, 'stroke-width': SW, ...NS }, g);
      return { hw: 91, hh: 54, sk };
    },
    stock(g) {
      el('path', { d: 'M 0 -18 L 21 18 L -21 18 Z', fill: C.pRed, stroke: C.red, 'stroke-width': SW, 'stroke-linejoin': 'round', ...NS }, g);
      el('path', { d: 'M -4.5 -1 H 4.5 M 0 -1 V 11 M -4.5 11 H 4.5', fill: 'none', stroke: C.tRed, 'stroke-width': 2.6, 'stroke-linecap': 'round', ...NS }, g);
      return { hw: 21, hh: 18 };
    },
    push(g, L = 64) {
      const x0 = -L / 2, xb = L / 2 - 15;
      el('rect', { x: x0, y: -7, width: xb - x0, height: 14, fill: C.white, stroke: C.blue, 'stroke-width': 2, ...NS }, g);
      for (let x = x0 + 4; x + 5 <= xb - 2; x += 10) el('rect', { x, y: -7, width: 5, height: 14, fill: C.blue }, g);
      el('path', { d: `M ${xb - 1} -13 L ${L / 2} 0 L ${xb - 1} 13 Z`, fill: C.blue, stroke: C.blue, 'stroke-width': 2, 'stroke-linejoin': 'round', ...NS }, g);
      return { hw: L / 2, hh: 13 };
    },
    truck(g) {
      el('rect', { x: -32, y: -17, width: 40, height: 26, rx: 4, fill: C.lightBlue }, g);
      el('path', { d: 'M 10 -9 H 21 L 31 1 V 9 H 10 Z', fill: C.blue, 'stroke-linejoin': 'round' }, g);
      el('path', { d: 'M 14 -5 H 20 L 25 0 H 14 Z', fill: C.white, 'fill-opacity': 0.85 }, g);
      [-21, 20].forEach(x => { el('circle', { cx: x, cy: 11, r: 6, fill: C.ink }, g); el('circle', { cx: x, cy: 11, r: 2.2, fill: C.white }, g); });
      return { hw: 32, hh: 17 };
    },
  };
  // Flèche éclair horizontale (de x0 vers x1)
  const lightning = (x0, x1, y, amp, zw = 13) => {
    const dir = Math.sign(x1 - x0), xm = (x0 + x1) / 2;
    return `M ${x0} ${y} H ${xm - dir * zw} L ${xm + dir * 2} ${y - amp} L ${xm - dir * 2} ${y + amp} L ${xm + dir * zw} ${y} H ${x1}`;
  };
  // Pointe de flèche (angle en degrés, 0 = vers la droite)
  const head = (parent, x, y, angle, color, s = 7, w = 2.5) => el('path', {
    d: `M ${-s} ${f2(-s * 0.8)} L 0 0 L ${-s} ${f2(s * 0.8)}`, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    transform: `translate(${f2(x)} ${f2(y)}) rotate(${f2(angle)})`,
  }, parent);
  const ICON_INFO = g => {
    el('path', { d: 'M -36 -9 H 30', fill: 'none', stroke: C.blue, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    head(g, 31, -9, 0, C.blue, 6);
    el('path', { d: lightning(-36, 30, 10, 6, 10), fill: 'none', stroke: C.blue, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    head(g, 31, 10, 0, C.blue, 6);
  };
  const ICON_TIME = g => {
    [[-40, -6, -14, -6, C.red], [-14, -6, -14, 7, MUTED], [-14, 7, 14, 7, C.green], [14, 7, 14, -6, MUTED], [14, -6, 40, -6, C.red]].forEach(([a, b, c, d, col]) =>
      el('line', { x1: a, y1: b, x2: c, y2: d, stroke: col, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g));
  };

  // ---------- Petits éléments ----------
  function pillShape(parent, x, cy, label, { bg, fg, size = 20, h = 38 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const tx = text(g, x + 18, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', f2(measure(tx).width + 36));
    return g;
  }
  // Texte ancré à gauche, aligné sur sa largeur complète (pour qu'il se tape de gauche à droite)
  function tnode(parent, x, y, str, opts, align = 'start') {
    const n = text(parent, x, y, str, opts);
    if (align !== 'start') { const w = measure(n).width; n.setAttribute('x', f2(align === 'middle' ? x - w / 2 : x - w)); }
    return n;
  }
  function traced(parent, d, attrs) {
    const n = el('path', { d, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs }, parent);
    n.len = n.getTotalLength();
    return n;
  }
  function setTrace(n, p) {
    show(n, p > 0);
    if (p >= 1) { n.removeAttribute('stroke-dasharray'); n.removeAttribute('stroke-dashoffset'); return; }
    const L = n.len + 1;
    n.setAttribute('stroke-dasharray', `${f2(L)} ${f2(L)}`);
    n.setAttribute('stroke-dashoffset', f2(L * (1 - p)));
  }
  const popAt = (n, cx, cy, k) => n.setAttribute('transform', k === 1 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-cx)} ${f2(-cy)})`);

  const S = { cells: [], items: [], groups: [], traces: [] };
  // Groupe de textes tapés à la suite, avec curseur
  function typeGroup(t0, cps, nodes) {
    const g = { t0, cps, nodes: nodes.map(n => ({ n, full: n.textContent, size: Number(n.getAttribute('font-size')) })) };
    g.total = g.nodes.reduce((a, x) => a + x.full.length, 0);
    g.caret = el('rect', { width: 2.5, rx: 1, fill: C.blue, display: 'none' }, S.textL);
    S.groups.push(g);
    return g;
  }
  function drawGroup(g, s, final) {
    const n = final ? Infinity : s < g.t0 ? -1 : Math.floor((s - g.t0) * g.cps);
    let acc = 0, cur = null;
    g.nodes.forEach(x => {
      const k = clamp(n - acc, 0, x.full.length);
      x.n.textContent = k >= x.full.length ? x.full : x.full.slice(0, k);
      show(x.n, k > 0);
      if (k > 0) cur = x;
      acc += x.full.length;
    });
    const typing = !final && n >= 0 && n < g.total && cur;
    show(g.caret, !!typing);
    if (typing) {
      const b = measure(cur.n), y = Number(cur.n.getAttribute('y'));
      g.caret.setAttribute('x', f2(b.x + b.width + 2));
      g.caret.setAttribute('y', f2(y - cur.size * 0.8));
      g.caret.setAttribute('height', f2(cur.size * 0.95));
      g.caret.setAttribute('fill', cur.n.getAttribute('fill'));
    }
  }

  function build() {
    D.template({ author: null });
    D.title('Une première VSM,', 'en sept symboles.', 1020);
    D.chapeau('Il en existe des dizaines. Pour une première carte, sept suffisent.');

    // Explication courte au-dessus du visuel : comment lire la fiche
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['En haut, ', 0], ['les sept symboles', C.blue], [' d’une première VSM. En dessous, ', 0], ['une carte simple', C.blue], ['.', 0]]);
    line(384, [['On part du ', 0], ['client', C.blue], ['. En bas, le ', 0], ['délai total', C.tRed], [' contre le ', 0], ['temps de transformation', C.tGreen], ['.', 0]]);

    const defs = el('defs');
    const soft = el('filter', { id: 'soft', x: '-60%', y: '-200%', width: '220%', height: '500%' }, defs);
    el('feGaussianBlur', { stdDeviation: 4.5 }, soft);

    // ----- Cadre -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- La légende : sept cases -----
    CELLS.forEach((c, i) => {
      const x = COL[c.c].x, w = c.full ? MAP.w : COL[c.c].w, y = ROW_Y[c.r], cy = y + ROW_H / 2;
      const box = el('rect', { x, y, width: w, height: ROW_H, rx: 14, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
      const badge = el('g', { transform: `translate(${x + 26} ${cy})` });
      const bc = el('circle', { cx: 0, cy: 0, r: 13, fill: C.blue, stroke: C.blue, 'stroke-width': 2 }, badge);
      const bn = text(badge, 0, 5.8, String(i + 1), { size: 16, weight: 800, fill: C.white, anchor: 'middle' });
      const icon = el('g', {});
      const inner = el('g', { transform: `translate(${x + 88} ${cy})` }, icon);
      const sym = ['factory', 'process', 'stock', 'push', 'truck'][i];
      if (sym) SYM[sym](el('g', { transform: `scale(${LEGEND_SCALE[sym]})` }, inner));
      else (i === 5 ? ICON_INFO : ICON_TIME)(inner);
      const nm = text(D.svg, x + 142, y + 23, c.name, { size: 17, weight: 700, fill: C.ink });
      const ds = text(D.svg, x + 142, y + 43, c.desc, { size: 15, weight: 500, fill: MUTED });
      fit(nm, x + w - 12, `légende ${i + 1} nom`, x + 130);
      fit(ds, x + w - 12, `légende ${i + 1} description`, x + 130);
      S.cells.push({ box, badge, bc, bn, icon, cx: x + 88, cy, bx: x + 26 });
    });

    // ----- La carte -----
    el('rect', { x: MAP.x, y: MAP.y, width: MAP.w, height: MAP.h, rx: 20, fill: C.card, stroke: C.line, 'stroke-width': 2 });

    // Pastilles d'étape (en haut à gauche de la carte)
    S.pills = PILLS.map((label, i) => {
      const last = i === PILLS.length - 1;
      const p = pillShape(D.svg, 100, 700, label, last ? { bg: C.pLav, fg: C.blue } : { bg: C.blue, fg: C.white });
      fit(p, 700, `pastille ${i + 1}`);
      return p;
    });

    S.map = el('g');
    S.pills.forEach(p => D.svg.appendChild(p));        // la pastille reste au-dessus des symboles en vol
    S.ghostL = el('g', {}, S.map);
    S.lineL = el('g', {}, S.map);
    S.groundL = el('g', {}, S.map);
    S.textL = el('g', {}, S.map);
    S.shadowL = el('g', { filter: 'url(#soft)' }, S.map);
    S.airL = el('g', {}, S.map);

    // Symboles posés sur la carte (ils partent tous de leur case de légende)
    const firstOfCell = {};
    FLIGHTS.forEach((f, idx) => {
      const [cell, sym, x, y, t0, L, path = {}] = f;
      const g = el('g', {}, S.groundL);
      const m = SYM[sym](g, L);
      const s0 = LEGEND_SCALE[sym];
      const it = {
        idx, cell, sym, x, y, t0, fly: FLY[sym], land: land(f), g, m,
        ox: S.cells[cell].cx, oy: S.cells[cell].cy,
        s0x: sym === 'push' ? 64 / L : s0, s0y: s0, first: !(cell in firstOfCell), bow: path.bow || 0, arc: path.arc ?? 62, yk: path.yk || 1,
      };
      firstOfCell[cell] = true;
      it.shadow = el('ellipse', { cx: 0, cy: 0, rx: 10, ry: 5, fill: C.ink, 'fill-opacity': 0.2, display: 'none' }, S.shadowL);
      it.ghost = el('rect', { x: x - m.hw - 6, y: y - m.hh - 6, width: 2 * m.hw + 12, height: 2 * m.hh + 12, rx: 10, fill: 'none', stroke: GHOST, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, S.ghostL);
      S.items.push(it);
    });
    S.firstTake = [0, 1, 2, 3, 4].map(c => Math.min(...S.items.filter(i => i.cell === c).map(i => i.t0)));
    S.refill = [0, 1, 2, 3, 4].map(c => Math.max(...S.items.filter(i => i.cell === c).map(i => i.t0)) + 0.3);
    const itemAt = (sym, x) => S.items.find(i => i.sym === sym && i.x === x);

    // Client et fournisseur : noms et demande, tapés une fois posés
    const cl = tnode(S.textL, CLI_X, 773, 'Client', { size: 16, weight: 800, fill: C.ink }, 'middle');
    const cd = tnode(S.textL, CLI_X, 791, `400${NB}p./jour`, { size: 15, weight: 500, fill: C.ink }, 'middle');
    const su = tnode(S.textL, SUP_X, 782, 'Fournisseur', { size: 15, weight: 700, fill: C.ink }, 'middle');
    [[cl, CLI_X], [cd, CLI_X], [su, SUP_X]].forEach(([n, x], k) => fit(n, x + 54, `usine ${k + 1}`, x - 54));
    typeGroup(itemAt('factory', CLI_X).land + 0.06, 45, [cl, cd]);
    typeGroup(itemAt('factory', SUP_X).land + 0.06, 45, [su]);

    // Processus : nom et données (temps de cycle, de changement, opérateurs)
    PROCS.forEach(([name, rows], k) => {
      const px = PX[k];
      const nodes = [tnode(S.textL, px, 889, name, { size: 17, weight: 700, fill: C.white }, 'middle')];
      fit(nodes[0], px + 85, `processus ${k + 1}`, px - 85);
      rows.forEach(([lab, val], r) => {
        const b = PROC_Y - 2 + 22 * r;
        const a = tnode(S.textL, px - 82, b, lab, { size: 15, weight: 500, fill: MUTED });
        const v = tnode(S.textL, px + 82, b, val, { size: 15, weight: 700, fill: C.ink }, 'end');
        fit(v, px + 84, `processus ${k + 1} valeur ${r + 1}`, px - 84);
        noOverlap(a, v, `processus ${k + 1} ligne ${r + 1}`, 6);
        nodes.push(a, v);
      });
      typeGroup(itemAt('process', px).land + 0.06, 60, nodes);
    });

    // Stocks : quantités
    STOCKS.forEach(([x, q], k) => {
      const n = tnode(S.textL, x, QTY_Y, q, { size: 15, weight: 700, fill: C.tRed }, 'middle');
      fit(n, 990, `stock ${k + 1}`, 90);
      typeGroup(itemAt('stock', x).land + 0.04, 40, [n]);
    });

    // Transport : fréquence des livraisons, et le lien camion ↔ stock
    const fs = tnode(S.textL, 190, 832, `2×/semaine`, { size: 15, weight: 700, fill: C.ink });
    const fc = tnode(S.textL, 890, 832, `1×/jour`, { size: 15, weight: 700, fill: C.ink }, 'end');
    fit(fs, 300, 'fréquence fournisseur', 180);
    fit(fc, 892, 'fréquence client', 780);
    typeGroup(itemAt('truck', CLI_X).land + 0.06, 40, [fc]);
    typeGroup(itemAt('truck', SUP_X).land + 0.06, 40, [fs]);
    S.ship = [
      { n: traced(S.lineL, `M ${CLI_X} 866 V 847`, { stroke: C.ink, 'stroke-width': 2.5 }), h: head(S.lineL, CLI_X, 846, -90, C.ink, 6), t: T_SHIP[0] },
      { n: traced(S.lineL, `M ${SUP_X} 845 V 864`, { stroke: C.ink, 'stroke-width': 2.5 }), h: head(S.lineL, SUP_X, 865, 90, C.ink, 6), t: T_SHIP[1] },
    ];

    // Planning / ERP et flux d'information
    S.plan = el('g', {}, S.textL);
    el('rect', { x: 450, y: 744, width: 180, height: 44, rx: 10, fill: C.white, stroke: C.blue, 'stroke-width': SW }, S.plan);
    const pl = tnode(S.textL, 540, 772, `Planning${NB}·${NB}ERP`, { size: 16, weight: 700, fill: C.blue }, 'middle');
    fit(pl, 624, 'planning', 456);
    typeGroup(T_PLAN + 0.12, 50, [pl]);
    const IA = { stroke: C.blue, 'stroke-width': 2.5 };
    S.info = [
      { n: traced(S.lineL, lightning(866, 640, TOP_Y, 9), IA), h: head(S.lineL, 639, TOP_Y, 180, C.blue), t: T_E[0], d: E_DUR },
      { n: traced(S.lineL, lightning(444, 215, TOP_Y, 9), IA), h: head(S.lineL, 214, TOP_Y, 180, C.blue), t: T_E[1], d: E_DUR },
    ];
    [[498, 304], [540, 540], [582, 776]].forEach(([x0, x1], k) => {
      const ang = Math.atan2(862 - 792, x1 - x0) * 180 / Math.PI;
      S.info.push({ n: traced(S.lineL, `M ${x0} 792 L ${x1} 862`, IA), h: head(S.lineL, x1, 862, ang, C.blue), t: T_M[k], d: M_DUR });
    });
    const lc = tnode(S.textL, 753, 748, 'commandes', { size: 15, weight: 700, fill: MUTED }, 'middle');
    const lp = tnode(S.textL, 329, 748, 'prévisions', { size: 15, weight: 700, fill: MUTED }, 'middle');
    fit(lc, 870, 'commandes', 640);
    fit(lp, 440, 'prévisions', 212);
    typeGroup(T_E[0] + 0.18, 45, [lc]);
    typeGroup(T_E[1] + 0.18, 45, [lp]);

    // Ligne de temps en créneaux
    S.tl = [];
    let acc = 0;
    TL.forEach(([x0, x1, high, val, label], k) => {
      const y = high ? YH : YL;
      if (k > 0) {
        const py = TL[k - 1][2] ? YH : YL;
        const n = traced(S.lineL, `M ${x0} ${py} V ${y}`, { stroke: MUTED, 'stroke-width': 3 });
        S.tl.push({ n, a: acc, len: n.len });
        acc += n.len;
      }
      const n = traced(S.lineL, `M ${x0} ${y} H ${x1}`, { stroke: high ? C.red : C.green, 'stroke-width': 4 });
      const lab = tnode(S.textL, (x0 + x1) / 2, high ? YH - 10 : YL + 24, label, { size: 16, weight: 800, fill: high ? C.tRed : C.tGreen }, 'middle');
      fit(lab, 990, `ligne de temps ${k + 1}`, 90);
      S.tl.push({ n, a: acc, len: n.len, high, val, lab, lx: (x0 + x1) / 2, ly: high ? YH - 16 : YL + 18 });
      acc += n.len;
    });
    S.tlLen = acc;
    S.pen = el('circle', { cx: 0, cy: 0, r: 6.5, fill: C.blue, stroke: C.white, 'stroke-width': 2.5, display: 'none' }, S.lineL);

    // Les deux chiffres de la ligne de temps : délai total contre temps de transformation
    S.tot = el('g', {}, S.textL);
    el('circle', { cx: 112, cy: TOT_Y - 7, r: 8, fill: C.red }, S.tot);
    const dl = text(S.tot, 128, TOT_Y, `Délai total${NB}:`, { size: 19, weight: 700, fill: C.tRed });
    S.dv = text(S.tot, measure(dl).x + measure(dl).width + 7, TOT_Y, `10,5${NB}jours`, { size: 21, weight: 800, fill: C.tRed });
    const vl = text(S.tot, 0, TOT_Y, `Temps de transformation${NB}:`, { size: 19, weight: 700, fill: C.tGreen });
    S.vv = text(S.tot, 0, TOT_Y, `145${NB}s`, { size: 21, weight: 800, fill: C.tGreen });
    const vx0 = 976 - (measure(vl).width + 7 + measure(S.vv).width);
    vl.setAttribute('x', f2(vx0));
    S.vv.setAttribute('x', f2(vx0 + measure(vl).width + 7));
    el('circle', { cx: f2(vx0 - 16), cy: TOT_Y - 7, r: 8, fill: C.green }, S.tot);
    [dl, S.dv, vl, S.vv].forEach((n, k) => fit(n, 980, `total ${k + 1}`, 100));
    noOverlap(S.dv, vl, 'les deux totaux', 40);

    D.encart(['Cartographier ses flux', 'Notre article sur la VSM', '(lien en commentaire)']);
  }

  // ---------- Vol d'un symbole : décollage, arc au-dessus du papier, atterrissage tassé ----------
  function flyState(it, s) {
    const u = s - it.t0;
    if (u < 0) return null;
    if (u >= it.fly) {
      const st = { x: it.x, y: it.y, sx: 1, sy: 1, h: 0, air: false, rot: 0, o: 1 };
      const d = u - it.fly;
      if (d < SQUASH) { const q = Math.sin(Math.PI * d / SQUASH); st.sy = 1 - 0.1 * q; st.sx = 1 + 0.06 * q; }
      return st;
    }
    const o = it.first ? 1 : clamp(u / 0.08);
    if (u < LIFT) {
      const q = easeOut(u / LIFT), k = 1 + 0.1 * q;
      return { x: it.ox, y: it.oy - 4 * q, gx: it.ox, gy: it.oy, sx: it.s0x * k, sy: it.s0y * k, bx: it.s0x, by: it.s0y, h: 0.3 * q, air: true, rot: 0, o };
    }
    const e = easeInOut((u - LIFT) / (it.fly - LIFT));
    const arc = Math.sin(Math.PI * e);
    const h = 0.3 * (1 - e) + 0.85 * arc;
    const k = 1 + h / 3;
    const bx = lerp(it.s0x, 1, e), by = lerp(it.s0y, 1, e);
    const gx = lerp(it.ox, it.x, e) + it.bow * arc, gy = lerp(it.oy, it.y, 1 - Math.pow(1 - e, it.yk));
    return {
      x: gx, y: gy - 4 * (1 - e) - it.arc * arc, gx, gy, sx: bx * k, sy: by * k, bx, by, h, air: true,
      rot: 7 * arc * Math.sign(it.x - it.ox), o,
    };
  }
  // Calque de l'objet (au sol / en vol), dans l'ordre des symboles pour un rendu déterministe
  function place(it, layer) {
    if (it.g.parentNode === layer) return;
    const next = [...layer.children].find(c => c.__idx > it.idx);
    it.g.__idx = it.idx;
    layer.insertBefore(it.g, next || null);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_OUT + OUT;
    const fade = final ? 1 - prog(t, T_OUT, OUT) : 1;
    const s = final ? END : t;
    S.map.setAttribute('opacity', f2(fade));

    // Légende : case active, pastille numérotée, icône qui se vide puis se remplit
    S.cells.forEach((c, i) => {
      const done = final ? 1 - prog(t, T_OUT, OUT) : prog(s, STEP_T[i + 1], 0.2);
      const active = final ? 0 : prog(s, STEP_T[i], 0.2) * (1 - prog(s, STEP_T[i + 1], 0.2));
      const k = Math.max(done, active);
      c.bc.setAttribute('fill', mix(C.white, C.blue, k));
      c.bn.setAttribute('fill', mix(C.blue, C.white, k));
      const pulse = active > 0 ? 1 + 0.09 * active * (0.5 - 0.5 * Math.cos(2 * Math.PI * (s - STEP_T[i]) / 0.7)) : 1;
      c.badge.setAttribute('transform', `translate(${c.bx} ${c.cy})` + (pulse !== 1 ? ` scale(${f2(pulse)})` : ''));
      c.box.setAttribute('stroke', mix(CARD_LINE, C.blue, active));
      c.box.setAttribute('stroke-width', f2(2 + 0.5 * active));
      c.box.setAttribute('fill', mix(C.white, ACTIVE_BG, active));
      if (i < 5) {
        const a = S.firstTake[i], r = S.refill[i];
        const empty = !final && s >= a && s < r;
        const kp = !final && s >= r ? popScale(prog(s, r, 0.3)) : 1;
        c.icon.setAttribute('opacity', empty ? 0.3 : 1);
        popAt(c.icon, c.cx, c.cy, kp);
      }
    });

    // Symboles : contour fantôme à leur place, puis vol depuis la légende
    S.items.forEach(it => {
      const g0 = STEP_T[it.cell] + 0.05;
      const gOn = !final && s >= g0 && s < it.land;
      show(it.ghost, gOn);
      if (gOn) it.ghost.setAttribute('opacity', f2(prog(s, g0, 0.2)));

      const st = flyState(it, s);
      show(it.g, !!st);
      if (!st) { show(it.shadow, false); return; }
      place(it, st.air ? S.airL : S.groundL);
      if (st.air) {
        it.g.setAttribute('transform', `translate(${f2(st.x)} ${f2(st.y)}) rotate(${f2(st.rot)}) scale(${st.sx.toFixed(3)} ${st.sy.toFixed(3)})`);
        it.g.setAttribute('opacity', f2(st.o));
        show(it.shadow, st.h > 0.01);
        it.shadow.setAttribute('cx', f2(st.gx + 8 * st.h));
        it.shadow.setAttribute('cy', f2(st.gy + it.m.hh * st.by + 6 + 16 * st.h));
        it.shadow.setAttribute('rx', f2(it.m.hw * st.bx * (1 - 0.2 * st.h)));
        it.shadow.setAttribute('ry', f2(5 + 3 * st.h));
        it.shadow.setAttribute('fill-opacity', f2(0.34 * clamp(st.h * 3.5) * (1 - 0.3 * st.h) * st.o));
      } else {
        show(it.shadow, false);
        it.g.removeAttribute('opacity');
        it.g.setAttribute('transform', st.sx === 1 && st.sy === 1 ? `translate(${it.x} ${it.y})`
          : `translate(${it.x} ${f2(it.y + it.m.hh)}) scale(${st.sx.toFixed(3)} ${st.sy.toFixed(3)}) translate(0 ${-it.m.hh})`);
      }
      if (it.m.sk) {
        const p = final ? 1 : prog(s, it.land, 0.3);
        show(it.m.sk, p < 1);
        it.m.sk.setAttribute('opacity', f2(1 - p));
      }
    });

    // Textes tapés
    S.groups.forEach(g => drawGroup(g, s, final));

    // Camion ↔ stock
    S.ship.forEach(a => {
      const p = final ? 1 : easeInOut(prog(s, a.t, SHIP_DUR));
      setTrace(a.n, p);
      show(a.h, p >= 1);
    });

    // Planning et flux d'information
    const pp = final ? 1 : prog(s, T_PLAN, 0.32);
    show(S.plan, pp > 0);
    popAt(S.plan, 540, 766, popScale(pp));
    S.info.forEach(a => {
      const p = final ? 1 : easeInOut(prog(s, a.t, a.d));
      setTrace(a.n, p);
      show(a.h, p >= 1);
    });

    // Ligne de temps : le crayon trace les créneaux, les deux totaux roulent
    const tp = final ? 1 : easeInOut(prog(s, T_TL, TL_DUR));
    const drawn = tp * S.tlLen;
    let wait = 0, va = 0, pen = null;
    S.tl.forEach(sg => {
      const fr = clamp((drawn - sg.a) / sg.len);
      setTrace(sg.n, fr);
      if (fr > 0 && fr < 1) pen = sg.n.getPointAtLength(sg.len * fr);
      if (sg.lab) {
        if (sg.high) wait += sg.val * fr; else va += sg.val * fr;
        const lp = clamp((fr - 0.35) / 0.65);
        show(sg.lab, lp > 0);
        popAt(sg.lab, sg.lx, sg.ly, popScale(lp));
      }
    });
    show(S.pen, !!pen && !final);
    if (pen) { S.pen.setAttribute('cx', f2(pen.x)); S.pen.setAttribute('cy', f2(pen.y)); }
    const to = final ? 1 : prog(s, T_TL - 0.08, 0.25);
    show(S.tot, to > 0);
    S.tot.setAttribute('opacity', f2(to));
    S.tot.setAttribute('transform', to >= 1 ? '' : `translate(0 ${f2(10 * (1 - easeOut(to)))})`);
    const days = final ? 10.5 : Math.round(wait * 10) / 10;
    S.dv.textContent = `${days.toFixed(1).replace('.', ',')}${NB}${days < 2 ? 'jour' : 'jours'}`;
    S.vv.textContent = `${Math.round(final ? 145 : va)}${NB}s`;

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const last = i === S.pills.length - 1;
      const a = STEP_T[i] + 0.12;
      let o, dy;
      if (final) { o = last ? fade : 0; dy = 0; }
      else {
        o = prog(s, a, 0.25) * (last ? 1 : 1 - prog(s, STEP_T[i + 1], 0.14));
        dy = 8 * (1 - prog(s, a, 0.25));
      }
      show(g, o > 0);
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
