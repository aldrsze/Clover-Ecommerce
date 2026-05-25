const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public route to submit a contact message
router.post('/', contactController.submitMessage);

module.exports = router;
