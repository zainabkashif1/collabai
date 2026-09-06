import { z } from "zod";

// Deliberately does NOT include email or password — those go through
// their own dedicated, more carefully-guarded flows (auth.controller.ts),
// not a generic "update whatever fields are in the body" endpoint.
export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).optional(),
  profilePicture: z.string().max(3_000_000, "Profile picture is too large").optional(),
  university: z.string().trim().min(2).optional(),
  degreeProgram: z.string().trim().min(2).optional(),
  semester: z.string().trim().optional(),
  country: z.string().trim().optional(),
  city: z.string().trim().optional(),
  bio: z.string().trim().max(300).optional(),
  githubUrl: z.string().trim().url().optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url().optional().or(z.literal("")),
  portfolioUrl: z.string().trim().url().optional().or(z.literal("")),
  availability: z.string().trim().max(200).optional(),
  preferredTeamSize: z.coerce.number().int().min(1).max(20).optional(),
  preferredRole: z.string().trim().optional(),
  interests: z.array(z.string()).optional(),
  preferredCategories: z.array(z.string()).optional(),
  skills: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
      })
    )
    .optional(),
});
