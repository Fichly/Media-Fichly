// Fiche LinkedIn · page Fichly · mardi 27 octobre 2026 (Buffer 6abe5d7ea1257d1a53a17036)
// Post : « La White Belt Fichly est ouverte. Une heure pour poser les fondamentaux du Lean, gratuitement. »
// « Le visuel résume le parcours sur une page. » Premier commentaire : le lien vers la White Belt → encart.
// Le visuel EST la fiche : l'interface du cours. À gauche les 7 modules du post (titre, description, durée,
// coche), en haut la progression 0 → 60 min, à droite le lecteur, la carte « Ce que vous saurez faire »
// (les 4 compétences du post) et le public visé.
// Animation : un clic sur « revoir », la progression se rembobine, puis chaque module se lit (vignette,
// barre de lecture, compteur), se coche, la progression monte ; à la fin la carte des compétences se
// déverrouille et coche les 4 compétences, puis le badge « White Belt » prend place dans le lecteur.
// Durées par module : le post ne les donne pas, elles sont réparties de façon plausible sur 60 min.
// Style propre : le lecteur de cours. Image t = 0 = état final. Boucle exacte de 12,5 s.
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
  const bump = (t, s, d) => { const p = prog(t, s, d); return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0; };
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const k3 = v => Math.max(0.001, v).toFixed(3);
  const about = (cx, cy, sx, sy = sx) => `translate(${f2(cx)} ${f2(cy)}) scale(${k3(sx)} ${k3(sy)}) translate(${f2(-cx)} ${f2(-cy)})`;
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = rgb(a), B = rgb(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  const NB = ' ';
  // Opacité ; à 0, l'élément sort du rendu (display none)
  const op = (node, v) => {
    const o = Number(v);
    node.setAttribute('opacity', f2(o));
    if (o <= 0.0005) node.setAttribute('display', 'none'); else node.removeAttribute('display');
  };
  const show = (node, on) => { if (on) node.removeAttribute('display'); else node.setAttribute('display', 'none'); };

  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', HEAD_SOFT = '#cfd0ec', DESC = '#5d5d8a';
  const CHIP_BG = '#eeeef6', TRACK = '#e2e2ef', ICON_BG = '#5f5fb3', GHOST = '#9d9dd6', TODO_RING = '#d3d3e6';
  const LOCKED_TXT = '#8b8bb0', BAND_TRACK = '#6a6ab4';

  // ---------- Contenu (mots du post) ----------
  // Durées : non précisées par le post, réparties sur 60 min (8 + 10 + 9 + 8 + 10 + 8 + 7)
  const MODS = [
    { title: 'Comprendre le Lean', min: 8, icon: 'cycle', desc: 'Un système de management centré sur la valeur, les problèmes et l’amélioration.' },
    { title: 'Valeur et gaspillages', min: 10, icon: 'gem', desc: 'Ce que le client paie vraiment, et les activités qui n’apportent rien.' },
    { title: 'Observer le terrain', min: 9, icon: 'eye', desc: 'Pourquoi tout commence par le réel, et comment observer un poste ou un flux.' },
    { title: 'Standardiser pour améliorer', min: 8, icon: 'std', desc: 'Ce qu’un standard rend visible, et pourquoi il ne fige rien.' },
    { title: 'Résoudre les problèmes', min: 10, icon: 'target', desc: 'Passer du symptôme à la cause, et choisir l’outil adapté.' },
    { title: 'Manager visuellement', min: 8, icon: 'board', desc: 'Rendre les écarts visibles pour décider et agir.' },
    { title: 'Faire durer', min: 7, icon: 'cal', desc: 'Ce qui fait tenir une démarche après son lancement.' },
  ];
  const TOTAL = 60;
  const CUM = [0];
  MODS.forEach((m, i) => CUM.push(CUM[i] + m.min));
  if (CUM[7] !== TOTAL) console.error(`Durées : ${CUM[7]} min au lieu de 60`);
  const SKILLS = [
    'Expliquer le Lean simplement à une équipe',
    'Repérer les gaspillages d’un poste ou d’un flux',
    'Choisir un premier problème et la méthode pour le traiter',
    'Identifier ce qui fera durer, ou non, une démarche dans votre atelier',
  ];
  const ROLES = [['Opérateurs', C.teal], ['Chefs d’équipe', C.violet], ['Managers', C.yellow], ['Fonctions support', C.lightBlue]];

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 746 };
  const BAND_H = 96;
  const LX = 78, LW = 462, RX = 556, RW = 446;
  const ROW_H = 84, ROW_Y = i => 518 + i * 90;
  const PLAYER = { x: RX, y: 518, w: RW, h: 196 };
  const SCR = { x: RX + 9, y: 527, w: RW - 18, h: 130 };
  const SCY = 600;                                   // centre du contenu des vignettes
  const CTRL_Y = 686;
  const BTN = { cx: RX + 30, cy: CTRL_Y, r: 16 };
  const SKC = { x: RX, y: 726, w: RW, h: 246 };
  const PUB = { x: RX, y: 984, w: RW, h: 158 };
  const TRK = { x0: 150, x1: 916, y: 476, h: 12 };
  const trkX = m => TRK.x0 + (TRK.x1 - TRK.x0) * m / TOTAL;

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_CUR = 0.6, T_CLICK = 1.12, T_REW = 1.28, REW = 0.62;   // clic sur « revoir », rembobinage
  const T0 = 2.05, KPM = 0.075, GAP = 0.27;                      // lecture : 0,075 s par minute de cours
  const S = [], E = [];
  MODS.forEach((m, i) => { S.push(i ? E[i - 1] + GAP : T0); E.push(S[i] + m.min * KPM); });
  const T_END = E[6];
  const T_UNLOCK = T_END + 0.35;
  const T_SK = SKILLS.map((_, k) => T_UNLOCK + 0.3 + 0.28 * k);
  const T_BADGE = T_SK[3] + 0.42;
  // Rembobinage : la coche d'un module s'efface quand la progression repasse sous sa fin
  const rewM = t => TOTAL * (1 - easeInOut(prog(t, T_REW, REW)));
  const U = MODS.map((_, i) => {
    const target = 1 - CUM[i + 1] / TOTAL;
    let a = 0, b = 1;
    for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (easeInOut(m) < target) a = m; else b = m; }
    return T_REW + REW * a;
  });
  // Défilement des vignettes : [début, de, vers]
  const SLIDES = [[T_REW + 0.04, 7, 0], ...E.map((e, i) => [e + 0.03, i, i + 1])];
  const SLIDE_DUR = [0.58, 0.28, 0.28, 0.28, 0.28, 0.28, 0.28, 0.3];
  // Pastilles du lecteur : modules 1 à 7 puis « Parcours terminé »
  const PILL_IN = [T_REW + REW + 0.02, ...E.slice(0, 6).map(e => e + 0.14), T_END + 0.14];
  const PILL_OUT = [...E.map(e => e + 0.02), Infinity];

  // Temps du cours (minutes) à l'instant t
  function courseMin(t, final) {
    if (final) return TOTAL;
    if (t < T_REW + REW) return rewM(t);
    for (let i = 0; i < 7; i++) {
      if (t < S[i]) return CUM[i];
      if (t < E[i]) return CUM[i] + MODS[i].min * prog(t, S[i], E[i] - S[i]);
    }
    return TOTAL;
  }
  const mmss = sec => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

  // ---------- Petits éléments ----------
  function rich(parent, x, y, segs, size = 22) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': 500, fill: C.ink }, parent);
    segs.forEach(([s, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = s; });
    return t;
  }
  // Texte coupé en lignes de largeur maxW (mesurée), renvoie les nœuds.
  // Sur deux lignes, la coupure est équilibrée (pas de mot seul), de préférence après une virgule.
  function wrap(parent, x, y, str, maxW, lh, opts) {
    const probe = text(parent, x, y, '', opts);
    const width = s => { probe.textContent = s; return probe.getComputedTextLength(); };
    const words = str.split(' ');
    let lines = [];
    let cur = '';
    words.forEach(w => {
      const test = cur ? `${cur} ${w}` : w;
      if (cur && width(test) > maxW) { lines.push(cur); cur = w; } else cur = test;
    });
    if (cur) lines.push(cur);
    if (lines.length === 2) {
      let best = null;
      for (let k = 1; k < words.length; k++) {
        const a = words.slice(0, k).join(' '), b = words.slice(k).join(' ');
        const wa = width(a), wb = width(b);
        if (wa > maxW || wb > maxW) continue;
        const score = Math.max(wa, wb) - (a.endsWith(',') ? 40 : 0);
        if (!best || score < best.score) best = { score, lines: [a, b] };
      }
      if (best) lines = best.lines;
    }
    probe.remove();
    return lines.map((l, i) => text(parent, x, y + i * lh, l, opts));
  }
  const checkPath = (cx, cy, s = 1) => `M ${f2(cx - 6.5 * s)} ${f2(cy + 0.5 * s)} L ${f2(cx - 2 * s)} ${f2(cy + 5 * s)} L ${f2(cx + 7 * s)} ${f2(cy - 4.5 * s)}`;
  function pillShape(parent, label, { bg, fg, icon, size = 15, h = 30 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x: 0, y: -h / 2, height: h, rx: h / 2, fill: bg }, g);
    const ix = 15;
    if (icon === 'play') el('path', { d: `M ${ix - 4} -6 L ${ix + 6} 0 L ${ix - 4} 6 Z`, fill: fg, 'stroke-linejoin': 'round', stroke: fg, 'stroke-width': 1.5 }, g);
    else if (icon === 'check') {
      el('circle', { cx: ix + 1, cy: 0, r: 9, fill: C.green }, g);
      el('path', { d: checkPath(ix + 1, 0, 0.72), fill: 'none', stroke: C.white, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    const tx = text(g, ix + 16, size * 0.36, label, { size, weight: 700, fill: fg });
    const w = tx.getBBox().width + ix + 16 + 14;
    r.setAttribute('width', f2(w));
    return { g, w };
  }

  // Pictogrammes des modules (blancs, centrés, ~32 px)
  const W = { fill: 'none', stroke: C.white, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const ICONS = {
    cycle(g) {
      el('path', { d: 'M 13 -3 A 13.5 13.5 0 0 0 -11 -8', ...W }, g);
      el('path', { d: 'M -13 3 A 13.5 13.5 0 0 0 11 8', ...W }, g);
      el('path', { d: 'M -14 -15 L -11 -8 L -4 -10', ...W }, g);
      el('path', { d: 'M 14 15 L 11 8 L 4 10', ...W }, g);
    },
    gem(g) {
      el('path', { d: 'M -15 -5 L -8 -13 H 8 L 15 -5 L 0 15 Z', fill: C.white, stroke: C.white, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
      el('path', { d: 'M -15 -5 H 15 M -5 -13 L -4 -5 L 0 15 M 5 -13 L 4 -5 L 0 15', fill: 'none', stroke: ICON_BG, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    },
    eye(g) {
      el('path', { d: 'M -17 0 C -9 -12, 9 -12, 17 0 C 9 12, -9 12, -17 0 Z', fill: C.white }, g);
      el('circle', { cx: 0, cy: 0, r: 6.5, fill: ICON_BG }, g);
      el('circle', { cx: 2, cy: -2, r: 2.2, fill: C.white }, g);
    },
    std(g) {
      el('rect', { x: -12, y: -13, width: 24, height: 29, rx: 4, fill: C.white }, g);
      el('rect', { x: -6, y: -17, width: 12, height: 7, rx: 2.5, fill: ICON_BG, stroke: C.white, 'stroke-width': 2 }, g);
      [-3, 4, 11].forEach(y => {
        el('path', { d: `M -7 ${y - 1} L -5 ${y + 1} L -2 ${y - 2}`, fill: 'none', stroke: ICON_BG, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        el('line', { x1: 1, y1: y, x2: 7, y2: y, stroke: ICON_BG, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
      });
    },
    target(g) {
      el('circle', { cx: 0, cy: 0, r: 15, ...W }, g);
      el('circle', { cx: 0, cy: 0, r: 8, ...W }, g);
      el('circle', { cx: 0, cy: 0, r: 2.8, fill: C.white }, g);
    },
    board(g) {
      el('rect', { x: -16, y: -13, width: 32, height: 23, rx: 3.5, ...W }, g);
      el('line', { x1: -8, y1: 10, x2: -11, y2: 17, ...W }, g);
      el('line', { x1: 8, y1: 10, x2: 11, y2: 17, ...W }, g);
      [[-9, 6, C.green], [-1, 9, C.green], [7, 4, C.red]].forEach(([x, h, c]) => el('rect', { x: x - 2.5, y: 5 - h, width: 5, height: h, rx: 1.5, fill: c }, g));
    },
    cal(g) {
      el('rect', { x: -15, y: -12, width: 30, height: 27, rx: 4.5, fill: C.white }, g);
      el('rect', { x: -15, y: -12, width: 30, height: 8, rx: 4, fill: C.white }, g);
      el('line', { x1: -15, y1: -4, x2: 15, y2: -4, stroke: ICON_BG, 'stroke-width': 2 }, g);
      [-8, 8].forEach(x => el('line', { x1: x, y1: -16, x2: x, y2: -9, stroke: C.white, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, g));
      el('path', { d: 'M -6 5 L -1.5 9.5 L 7 1', fill: 'none', stroke: ICON_BG, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    },
  };
  const hexPts = (cx, cy, r) => Array.from({ length: 6 }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / 3; return `${f2(cx + r * Math.cos(a))} ${f2(cy + r * Math.sin(a))}`; }).join(' L ');
  const starPath = (cx, cy, R, r) => { const p = []; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, q = k % 2 ? r : R; p.push(`${f2(cx + q * Math.cos(a))} ${f2(cy + q * Math.sin(a))}`); } return `M ${p.join(' L ')} Z`; };

  const ST = { rows: [], slides: [], skills: [] };

  function build() {
    D.template({ author: null });
    D.title('La White Belt Fichly', 'est ouverte.', 1020);
    D.chapeau('Une heure pour poser les fondamentaux du Lean, gratuitement.');

    // Explication courte au-dessus du visuel
    fit(rich(D.svg, 62, 352, [['À gauche, les ', 0], ['7 modules', C.blue], [` du parcours et leur durée${NB}: `, 0], ['une heure en tout', C.blue], ['.', 0]]), 1020, 'explication 1');
    fit(rich(D.svg, 62, 384, [['À droite, ', 0], ['ce que vous saurez faire', C.tGreen], [' à la fin, et ', 0], ['à qui elle s’adresse', C.blue], ['.', 0]]), 1020, 'explication 2');

    const defs = el('defs');
    const cpF = el('clipPath', { id: 'frame' }, defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26 }, cpF);
    const cpS = el('clipPath', { id: 'screen' }, defs);
    el('rect', { x: SCR.x, y: SCR.y, width: SCR.w, height: SCR.h, rx: 12 }, cpS);
    const cpT = el('clipPath', { id: 'track' }, defs);
    el('rect', { x: TRK.x0, y: TRK.y, width: TRK.x1 - TRK.x0, height: TRK.h, rx: TRK.h / 2 }, cpT);
    const lift = el('filter', { id: 'lift', x: '-40%', y: '-40%', width: '180%', height: '180%' }, defs);
    el('feDropShadow', { dx: 0, dy: 6, stdDeviation: 5, 'flood-color': C.ink, 'flood-opacity': 0.28 }, lift);
    const cshadow = el('filter', { id: 'cshadow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    el('feDropShadow', { dx: 1, dy: 2, stdDeviation: 1.5, 'flood-color': C.ink, 'flood-opacity': 0.35 }, cshadow);

    // ----- Cadre de l'application et bandeau -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: BAND_H, fill: C.blue, 'clip-path': 'url(#frame)' });
    const bt = text(D.svg, 92, FRAME.y + 42, 'White Belt Fichly', { size: 22, weight: 800, fill: C.white });
    const bx = measure(bt).x + measure(bt).width + 14;
    const free = el('g', { transform: `translate(${f2(bx)} ${FRAME.y + 34})` });
    const fr = el('rect', { x: 0, y: -14, height: 28, rx: 14, fill: C.pYellow }, free);
    const ft = text(free, 14, 5.5, 'Gratuite', { size: 15, weight: 700, fill: C.tYellow });
    fr.setAttribute('width', f2(ft.getBBox().width + 28));
    ST.counter = text(D.svg, 988, FRAME.y + 42, '60 min', { size: 22, weight: 800, fill: C.white, anchor: 'end' });
    ST.counterLbl = text(D.svg, 0, FRAME.y + 42, 'Progression', { size: 16, weight: 700, fill: HEAD_SOFT, anchor: 'end' });
    text(D.svg, 92, TRK.y + 11, `0${NB}min`, { size: 15, weight: 700, fill: HEAD_SOFT });
    text(D.svg, 988, TRK.y + 11, `60${NB}min`, { size: 15, weight: 700, fill: HEAD_SOFT, anchor: 'end' });
    const trk = el('g', { 'clip-path': 'url(#track)' });
    el('rect', { x: TRK.x0, y: TRK.y, width: TRK.x1 - TRK.x0, height: TRK.h, fill: BAND_TRACK }, trk);
    ST.fill = el('rect', { x: TRK.x0, y: TRK.y, width: 0, height: TRK.h, fill: C.green }, trk);
    ST.flash = MODS.map((_, i) => el('rect', { x: f2(trkX(CUM[i])), y: TRK.y, width: f2(trkX(CUM[i + 1]) - trkX(CUM[i])), height: TRK.h, fill: C.white, opacity: 0 }, trk));
    CUM.slice(1, 7).forEach(m => el('rect', { x: f2(trkX(m) - 1.5), y: TRK.y, width: 3, height: TRK.h, fill: C.blue }, trk));
    ST.knob = el('circle', { cx: TRK.x0, cy: TRK.y + TRK.h / 2, r: 9, fill: C.white, stroke: C.green, 'stroke-width': 3.5 });

    // ----- Les 7 modules -----
    MODS.forEach((m, i) => el('rect', { x: LX, y: ROW_Y(i), width: LW, height: ROW_H, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 1.5 }));
    ST.hl = el('g');
    el('rect', { x: LX, y: 0, width: LW, height: ROW_H, rx: 16, fill: C.pLav, stroke: C.blue, 'stroke-width': 2.5 }, ST.hl);
    MODS.forEach((m, i) => {
      const y0 = ROW_Y(i), cx = LX + 32, cy = y0 + 30;
      const g = el('g');
      // Pastille d'état : numéro, anneau de lecture, coche
      const todo = el('g', {}, g);
      el('circle', { cx, cy, r: 16, fill: C.white, stroke: TODO_RING, 'stroke-width': 3 }, todo);
      const num = text(todo, cx, cy + 5.5, String(i + 1), { size: 16, weight: 800, fill: MUTED, anchor: 'middle' });
      const L = 2 * Math.PI * 16;
      const ring = el('circle', { cx, cy, r: 16, fill: 'none', stroke: C.blue, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-dasharray': f2(L), 'stroke-dashoffset': f2(L), transform: `rotate(-90 ${cx} ${cy})` }, g);
      const burst = el('circle', { cx, cy, r: 16, fill: 'none', stroke: C.green, 'stroke-width': 3 }, g);
      const done = el('g', {}, g);
      el('circle', { cx, cy, r: 16, fill: C.green }, done);
      el('path', { d: checkPath(cx, cy), fill: 'none', stroke: C.white, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, done);
      // Titre, durée, description
      const title = text(g, LX + 60, y0 + 33, m.title, { size: 19, weight: 800, fill: C.ink });
      const chip = el('g', {}, g);
      const cr = el('rect', { y: y0 + 13, height: 26, rx: 13, fill: CHIP_BG }, chip);
      const ct = text(chip, LX + LW - 24, y0 + 31.5, `${m.min}${NB}min`, { size: 15, weight: 700, fill: MUTED, anchor: 'end' });
      const cw = ct.getBBox().width + 24;
      cr.setAttribute('x', f2(LX + LW - 12 - cw));
      cr.setAttribute('width', f2(cw));
      fit(title, LX + LW - 12 - cw - 10, `module ${i + 1} titre`);
      const desc = wrap(g, LX + 60, y0 + 56, m.desc, LW - 60 - 16, 19, { size: 15, weight: 500, fill: DESC });
      desc.forEach((n, k) => fit(n, LX + LW - 14, `module ${i + 1} description ${k + 1}`));
      if (desc.length > 2) console.error(`Débordement : module ${i + 1} description sur ${desc.length} lignes`);
      ST.rows.push({ g, todo, num, ring, L, done, burst, title, cr, ct, cx, cy });
    });

    // ----- Lecteur -----
    el('rect', { x: PLAYER.x, y: PLAYER.y, width: PLAYER.w, height: PLAYER.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 1.5 });
    el('rect', { x: SCR.x, y: SCR.y, width: SCR.w, height: SCR.h, rx: 12, fill: C.blue });
    const scr = el('g', { 'clip-path': 'url(#screen)' });
    ST.strip = el('g', {}, scr);
    MODS.forEach((m, i) => {
      const ox = SCR.x + i * SCR.w;
      const g = el('g', {}, ST.strip);
      const ic = el('g', { transform: `translate(${ox + 58} ${SCY})` }, g);
      el('circle', { cx: 0, cy: 0, r: 37, fill: ICON_BG }, ic);
      ICONS[m.icon](el('g', { transform: 'scale(1.3)' }, ic));
      const probe = wrap(g, ox + 114, 0, m.title, SCR.w - 114 - 18, 27, { size: 22, weight: 800, fill: C.white });
      const n = probe.length;
      probe.forEach((nd, k) => { nd.setAttribute('y', f2(SCY + 8 - (n - 1) * 13.5 + k * 27)); fit(nd, ox + SCR.w - 16, `vignette ${i + 1} ligne ${k + 1}`); });
      ST.slides.push({ g, ic });
    });
    // Vignette de fin : le badge White Belt
    {
      const ox = SCR.x + 7 * SCR.w, bxc = ox + 58;
      const g = el('g', {}, ST.strip);
      ST.ghost = el('path', { d: `M ${hexPts(bxc, SCY, 43)} Z`, fill: C.white, 'fill-opacity': 0.06, stroke: GHOST, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', 'stroke-linejoin': 'round' }, g);
      ST.badge = el('g', {}, g);
      const bi = el('g', {}, ST.badge);
      el('path', { d: `M ${hexPts(bxc, SCY, 46)} Z`, fill: C.white, stroke: C.lightBlue, 'stroke-width': 4, 'stroke-linejoin': 'round' }, bi);
      el('path', { d: `M ${hexPts(bxc, SCY, 37)} Z`, fill: 'none', stroke: '#dadaf0', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, bi);
      el('path', { d: starPath(bxc, SCY - 21, 7.5, 3.3), fill: C.yellow }, bi);
      const w1 = text(bi, bxc, SCY + 4, 'WHITE', { size: 15, weight: 800, fill: C.blue, anchor: 'middle' });
      const w2 = text(bi, bxc, SCY + 21, 'BELT', { size: 15, weight: 800, fill: C.blue, anchor: 'middle' });
      [w1, w2].forEach((n, k) => { n.setAttribute('letter-spacing', 1.2); fit(n, bxc + 33, `badge ligne ${k + 1}`, bxc - 33); });
      const cpB = el('clipPath', { id: 'badgeClip' }, defs);
      el('path', { d: `M ${hexPts(bxc, SCY, 44)} Z` }, cpB);
      const sh = el('g', { 'clip-path': 'url(#badgeClip)' }, ST.badge);
      ST.shine = el('rect', { x: -14, y: SCY - 60, width: 18, height: 120, fill: C.white, opacity: 0.75, transform: `skewX(-20)` }, sh);
      ST.badgeC = [bxc, SCY];
      // Étincelles : sur l'arc supérieur du badge, à l'écart du titre et du bord de l'écran
      ST.sparks = [-145, -115, -90, -65, -35].map((deg, k) => {
        const a = deg * Math.PI / 180;
        const s = el('path', { d: 'M 0 -6 L 1.8 -1.8 L 6 0 L 1.8 1.8 L 0 6 L -1.8 1.8 L -6 0 L -1.8 -1.8 Z', fill: k % 2 ? C.yellow : C.white }, g);
        return { s, a };
      });
      const t1 = text(g, ox + 124, SCY - 4, 'White Belt Fichly', { size: 22, weight: 800, fill: C.white });
      const t2 = text(g, ox + 124, SCY + 23, 'Les fondamentaux du Lean', { size: 16, weight: 700, fill: HEAD_SOFT });
      fit(t1, ox + SCR.w - 16, 'vignette fin titre');
      fit(t2, ox + SCR.w - 16, 'vignette fin sous-titre');
      ST.endTexts = [t1, t2];
    }
    // Pastilles d'étape (coin haut droit de l'écran)
    const PR = SCR.x + SCR.w - 12, PCY = SCR.y + 22;
    ST.pills = MODS.map((_, i) => pillShape(D.svg, `Module${NB}${i + 1}${NB}/${NB}7`, { bg: C.white, fg: C.blue, icon: 'play' }));
    ST.pills.push(pillShape(D.svg, 'Parcours terminé', { bg: C.pGreen, fg: C.tGreen, icon: 'check' }));
    ST.pills.forEach(p => { p.x = PR - p.w; p.cy = PCY; p.g.setAttribute('transform', `translate(${f2(p.x)} ${PCY})`); });
    D.noOverlap(ST.pills[7].g, ST.endTexts[0], 'pastille fin / titre fin');

    // Commandes : bouton, barre de lecture, temps
    ST.btn = el('g');
    el('circle', { cx: BTN.cx, cy: BTN.cy, r: BTN.r, fill: C.blue }, ST.btn);
    ST.icPause = el('g', {}, ST.btn);
    [-4, 4].forEach(dx => el('rect', { x: BTN.cx + dx - 2, y: BTN.cy - 6.5, width: 4, height: 13, rx: 1.5, fill: C.white }, ST.icPause));
    ST.icReplay = el('g', {}, ST.btn);
    el('path', { d: `M ${BTN.cx + 6.5} ${BTN.cy - 3} A 7.5 7.5 0 1 0 ${BTN.cx + 6} ${BTN.cy + 4.5}`, fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round' }, ST.icReplay);
    el('path', { d: `M ${BTN.cx + 8} ${BTN.cy - 9} L ${BTN.cx + 7} ${BTN.cy - 2.5} L ${BTN.cx + 0.5} ${BTN.cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ST.icReplay);
    ST.ripple = el('circle', { cx: BTN.cx, cy: BTN.cy, r: BTN.r, fill: 'none', stroke: C.blue, 'stroke-width': 3 });
    ST.time = text(D.svg, RX + RW - 16, CTRL_Y + 5.5, `10:00${NB}/${NB}10:00`, { size: 15, weight: 700, fill: C.ink, anchor: 'end' });
    const tw = measure(ST.time).width;
    ST.sx0 = BTN.cx + BTN.r + 14; ST.sx1 = RX + RW - 16 - tw - 16;
    el('rect', { x: ST.sx0, y: CTRL_Y - 3, width: ST.sx1 - ST.sx0, height: 6, rx: 3, fill: TRACK });
    ST.scrub = el('rect', { x: ST.sx0, y: CTRL_Y - 3, width: 0, height: 6, rx: 3, fill: C.blue });
    ST.scrubKnob = el('circle', { cx: ST.sx0, cy: CTRL_Y, r: 7, fill: C.white, stroke: C.blue, 'stroke-width': 3 });

    // ----- Ce que vous saurez faire -----
    el('rect', { x: SKC.x, y: SKC.y, width: SKC.w, height: SKC.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 1.5 });
    ST.skFlash = el('rect', { x: SKC.x, y: SKC.y, width: SKC.w, height: SKC.h, rx: 18, fill: C.green, 'fill-opacity': 0.07, stroke: C.green, 'stroke-width': 3 });
    const hcx = SKC.x + 30, hcy = SKC.y + 30;
    ST.lock = el('g');
    el('circle', { cx: hcx, cy: hcy, r: 16, fill: C.pLav }, ST.lock);
    ST.shackle = el('path', { d: `M ${hcx - 5} ${hcy - 1} V ${hcy - 5} A 5 5 0 0 1 ${hcx + 5} ${hcy - 5} V ${hcy - 1}`, fill: 'none', stroke: MUTED, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, ST.lock);
    el('rect', { x: hcx - 8, y: hcy - 2, width: 16, height: 12, rx: 3, fill: MUTED }, ST.lock);
    ST.unlocked = el('g');
    el('circle', { cx: hcx, cy: hcy, r: 16, fill: C.green }, ST.unlocked);
    el('path', { d: starPath(hcx, hcy, 8.5, 3.8), fill: C.white }, ST.unlocked);
    text(D.svg, SKC.x + 56, SKC.y + 36, 'Ce que vous saurez faire', { size: 18, weight: 800, fill: C.ink });
    ST.skChip = el('g');
    ST.skChipR = el('rect', { x: 0, y: hcy - 13, width: 62, height: 26, rx: 13, fill: C.pGreen }, ST.skChip);
    ST.skChipT = text(ST.skChip, SKC.x + SKC.w - 16 - 31, hcy + 5.5, `4${NB}/${NB}4`, { size: 15, weight: 800, fill: C.tGreen, anchor: 'middle' });
    ST.skChipR.setAttribute('x', SKC.x + SKC.w - 16 - 62);
    // Compétences : lignes mesurées, réparties sur la hauteur libre
    const groups = SKILLS.map(s => {
      const g = el('g');
      const lines = wrap(g, SKC.x + 54, 0, s, SKC.w - 54 - 16, 20, { size: 16, weight: 500, fill: C.ink });
      return { g, lines };
    });
    const top = SKC.y + 62, bottom = SKC.y + SKC.h - 16;
    const hs = groups.map(gr => 20 * (gr.lines.length - 1) + 16);
    const gap = (bottom - top - hs.reduce((a, b) => a + b, 0)) / (SKILLS.length);
    let y = top + gap / 2;
    groups.forEach((gr, k) => {
      gr.lines.forEach((n, j) => { n.setAttribute('y', f2(y + 13 + j * 20)); fit(n, SKC.x + SKC.w - 14, `compétence ${k + 1} ligne ${j + 1}`); });
      const by = y + 13 - 5.5 - 0.5;                   // centre de la case, aligné sur la première ligne
      const box = el('g');
      const br = el('rect', { x: SKC.x + 18, y: f2(by - 11), width: 22, height: 22, rx: 6, fill: C.white, stroke: TODO_RING, 'stroke-width': 2.5 }, box);
      const bf = el('rect', { x: SKC.x + 18, y: f2(by - 11), width: 22, height: 22, rx: 6, fill: C.green }, box);
      const ck = el('path', { d: checkPath(SKC.x + 29, by, 0.85), fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': 30, 'stroke-dashoffset': 0 }, box);
      ST.skills.push({ lines: gr.lines, br, bf, ck, cx: SKC.x + 29, cy: by });
      y += hs[k] + gap;
    });

    // ----- Pour qui -----
    el('rect', { x: PUB.x, y: PUB.y, width: PUB.w, height: PUB.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 1.5 });
    const pcx = PUB.x + 30, pcy = PUB.y + 30;
    el('circle', { cx: pcx, cy: pcy, r: 16, fill: C.blue });
    [[-5, 0.9], [5, 1]].forEach(([dx, k]) => {
      el('circle', { cx: pcx + dx, cy: pcy - 4 * k, r: 3.6 * k, fill: C.white });
      el('path', { d: `M ${f2(pcx + dx - 6 * k)} ${f2(pcy + 8)} C ${f2(pcx + dx - 6 * k)} ${f2(pcy + 1)}, ${f2(pcx + dx + 6 * k)} ${f2(pcy + 1)}, ${f2(pcx + dx + 6 * k)} ${f2(pcy + 8)} Z`, fill: C.white });
    });
    text(D.svg, PUB.x + 56, PUB.y + 36, `Pour qui${NB}?`, { size: 18, weight: 800, fill: C.ink });
    const ph = wrap(D.svg, PUB.x + 18, PUB.y + 64, 'Ceux qui découvrent le Lean, et ceux qui doivent le faire comprendre autour d’eux.', PUB.w - 36, 20, { size: 15.5, weight: 500, fill: DESC });
    ph.forEach((n, k) => fit(n, PUB.x + PUB.w - 16, `pour qui ligne ${k + 1}`));
    const ry0 = PUB.y + 64 + (ph.length - 1) * 20 + 30;
    ROLES.forEach(([r, c], k) => {
      const x = PUB.x + 18 + (k % 2) * 214, yy = ry0 + Math.floor(k / 2) * 28;
      el('circle', { cx: x + 10, cy: yy, r: 10, fill: c });
      el('circle', { cx: x + 10, cy: yy - 2.5, r: 3.2, fill: C.white });
      el('path', { d: `M ${x + 4.5} ${yy + 6.5} C ${x + 4.5} ${yy + 1}, ${x + 15.5} ${yy + 1}, ${x + 15.5} ${yy + 6.5} Z`, fill: C.white });
      fit(text(D.svg, x + 28, yy + 5.5, r, { size: 16, weight: 700, fill: C.ink }), x + 210, `rôle ${k + 1}`);
    });
    if (ry0 + 28 + 12 > PUB.y + PUB.h) console.error(`Débordement : carte « Pour qui » (${Math.round(ry0 + 40)} > ${PUB.y + PUB.h})`);

    // Curseur de souris (clic sur « revoir »)
    ST.cursor = el('g', { filter: 'url(#cshadow)' });
    el('path', { d: 'M 0 0 L 0 23 L 6 17.5 L 10.5 27 L 14.5 25 L 10 16 L 17.5 16 Z', fill: C.white, stroke: C.ink, 'stroke-width': 2, 'stroke-linejoin': 'round' }, ST.cursor);

    D.encart(['La White Belt Fichly', 'Gratuite, en une heure', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_REW;                       // état final (jusqu'au clic sur « revoir »)
    const M = courseMin(t, final);

    // Progression du parcours
    const fx = trkX(M);
    ST.fill.setAttribute('width', f2(Math.max(0, fx - TRK.x0)));
    ST.knob.setAttribute('cx', f2(clamp(fx, TRK.x0 + 2, TRK.x1 - 2)));
    ST.counter.textContent = `${Math.floor(M + 1e-6)}${NB}min`;
    ST.counterLbl.setAttribute('x', f2(measure(ST.counter).x - 10));
    ST.flash.forEach((n, i) => op(n, final ? 0 : 0.6 * bump(t, E[i], 0.4)));

    // Modules
    ST.rows.forEach((r, i) => {
      let doneK, doneOn;
      if (final) { doneOn = true; doneK = 1; }
      else if (t < T_REW + REW + 0.05) { doneOn = t < U[i] + 0.12; doneK = 1 - easeIn(prog(t, U[i], 0.12)); }
      else { doneOn = t >= E[i]; doneK = popScale(prog(t, E[i], 0.32)); }
      const playing = !final && t >= S[i] - GAP + 0.05 && t < E[i] && t >= T_REW + REW;
      op(r.done, doneOn && doneK > 0.002 ? 1 : 0);
      r.done.setAttribute('transform', doneK >= 1 ? '' : about(r.cx, r.cy, doneK));
      show(r.todo, !(doneOn && doneK >= 0.6));
      const pb = final ? 1 : prog(t, E[i] + 0.06, 0.42);
      op(r.burst, pb > 0 && pb < 1 ? 0.7 * (1 - pb) : 0);
      r.burst.setAttribute('r', f2(16 + 14 * easeOut(pb)));
      const pr = playing ? prog(t, S[i], E[i] - S[i]) : 0;
      show(r.ring, playing && pr > 0);
      r.ring.setAttribute('stroke-dashoffset', f2(r.L * (1 - pr)));
      r.num.setAttribute('fill', playing ? C.blue : MUTED);
      r.title.setAttribute('fill', playing ? C.blue : C.ink);
      const st = doneOn ? 'done' : playing ? 'cur' : 'todo';
      r.cr.setAttribute('fill', st === 'done' ? C.pGreen : st === 'cur' ? C.white : CHIP_BG);
      r.ct.setAttribute('fill', st === 'done' ? C.tGreen : st === 'cur' ? C.blue : MUTED);
    });

    // Surlignage du module en cours : glisse d'une ligne à l'autre
    let hy = ROW_Y(0), ho = 0;
    if (!final) {
      ho = prog(t, T_REW + 0.36, 0.2) * (1 - prog(t, T_END + 0.05, 0.2));
      for (let i = 0; i < 6; i++) hy = lerp(hy, ROW_Y(i + 1), easeInOut(prog(t, E[i] + 0.04, 0.24)));
    }
    ST.hl.setAttribute('transform', `translate(0 ${f2(hy)})`);
    op(ST.hl, ho);

    // Vignettes : défilement
    let pos = 7;
    if (!final) {
      pos = 7;
      SLIDES.forEach(([t0, from, to], k) => { const p = easeInOut(prog(t, t0, SLIDE_DUR[k])); if (t >= t0) pos = lerp(from, to, p); });
    }
    ST.strip.setAttribute('transform', `translate(${f2(-pos * SCR.w)} 0)`);
    ST.slides.forEach((s, i) => {
      show(s.g, Math.abs(pos - i) < 1.02);
      // Le pictogramme du module qui démarre s'anime
      const k = !final && i === Math.round(pos) ? 1 + 0.08 * bump(t, S[i] - 0.05, 0.4) : 1;
      s.ic.setAttribute('transform', `translate(${f2(SCR.x + i * SCR.w + 58)} ${SCY})` + (k !== 1 ? ` scale(${k3(k)})` : ''));
    });

    // Badge White Belt : en place sur l'image finale ; ensuite fantôme en pointillés, jusqu'à son arrivée
    const bOn = final || t < T_REW + 0.65 || t >= T_BADGE;
    const pb = final || t < T_REW + 0.65 ? 1 : prog(t, T_BADGE, 0.45);
    const [bxc, byc] = ST.badgeC;
    op(ST.badge, bOn ? clamp(pb / 0.3) : 0);
    ST.badge.setAttribute('transform', pb >= 1 ? '' : about(bxc, byc, popScale(pb)));
    if (!final && pb > 0 && pb < 1) ST.badge.setAttribute('filter', 'url(#lift)'); else ST.badge.removeAttribute('filter');
    op(ST.ghost, bOn ? 1 - clamp(pb / 0.3) : 1);
    ST.ghost.setAttribute('stroke-dashoffset', f2(-t * 18));
    const ps = final ? 1 : prog(t, T_BADGE + 0.45, 0.5);
    op(ST.shine, ps > 0 && ps < 1 ? 0.75 : 0);
    ST.shine.setAttribute('x', f2(bxc - 70 + 150 * easeInOut(ps)));
    ST.sparks.forEach(({ s, a }, k) => {
      const p = final ? 1 : prog(t, T_BADGE + 0.22 + 0.03 * k, 0.55);
      const r = 50 + 12 * easeOut(p);
      op(s, p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0);
      s.setAttribute('transform', `translate(${f2(bxc + r * Math.cos(a))} ${f2(byc + r * Math.sin(a))}) scale(${k3(0.6 + 0.6 * Math.sin(Math.PI * p))})`);
    });

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    ST.pills.forEach((p, i) => {
      let o;
      if (i === 7) o = final ? 1 : prog(t, PILL_IN[7], 0.16) + (1 - prog(t, T_REW, 0.1)) * (t < T_REW + 0.1 ? 1 : 0);
      else o = final ? 0 : prog(t, PILL_IN[i], 0.16) * (1 - prog(t, PILL_OUT[i], 0.1));
      o = clamp(o);
      op(p.g, o);
      const dy = final || o >= 1 ? 0 : 5 * (1 - o);
      p.g.setAttribute('transform', `translate(${f2(p.x)} ${f2(p.cy + dy)})`);
    });

    // Commandes du lecteur
    const playingAny = !final && t >= T_REW && t < T_END + 0.1;
    show(ST.icPause, playingAny);
    show(ST.icReplay, !playingAny);
    const press = bump(t, T_CLICK, 0.16);
    const swapK = !final ? 1 + 0.12 * bump(t, T_END + 0.1, 0.25) : 1;
    ST.btn.setAttribute('transform', press || swapK !== 1 ? about(BTN.cx, BTN.cy, (1 - 0.12 * press) * swapK) : '');
    const pr = prog(t, T_CLICK + 0.06, 0.45);
    op(ST.ripple, pr > 0 && pr < 1 ? 0.55 * (1 - pr) : 0);
    ST.ripple.setAttribute('r', f2(BTN.r + 20 * easeOut(pr)));
    let sp = 1, tl = 'Terminé', tc = C.tGreen;
    if (!final && t < T_END + 0.12) {
      tc = C.ink;
      if (t < T_REW + REW) { sp = 1 - easeInOut(prog(t, T_REW, REW * 0.7)); tl = `${mmss(MODS[0].min * 60 * sp)}${NB}/${NB}${MODS[0].min}:00`; }
      else {
        let i = 0;
        while (i < 6 && t >= E[i] + 0.15) i++;
        sp = t >= E[i] ? 1 : prog(t, S[i], E[i] - S[i]);
        tl = `${mmss(MODS[i].min * 60 * sp)}${NB}/${NB}${MODS[i].min}:00`;
      }
    }
    ST.time.textContent = tl;
    ST.time.setAttribute('fill', tc);
    const done = final || t >= T_END + 0.12;
    const sw = (ST.sx1 - ST.sx0) * sp;
    ST.scrub.setAttribute('width', f2(sw));
    ST.scrub.setAttribute('fill', done ? C.green : C.blue);
    ST.scrubKnob.setAttribute('cx', f2(ST.sx0 + sw));
    ST.scrubKnob.setAttribute('stroke', done ? C.green : C.blue);

    // Compétences : verrouillées pendant le parcours, puis cochées une à une
    const locked = !final && t >= T_REW + 0.12 && t < T_UNLOCK + 0.22;
    show(ST.lock, locked);
    const ku = !final && t >= T_UNLOCK + 0.22 ? popScale(prog(t, T_UNLOCK + 0.22, 0.3)) : 1;
    show(ST.unlocked, !locked);
    ST.unlocked.setAttribute('transform', ku >= 1 ? '' : about(SKC.x + 30, SKC.y + 30, ku));
    const po = prog(t, T_UNLOCK, 0.2);
    ST.shackle.setAttribute('transform', po > 0 ? `translate(0 ${f2(-4 * easeOut(po))}) rotate(${f2(-25 * easeOut(po))} ${SKC.x + 35} ${SKC.y + 29})` : '');
    op(ST.skFlash, final ? 0 : bump(t, T_UNLOCK + 0.1, 0.6));
    let count = 0;
    ST.skills.forEach((s, k) => {
      let c;                                           // 0 : à venir, 1 : cochée
      if (final) c = 1;
      else if (t < T_REW + 0.3) c = 1 - prog(t, T_REW, 0.25);
      else c = prog(t, T_SK[k], 0.3);
      if (c >= 0.5) count++;
      const col = mix(LOCKED_TXT, C.ink, c);
      s.lines.forEach(n => n.setAttribute('fill', col));
      const kb = !final && t >= T_SK[k] ? popScale(prog(t, T_SK[k], 0.28)) : 1;
      op(s.bf, c > 0 ? clamp(c * 2.5) : 0);
      s.bf.setAttribute('transform', kb >= 1 ? '' : about(s.cx, s.cy, kb));
      const dc = final || t < T_REW + 0.3 ? 1 : t >= T_SK[k] ? prog(t, T_SK[k] + 0.08, 0.22) : 0;
      op(s.ck, c > 0 ? clamp(c * 2.5) : 0);
      s.ck.setAttribute('stroke-dashoffset', f2(30 * (1 - dc)));
      if (dc >= 1) s.ck.removeAttribute('stroke-dasharray'); else s.ck.setAttribute('stroke-dasharray', 30);
    });
    ST.skChipT.textContent = `${count}${NB}/${NB}4`;
    ST.skChipR.setAttribute('fill', count === 4 ? C.pGreen : CHIP_BG);
    ST.skChipT.setAttribute('fill', count === 4 ? C.tGreen : MUTED);
    const kc = !final ? 1 + 0.15 * T_SK.reduce((a, ts) => a + bump(t, ts + 0.05, 0.25), 0) : 1;
    ST.skChip.setAttribute('transform', kc !== 1 ? about(SKC.x + SKC.w - 47, SKC.y + 30, kc) : '');

    // Curseur : arrive, clique sur « revoir », repart
    let co = 0, cx = 940, cy = 820, ck = 1;
    if (t >= T_CUR && t < T_REW + 0.6) {
      const tx = BTN.cx + 3, ty = BTN.cy + 3;
      if (t < T_CLICK) {
        const p = easeInOut(prog(t, T_CUR, T_CLICK - T_CUR - 0.04));
        cx = lerp(940, tx, p) + 40 * Math.sin(Math.PI * p);
        cy = lerp(820, ty, p) - 30 * Math.sin(Math.PI * p);
        co = clamp((t - T_CUR) / 0.12);
      } else {
        const p = easeInOut(prog(t, T_REW + 0.08, 0.5));
        cx = lerp(tx, tx + 120, p); cy = lerp(ty, ty + 70, p);
        co = 1 - prog(t, T_REW + 0.3, 0.28);
      }
      ck = 1 - 0.12 * press;
    }
    op(ST.cursor, co);
    ST.cursor.setAttribute('transform', `translate(${f2(cx)} ${f2(cy)})` + (ck !== 1 ? ` scale(${k3(ck)})` : ''));
  }

  D.start({ duration: DURATION, build, draw });
})();
