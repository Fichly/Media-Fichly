// Blog · TRS · section « Ce qu'un TRS autorise à décider »
// Mécanique : trois lignes affichent le même TRS de 77 %. Le chiffre seul ne les départage pas. On ouvre chaque
// TRS en trois taux : la barre des points perdus la plus longue n'est pas au même endroit, et elle désigne
// une décision différente (maintenance, poste, réglage). Une seule à la fois.
// Ligne A = cas de référence de l'article. Lignes B et C : profils illustratifs construits pour donner aussi 77 %.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = { cols: [] };
  const PX = 15;   // 1 point perdu = 15 px
  const NAMES = ['Disponibilité', 'Performance', 'Qualité'];
  const LINES = [
    { name: 'Ligne A', sub: 'cas de référence', v: ['85,7', '94,4', '95,6'], loss: [14.3, 5.6, 4.4],
      title: 'Maintenance et approvisionnement', what: 'Historique des arrêts, trié par temps cumulé.' },
    { name: 'Ligne B', sub: '', v: ['95,0', '85,0', '95,4'], loss: [5.0, 15.0, 4.6],
      title: 'Décision de poste, micro-arrêts', what: 'Observer les micro-arrêts au plus près de la machine.' },
    { name: 'Ligne C', sub: '', v: ['94,0', '96,0', '85,3'], loss: [6.0, 4.0, 14.7],
      title: 'Réglage et standard de démarrage', what: 'Séparer rebuts de démarrage et de production.' },
  ];
  const fr = n => n.toFixed(1).replace('.', ',');

  function build() {
    G.templateBlog();
    G.blogTitle('Même TRS,', 'trois chantiers.');
    G.blogChapeau('Trois lignes à 77 % : la composante la plus basse désigne le chantier à ouvrir.');

    LINES.forEach((L, i) => {
      const x = 40 + i * 380, cx = x + 180;
      G.card(x, 176, 360, 584);
      const col = { ...L, x, cx };
      col.head = el('g');
      const p = G.pill(col.head, x + 24, 214, L.name, { size: 20, h: 36, bg: C.blue, fg: C.white });
      if (L.sub) text(col.head, x + 24 + p.w + 12, 221, L.sub, { size: 17, weight: 500, fill: C.ink });
      col.big = el('g');
      text(col.big, cx, 262, 'TRS', { size: 20, weight: 700, fill: C.ink, anchor: 'middle' });
      text(col.big, cx, 324, `77${NB}%`, { size: 62, weight: 800, fill: C.blue, anchor: 'middle' });

      const max = L.loss.indexOf(Math.max(...L.loss));
      col.max = max;
      col.rows = NAMES.map((nm, k) => {
        const y = 382 + k * 66;
        const g = el('g');
        const isMax = k === max;
        text(g, x + 24, y, nm, { size: 19, weight: 700, fill: isMax ? C.tRed : C.ink });
        text(g, x + 336, y, `${L.v[k]}${NB}%`, { size: 19, weight: 700, fill: isMax ? C.tRed : C.ink, anchor: 'end' });
        el('rect', { x: x + 24, y: y + 12, width: 16 * PX, height: 18, rx: 6, fill: C.pLav }, g);
        const bar = el('rect', { x: x + 24, y: y + 12, width: L.loss[k] * PX, height: 18, rx: 6, fill: '#b9b9d0' });
        const lab = text(G.svg, x + 24 + L.loss[k] * PX + 8, y + 27, `–${NB}${fr(L.loss[k])}${NB}pts`, { size: 17, weight: 700, fill: isMax ? C.tRed : C.ink });
        fit(lab, x + 350, `points ${i}-${k}`);
        return { g, bar, lab, y, w: L.loss[k] * PX, isMax };
      });

      col.arrow = G.arrow(G.svg, `M ${cx} 560 L ${cx} 596`, { stroke: C.red, width: 4, head: 12 });
      col.box = el('g');
      el('rect', { x: x + 16, y: 606, width: 328, height: 138, rx: 18, fill: C.pRed }, col.box);
      const tt = G.para(col.box, cx, 640, L.title, 290, { size: 20, weight: 700, fill: C.tRed, anchor: 'middle', lh: 1.2 });
      fit(tt.t, x + 340, `titre ${i}`, x + 20);
      G.para(col.box, cx, 640 + tt.n * 24 + 8, L.what, 290, { size: 18, weight: 500, fill: C.ink, anchor: 'middle', lh: 1.3 });
      // Avant l'ouverture : le chiffre seul ne dit pas où agir
      col.q = text(G.svg, cx, 470, 'Où agir ?', { size: 26, weight: 700, fill: '#b9b9d0', anchor: 'middle' });
      S.cols.push(col);
    });

    // Signes « = » entre les trois TRS
    S.eq = el('g');
    [410, 790].forEach(x => {
      el('line', { x1: x - 7, y1: 296, x2: x + 7, y2: 296, stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.eq);
      el('line', { x1: x - 7, y1: 306, x2: x + 7, y2: 306, stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.eq);
    });

    S.chute = G.blogChute('Un TRS ouvre trois décisions, et une seule à la fois.', { y: 810 });
  }

  // ---------- Chronologie ----------
  const OPEN = [3.4, 5.9, 8.4];
  const CHUTE_T = 11.2;

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.cols.forEach((c, i) => {
      pop(c.head, t, 1.8 + 0.15 * i, c.x + 80, 214);
      pop(c.big, t, 2.2 + 0.15 * i, c.cx, 300);
      const T = OPEN[i];
      c.rows.forEach((r, k) => {
        rise(r.g, t, T + 0.12 * k, 0.35, 12);
        const p = live ? easeOut(prog(t, T + 0.3 + 0.12 * k, 0.5)) : 1;
        r.bar.setAttribute('width', Math.max(0.001, r.w * p));
        r.bar.setAttribute('opacity', o * (live ? clamp(prog(t, T + 0.12 * k, 0.3)) : 1));
        const red = !live || t >= T + 1.1;
        r.bar.setAttribute('fill', r.isMax && red ? C.red : '#b9b9d0');
        r.lab.setAttribute('opacity', o * (live ? clamp(prog(t, T + 0.8 + 0.12 * k, 0.3)) : 1));
        if (r.isMax && live && t >= T + 1.1 && t < T + 1.8) pulse(r.g, t, T + 1.15, c.cx, r.y + 10, 0.06, 0.45);
      });
      const ap = live ? prog(t, T + 1.4, 0.35) : 1;
      c.arrow.draw(ap);
      c.arrow.g.setAttribute('opacity', o);
      pop(c.box, t, T + 1.7, c.cx, 675);
      c.q.setAttribute('opacity', live ? G.window01(t, 2.6 + 0.15 * i, T + 0.1, 0.3) : 0);
    });
    pop(S.eq, t, 2.8, 600, 300);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
