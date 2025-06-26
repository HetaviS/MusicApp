import { validateBody } from "../middleware/zod.middleware";
import { search } from "../controllers/explore.controller";
import { Router } from "express";
import { searchSchema } from "../zod/explore.validator";

const router = Router();

router.get('/search',validateBody(searchSchema), search);

export default router;