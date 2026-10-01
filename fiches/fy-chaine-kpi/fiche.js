// Fiche LinkedIn · page Fichly · mardi 20 octobre 2026 (Buffer 6abe5d29ecb687b12492e743)
// Post : « Un indicateur affiché ne sert à rien tant qu'il ne déclenche rien. »
// « La fiche reprend la chaîne sur une page, avec une ligne à remplir par indicateur. »
// Premier commentaire du post (Buffer) : nos fiches Lean → encart.
// Le visuel EST la fiche : la chaîne KPI → écart → décision → action (quatre gros maillons), sous chaque
// maillon la conséquence quand il manque (les quatre ❌ du post), puis la grille « une ligne par
// indicateur » remplie avec l'exemple du post (rebuts par équipe) et une ligne vierge.
// Style propre : les maillons et le courant. Une impulsion lumineuse part du chiffre et traverse la
// chaîne ; à chaque maillon, le maillon s'ouvre, le courant s'arrête net en étincelles et la conséquence
// s'affiche ; la grille remplit la case, le maillon se referme (clac), le courant repasse. Après l'action,
// il revient au chiffre par la boucle : 7 rebuts → 4. Image t = 0 = état final. Boucle exacte de 12,5 s.
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
  const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const show = (n, on) => n.setAttribute('display', on ? 'inline' : 'none');
  const NB = ' ';
  const MUTED = '#6f6f9c', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', PALE = '#cfcfe4', DOTS = '#c3c3db';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 745 };
  const PILL_Y = FRAME.y + 42;
  // La chaîne : quatre maillons en stade, entrelacés
  const CY = 588, RW = 246, RH = 124, SW = 22, STEP = 192;
  const R = (RH - SW) / 2;                 // rayon de la ligne médiane du maillon (51)
  const A = RW / 2 - RH / 2;               // demi-longueur de la partie droite (61)
  const CX = [297, 489, 681, 873];
  const XH = (STEP - 2 * A) / 2, YH = Math.sqrt(R * R - XH * XH);   // croisement de deux maillons
  const TOP = CY - R, BOT = CY + R;        // ligne médiane haute et basse
  const GATE = 26, GATE_ANG = 36;          // le doigt du maillon : CX ± 26, charnière à droite
  // Le chiffre (afficheur) et le câble de retour
  const DSP = { x: 84, y: 536, w: 74, h: 104 };
  const DCX = DSP.x + DSP.w / 2;
  const LOOP_Y = 486;
  const X_UP = CX[3] + A + 12;             // montée du câble au-dessus du maillon 4
  // Cartes « s'il manque » et grille
  const CARD = { y: 676, w: 182, h: 118 };
  const GRID = { x: 72, y: 820, w: 936, h: 318 };
  const COLX = CX.map(c => c - STEP / 2);  // bord gauche de chaque colonne (201, 393, 585, 777)
  const ROW = { head: GRID.y, ex: 912, blank: 1030 };

  const LINKS = [
    { name: 'KPI', q: ['Ce qu’on mesure,', 'fréquence et cible'],
      miss: 'Pas de cible', cons: ['On regarde le', 'chiffre sans savoir', 's’il est bon.'],
      ex: ['Pièces rebutées', 'par équipe,', 'cible 5 par poste'] },
    { name: 'Écart', q: ['Le seuil qui signale', 'un problème'],
      miss: 'Pas de seuil', cons: ['Tout le monde', 'voit la hausse,', 'personne ne réagit.'],
      ex: ['Plus de 5 sur un', 'poste, ou 3 postes', 'de suite en hausse'] },
    { name: 'Décision', q: ['Ce qu’on décide,', 'et qui décide'],
      miss: 'Pas de décideur', cons: ['On en rediscute', 'à chaque réunion.'],
      ex: [`Chef d’équipe${NB}:`, `analyse à chaud${NB};`, 'au-delà de 10, il', 'prévient la qualité'] },
    { name: 'Action', q: ['Ce qui est fait,', 'par qui, pour quand'],
      miss: 'Pas d’action suivie', cons: ['Le même écart', 'revient la semaine', 'suivante.'],
      ex: ['5 Pourquoi au poste', `dans la journée${NB};`, 'action notée au', 'tableau, nom et date'] },
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.2, OUT_DUR = 0.35;               // l'état final s'éteint, puis la démonstration
  const T_UP = 1.62, UP_DUR = 0.4;                 // le chiffre passe de 4 à 7
  const T_GO = 2.1;                                // l'impulsion quitte l'afficheur
  const ARR = [2.5, 4.35, 6.2, 8.05];              // arrivée du courant sur le maillon ouvert
  const OPEN_LEAD = 0.22, OPEN_DUR = 0.2;
  const TYPE0 = 0.62, TYPE1 = 1.15;                // la case de la grille se remplit
  const CLOSE0 = 1.08, CLOSE1 = 1.32;              // le maillon se referme (clac)
  const RESUME = 1.36;
  const T_BACK = ARR[3] + RESUME, BACK_DUR = 1.0;  // après l'action : retour au chiffre par la boucle
  const T_ARRIVE = T_BACK + BACK_DUR;
  const T_DOWN = T_ARRIVE + 0.04, DOWN_DUR = 0.42; // 7 → 4
  const BURSTS = [[0, 20], [0.42, 8], [0.8, 8]];   // étincelles : [décalage, nombre]

  // ---------- Petits éléments ----------
  function rich(parent, x, y, segs, { size = 22, anchor = 'start' } = {}) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'text-anchor': anchor }, parent);
    const ST = { n: [500, C.ink], b: [700, C.blue], r: [700, C.tRed] };
    segs.forEach(([s, k = 'n']) => { const sp = el('tspan', { 'font-weight': ST[k][0], fill: ST[k][1] }, t); sp.textContent = s; });
    return t;
  }
  function crossIcon(parent, cx, cy, r, bg = C.red) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: bg }, g);
    const k = r * 0.38;
    el('path', { d: `M ${f2(cx - k)} ${f2(cy - k)} L ${f2(cx + k)} ${f2(cy + k)} M ${f2(cx + k)} ${f2(cy - k)} L ${f2(cx - k)} ${f2(cy + k)}`, stroke: C.white, 'stroke-width': r * 0.26, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function checkIcon(parent, cx, cy, r, bg = C.green) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: bg }, g);
    const k = r / 12;
    el('path', { d: `M ${f2(cx - 5.5 * k)} ${f2(cy + 0.5 * k)} L ${f2(cx - 1.5 * k)} ${f2(cy + 4.5 * k)} L ${f2(cx + 5.5 * k)} ${f2(cy - 3.5 * k)}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2 * k, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function pillShape(parent, x, cy, label, { bg, fg, icon = null, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon === 'x') crossIcon(g, x + 31, cy, 12);
    if (icon === 'check') checkIcon(g, x + 31, cy, 12);
    return g;
  }
  // Texte tapé : n premiers caractères sur des lignes enchaînées ; renvoie la dernière ligne entamée
  function typed(parent, x, y0, lines, step, opts) {
    const nodes = lines.map((l, i) => { const n = text(parent, x, y0 + i * step, l, opts); n.full = l; return n; });
    return {
      nodes, total: lines.join('').length,
      show(n) {
        let rest = n, last = nodes[0];
        nodes.forEach(nd => {
          const k = Math.max(0, Math.min(nd.full.length, rest));
          nd.textContent = nd.full.slice(0, k);
          if (k > 0) last = nd;
          rest -= nd.full.length;
        });
        return last;
      },
    };
  }

  // Tracé d'un maillon, ouvert à l'emplacement du doigt (le doigt est dessiné à part)
  const ringPath = cx => `M ${cx + GATE - 1} ${TOP} L ${cx + A} ${TOP} A ${R} ${R} 0 0 1 ${cx + A} ${BOT} L ${cx - A} ${BOT} A ${R} ${R} 0 0 1 ${cx - A} ${TOP} L ${cx - GATE + 1} ${TOP}`;

  // Parcours du courant : afficheur → haut des quatre maillons → câble de retour → afficheur
  function routePieces() {
    const P = [];
    P.push(['wire', `M ${DSP.x + DSP.w} ${CY} L ${CX[0] - A - R} ${CY}`]);
    CX.forEach((cx, k) => {
      if (k === 0) P.push(['in0', `M ${cx - A - R} ${CY} A ${R} ${R} 0 0 1 ${cx - A} ${TOP}`]);
      else P.push([`in${k}`, `M ${f2(cx - A - XH)} ${f2(CY - YH)} A ${R} ${R} 0 0 1 ${cx - A} ${TOP}`]);
      P.push([`top${k}`, `M ${cx - A} ${TOP} L ${cx + A} ${TOP}`]);
      if (k < 3) P.push([`out${k}`, `M ${cx + A} ${TOP} A ${R} ${R} 0 0 1 ${f2(cx + A + XH)} ${f2(CY - YH)}`]);
    });
    P.push(['back', `M ${CX[3] + A} ${TOP} A 12 12 0 0 0 ${X_UP} ${TOP - 12} L ${X_UP} ${LOOP_Y + 14} A 14 14 0 0 0 ${X_UP - 14} ${LOOP_Y} L ${DCX + 14} ${LOOP_Y} A 14 14 0 0 0 ${DCX} ${LOOP_Y + 14} L ${DCX} ${DSP.y - 3}`]);
    return P;
  }

  const S = { rings: [], cards: [], cells: [], sparks: [] };
  let L_TOT = 0;
  const SK = {};      // abscisses curvilignes des points clés

  function build() {
    D.template({ author: null });
    D.title('La chaîne d’un KPI,', 'en quatre maillons.', 1020);
    D.chapeau('Un indicateur affiché ne sert à rien tant qu’il ne déclenche rien.');

    // Explication courte au-dessus du visuel
    fit(rich(D.svg, 62, 352, [['Le chiffre doit aller ', 'n'], ['jusqu’à l’action', 'b'], ['. ', 'n'], ['Un maillon manque, la chaîne casse.', 'r']]), 1020, 'explication 1');
    fit(rich(D.svg, 62, 384, [['Une ligne par indicateur', 'b'], [`. Seule la 1re colonne se remplit${NB}? `, 'n'], ['Candidat à la suppression.', 'r']]), 1020, 'explication 2');

    const defs = el('defs');
    const glow = el('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 2.4, result: 'b' }, glow);
    const fm = el('feMerge', {}, glow);
    el('feMergeNode', { in: 'b' }, fm);
    el('feMergeNode', { in: 'SourceGraphic' }, fm);
    const cpE = el('clipPath', { id: 'energized' }, defs);
    S.eClip = el('rect', { x: 0, y: 380, width: 1100, height: 320 }, cpE);
    const cpD = el('clipPath', { id: 'digits' }, defs);
    el('rect', { x: DSP.x + 2, y: DSP.y + 30, width: DSP.w - 4, height: 50 }, cpD);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- Parcours (longueurs) -----
    const pieces = routePieces();
    const tmp = el('path', {});
    let acc = 0;
    pieces.forEach(([k, d]) => { tmp.setAttribute('d', d); SK[k] = acc; acc += tmp.getTotalLength(); });
    tmp.remove();
    L_TOT = acc;
    CX.forEach((cx, k) => { SK[`gap${k}`] = SK[`top${k}`] + (A - GATE); });
    const fullD = pieces.map(([, d], i) => (i ? d.replace(/^M [^A-Z]+/, '') : d)).join(' ');

    // ----- Câbles (fil d'entrée et boucle de retour) -----
    const wireD = pieces[0][1], backD = pieces[pieces.length - 1][1];
    S.cables = [wireD, backD].map(d => {
      el('path', { d, fill: 'none', stroke: PALE, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      const n = el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      const len = n.getTotalLength();
      return { n, len };
    });
    // Pointe de flèche dans l'afficheur
    S.arrow = el('path', { d: `M ${DCX - 9} ${DSP.y - 14} L ${DCX} ${DSP.y - 2} L ${DCX + 9} ${DSP.y - 14}`, fill: 'none', stroke: PALE, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });

    // ----- Les quatre maillons -----
    CX.forEach((cx, k) => {
      const g = el('g', { id: `ring${k}` });
      const d = ringPath(cx);
      el('path', { d, fill: 'none', stroke: FRAME_BG, 'stroke-width': SW + 9 }, g);
      el('path', { d, fill: 'none', stroke: PALE, 'stroke-width': SW }, g);
      el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': SW, 'clip-path': 'url(#energized)' }, g);
      // Le doigt : se soulève autour de sa charnière (à droite)
      const gate = el('g', {}, g);
      const gd = `M ${cx - GATE} ${TOP} L ${cx + GATE} ${TOP}`;
      el('path', { d: gd, stroke: FRAME_BG, 'stroke-width': SW + 9 }, gate);
      const gb = el('path', { d: gd, stroke: PALE, 'stroke-width': SW }, gate);
      S.rings.push({ g, gate, gb, cx });
    });
    // Entrelacs : en bas de chaque croisement, le maillon de gauche repasse dessus
    CX.slice(0, 3).forEach((cx, k) => {
      const cp = el('clipPath', { id: `under${k}` }, defs);
      el('rect', { x: cx + A + XH - 22, y: CY + YH - 22, width: 44, height: 44 }, cp);
      el('use', { href: `#ring${k}`, 'clip-path': `url(#under${k})` });
    });
    // Numéros (rivets) et noms
    CX.forEach((cx, k) => {
      el('circle', { cx, cy: BOT, r: 15, fill: C.white, stroke: C.blue, 'stroke-width': 3 });
      text(D.svg, cx, BOT + 6, String(k + 1), { size: 16, weight: 800, fill: C.blue, anchor: 'middle' });
      const nm = text(D.svg, cx, CY + 8.5, LINKS[k].name, { size: 24, weight: 800, fill: C.ink, anchor: 'middle' });
      fit(nm, cx + 66, `nom maillon ${k + 1}`, cx - 66);
    });

    // ----- Le courant -----
    S.core = el('path', { d: fullD, fill: 'none', stroke: C.yellow, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', filter: 'url(#glow)' });
    S.route = el('path', { d: fullD, fill: 'none', stroke: 'none' });
    S.clac = S.rings.map(() => el('circle', { cx: 0, cy: TOP, r: 10, fill: 'none', stroke: C.yellow, 'stroke-width': 3.5, display: 'none' }));
    // Étincelles
    CX.forEach((cx, k) => BURSTS.forEach(([, n], b) => {
      for (let j = 0; j < n; j++) {
        const id = k * 100 + b * 20 + j;
        const ang = -Math.PI / 2 + (rnd(id) - 0.5) * (b ? 2.6 : 3.4);
        const sp = { k, b, j, ang, v: 160 + 140 * rnd(id + 7), life: 0.32 + 0.22 * rnd(id + 13),
          col: [C.yellow, '#fff1b8', C.yellow, C.red][j % 4], w: j % 3 ? 3.4 : 4.4 };
        sp.n = el('line', { stroke: sp.col, 'stroke-width': sp.w, 'stroke-linecap': 'round', display: 'none' });
        S.sparks.push(sp);
      }
    }));
    S.flash = el('path', { d: 'M 0 -17 L 4 -4 L 17 0 L 4 4 L 0 17 L -4 4 L -17 0 L -4 -4 Z', fill: '#fff6cc', stroke: C.yellow, 'stroke-width': 2, 'stroke-linejoin': 'round', display: 'none' });
    S.head = el('g', { display: 'none' });
    S.halo = el('circle', { cx: 0, cy: 0, r: 17, fill: C.yellow, opacity: 0.35 }, S.head);
    el('circle', { cx: 0, cy: 0, r: 10, fill: C.yellow }, S.head);
    el('circle', { cx: 0, cy: 0, r: 5, fill: C.white }, S.head);

    // ----- L'afficheur : le chiffre du poste -----
    S.dsp = el('rect', { x: DSP.x, y: DSP.y, width: DSP.w, height: DSP.h, rx: 14, fill: C.pGreen, stroke: C.green, 'stroke-width': 2.5 });
    const dl = text(D.svg, DCX, DSP.y + 24, 'Rebuts', { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
    fit(dl, DSP.x + DSP.w - 4, 'afficheur libellé', DSP.x + 4);
    const dc = text(D.svg, DCX, DSP.y + DSP.h - 13, `cible${NB}5`, { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
    fit(dc, DSP.x + DSP.w - 4, 'afficheur cible', DSP.x + 4);
    S.digits = el('g', { 'clip-path': 'url(#digits)' });
    S.digitStack = el('g', {}, S.digits);
    S.digitNodes = [4, 5, 6, 7].map((v, i) => text(S.digitStack, DCX, DSP.y + 71 + i * 50, String(v), { size: 42, weight: 800, fill: C.tGreen, anchor: 'middle' }));
    S.okBadge = checkIcon(D.svg, DSP.x + DSP.w - 2, DSP.y + 2, 12);
    S.alert = el('g');
    el('circle', { cx: 0, cy: 0, r: 12, fill: C.red }, S.alert);
    text(S.alert, 0, 6.5, '!', { size: 17, weight: 800, fill: C.white, anchor: 'middle' });

    // Repère de la boucle (en haut à droite du cadre)
    const lb = text(D.svg, 988, PILL_Y + 6, 'Boucle : l’action revient sur le KPI', { size: 16, weight: 700, fill: C.blue, anchor: 'end' });
    lb.textContent = `Boucle${NB}: l’action revient sur le KPI`;
    const lx = lb.getBBox().x - 16;
    el('path', { d: `M ${lx + 7} ${PILL_Y - 4} A 8 8 0 1 0 ${lx + 1} ${PILL_Y + 8}`, fill: 'none', stroke: C.blue, 'stroke-width': 2.6, 'stroke-linecap': 'round' });
    el('path', { d: `M ${lx + 3} ${PILL_Y - 6} L ${lx + 8} ${PILL_Y - 4} L ${lx + 6} ${PILL_Y + 1}`, fill: 'none', stroke: C.blue, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    fit(lb, 990, 'repère boucle', 600);

    // ----- Cartes « s'il manque » -----
    const ml = ['Si un', 'maillon', 'manque'].map((s, i) => text(D.svg, 88, CARD.y + CARD.h / 2 - 14 + i * 21, s, { size: 16, weight: 700, fill: C.tRed }));
    ml.forEach((n, i) => fit(n, COLX[0] - 6, `libellé manque ${i + 1}`));
    CX.forEach((cx, k) => {
      const L = LINKS[k];
      const g = el('g');
      const x0 = cx - CARD.w / 2;
      el('rect', { x: x0, y: CARD.y, width: CARD.w, height: CARD.h, rx: 16, fill: C.pRed, stroke: C.red, 'stroke-width': 2 }, g);
      const n = L.cons.length;
      const y0 = CARD.y + 34 + (3 - n) * 10.5;
      fit(text(g, cx, y0, L.miss, { size: 16, weight: 800, fill: C.tRed, anchor: 'middle' }), x0 + CARD.w - 7, `carte ${k + 1} titre`, x0 + 7);
      L.cons.forEach((s, i) => fit(text(g, cx, y0 + 24 + i * 21, s, { size: 16, weight: 500, fill: C.tRed, anchor: 'middle' }), x0 + CARD.w - 7, `carte ${k + 1} ligne ${i + 1}`, x0 + 7));
      crossIcon(g, x0 + 16, CARD.y + 1, 13);
      S.cards.push({ g, cx });
    });

    // ----- La grille : une ligne par indicateur -----
    el('rect', { x: GRID.x, y: GRID.y, width: GRID.w, height: GRID.h, rx: 20, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    COLX.forEach(x => el('line', { x1: x, y1: GRID.y + 14, x2: x, y2: GRID.y + GRID.h - 14, stroke: C.line, 'stroke-width': 2 }));
    el('line', { x1: GRID.x + 14, y1: ROW.ex, x2: GRID.x + GRID.w - 14, y2: ROW.ex, stroke: C.line, 'stroke-width': 2 });
    el('line', { x1: GRID.x + 14, y1: ROW.blank, x2: GRID.x + GRID.w - 14, y2: ROW.blank, stroke: C.line, 'stroke-width': 2 });
    const cellRight = k => (k < 3 ? COLX[k + 1] - 10 : GRID.x + GRID.w - 12);
    ['Une ligne', 'à remplir', 'par KPI'].forEach((s, i) => fit(text(D.svg, 88, ROW.head + 34 + i * 22, s, { size: 17, weight: 800, fill: C.blue }), COLX[0] - 6, `en-tête grille ${i + 1}`));
    fit(text(D.svg, 88, ROW.ex + 30, 'Exemple', { size: 17, weight: 800, fill: C.blue }), COLX[0] - 6, 'libellé exemple');
    ['Votre', 'indicateur'].forEach((s, i) => fit(text(D.svg, 88, ROW.blank + 30 + i * 22, s, { size: 17, weight: 700, fill: MUTED }), COLX[0] - 6, `libellé vierge ${i + 1}`));
    CX.forEach((cx, k) => {
      const L = LINKS[k], x = COLX[k] + 12;
      el('circle', { cx: x + 12, cy: ROW.head + 28, r: 12, fill: C.blue });
      text(D.svg, x + 12, ROW.head + 33.5, String(k + 1), { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
      fit(text(D.svg, x + 32, ROW.head + 34, L.name, { size: 17, weight: 800, fill: C.ink }), cellRight(k), `grille titre ${k + 1}`);
      L.q.forEach((s, i) => fit(text(D.svg, x, ROW.head + 58 + i * 21, s, { size: 16, weight: 500, fill: MUTED }), cellRight(k), `grille question ${k + 1}.${i + 1}`));
      // Case de l'exemple : surlignage, texte tapé, curseur
      const hl = el('rect', { x: COLX[k] + 4, y: ROW.ex + 6, width: cellRight(k) - COLX[k] + 2, height: ROW.blank - ROW.ex - 12, rx: 10, fill: C.pGreen, display: 'none' });
      const ty = typed(D.svg, x, ROW.ex + 30, L.ex, 22, { size: 17, weight: 500, fill: C.ink });
      ty.nodes.forEach((n, i) => fit(n, cellRight(k), `exemple ${k + 1} ligne ${i + 1}`));
      const caret = el('rect', { x: 0, y: 0, width: 2.5, height: 20, rx: 1, fill: C.blue, display: 'none' });
      S.cells.push({ hl, ty, caret });
      // Ligne vierge : pointillés d'écriture
      [ROW.blank + 34, ROW.blank + 62, ROW.blank + 90].forEach(y => el('line', { x1: x, y1: y, x2: cellRight(k) - 4, y2: y, stroke: DOTS, 'stroke-width': 2.4, 'stroke-dasharray': '1.5 7', 'stroke-linecap': 'round' }));
    });

    // ----- Pastilles d'étape -----
    const PILLS = [
      [`Le chiffre du poste${NB}: 7 rebuts`, { bg: C.blue, fg: C.white }],
      [`Rupture 1${NB}·${NB}pas de cible`, { bg: C.pRed, fg: C.tRed, icon: 'x' }],
      [`Rupture 2${NB}·${NB}pas de seuil`, { bg: C.pRed, fg: C.tRed, icon: 'x' }],
      [`Rupture 3${NB}·${NB}pas de décideur`, { bg: C.pRed, fg: C.tRed, icon: 'x' }],
      [`Rupture 4${NB}·${NB}pas d’action suivie`, { bg: C.pRed, fg: C.tRed, icon: 'x' }],
      ['L’action revient sur le chiffre', { bg: C.blue, fg: C.white }],
      [`Chaîne fermée${NB}: l’écart est traité`, { bg: C.pGreen, fg: C.tGreen, icon: 'check' }],
    ];
    S.pills = PILLS.map(([label, o], i) => { const g = pillShape(D.svg, 92, PILL_Y, label, o); fit(g, lx - 20, `pastille ${i + 1}`); return g; });
    S.pillT = [1.62, ...ARR, T_BACK, T_ARRIVE + 0.1];

    D.encart(['Aller plus loin', 'Nos fiches Lean', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  // Position du courant (abscisse curviligne) et état « bloqué »
  function headS(t) {
    if (t < T_GO) return { s: 0, on: false };
    const stop = k => SK[`gap${k}`] - 10;
    if (t < ARR[0]) return { s: stop(0) * easeInOut(prog(t, T_GO, ARR[0] - T_GO)), on: true };
    for (let k = 0; k < 4; k++) {
      const r = ARR[k] + RESUME;
      if (t < r) return { s: stop(k), on: true, stalled: k, since: t - ARR[k] };
      const next = k < 3 ? ARR[k + 1] : T_ARRIVE;
      if (t < next) return { s: lerp(stop(k), k < 3 ? stop(k + 1) : L_TOT, easeInOut(prog(t, r, next - r))), on: true };
    }
    return { s: L_TOT, on: t < T_ARRIVE + 0.18, absorbed: prog(t, T_ARRIVE, 0.18) };
  }

  function draw(t) {
    const final = t < T_OUT + OUT_DUR;
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    const h = final ? { s: L_TOT, on: false } : headS(t);
    const pt = S.route.getPointAtLength(Math.min(h.s, L_TOT - 0.01));
    const sTop4End = SK.top3 + 2 * A;

    // Maillons sous tension : balayage qui suit le courant (ou s'éteint de droite à gauche)
    let ex;
    if (final) ex = lerp(1100, DSP.x + DSP.w, easeIn(prog(t, T_OUT, OUT_DUR - 0.05)));
    else ex = h.s >= sTop4End ? 1100 : (t < T_GO ? 0 : pt.x + 4);
    S.eClip.setAttribute('width', f2(Math.max(0, ex)));
    S.rings.forEach((r, k) => {
      const passed = final ? fade > 0.5 && ex > r.cx : h.s > SK[`gap${k}`] + GATE;
      r.gb.setAttribute('stroke', passed ? C.blue : PALE);
      // Le doigt : s'ouvre à l'approche du courant, se referme quand la case est remplie
      let a = 0;
      if (!final) {
        const po = prog(t, ARR[k] - OPEN_LEAD, OPEN_DUR), pc = prog(t, ARR[k] + CLOSE0, CLOSE1 - CLOSE0);
        a = (po <= 0 ? 0 : po >= 1 ? 1 : back(po)) * (1 - easeIn(pc));
        const pb = prog(t, ARR[k] + CLOSE1, 0.16);
        if (pb > 0 && pb < 1) a = 0.12 * Math.sin(Math.PI * pb);
      }
      r.gate.setAttribute('transform', a ? `rotate(${f2(GATE_ANG * a)} ${r.cx + GATE} ${TOP})` : '');
      if (!final && t >= ARR[k] - OPEN_LEAD && t < ARR[k] + CLOSE1) r.gb.setAttribute('stroke', C.red);
      // Clac
      const pk = final ? 0 : prog(t, ARR[k] + CLOSE1, 0.32);
      show(S.clac[k], pk > 0 && pk < 1);
      if (pk > 0 && pk < 1) {
        S.clac[k].setAttribute('cx', r.cx);
        S.clac[k].setAttribute('r', f2(10 + 30 * easeOut(pk)));
        S.clac[k].setAttribute('opacity', f2(1 - pk));
      }
    });

    // Câbles : bleus derrière le courant
    const lit = (c, s0) => {
      const p = final ? fade : clamp((h.s - s0) / c.len);
      c.n.setAttribute('stroke-dasharray', p >= 1 ? 'none' : `${f2(c.len)} ${f2(c.len)}`);
      c.n.setAttribute('stroke-dashoffset', f2(c.len * (1 - (final ? 1 : p))));
      c.n.setAttribute('opacity', f2(final ? fade : 1));
      return p;
    };
    lit(S.cables[0], 0);
    const pBack = lit(S.cables[1], SK.back);
    S.arrow.setAttribute('stroke', (final && fade > 0.5) || (!final && pBack >= 0.98) ? C.blue : PALE);

    // Filament jaune : révélé jusqu'au courant
    const coreS = final ? L_TOT : h.s;
    const done = coreS >= L_TOT - 0.01;
    S.core.setAttribute('stroke-dasharray', done ? 'none' : `${f2(L_TOT)} ${f2(L_TOT)}`);
    S.core.setAttribute('stroke-dashoffset', f2(L_TOT - coreS));
    show(S.core, coreS > 0.5 && fade > 0.01);
    S.core.setAttribute('opacity', f2(fade));
    // Quand la boucle se referme : le filament s'épaissit un instant
    const pf = final ? 0 : prog(t, T_ARRIVE, 0.5);
    S.core.setAttribute('stroke-width', f2(5 + 3 * Math.sin(Math.PI * pf)));

    // Tête du courant
    show(S.head, h.on);
    if (h.on) {
      let k = 1, jx = 0, jy = 0, ho = 0.35;
      if (h.stalled !== undefined) {          // bloqué : il grésille
        const u = h.since;
        k = 1 + 0.18 * Math.sin(u * 34) * Math.exp(-u * 1.2);
        jx = 1.6 * Math.sin(u * 71); jy = 1.2 * Math.cos(u * 53);
        ho = 0.3 + 0.25 * Math.abs(Math.sin(u * 9));
      }
      const pin = prog(t, T_GO, 0.18);
      if (pin < 1) k *= popScale(pin);
      if (h.absorbed) k *= Math.max(0.001, 1 - easeIn(h.absorbed));
      S.head.setAttribute('transform', `translate(${f2(pt.x + jx)} ${f2(pt.y + jy)}) scale(${f2(k)})`);
      S.halo.setAttribute('opacity', f2(ho));
    }

    // Étincelles au bord du maillon ouvert
    let fl = null;
    S.sparks.forEach(sp => {
      const t0 = ARR[sp.k] + BURSTS[sp.b][0];
      const u = t - t0;
      const on = !final && u > 0 && u < sp.life;
      show(sp.n, on);
      if (!on) return;
      const gx = CX[sp.k] - GATE + 2, gy = TOP;
      const pos = w => [gx + sp.v * w * Math.cos(sp.ang), gy + sp.v * w * Math.sin(sp.ang) + 0.5 * 1100 * w * w];
      const [x1, y1] = pos(u), [x0, y0] = pos(Math.max(0, u - 0.07));
      sp.n.setAttribute('x1', f2(x0)); sp.n.setAttribute('y1', f2(y0));
      sp.n.setAttribute('x2', f2(x1)); sp.n.setAttribute('y2', f2(y1));
      sp.n.setAttribute('opacity', f2(1 - Math.pow(u / sp.life, 2)));
    });
    ARR.forEach((a, k) => BURSTS.forEach(([dt], b) => {
      const p = prog(t, a + dt, b ? 0.16 : 0.24);
      if (!final && p > 0 && p < 1) fl = { x: CX[k] - GATE + 2, k: (b ? 0.6 : 1.15) * Math.sin(Math.PI * p), r: 60 * p };
    }));
    show(S.flash, !!fl);
    if (fl) S.flash.setAttribute('transform', `translate(${f2(fl.x)} ${TOP}) rotate(${f2(fl.r)}) scale(${f2(Math.max(0.001, fl.k))})`);

    // Afficheur : 4 → 7 au départ, 7 → 4 au retour ; rouge au-dessus de la cible
    let v = 4;
    if (!final) v = t < T_DOWN ? lerp(4, 7, easeInOut(prog(t, T_UP, UP_DUR))) : lerp(7, 4, easeInOut(prog(t, T_DOWN, DOWN_DUR)));
    const red = v > 5.5;
    S.digitStack.setAttribute('transform', `translate(0 ${f2(-(v - 4) * 50)})`);
    S.digitNodes.forEach(n => n.setAttribute('fill', red ? C.tRed : C.tGreen));
    S.dsp.setAttribute('fill', red ? C.pRed : C.pGreen);
    S.dsp.setAttribute('stroke', red ? C.red : C.green);
    const okIn = final ? 1 - prog(t, T_OUT, 0.2) : prog(t, T_DOWN + DOWN_DUR - 0.05, 0.3);
    show(S.okBadge, okIn > 0.001);
    const kok = final ? okIn : popScale(okIn);
    S.okBadge.setAttribute('transform', `translate(${DSP.x + DSP.w - 2} ${DSP.y + 2}) scale(${f2(Math.max(kok, 0.001))}) translate(${-(DSP.x + DSP.w - 2)} ${-(DSP.y + 2)})`);
    const alIn = final || !red ? 0 : prog(t, T_UP + UP_DUR - 0.05, 0.3) * (1 - prog(t, T_DOWN + DOWN_DUR / 2 - 0.12, 0.12));
    show(S.alert, alIn > 0.001);
    const kal = popScale(alIn) * (1 + 0.1 * Math.sin((t - T_UP) * Math.PI * 2 / 0.7));
    S.alert.setAttribute('transform', `translate(${DSP.x + DSP.w - 2} ${DSP.y + 2}) scale(${f2(Math.max(kal, 0.001))})`);

    // Cartes « s'il manque » : surgissent quand le maillon s'ouvre, restent jusqu'à la fin
    S.cards.forEach((c, k) => {
      const p = final ? 1 : prog(t, ARR[k] + 0.05, 0.32);
      const o = final ? fade : clamp(p / 0.35);
      show(c.g, o > 0.001);
      c.g.setAttribute('opacity', f2(o));
      const kk = final ? 1 : popScale(p);
      const ps = final ? 1 : prog(t, ARR[k] + 0.3, 0.35);
      const dx = ps > 0 && ps < 1 ? 5 * Math.sin(ps * Math.PI * 5) * (1 - ps) : 0;
      c.g.setAttribute('transform', kk === 1 && !dx ? '' : `translate(${f2(c.cx + dx)} ${CARD.y}) scale(${f2(kk)}) translate(${-c.cx} ${-CARD.y})`);
    });

    // Grille : la case de l'exemple se remplit avant que le maillon se referme
    S.cells.forEach((c, k) => {
      const a = ARR[k];
      const n = final ? 999 : Math.floor(c.ty.total * prog(t, a + TYPE0, TYPE1 - TYPE0));
      const last = c.ty.show(n);
      c.ty.nodes.forEach(nd => nd.setAttribute('opacity', f2(final ? fade : 1)));
      const typing = !final && t >= a + TYPE0 && n < c.ty.total;
      show(c.caret, typing);
      if (typing) {
        const b = last.getBBox();
        c.caret.setAttribute('x', f2((last.textContent ? b.x + b.width : Number(last.getAttribute('x'))) + 2));
        c.caret.setAttribute('y', f2(Number(last.getAttribute('y')) - 16));
      }
      const ph = final ? 0 : prog(t, a + TYPE0 - 0.05, 0.15) * (1 - prog(t, a + TYPE1 + 0.25, 0.6));
      show(c.hl, ph > 0.001);
      c.hl.setAttribute('opacity', f2(ph));
    });

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const last = i === S.pills.length - 1;
      const a = S.pillT[i] + 0.12;
      let o, dy = 0;
      if (final) o = last ? 1 - prog(t, T_OUT, 0.14) : 0;
      else {
        o = prog(t, a, 0.25) * (last ? 1 : 1 - prog(t, S.pillT[i + 1], 0.14));
        dy = 8 * (1 - prog(t, a, 0.25));
      }
      show(g, o > 0.001);
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
