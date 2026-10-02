// E3 « Choisir le bon outil » — les quatre outils du repère : Pareto, 5 Pourquoi, Ishikawa, DMAIC. Accent bleu clair.
start(() => {
  const W = 1200, H = 800; size(W, H); bg(W, H, 'e3');
  const CW = 544, CH = 340, G = 32, X = [40, 40 + CW + G], Y = [40, 40 + CH + G];
  const card = (i, j, name, draw) => { const x = X[i], y = Y[j];
    el('rect', {x, y, width: CW, height: CH, rx: 30, fill: C.card, stroke: EDGE.e3, 'stroke-width': 4});
    draw(x, y); const t = tx(S, x + CW / 2, y + CH - 40, name, {size: 52, weight: 800, fill: C.ink, anchor: 'middle'}); fit(t, x + 30, x + CW - 30, name) };
  // Pareto : barres décroissantes, les deux premières en avant, courbe cumulée
  card(0, 0, 'Pareto', (x, y) => {
    const base = y + 222, hs = [158, 112, 74, 50, 32, 20], bw = 56, gap = 16, x0 = x + CW / 2 - (6 * bw + 5 * gap) / 2;
    el('path', {d: `M ${x0 - 16} ${base + 3} H ${x0 + 6 * bw + 5 * gap + 16}`, stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round'});
    hs.forEach((h, k) => el('rect', {x: x0 + k * (bw + gap), y: base - h, width: bw, height: h, rx: 8, fill: k < 2 ? C.blue : C.stitch}));
    let cum = 0; const tot = hs.reduce((a, b) => a + b, 0), pts = hs.map((h, k) => { cum += h; return [x0 + k * (bw + gap) + bw / 2, base - 8 - (cum / tot) * 168] });
    el('path', {d: 'M ' + pts.map(q => q.join(' ')).join(' L '), stroke: C.yellow, 'stroke-width': 6, fill: 'none', 'stroke-linejoin': 'round'});
    pts.forEach(([a, b]) => el('circle', {cx: a, cy: b, r: 9, fill: C.white, stroke: C.yellow, 'stroke-width': 5}));
  });
  // 5 Pourquoi : un escalier de briques jusqu'à la cause
  card(1, 0, '5 Pourquoi', (x, y) => {
    const bw = 84, bh = 60;
    for (let k = 0; k < 5; k++) { const cx = x + CW / 2 - 180 + k * 90, cy = y + 80 + k * 32;
      if (k < 4) brick(cx, cy, bw, bh, C.blue, '?', {size: 46});
      else { brick(cx, cy, bw, bh, C.green); el('path', {d: `M ${cx - 16} ${cy + 1} L ${cx - 5} ${cy + 12} L ${cx + 17} ${cy - 10}`, fill: 'none', stroke: C.white, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}) } }
  });
  // Ishikawa : l'arête centrale, six arêtes de causes, la tête = le problème
  card(0, 1, 'Ishikawa', (x, y) => {
    const my = y + 134, x0 = x + 64, x1 = x + 392;
    el('path', {d: `M ${x0} ${my} H ${x1}`, stroke: C.blue, 'stroke-width': 8, 'stroke-linecap': 'round'});
    el('path', {d: `M ${x1 - 6} ${my - 18} L ${x1 + 12} ${my} L ${x1 - 6} ${my + 18}`, stroke: C.blue, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'});
    el('rect', {x: x1 + 26, y: my - 42, width: 92, height: 84, rx: 18, fill: C.red});
    el('path', {d: `M ${x1 + 72} ${my - 20} V ${my + 4}`, stroke: C.white, 'stroke-width': 9, 'stroke-linecap': 'round'}); el('circle', {cx: x1 + 72, cy: my + 22, r: 6, fill: C.white});
    [0, 1, 2].forEach(k => { const bx = x0 + 70 + k * 104;
      [-1, 1].forEach(s => { el('path', {d: `M ${bx} ${my + s * 88} L ${bx + 54} ${my}`, stroke: C.stitch, 'stroke-width': 7, 'stroke-linecap': 'round'});
        el('circle', {cx: bx, cy: my + s * 88, r: 12, fill: C.lblue}) }) });
  });
  // DMAIC : cinq étapes en boucle
  card(1, 1, 'DMAIC', (x, y) => {
    const L = ['D', 'M', 'A', 'I', 'C'], r = 38, sp = 92, x0 = x + CW / 2 - 2 * sp, cy = y + 104;
    el('path', {d: `M ${x0 + 4 * sp} ${cy + r + 8} Q ${x0 + 4 * sp} ${cy + 104} ${x0 + 2 * sp} ${cy + 104} Q ${x0} ${cy + 104} ${x0} ${cy + r + 14}`, stroke: C.stitch, 'stroke-width': 6, fill: 'none', 'stroke-dasharray': '13 9', 'stroke-linecap': 'round'});
    el('path', {d: `M ${x0 - 14} ${cy + r + 30} L ${x0} ${cy + r + 12} L ${x0 + 14} ${cy + r + 30}`, stroke: C.stitch, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'});
    L.forEach((l, k) => { if (k) el('path', {d: `M ${x0 + (k - 1) * sp + r} ${cy} H ${x0 + k * sp - r}`, stroke: C.blue, 'stroke-width': 6});
      el('circle', {cx: x0 + k * sp, cy, r, fill: k === 4 ? C.ink : C.blue}); tx(S, x0 + k * sp, cy + 16, l, {size: 44, weight: 800, fill: C.white, anchor: 'middle'}) });
  });
});
