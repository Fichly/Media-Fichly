// Fiche LinkedIn · Hugo Duc · mardi 27 octobre 2026
// Post : « Aujourd'hui, on lance la White Belt Fichly. » (initiation gratuite aux fondamentaux du Lean, une heure environ)
// Premier commentaire du post : « Retrouvez la White Belt gratuite sur ce lien » → encart.
// Le visuel est la pièce maîtresse : le parcours de la White Belt. Trois malentendus (l'opérateur, le manager,
// la direction) barrent la route, chacun avec sa barrière. La ligne de progression s'allume brique après brique,
// le chrono roule jusqu'à « ≈ 1 h », chaque barrière se lève quand la brique qui lève le malentendu est passée,
// et le parcours finit en ceinture blanche qui se trace et se noue, badge « Gratuite ».
// Les sept briques ne sont pas nommées par le post : seules la première (« Les fondamentaux ») et la dernière
// (« Ce qui fait durer ») portent un nom, les autres sont numérotées.
// Style propre : le parcours qui s'allume. Image t = 0 = état final. Boucle exacte de 12,5 s.
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
  const bump = (t, s, d) => { const p = prog(t, s, d); return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0; };
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const k3 = v => Math.max(0.001, v).toFixed(3);
  const about = (cx, cy, sx, sy = sx) => `translate(${f2(cx)} ${f2(cy)}) scale(${k3(sx)} ${k3(sy)}) translate(${f2(-cx)} ${f2(-cy)})`;
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = rgb(a), B = rgb(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  const NB = ' ';
  // Opacité ; à 0, l'élément sort du rendu (display none) : moins de travail pour Chromium, rendu stable
  const op = (node, v) => {
    const o = Number(v);
    node.setAttribute('opacity', f2(o));
    if (o <= 0.0005) node.setAttribute('display', 'none'); else node.removeAttribute('display');
  };
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', TRACK = '#c4c4dc', GHOST = '#b4b4d0', GHOST_TXT = '#9696ba', STITCH = '#aeb0dc';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const RY = 742;                                   // la route
  const XS = 120;                                   // départ de la route
  const BX = [168, 330, 420, 510, 690, 780, 870];   // les sept briques
  const SX = [256, 600, 960];                       // les trois barrières (après les briques 1, 4 et 7)
  const BRW = 64, BRH = 46;
  const BUB = { y: 506, w: 292, h: 160, x: [84, 394, 704] };
  const TIP_Y = BUB.y + BUB.h + 22;                 // pointe des bulles
  const RIGHT = 997;                                // la route descend le long du bord droit
  // La ceinture est légèrement galbée : ses bords sont des arcs d'ellipse (EA × EB), repère centré sur le nœud
  const BELT = { cx: 520, cy: 948, L: 230, T: 44, EA: 400, EB: 72.6, K: 1.16 };
  const yc = x => BELT.EB * (Math.sqrt(1 - Math.pow(x / BELT.EA, 2)) - 1);   // ligne médiane
  const slope = x => -BELT.EB * x / (BELT.EA * BELT.EA * Math.sqrt(1 - Math.pow(x / BELT.EA, 2)));
  const ENDX = BELT.cx + BELT.K * BELT.L, ENDY = BELT.cy + BELT.K * yc(BELT.L);
  const STICK = { x: 214, y: 922, r: 70 };
  const TAILS = [[-15, 27, 118], [15, -23, 124]];      // les pans : [pivot x, angle au repos, longueur]

  const MIS = [
    { role: 'L’opérateur', avatar: C.teal, lead: 'pense que Lean veut dire', key: [`«${NB}faire plus avec`, `moins de monde${NB}»`] },
    { role: 'Le manager', avatar: C.violet, lead: 'croit que le Lean, c’est', key: ['le 5S et', 'des tableaux'] },
    { role: 'La direction', avatar: C.lightBlue, lead: 'lance des chantiers', key: ['sans savoir ce qui', 'les fera durer'] },
  ];
  const SPECIAL = { 0: 'Les fondamentaux', 6: 'Ce qui fait durer' };
  const MINS = [9, 17, 26, 34, 43, 51, 60];         // le chrono, brique après brique (≈ 60 min / 7)

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION - 0.01;
  const T_OUT = 1.2, OUT_DUR = 0.3;                 // l'état final s'efface, puis tout se reconstruit
  const PILLS = [
    [1.6, `1${NB}·${NB}Trois malentendus au départ`, 'r'],
    [3.55, `2${NB}·${NB}Sept briques pour les lever`, 'b'],
    [9.6, 'Une base commune, en une heure', 'g'],
  ];
  const T_TRACK = 1.7, T_BRICK = 1.78, T_CHRONO = 1.75, T_GBELT = 2.1;
  const T_BUB = [2.0, 2.4, 2.8];                    // les bulles arrivent, leur barrière descend
  const T_BAR = [4.4, 6.25, 8.1];                   // la lumière bute sur la barrière i
  const T_BELT = 9.4;                               // la lumière atteint la ceinture
  const T_ODO_OUT = 8.75, T_ODO_IN = 8.95;          // « 60 min » sort, « ≈ 1 h » entre
  const STOP = i => SX[i] - 21 - XS;
  let TOTAL = 0, FRONT = [], TC = [];

  const frontLen = s => {
    if (s <= FRONT[0][0]) return 0;
    for (const [t0, t1, l0, l1] of FRONT) {
      if (s < t0) return l0;
      if (s < t1) return lerp(l0, l1, easeInOut((s - t0) / (t1 - t0)));
    }
    return TOTAL;
  };
  const timeAt = L => {                              // instant où la lumière atteint la longueur L
    for (const [t0, t1, l0, l1] of FRONT) if (L <= l1) {
      let a = 0, b = 1;
      for (let k = 0; k < 30; k++) { const m = (a + b) / 2; if (lerp(l0, l1, easeInOut(m)) < L) a = m; else b = m; }
      return lerp(t0, t1, b);
    }
    return T_BELT;
  };
  const minutes = s => {
    let v = 0;
    TC.forEach((tc, k) => { v = lerp(v, MINS[k], easeInOut(prog(s, tc, 0.45))); });
    return v;
  };

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
  function person(parent, cx, cy, color, r = 19) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: color }, g);
    el('circle', { cx, cy: cy - 5.5, r: 6.5, fill: C.white }, g);
    el('path', { d: `M ${cx - 11} ${cy + 12.5} C ${cx - 11} ${cy + 2.5}, ${cx + 11} ${cy + 2.5}, ${cx + 11} ${cy + 12.5} Z`, fill: C.white }, g);
    return g;
  }
  function bubblePath(x0, y0, w, h, tx, r = 20) {
    const x1 = x0 + w, y1 = y0 + h;
    return `M ${x0 + r} ${y0} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} V ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} `
      + `H ${tx + 13} L ${tx} ${y1 + 22} L ${tx - 13} ${y1} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} V ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
  }
  const poly = (pts, close = false) => pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${f2(x)} ${f2(y)}`).join(' ') + (close ? ' Z' : '');
  const edge = (from, to, off, n = 32) => { const pts = []; for (let k = 0; k <= n; k++) { const x = lerp(from, to, k / n); pts.push([x, yc(x) + off]); } return pts; };
  const dashLen = n => { const l = n.getTotalLength(); n.setAttribute('stroke-dasharray', `${f2(l)} ${f2(l + 20)}`); n.setAttribute('stroke-dashoffset', f2(l)); return l; };
  // Le signe « ≈ » (absent de Poppins) : deux vagues
  function approx(parent, x, base, color) {
    const g = el('g', { transform: `translate(${x + 8} ${base - 7.5})` }, parent);
    [-3.6, 3.6].forEach(y => el('path', { d: `M -7 ${y + 1.6} C -4.6 ${y - 2.6}, -1.6 ${y - 2.6}, 0 ${y} S 4.6 ${y + 2.6}, 7 ${y - 1.6}`, fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-linecap': 'round' }, g));
    return g;
  }

  const S = { bricks: [], bars: [], bubbles: [], segs: [] };

  function build() {
    D.template({ author: 'hugo' });
    D.title('Les bases du Lean,', 'sans barrière.');
    D.chapeau(`Aujourd’hui, on lance la White Belt Fichly. Gratuite.`);

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Trois malentendus', C.tRed], [' barrent la route d’une démarche Lean dès le départ.', 0]]);
    line(384, [['La ', 0], ['White Belt', C.blue], [` les lève en chemin${NB}: `, 0], ['sept briques', C.blue], [', une heure environ.', 0]]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-40%', y: '-40%', width: '180%', height: '180%' }, defs);
    el('feDropShadow', { dx: 0, dy: 10, stdDeviation: 9, 'flood-color': C.ink, 'flood-opacity': 0.25 }, lift);
    // Forme des barrières (les rayures sont dessinées dedans : pas de <pattern>, qui rend l'anticrénelage instable)
    const cpStripe = el('clipPath', { id: 'barShape' }, defs);
    el('rect', { x: -9, y: -31, width: 18, height: 62, rx: 6 }, cpStripe);
    const cpBar = el('clipPath', { id: 'barClip' }, defs);
    el('rect', { x: FRAME.x, y: TIP_Y + 2, width: FRAME.w, height: 120 }, cpBar);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    S.scene = el('g');

    // ----- Ceinture fantôme (l'arrivée, en pointillés) -----
    const B = el('g', { transform: `translate(${BELT.cx} ${BELT.cy}) scale(${BELT.K})` }, S.scene);
    S.ghostBelt = el('g', {}, B);
    const ghostStroke = { fill: 'none', stroke: GHOST, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', 'stroke-linejoin': 'round' };
    el('path', { d: poly([...edge(-BELT.L, BELT.L, -BELT.T / 2), ...edge(BELT.L, -BELT.L, BELT.T / 2)], true), ...ghostStroke }, S.ghostBelt);
    TAILS.forEach(([px, a, l]) => el('rect', { x: -20, y: 0, width: 40, height: l, rx: 5, transform: `translate(${px} 24) rotate(${a})`, ...ghostStroke }, S.ghostBelt));
    el('rect', { x: -38, y: -33, width: 76, height: 66, rx: 14, ...ghostStroke, fill: FRAME_BG }, S.ghostBelt);

    // ----- La route : pointillés, puis la ligne allumée -----
    const routeD = `M ${XS} ${RY} H 975 A 22 22 0 0 1 ${RIGHT} ${RY + 22} V ${f2(ENDY - 22)} A 22 22 0 0 1 975 ${f2(ENDY)} H ${f2(ENDX)}`;
    const mask = el('mask', { id: 'trackMask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1080, height: 1350 }, defs);
    S.trackMask = el('path', { d: routeD, fill: 'none', stroke: C.white, 'stroke-width': 24, 'stroke-linecap': 'round' }, mask);
    S.track = el('path', { d: routeD, fill: 'none', stroke: TRACK, 'stroke-width': 4, 'stroke-dasharray': '1 11', 'stroke-linecap': 'round', mask: 'url(#trackMask)' }, S.scene);
    S.start = el('circle', { cx: XS, cy: RY, r: 7, fill: C.blue }, S.scene);
    S.lit = el('path', { d: routeD, fill: 'none', stroke: C.blue, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.scene);
    // Tracé complet, jamais animé : c'est lui qu'on voit une fois la route allumée (rendu identique d'une boucle à l'autre)
    S.litFull = el('path', { d: routeD, fill: 'none', stroke: C.blue, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, S.scene);
    TOTAL = dashLen(S.lit);
    dashLen(S.trackMask);
    S.path = el('path', { d: routeD }, defs);          // pour mesurer la position du front (jamais affiché)
    FRONT = [[3.75, 4.4, 0, STOP(0)], [5.0, 6.25, STOP(0), STOP(1)], [6.85, 8.1, STOP(1), STOP(2)], [8.7, T_BELT, STOP(2), TOTAL]];
    TC = BX.map(bx => timeAt(bx + BRW / 2 - XS));

    // Le front lumineux (sous les briques : il passe derrière elles, la brique se remplit)
    S.front = el('g', {}, S.scene);
    S.frontHalo = el('circle', { cx: 0, cy: 0, r: 17, fill: C.blue, opacity: 0.16 }, S.front);
    el('circle', { cx: 0, cy: 0, r: 8, fill: C.white, stroke: C.blue, 'stroke-width': 4 }, S.front);

    // ----- Barrières (sous les bulles : elles en descendent, elles y remontent) -----
    const barLayer = el('g', { 'clip-path': 'url(#barClip)' }, S.scene);
    SX.forEach(() => {
      const g = el('g', {}, barLayer);
      const halo = el('rect', { x: -16, y: -38, width: 32, height: 76, rx: 11, fill: C.red, opacity: 0 }, g);
      el('rect', { x: -9, y: -31, width: 18, height: 62, rx: 6, fill: C.white }, g);
      const st = el('g', { transform: 'rotate(45)' }, el('g', { 'clip-path': 'url(#barShape)' }, g));
      for (let k = -4; k <= 4; k++) el('rect', { x: -50, y: k * 14 - 3.5, width: 100, height: 7, fill: C.red }, st);
      el('rect', { x: -9, y: -31, width: 18, height: 62, rx: 6, fill: 'none', stroke: C.red, 'stroke-width': 2.5 }, g);
      S.bars.push({ g, halo });
    });
    S.sparks = SX.map(sx => [0, 1, 2, 3, 4, 5].map(k => el('circle', { cx: sx, cy: RY, r: 4, fill: C.green, opacity: 0 }, S.scene)));
    // Repère « levé » laissé sur la route, à l'endroit de la barrière
    S.marks = SX.map(sx => {
      const g = el('g', {}, S.scene);
      el('circle', { cx: sx, cy: RY, r: 11, fill: C.green, stroke: FRAME_BG, 'stroke-width': 3 }, g);
      el('path', { d: `M ${sx - 5} ${RY + 0.5} L ${sx - 1.5} ${RY + 4} L ${sx + 5} ${RY - 3}`, fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      return g;
    });

    // ----- Les sept briques -----
    BX.forEach((bx, k) => {
      const x0 = bx - BRW / 2, y0 = RY - BRH / 2;
      const g = el('g', {}, S.scene);
      const halo = el('rect', { x: x0, y: y0, width: BRW, height: BRH, rx: 10, fill: 'none', stroke: C.blue, 'stroke-width': 3, opacity: 0 }, g);
      [x0 + 11, x0 + BRW - 25].forEach(x => el('rect', { x, y: y0 - 7, width: 14, height: 9, rx: 3, fill: C.white, stroke: TRACK, 'stroke-width': 2 }, g));
      el('rect', { x: x0, y: y0, width: BRW, height: BRH, rx: 10, fill: C.white, stroke: TRACK, 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, g);
      text(g, bx, RY + 8, String(k + 1), { size: 23, weight: 800, fill: '#a9a9c8', anchor: 'middle' });
      const cp = el('clipPath', { id: `brick${k}` }, defs);
      const clip = el('rect', { x: x0 - 3, y: y0 - 12, width: 0, height: BRH + 18 }, cp);
      const litG = el('g', { 'clip-path': `url(#brick${k})` }, g);
      [x0 + 11, x0 + BRW - 25].forEach(x => el('rect', { x: x - 1.25, y: y0 - 8.25, width: 16.5, height: 11.5, rx: 3.5, fill: C.blue }, litG));
      el('rect', { x: x0 - 1.25, y: y0 - 1.25, width: BRW + 2.5, height: BRH + 2.5, rx: 11, fill: C.blue }, litG);
      el('rect', { x: x0 + 6, y: y0 + 5, width: BRW - 12, height: 4, rx: 2, fill: C.white, opacity: 0.22 }, litG);
      text(litG, bx, RY + 8, String(k + 1), { size: 23, weight: 800, fill: C.white, anchor: 'middle' });
      const lab = text(S.scene, bx, RY + 58, `Brique${NB}${k + 1}`, { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
      fit(lab, bx + 45, `libellé brique ${k + 1}`, bx - 45);
      let sp = null;
      if (SPECIAL[k]) {
        sp = text(S.scene, bx, RY + 81, SPECIAL[k], { size: 17, weight: 800, fill: MUTED, anchor: 'middle' });
        fit(sp, FRAME.x + FRAME.w - 20, `nom brique ${k + 1}`, FRAME.x + 14);
      }
      S.bricks.push({ g, clip, halo, lab, sp, bx });
    });

    // ----- La ceinture qui se trace et se noue -----
    S.belt = el('g', {}, B);
    const cpFill = el('clipPath', { id: 'beltFill' }, defs);
    S.fillClip = el('rect', { x: BELT.L + 4, y: -70, width: 0, height: 140 }, cpFill);
    const bandFill = el('g', { 'clip-path': 'url(#beltFill)' }, S.belt);
    el('path', { d: poly([...edge(-BELT.L, BELT.L, -BELT.T / 2), ...edge(BELT.L, -BELT.L, BELT.T / 2)], true), fill: C.white }, bandFill);
    S.stitch = el('g', { opacity: 0 }, S.belt);
    [-13, 13].forEach(o => el('path', { d: poly(edge(-BELT.L + 12, BELT.L - 12, o)), fill: 'none', stroke: STITCH, 'stroke-width': 2, 'stroke-dasharray': '6 5', 'stroke-linecap': 'round' }, S.stitch));
    const wbx = 128, wbs = Math.atan(slope(wbx)) * 180 / Math.PI;
    const wb = text(S.stitch, wbx, yc(wbx) + 5, 'WHITE BELT', { size: 13, weight: 800, fill: C.blue, anchor: 'middle' });
    wb.setAttribute('letter-spacing', 2.4);
    wb.setAttribute('transform', `rotate(${f2(wbs)} ${wbx} ${f2(yc(wbx))})`);
    fit(wb, 205, 'broderie', 45);
    const outline = { fill: 'none', stroke: C.blue, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
    const endR = [BELT.L, yc(BELT.L)], endL = [-BELT.L, yc(-BELT.L)];
    S.bandUp = el('path', { d: poly([endR, ...edge(BELT.L, -BELT.L, -BELT.T / 2), endL]), ...outline }, S.belt);
    S.bandDn = el('path', { d: poly([endR, ...edge(BELT.L, -BELT.L, BELT.T / 2), endL]), ...outline }, S.belt);
    // Contour définitif (rendu stable) : deux arcs d'ellipse coupés aux bouts, et les deux bouts
    S.bandFull = el('g', { opacity: 0 }, S.belt);
    const cpBand = el('clipPath', { id: 'bandEdge' }, defs);
    el('rect', { x: -BELT.L, y: -90, width: 2 * BELT.L, height: 160 }, cpBand);
    const edges = el('g', { 'clip-path': 'url(#bandEdge)' }, S.bandFull);
    [-1, 1].forEach(sg => el('ellipse', { cx: 0, cy: f2(sg * BELT.T / 2 - BELT.EB), rx: BELT.EA, ry: BELT.EB, fill: 'none', stroke: C.blue, 'stroke-width': 4 }, edges));
    [-1, 1].forEach(sg => el('rect', { x: f2(sg * BELT.L - 2), y: f2(yc(BELT.L) - BELT.T / 2 - 2), width: 4, height: BELT.T + 4, fill: C.blue }, S.bandFull));
    S.bandLen = dashLen(S.bandUp); dashLen(S.bandDn);
    // Les deux pans
    S.tails = TAILS.map(([px, a, l]) => {
      const g = el('g', {}, S.belt);
      const inner = el('g', {}, g);
      el('rect', { x: -20, y: 0, width: 40, height: l, rx: 5, ...outline, fill: C.white }, inner);
      [-11, 11].forEach(x => el('line', { x1: x, y1: 14, x2: x, y2: l - 10, stroke: STITCH, 'stroke-width': 2, 'stroke-dasharray': '6 5', 'stroke-linecap': 'round' }, inner));
      return { g, inner, px, a, A: (px < 0 ? 90 : -90) - a };
    });
    // Le nœud
    S.knot = el('g', {}, S.belt);
    const cpKnot = el('clipPath', { id: 'knotClip' }, defs);
    el('rect', { x: -38, y: -33, width: 76, height: 66, rx: 14 }, cpKnot);
    el('rect', { x: -38, y: -33, width: 76, height: 66, rx: 14, fill: C.white }, S.knot);
    el('path', { d: 'M -24 -40 L 4 -40 L 26 40 L -2 40 Z', fill: '#f1f1fa', stroke: C.blue, 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'clip-path': 'url(#knotClip)' }, S.knot);
    el('rect', { x: -38, y: -33, width: 76, height: 66, rx: 14, ...outline }, S.knot);

    // Badge « Gratuite »
    S.sticker = el('g', {}, S.scene);
    S.stickerIn = el('g', {}, S.sticker);
    const pts = [];
    for (let k = 0; k < 180; k++) { const a = k / 180 * Math.PI * 2, r = STICK.r - 4 + 4 * Math.cos(18 * a); pts.push([r * Math.cos(a), r * Math.sin(a)]); }
    el('path', { d: poly(pts, true), fill: C.yellow }, S.stickerIn);
    el('circle', { cx: 0, cy: 0, r: STICK.r - 15, fill: 'none', stroke: C.ink, 'stroke-opacity': 0.3, 'stroke-width': 2, 'stroke-dasharray': '3 4' }, S.stickerIn);
    fit(text(S.stickerIn, 0, 8, 'Gratuite', { size: 22, weight: 800, fill: C.ink, anchor: 'middle' }), 52, 'badge Gratuite', -52);

    // ----- Les trois bulles -----
    MIS.forEach((m, i) => {
      const x0 = BUB.x[i], y0 = BUB.y, tx = SX[i];
      const g = el('g', {}, S.scene);
      const d = bubblePath(x0, y0, BUB.w, BUB.h, tx);
      const solid = el('path', { d, fill: C.white, stroke: C.red, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
      const ghost = el('path', { d, fill: FRAME_BG, stroke: GHOST, 'stroke-width': 2.5, 'stroke-dasharray': '8 6', 'stroke-linejoin': 'round', opacity: 0 }, g);
      const av = person(g, x0 + 38, y0 + 38, m.avatar);
      const role = text(g, x0 + 68, y0 + 45, m.role, { size: 20, weight: 800, fill: C.ink });
      const lead = text(g, x0 + 24, y0 + 84, m.lead, { size: 16, weight: 500, fill: MUTED });
      const keys = m.key.map((k, j) => text(g, x0 + 24, y0 + 115 + j * 29, k, { size: 21, weight: 800, fill: C.tRed }));
      [role, lead, ...keys].forEach((n, j) => fit(n, x0 + BUB.w - 16, `bulle ${i + 1} ligne ${j + 1}`, x0 + 12));
      // Pastille « Levé »
      const chip = el('g', {}, S.scene);
      const cr = el('rect', { y: y0 - 15, height: 30, rx: 15, fill: C.pGreen, stroke: FRAME_BG, 'stroke-width': 3 }, chip);
      const ct = text(chip, 0, y0 + 6, 'Levé', { size: 16, weight: 800, fill: C.tGreen });
      const cw = 38 + ct.getBBox().width + 14, cx0 = x0 + BUB.w - 18 - cw;
      cr.setAttribute('x', cx0); cr.setAttribute('width', cw);
      ct.setAttribute('x', cx0 + 38);
      el('circle', { cx: cx0 + 19, cy: y0, r: 9.5, fill: C.green }, chip);
      el('path', { d: `M ${cx0 + 14.5} ${y0 + 0.5} L ${cx0 + 17.8} ${y0 + 3.8} L ${cx0 + 23.5} ${y0 - 2.8}`, fill: 'none', stroke: C.white, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, chip);
      S.bubbles.push({ g, solid, ghost, av, role, lead, keys, chip, cc: [cx0 + cw / 2, y0], tip: [tx, TIP_Y] });
    });

    // ----- Le chrono -----
    const CB = { x: 820, y: 430, w: 168, h: 52 };   // largeur ajustée au contenu (plus bas)
    const wrap = el('g', {}, S.scene);
    S.chrono = el('g', {}, wrap);
    const cbox = el('rect', { x: CB.x, y: CB.y, width: CB.w, height: CB.h, rx: 26, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.chrono);
    const DC = [CB.x + 31, CB.y + CB.h / 2], DR = 15;
    S.segs = BX.map((_, k) => {
      const a0 = -90 + k * 360 / 7 + 4.5, a1 = a0 + 360 / 7 - 9;
      const P = a => [DC[0] + DR * Math.cos(a * Math.PI / 180), DC[1] + DR * Math.sin(a * Math.PI / 180)];
      const [x0, y0] = P(a0), [x1, y1] = P(a1);
      const d = `M ${f2(x0)} ${f2(y0)} A ${DR} ${DR} 0 0 1 ${f2(x1)} ${f2(y1)}`;
      el('path', { d, fill: 'none', stroke: '#e2e2ee', 'stroke-width': 5, 'stroke-linecap': 'round' }, S.chrono);
      return el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0 }, S.chrono);
    });
    S.hand = el('line', { x1: 0, y1: 0, x2: 0, y2: -8.5, stroke: C.ink, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, S.chrono);
    el('circle', { cx: DC[0], cy: DC[1], r: 2.4, fill: C.ink }, S.chrono);
    S.dc = DC;
    const VX = CB.x + 62, VB = CB.y + 44;
    text(S.chrono, VX, CB.y + 21, 'Durée', { size: 13, weight: 700, fill: MUTED });
    const cpOdo = el('clipPath', { id: 'odo' }, defs);
    const odoClip = el('rect', { x: VX - 2, y: VB - 21, width: 120, height: 27 }, cpOdo);
    const odoWin = el('g', { 'clip-path': 'url(#odo)' }, S.chrono);
    S.odo = el('g', {}, odoWin);
    const probe = text(S.odo, 0, 0, '0', { size: 21, weight: 800 });
    probe.textContent = '0';
    const w1 = probe.getComputedTextLength();
    probe.textContent = '00';
    const dw = probe.getComputedTextLength() - w1;   // avance d'un chiffre
    probe.remove();
    const ROW = 28;
    S.wheels = [0, 1].map(w => {
      const g = el('g', {}, S.odo);
      for (let k = 0; k <= 10; k++) text(g, VX + dw * (w + 0.5), VB + k * ROW, String(k % 10), { size: 21, weight: 800, fill: C.ink, anchor: 'middle' });
      return g;
    });
    S.ROW = ROW;
    const um = text(S.odo, VX + 2 * dw + 6, VB, 'min', { size: 21, weight: 800, fill: C.ink });
    S.hour = el('g', {}, odoWin);
    approx(S.hour, VX, VB, C.blue);
    const hr = text(S.hour, VX + 22, VB, `1${NB}h`, { size: 21, weight: 800, fill: C.blue });
    // La boîte du chrono s'arrête 22 px après son contenu, calée à droite du cadre
    const right = Math.max(um.getBBox().x + um.getBBox().width, hr.getBBox().x + hr.getBBox().width) + 22;
    const shift = FRAME.x + FRAME.w - 32 - right;
    wrap.setAttribute('transform', `translate(${f2(shift)} 0)`);
    cbox.setAttribute('width', f2(right - CB.x));
    odoClip.setAttribute('width', f2(right - VX - 8));
    CB.x += shift;

    // Pastilles d'étape
    S.pills = PILLS.map(([, label, k]) => {
      const st = k === 'r' ? { bg: C.pRed, fg: C.tRed } : k === 'g' ? { bg: C.pGreen, fg: C.tGreen, icon: true } : { bg: C.blue, fg: C.white };
      const p = pillShape(S.scene, 92, FRAME.y + 46, label, st);
      fit(p, CB.x - 20, `pastille ${label}`);
      return p;
    });

    D.encart(['La White Belt Fichly', 'Gratuite, en une heure', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_OUT + OUT_DUR;                // jusqu'à la reconstruction : état final (qui s'efface)
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    const s = final ? END : t;                        // temps de la séquence
    op(S.scene, fade);
    const len = frontLen(s);

    // Route : la piste pointillée se trace, puis la ligne s'allume
    S.trackMask.setAttribute('stroke-dashoffset', f2(TOTAL * (1 - easeInOut(prog(s, T_TRACK, 0.6)))));
    S.start.setAttribute('transform', about(XS, RY, popScale(prog(s, T_TRACK - 0.05, 0.3))));
    // Tracé complet : sans pointillés (rendu identique d'une image à l'autre)
    S.lit.setAttribute('stroke-dashoffset', f2(TOTAL - len));
    const done = len >= TOTAL - 0.01;
    op(S.lit, len > 0.5 && !done ? 1 : 0);
    op(S.litFull, done ? 1 : 0);
    op(S.track, done ? 0 : 1);

    // Front lumineux
    const fo = prog(s, FRONT[0][0] - 0.1, 0.2) * (1 - prog(s, T_BELT - 0.05, 0.15));
    const fp = S.path.getPointAtLength(len);
    S.front.setAttribute('transform', `translate(${f2(fp.x)} ${f2(fp.y)})`);
    op(S.front, fo);
    S.frontHalo.setAttribute('r', f2(15 + 4 * Math.sin(s * Math.PI * 2 / 0.6)));

    // Briques : elles se remplissent quand la lumière les traverse, puis s'allument
    S.bricks.forEach((b, k) => {
      const pin = prog(s, T_BRICK + 0.06 * k, 0.35);
      const fill = clamp((XS + len - (b.bx - BRW / 2 - 3)) / (BRW + 6));
      const kk = popScale(pin) * (1 + 0.13 * bump(s, TC[k], 0.3));
      b.g.setAttribute('transform', kk === 1 ? '' : about(b.bx, RY, kk));
      op(b.g, clamp(pin / 0.4));
      b.clip.setAttribute('width', f2(fill * (BRW + 6)));
      const ph = prog(s, TC[k], 0.5);
      op(b.halo, ph > 0 && ph < 1 ? f2(0.55 * (1 - ph)) : 0);
      b.halo.setAttribute('transform', ph > 0 && ph < 1 ? about(b.bx, RY, 1 + 0.45 * easeOut(ph), 1 + 0.7 * easeOut(ph)) : '');
      const lit = prog(s, TC[k], 0.25);
      b.lab.setAttribute('fill', mix(MUTED, C.ink, lit));
      op(b.lab, clamp(pin / 0.4));
      if (b.sp) { b.sp.setAttribute('fill', mix(MUTED, C.blue, lit)); op(b.sp, clamp(pin / 0.4)); }
    });

    // Barrières : elles descendent des bulles, pulsent, la lumière bute, elles se lèvent
    S.bars.forEach((b, i) => {
      const pd = prog(s, T_BUB[i] + 0.28, 0.45), pl = prog(s, T_BAR[i] + 0.22, 0.3);
      const dy = -90 * (1 - (pd <= 0 ? 0 : back(pd))) - 90 * easeInOut(pl);
      const pk = prog(s, T_BAR[i], 0.22);
      const shake = pk > 0 && pk < 1 ? 3.5 * Math.sin(pk * Math.PI * 6) * (1 - pk) : 0;
      b.g.setAttribute('transform', `translate(${f2(SX[i] + shake)} ${f2(RY + dy)})`);
      op(b.g, pd > 0 && pl < 1 ? 1 : 0);
      const blocking = pd >= 1 && s < T_BAR[i] + 0.25;
      op(b.halo, blocking ? f2(0.1 + 0.16 * (0.5 + 0.5 * Math.sin((s - T_BUB[i]) * Math.PI * 2 / 0.8)) + 0.25 * bump(s, T_BAR[i], 0.25)) : 0);
      // Étincelles quand la barrière est levée
      const pm = prog(s, T_BAR[i] + 0.45, 0.35), km = popScale(pm);
      op(S.marks[i], clamp(pm / 0.4));
      S.marks[i].setAttribute('transform', km === 1 ? '' : about(SX[i], RY, km));
      const ps = prog(s, T_BAR[i] + 0.4, 0.55);
      S.sparks[i].forEach((n, k) => {
        const a = (k * 60 + 30) * Math.PI / 180, r = lerp(10, 38, easeOut(ps));
        n.setAttribute('cx', f2(SX[i] + r * Math.cos(a)));
        n.setAttribute('cy', f2(RY + r * Math.sin(a)));
        n.setAttribute('r', f2(lerp(4.5, 2, ps)));
        op(n, ps > 0 && ps < 1 ? f2(1 - easeIn(ps)) : 0);
      });
    });

    // Bulles : elles arrivent, puis se dissolvent en contour fantôme une fois le malentendu levé
    S.bubbles.forEach((b, i) => {
      const pa = prog(s, T_BUB[i], 0.4), ka = popScale(pa) * (1 - 0.04 * bump(s, T_BAR[i] + 0.25, 0.45));  // elle se dégonfle un peu
      op(b.g, clamp(pa / 0.4));
      b.g.setAttribute('transform', ka === 1 ? '' : about(b.tip[0], b.tip[1], ka));
      const pg = easeInOut(prog(s, T_BAR[i] + 0.3, 0.4));
      op(b.solid, 1 - pg);
      op(b.ghost, pg);
      op(b.av, 1 - 0.55 * pg);
      b.role.setAttribute('fill', mix(C.ink, GHOST_TXT, pg));
      b.lead.setAttribute('fill', mix(MUTED, GHOST_TXT, pg));
      b.keys.forEach(n => n.setAttribute('fill', mix(C.tRed, GHOST_TXT, pg)));
      const pc = prog(s, T_BAR[i] + 0.5, 0.35), kc = popScale(pc);
      op(b.chip, clamp(pc / 0.4));
      b.chip.setAttribute('transform', kc === 1 ? '' : about(b.cc[0], b.cc[1], kc));
    });

    // Chrono : un segment par brique, les minutes roulent, puis « ≈ 1 h »
    const pcI = prog(s, T_CHRONO, 0.35);
    op(S.chrono, clamp(pcI / 0.4));
    S.chrono.setAttribute('transform', pcI >= 1 ? '' : `translate(0 ${f2(-8 * (1 - easeOut(pcI)))})`);
    S.segs.forEach((n, k) => op(n, f2(prog(s, TC[k], 0.25))));
    const v = minutes(s);
    S.hand.setAttribute('transform', `translate(${S.dc[0]} ${S.dc[1]}) rotate(${f2(v * 6)})`);
    const uu = v % 10, tt = Math.floor(v / 10) + clamp(uu - 9);
    S.wheels[0].setAttribute('transform', `translate(0 ${f2(-tt * S.ROW)})`);
    S.wheels[1].setAttribute('transform', `translate(0 ${f2(-uu * S.ROW)})`);
    const po = prog(s, T_ODO_OUT, 0.16), pi = prog(s, T_ODO_IN, 0.3);
    op(S.odo, 1 - po);
    S.odo.setAttribute('transform', po > 0 ? `translate(0 ${f2(-14 * easeIn(po))})` : '');
    op(S.hour, pi);
    S.hour.setAttribute('transform', pi >= 1 ? '' : `translate(0 ${f2(16 * (1 - easeOut(pi)))})`);

    // Ceinture : le fantôme attend, puis le tracé continue la route et se noue
    op(S.ghostBelt, prog(s, T_GBELT, 0.4) * (1 - prog(s, T_BELT + 0.3, 0.5)));
    const pb = easeInOut(prog(s, T_BELT, 0.75));
    [S.bandUp, S.bandDn].forEach(n => {
      n.setAttribute('stroke-dashoffset', f2(S.bandLen * (1 - pb)));
      op(n, pb > 0 && pb < 1 ? 1 : 0);
    });
    op(S.bandFull, pb >= 1 ? 1 : 0);
    const pf = easeInOut(prog(s, T_BELT + 0.08, 0.75));
    S.fillClip.setAttribute('x', f2(BELT.L + 4 - pf * (2 * BELT.L + 8)));
    S.fillClip.setAttribute('width', f2(pf * (2 * BELT.L + 8)));
    // Le nœud se pose, puis se serre quand les pans tombent
    const pk = prog(s, T_BELT + 0.55, 0.35);
    const sq = bump(s, T_BELT + 0.9, 0.3);
    op(S.knot, clamp(pk / 0.3));
    S.knot.setAttribute('transform', `rotate(${f2(-16 * (1 - easeOut(pk)))}) scale(${k3(popScale(pk) * (1 + 0.12 * sq))} ${k3(popScale(pk) * (1 - 0.1 * sq))})`);
    // Les pans : jetés à l'horizontale, ils retombent et se balancent (amorti)
    const u = s - (T_BELT + 0.72);
    S.tails.forEach(tl => {
      const ang = u <= 0 ? tl.a + tl.A : tl.a + tl.A * Math.exp(-3.4 * u) * Math.cos(2 * Math.PI * u / 0.7) * (1 - prog(u, 1.2, 0.6));
      tl.g.setAttribute('transform', `translate(${tl.px} 24) rotate(${f2(ang)})`);
      op(tl.g, clamp(u / 0.08));
    });
    op(S.stitch, prog(s, T_BELT + 1.0, 0.4));
    // Badge « Gratuite » : il tombe sur la ceinture et se plaque
    const pst = prog(s, T_BELT + 1.35, 0.28);
    const air = pst > 0 && pst < 1;
    const ks = (1 + 0.75 * (1 - easeIn(pst))) * (1 - 0.06 * bump(s, T_BELT + 1.63, 0.2));
    op(S.sticker, clamp(pst / 0.3));
    S.sticker.setAttribute('transform', `translate(${STICK.x} ${STICK.y}) rotate(${f2(-12 - 18 * (1 - easeOut(pst)))}) scale(${k3(pst > 0 ? ks : 0.001)})`);
    if (air) S.sticker.setAttribute('filter', 'url(#lift)'); else S.sticker.removeAttribute('filter');

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = PILLS[i][0] + (i ? 0.12 : 0);
      const nxt = i + 1 < PILLS.length ? PILLS[i + 1][0] : Infinity;
      const o = prog(s, a, 0.25) * (1 - prog(s, nxt, 0.14));
      const dy = 8 * (1 - prog(s, a, 0.25));
      op(g, o);
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
