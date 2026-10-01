// Fiche LinkedIn · page Fichly · lundi 19 octobre 2026 (Buffer 6abe5d14a1257d1a53a15ea1)
// Post : « Face à un problème, on choisit souvent l'outil qu'on connaît le mieux. Pas forcément celui dont
// le problème a besoin. » « La fiche résume ces quatre situations sur une page, avec la question qui
// permet de choisir. » Premier commentaire : article 5 Pourquoi → encart.
// Le visuel EST la fiche : un arbre de décision en rails inclinés. Trois aiguillages numérotés portent
// les questions, quatre godets mènent aux outils (Pareto, 5 Pourquoi, Ishikawa, DMAIC) et à leur
// description ; en bas, la combinaison Pareto → Ishikawa → 5 Pourquoi → DMAIC.
// Style propre : l'arbre de décision à bille. Une bille « problème » tombe, roule avec la gravité,
// freine à chaque aiguillage où la question s'allume, la palette bascule, la bille file vers son outil,
// qui s'illumine. Quatre billes, quatre cas, puis une petite bille parcourt la combinaison.
// Image t = 0 = la fiche complète (état final). Boucle exacte de 14 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit, measure } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.55 + 0.45 * back(p));
  const win = (t, a, b, fin = 0.15, fout = 0.15) => prog(t, a, fin) * (1 - prog(t, b, fout));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => {
    if (p <= 0) return a;
    if (p >= 1) return b;
    const A = hex(a), B = hex(b);
    return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * p).toString(16).padStart(2, '0')).join('');
  };
  // Invisible = display none (rendu stable d'une image à l'autre)
  const show = (n, o) => {
    if (o <= 0.002) { n.setAttribute('display', 'none'); return false; }
    n.removeAttribute('display');
    n.setAttribute('opacity', o >= 0.998 ? 1 : f2(o));
    return true;
  };
  const scaleAt = (n, cx, cy, k, extra = '') => n.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? extra : `${extra} translate(${f2(cx)} ${f2(cy)}) scale(${k.toFixed(4)}) translate(${f2(-cx)} ${f2(-cy)})`);

  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', RAIL = '#d2d3e7', DIM = '#a9a9c8';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 734 };
  const HEAD_Y = 444;
  const PB = { x: 84, y: 456, w: 436, h: 72 };                 // carte « le problème »
  const QX = 548, QW = 452, QH = 68, QY = [456, 532, 608];     // les trois questions
  const CARD_Y = 848, CARD_H = 168, CARD_W = 216, CARD_X = [84, 316, 548, 780];
  const CXS = CARD_X.map(x => x + CARD_W / 2);                  // 192 · 424 · 656 · 888
  const CUP_Y = 834, CUP_R = 21, REST_Y = 840;                  // godet en haut de chaque carte
  const BR = 12.5;                                              // rayon de la bille
  const W_OUT = 34, W_IN = 26;                                  // gouttière : bord, fond
  const SLOT = [120, 548];                                      // la bille attend sous la carte
  const STRIP = { label: 1053, chip: 1085, role: 1121, xs: [198, 426, 654, 882] };

  // Rails (gouttières) : départ, puis à chaque aiguillage une branche A (le godet) et une branche B (la suite)
  const SEG = {
    p0: 'M 120 548 C 120 584, 136 598, 172 612',
    p1a: 'M 172 612 C 176 630, 192 640, 192 670 L 192 814',
    p1b: 'M 172 612 C 250 636, 330 656, 402 682',
    p2a: 'M 402 682 C 406 700, 424 708, 424 736 L 424 814',
    p2b: 'M 402 682 C 480 704, 560 722, 630 742',
    p3a: 'M 630 742 C 634 760, 656 768, 656 792 L 656 814',
    p3b: 'M 630 742 C 740 790, 888 760, 888 814',
  };
  const FORKS = [[172, 612], [402, 682], [630, 742]];
  const INCOMING = ['p0', 'p1b', 'p2b'];

  // ---------- Contenu (mots du post) ----------
  const TOOLS = [
    { name: 'Pareto', acc: C.yellow, bg: C.pYellow, ink: C.tYellow, seg: 'p1a',
      desc: ['Classer par fréquence,', 'durée ou coût.', 'Quelques catégories', 'pèsent l’essentiel.'] },
    { name: '5 Pourquoi', acc: C.green, bg: C.pGreen, ink: C.tGreen, seg: 'p2a',
      desc: ['Remonter de l’effet', 'à la cause, en vérifiant', 'chaque réponse', 'sur le terrain.'] },
    { name: 'Ishikawa', acc: C.lightBlue, bg: C.pLav, ink: C.blue, seg: 'p3a',
      desc: ['Explorer les six', 'familles de causes', `(6M) avant d’en`, 'retenir une.'] },
    { name: 'DMAIC', acc: C.red, bg: C.pRed, ink: C.tRed, seg: 'p3b',
      desc: ['Définir, mesurer,', 'analyser, améliorer,', 'contrôler : un projet', 'de plusieurs semaines.'] },
  ];
  const QUESTIONS = [
    ['Beaucoup de problèmes,', `pas de priorité claire${NB}?`],
    ['Une cause probablement unique,', `ou plusieurs possibles${NB}?`],
    ['Un problème complexe,', `chronique et coûteux${NB}?`],
  ];
  // Étiquettes des branches : [A, B] et leur position (centre)
  const CHIPS = [
    [{ label: 'oui', x: 136, y: 690 }, { label: 'non', x: 300, y: 616 }],
    [{ label: 'unique', x: 360, y: 762 }, { label: 'plusieurs', x: 490, y: 656 }],
    [{ label: 'non', x: 604, y: 794 }, { label: 'oui', x: 792, y: 734 }],
  ];
  // Quatre cas concrets (inventés, plausibles) : un par sortie
  const CASES = [
    { tool: 0, text: `15 types de défauts, aucune priorité`, route: ['p0', 'p1a'], br: ['A'] },
    { tool: 1, text: `Une vis oubliée au poste 3, lundi`, route: ['p0', 'p1b', 'p2a'], br: ['B', 'A'] },
    { tool: 2, text: `Rayures sur capots, plusieurs pistes`, route: ['p0', 'p1b', 'p2b', 'p3a'], br: ['B', 'B', 'A'] },
    { tool: 3, text: `6${NB}% de rebuts depuis un an${NB}: 80${NB}k€`, route: ['p0', 'p1b', 'p2b', 'p3b'], br: ['B', 'B', 'B'] },
  ];
  const COMBO = [0, 2, 1, 3];                                   // Pareto → Ishikawa → 5 Pourquoi → DMAIC
  const ROLES = ['choisir le problème', 'lister les causes', 'creuser la plus probable', 'quand le problème résiste'];
  const FINAL_TXT = `Quoi${NB}? Où${NB}? Depuis quand${NB}? Combien${NB}?`;

  // ---------- Physique et chronologie (s) ----------
  const DURATION = 14;
  const G = 9000, MU = 1.4, A_BR = 6500, V_PASS = 280;         // px/s², 1/s, px/s², px/s
  const SIM_DT = 1 / 1000, REC = 5;
  const T_CLEAR = 1.15, CLEAR_DUR = 0.28, T_START = 1.62;
  const CPS = 75;                                               // frappe du cas
  const PAUSE_FIRST = 0.56, PAUSE = 0.42, FLIP_DELAY = 0.1, FLIP_DUR = 0.3;
  const HOP = 0.3;
  const FLAP0 = ['B', 'B', 'B'];                                // position des palettes à l'image finale

  const S = { rows: [], hubs: [], chips: [], cards: [], balls: [], strip: [] };
  const TL = {};

  // ---------- Petits éléments ----------
  function rich(parent, x, y, segs, { size = 22, anchor = 'start' } = {}) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': 500, fill: C.ink, 'text-anchor': anchor }, parent);
    segs.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
    return t;
  }
  function pill(parent, cx, cy, label, { size = 16, h = 26, fill = C.white, stroke = CARD_LINE, color = C.ink, weight = 700 } = {}) {
    const g = el('g', {}, parent);
    const r = el('rect', { y: cy - h / 2, height: h, rx: h / 2, fill, stroke, 'stroke-width': stroke === 'none' ? 0 : 2 }, g);
    const t = text(g, cx, cy + size * 0.36, label, { size, weight, fill: color, anchor: 'middle' });
    const b = measure(t), pad = h * 0.55;
    r.setAttribute('x', f2(b.x - pad));
    r.setAttribute('width', f2(b.width + 2 * pad));
    return { g, r, t, w: b.width + 2 * pad };
  }
  const check = (parent, k = 1, color = C.white, w = 3.4) =>
    el('path', { d: `M ${-5.5 * k} ${0.5 * k} L ${-1.5 * k} ${4.5 * k} L ${6 * k} ${-4 * k}`, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  function ballShape(parent) {
    const g = el('g', {}, parent);
    const body = el('circle', { cx: 0, cy: 0, r: BR, fill: C.ink }, g);
    const tint = el('circle', { cx: 0, cy: 0, r: BR, fill: C.ink }, g);
    const rot = el('g', {}, g);
    const q = text(rot, 0, 6, '?', { size: 17, weight: 800, fill: C.white, anchor: 'middle' });
    const ok = el('g', {}, g);
    check(ok, 1, C.white, 3.2);
    el('circle', { cx: -4.5, cy: -5, r: 2.6, fill: C.white, opacity: 0.35 }, g);
    return { g, body, tint, rot, q, ok };
  }

  // ---------- Parcours : échantillonné tous les pixels ----------
  function pathLen(d) {
    const p = el('path', { d, fill: 'none' });
    const L = p.getTotalLength();
    return { p, L };
  }
  function makeRoute(keys, cx) {
    const parts = keys.map((k, i) => (i === keys.length - 1 ? `${SEG[k]} L ${cx} ${REST_Y}` : SEG[k]));
    const lens = parts.map(d => { const { p, L } = pathLen(d); p.remove(); return L; });
    const { p, L } = pathLen(parts.join(' '));
    const n = Math.ceil(L), pts = [];
    for (let i = 0; i <= n; i++) { const q = p.getPointAtLength(Math.min(L, i)); pts.push([q.x, q.y]); }
    p.remove();
    const cum = [];
    lens.reduce((a, l) => { cum.push(a + l); return a + l; }, 0);
    const shared = keys.slice(0, -1).map(k => SEG[k]).join(' ');
    return { L, pts, cum, shared, sharedL: cum[keys.length - 2] };
  }
  const posAt = (r, s) => {
    const i = Math.min(r.pts.length - 2, Math.max(0, Math.floor(s))), f = clamp(s - i);
    const a = r.pts[i], b = r.pts[i + 1];
    return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)];
  };
  const slopeAt = (r, s) => (posAt(r, Math.min(r.L, s + 2))[1] - posAt(r, Math.max(0, s - 2))[1]) / 4;

  // Gravité le long du rail, freinage avant chaque aiguillage (arrêt, ou passage lent si la palette est déjà bonne)
  function simulate(r, checks, t0) {
    const rec = [0], ev = [];
    let s = 0, v = 0, n = 0, ci = 0;
    const step = () => { n++; if (n % REC === 0) rec.push(s); };
    while (s < r.L - 1e-6) {
      const c = checks[ci];
      let a = G * slopeAt(r, s) - MU * v;
      if (c) {
        const vt = c.stop ? 0 : V_PASS, rem = c.s - s;
        if (v > vt && rem <= (v * v - vt * vt) / (2 * A_BR)) a = -(v * v - vt * vt) / (2 * Math.max(rem, 0.2));
      }
      v = Math.max(8, v + a * SIM_DT);
      s = Math.min(r.L, s + v * SIM_DT);
      step();
      if (c && s >= c.s - (c.stop ? 0.6 : 0)) {
        const tA = t0 + n * SIM_DT;
        if (c.stop) {
          s = c.s; v = 0;
          const hold = Math.round(c.pause / SIM_DT);
          for (let h = 0; h < hold; h++) step();
          ev.push({ ...c, tArr: tA, tDep: t0 + n * SIM_DT });
        } else ev.push({ ...c, tArr: tA, tDep: tA });
        ci++;
      }
    }
    rec.push(r.L);
    return { rec, ev, t0, tLand: t0 + n * SIM_DT };
  }
  const sAt = (sim, t) => {
    const u = (t - sim.t0) / (REC * SIM_DT);
    if (u <= 0) return 0;
    const i = Math.floor(u);
    if (i >= sim.rec.length - 1) return sim.rec[sim.rec.length - 1];
    return lerp(sim.rec[i], sim.rec[i + 1], u - i);
  };

  // ---------- Construction ----------
  function build() {
    D.template({ author: null });
    D.title('Choisir le bon outil', 'selon la situation', 1020);
    D.chapeau(`Pas celui qu’on connaît le mieux${NB}: celui dont le problème a besoin.`);

    // Explication courte au-dessus du visuel
    fit(rich(D.svg, 62, 352, [['Chaque ', 0], ['bille', C.blue], [' est un problème. À chaque ', 0], ['aiguillage', C.blue], [', une question choisit la voie.', 0]]), 1020, 'explication 1');
    fit(rich(D.svg, 62, 384, [[`Avant d’ouvrir un outil, décrivez le problème${NB}: `, 0], ['quoi, où, depuis quand, combien', C.blue], ['.', 0]]), 1020, 'explication 2');

    // ----- Chronologie : simulation des quatre billes -----
    const flap = FLAP0.slice();
    const flips = [[], [], []];
    TL.events = [];
    let t = T_START;
    CASES.forEach((c, k) => {
      c.r = makeRoute(c.route, CXS[c.tool]);
      c.tType = t;
      c.tDrop = t + c.text.length / CPS + 0.14;
      const checks = c.br.map((b, j) => ({ s: c.r.cum[j] - 12, sw: j, br: b, k, stop: flap[j] !== b, pause: k === 0 ? PAUSE_FIRST : PAUSE }));
      c.sim = simulate(c.r, checks, c.tDrop);
      c.tLand = c.sim.tLand;
      c.sim.ev.forEach(e => {
        if (e.stop) { flips[e.sw].push({ t: e.tArr + FLIP_DELAY, from: flap[e.sw], to: e.br }); flap[e.sw] = e.br; }
        TL.events.push({ ...e, tLand: c.tLand });
      });
      c.tPop = k ? CASES[k - 1].tLand + 0.12 : null;
      t = c.tLand + 0.15;
    });
    TL.flips = flips;
    TL.combo = CASES[3].tLand + 0.35;
    TL.fin = TL.combo + 0.15 + 3 * HOP + 0.35;
    if (flap.join() !== FLAP0.join()) console.error('Boucle : palettes différentes en fin de cycle');
    if (TL.fin + 0.45 > DURATION) console.error(`Chronologie trop longue : ${TL.fin.toFixed(2)} s`);
    // Une seule question allumée à la fois
    TL.events.forEach(e => { e.a = e.stop ? e.tArr - 0.12 : e.tArr - 0.18; e.b = e.stop ? e.tDep + 0.06 : e.tArr + 0.04; });
    const byT = TL.events.slice().sort((x, y) => x.a - y.a);
    for (let i = 1; i < byT.length; i++) if (byT[i].a < byT[i - 1].b + 0.16) console.error(`Questions superposées (${byT[i - 1].a.toFixed(2)} / ${byT[i].a.toFixed(2)})`);
    window.__TL = { cases: CASES.map(c => ({ type: c.tType, drop: c.tDrop, land: c.tLand })), combo: TL.combo, fin: TL.fin, events: TL.events.map(e => [e.sw, e.stop, +e.tArr.toFixed(2), +e.tDep.toFixed(2)]) };

    // ----- Cadre -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    const head = (x, y, str) => text(D.svg, x, y, str, { size: 15, weight: 700, fill: MUTED });
    const h1 = head(PB.x + 4, HEAD_Y, 'LE PROBLÈME, EN UNE PHRASE');
    const h2 = head(QX + 4, HEAD_Y, 'LA QUESTION QUI PERMET DE CHOISIR');
    [h1, h2].forEach(h => h.setAttribute('letter-spacing', 1.2));
    fit(h1, 430, 'en-tête problème');
    fit(h2, 1000, 'en-tête questions');

    // ----- Les trois questions -----
    QUESTIONS.forEach((q, i) => {
      const y = QY[i];
      const g = el('g');
      const box = el('rect', { x: QX, y, width: QW, height: QH, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
      const halo = el('circle', { cx: QX + 34, cy: y + QH / 2, r: 22, fill: 'none', stroke: C.blue, 'stroke-width': 3 }, g);
      el('circle', { cx: QX + 34, cy: y + QH / 2, r: 17, fill: C.blue }, g);
      text(g, QX + 34, y + QH / 2 + 6.5, String(i + 1), { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
      q.forEach((l, j) => fit(text(g, QX + 66, y + 29 + j * 23, l, { size: 18, weight: 700, fill: C.ink }), QX + QW - 14, `question ${i + 1}.${j + 1}`));
      S.rows.push({ box, halo });
    });

    // ----- Les quatre cartes outils -----
    TOOLS.forEach((tl, i) => {
      const x = CARD_X[i], cx = CXS[i];
      const g = el('g');
      const box = el('rect', { x, y: CARD_Y, width: CARD_W, height: CARD_H, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
      const badge = el('circle', { cx: x + 26, cy: CARD_Y + 27, r: 13, fill: tl.acc }, g);
      text(g, x + 26, CARD_Y + 32.5, String(i + 1), { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
      const name = text(g, cx, CARD_Y + 60, tl.name, { size: 22, weight: 800, fill: tl.ink, anchor: 'middle' });
      fit(name, x + CARD_W - 12, `nom ${tl.name}`, x + 12);
      const lines = tl.desc.map((l, j) => {
        const n = text(g, cx, CARD_Y + 88 + j * 21, l, { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });
        fit(n, x + CARD_W - 10, `description ${tl.name} ${j + 1}`, x + 10);
        return n;
      });
      S.cards.push({ g, box, badge, name, lines, x, cx });
    });

    // ----- Combinaison -----
    const lab = text(D.svg, 92, STRIP.label, `Ces outils se combinent souvent${NB}:`, { size: 17, weight: 700, fill: C.ink });
    fit(lab, 1000, 'combinaison titre');
    S.stripLabel = lab;
    COMBO.forEach((ti, i) => {
      const tl = TOOLS[ti], cx = STRIP.xs[i];
      const dim = pill(D.svg, cx, STRIP.chip, tl.name, { size: 18, h: 34, fill: C.white, stroke: CARD_LINE, color: DIM, weight: 800 });
      const lit = pill(D.svg, cx, STRIP.chip, tl.name, { size: 18, h: 34, fill: tl.bg, stroke: tl.acc, color: tl.ink, weight: 800 });
      const role = text(D.svg, cx, STRIP.role, ROLES[i], { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });
      fit(role, cx + 112, `rôle ${i + 1}`, cx - 112);
      let arrow = null;
      if (i) {
        const x0 = STRIP.xs[i - 1] + S.strip[i - 1].w / 2 + 12, x1 = cx - lit.w / 2 - 12;
        const len = x1 - x0;
        arrow = el('g');
        const ln = el('path', { d: `M ${f2(x0)} ${STRIP.chip} H ${f2(x1)}`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': f2(len), 'stroke-dashoffset': 0 }, arrow);
        const hd = el('path', { d: `M ${f2(x1 - 8)} ${STRIP.chip - 7} L ${f2(x1)} ${STRIP.chip} L ${f2(x1 - 8)} ${STRIP.chip + 7}`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, arrow);
        arrow = { g: arrow, ln, hd, len, x0 };
      }
      S.strip.push({ dim: dim.g, lit: lit.g, role, arrow, w: lit.w, cx });
    });
    // petite bille du parcours : roule sur les flèches et passe sous les pastilles (tunnel)
    S.hop = el('g');
    el('circle', { cx: 0, cy: 0, r: 8.5, fill: C.ink }, S.hop);
    S.hopDot = el('circle', { cx: 0, cy: -4.2, r: 2.2, fill: C.white }, S.hop);
    S.strip.forEach(st => { D.svg.appendChild(st.dim); D.svg.appendChild(st.lit); });

    // ----- Rails : bords, puis fonds (les jonctions se fondent) -----
    const drawD = k => (k === 'p0' ? `M 120 530 L 120 548 ${SEG.p0.replace('M 120 548', '')}` : SEG[k]);
    Object.keys(SEG).forEach(k => el('path', { d: drawD(k), fill: 'none', stroke: RAIL, 'stroke-width': W_OUT, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    Object.keys(SEG).forEach(k => el('path', { d: drawD(k), fill: 'none', stroke: C.white, 'stroke-width': W_IN, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));

    // Traces : le trajet commun (bleu, passager), puis la descente vers l'outil (couleur de l'outil, reste)
    CASES.forEach(c => {
      const { p, L } = pathLen(c.r.shared);
      p.remove();
      c.trail = el('path', { d: c.r.shared, fill: 'none', stroke: C.blue, 'stroke-opacity': 0.4, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      c.trailL = L;
    });
    TOOLS.forEach((tl, i) => {
      const { p, L } = pathLen(SEG[tl.seg]);
      p.remove();
      S.cards[i].stripe = el('path', { d: SEG[tl.seg], fill: 'none', stroke: tl.acc, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      S.cards[i].stripeL = L;
    });

    // ----- Carte « le problème » (couvre le haut de la goulotte de départ) -----
    el('rect', { x: PB.x, y: PB.y, width: PB.w, height: PB.h, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    el('rect', { x: SLOT[0] - 17, y: PB.y + PB.h - 3, width: 34, height: 6, rx: 3, fill: C.ink });
    S.finalTxt = text(D.svg, PB.x + 20, PB.y + 45, FINAL_TXT, { size: 20, weight: 800, fill: C.ink });
    fit(S.finalTxt, PB.x + PB.w - 16, 'texte final problème');
    CASES.forEach((c, k) => {
      c.node = text(D.svg, PB.x + 20, PB.y + 45, c.text, { size: 19, weight: 700, fill: C.ink });
      fit(c.node, PB.x + PB.w - 22, `cas ${k + 1}`);
      c.chip = pill(D.svg, 0, HEAD_Y - 5, `Cas${NB}${k + 1}/4`, { size: 15, h: 24, fill: C.blue, stroke: 'none', color: C.white });
      c.chip.g.setAttribute('transform', `translate(${f2(PB.x + PB.w - c.chip.w / 2)} 0)`);
    });
    S.cursor = el('rect', { x: 0, y: PB.y + 27, width: 2.5, height: 23, rx: 1, fill: C.blue });

    // ----- Godets -----
    TOOLS.forEach((tl, i) => {
      const cx = CXS[i];
      S.cards[i].cup = el('path', { d: `M ${cx - CUP_R} ${CUP_Y - 22} L ${cx - CUP_R} ${CUP_Y} A ${CUP_R} ${CUP_R} 0 0 0 ${cx + CUP_R} ${CUP_Y} L ${cx + CUP_R} ${CUP_Y - 22}`, fill: C.white, stroke: tl.acc, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      S.cards[i].ripple = el('circle', { cx, cy: REST_Y, r: 20, fill: 'none', stroke: tl.acc, 'stroke-width': 3 });
    });

    // ----- Aiguillages : palette, moyeu numéroté -----
    FORKS.forEach(([fx, fy], j) => {
      const inc = SEG[INCOMING[j]];
      const { p: pi, L: li } = pathLen(inc);
      const e0 = pi.getPointAtLength(li - 5), e1 = pi.getPointAtLength(li);
      pi.remove();
      const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
      const din = unit(e1.x - e0.x, e1.y - e0.y);
      const dir = k => { const { p, L } = pathLen(SEG[k]); const a = p.getPointAtLength(0), b = p.getPointAtLength(Math.min(L, 5)); p.remove(); return unit(b.x - a.x, b.y - a.y); };
      const dA = dir(`p${j + 1}a`), dB = dir(`p${j + 1}b`);
      const bis = unit(dA[0] + dB[0], dA[1] + dB[1]);
      const half = Math.acos(clamp(dA[0] * dB[0] + dA[1] * dB[1], -1, 1)) / 2;
      const hk = clamp((BR + 14) / Math.sin(half), 30, 60);
      const H = [fx + bis[0] * hk, fy + bis[1] * hk];          // moyeu numéroté, au fond de la fourche
      const pk = clamp(13 / Math.sin(half), 18, 40);
      const P = [fx + bis[0] * pk, fy + bis[1] * pk];          // pivot de la palette, à la pointe de la fourche
      const nin = [-din[1], din[0]];
      const tip = d => { const sd = Math.sign(nin[0] * d[0] + nin[1] * d[1]) || 1; return [fx + nin[0] * sd * 12, fy + nin[1] * sd * 12]; };
      const ang = d => { const q = tip(d); return { a: Math.atan2(q[1] - P[1], q[0] - P[0]) * 180 / Math.PI, l: Math.hypot(q[0] - P[0], q[1] - P[1]) + 2 }; };
      const g = el('g');
      const blade = el('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: C.ink, 'stroke-width': 6.5, 'stroke-linecap': 'round' }, g);
      const halo = el('circle', { cx: H[0], cy: H[1], r: 20, fill: 'none', stroke: C.blue, 'stroke-width': 3 }, g);
      el('circle', { cx: H[0], cy: H[1], r: 14.5, fill: C.blue, stroke: C.white, 'stroke-width': 2.5 }, g);
      text(g, H[0], H[1] + 5.8, String(j + 1), { size: 16, weight: 800, fill: C.white, anchor: 'middle' });
      el('circle', { cx: P[0], cy: P[1], r: 5.5, fill: C.ink }, g);
      el('circle', { cx: P[0], cy: P[1], r: 2, fill: C.white }, g);
      S.hubs.push({ blade, halo, P, A: ang(dB), B: ang(dA) });   // voie A ouverte = palette contre la bouche de B
    });

    // ----- Étiquettes des branches -----
    CHIPS.forEach((pair, j) => {
      S.chips.push(pair.map(c => {
        const dim = pill(D.svg, c.x, c.y, c.label, { size: 16, h: 26 });
        const lit = pill(D.svg, c.x, c.y, c.label, { size: 16, h: 26, fill: C.blue, stroke: 'none', color: C.white });
        fit(dim.r, 1000, `étiquette ${c.label}`, 80);
        return { dim: dim.g, lit: lit.g };
      }));
    });

    // ----- Billes -----
    CASES.forEach(c => { c.ball = ballShape(D.svg); c.ball.tint.setAttribute('fill', TOOLS[c.tool].acc); });
    S.next = ballShape(D.svg);

    D.encart(['Creuser la cause', 'Notre article 5 Pourquoi', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function placeBall(b, x, y, { rot = 0, k = 1, sx = 1, sy = 1, o = 1, lit = 0 } = {}) {
    if (!show(b.g, o)) return;
    let tr = `translate(${f2(x)} ${f2(y)})`;
    if (k !== 1) tr += ` scale(${k.toFixed(4)})`;
    if (sx !== 1 || sy !== 1) tr += ` translate(0 ${f2(BR)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(0 ${f2(-BR)})`;
    b.g.setAttribute('transform', tr);
    b.rot.setAttribute('transform', Math.abs(rot) < 1e-3 ? '' : `rotate(${f2(rot)})`);
    show(b.tint, lit);
    show(b.q, 1 - prog(lit, 0, 0.5));
    const kc = popScale(prog(lit, 0.35, 0.65));
    if (show(b.ok, prog(lit, 0.35, 0.3))) b.ok.setAttribute('transform', kc === 1 ? '' : `scale(${kc.toFixed(4)})`);
  }

  function draw(t) {
    const pre = t < T_START;                 // état final, puis effacement
    const fin = t >= TL.fin;                 // retour à l'état final

    // ----- Cartes outils -----
    S.cards.forEach((cd, i) => {
      const c = CASES.find(x => x.tool === i);
      const kOut = 1 - prog(t, T_CLEAR + 0.05 * i, CLEAR_DUR);
      const k = pre ? kOut : prog(t, c.tLand + 0.04, 0.3);
      const tl = TOOLS[i];
      cd.box.setAttribute('fill', mix(C.white, tl.bg, k));
      cd.box.setAttribute('stroke', mix(CARD_LINE, tl.acc, k));
      cd.box.setAttribute('stroke-width', f2(2 + k));
      cd.badge.setAttribute('fill', mix(CARD_LINE, tl.acc, k));
      cd.name.setAttribute('fill', mix(DIM, tl.ink, k));
      cd.cup.setAttribute('stroke', mix(CARD_LINE, tl.acc, k));
      cd.lines.forEach((n, j) => {
        const p = pre ? kOut : prog(t, c.tLand + 0.14 + 0.07 * j, 0.26);
        if (show(n, p)) n.setAttribute('transform', p >= 1 ? '' : `translate(0 ${f2(7 * (1 - easeOut(p)))})`);
      });
      // petit sursaut de la carte à l'arrivée, onde depuis le godet
      const pp = pre ? 0 : prog(t, c.tLand, 0.38);
      scaleAt(cd.g, cd.cx, CARD_Y + CARD_H / 2, 1 + 0.03 * Math.sin(Math.PI * pp));
      const pr = pre ? 0 : prog(t, c.tLand, 0.55);
      if (show(cd.ripple, pr > 0 && pr < 1 ? 0.7 * (1 - pr) : 0)) cd.ripple.setAttribute('r', f2(18 + 30 * easeOut(pr)));
      // descente colorée vers l'outil : se trace derrière la bille, reste
      let sp;
      if (pre) sp = kOut > 0 ? 1 : 0;
      else { const s = sAt(c.sim, t); sp = t >= c.tDrop ? clamp((s - c.r.sharedL) / cd.stripeL) : 0; }
      const so = pre ? kOut : 1;
      if (show(cd.stripe, sp > 0.002 ? so : 0)) {
        if (sp >= 1) { cd.stripe.removeAttribute('stroke-dasharray'); cd.stripe.removeAttribute('stroke-dashoffset'); }
        else { cd.stripe.setAttribute('stroke-dasharray', `${f2(cd.stripeL)} ${f2(cd.stripeL + 10)}`); cd.stripe.setAttribute('stroke-dashoffset', f2(cd.stripeL * (1 - sp))); }
      }
    });

    // ----- Billes -----
    CASES.forEach((c, k) => {
      const tl = TOOLS[c.tool], cx = CXS[c.tool];
      if (pre) {
        if (k === 0 && t >= T_CLEAR + CLEAR_DUR + 0.12) { placeBall(c.ball, SLOT[0], SLOT[1]); return; }
        const p = prog(t, T_CLEAR + 0.05 * c.tool, 0.24);
        placeBall(c.ball, cx, REST_Y + 10 * easeOut(p), { k: Math.max(0.001, 1 - 0.5 * p), o: 1 - p, lit: 1 });
        return;
      }
      if (k && t < c.tPop) { show(c.ball.g, 0); return; }
      if (t < c.tDrop) {
        const p = k ? prog(t, c.tPop, 0.3) : 1;
        placeBall(c.ball, SLOT[0], SLOT[1], { k: popScale(p), o: clamp(p / 0.3) });
        return;
      }
      if (t < c.tLand) {
        const s = sAt(c.sim, t);
        const [x, y] = posAt(c.r, s);
        placeBall(c.ball, x, y, { rot: s / BR * 180 / Math.PI });
        return;
      }
      // dans le godet : deux rebonds, écrasement, puis couleur de l'outil
      const u = t - c.tLand;
      let dy = 0, sy = 1;
      if (u < 0.17) dy = -9 * Math.sin(Math.PI * u / 0.17);
      else if (u < 0.27) dy = -3 * Math.sin(Math.PI * (u - 0.17) / 0.1);
      if (u < 0.06) sy = 1 - 0.16 * Math.sin(Math.PI * u / 0.06);
      else if (u >= 0.17 && u < 0.21) sy = 1 - 0.07 * Math.sin(Math.PI * (u - 0.17) / 0.04);
      const rot = (c.r.L / BR * 180 / Math.PI) * (1 - easeInOut(prog(u, 0.05, 0.3)));
      placeBall(c.ball, cx, REST_Y + dy, { rot, sx: 1 + (1 - sy) * 0.6, sy, lit: prog(u, 0.08, 0.32) });
      void tl;
    });
    // Bille d'attente de l'image finale (devient la bille du cas 1, puis revient en fin de boucle)
    if (pre && t < T_CLEAR + CLEAR_DUR + 0.12) placeBall(S.next, SLOT[0], SLOT[1]);
    else if (fin) { const p = prog(t, TL.fin + 0.05, 0.32); placeBall(S.next, SLOT[0], SLOT[1], { k: popScale(p), o: clamp(p / 0.3) }); }
    else show(S.next.g, 0);

    // ----- Traces du trajet commun -----
    CASES.forEach(c => {
      if (pre || t < c.tDrop) { show(c.trail, 0); return; }
      const s = Math.min(sAt(c.sim, t), c.trailL);
      const o = 1 - prog(t, c.tLand + 0.15, 0.3);
      if (show(c.trail, s > 1 ? o : 0)) {
        c.trail.setAttribute('stroke-dasharray', `${f2(c.trailL)} ${f2(c.trailL + 10)}`);
        c.trail.setAttribute('stroke-dashoffset', f2(c.trailL - s));
      }
    });

    // ----- Questions et aiguillages -----
    const lit = [0, 0, 0], since = [0, 0, 0];
    if (!pre) TL.events.forEach(e => { const v = win(t, e.a, e.b, 0.14, 0.14); if (v > lit[e.sw]) { lit[e.sw] = v; since[e.sw] = e.a; } });
    S.rows.forEach((r, j) => {
      const v = lit[j];
      r.box.setAttribute('fill', mix(C.white, C.pLav, v));
      r.box.setAttribute('stroke', mix(CARD_LINE, C.blue, v));
      r.box.setAttribute('stroke-width', f2(2 + v));
      const pulse = 0.5 + 0.5 * Math.sin(2 * Math.PI * (t - since[j]) / 0.55 - Math.PI / 2);
      if (show(r.halo, v * (0.55 - 0.35 * pulse))) r.halo.setAttribute('r', f2(19 + 5 * pulse));
    });
    S.hubs.forEach((h, j) => {
      // palette : position de l'image finale, puis chaque bascule (avec léger dépassement)
      let a = h[FLAP0[j]].a, l = h[FLAP0[j]].l;
      if (!pre) TL.flips[j].forEach(f => {
        if (t < f.t) return;
        const p = prog(t, f.t, FLIP_DUR), q = p >= 1 ? 1 : back(p);
        const a0 = h[f.from].a, a1 = h[f.to].a, dA = ((a1 - a0 + 540) % 360) - 180;
        a = a0 + dA * q; l = lerp(h[f.from].l, h[f.to].l, clamp(q));
      });
      const r = a * Math.PI / 180;
      h.blade.setAttribute('x1', f2(h.P[0]));
      h.blade.setAttribute('y1', f2(h.P[1]));
      h.blade.setAttribute('x2', f2(h.P[0] + Math.cos(r) * l));
      h.blade.setAttribute('y2', f2(h.P[1] + Math.sin(r) * l));
      const v = lit[j];
      const pulse = 0.5 + 0.5 * Math.sin(2 * Math.PI * (t - since[j]) / 0.55 - Math.PI / 2);
      if (show(h.halo, v * (0.6 - 0.4 * pulse))) h.halo.setAttribute('r', f2(18 + 6 * pulse));
    });
    // Étiquettes de branche : allumées du départ de l'aiguillage jusqu'à l'arrivée dans le godet
    S.chips.forEach((pair, j) => pair.forEach((cp, b) => {
      let v = 0;
      if (!pre) TL.events.forEach(e => { if (e.sw === j && e.br === 'AB'[b]) v = Math.max(v, win(t, e.tDep - 0.02, e.tLand + 0.3, 0.14, 0.25)); });
      show(cp.lit, v);
      show(cp.dim, 1 - v);
      const kp = v > 0 && v < 1 ? 1 + 0.08 * Math.sin(Math.PI * v) : 1;
      const c = CHIPS[j][b];
      scaleAt(cp.lit, c.x, c.y, kp);
    }));

    // ----- Carte « le problème » : texte final, cas tapés, pastille du cas -----
    const fo = pre ? 1 - prog(t, T_CLEAR, 0.22) : fin ? prog(t, TL.fin + 0.12, 0.3) : 0;
    if (show(S.finalTxt, fo)) S.finalTxt.setAttribute('transform', fo >= 1 ? '' : `translate(0 ${f2(5 * (1 - fo))})`);
    let cur = null;
    CASES.forEach((c, k) => {
      const end = k < 3 ? CASES[k + 1].tType : TL.fin;
      const o = pre ? 0 : win(t, c.tType, end - 0.14, 0.01, 0.12);
      const n = Math.floor((t - c.tType) * CPS);
      if (show(c.node, o)) {
        c.node.textContent = n >= c.text.length ? c.text : c.text.slice(0, Math.max(0, n));
        if (t < c.tDrop + 0.3) cur = c;
      } else c.node.textContent = c.text;
      const co = pre ? 0 : win(t, c.tType + 0.02, end - 0.14, 0.18, 0.12);
      if (show(c.chip.g, co)) {
        const kk = popScale(prog(t, c.tType + 0.02, 0.24));
        const cx = PB.x + PB.w - c.chip.w / 2;
        c.chip.g.setAttribute('transform', `translate(${f2(cx)} 0)` + (kk === 1 ? '' : ` translate(0 ${HEAD_Y - 5}) scale(${kk.toFixed(4)}) translate(0 ${-(HEAD_Y - 5)})`));
      }
    });
    if (cur && show(S.cursor, Math.floor((t - cur.tType) / 0.25) % 2 === 0 || t < cur.tType + cur.text.length / CPS ? 1 : 0)) {
      const bb = cur.node.textContent ? measure(cur.node) : { x: PB.x + 20, width: 0 };
      S.cursor.setAttribute('x', f2(bb.x + bb.width + 3));
    } else show(S.cursor, 0);

    // ----- Combinaison : la petite bille roule d'outil en outil -----
    const kOut = 1 - prog(t, T_CLEAR + 0.2, CLEAR_DUR);
    const h0 = TL.combo, tOn = i => TL.combo + 0.15 + i * HOP, hEnd = tOn(3);
    let hx = null;
    if (!pre && t >= h0 && t < hEnd) {
      if (t < tOn(0)) hx = lerp(STRIP.xs[0] - 72, STRIP.xs[0], easeInOut(prog(t, h0, 0.15)));
      else { const u = (t - tOn(0)) / HOP, i = Math.min(2, Math.floor(u)); const p = u - i; hx = lerp(STRIP.xs[i], STRIP.xs[i + 1], 0.45 * p + 0.55 * easeInOut(p)); }
    }
    S.strip.forEach((st, i) => {
      const v = pre ? kOut : prog(t, tOn(i), 0.2);
      show(st.lit, v);                       // la pastille grise reste opaque dessous : la bille passe en tunnel
      const kp = pre ? 1 : 1 + 0.07 * Math.sin(Math.PI * prog(t, tOn(i), 0.3));
      scaleAt(st.lit, st.cx, STRIP.chip, kp);
      const ro = pre ? kOut : prog(t, tOn(i) + 0.06, 0.25);
      if (show(st.role, ro)) st.role.setAttribute('transform', ro >= 1 ? '' : `translate(0 ${f2(6 * (1 - easeOut(ro)))})`);
      if (st.arrow) {
        // la flèche se trace derrière la bille
        let pa;
        if (pre) pa = kOut > 0 ? 1 : 0;
        else if (t >= tOn(i)) pa = 1;
        else if (t < tOn(i - 1) || hx === null) pa = 0;
        else pa = clamp((hx - st.arrow.x0) / st.arrow.len);
        if (show(st.arrow.g, pa > 0.01 ? (pre ? kOut : 1) : 0)) {
          if (pa >= 1) st.arrow.ln.removeAttribute('stroke-dasharray');
          else st.arrow.ln.setAttribute('stroke-dasharray', `${f2(st.arrow.len * pa)} ${f2(st.arrow.len + 10)}`);
          show(st.arrow.hd, pa >= 0.97 ? 1 : 0);
        }
      }
    });
    S.stripLabel.setAttribute('fill', mix(C.ink, C.blue, pre ? 0 : win(t, TL.combo, TL.fin + 0.2, 0.2, 0.3)));
    if (hx !== null && show(S.hop, prog(t, h0, 0.08))) {
      S.hop.setAttribute('transform', `translate(${f2(hx)} ${STRIP.chip})`);
      S.hopDot.setAttribute('transform', `rotate(${f2((hx / 8.5) * 180 / Math.PI)})`);
    } else show(S.hop, 0);
  }

  D.start({ duration: DURATION, build, draw });
})();
