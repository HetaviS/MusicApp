import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const SunscriptionPlans = sequelize.define(
  "SunscriptionPlans",
  {
    plan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    duration: { type: DataTypes.ENUM('month', 'year') },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
},
  {
    tableName: "subscription_plans",
    timestamps: true,
  }
);

export { SunscriptionPlans };