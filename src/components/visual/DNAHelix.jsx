import "./DNAHelix.css";

/**
 * Animated SVG double helix. Pure CSS animation — no JS per frame.
 * `size` is the height in px; the width scales with it.
 */
export default function DNAHelix({ size = 420, className = "", opacity = 1 }) {
  const rungs = 14;
  const H = 400, W = 120, amp = 44;
  const items = Array.from({ length: rungs }, (_, i) => {
    const y = 12 + (i * (H - 24)) / (rungs - 1);
    return { y, i };
  });
  return (
    <svg className={`helix ${className}`} viewBox={`0 0 ${W} ${H}`} style={{ height: size, width: (size * W) / H, opacity }} aria-hidden="true">
      <defs>
        <linearGradient id="helixA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9beeff" /><stop offset="1" stopColor="#2ec4b6" /></linearGradient>
        <linearGradient id="helixB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd27a" /><stop offset="1" stopColor="#e0902a" /></linearGradient>
        <filter id="helixGlow"><feGaussianBlur stdDeviation="1.6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g filter="url(#helixGlow)">
        {items.map(({ y, i }) => (
          <g key={i} className="helix__rung" style={{ "--ph": `${(-i / rungs) * 3.6}s` }}>
            <line className="helix__bar" x1={W / 2 - amp} x2={W / 2 + amp} y1={y} y2={y} stroke="url(#helixA)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            <circle className="helix__nodeA" cx={W / 2 - amp} cy={y} r="4.2" fill="url(#helixA)" />
            <circle className="helix__nodeB" cx={W / 2 + amp} cy={y} r="4.2" fill="url(#helixB)" />
          </g>
        ))}
      </g>
    </svg>
  );
}
