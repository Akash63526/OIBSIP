const Notification = require('../models/Notification');
const { successResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../middleware/asyncHandler');

exports.getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt');
  successResponse(res, 200, 'Notifications fetched successfully', notifications);
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status: 'READ' },
    { new: true }
  );
  successResponse(res, 200, 'Notification marked as read', notification);
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, status: 'UNREAD' },
    { status: 'READ' }
  );
  successResponse(res, 200, 'All notifications marked as read');
});
