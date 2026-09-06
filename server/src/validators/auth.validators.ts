import { z } from "zod";

const currentYear = new Date().getFullYear();

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  profilePicture: z.string().max(3_000_000, "Profile picture is too large").optional(),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  university: z.string().trim().min(2, "University is required"),
  degreeProgram: z.string().trim().min(2, "Degree/program is required"),
  graduationYear: z
    .number()
    .int()
    .min(currentYear, "Graduation year can't be in the past")
    .max(currentYear + 8, "Graduation year is too far in the future"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});
