import { authenticateAdmin } from "../middleware/auth.middleware";
import { Router } from "express";
import { validateBody } from "../middleware/zod.middleware";
import { adminLoginSchema, adminUpdateSchema } from "../zod/admin.auth.validator";
import { updateAdmin, verifyAdmin } from "../controllers/admin.auth.controller";
import { paginationSchema } from "../zod/pagenation.validator";
import z from 'zod';
import { getAllUsersList, getCount, usersByLogin } from "../controllers/dashboard.controller";
import { addBlockSchema, updateBlockDataSchema, updateBlockSchema } from "../zod/home.validator";
import { createBlock, addDataToBlock, deleteBlock, removeDataFromBlock, updateBlock } from "../controllers/home.controller";
import { updateMusicSchema, uploadMusicSchema } from "../zod/song.validator";
import { createMusic, updateSong } from "../controllers/song.controller";
import { createArtist, deleteArtist, getArtists, updateArtist } from "../controllers/artist.auth.controller";
import { updateUserSchema } from "../zod/user.validator";
import { SigninSchema } from "../zod/auth.validator";
import { CreateGenreSchema, updateGenreSchema } from "../zod/genre.category.validator";
import { createGenre, removeGenre, updateGenre } from "../controllers/genre.controller";
import { addOrRemoveSongsFromAlbumSchema, createAlbumSchema, updateAlbumSchema } from "../zod/album.validator";
import { addSongsToAlbum, createAlbum, getAllAlbums, removeSongsFromAlbum, updateAlbum } from "../controllers/album.controller";
import { addSongsToMovie, createMovie, deleteMovie, removeSongsFromMovie, updateMovie } from "../controllers/movie.controller";
import { addOrRemoveSongsFromMovieSchema, createMovieSchema, updateMovieSchema } from "../zod/movie.validator";

const router = Router();

router.post('/login', validateBody(adminLoginSchema), verifyAdmin);

router.use(authenticateAdmin)

router.post('/update', validateBody(adminUpdateSchema), updateAdmin);
router.post('/count', validateBody(z.object({
  filter_by: z.enum(['day', 'week', 'month', 'year', 'total']),
  entity: z.enum(['users', 'artists', 'albums', 'songs', 'movies'])
}))
  , getCount);
router.post('/all-users', getAllUsersList)
router.get('/users-by-login', usersByLogin);


router.post('/create-block', validateBody(addBlockSchema), createBlock);
router.post('/update-block', validateBody(updateBlockSchema), updateBlock);
router.post('/add-data-to-block', validateBody(updateBlockDataSchema), addDataToBlock);
router.post('/remove-data-from-block', validateBody(updateBlockDataSchema), removeDataFromBlock); // Assuming this is for updating data in a block
router.post('/delete-block', deleteBlock); // Assuming this is for deleting a block, you might want to change the controller function name

router.post('/upload-song', validateBody(uploadMusicSchema), createMusic);
router.post('/update-song', validateBody(updateMusicSchema), updateSong);


router.post('/create-artist', validateBody(SigninSchema), createArtist);
router.post('/update-artist', validateBody(updateUserSchema), updateArtist);
router.post('/get-all-artists', validateBody(paginationSchema), getArtists);
router.post('/delete-artist', validateBody(z.object({ user_id: z.string().min(1, 'user_id is required.') })), deleteArtist);


router.post('/create-genre', validateBody(CreateGenreSchema), createGenre);
router.post('/update-genre', validateBody(updateGenreSchema), updateGenre);
router.post('/delete-genre', validateBody(z.object({ genre_id: z.string().min(1, 'genre_id is required.') })), removeGenre);


router.post('/create-album', validateBody(createAlbumSchema), createAlbum);
router.post('/update-album', validateBody(updateAlbumSchema), updateAlbum);
router.post('/add-Songs-to-album', validateBody(addOrRemoveSongsFromAlbumSchema), addSongsToAlbum);
router.post('/remove-Songs-from-album', validateBody(addOrRemoveSongsFromAlbumSchema), removeSongsFromAlbum);
router.post('/get-all-albums', getAllAlbums);


router.post('/create-movie', validateBody(createMovieSchema), createMovie);
router.post('/update-movie', validateBody(updateMovieSchema), updateMovie);
router.post('/delete-movie', deleteMovie);
router.post('/add-songs-to-movie', validateBody(addOrRemoveSongsFromMovieSchema), addSongsToMovie);
router.post('/remove-songs-from-movie', validateBody(addOrRemoveSongsFromMovieSchema), removeSongsFromMovie);

export default router;