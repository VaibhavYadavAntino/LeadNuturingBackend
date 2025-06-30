const mongoose = require('mongoose');
const leadService = require('../services/leadService');


const createLead = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Error creating lead', error: error.message });
  }
};


const getLeads = async (req, res) => {
  try {
    const statusFilter = req.query.status && req.query.status.toLowerCase() !== 'all'
      ? [req.query.status.toLowerCase()]
      : [];
    // For 'get all', searchQuery is empty string, statusFilter is []
    const leads = await leadService.searchLeads('', statusFilter);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getLeadsPaginated = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Get filter parameters
    const searchQuery = req.query.query || req.query.search || '';
    const statusFilter = req.query.status 
      ? req.query.status.split(',').map(s => s.toLowerCase())
      : [];
    
    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({ message: 'Page number must be greater than 0' });
    }
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }
    
    const result = await leadService.getLeadsPaginated(page, limit, searchQuery, statusFilter);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getLeadById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid lead ID' });
  }
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateLead = async (req, res) => {
  try {
    const updated = await leadService.updateLead(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    if (error.name === 'DuplicateEmail') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const deleteLead = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid lead ID' });
  }
  try {
    const lead = await leadService.deleteLead(req.params.id);
    if (lead) {
      res.json({ message: 'Lead removed' });
    } else {
      res.json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getLeadsCount = async (req, res) => {
  try {
    const stats = await leadService.fetchLeadStats();
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching lead counts",
      error: error.message
    });
  }
};

const getLeadsInactive30Days = async (req, res) => {
  try {
    const leads = await leadService.getLeadsInactive30Days();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLeadsInactive30DaysPaginated = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({ message: 'Page number must be greater than 0' });
    }
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }
    
    const result = await leadService.getLeadsInactive30DaysPaginated(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const countLeadsInactive30Days = async (req, res) => {
  try {
    const count = await leadService.countLeadsInactive30Days();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchLeads = async (req, res) => {
  try {
    const searchQuery = req.query.query || '';
    const statusFilter = req.query.status
      ? req.query.status.split(',')  
      : [];

    const results = await leadService.searchLeads(searchQuery, statusFilter);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching leads', error: error.message });
  }
};
module.exports = {
  createLead,
  getLeads,
  getLeadsPaginated,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadsCount,
  getLeadsInactive30Days,
  getLeadsInactive30DaysPaginated,
  countLeadsInactive30Days,
  searchLeads,
};
