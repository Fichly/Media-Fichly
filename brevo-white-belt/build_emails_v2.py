#!/usr/bin/env python3
"""Refonte des 8 emails de nurturing White Belt, direction « Fiche Fichly » (v2).

Le fond (textes, liens et UTM, objets, preheaders) vient tel quel de la liste EMAILS de build_emails.py.
Ce script ne réécrit rien : il découpe les blocs et les met en forme (cartes, étapes en briques, exergues, étiquettes).
Il ajoute dans chaque email le bloc « Pour aller plus loin » (upsell FICHES ou GREEN BELT, textes validés mot pour mot)
et la photo de Hugo dans la signature. Ajout n° 2 du 2 octobre : salutation au prénom (balises Brevo), bandeau
« Notre formation Green Belt éligible au CPF » en haut de la feuille (ceinture verte cousue + pictogramme de la ceinture nouée),
carte « Votre formation » (rappel, E1 à E4), code de réduction WHITEBELT15 dans la carte cadeau d'E0.

Usage :
  python3 build_emails_v2.py                 aperçu : images locales, « Bonjour Camille, » à la place des balises Brevo.
                                             Écrit dans emails-v2-apercu/ (ou dans DIR avec --preview DIR), JAMAIS dans emails-v2/.
  python3 build_emails_v2.py --brevo         version à charger dans Brevo : URL de la galerie (IMAGES_BREVO), balises
                                             {% if contact.FIRSTNAME %}… de la salutation. Seul mode qui écrit emails-v2/.
  --preview DIR                              écrit les pages d'aperçu dans DIR (Poppins en local, version Arial, « Bonjour Camille, »)
Chaque lancement contrôle aussi les fichiers présents dans emails-v2/ : ni « Camille », ni chemin local, ni marqueur IMG:,
balises Brevo de la salutation présentes. Un écart fait échouer le script.

Images : le HTML porte des marqueurs « IMG:<clé> », « IMG:avatar », « IMG:logo » et « IMG:greenbelt » (pictogramme du bandeau),
remplacés à la fin par IMAGES (chemins locaux absolus pour l'aperçu) ou IMAGES_BREVO (URL de la galerie, pour l'import dans
Brevo : 11 PNG). Le pictogramme est exclu du compte « une illustration au plus ».
Illustrations : visuels/emails/src/<clé>.js, rendues par visuels/emails/src/render.py (textes ≥ 48 px, soit 13 px à 375 px).
Contrôles : le fond (EMAILS) est présent en entier (clauses) et rien n'est ajouté (multiensemble des mots du corps visible
⊂ texte EMAILS + upsell + rappel + étiquettes LABELS + fil de la série + numéros d'étapes) ; mots comptés sur le corps
visible, bandeau et pied exclus ; liens attendus = liens des blocs + bandeau + rappel + upsell + désinscription.
"""
import html
import html.parser
import importlib.util
import json
import pathlib
import re
import sys

sys.dont_write_bytecode = True
HERE = pathlib.Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("build_emails", HERE / "build_emails.py")
ce = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ce)
EMAILS = ce.EMAILS                       # même fond, mêmes liens, mêmes objets et preheaders que la v1
EM = {e["key"]: e for e in EMAILS}
KEYS = [e["key"] for e in EMAILS]

OUT = HERE / "emails-v2"
V1 = HERE / "emails"
VIS = HERE / "visuels" / "emails"
ASSETS = HERE.parent / "assets"

IMAGES = {k: str(VIS / f"{k}.png") for k in KEYS}
IMAGES["avatar"] = str(VIS / "avatar-hugo.png")
# Logo d'en-tête en 2× (192 × 110, affiché à 96 × 55) sur pastille opaque #F2F2F0 aux coins arrondis :
# invisible sur le papier en mode clair, lisible quand un client assombrit le fond sans toucher aux images.
IMAGES["logo"] = str(VIS / "logo-fichly.png")
# Pictogramme du bandeau Green Belt : ceinture verte nouée, 144 × 102 à fond transparent (3× l'affichage maximal 48 × 34),
# source visuels/emails/src/greenbelt.js (python3 visuels/emails/src/render.py greenbelt). Décoratif : alt="".
IMAGES["greenbelt"] = str(VIS / "greenbelt.png")
# URL de la galerie Brevo, à renseigner après l'import des PNG (mêmes clés que IMAGES : 8 illustrations, avatar, logo, greenbelt).
# « greenbelt » manque tant que greenbelt.png n'est pas chargé dans la galerie : --brevo s'arrête (IMAGES_BREVO incomplet).
IMAGES_BREVO = {
    "e0": "https://img.mailinblue.com/8576704/images/rnb/original/6abfca8e2331f4cc5b391a15.png",
    "e1": "https://img.mailinblue.com/8576704/images/rnb/original/6abfca9a54b05e9d6c187c1e.png",
    "e2": "https://img.mailinblue.com/8576704/images/rnb/original/6abfca9d0c32667a87f768f9.png",
    "e3": "https://img.mailinblue.com/8576704/images/rnb/original/6abfcaa054b05e9d6c187c1f.png",
    "e4-decouvrir": "https://img.mailinblue.com/8576704/images/rnb/original/6abfcabf0c32667a87f768fc.png",
    "e4-equipe": "https://img.mailinblue.com/8576704/images/rnb/original/6abfcaa72331f4cc5b391a17.png",
    "e4-formation": "https://img.mailinblue.com/8576704/images/rnb/original/6abfcaab2331f4cc5b391a18.png",
    "e4-accompagnement": "https://img.mailinblue.com/8576704/images/rnb/original/6abfcab11e05abe1505bad59.png",
    "logo": "https://img.mailinblue.com/8576704/images/rnb/original/6abfcab60c32667a87f768fb.png",
    "avatar": "https://img.mailinblue.com/8576704/images/rnb/original/6abfc3400c32667a87f76874.png",
}

def png_size(key):
    """Taille du PNG local (largeur, hauteur) : sert aux attributs width/height des balises img."""
    from PIL import Image
    with Image.open(IMAGES[key]) as im:
        return im.size

# ---------------------------------------------------------------- upsell (textes validés, mot pour mot)
UPSELL_LABEL = "Pour aller plus loin"
UPSELL = {
    "FICHES": dict(url=ce.FICHES,
                   title="Les fiches Lean de Fichly",
                   text="Nos fiches Lean rassemblent 40 outils du Lean, à ressortir avant une réunion d’équipe ou un passage en atelier.",
                   button="Voir les fiches Lean"),
    "GREEN BELT": dict(url=ce.GREENBELT,
                       title="La formation Green Belt",
                       text="Chez Fichly, l’étape suivante après la White Belt est la Green Belt. C’est une formation certifiante, éligible au CPF : le formulaire permet de demander votre inscription.",
                       button="Compléter le formulaire Green Belt"),
}
# Répartition de l'ajout n° 2 (tableau G) : jamais le bouton principal de l'email.
UPSELL_FOR = {"e0": "GREEN BELT", "e1": "FICHES", "e2": "GREEN BELT", "e3": "FICHES",
              "e4-decouvrir": "GREEN BELT", "e4-equipe": "FICHES", "e4-formation": "FICHES", "e4-accompagnement": "GREEN BELT"}

def code(key):
    """utm_content de l'email : e0 … e4."""
    return key.split("-")[0]

def upsell_url(key):
    return ce.u(UPSELL[UPSELL_FOR[key]]["url"], code(key))

# ---------------------------------------------------------------- salutation, bandeau, rappel (ajout n° 2, textes mot pour mot)
# Salutation au prénom, en langage de template Brevo (seules balises autorisées avec {{ unsubscribe }}).
# Aperçu et captures : « Bonjour Camille, » à la place du bloc.
GREETING_BREVO = "{% if contact.FIRSTNAME %}Bonjour {{ contact.FIRSTNAME }},{% else %}Bonjour,{% endif %}"
GREETING_PREVIEW = "Bonjour Camille,"
BREVO_TAGS = ["{% if contact.FIRSTNAME %}", "{{ contact.FIRSTNAME }}", "{% else %}", "{% endif %}", "{{ unsubscribe }}"]

BANNER_TEXT = "Notre formation Green Belt éligible au CPF"          # + « → »

def banner_url(key):
    """Bandeau : formulaire Green Belt, utm_content=<eN>-bandeau."""
    return ce.u(ce.GREENBELT, f"{code(key)}-bandeau")

RAPPEL_LABEL = "Votre formation"
RAPPEL_LINK = "Revoir la formation"                                 # + « → », vers ACCESS
RAPPEL = {
    "e1": "Dans la formation White Belt, vous avez vu la valeur ajoutée et les 8 gaspillages. Votre accès reste ouvert : revenez-y quand vous voulez.",
    "e2": "Dans la formation White Belt, vous avez vu les 8 gaspillages. Votre accès reste ouvert : revenez-y quand vous voulez.",
    "e3": "Dans la formation White Belt, vous avez vu la résolution de problème. Votre accès reste ouvert : revenez-y quand vous voulez.",
    "e4": "Dans la formation White Belt, vous avez vu les bases du Lean : la valeur ajoutée, les 8 gaspillages, les 5S, le standard et le management visuel, puis la résolution de problème. Votre accès reste ouvert : revenez-y quand vous voulez.",
}

def rappel_url(key):
    return ce.u(ce.ACCESS, code(key))

# ---------------------------------------------------------------- jetons
F = "Poppins,Montserrat,Arial,Helvetica,sans-serif"
BLUE, INK, TXT, MUTED = "#4A4AA0", "#23235A", "#3B3B58", "#5C5C78"
GREEN, YELLOW, RED = "#8CC978", "#E6B839", "#F16969"
PG, PGT = "#E6F3DF", "#2F5A1F"
PY = "#F8F3D9"
PR = "#FDE6E6"
PL = "#ECECF5"
CARD, LINE, STITCH = "#FDFDFB", "#E2E2EE", "#AEB0DC"
PAPER, DESK = "#F2F2F0", "#E4E4EE"
BAND = ["#F16969", "#75BEC0", "#AA76B2", "#8CC978", "#E0CF35", "#74A3D6"]
# Accent de chaque envoi (pastille de rubrique, fond de l'illustration, brique du fil de la série) : (couleur, teinte)
ACCENT = {"e0": ("#AEB0DC", "#ECECF5"), "e1": ("#75BEC0", "#E0F1F1"), "e2": ("#AA76B2", "#F2E8F3"),
          "e3": ("#74A3D6", "#E3EDF8"), "e4": ("#E6B839", "#F8F3D9")}
SERIES = ["Outil 1", "Outil 2", "Outil 3", "Et après ?"]
SERIES_ACCENT = ["e1", "e2", "e3", "e4"]

# ---------------------------------------------------------------- typographie
GROUPS = ["White Belt", "Green Belt", "Mon Compte Formation", "Gemba Walk", "Lean flash"]

NOWRAP = '<span style="white-space:nowrap;">'

