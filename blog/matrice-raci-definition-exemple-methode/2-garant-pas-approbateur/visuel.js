// Blog · Matrice RACI · section « Les quatre lettres de RACI, et celle qui est presque toujours mal traduite »
// Mécanique : même tâche, même blocage en semaine 2, deux lectures du A.
// En haut, A = approbateur : il attend au bout de la ligne pour signer ; la tâche se bloque, personne ne la
// débloque, il n'y a rien à signer. En bas, A = garant : il accompagne la tâche, relance, arbitre, débloque,
// et rend compte à la fin.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = { lanes: [] };
  const BX0 = 340, BX1 = 1000;
  const bx = p => BX0 + (BX1 - BX0) * p;
  const PB = 0.45;                               // position du blocage
  const T0 = 2.8, TB = 6.0, TR = 7.0, TEND = 9.4;
  const LANES = [{ top: 176, garant: false }, { top: 476, garant: true }];
  // Avancement de la tâche selon la lecture du A
  const progress = (garant, t) => {
    if (t < FADE_END) return garant ? 1 : PB;
    if (t < T0) return 0;
    if (t < TB) return PB * easeInOut(prog(t, T0, TB - T0)) ;
    if (!garant || t < TR) return PB;
    return PB + (1 - PB) * easeInOut(prog(t, TR, TEND - TR));
  };
  const EV = [
    { p: 0.2, s: 'relance', t: T0 + 1.25 },
    { p: PB, s: 'arbitre, débloque', t: TB + 0.25 },
    { p: 1, s: 'rend compte', t: TEND + 0.2 },
  ];

  function person(parent, cx, floor, k, fill) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 62 * k, r: 14 * k, fill }, g);
    el('path', { d: `M ${cx - 24 * k} ${floor} L ${cx - 24 * k} ${floor - 22 * k} Q ${cx - 24 * k} ${floor - 42 * k} ${cx} ${floor - 42 * k} Q ${cx + 24 * k} ${floor - 42 * k} ${cx + 24 * k} ${floor - 22 * k} L ${cx + 24 * k} ${floor} Z`, fill }, g);
    // badge A sur la poitrine
    el('circle', { cx, cy: floor - 18 * k, r: 11 * k, fill: C.white }, g);
    text(g, cx, floor - 12 * k, 'A', { size: 16 * k, weight: 800, fill, anchor: 'middle' });
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Garant,', 'pas approbateur.');
    G.blogChapeau('Même tâche, même blocage en semaine 2. Seule la lecture du A change.');

    LANES.forEach(Ln => {
      const top = Ln.top, gar = Ln.garant;
      const L = { ...Ln, floor: top + 170, barY: top + 186 };
      G.card(40, top, 1120, 284);
      L.head = el('g');
      G.pill(L.head, 64, top + 44, gar ? 'A = garant' : 'A = approbateur', { size: 21, h: 38, bg: gar ? C.pGreen : C.pRed, fg: gar ? C.tGreen : C.tRed });
      const pr = G.para(L.head, 64, top + 98, gar ? 'répond du résultat, y compris quand la tâche n’est pas faite' : 'signe à la fin, si on lui présente un livrable', 240, { size: 18, weight: 500, fill: C.ink, lh: 1.3 });
      text(L.head, 64, top + 250, 'Modifier le standard', { size: 17, weight: 700, fill: C.ink });

      // Barre de la tâche, semaines, blocage
      L.track = el('g');
      el('rect', { x: BX0, y: L.barY - 12, width: BX1 - BX0, height: 24, rx: 12, fill: C.pLav }, L.track);
      ['S1', 'S2', 'S3'].forEach((s, i) => text(L.track, bx((i + 0.5) / 3), L.barY + 40, s, { size: 17, weight: 600, fill: C.ink, anchor: 'middle' }));
      L.fill = el('rect', { x: BX0, y: L.barY - 12, width: 0, height: 24, rx: 12, fill: gar ? C.green : C.lightBlue });
      L.wall = el('g');
      el('rect', { x: bx(PB) - 8, y: L.barY - 34, width: 16, height: 68, rx: 5, fill: C.red }, L.wall);
      text(L.wall, bx(PB), L.barY + 66, 'blocage', { size: 17, weight: 700, fill: C.tRed, anchor: 'middle' });
      L.wallGhost = el('rect', { x: bx(PB) - 8, y: L.barY - 34, width: 16, height: 68, rx: 5, fill: 'none', stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '4 4', opacity: 0 });

      if (!gar) {
        // L'approbateur attend au bout, avec la feuille à signer
        L.person = el('g');
        person(L.person, 1062, L.floor, 1.0, C.violet);
        el('rect', { x: 1092, y: L.floor - 62, width: 30, height: 38, rx: 4, fill: C.white, stroke: C.violet, 'stroke-width': 2.5 }, L.person);
        el('line', { x1: 1098, y1: L.floor - 34, x2: 1116, y2: L.floor - 34, stroke: C.violet, 'stroke-width': 2 }, L.person);
        L.stuck = el('g');
        G.pill(L.stuck, bx(PB), top + 64, 'bloquée', { size: 18, h: 32, bg: C.red, fg: C.white, anchor: 'middle' });
        L.end = el('g');
        G.pill(L.end, 1040, top + 44, 'Rien à signer', { size: 19, h: 36, bg: C.pRed, fg: C.tRed, icon: 'cross', anchor: 'middle' });
      } else {
        // Le garant accompagne la tâche
        L.person = person(G.svg, 0, L.floor, 1.0, C.tGreen);
        L.evs = EV.map(e => {
          const g = el('g');
          const p = G.pill(g, bx(e.p), top + 64, e.s, { size: 18, h: 32, bg: C.tGreen, fg: C.white, anchor: 'middle' });
          fit(p.g, 1140, `évènement ${e.s}`);
          return { ...e, g };
        });
      }
      S.lanes.push(L);
    });

    S.chute = G.blogChute('Être accountable, c’est devoir répondre du résultat.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    S.lanes.forEach((L, li) => {
      rise(L.head, t, 1.75 + 0.2 * li, 0.35);
      pop(L.track, t, 1.9 + 0.2 * li, (BX0 + BX1) / 2, L.barY);
      const p = progress(L.garant, t);
      L.fill.setAttribute('width', Math.max(0.001, bx(p) - BX0));
      L.fill.setAttribute('opacity', o0);
      // Le blocage apparaît en semaine 2 ; seul le garant le lève
      const wIn = live ? clamp(prog(t, TB - 0.3, 0.3)) : 1;
      const wOut = L.garant ? (live ? clamp(prog(t, TB + 0.7, 0.3)) : 1) : 0;
      L.wall.setAttribute('opacity', (live ? wIn : o0) * (1 - wOut));
      if (live && t >= TB - 0.3 && t < TB + 0.4) pulse(L.wall, t, TB - 0.3, bx(PB), L.barY, 0.15, 0.4);
      else L.wall.setAttribute('transform', '');
      L.wallGhost.setAttribute('opacity', live ? wOut : L.garant ? o0 : 0);

      if (!L.garant) {
        pop(L.person, t, 2.1, 1062, L.floor - 40);
        pop(L.stuck, t, TB + 0.9, bx(PB), L.top + 64);
        pop(L.end, t, TEND + 0.4, 1040, L.top + 44);
        // L'approbateur attend : petites pulsations pendant que la tâche est bloquée
        if (live && t >= TB + 1.2 && t < TEND) pulse(L.person, t, TB + 1.2 + Math.floor((t - TB - 1.2) / 1.2) * 1.2, 1062, L.floor - 40, 0.04, 0.5);
      } else {
        // Le garant suit la tâche, s'arrête au blocage pour le lever
        const x = bx(p) - 26;
        const pp = live ? prog(t, 2.3, 0.35) : 1;
        const sc = pp <= 0 ? 0.001 : pp >= 1 ? 1 : 0.6 + 0.4 * back(pp);
        L.person.setAttribute('transform', `translate(${Math.max(BX0 - 20, x)} 0)` + (sc === 1 ? '' : ` translate(0 ${L.floor}) scale(${sc}) translate(0 ${-L.floor})`));
        L.person.setAttribute('opacity', live ? clamp(pp / 0.4) : o0);
        L.evs.forEach(e => pop(e.g, t, e.t, bx(e.p), L.top + 64));
      }
    });
    rise(S.chute, t, TEND + 1.1, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
