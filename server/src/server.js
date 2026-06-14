const http = require('http');
const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
// const socketHandler = require('./sockets/socketHandler'); // Will be implemented in Phase 7

const server = http.createServer(app);

// Initialize Socket.io
// socketHandler(server);

// Connect to MongoDB, start cron jobs, and start server
connectDB().then(() => {
  // Initialize scheduled cron jobs (hourly inventory threshold check)
  require('./jobs/cronJobs');

  server.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port} in ${config.env} mode`);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, { message: err.message, stack: err.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, { message: err.message, stack: err.stack });
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
