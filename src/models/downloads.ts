import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Downloads = sequelize.define('Downloads', {
    download_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
    },
    song_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
    },
}, {
    tableName: 'downloads',
    timestamps: true,
});

export { Downloads };