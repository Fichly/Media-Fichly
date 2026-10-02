// Story · Obeya (famille 2, Engagement et visualisation)
// Repris de l'article obeya-salle-pilotage-visuel : chaque métier travaillait sur sa version du projet ;
// cinq zones lues dans l'ordre (objectif et écart, plan et avancement, problèmes ouverts, indicateurs
// avec seuil, décisions à prendre) ; un rendez-vous court, debout, à heure fixe ; on y décide.
Story.scene({
  famille: 2,
  outil: 'Obeya',
  titre: ['Obeya'],
  accroche: { lignes: ['Chacun travaille sur', 'sa version du projet.'], accent: 1 },
  retenir: 'Une Obeya se mesure aux décisions prises devant elle.',
  poster: 10.6,

  build(S, A, root) {
    const { el, text, C, ZONE, cross, check, clock } = A;
    const WX = 110, WY = 860, WW = 860, WH = 420, CW = WW / 5;
    S.WX = WX; S.WY = WY; S.CW = CW;
    // Quatre versions éparses du projet
    const spots = [[200, 930, -12], [800, 910, 8], [230, 1230, -5], [780, 1250, 14]];
    S.sheets = spots.map(([x, y, a], i) => {
      const g = el('g', {}, root);
      el('rect', { x: -80, y: -60, width: 160, height: 120, rx: 10, fill: C.white, stroke: C.ink, 'stroke-width': 3 }, g);
      const ys = [[30, 10, 25, -15], [20, -20, 0, -5], [-10, 15, -25, 5], [25, 0, 10, -25]][i];
      el('polyline', { points: ys.map((v, k) => `${-55 + k * 36} ${v}`).join(' '), fill: 'none', stroke: C.ink500, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
      cross(g, 62, -42, 16, C.coral, C.ink);
      return { g, x, y, a, tx: WX + CW * (i + 0.5) + CW / 2, ty: WY + WH / 2 };
    });
    // Le mur et ses cinq zones
    S.wall = el('g', {}, root);
    el('rect', { x: WX, y: WY, width: WW, height: WH, rx: 18, fill: C.greenSoft, stroke: C.ink, 'stroke-width': 4 }, S.wall);
    for (let i = 1; i < 5; i++) el('line', { x1: WX + CW * i, y1: WY + 16, x2: WX + CW * i, y2: WY + WH - 16, stroke: C.ink, 'stroke-width': 2, opacity: 0.35 }, S.wall);
    S.zones = [];
    for (let i = 0; i < 5; i++) {
      const cx = WX + CW * (i + 0.5), g = el('g', {}, S.wall);
      el('circle', { cx, cy: WY + 52, r: 26, fill: C.green }, g);
      text(g, cx, WY + 63, String(i + 1), { size: 30, weight: 700, fill: C.ink, anchor: 'middle' });
      const pg = el('g', {}, g), my = WY + 230;
      if (i === 0) { // objectif et écart
        el('circle', { cx, cy: my, r: 48, fill: 'none', stroke: C.ink, 'stroke-width': 4 }, pg);
        el('circle', { cx, cy: my, r: 18, fill: C.ink }, pg);
        el('circle', { cx: cx + 40, cy: my + 58, r: 10, fill: C.coral }, pg);
      } else if (i === 1) { // plan
        el('line', { x1: cx - 60, y1: my, x2: cx + 60, y2: my, stroke: C.ink, 'stroke-width': 4 }, pg);
        [-50, 0, 50].forEach((d, k) => el('rect', { x: cx + d - 10, y: my - 10, width: 20, height: 20, transform: `rotate(45 ${cx + d} ${my})`, fill: k < 2 ? C.ink : C.white, stroke: C.ink, 'stroke-width': 3 }, pg));
      } else if (i === 2) { // problèmes ouverts
        [0, 1, 2].forEach(k => el('rect', { x: cx - 50, y: my - 66 + k * 46, width: 100, height: 36, rx: 6, fill: k === 0 ? C.coral : C.white, stroke: C.ink, 'stroke-width': 3 }, pg));
      } else if (i === 3) { // indicateurs avec seuil
        el('line', { x1: cx - 60, y1: my - 20, x2: cx + 60, y2: my - 20, stroke: C.coral, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, pg);
        el('polyline', { points: `${cx - 60} ${my + 40} ${cx - 30} ${my + 10} ${cx} ${my + 25} ${cx + 30} ${my - 30} ${cx + 60} ${my - 10}`, fill: 'none', stroke: C.ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, pg);
      } else { // décisions
        S.dec = el('rect', { x: cx - 64, y: my - 80, width: 128, height: 160, rx: 10, fill: C.white, stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, pg);
        S.decLines = [0, 1, 2].map(k => el('line', { x1: cx - 44, y1: my - 36 + k * 36, x2: cx + (k === 2 ? 10 : 44), y2: my - 36 + k * 36, stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, pg));
        S.decCheck = check(pg, cx + 52, my - 78, 24, C.green, C.ink);
        S.decCx = cx; S.decCy = my;
      }
      S.zones.push({ g, cx });
    }
    // Curseur de lecture
    S.cursor = el('rect', { x: 0, y: WY + WH - 30, width: CW - 40, height: 10, rx: 5, fill: C.indigo }, root);
    // Horloge : à heure fixe
    S.clock = clock(root, 905, 800, 36, { color: C.ink });
    S.clock.turn(0);
    // Légendes
    const cap = str => { const g = el('g', {}, root); A.fit(text(g, 540, 732, str, { size: 52, weight: 700, fill: C.ink, anchor: 'middle' }), ZONE.x + ZONE.w - 90, 'légende', ZONE.x); return g; };
    S.caps = [[cap('Un seul mur'), 3.15, 4.45], [cap('Lu dans l’ordre'), 4.6, 6.35], [cap('Debout, à heure fixe'), 6.5, 8.25], [cap('Une décision écrite'), 8.4, 9.95], [cap('Décider, pas informer'), 10.1, null]];
  },

  anim(t, S, A) {
    const { show, prog, easeInOut, lerp, stroke, C } = A;
    // Les versions éparses convergent vers le mur, qui les remplace
    S.sheets.forEach((sh, i) => {
      const pin = prog(t, 3.0 + i * 0.08, 0.3), p = easeInOut(prog(t, 3.6 + i * 0.06, 0.6));
      const x = lerp(sh.x, 540, p), y = lerp(sh.y, 1070, p), a = lerp(sh.a, 0, p), k = lerp(1, 0.5, p);
      sh.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(2)}) scale(${k.toFixed(3)})`);
      sh.g.setAttribute('opacity', (pin * (1 - prog(t, 4.15, 0.3))).toFixed(3));
    });
    show(S.wall, t, 4.1, { dur: 0.45, from: 'pop', cx: 540, cy: 1070 });
    // Lecture zone par zone
    const seg = Math.min(4, Math.max(0, (t - 4.7) / 0.4));
    const z = t < 8.4 ? seg : 4;
    S.cursor.setAttribute('x', (S.WX + 20 + S.CW * z).toFixed(1));
    S.cursor.setAttribute('opacity', prog(t, 4.6, 0.25).toFixed(3));
    S.zones.forEach((zn, i) => zn.g.setAttribute('opacity', t < 4.6 ? 1 : (Math.abs(z - i) < 0.6 || t > 6.4 ? 1 : 0.45).toFixed(2)));
    // Horloge
    show(S.clock.g, t, 6.55, { from: 'pop', cx: 905, cy: 800, dur: 0.4 });
    S.clock.turn(90 * easeInOut(prog(t, 6.8, 1.3)));
    // Décision écrite en zone 5
    const f = prog(t, 8.5, 0.35);
    S.dec.setAttribute('fill', f > 0.5 ? C.white : C.white);
    S.dec.setAttribute('stroke', f > 0.5 ? C.ok : C.ink);
    S.dec.setAttribute('stroke-dasharray', f > 0.5 ? 'none' : '10 8');
    S.decLines.forEach((l, k) => stroke(l, t, 8.7 + k * 0.25, 0.3));
    show(S.decCheck, t, 9.5, { from: 'pop', cx: S.decCx + 52, cy: S.decCy - 78, dur: 0.4 });
    S.caps.forEach(([g, s, o]) => show(g, t, s, { dur: 0.35, from: 'up', d: 20, out: o, outDur: 0.15 }));
  },
});
