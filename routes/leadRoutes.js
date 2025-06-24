const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadsCount,
  getLeadsInactive30Days,
  countLeadsInactive30Days,
} = require('../controllers/leadControllers');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

  router.get('/stats/count',protect, getLeadsCount);

router.get('/inactive-30days', protect, getLeadsInactive30Days);
router.get('/inactive-30days/count', protect, countLeadsInactive30Days);

router.route('/').post(protect, createLead).get(protect, getLeads);
router
  .route('/:id')
  .get(protect, validateObjectId, getLeadById)
  .put(protect, validateObjectId, updateLead)
  .delete(protect, validateObjectId, deleteLead);

module.exports = router;
