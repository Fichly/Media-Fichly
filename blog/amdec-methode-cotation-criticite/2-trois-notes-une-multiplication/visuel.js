// Blog · AMDEC · section « Comment coter la fréquence, la gravité et la détection » (visuel attendu VISUEL-A-CREER)
// Mécanique : trois échelles de 1 à 4 (du vert au rouge), une ligne du tableau se cote : le sélecteur monte jusqu'au
// palier que le fait observable désigne (F = 3, G = 3, D = 2, l'exemple de l'article), les trois notes descendent
// se multiplier : 18, placé sur l'échelle de 1 à 64. Piège rappelé sur la colonne D : note haute = on ne voit rien venir.
// Paliers G 1-2 et D 3 : hypothèses (l'article ne les définit pas). Rendu déterministe : boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const CW = 320, XS = [70, 440, 810];
  const LV = { y: 310, h: 54, gap: 5 };               // niveau 4 en haut, niveau 1 en bas
  const lvY = n => LV.y + (4 - n) * (LV.h + LV.gap);   // haut de la case du niveau n
  const LCOL = { 1: [C.green, C.pGreen], 2: [C.yellow, C.pYellow], 3: [C.yellow, C.pYellow], 4: [C.red, C.pRed] };
  const NOTES = [
    { k: 'F', name: 'Fréquence', src: 'lue dans l’historique de pannes', v: 3, why: 'une occurrence par mois',
      lv: ['moins d’une fois par an', 'une fois par trimestre', 'une fois par mois', 'une fois par semaine'] },
    { k: 'G', name: 'Gravité', src: 'l’effet sur l’aval, ici l’arrêt', v: 3, why: 'l’arrêt dépasse la journée',
      lv: ['moins d’une heure', 'quelques heures', 'plus d’une journée', 'une semaine d’arrêt'] },
    { k: 'D', name: 'Non-détection', src: 'voit-on venir le problème ?', v: 2, why: 'un signe audible avant de casser',
      lv: ['capteur avec alarme', 'signe audible avant', 'vu seulement à l’arrêt', 'casse sans prévenir'] },
  ];
  const SEL = [3.2, 4.6, 6.0], SEL_D = 0.7;
  const T = { ex: 2.8, trap: 6.9, fly0: 7.7, flyStep: 0.25, fly: 0.6, eq: 8.9, gauge: 9.4, gaugeD: 0.9, scale: 10.2, chute: 10.9 };
  const FORM = { y: 676, x0: 96, step: 104 };          // formule : cases des trois notes
  const GA = { x: 640, w: 480, y: 652, h: 26 };

  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Trois notes,', 'une multiplication.', { size: 48 });
    G.blogChapeau(`C = F × G × D : chaque note se lit dans un fait observable, pas dans une impression.`);
    G.card(40, 176, 1120, 576);

    S.cols = NOTES.map((N, i) => {
      const x = XS[i];
      const g = el('g');
      // en-tête
      el('rect', { x, y: 194, width: 44, height: 44, rx: 12, fill: C.blue }, g);
      text(g, x + 22, 225, N.k, { size: 26, weight: 800, fill: C.white, anchor: 'middle' });
      text(g, x + 56, 225, N.name, { size: 24, weight: 800, fill: C.ink });
      fit(text(g, x, 264, N.src, { size: 17, weight: 700, fill: C.blue }), x + CW + 20, `source ${i}`);
      // paliers
      for (let n = 4; n >= 1; n--) {
        const y = lvY(n);
        el('rect', { x, y, width: CW, height: LV.h, rx: 12, fill: LCOL[n][1] }, g);
        el('rect', { x: x + 6, y: y + 6, width: LV.h - 12, height: LV.h - 12, rx: 9, fill: LCOL[n][0] }, g);
        text(g, x + 6 + (LV.h - 12) / 2, y + LV.h / 2 + 8, String(n), { size: 22, weight: 800, fill: C.white, anchor: 'middle' });
        fit(text(g, x + LV.h + 8, y + LV.h / 2 + 6, N.lv[n - 1], { size: 17, weight: 600, fill: C.ink }), x + CW - 6, `palier ${N.k}${n}`);
      }
      // sélecteur et justification
      const sel = el('rect', { x: x - 4, y: lvY(1) - 4, width: CW + 8, height: LV.h + 8, rx: 15, fill: 'none', stroke: C.blue, 'stroke-width': 5 });
      const why = el('g');
      fit(text(why, x + CW / 2, lvY(1) + LV.h + 27, N.why, { size: 17, weight: 700, fill: C.blue, anchor: 'middle' }), x + CW + 20, `pourquoi ${i}`, x - 20);
      return { ...N, g, x, sel, why };
    });
    // × entre les colonnes
    S.times = [XS[1] - 25, XS[2] - 25].map(x => text(G.svg, x, lvY(2) + 12, '×', { size: 40, weight: 800, fill: C.blue, anchor: 'middle' }));
    // piège de la colonne D
    S.trap = el('g');
    const tp = G.pill(S.trap, XS[2] + CW / 2, 288, 'note haute = on ne voit rien venir', { size: 16, h: 30, pad: 12, bg: C.red, fg: C.white, anchor: 'middle' });
    S.trapW = tp.w;

    // ----- Bande du bas : la ligne d'exemple -----
    S.band = el('g');
    el('line', { x1: 64, y1: 588, x2: 1136, y2: 588, stroke: C.line, 'stroke-width': 2 }, S.band);
    text(S.band, 70, 620, 'Exemple : une ligne du tableau', { size: 18, weight: 700, fill: C.ink });
    // cases de la formule
    S.slots = [0, 1, 2].map(k => el('rect', { x: FORM.x0 + k * FORM.step - 26, y: FORM.y - 42, width: 52, height: 52, rx: 12, fill: 'none', stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, S.band));
    [0, 1].forEach(k => text(S.band, FORM.x0 + k * FORM.step + FORM.step / 2, FORM.y - 4, '×', { size: 34, weight: 800, fill: C.blue, anchor: 'middle' }));
    S.eq = el('g');
    text(S.eq, FORM.x0 + 2 * FORM.step + 50, FORM.y - 2, `= 18`, { size: 44, weight: 800, fill: C.blue });
    // notes volantes
    S.fly = NOTES.map(N => {
      const g = el('g');
      el('rect', { x: -26, y: -26, width: 52, height: 52, rx: 12, fill: LCOL[N.v][0] }, g);
      text(g, 0, 9, String(N.v), { size: 28, weight: 800, fill: C.white, anchor: 'middle' });
      return g;
    });
    // jauge 1 → 64
    S.gauge = el('g');
    text(S.gauge, GA.x, 620, 'Criticité de la ligne', { size: 18, weight: 700, fill: C.ink });
    el('rect', { x: GA.x, y: GA.y, width: GA.w, height: GA.h, rx: 13, fill: C.pLav }, S.gauge);
    S.gfill = el('rect', { x: GA.x, y: GA.y, width: 0, height: GA.h, rx: 13, fill: C.blue }, S.gauge);
    text(S.gauge, GA.x, GA.y + GA.h + 22, '1', { size: 15, weight: 600, fill: C.ink });
    text(S.gauge, GA.x + GA.w, GA.y + GA.h + 22, '64', { size: 15, weight: 600, fill: C.ink, anchor: 'end' });
    S.gval = text(S.gauge, 0, GA.y - 10, '', { size: 18, weight: 800, fill: C.blue, anchor: 'middle' });
    S.scale = el('g');
    fit(text(S.scale, GA.x, 732, `Échelle de 1 à 4 : 1 à 64. Échelle de 1 à 10 : 1 à 1${NB}000.`, { size: 16, weight: 600, fill: C.ink }), 1140, 'échelles');

    S.chute = G.blogChute('Le chiffre ne veut rien dire seul, il ne sert qu’à classer.', { y: 806 });
  }

  // Position du sélecteur (niveau, fractionnaire) à l'instant t
  const selLevel = (i, t) => (t < FADE_END ? NOTES[i].v : 1 + (NOTES[i].v - 1) * easeInOut(prog(t, SEL[i], SEL_D)));

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.cols.forEach((c, i) => {
      pop(c.g, t, 1.75 + 0.2 * i, c.x + CW / 2, 400);
      const n = selLevel(i, t);
      c.sel.setAttribute('y', lvY(n) - 4);
      c.sel.setAttribute('opacity', live ? clamp(prog(t, SEL[i] - 0.3, 0.25)) : o);
      pop(c.why, t, SEL[i] + SEL_D, c.x + CW / 2, lvY(1) + LV.h + 24);
    });
    S.times.forEach((x, k) => x.setAttribute('opacity', live ? clamp(prog(t, 2.3 + 0.1 * k, 0.3)) : o));
    pop(S.trap, t, 2.6, XS[2] + CW / 2, 288);
    if (live && t >= T.trap - 0.05 && t < T.trap + 0.8) pulse(S.trap, t, T.trap, XS[2] + CW / 2, 288, 0.1, 0.45);

    S.band.setAttribute('opacity', live ? clamp(prog(t, T.ex, 0.3)) : o);
    // Les notes descendent dans la formule
    S.fly.forEach((g, k) => {
      const c = S.cols[k];
      const from = { x: c.x + 6 + (LV.h - 12) / 2, y: lvY(NOTES[k].v) + LV.h / 2 };
      const to = { x: FORM.x0 + k * FORM.step, y: FORM.y - 16 };
      let x = to.x, y = to.y, op = o, sc = 1;
      if (live) {
        const p = prog(t, T.fly0 + T.flyStep * k, T.fly), e = easeInOut(p);
        x = from.x + (to.x - from.x) * e;
        y = from.y + (to.y - from.y) * e - 40 * Math.sin(Math.PI * p);
        op = p > 0 ? 1 : 0;
        sc = 0.85 + 0.15 * e;
      }
      g.setAttribute('transform', `translate(${x} ${y}) scale(${sc})`);
      g.setAttribute('opacity', op);
    });
    pop(S.eq, t, T.eq, FORM.x0 + 2 * FORM.step + 100, FORM.y - 16);

    // Jauge : 18 sur 64
    S.gauge.setAttribute('opacity', live ? clamp(prog(t, T.gauge - 0.3, 0.3)) : o);
    const gv = live ? 18 * easeOut(prog(t, T.gauge, T.gaugeD)) : 18;
    const gw = GA.w * (gv - 1) / 63;
    S.gfill.setAttribute('width', Math.max(0.001, gw + (gv > 1 ? GA.h / 2 : 0)));
    S.gval.setAttribute('x', GA.x + Math.max(gw, 14));
    S.gval.textContent = gv >= 1 ? `${Math.round(gv)} sur 64` : '';
    S.scale.setAttribute('opacity', live ? clamp(prog(t, T.scale, 0.35)) : o);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
