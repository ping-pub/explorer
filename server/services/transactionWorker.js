const { parentPort, workerData } = require('worker_threads');
const { sha256 } = require('@cosmjs/crypto');
const { fromBase64, toHex, toBase64 } = require('@cosmjs/encoding');
const { decodeTxRaw } = require('@cosmjs/proto-signing');
const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

// Worker data from parent thread
const { rpcName, rpcUrl, batchSize } = workerData;

// Create a dedicated Redis connection for this worker
const redisOptions = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : '127.0.0.1',
  port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port || '6379', 10) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
};

const redis = new Redis(redisOptions);

// Log handler to send logs back to main thread
function log(message) {
  parentPort.postMessage({ type: 'log', data: message });
}

function report_error(message) {
  parentPort.postMessage({ type: 'error', data: message });
}

function status(data) {
  parentPort.postMessage({ type: 'status', data });
}

// Helper function to handle BigInt serialization
function safeJsonStringify(obj) {
  return JSON.stringify(obj, (_, value) => 
    typeof value === 'bigint' ? value.toString() : value
  );
}

// Hash transaction function
function hashTx(raw) {
  return toHex(sha256(raw)).toUpperCase();
}

// RPC fetch functions
async function fetchLatestBlock() {
  try {
    const lbRes = await fetch(`${rpcUrl}/cosmos/base/tendermint/v1beta1/blocks/latest`);
    if (!lbRes.ok) {
      throw new Error(`Failed to fetch latest block: ${lbRes.status} ${lbRes.statusText}`);
    }
    const latestBlock = await lbRes.json();
    return latestBlock;
  } catch (error) {
    throw new Error(`Error fetching latest block: ${error.message}`);
  }
}

async function fetchTx(hash) {
  try {
    const lbRes = await fetch(`${rpcUrl}/cosmos/tx/v1beta1/txs/${hash}`);
    if (!lbRes.ok) {
      throw new Error(`Failed to fetch transaction: ${lbRes.status} ${lbRes.statusText}`);
    }
    const tx = await lbRes.json();
    return tx;
  } catch (error) {
    throw new Error(`Error fetching transaction ${hash}: ${error.message}`);
  }
}

async function fetchTxByBlock(height) {
  try {
    const lbRes = await fetch(`${rpcUrl}/cosmos/base/tendermint/v1beta1/blocks/${height}`);
    if (!lbRes.ok) {
      throw new Error(`Failed to fetch block: ${lbRes.status} ${lbRes.statusText}`);
    }
    const blockDetails = await lbRes.json();
    return blockDetails;
  } catch (error) {
    throw new Error(`Error fetching block ${height}: ${error.message}`);
  }
}

// Process and store transactions using Redis
async function processTransactions(blockData, height) {
  const pipeline = redis.pipeline();
  let processedCount = 0;
  let newCount = 0;

  try {
    // Add this block to the processed blocks set
    pipeline.sadd(`chain:${rpcName}:blocks`, height);
    
    // Process each transaction in the block
    for (const tx of blockData.block.data.txs || []) {
      processedCount++;
      const txHash = hashTx(fromBase64(tx));
      
      // Check if this transaction is already in Redis
      const exists = await redis.exists(`tx:${rpcName}:${txHash}`);
      if (exists) {
        log(`Transaction ${txHash} already exists in Redis, skipping`);
        continue;
      }
      
      // Fetch detailed transaction data
      const txRes = await fetchTx(txHash);
      
      // Parse transaction data
      const decodedTx = decodeTxRaw(fromBase64(tx));
      const txData = {
        status: txRes.tx_response.code,
        timestamp: txRes.tx_response.timestamp,
        messages: safeJsonStringify(decodedTx.body.messages),
        fee: safeJsonStringify(decodedTx.authInfo.fee),
        hash: txHash,
        height: height.toString() // Ensure height is stored as string
      };
      
      // Store transaction data in Redis
      // Use a hash to store transaction details
      Object.entries(txData).forEach(([key, value]) => {
        pipeline.hset(`tx:${rpcName}:${txHash}`, key, value);
      });
      
      // Add to the sorted set of transactions by height for fast range queries
      pipeline.zadd(`chain:${rpcName}:txs`, height, txHash);
      
      newCount++;
    }
    
    if (newCount > 0) {
      // Update latest processed block height if this is the newest block we've seen
      pipeline.set(`chain:${rpcName}:latest_height`, height);
      log(`Processed block ${height}: ${newCount} new transactions out of ${processedCount} total`);
    }
    
    // Execute the pipeline
    await pipeline.exec();
    return newCount;
  } catch (error) {
    report_error(`Error processing transactions for block ${height}: ${error.message}`);
    return 0;
  }
}

