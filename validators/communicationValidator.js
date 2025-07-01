const { body } = require('express-validator');

const validateSendEmail = [
  body('leadId').notEmpty().withMessage('leadId is required'),
];

const validateSendWhatsApp = [
  body('leadId').notEmpty().withMessage('leadId is required'),
  // No message validation here; message will be picked from template
];

const validateCreateCommunicationLog = [
  body('lead').notEmpty().withMessage('lead is required'),
  body('channel').notEmpty().withMessage('channel is required'),
  body('message').notEmpty().withMessage('message is required')
];

module.exports = {
  validateSendEmail,
  validateSendWhatsApp,
  validateCreateCommunicationLog
};
