const Order = require('../models/Order');
const { successResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.createOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount, deliveryAddress } = req.body;
  
  if (!items || items.length === 0) {
    throw new ApiError(400, 'Order items cannot be empty');
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    totalAmount,
    deliveryAddress,
    status: 'ORDER_RECEIVED'
  });

  successResponse(res, 201, 'Order created successfully', order);
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate({
      path: 'items.pizzaId',
      select: 'name image description category basePrice'
    })
    .populate({
      path: 'items.pizzaConfig.base items.items.pizzaConfig.sauce items.pizzaConfig.cheese items.pizzaConfig.veggies items.pizzaConfig.meat',
      select: 'name category extraPrice'
    })
    .sort('-createdAt');
  successResponse(res, 200, 'Orders fetched', orders);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate({
      path: 'items.pizzaId',
      select: 'name image description category basePrice'
    })
    .populate({
      path: 'items.pizzaConfig.base items.items.pizzaConfig.sauce items.pizzaConfig.cheese items.pizzaConfig.veggies items.pizzaConfig.meat',
      select: 'name category extraPrice'
    });
  
  if (!order) throw new ApiError(404, 'Order not found');
  
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view this order');
  }
  
  successResponse(res, 200, 'Order fetched', order);
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  successResponse(res, 200, 'All orders fetched', orders);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  
  if (!order) throw new ApiError(404, 'Order not found');
  
  successResponse(res, 200, 'Order status updated', order);
});
