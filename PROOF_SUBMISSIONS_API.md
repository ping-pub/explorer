# Proof Submissions API Endpoints

This document describes the API endpoints for accessing proof submission data and analytics.

## Base URL
All endpoints are prefixed with `/api/v1`

## Endpoints

### 1. Get Proof Submissions
**GET** `/api/v1/proof-submissions`

Retrieve proof submissions with optional filters.

**Query Parameters:**
- `supplier_address` (string, optional): Filter by supplier operator address
- `application_address` (string, optional): Filter by application address
- `service_id` (string, optional): Filter by service ID (e.g., "iotex", "avax", "blast")
- `start_date` (datetime, optional): Filter submissions from this date onwards
- `end_date` (datetime, optional): Filter submissions up to this date
- `page` (integer, default: 1): Page number for pagination
- `limit` (integer, default: 100): Number of results per page

**Response Example:**
```json
{
  "data": [
    {
      "id": 1,
      "transaction_hash": "711EF830537F468B61C0C7BFDBFACAC4B2DF49A63A46F4D67AE9F5070C2CAFD3",
      "block_height": 412104,
      "timestamp": "2025-09-27T22:50:10Z",
      "supplier_operator_address": "pokt183lm40qjafypys95g52szszxk8pqe7tnphpphc",
      "application_address": "pokt17w6jtw7q02398afx7urfgma3mwv5wtw9nm7a48",
      "service_id": "iotex",
      "session_id": "1d54a8352f3e2fd417b34259891bf7d839e2ee0830e15e123e8837a688543b2e",
      "session_end_block_height": 412080,
      "claim_proof_status_int": 0,
      "claimed_upokt": "24060upokt",
      "claimed_upokt_amount": 24060,
      "num_claimed_compute_units": 800000,
      "num_estimated_compute_units": 800000,
      "num_relays": 160,
      "compute_unit_efficiency": 100.00,
      "reward_per_relay": 150.38,
      "msg_index": 3,
      "created_at": "2025-09-27T22:50:10Z"
    }
  ],
  "meta": {
    "total": 1234,
    "page": 1,
    "limit": 100,
    "totalPages": 13
  }
}
```

**Curl Example:**
```bash
curl "http://localhost:3006/api/v1/proof-submissions?service_id=iotex&page=1&limit=50"
```

---

### 2. Get Reward Analytics (Hourly Aggregated)
**GET** `/api/v1/proof-submissions/rewards`

Retrieve hourly aggregated reward and performance metrics.

**Query Parameters:**
- `supplier_address` (string, optional): Filter by supplier operator address
- `application_address` (string, optional): Filter by application address
- `service_id` (string, optional): Filter by service ID
- `start_date` (datetime, optional): Filter from this date
- `end_date` (datetime, optional): Filter to this date
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 100): Results per page

**Response Example:**
```json
{
  "data": [
    {
      "supplier_operator_address": "pokt183lm40qjafypys95g52szszxk8pqe7tnphpphc",
      "application_address": "pokt1xqaeh4zg6tnqzz0elzt4ka2yua2p29wa660yhj",
      "service_id": "fuse",
      "hour_bucket": "2025-09-27T22:00:00Z",
      "submission_count": 4,
      "total_rewards_upokt": 223161,
      "total_relays": 1484,
      "total_claimed_compute_units": 7420000,
      "total_estimated_compute_units": 7420000,
      "avg_efficiency_percent": 100.00,
      "avg_reward_per_relay": 150.38,
      "max_reward_per_submission": 89175,
      "min_reward_per_submission": 24060
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 100,
    "totalPages": 1
  }
}
```

**Curl Example:**
```bash
curl "http://localhost:3006/api/v1/proof-submissions/rewards?service_id=fuse&start_date=2025-09-27T00:00:00Z"
```

---

### 3. Get Supplier Performance Analytics
**GET** `/api/v1/suppliers/:address/performance`

Retrieve daily performance metrics for a specific supplier.

**URL Parameters:**
- `address` (string, required): Supplier operator address

**Query Parameters:**
- `start_date` (datetime, optional): Filter from this date
- `end_date` (datetime, optional): Filter to this date
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 100): Results per page

**Response Example:**
```json
{
  "data": [
    {
      "supplier_operator_address": "pokt183lm40qjafypys95g52szszxk8pqe7tnphpphc",
      "day_bucket": "2025-09-27T00:00:00Z",
      "unique_applications": 4,
      "unique_services": 4,
      "total_submissions": 50,
      "total_rewards_upokt": 2500000,
      "total_relays": 15000,
      "avg_efficiency_percent": 100.00,
      "avg_reward_per_relay": 166.67,
      "total_claimed_compute_units": 75000000,
      "total_estimated_compute_units": 75000000
    }
  ],
  "meta": {
    "total": 30,
    "page": 1,
    "limit": 100,
    "totalPages": 1
  }
}
```

