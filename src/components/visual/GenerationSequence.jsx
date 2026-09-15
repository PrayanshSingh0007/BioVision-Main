import { useEffect } from "react";
import { animalById } from "../../data/animals";
import "./GenerationSequence.css";

/**
 * GenerationSequence — a short synthesis moment when the user generates a species:
 * the three chosen adaptations converge on the base animal, a biological scan passes over it,
 * DNA particles combine and the habitat light intensifies. ~2.4 s, then `onDone`.
 */
export default function GenerationSequence({ animal, habitat, traits, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  const positions = [{ x: "14%", y: "24%" }, { x: "86%", y: "24%" }, { x: "16%", y: "78%" }];
  return (
    <div className="gen" style={{ "--accent": habitat.accent }} role="status" aria-live="polite">
      <div className="gen__bloom" />
      <div className="gen__rings"><span /><span /><span /></div>
      <div className="gen__particles">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ "--i": i }} />)}</div>
      <div className="gen__subject">
        <img src={animal.image} alt="" draggable="false" />
        <div className="gen__scan" />
      </div>
      {traits.map((t, i) => (
        <div key={t.id} className="gen__chip" style={{ "--x": positions[i].x, "--y": positions[i].y, "--d": `${i * 0.12}s` }}>
          <img src={animalById[t.source].image} alt="" draggable="false" />
          <span>{t.name}</span>
        </div>
      ))}
      <div className="gen__label">
        <p className="eyebrow">Synthesizing species profile</p>
        <div className="gen__steps"><span>Merging adaptations</span><span>Scanning morphology</span><span>Estimating survival</span></div>
      </div>
    </div>
  );
}
