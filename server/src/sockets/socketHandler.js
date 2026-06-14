const logger = require('../utils/logger');
const orderEvents = require('./orderEvents');

module.exports = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    
    // Register event modules
    orderEvents(io, socket);

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
};
