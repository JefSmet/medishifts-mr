const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelizeBesco = new Sequelize({
  dialect: process.env.BESCO_DB_DIALECT,
  database: process.env.BESCO_DB_NAME,
  username: process.env.BESCO_DB_USER,
  password: process.env.BESCO_DB_PASS,
  host: process.env.BESCO_DB_HOST,
  port: process.env.BESCO_DB_PORT,
  timezone: '+02:00',
});

module.exports = sequelizeBesco;
