import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Small leading glyph rendered inside the field, left-aligned. */
  icon?: ReactNode;
  /** Trailing control rendered inside the field, e.g. a password-visibility toggle. */
  endAdornment?: ReactNode;
}

/**
 * forwardRef so react-hook-form (or any form lib) can register this
 * directly later — a common gap in from-scratch input components that
 * causes rework once real forms show up.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", icon, endAdornment, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink/80">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/30
              ${icon ? "pl-10" : ""} ${endAdornment ? "pr-10" : ""}
              ${error ? "border-ember focus:border-ember" : "border-line focus:border-signal"}
              ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {endAdornment && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2">{endAdornment}</span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-ember">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
