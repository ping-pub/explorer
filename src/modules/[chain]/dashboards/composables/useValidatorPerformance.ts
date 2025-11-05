import { ref, watch, computed } from 'vue';
import type {
  DomainLeaderboardResponse,
  ValidatorPerformanceResponse,
} from '@/types/validators';

type GroupBy = 'day' | 'hour' | 'total';

export interface PerformanceFilters {
  domain?: string;
  owner_address?: string;
  supplier_address?: string;
  chain?: string;
  service_id?: string;
  start_date?: string;
  end_date?: string;
  group_by?: GroupBy;
  page?: number;
  limit?: number;
}

// Simple in-memory request deduplication
const pendingRequests = new Map<string, Promise<any>>();
async function fetchJson(url: string) {
  if (pendingRequests.has(url)) return pendingRequests.get(url)!;
  const p = fetch(url).then(async (r) => {
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);
    return j;
  }).finally(() => pendingRequests.delete(url));
  pendingRequests.set(url, p);
  return p;
}

export function useValidatorPerformance(initial: PerformanceFilters) {
  const filters = ref<PerformanceFilters>({ ...initial });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const list = ref<ValidatorPerformanceResponse | null>(null);

  const queryString = computed(() => {
    const params = new URLSearchParams();
    Object.entries(filters.value).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
    });
    return params.toString();
  });

  const load = async () => {
    loading.value = true;
    error.value = null;
    try {
      const url = `/api/v1/validators/performance?${queryString.value}`;
      list.value = await fetchJson(url);
    } catch (e: any) {
      error.value = e?.message || 'Failed to fetch performance';
      list.value = null;
    } finally {
      loading.value = false;
    }
  };

  watch(queryString, load, { immediate: true });

  return { filters, loading, error, list, reload: load };
}

export function useDomains(limit = 100, chain?: string) {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<DomainLeaderboardResponse | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      params.append('limit', String(limit));
      if (chain) {
        params.append('chain', chain);
      }
      const url = `/api/v1/validators/domains?${params.toString()}`;
      data.value = await fetchJson(url);
    } catch (e: any) {
      error.value = e?.message || 'Failed to fetch domains';
      data.value = null;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, data, load };
}


