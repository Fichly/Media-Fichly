// Cadre 12 « Fausse piste n° 1 » · une idée : pas de bon TRS universel, on compare la ligne à elle-même, mois après mois.
// Valeurs d'illustration : la presse progresse jusqu'à ses 77 % (mêmes règles de calcul chaque mois).
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { Badge, CARD, clamp, Eyebrow, fade, IN, pop, Pill, Scene, Widget } from "../ui";
import { T, useG } from "./timeline";

const MONTHS = ["avr.", "mai", "juin", "juil.", "août", "sept."];
const VALUES = [70, 72, 71, 74, 75, 77];
const P = { x0: IN.x + 140, x1: IN.x + IN.w - 60, y0: 610, y1: 270, v0: 65, v1: 80 };
const px = (i: number) => P.x0 + (i * (P.x1 - P.x0)) / (MONTHS.length - 1);
const py = (v: number) => P.y0 - ((v - P.v0) / (P.v1 - P.v0)) * (P.y0 - P.y1);
const PTS = VALUES.map((v, i) => [px(i), py(v)] as const);
const SEG = PTS.slice(1).map(([x, y], i) => Math.hypot(x - PTS[i][0], y - PTS[i][1]));
const LEN = SEG.reduce((a, b) => a + b, 0);
const STEP = 6; // images entre deux mois

export const FaussePiste1: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const draw = T(154.2);
  const n = interpolate(f, [draw, draw + STEP * (MONTHS.length - 1)], [0, MONTHS.length - 1], clamp);
  const drawn = SEG.reduce((acc, s, i) => acc + s * Math.min(1, Math.max(0, n - i)), 0);
  const axes = fade(f, T(152.52), 10);
  return (
    <Scene>
      <Eyebrow text="Fausse piste n° 1" start={T(148.02)} />
      <Widget title="TRS de la presse, mois après mois" light="none">
        <div
          style={{
            position: "absolute",
            left: IN.x,
            top: 158,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontWeight: 700,
            fontSize: 40,
            color: C.tRed,
            opacity: fade(f, T(150.08), 6),
            scale: interpolate(pop(f, T(150.08)), [0, 1], [0.9, 1]),
            transformOrigin: "left center",
          }}
        >
          <Badge kind="ko" size={46} />
          Il n'existe pas de « bon TRS » universel
        </div>

        <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0 }}>
          {[70, 75, 80].map((v) => (
            <g key={v} opacity={axes}>
              <line x1={P.x0 - 30} x2={P.x1 + 30} y1={py(v)} y2={py(v)} stroke={C.line} strokeWidth={3} />
              <text x={IN.x} y={py(v) + 10} fontFamily="Poppins" fontWeight={600} fontSize={28} fill={C.muted}>
                {v} %
              </text>
            </g>
          ))}
          {MONTHS.map((m, i) => (
            <text
              key={m}
              x={px(i)}
              y={P.y0 + 60}
              textAnchor="middle"
              fontFamily="Poppins"
              fontWeight={600}
              fontSize={28}
              fill={C.muted}
              opacity={axes}
            >
              {m}
            </text>
          ))}
          <polyline
            points={PTS.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={C.blue}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={LEN}
            strokeDashoffset={LEN - drawn}
            opacity={drawn > 0 ? 1 : 0}
          />
          {PTS.map(([x, y], i) => {
            const on = draw + i * STEP;
            const p = pop(f, on);
            const last = i === PTS.length - 1;
            return (
              <g key={i} opacity={fade(f, on, 3)}>
                <circle
                  cx={x}
                  cy={y}
                  r={(last ? 20 : 13) * interpolate(p, [0, 1], [0.4, 1])}
                  fill={last ? C.green : C.blue}
                  stroke="#ffffff"
                  strokeWidth={5}
                />
                <text
                  x={x}
                  y={y - 34}
                  textAnchor="middle"
                  fontFamily="Poppins"
                  fontWeight={800}
                  fontSize={last ? 40 : 30}
                  fill={last ? C.tGreen : C.blue}
                >
                  {VALUES[i]} %
                </text>
              </g>
            );
          })}
        </svg>

        <div style={{ position: "absolute", right: IN.x, top: 158 }}>
          <Pill start={T(155.16)} bg={C.pGreen} fg={C.tGreen} badge="ok">
            Mêmes règles de calcul
          </Pill>
        </div>
      </Widget>
    </Scene>
  );
};
