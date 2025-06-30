import { Album, AlbumSongs } from "../models";
import { IAlbum, ISong } from "../types";
import {Sequelize } from 'sequelize';

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

async function getAllAlbums(where: Partial<IAlbum> = {}, page: number = 1, pageSize: number = 10): Promise<IAlbum[]> {
    try {
        const offset = (page - 1) * pageSize;
        const albums = await Album.findAll({
            where: { ...where },
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


        return albums.map(album => album.toJSON() as IAlbum);
    }
    catch (err) {
        throw err;
    }
}

export default { createAlbum, addSongsToAlbum, removeSongsFromAlbum, updateAlbum, getAlbum ,getAllAlbums};