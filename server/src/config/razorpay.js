const Razorpay = require('razorpay');
const config = require('./env');
const logger = require('../utils/logger');

let razorpayInstance = null;

try {
  if (config.razorpay.keyId && config.razorpay.keySecret) {
    razorpayInstance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
    logger.info('Razorpay initialized successfully');
  } else {
    logger.warn('Razorpay keys not found. Payment features will be disabled.');
  }
} catch (error) {
  logger.error('Failed to initialize Razorpay:', error);
}

module.exports = razorpayInstance;
