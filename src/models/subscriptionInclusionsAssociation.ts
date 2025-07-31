import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
    
const SubscriptionInclusionsAssociation = sequelize.define(
    "SubscriptionInclusionsAssociation",
    {

        association_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        inclusion_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    }
    ,
    {
        tableName: "subscription_inclusions_association",
        timestamps: true,
    }
);

export { SubscriptionInclusionsAssociation };