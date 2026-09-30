// Blog · Lean Manufacturing · section « Les outils du Lean Manufacturing, et quand les utiliser »
// Mécanique : la boîte à outils est pleine, mais un outil ne sort que si un problème l'appelle.
// Chaque observation de terrain s'allume à son tour et va chercher son outil ; ceux qu'aucun problème
// n'appelle restent dans la boîte.
// Rendu déterministe : window.FICHE.draw(t), boucle de 13 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, slide, pulse } = G;

  const ROWS = [
    { obs: 'Des stocks et des attentes entre les postes', tool: 'VSM', gain: 'Voir la chaîne et le délai' },
    { obs: 'Des recherches d’outils, des postes encombrés', tool: '5S', gain: 'Chaque chose a sa place' },
    { obs: 'Des changements de série longs, de grands lots', tool: 'SMED', gain: 'Des lots plus petits' },
    { obs: 'Des pannes répétées', tool: 'TPM', gain: 'Des équipements fiables' },
    { obs: 'Des erreurs d’assemblage qui reviennent', tool: 'Poka-yoke', gain: 'L’erreur rendue impossible' },
  ];
  // Ordre des outils dans la boîte (mélangés, avec ceux qu'aucun problème n'appelle ici)
  const BOX = ['Kanban', 'TPM', '5 Pourquoi', 'VSM', 'Standard', 'Poka-yoke', 'DMAIC', '5S', 'SMED'];
  const ROW_Y = i => 264 + 74 * i;
  const SLOT = { x: 690, w: 156 };
  const TRAY_Y = 706;
  const CALL = i => 3.3 + 1.05 * i;
  const FLY = 0.6;
  const REST_T = 8.7, CHUTE_T = 9.4;

  const S = {};

  function eye(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx - 15} ${cy} Q ${cx} ${cy - 13} ${cx + 15} ${cy} Q ${cx} ${cy + 13} ${cx - 15} ${cy} Z`, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, g);
    el('circle', { cx, cy, r: 5, fill: C.blue }, g);
    return g;
  }
  function chip(parent, label, x, cy, called) {
    return G.pill(parent, x, cy, label, { size: 20, h: 38, pad: 16, bg: called ? C.blue : C.white, fg: called ? C.white : C.blue });
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Partir du problème,', 'pas de l’outil.');
    G.blogChapeau('Un outil ne sert qu’à répondre à un problème précis, observé sur le terrain.');

    G.card(40, 176, 1120, 440);
    S.headL = text(G.svg, 70, 214, 'Ce que vous observez', { size: 19, weight: 700, fill: C.blue });
    S.headR = text(G.svg, SLOT.x + SLOT.w / 2, 214, 'L’outil', { size: 19, weight: 700, fill: C.blue, anchor: 'middle' });
    text(G.svg, SLOT.x + SLOT.w + 22, 214, 'Ce qu’il apporte', { size: 19, weight: 700, fill: C.blue });

    S.rows = ROWS.map((r, i) => {
      const cy = ROW_Y(i);
      const g = el('g');
      const bg = el('rect', { x: 60, y: cy - 27, width: 570, height: 54, rx: 14, fill: C.pLav }, g);
      eye(g, 90, cy);
      fit(text(g, 118, cy + 7, r.obs, { size: 20, weight: 700, fill: C.ink }), 620, `observation ${i + 1}`);
      const glow = el('rect', { x: 59, y: cy - 28, width: 572, height: 56, rx: 15, fill: 'none', stroke: C.blue, 'stroke-width': 3.5, opacity: 0 });
      const arr = G.arrow(G.svg, `M 638 ${cy} L ${SLOT.x - 10} ${cy}`, { width: 3, head: 9 });
      el('rect', { x: SLOT.x, y: cy - 22, width: SLOT.w, height: 44, rx: 22, fill: 'none', stroke: C.line, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' });
      const gain = el('g');
      fit(text(gain, SLOT.x + SLOT.w + 22, cy + 7, r.gain, { size: 19, weight: 500, fill: C.ink }), 1140, `apport ${i + 1}`);
      return { g, glow, arr, gain, cy };
    });

    // La boîte à outils
    el('rect', { x: 40, y: 632, width: 1120, height: 112, rx: 22, fill: C.pLav });
    el('rect', { x: 40, y: 632, width: 1120, height: 112, rx: 22, fill: 'none', stroke: C.blue, 'stroke-width': 2, 'stroke-opacity': 0.25 });
    text(G.svg, 64, 665, 'La boîte à outils', { size: 18, weight: 700, fill: C.blue });
    S.restNote = el('g');
    text(S.restNote, 1136, 665, 'Aucun problème ne les appelle ici : ils restent dans la boîte.', { size: 17, weight: 600, fill: C.ink, anchor: 'end' });

    // Jetons des outils : position dans la boîte, et emplacement de destination s'ils sont appelés
    let x = 64;
    const gap = 12;
    const widths = BOX.map(b => { const p = chip(G.svg, b, 0, -100, false); const w = p.w; p.g.remove(); return w; });
    const total = widths.reduce((a, b) => a + b, 0) + gap * (BOX.length - 1);
    x = 600 - total / 2;
    S.chips = BOX.map((b, k) => {
      const row = ROWS.findIndex(r => r.tool === b);
      const w = widths[k];
      const home = { x: x + w / 2, y: TRAY_Y };
      x += w + gap;
      const ghost = el('rect', { x: home.x - w / 2, y: TRAY_Y - 19, width: w, height: 38, rx: 19, fill: 'none', stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', 'stroke-opacity': 0.5, opacity: 0 });
      const g = el('g');
      const inner = el('g', {}, g);
      const idle = chip(inner, b, -w / 2, 0, false);
      const on = el('g', { opacity: 0 }, inner);
      chip(on, b, -w / 2, 0, true);
      const dest = row >= 0 ? { x: SLOT.x + SLOT.w / 2, y: ROW_Y(row) } : null;
      return { g, on, home, dest, row, w, ghost };
    });

    S.chute = G.blogChute('Sans problème identifié, un outil ne change rien.', { y: 804 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    S.rows.forEach((r, i) => {
      slide(r.g, t, 1.75 + 0.12 * i, 0.4, -60);
      const c = CALL(i);
      r.glow.setAttribute('opacity', live ? G.window01(t, c - 0.15, c + FLY + 0.35, 0.15) : 0);
      r.arr.draw(live ? easeOut(prog(t, c, 0.3)) : 1);
      r.arr.g.setAttribute('opacity', live ? 1 : o);
      rise(r.gain, t, c + FLY, 0.35, 10);
    });

    S.chips.forEach((ch, k) => {
      let x = ch.home.x, y = ch.home.y, s = 1, called = 0, op = 1;
      if (ch.dest) {
        const c = CALL(ch.row) + 0.1;
        const p = live ? prog(t, c, FLY) : 1;
        const e = easeInOut(p);
        x = ch.home.x + (ch.dest.x - ch.home.x) * e;
        y = ch.home.y + (ch.dest.y - ch.home.y) * e - 60 * Math.sin(Math.PI * p);
        called = live ? clamp(prog(t, c, 0.2)) : 1;
        s = p > 0 && p < 1 ? 1 + 0.08 * Math.sin(Math.PI * p) : 1;
        if (fading(t)) op = o;
        ch.ghost.setAttribute('opacity', (live ? clamp(prog(t, c, 0.3)) : 1) * (fading(t) ? o : 1));
      }
      // La boîte se remplit au début
      if (live) op = clamp(prog(t, 2.3 + 0.06 * k, 0.3));
      ch.g.setAttribute('transform', `translate(${x} ${y})` + (s === 1 ? '' : ` scale(${s})`));
      ch.g.setAttribute('opacity', op);
      ch.on.setAttribute('opacity', called);
      if (!ch.dest) pulse(ch.g.firstChild, live ? t : -1, REST_T + 0.08 * k, 0, 0, 0.1, 0.4);
    });
    rise(S.restNote, t, REST_T, 0.4, 8);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 13, build, draw });
})();
