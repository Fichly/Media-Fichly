// Blog · Responsable amélioration continue · section « Comment devenir responsable amélioration continue ? »
// Mécanique : en haut, le parcours type se remplit étape par étape jusqu'au poste. En bas, un curseur d'expérience
// avance sur les années et fait apparaître la fourchette de salaire de chaque niveau (début, confirmé, senior),
// autour de la médiane nationale ; puis les trois leviers qui la font monter.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const S = {};

  const STEPS = [
    { t: 'Base industrielle', s: 'Technicien méthodes, ingénieur process, chef d’équipe' },
    { t: '3 à 5 ans de projets', s: 'Gestion de projet, chantiers d’amélioration' },
    { t: 'Certification Lean', s: 'Green Belt, puis éventuellement Black Belt' },
    { t: 'Un projet visible', s: 'Chiffré : productivité, taux de rebut' },
  ];
  const CH = { x0: 60, w: 204, gap: 10, y: 244, h: 76, tip: 18 };
  const DEST = { x: CH.x0 + 4 * (CH.w + CH.gap), w: 1118 - (CH.x0 + 4 * (CH.w + CH.gap)) };
  const PATH = { t0: 2.5, t1: 6.3 };
  // Graphique des salaires
  const GX = { x0: 150, x1: 770 }, YR = 12;
  const X = y => GX.x0 + (GX.x1 - GX.x0) * y / YR;
  const Y = k => 704 - (k - 35) * 3.7;
  const LEVELS = [
    { y0: 0, y1: 3, lo: 38, hi: 45, name: 'Début (0-2 ans)', range: '38 000 à 45 000 €' },
    { y0: 3, y1: 8, lo: 45, hi: 60, name: 'Confirmé (3-7 ans)', range: '45 000 à 60 000 €' },
    { y0: 8, y1: 12, lo: 60, hi: 85, name: 'Senior (8 ans et plus)', range: '60 000 à 85 000 € et plus' },
  ];
  const EXP = { t0: 7.2, t1: 10.8 };
  const LEVERS = ['Île-de-France : 10 à 20 % au-dessus de la moyenne', 'Secteurs sous tension : pharmacie, luxe, e-commerce', 'Certifications Lean Six Sigma'];
  const LEVER_T = k => 11.2 + 0.3 * k, CHUTE_T = 12.4;

  function chevron(parent, x, y, w, h, fill, first) {
    const n = CH.tip;
    const d = `M ${x} ${y} L ${x + w - n} ${y} L ${x + w} ${y + h / 2} L ${x + w - n} ${y + h} L ${x} ${y + h} ${first ? '' : `L ${x + n} ${y + h / 2}`} Z`;
    return el('path', { d, fill, 'stroke-linejoin': 'round' }, parent);
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Un poste', 'qui se gagne.');
    G.blogChapeau('Le parcours type, puis le salaire brut annuel indicatif selon l’expérience.');

    // ---------- Parcours ----------
    G.card(40, 176, 1120, 236);
    text(G.svg, 64, 214, 'Le parcours type', { size: 19, weight: 700, fill: C.blue });
    S.path = el('g');
    const base = el('g', {}, S.path);
    const clip = G.clipRect(CH.x0, CH.y - 2, 0, CH.h + 4);
    S.pathClip = clip.rect;
    const done = el('g', { 'clip-path': clip.url }, S.path);
    STEPS.forEach((s, i) => {
      const x = CH.x0 + i * (CH.w + CH.gap);
      chevron(base, x, CH.y, CH.w, CH.h, C.pLav, i === 0);
      chevron(done, x, CH.y, CH.w, CH.h, C.blue, i === 0);
      const cx = x + CH.w / 2 + (i === 0 ? -4 : 3);
      fit(text(base, cx, CH.y + 44, s.t, { size: 16.5, weight: 700, fill: C.blue, anchor: 'middle' }), x + CH.w - 12, `étape ${i}`);
      text(done, cx, CH.y + 44, s.t, { size: 16.5, weight: 700, fill: C.white, anchor: 'middle' });
      G.para(S.path, x + 8, CH.y + CH.h + 28, s.s, CH.w - 16, { size: 15, weight: 500, fill: C.ink, lh: 1.25 });
    });
    S.dest = el('g');
    el('rect', { x: DEST.x + 6, y: CH.y, width: DEST.w - 6, height: CH.h, rx: 16, fill: C.green }, S.dest);
    G.para(S.dest, DEST.x + 6 + (DEST.w - 6) / 2, CH.y + 31, 'Responsable amélioration continue', DEST.w - 24, { size: 16.5, weight: 800, fill: C.white, anchor: 'middle', lh: 1.15 });
    text(S.dest, DEST.x + 10, CH.y + CH.h + 28, 'Rarement en sortie d’école', { size: 15, weight: 600, fill: C.tGreen });

    // ---------- Salaire ----------
    G.card(40, 428, 1120, 318);
    text(G.svg, 64, 464, 'Salaire brut annuel indicatif selon l’expérience', { size: 19, weight: 700, fill: C.blue });
    S.axes = el('g');
    [40, 50, 60, 70, 80].forEach(k => {
      el('line', { x1: GX.x0, y1: Y(k), x2: GX.x1, y2: Y(k), stroke: C.line, 'stroke-width': 1.5 }, S.axes);
      text(S.axes, GX.x0 - 10, Y(k) + 5, `${k} 000 €`, { size: 15, weight: 500, fill: C.ink, anchor: 'end' });
    });
    el('line', { x1: GX.x0, y1: Y(35), x2: GX.x1, y2: Y(35), stroke: C.ink, 'stroke-width': 2.5 }, S.axes);
    S.bands = LEVELS.map((L, i) => {
      const g = el('g');
      const x0 = X(L.y0) + 3, x1 = X(L.y1) - 3;
      const c = G.clipRect(x0, Y(90), 0, Y(35) - Y(90));
      const inner = el('g', { 'clip-path': c.url }, g);
      el('rect', { x: x0, y: Y(L.hi), width: x1 - x0, height: Y(L.lo) - Y(L.hi), rx: 8, fill: C.teal, opacity: 0.35 + 0.2 * i }, inner);
      if (i === 2) G.arrow(inner, `M ${(x0 + x1) / 2} ${Y(L.hi) + 26} L ${(x0 + x1) / 2} ${Y(L.hi) - 8}`, { width: 3, head: 8, stroke: C.white });
      text(g, (x0 + x1) / 2, Y(35) + 22, L.name, { size: 15, weight: 600, fill: C.ink, anchor: 'middle' });
      const lab = el('g');
      const lt = text(lab, (x0 + x1) / 2, Y(L.hi) - 10, L.range, { size: 15, weight: 700, fill: C.ink, anchor: 'middle' });
      if (i === 2) lt.setAttribute('y', Y(L.hi) - 14);
      if (i === 0) lt.setAttribute('y', (Y(L.lo) + Y(L.hi)) / 2 + 5);
      return { g, clip: c.rect, x0, x1, lab, cx: (x0 + x1) / 2 };
    });
    // Médiane nationale
    S.median = el('g');
    el('line', { x1: GX.x0, y1: Y(50), x2: GX.x1 + 6, y2: Y(50), stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, S.median);
    text(S.median, GX.x1 + 12, Y(50) - 4, 'médiane', { size: 15, weight: 700, fill: C.blue });
    text(S.median, GX.x1 + 12, Y(50) + 14, '50 000 €', { size: 15, weight: 700, fill: C.blue });
    // Curseur d'expérience
    S.cursor = el('g');
    el('line', { x1: 0, y1: Y(88), x2: 0, y2: Y(35), stroke: C.blue, 'stroke-width': 2.5 }, S.cursor);
    el('circle', { cx: 0, cy: Y(35), r: 6, fill: C.blue }, S.cursor);
    // Leviers
    S.leverHead = el('g');
    text(S.leverHead, 872, 508, 'Ce qui fait monter le salaire', { size: 17, weight: 700, fill: C.ink });
    S.levers = LEVERS.map((s, k) => {
      const g = el('g');
      const y = 548 + 62 * k;
      G.check(g, 884, y, 12);
      G.para(g, 906, y - 2, s, 236, { size: 15, weight: 600, fill: C.ink, lh: 1.25 });
      return { g, y };
    });

    S.chute = G.blogChute('Un chantier réussi et chiffré vaut tous les diplômes en entretien.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    rise(S.path, t, 1.75, 0.4, 10);
    // La progression remplit le parcours étape par étape
    const total = 4 * (CH.w + CH.gap);
    const q = live ? easeInOut(prog(t, PATH.t0, PATH.t1 - PATH.t0)) : 1;
    S.pathClip.setAttribute('width', Math.max(0.001, total * q));
    pop(S.dest, t, PATH.t1 + 0.1, DEST.x + DEST.w / 2, CH.y + CH.h / 2, 0.4);

    rise(S.axes, t, 1.9, 0.4, 8);
    const yr = live ? YR * prog(t, EXP.t0, EXP.t1 - EXP.t0) : YR;
    S.bands.forEach((b, i) => {
      b.clip.setAttribute('width', Math.max(0.001, clamp(X(yr) - b.x0, 0, b.x1 - b.x0)));
      rise(b.g, t, 2.0 + 0.1 * i, 0.35, 6);
      const tEnd = EXP.t0 + (EXP.t1 - EXP.t0) * LEVELS[i].y1 / YR;
      pop(b.lab, t, tEnd - 0.1, b.cx, i === 0 ? (Y(LEVELS[i].lo) + Y(LEVELS[i].hi)) / 2 : Y(LEVELS[i].hi) - 14, 0.3);
    });
    rise(S.median, t, EXP.t0 - 0.4, 0.4, 0);
    S.cursor.setAttribute('transform', `translate(${X(yr)} 0)`);
    S.cursor.setAttribute('opacity', live && t > EXP.t0 - 0.3 ? Math.min(1, 1 - clamp(prog(t, EXP.t1 + 0.1, 0.3))) : 0);
    rise(S.leverHead, t, LEVER_T(0) - 0.2, 0.35, 8);
    S.levers.forEach((l, k) => rise(l.g, t, LEVER_T(k), 0.35, 8));
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
