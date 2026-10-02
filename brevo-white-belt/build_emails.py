# Génère les 8 templates de nurturing White Belt (HTML email, 600 px, charte Fichly).
import json, html, re, pathlib

OUT = pathlib.Path(__file__).parent / "emails"
UTM = "utm_source=brevo&utm_medium=email&utm_campaign=white-belt-nurturing&utm_content={}"

def u(url, code):
    return f"{url}{'&' if '?' in url else '?'}{UTM.format(code)}"

ACCESS = "https://www.fichly.com/A-REMPLACER/acces-white-belt"
LEAN1P = "https://www.fichly.com/A-REMPLACER/lean-en-1-page"
LANDING = "https://www.fichly.com/A-REMPLACER/landing-white-belt"
VSM = "https://www.fichly.com/blogs/nos-articles/value-stream-mapping-definition-et-etapes"
GEMBA = "https://www.fichly.com/blogs/nos-articles/gemba-walk-tournee-atelier-methode"
ISHIKAWA = "https://www.fichly.com/blogs/nos-articles/diagramme-ishikawa-6m-methode-exemple"
FICHES = "https://www.fichly.com/products/fiches-lean"
PLAQUETTE = "https://tally.so/r/wQZ8d7"
GREENBELT = "https://tally.so/r/eqPKOk"
# Lien CPF conservé tel quel : la « query string » est dans le fragment et porte l'identifiant de la formation.
CPF = "https://www.moncompteformation.gouv.fr/espace-prive/html/#/formation/recherche/93345032200013_GB-LEAN-FICHLY/93345032200013_GB-LEAN-FICHLY-DIST?contexteFormation=ACTIVITE_PROFESSIONNELLE"
AUDIT = "https://fichly-audit-flash.lovable.app/"

LOGO = "https://img.mailinblue.com/8576704/images/content_library/original/6a671086515d467bab2fcaef.png"
F = "Montserrat,Arial,Helvetica,sans-serif"

