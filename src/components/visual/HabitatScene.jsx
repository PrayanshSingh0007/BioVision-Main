import { useMemo, useState } from "react";
import plateRainforest from "../../assets/environments/jungle.webp";
import plateForest from "../../assets/environments/forest.webp";
import plateGrasslands from "../../assets/environments/grasslands.webp";
import plateDesert from "../../assets/environments/desert.webp";
import plateArctic from "../../assets/environments/arctic.webp";
import plateMountains from "../../assets/environments/mountains.webp";
import plateWetlands from "../../assets/environments/wetlands.webp";
import { makeRng, ridgePath, softConifer, broadleaf, circlePath, frondCluster, bigLeaf, reeds, grassTufts, scatter } from "./sceneUtils";
import "./HabitatScene.css";

/**
 * Procedural, deterministic habitat environments drawn in SVG.
 * viewBox 1600×900, sliced to fill its container. The horizon sits at y≈640,
 * so an animal standing at ~80–86 % of the height appears grounded.
 *
 * `animated` toggles CSS-driven atmosphere (rain, snow, mist, fireflies…).
 */
/** Photographic environment plates with per-habitat colour grading and a ground rise for the animal. */
const PLATES = {
  rainforest: { src: plateRainforest, pos: "50% 55%", filter: "saturate(1.04) contrast(1.05) brightness(0.8)", tint: "rgba(8, 44, 40, 0.28)", light: "rgba(255, 226, 170, 0.2)", lightAt: "70% 10%", ground: "#0a1712", groundTop: "rgba(70, 110, 70, 0.28)" },
  forest: { src: plateForest, pos: "50% 60%", filter: "saturate(0.9) contrast(1.04) brightness(0.78)", tint: "rgba(20, 30, 12, 0.3)", light: "rgba(255, 220, 150, 0.2)", lightAt: "30% 15%", ground: "#12160c", groundTop: "rgba(120, 110, 60, 0.22)" },
  grasslands: { src: plateGrasslands, pos: "50% 60%", filter: "saturate(0.95) contrast(1.04) brightness(0.82)", tint: "rgba(50, 30, 10, 0.22)", light: "rgba(255, 210, 130, 0.25)", lightAt: "50% 20%", ground: "#2a2110", groundTop: "rgba(190, 150, 70, 0.22)" },
  desert: { src: plateDesert, pos: "50% 55%", filter: "saturate(1) contrast(1.06) brightness(0.85)", tint: "rgba(70, 30, 20, 0.18)", light: "rgba(255, 200, 130, 0.22)", lightAt: "80% 20%", ground: "#3a2416", groundTop: "rgba(220, 160, 100, 0.22)" },
  arctic: { src: plateArctic, pos: "50% 50%", filter: "saturate(0.85) contrast(1.04) brightness(0.86)", tint: "rgba(10, 30, 70, 0.28)", light: "rgba(255, 220, 200, 0.2)", lightAt: "60% 20%", ground: "#c9d8e6", groundTop: "rgba(255, 255, 255, 0.35)" },
  mountains: { src: plateMountains, pos: "50% 45%", filter: "saturate(0.8) contrast(1.05) brightness(0.8)", tint: "rgba(15, 25, 60, 0.3)", light: "rgba(230, 235, 255, 0.18)", lightAt: "75% 12%", ground: "#161d2c", groundTop: "rgba(160, 175, 200, 0.2)" },
  wetlands: { src: plateWetlands, pos: "50% 60%", filter: "saturate(0.85) contrast(1.05) brightness(0.78)", tint: "rgba(8, 35, 30, 0.32)", light: "rgba(200, 245, 230, 0.18)", lightAt: "40% 10%", ground: "#0c1a16", groundTop: "rgba(90, 140, 120, 0.25)" },
};

