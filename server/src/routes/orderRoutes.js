const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, orderController.createOrder)
  .get(protect, authorize('admin'), orderController.getAllOrders);

router.get('/my-orders', protect, orderController.getMyOrders);

router.route('/:id')
  .get(protect, orderController.getOrderById);

router.patch('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
