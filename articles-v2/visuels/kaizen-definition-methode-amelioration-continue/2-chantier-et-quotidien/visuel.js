// Visuel 2 · Kaizen (section « Kaizen quotidien ou chantier kaizen : quelle différence ? »)
// Brief : deux courbes sur six mois, chantier seul contre chantier suivi de kaizen quotidien.
// Mécanique : la performance saute pendant le chantier, puis les deux courbes se séparent.
// Chantier seul : le gain s'érode et revient au départ. Avec kaizen quotidien : il tient et monte par petits pas.
// Allure illustrative, sans valeurs chiffrées.
(() => {
  const G = window.Gabarit, A = window.Article;
  const { C, el, text, fit, prog, easeInOut } = G;

  const X0 = 170, X1 = 880, Y0 = 640, Y1 = 250;
  const M0 = -0.8, M1 = 6;
  const x = m => X0 + (m - M0) / (M1 - M0) * (X1 - X0);
  const y = v => Y0 - (v - 90) / (160 - 90) * (Y0 - Y1);
  const smooth = p => p * p * (3 - 2 * p);

  // Niveau commun : départ 100, saut à 130 pendant le chantier (mois 0 → 0,25)
  const jump = m => 100 + 30 * smooth(Math.min(1, Math.max(0, m / 0.25)));
  const alone = m => (m <= 1 ? 130 - 2 * (m - 0.25) / 0.75 : 100 + 28 * Math.exp(-(m - 1) / 1.6));
  const daily = m => 130 + 1.8 * Array.from({ length: 11 }, (_, i) => 0.75 + 0.5 * i)
    .reduce((s, at) => s + smooth(Math.min(1, Math.max(0, (m - at) / 0.1))), 0);

  const path = (f, a, b) => {
    const pts = [];
    for (let m = a; m <= b + 1e-9; m += 0.01) pts.push(`${x(m).toFixed(1)} ${y(f(m)).toFixed(1)}`);
    return 'M ' + pts.join(' L ');
  };

  const DRAW0 = 2.2, DRAW1 = 8.2; // le tracé balaie l'axe des mois
  const mAt = t => M0 + (M1 - M0) * prog(t, DRAW0, DRAW1 - DRAW0);
  const tAt = m => DRAW0 + (m - M0) / (M1 - M0) * (DRAW1 - DRAW0);
  const S = {};

  function build() {
    const root = A.template('Un chantier seul ne tient pas',
      'Le kaizen quotidien empêche le retour en arrière, puis continue d’avancer.');
    S.card = el('g', {}, root);
    G.card(40, 150, 1120, 610, S.card);

    // Axes et repères
    S.axes = el('g', {}, root);
    el('line', { x1: X0, y1: Y0, x2: X1 + 10, y2: Y0, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, S.axes);
    el('line', { x1: X0, y1: Y0, x2: X0, y2: Y1 - 10, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, S.axes);
    const yl = text(S.axes, 0, 0, 'Performance du poste', { size: 19, weight: 600, fill: C.ink, anchor: 'middle' });
    yl.setAttribute('transform', `translate(${X0 - 28} ${(Y0 + Y1) / 2}) rotate(-90)`);
    text(S.axes, x(-0.45), Y0 + 34, 'Avant', { size: 18, weight: 600, fill: C.ink, anchor: 'middle' });
    for (let m = 1; m <= 6; m++) {
      el('line', { x1: x(m), y1: Y0, x2: x(m), y2: Y0 + 8, stroke: C.ink, 'stroke-width': 2 }, S.axes);
      text(S.axes, x(m), Y0 + 34, `Mois ${m}`, { size: 18, weight: 600, fill: C.ink, anchor: 'middle' });
    }
    el('line', { x1: X0, y1: y(100), x2: X1, y2: y(100), stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '6 7', opacity: 0.45 }, S.axes);
    text(S.axes, x(1.15), y(100) + 24, 'Niveau de départ', { size: 16, weight: 600, fill: C.ink }).setAttribute('opacity', 0.7);

    // Bande du chantier (5 jours) et suivi à 30 jours
    S.band = el('g', {}, root);
    el('rect', { x: x(0) - 4, y: Y1 - 10, width: x(0.25) - x(0) + 8, height: Y0 - Y1 + 10, rx: 6, fill: C.pYellow }, S.band);
    G.pill(S.band, x(0.12), Y1 - 42, 'Chantier kaizen, 5 jours', { size: 17, h: 32, bg: C.yellow, fg: C.white, anchor: 'middle' });
    S.follow = el('g', {}, root);
    el('line', { x1: x(1), y1: Y1 + 36, x2: x(1), y2: Y0, stroke: C.blue, 'stroke-width': 2, 'stroke-dasharray': '5 6' }, S.follow);
    G.pill(S.follow, x(1) + 6, Y1 + 18, 'Suivi à 30 jours', { size: 16, h: 30, anchor: 'middle' });

    // Courbes : tronc commun bleu, puis deux branches
    const clip = G.clipRect(0, 0, 0, 860);
    S.clip = clip.rect;
    const curves = el('g', { 'clip-path': clip.url }, root);
    const stroke = (d, color, w = 6) => el('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, curves);
    stroke(path(alone, 0.25, M1), C.red);
    stroke(path(daily, 0.25, M1), C.green);
    stroke(path(jump, M0, 0.25), C.blue);
    S.dot = el('circle', { r: 8, fill: C.blue, stroke: C.white, 'stroke-width': 3 }, root);
    S.dotRed = el('circle', { r: 8, fill: C.red, stroke: C.white, 'stroke-width': 3 }, root);

    // Étiquettes de fin de courbe
    const label = (vy, color, l1, l2) => {
      const g = el('g', {}, root);
      el('circle', { cx: X1 + 30, cy: vy - 7, r: 8, fill: color }, g);
      fit(text(g, X1 + 48, vy, l1, { size: 20, weight: 800, fill: color === C.red ? C.tRed : C.tGreen }), 1145, l1);
      fit(text(g, X1 + 48, vy + 28, l2, { size: 17, weight: 500, fill: C.ink }), 1145, l2);
      return g;
    };
    S.endDaily = label(y(daily(M1)) + 8, C.green, 'Chantier + kaizen', 'quotidien : le gain tient');
    S.endAlone = label(y(alone(M1)) - 16, C.red, 'Chantier seul :', 'retour au départ');

    S.note = text(root, 60, 745, 'Illustration : allure typique, sans valeurs chiffrées.', { size: 15, weight: 500, fill: C.ink });
    S.note.setAttribute('opacity', 0.65);
  }

  function draw(t) {
    const tt = A.T(t);
    A.show(S.card, tt, 1.6, { dy: 0 });
    A.show(S.axes, tt, 1.7);
    A.show(S.band, tt, tAt(-0.1), { scale: true, cx: x(0.12), cy: Y1 - 42 });
    A.show(S.follow, tt, tAt(0.95), { scale: true, cx: x(1), cy: Y1 + 18 });
    const m = tt >= 1e9 ? M1 : mAt(tt);
    S.clip.setAttribute('width', x(m) + 8);
    const v = m < 0.25 ? jump(m) : daily(m);
    S.dot.setAttribute('cx', x(m));
    S.dot.setAttribute('cy', y(v));
    const on = tt >= DRAW0 && tt < DRAW1 + 0.3;
    S.dot.setAttribute('fill', m < 0.25 ? C.blue : C.green);
    S.dot.setAttribute('opacity', on ? 1 : 0);
    S.dotRed.setAttribute('cx', x(m));
    S.dotRed.setAttribute('cy', y(alone(m)));
    S.dotRed.setAttribute('opacity', on && m >= 0.25 ? 1 : 0);
    A.show(S.endDaily, tt, DRAW1 + 0.1, { dx: -16, dy: 0 });
    A.show(S.endAlone, tt, DRAW1 + 0.5, { dx: -16, dy: 0 });
    A.show(S.note, tt, DRAW1 + 0.8, { dy: 0 });
    S.note.setAttribute('opacity', 0.65 * Number(S.note.getAttribute('opacity')));
  }

  A.start({ duration: 12, build, draw });
})();
