import { Router } from 'express';
import auth_routes from './auth.routes';
import user_routes from './user.routes';
import album_routes from './album.routes';
import song_routes from './song.routes';
import genre_routes from './genre.routes';
import category_routes from './category.routes';
import admin_routes from './admin.routes';
import avatar_routes from './avatar.routes';
import { uploadDocs } from '../middleware/upload.middleware';

const router = Router();
router.use(uploadDocs)

router.use('/auth', auth_routes);
router.use('/user', user_routes);
router.use('/album', album_routes);
router.use('/song', song_routes);
router.use('/genre', genre_routes);
router.use('/category', category_routes);
router.use('/admin', admin_routes);
router.use('/avatar', avatar_routes);

export default router;
