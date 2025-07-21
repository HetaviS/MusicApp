import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { config } from '../config';

const Ads = sequelize.define('Ads', {
    ad_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    type: {type: DataTypes.ENUM('banner', 'video'), allowNull: false },
    banner: { type: DataTypes.STRING, allowNull: false, get() { return config.clientUrl + this.getDataValue('path'); } },
    video: { type: DataTypes.STRING, allowNull: true, get() { return config.clientUrl + this.getDataValue('path'); } },
    description: { type: DataTypes.STRING, allowNull: true },
    link: { type: DataTypes.STRING, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    position: { type: DataTypes.ENUM('home', 'album'), allowNull: false },
    placement: { type: DataTypes.ENUM('top', 'middle', 'bottom'), allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
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