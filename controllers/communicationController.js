const communicationService = require('../services/communicationService');
const leadService = require('../services/leadService');
const messagingService = require('../services/messagingService');
const Lead = require('../models/lead');
const mongoose = require('mongoose');

// @desc    Create a new communication log
// @route   POST /api/communications
// @access  Private
const createCommunicationLog = async (req, res) => {
  try {
    const leadId = req.body.lead || req.body.leadId;
    if (!leadId) {
      return res.status(400).json({ message: 'Lead ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
        return res.status(400).json({ message: 'Invalid Lead ID format' });
    }
    const leadExists = await Lead.findById(leadId);
    if (!leadExists) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    const log = await communicationService.createCommunication(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: 'Error creating communication log', error: error.message });
  }
};

// @desc    Get all communication logs
// @route   GET /api/communications
// @access  Private
const getAllCommunicationLogs = async (req, res) => {
  try {
    const { lead, channel, from, to } = req.query;
    const filter = {};
    if (lead) filter.lead = lead;
    if (channel) filter.channel = channel;
    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to) filter.timestamp.$lte = new Date(to);
    }
    const logs = await communicationService.getCommunications(filter);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a communication log by ID
// @route   GET /api/communications/:id
// @access  Private
const getCommunicationLogById = async (req, res) => {
  try {
    const log = await communicationService.getCommunicationById(req.params.id);
    if (log) {
      res.json(log);
    } else {
      res.status(404).json({ message: 'Communication log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a communication log
// @route   PUT /api/communications/:id
// @access  Private
const updateCommunicationLog = async (req, res) => {
    try {
        const log = await communicationService.updateCommunication(req.params.id, req.body);
        if (log) {
            res.json(log);
        } else {
            res.status(404).json({ message: 'Communication log not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating communication log', error: error.message });
    }
};

// @desc    Delete a communication log
// @route   DELETE /api/communications/:id
// @access  Private
const deleteCommunicationLog = async (req, res) => {
    try {
        const log = await communicationService.deleteCommunication(req.params.id);
        if (log) {
            res.json({ message: 'Communication log removed' });
        } else {
            res.json({ message: 'Communication log not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const sendEmailToLead = async (req, res) => {
    const { leadId, subject, message } = req.body;

    if (!leadId || !subject || !message) {
        return res.status(400).json({ message: 'leadId, subject, and message are required' });
    }

    try {
        const lead = await leadService.getLeadById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        const emailResult = await messagingService.sendEmail(lead.email, subject, message);

        if (!emailResult.success) {
            return res.status(500).json({ message: 'Failed to send email' });
        }

        await communicationService.createCommunication({
            lead: leadId,
            channel: 'email',
            message: `Subject: ${subject} - Body: ${message}`,
        });

        await leadService.updateLead(leadId, { lastContactDate: new Date() });

        res.json({ message: 'Email sent successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
  createCommunicationLog,
  getAllCommunicationLogs,
  getCommunicationLogById,
  updateCommunicationLog,
  deleteCommunicationLog,
  sendEmailToLead,
};
