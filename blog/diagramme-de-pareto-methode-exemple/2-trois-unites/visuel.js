// Blog · Diagramme de Pareto · section « Occurrences, temps d'arrêt ou coût : l'unité qui change tout »
// Mécanique : les six mêmes barres passent d'un diagramme à l'autre. À chaque changement d'unité, elles changent de
// hauteur puis se reclassent : bourrage en tête en occurrences, panne du convoyeur en minutes d'arrêt, réglage de la
// dateuse en coût. Seules les trois causes qui prennent la tête sont en couleur.
// Données : parts du tableau de l'article (occurrences, minutes d'arrêt, coût).
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const GREY = '#c9c9de';
  const CAUSES = [
    { name: 'Bourrage en sortie d’étiqueteuse', color: C.violet },
    { name: 'Changement de bobine film', color: GREY },
    { name: 'Réglage de la dateuse', color: C.yellow },
    { name: 'Manque de cartons au poste', color: GREY },
    { name: 'Arrêt sur capteur de sécurité', color: GREY },
    { name: 'Panne du convoyeur', color: C.teal },
  ];
  const UNITS = [
    { name: 'Occurrences', says: 'ce qui perturbe l’opérateur', v: [44.0, 23.0, 15.0, 9.0, 6.0, 3.0], why: '88 arrêts sur 200' },
    { name: 'Minutes d’arrêt', says: 'ce qui coûte en capacité', v: [14.2, 14.9, 14.6, 7.3, 2.9, 46.1], why: `570 minutes sur 1${NB}236` },
    { name: 'Coût', says: 'la seule qui intègre les rebuts', v: [10.3, 10.7, 38.5, 5.2, 2.1, 33.2], why: 'il ajoute des rebuts' },
  ];
  UNITS.forEach(u => { u.order = u.v.map((v, i) => i).sort((a, b) => u.v[b] - u.v[a]); u.lead = u.order[0]; });
  const PX = [52, 420, 788], PW = 360;
  const BASE = 548, PXL = 5.2, BW = 38;
  const slot = (p, j) => PX[p] + 55 + 50 * j;
  const rank = (u, i) => UNITS[u].order.indexOf(i);
  const T = { head: 1.8, rise: 2.2 };
  // Passage d'un diagramme au suivant : départ, changement de hauteur, reclassement
  const HOP = [null, { fly: 4.4, morph: 5.4, sort: 6.1, lead: 7.0 }, { fly: 8.3, morph: 9.3, sort: 10.0, lead: 10.9 }];
  const LEAD0 = 3.2, CHUTE_T = 11.9;
  const fmt = v => v.toFixed(1).replace('.', ',');
  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Trois unités,', 'trois classements.', { size: 48 });
    G.blogChapeau('Les six mêmes causes, le même relevé : seule l’unité de mesure change.');
    G.card(40, 176, 1120, 584);

    S.panels = UNITS.map((u, p) => {
      el('rect', { x: PX[p], y: 192, width: PW, height: 488, rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 2 });
      const head = el('g');
      G.pill(head, PX[p] + PW / 2, 224, u.name, { size: 19, h: 36, bg: C.blue, fg: C.white, anchor: 'middle' });
      fit(text(head, PX[p] + PW / 2, 264, u.says, { size: 16, weight: 500, fill: C.ink, anchor: 'middle' }), PX[p] + PW - 8, `unité ${p}`, PX[p] + 8);
      el('line', { x1: PX[p] + 24, y1: BASE, x2: PX[p] + PW - 24, y2: BASE, stroke: C.ink, 'stroke-width': 2.5 }, head);
      // En tête
      const lead = el('g');
      const L = CAUSES[u.lead];
      text(lead, PX[p] + 24, 580, 'En tête', { size: 15, weight: 500, fill: C.ink });
      el('rect', { x: PX[p] + 24, y: 592, width: 16, height: 16, rx: 4, fill: L.color }, lead);
      fit(text(lead, PX[p] + 48, 606, L.name, { size: 17, weight: 700, fill: C.ink }), PX[p] + PW - 10, `tête ${p}`);
      text(lead, PX[p] + 24, 634, u.why, { size: 16, weight: 500, fill: C.ink });
      const val = el('g');
      const h = u.v[u.lead] * PXL;
      text(val, slot(p, 0), BASE - h - 10, `${fmt(u.v[u.lead])}${NB}%`, { size: 18, weight: 800, fill: C.ink, anchor: 'middle' });
      // Barres de ce diagramme
      const bars = CAUSES.map((c, i) => el('rect', { x: -BW / 2, width: BW, rx: 5, fill: c.color, y: 0, height: 1 }));
      return { head, lead, val, bars };
    });

    // Légende
    S.legend = el('g');
    let x = 64;
    [[C.violet, 'Bourrage en sortie d’étiqueteuse'], [C.yellow, 'Réglage de la dateuse'], [C.teal, 'Panne du convoyeur'], [GREY, 'trois autres causes']].forEach(([c, s]) => {
      el('rect', { x, y: 704, width: 18, height: 18, rx: 4, fill: c }, S.legend);
      const tx = text(S.legend, x + 26, 719, s, { size: 16, weight: 500, fill: C.ink });
      x += 26 + measure(tx).width + 34;
    });
    if (x > 1160) console.error(`Débordement : légende (${Math.round(x)})`);

    S.chute = G.blogChute('Décidez de l’unité avant de regarder les résultats.', { y: 808 });
  }

  // État d'une barre (diagramme p, cause i) à l'instant t : abscisse, hauteur, élévation, opacité
  function barState(p, i, t) {
    const u = UNITS[p];
    const fin = { x: slot(p, rank(p, i)), h: u.v[i] * PXL, lift: 0, o: 1 };
    if (t < FADE_END) return { ...fin, o: fading(t) ? fadeOut(t) : 1 };
    if (p === 0) {
      const g = easeOut(prog(t, T.rise + 0.08 * rank(0, i), 0.45));
      return { ...fin, h: fin.h * g, o: g > 0 ? 1 : 0 };
    }
    const hop = HOP[p], src = p - 1, us = UNITS[src];
    if (t < hop.fly) return { ...fin, o: 0 };
    const pf = prog(t, hop.fly, 0.8), pm = prog(t, hop.morph, 0.6), ps = prog(t, hop.sort, 0.8);
    const xFrom = slot(src, rank(src, i)), xMid = slot(p, rank(src, i));
    let x = xFrom + (xMid - xFrom) * easeInOut(pf);
    x += (fin.x - xMid) * easeInOut(ps);
    const h = us.v[i] * PXL + (u.v[i] - us.v[i]) * PXL * easeInOut(pm);
    const lift = 70 * Math.sin(Math.PI * pf) + 18 * Math.sin(Math.PI * ps) * (fin.x !== xMid ? 1 : 0);
    return { x, h, lift, o: 1 };
  }

  function draw(t) {
    const live = t >= FADE_END;
    S.panels.forEach((P, p) => {
      pop(P.head, t, T.head + 0.12 * p, PX[p] + PW / 2, 240);
      P.bars.forEach((b, i) => {
        const s = barState(p, i, t);
        b.setAttribute('transform', `translate(${s.x} ${-s.lift})`);
        b.setAttribute('y', BASE - Math.max(0.01, s.h));
        b.setAttribute('height', Math.max(0.01, s.h));
        b.setAttribute('opacity', s.o);
      });
      const tl = p === 0 ? LEAD0 : HOP[p].lead;
      rise(P.lead, t, tl, 0.4);
      pop(P.val, t, tl - 0.1, slot(p, 0), BASE - 120);
    });
    pop(S.legend, t, T.head + 0.4, 600, 712);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
