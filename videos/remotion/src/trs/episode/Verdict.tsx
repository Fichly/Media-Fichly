// Cadre 11 « Le verdict » · une idée : sur 14 h, 10 h 50 utiles ; les 3 h 10 perdues sont d'abord des arrêts.
// La barre de 14 h se remplit, le reste se découpe en trois familles de pertes, la plus grosse est cerclée.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { clamp, Eyebrow, fade, IN, mix, OUT, pop, Pill, Scene, Widget } from "../ui";
import { TV } from "./Qualite";
import { T, useG } from "./timeline";

const K = IN.w / 14; // 1 h en pixels, sur la barre du haut
const TOP = { y: 180, h: 100 };
const USEFUL = (10 + 5 / 6) * K;
const PER_MIN = 7.5; // échelle des pertes, en bas : 2 h = 900 px

const LOSSES = [
  { min: 120, value: "2 h", label: "d'arrêts", at: 141.0, color: C.red, fg: C.ink, tone: C.tRed },
  { min: 40, value: "40 min", label: "de lenteurs", at: 142.32, color: C.yellow, fg: C.ink, tone: C.tYellow },
  { min: 30, value: "30 min", label: "de rebuts", at: 143.92, color: C.violet, fg: "#ffffff", tone: TV },
];

export const Verdict: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const useful = interpolate(f, [T(137.62), T(137.62) + 18], [0, USEFUL], { ...clamp, easing: OUT });
  const focus = interpolate(f, [T(145.38), T(145.38) + 10], [0, 1], clamp);
  const ring = pop(f, T(145.38));
  let x = USEFUL;
  return (
    <Scene>
      <Eyebrow text="Le verdict" start={T(134.96)} />
      <Widget title="Presse · ligne 2 · la journée en un coup d'œil">
        {/* la barre des 14 h requises */}
        <div
          style={{
            position: "absolute",
            left: IN.x,
            top: TOP.y,
            width: IN.w,
            height: TOP.h,
            borderRadius: 18,
            border: `3px solid ${C.blue}`,
            boxSizing: "border-box",
            opacity: fade(f, T(135.24), 8),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: IN.x,
            top: TOP.y,
            width: useful,
            height: TOP.h,
            borderRadius: 18,
            background: C.green,
            color: C.tGreen,
            display: "flex",
            alignItems: "center",
            paddingLeft: Math.min(30, useful),
            boxSizing: "border-box",
            opacity: useful > 4 ? 1 : 0,
            fontWeight: 700,
            fontSize: 38,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <span style={{ opacity: fade(f, T(137.62) + 8, 8) }}>10 h 50 de pièces bonnes</span>
        </div>
        {/* les 3 h 10 qui manquent : d'abord une seule case, puis trois familles */}
        <div
          style={{
            position: "absolute",
            left: IN.x + USEFUL + 6,
            top: TOP.y + 6,
            width: IN.w - USEFUL - 12,
            height: TOP.h - 12,
            borderRadius: 13,
            background: C.pRed,
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 34,
            color: C.tRed,
            opacity: fade(f, T(139.82), 6) * (1 - fade(f, T(141.0), 6)),
          }}
        >
          3 h 10
        </div>
        {LOSSES.map((l) => {
          const w = (l.min / 60) * K;
          const left = x;
          x += w;
          return (
            <div
              key={l.value}
              style={{
                position: "absolute",
                left: IN.x + left + 4,
                top: TOP.y + 6,
                width: w - 8,
                height: TOP.h - 12,
                borderRadius: 10,
                background: l.color,
                opacity: fade(f, T(l.at), 6),
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            right: IN.x,
            top: TOP.y + TOP.h + 12,
            fontWeight: 600,
            fontSize: 26,
            color: C.blue,
            opacity: fade(f, T(135.6), 8),
          }}
        >
          14 h de temps requis
        </div>

        {/* les trois familles de pertes, à plus grande échelle */}
        {LOSSES.map((l, i) => {
          const y = 360 + i * 116;
          const w = interpolate(f, [T(l.at), T(l.at) + 16], [0, l.min * PER_MIN], { ...clamp, easing: OUT });
          const dim = i === 0 ? 1 : 1 - 0.65 * focus;
          return (
            <div key={l.value} style={{ opacity: dim }}>
              <div
                style={{
                  position: "absolute",
                  left: IN.x,
                  top: y,
                  width: w,
                  height: 84,
                  borderRadius: 16,
                  background: l.color,
                  color: l.fg,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: Math.min(26, w),
                  boxSizing: "border-box",
                  opacity: w > 4 ? 1 : 0,
                  fontWeight: 800,
                  fontSize: 40,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {l.value}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: IN.x + l.min * PER_MIN + 24,
                  top: y,
                  height: 84,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: 36,
                  color: l.tone,
                  whiteSpace: "nowrap",
                  opacity: fade(f, T(l.at) + 8, 8),
                }}
              >
                {l.label}
              </div>
            </div>
          );
        })}
        {/* le premier chantier */}
        <div
          style={{
            position: "absolute",
            left: IN.x - 14,
            top: 360 - 14,
            width: 120 * PER_MIN + 28,
            height: 84 + 28,
            borderRadius: 26,
            border: `5px solid ${C.blue}`,
            boxSizing: "border-box",
            opacity: fade(f, T(145.38), 4),
            scale: interpolate(ring, [0, 1], [1.08, 1]),
          }}
        />
        <div
          style={{
            position: "absolute",
            right: IN.x,
            top: 360 + 14,
            translate: `${interpolate(f, [T(145.6), T(145.6) + 12], [16, 0], { ...clamp, easing: OUT })}px 0px`,
          }}
        >
          <Pill start={T(145.6)} bg={mix(fade(f, T(147.4), 6), C.blue, C.red)} fg="#ffffff">
            Premier chantier
          </Pill>
        </div>
      </Widget>
    </Scene>
  );
};
