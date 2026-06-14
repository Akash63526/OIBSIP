const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

exports.validateInventory = [
  body('itemName').notEmpty().withMessage('Item name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isNumeric().withMessage('Stock must be a number'),
  body('threshold').isNumeric().withMessage('Threshold must be a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(400, errors.array()[0].msg));
    next();
  }
];
