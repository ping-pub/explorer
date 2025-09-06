# Pocket Network Explorer Indexer API Documentation

This document outlines the REST API endpoints that an **indexer** needs to implement to serve a Pocket Network explorer. The indexer will fetch data from Pocket Network blockchain nodes and external sources, then expose its own standardized REST API endpoints for the explorer to consume.

## Overview

Pocket Network is a decentralized infrastructure network that provides RPC services to blockchain applications. The **indexer** acts as an intermediary layer that:

1. **Fetches data** from Pocket Network blockchain nodes and external sources
2. **Processes and indexes** the data for fast retrieval
3. **Exposes REST API endpoints** for the explorer to consume
4. **Provides real-time updates** and historical data

The explorer will use the indexer's API instead of making direct RPC calls to blockchain nodes, ensuring better performance, reliability, and data consistency.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Pocket        │    │     Indexer     │    │    Explorer     │
│   Network       │───▶│                 │───▶│                 │
│   Blockchain    │    │ • Fetches data  │    │ • Consumes API  │
│   Nodes         │    │ • Processes     │    │ • Displays UI   │
│                 │    │ • Indexes       │    │ • User queries  │
└─────────────────┘    │ • Exposes API   │    └─────────────────┘
                       └─────────────────┘
```

## Base URL Structure

The indexer will expose these endpoints under its own domain:

```
{indexer_endpoint}/pokt-network/poktroll/{module}/{resource}  # Pocket Network specific
{indexer_endpoint}/cosmos/{module}/v1beta1/{resource}        # Core blockchain data
```

**Note**: These are the endpoints the **indexer** will expose, not the endpoints it fetches from.

## Core Blockchain Data (Required for Pocket Network)

### Authentication & Authorization

#### Get All Accounts
- **Endpoint**: `GET /cosmos/auth/v1beta1/accounts`
- **Query Parameters**: 
  - `pagination.limit` (optional): Number of accounts per page
  - `pagination.offset` (optional): Offset for pagination
  - `pagination.count_total` (optional): Whether to count total records
- **Description**: Get all accounts with pagination
- **Response**: Paginated list of accounts

#### Get Account by Address
- **Endpoint**: `GET /cosmos/auth/v1beta1/accounts/{address}`
- **Path Parameters**: `address` - Account address
- **Description**: Get specific account information
- **Response**: Account details

### Bank Module

#### Get Account Balances
- **Endpoint**: `GET /cosmos/bank/v1beta1/balances/{address}`
- **Path Parameters**: `address` - Account address
- **Description**: Get account balances
- **Response**: Paginated list of coin balances

#### Get Total Supply
- **Endpoint**: `GET /cosmos/bank/v1beta1/supply`
- **Query Parameters**: Standard pagination parameters
- **Description**: Get total supply of all tokens
- **Response**: Paginated list of coin supplies

### Staking Module

#### Get All Validators
- **Endpoint**: `GET /cosmos/staking/v1beta1/validators`
- **Query Parameters**: 
  - `status` - Validator status (bonded, unbonded, unbonding)
  - `pagination.limit` - Number of validators per page
- **Description**: Get all validators
- **Response**: Paginated list of validators

#### Get Validator by Address
- **Endpoint**: `GET /cosmos/staking/v1beta1/validators/{validator_addr}`
- **Path Parameters**: `validator_addr` - Validator address
- **Description**: Get specific validator information
- **Response**: Validator details

#### Get Delegator Delegations
- **Endpoint**: `GET /cosmos/staking/v1beta1/delegations/{delegator_addr}`
- **Path Parameters**: `delegator_addr` - Delegator address
- **Description**: Get delegations for specific delegator
- **Response**: Paginated list of delegations

#### Get Delegator Unbonding
- **Endpoint**: `GET /cosmos/staking/v1beta1/delegators/{delegator_addr}/unbonding_delegations`
- **Path Parameters**: `delegator_addr` - Delegator address
- **Description**: Get unbonding delegations for specific delegator
- **Response**: Paginated list of unbonding delegations

### Distribution Module

#### Get Delegator Rewards
- **Endpoint**: `GET /cosmos/distribution/v1beta1/delegators/{delegator_addr}/rewards`
- **Path Parameters**: `delegator_addr` - Delegator address
- **Description**: Get delegator rewards
- **Response**: Rewards by validator and total

### Tendermint/Blockchain Data

#### Get Latest Block
- **Endpoint**: `GET /cosmos/base/tendermint/v1beta1/blocks/latest`
- **Description**: Get latest block information
- **Response**: Latest block data

#### Get Block by Height
- **Endpoint**: `GET /cosmos/base/tendermint/v1beta1/blocks/{height}`
- **Path Parameters**: `height` - Block height
- **Description**: Get block at specific height
- **Response**: Block data

### Transaction Module

#### Get Transactions
- **Endpoint**: `GET /cosmos/tx/v1beta1/txs`
- **Query Parameters**: 
  - `order_by` - Order by field (1: ascending, 2: descending)
  - `query` - Query filter (e.g., message.sender='address')
  - `pagination.limit` - Number of transactions per page
  - `pagination.offset` - Offset for pagination
- **Description**: Get transactions with filtering and pagination
- **Response**: Paginated list of transactions

#### Get Transaction by Hash
- **Endpoint**: `GET /cosmos/tx/v1beta1/txs/{hash}`
- **Path Parameters**: `hash` - Transaction hash
- **Description**: Get specific transaction details
- **Response**: Transaction and transaction response

## Pocket Network Specific Modules

### Applications

#### Get All Applications
- **Endpoint**: `GET /pokt-network/poktroll/application/application`
- **Query Parameters**: Standard pagination parameters
- **Description**: Get all applications that use Pocket Network services
- **Response**: Paginated list of applications

#### Get Application by Address
- **Endpoint**: `GET /pokt-network/poktroll/application/application/{address}`
- **Path Parameters**: `address` - Application address
- **Description**: Get specific application information including stake and service usage
- **Response**: Application details

### Gateways

#### Get All Gateways
- **Endpoint**: `GET /pokt-network/poktroll/gateway/gateway`
- **Query Parameters**: Standard pagination parameters
- **Description**: Get all gateways that route RPC requests
- **Response**: Paginated list of gateways

#### Get Gateway by Address
- **Endpoint**: `GET /pokt-network/poktroll/gateway/gateway/{address}`
- **Path Parameters**: `address` - Gateway address
- **Description**: Get specific gateway information including stake and routing data
- **Response**: Gateway details

### Suppliers

#### Get All Suppliers
- **Endpoint**: `GET /pokt-network/poktroll/supplier/supplier`
- **Query Parameters**: Standard pagination parameters
- **Description**: Get all suppliers that provide RPC services
- **Response**: Paginated list of suppliers

#### Get Supplier by Address
- **Endpoint**: `GET /pokt-network/poktroll/supplier/supplier/{address}`
- **Path Parameters**: `address` - Supplier address
- **Description**: Get specific supplier information including stake and service offerings
- **Response**: Supplier details

### Services

#### Get All Services
- **Endpoint**: `GET /pokt-network/poktroll/service/service`
- **Query Parameters**: Standard pagination parameters
- **Description**: Get all RPC services available on the network
- **Response**: Paginated list of services

#### Get Service by Address
- **Endpoint**: `GET /pokt-network/poktroll/service/service/{address}`
- **Path Parameters**: `address` - Service address
- **Description**: Get specific service information
- **Response**: Service details

#### Get Relay Mining Difficulty
- **Endpoint**: `GET /pokt-network/poktroll/service/relay_mining_difficulty`
- **Query Parameters**: Standard pagination parameters
- **Description**: Get relay mining difficulty information for service distribution
- **Response**: Paginated list of relay mining difficulty data

## Standard Pagination Parameters

Most endpoints support the following pagination parameters:

- `pagination.limit` - Number of items per page
- `pagination.offset` - Offset for pagination
- `pagination.count_total` - Whether to count total records
- `pagination.reverse` - Whether to reverse order

## Response Format

All endpoints return JSON responses with the following structure:

```json
{
  "data": "actual response data",
  "pagination": {
    "next_key": "next page key",
    "total": "total count if count_total=true"
  }
}
```

## Error Handling

The API should return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses should include:

```json
{
  "error": "Error message",
  "code": "Error code"
}
```

## Rate Limiting

Consider implementing rate limiting to prevent abuse:

- **Rate Limit**: 1000 requests per minute per IP
- **Headers**: Include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Caching

Implement appropriate caching headers:

- **Cache-Control**: `max-age=60` for frequently changing data
- **ETag**: For conditional requests
- **Last-Modified**: For resource modification tracking

## Security Considerations

- Implement CORS policies
- Validate all input parameters
- Sanitize query strings
- Use HTTPS in production
- Implement request logging and monitoring

## Implementation Notes

### Indexer Responsibilities

1. **Data Fetching**: The indexer must fetch data from these sources:
   - Pocket Network blockchain nodes (RPC endpoints)
   - External APIs for additional data
   - Real-time blockchain events

2. **Data Processing**: 
   - Parse and validate blockchain data
   - Transform data into consistent formats
   - Calculate derived metrics and statistics

3. **Data Storage**: 
   - Maintain a synchronized database with all Pocket Network data
   - Implement efficient indexing for fast queries
   - Store historical data for time-based analysis

4. **API Exposure**: 
   - Expose the documented endpoints for the explorer to consume
   - Implement proper caching and rate limiting
   - Provide real-time updates via WebSocket (optional)

### Data Sources for Indexer

The indexer will need to fetch data from these **source endpoints**:

#### Pocket Network Blockchain Nodes
- Node urls chain wise are available in env file.

#### External Data Sources
- **CoinGecko API**: For POKT token price and market data
- **Pocket Network Stats**: For network-wide statistics
- **Service Provider APIs**: For additional service information

## Example Usage

### Explorer Consuming Indexer API

```javascript
// Get all applications from the indexer
const applicationsResponse = await fetch('https://indexer.example.com/pokt-network/poktroll/application/application?pagination.limit=50');
const applications = await applicationsResponse.json();

