/**
 * Photographic trait renderers.
 *
 * Each body part is a real photograph of the source animal (see src/data/parts.js), cut out and
 * attached to the base animal at an anatomical anchor. `photoPart` scales and rotates the part so
 * that its root→tip axis spans the requested length and angle in the 1000-unit composition space.
 *
 * Angles use the SVG convention (0° = +x, −90° = straight up). Renderers are written for a
 * left-facing base animal; `ang`/`mir` flip them for right-facing ones.
 */
import { PARTS } from "../../data/parts";

/** Mirror an angle across the vertical axis when the base animal faces right. */
const ang = (facing, a) => (facing === "right" ? -180 - a : a);
/** Should a part photographed on a `partFaces`-facing animal be mirrored for this base animal? */
const mir = (facing, partFaces = "left") => (facing === "right") !== (partFaces === "right");

function photoPart(name, { at, angle, length, mirror = false, opacity = 1, className }) {
  const p = PARTS[name];
  const dx = p.tip[0] - p.root[0], dy = p.tip[1] - p.root[1];
  const s = length / Math.hypot(dx, dy);
  const partAngle = (Math.atan2(dy, mirror ? -dx : dx) * 180) / Math.PI;
  const inner = mirror ? `scale(-1 1) translate(${-p.root[0]} ${-p.root[1]})` : `translate(${-p.root[0]} ${-p.root[1]})`;
  return (
    <g transform={`translate(${at.x} ${at.y}) rotate(${angle - partAngle}) scale(${s})`} opacity={opacity}>
      <g className={className}>
        <image href={p.src} width={p.w} height={p.h} transform={inner} />
      </g>
    </g>
  );
}

/* ------------ WINGS (Flight / Silent flight) ------------ */
const WING_SETS = {
  eagle: { back: "wing-eagle-near", front: "wing-eagle-far" },
  owl: { back: "wing-owl-far", front: "wing-owl-near" },
};

export function wings(ctx, opts = {}) {
  const { P, W, headW, facing, anchors } = ctx;
  const set = WING_SETS[opts.palette] || WING_SETS.eagle;
  const root = P(anchors.back);
  const L = Math.max(W * 0.55, headW * 1.8);
  const m = mir(facing);
  const fwd = facing === "right" ? 1 : -1;
  return {
    // No feDropShadow here: wings are the one continuously-animating overlay (wingFlex CSS animation),
    // and an SVG blur filter over an ancestor of animated, full-resolution photo content gets
    // recomputed every single frame — the wing was the main source of the "laggy" feel. The base
    // animal's own drop-shadow plus the ground shadow already ground the composition visually.
    behind: (
      <g className="ov ov--wings">
        {photoPart(set.front, { at: { x: root.x + fwd * headW * 0.18, y: root.y + headW * 0.06 }, angle: ang(facing, -128), length: L * 0.9, mirror: m, opacity: 0.92, className: "ov__wing ov__wing--far" })}
        {photoPart(set.back, { at: root, angle: ang(facing, -52), length: L, mirror: m, className: "ov__wing ov__wing--near" })}
      </g>
    ),
  };
}

/* ------------ ANTLERS ------------ */
export function antlers(ctx) {
  const { P, headW, facing, uid, anchors } = ctx;
  const top = P(anchors.headTop);
  const tilt = facing === "left" ? -6 : facing === "right" ? 6 : 0;
  return {
    behind: (
      <g className="ov ov--antlers" filter={`url(#${uid}-shadow)`}>
        {photoPart("antlers-stag", { at: { x: top.x, y: top.y + headW * 0.16 }, angle: -90 + tilt, length: headW * 1.5 })}
      </g>
    ),
  };
}

/* ------------ CURVED HORNS ------------ */
export function horns(ctx) {
  const { P, headW, facing, uid, anchors } = ctx;
  const top = P(anchors.headTop);
  return {
    behind: (
      <g className="ov ov--horns" filter={`url(#${uid}-shadow)`}>
        {photoPart("horns-ibex", { at: { x: top.x, y: top.y + headW * 0.16 }, angle: facing === "front" ? -90 : ang(facing, -80), length: headW * 1.5, mirror: mir(facing) })}
      </g>
    ),
  };
}

/* ------------ TAILS (bushy / scarf) ------------ */
export function tail(ctx, opts = {}) {
  const { P, W, headW, facing, uid, anchors } = ctx;
  const front = facing === "front";
  // Side view: the tail leaves the rump and curls up behind the animal. Front view: it rises above the hips so it stays visible.
  const rear = front ? P(anchors.hips) : P(anchors.rear);
  const L = Math.max(W * 0.4, headW * 1.5);
  const snow = opts.palette === "snow";
  return {
    behind: (
      <g className="ov ov--tail" filter={`url(#${uid}-shadow)`}>
        {snow
          ? photoPart("tail-snowleopard", { at: { x: rear.x, y: rear.y - headW * 0.1 }, angle: front ? -60 : ang(facing, -38), length: L, mirror: mir(facing, "right") })
          : photoPart("tail-squirrel", { at: { x: rear.x, y: rear.y - headW * 0.05 }, angle: front ? -84 : ang(facing, -72), length: L, mirror: mir(facing) })}
      </g>
    ),
  };
}

