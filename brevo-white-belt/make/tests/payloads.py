"""Réponses Tally simulées, au format de sortie du module Make tally:watchNewResponse."""
import json, sys

UTM_IDS = {"utm_source": "ca989a49-b750-4ae5-9575-3e69d77b1b58", "utm_medium": "862975a1-7faf-43e0-82e9-1501f37bcd19",
           "utm_campaign": "63ac4b47-b902-4160-88e4-f78d75729449", "utm_content": "7c335eeb-35b1-4998-9df1-31d2950c9aa9"}
NEWS = "question_xN1q15_0a3d003f-d0f7-43f0-9619-fab48845c688"
Q = "Qu’attendez-vous de cette formation"

def reponse(email, prenom="Camille", nom="Test", entreprise="Fichly Test", fonction=None, besoin=None, besoin_nbsp=False,
            newsletter=False, utm=None, created="2026-10-02T13:40:00.000Z", taille=None, niveau=None):
    fields, byid = {}, {}
    def put(label, key, val):
        fields[label] = val
        if key: byid[key] = val
    for k, v in (utm or {}).items():
        put(k, "question_GB4G4k_" + UTM_IDS[k], v)
    put("Prénom", "question_OB929g", prenom)
    put("Nom", "question_V1AeAy", nom)
    put("E-mail professionnel", "question_PBexee", email)
    put("Entreprise", "question_EbEREr", entreprise)
    put("Votre fonction", "question_rr141R", [fonction] if fonction else None)
    put("Taille de l’entreprise", "question_4Ny6yY", [taille] if taille else None)
    put("Votre niveau en Lean", "question_j9YRY4", [niveau] if niveau else None)
    if besoin is not None:
        put(Q + (" ?" if besoin_nbsp else " ?"), "question_NOUVELLE", [besoin])
    put("Vos accords", "question_2xyWy9", ["J’accepte que Fichly utilise ces informations…"])
    put("Vos accords (J’accepte…)", "question_2xyWy9_413f2344-9351-431f-b867-ed58e6ca61e8", True)
    put("Restons en contact", "question_xN1q15", ["Je souhaite recevoir L’Atelier…"] if newsletter else None)
    put("Restons en contact (Je souhaite…)", NEWS, bool(newsletter))
    return {"eventId": "test", "responseId": "test", "submissionId": "test", "respondentId": "test", "formId": "ODOB5p",
            "formName": "White Belt Lean en 1 h, gratuite", "createdAt": created, "fields": fields, "fieldsById": byid}

CAS = {
 "T1": reponse("hugo.duc+wbtest-1@fichly.com", fonction="Chef d’équipe", besoin="Lancer une démarche avec mon équipe", newsletter=True,
               utm={"utm_source": "linkedin", "utm_medium": "social", "utm_campaign": "white-belt-lancement", "utm_content": "post-1"}),
 "T2": reponse("hugo.duc+wbtest-1@fichly.com", prenom="Camille", nom="Test-Bis", fonction="Direction", besoin="Me former ou me certifier",
               newsletter=False, utm={"utm_source": "google", "utm_medium": "cpc", "utm_campaign": "autre", "utm_content": "ad-2"},
               created="2026-10-05T08:00:00.000Z"),
 "T3": reponse("hugo.duc+wbtest-3@fichly.com", fonction="Autre", newsletter=False),
 "T4": reponse("hugo.duc+wbtest-4@fichly.com", fonction="Opérateur ou technicien", besoin="Faire accompagner mon site", besoin_nbsp=True,
               utm={"utm_source": "brevo"}),
 "T5": reponse("Hugo.Duc+WBTEST-1@fichly.com", fonction="Qualité ou HSE", besoin="Découvrir les bases du Lean", newsletter=False,
               created="2026-10-06T08:00:00.000Z"),
 "T6": reponse("hugo.duc+wbtest-3@fichly.com", fonction="Étudiant", besoin="Découvrir les bases du Lean", newsletter=True,
               utm={"utm_source": "newsletter", "utm_medium": "email"}, created="2026-10-07T08:00:00.000Z"),
}

if __name__ == "__main__":
    print(json.dumps(json.dumps(CAS[sys.argv[1]], ensure_ascii=False), ensure_ascii=False))
