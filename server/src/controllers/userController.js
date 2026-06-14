const User = require('../models/User');
const { successResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, address },
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) throw new ApiError(404, 'User not found');
  successResponse(res, 200, 'Profile updated successfully', user);
});
