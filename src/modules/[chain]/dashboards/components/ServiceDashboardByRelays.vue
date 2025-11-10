<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';
import ApexCharts from 'vue3-apexcharts';
import { useBlockchain } from '@/stores';

const props = defineProps<{
  chain?: string;
  filters?: {
    supplier_address?: string;
    owner_address?: string;
  };
}>();

const chainStore = useBlockchain();

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

// Helper function to determine if we should use POST (multiple addresses or long URL)
function shouldUsePost(params: URLSearchParams): boolean {
  // Use filters from props if provided, otherwise use internal selectedSupplier
  const supplierFilter = props.filters?.supplier_address || selectedSupplier.value;
  if (!supplierFilter) return false;
  
  // Check if it's comma-separated (multiple addresses)
  if (typeof supplierFilter === 'string' && supplierFilter.includes(',')) {
    return true;
  }
  
  // Check if URL would be too long (conservative estimate: > 2000 chars)
  const url = `?${params.toString()}`;
  return url.length > 2000;
}

// Helper function to make API request (GET or POST)
async function fetchApi(url: string, params: URLSearchParams): Promise<any> {
  if (shouldUsePost(params)) {
    // Use POST with request body
    const postBody: any = {};
    params.forEach((value, key) => {
      if (key === 'supplier_address' && value.includes(',')) {
        // Convert comma-separated to array
        postBody[key] = value.split(',').map((addr: string) => addr.trim()).filter((addr: string) => addr.length > 0);
      } else {
        postBody[key] = value;
      }
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postBody),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
    return data;
  } else {
    // Use GET
    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
    return data;
  }
}

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
  submission_count: string;
  total_rewards_upokt: string;
  total_relays: string;
  total_claimed_compute_units: string;
  total_estimated_compute_units: string;
  avg_efficiency_percent: string;
  avg_reward_per_relay: string;
  max_reward_per_submission: string;
  min_reward_per_submission: string;
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

const rewardsChartSeries = ref([{ name: 'Total Rewards (upokt)', data: [] as number[] }]);
const efficiencyChartSeries = ref([{ name: 'Avg Efficiency %', data: [] as number[] }]);
const relaysChartSeries = ref([{ name: 'Total Relays', data: [] as number[] }]);

// Bar chart for top services by rewards (most recent hour)
const topServicesChartSeries = ref([{ name: 'Rewards (upokt)', data: [] as number[] }]);
const topServicesChartType = ref<'bar' | 'area' | 'line'>('bar');
const topServicesChartCategories = ref<string[]>([]);

const topServicesChartOptions = computed(() => {
  const chartType = topServicesChartType.value;
  
  const strokeConfig = chartType === 'bar' 
    ? { width: 0 }
    : {
        curve: chartType === 'area' ? 'smooth' : 'straight',
        width: 2
      };
  
  const fillConfig = chartType === 'bar'
    ? { opacity: 1, type: 'solid' }
    : {
        type: chartType === 'area' ? 'gradient' : 'solid',
        opacity: chartType === 'area' ? 0.3 : 0,
        gradient: chartType === 'area' ? {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        } : undefined
      };

  return {
    chart: { type: chartType, height: 350, toolbar: { show: false } },
    colors: ['#A3E635'],
    dataLabels: { enabled: chartType === 'bar', formatter: (v: number) => (v / 1000000).toFixed(2) + 'M', style: { colors: ['#000'] } },
    plotOptions: chartType === 'bar' ? { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } } : {},
    stroke: strokeConfig,
    fill: fillConfig,
    grid: { borderColor: 'rgba(255, 255, 255, 0.1)' },
    markers: chartType === 'bar' ? { size: 0 } : chartType === 'line' ? {
      size: 4,
      strokeWidth: 0,
      hover: { size: 6 }
    } : { size: 2, hover: { size: 5 } },
    xaxis: { categories: topServicesChartCategories.value, labels: { style: { colors: 'rgb(116, 109, 105)' }, rotate: -45, rotateAlways: false } },
    yaxis: { labels: { style: { colors: 'rgb(116, 109, 105)' }, formatter: (v: number) => (v / 1000000).toFixed(2) + 'M' } },
    tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toLocaleString() + ' upokt' } }
  };
});


