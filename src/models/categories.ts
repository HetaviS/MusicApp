import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Categories = sequelize.define('Categories', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: { type: DataTypes.STRING },
}, {
    tableName: 'categories',
    timestamps: true,
});

export { Categories };