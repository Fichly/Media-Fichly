// Cadres 15 et 16 « Le TRG », puis « Le TRE » · une idée chacun, sur le même comparateur :
// les mêmes 10 h 50 de pièces bonnes, divisées par 14 h (TRS, 77 %), 16 h (TRG, 68 %) puis 24 h (TRE, 45 %).
// Le TRG compte la maintenance prévue comme une perte ; le TRE compte aussi les 8 h de fermeture, la capacité encore libre.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { Badge, clamp, count, Eyebrow, fade, IN, mix, OUT, pop, Pill, Scene, Typed, Widget } from "../ui";
import { T, useG } from "./timeline";

const X0 = IN.x + 200; // début des barres, dans la carte
const BW = 1000; // largeur de la plus longue barre
const H = 84;
const USEFUL = 10 + 5 / 6;
const ease = { ...clamp, easing: OUT };

// Un morceau de barre, entre deux heures
const Seg: React.FC<{
  k: number;
  y: number;
  from: number;
  to: number;
  bg: string;
  fg: string;
  dashed?: string;
  label?: string;
  opacity?: number;
}> = ({ k, y, from, to, bg, fg, dashed, label, opacity = 1 }) => {
  const w = Math.max(0, (to - from) * k - 10);
  return (
    <div
      style={{
        position: "absolute",
        left: X0 + from * k + 5,
        top: y + 6,
        width: w,
        height: H - 12,
        borderRadius: 11,
        background: bg,
        border: dashed ? `3px dashed ${dashed}` : "none",
        boxSizing: "border-box",
        color: fg,
        display: "grid",
        placeItems: "center",
        fontWeight: 700,
        fontSize: label ? Math.min(26, (w - 8) / (label.length * 0.62)) : 26,
        whiteSpace: "nowrap",
        overflow: "hidden",
        opacity: w > 6 ? opacity : 0,
      }}
    >
      {label}
    </div>
  );
};

type RowProps = {
  f: number;
  k: number;
  y: number;
  name: string;
  start: number; // le nom du taux
  grow: number; // la barre verte apparaît
  den: number; // durée du dénominateur, en heures
  pct: string;
  pctAt: number;
  dim: number;
  children?: React.ReactNode;
};

const Row: React.FC<RowProps> = ({ f, k, y, name, start, grow, den, pct, pctAt, dim, children }) => {
  const p = pop(f, start);
  const g = interpolate(f, [grow, grow + 16], [0, USEFUL], ease);
  const big = pop(f, pctAt);
  return (
    <div style={{ opacity: fade(f, start, 5) * dim }}>
      <div
        style={{
          position: "absolute",
          left: IN.x,
          top: y + 10,
          width: 160,
          height: 64,
          borderRadius: 999,
          background: C.blue,
          color: "#ffffff",
          display: "grid",
          placeItems: "center",
          fontWeight: 800,
          fontSize: 40,
          scale: interpolate(p, [0, 1], [0.6, 1]),
        }}
      >
        {name}
      </div>
      {/* le dénominateur : le cadre de la barre */}
      <div
        style={{
          position: "absolute",
          left: X0,
          top: y,
          width: den * k,
          height: H,
          borderRadius: 16,
          border: `3px solid ${C.blue}`,
          boxSizing: "border-box",
          opacity: fade(f, grow, 6),
        }}
      />
      <Seg k={k} y={y} from={0} to={g} bg={C.green} fg={C.tGreen} label={g > USEFUL * 0.6 ? "10 h 50" : undefined} />
      <Seg k={k} y={y} from={USEFUL} to={14} bg={C.pRed} fg={C.tRed} label="3 h 10" opacity={fade(f, grow + 12, 6)} />
      {children}
      <div
        style={{
          position: "absolute",
          right: IN.x,
          top: y - 4,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.2,
          color: C.blue,
          fontVariantNumeric: "tabular-nums",
          opacity: fade(f, pctAt, 4),
          scale: interpolate(big, [0, 1], [0.7, 1]),
          transformOrigin: "right center",
        }}
      >
        {pct}
      </div>
    </div>
  );
};

const Caption: React.FC<{ y: number; text: string; start: number; opacity?: number }> = ({ y, text, start, opacity = 1 }) => (
  <div style={{ position: "absolute", left: X0, top: y + H + 14, fontWeight: 600, fontSize: 27, color: C.blue, opacity }}>
    <Typed text={text} start={start} cps={42} />
  </div>
);

