// Visuel 1 · Management visuel (section « Que doit rendre visible un management visuel ? Les 3 niveaux »)
// Brief : les 3 niveaux empilés.
// Mécanique : l'état du poste, puis la performance s'empilent ; « la plupart s'arrêtent ici » ;
// le niveau 3, écarts et actions, vient coiffer la pile : c'est lui qui fait la différence.
(() => {
  const G = window.Gabarit, A = window.Article;
  const { C, el, text, fit } = G;

  const X = 60, WB = 760, HB = 170;
  const LEVELS = [
    { y: 560, n: 1, title: 'L’état du poste', q: 'Chaque chose est-elle à sa place, en bonne quantité ?',
      tags: ['Marquage au sol', 'Tableau d’ombres', 'Min / max'], bg: C.pGreen, dot: C.green, fg: C.tGreen, tagBg: C.white },
    { y: 370, n: 2, title: 'La performance', q: 'Sommes-nous à l’heure, en qualité, en sécurité ?',
      tags: ['Heure par heure', 'SQCDP', 'TRS affiché'], bg: C.pLav, dot: C.lightBlue, fg: C.blue, tagBg: C.white },
    { y: 180, n: 3, title: 'Les écarts et les actions', q: 'Qui traite quoi, pour quand, qu’est-ce qui bloque ?',
      tags: ['Liste d’actions', 'Escalade', 'Andon'], bg: C.blue, dot: C.white, fg: C.white, tagBg: C.white, strong: true },
  ];
  const AT = [1.8, 2.6, 4.9];
  const S = {};

  function build() {
    const root = A.template('Ce qu’un management visuel doit montrer',
      'Trois niveaux, dans cet ordre. Le troisième relie chaque signal à une personne et à une date.');

    S.levels = LEVELS.map(L => {
      const g = el('g', {}, root);
      el('rect', { x: X, y: L.y, width: WB, height: HB, rx: 22, fill: L.bg, stroke: L.strong ? 'none' : C.line, 'stroke-width': 2 }, g);
      el('circle', { cx: X + 58, cy: L.y + 58, r: 30, fill: L.dot }, g);
      text(g, X + 58, L.y + 70, String(L.n), { size: 32, weight: 800, fill: L.strong ? C.blue : C.white, anchor: 'middle' });
      fit(text(g, X + 108, L.y + 58, L.title, { size: 30, weight: 800, fill: L.fg }), X + WB - 20, L.title);
      fit(text(g, X + 108, L.y + 94, L.q, { size: 20, weight: 500, fill: L.strong ? C.white : C.ink }), X + WB - 20, L.q);
      let px = X + 108;
      L.tags.forEach(tag => {
        const p = G.pill(g, px, L.y + 136, tag, { size: 17, h: 34, pad: 14, bg: L.tagBg, fg: L.strong ? C.blue : L.fg });
        px += p.w + 10;
      });
      fit(g.lastChild, X + WB - 20, `étiquettes niveau ${L.n}`);
      return { g, cx: X + WB / 2, cy: L.y + HB / 2 };
    });

    // « La plupart s'arrêtent ici » : accolade sur les niveaux 1 et 2
    S.stop = el('g', {}, root);
    const bx = X + WB + 26, y0 = LEVELS[1].y + 6, y1 = LEVELS[0].y + HB - 6, ym = (y0 + y1) / 2;
    el('path', { d: `M ${bx} ${y0} Q ${bx + 16} ${y0} ${bx + 16} ${y0 + 20} L ${bx + 16} ${ym - 16} Q ${bx + 16} ${ym} ${bx + 30} ${ym} Q ${bx + 16} ${ym} ${bx + 16} ${ym + 16} L ${bx + 16} ${y1 - 20} Q ${bx + 16} ${y1} ${bx} ${y1}`,
      fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.55 }, S.stop);
    const tx = bx + 46;
    ['La plupart', 'des dispositifs', 's’arrêtent ici.'].forEach((l, i) =>
      fit(text(S.stop, tx, ym - 42 + i * 30, l, { size: 23, weight: 800, fill: C.ink }), 1160, l));
    ['L’écart se voit,', 'personne ne le traite.'].forEach((l, i) =>
      fit(text(S.stop, tx, ym + 52 + i * 25, l, { size: 18, weight: 500, fill: C.ink }), 1160, l));

    // Niveau 3 : ce qui fait la différence
    S.diff = el('g', {}, root);
    const ay = LEVELS[2].y + HB / 2;
    el('path', { d: `M ${tx - 10} ${ay} L ${X + WB + 14} ${ay}`, fill: 'none', stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.diff);
    el('path', { d: `M ${X + WB + 28} ${ay - 11} L ${X + WB + 14} ${ay} L ${X + WB + 28} ${ay + 11}`, fill: 'none', stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.diff);
    ['C’est lui qui', 'fait la différence.'].forEach((l, i) =>
      fit(text(S.diff, tx, ay - 40 + i * 30, l, { size: 23, weight: 800, fill: C.blue }), 1160, l));
    G.pill(S.diff, tx, ay + 42, 'Un nom, une date', { size: 18, h: 34, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
  }

  function draw(t) {
    const tt = A.T(t);
    S.levels.forEach((L, i) => A.show(L.g, tt, AT[i], { dy: -60, dur: 0.5 }));
    A.show(S.stop, tt, 3.5, { dx: -16, dy: 0 });
    A.show(S.diff, tt, AT[2] + 0.7, { dx: -16, dy: 0 });
  }

  A.start({ duration: 10, build, draw });
})();
