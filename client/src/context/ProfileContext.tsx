import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";
import type { Profile } from "../data/mockProfile";

// The backend's User document has more fields (email, password-related
// ones, etc.) than the frontend's Profile type needs to know about —
// this picks out exactly the editable profile fields, same idea as
// picking columns in a SQL SELECT rather than fetching a whole row.
function normalizeProfile(doc: Record<string, unknown>): Profile {
  return {
    name: (doc.name as string) ?? "",
    profilePicture: (doc.profilePicture as string) ?? "",
    university: (doc.university as string) ?? "",
    degreeProgram: (doc.degreeProgram as string) ?? "",
    semester: (doc.semester as string) ?? "",
    country: (doc.country as string) ?? "",
    city: (doc.city as string) ?? "",
    bio: (doc.bio as string) ?? "",
    githubUrl: (doc.githubUrl as string) ?? "",
    linkedinUrl: (doc.linkedinUrl as string) ?? "",
    portfolioUrl: (doc.portfolioUrl as string) ?? "",
    availability: (doc.availability as string) ?? "",
    preferredTeamSize: (doc.preferredTeamSize as number) ?? 1,
    preferredRole: (doc.preferredRole as string) ?? "",
    interests: (doc.interests as string[]) ?? [],
    preferredCategories: (doc.preferredCategories as string[]) ?? [],
    skills: (doc.skills as Profile["skills"]) ?? [],
  };
}

interface ProfileContextValue {
  profile: Profile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // No token yet (still restoring session, or genuinely logged out) —
    // don't fire the request only to get a 401 back.
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    api
      .get("/profile/me")
      .then((res) => setProfile(normalizeProfile(res.data.profile)))
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  async function updateProfile(updates: Partial<Profile>) {
    const res = await api.patch("/profile/me", updates);
    setProfile(normalizeProfile(res.data.profile));
  }

  return (
    <ProfileContext.Provider value={{ profile, isLoading, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}
