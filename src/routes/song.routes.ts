import { authenticate } from "../middleware/auth.middleware";
import { Router } from "express";
import { getSong, setFavourite, setDownloaded, getMySongs, createMusic, updateSong, getNextSong } from "../controllers/song.controller";
import { uploadMusicSchema, updateMusicSchema } from "../zod/song.validator";
import { validateBody } from "../middleware/zod.middleware";
import { paginationSchema } from "../zod/pagenation.validator";
import z from "zod";
const router = Router();
router.use(authenticate)
router.post('/get', validateBody(z.object({ song_id: z.string().min(1, 'song_id is required.') })), getSong);
router.post('/favourite', validateBody(z.object({ song_id: z.string().min(1, 'song_id is required.') })), setFavourite);
router.post('/download', validateBody(z.object({ song_id: z.string().min(1, 'song_id is required.') })), setDownloaded);
router.get('/next-song', getNextSong);
router.post('/', validateBody(z.object({ artist_id: z.string(), page: z.string().optional(), limit: z.string().optional() })), getMySongs);


export default router;