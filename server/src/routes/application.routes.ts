import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { updateApplicationStatusSchema } from "../validators/application.validators";
import {
  getMyApplications,
  getReceivedApplications,
  updateApplicationStatus,
} from "../controllers/application.controller";

const router = Router();

router.get("/mine", requireAuth, getMyApplications);
router.get("/received", requireAuth, getReceivedApplications);
router.patch("/:id", requireAuth, validateBody(updateApplicationStatusSchema), updateApplicationStatus);

export default router;
