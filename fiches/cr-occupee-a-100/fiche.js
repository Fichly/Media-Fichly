// Fiche LinkedIn · Clément Raymond · mardi 6 octobre 2026
// Post : « Une machine occupée à 100 % n'est pas forcément une bonne nouvelle. »
// Premier commentaire du post (Buffer) : article cartographie des flux (VSM) → encart bas gauche.
// Mécanique : l'indicateur dit « 100 % », le flux montre le stock qui grossit entre poste rapide et poste lent.
// Rendu déterministe : window.FICHE.draw(t), t en secondes, boucle de 12 s.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, clamp, FADE_END, fading, fadeOut, pop, slide, rise } = G;
  const NB = ' ';

  // Machine stylisée : corps bleu, écran avec jauge d'occupation, deux voyants
  function machine(parent, x, y) {
    const g = el('g', {}, parent);
    el('rect', { x, y, width: 180, height: 124, rx: 16, fill: C.blue }, g);
    el('rect', { x: x + 16, y: y + 16, width: 104, height: 40, rx: 8, fill: C.white }, g);
    el('rect', { x: x + 26, y: y + 30, width: 84, height: 12, rx: 6, fill: C.pLav }, g);
    const gauge = el('rect', { x: x + 26, y: y + 30, width: 84, height: 12, rx: 6, fill: C.green }, g);
    el('circle', { cx: x + 148, cy: y + 26, r: 8, fill: C.lightBlue }, g);
    el('circle', { cx: x + 148, cy: y + 50, r: 8, fill: C.green }, g);
    el('rect', { x: x + 16, y: y + 72, width: 148, height: 36, rx: 8, fill: C.white, 'fill-opacity': 0.14 }, g);
    [0, 1, 2, 3].forEach(i => el('rect', { x: x + 30 + i * 34, y: y + 80, width: 18, height: 20, rx: 4, fill: C.white, 'fill-opacity': 0.35 }, g));
    return { g, gauge };
  }

  const S = {};
  const FLOOR = 530;

  function build() {
    G.template({ author: 'clement' });
    G.title(`Machine à 100${NB}%,`, 'le stock grossit.');
    G.chapeau(`Sur l’indicateur, tout va bien. Dans le flux, rien ne va plus vite.`);

    // ----- Carte 1 : l'atelier -----
    G.card(60, 330, 960, 310);
    el('line', { x1: 92, y1: FLOOR + 2, x2: 988, y2: FLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });

    S.stations = [
      { x: 100, name: 'Poste rapide', sub: 'Produit à son rythme' },
      { x: 800, name: 'Poste lent', sub: 'Ne peut pas absorber' },
    ].map(({ x, name, sub }, i) => {
      const cx = x + 90;
      const g = el('g');
      const m = machine(g, x, FLOOR - 126);
      fit(text(g, cx, 570, name, { size: 24, weight: 700, fill: C.ink, anchor: 'middle' }), 1010, `nom poste ${i + 1}`, 70);
      const s = text(g, cx, 600, sub, { size: 21, weight: 500, fill: C.ink, anchor: 'middle' });
      fit(s, 1010, `sous-titre poste ${i + 1}`, 70);
      const pg = el('g');
      const p = G.pill(pg, cx, 372, `Occupée à 100${NB}%`, { bg: C.pGreen, fg: C.tGreen, icon: 'check', anchor: 'middle' });
      fit(p.tx, 1010, `jauge poste ${i + 1}`, 70);
      return { g, pg, gauge: m.gauge, cx, sub: s };
    });

    // Sens du flux
    S.flow = el('g');
    [330, 380, 430, 776].forEach(x => el('path', {
      d: `M ${x - 6} ${FLOOR - 32} L ${x + 4} ${FLOOR - 22} L ${x - 6} ${FLOOR - 12}`,
      fill: 'none', stroke: C.blue, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, S.flow));

    // Le stock : pyramide de cartons devant le poste lent, remplie du bas vers le haut, de droite à gauche
    S.boxes = [];
    for (let r = 0; r < 4; r++) {
      const n = 6 - r;
      for (let k = n - 1; k >= 0; k--) {
        const sx = 540 + 18 * r + 36 * k + 16, sy = FLOOR - 16 - 36 * r;
        const g = el('g', { transform: `translate(${sx} ${sy})` });
        el('rect', { x: -16, y: -16, width: 32, height: 32, rx: 5, fill: C.yellow }, g);
        el('line', { x1: -9, y1: -5, x2: 9, y2: -5, stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
        S.boxes.push({ g, sx, sy });
      }
    }
    S.stockPill = el('g');
    const sp = G.pill(S.stockPill, 630, 572, 'Le stock grossit', { bg: C.pRed, fg: C.tRed, icon: 'cross', anchor: 'middle' });
    G.noOverlap(sp.tx, S.stations[1].sub, 'étiquette stock / poste lent', 12);

    // ----- Carte 2 : ce que ça coûte -----
    S.bad = el('g');
    el('rect', { x: 60, y: 656, width: 960, height: 174, rx: 24, fill: C.pRed }, S.bad);
    S.badRows = [
      'Plus d’encours.',
      'Un délai de traversée qui s’allonge.',
      'Des défauts découverts des jours après leur fabrication.',
    ].map((label, i) => {
      const cy = 700 + 46 * i;
      const g = el('g', {}, S.bad);
      G.cross(g, 108, cy, 18);
      fit(text(g, 142, cy + 9, label, { size: 25, weight: 700, fill: C.tRed }), 1000, `conséquence ${i + 1}`);
      return { g, cy };
    });

    // ----- Carte 3 : la règle -----
    S.rule = el('g');
    el('rect', { x: 60, y: 846, width: 960, height: 188, rx: 24, fill: C.pLav }, S.rule);
    G.pill(S.rule, 100, 884, 'La règle à garder en tête', { bg: C.blue, fg: C.white });
    fit(text(S.rule, 100, 940, 'Un atelier ne produit jamais plus vite', { size: 28, weight: 700, fill: C.ink }), 1000, 'règle ligne 1');
    const r2 = text(S.rule, 100, 978, 'que ', { size: 28, weight: 700, fill: C.ink });
    const hl = el('tspan', { fill: C.blue }, r2);
    hl.textContent = 'son poste le plus lent';
    r2.appendChild(document.createTextNode('.'));
    fit(r2, 1000, 'règle ligne 2');
    fit(text(S.rule, 100, 1014, 'Tout ce qu’on fabrique au-delà finit en stock.', { size: 22, weight: 500, fill: C.ink }), 1000, 'règle ligne 3');

    S.chute = G.chute('Avant de juger une machine sur son occupation,', 'regardez l’encours qui s’accumule juste après elle.');
    G.encart(['Cartographier ses flux', 'Notre article sur la VSM', '(lien en commentaire)']);
  }

  // ---------- Chronologie ----------
  const BOX_START = 3.3, BOX_STEP = 0.1, BOX_DUR = 0.35;
  const FROM = { x: 296, y: FLOOR - 16 };

  function draw(t) {
    // Postes, puis leur jauge « 100 % » qui se remplit
    S.stations.forEach((s, i) => {
      const t0 = 1.75 + 0.65 * i;
      pop(s.g, t, t0, s.cx, 470);
      pop(s.pg, t, t0 + 0.3, s.cx, 372);
      const p = t >= FADE_END ? easeInOut(prog(t, t0 + 0.3, 0.4)) : 1;
      s.gauge.setAttribute('width', Math.max(0.001, 84 * p));
    });
    pop(S.flow, t, 3.1, 380, FLOOR - 22);

    // Les cartons sortent du poste rapide et s'empilent devant le poste lent
    S.boxes.forEach((b, i) => {
      let x = b.sx, y = b.sy, o = 1;
      if (fading(t)) o = fadeOut(t);
      else if (t >= FADE_END) {
        const p = prog(t, BOX_START + BOX_STEP * i, BOX_DUR);
        if (p < 1) {
          const e = easeInOut(p);
          x = FROM.x + (b.sx - FROM.x) * e;
          y = FROM.y + (b.sy - FROM.y) * e - 46 * Math.sin(Math.PI * p);
        }
        o = clamp(p / 0.2);
      }
      b.g.setAttribute('transform', `translate(${x} ${y})`);
      b.g.setAttribute('opacity', o);
    });
    pop(S.stockPill, t, 5.45, 630, 572);

    // Conséquences : le bandeau glisse, puis chaque ✗ apparaît
    slide(S.bad, t, 5.9, 0.4);
    S.badRows.forEach((r, i) => pop(r.g, t, 6.25 + 0.35 * i, 300, r.cy, 0.3));

    // La règle, puis la chute
    slide(S.rule, t, 7.4);
    rise(S.chute, t, 7.9, 0.45);
  }

  G.start({ duration: 12, build, draw });
})();