export default function HabitatScene({ habitat, animated = true, className = "", detail = "full" }) {
  const id = habitat?.id || "forest";
  const uid = `sc-${id}`;
  const [failed, setFailed] = useState(false);
  const plate = PLATES[id];
  const scene = useMemo(() => buildScene(id, uid, detail), [id, uid, detail]);
  const usePlate = plate && !failed;
  return (
    <div className={`scene scene--${id} ${animated ? "scene--animated" : ""} ${usePlate ? "scene--plate" : ""} ${className}`} aria-hidden="true" style={usePlate ? { "--tint": plate.tint, "--light": plate.light, "--light-at": plate.lightAt, "--ground": plate.ground, "--ground-top": plate.groundTop } : undefined}>
      {usePlate ? (
        <>
          <img src={plate.src} alt="" className="scene__plate" style={{ objectPosition: plate.pos, filter: plate.filter }} onError={() => setFailed(true)} draggable="false" />
          <div className="scene__grade" />
          <div className="scene__light" />
          <div className="scene__ground" />
        </>
      ) : (
        <svg className="scene__svg scene__svg--static" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">{scene}</svg>
      )}
      {animated && <svg className="scene__svg scene__svg--fx" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">{scene}</svg>}
      <div className="scene__vig" />
    </div>
  );
}

/* ---------------- shared bits ---------------- */
function Sky({ uid, top, bottom, mid }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          {mid && <stop offset="0.55" stopColor={mid} />}
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${uid}-sky)`} />
    </>
  );
}

function Sun({ uid, x, y, r, color, glow, strength = 0.9 }) {
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={glow} stopOpacity={strength} />
          <stop offset="0.35" stopColor={glow} stopOpacity={strength * 0.35} />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 5} fill={`url(#${uid}-sun)`} />
      <circle cx={x} cy={y} r={r} fill={color} />
    </>
  );
}

function Vignette({ uid, strength = 0.55 }) {
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-vig`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={strength} />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${uid}-vig)`} />
    </>
  );
}

function Fog({ uid, color, y = 560, h = 200, opacity = 0.5 }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-fog-${y}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0" />
          <stop offset="0.5" stopColor={color} stopOpacity={opacity} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y={y} width="1600" height={h} fill={`url(#${uid}-fog-${y})`} />
    </>
  );
}

function Stars({ rng, count = 90, yMax = 420, color = "#fff" }) {
  const s = scatter(rng, count, 0, 1600, 0, yMax);
  return (
    <g className="scene__stars">
      {s.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={0.6 + p.r * 1.6} fill={color} opacity={0.3 + p.p * 0.7} style={{ "--d": `${(p.p * 4).toFixed(2)}s` }} />)}
    </g>
  );
}

/* ---------------- scenes ---------------- */
function buildScene(id, uid, detail) {
  switch (id) {
    case "rainforest": return <Rainforest uid={uid} detail={detail} />;
    case "grasslands": return <Grasslands uid={uid} detail={detail} />;
    case "desert": return <Desert uid={uid} detail={detail} />;
    case "arctic": return <Arctic uid={uid} detail={detail} />;
    case "mountains": return <Mountains uid={uid} detail={detail} />;
    case "wetlands": return <Wetlands uid={uid} detail={detail} />;
    default: return <Forest uid={uid} detail={detail} />;
  }
}

/* ---- RAINFOREST ---- */
function trunk(x, baseY, topY, w, lean = 0) {
  // tapered trunk with buttress roots
  const tw = w * 0.55;
  return `M ${x - w * 1.6} ${baseY} Q ${x - w * 0.5} ${baseY - 40} ${x - w * 0.5} ${baseY - 120} L ${x + lean - tw / 2} ${topY} L ${x + lean + tw / 2} ${topY} L ${x + w * 0.5} ${baseY - 120} Q ${x + w * 0.55} ${baseY - 40} ${x + w * 1.6} ${baseY} Z`;
}
function vine(x, y0, y1, sway) {
  return `M ${x} ${y0} C ${x + sway} ${y0 + (y1 - y0) * 0.3} ${x - sway} ${y0 + (y1 - y0) * 0.7} ${x + sway * 0.3} ${y1}`;
}

