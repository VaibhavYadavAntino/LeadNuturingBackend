const mongoose = require('mongoose');

const recentActivitySchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'message', 'status_update', etc.
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  info: { type: String }, // Optional: details about the activity
  channel: { type: String, enum: ['email', 'whatsapp'], required: true },
  timestamp: { type: Date, default: Date.now },
  statusAtActivity: { type: String, enum: ['engaged', 'dormant', 'unresponsive'], required: true }
});

module.exports = mongoose.model('RecentActivity', recentActivitySchema); 