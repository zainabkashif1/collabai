import { motion } from "motion/react";
import { AlertCircleIcon } from "./Icon";

export function AlertBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-start gap-2.5 rounded-lg bg-ember-soft px-3.5 py-2.5 text-sm text-ember"
    >
      <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </motion.div>
  );
}
