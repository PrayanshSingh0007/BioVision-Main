import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import PageTransition from "../../components/ui/PageTransition";
import FieldReel from "../../components/visual/FieldReel";
import { HABITAT_PLATE_SOURCES } from "../../components/visual/HabitatScene";
import Logo from "../../components/layout/Logo";
import missionPlate from "../../assets/environments/jungle.webp";
import missionPlate4k from "../../assets/environments/jungle-4k.webp";
import habitats from "../../data/habitats";
import animals from "../../data/animals";
import traits from "../../data/traits";
import "./Boot.css";

const STAGES = [
  { label: "Opening the field journal", detail: "Ready" },
  { label: "Mapping the habitats", detail: `${habitats.length} places` },
  { label: "Sorting the species archive", detail: `${animals.length} animals` },
  { label: "Cataloguing adaptations", detail: `${traits.length} abilities` },
  { label: "Setting up the lab", detail: "Ready" },
];
// Slow enough that each field photograph in the reel is actually seen (≈7 s total).
const STAGE_MS = 1200;

/** The big photographs the next two pages draw. Fetching and decoding them here (same srcset the
 * pages use, so the browser picks and caches the same candidate) means Mission and Habitat paint
 * instantly instead of stalling on a 2K/4K decode the moment they mount. */
const WARM = [{ src: missionPlate, srcSet: `${missionPlate} 2560w, ${missionPlate4k} 3000w` }, ...HABITAT_PLATE_SOURCES];
function warmPlates() {
  return WARM.map(({ src, srcSet }) => { const img = new Image(); img.sizes = "100vw"; img.srcset = srcSet; img.src = src; img.decode?.().catch(() => {}); return img; });
}

export default function Boot() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const done = useRef(false);
  const finish = () => { if (!done.current) { done.current = true; navigate("/mission"); } };

  useEffect(() => {
    const warmed = warmPlates(); // kept referenced until unmount so the decoded bitmaps stay cached
    const timers = STAGES.map((_, i) => setTimeout(() => setStage(i + 1), STAGE_MS * (i + 1)));
    const end = setTimeout(finish, STAGE_MS * STAGES.length + 900);
    return () => { timers.forEach(clearTimeout); clearTimeout(end); warmed.length = 0; };
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
          <div className="boot__brand"><Logo size={34} /><span>BioVision</span><span className="boot__ver">Getting things ready</span></div>
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
        </div>
      </div>
    </PageTransition>
  );
}
