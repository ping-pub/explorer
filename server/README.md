# Block Explorer Server

High-performance blockchain explorer server that indexes and serves transaction data from multiple RPC endpoints. The server uses Redis for fast data access and worker threads for parallel processing.

## Features

- Multi-chain support: Fetch transaction data from multiple blockchain RPC endpoints
- High-performance Redis storage: Fast reads and writes using Redis data structures
- Parallel processing: Worker threads for efficient data fetching and processing
- Scalable architecture: Independent workers for each RPC endpoint
- Efficient API endpoints: Chain-specific transaction querying

## Architecture Overview

This server uses a multi-layered architecture:

1. **Data Storage**: Redis for high-performance, in-memory data storage
2. **Worker Pool**: Multi-threaded workers to fetch and process blockchain data
3. **Service Layer**: Business logic for transaction retrieval and processing
4. **API Layer**: RESTful endpoints for querying transaction data

### Redis Data Schema

- `tx:{chainName}:{txHash}` - Hash storing transaction details
- `chain:{chainName}:latest_height` - String storing latest processed block height
- `chain:{chainName}:max_height` - String storing most recent chain height
- `chain:{chainName}:txs` - Sorted set of transaction hashes by height
- `chain:{chainName}:blocks` - Set of blocks that have been processed

## Installation

### Prerequisites

- Node.js 18+
- Redis 6+ (or use Docker)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# RPC Endpoints - comma-separated list of RPC_NAME=RPC_ENDPOINT pairs
RPC_ENDPOINTS=shannon=https://shannon-testnet-grove-api.beta.poktroll.com,mainnet=https://rpc.pokt.network

# Redis configuration
REDIS_URL=redis://127.0.0.1:6379
REDIS_PASSWORD=
REDIS_DB=0

# Worker configuration
WORKER_CONCURRENCY=2
HISTORICAL_BATCH_SIZE=50
```

### Docker Setup (Recommended)

The easiest way to run the server is with Docker:

```bash
# Start Redis and the API server
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Setup

```bash
# Install dependencies
npm install

# Start Redis (install separately or use Docker)
docker run -d -p 6379:6379 redis:7-alpine

# Start the server
npm start
```

## API Endpoints

| Endpoint | Method | Description | Query Parameters |
|----------|--------|-------------|-----------------|
| `/api/v1/transactions` | GET | Get paginated transactions | `page`, `limit`, `chain` |
| `/api/v1/transactions/count` | GET | Get transaction count | `chain` |
| `/api/v1/transactions/:transaction_id` | GET | Get transaction by ID | `chain` |
| `/api/v1/chains` | GET | Get available chains | None |
| `/api/v1/chains/stats` | GET | Get chain statistics | None |

### Example API Calls

```bash
# Get transactions from a specific chain (paginated)
curl http://localhost:3005/api/v1/transactions?chain=shannon&page=1&limit=10

# Get transaction count for all chains
curl http://localhost:3005/api/v1/transactions/count

# Get transaction count for a specific chain
curl http://localhost:3005/api/v1/transactions/count?chain=shannon

# Get a specific transaction
curl http://localhost:3005/api/v1/transactions/{TRANSACTION_HASH}

# Get available chains
curl http://localhost:3005/api/v1/chains

# Get chain statistics
curl http://localhost:3005/api/v1/chains/stats
```

## Performance Considerations

- Redis provides in-memory storage for fast access to transaction data
- Worker threads allow parallel processing of blockchain data
- Sorted sets in Redis enable efficient pagination and range queries
- Data is organized by chain name for rapid chain-specific queries

## Maintenance and Scaling

### Monitoring

Monitor Redis memory usage as the transaction database grows. Consider implementing:

- TTL (Time-To-Live) for older transactions if historical data isn't critical
- Redis persistence configuration for data durability
- Redis cluster for horizontal scaling

### Adding New Chains

To add a new chain, simply add it to the `RPC_ENDPOINTS` environment variable with the format:
```
RPC_ENDPOINTS=chain1=url1,chain2=url2,...
```

The system will automatically create workers for each new chain. 