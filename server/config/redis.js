const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

// Redis connection configuration
const redisOptions = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : '127.0.0.1',
  port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port || '6379', 10) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  retryStrategy: (times) => {
    // Retry connection with exponential backoff
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

// Create Redis client
const redisClient = new Redis(redisOptions);

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

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