import { logger } from '../utils';
import { Song, favorites, Genre, Downloads, MusicSinger, MovieSongConnection, Movie, User, AlbumSongs } from '../models';
import { ISong } from '../types';
import { Op } from 'sequelize';

async function getSong(songId: number, include?: any): Promise<ISong | null> {
    try {
        const song = await Song.findOne({
            where: { song_id: songId },
            include});
        const favorite_count = await favorites.count({ where: { song_id: songId } });
        if (song) return { ...song.toJSON(), favorite_count } as ISong;
        return null;
    }
    catch (err) {
        throw err;
    }
}

async function setfavorite(userId: number, songId: number): Promise<boolean> {
    try {
        const favorite = await favorites.findOne({ where: { user_id: userId, song_id: songId } });
        if (favorite) {
            await favorites.destroy({ where: { user_id: userId, song_id: songId } });
            return false;
        }
        else {
            await favorites.create({ user_id: userId, song_id: songId });
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

async function isfavorite(userId: number, songId: number): Promise<boolean> {
    try {
        const favorite = await favorites.findOne({ where: { user_id: userId, song_id: songId } });
        return !!favorite;
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
        const songs = await Song.findAll({ attributes: ['song_id'] });
        return songs.map(song => (song as any).song_id.toString());
    } catch (err) {
        logger.error('Error counting songs:', err);
        throw err;
    }
}

async function getfavoriteSongs(userId: number, page: number = 1, limit: number = 10): Promise<any[]> {
    try {
        const offset = (page - 1) * limit;
        const songs = await favorites.findAll({
            where: { user_id: userId },
            limit,
            offset,
            include: [
                {
                    model: Song,
                    as: 'song',
                    include: [
                        {
                            model: Genre,
                            as: 'genre',
                            attributes: ['genre_id', 'name']
                        },
                        {
                            model: MusicSinger,
                            as: 'artists',
                            include: [
                                {
                                    model: User,
                                    as: 'singer',
                                    attributes: ['user_id', 'full_name', 'profile_pic'],
                                }
                            ],
                            attributes: ['music_singer_id']
                        },
                        {
                            model: MovieSongConnection,
                            as: 'movie',
                            include: [{
                                model: Movie,
                                as: 'movie_details',
                                attributes: ['movie_id', 'title', 'poster'] 
                            }],
                            attributes: ['movie_song_id']
                        }
                    ]
                }
            ]
        });
        return songs.map(song => song.get('song'));
    } catch (err) {
        throw err;
    }   
}

async function getAllSongs(
  albumId?: number,
  page: number = 1,
  limit: number = 10
): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
  try {
    const offset = (page - 1) * limit;

    // Exclude songs in the album, if albumId is provided
    let excludeSongIds: number[] = [];
    if (albumId) {
      const albumSongs = await AlbumSongs.findAll({
        where: { album_id: albumId },
        attributes: ['song_id']
      });
      excludeSongIds = albumSongs.map(song => song.get('song_id') as number);
    }

    const whereClause: any = {};
    if (excludeSongIds.length > 0) {
      whereClause.song_id = { [Op.notIn]: excludeSongIds };
    }

    const { count, rows } = await Song.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Genre,
          as: 'genre',
          attributes: ['genre_id', 'name']
        },
        {
          model: MusicSinger,
          as: 'artists',
          include: [
            {
              model: User,
              as: 'singer',
              attributes: ['user_id', 'full_name', 'profile_pic']
            }
          ],
          attributes: ['music_singer_id']
        },
        {
          model: MovieSongConnection,
          as: 'movie',
          include: [
            {
              model: Movie,
              as: 'movie_details',
              attributes: ['movie_id', 'title', 'poster']
            }
          ],
          attributes: ['movie_song_id']
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);
    const data = rows.map(song => song.toJSON());

    return {
      data,
      total: count,
      page,
      totalPages
    };
  } catch (err) {
    logger.error('Error fetching paginated songs:', err);
    throw err;
  }
}


export default { getSong, setfavorite, isfavorite, setDownloaded, updateSong, getTotalSongs, getfavoriteSongs, getAllSongs };