function Rainforest({ uid }) {
  const rng = makeRng(101);
  const far = ridgePath(rng, { baseY: 560, height: 140, segments: 12, jag: 0.2 });
  const farTrunks = Array.from({ length: 10 }, (_, i) => ({ x: 40 + i * 170 + rng() * 60, w: 14 + rng() * 14, lean: (rng() - 0.5) * 50 }));
  const midTrunks = [{ x: 210, w: 34, lean: -20 }, { x: 640, w: 26, lean: 10 }, { x: 1010, w: 30, lean: -12 }, { x: 1420, w: 38, lean: 18 }];
  const canopyBlobs = scatter(rng, 40, 0, 1600, 40, 300);
  const drops = scatter(rng, 70, 0, 1600, 0, 900);
  const vines = Array.from({ length: 9 }, (_, i) => ({ x: 120 + i * 175 + rng() * 60, y1: 260 + rng() * 260, sway: 20 + rng() * 30 }));
  const leaves = [
    bigLeaf(-40, 720, 420, -10), bigLeaf(120, 900, 380, -40), bigLeaf(1640, 700, 440, 10, true), bigLeaf(1500, 920, 400, 40, true),
    bigLeaf(260, 940, 260, -70), bigLeaf(1350, 950, 280, 70, true),
  ];
  const fireflies = scatter(rng, 26, 100, 1500, 350, 780);
  return (
    <>
      <Sky uid={uid} top="#0a2c20" mid="#1e6a45" bottom="#4a9a62" />
      <Sun uid={uid} x={1150} y={120} r={60} color="#f2ffe6" glow="#c4f7cf" strength={0.8} />
      <g className="scene__shafts" opacity="0.45">
        {[900, 1010, 1130, 1260].map((x, i) => (
          <polygon key={i} points={`${x},0 ${x + 60},0 ${x - 260},900 ${x - 420},900`} fill="#e2ffe9" opacity={0.16 + i * 0.03} />
        ))}
      </g>
      {/* canopy */}
      <g fill="#0f4530" opacity="0.9">
        {canopyBlobs.map((b, i) => <circle key={i} cx={b.x} cy={b.y - 60} r={60 + b.r * 110} />)}
      </g>
      <path d={far} fill="#145538" opacity="0.85" />
      {/* far trunks */}
      <g fill="#0e3d2a" opacity="0.75">
        {farTrunks.map((t, i) => <path key={i} d={trunk(t.x, 700, 60, t.w, t.lean)} />)}
      </g>
      <Fog uid={uid} color="#8ff0be" y={450} h={280} opacity={0.35} />
      {/* mid trunks with vines */}
      <g fill="#0a2e20">
        {midTrunks.map((t, i) => <path key={i} d={trunk(t.x, 760, -20, t.w, t.lean)} />)}
      </g>
      <g stroke="#0b3a27" strokeWidth="4" fill="none" strokeLinecap="round">
        {vines.map((v, i) => <path key={i} d={vine(v.x, -10, v.y1, v.sway)} />)}
      </g>
      <g fill="#0c3d28">
        {vines.map((v, i) => <path key={i} d={frondCluster(rng, v.x + v.sway * 0.3, v.y1, 40, 5)} transform={`rotate(180 ${v.x + v.sway * 0.3} ${v.y1})`} />)}
      </g>
      {/* mid vegetation */}
      <path d={ridgePath(rng, { baseY: 690, height: 90, segments: 20, jag: 0.2 })} fill="#0f4a2f" />
      <g fill="#0b3a25">
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={frondCluster(rng, 80 + i * 140, 700, 120 + rng() * 60)} />)}
      </g>
      {/* ground */}
      <rect y="670" width="1600" height="240" fill="#0b2f1f" />
      <path d="M0 705 Q 400 665 800 695 T 1600 685 V 900 H 0 Z" fill="#0e3a26" />
      <ellipse cx="800" cy="765" rx="520" ry="60" fill="#124630" opacity="0.7" />
      <path d={grassTufts(rng, 0, 1600, 800, 50, 30, 90)} stroke="#1f6b42" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* foreground big leaves */}
      <g fill="#07261a" opacity="0.95">
        {leaves.map((l, i) => <path key={i} d={l.d} transform={l.transform} />)}
      </g>
      <g fill="#0a3323" opacity="0.9">
        <path d={frondCluster(rng, -30, 900, 260, 8)} />
        <path d={frondCluster(rng, 1640, 900, 260, 8)} />
      </g>
      <g className="scene__fireflies">
        {fireflies.map((f, i) => <circle key={i} cx={f.x} cy={f.y} r={2 + f.r * 2} fill="#d9ff8a" style={{ "--d": `${(f.p * 5).toFixed(2)}s` }} />)}
      </g>
      <g className="scene__rain" stroke="#c9ffe6" strokeWidth="1.2" opacity="0.35">
        {drops.map((d, i) => <line key={i} x1={d.x} y1={d.y} x2={d.x - 6} y2={d.y + 26} style={{ "--d": `${(d.p * 1.4).toFixed(2)}s` }} />)}
      </g>
      <Vignette uid={uid} strength={0.55} />
    </>
  );
}

