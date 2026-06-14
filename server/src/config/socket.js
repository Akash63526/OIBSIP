const socketIo = require('socket.io');
const logger = require('../utils/logger');
const socketHandler = require('../sockets/socketHandler');

const initSocket = (httpServer) => {
    const io = socketIo(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || origin.startsWith('http://localhost:') || origin === process.env.CLIENT_URL) {
                    return callback(null, true);
                }
                callback(new Error('Not allowed by CORS'));
            },
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    socketHandler(io);

    logger.info('Socket.IO server initialized');
    return io;
};

module.exports = initSocket;
