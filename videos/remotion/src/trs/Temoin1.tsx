// Comparatif · cadre 04 « Témoin n° 1 : la disponibilité » · version Remotion · DA Fichly
// Repères : videos/le-trs-en-3-minutes/audio/04-disponibilite.words.json (la voix démarre à 0,4 s).
import type React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, KO_SVG, OK_SVG } from "./fichly";

const VO_START = 0.4;
const HOURS = ["7h", "8h", "9h", "10h", "11h", "12h", "13h", "15h", "16h", "17h", "18h", "19h", "20h", "21h"];
const STOPS = ["9h", "17h"];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);

// Seconde de la voix → image de la composition
const useCue = () => {
  const { fps } = useVideoConfig();
  return (t: number) => Math.round((VO_START + t) * fps);
};

// Apparition « gommette » : petit dépassement puis pose
const usePop = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 170, mass: 0.7 } });
  return { scale: interpolate(s, [0, 1], [0.5, 1]), opacity: interpolate(frame - start, [0, 4], [0, 1], clamp) };
};

const Badge: React.FC<{ kind: "ok" | "ko" }> = ({ kind }) => (
  <span
    style={{
      width: 31,
      height: 31,
      borderRadius: "50%",
      flex: "none",
      backgroundColor: kind === "ok" ? C.green : C.red,
      backgroundImage: kind === "ok" ? OK_SVG : KO_SVG,
      backgroundSize: "100%",
    }}
  />
);

const Pill: React.FC<{ start: number; bg: string; fg: string; badge?: "ok" | "ko"; children: string }> = ({
  start,
  bg,
  fg,
  badge,
  children,
}) => {
  const pop = usePop(start);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        borderRadius: 999,
        padding: "10px 22px",
        fontWeight: 700,
        fontSize: 27,
        lineHeight: 1,
        whiteSpace: "nowrap",
        background: bg,
        color: fg,
        scale: pop.scale,
        opacity: pop.opacity,
      }}
    >
      {badge ? <Badge kind={badge} /> : null}
      {children}
    </span>
  );
};

const Hour: React.FC<{ label: string; index: number }> = ({ label, index }) => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const stopIndex = STOPS.indexOf(label);
  const stopAt = cue(4.62) + stopIndex * 5;
  const isStop = stopIndex >= 0;
  const flip = isStop ? interpolate(frame, [stopAt, stopAt + 9], [0, 1], clamp) : 0;
  const bump = isStop
    ? interpolate(frame, [stopAt, stopAt + 5, stopAt + 10], [1, 1.08, 1], clamp)
    : 1;
  // « La machine a tourné » : les heures travaillées sautillent en vague
  const waveAt = cue(5.88) + index;
  const lift = isStop ? 0 : interpolate(frame, [waveAt, waveAt + 5, waveAt + 10], [0, -7, 0], clamp);
  const enter = 2 + index * 0.75;
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        background: isStop ? `color-mix(in srgb, ${C.red} ${flip * 100}%, ${C.blue})` : C.blue,
        color: flip > 0.5 ? C.ink : "#fff",
        scale: bump,
        translate: `0px ${interpolate(frame, [enter, enter + 12], [18, 0], { ...clamp, easing: OUT }) + lift}px`,
        opacity: interpolate(frame, [enter, enter + 8], [0, 1], clamp),
      }}
    >
      <span style={{ position: "absolute", left: 9, top: 7, fontSize: 16, fontWeight: 600, opacity: 0.85 }}>{label}</span>
      {isStop ? (
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 11,
            textAlign: "center",
            fontSize: 19,
            fontWeight: 700,
            opacity: interpolate(frame, [stopAt + 4, stopAt + 11], [0, 1], clamp),
          }}
        >
          Arrêt
        </span>
      ) : null}
    </div>
  );
};

