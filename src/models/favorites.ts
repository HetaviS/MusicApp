import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const favorites = sequelize.define('favorites', {
    favorite_id: {
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
    tableName: 'favorites',
    timestamps: true,
});

export { favorites };