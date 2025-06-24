const Lead = require('../models/Lead');

const createLead = async (leadData) => {
  let now = new Date();
  if (leadData.status === 'engaged') {
    leadData.lastContactDate = now;
  } else if (leadData.status === 'dormant') {
    // Random date between 30 and 60 days ago
    const daysAgo = 30 + Math.floor(Math.random() * 31); // 30 to 60
    let date = new Date(now);
    date.setDate(now.getDate() - daysAgo);
    leadData.lastContactDate = date;
  } else if (leadData.status === 'unresponsive') {
    // Random date between 90 and 120 days ago
    const daysAgo = 90 + Math.floor(Math.random() * 31); // 90 to 120
    let date = new Date(now);
    date.setDate(now.getDate() - daysAgo);
    leadData.lastContactDate = date;
  } else {
    leadData.lastContactDate = now;
  }
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