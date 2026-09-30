// Blog · PDCA · section « Un exemple concret de PDCA en atelier »
// Mécanique : un tour de roue sur l'exemple de l'article. Plan : on mesure 8 min par poste, on fixe l'objectif
// (moins de 3 min). Do : panneau d'ombres sur un seul poste. Check : ce poste tombe à environ 2 min, la barre passe
// sous l'objectif. Act : on généralise aux autres postes et on standardise ; la roue repart sur le problème suivant.
// Hypothèses : 5 postes sur la ligne ; les autres postes atteignent aussi 2 min. Boucle de 18 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const W0 = { x: 220, y: 290, r: 92 };
  const STEPS = [
    { k: 'P', color: C.blue, a0: -90, txt: '8 min mesurées. Objectif : moins de 3 min.' },
    { k: 'D', color: C.teal, a0: 0, txt: 'Panneau d’ombres sur un seul poste, pendant une semaine.' },
    { k: 'C', color: C.yellow, a0: 90, txt: 'Nouvelle mesure : 2 min environ. Objectif atteint.' },
    { k: 'A', color: C.green, a0: 180, txt: 'Généralisé aux autres postes et standardisé.' },
  ];
  const BX = [530, 650, 770, 890, 1010], BW = 72;
  const BASE = 660, PXM = 40;                   // 40 px par minute
  const TARGET = 3;
  const T = {
    wheel: 1.8, step: [2.2, 4.6, 6.4, 8.6], grow: 2.5, target: 3.7,
    board1: 4.9, week: 5.5, fall1: 6.7, side: 7.9, boards: 8.9, fall: 9.5, fiche: 10.7,
    turn: 11.4, next: 12.3, chute: 13.1,
  };

  function board(parent) {
    const g = el('g', {}, parent);
    el('rect', { x: -24, y: -18, width: 48, height: 36, rx: 6, fill: C.white, stroke: C.ink, 'stroke-width': 2.5 }, g);
    el('circle', { cx: -12, cy: -6, r: 5, fill: 'none', stroke: C.ink, 'stroke-width': 2.5 }, g);
    el('line', { x1: -12, y1: -1, x2: -12, y2: 11, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    el('line', { x1: 0, y1: -11, x2: 0, y2: 11, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    el('path', { d: 'M 9 -11 L 15 -11 L 15 2 L 12 11 L 9 2 Z', fill: C.ink }, g);
    return g;
  }
  function chrono(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r: 16, fill: C.white, stroke: C.ink, 'stroke-width': 3.5 }, g);
    el('rect', { x: cx - 4, y: cy - 24, width: 8, height: 6, rx: 2, fill: C.ink }, g);
    const hand = el('line', { x1: cx, y1: cy, x2: cx, y2: cy - 11, stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return { g, hand, cx, cy };
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Un tour de PDCA', 'en atelier.');
    G.blogChapeau('Exemple illustratif : le temps perdu à chercher les outils en début de poste.');

    // ----- Carte gauche : la roue et les quatre étapes -----
    G.card(40, 176, 360, 584);
    S.wheel = el('g');
    S.rot = el('g', {}, S.wheel);
    const arc = (a0, a1, r) => {
      const r0 = a0 * Math.PI / 180, r1 = a1 * Math.PI / 180;
      return `M 0 0 L ${r * Math.cos(r0)} ${r * Math.sin(r0)} A ${r} ${r} 0 0 1 ${r * Math.cos(r1)} ${r * Math.sin(r1)} Z`;
    };
    S.quads = STEPS.map(st => el('path', { d: arc(st.a0, st.a0 + 90, W0.r), fill: st.color, stroke: C.white, 'stroke-width': 4 }, S.rot));
    STEPS.forEach(st => {
      const a = (st.a0 + 45) * Math.PI / 180;
      text(S.rot, W0.r * 0.56 * Math.cos(a), W0.r * 0.56 * Math.sin(a) + 13, st.k, { size: 36, weight: 800, fill: C.white, anchor: 'middle' });
    });
    el('circle', { cx: 0, cy: 0, r: 14, fill: C.white }, S.rot);
    S.next = el('g');
    G.pill(S.next, W0.x, 412, 'Suivant : temps de réglage machine', { size: 16, h: 30, pad: 12, bg: C.pLav, fg: C.blue, anchor: 'middle' });
    S.items = STEPS.map((st, i) => {
      const g = el('g');
      const y = 452 + 76 * i;
      el('circle', { cx: 80, cy: y + 12, r: 17, fill: st.color }, g);
      text(g, 80, y + 19, st.k, { size: 19, weight: 800, fill: C.white, anchor: 'middle' });
      const p = G.para(g, 108, y + 7, st.txt, 270, { size: 17, weight: 500, fill: C.ink, lh: 1.25 });
      fit(p.t, 384, `étape ${st.k}`);
      return { g, y };
    });

    // ----- Carte droite : le temps de recherche, poste par poste -----
    G.card(416, 176, 744, 584);
    fit(text(G.svg, 444, 218, 'Temps de recherche des outils, en minutes par poste', { size: 20, weight: 700, fill: C.ink }), 1136, 'titre du graphique');
    el('line', { x1: 450, y1: BASE + 2, x2: 1132, y2: BASE + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });
    const ty = BASE - TARGET * PXM;
    S.bars = BX.map((x, i) => {
      const g = el('g');
      const rect = el('rect', { x: x - BW / 2, y: BASE - 8 * PXM, width: BW, height: 8 * PXM, rx: 8, fill: C.red }, g);
      const val = text(g, x, BASE - 8 * PXM - 12, '', { size: 20, weight: 700, fill: C.ink, anchor: 'middle' });
      const name = text(G.svg, x, BASE + 28, `Poste ${i + 1}`, { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
      const bd = board(G.svg);
      bd.setAttribute('transform', `translate(${x} ${BASE - 28})`);
      return { g, rect, val, name, bd, x };
    });
    // Barres fantômes : le niveau d'avant (8 min), visible une fois le poste amélioré
    S.ghosts = BX.map(x => el('rect', { x: x - BW / 2, y: BASE - 8 * PXM, width: BW, height: 8 * PXM, rx: 8, fill: 'none', stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0 }));
    S.ghostLab = text(G.svg, BX[4], BASE - 8 * PXM - 12, 'avant : 8 min', { size: 16, weight: 700, fill: C.tRed, anchor: 'middle' });
    S.target = el('g');
    S.targetLine = el('line', { x1: 450, y1: ty, x2: 1132, y2: ty, stroke: C.tGreen, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, S.target);
    S.targetLab = el('g', {}, S.target);
    G.pill(S.targetLab, 1132, ty - 22, 'objectif : moins de 3 min', { size: 16, h: 28, pad: 10, bg: C.pGreen, fg: C.tGreen }).g.setAttribute('transform', '');
    // (l'étiquette est recalée à droite après mesure)
    const lab = S.targetLab.firstChild;
    lab.setAttribute('transform', `translate(${-measure(lab).width} 0)`);

    S.pilot = el('g');
    G.pill(S.pilot, BX[0], BASE + 58, 'poste pilote', { size: 16, h: 28, pad: 10, bg: C.blue, fg: C.white, anchor: 'middle' });
    S.week = el('g');
    G.pill(S.week, BX[0] + 58, BASE - 8 * PXM - 50, 'test : 1 semaine', { size: 16, h: 28, pad: 10, bg: C.pYellow, fg: C.tYellow });
    S.ok = el('g');
    G.check(S.ok, BX[0] + 50, ty - 2, 13);
    S.flyBoards = BX.map(() => board(G.svg));
    S.chrono = chrono(G.svg, 470, 290);
    S.side = el('g');
    G.pill(S.side, 444, 262, 'Effet secondaire : moins d’outils égarés', { size: 17, h: 32, pad: 14, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
    S.fiche = el('g');
    G.pill(S.fiche, 444, 302, 'Act : disposition écrite dans la fiche de poste', { size: 17, h: 32, pad: 14, bg: C.pLav, fg: C.blue });

    S.chute = G.blogChute('On n’a jamais déployé une idée non testée sur toute la ligne.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!])/g, ' $1');
    });
  }

  // Minutes de recherche du poste i à l'instant t
  function minutes(i, t) {
    if (t < FADE_END) return 2;
    const grow = 8 * easeOut(prog(t, T.grow + 0.08 * i, 0.9));
    const t0 = i === 0 ? T.fall1 : T.fall + 0.1 * (i - 1);
    const d = i === 0 ? 1.0 : 0.8;
    return grow - 6 * easeInOut(prog(t, t0, d));
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // Roue : l'étape en cours ressort, un tour complet à la fin
    pop(S.wheel, t, T.wheel, W0.x, W0.y);
    const tw = S.wheel.getAttribute('transform') || '';
    S.wheel.setAttribute('transform', `${tw} translate(${W0.x} ${W0.y})`);
    const turn = live ? 360 * easeInOut(prog(t, T.turn, 0.8)) : 0;
    S.rot.setAttribute('transform', turn % 360 ? `rotate(${turn})` : '');
    let cur = -1;
    if (live && t < T.turn) T.step.forEach((a, i) => { if (t >= a) cur = i; });
    S.quads.forEach((q, i) => q.setAttribute('opacity', cur < 0 || i === cur ? 1 : 0.35));
    S.items.forEach((it, i) => pop(it.g, t, T.step[i], 200, it.y + 18));
    pop(S.next, t, T.next, W0.x, 412);

    // Barres
    S.bars.forEach((b, i) => {
      const m = minutes(i, t);
      const h = Math.max(0.001, m * PXM);
      b.rect.setAttribute('y', BASE - h);
      b.rect.setAttribute('height', h);
      b.rect.setAttribute('fill', m <= TARGET + 0.001 ? C.green : C.red);
      b.val.setAttribute('y', BASE - h - 12);
      b.val.textContent = m > 0.05 ? `${Math.round(m)} min` : '';
      b.g.setAttribute('opacity', live ? clamp(prog(t, T.grow + 0.08 * i - 0.1, 0.2)) : o);
      b.name.setAttribute('opacity', live ? clamp(prog(t, T.wheel + 0.2 + 0.05 * i, 0.3)) : o);
      // Panneau d'ombres posé sur le poste
      const arrive = i === 0 ? T.board1 + 0.5 : T.boards + 0.08 * (i - 1) + 0.5;
      b.bd.setAttribute('opacity', live ? (t >= arrive ? 1 : 0) : o);
      const f = S.flyBoards[i];
      const p = prog(t, arrive - 0.5, 0.5);
      const on = live && p > 0 && p < 1;
      f.setAttribute('opacity', on ? 1 : 0);
      if (on) {
        const a = { x: 700, y: 250 }, e = easeInOut(p);
        f.setAttribute('transform', `translate(${a.x + (b.x - a.x) * e} ${a.y + (BASE - 28 - a.y) * e - 40 * Math.sin(Math.PI * p)})`);
      }
    });
    S.ghosts.forEach((gh, i) => {
      const t0 = i === 0 ? T.fall1 : T.fall + 0.1 * (i - 1);
      gh.setAttribute('opacity', live ? 0.6 * clamp(prog(t, t0 + 0.2, 0.3)) : 0.6 * o);
    });
    S.ghostLab.setAttribute('opacity', live ? clamp(prog(t, T.fall + 0.7, 0.3)) : o);
    // Chrono pendant la mesure initiale (Plan) et la nouvelle mesure (Check)
    const chr = live ? Math.max(G.window01(t, T.grow - 0.2, T.target, 0.2), G.window01(t, T.fall1 - 0.3, T.fall1 + 1.1, 0.2)) : 0;
    S.chrono.g.setAttribute('opacity', chr);
    const r = (live ? t * 360 : 0) * Math.PI / 180;
    S.chrono.hand.setAttribute('x2', S.chrono.cx + 11 * Math.sin(r));
    S.chrono.hand.setAttribute('y2', S.chrono.cy - 11 * Math.cos(r));

    // Objectif
    const q = live ? easeOut(prog(t, T.target, 0.45)) : 1;
    S.targetLine.setAttribute('stroke-dasharray', q >= 1 ? '8 6' : `${682 * q} 682`);
    S.target.setAttribute('opacity', live ? (q > 0 ? 1 : 0) : o);
    S.targetLab.setAttribute('opacity', live ? clamp(prog(t, T.target + 0.3, 0.3)) : o);

    pop(S.pilot, t, T.board1 + 0.4, BX[0], BASE + 58);
    S.week.setAttribute('opacity', live ? G.window01(t, T.week, T.fall1 - 0.1, 0.25) : 0);
    pop(S.ok, t, T.fall1 + 0.75, BX[0] + 50, BASE - TARGET * PXM - 2);
    pop(S.side, t, T.side, 640, 262);
    pop(S.fiche, t, T.fiche, 660, 302);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 18, build, draw });
})();
