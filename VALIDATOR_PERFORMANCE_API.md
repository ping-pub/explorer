# Validator Performance API - Frontend Integration Guide

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Request/Response Schemas](#requestresponse-schemas)
4. [Integration Patterns](#integration-patterns)
5. [UI/UX Recommendations](#uiux-recommendations)
6. [Example Code Snippets](#example-code-snippets)
7. [Error Handling](#error-handling)
8. [Performance Optimization](#performance-optimization)
9. [Data Visualization Guidelines](#data-visualization-guidelines)
10. [Testing Checklist](#testing-checklist)

---

## Overview

The Validator Performance API provides comprehensive metrics for tracking validator (node runner) performance in terms of relays, compute units, rewards, and efficiency. Data is aggregated from proof submissions and enriched with validator metadata from the staking API.

### Key Concepts

- **Validators**: Node operators identified by `operator_address` (poktvaloper...)
- **Domains**: Extracted from validator website URLs (e.g., "grove.city" from "https://grove.city")
- **Owner Address**: The owner of a supplier, used for grouping validators under the same entity
- **Supplier Address**: The operator address that actually submitted proofs
- **Grouping**: Data can be aggregated by day, hour, or total (all time)

### Base URL

```
http://localhost:3006/api/v1
```

---

## API Endpoints

### 1. Validator Performance List/Leaderboard

**GET** `/api/v1/validators/performance`

Retrieve performance metrics for validators with flexible filtering and grouping options.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `domain` | string | No | - | Filter by website domain (e.g., "grove.city") |
| `owner_address` | string | No | - | Filter by supplier owner address |
| `supplier_address` | string | No | - | Filter by specific supplier operator address |
| `chain` | string | No | - | Filter by blockchain chain identifier |
| `service_id` | string | No | - | Filter by service ID |
| `start_date` | ISO 8601 | No | - | Start timestamp (e.g., "2025-10-01T00:00:00Z") |
| `end_date` | ISO 8601 | No | - | End timestamp (e.g., "2025-10-31T23:59:59Z") |
| `group_by` | enum | No | "day" | Grouping: "day", "hour", or "total" |
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 100 | Results per page |

#### Response Schema

```typescript
interface ValidatorPerformanceResponse {
  data: ValidatorPerformanceRow[];
  meta: PaginationMeta;
}

interface ValidatorPerformanceRow {
  bucket: string | null;                    // ISO timestamp for day/hour, null for total
  supplier_operator_address: string;         // poktvaloper... address
  owner_address: string | null;             // Owner address if available
  moniker: string | null;                    // Validator display name
  website: string | null;                   // Full website URL
  website_domain: string | null;             // Extracted domain (e.g., "grove.city")
  validator_status: string | null;            // Validator status
  submissions: number;                       // Number of proof submissions
  total_relays: number;                      // Total relays processed
  total_claimed_compute_units: number;       // Total claimed compute units
  total_estimated_compute_units: number;     // Total estimated compute units
  avg_efficiency_percent: number | null;    // Average efficiency percentage
  avg_reward_per_relay: number | null;      // Average reward per relay (upokt)
  unique_applications: number;               // Count of distinct applications served
  unique_services: number;                   // Count of distinct services
}

interface PaginationMeta {
  total: number;                            // Total number of results
  page: number;                             // Current page number
  limit: number;                             // Results per page
  totalPages: number;                       // Total number of pages
}
```

#### Example Request

```bash
GET /api/v1/validators/performance?domain=grove.city&group_by=day&start_date=2025-10-01T00:00:00Z&limit=50
```

#### Example Response

```json
{
  "data": [
    {
      "bucket": "2025-10-15T00:00:00Z",
      "supplier_operator_address": "poktvaloper1zppmwrdgvywrc66nn2u40ad90na9983fu9yh55",
      "owner_address": "pokt1abc123...",
      "moniker": "PNF-05",
      "website": "https://stakenodes.org",
      "website_domain": "stakenodes.org",
      "validator_status": "BOND_STATUS_BONDED",
      "submissions": 245,
      "total_relays": 1250000,
      "total_claimed_compute_units": 125000000,
      "total_estimated_compute_units": 125000000,
      "avg_efficiency_percent": 100.00,
      "avg_reward_per_relay": 166.67,
      "unique_applications": 15,
      "unique_services": 8
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  }
}
```

---

### 2. Validator Detail Performance

**GET** `/api/v1/validators/:operator_address/performance`

Retrieve detailed performance metrics for a specific validator operator address.

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `operator_address` | string | Yes | Validator operator address (poktvaloper...) |

#### Query Parameters

Same as endpoint #1, except `domain`, `owner_address`, and `supplier_address` are not applicable (already scoped by `operator_address`).

#### Response Schema

```typescript
interface ValidatorDetailResponse {
  data: ValidatorPerformanceRow[];
  validator: ValidatorMetadata | null;
  meta: PaginationMeta;
}

interface ValidatorMetadata {
  operator_address: string;
  moniker: string | null;
  website: string | null;
  website_domain: string | null;
  status: string | null;
  jailed: boolean | null;
  tokens: string | null;                    // Staked tokens amount
}
```

#### Example Request

```bash
GET /api/v1/validators/poktvaloper1zppmwrdgvywrc66nn2u40ad90na9983fu9yh55/performance?group_by=hour&start_date=2025-10-31T00:00:00Z
```

#### Example Response

```json
{
  "data": [
    {
      "bucket": "2025-10-31T14:00:00Z",
      "supplier_operator_address": "poktvaloper1zppmwrdgvywrc66nn2u40ad90na9983fu9yh55",
      "submissions": 12,
      "total_relays": 60000,
      "total_claimed_compute_units": 6000000,
      "total_estimated_compute_units": 6000000,
      "avg_efficiency_percent": 100.00,
      "avg_reward_per_relay": 166.67,
      "unique_applications": 8,
      "unique_services": 5
    }
  ],
  "validator": {
    "operator_address": "poktvaloper1zppmwrdgvywrc66nn2u40ad90na9983fu9yh55",
    "moniker": "PNF-05",
    "website": "https://stakenodes.org",
    "website_domain": "stakenodes.org",
    "status": "BOND_STATUS_BONDED",
    "jailed": false,
    "tokens": "1200049994786"
  },
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 100,
    "totalPages": 1
  }
}
```

---

### 3. Domain Leaderboard

**GET** `/api/v1/validators/domains`

Retrieve aggregated performance metrics grouped by validator website domain.

#### Query Parameters

Same as endpoint #1, except `domain`, `owner_address`, `supplier_address`, and `group_by` are not applicable (domain is the grouping dimension).

#### Response Schema

```typescript
interface DomainLeaderboardResponse {
  data: DomainPerformanceRow[];
  meta: PaginationMeta;
}

interface DomainPerformanceRow {
  domain: string | null;                     // Website domain or null
  validator_count: number;                   // Number of distinct validators with this domain
  total_relays: number;                      // Total relays across all validators
  total_claimed_compute_units: number;       // Total claimed compute units
  total_estimated_compute_units: number;     // Total estimated compute units
  avg_efficiency_percent: number | null;     // Average efficiency
}
```

#### Example Request

```bash
GET /api/v1/validators/domains?start_date=2025-10-01T00:00:00Z&limit=20
```

#### Example Response

```json
{
  "data": [
    {
      "domain": "grove.city",
      "validator_count": 5,
      "total_relays": 50000000,
      "total_claimed_compute_units": 5000000000,
      "total_estimated_compute_units": 5000000000,
      "avg_efficiency_percent": 100.00
    },
    {
      "domain": "stakenodes.org",
      "validator_count": 3,
      "total_relays": 30000000,
      "total_claimed_compute_units": 3000000000,
      "total_estimated_compute_units": 3000000000,
      "avg_efficiency_percent": 99.85
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### 4. Owner Leaderboard

**GET** `/api/v1/validators/owners`

Retrieve aggregated performance metrics grouped by supplier owner address.

#### Query Parameters

Same as endpoint #1, except `domain`, `owner_address`, `supplier_address`, and `group_by` are not applicable (owner is the grouping dimension).

#### Response Schema

```typescript
interface OwnerLeaderboardResponse {
  data: OwnerPerformanceRow[];
  meta: PaginationMeta;
}

interface OwnerPerformanceRow {
  owner_address: string | null;             // Owner address or null
  supplier_count: number;                   // Number of distinct suppliers owned
  total_relays: number;                     // Total relays across all suppliers
  total_claimed_compute_units: number;      // Total claimed compute units
  total_estimated_compute_units: number;    // Total estimated compute units
  avg_efficiency_percent: number | null;    // Average efficiency
}
```

#### Example Request

```bash
GET /api/v1/validators/owners?chain=mainnet&limit=50
```

#### Example Response

```json
{
  "data": [
    {
      "owner_address": "pokt1abc123def456...",
      "supplier_count": 3,
      "total_relays": 25000000,
      "total_claimed_compute_units": 2500000000,
      "total_estimated_compute_units": 2500000000,
      "avg_efficiency_percent": 100.00
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  }
  }
```

---

## Integration Patterns

### 1. Dashboard Overview

For a dashboard showing top validators, use the performance endpoint with `group_by=total`:

```typescript
// Fetch top 10 validators by relays
const response = await fetch(
  '/api/v1/validators/performance?group_by=total&limit=10&page=1'
);
const { data, meta } = await response.json();
```

### 2. Time Series Charts

For line/area charts showing trends over time:

```typescript
// Daily aggregation for last 30 days
const endDate = new Date();
const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

const response = await fetch(
  `/api/v1/validators/performance?` +
  `group_by=day&` +
  `start_date=${startDate.toISOString()}&` +
  `end_date=${endDate.toISOString()}&` +
  `limit=1000`
);
const { data } = await response.json();

// Sort by bucket (date) for charting
const sortedData = data.sort((a, b) => 
  new Date(a.bucket) - new Date(b.bucket)
);
```

### 3. Filter Dropdowns

Populate filter dropdowns using the leaderboard endpoints:

```typescript
// Fetch top domains for domain filter
const domainsResponse = await fetch(
  '/api/v1/validators/domains?limit=100'
);
const { data: domains } = await domainsResponse.json();

// Use in dropdown
const domainOptions = domains.map(d => ({
  value: d.domain,
  label: d.domain || 'Unknown',
  count: d.validator_count
}));
```

### 4. Detail Page

For a validator detail page:

```typescript
// Fetch validator detail with hourly breakdown
const operatorAddress = 'poktvaloper1...';
const response = await fetch(
  `/api/v1/validators/${operatorAddress}/performance?` +
  `group_by=hour&` +
  `start_date=${startDate.toISOString()}`
);
const { data, validator, meta } = await response.json();
```

---

## UI/UX Recommendations

### 1. Filter UI Layout

```
┌─────────────────────────────────────────────────┐
│ Validator Performance Dashboard                 │
├─────────────────────────────────────────────────┤
│ Filters:                                        │
│  Domain: [Dropdown ▼]  Owner: [Input]          │
│  Supplier: [Input]     Chain: [Dropdown ▼]     │
│  Service: [Dropdown ▼]  Date Range: [Picker]   │
│  Group By: [○ Day  ○ Hour  ○ Total]            │
└─────────────────────────────────────────────────┘
```

### 2. Table Columns

Recommended table columns for the performance list:

| Column | Description | Format |
|--------|-------------|--------|
| Moniker | Validator name | Text link to detail page |
| Domain | Website domain | External link if website available |
| Total Relays | Aggregate relays | Number with commas |
| Total Compute Units | Aggregate compute units | Number with commas |
| Avg Efficiency | Efficiency percentage | Progress bar or badge (green/yellow/red) |
| Unique Apps | Applications served | Badge count |
| Unique Services | Services provided | Badge count |
| Actions | View detail | Button |

### 3. Status Indicators

Use color coding for validator status:

- **Green**: `BOND_STATUS_BONDED` and `jailed: false`
- **Yellow**: `BOND_STATUS_UNBONDING`
- **Red**: `BOND_STATUS_UNBONDED` or `jailed: true`

### 4. Efficiency Display

```typescript
// Efficiency percentage display
const getEfficiencyColor = (efficiency: number | null) => {
  if (efficiency === null) return 'gray';
  if (efficiency >= 95) return 'green';
  if (efficiency >= 80) return 'yellow';
  return 'red';
};

// Display as progress bar
<ProgressBar 
  value={row.avg_efficiency_percent || 0} 
  color={getEfficiencyColor(row.avg_efficiency_percent)}
  max={100}
/>
```

### 5. Date Range Picker

Recommend using a date range picker component:

- Default: Last 7 days
- Presets: Today, Last 7 days, Last 30 days, Last 90 days, Custom
- Format: ISO 8601 timestamps (UTC)

---

## Example Code Snippets

### React Hook for Validator Performance

```typescript
import { useState, useEffect } from 'react';

interface ValidatorPerformanceFilters {
  domain?: string;
  owner_address?: string;
  supplier_address?: string;
  chain?: string;
  service_id?: string;
  start_date?: string;
  end_date?: string;
  group_by?: 'day' | 'hour' | 'total';
  page?: number;
  limit?: number;
}

export function useValidatorPerformance(filters: ValidatorPerformanceFilters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      try {
        const response = await fetch(
          `/api/v1/validators/performance?${params.toString()}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
}

// Usage
function ValidatorPerformanceTable() {
  const [filters, setFilters] = useState({
    group_by: 'day' as const,
    limit: 50
  });
  
  const { data, loading, error } = useValidatorPerformance(filters);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return (
    <Table>
      {data.data.map(row => (
        <TableRow key={row.supplier_operator_address}>
          <TableCell>{row.moniker || 'Unknown'}</TableCell>
          <TableCell>{row.website_domain || '-'}</TableCell>
          <TableCell>{row.total_relays.toLocaleString()}</TableCell>
          <TableCell>{row.avg_efficiency_percent?.toFixed(2)}%</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
```

### Vue 3 Composition API

```vue
<template>
  <div>
    <FilterPanel @filter-change="updateFilters" />
    <DataTable :rows="performanceData" :loading="loading" />
    <Pagination :meta="meta" @page-change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const filters = ref({
  domain: '',
  group_by: 'day',
  page: 1,
  limit: 50
});

const performanceData = ref([]);
const meta = ref(null);
const loading = ref(false);

const fetchPerformance = async () => {
  loading.value = true;
  const params = new URLSearchParams();
  Object.entries(filters.value).forEach(([k, v]) => {
    if (v) params.append(k, String(v));
  });
  
  try {
    const res = await fetch(`/api/v1/validators/performance?${params}`);
    const data = await res.json();
    performanceData.value = data.data;
    meta.value = data.meta;
  } catch (err) {
    console.error('Failed to fetch performance data:', err);
  } finally {
    loading.value = false;
  }
};

watch(filters, fetchPerformance, { deep: true });

const updateFilters = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters, page: 1 };
};

const handlePageChange = (page) => {
  filters.value.page = page;
};
</script>
```

### TypeScript Type Definitions

```typescript
// validators.ts
export interface ValidatorPerformanceRow {
  bucket: string | null;
  supplier_operator_address: string;
  owner_address: string | null;
  moniker: string | null;
  website: string | null;
  website_domain: string | null;
  validator_status: string | null;
  submissions: number;
  total_relays: number;
  total_claimed_compute_units: number;
  total_estimated_compute_units: number;
  avg_efficiency_percent: number | null;
  avg_reward_per_relay: number | null;
  unique_applications: number;
  unique_services: number;
}

export interface ValidatorPerformanceResponse {
  data: ValidatorPerformanceRow[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ValidatorDetailResponse extends ValidatorPerformanceResponse {
  validator: {
    operator_address: string;
    moniker: string | null;
    website: string | null;
    website_domain: string | null;
    status: string | null;
    jailed: boolean | null;
    tokens: string | null;
  } | null;
}

export interface DomainPerformanceRow {
  domain: string | null;
  validator_count: number;
  total_relays: number;
  total_claimed_compute_units: number;
  total_estimated_compute_units: number;
  avg_efficiency_percent: number | null;
}

export interface OwnerPerformanceRow {
  owner_address: string | null;
  supplier_count: number;
  total_relays: number;
  total_claimed_compute_units: number;
  total_estimated_compute_units: number;
  avg_efficiency_percent: number | null;
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response normally |
| 400 | Bad Request | Check query parameters (date format, enum values) |
| 404 | Not Found | Validator not found (detail endpoint) |
| 500 | Server Error | Retry with exponential backoff, show user-friendly message |

### Error Response Format

```typescript
interface ErrorResponse {
  error: string;  // Error message
}
```

### Example Error Handling

```typescript
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(`Invalid request: ${error.error}`);
      }
      
      if (response.status >= 500) {
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
          continue;
        }
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Performance Optimization

### 1. Pagination Strategy

- **For Tables**: Use server-side pagination with reasonable page sizes (25-100 rows)
- **For Charts**: Fetch all data needed (increase `limit` or paginate and merge client-side)
- **For Dashboards**: Use `group_by=total` to get single aggregated row per validator

### 2. Caching

Cache filter dropdown data (domains, owners) since they change infrequently:

```typescript
// Cache domain list for 5 minutes
const domainCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000
};

async function getDomains() {
  if (domainCache.data && Date.now() - domainCache.timestamp < domainCache.ttl) {
    return domainCache.data;
  }
  
  const response = await fetch('/api/v1/validators/domains?limit=100');
  const result = await response.json();
  domainCache.data = result.data;
  domainCache.timestamp = Date.now();
  return result.data;
}
```

### 3. Debouncing Filters

Debounce filter changes to avoid excessive API calls:

```typescript
import { debounce } from 'lodash';

const debouncedFetch = debounce((filters) => {
  fetchPerformance(filters);
}, 500);

// On filter change
debouncedFetch(filters);
```

### 4. Request Deduplication

Prevent duplicate requests for the same parameters:

```typescript
const pendingRequests = new Map();

async function fetchDeduplicated(url: string) {
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url);
  }
  
  const promise = fetch(url).then(res => res.json());
  pendingRequests.set(url, promise);
  
  promise.finally(() => {
    pendingRequests.delete(url);
  });
  
  return promise;
}
```

---

## Data Visualization Guidelines

### 1. Time Series Charts

**Use Cases**: Daily/hourly trends, performance over time

**Recommended Libraries**: 
- Recharts (React)
- Chart.js
- D3.js (advanced)

**Example Configuration**:

```typescript
// Line chart showing relays over time
const chartData = data.map(row => ({
  date: row.bucket,
  relays: row.total_relays,
  computeUnits: row.total_claimed_compute_units
}));

<LineChart data={chartData}>
  <Line dataKey="relays" stroke="#8884d8" />
  <Line dataKey="computeUnits" stroke="#82ca9d" />
  <XAxis dataKey="date" />
  <YAxis />
</LineChart>
```

### 2. Leaderboard Tables

**Columns to Display**:
- Rank (computed client-side)
- Validator Info (moniker, domain with link)
- Key Metrics (relays, compute units, efficiency)
- Status Badge
- Actions (view detail)

**Sorting**: Support sorting by any numeric column, default by `total_relays` DESC

### 3. Comparison Views

For comparing multiple validators or domains:

```typescript
// Compare selected validators
const selectedValidators = ['addr1', 'addr2', 'addr3'];
const comparisonData = await Promise.all(
  selectedValidators.map(addr =>
    fetch(`/api/v1/validators/${addr}/performance?group_by=day`)
  )
);

// Render side-by-side charts or table
```

### 4. Summary Cards/KPIs

```typescript
// Total metrics card
const totals = data.find(row => row.bucket === null); // group_by=total

<Card>
  <CardTitle>Total Relays</CardTitle>
  <CardValue>{totals?.total_relays.toLocaleString()}</CardValue>
  <CardSubtitle>Across all validators</CardSubtitle>
</Card>
```

---

## Testing Checklist

### Functional Testing

- [ ] All four endpoints return expected data structure
- [ ] Pagination works correctly (page, limit, totalPages)
- [ ] Date filtering (start_date, end_date) works
- [ ] Domain filter matches correctly
- [ ] Owner address filter works
- [ ] Supplier address filter works
- [ ] Group by (day/hour/total) produces correct aggregations
- [ ] Empty results handled gracefully
- [ ] Null values in response handled (domain, owner_address, etc.)

### Error Testing

- [ ] Invalid date formats return 400
- [ ] Invalid group_by value returns 400
- [ ] Non-existent validator in detail endpoint returns 404
- [ ] Server errors (500) handled with retry logic
- [ ] Network errors handled gracefully

### UI Testing

- [ ] Filters update results correctly
- [ ] Table sorting works on all sortable columns
- [ ] Pagination controls navigate correctly
- [ ] Loading states display during fetch
- [ ] Error messages display clearly
- [ ] Empty states show helpful messages
- [ ] Responsive design works on mobile/tablet

### Performance Testing

- [ ] Large date ranges (90+ days) load in reasonable time
- [ ] Multiple rapid filter changes don't cause race conditions
- [ ] Caching reduces redundant API calls
- [ ] Debouncing prevents excessive requests

---

## Additional Notes

### Validator Cache Refresh

The validator metadata (domains, monikers) is cached in the database. To refresh:

1. Run the validator service's `fetchAndCacheValidators()` function
2. This should be done periodically (daily/hourly) via cron job
3. Consider adding an admin endpoint to trigger manual refresh

### Domain Extraction

Domains are extracted from validator website URLs:
- `https://grove.city` → `grove.city`
- `http://www.stakenodes.org` → `stakenodes.org` (www stripped)
- Invalid/missing URLs result in `null` domain

### Missing Data Handling

Some validators may not have:
- Website → `website_domain` will be `null`
- Owner address → `owner_address` will be `null`
- Validator metadata → validator join fields will be `null`

Handle these cases gracefully in UI (show "Unknown" or "-" instead of crashing).

---

## Quick Reference

### Common Filter Combinations

```typescript
// Top validators by domain
GET /api/v1/validators/performance?domain=grove.city&group_by=total&limit=10

// Daily performance last 30 days
GET /api/v1/validators/performance?group_by=day&start_date=2025-10-01T00:00:00Z&end_date=2025-10-31T23:59:59Z

// Specific validator hourly breakdown
GET /api/v1/validators/{address}/performance?group_by=hour&start_date=2025-10-31T00:00:00Z

// Top domains
GET /api/v1/validators/domains?limit=20

// Owner performance
GET /api/v1/validators/owners?chain=mainnet&limit=50
```

### Date Format

Always use ISO 8601 format in UTC:
```
2025-10-31T14:30:00Z
```

---

## Support

For API issues or questions:
- Check server logs for detailed error messages
- Verify database connection and validator cache is populated
- Ensure `proof_submissions` table has data for the requested time range

