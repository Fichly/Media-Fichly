// Blog · Diagramme d'Ishikawa · section « Mener une séance d'Ishikawa en 6 étapes »
// Mécanique : la séance ouvre large puis resserre. Support préparé (effet écrit, branches tracées), groupe réuni,
// notes écrites en vrac sans classement, rangées sur les branches (une cause qui hésite se pose sur deux familles),
// une cause creusée d'un cran, puis vote pondéré (trois voix chacun) : trois causes candidates ressortent en rouge.
// Hypothèses : répartition des voix illustrative (6, 5, 4, 2, 1 sur 18), « conditions de stockage » posée sur Matière et Milieu.
// Rendu déterministe : window.FICHE.draw(t), boucle de 18 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;

  const SPINE = { x0: 70, x1: 884, y: 470 };
  const JX = [340, 600, 860];
  const DX = 100, DY = 180;
  const NW = 180, NH = 50;
  const FAM = [
    { name: 'Main d’œuvre', j: 0, up: true }, { name: 'Matière', j: 1, up: true }, { name: 'Matériel', j: 2, up: true },
    { name: 'Méthode', j: 0, up: false }, { name: 'Milieu', j: 1, up: false }, { name: 'Mesure', j: 2, up: false },
  ];
  // row : 0 = près de l'arête, 1 = loin
  const NOTES = [
    { txt: 'Nouvel opérateur de nuit', fam: 0, row: 1 },
    { txt: 'Critère interprété différemment', fam: 5, row: 0, votes: 6 },
    { txt: 'Usure de l’outil coupant', fam: 2, row: 1, votes: 1 },
    { txt: 'Conditions de stockage', fam: 1, row: 0, dup: { fam: 4, row: 1 } },
    { txt: 'Deux versions de la gamme', fam: 3, row: 1, votes: 5 },
    { txt: 'Geste de reprise transmis oralement', fam: 0, row: 0 },
    { txt: 'Éclairage du poste de contrôle', fam: 4, row: 0 },
    { txt: 'Le réglage n’est pas bon', fam: 3, row: 0, deep: 'Réglage repris sans repère physique', votes: 2 },
    { txt: 'Changement de lot fournisseur', fam: 1, row: 1, votes: 4 },
    { txt: 'Étalonnage du calibre', fam: 5, row: 1 },
    { txt: 'Jeu apparu sur le bridage', fam: 2, row: 0 },
  ];
  const STEPS = ['Effet', 'Groupe', 'Lister', 'Ranger', 'Creuser', 'Retenir'];
  const T = { s1: 1.8, s2: 3.0, s3: 3.9, s4: 5.9, s5: 8.8, s6: 11.6, end: 14.6 };
  const STEP_T = [T.s1, T.s2, T.s3, T.s4, T.s5, T.s6];
  const CAPTIONS = [
    'Support préparé : l’effet écrit comme un écart, les branches tracées.',
    'Six à huit personnes, dont au moins une qui fait le geste tous les jours.',
    'Une cause par note, sans discussion et sans filtre.',
    'Une cause qui hésite entre deux familles se pose sur les deux.',
    'Pour chaque cause : pourquoi celle-là se produit-elle ?',
    'Vote pondéré, trois voix chacun : deux ou trois causes, jamais dix.',
  ];
  const APPEAR = i => T.s3 + 0.13 * i;
  const FLY = i => T.s4 + 0.2 * i, FLY_D = 0.55;
  const DUP_T = FLY(3) + FLY_D + 0.15;
  const CALL = { open: T.s5 + 0.1, why: T.s5 + 0.6, deep: T.s5 + 1.1, close: T.s5 + 2.2, swap: T.s5 + 2.45 };
  const RED_T = T.s6 + 2.6;
  const S = {};

  // Générateur pseudo-aléatoire déterministe (position des notes en vrac)
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  const branchX = (f, y) => JX[f.j] - DX * Math.abs(SPINE.y - y) / DY;
  function slot(fam, row) {
    const f = FAM[fam];
    const cy = f.up ? (row ? 322 : 390) : (row ? 618 : 550);
    const far = f.up ? cy - NH / 2 : cy + NH / 2;
    const right = branchX(f, far) - 10;
    return { x: right - NW, y: cy - NH / 2 };
  }
  function person(parent, cx, floor, color) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 40, r: 10, fill: color }, g);
    el('path', { d: `M ${cx - 17} ${floor} L ${cx - 17} ${floor - 15} Q ${cx - 17} ${floor - 28} ${cx} ${floor - 28} Q ${cx + 17} ${floor - 28} ${cx + 17} ${floor - 15} L ${cx + 17} ${floor} Z`, fill: color }, g);
    return g;
  }
  function noteBody(parent, str) {
    const g = el('g', {}, parent);
    const r = el('rect', { x: 0, y: 0, width: NW, height: NH, rx: 7, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 1.5 }, g);
    const p = G.para(g, 10, 21, str, NW - 20, { size: 15, weight: 500, fill: C.ink, lh: 1.25 });
    if (p.n === 1) p.t.setAttribute('y', 30);
    if (p.n > 2) console.error(`Note sur ${p.n} lignes : ${str}`);
    fit(p.t, NW - 4, `note « ${str} »`);
    return { g, r, t: p.t };
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Tout lister,', 'en retenir trois.');
    G.blogChapeau('Une séance d’Ishikawa en six étapes : on ouvre large, puis on resserre.');
    G.card(40, 176, 1120, 584);

    // Barre des étapes
    S.steps = STEPS.map((s, i) => {
      const g = el('g');
      const x = 64 + i * 180, y = 212;
      const bg = el('rect', { x, y: y - 19, width: 168, height: 38, rx: 19, fill: C.pLav }, g);
      const c = el('circle', { cx: x + 20, cy: y, r: 14, fill: C.blue }, g);
      const n = text(g, x + 20, y + 5.5, String(i + 1), { size: 15, weight: 700, fill: C.white, anchor: 'middle' });
      const l = text(g, x + 44, y + 6.5, s, { size: 18, weight: 700, fill: C.blue });
      fit(l, x + 162, `étape ${i + 1}`);
      return { g, bg, c, n, l, cx: x + 84, cy: y };
    });

    // Support : effet et arête
    S.effect = el('g');
    el('rect', { x: 898, y: 392, width: 242, height: 156, rx: 18, fill: C.pRed, stroke: C.red, 'stroke-width': 2.5 }, S.effect);
    text(S.effect, 1019, 426, 'Taux de rebut', { size: 21, weight: 800, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 1019, 452, 'en hausse', { size: 21, weight: 800, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 1019, 482, 'depuis le passage', { size: 15, weight: 500, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 1019, 502, 'en trois équipes, sur la', { size: 15, weight: 500, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 1019, 522, 'référence la plus courante', { size: 15, weight: 500, fill: C.tRed, anchor: 'middle' });
    S.spine = G.arrow(G.svg, `M ${SPINE.x0} ${SPINE.y} L ${SPINE.x1} ${SPINE.y}`, { width: 6, head: 16, stroke: C.ink });
    S.fam = FAM.map(f => {
      const g = el('g');
      const yEnd = f.up ? SPINE.y - DY : SPINE.y + DY;
      const x0 = JX[f.j] - DX, len = Math.hypot(DX, DY);
      const line = el('line', { x1: x0, y1: yEnd, x2: JX[f.j], y2: SPINE.y, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': `${len} ${len}` }, g);
      const pg = el('g', {}, g);
      const py = f.up ? yEnd - 17 : yEnd + 17;
      G.pill(pg, x0, py, f.name, { size: 17, h: 34, bg: C.pLav, fg: C.blue, anchor: 'middle' });
      return { ...f, g, line, len, pg, px: x0, py };
    });

    // Groupe
    S.group = el('g');
    text(S.group, 1019, 598, 'Le groupe', { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
    S.heads = [];
    for (let i = 0; i < 6; i++) {
      const cx = 954 + (i % 3) * 65, floor = i < 3 ? 654 : 712;
      const color = i === 4 ? C.green : C.blue;
      person(S.group, cx, floor, color);
      S.heads.push({ x: cx, y: floor - 30 });
    }
    text(S.group, 1019, 742, 'en vert : au poste', { size: 15, weight: 500, fill: C.tGreen, anchor: 'middle' });

    // Notes : position en vrac, puis emplacement sur sa branche
    S.notes = NOTES.map((n, i) => {
      const b = noteBody(G.svg, n.txt);
      if (n.deep) {
        b.t2 = G.para(b.g, 10, 21, n.deep, NW - 20, { size: 15, weight: 500, fill: C.ink, lh: 1.25 }).t;
        fit(b.t2, NW - 4, 'note creusée');
      }
      // En vrac : grille lâche 4 × 3, décalages et rotations aléatoires (déterministes)
      const cell = [0, 5, 10, 3, 6, 9, 1, 11, 4, 7, 2][i];
      const pile = { x: 96 + (cell % 4) * 190 + (rnd() - 0.5) * 22, y: 300 + Math.floor(cell / 4) * 118 + (rnd() - 0.5) * 40, r: (rnd() - 0.5) * 16 };
      return { ...n, ...b, i, pile, slot: slot(n.fam, n.row) };
    });
    // Copie de la note qui hésite entre deux familles
    const src = S.notes.find(n => n.dup);
    S.dup = { ...noteBody(G.svg, src.txt), from: src.slot, slot: slot(src.dup.fam, src.dup.row) };
    S.link = el('line', { stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '6 6', opacity: 0 });
    S.link.setAttribute('x1', src.slot.x + NW / 2); S.link.setAttribute('y1', src.slot.y + NH);
    S.link.setAttribute('x2', S.dup.slot.x + NW / 2); S.link.setAttribute('y2', S.dup.slot.y);

    // Loupe de l'étape 5 : une cause creusée d'un cran
    S.call = el('g');
    el('rect', { x: 250, y: 360, width: 560, height: 210, rx: 20, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, S.call);
    S.callOld = text(S.call, 530, 404, '« Le réglage n’est pas bon »', { size: 21, weight: 700, fill: C.ink, anchor: 'middle' });
    S.callStrike = el('line', { x1: 380, y1: 397, x2: 680, y2: 397, stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.call);
    S.callWhy = el('g', {}, S.call);
    G.arrow(S.callWhy, 'M 530 418 L 530 456', { width: 3.5, head: 10 });
    G.pill(S.callWhy, 548, 437, 'pourquoi ?', { size: 17, h: 30, pad: 12, bg: C.pLav, fg: C.blue });
    S.callNew = el('g', {}, S.call);
    text(S.callNew, 530, 492, 'Le réglage est repris à chaque changement', { size: 20, weight: 700, fill: C.tGreen, anchor: 'middle' });
    text(S.callNew, 530, 520, 'de série, sans point de repère physique.', { size: 20, weight: 700, fill: C.tGreen, anchor: 'middle' });
    text(S.callNew, 530, 552, 'Une description devient une cause vérifiable.', { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });

    // Voix : trois par personne, calculées au chargement
    S.dots = [];
    const voted = S.notes.filter(n => n.votes);
    let k = 0;
    voted.forEach(n => { for (let v = 0; v < n.votes; v++) { S.dots.push({ n, v, head: S.heads[k % 6], t0: T.s6 + 0.2 + 0.11 * k, c: el('circle', { r: 6, fill: C.blue, stroke: C.white, 'stroke-width': 1.5 }) }); k++; } });
    S.cands = voted.filter(n => n.votes >= 4);

    // Légende de l'étape en cours
    S.caps = CAPTIONS.map((c, i) => { const tx = text(G.svg, 64, 734, c, { size: 18, weight: 500, fill: C.ink }); fit(tx, 880, `légende ${i + 1}`); return tx; });

    S.chute = G.blogChute('La séance produit des hypothèses, pas des conclusions.', { y: 808 });
  }

  // 7 = toutes les étapes faites (image complète et fin de boucle)
  const stepAt = t => (t < FADE_END || t >= T.end ? 7 : STEP_T.filter(s => t >= s).length);

  function place(g, x, y, r = 0, s = 1) {
    g.setAttribute('transform', `translate(${x} ${y})` + (r ? ` rotate(${r} ${NW / 2} ${NH / 2})` : '') + (s !== 1 ? ` scale(${s})` : ''));
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const step = stepAt(t);

    // Barre des étapes : faite (vert), en cours (bleu plein), à venir (lavande)
    S.steps.forEach((s, i) => {
      pop(s.g, t, 1.7 + 0.06 * i, s.cx, s.cy);
      const done = !live || i + 1 < step, cur = live && i + 1 === step;
      s.bg.setAttribute('fill', done ? C.pGreen : cur ? C.blue : C.pLav);
      s.c.setAttribute('fill', done ? C.green : cur ? C.white : C.blue);
      s.n.setAttribute('fill', cur ? C.blue : C.white);
      s.l.setAttribute('fill', done ? C.tGreen : cur ? C.white : C.blue);
    });
    S.caps.forEach((c, i) => c.setAttribute('opacity', live ? window01(t, STEP_T[i] + 0.15, i < 5 ? STEP_T[i + 1] : 99, 0.25) : (i === 5 ? o : 0)));

    // Étape 1 : effet, arête, branches
    pop(S.effect, t, T.s1 + 0.1, 1019, 470);
    const qs = live ? easeInOut(prog(t, T.s1 + 0.3, 0.5)) : 1;
    S.spine.draw(qs);
    S.spine.g.setAttribute('opacity', live ? (qs > 0 ? 1 : 0) : o);
    S.fam.forEach((f, i) => {
      const t0 = T.s1 + 0.7 + 0.08 * i;
      const q = live ? easeOut(prog(t, t0, 0.35)) : 1;
      f.line.setAttribute('stroke-dashoffset', f.len * (1 - q));
      f.g.setAttribute('opacity', live ? (q > 0 ? 1 : 0) : o);
      const pp = live ? prog(t, t0 + 0.25, 0.3) : 1;
      const sc = pp <= 0 ? 0.001 : pp >= 1 ? 1 : 0.6 + 0.4 * G.back(pp);
      f.pg.setAttribute('transform', sc === 1 ? '' : `translate(${f.px} ${f.py}) scale(${sc}) translate(${-f.px} ${-f.py})`);
    });

    // Étape 2 : le groupe
    pop(S.group, t, T.s2 + 0.1, 1019, 660);

    // Étapes 3 et 4 : notes en vrac, puis rangées
    S.notes.forEach(n => {
      let x = n.slot.x, y = n.slot.y, r = 0, s = 1, no = o;
      if (live) {
        const pa = prog(t, APPEAR(n.i), 0.3);
        const pf = prog(t, FLY(n.i), FLY_D);
        if (pa <= 0) no = 0;
        else if (pf <= 0) {
          x = n.pile.x; y = n.pile.y; r = n.pile.r; s = 0.6 + 0.4 * G.back(pa); no = clamp(pa / 0.4);
        } else {
          const e = easeInOut(pf);
          x = n.pile.x + (n.slot.x - n.pile.x) * e;
          y = n.pile.y + (n.slot.y - n.pile.y) * e - 40 * Math.sin(Math.PI * pf);
          r = n.pile.r * (1 - e);
        }
      }
      place(n.g, x, y, r, s);
      n.g.setAttribute('opacity', no);
      // Note creusée : l'ancien texte cède la place au nouveau
      if (n.deep) {
        const sw = live ? prog(t, CALL.swap, 0.3) : 1;
        n.t.setAttribute('opacity', 1 - sw);
        n.t2.setAttribute('opacity', sw);
      }
      // Candidates : passent en rouge après le vote
      const red = n.votes >= 4 && (!live || t >= RED_T);
      n.r.setAttribute('fill', red ? C.pRed : C.pYellow);
      n.r.setAttribute('stroke', red ? C.red : C.yellow);
      n.r.setAttribute('stroke-width', red ? 3 : 1.5);
      n.t.setAttribute('fill', red ? C.tRed : C.ink);
    });
    // La copie part de Matière vers Milieu
    {
      const d = S.dup;
      let x = d.slot.x, y = d.slot.y, no = o;
      if (live) {
        const p = prog(t, DUP_T, 0.6);
        if (p <= 0) no = 0;
        else { const e = easeInOut(p); x = d.from.x + (d.slot.x - d.from.x) * e; y = d.from.y + (d.slot.y - d.from.y) * e; }
      }
      place(d.g, x, y);
      d.g.setAttribute('opacity', no);
      S.link.setAttribute('opacity', live ? 0.9 * window01(t, DUP_T + 0.5, T.s5 - 0.1, 0.3) : 0);
    }
    // Pastille de famille : petite pulsation à l'arrivée d'une note
    S.fam.forEach((f, i) => {
      const arr = S.notes.filter(n => n.fam === i).map(n => FLY(n.i) + FLY_D).concat(S.notes.some(n => n.dup && n.dup.fam === i) ? [DUP_T + 0.6] : []);
      const last = Math.max(-9, ...arr.filter(a => live && a <= t));
      pulse(f.pg, t, last, f.px, f.py, 0.12, 0.35);
    });

    // Étape 5 : la loupe
    const co = live ? window01(t, CALL.open, CALL.close + 0.3, 0.3) : 0;
    S.call.setAttribute('opacity', co);
    S.callWhy.setAttribute('opacity', live ? clamp(prog(t, CALL.why, 0.3)) : 0);
    S.callNew.setAttribute('opacity', live ? clamp(prog(t, CALL.deep, 0.3)) : 0);
    S.callStrike.setAttribute('opacity', live ? clamp(prog(t, CALL.deep, 0.3)) : 0);
    const deepNote = S.notes.find(n => n.deep);
    if (live && t >= CALL.swap - 0.1 && t < CALL.swap + 0.8) {
      const p = prog(t, CALL.swap, 0.45);
      const s = p > 0 && p < 1 ? 1 + 0.1 * Math.sin(Math.PI * p) : 1;
      place(deepNote.g, deepNote.slot.x - (s - 1) * NW / 2, deepNote.slot.y - (s - 1) * NH / 2, 0, s);
    }

    // Étape 6 : les voix
    S.dots.forEach(d => {
      const tx = d.n.slot.x + 14 + 14 * d.v, ty = d.n.slot.y - 1;
      let x = tx, y = ty, dop = o;
      if (live) {
        const p = prog(t, d.t0, 0.5);
        if (p <= 0) dop = 0;
        else { const e = easeInOut(p); x = d.head.x + (tx - d.head.x) * e; y = d.head.y + (ty - d.head.y) * e - 50 * Math.sin(Math.PI * p); }
      }
      d.c.setAttribute('cx', x); d.c.setAttribute('cy', y); d.c.setAttribute('opacity', dop);
    });
    S.cands.forEach(n => {
      if (live && t >= RED_T - 0.1 && t < RED_T + 0.8) {
        const p = prog(t, RED_T, 0.45);
        const s = p > 0 && p < 1 ? 1 + 0.12 * Math.sin(Math.PI * p) : 1;
        place(n.g, n.slot.x - (s - 1) * NW / 2, n.slot.y - (s - 1) * NH / 2, 0, s);
      }
    });

    rise(S.chute, t, T.end + 0.3, 0.45);
  }

  G.start({ duration: 18, build, draw });
})();
