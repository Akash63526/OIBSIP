const Coupon = require('../models/Coupon');
const { successResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get all promotional offers and coupons
// @route   GET /api/coupons
// @access  Public
exports.getAllCoupons = asyncHandler(async (req, res) => {
  const { search, type } = req.query;
  const filter = {};

  if (type && type !== 'All Types') {
    filter.type = type;
  }
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
      { code: searchRegex },
      { name: searchRegex },
      { description: searchRegex }
    ];
  }

  const coupons = await Coupon.find(filter).sort({ priority: -1, createdAt: -1 });
  successResponse(res, 200, 'Coupons fetched successfully', coupons);
});

// @desc    Get individual coupon by code (e.g. for checkout validations)
// @route   GET /api/coupons/:code
// @access  Private
exports.getCouponByCode = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ 
    code: req.params.code.toUpperCase().trim(),
    status: 'Active' 
  });

  if (!coupon) throw new ApiError(404, 'Coupon not found or is currently inactive');

  // Check validity dates
  const now = new Date();
  if (now < coupon.validityStart || now > coupon.validityEnd) {
    throw new ApiError(400, 'This coupon code has expired or is not yet valid');
  }

  // Check usage limits
  if (coupon.usageCount >= coupon.usageLimit) {
    throw new ApiError(400, 'This coupon usage limit has been exceeded');
  }

  successResponse(res, 200, 'Coupon is valid and active', coupon);
});

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = asyncHandler(async (req, res) => {
  const { code, name, description, type, discount, minOrder, usageLimit, validityStart, validityEnd, priority, applicableSize, image } = req.body;

  if (!code || !name || !discount || !validityEnd) {
    throw new ApiError(400, 'Please provide coupon code, name, discount amount, and expiration validity date');
  }

  // Prevent duplicate codes
  const uppercaseCode = code.toUpperCase().trim();
  const existingCoupon = await Coupon.findOne({ code: uppercaseCode });
  if (existingCoupon) throw new ApiError(400, 'A coupon with this code already exists');

  const coupon = await Coupon.create({
    code: uppercaseCode,
    name,
    description: description || 'Special promotional savings code.',
    type: type || 'Percentage',
    discount,
    minOrder: minOrder || 0,
    usageLimit: usageLimit || 500,
    validityStart: validityStart || Date.now(),
    validityEnd,
    status: 'Active',
    priority: priority || false,
    applicableSize: applicableSize || 'All Sizes',
    image: image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120'
  });

  successResponse(res, 201, 'Coupon created successfully', coupon);
});

// @desc    Update coupon details
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!coupon) throw new ApiError(404, 'Coupon not found');
  successResponse(res, 200, 'Coupon updated successfully', coupon);
});

// @desc    Toggle coupon status (Active / Inactive)
// @route   PATCH /api/coupons/:code/status
// @access  Private/Admin
exports.toggleStatus = asyncHandler(async (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  const coupon = await Coupon.findOne({ code });
  if (!coupon) throw new ApiError(404, 'Coupon not found');

  coupon.status = coupon.status === 'Active' ? 'Inactive' : 'Active';
  await coupon.save();

  successResponse(res, 200, `Coupon status successfully toggled to ${coupon.status}`, coupon);
});

// @desc    Toggle coupon priority star tag
// @route   PATCH /api/coupons/:code/priority
// @access  Private/Admin
exports.togglePriority = asyncHandler(async (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  const coupon = await Coupon.findOne({ code });
  if (!coupon) throw new ApiError(404, 'Coupon not found');

  coupon.priority = !coupon.priority;
  await coupon.save();

  successResponse(res, 200, `Coupon priority set to ${coupon.priority} successfully`, coupon);
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');

  successResponse(res, 200, 'Coupon deleted successfully');
});
