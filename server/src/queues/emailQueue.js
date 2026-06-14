const Queue = require('bull');
const config = require('../config/env');
const logger = require('../utils/logger');
const processEmailJob = require('../jobs/emailJob');

let emailQueue;

if (config.redis.url) {
  emailQueue = new Queue('email-queue', config.redis.url);

  emailQueue.process(processEmailJob);

  emailQueue.on('completed', (job) => {
    logger.info(`Email Job ${job.id} completed successfully`);
  });

  emailQueue.on('failed', (job, err) => {
    logger.error(`Email Job ${job.id} failed:`, err);
  });
} else {
  logger.warn('Redis URL not configured. Email queue disabled.');
  emailQueue = {
    add: async (name, data) => {
      logger.info(`Mock queue received job ${name}`);
      processEmailJob({ id: 'mock', data });
    }
  };
}

module.exports = emailQueue;
