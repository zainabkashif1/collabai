import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createProjectSchema } from "../validators/project.validators";
import { applyToProjectSchema } from "../validators/application.validators";
import { listProjects, getProject, createProject } from "../controllers/project.controller";
import { applyToProject } from "../controllers/application.controller";

const router = Router();

// Discovery is public — browsing projects shouldn't require an account,
// same as most job/project boards. Only creating one requires auth.
router.get("/", listProjects);
router.get("/:id", getProject);
router.post("/", requireAuth, validateBody(createProjectSchema), createProject);

// Nested here (not in application.routes.ts) because this is inherently
// project-scoped — POST /api/projects/:id/applications reads naturally
// as "apply to this project," matching how ProjectDetail.tsx calls it.
router.post("/:id/applications", requireAuth, validateBody(applyToProjectSchema), applyToProject);

export default router;
