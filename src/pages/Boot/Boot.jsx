import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import PageTransition from "../../components/ui/PageTransition";
import FieldReel from "../../components/visual/FieldReel";
import Logo from "../../components/layout/Logo";
import habitats from "../../data/habitats";
import animals from "../../data/animals";
import traits from "../../data/traits";
import "./Boot.css";

const STAGES = [
  { label: "Biosystem initialization", detail: "Simulation core online" },
  { label: "Calibrating habitat database", detail: `${habitats.length} environments mapped` },
  { label: "Indexing species archive", detail: `${animals.length} base species` },
  { label: "Loading adaptation library", detail: `${traits.length} inheritable traits` },
  { label: "Preparing species simulation", detail: "Composition engine ready" },
];
const STAGE_MS = 520;

export default function Boot() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const done = useRef(false);
  const finish = () => { if (!done.current) { done.current = true; navigate("/mission"); } };

  useEffect(() => {
    const timers = STAGES.map((_, i) => setTimeout(() => setStage(i + 1), STAGE_MS * (i + 1)));
    const end = setTimeout(finish, STAGE_MS * STAGES.length + 700);
    return () => { timers.forEach(clearTimeout); clearTimeout(end); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.round((stage / STAGES.length) * 100);
  return (
    <PageTransition className="page boot">
      <div className="boot__inner">
        <div className="boot__visual">
          <div className="boot__pulse" />
          <div className="boot__ring boot__ring--a" /><div className="boot__ring boot__ring--b" />
          <FieldReel index={stage} size={380} />
        </div>
        <div className="boot__panel panel">
          <div className="boot__brand"><Logo size={34} /><span>BioVision</span><span className="boot__ver">Biosystem initialization</span></div>
          <ul className="boot__stages">
            {STAGES.map((s, i) => {
              const state = i < stage ? "done" : i === stage ? "active" : "todo";
              return (
                <li key={s.label} className={`boot__stage boot__stage--${state}`}>
                  <span className="boot__icon">{state === "done" ? <Check size={13} strokeWidth={3} /> : <span className="boot__spin" />}</span>
                  <span className="boot__label">{s.label}</span>
                  <span className="boot__detail">{state !== "todo" ? s.detail : ""}</span>
                </li>
              );
            })}
          </ul>
          <div className="boot__progress">
            <div className="boot__track"><div className="boot__fill" style={{ width: `${progress}%` }} /></div>
            <span>{progress}%</span>
          </div>
          <button type="button" className="boot__skip" onClick={finish}>Continue <ChevronRight size={15} /></button>
        </div>
      </div>
    </PageTransition>
  );
}
