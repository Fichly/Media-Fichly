// Blog · 5S · section « La grille d'audit 5S : noter une zone sur vingt points »
// Mécanique : la même grille (cinq lignes notées de 0 à 4) est remplie à chaque passage hebdomadaire, la note s'ajoute
// à la courbe affichée dans la zone. Au 3e passage, un écart sur « Ranger » devient une action datée avec un nom ;
// au passage suivant, la ligne remonte. Puis un passage saute : la zone est impeccable, mais la ligne « Suivre »
// tombe à 2 sur 4. La cinquième ligne est la seule qui regarde le passé.
// Notes des passages : illustratives. Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  // Le gabarit ne précharge pas la graisse 600 : la charger avant la construction (mesures de para / fit justes)
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const ROWS = [
    ['Supprimer', 'La zone contient-elle autre chose que ce qui sert ?'],
    ['Ranger', 'Un objet manquant se voit-il sans chercher ?'],
    ['Nettoyer', 'La propreté sert-elle de détecteur d’anomalie ?'],
    ['Standardiser', 'L’état attendu est-il écrit et affiché dans la zone ?'],
    ['Suivre', 'Le passage précédent a-t-il produit une action ?'],
  ];
  // Passages hebdomadaires (null = passage sauté)
  const PASS = [
    { t: 2.2, v: [4, 3, 3, 4, 2] },
    { t: 4.3, v: [4, 4, 3, 4, 4] },
    { t: 6.4, v: [4, 2, 3, 4, 4] },
    { t: 9.1, v: null },
    { t: 10.4, v: [4, 4, 4, 4, 2] },
  ];
  const ROW_DT = 0.13;
  const CALL_T = [7.5, 11.5], CHUTE_T = 12.7;
  const ROW_Y = k => 262 + 80 * k;
  const SEG = { x: 344, w: 30, h: 20, gap: 6 };
  const CH = { x0: 630, base: 530, top: 262, slot: k => 690 + 106 * k, bw: 62 };
  const segColor = v => (v >= 4 ? C.green : v === 3 ? C.teal : v === 2 ? C.yellow : C.red);
  const total = v => v.reduce((a, b) => a + b, 0);

  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Une grille,', 'vingt points.');
    G.blogChapeau('Cinq lignes notées de 0 à 4, la même grille à chaque passage, la note affichée.');

    // ----- Carte gauche : la grille -----
    G.card(40, 176, 520, 584);
    text(G.svg, 64, 218, 'Grille d’audit 5S', { size: 22, weight: 700, fill: C.ink });
    S.passLabel = el('g');
    S.passPill = G.pill(S.passLabel, 536, 212, 'Passage S5', { size: 18, h: 32, pad: 14, bg: C.blue, fg: C.white });
    S.rows = ROWS.map(([n, q], k) => {
      const y = ROW_Y(k);
      const hl = el('rect', { x: 52, y: y - 30, width: 496, height: 70, rx: 12, fill: C.pRed, opacity: 0 });
      text(G.svg, 64, y, n, { size: 21, weight: 700, fill: C.ink });
      fit(text(G.svg, 64, y + 26, q, { size: 16, weight: 500, fill: C.ink }), 548, `question ${k}`);
      const segs = [0, 1, 2, 3].map(i => el('rect', { x: SEG.x + i * (SEG.w + SEG.gap), y: y - 17, width: SEG.w, height: SEG.h, rx: 5, fill: C.line }));
      const score = text(G.svg, 536, y, '', { size: 21, weight: 700, fill: C.ink, anchor: 'end' });
      return { hl, segs, score, y };
    });
    el('line', { x1: 64, y1: 676, x2: 536, y2: 676, stroke: C.line, 'stroke-width': 3 });
    text(G.svg, 64, 724, 'Total', { size: 24, weight: 700, fill: C.ink });
    S.total = text(G.svg, 536, 728, '', { size: 44, weight: 800, fill: C.blue, anchor: 'end' });
    S.skip = el('g');
    el('rect', { x: 110, y: 420, width: 400, height: 60, rx: 30, fill: C.ink }, S.skip);
    text(S.skip, 310, 458, 'Semaine chargée : pas de passage', { size: 20, weight: 700, fill: C.white, anchor: 'middle' });

    // ----- Carte droite : la note affichée dans la zone -----
    G.card(576, 176, 584, 584);
    text(G.svg, 600, 218, 'Note affichée dans la zone', { size: 22, weight: 700, fill: C.ink });
    const Y = v => CH.base - (CH.base - CH.top) * v / 20;
    S.Y = Y;
    [0, 10, 20].forEach(v => {
      el('line', { x1: CH.x0, y1: Y(v), x2: 1136, y2: Y(v), stroke: C.line, 'stroke-width': v ? 2 : 3, ...(v ? { 'stroke-dasharray': '6 6' } : {}) });
      text(G.svg, CH.x0 - 10, Y(v) + 6, String(v), { size: 16, weight: 600, fill: C.ink, anchor: 'end' });
    });
    S.bars = PASS.map((p, k) => {
      const x = CH.slot(k);
      text(G.svg, x, CH.base + 28, `S${k + 1}`, { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });
      if (!p.v) {
        const g = el('g');
        el('rect', { x: x - CH.bw / 2, y: Y(20), width: CH.bw, height: CH.base - Y(20), rx: 8, fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: 0.4 }, g);
        text(g, x, Y(10) + 6, 'sauté', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
        return { g, skip: true, x };
      }
      const r = el('rect', { x: x - CH.bw / 2, width: CH.bw, rx: 8, fill: C.blue });
      const lbl = text(G.svg, x, 0, String(total(p.v)), { size: 21, weight: 800, fill: C.blue, anchor: 'middle' });
      return { r, lbl, x, val: total(p.v) };
    });
    // Annotations
    const callout = (y, badge, str, bg, fg) => {
      const g = el('g');
      el('rect', { x: 600, y, width: 536, height: 64, rx: 14, fill: bg }, g);
      const b = G.pill(g, 614, y + 32, badge, { size: 17, h: 30, pad: 10, bg: fg, fg: C.white });
      G.para(g, 614 + b.w + 12, y + 26, str, 536 - b.w - 40, { size: 17, weight: 600, fill: C.ink, lh: 1.25 });
      return g;
    };
    S.call1 = callout(592, 'S3', 'Écart sur Ranger : un outil manque. Action datée : Karim, jeudi.', C.pYellow, C.tYellow);
    S.call2 = callout(668, 'S5', 'Zone impeccable, mais un passage a sauté : Suivre tombe à 2.', C.pRed, C.tRed);
    // Lien entre l'annotation et sa barre
    S.link = [
      el('path', { d: `M ${CH.slot(2)} ${CH.base + 38} L ${CH.slot(2)} 592`, stroke: C.tYellow, 'stroke-width': 2, fill: 'none' }),
    ];

    S.chute = G.blogChute('La cinquième ligne est la seule qui regarde le passé.', { y: 806 });
  }

  // Valeurs de la grille à l'instant t (ligne par ligne, avec le décalage de remplissage)
  function gridAt(t) {
    if (t < FADE_END) return { v: PASS[4].v, pass: 4, prev: PASS[2].v };
    let v = [0, 0, 0, 0, 0], pass = -1, prev = null;
    PASS.forEach((p, k) => {
      if (!p.v) return;
      const nv = v.slice();
      p.v.forEach((x, r) => { if (t >= p.t + ROW_DT * r) nv[r] = x; });
      if (t >= p.t) { prev = pass >= 0 ? PASS[pass].v : null; pass = k; v = nv; }
    });
    return { v, pass, prev };
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const g = gridAt(t);

    // Libellé du passage
    const passIdx = live ? PASS.reduce((a, p, k) => (t >= p.t ? k : a), -1) : 4;
    if (passIdx >= 0) S.passPill.tx.textContent = `Passage S${passIdx + 1}`;
    S.passLabel.setAttribute('transform', '');
    S.passLabel.setAttribute('opacity', passIdx >= 0 ? o : 0);
    // Pilule alignée à droite
    const pw = S.passPill.tx.getComputedTextLength() + 28;
    S.passPill.g.setAttribute('transform', `translate(${-pw} 0)`);
    S.passPill.g.querySelector('rect').setAttribute('width', pw);

    // Passage sauté : la grille s'estompe
    const skipO = live ? window01(t, PASS[3].t, PASS[4].t - 0.1, 0.2) : 0;
    S.skip.setAttribute('opacity', skipO);

    S.rows.forEach((r, k) => {
      const v = g.v[k];
      const filledO = o * (1 - 0.6 * skipO);
      r.segs.forEach((s, i) => s.setAttribute('fill', i < v ? segColor(v) : C.line));
      r.segs.forEach(s => s.setAttribute('opacity', filledO));
      r.score.textContent = g.pass >= 0 || !live ? `${v}/4` : '';
      r.score.setAttribute('opacity', filledO);
      // Ligne en baisse par rapport au passage précédent
      const drop = g.prev && g.v[k] < g.prev[k];
      r.hl.setAttribute('opacity', drop ? 0.9 * filledO : 0);
      const pt = g.pass >= 0 ? PASS[g.pass].t + ROW_DT * k : -9;
      if (live && t < pt + 0.6) pulse(r.hl, t, pt, 300, r.y, 0.03, 0.4);
    });
    const tot = total(g.v);
    S.total.textContent = g.pass >= 0 || !live ? `${tot}${NB}/${NB}20` : '';
    S.total.setAttribute('opacity', o * (1 - 0.6 * skipO));

    // Barres
    S.bars.forEach((b, k) => {
      const p = PASS[k];
      if (b.skip) { b.g.setAttribute('opacity', live ? clamp(prog(t, p.t, 0.3)) : o); return; }
      const q = live ? easeOut(prog(t, p.t + 0.5, 0.5)) : 1;
      const h = (CH.base - S.Y(b.val)) * q;
      b.r.setAttribute('y', CH.base - h);
      b.r.setAttribute('height', Math.max(0.001, h));
      b.r.setAttribute('opacity', live ? (q > 0 ? 1 : 0) : o);
      b.lbl.setAttribute('y', CH.base - h - 10);
      b.lbl.setAttribute('opacity', live ? clamp(prog(t, p.t + 0.9, 0.2)) : o);
    });

    pop(S.call1, t, CALL_T[0], 868, 624);
    pop(S.call2, t, CALL_T[1], 868, 700);
    S.link[0].setAttribute('opacity', live ? clamp(prog(t, CALL_T[0], 0.3)) : o);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
