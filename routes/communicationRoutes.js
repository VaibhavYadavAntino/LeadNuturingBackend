const express = require('express');
const router = express.Router();
const {
  createCommunicationLog,
  getAllCommunicationLogs,
  getCommunicationLogById,
  updateCommunicationLog,
  deleteCommunicationLog,
  sendEmailToLead,
} = require('../controllers/communicationController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .post(protect, createCommunicationLog)
  .get(protect, getAllCommunicationLogs);

router.route('/:id')
  .get(protect, validateObjectId, getCommunicationLogById)
  .put(protect, validateObjectId, updateCommunicationLog)
  .delete(protect, validateObjectId, deleteCommunicationLog);

module.exports = router;
