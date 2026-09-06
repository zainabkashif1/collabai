import { Request, Response } from "express";
import { Project } from "../models/Project";
import { User } from "../models/User";
import { AppError, asyncHandler } from "../middleware/errorHandler";
import { listProjectsQuerySchema } from "../validators/project.validators";

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const parsed = listProjectsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError("Invalid query parameters", 422);
  }
  const { search, category, difficulty, remoteOnly } = parsed.data;

  const filter: Record<string, unknown> = {};
  if (search) filter.title = { $regex: search, $options: "i" };
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (remoteOnly) filter.remote = true;

  const projects = await Project.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, projects });
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError("Project not found", 404);
  res.json({ success: true, project });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const owner = await User.findById(req.userId);
  if (!owner) throw new AppError("User not found", 404);

  const project = await Project.create({
    ...req.body,
    owner: owner._id,
    // Snapshotting from the authenticated user's own record, never from
    // the request body — the client could otherwise claim to be anyone.
    ownerName: owner.name,
    ownerUniversity: owner.university,
  });

  res.status(201).json({ success: true, project });
});
