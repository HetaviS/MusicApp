import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const MusicSinger = sequelize.define('MusicSinger', {
    music_singer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    song_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'music_singers',
    timestamps: true,
});

export { MusicSinger };