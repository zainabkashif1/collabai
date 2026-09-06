import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Every page component wraps its returned JSX in this. Paired with
 * <AnimatePresence> in App.tsx, it gives a consistent fade + slight
 * rise on route enter, and the reverse on exit — one place to change
 * the page-transition feel for the whole app.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
