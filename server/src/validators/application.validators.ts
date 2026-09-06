import { z } from "zod";

export const applyToProjectSchema = z.object({
  message: z.string().trim().min(20, "Give at least a couple of sentences on why you're a fit"),
  relevantSkills: z.array(z.string()).min(1, "Add at least one relevant skill"),
  expectedContribution: z.string().trim().min(10, "Describe what you'd work on"),
  availability: z.string().trim().min(1, "Required"),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["Accepted", "Rejected"]),
});
