// Blog · Financement formation Lean · section « Quel financement selon votre situation ? »
// Mécanique : la même formation (une barre = son coût pédagogique) pour trois statuts. Pour chacun, les dispositifs
// viennent s'empiler dans la barre, dans l'ordre de l'article (d'abord ce qu'on a, puis le complément lié au statut) ;
// ce qui reste à la fin est le reste à charge. Le FNE-Formation reste barré dans la réserve : il n'existe plus.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, slide, pulse } = G;
  const S = {};

  const COL = { CPF: C.lightBlue, OPCO: C.teal, ENT: C.violet, AIF: C.yellow, RAC: C.red };
  const TRAY = [
    { k: 'CPF', s: 'CPF' }, { k: 'OPCO', s: 'OPCO' }, { k: 'ENT', s: 'Employeur (plan, abondement)' }, { k: 'AIF', s: 'AIF France Travail' },
  ];
  const BAR = { x: 426, w: 496, h: 46 };
  const ROWS = [
    { who: 'Salarié, projet porté par l’entreprise', how: 'OPCO + plan de développement des compétences',
      layers: [{ k: 'OPCO', s: 'OPCO', f: 0.68 }, { k: 'ENT', s: 'Entreprise', f: 0.32 }], rac: '0 €', note: 'souvent' },
    { who: 'Salarié, démarche personnelle', how: 'CPF, abondé par l’employeur si possible',
      layers: [{ k: 'CPF', s: 'CPF', f: 0.62 }, { k: 'ENT', s: 'Employeur', f: 0.32 }, { k: 'RAC', s: '150 €', f: 0.06 }], rac: '150 €', note: 'sauf si l’employeur abonde' },
    { who: 'Demandeur d’emploi', how: 'CPF exonéré des 150 €, puis AIF de France Travail',
      layers: [{ k: 'CPF', s: 'CPF', f: 0.58 }, { k: 'AIF', s: 'AIF', f: 0.42 }], rac: '0 €', note: 'souvent' },
  ];
  const ROW_Y = i => 334 + 150 * i;
  const LAYER_T = (i, k) => 2.9 + 2.45 * i + 0.7 * k, LAYER_D = 0.55;
  const RES_T = i => LAYER_T(i, ROWS[i].layers.length - 1) + 0.7;
  const CHUTE_T = 10.8;

  function build() {
    G.templateBlog();
    G.blogTitle('Chaque statut', 'a son montage.');
    G.blogChapeau('On part de ce qu’on a, puis on complète : le reste à charge dépend du statut.');

    // Réserve des dispositifs
    S.tray = el('g');
    text(S.tray, 60, 208, 'Les dispositifs', { size: 17, weight: 700, fill: C.blue });
    let x = 210;
    S.chips = {};
    TRAY.forEach(d => {
      const g = el('g', {}, S.tray);
      const p = G.pill(g, x, 202, d.s, { size: 16, h: 32, pad: 14, bg: COL[d.k], fg: d.k === 'AIF' ? C.ink : C.white });
      S.chips[d.k] = { g, cx: x + p.w / 2 };
      x += p.w + 10;
    });
    const fne = el('g', {}, S.tray);
    const fp = G.pill(fne, x + 8, 202, 'FNE-Formation', { size: 16, h: 32, pad: 14, bg: C.line, fg: C.ink });
    el('line', { x1: x + 18, y1: 202, x2: x + 8 + fp.w - 10, y2: 202, stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' }, fne);
    fit(text(fne, x + 8 + fp.w + 10, 208, 'supprimé fin 2024', { size: 15, weight: 600, fill: C.tRed }), 1160, 'note FNE');
    fit(fne, 1160, 'réserve');

    text(G.svg, BAR.x, 252, 'Coût pédagogique de la formation', { size: 16, weight: 600, fill: C.ink });
    text(G.svg, 1046, 252, 'Reste à charge', { size: 16, weight: 600, fill: C.ink, anchor: 'middle' });

    S.rows = ROWS.map((r, i) => {
      const cy = ROW_Y(i);
      el('rect', { x: 40, y: cy - 64, width: 1120, height: 128, rx: 22, fill: C.card, stroke: C.line, 'stroke-width': 2 });
      el('rect', { x: BAR.x, y: cy - BAR.h / 2, width: BAR.w, height: BAR.h, rx: 10, fill: C.white, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
      const lab = el('g');
      fit(text(lab, 64, cy - 8, r.who, { size: 18, weight: 700, fill: C.ink }), 408, `profil ${i}`);
      G.para(lab, 64, cy + 18, r.how, 320, { size: 15, weight: 500, fill: C.ink, lh: 1.25 });
      let acc = 0;
      const layers = r.layers.map(L => {
        const x0 = BAR.x + BAR.w * acc;
        acc += L.f;
        const g = el('g');
        const rect = el('rect', { x: x0 + 1.5, y: cy - BAR.h / 2 + 1.5, width: BAR.w * L.f - 3, height: BAR.h - 3, rx: 8, fill: COL[L.k] }, g);
        const tx = text(g, x0 + BAR.w * L.f / 2, cy + 6, L.s, { size: L.k === 'RAC' ? 15 : 17, weight: 700, fill: L.k === 'AIF' ? C.ink : C.white, anchor: 'middle' });
        if (L.k === 'RAC') { tx.setAttribute('y', cy - BAR.h / 2 - 8); tx.setAttribute('fill', C.tRed); }
        return { g, rect, x0, w: BAR.w * L.f, k: L.k };
      });
      const res = el('g');
      const zero = r.rac === '0 €';
      text(res, 1046, cy + 4, r.rac, { size: 32, weight: 800, fill: zero ? C.tGreen : C.tRed, anchor: 'middle' });
      fit(text(res, 1046, cy + 30, r.note, { size: 15, weight: 600, fill: C.ink, anchor: 'middle' }), 1156, `note ${i}`, 936);
      return { lab, layers, res, cy };
    });

    S.chute = G.blogChute('Les financements se cumulent, ils ne s’excluent pas.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    rise(S.tray, t, 1.75, 0.35, 8);

    const pulses = {};
    S.rows.forEach((r, i) => {
      slide(r.lab, t, 1.9 + 0.12 * i, 0.4, -50);
      r.layers.forEach((L, k) => {
        const t0 = LAYER_T(i, k);
        const q = live ? easeOut(prog(t, t0, LAYER_D)) : 1;
        L.rect.setAttribute('width', Math.max(0.001, (L.w - 3) * q));
        L.g.setAttribute('opacity', live ? (t >= t0 ? 1 : 0) : o);
        if (live && L.k !== 'RAC' && t >= t0 - 0.2 && t < t0 + 0.5) pulses[L.k] = t0 - 0.15;
        const lbl = L.g.lastChild;
        lbl.setAttribute('opacity', live ? clamp(prog(t, t0 + LAYER_D * 0.6, 0.2)) : 1);
      });
      pop(r.res, t, RES_T(i), 1046, r.cy, 0.35);
    });
    Object.values(S.chips).forEach(c => c.g.setAttribute('transform', ''));
    Object.entries(pulses).forEach(([k, t0]) => pulse(S.chips[k].g, t, t0, S.chips[k].cx, 202, 0.12, 0.4));
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
