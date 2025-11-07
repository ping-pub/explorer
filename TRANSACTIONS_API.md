# Transactions API Endpoints

This document describes the API endpoints for accessing transaction data with comprehensive filtering, sorting, and statistics.

## Base URL
All endpoints are prefixed with `/api/v1`

---

## Endpoints

### 1. Get Transactions (Paginated with Filters)

**GET** `/api/v1/transactions`  
**POST** `/api/v1/transactions`

Retrieve transactions with comprehensive filtering, sorting, and pagination. Supports filtering by addresses (including searching in JSONB data), transaction type, status, date ranges, and amount ranges.

**Note:** POST method is recommended when filtering by many addresses to avoid URL length limits. POST accepts the same parameters in the request body (JSON) instead of query parameters.

**GET Query Parameters / POST Body Parameters:**

#### Address Filtering
- `address` (string, optional): Single address to filter by. Can be comma-separated for multiple addresses.
- `addresses` (string|array, optional): Multiple addresses as comma-separated string or array. Alternative to `address` parameter.

**Note:** Address filtering searches in:
- `sender` column
- `recipient` column  
- `tx_data` JSONB field (searches in common address fields like `sender`, `recipient`, `from_address`, `to_address`, `delegator_address`, `validator_address`, `operator_address`, `application_address`)

#### Other Filters
- `type` (string, optional): Filter by transaction type (e.g., "Send", "Stake", "Unstake")
- `status` (string, optional): Filter by transaction status (e.g., "success", "failed")
- `chain` (string, optional): Filter by chain identifier (e.g., "mainnet", "testnet")
- `start_date` (string, optional): ISO 8601 date string - filter transactions from this date onwards
- `end_date` (string, optional): ISO 8601 date string - filter transactions up to this date
- `min_amount` (number, optional): Minimum transaction amount filter
- `max_amount` (number, optional): Maximum transaction amount filter

#### Pagination
- `page` (integer, default: 1): Page number for pagination (1-based)
- `limit` (integer, default: 10, max: 1000): Number of results per page

#### Sorting
- `sort_by` (string, default: "timestamp"): Field to sort by. Valid values:
  - `timestamp` - Transaction timestamp (default)
  - `amount` - Transaction amount
  - `fee` - Transaction fee
  - `block_height` - Block height
  - `type` - Transaction type
  - `status` - Transaction status
- `sort_order` (string, default: "desc"): Sort order. Valid values: `asc`, `desc`

**Response Format:**
```json
{
  "data": [
    {
      "id": "tx_hash_abc123...",
      "hash": "tx_hash_abc123...",
      "block_id": "mainnet:block_id",
      "sender": "pokt1abc...",
      "recipient": "pokt1xyz...",
      "amount": "1000.5",
      "fee": "0.01",
      "memo": "Payment for services",
      "type": "Send",
      "status": "success",
      "chain": "mainnet",
      "timestamp": "2025-01-27T10:30:00Z",
      "block_height": 482817,
      "tx_data": { /* full transaction JSONB data */ }
    }
  ],
  "meta": {
    "total": 1500,
    "page": 1,
    "limit": 10,
    "totalPages": 150
  }
}
```

**Example Requests:**

1. Get transactions for a specific address (GET):
```
GET /api/v1/transactions?address=pokt1abc123...&chain=mainnet
```

2. Get transactions for multiple addresses (GET):
```
GET /api/v1/transactions?addresses=pokt1abc...,pokt1xyz...&chain=mainnet
```

3. Get transactions for many addresses (POST - recommended):
```bash
POST /api/v1/transactions
Content-Type: application/json

{
  "addresses": [
    "pokt1abc123...",
    "pokt1def456...",
    "pokt1ghi789...",
    "pokt1jkl012..."
  ],
  "chain": "mainnet",
  "page": 1,
  "limit": 50
}
```

4. Filter by type and status (GET):
```
GET /api/v1/transactions?type=Send&status=success&chain=mainnet
```

5. Filter by date range (POST):
```bash
POST /api/v1/transactions
Content-Type: application/json

{
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-01-31T23:59:59Z",
  "chain": "mainnet"
}
```

6. Filter by amount range:
```
GET /api/v1/transactions?min_amount=100&max_amount=1000&chain=mainnet
```

7. Sort by amount (ascending):
```
GET /api/v1/transactions?sort_by=amount&sort_order=asc&chain=mainnet
```

8. Complex filter with multiple addresses, type, and date range (POST):
```bash
POST /api/v1/transactions
Content-Type: application/json

{
  "addresses": ["pokt1abc...", "pokt1xyz..."],
  "type": "Send",
  "start_date": "2025-01-01T00:00:00Z",
  "chain": "mainnet",
  "page": 1,
  "limit": 50,
  "sort_by": "timestamp",
  "sort_order": "desc"
}
```

---

### 2. Get Transaction Statistics

**GET** `/api/v1/transactions/stats`  
**POST** `/api/v1/transactions/stats`

Get comprehensive statistics for transactions based on the same filters as the transactions endpoint.

