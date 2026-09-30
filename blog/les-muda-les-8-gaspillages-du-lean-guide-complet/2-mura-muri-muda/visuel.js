// Blog · Les MUDA · section « Muda, Mura, Muri : trois pertes à ne pas confondre »
// Mécanique : deux ateliers, même volume sur huit semaines. En haut, la charge est irrégulière (Mura) : une semaine à
// moitié vide, la suivante au-dessus de la capacité (Muri, en rouge). Chaque pic fabrique des défauts, des attentes et
// des stocks tampons (Muda) qui tombent dans le bac. On les supprime à mi-parcours : ils reviennent au pic suivant,
// c'est essuyer le sol sans fermer le robinet. En bas, la même charge lissée reste sous la capacité : rien ne tombe.
// Hypothèse : profil de charge illustratif (55 à 135 % de la capacité, moyenne 92,5 % dans les deux ateliers).
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const LOADS = [55, 130, 60, 125, 50, 135, 65, 120];
  const FLAT = 92.5, KPX = 1.1;
  const BARX = k => 96 + k * 86, BW = 58;
  const LANES = [
    { y0: 176, base: 422, irr: true },
    { y0: 470, base: 716, irr: false },
  ];
  const T_W0 = 2.6, T_WK = 0.95;               // semaine k : croissance à T_W0 + k × T_WK
  const weekT = k => T_W0 + k * T_WK;
  const TOK = ['red', 'lightBlue', 'yellow'];  // défauts, attentes, stocks tampons
  const BIN = { x: 862, y: 330, w: 250, h: 84 };
  const T_WIPE = weekT(4) + 0.55, D_WIPE = 0.7;
  const END_T = weekT(8) + 0.4, CHUTE_T = END_T + 0.9;
  const S = {};

  // Jetons : 3 par pic (semaines au-dessus de la capacité), emplacement dans le bac
  const tokens = [];
  { let slot = 0; LOADS.forEach((l, k) => { if (l > 100) { if (k === 5) slot = 0; TOK.forEach((c, j) => tokens.push({ k, j, c, slot: slot++, t0: weekT(k) + 0.55 + 0.12 * j })); } }); }
  const slotXY = s => ({ x: BIN.x + 30 + (s % 6) * 38, y: BIN.y + BIN.h - 24 - Math.floor(s / 6) * 34 });
  const wipedAt = tk => (tk.k < 5 ? T_WIPE : Infinity);

  function build() {
    G.templateBlog();
    G.blogTitle('Mura, Muri,', 'puis Muda.');
    G.blogChapeau('La charge irrégulière surcharge les pics, et la surcharge fabrique les gaspillages.');

    S.lanes = LANES.map((L, li) => {
      const o = { ...L };
      G.card(40, L.y0, 1120, 280);
      o.head = el('g');
      const p = G.pill(o.head, 64, L.y0 + 38, L.irr ? 'Charge irrégulière' : 'Même volume, lissé', { size: 20, h: 36, bg: L.irr ? C.pRed : C.pGreen, fg: L.irr ? C.tRed : C.tGreen });
      fit(text(o.head, 64 + p.w + 14, L.y0 + 45, L.irr ? 'une semaine à moitié vide, la suivante en heures supplémentaires' : 'lissage de la charge, taille de lot, planification', { size: 18, weight: 500, fill: C.ink }), 1136, `sous-titre ${li}`);
      // Axe, capacité
      el('line', { x1: 72, y1: L.base + 2, x2: 790, y2: L.base + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });
      o.cap = el('g');
      el('line', { x1: 72, y1: L.base - 100 * KPX, x2: 790, y2: L.base - 100 * KPX, stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, o.cap);
      text(o.cap, 72, L.base - 100 * KPX - 8, 'capacité', { size: 16, weight: 700, fill: C.blue });
      // Barres
      o.bars = LOADS.map((l, k) => {
        const v = L.irr ? l : FLAT;
        const g = el('g');
        const body = el('rect', { x: BARX(k), width: BW, rx: 5, fill: L.irr ? C.lightBlue : C.green }, g);
        const over = el('rect', { x: BARX(k), width: BW, rx: 5, fill: C.red }, g);
        text(g, BARX(k) + BW / 2, L.base + 24, `S${k + 1}`, { size: 15, weight: 600, fill: C.ink, anchor: 'middle' });
        return { g, body, over, v };
      });
      // Bac à MUDA
      const by = L.y0 + (BIN.y - 176);
      o.bin = el('g');
      text(o.bin, BIN.x, by - 70, 'Muda', { size: 22, weight: 800, fill: L.irr ? C.tRed : C.tGreen });
      fit(text(o.bin, BIN.x + 70, by - 70, 'défauts, attentes,', { size: 16, weight: 500, fill: C.ink }), 1136, 'bac 1');
      fit(text(o.bin, BIN.x, by - 48, 'stocks tampons', { size: 16, weight: 500, fill: C.ink }), 1136, 'bac 2');
      el('rect', { x: BIN.x, y: by, width: BIN.w, height: BIN.h, rx: 14, fill: L.irr ? C.pRed : C.pGreen, stroke: L.irr ? C.red : C.green, 'stroke-width': 2.5, 'stroke-dasharray': L.irr ? '' : '7 6' }, o.bin);
      o.by = by;
      if (!L.irr) text(o.bin, BIN.x + BIN.w / 2, by + BIN.h / 2 + 7, 'rien ne tombe', { size: 19, weight: 700, fill: C.tGreen, anchor: 'middle' });
      return o;
    });
    // Étiquettes de la chaîne (atelier du haut)
    const L0 = S.lanes[0];
    S.tagMura = el('g');
    G.pill(S.tagMura, BARX(4) + BW / 2, L0.base - 50 * KPX - 22, 'Mura', { size: 17, h: 28, pad: 12, bg: C.white, fg: C.blue, anchor: 'middle' });
    S.tagMuri = el('g');
    G.pill(S.tagMuri, BARX(1) + BW / 2, L0.base - 130 * KPX - 20, 'Muri', { size: 17, h: 28, pad: 12, bg: C.red, fg: C.white, anchor: 'middle' });
    S.tokens = tokens.map(tk => {
      const r = el('rect', { x: -14, y: -14, width: 28, height: 28, rx: 6, fill: C[tk.c], stroke: C.white, 'stroke-width': 2 });
      return { ...tk, r };
    });
    // Suppression (éponge) et message
    S.sponge = el('g');
    el('rect', { x: -26, y: -16, width: 52, height: 32, rx: 10, fill: C.teal }, S.sponge);
    el('rect', { x: -26, y: -16, width: 52, height: 10, rx: 5, fill: C.yellow }, S.sponge);
    S.msg1 = text(G.svg, BIN.x, BIN.y + BIN.h + 30, 'On supprime les MUDA…', { size: 17, weight: 700, fill: C.tRed });
    S.msg2 = text(G.svg, BIN.x, BIN.y + BIN.h + 30, 'ils reviennent au pic suivant.', { size: 17, weight: 700, fill: C.tRed });
    fit(S.msg2, 1140, 'message');

    S.chute = G.blogChute('Le Mura produit du Muri, et le Muri produit du Muda.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;

    S.lanes.forEach((L, li) => {
      pop(L.head, t, 1.7 + 0.2 * li, 300, L.y0 + 38);
      L.cap.setAttribute('opacity', fo * (live ? clamp(prog(t, 2.1 + 0.2 * li, 0.3)) : 1));
      pop(L.bin, t, 2.3 + 0.2 * li, BIN.x + BIN.w / 2, L.by + 20);
      L.bars.forEach((b, k) => {
        const g = live ? easeOut(prog(t, weekT(k), 0.45)) : 1;
        const v = b.v * g;
        const low = Math.min(v, 100), hi = Math.max(0, v - 100);
        b.body.setAttribute('y', L.base - low * KPX);
        b.body.setAttribute('height', Math.max(0.001, low * KPX));
        b.over.setAttribute('y', L.base - v * KPX);
        b.over.setAttribute('height', Math.max(0.001, hi * KPX + (hi > 0 ? 5 : 0)));
        b.over.setAttribute('opacity', hi > 0 ? 1 : 0);
        b.g.setAttribute('opacity', fo * (live ? clamp(prog(t, weekT(k), 0.2)) : 1));
        if (live && hi > 0 && t >= weekT(k) + 0.45 && t < weekT(k) + 0.95) pulse(b.over, t, weekT(k) + 0.45, BARX(k) + BW / 2, L.base - v * KPX, 0.12, 0.4);
        else b.over.setAttribute('transform', '');
      });
    });
    pop(S.tagMura, t, weekT(4) + 0.3, BARX(4) + BW / 2, 330);
    pop(S.tagMuri, t, weekT(1) + 0.5, BARX(1) + BW / 2, 270);

    // Jetons : tombent du pic dans le bac ; ceux des premiers pics sont supprimés à mi-parcours
    const L0 = S.lanes[0];
    S.tokens.forEach(tk => {
      const top = { x: BARX(tk.k) + BW / 2, y: L0.base - LOADS[tk.k] * KPX - 10 };
      const dst = slotXY(tk.slot);
      let x = dst.x, y = dst.y, o = 1;
      const w = wipedAt(tk);
      if (!live) o = w === Infinity ? 1 : 0;
      else {
        const p = prog(t, tk.t0, 0.6);
        const e = easeInOut(p);
        x = top.x + (dst.x - top.x) * e;
        y = top.y + (dst.y - top.y) * e - 60 * Math.sin(Math.PI * p);
        o = p > 0 ? 1 : 0;
        if (t >= w) o *= 1 - clamp((t - w - D_WIPE * 0.3 - 0.06 * (tk.slot % 6)) / 0.2);
      }
      tk.r.setAttribute('transform', `translate(${x} ${y})`);
      tk.r.setAttribute('opacity', fo * o);
    });
    // Éponge : un passage de gauche à droite
    const sp = live ? prog(t, T_WIPE, D_WIPE) : 0;
    S.sponge.setAttribute('transform', `translate(${BIN.x + 20 + (BIN.w - 40) * easeInOut(sp)} ${BIN.y + BIN.h / 2 + 4 * Math.sin(sp * 18)})`);
    S.sponge.setAttribute('opacity', live && sp > 0 && sp < 1 ? 1 : 0);
    const m1 = live ? clamp(prog(t, T_WIPE, 0.3)) * (1 - clamp(prog(t, weekT(5) + 0.6, 0.3))) : 0;
    S.msg1.setAttribute('opacity', m1);
    S.msg2.setAttribute('opacity', fo * (live ? clamp(prog(t, weekT(5) + 0.9, 0.3)) : 1));

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