def fr(t):
    """Espaces insécables françaises (build_emails.fr) + chiffre lié au mot qui suit, hors balises.
    Les mots composés à trait d'union (celle-ci, ci-dessous, a-t-elle, Montre-moi…) ne se coupent plus au trait d'union."""
    parts = re.split(r"(<[^>]+>)", ce.fr(t))
    for i, x in enumerate(parts):
        if not x.startswith("<"):
            for name in GROUPS:
                x = x.replace(name, name.replace(" ", "&nbsp;"))
            x = re.sub(r"(?<=\d) (?=[^\s\d])", "&nbsp;", x)
            if not (i and parts[i - 1] == NOWRAP):          # déjà protégé (fr appliqué deux fois)
                x = re.sub(r"(?<![\w&#])(\w+(?:-\w+)+)(?![\w;])", NOWRAP + r"\1</span>", x)
            parts[i] = x
    return "".join(parts)

def nowidow(t):
    """Lie les deux derniers mots d'un bloc."""
    i = t.rfind(" ")
    return t if i < 0 or "<" in t[i:] or ">" in t[i:] else t[:i] + " " + t[i + 1:]

def esc(u):
    return html.escape(u, quote=True)

def split(text, *cuts):
    """Coupe text juste après chaque fragment ; vérifie que rien n'est perdu ni ajouté."""
    out, rest = [], text
    for c in cuts:
        i = rest.index(c) + len(c)
        out.append(rest[:i].strip())
        rest = rest[i:]
    out.append(rest.strip())
    assert " ".join(out) == text, (out, text)
    return out

def bold(text, *frags, color=INK):
    for frag in frags:
        assert frag in text, frag
        text = text.replace(frag, f'<strong style="font-weight:700;color:{color};">{frag}</strong>', 1)
    return text

def mark(text, frag):
    """Surligné vert pastel (texte vert foncé, contraste AA)."""
    assert frag in text, frag
    return text.replace(frag, f'<span style="background-color:{PG};color:{PGT};font-weight:700;border-radius:4px;padding:0 3px;">{frag}</span>', 1)

# ---------------------------------------------------------------- briques HTML
def T(attrs=""):
    return f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"{" " + attrs if attrs else ""}>'

TW = T('width="100%"')
TB = T('class="btn"')
RAIL_T = T('width="100%" class="rail"')

def font(size, lh, weight=400, color=TXT, extra=""):
    return f"font-family:{F};font-size:{size}px;line-height:{lh}px;font-weight:{weight};color:{color};mso-line-height-rule:exactly;{extra}"

def p(t, mb=16, size=16, lh=27, color=TXT, weight=400, cls="", extra=""):
    c = f' class="{cls}"' if cls else ""
    return f'<p{c} style="margin:0 0 {mb}px 0;{font(size, lh, weight, color, extra)}">{fr(nowidow(t))}</p>'

def lead(t, mb=0):
    """Premier paragraphe utile : chapô 17/28 couleur encre."""
    return p(t, mb=mb, size=17, lh=28, color=INK)

def attack(t, mb=8):
    return p(t, mb=mb, size=18, lh=27, color=INK, weight=700)

def h2(t, mt=12, mb=12):
    return f'<h2 style="margin:{mt}px 0 {mb}px 0;{font(24, 31, 800, BLUE, "letter-spacing:-0.3px;")}">{fr(t)}</h2>'

def spacer(h):
    return f'{TW}<tr><td height="{h}" style="height:{h}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr></table>'

def bar(w, h, color, radius=None):
    r = h // 2 if radius is None else radius
    return (f'{T()}<tr><td width="{w}" height="{h}" bgcolor="{color}" style="width:{w}px;height:{h}px;background-color:{color};'
            f'border-radius:{r}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr></table>')

def chip(label, bg, color):
    """Étiquette en capitales (2 à 5 mots repris du texte)."""
    return (f'{T()}<tr><td bgcolor="{bg}" style="background-color:{bg};border-radius:999px;padding:5px 12px;'
            f'{font(12, 16, 700, color, "letter-spacing:0.6px;word-spacing:2px;text-transform:uppercase;")}">{fr(label)}</td></tr></table>')

def check_dot(size=22, bg=GREEN):
    return (f'<td width="{size}" height="{size}" align="center" valign="middle" bgcolor="{bg}" style="width:{size}px;height:{size}px;'
            f'background-color:{bg};border-radius:{size // 2}px;font-family:Arial,Helvetica,sans-serif;font-size:{size - 9}px;'
            f'line-height:{size}px;font-weight:700;color:#FFFFFF;mso-line-height-rule:exactly;">&#10003;</td>')

def pill(text, bg=PG, color=PGT, radius=999):
    """Pilule vert pastel avec coche : nomme une durée, un format, un repère."""
    return (f'{T()}<tr><td bgcolor="{bg}" style="background-color:{bg};border-radius:{radius}px;padding:6px 16px 6px 6px;">'
            f'{T()}<tr><td width="22" valign="top" style="width:22px;">{T()}<tr>{check_dot()}</tr></table></td>'
            f'<td valign="middle" style="padding:1px 0 1px 9px;{font(14, 20, 700, color)}">{fr(text)}</td></tr></table></td></tr></table>')

def pills_inline(items):
    """Pilules côte à côte qui passent à la ligne sur mobile (table fantôme pour Outlook)."""
    cells = "".join(f'<!--[if mso]><td style="padding:0 8px 8px 0;" valign="top"><![endif]-->'
                    f'<div style="display:inline-block;vertical-align:top;margin:0 6px 8px 0;">{pill(t)}</div>'
                    f'<!--[if mso]></td><![endif]-->' for t in items)
    return f'<div style="font-size:0;line-height:0;"><!--[if mso]>{T()}<tr><![endif]-->{cells}<!--[if mso]></tr></table><![endif]--></div>'

def note(text, bg=PG, color=PGT):
    """Encadré vert pastel, coche à gauche : une phrase rassurante."""
    return (f'{TW}<tr><td class="cardpad" bgcolor="{bg}" style="background-color:{bg};border-radius:16px;padding:14px 18px;">'
            f'{TW}<tr><td width="22" valign="top" style="width:22px;padding:2px 0 0 0;">{T()}<tr>{check_dot()}</tr></table></td>'
            f'<td valign="top" style="padding:0 0 0 12px;{font(15, 24, 500, color)}">{fr(nowidow(text))}</td>'
            f'</tr></table></td></tr></table>')

def callout(label, text, bg, chip_bg, chip_color=INK, color=INK, pad="18px 22px 20px 22px", gap=10):
    """Encadré pastel avec étiquette. Jaune : règle, vigilance. Vert : conseil, geste. Rouge pastel : piège, malentendu."""
    return (f'{TW}<tr><td class="cardpad" bgcolor="{bg}" style="background-color:{bg};border-radius:16px;padding:{pad};">'
            f'{chip(label, chip_bg, chip_color)}'
            f'<p style="margin:{gap}px 0 0 0;{font(16, 26, 400, color)}">{fr(nowidow(text))}</p>'
            f'</td></tr></table>')

def card(inner, bg=CARD, border=LINE, pad="24px", dashed=False):
    b = f"border:{2 if dashed else 1}px {'dashed' if dashed else 'solid'} {border};" if border else ""
    return (f'{TW}<tr><td class="cardpad" bgcolor="{bg}" style="background-color:{bg};{b}border-radius:18px;padding:{pad};">'
            f'{inner}</td></tr></table>')

def brick(label, bg=BLUE, color="#FFFFFF", w=42, size=17):
    """Brique numérotée : deux tenons + corps arrondi, en cellules de tableau."""
    s, g = 10, w - 2 * 8 - 2 * 10
    stud = (f'<td width="{s}" height="6" bgcolor="{bg}" style="width:{s}px;height:6px;background-color:{bg};border-radius:3px 3px 0 0;'
            f'font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>')
    gap = lambda x: f'<td width="{x}" height="6" style="width:{x}px;height:6px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>'
    tw = T(f'width="{w}"')
    return (f'{tw}<tr>{gap(8)}{stud}{gap(g)}{stud}{gap(8)}</tr>'
            f'<tr><td colspan="5" width="{w}" height="34" align="center" valign="middle" bgcolor="{bg}" style="width:{w}px;height:34px;'
            f'background-color:{bg};border-radius:9px;{font(size, 34, 800, color)}">{label}</td></tr></table>')

def steps_v2(items, marks=None):
    """Liste → briques numérotées alignées sur le texte, filets pointillés entre les étapes."""
    marks = marks or {}
    out = []
    for i, it in enumerate(items):
        if i:
            out.append(f'<tr><td colspan="2" style="padding:12px 0 12px 56px;">{rule(1)}</td></tr>')
        txt = mark(it, marks[i]) if i in marks else it
        out.append(f'<tr><td width="42" valign="top" style="width:42px;">{brick(i + 1)}</td>'
                   f'<td valign="top" style="padding:10px 0 0 14px;{font(16, 24, 500, INK)}">{fr(txt)}</td></tr>')
    return TW + "".join(out) + "</table>"

def tool_rows(items):
    """Lignes de carte : brique large portant le nom de l'outil, puis la condition.
    Brique de 100 px (« 5 Pourquoi » : 77 px) et retrait de 12 px : sans <style> (pas d'empilement .stk), la rangée
    tient à 320 px avec les marges en ligne (28 + 24 px de chaque côté)."""
    out = []
    for i, it in enumerate(items):
        m = re.match(r"<b>(.+?)</b>,\s*(.+)$", it)
        name, cond = m.group(1), m.group(2)
        if i:
            out.append(f'<tr><td colspan="2" style="padding:12px 0;">{rule(1)}</td></tr>')
        out.append(f'<tr><td class="stk" width="100" valign="top" style="width:100px;">{brick_wide(name, BLUE, "#FFFFFF", 100)}</td>'
                   f'<td class="stk stk-t" valign="top" style="padding:7px 0 0 12px;{font(16, 24, 500, INK)}">{fr(cond)}</td></tr>')
    return TW + "".join(out) + "</table>"

def brick_wide(label, bg, color, w=None, border=None, size=13, lh=15, cls=""):
    """Brique large (fil de la série, noms d'outils)."""
    c = f' class="{cls}"' if cls else ""
    bd = f"border:2px {border[0]} {border[1]};" if border else ""
    sbg = border[1] if border else bg
    stud = (f'<td width="12" height="6" bgcolor="{sbg}" style="width:12px;height:6px;background-color:{sbg};border-radius:3px 3px 0 0;'
            f'font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>')
    gap = '<td height="6" style="height:6px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>'
    side = '<td width="18%" height="6" style="width:18%;height:6px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>'
    wa = f'width="{w}" style="width:{w}px;"' if w else 'width="100%"'
    h = 34 - (4 if border else 0)
    return (f'{T(wa)}<tr>{side}{stud}{gap}{stud}{side}</tr>'
            f'<tr><td{c} colspan="5" height="{h}" align="center" valign="middle" bgcolor="{bg}" style="height:{h}px;background-color:{bg};{bd}border-radius:9px;'
            f'{font(size, lh, 700, color)}{"letter-spacing:-0.2px;padding:0 1px;" if cls == "rl" else "padding:0 3px;"}">{fr(label)}</td></tr></table>')

