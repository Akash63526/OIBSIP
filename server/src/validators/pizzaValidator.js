const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

exports.validatePizza = [
  body('name').notEmpty().withMessage('Pizza name is required'),
  body('basePrice').isNumeric().withMessage('Base price is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, errors.array()[0].msg));
    next();
  }
];
