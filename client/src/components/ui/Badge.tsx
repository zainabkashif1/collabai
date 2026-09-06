import { type ReactNode } from "react";

type Tone = "neutral" | "signal" | "ember" | "mint";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-ink/5 text-ink/70",
  signal: "bg-signal-soft text-signal",
  ember: "bg-ember-soft text-ember",
  mint: "bg-mint-soft text-mint",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
