// Pictogramme du bandeau « Notre formation Green Belt éligible au CPF → » : la ceinture verte nouée (bande, nœud carré, deux pans).
// Mêmes signes que belt() (common.js) : vert #8CC978, contour encre, coutures blanches en pointillé. Dessiné pour la petite taille,
// pas réduit de la grande ceinture d'E4 : unités = pixels affichés à 48 × 34 (ordinateur, Outlook, mobile dès 414 px ; 44 × 31,
// 40 × 28 et 36 × 25 sur les écrans plus étroits), rendu 3× (144 × 102) sur fond transparent : python3 render.py greenbelt.
// Silhouette d'environ 1,7:1 : bande épaisse (9,6 px) et arquée (creux de 3,2 px au nœud), gros nœud carré (13,8 × 13,4), une seule
// couture par pièce (une par bras de la bande, une dans le nœud, une par pan), deux pans en V renversé : une ceinture nouée, pas un
// nœud papillon (bras droits et cousus, pans qui pendent). Liseré blanc (« autocollant ») de 1,5 px autour de la silhouette : elle se détache sur le bandeau du même vert et reste
// lisible si un client assombrit le fond sans toucher aux images.
// Coutures : trait de 1,3 px, chaque couture finit sur un tiret entier (longueur du tiret calculée sur la longueur réelle du tracé,
// écart fixe de 1,9 px) : deux tirets par bras, deux dans le nœud, un seul tiret centré par pan (trop court pour deux). Tirets d'au
// moins 2,4 px (garde-fou) : à 1× (ordinateur à 100 %, Outlook), chacun couvre au moins deux pixels pleins et reste un tiret blanc.
// Marge transparente en haut (la silhouette commence à y ≈ 6) : l'image est centrée sur le texte (vertical-align:middle,
// valign="middle"), dont le milieu des capitales tombe à 48 % de sa hauteur ; le centre du nœud (KY = 16,4 / 34) s'y place,
// les bras de la bande encadrent le texte à mi-hauteur et les pans descendent sous la ligne. Marge latérale de 0,5 px au-delà du
// liseré : la première et la dernière colonne du PNG restent entièrement transparentes.
start(() => {
  const W = 48, H = 34, K = 3;
  S.setAttribute('width', W * K); S.setAttribute('height', H * K); S.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const SW = 1.6, HALO = 1.5;                        // contour encre, liseré blanc au-delà du contour
  const L = 2.8, R = W - L, KX = W / 2, KY = 16.4;   // bande de L à R ; centre du nœud (milieu des capitales du texte)
  const th = 9.6, sag = 3.2;                         // épaisseur de la bande, creux de l'arc au nœud
  const kw = 13.8, kh = 13.4, tw = 7;                // nœud, largeur des pans
  const SEAM = 1.3, GAP = 1.9, DMIN = 2.4;           // coutures : épaisseur, écart entre tirets, tiret minimal
  const yAt = x => { const u = (x - KX) / ((R - L) / 2); return KY - sag * u * u };   // axe de la bande
  const arc = (x0, x1) => { const xm = (x0 + x1) / 2, y0 = yAt(x0), y1 = yAt(x1); return `M ${x0} ${y0} Q ${xm} ${2 * yAt(xm) - (y0 + y1) / 2} ${x1} ${y1}` };
  const pieces = [];                                 // [forme, [[couture, nombre de tirets], …]] dans l'ordre de pose : pans, bande, nœud
  const tail = (dx, ang) => {                        // pan accroché sous le nœud, longueur calculée pour finir au bas de la boîte
    const cx = KX + dx, y0 = KY + 1.4, a = Math.abs(ang) * Math.PI / 180;
    const len = (H - SW / 2 - HALO - 0.1 - y0 - (tw / 2) * Math.sin(a)) / Math.cos(a), g = {transform: `rotate(${ang} ${cx} ${y0})`};
    const ym = (KY + kh / 2 + 1.6 + y0 + len - 2.2) / 2;   // milieu de la partie visible du pan, sous le nœud
    pieces.push([['rect', {x: cx - tw / 2, y: y0, width: tw, height: len, rx: 1.5}, g],
                 [[['path', {d: `M ${cx} ${ym - 1.4} V ${ym + 1.4}`}, g], 1]]]);
  };
  tail(-2.4, 26); tail(2.6, -21);
  const yE = KY - sag, yC = KY + sag;                // quadratique : extrémités à KY - sag, milieu à KY
  pieces.push([['path', {d: `M ${L} ${yE - th / 2} Q ${KX} ${yC - th / 2} ${R} ${yE - th / 2} L ${R} ${yE + th / 2} Q ${KX} ${yC + th / 2} ${L} ${yE + th / 2} Z`}, null],
               [[['path', {d: arc(L + 2.6, KX - kw / 2 - 2.2)}, null], 2], [['path', {d: arc(KX + kw / 2 + 2.2, R - 2.6)}, null], 2]]]);
  const kg = {transform: `rotate(-5 ${KX} ${KY})`};
  pieces.push([['rect', {x: KX - kw / 2, y: KY - kh / 2, width: kw, height: kh, rx: 2.6}, kg],
               [[['path', {d: `M ${KX} ${KY - kh / 2 + 2.6} V ${KY + kh / 2 - 2.6}`}, kg], 2]]]);
  const put = ([tag, a, g], extra, parent) => el(tag, {...a, ...extra}, g ? el('g', g, parent) : parent);
  const root = el('g', {});
  // 1. liseré blanc sous toute la silhouette ; 2. pièces : remplissage vert, contour encre, coutures blanches à tirets entiers
  for (const [shape] of pieces) put(shape, {fill: C.white, stroke: C.white, 'stroke-width': SW + 2 * HALO, 'stroke-linejoin': 'round'}, root);
  for (const [shape, seams] of pieces) {
    put(shape, {fill: C.green, stroke: C.ink, 'stroke-width': SW, 'stroke-linejoin': 'round'}, root);
    for (const [s, n] of seams) {
      const node = put(s, {fill: 'none', stroke: C.white, 'stroke-width': SEAM, 'stroke-linecap': 'butt'}, root);
      const d = (node.getTotalLength() - (n - 1) * GAP) / n;            // n tirets de longueur d, n − 1 écarts : finit sur un tiret
      if (n > 1) node.setAttribute('stroke-dasharray', `${d.toFixed(3)} ${GAP}`);
      if (d < DMIN) errs.push(`tiret de couture trop court : ${d.toFixed(2)} px`);
    }
  }
  // Garde-fou : la silhouette (contour et liseré compris) tient dans la boîte
  const b = root.getBBox(), m = SW / 2 + HALO;
  if (b.x - m < -0.05 || b.y - m < -0.05 || b.x + b.width + m > W + 0.05 || b.y + b.height + m > H + 0.05) errs.push('déborde ' + JSON.stringify(b));
});
