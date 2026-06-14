const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(couponController.getAllCoupons)
  .post(protect, authorize('admin'), couponController.createCoupon);

router.route('/:id')
  .put(protect, authorize('admin'), couponController.updateCoupon)
  .delete(protect, authorize('admin'), couponController.deleteCoupon);

router.get('/code/:code', protect, couponController.getCouponByCode);
router.patch('/code/:code/status', protect, authorize('admin'), couponController.toggleStatus);
router.patch('/code/:code/priority', protect, authorize('admin'), couponController.togglePriority);

module.exports = router;