**Note:** POST method is recommended when filtering by many addresses to avoid URL length limits. POST accepts the same parameters in the request body (JSON) instead of query parameters.

**GET Query Parameters / POST Body Parameters:**

Same as `/api/v1/transactions` endpoint (address, addresses, type, status, chain, start_date, end_date, min_amount, max_amount). Pagination and sorting parameters are ignored.

**Response Format:**
```json
{
  "data": {
    "total_count": 1500,
    "total_amount": 1500000.75,
    "total_fees": 150.25,
    "by_type": {
      "Send": 800,
      "Stake": 400,
      "Unstake": 200,
      "Claim": 100
    },
    "by_status": {
      "success": 1450,
      "failed": 50
    },
    "date_range": {
      "min": "2025-01-01T00:00:00Z",
      "max": "2025-01-31T23:59:59Z"
    }
  }
}
```

**Example Requests:**

1. Get statistics for a specific address (GET):
```
GET /api/v1/transactions/stats?address=pokt1abc123...&chain=mainnet
```

2. Get statistics with multiple filters (GET):
```
GET /api/v1/transactions/stats?type=Send&status=success&start_date=2025-01-01T00:00:00Z&chain=mainnet
```

3. Get statistics for multiple addresses (GET):
```
GET /api/v1/transactions/stats?addresses=pokt1abc...,pokt1xyz...&chain=mainnet
```

4. Get statistics for many addresses (POST - recommended):
```bash
POST /api/v1/transactions/stats
Content-Type: application/json

{
  "addresses": [
    "pokt1abc123...",
    "pokt1def456...",
    "pokt1ghi789...",
    "pokt1jkl012..."
  ],
  "chain": "mainnet",
  "type": "Send",
  "status": "success"
}
```

---

### 3. Get Transaction by ID

**GET** `/api/v1/transactions/:transaction_id`

Retrieve a specific transaction by its hash.

**Path Parameters:**
- `transaction_id` (string, required): Transaction hash

**Query Parameters:**
- `chain` (string, optional): Chain identifier (optional, but recommended for faster lookup)

**Response Format:**
```json
{
  "data": {
    "id": "tx_hash_abc123...",
    "hash": "tx_hash_abc123...",
    "block_id": "mainnet:block_id",
    "sender": "pokt1abc...",
    "recipient": "pokt1xyz...",
    "amount": "1000.5",
    "fee": "0.01",
    "memo": "Payment for services",
    "type": "Send",
    "status": "success",
    "chain": "mainnet",
    "timestamp": "2025-01-27T10:30:00Z",
    "tx_data": { /* full transaction JSONB data */ }
  }
}
```

---

### 4. Get Transaction Count

**GET** `/api/v1/transactions/count`

Get transaction count for a chain (existing endpoint, documented for completeness).

**Query Parameters:**
- `chain` (string, optional): Chain identifier

**Response Format:**
```json
{
  "data": {
    "labels": ["Jan 1", "Jan 2", ...],
    "counts": [100, 150, ...],
    "total": 50000
  }
}
```

---

## Frontend Integration Guide

### Expected Frontend Behavior

#### 1. Address Search
- **Single Address**: Use `?address=pokt1abc...` parameter (GET) or `{"address": "pokt1abc..."}` in body (POST)
- **Multiple Addresses**: 
  - GET: Use `?addresses=pokt1abc...,pokt1xyz...` (comma-separated)
  - POST: Use `{"addresses": ["pokt1abc...", "pokt1xyz..."]}` (array in JSON body) - **Recommended for many addresses**
- **Address Matching**: The API searches in both `sender` and `recipient` columns, as well as within the `tx_data` JSONB field for comprehensive address matching
- **URL Length Limits**: When filtering by many addresses, use POST method to avoid URL length limits (typically 2048 characters for most browsers/servers)

#### 2. Filtering UI Components
- **Type Filter**: Dropdown/select with available transaction types
- **Status Filter**: Dropdown with "success", "failed", or "all"
- **Date Range**: Date picker components for `start_date` and `end_date`
- **Amount Range**: Number inputs for `min_amount` and `max_amount`
- **Chain Filter**: Dropdown with available chains

#### 3. Sorting UI
- **Sort Field Dropdown**: Allow users to select from: timestamp, amount, fee, block_height, type, status
- **Sort Order Toggle**: Toggle between ascending/descending
- **Default**: Sort by timestamp descending (newest first)

#### 4. Pagination
- Display pagination controls based on `meta.totalPages`
- Show current page, total pages, and total count
- Allow users to navigate between pages
- Respect the `limit` parameter (default: 10, max: 1000)

#### 5. Statistics Display
- Call `/api/v1/transactions/stats` with the same filters as the main transactions query
- Display:
  - Total count badge
  - Total amount and fees (formatted with appropriate decimals)
  - Breakdown charts for `by_type` and `by_status`
  - Date range information

