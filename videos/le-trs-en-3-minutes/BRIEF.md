---
workflow: faceless-explainer
flow: automation
storyboard: yes
message: "Le TRS retrouve le temps perdu entre ce que la machine devait produire et les pièces bonnes qu'elle a livrées, et c'est sa décomposition, pas le chiffre, qui dit où agir."
destination: youtube
aspect: 1920x1080
language: fr
audience: "Responsables de production, techniciens méthodes et maintenance, personnes en formation Lean (francophones, vouvoiement)"
length: 180s
angle: concept
narration: yes
voice: d3AXX0BlgJHYFCuH9X88
---

## Intent

« Le TRS en 3 minutes » : une vidéo YouTube pédagogique et ludique qui explique ce qu'est le TRS et en quoi il consiste, en voix off (Emilie). Parti pris retenu : **L'enquête**. La machine tourne toute la journée, pourtant il manque plus de 3 heures : où sont-elles passées ? Trois témoins (disponibilité, performance, qualité), une loupe sur les micro-arrêts que personne ne déclare, un verdict à 77 %, et la leçon : c'est la décomposition, pas le chiffre, qui dit où agir. Accroche validée : « Cette machine tourne toute la journée. Pourtant, il lui manque plus de 3 heures. Où sont-elles passées ? »

Feuille blanche pour le motion : on ne reprend ni le gabarit ni le style des fiches LinkedIn Fichly. Zéro PowerPoint ronflant : la formule n'arrive qu'en fin d'enquête.

## Assets

- Aucun visuel fourni. Le logo Fichly (`/home/user/Media-Fichly/assets/fichly-logo.png`) signe la fin de la vidéo.

## Customizations

- Voix off : ElevenLabs « Emilie - Podcast Host » (voice_id `d3AXX0BlgJHYFCuH9X88`), via le connecteur ElevenLabs (l'API et HeyGen sont bloqués dans l'environnement cloud).
- Compteurs : « 3 h 10 manquantes » et le verdict « 77 % » défilent jusqu'à leur valeur au moment où la voix les prononce.
- Sous-titres : fichier `.srt` pour YouTube, pas de sous-titres incrustés.
- Musique et bruitages d'enquête (punaise, papier, tampon « Affaire classée ») : proposés, en attente de décision (coût en crédits ElevenLabs à annoncer avant génération). Version 1 sans musique.

## Notes

- Source : article Fichly « TRS (Taux de Rendement Synthétique) : Définition, exemples et calculs » (`taux-de-rendement-synthetique-definition`), lu via Shopify le 1er octobre 2026.
- Cas de référence du site, à respecter : 2 équipes de 8 h = 16 h d'ouverture ; 2 h de maintenance préventive planifiée → 14 h requises ; 2 h d'arrêts subis → 12 h de fonctionnement ; cadence 60 pièces/h → 720 attendues, 680 produites ; 650 conformes. Disponibilité 85,7 %, performance 94,4 %, qualité 95,6 %, TRS 77 % = 10 h 50 utiles sur 14 h ; 3 h 10 perdues. Points perdus : disponibilité 14,3, performance 5,6, qualité 4,4.
- À garder : cascade des temps (requis → fonctionnement → net → utile), les trois taux, la disponibilité est le premier chantier ici, aucun seuil universel (comparer une ligne à son propre historique), le piège de la requalification d'une panne en arrêt planifié (14 h → 13 h, TRS 77 % → 83 % sans rien changer), le TRS n'est pas une note des équipes.
- À laisser de côté (au plus une phrase et un renvoi vers l'article) : TRG, TRE, OEE, méthodes de relevé, outils.
- Veille YouTube (titres seulement, transcriptions inaccessibles dans l'environnement) : les vidéos existantes ouvrent par la définition et la formule A × P × Q, ou sont des démonstrations de logiciels (MES). Notre différence : l'enquête, la formule en dernier, la décomposition comme verdict.
- Vertical (plus tard) : montage séparé de 60 s centré sur « Où sont passées les 3 h 10 ? », pas une redisposition des 3 minutes.
- Durée : 180 s ≈ 450 mots de voix off ; c'est la durée maximale du parcours explainer.
