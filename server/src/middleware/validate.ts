import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError } from "./errorHandler";

// Validates req.body against a Zod schema and replaces it with the
// parsed (typed, trimmed/coerced) result. Keeps validation rules in one
// place per route instead of scattered if-checks in each controller.
export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      throw new AppError(message, 422);
    }
    req.body = result.data;
    next();
  };
}
