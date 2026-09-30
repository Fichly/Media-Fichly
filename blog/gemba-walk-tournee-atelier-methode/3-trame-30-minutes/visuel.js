// Blog · Gemba · section « La trame d'une tournée de trente minutes »
// Mécanique : la frise du bas (5 min au bureau, 30 min sur le terrain, 10 min au bureau) pilote la scène du haut.
// L'observateur relit ses constats, descend, reste à un endroit fixe le temps d'un cycle, suit une pièce de bout
// en bout, pose ses questions au poste, restitue sur place et se fait corriger, puis remonte écrire ses constats.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const MFLOOR = 396, OFLOOR = 482;
  const MX = [262, 482, 702, 922];            // postes (bord gauche des machines, 90 px de large)
  const BAR = { x: 64, w: 1072, y: 660, h: 18 };
  const PHASES = [
    { name: 'Avant', dur: 5, sub: '5 min', desk: true, cap: 'Relire les constats précédents, écrire son intention en une phrase.' },
    { name: 'Observer', dur: 5, sub: '0 à 5', cap: 'Rester à un endroit fixe, regarder un cycle complet, ne rien corriger.' },
    { name: 'Suivre le flux', dur: 10, sub: '5 à 15', cap: 'Suivre une pièce, ou un opérateur, de bout en bout.' },
    { name: 'Questions', dur: 10, sub: '15 à 25', cap: 'Interroger sur le travail, jamais sur la personne.' },
    { name: 'Restituer', dur: 5, sub: '25 à 30', cap: 'Redire ce qu’on a retenu, et faire corriger par l’équipe.' },
    { name: 'Après', dur: 10, sub: '10 min', desk: true, cap: 'Écrire les constats : lieu, heure, porteur, échéance.' },
  ];
  const T0 = 2.9, SPM = 0.25;                 // début de la frise, secondes par minute
  let acc = 0;
  PHASES.forEach(p => { p.m0 = acc; acc += p.dur; p.t0 = T0 + SPM * p.m0; p.t1 = T0 + SPM * acc; });
  const TEND = PHASES[5].t1;
  const PXM = BAR.w / acc;
  const phaseAt = t => (t < FADE_END ? 5 : t < PHASES[0].t0 ? -1 : PHASES.findIndex(p => t < p.t1) === -1 ? 5 : PHASES.findIndex(p => t < p.t1));
  // Positions de l'observateur (centre, au sol)
  const SPOT = { desk: 128, fixed: 420, q: 832 };
  const FOLLOW = [MX[0] + 45, MX[3] + 45];

  function person(parent, cx, floor, k = 1, fill = C.blue) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 62 * k, r: 14 * k, fill }, g);
    el('path', { d: `M ${cx - 24 * k} ${floor} L ${cx - 24 * k} ${floor - 22 * k} Q ${cx - 24 * k} ${floor - 42 * k} ${cx} ${floor - 42 * k} Q ${cx + 24 * k} ${floor - 42 * k} ${cx + 24 * k} ${floor - 22 * k} L ${cx + 24 * k} ${floor} Z`, fill }, g);
    return g;
  }
  function bubble(parent, x, y, w, s, tailX, fg, stroke) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${tailX - 10} ${y + 40} L ${tailX} ${y + 62} L ${tailX + 12} ${y + 40} Z`, fill: C.white, stroke, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    el('rect', { x, y, width: w, height: 44, rx: 14, fill: C.white, stroke, 'stroke-width': 2.5 }, g);
    el('rect', { x: tailX - 9, y: y + 38, width: 20, height: 6, fill: C.white }, g);
    fit(text(g, x + w / 2, y + 29, s, { size: 19, weight: 700, fill: fg, anchor: 'middle' }), x + w - 8, `bulle ${s}`, x + 8);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Trente minutes', 'sur le terrain.');
    G.blogChapeau('Se préparer en cinq minutes, observer trente, écrire en dix : la trame d’une tournée.');

    // ----- Carte du haut : la scène -----
    G.card(40, 176, 1120, 394);
    S.scene = el('g');
    // Bureau
    el('rect', { x: 64, y: 416, width: 150, height: 12, rx: 4, fill: C.ink }, S.scene);
    el('rect', { x: 74, y: 428, width: 8, height: 54, fill: C.ink }, S.scene);
    el('rect', { x: 196, y: 428, width: 8, height: 54, fill: C.ink }, S.scene);
    text(S.scene, 139, 508, 'Bureau', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
    // La ligne : quatre postes et leurs opérateurs
    el('line', { x1: 240, y1: MFLOOR + 2, x2: 1136, y2: MFLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.scene);
    S.machines = MX.map((x, i) => {
      person(S.scene, x + 118, MFLOOR, 0.85, C.lightBlue);
      const m = G.machine(S.scene, x, MFLOOR - 62, 0.5);
      text(S.scene, x + 45, MFLOOR + 26, `Poste ${i + 1}`, { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
      return m;
    });
    // Cartons en attente entre les postes
    MX.slice(0, 3).forEach(x => { G.carton(S.scene, x + 172, MFLOOR - 13, 0.8); });

    // Feuille de l'observateur au bureau (constats)
    S.sheet = el('g');
    el('rect', { x: 56, y: 198, width: 200, height: 136, rx: 12, fill: C.white, stroke: C.violet, 'stroke-width': 2.5 }, S.sheet);
    S.sheetTitle = text(S.sheet, 72, 230, '', { size: 17, weight: 700, fill: C.violet });
    S.sheetLines = [0, 1, 2].map(i => {
      el('circle', { cx: 78, cy: 262 + i * 28, r: 5, fill: C.violet }, S.sheet);
      return el('rect', { x: 92, y: 258 + i * 28, width: [124, 96, 112][i], height: 8, rx: 4, fill: C.violet, opacity: 0.55 }, S.sheet);
    });
    S.reading = el('rect', { x: 66, y: 249, width: 176, height: 26, rx: 6, fill: C.violet, opacity: 0 }, S.sheet);
    // Cycle observé (anneau autour du poste 2)
    S.ring = el('g');
    const rc = { x: MX[1] + 45, y: MFLOOR - 31 };
    el('circle', { cx: rc.x, cy: rc.y, r: 62, fill: 'none', stroke: C.pLav, 'stroke-width': 6 }, S.ring);
    S.ringArc = el('circle', { cx: rc.x, cy: rc.y, r: 62, fill: 'none', stroke: C.violet, 'stroke-width': 6, 'stroke-linecap': 'round', transform: `rotate(-90 ${rc.x} ${rc.y})` }, S.ring);
    S.ringLen = 2 * Math.PI * 62;
    S.ringLab = text(S.ring, rc.x, 290, 'un cycle complet', { size: 17, weight: 700, fill: C.violet, anchor: 'middle' });
    // Pièce suivie
    S.piece = el('g');
    G.carton(S.piece, 0, 0, 0.9);
    el('rect', { x: -19, y: -19, width: 38, height: 38, rx: 8, fill: 'none', stroke: C.violet, 'stroke-width': 3 }, S.piece);
    // Observateur
    S.obs = el('g');
    person(S.obs, 0, OFLOOR, 1.1, C.violet);
    // Bulles
    S.q1 = bubble(G.svg, 560, 206, 470, `Qu’est-ce qui vous a gêné depuis ce matin${NB}?`, SPOT.q - 10, C.violet, C.violet);
    S.q2 = bubble(G.svg, 540, 206, 510, `Comment savez-vous que la pièce est bonne${NB}?`, SPOT.q - 10, C.violet, C.violet);
    S.r1 = bubble(G.svg, 560, 206, 380, 'Si j’ai bien compris…', SPOT.q - 10, C.violet, C.violet);
    S.r2 = bubble(G.svg, 640, 272, 320, 'Pas tout à fait.', MX[2] + 118, C.blue, C.lightBlue);
    // Légende de la phase en cours (texte variable)
    S.capG = el('g');
    S.capPill = el('rect', { y: 532, height: 30, rx: 15, fill: C.blue }, S.capG);
    S.capName = text(S.capG, 0, 553, '', { size: 18, weight: 700, fill: C.white });
    S.cap = text(S.capG, 0, 554, '', { size: 19, weight: 500, fill: C.ink });

    // ----- Carte du bas : la frise -----
    G.card(40, 586, 1120, 174);
    S.frise = el('g');
    const xm = m => BAR.x + m * PXM;
    PHASES.forEach((p, i) => {
      el('rect', { x: xm(p.m0) + 1.5, y: BAR.y, width: p.dur * PXM - 3, height: BAR.h, rx: 6, fill: p.desk ? C.line : C.pLav }, S.frise);
      const cx = xm(p.m0 + p.dur / 2);
      fit(text(S.frise, cx, BAR.y + 44, p.name, { size: 17, weight: 700, fill: C.ink, anchor: 'middle' }), xm(p.m0 + p.dur) - 2, `phase ${i}`, xm(p.m0) + 2);
      text(S.frise, cx, BAR.y + 66, p.sub, { size: 17, weight: 500, fill: C.ink, anchor: 'middle' });
    });
    const brace = (m0, m1, s, col) => {
      el('path', { d: `M ${xm(m0) + 4} ${BAR.y - 12} L ${xm(m0) + 4} ${BAR.y - 22} L ${xm(m1) - 4} ${BAR.y - 22} L ${xm(m1) - 4} ${BAR.y - 12}`, fill: 'none', stroke: col, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, S.frise);
      text(S.frise, xm((m0 + m1) / 2), BAR.y - 32, s, { size: 17, weight: 700, fill: col, anchor: 'middle' });
    };
    brace(0, 5, 'au bureau', C.ink);
    brace(5, 35, `sur le terrain${NB}: 30 minutes`, C.blue);
    brace(35, 45, 'au bureau', C.ink);
    S.fillClip = G.clipRect(BAR.x, BAR.y - 2, 0, BAR.h + 4);
    const fg = el('g', { 'clip-path': S.fillClip.url }, S.frise);
    PHASES.forEach(p => el('rect', { x: xm(p.m0) + 1.5, y: BAR.y, width: p.dur * PXM - 3, height: BAR.h, rx: 6, fill: p.desk ? C.ink : C.blue }, fg));
    S.cursor = el('path', { d: 'M -9 0 L 9 0 L 0 12 Z', fill: C.red });

    S.chute = G.blogChute('Trente minutes suffisent, si les questions sont préparées.', { y: 808 });
  }

  function obsX(t) {
    const P = PHASES;
    const moves = [
      [P[1].t0 - 0.2, 0.5, SPOT.desk, SPOT.fixed],
      [P[2].t0, 0.35, SPOT.fixed, FOLLOW[0] - 60],
    ];
    if (t < P[1].t0 - 0.2) return SPOT.desk;
    if (t < P[1].t0 + 0.3) return SPOT.desk + (SPOT.fixed - SPOT.desk) * easeInOut(prog(t, P[1].t0 - 0.2, 0.5));
    if (t < P[2].t0) return SPOT.fixed;
    if (t < P[3].t0) return pieceX(t) - 60;
    if (t < P[3].t0 + 0.4) return FOLLOW[1] - 60 + (SPOT.q - FOLLOW[1] + 60) * easeInOut(prog(t, P[3].t0, 0.4));
    if (t < P[5].t0) return SPOT.q;
    return SPOT.q + (SPOT.desk - SPOT.q) * easeInOut(prog(t, P[5].t0, 0.7));
  }
  // La pièce suivie : de poste en poste pendant « Suivre le flux »
  function pieceX(t) {
    const p = PHASES[2];
    const q = prog(t, p.t0 + 0.1, p.t1 - p.t0 - 0.3);
    // arrêts devant chaque poste
    const seg = q * 3, i = Math.min(2, Math.floor(seg)), f = seg - i;
    const a = MX[i] + 45, b = MX[i + 1] + 45;
    return a + (b - a) * easeInOut(clamp((f - 0.35) / 0.65));
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    const ph = phaseAt(t);
    pop(S.scene, t, 1.75, 600, 440);
    pop(S.frise, t, 2.0, 600, 680);

    // Observateur
    const ox = live ? (t < 2.2 ? SPOT.desk : obsX(t)) : SPOT.desk;
    const po = live ? prog(t, 2.2, 0.35) : 1;
    const so = po <= 0 ? 0.001 : po >= 1 ? 1 : 0.6 + 0.4 * back(po);
    S.obs.setAttribute('transform', `translate(${ox} 0)` + (so === 1 ? '' : ` translate(0 ${OFLOOR}) scale(${so}) translate(0 ${-OFLOOR})`));
    S.obs.setAttribute('opacity', live ? clamp(po / 0.4) : o0);

    // Feuille : relue avant, remplie après
    const deskOn = !live || ph === 0 || ph === 5 || ph === -1;
    S.sheet.setAttribute('opacity', live ? (ph === 0 ? 1 : ph === 5 ? clamp(prog(t, PHASES[5].t0 + 0.6, 0.2)) : 0) : o0);
    S.sheetLines.forEach((l, i) => {
      const w = [124, 96, 112][i];
      const q = live && ph === 5 ? clamp(prog(t, PHASES[5].t0 + 0.8 + 0.35 * i, 0.3)) : 1;
      l.setAttribute('width', Math.max(0.001, w * q));
    });

    S.sheetTitle.textContent = live && ph === 0 ? 'Derniers constats' : 'Nouveaux constats';
    if (measure(S.sheetTitle).width > 176) console.error('Débordement : titre de la feuille');
    const P0p = PHASES[0];
    const rd = live && ph === 0 ? clamp((t - P0p.t0 - 0.1) / (P0p.t1 - P0p.t0 - 0.2)) : -1;
    S.reading.setAttribute('opacity', rd >= 0 && rd < 1 ? 0.14 : 0);
    S.reading.setAttribute('y', 249 + 28 * Math.min(2, Math.floor(Math.max(0, rd) * 3)));

    // Cycle observé
    const P1 = PHASES[1];
    const rq = live ? clamp(prog(t, P1.t0 + 0.2, P1.t1 - P1.t0 - 0.3)) : 0;
    S.ringArc.setAttribute('stroke-dasharray', `${S.ringLen * rq} ${S.ringLen}`);
    S.ring.setAttribute('opacity', live ? G.window01(t, P1.t0 + 0.05, P1.t1 + 0.1, 0.15) : 0);

    // Pièce suivie
    const P2 = PHASES[2];
    S.piece.setAttribute('opacity', live ? G.window01(t, P2.t0 - 0.05, P2.t1 + 0.05, 0.12) : 0);
    S.piece.setAttribute('transform', `translate(${pieceX(t)} ${MFLOOR - 82})`);

    // Questions, puis restitution corrigée par l'équipe
    const P3 = PHASES[3], P4 = PHASES[4];
    S.q1.setAttribute('opacity', live ? G.window01(t, P3.t0 + 0.3, P3.t0 + 1.35, 0.12) : 0);
    S.q2.setAttribute('opacity', live ? G.window01(t, P3.t0 + 1.4, P3.t1 - 0.05, 0.12) : 0);
    S.r1.setAttribute('opacity', live ? G.window01(t, P4.t0 + 0.05, P4.t1 + 0.05, 0.12) : 0);
    S.r2.setAttribute('opacity', live ? G.window01(t, P4.t0 + 0.6, P4.t1 + 0.05, 0.12) : 0);

    // Légende de la phase
    const pc = ph < 0 ? null : PHASES[ph];
    S.capG.setAttribute('opacity', pc ? o0 : 0);
    if (pc) {
      S.capName.textContent = pc.name;
      const w = measure(S.capName).width;
      S.capPill.setAttribute('x', 64); S.capPill.setAttribute('width', w + 28);
      S.capName.setAttribute('x', 78);
      S.cap.textContent = pc.cap;
      S.cap.setAttribute('x', 64 + w + 44);
      S.capPill.setAttribute('fill', pc.desk ? C.ink : C.blue);
    }

    // Frise : remplissage et curseur
    const m = live ? clamp((t - T0) / SPM, 0, acc) : acc;
    S.fillClip.rect.setAttribute('width', Math.max(0.001, m * PXM));
    S.cursor.setAttribute('transform', `translate(${BAR.x + m * PXM} ${BAR.y - 14})`);
    S.cursor.setAttribute('opacity', live ? (t >= T0 - 0.2 && t < TEND + 0.3 ? 1 : 0) : 0);

    rise(S.chute, t, TEND + 0.4, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
