import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelizeBesco = new Sequelize(
  process.env.BESCO_DB_NAME,
  process.env.BESCO_DB_USER,
  process.env.BESCO_DB_PASS,
  {
    host: process.env.BESCO_DB_HOST,
    dialect: process.env.BESCO_DB_DIALECT,
    port: process.env.BESCO_DB_PORT,
    timezone: '+02:00',
    dialect: 'mssql',
  },
);

export default sequelizeBesco;
