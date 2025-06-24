const Lead = require('../models/Lead');

const createLead = async (leadData) => {
  leadData.lastContactDate = new Date();
  return await Lead.create(leadData);
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
  lead.lastContactDate = new Date();
  
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

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  fetchLeadStats,
  getLeadsInactive30Days,
  countLeadsInactive30Days,
}; 