const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

exports.validatePaymentOrder = [
  body('amount').isNumeric().withMessage('Amount is required'),
  body('receiptId').notEmpty().withMessage('Receipt ID is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, errors.array()[0].msg));
    next();
  }
];
