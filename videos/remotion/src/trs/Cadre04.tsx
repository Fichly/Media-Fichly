// Cadre 04 « Témoin n° 1 : la disponibilité » · script v2 · une seule idée : 12 h de marche sur 14 h requises.
// Un seul élément à regarder (la journée en blocs d'une heure), trois temps forts posés sur la voix.
// Décor : un widget du panneau de contrôle (voyant, « En direct »), dans la DA Fichly.
// Repères : videos/le-trs-en-3-minutes/audio/04-disponibilite-v2.cues.json (la voix démarre à VO s).
import type React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, FONT, KO_SVG } from "./fichly";

const FPS = 30;
const VO = 0.4;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const at = (s: number) => Math.round(s * FPS);
const cue = (t: number) => at(VO + t);
const fade = (frame: number, start: number, dur = 8) => interpolate(frame, [start, start + dur], [0, 1], clamp);
const pop = (frame: number, start: number) =>
  spring({ frame: frame - start, fps: FPS, config: { damping: 12, stiffness: 190, mass: 0.6 } });
const pulse = (frame: number, period = 30) => 0.5 + 0.5 * Math.cos((frame / period) * 2 * Math.PI);

// Les trois temps forts
const B1 = cue(4.15); // « deux heures » : deux blocs passent au rouge
const B2 = cue(8.04); // « une fois ces arrêts non planifiés enlevés » : ils sortent de la journée
const B3 = cue(11.0); // « douze heures sur quatorze », puis le chiffre
const COUNT = [cue(14.2), cue(15.5)];

// Le widget
const CARD = { x: 160, y: 150, w: 1600, h: 780 };
const ROW = { x: 70, y: 250, w: 1460, h: 130 };
const BW = ROW.w / 14;
const RED = [3, 9]; // les deux heures d'arrêt (position illustrative)

const Block: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const k = RED.indexOf(i);
  const isRed = k >= 0;
  const j = isRed ? 12 + k : i - RED.filter((r) => r < i).length; // place une fois les arrêts enlevés
  const red = isRed ? fade(frame, B1 + k * 4, 6) : 0;
  const bump = isRed ? interpolate(frame, [B1 + k * 4, B1 + k * 4 + 5, B1 + k * 4 + 11], [1, 1.07, 1], clamp) : 1;
  const out = isRed ? fade(frame, B2 + k * 4, 12) : 0; // le bloc rouge se soulève et s'efface
  const move = spring({ frame: frame - (B2 + 10 + (isRed ? 0 : j)), fps: FPS, config: { damping: 15, stiffness: 120 } });
  const x = interpolate(move, [0, 1], [i * BW, j * BW]);
  const badge = isRed ? pop(frame, B1 + k * 4 + 3) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: ROW.x + x,
        top: ROW.y - 70 * out,
        width: BW - 12,
        height: ROW.h,
        borderRadius: 18,
        background: interpolateColors(red, [0, 1], [C.blue, C.red]),
        opacity: 1 - out,
        scale: bump,
        display: "grid",
        placeItems: "center",
      }}
    >
      {isRed ? (
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: C.ink,
            backgroundImage: KO_SVG,
            backgroundSize: "100%",
            opacity: Math.min(1, badge),
            scale: interpolate(badge, [0, 1], [0.4, 1]),
          }}
        />
      ) : null}
    </div>
  );
};

// Accolade sous les blocs : 14 h requises, puis 12 h de marche et 2 h d'arrêt
const Brace: React.FC<{ from: number; to: number; color: string; label: string; opacity: number }> = ({
  from,
  to,
  color,
  label,
  opacity,
}) => (
  <div style={{ position: "absolute", left: ROW.x + from, top: ROW.y + ROW.h + 22, width: to - from, opacity }}>
    <div
      style={{
        height: 14,
        borderLeft: `4px solid ${color}`,
        borderRight: `4px solid ${color}`,
        borderBottom: `4px solid ${color}`,
        borderRadius: "0 0 8px 8px",
      }}
    />
    <div style={{ marginTop: 12, textAlign: "center", fontWeight: 700, fontSize: 30, color, whiteSpace: "nowrap" }}>{label}</div>
  </div>
);

