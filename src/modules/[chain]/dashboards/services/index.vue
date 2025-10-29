<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import ApexCharts from 'vue3-apexcharts';
import { useBlockchain, useFormatter } from '@/stores';

const props = defineProps(['chain']);
const chainStore = useBlockchain();
const format = useFormatter();
// Map frontend chain names to API chain names
const getApiChainName = (chainName: string) => {
  const chainMap: Record<string, string> = {
    'pocket-beta': 'pocket-testnet-beta',
    'pocket-alpha': 'pocket-testnet-alpha',
    'pocket-mainnet': 'pocket-mainnet'
  };
  return chainMap[chainName] || chainName || 'pocket-testnet-beta';
};

const current = chainStore?.current?.chainName || props.chain || 'pocket-beta';
const apiChainName = computed(() => getApiChainName(current));

interface ProofSubmission {
  id: number;
  transaction_hash: string;
  block_height: string;
  timestamp: string;
  supplier_operator_address: string;
  application_address: string;
  service_id: string;
  session_id: string;
  session_end_block_height: string;
  claim_proof_status_int: number;
  claimed_upokt: string;
  claimed_upokt_amount: string;
  num_claimed_compute_units: string;
  num_estimated_compute_units: string;
  num_relays: string;
  compute_unit_efficiency: string;
  reward_per_relay: string;
  msg_index: number;
  created_at: string;
}

interface RewardAnalytics {
  supplier_operator_address: string;
  application_address: string;
  service_id: string;
  hour_bucket: string;
  submission_count: number;
  total_rewards_upokt: number;
  total_relays: number;
  total_claimed_compute_units: number;
  total_estimated_compute_units: number;
  avg_efficiency_percent: number;
  avg_reward_per_relay: number;
  max_reward_per_submission: number;
  min_reward_per_submission: number;
}

interface SummaryStats {
  total_submissions: string;
  unique_suppliers: string;
  unique_applications: string;
  unique_services: string;
  total_rewards_upokt: string;
  total_relays: string;
  total_claimed_compute_units: string;
  total_estimated_compute_units: string;
  avg_efficiency_percent: string;
  avg_reward_per_relay: string;
  first_submission: string;
  last_submission: string;
}

interface TopServiceByComputeUnits {
  service_id: string;
  chain: string;
  total_claimed_compute_units: string;
  total_estimated_compute_units: string;
  submission_count: string;
  avg_efficiency_percent: string;
  period_start: string;
  period_end: string;
}

interface TopServiceByPerformance {
  rank: number;
  service_id: string;
  chain: string;
  total_claimed_compute_units: number;
  total_estimated_compute_units: number;
  submission_count: number;
  avg_efficiency_percent: number;
  percentage_of_total: number;
  period_start: string;
  period_end: string;
}

const loading = ref(false);
const summaryStats = ref<SummaryStats | null>(null);
const submissions = ref<ProofSubmission[]>([]);
const rewardAnalytics = ref<RewardAnalytics[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(25);
const totalPages = ref(0);
const selectedService = ref('');
const selectedSupplier = ref('');
const selectedApplication = ref('');
const startDate = ref('');
const endDate = ref('');
const uniqueServices = ref(['iotex', 'avax', 'blast', 'fuse']);

// New state for services endpoints
const topServicesByComputeUnits = ref<TopServiceByComputeUnits[]>([]);
const topServicesByPerformance = ref<TopServiceByPerformance[]>([]);
const totalComputeUnits = ref(0);
const loadingTopServices = ref(false);
const loadingPerformanceTable = ref(false);
const topServicesLimit = ref(10);
const topServicesDays = ref(30);
const performanceDays = ref(30);

const rewardsChartSeries = ref([{ name: 'Total Rewards', data: [] as number[] }]);
const efficiencyChartSeries = ref([{ name: 'Efficiency %', data: [] as number[] }]);
const relaysChartSeries = ref([{ name: 'Total Relays', data: [] as number[] }]);

const rewardsChartOptions = ref({
  chart: { type: 'area', height: 280, toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#A3E635'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] } },
  grid: { borderColor: 'rgba(255, 255, 255, 0.1)', row: { colors: ['transparent'], opacity: 0.5 } },
  markers: { size: 0 },
  xaxis: { categories: [] as string[], labels: { style: { colors: 'rgb(116, 109, 105)' } } },
  yaxis: { labels: { style: { colors: 'rgb(116, 109, 105)' }, formatter: (v: number) => (v / 1000000).toFixed(1) + 'M' } },
  tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toLocaleString() + ' upokt' } }
});

