// Story · SMED (famille 5, Efficacité de production)
// Idée de l'article methode-smed-5-etapes : « Interne = machine arrêtée. Externe = machine en marche. »
// Code visuel de la fiche n° 40 du deck : opérations internes « I » en bleu, externes « E » en violet,
// les externes se font avant ou après l'arrêt. Proportions illustratives, aucune durée affichée :
// sortir l'externe raccourcit l'arrêt d'environ 20 % (article : 52 → 41 min à l'étape 2), réduire
// l'interne mène à environ −40 % (un premier chantier gagne couramment 30 à 50 %).
Story.scene({
  // Vraie fiche : vignette Canva du deck (FR - Outils du Lean - VF), numéro du Guide du deck
  fiche: { recto: '../../assets/produit/canva/page-085.png', numero: 40 },
  famille: 5,
  outil: 'SMED',
  titre: ['SMED'],
  accroche: { lignes: ['Changer de série', 'bloque la machine.'], accent: 1 },
  retenir: 'Ce qui peut se faire machine en marche sort de l’arrêt.',

  build(S, A, root) {
    const { el, text, pill, C, ZONE } = A;
    const I = '#74a3d6', E = '#aa76b2';
    const Y = 940, BH = 112;
    S.Y = Y; S.BH = BH;
    const w = [66, 162, 57, 190, 48, 314];               // 837 px, centrés dans la zone
    const kind = ['E', 'I', 'E', 'I', 'E', 'I'];
    let x = ZONE.x + (ZONE.w - 837) / 2;
    // Positions finales : E E | I I I | E, puis l'interne réduit à 75 %
    const fin = { 0: 100, 2: 170 };
    let xi = 235, xs = 235;
    S.tasks = w.map((wd, i) => {
      const g = el('g', {}, root);
      const r = el('rect', { x: 0, y: 0, width: wd - 6, height: BH, rx: 14, fill: '#d9dbe6' }, g);
      const l = text(g, (wd - 6) / 2, BH / 2 + 15, kind[i], { size: 42, weight: 700, fill: C.white, anchor: 'middle' });
      const tk = { g, r, l, w: wd, x0: x, k: kind[i], i };
      x += wd;
      if (kind[i] === 'I') { tk.xc = xi; xi += wd; tk.xs = xs; xs += wd * 0.75; }
      return tk;
    });
    S.endI = xi; S.endS = xs;
    S.tasks[0].xc = S.tasks[0].xs = 100;
    S.tasks[2].xc = S.tasks[2].xs = 170;
    S.tasks[4].xc = xi + 8; S.tasks[4].xs = xs + 8;
    // Accolade « Machine arrêtée » au-dessus des opérations faites à l'arrêt
    S.br = el('g', {}, root);
    S.brLine = el('line', { x1: 0, y1: Y - 34, x2: 0, y2: Y - 34, stroke: C.coral, 'stroke-width': 8, 'stroke-linecap': 'round' }, S.br);
    S.brL = el('line', { x1: 0, y1: Y - 54, x2: 0, y2: Y - 14, stroke: C.coral, 'stroke-width': 6, 'stroke-linecap': 'round' }, S.br);
    S.brR = el('line', { x1: 0, y1: Y - 54, x2: 0, y2: Y - 14, stroke: C.coral, 'stroke-width': 6, 'stroke-linecap': 'round' }, S.br);
    S.brTag = el('g', {}, S.br);
    S.brPill = pill(S.brTag, 0, Y - 92, 'Machine arrêtée', { size: 32, bg: C.coralSoft, fg: C.ko, h: 54, anchor: 'middle' });
    // Pictogrammes « en marche » au-dessus des opérations externes, une fois sorties
    S.play = [0, 2, 4].map(i => { const g = el('g', {}, root); el('path', { d: 'M -10 -13 L 14 0 L -10 13 Z', fill: E }, g); return { g, i }; });
    // Fantôme de l'arrêt d'origine et gain
    S.ghost = el('line', { x1: ZONE.x + (ZONE.w - 837) / 2, y1: Y + BH + 40, x2: ZONE.x + (ZONE.w - 837) / 2 + 837, y2: Y + BH + 40, stroke: C.coral, 'stroke-width': 4, 'stroke-dasharray': '10 10', opacity: 0 }, root);
    // Gain : le but de la fiche n° 40, « augmenter la disponibilité des équipements »
    S.gain = el('g', {}, root);
    const gy = Y + BH + 110;
    const gp = pill(S.gain, 540 + 36, gy, 'Plus de disponibilité', { size: 36, bg: C.greenSoft, fg: C.ok, h: 64, anchor: 'middle' });
    A.check(S.gain, gp.x - 42, gy, 30);
    A.inZone(S.gain, 'gain');
    S.gy = gy;
    // Légendes successives
    const cap = str => { const g = el('g', {}, root); A.fit(text(g, 540, 732, str, { size: 52, weight: 700, fill: C.ink, anchor: 'middle' }), ZONE.x + ZONE.w, 'légende', ZONE.x); return g; };
    S.caps = [[cap('Interne ou externe ?'), 4.4, 5.95], [cap('Sortir l’externe'), 6.1, 7.7], [cap('Puis réduire l’interne'), 7.85, 9.3], [cap('Arrêt plus court'), 9.45, null]];
    S.I = I; S.E = E;
  },

  anim(t, S, A) {
    const { show, prog, easeInOut, lerp } = A;
    const pc = easeInOut(prog(t, 6.2, 0.8)), ps = easeInOut(prog(t, 7.95, 0.8));
    S.tasks.forEach((tk, k) => {
      const pin = prog(t, 3.25 + k * 0.1, 0.3);
      const cls = prog(t, 4.5 + k * 0.15, 0.3);              // classement I / E
      let x = lerp(tk.x0, tk.xc, pc), w = tk.w - 6;
      if (tk.k === 'I') { x = lerp(x, tk.xs, ps); w = (tk.w * lerp(1, 0.75, ps)) - 6; }
      else x = lerp(x, tk.xs, ps);
      tk.g.setAttribute('transform', `translate(${x.toFixed(2)} ${S.Y})`);
      tk.g.setAttribute('opacity', pin.toFixed(3));
      tk.r.setAttribute('width', Math.max(10, w).toFixed(2));
      tk.r.setAttribute('fill', cls > 0.5 ? (tk.k === 'I' ? S.I : S.E) : '#d9dbe6');
      tk.l.setAttribute('x', (w / 2).toFixed(2));
      tk.l.setAttribute('opacity', cls.toFixed(3));
    });
    // Accolade : tout l'arrêt, puis seulement l'interne, puis l'interne réduit
    const a0 = S.tasks[0].x0, b0 = S.tasks[5].x0 + S.tasks[5].w - 6;
    const a = lerp(a0, 235, pc), b = lerp(lerp(b0, S.endI - 6, pc), S.endS - 6, ps);
    S.brLine.setAttribute('x1', a); S.brLine.setAttribute('x2', b);
    S.brL.setAttribute('x1', a); S.brL.setAttribute('x2', a); S.brR.setAttribute('x1', b); S.brR.setAttribute('x2', b);
    S.brTag.setAttribute('transform', `translate(${((a + b) / 2).toFixed(2)} 0)`);
    show(S.br, t, 3.4, { dur: 0.4, from: 'fade' });
    // « En marche » au-dessus des externes, une fois sorties
    S.play.forEach(p => {
      const tk = S.tasks[p.i];
      const x = lerp(lerp(tk.x0, tk.xc, pc), tk.xs, ps) + (tk.w - 6) / 2;
      p.g.setAttribute('transform', `translate(${x.toFixed(2)} ${S.Y - 34})`);
      p.g.setAttribute('opacity', prog(t, 6.9, 0.3).toFixed(3));
    });
    S.ghost.setAttribute('opacity', (0.8 * prog(t, 6.3, 0.4)).toFixed(3));
    show(S.gain, t, 9.7, { from: 'pop', cx: 540, cy: S.gy, dur: 0.45 });
    S.caps.forEach(([g, s, o]) => show(g, t, s, { dur: 0.35, from: 'up', d: 20, out: o, outDur: 0.15 }));
  },
});
