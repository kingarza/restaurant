// connect to PostgreSQL
const { Pool } = require("pg");
const dotenv = require("dotenv");

// Init dotenv
dotenv.config();

let db_settings = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new Pool(db_settings);

async function plates() {
  let query = `SELECT * FROM plates ORDER BY id`;
  let data = await pool.query(query);
  return data.rows;
}

async function random_plate() {
  let query = `
    SELECT *
    FROM plates
    OFFSET RANDOM() * (SELECT COUNT(*) FROM plates)
    LIMIT 1
  `;
  let data = await pool.query(query);
  return data.rows;
}

async function plate(filter_fields) {
  let { id } = filter_fields;
  let query = `
    SELECT *
    FROM plates
    WHERE id = $1
  `;
  let data = await pool.query(query, [id]);
  return data.rows;
}

module.exports = {
  plates,
  random_plate,
  plate,
};
