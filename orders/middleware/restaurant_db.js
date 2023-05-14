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

async function orders_by_status(filter_fields) {
  let { status } = filter_fields;
  let query = `
    SELECT *
    FROM orders
    WHERE status = $1
    ORDER BY id
  `;
  let data = await pool.query(query, [status]);
  return data.rows;
}

async function create_order(filter_fields) {
  let { plate_id } = filter_fields;
  let query = `
    INSERT INTO orders (plate, status)
    VALUES ($1, 'in_progress');
  `;
  let data = await pool.query(query, [plate_id]);
  return data.rows;
}

async function update_order_status(filter_fields) {
  let { status, id } = filter_fields;
  let query = `
    UPDATE orders
    SET status = $1
    WHERE id = $2
  `;
  let data = await pool.query(query, [status, id]);
  return data.rows;
}

async function last_order_created() {
  let query = `
    SELECT *
    FROM orders
    ORDER BY id DESC
    LIMIT 1
  `;
  let data = await pool.query(query);
  return data.rows;
}

module.exports = {
  orders_by_status,
  create_order,
  update_order_status,
  last_order_created
};
