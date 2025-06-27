const express = require('express');
const router = express.Router();
const {
  createCommunicationLog,
  getAllCommunicationLogs,
  getCommunicationLogById,
  updateCommunicationLog,
  deleteCommunicationLog,
  sendEmailToLead,
  sendWhatsAppToLead,
} = require('../controllers/communicationController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

//  Import validators
const {
  validateSendEmail,
  validateSendWhatsApp,
  validateCreateCommunicationLog
} = require('../validators/communicationValidator');
const { handleValidationErrors } = require('../validators/handleValidation');

router.route('/')
  .post(protect, validateCreateCommunicationLog, handleValidationErrors, createCommunicationLog)
  .get(protect, getAllCommunicationLogs);

router.route('/:id')
  .get(protect, validateObjectId, getCommunicationLogById)
  .put(protect, validateObjectId, updateCommunicationLog)
  .delete(protect, validateObjectId, deleteCommunicationLog);

router.post('/send-email', protect, validateSendEmail, handleValidationErrors, sendEmailToLead);
router.post('/send-whatsapp', protect, validateSendWhatsApp, handleValidationErrors, sendWhatsAppToLead);

module.exports = router;
