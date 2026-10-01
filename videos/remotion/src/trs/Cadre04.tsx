// Cadre 04 « Témoin n° 1 : la disponibilité » · planche v3 en panneau de contrôle
// Langage de mouvement : les tuiles animées Fichly (TRS en temps réel, SMED, 5 pourquoi), références du 1er octobre 2026.
// Repères de voix : videos/le-trs-en-3-minutes/audio/04-disponibilite.words.json (la voix démarre à VO s).
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
import { C, FONT, KO_SVG, OK_SVG } from "./fichly";

const FPS = 30;
const VO = 0.6;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const at = (s: number) => Math.round(s * FPS); // seconde de la composition → image
const cue = (t: number) => at(VO + t); // seconde de la voix → image
const LAV = "rgba(255,255,255,.72)"; // texte secondaire sur fond bleu
const TRACK = "rgba(255,255,255,.16)";

const fade = (frame: number, start: number, dur = 8) => interpolate(frame, [start, start + dur], [0, 1], clamp);
const rise = (frame: number, start: number, px = 18, dur = 14) =>
  interpolate(frame, [start, start + dur], [px, 0], { ...clamp, easing: OUT });
const pop = (frame: number, start: number) =>
  spring({ frame: frame - start, fps: FPS, config: { damping: 12, stiffness: 190, mass: 0.6 } });
const pulse = (frame: number, period = 36) => 0.5 + 0.5 * Math.cos((frame / period) * 2 * Math.PI);

// ── Petits composants de la DA ──
const Badge: React.FC<{ kind: "ok" | "ko"; size?: number }> = ({ kind, size = 30 }) => (
  <span
    style={{
      display: "inline-block",
      verticalAlign: "middle",
      width: size,
      height: size,
      borderRadius: "50%",
      flex: "none",
      backgroundColor: kind === "ok" ? C.green : C.red,
      backgroundImage: kind === "ok" ? OK_SVG : KO_SVG,
      backgroundSize: "100%",
    }}
  />
);

// Texte écrit à la machine : la place est réservée dès le départ, le curseur suit la frappe
const Typed: React.FC<{ text: string; start: number; cps?: number }> = ({ text, start, cps = 30 }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / FPS) * cps)));
  const typing = frame >= start && n < text.length;
  return (
    <span style={{ whiteSpace: "pre" }}>
      {text.slice(0, n)}
      {typing ? (
        <span style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 1, top: "12%", height: "76%", width: 3, borderRadius: 2, background: "currentColor" }} />
        </span>
      ) : null}
      <span style={{ color: "transparent" }}>{text.slice(n)}</span>
    </span>
  );
};

const Live: React.FC<{ color?: string }> = ({ color = LAV }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontWeight: 600, fontSize: 19, color }}>
      <i style={{ width: 11, height: 11, borderRadius: "50%", background: C.green, opacity: 0.35 + 0.65 * pulse(frame, 30) }} />
      En direct
    </span>
  );
};

// Apparition d'un panneau (démarrage du tableau de bord)
const Panel: React.FC<{ x: number; y: number; w: number; h: number; delay: number; bg?: string; children: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  delay,
  bg = C.card,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: bg,
        border: bg === C.card ? `2px solid ${C.line}` : "none",
        borderRadius: 24,
        overflow: "hidden",
        opacity: fade(frame, delay, 10),
        translate: `0px ${rise(frame, delay, 26, 16)}px`,
      }}
    >
      {children}
    </div>
  );
};

