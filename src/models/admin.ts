// src/models/user.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Admin = sequelize.define('Admin', {
    admin_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    last_name: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    profile_pic: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    dob: { type: DataTypes.STRING },
}, {
    tableName: 'admin',
    timestamps: true,
});

export { Admin };