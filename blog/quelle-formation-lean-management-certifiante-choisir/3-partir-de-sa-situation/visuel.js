// Blog · Quelle formation Lean Management choisir · section « Comment identifier la formation lean qui vous correspond ? »
// Mécanique : quatre situations à gauche, les quatre ceintures à droite. Chaque situation s'allume à son tour
// et trace son chemin vers la ou les ceintures que l'article recommande ; deux situations ont deux options.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, slide, pulse } = G;
  const S = {};

  const ROW_Y = i => 250 + 128 * i;           // centre des lignes
  const CARD = { x: 40, w: 540, h: 110 };
  const BELT = { x: 800, w: 360, h: 110 };
  // Ordre choisi pour que les chemins ne se croisent pas
  const SITUATIONS = [
    { title: 'Projet d’entreprise pour vos salariés', sub: 'Créer un langage commun, embarquer les équipes', to: [0, 1] },
    { title: 'Démarche professionnelle individuelle', sub: 'Renforcer son CV, évoluer, se reconvertir', to: [1, 2] },
    { title: 'Manager ou ingénieur en poste', sub: 'Résoudre qualité, délais, productivité', to: [2] },
    { title: 'Viser une expertise reconnue', sub: 'Piloter des transformations majeures', to: [3] },
  ];
  const BELTS = [
    { name: 'White Belt', obj: 'Une culture commune', color: '#ffffff' },
    { name: 'Yellow Belt', obj: 'Participer aux chantiers', color: C.yellow },
    { name: 'Green Belt', obj: 'Piloter des projets', color: C.green },
    { name: 'Black Belt', obj: 'Transformations majeures', color: C.ink },
  ];
  const CALL = i => 3.0 + 1.95 * i;
  const CHUTE_T = 11.3;

  function belt(parent, x, cy, color) {
    const g = el('g', {}, parent);
    const stroke = color === '#ffffff' ? C.ink : 'none';
    el('rect', { x, y: cy - 11, width: 76, height: 22, rx: 6, fill: color, stroke, 'stroke-width': 1.5 }, g);
    el('path', { d: `M ${x + 30} ${cy + 8} L ${x + 22} ${cy + 30} L ${x + 32} ${cy + 28} Z M ${x + 46} ${cy + 8} L ${x + 54} ${cy + 30} L ${x + 44} ${cy + 28} Z`, fill: color, stroke, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    el('rect', { x: x + 28, y: cy - 14, width: 20, height: 28, rx: 5, fill: color, stroke: color === '#ffffff' ? C.ink : C.white, 'stroke-width': 1.5 }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Partir de', 'votre situation.');
    G.blogChapeau('Quatre situations fréquentes, et le niveau de certification qui leur répond.');

    S.headL = el('g');
    text(S.headL, CARD.x + 8, 184, 'Votre situation', { size: 18, weight: 700, fill: C.blue });
    S.headR = el('g');
    text(S.headR, BELT.x + 8, 184, 'Le niveau conseillé', { size: 18, weight: 700, fill: C.blue });

    S.belts = BELTS.map((b, j) => {
      const cy = ROW_Y(j), y = cy - BELT.h / 2;
      el('rect', { x: BELT.x, y, width: BELT.w, height: BELT.h, rx: 20, fill: C.card, stroke: C.line, 'stroke-width': 2 });
      const g = el('g');
      belt(g, BELT.x + 20, cy - 6, b.color);
      text(g, BELT.x + 112, cy - 6, b.name, { size: 23, weight: 800, fill: C.ink });
      fit(text(g, BELT.x + 112, cy + 24, b.obj, { size: 17, weight: 500, fill: C.ink }), BELT.x + BELT.w - 12, `objectif ${j}`);
      const glow = el('rect', { x: BELT.x - 1.5, y: y - 1.5, width: BELT.w + 3, height: BELT.h + 3, rx: 21, fill: 'none', stroke: C.blue, 'stroke-width': 4, opacity: 0 });
      return { g, glow, cy };
    });

    S.sits = SITUATIONS.map((s, i) => {
      const cy = ROW_Y(i), y = cy - CARD.h / 2;
      el('rect', { x: CARD.x, y, width: CARD.w, height: CARD.h, rx: 20, fill: C.card, stroke: C.line, 'stroke-width': 2 });
      const g = el('g');
      G.badgeNum(g, CARD.x + 38, cy, i + 1, 18);
      fit(text(g, CARD.x + 72, cy - 6, s.title, { size: 21, weight: 700, fill: C.ink }), CARD.x + CARD.w - 12, `situation ${i}`);
      fit(text(g, CARD.x + 72, cy + 24, s.sub, { size: 17, weight: 500, fill: C.ink }), CARD.x + CARD.w - 12, `détail ${i}`);
      const glow = el('rect', { x: CARD.x - 1.5, y: y - 1.5, width: CARD.w + 3, height: CARD.h + 3, rx: 21, fill: 'none', stroke: C.blue, 'stroke-width': 4, opacity: 0 });
      const links = s.to.map(j => {
        const y1 = cy + (s.to.length > 1 ? (j === s.to[0] ? -16 : 16) : 0);
        const y2 = ROW_Y(j) + (j === i ? 0 : j < i ? 14 : -14) * (s.to.length > 1 || j !== i ? 1 : 0);
        return G.arrow(G.svg, `M ${CARD.x + CARD.w + 10} ${y1} C 690 ${y1}, 690 ${y2}, ${BELT.x - 10} ${y2}`, { width: 3.5, head: 10 });
      });
      return { g, glow, links, cy };
    });

    S.chute = G.blogChute('Le bon niveau dépend de votre situation et de vos objectifs.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    rise(S.headL, t, 1.75, 0.35, 8);
    rise(S.headR, t, 1.85, 0.35, 8);
    S.belts.forEach((b, j) => rise(b.g, t, 2.0 + 0.1 * j, 0.4, 10));

    const hit = [0, 0, 0, 0];
    S.sits.forEach((s, i) => {
      const c = CALL(i);
      slide(s.g, t, 1.8 + 0.12 * i, 0.4, -50);
      s.glow.setAttribute('opacity', live ? G.window01(t, c - 0.1, c + 1.5, 0.2) : 0);
      s.links.forEach((l, k) => {
        const t0 = c + 0.25 + 0.3 * k;
        l.draw(live ? easeOut(prog(t, t0, 0.55)) : 1);
        l.g.setAttribute('opacity', live ? 1 : o);
        const j = SITUATIONS[i].to[k];
        if (live && t >= t0 + 0.55 && t < c + 1.5) hit[j] = Math.max(hit[j], G.window01(t, t0 + 0.5, c + 1.5, 0.15));
        if (live && t >= t0 + 0.5 && t < t0 + 1.2) pulse(S.belts[j].g, t, t0 + 0.55, BELT.x + 60, ROW_Y(j), 0.05, 0.4);
      });
    });
    S.belts.forEach((b, j) => b.glow.setAttribute('opacity', hit[j]));
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
