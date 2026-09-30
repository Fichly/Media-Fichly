// Blog · QUALIOPI formation Lean · section « Pourquoi QUALIOPI est obligatoire pour financer une formation Lean »
// Mécanique : deux organismes vendent la même formation Lean. Les deux peuvent former.
// Pour l'organisme certifié, les portes des financements publics et mutualisés s'ouvrent et la facture est prise
// en charge (tout ou partie) ; pour l'autre, elles restent fermées et l'entreprise paie tout.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, slide, pulse } = G;
  const S = {};

  const LANE = i => 220 + i * 252, LH = 234;
  const CY = i => LANE(i) + LH / 2;
  const DOORS = [{ x: 612, l: ['CPF'] }, { x: 722, l: ['OPCO'] }, { x: 832, l: ['Plan de', 'développement'] }];
  const DW = 62, DH = 92;
  const INV = { x: 962, w: 168, h: 160 };
  const SAME_T = 2.9;
  const OPEN_T = k => 3.7 + 0.45 * k, OPEN_D = 0.45;
  const FILL0 = { t: 5.6, d: 1.0, level: 0.8 };
  const TRY_T = k => 7.4 + 0.45 * k;
  const FILL1 = { t: 9.1, d: 1.0 };
  const CHUTE_T = 10.9;

  function door(parent, cx, cy) {
    const x = cx - DW / 2, y = cy - 70;
    const g = el('g', {}, parent);
    el('rect', { x: x - 5, y: y - 5, width: DW + 10, height: DH + 5, rx: 8, fill: C.line }, g);
    const inside = el('rect', { x, y, width: DW, height: DH, rx: 4, fill: C.pLav }, g);
    const panel = el('g', {}, g);
    el('rect', { x, y, width: DW, height: DH, rx: 4, fill: C.blue }, panel);
    el('rect', { x: x + 8, y: y + 10, width: DW - 16, height: 30, rx: 3, fill: C.white, 'fill-opacity': 0.18 }, panel);
    el('rect', { x: x + 8, y: y + 48, width: DW - 16, height: 34, rx: 3, fill: C.white, 'fill-opacity': 0.18 }, panel);
    el('circle', { cx: x + DW - 11, cy: y + 46, r: 4, fill: C.yellow }, panel);
    return { g, inside, panel, hinge: x, y };
  }
  function setOpen(d, q) {
    // q : 0 fermée → 1 ouverte (le battant pivote sur ses gonds)
    const s = 1 - 0.82 * q;
    d.panel.setAttribute('transform', q <= 0 ? '' : `translate(${d.hinge} 0) scale(${s} 1) translate(${-d.hinge} 0)`);
    d.inside.setAttribute('fill', q > 0.05 ? C.pGreen : C.pLav);
  }
  function invoice(parent, cy) {
    const x = INV.x, y = cy - 88;
    const g = el('g', {}, parent);
    el('path', { d: `M ${x} ${y} L ${x + INV.w - 26} ${y} L ${x + INV.w} ${y + 26} L ${x + INV.w} ${y + INV.h} L ${x} ${y + INV.h} Z`, fill: C.white, stroke: C.line, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    text(g, x + 16, y + 30, 'Facture', { size: 17, weight: 700, fill: C.ink });
    const clip = G.clipRect(x + 10, y + INV.h - 10, INV.w - 20, 0);
    const fill = el('g', { 'clip-path': clip.url }, g);
    return { g, fill, clip: clip.rect, top: y + 46, bottom: y + INV.h - 10, x };
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Le label ouvre', 'les financements.', { size: 48 });
    G.blogChapeau('Même formation Lean, même prix : ce que change QUALIOPI, c’est qui peut la payer.');

    S.heads = el('g');
    [[64, 'L’organisme', 'start'], [415, 'La formation', 'middle'], [722, 'Financements publics ou mutualisés', 'middle'], [1046, 'Qui paie ?', 'middle']]
      .forEach(([x, s, a]) => text(S.heads, x, 204, s, { size: 17, weight: 700, fill: C.blue, anchor: a }));

    S.lanes = [0, 1].map(i => {
      const cy = CY(i), ok = i === 0;
      el('rect', { x: 40, y: LANE(i), width: 1120, height: LH, rx: 24, fill: C.card, stroke: C.line, 'stroke-width': 2 });
      const org = el('g');
      G.pill(org, 64, cy - 44, ok ? 'Certifié QUALIOPI' : 'Sans QUALIOPI', { size: 19, h: 36, bg: ok ? C.pGreen : C.pRed, fg: ok ? C.tGreen : C.tRed, icon: ok ? 'check' : 'cross' });
      G.para(org, 64, cy + 2, ok ? 'Attestation valide, périmètre actions de formation' : 'Peut former et vendre sa formation', 230, { size: 16, weight: 500, fill: C.ink, lh: 1.3 });

      const form = el('g');
      el('rect', { x: 335, y: cy - 62, width: 160, height: 104, rx: 14, fill: C.white, stroke: C.line, 'stroke-width': 2 }, form);
      el('rect', { x: 351, y: cy - 46, width: 34, height: 40, rx: 5, fill: C.pLav }, form);
      [0, 1, 2].forEach(r => el('rect', { x: 357, y: cy - 38 + r * 10, width: 22, height: 4, rx: 2, fill: C.blue, opacity: 0.6 }, form));
      text(form, 395, cy - 30, 'Formation', { size: 16, weight: 700, fill: C.ink });
      text(form, 395, cy - 10, 'Lean', { size: 16, weight: 700, fill: C.ink });
      G.check(form, 362, cy + 20, 10);
      text(form, 380, cy + 26, 'peut former', { size: 16, weight: 600, fill: C.tGreen });

      const doorsG = el('g');
      const doors = DOORS.map(d => {
        const dd = door(doorsG, d.x, cy);
        d.l.forEach((s, r) => text(doorsG, d.x, cy + 46 + r * 18, s, { size: d.l.length > 1 ? 15 : 17, weight: 700, fill: C.ink, anchor: 'middle' }));
        const mark = el('g');
        (ok ? G.check : G.cross)(mark, d.x + DW / 2, cy - 70, 13);
        return { ...dd, mark, cx: d.x };
      });

      const inv = invoice(el('g'), cy);
      const flowArrow = G.arrow(G.svg, `M 880 ${cy - 24} L ${INV.x - 12} ${cy - 24}`, { width: 3.5, head: 10, stroke: ok ? C.green : C.red, dash: ok ? null : '7 7' });
      if (ok) {
        el('rect', { x: inv.x + 10, y: inv.top, width: INV.w - 20, height: inv.bottom - inv.top, rx: 6, fill: C.green }, inv.fill);
        const hT = (inv.bottom - inv.top) * (1 - FILL0.level);
        text(inv.g, inv.x + INV.w / 2, inv.top + hT / 2 + 6, 'reste éventuel', { size: 15, weight: 600, fill: C.ink, anchor: 'middle' });
        text(inv.fill, inv.x + INV.w / 2, inv.top + hT + 42, 'prise en', { size: 17, weight: 700, fill: C.white, anchor: 'middle' });
        text(inv.fill, inv.x + INV.w / 2, inv.top + hT + 62, 'charge', { size: 17, weight: 700, fill: C.white, anchor: 'middle' });
      } else {
        el('rect', { x: inv.x + 10, y: inv.top, width: INV.w - 20, height: inv.bottom - inv.top, rx: 6, fill: C.red }, inv.fill);
        text(inv.fill, inv.x + INV.w / 2, inv.top + 44, '100 %', { size: 24, weight: 800, fill: C.white, anchor: 'middle' });
        text(inv.fill, inv.x + INV.w / 2, inv.top + 70, 'entreprise', { size: 17, weight: 700, fill: C.white, anchor: 'middle' });
      }
      return { org, form, doorsG, doors, inv, flowArrow, cy, ok };
    });

    S.chute = G.blogChute('QUALIOPI n’est pas obligatoire pour former, mais pour financer.', { y: 808 });
  }

  function setFill(inv, level) {
    const h = (inv.bottom - inv.top) * level;
    inv.clip.setAttribute('y', inv.bottom - h);
    inv.clip.setAttribute('height', Math.max(0.001, h));
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    rise(S.heads, t, 1.75, 0.35, 8);

    S.lanes.forEach((L, i) => {
      slide(L.org, t, 1.85 + 0.15 * i, 0.4, -50);
      rise(L.form, t, 2.05 + 0.15 * i, 0.4, 10);
      rise(L.doorsG, t, 2.2 + 0.15 * i, 0.4, 10);
      rise(L.inv.g, t, 2.35 + 0.15 * i, 0.4, 10);
      // Même formation des deux côtés
      if (live && t >= SAME_T && t < SAME_T + 0.8) pulse(L.form, t, SAME_T, 415, L.cy - 10, 0.07, 0.45);

      L.doors.forEach((d, k) => {
        if (L.ok) {
          const q = live ? easeInOut(prog(t, OPEN_T(k), OPEN_D)) : 1;
          setOpen(d, q);
          pop(d.mark, t, OPEN_T(k) + OPEN_D * 0.7, d.cx + DW / 2, L.cy - 70, 0.3);
        } else {
          setOpen(d, 0);
          // La porte résiste : petit tremblement, puis la croix
          const p = live ? prog(t, TRY_T(k), 0.35) : 1;
          const dx = p > 0 && p < 1 ? 4 * Math.sin(p * Math.PI * 6) * (1 - p) : 0;
          d.panel.setAttribute('transform', dx ? `translate(${dx} 0)` : '');
          pop(d.mark, t, TRY_T(k) + 0.3, d.cx + DW / 2, L.cy - 70, 0.3);
        }
      });

      const F = L.ok ? FILL0 : FILL1;
      const lvl = L.ok ? FILL0.level : 1;
      L.flowArrow.draw(live ? easeOut(prog(t, F.t - 0.5, 0.45)) : 1);
      L.flowArrow.g.setAttribute('opacity', live ? 1 : o);
      setFill(L.inv, live ? lvl * easeInOut(prog(t, F.t, F.d)) : lvl);
    });
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
