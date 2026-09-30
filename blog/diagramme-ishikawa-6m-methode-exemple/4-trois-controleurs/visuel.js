// Blog · Diagramme d'Ishikawa · section « Un diagramme d'Ishikawa rempli », paragraphe sur la branche Mesure
// Mécanique : la vérification de la branche Mesure. Trois contrôleurs mesurent les trois mêmes pièces sans se concerter ;
// les verdicts tombent un à un, le chrono tourne (vingt minutes). Même pièce, verdicts différents : le problème est
// dans le jugement. Sur le diagramme, la branche Mesure s'allume, les cinq autres deviennent inutiles à explorer.
// Hypothèse : la grille de verdicts est illustrative (l'article dit seulement « si les trois verdicts diffèrent »).
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const COLX = [370, 520, 670];
  const ROWY = [382, 490, 598];
  const VERDICTS = [[1, 0, 1], [1, 1, 0], [0, 0, 1]];  // 1 = bonne, 0 = rebut
  const CELL_T = (r, c) => 3.2 + 1.55 * r + 0.42 * c;
  const CHRONO = { t0: 3.0, t1: 7.9 };
  const COL_T = c => 8.2 + 0.3 * c;
  const MES_T = 9.7, DIM_T = 10.1, CONC_T = 10.9;
  const CHUTE_T = 12.2;
  const FAMS = ['Main d’œuvre', 'Matière', 'Matériel', 'Méthode', 'Milieu', 'Mesure'];
  const S = {};

  function person(parent, cx, floor, color) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 44, r: 11, fill: color }, g);
    el('path', { d: `M ${cx - 19} ${floor} L ${cx - 19} ${floor - 16} Q ${cx - 19} ${floor - 31} ${cx} ${floor - 31} Q ${cx + 19} ${floor - 31} ${cx + 19} ${floor - 16} L ${cx + 19} ${floor} Z`, fill: color }, g);
    return g;
  }
  function piece(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx - 34} ${cy - 20} L ${cx + 22} ${cy - 20} L ${cx + 34} ${cy - 8} L ${cx + 34} ${cy + 20} L ${cx - 34} ${cy + 20} Z`, fill: C.lightBlue, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    el('circle', { cx: cx - 6, cy, r: 9, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, g);
    return g;
  }
  function verdict(parent, cx, cy, ok) {
    const g = el('g', {}, parent);
    const p = G.pill(g, cx, cy, ok ? 'Bonne' : 'Rebut', { size: 18, h: 38, pad: 14, bg: ok ? C.pGreen : C.pRed, fg: ok ? C.tGreen : C.tRed, icon: ok ? 'check' : 'cross', anchor: 'middle' });
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Et si c’était', `la mesure${NB}?`);
    G.blogChapeau('Trois contrôleurs mesurent les trois mêmes pièces, sans concertation.');
    G.card(40, 176, 1120, 584);

    // Chrono
    S.chrono = el('g');
    el('circle', { cx: 150, cy: 262, r: 30, fill: C.white, stroke: C.blue, 'stroke-width': 3.5 }, S.chrono);
    el('rect', { x: 144, y: 222, width: 12, height: 8, rx: 2, fill: C.blue }, S.chrono);
    S.sweep = el('path', { d: '', fill: C.lightBlue, 'fill-opacity': 0.45 }, S.chrono);
    S.hand = el('line', { x1: 150, y1: 262, x2: 150, y2: 238, stroke: C.blue, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, S.chrono);
    el('circle', { cx: 150, cy: 262, r: 4, fill: C.blue }, S.chrono);
    text(S.chrono, 194, 256, 'Vingt', { size: 18, weight: 700, fill: C.blue });
    text(S.chrono, 194, 278, 'minutes', { size: 18, weight: 700, fill: C.blue });

    // Pièces
    S.pieces = COLX.map((x, c) => {
      const g = el('g'), inner = el('g', {}, g);
      piece(inner, x, 256);
      text(g, x, 304, `Pièce ${c + 1}`, { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
      return { g, inner, x };
    });
    // Contrôleurs : bandeau de rangée (actif pendant la mesure)
    S.rows = ROWY.map((y, r) => {
      const band = el('rect', { x: 58, y: y - 44, width: 704, height: 88, rx: 16, fill: C.pLav, opacity: 0 });
      const g = el('g');
      person(g, 92, y + 24, C.blue);
      text(g, 124, y + 7, `Contrôleur ${'ABC'[r]}`, { size: 19, weight: 700, fill: C.ink });
      return { band, g, y };
    });
    // Verdicts
    S.cells = ROWY.map((y, r) => COLX.map((x, c) => ({ g: verdict(G.svg, x, y, VERDICTS[r][c]), x, y, r, c })));
    // Colonnes : même pièce, verdicts différents
    S.cols = COLX.map((x, c) => {
      const g = el('g');
      el('rect', { x: x - 66, y: 330, width: 132, height: 318, rx: 18, fill: 'none', stroke: C.red, 'stroke-width': 3, 'stroke-dasharray': '9 6' }, g);
      return { g, x };
    });
    S.colLab = el('g');
    const cl = text(S.colLab, 520, 690, 'Même pièce, verdicts différents', { size: 20, weight: 700, fill: C.tRed, anchor: 'middle' });
    fit(cl, 760, 'légende colonnes', 280);
    text(S.colLab, 520, 718, 'le rebut dépend de qui mesure', { size: 18, weight: 500, fill: C.tRed, anchor: 'middle' });

    // Panneau : ce que ça change sur le diagramme
    el('rect', { x: 790, y: 196, width: 350, height: 544, rx: 20, fill: C.pLav, opacity: 0.6 });
    S.panelHead = el('g');
    text(S.panelHead, 965, 234, 'Sur le diagramme', { size: 20, weight: 700, fill: C.ink, anchor: 'middle' });
    S.fams = FAMS.map((f, i) => {
      const g = el('g');
      const y = 282 + i * 52;
      const p = G.pill(g, 965, y, f, { size: 18, h: 38, bg: C.white, fg: C.blue, anchor: 'middle' });
      const strike = el('line', { x1: 965 - p.w / 2 + 10, y1: y, x2: 965 + p.w / 2 - 10, y2: y, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0 }, g);
      return { g, p, strike, y, mes: i === 5 };
    });
    S.conc = el('g');
    text(S.conc, 965, 622, 'Le problème est', { size: 19, weight: 700, fill: C.tRed, anchor: 'middle' });
    text(S.conc, 965, 648, 'dans le jugement,', { size: 19, weight: 700, fill: C.tRed, anchor: 'middle' });
    text(S.conc, 965, 674, 'pas dans la production.', { size: 19, weight: 700, fill: C.tRed, anchor: 'middle' });
    text(S.conc, 965, 714, 'Les cinq autres branches :', { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });
    text(S.conc, 965, 734, 'inutiles à explorer.', { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });

    S.chute = G.blogChute('Le problème n’est pas dans la production, il est dans le jugement.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    pop(S.chrono, t, 1.8, 170, 262);
    S.pieces.forEach((p, c) => pop(p.g, t, 1.9 + 0.1 * c, p.x, 270));
    S.rows.forEach((r, i) => {
      pop(r.g, t, 2.2 + 0.1 * i, 140, r.y);
      // Rangée active pendant la mesure de ce contrôleur
      const a = live ? window01(t, CELL_T(i, 0) - 0.3, CELL_T(i, 2) + 0.55, 0.2) : 0;
      r.band.setAttribute('opacity', a);
    });
    pop(S.panelHead, t, 2.5, 965, 234);
    // Chrono : secteur qui se remplit pendant la mesure
    const q = live ? prog(t, CHRONO.t0, CHRONO.t1 - CHRONO.t0) : 1;
    const ang = 2 * Math.PI * Math.min(q, 0.9999);
    const hx = 150 + 24 * Math.sin(ang), hy = 262 - 24 * Math.cos(ang);
    S.hand.setAttribute('x2', hx); S.hand.setAttribute('y2', hy);
    S.sweep.setAttribute('d', q <= 0 ? '' : `M 150 262 L 150 238 A 24 24 0 ${ang > Math.PI ? 1 : 0} 1 ${hx} ${hy} Z`);

    // Verdicts : la pièce mesurée pulse, le verdict tombe
    S.cells.flat().forEach(cl => {
      const t0 = CELL_T(cl.r, cl.c);
      pop(cl.g, t, t0, cl.x, cl.y);
    });
    S.pieces.forEach((p, c) => {
      const times = [0, 1, 2].map(r => CELL_T(r, c) - 0.25).filter(a => live && a <= t);
      pulse(p.inner, t, Math.max(-9, ...times), p.x, 256, 0.12, 0.3);
    });

    // Colonnes en désaccord
    S.cols.forEach((cl, c) => pop(cl.g, t, COL_T(c), cl.x, 490));
    rise(S.colLab, t, COL_T(2) + 0.3, 0.4);

    // Diagramme : Mesure s'allume, les cinq autres s'éteignent
    S.fams.forEach((f, i) => {
      pop(f.g, t, 2.6 + 0.07 * i, 965, f.y);
      const rect = f.p.g.querySelector('rect');
      if (f.mes) {
        const on = !live || t >= MES_T;
        rect.setAttribute('fill', on ? C.red : C.white);
        f.p.tx.setAttribute('fill', on ? C.white : C.blue);
        if (live && t >= MES_T - 0.1) pulse(f.g, t, MES_T, 965, f.y, 0.14, 0.45);
      } else {
        const d = live ? clamp(prog(t, DIM_T + 0.08 * i, 0.3)) : 1;
        if (live && t >= 2.6 + 0.07 * i + 0.35) f.g.setAttribute('opacity', 1 - 0.6 * d);
        else if (!live) f.g.setAttribute('opacity', o * 0.4);
        f.strike.setAttribute('opacity', d);
      }
    });
    rise(S.conc, t, CONC_T, 0.45);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
