// Fiche LinkedIn · Hugo Duc · mercredi 7 octobre 2026
// Post : « Certains gaspillages ont un budget. D'autres ont un poste de travail. Parfois même un responsable. »
// Premier commentaire du post (Buffer) : toutes les ressources Lean du site → encart bas gauche.
// Mécanique : quatre dispositifs qu'on a organisés (une bonne raison d'exister), puis ce qu'ils sont
// devenus, qui sort de derrière chacun ; enfin la question à poser dans l'atelier.
// Rendu déterministe : window.FICHE.draw(t), t en secondes, boucle de 12 s.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise } = G;

  const ICON_BG = '#5f5fab'; // pastille des pictos sur le bleu
  const SOFT = '#cfd0ec';    // texte secondaire sur le bleu

  // ---------- Pictos (blancs, centrés sur 0 0) ----------
  const icons = {
    stock(g) {
      [[-11, 7], [11, 7], [0, -13]].forEach(([x, y]) => {
        el('rect', { x: x - 10, y: y - 10, width: 20, height: 20, rx: 4, fill: C.white }, g);
        el('line', { x1: x - 5, y1: y - 3, x2: x + 5, y2: y - 3, stroke: ICON_BG, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
      });
    },
    retouche(g) {
      const w = el('g', { transform: 'rotate(45)' }, g);
      el('rect', { x: -4.5, y: -6, width: 9, height: 30, rx: 4.5, fill: C.white }, w);
      el('circle', { cx: 0, cy: -12, r: 12, fill: C.white }, w);
      el('rect', { x: -4.5, y: -27, width: 9, height: 14, rx: 2, fill: ICON_BG }, w);
    },
    reunion(g) {
      el('rect', { x: -19, y: -14, width: 38, height: 32, rx: 6, fill: C.white }, g);
      el('rect', { x: -19, y: -14, width: 38, height: 9, rx: 4, fill: C.white }, g);
      [-10, 10].forEach(x => el('rect', { x: x - 2.5, y: -21, width: 5, height: 11, rx: 2.5, fill: C.white, stroke: ICON_BG, 'stroke-width': 2 }, g));
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
        const red = r === 1 && c === 2;
        el('rect', { x: -13 + c * 10, y: -1 + r * 9, width: 6, height: 6, rx: 1.5, fill: red ? C.red : ICON_BG }, g);
      }
    },
    chariot(g) {
      el('path', { d: 'M -24 -18 L -18 -11', stroke: C.white, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      el('path', { d: 'M -18 -11 L 19 -11 L 14 7 L -13 7 Z', fill: C.white, 'stroke-linejoin': 'round', stroke: C.white, 'stroke-width': 3 }, g);
      [-8, 0, 8].forEach(x => el('line', { x1: x, y1: -6, x2: x, y2: 2, stroke: ICON_BG, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g));
      [-8, 9].forEach(x => el('circle', { cx: x, cy: 15, r: 4.5, fill: C.white }, g));
    },
  };

  // Sablier : la cause attend toujours (renvoie le groupe pour le retourner)
  function hourglass(parent, cx, cy) {
    const g = el('g', {}, parent);
    const inner = el('g', {}, g);
    el('line', { x1: -10, y1: -14, x2: 10, y2: -14, stroke: C.tRed, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, inner);
    el('line', { x1: -10, y1: 14, x2: 10, y2: 14, stroke: C.tRed, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, inner);
    el('path', { d: 'M -7 -14 C -7 -4, 7 -4, 7 0 C 7 4, -7 4, -7 14 M 7 -14 C 7 -4, -7 -4, -7 0 C -7 4, 7 4, 7 14', fill: 'none', stroke: C.tRed, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, inner);
    el('path', { d: 'M -4.5 -11.5 L 4.5 -11.5 L 0 -5 Z', fill: C.red }, inner); // sable en haut ; retourné à l'état final
    g.setAttribute('transform', `translate(${cx} ${cy})`);
    return { g, inner };
  }

  // Loupe
  function magnifier(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('line', { x1: cx + 18, y1: cy + 18, x2: cx + 36, y2: cy + 36, stroke: C.blue, 'stroke-width': 11, 'stroke-linecap': 'round' }, g);
    el('circle', { cx, cy, r: 27, fill: C.white, stroke: C.blue, 'stroke-width': 7 }, g);
    el('path', { d: `M ${cx - 13} ${cy - 4} A 14 14 0 0 1 ${cx - 2} ${cy - 14}`, fill: 'none', stroke: C.pLav, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  }

  // Texte en plusieurs couleurs : parts = [[texte, couleur], …]
  function richText(parent, x, y, parts, { size, weight = 700 }) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': weight }, parent);
    parts.forEach(([s, fill]) => { const sp = el('tspan', { fill }, t); sp.textContent = s; });
    return t;
  }

  const ITEMS = [
    { icon: 'stock', name: 'Le stock tampon', why: 'créé pour absorber un problème', now: ['Le problème est resté.', 'Le stock aussi.'] },
    { icon: 'retouche', name: 'Le poste de retouche', why: 'installé pour gérer les défauts', now: ['Il est devenu', 'une étape du process.'] },
    { icon: 'reunion', name: 'La réunion de crise', why: 'créée pour une urgence ponctuelle', now: ['Elle revient', 'toutes les semaines.'] },
    { icon: 'chariot', name: 'Le chariot de dépannage', why: 'rempli de pièces « au cas où »', now: ['L’appro ne suit', 'toujours pas.'] },
  ];
  const TILE = { w: 470, top: 128, bot: 88 };
  const POS = [[60, 330], [550, 330], [60, 562], [550, 562]];

  const S = { tiles: [] };

  function build() {
    G.template({ author: 'hugo' });
    G.title('Certains gaspillages', 'ont un budget.');
    G.chapeau('Un poste de travail. Parfois même un responsable.');

    // ----- Quatre tuiles : le dispositif (bleu), ce qu'il est devenu (rouge, sort de derrière) -----
    ITEMS.forEach((it, i) => {
      const [x, y] = POS[i];
      const g = el('g');
      // Partie basse, dessinée d'abord : elle glisse depuis l'arrière de la partie bleue
      const low = el('g', {}, g);
      el('rect', { x, y: y + TILE.top - 24, width: TILE.w, height: TILE.bot + 24, rx: 22, fill: C.pRed }, low);
      it.now.forEach((line, k) => fit(text(low, x + 28, y + TILE.top + 34 + k * 30, line, { size: 22, weight: 700, fill: C.tRed }), x + TILE.w - 64, `tuile ${i + 1} ligne ${k + 1}`));
      const hg = hourglass(low, x + TILE.w - 36, y + TILE.top + 44);
      // Partie haute
      el('rect', { x, y, width: TILE.w, height: TILE.top, rx: 22, fill: C.blue }, g);
      el('circle', { cx: x + 58, cy: y + 64, r: 34, fill: ICON_BG }, g);
      icons[it.icon](el('g', { transform: `translate(${x + 58} ${y + 64})` }, g));
      fit(text(g, x + 110, y + 58, it.name, { size: 25, weight: 700, fill: C.white }), x + TILE.w - 18, `tuile ${i + 1} nom`);
      fit(text(g, x + 110, y + 90, it.why, { size: 19, weight: 500, fill: SOFT }), x + TILE.w - 18, `tuile ${i + 1} raison`);
      S.tiles.push({ g, low, hg, cx: x + TILE.w / 2, cy: y + TILE.top / 2 });
    });

    // ----- La question à poser dans l'atelier -----
    S.q = el('g');
    el('rect', { x: 60, y: 802, width: 960, height: 232, rx: 24, fill: C.pLav }, S.q);
    S.loupe = magnifier(S.q, 146, 906);
    fit(text(S.q, 226, 852, 'La question à poser dans l’atelier', { size: 22, weight: 700, fill: C.blue }), 990, 'question étiquette');
    const q1 = text(S.q, 226, 906, '« Qu’est-ce qu’on a mis en place', { size: 33, weight: 700, fill: C.ink });
    const q2 = text(S.q, 226, 950, 'pour compenser un problème', { size: 33, weight: 700, fill: C.ink });
    const q3 = richText(S.q, 226, 994, [['qu’on n’a ', C.ink], ['jamais résolu', C.blue], [' ? »', C.ink]], { size: 33 });
    [q1, q2, q3].forEach((n, k) => fit(n, 990, `question ligne ${k + 1}`));

    S.chute = G.chute('Derrière chaque contournement qui dure,', 'il y a une cause qui attend toujours.');
    G.encart(['Aller plus loin', 'Toutes nos ressources Lean', '(lien en commentaire)']);
  }

  // ---------- Chronologie ----------
  const T_TILE = [1.8, 2.15, 2.5, 2.85];   // apparition des tuiles (partie bleue)
  const T_REVEAL = [3.5, 3.95, 4.4, 4.85]; // la partie rouge sort de derrière
  const T_Q = 5.7, T_CHUTE = 6.7;

  function draw(t) {
    S.tiles.forEach((s, i) => {
      pop(s.g, t, T_TILE[i], s.cx, s.cy);
      // Partie rouge : cachée derrière le bleu, puis glisse vers le bas
      let dy = 0;
      if (!fading(t) && t >= FADE_END) dy = -TILE.bot * (1 - easeOut(prog(t, T_REVEAL[i], 0.5)));
      s.low.setAttribute('transform', dy === 0 ? '' : `translate(0 ${dy})`);
      // Sablier : un demi-tour une fois sorti (état final : sable en bas)
      const r = t >= FADE_END ? 180 * easeInOut(prog(t, T_REVEAL[i] + 0.45, 0.6)) : 180;
      s.hg.inner.setAttribute('transform', `rotate(${r})`);
    });

    rise(S.q, t, T_Q, 0.45);
    // Loupe : petit balayage en arrivant
    let lx = 0;
    if (!fading(t) && t >= FADE_END) {
      const p = prog(t, T_Q + 0.3, 0.9);
      lx = p > 0 && p < 1 ? 10 * Math.sin(p * Math.PI * 2) * (1 - p) : 0;
    }
    S.loupe.setAttribute('transform', lx === 0 ? '' : `translate(${lx} 0)`);

    rise(S.chute, t, T_CHUTE, 0.45);
  }

  G.start({ duration: 12, build, draw });
})();
