import { response_service, singer_service, song_service } from "../services/index.service";
import { getAudioDuration } from "../utils/audioDuration";
import removeExtraFields from "../services/common/removeExtraFields.service";
import { Request, Response } from 'express';
import { logger } from "../utils";
import { config } from "../config";

async function getSong(req: Request, res: Response) {
    try {
        const song = await song_service.getSong(parseInt(req.params.song_id));
        if (!song) return response_service.notFoundResponse(res, 'Song not found.');
        const is_favourite = await song_service.isFavourite(parseInt(req.params.song_id), req.user?.user_id);
        return response_service.successResponse(res, 'Song fetched successfully.', { ...song, is_favourite });
    } catch (err: any) {
        logger.error('Error fetching song:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function setFavourite(req: Request, res: Response) {
    try {
        const user = req.user;
        const songId = parseInt(req.params.song_id);
        const song = await song_service.getSong(songId);
        if (!song) return response_service.notFoundResponse(res, 'Song not found.');
        const isFavourite = await song_service.setFavourite(user.user_id, songId);
        return response_service.successResponse(res, `Song marked as favourite: ${isFavourite}.`);
    } catch (err: any) {
        logger.error('Error setting favourite:', err);
        console.log('object', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function setDownloaded(req: Request, res: Response) {
    try {
        const user = req.user;
        const songId = parseInt(req.params.song_id);
        const song = await song_service.getSong(songId);
        if (!song) return response_service.notFoundResponse(res, 'Song not found.');
        const isDownloaded = await song_service.setDownloaded(user.user_id, songId);
        return response_service.successResponse(res, `Song marked as downloaded: ${isDownloaded}.`);

    } catch (err: any) {
        logger.error('Error setting downloaded:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function getMySongs(req: Request, res: Response) {
    try {
        const user = req.user;
        if (!user.is_singer) return response_service.badRequestResponse(res, 'You are not an artist.');
        const songs = await singer_service.mySongs(user.user_id);
        if (songs) {
            return response_service.successResponse(res, 'Songs fetched successfully.', songs);
        }
        return response_service.badRequestResponse(res, 'Failed to fetch songs.');
    } catch (err: any) {
        logger.error('Error fetching songs:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function createMusic(req: Request, res: Response) {
    try {
        const user = req.user;
        if (!user.is_singer) return response_service.badRequestResponse(res, 'You are not an artist.');
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        if (!files || !files['thumbnail'] || !files['audio']) return response_service.badRequestResponse(res, 'Audio and thumbnail are required.');
        const audio = files['audio'][0];
        const duration = await getAudioDuration(audio?.path as string);
        const thumbnail = files['thumbnail'][0];
        if (!audio || !thumbnail) return response_service.badRequestResponse(res, 'Audio and thumbnail are required.');
        let song = await singer_service.addSong({ category_id: req.body.category_id, genre_id: req.body.genre_id, audio: audio.path, thumbnail: thumbnail.path, title: req.body.title, duration: (duration).toString() });
        if (song) {
            await singer_service.addSongToArtist(parseInt(song.song_id), user.user_id);
            song = await song_service.getSong(parseInt(song.song_id));
            return response_service.successResponse(res, 'Music added successfully.', removeExtraFields(song, ['genre_id']));
        }
        return response_service.badRequestResponse(res, 'Failed to add song.');
    } catch (err: any) {
        logger.error('Error adding song:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function updateSong(req: Request, res: Response) {
    try {
        const user = req.user;
        if (!user.is_singer) return response_service.badRequestResponse(res, 'You are not an artist.');
        const songId = parseInt(req.params.song_id);
        const song = await song_service.getSong(songId);
        if (!song) return response_service.notFoundResponse(res, 'Song not found.');
        if (song.artists?.[0]?.user_id !== user.user_id) return response_service.forbiddenResponse(res, 'You are not the owner of this song.');

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        let updatedData: any = { ...req.body };


        if (files && files['audio']) {
            updatedData.audio = files['audio'][0].path;
            const duration = await getAudioDuration(updatedData.audio);
            updatedData.duration = duration.toString();
            if (song.audio) {
                require('fs').unlink(song.audio.replace(config.clientUrl, ''), (err: any) => {
                    if (err) logger.error('Error deleting old song audio:', err);
                });
            }
        }

        if (files && files['thumbnail']) {
            updatedData.thumbnail = files['thumbnail'][0].path;
            if (song.thumbnail) {
                require('fs').unlink(song.thumbnail.replace(config.clientUrl, ''), (err: any) => {
                    if (err) logger.error('Error deleting old song thumbnail:', err);
                });
            }
        }

        const updatedSong = await song_service.updateSong(songId, updatedData);
        if (updatedSong) {
            return response_service.successResponse(res, 'Song updated successfully.', updatedSong);
        }
        return response_service.badRequestResponse(res, 'Failed to update song.');
    } catch (err: any) {
        logger.error('Error updating song:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function getNextSong(req: Request, res: Response) {
    try {
        const song_ids = await song_service.getTotalSongs();
        let song_id = song_ids[Math.floor(Math.random() * song_ids.length)];
        const song = await song_service.getSong(parseInt(song_id));
        if (!song) return response_service.notFoundResponse(res, 'Song not found.');
        const is_favourite = await song_service.isFavourite(parseInt(song_id), req.user?.user_id);
        return response_service.successResponse(res, 'Song fetched successfully.', { ...song, is_favourite });
    } catch (err: any) {
        logger.error('Error fetching next song:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}


export { getSong, setFavourite, setDownloaded, getMySongs, createMusic, updateSong, getNextSong };