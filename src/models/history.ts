import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const History = sequelize.define('History', {
    history_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    song_id: {
        type: DataTypes.INTEGER,
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    album_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    song_time: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "00:00",
    },
}, {
    tableName: 'history',
    timestamps: true,
});

export { History };