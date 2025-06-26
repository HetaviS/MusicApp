import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Favourites = sequelize.define('Favourites', {
    favourite_id: {
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
    tableName: 'favourites',
    timestamps: true,
});

export { Favourites };