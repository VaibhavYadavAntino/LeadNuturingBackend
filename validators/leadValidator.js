const { body } = require('express-validator');

const validateCreateLead = [
  body('name')
    .notEmpty().withMessage('Name is required'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isNumeric().withMessage('Phone must be in numbers')
    .isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits'),

  body('companyName')
    .notEmpty().withMessage('Company name is required'),

  body('lastContactDate')
    .notEmpty().withMessage('Last contact date is required')
];

module.exports = { validateCreateLead };
