const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(reviewController.getAllReviews)
  .post(protect, reviewController.createReview);

router.patch('/:id/status', protect, authorize('admin'), reviewController.updateReviewStatus);
router.patch('/:id/feature', protect, authorize('admin'), reviewController.toggleFeatured);
router.post('/:id/reply', protect, authorize('admin'), reviewController.replyToReview);
router.delete('/:id', protect, authorize('admin'), reviewController.deleteReview);

module.exports = router;
