const Lead = require('../models/Lead');
const communicationService = require('../services/communicationService');


exports.handleUltraMsgWebhook = async (req, res) => {
  try {
    // UltraMsg sends data inside req.body.data
    const payload = req.body.data;
    if (!payload || !payload.from || !payload.body) return res.status(400).send('Invalid payload');

    // Extract phone number (remove '@c.us' and take last 10 digits)
    const phone = payload.from.replace(/[^0-9]/g, '').slice(-10);
    const lead = await Lead.findOne({ phone });
    if (!lead) return res.status(404).send('Lead not found');

    await communicationService.createCommunication({
      lead: lead._id,
      channel: 'whatsapp',
      message: payload.body,
      direction: 'received',
      statusAtActivity: lead.status
    });

    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('Server error');
  }
}; 