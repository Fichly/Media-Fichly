// Cadre 14 « TRS, TRG, TRE » · une idée : les trois taux ont le même numérateur (10 h 50 de pièces bonnes) ;
// seul change le temps par lequel on divise.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { clamp, Eyebrow, fade, IN, OUT, pop, Scene, Typed, Widget } from "../ui";
import { T, useG } from "./timeline";

const X = 520; // début de la fraction, dans la carte
const W = 940;
const RATES = [
  { name: "TRS", at: 173.36 },
  { name: "TRG", at: 175.22 },
  { name: "TRE", at: 176.28 },
];

export const MemeNumerateur: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const num = pop(f, T(178.24));
  const den = pop(f, T(170.84));
  const bar = interpolate(f, [T(170.0), T(170.0) + 12], [0, W], { ...clamp, easing: OUT });
  return (
    <Scene>
      <Eyebrow text="TRS, TRG, TRE" start={T(168.27)} />
      <Widget title="Trois taux, une même question" light="none">
        {RATES.map((r, i) => {
          const p = pop(f, T(r.at));
          return (
            <div
              key={r.name}
              style={{
                position: "absolute",
                left: IN.x + 20,
                top: 200 + i * 140,
                width: 230,
                height: 100,
                borderRadius: 999,
                background: C.blue,
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 58,
                opacity: fade(f, T(r.at), 4),
                scale: interpolate(p, [0, 1], [0.6, 1]),
              }}
            >
              {r.name}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 365,
            top: 330,
            fontWeight: 800,
            fontSize: 110,
            lineHeight: 1,
            color: C.ink,
            opacity: fade(f, T(177.3), 8),
          }}
        >
          =
        </div>

        {/* le numérateur : le même pour les trois */}
        <div
          style={{
            position: "absolute",
            left: X,
            width: W,
            top: 230,
            height: 110,
            borderRadius: 24,
            border: `4px dashed ${C.line}`,
            boxSizing: "border-box",
            opacity: fade(f, T(170.0), 8) * (1 - fade(f, T(178.24), 4)),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: X,
            width: W,
            top: 230,
            height: 110,
            borderRadius: 24,
            background: C.pGreen,
            color: C.tGreen,
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 54,
            opacity: fade(f, T(178.24), 4),
            scale: interpolate(num, [0, 1], [0.8, 1]),
          }}
        >
          10 h 50 de pièces bonnes
        </div>
        <div style={{ position: "absolute", left: X, top: 382, width: bar, height: 8, borderRadius: 4, background: C.ink }} />
        {/* le dénominateur : c'est lui qui change */}
        <div
          style={{
            position: "absolute",
            left: X,
            width: W,
            top: 420,
            height: 110,
            borderRadius: 24,
            background: C.pLav,
            border: `4px dashed ${C.blue}`,
            boxSizing: "border-box",
            color: C.blue,
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 54,
            opacity: fade(f, T(170.84), 4),
            scale: interpolate(den, [0, 1], [0.8, 1]),
          }}
        >
          Divisé par quel temps ?
        </div>

        <div style={{ position: "absolute", left: IN.x, top: 650, fontWeight: 700, fontSize: 40, color: C.ink }}>
          <Typed text="Tout dépend du temps par lequel on divise." start={T(169.38)} cps={34} />
        </div>
      </Widget>
    </Scene>
  );
};
