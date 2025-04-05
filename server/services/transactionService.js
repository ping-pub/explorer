const redis = require('../config/redis');
const { getRpcEndpoints } = require('../config/rpc');

/**
 * Transaction service that provides methods to interact with stored transaction data
 */
class TransactionService {
  constructor() {
    this.rpcEndpoints = getRpcEndpoints();
  }

  /**
   * Get all available chain names
   * @returns {Array<string>} Array of chain names
   */
  getAvailableChains() {
    return this.rpcEndpoints.map(rpc => rpc.name);
  }

  /**
   * Get a paginated list of transactions for a specific chain
   * 
   * @param {Object} options Query options
   * @param {string} options.chain Chain name (defaults to first available chain)
   * @param {number} options.page Page number (1-based)
   * @param {number} options.limit Items per page
   * @returns {Promise<Object>} Transactions and pagination metadata
   */
  async getTransactions({ chain, page = 1, limit = 10 } = {}) {
    // Use the first available chain if none specified
    const chainName = chain || (this.rpcEndpoints.length > 0 ? this.rpcEndpoints[0].name : null);
    
    if (!chainName) {
      throw new Error('No chain name provided and no default chains available');
    }
    
    // Convert to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    try {
      // Calculate range for zrevrange
      const start = (pageNum - 1) * limitNum;
      const end = start + limitNum - 1;
      
      // Get total count
      const totalCount = await redis.zcard(`chain:${chainName}:txs`);
      
      if (totalCount === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            page: pageNum,
            limit: limitNum,
            totalPages: 0,
          }
        };
      }
      
      // Get transaction hashes for the page (sorted by height in descending order)
      const txHashes = await redis.zrevrange(`chain:${chainName}:txs`, start, end);
      
      // Get transaction details
      const transactions = [];
      for (const txHash of txHashes) {
        const txData = await redis.hgetall(`tx:${chainName}:${txHash}`);
        
        if (txData && Object.keys(txData).length > 0) {
          // Parse JSON fields
          try {
            // Transform fields
            const transformedTxData = { ...txData };
            
            // Parse JSON fields
            if (txData.messages) {
              try {
                transformedTxData.messages = JSON.parse(txData.messages);
              } catch (e) {
                console.error(`Error parsing messages for tx ${txHash}:`, e);
                transformedTxData.messages = [];
              }
            }
            
            if (txData.fee) {
              try {
                transformedTxData.fee = JSON.parse(txData.fee);
              } catch (e) {
                console.error(`Error parsing fee for tx ${txHash}:`, e);
                transformedTxData.fee = {};
              }
            }
            
            // Convert numeric fields if needed
            if (txData.height) {
              transformedTxData.height = parseInt(txData.height, 10);
            }
            
            if (txData.status) {
              transformedTxData.status = parseInt(txData.status, 10);
            }
            
            transactions.push({
              ...transformedTxData,
              chain: chainName
            });
          } catch (err) {
            console.error(`Error processing transaction data for ${txHash}:`, err);
          }
        }
      }
      
      return {
        data: transactions,
        meta: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalCount / limitNum),
        }
      };
    } catch (error) {
      console.error(`Error getting transactions for chain ${chainName}:`, error);
      throw new Error(`Failed to retrieve transactions: ${error.message}`);
    }
  }

  /**
   * Get a transaction by its hash for a specific chain
   * 
   * @param {string} transactionId Transaction hash
   * @param {string} chain Chain name (optional, will search all chains if not provided)
   * @returns {Promise<Object>} Transaction data
   */
  async getTransactionById(transactionId, chain) {
    try {
      if (chain) {
        // If chain is specified, look only in that chain
        const txData = await redis.hgetall(`tx:${chain}:${transactionId}`);
        
        if (Object.keys(txData).length === 0) {
          return { data: null };
        }
        
        // Transform the transaction data
        const transformedTxData = { ...txData };
        
        // Parse JSON fields
        if (txData.messages) {
          try {
            transformedTxData.messages = JSON.parse(txData.messages);
          } catch (e) {
            console.error(`Error parsing messages for tx ${transactionId}:`, e);
            transformedTxData.messages = [];
          }
        }
        
        if (txData.fee) {
          try {
            transformedTxData.fee = JSON.parse(txData.fee);
          } catch (e) {
            console.error(`Error parsing fee for tx ${transactionId}:`, e);
            transformedTxData.fee = {};
          }
        }
        
        // Convert numeric fields if needed
        if (txData.height) {
          transformedTxData.height = parseInt(txData.height, 10);
        }
        
        if (txData.status) {
          transformedTxData.status = parseInt(txData.status, 10);
        }
        
        return {
          data: {
            ...transformedTxData,
            chain
          }
        };
      } else {
        // If no chain specified, search across all chains
        const chains = this.getAvailableChains();
        
        for (const chainName of chains) {
          const txData = await redis.hgetall(`tx:${chainName}:${transactionId}`);
          
          if (Object.keys(txData).length > 0) {
            // Transform the transaction data
            const transformedTxData = { ...txData };
            
            // Parse JSON fields
            if (txData.messages) {
              try {
                transformedTxData.messages = JSON.parse(txData.messages);
              } catch (e) {
                console.error(`Error parsing messages for tx ${transactionId}:`, e);
                transformedTxData.messages = [];
              }
            }
            
            if (txData.fee) {
              try {
                transformedTxData.fee = JSON.parse(txData.fee);
              } catch (e) {
                console.error(`Error parsing fee for tx ${transactionId}:`, e);
                transformedTxData.fee = {};
              }
            }
            
            // Convert numeric fields if needed
            if (txData.height) {
              transformedTxData.height = parseInt(txData.height, 10);
            }
            
            if (txData.status) {
              transformedTxData.status = parseInt(txData.status, 10);
            }
            
            return {
              data: {
                ...transformedTxData,
                chain: chainName
              }
            };
          }
        }
        
        return { data: null };
      }
    } catch (error) {
      console.error(`Error getting transaction ${transactionId}:`, error);
      throw new Error(`Failed to retrieve transaction: ${error.message}`);
    }
  }

  /**
   * Get transaction count for a specific chain
   * 
   * @param {string} chain Chain name (optional)
   * @returns {Promise<Object>} Count data
   */
  async getTransactionCount(chain) {
    try {
      if (chain) {
        // Generate historical data for the specific chain over the last 30 days
        const now = new Date();
        const days = 30;
        const labels = [];
        const counts = [];
        
        // Generate the date labels
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        
        // Get the current total count
        const totalCount = await redis.zcard(`chain:${chain}:txs`);
        
        // For now, generate a reasonable distribution of counts based on the total
        // In a real implementation, we would query historical data from Redis
        
        // Create a more realistic distribution - more recent days have more transactions
        let remainingCount = totalCount;
        const dailyCounts = [];
        
        for (let i = 0; i < days; i++) {
          // Allocate a percentage of remaining transactions to each day
          // More recent days get a higher percentage
          let factor;
          if (i < days / 3) {
            // Older third: distribute 15% of remaining
            factor = 0.15 / (days / 3);
          } else if (i < 2 * (days / 3)) {
            // Middle third: distribute 25% of remaining
            factor = 0.25 / (days / 3);
          } else {
            // Recent third: distribute 60% of remaining
            factor = 0.60 / (days / 3);
          }
          
          const dayCount = Math.round(remainingCount * factor);
          dailyCounts.push(dayCount);
          remainingCount -= dayCount;
        }
        
        // Ensure all transactions are accounted for due to rounding
        if (remainingCount > 0) {
          dailyCounts[dailyCounts.length - 1] += remainingCount;
        }
        
        // Add counts in reverse order (oldest to newest)
        for (let i = 0; i < days; i++) {
          counts.push(dailyCounts[i]);
        }
        
        return { 
          data: {
            labels,
            counts,
            total: totalCount
          }
        };
      } else {
        // Get counts for all chains
        const chains = this.getAvailableChains();
        let totalCount = 0;
        
        for (const chainName of chains) {
          const count = await redis.zcard(`chain:${chainName}:txs`);
          totalCount += count;
        }
        
        return { data: totalCount };
      }
    } catch (error) {
      console.error('Error getting transaction count:', error);
      throw new Error(`Failed to get transaction count: ${error.message}`);
    }
  }

  /**
   * Get statistics for all chains
   * 
   * @returns {Promise<Object>} Chain statistics
   */
  async getChainStats() {
    try {
      const chains = this.getAvailableChains();
      const stats = {};
      
      for (const chainName of chains) {
        const txCount = await redis.zcard(`chain:${chainName}:txs`);
        const latestHeight = await redis.get(`chain:${chainName}:max_height`) || 0;
        const processedHeight = await redis.get(`chain:${chainName}:latest_height`) || 0;
        
        stats[chainName] = {
          txCount,
          latestHeight: parseInt(latestHeight, 10),
          processedHeight: parseInt(processedHeight, 10),
          progress: latestHeight > 0 
            ? ((parseInt(processedHeight, 10) / parseInt(latestHeight, 10)) * 100).toFixed(2) + '%'
            : '0%'
        };
      }
      
      return { data: stats };
    } catch (error) {
      console.error('Error getting chain stats:', error);
      throw new Error(`Failed to get chain statistics: ${error.message}`);
    }
  }

  /**
   * Get historical transaction counts by day for a specific chain
   * 
   * @param {Object} options Query options
   * @param {string} options.chain Chain name (defaults to first available chain)
   * @param {number} options.days Number of days to return data for (default: 30)
   * @returns {Promise<Object>} Historical transaction counts by day
   */
  async getHistoricalTransactionCounts({ chain, days = 30 } = {}) {
    // Use the first available chain if none specified
    const chainName = chain || (this.rpcEndpoints.length > 0 ? this.rpcEndpoints[0].name : null);
    
    if (!chainName) {
      throw new Error('No chain name provided and no default chains available');
    }
    
    // Convert to number
    const daysNum = parseInt(days, 10);
    
    try {
      // Check if we have cached data first
      const cacheKey = `history:${chainName}:${daysNum}`;
      const cachedData = await redis.get(cacheKey);
      
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          console.log(`Using cached historical data for ${chainName} (${daysNum} days)`);
          return parsedData;
        } catch (err) {
          console.error('Error parsing cached history data:', err);
          // Continue with regenerating the data
        }
      }
      
      // Get all transactions for the chain
      const txHashes = await redis.zrange(`chain:${chainName}:txs`, 0, -1, 'WITHSCORES');
      
      // Initialize counts for each day
      const now = new Date();
      const countsMap = new Map();
      const labels = [];
      
      // Generate date labels for the period
      for (let i = daysNum - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        countsMap.set(dateKey, 0);
        // Format date as "MMM D" (e.g., "Feb 3")
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      
      // Process transactions in batches
      for (let i = 0; i < txHashes.length; i += 2) {
        const hash = txHashes[i];
        const blockHeight = parseInt(txHashes[i+1], 10);
        
        // Get the block to retrieve the timestamp
        // First try directly getting the timestamp if it's stored
        let timestamp = await redis.hget(`tx:${chainName}:${hash}`, 'timestamp');
        
        // If no timestamp directly on tx, try getting from block
        if (!timestamp) {
          const blockKey = `block:${chainName}:${blockHeight}`;
          const blockData = await redis.hget(blockKey, 'timestamp');
          if (blockData) {
            timestamp = blockData;
          }
        }
        
        // Only count if we have a timestamp
        if (timestamp) {
          const txDate = new Date(timestamp);
          const dateKey = txDate.toISOString().split('T')[0];
          
          // Only count if within our range
          if (countsMap.has(dateKey)) {
            countsMap.set(dateKey, countsMap.get(dateKey) + 1);
          }
        }
      }
      
      // Convert to array for chart
      const counts = [];
      for (let i = daysNum - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        counts.push(countsMap.get(dateKey) || 0);
      }
      
      const result = {
        data: {
          labels,
          counts
        }
      };
      
      // Cache the result
      const cacheTTL = parseInt(process.env.HISTORY_CACHE_TTL || 3600, 10); // Default 1 hour
      await redis.set(cacheKey, JSON.stringify(result), 'EX', cacheTTL);
      console.log(`Cached historical data for ${chainName} (${daysNum} days) with TTL of ${cacheTTL} seconds`);
      
      return result;
    } catch (error) {
      console.error(`Error getting historical transaction counts for chain ${chainName}:`, error);
      throw new Error(`Failed to retrieve historical transaction counts: ${error.message}`);
    }
  }
}

module.exports = new TransactionService(); 