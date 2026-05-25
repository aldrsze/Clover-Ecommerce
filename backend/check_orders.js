require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

async function check() {
  try {
    const orders = await pool.query('SELECT * FROM orders');
    console.log('Orders:', orders.rows);

    const orderIds = orders.rows.map(o => o.order_id);
    
    if (orderIds.length > 0) {
      const items = await pool.query(`SELECT * FROM order_items WHERE order_id = ANY($1)`, [orderIds]);
      console.log('Order Items:', items.rows);
      
      const itemsJoin = await pool.query(`
        SELECT oi.*, p.name, p.image_path, p.category, p.description 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ANY($1)
      `, [orderIds]);
      console.log('Order Items Joined:', itemsJoin.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
