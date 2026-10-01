// Visuel 3 · Management visuel (section « Exemple de tableau d'équipe, ligne par ligne »)
// Brief : ce tableau rempli, deux cases rouges reliées à deux lignes d'action.
// Mécanique : le tableau se remplit jour après jour. Mercredi, le délai passe au rouge : une ligne d'action naît.
// Jeudi, la qualité passe au rouge : une deuxième. Chaque rouge a un nom et une date.
// Exemple illustratif : valeurs et prénoms inventés, seuils repris de l'article.
(() => {
  const G = window.Gabarit, A = window.Article;
  const { C, el, text, fit } = G;

  const LX = 60, GX = 245, CWD = 100, CG = 10, GY = 190, RH = 70, RG = 12;
  const colX = k => GX + k * (CWD + CG);
  const rowY = r => GY + r * (RH + RG);
  const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu'];
  const ROWS = [
    { name: 'Sécurité', sub: 'remontées de la veille', v: ['0', '1', '0', '0'] },
    { name: 'Qualité', sub: 'non conformes, seuil 8', v: ['5', '7', '6', '14'], red: 3 },
    { name: 'Délai', sub: 'retard sur le plan', v: ['0', '−20 min', '−1 h 20', '−10 min'], red: 2 },
    { name: 'Performance', sub: 'arrêts de plus de 10 min', v: ['1', '0', '2', '1'] },
    { name: 'Personnel', sub: 'postes couverts', v: ['12/12', '12/12', '11/12', '12/12'] },
  ];
  const COL_AT = k => 1.9 + k * 1.25;
  const CARD_X = 760, CARD_W = 400;
  const S = { cells: [] };

  function actionCard(parent, y, head, lines, status) {
    const g = el('g', {}, parent);
    G.card(CARD_X, y, CARD_W, 196, g);
    el('rect', { x: CARD_X + 20, y: y + 20, width: 30, height: 28, rx: 6, fill: C.red }, g);
    fit(text(g, CARD_X + 62, y + 42, head, { size: 21, weight: 800, fill: C.ink }), CARD_X + CARD_W - 20, head);
    lines.forEach(([k, v], i) => {
      text(g, CARD_X + 24, y + 80 + i * 28, k, { size: 16, weight: 800, fill: C.blue });
      fit(text(g, CARD_X + 92, y + 80 + i * 28, v, { size: 17, weight: 500, fill: C.ink }), CARD_X + CARD_W - 16, v);
    });
    // Statut aligné à droite
    const p = G.pill(g, 0, y + 34, status.label, { size: 16, h: 30, pad: 12, ...status.style });
    p.g.setAttribute('transform', `translate(${CARD_X + CARD_W - 20 - p.w} 0)`);
    return g;
  }

  function build() {
    const root = A.template('Un tableau d’équipe qui sert à décider',
      'Chaque case rouge renvoie à une ligne d’action : l’écart, ce qui est fait, qui, pour quand.');

    // Tableau
    S.board = el('g', {}, root);
    G.card(40, 140, 655, 480, S.board);
    DAYS.forEach((d, k) => text(S.board, colX(k) + CWD / 2, GY - 14, d, { size: 18, weight: 800, fill: C.blue, anchor: 'middle' }));
    ROWS.forEach((R, r) => {
      fit(text(S.board, LX, rowY(r) + 32, R.name, { size: 20, weight: 800, fill: C.ink }), GX - 8, R.name);
      fit(text(S.board, LX, rowY(r) + 55, R.sub, { size: 13.5, weight: 500, fill: C.ink }), GX - 8, R.sub);
      R.v.forEach((v, k) => {
        const red = R.red === k;
        const g = el('g', {}, root);
        el('rect', { x: colX(k), y: rowY(r), width: CWD, height: RH, rx: 10, fill: red ? C.red : C.pGreen, stroke: red ? 'none' : C.green, 'stroke-width': 2 }, g);
        fit(text(g, colX(k) + CWD / 2, rowY(r) + RH / 2 + 7, v, { size: red ? 21 : 18, weight: 800, fill: red ? C.white : C.tGreen, anchor: 'middle' }), colX(k) + CWD - 4, `${R.name} ${DAYS[k]}`, colX(k) + 4);
        S.cells.push({ g, at: COL_AT(k) + r * 0.08, cx: colX(k) + CWD / 2, cy: rowY(r) + RH / 2 });
      });
    });

    // Repères sur les cases rouges
    const badge = (r, k) => {
      const g = el('g', {}, root);
      const x = colX(k) + CWD - 6, y = rowY(r) + 6;
      el('circle', { cx: x, cy: y, r: 11, fill: C.white, stroke: C.red, 'stroke-width': 3 }, g);
      el('circle', { cx: x, cy: y, r: 4.5, fill: C.red }, g);
      return { g, x, y };
    };
    S.b1 = badge(1, 3);
    S.b2 = badge(2, 2);

    // Connecteurs : par les interstices du tableau jusqu'aux lignes d'action
    const q = { x: colX(3) + CWD, y: rowY(1) + RH / 2 };
    S.link1 = el('path', { d: `M ${q.x} ${q.y} C ${q.x + 40} ${q.y}, ${CARD_X - 40} 248, ${CARD_X} 248`, fill: 'none', stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round' }, root);
    const d = { x: colX(2) + CWD, y: rowY(2) + RH / 2 }, gx = d.x + CG / 2, gy = rowY(2) + RH + RG / 2;
    S.link2 = el('path', {
      d: `M ${d.x} ${d.y} L ${gx - 1} ${d.y} Q ${gx} ${d.y} ${gx} ${d.y + 4} L ${gx} ${gy - 4} Q ${gx} ${gy} ${gx + 4} ${gy} L ${colX(3) + CWD + 10} ${gy} C ${CARD_X - 30} ${gy}, ${CARD_X - 40} 470, ${CARD_X} 470`,
      fill: 'none', stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, root);

    S.card1 = actionCard(root, 150, 'Qualité · jeudi', [
      ['Écart', '14 non conformes, seuil 8'],
      ['Action', 'isoler le lot, 5 Pourquoi'],
      ['Qui', 'Sophie, qualité'],
      ['Pour', 'vendredi'],
    ], { label: 'En cours', style: { bg: C.pYellow, fg: C.tYellow } });
    S.card2 = actionCard(root, 372, 'Délai · mercredi', [
      ['Écart', '1 h 20 de retard sur le plan'],
      ['Action', 'relancer la maintenance'],
      ['Qui', 'Karim, chef d’équipe'],
      ['Pour', 'jeudi'],
    ], { label: 'Fait', style: { bg: C.pGreen, fg: C.tGreen, icon: 'check' } });

    S.foot = el('g', {}, root);
    fit(text(S.foot, 60, 682, 'Aucun indicateur sans règle de déclenchement, aucun rouge sans nom ni date.', { size: 21, weight: 700, fill: C.blue }), 1040, 'pied');
    const note = text(S.foot, 60, 714, 'Exemple illustratif : seuils à fixer pour votre atelier.', { size: 15, weight: 500, fill: C.ink });
    note.setAttribute('opacity', 0.65);
  }

  function draw(t) {
    const tt = A.T(t);
    A.show(S.board, tt, 1.6, { dy: 0 });
    S.cells.forEach(c => A.show(c.g, tt, c.at, { scale: true, cx: c.cx, cy: c.cy, dur: 0.3 }));
    const red2 = COL_AT(2) + 2 * 0.08, red1 = COL_AT(3) + 0.08;
    A.show(S.b2.g, tt, red2 + 0.3, { scale: true, cx: S.b2.x, cy: S.b2.y, dur: 0.3 });
    A.draw(S.link2, tt, red2 + 0.4, 0.6);
    A.show(S.card2, tt, red2 + 0.9, { dx: 24, dy: 0 });
    A.show(S.b1.g, tt, red1 + 0.3, { scale: true, cx: S.b1.x, cy: S.b1.y, dur: 0.3 });
    A.draw(S.link1, tt, red1 + 0.4, 0.5);
    A.show(S.card1, tt, red1 + 0.8, { dx: 24, dy: 0 });
    A.show(S.foot, tt, red1 + 1.6);
  }

  A.start({ duration: 12, build, draw });
})();
