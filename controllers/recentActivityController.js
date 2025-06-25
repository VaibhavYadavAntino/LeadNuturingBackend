const recentActivityService = require('../services/recentActivityService');

const getRecentActivities = async (req, res) => {
  try {
    const activities = await recentActivityService.getRecentActivities();
    // Only return required fields
    const result = activities.map(activity => ({
      leadName: activity.lead && activity.lead.name,
      channel: activity.channel,
      timestamp: activity.timestamp,
      statusAtActivity: activity.statusAtActivity
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getRecentActivities }; 