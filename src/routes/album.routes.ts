import { authenticate, authenticateAdmin } from "../middleware/auth.middleware";
import { Router } from "express";
import { validateBody } from "../middleware/zod.middleware";
import { createAlbumSchema, updateAlbumSchema, addOrRemoveSongsFromAlbumSchema } from "../zod/album.validator";
import { addSongsToAlbum, createAlbum, removeSongsFromAlbum, updateAlbum, getAlbum, getAllAlbums } from "../controllers/album.controller";

const router = Router();

router.get('/get/:album_id',authenticate, getAlbum);

router.use(authenticateAdmin);

export default router;