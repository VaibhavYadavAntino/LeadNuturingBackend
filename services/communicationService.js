const Communication = require('../models/communication');
const RecentActivity = require('../models/RecentActivity');
const Lead = require('../models/Lead');

const createCommunication = async (data) => {
  const log = await Communication.create(data);
  // Add to RecentActivity
  const lead = await Lead.findById(log.lead);
  await RecentActivity.create({
    type: 'message',
    lead: log.lead,
    info: `Message sent via ${log.channel}`,
    channel: log.channel,
    timestamp: log.timestamp,
    statusAtActivity: data.statusAtActivity || lead.status
  });
  return log;
};

const getCommunications = async (filter = {}) => {
  return await Communication.find(filter)
    .sort({ timestamp: -1 }) // Newest first
    .populate('lead')
    .populate('admin');
};

const getCommunicationById = async (id) => {
  return await Communication.findById(id).populate('lead').populate('admin');
};

const updateCommunication = async (id, data) => {
    const log = await Communication.findById(id);
    if (!log) {
        return null;
    }
    Object.assign(log, data);
    return await log.save();
};

const deleteCommunication = async (id) => {
    const log = await Communication.findById(id);
    if (!log) {
        return null;
    }
    await log.deleteOne();
    return log;
};

module.exports = {
  createCommunication,
  getCommunications,
  getCommunicationById,
  updateCommunication,
  deleteCommunication,
};
