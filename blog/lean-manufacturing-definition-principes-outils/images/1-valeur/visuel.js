// Blog · Lean Manufacturing · section « Qu'est-ce que le Lean Manufacturing ? Définition »
// Image fixe : les six opérations citées par l'article, dans l'ordre du parcours, triées par la question
// du client. Trois ajoutent de la valeur, trois sont des gaspillages.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit } = G;

  const OPS = [
    { label: 'Usiner', ok: true },
    { label: 'Déplacer une palette', ok: false },
    { label: 'Attendre une validation', ok: false },
    { label: 'Assembler', ok: true },
    { label: 'Reprendre une pièce ratée', ok: false },
    { label: 'Emballer', ok: true },
  ];
  const X0 = 50, CW = 150, GAP = 14, Y0 = 250, CH = 220;

  G.image(() => {
    G.templateBlog();
    G.blogTitle('La valeur,', 'vue par le client.');

    // La question du client
    el('rect', { x: 930, y: 150, width: 228, height: 62, rx: 18, fill: C.blue });
    el('path', { d: 'M 1090 210 L 1110 240 L 1118 210 Z', fill: C.blue });
    text(G.svg, 1044, 191, 'Je paierais ça ?', { size: 25, weight: 700, fill: C.white, anchor: 'middle' });
    G.person(G.svg, 1110, 470, 1.5);
    text(G.svg, 1110, 508, 'Client', { size: 25, weight: 700, fill: C.ink, anchor: 'middle' });

    OPS.forEach((o, i) => {
      const x = X0 + i * (CW + GAP);
      el('rect', { x, y: Y0, width: CW, height: CH, rx: 20, fill: o.ok ? C.pGreen : C.pRed, stroke: o.ok ? C.green : C.red, 'stroke-width': 3 });
      (o.ok ? G.check : G.cross)(G.svg, x + CW / 2, Y0, 26);
      const p = G.para(G.svg, x + CW / 2, 0, o.label, CW - 20, { size: 24, weight: 700, fill: o.ok ? C.tGreen : C.tRed, anchor: 'middle', lh: 1.25 });
      p.t.setAttribute('y', Y0 + CH / 2 + 9 - (p.n - 1) * 15);
      fit(p.t, x + CW - 6, `opération ${i + 1}`, x + 6);
    });
    G.arrow(G.svg, `M ${X0} 530 L 1040 530`, { stroke: C.blue, width: 4, head: 14 });
    text(G.svg, X0, 568, 'Le parcours de la commande', { size: 22, weight: 600, fill: C.blue });

    // Légende : ce que le client paierait, ce qu'il ne paierait pas
    const legend = (x, ok, l1, l2) => {
      el('rect', { x, y: 610, width: 540, height: 130, rx: 22, fill: ok ? C.pGreen : C.pRed });
      (ok ? G.check : G.cross)(G.svg, x + 58, 675, 30);
      text(G.svg, x + 108, 663, l1, { size: 25, weight: 600, fill: ok ? C.tGreen : C.tRed });
      fit(text(G.svg, x + 108, 703, l2, { size: 32, weight: 800, fill: ok ? C.tGreen : C.tRed }), x + 525, l2);
    };
    legend(50, true, 'Le client paierait', 'Valeur ajoutée');
    legend(610, false, 'Le client ne paierait pas', 'Gaspillage');

    G.blogChute('La valeur se définit du point de vue du client.', { y: 808 });
  });
})();
