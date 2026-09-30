// Blog · Matrice RACI · introduction (« je croyais que c'était l'autre »)
// Mécanique : trois actions sortent de la même réunion. Trois semaines passent (curseur commun).
// Ligne sans A : rien ne bouge, c'est une intention. Ligne à deux A : les deux garants se renvoient la tâche,
// rien ne bouge non plus. Ligne à un seul A : la barre avance jusqu'à « faite ».
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const CELL = { x0: 80, w: 54, gap: 8, h: 48 };
  const CX = k => CELL.x0 + k * (CELL.w + CELL.gap);
  const BAR = { x0: 440, x1: 960, h: 22 };
  const RY = [340, 494, 648];
  const AV = [C.teal, C.violet, C.lightBlue, C.yellow, C.red];
  const ROWS = [
    { n: 'Aucun A', task: 'Relever les faits', cells: ['R', 'C', 'R', 'I', ''], ok: false, why: 'Une ligne sans A est une intention.' },
    { n: 'Deux A', task: 'Modifier le standard', cells: ['A', 'R', 'A', 'C', 'I'], ok: false, why: 'Chacun suppose que l’autre s’en occupe.' },
    { n: 'Un seul A', task: 'Former les équipes', cells: ['R', 'A', 'C', '', 'I'], ok: true, why: 'Une personne en répond : la tâche avance.' },
  ];
  const T0 = 2.9, T1 = 9.6;                  // trois semaines
  const xAt = t => (t < FADE_END ? BAR.x1 : BAR.x0 + (BAR.x1 - BAR.x0) * clamp((t - T0) / (T1 - T0)));
  const END_T = T1 + 0.2;

  function letterCell(parent, x, y, L) {
    const g = el('g', {}, parent);
    const styles = { A: [C.blue, C.white], R: [C.pLav, C.blue], C: [C.white, C.ink], I: [C.white, C.ink], '': [C.white, C.ink] };
    const [bg, fg] = styles[L];
    el('rect', { x, y: y - CELL.h / 2, width: CELL.w, height: CELL.h, rx: 10, fill: bg, stroke: L === 'A' ? C.blue : C.line, 'stroke-width': 2 }, g);
    if (L) text(g, x + CELL.w / 2, y + 9, L, { size: 24, weight: 800, fill: fg, anchor: 'middle' }).setAttribute('opacity', L === 'I' ? 0.55 : 1);
    return g;
  }
  function person(parent, cx, floor, k, fill) {
    el('circle', { cx, cy: floor - 62 * k, r: 14 * k, fill }, parent);
    el('path', { d: `M ${cx - 24 * k} ${floor} L ${cx - 24 * k} ${floor - 22 * k} Q ${cx - 24 * k} ${floor - 42 * k} ${cx} ${floor - 42 * k} Q ${cx + 24 * k} ${floor - 42 * k} ${cx + 24 * k} ${floor - 22 * k} L ${cx + 24 * k} ${floor} Z`, fill }, parent);
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Zéro A, deux A :', 'rien ne bouge.');
    G.blogChapeau('Même réunion, même liste d’actions. Trois semaines plus tard, selon le nombre de A :');

    G.card(40, 176, 1120, 584);
    // En-tête : les cinq participants, les trois semaines
    S.head = el('g');
    AV.forEach((c, k) => person(S.head, CX(k) + CELL.w / 2, 246, 0.62, c));
    text(S.head, BAR.x0, 222, 'Trois semaines', { size: 19, weight: 700, fill: C.ink });
    ['S1', 'S2', 'S3'].forEach((s, i) => text(S.head, BAR.x0 + (i + 0.5) * (BAR.x1 - BAR.x0) / 3, 252, s, { size: 17, weight: 600, fill: C.ink, anchor: 'middle' }));
    for (let i = 1; i < 3; i++) el('line', { x1: BAR.x0 + i * (BAR.x1 - BAR.x0) / 3, y1: 266, x2: BAR.x0 + i * (BAR.x1 - BAR.x0) / 3, y2: 690, stroke: C.line, 'stroke-width': 1.5, 'stroke-dasharray': '3 6' }, S.head);

    S.rows = ROWS.map((r, k) => {
      const y = RY[k];
      const R = { y, ...r };
      R.title = el('g');
      const p = G.pill(R.title, 64, y - 58, r.n, { size: 18, h: 32, bg: r.ok ? C.pGreen : C.pRed, fg: r.ok ? C.tGreen : C.tRed });
      text(R.title, 64 + p.w + 14, y - 51, r.task, { size: 19, weight: 700, fill: C.ink });
      R.cells = r.cells.map((L, i) => ({ L, g: letterCell(G.svg, CX(i), y, L), cx: CX(i) + CELL.w / 2 }));
      // Barre d'avancement
      el('rect', { x: BAR.x0, y: y - BAR.h / 2, width: BAR.x1 - BAR.x0, height: BAR.h, rx: BAR.h / 2, fill: C.pLav });
      R.fill = el('rect', { x: BAR.x0, y: y - BAR.h / 2, width: 0, height: BAR.h, rx: BAR.h / 2, fill: C.green });
      R.out = el('g');
      if (r.ok) G.pill(R.out, 984, y, 'Faite', { size: 19, h: 36, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
      else G.pill(R.out, 984, y, 'Rien', { size: 19, h: 36, bg: C.pRed, fg: C.tRed, icon: 'cross' });
      R.why = text(G.svg, BAR.x0, y + 44, r.why, { size: 19, weight: 600, fill: r.ok ? C.tGreen : C.tRed });
      fit(R.why, 1136, `raison ${k}`);
      return R;
    });
    // Ligne sans A : la case qui manque
    S.missing = el('rect', { x: CX(4) + 3, y: RY[0] - CELL.h / 2 + 3, width: CELL.w - 6, height: CELL.h - 6, rx: 8, fill: 'none', stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' });
    // Deux A : chacun renvoie vers l'autre
    const y2 = RY[1] + CELL.h / 2 + 6;
    S.pingA = G.arrow(G.svg, `M ${CX(0) + CELL.w / 2} ${y2} Q ${(CX(0) + CX(2)) / 2 + CELL.w / 2} ${y2 + 34} ${CX(2) + CELL.w / 2 - 4} ${y2 + 2}`, { stroke: C.red, width: 2.5, head: 8 });
    S.pingB = G.arrow(G.svg, `M ${CX(2) + CELL.w / 2} ${y2} Q ${(CX(0) + CX(2)) / 2 + CELL.w / 2} ${y2 + 34} ${CX(0) + CELL.w / 2 + 4} ${y2 + 2}`, { stroke: C.red, width: 2.5, head: 8 });
    S.bubble = el('g');
    el('rect', { x: BAR.x0, y: RY[1] - 66, width: 350, height: 40, rx: 14, fill: C.white, stroke: C.red, 'stroke-width': 2.5 }, S.bubble);
    fit(text(S.bubble, BAR.x0 + 175, RY[1] - 39, `Je croyais que c’était l’autre.`, { size: 19, weight: 700, fill: C.tRed, anchor: 'middle' }), BAR.x0 + 346, 'bulle', BAR.x0 + 4);

    // Curseur des semaines
    S.cursor = el('line', { x1: 0, y1: 266, x2: 0, y2: 690, stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '2 5', 'stroke-linecap': 'round' });

    S.chute = G.blogChute('Deux garants produisent le même résultat que zéro garant.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    const x = xAt(t);
    pop(S.head, t, 1.7, 600, 240);

    S.rows.forEach((R, k) => {
      rise(R.title, t, 1.9 + 0.25 * k, 0.35);
      R.cells.forEach((c, i) => pop(c.g, t, 2.0 + 0.25 * k + 0.05 * i, c.cx, R.y));
      const w = R.ok ? (x - BAR.x0) : 0;
      R.fill.setAttribute('width', Math.max(0.001, w));
      R.fill.setAttribute('opacity', o0);
      pop(R.out, t, END_T + 0.15 * k, 1030, R.y);
      rise(R.why, t, END_T + 0.4 + 0.2 * k, 0.4);
    });
    // Aucun A : la case vide clignote au passage des semaines
    S.missing.setAttribute('opacity', live ? (t < T0 ? clamp(prog(t, 2.2, 0.3)) : 0.5 + 0.5 * Math.cos(Math.PI * 2 * clamp((t - T0) / (T1 - T0)) * 3)) : o0);
    // Deux A : les deux cases se renvoient la tâche
    const cA = S.rows[1].cells, y1 = S.rows[1].y;
    [0, 2].forEach((i, j) => {
      const c = cA[i];
      if (!live || t < T0 || t >= T1) return;   // pop() a déjà remis l'identité
      const ph = t - (T0 + 0.6 + 0.9 * j);
      const m = ((ph % 1.8) + 1.8) % 1.8;
      const sc = ph >= 0 && m < 0.45 ? 1 + 0.12 * Math.sin(Math.PI * m / 0.45) : 1;
      c.g.setAttribute('transform', sc === 1 ? '' : `translate(${c.cx} ${y1}) scale(${sc}) translate(${-c.cx} ${-y1})`);
    });
    S.pingA.draw(live ? easeInOut(prog(t, T0 + 0.6, 0.6)) : 1);
    S.pingA.g.setAttribute('opacity', o0);
    S.pingB.draw(live ? easeInOut(prog(t, T0 + 1.5, 0.6)) : 1);
    S.pingB.g.setAttribute('opacity', o0);
    pop(S.bubble, t, T0 + 2.6, BAR.x0 + 175, S.rows[1].y - 46);

    S.cursor.setAttribute('transform', `translate(${x} 0)`);
    S.cursor.setAttribute('opacity', live ? G.window01(t, T0 - 0.2, T1 + 0.3, 0.2) : 0);

    rise(S.chute, t, END_T + 1.2, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
