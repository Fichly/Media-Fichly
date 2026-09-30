// Blog · Gemba · section « Ce qu'une tournée doit produire »
// Mécanique, carte 1 : un constat se construit élément par élément ; pour chacun, ce qu'on écrit souvent
// (interprétation, « en production », « la maintenance », sans heure ni échéance) est barré et remplacé
// par ce qu'il faut écrire (le fait, le lieu exact, la date et l'heure, un porteur nommé, une échéance).
// Carte 2 : trois constats relus à la tournée suivante se referment un par un ; la liste de quinze lignes,
// elle, n'est jamais relue et s'éteint.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';
  const Q = s => `«${NB}${s}${NB}»`;

  const S = {};
  const COL = { lab: 64, bad: 330, good: 736 };
  const ROWS = [
    ['Le fait observé', Q('Le poste est mal tenu'), Q('Le bac de rebuts déborde')],
    ['Le lieu exact', Q('En production'), 'Ligne 2, poste 4'],
    ['La date et l’heure', 'pas d’heure', `Mardi, 10${NB}h${NB}40`],
    ['Un porteur nommé', Q('La maintenance'), 'Julie M., cheffe d’équipe'],
    ['Une échéance', 'pas de date', 'Vendredi'],
  ];
  const RY = k => 262 + 50 * k;
  const ROW_T = k => 2.9 + 1.15 * k;          // la mauvaise version apparaît
  const LIST_T = ROW_T(5) + 0.4;
  const REREAD_T = LIST_T + 1.4;
  const CHUTE_T = REREAD_T + 2.3;

  function miniCard(parent, x, y) {
    const g = el('g', {}, parent);
    el('rect', { x, y, width: 132, height: 76, rx: 10, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, g);
    [[16, 88], [32, 64], [48, 76]].forEach(([dy, w], i) => el('rect', { x: x + 14, y: y + dy, width: w, height: 7, rx: 3.5, fill: C.ink, opacity: i ? 0.2 : 0.35 }, g));
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Ce que la tournée', 'doit produire.');
    G.blogChapeau('Une liste de constats, portant chacun cinq éléments. Trois à cinq par tournée.');

    // ----- Carte 1 : un constat, cinq éléments -----
    G.card(40, 176, 1120, 340);
    S.heads = el('g');
    text(S.heads, COL.lab, 216, 'Cinq éléments', { size: 19, weight: 700, fill: C.ink });
    text(S.heads, COL.bad, 216, 'Ce qu’on écrit souvent', { size: 19, weight: 700, fill: C.tRed });
    text(S.heads, COL.good, 216, 'Ce qu’il faut écrire', { size: 19, weight: 700, fill: C.tGreen });
    for (let k = 1; k < 5; k++) el('line', { x1: 64, y1: RY(k) - 25, x2: 1136, y2: RY(k) - 25, stroke: C.line, 'stroke-width': 1.5 });
    S.rows = ROWS.map(([lab, bad, good], k) => {
      const y = RY(k);
      const L = { y };
      L.lab = el('g');
      G.badgeNum(L.lab, COL.lab + 14, y - 6, k + 1, 14);
      fit(text(L.lab, COL.lab + 38, y, lab, { size: 19, weight: 700, fill: C.ink }), COL.bad - 16, `libellé ${k}`);
      L.bad = el('g');
      G.cross(L.bad, COL.bad + 12, y - 6, 12);
      const bt = text(L.bad, COL.bad + 34, y, bad, { size: 19, weight: 500, fill: C.tRed });
      fit(bt, COL.good - 40, `à éviter ${k}`);
      const bw = measure(bt).width;
      L.strike = el('line', { x1: COL.bad + 32, y1: y - 6, x2: COL.bad + 32, y2: y - 6, stroke: C.tRed, 'stroke-width': 2.5, 'stroke-linecap': 'round' });
      L.strikeX = COL.bad + 36 + bw;
      L.arrow = G.arrow(G.svg, `M ${COL.good - 60} ${y - 6} L ${COL.good - 18} ${y - 6}`, { stroke: C.line, width: 3, head: 8 });
      L.good = el('g');
      G.check(L.good, COL.good + 12, y - 6, 12);
      fit(text(L.good, COL.good + 34, y, good, { size: 19, weight: 700, fill: C.tGreen }), 1136, `à écrire ${k}`);
      return L;
    });

    // ----- Carte 2 : relue, ou abandonnée -----
    G.card(40, 532, 1120, 228);
    el('line', { x1: 626, y1: 556, x2: 626, y2: 736, stroke: C.line, 'stroke-width': 2 });
    S.left = el('g');
    text(S.left, 64, 570, 'Trois à cinq constats,', { size: 19, weight: 700, fill: C.tGreen });
    text(S.left, 64, 594, 'relus au passage suivant', { size: 19, weight: 700, fill: C.tGreen });
    S.cards = [0, 1, 2].map(i => {
      const x = 64 + i * 152, y = 634;
      const g = miniCard(G.svg, x, y);
      const ck = el('g');
      G.check(ck, x + 116, y + 14, 16);
      return { g, ck, x, y };
    });
    S.right = el('g');
    text(S.right, 650, 570, 'Une liste de quinze lignes', { size: 19, weight: 700, fill: C.tRed });
    S.sheet = el('g');
    el('rect', { x: 650, y: 588, width: 170, height: 156, rx: 8, fill: C.white, stroke: C.line, 'stroke-width': 2 }, S.sheet);
    S.lines = [];
    for (let i = 0; i < 15; i++) S.lines.push(el('rect', { x: 664, y: 598 + i * 9.4, width: [120, 96, 132, 104, 88][i % 5], height: 4.5, rx: 2, fill: C.ink, opacity: 0.35 }, S.sheet));
    S.abandon = el('g');
    G.pill(S.abandon, 842, 626, 'jamais relue', { size: 18, h: 32, bg: C.red, fg: C.white, icon: null });
    G.para(S.abandon, 842, 674, 'son abandon apprend que signaler ne sert à rien', 280, { size: 18, weight: 500, fill: C.tRed, lh: 1.3 });

    S.chute = G.blogChute('Une tournée sans liste écrite n’a rien produit.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    pop(S.heads, t, 1.7, 600, 210);

    S.rows.forEach((L, k) => {
      const t0 = ROW_T(k);
      rise(L.lab, t, 1.9 + 0.08 * k, 0.35);
      rise(L.bad, t, t0, 0.3);
      // Barré, puis remplacé
      const sq = live ? easeOut(prog(t, t0 + 0.4, 0.3)) : 1;
      L.strike.setAttribute('x2', COL.bad + 32 + (L.strikeX - COL.bad - 32) * sq);
      L.strike.setAttribute('opacity', live ? (sq > 0 ? 1 : 0) : o0);
      L.bad.setAttribute('opacity', (live ? clamp(prog(t, t0, 0.3)) * (1 - 0.45 * sq) : 0.55 * o0));
      L.arrow.draw(live ? easeInOut(prog(t, t0 + 0.6, 0.25)) : 1);
      L.arrow.g.setAttribute('opacity', o0);
      pop(L.good, t, t0 + 0.8, COL.good + 12, L.y - 6);
    });

    // Carte 2
    rise(S.left, t, LIST_T, 0.35);
    rise(S.right, t, LIST_T + 0.2, 0.35);
    S.cards.forEach((c, i) => {
      pop(c.g, t, LIST_T + 0.2 + 0.15 * i, c.x + 66, c.y + 38);
      pop(c.ck, t, REREAD_T + 0.35 * i, c.x + 116, c.y + 14);
    });
    pop(S.sheet, t, LIST_T + 0.35, 735, 666);
    S.lines.forEach((l, i) => l.setAttribute('opacity', live ? 0.35 * clamp(prog(t, LIST_T + 0.4 + 0.04 * i, 0.1)) : 0.35));
    // La liste longue s'éteint pendant que les autres se referment
    const fade = live ? clamp(prog(t, REREAD_T + 0.3, 0.8)) : 1;
    S.sheet.setAttribute('opacity', (live ? Math.min(1, clamp(prog(t, LIST_T + 0.35, 0.2))) : o0) * (1 - 0.55 * fade));
    rise(S.abandon, t, REREAD_T + 1.0, 0.4);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