async function loadSummaryStats() {
  try {
    const params = new URLSearchParams();
    params.append('chain', apiChainName.value);
    if (selectedService.value) params.append('service_id', selectedService.value);
    // Use filters from props if provided, otherwise use internal selectedSupplier
    const supplierFilter = props.filters?.supplier_address || selectedSupplier.value;
    if (supplierFilter) params.append('supplier_address', supplierFilter);
    if (props.filters?.owner_address) params.append('owner_address', props.filters.owner_address);
    if (selectedApplication.value) params.append('application_address', selectedApplication.value);
    
    const data = await fetchApi('/api/v1/proof-submissions/summary', params);
    summaryStats.value = data.data;
  } catch (error: any) {
    console.error('Error loading summary stats:', error);
  }
}

async function loadRewardAnalytics() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.append('chain', apiChainName.value);
    if (selectedService.value) params.append('service_id', selectedService.value);
    // Use filters from props if provided, otherwise use internal selectedSupplier
    const supplierFilter = props.filters?.supplier_address || selectedSupplier.value;
    if (supplierFilter) params.append('supplier_address', supplierFilter);
    if (props.filters?.owner_address) params.append('owner_address', props.filters.owner_address);
    if (selectedApplication.value) params.append('application_address', selectedApplication.value);
    if (startDate.value) params.append('start_date', startDate.value);
    if (endDate.value) params.append('end_date', endDate.value);
    params.append('limit', '100');
    
    const data = await fetchApi('/api/v1/proof-submissions/rewards', params);
    rewardAnalytics.value = data.data || [];
    updateCharts();
  } catch (error: any) {
    console.error('Error loading reward analytics:', error);
    rewardAnalytics.value = [];
  } finally {
    loading.value = false;
  }
}

function updateCharts() {
  if (rewardAnalytics.value.length === 0) return;
  
  // Get the most recent hour bucket
  const sortedByTime = [...rewardAnalytics.value].sort((a, b) => 
    new Date(b.hour_bucket).getTime() - new Date(a.hour_bucket).getTime()
  );
  const latestHourBucket = sortedByTime[0]?.hour_bucket;
  
  if (!latestHourBucket) return;
  
  // Get all entries for the most recent hour bucket
  const latestHourData = rewardAnalytics.value.filter(
    d => d.hour_bucket === latestHourBucket
  );
  
  // Group by service_id and sum rewards, also track top supplier and application for each service
  const serviceRewards: Record<string, number> = {};
  const serviceData: Record<string, { rewards: number; efficiency: number; relays: number; count: number; topSupplier: string; topApplication: string }> = {};
  
  latestHourData.forEach(d => {
    const serviceId = d.service_id || 'unknown';
    const supplierAddress = d.supplier_operator_address || 'unknown';
    const applicationAddress = d.application_address || 'unknown';
    
    if (!serviceRewards[serviceId]) {
      serviceRewards[serviceId] = 0;
      serviceData[serviceId] = { rewards: 0, efficiency: 0, relays: 0, count: 0, topSupplier: supplierAddress, topApplication: applicationAddress };
    }
    serviceRewards[serviceId] += parseInt(d.total_rewards_upokt);
    serviceData[serviceId].rewards += parseInt(d.total_rewards_upokt);
    serviceData[serviceId].efficiency += parseInt(d.avg_efficiency_percent) * parseInt(d.total_rewards_upokt);
    serviceData[serviceId].relays += parseInt(d.total_relays);
    serviceData[serviceId].count += parseInt(d.submission_count);
    // Track most frequent supplier and application (can be improved to track highest reward ones)
    if (supplierAddress !== 'unknown') serviceData[serviceId].topSupplier = supplierAddress;
    if (applicationAddress !== 'unknown') serviceData[serviceId].topApplication = applicationAddress;
  });
  
  // Calculate weighted averages for efficiency
  Object.keys(serviceData).forEach(serviceId => {
    if (serviceData[serviceId].rewards > 0) {
      serviceData[serviceId].efficiency = serviceData[serviceId].efficiency / serviceData[serviceId].rewards;
    }
  });
  
  // Get top 10 services by rewards
  const topServices = Object.entries(serviceRewards)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([serviceId]) => ({
      serviceId,
      rewards: serviceRewards[serviceId],
      efficiency: serviceData[serviceId].efficiency,
      relays: serviceData[serviceId].relays,
      count: serviceData[serviceId].count,
      topSupplier: serviceData[serviceId].topSupplier,
      topApplication: serviceData[serviceId].topApplication
    }));
  
  // Update bar chart for top services
  topServicesChartSeries.value = [{ name: 'Rewards (upokt)', data: topServices.map(s => s.rewards) }];
  topServicesChartCategories.value = topServices.map(s => s.serviceId);
  
  // Store latest hour bucket time for display
  latestHourBucketTime.value = latestHourBucket;
  topServicesData.value = topServices;

  // Compute last-hour summary metrics
  lastHourTotalRewards.value = latestHourData.reduce((sum, d) => sum + parseInt(d.total_rewards_upokt), 0);
  lastHourTotalRelays.value = latestHourData.reduce((sum, d) => sum + parseInt(d.total_relays), 0);
  const totalEfficiencyWeight = latestHourData.reduce((sum, d) => sum + parseInt(d.total_rewards_upokt), 0);
  const weightedEfficiencySum = latestHourData.reduce((sum, d) => sum + (parseInt(d.avg_efficiency_percent) * parseInt(d.total_rewards_upokt)), 0);
  lastHourAvgEfficiency.value = totalEfficiencyWeight > 0 ? (weightedEfficiencySum / totalEfficiencyWeight) : 0;
  lastHourSubmissions.value = latestHourData.reduce((sum, d) => sum + parseInt(d.submission_count), 0);
  lastHourTopService.value = topServices.length > 0 ? topServices[0].serviceId : '';
}

