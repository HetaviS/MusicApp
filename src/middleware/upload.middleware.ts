import { logger } from '../utils';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

// === STORAGE CONFIG ===

const storage = multer.diskStorage({
    destination: (req, file, cb): void => {
        const fieldname = file.fieldname;
        switch (fieldname) {
            case 'album_thumbnail':
                cb(null, 'uploads/album_thumbnails/');
                break;
            case 'audio':
                cb(null, 'uploads/songs/');
                break;
            case 'thumbnail':
                cb(null, 'uploads/thumbnails/');
                break;
            case 'profile_pic':
                cb(null, 'uploads/profile_pics/');
                break;
            default:
                cb(null, 'uploads/anonymous/');
                break;
        }

    },
    filename: (req, file, cb): void => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const filename = `${Date.now()}-${baseName}${ext}`;
        cb(null, filename);
    }
});

// === FILE FILTER ===

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const fieldname = file.fieldname;
    let allowedAudioTypes;
    let allowedImageTypes;
    switch (fieldname) {
        case 'audio':
            allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
            if (allowedAudioTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid audio file type.'));
            }
            break;
        case 'thumbnail':
            allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (allowedImageTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid image file type.'));
            }
            break;
        case 'album_thumbnail':
            allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (allowedImageTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid image file type.'));
            }
            break;
        case 'profile_pic':
            allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (allowedImageTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid image file type.'));
            }
            break;
        default:
            cb(new Error('Unexpected file field.'));
            break;
    }
};

// === MULTER CONFIG ===

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB total
    }
});

// === MIDDLEWARE EXPORT ===

export const uploadDocs = (req: Request, res: Response, next: NextFunction) => {
    const uploadFields = upload.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'album_thumbnail', maxCount: 1 },
        { name: 'profile_pic', maxCount: 1 }
    ]);

    uploadFields(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            logger.error('Multer error:', err);
            return res.status(400).json({ error: 'Multer error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        // Optionally access file info:
        // console.log(req.files); // audio + thumbnail
        next();
    });
};
