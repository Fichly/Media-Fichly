// Story · SMED (famille 5, Efficacité de production)
// Idée reprise de l'article methode-smed-5-etapes : « Interne = machine arrêtée. Externe = machine
// en marche. » On sort de l'arrêt tout ce qui peut se faire machine en marche, puis on réduit le reste.
// Les longueurs de tâches sont illustratives : aucune durée n'est affichée.
Story.scene({
  // Vraie fiche : vignette Canva du deck (FR - Outils du Lean - VF), numéro du Guide du deck
  fiche: { recto: '../../assets/produit/canva/page-085.png', numero: 40 },
  famille: 5,
  outil: 'SMED',
  titre: ['SMED'],
  accroche: { lignes: ['Changer de série', 'bloque la machine.'], accent: 1 },
  retenir: 'Ce qui peut se faire machine en marche sort de l’arrêt.',
  poster: 11.2,

  build(S, A, root) {
    const { el, text, pill, C, ZONE } = A;
    const X0 = ZONE.x, L1 = 830, L2 = 1150, BH = 112;
    S.L1 = L1; S.L2 = L2;
    // Somme = 880, la largeur de la zone. Les externes pèsent 20 % de l'arrêt (article : 52 → 41 min à l'étape 2),
    // la réduction de l'interne mène à environ −40 % (un premier chantier gagne couramment 30 à 50 %).
    const widths = [70, 170, 60, 200, 50, 330];
    const ext = [0, 2, 4];                               // tâches qui peuvent se faire machine en marche
    // Contour fantôme de l'arrêt d'origine
    S.ghost = el('rect', { x: X0, y: L1, width: ZONE.w, height: BH, rx: 16, fill: 'none', stroke: C.coral, 'stroke-width': 3, 'stroke-dasharray': '12 10' }, root);
    S.l1 = el('g', {}, root);
    pill(S.l1, X0, L1 - 62, 'Interne · machine arrêtée', { size: 32, bg: C.coralSoft, fg: C.ko, h: 56 });
    S.l2 = el('g', {}, root);
    pill(S.l2, X0, L2 + BH + 54, 'Externe · machine en marche', { size: 32, bg: C.greenSoft, fg: C.ok, h: 56 });
    S.lane2 = el('rect', { x: X0, y: L2, width: ZONE.w, height: BH, rx: 16, fill: C.surface }, root);
    // Les six tâches
    let x = X0, xe = X0;
    S.tasks = widths.map((w, i) => {
      const isExt = ext.includes(i);
      const g = el('g', {}, root);
      const r = el('rect', { x: 0, y: 0, width: w - 8, height: BH, rx: 14, fill: C.coral }, g);
      const tk = { g, r, w, x0: x, isExt, i };
      if (isExt) { tk.xe = xe; xe += w; tk.te = 4.6 + ext.indexOf(i) * 0.55; }
      x += w;
      return tk;
    });
    // Positions resserrées puis réduites des tâches internes
    let xi = X0, xs = X0;
    S.tasks.filter(tk => !tk.isExt).forEach(tk => { tk.xc = xi; xi += tk.w; tk.xs = xs; xs += tk.w * 0.75; });
    S.endShort = xs;
    S.shrink = el('g', {}, root);
    text(S.shrink, X0, L1 + BH + 66, 'Puis réduire l’interne', { size: 36, weight: 600, fill: C.indigo, italic: true });
    // Gain : accolade sur la partie libérée
    S.gain = el('g', {}, root);
    const gy = L1 + BH / 2;
    el('line', { x1: xs + 10, y1: gy, x2: X0 + ZONE.w - 4, y2: gy, stroke: C.green, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '2 14' }, S.gain);
    S.gainTag = A.pill(S.gain, (xs + X0 + ZONE.w) / 2 + 6, gy, 'Arrêt plus court', { size: 32, bg: C.green, fg: C.ink, h: 56, anchor: 'middle' });
  },

  anim(t, S, A) {
    const { show, prog, easeInOut, lerp, C } = A;
    show(S.l1, t, 3.1, { dur: 0.4, from: 'up' });
    S.tasks.forEach((tk, k) => {
      // Entrée de la barre complète, tâche par tâche
      const pin = prog(t, 3.25 + k * 0.12, 0.3);
      let x = tk.x0, y = S.L1, w = tk.w - 8, fill = C.coral;
      if (tk.isExt) {
        const p = easeInOut(prog(t, tk.te, 0.6));
        x = lerp(tk.x0, tk.xe, p); y = lerp(S.L1, S.L2, p);
        if (p > 0.5) fill = C.green;
      } else {
        const pc = easeInOut(prog(t, 6.75, 0.5));
        const ps = easeInOut(prog(t, 8.3, 0.7));
        x = lerp(lerp(tk.x0, tk.xc, pc), tk.xs, ps);
        w = tk.w * lerp(1, 0.75, ps) - 8;
      }
      tk.g.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      tk.g.setAttribute('opacity', pin.toFixed(3));
      tk.r.setAttribute('width', Math.max(10, w).toFixed(2));
      tk.r.setAttribute('fill', fill);
    });
    show(S.l2, t, 4.3, { dur: 0.4, from: 'up' });
    S.lane2.setAttribute('opacity', prog(t, 4.3, 0.4).toFixed(3));
    S.ghost.setAttribute('opacity', (0.7 * prog(t, 6.75, 0.4)).toFixed(3));
    show(S.shrink, t, 7.9, { dur: 0.4, from: 'up', d: 20 });
    show(S.gain, t, 9.4, { dur: 0.5, from: 'fade' });
    show(S.gainTag.g, t, 9.5, { from: 'pop', cx: +S.gainTag.x + S.gainTag.w / 2, cy: S.L1 + 56, dur: 0.45 });
  },
});
