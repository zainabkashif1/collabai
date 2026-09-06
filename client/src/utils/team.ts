import type { Project } from "../data/mockProjects";
import type { Application } from "../data/mockApplications";

export interface TeamMember {
  name: string;
  university: string;
  role: "Owner" | "Member";
}

/**
 * A project's team is never stored directly — it's always the owner plus
 * whoever has an Accepted application for that project. Deriving this on
 * read (rather than writing a "team" record when an application is
 * accepted) means there's exactly one place team membership can get out
 * of sync with reality: nowhere, because it's computed fresh every time.
 */
export function getTeamMembers(project: Project, applications: Application[]): TeamMember[] {
  const acceptedMembers: TeamMember[] = applications
    .filter((a) => a.projectId === project.id && a.status === "Accepted")
    .map((a) => ({ name: a.applicantName, university: a.applicantUniversity, role: "Member" as const }));

  return [{ name: project.ownerName, university: project.ownerUniversity, role: "Owner" as const }, ...acceptedMembers];
}

/** Projects where the given person is either the owner or an accepted member. */
export function getMyProjects(name: string, projects: Project[], applications: Application[]): Project[] {
  const acceptedProjectIds = new Set(
    applications.filter((a) => a.applicantName === name && a.status === "Accepted").map((a) => a.projectId)
  );
  return projects.filter((p) => p.ownerName === name || acceptedProjectIds.has(p.id));
}
