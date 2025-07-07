import { authenticate } from "../middleware/auth.middleware";
import { getUser, updateCurrentsong, updateSongTime, updateUser, userHistory, validateUsername } from "../controllers/user.controller";
import { Router } from "express";
import { validateBody } from "../middleware/zod.middleware";
import { updateCurrentSongSchema, updateUserSchema, updateSongTimeSchema, validateUsernameSchema } from "../zod/user.validator";

const router = Router();

router.post('/validate-username', validateBody(validateUsernameSchema), validateUsername); // Uncomment if you have a song time update controller
router.use(authenticate)
router.get('/profile', getUser);
router.post('/update', validateBody(updateUserSchema), updateUser);
router.post('/update-current-song', validateBody(updateCurrentSongSchema), updateCurrentsong);
router.get('/history', userHistory); // Uncomment if you have a history controller
router.post('/update-song-time', validateBody(updateSongTimeSchema), updateSongTime); // Uncomment if you have a song time update controller

export default router;