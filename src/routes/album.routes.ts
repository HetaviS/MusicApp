import { authenticate, authenticateAdmin } from "../middleware/auth.middleware";
import { Router } from "express";
import { validateBody } from "../middleware/zod.middleware";
import {  getAlbum } from "../controllers/album.controller";
import z from "zod";

const router = Router();

router.post('/get', authenticate, validateBody(z.object({ album_id: z.string().min(1, 'album_id is required.') })), getAlbum);

router.use(authenticateAdmin);

export default router;