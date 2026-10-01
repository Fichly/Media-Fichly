// Calage de la première minute sur la prise continue du bloc 1 (script v3, lignes 1 à 5).
// Repères : videos/le-trs-en-3-minutes/audio/v3/bloc1.words.json (secondes de la prise).
import { useCurrentFrame } from "remotion";
import { at } from "../ui";

export const VO_START = 2.0; // la voix démarre pendant que le logo rejoint son coin
export const T = (t: number) => at(VO_START + t); // seconde de la prise → image de la vidéo
export const XF = 10; // fondu entre deux cadres, pendant que la voix continue
export const HANDOFF = at(2.5); // le logo et le ruban de l'intro sont posés : le décor prend le relais

// Chaque cadre commence juste avant la première syllabe de sa phrase
export const CUTS = {
  constat: T(4.9), // « Pour commencer »
  formule: T(15.9), // « La façon la plus simple »
  cas: T(22.1), // « Notre presse »
  etats: T(40.3), // « Pour le savoir »
  fin: T(59.08 + 1.6),
};

// Image courante de la vidéo, depuis l'intérieur d'une séquence qui commence à `o`
export const useG = (o: number) => useCurrentFrame() + o;
