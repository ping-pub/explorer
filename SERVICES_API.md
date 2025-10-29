# Services API Endpoints

This document describes the API endpoints for accessing service performance and compute unit analytics.

## Base URL
All endpoints are prefixed with `/api/v1`

---

## Endpoints

### 1. Get Top Services by Compute Units

**GET** `/api/v1/services/top-by-compute-units`

Returns top N services by total compute units for the specified time period. Perfect for **growth graphs** showing service adoption over time.

**Query Parameters:**
- `limit` (integer, optional): Number of top services to return. **Accepted values: 5, 10, 25, or 50**. Default: 10
- `days` (integer, optional): Time period in days. **Accepted values: 7, 15, or 30**. Default: 30
- `chain` (string, optional): Filter by chain identifier (e.g., "mainnet", "testnet")

**Response Format:**
```json
{
  "data": [
    {
      "service_id": "avax",
      "chain": "mainnet",
      "total_claimed_compute_units": "1500000000",
      "total_estimated_compute_units": "1500000000",
      "submission_count": "1250",
      "avg_efficiency_percent": "100.00",
      "period_start": "2025-01-01T00:00:00Z",
      "period_end": "2025-01-31T23:59:59Z"
    },
    {
      "service_id": "iotex",
      "chain": "mainnet",
      "total_claimed_compute_units": "1200000000",
      "total_estimated_compute_units": "1180000000",
      "submission_count": "980",
      "avg_efficiency_percent": "98.31",
      "period_start": "2025-01-01T00:00:00Z",
      "period_end": "2025-01-31T23:59:59Z"
    }
  ],
  "meta": {
    "limit": 10,
    "days": 30,
    "chain": "mainnet",
    "period_start": "2025-01-01T00:00:00Z",
    "period_end": "2025-01-31T23:59:59Z"
  }
}
```

**Response Fields:**
- `service_id`: The service identifier (e.g., "avax", "iotex", "blast")
- `chain`: The chain identifier
- `total_claimed_compute_units`: Sum of all claimed compute units for this service in the period
- `total_estimated_compute_units`: Sum of all estimated compute units
- `submission_count`: Number of proof submissions
- `avg_efficiency_percent`: Average efficiency percentage (claimed/estimated * 100)
- `period_start`: Start timestamp of the analysis period
- `period_end`: End timestamp of the analysis period

**Example Requests:**

```bash
# Get top 25 services for last 7 days on mainnet
curl "http://localhost:3006/api/v1/services/top-by-compute-units?limit=25&days=7&chain=mainnet"

# Get top 50 services for last 30 days (all chains)
curl "http://localhost:3006/api/v1/services/top-by-compute-units?limit=50&days=30"

# Get top 10 services for last 15 days
curl "http://localhost:3006/api/v1/services/top-by-compute-units?limit=10&days=15"
```

**Frontend Usage for Growth Graphs:**

```javascript
// Example: Fetch data for growth graph
async function fetchServiceGrowth(limit = 10, days = 7) {
  const response = await fetch(
    `/api/v1/services/top-by-compute-units?limit=${limit}&days=${days}&chain=mainnet`
  );
  const result = await response.json();
  
  // Data is sorted by total_claimed_compute_units DESC
  // Perfect for creating line/bar charts showing service adoption
  return result.data.map(service => ({
    label: service.service_id,
    value: parseInt(service.total_claimed_compute_units),
    submissions: parseInt(service.submission_count),
    efficiency: parseFloat(service.avg_efficiency_percent)
  }));
}
```

---

### 2. Get Top Services by Performance (with Percentage Distribution)

**GET** `/api/v1/services/top-by-performance`

Returns top 10 services by compute units with percentage distribution. Perfect for displaying a **table** showing network usage distribution and market share.

**Query Parameters:**
- `chain` (string, optional): Filter by chain identifier (e.g., "mainnet", "testnet")
- `days` (integer, optional): Time period in days. **Accepted values: 7, 15, or 30**. Default: 30

**Response Format:**
```json
{
  "data": [
    {
      "rank": 1,
      "service_id": "avax",
      "chain": "mainnet",
      "total_claimed_compute_units": 1500000000,
      "total_estimated_compute_units": 1500000000,
      "submission_count": 1250,
      "avg_efficiency_percent": 100.00,
      "percentage_of_total": 35.5,
      "period_start": "2025-01-01T00:00:00Z",
      "period_end": "2025-01-31T23:59:59Z"
    },
    {
      "rank": 2,
      "service_id": "iotex",
      "chain": "mainnet",
      "total_claimed_compute_units": 1200000000,
      "total_estimated_compute_units": 1180000000,
      "submission_count": 980,
      "avg_efficiency_percent": 98.31,
      "percentage_of_total": 28.4,
      "period_start": "2025-01-01T00:00:00Z",
      "period_end": "2025-01-31T23:59:59Z"
    }
  ],
  "total_compute_units": 4225353000,
  "meta": {
    "days": 30,
    "chain": "mainnet",
    "period_start": "2025-01-01T00:00:00Z",
    "period_end": "2025-01-31T23:59:59Z"
  }
}
```

