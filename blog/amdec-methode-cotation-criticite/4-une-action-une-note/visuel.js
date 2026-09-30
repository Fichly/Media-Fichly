// Blog · AMDEC · section « Après la séance : les trois actions »
// Mécanique : les trois lignes les plus critiques reçoivent chacune une action avec un verbe, un nom, une date, et la
// note qu'elle attaque (F, G ou D). Une fois l'action réalisée, on recote avec la même grille : seule la note attaquée
// baisse, et la criticité suit. La date de la recotation est posée au calendrier avant de quitter la salle.
// Modes, noms et dates illustratifs (hypothèse). Rendu déterministe : boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const ROWS = [
    { y: 196, mode: 'Roulement bloqué', n: [3, 4, 4], k: 0, to: 1, act: 'Ajouter un graissage au plan', who: 'Resp. : S. Morel · avant le 15/11' },
    { y: 352, mode: 'Courroie cassée', n: [3, 4, 3], k: 1, to: 2, act: 'Tenir une courroie en stock', who: 'Resp. : L. Petit · avant le 29/11' },
    { y: 508, mode: 'Fuite du vérin', n: [2, 4, 4], k: 2, to: 2, act: 'Ajouter un point à la ronde', who: 'Resp. : A. Roux · avant le 13/12' },
  ];
  const RH = 144;
  const CX = [436, 512, 588], CS = 58, CCX = 720;              // centres des cases F, G, D, et de la criticité
  const LCOL = { 1: C.green, 2: C.yellow, 3: C.yellow, 4: C.red };
  const LETTERS = ['F', 'G', 'D'];
  const T = { rows: 1.8, act0: 3.0, actStep: 1.0, recot: 6.4, re0: 7.0, reStep: 0.9, cal: 10.0, chute: 10.9 };

  const S = { rows: [] };

  function chip(parent, cx, cy, v, w = CS) {
    const g = el('g', {}, parent);
    const r = el('rect', { x: cx - w / 2, y: cy - CS / 2, width: w, height: CS, rx: 14, fill: LCOL[v] || C.blue }, g);
    const tx = text(g, cx, cy + 10, String(v), { size: 28, weight: 800, fill: C.white, anchor: 'middle' });
    return { g, r, tx };
  }
  function calendar(parent, x, y) {
    const g = el('g', {}, parent);
    el('rect', { x, y, width: 44, height: 40, rx: 7, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, g);
    el('rect', { x, y, width: 44, height: 12, rx: 5, fill: C.blue }, g);
    [10, 22, 34].forEach(dx => [20, 30].forEach(dy => el('rect', { x: x + dx - 3, y: y + dy - 2, width: 6, height: 5, rx: 1, fill: C.lightBlue }, g)));
    el('circle', { cx: x + 34, cy: y + 30, r: 6, fill: C.red }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Une action,', 'une note.');
    G.blogChapeau('Trois actions datées et nommées. Recotées avec la même grille, elles se mesurent.');

    ROWS.forEach((R, i) => {
      const L = { ...R };
      G.card(40, R.y, 1120, RH);
      const cy = R.y + 70;
      L.cy = cy;
      L.left = el('g');
      text(L.left, 64, R.y + 44, 'Mode de défaillance', { size: 15, weight: 600, fill: C.ink });
      text(L.left, 64, R.y + 76, R.mode, { size: 22, weight: 800, fill: C.ink });
      L.cAvant = text(L.left, 64, R.y + 112, '', { size: 17, weight: 600, fill: C.ink });

      // Cases F, G, D et criticité
      L.notes = el('g');
      L.chips = R.n.map((v, j) => {
        const c = chip(L.notes, CX[j], cy, v);
        text(L.notes, CX[j], cy + CS / 2 + 24, LETTERS[j], { size: 18, weight: 800, fill: C.blue, anchor: 'middle' });
        return c;
      });
      text(L.notes, (CX[0] + CX[1]) / 2, cy + 9, '×', { size: 24, weight: 800, fill: C.blue, anchor: 'middle' });
      text(L.notes, (CX[1] + CX[2]) / 2, cy + 9, '×', { size: 24, weight: 800, fill: C.blue, anchor: 'middle' });
      text(L.notes, CX[2] + 46, cy + 10, '=', { size: 28, weight: 800, fill: C.blue, anchor: 'middle' });
      L.cc = chip(L.notes, CCX, cy, 0, 78);
      L.cc.r.setAttribute('fill', C.blue);
      text(L.notes, CCX, cy + CS / 2 + 24, 'criticité', { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
      // ancienne valeur barrée (au-dessus de la case attaquée) et écart de criticité
      L.old = el('g');
      const ox = CX[R.k] - 16, oy = cy - CS / 2 - 12;
      text(L.old, ox, oy, String(R.n[R.k]), { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
      el('line', { x1: ox - 9, y1: oy - 5, x2: ox + 9, y2: oy - 5, stroke: C.red, 'stroke-width': 2.5 }, L.old);
      L.ring = el('rect', { x: CX[R.k] - CS / 2 - 6, y: cy - CS / 2 - 6, width: CS + 12, height: CS + 12, rx: 18, fill: 'none', stroke: C.blue, 'stroke-width': 4 });

      // Carte action
      L.act = el('g');
      el('rect', { x: 800, y: R.y + 14, width: 340, height: RH - 28, rx: 16, fill: C.pLav }, L.act);
      const ap = G.para(L.act, 820, R.y + 44, R.act, 300, { size: 18, weight: 700, fill: C.ink, lh: 1.2 });
      const wy = R.y + 44 + ap.n * 22 + 4;
      text(L.act, 820, wy, R.who, { size: 15, weight: 600, fill: C.ink });
      G.pill(L.act, 820, R.y + RH - 34, `attaque ${LETTERS[R.k]}`, { size: 16, h: 28, pad: 12, bg: C.blue, fg: C.white });
      L.arrow = G.arrow(G.svg, `M 796 ${cy - 30} Q ${(796 + CX[R.k]) / 2 + 30} ${R.y + 4} ${CX[R.k] + 14} ${cy - CS / 2 - 10}`, { stroke: C.blue, width: 2.5, dash: '6 5', head: 9 });
      L.delta = el('g');
      S.rows.push(L);
    });

    // Recotation
    S.recot = el('g');
    G.pill(S.recot, 64, 676, 'Actions réalisées : on recote, même grille', { size: 17, h: 32, pad: 14, bg: C.blue, fg: C.white });
    S.cal = el('g');
    G.card(40, 664, 1120, 82, S.cal);
    calendar(S.cal, 64, 684);
    text(S.cal, 124, 700, 'Date de la recotation posée au calendrier avant de quitter la salle,', { size: 18, weight: 700, fill: C.ink });
    text(S.cal, 124, 726, 'avec les mêmes participants : la baisse mesurée est le seul résultat opposable.', { size: 17, weight: 500, fill: C.ink });

    S.chute = G.blogChute('Chaque action attaque une note précise, puis on recote.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.rows.forEach((L, i) => {
      L.left.setAttribute('opacity', live ? clamp(prog(t, T.rows + 0.15 * i, 0.3)) : o);
      pop(L.notes, t, T.rows + 0.1 + 0.15 * i, CX[1], L.cy);
      // action : glisse depuis la droite
      const ta = T.act0 + T.actStep * i;
      let dx = 0, ao = o;
      if (live) { const p = prog(t, ta, 0.45); dx = 160 * (1 - easeOut(p)); ao = clamp(p / 0.4); }
      L.act.setAttribute('transform', dx ? `translate(${dx} 0)` : '');
      L.act.setAttribute('opacity', ao);
      L.arrow.draw(live ? prog(t, ta + 0.4, 0.4) : 1);
      L.arrow.g.setAttribute('opacity', o);
      L.ring.setAttribute('opacity', live ? clamp(prog(t, ta + 0.7, 0.2)) : o);
      if (live && t >= ta + 0.7 && t < ta + 1.5) pulse(L.chips[L.k].g, t, ta + 0.75, CX[L.k], L.cy, 0.12, 0.4);
      // recotation : la note attaquée baisse, la criticité suit
      const tr = T.re0 + T.reStep * i;
      const done = live ? t >= tr : true;
      const n = L.n.slice();
      if (done) n[L.k] = L.to;
      const v = n[L.k];
      L.chips[L.k].tx.textContent = String(v);
      L.chips[L.k].r.setAttribute('fill', LCOL[v]);
      if (live && t >= tr && t < tr + 0.8) pulse(L.chips[L.k].g, t, tr, CX[L.k], L.cy, 0.18, 0.4);
      L.old.setAttribute('opacity', live ? clamp(prog(t, tr, 0.3)) : o);
      const c0 = L.n[0] * L.n[1] * L.n[2], c1 = n[0] * n[1] * n[2];
      const cv = live ? Math.round(c0 + (c1 - c0) * easeOut(prog(t, tr, 0.6))) : c1;
      L.cc.tx.textContent = String(cv);
      L.cAvant.textContent = done ? `criticité ${c0}, puis ${c1}` : `criticité ${c0}`;
      L.cAvant.setAttribute('fill', done ? C.tGreen : C.ink);
    });
    const ro = live ? Math.min(clamp(prog(t, T.recot, 0.3)), 1 - clamp(prog(t, T.cal - 0.3, 0.3))) : 0;
    S.recot.setAttribute('opacity', ro);
    pop(S.cal, t, T.cal, 600, 705);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
