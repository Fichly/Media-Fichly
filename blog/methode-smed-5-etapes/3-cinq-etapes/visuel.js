// Blog · SMED · section « Les 5 étapes de la méthode SMED » (regroupe l'image « de 52 à 13 minutes » et les schémas par étape)
// Mécanique : un seul changement de série, suivi étape par étape. La bande rouge est l'arrêt machine.
// 1 on chronomètre et on classe ; 2 les externes sortent de l'arrêt (la préparation déborde encore) ;
// 3 la chauffe et le réglage se font à l'avance, hors machine ; 4 l'interne restant rétrécit ;
// 5 la préparation rétrécit et ne déborde plus. L'arrêt passe de 52 à 13 min (durées intermédiaires : hypothèse).
// Rendu déterministe : window.FICHE.draw(t), boucle de 18 s, image complète à t = 0.
(() => {
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const XS = 470, K = 12;              // début de l'arrêt, px par minute
  const X = m => XS + m * K;
  const BAND = { y: 250, h: 40 }, TRACK = { y: 304, h: 46 };
  const ARRET = [52, 41, 25, 15, 13];
  // Blocs : début et durée (min, 0 = début de l'arrêt) pour chaque étape 1 → 5, externe ?, libellé
  const BL = [
    { st: [0, 2, 2, 2, 0], du: [7, 7, 7, 4, 4], ex: [0, 0, 0, 0, 0], lab: ['Démonter'] },
    { st: [7, -8, -14, -14, -11], du: [6, 6, 6, 6, 4], ex: [1, 1, 1, 1, 1], lab: ['Préparer'] },
    { st: [13, 9, 9, 6, 4], du: [8, 8, 8, 5, 5], ex: [0, 0, 0, 0, 0], lab: ['Monter'] },
    { st: [21, 17, -24, -24, -21], du: [10, 10, 10, 10, 10], ex: [0, 0, 1, 1, 1], lab: ['Chauffe', 'Chauffe', 'Préchauffe'], conv: 7.9 },
    { st: [31, -2, -2, -2, -3], du: [4, 4, 4, 4, 3], ex: [1, 1, 1, 1, 1], lab: ['Appro'] },
    { st: [35, 27, 17, 11, 9], du: [2, 2, 2, 1, 1], ex: [0, 0, 0, 0, 0], lab: [''] },
    { st: [37, 29, -8, -8, -7], du: [6, 6, 6, 6, 4], ex: [0, 0, 1, 1, 1], lab: ['Réglage', 'Réglage', 'Préréglage'], conv: 8.1 },
    { st: [43, 35, 19, 12, 10], du: [6, 6, 6, 3, 3], ex: [0, 0, 0, 0, 0], lab: ['Essais'] },
    { st: [49, 41, 25, 15, 13], du: [3, 3, 3, 3, 2], ex: [1, 1, 1, 1, 1], lab: ['Ranger'] },
  ];
  // Fenêtres de transition vers l'étape s (index 1 → 4) : [externes qui sortent, autres]
  const WIN = [null, [[5.2, 6.1], [6.1, 6.9]], [[8.3, 9.2], [9.2, 9.9]], [[10.8, 11.9], [10.8, 11.9]], [[13.1, 14.2], [13.1, 14.2]]];
  const MOVERS = [null, [1, 4, 8], [3, 6], [], []];
  const STEP_T = [2.6, 4.9, 7.6, 10.5, 12.8];
  const HIST_T = [4.6, 7.2, 10.1, 12.3, 14.4];
  const SWEEP = [2.8, 4.0], CLASS_T = 4.05;
  const HATCH = [[6.6, 0.3], [13.4, 0.4]];
  const CHUTE_T = 15.0;
  const STEPS = ['Mesurer', 'Regrouper', 'Convertir', 'Réduire l’interne', 'Réduire l’externe'];
  const CAPS = [
    'Mesurer : on chronomètre un changement réel et on classe chaque tâche.',
    'Regrouper : tout ce qui peut se faire machine en marche sort de l’arrêt.',
    'Convertir : préchauffer le moule, prérégler l’outillage hors machine.',
    'Réduire l’interne : serrages rapides, butées, première pièce bonne.',
    'Réduire l’externe : chariot dédié, la préparation ne déborde plus.',
  ];
  const GREY = '#c9c9dc';

  const S = {};

  // Étape courante (0-4) pour l'affichage (suivi, légende)
  const stepAt = t => (t < FADE_END ? 4 : STEP_T.reduce((a, s, i) => (t >= s ? i : a), -1));
  // Position (début, durée) d'un bloc à l'instant t
  function blockAt(b, k, t) {
    if (t < FADE_END) return { st: b.st[4], du: b.du[4] };
    let st = b.st[0], du = b.du[0];
    for (let s = 1; s <= 4; s++) {
      const w = WIN[s][MOVERS[s].includes(k) ? 0 : 1];
      const p = easeInOut(prog(t, w[0], w[1] - w[0]));
      if (p <= 0) break;
      st = b.st[s - 1] + (b.st[s] - b.st[s - 1]) * p;
      du = b.du[s - 1] + (b.du[s] - b.du[s - 1]) * p;
    }
    return { st, du };
  }
  // Durée de l'arrêt à l'instant t
  function arretAt(t) {
    if (t < FADE_END) return ARRET[4];
    let a = ARRET[0];
    for (let s = 1; s <= 4; s++) {
      const w0 = WIN[s][0][0], w1 = WIN[s][1][1];
      const p = easeInOut(prog(t, w0, w1 - w0));
      if (p <= 0) break;
      a = ARRET[s - 1] + (ARRET[s] - ARRET[s - 1]) * p;
    }
    return a;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Cinq étapes,', 'de 52 à 13 min.', { size: 48 });
    G.blogChapeau('Les blocs internes se regroupent, sortent de l’arrêt, puis rétrécissent.');
    const defs = G.svg.querySelector('defs') || el('defs');
    const pat = el('pattern', { id: 'hatch', width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('rect', { width: 8, height: 8, fill: C.yellow }, pat);
    el('rect', { width: 4, height: 8, fill: C.ink, opacity: 0.55 }, pat);

    G.card(40, 176, 1120, 584);

    // Suivi des étapes
    let x = 64;
    S.steps = STEPS.map((s, i) => {
      const g = el('g');
      const bg = el('rect', { x, y: 190, height: 38, rx: 19 }, g);
      const b = el('circle', { cx: x + 19, cy: 209, r: 13 }, g);
      const n = text(g, x + 19, 215, String(i + 1), { size: 16, weight: 800, anchor: 'middle' });
      const tx = text(g, x + 40, 216, s, { size: 18, weight: 700 });
      const w = measure(tx).width + 56;
      bg.setAttribute('width', w);
      x += w + 10;
      return { g, bg, b, n, tx };
    });
    fit(S.steps[4].bg, 1136, 'suivi des étapes');

    // Bande machine : en marche / arrêt / en marche
    S.bandA = el('rect', { x: 64, y: BAND.y, height: BAND.h, rx: 10, fill: C.pGreen });
    S.bandB = el('rect', { y: BAND.y, height: BAND.h, rx: 10, fill: C.pGreen });
    S.bandR = el('rect', { x: XS, y: BAND.y, height: BAND.h, rx: 6, fill: C.red });
    text(G.svg, 76, BAND.y + 27, 'Série A, machine en marche', { size: 17, weight: 600, fill: C.tGreen });
    S.bandBt = text(G.svg, 1124, BAND.y + 27, 'Série B', { size: 17, weight: 600, fill: C.tGreen, anchor: 'end' });
    S.arret = text(G.svg, XS, BAND.y + 28, '', { size: 21, weight: 800, fill: C.white, anchor: 'middle' });

    // Blocs de tâches
    el('rect', { x: 64, y: TRACK.y, width: 1072, height: TRACK.h, rx: 8, fill: C.pLav, opacity: 0.5 });
    S.cursor = el('line', { y1: BAND.y - 4, y2: TRACK.y + TRACK.h + 4, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' });
    S.blocks = BL.map((b, k) => {
      const r = el('rect', { y: TRACK.y, height: TRACK.h, rx: 6 });
      const tx = text(G.svg, 0, TRACK.y + 29, '', { size: 16, weight: 700, fill: C.white, anchor: 'middle' });
      const widths = {};
      new Set(b.lab).forEach(s => { tx.textContent = s; widths[s] = s ? tx.getComputedTextLength() : 0; });
      return { r, tx, widths };
    });
    S.hatch = el('rect', { x: XS, y: TRACK.y, width: 2 * K, height: TRACK.h, fill: 'url(#hatch)' });

    // Légende
    const key = (x, fill, s) => { el('rect', { x, y: 368, width: 18, height: 18, rx: 4, fill }); return text(G.svg, x + 26, 383, s, { size: 17, weight: 500, fill: C.ink }); };
    key(64, C.red, 'Interne : machine arrêtée');
    key(334, C.green, 'Externe : machine en marche');
    fit(key(626, 'url(#hatch)', 'Préparation qui déborde sur l’arrêt'), 1136, 'légende');

    // Légende de l'étape
    el('rect', { x: 64, y: 404, width: 1072, height: 48, rx: 14, fill: C.pLav });
    S.cap = text(G.svg, 84, 436, '', { size: 20, weight: 600, fill: C.ink });
    S.capW = CAPS.map(s => { S.cap.textContent = s; return S.cap.getComputedTextLength(); });
    S.capW.forEach((w, i) => { if (84 + w > 1120) console.error(`Débordement : légende ${i + 1}`); });

    // Historique : durée de l'arrêt après chaque étape
    text(G.svg, 64, 494, 'Durée de l’arrêt après chaque étape', { size: 19, weight: 700, fill: C.ink });
    S.hist = ARRET.map((a, i) => {
      const y = 512 + 45 * i;
      text(G.svg, 64, y + 23, `Étape ${i + 1}`, { size: 17, weight: 600, fill: C.ink });
      const g = el('g');
      el('rect', { x: 170, y, width: a * K, height: 30, rx: 6, fill: i === 4 ? C.green : C.red, opacity: i === 4 ? 1 : 0.85 }, g);
      text(g, 170 + a * K + 12, y + 23, `${a}${NB}min`, { size: 19, weight: 800, fill: i === 4 ? C.tGreen : C.tRed });
      return { g, y };
    });
    S.bracket = el('g');
    el('path', { d: `M 870 ${512} L 884 ${512} L 884 ${512 + 45 * 2 + 30} L 870 ${512 + 45 * 2 + 30}`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linejoin': 'round' }, S.bracket);
    G.para(S.bracket, 898, 560, 'Étapes 1 à 3 : presque sans coût, l’essentiel du gain', 230, { size: 17, weight: 700, fill: C.blue, lh: 1.25 });

    S.chute = G.blogChute('Les étapes 1 à 3 ne coûtent presque rien : commencez par elles.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const step = stepAt(t);

    // Suivi des étapes
    S.steps.forEach((s, i) => {
      const allDone = !live || t >= HIST_T[4] + 0.4;
      const done = allDone || i < step, act = !allDone && i === step;
      s.bg.setAttribute('fill', act ? C.blue : done ? C.pGreen : C.pLav);
      s.b.setAttribute('fill', act ? C.white : done ? C.green : C.blue);
      s.n.setAttribute('fill', act ? C.blue : C.white);
      s.tx.setAttribute('fill', act ? C.white : done ? C.tGreen : C.blue);
      s.g.setAttribute('opacity', live && i > step ? 0.55 : 1);
      if (live && t >= HIST_T[4] + 0.4 && t < HIST_T[4] + 1.0 && i === 4) pulse(s.g, t, HIST_T[4] + 0.4, measure(s.bg).x + measure(s.bg).width / 2, 209, 0.07, 0.4);
      if (live && t >= STEP_T[i] && t < STEP_T[i] + 0.7) pulse(s.g, t, STEP_T[i], measure(s.bg).x + measure(s.bg).width / 2, 209, 0.07, 0.4);
    });

    // Arrêt : bande rouge et compteur
    const a = arretAt(t);
    const xr = X(a);
    S.bandR.setAttribute('width', a * K);
    S.bandB.setAttribute('x', xr);
    S.bandB.setAttribute('width', 1136 - xr);
    S.bandBt.setAttribute('opacity', 1136 - xr > 110 ? 1 : 0);
    const sw = live ? prog(t, SWEEP[0], SWEEP[1] - SWEEP[0]) : 1;
    const shown = live && t < SWEEP[1] ? 52 * sw : a;
    S.arret.textContent = live && t < SWEEP[0] ? '' : `${Math.round(shown)}${NB}min`;
    S.arret.setAttribute('x', XS + a * K / 2);
    S.arret.setAttribute('opacity', o);
    const cOn = live && t >= SWEEP[0] - 0.1 && t < SWEEP[1] + 0.2;
    S.cursor.setAttribute('opacity', cOn ? 1 : 0);
    S.cursor.setAttribute('x1', X(52 * sw));
    S.cursor.setAttribute('x2', X(52 * sw));

    // Blocs
    S.blocks.forEach((B, k) => {
      const b = BL[k];
      const p = blockAt(b, k, t);
      const x0 = X(p.st), w = p.du * K;
      B.r.setAttribute('x', x0 + 1);
      B.r.setAttribute('width', Math.max(0.5, w - 2));
      // Couleur : gris avant le classement, puis interne / externe (conversion à l'étape 3)
      let ext = b.ex[0];
      if (!live || (b.conv && t >= b.conv)) ext = b.ex[4];
      const classed = !live || t >= CLASS_T + 0.06 * k;
      B.r.setAttribute('fill', classed ? (ext ? C.green : C.red) : GREY);
      const lab = b.lab[Math.min(b.lab.length - 1, !live || (b.conv && t >= b.conv) ? 2 : 0)];
      B.tx.textContent = lab;
      B.tx.setAttribute('x', x0 + w / 2);
      B.tx.setAttribute('opacity', lab && B.widths[lab] + 10 <= w ? o : 0);
      B.r.setAttribute('opacity', live ? clamp(prog(t, 1.8 + 0.05 * k, 0.3)) : o);
      if (b.conv && live && t >= b.conv && t < b.conv + 0.6) pulse(B.r, t, b.conv, x0 + w / 2, TRACK.y + TRACK.h / 2, 0.12, 0.4);
    });
    // Préparation qui déborde : visible des étapes 2 à 4
    const ho = live ? clamp(prog(t, HATCH[0][0], HATCH[0][1])) * (1 - clamp(prog(t, HATCH[1][0], HATCH[1][1]))) : 0;
    S.hatch.setAttribute('opacity', ho);

    // Légende de l'étape
    const ci = Math.max(0, step);
    S.cap.textContent = CAPS[ci];
    S.cap.setAttribute('opacity', live ? (step < 0 ? 0 : clamp(prog(t, STEP_T[ci], 0.3))) : o);

    // Historique
    S.hist.forEach((h, i) => rise(h.g, t, HIST_T[i], 0.4, 10));
    pop(S.bracket, t, HIST_T[2] + 0.4, 960, 580);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 18, build, draw });
})();