const efficiencyChartOptions = ref({
  chart: { type: 'line', height: 280, toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#5E9AE4'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2},
  grid: { borderColor: 'rgba(255, 255, 255, 0.1)', row: { colors: ['transparent'], opacity: 0.5 } },
  markers: { size: 0 },
  xaxis: { categories: [] as string[], labels: { style: { colors: 'rgb(116, 109, 105)' } } },
  yaxis: { labels: { style: { colors: 'rgb(116, 109, 105)' }, formatter: (v: number) => v.toFixed(2) + '%' }, max: 100, min: 0 },
  tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toFixed(2) + '%' } }
});

const relaysChartOptions = ref({
  chart: { type: 'column', height: 280, toolbar: { show: false } },
  colors: ['#09279F'],
  dataLabels: { enabled: false },
  grid: { borderColor: 'rgba(255, 255, 255, 0.1)' },
  xaxis: { categories: [] as string[], labels: { style: { colors: 'rgb(116, 109, 105)' } } },
  yaxis: { labels: { style: { colors: 'rgb(116, 109, 105)' }, formatter: (v: number) => (v / 1000).toFixed(0) + 'K' } },
  tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toLocaleString() + ' relays' } }
});

// Chart for top services by compute units (growth graph)
const topServicesChartSeries = ref([{ name: 'Compute Units', data: [] as number[] }]);
const topServicesChartOptions = ref({
  chart: { type: 'bar', height: 350, toolbar: { show: false } },
  colors: ['#A3E635'],
  dataLabels: { enabled: true, formatter: (v: number) => (v / 1000000000).toFixed(2) + 'B', style: { colors: ['#000'] } },
  plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
  grid: { borderColor: 'rgba(255, 255, 255, 0.1)' },
  xaxis: { categories: [] as string[], labels: { style: { colors: 'rgb(116, 109, 105)' }, rotate: -45, rotateAlways: false } },
  yaxis: { labels: { style: { colors: 'rgb(116, 109, 105)' }, formatter: (v: number) => (v / 1000000000).toFixed(2) + 'B' } },
  tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toLocaleString() + ' compute units' } }
});

async function loadSummaryStats() {
  try {
    const params = new URLSearchParams();
    params.append('chain', apiChainName.value);
    if (selectedService.value) params.append('service_id', selectedService.value);
    if (selectedSupplier.value) params.append('supplier_address', selectedSupplier.value);
    if (selectedApplication.value) params.append('application_address', selectedApplication.value);
    
    const response = await fetch(`/api/v1/proof-submissions/summary?${params.toString()}`);
    const data = await response.json();
    
    if (response.ok) {
      summaryStats.value = data.data;
    } else {
      console.error('Error loading summary stats:', data);
    }
  } catch (error) {
    console.error('Error loading summary stats:', error);
  }
}

