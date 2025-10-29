# Blocks API Endpoints

This document describes the API endpoints for accessing blockchain block data.

## Base URL
All endpoints are prefixed with `/api/v1`

---

## Endpoints

### 1. Get Blocks (Paginated)

**GET** `/api/v1/blocks`

Retrieve blocks with pagination and optional filters.

**Query Parameters:**
- `chain` (string, optional): Filter by chain identifier (e.g., "mainnet", "testnet")
- `page` (integer, default: 1): Page number for pagination
- `limit` (integer, default: 100): Number of results per page (max recommended: 1000)
- `start_height` (integer, optional): Filter blocks from this height onwards
- `end_height` (integer, optional): Filter blocks up to this height
- `start_date` (datetime, optional): Filter blocks from this timestamp onwards (ISO 8601 format)
- `end_date` (datetime, optional): Filter blocks up to this timestamp (ISO 8601 format)

**Response Format:**
```json
{
  "data": [
    {
      "id": "mainnet:ABC123...",
      "height": 482817,
      "hash": "ABC123DEF456...",
      "timestamp": "2025-01-27T10:30:00Z",
      "proposer": "pokt1abc...",
      "chain": "mainnet",
      "transaction_count": 42
    },
    {
      "id": "mainnet:XYZ789...",
      "height": 482816,
      "hash": "XYZ789UVW012...",
      "timestamp": "2025-01-27T10:29:00Z",
      "proposer": "pokt1xyz...",
      "chain": "mainnet"
    }
  ],
  "meta": {
    "total": 482817,
    "page": 1,
    "limit": 100,
    "totalPages": 4829
  }
}
```

**Response Fields:**
- `id`: Unique block identifier (format: `chain:hash`)
- `height`: Block height (integer)
- `hash`: Block hash (hex string)
- `timestamp`: Block timestamp (ISO 8601 format, UTC)
- `proposer`: Block proposer address
- `chain`: Chain identifier
- `transaction_count`: Number of transactions in this block (integer)

**Example Requests:**

```bash
# Get latest 100 blocks for mainnet
curl "http://localhost:3006/api/v1/blocks?chain=mainnet&page=1&limit=100"

# Get blocks for a specific height range
curl "http://localhost:3006/api/v1/blocks?chain=mainnet&start_height=482800&end_height=482817"

# Get blocks for a date range
curl "http://localhost:3006/api/v1/blocks?chain=mainnet&start_date=2025-01-27T00:00:00Z&end_date=2025-01-27T23:59:59Z"

# Get blocks with pagination
curl "http://localhost:3006/api/v1/blocks?chain=mainnet&page=2&limit=50"

# Get all blocks across all chains (no chain filter)
curl "http://localhost:3006/api/v1/blocks?page=1&limit=100"
```

**Frontend Usage:**

```javascript
// Fetch blocks with pagination
async function fetchBlocks(chain = 'mainnet', page = 1, limit = 100) {
  const response = await fetch(
    `/api/v1/blocks?chain=${chain}&page=${page}&limit=${limit}`
  );
  const result = await response.json();
  
  return {
    blocks: result.data,
    pagination: result.meta
  };
}

// Fetch blocks by height range
async function fetchBlocksByHeight(chain, startHeight, endHeight) {
  const response = await fetch(
    `/api/v1/blocks?chain=${chain}&start_height=${startHeight}&end_height=${endHeight}`
  );
  const result = await response.json();
  return result.data;
}

// Example: Pagination component
function BlockList({ chain }) {
  const [page, setPage] = useState(1);
  const [blocks, setBlocks] = useState([]);
  const [pagination, setPagination] = useState(null);
  
  useEffect(() => {
    fetchBlocks(chain, page, 100).then(({ blocks, pagination }) => {
      setBlocks(blocks);
      setPagination(pagination);
    });
  }, [chain, page]);
  
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Height</th>
            <th>Hash</th>
            <th>Timestamp</th>
            <th>Proposer</th>
            <th>Transactions</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map(block => (
            <tr key={block.id}>
              <td>{block.height}</td>
              <td>{block.hash.substring(0, 16)}...</td>
              <td>{new Date(block.timestamp).toLocaleString()}</td>
              <td>{block.proposer}</td>
              <td>{block.transaction_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {pagination && (
        <div className="pagination">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {pagination.totalPages}</span>
          <button 
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### 2. Get Block by ID or Height

**GET** `/api/v1/blocks/:block_id`

Retrieve a specific block by its ID (hash) or height.

**Path Parameters:**
- `block_id` (string): Block ID (hash) or height (integer)

**Query Parameters:**
- `chain` (string, optional): Chain identifier (required if using height)

**Response Format:**
```json
{
  "data": {
    "id": "mainnet:ABC123...",
    "height": 482817,
    "hash": "ABC123DEF456...",
    "timestamp": "2025-01-27T10:30:00Z",
    "proposer": "pokt1abc...",
    "chain": "mainnet",
    "transaction_count": 42
  }
}
```

**Response Fields:**
- All fields from the list endpoint, plus:
- `transaction_count`: Number of transactions in this block

**Example Requests:**

```bash
# Get block by hash/ID
curl "http://localhost:3006/api/v1/blocks/mainnet:ABC123DEF456..."

# Get block by height (requires chain parameter)
curl "http://localhost:3006/api/v1/blocks/482817?chain=mainnet"

# Get block by ID without chain
curl "http://localhost:3006/api/v1/blocks/mainnet:ABC123DEF456..."
```

**Frontend Usage:**

```javascript
// Fetch block by height
async function fetchBlockByHeight(chain, height) {
  const response = await fetch(
    `/api/v1/blocks/${height}?chain=${chain}`
  );
  const result = await response.json();
  
  if (response.status === 404) {
    throw new Error('Block not found');
  }
  
  return result.data;
}

// Fetch block by hash
async function fetchBlockByHash(blockId) {
  const response = await fetch(`/api/v1/blocks/${blockId}`);
  const result = await response.json();
  
  if (response.status === 404) {
    throw new Error('Block not found');
  }
  
  return result.data;
}

// Example: Block detail component
function BlockDetail({ blockId }) {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBlockByHash(blockId)
      .then(setBlock)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [blockId]);
  
  if (loading) return <div>Loading...</div>;
  if (!block) return <div>Block not found</div>;
  
  return (
    <div>
      <h2>Block #{block.height}</h2>
      <p>Hash: {block.hash}</p>
      <p>Timestamp: {new Date(block.timestamp).toLocaleString()}</p>
      <p>Proposer: {block.proposer}</p>
      <p>Transactions: {block.transaction_count}</p>
    </div>
  );
}
```

---

## Performance Notes

- Blocks are ordered by `height DESC, timestamp DESC` (newest first)
- Queries use indexes on `chain`, `height`, and `timestamp`
- For best performance, always specify `chain` when possible
- Large `limit` values (>1000) may be slower; recommended max is 1000

---

## Error Handling

All endpoints return errors in the following format:
```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `404`: Block not found (for single block endpoint)
- `500`: Server error

---

## Use Cases

### 1. Block Explorer
- Display latest blocks with pagination
- Show block details with transaction count
- Filter by chain and date ranges

### 2. Analytics Dashboard
- Track block production over time
- Monitor proposer distribution
- Analyze block heights and timestamps

### 3. Historical Analysis
- Query blocks by height range
- Filter by date ranges for time-based analysis
- Track blockchain progress across chains

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Block IDs are in the format `chain:hash` for multi-chain support
- Height is unique per chain (enforced by database constraint)
- When querying by height, `chain` parameter is required to ensure correct block retrieval
- Transaction count is calculated on-demand from the transactions table

