const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER_DB,
  host: process.env.HOST_DB,
  database: process.env.DATABASE,
  password: process.env.DB_PASS,
  port: process.env.port,
  ssl: true,
});

module.exports = pool;
