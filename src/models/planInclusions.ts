import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const PlanInclusions = sequelize.define(
  "PlanInclusions",
  {
    inclusion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: { type: DataTypes.STRING, allowNull: false },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "plan_inclusions",
    timestamps: true,
  }
);

export { PlanInclusions };