const mysql = require('mysql');

const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone: '+00:00',
  multipleStatements: true,
};

module.exports = mysql.createPool(options);
