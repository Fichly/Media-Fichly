// Cadre 8 « Marche 2 : la performance » · une idée : 680 pièces sorties sur 720 attendues en 12 h = 94,4 %.
// Même langage que le cadre 4 : deux barres qui se comparent, l'écart en jaune (les ralentissements).
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { clamp, count, Equation, Eyebrow, fade, fr, IN, OUT, pop, Pill, Scene, Widget } from "../ui";
import { T, useG } from "./timeline";

const H = 110;
const Y1 = 230;
const Y2 = 390;
const DONE = Math.round((IN.w * 680) / 720);

const Bar: React.FC<{ y: number; w: number; bg: string; fg: string; dashed?: string; children: React.ReactNode }> = ({
  y,
  w,
  bg,
  fg,
  dashed,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: IN.x,
      top: y,
      width: w,
      height: H,
      borderRadius: 18,
      background: bg,
      border: dashed ? `4px dashed ${dashed}` : "none",
      boxSizing: "border-box",
      color: fg,
      display: "flex",
      alignItems: "center",
      paddingLeft: Math.min(34, w),
      opacity: w > 10 ? 1 : 0,
      fontWeight: 700,
      fontSize: 40,
      whiteSpace: "nowrap",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

export const Performance: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const w1 = interpolate(f, [T(101.4), T(101.4) + 20], [0, IN.w], { ...clamp, easing: OUT });
  const w2 = interpolate(f, [T(104.46), T(104.46) + 20], [0, DONE], { ...clamp, easing: OUT });
  const n1 = Math.round(count(f, T(102.94), T(103.5), 720));
  const n2 = Math.round(count(f, T(104.82), T(105.48), 680));
  const gap = pop(f, T(106.14));
  const value = count(f, T(111.46), T(112.6), 94.4);
  return (
    <Scene>
      <Eyebrow text="Marche 2 · la performance" start={T(97.5)} />
      <Widget title="Presse · ligne 2 · compteur de pièces" light={f >= T(106.14) ? "yellow" : "green"}>
        <span
          style={{
            position: "absolute",
            left: IN.x,
            top: 158,
            borderRadius: 999,
            padding: "8px 20px",
            background: C.pLav,
            color: C.blue,
            fontWeight: 700,
            fontSize: 26,
            opacity: fade(f, T(99.78), 6),
          }}
        >
          1 pièce par minute × 12 h de fonctionnement
        </span>

        <Bar y={Y1} w={w1} bg={C.pLav} fg={C.blue} dashed={C.blue}>
          <span style={{ fontVariantNumeric: "tabular-nums", opacity: fade(f, T(102.94), 4) }}>{n1}&nbsp;</span>
          <span style={{ opacity: fade(f, T(101.4) + 10, 6) }}>pièces attendues</span>
        </Bar>
        <Bar y={Y2} w={w2} bg={C.blue} fg="#ffffff">
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{n2}&nbsp;</span>
          pièces sorties
        </Bar>

        {/* l'écart : 40 pièces perdues en route, sans que la machine s'arrête */}
        <div
          style={{
            position: "absolute",
            left: IN.x + DONE + 10,
            top: Y2,
            width: IN.w - DONE - 10,
            height: H,
            borderRadius: 18,
            background: C.pYellow,
            border: `4px dashed ${C.yellow}`,
            boxSizing: "border-box",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 26,
            whiteSpace: "nowrap",
            color: C.tYellow,
            opacity: fade(f, T(106.14), 6),
            scale: interpolate(gap, [0, 1], [0.85, 1]),
          }}
        >
          −40
        </div>
        <div style={{ position: "absolute", left: IN.x, top: Y2 + H + 26, display: "flex", gap: 16 }}>
          <Pill start={T(106.28)} bg={C.pYellow} fg={C.tYellow} badge="ko" badgeBg={C.yellow}>
            Des micro-arrêts
          </Pill>
          <Pill start={T(107.38)} bg={C.pYellow} fg={C.tYellow} badge="ko" badgeBg={C.yellow}>
            Une cadence un peu lente
          </Pill>
        </div>

        <Equation
          top={600}
          lhs="680 ÷ 720 ="
          lhsAt={T(110.32)}
          value={`${fr(value, 1)} %`}
          valueAt={T(111.46)}
          label="de performance"
          labelAt={T(112.3)}
        />
      </Widget>
    </Scene>
  );
};
