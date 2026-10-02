// E4 · Découvrir « Garder les outils sous la main » — l'éventail des fiches Lean, 40 outils à ressortir. Accent jaune.
start(() => {
  const W = 1200, H = 700; size(W, H); bg(W, H, 'e4');
  const PX = 556, PY = 1260, CW = 292, CH = 392, top = 168;
  const heads = [C.turq, C.violet, C.red, C.lblue, C.blue];
  const angles = [-20, -10, 0, 10, 20];
  const pict = [
    (g, x, y) => { [0, 1, 2].forEach(k => brick(x + 70 + k * 80, y + 70, 64, 46, k === 1 ? C.green : C.blue, undefined, {p: g})) },
    (g, x, y) => { el('path', {d: `M ${x + 40} ${y + 70} H ${x + 230}`, stroke: C.blue, 'stroke-width': 7, 'stroke-linecap': 'round'}, g);
      [0, 1].forEach(k => [-1, 1].forEach(s => el('path', {d: `M ${x + 80 + k * 70} ${y + 70 + s * 46} L ${x + 110 + k * 70} ${y + 70}`, stroke: C.stitch, 'stroke-width': 6, 'stroke-linecap': 'round'}, g)));
      el('rect', {x: x + 228, y: y + 46, width: 40, height: 48, rx: 10, fill: C.red}, g) },
    (g, x, y) => { stopwatch(x + CW / 2, y + 82, 40, {col: C.ink, p: g}) },
    (g, x, y) => { [0, 1, 2].forEach(k => { check(x + 64, y + 30 + k * 44, 15, C.green, g); el('rect', {x: x + 92, y: y + 22 + k * 44, width: 150 - k * 24, height: 16, rx: 8, fill: C.line}, g) }) },
    (g, x, y) => { [100, 70, 46, 28].forEach((h, k) => el('rect', {x: x + 60 + k * 50, y: y + 120 - h, width: 38, height: h, rx: 6, fill: k < 1 ? C.blue : C.stitch}, g));
      el('path', {d: `M ${x + 48} ${y + 123} H ${x + 262}`, stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round'}, g) },
  ];
  angles.forEach((a, i) => {
    const g = el('g', {transform: `rotate(${a} ${PX} ${PY})`}); const x = PX - CW / 2, y = top;
    el('rect', {x, y, width: CW, height: CH, rx: 26, fill: C.card, stroke: EDGE.e4, 'stroke-width': 4}, g);
    el('path', {d: `M ${x} ${y + 26} Q ${x} ${y} ${x + 26} ${y} H ${x + CW - 26} Q ${x + CW} ${y} ${x + CW} ${y + 26} V ${y + 64} H ${x} Z`, fill: heads[i]}, g);
    el('rect', {x: x + 28, y: y + 24, width: 120, height: 16, rx: 8, fill: C.white, opacity: 0.85}, g);
    pict[i](g, x, y + 92);
    [0, 1, 2].forEach(k => el('rect', {x: x + 34, y: y + 268 + k * 36, width: [220, 180, 200][k], height: 16, rx: 8, fill: C.line}, g));
    const r = g.getBoundingClientRect(); if (r.left < 40 || r.right > 1160 || r.top < 40 || r.bottom > H - 30) errs.push('carte ' + i + ' ' + [r.left, r.right, r.top, r.bottom].map(Math.round));
  });
  // Sceau : 40 outils
  const t = seal(1022, 196, 120, ['40', 'outils'], {size: 54, rot: 8}); t[0].setAttribute('font-size', 76); t[0].setAttribute('y', 196 - 8);
  t[1].setAttribute('y', 196 + 50);
});
