// Blog · QQOQCCP · section « QQOQCP ou QQOQCCP : pourquoi deux graphies »
// Mécanique : deux problèmes cadrés en QQOQCP (six questions) ne se comparent pas ; la balance penche du côté de la voix
// la plus forte. Le second C (Combien) s'insère dans le sigle et dans les deux fiches : les chiffres tombent dans les
// plateaux, la balance bascule de l'autre côté. Six mois plus tard, le même Combien dit si la situation s'est améliorée.
// Hypothèses : valeurs illustratives (A 2 %, B 7 %, B à 3 % six mois plus tard), la voix forte côté A.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const LETTERS = ['Q', 'Q', 'O', 'Q', 'C', 'C', 'P'];   // index 5 : le second C, inséré
  const TILE = { w: 44, h: 50, step: 54, y: 224 };
  const CARDS = [{ x: 60, name: 'Problème A', val: 2 }, { x: 800, name: 'Problème B', val: 7 }];
  const ROWS = ['Quoi', 'Qui', 'Où', 'Quand', 'Comment', 'Combien', 'Pourquoi'];
  const BARW = [[170, 120, 150, 110, 180, 0, 140], [130, 160, 110, 170, 140, 0, 150]];
  const ROW_Y = k => 372 + 42 * k;
  const BAL = { cx: 600, cy: 478, arm: 128, hang: 72 };
  const T = { sigle: 1.8, cards: 2.2, bal: 3.2, ask: 3.6, voices: 4.1, tiltA: 4.5, capA: 5.2,
    insert: 6.3, rows: 6.8, val: 7.3, swap: 8.0, tiltB: 8.4, capB: 9.3, later: 10.4, drop: 11.0, chute: 12.2 };
  const TILT_A = 9, TILT_B = -12;
  const S = {};

  function bubble(parent, w, h) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${-w / 2 + 12} ${-h} L ${w / 2 - 12} ${-h} Q ${w / 2} ${-h} ${w / 2} ${-h + 12} L ${w / 2} ${-12} Q ${w / 2} 0 ${w / 2 - 12} 0 L ${-w / 2 + 26} 0 L ${-w / 2 + 10} ${h * 0.3} L ${-w / 2 + 14} 0 L ${-w / 2 + 12} 0 Q ${-w / 2} 0 ${-w / 2} -12 L ${-w / 2} ${-h + 12} Q ${-w / 2} ${-h} ${-w / 2 + 12} ${-h} Z`, fill: C.white, stroke: C.red, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    const r = Math.max(3, h / 9);
    [-1, 0, 1].forEach(k => el('circle', { cx: k * r * 3, cy: -h / 2, r, fill: C.red }, g));
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Sans Combien,', 'rien à trancher.');
    G.blogChapeau('Le second C du QQOQCCP est celui de Combien. En atelier, c’est lui qui tranche.');
    G.card(40, 176, 1120, 584);

    // Sigle : six lettres, puis sept
    S.tiles = LETTERS.map((l, i) => {
      const g = el('g');
      const second = i === 5;
      el('rect', { x: -TILE.w / 2, y: -TILE.h / 2, width: TILE.w, height: TILE.h, rx: 10, fill: second ? C.green : C.blue }, g);
      text(g, 0, 11, l, { size: 30, weight: 800, fill: C.white, anchor: 'middle' });
      return { g, second };
    });
    S.combienLab = text(G.svg, 0, TILE.y + 48, 'Combien', { size: 17, weight: 700, fill: C.tGreen, anchor: 'middle' });
    S.sigleLab = el('g');
    text(S.sigleLab, 350, TILE.y + 7, 'QQOQCP', { size: 18, weight: 700, fill: C.ink, anchor: 'end' });
    S.sigleLab2 = el('g');
    text(S.sigleLab2, 850, TILE.y + 7, 'QQOQCCP', { size: 18, weight: 700, fill: C.tGreen });

    // Fiches des deux problèmes
    S.cards = CARDS.map((cd, ci) => {
      const g = el('g');
      el('rect', { x: cd.x, y: 300, width: 340, height: 420, rx: 20, fill: C.white, stroke: C.line, 'stroke-width': 2 }, g);
      G.pill(g, cd.x + 170, 334, cd.name, { size: 19, h: 36, bg: C.pLav, fg: C.blue, anchor: 'middle' });
      const rows = ROWS.map((r, k) => {
        const rg = el('g', {}, g);
        const comb = k === 5;
        text(rg, cd.x + 22, 6, r, { size: 17, weight: 700, fill: comb ? C.tGreen : C.blue });
        if (comb) {
          const v = text(rg, cd.x + 122, 7, `${cd.val}${NB}% des pièces`, { size: 20, weight: 800, fill: C.tGreen });
          fit(v, cd.x + 330, 'valeur Combien');
        } else el('rect', { x: cd.x + 122, y: -6, width: BARW[ci][k], height: 12, rx: 6, fill: C.line }, rg);
        return { g: rg, comb, k };
      });
      return { ...cd, g, rows };
    });
    // Six mois plus tard (fiche B)
    S.later = el('g');
    el('line', { x1: 820, y1: 648, x2: 1120, y2: 648, stroke: C.line, 'stroke-width': 2 }, S.later);
    text(S.later, 822, 680, 'Six mois plus tard', { size: 17, weight: 700, fill: C.ink });
    S.laterVal = text(S.later, 822, 708, `3${NB}% des pièces`, { size: 20, weight: 800, fill: C.tGreen });
    G.pill(S.later, 1118, 694, 'mieux', { size: 16, h: 32, pad: 10, bg: C.pGreen, fg: C.tGreen, icon: 'check' }).g.setAttribute('transform', 'translate(-88 0)');

    // Balance
    S.balQ = text(G.svg, BAL.cx, 336, `Lequel traiter d’abord${NB}?`, { size: 20, weight: 700, fill: C.ink, anchor: 'middle' });
    S.bal = el('g');
    el('path', { d: `M ${BAL.cx - 46} 700 L ${BAL.cx + 46} 700 L ${BAL.cx} 664 Z`, fill: C.blue }, S.bal);
    el('rect', { x: BAL.cx - 5, y: BAL.cy, width: 10, height: 200, rx: 5, fill: C.blue }, S.bal);
    S.beam = el('g', {}, S.bal);
    el('rect', { x: BAL.cx - BAL.arm - 6, y: BAL.cy - 5, width: 2 * BAL.arm + 12, height: 10, rx: 5, fill: C.ink }, S.beam);
    el('circle', { cx: BAL.cx, cy: BAL.cy, r: 9, fill: C.yellow, stroke: C.ink, 'stroke-width': 3 }, S.bal);
    S.pans = [-1, 1].map(side => {
      const g = el('g', {}, S.bal);
      el('line', { x1: -38, y1: BAL.hang, x2: 0, y2: 0, stroke: C.ink, 'stroke-width': 2 }, g);
      el('line', { x1: 38, y1: BAL.hang, x2: 0, y2: 0, stroke: C.ink, 'stroke-width': 2 }, g);
      el('path', { d: `M -48 ${BAL.hang} L 48 ${BAL.hang} Q 40 ${BAL.hang + 22} 0 ${BAL.hang + 22} Q -40 ${BAL.hang + 22} -48 ${BAL.hang} Z`, fill: C.blue }, g);
      text(g, 0, BAL.hang + 16, side < 0 ? 'A' : 'B', { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
      const voice = bubble(g, side < 0 ? 78 : 38, side < 0 ? 50 : 26);
      voice.setAttribute('transform', `translate(0 ${BAL.hang - 4})`);
      const num = text(g, 0, BAL.hang - 10, `${side < 0 ? 2 : 7}${NB}%`, { size: 28, weight: 800, fill: C.tGreen, anchor: 'middle' });
      return { g, side, voice, num };
    });
    S.capA = text(G.svg, BAL.cx, 742, 'Sans chiffre : la voix la plus forte gagne', { size: 17, weight: 700, fill: C.tRed, anchor: 'middle' });
    S.capB = text(G.svg, BAL.cx, 742, 'Avec Combien : B d’abord, 7 % contre 2 %', { size: 17, weight: 700, fill: C.tGreen, anchor: 'middle' });
    [S.capA, S.capB].forEach((c, i) => fit(c, 790, `légende balance ${i}`, 410));

    S.chute = G.blogChute('Sans Combien : ni comparaison, ni suivi dans le temps.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const ins = live ? easeInOut(prog(t, T.insert, 0.6)) : 1;   // insertion du second C

    // Sigle : les lettres s'écartent, le second C prend sa place
    const n = 6 + ins;
    S.tiles.forEach((tl, i) => {
      const idx = i < 5 ? i : i === 5 ? 5 : 5 + ins;
      const x = 600 + (idx - (n - 1) / 2) * TILE.step;
      let s = 1, op = o;
      if (live) {
        const pa = prog(t, T.sigle + 0.06 * i, 0.3);
        s = pa <= 0 ? 0.001 : pa >= 1 ? 1 : 0.6 + 0.4 * G.back(pa);
        op = clamp(pa / 0.4);
        if (tl.second) { const pb = prog(t, T.insert + 0.25, 0.35); s = pb <= 0 ? 0.001 : pb >= 1 ? 1 : 0.6 + 0.4 * G.back(pb); op = clamp(pb / 0.4); }
      }
      tl.g.setAttribute('transform', `translate(${x} ${TILE.y}) scale(${s})`);
      tl.g.setAttribute('opacity', op);
    });
    S.combienLab.setAttribute('x', 600 + (5 - 3) * TILE.step);
    S.combienLab.setAttribute('opacity', live ? clamp(prog(t, T.insert + 0.5, 0.3)) : o);
    // Étiquettes du sigle : QQOQCP à gauche avant, QQOQCCP à droite après
    S.sigleLab.setAttribute('opacity', live ? window01(t, T.sigle + 0.4, T.insert, 0.3) : 0);
    rise(S.sigleLab2, t, T.insert + 0.6, 0.35);

    // Fiches : la rangée Combien s'insère, Pourquoi descend d'un cran
    S.cards.forEach((cd, ci) => {
      pop(cd.g, t, T.cards + 0.15 * ci, cd.x + 170, 510);
      const shift = live ? easeInOut(prog(t, T.rows, 0.45)) : 1;
      cd.rows.forEach(r => {
        let y = ROW_Y(r.k), op = 1;
        if (r.k === 6) y = ROW_Y(5) + 42 * shift;
        if (r.comb) {
          op = live ? clamp(prog(t, T.val, 0.3)) : 1;
          if (live && t >= T.val - 0.1) {
            const p = prog(t, T.val, 0.45);
            const s = p > 0 && p < 1 ? 1 + 0.1 * Math.sin(Math.PI * p) : 1;
            r.g.setAttribute('transform', `translate(0 ${y})` + (s === 1 ? '' : ` translate(${cd.x + 170} 0) scale(${s}) translate(${-cd.x - 170} 0)`));
          } else r.g.setAttribute('transform', `translate(0 ${y})`);
        } else r.g.setAttribute('transform', `translate(0 ${y})`);
        r.g.setAttribute('opacity', op);
      });
    });
    pop(S.later, t, T.later, 970, 690);

    // Balance : d'abord la voix forte, puis les chiffres
    pop(S.bal, t, T.bal, BAL.cx, 590);
    S.balQ.setAttribute('opacity', live ? clamp(prog(t, T.ask, 0.3)) : o);
    let ang = TILT_B;
    if (live) ang = TILT_A * easeInOut(prog(t, T.tiltA, 0.7)) + (TILT_B - TILT_A) * easeInOut(prog(t, T.tiltB, 0.9));
    S.beam.setAttribute('transform', `rotate(${-ang} ${BAL.cx} ${BAL.cy})`);
    const a = -ang * Math.PI / 180;
    S.pans.forEach(p => {
      const px = BAL.cx + p.side * BAL.arm * Math.cos(a), py = BAL.cy + p.side * BAL.arm * Math.sin(a);
      p.g.setAttribute('transform', `translate(${px} ${py})`);
      const vo = live ? clamp(prog(t, T.voices + (p.side < 0 ? 0 : 0.2), 0.3)) * (1 - clamp(prog(t, T.swap, 0.3))) : 0;
      p.voice.setAttribute('opacity', vo);
      // Les chiffres tombent dans les plateaux
      const pn = live ? prog(t, T.swap + 0.2 + (p.side < 0 ? 0 : 0.15), 0.4) : 1;
      p.num.setAttribute('opacity', clamp(pn / 0.3));
      p.num.setAttribute('transform', `translate(0 ${-40 * (1 - easeOut(pn))})`);
    });
    S.capA.setAttribute('opacity', live ? window01(t, T.capA, T.swap, 0.3) : 0);
    S.capB.setAttribute('opacity', live ? clamp(prog(t, T.capB, 0.3)) : o);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