// Get specific supplier information from the indexer
const supplierResponse = await fetch('https://indexer.example.com/pokt-network/poktroll/supplier/supplier/supplier123');
const supplier = await supplierResponse.json();

// Get account balances from the indexer
const balanceResponse = await fetch('https://indexer.example.com/cosmos/bank/v1beta1/balances/address123');
const balances = await balanceResponse.json();

// Get latest block from the indexer
const blockResponse = await fetch('https://indexer.example.com/cosmos/base/tendermint/v1beta1/blocks/latest');
const block = await blockResponse.json();
```

### Indexer Fetching from Blockchain (Internal Implementation)

```javascript
// Indexer internally fetching from Pocket Network blockchain
const blockchainResponse = await fetch('https://shannon-grove-rpc.mainnet.poktroll.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'abci_query',
    params: { path: '/pokt-network/poktroll/application/application' },
    id: 1
  })
});

// Indexer processing and storing the data
const applications = await blockchainResponse.json();
await database.storeApplications(applications);

// Indexer then exposing the processed data via its own API
app.get('/pokt-network/poktroll/application/application', async (req, res) => {
  const apps = await database.getApplications(req.query);
  res.json(apps);
});
```

## Health Check Endpoints

### Basic Health Check
- **Endpoint**: `GET /health`
- **Description**: Basic health status of the indexer
- **Response**: Health status and basic metrics

### Detailed Health Check
- **Endpoint**: `GET /health/detailed`
- **Description**: Detailed health information including database status
- **Response**: Comprehensive health metrics

### Metrics Endpoint
- **Endpoint**: `GET /metrics`
- **Description**: Prometheus-compatible metrics
- **Response**: Metrics in Prometheus format

## Data Synchronization

### Indexer Data Flow

The indexer should implement this data flow:

1. **Block Processing**: 
   - Monitor new blocks as they arrive on the blockchain
   - Process block data and extract relevant information
   - Update internal database with new block data

2. **Transaction Indexing**: 
   - Index all transactions with proper metadata
   - Categorize transactions by type (staking, application, gateway, supplier)
   - Extract relevant data for Pocket Network operations

3. **State Tracking**: 
   - Maintain current state of all Pocket Network modules
   - Track application stakes, gateway performance, supplier availability
   - Monitor service health and relay mining difficulty

4. **Historical Data**: 
   - Store historical data for time-based queries
   - Maintain time-series data for analytics
   - Implement data retention policies

5. **Real-time Updates**: 
   - Provide real-time data updates via WebSocket (optional)
   - Implement event-driven architecture for immediate updates
   - Cache frequently accessed data for performance

### Synchronization Strategy

- **Block-based**: Sync on every new block
- **Event-driven**: Listen for specific blockchain events
- **Batch processing**: Process multiple transactions in batches
- **Incremental updates**: Only update changed data
- **Fallback mechanisms**: Handle blockchain node failures gracefully

## API Endpoint Summary

This comprehensive API documentation covers **25+ endpoints** specifically for Pocket Network:

- **Core Blockchain Data**: 15 endpoints (accounts, balances, staking, blocks, transactions)
- **Pocket Network Specific**: 10 endpoints (applications, gateways, suppliers, services)
