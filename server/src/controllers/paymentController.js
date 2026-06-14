const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const config = require('../config/env');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { successResponse } = require('../utils/responseFormatter');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { deductStockForOrder } = require('../services/inventoryDeductionService');
const { sendLowStockAlert } = require('../services/emailService');
const logger = require('../utils/logger');

// ─── Create Payment Order ────────────────────────────────────
// Creates a Razorpay order, a DB Order (PENDING), and a Payment record.
// Returns all IDs to the client so it can open the Razorpay checkout.
exports.createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount, items, deliveryAddress } = req.body;

  if (!razorpay) {
    throw new ApiError(500, 'Payment gateway is not configured');
  }

  if (!items || items.length === 0) {
    throw new ApiError(400, 'Order items cannot be empty');
  }

  if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode) {
    throw new ApiError(400, 'Complete delivery address is required');
  }

  // 1. Create Razorpay order
  const receiptId = `order_rcpt_${Date.now()}`;
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Razorpay works in paise
    currency: 'INR',
    receipt: receiptId,
  });

  if (!razorpayOrder) {
    throw new ApiError(500, 'Failed to create payment order with Razorpay');
  }

  // 2. Create DB Order (status: ORDER_RECEIVED, paymentStatus: PENDING)
  const dbOrder = await Order.create({
    user: req.user._id,
    items,
    totalAmount: amount,
    deliveryAddress,
    status: 'ORDER_RECEIVED',
    paymentStatus: 'PENDING',
    razorpayOrderId: razorpayOrder.id,
  });

  // 3. Create Payment record linking Razorpay to our order
  const payment = await Payment.create({
    order: dbOrder._id,
    user: req.user._id,
    razorpayOrderId: razorpayOrder.id,
    amount,
    currency: 'INR',
    status: 'PENDING',
  });

  // Link payment to order
  dbOrder.paymentId = payment._id;
  await dbOrder.save();

  logger.info(`📦 Order ${dbOrder._id} created | Razorpay Order: ${razorpayOrder.id} | Amount: ₹${amount}`);

  successResponse(res, 200, 'Payment order created', {
    razorpayOrderId: razorpayOrder.id,
    razorpayKeyId: config.razorpay.keyId,
    dbOrderId: dbOrder._id,
    paymentId: payment._id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });
});

// ─── Verify Payment ──────────────────────────────────────────
// Verifies Razorpay signature, updates Payment + Order status,
// deducts inventory, and sends admin alerts if stock is low.
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

  // 1. Verify Razorpay signature
  const generatedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    // Mark payment as FAILED
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: 'FAILED' }
    );
    await Order.findByIdAndUpdate(dbOrderId, { paymentStatus: 'FAILED' });

    throw new ApiError(400, 'Payment verification failed — signature mismatch');
  }

  // 2. Update Payment record with success details
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'SUCCESS',
    },
    { new: true }
  );

  // 3. Update Order paymentStatus to PAID
  const order = await Order.findByIdAndUpdate(
    dbOrderId,
    { paymentStatus: 'PAID' },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  logger.info(`✅ Payment verified for Order ${dbOrderId} | Razorpay Payment: ${razorpay_payment_id}`);

  // 4. Deduct inventory stock
  let lowStockItems = [];
  try {
    lowStockItems = await deductStockForOrder(order);
    logger.info(`📦 Inventory deducted for Order ${dbOrderId} | ${lowStockItems.length} item(s) below threshold`);
  } catch (deductErr) {
    // Don't fail the payment verification if deduction has issues
    logger.error(`⚠️ Inventory deduction error for Order ${dbOrderId}:`, deductErr.message);
  }

  // 5. Send admin alert if any items are below threshold
  if (lowStockItems.length > 0) {
    try {
      await sendLowStockAlert(lowStockItems);
      logger.info(`📧 Low-stock admin alert sent for ${lowStockItems.length} item(s)`);
    } catch (alertErr) {
      logger.error('⚠️ Failed to send low-stock alert email:', alertErr.message);
    }
  }

  successResponse(res, 200, 'Payment verified and order confirmed', {
    orderId: order._id,
    paymentId: payment?._id,
    status: 'PAID',
  });
});
