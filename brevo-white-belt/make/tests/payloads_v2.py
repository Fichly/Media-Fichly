"""Cas de test de la version 2 (réponses Tally simulées)."""
import json, sys
from payloads import reponse, Q

def avec_besoin(r, besoin, espace=" "):
    """Place la réponse à « Qu’attendez-vous » sous le libellé exact voulu (espace simple, insécable ou fine)."""
    for k in [k for k in r["fields"] if k.startswith(Q)]:
        del r["fields"][k]
    r["fields"][Q + espace + "?"] = [besoin]
    return r

U4 = {"utm_source": "linkedin", "utm_medium": "social", "utm_campaign": "white-belt-lancement", "utm_content": "post-1"}
U4b = {"utm_source": "google", "utm_medium": "cpc", "utm_campaign": "autre", "utm_content": "ad-2"}

CAS = {
 # V1 nouveau contact complet ; 22:30 UTC = 00:30 à Paris le lendemain
 "V1": reponse("hugo.duc+wbtest-10@fichly.com", fonction="Chef d’équipe", besoin="Lancer une démarche avec mon équipe",
               newsletter=True, utm=U4, created="2026-10-02T22:30:00.000Z"),
 # V2 même personne, adresse en majuscules avec espaces, tout change
 "V2": reponse("  Hugo.Duc+WBTEST-10@Fichly.com ", prenom="CAMILLE", nom="TEST-CAPS", entreprise="Autre Boîte",
               fonction="Autre", besoin="Me former ou me certifier", newsletter=False, utm=U4b, created="2026-10-08T09:00:00.000Z"),
 # V3 contact existant avec un bloc UTM partiel (wbtest-3 : source newsletter, medium email)
 "V3": reponse("hugo.duc+wbtest-3@fichly.com", fonction="Étudiant", besoin="Découvrir les bases du Lean", newsletter=False,
               utm=U4b, created="2026-10-09T09:00:00.000Z"),
 # V4 contact existant hors liste 49, fonction précise (TITRE_JOB 8) et prénom déjà saisis
 "V4": reponse("hugo.duc+wbtest-11@fichly.com", prenom="hugo", nom="duc", entreprise="Nouvelle", fonction="Direction",
               besoin="Faire accompagner mon site", newsletter=False, utm=U4, created="2026-10-09T10:00:00.000Z"),
 # V5 consentement non coché → rien
 "V5": reponse("hugo.duc+wbtest-12@fichly.com", fonction="Autre", besoin="Découvrir les bases du Lean"),
 # V6 réponse de l'ancienne version (pas de question « Qu’attendez-vous ») → rien
 "V6": reponse("hugo.duc+wbtest-13@fichly.com", fonction="Autre"),
 # V7 fonction absente, libellé avec espace fine insécable
 "V7": reponse("hugo.duc+wbtest-14@fichly.com", fonction=None, besoin="x"),
 # V8 e-mail absent → rien, sans erreur
 "V8": reponse("", fonction="Autre", besoin="Découvrir les bases du Lean"),
}
CAS["V5"]["fieldsById"]["question_2xyWy9_413f2344-9351-431f-b867-ed58e6ca61e8"] = False
CAS["V5"]["fields"]["Vos accords (J’accepte…)"] = False
CAS["V5"]["fields"]["Vos accords"] = None
CAS["V5"]["fieldsById"]["question_2xyWy9"] = None
avec_besoin(CAS["V7"], "Faire accompagner mon site", " ")
del CAS["V8"]["fieldsById"]["question_PBexee"]; del CAS["V8"]["fields"]["E-mail professionnel"]

if __name__ == "__main__":
    print(json.dumps({"payload": json.dumps(CAS[sys.argv[1]], ensure_ascii=True)}, ensure_ascii=True))
