// Blog · Quelle formation Lean Management choisir · section « Formation Lean management vs Formation Lean Six Sigma »
// Mécanique : deux panneaux, deux cibles. À gauche (Lean), les stocks entre les postes disparaissent :
// la barre du délai raccourcit, les temps de transformation (vert) ne bougent pas.
// À droite (Six Sigma), les mesures des pièces se resserrent autour de la cible : les pièces hors tolérance
// rentrent dans les limites, la cible et les limites ne bougent pas.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const S = {};

  // ---- Lean : quatre postes, des stocks entre eux ----
  const MX = [104, 234, 364, 494];
  const FLOOR = 372;
  const PILES = [{ cx: 169, n0: 4 }, { cx: 299, n0: 6 }, { cx: 429, n0: 3 }];
  const N1 = 1;                                   // stock restant entre deux postes
  const LEAN_T = [3.0, 4.0, 5.0], LEAN_D = 0.8;
  const BAR = { x: 68, y: 446, h: 30, va: 34, unit: 22 };
  // ---- Six Sigma : mesure de chaque pièce ----
  const AX = { x0: 640, x1: 1130, y: 470, c: 885 };
  const BIN = 18, LIM = 153, DOT = 7, STEP = 16;
  const SIG0 = 110, SIG1 = 40, N = 36;
  const SIX_T = 6.8, SIX_D = 1.0, SIX_SPREAD = 1.6;
  const BAND_T = 10.6, CHUTE_T = 11.2;

  function invNorm(p) {
    const q = p < 0.5 ? p : 1 - p, t = Math.sqrt(-2 * Math.log(q));
    const x = t - (2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t);
    return p < 0.5 ? -x : x;
  }
  function stacks(sig) {
    const count = {};
    return Z.map(z => {
      const k = Math.round(z * sig / BIN);
      const h = count[k] || 0;
      count[k] = h + 1;
      return { x: AX.c + k * BIN, y: AX.y - 9 - STEP * h };
    });
  }
  const Z = Array.from({ length: N }, (_, i) => invNorm((i + 0.5) / N));
  // Ordre d'empilement : les valeurs centrales d'abord
  const ORDER = Z.map((z, i) => i).sort((a, b) => Math.abs(Z[a]) - Math.abs(Z[b]));
  const Zs = ORDER.map(i => Z[i]);
  Z.length = 0; Zs.forEach(z => Z.push(z));
  const P0 = stacks(SIG0), P1 = stacks(SIG1);
  const DELAY = Z.map((z, i) => ((i * 11) % N) / N * SIX_SPREAD);
  const outside = x => Math.abs(x - AX.c) > LIM;

  function slots(cx) {
    const out = [];
    [3, 2, 1].forEach((n, r) => { for (let i = 0; i < n; i++) out.push({ x: cx + (i - (n - 1) / 2) * 21, y: FLOOR - 11 - 21 * r }); });
    return out;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Deux méthodes,', 'deux cibles.');
    G.blogChapeau('Même objectif, mais le Lean et le Six Sigma n’attaquent pas le même problème.');

    // ---------- Lean ----------
    G.card(40, 176, 550, 490);
    S.leanHead = el('g');
    G.pill(S.leanHead, 64, 214, 'Lean Management', { size: 20, h: 36, bg: C.blue, fg: C.white });
    S.leanSub = el('g');
    text(S.leanSub, 64, 258, 'Cible : les gaspillages, attentes et stocks', { size: 18, weight: 600, fill: C.ink });

    S.leanScene = el('g');
    el('line', { x1: 64, y1: FLOOR + 2, x2: 566, y2: FLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.leanScene);
    MX.forEach(cx => G.machine(S.leanScene, cx - 28.8, FLOOR - 40, 0.32));
    S.piles = PILES.map(p => ({ ...p, boxes: slots(p.cx).slice(0, p.n0).map(s => G.carton(S.leanScene, s.x, s.y, 0.62)) }));

    text(S.leanScene, BAR.x, BAR.y - 14, 'Délai de traversée (lead time)', { size: 17, weight: 700, fill: C.ink });
    S.ghost = el('g', {}, S.leanScene);
    const total0 = 4 * BAR.va + BAR.unit * PILES.reduce((a, p) => a + p.n0, 0);
    el('rect', { x: BAR.x - 3, y: BAR.y - 3, width: total0 + 6, height: BAR.h + 6, rx: 8, fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0.45 }, S.ghost);
    text(S.ghost, BAR.x + total0 + 10, BAR.y + 21, 'avant', { size: 16, weight: 600, fill: C.ink });
    S.seg = [];
    for (let i = 0; i < 7; i++) S.seg.push(el('rect', { y: BAR.y, height: BAR.h, rx: 4, fill: i % 2 ? C.red : C.green }, S.leanScene));
    S.after = el('g', {}, S.leanScene);
    S.afterT = text(S.after, 0, BAR.y + 21, 'après', { size: 16, weight: 700, fill: C.tGreen });

    S.leanLegend = el('g');
    el('rect', { x: 68, y: 502, width: 16, height: 16, rx: 4, fill: C.green }, S.leanLegend);
    text(S.leanLegend, 92, 516, 'transformation', { size: 16, weight: 600, fill: C.ink });
    el('rect', { x: 250, y: 502, width: 16, height: 16, rx: 4, fill: C.red }, S.leanLegend);
    text(S.leanLegend, 274, 516, 'attente en stock', { size: 16, weight: 600, fill: C.ink });

    S.leanNote = el('g');
    G.para(S.leanNote, 64, 594, 'Les temps de transformation ne bougent pas : ce sont les attentes qui disparaissent.', 490, { size: 18, weight: 700, fill: C.blue, lh: 1.3 });

    // ---------- Six Sigma ----------
    G.card(610, 176, 550, 490);
    S.sixHead = el('g');
    G.pill(S.sixHead, 634, 214, 'Six Sigma', { size: 20, h: 36, bg: C.blue, fg: C.white });
    S.sixSub = el('g');
    text(S.sixSub, 634, 258, 'Cible : la variabilité, source des défauts', { size: 18, weight: 600, fill: C.ink });

    S.sixScene = el('g');
    [[AX.x0, AX.c - LIM], [AX.c + LIM, AX.x1]].forEach(([a, b]) => el('rect', { x: a, y: 304, width: b - a, height: AX.y - 304, fill: C.pRed }, S.sixScene));
    [AX.c - LIM, AX.c + LIM].forEach(x => el('line', { x1: x, y1: 304, x2: x, y2: AX.y, stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, S.sixScene));
    el('line', { x1: AX.c, y1: 304, x2: AX.c, y2: AX.y, stroke: C.blue, 'stroke-width': 2.5 }, S.sixScene);
    text(S.sixScene, AX.c - LIM, 296, 'limite basse', { size: 15, weight: 600, fill: C.tRed, anchor: 'middle' });
    text(S.sixScene, AX.c + LIM, 296, 'limite haute', { size: 15, weight: 600, fill: C.tRed, anchor: 'middle' });
    text(S.sixScene, AX.c, 296, 'cible', { size: 15, weight: 700, fill: C.blue, anchor: 'middle' });
    el('line', { x1: AX.x0, y1: AX.y, x2: AX.x1, y2: AX.y, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.sixScene);
    text(S.sixScene, AX.c, AX.y + 26, 'mesure de chaque pièce produite', { size: 15, weight: 500, fill: C.ink, anchor: 'middle' });
    // Enveloppe de la dispersion d'avant
    S.curve = el('g', {}, S.sixScene);
    const peak = N * BIN / (SIG0 * 2.5066) * STEP;
    const pts = [];
    for (let x = AX.x0 + 6; x <= AX.x1 - 6; x += 5) pts.push(`${x} ${(AX.y - 2 - peak * Math.exp(-((x - AX.c) ** 2) / (2 * SIG0 * SIG0))).toFixed(1)}`);
    el('path', { d: 'M ' + pts.join(' L '), fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0.45 }, S.curve);
    text(S.curve, AX.x0 + 4, AX.y - 16, 'avant', { size: 16, weight: 600, fill: C.ink });
    S.dots = Z.map(() => el('circle', { r: DOT, fill: C.blue, stroke: C.white, 'stroke-width': 1.5 }, S.sixScene));

    S.count = el('g');
    text(S.count, 634, 540, 'Pièces hors tolérance', { size: 17, weight: 700, fill: C.ink });
    S.countBg = el('rect', { x: 842, y: 520, width: 104, height: 30, rx: 15, fill: C.pGreen }, S.count);
    S.countT = text(S.count, 894, 541, '0 sur 36', { size: 17, weight: 700, fill: C.tGreen, anchor: 'middle' });

    S.sixNote = el('g');
    G.para(S.sixNote, 634, 594, 'La cible et les limites ne bougent pas : c’est la dispersion qui se resserre.', 490, { size: 18, weight: 700, fill: C.blue, lh: 1.3 });

    // ---------- Les deux ensemble ----------
    S.band = el('g');
    el('rect', { x: 40, y: 684, width: 1120, height: 62, rx: 18, fill: C.pLav }, S.band);
    const bt = text(S.band, 600, 722, 'Lean Six Sigma : la rapidité du Lean et la rigueur analytique du Six Sigma.', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    fit(bt, 1140, 'bandeau Lean Six Sigma', 60);

    S.chute = G.blogChute('Le Lean fluidifie les flux, le Six Sigma stabilise les processus.', { y: 810 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    pop(S.leanHead, t, 1.75, 150, 214);
    pop(S.sixHead, t, 1.9, 690, 214);
    rise(S.leanSub, t, 1.9, 0.35, 10);
    rise(S.sixSub, t, 2.05, 0.35, 10);
    rise(S.leanScene, t, 2.1, 0.4, 12);
    rise(S.sixScene, t, 2.25, 0.4, 12);

    // Lean : les stocks baissent, les attentes raccourcissent
    const waits = S.piles.map((p, j) => {
      const q = live ? easeInOut(prog(t, LEAN_T[j], LEAN_D)) : 1;
      p.boxes.forEach((b, k) => {
        if (k < N1) return;
        const tk = LEAN_T[j] + (p.n0 - 1 - k) / (p.n0 - N1) * (LEAN_D - 0.25);
        b.setAttribute('opacity', live ? 1 - prog(t, tk, 0.25) : 0);
      });
      return BAR.unit * (p.n0 - (p.n0 - N1) * q);
    });
    let x = BAR.x;
    S.seg.forEach((r, i) => {
      const w = i % 2 ? waits[(i - 1) / 2] : BAR.va;
      r.setAttribute('x', x);
      r.setAttribute('width', Math.max(0, w - 3));
      x += w;
    });
    S.ghost.setAttribute('opacity', live ? clamp(prog(t, LEAN_T[0], 0.4)) : 1);
    S.afterT.setAttribute('x', x + 8);
    S.after.setAttribute('opacity', live ? clamp(prog(t, LEAN_T[2] + LEAN_D, 0.3)) : 1);
    rise(S.leanLegend, t, 2.4, 0.35, 8);
    rise(S.leanNote, t, LEAN_T[2] + LEAN_D + 0.3, 0.4, 10);

    // Six Sigma : les mesures se resserrent autour de la cible
    let out = 0;
    S.dots.forEach((d, i) => {
      const q = live ? easeInOut(prog(t, SIX_T + DELAY[i], SIX_D)) : 1;
      const a = P0[i], b = P1[i];
      const cx = a.x + (b.x - a.x) * q;
      const cy = a.y + (b.y - a.y) * q - 26 * Math.sin(Math.PI * q);
      d.setAttribute('cx', cx);
      d.setAttribute('cy', cy);
      const bad = outside(cx);
      if (bad) out++;
      d.setAttribute('fill', bad ? C.red : C.blue);
    });
    S.curve.setAttribute('opacity', live ? clamp(prog(t, SIX_T - 0.2, 0.4)) : 1);
    rise(S.count, t, 2.4, 0.35, 8);
    S.countT.textContent = `${out} sur ${N}`;
    S.countT.setAttribute('fill', out ? C.tRed : C.tGreen);
    S.countBg.setAttribute('fill', out ? C.pRed : C.pGreen);
    rise(S.sixNote, t, SIX_T + SIX_SPREAD + SIX_D + 0.3, 0.4, 10);

    rise(S.band, t, BAND_T, 0.45, 12);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
