import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const favoriteAlbums = sequelize.define('favoriteAlbums', {
    favorite_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    album_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'favoriteAlbums',
    timestamps: true,
});

export { favoriteAlbums };