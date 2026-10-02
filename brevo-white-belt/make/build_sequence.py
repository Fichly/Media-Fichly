"""Blueprint du scénario Make « White Belt Lean · Séquence E1 → E4 ».

Remplace le workflow Brevo, que l'API ne permet pas de créer. Le scénario d'inscription envoie E0 et pose
WB_ETAPE = 0 et WB_DERNIER_ENVOI = maintenant. Ce scénario, planifié, relit les inscrits de la liste 49
touchés récemment, envoie l'email suivant quand le délai est écoulé (E4 selon WB_BESOIN), puis avance WB_ETAPE.

  python3 build_sequence.py test   délais de 2, 3, 4 et 5 minutes, passage chaque minute (pour voir toute la séquence)
  python3 build_sequence.py prod   délais de 2, 3, 4 et 5 jours (J+2, J+5, J+9, J+14), passage chaque jour à 9 h

Les contacts désinscrits (emailBlacklisted) ne reçoivent pas E1 à E4.
"""
import json, sys

BREVO = 7809870
LISTE = 49
PARIS = "Europe/Paris"
DELAIS = {"0": 2, "1": 3, "2": 4, "3": 5}            # attente avant l'email suivant, selon le dernier envoyé
SUIVANT = {"0": 207, "1": 208, "2": 209}             # E1, E2, E3 ; après E3 : E4 selon le besoin
E4 = {"2": 211, "3": 212, "4": 213}                  # Équipe, Formation, Accompagnement ; sinon Découvrir (210)

def iml(e):
    return "{{%s}}" % e

C = 2  # module Iterator : un bundle par contact
ETAPE = "toString(%d.attributes.WB_ETAPE)" % C
DERNIER = "ifempty(%d.attributes.WB_DERNIER_ENVOI; now)" % C
DELAI = "switch(%s; %s; 99999)" % (ETAPE, "; ".join('"%s"; %d' % kv for kv in DELAIS.items()))
MAINTENANT = 'formatDate(now; "YYYY-MM-DDTHH:mm:ss[Z]"; "UTC")'

def du(mode):
    """« oui » si l'email suivant est dû."""
    if mode == "test":   # minutes écoulées depuis le dernier envoi
        ecoule = '(parseNumber(formatDate(now; "X")) - parseNumber(formatDate(%s; "X"))) / 60' % DERNIER
        return 'if(%s >= %s; "oui"; "non")' % (ecoule, DELAI)
    # jours calendaires, heure de Paris : dû si aujourd'hui ≥ jour du dernier envoi + délai
    auj = 'parseNumber(formatDate(now; "YYYYMMDD"; "%s"))' % PARIS
    cible = 'parseNumber(formatDate(addDays(%s; %s); "YYYYMMDD"; "%s"))' % (DERNIER, DELAI, PARIS)
    return 'if(%s >= %s; "oui"; "non")' % (auj, cible)

E4_EXPR = "switch(toString(%d.attributes.WB_BESOIN); %s; 210)" % (C, "; ".join('"%s"; %d' % kv for kv in E4.items()))
TEMPLATE = "switch(%s; %s; \"3\"; %s; 0)" % (ETAPE, "; ".join('"%s"; %d' % kv for kv in SUIVANT.items()), E4_EXPR)

def mod(id_, module, x, mapper, parameters=None, **extra):
    m = {"id": id_, "module": module, "version": 2 if module.startswith("sendinblue") else 1,
         "parameters": parameters if parameters is not None else {"__IMTCONN__": BREVO},
         "mapper": mapper, "metadata": {"designer": {"x": x, "y": 0}}}
    m.update(extra)
    return m

def relance(id_, x):
    return [mod(id_, "builtin:Break", x, {"retry": True, "count": 3, "interval": 15}, parameters={})]

def blueprint(mode):
    flow = [
        # Inscrits de la liste 49 touchés ces 20 derniers jours (la séquence met au plus 5 jours entre deux envois)
        mod(1, "sendinblue:MakeAPICall", 0, {
            "url": "/v3/contacts", "method": "GET",
            "qs": [{"key": "listIds", "value": str(LISTE)}, {"key": "limit", "value": "1000"},
                   {"key": "modifiedSince", "value": iml('formatDate(addDays(now; -20); "YYYY-MM-DDTHH:mm:ss.SSS[Z]"; "UTC")')}]}),
        mod(C, "builtin:BasicFeeder", 300, {"array": "{{1.body.contacts}}"}, parameters={}),
        mod(3, "sendinblue:SendEmail", 600, {
            "templateId": iml(TEMPLATE),
            "to": [{"email": "{{%d.email}}" % C, "name": "{{%d.attributes.FIRSTNAME}}" % C}],
            "replyTo": {"email": "hugo.duc@fichly.com", "name": "Hugo de Fichly"},
            "tags": ["white-belt-nurturing"]},
            filter={"name": "Email suivant dû", "conditions": [[
                {"a": "{{%d.emailBlacklisted}}" % C, "o": "boolean:equal", "b": "false"},
                {"a": iml('if(contains(split("0,1,2,3"; ","); %s); "oui"; "non")' % ETAPE), "o": "text:equal", "b": "oui"},
                {"a": iml(du(mode)), "o": "text:equal", "b": "oui"},
            ]]},
            onerror=relance(5, 600)),
        mod(4, "sendinblue:UpdateContact", 900, {
            "email": "{{%d.email}}" % C,
            "attributes": {"WB_ETAPE": iml("parseNumber(%s) + 1" % ETAPE), "WB_DERNIER_ENVOI": iml(MAINTENANT)}},
            onerror=relance(6, 900)),
    ]
    return {
        "name": "White Belt Lean · Séquence E1 → E4",
        "flow": flow,
        "metadata": {"version": 1, "instant": False,
                     "scenario": {"roundtrips": 1, "maxErrors": 3, "autoCommit": True, "autoCommitTriggerLast": True,
                                  "sequential": False, "confidential": False, "dataloss": False, "dlq": True,
                                  "freshVariables": False},
                     "designer": {"orphans": []}},
    }

PLANIFICATION = {"test": {"type": "indefinitely", "interval": 60},
                 "prod": {"type": "daily", "time": "09:00"}}

if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "prod"
    json.dump(blueprint(mode), open("blueprint_sequence_%s.json" % mode, "w"), ensure_ascii=False, indent=1)
    print(json.dumps(PLANIFICATION[mode]))
