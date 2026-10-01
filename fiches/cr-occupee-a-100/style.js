// Style propre à cette fiche (reconstruction : image complète 1,2 s, effacement, retour dans l'ordre de lecture).
// Construit sur outils/da.js ; expose window.Gabarit pour fiche.js. Ne pas partager entre fiches.
(() => {
  const D = window.DA;
  const { W, H, C, svg, el, text, measure, fit } = D;

  // Chute en deux lignes (30 px, gras, bleu), au-dessus de l'encart
  function chute(l1, l2, parent) {
    const g = parent || el('g');
    fit(text(g, 62, 1108, l1, { size: 30, weight: 700, fill: C.blue }), 1020, 'chute ligne 1');
    fit(text(g, 62, 1148, l2, { size: 30, weight: 700, fill: C.blue }), 1020, 'chute ligne 2');
    return g;
  }
  // ---------- Easing ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.3; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  function invEaseInOut(y) {
    let lo = 0, hi = 1;
    for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (easeInOut(m) < y) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  // Image complète jusqu'à 1,2 s, effacement du contenu en 0,4 s, puis reconstruction.
  const FADE_START = 1.2, FADE_END = 1.6;
  const fading = t => t >= FADE_START && t < FADE_END;
  const fadeOut = t => 1 - prog(t, FADE_START, FADE_END - FADE_START);

  // Pop avec léger rebond (l'état final est exactement l'identité)
  function pop(g, t, start, cx, cy, dur = 0.35) {
    let s = 1, o = 1;
    if (fading(t)) o = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, start, dur);
      s = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p);
      o = clamp(p / 0.4);
    }
    g.setAttribute('transform', s === 1 ? '' : `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`);
    g.setAttribute('opacity', o);
  }
  // Glisse depuis la gauche
  function slide(g, t, start, dur = 0.45, dx = -140) {
    let x = 0, o = 1;
    if (fading(t)) o = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, start, dur);
      x = p >= 1 ? 0 : dx * (1 - easeOut(p));
      o = clamp(p / 0.5);
    }
    g.setAttribute('transform', x === 0 ? '' : `translate(${x} 0)`);
    g.setAttribute('opacity', o);
  }
  // Monte en fondu
  function rise(g, t, start, dur = 0.4, dy = 18) {
    let y = 0, o = 1;
    if (fading(t)) o = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, start, dur);
      y = p >= 1 ? 0 : dy * (1 - easeOut(p));
      o = clamp(p / 0.6);
    }
    g.setAttribute('transform', y === 0 ? '' : `translate(0 ${y})`);
    g.setAttribute('opacity', o);
  }

  // ---------- Pictos et vocabulaire ----------
  function check(parent, cx, cy, r, bg = C.green) {
    el('circle', { cx, cy, r, fill: bg }, parent);
    const k = r / 26;
    el('path', {
      d: `M ${cx - 10 * k} ${cy + 1 * k} L ${cx - 3 * k} ${cy + 8 * k} L ${cx + 11 * k} ${cy - 7 * k}`,
      fill: 'none', stroke: C.white, 'stroke-width': 5 * k, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, parent);
  }
  function cross(parent, cx, cy, r, bg = C.red) {
    el('circle', { cx, cy, r, fill: bg }, parent);
    const d = 8.5 * r / 26;
    el('path', {
      d: `M ${cx - d} ${cy - d} L ${cx + d} ${cy + d} M ${cx + d} ${cy - d} L ${cx - d} ${cy + d}`,
      fill: 'none', stroke: C.white, 'stroke-width': 5 * r / 26, 'stroke-linecap': 'round',
    }, parent);
  }
  // Pastille numérotée bleue
  function badgeNum(parent, cx, cy, n, r = 20) {
    el('circle', { cx, cy, r, fill: C.blue }, parent);
    text(parent, cx, cy + r * 0.375, String(n), { size: r * 1.05, weight: 700, fill: C.white, anchor: 'middle' });
  }
  // Étiquette en pilule ; icon: 'check' | 'cross' | null
  function pill(parent, x, cy, label, { size = 21, bg = C.pLav, fg = C.blue, h = 36, pad = 16, icon = null, anchor = 'start' } = {}) {
    const g = el('g', {}, parent);
    const r = el('rect', { y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iconW = icon ? 26 : 0;
    const tx = text(g, 0, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    const w = measure(tx).width + pad * 2 + iconW;
    const x0 = anchor === 'middle' ? x - w / 2 : x;
    r.setAttribute('x', x0);
    r.setAttribute('width', w);
    tx.setAttribute('x', x0 + pad + iconW);
    if (icon === 'check') check(g, x0 + pad + 9, cy, 10, C.green);
    if (icon === 'cross') cross(g, x0 + pad + 9, cy, 10, C.red);
    return { g, w, x: x0, tx };
  }
  const card = (x, y, w, h, parent = svg) => el('rect', { x, y, width: w, height: h, rx: 24, fill: C.card, stroke: C.line, 'stroke-width': 2 }, parent);

  // ---------- Caméra ----------
  // Le contenu passe dans un calque « monde » que la caméra zoome ; le cadre fixe reste en place,
  // ce qui garde le GIF léger (le papier ne change pas d'une image à l'autre).
  let world = null;
  function cameraLayer() {
    if (world) return world;
    const holder = el('g', { 'clip-path': clipRect(0, 0, W, 1332).url });
    world = el('g', {}, holder);
    [...svg.children].forEach(n => {
      if (n === holder || n.tagName === 'defs' || n.hasAttribute('data-frame')) return;
      world.appendChild(n);
    });
    return world;
  }
  // Plans : [{ t, cx, cy, w, cut? }]. Entre deux plans, travelling en easeInOut ; cut: true = coupe franche.
  function camera(t, shots) {
    let v = shots[0];
    for (let i = 0; i < shots.length - 1; i++) {
      const a = shots[i], b = shots[i + 1];
      if (t < a.t) break;
      if (t >= b.t) { v = b; continue; }
      if (b.cut) { v = a; break; }
      const e = easeInOut(prog(t, a.t, b.t - a.t));
      v = { cx: a.cx + (b.cx - a.cx) * e, cy: a.cy + (b.cy - a.cy) * e, w: a.w + (b.w - a.w) * e };
      break;
    }
    const w = v.w, h = w * H / W;
    const x = clamp(v.cx - w / 2, 0, W - w), y = clamp(v.cy - h / 2, 0, H - h);
    const k = W / w;
    cameraLayer().setAttribute('transform', w >= W ? '' : `translate(${-x * k} ${-y * k}) scale(${k})`);
  }
  // Contour qui se dessine autour d'un élément (stroke-dashoffset)
  function outline(x, y, w, h, parent = svg) {
    const r = el('rect', { x, y, width: w, height: h, rx: 20, fill: 'none', stroke: C.blue, 'stroke-width': 4, opacity: 0 }, parent);
    const len = 2 * (w + h);
    r.setAttribute('stroke-dasharray', len);
    return (t, t0, t1) => {
      const p = easeOut(prog(t, t0, 0.45));
      r.setAttribute('stroke-dashoffset', len * (1 - p));
      r.setAttribute('opacity', t >= t0 && t < t1 ? 1 : 0);
    };
  }
  // Zone de découpe animable (volet) : renvoie l'id à mettre en clip-path et le rectangle
  let clipN = 0;
  function clipRect(x = 0, y = 0, w = W, h = H) {
    const id = `clip${++clipN}`;
    const defs = svg.querySelector('defs') || el('defs');
    const cp = el('clipPath', { id }, defs);
    const r = el('rect', { x, y, width: w, height: h }, cp);
    return { url: `url(#${id})`, rect: r };
  }

  window.Gabarit = {
    ...D,
    clamp, prog, easeOut, easeInOut, back, invEaseInOut,
    FADE_START, FADE_END, fading, fadeOut, pop, slide, rise,
    check, cross, badgeNum, pill, card, chute,
    camera, outline, clipRect,
  };
})();