function updateCharts() {
  const sorted = [...rewardAnalytics.value].sort((a, b) => new Date(a.hour_bucket).getTime() - new Date(b.hour_bucket).getTime());
  const labels = sorted.map(d => new Date(d.hour_bucket).toLocaleString());
  rewardsChartSeries.value = [{ name: 'Total Rewards', data: sorted.map(d => d.total_rewards_upokt) }];
  efficiencyChartSeries.value = [{ name: 'Efficiency %', data: sorted.map(d => d.avg_efficiency_percent) }];
  relaysChartSeries.value = [{ name: 'Total Relays', data: sorted.map(d => d.total_relays) }];
  rewardsChartOptions.value = { ...rewardsChartOptions.value, xaxis: { ...rewardsChartOptions.value.xaxis, categories: labels } };
  efficiencyChartOptions.value = { ...efficiencyChartOptions.value, xaxis: { ...efficiencyChartOptions.value.xaxis, categories: labels } };
  relaysChartOptions.value = { ...relaysChartOptions.value, xaxis: { ...relaysChartOptions.value.xaxis, categories: labels } };
}

async function loadProofSubmissions() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.append('chain', apiChainName.value);
    if (selectedService.value) params.append('service_id', selectedService.value);
    if (selectedSupplier.value) params.append('supplier_address', selectedSupplier.value);
    if (selectedApplication.value) params.append('application_address', selectedApplication.value);
    if (startDate.value) params.append('start_date', startDate.value);
    if (endDate.value) params.append('end_date', endDate.value);
    params.append('page', currentPage.value.toString());
    params.append('limit', itemsPerPage.value.toString());
    
    const response = await fetch(`/api/v1/proof-submissions?${params.toString()}`);
    const data = await response.json();
    
    if (response.ok) {
      submissions.value = data.data || [];
      totalPages.value = data.meta?.totalPages || 0;
    } else {
      console.error('Error loading proof submissions:', data);
      submissions.value = [];
      totalPages.value = 0;
    }
  } catch (error) {
    console.error('Error loading proof submissions:', error);
    submissions.value = [];
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  currentPage.value = 1;
  loadSummaryStats();
  loadProofSubmissions();
}

function nextPage() { if (currentPage.value < totalPages.value) { currentPage.value++; loadProofSubmissions(); } }
function prevPage() { if (currentPage.value > 1) { currentPage.value--; loadProofSubmissions(); } }
function goToFirst() { currentPage.value = 1; loadProofSubmissions(); }
function goToLast() { currentPage.value = totalPages.value; loadProofSubmissions(); }
async function loadTopServicesByComputeUnits() {
  loadingTopServices.value = true;
  try {
    const params = new URLSearchParams();
    params.append('limit', topServicesLimit.value.toString());
    params.append('days', topServicesDays.value.toString());
    params.append('chain', apiChainName.value);
    
    const response = await fetch(`/api/v1/services/top-by-compute-units?${params.toString()}`);
    const data = await response.json();
    
    if (response.ok) {
      topServicesByComputeUnits.value = data.data || [];
      updateTopServicesChart();
    } else {
      console.error('Error loading top services by compute units:', data);
      topServicesByComputeUnits.value = [];
    }
  } catch (error) {
    console.error('Error loading top services by compute units:', error);
    topServicesByComputeUnits.value = [];
  } finally {
    loadingTopServices.value = false;
  }
}

async function loadTopServicesByPerformance() {
  loadingPerformanceTable.value = true;
  try {
    const params = new URLSearchParams();
    params.append('days', performanceDays.value.toString());
    params.append('chain', apiChainName.value);
    
    const response = await fetch(`/api/v1/services/top-by-performance?${params.toString()}`);
    const data = await response.json();
    
    if (response.ok) {
      topServicesByPerformance.value = data.data || [];
      totalComputeUnits.value = data.total_compute_units || 0;
    } else {
      console.error('Error loading top services by performance:', data);
      topServicesByPerformance.value = [];
      totalComputeUnits.value = 0;
    }
  } catch (error) {
    console.error('Error loading top services by performance:', error);
    topServicesByPerformance.value = [];
    totalComputeUnits.value = 0;
  } finally {
    loadingPerformanceTable.value = false;
  }
}