// ── Fil d'enquête (les 5 étapes annoncées au cadre 02) ──
const STEPS = ["Le temps", "Les 3 témoins", "Le verdict", "Fausses pistes", "Les cousins"];
const Tracker: React.FC = () => {
  const frame = useCurrentFrame();
  const done0 = fade(frame, at(0.25), 6);
  const now1 = fade(frame, at(0.4), 6);
  return (
    <div style={{ position: "absolute", right: 46, top: 50, display: "flex", gap: 9 }}>
      {STEPS.map((s, i) => {
        const isDone = i === 0 && done0 > 0.5;
        const isNow = i === 1 && now1 > 0.5;
        const bg = i === 0 ? interpolateColors(done0, [0, 1], [C.blue, C.pGreen]) : i === 1 ? interpolateColors(now1, [0, 1], ["#ffffff", C.blue]) : "#ffffff";
        const fg = i === 0 ? interpolateColors(done0, [0, 1], ["#ffffff", C.tGreen]) : i === 1 ? interpolateColors(now1, [0, 1], [C.muted, "#ffffff"]) : C.muted;
        const b = i === 0 ? pop(frame, at(0.25)) : i === 1 ? pop(frame, at(0.4)) : 1;
        return (
          <span
            key={s}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              borderRadius: 999,
              padding: "6px 16px 6px 6px",
              fontWeight: 700,
              fontSize: 20,
              lineHeight: 1,
              background: bg,
              color: fg,
              border: `2px solid ${i > 1 ? C.line : bg}`,
              whiteSpace: "nowrap",
            }}
          >
            {isDone ? (
              <span style={{ scale: interpolate(b, [0, 1], [0.4, 1]) }}>
                <Badge kind="ok" size={30} />
              </span>
            ) : (
              <i
                style={{
                  display: "inline-grid",
                  placeItems: "center",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  fontStyle: "normal",
                  fontSize: 16,
                  background: isNow ? "#ffffff" : C.pLav,
                  color: C.blue,
                  scale: i === 1 ? interpolate(b, [0, 1], [0.6, 1]) : 1,
                }}
              >
                {i + 1}
              </i>
            )}
            {s}
            {i === 1 ? (
              <span style={{ display: "inline-flex", gap: 5, marginLeft: 3, opacity: now1 }}>
                {[0, 1, 2].map((k) => (
                  <b
                    key={k}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "currentColor",
                      opacity: k === 0 ? interpolate(frame, [cue(0), cue(0) + 6], [0.35, 1], clamp) : 0.35,
                    }}
                  />
                ))}
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

// ── La journée de la presse : balayage des 14 h requises, trois arrêts subis ──
// Les arrêts (40 min chacun, 2 h au total) ralentissent le balayage : un arrêt, ça dure.
const STOPS: [number, number][] = [
  [1.0, 1.0 + 2 / 3],
  [5.2, 5.2 + 2 / 3],
  [9.3, 9.3 + 2 / 3],
];
const SWEEP_T = [1.85, 1.98, 2.48, 2.8, 3.3, 3.54, 4.04, 4.45].map(cue);
const SWEEP_H = [0, STOPS[0][0], STOPS[0][1], STOPS[1][0], STOPS[1][1], STOPS[2][0], STOPS[2][1], 14];
const hourAt = (frame: number) => interpolate(frame, SWEEP_T, SWEEP_H, clamp);
const stopIndex = (frame: number) => {
  if (frame < SWEEP_T[0] || frame >= SWEEP_T[SWEEP_T.length - 1]) return -1;
  const h = hourAt(frame);
  return STOPS.findIndex(([a, b]) => h >= a && h < b);
};
const runFrames = (frame: number) => {
  let n = 0;
  for (let i = 0; i < frame; i++) if (stopIndex(i) < 0) n++;
  return n;
};
const CAUSES = ["Panne", "Manque matière", "Réglage imprévu"];
const CAUSE_AT = [1.98, 2.8, 3.54].map(cue);

// Repères de la carte « Vue atelier » (coordonnées de la page)
const AT_X = 61;
const AT_Y = 132;
const STRIP = { x: 32, y: 350, w: 1025, h: 52 };
const BW = STRIP.w / 14;

const Station: React.FC<{ x: number; label: string; light: string; children: React.ReactNode }> = ({ x, label, light, children }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: x,
        top: 96,
        width: 130,
        height: 104,
        borderRadius: 18,
        background: "#ffffff",
        border: `2px solid ${C.line}`,
        display: "grid",
        placeItems: "center",
      }}
    >
      {children}
      <i style={{ position: "absolute", right: 10, top: 10, width: 14, height: 14, borderRadius: "50%", background: light }} />
    </div>
    <div style={{ position: "absolute", left: x, width: 130, top: 214, textAlign: "center", fontWeight: 600, fontSize: 19, color: C.ink }}>
      {label}
    </div>
  </>
);

const Atelier: React.FC = () => {
  const frame = useCurrentFrame();
  const stop = stopIndex(frame);
  const stopped = stop >= 0;
  const run = runFrames(frame);
  const h = hourAt(frame);
  const sweepOn = fade(frame, SWEEP_T[0] - 6, 6) * (1 - fade(frame, SWEEP_T[SWEEP_T.length - 1] + 4, 8));
  const others = stopped ? C.yellow : C.green;
  const ram = stopped ? 0 : Math.sin((run / 22) * 2 * Math.PI);
  // dernier arrêt commencé : la pilule « Arrêt » rebondit à chaque nouvel arrêt
  const lastStop = STOPS.reduce((acc, [a], i) => (h >= a && frame >= SWEEP_T[0] ? i : acc), -1);
  const stopStart = lastStop >= 0 ? SWEEP_T[1 + lastStop * 2] : 0;
  const arretPop = pop(frame, stopStart);
  const total = pop(frame, cue(4.62));

  return (
    <Panel x={AT_X} y={AT_Y} w={1089} h={440} delay={0}>
      <div style={{ position: "absolute", left: 32, top: 24, fontWeight: 700, fontSize: 22, color: C.blue }}>Vue atelier · ligne 2</div>

      {/* convoyeur et pièces : il avance quand la presse tourne, il se fige quand elle s'arrête */}
      <div style={{ position: "absolute", left: 32, top: 141, width: 738, height: 14, borderRadius: 7, background: C.pLav }} />
      {Array.from({ length: 17 }).map((_, i) => {
        const span = 738 + 46;
        const x = 32 + ((i * 46 + run * 3.4) % span) - 23;
        return x < 32 || x > 752 ? null : (
          <i key={i} style={{ position: "absolute", left: x, top: 139, width: 18, height: 18, borderRadius: 5, background: C.blue, opacity: 0.85 }} />
        );
      })}

      <Station x={32} label="Découpe" light={others}>
        <svg viewBox="0 0 60 60" width={58}>
          <circle cx="30" cy="30" r="20" fill="none" stroke={C.blue} strokeWidth="6" strokeDasharray="7 5" />
          <circle cx="30" cy="30" r="6" fill={C.blue} />
        </svg>
      </Station>
      <Station x={450} label="Soudure" light={others}>
        <svg viewBox="0 0 60 60" width={58}>
          <path d="M14 44 L30 18 L34 30 L46 14" fill="none" stroke={C.yellow} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="10" y="44" width="40" height="8" rx="4" fill={C.blue} />
        </svg>
      </Station>
      <Station x={639} label="Expédition" light={others}>
        <svg viewBox="0 0 60 60" width={58}>
          <rect x="10" y="18" width="40" height="32" rx="5" fill={C.yellow} />
          <rect x="26" y="18" width="8" height="14" fill="#ffffff" fillOpacity=".7" />
        </svg>
      </Station>

      {/* la presse, le témoin : elle frappe quand elle tourne */}
      <div
        style={{
          position: "absolute",
          left: 213,
          top: 72,
          width: 186,
          height: 152,
          borderRadius: 22,
          background: C.blue,
          outline: `4px solid ${stopped ? C.red : C.blue}`,
          outlineOffset: 5,
        }}
      >
        <div style={{ position: "absolute", left: 22, right: 50, top: 18, height: 16, borderRadius: 6, background: "#ffffff", opacity: 0.9 }} />
        <div
          style={{
            position: "absolute",
            left: 58,
            width: 70,
            top: 40 + 22 * (0.5 + 0.5 * ram),
            height: 34,
            borderRadius: 8,
            background: "#ffffff",
          }}
        />
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 18, height: 14, borderRadius: 6, background: "rgba(255,255,255,.3)" }} />
        <i
          style={{
            position: "absolute",
            right: 14,
            top: 15,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: stopped ? C.red : C.green,
            boxShadow: stopped ? `0 0 0 ${6 + 10 * (1 - pulse(frame, 10))}px rgba(241,105,105,.35)` : "none",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 213, width: 186, top: 236, textAlign: "center", fontWeight: 700, fontSize: 21, color: C.blue }}>
        Presse
      </div>
      {stopped ? (
        <div style={{ position: "absolute", left: 213, width: 186, top: 104, display: "flex", justifyContent: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              padding: "7px 16px 7px 7px",
              background: C.red,
              color: C.ink,
              fontWeight: 700,
              fontSize: 22,
              scale: interpolate(arretPop, [0, 1], [0.5, 1]),
            }}
          >
            <Badge kind="ko" size={28} />
            Arrêt
          </span>
        </div>
      ) : null}

      {/* journal des arrêts, écrit à la machine sur les mots de la voix */}
      <div style={{ position: "absolute", left: 812, top: 24, fontWeight: 700, fontSize: 22, color: C.blue }}>Journal des arrêts</div>
      <div
        style={{
          position: "absolute",
          left: 812,
          top: 76,
          fontWeight: 600,
          fontSize: 19,
          color: C.muted,
          opacity: 1 - fade(frame, CAUSE_AT[0] - 4, 4),
        }}
      >
        Aucun arrêt pour l'instant
      </div>
      {CAUSES.map((c, i) => {
        const p = pop(frame, CAUSE_AT[i]);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: 812,
              top: 72 + i * 50,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontWeight: 700,
              fontSize: 22,
              color: C.tRed,
              opacity: fade(frame, CAUSE_AT[i], 3),
            }}
          >
            <span style={{ scale: interpolate(p, [0, 1], [0.4, 1]) }}>
              <Badge kind="ko" size={30} />
            </span>
            <Typed text={c} start={CAUSE_AT[i] + 2} cps={34} />
          </div>
        );
      })}
      <span
        style={{
          position: "absolute",
          left: 812,
          top: 232,
          borderRadius: 999,
          padding: "9px 18px",
          background: C.pRed,
          color: C.tRed,
          fontWeight: 700,
          fontSize: 22,
          whiteSpace: "nowrap",
          opacity: fade(frame, cue(4.62), 3),
          scale: interpolate(total, [0, 1], [0.6, 1]),
          transformOrigin: "left center",
        }}
      >
        = 2 h d'arrêts subis
      </span>

      {/* la journée : 14 blocs d'une heure, remplis par la tête de lecture */}
      <div style={{ position: "absolute", left: 32, top: 312, fontWeight: 600, fontSize: 19, color: C.blue }}>La journée · 14 h requises</div>
      {Array.from({ length: 14 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, h - i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: STRIP.x + i * BW,
              top: STRIP.y,
              width: BW - 6,
              height: STRIP.h,
              borderRadius: 10,
              background: C.pLav,
              overflow: "hidden",
            }}
          >
            <div style={{ width: `${fill * 100}%`, height: "100%", background: C.blue }} />
          </div>
        );
      })}
      {STOPS.map(([a, b], i) => {
        const shown = Math.max(0, Math.min(b, h) - a);
        const flown = fade(frame, cue(4.95) + i * 3, 4);
        return shown > 0 ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: STRIP.x + a * BW,
              top: STRIP.y,
              width: shown * BW,
              height: STRIP.h,
              borderRadius: 6,
              background: interpolateColors(flown, [0, 1], [C.red, C.pRed]),
              outline: flown > 0.5 ? `2px dashed ${C.red}` : "none",
              outlineOffset: -2,
            }}
          />
        ) : null;
      })}
      <div style={{ position: "absolute", left: STRIP.x + h * BW - 2, top: STRIP.y - 14, width: 4, height: STRIP.h + 28, borderRadius: 2, background: C.ink, opacity: sweepOn }}>
        <i style={{ position: "absolute", left: -6, top: -8, width: 16, height: 16, borderRadius: "50%", background: C.ink }} />
      </div>
    </Panel>
  );
};

