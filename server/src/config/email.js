// Email/SMTP configuration - Phase 8

module.exports = {
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT || 587,
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@pizzashop.com',
    FROM_NAME: process.env.FROM_NAME || 'Pizza Shop',

    // Enable/disable email
    ENABLE_EMAIL: process.env.ENABLE_EMAIL === 'true',

    // Template paths
    TEMPLATES_DIR: 'src/templates/emails',

    // Order confirmation template
    ORDER_CONFIRM_TEMPLATE: 'order_confirmation.ejs',

    // Order status update template
    ORDER_STATUS_TEMPLATE: 'order_status_update.ejs',

    // Low stock alert template
    LOW_STOCK_TEMPLATE: 'low_stock_alert.ejs'
};

