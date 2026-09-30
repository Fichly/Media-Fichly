// Blog · Types de maintenance · section « Maintenance préventive systématique : le calendrier, et ce qu'il coûte »
// Mécanique : huit exemplaires d'une même pièce s'usent ; l'échéance fixe doit se caler sur le plus faible.
// Quand la durée de vie est régulière, on jette peu ; quand elle est dispersée (même moyenne), on jette beaucoup.
// Durées de vie illustratives (hypothèse), même moyenne dans les deux cas.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const BX = 336, SCALE = 5.6;                         // x du temps 0, px par unité de durée de vie
  const CASES = [
    { y: 176, lives: [96, 101, 98, 104, 99, 95, 102, 100], tag: 'Durée de vie régulière', ok: true,
      txt: 'L’usure suit le temps : l’échéance tombe près de la fin de vie de chaque pièce.' },
    { y: 468, lives: [58, 122, 86, 135, 66, 106, 94, 128], tag: 'Durée de vie dispersée', ok: false,
      txt: 'Même durée de vie moyenne, mais l’échéance doit se caler sur le plus faible.' },
  ];
  const CARD_H = 280, ROW = 24, BAR_H = 16;
  const T = { grow: 2.5, v: 44, ech: 6.0, waste: 7.3, wasteD: 1.4, twice: 9.0, chute: 10.4 };

  const S = { cases: [] };

  function build() {
    G.templateBlog();
    G.blogTitle('Le coût caché', 'du calendrier.');
    G.blogChapeau(`Huit exemplaires de la même pièce, remplacés à la même échéance. Exemple illustratif.`);

    CASES.forEach((c, ci) => {
      const K = { ...c };
      G.card(40, c.y, 1120, CARD_H);
      const E = Math.min(...c.lives) - 3;
      K.E = E;
      const sum = c.lives.reduce((a, b) => a + b, 0);
      K.pct = Math.round(100 * c.lives.reduce((a, L) => a + (L - E), 0) / sum);

      // Colonne gauche : cas, explication, compteur
      K.head = el('g');
      G.pill(K.head, 64, c.y + 38, c.tag, { size: 19, h: 34, bg: c.ok ? C.pGreen : C.pRed, fg: c.ok ? C.tGreen : C.tRed });
      G.para(K.head, 64, c.y + 82, c.txt, 236, { size: 17, weight: 500, fill: C.ink, lh: 1.25 });
      K.count = el('g');
      K.num = text(K.count, 64, c.y + 224, '', { size: 46, weight: 800, fill: c.ok ? C.tGreen : C.tRed });
      text(K.count, 64, c.y + 252, 'de durée de vie jetée', { size: 17, weight: 600, fill: c.ok ? C.tGreen : C.tRed });

      // Barres : une par exemplaire
      const y0 = c.y + 52;
      K.axis = el('g');
      text(K.axis, BX, c.y + 36, 'Durée de vie de chaque exemplaire', { size: 16, weight: 600, fill: C.ink });
      el('line', { x1: BX, y1: y0 - 8, x2: BX, y2: y0 + 8 * ROW - 2, stroke: C.line, 'stroke-width': 3 }, K.axis);
      K.bars = c.lives.map((L, i) => {
        const y = y0 + i * ROW;
        el('rect', { x: BX, y, width: 140 * SCALE, height: BAR_H, rx: BAR_H / 2, fill: C.pLav, opacity: 0.5 }, K.axis);
        const clip = G.clipRect(BX, y - 2, 0, BAR_H + 4);
        const g = el('g', { 'clip-path': clip.url });
        el('rect', { x: BX, y, width: L * SCALE, height: BAR_H, rx: BAR_H / 2, fill: C.lightBlue }, g);
        // partie jetée (de l'échéance à la fin de vie)
        const wclip = G.clipRect(BX + E * SCALE, y - 2, 0, BAR_H + 4);
        const w = el('g', { 'clip-path': wclip.url });
        el('rect', { x: BX + E * SCALE, y, width: (L - E) * SCALE, height: BAR_H, rx: 3, fill: C.yellow }, w);
        for (let k = 0; k < (L - E) * SCALE; k += 12) el('line', { x1: BX + E * SCALE + k, y1: y + BAR_H, x2: BX + E * SCALE + k + 10, y2: y, stroke: C.white, 'stroke-width': 3, opacity: 0.55 }, w);
        const fail = el('g');
        G.cross(fail, BX + L * SCALE, y + BAR_H / 2, 10);
        return { L, y, clip: clip.rect, wclip: wclip.rect, fail, xEnd: BX + L * SCALE };
      });
      K.weak = c.lives.indexOf(Math.min(...c.lives));

      // Échéance : ligne verticale calée sur le plus faible
      K.ech = el('g');
      const ex = BX + E * SCALE;
      el('line', { x1: ex, y1: y0 - 12, x2: ex, y2: y0 + 8 * ROW, stroke: C.blue, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, K.ech);
      const lab = G.pill(K.ech, ex, y0 + 8 * ROW + 16, 'échéance fixe', { size: 16, h: 28, pad: 12, bg: C.blue, fg: C.white, anchor: 'middle' });
      K.ex = ex;

      K.wasteLab = el('g');
      const wt = text(K.wasteLab, 1136, y0 + 8 * ROW + 22, 'jeté en bon état', { size: 16, weight: 700, fill: C.tYellow, anchor: 'end' });
      fit(wt, 1140, `jeté ${ci}`);
      el('rect', { x: measure(wt).x - 34, y: y0 + 8 * ROW + 9, width: 26, height: 14, rx: 3, fill: C.yellow }, K.wasteLab);
      S.cases.push(K);
    });

    // Payée deux fois (cas dispersé)
    S.twice = el('g');
    const tw = G.pill(S.twice, 0, 0, `payée deux fois : la pièce, et l’arrêt`, { size: 17, h: 32, pad: 14, bg: C.pYellow, fg: C.tYellow });
    tw.g.setAttribute('transform', `translate(${1136 - tw.w} ${468 + 36})`);
    S.twiceC = { x: 1136 - tw.w / 2, y: 468 + 36 };

    S.chute = G.blogChute('Caler l’échéance sur le plus faible, c’est jeter beaucoup.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.cases.forEach((K, ci) => {
      pop(K.head, t, 1.75 + 0.2 * ci, 180, K.y + 60);
      K.axis.setAttribute('opacity', live ? clamp(prog(t, 2.0 + 0.2 * ci, 0.3)) : o);
      K.bars.forEach((b, i) => {
        // croissance : l'usure avance au même rythme pour toutes les pièces
        const reach = live ? Math.max(0, T.v * (t - T.grow)) : b.L;
        const len = Math.min(b.L, reach);
        b.clip.setAttribute('width', len > 0 ? len * SCALE + 2 : 0.001);
        const tFail = T.grow + b.L / T.v;
        // la croix de panne : visible pendant l'historique, puis s'efface quand l'échéance remplace la pièce
        const fo = live ? clamp(prog(t, tFail, 0.2)) * (1 - clamp(prog(t, T.waste, 0.5))) : 0;
        b.fail.setAttribute('opacity', fo);
        // partie jetée : balayage de gauche à droite après l'échéance
        const wl = live ? (b.L - K.E) * SCALE * easeInOut(prog(t, T.waste, T.wasteD)) : (b.L - K.E) * SCALE;
        b.wclip.setAttribute('width', wl > 0.5 ? wl + 2 : 0.001);
      });
      // échéance : glisse de la droite vers le plus faible
      let dx = 0, eo = o;
      if (live) { const p = prog(t, T.ech, 0.8); dx = (1 - easeInOut(p)) * (1110 - K.ex); eo = clamp(p / 0.2); }
      K.ech.setAttribute('transform', dx ? `translate(${dx} 0)` : '');
      K.ech.setAttribute('opacity', eo);
      if (live && t >= T.ech + 0.8 && t < T.ech + 1.7) pulse(K.bars[K.weak].fail, t, T.ech + 0.8, K.bars[K.weak].xEnd, K.bars[K.weak].y + BAR_H / 2, 0.5, 0.5);
      K.wasteLab.setAttribute('opacity', live ? clamp(prog(t, T.waste + 0.6, 0.4)) : o);
      // compteur
      const p = live ? easeOut(prog(t, T.waste, T.wasteD)) : 1;
      K.num.textContent = `${Math.round(K.pct * p)}${NB}%`;
      K.count.setAttribute('opacity', live ? clamp(prog(t, T.waste - 0.2, 0.3)) : o);
    });
    pop(S.twice, t, T.twice, S.twiceC.x, S.twiceC.y);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