def series(current=None):
    """Fil de la série : Outil 1 · Outil 2 · Outil 3 · Et après ?, chaque brique dans la couleur de son envoi.
    current=None : aperçu (E0). Sinon : déjà envoyé = vert plein (sans coche : le fil suit les envois, pas ce que le lecteur a fait),
    en cours = teinte + contour d'accent, à venir = pointillés. Libellés en 11 px sur mobile (classe rl) : « Et après ? » tient sur une ligne."""
    cells = []
    for i, lab in enumerate(SERIES):
        acc, tint = ACCENT[SERIES_ACCENT[i]]
        label = "Et après&nbsp;?" if lab == "Et après ?" else lab.replace(" ", "&nbsp;")
        kw = dict(size=12, lh=14, cls="rl")
        if current is None:
            b = brick_wide(label, tint, INK, border=("solid", acc), **kw)
        elif i < current:
            b = brick_wide(label, GREEN, INK, **kw)
        elif i == current:
            b = brick_wide(label, tint, INK, border=("solid", acc), **kw)
        else:
            b = brick_wide(label, CARD, MUTED, border=("dashed", STITCH), **kw)
        cells.append(f'<td width="23%" valign="bottom" style="width:23%;padding:0;">{b}</td>')
        if i < len(SERIES) - 1:
            cells.append(f'<td width="8" valign="bottom" style="width:8px;padding:0 0 15px 0;">{bar(8, 4, STITCH, 0)}</td>')
    return RAIL_T + "<tr>" + "".join(cells) + "</tr></table>"

def exergue(text, mb=10):
    """Phrase clé en exergue + trait vert « souligné à la main »."""
    return (f'<p style="margin:0 0 {mb}px 0;{font(22, 31, 800, BLUE)}">{fr(nowidow(text))}</p>{bar(96, 5, GREEN)}')

def quote_left(label, text):
    """Exergue à filet vert gauche (remplace une boîte imbriquée)."""
    return (f'{TW}<tr><td style="border-left:4px solid {GREEN};padding:2px 0 2px 16px;">'
            f'<p style="margin:0 0 6px 0;{font(12, 16, 700, PGT, "letter-spacing:0.6px;word-spacing:2px;text-transform:uppercase;")}">{fr(label)}</p>'
            f'<p style="margin:0;{font(16, 26, 500, INK)}">{fr(nowidow(text))}</p></td></tr></table>')

def rule(w=2, color=STITCH):
    """Filet pointillé en cellule de tableau (Outlook ignore height:0 et font-size:0 sur un div et ajoute de l'espace)."""
    return (f'{TW}<tr><td style="border-top:{w}px dashed {color};font-size:1px;line-height:1px;mso-line-height-rule:exactly;">&nbsp;</td></tr></table>')

def stitch():
    return rule(2)

def vml_width(label, per_char, base):
    return min(520, int(round((len(html.unescape(label)) + 2) * per_char + base)))

def cta(label, url):
    """Bouton principal : bleu, semelle encre, flèche. VML pour Outlook (sans fond ni bordure carrés sur la cellule)."""
    u, w = esc(url), vml_width(label, 9, 60)
    return (f'{TB}<tr><td align="center" style="border-radius:14px;">'
            f'<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{u}" '
            f'style="height:52px;v-text-anchor:middle;width:{w}px;" arcsize="27%" stroke="f" fillcolor="{BLUE}">'
            f'<v:shadow on="t" color="{INK}" offset="0,4px"/><w:anchorlock/>'
            f'<center style="color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:bold;">{fr(label)}&nbsp;&#8594;</center></v:roundrect><![endif]-->'
            f'<!--[if !mso]><!--><a class="bg-blue on-blue" href="{u}" target="_blank" style="display:inline-block;background-color:{BLUE};'
            f'border-bottom:4px solid {INK};border-radius:14px;padding:16px 30px 14px 30px;{font(17, 22, 700, "#FFFFFF")}text-decoration:none;">'
            f'{fr(label)}&nbsp;&#8594;</a><!--<![endif]--></td></tr></table>')

def cta2(label, url, cls="btn", size=15, lh=22, pad="12px 22px", h=50, radius=14):
    """Bouton secondaire : contour bleu 2 px porté par le lien (pas de double cadre sous Outlook).
    Upsell : cls="btn2", plus petit (14 px, 44 px de haut) pour rester sous les boutons contour du corps."""
    u, w = esc(url), vml_width(label, size - 7, 50)
    arc = int(round(100 * radius / h))
    tb = T(f'class="{cls}"')
    return (f'{tb}<tr><td align="center" style="border-radius:{radius}px;">'
            f'<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{u}" '
            f'style="height:{h}px;v-text-anchor:middle;width:{w}px;" arcsize="{arc}%" strokecolor="{BLUE}" strokeweight="2px" fillcolor="{CARD}">'
            f'<w:anchorlock/><center style="color:{BLUE};font-family:Arial,Helvetica,sans-serif;font-size:{size}px;font-weight:bold;">{fr(label)}&nbsp;&#8594;</center></v:roundrect><![endif]-->'
            f'<!--[if !mso]><!--><a href="{u}" target="_blank" style="display:inline-block;background-color:{CARD};border:2px solid {BLUE};'
            f'border-radius:{radius}px;padding:{pad};{font(size, lh, 700, BLUE)}text-decoration:none;">{fr(label)}&nbsp;&#8594;</a><!--<![endif]-->'
            f'</td></tr></table>')

def illus(key, alt):
    """Illustration 1200 px : 544 px par défaut (Outlook, gouttières de 28 px), 520 px sur ordinateur, 100 % sur mobile.
    Fond teinté si l'image est bloquée."""
    tint = ACCENT[code(key)][1]
    w, h = png_size(key)
    hh = int(round(544 * h / w))          # hauteur réservée (Outlook, images bloquées) ; height:auto en CSS pour le responsive
    return (f'<img src="IMG:{key}" width="544" height="{hh}" alt="{esc(alt)}" style="display:block;width:100%;max-width:544px;height:auto;border:0;'
            f'border-radius:16px;outline:none;text-decoration:none;background-color:{tint};{font(14, 21, 500, INK)}">')

def kicker(text, accent):
    return (f'{T()}<tr><td bgcolor="{PL}" style="background-color:{PL};border-radius:999px;padding:6px 13px 6px 10px;">'
            f'{T()}<tr><td width="9" valign="middle" style="width:9px;">{bar(9, 9, accent)}</td>'
            f'<td valign="middle" style="padding:0 0 0 8px;{font(12, 16, 700, BLUE, "letter-spacing:0.6px;word-spacing:2px;text-transform:uppercase;")}">{fr(text)}</td>'
            f'</tr></table></td></tr></table>')

def title_block(e, l1, l2):
    assert f"{l1} {l2}" == e["title"], (l1, l2, e["title"])
    acc = ACCENT[code(e["key"])][0]
    ts = font(34, 42, 800, BLUE, "letter-spacing:-0.3px;")
    return (kicker(e["kicker"], acc) + spacer(18) +
            f'<div role="heading" aria-level="1">{T()}'
            f'<tr><td class="t tin" style="padding:0 10px;{ts}">{fr(l1)}</td></tr>'
            f'<tr><td style="padding:6px 0 0 0;">{T()}<tr><td class="t tfr bg-blue on-blue" bgcolor="{BLUE}" style="background-color:{BLUE};'
            f'border-radius:14px;padding:3px 10px 7px 10px;{ts.replace("color:" + BLUE, "color:#FFFFFF")}">{fr(l2)}</td></tr></table></td></tr>'
            f'</table></div>')
    # Pas de chapô : le preheader reste dans le bloc caché (aperçu de la boîte de réception), il n'est pas répété dans le corps.

def signature(close):
    """Photo ronde de Hugo à gauche de la formule de fin et du nom (marqueur IMG:avatar), centrée sur ces deux lignes :
    le trait vert est dans une seconde rangée, hors du centrage."""
    return (f'{T()}<tr>'
            f'<td width="56" valign="middle" style="width:56px;"><img src="IMG:avatar" width="56" height="56" alt="Hugo, Fichly" '
            f'style="display:block;width:56px;height:56px;border:0;border-radius:50%;outline:none;text-decoration:none;{font(11, 14, 700, BLUE)}"></td>'
            f'<td valign="middle" style="padding:0 0 0 14px;">'
            f'<p style="margin:0 0 2px 0;{font(16, 24, 400, TXT)}">{fr(nowidow(close))}</p>'
            f'<p style="margin:0;{font(18, 26, 800, BLUE)}">Hugo, Fichly</p>'
            f'</td></tr>'
            f'<tr><td width="56" style="width:56px;font-size:0;line-height:0;">&nbsp;</td><td style="padding:6px 0 0 14px;">{bar(64, 4, GREEN)}</td></tr></table>')

def upsell(key):
    """Carte secondaire « Pour aller plus loin », juste avant la signature. Pas d'image, bouton contour."""
    u = UPSELL[UPSELL_FOR[key]]
    inner = (chip(UPSELL_LABEL, PL, BLUE) +
             f'<p style="margin:12px 0 6px 0;{font(19, 26, 800, INK)}">{fr(u["title"])}</p>' +
             p(u["text"], mb=16, size=15, lh=24) +
             cta2(u["button"], upsell_url(key), cls="btn2", size=14, lh=20, pad="10px 18px", h=44, radius=12))
    return f'<!-- upsell:{UPSELL_FOR[key]} -->' + card(inner, bg=CARD, border=STITCH, pad="20px 24px 22px 24px", dashed=True) + '<!-- /upsell -->'

def salut(text):
    """Salutation : le bloc Brevo est écrit tel quel (ni fr() ni nowidow(), qui toucheraient aux balises)."""
    assert text == "Bonjour,", text
    return f'<p style="margin:0 0 16px 0;{font(16, 27, 400, TXT)}">{GREETING_BREVO}</p>'

