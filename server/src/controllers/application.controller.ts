import { Request, Response } from "express";
import { Application } from "../models/Application";
import { Project } from "../models/Project";
import { User } from "../models/User";
import { AppError, asyncHandler } from "../middleware/errorHandler";

export const applyToProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError("Project not found", 404);

  if (project.owner.toString() === req.userId) {
    throw new AppError("You can't apply to your own project", 400);
  }

  const applicant = await User.findById(req.userId);
  if (!applicant) throw new AppError("User not found", 404);

  try {
    const application = await Application.create({
      ...req.body,
      project: project._id,
      projectTitle: project.title,
      applicant: applicant._id,
      applicantName: applicant.name,
      applicantUniversity: applicant.university,
      ownerId: project.owner,
    });
    res.status(201).json({ success: true, application });
  } catch (err) {
    // Mongoose throws error code 11000 on a unique-index violation — this
    // is what applicationSchema's { project, applicant } unique index
    // (Application.ts) is actually for: catching a duplicate application
    // at the database level, not just hoping the frontend prevents it.
    if ((err as { code?: number }).code === 11000) {
      throw new AppError("You've already applied to this project", 409);
    }
    throw err;
  }
});

export const getMyApplications = asyncHandler(async (req: Request, res: Response) => {
  const applications = await Application.find({ applicant: req.userId }).sort({ createdAt: -1 });
  res.json({ success: true, applications });
});

export const getReceivedApplications = asyncHandler(async (req: Request, res: Response) => {
  const applications = await Application.find({ ownerId: req.userId }).sort({ createdAt: -1 });
  res.json({ success: true, applications });
});

export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new AppError("Application not found", 404);

  // Authorization: only the project's owner can decide on an application
  // to it — checked against ownerId stored on the document, never
  // against anything the client sent.
  if (application.ownerId.toString() !== req.userId) {
    throw new AppError("Only the project owner can review this application", 403);
  }

  if (application.status !== "Pending") {
    throw new AppError("This application has already been decided", 400);
  }

  application.status = req.body.status;
  await application.save();

  res.json({ success: true, application });
});
