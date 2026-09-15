import { useEffect } from "react";
import "./PageTransition.css";

/**
 * Page entrance — a soft fade/rise driven purely by CSS, so a screen can never remain
 * invisible if JavaScript-driven animation stalls (e.g. a backgrounded tab during a demo).
 */
export default function PageTransition({ children, className = "", style }) {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, []);
  return (
    <div className={`pagein ${className}`} style={style}>
      {children}
    </div>
  );
}
