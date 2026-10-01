// Logo Fichly en vecteur, redessiné d'après assets/fichly-logo.png (trait continu à bouts ronds, point du « i » bleu).
// `draw` (0 → 1) écrit les lettres l'une après l'autre ; `dot` (0 → 1) fait tomber le point du « i ».
// À remplacer par le fichier vectoriel officiel dès qu'il est disponible.
import type React from "react";
import { interpolate } from "remotion";

export const LOGO_VIEW = { w: 890, h: 470 };
const INK = "#211f20";
const DOT = "#4a4aa0";

// Traits dans l'ordre d'écriture, avec leur longueur (pour stroke-dasharray)
const STROKES: { d: string; len: number }[] = [
  { d: "M186 60 H132 A60 60 0 0 0 72 120 V296", len: 54 + 94 + 176 },
  { d: "M48 182 H122", len: 74 },
  { d: "M208 182 V301", len: 119 },
  { d: "M375 189 A62 62 0 1 0 375 291", len: 2 * Math.PI * 62 * (248 / 360) },
  { d: "M445 51 V302", len: 251 },
  { d: "M445 242 A63 63 0 0 1 571 242 V301", len: Math.PI * 63 + 59 },
  { d: "M640 61 V302", len: 241 },
  { d: "M709 175 V234 A62.5 62.5 0 0 0 834 234", len: 59 + Math.PI * 62.5 },
  { d: "M834 177 V363 A62.5 62.5 0 0 1 709 363", len: 186 + Math.PI * 62.5 },
];

export const LogoFichly: React.FC<{ width: number; draw?: number; dot?: number; style?: React.CSSProperties }> = ({
  width,
  draw = 1,
  dot = 1,
  style,
}) => {
  const n = STROKES.length;
  return (
    <svg viewBox={`0 0 ${LOGO_VIEW.w} ${LOGO_VIEW.h}`} width={width} height={(width * LOGO_VIEW.h) / LOGO_VIEW.w} style={style}>
      <g fill="none" stroke={INK} strokeWidth={27} strokeLinecap="round" strokeLinejoin="round">
        {STROKES.map((s, i) => {
          // chaque trait s'écrit dans sa fenêtre, avec un léger chevauchement sur le suivant
          const p = interpolate(draw, [i / (n + 1), (i + 2) / (n + 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return p <= 0 ? null : <path key={s.d} d={s.d} strokeDasharray={s.len + 2} strokeDashoffset={(s.len + 2) * (1 - p)} />;
        })}
      </g>
      {dot > 0 ? (
        <circle
          cx={207}
          cy={interpolate(dot, [0, 1], [40, 128])}
          r={21 * Math.min(1, 0.4 + dot)}
          fill={DOT}
          opacity={Math.min(1, dot * 3)}
        />
      ) : null}
    </svg>
  );
};
