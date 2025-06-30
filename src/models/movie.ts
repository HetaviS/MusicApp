import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { config } from '../config';

const Movie = sequelize.define('Movie', {
    movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING(1000), allowNull: false, defaultValue: "" }, // Fixed typo: descrption -> description
    poster: {
        type: DataTypes.STRING, allowNull: false,
        get: function () {
            // Assuming config.clientUrl is defined in your configuration
            return this.getDataValue('poster') ? config.clientUrl + this.getDataValue('poster') : "";
        }
    },
    genre: { type: DataTypes.STRING, allowNull: true },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    tableName: 'movies',
    timestamps: true,
});

export { Movie };