// ── La cascade des temps (carte du bas) ──
const CA_X = 61;
const CA_Y = 600;
const KH = 40; // 1 h = 40 px
const X0 = 32;
const ROW = [64, 118, 172, 226, 280];
const BH = 42;
const SEG_X = CA_X + X0 + 12 * KH; // tranche rouge « −2 h » de la ligne 3, en coordonnées de la page
const SEG_Y = CA_Y + ROW[2];

const Bar: React.FC<{ y: number; w: number; bg: string; fg: string; border?: string; children?: React.ReactNode }> = ({ y, w, bg, fg, border, children }) => (
  <div
    style={{
      position: "absolute",
      left: X0,
      top: y,
      width: w,
      height: BH,
      borderRadius: 10,
      background: bg,
      color: fg,
      border,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      paddingLeft: 18,
      fontWeight: 700,
      fontSize: 22,
      whiteSpace: "nowrap",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

const Ghost: React.FC<{ y: number; text: string; opacity?: number }> = ({ y, text, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: X0,
      top: y,
      width: 16 * KH,
      height: BH,
      borderRadius: 10,
      border: "2px dashed rgba(74,74,160,.35)",
      boxSizing: "border-box",
      color: "rgba(74,74,160,.6)",
      display: "flex",
      alignItems: "center",
      paddingLeft: 18,
      fontWeight: 600,
      fontSize: 20,
      opacity,
    }}
  >
    {text}
  </div>
);

const Cascade: React.FC = () => {
  const frame = useCurrentFrame();
  const band = fade(frame, cue(0.92), 8);
  const grow = interpolate(frame, [cue(5.88), cue(6.62)], [0, 12 * KH - 2], { ...clamp, easing: OUT });
  const landed = fade(frame, cue(5.5), 4);
  const perte = pop(frame, cue(10.15));
  const bump = interpolate(perte, [0, 0.5, 1], [1, 1.08, 1]);
  return (
    <Panel x={CA_X} y={CA_Y} w={1089} h={350} delay={4}>
      <div style={{ position: "absolute", left: 32, top: 20, fontWeight: 700, fontSize: 22, color: C.blue }}>La cascade des temps</div>
      <Bar y={ROW[0]} w={16 * KH} bg={C.card} fg={C.blue} border={`3px solid ${C.blue}`}>
        Temps d'ouverture · 16 h
      </Bar>
      <Bar y={ROW[1]} w={14 * KH - 2} bg={C.blue} fg="#ffffff">
        Temps requis · 14 h
      </Bar>
      <div
        style={{
          position: "absolute",
          left: X0 + 14 * KH + 2,
          top: ROW[1],
          width: 2 * KH - 4,
          height: BH,
          borderRadius: 10,
          background: C.pLav,
          outline: `3px dashed ${C.blue}`,
          outlineOffset: -3,
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          fontSize: 20,
          color: C.blue,
        }}
      >
        2 h
      </div>
      <div style={{ position: "absolute", left: X0 + 16 * KH + 14, top: ROW[1], height: BH, display: "flex", alignItems: "center", fontWeight: 700, fontSize: 20, color: C.blue }}>
        prévues
      </div>

      {/* ligne 3 : le témoin n° 1 */}
      <div style={{ position: "absolute", left: 14, top: ROW[2] - 9, width: 1061, height: BH + 18, borderRadius: 16, background: C.pRed, opacity: band }} />
      <Ghost y={ROW[2]} text="Témoin n° 1 · ?" opacity={1 - landed} />
      {grow > 0 ? (
        <Bar y={ROW[2]} w={grow} bg={C.blue} fg="#ffffff">
          <Typed text="Temps de fonctionnement · 12 h" start={cue(6.0)} cps={44} />
        </Bar>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: X0 + 12 * KH + 2,
          top: ROW[2],
          width: 2 * KH - 4,
          height: BH,
          borderRadius: 10,
          background: C.red,
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          fontSize: 20,
          color: C.ink,
          opacity: landed,
          scale: bump,
        }}
      >
        −2 h
      </div>
      <div style={{ position: "absolute", left: X0 + 14 * KH + 14, top: ROW[2], height: BH, display: "flex", alignItems: "center", fontWeight: 700, fontSize: 20, color: C.tRed }}>
        <Typed text="arrêts subis" start={cue(5.55)} cps={30} />
      </div>
      <Ghost y={ROW[3]} text="Témoin n° 2 · ?" />
      <Ghost y={ROW[4]} text="Témoin n° 3 · ?" />
    </Panel>
  );
};

// Les trois arrêts quittent la journée et tombent dans la cascade, comme les blocs du SMED
const Flyers: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {STOPS.map(([a], i) => {
        const start = cue(4.95) + i * 3;
        const p = spring({ frame: frame - start, fps: FPS, config: { damping: 16, stiffness: 110, mass: 0.8 } });
        if (frame < start || frame > cue(5.5) + 2) return null;
        const x0 = AT_X + STRIP.x + a * BW;
        const y0 = AT_Y + STRIP.y;
        const x1 = SEG_X + 2 + i * ((2 * KH - 4) / 3);
        const y1 = SEG_Y;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: interpolate(p, [0, 1], [x0, x1]),
              top: interpolate(p, [0, 1], [y0, y1]) - 70 * Math.sin(Math.PI * Math.min(1, p)),
              width: interpolate(p, [0, 1], [(2 / 3) * BW, (2 * KH - 4) / 3]),
              height: interpolate(p, [0, 1], [STRIP.h, BH]),
              borderRadius: 8,
              background: C.red,
              boxShadow: "none",
            }}
          />
        );
      })}
    </>
  );
};

