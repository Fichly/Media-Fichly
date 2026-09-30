// Blog · Takt time · section « Comment calculer le takt time ? » (exemple de calcul)
// Mécanique : la journée de 16 h est une barre. Les arrêts planifiés (pauses, prise de poste, maintenance) sortent
// de la barre et vont dans « on retire » ; les arrêts subis (panne, micro-arrêts, changement de série) essaient de
// sortir, sont refusés et retombent dans la barre. La barre se resserre à 12 h 40 = 45 600 s, d'où 95 s par pièce,
// contre 120 s pour le calcul paresseux sur 16 h brutes.
// Positions des arrêts subis dans la journée : illustratives (l'article ne les chiffre pas, ils restent dans le calcul).
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = '\u00a0';

  const X0 = 80, K = 65;                 // 16 h = 1040 px
  const BAR = { y: 300, h: 44 };
  const hx = h => X0 + K * h;
  // Arrêts planifiés (retirés) et subis (gardés), en heures depuis le début de la journée
  const PLANNED = [
    { s: 3, d: 2 / 3, tray: { x: 76, y: 418 } },
    { s: 11, d: 2 / 3, tray: { x: 125, y: 418 } },
    { s: 14, d: 2, tray: { x: 76, y: 458 } },
  ];
  const SUBIS = [
    { s: 1.2, d: 0.13, grp: 1 },
    { s: 4.6, d: 0.75, grp: 0, label: 'Panne' },
    { s: 6.8, d: 0.13, grp: 1, label: 'Micro-arrêts' },
    { s: 9.6, d: 0.13, grp: 1 },
    { s: 12.3, d: 0.5, grp: 2, label: 'Changement de série' },
  ];
  const TRAY_H = 32;
  // Retrait cumulé avant l'heure h (pour resserrer la barre)
  const removedBefore = h => PLANNED.filter(p => p.s + p.d <= h + 1e-6).reduce((a, p) => a + p.d, 0);
  const SEGS = [[0, 3], [3 + 2 / 3, 11], [11 + 2 / 3, 14]];

  // Chronologie
  const T_BAR = 1.9;
  const T_PL = [2.9, 3.5, 4.1];
  const T_SU = [5.2, 5.9, 6.6];      // par groupe : panne, micro-arrêts, changement de série
  const T_CMP = 7.7, D_CMP = 1.0;
  const T_R1 = 9.7, T_R2 = 11.1;
  const CHUTE_T = 12.9;

  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Retirer le prévu,', 'garder le subi.', { size: 48 });
    G.blogChapeau(`Takt time = temps de production disponible ÷ demande client, sur la même période.`);

    // ----- Carte 1 : la journée -----
    G.card(40, 176, 1120, 326);
    S.head = el('g');
    const h1 = text(S.head, 70, 226, 'Temps d’ouverture', { size: 23, weight: 700, fill: C.ink });
    text(S.head, measure(h1).x + measure(h1).width + 8, 226, `: 2 équipes de 8${NB}h, 480 pièces à livrer`, { size: 21, weight: 500, fill: C.ink });
    S.counter = text(G.svg, 1130, 228, '', { size: 30, weight: 800, fill: C.blue, anchor: 'end' });
    S.sec = text(G.svg, 1130, 262, `= 45${NB}600 s`, { size: 21, weight: 700, fill: C.tGreen, anchor: 'end' });

    // Fantôme des 16 h et trou laissé par le retrait
    S.ghost = el('g');
    const gx = hx(16 - 10 / 3);
    el('rect', { x: gx + 4, y: BAR.y, width: hx(16) - gx - 4, height: BAR.h, rx: 8, fill: 'none', stroke: C.blue, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, S.ghost);
    text(S.ghost, (gx + hx(16)) / 2 + 2, BAR.y + 29, `− 3${NB}h${NB}20`, { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });

    // Barre : segments de temps disponible, arrêts subis dessus
    S.bar = el('g');
    const clip = G.clipRect(X0 - 2, BAR.y - 4, hx(16) - X0 + 4, BAR.h + 8);
    S.barClip = clip.rect;
    const inner = el('g', { 'clip-path': clip.url }, S.bar);
    S.segs = SEGS.map(([a, b], i) => {
      const g = el('g', {}, inner);
      el('rect', { x: hx(a) + (i ? 1.5 : 0), y: BAR.y, width: K * (b - a) - (i ? 1.5 : 0) - 1.5, height: BAR.h, rx: 6, fill: C.green }, g);
      return { g, a, b, shift: K * removedBefore(a) };
    });
    // Blocs subis : chacun dans le segment qui le contient
    S.subis = SUBIS.map(u => {
      const seg = S.segs.find(s => u.s >= s.a && u.s < s.b);
      const g = el('g', {}, seg.g);
      const r = el('rect', { x: hx(u.s), y: BAR.y, width: Math.max(8, K * u.d), height: BAR.h, rx: 3, fill: C.red }, g);
      return { ...u, g, r, seg };
    });
    S.refus = [0, 1, 2].map(k => {
      const u = SUBIS.find(v => v.grp === k && v.label);
      const g = el('g');
      G.cross(g, hx(u.s) + Math.max(8, K * u.d) + 16, BAR.y - 10, 11);
      return g;
    });
    // Étiquettes des subis (au-dessus de la barre)
    S.labels = SUBIS.filter(u => u.label).map(u => {
      const g = el('g');
      const cx = hx(u.s) + Math.max(8, K * u.d) / 2;
      el('line', { x1: cx, y1: 284, x2: cx, y2: BAR.y - 2, stroke: C.red, 'stroke-width': 2 }, g);
      G.pill(g, cx, 272, u.label, { size: 17, h: 28, pad: 12, bg: C.pRed, fg: C.tRed, anchor: 'middle' });
      const seg = S.segs.find(s => u.s >= s.a && u.s < s.b);
      return { g, grp: u.grp, seg, cx };
    });
    // Équipes
    S.teams = el('g');
    text(S.teams, hx(4), 370, 'Équipe 1 · 8 h', { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });
    text(S.teams, hx(12), 370, 'Équipe 2 · 8 h', { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });
    S.sep = el('line', { x1: hx(8), y1: BAR.y + BAR.h + 4, x2: hx(8), y2: BAR.y + BAR.h + 14, stroke: C.ink, 'stroke-width': 2 });

    // Blocs planifiés (sortent de la barre)
    S.planned = PLANNED.map(p => ({ ...p, r: el('rect', { x: hx(p.s), y: BAR.y, width: K * p.d - 2, height: BAR.h, rx: 5, fill: C.pLav, stroke: C.blue, 'stroke-width': 2.5 }) }));

    // Zones « on retire » / « on garde »
    el('line', { x1: 610, y1: 396, x2: 610, y2: 486, stroke: C.line, 'stroke-width': 2 });
    S.zoneL = el('g');
    text(S.zoneL, 70, 404, 'On retire : planifié, connu à l’avance', { size: 19, weight: 700, fill: C.blue });
    S.trayL = [
      text(G.svg, 200, 440, `Pauses, prise de poste : 1${NB}h${NB}20`, { size: 18, weight: 600, fill: C.ink }),
      text(G.svg, 236, 480, `Maintenance planifiée : 2${NB}h`, { size: 18, weight: 600, fill: C.ink }),
    ];
    S.checks = [[184, 434], [220, 474]].map(([x, y]) => { const g = el('g'); G.check(g, x, y, 9); return g; });
    S.trayL.forEach((n, i) => fit(n, 600, `retrait ${i}`));
    S.zoneR = el('g');
    const zr = text(S.zoneR, 634, 404, 'On garde : subi, c’est le problème', { size: 19, weight: 700, fill: C.tRed });
    fit(zr, 1136, 'zone droite');
    fit(text(S.zoneR, 634, 440, 'Déduire une panne revient à l’inscrire', { size: 18, weight: 500, fill: C.ink }), 1136, 'zone droite 2');
    fit(text(S.zoneR, 634, 468, 'dans la cible, donc à cesser de la voir.', { size: 18, weight: 500, fill: C.ink }), 1136, 'zone droite 3');

    // ----- Carte 2 : le takt -----
    G.card(40, 518, 1120, 240);
    const PX = 6.4, BX = 70;
    S.PX = PX; S.BX = BX;
    const row = (y, pillTxt, ok, formula, res) => {
      const g = el('g');
      const p = G.pill(g, BX, y, pillTxt, { size: 18, h: 32, pad: 14, bg: ok ? C.pGreen : C.pRed, fg: ok ? C.tGreen : C.tRed, icon: ok ? 'check' : 'cross' });
      const f = text(g, BX + p.w + 14, y + 7, formula, { size: 21, weight: 500, fill: C.ink });
      const r = text(g, measure(f).x + measure(f).width + 10, y + 10, res, { size: 30, weight: 800, fill: ok ? C.tGreen : C.tRed });
      fit(r, 1136, `ligne ${pillTxt}`);
      return g;
    };
    S.r1 = row(558, 'Temps disponible', true, `45${NB}600 s ÷ 480 pièces =`, '95 s par pièce');
    S.r2 = row(656, 'Calcul paresseux, 16 h brutes', false, `57${NB}600 s ÷ 480 =`, '120 s');
    const beat = (y, sec, fill) => {
      const g = el('g');
      const cp = G.clipRect(BX, y, 0, 26);
      const inner = el('g', { 'clip-path': cp.url }, g);
      el('rect', { x: BX, y, width: sec * PX, height: 26, rx: 6, fill }, inner);
      for (let s = 10; s < sec; s += 10) el('rect', { x: BX + s * PX - 1, y, width: 2, height: 26, fill: C.card, opacity: 0.8 }, inner);
      return { g, clip: cp.rect, w: sec * PX };
    };
    S.b1 = beat(584, 95, C.green);
    S.b2 = beat(682, 95, C.green);
    S.b2x = beat(682, 120, C.red);
    S.b2.g.parentNode.appendChild(S.b2.g);   // le vert par-dessus le rouge
    S.gap = el('g');
    const gx0 = BX + 95 * PX, gx1 = BX + 120 * PX;
    el('path', { d: `M ${gx0} 718 L ${gx0} 726 L ${gx1} 726 L ${gx1} 718`, fill: 'none', stroke: C.tRed, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, S.gap);
    const g1 = text(S.gap, gx1 + 18, 700, '25 s d’écart par pièce :', { size: 20, weight: 700, fill: C.tRed });
    fit(g1, 1136, 'écart 1');
    fit(text(S.gap, gx1 + 18, 726, 'un rythme jamais tenu', { size: 19, weight: 500, fill: C.tRed }), 1136, 'écart 2');
    S.scale = el('g');
    text(S.scale, BX + 95 * PX + 8, 604, '95 s', { size: 18, weight: 700, fill: C.tGreen });

    S.chute = G.blogChute('On retire ce qui est planifié, jamais ce qui est subi.', { y: 806 });
  }

  const fmtH = min => { const h = Math.floor(min / 60), m = Math.round(min % 60); return m ? `${h}${NB}h${NB}${String(m).padStart(2, '0')}` : `${h}${NB}h`; };

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;
    pop(S.head, t, 1.7, 300, 220);

    // Barre : révélation de gauche à droite
    const rv = live ? easeInOut(prog(t, T_BAR, 0.8)) : 1;
    S.barClip.setAttribute('width', Math.max(0.001, (hx(16) - X0 + 4) * rv));
    S.bar.setAttribute('opacity', fo);
    S.teams.setAttribute('opacity', fo * (live ? clamp(prog(t, T_BAR + 0.5, 0.3)) : 1));
    S.sep.setAttribute('opacity', fo * (live ? clamp(prog(t, T_BAR + 0.5, 0.3)) : 1) * (live && t < T_CMP ? 1 : 0));

    // Resserrement
    const cp = live ? easeInOut(prog(t, T_CMP, D_CMP)) : 1;
    S.segs.forEach(s => s.g.setAttribute('transform', `translate(${-s.shift * cp} 0)`));
    S.ghost.setAttribute('opacity', fo * (live ? clamp(prog(t, T_CMP + 0.6, 0.4)) : 1));
    const min = 960 - 200 * cp;
    S.counter.textContent = fmtH(Math.round(min / 10) * 10);
    S.counter.setAttribute('opacity', fo * (live ? clamp(prog(t, 1.9, 0.3)) : 1));
    S.sec.setAttribute('opacity', fo * (live ? clamp(prog(t, T_CMP + D_CMP, 0.3)) : 1));
    if (live && t >= T_CMP + D_CMP && t < T_CMP + D_CMP + 0.8) pulse(S.counter, t, T_CMP + D_CMP, 1070, 218, 0.1, 0.45);
    else S.counter.setAttribute('transform', '');

    // Blocs planifiés : se soulèvent et partent dans « on retire »
    S.planned.forEach((p, i) => {
      const t0 = T_PL[i];
      let x = hx(p.s), y = BAR.y, h = BAR.h, o = fo;
      const lift = live ? easeOut(prog(t, t0, 0.25)) : 1;
      const fly = live ? easeInOut(prog(t, t0 + 0.2, 0.7)) : 1;
      if (live && t < T_BAR + 0.8 * (p.s / 16)) o = 0;
      const ly = BAR.y - 26 * lift;
      x = x + (p.tray.x - x) * fly;
      y = ly + (p.tray.y - ly) * fly;
      h = BAR.h + (TRAY_H - BAR.h) * fly;
      p.r.setAttribute('x', x);
      p.r.setAttribute('y', y);
      p.r.setAttribute('height', h);
      p.r.setAttribute('opacity', o);
    });
    S.zoneL.setAttribute('opacity', fo * (live ? clamp(prog(t, T_PL[0], 0.3)) : 1));
    const landed = i => (live ? clamp(prog(t, T_PL[i] + 0.85, 0.3)) : 1);
    S.trayL[0].setAttribute('opacity', fo * landed(1));
    S.trayL[1].setAttribute('opacity', fo * landed(2));
    pop(S.checks[0], t, T_PL[1] + 0.85, 184, 434);
    pop(S.checks[1], t, T_PL[2] + 0.85, 220, 474);

    // Blocs subis : essaient de sortir, croix, retombent
    S.subis.forEach(u => {
      const t0 = T_SU[u.grp];
      let dy = 0;
      if (live && t >= t0 && t < t0 + 1) {
        const up = easeOut(prog(t, t0, 0.25));
        const down = prog(t, t0 + 0.45, 0.35);
        dy = -34 * up * (1 - down * down) + (down >= 1 ? 0 : 0);
        if (down > 0.85) dy = -4 * Math.sin(Math.PI * (down - 0.85) / 0.15);
      }
      u.r.setAttribute('transform', dy ? `translate(0 ${dy})` : '');
    });
    S.refus.forEach((g, k) => {
      const t0 = T_SU[k];
      g.setAttribute('opacity', live ? window01(t, t0 + 0.15, t0 + 0.85, 0.12) : 0);
    });
    S.labels.forEach(l => {
      const t0 = T_SU[l.grp];
      l.g.setAttribute('opacity', fo * (live ? clamp(prog(t, t0 + 0.75, 0.3)) : 1));
      l.g.setAttribute('transform', `translate(${-l.seg.shift * cp} 0)`);
    });
    S.zoneR.setAttribute('opacity', fo * (live ? clamp(prog(t, T_SU[0] + 0.3, 0.3)) : 1));
    if (live && t >= T_SU[0] && t < T_SU[2] + 1.2) T_SU.forEach(t0 => { if (t >= t0 + 0.3 && t < t0 + 1.0) pulse(S.zoneR, t, t0 + 0.3, 880, 404, 0.04, 0.4); });

    // Carte 2
    pop(S.r1, t, T_R1, 400, 558);
    const w1 = live ? easeOut(prog(t, T_R1 + 0.3, 0.6)) : 1;
    S.b1.clip.setAttribute('width', Math.max(0.001, S.b1.w * w1));
    S.b1.g.setAttribute('opacity', fo);
    S.scale.setAttribute('opacity', fo * (live ? clamp(prog(t, T_R1 + 0.8, 0.3)) : 1));
    pop(S.r2, t, T_R2, 400, 656);
    const w2 = live ? easeOut(prog(t, T_R2 + 0.3, 0.8)) : 1;
    S.b2.clip.setAttribute('width', Math.max(0.001, S.b2.w * Math.min(1, w2 * 120 / 95)));
    S.b2x.clip.setAttribute('width', Math.max(0.001, S.b2x.w * w2));
    S.b2.g.setAttribute('opacity', fo);
    S.b2x.g.setAttribute('opacity', fo);
    rise(S.gap, t, T_R2 + 1.1, 0.4);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
