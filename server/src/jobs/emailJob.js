const logger = require('../utils/logger');
const { sendEmail } = require('../services/emailService');

// ─── Process Email Queue Job ─────────────────────────────────
// Processes an email job from the Bull queue — sends a real email
// using the configured SMTP transporter via emailService.
const processEmailJob = async (job) => {
  logger.info(`📧 Processing email job ${job.id}`);
  const { to, subject, html } = job.data;

  try {
    const info = await sendEmail({ to, subject, html });
    logger.info(`✅ Email job ${job.id} completed — sent to ${to} (MessageID: ${info?.messageId})`);
    return { success: true, messageId: info?.messageId };
  } catch (error) {
    logger.error(`❌ Email job ${job.id} failed:`, error.message);
    throw error;
  }
};

module.exports = processEmailJob;
