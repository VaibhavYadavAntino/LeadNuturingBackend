const communicationService = require('../services/communicationService');
const leadService = require('../services/leadService');
const messagingService = require('../services/messagingService');
const Lead = require('../models/Lead');
const mongoose = require('mongoose');
const { autoUpdateLeadStatuses } = require('../cron/statusUpdater');

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
    const { leadId } = req.body;

    if (!leadId) {
        return res.status(400).json({ message: 'leadId is required' });
    }

    // Predefined email templates
    const emailTemplates = {
        'welcome': {
            subject: 'Welcome to Our Service!',
            message: `
                <h2>Welcome!</h2>
                <p>Thank you for your interest in our services. We're excited to have you on board!</p>
                <p>Our team will be in touch with you soon to discuss how we can help you achieve your goals.</p>
                <p>Best regards,<br>Antino</p>
            `
        },
        'follow_up': {
            subject: 'Following Up on Your Interest',
            message: `
                <h2>Hello!</h2>
                <p>We wanted to follow up on your recent inquiry about our services.</p>
                <p>We'd love to schedule a quick call to discuss your needs and show you how we can help.</p>
                <p>Please let us know a convenient time for you.</p>
                <p>Best regards,<br>Antino</p>
            `
        },
        'reminder': {
            subject: 'Reminder: We\'re Here to Help',
            message: `
                <h2>Hello!</h2>
                <p>We noticed you haven't been in touch recently, and we wanted to remind you that we're here to help!</p>
                <p>If you have any questions or need assistance, please don't hesitate to reach out.</p>
                <p>We're committed to your success!</p>
                <p>Best regards,<br>Antino</p>
            `
        },
        're_engagement': {
            subject: 'We Miss You! Let\'s Reconnect',
            message: `
                <h2>Hello!</h2>
                <p>It's been a while since we last connected, and we wanted to reach out!</p>
                <p>We have some exciting updates and would love to share them with you.</p>
                <p>Let's catch up and see how we can continue to support your goals.</p>
                <p>Best regards,<br>Antino</p>
            `
        }
    };

    try {
        const lead = await leadService.getLeadById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Determine message type based on lead status and lastContactDate
        let messageType = 'welcome'; // default
        const now = new Date();
        const lastContact = new Date(lead.lastContactDate);
        const daysSinceContact = Math.floor((now - lastContact) / (1000 * 60 * 60 * 24));

        if (lead.status === 'unresponsive') {
            messageType = 're_engagement';
        } else if (lead.status === 'dormant') {
            messageType = 'reminder';
        } else if (daysSinceContact < 10) {
            messageType = 'welcome';
        } else if (daysSinceContact >= 10 && daysSinceContact < 30) {
            messageType = 'follow_up';
        } else {
            // For engaged leads with more than 30 days, use reminder
            messageType = 'reminder';
        }

        const template = emailTemplates[messageType];
        const emailResult = await messagingService.sendEmail(lead.email, template.subject, template.message);

        if (!emailResult.success) {
            return res.status(500).json({ message: 'Failed to send email' });
        }

        await communicationService.createCommunication({
            lead: leadId,
            channel: 'email',
            message: `Subject: ${template.subject} - Body: ${template.message}`,
        });

        await leadService.updateLead(leadId, { lastContactDate: new Date() });

        // Run status update after sending email
        await autoUpdateLeadStatuses();

        res.json({ 
            message: 'Email sent successfully',
            template: messageType,
            subject: template.subject,
            leadStatus: lead.status,
            daysSinceContact: daysSinceContact
        });

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
