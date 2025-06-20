import { MusicSinger, Genre, Favourites } from "../models";
import { Song } from "../models";
import { ISong } from "../types";

async function addSongToArtist(songId: number, artistId: number) {
    try {
        const songSinger = await MusicSinger.create({ song_id: songId, user_id: artistId });
        if (songSinger) {
            return songSinger
        }
        return null
    } catch (err) {
        throw err;
    }
}

async function addSong(song: Partial<ISong>): Promise<ISong | null> {
    try {
        const newMusic = await Song.create(song);
        if (newMusic) return newMusic.toJSON() as ISong;
        return null
    }
    catch (err) {
        throw err;
    }
}

async function mySongs(artistId: number): Promise<ISong[] | null> {
    try {
        const songs = await MusicSinger.findAll({
            where: { user_id: artistId },
            include: [
                {
                    model: Song,
                    as: 'song',
                    include: [
                        {
                            model: Genre,
                            as: 'genre'
                        }
                    ]
                }
            ]
        });
        const flattenedSongs = await Promise.all(songs.map(async s => {
            const songData = s.get({ plain: true });
            const favourites_count = await Favourites.count({ where: { song_id: songData.song.song_id } });
            return { ...songData.song, favourites_count };
        }));

        if (songs) return flattenedSongs as ISong[];
        return null
    }
    catch (err) {
        throw err;
    }
}

async function isMySong(songId: number, singerId: number) {
    try {
        const song = await MusicSinger.findOne({ where: { song_id: songId, user_id: singerId } });
        if (song) return true;
        return false
    }
    catch (err) {
        throw err;
    }
}

export default {
    addSongToArtist,
    addSong,
    mySongs,
    isMySong,
}