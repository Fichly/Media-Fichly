// Blog · AMDEC · section « Les erreurs qui vident une AMDEC de son intérêt » (échelle modifiée en cours de séance)
// Mécanique : deux pannes identiques (même fait relevé : une fois par mois) sont cotées aux lignes 3 et 16.
// À gauche, la grille change à la ligne 15 : le même fait tombe un palier plus bas, 18 contre 12, le tri est faussé.
// À droite, la grille reste figée pendant la séance, puis on la corrige et on recote tout d'un bloc : 12 et 12.
// Grille corrigée (paliers chaque jour / semaine / mois / plus rare) : hypothèse. Rendu déterministe : boucle de 16 s.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const PANELS = [{ x: 40, kind: 'bouge' }, { x: 610, kind: 'figee' }];
  const PW = 550;
  const V1 = ['moins d’une fois par an', 'une fois par trimestre', 'une fois par mois', 'une fois par semaine'];
  const V2 = ['plus rare', 'chaque mois', 'chaque semaine', 'chaque jour'];
  const LCOL = { 1: C.green, 2: C.yellow, 3: C.yellow, 4: C.red };
  const PAL = { dx: 24, y: 290, h: 50, gap: 9, w: 244 };
  const palY = n => PAL.y + (4 - n) * (PAL.h + PAL.gap);           // haut du palier n
  const LN = { dx: 292, w: 236, h: 108, ys: [290, 430] };
  const T = { grid: 2.2, l3: 3.2, change: 5.0, l16: 6.6, verdict: 8.0, recot: 9.2, verdict2: 10.4, chute: 11.4 };
  const GD = 3, DD = 2;                                              // gravité et non-détection des deux lignes

  const S = { panels: [] };

  function lock(parent, cx, cy, fill) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx - 8} ${cy - 3} L ${cx - 8} ${cy - 10} A 8 8 0 0 1 ${cx + 8} ${cy - 10} L ${cx + 8} ${cy - 3}`, fill: 'none', stroke: fill, 'stroke-width': 3.5 }, g);
    el('rect', { x: cx - 12, y: cy - 4, width: 24, height: 19, rx: 4, fill }, g);
    return g;
  }
  function chip(parent, x, cy, v, w = 34) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - 17, width: w, height: 34, rx: 9, fill: LCOL[v] || C.blue }, g);
    const tx = text(g, x + w / 2, cy + 7, String(v), { size: 19, weight: 800, fill: C.white, anchor: 'middle' });
    return { g, r, tx };
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Une grille', 'qui ne bouge pas.');
    G.blogChapeau('Deux pannes identiques, cotées aux lignes 3 et 16 de la même séance.');

    PANELS.forEach((P, pi) => {
      const x0 = P.x, figee = P.kind === 'figee';
      const L = { kind: P.kind, x0 };
      G.card(x0, 176, PW, 576);
      L.head = el('g');
      G.pill(L.head, x0 + 24, 212, figee ? 'Grille figée, corrigée après' : 'Grille modifiée en séance', { size: 19, h: 36, bg: figee ? C.pGreen : C.pRed, fg: figee ? C.tGreen : C.tRed });

      // Grille F
      L.grid = el('g');
      text(L.grid, x0 + PAL.dx, 262, 'Grille de fréquence', { size: 17, weight: 700, fill: C.ink });
      L.labs = [];
      for (let n = 4; n >= 1; n--) {
        const y = palY(n);
        el('rect', { x: x0 + PAL.dx, y, width: PAL.w, height: PAL.h, rx: 10, fill: C.pLav, opacity: 0.7 }, L.grid);
        el('rect', { x: x0 + PAL.dx + 5, y: y + 5, width: PAL.h - 10, height: PAL.h - 10, rx: 8, fill: LCOL[n] }, L.grid);
        text(L.grid, x0 + PAL.dx + 5 + (PAL.h - 10) / 2, y + PAL.h / 2 + 7, String(n), { size: 19, weight: 800, fill: C.white, anchor: 'middle' }, L.grid);
        const a = text(L.grid, x0 + PAL.dx + PAL.h + 6, y + PAL.h / 2 + 6, V1[n - 1], { size: 16, weight: 600, fill: C.ink });
        const b = text(L.grid, x0 + PAL.dx + PAL.h + 6, y + (figee ? PAL.h / 2 + 6 : 21), V2[n - 1], { size: 16, weight: 600, fill: C.ink });
        fit(a, x0 + PAL.dx + PAL.w - 4, `palier v1 ${n}`); fit(b, x0 + PAL.dx + PAL.w - 4, `palier v2 ${n}`);
        let old = null;
        if (!figee) {
          // à gauche, l'ancien palier reste lisible, barré : la ligne 3 a été cotée avec lui
          old = el('g', {}, L.grid);
          const ot = text(old, x0 + PAL.dx + PAL.h + 6, y + 41, V1[n - 1], { size: 15, weight: 400, fill: C.tRed });
          const ob = measure(ot);
          el('line', { x1: ob.x, y1: y + 36, x2: ob.x + ob.width, y2: y + 36, stroke: C.tRed, 'stroke-width': 1.5 }, old);
          fit(ot, x0 + PAL.dx + PAL.w - 4, `ancien palier ${n}`);
        }
        L.labs[n] = { a, b, old };
      }
      L.mark = el('g');
      const ml = figee ? 'figée pendant la séance' : 'modifiée à la ligne 15';
      if (figee) lock(L.mark, x0 + PAL.dx + 12, palY(1) + PAL.h + 28, C.tGreen);
      text(L.mark, x0 + PAL.dx + (figee ? 30 : 0), palY(1) + PAL.h + 34, ml, { size: 16, weight: 700, fill: figee ? C.tGreen : C.tRed });

      // Les deux lignes du tableau
      L.lines = [3, 16].map((num, k) => {
        const g = el('g');
        const x = x0 + LN.dx, y = LN.ys[k];
        el('rect', { x, y, width: LN.w, height: LN.h, rx: 14, fill: C.white, stroke: C.line, 'stroke-width': 2 }, g);
        text(g, x + 14, y + 26, `Ligne ${num}`, { size: 17, weight: 800, fill: C.ink });
        text(g, x + 14, y + 48, 'relevé : une fois par mois', { size: 15, weight: 600, fill: C.blue });
        const cy = y + 78;
        const F = chip(g, x + 14, cy, 3);
        text(g, x + 56, cy + 7, '×', { size: 18, weight: 800, fill: C.blue, anchor: 'middle' });
        chip(g, x + 64, cy, GD);
        text(g, x + 106, cy + 7, '×', { size: 18, weight: 800, fill: C.blue, anchor: 'middle' });
        chip(g, x + 114, cy, DD);
        text(g, x + 158, cy + 7, '=', { size: 18, weight: 800, fill: C.blue, anchor: 'middle' });
        const Cc = chip(g, x + 170, cy, 0, 52);
        Cc.r.setAttribute('fill', C.blue);
        // lien avec le palier choisi
        const link = el('path', { fill: 'none', stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' });
        return { g, F, Cc, link, y, cy, num };
      });

      // Verdict
      L.verdict = el('g');
      el('rect', { x: x0 + 24, y: 604, width: PW - 48, height: 124, rx: 16, fill: figee ? C.pGreen : C.pRed }, L.verdict);
      (figee ? G.check : G.cross)(L.verdict, x0 + 52, 636, 14);
      text(L.verdict, x0 + 76, 643, figee ? 'Même fait, même note : 12 et 12.' : 'Même panne, deux notes : 18 et 12.', { size: 19, weight: 800, fill: figee ? C.tGreen : C.tRed });
      G.para(L.verdict, x0 + 48, 676, figee ? 'Grille inadaptée ? On termine avec, on la corrige, on recote tout d’un bloc.' : 'Le tableau ne se trie plus, et le défaut ne se voit pas à la relecture.', PW - 96, { size: 17, weight: 500, fill: C.ink, lh: 1.3 });
      S.panels.push(L);
    });

    S.chute = G.blogChute('Une échelle qui bouge rend tout le tableau incomparable.', { y: 806 });
  }

  // Version de la grille affichée (0 = v1, 1 = v2) pour un panneau
  function gridV(kind, t) {
    if (t < FADE_END) return 1;
    const t0 = kind === 'bouge' ? T.change : T.recot;
    return easeInOut(prog(t, t0, 0.6));
  }
  // Note F d'une ligne : palier de « une fois par mois » dans la grille utilisée pour la coter
  function noteF(kind, k, t) {
    const live = t >= FADE_END;
    if (kind === 'bouge') return k === 0 ? 3 : 2;
    return live && t < T.recot + 0.3 ? 3 : 2;
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.panels.forEach((L, pi) => {
      pop(L.head, t, 1.75 + 0.2 * pi, L.x0 + 160, 212);
      L.grid.setAttribute('opacity', live ? clamp(prog(t, T.grid, 0.3)) : o);
      const gv = gridV(L.kind, t);
      for (let n = 1; n <= 4; n++) {
        L.labs[n].a.setAttribute('opacity', 1 - clamp(gv * 2));
        L.labs[n].b.setAttribute('opacity', clamp(gv * 2 - 1));
        if (L.labs[n].old) L.labs[n].old.setAttribute('opacity', clamp(gv * 2 - 1));
      }
      const mt = L.kind === 'bouge' ? T.change : T.grid + 0.3;
      L.mark.setAttribute('opacity', live ? clamp(prog(t, mt, 0.3)) : o);
      if (L.kind === 'figee' && live && t >= T.change - 0.05 && t < T.change + 0.8) pulse(L.mark, t, T.change, L.x0 + 110, palY(1) + PAL.h + 28, 0.1, 0.45);
      if (L.kind === 'bouge' && live && t >= T.change - 0.05 && t < T.change + 0.9) pulse(L.grid, t, T.change, L.x0 + PAL.dx + PAL.w / 2, palY(2), 0.04, 0.5);

      L.lines.forEach((ln, k) => {
        const tl = k === 0 ? T.l3 : T.l16;
        pop(ln.g, t, tl, L.x0 + LN.dx + LN.w / 2, ln.y + LN.h / 2);
        const f = noteF(L.kind, k, t);
        ln.F.tx.textContent = String(f);
        ln.F.r.setAttribute('fill', LCOL[f]);
        ln.Cc.tx.textContent = String(f * GD * DD);
        const tr = L.kind === 'figee' ? T.recot + 0.3 : -1;
        if (live && tr > 0 && t >= tr && t < tr + 0.8) pulse(ln.F.g, t, tr, L.x0 + LN.dx + 31, ln.cy, 0.25, 0.4);
        // lien vers le palier : visible pendant la cotation, et après la recotation
        const py = palY(f) + PAL.h / 2;
        const xa = L.x0 + PAL.dx + PAL.w, xb = L.x0 + LN.dx;
        ln.link.setAttribute('d', `M ${xa + 2} ${py} C ${xa + 24} ${py} ${xb - 24} ${ln.cy} ${xb - 2} ${ln.cy}`);
        const lo = live ? Math.min(clamp(prog(t, tl + 0.3, 0.25)), 1) * (L.kind === 'figee' && t >= T.recot && t < T.recot + 0.3 ? 0 : 1) : o;
        ln.link.setAttribute('opacity', lo);
      });
      const tv = L.kind === 'bouge' ? T.verdict : T.verdict2;
      pop(L.verdict, t, tv, L.x0 + PW / 2, 666);
    });
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
