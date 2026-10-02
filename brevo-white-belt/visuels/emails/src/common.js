// Outils communs aux illustrations des emails White Belt (direction « Fiche Fichly »), SVG → PNG 1200 px.
// Fond plat (pas de texture papier) : PNG légers, teinte d'accent de l'email en fond de carte.
const NS = 'http://www.w3.org/2000/svg';
const C = {blue:'#4a4aa0', ink:'#23235a', green:'#8cc978', yellow:'#e6b839', red:'#f16969', lblue:'#74a3d6', turq:'#75bec0',
  violet:'#aa76b2', white:'#ffffff', pGreen:'#e6f3df', tGreen:'#2f5a1f', pRed:'#fde6e6', tRed:'#a83434', pLav:'#ececf5',
  pYel:'#f8f3d9', tYel:'#7a5806', card:'#fdfdfb', line:'#e2e2ee', stitch:'#aeb0dc', muted:'#5c5c78'};
// Teintes d'accent (fond de la carte d'illustration) : E0 lavande, E1 turquoise, E2 violet, E3 bleu clair, E4 jaune.
const TINT = {e0:'#ececf5', e1:'#e0f1f1', e2:'#f2e8f3', e3:'#e3edf8', e4:'#f8f3d9'};
const EDGE = {e0:'#dcdcec', e1:'#c4e3e3', e2:'#e3d2e6', e3:'#cddcef', e4:'#ece2b8'};
const NB = ' ';
let S; const errs = [];
function el(t, a = {}, p = S) { const n = document.createElementNS(NS, t); for (const [k, v] of Object.entries(a)) n.setAttribute(k, v); p.appendChild(n); return n }
function tx(p, x, y, str, {size = 44, weight = 700, fill = C.ink, anchor = 'start', ls = 0} = {}) {
  const t = el('text', {x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': weight, fill, 'text-anchor': anchor, 'letter-spacing': ls}, p);
  t.textContent = str; if (size < 42) errs.push('texte < 42 px : ' + str); return t }
function fit(n, minL, maxR, label) { const b = n.getBBox(); if (b.x + b.width > maxR + .5 || b.x < minL - .5) errs.push(label + ' ' + Math.round(b.x) + '→' + Math.round(b.x + b.width)) }
function bg(W, H, key) { el('rect', {x: 0, y: 0, width: W, height: H, fill: TINT[key]}) }
function cardRect(x, y, w, h, {fill = C.card, stroke = C.line, sw = 4, rx = 28, p = S} = {}) { return el('rect', {x, y, width: w, height: h, rx, fill, stroke, 'stroke-width': sw}, p) }
function brick(x, y, w, h, fill, label, {size = 44, color = C.white, weight = 800, p = S} = {}) { // x, y = centre
  el('rect', {x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 16, fill}, p);
  const sw = w * 0.23, sh = h * 0.19;
  el('rect', {x: x - w * 0.33, y: y - h / 2 - sh + 4, width: sw, height: sh, rx: 4, fill}, p);
  el('rect', {x: x + w * 0.33 - sw, y: y - h / 2 - sh + 4, width: sw, height: sh, rx: 4, fill}, p);
  if (label !== undefined) return tx(p, x, y + size * 0.36, String(label), {size, weight, fill: color, anchor: 'middle'});
}
function check(cx, cy, r, fill = C.green, p = S) { el('circle', {cx, cy, r, fill}, p); const k = r / 31;
  el('path', {d: `M ${cx - 14 * k} ${cy + 1 * k} L ${cx - 4 * k} ${cy + 11 * k} L ${cx + 15 * k} ${cy - 9 * k}`, fill: 'none', stroke: C.white, 'stroke-width': 6 * k, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}, p) }
function clockBadge(cx, cy, r, fill = C.red, p = S) { // pastille horloge (attente)
  el('circle', {cx, cy, r, fill, stroke: C.white, 'stroke-width': r * 0.2}, p);
  el('circle', {cx, cy, r: r * 0.5, fill: 'none', stroke: C.white, 'stroke-width': r * 0.16}, p);
  el('path', {d: `M ${cx} ${cy - r * 0.26} V ${cy} L ${cx + r * 0.2} ${cy + r * 0.16}`, stroke: C.white, 'stroke-width': r * 0.14, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}, p) }
function checkBadge(cx, cy, r, p = S) { el('circle', {cx, cy, r, fill: C.green, stroke: C.white, 'stroke-width': r * 0.2}, p);
  el('path', {d: `M ${cx - r * .44} ${cy + r * .04} L ${cx - r * .12} ${cy + r * .36} L ${cx + r * .48} ${cy - r * .32}`, stroke: C.white, 'stroke-width': r * .24, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}, p) }
function seal(cx, cy, r, lines, {size = 44, rot = -10, p = S} = {}) { // sceau jaune, contour #7A5806
  const pts = []; const n = 18;
  for (let i = 0; i < n * 2; i++) { const a = Math.PI * i / n, rr = i % 2 ? r * 0.86 : r; pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]) }
  el('path', {d: 'M ' + pts.map(q => q.map(v => v.toFixed(1)).join(' ')).join(' L ') + ' Z', fill: C.yellow, stroke: C.tYel, 'stroke-width': 3}, p);
  const g = el('g', {transform: `rotate(${rot} ${cx} ${cy})`}, p); const out = [];
  const L = Array.isArray(lines) ? lines : [lines]; const lh = size * 1.08, y0 = cy + size * 0.36 - (L.length - 1) * lh / 2;
  L.forEach((s, i) => { const t = tx(g, cx, y0 + i * lh, s, {size, weight: 800, fill: C.white, anchor: 'middle'});
    t.setAttribute('stroke', C.tYel); t.setAttribute('stroke-width', '6'); t.setAttribute('paint-order', 'stroke'); out.push(t) });
  return out }
