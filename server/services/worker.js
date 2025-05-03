const { Worker } = require('worker_threads');
const path = require('path');
const redis = require('../config/redis');
const { getRpcEndpoints } = require('../config/rpc');

// Worker pool for parallel processing
class TransactionWorkerPool {
  constructor() {
    this.workers = new Map();
    this.rpcEndpoints = getRpcEndpoints();
    this.concurrency = parseInt(process.env.WORKER_CONCURRENCY || '2', 2);
    this.batchSize = parseInt(process.env.HISTORICAL_BATCH_SIZE || '50', 10);
    this.healthCheckInterval = null;
  }

  /**
   * Initialize workers for all configured RPC endpoints
   */
  async initialize() {
    if (this.rpcEndpoints.length === 0) {
      console.error('No RPC endpoints configured, cannot start workers');
      return;
    }

    // First, check Redis connection
    try {
      await this.checkRedisHealth();
    } catch (error) {
      console.error('Redis health check failed during initialization:', error);
      throw new Error('Failed to connect to Redis. Please check Redis configuration and ensure it is running.');
    }

    for (const rpc of this.rpcEndpoints) {
      try {
        // Create fresh workers for each RPC endpoint
        const newWorker = new Worker(path.join(__dirname, 'transactionWorker.js'), {
          workerData: {
            rpcName: rpc.name,
            rpcUrl: rpc.url,
            batchSize: this.batchSize
          }
        });

        newWorker.on('message', (message) => {
          if (message.type === 'log') {
            console.log(`[Worker ${rpc.name}]`, message.data);
          } else if (message.type === 'error') {
            console.error(`[Worker ${rpc.name}]`, message.data);
          } else if (message.type === 'status') {
            console.log(`[Worker ${rpc.name}] Status:`, message.data);
          }
        });

        newWorker.on('error', (err) => {
          console.error(`Worker for ${rpc.name} encountered an error:`, err);
          this.restartWorker(rpc.name, rpc.url);
        });

        newWorker.on('exit', (code) => {
          if (code !== 0) {
            console.error(`Worker for ${rpc.name} exited with code ${code}`);
            this.restartWorker(rpc.name, rpc.url);
          }
        });

        this.workers.set(rpc.name, newWorker);
        console.log(`Started worker for RPC endpoint ${rpc.name} (${rpc.url})`);
      } catch (error) {
        console.error(`Failed to start worker for RPC endpoint ${rpc.name}:`, error);
      }
    }

    // Start periodic health checks
    this.startHealthChecks();
  }

  /**
   * Restart a worker that has crashed or exited
   */
  async restartWorker(rpcName, rpcUrl) {
    console.log(`Restarting worker for RPC endpoint ${rpcName}...`);
    
    // Remove the old worker reference
    if (this.workers.has(rpcName)) {
      this.workers.delete(rpcName);
    }
    
    // Wait before restarting to avoid rapid restart cycles
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      const newWorker = new Worker(path.join(__dirname, 'transactionWorker.js'), {
        workerData: {
          rpcName,
          rpcUrl,
          batchSize: this.batchSize
        }
      });

      newWorker.on('message', (message) => {
        if (message.type === 'log') {
          console.log(`[Worker ${rpcName}]`, message.data);
        } else if (message.type === 'error') {
          console.error(`[Worker ${rpcName}]`, message.data);
        }
      });

      newWorker.on('error', (err) => {
        console.error(`Worker for ${rpcName} encountered an error:`, err);
        this.restartWorker(rpcName, rpcUrl);
      });

      newWorker.on('exit', (code) => {
        if (code !== 0) {
          console.error(`Worker for ${rpcName} exited with code ${code}`);
          this.restartWorker(rpcName, rpcUrl);
        }
      });

      this.workers.set(rpcName, newWorker);
      console.log(`Restarted worker for RPC endpoint ${rpcName}`);
    } catch (error) {
      console.error(`Failed to restart worker for RPC endpoint ${rpcName}:`, error);
      // Try again after a longer delay
      setTimeout(() => this.restartWorker(rpcName, rpcUrl), 10000);
    }
  }

  /**
   * Check Redis health and connection
   */
  async checkRedisHealth() {
    try {
      const ping = await redis.ping();
      if (ping !== 'PONG') {
        throw new Error('Redis ping did not return PONG');
      }
      
      // Check memory usage
      const info = await redis.info('memory');
      console.log('Redis memory info:', info);
      
      return true;
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }

  /**
   * Start periodic health checks for Redis
   */
  startHealthChecks() {
    // Clear any existing interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    // Run health check every 5 minutes
    this.healthCheckInterval = setInterval(async () => {
      console.log('Running Redis health check...');
      
      const isHealthy = await this.checkRedisHealth();
      if (!isHealthy) {
        console.error('Redis health check failed, attempting to recover...');
        // Try to flush some data if necessary
        try {
          // Check if we need to trim some data (optional)
          const txsSize = await redis.zcard('chain:*:txs');
          console.log(`Current transactions in Redis: ${txsSize}`);
          
          // Log the status but don't take action automatically
        } catch (error) {
          console.error('Failed to check Redis data size:', error);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Shutdown all workers
   */
  async shutdown() {
    console.log('Shutting down all transaction workers...');
    
    // Clear health check interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    const promises = [];
    for (const [name, worker] of this.workers.entries()) {
      console.log(`Terminating worker for ${name}...`);
      promises.push(worker.terminate());
    }
    
    await Promise.all(promises);
    this.workers.clear();
    console.log('All transaction workers have been terminated');
  }
}

module.exports = new TransactionWorkerPool(); 