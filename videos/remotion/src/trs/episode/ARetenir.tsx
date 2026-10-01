// Cadre 18 « À retenir » · une idée : TRS = temps utile ÷ temps requis ; il ne juge personne, il montre où chercher.
// Même mise en page que la méthode simple (cadre 3), pour que la règle se reconnaisse.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { clamp, Eyebrow, fade, IN, OUT, pop, Pill, Scene, Widget } from "../ui";
import { T, useG } from "./timeline";

const X = 470;
const W = 990;

export const ARetenir: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const num = pop(f, T(229.0));
  const bar = interpolate(f, [T(229.68), T(229.68) + 12], [0, W], { ...clamp, easing: OUT });
  const den = pop(f, T(230.66));
  return (
    <Scene>
      <Eyebrow text="À retenir" start={T(226.28)} />
      <Widget title="La règle" light="none">
        <div
          style={{
            position: "absolute",
            left: IN.x,
            top: 300,
            fontWeight: 800,
            fontSize: 110,
            lineHeight: 1,
            color: C.ink,
            opacity: fade(f, T(227.82), 8),
          }}
        >
          TRS =
        </div>
        <div
          style={{
            position: "absolute",
            left: X,
            width: W,
            top: 175,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 76,
            color: C.tGreen,
            opacity: fade(f, T(229.0), 4),
            scale: interpolate(num, [0, 1], [0.7, 1]),
          }}
        >
          <span style={{ background: C.pGreen, borderRadius: 24, padding: "8px 34px 14px" }}>Temps utile</span>
        </div>
        <div style={{ position: "absolute", left: X, top: 352, width: bar, height: 8, borderRadius: 4, background: C.ink }} />
        <div
          style={{
            position: "absolute",
            left: X,
            width: W,
            top: 400,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 76,
            color: C.blue,
            opacity: fade(f, T(230.66), 4),
            scale: interpolate(den, [0, 1], [0.7, 1]),
          }}
        >
          <span style={{ background: C.pLav, borderRadius: 24, padding: "8px 34px 14px" }}>Temps requis</span>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 610, display: "flex", justifyContent: "center", gap: 24 }}>
          <Pill start={T(231.76)} bg={C.pLav} fg={C.blue} size={32}>
            Il ne juge personne
          </Pill>
          <Pill start={T(233.08)} bg={C.blue} fg="#ffffff" badge="ok" size={32}>
            Il montre où chercher en premier
          </Pill>
        </div>
      </Widget>
    </Scene>
  );
};
