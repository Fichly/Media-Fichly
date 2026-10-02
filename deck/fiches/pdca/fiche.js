// Carte N°11 PDCA, v2 : illustrations propres à la carte.
// Recto : héros (Malik pousse la roue PDCA sur la pente, la cale la retient), étapes en deux colonnes
//         calées sur leur quart (Plan et Act à gauche, Do et Check à droite, comme la carte d'origine) ;
//         frise du parcours Avant → Pendant → Après.
// Verso : 4 vignettes « trait + aplat » sans fond : le personnage, cadré en buste comme dans la ref3,
//         fait l'action de l'étape avec les chiffres de l'exemple.
// Personnages : deck/gabarit/personnages.js. Icônes : deck/gabarit/icones.js (repère d'étape : icône pdca, option quart).
// Tout est déterministe : aucune valeur aléatoire.
// Les vignettes et le héros sont dessinés dans un repère en pixels CSS (Carte.repere) :
// une taille de texte SVG y est une taille effective (Caveat 14 = 14 px imprimés).
(() => {
  const { P, alpha, pointe, repere } = Carte;
  const PERS = window.Personnages;
  let C;
  const dessin = (nom, f) => Carte.dessin(nom, (svg, o) => { C = Carte.C; return f(svg, o); });

  // ---------- Géométrie ----------
  const add = (a, b, k = 1) => [a[0] + k * b[0], a[1] + k * b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const len = v => Math.hypot(v[0], v[1]);
  const norm = v => { const l = len(v) || 1; return [v[0] / l, v[1] / l]; };
  const perp = v => [-v[1], v[0]];
  const pol = (c, r, deg) => [c[0] + r * Math.cos(deg * Math.PI / 180), c[1] + r * Math.sin(deg * Math.PI / 180)];
  const f2 = n => (+n).toFixed(2);

  // ---------- Trait feutre ----------
  const st = (w, fill = 'none', stroke) => `fill="${fill}" stroke="${stroke || C.encre}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
  // objet « trait + aplat décalé » (riso) : réserve papier, aplat décalé, trait encre
  const objet = (d, col, w = 1.5, dx = 1.6, dy = 1.3) =>
    `<path d="${d}" fill="${C.papier}"/>` + (col ? `<path d="${d}" fill="${col}" transform="translate(${dx} ${dy})"/>` : '') + `<path d="${d}" ${st(w)}/>`;
  const rect = (x, y, w, h, r = 0) => r ? `M${f2(x + r)} ${f2(y)} H${f2(x + w - r)} Q${f2(x + w)} ${f2(y)} ${f2(x + w)} ${f2(y + r)} V${f2(y + h - r)} Q${f2(x + w)} ${f2(y + h)} ${f2(x + w - r)} ${f2(y + h)} H${f2(x + r)} Q${f2(x)} ${f2(y + h)} ${f2(x)} ${f2(y + h - r)} V${f2(y + r)} Q${f2(x)} ${f2(y)} ${f2(x + r)} ${f2(y)} Z`
    : `M${f2(x)} ${f2(y)} H${f2(x + w)} V${f2(y + h)} H${f2(x)} Z`;
  // flèche main levée : fleche(a, b, k) courbe quadratique de flèche k (px, signe = côté),
  // ou fleche(a, b, null, { c1, c2 }) cubique par deux points de contrôle.
  function fleche(a, b, k = 10, o = {}) {
    const w = o.w || 1.3, col = o.couleur || C.encre;
    let d, depuis;
    if (o.c1) { d = `M${P(a)} C${P(o.c1)} ${P(o.c2)} ${P(b)}`; depuis = o.c2; }
    else { const c = add(add(a, sub(b, a), .5), perp(norm(sub(b, a))), k); d = `M${P(a)} Q${P(c)} ${P(b)}`; depuis = c; }
    const ang = Math.atan2(b[1] - depuis[1], b[0] - depuis[0]);
    return `<path d="${d}" ${st(w, 'none', col)}${o.tirets ? ' stroke-dasharray="3 3"' : ''}/>` + pointe(b[0], b[1], ang, o.l || 6, col, w);
  }
  function texte(x, y, t, o = {}) {
    return `<text x="${f2(x)}" y="${f2(y)}" font-family="${o.police || 'Caveat'}" font-weight="${o.graisse || 700}" font-size="${o.taille || 15}"` +
      ` fill="${o.couleur || C.marine}" text-anchor="${o.ancre || 'start'}"${o.serre ? ` letter-spacing="${o.serre}"` : ''}>${t}</text>`;
  }
  // personnage : trait feutre légèrement tremblé (filtre du gabarit), ceinture du niveau, aplat de famille
  const opts = o => Object.assign({ ceinture: C.ceinture, aplat: C.famille }, o);
  const perso = o => `<g filter="url(#tremble-perso)">${PERS.dessiner(opts(o))}</g>`;
  const ancres = o => PERS.ancres(opts(o));
  // cadrage buste (ref3) : le personnage est coupé net par le bas de la vignette, sans cadre
  const buste = (id, o, W, yCoupe) =>
    `<clipPath id="${id}"><rect x="-40" y="-60" width="${f2(W + 80)}" height="${f2(yCoupe + 60)}"/></clipPath><g clip-path="url(#${id})">${perso(o)}</g>`;
  // place un personnage pour qu'une de ses ancres tombe sur un point donné
  function cale(o, ancre, cible) {
    const a = ancres(Object.assign({}, o, { x: 0, y: 0 }))[ancre];
    return Object.assign({}, o, { x: cible[0] - a[0], y: cible[1] - a[1] });
  }

  // ======================================================================
  // RECTO : le héros
  // La roue est orientée comme l'icône PDCA : quarts en « + », P en haut à gauche, D en haut à droite,
  // C en bas à droite, A en bas à gauche ; elle tourne dans le sens horaire en montant la pente.
  // ======================================================================
  const QUARTS = [[180, 270], [270, 360], [0, 90], [90, 180]];   // Plan, Do, Check, Act (degrés, y vers le bas)
  const HEROS = {
    col: 148,          // largeur des colonnes d'annotations (gauche : Plan, Act ; droite : Do, Check)
    gout: 8,           // écart entre une colonne et le dessin
    e: 1.08,           // échelle de Malik
    R: 45,             // rayon de la roue
    tan: 0.21,         // pente (celle de la pose « pousse »)
    rang: 12,          // écart vertical entre les deux rangées d'annotations
  };

  dessin('heros', svg => {
    const [W, H] = repere(svg), Hz = HEROS, tan = Hz.tan, cos = 1 / Math.hypot(1, tan), sin = tan * cos;
    const u = [cos, -sin], nUp = [-sin, -cos];           // le long de la pente (vers le haut), normale vers le haut
    const host = svg.parentNode, H0 = svg.getBoundingClientRect();

    // 1. annotations : deux colonnes, deux rangées alignées
    const [aP, aD, aC, aA] = [...host.querySelectorAll('.anno')];
    const pose = (n, x, y) => Object.assign(n.style, { left: x + 'px', top: y + 'px', width: Hz.col + 'px' });
    pose(aP, 0, 0); pose(aD, W - Hz.col, 0);
    const y2 = Math.max(aP.offsetHeight, aD.offsetHeight) + Hz.rang;
    pose(aA, 0, y2); pose(aC, W - Hz.col, y2);
    const x0 = Hz.col + Hz.gout, x1 = W - Hz.col - Hz.gout;        // zone centrale du dessin

    // 2. Malik et la roue, calculés pieds en (0, 0), puis centrés dans la zone centrale
    const oM = { perso: 'malik', pose: 'pousse', decor: false, signes: false, echelle: Hz.e, x: 0, y: 0 };
    const sol0 = x => -tan * x;
    const mains = ancres(oM).mains;
    const centre = x => add([x, sol0(x)], nUp, Hz.R);
    let lo = mains[0], hi = mains[0] + 3 * Hz.R;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (len(sub(centre(m), mains)) < Hz.R ? lo = m : hi = m); }
    const c0 = centre((lo + hi) / 2), bM = PERS.boite(opts(oM));
    const gauche = bM.x, droite = c0[0] + Hz.R + 2;
    const dx = x0 + (x1 - x0 - (droite - gauche)) / 2 - gauche;
    // hauteur : la flèche de rotation (au-dessus de la roue) et la tête restent dans le cadre
    const haut = Math.min(bM.y, c0[1] - Hz.R - 12);
    const dy = 3 - haut;
    const T = p => [p[0] + dx, p[1] + dy];
    const c = T(c0), Rw = Hz.R, xp = dx, yp = dy;
    const sol = x => yp - tan * (x - xp);
    const contact = add(c, nUp, -Rw);

    let s = '';
    // sol : bande de famille sous la pente, hachures, trait encre ; de la jambe arrière de Malik au-delà de la roue
    // la pente s'arrête à 1 cm de la colonne de droite : elle ne doit pas sembler entrer dans le texte de Check
    const xa = x0 - 4, xb = Math.min(x1 - 4, c[0] + Rw + 8);
    s += `<path d="M${P([xa, sol(xa)])} L${P([xb, sol(xb)])} L${P(add([xb, sol(xb)], nUp, -10))} L${P(add([xa, sol(xa)], nUp, -10))} Z" fill="${alpha(C.famille, .45)}"/>`;
    let hach = '';
    for (let x = xa + 10; x < xb - 3; x += 11) hach += `M${P(add([x, sol(x)], nUp, -2.5))} L${P(add([x - 5.5, sol(x - 5.5)], nUp, -9))} `;
    s += `<path d="${hach}" ${st(1, 'none', alpha(C.encre, .35))}/>`;
    s += `<path d="M${P([xa, sol(xa)])} L${P([xb, sol(xb)])}" ${st(2)}/>`;

    // la roue PDCA : quarts en « + », P et C en aplat de famille, D et A en aplat léger, décalés façon riso
    const quart = (a0, a1, r = Rw) => `M${P(c)} L${P(pol(c, r, a0))} A${r} ${r} 0 0 1 ${P(pol(c, r, a1))} Z`;
    s += `<circle cx="${f2(c[0])}" cy="${f2(c[1])}" r="${Rw}" fill="${C.papier}"/>`;
    s += `<g transform="translate(2 1.6)">` + [0, 2].map(i => `<path d="${quart(...QUARTS[i])}" fill="${C.famille}"/>`).join('') +
      [1, 3].map(i => `<path d="${quart(...QUARTS[i])}" fill="${C.famille}" opacity=".32"/>`).join('') + `</g>`;
    s += `<circle cx="${f2(c[0])}" cy="${f2(c[1])}" r="${Rw}" ${st(2.3)}/>`;
    [0, 90, 180, 270].forEach(a => { s += `<path d="M${P(pol(c, 7, a))} L${P(pol(c, Rw, a))}" ${st(1.7)}/>`; });
    s += `<circle cx="${f2(c[0])}" cy="${f2(c[1])}" r="6.5" ${st(1.6, C.papier)}/><circle cx="${f2(c[0])}" cy="${f2(c[1])}" r="2" fill="${C.encre}"/>`;
    ['P', 'D', 'C', 'A'].forEach((L, i) => {
      const a = (QUARTS[i][0] + QUARTS[i][1]) / 2, p = pol(c, Rw * .52, a);
      s += texte(p[0], p[1] + 7.5, L, { police: 'Kalam', taille: 22, couleur: C.encre, ancre: 'middle' });
      // numéro d'ordre de l'étape, au début du quart (sens de rotation) : relie la roue aux textes « 1. Plan »…
      const pn = pol(c, Rw * .76, QUARTS[i][0] + 17);
      s += texte(pn[0], pn[1] + 5, String(i + 1), { taille: 15, couleur: C.indigo, ancre: 'middle' });
    });
    // sens de rotation : arc indigo au-dessus de la roue, sens horaire (la roue monte)
    const ra = Rw + 8;
    s += `<path d="M${P(pol(c, ra, -128))} A${ra} ${ra} 0 0 1 ${P(pol(c, ra, -42))}" ${st(2, 'none', C.indigo)}/>` +
      pointe(...pol(c, ra, -42), (-42 + 90) * Math.PI / 180, 7, C.indigo, 2);

    // la cale : coin posé sur la pente, côté aval, son flanc contre la jante
    const h = 18, d = Math.sqrt(2 * Rw * h - h * h);
    const pA = add(contact, u, -d), pB = add(pA, u, -28), pC = add(pA, nUp, h);
    const cale = `M${P(pB)} L${P(pA)} L${P(pC)} Z`;
    s += `<path d="${cale}" fill="${C.indigo}" transform="translate(1.6 1.2)"/><path d="${cale}" ${st(1.8, alpha(C.indigo, .25))}/>`;

    // Malik pousse, penché dans l'effort ; traits d'emphase vers l'arrière, loin des annotations
    s += perso(Object.assign({}, oM, { x: dx, y: dy, signes: true }));

    // 3. note de la cale : sous la pente, alignée à droite de la zone centrale ; flèche courte vers la cale
    const nc = host.querySelector('.note-heros');
    // la note commence sous la roue (côté aval de la pente) et peut s'étendre sous la colonne de droite, déjà finie à cette hauteur
    const nw = nc.offsetWidth, nh = nc.offsetHeight, nx = Math.min(W - nw, x0 + 10);
    const ny = Math.max(sol(nx), sol(nx + nw)) + 12;
    Object.assign(nc.style, { left: f2(nx) + 'px', top: f2(ny) + 'px' });
    if (ny + nh > H + .5) console.error(`Héros : la note de la cale déborde de ${(ny + nh - H).toFixed(1)} px`);
    // la flèche s'arrête 3 px avant la cale (indigo sur indigo, la pointe disparaîtrait), pointe à l'encre
    const cCale = add(add(pB, sub(pA, pB), .62), nUp, -3);
    const dep = [Math.max(nx + 6, cCale[0] - 2), ny - 2];
    s += fleche(dep, cCale, -4, { w: 1.4, couleur: C.encre, l: 5.5 });
    svg.innerHTML = s;
  });

  // parcours : flèche indigo qui relie les stations ; elle s'interrompt autour des icônes et des mots (pas de fond masquant)
  dessin('parcours', svg => {
    const [W] = repere(svg), B = svg.getBoundingClientRect();
    const bx = n => { const r = n.getBoundingClientRect(); return { x0: r.left - B.left, x1: r.right - B.left, cy: r.top - B.top + r.height / 2, r: r.width / 2 }; };
    const st8 = [...svg.parentNode.querySelectorAll('.station .moment')].map(m => ({ ic: bx(m.querySelector('.ic')), mot: bx(m.querySelector('span:last-child')) }));
    const y = st8[0].ic.cy;
    let s = '';
    // la station de la carte (Pendant) : icône à la même taille que les autres, cerclée d'un anneau indigo « vous êtes ici »
    const ici = st8[1].ic, ri = ici.r + 2.6;
    s += `<circle cx="${f2(ici.x0 + ici.r)}" cy="${f2(ici.cy)}" r="${f2(ri)}" ${st(2, 'none', C.indigo)} filter="url(#tremble)"/>`;
    st8.forEach((p, i) => {
      const xa = p.mot.x1 + 5, xb = i < st8.length - 1 ? st8[i + 1].ic.x0 - (i === 0 ? 8 : 4) : W - 6;
      s += `<path d="M${f2(xa)} ${f2(y + .6)} Q${f2((xa + xb) / 2)} ${f2(y - 1.2)} ${f2(xb)} ${f2(y)}" ${st(1.6, 'none', C.indigo)}/>`;
      if (i === st8.length - 1) s += pointe(xb, y, 0, 6, C.indigo, 1.6);
    });
    svg.innerHTML = s;
  });

  // ======================================================================
  // VERSO : vignettes des 4 étapes, sans fond ni cadre (le dessin est posé sur le papier)
  // Marge intérieure de 5 px pour les textes ; personnages cadrés en buste, coupés par le bas de la vignette.
  // ======================================================================
  const M = 5;

  // place un personnage par une ancre, puis le recale à l'horizontale dans la vignette (marge m)
  function place(o, ancre, cible, W, m = 1.5) {
    const q = cale(o, ancre, cible), b = PERS.boite(opts(q));
    if (b.x < m) q.x += m - b.x;
    else if (b.x + b.largeur > W - m) q.x -= b.x + b.largeur - (W - m);
    return q;
  }

  // petite flèche feutre horizontale (remplace le caractère « → », absent de la police Caveat)
  const flechette = (x, y, l = 11, col = C.encre, w = 1.4) =>
    `<path d="M${f2(x)} ${f2(y + .4)} Q${f2(x + l / 2)} ${f2(y - .8)} ${f2(x + l)} ${f2(y)}" ${st(w, 'none', col)}/>` + pointe(x + l, y, 0, 4, col, w);

  // 1. Plan : Léa montre le paperboard : 60 % des rebuts viennent des réglages, objectif 10 → 5 % sous 2 semaines
  dessin('v-plan', svg => {
    const [W, H] = repere(svg);
    let s = '';
    // Léa en pied, sur le sol, devant le bord gauche du chevalet. Sa chevelure fixe la position la plus à gauche
    // de son doigt ; l'objectif « 10 % → 5 % » est écrit en colonne juste à droite du doigt, le bras passe dessous.
    const ySol = H - 3, oL = { perso: 'lea', pose: 'montre', decor: false, signes: false, echelle: .9 };
    const b0 = PERS.boite(opts(Object.assign({}, oL, { x: 0, y: 0 }))), a0 = ancres(Object.assign({}, oL, { x: 0, y: 0 }));
    const o = Object.assign({}, oL, { x: -b0.x + 1.5, y: ySol });
    const dg = [o.x + a0.doigt[0], ySol + a0.doigt[1]];
    // chevalet : tableau, pince, trépied jusqu'au sol
    const bx = 22, by = 4, bw = W - bx - 1.5, xd = bx + bw - 4, bh = dg[1] + 36 - by;
    const pied = (xh, xs) => `<path d="M${f2(xh)} ${f2(by + bh - 2)} L${f2(xs)} ${f2(ySol)}" ${st(1.4)}/>`;
    s += `<path d="M${f2(1)} ${f2(ySol)} H${f2(W - 1)}" ${st(1.3, 'none', alpha(C.encre, .55))}/>`;
    s += pied(bx + 20, bx + 14) + pied(bx + bw - 10, bx + bw - 4) + pied(bx + bw / 2 + 5, bx + bw / 2 + 5);
    s += objet(rect(bx, by, bw, bh, 1.5), null, 1.5);
    s += `<path d="M${f2(bx - 2.5)} ${f2(by - .5)} H${f2(bx + bw + 2.5)}" ${st(2.4)}/>`;
    // le problème : 60 % des rebuts (camembert en aplat de famille)
    const pc = [xd - 34, by + 11.5], pr = 6.2;
    s += `<path d="M${P(pc)} L${P(pol(pc, pr, -90))} A${pr} ${pr} 0 1 1 ${P(pol(pc, pr, -90 + 216))} Z" fill="${C.famille}" transform="translate(1 .8)"/>`;
    s += `<circle cx="${f2(pc[0])}" cy="${f2(pc[1])}" r="${pr}" ${st(1.2)}/><path d="M${P(pol(pc, pr, -90))} L${P(pc)} L${P(pol(pc, pr, 126))}" ${st(1)}/>`;
    s += texte(xd, by + 17, '60 %', { taille: 15, ancre: 'end', couleur: C.encre });
    // l'objectif, en colonne : 10 % ↓ 5 % (flèche dessinée), juste à droite du doigt ; puis le délai
    const xo = Math.max(dg[0] + 14, xd - 12);
    s += texte(xo, dg[1] - 2, '10 %', { taille: 14, ancre: 'middle', couleur: C.encre });
    s += `<path d="M${f2(xo + .4)} ${f2(dg[1] + 1.5)} Q${f2(xo - .8)} ${f2(dg[1] + 5.5)} ${f2(xo)} ${f2(dg[1] + 9.5)}" ${st(1.4)}/>` + pointe(xo, dg[1] + 9.5, Math.PI / 2, 4, C.encre, 1.4);
    s += texte(xo, dg[1] + 21, '5 %', { taille: 14, ancre: 'middle', couleur: C.encre });
    s += texte(xd + 1, dg[1] + 33, 'sous 2 sem.', { taille: 14, ancre: 'end', couleur: C.indigo });
    s += perso(o);
    svg.innerHTML = s;
  });

  // 2. Do : Sam teste les nouveaux réglages sur 1 machine pendant 1 journée (calendrier « 1 j ») et note ses observations
  dessin('v-do', svg => {
    const [W, H] = repere(svg);
    let s = '';
    // calendrier « 1 j » en haut à gauche
    const cx0 = M, cy0 = 3, cw = 26, ch = 30;
    s += objet(rect(cx0, cy0 + 4, cw, ch - 4, 2), C.famille, 1.4, 1.3, 1.1);
    s += `<path d="${rect(cx0, cy0 + 4, cw, 7, 2)}" ${st(1.2, C.indigo)}/>`;
    s += `<path d="M${f2(cx0 + 7)} ${f2(cy0 + 1)} V${f2(cy0 + 7)} M${f2(cx0 + cw - 7)} ${f2(cy0 + 1)} V${f2(cy0 + 7)}" ${st(1.3)}/>`;
    s += `<path d="${rect(cx0 + 2.5, cy0 + 13, cw - 5, ch - 15.5, 1)}" fill="${C.papier}"/>`;
    // ligne de base remontée : le jambage du « j » reste dans la case blanche
    s += texte(cx0 + cw / 2, cy0 + ch - 7, '1 j', { taille: 16, ancre: 'middle', couleur: C.encre });
    // machine à droite : bâti gris, écran, bouton ; « 1 machine » au-dessus, flèche courte
    const mx = W - 30, mw = 28, my = 34;
    s += objet(rect(mx, my, mw, H - my - 3, 1.5), C.grisObjet, 1.5, 1.4, 1.1);
    s += `<path d="M${f2(mx - 6)} ${f2(H - 3)} H${f2(W - 1)}" ${st(1.3, 'none', alpha(C.encre, .55))}/>`;
    s += `<path d="${rect(mx + 5, my + 6, mw - 10, 11, 1)}" ${st(1.1, C.papier)}/>`;
    s += `<path d="M${f2(mx + 8)} ${f2(my + 14)} L${f2(mx + 11.5)} ${f2(my + 10)} L${f2(mx + 15)} ${f2(my + 12.5)} L${f2(mx + 20)} ${f2(my + 9)}" ${st(1, 'none', C.indigo)}/>`;
    s += texte(W - M - 1.5, 14, '1 machine', { taille: 14, ancre: 'end', couleur: C.encre });
    s += fleche([W - 15, 18], [W - 16, my - 4], -2, { w: 1.1, l: 4 });
    // Sam, cadré à la taille, sous le calendrier : il appuie sur le bouton et tient son porte-bloc
    const o0 = { perso: 'sam', pose: 'teste', decor: false, tenu: 'bloc', echelle: 1.12 };
    const a0 = ancres(Object.assign({}, o0, { x: 0, y: 0 })), b0 = PERS.boite(opts(Object.assign({}, o0, { x: 0, y: 0 })));
    const yPieds = cy0 + ch + 4 - b0.y;                     // haut de la tête sous le calendrier
    const bouton = [mx + 6, yPieds + a0.main[1]];
    s += `<circle cx="${f2(bouton[0] + 1.5)}" cy="${f2(bouton[1])}" r="3" ${st(1.1, C.famille)}/>`;
    const o = place(o0, 'main', bouton, W);
    s += buste('coupe-do', o, W, H);
    svg.innerHTML = s;
  });

  // 3. Check : le graphique d'abord. Avant 10 %, après 7 %, objectif 5 % (tirets corail, étiqueté) ;
  //    la part de la barre 7 % au-dessus de l'objectif (l'écart) est en corail. Malik, à côté, l'examine à la loupe.
  //    Annotation : « objectif 5 % pas encore atteint → on ajuste ». Vignette plus haute (--h-min de son cadre).
  dessin('v-check', svg => {
    const [W, H] = repere(svg);
    let s = '';
    s += texte(M - 2, 12, 'objectif 5 % pas', { taille: 14, couleur: C.corailTexte });
    s += texte(M - 2, 25, 'encore atteint', { taille: 14, couleur: C.corailTexte });
    s += flechette(M - 1, 33.5, 11, C.indigo) + texte(M + 13, 38, 'on ajuste', { taille: 14, couleur: C.indigo });
    // graphique : axe des valeurs implicite, étiquette de l'objectif à gauche des barres
    const yS = H - 3, sc = Math.min(4.6, (yS - 55) / 10), bw = 12, x10 = 21, x7 = 39;
    const y = v => yS - v * sc, y5 = y(5);
    s += `<path d="M${f2(x10 - 3)} ${f2(yS)} H${f2(x7 + bw + 5)}" ${st(1.3)}/>`;
    s += objet(rect(x10, y(10), bw, 10 * sc), alpha(C.encre, .16), 1.4, 1.1, .9);
    // barre 7 % : moutarde jusqu'à l'objectif, corail au-dessus (l'écart à combler)
    s += `<path d="${rect(x7, y(7), bw, 7 * sc)}" fill="${C.papier}"/>`;
    s += `<path d="${rect(x7, y5, bw, 5 * sc)}" fill="${C.famille}" transform="translate(1.1 .9)"/>`;
    s += `<path d="${rect(x7, y(7), bw, 2 * sc)}" fill="${C.corail}" opacity=".85" transform="translate(1.1 .9)"/>`;
    s += `<path d="${rect(x7, y(7), bw, 7 * sc)}" ${st(1.4)}/>`;
    s += texte(x10 + bw / 2, y(10) - 3, '10 %', { taille: 14, ancre: 'middle', couleur: C.encre });
    s += texte(x7 + bw / 2, y(7) - 3, '7 %', { taille: 14, ancre: 'middle', couleur: C.encre });
    s += `<path d="M${f2(x10 - 1)} ${f2(y5)} H${f2(x7 + bw + 5)}" ${st(1.6, 'none', C.corail)} stroke-dasharray="3.5 3"/>`;
    s += texte(0, y5 + 4.5, '5 %', { taille: 14, couleur: C.corailTexte });
    // Malik, en buste à droite du graphique, tourné vers lui : la loupe vise l'écart sans le cacher
    const o = place({ perso: 'malik', pose: 'inspecte', decor: false, miroir: true, echelle: .74 }, 'loupe', [x7 + bw + 13, y(7) + 2], W);
    s += buste('coupe-check', o, W, H);
    svg.innerHTML = s;
  });

  // 4. Act : trois machines (celle du Do) au sol. Léa fixe à plat la procédure sur la machine pilote
  //    (feuille blanche lignée, coin indigo : la cale), la même feuille est déjà déployée sur les deux autres.
  dessin('v-act', svg => {
    const [W, H] = repere(svg);
    let s = '';
    const e = 1, ech = e * 0.375;
    // Léa cadrée à la taille : sa paume est 78 unités au-dessus de la ceinture ; la ceinture tombe 4 px au-dessus du bas.
    // Sa chevelure fixe la position la plus à gauche de sa paume : les machines sont calées à droite de ce point.
    const oL = { perso: 'lea', pose: 'affiche', decor: false, signes: true, echelle: e };
    const bL = PERS.boite(opts(Object.assign({}, oL, { x: 0, y: 0 }))), aL = ancres(Object.assign({}, oL, { x: 0, y: 0 }));
    const xPaume = -bL.x + 1.5 + aL.paume[0];
    const yPaume = H - 4 - 78 * ech, mw = 12.5, g = 2, mh = 40, fw = 8.5, fh = 12;
    const xs = [W - 3 * mw - 2 * g - 1.5, W - 2 * mw - g - 1.5, W - mw - 1.5];
    const yF = yPaume - fh + 3.5, y0 = yF - 11, yS = y0 + mh;        // haut de feuille, haut des machines, sol
    s += `<path d="M${f2(xs[0] - 4)} ${f2(yS)} H${f2(W - .5)}" ${st(1.3, 'none', alpha(C.encre, .55))}/>`;
    const feuille = (x, y) => {
      const d = `M${f2(x)} ${f2(y)} H${f2(x + fw - 3.5)} L${f2(x + fw)} ${f2(y + 3.5)} V${f2(y + fh)} H${f2(x)} Z`;
      return `<path d="${d}" fill="${C.papier}"/>` + `<path d="M${f2(x + fw - 3.5)} ${f2(y)} V${f2(y + 3.5)} H${f2(x + fw)} Z" fill="${C.indigo}"/>` + `<path d="${d}" ${st(1.1)}/>` +
        `<path d="M${f2(x + 2)} ${f2(y + 5.2)} H${f2(x + fw - 2)} M${f2(x + 2)} ${f2(y + 7.8)} H${f2(x + fw - 2)} M${f2(x + 2)} ${f2(y + 10.4)} H${f2(x + fw - 3.5)}" ${st(.75)}/>`;
    };
    xs.forEach(x => {
      s += objet(rect(x, y0, mw, mh, 1.5), C.grisObjet, 1.4, 1.2, 1);
      // écran avec sa courbe (la machine du Do), bouton de famille, feuille de procédure
      s += `<path d="${rect(x + 2, y0 + 3, mw - 4, 6, 1)}" ${st(1, C.papier)}/>`;
      s += `<path d="M${f2(x + 3.4)} ${f2(y0 + 7.4)} L${f2(x + 5.6)} ${f2(y0 + 5.2)} L${f2(x + 7.6)} ${f2(y0 + 6.4)} L${f2(x + 10)} ${f2(y0 + 4.4)}" ${st(.8, 'none', C.indigo)}/>`;
      s += `<circle cx="${f2(x + mw - 4)}" cy="${f2(yS - 5.5)}" r="1.8" ${st(.9, C.famille)}/>`;
      s += feuille(x + (mw - fw) / 2, yF);
    });
    // déploiement : du bord droit de la machine pilote vers les deux autres, en arcs au-dessus des machines
    const haut = y0 - 3, xc = i => xs[i] + mw / 2;
    s += fleche([xs[0] + mw - 2, haut], [xc(1) + 1, haut], -5, { w: 1.2, l: 4, couleur: C.indigo });
    s += fleche([xs[0] + mw - 3, haut - 2], [xc(2) + 1, haut], -12, { w: 1.2, l: 4, couleur: C.indigo });
    // Léa : la paume à plat contre le bord gauche de la feuille du pilote, la feuille reste lisible
    // Léa : la paume à plat sur le coin bas gauche de la feuille du pilote, doigts vers le haut, la feuille reste lisible
    const o = place(oL, 'paume', [Math.max(xPaume, xs[0] + (mw - fw) / 2 + 1), yPaume], W);
    s += buste('coupe-act', o, W, H);
    // « procédure » en haut à gauche ; flèche vers le haut de la feuille du pilote, à gauche des arcs
    s += texte(M - 2, 13, 'procédure', { taille: 14, couleur: C.indigo });
    s += fleche([M + 44, 10], [xs[0] + (mw - fw) / 2 + 4.5, yF - 1.5], -3, { w: 1.1, l: 4, couleur: C.indigo });
    svg.innerHTML = s;
  });
})();
