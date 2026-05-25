const db = require('../config/db');

exports.getCustomers = async (_req, res) => {
  try {
    const result = await db.query(`
      SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        c.email,
        c.phone_number,
        c.created_at,
        COUNT(o.order_id)::int AS order_count,
        COALESCE(SUM(o.total_amount), 0)::numeric(10, 2) AS total_spent,
        MAX(o.created_at) AS last_order_at
      FROM customers c
      LEFT JOIN orders o ON o.customer_id = c.customer_id
      GROUP BY c.customer_id
      ORDER BY c.created_at DESC
    `);

    res.status(200).json(
      result.rows.map((row) => ({
        ...row,
        total_spent: Number(row.total_spent || 0),
      })),
    );
  } catch (err) {
    console.error('Fetch customers error:', err);
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    const { firstName, lastName, email, phoneNumber } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Valid customer ID is required.' });
    }

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required.' });
    }

    const duplicateEmail = await db.query(
      'SELECT customer_id FROM customers WHERE email = $1 AND customer_id <> $2',
      [email, customerId],
    );

    if (duplicateEmail.rows.length > 0) {
      return res.status(409).json({ error: 'That email is already in use.' });
    }

    const updatedCustomer = await db.query(
      `UPDATE customers
       SET first_name = $1,
           last_name = $2,
           email = $3,
           phone_number = $4
       WHERE customer_id = $5
       RETURNING customer_id, first_name, last_name, email, phone_number, created_at`,
      [firstName, lastName, email, phoneNumber || null, customerId],
    );

    if (updatedCustomer.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.status(200).json({
      message: 'Customer updated successfully.',
      customer: updatedCustomer.rows[0],
    });
  } catch (err) {
    console.error('Update customer error:', err);
    res.status(500).json({ error: 'Failed to update customer.' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.id);

    if (!customerId) {
      return res.status(400).json({ error: 'Valid customer ID is required.' });
    }

    const deletedCustomer = await db.query(
      'DELETE FROM customers WHERE customer_id = $1 RETURNING customer_id',
      [customerId],
    );

    if (deletedCustomer.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.status(200).json({
      message: 'Customer deleted successfully.',
      customerId,
    });
  } catch (err) {
    console.error('Delete customer error:', err);
    res.status(500).json({ error: 'Failed to delete customer.' });
  }
};