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
  }

  /**
   * Initialize workers for all configured RPC endpoints
   */
  async initialize() {
    if (this.rpcEndpoints.length === 0) {
      console.error('No RPC endpoints configured, cannot start workers');
      return;
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
   * Shutdown all workers
   */
  async shutdown() {
    console.log('Shutting down all transaction workers...');
    
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