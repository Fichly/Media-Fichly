// Blog · Obeya · section « Obeya, oobeya, war room : le tableau de correspondance »
// Mécanique : un curseur de temps balaie six mois sur deux lignes.
// En haut, un incident monte : la war room s'installe, la crise redescend, la salle se dissout, et c'est sa réussite.
// En bas, l'Obeya est là du début à la fin ; ses trois rythmes (quotidien, hebdomadaire, mensuel) se répètent
// sous le curseur, crise ou pas. Une Obeya qui se dissout est un échec.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const X0 = 450, X1 = 1126;                 // six mois
  const MONTH = (X1 - X0) / 6;
  const T0 = 3.0, T1 = 11.0;                 // balayage du curseur
  const xAt = t => (t < FADE_END ? X1 : X0 + (X1 - X0) * clamp((t - T0) / (T1 - T0)));
  const tAt = x => T0 + (T1 - T0) * (x - X0) / (X1 - X0);
  const CR = { a: X0 + 1.1 * MONTH, peak: X0 + 1.5 * MONTH, b: X0 + 2.5 * MONTH };   // l'incident
  const TOP = { base: 380, bar: 412 };
  const RY = { q: 530, h: 582, m: 634 };     // rangées des trois rythmes
  const LIFE_Y = 684;
  const DISSOLVE = tAt(CR.b) + 0.25;

  function room(parent, cx, cy, stroke, dashed) {
    const g = el('g', {}, parent);
    el('rect', { x: cx - 34, y: cy - 22, width: 68, height: 44, rx: 8, fill: dashed ? 'none' : C.white, stroke, 'stroke-width': 3, ...(dashed ? { 'stroke-dasharray': '6 5' } : {}) }, g);
    if (!dashed) [-18, 0, 18].forEach(dx => {
      el('circle', { cx: cx + dx, cy: cy - 4, r: 5.5, fill: stroke }, g);
      el('path', { d: `M ${cx + dx - 8} ${cy + 14} Q ${cx + dx} ${cy + 2} ${cx + dx + 8} ${cy + 14} Z`, fill: stroke }, g);
    });
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Crise ou rythme :', 'deux salles.');
    G.blogChapeau('La war room est montée pour un incident ; l’Obeya est permanente et pilote un rythme.');

    // ----- War room -----
    G.card(40, 176, 1120, 272);
    S.wrHead = el('g');
    G.pill(S.wrHead, 64, 216, 'War room', { size: 22, h: 38, bg: C.pRed, fg: C.tRed });
    text(S.wrHead, 64, 268, 'salle de crise,', { size: 19, weight: 600, fill: C.ink });
    text(S.wrHead, 64, 294, 'montée pour un incident', { size: 19, weight: 600, fill: C.ink });
    el('line', { x1: X0 - 10, y1: TOP.base + 1, x2: X1 + 6, y2: TOP.base + 1, stroke: C.line, 'stroke-width': 3 });
    // Courbe de l'incident (révélée par le curseur)
    const cp = G.clipRect(X0 - 12, 190, 0, 250);
    S.crClip = cp.rect;
    S.crisis = el('g', { 'clip-path': cp.url });
    const d = `M ${CR.a} ${TOP.base} C ${CR.a + 30} ${TOP.base} ${CR.peak - 30} 262 ${CR.peak} 262 C ${CR.peak + 50} 262 ${CR.b - 70} ${TOP.base} ${CR.b} ${TOP.base} Z`;
    el('path', { d, fill: C.pRed }, S.crisis);
    el('path', { d: d.replace(' Z', ''), fill: 'none', stroke: C.red, 'stroke-width': 4, 'stroke-linejoin': 'round' }, S.crisis);
    text(S.crisis, CR.peak, 248, 'incident', { size: 18, weight: 700, fill: C.tRed, anchor: 'middle' });
    // Durée de vie de la war room
    S.wrBar = el('rect', { x: CR.a, y: TOP.bar - 8, width: 0, height: 16, rx: 8, fill: C.red });
    S.wrGhost = el('rect', { x: CR.a, y: TOP.bar - 8, width: CR.b - CR.a, height: 16, rx: 8, fill: 'none', stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0 });
    S.wrRoom = room(G.svg, CR.a - 44, 330, C.tRed, false);
    S.wrRoomGhost = room(G.svg, CR.a - 44, 330, C.tRed, true);
    S.wrDone = el('g');
    const pd = G.pill(S.wrDone, CR.b + 36, 318, 'Dissoute, crise réglée : réussite', { size: 19, h: 38, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
    fit(pd.g, 1140, 'pilule war room');

    // ----- Obeya -----
    G.card(40, 464, 1120, 296);
    S.obHead = el('g');
    G.pill(S.obHead, 64, 504, 'Obeya', { size: 22, h: 38, bg: C.pLav, fg: C.blue });
    text(S.obHead, 64, 556, 'salle permanente,', { size: 19, weight: 600, fill: C.ink });
    text(S.obHead, 64, 582, 'pilote un rythme', { size: 19, weight: 600, fill: C.ink });
    S.obRoom = room(S.obHead, 110, 652, C.blue, false);
    // Trois rythmes : repères révélés par le curseur
    const rows = [['quotidien', RY.q], ['hebdomadaire', RY.h], ['mensuel', RY.m]];
    S.rowLab = el('g');
    rows.forEach(([s, y]) => text(S.rowLab, X0 - 18, y + 6, s, { size: 17, weight: 600, fill: C.ink, anchor: 'end' }));
    S.marks = [];
    const DAY = MONTH / 21.7, WEEK = MONTH / 4.33;
    for (let x = X0 + 2; x <= X1; x += DAY) S.marks.push({ x, e: el('rect', { x: x - 1.5, y: RY.q - 9, width: 3, height: 18, rx: 1.5, fill: C.lightBlue }) });
    for (let x = X0 + 10; x <= X1; x += WEEK) S.marks.push({ x, e: el('circle', { cx: x, cy: RY.h, r: 7, fill: C.blue }) });
    for (let k = 0; k < 6; k++) { const x = X0 + (k + 0.5) * MONTH; S.marks.push({ x, e: el('circle', { cx: x, cy: RY.m, r: 11, fill: C.violet }) }); }
    // Durée de vie de l'Obeya : toute la frise, et au-delà
    S.obClip = G.clipRect(X0 - 12, LIFE_Y - 20, 0, 40);
    S.obLife = el('g', { 'clip-path': S.obClip.url });
    G.arrow(S.obLife, `M ${X0} ${LIFE_Y} L ${X1 + 14} ${LIFE_Y}`, { stroke: C.blue, width: 16, head: 0 });
    el('path', { d: `M ${X1 + 4} ${LIFE_Y - 16} L ${X1 + 24} ${LIFE_Y} L ${X1 + 4} ${LIFE_Y + 16} Z`, fill: C.blue }, S.obLife);
    S.obDone = el('g');
    const po = G.pill(S.obDone, X1, 730, 'Toujours là, crise ou pas', { size: 19, h: 36, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
    po.g.setAttribute('transform', `translate(${-po.w} 0)`);
    S.obDoneC = X1 - po.w / 2;

    // Axe des mois (bas de la frise Obeya)
    S.months = el('g');
    for (let k = 0; k <= 6; k++) el('line', { x1: X0 + k * MONTH, y1: 196, x2: X0 + k * MONTH, y2: 438, stroke: C.line, 'stroke-width': 1.5, 'stroke-dasharray': '3 6' }, S.months);
    text(S.months, X0, 208, 'mois 1', { size: 16, weight: 600, fill: C.ink });
    text(S.months, X1, 208, 'mois 6', { size: 16, weight: 600, fill: C.ink, anchor: 'end' });

    // Curseur de temps commun aux deux salles
    S.cursor = el('g');
    el('line', { x1: 0, y1: 222, x2: 0, y2: 706, stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '2 5', 'stroke-linecap': 'round' }, S.cursor);

    S.chute = G.blogChute('Une Obeya qui se dissout est un échec.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    const x = xAt(t);

    pop(S.wrHead, t, 1.75, 200, 250);
    pop(S.obHead, t, 1.95, 200, 560);
    pop(S.rowLab, t, 2.2, X0 - 80, RY.h);
    pop(S.months, t, 2.3, (X0 + X1) / 2, 210);

    // Incident et war room
    S.crClip.setAttribute('width', Math.max(0.001, x - X0 + 12));
    S.crisis.setAttribute('opacity', o0);
    const alive = live && t < DISSOLVE;
    const bw = live ? clamp(x - CR.a, 0, CR.b - CR.a) : CR.b - CR.a;
    S.wrBar.setAttribute('width', Math.max(0.001, bw));
    const dq = live ? clamp(prog(t, DISSOLVE, 0.5)) : 1;
    S.wrBar.setAttribute('opacity', (live ? (x >= CR.a ? 1 - dq : 0) : 0));
    S.wrGhost.setAttribute('opacity', live ? dq : o0);
    // La salle s'installe au début de l'incident, puis se dissout
    const tA = tAt(CR.a);
    if (live) {
      const q = prog(t, tA, 0.35);
      const s = q <= 0 ? 0.001 : q >= 1 ? 1 : 0.6 + 0.4 * G.back(q);
      S.wrRoom.setAttribute('transform', s === 1 ? '' : `translate(${CR.a - 44} 330) scale(${s}) translate(${-(CR.a - 44)} -330)`);
      S.wrRoom.setAttribute('opacity', clamp(q / 0.4) * (1 - dq));
      S.wrRoomGhost.setAttribute('opacity', dq);
    } else {
      S.wrRoom.setAttribute('transform', '');
      S.wrRoom.setAttribute('opacity', 0);
      S.wrRoomGhost.setAttribute('opacity', o0);
    }
    pop(S.wrDone, t, DISSOLVE + 0.35, CR.b + 180, 318);

    // Obeya : les rythmes se répètent sous le curseur
    S.marks.forEach(m => m.e.setAttribute('opacity', live ? (m.x <= x ? 1 : 0) : o0));
    S.obClip.rect.setAttribute('width', Math.max(0.001, (live ? x - X0 : X1 - X0 + 40) + 12));
    S.obLife.setAttribute('opacity', o0);
    if (live && t >= T1) S.obClip.rect.setAttribute('width', X1 - X0 + 52);
    pop(S.obDone, t, T1 + 0.3, S.obDoneC, 730);

    // Curseur
    S.cursor.setAttribute('transform', `translate(${x} 0)`);
    S.cursor.setAttribute('opacity', live ? G.window01(t, T0 - 0.2, T1 + 0.3, 0.2) : 0);

    rise(S.chute, t, T1 + 0.9, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
