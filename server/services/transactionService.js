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
        // Get count for specific chain
        const count = await redis.zcard(`chain:${chain}:txs`);
        return { data: count };
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
}

module.exports = new TransactionService(); 