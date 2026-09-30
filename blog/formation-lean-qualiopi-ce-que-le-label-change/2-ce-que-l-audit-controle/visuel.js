// Blog · QUALIOPI formation Lean · section « Ce que QUALIOPI garantit, et ce qu'il ne garantit pas »
// Mécanique : la vie d'une formation (avant, pendant, après) sur deux étages. En haut, le cadre : la loupe de
// l'auditeur le parcourt et coche chaque pièce. En bas, le fond : la loupe bute sur le bord du périmètre d'audit,
// les questions restent ouvertes, et c'est à l'acheteur de les vérifier.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const S = {};

  const COLS = [240, 600, 960], CW = 330;
  const TOP = { y: 212, h: 212 }, BOT = { y: 462, h: 250 };
  const FRAME = { x: 30, y: 202, w: 1140, h: 232 };
  const CADRE = [
    { c: 0, y: 300, s: 'Objectifs écrits noir sur blanc' },
    { c: 0, y: 360, s: 'Qualifications déclarées' },
    { c: 1, y: 300, s: 'Stagiaires suivis et évalués' },
    { c: 1, y: 360, s: 'Moyens et encadrement' },
    { c: 2, y: 300, s: 'Un bilan existe' },
    { c: 2, y: 360, s: 'Réclamations tracées' },
  ];
  const FOND = [
    { c: 0, y: 566, s: 'Le contenu colle-t-il à votre atelier ?' },
    { c: 1, y: 566, s: 'Le formateur est-il bon pédagogue ?' },
    { c: 1, y: 646, s: 'A-t-il une vraie expertise terrain ?' },
    { c: 2, y: 580, s: 'Dans trois mois, vos équipes animent-elles un chantier 5S ?' },
  ];
  const SWEEP = { t0: 3.1, t1: 6.1, x0: 90, x1: 1110, y: 332 };
  const BUMP = { t: 6.3, d: 0.7 };
  const Q_T = k => 7.3 + 0.3 * k;
  const YOU_T = 8.9, CHUTE_T = 9.7;

  function doc(parent, x, cy) {
    el('rect', { x: x - 11, y: cy - 14, width: 22, height: 28, rx: 4, fill: C.pLav, stroke: C.blue, 'stroke-width': 2 }, parent);
    [0, 1, 2].forEach(r => el('line', { x1: x - 5, y1: cy - 6 + r * 6, x2: x + 5, y2: cy - 6 + r * 6, stroke: C.blue, 'stroke-width': 2, 'stroke-linecap': 'round' }, parent));
  }
  function question(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r: 14, fill: C.yellow }, g);
    text(g, cx, cy + 7, '?', { size: 20, weight: 800, fill: C.white, anchor: 'middle' });
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Le label certifie', 'un processus.');
    G.blogChapeau('L’auditeur vérifie le cadre de l’organisme, pas ce que vos équipes sauront faire.');

    S.cols = el('g');
    ['Avant la formation', 'Pendant', 'Après'].forEach((s, i) => text(S.cols, COLS[i], 194, s, { size: 17, weight: 700, fill: C.ink, anchor: 'middle' }));

    // Étage du haut : le cadre
    G.card(40, TOP.y, 1120, TOP.h);
    S.topTitle = el('g');
    text(S.topTitle, 64, TOP.y + 38, 'Le cadre : ce que l’audit vérifie', { size: 19, weight: 700, fill: C.blue });
    S.cadre = CADRE.map((it, k) => {
      const x = COLS[it.c] - CW / 2;
      const g = el('g');
      el('rect', { x, y: it.y - 24, width: CW, height: 48, rx: 14, fill: C.pLav }, g);
      doc(g, x + 26, it.y);
      fit(text(g, x + 48, it.y + 6, it.s, { size: 16, weight: 600, fill: C.ink }), x + CW - 36, `cadre ${k}`);
      const ok = el('g');
      G.check(ok, x + CW - 16, it.y, 12);
      return { g, ok, x, cx: COLS[it.c], y: it.y, c: it.c };
    });

    // Étage du bas : le fond
    G.card(40, BOT.y, 1120, BOT.h);
    S.botTitle = el('g');
    text(S.botTitle, 64, BOT.y + 38, 'Le fond : ce qui échappe à l’audit', { size: 19, weight: 700, fill: C.tRed });
    S.fond = FOND.map((it, k) => {
      const x = COLS[it.c] - CW / 2;
      const g = el('g');
      const long = it.s.length > 40;
      const h = long ? 74 : 56;
      el('rect', { x, y: it.y - h / 2, width: CW, height: h, rx: 14, fill: C.white, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
      G.para(g, x + 52, it.y + (long ? -6 : 6), it.s, CW - 68, { size: 16, weight: 600, fill: C.ink, lh: 1.3 });
      const q = el('g');
      question(q, x + 26, it.y);
      return { g, q, x, y: it.y };
    });
    S.you = el('g');
    const yp = G.pill(S.you, 0, BOT.y + 32, 'À vérifier vous-même, avant de signer', { size: 17, h: 34, pad: 14, bg: C.yellow, fg: C.ink });
    yp.g.setAttribute('transform', `translate(${1136 - yp.w} 0)`);
    S.youC = 1136 - yp.w / 2;

    // Périmètre de l'audit : cadre pointillé autour de l'étage du haut
    S.frame = el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 28, fill: 'none', stroke: C.green, 'stroke-width': 3.5, 'stroke-dasharray': '10 8' });
    S.frameTag = el('g');
    const ft = G.pill(S.frameTag, 0, FRAME.y + FRAME.h, 'périmètre de l’audit', { size: 16, h: 30, pad: 14, bg: C.green, fg: C.white });
    ft.g.setAttribute('transform', `translate(${1140 - ft.w} 0)`);
    S.frameTagC = 1140 - ft.w / 2;

    // Loupe de l'auditeur
    S.loupe = el('g');
    el('line', { x1: 16, y1: 16, x2: 34, y2: 34, stroke: C.blue, 'stroke-width': 8, 'stroke-linecap': 'round' }, S.loupe);
    el('circle', { cx: 0, cy: 0, r: 24, fill: C.white, 'fill-opacity': 0.35, stroke: C.blue, 'stroke-width': 5 }, S.loupe);

    S.chute = G.blogChute('Un seuil minimal, pas un classement de qualité.', { y: 808 });
  }

  function loupeAt(t) {
    if (t < SWEEP.t0) return { x: SWEEP.x0, y: SWEEP.y };
    if (t < SWEEP.t1) return { x: SWEEP.x0 + (SWEEP.x1 - SWEEP.x0) * easeInOut(prog(t, SWEEP.t0, SWEEP.t1 - SWEEP.t0)), y: SWEEP.y };
    // Elle tente de descendre vers le fond et bute sur le bord du périmètre
    const p = prog(t, BUMP.t, BUMP.d);
    const dy = 90 * Math.sin(Math.PI * Math.min(1, p * 1.0)) * (p < 0.5 ? easeOut(p * 2) : 1);
    return { x: SWEEP.x1 - 380 * easeInOut(prog(t, SWEEP.t1, 0.3)), y: SWEEP.y + (p > 0 && p < 1 ? dy : 0) };
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    rise(S.cols, t, 1.75, 0.35, 8);
    rise(S.topTitle, t, 1.85, 0.35, 8);
    rise(S.botTitle, t, 2.2, 0.35, 8);
    S.cadre.forEach((c, k) => rise(c.g, t, 2.0 + 0.08 * k, 0.35, 10));
    S.fond.forEach((f, k) => rise(f.g, t, 2.35 + 0.08 * k, 0.35, 10));

    // Le cadre du périmètre se dessine
    const len = 2 * (FRAME.w + FRAME.h);
    const fq = live ? easeOut(prog(t, 2.6, 0.6)) : 1;
    S.frame.setAttribute('stroke-dasharray', fq >= 1 ? '10 8' : `${len} ${len}`);
    S.frame.setAttribute('stroke-dashoffset', fq >= 1 ? 0 : len * (1 - fq));
    S.frame.setAttribute('opacity', live ? 1 : o);
    pop(S.frameTag, t, 3.0, S.frameTagC, FRAME.y + FRAME.h, 0.3);

    // La loupe parcourt le cadre et coche chaque pièce
    const L = loupeAt(t);
    const lo = live ? Math.min(clamp(prog(t, SWEEP.t0 - 0.3, 0.3)), 1 - clamp(prog(t, BUMP.t + BUMP.d + 0.1, 0.3))) : 0;
    S.loupe.setAttribute('transform', `translate(${L.x} ${L.y})`);
    S.loupe.setAttribute('opacity', lo);
    S.cadre.forEach(c => {
      const passT = SWEEP.t0 + (SWEEP.t1 - SWEEP.t0) * G.invEaseInOut(clamp((c.x + CW - 16 - SWEEP.x0) / (SWEEP.x1 - SWEEP.x0)));
      pop(c.ok, t, passT, c.x + CW - 16, c.y, 0.3);
    });
    // Au contact du bord, le cadre marque l'arrêt
    const hitT = BUMP.t + BUMP.d * 0.5;
    if (live && t >= hitT - 0.1 && t < hitT + 0.6) {
      const w = G.window01(t, hitT - 0.05, hitT + 0.45, 0.1);
      S.frame.setAttribute('stroke-width', 3.5 + 2.5 * w);
    } else S.frame.setAttribute('stroke-width', 3.5);

    // Le fond : les questions restent ouvertes
    S.fond.forEach((f, k) => pop(f.q, t, Q_T(k), f.x + 26, f.y, 0.3));
    pop(S.you, t, YOU_T, S.youC, BOT.y + 32);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
