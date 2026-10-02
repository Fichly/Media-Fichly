"""Blueprint du scénario Make « White Belt Lean · Tally → Brevo » (version 2).

Tally (formulaire ODOB5p, hook 4410784) → Brevo :
1. garde : e-mail présent, consentement coché, réponse issue de la nouvelle version du formulaire ;
2. lecture du contact Brevo (absent → sortie vide) ;
3. création ou mise à jour en une seule étape (upsert), en conservant les données déjà présentes ;
4. ajout à la liste 49 « White Belt — Inscrits » s'il n'y est pas encore : c'est ce qui déclenche la séquence.
Les erreurs Brevo sont relancées 3 fois (15 min) puis gardées en exécutions incomplètes,
sans bloquer les inscriptions suivantes (pas de traitement séquentiel : l'upsert rend les doublons impossibles).
"""
import json

HOOK = 4410784
BREVO = 7809870
LISTE = 49
T = 1  # module Tally (ou ParseJSON dans le harnais)
G = 2  # module GetContact
PARIS = "Europe/Paris"

def champ(key):
    return "%d.fieldsById.`%s`" % (T, key)

def iml(expr):
    return "{{%s}}" % expr

EMAIL = "lower(trim(%s))" % champ("question_PBexee")
PRENOM = "trim(%s)" % champ("question_OB929g")
NOM = "trim(%s)" % champ("question_V1AeAy")
ENTREPRISE = "trim(%s)" % champ("question_EbEREr")
FONCTION = "first(%s)" % champ("question_rr141R")
CONSENTEMENT = champ("question_2xyWy9_413f2344-9351-431f-b867-ed58e6ca61e8")
NEWSLETTER = champ("question_xN1q15_0a3d003f-d0f7-43f0-9619-fab48845c688")
UTM = {
    "UTM_SOURCE": "question_GB4G4k_ca989a49-b750-4ae5-9575-3e69d77b1b58",
    "UTM_MEDIUM": "question_GB4G4k_862975a1-7faf-43e0-82e9-1501f37bcd19",
    "UTM_CAMPAIGN": "question_GB4G4k_63ac4b47-b902-4160-88e4-f78d75729449",
    "UTM_CONTENT": "question_GB4G4k_7c335eeb-35b1-4998-9df1-31d2950c9aa9",
}

# Votre fonction (liste déroulante Tally) → TITRE_JOB (catégorie Brevo existante)
FONCTIONS = [
    ("Opérateur ou technicien", "23"),        # Technicien / Opérateur
    ("Chef d’équipe", "12"),                  # Manager (toutes spécialités)
    ("Méthodes ou industrialisation", "18"),  # Responsable Méthodes
    ("Responsable production", "20"),         # Responsable Production
    ("Qualité ou HSE", "21"),                 # Responsable Qualité
    ("Amélioration continue", "14"),          # Responsable Autres (QHSE, Export, etc.)
    ("Direction", "13"),                      # Président / PDG / Gérant / Dirigeant
    ("Étudiant", "10"),                       # Étudiant / Alternant / Apprenti
    ("Autre", "24"),                          # Divers / Autre
]
# Qu’attendez-vous de cette formation ? → WB_BESOIN (1 à 4)
BESOINS = [
    ("Découvrir les bases du Lean", "1"),
    ("Lancer une démarche avec mon équipe", "2"),
    ("Me former ou me certifier", "3"),
    ("Faire accompagner mon site", "4"),
]

def switch(expr, pairs):
    parts = [expr] + [x for a, b in pairs for x in ('"%s"' % a, '"%s"' % b)] + ['""']
    return "switch(%s)" % "; ".join(parts)

