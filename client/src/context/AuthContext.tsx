import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api, setAccessToken as syncAccessToken } from "../api/client";

interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  degreeProgram: string;
  graduationYear: number;
  isEmailVerified: boolean;
}

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setSession: (user: User, accessToken: string) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, try to silently restore a session using the httpOnly
  // refresh cookie (set by login/register). If it's missing or expired,
  // /refresh fails and we just land on the logged-out state — no error
  // shown, since "not logged in yet" is the normal case here, not a bug.
  useEffect(() => {
    api
      .post("/auth/refresh")
      .then(async (res) => {
        setAccessToken(res.data.accessToken);
        syncAccessToken(res.data.accessToken);
        // Previously this left `user` as null after a silent restore —
        // noted as a gap back in FE-2 ("refresh only returns a token,
        // not the user object"). Now that GET /api/profile/me exists
        // (Backend phase), that gap is closed: a page refresh restores
        // the full identity, not just an access token nothing displays.
        const profileRes = await api.get("/profile/me");
        const p = profileRes.data.profile;
        setUser({
          id: p._id,
          name: p.name,
          email: p.email,
          university: p.university,
          degreeProgram: p.degreeProgram,
          graduationYear: p.graduationYear,
          isEmailVerified: p.isEmailVerified,
        });
      })
      .catch(() => {
        // No valid session — expected for a first-time visitor.
      })
      .finally(() => setIsLoading(false));
  }, []);

  function setSession(user: User, accessToken: string) {
    setUser(user);
    setAccessToken(accessToken);
    syncAccessToken(accessToken);
  }

  function clearSession() {
    setUser(null);
    setAccessToken(null);
    syncAccessToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