**Curl Example:**
```bash
curl "http://localhost:3006/api/v1/suppliers/pokt183lm40qjafypys95g52szszxk8pqe7tnphpphc/performance?start_date=2025-09-01T00:00:00Z"
```

---

### 4. Get Application Usage Analytics
**GET** `/api/v1/applications/:address/usage`

Retrieve daily usage metrics for a specific application.

**URL Parameters:**
- `address` (string, required): Application address

**Query Parameters:**
- `start_date` (datetime, optional): Filter from this date
- `end_date` (datetime, optional): Filter to this date
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 100): Results per page

**Response Example:**
```json
{
  "data": [
    {
      "application_address": "pokt17w6jtw7q02398afx7urfgma3mwv5wtw9nm7a48",
      "day_bucket": "2025-09-27T00:00:00Z",
      "unique_suppliers": 5,
      "unique_services": 3,
      "total_submissions": 100,
      "total_rewards_upokt": 5000000,
      "total_relays": 30000,
      "avg_efficiency_percent": 100.00,
      "avg_reward_per_relay": 166.67,
      "total_claimed_compute_units": 150000000,
      "total_estimated_compute_units": 150000000
    }
  ],
  "meta": {
    "total": 30,
    "page": 1,
    "limit": 100,
    "totalPages": 1
  }
}
```

**Curl Example:**
```bash
curl "http://localhost:3006/api/v1/applications/pokt17w6jtw7q02398oshfx7urfgma3mwv5wtw9nm7a48/usage?start_date=2025-09-01T00:00:00Z"
```

---

### 5. Get Proof Submissions Summary Statistics
**GET** `/api/v1/proof-submissions/summary`

Get aggregated summary statistics for proof submissions.

**Query Parameters:**
- `start_date` (datetime, optional): Filter from this date
- `end_date` (datetime, optional): Filter to this date
- `supplier_address` (string, optional): Filter by supplier
- `application_address` (string, optional): Filter by application
- `service_id` (string, optional): Filter by service

**Response Example:**
```json
{
  "data": {
    "total_submissions": 1234,
    "unique_suppliers": 50,
    "unique_applications": 25,
    "unique_services": 10,
    "total_rewards_upokt": 50000000,
    "total_relays": 300000,
    "total_claimed_compute_units": 7500000000,
    "total_estimated_compute_units": 7500000000,
    "avg_efficiency_percent": 100.00,
    "avg_reward_per_relay": 166.67,
    "first_submission": "2025-09-01T00:00:00Z",
    "last_submission": "2025-09-27T22:50:10Z"
  }
}
```

**Curl Example:**
```bash
curl "http://localhost:3006/api/v1/proof-submissions/summary?service_id=iotex"
```

---

## Data Fields Explanation

### Core Fields
- `supplier_operator_address`: The Pocket Network supplier that submitted the proof
- `application_address`: The application that the relays were served for
- `service_id`: The blockchain service ID (e.g., "iotex", "avax", "blast", "fuse")
- `session_id`: Unique session identifier
- `claimed_upokt_amount`: Numeric value of rewards claimed in upokt
- `num_relays`: Number of relays processed in this submission
- `num_claimed_compute_units`: Compute units that were claimed
- `num_estimated_compute_units`: Compute units that were estimated
- `compute_unit_efficiency`: Percentage efficiency (claimed / estimated * 100)
- `reward_per_relay`: Average reward per relay (upokt per relay)

### Relationship Tracking
These endpoints enable tracking of:
1. **Rewards**: Track how much each supplier earns
2. **Compute Units**: Monitor claimed vs estimated compute units for efficiency analysis
3. **Relays**: Count of relays processed per submission
4. **Relationships**: Links between applications, suppliers, and services
5. **Performance**: Efficiency metrics and reward rates

---

## Use Cases

1. **Reward Dashboards**: Use `/proof-submissions/rewards` for hourly reward trends
2. **Supplier Analytics**: Use `/suppliers/:address/performance` for supplier-specific metrics
3. **Application Monitoring**: Use `/applications/:address/usage` to track application activity
4. **Performance Analysis**: Use `compute_unit_efficiency` to monitor system efficiency
5. **Financial Tracking**: Use `total_rewards_upokt` and `reward_per_relay` for financial metrics

---

## Notes

- All datetime fields are in ISO 8601 format (UTC)
- Pagination is supported on all list endpoints
- Filtering by date range is optimized with database indexes
- Computed columns (efficiency, reward_per_relay) are calculated automatically by the database
