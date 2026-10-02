// E4 · Accompagnement « Un regard extérieur » — la loupe sur l'atelier : le stock tampon, le poste de retouche,
// la réunion de crise, ces gaspillages qui font partie du paysage. Accent jaune.
start(() => {
  const W = 1200, H = 700; size(W, H); bg(W, H, 'e4');
  el('rect', {x: 40, y: 40, width: 1120, height: 620, rx: 32, fill: C.card, stroke: EDGE.e4, 'stroke-width': 4});
  // Sol de l'atelier
  el('path', {d: 'M 80 470 H 1120', stroke: C.line, 'stroke-width': 6, 'stroke-linecap': 'round'});
  const cols = [220, 600, 980], GY = 470;
  // 1. Stock tampon : caisses empilées
  { const cx = cols[0]; const box = (bx, by) => { el('rect', {x: bx, y: by, width: 92, height: 70, rx: 9, fill: C.pLav, stroke: C.blue, 'stroke-width': 6});
      el('path', {d: `M ${bx + 46} ${by} V ${by + 20}`, stroke: C.blue, 'stroke-width': 6}) };
    box(cx - 140, GY - 72); box(cx - 46, GY - 72); box(cx + 48, GY - 72); box(cx - 93, GY - 144); box(cx + 1, GY - 144); box(cx - 46, GY - 216);
    clockBadge(cx + 120, GY - 220, 32) }
  // 2. Poste de retouche : établi, pièce, flèche de reprise
  { const cx = cols[1];
    el('path', {d: `M ${cx - 130} ${GY - 110} H ${cx + 130} M ${cx - 110} ${GY - 110} V ${GY - 4} M ${cx + 110} ${GY - 110} V ${GY - 4}`, stroke: C.blue, 'stroke-width': 9, 'stroke-linecap': 'round'});
    el('rect', {x: cx - 44, y: GY - 178, width: 88, height: 64, rx: 12, fill: C.blue}); el('circle', {cx, cy: GY - 146, r: 12, fill: C.white});
    const r = 84, a0 = -0.35 * Math.PI, a1 = 1.15 * Math.PI, py = GY - 146, P = a => [cx + r * Math.cos(a), py + r * Math.sin(a)];
    const [sx, sy] = P(a0), [ex, ey] = P(a1);
    el('path', {d: `M ${sx} ${sy} A ${r} ${r} 0 1 0 ${ex} ${ey}`, stroke: C.yellow, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round'});
    el('path', {d: `M ${ex - 4} ${ey - 26} L ${ex} ${ey} L ${ex + 24} ${ey - 8}`, stroke: C.yellow, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}) }
  // 3. Réunion de crise : table et trois personnes, alerte
  { const cx = cols[2];
    [-90, 0, 90].forEach((dx, k) => person(cx + dx, GY - 148, 40, [C.turq, C.violet, C.lblue][k]));
    el('rect', {x: cx - 150, y: GY - 104, width: 300, height: 30, rx: 10, fill: C.blue});
    el('path', {d: `M ${cx - 120} ${GY - 74} V ${GY - 4} M ${cx + 120} ${GY - 74} V ${GY - 4}`, stroke: C.blue, 'stroke-width': 9, 'stroke-linecap': 'round'});
    el('circle', {cx: cx + 130, cy: GY - 236, r: 32, fill: C.red, stroke: C.white, 'stroke-width': 6});
    el('path', {d: `M ${cx + 130} ${GY - 252} V ${GY - 234}`, stroke: C.white, 'stroke-width': 8, 'stroke-linecap': 'round'}); el('circle', {cx: cx + 130, cy: GY - 220, r: 5, fill: C.white}) }
  // Libellés (deux lignes au plus)
  const lab = [['Stock tampon'], ['Poste', 'de retouche'], ['Réunion', 'de crise']];
  lab.forEach((ls, i) => ls.forEach((s, k) => { const t = tx(S, cols[i], 540 + k * 50 + (ls.length === 1 ? 24 : 0), s, {size: 44, weight: 700, anchor: 'middle'}); fit(t, cols[i] - 186, cols[i] + 186, s) }));
  // La loupe, posée sur le poste de retouche
  const LX = cols[1], LY = GY - 150, LR = 150;
  el('path', {d: `M ${LX + LR * 0.72} ${LY + LR * 0.72} L ${LX + LR * 1.1} ${LY + LR * 1.1}`, stroke: C.ink, 'stroke-width': 32, 'stroke-linecap': 'round'});
  el('circle', {cx: LX, cy: LY, r: LR, fill: C.blue, 'fill-opacity': 0.06, stroke: C.ink, 'stroke-width': 16});
});
