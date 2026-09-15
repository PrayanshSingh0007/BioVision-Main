/**
 * Trait overlay renderers.
 *
 * Every renderer receives a context describing the base animal's geometry in a
 * 1000-unit-wide coordinate space and returns SVG groups for the layers it
 * touches: `behind` (drawn behind the animal), `front` (drawn in front) and
 * `skin` (masked to the animal's silhouette). All positions derive from the
 * animal's anatomical anchors, so compositions are deterministic and coherent.
 */

/* ------------ wing geometry ------------ */
/**
 * Feathered wing geometry. Local coords: root at (0,0), wing extends along +x, tip raised (−y).
 * Returns the outline, a covert (upper feather) layer and feather separation lines.
 */
function wingGeometry(L) {
  const wrist = [0.42, -0.2];
  const lead = `M 0 0 C ${0.12 * L} ${-0.1 * L} ${0.28 * L} ${-0.2 * L} ${wrist[0] * L} ${wrist[1] * L} C ${0.62 * L} ${-0.26 * L} ${0.84 * L} ${-0.36 * L} ${L} ${-0.34 * L}`;
  // primary feather tips (fan out from the wrist) then secondaries back to the root
  const primaries = [[1.0, -0.34], [0.99, -0.12], [0.95, 0.08], [0.87, 0.25], [0.75, 0.37], [0.61, 0.43]];
  const secondaries = [[0.47, 0.43], [0.33, 0.4], [0.2, 0.34], [0.09, 0.25]];
  let d = lead;
  const notchDepth = (a, b, k) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    return [wrist[0] + (mx - wrist[0]) * k, wrist[1] + (my - wrist[1]) * k];
  };
  const lines = [];
  for (let i = 0; i < primaries.length - 1; i++) {
    const n = notchDepth(primaries[i], primaries[i + 1], 0.74);
    d += ` L ${n[0] * L} ${n[1] * L} L ${primaries[i + 1][0] * L} ${primaries[i + 1][1] * L}`;
    lines.push(`M ${wrist[0] * L} ${wrist[1] * L} L ${n[0] * L} ${n[1] * L}`);
  }
  let prev = primaries[primaries.length - 1];
  for (const sec of secondaries) {
    const n = notchDepth(prev, sec, 0.9);
    d += ` Q ${n[0] * L} ${n[1] * L} ${sec[0] * L} ${sec[1] * L}`;
    lines.push(`M ${wrist[0] * L * 0.6} ${wrist[1] * L * 0.4} L ${n[0] * L} ${n[1] * L}`);
    prev = sec;
  }
  d += ` Q ${0.02 * L} ${0.16 * L} 0 ${0.06 * L} Z`;

  // coverts: follow the leading edge, end about 45 % into the wing depth
  const cov = [[0.82, -0.2], [0.7, -0.08], [0.56, 0.02], [0.42, 0.08], [0.28, 0.1], [0.14, 0.08]];
  let c = `M 0 0 C ${0.12 * L} ${-0.1 * L} ${0.28 * L} ${-0.2 * L} ${wrist[0] * L} ${wrist[1] * L} C ${0.58 * L} ${-0.25 * L} ${0.76 * L} ${-0.32 * L} ${0.9 * L} ${-0.3 * L}`;
  let pc = [0.9, -0.3];
  for (const pt of cov) {
    c += ` Q ${((pc[0] + pt[0]) / 2 + 0.02) * L} ${((pc[1] + pt[1]) / 2 + 0.05) * L} ${pt[0] * L} ${pt[1] * L}`;
    pc = pt;
  }
  c += ` Q ${0.04 * L} ${0.06 * L} 0 ${0.03 * L} Z`;
  return { outline: d, coverts: c, lines: lines.join(" ") };
}

/* ------------ WINGS (Flight) ------------ */
const WING_PALETTES = {
  eagle: { a: ["#6b4a2e", "#3f2a18", "#1e140b"], c: ["#9c7449", "#5a3d24"], tip: "#f3e6cf" },
  owl: { a: ["#b9a78c", "#7d6a50", "#4a3d2c"], c: ["#d8c9ad", "#8f7a5c"], tip: "#fff7e6" },
};

