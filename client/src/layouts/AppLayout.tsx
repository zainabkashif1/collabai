import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/discover", label: "Discover Projects" },
  { to: "/profile", label: "My Profile" },
  { to: "/applications", label: "Applications" },
  { to: "/learning", label: "Learning Hub" },
  { to: "/meetings", label: "Meeting Room" },
];

export function AppLayout() {
  const { user, clearSession } = useAuth();
  const navigate = useNavigate();
  // Below the lg breakpoint the sidebar becomes an off-canvas panel
  // rather than a permanent 240px column — on a phone-width screen the
  // old fixed sidebar would have eaten most of the viewport.
  const [isNavOpen, setIsNavOpen] = useState(false);

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } finally {
      clearSession();
      navigate("/login");
    }
  }

  return (
    <div className="app-frame min-h-screen flex">
      {/* Mobile topbar — hidden entirely at lg and above, where the sidebar is always visible */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center justify-between px-4 border-b border-line bg-[#20212a] text-white">
        <span className="font-display font-semibold tracking-tight">CollabAI</span>
        <button
          onClick={() => setIsNavOpen(true)}
          aria-label="Open navigation menu"
          className="p-2 -mr-2"
        >
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Backdrop — only rendered (and only intercepts clicks) while the mobile nav is open */}
      {isNavOpen && (
        <div
          onClick={() => setIsNavOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-ink/30"
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar w-64 shrink-0 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-7 pt-8 pb-7">
          <div className="flex items-center gap-2.5">
            <span className="brand-mark">C</span>
            <span className="font-display text-xl font-semibold tracking-tight text-white">CollabAI</span>
          </div>
          <p className="mt-3 pl-10 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">Student workspace</p>
        </div>

        <nav className="flex-1 px-4 py-3 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsNavOpen(false)}
              className={({ isActive }) =>
                  `relative rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-white/55 hover:bg-white/7 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-xl bg-[#f07968]"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-white/10">
          <div className="px-3 py-3 text-sm rounded-xl bg-white/6">
            <p className="font-medium text-white truncate">{user?.name ?? "—"}</p>
            <p className="text-white/45 text-xs truncate">{user?.university ?? ""}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left rounded-lg px-3 py-2 mt-2 text-sm text-white/50 hover:bg-white/7 hover:text-white transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="app-main flex-1 overflow-y-auto pt-14 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
