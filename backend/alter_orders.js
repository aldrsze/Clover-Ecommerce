require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

async function alterTable() {
  try {
    await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_name VARCHAR(255);`);
    await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_phone VARCHAR(50);`);
    console.log('Successfully added shipping_name and shipping_phone to orders table.');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    await pool.end();
  }
}

alterTable();
