// Fiche LinkedIn · Clément Raymond · mardi 6 octobre 2026
// Post : « Une machine occupée à 100 % n'est pas forcément une bonne nouvelle. Surtout si la machine suivante ne suit pas. »
// Premier commentaire du post : notre article sur le Lean Manufacturing (le délai gagné entre les machines) → encart.
// Le visuel est la pièce maîtresse : une simulation de flux en particules. Un poste rapide (8 pièces/jour) et un
// poste lent (4 pièces/jour) reliés par un convoyeur ; les pièces circulent en direct (petite physique déterministe
// calculée au build : tapis qui pousse, contacts, foule qui se tasse devant le poste lent). Sur chaque poste, sa jauge
// d'occupation ; au centre, les indicateurs du flux (encours, délai de traversée).
// « Chaque machine doit tourner » : le poste rapide passe à 100 %, les deux jauges disent « tout va bien » pendant que
// l'encours grossit et que le délai s'allonge : les deux indicateurs divergent. Les trois ❌ du post arrivent quand ils
// deviennent vrais (dont un défaut découvert le jeudi sur une pièce du mardi, enfouie dans le stock). Puis la règle :
// le poste lent fixe le rythme (une pièce sort, une pièce est lancée) ; le poste rapide s'arrête, puis se cale sur lui
// (50 %), l'encours se stabilise, le délai chute, les ❌ se barrent.
// Style propre : simulation de flux en particules, deux indicateurs qui divergent.
// Image t = 0 = état final (le régime calé, en direct). Boucle exacte de 12,5 s.
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
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix3 = (a, b, c, p) => (p < 0.5 ? mix(a, b, p * 2) : mix(b, c, p * 2 - 1));
  const mix = (a, b, p) => {
    p = clamp(p);
    const A = hex(a), B = hex(b);
    return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * p).toString(16).padStart(2, '0')).join('');
  };
  // Un élément invisible passe en display none (contrôle de boucle stable)
  const vis = (n, o) => {
    if (o <= 0.002) { n.setAttribute('display', 'none'); return false; }
    n.removeAttribute('display');
    n.setAttribute('opacity', o >= 0.998 ? 1 : f2(o));
    return true;
  };
  const scaleAt = (n, cx, cy, k) => n.setAttribute('transform', k >= 0.999 && k <= 1.001 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-cx)} ${f2(-cy)})`);
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', TRACK = '#e6e6f2';
  const BELT = '#e8e8f2', BELT_EDGE = '#cdcde0', BELT_TICK = '#dedeeb', GREY = '#c2c2d8', STRUCK_BG = '#eeeef5';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 714 };
  const PILL_Y = 452;
  const SCR = { y: 488, h: 202, w: 210 };                  // écrans des postes (jauge d'occupation)
  const SX = [92, 662];
  const CXS = SX.map(x => x + SCR.w / 2);                   // 197 · 767
  const BLK = { w: 160, y: 700, h: 146 };                   // les postes, posés sur le convoyeur
  const BX = CXS.map(c => c - BLK.w / 2);
  const XF_OUT = BX[0] + BLK.w, XS_IN = BX[1], XS_OUT = BX[1] + BLK.w;
  const BY0 = 729, BY1 = 817, YC = (BY0 + BY1) / 2;         // le tapis
  const R = 14;                                             // rayon d'une pièce
  const MID = { x: 318, w: 328 };                           // carte « entre les deux postes »
  const BAR = { x: 338, w: 288, h: 22, y: [566, 642] };
  const CAL = { x: 884, y: 520, w: 104, h: 132 };
  const DIAL = { cy: 614, r: 58, sw: 12 };
  const LINK = { top: BLK.y + BLK.h, y: 876, x0: 262, x1: 700 };
  const TAG = { x: 724, y: 852, w: 280, h: 82 };
  const ROWS_Y = [974, 1026, 1078], ROW_H = 44;

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const PS = DURATION / 62, PF = PS / 2;                    // cycle du poste lent, du poste rapide (62 cycles par boucle)
  const H_S = 2 / PS;                                       // heures d'atelier par seconde (poste lent : 2 h par pièce)
  const T_X = 1.1, X_DUR = 0.3;                             // l'état final cède la place au départ
  const T_A0 = 1.4;                                         // « chaque machine doit tourner » : le rapide passe à 100 %
  const T_P2 = 2.6;                                         // « le stock grossit »
  const T_B0 = 5.4;                                         // la règle : le poste rapide s'arrête
  const T_R = 2 * T_B0 - T_A0;                              // l'encours retrouve son niveau calé (modèle fluide)
  const T_RP = T_R - PS;                                    // le poste rapide repart, calé sur le poste lent
  const L = 0.8;                                            // trajet sur le convoyeur (retard des arrivées)
  const E_P = 2, E_MAX = E_P + (T_B0 - T_A0) / PS, E_SCALE = 24;
  const H_MAX = 3 + 2 * E_MAX, H_SCALE = 48;
  const T_FIN = T_R + L + 0.1;                              // encours stabilisé
  const T_X1 = 3.0, T_X2 = 3.95;                            // ❌ 1 et 2 (le 3 tombe à la découverte du défaut)
  const T_S = [T_FIN - 0.3, T_FIN - 0.05, T_FIN + 0.2];     // les ❌ se barrent
  const T_LINK = T_B0 + 0.25, LINK_DUR = 0.6;
  const T_GHOST = T_B0 + L + 0.35;
  const T_TAG_OUT = T_B0 + 1.8;
  const S_OFF = T_A0 + 0.06, SIG = 0.25, DELTA = SIG + PF;  // signal du poste lent → le rapide lance une pièce
  const SIM0 = -2.5, SIM1 = DURATION + T_A0 + 0.05, DT = 1 / 240;
  const V = 420, A_MAX = 3000, KF = 20, KD = 10;            // tapis : vitesse (px/s), poussée, amortissement latéral
  const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const OMEGA_S = 90;                                       // engrenage du poste lent (°/s, 1125° par boucle)

  // Encours (pièces en attente entre les postes) et délai de traversée (h ouvrées) : modèle fluide
  const encours = t => {
    if (t < T_A0 + L) return E_P;
    if (t < T_B0 + L) return E_P + (t - T_A0 - L) / PS;
    return Math.max(E_P, E_MAX - (t - T_B0 - L) / PS);
  };
  const delai = E => 3 + 2 * E;                             // 1 h au poste rapide + 2 h au poste lent + 2 h par pièce devant
  const fmtH = h => {
    if (h < 7.75) {
      let hh = Math.floor(h), mm = Math.round((h - hh) * 6) * 10;
      if (mm === 60) { hh++; mm = 0; }
      return mm ? `${hh}${NB}h${NB}${String(mm).padStart(2, '0')}` : `${hh}${NB}h`;
    }
    let d = Math.floor(h / 8), r = Math.round(h - 8 * d);
    if (r === 8) { d++; r = 0; }
    return r ? `${d}${NB}j${NB}${r}${NB}h` : `${d}${NB}j`;
  };
  // Occupation du poste rapide
  const occF = t => (t < T_B0 + 0.2
    ? lerp(0.5, 1, easeInOut(prog(t, T_A0 + 0.05, 0.6)))
    : lerp(1, 0.5, easeInOut(prog(t, T_B0 + 0.2, 3.8))));
  const tau = u => (u - T_A0) * H_S;                        // heures d'atelier depuis lundi 8 h

  // ---------- Simulation : les pièces sur le convoyeur ----------
  const P = [], TAKES = [], EMITS = [], SIGNALS = [];
  let DEF = null, OMEGA_F = 180;

  function simulate() {
    for (let k = Math.ceil((SIM0 - S_OFF) / PS); S_OFF + k * PS <= SIM1; k++) TAKES.push(S_OFF + k * PS);
    // Régime calé (avant le départ et après la règle) : chaque prise du poste lent déclenche une pièce
    TAKES.forEach(s => {
      const e = s + DELTA;
      if (e >= SIM0 && e <= SIM1 && (e < T_A0 || e >= T_RP)) { EMITS.push(e); SIGNALS.push(s); }
    });
    // « Chaque machine doit tourner » : le poste rapide produit à son rythme
    for (let j = Math.ceil((T_A0 - S_OFF - DELTA) / PF - 1e-9); ; j++) {
      const e = S_OFF + DELTA + j * PF;
      if (e >= T_B0) break;
      if (e >= T_A0) EMITS.push(e);
    }
    EMITS.sort((a, b) => a - b);

    const NPER = Math.round(DURATION / PF);
    const jitter = e => {
      const k = ((Math.round((e - S_OFF - DELTA) / PF) % NPER) + NPER) % NPER;
      const x = Math.sin(k * 12.9898 + 4.1) * 43758.5453;
      return (x - Math.floor(x)) * 2 - 1;
    };
    const phys = [];
    const XWALL = XS_IN - R + 3, YMIN = BY0 + R + 3, YMAX = BY1 - R - 3, DMIN = 2 * R + 1.5;
    const mk = (born, x, y) => {
      const p = { id: P.length, born, x, y, vx: 0, vy: 0, n0: null, rec: [], take: null };
      P.push(p); phys.push(p);
      return p;
    };
    // Petit stock de départ devant le poste lent
    [[0, -15], [0, 15], [1, -27], [1, 0], [1, 27], [2, -15], [2, 15], [3, 0]].forEach(([c, dy]) => mk(SIM0, XWALL - c * 25, YC + dy));

    const N = Math.ceil((SIM1 - SIM0) / DT);
    let ei = 0, ti = 0;
    for (let n = 0; n <= N; n++) {
      const u = SIM0 + n * DT;
      while (ei < EMITS.length && EMITS[ei] <= u + 1e-9) {
        const p = mk(EMITS[ei], XF_OUT - R - 6, YC + jitter(EMITS[ei]) * 22);
        p.vx = V;
        ei++;
      }
      while (ti < TAKES.length && TAKES[ti] <= u + 1e-9) {
        const s = TAKES[ti++];
        let best = null, bs = -Infinity;
        phys.forEach(p => {
          if (p.x < XWALL - 2 * R - 2) return;
          const sc = p.x - 0.5 * Math.abs(p.y - YC);
          if (sc > bs) { bs = sc; best = p; }
        });
        if (best) { best.take = s; best.tx = best.x; best.ty = best.y; phys.splice(phys.indexOf(best), 1); }
      }
      for (const p of phys) {
        p.vx += clamp((V - p.vx) * KF, -A_MAX, A_MAX) * DT;
        p.vy *= 1 - KD * DT;
        p.px = p.x + p.vx * DT;
        p.py = p.y + p.vy * DT;
      }
      for (let it = 0; it < 6; it++) {
        for (let i = 0; i < phys.length; i++) {
          const a = phys[i];
          for (let j = i + 1; j < phys.length; j++) {
            const b = phys[j];
            const dx = b.px - a.px, dy = b.py - a.py;
            if (dx >= DMIN || dx <= -DMIN || dy >= DMIN || dy <= -DMIN) continue;
            const d2 = dx * dx + dy * dy;
            if (d2 >= DMIN * DMIN) continue;
            const d = Math.sqrt(d2) || 1e-6, c = (DMIN - d) / 2 / d;
            a.px -= dx * c; a.py -= dy * c; b.px += dx * c; b.py += dy * c;
          }
        }
        for (const p of phys) { if (p.px > XWALL) p.px = XWALL; if (p.py < YMIN) p.py = YMIN; if (p.py > YMAX) p.py = YMAX; }
      }
      for (const p of phys) {
        p.vx = (p.px - p.x) / DT; p.vy = (p.py - p.y) / DT; p.x = p.px; p.y = p.py;
        if (p.n0 === null) p.n0 = n;
        p.rec.push(Math.round(p.x * 100) / 100, Math.round(p.y * 100) / 100);
      }
    }
    // La pièce défectueuse : fabriquée le mardi, enfouie dans le stock, prise par le poste lent le jeudi (vers 4,5 s)
    let bd = Infinity;
    P.forEach(p => {
      if (p.take === null || p.born < T_A0 + 8 / H_S + 0.05 || p.take > T_A0 + 32 / H_S - 0.03) return;   // fabriquée mardi, prise jeudi
      const d = Math.abs(p.take - 4.45);
      if (d < bd) { bd = d; DEF = p; }
    });
    if (!DEF) console.error('Simulation : pas de pièce défectueuse');
    // Engrenage du poste rapide : un nombre entier de crans par boucle
    const W = workF(SIM1 - 0.05) - workF(T_A0);
    OMEGA_F = 45 * Math.max(1, Math.round(W * 200 / 45)) / W;
  }
  // Temps de travail cumulé du poste rapide (chaque pièce : PF avant sa sortie)
  const workF = u => EMITS.reduce((a, e) => a + clamp(u - e + PF, 0, PF), 0);
  const fastBusy = u => EMITS.some(e => u >= e - PF && u < e);

  // Position d'une pièce à l'instant u de la simulation (null : invisible)
  function pState(p, u) {
    if (u < p.born) return null;
    if (p.take === null || u < p.take) {
      const n = p.rec.length / 2, k = (u - SIM0) / DT - p.n0;
      const i = clamp(Math.floor(k), 0, n - 1), j = Math.min(n - 1, i + 1), f = clamp(k - i);
      return { x: lerp(p.rec[2 * i], p.rec[2 * j], f), y: lerp(p.rec[2 * i + 1], p.rec[2 * j + 1], f), done: false };
    }
    const v = u - p.take;
    if (v < 0.12) { const q = easeIn(v / 0.12); return { x: lerp(p.tx, XS_IN + 34, q), y: lerp(p.ty, YC, q), done: false }; }
    if (v < PS || p === DEF) return null;
    const x = XS_OUT - R - 4 + V * (v - PS);
    return x > FRAME.x + FRAME.w + R ? null : { x, y: YC, done: true };
  }

  // ---------- Petits éléments ----------
  const arcPath = (cx, cy, r, v) => {
    const a = Math.PI * (1 - clamp(v, 0.001, 1));
    return `M ${f2(cx - r)} ${f2(cy)} A ${r} ${r} 0 0 1 ${f2(cx + r * Math.cos(a))} ${f2(cy - r * Math.sin(a))}`;
  };
  const checkIcon = (g, x, cy, r = 11) => {
    el('circle', { cx: x, cy, r, fill: C.green }, g);
    el('path', { d: `M ${x - 5.5} ${cy + 0.5} L ${x - 1.5} ${cy + 4.5} L ${x + 5.5} ${cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  };
  // Pastille centrée (badge des écrans)
  function badge(cx, cy, label, { bg, fg, icon = false, size = 16, h = 30, maxW }) {
    const g = el('g');
    const r = el('rect', { y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const tx = text(g, 0, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    const iw = icon ? 24 : 0, w = tx.getBBox().width + 28 + iw, x0 = cx - w / 2;
    r.setAttribute('x', f2(x0)); r.setAttribute('width', f2(w));
    tx.setAttribute('x', f2(x0 + 14 + iw));
    if (icon) checkIcon(g, x0 + 23, cy, 9);
    if (maxW) fit(r, cx + maxW / 2, `badge ${label}`, cx - maxW / 2);
    return g;
  }
  // Pastille d'étape (alignée à gauche)
  function pill(x, cy, label, { bg, fg, icon = false, size = 21, h = 42 }) {
    const g = el('g');
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon) checkIcon(g, x + 31, cy, 12);
    return g;
  }
  function gear(parent, cx, cy) {
    const g = el('g', {}, parent);
    const inner = el('g', {}, g);
    for (let k = 0; k < 8; k++) el('rect', { x: -4, y: -21, width: 8, height: 10, rx: 2, fill: C.white, transform: `rotate(${k * 45})` }, inner);
    el('circle', { cx: 0, cy: 0, r: 13, fill: 'none', stroke: C.white, 'stroke-width': 6 }, inner);
    g.setAttribute('transform', `translate(${cx} ${cy})`);
    return inner;
  }

  const S = { pieces: [], st: [], rows: [] };

  function build() {
    D.template({ author: 'clement' });
    D.title('Sur l’indicateur,', 'tout va bien.');
    D.chapeau(`Une machine occupée à 100${NB}% n’est pas forcément une bonne nouvelle.`);

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Chaque poste affiche son ', 0], ['occupation', C.blue], ['. Au centre, l’', 0], ['encours', C.blue], [' et le ', 0], ['délai', C.blue], [' entre les deux.', 0]]);
    line(384, [[`La règle${NB}: un atelier ne produit jamais plus vite que son `, 0], ['poste le plus lent', C.blue], ['.', 0]]);

    simulate();

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-60%', y: '-60%', width: '220%', height: '220%' }, defs);
    el('feDropShadow', { dx: 0, dy: 8, stdDeviation: 5, 'flood-color': C.ink, 'flood-opacity': 0.28 }, lift);
    const cp = el('clipPath', { id: 'frame' }, defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26 }, cp);

    // ----- Cadre -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- Le convoyeur -----
    const belt = el('g', { 'clip-path': 'url(#frame)' });
    el('rect', { x: 100, y: BY0, width: 960, height: BY1 - BY0, rx: 12, fill: BELT }, belt);
    for (let x = 118; x < 1030; x += 36) el('line', { x1: x, y1: BY0 + 6, x2: x, y2: BY1 - 6, stroke: BELT_TICK, 'stroke-width': 2 }, belt);
    [BY0, BY1].forEach(y => el('line', { x1: 100, y1: y, x2: 1060, y2: y, stroke: BELT_EDGE, 'stroke-width': 3 }, belt));

    // ----- La boucle de calage (sous le convoyeur) -----
    S.link = el('g');
    const lpath = `M ${LINK.x1} ${LINK.top} V ${LINK.y} H ${LINK.x0} V ${LINK.top + 6}`;
    S.linkLen = (LINK.y - LINK.top) + (LINK.x1 - LINK.x0) + (LINK.y - LINK.top - 6);
    S.linkPath = el('path', { d: lpath, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, S.link);
    S.linkHead = el('path', { d: `M ${LINK.x0 - 7} ${LINK.top + 15} L ${LINK.x0} ${LINK.top + 6} L ${LINK.x0 + 7} ${LINK.top + 15}`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.link);
    S.linkLabel = text(D.svg, (LINK.x0 + LINK.x1) / 2, LINK.y + 27, 'Une pièce sort, une pièce est lancée', { size: 17, weight: 700, fill: C.blue, anchor: 'middle' });
    fit(S.linkLabel, LINK.x1 - 6, 'boucle de calage', LINK.x0 + 6);
    S.signals = [0, 1, 2].map(() => el('circle', { r: 6.5, fill: C.blue, stroke: C.white, 'stroke-width': 2.5 }));

    // ----- Les pièces -----
    const layer = el('g', { 'clip-path': 'url(#frame)' });
    P.forEach(p => { S.pieces.push(el('circle', { r: R, fill: C.lightBlue, stroke: C.white, 'stroke-width': 2.5, display: 'none' }, layer)); });
    S.defDot = el('circle', { r: 4.5, fill: C.red, display: 'none' }, layer);

    // ----- Les deux postes : écran (jauge d'occupation) et machine -----
    ['Poste rapide', 'Poste lent'].forEach((name, i) => {
      const x0 = SX[i], cx = CXS[i];
      [cx - 46, cx + 46].forEach(x => el('rect', { x: x - 5, y: SCR.y + SCR.h - 6, width: 10, height: BLK.y - SCR.y - SCR.h + 12, rx: 3, fill: '#cfcfe2' }));
      el('rect', { x: x0, y: SCR.y, width: SCR.w, height: SCR.h, rx: 20, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
      fit(text(D.svg, cx, SCR.y + 34, name, { size: 20, weight: 800, fill: C.ink, anchor: 'middle' }), x0 + SCR.w - 12, `nom ${name}`, x0 + 12);
      el('path', { d: arcPath(cx, DIAL.cy, DIAL.r, 1), fill: 'none', stroke: TRACK, 'stroke-width': DIAL.sw, 'stroke-linecap': 'round' });
      const arc = el('path', { fill: 'none', 'stroke-width': DIAL.sw, 'stroke-linecap': 'round' });
      const knob = el('circle', { r: 8, fill: C.white, 'stroke-width': 4 });
      const val = text(D.svg, cx, DIAL.cy + 1, `100${NB}%`, { size: 28, weight: 800, fill: C.ink, anchor: 'middle' });
      fit(val, cx + DIAL.r - DIAL.sw / 2 - 2, `valeur jauge ${i}`, cx - DIAL.r + DIAL.sw / 2 + 2);
      text(D.svg, cx, DIAL.cy + 25, 'occupation', { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
      const by = SCR.y + SCR.h - 26, mw = SCR.w - 16;
      const bOk = badge(cx, by, 'Tout va bien', { bg: C.pGreen, fg: C.tGreen, icon: true, maxW: mw });
      const bFin = i === 0
        ? badge(cx, by, 'Calé sur le lent', { bg: C.pLav, fg: C.blue, maxW: mw })
        : badge(cx, by, 'Fixe le rythme', { bg: C.pLav, fg: C.blue, maxW: mw });
      const bStop = i === 0 ? badge(cx, by, 'À l’arrêt', { bg: '#ececf2', fg: MUTED, maxW: mw }) : null;
      // La machine, posée sur le tapis
      const blk = el('rect', { x: BX[i], y: BLK.y, width: BLK.w, height: BLK.h, rx: 18, fill: C.blue, stroke: C.red, 'stroke-width': 0 });
      const g = gear(D.svg, cx, YC - 6);
      const light = el('circle', { cx: BX[i] + 20, cy: BLK.y + 19, r: 6.5, fill: C.green });
      const cad = text(D.svg, cx, BLK.y + BLK.h - 15, i ? `4${NB}pièces/jour` : `8${NB}pièces/jour`, { size: 16, weight: 700, fill: '#dcdcf3', anchor: 'middle' });
      fit(cad, BX[i] + BLK.w - 8, `cadence ${i}`, BX[i] + 8);
      S.st.push({ arc, knob, val, bOk, bFin, bStop, blk, gear: g, light, cx, by });
    });
    // Alerte du poste lent (défaut découvert)
    S.alert = el('g');
    el('circle', { cx: 0, cy: 0, r: 17, fill: C.red, stroke: C.white, 'stroke-width': 3 }, S.alert);
    text(S.alert, 0, 8.5, '!', { size: 24, weight: 800, fill: C.white, anchor: 'middle' });

    // ----- Au centre : ce qui se passe entre les deux postes -----
    el('rect', { x: MID.x, y: SCR.y, width: MID.w, height: SCR.h, rx: 20, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    text(D.svg, MID.x + MID.w / 2, SCR.y + 34, 'Entre les deux postes', { size: 18, weight: 800, fill: C.ink, anchor: 'middle' });
    S.meters = [['Encours', E_MAX / E_SCALE, `avant${NB}: ${Math.round(E_MAX)}`], ['Délai de traversée', H_MAX / H_SCALE, `avant${NB}: ${fmtH(H_MAX)}`]].map(([label, gmax, glabel], k) => {
      const y = BAR.y[k];
      fit(text(D.svg, BAR.x, y - 12, label, { size: 16, weight: 700, fill: MUTED }), BAR.x + 160, `libellé ${label}`);
      const val = text(D.svg, BAR.x + BAR.w, y - 11, '', { size: 23, weight: 800, fill: C.ink, anchor: 'end' });
      el('rect', { x: BAR.x, y, width: BAR.w, height: BAR.h, rx: BAR.h / 2, fill: TRACK });
      const gw = BAR.w * gmax;
      const ghost = el('g');
      el('rect', { x: BAR.x + 1, y: y + 1, width: gw - 2, height: BAR.h - 2, rx: BAR.h / 2 - 1, fill: 'none', stroke: MUTED, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, ghost);
      const fill = el('rect', { x: BAR.x, y, height: BAR.h, rx: BAR.h / 2 });
      const gl = text(D.svg, BAR.x + gw - 10, y + BAR.h / 2 + 5.5, glabel, { size: 15, weight: 700, fill: MUTED, anchor: 'end' });
      return { val, fill, ghost, gl, gx0: gl.getBBox().x };
    });

    // ----- Le calendrier de l'atelier (accéléré) -----
    const cg = el('g');
    el('rect', { x: CAL.x, y: CAL.y, width: CAL.w, height: CAL.h, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, cg);
    el('path', { d: `M ${CAL.x} ${CAL.y + 34} V ${CAL.y + 16} Q ${CAL.x} ${CAL.y} ${CAL.x + 16} ${CAL.y} H ${CAL.x + CAL.w - 16} Q ${CAL.x + CAL.w} ${CAL.y} ${CAL.x + CAL.w} ${CAL.y + 16} V ${CAL.y + 34} Z`, fill: C.blue }, cg);
    [CAL.x + 28, CAL.x + CAL.w - 28].forEach(x => el('rect', { x: x - 3.5, y: CAL.y - 8, width: 7, height: 16, rx: 3.5, fill: C.ink }, cg));
    S.calWeek = text(cg, CAL.x + CAL.w / 2, CAL.y + 24, '', { size: 15, weight: 700, fill: C.white, anchor: 'middle' });
    S.calDay = text(cg, CAL.x + CAL.w / 2, CAL.y + 74, '', { size: 18, weight: 800, fill: C.ink, anchor: 'middle' });
    el('rect', { x: CAL.x + 14, y: CAL.y + 96, width: CAL.w - 28, height: 8, rx: 4, fill: TRACK }, cg);
    S.calBar = el('rect', { x: CAL.x + 14, y: CAL.y + 96, height: 8, rx: 4, fill: C.lightBlue }, cg);
    text(cg, CAL.x + CAL.w / 2, CAL.y + 123, 'accéléré', { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
    S.calTxt = el('g', {}, cg);
    S.calTxt.appendChild(S.calWeek); S.calTxt.appendChild(S.calDay);
    // Contrôle des noms de jour les plus longs
    DAYS.forEach(d => {
      S.calDay.textContent = d;
      const b = S.calDay.getBBox();
      if (b.x < CAL.x + 6 || b.x + b.width > CAL.x + CAL.w - 6) console.error(`Débordement : calendrier ${d} (${Math.round(b.width)} px)`);
    });
    S.calDay.textContent = '';

    // ----- La pièce défectueuse, retirée du convoyeur, et son étiquette -----
    const dname = u => DAYS[Math.floor(Math.max(0, tau(u)) / 8) % 5].toLowerCase();
    S.tag = el('g');
    el('rect', { x: TAG.x, y: TAG.y, width: TAG.w, height: TAG.h, rx: 16, fill: C.pRed, stroke: C.red, 'stroke-width': 2 }, S.tag);
    const tx0 = TAG.x + 58;
    [[`Défaut découvert ${dname(DEF.take)}`, 16, 800, TAG.y + 27], [`pièce fabriquée ${dname(DEF.born)},`, 15, 700, TAG.y + 49], ['enfouie dans le stock', 15, 700, TAG.y + 69]].forEach(([s, size, weight, y], k) => {
      fit(text(S.tag, tx0, y, s, { size, weight, fill: C.tRed }), TAG.x + TAG.w - 10, `étiquette défaut ${k + 1}`);
    });
    S.defLift = el('g', { filter: 'url(#lift)' });
    el('circle', { cx: 0, cy: 0, r: R, fill: C.red, stroke: C.white, 'stroke-width': 2.5 }, S.defLift);
    text(S.defLift, 0, 6.5, '!', { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
    S.defPlace = [TAG.x + 30, TAG.y + TAG.h / 2];

    // ----- Les trois ❌ du post -----
    [`Plus d’encours.`, `Un délai de traversée qui s’allonge.`, `Des défauts découverts des jours après leur fabrication.`].forEach((s, i) => {
      const cy = ROWS_Y[i];
      const g = el('g');
      const bg = el('rect', { x: 92, y: cy - ROW_H / 2, width: 896, height: ROW_H, rx: 14, fill: C.pRed }, g);
      const icon = el('g', {}, g);
      const ic = el('circle', { cx: 120, cy, r: 13, fill: C.red }, icon);
      el('path', { d: `M ${120 - 5} ${cy - 5} L ${120 + 5} ${cy + 5} M ${120 + 5} ${cy - 5} L ${120 - 5} ${cy + 5}`, stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, icon);
      const tx = text(g, 146, cy + 7, s, { size: 20, weight: 700, fill: C.tRed });
      fit(tx, 970, `❌ ${i + 1}`);
      const b = tx.getBBox();
      const len = b.width + 8;
      const strike = el('line', { x1: 142, y1: cy - 0.5, x2: 142 + len, y2: cy - 0.5, stroke: MUTED, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
      S.rows.push({ g, bg, icon, ic, tx, strike, len, cy });
    });

    // ----- Pastilles d'étape -----
    S.pills = [
      [T_A0 + 0.05, `1${NB}·${NB}Chaque machine doit tourner`, 'b'],
      [T_P2, `2${NB}·${NB}Entre les deux, le stock grossit`, 'b'],
      [T_B0, `3${NB}·${NB}Le poste lent fixe le rythme`, 'b'],
      [T_FIN, 'L’encours se stabilise, le délai chute', 'g'],
    ].map(([t0, label, k]) => {
      const g = k === 'g' ? pill(92, PILL_Y, label, { bg: C.pGreen, fg: C.tGreen, icon: true }) : pill(92, PILL_Y, label, { bg: C.blue, fg: C.white });
      fit(g, CAL.x - 20, `pastille ${label}`);
      return { g, t0 };
    });

    D.encart(['Le délai entre les machines', 'Notre article sur le Lean', '(lien en commentaire)']);
    S.T_X3 = DEF.take + PS + 0.5;
  }

  // ---------- Dessin à l'instant t ----------
  // Fenêtre d'apparition : entrée (0,25 s) puis sortie (0,14 s) ; « final » : visible aussi sur l'image finale
  const winO = (t, a, b, final) => (final && t < T_A0 ? 1 - prog(t, T_X, 0.14) : prog(t, a, 0.25) * (1 - prog(t, b, 0.14)));
  const winK = (t, a, final) => (final && t < T_A0 ? 1 : popScale(prog(t, a, 0.3)));

  function draw(t) {
    const end = t < T_A0;                      // avant le départ : la fin de la simulation qui continue (état final)
    const uEnd = t + DURATION;
    const u = end ? uEnd : t;
    const xf = easeInOut(prog(t, T_X, X_DUR));
    const fadeEnd = 1 - prog(t, T_X, 0.25);

    // Pièces (pendant le fondu : la fin de la simulation s'efface, le départ apparaît)
    let defShown = false;
    P.forEach((p, i) => {
      const n = S.pieces[i];
      let st = pState(p, u), o = 1;
      if (end && t >= T_X) { if (st) o = 1 - xf; else { st = pState(p, t); o = xf; } }
      if (!st) { n.setAttribute('display', 'none'); return; }
      if (!vis(n, o)) return;
      n.setAttribute('cx', f2(st.x)); n.setAttribute('cy', f2(st.y));
      n.setAttribute('fill', st.done ? C.blue : C.lightBlue);
      if (p === DEF && !st.done) {
        defShown = vis(S.defDot, o);
        S.defDot.setAttribute('cx', f2(st.x)); S.defDot.setAttribute('cy', f2(st.y));
      }
    });
    if (!defShown) S.defDot.setAttribute('display', 'none');

    // Postes : jauges, badges, engrenages, voyants
    const vF = end ? 0.5 : occF(t);
    [vF, 1].forEach((v, i) => {
      const s = S.st[i];
      const col = i ? C.green : mix(C.blue, C.green, (v - 0.5) * 2);
      s.arc.setAttribute('d', arcPath(s.cx, DIAL.cy, DIAL.r, v));
      s.arc.setAttribute('stroke', col);
      const a = Math.PI * (1 - v);
      s.knob.setAttribute('cx', f2(s.cx + DIAL.r * Math.cos(a))); s.knob.setAttribute('cy', f2(DIAL.cy - DIAL.r * Math.sin(a)));
      s.knob.setAttribute('stroke', col);
      s.val.textContent = `${Math.round(v * 100)}${NB}%`;
    });
    const BADGES = [
      [[S.st[0].bFin, T_RP + 0.16, Infinity, true], [S.st[0].bOk, T_A0 + 0.75, T_B0 + 0.1, false], [S.st[0].bStop, T_B0 + 0.3, T_RP, false]],
      [[S.st[1].bFin, T_B0 + 0.3, Infinity, true], [S.st[1].bOk, T_A0 + 0.75, T_B0 + 0.1, false]],
    ];
    BADGES.forEach((list, i) => list.forEach(([g, a, b, final]) => {
      if (vis(g, winO(t, a, b, final))) scaleAt(g, S.st[i].cx, S.st[i].by, winK(t, a, final));
    }));
    S.st[1].gear.setAttribute('transform', `rotate(${f2((OMEGA_S * u) % 360)})`);
    S.st[0].gear.setAttribute('transform', `rotate(${f2((OMEGA_F * workF(u)) % 360)})`);
    S.st[0].light.setAttribute('fill', fastBusy(u) ? C.green : GREY);

    // Défaut découvert au poste lent : alerte, la pièce rouge est retirée, étiquette
    const ds = DEF.take, dOut = ds + PS, dLand = dOut + 0.45;
    const alertO = end ? 0 : prog(t, ds + 0.02, 0.2) * (1 - prog(t, ds + 1.3, 0.25));
    if (vis(S.alert, alertO)) {
      const k = popScale(prog(t, ds + 0.02, 0.3)) * (1 + 0.08 * Math.sin((t - ds) * Math.PI * 2 / 0.6));
      S.alert.setAttribute('transform', `translate(${XS_OUT - 6} ${BLK.y + 6}) scale(${f2(k)})`);
    }
    S.st[1].blk.setAttribute('stroke-width', alertO > 0.002 ? f2(4 * alertO) : 0);
    const tagO = end ? 0 : prog(t, dOut + 0.25, 0.25) * (1 - prog(t, T_TAG_OUT, 0.25));
    if (vis(S.tag, tagO)) scaleAt(S.tag, TAG.x + TAG.w / 2, TAG.y + TAG.h / 2, popScale(prog(t, dOut + 0.25, 0.3)));
    const liftO = end ? 0 : (t >= dOut ? 1 : 0) * (1 - prog(t, T_TAG_OUT, 0.25));
    if (vis(S.defLift, liftO)) {
      const q = easeInOut(prog(t, dOut, dLand - dOut));
      const x = lerp(XS_OUT - 2, S.defPlace[0], q), y = lerp(YC, S.defPlace[1], q) - 70 * Math.sin(Math.PI * q);
      const sq = prog(t, dLand, 0.18);
      const k = q < 1 ? 1 + 0.18 * Math.sin(Math.PI * q) : 1 - 0.08 * Math.sin(Math.PI * sq);
      S.defLift.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) scale(${f2(k)})`);
      if (q > 0 && q < 1) S.defLift.setAttribute('filter', 'url(#lift)'); else S.defLift.removeAttribute('filter');
    }

    // Boucle de calage : tracée à la règle, signaux du poste lent vers le poste rapide
    const lp = end ? 1 : easeInOut(prog(t, T_LINK, LINK_DUR));
    if (vis(S.link, end ? fadeEnd : lp > 0 ? 1 : 0)) {
      if (lp < 1) { S.linkPath.setAttribute('stroke-dasharray', f2(S.linkLen)); S.linkPath.setAttribute('stroke-dashoffset', f2(S.linkLen * (1 - lp))); }
      else { S.linkPath.removeAttribute('stroke-dasharray'); S.linkPath.removeAttribute('stroke-dashoffset'); }
      vis(S.linkHead, lp >= 0.98 ? 1 : 0);
    }
    vis(S.linkLabel, end ? fadeEnd : prog(t, T_LINK + 0.45, 0.3));
    const sigO = end ? fadeEnd : prog(t, T_LINK + LINK_DUR, 0.1);
    const live = SIGNALS.filter(s => u >= s && u < s + SIG);
    S.signals.forEach((n, k) => {
      const s = live[k];
      if (s === undefined || !vis(n, sigO)) { n.setAttribute('display', 'none'); return; }
      let d = easeInOut((u - s) / SIG) * S.linkLen;
      const l1 = LINK.y - LINK.top, l2 = LINK.x1 - LINK.x0;
      let x, y;
      if (d < l1) { x = LINK.x1; y = LINK.top + d; }
      else if (d < l1 + l2) { x = LINK.x1 - (d - l1); y = LINK.y; }
      else { x = LINK.x0; y = LINK.y - (d - l1 - l2); }
      n.setAttribute('cx', f2(x)); n.setAttribute('cy', f2(y));
    });

    // Indicateurs du flux : encours et délai de traversée
    const E = end ? E_P : encours(t), Hh = delai(E);
    const pe = clamp((E - 3.5) / 5);
    const ghostO = end ? fadeEnd : prog(t, T_GHOST, 0.3);
    [[`${Math.round(E)}${NB}pièces`, E / E_SCALE], [fmtH(Hh), Hh / H_SCALE]].forEach(([label, r], k) => {
      const m = S.meters[k];
      m.val.textContent = label;
      m.val.setAttribute('fill', mix3(C.tGreen, C.tYellow, C.tRed, pe));
      const w = Math.max(BAR.h, BAR.w * Math.min(1, r));
      m.fill.setAttribute('width', f2(w));
      m.fill.setAttribute('fill', mix3(C.green, C.yellow, C.red, pe));
      vis(m.ghost, ghostO);
      vis(m.gl, ghostO * clamp((m.gx0 - (BAR.x + w) - 8) / 16));
    });

    // Calendrier de l'atelier
    let cO = 1, tc = tau(u);
    if (end && t >= T_X) { const p = prog(t, T_X, 0.3); cO = Math.abs(1 - 2 * p); if (p >= 0.5) tc = 0; }
    const day = Math.floor(Math.max(0, tc) / 8), fd = Math.max(0, tc) / 8 - day;
    S.calWeek.textContent = `Semaine${NB}${Math.floor(day / 5) + 1}`;
    S.calDay.textContent = DAYS[day % 5];
    const since = fd * 8 / H_S;
    const roll = (!end && t > T_A0 + 0.2 && since < 0.12) ? since / 0.12 : 1;
    S.calDay.setAttribute('transform', roll < 1 ? `translate(0 ${f2(9 * (1 - easeOut(roll)))})` : '');
    vis(S.calTxt, cO * (roll < 1 ? roll : 1));
    S.calBar.setAttribute('width', f2(Math.max(0.01, (CAL.w - 28) * fd)));

    // Les trois ❌ : ils arrivent quand ils deviennent vrais, se barrent quand la règle les corrige
    const TIN = [T_X1, T_X2, S.T_X3];
    S.rows.forEach((r, i) => {
      const o = end ? fadeEnd : prog(t, TIN[i], 0.3);
      if (!vis(r.g, o)) return;
      const dx = end ? 0 : -18 * (1 - easeOut(prog(t, TIN[i], 0.35)));
      r.g.setAttribute('transform', dx ? `translate(${f2(dx)} 0)` : '');
      scaleAt(r.icon, 120, r.cy, end ? 1 : popScale(prog(t, TIN[i] + 0.05, 0.35)));
      const sk = end ? 1 : prog(t, T_S[i], 0.35);
      r.bg.setAttribute('fill', mix(C.pRed, STRUCK_BG, sk));
      r.tx.setAttribute('fill', mix(C.tRed, MUTED, sk));
      r.ic.setAttribute('fill', mix(C.red, GREY, sk));
      if (vis(r.strike, sk > 0 ? 1 : 0)) {
        const q = easeInOut(sk);
        if (q < 1) { r.strike.setAttribute('stroke-dasharray', f2(r.len)); r.strike.setAttribute('stroke-dashoffset', f2(r.len * (1 - q))); }
        else { r.strike.removeAttribute('stroke-dasharray'); r.strike.removeAttribute('stroke-dashoffset'); }
      }
    });

    // Pastilles d'étape : l'ancienne sort (0,14 s), puis la nouvelle entre
    S.pills.forEach(({ g, t0 }, i) => {
      const last = i === S.pills.length - 1;
      const a = i ? t0 + 0.16 : t0, b = last ? Infinity : S.pills[i + 1].t0;
      const o = winO(t, a, b, last);
      if (!vis(g, o)) return;
      const dy = end ? 0 : 8 * (1 - prog(t, a, 0.25));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
