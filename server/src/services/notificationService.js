const Notification = require('../models/Notification');

exports.createNotification = async (userId, title, message, type = 'INFO') => {
  return await Notification.create({ user: userId, title, message, type });
};

exports.getUserNotifications = async (userId) => {
  return await Notification.find({ user: userId }).sort('-createdAt');
};

exports.markAsRead = async (id, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { status: 'READ' },
    { new: true }
  );
};
