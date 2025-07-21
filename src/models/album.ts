import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { config } from '../config';

const Album = sequelize.define('Album', {
    album_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false, defaultValue: "" }, // Fixed typo: descrption -> description
    thumbnail: { type: DataTypes.STRING, allowNull: true,
        get: function () {
            // Assuming config.clientUrl is defined in your configuration
            return this.getDataValue('thumbnail') ? config.clientUrl + this.getDataValue('thumbnail') : "";
        }
     },
    genre_id: { type: DataTypes.INTEGER, allowNull: true },
    is_private: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    user_id: { // Add user_id field for the foreign key
        type: DataTypes.INTEGER,
    allowNull: true,
    },
}, {
    tableName: 'albums',
    timestamps: true,
});

export { Album };