const latestHourBucketTime = ref<string>('');
const topServicesData = ref<Array<{ serviceId: string; rewards: number; efficiency: number; relays: number; count: number; topSupplier: string; topApplication: string }>>([]);
// Last hour summary metrics for node runners
const lastHourTotalRewards = ref<number>(0);
const lastHourTotalRelays = ref<number>(0);
const lastHourAvgEfficiency = ref<number>(0);
const lastHourSubmissions = ref<number>(0);
const lastHourTopService = ref<string>('');

function applyFilters() {
  currentPage.value = 1;
  loadRewardAnalytics();
  // loadProofSubmissions();
}

function formatNumber(num: number | string): string { return new Intl.NumberFormat().format(typeof num === 'string' ? parseInt(num) : num); }
function formatUpokt(upokt: number | string): string { 
  const value = typeof upokt === 'string' ? parseInt(upokt) : upokt;
  return (value / 1000000).toFixed(4);
}

// Watch for filter changes and reload data
watch(() => props.filters, () => {
  loadSummaryStats();
  loadRewardAnalytics();
}, { deep: true });

onMounted(() => {
  loadSummaryStats();
  loadRewardAnalytics();
});
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-8 mb-[50vh]">
      <div class="loading loading-spinner loading-lg"></div>
      <span class="ml-2">Loading hourly analytics...</span>
    </div>
    
    <div v-if="!loading && rewardAnalytics.length === 0" class="dark:bg-base-100 bg-base-200 rounded-xl p-8 text-center mb-5">
      <Icon icon="mdi:chart-line" class="text-4xl text-secondary mb-2" />
      <p class="text-secondary">No hourly reward analytics data available</p>
      <p class="text-xs text-secondary mt-2">Data is aggregated by hour buckets</p>
    </div>
    
    <!-- Top Row: 8 KPI Boxes (Compact) -->
    <div v-if="summaryStats" class="mb-3">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Submissions</div>
          <div class="text-lg font-bold">{{ formatNumber(parseInt(summaryStats.total_submissions)) }}</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Suppliers</div>
          <div class="text-lg font-bold">{{ formatNumber(parseInt(summaryStats.unique_suppliers)) }}</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Applications</div>
          <div class="text-lg font-bold">{{ formatNumber(parseInt(summaryStats.unique_applications)) }}</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Services</div>
          <div class="text-lg font-bold">{{ formatNumber(parseInt(summaryStats.unique_services)) }}</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Total Relays</div>
          <div class="text-lg font-bold">{{ formatNumber(parseInt(summaryStats.total_relays)) }}</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Avg Efficiency</div>
          <div class="text-lg font-bold">{{ parseFloat(summaryStats.avg_efficiency_percent).toFixed(2) }}%</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Compute Units</div>
          <div class="text-lg font-bold">{{ formatNumber(parseInt(summaryStats.total_claimed_compute_units)) }}</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Total Rewards</div>
          <div class="text-lg font-bold">{{ formatUpokt(summaryStats.total_rewards_upokt) }}</div>
        </div>
      </div>
    </div>
    
    <!-- Last Hour Summary for Supplier Performance -->
    <div v-if="topServicesData.length > 0" class="mb-3">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-semibold text-main">Last Hour Summary</h3>
        <span v-if="latestHourBucketTime" class="text-xs text-secondary bg-base-200 dark:bg-base-300 px-2 py-1 rounded-full">
          {{ new Date(latestHourBucketTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
        </span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Rewards (upokt)</div>
          <div class="text-lg font-bold">{{ formatNumber(lastHourTotalRewards) }}</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Relays</div>
          <div class="text-lg font-bold">{{ formatNumber(lastHourTotalRelays) }}</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Avg Efficiency</div>
          <div class="text-lg font-bold">{{ lastHourAvgEfficiency.toFixed(2) }}%</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Submissions</div>
          <div class="text-lg font-bold">{{ formatNumber(lastHourSubmissions) }}</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Top Service</div>
          <div class="text-lg font-bold truncate" :title="lastHourTopService">{{ lastHourTopService || '-' }}</div>
        </div>
      </div>
    </div>

    <!-- Middle Section: Rewards Distribution Table (Large) -->
    <div v-if="topServicesData.length > 0" class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-3">
      <div class="flex items-center justify-between mb-3 ml-4 mr-4">
        <div class="text-base font-semibold text-main">Rewards Distribution</div>
        <span v-if="latestHourBucketTime" class="text-xs text-secondary bg-base-200 dark:bg-base-300 px-2 py-1 rounded-full">
          {{ new Date(latestHourBucketTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
        </span>
      </div>
      <div class="dark:bg-base-200 bg-base-100 p-2 rounded-md">
        <div class="overflow-auto">
          <table class="table table-compact w-full text-xs">
            <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
              <tr class="border-b-[0px]">
                <th class="py-1">Rank</th>
                <th class="py-1">Service</th>
                <th class="py-1">Supplier</th>
                <th class="py-1">Application</th>
                <th class="py-1">Rewards (upokt)</th>
                <th class="py-1">Efficiency</th>
                <th class="py-1">Relays</th>
              </tr>
            </thead>
            <tbody class="bg-base-100 relative">
              <tr v-for="(service, index) in topServicesData" :key="service.serviceId" class="hover:bg-base-300 transition-colors duration-200 border-b-[0px]">
                <td class="dark:bg-base-200 bg-white font-bold py-1">
                  <span class="badge badge-sm" :class="index === 0 ? 'badge-primary' : index === 1 ? 'badge-secondary' : index === 2 ? 'badge-accent' : 'badge-ghost'">
                    #{{ index + 1 }}
                  </span>
                </td>
                <td class="dark:bg-base-200 bg-white py-1">
                  <span class="badge badge-primary badge-xs">{{ service.serviceId }}</span>
                </td>
                <td class="dark:bg-base-200 bg-white truncate py-1 text-xs" style="max-width:120px">
                  <RouterLink
                    v-if="service.topSupplier && service.topSupplier !== 'unknown'"
                    class="truncate hover:underline font-mono dark:text-warning text-[#153cd8]"
                    :to="`/${chain}/account/${service.topSupplier}`"
                    :title="service.topSupplier"
                  >
                    {{ service.topSupplier.length > 15 ? service.topSupplier.substring(0, 12) + '...' : service.topSupplier }}
                  </RouterLink>
                  <span v-else class="font-mono text-gray-500">-</span>
                </td>
                <td class="dark:bg-base-200 bg-white truncate py-1 text-xs" style="max-width:120px">
                  <RouterLink
                    v-if="service.topApplication && service.topApplication !== 'unknown'"
                    class="truncate hover:underline font-mono dark:text-warning text-[#153cd8]"
                    :to="`/${chain}/account/${service.topApplication}`"
                    :title="service.topApplication"
                  >
                    {{ service.topApplication.length > 15 ? service.topApplication.substring(0, 12) + '...' : service.topApplication }}
                  </RouterLink>
                  <span v-else class="font-mono text-gray-500">-</span>
                </td>
                <td class="dark:bg-base-200 bg-white py-1 text-xs">{{ formatNumber(service.rewards) }}</td>
                <td class="dark:bg-base-200 bg-white py-1">
                  <span :class="service.efficiency >= 95 ? 'text-success' : service.efficiency >= 80 ? 'text-warning' : 'text-error'" class="text-xs">
                    {{ service.efficiency.toFixed(2) }}%
                  </span>
                </td>
                <td class="dark:bg-base-200 bg-white py-1 text-xs">{{ formatNumber(service.relays) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bottom Section: 3 Columns -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
      <div>
      <!-- Left Column: Servicer & Producer Cards (Stacked) -->
      <div class="space-y-3 mb-3">
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-3">
          <div class="text-sm font-semibold mb-2">Servicer</div>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-secondary mb-1">Relays Last 24H:</span>
              <span class="font-medium">{{ formatNumber(parseInt(summaryStats?.total_relays || '0')) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-secondary mb-1">Rewards Last 24H:</span>
              <span class="font-medium">{{ formatUpokt(summaryStats?.total_rewards_upokt || '0') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-secondary mb-1">Avg Efficiency:</span>
              <span class="font-medium">{{ parseFloat(summaryStats?.avg_efficiency_percent || '0').toFixed(2) }}%</span>
            </div>
          </div>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-secondary mb-1">Rewards / Times 24H:</span>
              <span class="font-medium">{{ formatUpokt(summaryStats?.total_rewards_upokt || '0') }} / {{ formatNumber(parseInt(summaryStats?.total_submissions || '0')) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-secondary mb-1">Rewards / Times 48H:</span>
              <span class="font-medium">-</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Column: Performance Card -->
      <div class="dark:bg-base-100 bg-base-200 rounded-lg p-3">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm font-semibold">Performance</div>
        </div>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between">
            <div class="text-secondary mb-1">Total Rewards <span>24H:</span></div>
            <div>
              <span class="font-medium">{{ formatUpokt(summaryStats?.total_rewards_upokt || '0') }}</span>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="text-secondary mb-1">Servicer Avg Relays <span>24H:</span></div>
            <div>
              <span class="font-medium">{{ formatNumber(parseInt(summaryStats?.total_relays || '0')) }}</span>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="text-secondary mb-1">Validator Avg Rewards <span>24H:</span></div>
            <div class="">
              <span class="font-medium">{{ (parseFloat(summaryStats?.avg_reward_per_relay || '0') / 1000000).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
      <!-- Right Column: Services Chart -->
      <div class="dark:bg-base-100 bg-base-200 rounded-lg p-3">
        <div class="text-sm font-semibold mb-2">Services</div>
        <div class="dark:bg-base-200 bg-base-100 p-2 rounded-md">
          <div v-if="topServicesData.length === 0" class="flex justify-center items-center h-64 text-gray-500 text-xs">
            No data
          </div>
          <div v-else class="h-64 relative">
            <ApexCharts 
              :type="topServicesChartType" 
              height="250" 
              :options="topServicesChartOptions" 
              :series="topServicesChartSeries"
              :key="`topServices-${topServicesChartType}`"
            />
            <!-- Chart Type Selector - Bottom Right -->
            <div class="absolute bottom-2 right-2 tabs tabs-boxed bg-base-200 dark:bg-base-300">
              <button
                @click="topServicesChartType = 'bar'"
                :class="[
                  'tab',
                  topServicesChartType === 'bar' 
                    ? 'tab-active bg-[#09279F] text-white' 
                    : ''
                ]"
                title="Bar Chart">
                <Icon icon="mdi:chart-bar" class="text-sm" />
              </button>
              <button
                @click="topServicesChartType = 'area'"
                :class="[
                  'tab',
                  topServicesChartType === 'area' 
                    ? 'tab-active bg-[#09279F] text-white' 
                    : ''
                ]"
                title="Area Chart">
                <Icon icon="mdi:chart-areaspline" class="text-sm" />
              </button>
              <button
                @click="topServicesChartType = 'line'"
                :class="[
                  'tab',
                  topServicesChartType === 'line' 
                    ? 'tab-active bg-[#09279F] text-white' 
                    : ''
                ]"
                title="Line Chart">
                <Icon icon="mdi:chart-line" class="text-sm" />
              </button>
            </div>
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

