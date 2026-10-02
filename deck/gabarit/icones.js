// Icônes « Style Fichly » du deck : feutre encre, une seule couleur d'accent posée en aplat
// sous le trait avec un léger décalage riso. Sans dépendance ni ressource réseau ; rendu déterministe
// (bruit de tracé à graine fixe par icône). Fonctionne en <script> (window.Icones) et sous Node (require).
//
//   Icones.svg('pdca', { taille: 18 })                     → '<svg viewBox="0 0 48 48" …>…</svg>'
//   Icones.svg('valide', { taille: 64, accent: 'indigo', titre: 'Standard validé' })
//   Icones.contenu('idee', { taille: 18 })                 → le <g> seul, repère 48 × 48, à poser dans un SVG existant
//
// Options : taille (px, défaut 48), accent (nom de palette ou hex), titre, classe,
// trait (force l'épaisseur), detail (détails fins, vrai dès 28 px),
// papier (couleur des réserves blanches : passer '#FFFCF3' sur le papier des cartes).
//
// Règles du système :
//  - grille 48, zone utile 5 → 43, trait encre #231F20 de 2,4 (2,6 jusqu'à 40 px, 2,9 jusqu'à 24 px : compensation optique) ;
//  - l'encre dessine tout ; l'accent habille et ne porte jamais la lisibilité ;
//  - mêmes bouts ronds, même tremblé (bruit lissé, amplitude 0,42, longueur d'onde 7) pour toutes les icônes ;
//  - les détails marqués « fin » disparaissent sous 28 px (lettres du PDCA, graduations…).
(function (global) {
  'use strict';

  var ENCRE = '#231F20';
  var PALETTE = { corail: '#F16969', vert: '#8BC878', bleu: '#73A3D4', moutarde: '#E5B837', indigo: '#3C4499' };
  var AMPLITUDE = 0.42, ONDE = 7, PAS = 1.0, RISO = [1.2, 0.9];

  // ---------- Bruit déterministe ----------
  function hash(ix, iy, s) {
    var h = Math.sin(ix * 127.1 + iy * 311.7 + s * 74.7) * 43758.5453;
    return (h - Math.floor(h)) * 2 - 1;
  }
  function bruit(x, y, s) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    var u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    var a = hash(ix, iy, s), b = hash(ix + 1, iy, s), c = hash(ix, iy + 1, s), d = hash(ix + 1, iy + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function graine(nom) { var h = 7; for (var i = 0; i < nom.length; i++) h = (h * 31 + nom.charCodeAt(i)) % 9973; return h / 97; }

  // ---------- Échantillonnage de la géométrie ----------
  function seg(pts, a, b) { // ajoute le segment a→b échantillonné
    var n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / PAS));
    for (var i = 1; i <= n; i++) pts.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]);
  }
  function courbe(pts, p0, p1, p2, p3) { // cubique
    var l = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) + Math.hypot(p3[0] - p2[0], p3[1] - p2[1]);
    var n = Math.max(2, Math.ceil(l / PAS));
    for (var i = 1; i <= n; i++) {
      var t = i / n, m = 1 - t;
      pts.push([m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0],
                m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1]]);
    }
  }
  // Mini-parseur de chemin : M L H V C Q Z absolus. Renvoie une liste de tracés {p:[…], ferme}.
  function chemin(d) {
    var tok = d.match(/[MLHVCQZ]|-?\d*\.?\d+/g), i = 0, cmd, out = [], cur = null, pos = [0, 0], debut = [0, 0];
    function n() { return parseFloat(tok[i++]); }
    while (i < tok.length) {
      if (/[MLHVCQZ]/.test(tok[i])) cmd = tok[i++];
      if (cmd === 'M') { pos = [n(), n()]; debut = pos; cur = { p: [pos], ferme: false }; out.push(cur); cmd = 'L'; }
      else if (cmd === 'L') { var b = [n(), n()]; seg(cur.p, pos, b); pos = b; }
      else if (cmd === 'H') { var h = [n(), pos[1]]; seg(cur.p, pos, h); pos = h; }
      else if (cmd === 'V') { var v = [pos[0], n()]; seg(cur.p, pos, v); pos = v; }
      else if (cmd === 'C') { var c1 = [n(), n()], c2 = [n(), n()], e = [n(), n()]; courbe(cur.p, pos, c1, c2, e); pos = e; }
      else if (cmd === 'Q') { var q = [n(), n()], f = [n(), n()];
        courbe(cur.p, pos, [pos[0] + 2 / 3 * (q[0] - pos[0]), pos[1] + 2 / 3 * (q[1] - pos[1])], [f[0] + 2 / 3 * (q[0] - f[0]), f[1] + 2 / 3 * (q[1] - f[1])], f); pos = f; }
      else if (cmd === 'Z') { seg(cur.p, pos, debut); pos = debut; cur.ferme = true; }
    }
    return out;
  }
  function arc(cx, cy, r, a0, a1, ry, rot) { // angles en degrés, 0 = droite, sens horaire (y vers le bas)
    ry = ry == null ? r : ry; rot = (rot || 0) * Math.PI / 180;
    var p = [], l = Math.abs(a1 - a0) * Math.PI / 180 * Math.max(r, ry), n = Math.max(6, Math.ceil(l / PAS));
    for (var i = 0; i <= n; i++) {
      var a = (a0 + (a1 - a0) * i / n) * Math.PI / 180, x = r * Math.cos(a), y = ry * Math.sin(a);
      p.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
    }
    return p;
  }
  // Cercle « à la main » : le trait dépasse un peu son point de départ, avec une légère dérive de rayon.
  function cercleMain(cx, cy, r, depart) {
    var p = [], a0 = depart == null ? -120 : depart, tour = 372, n = Math.ceil(tour / 360 * 2 * Math.PI * r / PAS);
    for (var i = 0; i <= n; i++) {
      var t = i / n, a = (a0 + tour * t) * Math.PI / 180, rr = r + (t > 0.94 ? (t - 0.94) * 9 : 0);
      p.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
    }
    return p;
  }
  function rr(x, y, w, h, r) {
    return chemin('M ' + (x + r) + ' ' + y + ' L ' + (x + w - r) + ' ' + y + ' Q ' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) +
      ' L ' + (x + w) + ' ' + (y + h - r) + ' Q ' + (x + w) + ' ' + (y + h) + ' ' + (x + w - r) + ' ' + (y + h) +
      ' L ' + (x + r) + ' ' + (y + h) + ' Q ' + x + ' ' + (y + h) + ' ' + x + ' ' + (y + h - r) +
      ' L ' + x + ' ' + (y + r) + ' Q ' + x + ' ' + y + ' ' + (x + r) + ' ' + y + ' Z');
  }
  function etoile(cx, cy, re, ri, branches, rotDeg) {
    var d = '', k = branches * 2;
    for (var i = 0; i < k; i++) {
      var a = (rotDeg - 90 + i * 360 / k) * Math.PI / 180, r = i % 2 ? ri : re;
      d += (i ? ' L ' : 'M ') + (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2);
    }
    return chemin(d + ' Z');
  }
  function festons(cx, cy, r, bosses, creux) { // rosette / sceau
    var p = [], n = Math.ceil(2 * Math.PI * r / (PAS * 0.6));
    for (var i = 0; i <= n; i++) {
      var a = i / n * 2 * Math.PI, rad = r + creux * Math.cos(bosses * a);
      p.push([cx + rad * Math.cos(a - Math.PI / 2), cy + rad * Math.sin(a - Math.PI / 2)]);
    }
    return [{ p: p, ferme: true }];
  }
  function engrenage(cx, cy, ri, ro, n) { // dents trapézoïdales
    var d = '', pas = 360 / n;
    for (var i = 0; i < n; i++) {
      [[ri, -0.5], [ri, -0.27], [ro, -0.16], [ro, 0.16], [ri, 0.27]].forEach(function (q, j) {
        var a = (i * pas + q[1] * pas - 90) * Math.PI / 180;
        d += (i || j ? ' L ' : 'M ') + (cx + q[0] * Math.cos(a)).toFixed(2) + ' ' + (cy + q[0] * Math.sin(a)).toFixed(2);
      });
    }
    return chemin(d + ' Z');
  }
  function stade(cx, cy, demi, r, angle) { // maillon
    var a = angle, p = [];
    var loc = arc(demi, 0, r, -90, 90).concat(arc(-demi, 0, r, 90, 270));
    var c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
    loc.forEach(function (q) { p.push([cx + q[0] * c - q[1] * s, cy + q[0] * s + q[1] * c]); });
    p.push(p[0]);
    return [{ p: p, ferme: true }];
  }
  function T(points, ferme) { return [{ p: points, ferme: !!ferme }]; } // tracé brut (liste de points)
  function L(x1, y1, x2, y2) { var p = [[x1, y1]]; seg(p, [x1, y1], [x2, y2]); return T(p); }
  function C(cx, cy, r, depart) { return T(cercleMain(cx, cy, r, depart), true); }
  function A(cx, cy, r, a0, a1) { return T(arc(cx, cy, r, a0, a1)); }
  function disque(cx, cy, r) { return T(arc(cx, cy, r, 0, 360), true); }
  function secteur(cx, cy, r, a0, a1) { return T([[cx, cy]].concat(arc(cx, cy, r, a0, a1)), true); }
  function P(d) { return chemin(d); }

  // ---------- Éléments ----------
  // s = trait encre, f = aplat accent, fi = encre pleine, fp = papier, sa = trait accent, sp = trait papier.
  // Options : w (multiplicateur d'épaisseur), fin (masqué sous 28 px).
  function s(g, o) { return { t: 's', g: g, o: o || {} }; }
  function f(g, o) { return { t: 'f', g: g, o: o || {} }; }
  function fi(g, o) { return { t: 'fi', g: g, o: o || {} }; }
  function fp(g, o) { return { t: 'fp', g: g, o: o || {} }; }
  function sa(g, o) { return { t: 'sa', g: g, o: o || {} }; }

  function lettre(ch, x, y) {
    var k = {
      P: 'M ' + (x - 2.2) + ' ' + (y + 3.6) + ' L ' + (x - 2.2) + ' ' + (y - 3.6) + ' L ' + (x + 0.2) + ' ' + (y - 3.6) + ' C ' + (x + 3.2) + ' ' + (y - 3.6) + ' ' + (x + 3.2) + ' ' + (y + 0.4) + ' ' + (x + 0.2) + ' ' + (y + 0.4) + ' L ' + (x - 2.2) + ' ' + (y + 0.4),
      D: 'M ' + (x - 2.4) + ' ' + (y - 3.6) + ' L ' + (x - 2.4) + ' ' + (y + 3.6) + ' L ' + (x - 0.6) + ' ' + (y + 3.6) + ' C ' + (x + 3.4) + ' ' + (y + 3.6) + ' ' + (x + 3.4) + ' ' + (y - 3.6) + ' ' + (x - 0.6) + ' ' + (y - 3.6) + ' Z',
      A: 'M ' + (x - 3) + ' ' + (y + 3.6) + ' L ' + x + ' ' + (y - 3.6) + ' L ' + (x + 3) + ' ' + (y + 3.6) + ' M ' + (x - 1.8) + ' ' + (y + 0.9) + ' L ' + (x + 1.8) + ' ' + (y + 0.9)
    };
    if (ch === 'C') return s(A(x + 0.4, y, 3.6, 45, 315), { w: 0.62, fin: true });
    return s(P(k[ch]), { w: 0.62, fin: true });
  }

  // ---------- Dessins (repère 48) ----------
  var D = {};

  D.idee = { accent: 'moutarde', titre: 'Idée', dessin: function () {
    var verre = 'M 18 29.6 C 11.8 25.6 12.2 10.2 24 10.2 C 35.8 10.2 36.2 25.6 30 29.6 L 28.6 33.2 L 19.4 33.2 Z';
    var r = [];
    [-90, -138, -42, 180, 0].forEach(function (a) {
      var c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180), r0 = a === 180 || a === 0 ? 14 : 14.2;
      r.push(s(L(24 + r0 * c, 21 + r0 * sn, 24 + (r0 + 3.6) * c, 21 + (r0 + 3.6) * sn), { fin: a === 180 || a === 0 }));
    });
    return [f(P(verre)), s(P(verre)),
      s(P('M 21.6 33.2 L 21.6 27 Q 24 24.5 26.4 27 L 26.4 33.2'), { w: 0.7, fin: true }),
      s(L(20.2, 37, 27.8, 37)), s(P('M 21.4 40.6 Q 24 42 26.6 40.6'))].concat(r);
  } };

  D.question = { accent: 'corail', titre: 'Question', dessin: function () {
    var bulle = 'M 15.5 7.5 L 32.5 7.5 Q 41.5 7.5 41.5 16.5 L 41.5 24.5 Q 41.5 33.5 32.5 33.5 L 21 33.5 L 12.5 41 L 14 33.2 Q 6.5 31.8 6.5 24.5 L 6.5 16.5 Q 6.5 7.5 15.5 7.5 Z';
    return [f(P(bulle)), s(P(bulle)),
      s(P('M 19.6 17 C 19.6 11.6 28.6 11.4 28.6 16.8 C 28.6 20.6 24 20.6 24 24.6'), { w: 1.12 }),
      fi(disque(24, 29.4, 1.25))];
  } };

  D.attention = { accent: 'corail', titre: 'Attention', dessin: function () {
    var tri = 'M 21.2 8.8 Q 24 4.6 26.8 8.8 L 41 35 Q 43.2 39.6 38 39.6 L 10 39.6 Q 4.8 39.6 7 35 Z';
    return [f(P(tri)), s(P(tri)), s(L(24, 17.4, 24, 27.6), { w: 1.15 }), fi(disque(24, 33, 1.3))];
  } };

  D.info = { accent: 'bleu', titre: 'Info', dessin: function () {
    return [f(disque(24, 24, 17)), s(C(24, 24, 17)), s(P('M 21.4 21.5 L 24.2 21.5 L 24.2 33.2'), { w: 1.12 }), s(L(21.2, 33.4, 27.2, 33.4)), fi(disque(24, 15, 1.5))];
  } };

  var PAGE = 'M 13 6 L 28.5 6 L 37 14.5 L 37 40 Q 37 42 35 42 L 13 42 Q 11 42 11 40 L 11 8 Q 11 6 13 6 Z';
  D.document = { accent: 'bleu', titre: 'Document', dessin: function () {
    return [f(P(PAGE)), s(P(PAGE)), s(P('M 28.5 6 L 28.5 12.5 Q 28.5 14.5 30.5 14.5 L 37 14.5')),
      s(L(16.5, 21, 26, 21)), s(L(16.5, 27.5, 31.5, 27.5)), s(L(16.5, 34, 31.5, 34))];
  } };

  D.equipe = { accent: 'indigo', titre: 'Équipe', dessin: function () {
    var buste = 'M 13.8 39.5 C 13.8 25.6 34.2 25.6 34.2 39.5 Z';
    return [
      s(C(11, 20.5, 4.6)), s(P('M 3.8 37.5 C 3.8 31 6.8 27.6 11 27.6 C 13.4 27.6 15.4 28.4 16.8 29.8')),
      s(C(37, 20.5, 4.6)), s(P('M 44.2 37.5 C 44.2 31 41.2 27.6 37 27.6 C 34.6 27.6 32.6 28.4 31.2 29.8')),
      f(P(buste)), s(P('M 13.8 39.5 C 13.8 25.6 34.2 25.6 34.2 39.5')), s(C(24, 16.5, 5.8))];
  } };

  D.manager = { accent: 'indigo', titre: 'Manager', dessin: function () {
    var cravate = 'M 21.6 28 L 26.4 28 L 25.6 31.8 L 27.9 39.2 L 24 43 L 20.1 39.2 L 22.4 31.8 Z';
    return [s(C(24, 14, 7.4)), fp(P('M 7.5 42.5 C 7.5 22.5 40.5 22.5 40.5 42.5 Z')), s(P('M 7.5 42.5 C 7.5 22.5 40.5 22.5 40.5 42.5')),
      f(P(cravate)), s(P(cravate), { w: 0.85 }),
      s(P('M 17.6 27.4 L 21.6 30.8')), s(P('M 30.4 27.4 L 26.4 30.8'))];
  } };

  D.horloge = { accent: 'bleu', titre: 'Horloge', dessin: function () {
    var g = [f(secteur(24, 24, 17, -90, 0)), s(C(24, 24, 17))];
    [-90, 0, 90, 180].forEach(function (a) { var c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180);
      g.push(s(L(24 + 13.2 * c, 24 + 13.2 * sn, 24 + 15 * c, 24 + 15 * sn), { w: 0.8, fin: true })); });
    return g.concat([s(P('M 24 13 L 24 24 L 31.5 28.5')), fi(disque(24, 24, 1.3))]);
  } };

  D.chrono = { accent: 'corail', titre: 'Chrono', dessin: function () {
    return [f(disque(27, 27, 14)), s(C(27, 27, 14)),
      s(L(27, 13, 27, 9.4)), s(P('M 23.2 7.6 L 30.8 7.6')),
      s(L(37.2, 16.8, 39.6, 14.4)),
      s(L(4.6, 22, 9.6, 22)), s(L(3.4, 28, 8.6, 28)), s(L(5.6, 34, 10, 34), { fin: true }),
      s(P('M 27 27 L 32 20.2')), fi(disque(27, 27, 1.3))];
  } };

  D.calendrier = { accent: 'corail', titre: 'Calendrier', dessin: function () {
    var g = [f(P('M 12 10 L 36 10 Q 40 10 40 14 L 40 19.5 L 8 19.5 L 8 14 Q 8 10 12 10 Z')), s(rr(8, 10, 32, 31, 4)), s(L(8, 19.5, 40, 19.5)),
      s(L(16, 6.5, 16, 13)), s(L(32, 6.5, 32, 13))];
    [16, 24, 32].forEach(function (x) { [26.5, 34].forEach(function (y) { g.push(fi(disque(x, y, 1.4))); }); });
    return g;
  } };

  D.sablier = { accent: 'moutarde', titre: 'Sablier', dessin: function () {
    return [
      f(P('M 16.4 40 C 17.4 35 21.6 32.6 24 30 C 26.4 32.6 30.6 35 31.6 40 Z')),
      f(P('M 18 13 L 30 13 C 29 16.6 25.6 19 24 20.5 C 22.4 19 19 16.6 18 13 Z')),
      s(P('M 15.4 7 C 15.4 17 22 19.6 22 24 C 22 28.4 15.4 31 15.4 41')),
      s(P('M 32.6 7 C 32.6 17 26 19.6 26 24 C 26 28.4 32.6 31 32.6 41')),
      s(L(11.5, 7, 36.5, 7)), s(L(11.5, 41, 36.5, 41)), s(L(24, 23, 24, 29.5), { w: 0.6, fin: true })];
  } };

  D.graphique = { accent: 'bleu', titre: 'Graphique', dessin: function () {
    var b = [[12.5, 28, 7], [22, 20.5, 7], [31.5, 11.5, 7]], g = [];
    b.forEach(function (q) { var x = q[0], y = q[1], w = q[2];
      g.push(f(P('M ' + x + ' 40 L ' + x + ' ' + y + ' L ' + (x + w) + ' ' + y + ' L ' + (x + w) + ' 40 Z')));
      g.push(s(P('M ' + x + ' 40 L ' + x + ' ' + y + ' L ' + (x + w) + ' ' + y + ' L ' + (x + w) + ' 40'))); });
    return g.concat([s(P('M 7.5 8.5 L 7.5 38 Q 7.5 40 9.5 40 L 41.5 40'))]);
  } };

  D.objectif = { accent: 'corail', titre: 'Objectif', dessin: function () {
    return [f(disque(22.5, 25.5, 10.6)), s(C(22.5, 25.5, 16.5)), s(C(22.5, 25.5, 10.6, -40)), s(C(22.5, 25.5, 4.4, 60)),
      s(L(22.5, 25.5, 38.5, 9.5)), s(P('M 38.5 9.5 L 38.5 4.8')), s(P('M 38.5 9.5 L 43.2 9.5')), s(P('M 35.6 12.4 L 35.6 7.8'), { fin: true }), s(P('M 35.6 12.4 L 40.2 12.4'), { fin: true })];
  } };

  D.indicateur = { accent: 'vert', titre: 'Indicateur', dessin: function () {
    var cx = 24, cy = 33, R = 18, r = 11;
    var bande = arc(cx, cy, R, 228, 360).concat(arc(cx, cy, r, 360, 228));
    return [f(T(bande, true)), s(A(cx, cy, R, 180, 360)), s(A(cx, cy, r, 180, 360)),
      s(L(cx - R, cy, cx - r, cy)), s(L(cx + r, cy, cx + R, cy)),
      s(L(cx + r * Math.cos(228 * Math.PI / 180), cy + r * Math.sin(228 * Math.PI / 180), cx + R * Math.cos(228 * Math.PI / 180), cy + R * Math.sin(228 * Math.PI / 180)), { w: 0.8 }),
      s(L(cx, cy, 33.4, 21.6)), fi(disque(cx, cy, 2.4)), s(L(8, 40, 40, 40), { fin: true })];
  } };

  D.qualite = { accent: 'vert', titre: 'Qualité', dessin: function () {
    return [s(P('M 18.4 28.6 L 14.2 41 L 18.6 38.6 L 21.2 42.2 L 23 31')), s(P('M 29.6 28.6 L 33.8 41 L 29.4 38.6 L 26.8 42.2 L 25 31')),
      f(festons(24, 18, 12, 12, 1.1)), s(festons(24, 18, 12, 12, 1.1)),
      s(P('M 18.6 18.4 L 22.4 22.2 L 29.6 14.2'), { w: 1.08 })];
  } };

  D.valide = { accent: 'vert', titre: 'Validé', dessin: function () {
    return [f(disque(24, 24, 16.5)), s(C(24, 24, 16.5)), s(P('M 15.8 24.6 L 21.6 30.4 L 32.6 18'), { w: 1.15 })];
  } };

  D.non = { accent: 'corail', titre: 'Non', dessin: function () {
    return [f(disque(24, 24, 16.5)), s(C(24, 24, 16.5)), s(L(18, 18, 30, 30), { w: 1.15 }), s(L(30, 18, 18, 30), { w: 1.15 })];
  } };

  D.loupe = { accent: 'bleu', titre: 'Loupe', dessin: function () {
    return [f(disque(20.5, 20.5, 12.5)), s(C(20.5, 20.5, 12.5)), s(A(20.5, 20.5, 7.8, 195, 255), { w: 0.8, fin: true }),
      s(L(30, 30, 40.5, 40.5), { w: 2.1 })];
  } };

  D.inspection = { accent: 'vert', titre: 'Inspection', dessin: function () {
    return [f(rr(10, 9, 28, 33, 4)), s(rr(10, 9, 28, 33, 4)),
      fp(rr(18, 5.5, 12, 7, 2.4)), s(rr(18, 5.5, 12, 7, 2.4)),
      s(P('M 17 27 L 22 32 L 31.4 21.4'), { w: 1.15 })];
  } };

  D.standard = { accent: 'indigo', titre: 'Standard', dessin: function () {
    var page = 'M 11 6 L 26 6 L 34 14 L 34 40 Q 34 42 32 42 L 11 42 Q 9 42 9 40 L 9 8 Q 9 6 11 6 Z';
    return [s(P(page)), s(P('M 26 6 L 26 12 Q 26 14 28 14 L 34 14')),
      s(L(14, 20.5, 24.5, 20.5)), s(L(14, 27, 22.5, 27)), s(L(14, 33.5, 20.5, 33.5), { fin: true }),
      s(P('M 29.2 36.6 L 27.6 42.4 L 30.4 41.2 L 32 43.4 L 33.2 38.2')), s(P('M 36.8 36.6 L 38.4 42.4 L 35.6 41.2 L 34 43.4 L 32.8 38.2')),
      fp(disque(33, 31, 7.4)), f(disque(33, 31, 7.4)), s(C(33, 31, 7.4)),
      { t: 'sp', g: P('M 29.7 31.2 L 32.1 33.6 L 36.4 28.6'), o: { w: 0.75 } }];
  } };

  D.amelioration = { accent: 'moutarde', titre: 'Amélioration', dessin: function () {
    // une grande étoile pleine et deux petites au trait : le progrès qui brille, sans le « + » d'un ajout
    var e = etoile(19.5, 27.5, 14, 6.2, 5, 0), e2 = etoile(36.6, 12, 6, 2.7, 5, 8), e3 = etoile(38.4, 30.4, 4, 1.8, 5, -6);
    return [f(e), s(e), s(e2, { w: 0.9 }), s(e3, { w: 0.8, fin: true })];
  } };

  D.gain = { accent: 'vert', titre: 'Gain', dessin: function () {
    return [f(P('M 7 35.5 L 17 25 L 24 30.5 L 34.5 18.5 L 34.5 40.5 L 7 40.5 Z')),
      s(P('M 7 35.5 L 17 25 L 24 30.5 L 38.5 14')), s(P('M 30.6 13.4 L 38.8 13.6 L 38.6 21.8')),
      s(L(5.5, 40.5, 42.5, 40.5))];
  } };

  // option quart (0 Plan, 1 Do, 2 Check, 3 Act) : seul ce quart prend l'accent (repère d'étape des cartes)
  D.pdca = { accent: 'moutarde', titre: 'PDCA', dessin: function (o) {
    var Q = [[180, 270], [270, 360], [0, 90], [90, 180]], q = o && o.quart != null ? [Q[+o.quart]] : [Q[0], Q[2]];
    return q.map(function (a) { return f(secteur(24, 24, 17, a[0], a[1])); }).concat([s(C(24, 24, 17, -60)), s(L(24, 7, 24, 41)), s(L(7, 24, 41, 24)),
      lettre('P', 16.2, 16.4), lettre('D', 31.8, 16.4), lettre('C', 31.6, 31.6), lettre('A', 16.2, 31.6)]);
  } };

  D.lien = { accent: 'bleu', titre: 'Lien', dessin: function () {
    // deux demi-maillons qui se font face, reliés par une barre : la lecture « lien » classique
    var k = Math.SQRT1_2, h = 7.6;
    function pose(pts) { return pts.map(function (q) { return [24 + (q[0] + q[1]) * k, 24 + (q[1] - q[0]) * k]; }); }
    function demi(sens) { // sens 1 : maillon haut droit, -1 : bas gauche ; ouvert vers le centre
      var p = [[4.2 * sens, -h]], cx = 10.6 * sens;
      seg(p, p[0], [cx, -h]);
      p = p.concat(arc(cx, 0, h, sens > 0 ? -90 : 270, sens > 0 ? 90 : 90));
      seg(p, [cx, h], [4.2 * sens, h]);
      return pose(p);
    }
    var u1 = demi(-1), u2 = demi(1), barre = [[-8.2, 0]];
    seg(barre, [-8.2, 0], [8.2, 0]);
    return [f(T(u2, true)), s(T(u2)), s(T(u1)), s(T(pose(barre)), { w: 1.05 })];
  } };

  D.etapes = { accent: 'indigo', titre: 'Étapes', dessin: function () {
    // trois étapes reliées, celle du milieu en accent : « où l'on en est dans la démarche » (ref. Étape 1-2-3)
    var g = [f(disque(24, 24, 6))];
    [9.5, 24, 38.5].forEach(function (x) { g.push(s(C(x, 24, 6, -70))); });
    g.push(s(L(15.6, 24, 17.9, 24)), s(L(30.1, 24, 32.4, 24)));
    return g;
  } };

  D.livrable = { accent: 'moutarde', titre: 'Livrable', dessin: function () {
    return [f(rr(9, 18.5, 30, 22.5, 2)), f(rr(6, 11, 36, 8, 2)), s(rr(9, 18.5, 30, 22.5, 2)), s(rr(6, 11, 36, 8, 2)),
      s(P('M 17 29.5 L 22 34.2 L 31 24.8'), { w: 1.12 })];
  } };

  D.usine = { accent: 'bleu', titre: 'Usine', dessin: function () {
    var corps = 'M 5 41 L 5 24.5 L 14 18.5 L 14 24.5 L 23 18.5 L 23 24.5 L 31.5 18.5 L 31.5 7 L 39 7 L 39 41 Z';
    var g = [f(P(corps)), s(P(corps)), s(L(3, 41, 45, 41))];
    [10, 17, 24].forEach(function (x) { g.push(fi(rr(x - 1.6, 30, 3.2, 3.6, 0.6))); });
    return g;
  } };

  D.machine = { accent: 'indigo', titre: 'Machine', dessin: function () {
    // bâti, engrenage (accent), pupitre à un bouton, voyant andon : lisible jusqu'à 18 px
    var roue = engrenage(18.5, 26.5, 6.4, 9.2, 8);
    return [fp(rr(5, 15, 38, 23, 3)), s(rr(5, 15, 38, 23, 3)), f(roue), s(roue), fp(disque(18.5, 26.5, 2.9)), s(C(18.5, 26.5, 2.9), { w: 0.8 }),
      s(L(31, 15, 31, 38)), fi(disque(37, 22.5, 2.2)), s(L(34.4, 30.5, 39.6, 30.5), { w: 0.85, fin: true }),
      s(L(10, 38, 10, 42)), s(L(38, 38, 38, 42)),
      s(L(37, 15, 37, 11)), f(rr(34, 4.5, 6, 6.5, 2)), s(rr(34, 4.5, 6, 6.5, 2), { w: 0.85 })];
  } };

