<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import ApexCharts from 'vue3-apexcharts';
import { useBlockchain, useFormatter } from '@/stores';

const props = defineProps<{
  chain?: string;
  filters?: {
    supplier_address?: string;
    owner_address?: string;
  };
  showTabs?: boolean;
  tabView?: 'summary' | 'chain' | 'performance' | 'reward-share';
}>();

const chainStore = useBlockchain();
const format = useFormatter();

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
  const supplierFilter = props.filters?.supplier_address;
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
async function fetchApi(url: string, params: URLSearchParams, body?: any): Promise<any> {
  if (shouldUsePost(params) || body) {
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
    if (body) Object.assign(postBody, body);
    
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

const topServicesByComputeUnits = ref<TopServiceByComputeUnits[]>([]);
const topServicesByPerformance = ref<TopServiceByPerformance[]>([]);
const totalComputeUnits = ref(0);
const loadingTopServices = ref(false);
const loadingPerformanceTable = ref(false);
const topServicesLimit = ref(10);
const topServicesDays = ref(30);
const performanceDays = ref(30);

// Reward Share tab data
const delegatedRewards = ref<Array<{ account: string; rewards: number; share: number; nodes: number }>>([]);
const rewardsByAddresses = ref<Array<{ date: string; rewards: number }>>([]);
const rewardsDistribution = ref({ custodian: 0, delegator: 0, operator: 0, total: 0 });
const loadingRewardShare = ref(false);
const rewardShareSearchQuery = ref('');
const rewardShareDateRange = ref({ start: '', end: '' });
const showFees = ref(false);

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

const topServicesChartSeries = ref([{ name: 'Compute Units', data: [] as number[] }]);
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
    dataLabels: { enabled: chartType === 'bar', formatter: (v: number) => (v / 1000000000).toFixed(2) + 'B', style: { colors: ['#000'] } },
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
    yaxis: { labels: { style: { colors: 'rgb(116, 109, 105)' }, formatter: (v: number) => (v / 1000000000).toFixed(2) + 'B' } },
    tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toLocaleString() + ' compute units' } }
  };
});

const rewardShareChartSeries = computed(() => {
  return topServicesByPerformance.value.map(service => service.percentage_of_total);
});

