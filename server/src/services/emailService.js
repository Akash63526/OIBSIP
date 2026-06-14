const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');
const logger = require('../utils/logger');

// ─── Transporter Setup ────────────────────────────────────────
// Reads SMTP config from config.email.smtp (matches env.js structure)
let transporter;
if (config.email && config.email.smtp && config.email.smtp.host) {
  transporter = nodemailer.createTransport({
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    auth: {
      user: config.email.smtp.auth.user,
      pass: config.email.smtp.auth.pass,
    },
  });

  // Verify SMTP connection on startup
  transporter.verify()
    .then(() => logger.info('✅ SMTP transporter connected and ready'))
    .catch((err) => logger.warn('⚠️ SMTP transporter verification failed:', err.message));
} else {
  logger.warn('⚠️ SMTP not configured — emails will be logged but not sent.');
}

// ─── Send Raw Email ───────────────────────────────────────────
exports.sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    logger.warn(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    logger.info(`[MOCK EMAIL BODY]\n${html}`);
    return { messageId: 'mock-' + Date.now() };
  }

  const mailOptions = {
    from: config.email.from || '"SliceSprint" <noreply@slicesprint.com>',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email sent to ${to} — MessageID: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

// ─── Send Template Email ──────────────────────────────────────
// Reads an HTML file from /templates/email/, replaces {{placeholders}},
// and sends via sendEmail().
exports.sendTemplateEmail = async ({ to, subject, templateName, replacements = {} }) => {
  const templatePath = path.join(__dirname, '..', 'templates', 'email', templateName);

  let html;
  try {
    html = fs.readFileSync(templatePath, 'utf-8');
  } catch (err) {
    logger.error(`❌ Email template not found: ${templatePath}`);
    throw new Error(`Email template "${templateName}" not found`);
  }

  // Replace all {{key}} placeholders with values
  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, replacements[key]);
  });

  return await exports.sendEmail({ to, subject, html });
};

// ─── Send Low-Stock Alert Email ───────────────────────────────
// Convenience wrapper for admin stock alerts
exports.sendLowStockAlert = async (lowStockItems) => {
  const adminEmail = config.admin?.email;
  if (!adminEmail) {
    logger.warn('⚠️ ADMIN_EMAIL not configured — skipping low-stock alert.');
    return;
  }

  // Build the items list HTML
  const itemsHtml = lowStockItems
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">${item.itemName}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#EF4444;font-weight:700;text-align:center;">${item.stock}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#6B7280;text-align:center;">${item.threshold}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#6B7280;">${item.category}</td>
        </tr>`
    )
    .join('');

  return await exports.sendTemplateEmail({
    to: adminEmail,
    subject: `🚨 Low Stock Alert — ${lowStockItems.length} item(s) below threshold`,
    templateName: 'stockAlert.html',
    replacements: {
      itemCount: lowStockItems.length.toString(),
      itemRows: itemsHtml,
      year: new Date().getFullYear().toString(),
    },
  });
};
