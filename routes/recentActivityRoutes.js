const express = require('express');
const router = express.Router();
const { getRecentActivities } = require('../controllers/recentActivityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecentActivities);

module.exports = router; 