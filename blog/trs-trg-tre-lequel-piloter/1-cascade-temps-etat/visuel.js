// Blog · TRS, TRG, TRE · section « La cascade des temps d'état » (refait en animé l'image trs-trg-tre-temps-etat)
// Mécanique : la cascade se construit marche par marche sur la journée de référence (24 h, 2 équipes de 8 h) :
// chaque marche descendue retire une famille de pertes. En bas, les 10 h 50 de temps utile ne bougent plus.
// On les rapporte ensuite à trois références de plus en plus larges : 14 h (TRS 77 %), 16 h (TRG 68 %), 24 h (TRE 45 %).
// Le bloc vert est le même dans les trois cartes, seul le cadre s'élargit.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const BX = 330, PXH = 600 / 24, BH = 36;
  const ROWS = [
    { name: 'Temps total (tt)', val: `24${NB}h`, h: 24 },
    { name: 'Temps d’ouverture (to)', val: `16${NB}h`, h: 16, cut: `atelier fermé : 8${NB}h`, fill: '#c9c9dc', inside: true },
    { name: 'Temps requis (tr)', val: `14${NB}h`, h: 14, cut: `arrêts planifiés : 2${NB}h`, fill: C.lightBlue },
    { name: 'Fonctionnement (tf)', val: `12${NB}h`, h: 12, cut: `arrêts subis : 2${NB}h`, fill: C.red },
    { name: 'Temps net (tn)', val: `11${NB}h${NB}20`, h: 680 / 60, cut: `micro-arrêts, cadence : 40${NB}min`, fill: C.yellow },
    { name: 'Temps utile (tu)', val: `10${NB}h${NB}50`, h: 650 / 60, cut: `rebuts, retouches : 30${NB}min`, fill: C.violet },
  ];
  const RATES = [
    { k: 'TRS', ref: 'tr', row: 2, h: 14, frac: `10${NB}h${NB}50 / 14${NB}h`, res: `77${NB}%`, col: C.blue, bg: C.pLav },
    { k: 'TRG', ref: 'to', row: 1, h: 16, frac: `10${NB}h${NB}50 / 16${NB}h`, res: `68${NB}%`, col: '#2f7d80', bg: '#e3f2f2' },
    { k: 'TRE', ref: 'tt', row: 0, h: 24, frac: `10${NB}h${NB}50 / 24${NB}h`, res: `45${NB}%`, col: '#7b4784', bg: '#f3e8f5' },
  ];
  const rowY = i => 198 + i * 62;

  function build() {
    G.templateBlog();
    G.blogTitle('Même temps utile,', 'trois taux.');
    G.blogChapeau(`La cascade des temps d’état (NF E60-182) sur la journée de référence.`);

    // ----- Carte 1 : la cascade -----
    G.card(40, 176, 1120, 404);
    S.rows = ROWS.map((r, i) => {
      const y = rowY(i);
      const g = el('g');
      const last = i === ROWS.length - 1;
      text(g, 64, y + 16, r.name, { size: 19, weight: 700, fill: last ? C.tGreen : C.ink });
      text(g, 64, y + 38, r.val, { size: 18, weight: 500, fill: last ? C.tGreen : C.ink });
      const prevH = i ? ROWS[i - 1].h : r.h;
      const bar = el('rect', { x: BX, y, width: r.h * PXH, height: BH, rx: 7, fill: last ? C.green : C.blue });
      let cut = null, lab = null;
      if (r.cut) {
        cut = el('rect', { x: BX + r.h * PXH, y, width: (prevH - r.h) * PXH, height: BH, fill: r.fill });
        const lx = r.inside ? BX + (r.h + prevH) / 2 * PXH : BX + prevH * PXH + 12;
        lab = text(G.svg, lx, y + 24, r.cut, { size: 17, weight: 700, fill: r.inside ? C.ink : C.ink, anchor: r.inside ? 'middle' : 'start' });
        fit(lab, 1040, `étiquette ${i}`);
      }
      return { ...r, g, bar, cut, lab, y, prevH };
    });

    // Repères à droite : quelle ligne sert de référence à quel taux
    S.tags = RATES.map(R => {
      const g = el('g');
      G.pill(g, 1134, rowY(R.row) + 18, R.k, { size: 18, h: 32, pad: 12, bg: R.col, fg: C.white }).g
        .setAttribute('transform', 'translate(-64 0)');
      return g;
    });
    S.tagU = el('g');
    const tu = G.pill(S.tagU, 1134, rowY(5) + 18, 'numérateur', { size: 17, h: 32, pad: 12, bg: C.pGreen, fg: C.tGreen });
    tu.g.setAttribute('transform', `translate(${-tu.w} 0)`);
    S.tagUc = 1134 - tu.w / 2;
    // Contours de mise en évidence des lignes de référence
    S.hl = RATES.map(R => el('rect', { x: BX - 6, y: rowY(R.row) - 5, width: R.h * PXH + 12, height: BH + 10, rx: 10, fill: 'none', stroke: R.col, 'stroke-width': 3.5, opacity: 0 }));

    // ----- Trois cartes : même bloc vert, cadre de plus en plus large -----
    const K = 300 / 24;
    S.cards = RATES.map((R, i) => {
      const x = 40 + i * 380;
      G.card(x, 596, 360, 166);
      const g = el('g');
      const t1 = text(g, x + 24, 634, `${R.k} = tu / ${R.ref}`, { size: 23, weight: 700, fill: R.col });
      el('rect', { x: x + 24, y: 652, width: R.h * K, height: 26, rx: 6, fill: R.bg, stroke: R.col, 'stroke-width': 2.5 }, g);
      el('rect', { x: x + 24, y: 652, width: 650 / 60 * K, height: 26, rx: 6, fill: C.green }, g);
      text(g, x + 24, 726, R.frac, { size: 19, weight: 500, fill: C.ink });
      const big = text(g, x + 336, 734, R.res, { size: 44, weight: 800, fill: R.col, anchor: 'end' });
      return { g, cx: x + 180 };
    });

    S.chute = G.blogChute('Chaque marche remontée fait entrer de nouvelles pertes.', { y: 812 });
  }

  // ---------- Chronologie ----------
  const ROW_T = [1.8, 2.7, 3.6, 4.5, 5.4, 6.3];
  const COPY = 0.3, CUT = 0.35, CUT_D = 0.5;
  const TU_T = 7.3;
  const RATE_T = [8.1, 9.4, 10.7];
  const CHUTE_T = 12.2;

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.rows.forEach((r, i) => {
      const T = ROW_T[i];
      rise(r.g, t, T, 0.35, 10);
      // La barre reprend la longueur de la marche du dessus, puis la tranche retirée se colore et s'efface à moitié
      let w = r.h * PXH;
      if (live) {
        const grow = easeOut(prog(t, T, i ? COPY : 0.5));
        const shrink = easeInOut(prog(t, T + CUT + 0.15, CUT_D));
        w = (r.prevH * grow - (r.prevH - r.h) * shrink) * PXH;
      }
      r.bar.setAttribute('width', Math.max(0.001, w));
      r.bar.setAttribute('opacity', o * (live ? clamp(prog(t, T, 0.15)) : 1));
      if (r.cut) {
        const co = live ? clamp(prog(t, T + CUT, 0.15)) * (1 - 0.5 * clamp(prog(t, T + CUT + 0.2, CUT_D))) : 0.5;
        r.cut.setAttribute('opacity', o * co);
        r.lab.setAttribute('opacity', o * (live ? clamp(prog(t, T + CUT + 0.3, 0.3)) : 1));
      }
    });
    if (live && t >= TU_T - 0.05 && t < TU_T + 0.8) pulse(S.rows[5].g, t, TU_T, 180, rowY(5) + 18, 0.08, 0.5);
    pop(S.tagU, t, TU_T, S.tagUc, rowY(5) + 18);

    RATES.forEach((R, i) => {
      const T = RATE_T[i];
      pop(S.tags[i], t, T, 1102, rowY(R.row) + 18);
      pop(S.cards[i].g, t, T + 0.2, S.cards[i].cx, 690);
      S.hl[i].setAttribute('opacity', live ? G.window01(t, T, T + 1.1, 0.2) : 0);
    });

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
