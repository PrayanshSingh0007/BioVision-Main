import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Thermometer, AlertTriangle, Gauge } from "lucide-react";
import Button from "../../components/ui/Button";
import PageTransition from "../../components/ui/PageTransition";
import HabitatScene from "../../components/visual/HabitatScene";
import habitats from "../../data/habitats";
import { useMission } from "../../state/MissionContext";
import { useIsTouch } from "../../utils/useIsTouch";
import "./Habitat.css";

/**
 * HabitatCarousel — seven environment panels side by side; the active one expands into a
 * cinematic card with climate, challenges and an "Enter Habitat" control.
 */
export default function Habitat() {
  const navigate = useNavigate();
  const { habitat, setHabitat } = useMission();
  const [hover, setHover] = useState(null);
  const touch = useIsTouch();
  const activeId = hover || habitat?.id || habitats[0].id;

  return (
    <PageTransition className="page page--bar habitat">
      <div className="habitat__inner">
        <header className="habitat__head rise">
          <div>
            <p className="eyebrow">One · Habitat</p>
            <h1 className="display habitat__title">Where will your animal live?</h1>
          </div>
          <p className="habitat__sub text-balance">Each place pushes back in its own way — cold, drought, competition, thin air. Your animal will be judged on how well it copes here.</p>
        </header>

        <div className="habitat__carousel" onMouseLeave={touch ? undefined : () => setHover(null)}>
          {habitats.map((h, i) => {
            const active = activeId === h.id;
            const selected = habitat?.id === h.id;
            return (
              <article
                key={h.id}
                className={`hpanel ${active ? "hpanel--active" : ""} ${selected ? "hpanel--selected" : ""} rise`}
                style={{ "--accent": h.accent, "--d": `${0.1 + i * 0.06}s` }}
                onMouseEnter={touch ? undefined : () => setHover(h.id)}
                onClick={() => { setHover(h.id); setHabitat(h.id); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setHabitat(h.id); } }}
                aria-pressed={selected}
              >
                <div className="hpanel__scene"><HabitatScene habitat={h} animated={active} /></div>
                <div className="hpanel__shade" />
                <div className="hpanel__edge" />
                {selected && <span className="hpanel__check"><Check size={14} strokeWidth={3} /></span>}

                {/* collapsed label */}
                <div className="hpanel__mini">
                  <span className="hpanel__dot" />
                  <span className="hpanel__mininame">{h.name}</span>
                </div>

                {/* expanded content */}
                <div className="hpanel__body">
                  <div className="hpanel__meta">
                    <span className="hpanel__time">{h.time}</span>
                    <span className="hpanel__pressure" title="Adaptation pressure"><Gauge size={13} /> Pressure <span className="hpanel__dots">{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= h.pressure ? "on" : ""} />)}</span></span>
                  </div>
                  <h2 className="display hpanel__name">{h.name}</h2>
                  <p className="hpanel__tag">{h.tagline}</p>
                  <p className="hpanel__desc">{h.description}</p>
                  <div className="hpanel__facts">
                    <span><Thermometer size={14} />{h.climate}</span>
                    <span><AlertTriangle size={14} />{h.challenges[0]}</span>
                  </div>
                  <div className="hpanel__chips">{h.conditions.map((c) => <span key={c}>{c}</span>)}</div>
                  <div className="hpanel__cta">
                    <Button iconRight={ArrowRight} onClick={(e) => { e.stopPropagation(); setHabitat(h.id); navigate("/species"); }}>Go here</Button>
                    {selected ? <span className="hpanel__selectedtag">Selected</span> : <span className="hpanel__selectedtag hpanel__selectedtag--muted">{touch ? "Tap to select" : "Click anywhere to select"}</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <footer className="page__footer page__footer--center">
          <span className="page__hint">{touch ? "Tap a habitat to open it, then tap Go here" : "Hover a habitat to look around, then Go here"}</span>
        </footer>
      </div>
    </PageTransition>
  );
}
