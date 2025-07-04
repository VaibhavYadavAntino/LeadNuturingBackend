const express = require('express');
const router = express.Router();
const { handleUltraMsgWebhook } = require('../controllers/webhookController');

router.post('/ultramsg', handleUltraMsgWebhook);

module.exports = router; 