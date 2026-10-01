// Cadre 4 « Notre cas » · une idée : 650 pièces bonnes sur 840 possibles = 77 %… mais où sont passées les 3 heures ?
import type React from "react";
import { Easing, interpolate } from "remotion";
import { C } from "../fichly";
import { Badge, clamp, Eyebrow, fade, IN, OUT, pop, Scene, Widget } from "../ui";
import { T, useG } from "./timeline";

const H = 110;
const Y1 = 230;
const Y2 = 390;
const GOOD = Math.round((IN.w * 650) / 840);

const count = (f: number, from: number, to: number, value: number) =>
  Math.round(interpolate(f, [from, to], [0, value], { ...clamp, easing: Easing.out(Easing.cubic) }));

const Bar: React.FC<{ y: number; w: number; bg: string; fg: string; children: React.ReactNode }> = ({ y, w, bg, fg, children }) => (
  <div
    style={{
      position: "absolute",
      left: IN.x,
      top: y,
      width: w,
      height: H,
      borderRadius: 18,
      background: bg,
      color: fg,
      display: "flex",
      alignItems: "center",
      paddingLeft: Math.min(34, w),
      boxSizing: "border-box",
      opacity: w > 4 ? 1 : 0,
      fontWeight: 700,
      fontSize: 40,
      whiteSpace: "nowrap",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

export const NotreCas: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const w1 = interpolate(f, [T(31.06), T(31.06) + 20], [0, IN.w], { ...clamp, easing: OUT });
  const w2 = interpolate(f, [T(37.06), T(37.06) + 20], [0, GOOD], { ...clamp, easing: OUT });
  const n1 = count(f, T(35.0), T(35.8), 840);
  const n2 = count(f, T(37.42), T(38.04), 650);
  const big = pop(f, T(42.3));
  const gap = pop(f, T(45.54));
  return (
    <Scene>
      <Eyebrow text="Calcul n° 1 · notre presse" start={T(27.4)} />
      <Widget title="Presse · ligne 2">
        <span
          style={{
            position: "absolute",
            left: IN.x,
            top: 158,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            borderRadius: 999,
            padding: "8px 20px",
            background: C.pLav,
            color: C.blue,
            fontWeight: 700,
            fontSize: 26,
            opacity: fade(f, T(29.2), 6),
          }}
        >
          Temps de cycle idéal : 1 pièce par minute
        </span>
        <div style={{ position: "absolute", right: IN.x, top: 166, fontWeight: 600, fontSize: 26, color: C.blue, opacity: fade(f, T(31.06), 8) }}>
          14 h requises × 60 pièces par heure
        </div>

        <Bar y={Y1} w={w1} bg={C.blue} fg="#ffffff">
          <span style={{ fontVariantNumeric: "tabular-nums", opacity: fade(f, T(35.0), 4) }}>{n1}&nbsp;</span>
          <span style={{ opacity: fade(f, T(31.06) + 10, 6) }}>pièces possibles</span>
        </Bar>
        <Bar y={Y2} w={w2} bg={C.green} fg={C.tGreen}>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{n2}&nbsp;</span>pièces bonnes
        </Bar>

        {/* l'écart : le chiffre ne dit pas où il est parti */}
        <div
          style={{
            position: "absolute",
            left: IN.x + GOOD + 12,
            top: Y2,
            width: IN.w - GOOD - 12,
            height: H,
            borderRadius: 18,
            background: C.pRed,
            border: `4px dashed ${C.red}`,
            boxSizing: "border-box",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 70,
            color: C.tRed,
            opacity: fade(f, T(45.54), 6),
            scale: interpolate(gap, [0, 1], [0.9, 1]),
          }}
        >
          ?
        </div>
        <div
          style={{
            position: "absolute",
            right: IN.x,
            top: Y2 + H + 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontWeight: 700,
            fontSize: 30,
            color: C.tRed,
            opacity: fade(f, T(46.7), 6),
          }}
        >
          <Badge kind="ko" size={34} />
          Où sont passées les 3 heures ?
        </div>

        <div style={{ position: "absolute", left: IN.x, top: 590, display: "flex", alignItems: "baseline", gap: 26, whiteSpace: "nowrap" }}>
          <span style={{ fontWeight: 700, fontSize: 64, color: C.ink, opacity: fade(f, T(38.9), 6) }}>650 ÷ 840 =</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 150,
              lineHeight: 1,
              color: C.blue,
              opacity: fade(f, T(42.3), 4),
              scale: interpolate(big, [0, 1], [0.7, 1]),
              transformOrigin: "left 70%",
              display: "inline-block",
            }}
          >
            77 %
          </span>
          <span style={{ fontWeight: 600, fontSize: 34, color: C.blue, opacity: fade(f, T(42.6), 8) }}>de TRS</span>
        </div>
      </Widget>
    </Scene>
  );
};
