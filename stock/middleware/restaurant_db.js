// connect to PostgreSQL
const { Pool } = require("pg");
const dotenv = require('dotenv');

// Init dotenv
dotenv.config();

let db_settings = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
};

const pool = new Pool(db_settings);

async function stock() {
  let query = `SELECT * FROM stock ORDER BY id`;
  let data = await pool.query(query);
  return data.rows;
}

async function update_stock(filter_fields) {
  const { ingredient, qty } = filter_fields;
  let query = `
    UPDATE stock
    SET quantity = quantity + $1
    WHERE ingredient = $2
  `;
  let data = await pool.query(query, [qty, ingredient]);
  return data.rows;
}

module.exports = {
  stock,
  update_stock
};
