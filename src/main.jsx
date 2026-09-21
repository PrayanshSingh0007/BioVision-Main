import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { MissionProvider } from "./state/MissionContext.jsx";
import "./index.css";

// `?still=1` (or `#/route?still=1`) freezes decorative animation — handy for screenshots.
try {
  const q = (window.location.hash.split("?")[1] || "") + "&" + window.location.search.slice(1);
  if (new URLSearchParams(q).get("still") === "1") document.documentElement.dataset.still = "1";
} catch { /* ignore */ }
// Projector mode is on by default: classroom smartboards and projectors wash out dark UIs, so the
// whole app runs a touch brighter unless the sun toggle in the top bar turns it off.
document.documentElement.dataset.bright = "1";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <MissionProvider>
        <App />
      </MissionProvider>
    </HashRouter>
  </StrictMode>
);
