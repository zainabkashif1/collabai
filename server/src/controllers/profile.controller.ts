import { Request, Response } from "express";
import { User } from "../models/User";
import { AppError, asyncHandler } from "../middleware/errorHandler";

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError("User not found", 404);
  res.json({ success: true, profile: user });
});

export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  // req.body has already passed validateBody(updateProfileSchema), so
  // every key present is one we explicitly allow — safe to spread
  // directly rather than picking fields one by one.
  const user = await User.findByIdAndUpdate(req.userId, req.body, {
    new: true, // return the document *after* the update, not before
    runValidators: true, // re-run schema validators (e.g. skill enum) on update, not just on create
  });
  if (!user) throw new AppError("User not found", 404);
  res.json({ success: true, profile: user });
});
