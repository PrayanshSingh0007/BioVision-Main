import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Check, MapPin } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import StatBar from "../../components/ui/StatBar";
import PageTransition from "../../components/ui/PageTransition";
import HabitatScene, { softPlateSources } from "../../components/visual/HabitatScene";
import animals from "../../data/animals";
import habitats, { habitatById } from "../../data/habitats";
import { STAT_META } from "../../data/traits";
import { fitLabel } from "../../utils/scoring";
import { useMission } from "../../state/MissionContext";
import { useIsTouch } from "../../utils/useIsTouch";
import "./Species.css";

/** SpeciesArchive — a digital natural-history archive: spotlight preview + species rail grouped by habitat. */
export default function Species() {
  const navigate = useNavigate();
  const { habitat, animal, setAnimal } = useMission();
  const [hover, setHover] = useState(null);
  // Default to the chosen habitat's native species; other habitats stay one tap away.
  const [filter, setFilter] = useState(() => habitat?.id ?? "all");
  const touch = useIsTouch();

  // The Lab draws this habitat's shallow-focus plate behind the animal. Fetch and decode it now,
  // while the student is still browsing, so the Lab paints on the first frame instead of stalling
  // on a 2K decode. (Same srcset/sizes the Lab uses, so the browser reuses the cached candidate.)
  useEffect(() => {
    const soft = softPlateSources(habitat?.id);
    if (!soft) return;
    const img = new Image(); img.sizes = "(max-width: 1000px) 100vw, calc(100vw - 720px)"; img.srcset = soft.srcSet; img.src = soft.src; img.decode?.().catch(() => {});
  }, [habitat?.id]);
  if (!habitat) return <Navigate to="/habitat" replace />;

  const preview = hover ? animals.find((a) => a.id === hover) : animal || animals.find((a) => a.naturalHabitat === habitat.id) || animals[0];
  const fit = fitLabel(preview.habitatFit[habitat.id] ?? 0);
  const order = [habitat, ...habitats.filter((h) => h.id !== habitat.id)];
  const groups = order
    .filter((h) => filter === "all" || filter === h.id)
    .map((h) => ({ habitat: h, animals: animals.filter((a) => a.naturalHabitat === h.id) }))
    .filter((g) => g.animals.length > 0);
  const isSelected = animal?.id === preview.id;

  return (
    <PageTransition className="page page--bar species">
      <div className="species__inner">
        <header className="species__head rise">
          <div>
            <p className="eyebrow">Two · Base animal</p>
            <h1 className="display species__title">Start with a real animal</h1>
          </div>
          <p className="species__sub text-balance">It keeps its body and its instincts. In the lab, you’ll lend it three abilities borrowed from <em>other</em> animals.</p>
        </header>

        <div className="species__body">
          {/* ---- spotlight preview ---- */}
          <section className="species__preview rise" style={{ "--accent": habitat.accent, "--d": "0.1s" }}>
            <div className="species__scene"><HabitatScene habitat={habitat} animated /></div>
            <div className="species__scenefade" />
            <div className="species__stage">
              <div className="species__spot" />
              <div className="species__pedestal" />
              <img key={preview.id} src={preview.image} alt={preview.name} className="species__img" draggable="false" />
            </div>
            <div className="species__info">
              <div className="species__infomain" key={`i-${preview.id}`}>
                <div className="species__meta">
                  <Badge tone={fit.tone === "good" ? "good" : fit.tone === "ok" ? "ok" : fit.tone === "neutral" ? "neutral" : fit.tone === "warn" ? "warn" : "bad"}>{fit.label} for {habitat.name}</Badge>
                  <span className="species__nat"><MapPin size={13} /> Native: {habitatById[preview.naturalHabitat]?.name}</span>
                </div>
                <h2 className="display species__name">{preview.name}</h2>
                <p className="species__sci">{preview.scientificName}</p>
                <p className="species__desc">{preview.description}</p>
                <p className="seclabel species__lbl">What it already has</p>
                <div className="species__traits">{preview.traits.map((t) => <span key={t}>{t}</span>)}</div>
                <div className="species__select">
                  <Button variant={isSelected ? "secondary" : "primary"} icon={isSelected ? Check : undefined} onClick={() => setAnimal(preview.id)}>{isSelected ? "Chosen" : "Choose this animal"}</Button>
                </div>
              </div>
              <div className="species__stats">
                <p className="seclabel">Starting stats</p>
                {STAT_META.slice(0, 5).map((m, i) => <StatBar key={m.key} label={m.label} value={preview.stats[m.key]} hint={m.hint} delay={i * 0.05} compact />)}
                <p className="species__statnote">Educational model · estimates</p>
              </div>
            </div>
          </section>

          {/* ---- species rail ---- */}
          <div className="species__browser rise" style={{ "--d": "0.2s" }}>
            <div className="species__filters">
              <button type="button" className={`species__filter ${filter === habitat.id ? "species__filter--on" : ""}`} style={{ "--accent": habitat.accent }} onClick={() => setFilter(habitat.id)}>
                <i />{habitat.name} · your pick
              </button>
              <button type="button" className={`species__filter ${filter === "all" ? "species__filter--on" : ""}`} onClick={() => setFilter("all")}>All habitats · {animals.length}</button>
              {order.filter((h) => h.id !== habitat.id).map((h) => (
                <button key={h.id} type="button" className={`species__filter ${filter === h.id ? "species__filter--on" : ""}`} style={{ "--accent": h.accent }} onClick={() => setFilter(h.id)}>
                  <i />{h.name}
                </button>
              ))}
            </div>
            <div className="species__groups" onMouseLeave={touch ? undefined : () => setHover(null)}>
              {groups.map((g) => (
                <section key={g.habitat.id} className="species__group" style={{ "--accent": g.habitat.accent }}>
                  <header className="species__grouphead">
                    <span className="species__groupdot" />
                    <h2>{g.habitat.name}</h2>
                    <span className="species__groupcount">{g.animals.length} species</span>
                    {g.habitat.id === habitat.id && <Badge tone="accent">Lives here naturally</Badge>}
                  </header>
                  <ul className="species__grid">
                    {g.animals.map((a) => {
                      const selected = animal?.id === a.id;
                      const f = fitLabel(a.habitatFit[habitat.id] ?? 0);
                      return (
                        <li key={a.id}>
                          <button type="button" className={`acard ${selected ? "acard--selected" : ""} ${hover === a.id ? "acard--hover" : ""}`}
                            onMouseEnter={touch ? undefined : () => setHover(a.id)} onFocus={() => setHover(a.id)} onClick={() => { setHover(a.id); setAnimal(a.id); }} aria-pressed={selected}>
                            <div className="acard__img"><img src={a.thumb} alt="" loading="lazy" draggable="false" /></div>
                            <div className="acard__body">
                              <strong>{a.name}</strong>
                              <em>{a.scientificName}</em>
                              <span className={`acard__fit acard__fit--${f.tone}`}>{f.label}</span>
                            </div>
                            <span className="acard__check"><Check size={13} strokeWidth={3} /></span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>

        <footer className="page__footer">
          <span className="page__hint">{animal ? <>Base species: <strong>{animal.name}</strong></> : touch ? "Tap a species to preview and select it" : "Hover to preview, click to choose"}</span>
          <Button iconRight={ArrowRight} disabled={!animal} onClick={() => navigate("/lab")}>Into the lab</Button>
        </footer>
      </div>
    </PageTransition>
  );
}