def rappel(key):
    """Aparté « Votre formation » (E1 à E4) : ni fond ni cadre, un filet lavande à gauche (border-left, rendu par Outlook),
    étiquette 11 px, texte 14/21 gris (contraste 5,7:1 sur le papier), lien texte vers la formation en fin de paragraphe.
    Espace simple avant le lien (insécable à l'intérieur) : une espace insécable collerait « vous voulez. » au lien et
    formerait un bloc de 250 px qui laisse une ligne courte au-dessus.
    Il se lit comme une note en marge, pas comme un premier bloc de contenu : le chapô reste le texte le plus fort."""
    link = (f'<a href="{esc(rappel_url(key))}" target="_blank" style="color:{BLUE};font-weight:700;text-decoration:underline;'
            f'white-space:nowrap;">{fr(RAPPEL_LINK)}&nbsp;&#8594;</a>')
    inner = (f'<p style="margin:0 0 4px 0;{font(11, 15, 700, BLUE, "letter-spacing:0.6px;word-spacing:2px;text-transform:uppercase;")}">{fr(RAPPEL_LABEL)}</p>'
             f'<p style="margin:0;{font(14, 21, 400, MUTED)}">{fr(RAPPEL[code(key)])} {link}</p>')
    return ('<!-- rappel -->' + f'{TW}<tr><td style="background-color:transparent;border:0;border-left:3px solid {STITCH};'
            f'border-radius:0;padding:2px 0 2px 14px;">{inner}</td></tr></table>' + '<!-- /rappel -->')

def hello(key, salutation):
    """Salutation, puis l'aparté rappel (sauf E0, qui donne l'accès)."""
    return salut(salutation) + ("" if key == "e0" else rappel(key) + spacer(18))

def coupon(text):
    """Code de réduction : vrai texte sélectionnable (un appui le sélectionne en entier), grandes capitales, contour pointillé.
    Version compacte en ligne (24/32, espacement 1 px, marges 6 px) : elle tient à 320 px même quand le client ignore
    le <style> (marges mobiles .px et .cardpad absentes). Le 26 px espacé de 2 px revient sur ordinateur (min-width:621px)."""
    return (f'{TW}<tr><td class="coupon" align="center" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:2px dashed {YELLOW};'
            f'border-radius:14px;padding:13px 6px 14px 6px;">'
            f'<p style="margin:0;{font(24, 32, 800, INK, "letter-spacing:1px;")}text-rendering:geometricPrecision;-webkit-user-select:all;user-select:all;">{text}</p>'
            f'</td></tr></table>')

def code_note(text, code_):
    """Rappel du code (E4 Découvrir), collé sous le bouton des fiches qu'il motive : contour pointillé jaune comme le code
    d'E0 (le jaune signale ce qui est offert), sur papier clair ; le code en pastille jaune pastel."""
    assert code_ in text, code_
    tag = (f'<span style="white-space:nowrap;background-color:{PY};border-radius:6px;padding:2px 7px;'
           f'font-weight:800;letter-spacing:1px;color:{INK};text-rendering:geometricPrecision;">{code_}</span>')
    return (f'{TW}<tr><td class="cardpad" bgcolor="{CARD}" style="background-color:{CARD};border:2px dashed {YELLOW};border-radius:16px;padding:13px 18px;">'
            f'<p style="margin:0;{font(15, 26, 500, INK)}">{fr(nowidow(text)).replace(code_, tag, 1)}</p>'
            f'</td></tr></table>')

# Pictogramme du bandeau (visuels/emails/src/greenbelt.js, PNG 144 × 102 à fond transparent) : (largeur, hauteur) affichées.
GB_PICTO = (44, 31)        # styles en ligne : 360 à 413 px, et clients qui retirent le <style>
GB_PICTO_L = (48, 34)      # 414 px et plus (ordinateur compris), Outlook Windows
GB_PICTO_S = (40, 28)      # 341 à 359 px
GB_PICTO_XS = (36, 25)     # 340 px et moins
GB_TEXT = 12.5             # taille du texte en ligne (clients sans <style>) : une ligne dès 320 px en Arial (5 px de jeu sur la ligne,
                           # 8 px en Roboto) ; plus étroit, ou Poppins sans <style> sous 339 px : le texte passe sous le picto, centré

def banner_css():
    """Règles du bandeau dans le <style> (tailles du picto et du texte, marges), par largeur d'écran ; repris tels quels par check()."""
    gi = lambda wh: f".gb-i {{ width:{wh[0]}px !important; height:{wh[1]}px !important; }}"
    return {
        "min414": [gi(GB_PICTO_L)],
        "min621": [".gb-l { padding-left:12px !important; padding-right:12px !important; }",
                   ".gb-t { font-size:14px !important; padding-left:10px !important; }"],
        "max620": [".gb-s { margin-left:10px !important; margin-right:10px !important; }",
                   ".gb-l { padding-left:6px !important; padding-right:6px !important; }",
                   ".gb-t { font-size:13px !important; padding-left:7px !important; }"],
        "max374": [".gb-l { padding-left:5px !important; padding-right:5px !important; }",
                   ".gb-t { font-size:12.5px !important; }"],
        "max359": [gi(GB_PICTO_S), ".gb-l { padding-left:4px !important; padding-right:4px !important; }",
                   ".gb-t { font-size:12px !important; padding-left:6px !important; }"],
        "max340": [gi(GB_PICTO_XS), ".gb-l { padding-left:3px !important; padding-right:3px !important; }",
                   ".gb-t { font-size:11.5px !important; padding-left:5px !important; }"],
    }

def banner(key):
    """Bandeau Green Belt, tout en haut de la feuille : la bande est une ceinture verte cousue (fond #8CC978, coins du haut arrondis
    sur ordinateur, couture blanche en pointillé de 2 px en haut et en bas, comme belt() dans les illustrations), avec à gauche du
    texte le pictogramme de la ceinture nouée (alt="" : décoratif). Texte encre (7,4:1 sur le vert), Poppins 500, « Green Belt » en 800.
    Une seule ligne de 320 à 640 px, en Poppins comme en Arial (banner_css) :
      ordinateur (≥ 621 px)  picto 48 × 34, texte 14 px     414 à 620 px  48 × 34, 13 px     375 à 413 px  44 × 31, 13 px
      360 à 374 px           44 × 31, 12,5 px               341 à 359 px  40 × 28, 12 px     ≤ 340 px      36 × 25, 11,5 px
    Styles en ligne (clients qui retirent le <style>) : picto 44 × 31, texte 12,5 px ; une ligne dès 320 px en Arial (5 px de jeu sur
    la ligne à 320 px, 8 px en Roboto) ; plus étroit, ou police plus large (Poppins sans <style> sous 339 px), le texte passe sous
    le picto, centré. (Jeu = place restante sur la ligne, dans le padding de .gb-l ; avec <style>, au plus juste : 14,6 px en Poppins à 320 px.)
    Hauteur : 3 + 2 + 5 + picto + 5 + 2 + 3, soit 45 à 54 px (Outlook : 3 + 3 + 4 + 34 + 4 + 3 + 3 = 54 px).
    Toute la bande est cliquable (lien en bloc). Outlook Windows : tableau vert avec deux liens (pictogramme, texte) et les coutures
    en cellules (comme rule()) ; le lien du pictogramme, sans texte, sort des lecteurs d'écran et de la tabulation (aria-hidden,
    tabindex="-1") : le lien texte suffit. Sans VML (une image dans une zone de texte VML se décale selon le DPI) ; cellule du texte à hauteur
    fixe (34 px, interligne exact). Outlook.com en mode sombre : [data-ogsb] .bg-green et [data-ogsc] .on-green gardent vert et encre.
    Images bloquées : la place du pictogramme reste réservée (width/height), le texte est du vrai texte."""
    u = esc(banner_url(key))
    label = (fr(BANNER_TEXT).replace("Green&nbsp;Belt", f'<strong class="on-green" style="font-weight:800;color:{INK};">Green&nbsp;Belt</strong>', 1)
             .replace("au CPF", "au&nbsp;CPF") + "&nbsp;&#8594;")
    assert label.count("<strong") == 1 and "au&nbsp;CPF" in label, label
    (w, h), (wl, hl) = GB_PICTO, GB_PICTO_L
    img = lambda cls, pw, ph, disp: (f'<img{cls} src="IMG:greenbelt" width="{pw}" height="{ph}" alt="" style="display:{disp};'
                                     f'vertical-align:middle;width:{pw}px;height:{ph}px;border:0;outline:none;text-decoration:none;">')
    seam = ('<span class="gb-s" style="display:block;height:0;margin:0 16px;border-top:2px dashed #FFFFFF;'
            'font-size:0;line-height:0;"></span>')
    mso_seam = lambda pad: (f'<tr><td style="padding:{pad};">{TW}<tr><td style="border-top:2px dashed #FFFFFF;font-size:1px;line-height:1px;'
                            f'mso-line-height-rule:exactly;">&nbsp;</td></tr></table></td></tr>')
    mso = (f'<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">{mso_seam("3px 16px 0 16px")}'
           f'<tr><td align="center" style="padding:4px 12px;">{T()}<tr>'
           f'<td valign="middle" style="padding:0 10px 0 0;"><a href="{u}" target="_blank" aria-hidden="true" tabindex="-1">{img("", wl, hl, "block")}</a></td>'
           f'<td class="on-green" valign="middle" height="{hl}" style="height:{hl}px;font-family:Arial,Helvetica,sans-serif;font-size:14px;'
           f'line-height:18px;color:{INK};mso-line-height-rule:exactly;">'
           f'<a class="on-green" href="{u}" target="_blank" style="color:{INK};text-decoration:none;">{label}</a></td>'
           f'</tr></table></td></tr>{mso_seam("0 16px 3px 16px")}</table><![endif]-->')
    return ('<!-- bandeau -->'
            f'<tr><td class="topband bg-green" align="center" bgcolor="{GREEN}" style="background-color:{GREEN};border-radius:22px 22px 0 0;">'
            + mso +
            f'<!--[if !mso]><!--><a class="on-green" href="{u}" target="_blank" style="display:block;padding:3px 0;'
            f'{font(GB_TEXT, 18, 500, INK)}text-rendering:geometricPrecision;text-align:center;text-decoration:none;border-radius:22px 22px 0 0;">'
            f'{seam}<span class="gb-l" style="display:block;padding:5px 4px;">'
            + img(' class="gb-i"', w, h, "inline-block") +
            f'<span class="gb-t" style="display:inline-block;vertical-align:middle;padding-left:6px;">{label}</span></span>'
            f'{seam}</a><!--<![endif]--></td></tr>'
            '<!-- /bandeau -->')

def band(h=10):
    tds = "".join(f'<td width="16.66%" height="{h}" bgcolor="{c}" style="height:{h}px;background-color:{c};font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>' for c in BAND)
    return f'{TW}<tr>{tds}</tr></table>'

def row(inner, top=28, cls="px", side=28):
    return f'<tr><td class="{cls}" style="padding:{top}px {side}px 0 {side}px;">{inner}</td></tr>'

