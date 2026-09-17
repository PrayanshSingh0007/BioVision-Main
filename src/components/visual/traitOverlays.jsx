/**
 * Trait overlay renderers.
 *
 * Every renderer receives a context describing the base animal's geometry in a
 * 1000-unit-wide coordinate space and returns SVG groups for the layers it
 * touches: `behind` (drawn behind the animal), `front` (drawn in front) and
 * `skin` (masked to the animal's silhouette). All positions derive from the
 * animal's anatomical anchors, so compositions are deterministic and coherent.
 */
import { wings, antlers, horns, tail, beak, bigEars, mane, trunk, tusks, hump, shell } from "./photoParts";
import { TEXTURES } from "../../data/textures";

/* ------------ NIGHT VISION EYES ------------ */
const EYE_PALETTES = { night: ["#c8ff7a", "#7cf59a", "#38d39f", "#f6ffd6", "#b9ff6e", "#3ac77a"], aqua: ["#a8f0ff", "#5fd3e8", "#2aa8c4", "#eefeff", "#9be8ff", "#2fb5d6"] };

function eyes(ctx, opts = {}) {
  const { P, headW, uid, anchors } = ctx;
  const c = EYE_PALETTES[opts.palette] || EYE_PALETTES.night;
  // Real eyeshine (tapetum lucidum): a soft, eye-sized glow — no cartoon pupil or highlight dot.
  const r = Math.max(6, headW * 0.055);
  const g = `${uid}-eye-${opts.palette || "n"}`;
  const eye = (a, i) => {
    const p = P(a);
    return (
      <g key={i} className="ov__eye">
        <ellipse cx={p.x} cy={p.y} rx={r * 3} ry={r * 2.4} fill={`url(#${g}-glow)`} className="ov__pulse" />
        <ellipse cx={p.x} cy={p.y} rx={r * 1.15} ry={r * 0.95} fill={`url(#${g}-core)`} />
      </g>
    );
  };
  return {
    front: (
      <g className="ov ov--eyes" style={{ mixBlendMode: "screen" }}>
        <defs>
          <radialGradient id={`${g}-glow`}><stop offset="0" stopColor={c[0]} stopOpacity="0.6" /><stop offset="0.45" stopColor={c[1]} stopOpacity="0.2" /><stop offset="1" stopColor={c[2]} stopOpacity="0" /></radialGradient>
          <radialGradient id={`${g}-core`}><stop offset="0" stopColor={c[3]} /><stop offset="0.55" stopColor={c[4]} stopOpacity="0.9" /><stop offset="1" stopColor={c[5]} stopOpacity="0" /></radialGradient>
        </defs>
        {eye(anchors.eyeL, 0)}{eye(anchors.eyeR, 1)}
      </g>
    ),
  };
}

/* ------------ KEEN EYESIGHT ------------ */
function keenEyes(ctx) {
  const { P, headW, anchors } = ctx;
  const r = Math.max(9, headW * 0.085);
  const one = (a, i) => {
    const p = P(a);
    return (
      <g key={i}>
        <circle cx={p.x} cy={p.y} r={r * 2.4} fill="url(#keenGlow)" className="ov__pulse" />
        <circle cx={p.x} cy={p.y} r={r * 1.25} fill="none" stroke="#ffd166" strokeWidth={r * 0.16} opacity="0.85" />
        <circle cx={p.x} cy={p.y} r={r * 1.75} fill="none" stroke="#ffd166" strokeWidth={r * 0.06} opacity="0.45" strokeDasharray={`${r * 0.5} ${r * 0.4}`} className="ov__ring-spin" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
        <circle cx={p.x} cy={p.y} r={r * 0.6} fill="#ffd166" opacity="0.55" />
        <circle cx={p.x} cy={p.y} r={r * 0.25} fill="#fff7d6" />
      </g>
    );
  };
  return { front: (
    <g className="ov ov--keen" style={{ mixBlendMode: "screen" }}>
      <defs><radialGradient id="keenGlow"><stop offset="0" stopColor="#ffe08a" stopOpacity="0.55" /><stop offset="1" stopColor="#ffb703" stopOpacity="0" /></radialGradient></defs>
      {one(anchors.eyeL, 0)}{one(anchors.eyeR, 1)}
    </g>
  ) };
}

