import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

interface StatCardProps {
  label: string;
  value: number;
  delay?: number;
  icon?: ReactNode;
  /** When set, the whole card becomes a link — used for stats that point at an actionable page. */
  href?: string;
  hint?: string;
}

export function StatCard({ label, value, delay = 0, icon, href, hint }: StatCardProps) {
  const featured = delay === 0;
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="font-display text-3xl font-semibold leading-none">{value}</p>
        {icon && (
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
              featured ? "bg-white/20 text-white" : "bg-signal-soft text-signal"
            }`}
          >
            {icon}
          </span>
        )}
      </div>
      <p className={`text-xs mt-2 ${featured ? "text-white/85" : "text-ink/50"}`}>{label}</p>
      {hint && (
        <p className={`text-[11px] mt-2.5 font-medium ${featured ? "text-white/70" : "text-signal"}`}>
          {hint}
        </p>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, borderColor: "rgba(23, 105, 224, 0.35)" }}
      transition={{ delay, duration: 0.25 }}
      className={`stat-card group rounded-2xl border border-line p-5 transition-shadow hover:shadow-md hover:shadow-signal/5 ${
        featured ? "stat-card-featured" : ""
      }`}
    >
      {href ? (
        <Link to={href} className="block">
          {body}
        </Link>
      ) : (
        body
      )}
    </motion.div>
  );
}
