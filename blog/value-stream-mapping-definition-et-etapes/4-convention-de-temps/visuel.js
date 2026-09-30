// Blog · Value Stream Mapping · section « Exemple chiffré : un flux de bout en bout »
// Mécanique en deux temps. 1) Convertir un encours en jours : 300 pièces devant un poste qui en consomme 100 par
// jour ; chaque rangée de 100 pièces part dans le poste et devient un jour d'attente sur la ligne de temps : 3 jours.
// 2) Même flux (5 min en machine, 3 jours de traversée), deux conventions : en calendaire les nuits comptent
// (4 320 min, 0,12 %) ; en temps ouvré sur 8 h, les nuits disparaissent, la barre se resserre au tiers (1 440 min,
// 0,35 %) alors que les 5 minutes n'ont pas bougé. Comparer les deux fabrique une amélioration qui n'existe pas.
// Hypothèse : 1 carton = 25 pièces ; placement des 8 h ouvrées en début de journée (schématique).
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  // Carte 1 : pile et ligne de temps
  const PILE = { x: 104, dx: 32, rows: [350, 318, 286] };   // de bas en haut
  const MACH = { x: 300, y: 296, k: 0.46 };
  const STRIP = { x: 470, w: 200, y: 322, h: 30 };
  const T_DAY = [2.9, 3.75, 4.6], DAY_FLY = 0.4, DAY_SEG = 0.4;
  // Carte 2 : barres
  const BAR = { x: 80, day: 300, work: 100, h: 36 };
  const Y_CAL = 508, Y_OUV = 616;
  const T_C2 = 5.9, T_CAL = 6.3, T_OUV = 7.9, T_CMP = 8.5, D_CMP = 1.1, T_TRAP = 10.3;
  const CHUTE_T = 12.2;
  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Même flux,', 'deux ratios.');
    G.blogChapeau(`5 minutes en machine, 3 jours de traversée : tout dépend de la convention de temps.`);

    const defs = G.svg.querySelector('defs') || el('defs');
    const pat = el('pattern', { id: 'nuit', width: 9, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('rect', { x: 0, y: 0, width: 9, height: 9, fill: C.pRed }, pat);
    el('line', { x1: 0, y1: 0, x2: 0, y2: 9, stroke: C.red, 'stroke-width': 3, opacity: 0.45 }, pat);

    // ----- Carte 1 -----
    G.card(40, 176, 1120, 220);
    S.h1 = el('g');
    text(S.h1, 64, 216, 'Convertir un encours en jours', { size: 22, weight: 700, fill: C.ink });
    G.carton(S.h1, 1136 - 190, 209, 0.6);
    text(S.h1, 1136, 216, '1 carton = 25 pièces', { size: 17, weight: 500, fill: C.ink, anchor: 'end' });
    S.ghosts = [];
    S.rows = PILE.rows.map((y, r) => {
      const boxes = [0, 1, 2, 3].map(i => {
        const x = PILE.x + i * PILE.dx;
        S.ghosts.push(el('rect', { x: x - 13, y: y - 13, width: 26, height: 26, rx: 5, fill: 'none', stroke: C.yellow, 'stroke-width': 2, 'stroke-dasharray': '4 3' }));
        return { g: G.carton(G.svg, x, y, 0.84), x, y };
      });
      return boxes;
    });
    S.pileLab = text(G.svg, PILE.x + 1.5 * PILE.dx, 386, '300 pièces', { size: 19, weight: 700, fill: C.tRed, anchor: 'middle' });
    S.mach = el('g');
    const m = G.machine(S.mach, MACH.x, MACH.y, MACH.k);
    S.machM = m;
    text(S.mach, MACH.x + 41, 372, 'Poste suivant', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
    text(S.mach, MACH.x + 41, 390, `100 / jour`, { size: 17, weight: 500, fill: C.ink, anchor: 'middle' });
    S.segs = [0, 1, 2].map(d => {
      const x = STRIP.x + d * STRIP.w;
      const r = el('rect', { x: x + 2, y: STRIP.y, width: 0, height: STRIP.h, rx: 6, fill: C.red });
      const lab = text(G.svg, x + STRIP.w / 2, STRIP.y + 21, `jour ${d + 1}`, { size: 17, weight: 700, fill: C.white, anchor: 'middle' });
      const sub = text(G.svg, x + STRIP.w / 2, STRIP.y + 56, `100 pièces`, { size: 16, weight: 500, fill: C.tRed, anchor: 'middle' });
      return { r, lab, sub, x };
    });
    S.form1 = el('g');
    const f1 = text(S.form1, STRIP.x, 282, `300 ÷ 100 par jour =`, { size: 22, weight: 500, fill: C.ink });
    fit(text(S.form1, measure(f1).x + measure(f1).width + 10, 282, `3 jours d’attente`, { size: 24, weight: 800, fill: C.tRed }), 1136, 'formule 1');

    // ----- Carte 2 -----
    G.card(40, 410, 1120, 348);
    S.h2 = text(G.svg, 64, 450, 'Même flux, deux conventions', { size: 22, weight: 700, fill: C.ink });
    const bar = (y, label) => {
      const g = el('g');
      const lb = text(g, 64, y - 14, label, { size: 19, weight: 500, fill: C.ink });
      const days = [0, 1, 2].map(d => ({
        w: el('rect', { y, width: BAR.work - 2, height: BAR.h, rx: 4, fill: C.red }, g),
        n: el('rect', { y, width: BAR.day - BAR.work - 2, height: BAR.h, rx: 4, fill: 'url(#nuit)' }, g),
      }));
      el('rect', { x: BAR.x, y: y - 4, width: 6, height: BAR.h + 8, rx: 2, fill: C.green }, g);
      const clip = G.clipRect(BAR.x - 2, y - 6, 0, BAR.h + 12);
      g.setAttribute('clip-path', clip.url);
      return { g, days, clip: clip.rect, lb };
    };
    S.cal = bar(Y_CAL, `Temps calendaire : 3 × 24${NB}h = 4${NB}320 min`);
    S.ouv = bar(Y_OUV, `Temps ouvré, journées de 8${NB}h : 3 × 8${NB}h = 1${NB}440 min`);
    // Les clips coupent aussi le libellé : on le sort du groupe découpé
    [S.cal, S.ouv].forEach(b => G.svg.appendChild(b.lb));
    S.rCal = el('g');
    text(S.rCal, 1136, Y_CAL + 30, `0,12${NB}%`, { size: 32, weight: 800, fill: C.blue, anchor: 'end' });
    text(S.rCal, 1136, Y_CAL - 14, `5 / 4${NB}320`, { size: 17, weight: 500, fill: C.ink, anchor: 'end' });
    S.rOuv = el('g');
    text(S.rOuv, 420, Y_OUV + 30, `0,35${NB}%`, { size: 32, weight: 800, fill: C.blue });
    text(S.rOuv, 550, Y_OUV + 28, `5 / 1${NB}440`, { size: 17, weight: 500, fill: C.ink });
    S.gone = el('g');
    text(S.gone, 710, Y_OUV + 26, 'les nuits ne comptent plus', { size: 17, weight: 500, fill: C.tRed });
    // Légende
    S.leg = el('g');
    el('rect', { x: 64, y: 672, width: 16, height: 16, rx: 3, fill: C.green }, S.leg);
    text(S.leg, 88, 686, '5 min en machine', { size: 16, weight: 500, fill: C.ink });
    el('rect', { x: 250, y: 672, width: 16, height: 16, rx: 3, fill: C.red }, S.leg);
    text(S.leg, 274, 686, 'attente, heures ouvrées', { size: 16, weight: 500, fill: C.ink });
    el('rect', { x: 490, y: 672, width: 16, height: 16, rx: 3, fill: 'url(#nuit)' }, S.leg);
    text(S.leg, 514, 686, 'attente, nuits', { size: 16, weight: 500, fill: C.ink });
    // Piège
    S.trap = el('g');
    const tp = G.pill(S.trap, 64, 726, 'Piège', { size: 18, h: 34, pad: 14, bg: C.pRed, fg: C.tRed, icon: 'cross' });
    const tt = text(S.trap, 64 + tp.w + 14, 733, 'Actuel en calendaire, futur en temps ouvré :', { size: 19, weight: 500, fill: C.ink });
    fit(text(S.trap, measure(tt).x + measure(tt).width + 8, 733, '× 3 sans rien changer.', { size: 19, weight: 800, fill: C.tRed }), 1136, 'piège');

    S.chute = G.blogChute(`Plus de 99${NB}% du temps n’apporte rien au client.`, { y: 808 });
  }

  function layoutBar(b, c) {
    b.days.forEach((d, i) => {
      const xw = BAR.x + i * (BAR.work + (BAR.day - BAR.work) * (1 - c));
      d.w.setAttribute('x', xw);
      d.n.setAttribute('x', xw + BAR.work);
      d.n.setAttribute('width', Math.max(0.001, (BAR.day - BAR.work) * (1 - c) - 2));
      d.n.setAttribute('opacity', c >= 1 ? 0 : 1);
    });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;

    // ----- Carte 1 : la pile se vide rangée par rangée, chaque rangée devient un jour -----
    pop(S.h1, t, 1.7, 400, 210);
    pop(S.mach, t, 1.9, MACH.x + 41, 330);
    S.rows.forEach((row, r) => {
      row.forEach((b, i) => {
        const tIn = 2.0 + 0.05 * (r * 4 + i);
        const tOut = T_DAY[2 - r] + 0.04 * i;          // la rangée du haut part en premier
        let x = b.x, y = b.y, o = 1, s = 1;
        if (!live) o = 0;
        else {
          const pin = prog(t, tIn, 0.3);
          y = b.y - 50 * (1 - easeOut(pin));
          o = clamp(pin / 0.3);
          const po = prog(t, tOut, DAY_FLY);
          if (po > 0) {
            const e = easeInOut(po);
            x = b.x + (MACH.x + 41 - b.x) * e;
            y = y + (MACH.y + 26 - y) * e - 30 * Math.sin(Math.PI * po);
            s = 1 - 0.5 * e;
            o *= 1 - clamp((po - 0.7) / 0.3);
          }
        }
        b.g.setAttribute('transform', `translate(${x} ${y})` + (s === 1 ? '' : ` scale(${s})`));
        b.g.setAttribute('opacity', o);
      });
    });
    const ghostO = fo * (live ? clamp(prog(t, T_DAY[0], 0.4)) : 1);
    S.ghosts.forEach((g, k) => {
      const r = Math.floor(k / 4);
      g.setAttribute('opacity', live ? fo * clamp(prog(t, T_DAY[2 - r] + 0.1, 0.3)) : fo);
    });
    S.pileLab.setAttribute('opacity', fo * (live ? clamp(prog(t, 2.5, 0.3)) : 1));
    S.segs.forEach((sg, d) => {
      const t0 = T_DAY[d] + DAY_FLY;
      const p = live ? easeOut(prog(t, t0, DAY_SEG)) : 1;
      sg.r.setAttribute('width', Math.max(0.001, (STRIP.w - 4) * p));
      sg.r.setAttribute('opacity', fo);
      const lo = fo * (live ? clamp(prog(t, t0 + DAY_SEG * 0.6, 0.25)) : 1);
      sg.lab.setAttribute('opacity', lo);
      sg.sub.setAttribute('opacity', lo);
      if (live && t >= T_DAY[d] + DAY_FLY - 0.1 && t < T_DAY[d] + DAY_FLY + 0.5) pulse(S.mach, t, T_DAY[d] + DAY_FLY - 0.1, MACH.x + 41, 330, 0.07, 0.4);
    });
    S.machM.lights[1].setAttribute('fill', live && T_DAY.some(d => t >= d + 0.2 && t < d + DAY_FLY + 0.3) ? C.yellow : C.green);
    rise(S.form1, t, T_DAY[2] + DAY_FLY + DAY_SEG + 0.2, 0.4);

    // ----- Carte 2 -----
    S.h2.setAttribute('opacity', fo * (live ? clamp(prog(t, T_C2, 0.3)) : 1));
    const rv = (t0, d) => (live ? easeInOut(prog(t, t0, d)) : 1);
    S.cal.clip.setAttribute('width', Math.max(0.001, (3 * BAR.day + 4) * rv(T_CAL, 0.9)));
    S.cal.lb.setAttribute('opacity', fo * (live ? clamp(prog(t, T_CAL - 0.2, 0.3)) : 1));
    S.cal.g.setAttribute('opacity', fo);
    layoutBar(S.cal, 0);
    pop(S.rCal, t, T_CAL + 0.9, 1080, Y_CAL + 10);

    const c = live ? easeInOut(prog(t, T_CMP, D_CMP)) : 1;
    S.ouv.clip.setAttribute('width', Math.max(0.001, (3 * BAR.day + 4) * rv(T_OUV, 0.5)));
    S.ouv.lb.setAttribute('opacity', fo * (live ? clamp(prog(t, T_OUV - 0.2, 0.3)) : 1));
    S.ouv.g.setAttribute('opacity', fo);
    layoutBar(S.ouv, c);
    pop(S.rOuv, t, T_CMP + D_CMP, 480, Y_OUV + 18);
    S.gone.setAttribute('opacity', fo * (live ? clamp(prog(t, T_CMP + 0.4, 0.4)) : 1));
    S.leg.setAttribute('opacity', fo * (live ? clamp(prog(t, T_CAL + 0.4, 0.3)) : 1));

    pop(S.trap, t, T_TRAP, 400, 726);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
