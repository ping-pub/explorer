<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import ApexCharts from 'vue3-apexcharts';
import { useBaseStore, useBlockchain } from '@/stores';
import { getMarketPriceChartConfig, colorVariables } from '@/components/charts/apexChartConfig';
import type { ValidatorPerformanceRow } from '@/types/validators';
import { useValidatorPerformance } from '../composables/useValidatorPerformance';

const props = defineProps<{
  filters: {
    domain?: string;
    owner_address?: string;
    supplier_address?: string;
    chain?: string;
    start_date: string;
    end_date: string;
  };
  pageSize?: number;
}>();

const baseStore = useBaseStore();
const chainStore = useBlockchain();

// Performance (daily for charts)
const daily = useValidatorPerformance({
  ...props.filters,
  group_by: 'day',
  page: 1,
  limit: 1000,
});

// Totals for leaderboard (single row per validator)
const totals = useValidatorPerformance({
  ...props.filters,
  group_by: 'total',
  page: 1,
  limit: props.pageSize || 25,
});

watch(() => props.filters, (f) => {
  daily.filters.value = { ...f, group_by: 'day', page: 1, limit: 1000 };
  totals.filters.value = { ...f, group_by: 'total', page: 1, limit: props.pageSize || 25 };
}, { deep: true });

// Summary KPIs from daily data (aggregate last 7 days)
const kpis = computed(() => {
  const rows = (daily.list.value?.data || []) as ValidatorPerformanceRow[];
  const byValidator = new Map<string, { relays: number; cu: number; effWeighted: number; effWeight: number }>();
  let validatorsCount = 0;
  rows.forEach(r => {
    const key = r.supplier_operator_address;
    if (!byValidator.has(key)) {
      validatorsCount += 1;
      byValidator.set(key, { relays: 0, cu: 0, effWeighted: 0, effWeight: 0 });
    }
    const agg = byValidator.get(key)!;
    agg.relays += r.total_relays || 0;
    agg.cu += r.total_claimed_compute_units || 0;
    if (r.avg_efficiency_percent !== null) {
      const w = r.total_relays || 0;
      agg.effWeighted += r.avg_efficiency_percent * w;
      agg.effWeight += w;
    }
  });

  const totalRelays = Array.from(byValidator.values()).reduce((s, v) => s + v.relays, 0);
  const totalCU = Array.from(byValidator.values()).reduce((s, v) => s + v.cu, 0);
  const eff = (() => {
    const ew = Array.from(byValidator.values()).reduce((s, v) => s + v.effWeighted, 0);
    const wt = Array.from(byValidator.values()).reduce((s, v) => s + v.effWeight, 0);
    return wt > 0 ? ew / wt : null;
  })();

  return { totalRelays, totalCU, avgEfficiency: eff, validatorsCount };
});

// Chart series (daily by date)
const chartOptions = computed(() => getMarketPriceChartConfig(baseStore.theme, (daily.list.value?.data || []).map(r => r.bucket || '')));
const relaysSeries = computed(() => [{ name: 'Relays', data: (daily.list.value?.data || []).map(r => r.total_relays || 0) }]);
const cuSeries = computed(() => [{ name: 'Claimed CU', data: (daily.list.value?.data || []).map(r => r.total_claimed_compute_units || 0) }]);

// Leaderboard rows (totals per validator)
const tableRows = computed(() => totals.list.value?.data || []);
const meta = computed(() => totals.list.value?.meta);

function formatNum(n: number | null | undefined) { return new Intl.NumberFormat().format(n || 0); }
function effColor(v: number | null) {
  if (v === null) return 'text-gray-400';
  if (v >= 95) return 'text-success';
  if (v >= 80) return 'text-warning';
  return 'text-error';
}

function changePage(delta: number) {
  if (!meta.value) return;
  const next = Math.min(Math.max(1, meta.value.page + delta), meta.value.totalPages);
  if (next === meta.value.page) return;
  totals.filters.value = { ...totals.filters.value, page: next };
}
</script>

<template>
  <div>
    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
        <div class="text-xs text-secondary mb-1">Total Relays (7d)</div>
        <div class="text-2xl font-bold">{{ formatNum(kpis.totalRelays) }}</div>
      </div>
      <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
        <div class="text-xs text-secondary mb-1">Claimed Compute Units (7d)</div>
        <div class="text-2xl font-bold">{{ formatNum(kpis.totalCU) }}</div>
      </div>
      <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
        <div class="text-xs text-secondary mb-1">Avg Efficiency (weighted)</div>
        <div class="text-2xl font-bold" :class="effColor(kpis.avgEfficiency)">{{ kpis.avgEfficiency === null ? '-' : kpis.avgEfficiency.toFixed(2) + '%' }}</div>
      </div>
      <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
        <div class="text-xs text-secondary mb-1">Validators</div>
        <div class="text-2xl font-bold">{{ formatNum(kpis.validatorsCount) }}</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div class="dark:bg-base-100 bg-base-200 p-3 rounded-xl">
        <div class="text-sm mb-2">Relays by Day</div>
        <ApexCharts type="area" height="260" :options="chartOptions" :series="relaysSeries" />
      </div>
      <div class="dark:bg-base-100 bg-base-200 p-3 rounded-xl">
        <div class="text-sm mb-2">Claimed CU by Day</div>
        <ApexCharts type="area" height="260" :options="chartOptions" :series="cuSeries" />
      </div>
    </div>

    <!-- Leaderboard Table (totals per validator in date range) -->
    <div class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-4 rounded-xl shadow-md">
      <div class="bg-base-200 rounded-md overflow-auto">
        <table class="table table-compact w-full">
          <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
            <tr>
              <th>Moniker</th>
              <th>Domain</th>
              <th class="text-right">Relays</th>
              <th class="text-right">Claimed CU</th>
              <th class="text-right">Avg Eff</th>
              <th class="text-right">Apps</th>
              <th class="text-right">Services</th>
            </tr>
          </thead>
          <tbody class="bg-base-100">
            <tr v-for="row in tableRows" :key="row.supplier_operator_address" class="hover:bg-base-300">
              <td>{{ row.moniker || 'Unknown' }}</td>
              <td>{{ row.website_domain || '-' }}</td>
              <td class="text-right">{{ formatNum(row.total_relays) }}</td>
              <td class="text-right">{{ formatNum(row.total_claimed_compute_units) }}</td>
              <td class="text-right" :class="effColor(row.avg_efficiency_percent)">{{ row.avg_efficiency_percent === null ? '-' : row.avg_efficiency_percent.toFixed(2) + '%' }}</td>
              <td class="text-right">{{ formatNum(row.unique_applications) }}</td>
              <td class="text-right">{{ formatNum(row.unique_services) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between px-2 mt-2 text-sm">
        <div>
          Page {{ meta?.page || 1 }} / {{ meta?.totalPages || 1 }}
        </div>
        <div class="flex gap-2">
          <button class="btn btn-xs" @click="changePage(-1)">Prev</button>
          <button class="btn btn-xs" @click="changePage(1)">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>


