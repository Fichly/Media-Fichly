// Cadre 3 « La méthode simple » · une idée : TRS = pièces bonnes ÷ pièces possibles au temps de cycle idéal.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { clamp, Eyebrow, fade, IN, OUT, pop, Scene, Widget } from "../ui";
import { T, useG } from "./timeline";

const X = 470; // début de la fraction, dans la carte
const W = 990;

export const Formule: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const num = pop(f, T(18.58));
  const bar = interpolate(f, [T(19.82), T(19.82) + 12], [0, W], { ...clamp, easing: OUT });
  const den = pop(f, T(19.82) + 4);
  return (
    <Scene>
      <Eyebrow text="Calcul n° 1 · la méthode simple" start={T(16.06)} />
      <Widget title="La méthode simple" light="none">
        <div style={{ position: "absolute", left: IN.x, top: 330, fontWeight: 800, fontSize: 110, lineHeight: 1, color: C.ink, opacity: fade(f, T(16.4), 8) }}>
          TRS =
        </div>
        <div
          style={{
            position: "absolute",
            left: X,
            width: W,
            top: 205,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 76,
            color: C.tGreen,
            opacity: fade(f, T(18.58), 4),
            scale: interpolate(num, [0, 1], [0.7, 1]),
          }}
        >
          <span style={{ background: C.pGreen, borderRadius: 24, padding: "8px 34px 14px" }}>Pièces bonnes</span>
        </div>
        <div style={{ position: "absolute", left: X, top: 382, width: bar, height: 8, borderRadius: 4, background: C.ink }} />
        <div
          style={{
            position: "absolute",
            left: X,
            width: W,
            top: 430,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 76,
            color: C.blue,
            opacity: fade(f, T(19.82) + 4, 4),
            scale: interpolate(den, [0, 1], [0.7, 1]),
          }}
        >
          <span style={{ background: C.pLav, borderRadius: 24, padding: "8px 34px 14px" }}>Pièces possibles</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: X,
            width: W,
            top: 572,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 40,
            color: C.blue,
            opacity: fade(f, T(20.98), 8),
            translate: `0px ${interpolate(f, [T(20.98), T(20.98) + 12], [12, 0], { ...clamp, easing: OUT })}px`,
          }}
        >
          au temps de cycle idéal
        </div>
      </Widget>
    </Scene>
  );
};
