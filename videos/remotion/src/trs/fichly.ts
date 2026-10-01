// DA Fichly (palette du gabarit des fiches, voir videos/le-trs-en-3-minutes/frame.md)
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  blue: "#4a4aa0",
  ink: "#23235a",
  card: "#fdfdfb",
  line: "#e2e2ee",
  green: "#8cc978",
  red: "#f16969",
  pGreen: "#e6f3df",
  pRed: "#fde6e6",
  tGreen: "#2f5a1f",
  tRed: "#a83434",
  ribbon: ["#f16969", "#75bec0", "#aa76b2", "#8cc978", "#e0cf35", "#74a3d6"],
} as const;

export const FONT = "Poppins";

export const fontsLoaded = Promise.all(
  (["500", "600", "700", "800"] as const).map((weight) =>
    loadFont({
      family: FONT,
      url: staticFile(`fonts/poppins-latin-${weight}-normal.woff2`),
      weight,
    }),
  ),
);

// Pastilles ✓ / ✗ du gabarit (cercle plein, trait blanc)
export const OK_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'%3E%3Cpath d='M16 27 L23 34 L37 19' fill='none' stroke='white' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";
export const KO_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'%3E%3Cpath d='M17.5 17.5 L34.5 34.5 M34.5 17.5 L17.5 34.5' fill='none' stroke='white' stroke-width='5' stroke-linecap='round'/%3E%3C/svg%3E\")";
