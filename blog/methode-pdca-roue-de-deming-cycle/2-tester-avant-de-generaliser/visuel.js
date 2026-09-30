// Blog · PDCA · section « Pourquoi utiliser le PDCA en amélioration continue ? »
// Mécanique : deux lignes identiques, la même idée, qui se révèle être une fausse bonne idée.
// En haut, on la déploie d'un coup sur les six postes : trois mois plus tard, un autre problème est apparu partout.
// En bas (PDCA), on la teste sur un seul poste, on mesure, elle ne marche pas : on corrige, on re-mesure,
// puis on généralise. Compteur « postes touchés » : 6 contre 1. Boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = { lanes: [] };
  const LANES = [{ y0: 176, kind: 'all' }, { y0: 468, kind: 'pdca' }];
  const PX = [278, 392, 506, 620, 734, 848];
  const MK = 0.55, MW = 180 * MK, MH = 124 * MK;
  const IDEA = { x: 138 };
  // Chronologie
  const T = {
    fly: 3.0, flyD: 0.55,
    top: { later: 4.6, red0: 5.2, redStep: 0.15 },
    bot: { check1: 4.3, red1: 5.0, fix: 5.9, fly2: 6.2, check2: 6.9, ok1: 7.4, gen: 8.1, ok0: 8.9, okStep: 0.1 },
    chute: 10.4,
  };

  function bulb(parent, cx, cy, k = 1, fill = C.yellow) {
    const g = el('g', { transform: `translate(${cx} ${cy}) scale(${k})` }, parent);
    el('circle', { cx: 0, cy: -6, r: 17, fill }, g);
    el('rect', { x: -8, y: 10, width: 16, height: 11, rx: 3, fill: C.ink }, g);
    el('path', { d: 'M -6 -6 Q 0 2 6 -6', fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function token(fill) {
    const g = el('g');
    el('rect', { x: -13, y: -10, width: 26, height: 20, rx: 5, fill }, g);
    el('line', { x1: -6, y1: -2, x2: 6, y2: -2, stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function chrono(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r: 15, fill: C.white, stroke: C.ink, 'stroke-width': 3.5 }, g);
    el('rect', { x: cx - 4, y: cy - 23, width: 8, height: 6, rx: 2, fill: C.ink }, g);
    const hand = el('line', { x1: cx, y1: cy, x2: cx, y2: cy - 10, stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return { g, hand, cx, cy };
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Tester petit,', 'puis généraliser.');
    G.blogChapeau('Deux disciplines : tester à petite échelle, mesurer avant de conclure.');

    LANES.forEach((ln, li) => {
      const L = { ...ln };
      const Y0 = ln.y0, floor = Y0 + 212;
      L.floor = floor;
      const all = ln.kind === 'all';
      G.card(40, Y0, 1120, 276);

      L.head = el('g');
      const p = G.pill(L.head, 64, Y0 + 38, all ? 'Déployer partout d’un coup' : 'PDCA', { size: 22, h: 38, bg: all ? C.pRed : C.pGreen, fg: all ? C.tRed : C.tGreen });
      L.capX = 64 + p.w + 16;
      // Légendes successives de la ligne (une seule visible à la fois)
      const caps = all
        ? ['L’idée est appliquée aux six postes.', 'Trois mois plus tard : un autre problème, partout.']
        : ['Do : test sur un seul poste.', 'Check : mesure après une semaine. L’idée ne marche pas.', 'Act : on corrige, nouvel essai.', 'Check : cette fois, ça marche.', 'Act : on généralise à toute la ligne.'];
      L.caps = caps.map((s, i) => {
        const t = text(G.svg, L.capX, Y0 + 46, s, { size: 21, weight: 500, fill: C.ink });
        fit(t, 1136, `légende ${li}-${i}`);
        return t;
      });

      el('line', { x1: 64, y1: floor + 2, x2: 900, y2: floor + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });

      // L'idée
      L.idea = el('g');
      bulb(L.idea, IDEA.x, floor - 50, 1.6);
      text(L.idea, IDEA.x, floor + 30, all ? 'L’idée' : 'L’idée', { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });

      // Postes
      L.postes = PX.map((x, i) => {
        const g = el('g');
        const m = G.machine(g, x - MW / 2, floor - MH, MK);
        text(g, x, floor + 30, `Poste ${i + 1}`, { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
        const mark = token(C.yellow);
        mark.setAttribute('transform', `translate(${x} ${floor - MH - 24})`);
        const mark2 = token(C.green);
        mark2.setAttribute('transform', `translate(${x} ${floor - MH - 24})`);
        const bad = el('g'); G.cross(bad, x, floor - MH - 24, 14);
        const ok = el('g'); G.check(ok, x, floor - MH - 24, 14);
        return { g, m, mark, mark2, bad, ok, x };
      });
      if (!all) {
        L.chrono = chrono(G.svg, PX[0] + 58, floor - MH - 24);
      }

      // Vols de l'idée vers les postes
      L.fl = PX.map(() => token(C.yellow));
      L.fl2 = PX.map(() => token(C.green));

      // Compteur
      L.counter = el('g');
      el('rect', { x: 914, y: Y0 + 74, width: 222, height: 180, rx: 20, fill: all ? C.pRed : C.pGreen }, L.counter);
      text(L.counter, 1025, Y0 + 106, 'Postes touchés', { size: 19, weight: 700, fill: all ? C.tRed : C.tGreen, anchor: 'middle' });
      text(L.counter, 1025, Y0 + 130, 'par l’idée ratée', { size: 18, weight: 500, fill: all ? C.tRed : C.tGreen, anchor: 'middle' });
      L.num = text(L.counter, 1025, Y0 + 222, '', { size: 76, weight: 800, fill: all ? C.tRed : C.tGreen, anchor: 'middle' });
      S.lanes.push(L);
    });

    S.chute = G.blogChute('Ces deux réflexes évitent de propager une fausse bonne idée.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!])/g, ' $1');
    });
  }

  // Un vol : de l'idée vers le poste i, entre t0 et t0 + d
  function fly(g, t, t0, d, L, i) {
    const p = prog(t, t0, d);
    const on = t >= FADE_END && p > 0 && p < 1;
    g.setAttribute('opacity', on ? 1 : 0);
    if (!on) return;
    const a = { x: IDEA.x, y: L.floor - 70 }, b = { x: PX[i], y: L.floor - MH - 24 };
    const e = easeInOut(p);
    g.setAttribute('transform', `translate(${a.x + (b.x - a.x) * e} ${a.y + (b.y - a.y) * e - 50 * Math.sin(Math.PI * p)})`);
  }
  const vis = (node, on) => node.setAttribute('opacity', on ? 1 : 0);

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    S.lanes.forEach((L, li) => {
      const all = L.kind === 'all';
      const d0 = 1.75 + 0.3 * li;
      pop(L.head, t, d0, 200, L.y0 + 38);
      pop(L.idea, t, d0 + 0.2, IDEA.x, L.floor - 40);
      L.postes.forEach((P, i) => pop(P.g, t, d0 + 0.3 + 0.05 * i, P.x, L.floor - MH / 2));
      pop(L.counter, t, d0 + 0.5, 1025, L.y0 + 160);

      // Légende courante
      const capAt = all ? [T.fly, T.top.later] : [T.fly, T.bot.check1, T.bot.fix, T.bot.check2, T.bot.gen];
      let cur = capAt.length - 1;
      if (live) { cur = -1; capAt.forEach((a, i) => { if (t >= a) cur = i; }); }
      L.caps.forEach((c, i) => c.setAttribute('opacity', i === cur ? (live ? clamp(prog(t, capAt[i], 0.25)) : o) : 0));

      let n = 0;
      if (all) {
        // Tout le monde reçoit l'idée en même temps
        L.fl.forEach((g, i) => fly(g, t, T.fly + 0.04 * i, T.flyD, L, i));
        L.fl2.forEach(g => vis(g, false));
        L.postes.forEach((P, i) => {
          const arrive = T.fly + 0.04 * i + T.flyD, red = T.top.red0 + T.top.redStep * i;
          const isRed = !live || t >= red;
          vis(P.mark, live && t >= arrive && !isRed);
          vis(P.mark2, false);
          P.bad.setAttribute('opacity', isRed ? o : 0);
          vis(P.ok, false);
          P.m.lights[1].setAttribute('fill', isRed ? C.red : C.green);
          if (isRed) n++;
          if (live && t >= red && t < red + 0.8) pulse(P.bad, t, red, P.x, L.floor - MH - 24, 0.25, 0.4);
        });
      } else {
        // Un seul poste d'abord
        L.fl.forEach((g, i) => fly(g, t, i === 0 ? T.fly : T.bot.gen + 0.06 * (i - 1), T.flyD, L, i));
        L.fl.forEach((g, i) => { if (i > 0) vis(g, false); });
        L.fl2.forEach((g, i) => fly(g, t, i === 0 ? T.bot.fly2 : T.bot.gen + 0.06 * (i - 1), T.flyD, L, i));
        L.postes.forEach((P, i) => {
          let mark = false, mark2 = false, bad = false, ok = !live;
          if (live) {
            if (i === 0) {
              mark = t >= T.fly + T.flyD && t < T.bot.red1;
              bad = t >= T.bot.red1 && t < T.bot.fly2 + T.flyD;
              mark2 = t >= T.bot.fly2 + T.flyD && t < T.bot.ok1;
              ok = t >= T.bot.ok1;
              if (t >= T.bot.red1) n = 1;
            } else {
              const arrive = T.bot.gen + 0.06 * (i - 1) + T.flyD, okT = T.bot.ok0 + T.bot.okStep * (i - 1);
              mark2 = t >= arrive && t < okT;
              ok = t >= okT;
            }
          } else if (i === 0) n = 1;
          vis(P.mark, mark); vis(P.mark2, mark2);
          P.bad.setAttribute('opacity', bad ? 1 : 0);
          P.ok.setAttribute('opacity', ok ? o : 0);
          P.m.lights[1].setAttribute('fill', bad ? C.red : C.green);
        });
        // Chrono pendant les deux mesures
        const chr = live ? Math.max(G.window01(t, T.bot.check1, T.bot.red1 + 0.3, 0.2), G.window01(t, T.bot.check2, T.bot.ok1 + 0.3, 0.2)) : 0;
        L.chrono.g.setAttribute('opacity', chr);
        const ang = live ? (t * 360) % 360 : 0;
        const r = ang * Math.PI / 180;
        L.chrono.hand.setAttribute('x2', L.chrono.cx + 10 * Math.sin(r));
        L.chrono.hand.setAttribute('y2', L.chrono.cy - 10 * Math.cos(r));
      }
      L.num.textContent = String(n);
      if (live && all && t >= T.top.red0 && t < T.top.red0 + 1.6) pulse(L.num, t, T.top.red0 + 0.75, 1025, L.y0 + 196, 0.1, 0.4);
      if (live && !all && t >= T.bot.red1 && t < T.bot.red1 + 0.8) pulse(L.num, t, T.bot.red1, 1025, L.y0 + 196, 0.1, 0.4);
    });

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
