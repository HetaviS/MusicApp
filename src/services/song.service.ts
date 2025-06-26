import { logger } from '../utils';
import { Song, Favourites, Genre, Downloads, User, MusicSinger } from '../models';
import { ISong } from '../types';

async function getSong(songId: number): Promise<ISong | null> {
    try {
        const song = await Song.findOne({
            where: { song_id: songId },
            include: [{ model: Genre, as: 'genre' },
            {
                model: MusicSinger,
                as: 'artists',
            }

            ]
        });
        const favourite_count = await Favourites.count({ where: { song_id: songId } });
        if (song) return { ...song.toJSON(), favourite_count } as ISong;
        return null;
    }
    catch (err) {
        throw err;
    }
}

async function setFavourite(userId: number, songId: number): Promise<boolean> {
    try {
        const favourite = await Favourites.findOne({ where: { user_id: userId, song_id: songId } });
        if (favourite) {
            await Favourites.destroy({ where: { user_id: userId, song_id: songId } });
            return false;
        }
        else {
            await Favourites.create({ user_id: userId, song_id: songId });
            return true;
        }
    } catch (err) {
        throw err;
    }
}

async function setDownloaded(userId: number, songId: number): Promise<boolean> {
    try {
        const download = await Downloads.findOne({ where: { user_id: userId, song_id: songId } });
        if (download) {
            await Downloads.destroy({ where: { user_id: userId, song_id: songId } });
            return false;
        }
        else {
            await Downloads.create({ user_id: userId, song_id: songId });
            return true;
        }
    } catch (err) {
        throw err;
    }
}

async function isFavourite(userId: number, songId: number): Promise<boolean> {
    try {
        const favourite = await Favourites.findOne({ where: { user_id: userId, song_id: songId } });
        return !!favourite;
    } catch (err) {
        throw err;
    }
}

async function updateSong(songId: number, data: any) {
    try {
        const song = await Song.update(data, {
            where:
                { song_id: songId }, returning: true
        });
        if (song[1].length <= 0) return null;
        return song[1][0].toJSON() as ISong;
    } catch (err) {
        logger.error(err);
        throw err;
    }

}

async function getTotalSongs(): Promise<string[]> {
    try {
        const songs = await Song.findAll();
        return songs.map(song => (song as any).song_id.toString());
    } catch (err) {
        logger.error('Error counting songs:', err);
        throw err;
    }
}

export default { getSong, setFavourite, isFavourite, setDownloaded, updateSong, getTotalSongs };