// E0 « Votre formation est ouverte » — le parcours : six chapitres courts, un test de dix questions,
// la ceinture blanche et l'attestation, en environ une heure. Accent lavande.
start(() => {
  const W = 1200, H = 664; size(W, H); bg(W, H, 'e0');
  const RY = 116;
  const xs = [0, 1, 2, 3, 4, 5].map(i => 112 + i * 136), XT = 978;
  const L = 262, R = 930, BT = 342, th = 84, sag = 22;
  const RX = 1150, BY = BT + th / 2;
  // Le chemin : des chapitres à la ceinture
  el('path', {d: `M 48 ${RY} H ${RX - 44} Q ${RX} ${RY} ${RX} ${RY + 44} V ${BY - 44} Q ${RX} ${BY} ${RX - 44} ${BY} H ${R - 20}`, fill: 'none', stroke: C.blue, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'});
  el('circle', {cx: 48, cy: RY, r: 13, fill: C.blue});
  xs.forEach((x, i) => brick(x, RY, 108, 84, C.blue, i + 1, {size: 52}));
  el('rect', {x: XT - 82, y: RY - 42, width: 164, height: 84, rx: 18, fill: C.yellow});
  tx(S, XT, RY + 17, 'Test', {size: 48, weight: 800, fill: C.ink, anchor: 'middle'});
  // Accolades cousues
  const bY = RY + 62;
  el('path', {d: `M ${xs[0] - 54} ${bY} v 16 H ${xs[5] + 54} v -16`, fill: 'none', stroke: C.stitch, 'stroke-width': 5, 'stroke-dasharray': '13 9', 'stroke-linecap': 'round'});
  const l1 = tx(S, (xs[0] + xs[5]) / 2, bY + 74, '6 chapitres courts', {size: 54, weight: 700, anchor: 'middle'}); fit(l1, 40, 860, 'l1');
  el('path', {d: `M ${XT - 78} ${bY} v 16 H ${XT + 78} v -16`, fill: 'none', stroke: C.stitch, 'stroke-width': 5, 'stroke-dasharray': '13 9', 'stroke-linecap': 'round'});
  const l2 = tx(S, XT, bY + 74, '10 questions', {size: 48, weight: 700, anchor: 'middle'}); fit(l2, 760, RX - 14, 'l2');
  // Ceinture blanche
  belt({L, R, top: BT, th, sag, label: 'WHITE BELT', knot: 0.36, offset: '47%'});
  // Sceau : la durée
  seal(150, BT + 52, 132, ['environ', '1 h'], {size: 48, rot: -10});
  // L'attestation
  const la = tx(S, RX, 622, 'Votre attestation', {size: 48, weight: 700, anchor: 'end'}); fit(la, 640, 1160, 'attestation');
  check(la.getBBox().x - 48, 606, 34);
});
