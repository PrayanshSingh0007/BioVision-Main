import { useNavigate } from "react-router-dom";
import { ArrowRight, Dna, FlaskConical, Globe2, Lightbulb, PawPrint } from "lucide-react";
import Button from "../../components/ui/Button";
import PageTransition from "../../components/ui/PageTransition";
import plate from "../../assets/environments/jungle.webp";
import "./Mission.css";

const STEPS = [
  { n: "01", icon: Globe2, title: "Choose a habitat", text: "Every environment applies different survival pressures." },
  { n: "02", icon: PawPrint, title: "Select a base species", text: "Its body plan and instincts form the foundation." },
  { n: "03", icon: Dna, title: "Combine adaptations", text: "Inherit three traits from other animals." },
  { n: "04", icon: FlaskConical, title: "Analyse the species", text: "Read its survival estimate, benefits and trade-offs." },
];

export default function Mission() {
  const navigate = useNavigate();
  return (
    <PageTransition className="page mission">
      <div className="mission__bg" aria-hidden="true">
        <img src={plate} alt="" className="mission__plate" draggable="false" />
        <div className="mission__bgfade" />
        <div className="mission__fog" />
      </div>
      <div className="mission__inner">
        <div className="mission__card panel rise" style={{ "--d": "0.05s" }}>
          <div className="mission__head">
            <p className="eyebrow">Expedition briefing · Mission 01</p>
            <span className="mission__id mono">BV-01 / GRADE 8</span>
          </div>
          <h1 className="display mission__title rise" style={{ "--d": "0.15s" }}>Your Mission</h1>
          <p className="mission__lead text-balance rise" style={{ "--d": "0.22s" }}>
            Engineer a hypothetical species that can survive in a selected habitat by combining adaptations from different animals.
          </p>

          <ol className="mission__steps">
            {STEPS.map((s, i) => (
              <li key={s.n} className="mission__step rise" style={{ "--d": `${0.3 + i * 0.1}s` }}>
                <div className="mission__node"><s.icon size={20} /></div>
                <span className="mission__num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
            <div className="mission__line" aria-hidden="true" />
          </ol>

          <div className="mission__notes rise" style={{ "--d": "0.75s" }}>
            <div className="mission__note"><Lightbulb size={17} /><p>Adaptations help organisms survive in specific environments — but every trait has benefits <em>and</em> trade-offs.</p></div>
            <div className="mission__note mission__note--muted"><p>BioVision is an educational simulation, not real genetic engineering. Its scores are illustrative estimates.</p></div>
          </div>

          <div className="mission__actions rise" style={{ "--d": "0.85s" }}>
            <Button size="lg" iconRight={ArrowRight} onClick={() => navigate("/habitat")}>Start Mission</Button>
            <span className="page__hint">Step 1 of 4 · Choose a habitat</span>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
