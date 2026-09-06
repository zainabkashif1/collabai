import { z } from "zod";

const urlOrEmpty = z
  .string()
  .trim()
  .refine((v) => v === "" || z.string().url().safeParse(v).success, "Enter a valid URL")
  .optional();

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  university: z.string().trim().min(2, "University is required"),
  degreeProgram: z.string().trim().min(2, "Degree/program is required"),
  profilePicture: z.string().max(3_000_000, "Profile picture is too large").optional(),
  semester: z.string().trim().min(1, "Required"),
  country: z.string().trim().min(1, "Required"),
  city: z.string().trim().min(1, "Required"),
  bio: z.string().max(300, "Keep it under 300 characters").optional(),
  githubUrl: urlOrEmpty,
  linkedinUrl: urlOrEmpty,
  portfolioUrl: urlOrEmpty,
  availability: z.string().max(200).optional(),
  preferredTeamSize: z.coerce.number().int().min(1).max(10),
  preferredRole: z.string().trim().min(1, "Required"),
  interests: z.array(z.string()),
  preferredCategories: z.array(z.string()),
  skills: z.array(
    z.object({
      name: z.string().trim().min(1, "Skill name required"),
      proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
    })
  ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
