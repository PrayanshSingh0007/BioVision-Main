import { useCallback, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, BatteryCharging, Check, Dna, Eye, Feather, Flame, Hand, Info, Leaf, Plus, Search, Shield, Sparkles, Utensils, Wind, X, Zap } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import StatBar from "../../components/ui/StatBar";
import PageTransition from "../../components/ui/PageTransition";
import SpeciesComposition from "../../components/visual/SpeciesComposition";
import GenerationSequence from "../../components/visual/GenerationSequence";
import traits, { STAT_META } from "../../data/traits";
import { animalById } from "../../data/animals";
import { scoreSpecies, fitLabel } from "../../utils/scoring";
import { useMission, MAX_TRAITS } from "../../state/MissionContext";
import { useIsTouch } from "../../utils/useIsTouch";
import "./Lab.css";

const CATEGORY_ICON = { Locomotion: Wind, Defense: Shield, Sensory: Eye, Feeding: Utensils, "Defense & Display": Shield, Insulation: Flame, "Balance & Insulation": Feather, Environment: Leaf, Energy: BatteryCharging };
const CATEGORIES = ["All", "Locomotion", "Sensory", "Feeding", "Defense", "Insulation", "Energy", "Environment"];

/** The Genetic Lab — adaptation library · live species stage · three experiment slots. */
export default function Lab() {
  const navigate = useNavigate();
  const { habitat, animal, traitIds, toggleTrait, clearTraits, generate } = useMission();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [nudge, setNudge] = useState(false);
  const [detail, setDetail] = useState(null);
  // `?synth=1` in the URL previews the synthesis sequence (used for design checks).
  const touch = useIsTouch();
  const [synth, setSynth] = useState(() => { try { return new URLSearchParams((window.location.hash.split("?")[1] || "")).get("synth") === "1"; } catch { return false; } });

  const selected = useMemo(() => traitIds.map((id) => traits.find((t) => t.id === id)).filter(Boolean), [traitIds]);
  const baseScore = useMemo(() => (animal && habitat ? scoreSpecies(animal, habitat, []) : null), [animal, habitat]);
  const liveScore = useMemo(() => (animal && habitat ? scoreSpecies(animal, habitat, selected) : null), [animal, habitat, selected]);
  const finish = useCallback(() => { generate(); navigate("/report"); }, [generate, navigate]);

  if (!habitat) return <Navigate to="/habitat" replace />;
  if (!animal) return <Navigate to="/species" replace />;

  const donorTraits = traits.filter((t) => t.source !== animal.id);
  const q = query.trim().toLowerCase();
  const visible = donorTraits.filter((t) => (filter === "All" || t.category.includes(filter)) && (!q || `${t.name} ${animalById[t.source].name} ${t.category}`.toLowerCase().includes(q)));
  const full = traitIds.length >= MAX_TRAITS;

  const onPick = (t) => {
    if (!traitIds.includes(t.id) && full) { setNudge(true); setTimeout(() => setNudge(false), 600); return; }
    toggleTrait(t.id);
  };

  return (
    <PageTransition className="page page--bar lab">
      {synth && <GenerationSequence animal={animal} habitat={habitat} traits={selected} onDone={finish} />}
      <div className="lab__inner">
        <header className="lab__head rise">
          <div>
            <p className="eyebrow">Stage 03 · Genetic engineering lab</p>
            <h1 className="display lab__title">Combine three adaptations</h1>
          </div>
          <div className="lab__progress">
            <div className={`lab__pips ${nudge ? "lab__pips--nudge" : ""}`}>
              {Array.from({ length: MAX_TRAITS }, (_, i) => <span key={i} className={`lab__pip ${selected[i] ? "lab__pip--on" : ""}`} />)}
            </div>
            <span className="lab__count">{traitIds.length}/{MAX_TRAITS} <em>adaptations selected</em></span>
          </div>
        </header>

        <div className="lab__body">
          {/* ---- adaptation library ---- */}
          <section className="lab__col lab__library panel rise" style={{ "--d": "0.1s" }}>
            <div className="lab__colhead">
              <p className="seclabel">Adaptation library</p>
              <span className="muted">Donor traits from {donorTraits.length} sources</span>
            </div>
            <label className="lab__search"><Search size={14} /><input type="search" placeholder="Search adaptations…" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
            <div className="lab__filters">
              {CATEGORIES.map((c) => <button key={c} type="button" className={`lab__filter ${filter === c ? "lab__filter--on" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}
            </div>
            <ul className="lab__list">
              {visible.map((t) => {
                const on = traitIds.includes(t.id);
                const src = animalById[t.source];
                const fit = fitLabel(t.habitatFit[habitat.id] ?? 0);
                const Icon = CATEGORY_ICON[t.category] || Sparkles;
                return (
                  <li key={t.id}>
                    <button type="button" className={`tcard ${on ? "tcard--on" : ""} ${full && !on ? "tcard--locked" : ""}`} onClick={() => onPick(t)} aria-pressed={on} aria-disabled={full && !on}
                      onMouseEnter={touch ? undefined : () => setDetail(t.id)} onMouseLeave={touch ? undefined : () => setDetail(null)}>
                      <div className="tcard__src"><img src={src.image} alt="" draggable="false" /></div>
                      <div className="tcard__body">
                        <div className="tcard__row"><strong>{t.name}</strong><span className={`tcard__fit tcard__fit--${fit.tone}`}>{fit.label}</span></div>
                        <span className="tcard__meta"><Icon size={12} /> {t.category} · {src.name}</span>
                        <p className={detail === t.id || on ? "tcard__desc tcard__desc--open" : "tcard__desc"}>{t.description}</p>
                      </div>
                      <span className="tcard__check">{on ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={2.5} />}</span>
                    </button>
                  </li>
                );
              })}
              {visible.length === 0 && <li className="lab__empty">No adaptations match "{query}".</li>}
            </ul>
          </section>

          {/* ---- species stage ---- */}
          <section className="lab__col lab__center rise" style={{ "--d": "0.15s" }}>
            <div className="lab__stage" style={{ "--accent": habitat.accent }}>
              <SpeciesComposition animal={animal} habitat={habitat} traitIds={traitIds} labels="compact" animated />
              <div className="lab__holo" aria-hidden="true"><span /><span /></div>
              <div className="lab__scanline" aria-hidden="true" />
              <div className="lab__ticks lab__ticks--l" aria-hidden="true" /><div className="lab__ticks lab__ticks--r" aria-hidden="true" />
              <div className="lab__stagetag"><span className="lab__live" />Live specimen · {animal.name} · {habitat.name}</div>
              <div className="lab__stageid mono">SPEC-{animal.id.toUpperCase().slice(0, 3)} / {habitat.id.toUpperCase().slice(0, 3)}</div>
            </div>
            <div className="lab__stats panel">
              <div className="lab__colhead lab__colhead--row">
                <p className="seclabel">Simulation estimate</p>
                <Badge tone="accent" icon={Info}>Educational model</Badge>
              </div>
              <div className="lab__statgrid">
                {STAT_META.map((m, i) => <StatBar key={m.key} label={m.label} value={liveScore.stats[m.key]} delta={liveScore.stats[m.key] - baseScore.stats[m.key]} hint={m.hint} delay={i * 0.04} compact />)}
              </div>
            </div>
          </section>

          {/* ---- experiment slots ---- */}
          <section className="lab__col lab__summary panel rise" style={{ "--d": "0.2s" }}>
            <div className="lab__colhead">
              <p className="seclabel">Experiment slots</p>
              <span className="muted">Base: {animal.name} · Habitat: {habitat.name}</span>
            </div>
            <div className="lab__slots">
              {Array.from({ length: MAX_TRAITS }, (_, i) => {
                const t = selected[i];
                if (!t) return (
                  <div key={i} className="slot slot--empty"><span className="slot__n">Adaptation slot 0{i + 1}</span><p>Select an adaptation from the library</p></div>
                );
                const fit = fitLabel(t.habitatFit[habitat.id] ?? 0);
                return (
                  <div key={t.id} className="slot slot--filled">
                    <span className="slot__n">Adaptation slot 0{i + 1}</span>
                    <div className="slot__row">
                      <img src={animalById[t.source].image} alt="" draggable="false" />
                      <div>
                        <strong>{t.name}</strong>
                        <span>Source: {animalById[t.source].name} · {t.category}</span>
                      </div>
                      <button type="button" className="slot__remove" onClick={() => toggleTrait(t.id)} aria-label={`Remove ${t.name}`}><X size={14} /></button>
                    </div>
                    <p className="slot__benefit"><b>Benefit:</b> {t.why}</p>
                    <em className={`slot__fit tone-${fit.tone}`}>{fit.label} in the {habitat.name}</em>
                  </div>
                );
              })}
            </div>

            <div className="lab__compat">
              <div className="lab__compatrow"><span>Habitat relevance</span><strong className={`tone-${liveScore.breakdown.traitFitTotal >= 3 ? "good" : liveScore.breakdown.traitFitTotal >= 1 ? "ok" : liveScore.breakdown.traitFitTotal >= 0 ? "neutral" : "warn"}`}>{liveScore.breakdown.traitFitTotal > 0 ? "+" : ""}{liveScore.breakdown.traitFitTotal} fit points</strong></div>
              <div className="lab__compatrow"><span>Base species fit</span><strong className={`tone-${liveScore.breakdown.baseFitLabel.tone}`}>{liveScore.breakdown.baseFitLabel.label}</strong></div>
              <div className="lab__compatrow"><span>Energy cost</span><strong className={`tone-${liveScore.energyCost >= 6 ? "warn" : liveScore.energyCost >= 4 ? "neutral" : "good"}`}><Zap size={13} /> {liveScore.energyCost === 0 ? "—" : liveScore.energyCost >= 6 ? "High" : liveScore.energyCost >= 4 ? "Moderate" : "Low"}</strong></div>
              <div className="lab__survival"><span>Survival estimate</span><div><strong>{liveScore.survival}%</strong><em className={`tone-${liveScore.survivalBand.tone}`}>{liveScore.survivalBand.label}</em></div></div>
            </div>
            <div className="lab__note"><Hand size={15} /><p>Traits that suit the habitat raise the estimate. Traits that fight the environment lower it, even though they are useful elsewhere.</p></div>
            <div className="lab__actions">
              <Button variant="ghost" onClick={clearTraits} disabled={traitIds.length === 0}>Clear</Button>
              <Button icon={Dna} disabled={!full} onClick={() => setSynth(true)}>Generate Species</Button>
            </div>
          </section>
        </div>

        <footer className="lab__foot">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate("/species")}>Back to Species Archive</Button>
          <span className="page__hint">{full ? "All three slots filled — generate your species." : `Fill ${MAX_TRAITS - traitIds.length} more slot${MAX_TRAITS - traitIds.length === 1 ? "" : "s"} to continue.`}</span>
        </footer>
      </div>
    </PageTransition>
  );
}
