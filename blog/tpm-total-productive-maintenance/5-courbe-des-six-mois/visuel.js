// Blog · TPM · section « Pourquoi la maintenance autonome s'arrête-t-elle à six mois ? »
// Mécanique : même lancement sur deux lignes. À gauche, la même anomalie est signalée trois fois sans réponse :
// l'opérateur conclut que signaler ne sert à rien et arrête de remplir, la courbe des fiches s'effondre vers six mois.
// À droite, un passage chaque semaine à date fixe répond à chaque anomalie : la courbe tient.
// Courbes illustratives, sans échelle chiffrée (hypothèse). Rendu déterministe : boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const PANELS = [{ x: 40, kind: 'seul' }, { x: 610, kind: 'relu' }];
  const PW = 550;
  const CH = { dx: 44, w: 462, y0: 500, y1: 690 };
  const T0 = 2.9, T1 = 11.9, CHUTE_T = 12.3;
  const monthAt = t => (t < FADE_END ? 6 : clamp(6 * (t - T0) / (T1 - T0), 0, 6));
  const tOf = m => T0 + (T1 - T0) * m / 6;
  const SIG_L = [0.6, 1.3, 2.0];         // la même anomalie, signalée trois fois
  const STOP = 2.7;                      // l'opérateur arrête de remplir
  const SIG_R = [0.6, 2.1, 3.7];         // anomalies signalées à droite
  const ans = m => Math.ceil(m * 4 + 0.01) / 4;   // réponse au passage hebdomadaire suivant

  function level(kind, m) {
    if (kind === 'relu') return 0.86 + 0.03 * Math.sin(m * 2.3);
    if (m < 3.0) return 0.86 + 0.03 * Math.sin(m * 2.3);
    const v0 = 0.86 + 0.03 * Math.sin(3.0 * 2.3);
    return 0.08 + (v0 - 0.08) * Math.exp(-Math.pow((m - 3.0) / 1.1, 2));
  }

  const S = { panels: [] };

  function person(parent, cx, floor, fill) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 50, r: 12, fill }, g);
    el('path', { d: `M ${cx - 20} ${floor} L ${cx - 20} ${floor - 18} Q ${cx - 20} ${floor - 34} ${cx} ${floor - 34} Q ${cx + 20} ${floor - 34} ${cx + 20} ${floor - 18} L ${cx + 20} ${floor} Z`, fill }, g);
    return g;
  }
  function sheet(parent, x, y) {
    const g = el('g', {}, parent);
    el('rect', { x, y, width: 38, height: 48, rx: 5, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, g);
    [12, 22, 32].forEach(dy => el('line', { x1: x + 8, y1: y + dy, x2: x + 30, y2: y + dy, stroke: C.lightBlue, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g));
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Personne ne relit,', 'tout s’arrête.', { size: 48 });
    G.blogChapeau('Même lancement, mêmes fiches. Seule différence : la relecture chaque semaine.');

    PANELS.forEach((P, pi) => {
      const x0 = P.x, relu = P.kind === 'relu';
      const L = { kind: P.kind, x0 };
      G.card(x0, 176, PW, 576);
      L.head = el('g');
      G.pill(L.head, x0 + 24, 212, relu ? 'Relue chaque semaine, à date fixe' : 'Personne ne relit les fiches', { size: 19, h: 36, bg: relu ? C.pGreen : C.pRed, fg: relu ? C.tGreen : C.tRed });

      // Scène : l'opérateur, sa fiche, l'anomalie signalée
      L.scene = el('g');
      person(L.scene, x0 + 56, 318, C.teal);
      L.sheet = sheet(L.scene, x0 + 92, 268);
      text(L.scene, x0 + 56, 344, 'opérateur', { size: 15, weight: 600, fill: C.ink, anchor: 'middle' });
      L.tagG = el('g', {}, L.scene);
      G.pill(L.tagG, x0 + 150, 282, 'Anomalie signalée', { size: 18, h: 34, bg: C.pYellow, fg: C.tYellow });
      L.status = el('g', {}, L.scene);
      L.stText = text(L.status, x0 + 180, 330, '', { size: 18, weight: 700, fill: C.tRed });
      L.stIcon = el('g', {}, L.status);
      if (relu) {
        L.rev = el('g');
        person(L.rev, x0 + 478, 318, C.blue);
        text(L.rev, x0 + 478, 344, 'responsable', { size: 15, weight: 600, fill: C.ink, anchor: 'middle' });
        text(L.rev, x0 + 478, 364, 'qui peut décider', { size: 15, weight: 600, fill: C.ink, anchor: 'middle' });
      } else {
        L.count = el('g');
        el('circle', { cx: x0 + 388, cy: 282, r: 19, fill: C.red }, L.count);
        L.countT = text(L.count, x0 + 388, 289, '', { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
        // Bulle : ce que l'opérateur en conclut
        L.bubble = el('g');
        el('path', { d: `M ${x0 + 40} 380 Q ${x0 + 40} 368 ${x0 + 52} 368 L ${x0 + 60} 368 L ${x0 + 56} 352 L ${x0 + 76} 368 L ${x0 + 396} 368 Q ${x0 + 408} 368 ${x0 + 408} 380 L ${x0 + 408} 406 Q ${x0 + 408} 418 ${x0 + 396} 418 L ${x0 + 52} 418 Q ${x0 + 40} 418 ${x0 + 40} 406 Z`, fill: C.pRed }, L.bubble);
        text(L.bubble, x0 + 60, 400, '« Signaler ne sert à rien. »', { size: 19, weight: 700, fill: C.tRed });
        L.pen = el('g');
        G.cross(L.pen, x0 + 128, 314, 12);
      }

      // Courbe : fiches remplies chaque semaine, sur six mois
      const cx0 = x0 + CH.dx, W = CH.w;
      const X = m => cx0 + W * m / 6, Y = v => CH.y1 - (CH.y1 - CH.y0) * v;
      L.X = X; L.Y = Y;
      L.axes = el('g');
      text(L.axes, cx0, 470, 'Fiches remplies chaque semaine', { size: 18, weight: 700, fill: C.ink }, L.axes);
      el('line', { x1: cx0, y1: CH.y1, x2: cx0 + W, y2: CH.y1, stroke: C.line, 'stroke-width': 3 }, L.axes);
      [[0, 'Lancement'], [3, '+3 mois'], [6, '+6 mois']].forEach(([m, s], k) => text(L.axes, X(m), CH.y1 + 26, s, { size: 16, weight: 600, fill: C.ink, anchor: k === 0 ? 'start' : k === 2 ? 'end' : 'middle' }));
      const pts = [];
      for (let m = 0; m <= 6.0001; m += 0.02) pts.push(`${X(m).toFixed(1)} ${Y(level(P.kind, m)).toFixed(1)}`);
      const clip = G.clipRect(cx0 - 6, CH.y0 - 30, 0, CH.y1 - CH.y0 + 40);
      L.clip = clip.rect;
      const cg = el('g', { 'clip-path': clip.url });
      L.curve = cg;
      el('path', { d: `M ${pts.join(' L ')} L ${X(6)} ${CH.y1} L ${X(0)} ${CH.y1} Z`, fill: relu ? C.pGreen : C.pRed, opacity: 0.85 }, cg);
      el('path', { d: 'M ' + pts.join(' L '), fill: 'none', stroke: relu ? C.green : C.red, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, cg);
      L.dot = el('circle', { r: 7, fill: relu ? C.tGreen : C.tRed, stroke: C.white, 'stroke-width': 2.5 });
      // Repères des signalements sur la courbe, et passages hebdomadaires (à droite)
      L.marks = (relu ? SIG_R : SIG_L).map(m => el('path', { d: `M ${X(m)} ${Y(level(P.kind, m)) - 10} l -8 -14 l 16 0 Z`, fill: C.yellow }));
      L.ticks = relu ? Array.from({ length: 24 }, (_, k) => ({ m: (k + 1) / 4, c: el('circle', { cx: X((k + 1) / 4), cy: CH.y1, r: 4, fill: C.blue }) })) : [];
      if (relu) {
        L.leg = el('g');
        const lg = text(L.leg, cx0 + W, 470, 'passage hebdo', { size: 15, weight: 700, fill: C.blue, anchor: 'end' });
        el('circle', { cx: measure(lg).x - 12, cy: 465, r: 5, fill: C.blue }, L.leg);
      } else {
        L.leg = el('g');
        const lg = text(L.leg, cx0 + W, 470, 'signalement', { size: 15, weight: 700, fill: C.tYellow, anchor: 'end' });
        el('path', { d: `M ${measure(lg).x - 19} 459 l 7 12 l 7 -12 Z`, fill: C.yellow }, L.leg);
      }
      S.panels.push(L);
    });

    S.chute = G.blogChute('Il ne se plaindra pas, il arrêtera de remplir.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const m = monthAt(t);

    S.panels.forEach((L, pi) => {
      const relu = L.kind === 'relu';
      pop(L.head, t, 1.75 + 0.2 * pi, L.x0 + 180, 212);
      L.scene.setAttribute('opacity', live ? clamp(prog(t, 2.1 + 0.2 * pi, 0.3)) : o);
      L.axes.setAttribute('opacity', live ? clamp(prog(t, 2.4, 0.3)) : o);
      L.leg.setAttribute('opacity', live ? clamp(prog(t, 2.5, 0.3)) : o);

      // Courbe et point courant
      L.clip.setAttribute('width', Math.max(0.001, L.X(m) - L.X(0) + 12));
      L.curve.setAttribute('opacity', o);
      L.dot.setAttribute('cx', L.X(m));
      L.dot.setAttribute('cy', L.Y(level(L.kind, m)));
      L.dot.setAttribute('opacity', live ? clamp(prog(t, T0 - 0.2, 0.2)) : o);
      const sig = relu ? SIG_R : SIG_L;
      L.marks.forEach((mk, k) => mk.setAttribute('opacity', live ? clamp(prog(t, tOf(sig[k]), 0.2)) : o));
      L.ticks.forEach(k => k.c.setAttribute('opacity', live ? (m >= k.m ? 1 : 0.25) * clamp(prog(t, 2.4, 0.3)) : o));

      // Anomalie : statut
      const nSig = live ? sig.filter(s => m >= s).length : sig.length;
      L.tagG.setAttribute('opacity', nSig > 0 ? 1 : 0.25);
      while (L.stIcon.firstChild) L.stIcon.firstChild.remove();
      if (relu) {
        const last = sig.filter(s => m >= s).pop();
        const answered = last !== undefined && m >= ans(last);
        const pending = last !== undefined && !answered;
        L.stText.textContent = answered ? 'traitée au passage suivant' : pending ? 'en attente du passage' : '';
        L.stText.setAttribute('fill', answered ? C.tGreen : C.tYellow);
        if (answered) G.check(L.stIcon, L.x0 + 164, 324, 11);
        L.rev.setAttribute('opacity', live ? clamp(prog(t, 2.3, 0.3)) : o);
        sig.forEach(s => { const ta = tOf(ans(s)); if (live && t >= ta - 0.05 && t < ta + 0.7) pulse(L.rev, t, ta, L.x0 + 478, 300, 0.1, 0.4); });
      } else {
        L.stText.textContent = nSig ? 'sans réponse' : '';
        if (nSig) G.cross(L.stIcon, L.x0 + 164, 324, 11);
        L.countT.textContent = nSig ? `×${nSig}` : '';
        L.count.setAttribute('opacity', (nSig ? 1 : 0) * o);
        sig.forEach(s => { const ts = tOf(s); if (live && t >= ts - 0.05 && t < ts + 0.7) pulse(L.count, t, ts, L.x0 + 388, 282, 0.2, 0.4); });
        const stopped = live ? m >= STOP : true;
        L.bubble.setAttribute('opacity', live ? clamp(prog(t, tOf(STOP), 0.3)) : o);
        pop(L.pen, t, tOf(STOP) + 0.2, L.x0 + 128, 314);
        L.sheet.setAttribute('opacity', stopped ? 0.35 : 1);
      }
    });

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