function wings(ctx, opts = {}) {
  const { P, W, headW, facing, uid, anchors } = ctx;
  const pal = WING_PALETTES[opts.palette] || WING_PALETTES.eagle;
  const root = P(anchors.back);
  const L = Math.max(W * 0.55, headW * 1.8);
  const geo = wingGeometry(L);
  const g = `${uid}-wing`;
  // Two wings rise from the shoulders in a V. Near wing sweeps toward the rear, far wing toward the head.
  const nearRot = facing === "front" ? -42 : -36;
  const farRot = facing === "front" ? 42 : 34;
  // Outer group positions the wing (SVG attribute); inner group carries the CSS flex animation.
  const wing = (rot, mirror, scale, cls, op = 1) => (
    <g transform={`translate(${root.x} ${root.y}) rotate(${rot}) scale(${mirror ? -scale : scale} ${scale})`} opacity={op}>
      <g className={cls}>
        <path d={geo.outline} fill={`url(#${g})`} />
        <path d={geo.lines} stroke="#0f0905" strokeWidth={L * 0.009} opacity="0.55" fill="none" strokeLinecap="round" />
        <path d={geo.lines} stroke="#c9a77c" strokeWidth={L * 0.004} opacity="0.35" fill="none" transform={`translate(${L * 0.004} ${-L * 0.004})`} />
        <path d={geo.coverts} fill={`url(#${g}-c)`} />
        <path d={geo.coverts} fill="none" stroke="#2a1b0e" strokeWidth={L * 0.005} opacity="0.5" />
        <path d={geo.outline} fill={`url(#${g}-t)`} />
        <path d={geo.outline} fill="none" stroke="#0e0905" strokeWidth={L * 0.006} opacity="0.55" />
      </g>
    </g>
  );
  return {
    behind: (
      <g className="ov ov--wings" filter={`url(#${uid}-shadow)`}>
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0" stopColor={pal.a[0]} /><stop offset="0.5" stopColor={pal.a[1]} /><stop offset="1" stopColor={pal.a[2]} />
          </linearGradient>
          <linearGradient id={`${g}-c`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={pal.c[0]} /><stop offset="1" stopColor={pal.c[1]} />
          </linearGradient>
          <linearGradient id={`${g}-t`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0.55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor={pal.tip} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {wing(farRot, true, 0.92, "ov__wing ov__wing--far", 0.9)}
        {wing(nearRot, false, 1, "ov__wing ov__wing--near")}
      </g>
    ),
  };
}

/* ------------ ANTLERS ------------ */
function antlerPath(h) {
  // rises from 0,0; main beam curves back with tines. h = total height.
  return [
    `M 0 0 C ${-h * 0.05} ${-h * 0.3} ${h * 0.15} ${-h * 0.55} ${h * 0.3} ${-h * 0.95}`,
    `M ${h * 0.02} ${-h * 0.3} C ${-h * 0.1} ${-h * 0.4} ${-h * 0.2} ${-h * 0.5} ${-h * 0.28} ${-h * 0.62}`,
    `M ${h * 0.12} ${-h * 0.55} C ${h * 0.02} ${-h * 0.66} ${-h * 0.04} ${-h * 0.75} ${-h * 0.08} ${-h * 0.9}`,
    `M ${h * 0.22} ${-h * 0.78} C ${h * 0.3} ${-h * 0.86} ${h * 0.42} ${-h * 0.9} ${h * 0.5} ${-h * 0.98}`,
  ].join(" ");
}

function antlers(ctx) {
  const { P, headW, facing, uid, anchors } = ctx;
  const top = P(anchors.headTop);
  const h = headW * 1.35;
  const sw = Math.max(6, headW * 0.075);
  const spread = facing === "front" ? headW * 0.22 : headW * 0.14;
  const g = `${uid}-antler`;
  const one = (mirror, x, y, scale = 1, op = 1) => (
    <g transform={`translate(${x} ${y}) scale(${mirror ? -scale : scale} ${scale})`} opacity={op}>
      <path d={antlerPath(h)} fill="none" stroke="#3a2712" strokeWidth={sw * 1.6} strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
      <path d={antlerPath(h)} fill="none" stroke={`url(#${g})`} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d={antlerPath(h)} fill="none" stroke="#f1e2c8" strokeWidth={sw * 0.28} strokeLinecap="round" strokeLinejoin="round" opacity="0.5" transform={`translate(${-sw * 0.2} ${-sw * 0.2})`} />
    </g>
  );
  return {
    behind: (
      <g className="ov ov--antlers" filter={`url(#${uid}-shadow)`}>
        <defs>
          <linearGradient id={g} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#5b3d20" /><stop offset="1" stopColor="#c9a97c" /></linearGradient>
        </defs>
        {facing === "front" ? (
          <>{one(true, top.x - spread, top.y + headW * 0.08)}{one(false, top.x + spread, top.y + headW * 0.08)}</>
        ) : (
          <>{one(false, top.x + spread, top.y + headW * 0.14, 0.9, 0.85)}{one(true, top.x - spread * 0.4, top.y + headW * 0.1)}</>
        )}
      </g>
    ),
  };
}

/* ------------ BUSHY TAIL ------------ */
const TAIL_PALETTES = { russet: ["#5a3b22", "#9a6a3c", "#d9b98a"], snow: ["#6b6b66", "#b9b6ad", "#f2efe6"] };

function tail(ctx, opts = {}) {
  const { P, W, headW, facing, uid, anchors } = ctx;
  const pal = TAIL_PALETTES[opts.palette] || TAIL_PALETTES.russet;
  const rear = P(anchors.rear);
  const L = Math.max(W * 0.42, headW * 1.4);
  const g = `${uid}-tail`;
  // tail extends away from the head and curls upward.
  const dir = facing === "front" ? 1 : 1; // always extends toward the right (rear side for left-facing animals)
  const d = `M 0 0 C ${L * 0.25 * dir} ${L * 0.05} ${L * 0.55 * dir} ${-L * 0.05} ${L * 0.7 * dir} ${-L * 0.45} C ${L * 0.78 * dir} ${-L * 0.7} ${L * 0.6 * dir} ${-L * 0.95} ${L * 0.4 * dir} ${-L * 0.9}`;
  const widths = [0.34, 0.26, 0.17, 0.08];
  return {
    behind: (
      <g className="ov ov--tail" transform={`translate(${rear.x} ${rear.y})`}>
        <defs>
          <linearGradient id={g} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={pal[0]} /><stop offset="0.6" stopColor={pal[1]} /><stop offset="1" stopColor={pal[2]} /></linearGradient>
          <filter id={`${g}-fuzz`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={L * 0.12} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#${g}-fuzz)`}>
          <path d={d} fill="none" stroke="#2c1b0f" strokeWidth={L * 0.4} strokeLinecap="round" opacity="0.45" transform="translate(6 10)" />
          {widths.map((w, i) => (
            <path key={i} d={d} fill="none" stroke={`url(#${g})`} strokeWidth={L * w} strokeLinecap="round" opacity={i === 0 ? 0.95 : 0.55} />
          ))}
          <path d={d} fill="none" stroke="#f3dcb8" strokeWidth={L * 0.05} strokeLinecap="round" opacity="0.6" transform={`translate(${-L * 0.05} ${-L * 0.06})`} />
        </g>
      </g>
    ),
  };
}

/* ------------ NIGHT VISION EYES ------------ */
const EYE_PALETTES = { night: ["#c8ff7a", "#7cf59a", "#38d39f", "#f6ffd6", "#b9ff6e", "#3ac77a"], aqua: ["#a8f0ff", "#5fd3e8", "#2aa8c4", "#eefeff", "#9be8ff", "#2fb5d6"] };

function eyes(ctx, opts = {}) {
  const { P, headW, uid, anchors } = ctx;
  const c = EYE_PALETTES[opts.palette] || EYE_PALETTES.night;
  const r = Math.max(8, headW * 0.075);
  const g = `${uid}-eye-${opts.palette || "n"}`;
  const eye = (a, i) => {
    const p = P(a);
    return (
      <g key={i} className="ov__eye">
        <circle cx={p.x} cy={p.y} r={r * 4.2} fill={`url(#${g}-glow)`} className="ov__pulse" />
        <circle cx={p.x} cy={p.y} r={r * 1.5} fill={`url(#${g}-core)`} />
        <ellipse cx={p.x} cy={p.y} rx={r * 0.32} ry={r * 0.9} fill="#0a2a10" opacity="0.85" />
        <circle cx={p.x - r * 0.4} cy={p.y - r * 0.45} r={r * 0.3} fill="#fff" opacity="0.9" />
      </g>
    );
  };
  return {
    front: (
      <g className="ov ov--eyes" style={{ mixBlendMode: "screen" }}>
        <defs>
          <radialGradient id={`${g}-glow`}><stop offset="0" stopColor={c[0]} stopOpacity="0.75" /><stop offset="0.4" stopColor={c[1]} stopOpacity="0.28" /><stop offset="1" stopColor={c[2]} stopOpacity="0" /></radialGradient>
          <radialGradient id={`${g}-core`}><stop offset="0" stopColor={c[3]} /><stop offset="0.5" stopColor={c[4]} /><stop offset="1" stopColor={c[5]} stopOpacity="0.5" /></radialGradient>
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
function fur(ctx) {
  const { P, headW, W, anchors, uid } = ctx;
  const back = P(anchors.back);
  const chest = P(anchors.chest);
  const tuft = (x, y, s, rot) => (
    <path d={`M ${-s * 0.5} 0 Q ${-s * 0.25} ${-s * 0.9} 0 ${-s * 0.35} Q ${s * 0.2} ${-s} ${s * 0.45} ${-s * 0.2} Q ${s * 0.6} ${-s * 0.7} ${s * 0.8} 0 Z`} transform={`translate(${x} ${y}) rotate(${rot})`} fill="#f8f2e6" opacity="0.85" />
  );
  const tufts = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = back.x - W * 0.28 + t * W * 0.56;
    const y = back.y - headW * 0.08 + Math.sin(t * Math.PI) * -headW * 0.06;
    tufts.push(<g key={i}>{tuft(x, y, headW * (0.16 + (i % 3) * 0.04), (t - 0.5) * 30)}</g>);
  }
  return {
    // behind: a fluffy cream halo derived from the animal's own silhouette (rendered by the composition)
    halo: true,
    skinLayers: [{ blend: "soft-light", opacity: 0.55, content: <div className="comp__tint" style={{ background: "#fff3df" }} /> }],
    front: (
      <g className="ov ov--fur" filter={`url(#${uid}-shadow)`} opacity="0.9">
        {tufts}
        {/* chest ruff */}
        {[-2, -1, 0, 1, 2].map((k) => <g key={`c${k}`}>{tuft(chest.x + k * headW * 0.16, chest.y + headW * 0.12 + Math.abs(k) * headW * 0.03, headW * 0.18, k * 12 + 180)}</g>)}
      </g>
    ),
  };
}

/* ------------ CAMOUFLAGE (skin pattern, habitat-aware) ------------ */
const CAMO_PALETTES = {
  rainforest: ["#1f6b3a", "#3f9a4f", "#0e3d24", "#7ccf6a"],
  forest: ["#3d6b2f", "#6b8f3c", "#2a4a20", "#a9b86a"],
  grasslands: ["#a3843a", "#c9a95b", "#6f5620", "#e3cf8c"],
  desert: ["#c48a4c", "#e0b078", "#8f5b2c", "#f1d3a3"],
  arctic: ["#dbe9f7", "#f6fbff", "#a9c4dd", "#ffffff"],
  mountains: ["#6b7590", "#9aa3b8", "#454d66", "#c7cdd9"],
  wetlands: ["#2f7d5c", "#5aa885", "#1b4d3a", "#9fd9b8"],
};

const CAMO_VARIANTS = {
  spots: ["#8a6a3a", "#3a2a18", "#1c140c", "#c9a56a"],
  scales: ["#4a5e2e", "#6b7a3a", "#232d14", "#9aa25a"],
  winter: ["#e8f0f8", "#ffffff", "#c6d4e2", "#ffffff"],
};

function camouflage(ctx, opts = {}) {
  const { W, H, uid, habitat } = ctx;
  const pal = CAMO_VARIANTS[opts.variant] || CAMO_PALETTES[habitat?.id] || CAMO_PALETTES.forest;
  const g = `${uid}-camo-${opts.variant || "h"}`;
  const freqA = opts.variant === "spots" ? "0.03 0.03" : opts.variant === "scales" ? "0.06 0.05" : "0.014 0.02";
  const freqB = opts.variant === "spots" ? "0.05 0.05" : opts.variant === "scales" ? "0.09 0.08" : "0.035 0.045";
  const blobs = (id, freq, seed, gain, bias) => (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="3" seed={seed} result="n" />
      <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${gain} ${bias}`} result="b" />
      <feGaussianBlur in="b" stdDeviation="1.2" result="s" />
      <feComposite in="SourceGraphic" in2="s" operator="in" />
    </filter>
  );
  return {
    skinLayers: [
      // 1) gentle colour shift toward the habitat palette (keeps stripes/fur detail visible)
      
      // 2) mottled dark blotches
      { blend: "multiply", opacity: opts.variant === "winter" ? 0.12 : opts.variant === "spots" ? 0.28 : 0.4, content: (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="comp__skinsvg">
          <defs>{blobs(`${g}-a`, freqA, 7, 9, -3.4)}</defs>
          <rect width={W} height={H} fill={pal[2]} filter={`url(#${g}-a)`} />
        </svg>
      ) },
      // 3) lighter mottling for a shimmering, scaly look
      { blend: opts.variant === "winter" ? "screen" : "soft-light", opacity: opts.variant === "winter" ? 0.5 : opts.variant === "spots" ? 0.45 : 0.7, content: (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="comp__skinsvg">
          <defs>{blobs(`${g}-b`, freqB, 3, 12, -5.6)}</defs>
          <rect width={W} height={H} fill={pal[3]} filter={`url(#${g}-b)`} />
          <rect width={W} height={H} fill={pal[1]} filter={`url(#${g}-b)`} transform={`translate(${W * 0.12} ${H * 0.1})`} opacity="0.7" />
        </svg>
      ) },
    ],
  };
}


/* ------------ BEAK (toucan / flamingo / heron) ------------ */
function beak(ctx, opts = {}) {
  const { P, headW, facing, uid, anchors } = ctx;
  const n = P(anchors.nose);
  const dir = facing === "front" ? -0.6 : -1;
  const L = Math.max(Math.min(headW * 0.8, ctx.W * 0.22), 40);
  const g = `${uid}-beak-${opts.style}`;
  let shape, grad;
  if (opts.style === "flamingo") {
    shape = `M ${n.x} ${n.y - L * 0.16} C ${n.x + dir * L * 0.5} ${n.y - L * 0.2} ${n.x + dir * L * 0.85} ${n.y + L * 0.05} ${n.x + dir * L * 0.8} ${n.y + L * 0.5} C ${n.x + dir * L * 0.55} ${n.y + L * 0.45} ${n.x + dir * L * 0.3} ${n.y + L * 0.2} ${n.x} ${n.y + L * 0.16} Z`;
    grad = ["#ffd1d6", "#f78ba0", "#1a1a1a"];
  } else if (opts.style === "heron") {
    shape = `M ${n.x} ${n.y - L * 0.12} L ${n.x + dir * L * 1.25} ${n.y + L * 0.02} L ${n.x} ${n.y + L * 0.12} Z`;
    grad = ["#f6d98a", "#d9a441", "#8a5a1a"];
  } else {
    shape = `M ${n.x} ${n.y - L * 0.26} C ${n.x + dir * L * 0.5} ${n.y - L * 0.34} ${n.x + dir * L * 0.95} ${n.y - L * 0.22} ${n.x + dir * L * 1.1} ${n.y + L * 0.05} C ${n.x + dir * L * 0.9} ${n.y + L * 0.18} ${n.x + dir * L * 0.45} ${n.y + L * 0.28} ${n.x} ${n.y + L * 0.24} Z`;
    grad = ["#ffb03a", "#ff7a1a", "#3a1a06"];
  }
  return {
    front: (
      <g className="ov ov--beak" filter={`url(#${uid}-shadow)`}>
        <defs><linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={grad[0]} /><stop offset="1" stopColor={grad[1]} /></linearGradient></defs>
        <path d={shape} fill={`url(#${g})`} stroke={grad[2]} strokeWidth={L * 0.02} strokeLinejoin="round" />
        {opts.style === "flamingo" && <path d={`M ${n.x + dir * L * 0.55} ${n.y + L * 0.2} C ${n.x + dir * L * 0.75} ${n.y + L * 0.28} ${n.x + dir * L * 0.82} ${n.y + L * 0.4} ${n.x + dir * L * 0.8} ${n.y + L * 0.5}`} fill="none" stroke="#1a1a1a" strokeWidth={L * 0.14} strokeLinecap="round" />}
        {opts.style === "toucan" && <path d={`M ${n.x + dir * L * 0.1} ${n.y - L * 0.02} L ${n.x + dir * L * 1.02} ${n.y + L * 0.02}`} stroke="#3a1a06" strokeWidth={L * 0.02} opacity="0.6" />}
        <path d={shape} fill="none" stroke="#fff" strokeWidth={L * 0.015} opacity="0.35" transform="translate(0 -1)" />
      </g>
    ),
  };
}

/* ------------ BIG EARS (fox / fennec) ------------ */
function bigEars(ctx, opts = {}) {
  const { P, headW, facing, uid, anchors } = ctx;
  const top = P(anchors.headTop);
  const h = headW * (opts.style === "fennec" ? 1.0 : 0.7);
  const w = h * 0.55;
  const spread = facing === "front" ? headW * 0.34 : headW * 0.2;
  const g = `${uid}-ear-${opts.style}`;
  const ear = (x, mirror) => (
    <g transform={`translate(${x} ${top.y + headW * 0.12}) scale(${mirror ? -1 : 1} 1)`}>
      <path d={`M 0 0 C ${-w * 0.35} ${-h * 0.25} ${-w * 0.25} ${-h * 0.8} ${w * 0.05} ${-h} C ${w * 0.55} ${-h * 0.75} ${w * 0.7} ${-h * 0.25} ${w * 0.4} 0 Z`} fill={`url(#${g})`} stroke="#4a2f1a" strokeWidth={h * 0.02} />
      <path d={`M ${w * 0.08} ${-h * 0.05} C ${-w * 0.1} ${-h * 0.3} ${-w * 0.02} ${-h * 0.7} ${w * 0.08} ${-h * 0.85} C ${w * 0.4} ${-h * 0.65} ${w * 0.5} ${-h * 0.25} ${w * 0.32} ${-h * 0.05} Z`} fill="#f0b8b0" opacity="0.75" />
    </g>
  );
  return {
    behind: (
      <g className="ov ov--ears" filter={`url(#${uid}-shadow)`}>
        <defs><linearGradient id={g} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={opts.style === "fennec" ? "#d8b48a" : "#b5622e"} /><stop offset="1" stopColor={opts.style === "fennec" ? "#f3e0c2" : "#e08a4a"} /></linearGradient></defs>
        {ear(top.x - spread, true)}{ear(top.x + spread, false)}
      </g>
    ),
  };
}

/* ------------ BLUBBER / FAT STORE (tinted halo) ------------ */
function blubber(ctx, opts = {}) {
  const tint = opts.tint || "#cfe6ff";
  return {
    halo: true,
    skinLayers: [{ blend: "soft-light", opacity: 0.5, content: <div className="comp__tint" style={{ background: tint }} /> }],
  };
}

/* ------------ MANE ------------ */
function mane(ctx) {
  const { P, headW, uid, anchors } = ctx;
  const top = P(anchors.headTop), mouth = P(anchors.mouth);
  const cx = (top.x + mouth.x) / 2, cy = (top.y + mouth.y) / 2 + headW * 0.05;
  const r = Math.max(headW * 0.85, 40);
  const g = `${uid}-mane`;
  return {
    behind: (
      <g className="ov ov--mane">
        <defs>
          <radialGradient id={g}><stop offset="0.45" stopColor="#6b3d1a" /><stop offset="0.8" stopColor="#a5642a" /><stop offset="1" stopColor="#d9a15a" /></radialGradient>
          <filter id={`${g}-f`} x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="11" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={r * 0.35} xChannelSelector="R" yChannelSelector="G" /></filter>
        </defs>
        <g filter={`url(#${g}-f)`}>
          <circle cx={cx} cy={cy} r={r * 1.1} fill="#3a2010" opacity="0.5" />
          <circle cx={cx} cy={cy} r={r} fill={`url(#${g})`} />
        </g>
      </g>
    ),
  };
}

/* ------------ TRUNK ------------ */
function trunk(ctx) {
  const { P, headW, facing, uid, anchors } = ctx;
  const n = P(anchors.nose);
  const dir = facing === "front" ? -0.35 : -0.9;
  const L = Math.max(Math.min(headW * 1.1, ctx.W * 0.24), 60);
  const d = `M ${n.x} ${n.y} C ${n.x + dir * L * 0.15} ${n.y + L * 0.45} ${n.x + dir * L * 0.55} ${n.y + L * 0.7} ${n.x + dir * L * 0.7} ${n.y + L * 0.95}`;
  const g = `${uid}-trunk`;
  const w = Math.max(10, headW * 0.22);
  return {
    front: (
      <g className="ov ov--trunk" filter={`url(#${uid}-shadow)`}>
        <defs><linearGradient id={g} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4f4a46" /><stop offset="1" stopColor="#7d7670" /></linearGradient></defs>
        <path d={d} fill="none" stroke="#3c3835" strokeWidth={w * 1.25} strokeLinecap="round" opacity="0.6" />
        <path d={d} fill="none" stroke={`url(#${g})`} strokeWidth={w} strokeLinecap="round" />
        <path d={d} fill="none" stroke="#2b2826" strokeWidth={w * 0.06} strokeDasharray={`${w * 0.12} ${w * 0.28}`} opacity="0.6" />
        <path d={d} fill="none" stroke="#d9d3cc" strokeWidth={w * 0.18} strokeLinecap="round" opacity="0.35" transform={`translate(${-w * 0.2} 0)`} />
      </g>
    ),
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

/* ------------ HUMP ------------ */
function hump(ctx) {
  const { P, headW, W, uid, anchors, facing } = ctx;
  const bk = P(anchors.back), hp = P(anchors.hips);
  const front = facing === "front";
  // side view: a third of the way from the shoulders toward the hips, on top of the back line.
  // front view: behind the animal, peeking above the shoulders.
  const b = front ? { x: bk.x, y: bk.y + headW * 0.05 } : { x: bk.x + (hp.x - bk.x) * 0.35, y: Math.min(bk.y, hp.y) + Math.abs(hp.y - bk.y) * 0.1 };
  const rw = Math.max(headW * 0.7, W * 0.13), rh = rw * (front ? 0.75 : 0.6);
  const g = `${uid}-hump`;
  const shape = (
    <g className="ov ov--hump" filter={`url(#${uid}-shadow)`}>
      <defs><radialGradient id={g} cx="0.4" cy="0.3" r="0.8"><stop offset="0" stopColor="#e2b57a" /><stop offset="1" stopColor="#9a6a3a" /></radialGradient>
        <filter id={`${g}-f`} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="5" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={rw * 0.08} /></filter></defs>
      <path d={`M ${b.x - rw} ${b.y + rh * 0.35} C ${b.x - rw * 0.7} ${b.y - rh * 0.9} ${b.x + rw * 0.7} ${b.y - rh * 0.9} ${b.x + rw} ${b.y + rh * 0.35} Z`} fill={`url(#${g})`} filter={`url(#${g}-f)`} />
    </g>
  );
  return front ? { behind: shape } : { front: shape };
}

/* ------------ SHELL ------------ */
function shell(ctx) {
  const { P, headW, W, uid, anchors } = ctx;
  const b = P(anchors.back), h = P(anchors.hips);
  const cx = (b.x + h.x) / 2, cy = (b.y + h.y) / 2;
  const rx = Math.max(Math.abs(h.x - b.x) * 0.7 + headW * 0.4, W * 0.18), ry = Math.max(Math.abs(h.y - b.y) * 0.6 + headW * 0.3, rx * 0.55);
  const g = `${uid}-shell`;
  return {
    front: (
      <g className="ov ov--shell" filter={`url(#${uid}-shadow)`} opacity="0.94">
        <defs><radialGradient id={g} cx="0.4" cy="0.25" r="0.85"><stop offset="0" stopColor="#8c7a4a" /><stop offset="1" stopColor="#3e3220" /></radialGradient>
          <pattern id={`${g}-p`} width={rx * 0.42} height={ry * 0.5} patternUnits="userSpaceOnUse"><path d={`M ${rx * 0.21} 2 L ${rx * 0.4} ${ry * 0.14} L ${rx * 0.34} ${ry * 0.4} L ${rx * 0.08} ${ry * 0.4} L 2 ${ry * 0.14} Z`} fill="none" stroke="#1f1a10" strokeWidth={2} opacity="0.7" /></pattern></defs>
        <path d={`M ${cx - rx} ${cy + ry * 0.35} C ${cx - rx} ${cy - ry * 1.05} ${cx + rx} ${cy - ry * 1.05} ${cx + rx} ${cy + ry * 0.35} Z`} fill={`url(#${g})`} />
        <path d={`M ${cx - rx} ${cy + ry * 0.35} C ${cx - rx} ${cy - ry * 1.05} ${cx + rx} ${cy - ry * 1.05} ${cx + rx} ${cy + ry * 0.35} Z`} fill={`url(#${g}-p)`} />
        <path d={`M ${cx - rx} ${cy + ry * 0.35} C ${cx - rx} ${cy - ry * 1.05} ${cx + rx} ${cy - ry * 1.05} ${cx + rx} ${cy + ry * 0.35} Z`} fill="none" stroke="#d8c48a" strokeWidth={3} opacity="0.5" />
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

/* ------------ CURVED HORNS ------------ */
function horns(ctx) {
  const { P, headW, facing, uid, anchors } = ctx;
  const top = P(anchors.headTop);
  const h = Math.max(headW * 1.2, 50);
  const sw = Math.max(6, headW * 0.11);
  const spread = facing === "front" ? headW * 0.22 : headW * 0.12;
  const g = `${uid}-horn`;
  const d = `M 0 0 C ${h * 0.05} ${-h * 0.45} ${h * 0.35} ${-h * 0.95} ${h * 0.75} ${-h * 0.8} C ${h * 0.95} ${-h * 0.7} ${h * 0.98} ${-h * 0.45} ${h * 0.85} ${-h * 0.3}`;
  const horn = (x, mirror, sc = 1, op = 1) => (
    <g transform={`translate(${x} ${top.y + headW * 0.1}) scale(${mirror ? -sc : sc} ${sc})`} opacity={op}>
      <path d={d} fill="none" stroke="#2a1d10" strokeWidth={sw * 1.5} strokeLinecap="round" opacity="0.4" />
      <path d={d} fill="none" stroke={`url(#${g})`} strokeWidth={sw} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#1f150c" strokeWidth={sw * 0.35} strokeDasharray={`${sw * 0.25} ${sw * 0.45}`} opacity="0.5" />
    </g>
  );
  return {
    behind: (
      <g className="ov ov--horns" filter={`url(#${uid}-shadow)`}>
        <defs><linearGradient id={g} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6b4a2e" /><stop offset="1" stopColor="#c9a780" /></linearGradient></defs>
        {facing === "front" ? <>{horn(top.x - spread, true)}{horn(top.x + spread, false)}</> : <>{horn(top.x + spread, false, 0.9, 0.85)}{horn(top.x - spread * 0.3, true)}</>}
      </g>
    ),
  };
}

/* ------------ TUSKS ------------ */
function tusks(ctx) {
  const { P, headW, facing, uid, anchors } = ctx;
  const m = P(anchors.mouth);
  const L = Math.max(headW * 0.45, 24);
  const sw = Math.max(5, headW * 0.09);
  const dir = facing === "front" ? 0 : -1;
  const tusk = (k) => (
    <path key={k} d={`M ${m.x + k * headW * 0.2} ${m.y - L * 0.1} C ${m.x + k * headW * 0.25 + dir * L * 0.2} ${m.y + L * 0.4} ${m.x + k * headW * 0.15 + dir * L * 0.5} ${m.y + L * 0.7} ${m.x + k * headW * 0.05 + dir * L * 0.55} ${m.y + L}`} fill="none" stroke="#f3ead6" strokeWidth={sw} strokeLinecap="round" />
  );
  return {
    front: (
      <g className="ov ov--tusks" filter={`url(#${uid}-shadow)`}>
        {[-1, 1].map((k) => <path key={`s${k}`} d={`M ${m.x + k * headW * 0.2} ${m.y - L * 0.1} C ${m.x + k * headW * 0.25 + dir * L * 0.2} ${m.y + L * 0.4} ${m.x + k * headW * 0.15 + dir * L * 0.5} ${m.y + L * 0.7} ${m.x + k * headW * 0.05 + dir * L * 0.55} ${m.y + L}`} fill="none" stroke="#8a7a60" strokeWidth={sw * 1.3} strokeLinecap="round" opacity="0.5" />)}
        {[-1, 1].map(tusk)}
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
