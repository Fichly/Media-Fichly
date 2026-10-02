// Story · VSM (famille 4, Optimisation des flux)
// Exemple simplifié de l'article value-stream-mapping-definition-et-etapes : 3 postes, 3 stocks,
// attentes de 1 / 1,5 / 0,5 jour, transformation de 1 / 3 / 1 minute, soit 5 minutes de valeur
// ajoutée pour 3 jours de traversée. Ligne de temps à la convention Fichly : attente en bas.
Story.scene({
  famille: 4,
  outil: 'VSM',
  titre: ['VSM'],
  accroche: { lignes: ['Chaque poste tourne vite.', 'Le client attend.'], accent: 1 },
  retenir: 'Le temps se perd surtout entre les postes.',
  poster: 10.4,

  build(S, A, root) {
    const { el, text, C, ZONE } = A;
    const FY = 880;                                   // axe du flux
    const defs = document.querySelector('defs');
    const pat = el('pattern', { id: 'hachures', width: 14, height: 14, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('rect', { width: 14, height: 14, fill: C.coral }, pat);
    el('line', { x1: 0, y1: 0, x2: 0, y2: 14, stroke: C.white, 'stroke-width': 5 }, pat);
    // Carte : stock, poste, stock, poste, stock, poste
    const items = [['T', 145], ['P', 280], ['T', 430], ['P', 565], ['T', 715], ['P', 850]];
    S.items = items.map(([k, x], i) => {
      const g = el('g', {}, root);
      if (k === 'T') {
        el('path', { d: `M ${x} ${FY - 34} L ${x + 36} ${FY + 32} L ${x - 36} ${FY + 32} Z`, fill: C.white, stroke: C.ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        [[-12, 18], [6, 18], [-3, 2]].forEach(([dx, dy]) => el('rect', { x: x + dx - 7, y: FY + dy - 7, width: 14, height: 14, rx: 2, fill: C.ink500 }, g));
      } else el('rect', { x: x - 80, y: FY - 52, width: 160, height: 104, rx: 12, fill: C.yellow, stroke: C.ink, 'stroke-width': 4 }, g);
      return { g, x, k };
    });
    S.flowArrow = A.arrow(root, 936, FY, 975, FY, { color: C.ink, sw: 5, head: 18 }).g;
    // La pièce suivie
    S.token = el('rect', { x: -14, y: -14, width: 28, height: 28, rx: 5, fill: C.indigo, stroke: C.white, 'stroke-width': 3 }, root);
    S.FY = FY;
    // Ligne de temps : attentes en bas (hachurées), transformation en haut
    const LOW = 1150, HIGH = 1066;
    // Ligne en escalier sous la carte : attente sous chaque stock, transformation sous chaque poste
    const waits = [[95, 195], [380, 480], [665, 765]];
    const va = [[205, 355], [490, 640], [775, 925]];
    S.waits = waits.map(([a, b]) => el('rect', { x: a, y: LOW - 14, width: 0, height: 28, rx: 5, fill: 'url(#hachures)' }, root)).map((r, i) => ({ r, w: waits[i][1] - waits[i][0] }));
    S.va = el('g', {}, root);
    va.forEach(([a, b], i) => {
      el('line', { x1: a - 10, y1: LOW, x2: a, y2: HIGH, stroke: C.indigo, 'stroke-width': 4 }, S.va);
      el('line', { x1: a, y1: HIGH, x2: b, y2: HIGH, stroke: C.indigo, 'stroke-width': 12, 'stroke-linecap': 'round' }, S.va);
      el('line', { x1: b, y1: HIGH, x2: b + 10, y2: LOW, stroke: C.indigo, 'stroke-width': 4 }, S.va);
    });
    // Comparaison : 3 jours d'attente contre 5 minutes de transformation
    S.cmp = el('g', {}, root);
    el('rect', { x: ZONE.x, y: 1250, width: ZONE.w - 14, height: 56, rx: 10, fill: 'url(#hachures)' }, S.cmp);
    el('rect', { x: ZONE.x + ZONE.w - 8, y: 1250, width: 8, height: 56, rx: 3, fill: C.indigo }, S.cmp);
    // Éclair kaizen sur la plus longue attente
    S.burst = el('g', {}, root);
    const bx = 540, by = 1278, pts = [];
    for (let i = 0; i < 16; i++) { const r = i % 2 ? 26 : 50, a = -Math.PI / 2 + i * Math.PI / 8; pts.push(`${(bx + r * Math.cos(a)).toFixed(1)} ${(by + r * Math.sin(a)).toFixed(1)}`); }
    el('polygon', { points: pts.join(' '), fill: C.green, stroke: C.ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, S.burst);
    // Légendes
    const cap = parts => {
      const g = el('g', {}, root);
      const t = text(g, 540, 732, '', { size: 52, weight: 700, fill: C.ink, anchor: 'middle' });
      parts.forEach(([s, f]) => { const sp = document.createElementNS('http://www.w3.org/2000/svg', 'tspan'); sp.setAttribute('fill', f); sp.textContent = s; t.appendChild(sp); });
      A.fit(t, ZONE.x + ZONE.w, 'légende', ZONE.x);
      return g;
    };
    S.caps = [
      [cap([['Suivre une pièce', C.ink]]), 3.15, 4.85],
      [cap([['Attente : ', C.ink], ['3 jours', C.ko]]), 5.0, 6.85],
      [cap([['Machine : ', C.ink], ['5 minutes', C.indigo]]), 7.0, 9.05],
      [cap([['Réduire l’attente', C.ink]]), 9.2, null],
    ];
  },

  anim(t, S, A) {
    const { show, prog, easeInOut, lerp } = A;
    S.items.forEach((it, i) => show(it.g, t, 3.05 + i * 0.12, { dur: 0.35, from: 'up', d: 20 }));
    show(S.flowArrow, t, 3.8, { dur: 0.3, from: 'left', d: 20 });
    // La pièce : attend dans chaque stock, traverse vite chaque poste
    const stops = [[100, 3.6], [145, 3.75], [145, 4.15], [280, 4.3], [430, 4.45], [430, 4.85], [565, 5.0], [715, 5.15], [715, 5.35], [850, 5.5], [990, 5.7]];
    let x = stops[0][0];
    for (let i = 1; i < stops.length; i++) if (t >= stops[i - 1][1]) x = lerp(stops[i - 1][0], stops[i][0], easeInOut(prog(t, stops[i - 1][1], stops[i][1] - stops[i - 1][1])));
    S.token.setAttribute('transform', `translate(${x.toFixed(1)} ${S.FY - 80})`);
    S.token.setAttribute('opacity', (prog(t, 3.5, 0.2) * (1 - prog(t, 5.55, 0.2))).toFixed(3));
    // Attentes, puis transformation
    S.waits.forEach((w, i) => w.r.setAttribute('width', (w.w * easeInOut(prog(t, 5.1 + i * 0.4, 0.4))).toFixed(1)));
    show(S.va, t, 7.05, { dur: 0.4, from: 'fade' });
    show(S.cmp, t, 8.2, { dur: 0.5, from: 'left', d: 60 });
    // L'éclair kaizen se pose sur l'attente, qui reste à l'écran jusqu'au message
    show(S.burst, t, 9.35, { from: 'pop', cx: 540, cy: 1278, dur: 0.45 });
    S.caps.forEach(([g, s, o]) => show(g, t, s, { dur: 0.35, from: 'up', d: 20, out: o, outDur: 0.15 }));
  },
});
