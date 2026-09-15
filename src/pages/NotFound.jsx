import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import PageTransition from "../components/ui/PageTransition";
import Button from "../components/ui/Button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <PageTransition className="page" style={{ alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18 }}>
      <Compass size={42} color="var(--cyan)" />
      <h1 className="display" style={{ fontSize: 40 }}>Off the map</h1>
      <p className="muted" style={{ maxWidth: 420 }}>This route doesn't exist in the BioVision expedition. Let's head back to base camp.</p>
      <Button onClick={() => navigate("/")}>Return to BioVision</Button>
    </PageTransition>
  );
}