# La question « Qu’attendez-vous » n'existe que dans la nouvelle version du formulaire (publiée le 2 octobre) :
# identifiant question_DvOEkj, avec le libellé en secours (espace, espace insécable ou espace fine avant « ? »).
Q = "Qu’attendez-vous de cette formation"
BESOIN = ("first(ifempty(%s; ifempty(ifempty(%d.fields.`%s ?`; %d.fields.`%s\u00a0?`); %d.fields.`%s\u202f?`)))"
          % (champ("question_DvOEkj"), T, Q, T, Q, T, Q))

MAINTENANT = 'formatDate(now; "YYYY-MM-DDTHH:mm:ss[Z]"; "UTC")'

def existant(attr):
    return "%d.attributes.%s" % (G, attr)

# Premier contact : on garde le bloc UTM existant tel quel s'il contient au moins une valeur,
# sinon on écrit celui de la réponse. Jamais de mélange champ par champ.
UTM_EXISTANTS = "ifempty(%s; ifempty(%s; ifempty(%s; ifempty(%s; \"\"))))" % tuple(existant(k) for k in UTM)

attributs = {
    # Données déjà présentes dans Brevo conservées (saisie plus précise, casse correcte)
    "FIRSTNAME": iml("ifempty(%s; %s)" % (existant("FIRSTNAME"), PRENOM)),
    "LASTNAME": iml("ifempty(%s; %s)" % (existant("LASTNAME"), NOM)),
    "ENTREPRISE": iml("ifempty(%s; %s)" % (existant("ENTREPRISE"), ENTREPRISE)),
    "TITRE_JOB": iml("ifempty(%s; %s)" % (existant("TITRE_JOB"), switch(FONCTION, FONCTIONS))),
    # Données White Belt : le besoin le plus récent, la première date d'inscription
    "WB_BESOIN": iml(switch(BESOIN, BESOINS)),
    "INSCRIT_WHITEBELT": True,
    "WB_DATE_INSCRIPTION": iml("formatDate(ifempty(%s; %d.createdAt); \"YYYY-MM-DD\"; \"%s\")" % (existant("WB_DATE_INSCRIPTION"), T, PARIS)),
    # Un opt-in déjà donné n'est jamais retiré ; case non cochée → on n'écrit rien
    "OPT_IN": iml("if(%s; true; %s)" % (NEWSLETTER, existant("OPT_IN"))),
    "ASSET_DERNIER": "white_belt",
    "DATE_DERNIERE_INTERACTION": iml("formatDate(%d.createdAt; \"YYYY-MM-DD\"; \"%s\")" % (T, PARIS)),
    **{k: iml("if(%s = \"\"; %s; %s)" % (UTM_EXISTANTS, champ(v), existant(k))) for k, v in UTM.items()},
}

def mod(id_, module, x, y, mapper=None, parameters=None, **extra):
    m = {"id": id_, "module": module, "version": 2 if module.startswith("sendinblue") else 1,
         "parameters": parameters if parameters is not None else {"__IMTCONN__": BREVO},
         "mapper": mapper if mapper is not None else {},
         "metadata": {"designer": {"x": x, "y": y}}}
    m.update(extra)
    return m

def relance(id_, x, y):
    return [mod(id_, "builtin:Break", x, y, {"retry": True, "count": 3, "interval": 15}, parameters={})]

GARDE = {"name": "Réponse White Belt valide", "conditions": [[
    {"a": iml(EMAIL), "o": "exist"},
    {"a": iml(CONSENTEMENT), "o": "boolean:equal", "b": "true"},
    {"a": iml(BESOIN), "o": "exist"},
]]}
PAS_ENCORE_INSCRIT = {"name": "Pas encore dans la liste 49", "conditions": [[
    {"a": iml("if(contains(ifempty(%d.listIds; emptyarray); %d); \"oui\"; \"non\")" % (G, LISTE)), "o": "text:equal", "b": "non"},
]]}

