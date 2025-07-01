const { body } = require('express-validator');
const Lead = require('../models/Lead');
const moment = require('moment');

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
    .isNumeric().withMessage('Phone must be in numeric'),

  body('companyName').notEmpty().withMessage('Company name is required'),
  body('lastContactDate')
    .notEmpty().withMessage('Last contact date is required')
    .custom((value) => {
      let date;
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        date = new Date(value);
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
        date = moment(value, 'DD-MM-YYYY').toDate();
      } else {
        throw new Error('Invalid date format. Use YYYY-MM-DD or DD-MM-YYYY');
      }
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) {
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
    .custom((value) => {
      let date;
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        date = new Date(value);
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
        date = moment(value, 'DD-MM-YYYY').toDate();
      } else {
        throw new Error('Invalid date format. Use YYYY-MM-DD or DD-MM-YYYY');
      }
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) {
        throw new Error('Last contact date cannot be in the future');
      }
      return true;
    })
];

module.exports = {validateCreateLead, validateUpdateLead };
