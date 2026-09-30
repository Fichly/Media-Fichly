// Blog · Kanban de production · « Voici ce qui fait bouger le résultat » (section Exemple de dimensionnement)
// Mécanique : pour chaque levier du tableau de l'article, le besoin calculé (D × T × (1 + marge)) se dessine,
// puis les bacs entiers tombent jusqu'à le couvrir : c'est l'arrondi qui fixe le stock maximal.
// On voit pourquoi raccourcir le délai enlève un bac entier, pourquoi des bacs de 60 donnent 5 cartes pour 300 pièces,
// et pourquoi une marge de 40 % ne change rien (2,8 s'arrondit aussi à 3).
// Chiffres de l'article. Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const X = p => 390 + 1.275 * p;
  const TOP = r => 226 + 132 * r;
  const ROWS = [
    { lab: 'Situation de départ', f: '(60 × 4 × 1,2) / 120 = 2,4', need: 288, q: 120, n: 3, v1: '360 pièces', v2: 'la référence', c: C.ink },
    { lab: 'Délai ramené à 2 h', f: '(60 × 2 × 1,2) / 120 = 1,2', need: 144, q: 120, n: 2, v1: '−120 pièces', v2: 'sans contrepartie', c: C.tGreen },
    { lab: 'Bacs de 60 pièces', f: '(60 × 4 × 1,2) / 60 = 4,8', need: 288, q: 60, n: 5, v1: '−60 pièces', v2: 'mais 5 cartes', c: C.tYellow },
    { lab: 'Marge portée à 40 %', f: '(60 × 4 × 1,4) / 120 = 2,8', need: 336, q: 120, n: 3, v1: 'aucun gain', v2: 'la marge se mérite', c: C.tRed },
  ];
  const ROW_T = r => 2.0 + 2.6 * r;
  const HL_T = 12.6, CHUTE_T = 13.0;

  const S = {};

  function kanban(parent, x, y) {
    const g = el('g', { transform: `translate(${x} ${y})` }, parent);
    el('rect', { x: -9, y: -12, width: 18, height: 24, rx: 3, fill: C.white, stroke: C.tGreen, 'stroke-width': 2 }, g);
    el('rect', { x: -9, y: -12, width: 18, height: 7, rx: 2, fill: C.tGreen }, g);
    el('line', { x1: -5, y1: 2, x2: 5, y2: 2, stroke: C.tGreen, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Quel levier', 'baisse le stock ?', { size: 48 });
    G.blogChapeau('Une grandeur change à la fois. Le besoin se calcule, le stock s’arrondit au bac entier.');

    G.card(40, 176, 1120, 584);
    // En-têtes et légende
    text(G.svg, 64, 210, 'Levier', { size: 16, weight: 700, fill: C.ink });
    el('rect', { x: 390, y: 199, width: 34, height: 12, rx: 6, fill: C.blue });
    const l1 = text(G.svg, 432, 210, 'besoin calculé', { size: 16, weight: 600, fill: C.ink });
    const lx = measure(l1).x + measure(l1).width + 22;
    el('rect', { x: lx, y: 195, width: 34, height: 20, rx: 4, fill: C.yellow });
    text(G.svg, lx + 42, 210, 'bacs entiers = stock maximal', { size: 16, weight: 600, fill: C.ink });
    text(G.svg, 930, 210, 'Effet sur le stock', { size: 16, weight: 700, fill: C.ink });
    // Référence : 360 pièces
    el('line', { x1: X(360), y1: TOP(0) + 8, x2: X(360), y2: TOP(3) + 124, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '5 6', opacity: 0.35 });

    S.rows = ROWS.map((R, r) => {
      const y = TOP(r);
      if (r) el('line', { x1: 64, y1: y, x2: 1136, y2: y, stroke: C.line, 'stroke-width': 2 });
      const hl = el('rect', { x: 50, y: y + 4, width: 1100, height: 124, rx: 16, fill: 'none', stroke: C.green, 'stroke-width': 4, opacity: 0 });
      const L = { hl };
      L.left = el('g');
      text(L.left, 64, y + 36, R.lab, { size: 20, weight: 700, fill: C.ink });
      fit(text(L.left, 64, y + 64, R.f, { size: 16, weight: 500, fill: C.ink }), 372, `formule ${r}`);
      text(L.left, 64, y + 94, `= ${R.n}${NB}cartes`, { size: 19, weight: 800, fill: C.blue });
      // Besoin calculé
      L.need = el('rect', { x: X(0), y: y + 24, height: 12, rx: 6, fill: C.blue });
      L.needLine = el('line', { x1: X(R.need), y1: y + 18, x2: X(R.need), y2: y + 94, stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' });
      L.needLab = text(G.svg, X(R.need) - 6, y + 16, `${R.need}`, { size: 15, weight: 700, fill: C.blue, anchor: 'end' });
      // Bacs entiers
      L.boxes = Array.from({ length: R.n }, (_, i) => {
        const g = el('g');
        const x0 = X(R.q * i), w = X(R.q * (i + 1)) - x0;
        el('rect', { x: x0 + 1.5, y: y + 48, width: w - 3, height: 38, rx: 6, fill: C.yellow }, g);
        kanban(g, x0 + 16, y + 67);
        return { g, cx: x0 + w / 2, cy: y + 67 };
      });
      L.stock = text(G.svg, X(R.q * R.n) + 12, y + 75, `${R.q * R.n}`, { size: 20, weight: 800, fill: C.ink });
      // Effet
      L.verd = el('g');
      text(L.verd, 930, y + 60, R.v1, { size: 22, weight: 800, fill: R.c });
      text(L.verd, 930, y + 88, R.v2, { size: 17, weight: 600, fill: R.c });
      return L;
    });

    S.chute = G.blogChute('Le délai de boucle est le seul levier sans contrepartie.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    S.rows.forEach((L, r) => {
      const R = ROWS[r], t0 = ROW_T(r);
      L.left.setAttribute('opacity', live ? clamp(prog(t, t0, 0.3)) : o);
      const nq = live ? easeOut(prog(t, t0 + 0.3, 0.6)) : 1;
      L.need.setAttribute('width', Math.max(0.001, (X(R.need) - X(0)) * nq));
      L.need.setAttribute('opacity', live ? (nq > 0 ? 1 : 0) : o);
      const lo = live ? clamp(prog(t, t0 + 0.8, 0.2)) : o;
      L.needLine.setAttribute('opacity', lo);
      L.needLab.setAttribute('opacity', lo);
      L.boxes.forEach((b, i) => {
        const tb = t0 + 1.0 + (R.n > 3 ? 0.18 : 0.28) * i;
        let dy = 0, bo = o;
        if (live) { const q = prog(t, tb, 0.3); dy = -40 * (1 - easeOut(q)); bo = clamp(q / 0.4); }
        b.g.setAttribute('transform', dy ? `translate(0 ${dy})` : '');
        b.g.setAttribute('opacity', bo);
      });
      const tEnd = t0 + 1.0 + (R.n > 3 ? 0.18 : 0.28) * R.n + 0.2;
      L.stock.setAttribute('opacity', live ? clamp(prog(t, tEnd, 0.2)) : o);
      pop(L.verd, t, tEnd + 0.2, 1030, TOP(r) + 70);
      L.hl.setAttribute('opacity', r === 1 ? (live ? clamp(prog(t, HL_T, 0.3)) : o) : 0);
    });
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