**Response Fields:**
- `rank`: Ranking position (1-10) based on total claimed compute units
- `service_id`: The service identifier
- `chain`: The chain identifier
- `total_claimed_compute_units`: Sum of all claimed compute units (integer)
- `total_estimated_compute_units`: Sum of all estimated compute units (integer)
- `submission_count`: Number of proof submissions (integer)
- `avg_efficiency_percent`: Average efficiency percentage (float, 0-100)
- `percentage_of_total`: Percentage distribution of this service's compute units relative to total network compute units (float, 0-100)
- `period_start`: Start timestamp of the analysis period
- `period_end`: End timestamp of the analysis period
- `total_compute_units`: Grand total compute units across all services (for percentage calculations)

**Example Requests:**

```bash
# Get top 10 services by performance for last 30 days on mainnet
curl "http://localhost:3006/api/v1/services/top-by-performance?chain=mainnet&days=30"

# Get top 10 services for last 7 days
curl "http://localhost:3006/api/v1/services/top-by-performance?days=7"

# Get top 10 services for last 15 days on testnet
curl "http://localhost:3006/api/v1/services/top-by-performance?chain=testnet&days=15"
```

**Frontend Usage for Performance Table:**

```javascript
// Example: Fetch data for performance table
async function fetchServicePerformance(chain = 'mainnet', days = 30) {
  const response = await fetch(
    `/api/v1/services/top-by-performance?chain=${chain}&days=${days}`
  );
  const result = await response.json();
  
  return {
    services: result.data, // Array of top 10 services with rank and percentage
    total: result.total_compute_units, // Total for calculations
    period: result.meta // Period information
  };
}

// Example table rendering
function renderPerformanceTable(data) {
  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Service</th>
          <th>Compute Units</th>
          <th>Market Share</th>
          <th>Efficiency</th>
          <th>Submissions</th>
        </tr>
      </thead>
      <tbody>
        {data.services.map(service => (
          <tr key={service.service_id}>
            <td>{service.rank}</td>
            <td>{service.service_id}</td>
            <td>{service.total_claimed_compute_units.toLocaleString()}</td>
            <td>
              <div className="percentage-bar">
                <div style={{ width: `${service.percentage_of_total}%` }} />
                <span>{service.percentage_of_total}%</span>
              </div>
            </td>
            <td>{service.avg_efficiency_percent}%</td>
            <td>{service.submission_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Use Cases

### Growth Graph Visualization

Use `/api/v1/services/top-by-compute-units` to:
- Create line charts showing service adoption over time (compare 7, 15, 30 days)
- Display bar charts comparing top services
- Build stacked area charts showing service growth
- Generate trend analysis dashboards

**Example Chart Configuration:**
```javascript
// Fetch data for multiple time periods
const [week, month] = await Promise.all([
  fetchServiceGrowth(10, 7),
  fetchServiceGrowth(10, 30)
]);

// Create comparison chart
const chartData = {
  labels: week.map(s => s.label),
  datasets: [
    {
      label: 'Last 7 Days',
      data: week.map(s => s.value)
    },
    {
      label: 'Last 30 Days',
      data: month.map(s => s.value)
    }
  ]
};
```

### Performance Table Display

Use `/api/v1/services/top-by-performance` to:
- Show market share distribution in a table
- Display percentage bars for visual representation
- Create leaderboard-style rankings
- Build network usage analytics dashboards

**Example Table Features:**
- Sortable columns (rank, service, compute units, percentage, etc.)
- Visual percentage bars showing market share
- Highlight top performers
- Filter by chain or time period

---

## Notes

- All datetime fields are in ISO 8601 format (UTC)
- Compute units are returned as integers or strings (parse appropriately)
- Percentages are calculated relative to total network compute units
- Only successful submissions (`claim_proof_status_int = 0`) are included
- Services are ranked by `total_claimed_compute_units` in descending order
- The endpoints are optimized with database indexes on `service_id`, `timestamp`, and `chain`

---

## Error Handling

All endpoints return errors in the following format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Invalid query parameters
- `500`: Server error

