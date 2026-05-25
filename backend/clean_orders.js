require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

async function clean() {
  try {
    // Delete orders that have order_items with null product_id (these are the broken ones)
    await pool.query(`DELETE FROM orders WHERE order_id IN (SELECT order_id FROM order_items WHERE product_id IS NULL)`);
    console.log('Cleaned up broken orders.');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

clean();
