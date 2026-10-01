// Blog · Lean Manufacturing · section « Juste-à-temps et jidoka : les deux piliers du système Toyota »
// Image fixe : la rivière des stocks. Même fond, deux niveaux d'eau : stock élevé, les problèmes sont sous la
// surface ; stock bas (juste-à-temps), ils apparaissent et le jidoka oblige à les traiter.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit } = G;

  const BED = 612; // fond de la rivière
  const ROCKS = ['Pannes', 'Changements de série', 'Défauts'];

  function rock(cx, peak, w = 130) {
    const h = w / 2;
    el('path', { d: `M ${cx - h} ${BED} C ${cx - h + 6} ${peak + 50} ${cx - 34} ${peak} ${cx} ${peak} C ${cx + 34} ${peak} ${cx + h - 6} ${peak + 50} ${cx + h} ${BED} Z`, fill: '#8b8bb0' });
  }
  function boat(cx, level) {
    el('path', { d: `M ${cx - 52} ${level - 22} L ${cx + 52} ${level - 22} L ${cx + 36} ${level + 6} L ${cx - 36} ${level + 6} Z`, fill: C.blue });
    G.carton(G.svg, cx - 17, level - 40, 1);
    G.carton(G.svg, cx + 17, level - 40, 1);
  }

  function panel(x, low) {
    const w = 550, x0 = x + 20, x1 = x + w - 20;
    G.card(x, 140, w, 600);
    G.pill(G.svg, x + 28, 188, low ? 'Stock bas : juste-à-temps' : 'Stock élevé', { size: 23, h: 42, pad: 18, bg: low ? C.pGreen : C.pLav, fg: low ? C.tGreen : C.blue });

    const level = low ? 500 : 300;
    const rx = low ? [x + 215, x + 345, x + 465] : [x + 150, x + 290, x + 430];
    // Fond et rochers, puis l'eau par-dessus
    rx.forEach(cx => rock(cx, 430, low ? 120 : 130));
    el('rect', { x: x0, y: level, width: x1 - x0, height: BED - level, fill: C.lightBlue, 'fill-opacity': low ? 0.9 : 0.93 });
    el('rect', { x: x0, y: BED, width: x1 - x0, height: 8, rx: 4, fill: '#8b8bb0' });
    boat(low ? x + 95 : x + 290, level);

    if (low) {
      rx.forEach((cx, i) => {
        const p = G.pill(G.svg, cx, i === 1 ? 336 : 384, ROCKS[i], { size: 20, h: 36, pad: 13, bg: C.pRed, fg: C.tRed, anchor: 'middle' });
        fit(p.g, x1, ROCKS[i], x0);
        el('line', { x1: cx, y1: (i === 1 ? 336 : 384) + 18, x2: cx, y2: 424, stroke: C.tRed, 'stroke-width': 2.5 });
      });
    }
    const cap = low ? ['Les problèmes apparaissent.', 'Le jidoka oblige à les traiter.'] : ['Les problèmes sont là,', 'mais sous la surface.'];
    cap.forEach((s, i) => fit(text(G.svg, x + w / 2, 664 + i * 36, s, { size: 25, weight: i ? 600 : 700, fill: low && !i ? C.tRed : C.ink, anchor: 'middle' }), x1, s, x0));
  }

  G.image(() => {
    G.templateBlog();
    G.blogTitle('Le stock cache', 'les problèmes.');
    panel(40, false);
    panel(610, true);
    G.blogChute('Juste-à-temps et jidoka ne fonctionnent qu’ensemble.', { y: 808 });
  });
})();
