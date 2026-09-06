// The mock `Profile` object that used to live here is gone now that
// ProfileContext fetches the real thing — but the *types* and the fixed
// category taxonomy stay. This file is now "the shape of a profile,"
// not "fake profile data."

export type ProficiencyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Skill {
  name: string;
  proficiency: ProficiencyLevel;
}

export interface Profile {
  name: string;
  profilePicture: string;
  university: string;
  degreeProgram: string;
  semester: string;
  country: string;
  city: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  availability: string;
  preferredTeamSize: number;
  preferredRole: string;
  interests: string[];
  preferredCategories: string[];
  skills: Skill[];
}

export const PROJECT_CATEGORIES = [
  "AI/ML",
  "Web Development",
  "Mobile",
  "Cybersecurity",
  "Data Science",
  "IoT",
  "Robotics",
  "FinTech",
  "EdTech",
  "Healthcare",
  "Social Impact",
];