export const Comparateur: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const k = interpolate(f, [T(204.94), T(204.94) + 24], [BW / 16, BW / 24], { ...clamp, easing: OUT });
  const tre = f >= T(204.94);
  const dimTRS = interpolate(f, [T(188.32), T(188.32) + 10, T(204.94), T(204.94) + 10], [1, 0.55, 0.55, 0.4], clamp);
  const dimTRG = interpolate(f, [T(204.94), T(204.94) + 10], [1, 0.4], clamp);

  // TRG : la maintenance prévue devient une perte, le cadre s'étend aux 16 h d'ouverture
  const trgMaint = interpolate(f, [T(190.22), T(190.22) + 12], [14, 16], ease);
  const trgDen = interpolate(f, [T(194.34), T(194.34) + 14], [14, 16], ease);
  const swap = f >= T(202.16) && f < T(202.7) ? "panne" : "maint.";
  const passe = fade(f, T(200.16), 6);

  // TRE : les 8 h de fermeture, puis le cadre des 24 h ; enfin ces 8 h deviennent de la capacité libre
  const closed = interpolate(f, [T(207.52), T(207.52) + 14], [16, 24], ease);
  const treDen = interpolate(f, [T(209.9), T(209.9) + 14], [16, 24], ease);
  const free = interpolate(f, [T(216.88), T(216.88) + 10], [0, 1], clamp);

  const Y = [190, 370, 550];
  return (
    <Scene>
      <Eyebrow text="Le TRS et le TRG" start={T(180.2)} end={T(204.8)} />
      <Eyebrow text="Le TRE" start={T(204.94)} />
      <Widget title="10 h 50 de pièces bonnes, divisées par…" light="none">
        <Row
          f={f}
          k={k}
          y={Y[0]}
          name="TRS"
          start={T(180.36)}
          grow={T(180.5)}
          den={14}
          pct={`${Math.round(count(f, T(183.78), T(184.6), 77))} %`}
          pctAt={T(183.78)}
          dim={dimTRS}
        />
        <Caption y={Y[0]} text="÷ 14 h requises : quand on lui demande de produire" start={T(185.32)} opacity={dimTRS} />

        <Row
          f={f}
          k={k}
          y={Y[1]}
          name="TRG"
          start={T(188.44)}
          grow={T(188.6)}
          den={trgDen}
          pct={`${Math.round(count(f, T(195.7), T(196.5), 68))} %`}
          pctAt={T(195.7)}
          dim={dimTRG}
        >
          <Seg k={k} y={Y[1]} from={14} to={trgMaint} bg={C.red} fg={C.ink} label={trgMaint > 15.6 ? swap : undefined} />
        </Row>
        <Caption y={Y[1]} text="÷ 16 h d'ouverture : tout le temps où l'atelier est ouvert" start={T(196.82)} opacity={dimTRG * (1 - passe)} />
        <div style={{ position: "absolute", left: X0, top: Y[1] + H + 8, display: "flex", alignItems: "center", gap: 14, opacity: dimTRG * passe }}>
          <Badge kind="ok" size={34} />
          <span style={{ fontWeight: 700, fontSize: 27, color: C.tGreen }}>
            <Typed text="Pas de tour de passe-passe : panne ou maintenance, l'heure est perdue." start={T(200.3)} cps={42} />
          </span>
        </div>

        {tre ? (
          <Row
            f={f}
            k={k}
            y={Y[2]}
            name="TRE"
            start={T(204.94)}
            grow={T(205.1)}
            den={treDen}
            pct={`${Math.round(count(f, T(211.64), T(212.4), 45))} %`}
            pctAt={T(211.64)}
            dim={1}
          >
            <Seg k={k} y={Y[2]} from={14} to={16} bg={C.red} fg={C.ink} label="maint." opacity={fade(f, T(205.4), 6)} />
            <Seg
              k={k}
              y={Y[2]}
              from={16}
              to={closed}
              bg={mix(free, C.pLav, C.pGreen)}
              fg={free > 0.5 ? C.tGreen : C.blue}
              dashed={free > 0.5 ? C.green : C.blue}
              label={closed > 23 ? (free > 0.5 ? "8 h de capacité libre" : "8 h atelier fermé") : undefined}
            />
          </Row>
        ) : null}
        {tre ? <Caption y={Y[2]} text="÷ 24 h : toute la journée" start={T(212.7)} /> : null}
        {tre ? (
          <div style={{ position: "absolute", left: X0 + 20 * k, top: Y[2] + H + 22, translate: "-50% 0px" }}>
            <Pill start={T(220.08)} bg={C.green} fg={C.tGreen} size={26}>
              Une 3e équipe, par exemple
            </Pill>
          </div>
        ) : null}
      </Widget>
    </Scene>
  );
};
