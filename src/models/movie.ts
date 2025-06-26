import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { config } from '../config';

const Movie = sequelize.define('Movie', {
    album_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false, defaultValue: "" }, // Fixed typo: descrption -> description
    thumbnail: { type: DataTypes.STRING, allowNull: false,
        get: function () {
            // Assuming config.clientUrl is defined in your configuration
            return this.getDataValue('thumbnail') ? config.clientUrl + this.getDataValue('thumbnail') : "";
        }
     },
    genre: { type: DataTypes.STRING, allowNull: true },
}, {
    tableName: 'movies',
    timestamps: true,
});

export { Movie };