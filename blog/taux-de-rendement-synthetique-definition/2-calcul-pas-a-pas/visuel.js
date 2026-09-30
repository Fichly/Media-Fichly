// Blog · TRS · section « Comment calculer le TRS pas à pas ? »
// Mécanique : une seule barre de temps qui rétrécit. On part des 16 h d'ouverture, on sort les 2 h planifiées :
// 14 h requises (840 pièces possibles). Chaque taux retire une tranche de ce qui reste : 2 h d'arrêts subis
// (disponibilité), 40 pièces de micro-arrêts et de cadence (performance), 30 rebuts (qualité). Il reste 10 h 50.
// Le produit des trois taux est ce qui reste de la barre : 77 %. La plus grosse tranche désigne le chantier.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const PXH = 45, BX = 390, X14 = BX + 2 * PXH, XEND = BX + 16 * PXH, BH = 44;
  const xh = h => X14 + h * PXH;              // abscisse d'une durée comptée depuis le début du temps requis
  const ROWS = [
    { y: 306, name: 'Disponibilité', formula: `12${NB}h / 14${NB}h = 85,7${NB}%`, pts: `–${NB}14,3${NB}points`,
      from: 14, to: 12, fill: C.red, lossTxt: `2${NB}h d’arrêts subis`, lossFg: C.tRed, inBar: `12${NB}h = 720 pièces attendues` },
    { y: 406, name: 'Performance', formula: `680 / 720 = 94,4${NB}%`, pts: `–${NB}5,6${NB}points`,
      from: 12, to: 680 / 60, fill: C.yellow, lossTxt: '40 pièces : micro-arrêts, cadence', lossFg: C.tYellow, inBar: `680 produites = 11${NB}h${NB}20` },
    { y: 506, name: 'Qualité', formula: `650 / 680 = 95,6${NB}%`, pts: `–${NB}4,4${NB}points`,
      from: 680 / 60, to: 650 / 60, fill: C.violet, lossTxt: '30 rebuts et retouches', lossFg: '#6d3f75', inBar: `650 conformes = 10${NB}h${NB}50` },
  ];

  function build() {
    G.templateBlog();
    G.blogTitle('Calcul du TRS,', 'pas à pas.');
    G.blogChapeau(`Cas de référence : 2 équipes de 8${NB}h, 60 pièces/h, 680 pièces produites, 650 conformes.`);

    G.card(40, 176, 1120, 420);

    // ----- Ligne 0 : du temps d'ouverture au temps requis -----
    S.rowA = el('g');
    text(S.rowA, 64, 234, 'Temps requis', { size: 22, weight: 700, fill: C.ink });
    text(S.rowA, 64, 262, `16${NB}h – 2${NB}h planifiées = 14${NB}h`, { size: 19, weight: 500, fill: C.ink });
    S.barA = el('rect', { x: BX, y: 206, width: 16 * PXH, height: BH, rx: 8, fill: C.blue });
    S.plan = el('g');
    el('rect', { x: BX, y: 206, width: 2 * PXH, height: BH, rx: 8, fill: C.lightBlue }, S.plan);
    el('rect', { x: BX + 2 * PXH - 8, y: 206, width: 8, height: BH, fill: C.lightBlue }, S.plan);
    text(S.plan, BX + PXH, 235, `2${NB}h`, { size: 18, weight: 700, fill: C.white, anchor: 'middle' });
    text(S.plan, BX + PXH, 198, 'planifié', { size: 17, weight: 600, fill: C.blue, anchor: 'middle' });
    S.inA = text(G.svg, X14 + 16, 235, `14${NB}h = 840 pièces possibles`, { size: 18, weight: 700, fill: C.white });

    // ----- Lignes des trois taux -----
    S.rows = ROWS.map((r, i) => {
      const g = el('g');
      const nm = text(g, 64, r.y + 28, r.name, { size: 22, weight: 700, fill: C.ink });
      const fo = text(g, 64, r.y + 56, r.formula, { size: 20, weight: 600, fill: C.blue });
      const pg = el('g', {}, g);
      const nb = measure(nm);
      const p = G.pill(pg, nb.x + nb.width + 12, r.y + 21, r.pts, { size: 17, h: 30, pad: 11, bg: C.pRed, fg: C.tRed });
      fit(p.g, 380, `pastille ${i}`);
      // Cadre pointillé des 14 h de référence
      el('rect', { x: X14, y: r.y, width: 14 * PXH, height: BH, rx: 8, fill: 'none', stroke: '#c9c9dc', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
      const bar = el('rect', { x: X14, y: r.y, width: r.to * PXH, height: BH, rx: 8, fill: i === 2 ? C.green : C.blue }, g);
      const loss = el('rect', { x: xh(r.to), y: r.y, width: (r.from - r.to) * PXH, height: BH, fill: r.fill }, g);
      const lt = text(g, xh(r.from), r.y - 9, r.lossTxt, { size: 17, weight: 600, fill: r.lossFg, anchor: 'end' });
      fit(lt, 1140, `perte ${i}`, 420);
      const ib = text(g, X14 + 16, r.y + 29, r.inBar, { size: 18, weight: 700, fill: C.white });
      return { ...r, g, fo, pg, bar, loss, lt, ib, pcx: nb.x + nb.width + 70 };
    });

    // Contour du chantier prioritaire
    S.focus = el('rect', { x: 50, y: 277, width: 1100, height: 96, rx: 16, fill: 'none', stroke: C.red, 'stroke-width': 3.5 });

    // ----- Carte du résultat -----
    G.card(40, 612, 1120, 150);
    S.res = el('g');
    const r1 = text(S.res, 70, 668, `TRS = 85,7${NB}% × 94,4${NB}% × 95,6${NB}% =`, { size: 28, weight: 500, fill: C.ink });
    S.big = text(S.res, measure(r1).x + measure(r1).width + 14, 672, `77${NB}%`, { size: 44, weight: 800, fill: C.blue });
    S.res2 = text(G.svg, 70, 722, `Soit 10${NB}h${NB}50 de production conforme sur 14${NB}h requises.`, { size: 20, weight: 500, fill: C.ink });
    S.prio = el('g');
    const pp = G.pill(S.prio, 1134, 700, 'Premier chantier : la disponibilité', { size: 19, h: 38, bg: C.red, fg: C.white });
    pp.g.setAttribute('transform', `translate(${-pp.w} 0)`);
    S.prioC = 1134 - pp.w / 2;
    fit(S.res2, 1134 - pp.w - 16, 'ligne résultat');

    S.chute = G.blogChute('Le chantier se décide sur cette lecture, pas sur le 77 %.', { y: 810 });
  }

  // ---------- Chronologie ----------
  const A_T = 1.8, ROW_T = [3.6, 5.8, 8.0];
  const SHRINK = 0.55, SHRINK_D = 0.7;
  const RES_T = 10.2, FOCUS_T = 12.0, CHUTE_T = 13.0;

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // Ligne 0 : la barre des 16 h se dessine, les 2 h planifiées sortent du calcul
    rise(S.rowA, t, A_T);
    const wa = live ? 16 * PXH * easeOut(prog(t, A_T, 0.6)) : 16 * PXH;
    S.barA.setAttribute('width', Math.max(0.001, wa));
    S.barA.setAttribute('opacity', o * (live ? clamp(prog(t, A_T, 0.2)) : 1));
    pop(S.plan, t, A_T + 0.75, BX + PXH, 228);
    S.inA.setAttribute('opacity', o * (live ? clamp(prog(t, A_T + 1.1, 0.3)) : 1));

    // Trois taux : la barre reprend la longueur de la ligne du dessus, puis la tranche perdue se détache
    S.rows.forEach((r, i) => {
      const T = ROW_T[i];
      rise(r.g, t, T, 0.4, 14);
      const p = live ? easeInOut(prog(t, T + SHRINK, SHRINK_D)) : 1;
      const w = (r.from - (r.from - r.to) * p) * PXH;
      r.bar.setAttribute('width', w);
      // La tranche perdue se colore sur la barre, puis se vide (fantôme) pendant que la barre recule
      r.loss.setAttribute('opacity', live ? clamp(prog(t, T + SHRINK - 0.25, 0.2)) * (1 - 0.45 * clamp(prog(t, T + SHRINK + 0.2, SHRINK_D))) : 0.55);
      const lo = live ? clamp(prog(t, T + SHRINK + SHRINK_D * 0.6, 0.3)) : 1;
      r.lt.setAttribute('opacity', lo);
      r.ib.setAttribute('opacity', live ? clamp(prog(t, T + SHRINK + SHRINK_D, 0.3)) : 1);
      r.fo.setAttribute('opacity', live ? clamp(prog(t, T + SHRINK + SHRINK_D + 0.2, 0.3)) : 1);
      pop(r.pg, t, T + SHRINK + SHRINK_D + 0.5, r.pcx, r.y + 21);
    });

    // Résultat
    pop(S.res, t, RES_T, 420, 660);
    if (live && t >= RES_T + 0.6 && t < RES_T + 1.3) pulse(S.big, t, RES_T + 0.7, 700, 658, 0.12, 0.45);
    rise(S.res2, t, RES_T + 0.9);

    // Chantier prioritaire : la plus grosse tranche
    const fo = fading(t) ? fadeOut(t) : live ? clamp(prog(t, FOCUS_T, 0.35)) : 1;
    S.focus.setAttribute('opacity', fo);
    pop(S.prio, t, FOCUS_T + 0.3, S.prioC, 700);
    if (live && t >= FOCUS_T + 0.2 && t < FOCUS_T + 1.2) pulse(S.rows[0].pg, t, FOCUS_T + 0.3, S.rows[0].pcx, S.rows[0].y + 21, 0.15, 0.5);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
