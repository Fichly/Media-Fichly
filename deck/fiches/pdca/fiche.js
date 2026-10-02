// Illustrations propres à la carte N°11 PDCA (le gabarit commun est dans ../../gabarit/carte.js).
// Recto : la roue PDCA monte la pente, poussée par un judoka et retenue par la cale.
// Verso : vignettes des 4 étapes, pictos des bonnes pratiques.
// Style des personnages : celui de la boîte du deck. Un seul trait d'encre fin (1 à 1,2 px),
// kimono blanc sans ombre, col croisé indigo, ceinture du niveau, cheveux noirs, œil et sourire,
// mains aux doigts esquissés, pieds nus.
(() => {
  const { el, frag, ajoute, P, rad, note, pointe, trait, R, suite, alpha } = Carte;
  let C;

  // ---------- Géométrie ----------
  const add = (a, b, k = 1) => [a[0] + k * b[0], a[1] + k * b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const len = v => Math.hypot(v[0], v[1]);
  const norm = v => { const l = len(v) || 1; return [v[0] / l, v[1] / l]; };
  const perp = v => [-v[1], v[0]];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  // courbe lisse (Catmull-Rom) passant par les points
  function lisse(pts, ferme = false) {
    const n = pts.length, Q = i => ferme ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    let d = `M${P(pts[0])}`;
    const fin = ferme ? n : n - 1;
    for (let i = 0; i < fin; i++) {
      const p0 = Q(i - 1), p1 = Q(i), p2 = Q(i + 1), p3 = Q(i + 2);
      const c1 = add(p1, sub(p2, p0), 1 / 6), c2 = add(p2, sub(p3, p1), -1 / 6);
      d += ` C${P(c1)} ${P(c2)} ${P(p2)}`;
    }
    return ferme ? d + ' Z' : d;
  }
  // cinématique inverse à deux segments : position du genou ou du coude
  function ik(A, B, l1, l2, cote) {
    let dx = B[0] - A[0], dy = B[1] - A[1];
    const d = Math.hypot(dx, dy), dd = Math.min(d, l1 + l2 - 0.01);
    const a = (l1 * l1 - l2 * l2 + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    dx /= d; dy /= d;
    return [A[0] + dx * a - dy * h * cote, A[1] + dy * a + dx * h * cote];
  }
  // contour d'un membre : polyligne + demi-largeurs, extrémités ouvertes (renvoie les deux bords)
  function bords(pts, demi) {
    const g = [], d = [];
    pts.forEach((p, i) => {
      const t = norm(sub(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)])), n = perp(t);
      g.push(add(p, n, demi[i])); d.push(add(p, n, -demi[i]));
    });
    return { g, d };
  }

  // ---------- Pièces de personnage (trait unique) ----------
  const st = (ep, fill = 'none') => `fill="${fill}" stroke="${C.encre}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"`;

  // manche large ou jambe de pantalon : contour fermé, plis éventuels
  function tissu(pts, demi, ep, o = {}) {
    const { g, d } = bords(pts, demi);
    const bout = o.ourlet !== false;
    // bord gauche, ourlet, bord droit à rebours
    const dr = d.slice().reverse();
    let s = `<path d="${lisse(g)} L${P(dr[0])} ${lisse(dr).replace(/^M[^C]*/, '')} Z" ${st(ep, C.papier)}/>`;
    if (bout) {                                  // ourlet : petite ellipse d'ouverture
      const a = g[g.length - 1], b = d[d.length - 1], m = lerp(a, b, .5), t = norm(sub(pts[pts.length - 1], pts[pts.length - 2]));
      s += `<path d="M${P(a)} Q${P(add(m, t, -2.2))} ${P(b)}" ${st(ep * .85)}/>`;
    }
    (o.plis || []).forEach(([i, k, l]) => {     // pli : petit trait courbe près d'une articulation
      const p = pts[i], t = norm(sub(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)])), n = perp(t);
      const a = add(p, n, k * demi[i] * .9), b = add(add(p, n, k * demi[i] * (1 - l)), t, -2.5);
      s += `<path d="M${P(a)} Q${P(add(lerp(a, b, .5), t, 1.2))} ${P(b)}" ${st(ep * .8)}/>`;
    });
    return s;
  }
  // main : paume et doigts esquissés, x local = direction de l'avant-bras
  function mainDessin(p, ang, k, ep, o = {}) {
    const deg = ang * 180 / Math.PI, f = o.miroir ? -1 : 1;
    const d = `M-3 ${-3.2 * f} C0 ${-4.4 * f} 3.5 ${-4.2 * f} 5.4 ${-3.4 * f} C7.6 ${-3.2 * f} 8.2 ${-1.6 * f} 7.4 ${-1.2 * f}
      C8.6 ${-.9 * f} 8.8 ${.6 * f} 7.6 ${.7 * f} C8.6 ${1.1 * f} 8.4 ${2.6 * f} 7 ${2.5 * f} C7.4 ${3.5 * f} 6.2 ${4.2 * f} 5 ${3.6 * f}
      C3.2 ${3.6 * f} 1 ${3.9 * f} -1 ${3.6 * f}`;
    const pouce = `M1.2 ${-3.8 * f} C2.8 ${-6.4 * f} 5.4 ${-6.6 * f} 5.6 ${-5 * f} C5.4 ${-4.2 * f} 4.4 ${-3.9 * f} 3.6 ${-3.7 * f}`;
    const doigts = `M4.4 ${-1.2 * f} L7.2 ${-1.2 * f} M4.6 ${.7 * f} L7.4 ${.7 * f}`;
    return `<g transform="translate(${P(p)}) rotate(${deg.toFixed(1)}) scale(${k})">
      <path d="${d}" ${st(ep / k, C.papier)}/><path d="${pouce}" ${st(ep / k, C.papier)}/><path d="${doigts}" ${st(ep * .8 / k)}/></g>`;
  }
  // pied nu posé à plat : u = direction du sol vers l'avant, n = vers le haut
  function piedNu(cheville, u, n, k, ep) {
    const L = (a, b) => add(add(cheville, u, a * k), n, b * k);
    const d = `M${P(L(-3.6, 2.6))} C${P(L(-5.2, 1))} ${P(L(-5, -1.6))} ${P(L(-2.6, -2))}
      L${P(L(9, -2))} C${P(L(11.6, -2))} ${P(L(12.4, .2))} ${P(L(11, 1.4))}
      C${P(L(8.6, 2.6))} ${P(L(5, 3.4))} ${P(L(2.6, 5.4))}`;
    const orteils = `M${P(L(9.2, -2))} Q${P(L(9.8, -.6))} ${P(L(9.4, .4))} M${P(L(7.4, -2))} Q${P(L(7.9, -.8))} ${P(L(7.6, .9))}`;
    return `<path d="${d}" ${st(ep, C.papier)}/><path d="${orteils}" ${st(ep * .75)}/>`;
  }
  // tête de 3/4, regard vers sens (1 = droite) ; inclinaison en degrés
  function tete(c, r, sens, ep, incl = 0) {
    const s = sens, x = 0, y = 0;
    const visage = `M${-.92 * r * s} ${-.2 * r} C${-.95 * r * s} ${.55 * r} ${-.45 * r * s} ${1.02 * r} ${.08 * r * s} ${1.02 * r}
      C${.6 * r * s} ${1.02 * r} ${.98 * r * s} ${.6 * r} ${.98 * r * s} ${.02 * r} C${.98 * r * s} ${-.62 * r} ${.55 * r * s} ${-1.02 * r} ${0} ${-1.02 * r}
      C${-.55 * r * s} ${-1.02 * r} ${-.9 * r * s} ${-.65 * r} ${-.92 * r * s} ${-.2 * r} Z`;
    const cheveux = `M${-1.0 * r * s} ${.12 * r} C${-1.12 * r * s} ${-.55 * r} ${-.82 * r * s} ${-1.18 * r} ${-.08 * r * s} ${-1.16 * r}
      C${.52 * r * s} ${-1.16 * r} ${.98 * r * s} ${-.84 * r} ${1.02 * r * s} ${-.34 * r}
      C${.72 * r * s} ${-.52 * r} ${.38 * r * s} ${-.5 * r} ${.2 * r * s} ${-.62 * r}
      C${.1 * r * s} ${-.4 * r} ${-.18 * r * s} ${-.34 * r} ${-.42 * r * s} ${-.42 * r}
      C${-.46 * r * s} ${-.18 * r} ${-.62 * r * s} ${-.04 * r} ${-.72 * r * s} ${.22 * r} Z`;
    const oreille = `M${-.5 * r * s} ${-.06 * r} C${-.82 * r * s} ${-.2 * r} ${-.86 * r * s} ${.36 * r} ${-.52 * r * s} ${.34 * r}`;
    const oeil = `<ellipse cx="${.48 * r * s}" cy="${.02 * r}" rx="${.085 * r}" ry="${.12 * r}" fill="${C.encre}"/>`;
    const sourcil = `M${.3 * r * s} ${-.24 * r} Q${.5 * r * s} ${-.32 * r} ${.68 * r * s} ${-.24 * r}`;
    const nez = `M${.92 * r * s} ${.12 * r} Q${1.06 * r * s} ${.3 * r} ${.9 * r * s} ${.36 * r}`;
    const sourire = `M${.36 * r * s} ${.56 * r} Q${.6 * r * s} ${.74 * r} ${.8 * r * s} ${.5 * r}`;
    return `<g transform="translate(${P(c)}) rotate(${incl})">
      <path d="${visage}" ${st(ep, C.papier)}/>
      <path d="${cheveux}" fill="${C.encre}" stroke="${C.encre}" stroke-width="${ep}" stroke-linejoin="round"/>
      <path d="${oreille}" ${st(ep * .9, C.papier)}/>
      ${oeil}<path d="${sourcil}" ${st(ep * .85)}/><path d="${nez}" ${st(ep * .85)}/><path d="${sourire}" ${st(ep * .9)}/></g>`;
  }
  // bande de col indigo (entre deux points, largeur l) avec son trait
  const bande = (a, b, l, ep, ctrl) => {
    const t = norm(sub(b, a)), n = perp(t), h = l / 2;
    const c = ctrl || lerp(a, b, .5);
    const d = `M${P(add(a, n, h))} Q${P(add(c, n, h))} ${P(add(b, n, h))} L${P(add(b, n, -h))} Q${P(add(c, n, -h))} ${P(add(a, n, -h))} Z`;
    return `<path d="${d}" fill="${C.indigo}" stroke="${C.encre}" stroke-width="${ep * .9}" stroke-linejoin="round"/>`;
  };

  // ======================================================================
  // Judoka qui pousse la roue, de profil, tourné vers la droite.
  // ======================================================================
  function judokaPousse(roue, pente, ep) {
    const th = Math.atan(pente.k), u = [Math.cos(th), -Math.sin(th)], up = [-Math.sin(th), -Math.cos(th)];
    const surRoue = (deg, dr = 0) => [roue.cx + (roue.r + dr) * Math.cos(rad(deg)), roue.cy + (roue.r + dr) * Math.sin(rad(deg))];
    const sol = x => [x, pente(x)];
    // squelette
    const H = [84, 123];                                       // hanche
    const incl = rad(50);                                       // buste incliné
    const tb = [Math.sin(incl), -Math.cos(incl)];               // axe du buste vers les épaules
    const fb = [Math.cos(incl), Math.sin(incl)];                // côté ventre
    const S = add(H, tb, 40);                                   // épaule
    const B = (a, b) => add(add(H, tb, a), fb, b);              // repère du buste
    const cuisse = 29, jambe = 28;
    const chevAr = add(sol(44), up, 3.2), chevAv = add(sol(112), up, 3.2);
    const genAr = ik(H, chevAr, cuisse, jambe, -1), genAv = ik(H, chevAv, cuisse, jambe, -1);
    const mainAv = surRoue(153, 2), mainAr = surRoue(166, 2);
    const Sar = add(S, [-1.5, -3]);
    const coudeAv = ik(S, mainAv, 19, 18, 1), coudeAr = ik(Sar, mainAr, 19, 18, 1);
    const poignet = (m, c) => add(m, norm(sub(m, c)), -5.5);
    const angBras = (m, c) => Math.atan2(m[1] - c[1], m[0] - c[0]);
    let g = '';

    // plan arrière : bras et jambe du fond
    g += mainDessin(mainAr, angBras(mainAr, coudeAr), 1, ep);
    g += tissu([Sar, coudeAr, poignet(mainAr, coudeAr)], [6, 5.6, 6.2], ep, { plis: [[1, 1, .5]] });
    g += piedNu(chevAr, u, up, 1, ep);
    g += tissu([B(0, -4), genAr, add(chevAr, up, 2.5)], [8, 6.6, 6], ep, { plis: [[1, -1, .55]] });
    // jambe avant
    g += piedNu(chevAv, u, up, 1, ep);
    g += tissu([B(0, 3), genAv, add(chevAv, up, 2.5)], [8, 6.6, 6], ep, { plis: [[1, 1, .5], [1, 1, .2]] });
    // veste : du col au bas des fesses, pans légèrement évasés
    const veste = [B(42, -8.5), B(44.5, 1), B(40, 10.5), B(22, 12), B(6, 12.5), B(-9, 13.5), B(-12, 3), B(-10, -10.5), B(8, -11.5), B(26, -11)];
    g += `<path d="${lisse(veste, true)}" ${st(ep, C.papier)}/>`;
    g += `<path d="M${P(B(-1, 13.6))} Q${P(B(-5, 9))} ${P(B(-10, 9.5))}" ${st(ep * .8)}/>`;   // pan croisé
    g += `<path d="M${P(B(30, -11.5))} Q${P(B(22, -8))} ${P(B(14, -11.8))}" ${st(ep * .75)}/>`; // pli du dos
    // col croisé indigo, de la nuque à la ceinture
    g += bande(B(44, -4), B(10, 11.5), 3.6, ep, B(32, 9));
    // ceinture du niveau, nœud devant, pans qui pendent
    const c1 = B(10.5, -13), c2 = B(10.5, 14.2), c3 = B(5.5, 14.4), c4 = B(5.5, -13);
    g += `<path d="M${P(c1)} L${P(c2)} L${P(c3)} L${P(c4)} Z" fill="${C.ceinture}" stroke="${C.encre}" stroke-width="${ep}" stroke-linejoin="round"/>`;
    const k = B(8, 13);
    g += `<path d="M${P(add(k, [-1.5, 2]))} L${P(add(k, [-4.5, 13]))} L${P(add(k, [-1.4, 13.6]))} L${P(add(k, [.6, 2.6]))} Z" fill="${C.ceinture}" stroke="${C.encre}" stroke-width="${ep}" stroke-linejoin="round"/>`;
    g += `<path d="M${P(add(k, [1.2, 2]))} L${P(add(k, [3.6, 12.2]))} L${P(add(k, [6.4, 11.2]))} L${P(add(k, [3.2, 1.4]))} Z" fill="${C.ceinture}" stroke="${C.encre}" stroke-width="${ep}" stroke-linejoin="round"/>`;
    g += `<rect x="${(k[0] - 3).toFixed(2)}" y="${(k[1] - 3).toFixed(2)}" width="6" height="6" rx="1.6" fill="${C.ceinture}" stroke="${C.encre}" stroke-width="${ep}" transform="rotate(${(incl * 180 / Math.PI).toFixed(1)} ${P(k)})"/>`;
    // bras avant : manche large, plis au coude, main posée sur la roue
    g += mainDessin(mainAv, angBras(mainAv, coudeAv), 1.05, ep, { miroir: true });
    g += tissu([add(S, [1, 1]), coudeAv, poignet(mainAv, coudeAv)], [6.4, 6, 6.6], ep, { plis: [[1, -1, .45], [1, 1, .55]] });
    // cou et tête, au-dessus des bras, regard vers la roue
    const tc = add(S, [9, -18]);
    g += `<path d="M${P(B(41, -3))} L${P(add(tc, [-6, 9]))} M${P(B(43, 4))} L${P(add(tc, [1, 11]))}" ${st(ep)}/>`;
    g += tete(tc, 12, 1, ep, 6);
    return g;
  }

  // ======================================================================
  // Judoka debout, de face (3/4), hauteur 100 avant échelle, origine entre les pieds.
  // bras : [coude, main] dans le repère du judoka ; sens = regard ; ep = épaisseur à l'échelle 1.
  // ======================================================================
  function judokaDebout(x, y, s, o = {}) {
    const ep = (o.ep || 1.05) / s, sens = o.sens || 1;
    const brasG = o.brasG || [[-17, -54], [-17, -40]], brasD = o.brasD || [[17, -54], [17, -40]];
    const eG = [-11.5, -70], eD = [11.5, -70];
    let g = '';
    // jambes de pantalon larges, pieds nus
    g += piedNu([-8, -2.2], [-1, 0], [0, -1], .7, ep) + piedNu([8, -2.2], [1, 0], [0, -1], .7, ep);
    g += tissu([[-6, -44], [-7, -24], [-7.8, -5.5]], [7, 6.2, 5.6], ep, { plis: [[1, 1, .5]] });
    g += tissu([[6, -44], [7, -24], [7.8, -5.5]], [7, 6.2, 5.6], ep, { plis: [[1, -1, .5]] });
    const bras = (e, b, cote) => mainDessin(b[1], Math.atan2(b[1][1] - b[0][1], b[1][0] - b[0][0]), .95, ep, { miroir: cote < 0 }) +
      tissu([e, b[0], add(b[1], norm(sub(b[1], b[0])), -5)], [5.4, 5.2, 5.8], ep, { plis: [[1, cote, .5]] });
    if (o.fond === 'G') g += bras(eG, brasG, -1);
    // veste
    g += `<path d="${lisse([[-13, -73], [-15.5, -60], [-15.5, -46], [-16, -33], [0, -32], [16, -33], [15.5, -46], [15.5, -60], [13, -73], [0, -76]], true)}" ${st(ep, C.papier)}/>`;
    g += `<path d="M2 -33 L-3 -41" ${st(ep * .8)}/>`;
    // col croisé indigo
    g += bande([5, -76], [-1.5, -60], 3.4, ep) + bande([-5.5, -76], [4.5, -47], 3.4, ep);
    // ceinture et nœud
    g += `<path d="M-15.8 -48 Q0 -46.6 15.8 -48 L15.8 -43 Q0 -41.6 -15.8 -43 Z" fill="${C.ceinture}" stroke="${C.encre}" stroke-width="${ep}" stroke-linejoin="round"/>`;
    g += `<path d="M-1 -43 L-5 -31 L-2 -30.5 L1 -42 Z M1.5 -43 L5.5 -31.5 L8.4 -33 L3.6 -43 Z" fill="${C.ceinture}" stroke="${C.encre}" stroke-width="${ep}" stroke-linejoin="round"/>`;
    g += `<rect x="-3.4" y="-48.6" width="6.8" height="7" rx="2" fill="${C.ceinture}" stroke="${C.encre}" stroke-width="${ep}"/>`;
    if (o.fond !== 'G') g += bras(eG, brasG, -1);
    g += bras(eD, brasD, 1);
    // cou et tête
    g += `<path d="M-3.5 -77 L-3.5 -80 M3.5 -77 L3.5 -80" ${st(ep)}/>`;
    g += tete([.5 * sens, -89], 11, sens, ep, 0);
    if (o.extra) g += o.extra;
    return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
  }

  // ======================================================================
  // Recto : la roue PDCA monte la pente, retenue par la cale
  // ======================================================================
  Carte.dessin('heros', (svg, { graine }) => {
    C = Carte.C;
    const G = suite(graine);
    const W = svg.viewBox.baseVal.width, k = Math.tan(rad(20)), Y0 = 186;
    const pente = x => Y0 - k * x; pente.k = k;
    const th = Math.atan(k), u = [Math.cos(th), -Math.sin(th)], n = [-Math.sin(th), -Math.cos(th)];
    const Pc = [211, pente(211)];                                     // contact roue / sol
    const L = (s, v) => add(add(Pc, u, s), n, v);
    const r = 52, roue = { cx: Pc[0] + r * n[0], cy: Pc[1] + r * n[1], r };
    const rc = rough.svg(svg);
    const aplats = el('g', { transform: 'translate(2.2 1.6)', filter: 'url(#grain)' }, svg);
    const traits = el('g', {}, svg);

    // sol : bande teintée, hachures légères, ligne de pente
    el('polygon', { points: `0,${pente(0)} ${W},${pente(W)} ${W},${pente(W) + 8} 0,${pente(0) + 8}`, fill: C.teinte }, aplats);
    for (let x = 6; x < W - 2; x += 7.5) {
      const y = pente(x);
      el('line', { x1: x, y1: y + 1.2, x2: x - 5, y2: y + 7.5, stroke: C.encre, 'stroke-width': .7, 'stroke-linecap': 'round', opacity: .4 }, traits);
    }
    ajoute(traits, rc.line(0, pente(0), W, pente(W), R(G(), { strokeWidth: 1.7, roughness: .7, bowing: .4 })));

    // roue : quarts en aplats (Plan en haut à gauche, sens horaire), trames sur Do et Act
    const { cx, cy } = roue;
    const secteur = (a0, a1) => {
      const p = a => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
      return `M${cx} ${cy} L${P(p(a0))} A${r} ${r} 0 0 1 ${P(p(a1))} Z`;
    };
    el('circle', { cx, cy, r, fill: C.papier }, svg.insertBefore(el('g', {}), aplats));
    el('path', { d: secteur(180, 270), fill: C.famille }, aplats);
    el('path', { d: secteur(270, 360), fill: 'url(#trame)' }, aplats);
    el('path', { d: secteur(0, 90), fill: C.famille }, aplats);
    el('path', { d: secteur(90, 180), fill: 'url(#trame)' }, aplats);
    ajoute(traits, rc.circle(cx, cy, 2 * r, R(G(), { strokeWidth: 1.7 })));
    ajoute(traits, rc.line(cx - r + 1, cy, cx + r - 1, cy, R(G(), { strokeWidth: 1.1 })));
    ajoute(traits, rc.line(cx, cy - r + 1, cx, cy + r - 1, R(G(), { strokeWidth: 1.1 })));
    const hex = [...Array(6)].map((_, i) => [cx + 8.5 * Math.cos(rad(60 * i + 30)), cy + 8.5 * Math.sin(rad(60 * i + 30))]);
    el('polygon', { points: hex.map(P).join(' '), fill: C.papier }, traits);
    ajoute(traits, rc.polygon(hex, R(G(), { strokeWidth: 1.1, roughness: .5 })));
    el('circle', { cx, cy, r: 2.6, fill: C.encre }, traits);
    // libellés des quarts, centrés dans leur quart, à distance des rayons et du bord
    const lib = (t, a, dx = 0) => {
      const x = cx + r * .6 * Math.cos(rad(a)) + dx, y = cy + r * .6 * Math.sin(rad(a)) + 3.9;
      el('text', { x, y, 'text-anchor': 'middle', 'font-family': 'Poppins', 'font-weight': 700, 'font-size': 11, fill: C.encre }, traits).textContent = t;
    };
    lib('Plan', 225, -1); lib('Do', 315); lib('Check', 45, 1.5); lib('Act', 135);

    // sens de rotation : horaire, la roue monte
    const ar = r + 10, s0 = -146, s1 = -40;
    const pa = a => [cx + ar * Math.cos(rad(a)), cy + ar * Math.sin(rad(a))];
    const e = pa(s1), tang = rad(s1) + Math.PI / 2;
    frag(traits, `<g filter="url(#tremble)">${trait(`M${P(pa(s0))} A${ar} ${ar} 0 0 1 ${P(e)}`, C.indigo, 1.7)}${pointe(e[0], e[1], tang, 7.5, C.indigo, 1.7)}</g>`);

    // la cale : seul aplat indigo, sa face concave épouse la roue côté aval
    const sA = -63, sB = -6, sH = -43, hH = r - Math.sqrt(r * r - sH * sH);
    const arcRoue = [];
    for (let s = sB; s >= sH; s -= 3) arcRoue.push(L(s, r - Math.sqrt(r * r - s * s)));
    arcRoue.push(L(sH, hH));
    const cale = [L(sA, 0), L(sB, 0), ...arcRoue];
    el('polygon', { points: cale.map(P).join(' '), fill: C.indigo }, aplats);
    el('polygon', { points: cale.map(P).join(' '), fill: C.indigo, opacity: .3 }, traits);
    ajoute(traits, rc.polygon(cale, R(G(), { strokeWidth: 1.4, roughness: .5 })));

    // flèche de la note vers la cale
    const cible = L(-47, 6), dep = [cible[0] - 12, 155];
    const ctrl = [dep[0] - 2, cible[1] + 10];
    frag(traits, `<g filter="url(#tremble)">${trait(`M${P(dep)} Q${P(ctrl)} ${P(cible)}`, C.marine, 1.3)}${pointe(cible[0], cible[1], Math.atan2(cible[1] - ctrl[1], cible[0] - ctrl[0]), 5.5, C.marine, 1.3)}</g>`);

    // le judoka
    frag(el('g', { filter: 'url(#tremble)' }, svg), judokaPousse(roue, pente, 1.15));
  });

  // petite roue avec un quart actif (puces de la légende du schéma)
  Carte.dessin('quart', (svg, { graine }) => {
    C = Carte.C;
    const i = +svg.dataset.quart, c = 9, r = 8, a0 = [180, 270, 0, 90][i];
    const p = a => [c + r * Math.cos(rad(a)), c + r * Math.sin(rad(a))];
    const rc = rough.svg(svg);
    el('circle', { cx: c, cy: c, r, fill: C.papier }, svg);
    el('path', { d: `M${c} ${c} L${P(p(a0))} A${r} ${r} 0 0 1 ${P(p(a0 + 90))} Z`, fill: C.famille, filter: 'url(#grain)' }, svg);
    ajoute(svg, rc.circle(c, c, 2 * r, R(40 + i, { strokeWidth: 1.1, roughness: .5 })));
    ajoute(svg, rc.line(c - r, c, c + r, c, R(50 + i, { strokeWidth: .8, roughness: .3 })));
    ajoute(svg, rc.line(c, c - r, c, c + r, R(60 + i, { strokeWidth: .8, roughness: .3 })));
  });

  // ======================================================================
  // Verso : vignettes tirées de l'exemple de la carte (96 × 64)
  // ======================================================================
  function machine(x, y, s = 1, o = {}) {           // x, y : coin bas gauche ; 40 × 46 à l'échelle 1
    const ep = 1.1 / s;
    let g = '';
    g += trait('M4 0 V4 M36 0 V4', C.encre, ep * 1.3);
    g += `<rect x="0" y="-46" width="40" height="46" rx="4" fill="${C.papier}" stroke="${C.encre}" stroke-width="${ep}"/>`;
    g += `<rect x="5" y="-40" width="18" height="11" rx="1.5" fill="${C.doux}" stroke="${C.encre}" stroke-width="${ep * .9}"/>`;
    g += trait('M7.5 -33 l3 -3 l3 3.5 l3 -4.5 l3 2.5', C.indigo, ep * .9);
    g += `<circle cx="31.5" cy="-34.5" r="4.2" fill="${C.papier}" stroke="${C.encre}" stroke-width="${ep * .9}"/>` + trait(`M31.5 -34.5 l${2.8 * Math.cos(o.cadran ?? -0.7)} ${2.8 * Math.sin(o.cadran ?? -0.7)}`, C.encre, ep * .9);
    g += `<rect x="5" y="-23" width="30" height="15" rx="2.5" fill="${o.bac || C.teinte}" stroke="${C.encre}" stroke-width="${ep * .9}"/>`;
    if (o.fiche) g += `<g transform="translate(25 -55) rotate(7)"><rect x="0" y="0" width="13" height="16" rx="1.3" fill="${C.blanc}" stroke="${C.encre}" stroke-width="${ep * .9}"/>${trait('M3 4.5 h7 M3 8 h7 M3 11.5 h4.5', C.marine, ep * .7)}</g>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
  }
  const sol = () => trait('M0 63 H96', C.encre, .9, ' opacity=".35"');
  // Plan : au tableau, la cause (60 % des rebuts viennent des réglages)
  Carte.dessin('vignette-plan', svg => {
    C = Carte.C;
    let g = sol();
    g += trait('M42 42 L38 63 M88 42 L92 63', C.encre, 1.2);
    g += `<rect x="33" y="3" width="62" height="40" rx="2" fill="${C.blanc}" stroke="${C.encre}" stroke-width="1.15"/>` + trait('M31 3 H97', C.encre, 2);
    const cx = 44, cy = 16, r = 8, a0 = -Math.PI / 2, a1 = a0 + 2 * Math.PI * 0.6;
    g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.papier}" stroke="${C.encre}" stroke-width="1.05"/>`;
    g += `<path d="M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 1 1 ${P([cx + r * Math.cos(a1), cy + r * Math.sin(a1)])} Z" fill="url(#trame-marine)" stroke="${C.encre}" stroke-width="1.05" stroke-linejoin="round"/>`;
    g += judokaDebout(16, 62, 0.6, { brasD: [[24, -62], [36, -74]], brasG: [[-17, -54], [-15.5, -41]] });
    frag(svg, `<g filter="url(#tremble)">${g}</g>`);
    note(svg, 64, 21, '60 %', { taille: 15, ancre: 'start' });
    note(svg, 36, 38, 'réglages', { taille: 14.3, couleur: C.indigo, ancre: 'start', graisse: 600 });
  });
  // Do : le judoka règle une machine, test sur une journée
  Carte.dessin('vignette-do', svg => {
    C = Carte.C;
    let g = sol();
    g += machine(52, 61, 0.92, { cadran: -2.3 });
    g += `<g transform="translate(46.5 34) rotate(-35)">${trait('M0 0 L8 0', C.encre, 3.2)}${trait('M0 0 L8 0', C.papier, 1.3)}<circle cx="10" cy="0" r="2.8" fill="${C.papier}" stroke="${C.encre}" stroke-width="1.05"/></g>`;
    g += judokaDebout(22, 62, 0.6, { fond: 'G', brasD: [[27, -58], [40, -48]], brasG: [[16, -60], [36, -64]] });
    frag(svg, `<g filter="url(#tremble)">${g}</g>`);
    note(svg, 94, 10.5, 'une journée', { taille: 14.3, couleur: C.indigo, graisse: 600, ancre: 'end' });
  });
  // Check : on compare au but (ligne d'objectif à 5 %)
  Carte.dessin('vignette-check', svg => {
    C = Carte.C;
    const base = 61, e = 4;                                   // 4 px par point de %
    let g = trait(`M8 4 V${base} H74`, C.encre, 1.2);
    g += `<rect x="15" y="${base - 10 * e}" width="18" height="${10 * e}" fill="url(#trame-marine)" stroke="${C.encre}" stroke-width="1.15"/>`;
    g += `<rect x="45" y="${base - 7 * e}" width="18" height="${7 * e}" fill="${C.famille}" stroke="${C.encre}" stroke-width="1.15"/>`;
    g += trait(`M5 ${base - 5 * e} H74`, C.indigo, 1.3, ' stroke-dasharray="4 3"');
    g += trait(`M35 ${base - 10 * e + 3} Q42 ${base - 10 * e + 1} 45 ${base - 7 * e - 3}`, C.indigo, 1.15) + pointe(45, base - 7 * e - 3, rad(75), 4.5, C.indigo, 1.15);
    g += `<g transform="translate(83 13)">${trait('M4 4 L9.5 9.5', C.encre, 2.6)}<circle cx="0" cy="0" r="6" fill="${alpha(C.blanc, .55)}" stroke="${C.encre}" stroke-width="1.15"/></g>`;
    frag(svg, `<g filter="url(#tremble)">${g}</g>`);
    note(svg, 22, base - 10 * e - 4, '10 %', { taille: 14.3 });
    note(svg, 57, base - 7 * e - 4, '7 %', { taille: 14.3 });
    note(svg, 86, base - 5 * e + 4.5, '5 %', { taille: 14.3, couleur: C.indigo });
  });
  // Act : la procédure de paramétrage est déployée aux autres machines
  Carte.dessin('vignette-act', svg => {
    C = Carte.C;
    let g = sol();
    g += machine(3, 61, 0.62, { fiche: true, bac: C.famille });
    g += machine(35, 61, 0.62, { fiche: true, cadran: -1.6 });
    g += machine(67, 61, 0.62, { fiche: true, cadran: -2.4 });
    g += trait('M22 25 Q34 16 46 24', C.indigo, 1.15) + pointe(46, 24, rad(40), 4.5, C.indigo, 1.15);
    g += trait('M22 23 Q50 7 78 23', C.indigo, 1.15) + pointe(78, 23, rad(35), 4.5, C.indigo, 1.15);
    frag(svg, `<g filter="url(#tremble)">${g}</g>`);
    note(svg, 50, 10.5, 'procédure', { taille: 14.3, couleur: C.indigo, graisse: 600 });
  });

  // ======================================================================
  // Pictos des bonnes pratiques (40 × 30), logés dans le rail
  // ======================================================================
  // la cale : une petite roue PDCA posée sur la pente, retenue par son coin indigo
  Carte.dessin('icone-cale', (svg, { graine }) => {
    C = Carte.C;
    const G = suite(graine), rc = rough.svg(svg);
    const k = Math.tan(rad(20)), y = x => 28 - k * x, th = Math.atan(k);
    const u = [Math.cos(th), -Math.sin(th)], n = [-Math.sin(th), -Math.cos(th)];
    const Pc = [29, y(29)], r = 9, c = add(Pc, n, r);
    const L = (s, v) => add(add(Pc, u, s), n, v);
    const sH = -8.2, cale = [L(-20, 0), L(-1.5, 0)];
    for (let s = -1.5; s > sH; s -= 1.8) cale.push(L(s, r - Math.sqrt(r * r - s * s)));
    cale.push(L(sH, r - Math.sqrt(r * r - sH * sH)));
    const q = (a0) => `M${P(c)} L${P([c[0] + r * Math.cos(rad(a0)), c[1] + r * Math.sin(rad(a0))])} A${r} ${r} 0 0 1 ${P([c[0] + r * Math.cos(rad(a0 + 90)), c[1] + r * Math.sin(rad(a0 + 90))])} Z`;
    frag(svg, `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="${C.papier}"/>
      <g filter="url(#grain)" transform="translate(.8 .6)"><path d="${q(180)}" fill="${C.famille}"/><path d="${q(0)}" fill="${C.famille}"/>
      <polygon points="${cale.map(P).join(' ')}" fill="${C.indigo}"/></g>`);
    ajoute(svg, rc.line(0, y(0), 40, y(40), R(G(), { strokeWidth: 1.1, roughness: .4 })));
    ajoute(svg, rc.circle(c[0], c[1], 2 * r, R(G(), { strokeWidth: 1.1, roughness: .4 })));
    ajoute(svg, rc.line(c[0] - r, c[1], c[0] + r, c[1], R(G(), { strokeWidth: .8, roughness: .3 })));
    ajoute(svg, rc.line(c[0], c[1] - r, c[0], c[1] + r, R(G(), { strokeWidth: .8, roughness: .3 })));
    ajoute(svg, rc.polygon(cale, R(G(), { strokeWidth: 1, roughness: .3 })));
  });
  // l'horloge : plus de temps pour planifier (le secteur « Plan » s'étire)
  Carte.dessin('icone-horloge', (svg, { graine }) => {
    C = Carte.C;
    const G = suite(graine), rc = rough.svg(svg), c = [28, 15.5], r = 12;
    const p = (a, rr = r) => [c[0] + rr * Math.cos(rad(a)), c[1] + rr * Math.sin(rad(a))];
    frag(svg, `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="${C.papier}"/>
      <g filter="url(#grain)" transform="translate(.8 .6)"><path d="M${P(c)} L${P(p(-90))} A${r} ${r} 0 0 1 ${P(p(60))} Z" fill="${C.famille}"/></g>`);
    ajoute(svg, rc.circle(c[0], c[1], 2 * r, R(G(), { strokeWidth: 1.1, roughness: .45 })));
    [0, 90, 180, 270].forEach(a => frag(svg, trait(`M${P(p(a))} L${P(p(a, r - 2.6))}`, C.encre, .9)));
    frag(svg, trait(`M${P(c)} L${P([c[0], c[1] - 8])} M${P(c)} L${P([c[0] + 5.6, c[1] + 3.2])}`, C.encre, 1.3) + `<circle cx="${c[0]}" cy="${c[1]}" r="1.4" fill="${C.encre}"/>`);
    // boutons du réveil
    frag(svg, trait(`M${P(p(-125, r + 1.5))} L${P(p(-112, r + 3.5))} M${P(p(-55, r + 1.5))} L${P(p(-68, r + 3.5))}`, C.encre, 1.3));
  });
})();
