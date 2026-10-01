// Cadre 01 « L'affaire » · une idée : il manque plus de 3 heures.
// Voix : public/audio/v2/01-affaire.mp3 (repères : videos/le-trs-en-3-minutes/audio/v2/01-affaire.words.json)
import type React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "../fichly";
import { at, Eyebrow, fade, FPS, IN, pop, Scene, Widget } from "../ui";

const VO = 0.3;
const cue = (t: number) => at(VO + t);
export const S01_DURATION = at(9.7);

// La presse : elle frappe en continu, les pièces sortent à droite
const Presse: React.FC = () => {
  const frame = useCurrentFrame();
  const stroke = 0.5 - 0.5 * Math.cos((frame / 22) * 2 * Math.PI); // 0 en haut, 1 en bas
  return (
    <svg viewBox="0 0 460 520" width={460} height={520} style={{ position: "absolute", left: IN.x + 10, top: 190 }}>
      <rect x="40" y="20" width="380" height="90" rx="22" fill={C.blue} />
      <rect x="70" y="44" width="200" height="40" rx="10" fill="#ffffff" />
      <rect x="84" y="56" width={60 + 110 * ((frame % 90) / 90)} height="16" rx="8" fill={C.green} />
      <circle cx="372" cy="64" r="18" fill={C.green} />
      <rect x="60" y="110" width="44" height="300" rx="12" fill={C.blue} />
      <rect x="356" y="110" width="44" height="300" rx="12" fill={C.blue} />
      <rect x="196" y="110" width="68" height={40 + 90 * stroke} fill={C.blue} opacity=".85" />
      <rect x="150" y={150 + 90 * stroke} width="160" height="56" rx="10" fill="#ffffff" stroke={C.blue} strokeWidth="6" />
      <rect x="120" y="330" width="220" height="40" rx="10" fill={C.pLav} stroke={C.blue} strokeWidth="6" />
      <rect x="20" y="410" width="420" height="60" rx="16" fill={C.blue} />
      {[0, 1, 2].map((k) => {
        const t = ((frame + k * 30) % 90) / 90;
        return <rect key={k} x={200 + 260 * t} y="300" width="56" height="30" rx="7" fill={C.yellow} opacity={t < 0.85 ? 1 : (1 - t) / 0.15} />;
      })}
    </svg>
  );
};

export const S01Affaire: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 640; // colonne de droite, dans la carte
  const seize = pop(frame, cue(3.62));
  const trois = pop(frame, cue(6.32));
  const shake = interpolate(frame, [cue(6.32), cue(6.32) + 3, cue(6.32) + 6, cue(6.32) + 9], [0, -8, 6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const question = pop(frame, cue(7.48));
  return (
    <Scene>
      <Eyebrow text="L'affaire des 3 heures" start={cue(0)} />
      <Widget title="Presse · ligne 2" enter>
        <Presse />
        <div style={{ position: "absolute", left: x, top: 190, fontWeight: 600, fontSize: 30, color: C.blue, opacity: fade(frame, cue(1.3)) }}>
          Aujourd'hui, en 2 équipes
        </div>
        <div
          style={{
            position: "absolute",
            left: x,
            top: 236,
            display: "flex",
            alignItems: "baseline",
            gap: 22,
            opacity: fade(frame, cue(3.62), 4),
            scale: interpolate(seize, [0, 1], [0.7, 1]),
            transformOrigin: "left center",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 140, lineHeight: 1, color: C.blue }}>16 h</span>
          <span style={{ fontWeight: 600, fontSize: 36, color: C.blue }}>d'ouverture</span>
        </div>
        <div style={{ position: "absolute", left: x, top: 430, fontWeight: 700, fontSize: 44, color: C.ink, opacity: fade(frame, cue(5.3)) }}>
          Il manque plus de
        </div>
        <div
          style={{
            position: "absolute",
            left: x,
            top: 488,
            display: "flex",
            alignItems: "baseline",
            gap: 22,
            translate: `${shake}px 0px`,
            opacity: fade(frame, cue(6.32), 4),
            scale: interpolate(trois, [0, 1], [0.6, 1]),
            transformOrigin: "left center",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 140, lineHeight: 1, color: C.tRed }}>3 h</span>
          <span style={{ fontWeight: 600, fontSize: 36, color: C.tRed }}>de production</span>
        </div>
        <span
          style={{
            position: "absolute",
            left: x,
            top: 668,
            borderRadius: 999,
            padding: "14px 30px",
            background: C.pLav,
            color: C.blue,
            fontWeight: 700,
            fontSize: 38,
            whiteSpace: "nowrap",
            opacity: fade(frame, cue(7.48), 4),
            scale: interpolate(question, [0, 1], [0.6, 1]),
            transformOrigin: "left center",
          }}
        >
          Où sont-elles passées ?
        </span>
      </Widget>
      <Audio src={staticFile("audio/v2/01-affaire.mp3")} from={at(VO)} premountFor={FPS} />
    </Scene>
  );
};