D['pas-gemba'] = { accent: 'indigo', titre: 'Pas gemba', dessin: function () {
    var avant = 'M 0 -9 C 4.6 -9 6.2 -3.4 5.4 1.6 C 4.8 5.4 3 7.6 0.4 7.6 C -2.6 7.6 -4.2 5 -4.8 1.4 C -5.6 -3.8 -4.4 -9 0 -9 Z';
    var talon = 'M -3.8 11.4 C -3.6 9.6 4 9.6 4 11.4 L 3.8 14.6 C 3.6 18.2 -3.6 18.2 -3.8 14.6 Z';
    function semelle(cx, cy, rot, miroir) {
      var c = Math.cos(rot * Math.PI / 180), sn = Math.sin(rot * Math.PI / 180), k = miroir ? -1 : 1;
      function t(g) { return g.map(function (tr) { return { ferme: tr.ferme, p: tr.p.map(function (q) { var x = q[0] * k, y = q[1]; return [cx + x * c - y * sn, cy + x * sn + y * c]; }) }; }); }
      var a = t(P(avant)), b = t(P(talon));
      return [f(a), s(a), f(b), s(b)];
    }
    return semelle(15.4, 24.2, -9, false).concat(semelle(32.6, 13.8, 9, true));
  } };

  // ---------- Rendu ----------
  var LISTE = ['idee', 'question', 'attention', 'info', 'document', 'equipe', 'horloge', 'chrono', 'calendrier', 'sablier',
    'graphique', 'objectif', 'indicateur', 'qualite', 'valide', 'non', 'loupe', 'inspection', 'standard', 'amelioration',
    'gain', 'pdca', 'lien', 'etapes', 'livrable', 'manager', 'usine', 'machine', 'pas-gemba'];

  function deplace(trace, sd, dx, dy) {
    return trace.p.map(function (q) {
      return [q[0] + dx + AMPLITUDE * bruit(q[0] / ONDE, q[1] / ONDE, sd), q[1] + dy + AMPLITUDE * bruit(q[0] / ONDE + 31.7, q[1] / ONDE + 11.3, sd)];
    });
  }
  function d2(pts, ferme) { // lissage par milieux (courbes quadratiques)
    var r = function (v) { return Math.round(v * 10) / 10; };
    if (pts.length < 3) return 'M' + r(pts[0][0]) + ' ' + r(pts[0][1]) + 'L' + r(pts[pts.length - 1][0]) + ' ' + r(pts[pts.length - 1][1]);
    var d = 'M' + r(pts[0][0]) + ' ' + r(pts[0][1]);
    for (var i = 1; i < pts.length - 1; i++) {
      var m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
      d += 'Q' + r(pts[i][0]) + ' ' + r(pts[i][1]) + ' ' + r(m[0]) + ' ' + r(m[1]);
    }
    var z = pts[pts.length - 1];
    return d + 'L' + r(z[0]) + ' ' + r(z[1]) + (ferme ? 'Z' : '');
  }
  function couleur(c) { return !c ? null : (PALETTE[c] || c); }
  function epaisseur(taille) { return taille <= 24 ? 2.9 : taille <= 40 ? 2.6 : 2.4; }

  function contenu(nom, o) {
    o = o || {};
    var def = D[nom];
    if (!def) throw new Error('Icône inconnue : ' + nom + ' (disponibles : ' + LISTE.join(', ') + ')');
    var taille = o.taille || 48, W = o.trait || epaisseur(taille), detail = o.detail != null ? o.detail : taille >= 28;
    var acc = couleur(o.accent) || PALETTE[def.accent], papier = o.papier || '#FFFFFF', sd = graine(nom);
    var out = [];
    def.dessin(o).forEach(function (el, k) {
      if (el.o.fin && !detail) return;
      var w = W * (el.o.w || 1);
      el.g.forEach(function (tr) {
        if (el.t === 'f') out.push('<path d="' + d2(deplace(tr, sd + 5, RISO[0], RISO[1]), true) + '" fill="' + acc + '"/>');
        else if (el.t === 'fp') out.push('<path d="' + d2(deplace(tr, sd, 0, 0), true) + '" fill="' + papier + '"/>');
        else if (el.t === 'fi') out.push('<path d="' + d2(deplace(tr, sd, 0, 0), true) + '" fill="' + ENCRE + '" stroke="' + ENCRE + '" stroke-width="' + (W * 0.5).toFixed(2) + '"/>');
        else if (el.t === 'sp') out.push('<path d="' + d2(deplace(tr, sd, 0, 0), tr.ferme) + '" fill="none" stroke="' + papier + '" stroke-width="' + w.toFixed(2) + '"/>');
        else if (el.t === 'sa') out.push('<path d="' + d2(deplace(tr, sd + 5, RISO[0], RISO[1]), tr.ferme) + '" fill="none" stroke="' + acc + '" stroke-width="' + w.toFixed(2) + '"/>');
        else out.push('<path d="' + d2(deplace(tr, sd, 0, 0), tr.ferme) + '" fill="none" stroke="' + ENCRE + '" stroke-width="' + w.toFixed(2) + '"/>');
      });
    });
    return '<g stroke-linecap="round" stroke-linejoin="round">' + out.join('') + '</g>';
  }

  function svg(nom, o) {
    o = o || {};
    var taille = o.taille || 48, def = D[nom] || {}, titre = o.titre != null ? o.titre : def.titre;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="' + taille + '" height="' + taille + '"' +
      (o.classe ? ' class="' + o.classe + '"' : '') + ' role="img" aria-label="' + (titre || nom) + '">' +
      (titre ? '<title>' + titre + '</title>' : '') + contenu(nom, o) + '</svg>';
  }

  var Icones = {
    svg: svg, contenu: contenu, liste: LISTE.slice(), palette: PALETTE, encre: ENCRE,
    accentParDefaut: function (nom) { return D[nom] ? D[nom].accent : null; },
    titre: function (nom) { return D[nom] ? D[nom].titre : null; }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Icones;
  global.Icones = Icones;
})(typeof window !== 'undefined' ? window : globalThis);
