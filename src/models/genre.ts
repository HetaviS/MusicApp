import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { config } from '../config';

const Genre = sequelize.define('Genre', {
    genre_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    background_img: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
        get() {
            if (this.getDataValue('background_img')) {
                return config.clientUrl + this.getDataValue('background_img');
            }
            else {
                return '';
            }
        }
    },
}, {
    tableName: 'genres',
    timestamps: true,
});

export { Genre };