const rewardShareChartOptions = computed(() => ({
  chart: { type: 'donut', height: 350, toolbar: { show: false } },
  labels: topServicesByPerformance.value.map(service => service.service_id),
  colors: ['#A3E635', '#5E9AE4', '#FFB206', '#60BC29', '#09279F', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
  dataLabels: { enabled: true, formatter: (val: number) => val.toFixed(1) + '%' },
  legend: { position: 'right', labels: { colors: 'rgb(116, 109, 105)' } },
  tooltip: { theme: 'dark', y: { formatter: (val: number) => val.toFixed(2) + '%' } },
  plotOptions: { pie: { donut: { size: '70%' } } }
}));

const rewardsDistributionChartSeries = computed(() => {
  const dist = rewardsDistribution.value;
  return [dist.custodian, dist.delegator, dist.operator];
});

const rewardsDistributionChartOptions = computed(() => {
  const dist = rewardsDistribution.value;
  const custodianPercent = dist.total > 0 ? (dist.custodian / dist.total * 100).toFixed(0) : '0';
  const delegatorPercent = dist.total > 0 ? (dist.delegator / dist.total * 100).toFixed(0) : '0';
  const operatorPercent = dist.total > 0 ? (dist.operator / dist.total * 100).toFixed(0) : '0';
  
  return {
    chart: { type: 'donut', height: 300, toolbar: { show: false } },
    labels: [`${custodianPercent}% Custodian Rewards`, `${delegatorPercent}% Delegator Rewards`, `${operatorPercent}% Operator Rewards`],
    colors: ['#4ECDC4', '#9B59B6', '#E74C3C'],
    dataLabels: { enabled: true, formatter: (val: number) => val.toFixed(1) + '%' },
    legend: { position: 'right', labels: { colors: 'rgb(116, 109, 105)' } },
    tooltip: { theme: 'dark', y: { formatter: (val: number) => val.toFixed(2) + ' POKT' } },
    plotOptions: { 
      pie: { 
        donut: { 
          size: '70%',
          labels: {
            show: true,
            name: { show: true },
            value: { show: true, formatter: (val: number) => val.toFixed(2) + ' POKT' },
            total: { 
              show: true, 
              label: 'Total',
              formatter: () => dist.total.toFixed(2) + ' POKT'
            }
          }
        } 
      } 
    }
  };
});

const rewardsByAddressesChartSeries = computed(() => {
  return [{ name: 'Rewards (POKT)', data: rewardsByAddresses.value.map(d => d.rewards) }];
});

const rewardsByAddressesChartType = ref<'bar' | 'area' | 'line'>('bar');

const rewardsByAddressesChartOptions = computed(() => {
  const dates = rewardsByAddresses.value.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  });
  const values = rewardsByAddresses.value.map(d => d.rewards);
  const maxValue = Math.max(...values, 0);
  const avgHigh = values.length > 0 ? Math.max(...values) : 0;
  const avgLow = values.length > 0 ? Math.min(...values.filter(v => v > 0)) : 0;
  const chartType = rewardsByAddressesChartType.value;

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
    chart: { type: chartType, height: 250, toolbar: { show: false } },
    colors: ['#4ECDC4'],
    dataLabels: { enabled: false },
    plotOptions: chartType === 'bar' ? { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } } : {},
    stroke: strokeConfig,
    fill: fillConfig,
    grid: { borderColor: 'rgba(255, 255, 255, 0.1)' },
    markers: chartType === 'bar' ? { size: 0 } : chartType === 'line' ? {
      size: 4,
      strokeWidth: 0,
      hover: { size: 6 }
    } : { size: 2, hover: { size: 5 } },
    xaxis: { 
      categories: dates,
      labels: { style: { colors: 'rgb(116, 109, 105)' } }
    },
    yaxis: { 
      labels: { 
        style: { colors: 'rgb(116, 109, 105)' },
        formatter: (v: number) => v.toFixed(0)
      },
      title: { text: 'Total Rewards (POKT)', style: { color: 'rgb(116, 109, 105)' } }
    },
    tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toFixed(2) + ' POKT' } },
    annotations: {
      yaxis: [
        {
          y: avgHigh,
          borderColor: '#A3E635',
          borderWidth: 2,
          borderDashArray: 5,
          label: {
            text: `HIGH AVG: ${avgHigh.toFixed(0)}`,
            style: { color: '#A3E635', fontSize: '12px' },
            position: 'right'
          }
        },
        {
          y: avgLow,
          borderColor: '#FF6B6B',
          borderWidth: 2,
          borderDashArray: 5,
          label: {
            text: `LOW AVG: ${avgLow.toFixed(0)}`,
            style: { color: '#FF6B6B', fontSize: '12px' },
            position: 'right'
          }
        }
      ]
    }
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
    // Use filters from props if provided, otherwise use internal selectedSupplier
    const supplierFilter = props.filters?.supplier_address || selectedSupplier.value;
    if (supplierFilter) params.append('supplier_address', supplierFilter);
    if (props.filters?.owner_address) params.append('owner_address', props.filters.owner_address);
    if (selectedApplication.value) params.append('application_address', selectedApplication.value);
    if (startDate.value) params.append('start_date', startDate.value);
    if (endDate.value) params.append('end_date', endDate.value);
    params.append('page', currentPage.value.toString());
    params.append('limit', itemsPerPage.value.toString());
    
    const data = await fetchApi('/api/v1/proof-submissions', params);
      submissions.value = data.data || [];
      totalPages.value = data.meta?.totalPages || 0;
  } catch (error: any) {
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
    // Add filter support
    const supplierFilter = props.filters?.supplier_address;
    if (supplierFilter) params.append('supplier_address', supplierFilter);
    if (props.filters?.owner_address) params.append('owner_address', props.filters.owner_address);
    
    const data = await fetchApi('/api/v1/services/top-by-compute-units', params);
      topServicesByComputeUnits.value = data.data || [];
      updateTopServicesChart();
  } catch (error: any) {
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
    // Add filter support
    const supplierFilter = props.filters?.supplier_address;
    if (supplierFilter) params.append('supplier_address', supplierFilter);
    if (props.filters?.owner_address) params.append('owner_address', props.filters.owner_address);
    
    const data = await fetchApi('/api/v1/services/top-by-performance', params);
      topServicesByPerformance.value = data.data || [];
      totalComputeUnits.value = data.total_compute_units || 0;
  } catch (error: any) {
    console.error('Error loading top services by performance:', error);
    topServicesByPerformance.value = [];
    totalComputeUnits.value = 0;
  } finally {
    loadingPerformanceTable.value = false;
  }
}

