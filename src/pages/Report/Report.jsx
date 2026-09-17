import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BadgeCheck, Dna, FlaskConical, Globe2, Info, RotateCcw, Scale, Sparkles, Zap } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import StatBar from "../../components/ui/StatBar";
import PageTransition from "../../components/ui/PageTransition";
import SpeciesComposition from "../../components/visual/SpeciesComposition";
import { animalById } from "../../data/animals";
import { traitById, STAT_META } from "../../data/traits";
import { useMission } from "../../state/MissionContext";
import "./Report.css";

const rise = (d = 0) => ({ style: { "--d": `${(0.4 + d).toFixed(2)}s` } });

/** Final Species Report — the cinematic reveal of a newly documented (fictional) organism. */
export default function Report() {
  const navigate = useNavigate();
  const { habitat, animal, species, isComplete, generate, reset } = useMission();

  useEffect(() => { if (!species && habitat && animal && isComplete) generate(); }, [species, habitat, animal, isComplete, generate]);

  if (!habitat) return <Navigate to="/habitat" replace />;
  if (!animal) return <Navigate to="/species" replace />;
  if (!isComplete) return <Navigate to="/lab" replace />;
  if (!species) return null;

  const traits = species.traitIds.map((id) => traitById[id]);
  const survivalTone = species.survivalBand.tone;
  const runAnother = () => { navigate("/mission"); reset(); };

  return (
    <PageTransition className="page page--bar report" style={{ "--accent": habitat.accent }}>
      <div className="report__inner">
        <header className="report__head rise">
          <div>
            <p className="eyebrow">Expedition log · Final species report</p>
            <h1 className="display report__title">{species.name}</h1>
            <p className="report__sci"><em>{species.scientificName}</em><span>· fictional educational name · "{species.epithet}" = {species.epithetMeaning}</span></p>
          </div>
          <div className="report__headright">
            <Badge tone="good" icon={BadgeCheck}>Species documented</Badge>
            <div className="report__headactions">
              <Button variant="secondary" icon={RotateCcw} onClick={runAnother}>Run Another Experiment</Button>
            </div>
          </div>
        </header>

        {/* ---- cinematic reveal ---- */}
        <section className="report__hero">
          <div className="report__visual rise" {...rise(0)}>
            <SpeciesComposition animal={animal} habitat={habitat} traitIds={species.traitIds} reveal labels="full" animated />
            <div className="report__visualtag"><Sparkles size={14} /> Engineered adaptations · {habitat.name} environment</div>
            <div className="report__legend"><span><i className="report__legend-base" /> Base animal: {animal.name}</span><span><i className="report__legend-trait" /> Inherited trait</span></div>
          </div>

          <aside className="report__side panel rise" {...rise(0.15)}>
            <div className="report__survival">
              <div className="report__survivalhead"><span className="seclabel">Survival estimate</span><Badge tone="accent" icon={Info}>Simulation</Badge></div>
              <div className="report__survivalval"><strong>{species.survival}%</strong><em className={`tone-${survivalTone}`}>{species.survivalBand.label}</em></div>
              <div className="report__survivalbar"><div style={{ width: `${species.survival}%` }} /></div>
            </div>
            <dl className="report__facts">
              <div><dt><Dna size={14} /> Base animal</dt><dd>{animal.name} <span>({animal.scientificName})</span></dd></div>
              <div><dt><Globe2 size={14} /> Habitat</dt><dd>{habitat.name} <span>· {habitat.climate}</span></dd></div>
              <div><dt><Scale size={14} /> Adaptation score</dt><dd>{species.stats.adaptation} / 100 <span>· base fit {species.breakdown.baseFitLabel.label.toLowerCase()}, traits {species.breakdown.traitFitTotal >= 0 ? "+" : ""}{species.breakdown.traitFitTotal}</span></dd></div>
              <div><dt><Zap size={14} /> Energy cost</dt><dd>{species.energyCost >= 6 ? "High" : species.energyCost >= 4 ? "Moderate" : "Low"} <span>· {species.energyCost} of 9 points</span></dd></div>
            </dl>
            <div className="report__stats">
              <p className="seclabel">Trait profile</p>
              {STAT_META.map((m, i) => <StatBar key={m.key} label={m.label} value={species.stats[m.key]} delta={m.key === "adaptation" ? 0 : species.stats[m.key] - animal.stats[m.key]} hint={m.hint} delay={0.8 + i * 0.08} compact />)}
            </div>
          </aside>
        </section>

        {/* ---- inherited traits ---- */}
        <section className="report__section">
          <div className="report__sechead rise" {...rise(0.2)}>
            <p className="eyebrow">Inherited adaptations</p>
            <h2 className="display">Three inherited adaptations</h2>
          </div>
          <div className="report__traits">
            {traits.map((t, i) => {
              const src = animalById[t.source];
              const fit = species.breakdown.traitFits.find((f) => f.id === t.id);
              return (
                <article key={t.id} className="tr panel rise" {...rise(0.25 + i * 0.1)}>
                  <div className="tr__top">
                    <div className="tr__src"><img src={src.image} alt="" draggable="false" /></div>
                    <div><span className="tr__slot">Adaptation 0{i + 1} · {t.category}</span><h3>{t.name}</h3><p className="tr__meta">Source: {src.name}</p></div>
                    <span className={`tr__fit tone-${fit?.tone}`}>{fit?.label}</span>
                  </div>
                  <p className="tr__why"><strong>Benefit:</strong> {t.why}</p>
                  <p className="tr__trade"><strong>Trade-off:</strong> {t.tradeoff}</p>
                  {t.habitatNotes?.[habitat.id] && <p className="tr__note"><strong>In the {habitat.name}:</strong> {t.habitatNotes[habitat.id]}</p>}
                  <div className="tr__stats">{Object.entries(t.stats).map(([k, v]) => <span key={k} className={v > 0 ? "up" : "down"}>{STAT_META.find((m) => m.key === k)?.label} {v > 0 ? "+" : ""}{v}</span>)}</div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ---- analysis ---- */}
        <section className="report__section report__analysis">
          <div className="report__col panel rise" {...rise(0.3)}>
            <div className="report__colhead"><FlaskConical size={18} /><h2>Scientific analysis</h2></div>
            <p>{species.analysis.intro}</p>
            <ul className="report__list">{species.analysis.traitLines.map((l, i) => <li key={i}>{l}</li>)}</ul>
            <p className="report__synth">{species.analysis.synthesis}</p>
            <p>{species.analysis.energy}</p>
          </div>
          <div className="report__col panel rise" {...rise(0.4)}>
            <div className="report__colhead"><Scale size={18} /><h2>Trade-offs & method</h2></div>
            <p className="muted">Every adaptation has a cost. A real organism must balance advantages against these disadvantages.</p>
            <ul className="report__tradeoffs">{traits.map((t, i) => <li key={t.id}><strong>{t.name}:</strong> {species.analysis.tradeoffs[i]}</li>)}</ul>
            <div className="report__scoring">
              <p className="seclabel">How the estimate was calculated</p>
              <ol>
                <li>Environmental adaptation = 50 + base animal fit ({species.breakdown.baseFit > 0 ? "+" : ""}{species.breakdown.baseFit} × 10) + trait fit ({species.breakdown.traitFitTotal > 0 ? "+" : ""}{species.breakdown.traitFitTotal} × 7) = <strong>{species.stats.adaptation}</strong></li>
                <li>Average of the five core stats = <strong>{species.breakdown.coreAvg}</strong></li>
                <li>Survival = 55 % adaptation + 45 % core average, rounded to the nearest 5 = <strong>{species.survival}%</strong></li>
              </ol>
            </div>
          </div>
        </section>

        <footer className="report__foot rise" {...rise(0.5)}>
          <p className="report__disclaimer"><Info size={14} /> BioVision is an educational simulation. Its trait combinations and survival scores are illustrative, not real genetic predictions.</p>
          <div className="report__footactions">
            <Button icon={RotateCcw} onClick={runAnother}>Run Another Experiment</Button>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
