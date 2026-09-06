import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";
import type { Application, ApplicationStatus } from "../data/mockApplications";

function normalizeApplication(doc: Record<string, unknown>): Application {
  return {
    id: doc._id as string,
    projectId: doc.project as string,
    projectTitle: doc.projectTitle as string,
    applicantName: doc.applicantName as string,
    applicantUniversity: doc.applicantUniversity as string,
    message: doc.message as string,
    relevantSkills: doc.relevantSkills as string[],
    expectedContribution: doc.expectedContribution as string,
    availability: doc.availability as string,
    status: doc.status as ApplicationStatus,
    appliedAt: doc.createdAt as string,
  };
}

interface ApplicationsContextValue {
  applications: Application[];
  isLoading: boolean;
  applyToProject: (
    projectId: string,
    input: Pick<Application, "message" | "relevantSkills" | "expectedContribution" | "availability">
  ) => Promise<void>;
  hasApplied: (projectId: string, applicantName: string) => boolean;
  updateStatus: (applicationId: string, status: ApplicationStatus) => Promise<void>;
}

const ApplicationsContext = createContext<ApplicationsContextValue | undefined>(undefined);

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchAll() {
    // Both endpoints require auth (they're scoped to "your" applications
    // either as applicant or as owner), so both need to be loaded to
    // reconstruct what the old single mock array held — a project owner
    // needs to see applications they received, and everyone needs to see
    // applications they sent, in the same page (Applications.tsx tabs).
    const [mineRes, receivedRes] = await Promise.all([api.get("/applications/mine"), api.get("/applications/received")]);
    const mine = (mineRes.data.applications as Record<string, unknown>[]).map(normalizeApplication);
    const received = (receivedRes.data.applications as Record<string, unknown>[]).map(normalizeApplication);
    // An application you sent to your own project can't happen (the
    // backend blocks it), so these two sets never overlap — safe to
    // just concatenate rather than deduplicate by id.
    setApplications([...mine, ...received]);
  }

  useEffect(() => {
    if (!accessToken) {
      setApplications([]);
      setIsLoading(false);
      return;
    }
    fetchAll()
      .catch(() => setApplications([]))
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  async function applyToProject(
    projectId: string,
    input: Pick<Application, "message" | "relevantSkills" | "expectedContribution" | "availability">
  ) {
    await api.post(`/projects/${projectId}/applications`, input);
    await fetchAll(); // simplest correct option — re-fetch rather than hand-construct the new row locally
  }

  function hasApplied(projectId: string, applicantName: string) {
    return applications.some((a) => a.projectId === projectId && a.applicantName === applicantName);
  }

  async function updateStatus(applicationId: string, status: ApplicationStatus) {
    await api.patch(`/applications/${applicationId}`, { status });
    setApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status } : a)));
  }

  return (
    <ApplicationsContext.Provider value={{ applications, isLoading, applyToProject, hasApplied, updateStatus }}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error("useApplications must be used inside <ApplicationsProvider>");
  return ctx;
}
