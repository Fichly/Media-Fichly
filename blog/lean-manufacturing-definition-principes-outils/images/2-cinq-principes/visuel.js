// Blog · Lean Manufacturing · section « Les 5 principes du Lean Manufacturing »
// Image fixe : les cinq principes dans l'ordre, chacun résumé par l'article en une idée ; le dernier relance
// le premier (chaque amélioration fait apparaître le problème suivant).
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit } = G;

  const P = [
    { name: 'Identifier la valeur', key: 'Ce que le client est prêt à payer' },
    { name: 'Cartographier la chaîne de valeur', key: 'Voir où le produit attend' },
    { name: 'Créer le flux', key: 'Avancer sans interruption' },
    { name: 'Tirer le flux', key: 'Ne produire que ce qui a été consommé' },
    { name: 'Viser la perfection', key: 'Améliorer, puis recommencer' },
  ];
  const X0 = 50, CW = 204, GAP = 15, Y0 = 160, CH = 440;

  G.image(() => {
    G.templateBlog();
    G.blogTitle('Les 5 principes,', 'dans l’ordre.');

    P.forEach((p, i) => {
      const x = X0 + i * (CW + GAP), cx = x + CW / 2;
      G.card(x, Y0, CW, CH);
      G.badgeNum(G.svg, cx, Y0 + 58, i + 1, 30);
      const n = G.para(G.svg, cx, Y0 + 140, p.name, CW - 16, { size: 24, weight: 700, fill: C.blue, anchor: 'middle', lh: 1.2 });
      fit(n.t, x + CW - 5, `nom ${i + 1}`, x + 5);
      el('line', { x1: x + 40, y1: Y0 + 270, x2: x + CW - 40, y2: Y0 + 270, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' });
      const k = G.para(G.svg, cx, Y0 + 320, p.key, CW - 28, { size: 23, weight: 500, fill: C.ink, anchor: 'middle', lh: 1.3 });
      fit(k.t, x + CW - 8, `idée ${i + 1}`, x + 8);
    });

    // Chevrons dessinés après les cartes, pour passer devant
    P.slice(0, -1).forEach((_, i) => {
      const ax = X0 + (i + 1) * (CW + GAP) - GAP / 2;
      el('circle', { cx: ax, cy: Y0 + 58, r: 17, fill: C.blue });
      el('path', { d: `M ${ax - 4} ${Y0 + 50} L ${ax + 4} ${Y0 + 58} L ${ax - 4} ${Y0 + 66}`, fill: 'none', stroke: C.white, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    });

    // La boucle : le dernier principe relance le premier
    const xl = X0 + CW / 2, xr = X0 + 4 * (CW + GAP) + CW / 2, yb = 660;
    G.arrow(G.svg, `M ${xr} ${Y0 + CH + 8} L ${xr} ${yb - 20} Q ${xr} ${yb} ${xr - 20} ${yb} L ${xl + 20} ${yb} Q ${xl} ${yb} ${xl} ${yb - 20} L ${xl} ${Y0 + CH + 14}`, { stroke: C.blue, width: 4, head: 14 });
    const lab = text(G.svg, 600, yb + 48, 'Chaque amélioration fait apparaître le problème suivant.', { size: 24, weight: 600, fill: C.blue, anchor: 'middle' });
    fit(lab, 1150, 'boucle', 50);

    G.blogChute('Le dernier principe relance le premier.', { y: 808 });
  });
})();
