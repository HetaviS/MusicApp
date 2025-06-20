import { authenticate } from "../middleware/auth.middleware";
import { Router } from "express";
import { getAllCategories, createCategory, removeCategory, getSongsByCategory } from "../controllers/genre.category.controller";
import { validateBody } from "../middleware/zod.middleware";
import { CreateGenreCategoryValidator } from "../zod/genre.category.validator";
const router = Router();

router.use(authenticate)
router.get('/get-all', getAllCategories);
router.post('/create', validateBody(CreateGenreCategoryValidator), createCategory);
router.delete('/remove/:category_id', removeCategory);
router.get('/songs/:category_id', getSongsByCategory);

export default router;