# Une erreur du GetContact n'est « contact absent » que si Brevo répond 404 document_not_found.
# Toute autre erreur (limite de débit, panne) est relancée, pour ne jamais traiter un contact existant comme nouveau.
MESSAGE = "lower(%d.error.message)" % G
GENRE_ERREUR = ('if(contains(%s; "does not exist"); "absent"; if(contains(%s; "document_not_found"); "absent"; "autre"))'
                % (MESSAGE, MESSAGE))

def suite():
    """Modules 2 à 7, communs au scénario réel et au harnais de test."""
    return [
        mod(G, "sendinblue:GetContact", 300, 300, {"email": iml(EMAIL)}, filter=GARDE,
            onerror=[{"id": 8, "module": "builtin:BasicRouter", "version": 1, "mapper": None,
                      "metadata": {"designer": {"x": 300, "y": 600}},
                      "routes": [
                          {"flow": [mod(5, "builtin:Resume", 600, 500, parameters={},
                                        filter={"name": "Contact absent (404)", "conditions": [[
                                            {"a": iml(GENRE_ERREUR), "o": "text:equal", "b": "absent"}]]})]},
                          {"flow": [mod(9, "builtin:Break", 600, 700, {"retry": True, "count": 3, "interval": 15},
                                        parameters={},
                                        filter={"name": "Autre erreur", "conditions": [[
                                            {"a": iml(GENRE_ERREUR), "o": "text:equal", "b": "autre"}]]})]},
                      ]}]),
        mod(3, "sendinblue:CreateContact", 600, 300,
            {"email": iml(EMAIL), "updateEnabled": True, "attributes": attributs},
            onerror=relance(6, 600, 600)),
        mod(4, "sendinblue:AddExistingContacts", 900, 300, {"emails": [iml(EMAIL)], "listId": LISTE},
            filter=PAS_ENCORE_INSCRIT, onerror=relance(7, 900, 600)),
        # E0 tout de suite, puis début du suivi de séquence (lu par le scénario « Séquence E1 → E4 »)
        mod(10, "sendinblue:SendEmail", 1200, 300,
            {"templateId": 206, "to": [{"email": iml(EMAIL), "name": iml(PRENOM)}],
             "replyTo": {"email": "hugo.duc@fichly.com", "name": "Hugo de Fichly"}, "tags": ["white-belt-nurturing", "wb-e0"]},
            onerror=relance(11, 1200, 600)),
        mod(12, "sendinblue:UpdateContact", 1500, 300,
            {"email": iml(EMAIL), "attributes": {"WB_ETAPE": 0, "WB_DERNIER_ENVOI": iml(MAINTENANT)}},
            onerror=relance(13, 1500, 600)),
    ]

META = {"version": 1, "instant": True,
        "scenario": {"roundtrips": 1, "maxErrors": 3, "autoCommit": True, "autoCommitTriggerLast": True,
                     "sequential": False, "confidential": False, "dataloss": False, "dlq": True,
                     "freshVariables": False},
        "designer": {"orphans": []}}

blueprint = {
    "name": "White Belt Lean · Tally → Brevo",
    "flow": [mod(T, "tally:watchNewResponse", 0, 300, parameters={"__IMTHOOK__": HOOK})] + suite(),
    "metadata": META,
}

# Harnais de test : même suite de modules, mais le module 1 lit une réponse Tally simulée
# (entrée de scénario « payload », au format de sortie du module Tally) au lieu du hook.
harnais = {
    "name": "TEST · White Belt · harnais Tally → Brevo",
    "flow": [mod(T, "json:ParseJSON", 0, 300, {"json": "{{var.input.payload}}"}, parameters={})] + suite(),
    "metadata": {**META, "instant": False},
}

if __name__ == "__main__":
    json.dump(blueprint, open("blueprint_white_belt.json", "w"), ensure_ascii=False, indent=1)
    json.dump(harnais, open("blueprint_harnais_test.json", "w"), ensure_ascii=False, indent=1)
    print(json.dumps(attributs, ensure_ascii=False, indent=1))
