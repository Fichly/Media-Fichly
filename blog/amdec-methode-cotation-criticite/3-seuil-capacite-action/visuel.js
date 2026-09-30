// Blog · AMDEC · section « À partir de quelle criticité faut-il agir ? »
// Mécanique : les lignes se cotent dans l'ordre du tableau, puis se trient par criticité décroissante (quelques lignes
// détachées, un long plateau). La coupure tombe là où s'arrête la capacité d'action de l'équipe : 3 actions par
// trimestre, seuil 32 ; même atelier avec une équipe qui en tient 6, seuil 12. Enfin, les deux règles de dépassement :
// une gravité maximale et une non-détection maximale passent en action quelle que soit la criticité.
// Notes et capacités illustratives (hypothèse ; l'article laisse la capacité à fixer). Boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  // Lignes dans l'ordre du tableau (F, G, D)
  const LINES = [[3, 3, 2], [1, 4, 2], [3, 4, 4], [1, 3, 1], [2, 2, 4], [1, 1, 4], [3, 4, 3], [3, 2, 1], [3, 2, 2], [1, 2, 1], [2, 4, 4], [3, 3, 1]]
    .map(([f, g, d], i) => ({ f, g, d, c: f * g * d, i }));
  const SORTED = [...LINES].sort((a, b) => b.c - a.c);
  SORTED.forEach((L, r) => (L.rank = r));
  const BW = 44, BG = 14, BX0 = 118, BASE = 606, KY = 5;       // KY : px par point de criticité
  const bx = r => BX0 + r * (BW + BG);
  const by = v => BASE - KY * v;
  const TEAMS = [{ n: 3, y: 634, lab: '3 actions par trimestre' }, { n: 6, y: 676, lab: 'autre équipe : 6 actions' }];
  const T = { cote0: 2.4, coteStep: 0.14, sort: 4.6, sortD: 1.0, cut1: 6.4, cut2: 8.6, over: 10.8, chute: 12.4 };
  const RX = 876;                                              // colonne de droite

  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Le seuil, c’est', 'votre équipe.');
    G.blogChapeau('Cotez tout, triez, puis coupez là où la liste dépasse ce que l’équipe traite.');
    G.card(40, 176, 1120, 576);

    // Axe des criticités
    S.axis = el('g');
    text(S.axis, 64, 214, 'Criticité, échelle de 1 à 4 (maximum 64)', { size: 18, weight: 700, fill: C.ink });
    el('line', { x1: 100, y1: BASE + 1, x2: bx(11) + BW + 12, y2: BASE + 1, stroke: C.line, 'stroke-width': 3 }, S.axis);
    [0, 16, 32, 48, 64].forEach(v => {
      text(S.axis, 92, by(v) + 5, String(v), { size: 15, weight: 600, fill: C.ink, anchor: 'end' });
      if (v) el('line', { x1: 100, y1: by(v), x2: bx(11) + BW + 12, y2: by(v), stroke: C.line, 'stroke-width': 1.5, opacity: 0.6 }, S.axis);
    });

    // Barres
    S.bars = LINES.map(L => {
      const g = el('g');
      const r = el('rect', { x: 0, y: by(L.c), width: BW, height: KY * L.c, rx: 6, fill: C.lightBlue }, g);
      const v = text(g, BW / 2, by(L.c) - 8, String(L.c), { size: 16, weight: 700, fill: C.ink, anchor: 'middle' });
      const clip = G.clipRect(-2, 250, BW + 4, 0);
      g.setAttribute('clip-path', clip.url);
      return { ...L, g, r, v, clip: clip.rect };
    });
    S.plateau = el('g');
    const pl = SORTED.findIndex(L => L.c < 20);
    text(S.plateau, bx(pl) + 10, by(26), 'puis un long plateau', { size: 16, weight: 600, fill: C.ink });
    text(S.plateau, bx(0) + 4, by(58), 'quelques lignes détachées', { size: 16, weight: 600, fill: C.ink });

    // Accolades des équipes et seuils
    S.teams = TEAMS.map((tm, k) => {
      const g = el('g');
      const x0 = bx(0), x1 = bx(tm.n - 1) + BW;
      el('path', { d: `M ${x0} ${tm.y - 12} L ${x0} ${tm.y} L ${x1} ${tm.y} L ${x1} ${tm.y - 12}`, fill: 'none', stroke: k ? C.lightBlue : C.blue, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
      text(g, x1 + 12, tm.y + 6, tm.lab, { size: 16, weight: 700, fill: C.blue });
      const sv = SORTED[tm.n - 1].c;
      const line = el('g');
      el('line', { x1: 100, y1: by(sv), x2: bx(11) + BW + 12, y2: by(sv), stroke: k ? C.lightBlue : C.blue, 'stroke-width': 3, 'stroke-dasharray': '9 6' }, line);
      const lab = G.pill(line, bx(11) + BW + 12, by(sv), `seuil ${sv}`, { size: 16, h: 28, pad: 10, bg: k ? C.lightBlue : C.blue, fg: C.white });
      lab.g.setAttribute('transform', `translate(${-lab.w} 0)`);
      return { g, line, n: tm.n, sv, cx: (x0 + x1) / 2 };
    });

    // Dépassements : gravité max, non-détection max
    S.over = SORTED.map((L, r) => ({ L, r })).filter(({ L }) => L.c < SORTED[5].c && (L.g === 4 || L.d === 4)).map(({ L, r }) => {
      const g = el('g');
      const lab = L.g === 4 ? 'G = 4' : 'D = 4';
      G.pill(g, bx(r) + BW / 2, BASE + 24, lab, { size: 15, h: 26, pad: 9, bg: C.red, fg: C.white, anchor: 'middle' });
      return { g, L, r, cx: bx(r) + BW / 2, cy: BASE + 24 };
    });

    // ----- Colonne de droite : la méthode -----
    S.steps = [
      ['1.', 'Cotez tout le périmètre, avant de fixer un seuil.'],
      ['2.', 'Triez par criticité décroissante.'],
      ['3.', 'Coupez là où la liste dépasse votre capacité d’action.'],
    ].map(([n, s], k) => {
      const g = el('g');
      const y = 250 + k * 96;
      text(g, RX, y, n, { size: 20, weight: 800, fill: C.blue });
      G.para(g, RX + 28, y, s, 228, { size: 17, weight: 600, fill: C.ink, lh: 1.25 });
      return g;
    });
    S.rule = el('g');
    el('rect', { x: RX - 12, y: 548, width: 1136 - RX + 12, height: 132, rx: 16, fill: C.pRed }, S.rule);
    text(S.rule, RX + 4, 578, 'Passent en action quand même', { size: 16, weight: 700, fill: C.tRed });
    G.para(S.rule, RX + 4, 604, 'une gravité au maximum ; une non-détection au maximum, en priorité.', 240, { size: 16, weight: 500, fill: C.ink, lh: 1.3 });

    S.chute = G.blogChute('Le seuil est une propriété de l’équipe, pas de la machine.', { y: 806 });
  }

  // Couleur d'une barre selon l'état des coupures
  function barFill(L, t, live) {
    const inA = L.rank < 3, inB = L.rank < 6;
    const over = S.over.find(o => o.L.i === L.i);
    const tA = live ? t >= T.cut1 + 0.6 : true, tB = live ? t >= T.cut2 + 0.6 : true, tO = live ? t >= T.over + 0.2 : true;
    if (over && tO) return C.red;
    if (inA && tA) return C.blue;
    if (inB && tB) return C.lightBlue;
    return tA ? '#c9c9df' : C.lightBlue;
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.axis.setAttribute('opacity', live ? clamp(prog(t, 1.8, 0.35)) : o);

    // Barres : montée dans l'ordre du tableau, puis tri
    const ps = live ? easeInOut(prog(t, T.sort, T.sortD)) : 1;
    S.bars.forEach(B => {
      const x = bx(B.i) + (bx(B.rank) - bx(B.i)) * ps;
      const y = live ? B.i * 0 : 0;
      B.g.setAttribute('transform', `translate(${x} ${y})`);
      const pc = live ? easeOut(prog(t, T.cote0 + T.coteStep * B.i, 0.35)) : 1;
      const top = by(B.c) - 30;
      B.clip.setAttribute('y', BASE - (BASE - top) * pc);
      B.clip.setAttribute('height', Math.max(0.001, (BASE - top) * pc));
      B.g.setAttribute('opacity', o);
      B.r.setAttribute('fill', barFill(B, t, live));
    });
    S.plateau.setAttribute('opacity', live ? clamp(prog(t, T.sort + T.sortD, 0.4)) : o);

    // Coupures
    S.teams.forEach((tm, k) => {
      const t0 = k ? T.cut2 : T.cut1;
      pop(tm.g, t, t0, tm.cx, TEAMS[k].y);
      let dy = 0, lo = o;
      if (live) { const p = prog(t, t0 + 0.3, 0.5); dy = -40 * (1 - easeOut(p)); lo = clamp(p / 0.3); }
      tm.line.setAttribute('transform', dy ? `translate(0 ${dy})` : '');
      tm.line.setAttribute('opacity', lo);
    });
    S.over.forEach((ov, k) => {
      pop(ov.g, t, T.over + 0.3 * k, ov.cx, ov.cy);
    });

    // Colonne de droite
    const STEP_T = [T.cote0 - 0.2, T.sort - 0.2, T.cut1 - 0.2];
    S.steps.forEach((g, k) => g.setAttribute('opacity', live ? clamp(prog(t, STEP_T[k], 0.3)) : o));
    pop(S.rule, t, T.over, RX + 120, 614);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
