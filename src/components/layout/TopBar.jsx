import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Check, ChevronRight, Maximize2, Minimize2, Sun } from "lucide-react";
import { useMission } from "../../state/MissionContext";
import Logo from "./Logo";
import { canFullscreen } from "../../utils/useIsTouch";
import "./TopBar.css";

const STEPS = [
  { path: "/habitat", label: "Habitat" },
  { path: "/species", label: "Base Animal" },
  { path: "/lab", label: "Genetic Lab" },
  { path: "/report", label: "Species Report" },
];

/** Fullscreen toggle — handy on a classroom projector. */
export function useFullscreen() {
  const [full, setFull] = useState(false);
  useEffect(() => {
    const sync = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  const toggle = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else document.documentElement.requestFullscreen?.();
    } catch { /* unsupported — ignore */ }
  };
  return [full, toggle];
}

/** Projector brightness toggle — flips `html[data-bright]`, which lifts plates, panels and text. */
export function useBright() {
  const [bright, setBright] = useState(() => document.documentElement.dataset.bright === "1");
  const toggle = () => {
    const next = !bright;
    document.documentElement.dataset.bright = next ? "1" : "0";
    setBright(next);
  };
  return [bright, toggle];
}

export default function TopBar() {
  const { pathname } = useLocation();
  const [full, toggleFull] = useFullscreen();
  const [bright, toggleBright] = useBright();
  const navigate = useNavigate();
  const { habitat, animal, traitIds } = useMission();
  const current = STEPS.findIndex((s) => pathname.startsWith(s.path));

  // Which steps are reachable (data exists for the earlier steps)
  const unlocked = [true, !!habitat, !!habitat && !!animal, !!habitat && !!animal && traitIds.length === 3];

  return (
    <header className="topbar">
      <Link to="/" className="topbar__brand" aria-label="BioVision home">
        <Logo size={30} />
        <span className="topbar__name">BioVision</span>
      </Link>

      <nav className="topbar__steps" aria-label="Mission progress">
        {STEPS.map((s, i) => {
          const state = i < current ? "done" : i === current ? "active" : "todo";
          const can = unlocked[i] && i !== current;
          return (
            <div key={s.path} className="topbar__stepwrap">
              <button
                type="button"
                className={`topbar__step topbar__step--${state}`}
                disabled={!can}
                onClick={() => can && navigate(s.path)}
              >
                <span className="topbar__dot">{state === "done" ? <Check size={12} strokeWidth={3} /> : i + 1}</span>
                <span className="topbar__steplabel">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <ChevronRight size={14} className="topbar__chev" />}
            </div>
          );
        })}
      </nav>

      <div className="topbar__context">
        {habitat && <span className="topbar__chip" style={{ "--chip": habitat.accent }}><i />{habitat.name}</span>}
        {animal && <span className="topbar__chip"><img src={animal.image} alt="" />{animal.shortName}</span>}
        <button type="button" className={`topbar__reset ${bright ? "topbar__reset--on" : ""}`} onClick={toggleBright} title={bright ? "Projector brightness: on" : "Projector brightness: off"} aria-pressed={bright}>
          <Sun size={15} />
        </button>
        {canFullscreen() && (
          <button type="button" className="topbar__reset" onClick={toggleFull} title={full ? "Exit fullscreen" : "Fullscreen (for the projector)"}>
            {full ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        )}
      </div>
    </header>
  );
}
