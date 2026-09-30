// Blog · Lean Manufacturing · principe 4 « Tirer le flux »
// Mécanique : deux lignes identiques (poste A, poste B, client), même demande client, même point de départ.
// En haut, chaque poste produit à son rythme sur prévision : les stocks grossissent.
// En bas, le client prend une pièce, une carte kanban remonte, le poste ne remplace que ce qui a été consommé.
// Simulation à événements calculée au chargement ; rendu déterministe, boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_START, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S0 = 2.9, SIM_END = 12.4;          // la journée simulée
  const CLIENT = k => S0 + 0.6 + 1.2 * k;  // même demande client sur les deux lignes
  const LANES = [{ y0: 176, kind: 'push' }, { y0: 468, kind: 'pull' }];
  const X = { plan: 112, A: 226, s1: 398, B: 530, s2: 700, client: 838 };
  const MK = 0.45, MW = 180 * MK, MH = 124 * MK;

  const S = { lanes: [] };

  // ---------- Petits pictos ----------
  function person(parent, cx, floor) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 62, r: 14, fill: C.blue }, g);
    el('path', { d: `M ${cx - 24} ${floor} L ${cx - 24} ${floor - 22} Q ${cx - 24} ${floor - 42} ${cx} ${floor - 42} Q ${cx + 24} ${floor - 42} ${cx + 24} ${floor - 22} L ${cx + 24} ${floor} Z`, fill: C.blue }, g);
    return g;
  }
  function planning(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('rect', { x: cx - 34, y: cy - 36, width: 68, height: 72, rx: 10, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, g);
    el('rect', { x: cx - 16, y: cy - 44, width: 32, height: 14, rx: 5, fill: C.blue }, g);
    [-12, 2, 16].forEach((dy, i) => {
      el('rect', { x: cx - 22, y: cy + dy - 4, width: 8, height: 8, rx: 2, fill: C.lightBlue }, g);
      el('rect', { x: cx - 8, y: cy + dy - 3, width: i === 1 ? 22 : 30, height: 6, rx: 3, fill: C.pLav }, g);
    });
    return g;
  }
  function kanban(parent) {
    const g = el('g', {}, parent);
    el('rect', { x: -11, y: -14, width: 22, height: 28, rx: 4, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, g);
    el('rect', { x: -11, y: -14, width: 22, height: 8, rx: 3, fill: C.blue }, g);
    el('line', { x1: -6, y1: 1, x2: 6, y2: 1, stroke: C.blue, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    el('line', { x1: -6, y1: 7, x2: 3, y2: 7, stroke: C.blue, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    return g;
  }

  // ---------- Simulation ----------
  // Une ligne : événements de stock (+1 à l'arrivée d'une pièce, -1 à son départ) et vols de pièces / cartes.
  function simulate(kind) {
    const flights = [];   // { t0, d, from, to, fromStock?, toStock?, card? }
    const add = f => { if (f.t0 + f.d <= SIM_END - 0.05) flights.push(f); return f; };
    const busy = { A: [], B: [] };
    if (kind === 'push') {
      for (let k = 0; S0 + 0.1 + 0.5 * k < SIM_END; k++) {                 // A : une pièce toutes les 0,5 s
        const t = S0 + 0.1 + 0.5 * k;
        if (add({ t0: t, d: 0.35, from: 'A', to: 's1', toStock: 0 }).t0 === t) busy.A.push([t - 0.3, t]);
      }
      for (let k = 0; S0 + 0.2 + 0.8 * k < SIM_END; k++) {                 // B : toutes les 0,8 s
        const t = S0 + 0.2 + 0.8 * k;
        if (t + 0.7 + 0.35 > SIM_END - 0.05) break;
        add({ t0: t, d: 0.3, from: 's1', to: 'B', fromStock: 0 });
        add({ t0: t + 0.7, d: 0.35, from: 'B', to: 's2', toStock: 1 });
        busy.B.push([t + 0.3, t + 0.7]);
      }
      for (let k = 0; CLIENT(k) < SIM_END; k++) add({ t0: CLIENT(k), d: 0.4, from: 's2', to: 'client', fromStock: 1 });
    } else {
      for (let k = 0; CLIENT(k) + 1.8 <= SIM_END - 0.05; k++) {
        const w = CLIENT(k);
        add({ t0: w, d: 0.4, from: 's2', to: 'client', fromStock: 1 });          // le client prend une pièce
        add({ t0: w + 0.1, d: 0.5, from: 's2', to: 'B', card: 1 });              // la carte remonte à B
        add({ t0: w + 0.6, d: 0.3, from: 's1', to: 'B', fromStock: 0 });         // B prend dans le supermarché
        add({ t0: w + 1.1, d: 0.35, from: 'B', to: 's2', toStock: 1 });          // et remplace la pièce
        busy.B.push([w + 0.6, w + 1.1]);
        add({ t0: w + 0.7, d: 0.5, from: 's1', to: 'A', card: 0 });              // la carte remonte à A
        add({ t0: w + 1.4, d: 0.35, from: 'A', to: 's1', toStock: 0 });          // A remplace la pièce prise par B
        busy.A.push([w + 1.2, w + 1.4]);
      }
    }
    // Emplacements : empilement LIFO, calculé dans l'ordre chronologique
    const changes = [];
    flights.forEach(f => {
      if (f.fromStock !== undefined) changes.push({ t: f.t0, s: f.fromStock, dn: -1, f, end: 'from' });
      if (f.toStock !== undefined) changes.push({ t: f.t0 + f.d, s: f.toStock, dn: +1, f, end: 'to' });
    });
    changes.sort((a, b) => a.t - b.t || a.dn - b.dn);
    const count = [2, 2], max = [2, 2];
    const series = [[{ t: -1, n: 2 }], [{ t: -1, n: 2 }]];
    changes.forEach(c => {
      if (c.dn < 0) { count[c.s]--; c.f.fromSlot = count[c.s]; }
      else { c.f.toSlot = count[c.s]; count[c.s]++; }
      max[c.s] = Math.max(max[c.s], count[c.s]);
      series[c.s].push({ t: c.t, n: count[c.s] });
    });
    return { flights, series, max, busy, final: count.slice() };
  }
  const countAt = (series, t) => { let n = series[0].n; for (const p of series) { if (p.t <= t) n = p.n; else break; } return n; };

  function build() {
    G.templateBlog();
    G.blogTitle('Flux poussé,', 'flux tiré.');
    G.blogChapeau('Qu’est-ce qui déclenche la production : une prévision, ou une consommation réelle ?');

    LANES.forEach((ln, li) => {
      const L = { ...ln, sim: simulate(ln.kind) };
      const Y0 = ln.y0, floor = Y0 + 214;
      L.floor = floor;
      const push = ln.kind === 'push';
      G.card(40, Y0, 1120, 276);

      // En-tête
      L.head = el('g');
      const p = G.pill(L.head, 64, Y0 + 38, push ? 'Flux poussé' : 'Flux tiré', { size: 22, h: 38, bg: push ? C.pRed : C.pGreen, fg: push ? C.tRed : C.tGreen });
      fit(text(L.head, 64 + p.w + 16, Y0 + 46, push ? 'Chaque poste produit à son rythme, sur prévision.' : 'Chaque poste ne remplace que ce que l’étape suivante a consommé.', { size: 21, weight: 500, fill: C.ink }), 1136, `sous-titre ${li}`);

      el('line', { x1: 64, y1: floor + 2, x2: 890, y2: floor + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });

      // Stations
      L.st = {};
      const lbl = (g, x, s, sub) => {
        text(g, x, floor + 30, s, { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });
        if (sub) text(g, x, floor + 52, sub, { size: 17, weight: 500, fill: C.ink, anchor: 'middle' });
      };
      ['A', 'B'].forEach(n => {
        const g = el('g');
        const m = G.machine(g, X[n] - MW / 2, floor - MH, MK);
        lbl(g, X[n], `Poste ${n}`);
        L.st[n] = { g, m };
      });
      L.client = el('g');
      person(L.client, X.client, floor);
      lbl(L.client, X.client, 'Client', 'même demande');

      // Stocks : piles libres (poussé) ou supermarchés de 2 emplacements (tiré)
      L.stocks = [X.s1, X.s2].map((cx, s) => {
        const g = el('g');
        const cap = push ? 12 : 2;
        const slot = i => push
          ? { x: cx + ((i % 4) - 1.5) * 24, y: floor - 12 - Math.floor(i / 4) * 24 }
          : { x: cx + (i - 0.5) * 28, y: floor - 13 };
        if (!push) for (let i = 0; i < 2; i++) { const q = slot(i); el('rect', { x: q.x - 12, y: q.y - 12, width: 24, height: 24, rx: 4, fill: 'none', stroke: C.tGreen, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, g); }
        lbl(g, cx, push ? 'Stock' : 'Supermarché', push ? null : '2 places');
        const boxes = Array.from({ length: cap }, (_, i) => { const q = slot(i); return G.carton(g, q.x, q.y, 0.66); });
        return { g, boxes, slot };
      });

      // Flux d'information : prévision poussée (haut) ou boucles kanban (bas)
      L.info = el('g');
      if (push) {
        planning(L.info, X.plan, floor - 44);
        text(L.info, X.plan, floor + 30, 'Prévision', { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });
        L.pushArrows = [
          G.arrow(L.info, `M ${X.plan + 38} ${floor - 58} L ${X.A - MW / 2 - 10} ${floor - 58}`, { dash: '7 6', width: 3 }),
          G.arrow(L.info, `M ${X.plan} ${floor - 84} Q ${X.plan + 40} ${floor - 146} ${(X.plan + X.B) / 2} ${floor - 142} Q ${X.B - 10} ${floor - 138} ${X.B} ${floor - MH - 10}`, { dash: '7 6', width: 3 }),
        ];
      } else {
        const loop = (x0, x1) => `M ${x0} ${floor - 40} Q ${x0} ${floor - 118} ${(x0 + x1) / 2} ${floor - 118} Q ${x1} ${floor - 118} ${x1} ${floor - MH - 10}`;
        L.loops = [loop(X.s1, X.A), loop(X.s2, X.B)].map(d => G.arrow(L.info, d, { dash: '7 6', width: 3, stroke: C.tGreen }));
        const kl = el('g', {}, L.info);
        const k0 = kanban(kl);
        k0.setAttribute('transform', `translate(${(X.s2 + X.B) / 2} ${floor - 118})`);
        text(kl, (X.s2 + X.B) / 2 + 20, floor - 130, 'carte kanban', { size: 17, weight: 600, fill: C.tGreen });
        L.loopPaths = [loop(X.s1, X.A), loop(X.s2, X.B)].map(d => el('path', { d, fill: 'none', stroke: 'none' }));
      }

      // Compteur d'encours
      L.counter = el('g');
      el('rect', { x: 918, y: Y0 + 74, width: 218, height: 180, rx: 20, fill: push ? C.pRed : C.pGreen }, L.counter);
      text(L.counter, 1027, Y0 + 112, 'Pièces en attente', { size: 19, weight: 600, fill: push ? C.tRed : C.tGreen, anchor: 'middle' });
      L.num = text(L.counter, 1027, Y0 + 196, '', { size: 72, weight: 800, fill: push ? C.tRed : C.tGreen, anchor: 'middle' });
      L.trend = text(L.counter, 1027, Y0 + 234, '', { size: 19, weight: 600, fill: push ? C.tRed : C.tGreen, anchor: 'middle' });

      // Vols : une pièce ou une carte par vol
      L.fl = L.sim.flights.map(f => ({ f, g: f.card === undefined ? G.carton(G.svg, 0, 0, 0.66) : kanban(G.svg) }));
      S.lanes.push(L);
    });

    S.chute = G.blogChute('Tirer le flux : ne fabriquer que ce que l’étape suivante a consommé.', { y: 810 });
  }

  // Coordonnées d'un point d'une ligne (station, emplacement de stock)
  function spot(L, name, slot) {
    const f = L.floor;
    if (name === 'A' || name === 'B') return { x: X[name], y: f - MH / 2 };
    if (name === 'client') return { x: X.client, y: f - 50 };
    const s = L.stocks[name === 's1' ? 0 : 1];
    return s.slot(Math.max(0, slot || 0));
  }

  function draw(t) {
    // Temps de simulation : figé sur la fin de journée pour l'image complète et l'effacement
    const simT = t < FADE_END ? SIM_END : Math.min(t, SIM_END);
    const live = t >= FADE_END;
    const hideO = fading(t) ? fadeOut(t) : 1;

    S.lanes.forEach((L, li) => {
      const d0 = 1.75 + 0.35 * li;
      pop(L.head, t, d0, 300, L.y0 + 38);
      pop(L.st.A.g, t, d0 + 0.2, X.A, L.floor - MH / 2);
      pop(L.st.B.g, t, d0 + 0.3, X.B, L.floor - MH / 2);
      pop(L.client, t, d0 + 0.4, X.client, L.floor - 40);
      pop(L.info, t, d0 + 0.55, 300, L.floor - 80);
      pop(L.counter, t, d0 + 0.6, 1027, L.y0 + 160);
      L.stocks.forEach((s, j) => {
        s.g.setAttribute('opacity', hideO * (live ? clamp(prog(t, d0 + 0.45, 0.3)) : 1));
        const n = live && t < S0 ? 2 : countAt(L.sim.series[j], simT);
        s.boxes.forEach((b, i) => b.setAttribute('opacity', i < n ? 1 : 0));
      });

      // Pièces et cartes en vol
      L.fl.forEach(({ f, g }) => {
        const p = live ? prog(simT, f.t0, f.d) : 1;
        const on = live && p > 0 && p < 1;
        g.setAttribute('opacity', on ? 1 : 0);
        if (!on) return;
        let x, y;
        if (f.card !== undefined) {
          const path = L.loopPaths[f.card];
          const pt = path.getPointAtLength(path.getTotalLength() * easeInOut(p));
          x = pt.x; y = pt.y;
        } else {
          const a = spot(L, f.from, f.fromSlot), b = spot(L, f.to, f.toSlot);
          const e = easeInOut(p);
          x = a.x + (b.x - a.x) * e;
          y = a.y + (b.y - a.y) * e - 34 * Math.sin(Math.PI * p);
        }
        g.setAttribute('transform', `translate(${x} ${y})`);
      });

      // Voyants : allumés quand le poste produit
      ['A', 'B'].forEach(n => {
        const on = live && simT < SIM_END && L.sim.busy[n].some(([a, b]) => simT >= a && simT < b);
        L.st[n].m.lights[1].setAttribute('fill', on ? C.yellow : C.green);
      });

      // Flux d'information animé pendant la journée (tirets qui avancent)
      if (L.pushArrows) L.pushArrows.forEach(a => a.path.setAttribute('stroke-dashoffset', live && t < SIM_END ? -((t - S0) * 26) % 13 : 0));
      if (L.loops) L.loops.forEach(a => a.path.setAttribute('stroke-dashoffset', live && t < SIM_END ? ((t - S0) * 26) % 13 : 0));

      // Compteur
      const n = (live && t < S0 ? 4 : countAt(L.sim.series[0], simT) + countAt(L.sim.series[1], simT));
      L.num.textContent = String(n);
      L.trend.textContent = L.kind === 'push' ? (n > 4 ? 'et ça grossit' : '') : 'jamais plus de 4';
      L.trend.setAttribute('opacity', L.kind === 'push' ? clamp((n - 4) / 3) : 1);
    });

    rise(S.chute, t, SIM_END + 0.2, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
