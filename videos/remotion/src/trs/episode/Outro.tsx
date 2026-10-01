// Fin · le logo Fichly s'écrit à nouveau au centre, sur son ruban (réponse à l'intro).
import type React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import { C } from "../fichly";
import { LogoFichly } from "../LogoFichly";
import { clamp, fade, OUT, pop, Scene } from "../ui";
import { CUTS, useG } from "./timeline";

export const Outro: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o) - CUTS.outro;
  const draw = interpolate(f, [4, 36], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ribbon = interpolate(f, [30, 48], [0, 1], { ...clamp, easing: OUT });
  return (
    <Scene>
      {/* le papier recouvre la scène et le logo du coin, le ruban du bas reste */}
      <Img
        src={staticFile("paper.png")}
        style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1062, objectFit: "cover", objectPosition: "top" }}
      />
      <LogoFichly width={640} draw={draw} dot={pop(f, 34)} style={{ position: "absolute", left: 640, top: 330 }} />
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 330 + 370,
          width: 640 * ribbon,
          height: 14,
          display: "flex",
          borderRadius: 7,
          overflow: "hidden",
          opacity: fade(f, 30, 4),
        }}
      >
        {C.ribbon.map((c) => (
          <i key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
    </Scene>
  );
};
