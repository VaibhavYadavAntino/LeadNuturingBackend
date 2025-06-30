const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.array()
    });
  }

  next(); // If no error, go to controller
};

module.exports = { handleValidationErrors };
