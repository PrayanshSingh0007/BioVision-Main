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
  const { P, W, H, headW, uid, anchors } = ctx;
  const c = EYE_PALETTES[opts.palette] || EYE_PALETTES.night;
  // Real eyeshine (tapetum lucidum): a soft, eye-sized glow — no cartoon pupil or highlight dot.
  // Floored against the figure size so a small-headed animal (camel, giraffe) still reads.
  const r = Math.max(8, headW * 0.08, Math.min(W, H) * 0.015);
  const g = `${uid}-eye-${opts.palette || "n"}`;
  const eye = (a, i) => {
    const p = P(a);
    return (
      <g key={i} className="ov__eye">
        <ellipse cx={p.x} cy={p.y} rx={r * 3.4} ry={r * 2.7} fill={`url(#${g}-glow)`} className="ov__pulse" />
        <ellipse cx={p.x} cy={p.y} rx={r * 1.35} ry={r * 1.1} fill={`url(#${g}-core)`} />
      </g>
    );
  };
  return {
    front: (
      <g className="ov ov--eyes" style={{ mixBlendMode: "screen" }}>
        <defs>
          <radialGradient id={`${g}-glow`}><stop offset="0" stopColor={c[0]} stopOpacity="0.8" /><stop offset="0.45" stopColor={c[1]} stopOpacity="0.3" /><stop offset="1" stopColor={c[2]} stopOpacity="0" /></radialGradient>
          <radialGradient id={`${g}-core`}><stop offset="0" stopColor={c[3]} /><stop offset="0.6" stopColor={c[4]} stopOpacity="0.95" /><stop offset="1" stopColor={c[5]} stopOpacity="0" /></radialGradient>
        </defs>
        {eye(anchors.eyeL, 0)}{eye(anchors.eyeR, 1)}
      </g>
    ),
  };
}

