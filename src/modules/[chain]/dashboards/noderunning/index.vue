<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';
import ApexCharts from 'vue3-apexcharts';
import { useBlockchain } from '@/stores';

const props = defineProps(['chain']);
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
const topServicesChartOptions = ref({
  chart: { type: 'bar', height: 350, toolbar: { show: false } },
  colors: ['#A3E635'],
  dataLabels: { enabled: true, formatter: (v: number) => (v / 1000000).toFixed(2) + 'M', style: { colors: ['#000'] } },
  plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
  grid: { borderColor: 'rgba(255, 255, 255, 0.1)' },
  xaxis: { categories: [] as string[], labels: { style: { colors: 'rgb(116, 109, 105)' }, rotate: -45, rotateAlways: false } },
  yaxis: { labels: { style: { colors: 'rgb(116, 109, 105)' }, formatter: (v: number) => (v / 1000000).toFixed(2) + 'M' } },
  tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toLocaleString() + ' upokt' } }
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

async function loadRewardAnalytics() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.append('chain', apiChainName.value);
    if (selectedService.value) params.append('service_id', selectedService.value);
    if (selectedSupplier.value) params.append('supplier_address', selectedSupplier.value);
    if (selectedApplication.value) params.append('application_address', selectedApplication.value);
    if (startDate.value) params.append('start_date', startDate.value);
    if (endDate.value) params.append('end_date', endDate.value);
    params.append('limit', '100');
    
    const response = await fetch(`/api/v1/proof-submissions/rewards?${params.toString()}`);
    const data = await response.json();
    
    if (response.ok) {
      rewardAnalytics.value = data.data || [];
      updateCharts();
    } else {
      console.error('Error loading reward analytics:', data);
      rewardAnalytics.value = [];
    }
  } catch (error) {
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
  topServicesChartOptions.value.xaxis = {
    ...topServicesChartOptions.value.xaxis,
    categories: topServices.map(s => s.serviceId)
  };
  
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

onMounted(() => {
  loadSummaryStats();
  loadRewardAnalytics();
});
</script>

<template>
  <div>
    <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-2 my-4 font-bold text-[#ffffff]">
      {{ $t('module.noderunning') }} 
    </p>

    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="loading loading-spinner loading-lg"></div>
      <span class="ml-2">Loading hourly analytics...</span>
    </div>
    
    <div v-if="!loading && rewardAnalytics.length === 0" class="dark:bg-base-100 bg-base-200 rounded-xl p-8 text-center mb-5">
      <Icon icon="mdi:chart-line" class="text-4xl text-secondary mb-2" />
      <p class="text-secondary">No hourly reward analytics data available</p>
      <p class="text-xs text-secondary mt-2">Data is aggregated by hour buckets</p>
    </div>
    
    <!-- Last Hour Summary for Node Runners -->
    <div v-if="topServicesData.length > 0" class="mb-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-main">Last Hour Summary</h3>
        <span v-if="latestHourBucketTime" class="text-xs text-secondary bg-base-200 dark:bg-base-300 px-3 py-1 rounded-full">
          {{ new Date(latestHourBucketTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#A3E635] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:currency-usd" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Rewards (upokt)</div>
            </div>
            <div class="text-xl font-bold">{{ formatNumber(lastHourTotalRewards) }}</div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#09279F] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:network" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Relays</div>
            </div>
            <div class="text-xl font-bold">{{ formatNumber(lastHourTotalRelays) }}</div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#5E9AE4] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:percent" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Avg Efficiency</div>
            </div>
            <div class="text-xl font-bold">{{ lastHourAvgEfficiency.toFixed(2) }}%</div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#60BC29] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:file-document-multiple" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Submissions</div>
            </div>
            <div class="text-xl font-bold">{{ formatNumber(lastHourSubmissions) }}</div>
          </div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 dark:bg-base-200 bg-[#FFB206] rounded-lg flex items-center justify-center">
                <Icon icon="mdi:star" class="text-lg text-white" />
              </div>
              <div class="text-sm text-secondary">Top Service</div>
            </div>
            <div class="text-xl font-bold truncate max-w-[10rem]" :title="lastHourTopService">{{ lastHourTopService || '-' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top 10 Services by Rewards (Most Recent Hour) -->
    <div v-if="topServicesData.length > 0" class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-5">
      <div class="flex items-center justify-between mb-4 ml-5 mr-5">
        <div class="text-lg font-semibold text-main">Top 10 Services by Rewards (Last Hour)</div>
        <span v-if="latestHourBucketTime" class="text-xs text-secondary bg-base-200 dark:bg-base-300 px-3 py-1 rounded-full">
          {{ new Date(latestHourBucketTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
        </span>
      </div>
      <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md">
        <div class="h-96">
          <ApexCharts type="bar" height="350" :options="topServicesChartOptions" :series="topServicesChartSeries" />
        </div>
      </div>
      
      <!-- Service Details Table -->
      <div class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-4 rounded-xl shadow-md mb-4">
        <div class="bg-base-200 rounded-md overflow-auto">
          <table class="table table-compact w-full">
            <thead class="sticky top-0 bg-white">
              <tr class="border-b-[0px]">
                <th class="bg-white dark:bg-base-200">Rank</th>
                <th class="bg-white dark:bg-base-200">Service</th>
                <th class="bg-white dark:bg-base-200">Supplier Address</th>
                <th class="bg-white dark:bg-base-200">Application Address</th>
                <th class="bg-white dark:bg-base-200">Rewards (upokt)</th>
                <th class="bg-white dark:bg-base-200">Efficiency</th>
                <th class="bg-white dark:bg-base-200">Relays</th>
              </tr>
            </thead>
            <tbody class="bg-base-100 relative">
              <tr v-for="(service, index) in topServicesData" :key="service.serviceId" class="hover:bg-base-300 transition-colors rounded-xl duration-200 border-b-[0px]">
                <td class="dark:bg-base-200 bg-white font-bold">
                  <span class="badge badge-lg" :class="index === 0 ? 'badge-primary' : index === 1 ? 'badge-secondary' : index === 2 ? 'badge-accent' : 'badge-ghost'">
                    #{{ index + 1 }}
                  </span>
                </td>
                <td class="dark:bg-base-200 bg-white">
                  <span class="badge badge-primary badge-sm">{{ service.serviceId }}</span>
                </td>
                <td class="dark:bg-base-200 bg-white truncate dark:text-warning text-[#153cd8]" style="max-width:25vw">
                  <RouterLink
                    v-if="service.topSupplier && service.topSupplier !== 'unknown'"
                    class="truncate hover:underline font-mono text-xs"
                    :to="`/${chain}/account/${service.topSupplier}`"
                    :title="service.topSupplier"
                  >
                    {{ service.topSupplier.length > 20 ? service.topSupplier.substring(0, 17) + '...' : service.topSupplier }}
                  </RouterLink>
                  <span v-else class="font-mono text-xs text-gray-500">-</span>
                </td>
                <td class="dark:bg-base-200 bg-white truncate dark:text-warning text-[#153cd8]" style="max-width:25vw">
                  <RouterLink
                    v-if="service.topApplication && service.topApplication !== 'unknown'"
                    class="truncate hover:underline font-mono text-xs"
                    :to="`/${chain}/account/${service.topApplication}`"
                    :title="service.topApplication"
                  >
                    {{ service.topApplication.length > 20 ? service.topApplication.substring(0, 17) + '...' : service.topApplication }}
                  </RouterLink>
                  <span v-else class="font-mono text-xs text-gray-500">-</span>
                </td>
                <td class="dark:bg-base-200 bg-white">{{ formatNumber(service.rewards) }}</td>
                <td class="dark:bg-base-200 bg-white">
                  <span :class="service.efficiency >= 95 ? 'text-success' : service.efficiency >= 80 ? 'text-warning' : 'text-error'">
                    {{ service.efficiency.toFixed(2) }}%
                  </span>
                </td>
                <td class="dark:bg-base-200 bg-white">{{ formatNumber(service.relays) }}</td>
              </tr>
            </tbody>
          </table>
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

