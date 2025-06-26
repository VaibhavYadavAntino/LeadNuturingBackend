const mongoose = require('mongoose');
const leadService = require('../services/leadService');

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Error creating lead', error: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status.toLowerCase() !== 'all') {
      filter.status = status.toLowerCase();
    }
    const leads = await leadService.getLeadsWithFilter(filter);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get lead by ID
// @route   GET /api/leads/:id
// @access  Private
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

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid lead ID' });
  }
  try {
    const updatedLead = await leadService.updateLead(req.params.id, req.body);
    if (updatedLead) {
      res.json(updatedLead);
    } else {
      res.json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating lead', error: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
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
      ? req.query.status.split(',')  // support comma-separated status like ?status=engaged,dormant
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
  getLeadById,
  updateLead,
  deleteLead,
  getLeadsCount,
  getLeadsInactive30Days,
  countLeadsInactive30Days,
  searchLeads,
};
