function toneForMatch(pct: number): string {
  if (pct >= 80) return "var(--color-mint)";
  if (pct >= 60) return "var(--color-signal)";
  return "var(--color-ink)";
}

/**
 * A compact version of the same "compatibility" idea as CompatibilityOrbit,
 * sized for a card corner rather than a hero moment. Deliberately reuses
 * the ring motif instead of inventing a second visual language for the
 * same concept (match strength).
 */
export function MatchRing({ percentage }: { percentage: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);
  const color = toneForMatch(percentage);

  return (
    <div className="relative w-11 h-11 shrink-0">
      <svg width={44} height={44} className="-rotate-90">
        <circle cx={22} cy={22} r={radius} stroke="var(--color-line)" strokeWidth={3} fill="none" />
        <circle
          cx={22}
          cy={22}
          r={radius}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-mono font-semibold"
        style={{ fontSize: 10, color }}
      >
        {percentage}%
      </span>
    </div>
  );
}
