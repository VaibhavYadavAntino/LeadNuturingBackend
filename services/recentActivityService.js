const RecentActivity = require('../models/RecentActivity');

const getRecentActivities = async (limit = 15) => {
  return await RecentActivity.find({})
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('lead');
};

module.exports = { getRecentActivities }; 