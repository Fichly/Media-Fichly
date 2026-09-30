// Blog · MTBF et MTTR · section « Lequel suivre : le croisement MTBF et MTTR en quatre cas »
// (refait l'image 4_MTBF_ou_MTTR_sur_quoi_agir)
// Mécanique : deux machines de l'article. La 1 tombe toutes les 4 h et repart en 20 min, la 2 tient trois semaines et
// reste bloquée deux jours. Leurs frises n'ont rien à voir, leurs disponibilités sont quasi identiques (92 % et 91 %).
// Chaque machine rejoint ensuite son quadrant : fiabilité pour la 1, remise en service pour la 2, avec qui s'en saisit.
// Hypothèse : disponibilités calculées en heures calendaires (3 semaines = 504 h, 2 jours = 48 h).
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const MX = 110, MY = 214, QW = 250, QH = 238;
  const QUADS = [
    { c: 0, r: 0, title: 'Investissement', sub: 'Tombe souvent, repart lentement.', who: 'Direction industrielle', bg: C.pRed, fg: C.tRed },
    { c: 1, r: 0, title: 'Remise en service', sub: 'Tombe rarement, chaque arrêt coûte cher.', who: 'Maintenance et achats', bg: '#e3eef9', fg: C.blue },
    { c: 0, r: 1, title: 'Fiabilité', sub: 'Tombe souvent, repart vite.', who: 'Méthodes et fiabilité', bg: C.pYellow, fg: C.tYellow },
    { c: 1, r: 1, title: 'Situation saine', sub: 'Tient et repart vite.', who: 'Production, en autonomie', bg: C.pGreen, fg: C.tGreen },
  ];
  const FX = 690, FW = 440;
  const MACH = [
    { y0: 176, n: 1, desc: `Tombe toutes les 4${NB}h, repart en 20${NB}min`, span: `sur 24${NB}h`, dispo: `92${NB}%`, quad: 2, to: { x: 300, y: 600 } },
    { y0: 470, n: 2, desc: 'Tient 3 semaines, reste bloquée 2 jours', span: 'sur 23 jours', dispo: `91${NB}%`, quad: 1, to: { x: 560, y: 356 } },
  ];

  function build() {
    G.templateBlog();
    G.blogTitle('Deux machines,', 'deux quadrants.', { size: 48 });
    G.blogChapeau('Même disponibilité, problèmes opposés : le croisement MTBF × MTTR désigne qui agit.');

    // ----- Matrice -----
    G.card(40, 176, 604, 584);
    S.qbg = el('g');
    S.q = QUADS.map((q, i) => {
      const x = MX + q.c * QW, y = MY + q.r * QH;
      el('rect', { x: x + 3, y: y + 3, width: QW - 6, height: QH - 6, rx: 14, fill: q.bg }, S.qbg);
      const g = el('g');
      text(g, x + 20, y + 40, q.title, { size: 21, weight: 700, fill: q.fg });
      G.para(g, x + 20, y + 68, q.sub, QW - 40, { size: 17, weight: 500, fill: C.ink, lh: 1.3 });
      // « Qui s'en saisit » calé en bas du quadrant (une ou deux lignes)
      const probe = G.para(g, x + 20, -100, q.who, QW - 44, { size: 18, weight: 700, fill: q.fg, lh: 1.2 });
      const n = probe.n;
      probe.t.remove();
      const y1 = y + QH - 22 - (n - 1) * 22;
      text(g, x + 20, y1 - 24, 'Qui s’en saisit', { size: 16, weight: 500, fill: C.ink });
      const w = G.para(g, x + 20, y1, q.who, QW - 44, { size: 18, weight: 700, fill: q.fg, lh: 1.2 });
      fit(w.t, x + QW - 8, `qui ${i}`);
      const hl = el('rect', { x: x + 3, y: y + 3, width: QW - 6, height: QH - 6, rx: 14, fill: 'none', stroke: C.ink, 'stroke-width': 4, opacity: 0 });
      return { g, hl, cx: x + QW / 2, cy: y + QH / 2 };
    });
    S.axes = el('g');
    G.arrow(S.axes, `M ${MX} ${MY + 2 * QH + 14} L ${MX + 2 * QW + 14} ${MY + 2 * QH + 14}`, { stroke: C.ink, width: 3, head: 10 });
    G.arrow(S.axes, `M ${MX - 14} ${MY + 2 * QH} L ${MX - 14} ${MY - 10}`, { stroke: C.ink, width: 3, head: 10 });
    text(S.axes, MX + 2, MY + 2 * QH + 40, 'bas', { size: 17, weight: 500, fill: C.ink });
    text(S.axes, MX + QW, MY + 2 * QH + 40, 'MTBF', { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });
    text(S.axes, MX + 2 * QW, MY + 2 * QH + 40, 'haut', { size: 17, weight: 500, fill: C.ink, anchor: 'end' });
    text(S.axes, MX - 22, MY + 2 * QH - 4, 'bas', { size: 17, weight: 500, fill: C.ink, anchor: 'end' });
    text(S.axes, MX - 22, MY + QH + 6, 'MTTR', { size: 19, weight: 700, fill: C.ink, anchor: 'end' });
    text(S.axes, MX - 22, MY + 16, 'haut', { size: 17, weight: 500, fill: C.ink, anchor: 'end' });

    // ----- Deux machines -----
    S.m = MACH.map((m, i) => {
      G.card(660, m.y0, 500, 278);
      const o = { ...m };
      o.head = el('g');
      const p = G.pill(o.head, 690, m.y0 + 40, `Machine ${m.n}`, { size: 20, h: 36, bg: C.blue, fg: C.white });
      const d = text(o.head, 690, m.y0 + 88, m.desc, { size: 19, weight: 700, fill: C.ink });
      fit(d, 1140, `description ${i}`);
      // Frise
      const fy = m.y0 + 110;
      o.track = el('rect', { x: FX, y: fy, width: FW, height: 36, rx: 7, fill: C.pLav });
      const clip = G.clipRect(FX, fy, 0, 36);
      o.clip = clip.rect;
      o.fr = el('g', { 'clip-path': clip.url });
      el('rect', { x: FX, y: fy, width: FW, height: 36, fill: C.green }, o.fr);
      if (m.n === 1) {
        const k = FW / 24;
        for (let a = 4; a < 24; a += 4 + 1 / 3) el('rect', { x: FX + a * k, y: fy, width: k / 3, height: 36, fill: C.red }, o.fr);
      } else {
        const k = FW / 552;
        el('rect', { x: FX + 504 * k, y: fy, width: 48 * k, height: 36, fill: C.red }, o.fr);
      }
      el('rect', { x: FX, y: fy, width: FW, height: 36, rx: 7, fill: 'none', stroke: C.card, 'stroke-width': 4 }, o.fr);
      o.span = text(G.svg, FX + FW, fy + 60, m.span, { size: 17, weight: 500, fill: C.ink, anchor: 'end' });
      // Disponibilité
      o.dg = el('g');
      text(o.dg, 690, m.y0 + 234, 'Disponibilité', { size: 20, weight: 700, fill: C.ink });
      text(o.dg, 850, m.y0 + 240, m.dispo, { size: 40, weight: 800, fill: C.blue });
      // Pastille qui rejoindra la matrice
      o.dot = el('g');
      el('circle', { cx: 0, cy: 0, r: 22, fill: C.ink, stroke: C.white, 'stroke-width': 4 }, o.dot);
      text(o.dot, 0, 8, String(m.n), { size: 22, weight: 800, fill: C.white, anchor: 'middle' });
      o.home = { x: 1112, y: m.y0 + 40 };
      return o;
    });
    S.same = el('g');
    G.pill(S.same, 1096, 462, 'disponibilités quasi identiques', { size: 17, h: 32, pad: 12, bg: C.ink, fg: C.white, anchor: 'middle' }).g
      .setAttribute('transform', 'translate(-150 0)');

    S.chute = G.blogChute('Dans quel quadrant sommes-nous, et depuis quand ?', { y: 812 });
  }

  // ---------- Chronologie ----------
  const Q_T = 1.8, QTXT_T = 2.5;
  const M_T = [3.3, 5.6], FR_D = 1.2;
  const SAME_T = 8.1, FLY = [9.0, 10.8], FLY_D = 0.9, CHUTE_T = 12.8;

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.qbg.setAttribute('opacity', o * (live ? clamp(prog(t, Q_T, 0.4)) : 1));
    pop(S.axes, t, Q_T + 0.2, 360, 450);
    S.q.forEach((q, i) => pop(q.g, t, QTXT_T + 0.12 * i, q.cx, q.cy));

    S.m.forEach((m, i) => {
      const T = M_T[i];
      pop(m.head, t, T, 800, m.y0 + 60);
      m.track.setAttribute('opacity', o * (live ? clamp(prog(t, T + 0.3, 0.3)) : 1));
      m.clip.setAttribute('width', live ? Math.max(0.001, FW * easeInOut(prog(t, T + 0.4, FR_D))) : FW);
      m.fr.setAttribute('opacity', o);
      m.span.setAttribute('opacity', o * (live ? clamp(prog(t, T + 0.5, 0.3)) : 1));
      pop(m.dg, t, T + 0.4 + FR_D + 0.2, 800, m.y0 + 226);

      // Pastille : apparaît dans la carte, puis vole vers son quadrant
      const q = S.q[m.quad];
      const p = live ? easeInOut(prog(t, FLY[i], FLY_D)) : 1;
      const x = m.home.x + (m.to.x - m.home.x) * p;
      const y = m.home.y + (m.to.y - m.home.y) * p - 80 * Math.sin(Math.PI * p);
      const sp = live ? prog(t, T + 0.1, 0.35) : 1;
      const sc = sp <= 0 ? 0.001 : sp >= 1 ? 1 : 0.6 + 0.4 * G.back(sp);
      m.dot.setAttribute('transform', `translate(${x} ${y}) scale(${sc})`);
      m.dot.setAttribute('opacity', o * clamp(sp / 0.4));
      q.hl.setAttribute('opacity', o * (live ? clamp(prog(t, FLY[i] + FLY_D, 0.3)) : 1));
      if (live && t >= FLY[i] + FLY_D && t < FLY[i] + FLY_D + 0.8) pulse(q.g, t, FLY[i] + FLY_D + 0.05, q.cx, q.cy, 0.04, 0.5);
    });
    pop(S.same, t, SAME_T, 946, 462);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
