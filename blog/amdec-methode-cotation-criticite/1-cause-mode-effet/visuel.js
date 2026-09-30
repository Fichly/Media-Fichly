// Blog · AMDEC · section « AMDEC : définition, sigle et norme de référence »
// Mécanique : l'exemple de l'article se déroule dans l'ordre où il se produit. La cause (graissage absent, carter
// pollué) agit sans se voir ; le mode (le roulement se bloque) se constate sur la machine ; l'effet (la ligne s'arrête)
// se subit en aval. Chaque colonne dit ce qu'elle porte : ce qu'on traitera, ce qu'on constate, ce qui donne la gravité.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const COLS = [
    { x: 40, title: 'Cause', ex: 'Absence de graissage, pollution du carter', role: 'ce qu’on traitera', bg: C.pGreen, fg: C.tGreen },
    { x: 420, title: 'Mode de défaillance', ex: 'Le roulement se bloque', role: 'ce qui se constate', bg: C.pLav, fg: C.blue },
    { x: 800, title: 'Effet', ex: 'Arrêt de la ligne, casse d’un organe voisin', role: 'ce qui donne la gravité', bg: C.pRed, fg: C.tRed },
  ];
  const W = 360, SC = 336;                                // largeur des cartes, centre vertical des scènes
  const T = { run: 2.6, drain: 2.9, drainD: 2.2, slow: 5.1, lock: 5.9, stop: 6.0, stopD: 0.7, andon: 6.7, chute: 9.0 };
  const OMEGA = 150;                                      // vitesse du roulement (degrés par seconde)

  const S = {};

  // Angle du roulement : tourne de T.run à T.lock, décélère sur la fin
  function bearingAngle(t) {
    const tt = t < FADE_END ? T.lock : clamp(t, T.run, T.lock);
    const a = tt <= T.slow ? OMEGA * (tt - T.run) : OMEGA * (T.slow - T.run) + OMEGA * (T.lock - T.slow) * (1 - Math.pow(1 - (tt - T.slow) / (T.lock - T.slow), 2)) / 2;
    return a;
  }
  // Position du tapis (px) : avance de T.run à T.stop + T.stopD
  function beltPos(t) {
    const v = 70, tt = t < FADE_END ? T.stop + T.stopD : clamp(t, T.run, T.stop + T.stopD);
    if (tt <= T.stop) return v * (tt - T.run);
    const p = (tt - T.stop) / T.stopD;
    return v * (T.stop - T.run) + v * T.stopD * (p - p * p / 2);
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Cause, mode,', 'effet.');
    G.blogChapeau('Trois colonnes distinctes : les mélanger, c’est ne plus savoir ce que la gravité mesure.');

    COLS.forEach(c => G.card(c.x, 176, W, 576));

    // ----- Scène 1 : le carter, sa graisse qui baisse, les particules qui entrent -----
    const c1 = COLS[0].x + W / 2;
    S.s1 = el('g');
    el('rect', { x: c1 - 100, y: SC - 90, width: 200, height: 170, rx: 18, fill: C.white, stroke: C.ink, 'stroke-width': 4 }, S.s1);
    text(S.s1, c1, SC - 106, 'carter', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
    const gclip = G.clipRect(c1 - 96, SC - 86, 192, 162);
    S.greaseClip = gclip.rect;
    const gg = el('g', { 'clip-path': gclip.url }, S.s1);
    S.grease = el('rect', { x: c1 - 96, y: SC - 20, width: 192, height: 100, rx: 12, fill: C.yellow }, gg);
    S.greaseLab = text(S.s1, c1, SC + 106, '', { size: 17, weight: 700, fill: C.tYellow, anchor: 'middle' });
    // particules de pollution
    const DOTS = [[-60, 20], [-20, -30], [30, 10], [70, -40], [-70, -50], [10, 50], [55, 45], [-35, 60], [80, 20], [-5, -60]];
    S.dots = DOTS.map(([dx, dy], k) => el('circle', { cx: c1 + dx, cy: SC + dy, r: 5, fill: C.ink, opacity: 0 }, S.s1));

    // ----- Scène 2 : le roulement -----
    const c2 = COLS[1].x + W / 2;
    S.s2 = el('g');
    el('circle', { cx: c2, cy: SC, r: 84, fill: 'none', stroke: C.blue, 'stroke-width': 18 }, S.s2);
    S.balls = el('g', {}, S.s2);
    for (let k = 0; k < 9; k++) {
      const a = 2 * Math.PI * k / 9;
      el('circle', { cx: c2 + 59 * Math.cos(a), cy: SC + 59 * Math.sin(a), r: 13, fill: C.lightBlue }, S.balls);
    }
    el('circle', { cx: c2, cy: SC, r: 36, fill: 'none', stroke: C.blue, 'stroke-width': 14 }, S.s2);
    S.inner = el('g', {}, S.s2);
    el('circle', { cx: c2, cy: SC, r: 22, fill: C.ink }, S.inner);
    el('rect', { x: c2 - 4, y: SC - 22, width: 8, height: 14, fill: C.white }, S.inner);
    S.lockMark = el('g');
    G.pill(S.lockMark, c2, SC + 124, 'bloqué', { size: 18, h: 34, bg: C.red, fg: C.white, anchor: 'middle', icon: null });
    S.heat = el('g');
    [-26, 0, 26].forEach(dx => el('path', { d: `M ${c2 + dx} ${SC - 102} q 7 -9 0 -18 q -7 -9 0 -18`, fill: 'none', stroke: C.red, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, S.heat));

    // ----- Scène 3 : la ligne en aval -----
    const c3 = COLS[2].x + W / 2;
    S.s3 = el('g');
    const bx0 = c3 - 150, bx1 = c3 + 110, by = SC + 40;
    el('rect', { x: bx0, y: by, width: bx1 - bx0, height: 20, rx: 10, fill: C.ink, opacity: 0.85 }, S.s3);
    for (let x = bx0 + 14; x < bx1; x += 36) el('circle', { cx: x, cy: by + 10, r: 5, fill: C.white, opacity: 0.6 }, S.s3);
    const cclip = G.clipRect(bx0, by - 80, bx1 - bx0, 80);
    S.cartons = el('g', { 'clip-path': cclip.url }, S.s3);
    S.cartonList = [0, 1, 2, 3].map(k => G.carton(S.cartons, 0, by - 19, 1.1));
    S.belt = { x0: bx0, x1: bx1, gap: 72 };
    // andon
    el('rect', { x: c3 + 136, y: by - 130, width: 8, height: 150, rx: 4, fill: C.ink, opacity: 0.85 }, S.s3);
    S.andon = el('circle', { cx: c3 + 140, cy: by - 140, r: 17, fill: C.green, stroke: C.white, 'stroke-width': 3 }, S.s3);
    S.stopLab = el('g');
    G.pill(S.stopLab, c3 - 20, SC - 70, 'ligne arrêtée', { size: 18, h: 34, bg: C.red, fg: C.white, anchor: 'middle' });

    // ----- Étiquettes des colonnes -----
    S.labs = COLS.map((c, i) => {
      const g = el('g');
      const cx = c.x + W / 2;
      el('line', { x1: c.x + 24, y1: 506, x2: c.x + W - 24, y2: 506, stroke: C.line, 'stroke-width': 2 }, g);
      fit(text(g, cx, 548, c.title, { size: 24, weight: 800, fill: C.blue, anchor: 'middle' }), c.x + W - 10, `titre ${i}`, c.x + 10);
      const pr = G.para(g, cx, 588, c.ex, W - 60, { size: 18, weight: 500, fill: C.ink, anchor: 'middle', lh: 1.3 });
      G.pill(g, cx, 690, c.role, { size: 18, h: 38, bg: c.bg, fg: c.fg, anchor: 'middle' });
      return { g, cx };
    });
    // flèches entre les cartes
    S.arrows = [410, 790].map(x => {
      const g = el('g');
      el('circle', { cx: x, cy: SC, r: 22, fill: C.blue }, g);
      el('path', { d: `M ${x - 7} ${SC - 9} L ${x + 4} ${SC} L ${x - 7} ${SC + 9}`, fill: 'none', stroke: C.white, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      return { g, x };
    });

    S.chute = G.blogChute('Une cause explique, un mode se constate, un effet se subit.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    [S.s1, S.s2, S.s3].forEach((g, i) => g.setAttribute('opacity', live ? clamp(prog(t, 1.75 + 0.2 * i, 0.35)) : o));
    const EV = [T.drain + T.drainD, T.lock, T.andon];
    S.labs.forEach((l, i) => {
      pop(l.g, t, 2.0 + 0.2 * i, l.cx, 620);
      if (live && t >= EV[i] - 0.05 && t < EV[i] + 0.8) pulse(l.g, t, EV[i], l.cx, 620, 0.06, 0.45);
    });

    // Cause : la graisse baisse, les particules entrent
    const dr = live ? easeInOut(prog(t, T.drain, T.drainD)) : 1;
    const gy = SC - 20 + 90 * dr;
    S.grease.setAttribute('y', gy);
    S.greaseLab.textContent = dr < 0.98 ? 'graisse' : 'plus de graisse';
    S.greaseLab.setAttribute('fill', dr < 0.98 ? C.tYellow : C.tRed);
    S.dots.forEach((d, k) => d.setAttribute('opacity', live ? 0.75 * clamp(prog(t, T.drain + 0.2 * k, 0.3)) : 0.75));

    // Mode : le roulement tourne, ralentit, se bloque
    const c2 = COLS[1].x + W / 2;
    const a = bearingAngle(t);
    S.balls.setAttribute('transform', `rotate(${(a * 0.4) % 360} ${c2} ${SC})`);
    S.inner.setAttribute('transform', `rotate(${a % 360} ${c2} ${SC})`);
    pop(S.lockMark, t, T.lock, c2, SC + 124);
    S.heat.setAttribute('opacity', live ? clamp(prog(t, T.lock - 0.3, 0.4)) : o);
    if (live && t >= T.lock && t < T.lock + 0.7) pulse(S.arrows[0].g, t, T.lock, S.arrows[0].x, SC, 0.2, 0.4);

    // Effet : le tapis s'arrête, l'andon passe au rouge
    const pos = beltPos(t);
    S.cartonList.forEach((cg, k) => {
      const span = S.belt.x1 - S.belt.x0 + 40;
      const x = S.belt.x0 - 20 + ((k * S.belt.gap + pos) % span);
      cg.setAttribute('transform', `translate(${x} ${SC + 40 - 19})`);
    });
    const red = live ? t >= T.andon : true;
    S.andon.setAttribute('fill', red ? C.red : C.green);
    pop(S.stopLab, t, T.andon, COLS[2].x + W / 2 - 20, SC - 70);
    if (live && t >= T.andon && t < T.andon + 0.7) pulse(S.arrows[1].g, t, T.andon, S.arrows[1].x, SC, 0.2, 0.4);
    S.arrows.forEach((ar, i) => ar.g.setAttribute('opacity', live ? clamp(prog(t, 2.4 + 0.15 * i, 0.3)) : o));

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
