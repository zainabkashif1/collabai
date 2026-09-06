import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().trim().min(4, "Title must be at least 4 characters"),
  description: z.string().trim().min(20, "Give at least a couple of sentences"),
  category: z.string().min(1, "Pick a category"),
  requiredSkills: z.array(z.string()).min(1, "Add at least one required skill"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  durationWeeks: z.coerce.number().int().min(1).max(52),
  teamSize: z.coerce.number().int().min(1).max(20),
  remote: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
