const Lead = require('../models/Lead');
const { autoUpdateLeadStatuses } = require('../cron/statusUpdater');
const { getLeadStatus } = require('../utils/lead.util');
const { daysBetween } = require('../utils/date.util');

const createLead = async (leadData) => {
  // Ensure lastContactDate is provided
  if (!leadData.lastContactDate) {
    throw new Error('lastContactDate is required');
  }
  // Use utility for status
  leadData.status = getLeadStatus(leadData.lastContactDate);
  const lead = await Lead.create(leadData);
  // Run status update after lead creation
  await autoUpdateLeadStatuses();
  return lead;
};

const getLeads = async () => {
  return await Lead.find({});
};

const getLeadById = async (id) => {
  return await Lead.findById(id);
};

const updateLead = async (id, leadData) => {
  const lead = await Lead.findById(id);
  if (!lead) {
    return null;
  }
  Object.assign(lead, leadData);
  if (leadData.lastContactDate) {
    lead.lastContactDate = new Date();
    lead.status = getLeadStatus(lead.lastContactDate);
  }
  return await lead.save();
};

const deleteLead = async (id) => {
    const lead = await Lead.findById(id);
    if (!lead) {
        return null;
    }
    await lead.deleteOne();
    return lead;
};

const fetchLeadStats = async () => {
  const totalLeads = await Lead.countDocuments();
  const engaged = await Lead.countDocuments({ status: 'engaged' });
  const dormant = await Lead.countDocuments({ status: 'dormant' });
  const unresponsive = await Lead.countDocuments({ status: 'unresponsive' });
  return { totalLeads, engaged, dormant, unresponsive };
};

const getLeadsInactive30Days = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return await Lead.find({ lastContactDate: { $lt: thirtyDaysAgo } });
};

const countLeadsInactive30Days = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return await Lead.countDocuments({ lastContactDate: { $lt: thirtyDaysAgo } });
};

const searchLeads = async (query) => {
  const regex = new RegExp(query, 'i'); 
  return await Lead.find({
    $or: [
      { name: regex },
      { email: regex },
      { companyName: regex }
    ]
  });
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  fetchLeadStats,
  getLeadsInactive30Days,
  countLeadsInactive30Days,
  searchLeads,
}; 