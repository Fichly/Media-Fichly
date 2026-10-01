// Calage de l'épisode complet sur la prise continue de la voix off (ElevenLabs v4, Emilie, vitesse 1,12).
// Repères : videos/le-trs-en-3-minutes/audio/v4/trs-complet.words.json (secondes de la prise, Whisper small).
import { useCurrentFrame } from "remotion";
import { at } from "../ui";

export const VO_START = 2.0; // la voix démarre une fois le logo écrit, il rejoint son coin pendant la première phrase
export const T = (t: number) => at(VO_START + t); // seconde de la prise → image de la vidéo
export const XF = 10; // fondu entre deux cadres, pendant que la voix continue
export const HANDOFF = T(1.84); // le logo et le ruban de l'intro sont posés quand le titre arrive : le décor prend le relais
export const VO_END = 243.74; // « description. »

// Chaque cadre commence juste avant la première syllabe de sa phrase (une idée par cadre)
export const CUTS = {
  constat: T(6.8), // « Pour commencer »
  formule: T(19.7), // « Alors, la façon la plus simple »
  cas: T(27.3), // « Notre presse »
  etats: T(48.05), // « Pour le savoir »
  requis: T(72.4), // « Appliquons ça à notre presse »
  dispo: T(80.0), // « Première marche »
  perf: T(97.3), // « Deuxième marche »
  qualite: T(113.4), // « Troisième marche »
  produit: T(125.1), // « On multiplie les trois »
  verdict: T(134.8), // « Sur ces quatorze heures »
  piste1: T(147.95), // « Attention aux fausses pistes »
  piste2: T(156.8), // « Et méfiez-vous »
  numerateur: T(168.1), // « Vous l'avez vu »
  comparateur: T(180.1), // « Le TRS les divise »
  quelTemps: T(221.85), // « Alors, devant un taux »
  retenir: T(226.22), // « À retenir »
  former: T(234.95), // « Pour aller plus loin »
  outro: T(VO_END + 0.35),
  fin: T(VO_END + 3.0),
};

// Image courante de la vidéo, depuis l'intérieur d'une séquence qui commence à `o`
export const useG = (o: number) => useCurrentFrame() + o;
