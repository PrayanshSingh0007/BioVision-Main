import { motion } from "framer-motion";
import "./StatBar.css";

/**
 * Animated stat bar. `delta` (optional) shows the change against a baseline.
 */
export default function StatBar({ label, value, delta, hint, delay = 0, compact = false }) {
  const tone = delta > 0 ? "up" : delta < 0 ? "down" : "";
  return (
    <div className={`stat ${compact ? "stat--compact" : ""}`} title={hint}>
      <div className="stat__head">
        <span className="stat__label">{label}</span>
        <span className="stat__value mono">
          {value}
          {delta ? <span className={`stat__delta stat__delta--${tone}`}>{delta > 0 ? "+" : ""}{delta}</span> : null}
        </span>
      </div>
      <div className="stat__track">
        <motion.div
          className={`stat__fill ${tone ? `stat__fill--${tone}` : ""}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
