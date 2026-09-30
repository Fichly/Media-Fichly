// Blog · TPM · section « Comment mesurer la TPM ? Ce qu'elle change sur votre TRS »
// Mécanique : chaque perte va peser sur le facteur du TRS qui la voit (pannes et changements d'outils sur la
// disponibilité, micro-arrêts et sous-vitesse sur la performance, défauts et rebuts sur la qualité) et la jauge baisse.
// Attentes, déplacements, stocks intermédiaires et retouches rebondissent sur le TRS : il ne les voit pas.
// Poids des pertes dans les jauges : illustratifs (hypothèse). Rendu déterministe : boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const FR = { x: 380, y: 196, w: 756, h: 250 };
  const COLS = [
    { name: 'Disponibilité', x: 392 },
    { name: 'Performance', x: 638 },
    { name: 'Qualité', x: 884 },
  ];
  const CW = 236;
  const LEAN = { x: 380, y: 468, w: 756, h: 236 };
  // Liste mélangée : destination (colonne 0-2, ou 'lean'), poids dans la jauge
  const LOSSES = [
    { s: 'Pannes', to: 0, v: 0.15 },
    { s: 'Attentes', to: 'lean' },
    { s: 'Micro-arrêts', to: 1, v: 0.10 },
    { s: 'Défauts', to: 2, v: 0.05 },
    { s: 'Déplacements', to: 'lean' },
    { s: 'Changements d’outils', to: 0, v: 0.08 },
    { s: 'Sous-vitesse', to: 1, v: 0.07 },
    { s: 'Stocks intermédiaires', to: 'lean' },
    { s: 'Rebuts', to: 2, v: 0.03 },
    { s: 'Retouches', to: 'lean' },
  ];
  const LX = 64, LY0 = 256, LSTEP = 45;
  const T = { list: 1.85, move0: 3.2, step: 0.52, fly: 0.75, read: 9.0, chute: 9.9 };
  const GAUGE = { dx: 16, y: 296, w: 200, h: 24 };

  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Les pertes TPM', 'se lisent au TRS.', { size: 48 });
    G.blogChapeau('Chaque perte pèse sur un facteur du TRS. Quatre pertes lui échappent.');

    G.card(40, 176, 1120, 576);
    S.listHead = text(G.svg, LX, 222, 'Les pertes', { size: 21, weight: 700, fill: C.ink });

    // ----- Cadre TRS -----
    S.frame = el('g');
    el('rect', { x: FR.x, y: FR.y, width: FR.w, height: FR.h, rx: 20, fill: C.pLav, opacity: 0.6 }, S.frame);
    S.frameHead = el('g', {}, S.frame);
    const h1 = text(S.frameHead, FR.x + 24, FR.y + 36, 'TRS', { size: 24, weight: 800, fill: C.blue });
    text(S.frameHead, measure(h1).x + measure(h1).width + 12, FR.y + 36, '= disponibilité × performance × qualité', { size: 19, weight: 600, fill: C.blue });
    S.cols = COLS.map((c, i) => {
      const g = el('g', {}, S.frame);
      el('rect', { x: c.x, y: FR.y + 58, width: CW, height: FR.h - 74, rx: 14, fill: C.card }, g);
      text(g, c.x + CW / 2, FR.y + 90, c.name, { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });
      el('rect', { x: c.x + GAUGE.dx, y: GAUGE.y, width: GAUGE.w, height: GAUGE.h, rx: 8, fill: C.green }, g);
      const eaten = el('rect', { x: c.x + GAUGE.dx + GAUGE.w, y: GAUGE.y, width: 0, height: GAUGE.h, fill: C.red }, g);
      el('rect', { x: c.x + GAUGE.dx, y: GAUGE.y, width: GAUGE.w, height: GAUGE.h, rx: 8, fill: 'none', stroke: C.card, 'stroke-width': 3 }, g);
      return { ...c, g, eaten, n: 0 };
    });

    // ----- Hors TRS -----
    S.lean = el('g');
    el('rect', { x: LEAN.x, y: LEAN.y, width: LEAN.w, height: LEAN.h, rx: 20, fill: C.pYellow }, S.lean);
    text(S.lean, LEAN.x + 24, LEAN.y + 38, 'Le TRS ne les voit pas', { size: 21, weight: 700, fill: C.tYellow });
    fit(text(S.lean, LEAN.x + 24, LEAN.y + LEAN.h - 24, 'Gaspillages du Lean : une TPM seule ne les traite pas.', { size: 18, weight: 600, fill: C.ink }), LEAN.x + LEAN.w - 10, 'légende lean');

    // ----- Pertes (pilules mobiles) -----
    const counts = { 0: 0, 1: 0, 2: 0, lean: 0 };
    S.losses = LOSSES.map((L, i) => {
      const g = el('g');
      const lean = L.to === 'lean';
      const p = G.pill(g, 0, 0, L.s, { size: 17, h: 32, pad: 13, bg: C.white, fg: lean ? C.tYellow : C.tRed, anchor: 'middle' });
      p.g.insertBefore(el('rect', { x: p.x, y: -16, width: p.w, height: 32, rx: 16, fill: 'none', stroke: lean ? C.yellow : C.red, 'stroke-width': 2 }), p.g.firstChild.nextSibling);
      const from = { x: LX + p.w / 2, y: LY0 + i * LSTEP };
      let to;
      if (lean) {
        const k = counts.lean++;
        to = { x: LEAN.x + 24 + 180 + (k % 2) * 330 + (k % 2 ? 0 : 0), y: LEAN.y + 88 + Math.floor(k / 2) * 46 };
        to.x = LEAN.x + 40 + (k % 2) * 360 + p.w / 2;
      } else {
        const k = counts[L.to]++;
        const c = COLS[L.to];
        to = { x: c.x + CW / 2, y: GAUGE.y + 58 + k * 42 };
      }
      return { ...L, g, w: p.w, from, dest: to, lean, t0: T.move0 + T.step * i };
    });
    // Notes de lecture (colonne de gauche, une fois les pertes rangées)
    S.notes = el('g');
    const note = (y, h, title, body, fill, fg) => {
      el('rect', { x: 60, y, width: 300, height: h, rx: 20, fill }, S.notes);
      G.para(S.notes, 82, y + 40, title, 256, { size: 19, weight: 700, fill: fg, lh: 1.2 });
      G.para(S.notes, 82, y + 112, body, 256, { size: 17, weight: 500, fill: C.ink, lh: 1.3 });
    };
    note(FR.y, FR.h, 'Aucun seuil de TRS à atteindre', 'Un taux se compare à lui-même : même équipement, même période.', C.pLav, C.blue);
    note(LEAN.y, LEAN.h, 'Au démarrage, plus simple', 'La part des arrêts subis dans le temps d’ouverture, avant puis à trois mois.', C.pGreen, C.tGreen);
    S.chute = G.blogChute('Une TPM qui avance se lit sur le TRS, sans indicateur maison.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.listHead.setAttribute('opacity', live ? Math.min(clamp(prog(t, T.list - 0.1, 0.3)), 1 - clamp(prog(t, T.read - 0.6, 0.3))) : 0);
    S.notes.setAttribute('opacity', live ? clamp(prog(t, T.read - 0.3, 0.4)) : o);
    S.frame.setAttribute('opacity', live ? clamp(prog(t, 2.2, 0.35)) : o);
    S.lean.setAttribute('opacity', live ? clamp(prog(t, 2.45, 0.35)) : o);

    const eaten = [0, 0, 0];
    S.losses.forEach((L, i) => {
      let x = L.dest.x, y = L.dest.y, op = o;
      if (live) {
        op = clamp(prog(t, T.list + 0.07 * i, 0.25));
        const p = prog(t, L.t0, L.lean ? T.fly * 1.4 : T.fly);
        if (L.lean) {
          // rebond sur le cadre du TRS, puis chute dans la boîte des gaspillages
          const hitX = FR.x - L.w / 2 - 6, hitY = clamp(L.from.y, FR.y + 70, FR.y + FR.h - 30);
          if (p < 0.4) { const e = easeInOut(p / 0.4); x = L.from.x + (hitX - L.from.x) * e; y = L.from.y + (hitY - L.from.y) * e; }
          else if (p < 0.55) { const q = (p - 0.4) / 0.15; x = hitX - 26 * Math.sin(Math.PI * q); y = hitY; }
          else { const e = easeInOut((p - 0.55) / 0.45); x = hitX + (L.dest.x - hitX) * e; y = hitY + (L.dest.y - hitY) * e - 40 * Math.sin(Math.PI * e); }
        } else {
          const e = easeInOut(p);
          x = L.from.x + (L.dest.x - L.from.x) * e;
          y = L.from.y + (L.dest.y - L.from.y) * e - 50 * Math.sin(Math.PI * p);
          if (p >= 1) eaten[L.to] += L.v * clamp(prog(t, L.t0 + T.fly, 0.35));
        }
      } else if (!L.lean) eaten[L.to] += L.v;
      L.g.setAttribute('transform', `translate(${x} ${y})`);
      L.g.setAttribute('opacity', op);
    });
    // Jauges : la part mangée par les pertes arrivées
    S.cols.forEach((c, i) => {
      const w = GAUGE.w * eaten[i] * 1.6;
      c.eaten.setAttribute('x', c.x + GAUGE.dx + GAUGE.w - w);
      c.eaten.setAttribute('width', Math.max(0.001, w));
    });
    if (live && t >= T.read - 0.1 && t < T.read + 0.8) pulse(S.frameHead, t, T.read, FR.x + 300, FR.y + 30, 0.06, 0.45);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