export const Temoin1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue();
  const eyebrow = usePop(cue(0));
  const num = usePop(cue(1.05));
  const statStart = cue(7.8);
  const statEnd = statStart + 2 * fps;
  const stat = interpolate(frame, [statStart, statEnd], [0, 85.7], { ...clamp, easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f3f3", fontFamily: FONT, color: C.ink }}>
      <Img src={staticFile("paper.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />

      {/* Étiquette du témoin */}
      <div
        style={{
          position: "absolute",
          left: 61,
          top: 61,
          background: C.blue,
          color: "#fff",
          borderRadius: 999,
          padding: "9px 23px",
          fontWeight: 700,
          fontSize: 25,
          lineHeight: 1,
          transformOrigin: "left center",
          scale: interpolate(eyebrow.scale, [0.5, 1], [0.6, 1]),
          opacity: eyebrow.opacity,
        }}
      >
        Témoin n° 1
      </div>

      {/* Carte du ruban des heures */}
      <div
        style={{
          position: "absolute",
          left: 61,
          top: 154,
          width: 1797,
          height: 300,
          background: C.card,
          border: `2px solid ${C.line}`,
          borderRadius: 24,
          translate: `0px ${interpolate(frame, [0, 15], [24, 0], { ...clamp, easing: OUT })}px`,
          opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 38,
            right: 38,
            top: 35,
            height: 123,
            display: "grid",
            gridTemplateColumns: "repeat(14, 1fr)",
            gap: 9,
          }}
        >
          {HOURS.map((h, i) => (
            <Hour key={h} label={h} index={i} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 38, top: 192, display: "flex", gap: 19 }}>
          <Pill start={cue(6.62)} bg={C.pGreen} fg={C.tGreen} badge="ok">
            12 h de fonctionnement
          </Pill>
          <Pill start={cue(5.2)} bg={C.pRed} fg={C.tRed} badge="ko">
            2 h d'arrêts subis
          </Pill>
        </div>
      </div>

      {/* Fiche du témoin */}
      <div
        style={{
          position: "absolute",
          left: 61,
          top: 518,
          width: 1037,
          height: 269,
          background: C.pRed,
          borderRadius: 24,
          padding: 38,
          translate: `0px ${interpolate(frame, [cue(0.92), cue(0.92) + 15], [46, 0], { ...clamp, easing: OUT })}px`,
          opacity: interpolate(frame, [cue(0.92), cue(0.92) + 10], [0, 1], clamp),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 19 }}>
          <span
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: C.blue,
              color: "#fff",
              fontWeight: 700,
              fontSize: 27,
              display: "grid",
              placeItems: "center",
              scale: num.scale,
              opacity: num.opacity,
            }}
          >
            1
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 40,
              lineHeight: 1.2,
              translate: `${interpolate(frame, [cue(1.12), cue(1.12) + 12], [-18, 0], { ...clamp, easing: OUT })}px 0px`,
              opacity: interpolate(frame, [cue(1.12), cue(1.12) + 10], [0, 1], clamp),
            }}
          >
            Disponibilité
          </span>
        </div>
        <div style={{ marginTop: 38, display: "flex", gap: 15 }}>
          <Pill start={cue(1.98)} bg="#fff" fg={C.tRed} badge="ko">
            Pannes
          </Pill>
          <Pill start={cue(2.8)} bg="#fff" fg={C.tRed} badge="ko">
            Manques matière
          </Pill>
          <Pill start={cue(3.54)} bg="#fff" fg={C.tRed} badge="ko">
            Réglages imprévus
          </Pill>
        </div>
      </div>

      {/* Le chiffre : il monte en grandissant sur « quatre-vingt-cinq virgule sept » */}
      <div
        style={{
          position: "absolute",
          left: 1171,
          top: 540,
          fontWeight: 800,
          fontSize: 182,
          lineHeight: 1,
          color: C.tRed,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: -1,
          whiteSpace: "nowrap",
          transformOrigin: "left 70%",
          opacity: interpolate(frame, [statStart, statStart + 7], [0, 1], clamp),
          scale: interpolate(frame, [statStart, statEnd], [0.72, 1], { ...clamp, easing: Easing.out(Easing.quad) }),
        }}
      >
        {stat.toFixed(1).replace(".", ",")} %
      </div>
      <div
        style={{
          position: "absolute",
          left: 1179,
          top: 760,
          fontWeight: 600,
          fontSize: 31,
          translate: `0px ${interpolate(frame, [cue(7.18), cue(7.18) + 12], [14, 0], { ...clamp, easing: OUT })}px`,
          opacity: interpolate(frame, [cue(7.18), cue(7.18) + 10], [0, 1], clamp),
        }}
      >
        12 h sur 14 h
      </div>

      {/* Ruban six couleurs et logo, fixes */}
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: 18, display: "flex" }}>
        {C.ribbon.map((c) => (
          <i key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <Img src={staticFile("fichly-logo.png")} style={{ position: "absolute", right: 46, bottom: 36, width: 142 }} />

      <Audio src={staticFile("audio/04-disponibilite.mp3")} from={Math.round(VO_START * fps)} premountFor={fps} />
    </AbsoluteFill>
  );
};

export const Temoin1Composition: React.FC = () => (
  <Composition
    id="TRS-04-Disponibilite"
    component={Temoin1}
    durationInFrames={360}
    fps={30}
    width={1920}
    height={1080}
  />
);
