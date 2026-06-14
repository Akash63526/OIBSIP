const logger = require('../utils/logger');

module.exports = (io, socket) => {
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    logger.info(`User ${userId} joined room`);
  });

  socket.on('join_admin_room', () => {
    socket.join('admin_room');
    logger.info('Admin joined room');
  });
};

module.exports.emitOrderStatusUpdate = (io, userId, orderId, status) => {
  if (!io) return;
  io.to(`user_${userId}`).emit('order_status_update', { orderId, status });
  io.to('admin_room').emit('admin_order_update', { orderId, status });
};
