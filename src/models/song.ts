import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { config } from '../config';

const Song = sequelize.define('song', {
    song_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    audio: {
        type: DataTypes.STRING, allowNull: false, get: function () {
            return config.clientUrl + this.getDataValue('audio');
        }
    },
    thumbnail: {
        type: DataTypes.STRING, allowNull: false, get: function () {
            return config.clientUrl + this.getDataValue('thumbnail');
        }
    },
    genre_id: {
        type: DataTypes.INTEGER,

    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories', // Assuming you have a categories table
            key: 'category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    duration: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'songs',
    timestamps: true,
});

export { Song };