# Blocs : ("p", texte) · ("h2", texte) · ("ol"/"ul", [items]) · ("cta", libellé, url) · ("link", libellé, url) · ("sig",)
EMAILS = [
  dict(key="e0", name="WB · E0 · Accès", subject="Votre accès à la White Belt Lean",
       preheader="Six chapitres courts, un test final, et une fiche offerte.",
       kicker="White Belt Lean · Bienvenue", title="Votre formation est ouverte",
       blocks=[
         ("p", "Bonjour,"),
         ("p", "Merci pour votre inscription à la White Belt Lean. Votre accès est prêt : le bouton ci-dessous ouvre la formation, et vous pouvez garder cet email pour y revenir à tout moment."),
         ("cta", "Ouvrir ma formation", u(ACCESS, "e0")),
         ("p", "Comptez environ une heure au total. La formation se compose de six chapitres courts, chacun avec une vidéo commentée, un exercice interactif et deux questions, puis d’un test de dix questions qui débouche sur votre attestation « Introduction aux bases du Lean - Lean White Belt ». Rien ne vous oblige à tout faire d’une traite : vous pouvez avancer en plusieurs fois."),
         ("h2", "En cadeau : le Lean en 1 page"),
         ("p", "Avec votre accès, nous vous offrons la fiche « Le Lean en 1 page ». Elle ramène les fondamentaux à six questions, de la valeur que le client paie vraiment jusqu’à la place laissée aux équipes sur leur poste. Posez-les sur un atelier que vous connaissez : celle à laquelle personne ne sait répondre clairement est votre point de départ."),
         ("link", "Télécharger la fiche « Le Lean en 1 page »", u(LEAN1P, "e0")),
         ("p", "Dans les deux semaines qui viennent, vous recevrez quatre emails courts : trois outils simples à tester sur le terrain, puis une suggestion pour la suite, selon ce que vous attendez de la formation."),
         ("p", "Bonne formation,"), ("sig",),
       ]),
  dict(key="e1", name="WB · E1 · J+2 · Suivre un flux", subject="Suivre un produit en 30 minutes",
       preheader="Un exercice à faire cette semaine, chronomètre en main.",
       kicker="White Belt Lean · Outil 1 sur 3", title="Suivez une pièce : elle attend",
       blocks=[
         ("p", "Bonjour,"),
         ("p", "Les chapitres sur la valeur ajoutée et les 8 gaspillages reposent sur une idée simple : dans l’usine, un produit passe l’essentiel de son temps à attendre, et très peu à être transformé. Le plus parlant est de le vérifier chez vous, avec un exercice de trente minutes."),
         ("ol", ["Choisissez une référence courante.",
                 "Partez de son point d’entrée dans l’atelier.",
                 "Notez chaque étape qu’elle traverse.",
                 "Estimez la durée de chacune.",
                 "Marquez les étapes qui transforment réellement le produit.",
                 "Additionnez le temps total, puis le temps de transformation."]),
         ("p", "L’écart entre les deux totaux est votre premier chantier. Gardez une règle en tête pendant tout l’exercice : le chronomètre est sur la pièce, pas sur les personnes. Si vous le pouvez, faites-le avec un opérateur du poste : l’observation devient alors partagée."),
         ("p", "Si vous voulez ensuite étendre la démarche à toute une chaîne de valeur, la cartographie des flux (VSM) suit exactement la même logique."),
         ("cta", "Lire l’article sur la VSM", u(VSM, "e1")),
         ("p", "Bonne observation,"), ("sig",),
       ]),
  dict(key="e2", name="WB · E2 · J+5 · Grille d'observation", subject="Observer un poste en quatre colonnes",
       preheader="Attentes, déplacements, ruptures, retouches, et trois règles pour bien observer.",
       kicker="White Belt Lean · Outil 2 sur 3", title="Une grille, quatre colonnes",
       blocks=[
         ("p", "Bonjour,"),
         ("p", "Après le suivi d’un produit, place à l’observation d’un poste. Une feuille en quatre colonnes suffit : attentes, déplacements, ruptures, retouches. Ce sont les gaspillages vus dans la formation qui se repèrent le mieux quand on reste au poste."),
         ("p", "Trois règles font la différence entre une observation utile et une inspection :"),
         ("ul", ["prévenez l’équipe, et observez le travail, pas la personne ;",
                 "notez ce que vous voyez, pas ce que vous en pensez ;",
                 "montrez la grille à l’opérateur avant de partir."]),
         ("p", "Et si vous ne deviez poser qu’une question au poste, gardez celle-ci : « Montre-moi comment tu sais que ta pièce est bonne. » Elle fait montrer le travail plutôt que chercher un responsable."),
         ("p", "En repartant, posez-vous une question : est-ce que je repars avec quelque chose que je n’aurais pas pu apprendre depuis mon bureau ? Ces observations sont le cœur d’une tournée terrain bien menée, ce que l’on appelle un Gemba Walk. Notre article explique comment la préparer et la conduire."),
         ("cta", "Lire l’article sur le Gemba Walk", u(GEMBA, "e2")),
         ("p", "Bonne observation,"), ("sig",),
       ]),
  dict(key="e3", name="WB · E3 · J+9 · Quel outil", subject="Quel outil pour quel problème ?",
       preheader="Pareto, 5 Pourquoi, Ishikawa ou DMAIC : une phrase suffit pour choisir.",
       kicker="White Belt Lean · Outil 3 sur 3", title="Choisir le bon outil",
       blocks=[
         ("p", "Bonjour,"),
         ("p", "Le dernier chapitre de la White Belt porte sur la résolution de problème. Sur le terrain, la difficulté tient souvent moins à l’outil qu’au choix de l’outil. Voici un repère simple :"),
         ("ul", ["<b>Pareto</b>, quand les problèmes sont nombreux et qu’aucune priorité ne se dégage ;",
                 "<b>5 Pourquoi</b>, pour un problème précis dont la cause est probablement unique ;",
                 "<b>Ishikawa</b>, pour un problème précis aux causes possibles multiples ;",
                 "<b>DMAIC</b>, pour un problème complexe, chronique et coûteux."]),
         ("p", "Avant de choisir, décrivez le problème en une phrase : quoi, où, depuis quand, combien. C’est cette phrase qui oriente le choix de l’outil, et elle évite de lancer une analyse sur un problème mal posé."),
         ("p", "Si vous utilisez les 5 Pourquoi, gardez une règle : quand la réponse est « erreur humaine », on continue. Pourquoi l’erreur a-t-elle été possible ? Pourquoi n’a-t-elle pas été détectée ?"),
         ("p", "Pour mettre en pratique le troisième cas, notre article sur le diagramme d’Ishikawa déroule la méthode des 6 M avec un exemple rempli."),
         ("cta", "Lire l’article sur Ishikawa", u(ISHIKAWA, "e3")),
         ("p", "À bientôt,"), ("sig",),
       ]),
  dict(key="e4-decouvrir", name="WB · E4 · J+14 · Découvrir", subject="Et après la White Belt ?",
       preheader="Une suite simple pour garder les outils du Lean sous la main.",
       kicker="White Belt Lean · Et après ?", title="Garder les outils sous la main",
       blocks=[
         ("p", "Bonjour,"),
         ("p", "Il y a deux semaines, vous avez ouvert la White Belt. Ce dernier email de la série a un seul objectif : vous proposer une suite utile, à votre rythme."),
         ("p", "Pour continuer à découvrir le Lean, le plus efficace est d’avoir les outils à portée de main au moment où une situation se présente sur le terrain. Nos fiches Lean rassemblent 40 outils du Lean, à ressortir avant une réunion d’équipe ou un passage en atelier."),
         ("cta", "Découvrir les fiches Lean", u(FICHES, "e4")),
         ("p", "Si vous avez gardé la fiche « Le Lean en 1 page », c’est aussi le bon moment pour reposer ses six questions sur votre atelier. Celle qui reste sans réponse claire vous indique par où continuer."),
         ("p", "Et chaque jeudi, L’Atelier de Fichly, notre newsletter, revient sur un fondamental du terrain : les gaspillages, l’observation, la résolution de problème, les standards. Si vous ne la recevez pas encore et souhaitez vous y abonner, répondez simplement « Atelier » à cet email."),
         ("p", "Merci d’avoir suivi ces quelques emails,"), ("sig",),
       ]),
  dict(key="e4-equipe", name="WB · E4 · J+14 · Équipe", subject="Poser un langage commun avec votre équipe",
       preheader="Faire suivre la White Belt, puis aller plus loin avec la formation intra.",
       kicker="White Belt Lean · Et après ?", title="Embarquer votre équipe",
       blocks=[
         ("p", "Bonjour,"),
         ("p", "À votre inscription, vous nous avez dit vouloir lancer une démarche avec votre équipe. Vous avez ouvert la White Belt il y a deux semaines : la suite la plus utile est sans doute de la faire suivre à votre équipe."),
         ("p", "Beaucoup de démarches butent dès le départ sur des malentendus : l’opérateur entend « faire plus avec moins de monde », le manager croit que le Lean se résume au 5S et aux tableaux, la direction lance des chantiers sans savoir ce qui les fera durer. Une heure de formation commune, gratuite, pose les mêmes mots pour tout le monde, et chacun peut la suivre à son rythme. Il vous suffit de leur transmettre la page d’inscription."),
         ("link", "Partager la page d’inscription à la White Belt", u(LANDING, "e4")),
         ("p", "Pour aller plus loin, nous formons aussi les équipes en formation intra, organisée pour votre entreprise. La plaquette de formation présente notre offre."),
         ("cta", "Recevoir la plaquette formation", u(PLAQUETTE, "e4")),
         ("p", "Bonne suite,"), ("sig",),
       ]),
  dict(key="e4-formation", name="WB · E4 · J+14 · Formation", subject="Après la White Belt, la Green Belt",
       preheader="Une formation certifiante, éligible au CPF.",
       kicker="White Belt Lean · Et après ?", title="Passer à la Green Belt",
       blocks=[
         ("p", "Bonjour,"),
         ("p", "À votre inscription, vous nous avez dit vouloir vous former ou vous certifier. La White Belt vous a donné un vocabulaire commun et une première méthode : repérer la valeur, voir les gaspillages, choisir un outil face à un problème. Chez Fichly, l’étape suivante est la Green Belt."),
         ("p", "C’est une formation certifiante, éligible au CPF : vous pouvez donc la financer avec vos droits à la formation. Le formulaire ci-dessous permet de demander votre inscription, et la fiche de la formation est consultable sur Mon Compte Formation."),
         ("cta", "Accéder au formulaire Green Belt", u(GREENBELT, "e4")),
         ("link", "Voir la formation sur Mon Compte Formation", CPF),
         ("p", "Rien ne presse : si vous n’avez pas encore terminé la White Belt, prenez le temps d’aller jusqu’au test final. Et si vous avez une question avant de vous décider, sur le programme ou sur le financement, il vous suffit de répondre à cet email."),
         ("p", "Bonne suite,"), ("sig",),
       ]),
  dict(key="e4-accompagnement", name="WB · E4 · J+14 · Accompagnement", subject="Un regard extérieur sur votre site",
       preheader="L’audit Lean flash, une première étape pour faire accompagner votre site.",
       kicker="White Belt Lean · Et après ?", title="Un regard extérieur",
       blocks=[
         ("p", "Bonjour,"),
         ("p", "À votre inscription, vous nous avez dit vouloir faire accompagner votre site. Vous avez ouvert la White Belt il y a deux semaines ; voici la première étape que nous proposons lorsqu’un site souhaite être accompagné."),
         ("p", "Un gaspillage qu’on a organisé, on finit par ne plus le voir : le stock tampon, le poste de retouche ou la réunion de crise hebdomadaire font partie du paysage. Un regard extérieur aide à les remettre en question. C’est l’objet de l’audit Lean flash : porter un regard extérieur sur votre site."),
         ("cta", "Découvrir l’audit Lean flash", u(AUDIT, "e4")),
         ("p", "Et si vous lancez une démarche, gardez en tête ce qui la fera durer : des managers qui animent dès la première semaine, moins de chantiers, chacun mené jusqu’au standard, et des indicateurs utiles à l’équipe."),
         ("p", "Rien ne presse : si vous préférez d’abord en parler, il vous suffit de répondre à cet email."),
         ("p", "Bonne suite,"), ("sig",),
       ]),
]

