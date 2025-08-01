
// src/models/user.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { config } from '../config';

const User = sequelize.define('User', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    username: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    otp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    login_type: { type: DataTypes.ENUM('email', 'mobile','google','apple'), allowNull: false, defaultValue: "email" },
    profile_pic: {
        type: DataTypes.STRING,
        get: function () {
            if (this.getDataValue('profile_pic')) {
                return config.clientUrl + this.getDataValue('profile_pic');
            }
            else {
                return '';
            }
        },
        allowNull: false, defaultValue: ""
    },
    gender: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    dob: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    device_token: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    login_verification_status: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_singer: { type: DataTypes.BOOLEAN, defaultValue: false },
    current_song_time: { type: DataTypes.STRING, allowNull: true, defaultValue: "00:00" },
    current_song_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // defaultValue: ,
        references: {
            model: 'songs',
            key: 'song_id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    current_album_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // defaultValue: "",
        references: {
            model: 'albums',
            key: 'album_id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    mobile_number: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    country_code: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'users',
    timestamps: true,
});

export { User };
 