/** Deterministic helpers for procedural SVG scenery. */
export function makeRng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/** Smooth mountain / hill ridge polygon from baseline up. */
export function ridgePath(rng, { width = 1600, baseY = 620, height = 200, segments = 9, jag = 0.6, floor = 900 }) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const h = height * (0.35 + rng() * 0.65);
    pts.push([x, baseY - h]);
  }
  let d = `M -20 ${floor} L -20 ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const mx = (x1 + x2) / 2;
    if (jag > 0.5) {
      // jagged peaks
      const px = mx + (rng() - 0.5) * (x2 - x1) * 0.4;
      const py = Math.min(y1, y2) - rng() * height * 0.35 * jag;
      d += ` L ${px.toFixed(1)} ${py.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    } else {
      d += ` Q ${mx.toFixed(1)} ${(Math.min(y1, y2) - rng() * height * 0.25).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }
  }
  d += ` L ${width + 20} ${floor} Z`;
  return d;
}

/** Conifer tree at (x, baseY), height h. */
export function conifer(x, baseY, h, w = h * 0.36) {
  const tiers = 4;
  let d = "";
  for (let t = 0; t < tiers; t++) {
    const ty = baseY - (h * (t + 1)) / (tiers + 0.4);
    const tw = w * (1 - t * 0.2);
    const by = baseY - (h * t) / (tiers + 0.4) - h * 0.05;
    d += `M ${x} ${ty} L ${x + tw} ${by} L ${x - tw} ${by} Z `;
  }
  d += `M ${x - w * 0.08} ${baseY} h ${w * 0.16} v ${-h * 0.12} h ${-w * 0.16} Z`;
  return d;
}

/** Broadleaf tree: trunk + blobby canopy path. */
export function broadleaf(rng, x, baseY, h) {
  const w = h * 0.7;
  const cy = baseY - h * 0.62;
  let d = `M ${x - w * 0.06} ${baseY} L ${x - w * 0.04} ${cy} L ${x + w * 0.04} ${cy} L ${x + w * 0.06} ${baseY} Z `;
  const blobs = 6;
  for (let i = 0; i < blobs; i++) {
    const a = (i / blobs) * Math.PI * 2;
    const r = w * (0.22 + rng() * 0.12);
    const bx = x + Math.cos(a) * w * 0.28;
    const by = cy + Math.sin(a) * h * 0.16;
    d += circlePath(bx, by, r);
  }
  d += circlePath(x, cy, w * 0.34);
  return d;
}

export function circlePath(cx, cy, r) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 `;
}

/** Tropical palm-like frond cluster. */
export function frondCluster(rng, x, baseY, size, count = 7) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = -Math.PI * 0.95 + (i / (count - 1)) * Math.PI * 0.9 + (rng() - 0.5) * 0.2;
    const len = size * (0.7 + rng() * 0.4);
    const ex = x + Math.cos(a) * len, ey = baseY + Math.sin(a) * len;
    const cx = x + Math.cos(a - 0.4) * len * 0.6, cy = baseY + Math.sin(a - 0.4) * len * 0.6;
    const wdt = size * 0.14;
    d += `M ${x} ${baseY} Q ${cx} ${cy} ${ex} ${ey} Q ${cx + wdt} ${cy + wdt} ${x} ${baseY} Z `;
  }
  return d;
}

/** Large tropical leaf (monstera-ish silhouette) */
export function bigLeaf(x, y, size, angle = 0, flip = false) {
  const s = flip ? -1 : 1;
  const d = `M 0 0 C ${20 * s} ${-size * 0.3} ${size * 0.7 * s} ${-size * 0.75} ${size * s} ${-size * 0.55} C ${size * 0.8 * s} ${-size * 0.3} ${size * 0.55 * s} ${-size * 0.05} ${size * 0.5 * s} ${size * 0.15} C ${size * 0.3 * s} ${size * 0.05} ${size * 0.12 * s} ${-size * 0.05} 0 0 Z`;
  return { d, transform: `translate(${x} ${y}) rotate(${angle})` };
}

export function reeds(rng, x0, x1, baseY, count, hMin, hMax) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = x0 + rng() * (x1 - x0);
    const h = hMin + rng() * (hMax - hMin);
    const lean = (rng() - 0.5) * 30;
    d += `M ${x} ${baseY} Q ${x + lean * 0.5} ${baseY - h * 0.55} ${x + lean} ${baseY - h} `;
  }
  return d;
}

export function grassTufts(rng, x0, x1, baseY, count, hMin, hMax) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = x0 + rng() * (x1 - x0);
    const blades = 3 + Math.floor(rng() * 3);
    for (let b = 0; b < blades; b++) {
      const h = hMin + rng() * (hMax - hMin);
      const lean = (rng() - 0.5) * 40;
      d += `M ${x + b * 4} ${baseY} Q ${x + b * 4 + lean * 0.4} ${baseY - h * 0.6} ${x + b * 4 + lean} ${baseY - h} `;
    }
  }
  return d;
}

export function scatter(rng, count, x0, x1, y0, y1) {
  return Array.from({ length: count }, () => ({ x: x0 + rng() * (x1 - x0), y: y0 + rng() * (y1 - y0), r: rng(), p: rng() }));
}

/** Softer conifer: rounded, drooping tiers. */
export function softConifer(x, baseY, h, w = h * 0.34) {
  const tiers = 5;
  let d = "";
  for (let t = 0; t < tiers; t++) {
    const top = baseY - h * (0.22 + (t * 0.78) / tiers) - h * 0.1;
    const bot = baseY - h * (0.1 + (t * 0.78) / tiers);
    const tw = w * (1.05 - t * 0.17);
    d += `M ${x} ${top} C ${x + tw * 0.35} ${top + (bot - top) * 0.55} ${x + tw * 0.7} ${bot - 6} ${x + tw} ${bot + 4} Q ${x + tw * 0.5} ${bot - 10} ${x} ${bot - 4} Q ${x - tw * 0.5} ${bot - 10} ${x - tw} ${bot + 4} C ${x - tw * 0.7} ${bot - 6} ${x - tw * 0.35} ${top + (bot - top) * 0.55} ${x} ${top} Z `;
  }
  d += `M ${x - w * 0.07} ${baseY} h ${w * 0.14} v ${-h * 0.14} h ${-w * 0.14} Z`;
  return d;
}
