// Blog · Gemba · section « L'effet observateur »
// Mécanique, carte 1 : le responsable entre, l'atelier bascule (cadence ajustée, protections remises, raccourci
// abandonné pour la fiche officielle) ; il ressort, tout revient à l'habitude. Ce qu'on voit n'est pas l'habitude.
// Carte 2 : même trimestre, deux fréquences. Une visite par trimestre : un grand écart, un événement.
// Un passage par semaine : l'écart se réduit de passage en passage, la visite devient un décor.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const FLOOR = 446;
  const DOOR = 116, STOP = 262;
  const ENTER = 3.0, IN = ENTER + 0.9, OUT = 6.3, GONE = OUT + 0.9;
  const ENTER2 = 13.6, IN2 = ENTER2 + 0.9;   // il revient : la boucle se referme sur l'image complète
  const ROWS = [
    ['Cadence', 'habituelle', 'ajustée'],
    ['Protections', 'de côté', 'en place'],
    ['Raccourci utile', 'pris', 'fiche officielle'],
  ];
  const RY = k => 290 + 58 * k;
  const COLA = 812, COLB = 1030;
  // Carte 2 : douze semaines
  const AX = { x0: 380, x1: 930 };
  const WX = w => AX.x0 + (w - 0.5) * (AX.x1 - AX.x0) / 12;
  const B1 = 620, B2 = 724;
  const WEEKLY = [56, 44, 34, 26, 20, 15, 12, 10, 8, 8, 7, 7];
  const V1_T = 8.3, V2_T = w => 8.9 + 0.33 * (w - 1);
  const CHUTE_T = V2_T(12) + 0.8;

  function person(parent, cx, floor, k = 1, fill = C.blue) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 62 * k, r: 14 * k, fill }, g);
    el('path', { d: `M ${cx - 24 * k} ${floor} L ${cx - 24 * k} ${floor - 22 * k} Q ${cx - 24 * k} ${floor - 42 * k} ${cx} ${floor - 42 * k} Q ${cx + 24 * k} ${floor - 42 * k} ${cx + 24 * k} ${floor - 22 * k} L ${cx + 24 * k} ${floor} Z`, fill }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Observé,', 'l’atelier change.');
    G.blogChapeau('Être observé modifie le comportement observé. On ne supprime pas l’effet, on le réduit.');

    // ----- Carte 1 : l'entrée du responsable -----
    G.card(40, 176, 1120, 300);
    S.scene = el('g');
    el('line', { x1: 64, y1: FLOOR + 2, x2: 576, y2: FLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.scene);
    // Porte
    el('rect', { x: DOOR - 40, y: FLOOR - 170, width: 80, height: 170, rx: 6, fill: C.pLav, stroke: C.ink, 'stroke-width': 3 }, S.scene);
    el('circle', { cx: DOOR + 24, cy: FLOOR - 82, r: 5, fill: C.ink }, S.scene);
    // Poste et opérateur
    G.machine(S.scene, 358, FLOOR - 87, 0.7);
    person(S.scene, 530, FLOOR, 1.35, C.lightBlue);
    text(S.scene, 421, FLOOR + 26, 'Poste', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
    // Le responsable
    S.boss = el('g');
    person(S.boss, 0, FLOOR, 1.4, C.violet);
    S.bossLab = text(S.boss, 0, FLOOR + 26, 'Responsable', { size: 17, weight: 700, fill: C.violet, anchor: 'middle' });

    S.heads = el('g');
    text(S.heads, 604, 222, 'Au poste', { size: 18, weight: 700, fill: C.ink });
    text(S.heads, COLA, 222, 'D’habitude', { size: 18, weight: 700, fill: C.blue, anchor: 'middle' });
    text(S.heads, COLB, 222, 'Quand vous êtes là', { size: 18, weight: 700, fill: C.violet, anchor: 'middle' });
    S.rows = ROWS.map(([lab, a, b], k) => {
      const y = RY(k);
      const g = el('g');
      text(g, 604, y + 7, lab, { size: 19, weight: 700, fill: C.ink });
      const mk = (cx, s, fill) => {
        const on = el('g', {}, g), off = el('g', {}, g);
        const p = G.pill(on, cx, y, s, { size: 18, h: 36, bg: fill, fg: C.white, anchor: 'middle' });
        G.pill(off, cx, y, s, { size: 18, h: 36, bg: C.card, fg: fill, anchor: 'middle' });
        el('rect', { x: p.x, y: y - 18, width: p.w, height: 36, rx: 18, fill: 'none', stroke: fill, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, off);
        fit(p.g, 1140, `pilule ${s}`);
        return { on, off };
      };
      return { g, y, A: mk(COLA, a, C.blue), B: mk(COLB, b, C.violet) };
    });

    // ----- Carte 2 : venir souvent -----
    G.card(40, 492, 1120, 268);
    S.c2 = el('g');
    text(S.c2, 64, 532, 'Venir souvent', { size: 21, weight: 700, fill: C.ink });
    const leg = text(S.c2, 1136, 532, 'hauteur : écart entre ce qu’on voit et l’habitude', { size: 17, weight: 500, fill: C.ink, anchor: 'end' });
    [[B1, 'Une visite par trimestre'], [B2, 'Un passage par semaine']].forEach(([b, s]) => {
      text(S.c2, 64, b - 4, s, { size: 19, weight: 700, fill: C.ink });
      el('line', { x1: AX.x0 - 8, y1: b + 1, x2: AX.x1 + 8, y2: b + 1, stroke: C.line, 'stroke-width': 3 }, S.c2);
    });
    text(S.c2, AX.x0, B2 + 26, 'semaine 1', { size: 16, weight: 500, fill: C.ink });
    text(S.c2, AX.x1, B2 + 26, 'semaine 12', { size: 16, weight: 500, fill: C.ink, anchor: 'end' });
    S.v1 = el('rect', { x: WX(6) - 7, width: 14, rx: 5, fill: C.violet });
    S.v2 = WEEKLY.map((h, i) => ({ h, e: el('rect', { x: WX(i + 1) - 7, width: 14, rx: 5, fill: C.violet }) }));
    S.lab1 = el('g');
    G.pill(S.lab1, AX.x1 + 30, B1 - 18, 'un événement', { size: 18, h: 34, bg: C.pRed, fg: C.tRed });
    S.lab2 = el('g');
    G.pill(S.lab2, AX.x1 + 30, B2 - 18, 'un décor', { size: 18, h: 34, bg: C.pGreen, fg: C.tGreen });

    S.chute = G.blogChute('L’effet observateur ne se supprime pas, il se réduit.', { y: 808 });
  }

  const bar = (e, x, base, h) => { e.setAttribute('y', base - h); e.setAttribute('height', Math.max(0.001, h)); };

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    pop(S.scene, t, 1.75, 310, 390);
    pop(S.heads, t, 1.9, 870, 216);

    // Le responsable entre, s'arrête, ressort
    let bx = STOP, bo = o0;
    if (live) {
      if (t < ENTER) { bx = DOOR; bo = 0; }
      else if (t < IN) { bx = DOOR + (STOP - DOOR) * easeInOut(prog(t, ENTER, 0.9)); bo = clamp(prog(t, ENTER, 0.25)); }
      else if (t < OUT) bx = STOP;
      else if (t < GONE) { bx = STOP + (DOOR - STOP) * easeInOut(prog(t, OUT, 0.9)); bo = 1 - clamp(prog(t, GONE - 0.25, 0.25)); }
      else if (t < ENTER2) { bx = DOOR; bo = 0; }
      else if (t < IN2) { bx = DOOR + (STOP - DOOR) * easeInOut(prog(t, ENTER2, 0.9)); bo = clamp(prog(t, ENTER2, 0.25)); }
      else bx = STOP;
    }
    S.boss.setAttribute('transform', `translate(${bx} 0)`);
    S.boss.setAttribute('opacity', bo);
    // Final (affiche) : le responsable est là, l'atelier en mode « observé »

    S.rows.forEach((r, k) => {
      rise(r.g, t, 2.0 + 0.12 * k, 0.35);
      const tOn = IN - 0.3 + 0.25 * k, tOff = OUT + 0.3 + 0.25 * k;
      const tOn2 = IN2 - 0.3 + 0.25 * k;
      const obs = !live ? 1 : t < tOn ? 0 : t < tOn + 0.3 ? prog(t, tOn, 0.3) : t < tOff ? 1 : t < tOn2 ? 1 - prog(t, tOff, 0.3) : prog(t, tOn2, 0.3);
      r.A.on.setAttribute('opacity', 1 - obs); r.A.off.setAttribute('opacity', obs);
      r.B.on.setAttribute('opacity', obs); r.B.off.setAttribute('opacity', 1 - obs);
      if (live && t >= tOn && t < tOn + 0.6) pulse(r.B.on, t, tOn, COLB, r.y, 0.1, 0.4);
      else if (live && t >= tOn2 && t < tOn2 + 0.6) pulse(r.B.on, t, tOn2, COLB, r.y, 0.1, 0.4);
      else r.B.on.setAttribute('transform', '');
    });

    // Carte 2
    pop(S.c2, t, 7.6, 600, 620);
    const h1 = live ? 68 * easeOut(prog(t, V1_T, 0.4)) : 68;
    bar(S.v1, 0, B1, h1);
    S.v1.setAttribute('opacity', live ? (t >= V1_T ? 1 : 0) : o0);
    S.v2.forEach((v, i) => {
      const t0 = V2_T(i + 1);
      bar(v.e, 0, B2, live ? v.h * easeOut(prog(t, t0, 0.3)) : v.h);
      v.e.setAttribute('opacity', live ? (t >= t0 ? 1 : 0) : o0);
    });
    pop(S.lab1, t, V1_T + 0.4, AX.x1 + 90, B1 - 18);
    pop(S.lab2, t, V2_T(12) + 0.3, AX.x1 + 75, B2 - 18);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
