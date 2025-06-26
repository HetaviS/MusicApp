import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const AlbumSongs = sequelize.define('AlbumSong', {
    album_song_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    album_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    song_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'album_songs',
    timestamps: true,
});

export { AlbumSongs };