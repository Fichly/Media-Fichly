// E4 · Formation « Passer à la Green Belt » — après la White Belt, la ceinture verte, certifiante et éligible au CPF. Accent jaune.
start(() => {
  const W = 1200, H = 576; size(W, H); bg(W, H, 'e4');
  // La White Belt (pilule neutre, sans coche)
  const px = 44, py = 48;
  el('rect', {x: px, y: py, width: 424, height: 104, rx: 52, fill: C.card, stroke: EDGE.e4, 'stroke-width': 4});
  const w = tx(S, px + 212, py + 69, 'White Belt', {size: 48, weight: 700, anchor: 'middle'}); fit(w, px + 40, px + 384, 'white');
  // Flèche vers la Green Belt
  el('path', {d: `M ${px + 450} ${py + 52} Q ${px + 640} ${py + 52} ${px + 652} ${py + 182}`, stroke: C.blue, 'stroke-width': 8, 'stroke-dasharray': '16 12', 'stroke-linecap': 'round', fill: 'none'});
  el('path', {d: `M ${px + 632} ${py + 170} L ${px + 653} ${py + 194} L ${px + 674} ${py + 168}`, stroke: C.blue, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'});
  // La ceinture verte
  belt({L: 110, R: 1010, top: 270, th: 92, sag: 22, fill: C.green, stroke: C.ink, stitch: C.white, label: 'GREEN BELT', labelColor: C.ink, knot: 0.4, offset: '50%'});
  // Sceau CPF
  seal(1040, 156, 112, ['CPF'], {size: 62, rot: 10});
});
