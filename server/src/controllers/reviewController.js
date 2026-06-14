const Review = require('../models/Review');
const { successResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get all reviews with optional filters (status, rating, search)
// @route   GET /api/reviews
// @access  Public (Optional auth for admin actions)
exports.getAllReviews = asyncHandler(async (req, res) => {
  const { status, rating, search } = req.query;
  const filter = {};

  if (status && status !== 'All Status') {
    filter.status = status;
  }
  if (rating && rating !== 'All Ratings') {
    // rating can be e.g. "5 Stars" or "5" or "4.5"
    const parsedRating = parseFloat(rating.replace(' Stars', '').replace(' Star', ''));
    if (!isNaN(parsedRating)) {
      filter.rating = parsedRating;
    }
  }
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
      { customerName: searchRegex },
      { productName: searchRegex },
      { text: searchRegex },
      { orderId: searchRegex }
    ];
  }

  const reviews = await Review.find(filter).sort({ createdAt: -1 });
  successResponse(res, 200, 'Reviews fetched successfully', reviews);
});

// @desc    Create a new review (Submit feedback)
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res) => {
  const { rating, text, menuItem, orderId, size, price, productName, productImage } = req.body;
  
  if (!rating || !text || !menuItem || !orderId) {
    throw new ApiError(400, 'Please provide rating, text, menuItem, and orderId');
  }

  const review = await Review.create({
    user: req.user._id,
    customerName: req.user.name,
    customerEmail: req.user.email,
    customerAvatar: req.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120',
    orderId,
    menuItem,
    productName: productName || 'Pizza Item',
    productImage: productImage || '',
    rating,
    text,
    size: size || 'Medium',
    price: price || 0,
    status: 'Pending' // Requires admin approval
  });

  successResponse(res, 201, 'Review submitted successfully', review);
});

// @desc    Update review status (Approve/Disapprove)
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
exports.updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Approved', 'Pending'].includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!review) throw new ApiError(404, 'Review not found');
  successResponse(res, 200, `Review status set to ${status} successfully`, review);
});

// @desc    Toggle featured review tag (starred highlight on storefront)
// @route   PATCH /api/reviews/:id/feature
// @access  Private/Admin
exports.toggleFeatured = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  review.featured = !review.featured;
  await review.save();

  successResponse(
    res,
    200,
    `Review is now ${review.featured ? 'featured' : 'unfeatured'} successfully`,
    review
  );
});

// @desc    Post reply to customer review
// @route   POST /api/reviews/:id/reply
// @access  Private/Admin
exports.replyToReview = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  if (!reply) throw new ApiError(400, 'Reply text is required');

  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  review.reply = reply;
  review.status = 'Approved'; // Auto approve when replied to
  await review.save();

  successResponse(res, 200, 'Reply posted successfully', review);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  successResponse(res, 200, 'Review deleted successfully');
});
