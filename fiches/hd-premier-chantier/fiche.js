// Fiche LinkedIn · Hugo Duc · mercredi 28 octobre 2026
// Post : « Si je pouvais revenir juste avant mon premier chantier Lean, je me donnerais cinq conseils. »
// Premier commentaire du post (Buffer) : la White Belt gratuite → encart.
// Le visuel est la pièce maîtresse : le panneau de réglages du premier chantier. Cinq réglages, chacun
// avec son petit écran (les mots employés, le plan de la zone, la liste d'actions, la semaine, l'ampoule)
// et sa commande (interrupteur, curseur, compteur, interrupteur, sélecteur).
// Style propre : le panneau de réglages. Le panneau se rembobine jusqu'à « juste avant », tout revient
// « comme la première fois », puis un pointeur corrige les réglages un par un et chaque petit écran se
// transforme sous la commande. Image t = 0 = état final. Boucle exacte de 12,5 s.
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
  const back = (p, c = 1.7) => 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2);
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const bump = p => (p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0);
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = rgb(a), B = rgb(b), q = clamp(p); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * q).toString(16).padStart(2, '0')).join(''); };
  const scaleAt = (cx, cy, k) => (k === 1 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-cx)} ${f2(-cy)})`);
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', SCREEN = '#f3f3f9';
  const GREY = '#d3d3e6', BAR = '#c7c7de', OFF = '#d9d9ea', TRACK = '#e3e3ef';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const PILL_Y = FRAME.y + 46;
  const RX = 84, RW = 912, RH = 118, RY0 = 494, RGAP = 11;
  const rowTop = i => RY0 + i * (RH + RGAP);
  const SCR = { x: 384, w: 400 };                 // petit écran de chaque réglage (384 → 784)
  const VX0 = SCR.x + 14, VX1 = SCR.x + SCR.w - 14;
  const CC = 892;                                  // centre de la colonne des commandes (802 → 982)

  const SETTINGS = [
    { name: 'Vocabulaire', sub: 'avec l’équipe', before: 'Jargon Lean', after: 'Mots de l’atelier', step: 'Laisser le vocabulaire au bureau' },
    { name: 'Périmètre', sub: 'la zone du chantier', before: 'Atelier entier', after: 'Une petite zone', step: 'Réduire le périmètre de moitié' },
    { name: 'Actions', sub: 'à la sortie', before: 'Quarante actions', after: 'Cinq actions', step: 'Sortir avec cinq actions, pas quarante' },
    { name: 'Invités', sub: 'à partir de quel jour', before: 'Le vendredi', after: 'Dès le jour 1', step: 'Maintenance et logistique dès le premier jour' },
    { name: 'La réponse', sub: 'qui la cherche', before: 'Je trouve', after: 'L’équipe cherche', step: 'Accepter de ne pas avoir la réponse' },
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_RW0 = 1.2;                                            // l'image finale se rembobine
  const T_RWI = [0, 1, 2, 3, 4].map(i => 1.35 + 0.13 * (4 - i));   // du dernier réglage au premier
  const RW_DUR = 0.45;
  const T_FIRST = 2.4;                                          // « réglé comme la première fois »
  const T_STEP = [0, 1, 2, 3, 4].map(i => 3.5 + 1.6 * i);       // le pointeur va sur la commande
  const T_CLICK = T_STEP.map(s => s + 0.5);                     // clic : le réglage bascule
  const CORR = [1.0, 0.95, 1.05, 1.1, 1.0];                     // durée de la correction
  const T_END = 11.5;                                           // pastille finale
  const T_PTR_OUT = 11.4;
  const FLIP = [0.22, 0.42, 0.52, 0.22, 0.2];                   // part de la correction où la valeur bascule
  const COUNT_AT = FLIP.map(f => f + 0.2);                      // … et où le compteur avance

  // Avancement d'un réglage : 1 = corrigé, 0 = « comme la première fois »
  function pRow(i, t) {
    if (t < T_RWI[i]) return 1;
    if (t < T_CLICK[i]) return 1 - easeInOut(prog(t, T_RWI[i], RW_DUR));
    return prog(t, T_CLICK[i], CORR[i]);
  }

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
    } else if (icon === 'rewind') {
      const ig = el('g', {}, g);
      [0, 11].forEach(dx => el('path', { d: `M ${x + 33 + dx} ${cy - 7} L ${x + 22 + dx} ${cy} L ${x + 33 + dx} ${cy + 7} Z`, fill: fg, 'stroke-linejoin': 'round', stroke: fg, 'stroke-width': 2 }, ig));
      g.icon = ig;
    } else if (icon === 'alert') {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.red }, g);
      text(g, x + 31, cy + 6.5, '!', { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
    }
    return g;
  }
  const checkPath = (parent, cx, cy, k, color = C.white, w = 2.4) =>
    el('path', { d: `M ${f2(cx - 3.8 * k)} ${f2(cy + 0.3 * k)} L ${f2(cx - 1 * k)} ${f2(cy + 3.1 * k)} L ${f2(cx + 3.9 * k)} ${f2(cy - 2.4 * k)}`, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  function avatar(parent, cx, cy, r, color) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: color }, g);
    el('circle', { cx, cy: cy - r * 0.24, r: r * 0.3, fill: C.white }, g);
    el('path', { d: `M ${f2(cx - r * 0.5)} ${f2(cy + r * 0.56)} C ${f2(cx - r * 0.5)} ${f2(cy + r * 0.12)}, ${f2(cx + r * 0.5)} ${f2(cy + r * 0.12)}, ${f2(cx + r * 0.5)} ${f2(cy + r * 0.56)} Z`, fill: C.white }, g);
    return g;
  }
  function gear(parent, cx, cy, k, color) {
    const g = el('g', {}, parent);
    const inner = el('g', {}, g);
    for (let j = 0; j < 8; j++) el('rect', { x: -2.6, y: -12, width: 5.2, height: 7, rx: 1.2, fill: color, transform: `rotate(${j * 45})` }, inner);
    el('circle', { cx: 0, cy: 0, r: 7.5, fill: 'none', stroke: color, 'stroke-width': 4 }, inner);
    return { g, set: a => g.setAttribute('transform', `translate(${cx} ${cy}) scale(${k}) rotate(${f2(a)})`) };
  }

  // Valeur d'un réglage sous sa commande : l'ancienne (rouge) monte et sort, la nouvelle (verte) entre
  function valueLabels(parent, cy, before, after, id) {
    const defs = D.svg.querySelector('defs');
    const cp = el('clipPath', { id }, defs);
    el('rect', { x: CC - 94, y: cy + 9, width: 188, height: 30 }, cp);
    const g = el('g', { 'clip-path': `url(#${id})` }, parent);
    const mk = (str, ok) => {
      const lg = el('g', {}, g);
      const tx = text(lg, 0, cy + 30, str, { size: 16, weight: 700, fill: ok ? C.tGreen : C.tRed });
      const w = tx.getBBox().width + 22, x0 = CC - w / 2;
      tx.setAttribute('x', f2(x0 + 22));
      if (ok) {
        el('circle', { cx: x0 + 8, cy: cy + 24.5, r: 8, fill: C.green }, lg);
        checkPath(lg, x0 + 8, cy + 24.5, 1.05);
      } else el('circle', { cx: x0 + 8, cy: cy + 24.5, r: 5, fill: C.red }, lg);
      fit(tx, CC + 90, `valeur « ${str} »`, CC - 90);
      return lg;
    };
    const old = mk(before, false), neu = mk(after, true);
    return (p, F) => {                                   // l'ancienne sort, puis la nouvelle entre
      const a = easeIn(clamp((p - F) / 0.12)), b = easeOut(clamp((p - F - 0.12) / 0.16));
      old.setAttribute('transform', a ? `translate(0 ${f2(-16 * a)})` : '');
      old.setAttribute('opacity', f2(1 - a));
      neu.setAttribute('transform', b < 1 ? `translate(0 ${f2(16 * (1 - b))})` : '');
      neu.setAttribute('opacity', f2(b));
    };
  }

  // ---------- Les commandes ----------
  const CTRL_Y = cy => cy - 17;                    // axe des commandes
  function toggleCtrl(g, cy) {
    const W = 62, H = 34, x0 = CC - W / 2, y = CTRL_Y(cy);
    el('rect', { x: x0, y: y - H / 2, width: W, height: H, rx: H / 2, fill: OFF }, g);
    const on = el('rect', { x: x0, y: y - H / 2, width: W, height: H, rx: H / 2, fill: C.green, opacity: 0 }, g);
    const knob = el('rect', { y: y - 13, height: 26, rx: 13, fill: C.white, filter: 'url(#knob)' }, g);
    return {
      target: () => ({ x: CC + 4, y: y - 3 }),
      ripple: { x: CC, y },
      set(p) {
        const s = easeInOut(clamp(p / 0.22));
        const w = 26 + 9 * bump(clamp(p / 0.22));     // le bouton s'étire en glissant
        const cx = lerp(x0 + 17, x0 + W - 17, s);
        knob.setAttribute('x', f2(cx - w / 2));
        knob.setAttribute('width', f2(w));
        on.setAttribute('opacity', f2(s));
      },
    };
  }
  function sliderCtrl(g, cy) {
    const y = CTRL_Y(cy), X0 = CC - 90, X1 = CC + 12, MID = (X0 + X1) / 2;
    el('rect', { x: X0, y: y - 3.5, width: X1 - X0, height: 7, rx: 3.5, fill: TRACK }, g);
    [X0, MID, X1].forEach(x => el('circle', { cx: x, cy: y + 13, r: 1.8, fill: MUTED }, g));
    const fill = el('rect', { x: X0, y: y - 3.5, height: 7, rx: 3.5 }, g);
    const knob = el('circle', { cx: X1, cy: y, r: 11.5, fill: C.white, 'stroke-width': 3, filter: 'url(#knob)' }, g);
    const read = text(g, CC + 90, y + 6.5, `100${NB}%`, { size: 18, weight: 800, fill: C.tRed, anchor: 'end' });
    fit(read, CC + 92, 'lecture du curseur', X1 + 14);
    const kx = p => lerp(X1, MID, easeInOut(clamp(p / 0.55)));
    return {
      target: p => ({ x: kx(p) + 3, y: y - 2 }),
      ripple: { x: X1, y },
      hold: p => p > 0 && p < 0.55,
      set(p) {
        const x = kx(p), on = clamp(p / 0.06), done = clamp((p - 0.55) / 0.08);   // rouge → bleu (saisi) → vert
        const col = mix(mix(C.red, C.blue, on), C.green, done);
        knob.setAttribute('cx', f2(x));
        knob.setAttribute('stroke', col);
        fill.setAttribute('width', f2(x - X0));
        fill.setAttribute('fill', col);
        read.textContent = `${Math.round(lerp(100, 50, (X1 - x) / (X1 - MID)))}${NB}%`;
        read.setAttribute('fill', mix(mix(C.tRed, C.blue, on), C.tGreen, done));
      },
    };
  }
  function stepperCtrl(g, cy, id) {
    const y = CTRL_Y(cy), H = 34, X0 = CC - 64, W = 128;
    el('rect', { x: X0, y: y - H / 2, width: W, height: H, rx: 11, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
    const press = el('rect', { x: X0 + 1, y: y - H / 2 + 1, width: 35, height: H - 2, rx: 10, fill: C.pLav, opacity: 0 }, g);
    [CC - 28, CC + 28].forEach(x => el('line', { x1: x, y1: y - H / 2 + 5, x2: x, y2: y + H / 2 - 5, stroke: CARD_LINE, 'stroke-width': 2 }, g));
    el('line', { x1: CC - 52, y1: y, x2: CC - 40, y2: y, stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    el('path', { d: `M ${CC + 40} ${y} H ${CC + 52} M ${CC + 46} ${y - 6} V ${y + 6}`, stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    const defs = D.svg.querySelector('defs');
    const cp = el('clipPath', { id }, defs);
    el('rect', { x: CC - 27, y: y - H / 2 + 2, width: 54, height: H - 4 }, cp);
    const ng = el('g', { 'clip-path': `url(#${id})` }, g);
    const a = text(ng, CC, y + 7, '40', { size: 20, weight: 800, fill: C.tRed, anchor: 'middle' });
    const b = text(ng, CC, y + 7, '39', { size: 20, weight: 800, fill: C.tRed, anchor: 'middle' });
    fit(a, CC + 27, 'compteur', CC - 27);
    return {
      target: () => ({ x: CC - 44, y: y - 2 }),
      ripple: { x: CC - 46, y },
      hold: p => p > 0 && p < 0.69,
      press,
      set(p, v) {                                        // v : nombre d'actions (roule de 40 à 5)
        const hi = v > 9 ? Math.round(v) : Math.ceil(v - 1e-6), fr = v > 9 ? 0 : hi - v;   // roule quand il ralentit
        a.textContent = String(hi);
        b.textContent = String(hi - 1);
        a.setAttribute('y', f2(y + 7 + 24 * fr));
        b.setAttribute('y', f2(y + 7 - 24 * (1 - fr)));
        b.setAttribute('opacity', fr > 0.001 ? 1 : 0);
        const col = mix(C.tRed, C.tGreen, clamp((p - 0.66) / 0.08));
        a.setAttribute('fill', col);
        b.setAttribute('fill', col);
        press.setAttribute('opacity', p > 0.005 && p < 0.69 ? 1 : 0);
      },
    };
  }
  function segmentedCtrl(g, cy) {
    const y = CTRL_Y(cy), H = 34, X0 = CC - 82, W = 164, KW = 78;
    el('rect', { x: X0, y: y - H / 2, width: W, height: H, rx: H / 2, fill: C.pLav }, g);
    const knob = el('rect', { y: y - 14, width: KW, height: 28, rx: 14, fill: C.white, 'stroke-width': 2, filter: 'url(#knob)' }, g);
    const L = [CC - 41, CC + 41];
    const opts = ['Moi', 'L’équipe'].map((s, k) => {
      const n = text(g, L[k], y + 5.5, s, { size: 15, weight: 700, fill: C.ink, anchor: 'middle' });
      fit(n, L[k] + KW / 2 - 4, `option ${s}`, L[k] - KW / 2 + 4);
      return n;
    });
    return {
      target: () => ({ x: CC + 73, y: y + 7 }),
      ripple: { x: CC + 41, y },
      set(p) {
        const s = easeInOut(clamp(p / 0.22));
        knob.setAttribute('x', f2(lerp(L[0], L[1], s) - KW / 2));
        knob.setAttribute('stroke', mix(mix(C.red, C.blue, clamp(p / 0.05)), C.green, clamp((p - 0.18) / 0.06)));
        opts[0].setAttribute('fill', mix(C.ink, MUTED, s));
        opts[1].setAttribute('fill', mix(MUTED, C.ink, s));
      },
    };
  }

  // ---------- Les petits écrans ----------
  // 1 · Les mots employés : le jargon roule et laisse place aux mots de l'atelier
  function vizVocab(g, cy) {
    const OLD = ['Muda', 'Gemba', 'Kaizen'], NEW = ['attentes', 'déplacements', 'retouches'];
    const BX = VX0 + 2, BY = cy - 32, BH = 50, PAD = 8, GAP = 6, CH = 32, FS = 14, MY = BY + BH / 2;
    const bubble = el('rect', { x: BX, y: BY, height: BH, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
    el('path', { d: `M ${BX + 16} ${BY + BH - 2} L ${BX + 13} ${BY + BH + 13} L ${BX + 34} ${BY + BH - 2} Z`, fill: C.white }, g);
    el('path', { d: `M ${BX + 16} ${BY + BH} L ${BX + 13} ${BY + BH + 13} L ${BX + 34} ${BY + BH}`, fill: 'none', stroke: CARD_LINE, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    const defs = D.svg.querySelector('defs');
    const chips = OLD.map((w, k) => {
      const cp = el('clipPath', { id: `voc${k}` }, defs);
      const clip = el('rect', { y: MY - CH / 2, height: CH, rx: CH / 2 }, cp);
      const r0 = el('rect', { y: MY - CH / 2, height: CH, rx: CH / 2, fill: C.pLav }, g);
      const r1 = el('rect', { y: MY - CH / 2, height: CH, rx: CH / 2, fill: C.pGreen, opacity: 0 }, g);
      const tg = el('g', { 'clip-path': `url(#voc${k})` }, g);
      const t0 = text(tg, 0, MY + FS * 0.36, w, { size: FS, weight: 700, fill: C.blue, anchor: 'middle' });
      const t1 = text(tg, 0, MY + FS * 0.36, NEW[k], { size: FS, weight: 700, fill: C.tGreen, anchor: 'middle' });
      return { clip, r0, r1, t0, t1, w0: t0.getBBox().width + 22, w1: t1.getBBox().width + 20 };
    });
    // Pastille de réaction de l'équipe, au coin de la bulle : « ? » puis ✓
    const ask = el('g', {}, g);
    el('circle', { cx: 0, cy: 0, r: 12, fill: C.red, stroke: C.white, 'stroke-width': 2.5 }, ask);
    text(ask, 0, 5.5, '?', { size: 16, weight: 800, fill: C.white, anchor: 'middle' });
    const ok = el('g', {}, g);
    el('circle', { cx: 0, cy: 0, r: 12, fill: C.green, stroke: C.white, 'stroke-width': 2.5 }, ok);
    checkPath(ok, 0, 0, 1.3, C.white, 2.6);
    const set = (p, t) => {
      let x = BX + PAD;
      chips.forEach((c, k) => {
        const q = easeInOut(clamp((p - 0.16 - 0.13 * k) / 0.42));
        const w = lerp(c.w0, c.w1, q);
        [c.clip, c.r0, c.r1].forEach(n => { n.setAttribute('x', f2(x)); n.setAttribute('width', f2(w)); });
        c.r1.setAttribute('opacity', f2(q));
        c.t0.setAttribute('x', f2(x + w / 2));
        c.t1.setAttribute('x', f2(x + w / 2));
        const qa = clamp(q / 0.45), qb = clamp((q - 0.5) / 0.5);   // l'ancien mot sort par le haut, puis le nouveau entre
        c.t0.setAttribute('transform', qa ? `translate(0 ${f2(-16 * easeIn(qa))})` : '');
        c.t0.setAttribute('opacity', f2(1 - qa));
        c.t1.setAttribute('transform', qb < 1 ? `translate(0 ${f2(16 * (1 - easeOut(qb)))})` : '');
        c.t1.setAttribute('opacity', f2(qb));
        x += w + GAP;
      });
      const right = x - GAP + PAD;
      bubble.setAttribute('width', f2(right - BX));
      const ax = right - 5, ay = BY + 3;
      const pulse = p === 0 ? 1 + 0.09 * Math.max(0, Math.sin(t * Math.PI * 2 / 0.7)) : 1;
      const ka = popScale(1 - clamp((p - 0.74) / 0.12)) * pulse;
      ask.setAttribute('transform', `translate(${f2(ax)} ${ay}) scale(${f2(ka)})`);
      ask.setAttribute('opacity', p < 0.86 ? 1 : 0);
      const kk = popScale(clamp((p - 0.87) / 0.13));
      ok.setAttribute('transform', `translate(${f2(ax)} ${ay}) scale(${f2(kk)})`);
      ok.setAttribute('opacity', p > 0.87 ? 1 : 0);
    };
    set(1, 0);
    chips.forEach((c, k) => { fit(c.t1, VX1, `mot ${NEW[k]}`, VX0); fit(c.t0, VX1, `mot ${OLD[k]}`, VX0); });
    fit(bubble, VX1 - 14, 'bulle du vocabulaire', VX0);
    return set;
  }

  // 2 · Le plan : la zone du chantier se resserre de moitié, l'ancien contour reste en pointillés
  function vizPlan(g, cy) {
    const PX = VX0 + 2, PW = 368, PY = cy - 40, PH = 80;
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
    el('line', { x1: PX + 14, y1: cy, x2: PX + PW - 14, y2: cy, stroke: '#e2e2ee', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
    const SX = c => PX + 24 + c * 56;
    const st = [];
    for (let c = 0; c < 6; c++) for (const y of [cy - 30, cy + 8]) {
      const sg = el('g', {}, g);
      el('rect', { x: SX(c), y, width: 40, height: 22, rx: 5, fill: GREY }, sg);
      const hi = el('rect', { x: SX(c), y, width: 40, height: 22, rx: 5, fill: C.lightBlue, opacity: 0 }, sg);
      el('rect', { x: SX(c) + 12, y: y + 7, width: 16, height: 8, rx: 2, fill: C.white, 'fill-opacity': 0.75 }, sg);
      st.push({ sg, hi, c });
    }
    const Z = { x: PX + 14, y: cy - 36, h: 72, w0: 344, w1: 172 };
    const ghost = el('rect', { x: Z.x, y: Z.y, width: Z.w0, height: Z.h, rx: 9, fill: 'none', stroke: MUTED, 'stroke-width': 2, 'stroke-dasharray': '3 6', 'stroke-linecap': 'round', opacity: 0 }, g);
    const zr = el('rect', { x: Z.x, y: Z.y, height: Z.h, rx: 9, fill: C.red, 'fill-opacity': 0.08, stroke: C.red, 'stroke-width': 3, 'stroke-dasharray': '9 6' }, g);
    const zg = el('rect', { x: Z.x, y: Z.y, height: Z.h, rx: 9, fill: C.green, 'fill-opacity': 0.1, stroke: C.green, 'stroke-width': 3, 'stroke-dasharray': '9 6' }, g);
    const half = el('g', {}, g);
    const hx = Z.x + Z.w1 + (Z.w0 - Z.w1) / 2;
    el('rect', { x: hx - 25, y: cy - 13, width: 50, height: 26, rx: 13, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, half);
    fit(text(half, hx, cy + 6, '÷ 2', { size: 17, weight: 800, fill: MUTED, anchor: 'middle' }), hx + 25, 'moitié', hx - 25);
    return (p, t) => {
      const z = clamp((p - 0.1) / 0.6);
      const w = lerp(Z.w0, Z.w1, z <= 0 ? 0 : z >= 1 ? 1 : back(z, 1.1));
      const gc = clamp((p - 0.45) / 0.12);
      const ants = f2(-((t * 24) % 15));               // contour qui défile (boucle exacte : 12,5 s × 24 = 20 × 15)
      [zr, zg].forEach(n => { n.setAttribute('width', f2(w)); n.setAttribute('stroke-dashoffset', ants); });
      zr.setAttribute('opacity', f2(1 - gc));
      zg.setAttribute('opacity', f2(gc));
      ghost.setAttribute('opacity', f2(0.8 * clamp((p - 0.12) / 0.2)));
      st.forEach(s => {
        if (s.c >= 3) s.sg.setAttribute('opacity', f2(lerp(1, 0.38, clamp((p - 0.4) / 0.3))));
        else s.hi.setAttribute('opacity', f2(clamp((p - 0.55 - 0.06 * s.c) / 0.2)));
      });
      const kh = popScale(clamp((p - 0.7) / 0.25));
      half.setAttribute('opacity', p > 0.7 ? 1 : 0);
      half.setAttribute('transform', scaleAt(hx, cy, kh));
    };
  }

  // 3 · La liste : quarante actions se replient, cinq restent et prennent leur place
  const KEEP = [2, 13, 25, 17, 39];                 // cinq actions dispersées, sans croisement en montant
  const KEEP_LEN = [252, 206, 282, 228, 186];
  function vizList(g, cy) {
    const bars = [];
    for (let i = 0; i < 40; i++) {
      const c = Math.floor(i / 10), r = i % 10;
      const x = VX0 + 4 + c * 92, y = cy - 36 + r * 8, len = 34 + ((i * 37 + 11) % 31);
      const k = KEEP.indexOf(i);
      const bg = el('g', {}, g);
      const box = el('rect', { x, y: y - 2, width: 4, height: 4, rx: 1, fill: GREY }, bg);
      const ln = el('rect', { x: x + 8, y: y - 1.5, width: len, height: 3, rx: 1.5, fill: BAR }, bg);
      bars.push({ bg, box, ln, x, y, len, k });
    }
    const drop = bars.filter(b => b.k < 0).reverse();     // les dernières partent en premier
    drop.forEach((b, o) => { b.c0 = o <= 30 ? 0.04 + o * 0.0095 : 0.325 + (o - 30) * 0.07; });   // les dernières ralentissent
    const count = p => 5 + drop.reduce((a, b) => a + (1 - clamp((p - b.c0) / 0.09)), 0);
    const set = p => {
      drop.forEach(b => {
        const s = clamp((p - b.c0) / 0.09);
        b.bg.setAttribute('opacity', f2(1 - s));
        b.bg.setAttribute('transform', s ? `translate(${f2(b.x)} 0) scale(${f2(Math.max(0.001, 1 - easeIn(s)))} 1) translate(${f2(-b.x)} 0)` : '');
      });
      const hl = clamp(p / 0.1);
      bars.filter(b => b.k >= 0).forEach(b => {
        const m = easeInOut(clamp((p - 0.58 - 0.035 * b.k) / 0.27));
        const yk = cy - 34 + b.k * 17, sz = lerp(4, 10.5, m);
        b.box.setAttribute('x', f2(lerp(b.x, VX0 + 6, m)));
        b.box.setAttribute('y', f2(lerp(b.y - 2, yk - 5.25, m)));
        b.box.setAttribute('width', f2(sz));
        b.box.setAttribute('height', f2(sz));
        b.box.setAttribute('rx', f2(lerp(1, 3.5, m)));
        b.box.setAttribute('fill', mix(mix(GREY, C.blue, hl), C.white, m));
        b.box.setAttribute('stroke', C.blue);
        b.box.setAttribute('stroke-width', f2(2 * m));
        b.ln.setAttribute('x', f2(lerp(b.x + 8, VX0 + 28, m)));
        b.ln.setAttribute('y', f2(lerp(b.y - 1.5, yk - 3.5, m)));
        b.ln.setAttribute('width', f2(lerp(b.len, KEEP_LEN[b.k], m)));
        b.ln.setAttribute('height', f2(lerp(3, 7, m)));
        b.ln.setAttribute('rx', f2(lerp(1.5, 3.5, m)));
        b.ln.setAttribute('fill', mix(mix(BAR, C.blue, hl), C.lightBlue, m));
      });
    };
    set.count = count;
    return set;
  }

  // 4 · La semaine : maintenance et logistique sautent du vendredi au premier jour
  const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
  function vizWeek(g, cy) {
    const DX = d => VX0 + 140 + d * 52;               // centres des jours (538 → 746)
    const hiVen = el('rect', { x: DX(4) - 23, y: cy - 41, width: 46, height: 86, rx: 10, fill: C.pRed }, g);
    const hiLun = el('rect', { x: DX(0) - 23, y: cy - 41, width: 46, height: 86, rx: 10, fill: C.pGreen, opacity: 0 }, g);
    const dayT = DAYS.map((d, k) => {
      const n = text(g, DX(k), cy - 26, d, { size: 13, weight: 700, fill: MUTED, anchor: 'middle' });
      fit(n, VX1, `jour ${d}`, VX0);
      return n;
    });
    const LANES = [{ name: 'Maintenance', color: C.teal, y: cy + 3 }, { name: 'Logistique', color: C.violet, y: cy + 29 }];
    const lanes = LANES.map((L, k) => {
      fit(text(g, VX0 + 106, L.y + 5, L.name, { size: 14, weight: 700, fill: C.ink, anchor: 'end' }), VX0 + 108, `couloir ${L.name}`, VX0);
      el('line', { x1: DX(0) - 18, y1: L.y, x2: DX(4) + 18, y2: L.y, stroke: TRACK, 'stroke-width': 2 }, g);
      const len = DX(4) - DX(0);
      const barN = el('path', { d: `M ${DX(0)} ${L.y} H ${DX(4)}`, stroke: L.color, 'stroke-opacity': 0.45, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-dasharray': len, 'stroke-dashoffset': len }, g);
      const dot = el('g', {}, g);
      el('circle', { cx: 0, cy: 0, r: 10, fill: L.color, stroke: C.white, 'stroke-width': 3 }, dot);
      return { ...L, barN, dot, len };
    });
    return p => {
      hiVen.setAttribute('opacity', f2(1 - clamp((p - 0.15) / 0.25)));
      hiLun.setAttribute('opacity', f2(clamp((p - 0.5) / 0.25)));
      dayT[4].setAttribute('fill', mix(C.tRed, MUTED, clamp((p - 0.15) / 0.25)));
      dayT[0].setAttribute('fill', mix(MUTED, C.tGreen, clamp((p - 0.5) / 0.25)));
      lanes.forEach((L, k) => {
        const s0 = 0.15 + 0.13 * k, h = clamp((p - s0) / 0.42), e = easeInOut(h);
        const x = lerp(DX(4), DX(0), e), y = L.y - 13 * Math.sin(Math.PI * h);
        let sx = 1 + 0.16 * bump(h), sy = sx;
        const u = (p - s0 - 0.42) / 0.09;                // petit tassement à l'atterrissage
        if (u > 0 && u < 1) { const q = Math.sin(Math.PI * u); sx = 1 + 0.22 * q; sy = 1 - 0.2 * q; }
        L.dot.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) scale(${f2(sx)} ${f2(sy)})`);
        if (h > 0 && h < 1) L.dot.setAttribute('filter', 'url(#lift)'); else L.dot.removeAttribute('filter');
        const d = easeInOut(clamp((p - 0.62 - 0.1 * k) / 0.28));
        L.barN.setAttribute('stroke-dashoffset', f2(L.len * (1 - d)));
      });
    };
  }

  // 5 · L'ampoule : elle passe de l'animateur à l'équipe
  function vizIdea(g, cy) {
    const MX = VX0 + 48, TX = [VX0 + 252, VX0 + 298, VX0 + 344], AY = cy + 6, BY = cy - 30;
    const A = { x: MX, y: BY }, B = { x: TX[1], y: BY }, Q = { x: (MX + TX[1]) / 2, y: cy - 52 };
    const bez = u => ({ x: (1 - u) * (1 - u) * A.x + 2 * u * (1 - u) * Q.x + u * u * B.x, y: (1 - u) * (1 - u) * A.y + 2 * u * (1 - u) * Q.y + u * u * B.y });
    const dots = [];
    for (let k = 1; k <= 9; k++) { const u = 0.1 + 0.8 * (k - 1) / 8, pt = bez(u); dots.push({ u, n: el('circle', { cx: f2(pt.x), cy: f2(pt.y), r: 2.3, fill: MUTED, opacity: 0 }, g) }); }
    avatar(g, MX, AY, 17, C.blue);
    [C.teal, C.violet, C.yellow].forEach((c, k) => avatar(g, TX[k], AY, 17, c));
    fit(text(g, MX, cy + 43, 'moi', { size: 13, weight: 700, fill: MUTED, anchor: 'middle' }), VX1, 'moi', VX0);
    fit(text(g, TX[1], cy + 43, 'l’équipe', { size: 13, weight: 700, fill: MUTED, anchor: 'middle' }), VX1, 'l’équipe', VX0);
    const rays = [A, B].map(P => {
      const rg = el('g', {}, g);
      [-90, -45, -135, 0, 180].forEach(a => {
        const r = a * Math.PI / 180;
        el('line', { x1: f2(P.x + 14 * Math.cos(r)), y1: f2(P.y + 14 * Math.sin(r)), x2: f2(P.x + 19 * Math.cos(r)), y2: f2(P.y + 19 * Math.sin(r)), stroke: C.yellow, 'stroke-width': 2.8, 'stroke-linecap': 'round' }, rg);
      });
      return { rg, P };
    });
    const bulb = el('g', {}, g);
    el('circle', { cx: 0, cy: 0, r: 10.5, fill: C.yellow }, bulb);
    el('path', { d: 'M -5 -3 A 6 6 0 0 1 -1 -6.5', fill: 'none', stroke: C.white, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, bulb);
    el('rect', { x: -5, y: 9, width: 10, height: 3.5, rx: 1.5, fill: '#9d9dc0' }, bulb);
    el('rect', { x: -4, y: 13.5, width: 8, height: 3, rx: 1.5, fill: '#9d9dc0' }, bulb);
    return (p, t) => {
      const b = clamp((p - 0.16) / 0.52), e = easeInOut(b);
      const pt = bez(e);
      let y = pt.y;
      const u = (p - 0.68) / 0.12;
      if (u > 0 && u < 1) y -= 5 * Math.sin(Math.PI * u) * (1 - u);
      const k = 1 + 0.12 * bump(b);
      bulb.setAttribute('transform', `translate(${f2(pt.x)} ${f2(y)}) rotate(${f2(-12 * Math.sin(2 * Math.PI * b))}) scale(${f2(k)})`);
      if (b > 0 && b < 1) bulb.setAttribute('filter', 'url(#lift)'); else bulb.removeAttribute('filter');
      dots.forEach(d => d.n.setAttribute('opacity', f2(0.55 * clamp((e - d.u) / 0.06))));
      const glow = 1 + 0.06 * Math.sin(t * Math.PI * 2 / 1.25);   // 10 battements par boucle
      const r0 = 1 - clamp((p - 0.1) / 0.07), r1 = clamp((p - 0.72) / 0.14);
      rays[0].rg.setAttribute('opacity', f2(r0));
      rays[0].rg.setAttribute('transform', scaleAt(A.x, A.y, r0 > 0 ? glow : 1));
      rays[1].rg.setAttribute('opacity', f2(r1));
      rays[1].rg.setAttribute('transform', scaleAt(B.x, B.y, popScale(r1) * glow));
    };
  }

  const S = { rows: [] };

  function build() {
    D.template({ author: 'hugo' });
    D.title('Premier chantier,', 'cinq réglages.');
    D.chapeau(`Si je pouvais revenir juste avant, je me donnerais cinq conseils.`);

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Le panneau est d’abord réglé ', 0], ['comme la première fois', C.tRed], [', puis chaque réglage ', 0], ['bascule', C.tGreen], ['.', 0]]);
    line(384, [['Avec le recul, tous parlent de ', 0], ['la façon de travailler avec les gens', C.blue], ['.', 0]]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-60%', y: '-60%', width: '220%', height: '240%' }, defs);
    el('feDropShadow', { dx: 0, dy: 6, stdDeviation: 4, 'flood-color': C.ink, 'flood-opacity': 0.25 }, lift);
    const knobF = el('filter', { id: 'knob', x: '-40%', y: '-40%', width: '180%', height: '200%' }, defs);
    el('feDropShadow', { dx: 0, dy: 1.5, stdDeviation: 1.5, 'flood-color': C.ink, 'flood-opacity': 0.25 }, knobF);
    const ptrF = el('filter', { id: 'ptr', x: '-50%', y: '-50%', width: '220%', height: '220%' }, defs);
    el('feDropShadow', { dx: 1.5, dy: 3, stdDeviation: 2.5, 'flood-color': C.ink, 'flood-opacity': 0.3 }, ptrF);

    // ----- Cadre du panneau -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // Compteur des réglages corrigés (en haut à droite) : engrenage, cinq cases, « 5/5 »
    S.count = text(D.svg, 988, PILL_Y + 7.5, '5/5', { size: 21, weight: 800, fill: C.tGreen, anchor: 'end' });
    fit(S.count, 990, 'compteur 5/5', 900);
    const cb = S.count.getBBox();
    S.countC = [cb.x + cb.width / 2, PILL_Y];
    const sqR = cb.x - 14;
    S.squares = [0, 1, 2, 3, 4].map(k => el('rect', { x: sqR - 104 + 22 * k, y: PILL_Y - 8, width: 16, height: 16, rx: 4.5, 'stroke-width': 2 }));
    S.gear = gear(D.svg, sqR - 128, PILL_Y, 1.05, C.blue);
    const PILL_MAX = sqR - 128 - 30;

    // ----- Les cinq réglages -----
    const VIZ = [vizVocab, vizPlan, vizList, vizWeek, vizIdea];
    SETTINGS.forEach((s, i) => {
      const y0 = rowTop(i), cy = y0 + RH / 2;
      const g = el('g');
      el('rect', { x: RX, y: y0, width: RW, height: RH, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
      const accent = el('rect', { x: RX + 12, y: y0 + 22, width: 6, height: RH - 44, rx: 3, fill: C.green }, g);
      el('circle', { cx: 136, cy, r: 19, fill: C.blue }, g);
      text(g, 136, cy + 7, String(i + 1), { size: 19, weight: 800, fill: C.white, anchor: 'middle' });
      fit(text(g, 168, cy - 3, s.name, { size: 21, weight: 800, fill: C.ink }), SCR.x - 14, `nom ${i + 1}`);
      fit(text(g, 168, cy + 23, s.sub, { size: 16, weight: 500, fill: MUTED }), SCR.x - 14, `précision ${i + 1}`);
      el('rect', { x: SCR.x, y: y0 + 10, width: SCR.w, height: RH - 20, rx: 14, fill: SCREEN }, g);
      const viz = VIZ[i](el('g', {}, g), cy);
      const cg = el('g', {}, g);
      const ctrl = i === 1 ? sliderCtrl(cg, cy) : i === 2 ? stepperCtrl(cg, cy, 'stepper') : i === 4 ? segmentedCtrl(cg, cy) : toggleCtrl(cg, cy);
      const label = valueLabels(g, cy, s.before, s.after, `val${i}`);
      const focus = el('rect', { x: RX - 3, y: y0 - 3, width: RW + 6, height: RH + 6, rx: 21, fill: 'none', stroke: C.blue, 'stroke-width': 3, opacity: 0 });
      S.rows.push({ cy, accent, viz, ctrl, label, focus });
    });

    // ----- Pastilles d'étape (en haut à gauche du panneau) -----
    S.pillDefs = [
      { t: T_RW0, label: 'Retour juste avant le premier chantier', style: { bg: C.pLav, fg: C.blue, icon: 'rewind' } },
      { t: T_FIRST, label: 'Réglé comme la première fois', style: { bg: C.pRed, fg: C.tRed, icon: 'alert' } },
      ...SETTINGS.map((s, i) => ({ t: T_STEP[i], label: `${i + 1}${NB}·${NB}${s.step}`, style: { bg: C.blue, fg: C.white } })),
      { t: T_END, label: 'Aucun réglage ne parle d’outils', style: { bg: C.pGreen, fg: C.tGreen, icon: 'check' }, final: true },
    ];
    S.pills = S.pillDefs.map((d, i) => {
      const g = pillShape(D.svg, 92, PILL_Y, d.label, d.style);
      fit(g, PILL_MAX, `pastille ${i + 1}`);
      return g;
    });

    // ----- Le pointeur et l'onde du clic -----
    S.ripple = el('circle', { cx: 0, cy: 0, r: 10, fill: 'none', stroke: C.blue, 'stroke-width': 2.5, opacity: 0 });
    S.ptr = el('g', { filter: 'url(#ptr)' });
    S.ptrBody = el('path', { d: 'M 0 0 L 0 23 L 5.8 17.6 L 9.8 26.4 L 13.8 24.6 L 9.9 15.9 L 17.4 15.9 Z', fill: C.white, stroke: C.ink, 'stroke-width': 2, 'stroke-linejoin': 'round' }, S.ptr);

    D.encart(['Les fondamentaux du Lean', 'La White Belt gratuite', '(lien en commentaire)']);
  }

  // ---------- Pointeur : va de commande en commande, clique, maintient (curseur, compteur) ----------
  const ENTRY = { x: CC + 70, y: rowTop(1) + 30 };
  function pointer(t, P) {
    const ENTER = T_STEP[0] - 0.25;
    if (t < ENTER || t >= T_PTR_OUT + 0.45) return null;
    let i = 0;
    for (let k = 4; k >= 0; k--) if (t >= T_STEP[k]) { i = k; break; }
    const to = S.rows[i].ctrl.target(P[i]);
    const from = i === 0 ? ENTRY : S.rows[i - 1].ctrl.target(P[i - 1]);
    const q = i === 0 ? easeInOut(prog(t, ENTER, T_STEP[0] + 0.45 - ENTER)) : easeInOut(prog(t, T_STEP[i], 0.45));
    let x = lerp(from.x, to.x, q) + 22 * Math.sin(Math.PI * q), y = lerp(from.y, to.y, q), o = i === 0 ? prog(t, ENTER, 0.25) : 1;
    if (t > T_PTR_OUT) { const e = prog(t, T_PTR_OUT, 0.45); x += 46 * easeIn(e); y += 34 * easeIn(e); o = 1 - e; }
    const c = S.rows[i].ctrl;
    let press = bump(prog(t, T_CLICK[i] - 0.07, 0.2));
    if (c.hold && c.hold(P[i])) press = 1;
    return { x, y, o, k: 1 - 0.14 * press };
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const P = SETTINGS.map((_, i) => pRow(i, t));

    S.rows.forEach((r, i) => {
      const p = P[i];
      r.accent.setAttribute('fill', mix(C.red, C.green, clamp((p - FLIP[i] - 0.1) / 0.08)));
      r.label(p, FLIP[i]);
      r.viz(p, t);
      if (i === 2) r.ctrl.set(p, r.viz.count(p)); else r.ctrl.set(p);
      // Contour bleu sur le réglage en cours
      const next = i < 4 ? T_STEP[i + 1] : T_END;
      r.focus.setAttribute('opacity', f2(prog(t, T_STEP[i], 0.25) * (1 - prog(t, next, 0.25))));
    });

    // Compteur des réglages corrigés et engrenage qui tourne d'un cran par réglage
    const n = P.filter((p, i) => p >= COUNT_AT[i]).length;
    S.count.textContent = `${n}/5`;
    S.count.setAttribute('fill', n === 5 ? C.tGreen : n === 0 ? C.tRed : C.ink);
    let kc = 1;
    T_CLICK.forEach((tc, i) => { kc += 0.22 * bump(prog(t, tc + COUNT_AT[i] * CORR[i], 0.3)); });
    S.count.setAttribute('transform', scaleAt(S.countC[0], S.countC[1], kc));
    S.squares.forEach((sq, i) => {
      const g = clamp((P[i] - COUNT_AT[i] + 0.05) / 0.1);
      sq.setAttribute('fill', mix(C.pRed, C.green, g));
      sq.setAttribute('stroke', mix(C.red, C.green, g));
    });
    S.gear.set(72 * P.reduce((a, p) => a + easeInOut(p), 0));

    // Pointeur et onde du clic
    const pt = pointer(t, P);
    if (pt) {
      S.ptr.setAttribute('opacity', f2(pt.o));
      S.ptr.setAttribute('transform', `translate(${f2(pt.x)} ${f2(pt.y)}) scale(${f2(pt.k)})`);
    } else S.ptr.setAttribute('opacity', 0);
    let ro = 0;
    S.rows.forEach((r, i) => {
      const q = prog(t, T_CLICK[i], 0.42);
      if (q > 0 && q < 1) {
        ro = 0.55 * (1 - q);
        S.ripple.setAttribute('cx', r.ctrl.ripple.x);
        S.ripple.setAttribute('cy', r.ctrl.ripple.y);
        S.ripple.setAttribute('r', f2(10 + 22 * easeOut(q)));
      }
    });
    S.ripple.setAttribute('opacity', f2(ro));

    // Pastilles d'étape : l'ancienne sort, puis la nouvelle entre
    S.pills.forEach((g, i) => {
      const d = S.pillDefs[i];
      const a = d.t + 0.15, b = i + 1 < S.pills.length ? S.pillDefs[i + 1].t : Infinity;
      let o, dy = 0;
      if (d.final && t < T_RW0 + 0.14) o = 1 - prog(t, T_RW0, 0.14);
      else { o = prog(t, a, 0.25) * (1 - prog(t, b, 0.14)); dy = 8 * (1 - prog(t, a, 0.25)); }
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
      if (g.icon) g.icon.setAttribute('opacity', f2(0.55 + 0.45 * Math.cos((t - a) * Math.PI * 2 / 0.6)));
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
