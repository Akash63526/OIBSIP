const Redis = require('ioredis');
const config = require('./env');
const logger = require('../utils/logger');

const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

module.exports = redisClient;
