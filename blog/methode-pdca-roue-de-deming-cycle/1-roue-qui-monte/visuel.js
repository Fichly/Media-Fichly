// Blog · PDCA · section « Qu'est-ce que la méthode PDCA ? » (refait en animé l'image existante « Qu'est-ce que le PDCA »)
// Mécanique : la roue de Deming monte une pente, un tour complet (Plan, Do, Check, Act) par cran.
// 1er essai sans standard : l'effort s'arrête, la roue redescend au point de départ.
// 2e essai : à la fin de chaque tour, l'Act pose une cale (le standard) ; l'effort peut s'arrêter, la roue tient.
// Chaque cale laisse un nouveau niveau de référence (effet cliquet). Boucle de 18 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const P0 = { x: 100, y: 724 }, P1 = { x: 1140, y: 344 };
  const L = Math.hypot(P1.x - P0.x, P1.y - P0.y);
  const U = { x: (P1.x - P0.x) / L, y: (P1.y - P0.y) / L };
  const N = { x: U.y, y: -U.x };                 // normale vers le haut (côté de la roue)
  const R = 62, CIRC = 2 * Math.PI * R;
  const S0 = 150, S1 = S0 + CIRC, S2 = S0 + 2 * CIRC;
  const pt = (s, h = 0) => ({ x: P0.x + s * U.x + h * N.x, y: P0.y + s * U.y + h * N.y });
  const STEPS = [
    { k: 'P', name: 'Plan : planifier', color: C.blue },
    { k: 'D', name: 'Do : réaliser', color: C.teal },
    { k: 'C', name: 'Check : vérifier', color: C.yellow },
    { k: 'A', name: 'Act : agir', color: C.green },
  ];
  // Chronologie
  const T = {
    wheel: 1.8, up1: [2.4, 5.0], let1: 5.2, down: [5.5, 6.7], cap1: 5.9, ghost: 6.7,
    up2: [7.3, 9.9], cale1: 10.0, ref1: 10.4, let2: 10.6, cap2: 10.8,
    up3: [11.5, 14.1], cale2: 14.2, ref2: 14.6, let3: 14.8, chute: 15.3,
  };

  // Position le long de la pente (s) et rotation (degrés, sens horaire) de la roue à l'instant t
  function wheelState(t) {
    if (t < FADE_END) return { s: S2 - 3, phi: 720 - 3 / R * 180 / Math.PI, moving: false };   // état final : calée
    const seg = (a, b, s0, s1, p0, p1, ease = easeInOut) => {
      const e = ease(prog(t, a, b - a));
      return { s: s0 + (s1 - s0) * e, phi: p0 + (p1 - p0) * e, moving: t > a && t < b };
    };
    if (t < T.up1[1]) return seg(T.up1[0], T.up1[1], S0, S1, 0, 360);
    if (t < T.down[0]) return { s: S1, phi: 360, moving: false };
    if (t < T.down[1]) return seg(T.down[0], T.down[1], S1, S0, 360, 0, p => p * p * (3 - 2 * p));
    if (t < T.up2[1]) return seg(T.up2[0], T.up2[1], S0, S1, 0, 360);
    if (t < T.up3[0]) {
      // la roue recule de 3 px contre la cale quand l'effort s'arrête
      const back = 3 * easeOut(prog(t, T.let2, 0.25)) - 3 * easeOut(prog(t, T.up3[0] - 0.3, 0.3));
      return { s: S1 - back, phi: 360 - back / R * 180 / Math.PI, moving: false };
    }
    if (t < T.up3[1]) return seg(T.up3[0], T.up3[1], S1, S2, 360, 720);
    const back = 3 * easeOut(prog(t, T.let3, 0.25));
    return { s: S2 - back, phi: 720 - back / R * 180 / Math.PI, moving: false };
  }

  // Cale : triangle rectangle posé sur la pente, face verticale contre la roue
  function wedge(parent, s) {
    const d = 56, h = R - Math.sqrt(R * R - d * d);
    const a = pt(s - d - 84, 0), b = pt(s - d, 0), c = pt(s - d, h);
    const g = el('g', {}, parent);
    el('path', { d: `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y} Z`, fill: C.yellow, stroke: C.yellow, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    return { g, top: c, mid: pt(s - d - 30, 0) };
  }

  function build() {
    G.templateBlog();
    G.blogTitle('La roue', 'qui monte la pente.');
    G.blogChapeau('Chaque tour de PDCA fait monter d’un cran. Le standard empêche de redescendre.');
    G.card(40, 176, 1120, 584);

    // Pente (décor fixe)
    el('path', { d: `M ${P0.x} ${P0.y} L ${P1.x} ${P1.y} L ${P1.x} 744 L ${P0.x} 744 Z`, fill: C.pLav });
    el('line', { x1: P0.x, y1: P0.y, x2: P1.x, y2: P1.y, stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round' });

    // Légendes (sans standard / avec standard)
    S.cap1 = el('g');
    G.cross(S.cap1, 84, 218, 13);
    fit(text(S.cap1, 106, 225, 'Sans standard : au premier coup de mou, la roue redescend.', { size: 21, weight: 700, fill: C.tRed }), 1000, 'légende 1');
    S.cap2 = el('g');
    G.check(S.cap2, 84, 258, 13);
    fit(text(S.cap2, 106, 265, 'Un standard à chaque tour : elle ne redescend plus.', { size: 21, weight: 700, fill: C.tGreen }), 1000, 'légende 2');

    // Roue fantôme : là où elle revient sans standard
    const g0 = pt(S0, R);
    S.ghost = el('g');
    el('circle', { cx: g0.x, cy: g0.y, r: R, fill: 'none', stroke: C.red, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, S.ghost);
    G.pill(S.ghost, g0.x, g0.y, 'retour ici', { size: 16, h: 28, pad: 10, bg: C.pRed, fg: C.tRed, anchor: 'middle' });

    // Cales (standards) et niveaux de référence
    S.cales = [S1, S2].map((s, i) => {
      const w = wedge(G.svg, s);
      const lab = el('g');
      const lp = pt(s - 100, -34);
      G.pill(lab, lp.x, lp.y, 'Standard', { size: 16, h: 28, pad: 10, bg: C.yellow, fg: C.ink, anchor: 'middle' });
      const ref = el('g');
      const y = w.top.y;
      const line = el('line', { x1: w.top.x - 14, y1: y, x2: 64, y2: y, stroke: C.tGreen, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, ref);
      text(ref, 68, y - 9, `nouveau niveau de référence ${i + 1}`, { size: 16, weight: 700, fill: C.tGreen });
      return { w, lab, lp, ref, line, len: w.top.x - 14 - 64 };
    });

    // Effort (flèche derrière la roue)
    S.push = el('g');
    S.pushA = G.arrow(S.push, `M ${-R - 96} 0 L ${-R - 14} 0`, { width: 5, head: 13 });
    text(S.push, -R - 55, -14, 'effort', { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });

    // Roue
    S.wheel = el('g');
    S.rot = el('g', {}, S.wheel);
    const arc = (a0, a1) => {
      const r0 = a0 * Math.PI / 180, r1 = a1 * Math.PI / 180;
      return `M 0 0 L ${R * Math.cos(r0)} ${R * Math.sin(r0)} A ${R} ${R} 0 0 1 ${R * Math.cos(r1)} ${R * Math.sin(r1)} Z`;
    };
    // P en haut, D à gauche, C en bas, A à droite : en roulant (sens horaire) elles passent en haut dans l'ordre
    const base = [-90, 180, 90, 0];
    S.quads = STEPS.map((st, i) => el('path', { d: arc(base[i] - 45, base[i] + 45), fill: st.color, stroke: C.white, 'stroke-width': 3 }, S.rot));
    el('circle', { cx: 0, cy: 0, r: R, fill: 'none', stroke: C.white, 'stroke-width': 3 }, S.rot);
    el('circle', { cx: 0, cy: 0, r: 9, fill: C.white }, S.rot);
    S.letters = STEPS.map(st => text(S.wheel, 0, 0, st.k, { size: 24, weight: 800, fill: C.white, anchor: 'middle' }));
    S.stepPill = el('g');
    S.stepPills = STEPS.map(st => {
      const g = el('g', {}, S.stepPill);
      G.pill(g, 0, 0, st.name, { size: 18, h: 34, pad: 14, bg: C.white, fg: C.ink, anchor: 'middle' });
      g.querySelector('rect').setAttribute('stroke', st.color);
      g.querySelector('rect').setAttribute('stroke-width', 3);
      return g;
    });

    S.chute = G.blogChute('Chaque cycle réussi devient le nouveau niveau de référence.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!])/g, ' $1');
    });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const w = wheelState(t);
    const c = pt(w.s, R);

    // Roue : apparition, roulement, lettres toujours droites
    pop(S.wheel, t, T.wheel, c.x, c.y);
    const tr = S.wheel.getAttribute('transform') || '';
    S.wheel.setAttribute('transform', `${tr} translate(${c.x} ${c.y})`);
    S.rot.setAttribute('transform', `rotate(${w.phi})`);
    const base = [-90, 180, 90, 0];
    const top = Math.floor((((w.phi % 360) + 360) % 360) / 90) % 4;   // étape du tour en cours
    S.letters.forEach((l, i) => {
      const a = (base[i] + w.phi) * Math.PI / 180;
      l.setAttribute('x', R * 0.58 * Math.cos(a));
      l.setAttribute('y', R * 0.58 * Math.sin(a) + 8.5);
    });
    // Étape en cours au-dessus de la roue (pendant le roulement vers le haut)
    const up = live && [T.up1, T.up2, T.up3].some(([a, b]) => t > a && t < b);
    S.quads.forEach((q, i) => q.setAttribute('opacity', !up || i === top ? 1 : 0.5));
    S.stepPills.forEach((g, i) => g.setAttribute('opacity', up && i === top ? 1 : 0));
    S.stepPill.setAttribute('transform', `translate(${c.x} ${c.y - R - 34})`);

    // Effort : présent pendant les montées, relâché ensuite
    let po = 0;
    if (live) {
      const on = (a, b) => clamp(prog(t, a, 0.3)) * (1 - clamp(prog(t, b, 0.3)));
      po = Math.max(on(T.wheel + 0.2, T.let1), on(T.up2[0] - 0.4, T.let2), on(T.up3[0] - 0.4, T.let3));
    }
    const ang = Math.atan2(U.y, U.x) * 180 / Math.PI;
    S.push.setAttribute('transform', `translate(${c.x} ${c.y}) rotate(${ang})`);
    S.push.setAttribute('opacity', po);

    // Sans standard : elle redescend
    const cap1 = live ? clamp(prog(t, T.cap1, 0.35)) : o;
    S.cap1.setAttribute('opacity', cap1);
    S.ghost.setAttribute('opacity', live ? clamp(prog(t, T.ghost, 0.35)) : o);
    rise(S.cap2, t, T.cap2, 0.4);

    // Cales et niveaux de référence
    S.cales.forEach((k, i) => {
      const t0 = i ? T.cale2 : T.cale1, tr0 = i ? T.ref2 : T.ref1;
      let dx = 0, ko = o;
      if (live) {
        const p = prog(t, t0, 0.35);
        dx = -60 * (1 - easeOut(p));
        ko = p > 0 ? clamp(p / 0.3) : 0;
      }
      k.w.g.setAttribute('transform', dx ? `translate(${dx * U.x} ${dx * U.y})` : '');
      k.w.g.setAttribute('opacity', ko);
      pop(k.lab, t, t0 + 0.25, k.lp.x, k.lp.y);
      const q = live ? easeOut(prog(t, tr0, 0.45)) : 1;
      k.line.setAttribute('stroke-dasharray', q >= 1 ? '8 6' : `${k.len * q} ${k.len}`);
      k.ref.setAttribute('opacity', live ? (q > 0 ? 1 : 0) : o);
    });

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 18, build, draw });
})();
