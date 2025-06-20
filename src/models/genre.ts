import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Genre = sequelize.define('Genre', {
    genre_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: { type: DataTypes.STRING },
}, {
    tableName: 'genres',
    timestamps: true,
});

export { Genre };