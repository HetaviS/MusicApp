// src/models/user.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { config } from '../config';

const Avatar = sequelize.define('Avatar', {
    avatar_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    path: { type: DataTypes.STRING, allowNull: false, get() { return config.clientUrl + this.getDataValue('path'); } },
    name: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'avatar',
    timestamps: true,
});

export { Avatar };