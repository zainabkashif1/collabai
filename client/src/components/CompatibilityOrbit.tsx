import { motion, useReducedMotion } from "motion/react";

interface CompatibilityOrbitProps {
  /** 0-100. When provided, shown as the center label — this is the same
   * component we'll reuse later as the real match-score visual on
   * project/candidate cards, not just decoration on the auth screen. */
  percentage?: number;
  size?: number;
}

/**
 * The app's signature visual: a center node (a student, or a match score)
 * with satellites (skills, or candidate projects) orbiting it, connected
 * by lines that draw themselves in on mount. This is meant to be the one
 * consistently-reused motif tying the visual identity to what the product
 * actually does — compatibility matching — rather than generic decoration.
 */
export function CompatibilityOrbit({ percentage, size = 200 }: CompatibilityOrbitProps) {
  const shouldReduceMotion = useReducedMotion();
  const center = size / 2;
  const orbitRadius = size * 0.32;
  const satelliteAngles = [40, 160, 270]; // degrees — asymmetric, not a neat grid

  const satellites = satelliteAngles.map((angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + orbitRadius * Math.cos(rad),
      y: center + orbitRadius * Math.sin(rad),
    };
  });

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg width={size} height={size} className="absolute inset-0">
        {/* Connecting lines draw in on mount */}
        {satellites.map((s, i) => (
          <motion.line
            key={i}
            x1={center}
            y1={center}
            x2={s.x}
            y2={s.y}
            stroke="var(--color-signal)"
            strokeWidth={1.5}
            strokeOpacity={0.35}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.15 * i, ease: "easeOut" }}
          />
        ))}

        {/* Satellite nodes — small, orbit very slowly and subtly if motion is allowed */}
        {satellites.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={5}
            fill={i === 0 ? "var(--color-ember)" : "var(--color-signal)"}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              shouldReduceMotion
                ? { scale: 1, opacity: 1 }
                : {
                    scale: 1,
                    opacity: 1,
                    cx: [s.x, s.x + Math.cos((satelliteAngles[i] * Math.PI) / 180) * 6, s.x],
                    cy: [s.y, s.y + Math.sin((satelliteAngles[i] * Math.PI) / 180) * 6, s.y],
                  }
            }
            transition={{
              scale: { duration: 0.3, delay: 0.3 + i * 0.1 },
              opacity: { duration: 0.3, delay: 0.3 + i * 0.1 },
              cx: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
              cy: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      </svg>

      {/* Center node */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute flex items-center justify-center rounded-full bg-white border-2 border-signal shadow-sm"
        style={{
          width: size * 0.34,
          height: size * 0.34,
          left: center - (size * 0.34) / 2,
          top: center - (size * 0.34) / 2,
        }}
      >
        {percentage !== undefined && (
          <span className="font-mono font-semibold text-signal" style={{ fontSize: size * 0.11 }}>
            {percentage}%
          </span>
        )}
      </motion.div>
    </div>
  );
}
