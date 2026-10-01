// Fiche LinkedIn · Clément Raymond · mercredi 28 octobre 2026
// Post : « Former d'abord les équipes, puis les managers. C'est un ordre fréquent dans les démarches Lean.
// C'est souvent celui qui les fait échouer. »
// Premier commentaire du post : la plaquette de nos formations Lean + les avis de nos stagiaires (deux liens) → encart.
// Le visuel est la pièce maîtresse : l'organisation en réseau (équipes et leurs opérateurs, managers, planning,
// validation des standards). Ordre fréquent : les équipes s'allument et font remonter des signaux ; sur les liens,
// les trois incidents du post (reçu comme une plainte, personne pour valider, rien au planning) : les signaux
// rebondissent et les équipes s'éteignent une à une. Puis l'ordre qui tient : 1 les managers s'allument,
// 2 une zone pilote où équipe et manager s'allument ensemble et où les règles se testent (le planning et la
// validation s'allument à leur tour), 3 le déploiement de proche en proche par les managers. La lumière tient.
// Style propre : le réseau qui s'allume (ou qui rejette). Image t = 0 = état final. Boucle de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const accel = p => p * p * (2 - p);                 // lancé : part doucement, arrive vite (pour rebondir)
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const rgb = c => (c[0] === '#' ? [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)) : c.slice(4, -1).split(',').map(Number));
  const mix = (a, b, p) => {                          // couleurs « #rrggbb » ou « rgb(r,g,b) »
    if (p <= 0) return a;
    if (p >= 1) return b;
    const A = rgb(a), B = rgb(b);
    return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(',')})`;
  };
  const NB = ' ';
  const show = (n, o) => {                            // invisible : display none (image stable pour la boucle)
    if (o <= 0.001) { n.setAttribute('display', 'none'); return false; }
    n.removeAttribute('display');
    n.setAttribute('opacity', o >= 0.999 ? 1 : f2(o));
    return true;
  };
  const scaleAt = (k, x, y) => (k === 1 ? '' : `translate(${f2(x)} ${f2(y)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-x)} ${f2(-y)})`);

  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec';
  const OFF_FILL = '#ebebf3', OFF_STROKE = '#d2d2e3', OFF_DISC = '#c4c4d8', OFF_TEXT = '#9393b3', LINK_OFF = '#d6d6e6';
  const ROLE = { team: C.teal, op: C.teal, mgr: C.blue, hub: C.violet };

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const XL = 200, XC = 540, XR = 880;
  const Y_HUB = 575, Y_MGR = 785, Y_TEAM = 952;
  const CH = 54, HUB_H = 66, OP_R = 11;
  const OPS = [[-60, 86], [0, 100], [60, 86]];
  const ZONE = { x: 434, y: 743, w: 212, h: 357 };      // zone pilote : manager 2, équipe 2 et ses opérateurs

  const N = {
    V: { kind: 'hub', x: XL, y: Y_HUB, lines: ['Validation', 'des standards'], icon: 'stamp' },
    P: { kind: 'hub', x: XR, y: Y_HUB, lines: ['Planning'], icon: 'calendar' },
    M1: { kind: 'mgr', x: XL, y: Y_MGR, lines: ['Manager'], icon: 'manager' },
    M2: { kind: 'mgr', x: XC, y: Y_MGR, lines: ['Manager'], icon: 'manager' },
    M3: { kind: 'mgr', x: XR, y: Y_MGR, lines: ['Manager'], icon: 'manager' },
    T1: { kind: 'team', x: XL, y: Y_TEAM, lines: ['Équipe'], icon: 'team' },
    T2: { kind: 'team', x: XC, y: Y_TEAM, lines: ['Équipe'], icon: 'team' },
    T3: { kind: 'team', x: XR, y: Y_TEAM, lines: ['Équipe'], icon: 'team' },
  };
  ['T1', 'T2', 'T3'].forEach((tk, i) => OPS.forEach(([dx, dy], j) => {
    N[`O${i + 1}${'abc'[j]}`] = { kind: 'op', x: N[tk].x + dx, y: N[tk].y + dy, team: tk, j };
  }));
  const IDS = Object.keys(N);
  const CHIPS = IDS.filter(id => N[id].kind !== 'op');
  const OPIDS = IDS.filter(id => N[id].kind === 'op');
  const LINKS = [['V', 'M1'], ['V', 'M2'], ['P', 'M2'], ['P', 'M3'], ['M1', 'M2'], ['M2', 'M3'], ['M1', 'T1'], ['M2', 'T2'], ['M3', 'T3']];
  const key = (a, b) => [a, b].sort().join('-');

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION - 0.001;
  const T_OUT = 1.2, OUT_DUR = 0.35, T_SEQ = T_OUT + OUT_DUR;   // l'image finale s'éteint, puis tout recommence
  const T_TEAMS = { T1: 1.8, T2: 2.0, T3: 2.2 };                // ordre fréquent : les équipes formées d'abord
  const T_RED_OUT = 6.3;                                         // les traces du premier ordre s'effacent
  const T_MGR = { M1: 6.55, M2: 6.7, M3: 6.85 };                 // 1 · les managers d'abord
  const T_ZONE = 7.45, ZONE_DUR = 0.45, T_PILOT = 7.95;          // 2 · zone pilote
  const SQUASH = 0.08;
  const PILLS = [
    [1.6, `Ordre fréquent${NB}: les équipes d’abord`, 'b'],
    [2.5, 'Le lendemain de la formation', 'b'],
    [5.75, 'L’environnement gagne', 'r'],
    [6.4, `1${NB}·${NB}Les managers d’abord`, 'b'],
    [7.35, `2${NB}·${NB}Une zone pilote ensuite`, 'b'],
    [9.65, `3${NB}·${NB}Le déploiement enfin`, 'b'],
    [11.05, `Signaux reçus${NB}: la lumière tient`, 'g'],
  ];
  // Signaux : go = [[indice d'arrivée sur le chemin, durée, pause]] ; reject = rebondit, receive = reçu, spread = la lumière se propage
  const SIGNALS = [
    { id: 'i1', path: ['O1b', 'T1', 'M1'], t0: 2.7, go: [[2, 0.42]], kind: 'reject', back: 0.42 },
    { id: 'i2', path: ['T2', 'M2', 'V'], t0: 3.35, go: [[1, 0.26, 0.26], [2, 0.46]], kind: 'reject', back: 0.58 },
    { id: 'i3', path: ['T3', 'M3', 'P'], t0: 4.15, go: [[2, 0.52]], kind: 'reject', back: 0.48 },
    { id: 'r1', path: ['O2b', 'T2', 'M2'], t0: 8.2, go: [[2, 0.42]], kind: 'receive' },
    { id: 'r2', path: ['T2', 'M2', 'V'], t0: 8.5, go: [[2, 0.62]], kind: 'receive' },
    { id: 'r3', path: ['T2', 'M2', 'P'], t0: 8.8, go: [[2, 0.62]], kind: 'receive' },
    { id: 'd1', path: ['M2', 'M1'], t0: 9.78, go: [[1, 0.36]], kind: 'spread' },
    { id: 'd2', path: ['M2', 'M3'], t0: 9.78, go: [[1, 0.36]], kind: 'spread' },
    { id: 'd3', path: ['M1', 'T1'], t0: 10.16, go: [[1, 0.26]], kind: 'spread' },
    { id: 'd4', path: ['M1', 'V'], t0: 10.16, go: [[1, 0.3]], kind: 'spread' },
    { id: 'd5', path: ['M3', 'T3'], t0: 10.16, go: [[1, 0.26]], kind: 'spread' },
    { id: 'd6', path: ['M3', 'P'], t0: 10.16, go: [[1, 0.3]], kind: 'spread' },
    { id: 'r4', path: ['O1b', 'T1', 'M1'], t0: 10.62, go: [[2, 0.4]], kind: 'receive' },
    { id: 'r5', path: ['O3b', 'T3', 'M3'], t0: 10.62, go: [[2, 0.4]], kind: 'receive' },
  ];
  const SIG = Object.fromEntries(SIGNALS.map(sg => [sg.id, sg]));

  // ---------- Pictos (blancs sur le disque ; « cut » = traits à la couleur du disque) ----------
  const ICONS = {
    team(g) {
      [-8.5, 8.5].forEach(x => {
        el('circle', { cx: x, cy: -6.5, r: 4.2, fill: C.white, 'fill-opacity': 0.72 }, g);
        el('path', { d: `M ${x - 6.5} 7 C ${x - 6.5} -1.5, ${x + 6.5} -1.5, ${x + 6.5} 7 Z`, fill: C.white, 'fill-opacity': 0.72 }, g);
      });
      const a = el('circle', { cx: 0, cy: -4.5, r: 6, fill: C.white, 'stroke-width': 2.4 }, g);
      const b = el('path', { d: 'M -9.5 11 C -9.5 0.5, 9.5 0.5, 9.5 11 Z', fill: C.white, 'stroke-width': 2.4 }, g);
      return [[a, 'stroke'], [b, 'stroke']];
    },
    manager(g) {
      el('circle', { cx: 0, cy: -6, r: 6, fill: C.white }, g);
      el('path', { d: 'M -10.5 11 C -10.5 -0.5, 10.5 -0.5, 10.5 11 Z', fill: C.white }, g);
      const tie = el('path', { d: 'M 0 1.6 L 2.8 4.6 L 0 10.5 L -2.8 4.6 Z' }, g);
      return [[tie, 'fill']];
    },
    stamp(g) {
      el('path', { d: 'M -8.5 -11 H 3.5 L 8.5 -6 V 11 H -8.5 Z', fill: C.white, 'stroke-linejoin': 'round' }, g);
      const ck = el('path', { d: 'M -4.5 1.5 L -1 5 L 5 -2', fill: 'none', 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      return [[ck, 'stroke']];
    },
    calendar(g) {
      el('rect', { x: -10.5, y: -8, width: 21, height: 19, rx: 3, fill: C.white }, g);
      [-5, 5].forEach(x => el('rect', { x: x - 1.5, y: -11.5, width: 3, height: 6, rx: 1.5, fill: C.white }, g));
      const cut = [[el('line', { x1: -10.5, y1: -2.5, x2: 10.5, y2: -2.5, 'stroke-width': 2 }, g), 'stroke']];
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) cut.push([el('rect', { x: -7 + c * 5.4, y: 0.5 + r * 4.6, width: 3.4, height: 3, rx: 0.8 }, g), 'fill']);
      return cut;
    },
  };

  // ---------- Petits éléments ----------
  function pillShape(parent, x, cy, label, { bg, fg, icon = null, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon === 'check') {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.green }, g);
      el('path', { d: `M ${x + 25.5} ${cy + 0.5} L ${x + 29.5} ${cy + 4.5} L ${x + 36.5} ${cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    } else if (icon === 'cross') {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.red }, g);
      el('path', { d: `M ${x + 26.5} ${cy - 4.5} L ${x + 35.5} ${cy + 4.5} M ${x + 35.5} ${cy - 4.5} L ${x + 26.5} ${cy + 4.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    }
    return g;
  }
  // Pastille ronde (✗, ?, ✓) posée sur le coin d'une bulle ou d'un nœud
  function mark(parent, cx, cy, kind, r = 12) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: kind === 'ok' ? C.green : C.red, stroke: C.white, 'stroke-width': 2.5 }, g);
    const st = { fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    if (kind === 'ok') el('path', { d: `M ${cx - 5} ${cy + 0.5} L ${cx - 1.5} ${cy + 4} L ${cx + 5.5} ${cy - 3.5}`, ...st }, g);
    else if (kind === 'no') el('path', { d: `M ${cx - 4} ${cy - 4} L ${cx + 4} ${cy + 4} M ${cx + 4} ${cy - 4} L ${cx - 4} ${cy + 4}`, ...st }, g);
    else text(g, cx, cy + 6, '?', { size: 17, weight: 800, fill: C.white, anchor: 'middle' });
    return g;
  }
  function numBadge(parent, cx, cy, label) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r: 13, fill: C.yellow, stroke: C.white, 'stroke-width': 2.5 }, g);
    text(g, cx, cy + 5.4, label, { size: 15, weight: 800, fill: C.ink, anchor: 'middle' });
    return g;
  }
  // Bulle : rectangle arrondi + queue vers le lien où l'incident se produit
  function bubblePath(x, y, w, h, r, side, tb, [tx, ty]) {
    let d = `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r}`;
    if (side === 'right') d += ` V ${tb - 9} L ${tx} ${ty} L ${x + w} ${tb + 9}`;
    d += ` V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r}`;
    if (side === 'left') d += ` V ${tb + 9} L ${tx} ${ty} L ${x} ${tb - 9}`;
    return d + ` V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
  }
  function bubble(parent, { left, right, y, side, tip, line1, line2, tone, label }) {
    const g = el('g', {}, parent);
    const path = el('path', { fill: C.white, stroke: tone === 'ok' ? C.green : C.red, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    const a = text(g, 0, y + 26, line1, { size: 16, weight: 500, fill: MUTED });
    const b = text(g, 0, y + 50, line2, { size: 17, weight: 800, fill: tone === 'ok' ? C.tGreen : C.tRed });
    const H = 64, PAD = 18;
    const w = Math.max(a.getBBox().width, b.getBBox().width) + 2 * PAD;
    const x = left !== undefined ? left : right - w;
    [a, b].forEach(n => n.setAttribute('x', f2(x + PAD)));
    const tb = clamp(tip[1], y + 23, y + H - 23);
    path.setAttribute('d', bubblePath(x, y, w, H, 14, side, tb, tip));
    mark(g, side === 'right' ? x + 4 : x + w - 4, y + 4, tone === 'ok' ? 'ok' : tone === 'ask' ? 'ask' : 'no');
    [a, b].forEach((n, i) => fit(n, x + w - PAD + 0.5, `${label} ligne ${i + 1}`, x + PAD - 0.5));
    fit(path, FRAME.x + FRAME.w - 14, `${label} cadre`, FRAME.x + 14);
    return { g, tip, x, w };
  }
  // Tracé en pointillés qui se dessine : motif 10 / 8 jusqu'à la longueur r, puis un grand vide
  function dashReveal(r, total) {
    const a = [];
    let acc = 0;
    while (acc < r) {
      const d = Math.min(10, r - acc); a.push(f2(d)); acc += d;
      if (acc >= r) break;
      const gp = Math.min(8, r - acc); a.push(f2(gp)); acc += gp;
    }
    if (a.length % 2 === 0) a.push(0);
    a.push(f2(total + 40));
    return a.join(' ');
  }

  // ---------- Construction ----------
  const S = { links: {}, sigs: [], bubbles: [] };

  function edgePoint(from, n) {
    const hw = n.kind === 'op' ? OP_R : n.w / 2 + 1, hh = n.kind === 'op' ? OP_R : n.h / 2 + 1;
    const dx = n.x - from[0], dy = n.y - from[1];
    const k = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
    return [n.x - dx * k, n.y - dy * k];
  }

  function buildChip(id, layer) {
    const n = N[id];
    const g = el('g', {}, layer);
    n.halo = el('rect', { 'fill-opacity': 0.17 }, g);
    n.ringA = el('rect', { fill: 'none', 'stroke-width': 3 }, g);
    n.ringB = el('rect', { fill: 'none', 'stroke-width': 2.5 }, g);
    n.body = el('rect', { 'stroke-width': 2.5 }, g);
    n.disc = el('circle', { r: 17 }, g);
    n.iconG = el('g', {}, g);
    n.cut = ICONS[n.icon](n.iconG);
    const size = n.lines.length > 1 ? 18 : 20;
    n.labels = n.lines.map(l => text(g, 0, 0, l, { size, weight: 700 }));
    n.tw = Math.max(...n.labels.map(t => t.getBBox().width));
    n.w = 56 + n.tw + 22;
    n.h = n.kind === 'hub' ? HUB_H : CH;
    n.size = size;
  }
  function layoutChip(n, label) {
    const x0 = n.x - n.w / 2, y0 = n.y - n.h / 2;
    n.x0 = x0; n.y0 = y0;
    const rect = (r, off) => { r.setAttribute('x', f2(x0 - off)); r.setAttribute('y', f2(y0 - off)); r.setAttribute('width', f2(n.w + 2 * off)); r.setAttribute('height', f2(n.h + 2 * off)); r.setAttribute('rx', f2(16 + off)); };
    rect(n.body, 0);
    rect(n.halo, 9);
    n.rect = rect;
    n.disc.setAttribute('cx', f2(x0 + 29));
    n.disc.setAttribute('cy', n.y);
    n.iconG.setAttribute('transform', `translate(${f2(x0 + 29)} ${n.y})`);
    const ys = n.lines.length > 1 ? [n.y - 4, n.y + 18] : [n.y + n.size * 0.36];
    n.labels.forEach((t, i) => { t.setAttribute('x', f2(x0 + 56)); t.setAttribute('y', f2(ys[i])); fit(t, x0 + n.w - 10, `${label} libellé ${i + 1}`, x0 + 50); });
    fit(n.halo, FRAME.x + FRAME.w - 10, `${label} cadre`, FRAME.x + 10);
  }
  function buildOp(id, layer) {
    const n = N[id];
    const g = el('g', {}, layer);
    n.halo = el('circle', { cx: n.x, cy: n.y, r: OP_R + 7, 'fill-opacity': 0.2, fill: C.teal }, g);
    n.ringA = el('circle', { cx: n.x, cy: n.y, fill: 'none', 'stroke-width': 2.5 }, g);
    n.body = el('circle', { cx: n.x, cy: n.y, r: OP_R, stroke: C.white, 'stroke-width': 2.5 }, g);
    n.w = n.h = 2 * OP_R;
  }

  function prepSignal(sg) {
    const pts = sg.path.map(id => [N[id].x, N[id].y]);
    pts[pts.length - 1] = edgePoint(pts[pts.length - 2], N[sg.path[sg.path.length - 1]]);
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    Object.assign(sg, { pts, cum, L: cum[cum.length - 1], legs: [] });
    let t = sg.t0, d = 0;
    sg.go.forEach(([idx, dur, pause = 0]) => {
      sg.legs.push({ t, dur, d0: d, d1: cum[idx], ease: sg.go.length > 1 ? easeInOut : sg.kind === 'reject' ? accel : easeInOut });
      t += dur; d = cum[idx];
      if (pause) { sg.legs.push({ t, dur: pause, d0: d, d1: d, ease: p => p }); t += pause; }
    });
    sg.tFirst = sg.t0 + sg.go[0][1];                  // premier relais atteint
    sg.tHit = t;                                       // arrivée au bord du nœud visé
    if (sg.kind === 'reject') {
      sg.legs.push({ t, dur: SQUASH, d0: d, d1: d, ease: p => p }); t += SQUASH;
      sg.legs.push({ t, dur: sg.back, d0: d, d1: 0, ease: easeOut }); t += sg.back;
    }
    sg.tEnd = t;
  }
  const sigDist = (sg, s) => {
    if (s < sg.t0) return null;
    for (const l of sg.legs) if (s < l.t + l.dur) return lerp(l.d0, l.d1, l.ease(clamp((s - l.t) / l.dur)));
    return sg.legs[sg.legs.length - 1].d1;
  };
  const sigPoint = (sg, d) => {
    let i = 0;
    while (i < sg.cum.length - 2 && d > sg.cum[i + 1]) i++;
    const a = sg.pts[i], b = sg.pts[i + 1], len = sg.cum[i + 1] - sg.cum[i];
    const p = len ? clamp((d - sg.cum[i]) / len) : 0;
    return [lerp(a[0], b[0], p), lerp(a[1], b[1], p), Math.atan2(b[1] - a[1], b[0] - a[0])];
  };

  // Allumages : [instant, 1 = s'allume | 0 = s'éteint]
  const LIGHT = {};
  const PULSES = [];          // { id, t, color, dur, radar }
  const ALERTS = {};          // nœud qui reçoit son signal en retour (rouge)
  function schedule() {
    SIGNALS.forEach(prepSignal);
    const add = (id, t, v) => (LIGHT[id] = LIGHT[id] || []).push([t, v]);
    const pulse = (id, t, color, radar = false) => PULSES.push({ id, t, color, dur: radar ? 0.75 : 0.5, radar });
    // Ordre fréquent : les équipes formées, puis éteintes une à une par le rebond
    [['T1', 'i1'], ['T2', 'i2'], ['T3', 'i3']].forEach(([tk, sid]) => {
      add(tk, T_TEAMS[tk], 1); pulse(tk, T_TEAMS[tk], C.teal);
      const back = SIG[sid].tEnd;
      ALERTS[tk] = back;
      pulse(tk, back, C.red);
      add(tk, back + 0.12, 0);
    });
    // Ordre qui tient
    Object.entries(T_MGR).forEach(([m, t]) => { add(m, t, 1); pulse(m, t, C.blue, true); });
    add('T2', T_PILOT, 1); pulse('T2', T_PILOT, C.teal); pulse('M2', T_PILOT, C.blue);
    pulse('M2', SIG.r1.tEnd, C.green);
    add('V', SIG.r2.tEnd, 1); pulse('V', SIG.r2.tEnd, C.green);
    add('P', SIG.r3.tEnd, 1); pulse('P', SIG.r3.tEnd, C.green);
    pulse('M1', SIG.d1.tEnd, C.blue); pulse('M3', SIG.d2.tEnd, C.blue);
    add('T1', SIG.d3.tEnd, 1); pulse('T1', SIG.d3.tEnd, C.teal);
    add('T3', SIG.d5.tEnd, 1); pulse('T3', SIG.d5.tEnd, C.teal);
    pulse('V', SIG.d4.tEnd, C.violet); pulse('P', SIG.d6.tEnd, C.violet);
    pulse('M1', SIG.r4.tEnd, C.green); pulse('M3', SIG.r5.tEnd, C.green);
    // Opérateurs : suivent leur équipe, en cascade
    OPIDS.forEach(id => {
      const n = N[id];
      (LIGHT[n.team] || []).forEach(([t, v]) => add(id, t + (v ? 0.1 : 0.3) + 0.06 * n.j, v));
    });
    // Liens : s'allument derrière le premier signal reçu (ou la lumière propagée) qui les parcourt
    SIGNALS.filter(sg => sg.kind !== 'reject').forEach(sg => {
      for (let i = 0; i < sg.path.length - 1; i++) {
        const a = sg.path[i], b = sg.path[i + 1];
        const lk = S.links[key(a, b)];
        if (lk && !lk.sig) Object.assign(lk, { sig: sg, seg: i, from: a, to: b });
      }
    });
  }
  // Niveau de lumière d'un nœud ; flick = scintillement quand il s'éteint
  function level(id, s, flick = true) {
    const ev = LIGHT[id];
    if (!ev) return 0;
    let last = null;
    for (const e of ev) if (s >= e[0]) last = e;
    if (!last) return 0;
    const isOp = N[id].kind === 'op';
    if (last[1]) return easeOut(prog(s, last[0], isOp ? 0.18 : 0.24));
    const p = prog(s, last[0], isOp ? 0.22 : 0.5);
    if (!flick || isOp) return 1 - p;
    if (p >= 1) return 0;
    const steps = [0.3, 1, 0.15, 0.85, 0.08, 0.5, 0.05, 0.28];      // néon qui lâche
    return steps[Math.floor(p * steps.length)] * (1 - 0.6 * p);
  }

  function build() {
    D.template({ author: 'clement' });
    D.title('Former les managers', 'avant les équipes.');
    D.chapeau('L’ordre inverse, fréquent, fait souvent échouer les démarches Lean.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Un nœud ', 0], ['allumé', C.blue], [' travaille de la ', 0], ['nouvelle façon', C.blue], [`${NB}; éteint, de l’ancienne.`, 0]]);
    line(384, [['Un signal que personne n’est ', 0], ['prêt à recevoir', C.blue], [' ', 0], ['rebondit', C.tRed], [`${NB}: l’équipe s’éteint.`, 0]]);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // Zone pilote (fond, contour en pointillés qui se dessine)
    S.zone = el('g');
    S.zoneFill = el('rect', { x: ZONE.x, y: ZONE.y, width: ZONE.w, height: ZONE.h, rx: 28, fill: C.blue }, S.zone);
    const zx0 = ZONE.x, zy0 = ZONE.y, zx1 = ZONE.x + ZONE.w, zy1 = ZONE.y + ZONE.h, zr = 28, zc = ZONE.x + ZONE.w / 2;
    S.zoneLine = el('path', {
      d: `M ${zc} ${zy1} H ${zx0 + zr} A ${zr} ${zr} 0 0 1 ${zx0} ${zy1 - zr} V ${zy0 + zr} A ${zr} ${zr} 0 0 1 ${zx0 + zr} ${zy0} H ${zx1 - zr} A ${zr} ${zr} 0 0 1 ${zx1} ${zy0 + zr} V ${zy1 - zr} A ${zr} ${zr} 0 0 1 ${zx1 - zr} ${zy1} Z`,
      fill: 'none', stroke: C.blue, 'stroke-opacity': 0.6, 'stroke-width': 2.5, 'stroke-linecap': 'round',
    }, S.zone);

    // Nœuds (construits tôt pour connaître leur largeur ; posés au-dessus des liens)
    const linkLayer = el('g');
    const redLayer = el('g');
    const litLayer = el('g');
    const chevLayer = el('g');
    const sigLayer = el('g');
    const nodeLayer = el('g');
    CHIPS.forEach(id => buildChip(id, nodeLayer));
    const hw = Math.max(N.V.w, N.P.w);
    N.V.w = N.P.w = hw;
    CHIPS.forEach(id => layoutChip(N[id], id));
    OPIDS.forEach(id => buildOp(id, nodeLayer));

    // Liens : base grise, trace rouge (rebond), lumière (signal reçu)
    LINKS.forEach(([a, b]) => {
      const A = N[a], B = N[b];
      el('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: LINK_OFF, 'stroke-width': 3, 'stroke-linecap': 'round' }, linkLayer);
      const red = el('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: C.red, 'stroke-width': 3.5, 'stroke-dasharray': '7 7', display: 'none' }, redLayer);
      S.links[key(a, b)] = { a, b, red, len: Math.hypot(B.x - A.x, B.y - A.y) };
    });
    OPIDS.forEach(id => {
      const n = N[id], T = N[n.team];
      el('line', { x1: T.x, y1: T.y, x2: n.x, y2: n.y, stroke: LINK_OFF, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, linkLayer);
      n.lit = el('line', { x1: T.x, y1: T.y, x2: n.x, y2: n.y, stroke: C.teal, 'stroke-width': 3, 'stroke-linecap': 'round', display: 'none' }, litLayer);
    });
    schedule();
    Object.values(S.links).forEach(lk => {
      const A = N[lk.from], B = N[lk.to];
      lk.lit = el('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: C.blue, 'stroke-opacity': 0.5, 'stroke-width': 3.5, 'stroke-linecap': 'round', display: 'none' }, litLayer);
    });

    // Chevrons « 3 » : la démarche portée de proche en proche par les managers
    S.deploy = [['d1', -1], ['d2', 1]].map(([sid, dir]) => {
      const sg = SIG[sid], A = N[sg.path[0]], B = N[sg.path[1]];
      const ax = dir < 0 ? A.x0 : A.x0 + A.w, bx = dir < 0 ? B.x0 + B.w : B.x0;
      const mx = (ax + bx) / 2, y = A.y;
      const g = el('g', {}, chevLayer);
      const cx = mx + dir * 34;
      el('path', { d: `M ${cx - dir * 7} ${y - 8} L ${cx + dir * 2} ${y} L ${cx - dir * 7} ${y + 8}`, fill: 'none', stroke: C.blue, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      const badge = numBadge(D.svg, mx, y, '3');
      // instant où la lumière passe au milieu du lien
      const dm = Math.abs(mx - A.x);
      let tm = sg.t0;
      for (let k = 0; k <= 60; k++) { const tt = sg.t0 + k * sg.go[0][1] / 60; if (sigDist(sg, tt) >= dm) { tm = tt; break; } }
      return { g, badge, tm, mx, y };
    });

    // Signaux (sous les nœuds : ils sortent d'un nœud et entrent dans le suivant)
    SIGNALS.forEach(sg => {
      const g = el('g', { display: 'none' }, sigLayer);
      sg.trail = [el('circle', { r: 5.5, fill: C.yellow, opacity: 0.45 }, g), el('circle', { r: 4, fill: C.yellow, opacity: 0.22 }, g)];
      sg.dot = el('g', {}, g);
      sg.glow = el('circle', { r: 16, fill: C.yellow, 'fill-opacity': 0.3 }, sg.dot);
      sg.core = el('circle', { r: 8.5, fill: C.yellow, stroke: C.white, 'stroke-width': 3 }, sg.dot);
      sg.g = g;
      if (sg.kind === 'reject') {
        const [hx, hy] = sg.pts[sg.pts.length - 1];
        sg.burst = el('circle', { cx: f2(hx), cy: f2(hy), fill: 'none', stroke: C.red, 'stroke-width': 3, display: 'none' }, sigLayer);
      }
    });
    // le calque des nœuds passe au-dessus des signaux
    D.svg.appendChild(nodeLayer);

    // Repères d'ordre : « 1 » sur chaque manager, « 2 » sur la zone pilote
    S.ones = ['M1', 'M2', 'M3'].map(m => ({ m, g: numBadge(D.svg, N[m].x0 + 3, N[m].y0 + 3, '1') }));
    S.ask = mark(D.svg, N.M2.x0 + N.M2.w - 2, N.M2.y0 + 2, 'ask', 13);
    S.zoneLabel = el('g');
    const zl = el('rect', { y: zy1 - 17, height: 34, rx: 17, fill: C.white, stroke: C.blue, 'stroke-opacity': 0.6, 'stroke-width': 2 }, S.zoneLabel);
    const zt = text(S.zoneLabel, 0, zy1 + 6.5, 'Zone pilote', { size: 18, weight: 700, fill: C.blue });
    const zw = 14 + 26 + 8 + zt.getBBox().width + 16;
    zl.setAttribute('x', f2(zc - zw / 2));
    zl.setAttribute('width', f2(zw));
    numBadge(S.zoneLabel, zc - zw / 2 + 14 + 13, zy1, '2').querySelector('circle').setAttribute('stroke-width', 0);
    zt.setAttribute('x', f2(zc - zw / 2 + 14 + 26 + 8));
    fit(zt, zc + zw / 2 - 12, 'libellé zone pilote');

    // Bulles : en rouge, le premier ordre (les trois incidents) ; en vert, la zone pilote
    const mB = N.M1, vB = N.V, pB = N.P;
    const yLow = 836;
    S.bubbles = [
      { sid: 'i1', out: T_RED_OUT, b: bubble(D.svg, { left: XL + 46, y: yLow, side: 'left', tip: [XL + 16, yLow + 32], line1: 'Problème remonté', line2: 'reçu comme une plainte', tone: 'no', label: 'bulle plainte' }) },
      { sid: 'i2', out: T_RED_OUT, b: bubble(D.svg, { left: vB.x0 + vB.w + 34, y: 504, side: 'left', tip: [vB.x0 + vB.w + 14, 566], line1: 'Standard proposé', line2: `qui doit valider${NB}?`, tone: 'ask', label: 'bulle valider' }) },
      { sid: 'i3', out: T_RED_OUT, b: bubble(D.svg, { right: pB.x0 - 38, y: 590, side: 'right', tip: [pB.x0 - 14, 592], line1: 'Routine de 10 min', line2: 'pas prévue au planning', tone: 'no', label: 'bulle planning' }) },
      { sid: 'r1', b: bubble(D.svg, { left: ZONE.x + ZONE.w + 18, y: yLow, side: 'left', tip: [ZONE.x + ZONE.w + 4, yLow + 32], line1: 'Problème remonté', line2: 'reçu et traité', tone: 'ok', label: 'bulle reçu' }) },
      { sid: 'r2', b: bubble(D.svg, { left: vB.x0 + vB.w + 34, y: 504, side: 'left', tip: [vB.x0 + vB.w + 14, 566], line1: 'Standard proposé', line2: 'on sait qui valide', tone: 'ok', label: 'bulle validé' }) },
      { sid: 'r3', b: bubble(D.svg, { right: pB.x0 - 38, y: 590, side: 'right', tip: [pB.x0 - 14, 592], line1: 'Routine de 10 min', line2: 'prévue au planning', tone: 'ok', label: 'bulle prévue' }) },
    ];
    if (S.bubbles[0].b.x + S.bubbles[0].b.w > XC - 14) console.error('Chevauchement : bulle plainte / lien du manager 2');
    if (S.bubbles[3].b.x + S.bubbles[3].b.w > XR - 28) console.error('Chevauchement : bulle reçu / lien du manager 3');
    void mB;

    // Pastilles d'étape et compteur
    const PY = FRAME.y + 46;
    S.pills = PILLS.map(([, label, k]) => pillShape(D.svg, 92, PY, label, k === 'g' ? { bg: C.pGreen, fg: C.tGreen, icon: 'check' } : k === 'r' ? { bg: C.pRed, fg: C.tRed, icon: 'cross' } : { bg: C.blue, fg: C.white }));
    S.pills.forEach((p, i) => fit(p, 768, `pastille ${i + 1}`));

    const CX0 = 786, CW = 202;
    el('rect', { x: CX0, y: 428, width: CW, height: 58, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    el('circle', { cx: CX0 + 30, cy: 457, r: 15, fill: C.yellow, 'fill-opacity': 0.3 });
    el('circle', { cx: CX0 + 30, cy: 457, r: 8, fill: C.yellow, stroke: C.white, 'stroke-width': 2.5 });
    fit(text(D.svg, CX0 + 54, 450, 'Nœuds allumés', { size: 15, weight: 700, fill: MUTED }), CX0 + CW - 10, 'compteur libellé');
    const cp = el('clipPath', { id: 'odo' }, el('defs'));
    el('rect', { x: CX0 + 50, y: 456, width: 46, height: 26 }, cp);
    const odo = el('g', { 'clip-path': 'url(#odo)' });
    S.odoA = text(odo, CX0 + 92, 478, '', { size: 23, weight: 800, fill: C.ink, anchor: 'end' });
    S.odoB = text(odo, CX0 + 92, 478, '', { size: 23, weight: 800, fill: C.ink, anchor: 'end' });
    fit(text(D.svg, CX0 + 98, 478, `/${NB}${IDS.length}`, { size: 23, weight: 800, fill: '#b3b3cf' }), CX0 + CW - 10, 'compteur total');

    // Décalage de l'extinction finale (vague du haut vers le bas)
    IDS.forEach(id => { N[id].offDelay = 0.012 * (N[id].y - Y_HUB) / 10; });

    D.encart(['Former dans le bon ordre', 'Nos formations Lean', '(liens en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function paintChip(n, L, alert) {
    const role = ROLE[n.kind];
    const col = mix(mix(OFF_STROKE, role, L), C.red, alert);
    n.body.setAttribute('fill', mix(OFF_FILL, C.white, Math.max(L, alert)));
    n.body.setAttribute('stroke', col);
    const disc = mix(mix(OFF_DISC, role, L), C.red, alert);
    n.disc.setAttribute('fill', disc);
    n.cut.forEach(([e, attr]) => e.setAttribute(attr, disc));
    n.labels.forEach(t => t.setAttribute('fill', mix(OFF_TEXT, C.ink, Math.max(L, alert))));
    if (show(n.halo, Math.max(L, alert))) n.halo.setAttribute('fill', mix(role, C.red, alert));
  }
  function paintOp(n, L) {
    n.body.setAttribute('fill', mix(OFF_DISC, C.teal, L));
    show(n.halo, L);
  }
  function paintRings(id, s, on) {
    const n = N[id];
    let pu = null;
    if (on) for (const p of PULSES) if (p.id === id && s >= p.t && s < p.t + p.dur) pu = p;
    const ring = (r, p, w) => {
      if (!pu || p <= 0 || p >= 1) { r.setAttribute('display', 'none'); return; }
      r.removeAttribute('display');
      r.setAttribute('stroke', pu.color);
      r.setAttribute('opacity', f2(0.85 * (1 - p)));
      const off = 3 + 24 * easeOut(p);
      if (n.kind === 'op') r.setAttribute('r', f2(OP_R + off));
      else n.rect(r, off);
      r.setAttribute('stroke-width', w);
    };
    const p = pu ? (s - pu.t) / (pu.radar ? 0.5 : pu.dur) : 0;
    ring(n.ringA, p, 3);
    if (n.ringB) ring(n.ringB, pu && pu.radar ? (s - pu.t - 0.25) / 0.5 : 0, 2.5);
  }

  function draw(t) {
    const final = t < T_SEQ;                         // image finale (qui s'éteint à partir de T_OUT)
    const s = final ? END : t;
    const fade = final ? 1 - prog(t, T_OUT, 0.25) : 1;
    const switchOff = id => (final ? 1 - prog(t, T_OUT + N[id].offDelay, 0.16) : 1);

    // Nœuds
    let count = 0;
    const lv = {};
    IDS.forEach(id => {
      const n = N[id], k = switchOff(id);
      const L = level(id, s) * k;
      lv[id] = L;
      count += level(id, s, false) * k;
      const a = !final && ALERTS[id] !== undefined ? prog(s, ALERTS[id] - 0.03, 0.06) * (1 - prog(s, ALERTS[id] + 0.3, 0.3)) : 0;
      if (n.kind === 'op') paintOp(n, L); else paintChip(n, L, a);
      paintRings(id, s, !final);
    });

    // Liens d'opérateurs : allumés quand l'équipe et l'opérateur le sont
    OPIDS.forEach(id => show(N[id].lit, Math.min(lv[id], lv[N[id].team])));
    // Liens : la lumière suit le signal reçu ; trace rouge après un rebond
    Object.values(S.links).forEach(lk => {
      let p = 0;
      if (lk.sig) {
        const sg = lk.sig;
        if (s >= sg.tEnd) p = 1;
        else { const d = sigDist(sg, s); p = d === null ? 0 : clamp((d - sg.cum[lk.seg]) / lk.len); }
      }
      if (show(lk.lit, (p > 0 ? 1 : 0) * (final ? 1 - prog(t, T_OUT, 0.3) : 1))) {
        if (p >= 1) { lk.lit.removeAttribute('stroke-dasharray'); lk.lit.removeAttribute('stroke-dashoffset'); }
        else { lk.lit.setAttribute('stroke-dasharray', f2(lk.len)); lk.lit.setAttribute('stroke-dashoffset', f2(lk.len * (1 - p))); }
      }
      let r = 0;
      if (!final) SIGNALS.forEach(sg => {
        if (sg.kind !== 'reject') return;
        for (let i = 0; i < sg.path.length - 1; i++) if (key(sg.path[i], sg.path[i + 1]) === key(lk.a, lk.b)) r = Math.max(r, prog(s, sg.tHit + 0.04, 0.25));
      });
      show(lk.red, r * (1 - prog(s, T_RED_OUT, 0.2)) * 0.85);
    });

    // Signaux
    SIGNALS.forEach(sg => {
      const d = final ? null : sigDist(sg, s);
      const alive = d !== null && s < sg.tEnd + (sg.kind === 'reject' ? 0 : 0.12);
      if (!alive) { sg.g.setAttribute('display', 'none'); }
      else {
        sg.g.removeAttribute('display');
        const [x, y, ang] = sigPoint(sg, d);
        const red = sg.kind === 'reject' && s >= sg.tHit;
        const col = red ? C.red : C.yellow;
        sg.core.setAttribute('fill', col);
        sg.glow.setAttribute('fill', col);
        let k = 1, sx = 1, sy = 1;
        if (sg.kind !== 'reject' && s > sg.tEnd) k = Math.max(0.001, 1 - (s - sg.tEnd) / 0.12);
        if (red && s < sg.tHit + SQUASH) { const q = Math.sin(Math.PI * (s - sg.tHit) / SQUASH); sx = 1 - 0.4 * q; sy = 1 + 0.3 * q; }
        sg.dot.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(ang * 180 / Math.PI)}) scale(${f2(sx * k)} ${f2(sy * k)})`);
        sg.trail.forEach((c, i) => {
          const dd = sigDist(sg, s - 0.035 * (i + 1));
          if (dd === null) { c.setAttribute('display', 'none'); return; }
          c.removeAttribute('display');
          const [tx, ty] = sigPoint(sg, dd);
          c.setAttribute('cx', f2(tx)); c.setAttribute('cy', f2(ty));
          c.setAttribute('fill', col);
        });
      }
      if (sg.burst) {
        const p = final ? 1 : prog(s, sg.tHit, 0.45);
        if (show(sg.burst, p > 0 && p < 1 ? 1 - p : 0)) sg.burst.setAttribute('r', f2(8 + 30 * easeOut(p)));
      }
    });

    // « ? » au manager 2 : il ne sait pas qui doit valider
    {
      const sg = SIG.i2;
      const p = final ? 0 : prog(s, sg.tFirst, 0.3);
      const o = p * (1 - prog(s, sg.tHit + 0.35, 0.2));
      if (show(S.ask, o)) S.ask.setAttribute('transform', scaleAt(popScale(p), N.M2.x0 + N.M2.w - 2, N.M2.y0 + 2));
    }

    // Repères « 1 » (managers d'abord)
    S.ones.forEach(({ m, g }) => {
      const p = prog(s, T_MGR[m] + 0.1, 0.35);
      if (show(g, clamp(p / 0.4) * fade)) g.setAttribute('transform', scaleAt(popScale(p), N[m].x0 + 3, N[m].y0 + 3));
    });
    // Zone pilote : contour qui se dessine, fond, libellé « 2 »
    {
      const p = easeInOut(prog(s, T_ZONE, ZONE_DUR));
      const total = S.zoneLen || (S.zoneLen = S.zoneLine.getTotalLength());
      if (show(S.zone, (p > 0 ? 1 : 0) * fade)) {
        if (p >= 1) { S.zoneLine.setAttribute('stroke-dasharray', '10 8'); }
        else S.zoneLine.setAttribute('stroke-dasharray', dashReveal(total * p, total));
        const flash = prog(s, T_PILOT, 0.6);
        S.zoneFill.setAttribute('fill-opacity', f2(0.045 * p + (flash > 0 && flash < 1 ? 0.07 * Math.sin(Math.PI * flash) : 0)));
      }
      const pl = prog(s, T_ZONE + ZONE_DUR - 0.05, 0.35);
      if (show(S.zoneLabel, clamp(pl / 0.4) * fade)) S.zoneLabel.setAttribute('transform', scaleAt(popScale(pl), ZONE.x + ZONE.w / 2, ZONE.y + ZONE.h));
    }
    // Déploiement : chevrons et « 3 » quand la lumière passe
    S.deploy.forEach(dp => {
      const p = prog(s, dp.tm, 0.3);
      show(dp.g, clamp(p / 0.3) * fade);
      if (show(dp.badge, clamp(p / 0.4) * fade)) dp.badge.setAttribute('transform', scaleAt(popScale(p), dp.mx, dp.y));
    });

    // Bulles
    S.bubbles.forEach(({ sid, out, b }) => {
      const sg = SIG[sid];
      const tIn = sg.kind === 'reject' ? sg.tHit + 0.05 : sg.tEnd;
      const p = prog(s, tIn, 0.4);
      const o = clamp(p / 0.35) * (out ? 1 - prog(s, out, 0.18) : 1) * fade;
      if (show(b.g, o)) b.g.setAttribute('transform', scaleAt(popScale(p), b.tip[0], b.tip[1]));
    });

    // Compteur : les nœuds allumés, chiffres qui roulent
    {
      const v = Math.round(count * 100) / 100;
      const a = Math.floor(v + 1e-6), fr = clamp((v - a - 0.3) / 0.4);   // roule vite, ne reste pas entre deux chiffres
      S.odoA.textContent = String(a);
      S.odoA.setAttribute('transform', fr > 0.001 ? `translate(0 ${f2(-26 * easeInOut(fr))})` : '');
      if (fr > 0.001) {
        S.odoB.removeAttribute('display');
        S.odoB.textContent = String(a + 1);
        S.odoB.setAttribute('transform', `translate(0 ${f2(26 * (1 - easeInOut(fr)))})`);
      } else S.odoB.setAttribute('display', 'none');
      S.odoA.setAttribute('fill', a + (fr > 0.5 ? 1 : 0) >= IDS.length ? C.tGreen : C.ink);
    }

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = PILLS[i][0] + 0.12;
      const b = i + 1 < PILLS.length ? PILLS[i + 1][0] : Infinity;
      const last = i === PILLS.length - 1;
      const o = final ? (last ? 1 - prog(t, T_OUT, 0.14) : 0) : prog(t, a, 0.25) * (1 - prog(t, b, 0.14));
      const dy = final ? 0 : 8 * (1 - prog(t, a, 0.25));
      if (show(g, o)) g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
