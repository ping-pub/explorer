# Pocket Network Indexer API Documentation

## Overview

The Pocket Network Indexer provides RESTful APIs for monitoring blockchain data processing, worker health, and synchronization status. The system now operates with separate processes for historical synchronization and real-time monitoring.

## Base URL

```
http://localhost:3007
```

## Authentication

Currently, no authentication is required for these endpoints.

## Endpoints
### 1. Network Growth (Window Summary)

**Endpoint:** `GET /api/v1/network-growth/summary`

**Description:** Returns aggregate counts for the selected window (no per-day breakdown).

**Query Parameters:**
- `window` (optional, integer days): Number of days to include ending today. Default `7`. Max `365`.
- `chain` (optional): Filter by chain (e.g., `pokt-mainnet`).

**Response:**
```json
{
  "data": {
    "window_days": 7,
    "applications": 10,
    "suppliers": 5,
    "gateways": 3,
    "services": 4,
    "relays": 654321,
    "compute_units": 210987
  }
}
```

**Notes:**
- Entity counts are distinct first-seen entities during the window.
- Relays and compute units are summed over the window.


### 2. Network Growth (Daily Time Series)

**Endpoint:** `GET /api/v1/network-growth`

**Description:** Returns a per-day time series over the selected window for newly created entities (applications, suppliers, gateways, services) and daily sums of relays and compute units.

**Query Parameters:**
- `window` (optional, integer days): Number of days to include ending today. Default `7`. Max `365`.
- `chain` (optional): Filter by chain (e.g., `pokt-mainnet`).

**Response:**
```json
{
  "data": {
    "window_days": 7,
    "timeline": [
      {
        "day": "2025-11-01",
        "applications": 2,
        "suppliers": 1,
        "gateways": 0,
        "services": 1,
        "relays": 123456,
        "compute_units": 789012
      }
      // ... one object per day in ascending order
    ]
  }
}
```

**Notes:**
- Entity counts are “first-seen” per entity within the window (stake/add-service messages).
- Relays and compute units come from successful `proof_submissions`.

