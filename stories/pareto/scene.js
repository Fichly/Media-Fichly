// Story · Analyse de Pareto (famille 3, Planification et stratégie)
// Données de l'article diagramme-de-pareto-methode-exemple, jeu construit pour la démonstration :
// 6 causes d'arrêt, 88 / 46 / 30 / 18 / 12 / 6 occurrences sur 200, cumul 44 / 67 / 82 / 91 / 97 / 100 %.
// D'où la mention « Exemple illustratif » à l'écran.
Story.scene({
  famille: 3,
  outil: 'Analyse de Pareto',
  titre: ['Pareto'],
  accroche: { lignes: ['Des arrêts partout.', 'Par où commencer ?'], accent: 1 },
  retenir: 'Quelques causes font le gros du problème. Commencez par elles.',
  poster: 10.6,

  build(S, A, root) {
    const { el, text, width, C, ZONE } = A;
    const AX = 1330, K = 520 / 200;                       // 100 % = 520 px, une occurrence = 2,6 px
    const occ = [88, 46, 30, 18, 12, 6];
    const slots = [250, 370, 490, 610, 730, 850];
    const order = [2, 5, 0, 4, 1, 3];                     // place de chaque barre avant le tri
    S.AX = AX;
    S.axis = el('line', { x1: 160, y1: AX, x2: 920, y2: AX, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, root);
    S.bars = occ.map((v, i) => {
      const g = el('g', {}, root);
      const r = el('rect', { x: -45, y: 0, width: 90, height: 0, rx: 8, fill: C.coral }, g);
      return { g, r, h: v * K, from: slots[order[i]], to: slots[i], i };
    });
    // Courbe cumulée
    let c = 0;
    const pts = [[160, AX]].concat(occ.map((v, i) => { c += v; return [slots[i] + 45, AX - c * K]; }));
    S.pts = pts;
    S.curve = el('path', { d: 'M ' + pts.map(p => p.join(' ')).join(' L '), fill: 'none', stroke: C.indigo, 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, root);
    S.dots = el('g', {}, root);
    pts.slice(1).forEach(p => el('circle', { cx: p[0], cy: p[1], r: 9, fill: C.indigo }, S.dots));
    // Lecture : 3 causes = 82 %
    const p3 = pts[3];
    S.read = el('g', {}, root);
    el('line', { x1: 150, y1: p3[1], x2: p3[0], y2: p3[1], stroke: C.indigo, 'stroke-width': 4, 'stroke-dasharray': '12 10' }, S.read);
    el('line', { x1: p3[0], y1: p3[1], x2: p3[0], y2: AX, stroke: C.indigo, 'stroke-width': 4, 'stroke-dasharray': '12 10' }, S.read);
    text(S.read, 160, p3[1] - 18, '82 %', { size: 36, weight: 700, fill: C.indigo });
    // Flèche « commencer par là »
    S.arrow = A.arrow(root, 250, p3[1] - 6, 250, AX - occ[0] * K - 18, { color: C.ok, sw: 12, head: 38 }).g;
    // Mention permanente
    S.demo = el('g', {}, root);
    text(S.demo, ZONE.x + ZONE.w, 1388, 'Exemple illustratif', { size: 30, weight: 600, fill: C.ink500, anchor: 'end', italic: true });
    // Légendes successives
    const cap = (str, parts) => {
      const g = el('g', {}, root);
      const t = text(g, 540, 732, '', { size: 52, weight: 700, fill: C.ink, anchor: 'middle' });
      (parts || [[str, C.ink]]).forEach(([s, f]) => { const sp = document.createElementNS('http://www.w3.org/2000/svg', 'tspan'); sp.setAttribute('fill', f); sp.textContent = s; t.appendChild(sp); });
      A.fit(t, ZONE.x + ZONE.w, 'légende', ZONE.x);
      return g;
    };
    S.caps = [
      [cap('6 causes en vrac'), 3.2, 4.65],
      [cap('Trier par poids'), 4.8, 6.25],
      [cap('Cumuler les parts'), 6.4, 7.95],
      [cap('', [['3 causes : ', C.ink], ['82 %', C.indigo]]), 8.1, 9.65],
      [cap('Commencer par là'), 9.8, null],
    ];
  },

  anim(t, S, A) {
    const { show, prog, easeOut, easeInOut, lerp, stroke, C } = A;
    stroke(S.axis, t, 3.0, 0.3);
    show(S.demo, t, 3.2, { dur: 0.4, from: 'fade' });
    const fade = prog(t, 8.2, 0.4);
    S.bars.forEach((b, k) => {
      const h = b.h * easeOut(prog(t, 3.3 + b.from / 1000, 0.45));
      const p = easeInOut(prog(t, 4.95 + k * 0.05, 0.8));
      const x = lerp(b.from, b.to, p), lift = Math.sin(p * Math.PI) * 34;
      b.g.setAttribute('transform', `translate(${x.toFixed(2)} ${(S.AX - h - lift).toFixed(2)})`);
      b.r.setAttribute('height', h.toFixed(2));
      b.r.setAttribute('fill', b.i < 3 && fade > 0.5 ? C.indigo : C.coral);
      b.g.setAttribute('opacity', b.i >= 3 ? (1 - 0.65 * fade).toFixed(3) : 1);
    });
    stroke(S.curve, t, 6.5, 1.3, p => p);
    S.dots.setAttribute('opacity', prog(t, 7.6, 0.3).toFixed(3));
    show(S.read, t, 8.15, { dur: 0.4, from: 'fade' });
    show(S.arrow, t, 9.9, { dur: 0.4, from: 'down', d: 60 });
    S.caps.forEach(([g, s, o]) => show(g, t, s, { dur: 0.35, from: 'up', d: 20, out: o, outDur: 0.15 }));
  },
});
