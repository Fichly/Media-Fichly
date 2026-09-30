// Blog · TPM · section « Qu'est-ce que la TPM (Total Productive Maintenance) ? »
// Mécanique : les quatre gestes de premier niveau (nettoyage, lubrification, inspection, serrage) passent du service
// maintenance à la production. Le temps du service se libère pour ce que lui seul sait faire, son effectif ne change pas,
// la production reçoit un créneau au planning, et l'obligation de l'employeur, en bas, ne bouge pas.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const LEFT = { x: 40, w: 530 }, RIGHT = { x: 630, w: 530 };
  const GESTES = ['Nettoyage', 'Lubrification', 'Inspection', 'Serrage'];
  const CW = 236, CHh = 42, GY = 338, GSTEP = 52;
  const FROM_X = RIGHT.x + 24, TO_X = LEFT.x + 24;
  const T = { stack: 2.6, move0: 3.6, step: 0.85, fly: 0.8, same: 7.5, lock: 8.3, chute: 9.6 };
  const BAR = { y: 598, h: 26, share: 0.44 };      // part des gestes simples dans le temps du service (illustratif)

  const S = {};

  function person(parent, cx, floor, fill, k = 1) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 50 * k, r: 12 * k, fill }, g);
    el('path', { d: `M ${cx - 20 * k} ${floor} L ${cx - 20 * k} ${floor - 18 * k} Q ${cx - 20 * k} ${floor - 34 * k} ${cx} ${floor - 34 * k} Q ${cx + 20 * k} ${floor - 34 * k} ${cx + 20 * k} ${floor - 18 * k} L ${cx + 20 * k} ${floor} Z`, fill }, g);
    return g;
  }
  function lock(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx - 11} ${cy - 4} L ${cx - 11} ${cy - 13} A 11 11 0 0 1 ${cx + 11} ${cy - 13} L ${cx + 11} ${cy - 4}`, fill: 'none', stroke: C.blue, 'stroke-width': 4.5 }, g);
    el('rect', { x: cx - 17, y: cy - 6, width: 34, height: 27, rx: 6, fill: C.blue }, g);
    el('circle', { cx, cy: cy + 6, r: 4, fill: C.white }, g);
    return g;
  }
  function hatchRect(parent, x, y, w, h, fill, line) {
    const g = el('g', {}, parent);
    const cp = G.clipRect(x, y, w, h);
    const inner = el('g', { 'clip-path': cp.url }, g);
    el('rect', { x, y, width: w, height: h, fill }, inner);
    for (let k = -h; k < w; k += 10) el('line', { x1: x + k, y1: y + h, x2: x + k + h, y2: y, stroke: line, 'stroke-width': 3, opacity: 0.6 }, inner);
    return { g, cp: cp.rect };
  }

  function build() {
    G.templateBlog();
    G.blogTitle('La TPM déplace', 'les gestes.');
    G.blogChapeau('Les gestes de premier niveau passent à ceux qui sont devant la machine.');

    // ----- Production -----
    G.card(LEFT.x, 176, LEFT.w, 470);
    S.headL = el('g');
    G.pill(S.headL, LEFT.x + 24, 214, 'Production', { size: 20, h: 36, bg: C.pGreen, fg: C.tGreen });
    S.who = el('g');
    person(S.who, LEFT.x + 330, 296, C.teal);
    G.machine(S.who, LEFT.x + 380, 244, 0.42);
    text(S.who, LEFT.x + 24, 262, 'les opérateurs, devant', { size: 17, weight: 500, fill: C.ink });
    text(S.who, LEFT.x + 24, 284, 'la machine toute la journée', { size: 17, weight: 500, fill: C.ink });
    S.slots = el('g');
    GESTES.forEach((_, i) => el('rect', { x: TO_X, y: GY + i * GSTEP, width: CW, height: CHh, rx: 12, fill: 'none', stroke: C.green, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, S.slots));
    S.labL = el('g');
    text(S.labL, TO_X + CW + 20, GY + 70, 'gestes simples', { size: 17, weight: 600, fill: C.tGreen });
    text(S.labL, TO_X + CW + 20, GY + 92, 'et répétés, faits', { size: 17, weight: 600, fill: C.tGreen });
    text(S.labL, TO_X + CW + 20, GY + 114, 'avant la panne', { size: 17, weight: 600, fill: C.tGreen });

    // Barre de temps côté production : le créneau d'auto-maintenance au planning
    S.barL = el('g');
    text(S.barL, LEFT.x + 24, BAR.y - 12, 'Temps d’ouverture', { size: 17, weight: 700, fill: C.ink });
    el('rect', { x: LEFT.x + 24, y: BAR.y, width: LEFT.w - 48, height: BAR.h, rx: 8, fill: C.pGreen }, S.barL);
    const slotW = 0.16 * (LEFT.w - 48);
    S.crL = hatchRect(S.barL, LEFT.x + LEFT.w - 24 - slotW, BAR.y, slotW, BAR.h, C.green, C.white);
    S.crW = slotW;
    S.crLab = text(S.barL, LEFT.x + LEFT.w - 24, BAR.y - 12, 'créneau au planning', { size: 16, weight: 700, fill: C.tGreen, anchor: 'end' });

    // ----- Service maintenance -----
    G.card(RIGHT.x, 176, RIGHT.w, 470);
    S.headR = el('g');
    G.pill(S.headR, RIGHT.x + 24, 214, 'Service maintenance', { size: 20, h: 36 });
    S.techs = el('g');
    [0, 1, 2].forEach(i => person(S.techs, RIGHT.x + 44 + i * 52, 296, C.blue));
    S.same = el('g');
    const sp = G.pill(S.same, RIGHT.x + 204, 274, 'même effectif', { size: 17, h: 32, pad: 12, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
    S.sameC = { x: RIGHT.x + 204 + sp.w / 2, y: 274 };
    // Bloc « ce que lui seul sait faire » : il récupère la place (le temps) des gestes transférés
    S.expert = el('g');
    S.exRect = el('rect', { x: 0, y: GY, width: 0, height: 624 - GY, rx: 16, fill: C.blue }, S.expert);
    S.exT1 = text(S.expert, 0, GY + 128, 'Ce que lui seul', { size: 21, weight: 700, fill: C.white, anchor: 'middle' });
    S.exT2 = text(S.expert, 0, GY + 156, 'sait faire', { size: 21, weight: 700, fill: C.white, anchor: 'middle' });
    S.exT3 = text(S.expert, 0, GY + 190, 'le temps libéré y revient', { size: 16, weight: 500, fill: C.white, anchor: 'middle' });
    S.ex = { x1: RIGHT.x + RIGHT.w - 24, xa: FROM_X + CW + 14, xb: FROM_X };

    // Gestes (cartes mobiles)
    S.cards = GESTES.map((s, i) => {
      const g = el('g');
      el('rect', { x: -CW / 2, y: -CHh / 2, width: CW, height: CHh, rx: 12, fill: C.white, stroke: C.lightBlue, 'stroke-width': 2.5 }, g);
      el('circle', { cx: -CW / 2 + 22, cy: 0, r: 7, fill: C.yellow }, g);
      text(g, -CW / 2 + 40, 6, s, { size: 18, weight: 700, fill: C.ink });
      return { g, y: GY + i * GSTEP + CHh / 2, t0: T.move0 + T.step * i };
    });

    // ----- Obligation de l'employeur : fixe -----
    G.card(40, 660, 1120, 88);
    S.oblig = el('g');
    lock(S.oblig, 86, 704);
    G.pill(S.oblig, 124, 704, 'Employeur', { size: 19, h: 34, bg: C.blue, fg: C.white });
    fit(text(S.oblig, 282, 699, 'Maintien en état de conformité des équipements de travail :', { size: 18, weight: 600, fill: C.ink }), 1140, 'obligation 1');
    fit(text(S.oblig, 282, 724, 'l’obligation reste la sienne, quelle que soit l’organisation choisie.', { size: 18, weight: 500, fill: C.ink }), 1140, 'obligation 2');

    S.chute = G.blogChute('Le transfert porte sur les gestes, jamais sur l’obligation.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    pop(S.headL, t, 1.75, LEFT.x + 90, 214);
    pop(S.headR, t, 1.9, RIGHT.x + 130, 214);
    S.who.setAttribute('opacity', live ? clamp(prog(t, 2.0, 0.3)) : o);
    S.techs.setAttribute('opacity', live ? clamp(prog(t, 2.1, 0.3)) : o);
    S.oblig.setAttribute('opacity', live ? clamp(prog(t, 2.3, 0.3)) : o);
    S.slots.setAttribute('opacity', live ? 0.9 * clamp(prog(t, 2.4, 0.3)) : 0.9 * o);
    S.barL.setAttribute('opacity', live ? clamp(prog(t, 2.5, 0.3)) : o);
    S.expert.setAttribute('opacity', live ? clamp(prog(t, 2.8, 0.3)) : o);

    // Gestes : d'abord empilés côté maintenance, puis transférés un à un
    let moved = 0;
    S.cards.forEach((c, i) => {
      let x = TO_X + CW / 2, y = c.y, op = o;
      if (live) {
        const p = prog(t, c.t0, T.fly), e = easeInOut(p);
        x = FROM_X + CW / 2 + (TO_X - FROM_X) * e;
        y = c.y - 46 * Math.sin(Math.PI * p);
        op = clamp(prog(t, T.stack + 0.12 * i, 0.3));
        moved += e;
      } else moved += 1;
      c.g.setAttribute('transform', `translate(${x} ${y})`);
      c.g.setAttribute('opacity', op);
    });
    const f = moved / GESTES.length;                  // part des gestes transférés
    // le bloc récupère la place une fois la pile vidée
    const fb = live ? easeInOut(prog(t, T.move0 + 3 * T.step + T.fly * 0.55, 0.7)) : 1;
    const ex0 = S.ex.xa + (S.ex.xb - S.ex.xa) * fb, exc = (ex0 + S.ex.x1) / 2;
    S.exRect.setAttribute('x', ex0);
    S.exRect.setAttribute('width', S.ex.x1 - ex0);
    [S.exT1, S.exT2, S.exT3].forEach(n => n.setAttribute('x', exc));
    S.exT3.setAttribute('opacity', clamp((fb - 0.5) * 3));
    S.crL.cp.setAttribute('width', Math.max(0.001, S.crW * f));
    S.crLab.setAttribute('opacity', clamp(f * 1.5));
    S.labL.setAttribute('opacity', live ? clamp(prog(t, T.move0 + 3 * T.step + T.fly, 0.4)) : o);

    pop(S.same, t, 2.2, S.sameC.x, S.sameC.y);
    if (live && t >= T.same - 0.1 && t < T.same + 0.8) pulse(S.same, t, T.same, S.sameC.x, S.sameC.y, 0.1, 0.45);
    if (live && t >= T.lock - 0.1 && t < T.lock + 0.8) pulse(S.oblig, t, T.lock, 600, 704, 0.03, 0.45);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
