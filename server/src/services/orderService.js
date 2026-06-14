const Order = require('../models/Order');

exports.createOrder = async (orderData) => {
  return await Order.create(orderData);
};

exports.getUserOrders = async (userId) => {
  return await Order.find({ user: userId }).sort('-createdAt');
};

exports.getAllOrders = async () => {
  return await Order.find().populate('user', 'name email').sort('-createdAt');
};

exports.updateOrderStatus = async (orderId, status) => {
  return await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  );
};
