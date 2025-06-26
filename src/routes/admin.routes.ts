import { authenticate, authenticateAdmin } from "../middleware/auth.middleware";
import { Router } from "express";
import { validateBody } from "../middleware/zod.middleware";
import { adminLoginSchema, adminUpdateSchema } from "../zod/admin.auth.validator";
import { updateAdmin, verifyAdmin } from "../controllers/admin.auth.controller";
import { paginationSchema } from "../zod/pagenation.validator";
import z from 'zod';
import { getAllUsersList, getUsersCount, usersByLogin } from "../controllers/dashboard.controller";
import { addBlockSchema, updateBlockDataSchema, updateBlockSchema } from "../zod/home.validator";
import { addBlock, addDataToBlock, deleteBlock, removeDataFromBlock, updateBlock } from "../controllers/home.controller";
import { updateMusicSchema, uploadMusicSchema } from "../zod/song.validator";
import { createMusic, updateSong } from "../controllers/song.controller";
import { createArtist, deleteArtist, getArtists } from "../controllers/artist.auth.controller";
import { updateUserSchema } from "../zod/user.validator";
import { updateUser } from "../controllers/user.controller";
import { SigninSchema } from "../zod/auth.validator";
import { CreateGenreCategoryValidator } from "../zod/genre.category.validator";
import { createGenre, removeGenre } from "../controllers/genre.controller";
import { addOrRemoveSongsFromAlbumSchema, createAlbumSchema, updateAlbumSchema } from "../zod/album.validator";
import { addSongsToAlbum, createAlbum, getAllAlbums, removeSongsFromAlbum, updateAlbum } from "../controllers/album.controller";
const router = Router();


router.post('/login', validateBody(adminLoginSchema), verifyAdmin);

router.use(authenticateAdmin)

router.post('/update', validateBody(adminUpdateSchema), updateAdmin);
router.get('/count',validateBody(z.object({
    filter_by: z.enum(['day', 'week', 'month', 'year','total']),
    entity: z.enum(['users', 'artists', 'albums', 'songs'])
}))
  , getUsersCount);
router.get('/all-users',getAllUsersList)
router.get('/users-by-login', usersByLogin);

router.post('/add-block', validateBody(addBlockSchema), addBlock);
router.put('/update-block/:blockId', validateBody(updateBlockSchema), updateBlock);
router.put('/add-data-to-block/:blockId', validateBody(updateBlockDataSchema), addDataToBlock);
router.put('/remove-data-from-block/:blockId', validateBody(updateBlockDataSchema), removeDataFromBlock); // Assuming this is for updating data in a block
router.delete('/delete-block/:blockId', deleteBlock); // Assuming this is for deleting a block, you might want to change the controller function name


router.post('/upload-song', validateBody(uploadMusicSchema),authenticateAdmin, createMusic);
router.put('/update-song/:song_id', validateBody(updateMusicSchema),authenticateAdmin, updateSong);


router.post('/create-artist', validateBody(SigninSchema), createArtist);
router.put('/update-artist/:artist_id', validateBody(updateUserSchema), updateUser);
router.get('/get-all-artists', validateBody(paginationSchema), getArtists);
router.delete('/delete-artist/:artist_id', deleteArtist);



router.post('/create-genre', validateBody(CreateGenreCategoryValidator), createGenre);
router.delete('/delete-genre/:genre_id', removeGenre);



router.post('/create-album', validateBody(createAlbumSchema), createAlbum);
router.put('/update-album/:album_id', validateBody(updateAlbumSchema), updateAlbum);
router.put('/add-Songs-to-album/:album_id', validateBody(addOrRemoveSongsFromAlbumSchema), addSongsToAlbum);
router.put('/remove-Songs-from-album/:album_id', validateBody(addOrRemoveSongsFromAlbumSchema), removeSongsFromAlbum);
router.get('/get-all-albums', getAllAlbums);

export default router;