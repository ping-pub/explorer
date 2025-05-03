const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

// Redis connection configuration with improved settings
const redisOptions = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : '127.0.0.1',
  port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port || '6379', 10) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  
  // Connection management
  connectTimeout: 10000,         // Connection timeout in ms
  disconnectTimeout: 2000,       // Disconnect timeout
  keepAlive: 30000,              // Keep-alive packet interval
  commandTimeout: 5000,          // Default command timeout
  
  // Reconnection strategy
  retryStrategy: (times) => {
    // Exponential backoff with a cap
    const delay = Math.min(Math.exp(times) * 50, 10000);
    console.log(`Redis connection retry attempt ${times} in ${delay}ms`);
    return delay;
  },
  
  // Error handling
  maxRetriesPerRequest: 3,
  enableAutoPipelining: true,    // Auto pipeline commands for better performance
  enableOfflineQueue: true,      // Queue commands when Redis is offline
  
  // Connection pool settings (if using cluster)
  maxLoadingRetryTime: 10000,    // Max time to retry during loading
  enableReadyCheck: true         // Check if Redis is ready before use
};

// Create Redis client
const redisClient = new Redis(redisOptions);

// Redis event listeners with better error handling
redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

redisClient.on('ready', () => {
  console.log('Redis client is ready');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('close', () => {
  console.log('Redis connection closed');
});

redisClient.on('reconnecting', (time) => {
  console.log(`Redis client reconnecting in ${time}ms`);
});

redisClient.on('end', () => {
  console.log('Redis connection ended');
});

// Helper function to create a Redis client with the same options
// This should be used when a new dedicated connection is needed
const createRedisClient = () => {
  const client = new Redis(redisOptions);
  
  client.on('error', (err) => {
    console.error('Redis client error:', err);
  });
  
  return client;
};

// Transaction data structure schema in Redis:
// 
// Keys:
// tx:{chainName}:{txHash} - Hash storing transaction details
// chain:{chainName}:latest_height - String storing latest block height
// chain:{chainName}:txs - Sorted set of transaction hashes by height
// chain:{chainName}:blocks - Set of blocks that have been processed
//
// Set expiration on transaction data if needed for memory management
// The sorted set gives us pagination capability and range queries

module.exports = redisClient;
module.exports.createRedisClient = createRedisClient; 