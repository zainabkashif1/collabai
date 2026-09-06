import { motion, type HTMLMotionProps } from "motion/react";
import { type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-signal text-white shadow-md shadow-signal/20 hover:bg-signal/90",
  secondary: "bg-white text-ink border border-line shadow-sm hover:border-signal/30 hover:bg-signal-soft/40",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

/**
 * Base button used everywhere in the app. The scale-on-tap animation is
 * deliberately subtle (0.97, not 0.9) — it should read as "responsive",
 * not bouncy. Respects prefers-reduced-motion automatically because
 * Motion checks it internally for whileTap/whileHover.
 */
export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-sm transition-all disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
