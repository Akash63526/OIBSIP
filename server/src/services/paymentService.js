const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const config = require('../config/env');

exports.createRazorpayOrder = async (amount, receiptId) => {
  if (!razorpay) throw new Error('Razorpay not initialized');
  return await razorpay.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: receiptId,
  });
};

exports.verifySignature = (orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return generatedSignature === signature;
};