def fr(t):
    # Espaces insécables de la typographie française (hors balises et URL)
    parts = re.split(r"(<[^>]+>)", t)
    for i, x in enumerate(parts):
        if not x.startswith("<"):
            x = x.replace("« ", "«&nbsp;").replace(" »", "&nbsp;»")
            x = re.sub(r" ([:;?])", r"&nbsp;\1", x)
            parts[i] = x
    return "".join(parts)

def p(t, extra=""):
    return f'<p style="margin:0 0 14px 0;font-family:{F};font-size:16px;line-height:26px;color:#4A4A4A;{extra}">{fr(t)}</p>'

def block_html(b):
    k = b[0]
    if k == "p":
        return p(b[1])
    if k == "h2":
        return f'<h2 style="margin:22px 0 10px 0;font-family:{F};font-size:20px;line-height:28px;font-weight:700;color:#3C4399;">{fr(b[1])}</h2>'
    if k in ("ol", "ul"):
        items = "".join(f'<li style="margin:0 0 6px 0;font-family:{F};font-size:16px;line-height:24px;color:#4A4A4A;">{fr(i)}</li>' for i in b[1])
        return f'<{k} style="margin:0 0 16px 0;padding:0 0 0 24px;">{items}</{k}>'
    if k == "cta":
        label, url = b[1], html.escape(b[2], quote=True)
        return (f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:6px 0 20px 0;"><tr>'
                f'<td align="center" style="border-radius:10px;background-color:#3C4399;">'
                f'<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{url}" style="height:50px;v-text-anchor:middle;width:320px;" arcsize="20%" stroke="f" fillcolor="#3C4399"><w:anchorlock/><center style="color:#FFFFFF;font-family:{F};font-size:16px;font-weight:bold;">{label} &#8594;</center></v:roundrect><![endif]-->'
                f'<!--[if !mso]><!--><a href="{url}" target="_blank" style="display:inline-block;padding:15px 30px;font-family:{F};font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none;line-height:20px;border-radius:10px;">{label} &#8594;</a><!--<![endif]-->'
                f'</td></tr></table>')
    if k == "link":
        label, url = b[1], html.escape(b[2], quote=True)
        return p(f'<a href="{url}" target="_blank" style="color:#3C4399;font-weight:700;text-decoration:underline;">{label} &#8594;</a>')
    if k == "sig":
        return p("Hugo, Fichly", "font-weight:700;color:#3C4399;")
    raise ValueError(k)

