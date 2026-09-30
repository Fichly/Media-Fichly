// Blog · DMAIC · section « 5. Contrôler : prouver que ça tient »
// Mécanique : le même projet, le même gain (7 % → 2 % de rebut), puis six mois après la fin du projet.
// En haut, rien n'est en place : le taux dérive et revient près du niveau de départ (effet de projet).
// En bas, standard écrit, indicateur suivi, revue chaque semaine : une dérive apparaît, la revue suivante la voit,
// on corrige ; après la date de fin de surveillance, le gain tient. Un curseur de temps balaie les deux lignes.
// Hypothèses : courbes illustratives (dérive jusqu'à 6 %, écart repris en semaine 6, 1,8 % à six mois).
// Boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = { lanes: [] };
  const LANES = [{ y0: 176, kind: 'sans' }, { y0: 468, kind: 'avec' }];
  const X0 = 374, XEND = 472, XM = m => XEND + 70 * m;     // mois après la fin du projet
  const ITEMS = ['Standard écrit', 'Indicateur suivi', 'Revue chaque semaine', 'Fin de surveillance datée'];
  const T = { heads: 1.8, gain: 2.6, end: 3.5, sweep: [4.0, 11.0], out: 11.2, chute: 12.2 };
  const WEEK = 1 / 4.33;
  // Courbes (mois, taux en %) après la fin du projet
  const DRIFT = [[0, 2.0], [0.5, 2.2], [1, 2.7], [2, 3.7], [3, 4.6], [4, 5.3], [5, 5.8], [6, 6.0]];
  const HOLD = [[0, 1.9], [4.6 * WEEK, 1.9], [5.2 * WEEK, 2.9], [6 * WEEK, 2.9], [6.4 * WEEK, 1.9], [2, 1.8], [6, 1.8]];
  const REVIEWS = Array.from({ length: 8 }, (_, k) => (k + 1) * WEEK);
  const CATCH = 5;                                   // revue de la semaine 6 (index 5) : écart vu
  const monthAt = t => t < FADE_END ? 6 : 6 * clamp(prog(t, T.sweep[0], T.sweep[1] - T.sweep[0]));

  function build() {
    G.templateBlog();
    G.blogTitle('Prouver', 'que ça tient.');
    G.blogChapeau('Même projet, même gain au départ. Seule la phase Contrôler fait la différence.');

    LANES.forEach((ln, li) => {
      const L = { ...ln };
      const Y0 = ln.y0;
      const avec = ln.kind === 'avec';
      const V = v => Y0 + 236 - 20 * v;
      L.V = V;
      G.card(40, Y0, 1120, 276);
      L.head = el('g');
      const p = G.pill(L.head, 64, Y0 + 38, avec ? 'Avec Contrôler' : 'Sans Contrôler', { size: 22, h: 38, bg: avec ? C.pGreen : C.pRed, fg: avec ? C.tGreen : C.tRed });
      fit(text(L.head, 64 + p.w + 16, Y0 + 46, avec ? 'Le gain est verrouillé et surveillé.' : 'Le projet est clos à la fin d’Innover.', { size: 21, weight: 500, fill: C.ink }), 1136, `sous-titre ${li}`);

      // Ce qui est en place
      L.list = el('g');
      ITEMS.forEach((s, i) => {
        const y = Y0 + 94 + 36 * i;
        if (avec) G.check(L.list, 76, y, 11); else G.cross(L.list, 76, y, 11, '#e7a0a0');
        fit(text(L.list, 96, y + 6, s, { size: 16, weight: avec ? 700 : 500, fill: avec ? C.tGreen : '#9a7a7a' }), X0 - 44, `liste ${i + 1}`);
      });

      // Graphique
      L.chart = el('g');
      el('line', { x1: X0, y1: Y0 + 72, x2: X0, y2: Y0 + 238, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, L.chart);
      el('line', { x1: X0, y1: Y0 + 238, x2: 900, y2: Y0 + 238, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, L.chart);
      text(L.chart, X0 - 6, V(7) + 6, '7 %', { size: 16, weight: 700, fill: C.tRed, anchor: 'end' });
      text(L.chart, X0 - 6, V(2) + 6, '2 %', { size: 16, weight: 700, fill: C.tGreen, anchor: 'end' });
      el('line', { x1: X0, y1: V(2), x2: 900, y2: V(2), stroke: C.tGreen, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, L.chart);
      text(L.chart, X0 + 46, Y0 + 260, 'Innover', { size: 15, weight: 700, fill: C.ink, anchor: 'middle' });
      text(L.chart, XM(3), Y0 + 260, '3 mois', { size: 15, weight: 700, fill: C.ink, anchor: 'middle' });
      text(L.chart, XM(6), Y0 + 260, '6 mois', { size: 15, weight: 700, fill: C.ink, anchor: 'middle' });
      // Même gain au départ
      L.gain = el('path', { d: `M ${X0 + 8} ${V(7)} L ${X0 + 26} ${V(7)} C ${X0 + 52} ${V(7)} ${X0 + 58} ${V(2)} ${X0 + 84} ${V(2)} L ${XEND} ${V(2)}`, fill: 'none', stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      L.gainLen = L.gain.getTotalLength();
      L.end = el('g');
      el('line', { x1: XEND, y1: Y0 + 76, x2: XEND, y2: Y0 + 238, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, L.end);
      text(L.end, XEND + 6, Y0 + 84, 'fin du projet', { size: 15, weight: 700, fill: C.ink });

      // Courbe après le projet (dessinée jusqu'au curseur)
      const pts = avec ? HOLD : DRIFT;
      L.pts = pts;
      L.after = el('path', { d: 'M ' + pts.map(([m, v]) => `${XM(m)} ${V(v)}`).join(' L '), fill: 'none', stroke: avec ? C.green : C.red, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      L.clipR = G.clipRect(XEND - 4, Y0 + 60, 0, 200);
      L.after.setAttribute('clip-path', L.clipR.url);

      if (avec) {
        L.reviews = REVIEWS.map((m, k) => {
          const g = el('g');
          const ok = el('g', {}, g); G.check(ok, XM(m), Y0 + 222, 8);
          const bad = el('g', {}, g); G.cross(bad, XM(m), Y0 + 222, 8);
          return { g, ok, bad, m };
        });
        L.caught = el('g');
        G.pill(L.caught, XM(6.2 * WEEK) + 14, V(2.9), 'écart vu en revue, corrigé', { size: 15, h: 26, pad: 10, bg: C.pYellow, fg: C.tYellow });
        L.stopFlag = el('g');
        el('line', { x1: XM(2), y1: Y0 + 100, x2: XM(2), y2: Y0 + 238, stroke: C.tGreen, 'stroke-width': 2, 'stroke-dasharray': '4 4' }, L.stopFlag);
        text(L.stopFlag, XM(2) + 6, Y0 + 112, 'fin de surveillance', { size: 15, weight: 700, fill: C.tGreen });
      }
      // Curseur de temps
      L.cursor = el('line', { x1: XEND, y1: Y0 + 70, x2: XEND, y2: Y0 + 238, stroke: C.blue, 'stroke-width': 2.5 });

      // Bilan à six mois
      L.out = el('g');
      el('rect', { x: 918, y: Y0 + 74, width: 218, height: 180, rx: 20, fill: avec ? C.pGreen : C.pRed }, L.out);
      const fg = avec ? C.tGreen : C.tRed;
      text(L.out, 1027, Y0 + 108, '6 mois après', { size: 18, weight: 700, fill: fg, anchor: 'middle' });
      text(L.out, 1027, Y0 + 180, avec ? '1,8 %' : '6 %', { size: 56, weight: 800, fill: fg, anchor: 'middle' });
      text(L.out, 1027, Y0 + 226, avec ? 'le gain tient' : 'effet de projet', { size: 19, weight: 700, fill: fg, anchor: 'middle' });
      S.lanes.push(L);
    });

    S.chute = G.blogChute('Contrôler distingue une amélioration d’un effet de projet.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!])/g, ' $1');
    });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const m = monthAt(t);

    S.lanes.forEach((L, li) => {
      const avec = L.kind === 'avec';
      const d0 = 1.75 + 0.3 * li;
      pop(L.head, t, d0, 200, L.y0 + 38);
      L.list.setAttribute('opacity', live ? clamp(prog(t, d0 + 0.2, 0.3)) : o);
      L.chart.setAttribute('opacity', live ? clamp(prog(t, d0 + 0.3, 0.3)) : o);

      // Même gain au départ
      const q = live ? easeInOut(prog(t, T.gain, 0.8)) : 1;
      L.gain.setAttribute('stroke-dasharray', `${L.gainLen * q} ${L.gainLen}`);
      L.gain.setAttribute('opacity', live ? (q > 0 ? 1 : 0) : o);
      L.end.setAttribute('opacity', live ? clamp(prog(t, T.end, 0.3)) : o);

      // Après le projet : la courbe suit le curseur
      const xc = XM(m);
      L.clipR.rect.setAttribute('width', Math.max(0.001, xc - XEND + 6));
      L.after.setAttribute('opacity', live ? (t >= T.sweep[0] ? 1 : 0) : o);
      const sweeping = live && t >= T.sweep[0] - 0.2 && t < T.sweep[1] + 0.3;
      L.cursor.setAttribute('x1', xc);
      L.cursor.setAttribute('x2', xc);
      L.cursor.setAttribute('opacity', sweeping ? 1 : 0);

      if (avec) {
        L.reviews.forEach((r, k) => {
          const seen = !live || m >= r.m;
          r.g.setAttribute('opacity', seen ? o : 0);
          // la revue de la semaine 6 voit l'écart : croix, puis coche une fois corrigé
          const isBad = k === CATCH && live && m >= r.m && m < r.m + 0.25;
          r.bad.setAttribute('opacity', isBad ? 1 : 0);
          r.ok.setAttribute('opacity', isBad ? 0 : 1);
        });
        const caught = live ? clamp((m - REVIEWS[CATCH]) / 0.1) : o;
        L.caught.setAttribute('opacity', caught);
        L.stopFlag.setAttribute('opacity', live ? clamp((m - 2) / 0.1) : o);
      }
      pop(L.out, t, T.out + 0.2 * li, 1027, L.y0 + 164);
    });

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
