// Fiche LinkedIn · Hugo Duc · lundi 5 octobre 2026
// Post : « Quand je découvre un atelier… Je choisis une pièce. Et je la suis. »
// Premier commentaire du post (Buffer) : article cartographie des flux (VSM) → encart bas gauche.
// Mécanique : le parcours de la pièce (4 attentes, une transformation), puis le temps passé dans l'usine.
// Rendu déterministe : window.FICHE.draw(t), t en secondes, boucle de 12 s.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, back, clamp, invEaseInOut, FADE_END, fading, fadeOut, pop, slide, rise } = G;

  // Chronomètre : renvoie l'aiguille pour l'animer
  function stopwatch(parent, cx, cy, k = 1) {
    const g = el('g', { transform: `translate(${cx} ${cy}) scale(${k})` }, parent);
    el('circle', { cx: 0, cy: 0, r: 22, fill: C.pRed }, g);
    el('rect', { x: -3.5, y: -16, width: 7, height: 4.5, rx: 1.5, fill: C.tRed }, g);
    el('line', { x1: 8.5, y1: -8.5, x2: 11, y2: -11, stroke: C.tRed, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    el('circle', { cx: 0, cy: 2, r: 11.5, fill: 'none', stroke: C.tRed, 'stroke-width': 3 }, g);
    const hand = el('line', { x1: 0, y1: 2, x2: 0, y2: -5.5, stroke: C.tRed, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
    el('circle', { cx: 0, cy: 2, r: 1.8, fill: C.tRed }, g);
    return { hand };
  }

  const S = {};

  function build() {
    G.template({ author: 'hugo' });
    G.title('Suivez une pièce,', 'elle attend.');
    G.chapeau('Du quai de réception jusqu’à l’expédition, chronomètre en main.');

    // ----- Carte 1 : le parcours de la pièce -----
    G.card(60, 330, 960, 386);
    const RAIL_X = 108;
    const Y = [372, 422, 472, 522, 572, 622, 672]; // départ, 4 attentes, transformation, arrivée
    S.Y = Y;
    el('line', { x1: RAIL_X, y1: Y[0], x2: RAIL_X, y2: Y[6], stroke: C.line, 'stroke-width': 5, 'stroke-linecap': 'round' });
    S.railOn = el('line', { x1: RAIL_X, y1: Y[0], x2: RAIL_X, y2: Y[6], stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round' });
    S.nodes = Y.map(y => el('circle', { cx: RAIL_X, cy: y, r: 7, fill: C.card, stroke: C.line, 'stroke-width': 3.5 }));

    S.rows = [];
    {
      const g = el('g');
      const p = G.pill(g, 140, Y[0], 'Quai de réception');
      S.rows.push({ g, cx: 140 + p.w / 2, cy: Y[0] });
    }
    const waits = [
      'Elle attend dans un stock.',
      'Elle attend un chariot.',
      'Elle attend qu’une machine se libère.',
      'Elle attend un contrôle.',
    ];
    S.watches = [];
    waits.forEach((label, i) => {
      const cy = Y[i + 1];
      const g = el('g');
      G.badgeNum(g, 160, cy, i + 1);
      fit(text(g, 194, cy + 9, label, { size: 26, weight: 700, fill: C.ink }), 935, `attente ${i + 1}`);
      S.watches.push(stopwatch(g, 974, cy, 0.92));
      S.rows.push({ g, cx: 560, cy });
    });
    {
      const cy = Y[5];
      const g = el('g');
      G.check(g, 160, cy, 20);
      fit(text(g, 194, cy + 9, 'De temps en temps, quelqu’un la transforme.', { size: 26, weight: 700, fill: C.tGreen }), 995, 'transformation');
      S.rows.push({ g, cx: 560, cy });
    }
    {
      const g = el('g');
      const p = G.pill(g, 140, Y[6], 'Expédition');
      S.rows.push({ g, cx: 140 + p.w / 2, cy: Y[6] });
    }
    // La pièce
    S.token = el('g');
    el('rect', { x: -13, y: -13, width: 26, height: 26, rx: 7, fill: C.blue }, S.token);
    el('circle', { cx: 0, cy: 0, r: 4.5, fill: C.white }, S.token);

    // ----- Carte 2 : le temps passé dans l'usine -----
    G.card(60, 730, 960, 166);
    S.head = el('g');
    fit(text(S.head, 100, 772, 'Le temps passé dans l’usine', { size: 26, weight: 700, fill: C.ink }), 980, 'titre carte 2');

    const BAR = { x: 100, y: 788, w: 880, h: 36 };
    S.BAR = BAR;
    const defs = el('defs');
    const cp = el('clipPath', { id: 'barClip' }, defs);
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: BAR.h / 2 }, cp);
    const cf = el('clipPath', { id: 'fillClip' }, defs);
    S.fillRect = el('rect', { x: BAR.x, y: BAR.y - 10, width: BAR.w, height: BAR.h + 20 }, cf);
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: BAR.h / 2, fill: C.pLav });
    const outer = el('g', { 'clip-path': 'url(#barClip)' });
    S.fill = el('g', { 'clip-path': 'url(#fillClip)' }, outer);
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, fill: C.red }, S.fill);
    // Minutes où la pièce est transformée : quelques fines tranches (un sens, pas de valeurs)
    S.slivers = [0.2, 0.52, 0.81].map(f => {
      const x = BAR.x + f * BAR.w;
      const g = el('g', {}, S.fill);
      el('rect', { x: x - 9, y: BAR.y, width: 18, height: BAR.h, fill: C.card }, g);
      el('rect', { x: x - 6, y: BAR.y, width: 12, height: BAR.h, fill: C.green }, g);
      return { g, x, f };
    });

    S.legend = el('g');
    el('circle', { cx: 109, cy: 858, r: 9, fill: C.red }, S.legend);
    const l1 = text(S.legend, 126, 866, 'Elle attend', { size: 22, weight: 500, fill: C.ink });
    const l2x = measure(l1).x + measure(l1).width + 36;
    el('circle', { cx: l2x + 9, cy: 858, r: 9, fill: C.green }, S.legend);
    const l2 = text(S.legend, l2x + 26, 866, 'Elle est transformée', { size: 22, weight: 500, fill: C.ink });
    const l3 = text(S.legend, 980, 866, 'Un total presque dérisoire', { size: 22, weight: 700, fill: C.tGreen, anchor: 'end' });
    G.noOverlap(l2, l3, 'légende carte 2', 24);

    // ----- Bandeaux : bonne et mauvaise lecture -----
    S.good = el('g');
    el('rect', { x: 60, y: 910, width: 960, height: 64, rx: 20, fill: C.pGreen }, S.good);
    G.check(S.good, 110, 942, 22);
    fit(text(S.good, 150, 951.5, 'Un chronomètre, oui. Sur la pièce.', { size: 26, weight: 700, fill: C.tGreen }), 1000, 'bandeau ✓');

    S.bad = el('g');
    el('rect', { x: 60, y: 986, width: 960, height: 64, rx: 20, fill: C.pRed }, S.bad);
    G.cross(S.bad, 110, 1018, 22);
    fit(text(S.bad, 150, 1027.5, 'Pas sur les personnes.', { size: 26, weight: 700, fill: C.tRed }), 1000, 'bandeau ✗');

    S.chute = G.chute('Avant d’aller plus vite sur les opérations,', 'il faut regarder tout le temps qui les sépare.');
    G.encart(['Cartographier ses flux', 'Notre article sur la VSM', '(lien en commentaire)']);
  }

  // ---------- Chronologie ----------
  // Arrivée de la pièce sur chaque étape (s). Elle attend sur les étapes 1 à 4.
  const ARRIVE = [1.85, 2.4, 2.95, 3.5, 4.05, 4.55, 5.05];
  const MOVE = 0.28;
  const BAR_START = 5.65, BAR_DUR = 0.9;

  function tokenY(t) {
    const Y = S.Y;
    if (t < FADE_END) return Y[6];
    for (let i = 1; i < ARRIVE.length; i++) {
      const a = ARRIVE[i];
      if (t < a - MOVE) return Y[i - 1];
      if (t < a) return Y[i - 1] + (Y[i] - Y[i - 1]) * easeInOut(prog(t, a - MOVE, MOVE));
    }
    return Y[6];
  }

  function draw(t) {
    const Y = S.Y;

    // Étapes du parcours, dans l'ordre du post
    S.rows.forEach((r, i) => pop(r.g, t, ARRIVE[i] - (i === 0 ? 0.15 : 0), r.cx, r.cy));

    // Pièce : pop au départ, glisse d'étape en étape, pulsation à la transformation
    const ty = tokenY(t);
    let ts = 1, to = 1;
    if (fading(t)) to = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, ARRIVE[0], 0.3);
      ts = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p);
      to = clamp(p / 0.4);
      const q = prog(t, ARRIVE[5], 0.3);
      if (q > 0 && q < 1) ts *= 1 + 0.22 * Math.sin(Math.PI * q);
    }
    S.token.setAttribute('transform', `translate(108 ${ty})` + (ts === 1 ? '' : ` scale(${ts})`));
    S.token.setAttribute('opacity', to);

    // Rail parcouru
    S.railOn.setAttribute('y2', ty);
    S.railOn.setAttribute('opacity', t >= FADE_END && t < ARRIVE[0] ? 0 : to);
    S.nodes.forEach((n, i) => n.setAttribute('stroke', !fading(t) && to > 0 && ty >= Y[i] - 0.5 ? C.blue : C.line));

    // Chronomètres : un tour d'aiguille pendant que la pièce attend
    S.watches.forEach((w, i) => {
      const p = t >= FADE_END ? easeInOut(prog(t, ARRIVE[i + 1], 0.5)) : 1;
      w.hand.setAttribute('transform', `rotate(${p >= 1 ? 45 : 45 + 360 * p} 0 2)`);
    });

    // Carte 2 : titre, puis la barre se remplit de gauche à droite
    pop(S.head, t, 5.4, 290, 764);
    let fw = S.BAR.w, fo = 1;
    if (fading(t)) fo = fadeOut(t);
    else if (t >= FADE_END) { fw = S.BAR.w * easeInOut(prog(t, BAR_START, BAR_DUR)); fo = fw > 0 ? 1 : 0; }
    S.fillRect.setAttribute('width', Math.max(0.001, fw));
    S.fill.setAttribute('opacity', fo);
    S.slivers.forEach(s => {
      let k = 1;
      if (t >= FADE_END) {
        const p = prog(t, BAR_START + BAR_DUR * invEaseInOut(s.f), 0.3);
        k = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.5 + 0.5 * back(p);
      }
      const cy = S.BAR.y + S.BAR.h / 2;
      s.g.setAttribute('transform', k === 1 ? '' : `translate(${s.x} ${cy}) scale(1 ${k}) translate(${-s.x} ${-cy})`);
    });
    rise(S.legend, t, 6.65, 0.35, 10);

    // Bandeaux qui glissent depuis la gauche, puis la chute
    slide(S.good, t, 7.0);
    slide(S.bad, t, 7.4);
    rise(S.chute, t, 7.85, 0.45);
  }

  G.start({ duration: 12, build, draw });
})();
