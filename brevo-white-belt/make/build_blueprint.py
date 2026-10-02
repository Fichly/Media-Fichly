"""Blueprint du scénario Make « White Belt Lean · Tally → Brevo ».

Tally (formulaire ODOB5p, hook 4410784) → Brevo : récupère le contact,
crée ou met à jour ses attributs White Belt, puis l'ajoute à la liste 49
« White Belt — Inscrits », qui déclenche la séquence de nurturing.
"""
import json

HOOK = 4410784
BREVO = 7809870
LISTE = 49
T = 1  # module Tally
G = 2  # module GetContact

def f_id(key):
    return "{{%d.fieldsById.`%s`}}" % (T, key)

EMAIL = f_id("question_PBexee")
PRENOM = f_id("question_OB929g")
NOM = f_id("question_V1AeAy")
ENTREPRISE = f_id("question_EbEREr")
NEWSLETTER = "%d.fieldsById.`question_xN1q15_0a3d003f-d0f7-43f0-9619-fab48845c688`" % T
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
    return "{{switch(%s)}}" % "; ".join(parts)

TITRE_JOB = switch("first(%d.fieldsById.question_rr141R)" % T, FONCTIONS)
# La question « Qu’attendez-vous » n'est pas encore publiée : on la lit par son libellé,
# avec espace simple ou insécable avant le « ? ». À remplacer par son id après publication.
Q = "Qu’attendez-vous de cette formation"
BESOIN_EXPR = "first(ifempty(%d.fields.`%s ?`; %d.fields.`%s ?`))" % (T, Q, T, Q)
WB_BESOIN = switch(BESOIN_EXPR, BESOINS)
DATE_INSCRIPTION = "{{formatDate(%d.createdAt; \"YYYY-MM-DD\")}}" % T
AUJOURDHUI = "{{formatDate(now; \"YYYY-MM-DD\")}}"

nouveau = {
    "FIRSTNAME": PRENOM,
    "LASTNAME": NOM,
    "ENTREPRISE": ENTREPRISE,
    "TITRE_JOB": TITRE_JOB,
    "WB_BESOIN": WB_BESOIN,
    "INSCRIT_WHITEBELT": True,
    "WB_DATE_INSCRIPTION": DATE_INSCRIPTION,
    "OPT_IN": "{{%s}}" % NEWSLETTER,
    "ASSET_DERNIER": "white_belt",
    "DATE_DERNIERE_INTERACTION": AUJOURDHUI,
    **{k: f_id(v) for k, v in UTM.items()},
}
# Contact existant : on garde le premier contact (UTM, date d'inscription) et un opt-in déjà donné.
existant = {
    **nouveau,
    "WB_DATE_INSCRIPTION": "{{ifempty(%d.attributes.WB_DATE_INSCRIPTION; formatDate(%d.createdAt; \"YYYY-MM-DD\"))}}" % (G, T),
    "OPT_IN": "{{if(%s; true; %d.attributes.OPT_IN)}}" % (NEWSLETTER, G),
    **{k: "{{ifempty(%d.attributes.%s; %d.fieldsById.`%s`)}}" % (G, k, T, v) for k, v in UTM.items()},
}

def mod(id_, module, x, y, mapper=None, parameters=None, **extra):
    m = {"id": id_, "module": module, "version": 2 if module.startswith("sendinblue") else 1,
         "parameters": parameters if parameters is not None else {"__IMTCONN__": BREVO},
         "mapper": mapper if mapper is not None else {},
         "metadata": {"designer": {"x": x, "y": y}}}
    m.update(extra)
    return m

def ajout_liste(id_, x, y, onerror=None):
    extra = {"onerror": onerror} if onerror else {}
    return mod(id_, "sendinblue:AddExistingContacts", x, y, {"emails": [EMAIL], "listId": LISTE}, **extra)

flow = [
    mod(T, "tally:watchNewResponse", 0, 300, parameters={"__IMTHOOK__": HOOK}),
    mod(G, "sendinblue:GetContact", 300, 300, {"email": EMAIL},
        onerror=[mod(9, "builtin:Resume", 300, 600, parameters={})]),
    {"id": 3, "module": "builtin:BasicRouter", "version": 1, "mapper": None,
     "metadata": {"designer": {"x": 600, "y": 300}},
     "routes": [
         {"flow": [
             mod(4, "sendinblue:CreateContact", 900, 150, {"email": EMAIL, "attributes": nouveau},
                 filter={"name": "Nouveau contact", "conditions": [[{"a": "{{%d.email}}" % G, "o": "notexist"}]]}),
             ajout_liste(5, 1200, 150),
         ]},
         {"flow": [
             mod(6, "sendinblue:UpdateContact", 900, 450, {"email": EMAIL, "attributes": existant},
                 filter={"name": "Contact existant", "conditions": [[{"a": "{{%d.email}}" % G, "o": "exist"}]]}),
             ajout_liste(7, 1200, 450, onerror=[mod(8, "builtin:Ignore", 1500, 600, parameters={})]),
         ]},
     ]},
]

blueprint = {
    "name": "White Belt Lean · Tally → Brevo",
    "flow": flow,
    "metadata": {"version": 1, "instant": True,
                 "scenario": {"roundtrips": 1, "maxErrors": 3, "autoCommit": True, "autoCommitTriggerLast": True,
                              "sequential": False, "confidential": False, "dataloss": False, "dlq": False,
                              "freshVariables": False},
                 "designer": {"orphans": []}},
}

if __name__ == "__main__":
    json.dump(blueprint, open("blueprint_white_belt.json", "w"), ensure_ascii=False, indent=1)
    print(json.dumps(nouveau, ensure_ascii=False, indent=1))
