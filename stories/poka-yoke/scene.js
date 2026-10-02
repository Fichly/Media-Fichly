// Story · Poka-Yoke (famille 6, Amélioration de la production)
// Pas d'article Fichly sur cet outil : définition standard (Shigeo Shingo, système de production
// Toyota). Un détrompeur rend l'erreur physiquement impossible au lieu de compter sur la vigilance.
Story.scene({
  // Vraie fiche : vignette Canva du deck (FR - Outils du Lean - VF), numéro du Guide du deck
  fiche: { recto: '../../assets/produit/canva/page-087.png', numero: 41 },
  famille: 6,
  outil: 'Poka-Yoke',
  titre: ['Poka-Yoke'],
  accroche: { lignes: ['L’erreur arrive', 'même aux meilleurs.'], accent: 1 },
  retenir: 'Rendre l’erreur impossible plutôt que compter sur l’attention.',
  poster: 10.8,

  build(S, A, root0) {
    const { el, text, width, C, cross, check } = A;
    // Gabarit, pièce et détrompeur agrandis de 30 % autour du logement, pour rester lisibles en bulle
    const root = el('g', { transform: 'translate(540 1150) scale(1.3) translate(-540 -1150)' }, root0);
    // Gabarit de montage : socle et logement
    S.base = el('g', {}, root);
    el('rect', { x: 290, y: 1060, width: 500, height: 250, rx: 26, fill: '#e9f0f8' }, S.base);
    el('rect', { x: 380, y: 1080, width: 320, height: 180, rx: 8, fill: C.white, stroke: '#74a3d6', 'stroke-width': 4 }, S.base);
    // Détrompeur : vient remplir l'encoche de la pièce bien orientée
    S.pin = el('g', {}, root);
    el('rect', { x: 620, y: 1200, width: 70, height: 58, rx: 6, fill: C.green, stroke: C.ok, 'stroke-width': 3 }, S.pin);
    // Pièce asymétrique (encoche en bas à droite), dessinée autour de son centre
    S.part = el('g', {}, root);
    S.partInner = el('g', {}, S.part);
    const w = 300, h = 160, n = 72, m = 62;
    el('path', { d: `M ${-w / 2} ${-h / 2} H ${w / 2} V ${h / 2 - m} H ${w / 2 - n} V ${h / 2} H ${-w / 2} Z`, fill: C.indigo, stroke: C.indigo700, 'stroke-width': 4, 'stroke-linejoin': 'round' }, S.partInner);
    el('circle', { cx: -w / 2 + 48, cy: -h / 2 + 44, r: 14, fill: C.white }, S.partInner);   // repère : le côté se voit
    S.cx = 540; S.seat = 1260 - h / 2; S.blocked = 1200 - h / 2; S.top = 960;
    // Légendes, au même endroit, l'une après l'autre
    const cap = (str, kind) => {
      const g = el('g', {}, root0);
      const tx = text(g, 0, 732, str, { size: 52, weight: 700, fill: kind === 'ok' ? C.ok : kind === 'note' ? C.ink : C.ko });
      const tw = width(tx), iw = kind === 'note' ? 0 : 66, x0 = 540 - (tw + iw) / 2;
      tx.setAttribute('x', x0 + iw);
      if (kind === 'ko') cross(g, x0 + 24, 714, 26, C.coral, C.ink);
      if (kind === 'ok') check(g, x0 + 24, 714, 26, C.green, C.ink);
      if (kind === 'note') {
        g.insertBefore(el('rect', { x: x0 - 30, y: 660, width: tw + 60, height: 100, rx: 10, fill: C.yellowSoft, stroke: C.yellow, 'stroke-width': 3 }, g), tx);
        S.noteStrike = el('line', { x1: x0 - 10, y1: 714, x2: x0 + tw + 10, y2: 714, stroke: C.coral, 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
      }
      return g;
    };
    S.c1 = cap('Montée à l’envers', 'ko');
    S.c2 = cap('« Faire attention »', 'note');
    S.c3 = cap('Un détrompeur', 'ok');
    S.c4 = cap('Impossible à l’envers', 'ko');
    S.c5 = cap('Bonne du premier coup', 'ok');
  },

  anim(t, S, A) {
    const { show, prog, easeInOut, easeOut, lerp, back, stroke } = A;
    show(S.base, t, 3.0, { dur: 0.4, from: 'up', d: 30 });
    // Trajectoire de la pièce : y du centre et orientation (−1 = à l'envers)
    let y = S.top, sx = -1, o = prog(t, 3.1, 0.3);
    if (t < 5.0) y = lerp(S.top, S.seat, easeInOut(prog(t, 3.25, 0.65)));
    else if (t < 7.5) y = lerp(S.seat, S.top, easeInOut(prog(t, 5.0, 0.5)));
    else if (t < 9.0) {
      // Deuxième essai à l'envers : la pièce bute sur le détrompeur et rebondit
      const p = prog(t, 7.6, 0.5);
      y = lerp(S.top, S.blocked, easeOut(p));
      const b = prog(t, 8.1, 0.35);
      if (b > 0 && b < 1) y -= Math.sin(b * Math.PI) * 26;
    } else if (t < 9.7) {
      y = lerp(S.blocked, S.blocked - 70, easeInOut(prog(t, 9.0, 0.3)));
      sx = lerp(-1, 1, easeInOut(prog(t, 9.15, 0.45)));
    } else { y = lerp(S.blocked - 70, S.seat, easeInOut(prog(t, 9.7, 0.45))); sx = 1; }
    S.part.setAttribute('transform', `translate(${S.cx} ${y.toFixed(2)})`);
    S.partInner.setAttribute('transform', `scale(${(Math.abs(sx) < 0.02 ? 0.02 * Math.sign(sx || 1) : sx).toFixed(3)} 1)`);
    S.part.setAttribute('opacity', o.toFixed(3));
    // Détrompeur
    show(S.pin, t, 6.9, { from: 'pop', cx: 655, cy: 1229, dur: 0.45 });
    // Légendes
    show(S.c1, t, 3.95, { dur: 0.35, from: 'up', d: 20, out: 5.2 });
    show(S.c2, t, 5.5, { dur: 0.35, from: 'up', d: 20, out: 6.75 });
    stroke(S.noteStrike, t, 6.15, 0.35);
    show(S.c3, t, 6.95, { dur: 0.35, from: 'up', d: 20, out: 7.95, outDur: 0.3 });
    show(S.c4, t, 8.3, { dur: 0.35, from: 'up', d: 20, out: 9.75 });
    show(S.c5, t, 10.15, { dur: 0.4, from: 'pop', cx: 540, cy: 714 });
  },
});
