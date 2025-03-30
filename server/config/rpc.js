const dotenv = require('dotenv');

dotenv.config();

/**
 * Parse RPC endpoints from environment variables
 * Format: RPC_ENDPOINTS=name1=url1,name2=url2
 * 
 * @returns {Array<{name: string, url: string}>} Array of RPC configs
 */
function parseRpcEndpoints() {
  const rpcEndpointsStr = process.env.RPC_ENDPOINTS || '';
  
  if (!rpcEndpointsStr) {
    console.warn('No RPC endpoints configured in environment variables');
    return [];
  }
  
  try {
    const endpoints = rpcEndpointsStr.split(',')
      .map(endpoint => {
        const [name, url] = endpoint.split('=');
        if (!name || !url) {
          console.warn(`Invalid RPC endpoint format: ${endpoint}`);
          return null;
        }
        return { name: name.trim(), url: url.trim() };
      })
      .filter(Boolean);
    
    if (endpoints.length === 0) {
      console.warn('No valid RPC endpoints found in configuration');
    } else {
      console.log(`Loaded ${endpoints.length} RPC endpoints: ${endpoints.map(e => e.name).join(', ')}`);
    }
    
    return endpoints;
  } catch (error) {
    console.error('Error parsing RPC endpoints:', error);
    return [];
  }
}

// Fallback to single RPC for backward compatibility
function getSingleRpcEndpoint() {
  return process.env.rpc_endpoint || 'https://shannon-testnet-grove-api.beta.poktroll.com';
}

module.exports = {
  getRpcEndpoints: parseRpcEndpoints,
  getSingleRpcEndpoint
}; 