
import { Sequelize } from 'sequelize';
import { config } from '.';

export const sequelize = new Sequelize('music_app', config.db_username, config.db_password, {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false,
});

// Test connection and sync models
export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');

    // Import models to ensure they're registered
    await import('../models');

    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ alter: true});
    console.log('✅ Database synchronized successfully.');
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err);
  }
};