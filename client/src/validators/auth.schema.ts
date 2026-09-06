import { z } from "zod";

// Deliberately kept in sync with server/src/validators/auth.validators.ts.
// The backend is the source of truth — it re-validates everything
// regardless of what the client sends — but duplicating the same rules
// here means the user sees "needs a number" while typing, not after a
// round trip.
const currentYear = new Date().getFullYear();

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Needs an uppercase letter")
      .regex(/[0-9]/, "Needs a number"),
    confirmPassword: z.string(),
    university: z.string().trim().min(2, "University is required"),
    degreeProgram: z.string().trim().min(2, "Degree/program is required"),
    graduationYear: z.coerce
      .number()
      .int()
      .min(currentYear, "Can't be in the past")
      .max(currentYear + 8, "Too far in the future"),
    profilePicture: z.string().max(3_000_000, "Profile picture is too large").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
