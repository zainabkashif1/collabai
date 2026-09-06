import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validateBody } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validators/auth.validators";
import {
  register,
  login,
  logout,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

// Blunt force brute-forcing / credential stuffing on the endpoints that
// take a password. Keyed by IP; generous enough not to lock out a real
// user fumbling their password a few times.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many attempts. Try again later." },
});

router.post("/register", authLimiter, validateBody(registerSchema), register);
router.post("/login", authLimiter, validateBody(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/verify-email", validateBody(verifyEmailSchema), verifyEmail);
router.post("/forgot-password", authLimiter, validateBody(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authLimiter, validateBody(resetPasswordSchema), resetPassword);

export default router;
