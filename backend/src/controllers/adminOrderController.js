const db = require('../config/db');

const ALLOWED_STATUSES = new Set(['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']);

const normalizeOrder = (order) => ({
  ...order,
  item_count: Number(order.item_count || 0),
  total_quantity: Number(order.total_quantity || 0),
  total_amount: Number(order.total_amount || 0),
});

const getOrderItems = async (orderIds) => {
  if (!orderIds.length) {
    return [];
  }

  const itemsResult = await db.query(
    `SELECT
      oi.order_id,
      oi.order_item_id,
      oi.product_id,
      oi.quantity,
      oi.unit_price,
      p.name,
      p.description,
      p.category,
      p.image_path
    FROM order_items oi
    LEFT JOIN products p ON p.product_id = oi.product_id
    WHERE oi.order_id = ANY($1)
    ORDER BY oi.order_id DESC, oi.order_item_id ASC`,
    [orderIds],
  );

  return itemsResult.rows;
};

/**
 * Retrieve all orders for the admin dashboard.
 * @param {Object} _req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getOrders = async (_req, res) => {
  try {
    const ordersResult = await db.query(
      `SELECT
        o.order_id,
        o.customer_id,
        o.status,
        o.total_amount,
        o.shipping_address,
        o.created_at,
        c.first_name,
        c.last_name,
        c.email,
        c.phone_number,
        COUNT(oi.order_item_id) AS item_count,
        COALESCE(SUM(oi.quantity), 0) AS total_quantity
      FROM orders o
      LEFT JOIN customers c ON c.customer_id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.order_id
      GROUP BY o.order_id, c.customer_id, c.first_name, c.last_name, c.email, c.phone_number
      ORDER BY o.created_at DESC`,
    );

    const orders = ordersResult.rows.map(normalizeOrder);
    const items = await getOrderItems(orders.map((order) => order.order_id));

    const formattedOrders = orders.map((order) => ({
      ...order,
      items: items.filter((item) => item.order_id === order.order_id),
    }));

    res.status(200).json(formattedOrders);
  } catch (err) {
    console.error('Admin fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

/**
 * Retrieve a specific order by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({ error: 'Invalid order id.' });
    }

    const orderResult = await db.query(
      `SELECT
        o.order_id,
        o.customer_id,
        o.status,
        o.total_amount,
        o.shipping_address,
        o.created_at,
        c.first_name,
        c.last_name,
        c.email,
        c.phone_number,
        COUNT(oi.order_item_id) AS item_count,
        COALESCE(SUM(oi.quantity), 0) AS total_quantity
      FROM orders o
      LEFT JOIN customers c ON c.customer_id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.order_id
      WHERE o.order_id = $1
      GROUP BY o.order_id, c.customer_id, c.first_name, c.last_name, c.email, c.phone_number`,
      [orderId],
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = normalizeOrder(orderResult.rows[0]);
    const items = await getOrderItems([orderId]);

    res.status(200).json({
      ...order,
      items: items.filter((item) => item.order_id === orderId),
    });
  } catch (err) {
    console.error('Admin fetch order error:', err);
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
};

/**
 * Update the status or shipping address of an order.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.updateOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status, shippingAddress } = req.body;

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({ error: 'Invalid order id.' });
    }

    if (status && !ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({ error: 'Invalid order status.' });
    }

    const currentOrder = await db.query('SELECT order_id FROM orders WHERE order_id = $1', [orderId]);

    if (currentOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const updates = [];
    const values = [];

    if (status) {
      values.push(status);
      updates.push(`status = $${values.length}`);
    }

    if (shippingAddress !== undefined) {
      values.push(shippingAddress);
      updates.push(`shipping_address = $${values.length}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided.' });
    }

    values.push(orderId);

    const result = await db.query(
      `UPDATE orders SET ${updates.join(', ')} WHERE order_id = $${values.length} RETURNING order_id, status, shipping_address, total_amount, created_at`,
      values,
    );

    res.status(200).json({
      message: 'Order updated successfully.',
      order: normalizeOrder(result.rows[0]),
    });
  } catch (err) {
    console.error('Admin update order error:', err);
    res.status(500).json({ error: 'Failed to update order.' });
  }
};

/**
 * Delete an order by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.deleteOrder = async (req, res) => {
  const client = await db.connect();

  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({ error: 'Invalid order id.' });
    }

    await client.query('BEGIN');

    const orderResult = await client.query('SELECT order_id FROM orders WHERE order_id = $1', [orderId]);

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found.' });
    }

    await client.query('DELETE FROM order_items WHERE order_id = $1', [orderId]);
    await client.query('DELETE FROM orders WHERE order_id = $1', [orderId]);

    await client.query('COMMIT');
    res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Admin delete order error:', err);
    res.status(500).json({ error: 'Failed to delete order.' });
  } finally {
    client.release();
  }
};
