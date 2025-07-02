const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/leadControllers');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const { validateCreateLead, validateUpdateLead } = require('../validators/leadValidator');
const { handleValidationErrors } = require('../validators/handleValidation');

router.get('/search',protect,searchLeads);
router.post('/paginated', protect, getLeadsPaginated);
router.get('/stats/count',protect, getLeadsCount);

router.get('/inactive-30days', protect, getLeadsInactive30Days);
router.get('/inactive-30days/paginated', protect, getLeadsInactive30DaysPaginated);
router.get('/inactive-30days/count', protect, countLeadsInactive30Days);

// Temporary debug route to manually trigger status updates
router.post('/debug/update-statuses', protect, async (req, res) => {
  try {
    const { autoUpdateLeadStatuses } = require('../cron/statusUpdater');
    await autoUpdateLeadStatuses();
    res.json({ message: 'Status update completed' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating statuses', error: error.message });
  }
});

// Debug route to test status calculation for a specific lead
router.get('/debug/status/:id', protect, async (req, res) => {
  try {
    const { getLeadStatus } = require('../utils/lead.util');
    const lead = await require('../services/leadService').getLeadById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    const calculatedStatus = getLeadStatus(lead.lastContactDate);
    const now = new Date();
    const lastContact = new Date(lead.lastContactDate);
    const days = Math.floor((now - lastContact) / (1000 * 60 * 60 * 24));
    
    res.json({
      leadId: lead._id,
      currentStatus: lead.status,
      calculatedStatus: calculatedStatus,
      lastContactDate: lead.lastContactDate,
      daysSinceContact: days,
      now: now,
      lastContact: lastContact
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating status', error: error.message });
  }
});

router.route('/').post(protect,validateCreateLead,handleValidationErrors, createLead).get(protect, getLeads);
router
  .route('/:id')
  .get(protect, validateObjectId, getLeadById)
  .put(protect, validateObjectId, validateUpdateLead, handleValidationErrors, updateLead)
  .delete(protect, validateObjectId, deleteLead);

module.exports = router;
