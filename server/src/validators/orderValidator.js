const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

exports.validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('totalAmount').isNumeric().withMessage('Total amount is required'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, errors.array()[0].msg));
    next();
  }
];