// Ceinture cousue, posée en arc (L → R), nœud au centre ; couleur de remplissage paramétrable.
function belt({L, R, top, th = 84, sag = 24, fill = C.white, stroke = C.blue, stitch = C.stitch, label = '', labelColor = C.blue, knot = 0.5, offset = '62%', p = S}) {
  const g = el('g', {}, p); const MX = (L + R) / 2, KX = L + (R - L) * knot, KY = top + 4 * sag * knot * (1 - knot) + th / 2;
  const tail = (cx, cy, ang, len) => { const t = el('g', {transform: `rotate(${ang} ${cx} ${cy})`}, g);
    el('rect', {x: cx - 31, y: cy, width: 62, height: len, rx: 9, fill, stroke, 'stroke-width': 6}, t);
    el('path', {d: `M ${cx - 17} ${cy + 14} V ${cy + len - 14} M ${cx + 17} ${cy + 14} V ${cy + len - 14}`, stroke: stitch, 'stroke-width': 4, 'stroke-dasharray': '11 8', fill: 'none'}, t) };
  tail(KX - 14, KY + 24, 24, 136); tail(KX + 16, KY + 24, -20, 146);
  el('path', {d: `M ${L} ${top} Q ${MX} ${top + sag * 2} ${R} ${top} L ${R} ${top + th} Q ${MX} ${top + th + sag * 2} ${L} ${top + th} Z`, fill, stroke, 'stroke-width': 6, 'stroke-linejoin': 'round'}, g);
  el('path', {d: `M ${L + 14} ${top + 14} Q ${MX} ${top + 14 + sag * 2} ${R - 14} ${top + 14} M ${L + 14} ${top + th - 14} Q ${MX} ${top + th - 14 + sag * 2} ${R - 14} ${top + th - 14}`, stroke: stitch, 'stroke-width': 4, 'stroke-dasharray': '12 9', fill: 'none'}, g);
  if (label) { const id = 'mid' + Math.round(L);
    el('path', {id, d: `M ${L} ${top + th / 2 + 15} Q ${MX} ${top + th / 2 + 15 + sag * 2} ${R} ${top + th / 2 + 15}`, fill: 'none'}, g);
    const tp = el('text', {'font-family': 'Poppins', 'font-size': 42, 'font-weight': 800, fill: labelColor, 'letter-spacing': 5}, g);
    el('textPath', {href: '#' + id, startOffset: offset}, tp).textContent = label }
  const kn = el('g', {transform: `rotate(-5 ${KX} ${KY})`}, g);
  el('rect', {x: KX - 54, y: KY - 58, width: 108, height: 116, rx: 16, fill, stroke, 'stroke-width': 6}, kn);
  el('path', {d: `M ${KX - 27} ${KY - 44} V ${KY + 44} M ${KX + 27} ${KY - 44} V ${KY + 44}`, stroke: stitch, 'stroke-width': 4, 'stroke-dasharray': '11 8', fill: 'none'}, kn);
  return {KX, KY} }
function person(cx, cy, r, fill, p = S) { // pictogramme personne (tête + épaules) dans un rond
  el('circle', {cx, cy, r, fill}, p);
  el('circle', {cx, cy: cy - r * 0.18, r: r * 0.3, fill: C.white}, p);
  el('path', {d: `M ${cx - r * 0.56} ${cy + r * 0.62} Q ${cx - r * 0.52} ${cy + r * 0.16} ${cx} ${cy + r * 0.16} Q ${cx + r * 0.52} ${cy + r * 0.16} ${cx + r * 0.56} ${cy + r * 0.62} Z`, fill: C.white}, p) }
function stopwatch(cx, cy, r, {col = C.ink, face = C.white, hand = C.red, p = S} = {}) {
  el('rect', {x: cx - r * 0.24, y: cy - r * 1.42, width: r * 0.48, height: r * 0.28, rx: r * 0.1, fill: col}, p);
  el('rect', {x: cx - r * 0.08, y: cy - r * 1.18, width: r * 0.16, height: r * 0.24, fill: col}, p);
  el('circle', {cx, cy, r, fill: face, stroke: col, 'stroke-width': r * 0.2}, p);
  el('path', {d: `M ${cx} ${cy} V ${cy - r * 0.55} M ${cx} ${cy} L ${cx + r * 0.4} ${cy + r * 0.25}`, stroke: hand, 'stroke-width': r * 0.16, 'stroke-linecap': 'round'}, p);
  el('circle', {cx, cy, r: r * 0.12, fill: col}, p) }
function ready() { window.ERRS = errs; document.title = 'ready' }
function start(build) { Promise.all(['400', '500', '600', '700', '800'].map(w => document.fonts.load(`${w} 40px Poppins`))).then(() => { S = document.getElementById('s'); build(); ready() }) }
function size(W, H) { S.setAttribute('width', W); S.setAttribute('height', H); S.setAttribute('viewBox', `0 0 ${W} ${H}`) }