// ── La jauge « en direct » (d'après la tuile « TRS en temps réel ») ──
const G_X = 1190;
const G_Y = 132;
const GW = 669;
const CX = GW / 2;
const CY = 372;
const R = 214;
const SW = 40;
const A0 = 150; // l'arc va de 150° à 390° (240°)
const pt = (deg: number) => {
  const r = (deg * Math.PI) / 180;
  return [CX + R * Math.cos(r), CY + R * Math.sin(r)];
};
const arc = (p: number) => {
  if (p <= 0) return "";
  const [x0, y0] = pt(A0);
  const [x1, y1] = pt(A0 + 240 * p);
  return `M ${x0} ${y0} A ${R} ${R} 0 ${240 * p > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};
const pct = (v: number) => `${v.toFixed(1).replace(".", ",")} %`;

const Gauge: React.FC = () => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [cue(8.46), cue(10.0)], [0, 85.7], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lit = fade(frame, cue(7.8), 6);
  const perte = pop(frame, cue(10.15));
  const bars = [
    { name: "Dispo", value: v, on: true },
    { name: "Perf.", value: 0, on: false },
    { name: "Qualité", value: 0, on: false },
  ];
  return (
    <Panel x={G_X} y={G_Y} w={GW} h={818} delay={8} bg={C.blue}>
      <div style={{ position: "absolute", left: 36, top: 30, fontWeight: 600, fontSize: 19, color: LAV }}>Presse · ligne 2 · mardi</div>
      <div style={{ position: "absolute", right: 36, top: 28 }}>
        <Live />
      </div>

      <svg width={GW} height={560} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={arc(1)} fill="none" stroke={TRACK} strokeWidth={SW} strokeLinecap="round" />
        {v > 0 ? <path d={arc(v / 100)} fill="none" stroke={C.red} strokeWidth={SW} strokeLinecap="round" /> : null}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 252, textAlign: "center", fontWeight: 700, fontSize: 21, letterSpacing: 2, color: LAV }}>
        <Typed text="DISPONIBILITÉ" start={cue(0.95)} cps={26} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 284,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 100,
          lineHeight: 1,
          color: interpolateColors(lit, [0, 1], ["rgba(255,255,255,.35)", "#ffffff"]),
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {pct(v)}
      </div>
      {/* le calcul, en mots puis en chiffres */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 402, textAlign: "center", fontWeight: 600, fontSize: 20, color: LAV }}>
        <Typed text="fonctionnement ÷ requis" start={cue(5.9)} cps={36} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 432, textAlign: "center", fontWeight: 700, fontSize: 34, color: "#ffffff" }}>
        <span style={{ opacity: fade(frame, cue(6.62), 4) }}>12 h</span>
        <span style={{ opacity: fade(frame, cue(7.02), 4) }}> ÷ 14 h</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 506, display: "flex", justifyContent: "center" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            borderRadius: 999,
            padding: "8px 20px 8px 8px",
            background: C.pRed,
            color: C.tRed,
            fontWeight: 700,
            fontSize: 24,
            opacity: fade(frame, cue(10.15), 3),
            scale: interpolate(perte, [0, 1], [0.5, 1]),
          }}
        >
          <Badge kind="ko" size={32} />
          Perte : 2 h
        </span>
      </div>

      {/* les trois témoins : seul le premier a parlé */}
      {bars.map((b, i) => {
        const x = 36 + i * 206;
        return (
          <div key={b.name} style={{ position: "absolute", left: x, top: 616, width: 186, opacity: b.on ? 1 : 0.55 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 19, color: LAV }}>
              <span>{b.name}</span>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>{b.on ? (v > 0 ? pct(v) : "…") : "à venir"}</span>
            </div>
            <div style={{ marginTop: 10, height: 12, borderRadius: 6, background: TRACK, overflow: "hidden" }}>
              <div style={{ width: `${b.value}%`, height: "100%", borderRadius: 6, background: C.red }} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 724, textAlign: "center", fontWeight: 500, fontSize: 19, color: LAV }}>
        TRS = Dispo × Perf. × Qualité
      </div>
    </Panel>
  );
};

export const Cadre04: React.FC = () => {
  const frame = useCurrentFrame();
  const eyebrow = pop(frame, cue(0));
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f3f3", fontFamily: FONT, color: C.ink }}>
      <Img src={staticFile("paper.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />

      <div
        style={{
          position: "absolute",
          left: 61,
          top: 48,
          background: C.blue,
          color: "#ffffff",
          borderRadius: 999,
          padding: "9px 23px",
          fontWeight: 700,
          fontSize: 25,
          lineHeight: 1,
          transformOrigin: "left center",
          scale: interpolate(eyebrow, [0, 1], [0.6, 1]),
          opacity: fade(frame, cue(0), 4),
        }}
      >
        Témoin n° 1 · la disponibilité
      </div>
      <Tracker />

      <Atelier />
      <Cascade />
      <Gauge />
      <Flyers />

      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: 18, display: "flex" }}>
        {C.ribbon.map((c) => (
          <i key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <Img src={staticFile("fichly-logo.png")} style={{ position: "absolute", right: 46, bottom: 36, width: 142 }} />

      <Audio src={staticFile("audio/04-disponibilite.mp3")} from={at(VO)} premountFor={FPS} />
    </AbsoluteFill>
  );
};

export const Cadre04Composition: React.FC = () => (
  <Composition id="TRS-04-Disponibilite-v3" component={Cadre04} durationInFrames={at(14)} fps={FPS} width={1920} height={1080} />
);
