import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "../api/client";
import type { Project } from "../data/mockProjects";

// Backend docs come back with Mongo's `_id` and no `matchPercentage`
// (that's Phase 2 — see mockProjects.ts). Normalizing here, in one
// place, means every component built against the `Project` type in
// FE-5/6/7/8 keeps working completely unchanged.
function normalizeProject(doc: Record<string, unknown>): Project {
  return {
    id: doc._id as string,
    title: doc.title as string,
    description: doc.description as string,
    category: doc.category as string,
    requiredSkills: doc.requiredSkills as string[],
    difficulty: doc.difficulty as Project["difficulty"],
    durationWeeks: doc.durationWeeks as number,
    teamSize: doc.teamSize as number,
    status: doc.status as Project["status"],
    remote: doc.remote as boolean,
    ownerName: doc.ownerName as string,
    ownerUniversity: doc.ownerUniversity as string,
    matchPercentage: 0,
  };
}

interface ProjectsContextValue {
  projects: Project[];
  isLoading: boolean;
  getProjectById: (id: string) => Project | undefined;
  addProject: (project: Omit<Project, "id" | "matchPercentage" | "ownerName" | "ownerUniversity">) => Promise<Project>;
  refetch: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchProjects() {
    const res = await api.get("/projects");
    setProjects((res.data.projects as Record<string, unknown>[]).map(normalizeProject));
  }

  useEffect(() => {
    // Discovery is a public endpoint (see server/src/routes/project.routes.ts)
    // so this loads regardless of auth state — no accessToken dependency here.
    fetchProjects()
      .catch(() => setProjects([]))
      .finally(() => setIsLoading(false));
  }, []);

  function getProjectById(id: string) {
    return projects.find((p) => p.id === id);
  }

  async function addProject(
    input: Omit<Project, "id" | "matchPercentage" | "ownerName" | "ownerUniversity">
  ): Promise<Project> {
    const res = await api.post("/projects", input);
    const created = normalizeProject(res.data.project);
    setProjects((prev) => [created, ...prev]);
    return created;
  }

  return (
    <ProjectsContext.Provider value={{ projects, isLoading, getProjectById, addProject, refetch: fetchProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used inside <ProjectsProvider>");
  return ctx;
}
