import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Maximize2, Minimize2, X } from "lucide-react";
import Button from "../../components/ui/Button";
import PageTransition from "../../components/ui/PageTransition";
import Logo from "../../components/layout/Logo";
import { useFullscreen } from "../../components/layout/TopBar";
import { canFullscreen } from "../../utils/useIsTouch";
import jungle from "../../assets/environments/jungle.webp";
import jungle4k from "../../assets/environments/jungle-4k.webp";
import clouds from "../../assets/environments/clouds.webp";
import "./Landing.css";

/**
 * Landing — one photograph of a mountain rainforest with mist moving through the canopy,
 * graded like a film frame. Nothing is added to the scene: light, drifting mist and a
 * minimal interface.
 */
export default function Landing() {
  const navigate = useNavigate();
  const [full, toggleFull] = useFullscreen();
  const [science, setScience] = useState(false);
  const sceneRef = useRef(null);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e) => { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; if (!raf) raf = requestAnimationFrame(tick); };
    const tick = () => { cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06; el.style.setProperty("--px", cx.toFixed(4)); el.style.setProperty("--py", cy.toFixed(4)); raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.0005 ? requestAnimationFrame(tick) : 0; };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <PageTransition className="page landing">
      <div className="j" ref={sceneRef} aria-hidden="true">
        {/* SVG filters: wind through the canopy, mist boiling in the valley */}
        <svg className="j__defs" width="0" height="0">
          <defs>
            <filter id="bv-wind" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="3" result="n">
                <animate attributeName="baseFrequency" values="0.006 0.012;0.0078 0.0102;0.006 0.012" dur="12s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="bv-mistflow" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.004 0.009" numOctaves="2" seed="11" result="n">
                <animate attributeName="baseFrequency" values="0.004 0.009;0.0056 0.0072;0.004 0.009" dur="18s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="n" scale="40" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        {/* far plane: the ridge — slow camera drift. The photographed mist rides on the same camera,
            as a masked copy displaced by evolving noise so it boils and drifts. */}
        <div className="j__cam j__cam--far">
          <img src={jungle} srcSet={`${jungle} 2560w, ${jungle4k} 3000w`} sizes="100vw" alt="" className="j__plate" fetchPriority="high" decoding="async" draggable="false" />
          <div className="j__half j__mistflow"><img src={jungle} srcSet={`${jungle} 2560w, ${jungle4k} 3000w`} sizes="100vw" alt="" className="j__plate j__plate--mist" decoding="async" draggable="false" /></div>
        </div>

        {/* clouds drifting across the sky and the valley mist */}
        <div className="j__sky j__sky--slow" style={{ "--tile": `url(${clouds})` }} />
        <div className="j__sky j__sky--fast" style={{ "--tile": `url(${clouds})` }} />
        <div className="j__grade" />

        <div className="j__wisp j__wisp--a" /><div className="j__wisp j__wisp--b" /><div className="j__wisp j__wisp--c" />
        <div className="j__mist j__mist--far" />

        {/* near plane: foreground canopy, moving in the wind */}
        <div className="j__cam j__cam--near"><div className="j__half j__wind"><img src={jungle} srcSet={`${jungle} 2560w, ${jungle4k} 3000w`} sizes="100vw" alt="" className="j__plate j__plate--near" decoding="async" draggable="false" /></div></div>
        <div className="j__mist j__mist--near" />
        <div className="j__light" />
        <div className="j__vignette" />
      </div>

      <div className="landing__ui">
        <header className="landing__top rise" style={{ "--d": "0.05s" }}>
          <div className="landing__brand"><Logo size={38} /><span>BioVision</span></div>
          {canFullscreen() && <button type="button" className="landing__full" onClick={toggleFull} aria-label={full ? "Exit fullscreen" : "Fullscreen"}>{full ? <Minimize2 size={14} /> : <Maximize2 size={14} />}<span>{full ? "Exit" : "Fullscreen"}</span></button>}
        </header>

        <div className="landing__copy">
          <p className="eyebrow rise" style={{ "--d": "0.2s" }}>A field guide to animals that don’t exist yet</p>
          <h1 className="landing__title rise" style={{ "--d": "0.3s" }}>Design an animal<br />that could<br /><em>actually</em> survive</h1>
          <p className="landing__desc rise" style={{ "--d": "0.45s" }}>
            Choose a habitat and a real animal, then lend it three adaptations from other species. A short field report tells you whether it would make it.
          </p>
          <div className="landing__actions rise" style={{ "--d": "0.6s" }}>
            <Button size="lg" iconRight={ArrowRight} onClick={() => navigate("/boot")}>Begin Expedition</Button>
            <button type="button" className="landing__link" onClick={() => setScience(true)}><BookOpen size={16} />How the science works</button>
          </div>
        </div>

        <footer className="landing__meta rise" style={{ "--d": "0.8s" }}>Runs entirely on this device — no internet needed</footer>
      </div>

      {science && (
        <div className="landing__modal" role="dialog" aria-modal="true" aria-label="The science behind BioVision" onClick={() => setScience(false)}>
          <div className="landing__sheet panel" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="landing__close" onClick={() => setScience(false)} aria-label="Close"><X size={18} /></button>
            <p className="eyebrow">The science behind BioVision</p>
            <h2 className="display">Adaptation, inheritance and trade-offs</h2>
            <div className="landing__sheetgrid">
              <div><h3>Adaptation</h3><p>An adaptation is a body feature or behaviour that helps an organism survive and reproduce in its environment — thick fur in the cold, webbed feet in water, camouflage among leaves.</p></div>
              <div><h3>Habitat specialisation</h3><p>The same trait can be a superpower in one habitat and a burden in another. Insulation that saves a polar bear would overheat an animal in the desert.</p></div>
              <div><h3>Inheritance</h3><p>Traits pass from parents to offspring through genes. BioVision lets you imagine inheriting adaptations from different animals to explore what each one is for.</p></div>
              <div><h3>Trade-offs</h3><p>Every adaptation has a cost: energy, weight, speed or visibility. Survival depends on the balance between benefits and costs in a specific environment.</p></div>
            </div>
            <p className="landing__disclaimer">BioVision is an educational simulation. Its trait combinations and survival scores are illustrative, not real genetic predictions.</p>
            <Button onClick={() => { setScience(false); navigate("/boot"); }} iconRight={ArrowRight}>Begin Expedition</Button>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
