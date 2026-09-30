// Blog · DMAIC · section « Exemple concret : un projet DMAIC en atelier d'usinage »
// Mécanique : l'entonnoir de l'enquête. Définir : 7 % de rebut contre 2 % visés. Mesurer : les rebuts relevés tombent
// par type de défaut, un seul fait 80 %. Analyser : ces rebuts triés par machine et par moment se concentrent sur deux
// machines en début de poste ; l'arrêt trop tôt (« les deux machines dérivent ») est écarté, la cause est une mise en
// chauffe non standardisée. Innover : le standard fait disparaître ces rebuts. Contrôler : audit chaque semaine
// pendant deux mois, le taux repasse sous 2 %.
// Hypothèses : 40 rebuts dessinés, 5 types de défauts, 5 machines, répartition dans la grille, courbe semaine par semaine.
// Boucle de 19 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const P1 = { x: 56, w: 316 }, P2 = { x: 388, w: 424 }, P3 = { x: 828, w: 316 };
  const PTOP = 236, PBOT = 744;
  const PH = ['D · Définir', 'M · Mesurer', 'A · Analyser', 'I · Innover', 'C · Contrôler'];
  const PHX = [156, 372, 588, 804, 1020];
  const T = {
    ribbon: 1.8, panels: 2.0, def: 2.3, rain: 3.4, r80: 5.1, fly: 5.7, zoom: 7.3, stop: 8.0, cause: 8.8,
    std: 9.6, drop: 10.0, ctrl: 11.0, ctrlD: 2.0, under: 13.2, chute: 14.1,
  };
  const PHASE_AT = [T.def - 0.3, T.rain - 0.2, T.fly - 0.2, T.std - 0.2, T.ctrl - 0.1];

  // --- Panneau 1 : histogramme des types de défauts ---
  const BASE1 = 600;
  const dimPos = Array.from({ length: 32 }, (_, i) => ({ x: 96 + 15 * (i % 4), y: BASE1 - 10 - 15 * Math.floor(i / 4) }));
  const othPos = Array.from({ length: 8 }, (_, i) => ({ x: 192 + 34 * Math.floor(i / 2), y: BASE1 - 10 - 15 * (i % 2) }));
  // --- Panneau 2 : grille machine × moment ---
  const ROWY = i => 350 + 46 * i;
  const COLX = [472, 640], CW = 156;
  const CELLS = [[0, 1], [13, 2], [1, 1], [12, 1], [0, 1]];   // [début, reste] par machine
  const HOT = [[1, 0], [3, 0]];
  const cellDot = (m, c, k) => ({ x: COLX[c] + 14 + 15 * (k % 9), y: ROWY(m) - 7 + 15 * Math.floor(k / 9) });
  // --- Panneau 3 : taux de rebut ---
  const Y3 = v => 600 - 37.5 * v;
  const WEEKS = [3.0, 2.4, 2.1, 1.9, 1.8, 1.8, 1.7, 1.8];
  const WX = k => 962 + 20 * k;

  function build() {
    G.templateBlog();
    G.blogTitle('De 7 % de rebut', 'à moins de 2 %.', { size: 48 });
    G.blogChapeau('Exemple : atelier d’usinage, une famille de pièces, objectif interne de 2 % de rebut.');
    G.card(40, 176, 1120, 584);

    // Bandeau des phases
    S.ph = PH.map((s, i) => {
      const g = el('g');
      const off = G.pill(g, PHX[i], 208, s, { size: 17, h: 32, pad: 14, bg: C.pLav, fg: C.blue, anchor: 'middle' });
      const on = el('g', {}, g);
      G.pill(on, PHX[i], 208, s, { size: 17, h: 32, pad: 14, bg: C.blue, fg: C.white, anchor: 'middle' });
      return { g, on };
    });

    // Fonds des panneaux (fixes)
    [P1, P2, P3].forEach(p => el('rect', { x: p.x, y: PTOP, width: p.w, height: PBOT - PTOP, rx: 18, fill: '#f6f6fb' }));
    S.heads = [[P1, '4 semaines de relevés'], [P2, 'Tri par machine et par moment'], [P3, 'Taux de rebut']].map(([p, s], i) => {
      const t = text(G.svg, p.x + 18, 270, s, { size: 19, weight: 700, fill: C.ink });
      fit(t, p.x + p.w - 10, `titre panneau ${i + 1}`);
      return t;
    });

    // ----- Panneau 1 -----
    S.p1 = el('g');
    el('line', { x1: 76, y1: BASE1 + 2, x2: 352, y2: BASE1 + 2, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.p1);
    text(S.p1, 118, BASE1 + 26, 'dimensionnel', { size: 16, weight: 700, fill: C.ink, anchor: 'middle' });
    text(S.p1, 260, BASE1 + 26, 'autres défauts', { size: 16, weight: 700, fill: C.ink, anchor: 'middle' });
    S.dim = dimPos.map(p => el('circle', { cx: p.x, cy: p.y, r: 6, fill: C.red }));
    S.oth = othPos.map(p => el('circle', { cx: p.x, cy: p.y, r: 6, fill: C.red }));
    S.pct = el('g');
    text(S.pct, 118, 462, '80 %', { size: 30, weight: 800, fill: C.tRed, anchor: 'middle' });
    S.res1 = el('g');
    G.pill(S.res1, P1.x + P1.w / 2, 676, 'un seul défaut : 80 % du rebut', { size: 16, h: 30, pad: 12, bg: C.pGreen, fg: C.tGreen, anchor: 'middle' });
    text(S.res1, P1.x + P1.w / 2, 718, 'le problème divisé par cinq', { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });

    // ----- Panneau 2 -----
    S.p2 = el('g');
    text(S.p2, COLX[0] + CW / 2, 314, 'début de poste', { size: 16, weight: 700, fill: C.ink, anchor: 'middle' });
    text(S.p2, COLX[1] + CW / 2, 314, 'reste du poste', { size: 16, weight: 700, fill: C.ink, anchor: 'middle' });
    CELLS.forEach((row, m) => {
      text(S.p2, 412, ROWY(m) + 6, `M${m + 1}`, { size: 17, weight: 700, fill: C.ink });
      row.forEach((n, c) => el('rect', { x: COLX[c], y: ROWY(m) - 20, width: CW, height: 40, rx: 8, fill: C.white }, S.p2));
    });
    S.hot = HOT.map(([m, c]) => el('rect', { x: COLX[c] - 3, y: ROWY(m) - 23, width: CW + 6, height: 46, rx: 10, fill: 'none', stroke: C.yellow, 'stroke-width': 4 }));
    // Rebuts dans la grille (copies des points dimensionnels)
    S.grid = [];
    CELLS.forEach((row, m) => row.forEach((n, c) => {
      for (let k = 0; k < n; k++) {
        const p = cellDot(m, c, k);
        const hot = HOT.some(([a, b]) => a === m && b === c);
        S.grid.push({ ...p, hot, node: el('circle', { cx: p.x, cy: p.y, r: 6, fill: C.red, stroke: C.red, 'stroke-width': 2 }) });
      }
    }));
    // Ordre d'arrivée pseudo-aléatoire, déterministe
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    S.order = S.grid.map((d, i) => ({ i, r: rnd() })).sort((a, b) => a.r - b.r).map(o => o.i);
    S.stop = el('g');
    const sp = G.pill(S.stop, P2.x + 18, 604, 'Trop tôt : « les deux machines dérivent »', { size: 15, h: 30, pad: 12, bg: C.pRed, fg: C.tRed, icon: 'cross' });
    fit(sp.g, P2.x + P2.w - 8, 'arrêt trop tôt');
    S.stopW = sp.w;
    S.strike = el('line', { x1: P2.x + 52, y1: 604, x2: P2.x + 18 + sp.w - 12, y2: 604, stroke: C.tRed, 'stroke-width': 2.5, 'stroke-linecap': 'round' });
    S.cause = el('g');
    el('rect', { x: P2.x + 18, y: 630, width: P2.w - 36, height: 66, rx: 14, fill: C.pGreen }, S.cause);
    G.check(S.cause, P2.x + 44, 663, 13);
    const cp = G.para(S.cause, P2.x + 68, 657, 'Cause : mise en chauffe non standardisée avant le premier lot', P2.w - 104, { size: 17, weight: 700, fill: C.tGreen, lh: 1.2 });
    fit(cp.t, P2.x + P2.w - 20, 'cause');
    S.stdPill = el('g');
    G.pill(S.stdPill, P2.x + P2.w / 2, 720, 'Innover : standard de mise en chauffe', { size: 16, h: 30, pad: 12, bg: C.blue, fg: C.white, anchor: 'middle' });

    // ----- Panneau 3 -----
    S.p3 = el('g');
    el('line', { x1: 872, y1: 296, x2: 872, y2: 602, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.p3);
    el('line', { x1: 872, y1: 602, x2: 1124, y2: 602, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.p3);
    text(S.p3, 866, Y3(7) + 6, '7 %', { size: 16, weight: 700, fill: C.tRed, anchor: 'end' });
    text(S.p3, 866, Y3(2) + 6, '2 %', { size: 16, weight: 700, fill: C.tGreen, anchor: 'end' });
    text(S.p3, 905, 626, 'avant', { size: 15, weight: 700, fill: C.ink, anchor: 'middle' });
    S.target = el('g');
    el('line', { x1: 872, y1: Y3(2), x2: 1124, y2: Y3(2), stroke: C.tGreen, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, S.target);
    text(S.target, 1124, Y3(2) - 10, 'visé', { size: 16, weight: 700, fill: C.tGreen, anchor: 'end' });
    S.gap = el('g');
    G.arrow(S.gap, `M 898 ${Y3(7) + 10} L 898 ${Y3(2) - 8}`, { stroke: C.red, width: 3, head: 9 });
    G.arrow(S.gap, `M 898 ${Y3(2) - 8} L 898 ${Y3(7) + 10}`, { stroke: C.red, width: 3, head: 9 });
    text(S.gap, 905, Y3(4.2) + 6, 'écart', { size: 16, weight: 700, fill: C.tRed });
    const path = pts => 'M ' + pts.map(([x, v]) => `${x} ${Y3(v)}`).join(' L ');
    S.lines = [
      [[880, 7], [944, 7]],
      [[944, 7], [WX(0), WEEKS[0]]],
      WEEKS.map((v, k) => [WX(k), v]),
    ].map((pts, i) => {
      const p = el('path', { d: path(pts), fill: 'none', stroke: i === 0 ? C.red : C.blue, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      return { p, len: p.getTotalLength() };
    });
    S.stdMark = el('g');
    el('line', { x1: 950, y1: 300, x2: 950, y2: 600, stroke: C.blue, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, S.stdMark);
    text(S.stdMark, 956, 314, 'standard', { size: 15, weight: 700, fill: C.blue });
    S.audits = WEEKS.map((v, k) => { const g = el('g'); G.check(g, WX(k), 626, 8); return g; });
    S.res3 = el('g');
    G.pill(S.res3, P3.x + P3.w / 2, 676, 'retour du rebut sous 2 %', { size: 16, h: 30, pad: 12, bg: C.pGreen, fg: C.tGreen, icon: 'check', anchor: 'middle' });
    text(S.res3, P3.x + P3.w / 2, 718, 'audit chaque semaine, 2 mois', { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });

    S.chute = G.blogChute('Ni une machine, ni un opérateur : une absence de standard.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!»])/g, ' $1').replace(/« /g, '« ');
    });
  }

  const drawLine = (L, t, t0, d, o) => {
    const live = t >= FADE_END;
    const q = live ? easeInOut(prog(t, t0, d)) : 1;
    L.p.setAttribute('stroke-dasharray', `${L.len * q} ${L.len}`);
    L.p.setAttribute('opacity', live ? (q > 0 ? 1 : 0) : o);
  };

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // Bandeau des phases
    let cur = -1;
    if (live) PHASE_AT.forEach((a, i) => { if (t >= a) cur = i; });
    S.ph.forEach((p, i) => { pop(p.g, t, T.ribbon + 0.06 * i, PHX[i], 208); p.on.setAttribute('opacity', i === cur && t < T.under + 0.6 ? 1 : 0); });
    S.heads.forEach((h, i) => h.setAttribute('opacity', live ? clamp(prog(t, T.panels + 0.1 * i, 0.3)) : o));

    // Définir : l'écart
    S.p3.setAttribute('opacity', live ? clamp(prog(t, T.def - 0.2, 0.3)) : o);
    pop(S.target, t, T.def + 0.2, 1000, Y3(2));
    pop(S.gap, t, T.def + 0.5, 898, (Y3(7) + Y3(2)) / 2);
    drawLine(S.lines[0], t, T.def, 0.4, o);

    // Mesurer : les rebuts tombent par type de défaut
    S.p1.setAttribute('opacity', live ? clamp(prog(t, T.rain - 0.3, 0.3)) : o);
    const all = [...S.dim.map((n, i) => ({ n, p: dimPos[i] })), ...S.oth.map((n, i) => ({ n, p: othPos[i] }))];
    // ordre de chute : entremêlé (un « autre » tous les quatre)
    all.forEach((d, i) => {
      const rank = i < 32 ? i + Math.floor(i / 4) : 4 + 5 * (i - 32);
      const t0 = T.rain + 0.04 * rank;
      const p = live ? prog(t, t0, 0.3) : 1;
      const y = d.p.y - 90 * (1 - easeOut(p));
      d.n.setAttribute('cy', y);
      const dim = i >= 32 && (!live || t >= T.r80) ? 0.35 : 1;
      d.n.setAttribute('opacity', (live ? (p > 0 ? clamp(p / 0.3) : 0) : o) * dim);
    });
    pop(S.pct, t, T.r80, 118, 452);
    pop(S.res1, t, T.r80 + 0.3, P1.x + P1.w / 2, 690);

    // Analyser : les rebuts dimensionnels rejoignent la grille machine × moment
    S.p2.setAttribute('opacity', live ? clamp(prog(t, T.fly - 0.4, 0.3)) : o);
    S.order.forEach((gi, rank) => {
      const d = S.grid[gi];
      const src = dimPos[rank];
      const t0 = T.fly + 0.04 * rank;
      let x = d.x, y = d.y, op = o;
      if (live) {
        const p = prog(t, t0, 0.45);
        const e = easeInOut(p);
        x = src.x + (d.x - src.x) * e;
        y = src.y + (d.y - src.y) * e - 60 * Math.sin(Math.PI * p);
        op = p > 0 ? 1 : 0;
      }
      d.node.setAttribute('cx', x);
      d.node.setAttribute('cy', y);
      d.node.setAttribute('opacity', op);
      // Innover : les rebuts des deux cellules chaudes disparaissent (restent en creux)
      const gone = d.hot ? (live ? clamp(prog(t, T.std + 0.3 + 0.02 * rank, 0.3)) : 1) : 0;
      d.node.setAttribute('fill', gone > 0.5 ? C.white : C.red);
      d.node.setAttribute('stroke-opacity', 1 - 0.55 * gone);
    });
    S.hot.forEach(h => h.setAttribute('opacity', live ? clamp(prog(t, T.zoom, 0.3)) : o));
    if (live && t >= T.zoom && t < T.zoom + 0.9) S.hot.forEach(h => pulse(h, t, T.zoom + 0.2, 634, 442, 0.03, 0.5));
    pop(S.stop, t, T.stop, P2.x + 18 + S.stopW / 2, 604);
    const sq = live ? prog(t, T.stop + 0.55, 0.3) : 1;
    S.strike.setAttribute('opacity', live ? (sq > 0 ? 1 : 0) : o);
    S.strike.setAttribute('x2', P2.x + 52 + (S.stopW - 46) * sq);
    pop(S.cause, t, T.cause, P2.x + P2.w / 2, 663);
    pop(S.stdPill, t, T.std, P2.x + P2.w / 2, 720);

    // Innover puis Contrôler : la courbe du taux de rebut
    S.stdMark.setAttribute('opacity', live ? clamp(prog(t, T.std, 0.3)) : o);
    drawLine(S.lines[1], t, T.drop, 0.6, o);
    drawLine(S.lines[2], t, T.ctrl, T.ctrlD, o);
    S.audits.forEach((a, k) => pop(a, t, T.ctrl + T.ctrlD * k / 7 - 0.05, WX(k), 626));
    pop(S.res3, t, T.under, P3.x + P3.w / 2, 690);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 19, build, draw });
})();
