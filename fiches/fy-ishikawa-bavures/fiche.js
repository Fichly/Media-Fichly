// Fiche LinkedIn · page Fichly · jeudi 22 octobre 2026 (Buffer 6abe5d480a3759a258b327b5)
// Post : « Un diagramme d'Ishikawa vide, tout le monde sait le dessiner. Le remplir correctement, c'est plus délicat. »
// « La fiche montre ce diagramme rempli, avec les causes retenues pour vérification. »
// Premier commentaire du post (Buffer) : article 5 Pourquoi → encart.
// Le visuel EST la fiche : l'Ishikawa des bavures sur pièces injectées, rempli (six arêtes, les causes du post),
// les causes retenues entourées « à vérifier », et les trois règles en pied.
// Style propre : le paperboard au feutre. La feuille pleine se rabat, une feuille blanche ; un feutre dessine
// la tête du poisson, trace l'arête centrale puis les six arêtes ; un second feutre le rejoint et les causes
// s'écrivent (les causes vagues sont barrées puis réécrites en causes vérifiables) ; un feutre rouge entoure
// à main levée les causes à vérifier. Les règles se cochent quand elles s'appliquent.
// Image t = 0 = fiche complète. Boucle exacte de 12,5 s.
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
  const sine = p => 0.5 - 0.5 * Math.cos(Math.PI * p);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const show = (n, on) => n.setAttribute('display', on ? 'inline' : 'none');
  const NB = ' ';
  const MUTED = '#7b7ba6', CARD_LINE = '#dcdcec', BAND = '#f4f4f9', UNCHECK = '#c4c4dc', CLAMP = '#d4d4e6';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 748 };          // bas : 1158
  const SHEET = { y0: 482, y1: 966 };                         // la feuille du paperboard (ce qui se rabat)
  const SP = 730, HB = 200, SL = 56;                          // arête centrale, hauteur et inclinaison des arêtes
  const XA = [338, 594, 846];                                 // points d'attache sur l'arête centrale
  const HEAD = { x: 864, r: 1002, y0: SP - 64, y1: SP + 64 };
  const LEFT = 84, LH = 21, EV_LH = 20;
  const boneX = (k, y) => XA[k] - SL * Math.abs(SP - y) / HB;
  const PILL_Y = 451;

  // ---------- Contenu (le post) ----------
  const CATS = [
    { n: 1, name: 'Matière', top: true, k: 0 },
    { n: 2, name: 'Machine', top: true, k: 1 },
    { n: 3, name: 'Méthode', top: true, k: 2 },
    { n: 4, name: 'Main-d’œuvre', top: false, k: 0 },
    { n: 5, name: 'Milieu', top: false, k: 1 },
    { n: 6, name: 'Mesure', top: false, k: 2 },
  ];
  // y : ligne de base de la première ligne. vague : la cause « famille » écrite d'abord, puis barrée (règle 1).
  const BLOCKS = [
    { id: 'mat1', cat: 0, y: 572, lines: ['Changement de lot', 'fournisseur'] },
    { id: 'mat2', cat: 0, y: 652, lines: ['Granulés', 'insuffisamment séchés'] },
    { id: 'mac1', cat: 1, y: 569, lines: ['Usure du plan de joint', 'du moule'], circled: true, vague: 'problème moule' },
    { id: 'mac2', cat: 1, y: 650, lines: ['Force de fermeture', 'insuffisante'] },
    { id: 'met1', cat: 2, y: 569, lines: ['Paramètres d’injection', 'retouchés sans trace'], circled: true },
    { id: 'met2', cat: 2, y: 645, lines: ['Pas de réglage de', 'référence après un', 'changement de moule'] },
    { id: 'mo1', cat: 3, y: 772, lines: ['Régleurs récemment', 'arrivés, pas encore', 'formés sur ce moule'] },
    { id: 'mo2', cat: 3, y: 862, lines: ['Réglages différents', 'selon les équipes'], vague: 'erreur opérateur' },
    { id: 'mil', cat: 4, y: 790, lines: ['Température de l’atelier', 'qui varie entre', 'le jour et la nuit'] },
    { id: 'mes', cat: 5, y: 778, lines: ['Critère d’acceptation', `d’une bavure non défini${NB}:`], evidence: ['deux contrôleurs', 'ne rebutent pas', 'les mêmes pièces'], circled: true },
  ];
  const PEN_A_BLOCKS = ['mac1', 'mat1', 'mat2', 'mac2', 'met1', 'met2'];
  const PEN_B_BLOCKS = ['mo1', 'mo2', 'mil', 'mes'];
  const CIRCLE_ORDER = ['mac1', 'met1', 'mes'];

  const RULES = [
    { y: [1033, 1054], parts: [[['Écrire des causes vérifiables, pas des familles', 1], [`${NB}: «${NB}usure du plan de joint${NB}»`, 0]], [[`plutôt que «${NB}problème moule${NB}».`, 0]]] },
    { y: [1084], parts: [[['Le remplir à plusieurs', 1], [', avec ceux qui règlent et contrôlent la machine.', 0]]] },
    { y: [1114, 1135], parts: [[['Entourer ensuite les causes à vérifier en premier.', 1], [` Le diagramme liste les possibles${NB};`, 0]], [['il ne désigne pas le coupable.', 0]]] },
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.2, T_NEW = 1.55;          // la feuille pleine se rabat, une feuille blanche
  const W_SPEED = 1400, L_SPEED = 1400, H_SPEED = 1000, RET = 0.035;
  const TRAVEL = 3400, TRAVEL0 = 0.045;

  const S = { writes: [], strokes: [], vagues: [], blocks: {}, pens: [] };
  let clipN = 0;

  // ---------- Éléments dessinés : écriture (révélée par un masque) et tracés (stroke-dashoffset) ----------
  function clipLine(node, yPen, size, pad = 4) {
    const b = node.getBBox();
    const id = `w${clipN++}`;
    const cp = el('clipPath', { id }, S.defs);
    const r = el('rect', { x: f2(b.x - pad), y: f2(b.y - pad), width: 0, height: f2(b.height + 2 * pad) }, cp);
    node.setAttribute('clip-path', `url(#${id})`);
    return { node, r, x0: b.x - pad, w: b.width + 2 * pad, y: yPen, size };
  }
  function writeItem(lines) {
    const it = { kind: 'write', lines };
    S.writes.push(it);
    return it;
  }
  function writeText(parent, x, y, str, opts) {
    const n = text(parent, x, y, str, opts);
    return clipLine(n, y - opts.size * 0.32, opts.size);
  }
  function strokeItem(parent, d, color, width) {
    const node = el('path', { d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
    const it = { kind: 'stroke', node, len: node.getTotalLength() };
    S.strokes.push(it);
    return it;
  }
  const pt = (it, p) => { const q = it.node.getPointAtLength(it.len * p); return [q.x, q.y]; };

  // Boucle à main levée autour d'une cause (l'extrémité dépasse le départ, comme au feutre)
  function loopPath(cx, cy, rx, ry, seed) {
    const N = 90, a0 = Math.PI * (1.02 + 0.06 * seed), sweep = Math.PI * 2 * 1.08;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N, a = a0 + sweep * u;
      const k = 1 + 0.03 * Math.sin(3 * a + seed * 2.1) + 0.055 * u;
      pts.push(`${f2(cx + rx * k * Math.cos(a))} ${f2(cy + ry * k * Math.sin(a))}`);
    }
    return { d: `M ${pts.join(' L ')}`, a0, sweep };
  }

  // ---------- Feutres ----------
  function makePen(body, cap, nib) {
    const g = el('g', { display: 'none' }, S.penLayer);
    const r = el('g', {}, g);
    el('path', { d: 'M 0 0 L -4.5 -12 L 4.5 -12 Z', fill: nib, stroke: nib, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, r);
    el('rect', { x: -7.5, y: -25, width: 15, height: 14, rx: 2.5, fill: '#e4e4ef' }, r);
    el('rect', { x: -11.5, y: -112, width: 23, height: 89, rx: 7, fill: body }, r);
    el('rect', { x: -11.5, y: -82, width: 23, height: 26, fill: C.white, opacity: 0.9 }, r);
    el('rect', { x: -6, y: -73, width: 12, height: 3.5, rx: 1.75, fill: body }, r);
    el('rect', { x: -6, y: -66, width: 8, height: 3.5, rx: 1.75, fill: body, opacity: 0.55 }, r);
    el('rect', { x: -13, y: -122, width: 26, height: 20, rx: 8, fill: cap }, r);
    const pen = { g, r, sessions: [] };
    S.pens.push(pen);
    return pen;
  }

  // Planification d'un feutre : déplacements (feutre levé) entre les actions, puis sortie
  const startOf = a => (a.kind === 'stroke' ? pt(a.item, 0) : [a.item.lines[0].x0, a.item.lines[0].y]);
  const endOf = a => {
    if (a.kind === 'stroke') return pt(a.item, 1);
    const l = a.item.lines[a.item.lines.length - 1];
    return [l.x0 + l.w, l.y];
  };
  function plan(pen, t0, from, actions, exit) {
    const segs = [];
    let t = t0, pos = from;
    const travelTo = to => {
      const d = Math.hypot(to[0] - pos[0], to[1] - pos[1]);
      if (d < 0.5) return;
      const dur = TRAVEL0 + d / TRAVEL;
      segs.push({ kind: 'travel', t0: t, t1: t + dur, a: pos, b: to, d });
      t += dur; pos = to;
    };
    for (const a of actions) {
      if (a.kind === 'wait') { segs.push({ kind: 'hover', t0: t, t1: t + a.dur, at: pos }); t += a.dur; continue; }
      travelTo(startOf(a));
      const nb = typeof a.notBefore === 'function' ? a.notBefore() : a.notBefore;
      if (nb && nb > t) { segs.push({ kind: 'hover', t0: t, t1: nb, at: pos }); t = nb; }
      a.t0 = t;
      if (a.kind === 'stroke') t += a.dur;
      else {
        a.lineT = a.item.lines.map((ln, i) => {
          if (i) t += RET;
          const d = Math.max(0.05, ln.w / a.speed);
          const span = [t, t + d];
          t += d;
          return span;
        });
      }
      a.t1 = t;
      a.item.act = a;
      segs.push({ kind: 'act', t0: a.t0, t1: a.t1, act: a });
      pos = endOf(a);
    }
    travelTo(exit);
    pen.sessions.push({ segs, tIn: t0, tOut: t });
    if (window.__DBG) console.log(segs.map(sg => `${sg.kind[0]}${sg.act ? (sg.act.kind[0]) : ''} ${sg.t0.toFixed(2)}-${sg.t1.toFixed(2)}`).join(' | '));
    return t;
  }
  function penPose(pen, t) {
    for (const ss of pen.sessions) {
      if (t < ss.tIn || t >= ss.tOut) continue;
      const s = ss.segs.find(sg => t >= sg.t0 && t < sg.t1) || ss.segs[ss.segs.length - 1];
      const u = clamp((t - s.t0) / Math.max(1e-6, s.t1 - s.t0));
      if (s.kind === 'travel') {
        const e = easeInOut(u);
        const arc = Math.min(34, s.d * 0.16) * Math.sin(Math.PI * u);
        return { x: lerp(s.a[0], s.b[0], e), y: lerp(s.a[1], s.b[1], e) - arc, lift: clamp(Math.min(u, 1 - u) * 6) };
      }
      if (s.kind === 'hover') return { x: s.at[0], y: s.at[1] - 8 * clamp(Math.min(u, 1 - u) * 6), lift: 0.5 * clamp(Math.min(u, 1 - u) * 6) };
      const a = s.act;
      if (a.kind === 'stroke') { const [x, y] = pt(a.item, sine(u)); return { x, y, lift: 0 }; }
      // Écriture : la pointe suit le bord du masque, avec le petit va-et-vient de la main
      const lines = a.item.lines;
      for (let i = 0; i < lines.length; i++) {
        const [s0, s1] = a.lineT[i];
        const ln = lines[i];
        if (t < s1 || i === lines.length - 1) {
          if (t < s0 && i > 0) {
            const pl = lines[i - 1], q = easeInOut(prog(t, a.lineT[i - 1][1], s0 - a.lineT[i - 1][1]));
            return { x: lerp(pl.x0 + pl.w, ln.x0, q), y: lerp(pl.y, ln.y, q) - 6 * Math.sin(Math.PI * q), lift: 0.25 * Math.sin(Math.PI * q) };
          }
          const q = prog(t, s0, s1 - s0);
          return { x: ln.x0 + ln.w * q, y: ln.y + 2.4 * Math.sin(t * Math.PI * 2 * 12.5), lift: 0 };
        }
      }
    }
    return null;
  }

  // ---------- Petits éléments ----------
  function pillShape(parent, x, cy, label, { bg, fg, icon = null, size = 20, h = 40 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon === 'check') {
      el('circle', { cx: x + 31, cy, r: 11.5, fill: C.green }, g);
      el('path', { d: `M ${x + 25.5} ${cy + 0.5} L ${x + 29.5} ${cy + 4.5} L ${x + 36.5} ${cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return g;
  }
  function checkIcon(parent, x, cy) {
    const g = el('g', {}, parent);
    el('rect', { x: x - 12, y: cy - 12, width: 24, height: 24, rx: 6, fill: C.green }, g);
    el('path', { d: `M ${x - 6} ${cy + 0.5} L ${x - 1.5} ${cy + 5} L ${x + 6.5} ${cy - 4.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function rich(parent, x, y, parts, size) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': 500, fill: C.ink }, parent);
    parts.forEach(([str, bold]) => { const sp = el('tspan', bold ? { 'font-weight': 700, fill: bold === 'r' ? C.tRed : C.blue } : {}, t); sp.textContent = str; });
    return t;
  }

  // ---------- Construction ----------
  function build() {
    D.template({ author: null });
    D.title('Remplir un Ishikawa,', 'correctement.', 1020);
    D.chapeau(`Exemple type${NB}: des bavures sur des pièces plastiques injectées.`);

    // Explication courte au-dessus du visuel : comment le lire
    fit(rich(D.svg, 62, 352, [['Le ', 0], ['problème', 1], [' en tête du poisson, les ', 0], ['causes possibles', 1], [' rangées sur six arêtes.', 0]], 22), 1020, 'explication 1');
    fit(rich(D.svg, 62, 384, [['Les causes ', 0], ['entourées en rouge', 'r'], [' sont celles ', 0], ['à vérifier en premier', 1], [' sur le terrain.', 0]], 22), 1020, 'explication 2');

    S.defs = el('defs');
    const fDown = el('filter', { id: 'penDown', x: '-60%', y: '-30%', width: '220%', height: '160%' }, S.defs);
    el('feDropShadow', { dx: 3, dy: 4, stdDeviation: 2.5, 'flood-color': C.ink, 'flood-opacity': 0.22 }, fDown);
    const fUp = el('filter', { id: 'penUp', x: '-60%', y: '-30%', width: '240%', height: '170%' }, S.defs);
    el('feDropShadow', { dx: 9, dy: 15, stdDeviation: 6, 'flood-color': C.ink, 'flood-opacity': 0.2 }, fUp);
    const cpSheet = el('clipPath', { id: 'sheet' }, S.defs);
    el('rect', { x: FRAME.x, y: SHEET.y0 - 6, width: FRAME.w, height: SHEET.y1 - SHEET.y0 + 6 }, cpSheet);

    // ----- Le paperboard : un seul cadre, la feuille en haut, les règles en pied -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: C.card, stroke: C.line, 'stroke-width': 2 });
    el('rect', { x: 430, y: 401, width: 220, height: 18, rx: 9, fill: CLAMP });
    [470, 610].forEach(x => el('circle', { cx: x, cy: 410, r: 3.5, fill: C.white }));

    const outer = el('g', { 'clip-path': 'url(#sheet)' });
    S.sheet = el('g', {}, outer);
    const sheet = S.sheet;
    S.fold = el('rect', { x: FRAME.x, y: SHEET.y0, width: FRAME.w, height: SHEET.y1 - SHEET.y0, fill: C.ink, opacity: 0 }, sheet);

    // Tête du poisson
    S.headFill = el('path', { d: `M ${HEAD.x} ${HEAD.y0} H ${HEAD.r - 40} A 40 40 0 0 1 ${HEAD.r} ${HEAD.y0 + 40} V ${HEAD.y1 - 40} A 40 40 0 0 1 ${HEAD.r - 40} ${HEAD.y1} H ${HEAD.x} Z`, fill: C.pLav }, sheet);
    S.head = strokeItem(sheet, `M ${HEAD.x + 2} ${HEAD.y0} H ${HEAD.r - 40} A 40 40 0 0 1 ${HEAD.r} ${HEAD.y0 + 40} V ${HEAD.y1 - 40} A 40 40 0 0 1 ${HEAD.r - 40} ${HEAD.y1} H ${HEAD.x} L ${HEAD.x - 1} ${HEAD.y0 - 5}`, C.blue, 4);
    const hcx = (HEAD.x + HEAD.r) / 2 - 1;
    S.headText = writeItem(['Bavures', 'sur pièces', 'injectées'].map((s, i) => {
      const ln = writeText(sheet, hcx, SP - 19.5 + i * 27, s, { size: 21, weight: 800, fill: C.blue, anchor: 'middle' });
      fit(ln.node, HEAD.r - 12, `tête ligne ${i + 1}`, HEAD.x + 6);
      return ln;
    }));

    // Arête centrale (et la queue du poisson)
    S.spine = strokeItem(sheet, `M ${HEAD.x} ${SP} Q 480 ${SP - 3} 94 ${SP}`, C.blue, 5);
    S.tail = strokeItem(sheet, `M 74 ${SP - 20} L 94 ${SP} L 74 ${SP + 20}`, C.blue, 4);

    // Six arêtes et leurs familles
    S.cats = CATS.map((c, i) => {
      const ex = XA[c.k] - SL, ey = c.top ? SP - HB : SP + HB;
      const bone = strokeItem(sheet, `M ${ex} ${ey} Q ${f2((ex + XA[c.k]) / 2 + (c.top ? 3 : -3))} ${f2((ey + SP) / 2)} ${XA[c.k]} ${SP}`, C.blue, 3.4);
      const ly = c.top ? SP - HB - 10 : SP + HB + 28;
      const g = el('g', {}, sheet);
      const name = text(g, 0, ly, c.name, { size: 20, weight: 800, fill: C.blue });
      const w = 24 + 8 + name.getBBox().width;
      const x0 = ex - w / 2;
      el('circle', { cx: x0 + 12, cy: ly - 7, r: 12, fill: C.blue }, g);
      text(g, x0 + 12, ly - 1.6, String(c.n), { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
      name.setAttribute('x', f2(x0 + 32));
      fit(g, FRAME.x + FRAME.w - 16, `famille ${c.n}`, LEFT - 4);
      const label = writeItem([clipLine(g, ly - 7, 20, 3)]);
      return { ...c, bone, label };
    });

    // Causes
    BLOCKS.forEach(b => {
      const cat = CATS[b.cat], k = cat.k;
      const last = b.y + (b.lines.length - 1) * LH;
      b.subY = last + 9;
      b.top = b.y - 13;
      b.evY = b.subY + 34;
      b.bottom = b.evidence ? b.evY + (b.evidence.length - 1) * EV_LH + 5 : b.subY + 2;
      const nearS = cat.top ? b.bottom : b.top, farS = cat.top ? b.top : b.bottom;
      b.left = k === 0 ? LEFT : boneX(k - 1, nearS) + 10;
      b.right = boneX(k, farS) - 8;
      const g = el('g', {}, sheet);
      // borne droite ligne par ligne : l'arête est plus à droite près de l'arête centrale
      const rightAt = (yTop, yBot) => boneX(k, cat.top ? yTop : yBot) - 8;
      b.write = writeItem(b.lines.map((s, i) => {
        const yl = b.y + i * LH;
        const ln = writeText(g, f2(b.left), yl, s, { size: 17, weight: 500, fill: C.ink });
        fit(ln.node, rightAt(yl - 13, yl + 5), `cause ${b.id} ligne ${i + 1}`, b.left - 0.5);
        return ln;
      }));
      const bx = boneX(k, b.subY);
      b.sub = strokeItem(sheet, `M ${f2(bx)} ${f2(b.subY)} Q ${f2((bx + b.left) / 2)} ${f2(b.subY + 1.5)} ${f2(b.left - 4)} ${f2(b.subY + 0.5)}`, C.blue, 2.6);
      if (b.evidence) {
        b.ev = writeItem(b.evidence.map((s, i) => {
          const yl = b.evY + i * EV_LH;
          const ln = writeText(g, f2(b.left), yl, s, { size: 16, weight: 500, fill: MUTED });
          fit(ln.node, rightAt(yl - 12, yl + 5), `fait ${b.id} ligne ${i + 1}`, b.left - 0.5);
          return ln;
        }));
      }
      if (b.vague) {
        const vg = el('g', {}, sheet);
        const vl = writeText(vg, f2(b.left), b.y, b.vague, { size: 17, weight: 500, fill: C.ink });
        const x1 = vl.x0 + vl.w;
        const ys = b.y - 6;
        const strike = strokeItem(vg, `M ${f2(vl.x0 - 3)} ${f2(ys + 1.5)} Q ${f2((vl.x0 + x1) / 2)} ${f2(ys - 3)} ${f2(x1 + 3)} ${f2(ys - 0.5)}`, C.red, 3.4);
        b.vg = { g: vg, write: writeItem([vl]), strike };
        S.vagues.push(b.vg);
      }
      S.blocks[b.id] = b;
    });

    // Causes entourées et étiquettes « À vérifier »
    S.circles = CIRCLE_ORDER.map((id, i) => {
      const b = S.blocks[id];
      const xs = b.write.lines.map(l => l.x0 + l.w - 4);
      const x0 = b.left, x1 = Math.max(...xs);
      const y0 = b.top, y1 = b.y + (b.lines.length - 1) * LH + 5;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2 + 20, ry = (y1 - y0) / 2 + 17;
      const lp = loopPath(cx, cy, rx, ry, i);
      const loop = strokeItem(sheet, lp.d, C.red, 3.6);
      // étiquette posée sur le haut de la boucle
      const a = Math.PI * 1.5, u = (a - lp.a0) / lp.sweep, kk = 1 + 0.03 * Math.sin(3 * a + i * 2.1) + 0.055 * u;
      const ty = cy - ry * kk;
      const tag = el('g', {}, sheet);
      const tr = el('rect', { y: f2(ty - 12), height: 24, rx: 12, fill: C.pRed, stroke: C.red, 'stroke-width': 2 }, tag);
      const tt = text(tag, cx, ty + 5.4, 'À vérifier', { size: 15, weight: 700, fill: C.tRed, anchor: 'middle' });
      const tb = tt.getBBox();
      tr.setAttribute('x', f2(tb.x - 12));
      tr.setAttribute('width', f2(tb.width + 24));
      fit(tag, boneX(CATS[b.cat].k, ty) - 2, `étiquette ${id}`, CATS[b.cat].k ? boneX(CATS[b.cat].k - 1, ty) + 2 : LEFT);
      return { id, loop, tag, cx, cy: ty };
    });

    // ----- Compteur (en haut à droite du cadre) -----
    const cg = el('g');
    const box = el('rect', { x: 0, y: PILL_Y - 23, height: 46, rx: 14, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, cg);
    const cpNum = el('clipPath', { id: 'numClip' }, S.defs);
    const numRect = el('rect', { x: 0, y: PILL_Y - 21, width: 10, height: 42 }, cpNum);
    const nums = el('g', { 'clip-path': 'url(#numClip)' }, cg);
    let x = 18;
    const w10 = (() => { const m = text(cg, 0, 0, '10', { size: 24, weight: 800 }); const w = m.getBBox().width; m.remove(); return w; })();
    const mkNum = (xr, fill) => [0, 1].map(() => text(nums, xr, PILL_Y + 8.5, '', { size: 24, weight: 800, fill, anchor: 'end' }));
    S.n1 = mkNum(x + w10, C.ink);
    x += w10 + 8;
    const l1 = text(cg, x, PILL_Y + 6, 'causes possibles', { size: 15, weight: 700, fill: MUTED });
    x += l1.getBBox().width + 16;
    el('line', { x1: x, y1: PILL_Y - 13, x2: x, y2: PILL_Y + 13, stroke: CARD_LINE, 'stroke-width': 2 }, cg);
    x += 16;
    el('path', { d: loopPath(x + 14, PILL_Y, 13, 9, 1).d, fill: 'none', stroke: C.red, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, cg);
    x += 34;
    const w3 = (() => { const m = text(cg, 0, 0, '3', { size: 24, weight: 800 }); const w = m.getBBox().width; m.remove(); return w; })();
    S.n2 = mkNum(x + w3, C.tRed);
    x += w3 + 8;
    const l2 = text(cg, x, PILL_Y + 6, 'à vérifier', { size: 15, weight: 700, fill: C.tRed });
    x += l2.getBBox().width + 18;
    box.setAttribute('width', f2(x));
    numRect.setAttribute('width', f2(x));
    const boxX = FRAME.x + FRAME.w - 20 - x;
    cg.setAttribute('transform', `translate(${f2(boxX)} 0)`);
    S.counterLeft = boxX;

    // ----- Les trois règles, en pied -----
    const RB = { x: 78, y: 970, w: 924, h: 178 };
    el('rect', { x: RB.x, y: RB.y, width: RB.w, height: RB.h, rx: 18, fill: BAND });
    fit(text(D.svg, 102, 1000, 'Trois règles pour qu’il serve à quelque chose', { size: 18, weight: 800, fill: C.blue }), 990, 'règles titre');
    S.rules = RULES.map((r, i) => {
      const y0 = r.y[0], y1 = r.y[r.y.length - 1];
      const hl = el('rect', { x: 88, y: y0 - 21, width: 904, height: y1 - y0 + 29, rx: 10, fill: C.pGreen, opacity: 0 });
      el('rect', { x: 102, y: y0 - 18, width: 22, height: 22, rx: 6, fill: C.white, stroke: UNCHECK, 'stroke-width': 2 });
      const ic = checkIcon(D.svg, 113, y0 - 7);
      r.parts.forEach((p, j) => fit(rich(D.svg, 140, r.y[j], p, 17), 992, `règle ${i + 1} ligne ${j + 1}`));
      return { hl, ic, cy: y0 - 7 };
    });

    // ----- Feutres : sous les pastilles et le compteur, au-dessus de la feuille et des règles -----
    S.penLayer = el('g');
    D.svg.appendChild(cg);

    // ----- Pastilles d'étape -----
    const PILLS = [
      [`1${NB}·${NB}Le problème, en tête du poisson`, C.blue, C.white],
      [`2${NB}·${NB}Six arêtes pour ranger les causes`, C.blue, C.white],
      [`3${NB}·${NB}Des causes vérifiables, pas des familles`, C.blue, C.white],
      [`4${NB}·${NB}Entourer celles à vérifier en premier`, C.blue, C.white],
      ['Rempli, causes retenues pour vérification', C.pGreen, C.tGreen, 'check'],
    ];
    S.pills = PILLS.map(([label, bg, fg, icon], i) => {
      const p = pillShape(D.svg, 92, PILL_Y, label, { bg, fg, icon });
      fit(p, S.counterLeft - 16, `pastille ${i + 1}`);
      return p;
    });

    // ----- Feutres -----
    const penA = makePen(C.blue, '#34347c', C.ink);
    const penB = makePen(C.violet, '#7d4f86', C.ink);
    const penR = makePen(C.red, C.tRed, C.tRed);

    // ----- Planification -----
    const W = (item, speed = W_SPEED, notBefore) => ({ kind: 'write', item, speed, notBefore });
    const K = (item, dur, notBefore) => ({ kind: 'stroke', item, dur, notBefore });
    const causeActs = (b, extra = {}) => {
      const acts = [];
      if (b.vague) {
        acts.push(W(b.vg.write, W_SPEED, extra.notBefore));
        acts.push({ kind: 'wait', dur: 0.12 });
        acts.push(K(b.vg.strike, 0.15));
        acts.push({ kind: 'wait', dur: 0.06 });
        acts.push(W(b.write, W_SPEED, () => b.vg.strike.act.t1 + 0.27));
      } else acts.push(W(b.write, W_SPEED, extra.notBefore));
      acts.push(K(b.sub, 0.07));
      if (b.ev) acts.push(W(b.ev, W_SPEED));
      return acts;
    };

    // Feutre A : tête, arête centrale, arêtes du haut, puis les causes du haut
    const actsA = [K(S.head, 0.44), W(S.headText, H_SPEED), K(S.spine, 0.32), K(S.tail, 0.1)];
    S.cats.filter(c => c.top).forEach(c => actsA.push(W(c.label, L_SPEED), K(c.bone, 0.13)));
    const firstA = PEN_A_BLOCKS.map(id => S.blocks[id]);
    firstA.forEach(b => actsA.push(...causeActs(b)));
    const endA = plan(penA, T_NEW, [1130, 600], actsA, [1130, 560]);

    // Feutre B : arrive pour les arêtes du bas (une à une, après celles du haut), puis les causes du bas
    const actsB = [];
    S.cats.filter(c => !c.top).forEach((c, i) => actsB.push(W(c.label, L_SPEED, () => S.cats[i].bone.act.t1 + 0.04), K(c.bone, 0.13)));
    const firstVague = S.blocks[PEN_A_BLOCKS[0]].vg;
    PEN_B_BLOCKS.map(id => S.blocks[id]).forEach((b, i) => actsB.push(...causeActs(b, i === 0 ? { notBefore: () => firstVague.strike.act.t1 + 0.12 } : {})));
    const endB = plan(penB, S.cats[0].bone.act.t0 - 0.2, [-90, 860], actsB, [1130, 1060]);

    // Feutre rouge : entoure les causes à vérifier
    const actsR = S.circles.map((c, i) => K(c.loop, 0.5, i === 0 ? Math.max(endA, endB) - 0.2 : undefined));
    const endR = plan(penR, Math.max(endA, endB) - 0.45, [1130, 520], actsR, [1130, 470]);
    S.circles.forEach(c => { c.tPop = c.loop.act.t1 + 0.02; });

    // Repères de la chronologie
    const firstCause = Math.min(S.blocks[PEN_A_BLOCKS[0]].vg.write.act.t0, S.blocks[PEN_B_BLOCKS[0]].write.act.t0);
    S.T_PILL = [T_NEW - 0.1, S.spine.act.t0 - 0.12, firstCause - 0.1, Math.max(S.circles[0].loop.act.t0 - 0.25, S.blocks.mes.ev.act.t1), S.circles[2].tPop + 0.4];
    S.T_RULE = [firstVague.strike.act.t1 + 0.05, S.blocks[PEN_B_BLOCKS[0]].write.act.t1, S.circles[2].tPop + 0.15];
    // Compteurs : une cause de plus à chaque cause écrite, une « à vérifier » de plus à chaque étiquette
    S.causeTimes = BLOCKS.map(b => b.write.act.t1).sort((a, b) => a - b);
    S.tagTimes = S.circles.map(c => c.tPop);
    S.endR = endR;
    if (window.__DBG) BLOCKS.forEach(b => console.log(b.id, b.vg ? `vague ${b.vg.write.act.t0.toFixed(2)} strike ${b.vg.strike.act.t0.toFixed(2)}-${b.vg.strike.act.t1.toFixed(2)}` : '', `write ${b.write.act.t0.toFixed(2)}-${b.write.act.t1.toFixed(2)}`)), console.log('pills', S.T_PILL.map(x => x.toFixed(2)).join(' '), 'rules', S.T_RULE.map(x => x.toFixed(2)).join(' '), 'circles', S.circles.map(c => c.loop.act.t0.toFixed(2)).join(' '));
    console.log(`Feutre A : ${T_NEW.toFixed(2)} → ${endA.toFixed(2)} s · B → ${endB.toFixed(2)} s · rouge → ${endR.toFixed(2)} s · pastille finale ${S.T_PILL[4].toFixed(2)} s`);
    if (S.T_PILL[4] > DURATION - 0.9 || endR > DURATION - 0.3) console.error(`Chronologie trop longue (fin ${endR.toFixed(2)} s)`);

    D.encart(['Creuser la cause', 'Notre article 5 Pourquoi', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function setWrite(it, t, final) {
    it.lines.forEach((ln, i) => {
      let q = 1;
      if (!final) { const [s0, s1] = it.act.lineT[i]; q = prog(t, s0, s1 - s0); }
      show(ln.node, q > 0);
      if (q > 0) ln.r.setAttribute('width', f2(ln.w * q + 0.01));
    });
  }
  function setStroke(it, t, final) {
    const p = final ? 1 : sine(prog(t, it.act.t0, it.act.t1 - it.act.t0));
    show(it.node, p > 0);
    if (p <= 0) return;
    if (p >= 1) { it.node.removeAttribute('stroke-dasharray'); it.node.removeAttribute('stroke-dashoffset'); }
    else { it.node.setAttribute('stroke-dasharray', f2(it.len + 2)); it.node.setAttribute('stroke-dashoffset', f2((it.len + 2) * (1 - p))); }
  }
  // Compteur qui roule : l'ancien chiffre monte et sort, le nouveau entre par le bas
  function setCounter(nodes, t, final, times, total) {
    let v, prev, tc = -1;
    if (final) { v = total; prev = total; }
    else {
      v = times.filter(x => x <= t).length;
      prev = Math.max(0, v - 1);
      tc = v ? times[v - 1] : T_NEW;
      if (!v) prev = total;
    }
    const p = tc < 0 ? 1 : easeOut(prog(t, tc, 0.22));
    const [cur, old] = nodes;
    cur.textContent = String(v);
    cur.setAttribute('transform', p < 1 ? `translate(0 ${f2(20 * (1 - p))})` : '');
    cur.setAttribute('opacity', f2(p));
    show(old, p < 1);
    old.textContent = String(prev);
    old.setAttribute('transform', `translate(0 ${f2(-20 * p)})`);
    old.setAttribute('opacity', f2(1 - p));
  }

  function draw(t) {
    const final = t < T_NEW;

    // La feuille pleine se rabat vers le haut du paperboard
    if (final && t >= T_OUT) {
      const p = easeIn(prog(t, T_OUT, T_NEW - T_OUT - 0.03));
      const k = Math.max(0.001, 1 - p);
      S.sheet.setAttribute('transform', `translate(0 ${SHEET.y0}) scale(1 ${k.toFixed(4)}) translate(0 ${-SHEET.y0})`);
      S.sheet.setAttribute('opacity', f2(1 - 0.35 * p));
      S.fold.setAttribute('opacity', f2(0.1 * p));
    } else {
      S.sheet.removeAttribute('transform');
      S.sheet.setAttribute('opacity', 1);
      S.fold.setAttribute('opacity', 0);
    }

    S.writes.forEach(it => setWrite(it, t, final));
    S.strokes.forEach(it => setStroke(it, t, final));
    S.headFill.setAttribute('opacity', f2(final ? 1 : prog(t, S.head.act.t1 - 0.06, 0.25)));

    // Causes vagues : écrites, barrées, puis retirées avant la réécriture
    S.vagues.forEach(v => {
      if (final) { show(v.g, false); return; }
      const o = 1 - prog(t, v.strike.act.t1 + 0.04, 0.2);
      show(v.g, o > 0 && t >= v.write.act.t0);
      v.g.setAttribute('opacity', f2(o));
      v.g.setAttribute('transform', o < 1 ? `translate(0 ${f2(-5 * (1 - o))})` : '');
    });

    // Étiquettes « À vérifier »
    S.circles.forEach(c => {
      const p = final ? 1 : prog(t, c.tPop, 0.35);
      show(c.tag, p > 0);
      const k = popScale(p);
      c.tag.setAttribute('transform', k === 1 ? '' : `translate(${f2(c.cx)} ${f2(c.cy)}) scale(${f2(k)}) translate(${f2(-c.cx)} ${f2(-c.cy)})`);
    });

    // Compteurs
    setCounter(S.n1, t, final, S.causeTimes, 10);
    setCounter(S.n2, t, final, S.tagTimes, 3);

    // Règles : décochées sur la feuille blanche, cochées quand elles s'appliquent
    S.rules.forEach((r, i) => {
      let k, hl = 0;
      if (final) k = t < T_OUT + 0.05 ? 1 : 1 - easeIn(prog(t, T_OUT + 0.05, 0.22));
      else { const p = prog(t, S.T_RULE[i], 0.35); k = popScale(p); if (p <= 0) k = 0; hl = Math.sin(Math.PI * prog(t, S.T_RULE[i], 0.9)); }
      show(r.ic, k > 0.002);
      r.ic.setAttribute('transform', k === 1 ? '' : `translate(113 ${r.cy}) scale(${f2(Math.max(k, 0.001))}) translate(-113 ${-r.cy})`);
      r.hl.setAttribute('opacity', f2(0.85 * hl));
    });

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    const TP = S.T_PILL, last = S.pills.length - 1;
    S.pills.forEach((g, i) => {
      let o, dy = 0;
      if (final) o = i === last ? 1 - prog(t, T_OUT, 0.14) : 0;
      else {
        const a = TP[i] + 0.12;
        o = prog(t, a, 0.25) * (i === last ? 1 : 1 - prog(t, TP[i + 1], 0.14));
        dy = 8 * (1 - prog(t, a, 0.25));
      }
      show(g, o > 0);
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });

    // Feutres
    S.pens.forEach(pen => {
      const pose = final ? null : penPose(pen, t);
      show(pen.g, !!pose);
      if (!pose) return;
      const k = 1 + 0.07 * pose.lift;
      pen.g.setAttribute('transform', `translate(${f2(pose.x)} ${f2(pose.y - 10 * pose.lift)}) rotate(${f2(26 - 4 * pose.lift)}) scale(${f2(k)})`);
      pen.g.setAttribute('filter', pose.lift > 0.15 ? 'url(#penUp)' : 'url(#penDown)');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
