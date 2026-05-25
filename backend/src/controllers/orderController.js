const db = require('../config/db');

// POST /api/orders
exports.createOrder = async (req, res) => {
  const client = await db.connect();
  
  try {
    const customerId = req.user.customerId;
    const { cartItems, shippingAddress, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    await client.query('BEGIN'); // Start transaction

    // 1. Insert into orders table
    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, total_amount, shipping_address, status) 
       VALUES ($1, $2, $3, $4) RETURNING order_id, created_at`,
      [customerId, totalAmount, shippingAddress, 'Pending']
    );
    
    const newOrderId = orderResult.rows[0].order_id;

    // 2. Insert into order_items table
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
         VALUES ($1, $2, $3, $4)`,
        [newOrderId, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT'); // End transaction

    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId: newOrderId 
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to process order.' });
  } finally {
    client.release();
  }
};

// GET /api/orders
exports.getUserOrders = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    
    // Fetch all orders for this customer
    const ordersResult = await db.query(
      `SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC`,
      [customerId]
    );

    const orders = ordersResult.rows;

    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    // For each order, fetch its items
    const orderIds = orders.map(o => o.order_id);
    const itemsResult = await db.query(
      `SELECT oi.*, p.name, p.image_path, p.category, p.description 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ANY($1)`,
      [orderIds]
    );

    // Attach items to their respective orders
    const items = itemsResult.rows;
    const formattedOrders = orders.map(order => ({
      ...order,
      items: items.filter(item => item.order_id === order.order_id)
    }));

    res.status(200).json(formattedOrders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};
