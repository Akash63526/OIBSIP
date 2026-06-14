const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseFormatter');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path || err.param]: err.msg }));

  return errorResponse(res, 422, 'Validation Error', extractedErrors);
};

module.exports = validate;
