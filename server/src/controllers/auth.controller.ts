import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { AppError, asyncHandler } from "../middleware/errorHandler";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateOneTimeToken,
  hashToken,
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
} from "../utils/tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/mailer";

const BCRYPT_ROUNDS = 12;

const REFRESH_COOKIE_NAME = "refreshToken";
const refreshCookieOptions = {
  httpOnly: true, // not readable by client-side JS — mitigates XSS token theft
  secure: process.env.NODE_ENV === "production", // HTTPS-only in prod; allow http for local dev
  sameSite: "lax" as const,
  maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  path: "/api/auth", // only sent back to auth endpoints, not every API call
};

async function issueSession(res: Response, userId: string) {
  const accessToken = signAccessToken({ userId });
  const refreshToken = signRefreshToken({ userId });

  await User.findByIdAndUpdate(userId, {
    refreshTokenHash: hashToken(refreshToken),
  });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
  return accessToken;
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, university, degreeProgram, graduationYear, profilePicture } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const { token: verificationToken, hash: verificationHash } = generateOneTimeToken();

  const user = await User.create({
    name,
    email,
    passwordHash,
    university,
    degreeProgram,
    graduationYear,
    profilePicture,
    emailVerificationTokenHash: verificationHash,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
  });

  sendVerificationEmail(email, verificationToken);

  const accessToken = await issueSession(res, user._id.toString());

  res.status(201).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      university: user.university,
      degreeProgram: user.degreeProgram,
      graduationYear: user.graduationYear,
      isEmailVerified: user.isEmailVerified,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+passwordHash");
  // Same error for "no such user" and "wrong password" — don't let the
  // response shape tell an attacker which emails are registered.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = await issueSession(res, user._id.toString());

  res.json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      degreeProgram: user.degreeProgram,
      graduationYear: user.graduationYear,
      isEmailVerified: user.isEmailVerified,
    },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    throw new AppError("No refresh token provided", 401);
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(payload.userId).select("+refreshTokenHash");
  // Comparing against the stored hash means a refresh token is only
  // usable once between rotations — if it's been used already (hash
  // won't match the newer one on file), this rejects it.
  if (!user || user.refreshTokenHash !== hashToken(token)) {
    throw new AppError("Refresh token no longer valid", 401);
  }

  const accessToken = await issueSession(res, user._id.toString());
  res.json({ success: true, accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await User.findByIdAndUpdate(payload.userId, { $unset: { refreshTokenHash: 1 } });
    } catch {
      // Token was already invalid/expired — nothing to invalidate, fall through to clearing the cookie.
    }
  }
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
  res.json({ success: true });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  const hash = hashToken(token);

  const user = await User.findOne({
    emailVerificationTokenHash: hash,
    emailVerificationExpires: { $gt: new Date() },
  }).select("+emailVerificationTokenHash +emailVerificationExpires");

  if (!user) {
    throw new AppError("Verification link is invalid or has expired", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Email verified" });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always return the same success response whether or not the email
  // exists — otherwise this endpoint becomes a way to enumerate
  // registered users by trying addresses and watching the response.
  if (user) {
    const { token, hash } = generateOneTimeToken();
    user.passwordResetTokenHash = hash;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
    await user.save();
    sendPasswordResetEmail(email, token);
  }

  res.json({
    success: true,
    message: "If that email is registered, a reset link has been sent.",
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  const hash = hashToken(token);

  const user = await User.findOne({
    passwordResetTokenHash: hash,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetTokenHash +passwordResetExpires");

  if (!user) {
    throw new AppError("Reset link is invalid or has expired", 400);
  }

  user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  // Invalidate any existing session — a password reset should log out
  // anyone using the old credentials (e.g. an attacker who had them).
  user.refreshTokenHash = undefined;
  await user.save();

  res.json({ success: true, message: "Password has been reset. Please log in again." });
});
