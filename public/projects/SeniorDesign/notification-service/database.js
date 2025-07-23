// Import sequelize
const Sequelize = require('sequelize');
const mysql = require('mysql2/promise');

user = process.env.MYSQL_USER;
password = process.env.MYSQL_PASSWORD;
host = process.env.DB_HOST;
port = 3306;

// Create the sequelize connection
function tryConnect(attempts) {
  try {
    const sequelize = new Sequelize(process.env.MYSQL_DATABASE, user, password, {
      dialect: 'mysql',
      host: host,
      logging: false,
    });

    return sequelize;
  } catch (error) {
    tryConnect(attempts - 1); //fix
  }
}

const sequelize = tryConnect(5);

// export the module
module.exports = sequelize;