/* ------------ POWERFUL JAWS ------------ */
function jaws(ctx) {
  const { P, headW, uid, anchors } = ctx;
  const m = P(anchors.mouth);
  const len = Math.max(14, headW * 0.16);
  const sp = headW * 0.16;
  const g = `${uid}-fang`;
  const fang = (x, flip) => (
    <path d={`M ${x - len * 0.28} ${m.y - len * 0.15} Q ${x + (flip ? -1 : 1) * len * 0.05} ${m.y + len * 0.5} ${x} ${m.y + len} Q ${x + (flip ? -1 : 1) * len * 0.1} ${m.y + len * 0.5} ${x + len * 0.28} ${m.y - len * 0.15} Z`} fill={`url(#${g})`} stroke="#8a8a80" strokeWidth={len * 0.04} />
  );
  return {
    front: (
      <g className="ov ov--jaws" filter={`url(#${uid}-shadow)`}>
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8d5cc" /><stop offset="1" stopColor="#fffdf5" /></linearGradient>
        </defs>
        <path d={`M ${m.x - sp * 1.5} ${m.y - len * 0.1} Q ${m.x} ${m.y + len * 0.35} ${m.x + sp * 1.5} ${m.y - len * 0.1}`} fill="none" stroke="#2a0d0d" strokeWidth={len * 0.14} opacity="0.55" strokeLinecap="round" />
        {fang(m.x - sp, true)}{fang(m.x + sp, false)}
      </g>
    ),
  };
}

