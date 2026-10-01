// Blog · Lean Manufacturing · section « Exemple chiffré : diviser le délai sans toucher aux machines »
// Image fixe : les mêmes quatre machines, avant et après le pilote. Seul l'encours entre elles change
// (450 → 200 pièces, tampon tournage / fraisage supprimé) ; le débit reste à 50 pièces par jour.
// Loi de Little : 450 ÷ 50 = 9 jours, 200 ÷ 50 = 4 jours.
// Hypothèse : avant, les 450 pièces sont réparties à parts égales entre les trois intervalles (6 cartons de 25).
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit } = G;

  const MACH = ['Sciage', 'Tournage', 'Fraisage', 'Ébavurage'];
  const MX = [110, 330, 550, 770];        // centres des machines
  const ROWS = [
    { y: 140, label: 'Avant', piles: [6, 6, 6], calc: '450 ÷ 50', res: '9 jours', bad: true },
    { y: 412, label: 'Après le pilote', piles: [4, 0, 4], calc: '200 ÷ 50', res: '4 jours', bad: false },
  ];
  const RH = 256;

  function pile(cx, floor, n) {
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 3), col = i % 3, inRow = Math.min(3, n - row * 3);
      G.carton(G.svg, cx + (col - (inRow - 1) / 2) * 33, floor - 16 - row * 33, 0.95);
    }
  }

  G.image(() => {
    G.templateBlog();
    G.blogTitle('Moins d’encours,', 'moins de délai.');

    ROWS.forEach(r => {
      const floor = r.y + 166;
      G.card(40, r.y, 1120, RH);
      G.pill(G.svg, 66, r.y + 40, r.label, { size: 23, h: 42, pad: 18, bg: r.bad ? C.pRed : C.pGreen, fg: r.bad ? C.tRed : C.tGreen });
      if (r.bad) {
        G.carton(G.svg, 236, r.y + 40, 0.95);
        text(G.svg, 262, r.y + 48, '= 25 pièces', { size: 21, weight: 600, fill: C.ink });
      }
      MACH.forEach((m, i) => {
        G.machine(G.svg, MX[i] - 45, floor - 62, 0.5);
        text(G.svg, MX[i], floor + 34, m, { size: 21, weight: 600, fill: C.ink, anchor: 'middle' });
      });
      r.piles.forEach((n, i) => {
        const cx = (MX[i] + MX[i + 1]) / 2;
        if (n) pile(cx, floor, n);
        else text(G.svg, cx, floor - 20, 'tampon', { size: 19, weight: 600, fill: C.tGreen, anchor: 'middle' }),
          text(G.svg, cx, floor + 2, 'supprimé', { size: 19, weight: 600, fill: C.tGreen, anchor: 'middle' });
      });
      // Le calcul : encours ÷ débit
      el('rect', { x: 880, y: r.y + 24, width: 256, height: RH - 48, rx: 18, fill: r.bad ? C.pRed : C.pGreen });
      text(G.svg, 1008, r.y + 100, r.calc, { size: 30, weight: 700, fill: r.bad ? C.tRed : C.tGreen, anchor: 'middle' });
      fit(text(G.svg, 1008, r.y + 166, r.res, { size: 48, weight: 800, fill: r.bad ? C.tRed : C.tGreen, anchor: 'middle' }), 1130, r.res, 886);
    });

    // Légende
    fit(text(G.svg, 60, 722, 'Temps de traversée = encours ÷ débit', { size: 25, weight: 700, fill: C.blue }), 760, 'formule');
    fit(text(G.svg, 1140, 722, 'Débit : 50 pièces / jour, inchangé', { size: 21, weight: 600, fill: C.ink, anchor: 'end' }), 1140, 'débit', 780);

    G.blogChute('Le délai se gagne entre les machines, pas sur elles.', { y: 808 });
  });
})();