#### 6. Performance Considerations
- **Debounce**: Debounce filter inputs to avoid excessive API calls
- **Loading States**: Show loading indicators during API calls
- **Error Handling**: Display user-friendly error messages
- **Caching**: Consider caching statistics for frequently accessed addresses
- **Pagination**: Load data incrementally rather than fetching all results at once

#### 7. Example Frontend Flow

```javascript
// Example: Fetch transactions with filters (using POST for many addresses)
async function fetchTransactions(filters, usePost = false) {
  // Use POST if many addresses or explicitly requested
  const shouldUsePost = usePost || (filters.addresses?.length > 5);
  
  if (shouldUsePost) {
    // POST method - send filters in body
    const body = {
      addresses: filters.addresses,
      type: filters.type,
      status: filters.status,
      chain: filters.chain,
      start_date: filters.startDate?.toISOString(),
      end_date: filters.endDate?.toISOString(),
      min_amount: filters.minAmount,
      max_amount: filters.maxAmount,
      page: filters.page || 1,
      limit: filters.limit || 10,
      sort_by: filters.sortBy || 'timestamp',
      sort_order: filters.sortOrder || 'desc'
    };
    
    const response = await fetch('/api/v1/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await response.json();
  } else {
    // GET method - use query parameters
    const params = new URLSearchParams();
    
    if (filters.addresses?.length) {
      params.append('addresses', filters.addresses.join(','));
    }
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.chain) params.append('chain', filters.chain);
    if (filters.startDate) params.append('start_date', filters.startDate.toISOString());
    if (filters.endDate) params.append('end_date', filters.endDate.toISOString());
    if (filters.minAmount) params.append('min_amount', filters.minAmount);
    if (filters.maxAmount) params.append('max_amount', filters.maxAmount);
    params.append('page', filters.page || 1);
    params.append('limit', filters.limit || 10);
    params.append('sort_by', filters.sortBy || 'timestamp');
    params.append('sort_order', filters.sortOrder || 'desc');
    
    const response = await fetch(`/api/v1/transactions?${params}`);
    return await response.json();
  }
}

// Example: Fetch statistics with same filters (using POST for many addresses)
async function fetchStats(filters, usePost = false) {
  // Use POST if many addresses or explicitly requested
  const shouldUsePost = usePost || (filters.addresses?.length > 5);
  
  if (shouldUsePost) {
    // POST method - send filters in body
    const body = {
      addresses: filters.addresses,
      type: filters.type,
      status: filters.status,
      chain: filters.chain,
      start_date: filters.startDate?.toISOString(),
      end_date: filters.endDate?.toISOString(),
      min_amount: filters.minAmount,
      max_amount: filters.maxAmount
    };
    
    const response = await fetch('/api/v1/transactions/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await response.json();
  } else {
    // GET method - use query parameters
    const params = new URLSearchParams();
    
    if (filters.addresses?.length) {
      params.append('addresses', filters.addresses.join(','));
    }
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.chain) params.append('chain', filters.chain);
    if (filters.startDate) params.append('start_date', filters.startDate.toISOString());
    if (filters.endDate) params.append('end_date', filters.endDate.toISOString());
    if (filters.minAmount) params.append('min_amount', filters.minAmount);
    if (filters.maxAmount) params.append('max_amount', filters.maxAmount);
    
    const response = await fetch(`/api/v1/transactions/stats?${params}`);
    return await response.json();
  }
}
```

#### 8. Error Handling
- **400 Bad Request**: Invalid filter parameters (e.g., invalid date format)
- **500 Internal Server Error**: Server-side error, display generic error message
- **Network Errors**: Show retry option

#### 9. Data Formatting
- **Amounts**: Format with appropriate decimal places (typically 6-8 for POKT)
- **Dates**: Format timestamps in user's local timezone
- **Addresses**: Truncate long addresses with ellipsis, show full on hover
- **Status**: Use color coding (green for success, red for failed)

---

## Database Optimization

The following indexes have been added to optimize query performance:

- `idx_transactions_sender` - Fast sender address lookups
- `idx_transactions_recipient` - Fast recipient address lookups
- `idx_transactions_sender_recipient` - Composite index for address searches
- `idx_transactions_amount` - Amount range queries
- `idx_transactions_tx_data` - GIN index for JSONB searches
- `idx_transactions_chain_sender` - Chain + sender queries
- `idx_transactions_chain_recipient` - Chain + recipient queries
- `idx_transactions_chain_type` - Chain + type queries
- `idx_transactions_chain_status` - Chain + status queries
- `idx_transactions_chain_amount` - Chain + amount queries
- `idx_transactions_type_timestamp` - Sorting by type
- `idx_transactions_status_timestamp` - Sorting by status

These indexes ensure optimal performance even with complex filter combinations.

---

## Notes

- All date parameters should be in ISO 8601 format (e.g., `2025-01-27T10:30:00Z`)
- Address filtering is case-sensitive
- The `tx_data` JSONB field contains the full transaction data and may include additional address fields
- Maximum `limit` is 1000 to prevent performance issues
- Statistics endpoint ignores pagination and sorting parameters
- Empty results return `data: []` with appropriate `meta` information

