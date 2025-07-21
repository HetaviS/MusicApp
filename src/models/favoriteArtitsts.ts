import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const favoriteArtists = sequelize.define('favoriteArtists', {
    favorite_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    artist_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'favoriteArtists',
    timestamps: true,
});

export { favoriteArtists };