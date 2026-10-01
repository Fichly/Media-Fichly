// Blog · Lean Manufacturing · section « 4. Tirer le flux »
// Image fixe : la même ligne deux fois. En flux poussé, une prévision lance chaque poste et le stock
// s'accumule entre eux ; en flux tiré, chaque poste ne remplace que ce que l'étape suivante a consommé.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit } = G;

  function planning(parent, cx, cy) {
    el('rect', { x: cx - 34, y: cy - 36, width: 68, height: 72, rx: 10, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, parent);
    el('rect', { x: cx - 16, y: cy - 44, width: 32, height: 14, rx: 5, fill: C.blue }, parent);
    [-12, 2, 16].forEach((dy, i) => {
      el('rect', { x: cx - 22, y: cy + dy - 4, width: 8, height: 8, rx: 2, fill: C.lightBlue }, parent);
      el('rect', { x: cx - 8, y: cy + dy - 3, width: i === 1 ? 22 : 30, height: 6, rx: 3, fill: C.pLav }, parent);
    });
  }
  // Pile de cartons posée sur floor, centrée sur cx : n cartons, par rangées de 4
  function pile(cx, floor, n) {
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 4), col = i % 4, inRow = Math.min(4, n - row * 4);
      G.carton(G.svg, cx + (col - (inRow - 1) / 2) * 36, floor - 18 - row * 36, 1);
    }
  }
  const label = (x, y, s) => text(G.svg, x, y, s, { size: 22, weight: 600, fill: C.ink, anchor: 'middle' });

  // Abscisses communes aux deux lignes
  const X = { src: 120, A: 280, s1: 470, B: 660, s2: 850, cli: 1060 };
  const MK = 0.6; // machine : 108 × 74

  function lane(y, push) {
    const floor = y + 210;
    G.card(40, y, 1120, 290);
    G.pill(G.svg, 70, y + 42, push ? 'Flux poussé' : 'Flux tiré', { size: 24, h: 44, pad: 18, bg: push ? C.pRed : C.pGreen, fg: push ? C.tRed : C.tGreen });
    text(G.svg, push ? 262 : 232, y + 51, push ? 'Chaque poste produit sur prévision.' : 'Chaque poste remplace ce qui a été consommé.', { size: 25, weight: 600, fill: C.ink });

    if (push) { planning(G.svg, X.src, floor - 44); label(X.src, floor + 36, 'Prévision'); }
    G.machine(G.svg, X.A - 54, floor - 74, MK);
    G.machine(G.svg, X.B - 54, floor - 74, MK);
    label(X.A, floor + 36, 'Poste A');
    label(X.B, floor + 36, 'Poste B');
    G.person(G.svg, X.cli, floor, 1.1);
    label(X.cli, floor + 36, 'Client');
    pile(X.s1, floor, push ? 12 : 2);
    pile(X.s2, floor, push ? 12 : 2);
    [X.s1, X.s2].forEach(x => {
      label(x, floor + 36, push ? 'Stock' : 'Supermarché');
      text(G.svg, x, floor + 64, push ? 'grossit' : '2 places', { size: 20, weight: 600, fill: push ? C.tRed : C.tGreen, anchor: 'middle' });
    });

    if (push) {
      // La prévision lance chaque poste, sans regarder la suite
      G.arrow(G.svg, `M ${X.src + 40} ${floor - 44} L ${X.A - 66} ${floor - 44}`, { width: 3.5, head: 11 });
      G.arrow(G.svg, `M ${X.src} ${floor - 92} Q ${(X.src + X.B) / 2} ${floor - 170} ${X.B} ${floor - 86}`, { width: 3, head: 11, dash: '8 7', stroke: C.tRed });
    } else {
      // Chaque consommateur renvoie le signal au poste qui le précède
      const sig = (from, to) => G.arrow(G.svg, `M ${from} ${floor - 84} Q ${(from + to) / 2} ${floor - 132} ${to} ${floor - 84}`, { width: 3, head: 11, dash: '8 7', stroke: C.tGreen });
      sig(X.cli - 6, X.B + 20);
      sig(X.B - 20, X.A + 20);
      el('line', { x1: 880, y1: y + 44, x2: 920, y2: y + 44, stroke: C.tGreen, 'stroke-width': 3, 'stroke-dasharray': '8 7' });
      fit(text(G.svg, 930, y + 51, 'signal', { size: 22, weight: 600, fill: C.tGreen }), 1140, 'légende signal');
    }
  }

  G.image(() => {
    G.templateBlog();
    G.blogTitle('Flux poussé,', 'flux tiré.');
    lane(140, true);
    lane(450, false);
    G.blogChute('Ne fabriquer que ce que l’étape suivante a consommé.', { y: 808 });
  });
})();
