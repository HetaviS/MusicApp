import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Album = sequelize.define('Album', {
    album_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false, defaultValue: "" }, // Fixed typo: descrption -> description
    thumbnail: { type: DataTypes.STRING, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: true },
    is_private: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    user_id: { // Add user_id field for the foreign key
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'albums',
    timestamps: true,
});

export { Album };