import "./Badge.css";

/** tone: "neutral" | "accent" | "good" | "ok" | "warn" | "bad" */
export default function Badge({ children, tone = "neutral", icon: Icon, className = "", style }) {
  return (
    <span className={`badge badge--${tone} ${className}`} style={style}>
      {Icon && <Icon size={13} strokeWidth={2.4} />}
      {children}
    </span>
  );
}
