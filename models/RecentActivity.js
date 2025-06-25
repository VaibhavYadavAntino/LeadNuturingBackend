const mongoose = require('mongoose');

const recentActivitySchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'message', 'status_update', etc.
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  info: { type: String }, // Optional: details about the activity
  timestamp: { type: Date, default: Date.now },
  statusAtActivity: { type: String, enum: ['engaged', 'dormant', 'unresponsive'] }
});

module.exports = mongoose.model('RecentActivity', recentActivitySchema); 