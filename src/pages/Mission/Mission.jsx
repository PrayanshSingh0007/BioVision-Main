import { useNavigate } from "react-router-dom";
import { ArrowRight, Dna, FlaskConical, Globe2, Lightbulb, PawPrint } from "lucide-react";
import Button from "../../components/ui/Button";
import PageTransition from "../../components/ui/PageTransition";
import plate from "../../assets/environments/jungle.webp";
import plate4k from "../../assets/environments/jungle-4k.webp";
import "./Mission.css";

const STEPS = [
  { n: "01", icon: Globe2, title: "Choose a habitat", text: "Every place pushes back in its own way." },
  { n: "02", icon: PawPrint, title: "Choose an animal", text: "Its body and instincts are your starting point." },
  { n: "03", icon: Dna, title: "Borrow three abilities", text: "Each one taken from a different animal." },
  { n: "04", icon: FlaskConical, title: "Read the report", text: "Would it survive? See the score and the trade-offs." },
];

export default function Mission() {
  const navigate = useNavigate();
  return (
    <PageTransition className="page mission">
      <div className="mission__bg" aria-hidden="true">
        <img src={plate} srcSet={`${plate} 2560w, ${plate4k} 3000w`} sizes="100vw" alt="" className="mission__plate" decoding="async" draggable="false" />
        <div className="mission__bgfade" />
        <div className="mission__fog" />
      </div>
      <div className="mission__inner">
        <div className="mission__card panel rise" style={{ "--d": "0.05s" }}>
          <div className="mission__head">
            <p className="eyebrow">Before you set out</p>
            <span className="mission__id">Grade 8 · Biology</span>
          </div>
          <h1 className="display mission__title rise" style={{ "--d": "0.15s" }}>Your task</h1>
          <p className="mission__lead text-balance rise" style={{ "--d": "0.22s" }}>
            Pick a habitat. Pick a real animal. Give it three abilities borrowed from other animals — then find out whether it would survive.
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
            <div className="mission__note"><Lightbulb size={17} /><p>Every adaptation helps somewhere and costs something. The trick is choosing three that suit the place.</p></div>
            <div className="mission__note mission__note--muted"><p>BioVision is an educational simulation, not real genetic engineering. Its scores are illustrative estimates.</p></div>
          </div>

          <div className="mission__actions rise" style={{ "--d": "0.85s" }}>
            <Button size="lg" iconRight={ArrowRight} onClick={() => navigate("/habitat")}>Start</Button>
            <span className="page__hint">First, choose a habitat</span>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
