const { body } = require('express-validator');
const Lead = require('../models/Lead');

const validateCreateLead = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .custom(async (email) => {
      const existing = await Lead.findOne({ email });
      if (existing) throw new Error('Email already exists');
    }),
  body('phone')
    .notEmpty().withMessage('Phone is required')
    .isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits')
    .isNumeric().withMessage('Phone must be in numeric')
    .custom(async (phone) => {
      const existing = await Lead.findOne({ phone });
      if (existing) throw new Error('Phone number already exists');
    }),

  body('companyName').notEmpty().withMessage('Company name is required'),
  body('lastContactDate')
    .notEmpty().withMessage('Last contact date is required')
    .custom((value) => {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      if (value > today) {
        throw new Error('Last contact date cannot be in the future');
      }
      return true;
    })
];


const validateUpdateLead = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),

  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .custom(async (email, { req }) => {
      const existing = await Lead.findOne({ email });
    
      if (existing && existing._id.toString() !== req.params.id) {
        throw new Error('Email already exists for another lead');
      }
    }),

  body('phone')
    .optional()
    .isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits')
    .isNumeric().withMessage('Phone must be in numeric'),

  body('companyName')
    .optional()
    .notEmpty().withMessage('Company name cannot be empty'),

  body('lastContactDate')
    .optional()
    .notEmpty().withMessage('Last contact date is required')
    //.isISO8601().toDate().withMessage('Invalid date format')
    .custom((value) => {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      if (value > today) {
        throw new Error('Last contact date cannot be in the future');
      }
      return true;
    })
];

module.exports = {validateCreateLead, validateUpdateLead };
