// src/api/db/DBConnection.js
const mariadb = require('mariadb');

let pool = null;

function getDatabaseConnection() {
  if (pool === null) {
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      charset: process.env.DB_CHARSET
    });
  }
  return pool;
}

async function query(query, params = '') {
  const pool = getDatabaseConnection();
  return pool.query(query, params).catch(err => {
    console.log(err);
    throw err;
  });
}

function close() {
  if (pool) {
    pool.end();
    pool = null;
  }
}

module.exports = {
  getDatabaseConnection,
  query,
  close
};