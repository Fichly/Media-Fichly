// Blog · Lean Manufacturing · section « Lean Manufacturing, Lean Management, Lean : quelle différence ? »
// Mécanique : deux postes identiques, même chantier 5S (photos avant/après), puis six mois passent.
// À gauche, outils seuls : les outils quittent leur place, le désordre revient, la courbe retombe.
// À droite, outils + routine : un outil manque, le point régulier le voit, il revient ; la courbe tient.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const PANELS = [{ x: 40, kind: 'seul' }, { x: 610, kind: 'routine' }];
  const PW = 550;
  const BOARD = { dx: 28, y: 246, w: 280, h: 170 };
  const BENCH = 440;
  const CH = { dx: 40, y0: 520, y1: 672, w: 470 };   // zone du graphique (m = 0 → 6 mois)
  const BOARD_FILL = '#e6e6f2', SHADOW = '#cbcbe0';
  // Temps → mois : avant le chantier, chantier, puis six mois qui défilent
  const T_CH = 2.7, T_RUN = 3.7, T_END = 10.7;
  const monthAt = t => (t < FADE_END ? 6 : t < T_CH ? 0 : t < T_RUN ? 0.6 * easeInOut(prog(t, T_CH, 0.8)) : 0.6 + 5.4 * prog(t, T_RUN, T_END - T_RUN));
  const CHANTIER = 0.4;

  // État du poste (0 → 1) selon le mois
  function level(kind, m) {
    if (m < CHANTIER) return 0.3;
    const rise = 0.3 + 0.62 * easeInOut(clamp((m - CHANTIER) / 0.2));
    if (m < CHANTIER + 0.2) return rise;
    if (kind === 'seul') return 0.3 + 0.62 * Math.exp(-(m - 0.6) / 1.5);
    let v = 0.92;
    if (m > 2.0) v -= 0.07 * Math.min(1, (m - 2.0) / 0.15);   // un outil manque…
    if (m > 2.5) v += 0.07 * Math.min(1, (m - 2.5) / 0.15);   // … le point régulier le voit, il revient
    if (m > 4.0) v += 0.03 * Math.min(1, (m - 4.0) / 0.3);    // et on améliore encore
    return v;
  }
  // Outils absents : même état de départ pour les deux postes ; à droite, un seul écart, vite traité
  const MISSING0 = [0, 1, 3];
  function toolPresent(kind, i, m) {
    if (m < CHANTIER + 0.05) return !MISSING0.includes(i);
    if (kind === 'seul') return !({ 1: 1.5, 3: 3.0, 0: 4.5 }[i] <= m);
    return !(i === 2 && m >= 2.0 && m < 2.5);
  }
  const CLUTTER = [2.2, 3.7, 5.2];       // mois d'apparition du désordre (poste sans routine)
  const clutterOn = (kind, k, m) => (m < CHANTIER + 0.05 ? true : kind === 'seul' && m >= CLUTTER[k]);
  const ITEMS = {
    seul: [[1.0, 'Aucun point régulier'], [3.0, 'Les écarts s’accumulent'], [5.5, 'Retour à l’état initial']],
    routine: [[1.0, 'Un point court et régulier'], [2.5, 'Un responsable par écart'], [4.0, 'Des indicateurs affichés']],
  };

  const S = { panels: [] };

  // ---------- Outils du tableau (dessinés centrés sur cx, cy) ----------
  const TOOLS = [
    (g, cx, cy, sh) => { el('rect', { x: cx - 5, y: cy - 16, width: 10, height: 60, rx: 4, fill: sh || C.yellow }, g); el('rect', { x: cx - 25, y: cy - 34, width: 50, height: 20, rx: 5, fill: sh || C.ink }, g); },
    (g, cx, cy, sh) => { el('rect', { x: cx - 6, y: cy - 20, width: 12, height: 64, rx: 6, fill: sh || C.lightBlue }, g); el('circle', { cx, cy: cy - 28, r: 16, fill: sh || C.lightBlue }, g); el('rect', { x: cx - 5, y: cy - 47, width: 10, height: 17, rx: 2, fill: BOARD_FILL }, g); },
    (g, cx, cy, sh) => { el('rect', { x: cx - 3, y: cy - 40, width: 6, height: 44, rx: 2, fill: sh || C.ink }, g); el('rect', { x: cx - 10, y: cy + 2, width: 20, height: 42, rx: 7, fill: sh || C.red }, g); },
    (g, cx, cy, sh) => { el('rect', { x: cx - 24, y: cy - 20, width: 48, height: 48, rx: 13, fill: sh || C.yellow }, g); el('circle', { cx, cy: cy + 4, r: 9, fill: sh ? BOARD_FILL : C.white }, g); el('rect', { x: cx + 18, y: cy + 18, width: 14, height: 8, rx: 2, fill: sh || C.ink }, g); },
  ];

  function camera(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('rect', { x: cx - 16, y: cy - 10, width: 32, height: 22, rx: 5, fill: C.ink }, g);
    el('rect', { x: cx - 7, y: cy - 15, width: 14, height: 6, rx: 2, fill: C.ink }, g);
    el('circle', { cx, cy: cy + 1, r: 7, fill: C.white }, g);
    el('circle', { cx, cy: cy + 1, r: 3.5, fill: C.ink }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Un 5S sans routine', 'ne tient pas.', { size: 48 });
    G.blogChapeau('Même chantier 5S sur deux postes, mêmes photos avant / après. Six mois plus tard :');

    PANELS.forEach((P, pi) => {
      const x0 = P.x, routine = P.kind === 'routine';
      const L = { kind: P.kind, x0 };
      G.card(x0, 176, PW, 580);
      L.head = el('g');
      G.pill(L.head, x0 + 28, 212, routine ? 'Outils + routine de management' : 'Outils seuls', { size: 20, h: 36, bg: routine ? C.pGreen : C.pRed, fg: routine ? C.tGreen : C.tRed });

      // Tableau d'outils (ombres = place de chaque outil)
      const bx = x0 + BOARD.dx;
      el('rect', { x: bx, y: BOARD.y, width: BOARD.w, height: BOARD.h, rx: 14, fill: BOARD_FILL });
      for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) el('circle', { cx: bx + 20 + c * 30, cy: BOARD.y + 18 + r * 45, r: 2, fill: SHADOW, opacity: 0.6 });
      L.tools = TOOLS.map((draw, i) => {
        const cx = bx + 42 + i * 65, cy = BOARD.y + 84;
        draw(el('g'), cx, cy, SHADOW);
        const g = el('g');
        draw(g, cx, cy);
        return { g, cx, cy };
      });
      el('rect', { x: bx - 10, y: BENCH, width: BOARD.w + 20, height: 12, rx: 6, fill: C.ink, opacity: 0.85 });
      // Désordre sur l'établi
      L.clutter = [[bx + 40, 0], [bx + 150, 1], [bx + 232, 2]].map(([cx, k]) => {
        const g = el('g');
        G.carton(g, cx, BENCH - 16, 0.95);
        if (k !== 1) G.carton(g, cx + 30, BENCH - 16, 0.95);
        if (k === 2) G.carton(g, cx + 15, BENCH - 46, 0.95);
        return g;
      });

      // Liste à droite du tableau
      L.items = ITEMS[P.kind].map(([m, s], k) => {
        const g = el('g');
        const cy = 272 + k * 62;
        (routine ? G.check : G.cross)(g, x0 + 340, cy, 14);
        G.para(g, x0 + 362, cy + 7, s, PW - 380, { size: 18, weight: 700, fill: routine ? C.tGreen : C.tRed, lh: 1.2 });
        return { g, m, cy };
      });

      // Graphique : état du poste sur six mois
      const cx0 = x0 + CH.dx, W = CH.w;
      const X = m => cx0 + W * m / 6, Y = v => CH.y1 - (CH.y1 - CH.y0) * v;
      L.X = X; L.Y = Y;
      text(G.svg, cx0, 484, 'État du poste', { size: 17, weight: 700, fill: C.ink });
      if (routine) {
        const lg = text(G.svg, cx0 + W, 484, 'point régulier', { size: 15, weight: 600, fill: C.blue, anchor: 'end' });
        el('circle', { cx: measure(lg).x - 14, cy: 479, r: 5, fill: C.blue });
      }
      el('line', { x1: cx0, y1: CH.y1, x2: cx0 + W, y2: CH.y1, stroke: C.line, 'stroke-width': 3 });
      el('line', { x1: cx0, y1: Y(0.3), x2: cx0 + W, y2: Y(0.3), stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '6 6' });
      text(G.svg, cx0 + W, Y(0.3) + 20, 'état de départ', { size: 15, weight: 500, fill: C.ink, anchor: 'end' }).setAttribute('opacity', 0.7);
      [[0, 'Avant'], [3, '+3 mois'], [6, '+6 mois']].forEach(([m, s], k) => {
        text(G.svg, X(m), CH.y1 + 26, s, { size: 15, weight: 600, fill: C.ink, anchor: k === 0 ? 'start' : k === 2 ? 'end' : 'middle' });
      });
      const pts = [];
      for (let m = 0; m <= 6.0001; m += 0.02) pts.push(`${X(m).toFixed(1)} ${Y(level(P.kind, m)).toFixed(1)}`);
      const clip = G.clipRect(cx0 - 6, CH.y0 - 30, 0, CH.y1 - CH.y0 + 40);
      L.clip = clip.rect;
      const cg = el('g', { 'clip-path': clip.url });
      el('path', { d: `M ${pts.join(' L ')} L ${X(6)} ${CH.y1} L ${X(0)} ${CH.y1} Z`, fill: routine ? C.pGreen : C.pRed, opacity: 0.8 }, cg);
      el('path', { d: 'M ' + pts.join(' L '), fill: 'none', stroke: routine ? C.green : C.red, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, cg);
      L.dot = el('circle', { r: 7, fill: routine ? C.tGreen : C.tRed, stroke: C.white, 'stroke-width': 2.5 });
      // Photos avant/après au pic du chantier
      L.cam = el('g');
      camera(L.cam, X(CHANTIER + 0.3) + 22, Y(0.92) - 22);
      text(L.cam, X(CHANTIER + 0.3) + 46, Y(0.92) - 16, routine ? 'chantier 5S' : 'chantier 5S, photos avant / après', { size: 15, weight: 600, fill: C.ink });
      // Points réguliers (routine) le long de l'axe
      L.ticks = routine ? [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(m => ({ m, c: el('circle', { cx: X(m), cy: CH.y1, r: 5, fill: C.blue }) })) : [];
      S.panels.push(L);
    });

    S.chute = G.blogChute('Des outils sans routine durent rarement plus de quelques mois.', { y: 812 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const m = monthAt(t);

    S.panels.forEach((L, pi) => {
      pop(L.head, t, 1.75 + 0.2 * pi, L.x0 + 150, 212);
      // Outils : quittent leur place (chute et fondu) ou y reviennent (pop)
      L.tools.forEach((tl, i) => {
        const on = toolPresent(L.kind, i, m);
        let ok = on ? 1 : 0;
        if (live && t >= T_CH - 0.2 && t < T_RUN && on && MISSING0.includes(i)) {
          const q = prog(t, T_CH + 0.15 + 0.1 * i, 0.35);   // le chantier remet chaque outil à sa place
          ok = q;
        }
        tl.g.setAttribute('opacity', live ? ok : ok * o);
        tl.g.setAttribute('transform', ok > 0 && ok < 1 ? `translate(0 ${-24 * (1 - easeOut(ok))})` : '');
      });
      L.clutter.forEach((g, k) => g.setAttribute('opacity', clutterOn(L.kind, k, m) ? o : 0));
      // Liste
      L.items.forEach(it => {
        const q = live ? prog(m, it.m, 0.25) : 1;
        const s = q <= 0 ? 0.001 : q >= 1 ? 1 : 0.6 + 0.4 * back(q);
        const cx = L.x0 + 340;
        it.g.setAttribute('transform', s === 1 ? '' : `translate(${cx} ${it.cy}) scale(${s}) translate(${-cx} ${-it.cy})`);
        it.g.setAttribute('opacity', (live ? clamp(q / 0.4) : 1) * o);
      });
      // Courbe dessinée jusqu'au mois courant, point curseur
      const xm = L.X(m);
      L.clip.setAttribute('width', live && t < T_CH ? 0 : Math.max(0.001, xm - L.X(0) + 8));
      L.dot.setAttribute('cx', xm);
      L.dot.setAttribute('cy', L.Y(level(L.kind, m)));
      L.dot.setAttribute('opacity', live ? (t < T_CH - 0.3 ? 0 : 1) : o);
      pop(L.cam, t, T_CH + 0.55, L.X(CHANTIER + 0.3) + 22, L.Y(0.92) - 22);
      L.ticks.forEach(tk => tk.c.setAttribute('opacity', m >= tk.m ? o : 0));
    });
    rise(S.chute, t, T_END + 0.2, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
