const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require('../controllers/leadControllers');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/').post(protect, createLead).get(protect, getLeads);
router
  .route('/:id')
  .get(protect, validateObjectId, getLeadById)
  .put(protect, validateObjectId, updateLead)
  .delete(protect, validateObjectId, deleteLead);

module.exports = router;
