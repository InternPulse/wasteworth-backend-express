const redisClient = require('../config/redis');

/**
 * Cache middleware for GET requests
 * @param {number} duration - Cache duration in seconds (default: 3600 = 1 hour)
 */
const cache = (duration = 3600) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    try {
      const client = redisClient.getClient();
      // Include userId in cache key for user-specific routes
      const key = req.user
        ? `cache:${req.originalUrl || req.url}:${req.user.id}`
        : `cache:${req.originalUrl || req.url}`;

      const cachedData = await client.get(key);
      if (cachedData) {
        console.log(`Cache HIT: ${key}`);
        return res.json(JSON.parse(cachedData));
      }

      console.log(`Cache MISS: ${key}`);
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        client.setEx(key, duration, JSON.stringify(data))
          .catch(err => console.error('Cache set error:', err));
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Clear cache by pattern
 * @param {string} pattern - Redis key pattern (e.g., 'cache:users*')
 */
const clearCache = async (pattern) => {
  try {
    const client = redisClient.getClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
      console.log(`Cleared ${keys.length} cache keys matching: ${pattern}`);
    }
  } catch (error) {
    console.error('Clear cache error:', error);
  }
};

/**
 * Clear specific cache key
 * @param {string} key
 */
const clearCacheKey = async (key) => {
  try {
    const client = redisClient.getClient();
    await client.del(key);
    console.log(`Cleared cache key: ${key}`);
  } catch (error) {
    console.error('Clear cache key error:', error);
  }
};

module.exports = { cache, clearCache, clearCacheKey };