/* ---- FOREST ---- */
function Forest({ uid }) {
  const rng = makeRng(202);
  const far = ridgePath(rng, { baseY: 520, height: 120, segments: 10, jag: 0.3 });
  const farTrees = Array.from({ length: 30 }, (_, i) => ({ x: i * 56 + rng() * 30, h: 110 + rng() * 120 }));
  const midTrees = Array.from({ length: 11 }, (_, i) => ({ x: 40 + i * 150 + rng() * 60, h: 250 + rng() * 170, kind: rng() > 0.45 ? "b" : "c" }));
  const trunks = [{ x: 110, w: 34, lean: -14 }, { x: 1490, w: 40, lean: 12 }];
  const motes = scatter(rng, 40, 100, 1500, 200, 800);
  return (
    <>
      <Sky uid={uid} top="#0e2238" mid="#5f8a78" bottom="#e2c882" />
      <Sun uid={uid} x={1180} y={330} r={70} color="#fff2c8" glow="#ffd889" strength={0.9} />
      <g className="scene__shafts" opacity="0.5">
        {[1000, 1120, 1250, 1360].map((x, i) => <polygon key={i} points={`${x},200 ${x + 50},200 ${x - 300},900 ${x - 460},900`} fill="#ffe9b0" opacity={0.15 + i * 0.03} />)}
      </g>
      <path d={far} fill="#2f4b3e" opacity="0.8" />
      <g fill="#243d31" opacity="0.9">{farTrees.map((t, i) => <path key={i} d={softConifer(t.x, 560, t.h)} />)}</g>
      <Fog uid={uid} color="#c9d9a8" y={430} h={260} opacity={0.4} />
      <g fill="#182b21">{midTrees.map((t, i) => <path key={i} d={t.kind === "c" ? softConifer(t.x, 660, t.h) : broadleaf(rng, t.x, 660, t.h)} />)}</g>
      {/* ground */}
      <rect y="640" width="1600" height="260" fill="#1a2d1c" />
      <path d="M0 690 Q 300 650 700 680 T 1600 670 V 900 H 0 Z" fill="#20361f" />
      <path d="M0 760 Q 500 720 900 760 T 1600 750 V 900 H 0 Z" fill="#26401f" />
      <path d={grassTufts(rng, 0, 1600, 800, 40, 20, 60)} stroke="#2f5a2a" strokeWidth="2" fill="none" />
      {/* foreground: tapered trunks with canopies, ferns */}
      <g fill="#0f1c14">
        {trunks.map((t, i) => <path key={i} d={trunk(t.x, 900, -40, t.w, t.lean)} />)}
        <path d={broadleaf(rng, 150, 700, 520)} opacity="0.9" />
        <path d={broadleaf(rng, 1500, 700, 580)} opacity="0.9" />
      </g>
      <g fill="#0c1a12" opacity="0.95">
        <path d={frondCluster(rng, -20, 920, 240, 8)} /><path d={frondCluster(rng, 1620, 920, 240, 8)} /><path d={frondCluster(rng, 330, 940, 160, 6)} /><path d={frondCluster(rng, 1280, 950, 170, 6)} />
      </g>
      <g className="scene__fireflies">{motes.map((m, i) => <circle key={i} cx={m.x} cy={m.y} r={1.2 + m.r * 2} fill="#ffe7a8" style={{ "--d": `${(m.p * 6).toFixed(2)}s` }} />)}</g>
      <Vignette uid={uid} strength={0.55} />
    </>
  );
}

