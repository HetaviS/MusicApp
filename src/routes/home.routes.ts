import { Router } from "express";
import {getAllBlocks, getBlockById, songsByGenre} from "../controllers/home.controller";
import { validateBody } from "../middleware/zod.middleware";
import { paginationSchema } from "../zod/pagenation.validator";
const router = Router();


router.get('/all-blocks', validateBody(paginationSchema), getAllBlocks);
router.get('/:blockId', getBlockById); // Assuming this is for getting albums by genre, you might want to change the controller function name
router.get('/songs-by-genre/:genreId', songsByGenre); // Assuming this is for getting songs by genre, you might want to change the controller function name

export default router;