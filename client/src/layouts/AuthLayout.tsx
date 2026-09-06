import { Outlet } from "react-router-dom";
import { CompatibilityOrbit } from "../components/CompatibilityOrbit";

export function AuthLayout() {
  return (
    <div className="auth-frame min-h-screen bg-paper lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
      {/* Brand panel — hidden on small screens, the form is what matters there */}
      <div className="auth-brand relative hidden overflow-hidden bg-ink px-12 text-white lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="auth-brand-line absolute left-12 right-12 top-12" />
        <div className="auth-brand-line absolute bottom-12 left-12 right-12" />
        <div className="relative flex flex-col items-center justify-center gap-6">
          <CompatibilityOrbit size={180} />
          <div className="max-w-xs text-center">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-signal-soft/70">Student collaboration network</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">CollabAI</h2>
          <p className="mt-3 text-sm leading-6 text-white/50">
            Find teammates whose skills, availability, and interests actually fit your project.
          </p>
          </div>
        </div>
      </div>

      <div className="auth-form flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm rounded-[1.75rem] bg-white/65 p-7 shadow-[0_24px_80px_rgba(32,33,42,0.08)] sm:p-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