/* ---- GRASSLANDS ---- */
function Grasslands({ uid }) {
  const rng = makeRng(303);
  const acacias = [{ x: 260, h: 220 }, { x: 1380, h: 260 }, { x: 900, h: 120 }];
  const birds = scatter(rng, 9, 300, 1200, 120, 330);
  const dust = scatter(rng, 30, 0, 1600, 500, 800);
  return (
    <>
      <Sky uid={uid} top="#1b1f44" mid="#c96a4a" bottom="#f7b56a" />
      <Sun uid={uid} x={820} y={560} r={90} color="#fff1c2" glow="#ffb35c" strength={1} />
      <g className="scene__stars"><Stars rng={rng} count={40} yMax={220} color="#ffe" /></g>
      <path d={ridgePath(rng, { baseY: 600, height: 60, segments: 8, jag: 0.1 })} fill="#7a4a35" opacity="0.6" />
      <Fog uid={uid} color="#ffc98a" y={540} h={160} opacity={0.5} />
      {/* acacia silhouettes */}
      <g fill="#2a1a12">
        {acacias.map((a, i) => (
          <g key={i}>
            <path d={`M ${a.x - 6} 640 L ${a.x - 3} ${640 - a.h * 0.6} L ${a.x + 3} ${640 - a.h * 0.6} L ${a.x + 6} 640 Z`} />
            <path d={`M ${a.x - a.h * 0.6} ${640 - a.h * 0.6} Q ${a.x} ${640 - a.h * 1.15} ${a.x + a.h * 0.6} ${640 - a.h * 0.6} Q ${a.x} ${640 - a.h * 0.45} ${a.x - a.h * 0.6} ${640 - a.h * 0.6} Z`} />
          </g>
        ))}
      </g>
      <g fill="#2a1a12">
        {birds.map((b, i) => <path key={i} d={`M ${b.x} ${b.y} q 6 -6 12 0 q 6 -6 12 0`} stroke="#2a1a12" strokeWidth="2" fill="none" />)}
      </g>
      {/* plains */}
      <rect y="636" width="1600" height="270" fill="#8a6a2e" />
      <path d="M0 660 Q 400 640 800 655 T 1600 650 V 900 H 0 Z" fill="#a17d35" />
      <path d="M0 740 Q 500 700 1000 740 T 1600 730 V 900 H 0 Z" fill="#7d5f26" />
      <path d={grassTufts(rng, 0, 1600, 760, 70, 30, 80)} stroke="#b08a3a" strokeWidth="2" fill="none" opacity="0.8" />
      <path d={grassTufts(rng, 0, 1600, 900, 60, 60, 160)} stroke="#4a3416" strokeWidth="3" fill="none" />
      <g className="scene__fireflies">
        {dust.map((m, i) => <circle key={i} cx={m.x} cy={m.y} r={1 + m.r * 2} fill="#ffe0a8" style={{ "--d": `${(m.p * 6).toFixed(2)}s` }} />)}
      </g>
      <Vignette uid={uid} strength={0.55} />
    </>
  );
}