function updateTopServicesChart() {
  const sorted = [...topServicesByComputeUnits.value].sort((a, b) => 
    parseInt(b.total_claimed_compute_units) - parseInt(a.total_claimed_compute_units)
  );
  const labels = sorted.map(s => s.service_id);
  const data = sorted.map(s => parseInt(s.total_claimed_compute_units));
  
  topServicesChartSeries.value = [{ name: 'Compute Units', data }];
  topServicesChartOptions.value = {
    ...topServicesChartOptions.value,
    xaxis: { ...topServicesChartOptions.value.xaxis, categories: labels }
  };
}

function formatNumber(num: number | string): string { return new Intl.NumberFormat().format(typeof num === 'string' ? parseInt(num) : num); }
function formatComputeUnits(units: number | string): string {
  const value = typeof units === 'string' ? parseInt(units) : units;
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + 'B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + 'K';
  }
  return value.toString();
}

onMounted(() => {
  loadSummaryStats();
  loadProofSubmissions();
  loadTopServicesByComputeUnits();
  loadTopServicesByPerformance();
});
</script>

<template>
  <div>
    <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-2 my-4 font-bold text-[#ffffff]">
      {{ $t('module.services') }} Dashboard
    </p>

    <div v-if="summaryStats" class="mb-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-main">Summary Statistics</h3>
        <span class="text-xs text-secondary bg-base-200 dark:bg-base-300 px-3 py-1 rounded-full">Last 24 Hours</span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#5E9AE4] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:file-document-multiple" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Submissions</div>
            </div>
            <div class="text-xl font-bold">{{ formatNumber(parseInt(summaryStats.total_submissions)) }}</div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#60BC29] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:package-variant" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Suppliers</div>
            </div>
            <div class="text-xl font-bold">{{ formatNumber(parseInt(summaryStats.unique_suppliers)) }}</div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#FFB206] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:apps" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Applications</div>
            </div>
            <div class="text-xl font-bold">{{ formatNumber(parseInt(summaryStats.unique_applications)) }}</div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#09279F] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:handshake" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Services</div>
            </div>
            <div class="text-xl font-bold">{{ formatNumber(parseInt(summaryStats.unique_services)) }}</div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#A3E635] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:network" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Total Relays</div>
            </div>
            <div class="text-xl font-bold">{{ formatNumber(parseInt(summaryStats.total_relays)) }}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#5E9AE4] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:percent" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Avg Efficiency</div>
            </div>
            <div class="text-xl font-bold">{{ parseFloat(summaryStats.avg_efficiency_percent).toFixed(2) }}%</div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#60BC29] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:coin" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Avg Reward/Relay</div>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold">{{ (parseFloat(summaryStats.avg_reward_per_relay) / 1000000).toFixed(6) }}</div>
              <div class="text-xs text-secondary">POKT</div>
            </div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#FFB206] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:cpu-64-bit" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Claimed Compute Units</div>
            </div>
            <div class="text-xl font-bold">{{ formatComputeUnits(parseInt(summaryStats.total_claimed_compute_units)) }}</div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#A3E635] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:currency-usd" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Total Rewards</div>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold">{{ format.formatToken({ denom: 'upokt', amount: String(summaryStats.total_rewards_upokt) }) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Services by Compute Units Growth Chart -->
    <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-5">
      <div class="flex items-center justify-between mb-4 ml-5 mr-5">
        <div class="text-lg font-semibold text-main">Top Services by Compute Units</div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-secondary">Limit:</span>
          <select v-model="topServicesLimit" @change="loadTopServicesByComputeUnits()" class="select select-bordered select-sm w-20">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span class="text-sm text-secondary">Days:</span>
          <select v-model="topServicesDays" @change="loadTopServicesByComputeUnits()" class="select select-bordered select-sm w-20">
            <option :value="7">7</option>
            <option :value="15">15</option>
            <option :value="30">30</option>
          </select>
        </div>
      </div>
      <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md">
        <div v-if="loadingTopServices" class="flex justify-center items-center h-96">
          <div class="loading loading-spinner loading-lg"></div>
          <span class="ml-2">Loading services data...</span>
        </div>
        <div v-else-if="topServicesByComputeUnits.length === 0" class="flex justify-center items-center h-96 text-gray-500">
          No services data found
        </div>
        <div v-else class="h-96">
          <ApexCharts type="bar" height="350" :options="topServicesChartOptions" :series="topServicesChartSeries" />
        </div>
      </div>
    </div>

    <!-- Top Services by Performance Table -->
    <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-5">
      <div class="flex items-center justify-between mb-4 ml-5 mr-5">
        <div class="text-lg font-semibold text-main">Top Services Performance (Market Share)</div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-secondary">Days:</span>
          <select v-model="performanceDays" @change="loadTopServicesByPerformance()" class="select select-bordered select-sm w-20">
            <option :value="7">7</option>
            <option :value="15">15</option>
            <option :value="30">30</option>
          </select>
        </div>
      </div>
      <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md">
        <div v-if="loadingPerformanceTable" class="flex justify-center items-center py-8">
          <div class="loading loading-spinner loading-md"></div>
          <span class="ml-2">Loading performance data...</span>
        </div>
        <div v-else-if="topServicesByPerformance.length === 0" class="text-center py-8 text-gray-500">
          No performance data found
        </div>
        <div v-else class="overflow-auto">
          <table class="table w-full">
            <thead class="bg-white sticky top-0">
              <tr class="border-b-[0px]">
                <th>Rank</th>
                <th>Service</th>
                <th>Compute Units</th>
                <th>Market Share</th>
                <th>Submissions</th>
                <th>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in topServicesByPerformance" :key="service.service_id" class="hover:bg-base-300 transition-colors duration-200 border-b-[0px]">
                <td class="dark:bg-base-200 bg-white font-bold">
                  <span class="badge badge-lg" :class="service.rank === 1 ? 'badge-primary' : service.rank === 2 ? 'badge-secondary' : service.rank === 3 ? 'badge-accent' : 'badge-ghost'">
                    #{{ service.rank }}
                  </span>
                </td>
                <td class="dark:bg-base-200 bg-white">
                  <span class="badge badge-primary badge-sm">{{ service.service_id }}</span>
                </td>
                <td class="dark:bg-base-200 bg-white">{{ formatNumber(service.total_claimed_compute_units) }}</td>
                <td class="dark:bg-base-200 bg-white">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 bg-base-300 rounded-full h-4 overflow-hidden">
                      <div 
                        class="h-full rounded-full transition-all duration-500"
                        :class="service.rank === 1 ? 'bg-primary' : service.rank === 2 ? 'bg-secondary' : service.rank === 3 ? 'bg-accent' : 'bg-info'"
                        :style="{ width: `${service.percentage_of_total}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-semibold min-w-[50px]">{{ service.percentage_of_total.toFixed(2) }}%</span>
                  </div>
                </td>
                <td class="dark:bg-base-200 bg-white">{{ formatNumber(service.submission_count) }}</td>
                <td class="dark:bg-base-200 bg-white">
                  <span :class="service.avg_efficiency_percent >= 95 ? 'text-success' : service.avg_efficiency_percent >= 80 ? 'text-warning' : 'text-error'">
                    {{ service.avg_efficiency_percent.toFixed(2) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="totalComputeUnits > 0" class="mt-4 text-sm text-secondary px-4">
            Total Network Compute Units: <span class="font-semibold">{{ formatNumber(totalComputeUnits) }}</span>
          </div>
        </div>
      </div>
    </div>
<!-- 
    <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-5" v-if="rewardAnalytics.length > 0">
      <div class="flex items-center mb-4"><div class="text-lg font-semibold text-main ml-5">Hourly Relays</div></div>
      <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md"><div class="h-80"><ApexCharts type="column" height="280" :options="relaysChartOptions" :series="relaysChartSeries" /></div></div>
    </div> -->

    <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-5">
      <div class="flex items-center justify-between mb-4 ml-5">
        <div class="text-lg font-semibold text-main">Proof Submissions</div>
        <div class="flex items-center gap-2 mr-5">
          <span class="text-sm text-secondary">Show:</span>
          <select v-model="itemsPerPage" @change="loadProofSubmissions()" class="select select-bordered select-sm w-20">
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
      <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md">
        <div class="overflow-auto">
          <table class="table w-full table-compact">
            <thead class="bg-white sticky top-0">
              <tr class="border-b-[0px]">
                <th>Tx Hash</th>
                <th>Service</th>
                <th>Supplier</th>
                <th>Application</th>
                <th>Relays</th>
                <th>Rewards</th>
                <th>Efficiency</th>
                <th>Reward/Relay</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="text-center"><td colspan="9" class="py-8"><div class="flex justify-center items-center"><div class="loading loading-spinner loading-md"></div><span class="ml-2">Loading submissions...</span></div></td></tr>
              <tr v-else-if="submissions.length === 0" class="text-center"><td colspan="9" class="py-8"><div class="text-gray-500">No submissions found</div></td></tr>
              <tr v-for="submission in submissions" :key="submission.id" class="hover:bg-base-300 transition-colors duration-200 border-b-[0px]">
                <td class="truncate dark:bg-base-200 bg-white text-[#153cd8]" style="max-width:200px"><a :href="`#tx/${submission.transaction_hash}`" class="hover:underline">{{ submission.transaction_hash.substring(0, 16) }}...</a></td>
                <td class="dark:bg-base-200 bg-white"><span class="badge badge-primary badge-sm">{{ submission.service_id }}</span></td>
                <td class="truncate dark:bg-base-200 bg-white" style="max-width:180px">{{ submission.supplier_operator_address }}</td>
                <td class="truncate dark:bg-base-200 bg-white" style="max-width:180px">{{ submission.application_address }}</td>
                <td class="dark:bg-base-200 bg-white">{{ formatNumber(parseInt(submission.num_relays)) }}</td>
                <td class="dark:bg-base-200 bg-white">{{ format.formatToken({ denom: 'upokt', amount: String(submission.claimed_upokt_amount) }) }}</td>
                <td class="dark:bg-base-200 bg-white"><span :class="parseFloat(submission.compute_unit_efficiency) >= 95 ? 'text-success' : parseFloat(submission.compute_unit_efficiency) >= 80 ? 'text-warning' : 'text-error'">{{ parseFloat(submission.compute_unit_efficiency).toFixed(2) }}%</span></td>
                <td class="dark:bg-base-200 bg-white">{{ (parseFloat(submission.reward_per_relay) / 1000000).toFixed(6) }}</td>
                <td class="dark:bg-base-200 bg-white text-sm">{{ new Date(submission.timestamp).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-between items-center gap-4 my-6 px-6">
          <div class="flex items-center gap-2"><span class="text-sm text-gray-600">Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, submissions.length) }} of {{ submissions.length }} submissions</span></div>
          <div class="flex items-center gap-1">
            <button class="btn btn-sm btn-ghost" @click="goToFirst" :disabled="currentPage === 1 || totalPages === 0">First</button>
            <button class="btn btn-sm btn-ghost" @click="prevPage" :disabled="currentPage === 1 || totalPages === 0">&lt;</button>
            <span class="text-xs px-2">Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="btn btn-sm btn-ghost" @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">&gt;</button>
            <button class="btn btn-sm btn-ghost" @click="goToLast" :disabled="currentPage === totalPages || totalPages === 0">Last</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .table { font-size: 0.75rem; }
  th, td { padding: 0.5rem; }
}
</style>

