import { useEffect, useRef } from "react";
import { makeRng } from "./sceneUtils";
import leafB from "../../assets/environments/leaf-b.webp";
import "./AmbientBackground.css";

/**
 * CinematicBackground — the standing set behind every screen.
 * A dark forest canopy at dusk: deep green atmosphere, soft shafts of light through leaves,
 * drifting pollen and fireflies (canvas), and dark foliage silhouettes framing the lower edges.
 * Deliberately no star field or guide rings — this is a field journal, not a spaceship console.
 */
export default function AmbientBackground({ intensity = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0, w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const rng = makeRng(9001);
    const motes = Array.from({ length: Math.round(60 * intensity) }, () => ({
      x: rng(), y: rng(), r: 0.7 + rng() * 2.2, s: 0.012 + rng() * 0.035, a: 0.18 + rng() * 0.45, ph: rng() * Math.PI * 2, depth: 0.3 + rng() * 0.7, warm: rng() > 0.35,
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
        // fireflies (warm) and soft pollen drift (pale leaf-green) — no icy blue
        ctx.beginPath(); ctx.arc(px * w, py * h, r, 0, Math.PI * 2);
        ctx.fillStyle = p.warm ? `rgba(255, 205, 120, ${alpha})` : `rgba(210, 240, 195, ${alpha * 0.8})`; ctx.fill();
        if (r > 1.5) { ctx.beginPath(); ctx.arc(px * w, py * h, r * 3.2, 0, Math.PI * 2); ctx.fillStyle = p.warm ? `rgba(255, 190, 90, ${alpha * 0.1})` : `rgba(120, 220, 160, ${alpha * 0.1})`; ctx.fill(); }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
  }, [intensity]);

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__rays ambient__rays--cool" />
      <div className="ambient__rays ambient__rays--warm" />
      <div className="ambient__glow ambient__glow--a" />
      <div className="ambient__glow ambient__glow--b" />
      <img src={leafB} alt="" className="ambient__leaf ambient__leaf--l" draggable="false" />
      <img src={leafB} alt="" className="ambient__leaf ambient__leaf--r" draggable="false" />
      <canvas ref={ref} className="ambient__canvas" />
      <div className="ambient__vignette" />
    </div>
  );
}
