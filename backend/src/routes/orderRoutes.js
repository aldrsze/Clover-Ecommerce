const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all order routes
router.use(authMiddleware);

// POST /api/orders - Create a new order
router.post('/', orderController.createOrder);

// GET /api/orders - Get user's orders
router.get('/', orderController.getUserOrders);

module.exports = router;
