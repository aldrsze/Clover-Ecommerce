const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Register a new customer.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if customer already exists
    const existingCustomer = await db.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (existingCustomer.rows.length > 0) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new customer
    const newCustomer = await db.query(
      `INSERT INTO customers (first_name, last_name, email, password_hash) 
       VALUES ($1, $2, $3, $4) RETURNING customer_id, first_name, last_name, email, phone_number, address`,
      [firstName, lastName, email, passwordHash]
    );

    const user = newCustomer.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { customerId: user.customer_id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

/**
 * Login a customer.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check if customer exists
    const customer = await db.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (customer.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = customer.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { customerId: user.customer_id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        customer_id: user.customer_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

/**
 * Update the profile of the current customer.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.updateProfile = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const { firstName, lastName, phoneNumber, address } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required.' });
    }

    const updatedCustomer = await db.query(
      `UPDATE customers 
       SET first_name = $1, last_name = $2, phone_number = $3, address = $4 
       WHERE customer_id = $5 
       RETURNING customer_id, first_name, last_name, email, phone_number, address`,
      [firstName, lastName, phoneNumber, address, customerId]
    );

    if (updatedCustomer.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedCustomer.rows[0]
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error during profile update.' });
  }
};
