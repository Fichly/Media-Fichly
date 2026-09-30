// Blog · Value Stream Mapping · section « Les symboles de la VSM : le tableau complet »
// Refait en animé l'image fichly-symboles-vsm.png. Douze vignettes dans l'ordre de lecture ; chaque symbole fait ce
// qu'il représente : le camion part de l'usine, la boîte de données se remplit, le stock se convertit en jours,
// la flèche rayée pousse, le flux tiré prend dans le supermarché, la carte kanban remonte, le papier avance
// lentement sur la flèche fine, l'impulsion file sur la flèche brisée, le lissage aligne sa séquence, l'éclair éclate.
// Sous chaque symbole : son nom et ce qu'on écrit dedans (tableau de l'article). Valeurs des exemples illustratives.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const COLS = [40, 322, 604, 886], ROWS = [180, 374, 568], TW = 272, TH = 184;
  const T0 = 1.8, STEP = 0.72, ANIM = 0.8;
  const CHUTE_T = 11.3;
  const S = { tiles: [] };

  // ---------- Petits dessins ----------
  function factory(parent, cx, by, w = 92, h = 58) {
    const L = cx - w / 2, R = cx + w / 2, t = by - h, m = by - h * 0.55;
    return el('path', { d: `M ${L} ${by} L ${L} ${m} L ${L + w / 3} ${t} L ${L + w / 3} ${m} L ${L + 2 * w / 3} ${t} L ${L + 2 * w / 3} ${m} L ${R} ${t} L ${R} ${by} Z`, fill: C.white, stroke: C.blue, 'stroke-width': 3, 'stroke-linejoin': 'round' }, parent);
  }
  function truck(parent) {
    const g = el('g', {}, parent);
    el('rect', { x: -22, y: -18, width: 30, height: 20, rx: 2, fill: C.blue }, g);
    el('path', { d: 'M 10 -12 L 18 -12 L 23 -5 L 23 2 L 10 2 Z', fill: C.blue }, g);
    el('circle', { cx: -14, cy: 4, r: 4.5, fill: C.ink, stroke: C.white, 'stroke-width': 1.5 }, g);
    el('circle', { cx: 14, cy: 4, r: 4.5, fill: C.ink, stroke: C.white, 'stroke-width': 1.5 }, g);
    return g;
  }
  function operator(parent, cx, by, k = 1) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: by - 30 * k, r: 9 * k, fill: C.blue }, g);
    el('path', { d: `M ${cx - 17 * k} ${by} A ${17 * k} ${17 * k} 0 0 1 ${cx + 17 * k} ${by} Z`, fill: C.blue }, g);
    return g;
  }
  function kanbanCard(parent, label) {
    const g = el('g', {}, parent);
    el('path', { d: 'M -30 -20 L 20 -20 L 30 -10 L 30 20 L -30 20 Z', fill: C.white, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    el('path', { d: 'M 20 -20 L 20 -10 L 30 -10', fill: 'none', stroke: C.blue, 'stroke-width': 2 }, g);
    text(g, 0, 7, label, { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
    return g;
  }
  function burst(parent, cx, cy, r1, r2, n = 12) {
    let d = '';
    for (let i = 0; i < 2 * n; i++) {
      const r = i % 2 ? r2 : r1, a = Math.PI * i / n - Math.PI / 2;
      d += `${i ? 'L' : 'M'} ${cx + r * Math.cos(a) * 1.35} ${cy + r * Math.sin(a)} `;
    }
    return el('path', { d: d + 'Z', fill: C.yellow, stroke: C.red, 'stroke-width': 3, 'stroke-linejoin': 'round' }, parent);
  }
  function zigzag(x1, x2, y) {
    const m = (x1 + x2) / 2, d = Math.sign(x2 - x1);
    return `M ${x1} ${y} L ${m - 10 * d} ${y} L ${m + 8 * d} ${y - 18} L ${m + 8 * d} ${y} L ${x2} ${y}`;
  }

  // ---------- Vignettes : dessin (build) et animation (p de 0 à 1, 1 = état final) ----------
  const TILES = [
    { name: 'Fournisseur ou client', say: 'nom, fréquence de livraison', make(g, cx, cy) {
      factory(g, cx - 40, cy + 30, 96, 62);
      const tr = truck(g);
      const lab = text(g, cx + 76, cy - 18, `2${NB}× / sem.`, { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
      return p => { tr.setAttribute('transform', `translate(${cx + 22 + 54 * easeOut(p)} ${cy + 26})`); tr.setAttribute('opacity', clamp(p * 4)); lab.setAttribute('opacity', clamp((p - 0.6) / 0.3)); };
    } },
    { name: 'Processus', say: 'nom, nombre d’opérateurs', make(g, cx, cy) {
      el('rect', { x: cx - 84, y: cy - 22, width: 168, height: 58, rx: 6, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, g);
      text(g, cx - 26, cy + 14, 'Découpe', { size: 19, weight: 700, fill: C.blue, anchor: 'middle' });
      const op = el('g', {}, g);
      operator(op, cx + 48, cy + 26, 0.8);
      text(op, cx + 70, cy + 22, '2', { size: 18, weight: 800, fill: C.blue, anchor: 'middle' });
      return p => { const s = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p); op.setAttribute('transform', s === 1 ? '' : `translate(${cx + 56} ${cy + 10}) scale(${s}) translate(${-cx - 56} ${-cy - 10})`); op.setAttribute('opacity', clamp(p * 3)); };
    } },
    { name: 'Boîte de données', say: 'C/T, C/O, disponibilité', make(g, cx, cy) {
      el('rect', { x: cx - 86, y: cy - 38, width: 172, height: 90, rx: 4, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, g);
      const rows = [['C/T', '45 s'], ['C/O', '20 min'], ['Uptime', `85${NB}%`]].map(([a, b], i) => {
        const r = el('g', {}, g);
        text(r, cx - 72, cy - 12 + 27 * i, a, { size: 17, weight: 700, fill: C.blue });
        text(r, cx + 72, cy - 12 + 27 * i, b, { size: 17, weight: 500, fill: C.ink, anchor: 'end' });
        return r;
      });
      return p => rows.forEach((r, i) => r.setAttribute('opacity', clamp(p * 3 - i)));
    } },
    { name: 'Stock', say: 'quantité et conversion en jours', make(g, cx, cy) {
      el('path', { d: `M ${cx - 76} ${cy + 36} L ${cx - 44} ${cy - 22} L ${cx - 12} ${cy + 36} Z`, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      text(g, cx - 44, cy + 28, 'I', { size: 22, weight: 800, fill: C.tYellow, anchor: 'middle' });
      text(g, cx + 44, cy + 2, '300 pcs', { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });
      const d = text(g, cx + 44, cy + 30, `= 3${NB}j`, { size: 21, weight: 800, fill: C.tRed, anchor: 'middle' });
      return p => d.setAttribute('opacity', clamp((p - 0.4) / 0.3));
    } },
    { name: 'Flux poussé', say: 'rien : c’est un constat', make(g, cx, cy) {
      const x1 = cx - 100, x2 = cx + 100, y = cy + 20, hx = x2 - 22;
      el('rect', { x: x1, y: y - 10, width: hx - x1, height: 20, fill: C.ink }, g);
      const cp = G.clipRect(x1, y - 10, hx - x1, 20);
      const st = el('g', { 'clip-path': cp.url }, g);
      const stripes = el('g', {}, st);
      for (let x = x1 - 16; x < hx + 16; x += 16) el('rect', { x, y: y - 7, width: 7, height: 14, fill: C.white }, stripes);
      el('path', { d: `M ${hx} ${y - 20} L ${x2} ${y} L ${hx} ${y + 20} Z`, fill: C.ink }, g);
      const box = G.carton(g, 0, 0, 0.8);
      return p => { stripes.setAttribute('transform', `translate(${(p * 64) % 16} 0)`); box.setAttribute('transform', `translate(${x1 + 20 + (hx - x1 - 40) * easeInOut(p)} ${y - 26})`); };
    } },
    { name: 'Supermarché, flux tiré', say: 'quantité maximale autorisée', make(g, cx, cy) {
      const x0 = cx - 90, y0 = cy - 30;
      el('path', { d: `M ${x0} ${y0} L ${x0 + 70} ${y0} L ${x0 + 70} ${y0 + 72} L ${x0} ${y0 + 72} M ${x0 + 70} ${y0 + 24} L ${x0 + 8} ${y0 + 24} M ${x0 + 70} ${y0 + 48} L ${x0 + 8} ${y0 + 48}`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      G.carton(g, x0 + 42, y0 + 36, 0.55);
      G.carton(g, x0 + 42, y0 + 60, 0.55);
      const arc = `M ${x0 + 42} ${y0 + 10} C ${x0 + 90} ${y0 - 34}, ${cx + 90} ${y0 - 30}, ${cx + 80} ${y0 + 40}`;
      const a = G.arrow(g, arc, { width: 3, stroke: C.tGreen, head: 10 });
      const path = a.path;
      const box = G.carton(g, 0, 0, 0.55);
      text(g, cx + 50, cy + 48, 'max 3', { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
      return p => { const L = path.getTotalLength(), pt = path.getPointAtLength(L * easeInOut(p)); box.setAttribute('transform', `translate(${pt.x} ${pt.y})`); a.draw(clamp(p * 1.2)); };
    } },
    { name: 'Kanban', say: 'quantité par carte', make(g, cx, cy) {
      const ar = G.arrow(g, `M ${cx + 90} ${cy + 36} L ${cx - 90} ${cy + 36}`, { width: 2.5, dash: '6 6', head: 9 });
      const card = kanbanCard(g, '20 pcs');
      return p => card.setAttribute('transform', `translate(${cx + 50 - 100 * easeInOut(p)} ${cy - 2})`);
    } },
    { name: 'Opérateur', say: 'personne affectée au poste', make(g, cx, cy) {
      const op = operator(g, cx, cy + 34, 1.9);
      return p => { const s = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p); op.setAttribute('transform', s === 1 ? '' : `translate(${cx} ${cy + 10}) scale(${s}) translate(${-cx} ${-cy - 10})`); op.setAttribute('opacity', clamp(p * 3)); };
    } },
    { name: 'Information manuelle', say: 'nature et fréquence', make(g, cx, cy) {
      const a = G.arrow(g, `M ${cx + 100} ${cy + 22} L ${cx - 100} ${cy + 22}`, { width: 2.5, head: 10 });
      text(g, cx, cy + 52, `planning, 1${NB}× / jour`, { size: 16, weight: 500, fill: C.blue, anchor: 'middle' });
      const d = el('g', {}, g);
      el('rect', { x: -12, y: -15, width: 24, height: 30, rx: 3, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, d);
      [-6, 0, 6].forEach(dy => el('line', { x1: -6, y1: dy, x2: 6, y2: dy, stroke: C.blue, 'stroke-width': 2, 'stroke-linecap': 'round' }, d));
      return p => d.setAttribute('transform', `translate(${cx + 70 - 140 * p} ${cy - 6})`);
    } },
    { name: 'Information électronique', say: 'le système émetteur', make(g, cx, cy) {
      const a = G.arrow(g, zigzag(cx + 100, cx - 100, cy + 22), { width: 2.5, head: 10 });
      text(g, cx, cy + 52, 'ERP', { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
      const dot = el('circle', { r: 7, fill: C.lightBlue, stroke: C.white, 'stroke-width': 2 }, g);
      return p => { const L = a.path.getTotalLength(), q = clamp(p * 1.6); const pt = a.path.getPointAtLength(L * q); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); dot.setAttribute('opacity', q > 0 && q < 1 ? 1 : 0); };
    } },
    { name: 'Lissage', say: 'séquence de mélange', make(g, cx, cy) {
      el('rect', { x: cx - 92, y: cy - 34, width: 184, height: 80, rx: 6, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, g);
      text(g, cx, cy - 10, 'O X O X', { size: 18, weight: 800, fill: C.blue, anchor: 'middle' });
      const cells = ['A', 'B', 'A', 'C'].map((c, i) => {
        const x = cx - 72 + i * 48;
        el('rect', { x: x - 18, y: cy + 2, width: 36, height: 34, rx: 4, fill: C.pLav }, g);
        return text(g, x, cy + 26, c, { size: 19, weight: 800, fill: [C.tGreen, C.tRed, C.tGreen, C.tYellow][i], anchor: 'middle' });
      });
      return p => cells.forEach((c, i) => c.setAttribute('opacity', clamp(p * 4 - i)));
    } },
    { name: 'Chantier d’amélioration', say: 'l’action visée, sur l’état futur', make(g, cx, cy) {
      const b = el('g', {}, g);
      burst(b, cx, cy + 6, 44, 26);
      text(b, cx, cy + 13, 'SMED', { size: 19, weight: 800, fill: C.ink, anchor: 'middle' });
      return p => { const s = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.5 + 0.5 * back(p); b.setAttribute('transform', s === 1 ? '' : `translate(${cx} ${cy + 6}) scale(${s}) rotate(${(1 - p) * -25}) translate(${-cx} ${-cy - 6})`); b.setAttribute('opacity', clamp(p * 3)); };
    } },
  ];

  function build() {
    G.templateBlog();
    G.blogTitle('Lire une carte', 'sans explication.');
    G.blogChapeau('Chaque symbole de la VSM, ce qu’il représente et ce qu’on écrit dedans.');
    TILES.forEach((T, i) => {
      const x = COLS[i % 4], y = ROWS[Math.floor(i / 4)];
      G.card(x, y, TW, TH);
      const g = el('g');
      const cx = x + TW / 2, cy = y + 64;
      const anim = T.make(g, cx, cy);
      const nm = text(g, cx, y + 146, T.name, { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });
      fit(nm, x + TW - 8, `nom ${i}`, x + 8);
      const sy = text(g, cx, y + 170, T.say, { size: 16, weight: 500, fill: C.blue, anchor: 'middle' });
      fit(sy, x + TW - 8, `écrit ${i}`, x + 8);
      S.tiles.push({ g, anim, cx, cy: y + TH / 2 });
    });
    S.chute = G.blogChute('Les symboles ne sont pas décoratifs : ils portent une convention.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;
    S.tiles.forEach((tl, i) => {
      const t0 = T0 + STEP * i;
      tl.g.setAttribute('opacity', fo * (live ? clamp(prog(t, t0, 0.25)) : 1));
      tl.anim(live ? prog(t, t0 + 0.2, ANIM) : 1);
    });
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
