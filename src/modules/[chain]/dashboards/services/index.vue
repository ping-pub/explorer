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
      {{ $t('module.services') }} Dashboard
    </p>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-5" v-if="summaryStats">
      <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center">
        <div class="flex mb-2 items-center">
          <Icon icon="mdi:file-document-multiple" class="text-sm mr-1 text-secondary" />
          <span class="text-xs text-secondary">Submissions</span>
        </div>
        <div class="text-xl text-main flex items-center justify-center font-medium">{{ formatNumber(parseInt(summaryStats.total_submissions)) }}</div>
      </div>
      <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center">
        <div class="flex mb-2 items-center">
          <Icon icon="mdi:package-variant" class="text-sm mr-1 text-secondary" />
          <span class="text-xs text-secondary">Suppliers</span>
        </div>
        <div class="text-xl text-main flex items-center justify-center font-medium">{{ formatNumber(parseInt(summaryStats.unique_suppliers)) }}</div>
      </div>
      <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center">
        <div class="flex mb-2 items-center">
          <Icon icon="mdi:apps" class="text-sm mr-1 text-secondary" />
          <span class="text-xs text-secondary">Applications</span>
        </div>
        <div class="text-xl text-main flex items-center justify-center font-medium">{{ formatNumber(parseInt(summaryStats.unique_applications)) }}</div>
      </div>
      <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center">
        <div class="flex mb-2 items-center">
          <Icon icon="mdi:handshake" class="text-sm mr-1 text-secondary" />
          <span class="text-xs text-secondary">Services</span>
        </div>
        <div class="text-xl text-main flex items-center justify-center font-medium">{{ formatNumber(parseInt(summaryStats.unique_services)) }}</div>
      </div>
      <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center">
        <div class="flex mb-2 items-center">
          <Icon icon="mdi:currency-usd" class="text-sm mr-1 text-secondary" />
          <span class="text-xs text-secondary">Total Rewards</span>
        </div>
        <div class="text-xl text-main flex items-center justify-center font-medium">{{ formatUpokt(summaryStats.total_rewards_upokt) }}</div>
        <div class="text-xs text-secondary mt-1">POKT</div>
      </div>
      <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center">
        <div class="flex mb-2 items-center">
          <Icon icon="mdi:network" class="text-sm mr-1 text-secondary" />
          <span class="text-xs text-secondary">Total Relays</span>
        </div>
        <div class="text-xl text-main flex items-center justify-center font-medium">{{ formatNumber(parseInt(summaryStats.total_relays)) }}</div>
      </div>
    </div>

    <div v-if="summaryStats" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
        <div class="flex items-center mb-2">
          <div class="w-10 h-10 dark:bg-base-200 bg-[#5E9AE4] rounded-lg flex items-center justify-center mr-3">
            <Icon icon="mdi:percent" class="text-2xl text-white" />
          </div>
          <div class="text-sm text-secondary">Avg Efficiency</div>
        </div>
        <div class="text-2xl font-bold">{{ parseFloat(summaryStats.avg_efficiency_percent).toFixed(2) }}%</div>
      </div>
      <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
        <div class="flex items-center mb-2">
          <div class="w-10 h-10 dark:bg-base-200 bg-[#60BC29] rounded-lg flex items-center justify-center mr-3">
            <Icon icon="mdi:coin" class="text-2xl text-white" />
          </div>
          <div class="text-sm text-secondary">Avg Reward/Relay</div>
        </div>
        <div class="text-2xl font-bold">{{ (parseFloat(summaryStats.avg_reward_per_relay) / 1000000).toFixed(6) }}</div>
        <div class="text-xs text-secondary">POKT</div>
      </div>
      <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
        <div class="flex items-center mb-2">
          <div class="w-10 h-10 dark:bg-base-200 bg-[#FFB206] rounded-lg flex items-center justify-center mr-3">
            <Icon icon="mdi:cpu-64-bit" class="text-2xl text-white" />
          </div>
          <div class="text-sm text-secondary">Claimed Compute Units</div>
        </div>
        <div class="text-2xl font-bold">{{ formatNumber(parseInt(summaryStats.total_claimed_compute_units)) }}</div>
      </div>
      <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
        <div class="flex items-center mb-2">
          <div class="w-10 h-10 dark:bg-base-200 bg-[#09279F] rounded-lg flex items-center justify-center mr-3">
            <Icon icon="mdi:calendar-start" class="text-2xl text-white" />
          </div>
          <div class="text-sm text-secondary">First Submission</div>
        </div>
        <div class="text-sm font-bold">{{ new Date(summaryStats.first_submission).toLocaleDateString() }}</div>
      </div>
    </div>

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

    <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-5" v-if="rewardAnalytics.length > 0">
      <div class="flex items-center mb-4"><div class="text-lg font-semibold text-main ml-5">Hourly Relays</div></div>
      <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md"><div class="h-80"><ApexCharts type="column" height="280" :options="relaysChartOptions" :series="relaysChartSeries" /></div></div>
    </div>

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
                <td class="dark:bg-base-200 bg-white">{{ formatUpokt(submission.claimed_upokt_amount) }}</td>
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

