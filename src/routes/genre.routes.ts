import { authenticate } from "../middleware/auth.middleware";
import { Router } from "express";
import { getAllGenre, createGenre, removeGenre, getSongsByGenre } from "../controllers/genre.category.controller";
import { validateBody } from "../middleware/zod.middleware";
import { CreateGenreCategoryValidator } from "../zod/genre.category.validator";
const router = Router();

router.use(authenticate)
router.get('/get-all', getAllGenre);
router.post('/create', validateBody(CreateGenreCategoryValidator), createGenre);
router.delete('/delete/:genre_id', removeGenre);
router.get('/songs/:genre_id', getSongsByGenre);

export default router;