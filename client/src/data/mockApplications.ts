export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";

export interface Application {
  id: string;
  projectId: string;
  projectTitle: string;
  applicantName: string;
  applicantUniversity: string;
  message: string;
  relevantSkills: string[];
  expectedContribution: string;
  availability: string;
  status: ApplicationStatus;
  appliedAt: string; // ISO timestamp
}
