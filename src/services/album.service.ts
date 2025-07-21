import { Album, AlbumSongs, favoriteAlbums, Song } from "../models";
import { IAlbum, ISong } from "../types";
import { Sequelize } from 'sequelize';
import { song_service } from "./index.service";

async function createAlbum(albumPayload: Partial<IAlbum>): Promise<IAlbum | null> {
    try {
        const album = await Album.create(albumPayload)
        return album.toJSON();
    }
    catch (err) {
        throw err;
    }
}

async function addSongsToAlbum(songIds: string[], albumId: string): Promise<ISong[] | null> {
    try {
        const albumSongs = await Promise.all(songIds.map((song_id: string) => AlbumSongs.create({ album_id: albumId, song_id: song_id })));
        return albumSongs.map(s => s.toJSON());
    }
    catch (err) {
        throw err;
    }
}

async function removeSongsFromAlbum(songIds: string[], albumId: string): Promise<number[] | null> {
    try {
        const albumSongs = await Promise.all(songIds.map(async (song_id: string) => await AlbumSongs.destroy({ where: { album_id: albumId, song_id: song_id } })));
        return albumSongs;
    }
    catch (err) {
        throw err;
    }
}

async function updateAlbum(albumPayload: Partial<IAlbum>, where: Partial<IAlbum>): Promise<IAlbum | null> {
    try {
        const album = await Album.update(albumPayload, { where: where, returning: true });
        if (album[1].length <= 0) return null;
        return album[1][0].toJSON();
    }
    catch (err) {
        throw err;
    }
}

async function getAlbum(where: Partial<IAlbum>, include?: any): Promise<IAlbum | null> {
    try {
        
        const album = await Album.findOne({
            where: where, include
        });
        if (!album) return null;
        return album.toJSON();
    }
    catch (err) {
        throw err;
    }
}

async function getAllAlbums(page: number = 1, pageSize: number = 10): Promise<IAlbum[]> {
    try {
        const offset = (page - 1) * pageSize;
        const albums = await Album.findAll({
            limit: pageSize,
            offset,
            attributes: {
                include: [
                    [Sequelize.fn('COUNT', Sequelize.col('songs.song_id')), 'song_count']
                ]
            },
            include: [
                {
                    model: AlbumSongs,
                    as: 'songs',
                    attributes: [], // Don't fetch song data, just use for count
                    required: false
                }
            ],
            group: ['Album.album_id'], // Only primary key here
            subQuery: false // Avoids subquery wrapping issue
        });


        return albums.map(album => album.toJSON());
    }
    catch (err) {
        throw err;
    }
}

async function getAlbumData(where: Partial<IAlbum>, user_id: number, include?: any): Promise<any[] | null> {
    try {
        const album = await AlbumSongs.findAll({ where, order: [['album_song_id', 'DESC']], include });
        if (!album || album.length === 0) return null;

        const songs = await Promise.all(album.map(async entry => {
            const rawEntry = entry.get({ plain: true });

            const song = rawEntry.song as ISong;
            if (!song) return null;

            const is_favorite = await song_service.isfavorite(user_id, parseInt(song.song_id));
            return { ...song, is_favorite };
        }));

        return songs.filter(song => song !== null);
    } catch (err) {
        throw err;
    }
}

async function isfavorite(userId: number, albumId: number): Promise<boolean> {
    try {
        const favorite = await favoriteAlbums.findOne({ where: { user_id: userId, album_id: albumId } });
        return !!favorite;
    } catch (err) {
        throw err;
    }

}


async function setfavorite(userId: number, albumId: number): Promise<boolean> {
    try {
        const favorite = await favoriteAlbums.findOne({ where: { user_id: userId, album_id: albumId } });
        if (favorite) {
            await favoriteAlbums.destroy({ where: { user_id: userId, album_id: albumId } });
            return false;
        }
        else {
            await favoriteAlbums.create({ user_id: userId, album_id: albumId });
            return true;
        }
    } catch (err) {
        throw err;
    }

}

async function getMyAlbums(userId: number): Promise<any[] | null> {
    try {
        let albums = await Album.findAll({
  where: { user_id: userId },
  attributes: ['album_id', 'title', 'thumbnail', 'description', 'is_private', 'createdAt', 'updatedAt'],
  include: [
    {
      model: AlbumSongs,
      as: 'songs',
      attributes: ['album_song_id'],
      separate: true, // ✅ ensures correct order per parent
      order: [['album_song_id', 'DESC']], // ✅ works now
      required: false,
      include: [
        {
          model: Song,
          as: 'song',
          attributes: ['song_id', 'thumbnail'],
        }
      ]
    }
  ],
  order: [['album_id', 'DESC']]
});

        albums = await Promise.all(albums.map(async album => {
            const rawAlbum = album.get({ plain: true });
            const songs_count = await AlbumSongs.count({ where: { album_id: rawAlbum.album_id } });
            return { ...rawAlbum, songs_count };
        }));
        // const songs_count = await AlbumSongs.count({ where: { album_id: albums.map(album => album.get({ plain: true }).album_id) } });
        if (!albums || albums.length === 0) return null;
        return  albums
        
    } catch (err) {
        throw err;
    }
}

async function getFavoriteAlbums(userId: number, page: number = 1, limit: number = 10): Promise<{ albums: any[]; total: number; page: number; limit: number; totalPages: number } | null> {
    try {
        const offset = (page - 1) * limit;
        let albums = await favoriteAlbums.findAll({ where: { user_id: userId }, attributes: ['album_id'], limit, offset });
        if (!albums || albums.length === 0) return null;
        const total = await favoriteAlbums.count({ where: { user_id: userId } });
        const albumIds = albums.map(album => album.get({ plain: true }).album_id);
        albums = await Album.findAll({ where: { album_id: albumIds }, attributes: ['album_id', 'title', 'thumbnail', 'description', 'is_private', 'createdAt', 'updatedAt'] });
        albums = albums.map(album => album.toJSON())
        return {
            albums,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    } catch (err) {
        throw err;
    }
}

async function deleteAlbum(albumId: number): Promise<number> {
    try {
        const result = await Album.destroy({ where: { album_id: albumId } });
        if (result === 0) return 0;
        AlbumSongs.destroy({ where: { album_id: albumId } });
        return 1;
    } catch (err) {
        throw err;
    }
}

export default { createAlbum, addSongsToAlbum, removeSongsFromAlbum, updateAlbum, getAlbum, getAlbumData, getAllAlbums, isfavorite, setfavorite, getMyAlbums, getFavoriteAlbums, deleteAlbum };