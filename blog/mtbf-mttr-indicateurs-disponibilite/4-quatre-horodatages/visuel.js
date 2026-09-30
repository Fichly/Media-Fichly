// Blog · MTBF et MTTR · « Étape 3 : relever quatre heures par arrêt, pas une »
// Mécanique : un arrêt de 40 minutes se déroule. Relevé d'un seul bloc, il ne dit rien. Les quatre horodatages
// (arrêt, appel, prise en charge, remise en service) le découpent en trois morceaux : détection et appel, attente,
// intervention. Les morceaux se rangent côte à côte : l'intervention, premier réflexe d'action, est le plus petit.
// Hypothèse : découpage illustratif 13 / 17 / 10 min et heures 10 h 12 à 10 h 52 ; total 40 min = MTTR du cas de référence.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const X0 = 100, PXM = 25, BY = 330, BH = 44;
  const xm = m => X0 + m * PXM;
  const STAMPS = [
    { m: 0, name: 'Arrêt', time: `10${NB}h${NB}12`, anchor: 'start' },
    { m: 13, name: 'Appel', time: `10${NB}h${NB}25`, anchor: 'middle' },
    { m: 30, name: 'Prise en charge', time: `10${NB}h${NB}42`, anchor: 'end' },
    { m: 40, name: 'Remise en service', time: `10${NB}h${NB}52`, anchor: 'end' },
  ];
  const PIECES = [
    { a: 0, d: 13, name: 'Détection et appel', fill: C.yellow, fg: C.tYellow },
    { a: 13, d: 17, name: 'Attente', fill: C.red, fg: C.tRed, hint: 'technicien, pièce' },
    { a: 30, d: 10, name: 'Intervention', fill: C.blue, fg: C.blue },
  ];
  const CUR0 = 2.2, CUR1 = 6.2;
  const tOf = m => CUR0 + (CUR1 - CUR0) * m / 40;

  function build() {
    G.templateBlog();
    G.blogTitle('Quatre heures,', 'pas une.');
    G.blogChapeau('Un arrêt de 40 minutes relevé avec quatre horodatages au lieu d’une seule durée.');

    // ----- Carte 1 : l'arrêt et ses quatre horodatages -----
    G.card(40, 176, 1120, 296);
    S.track = el('rect', { x: X0, y: BY, width: 40 * PXM, height: BH, rx: 8, fill: C.pLav });
    const clip = G.clipRect(X0, BY, 0, BH);
    S.clip = clip.rect;
    S.fill = el('g', { 'clip-path': clip.url });
    S.grey = el('rect', { x: X0, y: BY, width: 40 * PXM, height: BH, fill: '#a9a9c6' }, S.fill);
    S.pieces = PIECES.map(p => el('rect', { x: xm(p.a), y: BY, width: p.d * PXM, height: BH, fill: p.fill }, S.fill));
    el('rect', { x: X0, y: BY, width: 40 * PXM, height: BH, rx: 8, fill: 'none', stroke: C.card, 'stroke-width': 5 }, S.fill);
    S.pLab = PIECES.map(p => text(G.svg, xm(p.a + p.d / 2), BY + 29, `${p.d}${NB}min`, { size: 19, weight: 700, fill: C.white, anchor: 'middle' }));
    S.greyLab = text(G.svg, xm(20), BY + 29, `arrêt : 40${NB}min`, { size: 19, weight: 700, fill: C.white, anchor: 'middle' });
    S.axis = el('g');
    for (let m = 0; m <= 40; m += 10) {
      el('line', { x1: xm(m), y1: BY + BH + 4, x2: xm(m), y2: BY + BH + 11, stroke: '#b9b9d0', 'stroke-width': 2 }, S.axis);
      text(S.axis, xm(m), BY + BH + 31, `${m}${NB}min`, { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });
    }
    S.cursor = el('line', { y1: BY - 10, y2: BY + BH + 10, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' });

    S.stamps = STAMPS.map(s => {
      const g = el('g');
      const x = xm(s.m);
      el('line', { x1: x, y1: 272, x2: x, y2: BY + BH, stroke: C.ink, 'stroke-width': 3 }, g);
      el('circle', { cx: x, cy: 272, r: 6, fill: C.ink }, g);
      const lx = s.anchor === 'start' ? x - 6 : s.anchor === 'end' ? x + 6 : x;
      text(g, lx, 232, s.name, { size: 19, weight: 700, fill: C.ink, anchor: s.anchor });
      text(g, lx, 256, s.time, { size: 18, weight: 500, fill: C.ink, anchor: s.anchor });
      return { g, x };
    });
    S.cap0 = text(G.svg, 70, 446, 'Une seule durée relevée : 40 min, et aucun diagnostic possible.', { size: 20, weight: 700, fill: C.tRed });
    S.cap1 = text(G.svg, 70, 446, 'Quatre horodatages : trois morceaux, trois causes différentes.', { size: 20, weight: 700, fill: C.blue });

    // ----- Carte 2 : les trois morceaux côte à côte -----
    G.card(40, 488, 1120, 272);
    S.rows = PIECES.map((p, i) => {
      const y = 536 + i * 58;
      const g = el('g');
      text(g, 70, y + 26, p.name, { size: 21, weight: 700, fill: p.fg });
      const bar = el('rect', { x: 330, y, width: p.d * PXM, height: 38, rx: 8, fill: p.fill });
      const v = text(G.svg, 330 + p.d * PXM + 14, y + 27, `${p.d}${NB}min` + (p.hint ? `  ·  ${p.hint}${NB}?` : ''), { size: 19, weight: 700, fill: p.fg });
      fit(v, 1140, `valeur ${i}`);
      return { g, bar, v, y, w: p.d * PXM };
    });
    S.small = el('g');
    const sp = G.pill(S.small, 330 + 10 * PXM + 110, 671, 'le plus petit des trois', { size: 18, h: 34, bg: C.pLav, fg: C.blue });
    S.smallC = 330 + 10 * PXM + 110 + sp.w / 2;
    S.note = text(G.svg, 70, 738, 'Agir dessus est pourtant le premier réflexe.', { size: 21, weight: 700, fill: C.tRed });

    S.chute = G.blogChute('Une durée totale seule ne permet aucun diagnostic.', { y: 812 });
  }

  // ---------- Chronologie ----------
  const SPLIT = 7.0, SPLIT_D = 0.9;
  const ROW_T = [8.3, 8.8, 9.3], SMALL_T = 10.2, NOTE_T = 10.8, CHUTE_T = 12.0;

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const m = t < FADE_END ? 40 : 40 * clamp((t - CUR0) / (CUR1 - CUR0));

    S.track.setAttribute('opacity', o * (live ? clamp(prog(t, 1.8, 0.3)) : 1));
    S.axis.setAttribute('opacity', o * (live ? clamp(prog(t, 1.9, 0.3)) : 1));
    S.clip.setAttribute('width', Math.max(0.001, m * PXM));
    S.fill.setAttribute('opacity', o);
    const running = live && t >= CUR0 - 0.1 && t < CUR1 + 0.3;
    S.cursor.setAttribute('x1', xm(m));
    S.cursor.setAttribute('x2', xm(m));
    S.cursor.setAttribute('opacity', running ? 1 : 0);
    S.stamps.forEach((s, i) => pop(s.g, t, tOf(STAMPS[i].m) - 0.05, s.x, 300));

    // Découpage : les morceaux se colorent de gauche à droite
    S.pieces.forEach((r, i) => {
      const p = live ? prog(t, SPLIT + 0.3 * i, 0.3) : 1;
      r.setAttribute('opacity', p);
      S.pLab[i].setAttribute('opacity', o * (live ? clamp(prog(t, SPLIT + 0.3 * i + 0.2, 0.3)) : 1));
    });
    S.greyLab.setAttribute('opacity', live ? clamp(prog(t, CUR1, 0.3)) * (1 - clamp(prog(t, SPLIT, 0.3))) : 0);
    S.cap0.setAttribute('opacity', live ? clamp(prog(t, CUR1 + 0.1, 0.3)) * (1 - clamp(prog(t, SPLIT, 0.3))) : 0);
    S.cap1.setAttribute('opacity', o * (live ? clamp(prog(t, SPLIT + SPLIT_D, 0.3)) : 1));

    // Les trois morceaux côte à côte
    S.rows.forEach((r, i) => {
      rise(r.g, t, ROW_T[i], 0.35, 12);
      r.bar.setAttribute('width', Math.max(0.001, r.w * (live ? easeOut(prog(t, ROW_T[i] + 0.1, 0.5)) : 1)));
      r.bar.setAttribute('opacity', o * (live ? clamp(prog(t, ROW_T[i], 0.2)) : 1));
      r.v.setAttribute('opacity', o * (live ? clamp(prog(t, ROW_T[i] + 0.5, 0.3)) : 1));
    });
    pop(S.small, t, SMALL_T, S.smallC, 671);
    if (live && t >= SMALL_T && t < SMALL_T + 0.9) pulse(S.rows[2].bar, t, SMALL_T + 0.1, 330 + 125, 669, 0.1, 0.5);
    rise(S.note, t, NOTE_T);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
