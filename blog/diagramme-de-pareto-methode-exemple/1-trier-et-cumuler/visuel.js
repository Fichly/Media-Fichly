// Blog · Diagramme de Pareto · section « Comment construire un diagramme de Pareto : l'exemple de calcul »
// Mécanique : les six causes arrivent dans l'ordre du relevé, puis se trient par valeur décroissante. Chaque barre est
// ensuite empilée sur le cumul précédent (même échelle : 200 arrêts = 100 %), le point du cumul se pose en haut :
// 44, 67, 82, 91, 97, 100 %. Lecture : trois causes sur six font 82 % des arrêts, soit 50 % des causes, pas 20 %.
// Données : tableau de l'article (200 arrêts en vingt jours). Hypothèse : ordre d'arrivée du relevé, illustratif.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const CAUSES = [
    { name: 'Bourrage en sortie d’étiqueteuse', v: 88 },
    { name: 'Changement de bobine film', v: 46 },
    { name: 'Réglage de la dateuse', v: 30 },
    { name: 'Manque de cartons au poste', v: 18 },
    { name: 'Arrêt sur capteur de sécurité', v: 12 },
    { name: 'Panne du convoyeur', v: 6 },
  ];
  const TOTAL = 200;
  const RELEVE = [3, 0, 5, 2, 4, 1];              // ordre d'arrivée (rang dans le relevé)
  const P = { x0: 150, slot: 140, bw: 92, base: 636, top: 284 };
  const H = (P.base - P.top) / TOTAL;              // px par arrêt (200 arrêts = 100 %)
  const yPct = p => P.base - (P.base - P.top) * p / 100;
  const slotX = k => P.x0 + P.slot * (k + 0.5);
  const CUM = []; { let c = 0; CAUSES.forEach(cs => { c += cs.v; CUM.push(c * 100 / TOTAL); }); }
  const T = { axes: 1.8, bars: 2.1, sort: 3.5, cum: 5.0, read: 10.2, box: 10.8, chute: 12.2 };
  const CUM_T = k => T.cum + 0.8 * k;
  const STEPS = ['Trier', 'Cumuler', 'Lire'];
  const STEP_T = [T.sort - 0.3, T.cum - 0.2, T.read];
  const fr = v => v.toFixed(0);
  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Trier, cumuler,', 'puis lire.');
    G.blogChapeau('Vingt jours d’arrêts sur la ligne de conditionnement : 200 arrêts, six causes.');
    G.card(40, 176, 1120, 584);

    // Étapes
    S.steps = STEPS.map((s, i) => {
      const g = el('g');
      const x = 64 + i * 150;
      const bg = el('rect', { x, y: 194, width: 138, height: 36, rx: 18, fill: C.pLav }, g);
      const c = el('circle', { cx: x + 19, cy: 212, r: 13, fill: C.blue }, g);
      const n = text(g, x + 19, 217.5, String(i + 1), { size: 15, weight: 700, fill: C.white, anchor: 'middle' });
      const l = text(g, x + 40, 218.5, s, { size: 18, weight: 700, fill: C.blue });
      return { g, bg, c, n, l, cx: x + 69 };
    });

    // Axes : arrêts à gauche, cumul en % à droite (même échelle)
    S.axes = el('g');
    el('line', { x1: P.x0, y1: P.base, x2: P.x0 + 6 * P.slot, y2: P.base, stroke: C.ink, 'stroke-width': 2.5 }, S.axes);
    el('line', { x1: P.x0, y1: P.top - 6, x2: P.x0, y2: P.base, stroke: C.ink, 'stroke-width': 2 }, S.axes);
    el('line', { x1: P.x0 + 6 * P.slot, y1: P.top - 6, x2: P.x0 + 6 * P.slot, y2: P.base, stroke: C.red, 'stroke-width': 2 }, S.axes);
    [0, 50, 100, 150, 200].forEach(v => {
      const y = P.base - v * H;
      el('line', { x1: P.x0 - 6, y1: y, x2: P.x0, y2: y, stroke: C.ink, 'stroke-width': 2 }, S.axes);
      text(S.axes, P.x0 - 10, y + 5, String(v), { size: 15, weight: 500, fill: C.ink, anchor: 'end' });
      if (v) el('line', { x1: P.x0, y1: y, x2: P.x0 + 6 * P.slot, y2: y, stroke: C.line, 'stroke-width': 1.5 }, S.axes);
    });
    [0, 25, 50, 75, 100].forEach(p => {
      const y = yPct(p), xr = P.x0 + 6 * P.slot;
      el('line', { x1: xr, y1: y, x2: xr + 6, y2: y, stroke: C.red, 'stroke-width': 2 }, S.axes);
      text(S.axes, xr + 10, y + 5, `${p}${NB}%`, { size: 15, weight: 500, fill: C.tRed });
    });
    text(S.axes, P.x0 - 10, P.top - 18, 'Arrêts', { size: 16, weight: 700, fill: C.ink, anchor: 'end' });
    text(S.axes, P.x0 + 6 * P.slot + 10, P.top - 18, 'Cumul', { size: 16, weight: 700, fill: C.tRed });
    G.svg.insertBefore(S.axes, G.svg.querySelector('g') || null);

    // Seuil 80 %
    S.l80 = el('g');
    el('line', { x1: P.x0, y1: yPct(80), x2: P.x0 + 6 * P.slot, y2: yPct(80), stroke: C.tRed, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, S.l80);
    text(S.l80, P.x0 + 8, yPct(80) - 8, `80${NB}%`, { size: 15, weight: 700, fill: C.tRed });

    // Empilements (le cumul, marche par marche) : sous les barres
    S.stacks = CAUSES.map((cs, k) => {
      const r = el('rect', { x: slotX(k) - P.bw / 2, y: 0, width: P.bw, height: cs.v * H, rx: 5, fill: C.pRed, stroke: C.red, 'stroke-width': 1.5, 'stroke-dasharray': '5 4', opacity: 0 });
      return r;
    });

    // Barres et étiquettes
    S.bars = CAUSES.map((cs, k) => {
      const g = el('g');
      const h = cs.v * H;
      const rect = el('rect', { x: -P.bw / 2, y: P.base - h, width: P.bw, height: h, rx: 5, fill: C.blue }, g);
      // Valeur : dans la barre si elle est assez haute (le point du cumul se pose sur son sommet)
      if (h > 44) text(g, 0, P.base - h + 26, String(cs.v), { size: 18, weight: 700, fill: C.white, anchor: 'middle' });
      else text(g, 0, P.base - h - 8, String(cs.v), { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
      const lab = G.para(g, 0, P.base + 22, cs.name, P.slot - 10, { size: 15, weight: 500, fill: C.ink, anchor: 'middle', lh: 1.2 });
      lab.t.querySelectorAll('tspan').forEach(ts => ts.setAttribute('x', 0));
      if (lab.n > 3) console.error(`Étiquette sur ${lab.n} lignes : ${cs.name}`);
      return { g, rect, k, h, from: slotX(RELEVE.indexOf(k)), to: slotX(k) };
    });

    // Courbe cumulée
    S.segs = CUM.map((c, k) => {
      const x0 = k ? slotX(k - 1) : slotX(0), y0 = k ? yPct(CUM[k - 1]) : yPct(CUM[0]);
      return k ? el('line', { x1: x0, y1: y0, x2: x0, y2: y0, stroke: C.red, 'stroke-width': 3.5, 'stroke-linecap': 'round' }) : null;
    });
    S.pts = CUM.map((c, k) => {
      const g = el('g');
      el('circle', { cx: slotX(k), cy: yPct(c), r: 7, fill: C.red, stroke: C.white, 'stroke-width': 2.5 }, g);
      const lx = k === 5 ? slotX(k) - 12 : slotX(k) - 14;
      text(g, lx, yPct(c) - 13, `${fr(c)}${NB}%`, { size: 16, weight: 700, fill: C.tRed, anchor: 'end' });
      return g;
    });

    // Lecture
    S.read = el('g');
    const x2 = slotX(2);
    el('line', { x1: x2, y1: yPct(82), x2: x2, y2: P.base, stroke: C.tRed, 'stroke-width': 2, 'stroke-dasharray': '4 5' }, S.read);
    S.box = el('g');
    el('rect', { x: 596, y: 384, width: 384, height: 128, rx: 16, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, S.box);
    text(S.box, 616, 418, 'Trois causes sur six : 82 % des arrêts.', { size: 18, weight: 700, fill: C.ink });
    text(S.box, 616, 448, 'Soit 50 % des causes, pas 20 %.', { size: 18, weight: 700, fill: C.tRed });
    text(S.box, 616, 484, 'Le rapport réel varie d’un relevé à l’autre.', { size: 16, weight: 500, fill: C.ink });
    [...S.box.querySelectorAll('text')].forEach((tx, i) => fit(tx, 972, `lecture ${i}`));

    S.chute = G.blogChute('Le 80/20 est une analogie, jamais une loi.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const nStep = t < FADE_END ? 4 : STEP_T.filter(s => t >= s).length + (t >= T.chute ? 1 : 0);
    S.steps.forEach((s, i) => {
      pop(s.g, t, 1.8 + 0.08 * i, s.cx, 212);
      const done = i + 1 < nStep, cur = i + 1 === nStep;
      s.bg.setAttribute('fill', done ? C.pGreen : cur ? C.blue : C.pLav);
      s.c.setAttribute('fill', done ? C.green : cur ? C.white : C.blue);
      s.n.setAttribute('fill', cur ? C.blue : C.white);
      s.l.setAttribute('fill', done ? C.tGreen : cur ? C.white : C.blue);
    });

    S.axes.setAttribute('opacity', live ? clamp(prog(t, T.axes, 0.3)) : o);

    // Barres : poussent dans l'ordre du relevé, puis glissent à leur rang
    const sp = live ? easeInOut(prog(t, T.sort, 0.9)) : 1;
    const dimRead = live ? clamp(prog(t, T.read + 0.2, 0.4)) : 1;
    S.bars.forEach(b => {
      const r = RELEVE.indexOf(b.k);
      const g0 = live ? easeOut(prog(t, T.bars + 0.12 * r, 0.45)) : 1;
      const x = b.from + (b.to - b.from) * sp;
      const lift = live ? 26 * Math.sin(Math.PI * clamp((t - T.sort) / 0.9)) * (b.from !== b.to ? 1 : 0) : 0;
      b.g.setAttribute('transform', `translate(${x} ${-lift})`);
      b.rect.setAttribute('height', Math.max(0.01, b.h * g0));
      b.rect.setAttribute('y', P.base - b.h * g0);
      b.g.setAttribute('opacity', (live ? clamp(prog(t, T.bars + 0.12 * r, 0.25)) : o) * (b.k > 2 ? 1 - 0.55 * dimRead : 1));
    });

    // Cumul : chaque barre s'empile sur la précédente, le point se pose, la courbe avance
    S.stacks.forEach((st, k) => {
      const t0 = CUM_T(k);
      const p = live ? prog(t, t0, 0.45) : 1;
      const yTop = yPct(CUM[k]);
      const yFrom = P.base - CAUSES[k].v * H;
      st.setAttribute('y', yFrom + (yTop - yFrom) * easeInOut(p));
      st.setAttribute('opacity', (live ? (p > 0 ? 0.75 : 0) : o * 0.75) * (k === 0 ? 0 : 1));
    });
    S.pts.forEach((pt, k) => pop(pt, t, CUM_T(k) + 0.4, slotX(k), yPct(CUM[k]), 0.3));
    S.segs.forEach((sg, k) => {
      if (!sg) return;
      const q = live ? easeInOut(prog(t, CUM_T(k) + 0.25, 0.35)) : 1;
      const x0 = slotX(k - 1), y0 = yPct(CUM[k - 1]);
      sg.setAttribute('x2', x0 + (slotX(k) - x0) * q);
      sg.setAttribute('y2', y0 + (yPct(CUM[k]) - y0) * q);
      sg.setAttribute('opacity', live ? (q > 0 ? 1 : 0) : o);
    });

    // Lecture
    S.l80.setAttribute('opacity', live ? clamp(prog(t, T.read, 0.3)) : o);
    rise(S.read, t, T.read + 0.3, 0.4);
    pop(S.box, t, T.box, 788, 448);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