def render(e):
    body = "\n".join(block_html(b) for b in e["blocks"])
    pre = html.escape(e["preheader"])
    return f'''<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><title>{html.escape(e["subject"])}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
  body {{ margin:0; padding:0; background-color:#F2F2F2; -webkit-text-size-adjust:100%; word-break:break-word; }}
  a {{ color:#3C4399; }}
  @media only screen and (max-width:620px) {{
    .px {{ padding-left:20px !important; padding-right:20px !important; }}
    .h1 {{ font-size:24px !important; line-height:1.25 !important; }}
  }}
</style></head>
<body style="margin:0;padding:0;background-color:#F2F2F2;">
<div style="display:none;font-size:1px;color:#F2F2F2;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">{pre}{"&#847; &zwnj; &nbsp; " * 20}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F2F2F2;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#FFFFFF;border-radius:16px;overflow:hidden;">
<tr><td align="center" class="px" style="padding:28px 32px 0 32px;"><img src="{LOGO}" width="96" alt="Fichly" style="display:block;width:96px;height:auto;border:0;"></td></tr>
<tr><td class="px" style="padding:18px 32px 0 32px;"><div style="border-top:1px solid #3C4399;font-size:0;line-height:0;">&nbsp;</div></td></tr>
<tr><td class="px" style="padding:20px 32px 0 32px;">
<p style="margin:0 0 8px 0;font-family:{F};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#F16969;">{e["kicker"]}</p>
<h1 class="h1" style="margin:0 0 20px 0;font-family:{F};font-size:28px;line-height:36px;font-weight:700;letter-spacing:-0.01em;color:#3C4399;">{fr(e["title"])}</h1>
{body}
</td></tr>
<tr><td style="padding:12px 0 0 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#2C2C2C;"><tr><td class="px" style="padding:26px 32px;">
<p style="margin:0 0 10px 0;font-family:{F};font-size:14px;font-weight:700;color:#FFFFFF;line-height:20px;">Fichly, le Lean accessible</p>
<p style="margin:0 0 10px 0;font-family:{F};font-size:12px;color:#A8A8A8;line-height:19px;">22 avenue Danton Demar, 34660 Cournonterral, France<br>TVA FR69933450322 · APE 4791B</p>
<p style="margin:0;font-family:{F};font-size:12px;color:#A8A8A8;line-height:19px;">Vous recevez cet email suite à votre inscription à la White Belt Lean de Fichly. <a href="{{{{ unsubscribe }}}}" style="color:#FFFFFF;text-decoration:underline;">Se désinscrire</a></p>
</td></tr></table>
</td></tr>
</table>
</td></tr></table>
</body></html>'''

def visible_words(e):
    txt = " ".join(re.sub("<[^>]+>", "", b[1]) if b[0] in ("p", "h2", "cta", "link") else
                   (" ".join(re.sub("<[^>]+>", "", i) for i in b[1]) if b[0] in ("ol", "ul") else "Hugo, Fichly")
                   for b in e["blocks"])
    txt = e["title"] + " " + txt
    return len(re.findall(r"[\wÀ-ÿ’'-]+", txt))

if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    meta = []
    for e in EMAILS:
        h = render(e)
        (OUT / f"{e['key']}.html").write_text(h, encoding="utf-8")
        meta.append(dict(key=e["key"], name=e["name"], subject=e["subject"], preheader=e["preheader"],
                         words=visible_words(e), file=f"emails/{e['key']}.html"))
    (OUT / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    for m in meta:
        print(f"{m['key']:<20} {m['words']:>4} mots · objet {len(m['subject']):>2} car. · {m['subject']}")
