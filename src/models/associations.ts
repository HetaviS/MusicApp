import { User } from '../models/user';
import { Song } from './song';
import { MusicSinger } from './musicSinger';
import { Album } from './album';
import { AlbumSongs } from './albumSong';
import { Genre } from './genre';
import { Favourites } from './favourites';
import { Downloads } from './downloads';
import { Categories } from './categories';
import { History } from './history';

// Define all associations here after all models are imported
export const setupAssociations = () => {
    // User has many Songs as an artist through MusicSinger
    User.hasMany(MusicSinger, {
        foreignKey: 'user_id',
        as: 'artistSongs',
    });

    // User has many Albums as creator
    User.hasMany(Album, {
        foreignKey: 'user_id',
        as: 'createdAlbums',
    });

    User.belongsTo(Song, {
        foreignKey: 'current_song_id',
        as: 'currentSong',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    });

    User.belongsTo(Album, {
        foreignKey: 'current_album_id',
        as: 'currentAlbum',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    });

    User.hasMany(Favourites, {
        foreignKey: 'user_id',
        as: 'favourites',
    });

    // Favourites.hasMany(User, {
    //     foreignKey: 'user_id',
    //     as: 'user',
    // });
    // Favourites.hasMany(Song, {
    //     foreignKey: 'song_id',
    //     as: 'song',
    // });

    User.hasMany(Downloads, {
        foreignKey: 'user_id',
        as: 'downloads',
    });

    Song.hasMany(Favourites, {
        foreignKey: 'song_id',
        as: 'downloadedBy',
    });

    Song.hasMany(Downloads, {
        foreignKey: 'song_id',
        as: 'favouriteBy',
    });
    // Song has many MusicSinger records (multiple artists per song)
    Song.hasMany(MusicSinger, {
        foreignKey: 'song_id',
        as: 'artists',
    });

    // Song has many AlbumSongs (can be in multiple albums)
    Song.hasMany(AlbumSongs, {
        foreignKey: 'song_id',
        as: 'albumAssociations',
    });

    // Song belongs to Genre
    Song.belongsTo(Genre, {
        foreignKey: 'genre_id',
        as: 'genre',
    });

    Song.belongsTo(Categories, {
        foreignKey: 'category_id',
        as: 'category',
    });

    // MusicSinger belongs to User (the artist)
    MusicSinger.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'singer',
    });

    // MusicSinger belongs to Song
    MusicSinger.belongsTo(Song, {
        foreignKey: 'song_id',
        as: 'song',
    });

    // Album belongs to User (creator)
    Album.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'creator',
    });

    // Album has many AlbumSongs
    Album.hasMany(AlbumSongs, {
        foreignKey: 'album_id',
        as: 'songs',
    });

    // AlbumSongs belongs to Album
    AlbumSongs.belongsTo(Album, {
        foreignKey: 'album_id',
        as: 'album',
    });

    // AlbumSongs belongs to Song
    AlbumSongs.belongsTo(Song, {
        foreignKey: 'song_id',
        as: 'song',
    });

    // Genre has many Songs
    Genre.hasMany(Song, {
        foreignKey: 'genre_id',
        as: 'songs',
    });

    Categories.hasMany(Song, {
        foreignKey: 'category_id',
        as: 'songs',
    });

    History.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
    });

    History.belongsTo(Song, {
        foreignKey: 'song_id',
        as: 'song',
    });
    History.belongsTo(Album, {
        foreignKey: 'album_id',
        as: 'album',
    });

    User.hasMany(History, {
        foreignKey: 'user_id',
        as: 'history',
    });
    Song.hasMany(History, {
        foreignKey: 'song_id',
        as: 'history',
    });
    Album.hasMany(History, {
        foreignKey: 'album_id',
        as: 'history',
    });

};