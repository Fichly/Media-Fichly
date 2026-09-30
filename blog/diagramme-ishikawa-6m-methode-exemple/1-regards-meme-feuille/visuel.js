// Blog · Diagramme d'Ishikawa · section « Diagramme d'Ishikawa : définition et principe »
// Mécanique : l'arête de poisson se trace (flèche vers l'effet, une branche par famille), puis trois métiers
// apportent chacun leurs causes. Pendant le tour d'un métier, seules les familles qu'il voit restent allumées :
// chacun voit deux familles sur six ; ensemble, la feuille couvre les six. Le résultat : des hypothèses à vérifier.
// Hypothèse : la répartition des causes entre les trois métiers est illustrative (l'article ne dit pas qui voit quoi).
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const SPINE = { x0: 70, x1: 874, y: 505 };
  const JX = [350, 600, 850];            // jonctions des branches sur l'arête
  const DX = 100, DY = 187;              // pente des branches
  const NOTE = { w: 196, dy: 100 };      // notes : centrées 100 px au-dessus / au-dessous de l'arête
  const FAM = [
    { name: 'Main d’œuvre', j: 0, up: true },
    { name: 'Matière', j: 1, up: true },
    { name: 'Matériel', j: 2, up: true },
    { name: 'Méthode', j: 0, up: false },
    { name: 'Milieu', j: 1, up: false },
    { name: 'Mesure', j: 2, up: false },
  ];
  const PEOPLE = [
    { name: 'Le régleur', sees: 'voit la machine', color: C.blue, x0: 64, fams: [2, 3],
      notes: ['Usure de l’outil coupant', 'Deux versions de la gamme'] },
    { name: 'Le contrôleur', sees: 'voit la mesure', color: C.teal, x0: 392, fams: [5, 1],
      notes: ['Critère interprété différemment', 'Changement de lot fournisseur'] },
    { name: 'L’opérateur de nuit', sees: 'voit ce que personne ne voit le jour', color: C.violet, x0: 720, fams: [0, 4],
      notes: ['Geste de reprise transmis oralement', 'Éclairage du poste de contrôle'] },
  ];
  const TURN = k => 4.2 + 2.3 * k, TURN_D = 2.3;
  const FLY = [0.35, 0.95], FLY_D = 0.6;
  const S = {};

  function person(parent, cx, floor, color) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 50, r: 12, fill: color }, g);
    el('path', { d: `M ${cx - 20} ${floor} L ${cx - 20} ${floor - 18} Q ${cx - 20} ${floor - 34} ${cx} ${floor - 34} Q ${cx + 20} ${floor - 34} ${cx + 20} ${floor - 18} L ${cx + 20} ${floor} Z`, fill: color }, g);
    return g;
  }
  // Note autocollante : fond jaune pâle, bande de la couleur du métier, texte sur deux lignes
  function note(parent, str, color) {
    const g = el('g', {}, parent);
    const r = el('rect', { x: 0, y: 0, width: NOTE.w, height: 58, rx: 8, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 1.5 }, g);
    el('rect', { x: 0, y: 0, width: 7, height: 58, rx: 3, fill: color }, g);
    const p = G.para(g, 18, 24, str, NOTE.w - 28, { size: 16, weight: 500, fill: C.ink, lh: 1.25 });
    if (p.n === 1) p.t.setAttribute('y', 34);
    fit(p.t, NOTE.w - 8, `note « ${str} »`);
    if (p.n > 2) console.error(`Note sur ${p.n} lignes : ${str}`);
    return { g, r };
  }
  const branchX = (f, y) => JX[f.j] - DX * Math.abs(SPINE.y - y) / DY;

  function build() {
    G.templateBlog();
    G.blogTitle('Tous les regards,', 'une feuille.');
    G.blogChapeau('Un effet a rarement une cause unique, et chaque métier n’en voit qu’une partie.');
    G.card(40, 176, 1120, 584);

    // Les trois métiers
    S.people = PEOPLE.map((p, i) => {
      const g = el('g');
      const icon = person(g, p.x0 + 26, 262, p.color);
      const n = text(g, p.x0 + 60, 228, p.name, { size: 19, weight: 700, fill: p.color });
      const s = text(g, p.x0 + 60, 254, p.sees, { size: 16, weight: 500, fill: C.ink });
      fit(s, 1140, `métier ${i}`);
      return { ...p, g, icon, cx: p.x0 + 26, cy: 230 };
    });

    // Arête : flèche vers l'effet
    S.spine = G.arrow(G.svg, `M ${SPINE.x0} ${SPINE.y} L ${SPINE.x1} ${SPINE.y}`, { width: 6, head: 16, stroke: C.ink });
    S.effect = el('g');
    el('rect', { x: 886, y: 440, width: 254, height: 130, rx: 18, fill: C.pRed, stroke: C.red, 'stroke-width': 2.5 }, S.effect);
    text(S.effect, 1013, 470, 'Effet', { size: 16, weight: 600, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 1013, 502, 'Taux de rebut', { size: 23, weight: 800, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 1013, 530, 'en hausse', { size: 23, weight: 800, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 1013, 556, 'référence la plus produite', { size: 15, weight: 500, fill: C.tRed, anchor: 'middle' });

    // Branches, familles, emplacements des notes
    S.fam = FAM.map((f, i) => {
      const g = el('g');
      const yEnd = f.up ? SPINE.y - DY : SPINE.y + DY;
      const x0 = JX[f.j] - DX;
      const line = el('line', { x1: x0, y1: yEnd, x2: JX[f.j], y2: SPINE.y, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      const len = Math.hypot(DX, DY);
      line.setAttribute('stroke-dasharray', `${len} ${len}`);
      const pillG = el('g', {}, g);
      const py = f.up ? yEnd - 17 : yEnd + 17;
      const pl = G.pill(pillG, x0, py, f.name, { size: 18, h: 34, bg: C.pLav, fg: C.blue, anchor: 'middle' });
      const ny = f.up ? SPINE.y - NOTE.dy : SPINE.y + NOTE.dy;
      const nx = branchX(f, f.up ? ny - 29 : ny + 29) - 14 - NOTE.w;   // bord le plus éloigné de l'arête
      return { ...f, g, line, len, pillG, pill: pl, px: x0, py, nx, ny: ny - 29, note: null };
    });

    // Notes (une par famille), rattachées au métier qui les apporte
    PEOPLE.forEach((p, k) => p.fams.forEach((fi, m) => {
      const n = note(G.svg, p.notes[m], p.color);
      S.fam[fi].note = { ...n, k, m, color: p.color };
    }));
    S.fam.forEach((f, i) => { if (f.nx < 50) console.error(`Débordement : note ${i} à gauche (${Math.round(f.nx)})`); });

    // Compteur de familles couvertes
    S.counter = el('g');
    text(S.counter, 1013, 614, 'Familles couvertes', { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });
    S.count = text(S.counter, 1013, 660, '', { size: 38, weight: 800, fill: C.blue, anchor: 'middle' });
    S.hyp = el('g');
    G.pill(S.hyp, 1013, 712, 'des hypothèses à vérifier', { size: 16, h: 34, pad: 12, bg: C.pYellow, fg: C.tYellow, anchor: 'middle' });

    S.chute = G.blogChute('Le diagramme met ces regards sur la même feuille.', { y: 808 });
  }

  // Arrivée de la note de la famille fi
  const arrive = f => TURN(f.note.k) + FLY[f.note.m];

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    pop(S.effect, t, 1.7, 1013, 505);
    // Arête qui se dessine vers l'effet
    const qs = live ? easeInOut(prog(t, 1.95, 0.55)) : 1;
    S.spine.draw(qs);
    S.spine.g.setAttribute('opacity', live ? (qs > 0 ? 1 : 0) : o);

    S.fam.forEach((f, i) => {
      const t0 = 2.5 + 0.1 * i;
      const q = live ? easeOut(prog(t, t0, 0.4)) : 1;
      f.line.setAttribute('stroke-dashoffset', f.len * (1 - q));
      // Atténuation : pendant le tour d'un métier, les familles qu'il ne voit pas s'effacent
      let dim = 0;
      PEOPLE.forEach((p, k) => { if (!p.fams.includes(i)) dim += window01(t, TURN(k), TURN(k) + TURN_D, 0.3); });
      const bo = live ? 1 - 0.72 * clamp(dim) : o;
      f.g.setAttribute('opacity', bo * (live ? (q > 0 ? 1 : 0) : 1));
      // Pastille de famille : apparaît au bout de la branche, prend la couleur du métier à l'arrivée de la note
      const pp = live ? prog(t, t0 + 0.3, 0.35) : 1;
      const sc = pp <= 0 ? 0.001 : pp >= 1 ? 1 : 0.6 + 0.4 * G.back(pp);
      f.pillG.setAttribute('transform', sc === 1 ? '' : `translate(${f.px} ${f.py}) scale(${sc}) translate(${-f.px} ${-f.py})`);
      const a = arrive(f) + FLY_D;
      const hot = live && t >= a - 0.1 && t < TURN(f.note.k) + TURN_D;
      f.pill.g.querySelector('rect').setAttribute('fill', hot ? f.note.color : C.pLav);
      f.pill.tx.setAttribute('fill', hot ? C.white : C.blue);

      // Note : vole du métier vers sa branche
      const n = f.note, P = S.people[n.k];
      let x = f.nx, y = f.ny, s = 1, no = bo;
      if (live) {
        const p = prog(t, arrive(f), FLY_D);
        if (p <= 0) no = 0;
        else {
          const e = easeInOut(p);
          const sx = P.cx - NOTE.w / 2, sy = P.cy - 29;
          x = sx + (f.nx - sx) * e;
          y = sy + (f.ny - sy) * e - 60 * Math.sin(Math.PI * p);
          s = 0.5 + 0.5 * easeOut(p);
          no = p < 1 ? clamp(p / 0.2) : bo;
        }
      }
      n.g.setAttribute('transform', `translate(${x} ${y})` + (s === 1 ? '' : ` scale(${s})`));
      n.g.setAttribute('opacity', no);
    });

    // Métiers : apparition, puis mise en avant pendant leur tour
    S.people.forEach((p, k) => {
      pop(p.g, t, 3.4 + 0.15 * k, p.cx + 80, 240);
      if (live && t >= TURN(k) - 0.1 && t < TURN(k) + 0.7) pulse(p.icon, t, TURN(k), p.cx, 240, 0.15, 0.5);
      else p.icon.setAttribute('transform', '');
      const w = window01(t, TURN(0), TURN(2) + TURN_D, 0.3);
      const act = window01(t, TURN(k), TURN(k) + TURN_D, 0.3);
      if (live && w > 0) p.g.setAttribute('opacity', Math.min(Number(p.g.getAttribute('opacity')), 1 - 0.6 * w + 0.6 * act));
    });

    // Compteur
    pop(S.counter, t, 3.8, 1013, 640);
    const covered = live ? S.fam.filter(f => t >= arrive(f) + FLY_D * 0.8).length : 6;
    S.count.textContent = `${covered}${NB}/${NB}6`;
    S.count.setAttribute('fill', covered === 6 ? C.tGreen : C.blue);
    const last = Math.max(-9, ...S.fam.map(f => arrive(f) + FLY_D * 0.8).filter(a => live && a <= t));
    pulse(S.count, t, last, 1013, 648, 0.12, 0.4);

    pop(S.hyp, t, TURN(2) + TURN_D + 0.2, 1013, 712);
    rise(S.chute, t, TURN(2) + TURN_D + 1.0, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
