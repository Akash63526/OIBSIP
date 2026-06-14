const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const logger = require('../utils/logger');
const { sendLowStockAlert } = require('../services/emailService');

// ─── Hourly Inventory Threshold Check ────────────────────────
// Runs every hour. Finds all inventory items where stock <= threshold
// and sends a low-stock alert email to the admin.
cron.schedule('0 * * * *', async () => {
  logger.info('⏰ Running cron job: Hourly inventory threshold check');

  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$stock', '$threshold'] },
    }).lean();

    if (lowStockItems.length > 0) {
      logger.warn(`🚨 Found ${lowStockItems.length} item(s) below stock threshold:`);
      lowStockItems.forEach((item) => {
        logger.warn(`   → ${item.itemName} (${item.category}): stock=${item.stock}, threshold=${item.threshold}`);
      });

      // Send admin alert email
      try {
        await sendLowStockAlert(lowStockItems);
        logger.info('📧 Low-stock admin alert email sent successfully.');
      } catch (emailErr) {
        logger.error('❌ Failed to send low-stock alert email:', emailErr.message);
      }
    } else {
      logger.info('✅ All stock levels are normal.');
    }
  } catch (error) {
    logger.error('❌ Error in inventory threshold cron job:', error.message);
  }
});

logger.info('📅 Cron jobs initialized — hourly inventory threshold check scheduled.');
