const redisClient = require('../config/redis');
const logger = require('../utils/logger');

exports.getCache = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error('Cache get error:', err);
    return null;
  }
};

exports.setCache = async (key, value, expInSeconds = 3600) => {
  if (!redisClient) return;
  try {
    await redisClient.setEx(key, expInSeconds, JSON.stringify(value));
  } catch (err) {
    logger.error('Cache set error:', err);
  }
};

exports.clearCache = async (keyPattern) => {
  if (!redisClient) return;
  try {
    const keys = await redisClient.keys(keyPattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    logger.error('Cache clear error:', err);
  }
};
