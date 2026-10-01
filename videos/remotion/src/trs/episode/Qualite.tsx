// Cadre 9 « Marche 3 : la qualité » · une idée : sur 680 pièces, 30 au rebut ou en retouche, 650 bonnes = 95,6 %.
// Une case = 10 pièces : 68 cases sortent, 3 passent au violet, les 65 autres au vert.
import type React from "react";
import { interpolate } from "remotion";
import { C, KO_SVG } from "../fichly";
import { clamp, count, Equation, Eyebrow, fade, fr, IN, mix, OUT, Pill, Scene, Widget } from "../ui";
import { T, useG } from "./timeline";

const COLS = 17;
const ROWS = 4;
const GAP = 12;
const TW = (IN.w - (COLS - 1) * GAP) / COLS;
const TH = 54;
const Y0 = 180;
const BAD = [11, 30, 56];
export const PV = "#f3e9f5"; // violet pâle (pièces mauvaises)
export const TV = "#6b3a73";

export const Qualite: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const value = count(f, T(123.4), T(124.5), 95.6);
  return (
    <Scene>
      <Eyebrow text="Marche 3 · la qualité" start={T(113.64)} />
      <Widget title="Presse · ligne 2 · contrôle qualité">
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const enter = T(116.18) + i * 0.35;
          const k = BAD.indexOf(i);
          const bad = k >= 0 ? interpolate(f, [T(117.78) + k * 4, T(117.78) + k * 4 + 8], [0, 1], clamp) : 0;
          const goodAt = T(120.7) + (col + row) * 0.9;
          const good = k < 0 ? interpolate(f, [goodAt, goodAt + 8], [0, 1], clamp) : 0;
          const bump = k >= 0 ? interpolate(f, [T(117.78) + k * 4, T(117.78) + k * 4 + 5, T(117.78) + k * 4 + 10], [1, 1.15, 1], clamp) : 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: IN.x + col * (TW + GAP),
                top: Y0 + row * (TH + GAP),
                width: TW,
                height: TH,
                borderRadius: 12,
                background: k >= 0 ? mix(bad, C.blue, C.violet) : mix(good, C.blue, C.green),
                backgroundImage: bad > 0.5 ? KO_SVG : undefined,
                backgroundSize: "44px 44px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: fade(f, enter, 6),
                scale: bump,
                translate: `0px ${interpolate(f, [enter, enter + 10], [14, 0], { ...clamp, easing: OUT })}px`,
              }}
            />
          );
        })}

        <div style={{ position: "absolute", left: IN.x, top: Y0 + ROWS * (TH + GAP) + 24, display: "flex", gap: 16 }}>
          <Pill start={T(118.0)} bg={PV} fg={TV} badge="ko" badgeBg={C.violet}>
            30 au rebut ou en retouche
          </Pill>
          <Pill start={T(120.7)} bg={C.pGreen} fg={C.tGreen} badge="ok">
            650 bonnes
          </Pill>
        </div>
        <div
          style={{
            position: "absolute",
            right: IN.x,
            top: Y0 + ROWS * (TH + GAP) + 34,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontWeight: 600,
            fontSize: 26,
            color: C.muted,
            opacity: fade(f, T(116.8), 8),
          }}
        >
          <i style={{ width: 30, height: 22, borderRadius: 6, background: C.blue }} />1 case = 10 pièces
        </div>

        <Equation
          top={600}
          lhs="650 ÷ 680 ="
          lhsAt={T(122.26)}
          value={`${fr(value, 1)} %`}
          valueAt={T(123.4)}
          label="de qualité"
          labelAt={T(124.2)}
        />
      </Widget>
    </Scene>
  );
};
