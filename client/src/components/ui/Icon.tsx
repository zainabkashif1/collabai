import type { SVGProps } from "react";

/**
 * Small hand-rolled icon set so the app doesn't need an extra dependency
 * for a handful of glyphs. Consistent 20x20 viewBox, stroke-based, round
 * joins — matches the rest of the UI (thin borders, soft corners).
 * Every icon accepts standard SVG props so callers can set size/className.
 */
type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2.5" y="4.5" width="15" height="11" rx="2.2" />
      <path d="m3.2 5.3 6.8 5 6.8-5" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="9" width="12" height="8" rx="2" />
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 10s2.8-5.5 8-5.5S18 10 18 10s-2.8 5.5-8 5.5S2 10 2 10Z" />
      <circle cx="10" cy="10" r="2.4" />
    </svg>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 3l14 14" />
      <path d="M9.1 4.6c.3 0 .6-.05.9-.05 5.2 0 8 5.5 8 5.5a13.4 13.4 0 0 1-3 3.7M6.3 6.2A13 13 0 0 0 2 10s2.8 5.5 8 5.5c1.2 0 2.3-.3 3.2-.75" />
      <path d="M8.1 8.15A2.4 2.4 0 0 0 10 12.4a2.4 2.4 0 0 0 1.85-.9" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 10h12" />
      <path d="M11 5.5 16 10l-5 4.5" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7.2" cy="7" r="2.6" />
      <path d="M2.5 16c.6-2.6 2.4-4 4.7-4s4.1 1.4 4.7 4" />
      <circle cx="14.3" cy="7.6" r="2.1" />
      <path d="M12.7 9.2c1.9.2 3.3 1.5 3.8 3.7" />
    </svg>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2.5 5.3c0-.8.6-1.4 1.4-1.4h3.4l1.6 1.8h7.2c.8 0 1.4.6 1.4 1.4v7.1c0 .8-.6 1.4-1.4 1.4H3.9c-.8 0-1.4-.6-1.4-1.4Z" />
    </svg>
  );
}

export function ClipboardCheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4.5" y="3.5" width="11" height="14" rx="1.8" />
      <path d="M7.5 3.2h5a1 1 0 0 1 1 1v1H6.5v-1a1 1 0 0 1 1-1Z" />
      <path d="m7.3 10.6 1.8 1.8 3.6-4" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 8.2a5 5 0 0 1 10 0c0 3.4 1.2 4.6 1.2 4.6H3.8S5 11.6 5 8.2Z" />
      <path d="M8.2 15.3a1.9 1.9 0 0 0 3.6 0" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="m12.6 7.4-1.5 4-4 1.5 1.5-4Z" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 2.6c.5 2.9 1.1 4.6 2 5.6 1 1 2.7 1.6 5.4 2.1-2.7.5-4.4 1.1-5.4 2.1-1 1-1.6 2.7-2 5.6-.5-2.9-1.1-4.6-2-5.6-1-1-2.7-1.6-5.4-2.1 2.7-.5 4.4-1.1 5.4-2.1 1-1 1.6-2.7 2-5.6Z" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.5 4.3v11.4a.8.8 0 0 0 1.2.7l9-5.7a.8.8 0 0 0 0-1.4l-9-5.7a.8.8 0 0 0-1.2.7Z" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="M10 6v4.2l3 1.8" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="M2.7 10h14.6M10 2.7c1.9 2 3 4.6 3 7.3s-1.1 5.3-3 7.3c-1.9-2-3-4.6-3-7.3s1.1-5.3 3-7.3Z" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m10 2.8 2.3 4.7 5.1.75-3.7 3.6.9 5.15L10 14.6l-4.6 2.4.9-5.15-3.7-3.6 5.1-.75Z" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="m6.8 10.2 2.1 2.1 4.3-4.6" />
    </svg>
  );
}

export function AlertCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="M10 6.5v4" />
      <path d="M10 13.5h.01" />
    </svg>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg {...base(props)} className={`animate-spin ${props.className ?? ""}`}>
      <path d="M10 2.7a7.3 7.3 0 1 0 7.3 7.3" strokeLinecap="round" />
    </svg>
  );
}
