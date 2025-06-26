import {  authenticateAdmin } from "../middleware/auth.middleware";
import { Router } from "express";
import { validateBody } from "../middleware/zod.middleware";
import { createArtist, deleteArtist, updateArtist,getArtists } from "../controllers/artist.auth.controller";
import { SigninSchema } from "../zod/auth.validator";
import { updateUserSchema } from "../zod/user.validator";
import { updateUser } from "../controllers/user.controller";
import { paginationSchema } from "../zod/pagenation.validator";
const router = Router();

router.use(authenticateAdmin)
export default router;