const Widget: React.FC = () => {
  const frame = useCurrentFrame();
  const stopped = frame >= B1 && frame < B2;
  const after = fade(frame, B2 + 24, 10);
  const v = interpolate(frame, COUNT, [0, 85.7], { ...clamp, easing: Easing.out(Easing.cubic) });
  const statIn = fade(frame, COUNT[0] - 4, 6);
  return (
    <div
      style={{
        position: "absolute",
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: CARD.h,
        background: C.card,
        border: `2px solid ${C.line}`,
        borderRadius: 32,
        opacity: fade(frame, 0, 10),
        translate: `0px ${interpolate(frame, [0, 16], [30, 0], { ...clamp, easing: OUT })}px`,
      }}
    >
      {/* en-tête du widget : le voyant de la presse et « En direct » */}
      <div style={{ position: "absolute", left: 70, top: 46, display: "flex", alignItems: "center", gap: 18 }}>
        <i
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: stopped ? C.red : C.green,
            boxShadow: stopped ? `0 0 0 ${6 + 10 * (1 - pulse(frame, 12))}px rgba(241,105,105,.3)` : "none",
          }}
        />
        <span style={{ fontWeight: 700, fontSize: 32, color: C.ink }}>Presse · ligne 2</span>
      </div>
      <span
        style={{
          position: "absolute",
          right: 70,
          top: 44,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          borderRadius: 999,
          padding: "10px 22px",
          background: C.pLav,
          color: C.blue,
          fontWeight: 700,
          fontSize: 24,
        }}
      >
        <i style={{ width: 14, height: 14, borderRadius: "50%", background: C.green, opacity: 0.35 + 0.65 * pulse(frame) }} />
        En direct
      </span>
      <div style={{ position: "absolute", left: 70, right: 70, top: 128, height: 2, background: C.line }} />
      <div style={{ position: "absolute", left: 70, top: 170, fontWeight: 600, fontSize: 28, color: C.blue }}>
        La journée, heure par heure
      </div>

      {/* les deux heures enlevées laissent leur place en pointillés */}
      {[12, 13].map((j) => (
        <div
          key={j}
          style={{
            position: "absolute",
            left: ROW.x + j * BW,
            top: ROW.y,
            width: BW - 12,
            height: ROW.h,
            borderRadius: 18,
            border: `4px dashed ${C.red}`,
            boxSizing: "border-box",
            background: C.pRed,
            opacity: after,
          }}
        />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <Block key={i} i={i} />
      ))}

      <Brace from={0} to={14 * BW - 12} color={C.blue} label="14 h requises" opacity={1 - after} />
      <Brace from={0} to={12 * BW - 12} color={C.blue} label="12 h de marche" opacity={after} />
      <Brace from={12 * BW} to={14 * BW - 12} color={C.tRed} label="2 h d'arrêt" opacity={after} />

      {/* le résultat, en une ligne */}
      <div style={{ position: "absolute", left: 70, top: 560, display: "flex", alignItems: "baseline", gap: 28, whiteSpace: "nowrap" }}>
        <span style={{ fontWeight: 700, fontSize: 64, color: C.ink }}>
          <span style={{ opacity: fade(frame, B3, 6) }}>12 h</span>
          <span style={{ opacity: fade(frame, cue(11.91), 6) }}> ÷ 14 h</span>
        </span>
        <span style={{ fontWeight: 800, fontSize: 64, color: C.blue, opacity: statIn }}>=</span>
        <span style={{ fontWeight: 800, fontSize: 150, lineHeight: 1, color: C.tRed, fontVariantNumeric: "tabular-nums", opacity: statIn }}>
          {v.toFixed(1).replace(".", ",")} %
        </span>
        <span style={{ fontWeight: 600, fontSize: 32, color: C.blue, opacity: fade(frame, COUNT[1], 8) }}>de disponibilité</span>
      </div>
    </div>
  );
};

export const Cadre04: React.FC = () => {
  const frame = useCurrentFrame();
  const eyebrow = pop(frame, cue(0.13));
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f3f3", fontFamily: FONT, color: C.ink }}>
      <Img src={staticFile("paper.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 56,
          background: C.blue,
          color: "#ffffff",
          borderRadius: 999,
          padding: "10px 26px",
          fontWeight: 700,
          fontSize: 30,
          lineHeight: 1,
          transformOrigin: "left center",
          scale: interpolate(eyebrow, [0, 1], [0.6, 1]),
          opacity: fade(frame, cue(0.13), 4),
        }}
      >
        Témoin n° 1 · la disponibilité
      </div>
      <Widget />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: 18, display: "flex" }}>
        {C.ribbon.map((c) => (
          <i key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <Img src={staticFile("fichly-logo.png")} style={{ position: "absolute", right: 46, bottom: 36, width: 142 }} />
      <Audio src={staticFile("audio/04-disponibilite-v2.mp3")} from={at(VO)} premountFor={FPS} />
    </AbsoluteFill>
  );
};

export const Cadre04Composition: React.FC = () => (
  <Composition id="TRS-04-Disponibilite-v4" component={Cadre04} durationInFrames={at(18)} fps={FPS} width={1920} height={1080} />
);
