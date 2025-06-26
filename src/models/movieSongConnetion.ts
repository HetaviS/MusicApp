import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const MovieSongConnection = sequelize.define('MovieSongConnection', {
    movie_song_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    song_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'movie_song_connections',
    timestamps: true,
});

export { MovieSongConnection };