async function loadRewardShareData() {
  loadingRewardShare.value = true;
  try {
    // Set default date range (last 7 days)
    const end = new Date();
    const start = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000);
    if (!rewardShareDateRange.value.start) {
      rewardShareDateRange.value.start = start.toISOString();
      rewardShareDateRange.value.end = end.toISOString();
    }

    // Load reward analytics to aggregate by supplier
    const params = new URLSearchParams();
    params.append('chain', apiChainName.value);
    if (rewardShareDateRange.value.start) params.append('start_date', rewardShareDateRange.value.start);
    if (rewardShareDateRange.value.end) params.append('end_date', rewardShareDateRange.value.end);
    const supplierFilter = props.filters?.supplier_address;
    if (supplierFilter) params.append('supplier_address', supplierFilter);
    if (props.filters?.owner_address) params.append('owner_address', props.filters.owner_address);
    
    const data = await fetchApi('/api/v1/proof-submissions/rewards', params);
    const rewardsData = data.data || [];

    // Aggregate by supplier address for delegated rewards
    const supplierMap = new Map<string, { rewards: number; submissions: number }>();
    const dailyMap = new Map<string, number>();

    rewardsData.forEach((item: any) => {
      // Aggregate by supplier
      const supplier = item.supplier_operator_address;
      if (supplier) {
        const existing = supplierMap.get(supplier) || { rewards: 0, submissions: 0 };
        existing.rewards += item.total_rewards_upokt || 0;
        existing.submissions += item.submission_count || 0;
        supplierMap.set(supplier, existing);
      }

      // Aggregate by day for chart
      const date = new Date(item.hour_bucket).toISOString().split('T')[0];
      const existing = dailyMap.get(date) || 0;
      dailyMap.set(date, existing + (item.total_rewards_upokt || 0));
    });

    // Calculate total rewards
    const totalRewards = Array.from(supplierMap.values()).reduce((sum, item) => sum + item.rewards, 0);

    // Build delegated rewards list
    delegatedRewards.value = Array.from(supplierMap.entries())
      .map(([account, data]) => ({
        account,
        rewards: data.rewards / 1000000, // Convert upokt to POKT
        share: totalRewards > 0 ? (data.rewards / totalRewards) * 100 : 0,
        nodes: 1 // We don't have node count, using 1 as placeholder
      }))
      .sort((a, b) => b.rewards - a.rewards)
      .slice(0, 10);

    // Build daily rewards for chart
    rewardsByAddresses.value = Array.from(dailyMap.entries())
      .map(([date, rewards]) => ({
        date,
        rewards: rewards / 1000000 // Convert upokt to POKT
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate rewards distribution (simplified - using summary stats)
    // In a real scenario, we'd need to differentiate custodian/delegator/operator
    const summaryTotal = parseFloat(summaryStats.value?.total_rewards_upokt || '0') / 1000000;
    rewardsDistribution.value = {
      custodian: summaryTotal * 0.79, // Placeholder percentages
      delegator: summaryTotal * 0.21,
      operator: summaryTotal * 0.00,
      total: summaryTotal
    };
  } catch (error: any) {
    console.error('Error loading reward share data:', error);
    delegatedRewards.value = [];
    rewardsByAddresses.value = [];
  } finally {
    loadingRewardShare.value = false;
  }
}

function updateTopServicesChart() {
  const sorted = [...topServicesByComputeUnits.value].sort((a, b) => 
    parseInt(b.total_claimed_compute_units) - parseInt(a.total_claimed_compute_units)
  );
  const labels = sorted.map(s => s.service_id);
  const data = sorted.map(s => parseInt(s.total_claimed_compute_units));
  
  topServicesChartSeries.value = [{ name: 'Compute Units', data }];
  topServicesChartCategories.value = labels;
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

// Watch for filter changes and reload data
watch(() => props.filters, () => {
  loadSummaryStats();
  loadProofSubmissions();
  loadTopServicesByComputeUnits();
  loadTopServicesByPerformance();
  if (props.tabView === 'reward-share') {
    loadRewardShareData();
  }
}, { deep: true });

watch(() => props.tabView, (newTab) => {
  if (newTab === 'reward-share') {
    loadRewardShareData();
  }
});

onMounted(() => {
  loadSummaryStats();
  loadProofSubmissions();
  loadTopServicesByComputeUnits();
  loadTopServicesByPerformance();
  if (props.tabView === 'reward-share') {
    loadRewardShareData();
  }
});
</script>

<template>
  <div>
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
          <div class="text-lg font-bold">{{ formatComputeUnits(parseInt(summaryStats.total_claimed_compute_units)) }}</div>
        </div>
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-2">
          <div class="text-xs text-secondary mb-1">Total Rewards</div>
          <div class="text-lg font-bold">{{ format.formatToken({ denom: 'upokt', amount: String(summaryStats.total_rewards_upokt) }) }}</div>
        </div>
      </div>
    </div>

    <!-- Middle Section: Rewards Distribution Table (Large) - Show in Summary and Reward Share tabs -->
    <div v-if="!props.tabView || props.tabView === 'summary' || props.tabView === 'reward-share'" class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-3">
      <div class="flex items-center justify-between mb-3 ml-4 mr-4">
        <div class="text-base font-semibold text-main">Rewards Distribution</div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-secondary">Days:</span>
          <select v-model="performanceDays" @change="loadTopServicesByPerformance()" class="select select-bordered select-xs w-full text-xs">
            <option :value="7">7</option>
            <option :value="15">15</option>
            <option :value="30">30</option>
          </select>
        </div>
      </div>
      <div class="dark:bg-base-200 bg-base-100 p-2 rounded-md">
        <div v-if="loadingPerformanceTable" class="flex justify-center items-center py-4">
          <div class="loading loading-spinner loading-sm"></div>
          <span class="ml-2 text-xs">Loading...</span>
        </div>
        <div v-else-if="topServicesByPerformance.length === 0" class="text-center py-4 text-gray-500 text-xs">
          No data found
        </div>
        <div v-else class="overflow-auto">
          <table class="table table-compact w-full text-xs">
            <thead class="bg-white sticky top-0">
              <tr class="border-b-[0px]">
                <th class="py-1">Rank</th>
                <th class="py-1">Service</th>
                <th class="py-1">Compute Units</th>
                <th class="py-1">Market Share</th>
                <th class="py-1">Submissions</th>
                <th class="py-1">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in topServicesByPerformance" :key="service.service_id" class="hover:bg-base-300 transition-colors duration-200 border-b-[0px]">
                <td class="dark:bg-base-200 bg-white font-bold py-1">
                  <span class="badge badge-sm" :class="service.rank === 1 ? 'badge-primary' : service.rank === 2 ? 'badge-secondary' : service.rank === 3 ? 'badge-accent' : 'badge-ghost'">
                    #{{ service.rank }}
                  </span>
                </td>
                <td class="dark:bg-base-200 bg-white py-1">
                  <span class="badge badge-primary badge-xs">{{ service.service_id }}</span>
                </td>
                <td class="dark:bg-base-200 bg-white py-1">{{ formatNumber(service.total_claimed_compute_units) }}</td>
                <td class="dark:bg-base-200 bg-white py-1">
                  <div class="flex items-center gap-1">
                    <div class="flex-1 bg-base-300 rounded-full h-2 overflow-hidden">
                      <div 
                        class="h-full rounded-full transition-all duration-500"
                        :class="service.rank === 1 ? 'bg-primary' : service.rank === 2 ? 'bg-secondary' : service.rank === 3 ? 'bg-accent' : 'bg-info'"
                        :style="{ width: `${service.percentage_of_total}%` }"
                      ></div>
                    </div>
                    <span class="text-xs font-semibold min-w-[40px]">{{ service.percentage_of_total.toFixed(2) }}%</span>
                  </div>
                </td>
                <td class="dark:bg-base-200 bg-white py-1">{{ formatNumber(service.submission_count) }}</td>
                <td class="dark:bg-base-200 bg-white py-1">
                  <span :class="service.avg_efficiency_percent >= 95 ? 'text-success' : service.avg_efficiency_percent >= 80 ? 'text-warning' : 'text-error'">
                    {{ service.avg_efficiency_percent.toFixed(2) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bottom Section: 2 Columns (Merged Servicer/Producer/Performance + Services Chart) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3" v-if="!props.tabView || props.tabView === 'summary'">
      <!-- Left Column: Supplier & Service Performance Summary -->
      <div class="dark:bg-base-100 bg-base-200 rounded-lg p-3">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-semibold">Performance Summary</div>
        </div>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <!-- Supplier Section -->
          <div>
            <div class="text-xs font-semibold mb-2 text-secondary">Supplier</div>
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-secondary">Total Suppliers:</span>
                <span class="font-medium">{{ formatNumber(parseInt(summaryStats?.unique_suppliers || '0')) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-secondary">Rewards 24H:</span>
                <span class="font-medium">{{ format.formatToken({ denom: 'upokt', amount: String(summaryStats?.total_rewards_upokt || '0') }) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-secondary">Submissions 24H:</span>
                <span class="font-medium">{{ formatNumber(parseInt(summaryStats?.total_submissions || '0')) }}</span>
              </div>
            </div>
          </div>
          <!-- Service Section -->
          <div>
            <div class="text-xs font-semibold mb-2 text-secondary">Service</div>
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-secondary">Total Services:</span>
                <span class="font-medium">{{ formatNumber(parseInt(summaryStats?.unique_services || '0')) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-secondary">Total Relays 24H:</span>
                <span class="font-medium">{{ formatNumber(parseInt(summaryStats?.total_relays || '0')) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-secondary">Avg Efficiency:</span>
                <span class="font-medium">{{ parseFloat(summaryStats?.avg_efficiency_percent || '0').toFixed(2) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Services Chart -->
      <div class="dark:bg-base-100 bg-base-200 rounded-lg p-3">
        <div class="text-sm font-semibold mb-2">Services</div>
        <div class="dark:bg-base-200 bg-base-100 p-2 rounded-md relative">
          <div v-if="loadingTopServices" class="flex justify-center items-center h-64">
            <div class="loading loading-spinner loading-sm"></div>
          </div>
          <div v-else-if="topServicesByComputeUnits.length === 0" class="flex justify-center items-center h-64 text-gray-500 text-xs">
            No data
          </div>
          <div v-else class="h-64">
            <ApexCharts 
              :type="topServicesChartType" 
              height="250" 
              :options="topServicesChartOptions" 
              :series="topServicesChartSeries"
              :key="`topServices-${topServicesChartType}`"
            />
          </div>
          <!-- Chart Type Selector - Bottom Right -->
          <div v-if="!loadingTopServices && topServicesByComputeUnits.length > 0" class="absolute bottom-2 right-2 tabs tabs-boxed bg-base-200 dark:bg-base-300">
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

    <!-- Performance Tab: Show Performance Table -->
    <div v-if="props.tabView === 'performance'" class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-3">
      <div class="flex items-center justify-between mb-3 ml-4 mr-4">
        <div class="text-base font-semibold text-main">Top Services Performance</div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-secondary">Days:</span>
          <select v-model="performanceDays" @change="loadTopServicesByPerformance()" class="select select-bordered select-xs w-full text-xs">
            <option :value="7">7</option>
            <option :value="15">15</option>
            <option :value="30">30</option>
          </select>
        </div>
      </div>
      <div class="dark:bg-base-200 bg-base-100 p-2 rounded-md">
        <div v-if="loadingPerformanceTable" class="flex justify-center items-center py-4">
          <div class="loading loading-spinner loading-sm"></div>
          <span class="ml-2 text-xs">Loading...</span>
        </div>
        <div v-else-if="topServicesByPerformance.length === 0" class="text-center py-4 text-gray-500 text-xs">
          No data found
        </div>
        <div v-else class="overflow-auto">
          <table class="table table-compact w-full text-xs">
            <thead class="bg-white sticky top-0">
              <tr class="border-b-[0px]">
                <th class="py-1">Rank</th>
                <th class="py-1">Service</th>
                <th class="py-1">Compute Units</th>
                <th class="py-1">Market Share</th>
                <th class="py-1">Submissions</th>
                <th class="py-1">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in topServicesByPerformance" :key="service.service_id" class="hover:bg-base-300 transition-colors duration-200 border-b-[0px]">
                <td class="dark:bg-base-200 bg-white font-bold py-1">
                  <span class="badge badge-sm" :class="service.rank === 1 ? 'badge-primary' : service.rank === 2 ? 'badge-secondary' : service.rank === 3 ? 'badge-accent' : 'badge-ghost'">
                    #{{ service.rank }}
                  </span>
                </td>
                <td class="dark:bg-base-200 bg-white py-1">
                  <span class="badge badge-primary badge-xs">{{ service.service_id }}</span>
                </td>
                <td class="dark:bg-base-200 bg-white py-1">{{ formatNumber(service.total_claimed_compute_units) }}</td>
                <td class="dark:bg-base-200 bg-white py-1">
                  <div class="flex items-center gap-1">
                    <div class="flex-1 bg-base-300 rounded-full h-2 overflow-hidden">
                      <div 
                        class="h-full rounded-full transition-all duration-500"
                        :class="service.rank === 1 ? 'bg-primary' : service.rank === 2 ? 'bg-secondary' : service.rank === 3 ? 'bg-accent' : 'bg-info'"
                        :style="{ width: `${service.percentage_of_total}%` }"
                      ></div>
                    </div>
                    <span class="text-xs font-semibold min-w-[40px]">{{ service.percentage_of_total.toFixed(2) }}%</span>
                  </div>
                </td>
                <td class="dark:bg-base-200 bg-white py-1">{{ formatNumber(service.submission_count) }}</td>
                <td class="dark:bg-base-200 bg-white py-1">
                  <span :class="service.avg_efficiency_percent >= 95 ? 'text-success' : service.avg_efficiency_percent >= 80 ? 'text-warning' : 'text-error'">
                    {{ service.avg_efficiency_percent.toFixed(2) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Chain Tab: Show Services by Service ID -->
    <div v-if="props.tabView === 'chain'" class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-3">
      <div class="flex items-center justify-between mb-3 ml-4 mr-4">
        <div class="text-base font-semibold text-main">Services</div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-secondary">Limit:</span>
          <select v-model="topServicesLimit" @change="loadTopServicesByComputeUnits()" class="select select-bordered select-xs w-full text-xs">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span class="text-xs text-secondary">Days:</span>
          <select v-model="topServicesDays" @change="loadTopServicesByComputeUnits()" class="select select-bordered select-xs w-full text-xs">
            <option :value="7">7</option>
            <option :value="15">15</option>
            <option :value="30">30</option>
          </select>
        </div>
      </div>
      <div class="dark:bg-base-200 bg-base-100 p-2 rounded-md">
        <div v-if="loadingTopServices" class="flex justify-center items-center py-4">
          <div class="loading loading-spinner loading-sm"></div>
          <span class="ml-2 text-xs">Loading...</span>
        </div>
        <div v-else-if="topServicesByComputeUnits.length === 0" class="text-center py-4 text-gray-500 text-xs">
          No data found
        </div>
        <div v-else class="overflow-auto">
          <table class="table table-compact w-full text-xs">
            <thead class="bg-white sticky top-0">
              <tr class="border-b-[0px]">
                <th class="py-1">Service ID</th>
                <th class="py-1">Compute Units</th>
                <th class="py-1">Submissions</th>
                <th class="py-1">Efficiency</th>
                <th class="py-1">Avg Reward/Relay</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in topServicesByComputeUnits" :key="service.service_id" class="hover:bg-base-300 transition-colors duration-200 border-b-[0px]">
                <td class="dark:bg-base-200 bg-white py-1">
                  <span class="badge badge-primary badge-xs">{{ service.service_id }}</span>
                </td>
                <td class="dark:bg-base-200 bg-white py-1">{{ formatComputeUnits(parseInt(service.total_claimed_compute_units)) }}</td>
                <td class="dark:bg-base-200 bg-white py-1">{{ formatNumber(parseInt(service.submission_count)) }}</td>
                <td class="dark:bg-base-200 bg-white py-1">
                  <span :class="parseFloat(service.avg_efficiency_percent) >= 95 ? 'text-success' : parseFloat(service.avg_efficiency_percent) >= 80 ? 'text-warning' : 'text-error'">
                    {{ parseFloat(service.avg_efficiency_percent).toFixed(2) }}%
                  </span>
                </td>
                <td class="dark:bg-base-200 bg-white py-1">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Reward Share Tab: Complete Layout -->
    <div v-if="props.tabView === 'reward-share'" class="space-y-3">
      <!-- Top Row: Delegated Rewards (Left) + Rewards Distribution (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <!-- Delegated Rewards Panel -->
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-3">
          <div class="flex items-center justify-between mb-3">
            <div class="text-sm font-semibold">Delegated Rewards</div>
            <span class="badge badge-sm badge-outline">24H</span>
          </div>
          <div class="mb-2">
            <input 
              v-model="rewardShareSearchQuery"
              type="text" 
              placeholder="Search by Address" 
              class="input input-bordered input-sm w-full"
            />
          </div>
          <div class="overflow-auto max-h-96">
            <table class="table table-compact w-full text-xs">
              <thead>
                <tr>
                  <th class="py-1">Account</th>
                  <th class="py-1">Rewards (POKT)</th>
                  <th class="py-1">Share %</th>
                  <th class="py-1">Nodes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loadingRewardShare" class="text-center">
                  <td colspan="4" class="py-4">
                    <div class="loading loading-spinner loading-sm"></div>
                  </td>
                </tr>
                <tr v-else-if="delegatedRewards.length === 0" class="text-center">
                  <td colspan="4" class="py-4 text-gray-500">No data</td>
                </tr>
                <tr 
                  v-for="item in delegatedRewards.filter(r => 
                    !rewardShareSearchQuery || r.account.toLowerCase().includes(rewardShareSearchQuery.toLowerCase())
                  )" 
                  :key="item.account"
                  class="hover:bg-base-300"
                >
                  <td class="py-1 font-mono text-xs truncate" style="max-width: 200px">{{ item.account }}</td>
                  <td class="py-1">{{ item.rewards.toFixed(4) }}</td>
                  <td class="py-1">{{ item.share.toFixed(3) }}%</td>
                  <td class="py-1">{{ item.nodes }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Rewards Distribution Panel -->
        <div class="dark:bg-base-100 bg-base-200 rounded-lg p-3">
          <div class="flex items-center justify-between mb-3">
            <div class="text-sm font-semibold">Rewards Distribution</div>
            <div class="flex items-center gap-2">
              <span class="badge badge-sm badge-outline">24H</span>
              <label class="label cursor-pointer gap-1">
                <span class="label-text text-xs">Show Fees</span>
                <input type="checkbox" v-model="showFees" class="toggle toggle-xs" />
              </label>
            </div>
          </div>
          <div class="flex items-center justify-center h-80">
            <div v-if="loadingRewardShare" class="flex flex-col items-center">
              <div class="loading loading-spinner loading-md"></div>
              <span class="mt-2 text-xs">Loading...</span>
            </div>
            <div v-else-if="rewardsDistribution.total === 0" class="text-gray-500 text-xs">
              No data
            </div>
            <div v-else class="w-full">
              <ApexCharts 
                type="donut" 
                height="300" 
                :options="rewardsDistributionChartOptions" 
                :series="rewardsDistributionChartSeries" 
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom: Rewards by Addresses -->
      <div class="dark:bg-base-100 bg-base-200 rounded-lg p-3">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-semibold">Rewards by Addresses</div>
          <div class="flex items-center gap-2">
            <select class="select select-bordered select-xs">
              <option>All selected</option>
            </select>
            <input 
              type="date" 
              v-model="rewardShareDateRange.start"
              @change="loadRewardShareData()"
              class="input input-bordered input-xs"
            />
            <span class="text-xs">to</span>
            <input 
              type="date" 
              v-model="rewardShareDateRange.end"
              @change="loadRewardShareData()"
              class="input input-bordered input-xs"
            />
          </div>
        </div>
        <div class="mb-2">
          <div class="text-lg font-bold">
            Rewards {{ rewardsByAddresses.reduce((sum, d) => sum + d.rewards, 0).toFixed(2) }} POKT
          </div>
        </div>
        <div class="h-64 relative">
          <div v-if="loadingRewardShare" class="flex items-center justify-center h-full">
            <div class="loading loading-spinner loading-md"></div>
          </div>
          <div v-else-if="rewardsByAddresses.length === 0" class="flex items-center justify-center h-full text-gray-500 text-xs">
            No data
          </div>
          <div v-else>
            <ApexCharts 
              :type="rewardsByAddressesChartType" 
              height="250" 
              :options="rewardsByAddressesChartOptions" 
              :series="rewardsByAddressesChartSeries"
              :key="`rewardsByAddresses-${rewardsByAddressesChartType}`"
            />
          </div>
          <!-- Chart Type Selector - Bottom Right -->
          <div v-if="!loadingRewardShare && rewardsByAddresses.length > 0" class="absolute bottom-2 right-2 tabs tabs-boxed bg-base-200 dark:bg-base-300">
            <button
              @click="rewardsByAddressesChartType = 'bar'"
              :class="[
                'tab',
                rewardsByAddressesChartType === 'bar' 
                  ? 'tab-active bg-[#09279F] text-white' 
                  : ''
              ]"
              title="Bar Chart">
              <Icon icon="mdi:chart-bar" class="text-sm" />
            </button>
            <button
              @click="rewardsByAddressesChartType = 'area'"
              :class="[
                'tab',
                rewardsByAddressesChartType === 'area' 
                  ? 'tab-active bg-[#09279F] text-white' 
                  : ''
              ]"
              title="Area Chart">
              <Icon icon="mdi:chart-areaspline" class="text-sm" />
            </button>
            <button
              @click="rewardsByAddressesChartType = 'line'"
              :class="[
                'tab',
                rewardsByAddressesChartType === 'line' 
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

    <!-- Proof Submissions Table (Compact) - Show in Summary tab only -->
    <div v-if="!props.tabView || props.tabView === 'summary'" class="dark:bg-base-100 bg-base-200 pt-2 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100 mb-3">
      <div class="flex items-center justify-between mb-2 ml-3 mr-3">
        <div class="text-sm font-semibold text-main">Proof Submissions</div>
        <div class="flex items-center gap-1">
          <span class="text-xs text-secondary">Show:</span>
          <select v-model="itemsPerPage" @change="loadProofSubmissions()" class="select select-bordered select-xs w-full text-xs">
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
      <div class="dark:bg-base-200 bg-base-100 p-2 rounded-md">
        <div class="overflow-auto max-h-96">
          <table class="table w-full table-compact text-xs">
            <thead class="bg-white sticky top-0">
              <tr class="border-b-[0px]">
                <th class="py-1">Tx Hash</th>
                <th class="py-1">Service</th>
                <th class="py-1">Supplier</th>
                <th class="py-1">Relays</th>
                <th class="py-1">Rewards</th>
                <th class="py-1">Efficiency</th>
                <th class="py-1">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="text-center"><td colspan="7" class="py-4"><div class="flex justify-center items-center"><div class="loading loading-spinner loading-sm"></div><span class="ml-2 text-xs">Loading...</span></div></td></tr>
              <tr v-else-if="submissions.length === 0" class="text-center"><td colspan="7" class="py-4"><div class="text-gray-500 text-xs">No submissions found</div></td></tr>
              <tr v-for="submission in submissions" :key="submission.id" class="hover:bg-base-300 transition-colors duration-200 border-b-[0px]">
                <td class="truncate dark:bg-base-200 bg-white text-[#153cd8] py-1" style="max-width:120px"><a :href="`#tx/${submission.transaction_hash}`" class="hover:underline text-xs">{{ submission.transaction_hash.substring(0, 12) }}...</a></td>
                <td class="dark:bg-base-200 bg-white py-1"><span class="badge badge-primary badge-xs">{{ submission.service_id }}</span></td>
                <td class="truncate dark:bg-base-200 bg-white py-1 text-xs" style="max-width:120px">{{ submission.supplier_operator_address.substring(0, 12) }}...</td>
                <td class="dark:bg-base-200 bg-white py-1 text-xs">{{ formatNumber(parseInt(submission.num_relays)) }}</td>
                <td class="dark:bg-base-200 bg-white py-1 text-xs">{{ format.formatToken({ denom: 'upokt', amount: String(submission.claimed_upokt_amount) }) }}</td>
                <td class="dark:bg-base-200 bg-white py-1"><span :class="parseFloat(submission.compute_unit_efficiency) >= 95 ? 'text-success' : parseFloat(submission.compute_unit_efficiency) >= 80 ? 'text-warning' : 'text-error'" class="text-xs">{{ parseFloat(submission.compute_unit_efficiency).toFixed(2) }}%</span></td>
                <td class="dark:bg-base-200 bg-white py-1 text-xs">{{ new Date(submission.timestamp).toLocaleTimeString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-between items-center gap-2 my-2 px-2 text-xs">
          <span class="text-gray-600">Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, submissions.length) }} of {{ submissions.length }}</span>
          <div class="flex items-center gap-1">
            <button class="btn btn-xs btn-ghost" @click="goToFirst" :disabled="currentPage === 1 || totalPages === 0">First</button>
            <button class="btn btn-xs btn-ghost" @click="prevPage" :disabled="currentPage === 1 || totalPages === 0">&lt;</button>
            <span class="px-1">Page {{ currentPage }}/{{ totalPages }}</span>
            <button class="btn btn-xs btn-ghost" @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">&gt;</button>
            <button class="btn btn-xs btn-ghost" @click="goToLast" :disabled="currentPage === totalPages || totalPages === 0">Last</button>
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


