import { useEffect } from "react";
import { animalById } from "../../data/animals";
import "./GenerationSequence.css";

/**
 * GenerationSequence — a short moment when the user creates a species: the three borrowed
 * abilities drift in and settle into the base animal as it comes up out of the dark, like a
 * photograph developing. ~2.4 s, then `onDone`.
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
      <div className="gen__subject">
        <img src={animal.image} alt="" draggable="false" />
      </div>
      {traits.map((t, i) => (
        <div key={t.id} className="gen__chip" style={{ "--x": positions[i].x, "--y": positions[i].y, "--d": `${i * 0.12}s` }}>
          <img src={animalById[t.source].image} alt="" draggable="false" />
          <span>{t.name}</span>
        </div>
      ))}
      <div className="gen__label">
        <p className="eyebrow">Writing the field entry</p>
        <div className="gen__steps"><span>Combining abilities</span><span>Checking the body plan</span><span>Judging survival</span></div>
      </div>
    </div>
  );
}
