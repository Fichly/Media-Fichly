// Blog · MTBF et MTTR · section « Pourquoi MTBF et MTTR donnent-ils ensemble la disponibilité ? »
// (refait l'image 2_MTBF_MTTR_disponibilite)
// Mécanique : un cycle moyen = 4 h de marche (MTBF) + 40 min de remise en service (MTTR) : disponibilité 4 / 4,67.
// Le cycle se recopie trois fois et reconstruit exactement les 14 h requises de la journée (3 pannes) :
// 12 h de fonctionnement sur 14 h, même 85,7 %. Les deux chemins se contrôlent l'un l'autre.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const X0 = 75, PXH = 75, CY = 270, CH = 60, FY = 496;
  const GW = 4 * PXH, RW = 40 / 60 * PXH, CW = GW + RW;

  function cycle(parent, x, y, labels) {
    const g = el('g', {}, parent);
    el('rect', { x, y, width: GW, height: CH, rx: 8, fill: C.green }, g);
    el('rect', { x: x + GW - 8, y, width: 8, height: CH, fill: C.green }, g);
    el('rect', { x: x + GW, y, width: RW, height: CH, fill: C.red }, g);
    const lab = labels ? text(g, x + GW / 2, y + 38, `4${NB}h`, { size: 20, weight: 700, fill: C.white, anchor: 'middle' }) : null;
    return { g, lab };
  }
  const br = (parent, x0, x1, y, dir, stroke) => el('path', { d: `M ${x0} ${y + 10 * dir} L ${x0} ${y} L ${x1} ${y} L ${x1} ${y + 10 * dir}`, fill: 'none', stroke, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);

  function build() {
    G.templateBlog();
    G.blogTitle('Deux chemins,', `même 85,7${NB}%.`);
    G.blogChapeau(`Poste de référence : 14 h requises, 3 pannes, 2 h d’arrêt. MTBF 4 h, MTTR 40 min.`);

    // ----- Carte 1 : le cycle moyen -----
    G.card(40, 176, 1120, 226);
    S.p1 = el('g');
    G.pill(S.p1, 70, 214, 'Chemin 1 : le cycle moyen', { size: 20, h: 38, bg: C.blue, fg: C.white });
    S.gBar = el('rect', { x: X0, y: CY, width: 0, height: CH, rx: 8, fill: C.green });
    S.gLab = text(G.svg, X0 + GW / 2, CY + 38, `MTBF : 4${NB}h`, { size: 20, weight: 700, fill: C.white, anchor: 'middle' });
    S.rBar = el('rect', { x: X0 + GW, y: CY, width: 0, height: CH, fill: C.red });
    S.rLab = text(G.svg, X0 + GW + RW / 2, CY - 12, `MTTR : 40${NB}min`, { size: 18, weight: 700, fill: C.tRed, anchor: 'middle' });
    S.cyc = el('g');
    br(S.cyc, X0, X0 + CW, CY + CH + 8, -1, C.ink);
    text(S.cyc, X0 + CW / 2, CY + CH + 36, `cycle complet : 4${NB}h${NB}40`, { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });
    S.f1 = text(G.svg, 540, 286, 'Disponibilité = MTBF / (MTBF + MTTR)', { size: 25, weight: 700, fill: C.ink });
    fit(S.f1, 1135, 'formule 1');
    S.f2 = el('g');
    const f2 = text(S.f2, 540, 340, '= 4 / (4 + 0,67) =', { size: 26, weight: 500, fill: C.ink });
    S.r1 = text(S.f2, measure(f2).x + measure(f2).width + 12, 342, `85,7${NB}%`, { size: 34, weight: 800, fill: C.blue });

    // ----- Carte 2 : trois cycles reconstruisent la journée -----
    G.card(40, 418, 1120, 226);
    S.p2 = el('g');
    G.pill(S.p2, 70, 456, 'Chemin 2 : la journée', { size: 20, h: 38, bg: C.blue, fg: C.white });
    S.slot = el('rect', { x: X0, y: FY, width: 14 * PXH, height: CH, rx: 8, fill: 'none', stroke: '#c9c9dc', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
    S.req = el('g');
    const rt = text(S.req, X0 + 14 * PXH, 470, `14${NB}h de temps requis`, { size: 19, weight: 700, fill: C.ink, anchor: 'end' });
    br(S.req, X0, X0 + 14 * PXH, FY - 8, 1, C.ink);
    S.copies = [0, 1, 2].map(k => cycle(G.svg, X0, CY, true));
    S.l2 = text(G.svg, 70, 606, `3 × 4${NB}h = 12${NB}h de fonctionnement sur 14${NB}h`, { size: 21, weight: 700, fill: C.tGreen });
    S.f3 = el('g');
    const f3in = el('g', {}, S.f3);
    const f3 = text(f3in, 0, 606, '12 / 14 =', { size: 26, weight: 500, fill: C.ink });
    S.r2 = text(f3in, measure(f3).width + 12, 608, `85,7${NB}%`, { size: 34, weight: 800, fill: C.blue });
    const w3 = measure(f3).width + 12 + measure(S.r2).width;
    f3in.setAttribute('transform', `translate(${1130 - w3} 0)`);
    S.f3x = 1130 - w3 / 2;

    // ----- Carte 3 : le contrôle -----
    G.card(40, 660, 1120, 100);
    S.ok = el('g');
    G.check(S.ok, 88, 710, 18);
    const ok = text(S.ok, 120, 703, 'Même résultat par les deux chemins : le relevé est cohérent.', { size: 22, weight: 700, fill: C.tGreen });
    text(S.ok, 120, 735, 'Cette disponibilité est le premier des trois facteurs du TRS.', { size: 19, weight: 500, fill: C.ink });
    fit(ok, 1140, 'contrôle');

    S.chute = G.blogChute('Si les deux calculs divergent, c’est le relevé qui est faux.', { y: 812 });
  }

  // ---------- Chronologie ----------
  const G_T = 1.9, R_T = 2.6, CYC_T = 3.1, F1_T = 3.7, F2_T = 4.3;
  const SLOT_T = 5.2, COPY_T = [5.7, 6.4, 7.1], COPY_D = 0.7;
  const REQ_T = 8.1, L2_T = 8.5, F3_T = 9.0, OK_T = 9.9, CHUTE_T = 11.3;

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    pop(S.p1, t, 1.75, 200, 214);
    S.gBar.setAttribute('width', live ? Math.max(0.001, GW * easeOut(prog(t, G_T, 0.5))) : GW);
    S.gBar.setAttribute('opacity', o * (live ? clamp(prog(t, G_T, 0.1)) : 1));
    S.gLab.setAttribute('opacity', o * (live ? clamp(prog(t, G_T + 0.4, 0.3)) : 1));
    S.rBar.setAttribute('width', live ? Math.max(0.001, RW * easeOut(prog(t, R_T, 0.3))) : RW);
    S.rBar.setAttribute('opacity', o * (live ? clamp(prog(t, R_T, 0.1)) : 1));
    S.rLab.setAttribute('opacity', o * (live ? clamp(prog(t, R_T + 0.2, 0.3)) : 1));
    pop(S.cyc, t, CYC_T, X0 + CW / 2, CY + CH + 24);
    rise(S.f1, t, F1_T);
    rise(S.f2, t, F2_T);
    if (live && t >= F2_T + 0.4 && t < F2_T + 1.1) pulse(S.r1, t, F2_T + 0.5, 900, 330, 0.12, 0.45);

    pop(S.p2, t, SLOT_T - 0.2, 190, 456);
    S.slot.setAttribute('opacity', o * (live ? clamp(prog(t, SLOT_T, 0.3)) : 1));
    // Copies du cycle : du cycle moyen vers leur place dans la journée
    S.copies.forEach((c, k) => {
      const p = live ? easeInOut(prog(t, COPY_T[k], COPY_D)) : 1;
      const dx = k * CW * p, dy = (FY - CY) * p - 60 * Math.sin(Math.PI * p);
      c.g.setAttribute('transform', `translate(${dx} ${dy})`);
      c.g.setAttribute('opacity', o * (live ? (t >= COPY_T[k] ? 1 : 0) : 1));
      c.lab.setAttribute('opacity', p >= 1 ? 1 : 0);
    });
    pop(S.req, t, REQ_T, 800, 484);
    rise(S.l2, t, L2_T);
    pop(S.f3, t, F3_T, S.f3x, 596);

    pop(S.ok, t, OK_T, 600, 715);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
