// Blog · Types de maintenance · section « Comment choisir un type de maintenance ? Arbitrer surveillance contre arrêt »
// Mécanique : l'arbitrage surveillance contre arrêt. Deux balances, la même analyse vibratoire (même poids) à gauche.
// À droite, le coût d'arrêt de l'équipement : faible sur un convoyeur redondant, la balance ne bouge presque pas
// (corrective) ; élevé sur une machine goulot, la balance bascule (la surveillance se paie).
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const PY = 344, R = 168, STRING = 124, PAN_W = 176;
  const MAX = 11;                                   // inclinaison maximale (degrés)
  const T = { surv: 3.2, conv: 5.1, goul: 7.3, v0: 6.3, v1: 8.6, chute: 10.2 };
  const DROP = 0.45, SWING = 1.3;
  const CARDS = [
    { x: 40, name: 'Convoyeur redondant', sub: 'son arrêt n’arrête pas la production', m: 0.35, w: 92, h: 42, word: 'faible', tDrop: T.conv, tV: T.v0,
      verdict: 'Corrective', line: 'Ne rien anticiper est le bon calcul : l’analyse vibratoire y serait une dépense.' },
    { x: 610, name: 'Machine goulot', sub: 'production perdue, retard client, redémarrage', m: 2.4, w: 150, h: 92, word: 'élevé', tDrop: T.goul, tV: T.v1,
      verdict: 'Conditionnelle', line: 'La surveillance coûte moins que les arrêts qu’elle évite.' },
  ];
  const SURV = { w: 150, h: 64 };

  const S = { cards: [] };

  // Oscillation amortie : 0 → 1, légère sur-course, exactement 1 à p = 1
  const swing = p => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.exp(-5 * p) * Math.cos(3 * Math.PI * p) * (1 - p));
  const target = (mL, mR) => clamp(14 * (mR - mL), -MAX, MAX);

  function pan(parent) {
    const g = el('g', {}, parent);
    const hw = PAN_W / 2;
    el('line', { x1: 0, y1: -STRING, x2: -hw + 8, y2: 0, stroke: C.ink, 'stroke-width': 2.5, opacity: 0.55 }, g);
    el('line', { x1: 0, y1: -STRING, x2: hw - 8, y2: 0, stroke: C.ink, 'stroke-width': 2.5, opacity: 0.55 }, g);
    el('path', { d: `M ${-hw} 0 L ${hw} 0 Q ${hw - 14} 22 ${hw - 40} 22 L ${-hw + 40} 22 Q ${-hw + 14} 22 ${-hw} 0 Z`, fill: C.lightBlue, stroke: C.lightBlue, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function weight(parent, w, h, fill, lines, size) {
    const g = el('g', {}, parent);
    el('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 10, fill }, g);
    el('rect', { x: -w / 2 + 8, y: -h + 8, width: w - 16, height: 5, rx: 2.5, fill: C.white, opacity: 0.35 }, g);
    const n = lines.length;
    lines.forEach((s, i) => text(g, 0, -h / 2 + size * 0.36 + (i - (n - 1) / 2) * size * 1.15 + 3, s, { size, weight: 700, fill: C.white, anchor: 'middle' }));
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('C’est l’arrêt', 'qui décide.');
    G.blogChapeau('Même analyse vibratoire, même coût de surveillance : seul le coût d’arrêt change.');

    CARDS.forEach((c, i) => {
      const cx = c.x + 275;
      const K = { ...c, cx };
      G.card(c.x, 176, 550, 568);
      K.head = el('g');
      G.pill(K.head, cx, 216, c.name, { size: 21, h: 38, anchor: 'middle' });
      fit(text(K.head, cx, 258, c.sub, { size: 18, weight: 500, fill: C.ink, anchor: 'middle' }), c.x + 540, `sous-titre ${i}`, c.x + 10);

      // Balance : pied fixe, fléau et plateaux mobiles
      K.bal = el('g');
      el('rect', { x: cx - 70, y: 552, width: 140, height: 14, rx: 7, fill: C.ink, opacity: 0.85 }, K.bal);
      el('rect', { x: cx - 5, y: PY, width: 10, height: 210, rx: 4, fill: C.ink, opacity: 0.85 }, K.bal);
      K.beam = el('g', {}, K.bal);
      el('rect', { x: cx - R - 6, y: PY - 6, width: 2 * R + 12, height: 12, rx: 6, fill: C.blue }, K.beam);
      el('circle', { cx: cx - R, cy: PY, r: 6, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, K.beam);
      el('circle', { cx: cx + R, cy: PY, r: 6, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, K.beam);
      el('path', { d: `M ${cx - 16} ${PY + 26} L ${cx} ${PY - 2} L ${cx + 16} ${PY + 26} Z`, fill: C.ink, 'stroke-linejoin': 'round', stroke: C.ink, 'stroke-width': 3 }, K.bal);
      el('circle', { cx, cy: PY, r: 8, fill: C.yellow }, K.bal);
      K.panL = pan(K.bal);
      K.panR = pan(K.bal);
      K.wL = weight(K.bal, SURV.w, SURV.h, C.blue, ['Analyse', 'vibratoire'], 17);
      K.wR = weight(K.bal, c.w, c.h, C.red, [c.word], c.h > 60 ? 24 : 18);

      // Légendes fixes sous les plateaux
      K.caps = el('g');
      text(K.caps, cx - R, 596, 'Coût de la', { size: 17, weight: 600, fill: C.blue, anchor: 'middle' });
      text(K.caps, cx - R, 617, 'surveillance', { size: 17, weight: 600, fill: C.blue, anchor: 'middle' });
      text(K.caps, cx + R, 596, 'Coût des', { size: 17, weight: 600, fill: C.tRed, anchor: 'middle' });
      text(K.caps, cx + R, 617, 'arrêts', { size: 17, weight: 600, fill: C.tRed, anchor: 'middle' });

      // Verdict
      K.verdict = el('g');
      G.pill(K.verdict, c.x + 28, 658, c.verdict, { size: 20, h: 36, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
      const vl = G.para(K.verdict, c.x + 28, 698, c.line, 494, { size: 17, weight: 500, fill: C.ink, lh: 1.25 });
      K.vlines = vl.n;
      S.cards.push(K);
    });

    S.chute = G.blogChute('On la choisit par ce que coûte un arrêt, pas par sophistication.', { y: 806 });
  }

  // Angle du fléau à l'instant t (degrés, positif = côté droit en bas)
  function angle(K, t) {
    if (t < FADE_END) return target(1, K.m);
    const a1 = target(1, 0), a2 = target(1, K.m);
    const s1 = T.surv + DROP * 0.8, s2 = K.tDrop + DROP * 0.8;
    if (t < s2) return a1 * swing(prog(t, s1, SWING));
    return a1 + (a2 - a1) * swing(prog(t, s2, SWING));
  }
  // Position d'un poids : chute depuis 150 px plus haut, avec rebond
  function dropY(t, t0) {
    if (t < FADE_END) return { dy: 0, o: fading(t) ? fadeOut(t) : 1 };
    const p = prog(t, t0, DROP);
    return { dy: -150 * (1 - easeOut(p)) * (p < 1 ? 1 : 0), o: clamp(p / 0.25) };
  }

  function draw(t) {
    const live = t >= FADE_END;
    S.cards.forEach((K, i) => {
      pop(K.head, t, 1.75 + 0.2 * i, K.cx, 236);
      const bo = fading(t) ? fadeOut(t) : live ? clamp(prog(t, 2.3 + 0.15 * i, 0.35)) : 1;
      K.bal.setAttribute('opacity', bo);
      K.caps.setAttribute('opacity', bo);

      const a = angle(K, t), r = a * Math.PI / 180;
      K.beam.setAttribute('transform', a === 0 ? '' : `rotate(${a} ${K.cx} ${PY})`);
      const L = { x: K.cx - R * Math.cos(r), y: PY - R * Math.sin(r) };
      const Rr = { x: K.cx + R * Math.cos(r), y: PY + R * Math.sin(r) };
      K.panL.setAttribute('transform', `translate(${L.x} ${L.y + STRING})`);
      K.panR.setAttribute('transform', `translate(${Rr.x} ${Rr.y + STRING})`);

      const dl = dropY(t, T.surv), dr = dropY(t, K.tDrop);
      K.wL.setAttribute('transform', `translate(${L.x} ${L.y + STRING + dl.dy})`);
      K.wL.setAttribute('opacity', live ? dl.o : 1);
      K.wR.setAttribute('transform', `translate(${Rr.x} ${Rr.y + STRING + dr.dy})`);
      K.wR.setAttribute('opacity', live ? dr.o : 1);

      pop(K.verdict, t, K.tV, K.cx - 100, 670);
    });
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
