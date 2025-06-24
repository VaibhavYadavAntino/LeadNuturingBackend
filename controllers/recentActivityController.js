const recentActivityService = require('../services/recentActivityService');

const getRecentActivities = async (req, res) => {
  try {
    const activities = await recentActivityService.getRecentActivities();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getRecentActivities }; 