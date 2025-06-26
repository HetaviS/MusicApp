import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Genre = sequelize.define('Genre', {
    genre_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: { type: DataTypes.STRING },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    tableName: 'genres',
    timestamps: true,
});

export { Genre };