/* ------------ BEAKS / BILLS ------------ */
const BILLS = {
  toucan: { part: "beak-toucan", angle: 168, frontAngle: 150, length: 1.4 },
  heron: { part: "bill-heron", angle: 178, frontAngle: 160, length: 1.5 },
  flamingo: { part: "bill-flamingo", angle: 118, frontAngle: 108, length: 1.0 },
};

export function beak(ctx, opts = {}) {
  const { P, headW, facing, uid, anchors } = ctx;
  const b = BILLS[opts.style] || BILLS.toucan;
  const n = P(anchors.nose);
  const a = facing === "front" ? b.frontAngle : ang(facing, b.angle);
  return {
    front: (
      <g className="ov ov--beak" filter={`url(#${uid}-shadow-f)`}>
        {photoPart(b.part, { at: { x: n.x, y: n.y - headW * 0.04 }, angle: a, length: headW * b.length, mirror: mir(facing) })}
      </g>
    ),
  };
}

/* ------------ BIG EARS (fox / fennec) ------------ */
export function bigEars(ctx, opts = {}) {
  const { P, headW, facing, uid, anchors } = ctx;
  const top = P(anchors.headTop);
  const fennec = opts.style === "fennec";
  const kind = fennec ? "fennec" : "fox";
  const L = headW * (fennec ? 1.0 : 0.72);
  const spread = facing === "front" ? headW * 0.34 : headW * 0.2;
  const y = top.y + headW * 0.14;
  return {
    behind: (
      <g className="ov ov--ears" filter={`url(#${uid}-shadow)`}>
        {photoPart(`ears-${kind}-l`, { at: { x: top.x - spread, y }, angle: -104, length: L })}
        {photoPart(`ears-${kind}-r`, { at: { x: top.x + spread, y }, angle: -76, length: L })}
      </g>
    ),
  };
}

/* ------------ MANE ------------ */
export function mane(ctx) {
  const { P, headW, facing, anchors } = ctx;
  const top = P(anchors.headTop), mouth = P(anchors.mouth);
  const c = { x: (top.x + mouth.x) / 2, y: (top.y + mouth.y) / 2 + headW * 0.05 };
  return {
    behind: (
      <g className="ov ov--mane">
        {photoPart("mane-lion", { at: c, angle: -90, length: headW * 0.55, mirror: mir(facing) })}
      </g>
    ),
  };
}

/* ------------ TRUNK ------------ */
export function trunk(ctx) {
  const { P, headW, facing, uid, anchors } = ctx;
  const n = P(anchors.nose);
  return {
    front: (
      <g className="ov ov--trunk" filter={`url(#${uid}-shadow-f)`}>
        {photoPart("trunk-elephant", { at: { x: n.x, y: n.y - headW * 0.08 }, angle: facing === "front" ? 92 : ang(facing, 104), length: headW * 1.6, mirror: mir(facing) })}
      </g>
    ),
  };
}

/* ------------ TUSKS ------------ */
export function tusks(ctx) {
  const { P, headW, facing, uid, anchors } = ctx;
  const m = P(anchors.mouth);
  const fwd = facing === "right" ? 1 : -1;
  const y = m.y + headW * 0.18;
  const L = headW * 0.62;
  return {
    front: (
      <g className="ov ov--tusks" filter={`url(#${uid}-shadow-f)`}>
        {photoPart("tusk-hippo", { at: { x: m.x - fwd * headW * 0.1, y }, angle: facing === "front" ? -100 : ang(facing, -112), length: L * 0.9, mirror: mir(facing), opacity: 0.95 })}
        {photoPart("tusk-hippo", { at: { x: m.x + fwd * headW * 0.12, y }, angle: facing === "front" ? -80 : ang(facing, -124), length: L, mirror: mir(facing) })}
      </g>
    ),
  };
}

/* ------------ HUMP ------------ */
export function hump(ctx) {
  const { P, headW, W, uid, anchors, facing } = ctx;
  const bk = P(anchors.back), hp = P(anchors.hips);
  const front = facing === "front";
  const b = front
    ? { x: bk.x, y: bk.y + headW * 0.12 }
    : { x: bk.x + (hp.x - bk.x) * 0.35, y: Math.min(bk.y, hp.y) + Math.abs(hp.y - bk.y) * 0.1 + headW * 0.32 };
  return {
    behind: (
      <g className="ov ov--hump" filter={`url(#${uid}-shadow)`}>
        {photoPart("hump-camel", { at: b, angle: -90, length: Math.max(headW * (front ? 1.15 : 0.95), W * 0.13) })}
      </g>
    ),
  };
}

/* ------------ SHELL ------------ */
export function shell(ctx) {
  const { P, headW, W, uid, anchors, facing } = ctx;
  const b = P(anchors.back), h = P(anchors.hips);
  const c = { x: (b.x + h.x) / 2, y: Math.min(b.y, h.y) + headW * 0.55 };
  return {
    behind: (
      <g className="ov ov--shell" filter={`url(#${uid}-shadow)`}>
        {photoPart("shell-tortoise", { at: c, angle: -90, length: Math.max(W * 0.2, headW * 0.9), mirror: mir(facing, "right") })}
      </g>
    ),
  };
}
