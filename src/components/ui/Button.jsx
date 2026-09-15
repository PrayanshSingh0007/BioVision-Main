import { motion } from "framer-motion";
import "./Button.css";

/**
 * variant: "primary" | "secondary" | "ghost"
 * size: "md" | "lg"
 */
export default function Button({ children, variant = "primary", size = "md", icon: Icon, iconRight: IconRight, className = "", disabled, ...rest }) {
  return (
    <motion.button
      type="button"
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...rest}
    >
      {Icon && <Icon size={size === "lg" ? 20 : 17} strokeWidth={2.2} />}
      <span>{children}</span>
      {IconRight && <IconRight size={size === "lg" ? 20 : 17} strokeWidth={2.2} className="btn__icon-right" />}
    </motion.button>
  );
}