// Function to fetch historical blocks from newest to oldest
async function fetchHistoricalBlocks() {
  try {
    // Get the current latest block height from chain
    const latestBlock = await fetchLatestBlock();
    const latestHeight = parseInt(latestBlock.block.header.height, 10);
    
    // Store the latest block height
    await redis.set(`chain:${rpcName}:max_height`, latestHeight);
    
    // Find the last processed block height, or start from the latest if none found
    let lastProcessedHeight = parseInt(await redis.get(`chain:${rpcName}:latest_height`) || '0', 10);
    
    // If we already have processed blocks, start from there minus a small overlap
    // to handle any reorgs
    let startHeight = lastProcessedHeight > 0 ? Math.max(1, lastProcessedHeight - 5) : latestHeight;
    
    // Process blocks from newest to oldest with a batch approach
    log(`Starting historical processing from height ${startHeight} down to 1`);
    
    // Start from the determined height
    let currentHeight = startHeight;
    
    // Only process historical blocks if there's a significant number to process
    // (Otherwise let the monitor process them)
    if (currentHeight <= 10) {
      log(`No significant historical blocks to process for chain ${rpcName}, skipping historical processing`);
      return;
    }
    
    while (currentHeight > 0) {
      const batchEnd = Math.max(1, currentHeight - batchSize + 1);
      let batchProcessed = 0;
      
      // Process blocks in this batch
      for (let height = currentHeight; height >= batchEnd; height--) {
        // Check if we already processed this block
        const blockProcessed = await redis.sismember(`chain:${rpcName}:blocks`, height);
        if (blockProcessed) {
          log(`Block ${height} already processed, skipping`);
          continue;
        }
        
        try {
          const blockData = await fetchTxByBlock(height);
          const txCount = await processTransactions(blockData, height);
          batchProcessed += txCount;
          
          // Update latest_height if this is a newer block than what we've seen
          // This helps keep the monitoring in sync
          if (height > lastProcessedHeight) {
            lastProcessedHeight = height;
            await redis.set(`chain:${rpcName}:latest_height`, height);
          }
          
          // Small delay to avoid overwhelming the RPC
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          report_error(`Failed to process block ${height}: ${error.message}`);
        }
      }
      
      // Update status
      status({
        chain: rpcName,
        currentHeight: batchEnd,
        latestHeight,
        progress: ((latestHeight - batchEnd) / latestHeight * 100).toFixed(2) + '%',
        batchProcessed
      });
      
      // Move to the next batch
      currentHeight = batchEnd - 1;
      
      // Take a break between batches to avoid overwhelming the node
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    log(`Historical processing completed for chain ${rpcName}`);
  } catch (error) {
    report_error(`Historical processing error: ${error.message}`);
  }
}

// Function to monitor for new blocks
async function monitorNewBlocks() {
  log(`Starting new block monitor for chain ${rpcName}`);
  
  try {
    // Get the latest height from the chain
    const latestBlock = await fetchLatestBlock();
    const currentChainHeight = parseInt(latestBlock.block.header.height, 10);
    
    // Store the current chain height
    await redis.set(`chain:${rpcName}:max_height`, currentChainHeight);
    log(`Set max_height for ${rpcName} to ${currentChainHeight}`);
    
    // Get the last processed height from Redis
    let lastProcessedHeight = parseInt(await redis.get(`chain:${rpcName}:latest_height`) || '0', 10);
    log(`Block monitor initialized: Chain height=${currentChainHeight}, Last processed=${lastProcessedHeight}`);
    
    // Monitor interval
    setInterval(async () => {
      try {
        // Always get fresh value from Redis to ensure we don't miss blocks
        // between monitor intervals or if multiple workers are running
        lastProcessedHeight = parseInt(await redis.get(`chain:${rpcName}:latest_height`) || '0', 10);
        
        const latestBlock = await fetchLatestBlock();
        const currentHeight = parseInt(latestBlock.block.header.height, 10);
        
        // Update max_height to reflect the current chain tip
        await redis.set(`chain:${rpcName}:max_height`, currentHeight);
        
        // Check if there are new blocks to process
        if (currentHeight > lastProcessedHeight) {
          const blockGap = currentHeight - lastProcessedHeight;
          
          // If there's a large gap, log it but still process in batches
          if (blockGap > 100) {
            log(`Large block gap detected: ${blockGap} blocks between ${lastProcessedHeight} and ${currentHeight}`);
          } else {
            log(`New block(s) detected: ${currentHeight} (previous: ${lastProcessedHeight}, gap: ${blockGap})`);
          }
          
          // Define a reasonable batch size for processing
          const MONITOR_BATCH_SIZE = 10; 
          
          // Process blocks in manageable batches to avoid timeouts
          for (let batchStart = lastProcessedHeight + 1; batchStart <= currentHeight; batchStart += MONITOR_BATCH_SIZE) {
            const batchEnd = Math.min(batchStart + MONITOR_BATCH_SIZE - 1, currentHeight);
            log(`Processing blocks ${batchStart} to ${batchEnd}...`);
            
            // Process each block in the batch
            for (let height = batchStart; height <= batchEnd; height++) {
              try {
                const blockData = await fetchTxByBlock(height);
                await processTransactions(blockData, height);
                
                // Update after each successful block processing
                lastProcessedHeight = height;
                await redis.set(`chain:${rpcName}:latest_height`, height);
              } catch (error) {
                report_error(`Failed to process new block ${height}: ${error.message}`);
              }
            }
            
            // Report status after each batch
            status({
              chain: rpcName,
              currentHeight: batchEnd,
              latestHeight: currentHeight,
              progress: ((batchEnd / currentHeight) * 100).toFixed(2) + '%',
              monitoring: true
            });
          }
        }
      } catch (error) {
        report_error(`Error monitoring for new blocks: ${error.message}`);
      }
    }, 10000); // Check every 10 seconds
  } catch (error) {
    report_error(`Failed to initialize block monitor: ${error.message}`);
  }
}

// Main worker function
async function runWorker() {
  log(`Starting worker for chain ${rpcName} with RPC endpoint ${rpcUrl}`);
  
  try {
    // First get the current chain tip
    const latestBlock = await fetchLatestBlock();
    const latestHeight = parseInt(latestBlock.block.header.height, 10);
    
    // Update max_height
    await redis.set(`chain:${rpcName}:max_height`, latestHeight);
    log(`Chain ${rpcName} current height: ${latestHeight}`);
    
    // Check if we have a latest_height in Redis, indicating some blocks were already processed
    const processedHeight = await redis.get(`chain:${rpcName}:latest_height`);
    
    if (processedHeight) {
      log(`Found existing processed data for chain ${rpcName}, last processed height: ${processedHeight}`);
    } else {
      log(`No existing data found for chain ${rpcName}, will start historical processing`);
    }
    
    // Start the monitoring for new blocks first
    monitorNewBlocks();
    
    // Then process historical blocks
    await fetchHistoricalBlocks();
  } catch (error) {
    report_error(`Worker initialization error: ${error.message}`);
  }
}

// Handle errors and cleanup
process.on('unhandledRejection', (reason) => {
  report_error(`Unhandled Promise Rejection: ${reason}`);
});

redis.on('error', (err) => {
  report_error(`Redis error: ${err.message}`);
});

// Clean up on exit
process.on('SIGINT', async () => {
  log('Worker received SIGINT, shutting down...');
  await redis.quit();
  process.exit(0);
});

// Start the worker
runWorker().catch(err => report_error(`Worker failed to start: ${err.message}`)); 