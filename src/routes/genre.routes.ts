import { Router } from "express";
import { getAllGenre, createGenre, removeGenre, getSongsByGenre } from "../controllers/genre.controller";
import { validateBody } from "../middleware/zod.middleware";
import { CreateGenreCategoryValidator } from "../zod/genre.category.validator";
import { paginationSchema } from "../zod/pagenation.validator";
const router = Router();

router.get('/get-all',validateBody(paginationSchema), getAllGenre);
router.get('/songs/:genre_id',validateBody(paginationSchema), getSongsByGenre);
export default router;