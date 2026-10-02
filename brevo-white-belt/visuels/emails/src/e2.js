// E2 « Une grille, quatre colonnes » — la feuille d'observation sur sa planchette : attentes, déplacements,
// ruptures, retouches, et les bâtons notés au poste. Accent violet.
start(() => {
  const W = 1200, H = 712; size(W, H); bg(W, H, 'e2');
  // Planchette et feuille
  const SX = 44, SY = 74, SW = 1112, SH = 596;
  el('rect', {x: SX, y: SY, width: SW, height: SH, rx: 32, fill: C.card, stroke: EDGE.e2, 'stroke-width': 4});
  el('rect', {x: W / 2 - 120, y: SY - 34, width: 240, height: 64, rx: 18, fill: C.violet});
  el('rect', {x: W / 2 - 60, y: SY - 50, width: 120, height: 34, rx: 12, fill: 'none', stroke: C.violet, 'stroke-width': 10});
  el('circle', {cx: W / 2, cy: SY - 2, r: 9, fill: C.card});
  // Colonnes : largeur selon le libellé
  const names = ['Attentes', 'Déplacements', 'Ruptures', 'Retouches'];
  const IX = SX + 24, IW = SW - 48, HY = 262;
  const labels = names.map(n => tx(S, 0, HY, n, {size: 42, weight: 700}));
  const lw = labels.map(t => t.getBBox().width), extra = (IW - lw.reduce((a, b) => a + b, 0)) / 4;
  let x = IX; const cols = lw.map(w => { const c = [x, w + extra]; x += w + extra; return c });
  labels.forEach((t, i) => { const [cx, cw] = cols[i]; t.setAttribute('x', cx + cw / 2); t.setAttribute('text-anchor', 'middle'); fit(t, cx + 4, cx + cw - 4, names[i]) });
  // Pictogrammes
  const icon = (i, fill, draw) => { const [cx, cw] = cols[i], c = cx + cw / 2, cy = 162; el('circle', {cx: c, cy, r: 46, fill}); draw(c, cy) };
  const w = {stroke: C.white, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'};
  icon(0, C.red, (c, y) => { el('circle', {cx: c, cy: y, r: 24, ...w}); el('path', {d: `M ${c} ${y - 13} V ${y} L ${c + 10} ${y + 8}`, ...w, 'stroke-width': 7}) });
  icon(1, C.lblue, (c, y) => { el('path', {d: `M ${c - 26} ${y + 14} L ${c - 8} ${y - 8} L ${c + 6} ${y + 8} L ${c + 24} ${y - 14}`, ...w});
    el('path', {d: `M ${c + 10} ${y - 16} L ${c + 26} ${y - 16} L ${c + 26} ${y}`, ...w}) });
  icon(2, C.violet, (c, y) => { el('path', {d: `M ${c - 28} ${y} H ${c - 9} M ${c + 9} ${y} H ${c + 24}`, ...w}); el('path', {d: `M ${c + 14} ${y - 10} L ${c + 26} ${y} L ${c + 14} ${y + 10}`, ...w});
    el('path', {d: `M ${c - 2} ${y - 22} V ${y + 22}`, ...w, 'stroke-width': 6}) });
  icon(3, C.yellow, (c, y) => { el('path', {d: `M ${c + 20} ${y - 6} A 22 22 0 1 0 ${c + 14} ${y + 16}`, ...w}); el('path', {d: `M ${c + 26} ${y - 22} L ${c + 21} ${y - 4} L ${c + 4} ${y - 10}`, ...w}) });
  // Lignes de la grille
  const T0 = 296, RH = 116, NR = 3;
  el('path', {d: `M ${IX} ${T0} H ${IX + IW}`, stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round'});
  for (let r = 1; r < NR; r++) el('path', {d: `M ${IX} ${T0 + r * RH} H ${IX + IW}`, stroke: C.stitch, 'stroke-width': 4, 'stroke-dasharray': '14 10'});
  cols.slice(1).forEach(([cx]) => el('path', {d: `M ${cx} ${116} V ${T0 + NR * RH - 18}`, stroke: C.line, 'stroke-width': 4}));
  // Bâtons notés au crayon (aucun chiffre)
  const tally = (cx, cy, n) => { const g = el('g', {transform: `rotate(-4 ${cx} ${cy})`}); const sp = 17, x0 = cx - (Math.min(n, 4) - 1) * sp / 2;
    for (let k = 0; k < Math.min(n, 4); k++) el('path', {d: `M ${x0 + k * sp} ${cy - 30} L ${x0 + k * sp + 2} ${cy + 30}`, stroke: C.blue, 'stroke-width': 7, 'stroke-linecap': 'round'}, g);
    if (n >= 5) el('path', {d: `M ${x0 - 14} ${cy + 20} L ${x0 + 3 * sp + 14} ${cy - 18}`, stroke: C.blue, 'stroke-width': 7, 'stroke-linecap': 'round'}, g) };
  const grid = [[5, 2, 1, 3], [4, 3, 0, 1], [5, 1, 2, 0]];
  grid.forEach((row, r) => row.forEach((n, i) => { if (!n) return; const [cx, cw] = cols[i]; tally(cx + cw / 2, T0 + r * RH + RH / 2, n) }));
  // Crayon posé sur la feuille
  const g = el('g', {transform: 'translate(902 652) rotate(-30)'});
  el('path', {d: 'M 0 0 L 48 -22 L 48 22 Z', fill: '#f3dfb0', stroke: C.tYel, 'stroke-width': 4, 'stroke-linejoin': 'round'}, g);
  el('path', {d: 'M 0 0 L 16 -7 L 16 7 Z', fill: C.ink}, g);
  el('rect', {x: 48, y: -22, width: 196, height: 44, rx: 6, fill: C.yellow, stroke: C.tYel, 'stroke-width': 4}, g);
  el('path', {d: 'M 52 -7 H 240 M 52 7 H 240', stroke: C.tYel, 'stroke-width': 2, opacity: 0.5}, g);
  el('rect', {x: 240, y: -22, width: 44, height: 44, rx: 8, fill: C.red, stroke: C.tYel, 'stroke-width': 4}, g);
});
