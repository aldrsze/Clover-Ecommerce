require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

async function migrate() {
  try {
    await pool.query('ALTER TABLE customers ADD COLUMN address text;');
    console.log('Migration successful: Added address column to customers table.');
  } catch (err) {
    if (err.code === '42701') {
      console.log('Column already exists.');
    } else {
      console.error('Migration failed:', err);
    }
  } finally {
    await pool.end();
  }
}

migrate();
