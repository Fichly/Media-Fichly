// E1 « Suivez une pièce : elle attend » — la rangée de postes (stock, en-cours, machine, expédition), le chronomètre
// accroché à la pièce, puis les deux totaux de l'exercice et l'écart. Accent turquoise.
start(() => {
  const W = 1200, H = 668; size(W, H); bg(W, H, 'e1');
  const X0 = 60, X1 = 1140;
  // Trajet de la pièce
  const PY = 168;
  el('path', {d: `M ${X0 - 14} ${PY} H ${X1 + 4}`, stroke: C.blue, 'stroke-width': 6, 'stroke-dasharray': '16 13', 'stroke-linecap': 'round', fill: 'none'});
  el('path', {d: `M ${X1 - 12} ${PY - 16} L ${X1 + 8} ${PY} L ${X1 - 12} ${PY + 16}`, stroke: C.blue, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'});
  const SW = 206, SH = 176, SY = PY - SH / 2, xs = [X0 + 6, 352, 640, 928];
  const station = (x, kind) => {
    const g = el('g');
    el('rect', {x, y: SY, width: SW, height: SH, rx: 28, fill: C.white, stroke: kind === 'machine' ? C.green : '#c4e3e3', 'stroke-width': kind === 'machine' ? 6 : 4}, g);
    const cx = x + SW / 2, cy = PY + 6;
    if (kind === 'stock') {
      const box = (bx, by, w, h) => { el('rect', {x: bx, y: by, width: w, height: h, rx: 7, fill: C.pLav, stroke: C.blue, 'stroke-width': 5}, g);
        el('path', {d: `M ${bx + w / 2} ${by} V ${by + 16}`, stroke: C.blue, 'stroke-width': 5}, g) };
      box(cx - 64, cy - 2, 62, 48); box(cx + 2, cy - 2, 62, 48); box(cx - 31, cy - 54, 62, 48);
    }
    if (kind === 'queue') {
      el('path', {d: `M ${cx - 72} ${cy + 20} H ${cx + 72} M ${cx - 58} ${cy + 20} V ${cy + 50} M ${cx + 58} ${cy + 20} V ${cy + 50}`, stroke: C.blue, 'stroke-width': 6, 'stroke-linecap': 'round'}, g);
      [-46, 0, 46].forEach(dx => { el('rect', {x: cx + dx - 19, y: cy - 22, width: 38, height: 38, rx: 8, fill: C.pLav, stroke: C.blue, 'stroke-width': 5}, g);
        el('circle', {cx: cx + dx, cy: cy - 3, r: 6, fill: C.blue}, g) });
      el('rect', {x: cx - 19, y: cy - 66, width: 38, height: 38, rx: 8, fill: C.pLav, stroke: C.blue, 'stroke-width': 5}, g);
      el('circle', {cx, cy: cy - 47, r: 6, fill: C.blue}, g);
    }
    if (kind === 'machine') {
      el('rect', {x: cx - 58, y: cy - 60, width: 116, height: 108, rx: 14, fill: C.blue}, g);
      el('rect', {x: cx - 42, y: cy - 46, width: 84, height: 30, rx: 6, fill: C.white}, g);
      const gx = cx, gy = cy + 14, R = 20, n = 8, pts = [];
      for (let i = 0; i < n * 2; i++) { const a = Math.PI * i / n, rr = i % 2 ? R : R + 8; pts.push([gx + rr * Math.cos(a), gy + rr * Math.sin(a)]) }
      el('path', {d: 'M ' + pts.map(q => q.map(v => v.toFixed(1)).join(' ')).join(' L ') + ' Z', fill: C.green}, g);
      el('circle', {cx: gx, cy: gy, r: 8, fill: C.blue}, g);
    }
    if (kind === 'truck') {
      el('rect', {x: cx - 72, y: cy - 46, width: 94, height: 66, rx: 8, fill: C.pLav, stroke: C.blue, 'stroke-width': 5}, g);
      el('path', {d: `M ${cx + 22} ${cy - 26} H ${cx + 50} L ${cx + 72} ${cy - 2} V ${cy + 20} H ${cx + 22} Z`, fill: C.white, stroke: C.blue, 'stroke-width': 5, 'stroke-linejoin': 'round'}, g);
      el('circle', {cx: cx - 44, cy: cy + 30, r: 13, fill: C.white, stroke: C.blue, 'stroke-width': 6}, g);
      el('circle', {cx: cx + 44, cy: cy + 30, r: 13, fill: C.white, stroke: C.blue, 'stroke-width': 6}, g);
    }
    const bx = x + SW - 14, by = SY + 12;
    if (kind === 'machine') checkBadge(bx, by, 27, g); else clockBadge(bx, by, 27, C.red, g);
  };
  station(xs[0], 'stock'); station(xs[1], 'queue'); station(xs[2], 'machine'); station(xs[3], 'truck');
  // La pièce, chronomètre accroché, dans l'allée entre le stock et l'en-cours
  const px = (xs[0] + SW + xs[1]) / 2;
  el('rect', {x: px - 24, y: PY - 24, width: 48, height: 48, rx: 10, fill: C.blue, stroke: TINT.e1, 'stroke-width': 5});
  el('circle', {cx: px, cy: PY, r: 8, fill: C.white});
  el('path', {d: `M ${px} ${PY - 28} V ${PY - 44}`, stroke: C.ink, 'stroke-width': 5});
  stopwatch(px, PY - 72, 24, {col: C.ink});
  // Les deux totaux
  const mx = xs[2] + SW / 2;
  const l1 = tx(S, X0, 336, 'Temps total', {size: 50, weight: 700}); fit(l1, 40, 1160, 'l1');
  const A = [360, 78];
  el('rect', {x: X0, y: A[0], width: X1 - X0, height: A[1], rx: A[1] / 2, fill: C.red});
  el('rect', {x: mx - 21, y: A[0] - 4, width: 42, height: A[1] + 8, fill: TINT.e1});
  el('rect', {x: mx - 15, y: A[0] - 4, width: 30, height: A[1] + 8, rx: 7, fill: C.green});
  el('path', {d: `M ${mx} ${SY + SH + 14} V ${A[0] - 16}`, stroke: C.green, 'stroke-width': 6, 'stroke-dasharray': '9 10', 'stroke-linecap': 'round'});
  const l2 = tx(S, X0, 528, 'Temps de transformation', {size: 50, weight: 700}); fit(l2, 40, 1160, 'l2');
  const B = [552, 78], GW = 64;
  el('rect', {x: X0, y: B[0], width: GW, height: B[1], rx: 16, fill: C.green});
  el('rect', {x: X0 + GW + 18, y: B[0] + 3, width: X1 - X0 - GW - 21, height: B[1] - 6, rx: (B[1] - 6) / 2, fill: C.card, stroke: C.blue, 'stroke-width': 5, 'stroke-dasharray': '16 11'});
  const te = tx(S, (X0 + GW + 18 + X1) / 2, B[0] + B[1] / 2 + 17, 'L’écart' + NB + ': votre premier chantier', {size: 48, weight: 700, fill: C.blue, anchor: 'middle'});
  fit(te, X0 + GW + 40, X1 - 24, 'ecart');
});
