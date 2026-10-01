// Fiche d'exemple · Yamazumi (aucun post programmé : titre, chute et encart provisoires).
// Style propre : la gravité. Les tâches tombent et s'empilent poste par poste (« yamazumi » = empiler),
// la ligne du takt révèle le goulot, le gaspillage saute et la pile se tasse, puis deux tâches
// changent de poste et la ligne s'équilibre sous le takt. La pastille d'étape suit la méthode.
// L'image t = 0 est l'état final (PNG). Boucle exacte de 14 s.
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
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';

  const MUTED = '#7b7ba6', GRID = '#ececf4', TICK = '#a3a3c2', DASH = '#b6b6d4';

  // ---------- Données : quatre postes, takt 60 s ----------
  const K = 5;                    // px par seconde
  const BASE = 800;               // sol du graphique
  const TAKT = 60;
  const BW = 150;
  const COLX = [240, 450, 660, 870];
  const yOf = sec => BASE - sec * K;
  const FILL = { V: C.green, N: C.yellow, R: C.red };
  const INK = { V: C.tGreen, N: C.tYellow, R: C.white };
  // Du bas vers le haut : V valeur ajoutée, N nécessaire sans valeur ajoutée, R gaspillage
  const STACKS = [
    [['V', 22], ['R', 8], ['N', 10], ['V', 16]],                                  // 56 s
    [['V', 28], ['N', 12], ['R', 8], ['V', 10], ['R', 4], ['N', 6], ['V', 6]],    // 74 s : goulot
    [['V', 20], ['N', 8], ['R', 6], ['V', 12]],                                   // 46 s
    [['V', 18], ['R', 4], ['N', 10], ['V', 8]],                                   // 40 s
  ];
  // Après : 48 · 50 · 46 · 42 s (gaspillage supprimé 30 s, deux tâches déplacées)

  // ---------- Chronologie (s) ----------
  const DURATION = 14, END = DURATION - 0.001;
  const T_OUT = 1.2;                                   // l'état final s'enfonce sous le sol
  const ENTER0 = 1.85, ENTER_STEP = 0.075, FALL = 0.32, SQUASH = 0.17;
  const T_STEP = [1.8, 3.65, 5.9, 8.85, 10.95];        // pastilles 1 à 4, puis « équilibré »
  const T_TAKT = 3.7, TAKT_DUR = 0.5, T_ALERT = 4.3, T_IDLE = 4.4, T_KPI = 4.45;
  const T_BLINK = 5.95, BLINK_DUR = 0.36;
  const REMOVALS = [[1, 6.3], [6, 6.75], [8, 7.25], [13, 7.65], [16, 8.05]]; // [bloc, t]
  const SHRINK = 0.28;
  const MOVES = [[10, 3, 8.95], [9, 2, 9.95]];        // [bloc, poste d'arrivée, t]
  const MOVE_DUR = 0.75, LIFT = 0.15;
  const T_ALERT_OFF = 9.02;                            // le poste 2 repasse sous le takt

  const blocks = [];
  STACKS.forEach((st, col) => st.forEach(([type, d], idx) => blocks.push({ id: blocks.length, type, d, col0: col, idx, h: d * K })));

  // ---------- Simulation : images clés de chaque bloc ----------
  const fallDur = d => 0.14 + 0.012 * d;
  function simulate() {
    const stacks = STACKS.map(() => []);
    blocks.forEach(b => { stacks[b.col0].push(b); b.cur = b.col0; });
    const offOf = (st, b) => { let o = 0; for (const x of st) { if (x === b) return o; o += x.d; } return o; };
    // Entrée couche par couche, poste par poste
    blocks.slice().sort((a, b) => a.idx - b.idx || a.col0 - b.col0).forEach((b, n) => {
      const t = ENTER0 + ENTER_STEP * n;
      b.kf = [{ t, kind: 'enter', dur: FALL, col: b.col0, off: offOf(stacks[b.col0], b) }];
      b.contrib = [{ col: b.col0, t: t + FALL, dir: 1, dur: 0.15 }];
    });
    REMOVALS.forEach(([id, t]) => {
      const r = blocks[id], st = stacks[r.cur], i = st.indexOf(r), off = offOf(st, r);
      r.kf.push({ t, kind: 'shrink', dur: SHRINK, col: r.cur, off });
      r.contrib.push({ col: r.cur, t, dir: -1, dur: SHRINK });
      r.removeAt = { t, x: COLX[r.cur], y: yOf(off + r.d / 2) };
      st.splice(i, 1);
      st.slice(i).forEach(b => b.kf.push({ t: t + 0.16, kind: 'fall', dur: fallDur(r.d), col: b.cur, off: offOf(st, b) }));
    });
    MOVES.forEach(([id, to, t]) => {
      const m = blocks[id], from = stacks[m.cur];
      from.splice(from.indexOf(m), 1);
      m.contrib.push({ col: m.cur, t, dir: -1, dur: 0.2 });
      stacks[to].push(m);
      m.kf.push({ t, kind: 'move', dur: MOVE_DUR, col: to, off: offOf(stacks[to], m) });
      m.contrib.push({ col: to, t: t + MOVE_DUR, dir: 1, dur: 0.15 });
      m.cur = to;
    });
  }

  function squash(st, dt) {
    if (dt >= 0 && dt < SQUASH) { const q = Math.sin(Math.PI * dt / SQUASH); st.sy = 1 - 0.1 * q; st.sx = 1 + 0.05 * q; }
  }
  // État d'un bloc à l'instant s de la séquence (null : invisible)
  function blockState(b, s) {
    const kf = b.kf;
    if (s < kf[0].t) return null;
    let i = 0;
    while (i + 1 < kf.length && s >= kf[i + 1].t) i++;
    const k = kf[i], prev = kf[i - 1];
    const p = clamp((s - k.t) / k.dur);
    const st = { col: k.col, cx: COLX[k.col], bottom: yOf(k.off), sx: 1, sy: 1, o: 1, lifted: false, air: false, center: false };
    if (k.kind === 'enter') {
      st.bottom -= 150 * (1 - easeIn(p));
      st.o = clamp(p / 0.2);
      st.air = p < 1;
      squash(st, s - k.t - k.dur);
    } else if (k.kind === 'fall') {
      st.bottom = lerp(yOf(prev.off), yOf(k.off), easeIn(p));
      squash(st, s - k.t - k.dur);
    } else if (k.kind === 'shrink') {
      if (p >= 1) return null;
      const q = easeIn(p);
      st.sx = st.sy = Math.max(0.001, 1 - q);
      st.o = 1 - q;
      st.center = true;
    } else if (k.kind === 'move') {
      const u = s - k.t, fx = COLX[prev.col], fy = yOf(prev.off);
      if (u < LIFT) {
        const q = easeOut(u / LIFT);
        st.cx = fx; st.bottom = fy - 14 * q; st.sx = st.sy = 1 + 0.05 * q;
        st.lifted = st.air = true;
      } else if (u < MOVE_DUR) {
        const q = easeInOut((u - LIFT) / (MOVE_DUR - LIFT));
        st.cx = lerp(fx, COLX[k.col], q);
        st.bottom = lerp(fy - 14, yOf(k.off), q) - 70 * Math.sin(Math.PI * q);
        st.sx = st.sy = 1 + 0.05 * (1 - q);
        st.lifted = st.air = true;
      } else squash(st, u - MOVE_DUR);
    }
    return st;
  }
  // Part d'un bloc dans le total d'un poste (0 → 1, roule avec les arrivées et départs)
  function contrib(b, c, s) {
    let v = 0;
    for (const e of b.contrib) if (e.col === c) v += e.dir * clamp((s - e.t) / e.dur);
    return clamp(v);
  }
  const total = (c, s) => blocks.reduce((a, b) => a + b.d * contrib(b, c, s), 0);

  // ---------- Petits éléments ----------
  function pillShape(parent, x, cy, label, { bg, fg, icon = false, size = 19, h = 38 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 28 : 0;
    const tx = text(g, x + 18 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    const w = tx.getBBox().width + 36 + iw;
    r.setAttribute('width', w);
    if (icon) {
      el('circle', { cx: x + 28, cy, r: 11, fill: C.green }, g);
      el('path', { d: `M ${x + 23} ${cy + 0.5} L ${x + 26.5} ${cy + 4} L ${x + 33} ${cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return { g, w };
  }

  const S = {};
  const halo = n => { [['stroke', C.card], ['stroke-width', 7], ['stroke-linejoin', 'round'], ['paint-order', 'stroke']].forEach(([k, v]) => n.setAttribute(k, v)); return n; };

  function build() {
    D.template({ author: 'hugo' });
    D.title('Empilez le travail,', 'voyez le goulot.');
    D.chapeau(`En japonais, «${NB}yamazumi${NB}» veut dire «${NB}empiler${NB}».`);
    simulate();

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-30%', y: '-40%', width: '160%', height: '200%' }, defs);
    el('feDropShadow', { dx: 0, dy: 8, stdDeviation: 7, 'flood-color': C.ink, 'flood-opacity': 0.22 }, lift);
    const cpChart = el('clipPath', { id: 'chart' }, defs);
    el('rect', { x: 60, y: 330, width: 960, height: BASE - 330 }, cpChart);
    const cpTakt = el('clipPath', { id: 'taktDraw' }, defs);
    S.taktClip = el('rect', { x: 130, y: 470, width: 860, height: 40 }, cpTakt);

    // ----- Carte du graphique -----
    el('rect', { x: 60, y: 330, width: 960, height: 530, rx: 24, fill: C.card, stroke: C.line, 'stroke-width': 2 });
    [20, 40].forEach(sec => {
      el('line', { x1: 140, y1: yOf(sec), x2: 980, y2: yOf(sec), stroke: GRID, 'stroke-width': 2 });
      text(D.svg, 92, yOf(sec) + 5, `${sec}${NB}s`, { size: 15, weight: 500, fill: TICK });
    });

    // Attente sous le takt (pointillés), sous les blocs
    S.idle = COLX.map(cx => {
      const g = el('g', { opacity: 0 });
      const r = el('rect', { x: cx - BW / 2 + 1.5, y: yOf(TAKT), width: BW - 3, height: 10, rx: 8, fill: C.blue, 'fill-opacity': 0.04, stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, g);
      const l = text(g, cx, yOf(TAKT) + 23, '', { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
      return { g, r, l };
    });

    // Blocs
    const layer = el('g', { 'clip-path': 'url(#chart)' });
    blocks.forEach(b => {
      const g = el('g', {}, layer);
      b.rect = el('rect', { x: -BW / 2, y: -b.h + 1.5, width: BW, height: b.h - 3, rx: 7, fill: FILL[b.type], 'stroke-width': 3 }, g);
      if (b.type === 'R') b.flash = el('rect', { x: -BW / 2, y: -b.h + 1.5, width: BW, height: b.h - 3, rx: 7, fill: C.white, opacity: 0 }, g);
      if (b.d >= 8) text(g, 0, -b.h / 2 + 6, `${b.d}${NB}s`, { size: 17, weight: 700, fill: INK[b.type], anchor: 'middle' });
      b.g = g;
    });
    // Étiquettes « −8 s » du gaspillage qui saute
    S.minus = REMOVALS.map(([id]) => {
      const b = blocks[id];
      const t = halo(text(D.svg, b.removeAt.x + BW / 2 + 31, b.removeAt.y, `−${b.d}${NB}s`, { size: 22, weight: 800, fill: C.tRed, anchor: 'middle' }));
      t.setAttribute('opacity', 0);
      return { t, b };
    });

    // Sol et noms des postes
    el('line', { x1: 130, y1: BASE, x2: 990, y2: BASE, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' });
    COLX.forEach((cx, i) => text(D.svg, cx, 836, `Poste ${i + 1}`, { size: 20, weight: 700, fill: C.ink, anchor: 'middle' }));

    // Ligne du takt
    S.takt = el('g', {});
    const tl = el('g', { 'clip-path': 'url(#taktDraw)' }, S.takt);
    el('line', { x1: 140, y1: yOf(TAKT), x2: 980, y2: yOf(TAKT), stroke: C.blue, 'stroke-width': 3, 'stroke-dasharray': '11 8', 'stroke-linecap': 'round' }, tl);
    S.taktLabel = text(S.takt, 980, yOf(TAKT) - 12, `Takt 60${NB}s`, { size: 19, weight: 800, fill: C.blue, anchor: 'end' });

    // Totaux au-dessus des colonnes
    S.counters = COLX.map(cx => halo(text(D.svg, cx, 0, '', { size: 23, weight: 800, fill: C.ink, anchor: 'middle' })));
    // Alerte du poste 2 et dépassement
    S.alert = el('g', {});
    el('circle', { cx: 0, cy: 0, r: 17, fill: C.red }, S.alert);
    text(S.alert, 0, 8, '!', { size: 23, weight: 800, fill: C.white, anchor: 'middle' });
    S.over = el('g', {});
    el('rect', { x: 0, y: -17, width: 82, height: 34, rx: 17, fill: C.pRed }, S.over);
    S.overText = text(S.over, 41, 6.5, '', { size: 18, weight: 800, fill: C.tRed, anchor: 'middle' });

    // Pastilles d'étape
    const PILLS = [
      ['1 · Empiler les tâches', C.blue, C.white],
      ['2 · Comparer au takt', C.blue, C.white],
      ['3 · Supprimer le gaspillage', C.blue, C.white],
      ['4 · Rééquilibrer', C.blue, C.white],
      ['Équilibré sous le takt', C.pGreen, C.tGreen, true],
    ];
    S.pills = PILLS.map(([label, bg, fg, icon]) => {
      const p = pillShape(D.svg, 92, 373, label.replace(' · ', `${NB}·${NB}`), { bg, fg, icon });
      fit(p.g, 600, `pastille ${label}`);
      return p.g;
    });

    // ----- Légende -----
    const leg = el('g');
    let lx = 0;
    [['V', 'Valeur ajoutée'], ['N', 'Nécessaire sans valeur ajoutée'], ['R', 'Gaspillage'], ['A', 'Attente sous le takt']].forEach(([k, label], i) => {
      if (i) lx += 30;
      if (k === 'A') el('rect', { x: lx + 1, y: 879, width: 18, height: 18, rx: 5, fill: 'none', stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, leg);
      else el('rect', { x: lx, y: 878, width: 20, height: 20, rx: 5, fill: FILL[k] }, leg);
      const t = text(leg, lx + 30, 894, label, { size: 17, weight: 500, fill: C.ink });
      lx += 30 + t.getBBox().width;
    });
    leg.setAttribute('transform', `translate(${f2(540 - lx / 2)} 0)`);
    if (lx > 950) console.error(`Débordement : légende (${Math.round(lx)} px)`);

    // ----- Indicateurs -----
    const KPI = [
      ['Poste le plus chargé', `avant${NB}: 74${NB}s`, `takt${NB}: 60${NB}s`],
      ['Équilibrage de la ligne', `avant${NB}: 73${NB}%`, 'total ÷ (postes × poste max)'],
      ['Gaspillage supprimé', '', 'soit 14 % du travail'],
    ];
    S.kpi = KPI.map(([label, before, sub], i) => {
      const x = 60 + i * 327;
      el('rect', { x, y: 918, width: 306, height: 124, rx: 20, fill: C.pLav });
      fit(text(D.svg, x + 22, 950, label, { size: 17, weight: 700, fill: C.blue }), x + 290, `indicateur ${i + 1}`);
      if (before) fit(text(D.svg, x + 286, 998, before, { size: 16, weight: 500, fill: MUTED, anchor: 'end' }), x + 290, `avant ${i + 1}`);
      fit(text(D.svg, x + 22, 1026, sub.replace(' % ', `${NB}%${NB}`), { size: 14, weight: 500, fill: MUTED }), x + 290, `sous-titre ${i + 1}`);
      return text(D.svg, x + 22, 1002, '', { size: 42, weight: 800, fill: C.ink });
    });

    fit(text(D.svg, 62, 1100, 'Le Yamazumi ne fait pas aller plus vite.', { size: 30, weight: 700, fill: C.blue }), 1020, 'chute 1');
    fit(text(D.svg, 62, 1140, 'Il montre où le travail s’empile.', { size: 30, weight: 700, fill: C.blue }), 1020, 'chute 2');

    D.encart(['Équilibrer ses postes', 'Notre article Yamazumi', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  const windowOpacity = (t, a, b, fin = 0.25, fout = 0.2) => prog(t, a, fin) * (1 - prog(t, b, fout));

  function draw(t) {
    const final = t < ENTER0;           // jusqu'à l'entrée : état final (qui s'enfonce à partir de T_OUT)
    const s = final ? END : t;

    // Blocs
    const states = blocks.map(b => {
      let st = blockState(b, s);
      if (st && final && t >= T_OUT) {
        const p = easeIn(prog(t, T_OUT + 0.06 * st.col, 0.45));
        st.bottom += 300 * p;
      }
      return st;
    });
    blocks.forEach((b, i) => {
      const st = states[i];
      if (!st) { b.g.setAttribute('opacity', 0); return; }
      b.g.setAttribute('opacity', f2(st.o));
      b.g.setAttribute('transform', st.center
        ? `translate(${f2(st.cx)} ${f2(st.bottom - b.h / 2)}) scale(${f2(st.sx)}) translate(0 ${f2(b.h / 2)})`
        : `translate(${f2(st.cx)} ${f2(st.bottom)})` + (st.sx !== 1 || st.sy !== 1 ? ` scale(${st.sx.toFixed(3)} ${st.sy.toFixed(3)})` : ''));
      if (st.lifted) { b.g.setAttribute('filter', 'url(#lift)'); b.rect.setAttribute('stroke', C.white); }
      else { b.g.removeAttribute('filter'); b.rect.setAttribute('stroke', 'none'); }
      if (b.flash) {
        const p = prog(t, T_BLINK, BLINK_DUR);
        b.flash.setAttribute('opacity', !final && p > 0 && p < 1 ? f2(0.5 * Math.pow(Math.sin(2 * Math.PI * p), 2)) : 0);
      }
    });

    // Haut visible de chaque poste (blocs posés) et totaux
    const tops = COLX.map((_, c) => {
      let top = BASE;
      blocks.forEach((b, i) => { const st = states[i]; if (st && !st.air && st.col === c) top = Math.min(top, st.bottom - b.h * st.sy); });
      return top;
    });
    const totals = COLX.map((_, c) => total(c, s));

    // Totaux : affichés une fois la pile mesurée
    const cOp = final ? 1 - prog(t, T_OUT, 0.25) : prog(t, T_STEP[1], 0.3);
    S.counters.forEach((n, c) => {
      const v = Math.round(totals[c]);
      const y = Math.min(tops[c], yOf(totals[c])) - 12;
      let o = cOp;
      MOVES.forEach(([, to, tm]) => { if (!final && to === c) { const p = prog(t, tm + MOVE_DUR - 0.3, 0.55); o *= 1 - Math.sin(Math.PI * p); } });
      n.textContent = `${v}${NB}s`;
      n.setAttribute('y', f2(y));
      n.setAttribute('opacity', f2(o));
      const over = !final && t >= T_ALERT && totals[c] > TAKT + 0.01;
      const done = final || t >= T_STEP[4];
      n.setAttribute('fill', over ? C.tRed : done ? C.tGreen : C.ink);
    });

    // Alerte et dépassement du poste 2
    let ak = 0;
    if (!final) {
      const pin = prog(t, T_ALERT, 0.35), pout = prog(t, T_ALERT_OFF, 0.25);
      ak = (pin <= 0 ? 0 : pin >= 1 ? 1 : back(pin)) * (1 - easeIn(pout));
      if (pin >= 1 && pout <= 0) ak *= 1 + 0.07 * Math.sin((t - T_ALERT) * Math.PI * 2 / 0.9);
    }
    const cy2 = Math.min(tops[1], yOf(totals[1])) - 22;
    S.alert.setAttribute('transform', `translate(${COLX[1] + 50} ${f2(cy2)}) scale(${f2(Math.max(ak, 0.001))})`);
    S.alert.setAttribute('opacity', ak > 0.001 ? 1 : 0);
    const overSec = Math.max(0, totals[1] - TAKT);
    S.overText.textContent = `+${Math.round(overSec)}${NB}s`;
    S.over.setAttribute('transform', `translate(${COLX[1] + BW / 2 + 12} ${f2((yOf(TAKT) + Math.min(tops[1], yOf(totals[1]))) / 2)})`);
    S.over.setAttribute('opacity', f2(clamp(ak) * clamp(overSec / 1.5)));

    // Attente sous le takt
    const iOp = final ? 0 : windowOpacity(t, T_IDLE, T_STEP[4], 0.3, 0.35);
    S.idle.forEach((d, c) => {
      const gapPx = tops[c] - yOf(TAKT);
      const gapSec = gapPx / K;
      d.r.setAttribute('height', f2(Math.max(0, gapPx - 3)));
      d.g.setAttribute('opacity', f2(iOp * clamp(gapSec / 2)));
      d.l.textContent = `${Math.round(gapSec)}${NB}s d’attente`;
      d.l.setAttribute('opacity', f2(clamp((gapSec - 12.5) / 1)));
    });

    // Ligne du takt
    let tw = 860, to = 1, lk = 1;
    if (final) to = 1 - prog(t, T_OUT, 0.25);
    else { tw = 860 * easeInOut(prog(t, T_TAKT, TAKT_DUR)); const p = prog(t, T_TAKT + TAKT_DUR - 0.1, 0.35); lk = p <= 0 ? 0 : p >= 1 ? 1 : back(p); }
    S.taktClip.setAttribute('width', f2(Math.max(0.001, tw)));
    S.takt.setAttribute('opacity', f2(to));
    S.taktLabel.setAttribute('opacity', f2(clamp(lk)));
    S.taktLabel.setAttribute('transform', lk === 1 ? '' : `translate(980 ${yOf(TAKT) - 18}) scale(${f2(Math.max(lk, 0.001))}) translate(-980 ${-(yOf(TAKT) - 18)})`);

    // Gaspillage qui saute : « −8 s » qui monte et s'efface
    S.minus.forEach(({ t: n, b }) => {
      const p = final ? 1 : prog(t, b.removeAt.t, 0.9);
      n.setAttribute('opacity', f2(p > 0 && p < 1 ? clamp(p / 0.15) * (1 - prog(p, 0.55, 0.45)) : 0));
      n.setAttribute('y', f2(b.removeAt.y + 8 - 30 * easeOut(p)));
    });

    // Pastilles d'étape (fondu croisé)
    // L'ancienne pastille sort (0,14 s) avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = T_STEP[i] + (i ? 0.12 : 0);
      let o, dy;
      if (i === 4) { o = final ? 1 - prog(t, T_OUT, 0.25) : prog(t, a, 0.25); dy = final ? 0 : 8 * (1 - prog(t, a, 0.25)); }
      else { o = final ? 0 : prog(t, a, 0.25) * (1 - prog(t, T_STEP[i + 1], 0.14)); dy = 8 * (1 - prog(t, a, 0.25)); }
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });

    // Indicateurs
    const max = Math.max(...totals), sum = totals.reduce((a, b) => a + b, 0);
    const removed = REMOVALS.reduce((a, [id, tr]) => a + blocks[id].d * (final ? 1 : easeIn(prog(t, tr, SHRINK))), 0);
    const kOp = final ? 1 - prog(t, T_OUT, 0.25) : prog(t, T_KPI, 0.3);
    const balance = max > 0 ? Math.round(100 * sum / (4 * max)) : 0;
    const vals = [
      [`${Math.round(max)}${NB}s`, max > TAKT + 0.01 ? C.tRed : C.tGreen],
      [`${balance}${NB}%`, balance >= 90 ? C.tGreen : C.ink],
      [`${Math.round(removed)}${NB}s`, removed > 0.5 ? C.tGreen : C.ink],
    ];
    S.kpi.forEach((n, i) => { n.textContent = vals[i][0]; n.setAttribute('fill', vals[i][1]); n.setAttribute('opacity', f2(kOp)); });
  }

  D.start({ duration: DURATION, build, draw });
})();
