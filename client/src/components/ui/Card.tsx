import { motion, type HTMLMotionProps } from "motion/react";
import { type ReactNode } from "react";

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-xl border border-line/80 bg-white/90 p-6 shadow-sm shadow-ink/5 backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
