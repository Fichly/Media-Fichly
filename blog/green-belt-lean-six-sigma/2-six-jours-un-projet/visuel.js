// Blog · Green Belt Lean Six Sigma · section « Le programme et le déroulé de la formation Green Belt »
// Mécanique : un curseur de temps traverse plusieurs semaines. Les six jours de formation s'allument par blocs
// (3 jours, 2 jours, 1 jour) ; entre les blocs, c'est le projet mené dans l'entreprise qui avance, étape DMAIC par
// étape. Au jour 6, ce projet part devant le jury : pas de QCM, une soutenance.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const S = {};

  const X = u => 92 + 100 * u;
  const DAY = 0.8;
  const BLOCKS = [{ u: 0, n: 3, s: 'Poser les bases' }, { u: 5.0, n: 2, s: 'Approfondir' }, { u: 9.6, n: 1, s: 'Certification' }];
  const GAPS = [[2.4, 5.0], [6.6, 9.6]];
  const DMAIC = [{ l: 'D', s: 'Définir', u: 3.0 }, { l: 'M', s: 'Mesurer', u: 4.3 }, { l: 'A', s: 'Analyser', u: 7.1 }, { l: 'I', s: 'Améliorer', u: 8.0 }, { l: 'C', s: 'Contrôler', u: 8.9 }];
  const L1 = { y: 224, h: 150 }, L2 = { y: 390, h: 170 }, L3 = { y: 576, h: 168 };
  const TRACK_Y = 476;
  const RUN = { t0: 2.6, t1: 10.4, u1: 10.4 };
  const uAt = t => RUN.u1 * prog(t, RUN.t0, RUN.t1 - RUN.t0);
  const tAt = u => RUN.t0 + (RUN.t1 - RUN.t0) * u / RUN.u1;
  const DOC = { from: { x: 1098, y: TRACK_Y }, to: { x: 842, y: L3.y + 86 }, t: tAt(9.7), d: 0.7 };
  const JURY_T = DOC.t + DOC.d + 0.2, CHUTE_T = 11.9;

  function person(parent, x, y, body = C.lightBlue) {
    el('circle', { cx: x, cy: y - 16, r: 9, fill: body }, parent);
    el('rect', { x: x - 13, y: y - 4, width: 26, height: 24, rx: 9, fill: body }, parent);
  }
  function docIcon(parent) {
    el('path', { d: 'M -18 -24 L 8 -24 L 18 -14 L 18 24 L -18 24 Z', fill: C.white, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, parent);
    [0, 1, 2].forEach(r => el('line', { x1: -10, y1: -10 + r * 9, x2: 10, y2: -10 + r * 9, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, parent));
    el('rect', { x: -10, y: 14, width: 20, height: 5, rx: 2, fill: C.green }, parent);
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Six jours,', 'un vrai projet.');
    G.blogChapeau('42 heures réparties sur plusieurs semaines : le projet avance entre les sessions.');

    S.axis = el('g');
    G.arrow(S.axis, `M ${X(0) - 30} 204 L ${X(10.4) + 24} 204`, { width: 2.5, head: 8, stroke: C.ink });
    text(S.axis, X(0) - 30, 194, 'plusieurs semaines entre le jour 1 et la certification', { size: 15, weight: 600, fill: C.ink });

    // ---------- En formation ----------
    G.card(40, L1.y, 1120, L1.h);
    S.l1Title = el('g');
    text(S.l1Title, 64, L1.y + 32, 'En formation : 6 jours (42 h)', { size: 18, weight: 700, fill: C.blue });
    S.days = [];
    S.blockLabels = BLOCKS.map((b, k) => {
      for (let d = 0; d < b.n; d++) {
        const u = b.u + d * DAY, x = X(u) + 3, w = 100 * DAY - 6;
        el('rect', { x, y: L1.y + 52, width: w, height: 46, rx: 10, fill: C.white, stroke: C.line, 'stroke-width': 2 });
        const g = el('g');
        el('rect', { x, y: L1.y + 52, width: w, height: 46, rx: 10, fill: k === 2 ? C.green : C.blue }, g);
        text(g, x + w / 2, L1.y + 81, `J${S.days.length + 1}`, { size: 17, weight: 700, fill: C.white, anchor: 'middle' });
        S.days.push({ g, u, cx: x + w / 2 });
      }
      const g = el('g');
      text(g, (X(b.u) + X(b.u + b.n * DAY)) / 2, L1.y + 126, b.s, { size: 16, weight: 700, fill: C.ink, anchor: k === 2 ? 'end' : 'middle' }).setAttribute('x', k === 2 ? X(b.u + DAY) : (X(b.u) + X(b.u + b.n * DAY)) / 2);
      return g;
    });

    // ---------- Dans l'entreprise ----------
    G.card(40, L2.y, 1120, L2.h);
    S.l2Title = el('g');
    text(S.l2Title, 64, L2.y + 32, 'Dans votre entreprise : votre projet avance', { size: 18, weight: 700, fill: C.blue });
    S.tracks = GAPS.map(([a, b]) => {
      el('rect', { x: X(a) + 8, y: TRACK_Y - 6, width: X(b) - X(a) - 16, height: 12, rx: 6, fill: C.line });
      const fill = el('rect', { x: X(a) + 8, y: TRACK_Y - 6, width: 0, height: 12, rx: 6, fill: C.teal });
      return { fill, a, b };
    });
    S.pause = el('g');
    [[2.4 - 0.9, 'en formation'], [6.6 - 0.8, 'en formation']].forEach(([u, s]) => text(S.pause, X(u), TRACK_Y + 5, s, { size: 15, weight: 500, fill: C.ink, anchor: 'middle' }).setAttribute('opacity', 0.6));
    S.chips = DMAIC.map(d => {
      const g = el('g');
      el('circle', { cx: X(d.u), cy: TRACK_Y, r: 19, fill: C.teal, stroke: C.white, 'stroke-width': 3 }, g);
      text(g, X(d.u), TRACK_Y + 7, d.l, { size: 19, weight: 800, fill: C.white, anchor: 'middle' });
      text(g, X(d.u), TRACK_Y + 46, d.s, { size: 15, weight: 600, fill: C.ink, anchor: 'middle' });
      return { g, u: d.u };
    });
    // ---------- Jour 6 ----------
    G.card(40, L3.y, 1120, L3.h);
    S.l3 = el('g');
    text(S.l3, 64, L3.y + 40, 'Jour 6 : pas de QCM, une soutenance', { size: 20, weight: 700, fill: C.blue });
    G.para(S.l3, 64, L3.y + 76, 'Vous défendez votre projet devant un jury d’experts : ce que vous avez amélioré, comment, avec quels résultats.', 640, { size: 17, weight: 500, fill: C.ink, lh: 1.35 });
    S.jury = el('g');
    [960, 1010, 1060].forEach(x => person(S.jury, x, L3.y + 96, C.blue));
    el('rect', { x: 930, y: L3.y + 118, width: 160, height: 12, rx: 6, fill: C.ink, opacity: 0.8 }, S.jury);
    text(S.jury, 1010, L3.y + 40, 'Jury', { size: 16, weight: 700, fill: C.ink, anchor: 'middle' });
    S.cert = el('g');
    G.pill(S.cert, 1010, L3.y + 150, 'Certification RS7114', { size: 16, h: 30, pad: 14, bg: C.pGreen, fg: C.tGreen, icon: 'check', anchor: 'middle' });

    S.doc = el('g');
    docIcon(S.doc);

    S.cursor = el('g');
    el('line', { x1: 0, y1: 204, x2: 0, y2: L2.y + L2.h, stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '5 5' }, S.cursor);
    el('circle', { cx: 0, cy: 204, r: 7, fill: C.blue }, S.cursor);

    S.chute = G.blogChute('C’est le projet qui transforme la théorie en compétence.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const u = live ? uAt(t) : RUN.u1;
    rise(S.axis, t, 1.75, 0.35, 6);
    rise(S.l1Title, t, 1.8, 0.35, 8);
    rise(S.l2Title, t, 1.9, 0.35, 8);
    rise(S.l3, t, 2.0, 0.35, 8);

    // Les jours s'allument au passage du curseur
    S.days.forEach(d => pop(d.g, t, tAt(d.u + 0.1), d.cx, L1.y + 75, 0.3));
    S.blockLabels.forEach((g, k) => rise(g, t, tAt(BLOCKS[k].u) + 0.2, 0.35, 6));
    // Entre les sessions, le projet avance
    S.tracks.forEach(tr => {
      const w = X(tr.b) - X(tr.a) - 16;
      tr.fill.setAttribute('width', Math.max(0.001, w * clamp((u - tr.a) / (tr.b - tr.a))));
      tr.fill.setAttribute('opacity', live ? 1 : o);
    });
    S.pause.setAttribute('opacity', o);
    S.chips.forEach(c => pop(c.g, t, tAt(c.u), X(c.u), TRACK_Y, 0.3));
    // Au jour 6, le projet part devant le jury
    let dx = DOC.from.x, dy = DOC.from.y, dop = 0;
    if (live) {
      const q = easeInOut(prog(t, DOC.t, DOC.d));
      dx = DOC.from.x + (DOC.to.x - DOC.from.x) * q;
      dy = DOC.from.y + (DOC.to.y - DOC.from.y) * q - 40 * Math.sin(Math.PI * q);
      dop = clamp(prog(t, tAt(9.0), 0.3));
    } else { dx = DOC.to.x; dy = DOC.to.y; dop = o; }
    S.doc.setAttribute('transform', `translate(${dx} ${dy})`);
    S.doc.setAttribute('opacity', dop);
    rise(S.jury, t, 2.1, 0.35, 8);
    pop(S.cert, t, JURY_T, 1010, L3.y + 150, 0.35);

    S.cursor.setAttribute('transform', `translate(${X(u)} 0)`);
    S.cursor.setAttribute('opacity', live ? Math.min(clamp(prog(t, RUN.t0 - 0.3, 0.3)), 1 - clamp(prog(t, RUN.t1 + 0.1, 0.3))) : 0);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
