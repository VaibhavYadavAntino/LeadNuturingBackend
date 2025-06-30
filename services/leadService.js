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
  return await Lead.find({}).sort({ createdAt: -1 });
};

const getLeadsPaginated = async (page = 1, limit = 10, searchQuery = '', statusFilter = []) => {
  const skip = (page - 1) * limit;
  
  // Build query based on filters
  const query = {};
  
  // Add search filter if provided
  if (searchQuery && searchQuery.trim() !== '') {
    const regex = new RegExp(searchQuery, 'i');
    query.$or = [
      { name: regex },
      { email: regex },
      { companyName: regex }
    ];
  }
  
  // Add status filter if provided
  if (statusFilter && statusFilter.length > 0) {
    query.status = { $in: statusFilter };
  }
  
  // Get leads with pagination and filters
  const leads = await Lead.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  // Get total count for pagination metadata
  const totalItems = await Lead.countDocuments(query);
  
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    leads,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    filters: {
      searchQuery,
      statusFilter
    }
  };
};

const getLeadsWithFilter = async (filter = {}) => {
  return await Lead.find(filter).sort({ createdAt: -1 });
};

const getLeadById = async (id) => {
  return await Lead.findById(id);
};

const updateLead = async (id, leadData) => {
  const lead = await Lead.findById(id);
  if (!lead) {
    return null;
  }
  
  // Only update lastContactDate and recalculate status if it's explicitly provided
  // and it's different from the current value
  if (leadData.lastContactDate !== undefined) {
    const newLastContactDate = new Date(leadData.lastContactDate);
    const currentLastContactDate = new Date(lead.lastContactDate);
    
    // Only update if the dates are different
    if (newLastContactDate.getTime() !== currentLastContactDate.getTime()) {
      lead.lastContactDate = newLastContactDate;
      lead.status = getLeadStatus(lead.lastContactDate);
    }
    // Remove lastContactDate from leadData to prevent double assignment
    delete leadData.lastContactDate;
  }
  
  Object.assign(lead, leadData);
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

  // Find leads where lastContactDate is more than 30 days ago
  return await Lead.find({ 
    lastContactDate: { $lte: thirtyDaysAgo } 
  }).sort({ lastContactDate: 1 });
};


const getLeadsInactive30DaysPaginated = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Get inactive leads with pagination based on lastContactDate
  const leads = await Lead.find({ 
    lastContactDate: { $lte: thirtyDaysAgo } 
  })
  .sort({ lastContactDate: 1 })
  .skip(skip)
  .limit(limit);
  
  // Get total count for pagination metadata
  const totalItems = await Lead.countDocuments({ 
    lastContactDate: { $lte: thirtyDaysAgo } 
  });
  
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    leads,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

const countLeadsInactive30Days = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Count leads where lastContactDate is more than 30 days ago
  return await Lead.countDocuments({ 
    lastContactDate: { $lte: thirtyDaysAgo } 
  });
};

const searchLeads = async (query, statusFilter = []) => {
  const regex = new RegExp(query, 'i');

  const dbQuery = {
    $or: [
      { name: regex },
      { email: regex },
      { companyName: regex }
    ]
  };

  if (statusFilter.length > 0) {
    dbQuery.status = { $in: statusFilter };
  }

  return await Lead.find(dbQuery).sort({ createdAt: -1 });
};

module.exports = {
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  fetchLeadStats,
  getLeadsInactive30Days,
  getLeadsInactive30DaysPaginated,
  countLeadsInactive30Days,
  searchLeads,
  getLeadsPaginated,
};