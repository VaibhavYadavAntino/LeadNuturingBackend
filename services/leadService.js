const Lead = require('../models/lead');

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

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
}; 