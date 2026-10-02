// Personnages Fichly : Léa, Malik, Sam.
// Trait feutre encre, judogi blanc, rond indigo Fichly sur la poitrine, ceinture à la couleur du niveau.
// Bibliothèque sans dépendance ni aléatoire : chaque appel renvoie le même markup SVG (chaîne),
// à insérer tel quel dans le <svg> d'une carte.
//
//   Personnages.dessiner({ perso: 'lea', pose: 'pousse', ceinture: '#F2C230', x: 60, y: 180, echelle: 1, decor: false })
//   Personnages.ancres({ ...mêmes options })  → points d'accroche (roue, doigt, main…) en coordonnées de la carte
//   Personnages.boite({ ...mêmes options })   → { x, y, largeur, hauteur }
//
// Repère : (x, y) = milieu des pieds au sol (avatar : milieu du bas du buste).
// echelle 1 = personnage debout d'environ 107 unités de haut ; le trait suit (≈ 1,7 unité de contour).
// Dans un viewBox en mm, echelle 0,234 donne un personnage de 25 mm.
// Planche de contrôle : deck/planches/personnages.html (à recapturer après toute retouche du dessin,
// puis régénérer la table BOITES avec Personnages._interne.mesurer).
(function (racine) {
  'use strict';

  // ---------- Palette ----------
  const ENCRE = '#231F20', CORAIL = '#F16969', INDIGO = '#3C4499', GRIS = '#D9D6CE',
    PAPIER = '#FFFFFF', MECHE = '#9A8E8B', GRIS_FONCE = '#A9A49A', MOUTARDE = '#E5B837', JAUNE = '#F2C230';
  // Charte des niveaux. Jaune : brief (#F2C230) ; white et green : valeurs de carte.css ;
  // orange, blue, brown, black : proposition à valider.
  const CEINTURES = { white: PAPIER, yellow: JAUNE, orange: '#EE8A3C', green: '#5DAE4B', blue: '#73A3D4', brown: '#8A5A3C', black: ENCRE };

  // ---------- Échelle et épaisseurs ----------
  // Dessin interne : personnage debout ≈ 285 unités. K ramène à ≈ 107 unités à echelle 1.
  const K = 0.375;
  // Contour à ≈ 1,6 % de la hauteur (≈ 0,4 mm pour un personnage de 25 mm).
  const TRAIT0 = 4.6, FIN0 = 2.9, MECHE0 = 2.5;
  let TRAIT = TRAIT0, FIN = FIN0, MECHE_W = MECHE0;
  // Élément dessiné à l'échelle k (mains, accessoires) : on compense pour garder un trait constant.
  function compense(k, fn) {
    const t = TRAIT, f = FIN, m = MECHE_W;
    TRAIT = TRAIT0 / k; FIN = FIN0 / k; MECHE_W = MECHE0 / k;
    try { return fn(); } finally { TRAIT = t; FIN = f; MECHE_W = m; }
  }

  // ---------- Tremblé déterministe ----------
  // Bruit de valeur lissé : deux tracés qui passent par le même point bougent ensemble,
  // donc aplats et traits restent calés. Pas de filtre SVG : passe tel quel en PDF.
  const AMP_CORPS = 0.8, AMP_VISAGE = 0.55;
  let AMP = 0, FACTEUR = 1;
  function hash(ix, iy, s) {
    const h = Math.sin(ix * 127.1 + iy * 311.7 + s * 74.7) * 43758.5453;
    return (h - Math.floor(h)) * 2 - 1;
  }
  function bruit(x, y, s) {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy, s), b = hash(ix + 1, iy, s), c = hash(ix, iy + 1, s), d = hash(ix + 1, iy + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  const r2 = n => Math.round(n * 100) / 100;
  // Décale chaque point d'un chemin absolu (M L C Q Z uniquement).
  function tremble(d) {
    if (!AMP) return d;
    const out = [], toks = d.match(/[MLCQZ]|-?\d*\.?\d+(?:e-?\d+)?/g);
    let i = 0;
    while (i < toks.length) {
      const t = toks[i];
      if (/[MLCQZ]/.test(t)) { out.push(t); i++; continue; }
      let x = parseFloat(toks[i]), y = parseFloat(toks[i + 1]);
      x += AMP * bruit(x * 0.045, y * 0.045, 3);
      y += AMP * bruit(x * 0.045 + 50, y * 0.045, 9);
      out.push(r2(x) + ',' + r2(y)); i += 2;
    }
    return out.join(' ');
  }
  function avecAmp(a, fn) { const m = AMP; AMP = a * FACTEUR; try { return fn(); } finally { AMP = m; } }

  // ---------- Géométrie ----------
  const rad = a => a * Math.PI / 180;
  const rot = (p, a, o = [0, 0]) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), x = p[0] - o[0], y = p[1] - o[1];
    return [o[0] + x * c - y * s, o[1] + x * s + y * c];
  };
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const norm = a => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; };
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const pt = p => r2(p[0]) + ',' + r2(p[1]);

  // Courbe lisse (Catmull-Rom → Bézier) passant par des points.
  function lisse(ps, ferme) {
    const n = ps.length, get = i => ferme ? ps[(i + n) % n] : ps[Math.max(0, Math.min(n - 1, i))];
    let d = 'M ' + pt(ps[0]);
    for (let i = 0; i < (ferme ? n : n - 1); i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      d += ' C ' + pt(add(p1, mul(sub(p2, p0), 1 / 6))) + ' ' + pt(sub(p2, mul(sub(p3, p1), 1 / 6))) + ' ' + pt(p2);
    }
    return d + (ferme ? ' Z' : '');
  }

  // Membre articulé A (attache) → B (coude, genou) → C (bout) : coude extérieur arrondi, pli intérieur net.
  // Le trait intérieur s'arrête avant l'attache (aisselle) pour se fondre dans le torse.
  function membre(A, B, C, wA, wB, wC, aisselle, plat) {
    const d1 = norm(sub(B, A)), d2 = norm(sub(C, B)), n1 = [-d1[1], d1[0]], n2 = [-d2[1], d2[0]];
    const cr = d1[0] * d2[1] - d1[1] * d2[0], sg = cr >= 0 ? 1 : -1;
    const Ai = add(A, mul(n1, sg * wA / 2)), Ao = sub(A, mul(n1, sg * wA / 2));
    const Bi1 = add(B, mul(n1, sg * wB / 2)), Bi2 = add(B, mul(n2, sg * wB / 2));
    const Ci = add(C, mul(n2, sg * wC / 2)), Co = sub(C, mul(n2, sg * wC / 2));
    // pli intérieur : intersection des deux bords intérieurs
    let X;
    const den = (Bi1[0] - Ai[0]) * (Ci[1] - Bi2[1]) - (Bi1[1] - Ai[1]) * (Ci[0] - Bi2[0]);
    if (Math.abs(cr) < 0.08 || Math.abs(den) < 1e-6) X = lerp(Bi1, Bi2, 0.5);
    else {
      const t = ((Bi2[0] - Ai[0]) * (Ci[1] - Bi2[1]) - (Bi2[1] - Ai[1]) * (Ci[0] - Bi2[0])) / den;
      X = add(Ai, mul(sub(Bi1, Ai), t));
      if (t < 0.3 || t > 1.6) X = lerp(Bi1, Bi2, 0.5);
    }
    // coude extérieur : arc de n1 à n2
    const ext = [], a1 = Math.atan2(-sg * n1[1], -sg * n1[0]), a2 = Math.atan2(-sg * n2[1], -sg * n2[0]);
    let da = a2 - a1;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    const nb = Math.max(1, Math.round(Math.abs(da) / 0.5));
    for (let k = 0; k <= nb; k++) { const aa = a1 + da * k / nb; ext.push(add(B, mul([Math.cos(aa), Math.sin(aa)], wB / 2 * 1.04))); }
    const bout = plat ? [add(Co, mul(d2, 1.5)), add(Ci, mul(d2, 1.5))] : [add(Co, mul(d2, wC * 0.3)), add(C, mul(d2, wC * 0.5)), add(Ci, mul(d2, wC * 0.3))];
    const chaine = [Ao, lerp(Ao, ext[0], 0.5)].concat(ext, [lerp(ext[ext.length - 1], Co, 0.5), Co], plat ? [] : bout, plat ? [] : [Ci]);
    const dExt = lisse(chaine, false) + (plat ? ' L ' + pt(bout[0]) + ' L ' + pt(bout[1]) + ' L ' + pt(Ci) : '');
    const finAis = lerp(X, Ai, aisselle == null ? 0.7 : aisselle);
    return { fond: dExt + ' L ' + pt(X) + ' L ' + pt(Ai) + ' Z', trait: dExt + ' L ' + pt(X) + ' L ' + pt(finAis),
      fin: C, angle: Math.atan2(d2[1], d2[0]) * 180 / Math.PI, Ci, Co, d2 };
  }

  // ---------- Primitives SVG ----------
  function P(d, o = {}) {
    let a = '<path d="' + tremble(d) + '" fill="' + (o.fill || 'none') + '"';
    if (o.stroke !== null) a += ' stroke="' + (o.stroke || ENCRE) + '" stroke-width="' + r2(o.w || TRAIT) + '"';
    if (o.op) a += ' opacity="' + o.op + '"';
    return a + '/>';
  }
  const F = (d, fill) => P(d, { fill, stroke: null });           // aplat seul
  function cercle(cx, cy, r) {                                     // cercle en chemin (le tremblé s'y applique)
    const k = 0.5523 * r;
    return 'M ' + pt([cx, cy - r]) + ' C ' + pt([cx + k, cy - r]) + ' ' + pt([cx + r, cy - k]) + ' ' + pt([cx + r, cy]) +
      ' C ' + pt([cx + r, cy + k]) + ' ' + pt([cx + k, cy + r]) + ' ' + pt([cx, cy + r]) +
      ' C ' + pt([cx - k, cy + r]) + ' ' + pt([cx - r, cy + k]) + ' ' + pt([cx - r, cy]) +
      ' C ' + pt([cx - r, cy - k]) + ' ' + pt([cx - k, cy - r]) + ' ' + pt([cx, cy - r]) + ' Z';
  }
  const Ce = (cx, cy, r, o) => P(cercle(cx, cy, r), o);
  const rond = (c, r, fill, op) => '<circle cx="' + r2(c[0]) + '" cy="' + r2(c[1]) + '" r="' + r2(r) + '" fill="' + fill + '"' + (op ? ' opacity="' + op + '"' : '') + '/>';
  const Ell = (cx, cy, rx, ry, fill) => '<ellipse cx="' + r2(cx) + '" cy="' + r2(cy) + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"/>';
  const G = (inner, tr) => tr ? '<g transform="' + tr + '">' + inner + '</g>' : inner;
  const rect = (x, y, w, h) => 'M ' + pt([x, y]) + ' L ' + pt([x + w, y]) + ' L ' + pt([x + w, y + h]) + ' L ' + pt([x, y + h]) + ' Z';
  // Aplat riso : la couleur, décalée du trait.
  const RISO = [3.2, 2.6];
  const riso = (d, col) => G(F(d, col), 'translate(' + RISO[0] + ',' + RISO[1] + ')');
  // Objet « trait + aplat décalé » : fond papier, aplat décalé, trait.
  const objet = (d, col, w) => F(d, PAPIER) + (col ? riso(d, col) : '') + P(d, { w: w || TRAIT });

  // ---------- Mains ----------
  // Repère : poignet en (0,0), la main avance vers +x ; s = côté du pouce (-1 ou 1).
  const MS = 1.42;   // mains franches : lisibles même en vignette
  function main(type, s = -1) {
    const y = v => v * s;
    let out = '';
    const paume = 'M -3,' + y(-6.2) + ' C 3,' + y(-8.6) + ' 12,' + y(-8.4) + ' 14.6,' + y(-3) +
      ' C 16.6,' + y(2) + ' 13.4,' + y(7.6) + ' 7,' + y(7.6) + ' C 2,' + y(7.6) + ' -1,' + y(6.6) + ' -3,' + y(5.6) + ' Z';
    if (type === 'pointe') {
      const doigt = 'M 9,' + y(-7.6) + ' L 21,' + y(-7.4) + ' C 25,' + y(-7.2) + ' 25,' + y(-2) + ' 21,' + y(-2) + ' L 12,' + y(-2);
      out += F(doigt + ' Z', PAPIER) + P(doigt) + F(paume, PAPIER) + P(paume);
      out += P('M 4,' + y(-6.8) + ' C 6,' + y(-11.5) + ' 11,' + y(-11.5) + ' 12,' + y(-7.5), { fill: PAPIER });
      return out;
    }
    if (type === 'pouce') { // poing fermé, pouce tendu dans l'axe de l'avant-bras
      const poing = 'M -3,' + y(-7) + ' C 4,' + y(-9) + ' 13,' + y(-9) + ' 14.5,' + y(-4) + ' C 16,' + y(1) + ' 15,' + y(8) + ' 9,' + y(8.4) + ' C 4,' + y(8.6) + ' 0,' + y(8) + ' -3,' + y(7) + ' Z';
      out += F(poing, PAPIER) + P(poing);
      const pc = 'M 11,' + y(-8.2) + ' C 15,' + y(-9.4) + ' 22,' + y(-9) + ' 25,' + y(-7) + ' C 27.6,' + y(-5) + ' 26,' + y(-1.6) + ' 22.6,' + y(-1.8) + ' L 14.4,' + y(-2.4);
      out += F(pc + ' Z', PAPIER) + P(pc);
      out += P('M 5,' + y(1.5) + ' L 5,' + y(7.6) + ' M 9.8,' + y(1.5) + ' L 9.8,' + y(7.6), { w: FIN * 0.85 });
      return out;
    }
    if (type === 'ouverte') { // paume à plat, pouce levé, doigts séparés par deux plis
      const o = 'M -3,' + y(-6) + ' C 4,' + y(-8.6) + ' 15,' + y(-9) + ' 17.4,' + y(-3.4) + ' C 19.4,' + y(2.6) + ' 15.6,' + y(7.6) + ' 8,' + y(7.6) + ' C 2,' + y(7.6) + ' -1,' + y(6.6) + ' -3,' + y(5.6) + ' Z';
      out += F(o, PAPIER) + P(o);
      out += P('M 17.6,' + y(-0.6) + ' L 11.5,' + y(-0.9) + ' M 16.4,' + y(3.6) + ' L 11,' + y(3.3), { w: FIN * 0.8 });
      out += P('M 3,' + y(-7) + ' C 3,' + y(-13) + ' 9,' + y(-17) + ' 12,' + y(-14) + ' C 13.4,' + y(-12.4) + ' 10,' + y(-9.6) + ' 8.4,' + y(-7.8), { fill: PAPIER });
      return out;
    }
    // 'tient' / 'poing' : main fermée, pouce posé dessus, doigts repliés marqués par deux plis
    out += F(paume, PAPIER) + P(paume);
    out += P('M 3,' + y(-6.8) + ' C 5,' + y(-12) + ' 12,' + y(-12) + ' 13,' + y(-6.6), { fill: PAPIER });
    if (type !== 'poing') out += P('M 15.2,' + y(-0.4) + ' C 13.4,' + y(0.4) + ' 11.6,' + y(0.4) + ' 10.2,' + y(-0.2) + ' M 14.4,' + y(3.8) + ' C 12.8,' + y(4.6) + ' 11,' + y(4.6) + ' 9.6,' + y(4), { w: FIN * 0.8 });
    if (type === 'poing') out += P('M 8,' + y(0.5) + ' C 10,' + y(1.5) + ' 12,' + y(1.5) + ' 14,' + y(0.5), { w: FIN * 0.85 });
    return out;
  }
  const placerMain = (type, p, a, s) => G(compense(MS, () => main(type, s)), 'translate(' + pt(p) + ') rotate(' + r2(a) + ') scale(' + MS + ')');
  // Point du repère de la main ramené dans le dessin (pour les ancres).
  const pointMain = (m, q) => add(m.p, rot([q[0] * MS, q[1] * MS * m.s], m.a));

  // ---------- Tête ----------
  // Repère : centre (0,0), rayon ≈ 34 ; vue 'tq' = trois-quarts tournée vers la droite.
  const VISAGE = 'M 0,-35 C 21,-35 34,-20 34,0 C 34,21 21,35 1,35 C -20,35 -33,21 -33,0 C -33,-20 -21,-35 0,-35 Z';
  function oreille(x, k) { // k = -1 : oreille gauche ; posée par-dessus les cheveux, petite spirale
    const bord = 'M ' + x + ',-5 C ' + (x + k * 11) + ',-10 ' + (x + k * 13.5) + ',15 ' + x + ',13';
    return F(bord + ' Z', PAPIER) + P(bord) +
      P('M ' + (x + k * 3) + ',0.5 C ' + (x + k * 8) + ',-0.5 ' + (x + k * 8.5) + ',8 ' + (x + k * 4.5) + ',8 C ' + (x + k * 2.5) + ',8 ' + (x + k * 2.5) + ',5 ' + (x + k * 4.6) + ',4.4', { w: FIN * 0.8 });
  }
  const YEUX = { tq: [[4, 2], [22, 2]], face: [[-11.5, 2], [11.5, 2]] };
  function traits(vue, expr, perso) {
    const tq = vue === 'tq', [e1, e2] = YEUX[vue];
    const bouche = tq ? [14, 16] : [0, 16], j1 = tq ? [-6, 12] : [-20, 12], j2 = tq ? [27, 11.5] : [20, 12];
    if (perso === 'malik') { j1[1] -= 2; j2[1] -= 2; }
    const rg = { pensif: [1.4, -1.6], inspecte: [1.6, 1.2], determine: [1.8, 0] }[expr] || [tq ? 0.8 : 0, 0];
    let o = rond(j1, 7.2, CORAIL, 0.42) + rond(j2, tq ? 6.2 : 7.2, CORAIL, 0.42);
    if (expr === 'joie') { // yeux fermés en arcs
      o += [e1, e2].map(e => P('M ' + (e[0] - 4.4) + ',' + (e[1] + 1.8) + ' Q ' + e[0] + ',' + (e[1] - 4.6) + ' ' + (e[0] + 4.4) + ',' + (e[1] + 1.8), { w: FIN * 1.1 })).join('');
    } else {
      o += [e1, e2].map(e => Ell(e[0] + rg[0], e[1] + rg[1], 3.6, 4.7, ENCRE) + rond([e[0] + rg[0] + 1.2, e[1] + rg[1] - 1.7], 1.45, '#fff')).join('');
    }
    // sourcils (sous le casque, Sam n'en a pas besoin)
    if (perso !== 'sam') {
      // « determine » : sourcils droits, un peu bas, sans froncement (déterminé mais bienveillant)
      const by = { effort: [-8, -5.5], concentre: [-8.5, -7], inspecte: [-11, -7.5], pensif: [-11, -10], determine: [-9.5, -9.5] }[expr] || [-10, -10];
      const sb = perso === 'malik' ? FIN * 1.15 : FIN * 0.9;
      o += P('M ' + (e1[0] - 4) + ',' + (by[0] + 1) + ' Q ' + e1[0] + ',' + (by[0] - 1.6) + ' ' + (e1[0] + 4) + ',' + (by[0] + (expr === 'effort' ? 2 : 0.6)), { w: sb });
      o += P('M ' + (e2[0] - 4) + ',' + (by[1] + (expr === 'effort' ? 2.4 : 0.6)) + ' Q ' + e2[0] + ',' + (by[1] - 1.6) + ' ' + (e2[0] + 4) + ',' + (by[1] + 1), { w: sb });
    }
    if (perso !== 'malik') o += bouche_(bouche, expr, ENCRE, PAPIER);
    return o;
  }
  // Bouche : encre sur peau, ou blanche dans la barbe de Malik.
  function bouche_(b, expr, ink, creux) {
    const [bx, by] = b;
    if (expr === 'joie' || expr === 'parle') {
      const lb = expr === 'joie' ? 6 : 5;
      const d = 'M ' + (bx - lb) + ',' + (by - 1.6) + ' Q ' + bx + ',' + (by - 0.4) + ' ' + (bx + lb) + ',' + (by - 1.6) + ' Q ' + (bx + lb * 0.6) + ',' + (by + 7.6) + ' ' + bx + ',' + (by + 7.4) + ' Q ' + (bx - lb * 0.6) + ',' + (by + 7.6) + ' ' + (bx - lb) + ',' + (by - 1.6) + ' Z';
      const langue = 'M ' + (bx - 2.6) + ',' + (by + 5.2) + ' Q ' + bx + ',' + (by + 2.6) + ' ' + (bx + 2.6) + ',' + (by + 5.2) + ' Q ' + bx + ',' + (by + 6.8) + ' ' + (bx - 2.6) + ',' + (by + 5.2) + ' Z';
      return (ink === ENCRE ? P(d, { fill: ENCRE, w: FIN * 0.6 }) : F(d, '#fff')) + F(langue, CORAIL);
    }
    if (expr === 'pensif') return P('M ' + (bx - 3.5) + ',' + (by + 1) + ' Q ' + (bx - 1) + ',' + (by - 1) + ' ' + bx + ',' + (by + 0.6) + ' Q ' + (bx + 1.5) + ',' + (by + 2) + ' ' + (bx + 3.6) + ',' + by, { w: FIN, stroke: ink });
    if (expr === 'inspecte') return Ce(bx + 1, by + 1.4, 2.4, { w: FIN * 0.8, stroke: ink, fill: creux });
    if (expr === 'concentre') return P('M ' + (bx - 3.6) + ',' + (by + 0.6) + ' Q ' + bx + ',' + (by + 2.2) + ' ' + (bx + 3.6) + ',' + (by - 0.2), { w: FIN, stroke: ink });
    if (expr === 'effort') return P('M ' + (bx - 4.4) + ',' + (by + 1) + ' Q ' + bx + ',' + (by - 1) + ' ' + (bx + 4.4) + ',' + (by + 1) + ' Q ' + bx + ',' + (by + 4.4) + ' ' + (bx - 4.4) + ',' + (by + 1) + ' Z', { fill: creux, w: FIN * 0.85, stroke: ink });
    // sourire franc : un croissant ouvert (la bouche se lit même en vignette)
    const sd = 'M ' + (bx - 6) + ',' + (by - 1.4) + ' Q ' + bx + ',' + (by + 0.2) + ' ' + (bx + 6) + ',' + (by - 1.4) + ' Q ' + (bx + 4) + ',' + (by + 6.4) + ' ' + bx + ',' + (by + 6.2) + ' Q ' + (bx - 4) + ',' + (by + 6.4) + ' ' + (bx - 6) + ',' + (by - 1.4) + ' Z';
    return ink === ENCRE ? P(sd, { fill: ENCRE, w: FIN * 0.7 }) : F(sd, '#fff');
  }

  // Chevelure en bataille : alternance de boucles et de mèches pointues, plus de volume sur le dessus.
  function bataille(c, a0, a1, n, rIn, graine) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const t0 = a0 + (a1 - a0) * i / n, t1 = a0 + (a1 - a0) * (i + 1) / n, dt = t1 - t0, tm = (t0 + t1) / 2;
      const haut = Math.max(0, -Math.sin(rad(tm))), ro = rIn + 6 + 13 * haut + 3 * hash(i, graine, 3);
      const p1 = add(c, rot([rIn + 2 * hash(i, graine, 4), 0], t1));
      if (i % 3 === 1) { // mèche pointue, couchée vers l'avant
        const tip = add(c, rot([ro + 7, 0], t1 + dt * 0.45)), c1 = add(c, rot([ro - 2, 0], t0 + dt * 0.1)), c2 = add(c, rot([rIn + 6, 0], t1 + dt * 0.1));
        d += ' Q ' + pt(c1) + ' ' + pt(tip) + ' Q ' + pt(c2) + ' ' + pt(p1);
      } else {
        const k1 = add(c, rot([ro + 4, 0], t0 - dt * 0.05)), k2 = add(c, rot([ro + 5, 0], t1 + dt * 0.05));
        d += ' C ' + pt(k1) + ' ' + pt(k2) + ' ' + pt(p1);
      }
    }
    return d;
  }
  // Cheveux : arr = derrière le visage, av = devant.
  function cheveux(perso, vue) {
    const tq = vue === 'tq', mw = { stroke: MECHE, w: MECHE_W };
    let arr = '', av = '';
    if (perso === 'lea') {
      // longue masse ondulée derrière, mèches grises
      const dos = tq ? [[2, -46], [24, -43], [40, -29], [45, -9], [43, 9], [49, 23], [43, 38], [49, 52], [43, 64], [47, 75], [35, 79], [30, 64], [25, 48], [21, 34], [0, 34], [-12, 36], [-16, 50], [-20, 64], [-21, 78], [-34, 83], [-48, 78], [-54, 66], [-47, 53], [-56, 40], [-49, 26], [-56, 11], [-47, -3], [-50, -19], [-40, -34], [-22, -44]]
        : [[0, -46], [24, -43], [40, -29], [46, -9], [43, 9], [50, 23], [44, 38], [50, 52], [44, 64], [48, 76], [35, 81], [28, 64], [24, 48], [22, 32], [0, 34], [-22, 32], [-24, 48], [-28, 64], [-35, 81], [-48, 76], [-44, 64], [-50, 52], [-44, 38], [-50, 23], [-43, 9], [-46, -9], [-40, -29], [-24, -43]];
      arr += P(lisse(dos, true), { fill: ENCRE });
      arr += P(tq ? 'M -45,-2 C -40,10 -48,22 -44,34 C -40,46 -48,56 -44,68 M -32,44 C -28,52 -34,62 -30,74 M 40,22 C 44,34 38,44 42,56 C 44,62 42,68 41,72' +
        ' M -38,6 C -42,16 -36,24 -39,34 M -22,42 C -25,52 -21,62 -26,74 M -50,32 C -46,42 -52,50 -48,60 M 33,40 C 36,48 32,56 36,66'
        : 'M -44,-2 C -40,10 -48,22 -44,34 C -40,46 -48,56 -44,68 M 44,-2 C 40,10 48,22 44,34 C 40,46 48,56 44,68 M -32,44 C -28,54 -34,64 -32,74 M 32,44 C 28,54 34,64 32,74', mw);
      // calotte et frange : la mèche avant longe le bord du visage, les deux yeux et les deux joues restent visibles
      const cap = tq ? [[-34, 6], [-38, -12], [-31, -32], [-12, -44], [12, -44], [31, -33], [40, -12], [40, 10], [38, 27], [35, 39], [33.5, 26], [33.5, 12], [32, -1], [27, -13], [17, -19], [6, -23], [-4, -15], [-15, -11], [-25, -5]]
        : [[-35, 8], [-38, -12], [-31, -32], [-12, -44], [12, -44], [31, -32], [38, -12], [37, 8], [35, 24], [32, 37], [30, 23], [29, 8], [23, -6], [12, -15], [3, -21], [-6, -13], [-17, -9], [-27, -3]];
      av += P(lisse(cap, true), { fill: ENCRE });
      av += P(tq ? 'M 8,-38 C 18,-35 27,-27 33,-13 M 36,2 C 36,14 36,22 35.5,30 M -6,-38 C -16,-34 -26,-26 -30,-12 M -16,-27 C -22,-22 -27,-14 -29,-4 M 18,-30 C 24,-26 29,-20 31,-12'
        : 'M 4,-38 C 16,-35 26,-26 31,-12 M 33,2 C 33,12 33,20 32,27 M -8,-38 C -18,-34 -27,-26 -31,-12', mw);
    } else if (perso === 'malik') {
      // masse en bataille, festons déterministes, barbe au bord festonné
      const c0 = tq ? [-1, -8] : [0, -8], a0 = tq ? 170 : 168, a1 = tq ? 352 : 372;
      const dep = add(c0, rot([34, 0], a0));
      let d = 'M ' + pt(dep) + bataille(c0, a0, a1, 12, 35, tq ? 7 : 8);
      d += tq ? ' C 36,-4 34,-6 33,-6 Q 30,-10 26,-12 Q 22,-20 15,-17 Q 9,-23 3,-17 Q -4,-22 -9,-15 Q -16,-18 -20,-10 Q -26,-10 -28,-4 C -30,0 -32,3 ' + pt(dep) + ' Z'
        : ' C 36,0 34,-4 32,-6 Q 28,-14 22,-13 Q 18,-22 10,-17 Q 4,-23 -2,-17 Q -9,-22 -14,-14 Q -21,-17 -25,-9 Q -30,-8 -32,-2 C -33,2 -34,4 ' + pt(dep) + ' Z';
      av += P(d, { fill: ENCRE });
      av += P(tq ? 'M -24,-30 C -18,-40 -8,-44 2,-44 M 6,-36 C 14,-42 22,-40 28,-32 M -32,-12 C -30,-20 -26,-24 -20,-26 M -12,-32 C -6,-37 1,-37 7,-33 M 13,-24 C 19,-28 25,-27 30,-21 M -26,-20 C -22,-25 -16,-27 -10,-26'
        : 'M -22,-32 C -16,-42 -6,-46 4,-45 M 8,-38 C 16,-42 24,-38 30,-30 M -34,-12 C -32,-20 -28,-24 -22,-26', mw);
      const barbe = tq ? 'M -31,6 C -30,16 -24,24 -15,26 C -8,27 -2,20 4,16 C 9,13 16,12 21,14 C 26,16 30,14 33,8 C 34,22 28,34 17,39 L 13,43 L 10,39 L 5,43 L 1,38 L -4,41 L -7,37 C -21,32 -32,21 -31,6 Z'
        : 'M -33,2 C -32,14 -26,22 -17,24 C -10,25 -6,15 0,13 C 6,15 10,25 17,24 C 26,22 32,14 33,2 C 34,20 28,33 16,39 L 11,43 L 7,38 L 2,43 L -2,38 L -7,43 L -11,38 C -26,34 -34,22 -33,2 Z';
      av += P(barbe, { fill: ENCRE, w: FIN });
      av += P(tq ? 'M -22,28 C -18,32 -13,34 -9,36 M 27,26 C 24,31 21,35 17,38 M -2,28 C 1,32 6,33 10,32' : 'M -22,26 C -18,32 -12,36 -8,38 M 22,26 C 18,32 12,36 8,38', mw);
    } else if (perso === 'sam') {
      // pattes courtes sous le casque de chantier
      av += P(tq ? 'M -33,4 C -34,-6 -32,-12 -28,-14 L -14,-14 C -18,-10 -22,-4 -24,2 C -27,1 -30,2 -33,4 Z'
        : 'M -34,4 C -35,-6 -33,-12 -29,-14 L -16,-14 C -20,-10 -24,-4 -26,2 Z M 34,4 C 35,-6 33,-12 29,-14 L 16,-14 C 20,-10 24,-4 26,2 Z', { fill: ENCRE, w: FIN });
      const cq = tq ? 'M -36,-12 C -38,-36 -20,-50 2,-50 C 24,-50 38,-36 37,-14 C 42,-14 46,-12 46,-9 C 46,-6 40,-6 36,-6 L -34,-6 C -38,-6 -40,-8 -40,-10 C -40,-12 -38,-12 -36,-12 Z'
        : 'M -36,-12 C -38,-36 -20,-50 0,-50 C 20,-50 38,-36 36,-12 C 40,-12 42,-11 42,-9 C 42,-6 38,-6 36,-6 L -36,-6 C -40,-6 -42,-7 -42,-9 C -42,-11 -40,-12 -36,-12 Z';
      av += objet(cq, null);
      av += P(tq ? 'M -4,-49 C 2,-40 4,-26 4,-12 M 8,-49 C 14,-40 15,-26 15,-12' : 'M -6,-49 C -4,-40 -4,-26 -5,-12 M 6,-49 C 4,-40 4,-26 5,-12', { w: FIN });
      av += P(tq ? 'M -36,-12 L 37,-14' : 'M -36,-12 L 36,-12', { w: FIN });
      av += P(tq ? 'M -24,-24 C -22,-32 -16,-38 -9,-41' : 'M -26,-24 C -24,-32 -18,-38 -11,-41', { w: FIN, stroke: GRIS });
    }
    return { arr, av };
  }

  function lunettes(vue) {
    const [e1, e2] = YEUX[vue], w = { w: FIN * 0.95 };
    let o = Ce(e1[0], e1[1], 8.6, w) + Ce(e2[0], e2[1], 8.6, w);
    o += P('M ' + (e1[0] + 8.6) + ',1 Q ' + ((e1[0] + e2[0]) / 2) + ',-2.4 ' + (e2[0] - 8.6) + ',1', w);
    o += vue === 'tq' ? P('M -4.6,0 L -29,-2', w) : P('M -20.1,0 L -31,-2 M 20.1,0 L 31,-2', w);
    return o;
  }

  // Tête complète : { arr, av } à placer dans le repère de la tête.
  function tete(perso, vue, expr) {
    return avecAmp(AMP_VISAGE, () => {
      const h = cheveux(perso, vue);
      let t = F(VISAGE, PAPIER) + P(VISAGE) + traits(vue, expr, perso);
      if (perso === 'sam') t += lunettes(vue);
      t += h.av;
      if (perso === 'malik') t += bouche_(vue === 'tq' ? [14, 16] : [0, 16], expr, '#fff', ENCRE);
      t += vue === 'tq' ? oreille(-30, -1) : oreille(-31, -1) + oreille(31, 1);
      return { arr: h.arr, av: t };
    });
  }

  // ---------- Corps ----------
  // Gabarit du buste par personnage : demi-largeurs aux épaules (e), à la taille (t), à l'ourlet (o).
  const GABARITS = {
    lea: { e: 32, t: 26.5, o: 34 },   // épaules plus étroites, taille marquée
    malik: { e: 40, t: 34, o: 37 },   // buste plus large
    sam: { e: 36, t: 31, o: 35 },
  };
  // Veste de judogi (repère : centre de la ceinture, y vers le bas).
  function torse(vue, perso) {
    const g = GABARITS[perso] || GABARITS.sam, tq = vue === 'tq';
    const L = { e: g.e + (tq ? 0 : 2), t: g.t + (tq ? 0 : 1), o: g.o + (tq ? 0 : 1) };
    const R = tq ? { e: L.e - 2, t: L.t - 2, o: L.o - 2 } : L;
    const nL = [-12, -77], nR = [tq ? 11 : 12, -77];
    const contour = 'M ' + pt(nL) + ' C ' + pt([-(L.e - 10), -76]) + ' ' + pt([-L.e, -66]) + ' ' + pt([-L.e, -50]) +
      ' C ' + pt([-L.e, -34]) + ' ' + pt([-(L.t + 1), -16]) + ' ' + pt([-L.t, 0]) +
      ' C ' + pt([-L.t, 8]) + ' ' + pt([-(L.o - 2), 14]) + ' ' + pt([-L.o, 20]) +
      ' C -12,24 12,24 ' + pt([R.o, 20]) +
      ' C ' + pt([R.o - 2, 14]) + ' ' + pt([R.t, 8]) + ' ' + pt([R.t, 0]) +
      ' C ' + pt([R.t + 1, -16]) + ' ' + pt([R.e, -34]) + ' ' + pt([R.e, -50]) +
      ' C ' + pt([R.e, -66]) + ' ' + pt([R.e - 10, -76]) + ' ' + pt(nR);
    // col croisé : le revers droit passe par-dessus le gauche (V lisible à 25 mm)
    const sx = tq ? -2 : 0;
    const col = 'M ' + pt(nL) + ' C ' + pt([-6, -71]) + ' ' + pt([6, -71]) + ' ' + pt(nR);
    const revers = 'M ' + pt([nR[0] - 1, -75]) + ' C ' + pt([nR[0] - 4, -63]) + ' ' + pt([sx - 6, -52]) + ' ' + pt([sx - 17, -42]) +
      ' M ' + pt([nL[0] + 1, -74]) + ' C ' + pt([nL[0] + 3, -66]) + ' ' + pt([nL[0] + 6, -61]) + ' ' + pt([sx - 1, -57]);
    return {
      contour, col, revers,
      point: [tq ? 9 : 17, -47],
      epauleP: [R.e - 11, -58], epauleL: [-(L.e - 10), -58], hancheP: [12, 14], hancheL: [-13, 14], cou: [0, -76],
      ceint: [[-L.t, -5], [R.t, -5]],
      plis: 'M ' + pt([-L.t + 3, -14]) + ' C ' + pt([-L.t + 7, -10]) + ' ' + pt([-L.t + 11, -10]) + ' ' + pt([-L.t + 14, -13]) +
        ' M ' + pt([R.t - 14, -13]) + ' C ' + pt([R.t - 11, -10]) + ' ' + pt([R.t - 7, -10]) + ' ' + pt([R.t - 3, -14]),
    };
  }

  // Ceinture nouée : bande, nœud et deux pans.
  function ceinture(T, vue, col) {
    const a = T.ceint[0], b = T.ceint[1], w = { fill: col, w: TRAIT * 0.72 };
    const band = 'M ' + pt([a[0], a[1] - 4]) + ' C ' + pt([a[0] + 20, a[1] - 2]) + ' ' + pt([b[0] - 20, b[1] - 2]) + ' ' + pt([b[0], b[1] - 4]) +
      ' L ' + pt([b[0] - 0.4, b[1] + 5]) + ' C ' + pt([b[0] - 20, b[1] + 7]) + ' ' + pt([a[0] + 20, a[1] + 7]) + ' ' + pt([a[0] + 0.4, a[1] + 5]) + ' Z';
    const kx = vue === 'tq' ? 8 : 2, ky = a[1] + 0.5;
    const pans = 'M ' + pt([kx - 2, ky + 3]) + ' L ' + pt([kx - 9, ky + 21]) + ' L ' + pt([kx - 3.5, ky + 22.5]) + ' L ' + pt([kx + 1.5, ky + 4]) + ' Z' +
      ' M ' + pt([kx + 2, ky + 3]) + ' L ' + pt([kx + 8, ky + 20]) + ' L ' + pt([kx + 13.5, ky + 18]) + ' L ' + pt([kx + 5, ky + 2]) + ' Z';
    const noeud = 'M ' + pt([kx - 5.5, ky - 5.5]) + ' L ' + pt([kx + 5.5, ky - 5.5]) + ' L ' + pt([kx + 6, ky + 5.5]) + ' L ' + pt([kx - 6, ky + 5.5]) + ' Z';
    return P(pans, w) + P(band, w) + P(noeud, w);
  }

  // Chaussure simple, encre pleine (repère : cheville, x vers l'avant).
  function pied(cheville, angle, flip) {
    const d = 'M -9,-5 C -8,-10 5,-10 10,-6 C 17,-4 25,-3 26,3 C 27,8 22,9 12,9 L -8,9 C -12,9 -12,-1 -9,-5 Z';
    return G(P(d, { fill: ENCRE, w: FIN }), 'translate(' + pt(cheville) + ') rotate(' + r2(angle) + ')' + (flip ? ' scale(-1,1)' : ''));
  }

  // Corps complet à partir d'une pose : renvoie des calques à empiler dans l'ordre voulu.
  function corps(perso, p, o) {
    const vue = p.vue, T = torse(vue, perso), W = p.taille, lean = p.lean || 0;
    const X = q => add(W, rot(q, lean));
    const out = { jambes: '', mains: {} };
    // jambes : pantalon blanc (aplat optionnel o.bas), chaussure
    ['loin', 'proche'].forEach(k => {
      const j = p.jambes[k], hanche = X(k === 'proche' ? T.hancheP : T.hancheL);
      const tb = membre(hanche, j.genou, j.cheville, 25, 22.5, 21, 1, true);
      out.jambes += pied(j.cheville, j.pied || 0, j.flip) + F(tb.fond, PAPIER) + (o.bas ? riso(tb.fond, o.bas) : '') + P(tb.trait);
    });
    // bras : manche, revers de manche, main
    const bras = k => {
      const b = p.bras[k];
      let ep = X(k === 'proche' ? T.epauleP : T.epauleL);
      if (b.epaule) ep = add(ep, b.epaule);
      const tb = membre(ep, b.coude, b.poignet, 22.5, 21, 18.5, b.aisselle);
      const a = add(tb.Ci, mul(tb.d2, -6)), c = add(tb.Co, mul(tb.d2, -6));
      const m = { p: add(tb.fin, rot([-3.5, 0], tb.angle)), a: b.angleMain != null ? b.angleMain : tb.angle, s: b.pouce || -1 };
      out.mains[k] = m;
      // pli de manche au creux du coude, seulement si le bras est assez plié
      const d1 = norm(sub(b.coude, ep)), pli = norm(sub(tb.d2, d1)), plie = Math.abs(d1[0] * tb.d2[1] - d1[1] * tb.d2[0]) > 0.42;
      const p0 = add(b.coude, mul(pli, 9.5)), p1 = add(b.coude, mul(pli, 3.5)), pc = add(lerp(p0, p1, 0.5), mul(tb.d2, 2.2));
      const manche = F(tb.fond, PAPIER) + P(tb.trait) + P('M ' + pt(a) + ' Q ' + pt(add(lerp(a, c, 0.5), mul(tb.d2, 2.5))) + ' ' + pt(c), { w: FIN }) +
        (plie ? P('M ' + pt(p0) + ' Q ' + pt(pc) + ' ' + pt(p1), { w: FIN * 0.9 }) : '');
      const mn = placerMain(b.main || 'tient', m.p, m.a, m.s);
      return b.mainDessous ? mn + manche : manche + mn;
    };
    out.brasL = bras('loin');
    out.brasP = bras('proche');
    // torse
    const tr = 'translate(' + pt(W) + ') rotate(' + r2(lean) + ')';
    let ts = F(T.contour + ' Z', PAPIER) + P(T.contour + ' Z') + P(T.col, { w: FIN }) + P(T.revers, { w: FIN * 1.05 }) +
      rond(T.point, 4.6, INDIGO);
    if (o.ceinture) ts += ceinture(T, vue, o.ceinture);
    out.torse = G(ts, tr);
    out.cou = G(F('M -7,-73 L -6.5,-90 L 6.5,-90 L 7,-73 Z', PAPIER) + P('M -6.5,-74 L -6,-86 M 6.5,-74 L 6,-86', { w: FIN }), tr);
    // tête
    const hl = (p.tete && p.tete.incl) || 0;
    let hc = add(X(T.cou), rot([vue === 'tq' ? 3 : 0, -36], lean + hl));
    if (p.tete && p.tete.dec) hc = add(hc, p.tete.dec);
    const th = tete(perso, vue, o.expression || p.expr);
    const htr = 'translate(' + pt(hc) + ') rotate(' + r2(lean + hl) + ')';
    out.teteArr = G(th.arr, htr);
    out.tete = G(th.av, htr);
    out.hc = hc;
    return out;
  }

  // ---------- Signes (jamais mis en miroir) ----------
  // Traits d'emphase « /// » rayonnant autour de la tête c, dans la direction a (degrés, 0 = vers le haut).
  function emphase(c, a, n = 3, r0 = 54) {
    let s = '';
    for (let k = 0; k < n; k++) {
      const aa = a + (k - (n - 1) / 2) * 24;
      s += P('M ' + pt(add(c, rot([0, -r0], aa))) + ' L ' + pt(add(c, rot([0, -r0 - 13], aa))), { stroke: CORAIL, w: TRAIT });
    }
    return s;
  }
  function interrogation(c) {
    return P('M ' + pt([c[0] - 8, c[1] - 8]) + ' C ' + pt([c[0] - 8, c[1] - 20]) + ' ' + pt([c[0] + 10, c[1] - 20]) + ' ' + pt([c[0] + 9, c[1] - 8]) +
      ' C ' + pt([c[0] + 8, c[1] - 1]) + ' ' + pt([c[0] + 1, c[1] - 1]) + ' ' + pt([c[0] + 1, c[1] + 7]), { stroke: CORAIL, w: TRAIT * 1.05 }) +
      rond([c[0] + 1, c[1] + 16], 3.2, CORAIL);
  }

  // ---------- Accessoires et décors ----------
  function paperboard(x, y, col) { // x, y : coin haut gauche du tableau ; pieds au sol
    const w = 112, h = 92;
    let s = P('M ' + (x + 22) + ',' + (y + h) + ' L ' + (x + 10) + ',-3 M ' + (x + w - 22) + ',' + (y + h) + ' L ' + (x + w - 10) + ',-3 M ' + (x + w / 2) + ',' + (y + h) + ' L ' + (x + w / 2) + ',-22');
    s += objet(rect(x, y, w, h), null);
    s += P('M ' + (x - 4) + ',' + (y - 2) + ' L ' + (x + w + 4) + ',' + (y - 2), { w: TRAIT * 1.3 });
    [[x + 20, 22], [x + 40, 34], [x + 60, 46], [x + 80, 62]].forEach(([bx, bh]) => {
      const d = rect(bx, y + h - 12 - bh, 13, bh);
      s += riso(d, col) + P(d, { w: FIN * 1.05 });
    });
    s += P('M ' + (x + 12) + ',' + (y + h - 12) + ' L ' + (x + w - 10) + ',' + (y + h - 12), { w: FIN * 1.05 });
    return s;
  }
  function machine(x, y, col) { // x, y : coin haut gauche ; posée au sol (y = 0)
    const w = 110, h = -3 - y;
    let s = F(rect(x, y, w, h), PAPIER) + riso(rect(x, y, w, h), GRIS) + P(rect(x, y, w, h));
    const ecran = rect(x + 44, y + 16, 52, 34);
    s += F(ecran, PAPIER) + riso(ecran, col) + P(ecran, { w: FIN * 1.1 });
    s += P('M ' + (x + 52) + ',' + (y + 41) + ' L ' + (x + 63) + ',' + (y + 31) + ' L ' + (x + 73) + ',' + (y + 37) + ' L ' + (x + 88) + ',' + (y + 24), { w: FIN });
    s += Ce(x + 18, y + 20, 5.5, { fill: PAPIER, w: FIN }) + Ce(x + 18, y + 38, 5.5, { fill: col, w: FIN });
    s += Ce(x + 22, y + 62, 13, { fill: PAPIER, w: FIN * 1.1 }) + P('M ' + (x + 22) + ',' + (y + 62) + ' L ' + (x + 29) + ',' + (y + 52), { w: FIN });
    s += P(rect(x + 14, y + 122, w - 28, 56), { w: FIN }) + P('M ' + (x + 44) + ',' + (y + 136) + ' L ' + (x + 66) + ',' + (y + 136), { w: FIN });
    // andon
    s += P(rect(x + w - 26, y - 10, 8, 10), { fill: PAPIER, w: FIN }) + P(rect(x + w - 30, y - 34, 16, 24), { fill: PAPIER, w: FIN });
    s += F(rect(x + w - 28, y - 32, 12, 9), CORAIL) + P(rect(x + w - 30, y - 34, 16, 24), { w: FIN }) + P('M ' + (x + w - 30) + ',' + (y - 22) + ' L ' + (x + w - 14) + ',' + (y - 22), { w: FIN * 0.8 });
    return s;
  }
  function secteur(c, r, a0, a1) {
    const p0 = add(c, rot([r, 0], a0)), p1 = add(c, rot([r, 0], a1)), mid = add(c, rot([r, 0], (a0 + a1) / 2));
    const q1 = add(c, rot([r * 1.04, 0], a0 + (a1 - a0) * 0.25)), q2 = add(c, rot([r * 1.04, 0], a0 + (a1 - a0) * 0.75));
    return 'M ' + pt(c) + ' L ' + pt(p0) + ' Q ' + pt(q1) + ' ' + pt(mid) + ' Q ' + pt(q2) + ' ' + pt(p1) + ' Z';
  }
  function chrono(c, r, col) {
    let s = P(rect(c[0] - 3.5, c[1] - r - 7, 7, 7), { fill: PAPIER, w: FIN });
    s += P('M ' + pt(add(c, rot([0, -r - 1], 45))) + ' L ' + pt(add(c, rot([0, -r - 6], 45))), { w: FIN * 1.1 });
    s += Ce(c[0], c[1], r, { fill: PAPIER, stroke: null });
    s += G(F(secteur(c, r - 4, -90, 30), col), 'translate(1.6,1.4)');
    s += P('M ' + pt(c) + ' L ' + pt(add(c, rot([0, -(r - 5)], 120))), { w: FIN });
    s += Ce(c[0], c[1], r, {});
    return s;
  }
  function loupe(c, r, a) { // c centre de la lentille, a angle du manche
    const m0 = add(c, rot([r + 2, 0], a)), m1 = add(c, rot([r + 26, 0], a)), dir = norm(sub(m1, m0)), nn = [-dir[1], dir[0]];
    const manche = 'M ' + pt(add(m0, mul(nn, 3.8))) + ' L ' + pt(add(m1, mul(nn, 4.6))) + ' Q ' + pt(add(m1, mul(dir, 5))) + ' ' + pt(sub(m1, mul(nn, 4.6))) + ' L ' + pt(sub(m0, mul(nn, 3.8))) + ' Z';
    return P(manche, { fill: ENCRE, w: FIN * 0.8 }) + rond(c, r - 1, '#E3ECF7', 0.7) +
      P('M ' + pt(add(c, rot([r - 6, 0], 200))) + ' Q ' + pt(add(c, rot([r - 4, 0], 225))) + ' ' + pt(add(c, rot([r - 6, 0], 250))), { w: FIN * 0.8, stroke: '#fff' }) +
      Ce(c[0], c[1], r, { w: TRAIT * 1.15 });
  }
  function piece(c, col) { // petite pièce mécanique
    return objet(rect(c[0] - 8, c[1] - 12, 16, 22), col, FIN * 1.1) +
      P('M ' + pt([c[0] - 8, c[1] - 6]) + ' L ' + pt([c[0] + 8, c[1] - 6]) + ' M ' + pt([c[0] - 8, c[1] + 4]) + ' L ' + pt([c[0] + 8, c[1] + 4]), { w: FIN * 0.85 });
  }
  function porteBloc(x, y, w, h, col) {
    let s = objet(rect(x, y, w, h), col);
    s += F(rect(x + 6, y + 8, w - 12, h - 14), PAPIER) + P(rect(x + 6, y + 8, w - 12, h - 14), { w: FIN * 0.9 });
    s += P('M ' + (x + w / 2 - 11) + ',' + (y + 2) + ' L ' + (x + w / 2 + 11) + ',' + (y + 2) + ' L ' + (x + w / 2 + 9) + ',' + (y + 12) + ' L ' + (x + w / 2 - 9) + ',' + (y + 12) + ' Z', { fill: ENCRE, w: FIN * 0.8 });
    for (let i = 0; i < 3; i++) {
      const ly = y + 24 + i * 15, st = { w: FIN * 0.9, stroke: i < 2 ? ENCRE : GRIS_FONCE };
      s += P('M ' + (x + 13) + ',' + ly + ' L ' + (x + 16) + ',' + (ly + 3) + ' L ' + (x + 21) + ',' + (ly - 3), st);
      s += P('M ' + (x + 26) + ',' + ly + ' L ' + (x + w - 14) + ',' + ly, st);
    }
    return s;
  }
  // Feuille de procédure : blanche, lignée, coin replié à la couleur donnée (indigo : la cale, le standard)
  function feuille(x, y, w, h, col) {
    const d = 'M ' + x + ',' + y + ' L ' + (x + w - 9) + ',' + y + ' L ' + (x + w) + ',' + (y + 9) + ' L ' + (x + w) + ',' + (y + h) + ' L ' + x + ',' + (y + h) + ' Z';
    let s = F(d, PAPIER) + P(d, { w: FIN * 1.1 });
    s += P('M ' + (x + w - 9) + ',' + y + ' L ' + (x + w - 9) + ',' + (y + 9) + ' L ' + (x + w) + ',' + (y + 9) + ' Z', { fill: col, w: FIN });
    for (let i = 0; i < 4; i++) s += P('M ' + (x + 6) + ',' + (y + 15 + i * 6) + ' L ' + (x + w - (i === 3 ? 12 : 6)) + ',' + (y + 15 + i * 6), { w: FIN * 0.75 });
    return s;
  }
  // Lettres P D C A dessinées au trait (aucune dépendance à une police), dans un carré de 16.
  const LETTRES = {
    P: 'M -4,8 L -4,-8 C 3,-8.6 6.5,-6.6 6.5,-3.6 C 6.5,-0.4 3,1 -4,0.6',
    D: 'M -5,-8 L -5,8 C 3,8.6 7,4.4 7,0 C 7,-4.6 3,-8.6 -5,-8',
    C: 'M 6,-5.6 C 4.4,-8 0.6,-8.8 -2.4,-7.6 C -6.4,-5.6 -6.8,4.4 -3,7.2 C 0,9 4.2,8 6.2,5.4',
    A: 'M -6.2,8 L 0,-8 L 6.2,8 M -3.6,2.6 L 3.6,2.6',
  };
  // Roue PDCA (P D en haut, A C en bas ; lecture conservée en miroir).
  function roue(c, r, col, a, miroir) {
    let s = objet(cercle(c[0], c[1], r), col, TRAIT * 1.1) + Ce(c[0], c[1], r - 9, { w: FIN });
    for (let k = 0; k < 4; k++) {
      const aa = a + k * 90;
      s += P('M ' + pt(add(c, rot([7, 0], aa))) + ' L ' + pt(add(c, rot([r - 9, 0], aa))), { w: FIN * 1.1 });
    }
    s += Ce(c[0], c[1], 7, { fill: PAPIER, w: FIN * 1.1 });
    const L = miroir ? ['D', 'P', 'A', 'C'] : ['P', 'D', 'C', 'A'];
    for (let k = 0; k < 4; k++) {
      const q = add(c, rot([r * 0.5, 0], a - 135 + k * 90));
      s += G(compense(1.25, () => P(LETTRES[L[k]], { w: FIN * 1.15 })), 'translate(' + pt(q) + ') scale(' + (miroir ? -1.25 : 1.25) + ',1.25)');
    }
    return s;
  }

  // ---------- Poses ----------
  // Coordonnées internes : pieds au sol en y = 0, personnage tourné vers la droite.
  // Chaque pose renvoie { s, signes, ancres } ; les signes sont posés hors miroir.
  const RAYON = { lea: 54, malik: 62, sam: 58 };
  const PENTE = 0.21; // pente de la pose « pousse » (tan de l'angle)
  const debout = dx => ({ loin: { genou: [dx - 15, -54], cheville: [dx - 20, -12], pied: 0 }, proche: { genou: [dx + 16, -54], cheville: [dx + 15, -12], pied: 4 } });
  const deboutFace = { loin: { genou: [-15, -55], cheville: [-17, -12], pied: 6, flip: true }, proche: { genou: [15, -55], cheville: [17, -12], pied: 6 } };

  const POSES = {
    standard(perso, o) {
      const c = corps(perso, { vue: 'face', taille: [0, -112], expr: 'sourire', jambes: deboutFace,
        bras: { loin: { coude: [-44, -126], poignet: [-12, -140], main: 'pointe', pouce: -1, angleMain: -16 },
          proche: { coude: [46, -124], poignet: [54, -158], main: 'tient', pouce: 1, angleMain: -96 } } }, o);
      const doc = G(porteBloc(-4, -198, 62, 80, o.aplat), 'rotate(4 27 -158)');
      return { s: c.jambes + c.torse + c.teteArr + c.cou + c.tete + doc + c.brasL + c.brasP, signes: [], ancres: { document: [27, -158] } };
    },
    pouce(perso, o) {
      const c = corps(perso, { vue: 'face', taille: [0, -112], expr: 'joie', jambes: deboutFace,
        bras: { loin: { coude: [-56, -128], poignet: [-36, -106], main: 'poing', pouce: 1, angleMain: 30 },
          proche: { coude: [58, -126], poignet: [62, -160], main: 'pouce', pouce: 1 } } }, o);
      return { s: c.jambes + c.brasL + c.torse + c.teteArr + c.cou + c.tete + c.brasP,
        signes: [['emphase', c.hc, -42, 3]], ancres: { pouce: pointMain(c.mains.proche, [26, -5.4]), tete: c.hc } };
    },
    montre(perso, o) {
      const c = corps(perso, { vue: 'tq', taille: [-6, -112], expr: 'parle', tete: { incl: -6 }, jambes: debout(-6),
        bras: { loin: { coude: [-48, -136], poignet: [-50, -104], main: 'poing', pouce: 1, angleMain: 96, aisselle: 0.5 },
          proche: { coude: [42, -176], poignet: [72, -194], main: 'pointe', pouce: -1, angleMain: -26 } } }, o);
      const fond = o.decor ? paperboard(88, -262, o.aplat) : '';
      return { s: fond + c.brasL + c.jambes + c.torse + c.teteArr + c.cou + c.tete + c.brasP,
        signes: [['emphase', c.hc, -52, 3]], ancres: { doigt: pointMain(c.mains.proche, [24.5, -4.8]), tete: c.hc } };
    },
    teste(perso, o) {
      // le bras arrière appuie sur le bouton de la machine, la main avant tient le chrono devant la poitrine
      const c = corps(perso, { vue: 'tq', taille: [-10, -112], expr: 'concentre', tete: { incl: 3 }, jambes: debout(-10),
        bras: { loin: { coude: [18, -136], poignet: [70, -136], main: 'tient', pouce: -1 },
          proche: { coude: [32, -118], poignet: [44, -150], main: 'tient', pouce: -1, angleMain: -80 } } }, o);
      // o.tenu : 'chrono' (défaut) ou 'bloc' (porte-bloc : il note ses observations)
      const fond = o.decor ? machine(66, -199, o.aplat) : '';
      const ch = add(c.mains.proche.p, rot([28, -1], c.mains.proche.a));
      const tenu = o.tenu === 'bloc' ? G(porteBloc(-17, -26, 34, 46, o.aplat), 'translate(' + pt(add(ch, [2, 6])) + ') rotate(-8)') : chrono(ch, 13, o.aplat);
      return { s: fond + c.brasL + c.jambes + c.torse + c.teteArr + c.cou + c.tete + tenu + c.brasP,
        signes: [['emphase', c.hc, -42, 3]], ancres: { main: pointMain(c.mains.loin, [16.5, 0]), chrono: ch, tete: c.hc } };
    },
    // decor: false retire la pièce : la loupe peut alors viser un objet de la carte (graphique, poste…)
    inspecte(perso, o) {
      const c = corps(perso, { vue: 'tq', taille: [-8, -112], lean: 5, expr: 'inspecte', tete: { incl: 8 }, jambes: debout(-8),
        bras: { loin: { coude: [40, -150], poignet: [88, -180], main: 'tient', pouce: -1, angleMain: -40 },
          proche: { coude: [44, -132], poignet: [56, -160], main: 'tient', pouce: -1 } } }, o);
      return { s: c.jambes + c.brasL + (o.decor ? piece([100, -198], o.aplat) : '') + c.torse + c.teteArr + c.cou + c.tete + c.brasP + loupe([80, -206], 19, 119),
        signes: [], ancres: { loupe: [80, -206], piece: [100, -198], tete: c.hc } };
    },
    reflechit(perso, o) {
      const c = corps(perso, { vue: 'tq', taille: [0, -112], expr: 'pensif', tete: { incl: -8 }, jambes: debout(0),
        bras: { loin: { coude: [-30, -132], poignet: [16, -124], main: 'tient', pouce: -1 },
          proche: { coude: [38, -126], poignet: [26, -176], main: 'poing', pouce: 1, angleMain: -96 } } }, o);
      const q = add(c.hc, [46, -58]);
      return { s: c.jambes + c.torse + c.brasL + c.teteArr + c.cou + c.tete + c.brasP, signes: [['question', q]], ancres: { question: q } };
    },
    pousse(perso, o) {
      // poussée franche : buste penché à ~34°, épaule engagée, genou avant fléchi, jambe arrière tendue loin derrière ;
      // bras tendus vers l'avant, à hauteur de poitrine, paumes à plat sur la jante (doigts vers le haut) ;
      // tête relevée en arrière, visage dégagé de trois quarts, déterminé mais souriant
      const sol = x => -PENTE * x;
      const c = corps(perso, { vue: 'tq', taille: [8, -96], lean: 34, expr: 'determine', tete: { incl: -24, dec: [-8, 3] },
        jambes: { loin: { genou: [-30, -50], cheville: [-74, 4], pied: 26 }, proche: { genou: [46, -52], cheville: [34, -14], pied: -12 } },
        bras: { loin: { coude: [72, -150], poignet: [114, -150], main: 'ouverte', pouce: -1, angleMain: -58 },
          proche: { coude: [98, -118], poignet: [134, -124], main: 'ouverte', pouce: -1, angleMain: -54 } } }, o);
      const mains = lerp(pointMain(c.mains.loin, [12, 0]), pointMain(c.mains.proche, [12, 0]), 0.5);
      const R = { c: [mains[0] + 62, -99.5], r: 66 };
      let fond = '';
      if (o.decor) {
        fond = P('M -110,' + r2(sol(-110)) + ' L 250,' + r2(sol(250)), { w: TRAIT * 1.05 });
        for (let k = -100; k < 240; k += 26) fond += P('M ' + k + ',' + r2(sol(k) + 6) + ' L ' + (k - 10) + ',' + r2(sol(k - 10) + 18), { w: FIN * 0.8, stroke: GRIS_FONCE });
        fond += roue(R.c, R.r, o.aplat, 0, o.miroir);
      }
      return { s: fond + c.brasL + c.jambes + c.torse + c.teteArr + c.cou + c.tete + c.brasP,
        signes: [['emphase', c.hc, -24, 3]], ancres: { roue: R, pente: Math.atan(PENTE) * 180 / Math.PI, mains, tete: c.hc } };
    },
    // fixe une feuille à plat (main ouverte, doigts vers le haut) ; l'autre main tient la pile des copies à déployer
    affiche(perso, o) {
      const c = corps(perso, { vue: 'tq', taille: [-6, -112], expr: 'joie', tete: { incl: -4 }, jambes: debout(-6),
        bras: { loin: { coude: [-46, -134], poignet: [-44, -100], main: 'tient', pouce: 1, angleMain: 84, aisselle: 0.5 },
          proche: { coude: [40, -146], poignet: [70, -170], main: 'ouverte', pouce: -1, angleMain: -72 } } }, o);
      const mp = c.mains.loin.p, pile = add(mp, [-2, 16]);
      const copies = G(feuille(-15, -19, 30, 38, o.feuille || INDIGO) + feuille(-11, -23, 30, 38, o.feuille || INDIGO), 'translate(' + pt(pile) + ') rotate(-6)');
      return { s: copies + c.brasL + c.jambes + c.torse + c.teteArr + c.cou + c.tete + c.brasP,
        signes: [['emphase', c.hc, -40, 3]], ancres: { paume: pointMain(c.mains.proche, [9, 0]), pile, tete: c.hc } };
    },
    avatar(perso, o) {
      const hc = [0, -92];
      const th = tete(perso, 'face', o.expression || 'sourire');
      const g = GABARITS[perso], l = 56 + (g.e - 36) * 0.8;
      // buste : épaules, col rond, cou droit, revers croisé
      const buste = 'M ' + (-l - 6) + ',0 C ' + (-l - 6) + ',-30 ' + (-l + 4) + ',-42 -16,-47 C -10,-38 10,-38 16,-47 C ' + (l - 4) + ',-42 ' + (l + 6) + ',-30 ' + (l + 6) + ',0';
      let s = G(th.arr, 'translate(' + pt(hc) + ')');
      s += F('M -8.5,-36 L -8,-66 L 8,-66 L 8.5,-36 Z', PAPIER) + P('M -8.5,-36 L -8,-62 M 8.5,-36 L 8,-62', { w: FIN });
      s += F(buste + ' Z', PAPIER) + P(buste) + P('M ' + (-l + 16) + ',-14 L ' + (-l + 16) + ',0 M ' + (l - 16) + ',-14 L ' + (l - 16) + ',0', { w: TRAIT });
      s += P('M 12,-42 C 7,-33 -1,-27 -15,-21 M -12,-42 C -10,-37 -7,-34 -3,-32', { w: FIN * 1.05 });
      s += rond([24, -27], 5, INDIGO);
      s += G(th.av, 'translate(' + pt(hc) + ')');
      return { s, signes: [], ancres: { tete: hc } };
    },
  };

  // ---------- API ----------
  const DEF = { perso: 'lea', pose: 'standard', ceinture: JAUNE, aplat: MOUTARDE, bas: null, tenu: 'chrono',
    x: 0, y: 0, echelle: 1, miroir: false, decor: true, signes: true, expression: null, tremble: 1 };
  function options(opts = {}) {
    const o = Object.assign({}, DEF);
    for (const k in opts) if (opts[k] !== undefined) o[k] = opts[k];
    if (!POSES[o.pose]) o.pose = 'standard';
    if (!GABARITS[o.perso]) o.perso = 'lea';
    return o;
  }
  // Construit la pose dans le repère interne (unités ≈ 285 de haut, avant échelle).
  function construire(o) {
    FACTEUR = o.tremble === true ? 1 : (+o.tremble || 0);
    const r = avecAmp(AMP_CORPS, () => POSES[o.pose](o.perso, o));
    FACTEUR = 1;
    return r;
  }
  function signesSVG(o, r) {
    const sens = o.miroir ? -1 : 1;
    return r.signes.map(([type, c, a, n]) => {
      const cc = [c[0] * sens, c[1]];
      return type === 'emphase' ? emphase(cc, a * sens, n, RAYON[o.perso]) : interrogation(cc);
    }).join('');
  }

  function dessiner(opts) {
    const o = options(opts), r = construire(o), e = o.echelle * K, sens = o.miroir ? -1 : 1;
    return '<g class="personnage perso-' + o.perso + ' pose-' + o.pose + '" transform="translate(' + r2(o.x) + ' ' + r2(o.y) + ') scale(' + r2(e * 10000) / 10000 + ')"' +
      ' stroke-linecap="round" stroke-linejoin="round">' +
      '<g transform="scale(' + sens + ' 1)">' + r.s + '</g>' + (o.signes ? signesSVG(o, r) : '') + '</g>';
  }

  // Points d'accroche en coordonnées de la carte (miroir et échelle pris en compte).
  function ancres(opts) {
    const o = options(opts), r = construire(o), e = o.echelle * K, sens = o.miroir ? -1 : 1;
    const vers = p => [r2(o.x + p[0] * e * sens), r2(o.y + p[1] * e)];
    const out = {};
    for (const [k, v] of Object.entries(r.ancres)) {
      if (Array.isArray(v)) out[k] = vers(v);
      else if (v && v.c) { const c = vers(v.c); out[k] = { cx: c[0], cy: c[1], r: r2(v.r * e) }; }
      else out[k] = typeof v === 'number' ? r2(v) : v;
    }
    return out;
  }

  // Boîtes englobantes mesurées (getBBox, trait compris) à echelle 1 et x = y = 0, en unités de carte.
  // Clé « perso pose » → 8 boîtes [x, y, l, h], rang = (décor ? 0 : 4) + (miroir ? 2 : 0) + (signes ? 0 : 1).
  // Table régénérée depuis la planche (Personnages._interne.mesurer) à chaque retouche du dessin.
  const BOITES = {
    'lea standard': [[-21.9,-102.5,47.5,103.7],[-21.9,-102.5,47.5,103.7],[-25.6,-102.5,47.5,103.7],[-25.6,-102.5,47.5,103.7],[-21.9,-102.5,47.5,103.7],[-21.9,-102.5,47.5,103.7],[-25.6,-102.5,47.5,103.7],[-25.6,-102.5,47.5,103.7]],
    'lea montre': [[-28.1,-107.4,105.9,108.3],[-26.4,-104.4,104.2,105.3],[-77.8,-107.4,105.9,108.3],[-77.8,-104.4,104.2,105.3],[-28.1,-107.4,68.8,108.3],[-26.4,-104.4,67.1,105.3],[-40.7,-107.4,68.8,108.3],[-40.7,-104.4,67.1,105.3]],
    'lea teste': [[-26,-109,94.3,109.9],[-25.7,-103.6,94,104.5],[-68.3,-109,94.3,109.9],[-68.3,-103.6,94,104.5],[-26,-109,59.8,109.9],[-25.7,-103.6,59.5,104.4],[-33.8,-109,59.8,109.9],[-33.8,-103.6,59.5,104.4]],
    'lea inspecte': [[-25,-106.1,67.8,107],[-25,-106.1,67.8,107],[-42.8,-106.1,67.8,107],[-42.8,-106.1,67.8,107],[-25,-106.1,67.8,107],[-25,-106.1,67.8,107],[-42.7,-106.1,67.8,107],[-42.7,-106.1,67.8,107]],
    'lea pouce': [[-26.3,-109.1,56.8,110.3],[-26.3,-102.5,56.8,103.7],[-30.6,-109.1,56.8,110.3],[-30.6,-102.5,56.8,103.7],[-26.3,-109.1,56.8,110.3],[-26.3,-102.5,56.8,103.7],[-30.6,-109.1,56.8,110.3],[-30.6,-102.5,56.8,103.7]],
    'lea reflechit': [[-25.2,-113.3,48.1,114.2],[-25.2,-105,48.1,105.9],[-23,-113.3,48.1,114.2],[-23,-105,48.1,105.9],[-25.2,-113.3,48.1,114.2],[-25.2,-105,48.1,105.9],[-23,-113.3,48.1,114.2],[-23,-105,48.1,105.9]],
    'lea pousse': [[-42.5,-97.9,141.5,114.3],[-42.5,-93.5,141.5,109.9],[-99,-97.9,141.5,114.3],[-99,-93.5,141.5,109.9],[-34.4,-97.9,96.5,108],[-34.4,-93.5,96.5,103.6],[-62.1,-97.9,96.5,108],[-62.1,-93.5,96.5,103.6]],
    'lea affiche': [[-25.8,-109.4,62.8,110.3],[-25.4,-103.8,62.4,104.7],[-37,-109.4,62.8,110.3],[-37,-103.8,62.4,104.7],[-25.8,-109.4,62.8,110.3],[-25.4,-103.8,62.4,104.7],[-37,-109.4,62.8,110.3],[-37,-103.8,62.4,104.7]],
    'lea avatar': [[-23.1,-53,46.2,54.4],[-23.1,-53,46.2,54.4],[-23.1,-53,46.2,54.4],[-23.1,-53,46.2,54.4],[-23.1,-53,46.2,54.4],[-23.1,-53,46.2,54.4],[-23.1,-53,46.2,54.4],[-23.1,-53,46.2,54.4]],
    'malik standard': [[-21.8,-109.9,47.4,111.1],[-21.8,-109.9,47.4,111.1],[-25.6,-109.9,47.4,111.1],[-25.6,-109.9,47.4,111.1],[-21.8,-109.9,47.4,111.1],[-21.8,-109.9,47.4,111.1],[-25.6,-109.9,47.4,111.1],[-25.6,-109.9,47.4,111.1]],
    'malik montre': [[-31,-110.7,108.8,111.6],[-24.9,-110.7,102.7,111.6],[-77.8,-110.7,108.8,111.6],[-77.8,-110.7,102.7,111.6],[-31,-110.7,71.7,111.6],[-24.9,-110.7,65.6,111.6],[-40.7,-110.7,71.7,111.6],[-40.7,-110.7,65.6,111.6]],
    'malik teste': [[-28.8,-111.8,97,112.8],[-21.1,-109.5,89.3,110.4],[-68.3,-111.8,97,112.8],[-68.3,-109.5,89.3,110.4],[-28.8,-111.8,62.6,112.7],[-21.1,-109.5,54.9,110.4],[-33.8,-111.8,62.6,112.7],[-33.8,-109.5,54.9,110.4]],
    'malik inspecte': [[-19.8,-111.2,62.6,112.1],[-19.8,-111.2,62.6,112.1],[-42.8,-111.2,62.6,112.1],[-42.8,-111.2,62.6,112.1],[-19.8,-111.2,62.6,112.1],[-19.8,-111.2,62.6,112.1],[-42.7,-111.2,62.6,112.1],[-42.7,-111.2,62.6,112.1]],
    'malik pouce': [[-26.9,-111.9,57.4,113.1],[-26.3,-109.9,56.9,111.1],[-30.6,-111.9,57.4,113.1],[-30.6,-109.9,56.9,111.1],[-26.9,-111.9,57.4,113.1],[-26.3,-109.9,56.9,111.1],[-30.6,-111.9,57.4,113.1],[-30.6,-109.9,56.9,111.1]],
    'malik reflechit': [[-22.2,-113.3,44.9,114.2],[-22.2,-111.3,44.9,112.2],[-22.7,-113.3,44.9,114.2],[-22.7,-111.3,44.9,112.2],[-22.2,-113.3,44.9,114.2],[-22.2,-111.3,44.9,112.2],[-22.7,-113.3,44.9,114.2],[-22.7,-111.3,44.9,112.2]],
    'malik pousse': [[-42.5,-100.9,141.5,117.3],[-42.5,-98.9,141.5,115.3],[-99,-100.9,141.5,117.3],[-99,-98.9,141.5,115.3],[-34.4,-100.9,96.5,111],[-34.4,-98.9,96.5,109],[-62.1,-100.9,96.5,111],[-62.1,-98.9,96.5,109]],
    'malik affiche': [[-28.5,-112.2,65.5,113.1],[-25,-110.1,62,111],[-37,-112.2,65.5,113.1],[-37,-110.1,62,111],[-28.5,-112.2,65.5,113.1],[-25,-110.1,62,111],[-37,-112.2,65.5,113.1],[-37,-110.1,62,111]],
    'malik avatar': [[-25.5,-60.4,50.9,61.9],[-25.5,-60.4,50.9,61.9],[-25.4,-60.4,50.9,61.9],[-25.4,-60.4,50.9,61.9],[-25.5,-60.4,50.9,61.9],[-25.5,-60.4,50.9,61.9],[-25.4,-60.4,50.9,61.9],[-25.4,-60.4,50.9,61.9]],
    'sam standard': [[-21.9,-104,47.5,105.2],[-21.9,-104,47.5,105.2],[-25.6,-104,47.5,105.2],[-25.6,-104,47.5,105.2],[-21.9,-104,47.5,105.2],[-21.9,-104,47.5,105.2],[-25.6,-104,47.5,105.2],[-25.6,-104,47.5,105.2]],
    'sam montre': [[-29.5,-108.7,107.3,109.6],[-24.9,-105.7,102.7,106.6],[-77.8,-108.7,107.3,109.6],[-77.8,-105.7,102.7,106.6],[-29.5,-108.7,70.2,109.6],[-24.9,-105.7,65.6,106.6],[-40.7,-108.7,70.2,109.6],[-40.7,-105.7,65.6,106.6]],
    'sam teste': [[-27.4,-110.4,95.7,111.3],[-18.6,-104.7,86.9,105.6],[-68.3,-110.4,95.7,111.3],[-68.3,-104.7,86.9,105.6],[-27.4,-110.4,61.2,111.3],[-18.6,-104.7,52.4,105.6],[-33.8,-110.4,61.2,111.3],[-33.8,-104.7,52.4,105.6]],
    'sam inspecte': [[-18.4,-106.1,61.2,107],[-18.4,-106.1,61.2,107],[-42.8,-106.1,61.2,107],[-42.8,-106.1,61.2,107],[-18.4,-106.1,61.1,107],[-18.4,-106.1,61.1,107],[-42.7,-106.1,61.1,107],[-42.7,-106.1,61.1,107]],
    'sam pouce': [[-26.3,-110.5,56.8,111.7],[-26.3,-104,56.8,105.2],[-30.6,-110.5,56.8,111.7],[-30.6,-104,56.8,105.2],[-26.3,-110.5,56.8,111.7],[-26.3,-104,56.8,105.2],[-30.6,-110.5,56.8,111.7],[-30.6,-104,56.8,105.2]],
    'sam reflechit': [[-19.3,-113.3,40.3,114.2],[-19.3,-106.2,38.8,107.1],[-20.6,-113.3,39.9,114.2],[-19.5,-106.2,38.8,107.1],[-19.3,-113.3,40.3,114.2],[-19.3,-106.2,38.8,107.1],[-20.6,-113.3,39.9,114.2],[-19.5,-106.2,38.8,107.1]],
    'sam pousse': [[-42.5,-99.4,141.5,115.8],[-42.5,-93.9,141.5,110.3],[-99,-99.4,141.5,115.8],[-99,-93.9,141.5,110.3],[-34.4,-99.4,96.5,109.5],[-34.4,-93.9,96.5,104],[-62.1,-99.4,96.5,109.5],[-62.1,-93.9,96.5,104]],
    'sam affiche': [[-27.2,-110.8,64.1,111.7],[-25,-105.2,62,106.1],[-37,-110.8,64.1,111.7],[-37,-105.2,62,106.1],[-27.2,-110.8,64.1,111.7],[-25,-105.2,62,106.1],[-37,-110.8,64.1,111.7],[-37,-105.2,62,106.1]],
    'sam avatar': [[-24.3,-54.5,48.5,55.9],[-24.3,-54.5,48.5,55.9],[-24.2,-54.5,48.5,55.9],[-24.2,-54.5,48.5,55.9],[-24.3,-54.5,48.5,55.9],[-24.3,-54.5,48.5,55.9],[-24.2,-54.5,48.5,55.9],[-24.2,-54.5,48.5,55.9]],
  }; // @boites
  function boite(opts) {
    const o = options(opts), t = BOITES[o.perso + ' ' + o.pose];
    let b = t && t[(o.decor ? 0 : 4) + (o.miroir ? 2 : 0) + (o.signes ? 0 : 1)];
    if (!b && typeof document !== 'undefined' && document.body) b = mesurer(o);
    if (!b) b = [-40, -110, 80, 110];
    return { x: r2(o.x + b[0] * o.echelle), y: r2(o.y + b[1] * o.echelle), largeur: r2(b[2] * o.echelle), hauteur: r2(b[3] * o.echelle) };
  }
  // Mesure dans le navigateur : getBBox du dessin, élargie d'un demi-trait.
  function mesurer(o) {
    const NS = 'http://www.w3.org/2000/svg', s = document.createElementNS(NS, 'svg');
    s.setAttribute('style', 'position:absolute;left:-9999px;top:0;width:10px;height:10px;overflow:visible');
    s.innerHTML = '<g>' + dessiner(Object.assign({}, o, { x: 0, y: 0, echelle: 1 })) + '</g>';
    document.body.appendChild(s);
    const bb = s.firstChild.getBBox(), m = TRAIT0 * K / 2 + 0.3;
    document.body.removeChild(s);
    return [bb.x - m, bb.y - m, bb.width + 2 * m, bb.height + 2 * m].map(v => Math.round(v * 10) / 10);
  }

  // SVG autonome cadré sur la boîte (pratique pour une planche ou une vignette HTML).
  function svg(opts, marge = 2) {
    const o = Object.assign({}, opts, { x: 0, y: 0 }), b = boite(o);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + [b.x - marge, b.y - marge, b.largeur + 2 * marge, b.hauteur + 2 * marge].map(r2).join(' ') +
      '" width="' + r2(b.largeur + 2 * marge) + '" height="' + r2(b.hauteur + 2 * marge) + '">' + dessiner(o) + '</svg>';
  }

  racine.Personnages = {
    dessiner, ancres, boite, svg,
    persos: ['lea', 'malik', 'sam'],
    poses: ['standard', 'montre', 'teste', 'inspecte', 'pouce', 'reflechit', 'pousse', 'affiche', 'avatar'],
    expressions: ['sourire', 'parle', 'joie', 'concentre', 'effort', 'inspecte', 'pensif', 'determine'],
    couleurs: { encre: ENCRE, corail: CORAIL, indigo: INDIGO, gris: GRIS, meche: MECHE, moutarde: MOUTARDE, jaune: JAUNE, papier: PAPIER },
    ceintures: CEINTURES,
    _interne: { K, BOITES, mesurer, compense, tete, torse, corps, main, placerMain, emphase, interrogation,
      objets: { paperboard, machine, chrono, loupe, piece, porteBloc, feuille, roue, LETTRES }, POSES },
  };
})(typeof window !== 'undefined' ? window : globalThis);
