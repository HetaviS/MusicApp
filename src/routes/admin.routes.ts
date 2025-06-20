import { authenticate, authenticateAdmin } from "../middleware/auth.middleware";
import { Router } from "express";
import { getAllUsersList } from "../controllers/admin.controller";
import { validateBody } from "../middleware/zod.middleware";
import { adminLoginSchema, adminUpdateSchema } from "../zod/admin.auth.validator";
import { updateAdmin, verifyAdmin } from "../controllers/admin.auth.controller";

const router = Router();


router.post('/login', validateBody(adminLoginSchema), verifyAdmin);
router.use(authenticateAdmin)
router.post('/update', validateBody(adminUpdateSchema), updateAdmin);
router.get('/all-users', getAllUsersList);
export default router;