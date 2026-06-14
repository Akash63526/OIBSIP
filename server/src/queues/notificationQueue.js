const Queue = require('bull');
const config = require('../config/env');
const logger = require('../utils/logger');

let notificationQueue;

if (config.redis.url) {
  notificationQueue = new Queue('notification-queue', config.redis.url);

  notificationQueue.process(async (job) => {
    logger.info(`Processing notification job ${job.id}`);
    return { success: true };
  });

  notificationQueue.on('completed', (job) => {
    logger.info(`Notification Job ${job.id} completed`);
  });

  notificationQueue.on('failed', (job, err) => {
    logger.error(`Notification Job ${job.id} failed:`, err);
  });
} else {
  logger.warn('Redis URL not configured. Notification queue disabled.');
  notificationQueue = {
    add: async (name, data) => {
      logger.info(`Mock notification queue received job ${name}`);
    }
  };
}

module.exports = notificationQueue;
