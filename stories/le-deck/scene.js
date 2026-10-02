// Story · Le deck 40 outils du Lean (bulle d'ouverture de la rangée)
// Faits repris de la fiche produit : 40 fiches, 6 familles, « à emporter partout » (titre SEO),
// « apprendre, consolider, transmettre, sur le terrain » (description). Les six outils montrés
// sont ceux des six autres bulles, un par famille.
Story.scene({
  // Vraie fiche : vignette Canva du deck (FR - Outils du Lean - VF), numéro du Guide du deck
  fiche: { recto: '../../assets/produit/canva/page-004.png', legende: 'Le Guide du deck' },
  famille: 0,
  bandeau: 'Le deck Fichly',
  outil: '40 outils du Lean',
  titre: ['40 outils du Lean'],
  accroche: { lignes: ['Des fiches', 'à emporter partout.'], accent: 1 },
  retenir: 'Pour apprendre, consolider et transmettre, sur le terrain.',
  pied: '40 outils du Lean à portée de main',
  poster: 10.5,

  build(S, A, root) {
    const { el, text, fit, C, FAM, ZONE } = A;
    const tools = ['5 Pourquoi', 'Obeya', 'Pareto', 'VSM', 'SMED', 'Poka-Yoke'];
    const CW = 248, CH = 300, GX = 38, GY = 36;
    const x0 = ZONE.x + (ZONE.w - (3 * CW + 2 * GX)) / 2, y0 = ZONE.y;
    S.cards = [];
    // La première carte distribuée est en haut de la pile : on dessine à l'envers
    for (let i = 5; i >= 0; i--) {
      const f = FAM[i + 1];
      const g = el('g', {}, root);
      const x = x0 + (i % 3) * (CW + GX), y = y0 + Math.floor(i / 3) * (CH + GY);
      el('rect', { x, y, width: CW, height: CH, rx: 20, fill: C.white, stroke: C.line, 'stroke-width': 3 }, g);
      el('path', { d: `M ${x} ${y + 20} a 20 20 0 0 1 20 -20 h ${CW - 40} a 20 20 0 0 1 20 20 v 40 h ${-CW} z`, fill: f.c }, g);
      const name = text(g, x + CW / 2, y + 128, tools[i], { size: tools[i].length > 7 ? 38 : 44, weight: 700, fill: C.ink, anchor: 'middle' });
      fit(name, x + CW - 14, `carte ${tools[i]}`, x + 14);
      [0.78, 0.62, 0.7].forEach((k, j) => el('rect', { x: x + 26, y: y + 164 + j * 22, width: (CW - 52) * k, height: 9, rx: 4.5, fill: C.line }, g));
      el('rect', { x: x + 26, y: y + 236, width: CW - 52, height: 40, rx: 10, fill: f.soft }, g);
      S.cards[i] = { g, cx: x + CW / 2, cy: y + CH / 2 };
    }
    // Compteur
    S.count = el('g', {}, root);
    const cy = y0 + 2 * CH + GY + 120;
    S.num = text(S.count, 540 - 24, cy, '0', { size: 132, weight: 700, fill: C.indigo, anchor: 'end' });
    text(S.count, 540, cy, 'fiches', { size: 64, weight: 600, fill: C.ink });
    S.fams = el('g', {}, root);
    const fy = cy + 0;
    S.famDots = [];
    S.famLabel = text(S.fams, 540, fy, '', { size: 40, weight: 600, fill: C.ink700, anchor: 'middle' });
  },

  anim(t, S, A) {
    const { prog, easeInOut, show, count } = A;
    // Distribution des six fiches depuis une pile au centre
    S.cards.forEach((c, i) => {
      const p = easeInOut(prog(t, 3.05 + i * 0.5, 0.6));
      const sx = 540, sy = 1000, rot0 = (i - 2.5) * 5;
      const dx = (sx - c.cx) * (1 - p), dy = (sy - c.cy) * (1 - p), r = rot0 * (1 - p);
      const s = 0.92 + 0.08 * p;
      c.g.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)}) rotate(${r.toFixed(2)} ${c.cx} ${c.cy}) translate(${c.cx} ${c.cy}) scale(${s.toFixed(3)}) translate(${-c.cx} ${-c.cy})`);
    });
    // 0 → 40 fiches, puis « 6 familles, une couleur chacune » remplace la ligne
    show(S.count, t, 6.6, { dur: 0.45, from: 'up', out: 9.4 });
    count(S.num, t, 6.7, 1.6, 0, 40);
    S.famLabel.textContent = '6 familles, une couleur chacune';
    show(S.fams, t, 9.75, { dur: 0.45, from: 'up' });
  },
});
