// Fiche LinkedIn · page Fichly · jeudi 15 octobre 2026 (Buffer 6abe5ceca39e324a5b77269b)
// Post : « Un standard rigide est souvent un standard trop long. Un bon standard tient sur une page et se lit au poste. »
// « La fiche reprend cette structure sur une page, avec un exemple rempli. »
// Premier commentaire du post (Buffer) : « Retrouvez nos fiches Lean sur ce lien » → encart.
// Le visuel EST la fiche : la page du standard, ses 7 blocs remplis avec l'exemple d'un poste de montage
// (exemple inventé : poste 4, montage du capot), et à côté les trois choses qu'il ne contient pas.
// Style propre : la vue éclatée qui s'assemble. La page se démonte : les 7 blocs se soulèvent et flottent,
// légèrement décalés au-dessus de leurs emplacements en pointillés (3 et 6 pulsent : les plus souvent oubliés).
// Puis ils s'emboîtent un à un (glissement, tassement, petit rebond, ombre qui se réduit), le compteur roule
// jusqu'à 7/7. Enfin les trois ❌ tentent d'entrer : ils butent sur le bord de la page, sont tamponnés,
// barrés et renvoyés à côté. Image t = 0 = état final. Boucle exacte de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit, measure } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeIn = p => p * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const bump = p => (p <= 0 || p >= 1 ? 0 : Math.sin(Math.PI * p));
  // Ressort amorti qui vaut exactement 1 à p = 0 et 0 à p = 1 (boucle exacte)
  const spring = p => (p >= 1 ? 0 : Math.pow(1 - p, 2) * Math.cos(2.6 * Math.PI * p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', DASH = '#c3c3dc';
  const BLOCK_BG = '#f7f7fc', SEP = '#e8e8f2', REASON = '#55558a', PHOTO = '#e3e5f0', HOUSING = '#adb2cb';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const PAGE = { x: 84, y: 428, w: 580, h: 704 };       // la page du standard (bord droit 664)
  const IX = 100, IR = 648;                             // marges intérieures de la page
  const SLOTS = [
    { x: 100, y: 508, w: 269, h: 172 },   // 1 Résultat attendu
    { x: 379, y: 508, w: 269, h: 172 },   // 2 Séquence
    { x: 100, y: 690, w: 548, h: 134 },   // 3 Points clés, et leur raison
    { x: 100, y: 834, w: 269, h: 92 },    // 4 Temps de référence
    { x: 379, y: 834, w: 269, h: 92 },    // 5 Matériel nécessaire
    { x: 100, y: 936, w: 548, h: 122 },   // 6 Conduite en cas d'écart
    { x: 100, y: 1068, w: 548, h: 48 },   // 7 Version et propriétaire
  ];
  const KEY = [2, 5];                                   // blocs 3 et 6 : les plus souvent oubliés
  // Vue éclatée : chaque bloc décalé vers la droite (en escalier) et légèrement tourné
  const EX = [
    { dx: 90, rot: -0.9 }, { dx: 140, rot: 0.8 }, { dx: 125, rot: -0.4 }, { dx: 165, rot: 0.9 },
    { dx: 215, rot: -0.8 }, { dx: 200, rot: 0.4 }, { dx: 245, rot: -0.5 },
  ];
  // Colonne de droite : ce qu'il ne contient pas
  const RX = 704, RW = 296, RH = 172, CONTACT_X = PAGE.x + PAGE.w + 4, ENTRY_X = 1050;
  const REJ = [
    { y: 500, rot: -2.4, label: ['Ce que tout le monde', 'sait déjà faire'], ex: `«${NB}Brancher la visseuse.${NB}»` },
    { y: 718, rot: 1.8, label: ['Des paragraphes', 'de justification'], ex: null },
    { y: 936, rot: -1.6, label: ['Des règles impossibles', 'à appliquer au poste'], ex: `«${NB}Mesurer chaque vis au labo.${NB}»` },
  ];
  const PILL_X = RX, PILL_Y = 452;

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.2;                                     // l'image finale tient jusqu'ici
  const T_REJ_OUT = i => 1.2 + 0.05 * i, REJ_OUT_DUR = 0.36;
  const T_EXP = k => 1.42 + 0.05 * (6 - k), EXP_DUR = 0.55; // la page se démonte (bloc 7 d'abord)
  const T_GHOST = 1.45;
  const T_LAND = k => 3.0 + 0.6 * k;                     // les blocs s'emboîtent un à un
  const CONTACT = 0.52, LAND_END = 0.83;
  const T_DONE = T_LAND(6) + CONTACT + 0.2;              // la page est complète
  const T_REJ = [8.45, 9.25, 10.05], APPROACH = 0.45, RECOIL = 0.65;
  const PILLS_T = [1.26, 2.86, 7.5, 8.25];              // pastilles 1, 2, « tient sur une page », « ce qu'il ne contient pas »

  // ---------- Petits éléments ----------
  function rich(parent, x, y, segs, size = 22) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': 500, fill: C.ink }, parent);
    const ST = { b: C.blue, r: C.tRed };
    segs.forEach(([s, k]) => { const sp = el('tspan', k ? { 'font-weight': 700, fill: ST[k] } : {}, t); sp.textContent = s; });
    return t;
  }
  function chip(parent, x, cy, label, { bg, fg, size = 15, h = 24, anchor = 'start', w = null, icon = null }) {
    const g = el('g', {}, parent);
    const r = el('rect', { y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 20 : 0;
    const t = text(g, 0, cy + size * 0.36, label, { size, weight: 700, fill: fg, anchor: w ? 'middle' : 'start' });
    const tw = measure(t).width;
    const width = w || tw + 22 + iw;
    const x0 = anchor === 'end' ? x - width : x;
    r.setAttribute('x', f2(x0));
    r.setAttribute('width', f2(width));
    t.setAttribute('x', f2(w ? x0 + width / 2 : x0 + 11 + iw));
    if (icon) icon(g, x0 + 18, cy);
    return { g, r, t, x0, width };
  }
  const personIcon = (g, cx, cy, color = C.blue) => {
    el('circle', { cx, cy: cy - 3.5, r: 3.6, fill: color }, g);
    el('path', { d: `M ${cx - 6.5} ${cy + 7} C ${cx - 6.5} ${cy + 0.5}, ${cx + 6.5} ${cy + 0.5}, ${cx + 6.5} ${cy + 7} Z`, fill: color }, g);
  };
  const checkMark = (g, cx, cy, r = 11, bg = C.green) => {
    el('circle', { cx, cy, r, fill: bg }, g);
    const k = r / 12;
    el('path', { d: `M ${f2(cx - 5.5 * k)} ${f2(cy + 0.5 * k)} L ${f2(cx - 1.5 * k)} ${f2(cy + 4.5 * k)} L ${f2(cx + 5.5 * k)} ${f2(cy - 3.5 * k)}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  };
  const crossMark = (g, cx, cy, r = 11, bg = C.red) => {
    el('circle', { cx, cy, r, fill: bg }, g);
    const k = r * 0.36;
    el('path', { d: `M ${f2(cx - k)} ${f2(cy - k)} L ${f2(cx + k)} ${f2(cy + k)} M ${f2(cx + k)} ${f2(cy - k)} L ${f2(cx - k)} ${f2(cy + k)}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
  };
  function pillShape(parent, x, cy, label, { bg, fg, size = 19, h = 40, icon = null }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 18 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', f2(measure(tx).width + 36 + iw));
    if (icon === 'check') checkMark(g, x + 29, cy, 11);
    if (icon === 'cross') crossMark(g, x + 29, cy, 11);
    return g;
  }

  // ---------- Contenu des blocs (coordonnées de la page) ----------
  function head(g, r, n, title) {
    el('circle', { cx: r.x + 24, cy: r.y + 25, r: 13, fill: C.blue }, g);
    text(g, r.x + 24, r.y + 30.5, String(n), { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
    const t = text(g, r.x + 46, r.y + 31, title, { size: 17, weight: 800, fill: C.ink });
    fit(t, r.x + r.w - 12, `bloc ${n} titre`);
    S.titles[n - 1] = t;
    return t;
  }
  // Rangée « étiquette + texte » (blocs 3 et 6)
  function labelRow(g, r, y, label, colors, n) {
    const c = chip(g, r.x + 16, y - 5, label, { bg: colors[0], fg: colors[1], w: 88, h: 23 });
    fit(c.t, r.x + 100, `bloc ${n} étiquette ${label}`, r.x + 20);
    return c;
  }

  const BUILDERS = [
    // 1 · Résultat attendu : la photo de la pièce bonne
    (g, r) => {
      head(g, r, 1, 'Résultat attendu');
      const ph = { x: r.x + 12, y: r.y + 42, w: r.w - 24, h: 94 };
      el('rect', { x: ph.x, y: ph.y, width: ph.w, height: ph.h, rx: 10, fill: PHOTO }, g);
      el('rect', { x: ph.x, y: ph.y + ph.h - 22, width: ph.w, height: 22, fill: '#d9dcea', 'clip-path': 'url(#photoClip)' }, g);
      // Le boîtier, capot posé : charnière, 2 vis, étiquette
      const bx = ph.x + ph.w / 2 + 4, by = ph.y + 60;
      el('rect', { x: bx - 68, y: by - 27, width: 136, height: 54, rx: 9, fill: HOUSING }, g);
      el('rect', { x: bx - 62, y: by - 23, width: 124, height: 46, rx: 7, fill: C.blue }, g);
      el('rect', { x: bx - 40, y: by - 23, width: 80, height: 6, rx: 2, fill: '#34347c' }, g);
      [-48, 48].forEach(dx => {
        el('circle', { cx: bx + dx, cy: by + 2, r: 6.5, fill: '#e9eaf4', stroke: C.ink, 'stroke-width': 1.4 }, g);
        el('path', { d: `M ${bx + dx - 3.2} ${by + 2} H ${bx + dx + 3.2} M ${bx + dx} ${by - 1.2} V ${by + 5.2}`, stroke: C.ink, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, g);
      });
      el('rect', { x: bx - 17, y: by - 6, width: 34, height: 19, rx: 3, fill: C.white }, g);
      [[-12, 2], [-8, 1.2], [-5, 2.4], [-1, 1.2], [2, 2], [6, 1.2], [9, 2.4]].forEach(([x, w]) => el('rect', { x: bx + x, y: by - 2, width: w, height: 10, fill: C.ink }, g));
      // Repère « photo » et tampon « pièce bonne »
      const cam = el('g', {}, g);
      el('rect', { x: ph.x + 8, y: ph.y + 8, width: 32, height: 24, rx: 7, fill: C.white }, cam);
      el('rect', { x: ph.x + 15, y: ph.y + 14.5, width: 18, height: 12.5, rx: 3, fill: 'none', stroke: C.blue, 'stroke-width': 2 }, cam);
      el('rect', { x: ph.x + 20, y: ph.y + 12, width: 7, height: 3, rx: 1, fill: C.blue }, cam);
      el('circle', { cx: ph.x + 24, cy: ph.y + 20.8, r: 3.4, fill: 'none', stroke: C.blue, 'stroke-width': 2 }, cam);
      const ok = chip(g, ph.x + ph.w - 8, ph.y + 20, 'Pièce bonne', { bg: C.pGreen, fg: C.tGreen, anchor: 'end', icon: (gg, cx, cy) => checkMark(gg, cx - 2, cy, 8) });
      fit(ok.r, ph.x + ph.w - 6, 'tampon pièce bonne', ph.x + 44);
      fit(text(g, r.x + 14, r.y + 159, 'Capot à fleur, 2 vis, étiquette', { size: 15, weight: 500, fill: C.ink }), r.x + r.w - 12, 'légende photo');
    },
    // 2 · Séquence : une ligne par étape
    (g, r) => {
      head(g, r, 2, 'Séquence');
      const STEPS = ['Prendre un boîtier (bac A)', 'Le caler dans le gabarit', 'Clipser le capot', 'Visser les 2 vis', 'Coller l’étiquette'];
      STEPS.forEach((s, k) => {
        const y = r.y + 61 + 23 * k;
        text(g, r.x + 22, y, String(k + 1), { size: 15, weight: 800, fill: C.blue, anchor: 'middle' });
        fit(text(g, r.x + 38, y, s, { size: 15, weight: 500, fill: C.ink }), r.x + r.w - 12, `étape ${k + 1}`);
        if (k < STEPS.length - 1) el('line', { x1: r.x + 14, y1: y + 7.5, x2: r.x + r.w - 14, y2: y + 7.5, stroke: SEP, 'stroke-width': 1.5 }, g);
      });
    },
    // 3 · Points clés, et leur raison
    (g, r) => {
      head(g, r, 3, 'Points clés, et leur raison');
      const KEYS = [
        ['Qualité', [C.pLav, C.blue], 'Charnière d’abord', 'sinon le clip casse'],
        ['Sécurité', [C.pRed, C.tRed], 'Visseuse au balancier', 'le poignet reste droit'],
        ['Facilité', [C.pGreen, C.tGreen], 'Boîtier en butée', 'une seule main suffit'],
      ];
      const pts = KEYS.map(([lab, col, pt], k) => {
        const y = r.y + 63 + 26 * k;
        labelRow(g, r, y, lab, col, 3);
        return text(g, r.x + 116, y, pt, { size: 16, weight: 700, fill: C.ink });
      });
      const ax = r.x + 116 + Math.max(...pts.map(p => measure(p).width)) + 14;
      KEYS.forEach(([, , , why], k) => {
        const y = r.y + 63 + 26 * k - 5;
        el('path', { d: `M ${f2(ax)} ${y} H ${f2(ax + 16)} M ${f2(ax + 11)} ${y - 4.5} L ${f2(ax + 16)} ${y} L ${f2(ax + 11)} ${y + 4.5}`, fill: 'none', stroke: MUTED, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        fit(text(g, ax + 26, y + 5, why, { size: 15, weight: 500, fill: REASON }), r.x + r.w - 14, `raison ${k + 1}`);
      });
    },
    // 4 · Temps de référence
    (g, r) => {
      head(g, r, 4, 'Temps de référence');
      const cx = r.x + 32, cy = r.y + 64;
      el('circle', { cx, cy, r: 14, fill: 'none', stroke: C.blue, 'stroke-width': 3 }, g);
      el('path', { d: `M ${cx} ${cy - 7.5} V ${cy} L ${cx + 5.5} ${cy + 3.5}`, fill: 'none', stroke: C.blue, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      const big = text(g, r.x + 56, r.y + 75, `45${NB}s`, { size: 28, weight: 800, fill: C.blue });
      const sx = r.x + 56 + measure(big).width + 12;
      fit(text(g, sx, r.y + 62, 'par boîtier', { size: 15, weight: 700, fill: C.ink }), r.x + r.w - 12, 'temps : par boîtier');
      fit(text(g, sx, r.y + 81, 'cycle normal', { size: 15, weight: 500, fill: MUTED }), r.x + r.w - 12, 'temps : cycle normal');
    },
    // 5 · Matériel nécessaire
    (g, r) => {
      head(g, r, 5, 'Matériel nécessaire');
      const y1 = r.y + 59, y2 = r.y + 82;
      // Clé (outils)
      const w = el('g', { transform: `translate(${r.x + 25} ${y1 - 5}) rotate(45)` }, g);
      el('rect', { x: -2.6, y: -2, width: 5.2, height: 12, rx: 2.6, fill: C.blue }, w);
      el('circle', { cx: 0, cy: -5, r: 6, fill: C.blue }, w);
      el('rect', { x: -2.4, y: -12, width: 4.8, height: 7, rx: 1, fill: BLOCK_BG }, w);
      // Carton (pièces)
      el('rect', { x: r.x + 18, y: y2 - 12, width: 14, height: 12, rx: 2.5, fill: C.blue }, g);
      el('line', { x1: r.x + 21.5, y1: y2 - 7.5, x2: r.x + 28.5, y2: y2 - 7.5, stroke: C.white, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
      fit(text(g, r.x + 40, y1, `Visseuse 1,2${NB}N·m, gabarit G4`, { size: 15, weight: 500, fill: C.ink }), r.x + r.w - 10, 'matériel outils');
      fit(text(g, r.x + 40, y2, 'Capots, vis M3, étiquettes', { size: 15, weight: 500, fill: C.ink }), r.x + r.w - 10, 'matériel pièces');
    },
    // 6 · Conduite en cas d'écart
    (g, r) => {
      head(g, r, 6, 'Conduite en cas d’écart');
      const ROWS = [
        ['Si', [C.pRed, C.tRed], 'le capot ne clipse pas, ou une vis foire'],
        ['Faire', [C.pLav, C.blue], 'boîtier au bac rouge, sans le reprendre'],
        ['Prévenir', [C.pLav, C.blue], 'le chef d’équipe, par l’andon'],
      ];
      ROWS.forEach(([lab, col, s], k) => {
        const y = r.y + 62 + 25 * k;
        labelRow(g, r, y, lab, col, 6);
        fit(text(g, r.x + 116, y, s, { size: 16, weight: 500, fill: C.ink }), r.x + r.w - 14, `écart ${lab}`);
      });
    },
    // 7 · Version et propriétaire
    (g, r) => {
      const t = head(g, r, 7, 'Version et propriétaire');
      const own = text(g, r.x + r.w - 14, r.y + 30, 'Chef d’équipe', { size: 15, weight: 700, fill: C.blue, anchor: 'end' });
      const ob = measure(own);
      personIcon(g, ob.x - 11, r.y + 24.5, C.blue);
      const v = el('text', { x: ob.x - 27, y: r.y + 30, 'font-family': 'Poppins', 'font-size': 15, 'font-weight': 500, fill: C.ink, 'text-anchor': 'end' }, g);
      [['v4', C.blue, 700], [`${NB}·${NB}01/10/2026`, C.ink, 500]].forEach(([str, fill, w]) => {
        const sp = el('tspan', { fill, 'font-weight': w }, v); sp.textContent = str;
      });
      fit(t, measure(v).x - 16, 'bloc 7 titre / version');
    },
  ];

  const S = { pieces: [], rej: [], titles: [] };

  function build() {
    D.template({ author: null });
    D.title('Un bon standard', 'tient sur une page.', 1020);
    D.chapeau('Un standard rigide est souvent un standard trop long.');

    // Explication courte au-dessus du visuel
    fit(rich(D.svg, 62, 352, [['Les ', 0], ['7 blocs', 'b'], [' d’un bon standard, remplis avec ', 0], ['l’exemple d’un poste', 'b'], ['.', 0]]), 1020, 'explication 1');
    fit(rich(D.svg, 62, 384, [['Les blocs ', 0], ['3 et 6', 'b'], [' manquent le plus souvent. ', 0], ['En rouge', 'r'], [', ce qu’il ne contient pas.', 0]]), 1020, 'explication 2');

    const defs = el('defs');
    const cpF = el('clipPath', { id: 'frameClip' }, defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26 }, cpF);
    const cpP = el('clipPath', { id: 'photoClip' }, defs);
    el('rect', { x: SLOTS[0].x + 12, y: SLOTS[0].y + 42, width: SLOTS[0].w - 24, height: 94, rx: 10 }, cpP);
    const blur = el('filter', { id: 'soft', x: '-20%', y: '-40%', width: '140%', height: '180%' }, defs);
    el('feGaussianBlur', { stdDeviation: 9 }, blur);
    const paper = el('filter', { id: 'paper', x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
    el('feDropShadow', { dx: 0, dy: 4, stdDeviation: 6, 'flood-color': C.ink, 'flood-opacity': 0.1 }, paper);

    // ----- Cadre et page du standard -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    el('rect', { x: PAGE.x, y: PAGE.y, width: PAGE.w, height: PAGE.h, rx: 10, fill: C.white, stroke: CARD_LINE, 'stroke-width': 1.5, filter: 'url(#paper)' });
    const lab = text(D.svg, IX, 461, 'STANDARD DE TRAVAIL', { size: 15, weight: 700, fill: MUTED });
    lab.setAttribute('letter-spacing', 1.5);
    fit(text(D.svg, IX, 489, `Poste 4${NB}·${NB}Montage du capot`, { size: 21, weight: 800, fill: C.ink }), 540, 'en-tête de page');
    const pc = chip(D.svg, IR, 471, 'Page 1/1', { bg: C.pLav, fg: C.blue, anchor: 'end', h: 28 });
    S.pageChip = pc.g;
    S.pageChipC = [pc.x0 + pc.width / 2, 471];
    el('line', { x1: IX, y1: 499, x2: IR, y2: 499, stroke: CARD_LINE, 'stroke-width': 1.5 });

    // Emplacements fantômes (visibles quand la page est démontée)
    S.ghosts = SLOTS.map((r, k) => {
      const key = KEY.includes(k);
      const g = el('g', { display: 'none' });
      const fill = el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, rx: 14, fill: key ? C.pYellow : '#f4f4fa' }, g);
      el('rect', { x: r.x + 1, y: r.y + 1, width: r.w - 2, height: r.h - 2, rx: 13, fill: 'none', stroke: key ? C.yellow : DASH, 'stroke-width': 2, 'stroke-dasharray': '8 6' }, g);
      el('circle', { cx: r.x + 24, cy: r.y + 25, r: 12, fill: 'none', stroke: key ? C.yellow : DASH, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, g);
      text(g, r.x + 24, r.y + 30.5, String(k + 1), { size: 15, weight: 800, fill: key ? C.tYellow : DASH, anchor: 'middle' });
      const ly = r.y + 25, lx = r.x + 42;
      el('path', { d: `M ${lx + 6} ${ly - 5} L ${lx} ${ly} L ${lx + 6} ${ly + 5} M ${lx} ${ly} H ${r.x + EX[k].dx}`, fill: 'none', stroke: key ? C.yellow : '#a9a9c9', 'stroke-width': 2, 'stroke-dasharray': '4 4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      return { g, fill, key };
    });

    // Contour de la page complète
    S.pageGlow = el('rect', { x: PAGE.x - 3, y: PAGE.y - 3, width: PAGE.w + 6, height: PAGE.h + 6, rx: 13, fill: 'none', stroke: C.green, 'stroke-width': 4, display: 'none' });

    // ----- Les 7 blocs -----
    const shadowLayer = el('g', { 'clip-path': 'url(#frameClip)' });
    const pieceLayer = el('g', { 'clip-path': 'url(#frameClip)' });
    SLOTS.forEach((r, k) => {
      const sh = el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, rx: 14, fill: C.ink, filter: 'url(#soft)', display: 'none' }, shadowLayer);
      const g = el('g', {}, pieceLayer);
      el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, rx: 14, fill: BLOCK_BG, stroke: CARD_LINE, 'stroke-width': 1.5 }, g);
      const p = { g, sh, r, k, cx: r.x + r.w / 2, cy: r.y + r.h / 2 };
      if (KEY.includes(k)) {
        p.hl = el('rect', { x: r.x + 0.5, y: r.y + 0.5, width: r.w - 1, height: r.h - 1, rx: 13.5, fill: 'none', stroke: C.yellow, 'stroke-width': 3 }, g);
        // Badge « souvent oublié » (à droite du titre)
        const b = chip(g, r.x + r.w - 12, r.y + 25, 'Souvent oublié', {
          bg: C.pYellow, fg: C.tYellow, anchor: 'end', h: 26,
          icon: (gg, cx, cy) => {
            const pts = [];
            for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 3.6 : 8; pts.push(`${f2(cx - 2 + rr * Math.cos(a))} ${f2(cy + 0.5 + rr * Math.sin(a))}`); }
            el('path', { d: `M ${pts.join(' L ')} Z`, fill: C.yellow }, gg);
          },
        });
        p.badge = b.g;
        p.badgeC = [b.x0 + b.width / 2, r.y + 25];
      }
      BUILDERS[k](g, r);
      S.pieces.push(p);
    });
    S.pieces.forEach(p => { if (p.badge) p.g.appendChild(p.badge); });
    S.pieces.forEach(p => { if (p.badge) { const tb = measure(S.titles[p.k]); fit(p.badge, p.r.x + p.r.w - 10, `badge bloc ${p.k + 1}`, tb.x + tb.width + 12); } });

    // Anneau du clic quand un bloc s'emboîte
    S.rings = SLOTS.map((r, k) => el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, rx: 14, fill: 'none', stroke: KEY.includes(k) ? C.yellow : C.blue, 'stroke-width': 3, display: 'none' }));

    // ----- Ce qu'il ne contient pas -----
    S.flashes = REJ.map(c => el('rect', { x: PAGE.x + PAGE.w - 4, y: c.y + 14, width: 8, height: RH - 28, rx: 4, fill: C.red, display: 'none' }));
    const rejShadows = el('g', { 'clip-path': 'url(#frameClip)' });
    const rejLayer = el('g', { 'clip-path': 'url(#frameClip)' });
    REJ.forEach((c, i) => {
      const sh = el('rect', { x: 0, y: 0, width: RW, height: RH, rx: 18, fill: C.ink, filter: 'url(#soft)', display: 'none' }, rejShadows);
      const g = el('g', {}, rejLayer);
      const box = el('rect', { x: 0, y: 0, width: RW, height: RH, rx: 18, 'stroke-width': 2.5 }, g);
      const iconQ = el('g', {}, g);
      el('circle', { cx: 32, cy: 38, r: 17, fill: MUTED }, iconQ);
      text(iconQ, 32, 45, '?', { size: 20, weight: 800, fill: C.white, anchor: 'middle' });
      const iconX = el('g', {}, g);
      crossMark(iconX, 0, 0, 17);
      const labels = c.label.map((l, k) => {
        const n = text(g, 60, 34 + 24 * k, l, { size: 17, weight: 800, fill: C.tRed });
        fit(n, RW - 12, `rejet ${i + 1} ligne ${k + 1}`, 0);
        return n;
      });
      const div = el('rect', { x: 16, y: 88, width: RW - 32, height: 66, rx: 12 }, g);   // la ligne qu'on voudrait ajouter
      let strike, slen;
      if (c.ex) {
        const ex = text(g, 28, 126.5, c.ex, { size: 15, weight: 500, fill: REASON });
        fit(ex, RW - 24, `rejet ${i + 1} exemple`, 20);
        const b = measure(ex);
        slen = b.width + 8;
        strike = el('line', { x1: b.x - 4, y1: 121.5, x2: b.x + b.width + 4, y2: 121.5, stroke: C.red, 'stroke-width': 2.4, 'stroke-opacity': 0.85, 'stroke-linecap': 'round' }, g);
      } else {
        // Des paragraphes : un mur de texte
        [[30, 101, 232], [30, 113, 216], [30, 125, 236], [30, 137, 168]].forEach(([x, y, w]) => el('rect', { x, y, width: w, height: 7, rx: 3.5, fill: '#d3d3e4' }, g));
        slen = Math.hypot(234, 46);
        strike = el('line', { x1: 30, y1: 98, x2: 264, y2: 144, stroke: C.red, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
      }
      strike.setAttribute('stroke-dasharray', f2(slen));
      S.rej.push({ g, sh, box, iconQ, iconX, labels, div, strike, slen, c, i });
    });

    // ----- Pastilles d'étape (en haut de la colonne de droite) -----
    S.pills = [
      pillShape(D.svg, PILL_X, PILL_Y, `1${NB}·${NB}Vue éclatée${NB}: 7 blocs`, { bg: C.blue, fg: C.white }),
      null,
      pillShape(D.svg, PILL_X, PILL_Y, 'Tient sur une page', { bg: C.pGreen, fg: C.tGreen, icon: 'check' }),
      pillShape(D.svg, PILL_X, PILL_Y, 'Ce qu’il ne contient pas', { bg: C.pRed, fg: C.tRed, icon: 'cross' }),
    ];
    // Pastille 2 : compteur qui roule
    {
      const g = el('g');
      const size = 19, h = 40, cy = PILL_Y;
      const r = el('rect', { x: PILL_X, y: cy - h / 2, height: h, rx: h / 2, fill: C.blue }, g);
      const pre = text(g, PILL_X + 18, cy + size * 0.36, `2${NB}·${NB}Assemblage${NB}:${NB}`, { size, weight: 700, fill: C.white });
      const px = PILL_X + 18 + measure(pre).width;
      let dw = 0;
      for (let d = 0; d <= 7; d++) { const n = text(g, 0, 0, String(d), { size, weight: 700 }); dw = Math.max(dw, measure(n).width); n.remove(); }
      const cp = el('clipPath', { id: 'digitClip' }, defs);
      el('rect', { x: px - 2, y: cy - 15, width: dw + 4, height: 30 }, cp);
      const dg = el('g', { 'clip-path': 'url(#digitClip)' }, g);
      const dA = text(dg, px + dw / 2, cy + size * 0.36, '0', { size, weight: 700, fill: C.white, anchor: 'middle' });
      const dB = text(dg, px + dw / 2, cy + size * 0.36, '1', { size, weight: 700, fill: C.white, anchor: 'middle' });
      const suf = text(g, px + dw + 1, cy + size * 0.36, '/7', { size, weight: 700, fill: C.white });
      r.setAttribute('width', f2(px + dw + 1 + measure(suf).width + 18 - PILL_X));
      S.counter = { dA, dB, base: cy + size * 0.36 };
      S.pills[1] = g;
    }
    S.pills.forEach((p, i) => fit(p, 1006, `pastille ${i + 1}`));

    D.encart(['Aller plus loin', 'Nos fiches Lean', '(lien en commentaire)']);
  }

  // ---------- États ----------
  // Bloc k à l'instant t : décalage, rotation, échelle, hauteur (ombre)
  function pieceState(k, t, final) {
    const st = { dx: 0, dy: 0, rot: 0, s: 1, sx: 1, sy: 1, h: 0 };
    if (final) return st;
    const e = EX[k];
    const te = T_EXP(k), tl = T_LAND(k);
    // Les blocs flottent pendant la vue éclatée, puis restent immobiles en l'air pendant l'assemblage
    const bob = 2.5 * Math.sin(2 * Math.PI * t / 1.8 + k * 0.9) * prog(t, te + 0.45, 0.3) * (1 - prog(t, T_LAND(0) - 0.15, 0.3));
    if (t < te) return st;
    if (t < tl) {
      const u = t - te;
      const lift = easeOut(prog(u, 0, 0.22));
      const gl = easeInOut(prog(u, 0.12, EXP_DUR - 0.12));
      st.h = 0.7 * lift; st.s = 1 + 0.02 * lift;
      st.dx = e.dx * gl; st.rot = e.rot * gl; st.dy = bob;
      return st;
    }
    const u = t - tl;
    if (u >= LAND_END) return st;
    const gl = easeInOut(prog(u, 0.06, 0.4));
    st.dx = e.dx * (1 - gl); st.rot = e.rot * (1 - gl); st.dy = bob * (1 - gl);
    if (u < 0.36) {
      const l2 = easeOut(prog(u, 0, 0.12));
      st.h = 0.7 + 0.3 * l2; st.s = 1.02 + 0.015 * l2;
    } else if (u < CONTACT) {
      const d = easeIn(prog(u, 0.36, CONTACT - 0.36));
      st.h = 1 - d; st.s = 1.035 - 0.035 * d;
    } else {
      const q = prog(u, CONTACT, 0.13), q2 = prog(u, CONTACT + 0.13, 0.18);
      st.sx = 1 + 0.02 * bump(q); st.sy = 1 - 0.045 * bump(q);      // tassement
      st.s = 1 + 0.014 * bump(q2); st.h = 0.12 * bump(q2);           // petit rebond
    }
    return st;
  }
  const landed = (k, t) => t >= T_LAND(k) + CONTACT;

  // Carte rejetée i : position, rotation, écrasement, ombre, état rouge
  function rejState(i, t, final) {
    const c = REJ[i];
    const st = { x: RX, rot: c.rot, sx: 1, h: 0, red: true, show: true, strike: 1, icon: 1 };
    if (final) return st;
    const t0 = T_REJ[i];
    if (t < t0) {
      const p = easeIn(prog(t, T_REJ_OUT(i), REJ_OUT_DUR));
      if (p >= 1) { st.show = false; return st; }
      st.x = RX + 340 * p;
      return st;
    }
    const u = t - t0;
    if (u < APPROACH) {
      st.x = lerp(ENTRY_X, CONTACT_X, Math.pow(u / APPROACH, 1.7));
      st.rot = 0; st.h = 0.8; st.red = false; st.strike = 0; st.icon = 0;
      return st;
    }
    const v = u - APPROACH;
    if (v >= RECOIL) return st;
    const p = v / RECOIL;
    st.x = RX - (RX - CONTACT_X) * spring(p);
    st.rot = c.rot * easeOut(prog(v, 0, 0.4)) + 1.6 * Math.sin(Math.PI * 3 * p) * Math.pow(1 - p, 2);
    st.sx = 1 - 0.07 * bump(prog(v, 0, 0.14));
    st.h = 0.8 * (1 - easeOut(prog(v, 0.05, 0.45)));
    st.strike = easeInOut(prog(v, 0.15, 0.3));
    st.icon = prog(v, 0, 0.3);
    return st;
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_OUT;

    // Blocs
    S.pieces.forEach(p => {
      const st = pieceState(p.k, t, final);
      const moving = st.dx || st.dy || st.rot || st.s !== 1 || st.sx !== 1 || st.sy !== 1;
      const tf = moving
        ? `translate(${f2(st.dx)} ${f2(st.dy)}) translate(${f2(p.cx)} ${f2(p.cy)}) rotate(${f2(st.rot)}) scale(${(st.s * st.sx).toFixed(4)} ${(st.s * st.sy).toFixed(4)}) translate(${f2(-p.cx)} ${f2(-p.cy)})`
        : '';
      p.g.setAttribute('transform', tf);
      if (st.h > 0.005) {
        p.sh.setAttribute('display', 'inline');
        p.sh.setAttribute('transform', `translate(${f2(4 + 10 * st.h)} ${f2(6 + 14 * st.h)}) ${tf}`);
        p.sh.setAttribute('opacity', f2(0.26 * st.h));
      } else p.sh.setAttribute('display', 'none');
      // Blocs 3 et 6 : contour jaune et badge à l'arrivée
      if (p.hl) {
        const c = T_LAND(p.k) + CONTACT, te = T_EXP(p.k);
        // Avant le démontage : comme l'image finale ; en vol : neutre ; à l'arrivée : jaune et badge
        const ho = final ? 1 : t < c ? 1 - prog(t, te, 0.2) : prog(t, c, 0.15);
        p.hl.setAttribute('display', ho > 0.001 ? 'inline' : 'none');
        p.hl.setAttribute('opacity', f2(ho));
        const pb = final ? 1 : t < c ? 1 - prog(t, te, 0.18) : prog(t, c + 0.1, 0.35);
        const kb = t < c && !final ? Math.max(0.001, pb) : popScale(pb);
        p.badge.setAttribute('display', pb > 0 ? 'inline' : 'none');
        p.badge.setAttribute('transform', kb === 1 ? '' : `translate(${f2(p.badgeC[0])} ${f2(p.badgeC[1])}) scale(${f2(kb)}) translate(${f2(-p.badgeC[0])} ${f2(-p.badgeC[1])})`);
      }
    });

    // Emplacements fantômes
    const gOp = final ? 0 : prog(t, T_GHOST, 0.4);
    S.ghosts.forEach((gh, k) => {
      const on = gOp > 0 && t < T_LAND(k) + CONTACT + 0.2;
      gh.g.setAttribute('display', on ? 'inline' : 'none');
      if (!on) return;
      gh.g.setAttribute('opacity', f2(gOp));
      if (gh.key) gh.fill.setAttribute('opacity', f2(0.35 + 0.65 * Math.pow(Math.sin(Math.PI * (t - T_GHOST) / 0.9), 2)));
    });

    // Anneaux du clic
    S.rings.forEach((rg, k) => {
      const q = final ? 0 : prog(t, T_LAND(k) + CONTACT, 0.42);
      if (q <= 0 || q >= 1) { rg.setAttribute('display', 'none'); return; }
      const r = SLOTS[k], e = 2 + 10 * easeOut(q);
      rg.setAttribute('display', 'inline');
      rg.setAttribute('x', f2(r.x - e)); rg.setAttribute('y', f2(r.y - e));
      rg.setAttribute('width', f2(r.w + 2 * e)); rg.setAttribute('height', f2(r.h + 2 * e));
      rg.setAttribute('rx', f2(14 + e));
      rg.setAttribute('opacity', f2(0.9 * (1 - q)));
    });

    // Page complète : contour vert et « Page 1/1 » qui pulse
    const qd = final ? 0 : prog(t, T_DONE, 0.7);
    if (qd > 0 && qd < 1) { S.pageGlow.setAttribute('display', 'inline'); S.pageGlow.setAttribute('opacity', f2(1 - easeIn(qd))); }
    else S.pageGlow.setAttribute('display', 'none');
    const kc = 1 + 0.14 * bump(prog(t, T_DONE, 0.45));
    S.pageChip.setAttribute('transform', kc === 1 ? '' : `translate(${f2(S.pageChipC[0])} ${f2(S.pageChipC[1])}) scale(${f2(kc)}) translate(${f2(-S.pageChipC[0])} ${f2(-S.pageChipC[1])})`);

    // Ce qu'il ne contient pas
    S.rej.forEach(R => {
      const st = rejState(R.i, t, final);
      const y = R.c.y;
      if (!st.show) { R.g.setAttribute('display', 'none'); R.sh.setAttribute('display', 'none'); }
      else {
        R.g.setAttribute('display', 'inline');
        const tf = `translate(${f2(st.x)} ${y}) rotate(${f2(st.rot)} ${RW / 2} ${RH / 2})` + (st.sx !== 1 ? ` scale(${st.sx.toFixed(4)} 1)` : '');
        R.g.setAttribute('transform', tf);
        if (st.h > 0.005) {
          R.sh.setAttribute('display', 'inline');
          R.sh.setAttribute('transform', `translate(${f2(st.x + 4 + 10 * st.h)} ${f2(y + 6 + 14 * st.h)}) rotate(${f2(st.rot)} ${RW / 2} ${RH / 2})`);
          R.sh.setAttribute('opacity', f2(0.26 * st.h));
        } else R.sh.setAttribute('display', 'none');
      }
      R.box.setAttribute('fill', st.red ? C.pRed : C.white);
      R.box.setAttribute('stroke', st.red ? C.red : CARD_LINE);
      R.div.setAttribute('fill', st.red ? C.white : '#f1f1f8');
      R.div.setAttribute('fill-opacity', st.red ? 0.7 : 1);
      R.labels.forEach(n => n.setAttribute('fill', st.red ? C.tRed : C.ink));
      R.iconQ.setAttribute('display', st.red ? 'none' : 'inline');
      R.iconX.setAttribute('display', st.red && st.icon > 0 ? 'inline' : 'none');
      R.iconX.setAttribute('transform', `translate(32 38) scale(${f2(popScale(st.icon))})`);
      // Le trait se dessine ; une fois terminé, il perd son pointillé
      if (st.strike >= 1) { R.strike.removeAttribute('stroke-dasharray'); R.strike.removeAttribute('stroke-dashoffset'); }
      else { R.strike.setAttribute('stroke-dasharray', f2(R.slen)); R.strike.setAttribute('stroke-dashoffset', f2(R.slen * (1 - st.strike))); }
      R.strike.setAttribute('display', st.strike > 0 ? 'inline' : 'none');
      // Le bord de la page s'allume au choc
      const qf = final ? 0 : prog(t, T_REJ[R.i] + APPROACH, 0.45);
      const fl = S.flashes[R.i];
      if (qf > 0 && qf < 1) { fl.setAttribute('display', 'inline'); fl.setAttribute('opacity', f2(1 - easeIn(qf))); }
      else fl.setAttribute('display', 'none');
    });

    // Compteur de la pastille 2
    const n = S.pieces.filter(p => landed(p.k, t)).length;
    const last = n > 0 ? T_LAND(n - 1) + CONTACT : -1;
    const qr = n > 0 ? easeInOut(prog(t, last, 0.22)) : 1;
    S.counter.dA.textContent = String(Math.max(0, n - 1));
    S.counter.dB.textContent = String(n);
    S.counter.dA.setAttribute('y', f2(S.counter.base - 24 * qr));
    S.counter.dA.setAttribute('display', qr < 1 && n > 0 ? 'inline' : 'none');
    S.counter.dB.setAttribute('y', f2(S.counter.base + 24 * (n > 0 ? 1 - qr : 0)));

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = PILLS_T[i] + 0.12, b = i + 1 < PILLS_T.length ? PILLS_T[i + 1] : Infinity;
      let o, dy = 0;
      if (final) o = i === 3 ? 1 : 0;
      else if (i === 3 && t < PILLS_T[3]) o = 1 - prog(t, T_OUT, 0.14);   // l'image finale sort
      else { o = prog(t, a, 0.25) * (1 - prog(t, b, 0.14)); dy = 8 * (1 - prog(t, a, 0.25)); }
      g.setAttribute('display', o > 0.001 ? 'inline' : 'none');
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy > 0.005 ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