/* ---- DESERT ---- */
function Desert({ uid }) {
  const rng = makeRng(404);
  const rocks = [{ x: 1300, w: 220, h: 120 }, { x: 180, w: 160, h: 90 }];
  const heat = scatter(rng, 24, 0, 1600, 520, 760);
  return (
    <>
      <Sky uid={uid} top="#2b1a4a" mid="#d9784a" bottom="#f7c07a" />
      <Sun uid={uid} x={1220} y={400} r={80} color="#fff6d8" glow="#ffc26a" strength={1} />
      <Stars rng={rng} count={30} yMax={200} color="#fff" />
      {/* distant mesas */}
      <path d={ridgePath(rng, { baseY: 560, height: 140, segments: 7, jag: 0.8 })} fill="#7a3f2c" opacity="0.55" />
      <Fog uid={uid} color="#ffcf8e" y={480} h={200} opacity={0.55} />
      {/* dunes */}
      <path d="M0 640 Q 300 560 600 620 T 1200 600 T 1600 630 V 900 H 0 Z" fill="#c98a4e" />
      <path d="M0 700 Q 400 620 800 690 T 1600 670 V 900 H 0 Z" fill="#d99a5a" />
      <path d="M0 760 Q 250 700 500 760 T 1000 750 T 1600 770 V 900 H 0 Z" fill="#b8733d" />
      {/* dune ridge highlights */}
      <path d="M0 700 Q 400 620 800 690 T 1600 670" stroke="#f3c48a" strokeWidth="3" fill="none" opacity="0.6" />
      <path d="M0 760 Q 250 700 500 760 T 1000 750 T 1600 770" stroke="#f0b877" strokeWidth="3" fill="none" opacity="0.5" />
      {/* rocks */}
      <g fill="#6b3a26">
        {rocks.map((r, i) => <path key={i} d={`M ${r.x} 780 Q ${r.x + r.w * 0.2} ${780 - r.h} ${r.x + r.w * 0.55} ${780 - r.h * 0.9} Q ${r.x + r.w * 0.9} ${780 - r.h * 0.6} ${r.x + r.w} 780 Z`} />)}
      </g>
      {/* cactus */}
      <g fill="#3f4a2a">
        <path d="M 120 820 v -170 a 18 18 0 0 1 36 0 v 170 Z M 120 720 h -30 v -60 a 12 12 0 0 1 24 0 v 36 h 6 Z M 156 700 h 30 v -80 a 12 12 0 0 1 24 0 v 56 h -30 Z" />
        <path d="M 1450 850 v -120 a 14 14 0 0 1 28 0 v 120 Z M 1478 790 h 22 v -50 a 9 9 0 0 1 18 0 v 30 h -22 Z" />
      </g>
      {/* foreground sand shadow */}
      <path d="M0 860 Q 800 800 1600 860 V 900 H 0 Z" fill="#8f5530" opacity="0.8" />
      <g className="scene__fireflies">
        {heat.map((m, i) => <circle key={i} cx={m.x} cy={m.y} r={1 + m.r * 1.5} fill="#ffe6b8" style={{ "--d": `${(m.p * 6).toFixed(2)}s` }} />)}
      </g>
      <Vignette uid={uid} strength={0.5} />
    </>
  );
}

/* ---- ARCTIC ---- */
function Arctic({ uid }) {
  const rng = makeRng(505);
  const snow = scatter(rng, 110, 0, 1600, 0, 900);
  return (
    <>
      <Sky uid={uid} top="#050f2b" mid="#1b3f7a" bottom="#8fc3ea" />
      <Stars rng={rng} count={110} yMax={380} />
      {/* aurora */}
      <defs>
        <linearGradient id={`${uid}-aur`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34d399" stopOpacity="0" />
          <stop offset="0.5" stopColor="#5eead4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-blur`}><feGaussianBlur stdDeviation="18" /></filter>
      </defs>
      <g className="scene__aurora" filter={`url(#${uid}-blur)`}>
        <path d="M -100 240 C 300 120 600 320 900 180 S 1500 60 1750 200 L 1750 380 C 1400 260 1000 440 700 330 S 200 400 -100 420 Z" fill={`url(#${uid}-aur)`} />
        <path d="M -100 160 C 400 40 700 240 1100 100 S 1600 40 1750 120 L 1750 260 C 1300 200 900 340 600 240 S 200 300 -100 280 Z" fill={`url(#${uid}-aur)`} opacity="0.6" />
      </g>
      <Sun uid={uid} x={300} y={520} r={40} color="#f3fbff" glow="#bfe4ff" strength={0.8} />
      {/* icy mountains */}
      <path d={ridgePath(rng, { baseY: 590, height: 230, segments: 8, jag: 0.9 })} fill="#7ea2c8" opacity="0.7" />
      <path d={ridgePath(rng, { baseY: 610, height: 160, segments: 10, jag: 0.8 })} fill="#b7d2ec" opacity="0.85" />
      <Fog uid={uid} color="#e0f2fe" y={520} h={200} opacity={0.5} />
      {/* ice field */}
      <rect y="640" width="1600" height="260" fill="#dbe9f7" />
      <path d="M0 660 Q 400 640 800 655 T 1600 650 V 900 H 0 Z" fill="#e8f3fb" />
      {/* ice cracks & floes */}
      <g stroke="#a9c8e6" strokeWidth="2" fill="none" opacity="0.7">
        <path d="M 200 720 L 380 760 L 420 830 M 380 760 L 560 740" />
        <path d="M 1100 700 L 1250 760 L 1220 860 M 1250 760 L 1420 730" />
        <path d="M 600 800 L 760 780 L 900 830" />
      </g>
      <path d="M 900 690 Q 1000 660 1120 690 Q 1150 720 1080 740 L 920 740 Q 880 720 900 690 Z" fill="#f4f9ff" />
      <path d="M 300 800 Q 380 770 470 800 Q 500 830 430 850 L 320 850 Q 270 830 300 800 Z" fill="#f4f9ff" />
      <path d="M0 850 Q 800 820 1600 850 V 900 H 0 Z" fill="#c8dcee" />
      {/* snowfall */}
      <g className="scene__snow" fill="#fff">
        {snow.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={1 + s.r * 2.4} opacity={0.5 + s.p * 0.5} style={{ "--d": `${(s.p * 8).toFixed(2)}s`, "--x": `${((s.r - 0.5) * 40).toFixed(1)}px` }} />)}
      </g>
      <Vignette uid={uid} strength={0.45} />
    </>
  );
}

