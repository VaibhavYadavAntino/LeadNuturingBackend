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
router.get('/paginated', protect, getLeadsPaginated);
router.get('/stats/count',protect, getLeadsCount);

router.get('/inactive-30days', protect, getLeadsInactive30Days);
router.get('/inactive-30days/paginated', protect, getLeadsInactive30DaysPaginated);
router.get('/inactive-30days/count', protect, countLeadsInactive30Days);

router.route('/').post(protect,validateCreateLead,handleValidationErrors, createLead).get(protect, getLeads);
router
  .route('/:id')
  .get(protect, validateObjectId, getLeadById)
  .put(protect, validateObjectId, validateUpdateLead, handleValidationErrors, updateLead)
  .delete(protect, validateObjectId, deleteLead);

module.exports = router;
