const User = require('../models/User');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { successResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../middleware/asyncHandler');

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, totalRevenueData, lowStockCount] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Inventory.countDocuments({ $expr: { $lte: ['$stock', '$threshold'] } })
  ]);

  const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].total : 0;

  successResponse(res, 200, 'Dashboard stats fetched', {
    totalUsers,
    totalOrders,
    totalRevenue,
    lowStockCount
  });
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  successResponse(res, 200, 'Users fetched', users);
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');
  successResponse(res, 200, 'User role updated', user);
});
