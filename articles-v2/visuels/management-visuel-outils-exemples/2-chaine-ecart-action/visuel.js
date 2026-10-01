// Visuel 2 · Management visuel (section « Étape 4 : relier chaque rouge à une action »)
// Brief : la chaîne indicateur, écart, décision, action.
// Mécanique : quatre cartes reliées par des flèches, de l'indicateur à l'action nominative.
// Une boucle revient à l'indicateur : si l'écart revient, l'action devient une analyse de cause.
(() => {
  const G = window.Gabarit, A = window.Article;
  const { C, el, text, fit, prog, easeOut } = G;

  const CW = 250, CY = 160, CH = 380, GAP = 40;
  const cx = i => 40 + i * (CW + GAP) + CW / 2;
  const AT = [1.8, 2.9, 4.0, 5.1];
  const BARS = [5, 7, 6, 14], TARGET = 8, K = 11, BASE = 420;
  const S = {};

  function header(g, i, label) {
    G.pill(g, cx(i), CY + 40, `${i + 1} · ${label}`, { size: 19, h: 38, bg: C.blue, fg: C.white, anchor: 'middle' });
  }
  function caption(g, i, l1, l2) {
    fit(text(g, cx(i), CY + 312, l1, { size: 20, weight: 800, fill: C.ink, anchor: 'middle' }), cx(i) + CW / 2 - 10, l1, cx(i) - CW / 2 + 10);
    fit(text(g, cx(i), CY + 340, l2, { size: 17, weight: 500, fill: C.ink, anchor: 'middle' }), cx(i) + CW / 2 - 10, l2, cx(i) - CW / 2 + 10);
  }

  function build() {
    const root = A.template('Un écart ne sert que s’il déclenche une action',
      'La chaîne complète, du chiffre affiché jusqu’au nom et à la date.');
    root.setAttribute('transform', 'translate(0 36)');

    S.cards = [0, 1, 2, 3].map(i => {
      const g = el('g', {}, root);
      G.card(cx(i) - CW / 2, CY, CW, CH, g);
      return g;
    });

    // 1 · Indicateur : barres de la semaine contre la cible
    {
      const g = S.cards[0], x0 = cx(0) - 84;
      header(g, 0, 'Indicateur');
      S.bars = BARS.map((v, k) => {
        const r = el('rect', { x: x0 + k * 46, width: 30, rx: 5, fill: v > TARGET ? C.red : C.lightBlue }, g);
        text(g, x0 + k * 46 + 15, BASE + 22, 'LMMJ'[k], { size: 15, weight: 600, fill: C.ink, anchor: 'middle' });
        return { r, v };
      });
      el('line', { x1: x0 - 10, y1: BASE, x2: x0 + 178, y2: BASE, stroke: C.ink, 'stroke-width': 2 }, g);
      el('line', { x1: x0 - 10, y1: BASE - TARGET * K, x2: x0 + 178, y2: BASE - TARGET * K, stroke: C.tGreen, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, g);
      text(g, x0 - 10, BASE - TARGET * K - 10, 'cible : 8', { size: 15, weight: 700, fill: C.tGreen });
      caption(g, 0, 'Non-conformités', 'avec la cible écrite à côté');
    }
    // 2 · Écart : la case rouge
    {
      const g = S.cards[1];
      header(g, 1, 'Écart');
      S.cell = el('g', {}, g);
      el('rect', { x: cx(1) - 70, y: 262, width: 140, height: 130, rx: 16, fill: C.red }, S.cell);
      text(S.cell, cx(1), 345, '14', { size: 58, weight: 800, fill: C.white, anchor: 'middle' });
      text(g, cx(1), 422, 'seuil : 8', { size: 16, weight: 700, fill: C.tRed, anchor: 'middle' });
      caption(g, 1, 'Rouge, sans calcul', 'visible à trois mètres');
    }
    // 3 · Décision : l'équipe devant le tableau
    {
      const g = S.cards[2], c = cx(2);
      header(g, 2, 'Décision');
      el('rect', { x: c - 80, y: 248, width: 160, height: 92, rx: 10, fill: C.pLav, stroke: C.line, 'stroke-width': 2 }, g);
      [0, 1, 2].forEach(r => [0, 1, 2, 3].forEach(k => el('rect', {
        x: c - 64 + k * 34, y: 262 + r * 24, width: 26, height: 16, rx: 3,
        fill: r === 1 && k === 3 ? C.red : C.green, opacity: r === 1 && k === 3 ? 1 : 0.55,
      }, g)));
      [-52, 0, 52].forEach(dx => {
        el('circle', { cx: c + dx, cy: 372, r: 13, fill: C.blue }, g);
        el('path', { d: `M ${c + dx - 21} 412 Q ${c + dx - 21} 389 ${c + dx} 389 Q ${c + dx + 21} 389 ${c + dx + 21} 412 Z`, fill: C.blue }, g);
      });
      caption(g, 2, 'Au point d’équipe', 'debout, à heure fixe');
    }
    // 4 · Action : une ligne avec un nom et une date
    {
      const g = S.cards[3], x0 = cx(3) - 105;
      header(g, 3, 'Action');
      S.rows = [['Quoi', 'Isoler le lot'], ['Qui', 'Sophie, qualité'], ['Pour', 'jeudi']].map(([k, v], r) => {
        const row = el('g', {}, g);
        el('rect', { x: x0, y: 252 + r * 54, width: 210, height: 44, rx: 10, fill: r === 0 ? C.pLav : C.pGreen }, row);
        text(row, x0 + 14, 281 + r * 54, k, { size: 16, weight: 800, fill: r === 0 ? C.blue : C.tGreen });
        fit(text(row, x0 + 64, 281 + r * 54, v, { size: 17, weight: 600, fill: C.ink }), x0 + 204, v);
        return row;
      });
      caption(g, 3, 'Un nom, une date', 'relue au point suivant');
    }

    // Flèches entre cartes
    S.arrows = [0, 1, 2].map(i => {
      const g = el('g', {}, root);
      const x1 = cx(i) + CW / 2 + 6, x2 = cx(i + 1) - CW / 2 - 6, y = CY + CH / 2 - 20;
      const line = el('path', { d: `M ${x1} ${y} L ${x2 - 2} ${y}`, fill: 'none', stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      const head = el('path', { d: `M ${x2 - 12} ${y - 10} L ${x2} ${y} L ${x2 - 12} ${y + 10}`, fill: 'none', stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      return { line, head };
    });

    // Boucle : si l'écart revient
    const yb = CY + CH, yl = 640;
    S.loop = el('path', {
      d: `M ${cx(3)} ${yb + 8} L ${cx(3)} ${yl - 24} Q ${cx(3)} ${yl} ${cx(3) - 24} ${yl} L ${cx(0) + 24} ${yl} Q ${cx(0)} ${yl} ${cx(0)} ${yl - 24} L ${cx(0)} ${yb + 14}`,
      fill: 'none', stroke: C.yellow, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, root);
    S.loopHead = el('path', { d: `M ${cx(0) - 12} ${yb + 24} L ${cx(0)} ${yb + 10} L ${cx(0) + 12} ${yb + 24}`, fill: 'none', stroke: C.yellow, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, root);
    S.loopLabel = el('g', {}, root);
    G.pill(S.loopLabel, 600, yl, 'L’écart revient ? L’action devient une analyse de cause (5 Pourquoi)', { size: 19, h: 42, bg: C.pYellow, fg: C.tYellow, anchor: 'middle' });
  }

  function draw(t) {
    const tt = A.T(t);
    S.cards.forEach((g, i) => A.show(g, tt, AT[i], { dy: 20 }));
    S.bars.forEach(({ r, v }, k) => {
      const h = v * K * easeOut(prog(tt, AT[0] + 0.3 + k * 0.15, 0.35));
      r.setAttribute('y', BASE - h);
      r.setAttribute('height', Math.max(0, h));
    });
    A.show(S.cell, tt, AT[1] + 0.25, { scale: true, cx: cx(1), cy: 327 });
    S.rows.forEach((row, r) => A.show(row, tt, AT[3] + 0.25 + r * 0.2, { dx: 20, dy: 0 }));
    S.arrows.forEach((a, i) => {
      A.draw(a.line, tt, AT[i] + 0.65, 0.35);
      A.show(a.head, tt, AT[i] + 0.95, { dy: 0, dur: 0.15 });
    });
    A.draw(S.loop, tt, AT[3] + 1.1, 1.0);
    A.show(S.loopHead, tt, AT[3] + 2.05, { dy: 0, dur: 0.15 });
    A.show(S.loopLabel, tt, AT[3] + 1.5, { scale: true, cx: 600, cy: 640 });
  }

  A.start({ duration: 11, build, draw });
})();
