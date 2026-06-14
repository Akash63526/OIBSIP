const Inventory = require('../models/Inventory');
const logger = require('../utils/logger');

const runStockCheck = async () => {
  logger.info('Starting manual stock check job...');
  try {
    const lowStockItems = await Inventory.find({ $expr: { $lte: ['$stock', '$threshold'] } });
    
    if (lowStockItems.length > 0) {
      logger.warn(`CRITICAL: Found ${lowStockItems.length} items low on stock.`);
      // In production, dispatch an email or SMS to the manager
    } else {
      logger.info('Stock levels are normal.');
    }
  } catch (error) {
    logger.error('Error executing stock check job', error);
  }
};

module.exports = runStockCheck;
