import { cloneElement } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import AmbientBackground from "../visual/AmbientBackground";
import TopBar from "./TopBar";
import { useDisplayScale } from "../../utils/useDisplayScale";
import "./AppShell.css";

const WITH_BAR = ["/habitat", "/species", "/lab", "/report"];

/**
 * App frame. Pages are keyed by pathname so each one plays its entrance
 * transition on navigation. Exit animations are deliberately avoided: a stalled
 * exit (e.g. a backgrounded tab) must never block the next screen during a demo.
 */
export default function AppShell() {
  const location = useLocation();
  const outlet = useOutlet();
  useDisplayScale();
  const showBar = WITH_BAR.some((p) => location.pathname.startsWith(p));
  return (
    <div className="shell">
      <AmbientBackground intensity={showBar ? 0.6 : 1} />
      {showBar && <TopBar />}
      <main className={`shell__main ${showBar ? "shell__main--bar" : ""}`}>
        {outlet && cloneElement(outlet, { key: location.pathname })}
      </main>
    </div>
  );
}
