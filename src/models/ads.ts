import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { config } from '../config';

const Ads = sequelize.define('Ads', {
    ad_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    type: {type: DataTypes.ENUM('banner', 'video'), allowNull: false },
    banner: {
        type: DataTypes.STRING, allowNull: true, get() {
            if (this.getDataValue('banner')) return config.clientUrl + this.getDataValue('banner');
            else return '';
     } },
    video: {
        type: DataTypes.STRING, allowNull: true, get() {
            if (this.getDataValue('video')) return config.clientUrl + this.getDataValue('video');
            else return '';
        }
    },
    audio: {
        type: DataTypes.STRING, allowNull: true, get() {
            if (this.getDataValue('audio')) return config.clientUrl + this.getDataValue('audio');
            else return '';
        }
    },
    description: { type: DataTypes.STRING, allowNull: true },
    link: { type: DataTypes.STRING, allowNull: true },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    position: { type: DataTypes.ENUM('top', 'middle', 'bottom', 'in-song'), allowNull: false },
    placement: { type: DataTypes.ENUM('home', 'album', 'home-album', 'in-song'), allowNull: false },
    duration_in_sec: { type: DataTypes.INTEGER, allowNull: false },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    has_expired: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_visible: { type: DataTypes.BOOLEAN, defaultValue: true },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    album_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: [],
    },
}, {
    tableName: 'ads',
    timestamps: true,
});

export { Ads };