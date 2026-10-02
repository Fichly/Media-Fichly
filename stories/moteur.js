// Moteur des stories Fichly : vidéos verticales 1080 × 1920 de 15 s, une par outil du deck.
// Charge avant scene.js. La scène appelle Story.scene({...}) ; le moteur pose le décor commun
// (fond de la famille, fiche blanche, bandeau, nom de l'outil, accroche, « À retenir », fin)
// et la scène ne dessine que le mécanisme de l'outil dans ZONE.
// Rendu déterministe : window.FICHE.draw(t), t en secondes. node outils/rendu.js stories/<id> story
(() => {
  const W = 1080, H = 1920, DURATION = 15;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('stage');

  // Palette du site (maquettes V2)
  const C = {
    indigo: '#3c4499', indigo700: '#2e3576', indigo100: '#e4e5f3', indigo050: '#f3f4fb',
    navy: '#151b43', green: '#8cc978', greenSoft: '#e8f4e3', ok: '#2f5a1f',
    coral: '#f16969', coralSoft: '#fce5e5', ko: '#a83434',
    yellow: '#e6b839', yellowSoft: '#faf0d7', wait: '#6b5205',
    blue: '#74a3d6', blueSoft: '#e3ecf6', rust: '#b35a23', rustSoft: '#f2e2d5',
    ink: '#2c2c2c', ink700: '#4a4a4a', ink500: '#6b6b6b', line: '#e5e5e5', surface: '#f7f7f7', white: '#ffffff',
  };
  const RIBBON = [C.indigo, C.green, C.coral, C.yellow, C.blue, C.rust];
  // Une couleur par famille, dans l'ordre du liseré. 0 = le deck entier.
  const FAM = {
    0: { c: C.indigo, soft: C.indigo050, on: C.white, label: 'Le deck' },
    1: { c: C.indigo, soft: C.indigo100, on: C.white, label: 'Résolution de problèmes' },
    2: { c: C.green, soft: C.greenSoft, on: C.ink, label: 'Engagement et visualisation' },
    3: { c: C.coral, soft: C.coralSoft, on: C.ink, label: 'Planification et stratégie' },
    4: { c: C.yellow, soft: C.yellowSoft, on: C.ink, label: 'Optimisation des flux' },
    5: { c: C.blue, soft: C.blueSoft, on: C.ink, label: 'Efficacité de production' },
    6: { c: C.rust, soft: C.rustSoft, on: C.white, label: 'Amélioration de la production' },
  };

  // Géométrie commune
  const CARD = { x: 56, y: 200, w: 968, h: 1500, r: 40 };
  const BAND_H = 120;
  const PAD = 48;                                   // marge intérieure de la fiche
  const ZONE = { x: 100, y: 600, w: 880, h: 800 };  // mécanisme de l'outil
  const T = { hookIn: 0.45, hookOut: 2.8, mecaIn: 3.0, retenir: 11.5, fin: 14.0 };

  // ---------- SVG ----------
  function el(tag, attrs = {}, parent = svg) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, str, { size = 40, weight = 600, fill = C.ink, anchor = 'start', italic = false, ls = 0 } = {}) {
    const t = el('text', {
      x, y, 'font-family': 'Montserrat', 'font-size': size, 'font-weight': weight, fill, 'text-anchor': anchor,
      ...(italic ? { 'font-style': 'italic' } : {}), ...(ls ? { 'letter-spacing': ls } : {}),
    }, parent);
    t.textContent = str;
    return t;
  }
  const measure = n => n.getBBox();
  const width = n => n.getComputedTextLength();
  // Texte sur plusieurs lignes, coupé aux espaces. Renvoie { g, lines, h }.
  function wrap(parent, x, y, str, maxW, opts = {}, lineH = (opts.size || 40) * 1.22) {
    const g = el('g', {}, parent);
    const words = str.split(' ');
    const lines = [];
    let cur = '';
    const probe = text(g, x, y, '', opts);
    for (const w of words) {
      const tryS = cur ? cur + ' ' + w : w;
      probe.textContent = tryS;
      if (width(probe) > maxW && cur) { lines.push(cur); cur = w; } else cur = tryS;
    }
    if (cur) lines.push(cur);
    probe.remove();
    const nodes = lines.map((l, i) => text(g, x, y + i * lineH, l, opts));
    nodes.forEach((n, i) => fit(n, x + maxW + (opts.anchor === 'middle' ? maxW / 2 : 0), `ligne ${i + 1} de « ${str.slice(0, 24)}… »`, (opts.anchor === 'middle' ? x - maxW / 2 : x) - 4));  // 4 px : approche des capitales
    return { g, lines: nodes, h: lines.length * lineH };
  }

  // Contrôle des débordements : signalés par console.error, ce qui fait échouer le rendu
  const checks = [];
  const fit = (node, maxRight, label, minLeft = 0) => checks.push({ node, maxRight, minLeft, label });
  function checkAll() {
    for (const { node, maxRight, minLeft, label } of checks) {
      const b = measure(node);
      if (b.x + b.width > maxRight + 0.5 || b.x < minLeft - 0.5)
        console.error(`Débordement : ${label} (${Math.round(b.x)} → ${Math.round(b.x + b.width)}, bornes ${Math.round(minLeft)} → ${Math.round(maxRight)})`);
    }
  }
  function inZone(node, label) {
    const b = measure(node);
    if (b.x < ZONE.x - 0.5 || b.y < ZONE.y - 0.5 || b.x + b.width > ZONE.x + ZONE.w + 0.5 || b.y + b.height > ZONE.y + ZONE.h + 0.5)
      console.error(`Hors zone : ${label} (${Math.round(b.x)},${Math.round(b.y)} → ${Math.round(b.x + b.width)},${Math.round(b.y + b.height)})`);
  }

  // ---------- Temps ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.4; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };

  // Apparition déterministe d'un groupe : invisible avant start, en place après start + dur.
  // from : 'up' (monte), 'down', 'left', 'right', 'pop' (rebond depuis cx, cy), 'fade'.
  // out : instant de disparition (fondu de 0,35 s), optionnel.
  function show(g, t, start, { dur = 0.45, from = 'up', d = 36, cx = 0, cy = 0, out = null, outDur = 0.35, min = 0 } = {}) {
    const p = prog(t, start, dur);
    let o = from === 'pop' ? clamp(p / 0.35) : easeOut(p);
    let tr = '';
    if (p < 1) {
      const k = 1 - easeOut(p);
      if (from === 'up') tr = `translate(0 ${d * k})`;
      else if (from === 'down') tr = `translate(0 ${-d * k})`;
      else if (from === 'left') tr = `translate(${-d * k} 0)`;
      else if (from === 'right') tr = `translate(${d * k} 0)`;
      else if (from === 'pop') { const s = p <= 0 ? 0.001 : 0.55 + 0.45 * back(p); tr = `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`; }
    }
    if (out !== null) o *= 1 - prog(t, out, outDur);
    o = Math.max(min, o);
    g.setAttribute('transform', tr);
    g.setAttribute('opacity', o.toFixed(3));
    return o;
  }
  // Tracé progressif d'une ligne ou d'un chemin (pathLength normalisé à 1)
  function stroke(node, t, start, dur = 0.6, ease = easeInOut) {
    if (!node.hasAttribute('pathLength')) { node.setAttribute('pathLength', 1); node.setAttribute('stroke-dasharray', '1 1'); }
    const p = ease(prog(t, start, dur));
    node.setAttribute('stroke-dashoffset', (1 - p).toFixed(4));
    node.setAttribute('opacity', p > 0 ? 1 : 0);
    return p;
  }
  // Compteur : écrit la valeur interpolée dans un nœud texte
  function count(node, t, start, dur, from, to, fmt = v => String(Math.round(v))) {
    node.textContent = fmt(lerp(from, to, easeOut(prog(t, start, dur))));
  }
  // Largeur animée d'une barre (rect), depuis x fixe ; vertical: true pour une barre montante depuis le bas
  function grow(rect, t, start, dur, full, { vertical = false, base = 0 } = {}) {
    const v = full * easeOut(prog(t, start, dur));
    if (vertical) { rect.setAttribute('height', v.toFixed(2)); rect.setAttribute('y', (base - v).toFixed(2)); }
    else rect.setAttribute('width', v.toFixed(2));
    return v;
  }

  // ---------- Vocabulaire graphique ----------
  function box(parent, x, y, w, h, { fill = C.white, rx = 18, stroke: s = null, sw = 3, dash = null } = {}) {
    return el('rect', { x, y, width: w, height: h, rx, fill, ...(s ? { stroke: s, 'stroke-width': sw } : {}), ...(dash ? { 'stroke-dasharray': dash } : {}) }, parent);
  }
  // Pastille de texte ; renvoie { g, w, h }
  function pill(parent, x, cy, label, { size = 30, weight = 700, bg = C.indigo100, fg = C.indigo, h = 58, pad = 24, anchor = 'start' } = {}) {
    const g = el('g', {}, parent);
    const r = el('rect', { y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const tx = text(g, 0, cy + size * 0.36, label, { size, weight, fill: fg });
    const w = width(tx) + pad * 2;
    const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    r.setAttribute('x', x0); r.setAttribute('width', w);
    tx.setAttribute('x', x0 + pad);
    return { g, w, h, x: x0 };
  }
  function check(parent, cx, cy, r, bg = C.green, fg = C.ink) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: bg }, g);
    const k = r / 26;
    el('path', { d: `M ${cx - 10 * k} ${cy + 1 * k} L ${cx - 3 * k} ${cy + 8 * k} L ${cx + 11 * k} ${cy - 7 * k}`, fill: 'none', stroke: fg, 'stroke-width': 5 * k, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function cross(parent, cx, cy, r, bg = C.coral, fg = C.ink) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: bg }, g);
    const d = 8.5 * r / 26;
    el('path', { d: `M ${cx - d} ${cy - d} L ${cx + d} ${cy + d} M ${cx + d} ${cy - d} L ${cx - d} ${cy + d}`, fill: 'none', stroke: fg, 'stroke-width': 5 * r / 26, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // Flèche droite avec pointe pleine ; renvoie { g, line, head }
  function arrow(parent, x1, y1, x2, y2, { color = C.ink, sw = 6, head = 22 } = {}) {
    const g = el('g', {}, parent);
    const a = Math.atan2(y2 - y1, x2 - x1);
    const bx = x2 - Math.cos(a) * head * 0.9, by = y2 - Math.sin(a) * head * 0.9;
    const line = el('line', { x1, y1, x2: bx, y2: by, stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }, g);
    const p = (ang, r) => `${x2 - Math.cos(a + ang) * r} ${y2 - Math.sin(a + ang) * r}`;
    const headN = el('path', { d: `M ${x2} ${y2} L ${p(0.45, head)} L ${p(-0.45, head)} Z`, fill: color }, g);
    return { g, line, head: headN };
  }
  // Chronomètre ; renvoie l'aiguille (rotation autour de cx, cy) et le groupe
  function clock(parent, cx, cy, r, { color = C.ink, bg = C.white } = {}) {
    const g = el('g', {}, parent);
    el('rect', { x: cx - r * 0.18, y: cy - r * 1.32, width: r * 0.36, height: r * 0.22, rx: r * 0.06, fill: color }, g);
    el('circle', { cx, cy, r, fill: bg, stroke: color, 'stroke-width': Math.max(4, r * 0.12) }, g);
    const hand = el('line', { x1: cx, y1: cy, x2: cx, y2: cy - r * 0.68, stroke: color, 'stroke-width': Math.max(4, r * 0.1), 'stroke-linecap': 'round' }, g);
    el('circle', { cx, cy, r: r * 0.1, fill: color }, g);
    return { g, hand, turn: deg => hand.setAttribute('transform', `rotate(${deg} ${cx} ${cy})`) };
  }

  // ---------- Décor commun ----------
  const S = {};
  let SCENE = null;

  function template(sc) {
    const fam = FAM[sc.famille];
    S.fam = fam;
    const defs = el('defs');
    const sh = el('filter', { id: 'ombre', x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
    el('feDropShadow', { dx: 0, dy: 18, stdDeviation: 22, 'flood-color': '#151b43', 'flood-opacity': 0.13 }, sh);
    const clip = el('clipPath', { id: 'fiche' }, defs);
    el('rect', { x: CARD.x, y: CARD.y, width: CARD.w, height: CARD.h, rx: CARD.r }, clip);

    el('rect', { x: 0, y: 0, width: W, height: H, fill: fam.soft });
    RIBBON.forEach((c, i) => el('rect', { x: i * W / 6, y: 0, width: W / 6 + 1, height: 14, fill: c }));

    S.card = el('g');
    el('rect', { x: CARD.x, y: CARD.y, width: CARD.w, height: CARD.h, rx: CARD.r, fill: C.white, filter: 'url(#ombre)' }, S.card);
    const inner = el('g', { 'clip-path': 'url(#fiche)' }, S.card);
    el('rect', { x: CARD.x, y: CARD.y, width: CARD.w, height: BAND_H, fill: fam.c }, inner);
    if (sc.famille === 0) RIBBON.forEach((c, i) => el('rect', { x: CARD.x + i * CARD.w / 6, y: CARD.y + BAND_H, width: CARD.w / 6 + 1, height: 12, fill: c }, inner));
    const bandLabel = text(inner, CARD.x + PAD, CARD.y + 74, (sc.bandeau || fam.label).toUpperCase(), { size: 32, weight: 700, fill: fam.on, ls: 3 });
    fit(bandLabel, CARD.x + CARD.w - PAD, 'bandeau');

    // Nom de l'outil
    S.title = el('g', {}, S.card);
    const titleLines = sc.titre || [sc.outil];
    // Taille du titre : 104 px, réduite jusqu'à 72 px pour tenir sur la largeur de la fiche
    let tSize = titleLines.length > 1 ? 88 : 104;
    const avail = CARD.w - PAD * 2;
    const probe = text(S.title, 0, 0, '', { size: tSize, weight: 700, ls: -1 });
    const widest = s => Math.max(...titleLines.map(l => { probe.setAttribute('font-size', s); probe.textContent = l; return width(probe); }));
    while (tSize > 72 && widest(tSize) > avail) tSize -= 2;
    probe.remove();
    titleLines.forEach((l, i) => fit(text(S.title, CARD.x + PAD, CARD.y + BAND_H + 128 + i * tSize * 1.05, l, { size: tSize, weight: 700, fill: C.ink, ls: -1 }), CARD.x + CARD.w - PAD, 'titre'));
    S.titleBar = el('rect', { x: CARD.x + PAD, y: CARD.y + BAND_H + 128 + (titleLines.length - 1) * tSize * 1.05 + 34, width: 0, height: 12, rx: 6, fill: fam.c === C.white ? C.indigo : fam.c }, S.card);

    // Accroche : centrée dans la zone du mécanisme
    S.hook = el('g', {}, S.card);
    const hl = sc.accroche.lignes;
    let hSize = sc.accroche.taille || 76;
    {
      const pr = text(S.hook, 0, 0, '', { size: hSize, weight: 600, italic: true });
      const widest = sz => Math.max(...hl.map(l => { pr.setAttribute('font-size', sz); pr.textContent = l; return width(pr); }));
      while (hSize > 52 && widest(hSize) > ZONE.w - 20) hSize -= 2;
      pr.remove();
    }
    const hTop = ZONE.y + ZONE.h / 2 - ((hl.length - 1) * hSize * 1.18) / 2 + hSize * 0.3;
    S.hookLines = hl.map((l, i) => {
      const g = el('g', {}, S.hook);
      const acc = i === sc.accroche.accent;
      fit(text(g, W / 2, hTop + i * hSize * 1.18, l, { size: hSize, weight: acc ? 600 : 600, fill: acc ? C.indigo : C.ink, anchor: 'middle', italic: acc }), ZONE.x + ZONE.w, `accroche ${i + 1}`, ZONE.x);
      return g;
    });

    // Mécanisme
    S.meca = el('g', {}, S.card);

    // À retenir
    S.ret = el('g', {}, S.card);
    const rx = CARD.x + PAD, ry = 1452;
    el('line', { x1: rx, y1: ry, x2: CARD.x + CARD.w - PAD, y2: ry, stroke: C.line, 'stroke-width': 3 }, S.ret);
    S.retLabel = el('g', {}, S.ret);
    check(S.retLabel, rx + 22, ry + 62, 22, C.green, C.ink);
    text(S.retLabel, rx + 60, ry + 73, 'À RETENIR', { size: 28, weight: 700, fill: C.ok, ls: 3 });
    S.retText = wrap(S.ret, rx, ry + 140, sc.retenir, CARD.w - PAD * 2, { size: 46, weight: 600, fill: C.ink }, 58);
    if (S.retText.lines.length > 3) console.error('À retenir : plus de 3 lignes');
    S.retHi = el('rect', { x: rx - 8, y: ry + 98, width: 0, height: S.retText.h + 6, rx: 8, fill: C.yellowSoft }, S.ret);
    S.ret.insertBefore(S.retHi, S.retText.g);

    // Liseré qui se remplit en fin de vidéo, au bas de la fiche
    S.endRib = el('g', { 'clip-path': 'url(#fiche)' }, S.card);
    S.endRibBars = RIBBON.map((c, i) => el('rect', { x: CARD.x + i * CARD.w / 6, y: CARD.y + CARD.h - 16, width: 0, height: 16, fill: c }, S.endRib));

    // Pied : logo et rappel du deck
    S.foot = el('g');
    el('image', { href: '../../assets/fichly-logo.png', x: W / 2 - 89, y: 1730, width: 178, height: 94 }, S.foot);
    text(S.foot, W / 2, 1872, sc.pied || 'Une fiche du deck 40 outils du Lean', { size: 32, weight: 600, fill: C.ink700, anchor: 'middle' });
  }

  function drawCommon(t) {
    // Titre visible dès la première image (vignette, Reels) ; la barre d'accent se trace
    S.titleBar.setAttribute('width', (140 * easeOut(prog(t, 0.35, 0.5))).toFixed(1));
    // Accroche, ligne par ligne, puis s'efface vers le haut
    S.hookLines.forEach((g, i) => show(g, t, T.hookIn + i * 0.22, { dur: 0.5, from: 'up', d: 40 }));
    const out = prog(t, T.hookOut, 0.4);
    S.hook.setAttribute('opacity', (1 - out).toFixed(3));
    S.hook.setAttribute('transform', out > 0 ? `translate(0 ${-60 * easeInOut(out)})` : '');
    // Mécanisme : visible à partir de 3 s
    S.meca.setAttribute('opacity', prog(t, T.mecaIn - 0.15, 0.3).toFixed(3));
    // À retenir
    show(S.ret, t, T.retenir, { dur: 0.5, from: 'up', d: 30 });
    show(S.retLabel, t, T.retenir + 0.1, { dur: 0.4, from: 'pop', cx: CARD.x + PAD + 22, cy: 1514 });
    S.retHi.setAttribute('width', ((CARD.w - PAD * 2 + 16) * easeInOut(prog(t, T.retenir + 0.5, 0.8))).toFixed(1));
    // Fin : le liseré se remplit
    S.endRibBars.forEach((r, i) => r.setAttribute('width', ((CARD.w / 6 + 1) * easeOut(prog(t, T.fin + i * 0.1, 0.35))).toFixed(1)));
  }

  const api = { W, H, C, FAM, RIBBON, ZONE, CARD, T, el, text, wrap, width, measure, fit, inZone, clamp, prog, lerp, easeOut, easeInOut, back, show, stroke, count, grow, box, pill, check, cross, arrow, clock };

  let resolveReady;
  const ready = new Promise(r => { resolveReady = r; });
  window.FICHE = { width: W, height: H, duration: DURATION, poster: 10, ready, draw: () => {} };

  window.Story = {
    api,
    scene(sc) {
      SCENE = sc;
      window.FICHE.poster = sc.poster ?? 10;
      if (sc.bulle) window.FICHE.bulle = sc.bulle;  // carré { x, y, s } de la vignette de bulle
      Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Montserrat`)).concat(document.fonts.load('italic 600 40px Montserrat'))).then(() => {
        template(sc);
        sc.build(S, api, S.meca);
        const draw = t => { drawCommon(t); sc.anim(t, S, api); };
        window.FICHE.draw = draw;
        draw(0);
        checkAll();
        // Lecture en direct dans le navigateur : ?play
        if (/[?&]play/.test(location.search)) {
          const t0 = performance.now();
          const loop = now => { draw(((now - t0) / 1000) % DURATION); requestAnimationFrame(loop); };
          requestAnimationFrame(loop);
        } else if (/[?&]t=/.test(location.search)) draw(parseFloat(location.search.split('t=')[1]));
        resolveReady();
      });
    },
  };
})();
