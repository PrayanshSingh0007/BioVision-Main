/** BioVision mark — a leaf whose vein is a strand of DNA, set in a midnight badge. */
export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="logoLeaf" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#2ec4b6" /><stop offset="1" stopColor="#8ff2c9" /></linearGradient>
        <radialGradient id="logoBg" cx="0.35" cy="0.3" r="0.85"><stop offset="0" stopColor="#173263" /><stop offset="1" stopColor="#08122a" /></radialGradient>
        <radialGradient id="logoSeed" cx="0.35" cy="0.35" r="0.7"><stop offset="0" stopColor="#fff0c2" /><stop offset="1" stopColor="#e0902a" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#logoBg)" stroke="rgba(94,224,255,.45)" strokeWidth="1.5" />
      <path d="M18 44 C 18 24 30 14 48 14 C 48 34 36 46 18 44 Z" fill="url(#logoLeaf)" />
      <path d="M21 42 C 27 36 31 33 35 30 C 33 27 32 24 34 21 M 26 39 C 30 35 33 34 37 32 C 39 30 41 27 44 24" stroke="#08122a" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".75" />
      <circle cx="21" cy="46" r="5" fill="url(#logoSeed)" />
    </svg>
  );
}
