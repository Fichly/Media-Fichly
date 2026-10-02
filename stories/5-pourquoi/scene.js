// Story · 5 Pourquoi (famille 1, Résolution de problèmes)
// Chaîne reprise de l'article methode-5-pourquoi-cause-racine : réglage hors tolérance →
// contrôle de début de série non fait → « l'opérateur ne l'a pas fait » (une personne : on barre)
// → le contrôle ne figure pas dans le mode opératoire → mode opératoire pas revu → contre-mesure.
Story.scene({
  famille: 1,
  outil: '5 Pourquoi',
  titre: ['5 Pourquoi'],
  accroche: { lignes: ['Le même défaut', 'revient sans cesse.'], accent: 1 },
  retenir: 'Accuser une personne, c’est s’arrêter trop tôt.',
  poster: 11.2,

  build(S, A, root) {
    const { el, text, fit, C, ZONE, cross } = A;
    const RX = 162, TX = 232, MAXR = ZONE.x + ZONE.w;
    const rows = [
      { y: 664, a: 'Réglage hors tolérance' },
      { y: 800, a: 'Contrôle non fait' },
      { y: 936, a: 'L’opérateur a oublié', bad: true },
      { y: 1136, a: 'Mode opératoire pas revu' },
    ];
    S.R = rows;
    // Rail : se trace d'un badge à l'autre
    S.rail = rows.slice(1).map((r, i) => el('line', { x1: RX, y1: rows[i].y + 34, x2: RX, y2: r.y - 34, stroke: C.indigo100, 'stroke-width': 8, 'stroke-linecap': 'round' }, root));
    S.railCm = el('line', { x1: RX, y1: rows[3].y + 34, x2: RX, y2: 1262, stroke: C.indigo100, 'stroke-width': 8, 'stroke-linecap': 'round' }, root);
    rows.forEach((r, i) => {
      r.badge = el('g', {}, root);
      el('circle', { cx: RX, cy: r.y, r: 34, fill: C.indigo }, r.badge);
      text(r.badge, RX, r.y + 14, String(i + 1), { size: 38, weight: 700, fill: C.white, anchor: 'middle' });
      r.q = el('g', {}, root);
      text(r.q, TX, r.y + 15, 'Pourquoi ?', { size: 42, weight: 600, fill: C.indigo, italic: true });
      r.ans = el('g', {}, root);
      fit(text(r.ans, TX, r.y + 15, r.a, { size: 44, weight: 700, fill: r.bad ? C.ko : C.ink }), MAXR, `réponse ${i + 1}`);
    });
    // Niveau 3 : la réponse-personne est barrée, la vraie cause s'écrit dessous
    const r3 = rows[2];
    const w3 = r3.ans.getBBox().width;
    S.strike = el('line', { x1: TX - 6, y1: r3.y, x2: TX + w3 + 6, y2: r3.y, stroke: C.coral, 'stroke-width': 7, 'stroke-linecap': 'round' }, root);
    S.cross = cross(root, Math.min(TX + w3 + 52, MAXR - 26), r3.y, 24, C.coral, C.ink);
    S.fix = el('g', {}, root);
    fit(text(S.fix, TX, r3.y + 90, 'Absent du mode opératoire', { size: 44, weight: 700, fill: C.ink }), MAXR, 'vraie cause');
    // Contre-mesure
    S.cm = el('g', {}, root);
    el('rect', { x: ZONE.x, y: 1262, width: ZONE.w, height: 122, rx: 24, fill: C.greenSoft, stroke: C.green, 'stroke-width': 4 }, S.cm);
    A.check(S.cm, ZONE.x + 62, 1323, 30, C.green, C.ink);
    text(S.cm, ZONE.x + 112, 1310, 'CONTRE-MESURE', { size: 26, weight: 700, fill: C.ok, ls: 2 });
    fit(text(S.cm, ZONE.x + 112, 1352, 'Revue à chaque changement', { size: 40, weight: 700, fill: C.ink }), MAXR - 20, 'contre-mesure');
  },

  anim(t, S, A) {
    const { show, stroke } = A;
    const starts = [3.15, 4.55, 5.95, 9.0];
    S.R.forEach((r, i) => {
      const s = starts[i];
      show(r.badge, t, s, { from: 'pop', cx: 162, cy: r.y, dur: 0.4 });
      show(r.q, t, s + 0.1, { dur: 0.3, from: 'right', d: 30, out: s + 0.75, outDur: 0.2 });
      show(r.ans, t, s + 0.85, { dur: 0.4, from: 'right', d: 30 });
      if (i > 0) stroke(S.rail[i - 1], t, s - 0.35, 0.35);
    });
    // Barrer la réponse-personne puis écrire la vraie cause
    const r3 = S.R[2];
    stroke(S.strike, t, 7.55, 0.35);
    show(S.cross, t, 7.85, { from: 'pop', cx: +S.cross.firstChild.getAttribute('cx'), cy: r3.y, dur: 0.35 });
    r3.ans.setAttribute('opacity', (t < 8.2 ? +r3.ans.getAttribute('opacity') : 1 - 0.55 * A.prog(t, 8.2, 0.4)).toFixed(3));
    show(S.fix, t, 8.25, { dur: 0.45, from: 'up', d: 24 });
    stroke(S.railCm, t, 10.0, 0.3);
    show(S.cm, t, 10.25, { dur: 0.5, from: 'up', d: 30 });
  },
});
