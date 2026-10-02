// E4 · Équipe « Embarquer votre équipe » — l'opérateur, le manager et la direction, réunis par une même ceinture
// (une formation commune, gratuite). Accent jaune.
start(() => {
  const W = 1200, H = 760; size(W, H); bg(W, H, 'e4');
  const roles = [['L’opérateur', C.turq], ['Le manager', C.violet], ['La direction', C.lblue]];
  const BW = 340, BH = 232, GAP = (W - 80 - 3 * BW) / 2, BY = 44;
  const BT = 446, L = 120, R = 1080;
  roles.forEach(([name, col], i) => {
    const x = 40 + i * (BW + GAP), cx = x + BW / 2;
    el('path', {d: `M ${cx} ${BY + BH + 18} V ${BT - 6}`, stroke: C.stitch, 'stroke-width': 5, 'stroke-dasharray': '12 10', 'stroke-linecap': 'round'});
    el('rect', {x, y: BY, width: BW, height: BH, rx: 30, fill: C.card, stroke: EDGE.e4, 'stroke-width': 4});
    el('path', {d: `M ${cx - 24} ${BY + BH - 2} L ${cx} ${BY + BH + 26} L ${cx + 24} ${BY + BH - 2} Z`, fill: C.card, stroke: EDGE.e4, 'stroke-width': 4, 'stroke-linejoin': 'round'});
    el('rect', {x: cx - 30, y: BY + BH - 8, width: 60, height: 10, fill: C.card});
    person(cx, BY + 84, 52, col);
    const t = tx(S, cx, BY + 192, name, {size: 48, weight: 700, anchor: 'middle'}); fit(t, x + 14, x + BW - 14, name);
  });
  belt({L, R, top: BT, th: 84, sag: 20, label: 'WHITE BELT', knot: 0.64, offset: '9%'});
  seal(1010, 608, 144, ['Gratuite'], {size: 48, rot: -8});
});
