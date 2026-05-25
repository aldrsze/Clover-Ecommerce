const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Admin routes to manage contact messages
router.get('/', contactController.getMessages);
router.delete('/:id', contactController.deleteMessage);

module.exports = router;
