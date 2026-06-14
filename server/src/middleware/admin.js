const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

exports.isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ApiError(403, 'Access denied. Admin resources only.');
  }
});
