import { useEffect, useMemo, useRef } from "react";
import { makeRng, scatter } from "./sceneUtils";
import leafB from "../../assets/environments/leaf-b.webp";
import "./AmbientBackground.css";

/**
 * CinematicBackground — the standing set behind every screen.
 * A midnight laboratory overlooking a living world: deep navy atmosphere, a field of stars,
 * cool and warm volumetric light, drifting biological particles (canvas), faint scientific
 * guide rings, and dark foliage silhouettes framing the lower edges.
 */
export default function AmbientBackground({ intensity = 1 }) {
  const ref = useRef(null);
  const art = useMemo(() => build(), []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0, w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const rng = makeRng(9001);
    const motes = Array.from({ length: Math.round(60 * intensity) }, () => ({
      x: rng(), y: rng(), r: 0.7 + rng() * 2.2, s: 0.012 + rng() * 0.035, a: 0.18 + rng() * 0.45, ph: rng() * Math.PI * 2, depth: 0.3 + rng() * 0.7, warm: rng() > 0.7,
    }));
    const resize = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const onMove = (e) => { mouse.tx = e.clientX / window.innerWidth; mouse.ty = e.clientY / window.innerHeight; };
    resize(); window.addEventListener("resize", resize); window.addEventListener("pointermove", onMove, { passive: true });
    const t0 = performance.now();
    const draw = (now) => {
      const t = (now - t0) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
      ctx.clearRect(0, 0, w, h);
      for (const p of motes) {
        const px = ((p.x + Math.sin(t * p.s * 5 + p.ph) * 0.012 + (mouse.x - 0.5) * 0.03 * p.depth) % 1 + 1) % 1;
        const py = ((p.y - t * p.s * 0.045 + Math.cos(t * p.s * 4 + p.ph) * 0.006 + (mouse.y - 0.5) * 0.03 * p.depth) % 1 + 1) % 1;
        const tw = 0.55 + 0.45 * Math.sin(t * 1.2 + p.ph * 3);
        const alpha = p.a * tw, r = p.r * p.depth;
        ctx.beginPath(); ctx.arc(px * w, py * h, r, 0, Math.PI * 2);
        ctx.fillStyle = p.warm ? `rgba(255, 205, 120, ${alpha})` : `rgba(150, 230, 255, ${alpha * 0.85})`; ctx.fill();
        if (r > 1.5) { ctx.beginPath(); ctx.arc(px * w, py * h, r * 3.2, 0, Math.PI * 2); ctx.fillStyle = p.warm ? `rgba(255, 190, 90, ${alpha * 0.1})` : `rgba(94, 224, 255, ${alpha * 0.1})`; ctx.fill(); }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
  }, [intensity]);

  return (
    <div className="ambient" aria-hidden="true">
      <svg className="ambient__stars" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        {art.stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={0.5 + s.r * 1.3} fill="#dceeff" opacity={0.25 + s.p * 0.6} style={{ "--d": `${(s.p * 5).toFixed(2)}s` }} />)}
      </svg>
      <div className="ambient__rays ambient__rays--cool" />
      <div className="ambient__rays ambient__rays--warm" />
      <div className="ambient__glow ambient__glow--a" />
      <div className="ambient__glow ambient__glow--b" />
      <svg className="ambient__rings" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="#9ad8ff" strokeOpacity="0.07">
          <circle cx="1240" cy="140" r="260" strokeDasharray="4 10" /><circle cx="1240" cy="140" r="340" strokeOpacity="0.045" /><circle cx="360" cy="820" r="300" strokeDasharray="2 12" />
        </g>
      </svg>
      <img src={leafB} alt="" className="ambient__leaf ambient__leaf--l" draggable="false" />
      <img src={leafB} alt="" className="ambient__leaf ambient__leaf--r" draggable="false" />
      <canvas ref={ref} className="ambient__canvas" />
      <div className="ambient__vignette" />
    </div>
  );
}

function build() {
  const stars = scatter(makeRng(31), 120, 0, 1600, 0, 560);
  return { stars };
}
