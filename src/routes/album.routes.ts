import { authenticate } from "../middleware/auth.middleware";
import { Router } from "express";
import { validateBody } from "../middleware/zod.middleware";
import { createAlbumSchema, updateAlbumSchema, addOrRemoveSongsFromAlbumSchema } from "../zod/album.validator";
import { addSongsToAlbum, createAlbum, removeSongsFromAlbum, updateAlbum, getAlbum } from "../controllers/album.controller";

const router = Router();

router.use(authenticate)
router.post('/create', validateBody(createAlbumSchema), createAlbum);
router.put('/update/:album_id', validateBody(updateAlbumSchema), updateAlbum);
router.get('/get/:album_id', getAlbum);
router.put('/add-Songs/:album_id', validateBody(addOrRemoveSongsFromAlbumSchema), addSongsToAlbum);
router.put('/remove-Songs/:album_id', validateBody(addOrRemoveSongsFromAlbumSchema), removeSongsFromAlbum);

export default router;