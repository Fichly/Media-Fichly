// Fiche LinkedIn · Hugo Duc · vendredi 9 octobre 2026
// Post : « La question la plus utile que je connaisse pour trouver des gaspillages ne demande aucun outil. »
// Premier commentaire du post (Buffer) : article Lean Manufacturing → encart.
// Le visuel est la pièce maîtresse : un traducteur. En tête, la question d'Hugo, tapée. À gauche, les
// réponses de l'équipe arrivent une à une (points de saisie, texte tapé) ; à droite, leur traduction en
// langage Lean. La dernière ne se traduit pas : un problème connu, remonté, jamais traité.
// Style propre : l'interface qui s'écrit. Image t = 0 = état final. Boucle de 13 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', HEAD_SOFT = '#cfd0ec';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const HEAD_H = 124;
  const ROW_Y = [600, 732, 864, 996], ROW_H = 118;
  const L = { x: 92, w: 520 }, R = { x: 652, w: 336 };

  const QUESTION = `«${NB}Qu’est-ce qui vous empêche de bien travailler${NB}?${NB}»`;
  const ROWS = [
    { avatar: C.teal, quote: [`«${NB}On attend toujours la même`, `pièce le lundi matin.${NB}»`], icon: 'clock', lean: ['Attente'] },
    { avatar: C.violet, quote: [`«${NB}L’outil est rangé à l’autre`, `bout de l’atelier.${NB}»`], icon: 'move', lean: ['Mouvement inutile'] },
    { avatar: C.yellow, quote: [`«${NB}On ressaisit tout ce qu’on a`, `déjà noté sur papier.${NB}»`], icon: 'copy', lean: ['Travail fait', 'deux fois'] },
    { avatar: C.lightBlue, quote: [`«${NB}On le signale depuis des mois.${NB}»`], icon: 'alert', lean: ['Un problème connu,', 'remonté,', 'jamais traité'], key: true },
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 13;
  const T_OUT = 1.2, OUT_DUR = 0.3;
  const T_Q = 1.65, Q_CPS = 55;                   // la question se tape
  const DOTS = 0.35, CPS = 48, L_CPS = 40;        // points de saisie, réponse, traduction
  const chars = r => r.quote.join('').length;
  const T_ROW = [2.7];
  for (let i = 1; i < ROWS.length; i++) T_ROW.push(T_ROW[i - 1] + DOTS + chars(ROWS[i - 1]) / CPS + 0.15);
  const typedEnd = i => T_ROW[i] + DOTS + chars(ROWS[i]) / CPS;
  const T_TR = ROWS.map((_, i) => typedEnd(i) + 0.25);   // début de la traduction
  const SPIN = 0.35;
  const T_BADGE = T_TR[3] + SPIN + ROWS[3].lean.join('').length / L_CPS + 0.25;

  // ---------- Petits éléments ----------
  function avatar(parent, cx, cy, color) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r: 25, fill: color }, g);
    el('circle', { cx, cy: cy - 6, r: 7.5, fill: C.white }, g);
    el('path', { d: `M ${cx - 12.5} ${cy + 14} C ${cx - 12.5} ${cy + 3}, ${cx + 12.5} ${cy + 3}, ${cx + 12.5} ${cy + 14} Z`, fill: C.white }, g);
    return g;
  }
  const ICONS = {
    clock(g) {
      el('circle', { cx: 0, cy: 0, r: 11.5, fill: 'none', stroke: C.white, 'stroke-width': 3 }, g);
      el('path', { d: 'M 0 -6 V 0 L 4.5 3.5', fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    },
    move(g) {
      el('path', { d: 'M -11 9 C -11 -3, 9 5, 9 -7', fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-dasharray': '3.5 3.5', 'stroke-linecap': 'round' }, g);
      el('path', { d: 'M 3.5 -9.5 L 9.5 -8 L 9 -1.5', fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    },
    copy(g) {
      el('rect', { x: -10, y: -12, width: 15, height: 18, rx: 3, fill: 'none', stroke: C.white, 'stroke-width': 2.8 }, g);
      el('rect', { x: -4, y: -6, width: 15, height: 18, rx: 3, fill: C.blue, stroke: C.white, 'stroke-width': 2.8 }, g);
    },
    alert(g) {
      text(g, 0, 9, '!', { size: 26, weight: 800, fill: C.white, anchor: 'middle' });
    },
  };
  // Texte tapé : renvoie une fonction qui affiche les n premiers caractères (lignes enchaînées)
  function typed(parent, x, y0, lines, step, opts) {
    const nodes = lines.map((l, i) => text(parent, x, y0 + i * step, l, opts));
    nodes.forEach((n, i) => { n.full = lines[i]; });
    return {
      nodes,
      show(n) {
        let rest = n, last = null;
        nodes.forEach(nd => {
          const k = Math.max(0, Math.min(nd.full.length, rest));
          nd.textContent = nd.full.slice(0, k);
          if (k > 0 || !last) last = nd;
          rest -= nd.full.length;
        });
        return last;
      },
    };
  }

  const S = { rows: [] };

  function build() {
    D.template({ author: 'hugo' });
    D.title('Une question,', 'aucun outil.');
    D.chapeau('À l’équipe, au poste, pas en salle de réunion.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, bold]) => { const sp = el('tspan', bold ? { 'font-weight': 700, fill: C.blue } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['À gauche, ', 0], ['les réponses de l’équipe', 1], ['. À droite, leur traduction en ', 0], ['langage Lean', 1], ['.', 0]]);
    line(384, [['La dernière ne se traduit pas : c’est ', 0], ['un problème connu, jamais traité', 1], ['.', 0]]);

    const defs = el('defs');
    const cp = el('clipPath', { id: 'frame' }, defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26 }, cp);

    // ----- Cadre de l'application -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: HEAD_H, fill: C.blue, 'clip-path': 'url(#frame)' });
    text(D.svg, 96, FRAME.y + 42, 'Question posée au poste', { size: 18, weight: 700, fill: HEAD_SOFT });
    S.live = el('circle', { cx: 0, cy: FRAME.y + 36, r: 6, fill: C.green });
    const lt = text(D.svg, 984, FRAME.y + 42, 'Au poste', { size: 18, weight: 700, fill: HEAD_SOFT, anchor: 'end' });
    S.live.setAttribute('cx', f2(lt.getBBox().x - 14));
    S.q = typed(D.svg, 96, FRAME.y + 92, [QUESTION], 0, { size: 28, weight: 800, fill: C.white });
    fit(S.q.nodes[0], 990, 'question');
    S.qCaret = el('rect', { x: 0, y: FRAME.y + 66, width: 3.5, height: 32, rx: 1.5, fill: C.white, opacity: 0 });

    // Colonnes
    text(D.svg, 96, 578, 'Ce que dit l’équipe', { size: 18, weight: 700, fill: MUTED });
    text(D.svg, R.x + 4, 578, 'En langage Lean', { size: 18, weight: 700, fill: MUTED });
    S.swap = el('g');
    el('circle', { cx: 0, cy: 0, r: 20, fill: C.pLav }, S.swap);
    el('path', { d: 'M -9 -4 H 8 M 4 -8.5 L 8.5 -4 L 4 0.5 M 9 4.5 H -8 M -4 0 L -8.5 4.5 L -4 9', fill: 'none', stroke: C.blue, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.swap);

    // ----- Les quatre réponses -----
    ROWS.forEach((r, i) => {
      const y0 = ROW_Y[i], cy = y0 + ROW_H / 2;
      const left = el('g');
      const lbox = el('rect', { x: L.x, y: y0, width: L.w, height: ROW_H, rx: 20, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, left);
      avatar(left, L.x + 40, cy, r.avatar);
      const one = r.quote.length === 1;
      const q = typed(left, L.x + 82, one ? cy + 8 : y0 + 50, r.quote, 32, { size: 21, weight: 700, fill: C.ink });
      q.nodes.forEach((n, k) => fit(n, L.x + L.w - 16, `réponse ${i + 1} ligne ${k + 1}`));
      const dots = el('g', {}, left);
      const dl = [0, 1, 2].map(k => el('circle', { cx: L.x + 92 + k * 22, cy, r: 6.5, fill: MUTED }, dots));
      const caret = el('rect', { x: 0, y: 0, width: 3, height: 26, rx: 1.5, fill: C.blue, opacity: 0 }, left);
      // Flèche de traduction
      const arrow = el('path', { d: `M ${L.x + L.w + 10} ${cy} H ${R.x - 12} M ${R.x - 18} ${cy - 6} L ${R.x - 12} ${cy} L ${R.x - 18} ${cy + 6}`, fill: 'none', stroke: r.key ? C.red : C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      // Traduction
      const right = el('g');
      el('rect', { x: R.x, y: y0, width: R.w, height: ROW_H, rx: 20, fill: r.key ? C.pRed : C.pLav, stroke: r.key ? C.red : 'none', 'stroke-width': 2.5 }, right);
      el('circle', { cx: R.x + 40, cy, r: 24, fill: r.key ? C.red : C.blue }, right);
      ICONS[r.icon](el('g', { transform: `translate(${R.x + 40} ${cy})` }, right));
      const n = r.lean.length, step = n === 3 ? 25 : 30, size = n === 3 ? 20 : 22;
      const ly = cy + 8 - (n - 1) * step / 2;
      const tr = typed(right, R.x + 80, ly, r.lean, step, { size, weight: 800, fill: r.key ? C.tRed : C.blue });
      tr.nodes.forEach((nd, k) => fit(nd, R.x + R.w - 14, `traduction ${i + 1} ligne ${k + 1}`));
      const row = { left, lbox, q, dots, dl, caret, arrow, right, tr, cy, key: !!r.key, x0: R.x };
      if (r.key) {
        // Badge : souvent celle qui compte le plus
        const badge = el('g');
        const br = el('rect', { y: y0 - 17, height: 34, rx: 17, fill: C.pYellow, stroke: C.white, 'stroke-width': 3 }, badge);
        const bt = text(badge, 0, y0 + 6, 'Souvent celle qui compte le plus', { size: 17, weight: 700, fill: C.tYellow });
        const bw = 44 + bt.getBBox().width + 16, bx = L.x + L.w - 18 - bw;
        br.setAttribute('x', bx);
        br.setAttribute('width', bw);
        bt.setAttribute('x', bx + 44);
        const pts = [];
        for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 4.5 : 10; pts.push(`${f2(bx + 24 + rr * Math.cos(a))} ${f2(y0 + rr * Math.sin(a))}`); }
        el('path', { d: `M ${pts.join(' L ')} Z`, fill: C.yellow }, badge);
        row.badge = badge;
        row.bc = [bx + bw / 2, y0];
      }
      S.rows.push(row);
    });

    D.encart(['De la valeur aux gaspillages', 'Notre article sur le Lean', '(lien en commentaire)']);
  }

  // Place le curseur à la fin d'un nœud texte
  function caretAt(caret, node, dy) {
    const b = node.getBBox();
    caret.setAttribute('x', f2((node.textContent ? b.x + b.width : Number(node.getAttribute('x'))) + 3));
    caret.setAttribute('y', f2(Number(node.getAttribute('y')) - dy));
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_OUT + OUT_DUR;
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    const blink = Math.floor(t / 0.26) % 2 === 0;

    // Pastille « au poste » qui pulse
    S.live.setAttribute('opacity', f2(0.55 + 0.45 * Math.cos(t * Math.PI * 2 / 1.3)));

    // Question
    const qn = final ? 999 : Math.floor((t - T_Q) * Q_CPS);
    const qLast = S.q.show(Math.max(0, qn));
    S.q.nodes[0].setAttribute('opacity', f2(fade));
    const qTyping = !final && t >= T_Q - 0.2 && qn < QUESTION.length + 3;
    caretAt(S.qCaret, qLast, 24);
    S.qCaret.setAttribute('opacity', qTyping && (qn < QUESTION.length || blink) ? 1 : 0);

    // Échange : icône de traduction qui tourne à chaque réponse traduite
    let spin = 0, shake = 0;
    S.rows.forEach((r, i) => {
      const ps = prog(t, T_TR[i], SPIN);
      if (!final && ps > 0 && ps < 1) spin = 180 * easeInOut(ps);
      if (r.key && !final) { const p = prog(t, T_TR[i] + SPIN, 0.4); if (p > 0 && p < 1) shake = 5 * Math.sin(p * Math.PI * 6) * (1 - p); }
    });
    S.swap.setAttribute('transform', `translate(${f2(R.x - 38 + shake)} 572) rotate(${f2(spin)})`);

    S.rows.forEach((r, i) => {
      // Cellule de gauche : apparaît avec les points de saisie
      const pl = final ? 1 : prog(t, T_ROW[i], 0.3);
      const kl = popScale(pl);
      r.left.setAttribute('opacity', f2((final ? 1 : clamp(pl / 0.4)) * fade));
      r.left.setAttribute('transform', kl === 1 ? '' : `translate(${L.x} ${r.cy}) scale(${f2(kl)}) translate(${-L.x} ${-r.cy})`);
      const typingStart = T_ROW[i] + DOTS;
      const n = final ? 999 : Math.floor((t - typingStart) * CPS);
      const last = r.q.show(Math.max(0, n));
      const dotsOn = !final && t >= T_ROW[i] && t < typingStart;
      r.dots.setAttribute('opacity', dotsOn ? 1 : 0);
      r.dl.forEach((d, k) => d.setAttribute('transform', `translate(0 ${f2(dotsOn ? -6 * Math.max(0, Math.sin((t - T_ROW[i]) * Math.PI * 2 / 0.45 - k * 0.9)) : 0)})`));
      const total = r.q.nodes.reduce((a, nd) => a + nd.full.length, 0);
      const typing = !final && t >= typingStart && n < total;
      caretAt(r.caret, last, 20);
      r.caret.setAttribute('opacity', typing ? 1 : 0);

      // Traduction : glisse depuis la flèche, puis s'écrit
      const pr = final ? 1 : prog(t, T_TR[i] + 0.1, 0.35);
      const dx = -24 * (1 - easeOut(pr));
      r.right.setAttribute('opacity', f2(clamp(pr / 0.5) * fade));
      r.right.setAttribute('transform', dx ? `translate(${f2(dx)} 0)` : '');
      r.arrow.setAttribute('opacity', f2(clamp(pr / 0.5) * fade));
      const ln = final ? 999 : Math.floor((t - T_TR[i] - SPIN) * L_CPS);
      r.tr.show(Math.max(0, ln));

      // La dernière : cadre rouge et badge
      if (r.key) {
        const red = final || t >= T_TR[i];
        r.lbox.setAttribute('stroke', red ? C.red : CARD_LINE);
        r.lbox.setAttribute('stroke-width', red ? 3 : 2);
        const pb = final ? 1 : prog(t, T_BADGE, 0.4);
        const kb = popScale(pb);
        r.badge.setAttribute('opacity', f2((final ? 1 : clamp(pb / 0.4)) * fade));
        r.badge.setAttribute('transform', kb === 1 ? '' : `translate(${r.bc[0]} ${r.bc[1]}) scale(${f2(kb)}) translate(${-r.bc[0]} ${-r.bc[1]})`);
      }
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
