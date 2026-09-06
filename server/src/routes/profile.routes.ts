import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { updateProfileSchema } from "../validators/profile.validators";
import { getMyProfile, updateMyProfile } from "../controllers/profile.controller";

const router = Router();

router.get("/me", requireAuth, getMyProfile);
router.patch("/me", requireAuth, validateBody(updateProfileSchema), updateMyProfile);

export default router;
