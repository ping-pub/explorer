// Types aligned with VALIDATOR_PERFORMANCE_API.md

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

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ValidatorPerformanceResponse {
  data: ValidatorPerformanceRow[];
  meta: PaginationMeta;
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

export interface DomainLeaderboardResponse {
  data: DomainPerformanceRow[];
  meta: PaginationMeta;
}