def header_row():
    """Logo sur pastille opaque (lisible en mode sombre) ; la pastille déborde de 7 px : les lettres restent alignées sur le texte."""
    w, h = (x // 2 for x in png_size("logo"))
    return (f'<tr><td class="pxl" style="padding:26px 21px 0 21px;">'
            f'<img src="IMG:logo" width="{w}" height="{h}" alt="Fichly" style="display:block;width:{w}px;height:auto;border:0;'
            f'border-radius:9px;outline:none;text-decoration:none;{font(20, 24, 700, INK)}"></td></tr>')

def title_row(e, l1, l2):
    return row(title_block(e, l1, l2), top=22, cls="pxt", side=18)   # 26 − 4 : la pastille du logo ajoute 4,5 px sous les lettres

def footer():
    s = font(12, 19, 400, MUTED)
    return (f'<p style="margin:0 0 6px 0;{font(13, 20, 700, INK)}">Fichly, le Lean accessible</p>'
            f'<p style="margin:0 0 8px 0;{s}">22 avenue Danton Demar, 34660&nbsp;Cournonterral,&nbsp;France<br>TVA FR69933450322 · APE 4791B</p>'
            f'<p style="margin:0;{s}">Vous recevez cet email suite à votre inscription à la White Belt Lean de Fichly. '
            f'<a href="{{{{ unsubscribe }}}}" style="color:{INK};font-weight:700;text-decoration:underline;">Se&nbsp;désinscrire</a></p>')

def gbcss(k):
    return "\n    ".join(banner_css()[k])

def page(e, rows):
    pre = html.escape(e["preheader"])
    return f'''<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>{html.escape(e["subject"])}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<style>body,table,td,p,a,h1,h2,span,strong,div{{font-family:Arial,Helvetica,sans-serif !important;}}</style><![endif]-->
<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;800&amp;display=swap" rel="stylesheet"><!--<![endif]-->
<style>
  body {{ margin:0; padding:0; background-color:{DESK}; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; word-break:break-word; }}
  table, td {{ mso-table-lspace:0pt; mso-table-rspace:0pt; }}
  img {{ border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }}
  a {{ color:{BLUE}; }}
  a[x-apple-data-detectors] {{ color:inherit !important; text-decoration:none !important; }}
  @media only screen and (min-width:621px) {{
    .px {{ padding-left:40px !important; padding-right:40px !important; }}
    .pxl {{ padding-left:33px !important; padding-right:33px !important; }}
    .pxt {{ padding-left:28px !important; padding-right:28px !important; }}
    .tin, .tfr {{ padding-left:12px !important; padding-right:12px !important; }}
    .t {{ font-size:40px !important; line-height:48px !important; }}
    .coupon {{ padding-left:10px !important; padding-right:10px !important; }}
    .coupon p {{ font-size:26px !important; line-height:34px !important; letter-spacing:2px !important; }}
    {gbcss("min621")}
  }}
  @media only screen and (min-width:414px) {{
    {gbcss("min414")}
  }}
  @media only screen and (max-width:620px) {{
    .outer {{ padding:0 !important; }}
    .sheet {{ border-radius:0 !important; }}
    .topband, .topband a {{ border-radius:0 !important; }}
    {gbcss("max620")}
    .px {{ padding-left:22px !important; padding-right:22px !important; }}
    .pxl {{ padding-left:15px !important; padding-right:15px !important; }}
    .pxt {{ padding-left:14px !important; padding-right:14px !important; }}
    .tin, .tfr {{ padding-left:8px !important; padding-right:8px !important; }}
    .t {{ font-size:31px !important; line-height:39px !important; }}
    .cardpad {{ padding-left:18px !important; padding-right:18px !important; }}
    .stk {{ display:block !important; width:100% !important; }}
    .stk-t {{ padding:8px 0 0 0 !important; }}
    .btn {{ width:100% !important; }}
    .btn a {{ display:block !important; padding-left:16px !important; padding-right:16px !important; }}
    .btn2 {{ width:100% !important; }}
    .btn2 a {{ display:block !important; padding:9px 16px !important; font-size:14px !important; line-height:20px !important; }}
    .rl {{ font-size:11px !important; }}
    .foot {{ padding:22px 22px 30px 22px !important; }}
  }}
  @media only screen and (max-width:374px) {{
    {gbcss("max374")}
  }}
  @media only screen and (max-width:359px) {{
    {gbcss("max359")}
  }}
  @media only screen and (max-width:340px) {{
    {gbcss("max340")}
  }}
  [data-ogsc] .on-blue {{ color:#FFFFFF !important; }}
  [data-ogsb] .bg-blue {{ background-color:{BLUE} !important; }}
  [data-ogsc] .on-green {{ color:{INK} !important; }}
  [data-ogsb] .bg-green {{ background-color:{GREEN} !important; }}
</style>
</head>
<body style="margin:0;padding:0;background-color:{DESK};">
<div style="display:none;font-size:1px;color:{DESK};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">{pre}{"&#847;&zwnj;&nbsp;" * 100}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{DESK}" style="background-color:{DESK};">
<tr><td align="center" class="outer" style="padding:28px 0 0 0;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="sheet" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{PAPER}" style="width:100%;max-width:600px;background-color:{PAPER};border-radius:22px 22px 0 0;">
{banner(e["key"])}
{rows}
<tr><td style="padding:40px 0 0 0;">{band()}</td></tr>
</table>
{FOOT_MARK}{T('width="100%" style="max-width:600px;"')}<tr><td align="center" class="foot" style="padding:26px 28px 36px 28px;">{footer()}</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>
'''

def ending(e, close, rail=True):
    """Fin commune : upsell, signature avec photo, fil de la série (sauf s'il est déjà dans le corps)."""
    rows = [row(upsell(e["key"]), top=34), row(signature(close), top=34)]
    if rail:
        rows.append(row(stitch() + spacer(22) + series(SERIES_CURRENT[e["key"]]), top=34))
    return rows

SERIES_CURRENT = {"e1": 0, "e2": 1, "e3": 2, "e4-decouvrir": 3, "e4-equipe": 3, "e4-formation": 3, "e4-accompagnement": 3}

def kinds(e, expected):
    got = [b[0] for b in e["blocks"]]
    assert got == expected, (e["key"], got)
    return e["blocks"]

# ---------------------------------------------------------------- les 8 emails
def e0():
    e = EM["e0"]; B = kinds(e, ["p", "p", "cta", "p", "h2", "p", "code", "link", "p", "p", "sig"])
    merci = bold(B[1][1], "Votre accès est prêt")
    duree, compo, rythme = split(B[3][1], "Comptez environ une heure au total.", "Lean White Belt ».")
    compo = bold(compo, "six chapitres courts", "un test de dix questions")
    assert B[4][1] == "En cadeau : 15 % sur toutes nos fiches"
    rows = [header_row(), title_row(e, "Votre formation", "est ouverte"),
            row(hello("e0", B[0][1]) + lead(merci) + spacer(24) + cta(B[2][1], B[2][2]), top=30),
            row(illus("e0", "Le parcours de la White Belt : six chapitres courts, un test de dix questions, puis votre attestation, en environ une heure."), top=40),
            row(attack(duree) + p(compo, mb=16) + note(rythme), top=22),
            row('<!-- cadeau -->' + card(chip("En cadeau", YELLOW, INK) + h2(nowidow("15 % sur toutes nos fiches")) + p(B[5][1].replace(" code :", "\u00a0code :"), mb=16)
                     + coupon(B[6][1]) + spacer(18) + cta2(B[7][1], B[7][2]), bg=PY, border=None) + '<!-- /cadeau -->', top=34),
            row(card(chip("Dans les deux semaines", BLUE, "#FFFFFF") + spacer(12) + p(B[8][1], mb=18) + series(None), bg=PL, border=None), top=20),
            ] + ending(e, B[9][1], rail=False)
    return page(e, "\n".join(rows))

def e1():
    e = EM["e1"]; B = kinds(e, ["p", "p", "ol", "p", "p", "cta", "p", "sig"])
    intro = bold(B[1][1], "un produit passe l’essentiel de son temps à attendre, et très peu à être transformé")
    ecart, regle, operateur = split(B[3][1], "votre premier chantier.", "pas sur les personnes.")
    regle = bold(regle, "le chronomètre est sur la pièce, pas sur les personnes.")
    rows = [header_row(), title_row(e, "Suivez une pièce :", "elle attend"),
            row(illus("e1", "Une pièce traverse le stock, l’en-cours, la machine et l’expédition, le chronomètre accroché à elle. Elle attend à chaque poste et n’est transformée qu’à la machine. Temps total, temps de transformation : l’écart est votre premier chantier."), top=26),
            row(hello(e["key"], B[0][1]) + lead(intro), top=30),
            row(card(pill("Un exercice de trente minutes") + spacer(20) + steps_v2(B[2][1], marks={4: "transforment réellement"})
                     + spacer(22) + stitch() + spacer(22) + exergue(ecart)), top=24),
            row(callout("Une règle", regle, PY, YELLOW) + spacer(12)
                + callout("Avec un opérateur", operateur, PG, GREEN, INK, PGT), top=22),
            row(stitch() + spacer(26) + p(B[4][1], mb=20) + cta(B[5][1], B[5][2]), top=32),
            ] + ending(e, B[6][1])
    return page(e, "\n".join(rows))

def e2():
    e = EM["e2"]; B = kinds(e, ["p", "p", "p", "ul", "p", "p", "cta", "p", "sig"])
    intro = bold(B[1][1], "Une feuille en quatre colonnes suffit")
    q_intro, question, q_after = split(B[4][1], "gardez celle-ci :", "est bonne. »")
    une_q, gemba = split(B[5][1], "depuis mon bureau ?")
    rows = [header_row(), title_row(e, "Une grille,", "quatre colonnes"),
            row(illus("e2", "Une feuille d’observation en quatre colonnes : attentes, déplacements, ruptures, retouches, avec quelques bâtons notés au poste."), top=26),
            row(hello(e["key"], B[0][1]) + lead(intro), top=30),
            row(card(pill("Trois règles") + spacer(16) + p(B[2][1], mb=18, color=INK, weight=500) + steps_v2(B[3][1])), top=24),
            row(p(q_intro, mb=10) + exergue(question) + spacer(16) + p(q_after, mb=0), top=32),
            row(callout("En repartant", une_q, PY, YELLOW), top=26),
            row(stitch() + spacer(26) + p(gemba, mb=20) + cta(B[6][1], B[6][2]), top=32),
            ] + ending(e, B[7][1])
    return page(e, "\n".join(rows))

def e3():
    e = EM["e3"]; B = kinds(e, ["p", "p", "ul", "p", "p", "p", "cta", "p", "sig"])
    intro, repere = split(B[1][1], "au choix de l’outil.")
    intro = bold(intro, "la difficulté tient souvent moins à l’outil qu’au choix de l’outil")
    avant, quoi, cest = split(B[3][1], "en une phrase :", "depuis quand, combien.")
    assert quoi == "quoi, où, depuis quand, combien."
    regle = bold(B[4][1], "quand la réponse est « erreur humaine », on continue.")
    rows = [header_row(), title_row(e, "Choisir", "le bon outil"),
            row(illus("e3", "Les quatre outils du repère : Pareto, 5 Pourquoi, Ishikawa et DMAIC."), top=26),
            row(hello(e["key"], B[0][1]) + lead(intro), top=30),
            row(card(chip(repere.rstrip(" :"), PL, BLUE) + spacer(18) + tool_rows(B[2][1])), top=24),
            row(p(avant, mb=12) + pills_inline(["Quoi", "Où", "Depuis quand", "Combien"]) + spacer(6) + p(cest, mb=0), top=30),
            row(callout("Une règle", regle, PY, YELLOW), top=26),
            row(stitch() + spacer(26) + p(B[5][1], mb=20) + cta(B[6][1], B[6][2]), top=32),
            ] + ending(e, B[7][1])
    return page(e, "\n".join(rows))

def e4_decouvrir():
    e = EM["e4-decouvrir"]; B = kinds(e, ["p", "p", "p", "cta", "p", "p", "p", "sig"])
    fiches = bold(B[2][1], "Nos fiches Lean rassemblent 40 outils du Lean")
    jeudi, numero = split(B[5][1], "notre newsletter.")
    # Illustration juste après le fil de la série : le paragraphe des fiches, le bouton et le rappel du code se suivent,
    # le code (raison de cliquer maintenant) arrive collé au bouton, sans image entre les deux.
    rows = [header_row(), title_row(e, "Garder les outils", "sous la main"),
            row(hello(e["key"], B[0][1]) + lead(B[1][1], mb=20) + series(3), top=30),
            row(illus("e4-decouvrir", "Un éventail de fiches Lean : 40 outils du Lean, à ressortir avant une réunion d’équipe ou un passage en atelier."), top=30),
            row(p(fiches, mb=20) + cta(B[3][1], B[3][2]), top=28),
            row(code_note(B[4][1], "WHITEBELT15"), top=16),
            row(card(chip("Chaque jeudi", BLUE, "#FFFFFF") + spacer(12) + p(jeudi, mb=10, color=INK, weight=500) + p(numero, mb=0), bg=PL, border=None), top=20),
            ] + ending(e, B[6][1], rail=False)
    return page(e, "\n".join(rows))

def e4_equipe():
    e = EM["e4-equipe"]; B = kinds(e, ["p", "p", "p", "link", "p", "cta", "p", "sig"])
    intro, op, man, dir_, heure, transmettre = split(B[2][1], "des malentendus :", "moins de monde »,", "et aux tableaux,", "les fera durer.", "à son rythme.")
    heure = bold(heure, "Une heure de formation commune, gratuite,")
    roles = [("L’opérateur", op), ("Le manager", man), ("La direction", dir_)]
    traps = ""
    for i, (role, txt) in enumerate(roles):
        low = role[0].lower() + role[1:]
        assert txt.startswith(low), (txt, low)
        traps += (spacer(8) if i else "") + callout(role, txt[len(low):].strip(), PR, RED, pad="14px 18px 15px 18px", gap=7)
    rows = [header_row(), title_row(e, "Embarquer", "votre équipe"),
            row(illus("e4-equipe", "L’opérateur, le manager et la direction, réunis par une même ceinture : la White Belt, une formation commune, gratuite."), top=26),
            row(hello(e["key"], B[0][1]) + lead(B[1][1]), top=30),
            row(p(intro, mb=14, color=INK, weight=500) + traps, top=26),
            row(p(heure, mb=14) + p(transmettre, mb=20) + cta2(B[3][1], B[3][2]), top=26),
            row(stitch() + spacer(26) + p(B[4][1], mb=20) + cta(B[5][1], B[5][2]), top=32),
            ] + ending(e, B[6][1])
    return page(e, "\n".join(rows))

def e4_formation():
    e = EM["e4-formation"]; B = kinds(e, ["p", "p", "p", "cta", "link", "p", "p", "sig"])
    intro = bold(B[1][1], "Chez Fichly, l’étape suivante est la Green Belt.")
    rows = [header_row(), title_row(e, "Passer à", "la Green Belt"),
            row(illus("e4-formation", "Après la White Belt, la Green Belt : une ceinture verte, une formation certifiante, éligible au CPF."), top=26),
            row(hello(e["key"], B[0][1]) + lead(intro), top=30),
            row(pills_inline(["Formation certifiante", "Éligible au CPF"]) + spacer(8) + p(B[2][1], mb=22)
                + cta(B[3][1], B[3][2]) + spacer(14) + cta2(B[4][1], B[4][2]), top=26),
            row(note(B[5][1]), top=30),
            ] + ending(e, B[6][1])
    return page(e, "\n".join(rows))

def e4_accompagnement():
    e = EM["e4-accompagnement"]; B = kinds(e, ["p", "p", "p", "cta", "p", "p", "p", "sig"])
    voir, regard = split(B[2][1], "font partie du paysage.")
    voir = bold(voir, "on finit par ne plus le voir")
    durer, a, b, c, d = split(B[4][1], "ce qui la fera durer :", "la première semaine,", "moins de chantiers,", "jusqu’au standard,")
    lst = "".join((spacer(8) if i else "") + pill(t, radius=20) for i, t in enumerate([a, b, c, d]))
    rows = [header_row(), title_row(e, "Un regard", "extérieur"),
            row(illus("e4-accompagnement", "Une loupe sur l’atelier : le stock tampon, le poste de retouche, la réunion de crise."), top=26),
            row(hello(e["key"], B[0][1]) + lead(B[1][1]), top=30),
            row(p(voir, mb=14) + p(regard, mb=20) + cta(B[3][1], B[3][2]), top=26),
            row(card(p(durer, mb=14, color=INK, weight=500) + lst), top=34),
            row(note(B[5][1]), top=20),
            ] + ending(e, B[6][1])
    return page(e, "\n".join(rows))

BUILD = {"e0": e0, "e1": e1, "e2": e2, "e3": e3, "e4-decouvrir": e4_decouvrir, "e4-equipe": e4_equipe,
         "e4-formation": e4_formation, "e4-accompagnement": e4_accompagnement}

def apply_images(src, images):
    def rep(m):
        k = m.group(1)
        if k not in images:
            raise KeyError(f"image manquante : {k}")
        return f'src="{esc(images[k])}"'
    return re.sub(r'src="IMG:([\w-]+)"', rep, src)

def apply_greeting(src, brevo):
    """--brevo : balises Brevo de la salutation ; aperçu et captures : « Bonjour Camille, »."""
    return src if brevo else src.replace(GREETING_BREVO, GREETING_PREVIEW)

FOOT_MARK = "<!-- pied -->"
BANNER_RE = re.compile(r"<!-- bandeau -->.*?<!-- /bandeau -->", re.S)

def body_text(src):
    """Texte visible du corps : ce qui précède le pied de page, sans le bandeau (kicker, titre, rappel, étiquettes, numéros,
    fil de la série, upsell, signature compris ; preheader caché, VML Outlook, bandeau et footer légal exclus).
    La salutation compte pour « Bonjour, » quel que soit le mode (balises Brevo ou prénom d'aperçu)."""
    s = BANNER_RE.sub(" ", src.split(FOOT_MARK)[0])
    return visible_text(s.replace(GREETING_BREVO, "Bonjour,").replace(GREETING_PREVIEW, "Bonjour,"))

def body_words(src):
    """Nombre de mots réellement visibles dans le corps (même découpage des mots que la v1)."""
    return len(re.findall(r"[\wÀ-ÿ’'-]+", body_text(src)))

# Ajouts de forme autorisés (en plus du fond, de l'upsell et du rappel) : étiquettes reprises du texte, qui le répètent.
# Les étiquettes qui remplacent un fragment du texte (e3 « Voici un repère simple », « Quoi / Où… » ; e4-equipe les rôles ;
# e0 « En cadeau ») ne répètent rien et ne sont donc pas listées.
LABELS = {
    "e0": ["Dans les deux semaines"],
    "e1": ["Un exercice de trente minutes", "Une règle", "Avec un opérateur"],
    "e2": ["Trois règles", "En repartant"],
    "e3": ["Une règle"],
    "e4-decouvrir": ["Chaque jeudi"],
    "e4-equipe": [],
    "e4-formation": ["Formation certifiante", "Éligible au CPF"],
    "e4-accompagnement": [],
}
STEPS = {"e1": 6, "e2": 3}          # numéros des briques d'étapes (listes numérotées)

def block_texts(e):
    """Textes du fond d'un email, bloc par bloc (listes à plat, signature « Hugo, Fichly »)."""
    out = []
    for b in e["blocks"]:
        if b[0] in ("p", "h2", "cta", "link", "code"):
            out.append(b[1])
        elif b[0] in ("ol", "ul"):
            out += b[1]
        elif b[0] == "sig":
            out.append("Hugo, Fichly")
        else:
            raise ValueError(b[0])
    return out

def rappel_texts(key):
    return [] if key == "e0" else [RAPPEL_LABEL, RAPPEL[code(key)], RAPPEL_LINK]

def allowed_tokens(key):
    """Multiensemble des mots autorisés dans le corps : fond (kicker, titre, blocs, signature), rappel, upsell,
    étiquettes, fil, numéros."""
    from collections import Counter
    e = EM[key]
    u = UPSELL[UPSELL_FOR[key]]
    texts = [e["kicker"], e["title"]] + block_texts(e) + rappel_texts(key)
    texts += [UPSELL_LABEL, u["title"], u["text"], u["button"]] + LABELS[key] + SERIES
    texts += [str(i + 1) for i in range(STEPS.get(key, 0))]
    return Counter(t for x in texts for t in tokens(x))

def expected_links(key):
    """URL attendues : boutons et liens du fond (ACCESS, LANDING, DISCOUNT… avec UTM), bandeau, rappel (E1 à E4),
    upsell du tableau G, désinscription."""
    e = EM[key]
    want = {b[2] for b in e["blocks"] if b[0] in ("cta", "link")}
    want |= {"{{ unsubscribe }}", banner_url(key), upsell_url(key)}
    if key != "e0":
        want.add(rappel_url(key))
    return want

# ---------------------------------------------------------------- contrôles
EMOJI = re.compile("[\U0001F000-\U0001FAFF\U00002600-\U000026FF\U00002700-\U000027BF\U0001F1E6-\U0001F1FF️‍]")
ALLOWED_SYMBOLS = {"✓", "→"}   # coche ✓ et flèche → (texte, pas des émojis)

def visible_text(src):
    h = re.sub(r"<!--\[if mso\]>.*?<!\[endif\]-->", " ", src, flags=re.S)
    h = re.sub(r"<(style|title|head)[^>]*>.*?</\1>", " ", h, flags=re.S)
    h = re.sub(r'<div style="display:none.*?</div>', " ", h, flags=re.S)
    h = re.sub(r'<table [^>]*aria-hidden="true".*?</table>', " ", h, flags=re.S)
    h = re.sub(r"</?(strong|b|span|a|em)\b[^>]*>", "", h)
    h = html.unescape(re.sub(r"<[^>]+>", " ", h))
    return re.sub(r"\s+", " ", h.replace(" ", " ").replace("͏", "").replace("‌", "")).strip()

def tokens(t):
    return re.findall(r"[0-9a-zà-ÿœæ’']+", html.unescape(re.sub(r"<[^>]+>", " ", t)).lower())

def clauses(t):
    return [c for c in re.split(r"[.:;?!,«»()]", html.unescape(re.sub(r"<[^>]+>", " ", t))) if tokens(c)]

def hrefs(src):
    a = re.findall(r'<a\b[^>]*\shref="([^"]+)"', src)
    v = re.findall(r'<v:(?:roundrect|rect)\b[^>]*\shref="([^"]+)"', src)
    return {html.unescape(x) for x in a}, {html.unescape(x) for x in v}

def section(src, name):
    m = re.search(rf"<!-- {name}(?::[^>]*)? -->(.*?)<!-- /{name} -->", src, flags=re.S)
    return m.group(1) if m else None

MSO_BLOCK = re.compile(r"<!--\[if mso\]>(.*?)<!\[endif\]-->", re.S)              # lu par Outlook Windows seul
NOT_MSO_BLOCK = re.compile(r"<!--\[if !mso\]><!-->(.*?)<!--<!\[endif\]-->", re.S)  # lu par tous les autres clients

def mso_view(h):
    """Ce que lit Outlook Windows : blocs [if mso] ouverts, blocs !mso retirés."""
    return MSO_BLOCK.sub(r"\1", NOT_MSO_BLOCK.sub("", h))

def other_view(h):
    """Ce que lisent les autres clients : blocs [if mso] retirés (simples commentaires), blocs !mso ouverts."""
    return NOT_MSO_BLOCK.sub(r"\1", MSO_BLOCK.sub("", h))

class _Nesting(html.parser.HTMLParser):
    """Pile des balises de structure : chaque fermeture doit répondre à la dernière ouverture, et tout doit être refermé."""
    TAGS = {"table", "tr", "td", "a", "span", "strong", "p", "div"}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.bad = [], []
    def handle_starttag(self, tag, attrs):
        if tag in self.TAGS:
            self.stack.append(tag)
    def handle_endtag(self, tag):
        if tag in self.TAGS:
            if self.stack and self.stack[-1] == tag:
                self.stack.pop()
            else:
                self.bad.append(f"</{tag}> (ouvert : {self.stack[-1] if self.stack else 'rien'})")

def nesting(h):
    """(équilibré, détail) pour un fragment HTML : pile vide et aucune fermeture inattendue."""
    n = _Nesting()
    n.feed(h)
    n.close()
    return not n.stack and not n.bad, {"non fermées": n.stack, "fermetures inattendues": n.bad}

def check(key, src, images, brevo):
    e = EM[key]
    res = {}
    vis = visible_text(src)
    vt = " " + " ".join(tokens(vis)) + " "
    miss = [c.strip() for part in block_texts(e) for c in clauses(part) if " " + " ".join(tokens(c)) + " " not in vt]
    res["fond : toutes les phrases présentes (EMAILS)"] = (not miss, miss)
    from collections import Counter
    extra = Counter(tokens(body_text(src))) - allowed_tokens(key)
    res["fond : aucun mot ajouté (corps − fond − rappel − upsell − étiquettes)"] = (not extra, dict(extra))

    # liens
    a_new, v_new = hrefs(src)
    want = expected_links(key)
    res["liens = fond + bandeau + rappel + upsell (G) + désinscription"] = (a_new == want, sorted(a_new ^ want))
    res["liens VML ⊂ liens HTML"] = (v_new <= a_new, sorted(v_new - a_new))
    stale = re.findall(r"A-REMPLACER|lean-en-1-page|Lean en 1 page|Le&nbsp;Lean&nbsp;en", src, flags=re.I)
    res["aucun lien provisoire ni « Le Lean en 1 page »"] = (not stale, stale)
    frag = [x for x in a_new if "#" in x and x != ce.CPF and "utm_content=" not in x.split("#")[0]]
    res["UTM avant le fragment # (ACCESS)"] = (not frag, frag)
    res["UTM : utm_content de l'email partout"] = (
        all(f"utm_content={code(key)}" in x for x in a_new if "utm_" in x)
        and all(x == ce.CPF or "utm_content=" in x for x in a_new if x.startswith("http")), "")

    # salutation et balises
    greet = GREETING_BREVO if brevo else GREETING_PREVIEW
    res[f"salutation ({'balises Brevo' if brevo else 'aperçu « Bonjour Camille, »'})"] = (
        src.count(greet) == 1 and "Bonjour," not in vis.replace(greet, "") and (brevo or "{%" not in src), greet)
    tags = re.findall(r"\{\{.*?\}\}|\{%.*?%\}|\{#", src)
    res["balises : FIRSTNAME (si/sinon) et {{ unsubscribe }} seules"] = (
        tags == (BREVO_TAGS if brevo else ["{{ unsubscribe }}"]), tags)

    # bandeau
    bd = section(src, "bandeau")
    sheet = src.index('class="sheet"')
    n_links = len(re.findall(r'<a\b[^>]*\shref="', bd or ""))
    mso = MSO_BLOCK.findall(bd or "")
    marks = ["<!--[if mso]>", "<!--[if !mso]><!-->", "<!--<![endif]-->", "<![endif]-->"]
    cc = [(bd or "").count(m) for m in marks]
    pos = [(bd or "").find(m) for m in ("<!--[if mso]>", "<![endif]-->", "<!--[if !mso]><!-->", "<!--<![endif]-->")]
    nest_mso, nest_other = nesting(mso_view(bd or "")), nesting(other_view(bd or ""))
    res["bandeau : commentaires conditionnels et balises équilibrés (Outlook et autres)"] = (
        bool(bd) and cc == [1, 1, 1, 2] and pos == sorted(pos) and -1 not in pos and nest_mso[0] and nest_other[0],
        {"marqueurs": dict(zip(marks, cc)), "Outlook": nest_mso[1], "autres": nest_other[1]})
    bd_ok = (bool(bd) and visible_text(bd) == BANNER_TEXT + " →" and hrefs(bd) == ({banner_url(key)}, set()) and n_links == 3)
    first = bool(bd) and "<tr" not in src[sheet:src.index("<!-- bandeau -->")] and src.index("<!-- bandeau -->") < src.index('alt="Fichly"')
    res["bandeau : texte exact, lien <eN>-bandeau (bloc + Outlook : picto et texte)"] = (bd_ok, (visible_text(bd), n_links) if bd else None)
    gb = re.findall(r"<img [^>]+>", bd or "")
    wh = lambda i: (int(re.search(r'width="(\d+)"', i).group(1)), int(re.search(r'height="(\d+)"', i).group(1)))
    gb_ok = (len(gb) == 2 and all(f'src="{esc(images["greenbelt"])}"' in i and 'alt=""' in i for i in gb)
             and sorted(map(wh, gb)) == sorted([GB_PICTO, GB_PICTO_L]))
    res["bandeau : première rangée de la feuille, au-dessus du logo, vert ceinture, coutures, picto (alt vide)"] = (
        first and gb_ok and f"background-color:{GREEN}" in bd and bd.count("border-top:2px dashed #FFFFFF") == 4
        and font(GB_TEXT, 18, 500, INK) in bd and "v:rect" not in bd
        and bd.count(f'<strong class="on-green" style="font-weight:800;color:{INK};">Green&nbsp;Belt</strong>') == 2, (len(gb), sorted(map(wh, gb))))
    mso_txt = (re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", mso[0])).replace("\xa0", " ")).strip()
               if len(mso) == 1 else None)
    res["bandeau Outlook : texte exact, tableau vert sans VML, picto 48 × 34 hors lecteur d'écran, texte à hauteur fixe"] = (
        len(mso) == 1 and mso_txt == BANNER_TEXT + " →" and f'width="{GB_PICTO_L[0]}" height="{GB_PICTO_L[1]}"' in mso[0]
        and f'<a href="{esc(banner_url(key))}" target="_blank" aria-hidden="true" tabindex="-1"><img ' in mso[0]
        and re.search(rf'<td class="on-green" valign="middle" height="{GB_PICTO_L[1]}" style="height:{GB_PICTO_L[1]}px;[^"]*'
                      r'line-height:18px;[^"]*mso-line-height-rule:exactly;', mso[0]) is not None, mso_txt)
    # cibles des règles du <style> : toutes dans le lien en bloc (toute la bande cliquable), picto gb-i en 44 × 31 hors Outlook
    nv = other_view(bd or "")
    blk = re.search(r'<a class="on-green" href="[^"]+" target="_blank" style="display:block;padding:3px 0;[^"]*">(.*)</a>', nv, flags=re.S)
    inner = blk.group(1) if blk else ""
    gi = [i for i in re.findall(r"<img [^>]+>", inner) if 'class="gb-i"' in i]
    want_cls = sorted(set(re.findall(r"\.(gb-[\w-]+)", " ".join(r for rules in banner_css().values() for r in rules))))
    res["bandeau : cibles du <style> (" + ", ".join(want_cls) + ", topband) dans le lien en bloc, picto gb-i en 44 × 31"] = (
        bool(blk) and (bd or "").count('class="gb-i"') == 1 and len(gi) == 1 and wh(gi[0]) == GB_PICTO
        and inner.count('class="gb-s"') == 2 and all(f'class="{c}"' in inner for c in want_cls)
        and (bd or "").startswith('<tr><td class="topband bg-green" '), want_cls)
    css = [r for rules in banner_css().values() for r in rules]
    res["bandeau : <style> (picto 48 × 34 dès 414 px, 40 × 28 ≤ 359 px, 36 × 25 ≤ 340 px ; Outlook.com sombre)"] = (
        all(r in src for r in css) and "@media only screen and (min-width:414px)" in src
        and "@media only screen and (max-width:359px)" in src and "@media only screen and (max-width:374px)" in src
        and "[data-ogsc] .on-green" in src and "[data-ogsb] .bg-green" in src, "")

    # rappel « Votre formation »
    rp = section(src, "rappel")
    if key == "e0":
        res["rappel : absent d'E0"] = (rp is None, "")
    else:
        rv = visible_text(rp) if rp else ""
        res["rappel : textes mot pour mot, lien ACCESS"] = (
            bool(rp) and rv == f"{RAPPEL_LABEL} {RAPPEL[code(key)]} {RAPPEL_LINK} →" and hrefs(rp)[0] == {rappel_url(key)}, rv)
        res["rappel : un seul, juste après la salutation"] = (
            src.count("<!-- rappel -->") == 1 and bool(re.search(re.escape(greet) + r"</p><!-- rappel -->", src)), "")

    # code de réduction
    n_code = vis.count("WHITEBELT15")
    if key == "e0":
        cd = section(src, "cadeau") or ""
        cv = visible_text(cd)
        res["cadeau E0 : étiquette, titre, texte, code WHITEBELT15, bouton DISCOUNT"] = (
            cv == "En cadeau 15 % sur toutes nos fiches " + EM["e0"]["blocks"][5][1] + " WHITEBELT15 Profiter de mes 15 % →"
            and hrefs(cd)[0] == {ce.u(ce.DISCOUNT, "e0")}, cv)
        res["cadeau E0 : jaune pastel, code en texte, contour pointillé"] = (
            f"background-color:{PY}" in cd and re.search(r'class="coupon"[^>]*border:2px dashed', cd) is not None
            and re.search(r">WHITEBELT15</p>", cd) is not None and n_code == 1, n_code)
    else:
        res["code WHITEBELT15 : seulement en E0 et E4 Découvrir"] = (n_code == (1 if key == "e4-decouvrir" else 0), n_code)

    # upsell
    m = re.search(r"<!-- upsell:(.+?) -->(.*?)<!-- /upsell -->", src, flags=re.S)
    kind = m.group(1) if m else None
    u = UPSELL.get(kind, {})
    up_vis = visible_text(m.group(2)) if m else ""
    up_links, _ = hrefs(m.group(2)) if m else (set(), set())
    exact = bool(m) and all(s in up_vis for s in (UPSELL_LABEL, u["title"], u["text"], u["button"]))
    res["upsell : textes mot pour mot"] = (exact, up_vis)
    main = {html.unescape(b[2]) for b in e["blocks"] if b[0] == "cta"}
    res["upsell : répartition du tableau G, jamais le bouton principal"] = (
        kind == UPSELL_FOR[key] and up_links == {upsell_url(key)} and not (up_links & main), kind)
    end, sig = src.find("<!-- /upsell -->"), src.find('alt="Hugo, Fichly"')
    res["upsell : un seul, avant la signature"] = (src.count("<!-- upsell:") == 1 and -1 < end < sig, "")

    # images
    av = re.findall(r'<img [^>]*alt="Hugo, Fichly"[^>]*>', src)
    res["avatar (alt « Hugo, Fichly », 56 × 56)"] = (len(av) == 1 and f'src="{esc(images["avatar"])}"' in av[0] and 'width="56"' in av[0] and 'height="56"' in av[0], av)
    imgs = re.findall(r"<img [^>]+>", src)
    logo = [i for i in imgs if f'src="{esc(images["logo"])}"' in i]
    res["logo (alt « Fichly », pastille 2×)"] = (len(logo) == 1 and 'alt="Fichly"' in logo[0], len(logo))
    picto = [i for i in imgs if f'src="{esc(images["greenbelt"])}"' in i]
    ill = [i for i in imgs if i not in logo and i not in picto and 'alt="Hugo, Fichly"' not in i]
    res["une illustration au plus (hors logo, avatar, picto du bandeau)"] = (len(ill) <= 1, len(ill))
    from PIL import Image
    with Image.open(IMAGES["greenbelt"]) as im:            # fichier local (aussi en --brevo : même PNG que dans la galerie)
        gsz, gmode = im.size, im.mode
    ratio = gsz[0] / gsz[1]
    res["picto du bandeau : PNG RGBA 3× de 48 × 34 (144 × 102), tailles affichées sans déformation (± 2,5 %)"] = (
        gsz == (GB_PICTO_L[0] * 3, GB_PICTO_L[1] * 3) and gmode == "RGBA"
        and all(abs(w / h / ratio - 1) <= 0.025 for w, h in (GB_PICTO, GB_PICTO_L, GB_PICTO_S, GB_PICTO_XS)), (gsz, gmode))
    res["alt sur chaque image (vide pour le picto décoratif du bandeau)"] = (
        all(re.search(r'alt="[^"]+"', i) for i in imgs if i not in picto) and all('alt=""' in i for i in picto), "")
    res["width et height sur chaque image"] = (all(re.search(r'width="\d+"', i) and re.search(r'height="\d+"', i) for i in imgs), "")
    res["marqueurs IMG: remplacés"] = ("IMG:" not in src, "")
    for i in ill:
        s = re.search(r'src="([^"]+)"', i).group(1)
        pth = pathlib.Path(html.unescape(s))
        if pth.exists():
            from PIL import Image
            w = Image.open(pth).size[0]
            res["illustration PNG 1200 px ≤ 250 Ko"] = (w == 1200 and pth.stat().st_size <= 250 * 1024, f"{w} px, {pth.stat().st_size // 1024} Ko")
        else:
            res["illustration : URL de la galerie Brevo"] = (s == images[key], s)

    # forme et règles
    emo = sorted({ch for ch in html.unescape(src) if EMOJI.match(ch) and ch not in ALLOWED_SYMBOLS})
    res["pas d'émojis"] = (not emo, emo)
    res["objet ≤ 50 caractères"] = (len(e["subject"]) <= 50, len(e["subject"]))
    n = body_words(src)
    res["corps 150–300 mots visibles (bandeau et pied exclus)"] = (150 <= n <= 300, n)
    res["objet = <title>, preheader"] = (f"<title>{html.escape(e['subject'])}</title>" in src and html.escape(e["preheader"]) in src, "")
    res["footer légal"] = (all(s in vis for s in ["Fichly, le Lean accessible", "22 avenue Danton Demar, 34660 Cournonterral, France",
                                                   "TVA FR69933450322 · APE 4791B", "Vous recevez cet email suite à votre inscription à la White Belt Lean de Fichly."]), "")
    res["signature « Hugo, Fichly »"] = ("Hugo, Fichly" in vis, "")
    res["pas de flex, grid ni position"] = (not re.search(r"display:\s*(flex|grid)|position:\s*(absolute|relative|fixed)", src), "")
    return res

def run_checks(sources, images, brevo):
    ok = True
    for key, src in sources.items():
        res = check(key, src, images, brevo)
        bad = {k: v for k, v in res.items() if not v[0]}
        ok &= not bad
        print(f"── {key:<18} {'OK' if not bad else 'ÉCART'}  ({len(res) - len(bad)}/{len(res)})")
        for k, (good, info) in res.items():
            if not good:
                print(f"     KO  {k} → {info}")
    print("CONTRÔLES :", "tout est conforme" if ok else "écarts à corriger")
    return ok

# ---------------------------------------------------------------- aperçu local
def preview(src, mode="poppins"):
    fonts = "".join(f"@font-face{{font-family:Poppins;font-weight:{w};src:url({ASSETS}/fonts/poppins-latin-{w}-normal.woff2) format('woff2')}}" for w in (400, 500, 700, 800))
    src = src.replace(GREETING_BREVO, GREETING_PREVIEW)        # aperçu et captures : prénom d'exemple
    if mode == "arial":
        src = re.sub(r'<link href="https://fonts.googleapis.com[^>]*>', "", src).replace("Poppins,Montserrat,", "")
    else:
        src = re.sub(r'<link href="https://fonts.googleapis.com[^>]*>', f"<style>{fonts}</style>", src)
    return src

APERCU = HERE / "emails-v2-apercu"          # aperçu par défaut (hors Git) : emails-v2/ ne reçoit que la version Brevo
LOCAL_PATH = re.compile(r"/home/|/tmp/|/Users/|file:|[A-Za-z]:\\\\")

def check_brevo_folder():
    """Garde-fou sur les fichiers réellement présents dans emails-v2/ (ceux qu'on charge dans Brevo), quel que soit le mode :
    les 8 emails et meta.json, rien d'autre ; ni « Camille », ni chemin local, ni marqueur IMG: ; balises Brevo présentes."""
    bad = []
    want = {f"{k}.html" for k in KEYS} | {"meta.json"}
    have = {x.name for x in OUT.iterdir()} if OUT.exists() else set()
    if have != want:
        bad.append(f"fichiers : en trop {sorted(have - want)}, manquants {sorted(want - have)}")
    for k in KEYS:
        f = OUT / f"{k}.html"
        if not f.exists():
            continue
        s = f.read_text(encoding="utf-8")
        if GREETING_PREVIEW in s or "Camille" in s:
            bad.append(f"{k} : « Camille » (version d'aperçu)")
        if LOCAL_PATH.search(s):
            bad.append(f"{k} : chemin local {LOCAL_PATH.search(s).group(0)!r}")
        if "IMG:" in s:
            bad.append(f"{k} : marqueur IMG: non remplacé")
        if s.count(GREETING_BREVO) != 1 or "{{ unsubscribe }}" not in s:
            bad.append(f"{k} : balises Brevo (salutation, désinscription) absentes")
    m = OUT / "meta.json"
    if m.exists():
        ms = m.read_text(encoding="utf-8")
        if LOCAL_PATH.search(ms) or "Camille" in ms:
            bad.append("meta.json : chemin local ou « Camille »")
    print(f"── emails-v2/ (à charger dans Brevo) {'OK' if not bad else 'ÉCART'}")
    for b in bad:
        print(f"     KO  {b}")
    return not bad

def main(argv):
    brevo = "--brevo" in argv
    images = dict(IMAGES)
    if brevo:
        missing = [k for k in images if k not in IMAGES_BREVO]
        if missing:
            sys.exit(f"IMAGES_BREVO incomplet : {', '.join(missing)}")
        images = dict(IMAGES_BREVO)
    pdir = pathlib.Path(argv[argv.index("--preview") + 1]) if "--preview" in argv else (None if brevo else APERCU)
    out = OUT if brevo else pdir
    print("MODE :", "Brevo (galerie Brevo, balises de salutation) → emails-v2/" if brevo
          else f"aperçu (images locales, « Bonjour Camille, ») → {pdir} (emails-v2/ n'est pas touché)")
    sources, meta = {}, []
    for e in EMAILS:
        k = e["key"]
        sources[k] = src = apply_greeting(apply_images(BUILD[k](), images), brevo)
        meta.append({"clé": k, "nom": e["name"], "objet": e["subject"], "preheader": e["preheader"], "mots": body_words(src),
                     "image": images[k], "avatar": images["avatar"], "logo": images["logo"], "upsell": UPSELL_FOR[k],
                     "bandeau": banner_url(k), "rappel": k != "e0",
                     "salutation": "balises Brevo" if brevo else "aperçu (Bonjour Camille,)",
                     "fichier": f"{out.name}/{k}.html"})
    out.mkdir(parents=True, exist_ok=True)
    if brevo:
        for k, src in sources.items():
            (OUT / f"{k}.html").write_text(src, encoding="utf-8")
    (out / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    if pdir:
        pdir.mkdir(parents=True, exist_ok=True)
        for k, src in sources.items():
            (pdir / f"{k}.html").write_text(preview(src), encoding="utf-8")
            (pdir / f"{k}-arial.html").write_text(preview(src, "arial"), encoding="utf-8")
    for m in meta:
        print(f"{m['clé']:<18} {m['mots']:>4} mots · objet {len(m['objet']):>2} car. · upsell {m['upsell']:<10} · {m['objet']}")
    ok = run_checks(sources, images, brevo)
    ok &= check_brevo_folder()
    return 0 if ok else 1

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
