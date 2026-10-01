// Fiche LinkedIn · Clément Raymond · mercredi 21 octobre 2026
// Post : « Un écart visible sur un tableau n'est utile que si quelqu'un sait qu'il doit décider. »
// Premier commentaire du post (Buffer) : notre template RACI pour clarifier qui décide quoi → encart.
// Le visuel est la pièce maîtresse : l'atelier en coupe, quatre étages de décision (opérateur, chef
// d'équipe, fonctions support, manager) desservis par un ascenseur d'escalade. Sans règles, les deux
// dérives du post, l'une après l'autre : tout monte et s'entasse devant le bureau du manager (goulot),
// puis rien ne monte et l'écart reste ouvert (compteur de jours). Avec règles : l'opérateur décide seul
// dans ses limites, l'ascenseur ne monte qu'au seuil (30 min de panne), l'étage qui reçoit répond sous
// un délai affiché (minuteur). En bas, la matrice du post (décisions × niveaux) se remplit : D, C, I.
// Style propre : l'ascenseur d'escalade. Image t = 0 = état final. Boucle exacte de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeIn = p => p * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', DASH = '#b6b6d4', GHOST = '#a3a3c2';
  const STRUCT = '#3a3a72', SHAFT = '#e9e9f3', SOIL = '#e4e4ef', DOOR = '#d5d5e8', ROW_LINE = '#ededf5';

  // Visibilité : invisible = display none (boucle exacte), sinon opacité
  function vis(n, o) {
    if (o <= 0.001) { n.setAttribute('display', 'none'); return false; }
    n.removeAttribute('display');
    if (o >= 0.999) n.removeAttribute('opacity'); else n.setAttribute('opacity', f2(o));
    return true;
  }
  const scaleAt = (x, y, k) => (k >= 0.9995 && k <= 1.0005 ? '' : `translate(${f2(x)} ${f2(y)}) scale(${Math.max(k, 0.001).toFixed(3)}) translate(${f2(-x)} ${f2(-y)})`);
  const setT = (n, tr) => { if (tr) n.setAttribute('transform', tr); else n.removeAttribute('transform'); };

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const BX0 = 84, BX1 = 996, WALL = 6;               // murs extérieurs du bâtiment
  const GROUND = 868, FH = 96, SLAB = 6;              // sol, hauteur d'étage, épaisseur de dalle
  const slabY = k => GROUND - FH * k;                 // axe de la dalle k (0 = sol, 4 = toit)
  const fTop = f => slabY(f + 1) + SLAB / 2;          // plafond de l'étage f
  const fBot = f => slabY(f) - SLAB / 2;              // plancher de l'étage f (f peut être fractionnaire)
  const SH0 = 906;                                    // mur gauche de la gaine d'ascenseur
  const CAB = { x: 917, w: 68, h: 74 }, CAB_CX = 951;
  const cabTopAt = f => fBot(f) - CAB.h;
  const PANEL = { x: 708, w: 174, h: 50 };            // écran d'étage, à côté de l'ascenseur
  const LABEL_X = 140;
  const TW = 36, TH = 28;                             // ticket « écart »
  const tkY = f => fBot(f) - TH / 2;                  // ticket posé au sol de l'étage f
  const SPAWN = { x: 622, y: 803 };                   // l'écart naît au-dessus de la machine
  const SLOTS = [[-16, 60], [16, 60], [-16, 39], [16, 39], [0, 18]]; // places dans la cabine
  const QX = [498, 544, 590, 636, 682];               // file d'attente devant le bureau du manager
  const E_DEST = 682;                                 // ticket escaladé, devant la maintenance
  const DOORS_F2 = [['Achats', 384, C.yellow, 'cart'], ['Qualité', 504, C.teal, 'loupe'], ['Maintenance', 624, C.lightBlue, 'cle']];
  const OPX = 552, CHEFX = 600, MGRX = 404;
  const CHECK_Y = [801, 825, 849], CHECK_X = 306;

  // Matrice du post : décisions en lignes, niveaux en colonnes
  const MAT = { x0: 84, y0: 888, w: 912, h: 242 };
  const COLX = [421, 582, 743, 904];
  const HEAD_Y = 914, ROW0 = 940, RH = 32;
  const COLS = ['Opérateur', 'Chef d’équipe', 'Support', 'Manager'];
  const ROWS = [
    { label: 'Relancer', cells: ['D', 'I', '', ''] },
    { label: 'Isoler une pièce', cells: ['D', 'I', 'I', ''] },
    { label: 'Arrêter une machine', cells: ['D', 'I', 'I', ''] },
    { label: `Panne de plus de 30${NB}min`, cells: ['I', 'C', 'D', 'I'] },
    { label: 'Arbitrer les priorités', cells: ['', 'C', 'C', 'D'] },
  ];
  const ACTIONS = ['Relancer', 'Isoler une pièce', 'Arrêter une machine'];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.0;                                   // l'état final se défait, l'histoire recommence
  // Ascenseur : déplacements [début, fin, étage de départ, étage d'arrivée] ; portes [début, durée, ouverture]
  const MOVES = [[1.12, 1.5, 2, 0], [2.38, 2.84, 0, 3], [4.12, 4.55, 3, 0], [8.6, 8.94, 0, 2]];
  const DOORS = [[1.0, 0.12, 0], [1.5, 0.12, 1], [2.26, 0.12, 0], [2.84, 0.12, 1], [4.0, 0.12, 0], [8.1, 0.12, 1], [8.48, 0.12, 0], [8.94, 0.12, 1]];
  const CALL = [[1.46, 2.38], [8.1, 8.6]];             // bouton d'appel allumé au rez-de-chaussée
  // Dérive 1 : tout monte
  const D1S = i => 1.46 + 0.08 * i, D1_POP = 0.14, D1_FLY = 0.32;
  const D1U = i => 2.96 + 0.09 * i, D1_SLIDE = 0.28, D1_OUT = i => 4.05 + 0.03 * i;
  const T_GOULOT = 3.3;
  // Dérive 2 : rien ne monte
  const W_T = 4.2, W_OUT = 5.78, T_DAYS = 4.55, DAYS_DUR = 1.05, T_ASK = 4.4;
  // Règle 1 : l'opérateur décide seul
  const T_LIMIT = 5.95, ACT = [6.2, 6.62, 7.04];
  // Règle 2 : seuil, puis ascenseur
  const E_T = 7.5, T_MIN = 7.62, MIN_DUR = 0.46, T_SEUIL = 8.1;
  const E_ARC = [8.12, 0.14], E_SLIDE = [8.26, 0.22], E_UNLOAD = [9.06, 0.28];
  // Règle 3 : l'étage qui reçoit répond sous un délai
  const T_TIMER = 9.3, T_CD = 9.36, CD_DUR = 0.44, T_TAKEN = 9.82;
  // La matrice se remplit (lignes 1 à 3 : un jeton file de la coche jusqu'à sa case)
  const FILL = [ACT[0] + 0.6, ACT[1] + 0.6, ACT[2] + 0.6, 10.15, 10.6];
  const FLY = 0.4;
  const T_F3_FINAL = 10.55;
  // Pastilles d'étape
  const P = [1.08, 4.05, 5.85, 7.42, 8.9, 10.2];

  // ---------- Petits éléments ----------
  const S = { tickets: [] };
  let clipN = 0;

  function pillShape(parent, x, cy, label, { bg, fg, icon = null, size = 20, h = 40 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon === 'check') {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.green }, g);
      el('path', { d: `M ${x + 25.5} ${cy + 0.5} L ${x + 29.5} ${cy + 4.5} L ${x + 36.5} ${cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    } else if (icon === 'x') {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.red }, g);
      el('path', { d: `M ${x + 26.5} ${cy - 4.5} L ${x + 35.5} ${cy + 4.5} M ${x + 35.5} ${cy - 4.5} L ${x + 26.5} ${cy + 4.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    }
    return g;
  }
  function chip(parent, x, cy, label, { bg, fg, size = 15, h = 24, dot = null }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const dw = dot ? 14 : 0;
    let d = null;
    if (dot) d = el('circle', { cx: x + 13, cy, r: 4.5, fill: dot }, g);
    const tx = text(g, x + 10 + dw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 20 + dw);
    return { g, d, tx, r };
  }
  // Silhouette debout : renvoie le groupe et le bras (qui pivote à l'épaule)
  function person(parent, x, foot, color) {
    const g = el('g', {}, parent);
    el('rect', { x: x - 8, y: foot - 19, width: 6.5, height: 19, rx: 3, fill: C.ink }, g);
    el('rect', { x: x + 1.5, y: foot - 19, width: 6.5, height: 19, rx: 3, fill: C.ink }, g);
    el('rect', { x: x - 11.5, y: foot - 42, width: 23, height: 28, rx: 9, fill: color }, g);
    const arm = el('g', { transform: `translate(${x + 8} ${foot - 37})` }, g);
    el('line', { x1: 0, y1: 0, x2: 0, y2: 19, stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, arm);
    el('circle', { cx: x, cy: foot - 51, r: 8.5, fill: C.ink }, g);
    return { g, arm, ax: x + 8, ay: foot - 37 };
  }
  function ticket(parent) {
    const g = el('g', {}, parent);
    el('rect', { x: -TW / 2, y: -TH / 2, width: TW, height: TH, rx: 7, fill: C.red, stroke: C.white, 'stroke-width': 2 }, g);
    text(g, 0, 7, '!', { size: 19, weight: 800, fill: C.white, anchor: 'middle' });
    const dust = el('rect', { x: -TW / 2 + 1, y: -TH / 2 + 1, width: TW - 2, height: TH - 2, rx: 6, fill: '#9a9ab8', display: 'none' }, g);
    const green = el('g', { display: 'none' }, g);
    el('rect', { x: -TW / 2, y: -TH / 2, width: TW, height: TH, rx: 7, fill: C.green, stroke: C.white, 'stroke-width': 2 }, green);
    el('path', { d: 'M -7 0.5 L -2 5.5 L 7.5 -5', fill: 'none', stroke: C.white, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, green);
    const tk = { g, dust, green };
    S.tickets.push(tk);
    return tk;
  }
  // Compteur qui roule : la valeur v (continue) affiche n et fait rouler vers n ± 1
  function roller(parent, x, y, opts, fmt, box, widest) {
    const id = `roll${clipN++}`;
    const cp = el('clipPath', { id }, S.defs);
    el('rect', { x: box.x, y: box.y, width: box.w, height: box.h }, cp);
    const g = el('g', { 'clip-path': `url(#${id})` }, parent);
    const a = text(g, x, y, widest, opts), b = text(g, x, y, widest, opts);
    const H = box.h;
    return {
      a, b,
      set(v, dir = 1, w = 1, fill = null) {
        let n, fr;
        if (dir > 0) { n = Math.floor(v + 1e-6); fr = v - n; } else { n = Math.ceil(v - 1e-6); fr = n - v; }
        const q = easeInOut(clamp((fr - (1 - w)) / w));
        a.textContent = fmt(n);
        a.setAttribute('y', f2(y - dir * q * H));
        if (q > 0.001) { b.removeAttribute('display'); b.textContent = fmt(n + dir); b.setAttribute('y', f2(y + dir * (1 - q) * H)); }
        else b.setAttribute('display', 'none');
        if (fill) { a.setAttribute('fill', fill); b.setAttribute('fill', fill); }
        return q;
      },
    };
  }
  // Anneau de minuteur (tracé qui se remplit ou se vide)
  function ring(parent, cx, cy, r, color) {
    el('circle', { cx, cy, r, fill: 'none', stroke: ROW_LINE, 'stroke-width': 4.5 }, parent);
    const arc = el('circle', { cx, cy, r, fill: 'none', stroke: color, 'stroke-width': 4.5, 'stroke-linecap': 'round', transform: `rotate(-90 ${cx} ${cy})` }, parent);
    const L = 2 * Math.PI * r;
    return {
      arc,
      set(frac, col) {
        if (col) arc.setAttribute('stroke', col);
        if (frac >= 0.999) { arc.removeAttribute('stroke-dasharray'); arc.removeAttribute('stroke-dashoffset'); vis(arc, 1); return; }
        if (!vis(arc, frac > 0.004 ? 1 : 0)) return;
        arc.setAttribute('stroke-dasharray', f2(L));
        arc.setAttribute('stroke-dashoffset', f2(L * (1 - frac)));
      },
    };
  }
  // Fenêtre de vie d'un élément : spans [[entrée, sortie]] ; -Infinity = déjà là à t = 0, Infinity = reste
  function life(t, spans, fin = 0.26, fout = 0.16) {
    for (const [a, b] of spans) {
      if (t < a) continue;
      const pin = a === -Infinity ? 1 : prog(t, a, fin);
      const pout = b === Infinity ? 0 : prog(t, b, fout);
      if (pout >= 1 || pin <= 0) continue;
      return { o: clamp(pin / 0.4) * (1 - pout), k: popScale(pin) * (1 - 0.3 * easeIn(pout)) };
    }
    return { o: 0, k: 0.001 };
  }
  const FINAL = [-Infinity, T_OUT];
  function lifeApply(n, st, cx, cy) {
    if (!vis(n, st.o)) return false;
    setT(n, scaleAt(cx, cy, st.k));
    return true;
  }

  // ---------- Pictos des portes de l'étage support ----------
  const ICONS = {
    cart(g, c) {
      el('path', { d: 'M -7 -5 L -5 -5 L -3 3 L 5 3 L 6.5 -2.5 L -4 -2.5', fill: 'none', stroke: c, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      [-2, 4].forEach(x => el('circle', { cx: x, cy: 6, r: 1.6, fill: c }, g));
    },
    loupe(g, c) {
      el('circle', { cx: -1.5, cy: -1.5, r: 4.8, fill: 'none', stroke: c, 'stroke-width': 2.4 }, g);
      el('line', { x1: 2, y1: 2, x2: 6.5, y2: 6.5, stroke: c, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
    },
    cle(g, c) {
      const r = el('g', { transform: 'rotate(45)' }, g);
      el('rect', { x: -1.8, y: -2, width: 3.6, height: 10, rx: 1.8, fill: c }, r);
      el('circle', { cx: 0, cy: -4, r: 4.6, fill: c }, r);
      el('rect', { x: -1.6, y: -9.5, width: 3.2, height: 5, fill: C.white }, r);
    },
  };

  function build() {
    D.template({ author: 'clement' });
    D.title('Sans règle claire,', 'l’écart attend.');
    D.chapeau('Un écart visible n’est utile que si quelqu’un sait qu’il doit décider.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['L’atelier en coupe : chaque étage est un ', 0], ['niveau de décision', C.blue], ['. L’écart naît ', 0], ['au poste', C.blue], ['.', 0]]);
    line(384, [['Sans règles', C.tRed], [', tout monte ou rien ne monte. ', 0], ['Avec', C.tGreen], [', chacun sait ', 0], ['qui décide', C.blue], ['.', 0]]);

    S.defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-60%', y: '-60%', width: '220%', height: '240%' }, S.defs);
    el('feDropShadow', { dx: 0, dy: 6, stdDeviation: 4, 'flood-color': C.ink, 'flood-opacity': 0.25 }, lift);

    // ----- Cadre -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- Le bâtiment en coupe -----
    for (let f = 0; f < 4; f++) el('rect', { x: BX0, y: slabY(f + 1), width: SH0 - BX0, height: FH, fill: C.white });
    el('rect', { x: SH0, y: slabY(4), width: BX1 - SH0, height: GROUND - slabY(4), fill: SHAFT });
    [914.5, 987.5].forEach(x => el('line', { x1: x, y1: slabY(4), x2: x, y2: GROUND, stroke: '#cfcfe2', 'stroke-width': 2 }));
    // Sol (hachures dessinées) et dalles
    el('rect', { x: 72, y: GROUND + 3, width: 936, height: 11, fill: SOIL });
    for (let x = 80; x < 1000; x += 16) el('line', { x1: x, y1: GROUND + 12, x2: x + 7, y2: GROUND + 5, stroke: '#cdcde0', 'stroke-width': 1.6, 'stroke-linecap': 'round' });
    for (let k = 0; k <= 4; k++) {
      const full = k === 0 || k === 4;
      el('rect', { x: BX0, y: slabY(k) - SLAB / 2, width: (full ? BX1 : SH0) - BX0, height: SLAB, fill: STRUCT });
    }
    el('rect', { x: BX0, y: slabY(4) - 3, width: WALL, height: GROUND - slabY(4) + 6, fill: STRUCT });
    el('rect', { x: BX1 - WALL, y: slabY(4) - 3, width: WALL, height: GROUND - slabY(4) + 6, fill: STRUCT });
    el('rect', { x: SH0, y: slabY(4) - 3, width: WALL, height: GROUND - slabY(4) + 6, fill: STRUCT });
    el('rect', { x: BX0, y: slabY(4) - 13, width: WALL, height: 12, fill: STRUCT });
    // Local technique de l'ascenseur, sur le toit, avec l'afficheur d'étage
    el('rect', { x: 912, y: 444, width: 78, height: 38, rx: 6, fill: STRUCT });
    el('rect', { x: 921, y: 451, width: 60, height: 24, rx: 5, fill: C.ink });
    S.arrowUp = el('path', { d: 'M 931 467 L 937 458 L 943 467 Z', fill: C.yellow });
    S.arrowDn = el('path', { d: 'M 931 459 L 937 468 L 943 459 Z', fill: C.yellow });
    S.floorDigit = roller(D.svg, 963, 470, { size: 19, weight: 800, fill: C.yellow, anchor: 'middle' }, n => String(n), { x: 950, y: 451, w: 26, h: 24 }, '3');

    // Étiquettes d'étage : numéro + nom
    const NAMES = ['Opérateur', 'Chef d’équipe', 'Fonctions support', 'Manager'];
    NAMES.forEach((name, f) => {
      const cy = fTop(f) + 22;
      el('circle', { cx: 118, cy, r: 13, fill: C.blue });
      text(D.svg, 118, cy + 5.5, String(f), { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
      fit(text(D.svg, LABEL_X, cy + 6, name, { size: 17, weight: 800, fill: C.ink }), 330, `étage ${f}`);
    });
    // Boutons d'appel à chaque palier
    S.calls = [0, 1, 2, 3].map(f => {
      const y = fTop(f) + 28;
      const box = el('rect', { x: 889, y, width: 13, height: 21, rx: 4, fill: C.white, stroke: CARD_LINE, 'stroke-width': 1.5 });
      const tri = el('path', { d: `M 891.5 ${y + 14} L 895.5 ${y + 7} L 899.5 ${y + 14} Z`, fill: DASH });
      return { box, tri };
    });

    // ----- Étage 3 : le manager -----
    el('rect', { x: 292, y: 541, width: 86, height: 6, rx: 2, fill: STRUCT });
    [298, 370].forEach(x => el('rect', { x, y: 547, width: 4, height: 30, fill: STRUCT }));
    el('rect', { x: 316, y: 514, width: 38, height: 23, rx: 3, fill: C.lightBlue });
    el('rect', { x: 333, y: 537, width: 4, height: 4, fill: STRUCT });
    [520, 527].forEach(y => el('line', { x1: 322, y1: y, x2: 346, y2: y, stroke: C.white, 'stroke-width': 2.5, 'stroke-linecap': 'round' }));
    S.mgrPulse = el('circle', { cx: MGRX, cy: 548, r: 30, fill: 'none', stroke: C.red, 'stroke-width': 3, display: 'none' });
    S.mgr = person(D.svg, MGRX, fBot(3), C.lightBlue);
    el('rect', { x: 452, y: fTop(3), width: 6, height: 507 - fTop(3), fill: STRUCT });
    el('rect', { x: 437, y: 507, width: 36, height: fBot(3) - 507, rx: 2, fill: DOOR, stroke: STRUCT, 'stroke-width': 2 });
    el('circle', { cx: 466, cy: 545, r: 2.5, fill: STRUCT });
    S.goulot = chip(D.svg, 136, fTop(3) + 50, 'goulot', { bg: C.pRed, fg: C.tRed, dot: C.red });
    fit(S.goulot.g, 330, 'statut goulot');

    // ----- Étage 2 : fonctions support -----
    DOORS_F2.forEach(([name, cx, color, icon]) => {
      const n = text(D.svg, cx, fTop(2) + 21, name, { size: 16, weight: 700, fill: C.ink, anchor: 'middle' });
      fit(n, 700, `porte ${name}`, 340);
      if (icon === 'cle') {
        S.doorway = el('rect', { x: cx - 20, y: fBot(2) - 60, width: 40, height: 60, fill: '#e3e3f1' });
        S.tech = person(D.svg, cx, fBot(2), C.yellow);
        S.leaf = el('g');
      }
      const g = icon === 'cle' ? S.leaf : el('g');
      el('rect', { x: cx - 20, y: fBot(2) - 60, width: 40, height: 60, rx: 3, fill: color }, g);
      el('circle', { cx, cy: fBot(2) - 36, r: 11, fill: C.white }, g);
      ICONS[icon](el('g', { transform: `translate(${cx} ${fBot(2) - 36})` }, g), color);
      el('circle', { cx: cx + 13, cy: fBot(2) - 22, r: 2.2, fill: C.white }, g);
    });

    // ----- Étage 1 : chef d'équipe et son tableau -----
    const by = fTop(1) + 14, bx = 392, bw = 168;
    [bx + 22, bx + bw - 22].forEach(x => el('rect', { x: x - 2, y: by + 50, width: 4, height: fBot(1) - by - 50, fill: STRUCT }));
    el('rect', { x: bx, y: by, width: bw, height: 54, rx: 5, fill: C.white, stroke: STRUCT, 'stroke-width': 2.5 });
    el('rect', { x: bx + 2, y: by + 2, width: bw - 4, height: 10, fill: C.pLav });
    S.boardDots = [0, 1, 2].map(k => {
      el('rect', { x: bx + 12, y: by + 19 + k * 11, width: 104 - k * 22, height: 5, rx: 2.5, fill: '#dcdcec' });
      return el('circle', { cx: bx + bw - 16, cy: by + 21.5 + k * 11, r: 4.5, fill: C.green });
    });
    S.chef = person(D.svg, CHEFX, fBot(1), C.violet);
    S.ask1 = el('g');
    el('circle', { cx: CHEFX + 20, cy: fTop(1) + 14, r: 12.5, fill: C.white, stroke: MUTED, 'stroke-width': 2 }, S.ask1);
    el('path', { d: `M ${CHEFX + 11} ${fTop(1) + 22} L ${CHEFX + 7} ${fTop(1) + 29} L ${CHEFX + 15} ${fTop(1) + 25}`, fill: C.white, stroke: MUTED, 'stroke-width': 2, 'stroke-linejoin': 'round' }, S.ask1);
    el('circle', { cx: CHEFX + 20, cy: fTop(1) + 14, r: 10.5, fill: C.white }, S.ask1);
    text(S.ask1, CHEFX + 20, fTop(1) + 20, '?', { size: 17, weight: 800, fill: C.blue, anchor: 'middle' });

    // ----- Étage 0 : le poste -----
    // Limites définies : cadre vert en pointillés (se dessine de gauche à droite)
    const cpL = el('clipPath', { id: 'limits' }, S.defs);
    S.limitClip = el('rect', { x: 284, y: fTop(0), width: 420, height: FH }, cpL);
    S.limits = el('g', { 'clip-path': 'url(#limits)' });
    el('rect', { x: 290, y: fTop(0) + 6, width: 406, height: 80, rx: 12, fill: C.green, 'fill-opacity': 0.08, stroke: C.green, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, S.limits);
    S.decide = el('g');
    const dc = chip(S.decide, 136, fTop(0) + 50, 'décide seul', { bg: C.pGreen, fg: C.tGreen });
    fit(dc.g, 280, 'statut décide seul');
    fit(text(S.decide, LABEL_X, fTop(0) + 79, 'dans ses limites', { size: 15, weight: 500, fill: C.tGreen }), 280, 'dans ses limites');
    // Liste de ce que l'opérateur décide seul
    S.checks = ACTIONS.map((label, k) => {
      const y = CHECK_Y[k];
      const g = el('g');
      const ic = el('g', {}, g);
      el('circle', { cx: CHECK_X, cy: y - 5.5, r: 9, fill: C.green }, ic);
      const path = el('path', { d: `M ${CHECK_X - 4.5} ${y - 5} L ${CHECK_X - 1.2} ${y - 1.8} L ${CHECK_X + 4.5} ${y - 8.5}`, fill: 'none', stroke: C.white, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ic);
      const tx = text(g, CHECK_X + 16, y, label, { size: 16, weight: 700, fill: C.ink });
      fit(tx, 534, `action ${label}`);
      return { g, ic, path, tx, y };
    });
    // Machine et son voyant
    el('rect', { x: 588, y: fBot(0) - 44, width: 100, height: 44, rx: 8, fill: C.blue });
    el('rect', { x: 600, y: fBot(0) - 35, width: 40, height: 16, rx: 3, fill: C.white, 'fill-opacity': 0.9 });
    [656, 669].forEach(x => el('circle', { cx: x, cy: fBot(0) - 27, r: 4, fill: C.lightBlue }));
    el('rect', { x: 674, y: fBot(0) - 64, width: 4, height: 20, fill: STRUCT });
    S.andonHalo = el('circle', { cx: 676, cy: fBot(0) - 68, r: 8, fill: 'none', stroke: C.red, 'stroke-width': 2.5, display: 'none' });
    S.andon = el('circle', { cx: 676, cy: fBot(0) - 68, r: 8, fill: C.green });
    S.op = person(D.svg, OPX, fBot(0), C.teal);
    // Bulle « ? » (dérive 2 : personne ne sait à qui le remonter)
    S.ask = el('g');
    el('circle', { cx: 572, cy: 789, r: 12.5, fill: C.white, stroke: MUTED, 'stroke-width': 2 }, S.ask);
    el('path', { d: 'M 563 797 L 559 804 L 567 800', fill: C.white, stroke: MUTED, 'stroke-width': 2, 'stroke-linejoin': 'round' }, S.ask);
    el('circle', { cx: 572, cy: 789, r: 10.5, fill: C.white }, S.ask);
    text(S.ask, 572, 795, '?', { size: 17, weight: 800, fill: C.blue, anchor: 'middle' });

    // ----- Écrans d'étage (à côté de l'ascenseur) -----
    const panel = f => {
      const y = fTop(f) + 5;
      const g = el('g');
      const box = el('rect', { x: PANEL.x, y, width: PANEL.w, height: PANEL.h, rx: 12, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
      return { g, box, y, cx: PANEL.x + PANEL.w / 2, cy: y + PANEL.h / 2, l1: y + 20, l2: y + 43 };
    };
    const TX = PANEL.x + 12, RX = PANEL.x + PANEL.w - 24;
    // Étage 0 : « Ouvert depuis N jours » (dérive 2) puis « Escalade à 30 min » (règle 2)
    S.p0 = panel(0);
    S.p0days = el('g', {}, S.p0.g);
    fit(text(S.p0days, TX, S.p0.l1, 'Ouvert depuis', { size: 15, weight: 700, fill: C.tRed }), RX - 20, 'écran ouvert depuis');
    S.days = roller(S.p0days, TX, S.p0.l2, { size: 20, weight: 800, fill: C.tRed }, n => `${n}${NB}jour${n > 1 ? 's' : ''}`, { x: TX - 2, y: S.p0.l1 + 4, w: 120, h: 24 }, `14${NB}jours`);
    fit(S.days.a, RX - 20, 'compteur jours');
    const cal = el('g', { transform: `translate(${RX} ${S.p0.cy})` }, S.p0days);
    el('rect', { x: -14, y: -13, width: 28, height: 27, rx: 4, fill: C.white, stroke: C.tRed, 'stroke-width': 2.5 }, cal);
    el('rect', { x: -14, y: -13, width: 28, height: 8, rx: 3, fill: C.red }, cal);
    [-7, 7].forEach(x => el('line', { x1: x, y1: -17, x2: x, y2: -10, stroke: C.tRed, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, cal));
    S.calPage = el('g', {}, cal);
    el('rect', { x: -10, y: -3, width: 20, height: 13, rx: 2, fill: C.pRed }, S.calPage);
    [1, 6].forEach(y => el('line', { x1: -6, y1: y, x2: 6, y2: y, stroke: C.red, 'stroke-width': 2, 'stroke-linecap': 'round' }, S.calPage));
    S.p0seuil = el('g', {}, S.p0.g);
    S.panne = text(S.p0seuil, TX, S.p0.l1, 'Panne depuis', { size: 15, weight: 700, fill: MUTED });
    S.escal = text(S.p0seuil, TX, S.p0.l1, 'Escalade à', { size: 15, weight: 700, fill: C.blue });
    fit(S.panne, RX - 20, 'écran panne'); fit(S.escal, RX - 20, 'écran escalade');
    S.mins = roller(S.p0seuil, TX, S.p0.l2, { size: 20, weight: 800, fill: C.ink }, n => `${n * 5}${NB}min`, { x: TX - 2, y: S.p0.l1 + 4, w: 110, h: 24 }, `30${NB}min`);
    fit(S.mins.a, RX - 20, 'compteur minutes');
    S.ring0 = ring(S.p0seuil, RX, S.p0.cy, 14, C.red);
    S.hand0 = el('line', { x1: 0, y1: 0, x2: 0, y2: -8, stroke: C.ink, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, S.p0seuil);
    el('circle', { cx: RX, cy: S.p0.cy, r: 2.2, fill: C.ink }, S.p0seuil);
    // Étage 2 : « Réponse sous 1 h », minuteur qui décompte
    S.p2 = panel(2);
    fit(text(S.p2.g, TX, S.p2.l1, 'Réponse sous', { size: 15, weight: 700, fill: C.blue }), RX - 24, 'écran réponse');
    fit(text(S.p2.g, TX, S.p2.l2, `1${NB}h`, { size: 20, weight: 800, fill: C.ink }), RX - 24, 'écran 1 h');
    S.ring2 = ring(S.p2.g, RX - 2, S.p2.cy, 17, C.blue);
    S.cd = roller(S.p2.g, RX - 2, S.p2.cy + 5.5, { size: 15, weight: 800, fill: C.ink, anchor: 'middle' }, n => String(n * 5), { x: RX - 14, y: S.p2.cy - 9, w: 24, h: 18 }, '60');
    S.cdCheck = el('path', { d: `M ${RX - 8} ${S.p2.cy + 0.5} L ${RX - 3.5} ${S.p2.cy + 5} L ${RX + 5} ${S.p2.cy - 4.5}`, fill: 'none', stroke: C.tGreen, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.p2.g);
    // Étage 1 : le chef d'équipe est informé de ce qui a été décidé au poste
    S.p1 = panel(1);
    fit(text(S.p1.g, TX, S.p1.l1, 'Informé de', { size: 15, weight: 700, fill: MUTED }), RX - 20, 'écran informé');
    S.info = roller(S.p1.g, TX, S.p1.l2, { size: 20, weight: 800, fill: C.ink }, n => `${n}${NB}décision${n > 1 ? 's' : ''}`, { x: TX - 2, y: S.p1.l1 + 4, w: 130, h: 24 }, `3${NB}décisions`);
    fit(S.info.a, RX - 12, 'compteur informé');
    el('circle', { cx: RX + 2, cy: S.p1.cy, r: 11, fill: C.white, stroke: '#c9c9e0', 'stroke-width': 2 }, S.p1.g);
    text(S.p1.g, RX + 2, S.p1.cy + 5.5, 'I', { size: 15, weight: 800, fill: MUTED, anchor: 'middle' });
    // Étage 3 : « En attente : N décisions »
    S.p3 = panel(3);
    fit(text(S.p3.g, TX, S.p3.l1, 'En attente', { size: 15, weight: 700, fill: MUTED }), RX - 20, 'écran en attente');
    S.wait = roller(S.p3.g, TX, S.p3.l2, { size: 20, weight: 800, fill: C.tRed }, n => `${n}${NB}décision${n > 1 ? 's' : ''}`, { x: TX - 2, y: S.p3.l1 + 4, w: 140, h: 24 }, `5${NB}décisions`);
    fit(S.wait.a, RX - 12, 'compteur décisions');
    S.p3ok = el('g', {}, S.p3.g);
    el('circle', { cx: RX + 2, cy: S.p3.cy, r: 11, fill: C.green }, S.p3ok);
    el('path', { d: `M ${RX - 3.5} ${S.p3.cy + 0.5} L ${RX + 0.5} ${S.p3.cy + 4.5} L ${RX + 7.5} ${S.p3.cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.p3ok);

    // ----- L'ascenseur -----
    S.cable = el('line', { x1: CAB_CX, y1: 482, x2: CAB_CX, y2: 500, stroke: STRUCT, 'stroke-width': 2 });
    S.cab = el('g');
    el('rect', { x: CAB_CX - 6, y: -5, width: 12, height: 6, rx: 2, fill: STRUCT }, S.cab);
    el('rect', { x: CAB.x, y: 0, width: CAB.w, height: CAB.h, rx: 5, fill: '#fbfbff', stroke: STRUCT, 'stroke-width': 3 }, S.cab);
    el('line', { x1: CAB.x + 14, y1: 6, x2: CAB.x + CAB.w - 14, y2: 6, stroke: C.pYellow, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.cab);
    S.cabIn = el('g', {}, S.cab);
    S.doorL = el('rect', { x: CAB.x + 2, y: 2, width: 32, height: CAB.h - 4, fill: DOOR, stroke: '#c2c2da', 'stroke-width': 1.5 }, S.cab);
    S.doorR = el('rect', { x: CAB_CX, y: 2, width: 32, height: CAB.h - 4, fill: DOOR, stroke: '#c2c2da', 'stroke-width': 1.5 }, S.cab);

    // ----- Les écarts (tickets) -----
    S.tkLayer = el('g');
    S.d1 = [0, 1, 2, 3, 4].map(() => ticket(S.tkLayer));
    S.w = ticket(S.tkLayer);
    S.acts = ACTIONS.map(() => ticket(S.tkLayer));
    S.e = ticket(S.tkLayer);

    // ----- La matrice du post -----
    el('rect', { x: MAT.x0, y: MAT.y0, width: MAT.w, height: MAT.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    text(D.svg, 104, HEAD_Y, 'Décision', { size: 15, weight: 700, fill: MUTED });
    COLS.forEach((name, c) => {
      const n = text(D.svg, 0, HEAD_Y, name, { size: 16, weight: 800, fill: C.ink });
      const w = 29 + n.getBBox().width;
      const x0 = COLX[c] - w / 2;
      n.setAttribute('x', f2(x0 + 29));
      el('circle', { cx: f2(x0 + 11), cy: HEAD_Y - 5.5, r: 11, fill: C.blue });
      text(D.svg, x0 + 11, HEAD_Y, String(c), { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
      fit(n, COLX[c] + 80, `colonne ${name}`, COLX[c] - 80);
    });
    el('line', { x1: 96, y1: 924, x2: 984, y2: 924, stroke: CARD_LINE, 'stroke-width': 2 });
    [340, 501, 662, 823].forEach(x => el('line', { x1: x, y1: 898, x2: x, y2: ROW0 + RH * 4 + 16, stroke: ROW_LINE, 'stroke-width': 1.5 }));
    S.bands = ROWS.map((_, r) => el('rect', { x: 90, y: ROW0 + RH * r - 15, width: 900, height: 30, rx: 8, fill: C.pLav, display: 'none' }));
    ROWS.forEach((row, r) => {
      const cy = ROW0 + RH * r;
      if (r < ROWS.length - 1) el('line', { x1: 96, y1: cy + 16, x2: 984, y2: cy + 16, stroke: ROW_LINE, 'stroke-width': 1.5 });
      fit(text(D.svg, 104, cy + 6, row.label, { size: 17, weight: 700, fill: C.ink }), 334, `ligne ${row.label}`);
    });
    S.cells = ROWS.map((row, r) => row.cells.map((L, c) => {
      const cx = COLX[c], cy = ROW0 + RH * r;
      const ghost = el('g', { display: 'none' });
      el('circle', { cx, cy, r: 12, fill: 'none', stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '3.5 3' }, ghost);
      text(ghost, cx, cy + 5.5, '?', { size: 15, weight: 700, fill: GHOST, anchor: 'middle' });
      const cell = el('g');
      if (L === 'D') { el('circle', { cx, cy, r: 13, fill: C.blue }, cell); text(cell, cx, cy + 5.5, 'D', { size: 15, weight: 800, fill: C.white, anchor: 'middle' }); }
      else if (L === 'C') { el('circle', { cx, cy, r: 12, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, cell); text(cell, cx, cy + 5.5, 'C', { size: 15, weight: 800, fill: C.tYellow, anchor: 'middle' }); }
      else if (L === 'I') { el('circle', { cx, cy, r: 12, fill: C.white, stroke: '#c9c9e0', 'stroke-width': 2 }, cell); text(cell, cx, cy + 5.5, 'I', { size: 15, weight: 800, fill: MUTED, anchor: 'middle' }); }
      else el('circle', { cx, cy, r: 2.5, fill: '#d6d6e6' }, cell);
      return { ghost, cell, cx, cy, L, idx: r * 4 + c };
    }));
    // Légende
    const leg = el('g');
    let lx = 0;
    [['D', 'décide'], ['C', 'est consulté'], ['I', 'est informé']].forEach(([L, label], i) => {
      if (i) lx += 34;
      if (L === 'D') el('circle', { cx: lx + 11, cy: 1106, r: 11, fill: C.blue }, leg);
      else if (L === 'C') el('circle', { cx: lx + 11, cy: 1106, r: 10.5, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, leg);
      else el('circle', { cx: lx + 11, cy: 1106, r: 10.5, fill: C.white, stroke: '#c9c9e0', 'stroke-width': 2 }, leg);
      text(leg, lx + 11, 1111, L, { size: 15, weight: 800, fill: L === 'D' ? C.white : L === 'C' ? C.tYellow : MUTED, anchor: 'middle' });
      const t = text(leg, lx + 29, 1112, label, { size: 16, weight: 500, fill: C.ink });
      lx += 29 + t.getBBox().width;
    });
    leg.setAttribute('transform', `translate(${f2(540 - lx / 2)} 0)`);

    // ----- Jetons : la décision prise au poste file vers sa case (lignes 1 à 3) -----
    S.tokens = ACTIONS.map(() => el('circle', { cx: 0, cy: 0, r: 8, fill: C.blue, stroke: C.white, 'stroke-width': 2.5, display: 'none', filter: 'url(#lift)' }));

    // ----- Pastilles d'étape -----
    const PY = FRAME.y + 40;
    const red = { bg: C.pRed, fg: C.tRed, icon: 'x' }, blue = { bg: C.blue, fg: C.white };
    S.pills = [
      pillShape(D.svg, 92, PY, `Sans règles${NB}: tout remonte`, red),
      pillShape(D.svg, 92, PY, `Sans règles${NB}: rien ne remonte`, red),
      pillShape(D.svg, 92, PY, `1${NB}·${NB}Qui décide seul${NB}?`, blue),
      pillShape(D.svg, 92, PY, `2${NB}·${NB}Quand escalader${NB}?`, blue),
      pillShape(D.svg, 92, PY, `3${NB}·${NB}Qui reçoit, sous quel délai${NB}?`, blue),
      pillShape(D.svg, 92, PY, 'Une matrice simple, remplie en une heure', { bg: C.pGreen, fg: C.tGreen, icon: 'check' }),
    ];
    S.pills.forEach((p, i) => fit(p, 880, `pastille ${i + 1}`));

    D.encart([`Qui décide quoi${NB}?`, 'Notre template RACI', '(lien en commentaire)']);
  }

  // ---------- États de l'ascenseur ----------
  function cabState(t) {
    let f = 2, dir = 0, bounce = 0;
    for (const [t0, t1, a, b] of MOVES) {
      if (t < t0) break;
      if (t < t1) { f = lerp(a, b, easeInOut(prog(t, t0, t1 - t0))); dir = Math.sign(b - a); bounce = 0; break; }
      f = b; dir = 0;
      const u = (t - t1) / 0.32;
      bounce = u < 1 ? -Math.sign(b - a) * 3.5 * Math.sin(u * Math.PI * 2) * (1 - u) : 0;
    }
    return { f, dir, y: cabTopAt(f) + bounce };
  }
  function doorOpen(t) {
    let o = 1, prev = 1;
    for (const [t0, d, to] of DOORS) {
      if (t < t0) break;
      o = lerp(prev, to, easeInOut(prog(t, t0, d)));
      prev = to;
    }
    return o;
  }

  // ---------- États des tickets ----------
  const squash = dt => (dt >= 0 && dt < 0.16 ? Math.sin(Math.PI * dt / 0.16) : 0);
  function d1State(i, t, cab) {
    const s = D1S(i), k0 = 0.68;
    const [dx, dy] = SLOTS[i];
    if (t < s) return null;
    if (t < s + D1_POP) { const p = prog(t, s, D1_POP); return { o: clamp(p / 0.4), x: SPAWN.x, y: SPAWN.y, k: popScale(p) }; }
    if (t < s + D1_POP + D1_FLY) {
      const p = easeInOut(prog(t, s + D1_POP, D1_FLY));
      return { o: 1, x: lerp(SPAWN.x, CAB_CX + dx, p), y: lerp(SPAWN.y, cab.y + dy, p) - 12 * Math.sin(Math.PI * p), k: lerp(1, k0, p), lift: true };
    }
    const u = D1U(i);
    if (t < u) return { o: 1, x: CAB_CX + dx, y: dy, k: k0, mode: 'cab' };
    if (t < u + D1_SLIDE) {
      const p = prog(t, u, D1_SLIDE);
      return { o: 1, x: lerp(CAB_CX + dx, QX[i], easeInOut(p)), y: lerp(cab.y + dy, tkY(3), easeOut(clamp(p * 1.6))), k: lerp(k0, 1, easeOut(p)), lift: p < 0.9 };
    }
    const po = prog(t, D1_OUT(i), 0.16);
    if (po >= 1) return null;
    return { o: 1 - po, x: QX[i], y: tkY(3), k: 1 - 0.4 * easeIn(po), sq: squash(t - u - D1_SLIDE) };
  }
  function wState(t) {
    if (t < W_T) return null;
    const po = prog(t, W_OUT, 0.16);
    if (po >= 1) return null;
    const p = prog(t, W_T, 0.16);
    return { o: clamp(p / 0.4) * (1 - po), x: SPAWN.x, y: SPAWN.y, k: popScale(p) * (1 - 0.4 * easeIn(po)), dust: 0.5 * easeInOut(prog(t, T_DAYS, DAYS_DUR)) };
  }
  function actState(k, t) {
    const a = ACT[k];
    if (t < a) return null;
    const po = prog(t, a + 0.3, 0.14);
    if (po >= 1) return null;
    const p = prog(t, a, 0.14);
    return { o: clamp(p / 0.4) * (1 - po), x: SPAWN.x, y: SPAWN.y, k: popScale(p) * (1 - 0.5 * easeIn(po)), green: prog(t, a + 0.18, 0.1) };
  }
  function eState(t, cab) {
    // État final : le ticket escaladé, pris en charge (vert), devant la porte de la maintenance
    const fin = { o: 1, x: E_DEST, y: tkY(2), k: 1, green: 1 };
    if (t < T_OUT) return fin;
    if (t < E_T) { const p = prog(t, T_OUT, 0.16); return p >= 1 ? null : { ...fin, o: 1 - p, k: 1 - 0.4 * easeIn(p) }; }
    if (t < E_ARC[0]) { const p = prog(t, E_T, 0.16); return { o: clamp(p / 0.4), x: SPAWN.x, y: SPAWN.y, k: popScale(p) }; }
    if (t < E_SLIDE[0]) {
      const p = easeInOut(prog(t, E_ARC[0], E_ARC[1]));
      return { o: 1, x: lerp(SPAWN.x, 726, p), y: lerp(SPAWN.y, tkY(0), easeIn(p)) - 10 * Math.sin(Math.PI * p), k: 1, lift: true };
    }
    if (t < E_SLIDE[0] + E_SLIDE[1]) {
      const p = prog(t, E_SLIDE[0], E_SLIDE[1]);
      return { o: 1, x: lerp(726, CAB_CX, easeInOut(p)), y: tkY(0), k: 1, sq: squash(t - E_SLIDE[0] + 0.02) * 0.5 };
    }
    if (t < E_UNLOAD[0]) return { o: 1, x: CAB_CX, y: CAB.h - TH / 2, k: 1, mode: 'cab' };
    if (t < E_UNLOAD[0] + E_UNLOAD[1]) {
      const p = prog(t, E_UNLOAD[0], E_UNLOAD[1]);
      return { o: 1, x: lerp(CAB_CX, E_DEST, easeInOut(p)), y: lerp(cab.y + CAB.h - TH / 2, tkY(2), p), k: 1 };
    }
    return { o: 1, x: E_DEST, y: tkY(2), k: 1, green: prog(t, T_TAKEN + 0.04, 0.14), sq: squash(t - E_UNLOAD[0] - E_UNLOAD[1]) };
  }
  function placeTicket(tk, st) {
    if (!st || st.o <= 0.001) { tk.g.setAttribute('display', 'none'); return; }
    const parent = st.mode === 'cab' ? S.cabIn : S.tkLayer;
    if (tk.g.parentNode !== parent) parent.appendChild(tk.g);
    vis(tk.g, st.o);
    const sq = st.sq || 0;
    const k = st.k;
    if (sq) tk.g.setAttribute('transform', `translate(${f2(st.x)} ${f2(st.y + TH / 2 * k)}) scale(${(k * (1 + 0.06 * sq)).toFixed(3)} ${(k * (1 - 0.12 * sq)).toFixed(3)}) translate(0 ${-TH / 2})`);
    else tk.g.setAttribute('transform', `translate(${f2(st.x)} ${f2(st.y)})` + (Math.abs(k - 1) > 0.0005 ? ` scale(${Math.max(k, 0.001).toFixed(3)})` : ''));
    if (st.lift) tk.g.setAttribute('filter', 'url(#lift)'); else tk.g.removeAttribute('filter');
    vis(tk.green, st.green || 0);
    vis(tk.dust, st.dust || 0);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const cab = cabState(t);
    const open = doorOpen(t);

    // Ascenseur : cabine, câble, portes, afficheur, boutons d'appel
    S.cab.setAttribute('transform', `translate(0 ${f2(cab.y)})`);
    S.cable.setAttribute('y2', f2(cab.y - 4));
    const dw = lerp(32, 4, open);
    S.doorL.setAttribute('width', f2(dw));
    S.doorR.setAttribute('x', f2(CAB.x + CAB.w - 2 - dw));
    S.doorR.setAttribute('width', f2(dw));
    S.floorDigit.set(cab.f, cab.dir < 0 ? -1 : 1, 0.6);
    const blink = Math.floor(t / 0.16) % 2 === 0;
    vis(S.arrowUp, cab.dir > 0 && blink ? 1 : 0);
    vis(S.arrowDn, cab.dir < 0 && blink ? 1 : 0);
    S.calls.forEach((c, f) => {
      const on = f === 0 && CALL.some(([a, b]) => t >= a && t < b);
      c.tri.setAttribute('fill', on ? C.yellow : DASH);
      c.box.setAttribute('stroke', on ? C.yellow : CARD_LINE);
    });

    // Tickets
    S.d1.forEach((tk, i) => placeTicket(tk, d1State(i, t, cab)));
    placeTicket(S.w, wState(t));
    S.acts.forEach((tk, k) => placeTicket(tk, actState(k, t)));
    placeTicket(S.e, eState(t, cab));

    // Voyant de la machine : rouge tant qu'un écart est ouvert au poste
    let red = false;
    for (let i = 0; i < 5; i++) if (t >= D1S(i) && t < D1S(i) + 0.24) red = true;
    if (t >= W_T && t < W_OUT) red = true;
    ACT.forEach(a => { if (t >= a && t < a + 0.22) red = true; });
    if (t >= E_T && t < T_TAKEN) red = true;
    S.andon.setAttribute('fill', red ? C.red : C.green);
    const ph = (t - W_T) / 0.6;
    if (t >= W_T && t < W_OUT) { vis(S.andonHalo, 1 - (ph % 1)); S.andonHalo.setAttribute('r', f2(8 + 9 * (ph % 1))); }
    else vis(S.andonHalo, 0);

    // Tableau du chef d'équipe : l'écart y est visible (point rouge) pendant la dérive 2
    const seen = t >= W_T + 0.1 && t < W_OUT;
    S.boardDots[1].setAttribute('fill', seen ? C.red : C.green);
    S.boardDots[1].setAttribute('r', seen ? f2(4.5 + 1.2 * Math.max(0, Math.sin((t - W_T) * Math.PI * 2 / 0.6))) : 4.5);

    // Opérateur : il agit sur la machine (règle 1)
    let ang = 0;
    ACT.forEach(a => { const p = prog(t, a + 0.02, 0.34); if (p > 0 && p < 1) ang = -72 * Math.sin(Math.PI * p); });
    S.op.arm.setAttribute('transform', `translate(${S.op.ax} ${S.op.ay})` + (ang ? ` rotate(${f2(ang)})` : ''));
    const ask = life(t, [[T_ASK, W_OUT - 0.04]]);
    lifeApply(S.ask, ask, 572, 795);

    // Dérive 1 : le manager devient le goulot
    const gl = life(t, [[T_GOULOT, D1_OUT(0)]]);
    lifeApply(S.goulot.g, gl, 170, fTop(3) + 50);
    if (gl.o > 0) S.goulot.d.setAttribute('opacity', f2(0.45 + 0.55 * Math.cos((t - T_GOULOT) * Math.PI * 2 / 0.5)));
    const mp = (t - T_GOULOT) / 0.5;
    if (t >= T_GOULOT && t < D1_OUT(0)) { vis(S.mgrPulse, 0.9 * (1 - (mp % 1))); S.mgrPulse.setAttribute('r', f2(26 + 12 * (mp % 1))); }
    else vis(S.mgrPulse, 0);

    // Règle 1 : les limites de l'opérateur, et ce qu'il décide seul
    const lo = t < T_LIMIT ? (t < T_OUT ? 1 : 1 - prog(t, T_OUT, 0.25)) : 1;
    vis(S.limits, lo);
    S.limitClip.setAttribute('width', f2(t < T_LIMIT ? 420 : 420 * easeInOut(prog(t, T_LIMIT, 0.35))));
    lifeApply(S.decide, life(t, [FINAL, [T_LIMIT + 0.1, Infinity]]), 190, fTop(0) + 62);
    S.checks.forEach((ck, k) => {
      const a = ACT[k] + 0.12;
      const st = life(t, [FINAL, [a, Infinity]], 0.22, 0.18);
      if (!vis(ck.g, st.o)) return;
      setT(ck.ic, scaleAt(CHECK_X, ck.y - 5.5, st.k));
      const pd = t < a ? 1 : prog(t, a + 0.08, 0.18);
      if (pd >= 1) { ck.path.removeAttribute('stroke-dasharray'); ck.path.removeAttribute('stroke-dashoffset'); }
      else { ck.path.setAttribute('stroke-dasharray', 16); ck.path.setAttribute('stroke-dashoffset', f2(16 * (1 - pd))); }
      const pt = t < a ? 1 : prog(t, a, 0.22);
      setT(ck.tx, pt >= 1 ? '' : `translate(${f2(-10 * (1 - easeOut(pt)))} 0)`);
    });

    // Écran de l'étage 0 : jours (dérive 2) puis seuil (règle 2)
    const daysOn = t >= T_ASK && t < W_OUT + 0.2;
    const p0 = daysOn ? life(t, [[T_ASK + 0.05, W_OUT - 0.04]]) : life(t, [FINAL, [E_T + 0.06, Infinity]]);
    if (lifeApply(S.p0.g, p0, S.p0.cx, S.p0.cy)) {
      vis(S.p0days, daysOn ? 1 : 0);
      vis(S.p0seuil, daysOn ? 0 : 1);
      if (daysOn) {
        const q = S.days.set(1 + 13 * easeInOut(prog(t, T_DAYS, DAYS_DUR)), 1, 0.7);
        setT(S.calPage, q > 0.001 ? `translate(0 -3) scale(1 ${(1 - 0.9 * Math.sin(Math.PI * q)).toFixed(3)}) translate(0 3)` : '');
        S.p0.box.setAttribute('stroke', CARD_LINE);
      } else {
        const fin = t < E_T;                 // avant la règle 2 : contenu final (qui s'efface au début)
        const v = fin ? 6 : 6 * prog(t, T_MIN, MIN_DUR);
        S.mins.set(v, 1, 0.8);
        S.ring0.set(v / 6);
        S.hand0.setAttribute('transform', `translate(${PANEL.x + PANEL.w - 24} ${S.p0.cy})` + (v < 6 ? ` rotate(${f2(360 * v / 6)})` : ''));
        const pPanne = fin ? 0 : 1 - prog(t, T_SEUIL + 0.02, 0.1);
        const pEsc = fin ? 1 : prog(t, T_SEUIL + 0.14, 0.2);
        vis(S.panne, pPanne);
        vis(S.escal, pEsc);
        setT(S.escal, pEsc >= 1 ? '' : `translate(0 ${f2(6 * (1 - easeOut(pEsc)))})`);
        const fl = fin ? 0 : Math.sin(Math.PI * prog(t, T_SEUIL, 0.45));
        S.p0.box.setAttribute('stroke', fl > 0.05 ? C.red : CARD_LINE);
        S.p0.box.setAttribute('stroke-width', fl > 0.05 ? f2(2 + 1.5 * fl) : 2);
      }
    }

    // Écran de l'étage 2 : réponse sous 1 h, le minuteur décompte puis la demande est prise en charge
    const p2 = life(t, [FINAL, [T_TIMER, Infinity]]);
    if (lifeApply(S.p2.g, p2, S.p2.cx, S.p2.cy)) {
      const fin = t < T_TIMER;
      const taken = fin || t >= T_TAKEN;
      const v = 12 - 4 * prog(t, T_CD, CD_DUR);
      const pn = taken ? (fin ? 1 : prog(t, T_TAKEN, 0.12)) : 0;
      if (vis(S.cd.a.parentNode, 1 - pn)) S.cd.set(v, -1, 0.85);
      const pc = fin ? 1 : prog(t, T_TAKEN + 0.1, 0.22);
      if (vis(S.cdCheck, taken ? pc : 0)) setT(S.cdCheck, scaleAt(PANEL.x + PANEL.w - 26, S.p2.cy, popScale(pc)));
      S.ring2.set(taken ? lerp(v / 12, 1, easeInOut(fin ? 1 : prog(t, T_TAKEN, 0.2))) : v / 12, taken ? C.green : C.blue);
    }
    // Porte de la maintenance : elle s'ouvre, le technicien prend la demande
    const dOpen = t < T_OUT ? 1 - prog(t, T_OUT, 0.18) : prog(t, T_TAKEN, 0.2);
    setT(S.leaf, dOpen > 0.001 ? `translate(604 0) scale(${(1 - 0.82 * easeInOut(dOpen)).toFixed(3)} 1) translate(-604 0)` : '');
    vis(S.tech.g, t < T_OUT ? 1 - prog(t, T_OUT, 0.15) : prog(t, T_TAKEN + 0.06, 0.18));
    vis(S.doorway, dOpen > 0.001 ? 1 : 0);

    // Écran de l'étage 1 : le chef d'équipe est informé, sans avoir à décider
    const p1 = life(t, [FINAL, [ACT[0] + 0.24, Infinity]]);
    if (lifeApply(S.p1.g, p1, S.p1.cx, S.p1.cy)) {
      let n = 0;
      ACT.forEach(a => { n += t < ACT[0] ? 1 : prog(t, a + 0.3, 0.16); });
      S.info.set(n, 1, 1);
    }
    lifeApply(S.ask1, life(t, [[T_ASK + 0.12, W_OUT - 0.04]]), CHEFX + 20, fTop(1) + 20);

    // Écran de l'étage 3 : décisions en attente (dérive 1), puis plus rien (final)
    const d1on = t >= D1U(0) && t < D1_OUT(0) + 0.3;
    const p3 = d1on ? life(t, [[D1U(0) + 0.2, D1_OUT(0)]]) : life(t, [FINAL, [T_F3_FINAL, Infinity]]);
    if (lifeApply(S.p3.g, p3, S.p3.cx, S.p3.cy)) {
      if (d1on) {
        let n = 0;
        for (let i = 0; i < 5; i++) n += prog(t, D1U(i) + D1_SLIDE - 0.06, 0.1);
        S.wait.set(n, 1, 1, C.tRed);
      } else S.wait.set(0, 1, 1, C.tGreen);
      vis(S.p3ok, d1on ? 0 : 1);
    }

    // La matrice : ? pendant les dérives, puis les cases se remplissent
    const cellT = (r, c) => {
      const dc = ROWS[r].cells.indexOf('D');
      return FILL[r] + (c === dc ? 0 : 0.05 + 0.07 * Math.abs(c - dc));
    };
    S.cells.forEach((row, r) => row.forEach((cl, c) => {
      const ct = cellT(r, c);
      let o, k;
      if (t < T_OUT) { o = 1; k = 1; }
      else if (t < ct) { const p = prog(t, T_OUT + 0.008 * cl.idx, 0.18); o = 1 - p; k = 1 - 0.5 * easeIn(p); }
      else { const p = prog(t, ct, 0.26); o = clamp(p / 0.4); k = popScale(p); }
      lifeApply(cl.cell, { o, k }, cl.cx, cl.cy);
      const g = t < T_OUT ? 0 : prog(t, T_OUT + 0.18 + 0.008 * cl.idx, 0.22) * (1 - prog(t, ct - 0.06, 0.08));
      vis(cl.ghost, g);
    }));
    S.bands.forEach((b, r) => vis(b, t < T_OUT ? 0 : 0.9 * Math.sin(Math.PI * prog(t, FILL[r] - 0.06, 0.6))));

    // Jetons : de la coche au poste jusqu'à la case « D » (arrivée par la gauche, sans croiser de texte)
    S.tokens.forEach((g, r) => {
      const p = t < T_OUT ? 1 : prog(t, FILL[r] - FLY, FLY);
      if (!vis(g, p > 0 && p < 1 ? 1 : 0)) return;
      const x0 = CHECK_X, y0 = CHECK_Y[r] - 5.5, x1 = COLX[0], y1 = ROW0 + RH * r;
      const q = easeInOut(p);
      const xc = x0 - 6, yc = y1;
      const x = (1 - q) * (1 - q) * x0 + 2 * (1 - q) * q * xc + q * q * x1;
      const y = (1 - q) * (1 - q) * y0 + 2 * (1 - q) * q * yc + q * q * y1;
      g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) scale(${(1 + 0.25 * Math.sin(Math.PI * p)).toFixed(3)})`);
    });

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = P[i] + 0.12;
      let o, dy;
      if (i === P.length - 1) { o = t < T_OUT + 0.2 ? 1 - prog(t, T_OUT, 0.14) : prog(t, a, 0.25); dy = t < T_OUT + 0.2 ? 0 : 8 * (1 - prog(t, a, 0.25)); }
      else { o = prog(t, a, 0.25) * (1 - prog(t, P[i + 1], 0.14)); dy = 8 * (1 - prog(t, a, 0.25)); }
      vis(g, o);
      setT(g, dy > 0.001 ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
