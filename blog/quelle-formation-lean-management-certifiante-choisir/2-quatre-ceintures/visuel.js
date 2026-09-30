// Blog · Quelle formation Lean Management choisir · section « Quels types de formations lean certifiantes choisir ? »
// Mécanique : un escalier de quatre marches. Un participant monte de ceinture en ceinture ; à chaque marche,
// sa place dans l'organisation change : il comprend (White), participe à un chantier piloté par un Green Belt (Yellow),
// pilote lui-même l'équipe (Green), puis accompagne plusieurs Green Belts (Black). Les gains visés apparaissent
// quand on arrive au pilotage.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const S = {};

  const FLOOR = 724, RISE = 86, SW = 265, X0 = 50, GAP = 10;
  const top = i => 666 - RISE * i;
  const left = i => X0 + i * (SW + GAP);
  const BELT = ['#ffffff', C.yellow, C.green, C.ink];
  const LEVELS = [
    { name: 'White Belt', dur: '1 jour', verb: 'Comprendre', sub: 'Tous les collaborateurs : vocabulaire, principes, culture commune.' },
    { name: 'Yellow Belt', dur: '3 jours', verb: 'Participer', sub: 'Opérationnels, managers de proximité : contribuer aux chantiers.' },
    { name: 'Green Belt', dur: '5 jours', verb: 'Piloter un projet', sub: 'Chefs de projet, ingénieurs : DMAIC, statistiques intermédiaires.', gain: '50 000 € ou plus' },
    { name: 'Black Belt', dur: '7 jours', verb: 'Transformer', sub: 'Experts à temps plein : projets majeurs, accompagnement des Green Belts.', gain: 'plus de 100 000 €' },
  ];
  const ARRIVE = [2.1, 4.5, 6.9, 9.3], JUMP = 0.6;
  const CHUTE_T = 11.5;

  // Personnage : tête + buste, bande de la couleur de la ceinture
  function person(parent, x, y, { body = C.lightBlue, band = null, k = 1 } = {}) {
    const g = el('g', { transform: `translate(${x} ${y})` + (k === 1 ? '' : ` scale(${k})`) }, parent);
    el('circle', { cx: 0, cy: -14, r: 7.5, fill: body }, g);
    el('rect', { x: -10, y: -4, width: 20, height: 18, rx: 7, fill: body }, g);
    const b = band ? el('rect', { x: -10, y: 4, width: 20, height: 4.5, fill: band, stroke: band === '#ffffff' ? C.ink : 'none', 'stroke-width': 1 }, g) : null;
    return { g, band: b };
  }
  function link(parent, x1, y1, x2, y2) {
    el('line', { x1, y1, x2, y2, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.6 }, parent);
  }
  // Place du participant dans l'organisation, à chaque niveau (centre px, py)
  const PICTO = [
    (g, px, py) => {
      [-60, -30, 30, 60].forEach(dx => person(g, px + dx, py));
      return { x: px, y: py };
    },
    (g, px, py) => {
      el('rect', { x: px - 88, y: py - 30, width: 176, height: 52, rx: 14, fill: C.pLav }, g);
      person(g, px - 62, py, { body: C.lightBlue, band: C.green });
      person(g, px - 16, py);
      person(g, px + 60, py);
      return { x: px + 22, y: py };
    },
    (g, px, py) => {
      [-10, 30, 70].forEach(dx => link(g, px - 58, py - 2, px + dx, py - 2));
      [-10, 30, 70].forEach(dx => person(g, px + dx, py, { band: C.yellow }));
      return { x: px - 62, y: py };
    },
    (g, px, py) => {
      [-10, 30, 70].forEach((dx, k) => link(g, px - 58, py - 2, px + dx, py - 2));
      [-10, 30, 70].forEach(dx => {
        [-7, 0, 7].forEach(d => el('circle', { cx: px + dx + d, cy: py + 22, r: 3, fill: C.lightBlue }, g));
        person(g, px + dx, py, { band: C.green });
      });
      return { x: px - 62, y: py };
    },
  ];

  function build() {
    G.templateBlog();
    G.blogTitle('Quatre ceintures,', 'quatre rôles.');
    G.blogChapeau('De la White à la Black Belt : comprendre, participer, piloter, transformer.');

    // Marches (fond immobile)
    S.steps = LEVELS.map((L, i) => {
      const x = left(i), y = top(i);
      el('rect', { x, y, width: SW, height: FLOOR - y, rx: 14, fill: C.card, stroke: C.line, 'stroke-width': 2 });
      const clip = G.clipRect(x, y, SW, 14);
      const strip = el('g', { 'clip-path': clip.url });
      el('rect', { x, y, width: SW, height: 28, rx: 14, fill: BELT[i], stroke: i === 0 ? C.ink : 'none', 'stroke-width': 1.5 }, strip);
      const face = el('g');
      text(face, x + 20, y + 50, L.name, { size: 21, weight: 800, fill: C.ink });
      const pl = G.pill(face, 0, y + 43, L.dur, { size: 16, h: 28, pad: 12, bg: C.pLav, fg: C.blue });
      pl.g.setAttribute('transform', `translate(${x + SW - 18 - pl.w} 0)`);   // alignée à droite
      let gain = null;
      if (L.gain) {
        gain = el('g');
        text(gain, x + 20, y + 92, 'Gains visés par projet', { size: 16, weight: 600, fill: C.tGreen });
        fit(text(gain, x + 20, y + 122, L.gain, { size: 24, weight: 800, fill: C.tGreen }), x + SW - 10, `gain ${i}`);
      }
      // Rôle au-dessus de la marche
      const role = el('g');
      fit(text(role, x + 6, y - 140, L.verb, { size: 25, weight: 800, fill: C.blue }), x + SW, `verbe ${i}`);
      G.para(role, x + 6, y - 112, L.sub, SW - 10, { size: 16.5, weight: 500, fill: C.ink, lh: 1.25 });
      const picto = el('g');
      const me = PICTO[i](picto, x + SW / 2 + 22, y - 34);
      const meG = el('g');
      person(meG, me.x, me.y, { body: C.blue, band: BELT[i] });
      return { clip: clip.rect, strip, face, gain, role, picto, me, meG, x, y };
    });

    // Le participant qui monte
    S.walker = el('g');
    const p = person(S.walker, 0, 0, { body: C.blue, band: BELT[0] });
    S.walkerBand = p.band;

    S.chute = G.blogChute('Yellow Belt pour participer, Green Belt pour piloter.', { y: 808 });
  }


  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // Le participant saute de sa place d'un niveau à sa place au niveau suivant
    let jumping = -1, wx = 0, wy = 0;
    if (live) for (let i = 1; i < 4; i++) {
      const t0 = ARRIVE[i] - JUMP;
      if (t >= t0 && t < ARRIVE[i]) {
        const a = S.steps[i - 1].me, b = S.steps[i].me;
        const q = easeInOut(prog(t, t0, JUMP));
        wx = a.x + (b.x - a.x) * q;
        wy = a.y + (b.y - a.y) * q - 70 * Math.sin(Math.PI * q);
        jumping = i;
      }
    }
    S.walker.setAttribute('transform', `translate(${wx} ${wy})`);
    S.walker.setAttribute('opacity', jumping > 0 ? 1 : 0);
    S.walkerBand.setAttribute('fill', BELT[Math.max(0, jumping - 1)]);
    S.walkerBand.setAttribute('stroke', jumping === 1 ? C.ink : 'none');

    S.steps.forEach((s, i) => {
      const a = ARRIVE[i];
      const q = live ? easeOut(prog(t, a - 0.05, 0.45)) : 1;
      s.clip.setAttribute('width', Math.max(0.001, SW * q));
      s.strip.setAttribute('opacity', o);
      rise(s.face, t, a, 0.4, 10);
      rise(s.role, t, a + 0.15, 0.4, 12);
      rise(s.picto, t, a + 0.45, 0.4, 10);
      if (s.gain) rise(s.gain, t, a + 0.85, 0.4, 10);
      if (i === 0) pop(s.meG, t, a, s.me.x, s.me.y - 4, 0.35);
      else { s.meG.setAttribute('opacity', live ? (t >= a ? 1 : 0) : o); s.meG.setAttribute('transform', ''); }
      if (i > 0 && live && t >= a && t < a + 0.7) pulse(s.meG, t, a, s.me.x, s.me.y, 0.18, 0.35);
    });

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