/* ------------ POWERFUL HIND LEGS ------------ */
function hindLegs(ctx, opts = {}) {
  const { P, headW, uid, anchors } = ctx;
  const col = opts.color || "#ffc46b";
  const glow = opts.glow || ["#ffb347", "#ff8a3d"];
  const hip = P(anchors.hips);
  const foot = P(anchors.hindFeet[0]);
  const cx = (hip.x * 0.6 + foot.x * 0.4), cy = (hip.y * 0.6 + foot.y * 0.4);
  const rx = Math.max(headW * 0.5, Math.abs(hip.x - foot.x) * 0.5 + headW * 0.15);
  const ry = Math.max(headW * 0.45, Math.abs(hip.y - foot.y) * 0.45);
  const g = `${uid}-legs`;
  const r0 = Math.max(headW * 0.22, 14);
  return {
    skinLayers: [{ blend: "screen", opacity: 1, content: (
      <svg viewBox={`0 0 ${ctx.W} ${ctx.H}`} preserveAspectRatio="none" className="comp__skinsvg"><g className="ov ov--legs">
        <defs>
          <radialGradient id={g}><stop offset="0" stopColor={glow[0]} stopOpacity="0.6" /><stop offset="0.6" stopColor={glow[1]} stopOpacity="0.22" /><stop offset="1" stopColor={glow[1]} stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${g})`} className="ov__pulse" />
      </g></svg>
    ) }],
    front: (
      <g className="ov ov--legs-front">
        {/* muscle "flex" arcs at the hip */}
        {[1, 1.45, 1.9].map((k, i) => (
          <path key={i} d={`M ${hip.x - r0 * k} ${hip.y + r0 * k * 0.35} A ${r0 * k} ${r0 * k} 0 0 1 ${hip.x + r0 * k * 0.35} ${hip.y - r0 * k}`} fill="none" stroke={col} strokeWidth={Math.max(2.5, headW * 0.028)} strokeLinecap="round" opacity={0.85 - i * 0.25} />
        ))}
        {/* spring / motion marks behind the foot */}
        {[0, 1, 2].map((i) => (
          <path key={`s${i}`} d={`M ${foot.x + headW * 0.3 + i * headW * 0.16} ${foot.y + headW * 0.08 + i * headW * 0.03} q ${headW * 0.12} ${-headW * 0.16} ${headW * 0.24} 0`} fill="none" stroke={col} strokeWidth={Math.max(3, headW * 0.03)} strokeLinecap="round" opacity={0.8 - i * 0.22} />
        ))}
      </g>
    ),
  };
}

/* ------------ LONG TONGUE ------------ */
function tongue(ctx) {
  const { P, W, headW, facing, uid, anchors } = ctx;
  const m = P(anchors.mouth);
  const L = Math.max(W * 0.34, headW * 1.6);
  const dir = facing === "front" ? -0.7 : -1; // extends toward the direction the head faces (left)
  const ex = m.x + dir * L, ey = m.y + (facing === "front" ? L * 0.55 : L * 0.12);
  const c1x = m.x + dir * L * 0.35, c1y = m.y - L * 0.2;
  const c2x = m.x + dir * L * 0.7, c2y = m.y + L * 0.05;
  const d = `M ${m.x} ${m.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`;
  const g = `${uid}-tongue`;
  const w = Math.max(8, headW * 0.09);
  return {
    front: (
      <g className="ov ov--tongue" filter={`url(#${uid}-shadow)`}>
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c8305e" /><stop offset="1" stopColor="#ff7fa6" /></linearGradient>
        </defs>
        <path d={d} fill="none" stroke="#7a1637" strokeWidth={w * 1.35} strokeLinecap="round" opacity="0.5" />
        <path d={d} fill="none" stroke={`url(#${g})`} strokeWidth={w} strokeLinecap="round" />
        <path d={d} fill="none" stroke="#ffd3e0" strokeWidth={w * 0.25} strokeLinecap="round" opacity="0.7" transform={`translate(0 ${-w * 0.25})`} />
        <circle cx={ex} cy={ey} r={w * 0.85} fill="#ff8fb3" stroke="#a11f4a" strokeWidth={w * 0.12} />
        {/* tiny insect at the tip */}
        <g transform={`translate(${ex + dir * w * 1.3} ${ey - w * 0.6})`} opacity="0.9">
          <ellipse rx={w * 0.36} ry={w * 0.22} fill="#1f2937" />
          <ellipse cx={-w * 0.12} cy={-w * 0.22} rx={w * 0.3} ry={w * 0.14} fill="#cbd5e1" opacity="0.7" />
          <ellipse cx={w * 0.14} cy={-w * 0.22} rx={w * 0.3} ry={w * 0.14} fill="#cbd5e1" opacity="0.7" />
        </g>
      </g>
    ),
  };
}

/* ------------ WHISKERS ------------ */
function whiskers(ctx) {
  const { P, headW, facing, anchors } = ctx;
  const n = P(anchors.nose);
  const L = Math.max(30, headW * 0.62);
  const sw = Math.max(2, headW * 0.014);
  const set = (dir, len) => [-1, 0, 1].map((k) => (
    <path key={k} d={`M ${n.x + dir * headW * 0.08} ${n.y + headW * 0.05 + k * headW * 0.045} Q ${n.x + dir * len * 0.55} ${n.y + k * headW * 0.09 - headW * 0.02} ${n.x + dir * len} ${n.y + k * len * 0.28}`} fill="none" stroke="#fff" strokeWidth={sw} strokeLinecap="round" opacity="0.85" />
  ));
  return {
    front: (
      <g className="ov ov--whiskers" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,.6))" }}>
        {set(-1, facing === "front" ? L : L * 1.1)}
        {set(1, facing === "front" ? L : L * 0.75)}
      </g>
    ),
  };
}

/* ------------ CLIMBING CLAWS ------------ */
function claws(ctx) {
  const { P, headW, facing, uid, anchors } = ctx;
  const len = Math.max(12, headW * 0.15);
  const dir = facing === "front" ? 0 : -1;
  const set = (a, i) => {
    const p = P(a);
    return (
      <g key={i} transform={`translate(${p.x} ${p.y})`}>
        {[-1, 0, 1].map((k) => (
          <path key={k} d={`M ${k * len * 0.45 + dir * len * 0.2} ${-len * 0.25} Q ${k * len * 0.5 + dir * len * 0.7} ${len * 0.1} ${k * len * 0.55 + dir * len * 0.8} ${len * 0.75}`} fill="none" stroke="#1c1917" strokeWidth={len * 0.22} strokeLinecap="round" />
        ))}
        {[-1, 0, 1].map((k) => (
          <path key={`h${k}`} d={`M ${k * len * 0.45 + dir * len * 0.2} ${-len * 0.25} Q ${k * len * 0.5 + dir * len * 0.7} ${len * 0.1} ${k * len * 0.55 + dir * len * 0.8} ${len * 0.75}`} fill="none" stroke="#9ca3af" strokeWidth={len * 0.06} strokeLinecap="round" opacity="0.7" transform="translate(-1 -1)" />
        ))}
      </g>
    );
  };
  return { front: <g className="ov ov--claws" filter={`url(#${uid}-shadow)`}>{anchors.frontFeet.map(set)}</g> };
}

/* ------------ WEBBED FEET (Aquatic) ------------ */
function webbedFeet(ctx) {
  const { P, headW, uid, anchors } = ctx;
  const s = Math.max(16, headW * 0.3);
  const g = `${uid}-web`;
  const foot = (a, i) => {
    const p = P(a);
    const toes = [-1, 0, 1];
    return (
      <g key={i} transform={`translate(${p.x} ${p.y - s * 0.05})`}>
        <path d={`M ${-s * 0.15} ${-s * 0.1} L ${-s * 0.75} ${s * 0.45} Q 0 ${s * 0.2} ${s * 0.75} ${s * 0.45} L ${s * 0.15} ${-s * 0.1} Z`} fill={`url(#${g})`} opacity="0.85" />
        {toes.map((k) => <path key={k} d={`M 0 ${-s * 0.1} L ${k * s * 0.72} ${s * 0.45 - Math.abs(k) * s * 0.05}`} stroke="#2f5d4a" strokeWidth={s * 0.11} strokeLinecap="round" />)}
        {toes.map((k) => <circle key={`t${k}`} cx={k * s * 0.72} cy={s * 0.45 - Math.abs(k) * s * 0.05} r={s * 0.09} fill="#79c9a6" />)}
      </g>
    );
  };
  const feet = [...anchors.hindFeet, ...anchors.frontFeet].slice(0, 3);
  const g2 = `${uid}-ripple`;
  const groundY = Math.max(...feet.map((a) => P(a).y));
  return {
    behind: (
      <g className="ov ov--ripples">
        <defs>
          <radialGradient id={g2}><stop offset="0.5" stopColor="#bff6ea" stopOpacity="0" /><stop offset="0.75" stopColor="#bff6ea" stopOpacity="0.5" /><stop offset="1" stopColor="#bff6ea" stopOpacity="0" /></radialGradient>
        </defs>
        {[1.2, 0.8].map((k, i) => <ellipse key={i} cx={ctx.W / 2} cy={groundY + s * 0.2} rx={ctx.W * 0.5 * k} ry={s * 0.6 * k} fill={`url(#${g2})`} className="ov__ripple" style={{ "--d": `${i * 1.5}s` }} />)}
      </g>
    ),
    front: (
      <g className="ov ov--web" filter={`url(#${uid}-shadow)`}>
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fe3c4" /><stop offset="1" stopColor="#3b9d7c" /></linearGradient>
        </defs>
        {feet.map(foot)}
      </g>
    ),
  };
}

/* ------------ PSEUDO-THUMB GRIP ------------ */
function grip(ctx) {
  const { P, headW, uid, anchors } = ctx;
  const p = P(anchors.frontFeet[0]);
  const s = Math.max(14, headW * 0.22);
  const g = `${uid}-grip`;
  return {
    front: (
      <g className="ov ov--grip">
        <defs>
          <radialGradient id={g}><stop offset="0" stopColor="#7dd3fc" stopOpacity="0.55" /><stop offset="1" stopColor="#7dd3fc" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx={p.x} cy={p.y} r={s * 1.6} fill={`url(#${g})`} className="ov__pulse" />
        <circle cx={p.x} cy={p.y} r={s} fill="none" stroke="#a5f3fc" strokeWidth={s * 0.08} opacity="0.9" />
        <circle cx={p.x} cy={p.y} r={s * 1.25} fill="none" stroke="#a5f3fc" strokeWidth={s * 0.05} opacity="0.5" strokeDasharray={`${s * 0.4} ${s * 0.3}`} className="ov__ring-spin" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
        {/* thumb-like bone highlight */}
        <path d={`M ${p.x - s * 0.55} ${p.y + s * 0.1} Q ${p.x - s * 0.75} ${p.y - s * 0.4} ${p.x - s * 0.3} ${p.y - s * 0.55}`} fill="none" stroke="#e0f2fe" strokeWidth={s * 0.16} strokeLinecap="round" />
        <path d={`M ${p.x - s * 0.15} ${p.y - s * 0.45} Q ${p.x + s * 0.4} ${p.y - s * 0.7} ${p.x + s * 0.55} ${p.y - s * 0.1}`} fill="none" stroke="#e0f2fe" strokeWidth={s * 0.12} strokeLinecap="round" opacity="0.7" />
      </g>
    ),
  };
}

/* ------------ THICK FUR ------------ */
function fur() {
  return {
    // behind: a fluffy cream halo derived from the animal's own silhouette (rendered by the composition)
    halo: true,
    skinLayers: [
      { blend: "soft-light", opacity: 0.6, content: tex("fur", 40) },
      { blend: "soft-light", opacity: 0.3, content: <div className="comp__tint" style={{ background: "#fff3df" }} /> },
    ],
  };
}

/* ------------ SKIN PATTERNS (photographic textures masked to the silhouette) ------------ */
const CAMO_PALETTES = {
  rainforest: ["#1f6b3a", "#3f9a4f"],
  forest: ["#3d6b2f", "#6b8f3c"],
  grasslands: ["#a3843a", "#c9a95b"],
  desert: ["#c48a4c", "#e0b078"],
  arctic: ["#dbe9f7", "#f6fbff"],
  mountains: ["#6b7590", "#9aa3b8"],
  wetlands: ["#2f7d5c", "#5aa885"],
};

/** A repeating photo texture filling the figure box; `size` is the tile width as % of the figure width. */
const tex = (name, size) => <div className="comp__tex" style={{ backgroundImage: `url(${TEXTURES[name]})`, backgroundSize: `${size}% auto` }} />;

function camouflage(ctx, opts = {}) {
  const { habitat } = ctx;
  if (opts.variant === "spots") {
    return { skinLayers: [
      { blend: "multiply", opacity: 0.72, content: tex("spots", 42) },
      { blend: "soft-light", opacity: 0.3, content: tex("spots", 42) },
    ] };
  }
  if (opts.variant === "scales") {
    return { skinLayers: [
      { blend: "overlay", opacity: 0.65, content: tex("scales", 36) },
      { blend: "multiply", opacity: 0.3, content: tex("scales", 36) },
    ] };
  }
  if (opts.variant === "winter") {
    // white coat: desaturate, lift the midtones and lay real white fur over the top — contrast is kept so the animal stays solid
    return { halo: true, skinLayers: [
      { blend: "color", opacity: 0.7, content: <div className="comp__tint" style={{ background: "#f4f7fb" }} /> },
      { blend: "soft-light", opacity: 0.6, content: <div className="comp__tint" style={{ background: "#ffffff" }} /> },
      { blend: "screen", opacity: 0.3, content: tex("winter", 50) },
    ] };
  }
  // chameleon camouflage: a subtle colour-adaptive cast, not a full repaint — the base animal's
  // own coat and pattern should still read clearly underneath it.
  const pal = CAMO_PALETTES[habitat?.id] || CAMO_PALETTES.forest;
  return { skinLayers: [
    { blend: "multiply", opacity: 0.32, content: tex("camo", 38) },
    { blend: "color", opacity: 0.2, content: <div className="comp__tint" style={{ background: `linear-gradient(160deg, ${pal[1]}, ${pal[0]})` }} /> },
  ] };
}


/* ------------ BEAK (toucan / flamingo / heron) ------------ */
/* ------------ BLUBBER / FAT STORE (tinted halo) ------------ */
function blubber(ctx, opts = {}) {
  const tint = opts.tint || "#cfe6ff";
  return {
    halo: true,
    skinLayers: [{ blend: "soft-light", opacity: 0.5, content: <div className="comp__tint" style={{ background: tint }} /> }],
  };
}

/* ------------ REACH (long neck) ------------ */
function reach(ctx) {
  const { P, headW, uid, anchors } = ctx;
  const top = P(anchors.headTop);
  const h = Math.max(headW * 2.2, 120);
  return {
    front: (
      <g className="ov ov--reach">
        <path d={`M ${top.x} ${top.y - 6} L ${top.x} ${top.y - h}`} stroke="#a6ea8a" strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round" opacity="0.8" />
        <path d={`M ${top.x - 12} ${top.y - h + 14} L ${top.x} ${top.y - h} L ${top.x + 12} ${top.y - h + 14}`} fill="none" stroke="#a6ea8a" strokeWidth={3} strokeLinecap="round" />
        <g transform={`translate(${top.x + 10} ${top.y - h - 10})`} filter={`url(#${uid}-shadow)`}>
          <path d="M 0 0 C 10 -14 30 -20 44 -14 C 36 2 18 10 0 0 Z" fill="#5fb26a" /><path d="M 2 -1 C 14 -8 26 -12 40 -13" stroke="#1f6a3d" strokeWidth="1.5" fill="none" />
          <path d="M 0 0 C -10 14 -30 20 -44 14 C -36 -2 -18 -10 0 0 Z" fill="#7fd06e" transform="translate(0 6)" />
        </g>
      </g>
    ),
  };
}

/* ------------ WIDE FEET (snow hooves / grip hooves) ------------ */
function wideFeet(ctx, opts = {}) {
  const { P, headW, uid, anchors } = ctx;
  const s = Math.max(14, headW * 0.26);
  const feet = [...anchors.frontFeet, ...anchors.hindFeet];
  const snow = opts.style === "snow";
  const foot = (a, i) => {
    const p = P(a);
    return snow ? (
      <g key={i} transform={`translate(${p.x} ${p.y})`}>
        <ellipse rx={s * 0.9} ry={s * 0.42} fill="#e8f2ff" stroke="#8fb2d6" strokeWidth={s * 0.08} opacity="0.95" />
        <path d={`M ${-s * 0.6} 0 L ${s * 0.6} 0 M 0 ${-s * 0.3} L 0 ${s * 0.3}`} stroke="#8fb2d6" strokeWidth={s * 0.06} opacity="0.7" />
      </g>
    ) : (
      <g key={i} transform={`translate(${p.x} ${p.y})`}>
        <path d={`M ${-s * 0.55} ${s * 0.3} L ${-s * 0.5} ${-s * 0.3} L ${-s * 0.08} ${-s * 0.35} L ${-s * 0.08} ${s * 0.3} Z`} fill="#2f2a26" stroke="#b9a58a" strokeWidth={s * 0.05} />
        <path d={`M ${s * 0.55} ${s * 0.3} L ${s * 0.5} ${-s * 0.3} L ${s * 0.08} ${-s * 0.35} L ${s * 0.08} ${s * 0.3} Z`} fill="#2f2a26" stroke="#b9a58a" strokeWidth={s * 0.05} />
        {[-0.4, -0.25, 0.25, 0.4].map((k) => <path key={k} d={`M ${k * s} ${-s * 0.15} L ${k * s} ${s * 0.15}`} stroke="#ffd166" strokeWidth={s * 0.05} opacity="0.8" />)}
      </g>
    );
  };
  return { front: <g className="ov ov--feet" filter={`url(#${uid}-shadow)`}>{feet.map(foot)}</g> };
}

/* ------------ BREATH (high-altitude lungs) ------------ */
function breath(ctx) {
  const { P, headW, uid, anchors } = ctx;
  const c = P(anchors.chest), n = P(anchors.nose);
  const r = Math.max(headW * 0.5, 30);
  const g = `${uid}-breath`;
  return {
    skinLayers: [{ blend: "screen", opacity: 1, content: (
      <svg viewBox={`0 0 ${ctx.W} ${ctx.H}`} preserveAspectRatio="none" className="comp__skinsvg">
        <defs><radialGradient id={g}><stop offset="0" stopColor="#bfe9ff" stopOpacity="0.6" /><stop offset="1" stopColor="#7fd3ff" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={c.x} cy={c.y} rx={r * 1.3} ry={r} fill={`url(#${g})`} className="ov__pulse" />
      </svg>
    ) }],
    front: (
      <g className="ov ov--breath" opacity="0.85">
        {[0, 1, 2].map((i) => <ellipse key={i} cx={n.x - headW * 0.25 - i * headW * 0.22} cy={n.y - i * headW * 0.16} rx={headW * (0.08 + i * 0.05)} ry={headW * (0.05 + i * 0.03)} fill="#e8f7ff" opacity={0.7 - i * 0.2} className="ov__pulse" />)}
      </g>
    ),
  };
}

/* ------------ GENERIC MARKER (traits with no visible body part) ------------ */
function marker(ctx, opts = {}) {
  const { P, headW, anchors } = ctx;
  let a = anchors[opts.anchor || "chest"]; if (Array.isArray(a)) a = a[0];
  const p = P(a);
  const r = Math.max(headW * 0.28, 16);
  return {
    front: (
      <g className="ov ov--marker">
        <circle cx={p.x} cy={p.y} r={r * 1.6} fill="#a6ea8a" opacity="0.18" className="ov__pulse" />
        <circle cx={p.x} cy={p.y} r={r} fill="none" stroke="#a6ea8a" strokeWidth={r * 0.1} opacity="0.9" />
        <circle cx={p.x} cy={p.y} r={r * 1.3} fill="none" stroke="#a6ea8a" strokeWidth={r * 0.05} strokeDasharray={`${r * 0.4} ${r * 0.3}`} className="ov__ring-spin" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
        <circle cx={p.x} cy={p.y} r={r * 0.3} fill="#e6ffd8" />
      </g>
    ),
  };
}

export const OVERLAY_RENDERERS = {
  wings, antlers, tail, eyes, keen_eyes: keenEyes, jaws, hind_legs: hindLegs, tongue, whiskers, claws, webbed_feet: webbedFeet, grip, fur, camouflage,
  spots: (c) => camouflage(c, { variant: "spots" }),
  scales: (c) => camouflage(c, { variant: "scales" }),
  winter_coat: (c) => camouflage(c, { variant: "winter" }),
  aqua_eyes: (c) => eyes(c, { palette: "aqua" }),
  sprint: (c) => hindLegs(c, { color: "#ffe066", glow: ["#fff1a8", "#ffb703"] }),
  beak, big_ears: bigEars, blubber, mane, trunk, reach, hump, shell, wide_feet: wideFeet, breath, horns, tusks, marker,
};

/** Which anchor a trait's callout label points to. */
export const LABEL_ANCHOR = {
  wings: "back", antlers: "headTop", tail: "rear", eyes: "eyeL", keen_eyes: "eyeR", jaws: "mouth", hind_legs: "hips",
  tongue: "mouth", whiskers: "nose", claws: "frontFeet", webbed_feet: "hindFeet", grip: "frontFeet", fur: "chest", camouflage: "hips",
  spots: "hips", scales: "back", winter_coat: "chest", aqua_eyes: "eyeL", sprint: "hips", beak: "nose", big_ears: "headTop", blubber: "chest",
  mane: "headTop", trunk: "nose", reach: "headTop", hump: "back", shell: "back", wide_feet: "hindFeet", breath: "chest", horns: "headTop", tusks: "mouth", marker: "chest",
};
