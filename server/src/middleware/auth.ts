import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";
import { AppError } from "./errorHandler";

// Augment Express's Request type so req.userId is available (and
// type-checked) in any route handler that runs after this middleware.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Missing or malformed Authorization header", 401);
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    throw new AppError("Invalid or expired access token", 401);
  }
}
