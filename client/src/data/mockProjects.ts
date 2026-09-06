// Same story as mockProfile.ts — types stay, the fake array is gone now
// that ProjectsContext fetches real data.

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ProjectStatus = "Open" | "In Progress" | "Completed";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  difficulty: Difficulty;
  durationWeeks: number;
  teamSize: number;
  status: ProjectStatus;
  remote: boolean;
  ownerName: string;
  ownerUniversity: string;
  // Still 0 for everyone — the matching engine that computes a real
  // number is Phase 2 (SRS §16), not built yet. See FRONTEND_SUMMARY.md.
  matchPercentage: number;
}
