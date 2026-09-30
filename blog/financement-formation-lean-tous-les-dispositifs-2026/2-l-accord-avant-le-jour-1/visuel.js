// Blog · Financement formation Lean · section « Exemple : comment un chef d'équipe a financé sa Green Belt »
// Mécanique : un curseur de temps balaie deux lignes identiques au départ (le projet validé, la demande déposée à
// l'OPCO, quelques semaines d'instruction). En haut, la formation attend l'accord écrit : reste à charge nul.
// En bas, elle démarre avant : à l'arrivée de la réponse, elle n'est plus finançable.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const S = {};

  const X = u => 96 + 104 * u;                      // u : unités de temps illustratives
  const LANES = [{ T: 232, ok: true }, { T: 472, ok: false }], LH = 222;
  const EV = { valide: 0.5, demande: 1.9, instr: [2.35, 6.0], accord: 6.5 };
  const FORM = [[7.4, 10.0], [2.9, 5.5]];
  const RUN = { t0: 2.6, t1: 11.6, u1: 10 };
  const uAt = t => RUN.u1 * prog(t, RUN.t0, RUN.t1 - RUN.t0);
  const tAt = u => RUN.t0 + (RUN.t1 - RUN.t0) * u / RUN.u1;
  const RES_T = [tAt(FORM[0][1]) + 0.3, tAt(EV.accord) + 0.5];
  const CHUTE_T = 12.4;

  function docIcon(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx - 16} ${cy - 21} L ${cx + 7} ${cy - 21} L ${cx + 16} ${cy - 12} L ${cx + 16} ${cy + 21} L ${cx - 16} ${cy + 21} Z`, fill: C.white, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    [0, 1, 2].forEach(r => el('line', { x1: cx - 9, y1: cy - 8 + r * 8, x2: cx + 9, y2: cy - 8 + r * 8, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g));
    return g;
  }
  function hourglass(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx - 8} ${cy - 11} L ${cx + 8} ${cy - 11} L ${cx} ${cy} L ${cx + 8} ${cy + 11} L ${cx - 8} ${cy + 11} L ${cx} ${cy} Z`, fill: C.pYellow, stroke: C.tYellow, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  const label = (parent, cx, y, s, w = 150) => G.para(parent, cx, y, s, w, { size: 15, weight: 600, fill: C.ink, anchor: 'middle', lh: 1.2 });

  function build() {
    G.templateBlog();
    G.blogTitle('L’accord écrit', 'avant le jour 1.');
    G.blogChapeau('La Green Belt du chef d’équipe : le dossier part d’abord, la formation attend l’accord.');

    // Axe du temps
    S.axis = el('g');
    G.arrow(S.axis, `M ${X(0) - 30} 206 L ${X(10) + 24} 206`, { width: 2.5, head: 8, stroke: C.ink });
    text(S.axis, X(0) - 30, 196, 'le temps', { size: 15, weight: 600, fill: C.ink });

    S.lanes = LANES.map((L, i) => {
      const T = L.T, cy = T + 130, ok = L.ok;
      el('rect', { x: 40, y: T, width: 1120, height: LH, rx: 24, fill: C.card, stroke: C.line, 'stroke-width': 2 });
      const head = el('g');
      G.pill(head, 64, T + 34, ok ? 'La formation attend l’accord' : 'La formation démarre avant l’accord', { size: 18, h: 34, pad: 14, bg: ok ? C.pGreen : C.pRed, fg: ok ? C.tGreen : C.tRed, icon: ok ? 'check' : 'cross' });

      // Étapes communes
      const ev1 = el('g');
      G.check(ev1, X(EV.valide), cy, 18);
      label(ev1, X(EV.valide), cy + 44, 'Le dirigeant valide le projet', 120);
      const ev2 = el('g');
      docIcon(ev2, X(EV.demande), cy);
      label(ev2, X(EV.demande), cy + 44, 'Demande déposée à l’OPCO', 130);
      // Instruction : quelques semaines
      const instr = el('g');
      const ix0 = X(EV.instr[0]), ix1 = X(EV.instr[1]), iy = T + 80;
      hourglass(instr, ix0 + 10, iy);
      el('rect', { x: ix0 + 26, y: iy - 5, width: ix1 - ix0 - 26, height: 10, rx: 5, fill: C.line }, instr);
      const ifill = el('rect', { x: ix0 + 26, y: iy - 5, width: ix1 - ix0 - 26, height: 10, rx: 5, fill: C.yellow }, instr);
      text(instr, (ix0 + ix1) / 2 + 13, iy - 13, 'quelques semaines d’instruction', { size: 15, weight: 600, fill: C.tYellow, anchor: 'middle' });
      // Formation : 5 jours
      const form = el('g');
      const [f0, f1] = FORM[i];
      const dw = (X(f1) - X(f0)) / 5;
      const days = [0, 1, 2, 3, 4].map(d => {
        el('rect', { x: X(f0) + d * dw + 2, y: cy - 20, width: dw - 4, height: 40, rx: 8, fill: C.white, stroke: C.line, 'stroke-width': 2 }, form);
        const r = el('rect', { x: X(f0) + d * dw + 2, y: cy - 20, width: dw - 4, height: 40, rx: 8, fill: ok ? C.blue : C.red }, form);
        text(form, X(f0) + d * dw + dw / 2, cy + 6, `J${d + 1}`, { size: 16, weight: 700, fill: C.white, anchor: 'middle' });
        return r;
      });
      label(form, (X(f0) + X(f1)) / 2, cy + 44, ok ? 'Green Belt, 5 jours, sur le temps de travail' : 'Formation démarrée sans accord', 240);
      // Réponse du financeur
      const ev3 = el('g');
      docIcon(ev3, X(EV.accord), cy);
      const stamp = el('g');
      (ok ? G.check : G.cross)(stamp, X(EV.accord) + 16, cy + 14, 14);
      label(ev3, X(EV.accord), cy + 44, ok ? 'Accord écrit de l’OPCO' : 'Plus finançable', 130);
      // Résultat
      const res = el('g');
      const rp = G.pill(res, 0, T + 34, ok ? 'Reste à charge : 0 €' : 'Vous payez tout', { size: 19, h: 36, pad: 16, bg: ok ? C.green : C.red, fg: C.white });
      rp.g.setAttribute('transform', `translate(${1136 - rp.w} 0)`);
      return { head, ev1, ev2, instr, ifill, ix0, ix1, form, days, ev3, stamp, res, resC: 1136 - rp.w / 2, T, cy, ok, f0, f1 };
    });

    S.cursor = el('g');
    el('line', { x1: 0, y1: 206, x2: 0, y2: 700, stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '5 5' }, S.cursor);
    el('circle', { cx: 0, cy: 206, r: 7, fill: C.blue }, S.cursor);

    S.chute = G.blogChute('Ne jamais démarrer la formation avant l’accord écrit.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const u = live ? uAt(t) : RUN.u1;
    rise(S.axis, t, 1.75, 0.35, 6);

    S.lanes.forEach((L, i) => {
      rise(L.head, t, 1.85 + 0.12 * i, 0.35, 8);
      pop(L.ev1, t, tAt(EV.valide), X(EV.valide), L.cy, 0.3);
      pop(L.ev2, t, tAt(EV.demande), X(EV.demande), L.cy, 0.3);
      // L'instruction avance avec le temps
      rise(L.instr, t, tAt(EV.instr[0]) - 0.2, 0.3, 6);
      const iq = live ? prog(u, EV.instr[0], EV.instr[1] - EV.instr[0]) : 1;
      L.ifill.setAttribute('width', Math.max(0.001, (L.ix1 - L.ix0 - 26) * iq));
      // Jours de formation
      rise(L.form, t, tAt(L.f0) - 0.25, 0.3, 6);
      L.days.forEach((r, d) => {
        const du = L.f0 + (L.f1 - L.f0) * d / 5;
        r.setAttribute('opacity', live ? clamp((u - du) / ((L.f1 - L.f0) / 5)) : 1);
      });
      pop(L.ev3, t, tAt(EV.accord), X(EV.accord), L.cy, 0.3);
      pop(L.stamp, t, tAt(EV.accord) + 0.3, X(EV.accord) + 16, L.cy + 14, 0.3);
      pop(L.res, t, RES_T[i], L.resC, L.T + 34, 0.35);
    });
    S.cursor.setAttribute('transform', `translate(${X(u)} 0)`);
    S.cursor.setAttribute('opacity', live ? Math.min(clamp(prog(t, RUN.t0 - 0.3, 0.3)), 1 - clamp(prog(t, RUN.t1 + 0.1, 0.4))) : 0);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