/* ---- MOUNTAINS ---- */
function Mountains({ uid }) {
  const rng = makeRng(606);
  const far = ridgePath(rng, { baseY: 560, height: 320, segments: 7, jag: 0.95 });
  const mid = ridgePath(rng, { baseY: 620, height: 260, segments: 6, jag: 0.9 });
  const near = ridgePath(rng, { baseY: 700, height: 220, segments: 5, jag: 0.85 });
  const trees = Array.from({ length: 30 }, (_, i) => ({ x: i * 56 + rng() * 40, h: 60 + rng() * 90 }));
  const nearTrees = Array.from({ length: 9 }, (_, i) => ({ x: 20 + i * 200 + rng() * 60, h: 140 + rng() * 120 }));
  const birds = scatter(rng, 5, 400, 1100, 150, 300);
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-snowmask`} x1="0" y1="0" x2="0" y2="1"><stop offset="0.3" stopColor="#fff" /><stop offset="0.62" stopColor="#000" /></linearGradient>
        <mask id={`${uid}-snow`}><rect width="1600" height="900" fill={`url(#${uid}-snowmask)`} /></mask>
        <linearGradient id={`${uid}-lake`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fc0ea" /><stop offset="1" stopColor="#2e4a80" /></linearGradient>
      </defs>
      <Sky uid={uid} top="#0d1a3f" mid="#5f7fbf" bottom="#dbe4f5" />
      <Sun uid={uid} x={1250} y={230} r={55} color="#fffaf0" glow="#ffe9c2" strength={0.9} />
      <path d={far} fill="#5b6f9c" opacity="0.8" />
      <path d={far} fill="#eef3ff" opacity="0.7" mask={`url(#${uid}-snow)`} />
      <Fog uid={uid} color="#c7d2fe" y={420} h={220} opacity={0.5} />
      <path d={mid} fill="#3d4d7a" />
      <path d={mid} fill="#f3f6ff" opacity="0.55" mask={`url(#${uid}-snow)`} />
      <Fog uid={uid} color="#dbe4ff" y={540} h={200} opacity={0.45} />
      <path d={near} fill="#2a3556" />
      <g fill="#1f2a45">{trees.map((t, i) => <path key={i} d={softConifer(t.x, 730, t.h)} />)}</g>
      <g stroke="#1b2540" strokeWidth="2" fill="none">{birds.map((b, i) => <path key={i} d={`M ${b.x} ${b.y} q 7 -7 14 0 q 7 -7 14 0`} />)}</g>
      {/* alpine lake in the valley */}
      <path d="M 60 770 Q 230 745 400 760 T 640 758 Q 660 805 520 820 L 130 825 Q 20 800 60 770 Z" fill={`url(#${uid}-lake)`} />
      <g stroke="#dbe9ff" strokeWidth="2" opacity="0.5" className="scene__ripples"><path d="M 160 785 h 140" strokeDasharray="26 22" /><path d="M 330 800 h 180" strokeDasharray="30 24" /></g>
      {/* rocky plateau foreground */}
      <path d="M0 790 L 200 770 L 420 800 L 700 775 L 980 805 L 1250 770 L 1600 795 V 900 H 0 Z" fill="#2e3a5c" />
      <path d="M0 840 L 300 820 L 600 850 L 900 825 L 1200 855 L 1600 830 V 900 H 0 Z" fill="#26304d" />
      <g fill="#182240">{nearTrees.map((t, i) => <path key={i} d={softConifer(t.x, 900, t.h)} />)}</g>
      <path d="M 1180 900 L 1260 800 L 1420 770 L 1600 900 Z" fill="#1c2540" />
      <path d="M 0 900 L 80 800 L 260 770 L 420 900 Z" fill="#1c2540" />
      <Vignette uid={uid} strength={0.5} />
    </>
  );
}

/* ---- WETLANDS ---- */
function Wetlands({ uid }) {
  const rng = makeRng(707);
  const farTrees = Array.from({ length: 22 }, (_, i) => ({ x: i * 78 + rng() * 40, h: 100 + rng() * 120 }));
  const bugs = scatter(rng, 30, 100, 1500, 400, 760);
  return (
    <>
      <Sky uid={uid} top="#0e2a3c" mid="#4f9aa3" bottom="#c8e9e2" />
      <Sun uid={uid} x={420} y={360} r={70} color="#fdfdf3" glow="#c9f5e8" strength={0.9} />
      <path d={ridgePath(rng, { baseY: 560, height: 70, segments: 9, jag: 0.2 })} fill="#2a6b5f" opacity="0.55" />
      <g fill="#1f574c" opacity="0.8">
        {farTrees.map((t, i) => <path key={i} d={broadleaf(rng, t.x, 590, t.h)} />)}
      </g>
      <Fog uid={uid} color="#d4fff3" y={480} h={220} opacity={0.6} />
      {/* water */}
      <defs>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd3cf" />
          <stop offset="1" stopColor="#1c5a56" />
        </linearGradient>
      </defs>
      <rect y="600" width="1600" height="300" fill={`url(#${uid}-water)`} />
      {/* reflections */}
      <g stroke="#dffcf3" strokeWidth="2" opacity="0.5" className="scene__ripples">
        {[640, 665, 690, 720, 750, 790].map((y, i) => <path key={i} d={`M ${100 + i * 90} ${y} h ${180 + i * 40}`} strokeDasharray="30 22" />)}
        {[650, 680, 710, 745, 780].map((y, i) => <path key={i} d={`M ${900 + i * 60} ${y} h ${160 + i * 30}`} strokeDasharray="26 20" />)}
      </g>
      {/* mud bank where the animal stands */}
      <path d="M 250 740 Q 500 690 820 720 T 1400 730 Q 1500 790 1350 830 L 300 840 Q 150 790 250 740 Z" fill="#2f4b34" />
      <path d="M 300 760 Q 520 720 820 740 T 1360 748 Q 1420 790 1320 812 L 340 820 Q 240 790 300 760 Z" fill="#3b5c3d" />
      {/* reeds */}
      <path d={reeds(rng, -20, 320, 780, 40, 140, 300)} stroke="#173d33" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={reeds(rng, 1250, 1620, 800, 40, 140, 320)} stroke="#173d33" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={reeds(rng, 400, 1200, 640, 50, 60, 130)} stroke="#2a6b5c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* cattail heads */}
      <g fill="#4a3a25">
        {[40, 110, 190, 260, 1300, 1380, 1460, 1540].map((x, i) => <rect key={i} x={x} y={560 + (i % 3) * 30} width="10" height="46" rx="5" />)}
      </g>
      {/* lily pads */}
      <g fill="#2f7d5c" opacity="0.9">
        <path d={circlePath(1120, 840, 34) + circlePath(1060, 870, 26) + circlePath(200, 870, 30)} />
      </g>
      <Fog uid={uid} color="#e6fff8" y={700} h={220} opacity={0.35} />
      <g className="scene__fireflies">
        {bugs.map((m, i) => <circle key={i} cx={m.x} cy={m.y} r={1 + m.r * 1.8} fill="#e6fff0" style={{ "--d": `${(m.p * 5).toFixed(2)}s` }} />)}
      </g>
      <Vignette uid={uid} strength={0.5} />
    </>
  );
}