/* ------------ KEEN EYESIGHT ------------ */
function keenEyes(ctx) {
  const { P, W, H, headW, anchors } = ctx;
  const r = Math.max(10, headW * 0.1, Math.min(W, H) * 0.017);
  const one = (a, i) => {
    const p = P(a);
    return (
      <g key={i}>
        <circle cx={p.x} cy={p.y} r={r * 2.4} fill="url(#keenGlow)" className="ov__pulse" />
        <circle cx={p.x} cy={p.y} r={r * 1.25} fill="none" stroke="#ffd166" strokeWidth={r * 0.16} opacity="0.85" />
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
  const glow = opts.glow || ["#ffb347", "#ff8a3d"];
  const hip = P(anchors.hips);
  const foot = P(anchors.hindFeet[0]);
  const cx = hip.x * 0.55 + foot.x * 0.45, cy = hip.y * 0.55 + foot.y * 0.45;
  const rx = Math.max(headW * 0.55, Math.abs(hip.x - foot.x) * 0.5 + headW * 0.2);
  const ry = Math.max(headW * 0.5, Math.abs(hip.y - foot.y) * 0.45);
  const g = `${uid}-legs`, gd = `${uid}-dust`;
  const s = Math.max(headW * 0.5, 22);
  return {
    // Warm light gathering in the haunch — the muscle reading as power, painted onto the animal
    // itself rather than drawn over it.
    skinLayers: [{ blend: "screen", opacity: 1, content: (
      <svg viewBox={`0 0 ${ctx.W} ${ctx.H}`} preserveAspectRatio="none" className="comp__skinsvg"><g className="ov ov--legs">
        <defs>
          <radialGradient id={g}><stop offset="0" stopColor={glow[0]} stopOpacity="0.62" /><stop offset="0.6" stopColor={glow[1]} stopOpacity="0.24" /><stop offset="1" stopColor={glow[1]} stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${g})`} className="ov__pulse" />
      </g></svg>
    ) }],
    // Ground the power with dust kicked up under the hind foot — photographic, not a drawn arc.
    behind: (
      <g className="ov ov--legs-dust">
        <defs>
          <radialGradient id={gd}><stop offset="0" stopColor="#efe6d5" stopOpacity="0.42" /><stop offset="0.6" stopColor="#d9cdb7" stopOpacity="0.16" /><stop offset="1" stopColor="#d9cdb7" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx={foot.x} cy={foot.y + s * 0.1} rx={s * 1.5} ry={s * 0.5} fill={`url(#${gd})`} className="ov__pulse" />
        <ellipse cx={foot.x + s * 0.9} cy={foot.y - s * 0.12} rx={s * 0.8} ry={s * 0.34} fill={`url(#${gd})`} opacity="0.75" />
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
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8f2740" /><stop offset="1" stopColor="#c9596f" /></linearGradient>
        </defs>
        <path d={d} fill="none" stroke="#5d1128" strokeWidth={w * 1.35} strokeLinecap="round" opacity="0.5" />
        <path d={d} fill="none" stroke={`url(#${g})`} strokeWidth={w} strokeLinecap="round" />
        <path d={d} fill="none" stroke="#e8b4bf" strokeWidth={w * 0.2} strokeLinecap="round" opacity="0.45" transform={`translate(0 ${-w * 0.25})`} />
        <circle cx={ex} cy={ey} r={w * 0.7} fill="#c4677c" stroke="#6d1a31" strokeWidth={w * 0.12} />
        {/* tiny insect at the tip */}
        <g transform={`translate(${ex + dir * w * 1.1} ${ey - w * 0.5}) scale(0.8)`} opacity="0.8">
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
        {toes.map((k) => <path key={k} d={`M 0 ${-s * 0.1} L ${k * s * 0.72} ${s * 0.45 - Math.abs(k) * s * 0.05}`} stroke="#4a2f1f" strokeWidth={s * 0.1} strokeLinecap="round" opacity="0.85" />)}
        {toes.map((k) => <circle key={`t${k}`} cx={k * s * 0.72} cy={s * 0.45 - Math.abs(k) * s * 0.05} r={s * 0.08} fill="#3b2418" />)}
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
          <linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a72" /><stop offset="1" stopColor="#7a5236" /></linearGradient>
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
          <radialGradient id={g}><stop offset="0" stopColor="#ffe9c7" stopOpacity="0.4" /><stop offset="1" stopColor="#ffe9c7" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx={p.x} cy={p.y} rx={s * 1.25} ry={s} fill={`url(#${g})`} className="ov__pulse" />
        {/* the extra thumb itself: a short pad curling in against the paw */}
        <path d={`M ${p.x - s * 0.52} ${p.y + s * 0.16} Q ${p.x - s * 0.78} ${p.y - s * 0.34} ${p.x - s * 0.26} ${p.y - s * 0.5}`} fill="none" stroke="#f2e6d4" strokeWidth={s * 0.22} strokeLinecap="round" opacity="0.9" />
        <path d={`M ${p.x - s * 0.52} ${p.y + s * 0.16} Q ${p.x - s * 0.78} ${p.y - s * 0.34} ${p.x - s * 0.26} ${p.y - s * 0.5}`} fill="none" stroke="#7a6a56" strokeWidth={s * 0.06} strokeLinecap="round" opacity="0.5" />
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
  // chameleon camouflage: the coat clearly takes on the habitat's colours and a mottled pattern,
  // while the animal's own markings still show through (multiply keeps the stripes/spots; the
  // colour layer shifts the hue; soft-light lifts the pattern so it reads from across a room).
  const pal = CAMO_PALETTES[habitat?.id] || CAMO_PALETTES.forest;
  return { skinLayers: [
    { blend: "multiply", opacity: 0.55, content: tex("camo", 34) },
    { blend: "soft-light", opacity: 0.55, content: tex("camo", 34) },
    { blend: "color", opacity: 0.42, content: <div className="comp__tint" style={{ background: `linear-gradient(160deg, ${pal[1]}, ${pal[0]})` }} /> },
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
  const { P, H, headW, uid, anchors } = ctx;
  const top = P(anchors.headTop);
  // The browse line the animal can reach. Kept inside the figure box so the sprig never floats
  // off on its own: a fine measure line from just above the head up to a leaf it could take.
  const y = Math.max(H * 0.04, top.y - Math.max(headW * 1.6, H * 0.14));
  const k = Math.max(headW * 0.22, 14);
  return {
    front: (
      <g className="ov ov--reach">
        <path d={`M ${top.x} ${top.y - k * 0.4} L ${top.x} ${y + k * 0.5}`} stroke="#cfe6bb" strokeWidth={Math.max(1.4, k * 0.07)} strokeDasharray={`${k * 0.16} ${k * 0.34}`} strokeLinecap="round" opacity="0.5" />
        <g transform={`translate(${top.x} ${y}) scale(${k / 26})`} filter={`url(#${uid}-shadow)`} opacity="0.95">
          <path d="M 0 6 C 0 -4 6 -12 16 -16 C 16 -4 10 4 0 6 Z" fill="#6ab06b" />
          <path d="M 0 6 C 0 -4 -6 -12 -16 -16 C -16 -4 -10 4 0 6 Z" fill="#83c473" />
          <path d="M 0 14 L 0 4" stroke="#4a7c46" strokeWidth="2.4" strokeLinecap="round" />
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
  const gPad = `${uid}-pad`, gHoof = `${uid}-hoof`;
  const foot = (a, i) => {
    const p = P(a);
    return snow ? (
      // A broad, fur-soft pad spreading under the foot — reads as fur and snow, not a drawn icon.
      <g key={i} transform={`translate(${p.x} ${p.y + s * 0.08})`}>
        <ellipse rx={s * 1.05} ry={s * 0.36} fill={`url(#${gPad})`} />
        <ellipse cy={s * 0.16} rx={s * 0.9} ry={s * 0.14} fill="#0a1410" opacity="0.28" />
      </g>
    ) : (
      // A single dark, rounded hoof cap sitting where the foot meets the ground.
      <g key={i} transform={`translate(${p.x} ${p.y})`}>
        <path d={`M ${-s * 0.42} ${-s * 0.28} L ${s * 0.42} ${-s * 0.28} L ${s * 0.48} ${s * 0.12} Q 0 ${s * 0.42} ${-s * 0.48} ${s * 0.12} Z`} fill={`url(#${gHoof})`} />
        <path d={`M ${-s * 0.3} ${-s * 0.18} L ${-s * 0.34} ${s * 0.1}`} stroke="#d9c7ad" strokeWidth={s * 0.05} strokeLinecap="round" opacity="0.55" />
      </g>
    );
  };
  return { front: (
    <g className="ov ov--feet" filter={`url(#${uid}-shadow)`}>
      <defs>
        <radialGradient id={gPad}><stop offset="0" stopColor="#f6f3ea" stopOpacity="0.95" /><stop offset="0.65" stopColor="#e6e2d6" stopOpacity="0.8" /><stop offset="1" stopColor="#dcd8cc" stopOpacity="0" /></radialGradient>
        <linearGradient id={gHoof} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2e26" /><stop offset="1" stopColor="#15100d" /></linearGradient>
      </defs>
      {feet.map(foot)}
    </g>
  ) };
}

/* ------------ BREATH (high-altitude lungs) ------------ */
function breath(ctx) {
  const { P, headW, uid, facing, anchors } = ctx;
  const c = P(anchors.chest), n = P(anchors.nose);
  const fwd = facing === "right" ? 1 : facing === "front" ? 0 : -1;
  const r = Math.max(headW * 0.5, 30);
  const g = `${uid}-breath`;
  return {
    skinLayers: [{ blend: "screen", opacity: 1, content: (
      <svg viewBox={`0 0 ${ctx.W} ${ctx.H}`} preserveAspectRatio="none" className="comp__skinsvg">
        <defs><radialGradient id={g}><stop offset="0" stopColor="#bfe9ff" stopOpacity="0.4" /><stop offset="1" stopColor="#7fd3ff" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={c.x} cy={c.y} rx={r * 1.3} ry={r} fill={`url(#${g})`} className="ov__pulse" />
      </svg>
    ) }],
    // Warm breath condensing in thin air: a soft plume drifting away from the muzzle, in the
    // direction the animal actually faces.
    front: (
      <g className="ov ov--breath">
        <defs><radialGradient id={`${g}-p`}><stop offset="0" stopColor="#eaf6ff" stopOpacity="0.55" /><stop offset="1" stopColor="#eaf6ff" stopOpacity="0" /></radialGradient></defs>
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={n.x + fwd * headW * (0.22 + i * 0.26)} cy={n.y - headW * (0.04 + i * 0.13)} rx={headW * (0.13 + i * 0.09)} ry={headW * (0.09 + i * 0.06)}
            fill={`url(#${g}-p)`} opacity={0.85 - i * 0.24} className="ov__pulse" style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </g>
    ),
  };
}

/* ------------ GENERIC MARKER (traits with no visible body part) ------------ */
function marker(ctx, opts = {}) {
  const { P, headW, uid, anchors } = ctx;
  let a = anchors[opts.anchor || "chest"]; if (Array.isArray(a)) a = a[0];
  const p = P(a);
  const r = Math.max(headW * 0.5, 26);
  const g = `${uid}-mark-${opts.anchor || "chest"}`;
  // Traits with no visible body part get the quietest possible mark: a slow warm glow where the
  // change happens. The labelled callout already names it — this only says "here".
  return {
    front: (
      <g className="ov ov--marker">
        <defs>
          <radialGradient id={g}><stop offset="0" stopColor="#dff5c8" stopOpacity="0.45" /><stop offset="0.55" stopColor="#a6ea8a" stopOpacity="0.16" /><stop offset="1" stopColor="#a6ea8a" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx={p.x} cy={p.y} rx={r * 1.5} ry={r * 1.2} fill={`url(#${g})`} className="ov__pulse" />
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
  sprint: (c) => hindLegs(c, { glow: ["#fff1a8", "#ffb703"] }),
  beak, big_ears: bigEars, blubber, mane, trunk, reach, hump, shell, wide_feet: wideFeet, breath, horns, tusks, marker,
};

/** Which anchor a trait's callout label points to. */
export const LABEL_ANCHOR = {
  wings: "back", antlers: "headTop", tail: "rear", eyes: "eyeL", keen_eyes: "eyeR", jaws: "mouth", hind_legs: "hips",
  tongue: "mouth", whiskers: "nose", claws: "frontFeet", webbed_feet: "hindFeet", grip: "frontFeet", fur: "chest", camouflage: "hips",
  spots: "hips", scales: "back", winter_coat: "chest", aqua_eyes: "eyeL", sprint: "hips", beak: "nose", big_ears: "headTop", blubber: "chest",
  mane: "headTop", trunk: "nose", reach: "headTop", hump: "back", shell: "back", wide_feet: "hindFeet", breath: "chest", horns: "headTop", tusks: "mouth", marker: "chest",
};
