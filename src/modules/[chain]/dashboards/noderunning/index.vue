<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import ApexCharts from 'vue3-apexcharts';

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

async function loadSummaryStats() {
  try {
    const params = new URLSearchParams();
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
  loadRewardAnalytics();
  loadProofSubmissions();
}

function nextPage() { if (currentPage.value < totalPages.value) { currentPage.value++; loadProofSubmissions(); } }
function prevPage() { if (currentPage.value > 1) { currentPage.value--; loadProofSubmissions(); } }
function goToFirst() { currentPage.value = 1; loadProofSubmissions(); }
function goToLast() { currentPage.value = totalPages.value; loadProofSubmissions(); }
function formatNumber(num: number | string): string { return new Intl.NumberFormat().format(typeof num === 'string' ? parseInt(num) : num); }
function formatUpokt(upokt: number | string): string { 
  const value = typeof upokt === 'string' ? parseInt(upokt) : upokt;
  return (value / 1000000).toFixed(4);
}

onMounted(() => {
  loadSummaryStats();
  loadRewardAnalytics();
  loadProofSubmissions();
});
</script>

<template>
  <div>
    <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-2 my-4 font-bold text-[#ffffff]">
      {{ $t('module.noderunning') }} 
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5" v-if="rewardAnalytics.length > 0">
      <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100">
        <div class="flex items-center mb-4"><div class="text-lg font-semibold text-main ml-5">Hourly Rewards</div></div>
        <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md"><div class="h-80"><ApexCharts type="area" height="280" :options="rewardsChartOptions" :series="rewardsChartSeries" /></div></div>
      </div>
      <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100">
        <div class="flex items-center mb-4"><div class="text-lg font-semibold text-main ml-5">Compute Unit Efficiency</div></div>
        <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md"><div class="h-80"><ApexCharts type="line" height="280" :options="efficiencyChartOptions" :series="efficiencyChartSeries" /></div></div>
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

