import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, isLoading } = useAuth();

  // Don't redirect while we're still checking for a restorable session —
  // that would bounce a genuinely logged-in user to /login for a flash
  // before the refresh call resolves.
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-ink/60">Loading…</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
