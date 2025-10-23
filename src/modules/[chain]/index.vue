<script lang="ts" setup>
import MdEditor from 'md-editor-v3';
import PriceMarketChart from '@/components/charts/PriceMarketChart.vue';

import { Icon } from '@iconify/vue';
import {
  useBlockchain,
  useFormatter,
  useTxDialog,
  useWalletStore,
  useStakingStore,
  useParamStore,
  useBaseStore
} from '@/stores';
import { onMounted, ref, watch, nextTick, onBeforeUnmount } from 'vue';
import { useIndexModule, colorMap } from './indexStore';
import { computed } from '@vue/reactivity';

import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';
import ProposalListItem from '@/components/ProposalListItem.vue';
import ArrayObjectElement from '@/components/dynamic/ArrayObjectElement.vue'
import AdBanner from '@/components/ad/AdBanner.vue';
import ApexCharts from 'vue3-apexcharts';
import { PageRequest } from '@/types';

const props = defineProps(['chain']);

const blockchain = useBlockchain();
const store = useIndexModule();
const walletStore = useWalletStore();
const format = useFormatter();
const dialog = useTxDialog();
const stakingStore = useStakingStore();
const paramStore = useParamStore()
const base = useBaseStore()
const coinInfo = computed(() => {
  return store.coinInfo;
});

const transactionStats = ref({
  total: 0,
  history: []
});

// Add computed properties for network status metrics
const currentBlockHeight = computed(() => {
  return base.latest?.block?.header?.height || '0';
});

const latestBlockTime = computed(() => {
  return new Date(base.latest?.block?.header?.time || '0').toLocaleString();
});

const averageBlockTime = computed(() => {
  return (base.blocktime / 1000).toFixed(1);
});

const averageTxPerBlock = computed(() => {
  if (!base.recents || base.recents.length === 0) return '0.0';

  // Calculate this only once via computed property instead of in template
  const totalTxs = base.recents.reduce((sum, block) => sum + (block.block?.data?.txs?.length || 0), 0);
  return (totalTxs / Math.max(1, base.recents.length)).toFixed(1);
});

const activeValidatorsCount = computed(() => {
  return String(base.latest?.block?.last_commit?.signatures.length || 0);
});

// Add loading state tracking
const isNetworkStatusLoading = ref(true);

const txChartOptions = ref({
  chart: {
    type: 'area',
    height: 280,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  colors: ['#A3E635'], // Light green color
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    row: {
      colors: ['transparent'],
      opacity: 0.5
    }
  },
  markers: {
    size: 0
  },
  xaxis: {
    categories: [],
    labels: {
      style: {
        colors: 'rgb(116, 109, 105)'
      },
      formatter: function (value: string) {
        return value;
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: 'rgb(116, 109, 105)'
      },
      formatter: function (value: number) {
        return format.formatNumber(value);
      }
    }
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: function (value: number) {
        return format.formatNumber(value) + ' transactions';
      }
    }
  }
});

const txChartSeries = ref([
  {
    name: 'Transactions',
    data: []
  }
]);

// Add these refs for block list virtualization after the existing refs
const visibleBlocks = ref<{ item: any; index: number }[]>([]);
const visibleTxs = ref<{ item: any; index: number }[]>([]);
const blockTableContainer = ref<HTMLDivElement | null>(null);
const txTableContainer = ref<HTMLDivElement | null>(null);
const itemHeight = 42; // Height of table rows
const bufferSize = 5; // Number of additional items to render
const ticking = ref(false); // For requestAnimationFrame throttling
const blockScrollTimeout = ref<NodeJS.Timeout | null>(null);
const txScrollTimeout = ref<NodeJS.Timeout | null>(null);
const updateNetworkStatsTimeout = ref<NodeJS.Timeout | null>(null);

// Add debounced update function for network stats
function debouncedUpdateNetworkStats() {
  if (updateNetworkStatsTimeout.value) {
    clearTimeout(updateNetworkStatsTimeout.value);
  }

  updateNetworkStatsTimeout.value = setTimeout(() => {
    if (!isNetworkStatusLoading.value) {
      loadNetworkStats();
    }
  }, 500); // 500ms debounce
}

// Add these methods for virtualization before the existing onMounted function
function initVirtualLists() {
  nextTick(() => {
    // Initialize block table virtualization
    if (blockTableContainer.value) {
      updateVisibleBlocks();
      blockTableContainer.value.addEventListener('scroll', handleBlockScroll, { passive: true });
    }

    // Initialize transaction table virtualization
    if (txTableContainer.value) {
      updateVisibleTxs();
      txTableContainer.value.addEventListener('scroll', handleTxScroll, { passive: true });
    }
  });
}

function handleBlockScroll() {
  if (!ticking.value) {
    ticking.value = true;
    requestAnimationFrame(() => {
      updateVisibleBlocks();
      ticking.value = false;
    });
  }
}

function handleTxScroll() {
  if (!ticking.value) {
    ticking.value = true;
    requestAnimationFrame(() => {
      updateVisibleTxs();
      ticking.value = false;
    });
  }
}

function updateVisibleBlocks() {
  if (!blockTableContainer.value || !base.recents?.length) return;

  const container = blockTableContainer.value;
  const scrollTop = container.scrollTop;
  const viewportHeight = container.clientHeight;

  // Calculate which items should be visible
  const startIndex = Math.floor(scrollTop / itemHeight) - bufferSize;
  const endIndex = Math.ceil((scrollTop + viewportHeight) / itemHeight) + bufferSize;

  const start = Math.max(0, startIndex);
  const end = Math.min(base.recents.length, endIndex);

  // Only update if the visible range has changed significantly
  if (visibleBlocks.value.length === 0 ||
    Math.abs(visibleBlocks.value[0]?.index - start) >= 2 ||
    Math.abs(visibleBlocks.value[visibleBlocks.value.length - 1]?.index - (end - 1)) >= 2) {

    visibleBlocks.value = base.recents.slice(start, end).map((item, index) => ({
      item,
      index: start + index
    }));
  }
}

function updateVisibleTxs() {
  if (!txTableContainer.value || !base.allTxs?.length) return;

  const container = txTableContainer.value;
  const scrollTop = container.scrollTop;
  const viewportHeight = container.clientHeight;

  // Calculate which items should be visible
  const startIndex = Math.floor(scrollTop / itemHeight) - bufferSize;
  const endIndex = Math.ceil((scrollTop + viewportHeight) / itemHeight) + bufferSize;

  const start = Math.max(0, startIndex);
  const end = Math.min(base.allTxs.length, endIndex);

  // Only update if the visible range has changed significantly
  if (visibleTxs.value.length === 0 ||
    Math.abs(visibleTxs.value[0]?.index - start) >= 2 ||
    Math.abs(visibleTxs.value[visibleTxs.value.length - 1]?.index - (end - 1)) >= 2) {
    visibleTxs.value = base.allTxs.slice(start, end).map((item, index) => ({
      item,
      index: start + index
    }));
  }
}

onMounted(async () => {
  store.loadDashboard();
  walletStore.loadMyAsset();
  paramStore.handleAbciInfo();
  console.log("current chain", blockchain.current)
  // Set loading state
  isNetworkStatusLoading.value = true;

  // Load transactions first
  await base.getAllTxs(blockchain.current?.transactionService);

  // Then load stats that depend on transaction data
  loadNetworkStats();
  loadTransactionHistory();

  // Mark network status as loaded
  isNetworkStatusLoading.value = false;

  // Initialize virtual scrolling
  initVirtualLists();
});

const ticker = computed(() => store.coinInfo.tickers[store.tickerIndex]);
const tickers = computed(() => store.coinInfo.tickers);
const currName = ref("")
blockchain.$subscribe((m, s) => {
  if (s.chainName !== currName.value) {
    currName.value = s.chainName
    store.loadDashboard();
    walletStore.loadMyAsset();
    paramStore.handleAbciInfo()
  }
});
function shortName(name: string, id: string) {
  return name.toLowerCase().startsWith('ibc/') ||
    name.toLowerCase().startsWith('0x')
    ? id
    : name;
}

const comLinks = [
  {
    name: 'Website',
    icon: 'mdi-web',
    href: store.homepage,
  },
  {
    name: 'Twitter',
    icon: 'mdi-twitter',
    href: store.twitter,
  },
  {
    name: 'Telegram',
    icon: 'mdi-telegram',
    href: store.telegram,
  },
  {
    name: 'Github',
    icon: 'mdi-github',
    href: store.github,
  },
];

// wallet box
const change = computed(() => {
  const token = walletStore.balanceOfStakingToken;
  return token ? format.priceChanges(token.denom) : 0;
});
const color = computed(() => {
  switch (true) {
    case change.value > 0:
      return 'text-green-600';
    case change.value === 0:
      return 'text-grey-500';
    case change.value < 0:
      return 'text-red-600';
  }
});

function updateState() {
  walletStore.loadMyAsset()
}

function trustColor(v: string) {
  return `text-${colorMap(v)}`
}

const quantity = ref(100)
const qty = computed({
  get: () => {
    return parseFloat(quantity.value.toFixed(6))
  },
  set: val => {
    quantity.value = val
  }
})
const amount = computed({
  get: () => {
    return quantity.value * ticker.value.converted_last.usd || 0
  },
  set: val => {
    quantity.value = val / ticker.value.converted_last.usd || 0
  }
})

const networkStats = ref({
  wallets: 0,
  applications: 0,
  suppliers: 0,
  gateways: 0,
  services: 0
});

const historicalData = ref({
  series: [
    {
      name: 'Applications',
      data: []
    },
    {
      name: 'Suppliers',
      data: []
    },
    {
      name: 'Gateways',
      data: []
    },
    {
      name: 'Services',
      data: []
    }
  ]
});

const chartOptions = ref({
  chart: {
    type: 'area',
    height: 280,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  colors: ['#FFB206', '#09279F', '#5E9AE4', '#60BC29'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    row: {
      colors: ['transparent'],
      opacity: 0.5
    }
  },
  markers: {
    size: 0
  },
  xaxis: {
    categories: [],
    type: 'category',
    labels: {
      style: {
        colors: 'rgb(116, 109, 105)'
      },
      formatter: function (value: string) {
        return value;
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: 'rgb(116, 109, 105)'
      }
    }
  },
  legend: {
    show: false,
    position: 'bottom',
    horizontalAlign: 'left',
    labels: {
      colors: 'rgb(116, 109, 105)'
    }
  },
  tooltip: {
    theme: 'dark'
  }
});

// Add a cache expiration tracking
const networkStatsCacheTime = ref(0);
const CACHE_EXPIRATION_MS = 60000; // 1 minute cache

async function loadNetworkStats() {
  // Check cache - only reload if it's expired
  const now = Date.now();
  if (now - networkStatsCacheTime.value < CACHE_EXPIRATION_MS &&
    networkStats.value.wallets > 0) {
    console.log("Using cached network stats");
    return;
  }

  const pageRequest = new PageRequest();
  pageRequest.limit = 1;

  try {
    // Use Promise.all to fetch data in parallel instead of sequentially
    const [applicationsData, suppliersData, gatewaysData, servicesData, accountsData] = await Promise.all([
      blockchain.rpc.getApplications(pageRequest),
      blockchain.rpc.getSuppliers(pageRequest),
      blockchain.rpc.getGateways(pageRequest),
      blockchain.rpc.getServices(pageRequest),
      blockchain.rpc.getAuthAccounts(pageRequest)
    ]);

    networkStats.value.applications = parseInt(applicationsData.pagination?.total || 0);
    networkStats.value.suppliers = parseInt(suppliersData.pagination?.total || 0);
    networkStats.value.gateways = parseInt(gatewaysData.pagination?.total || 0);
    networkStats.value.services = parseInt(servicesData.pagination?.total || 0);
    networkStats.value.wallets = parseInt(accountsData.pagination?.total || '0');

    // Update cache timestamp
    networkStatsCacheTime.value = now;

    generateHistoricalData();
  } catch (error) {
    console.error("Error loading network stats:", error);
  }
}

function generateHistoricalData() {
  // Generate last 7 days
  const days = 7;
  const labels = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Format date as "MMM DD" (e.g., "Jan 15")
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }

  // Set the categories directly in the chartOptions
  chartOptions.value.xaxis.categories = labels as never[];

  // Generate more visible data with larger values
  const appData = [];
  const supplierData = [];
  const gatewayData = [];
  const serviceData = [];

  // Start with current values and work backwards with more significant changes
  let appCount = networkStats.value.applications;
  let supplierCount = networkStats.value.suppliers;
  let gatewayCount = networkStats.value.gateways;
  let serviceCount = networkStats.value.services;

  // Ensure minimum values for visibility
  appCount = Math.max(appCount, 5);
  supplierCount = Math.max(supplierCount, 5);
  gatewayCount = Math.max(gatewayCount, 3);
  serviceCount = Math.max(serviceCount, 4);

  // Create data points
  for (let i = 0; i < days; i++) {
    // For the first day (oldest), start with lower values
    if (i === 0) {
      appData.push(Math.max(1, Math.floor(appCount * 0.6)));
      supplierData.push(Math.max(1, Math.floor(supplierCount * 0.7)));
      gatewayData.push(Math.max(1, Math.floor(gatewayCount * 0.5)));
      serviceData.push(Math.max(1, Math.floor(serviceCount * 0.4)));
    }
    // For middle days, show gradual growth
    else if (i < days - 1) {
      const growthFactor = 0.7 + (i * 0.05);
      appData.push(Math.max(1, Math.floor(appCount * growthFactor)));
      supplierData.push(Math.max(1, Math.floor(supplierCount * growthFactor)));
      gatewayData.push(Math.max(1, Math.floor(gatewayCount * growthFactor)));
      serviceData.push(Math.max(1, Math.floor(serviceCount * growthFactor)));
    }
    // For the last day (today), use current values
    else {
      appData.push(appCount);
      supplierData.push(supplierCount);
      gatewayData.push(gatewayCount);
      serviceData.push(serviceCount);
    }
  }

  // Update the series data
  historicalData.value.series[0].data = appData as never[];
  historicalData.value.series[1].data = supplierData as never[];
  historicalData.value.series[2].data = gatewayData as never[];
  historicalData.value.series[3].data = serviceData as never[];

  // Force chart to update by creating a new object
  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      ...chartOptions.value.xaxis,
      categories: labels as never[],
      labels: {
        ...chartOptions.value.xaxis.labels,
        formatter: function (value: string) {
          return value;
        }
      }
    }
  };
}

async function loadTransactionHistory() {
  try {
    // Fetch historical transaction data using the transactions/count endpoint with chain parameter
    const historyPromise = fetch(`/api/v1/transactions/count?chain=${blockchain.current?.transactionService}`).catch(err => {
      console.error("Error fetching transaction history:", err);
      return null;
    });

    // Process history response
    const historyResponse = await historyPromise;

    if (historyResponse && historyResponse.ok) {
      const historyData = await historyResponse.json();

      if (historyData.data && historyData.data.labels && historyData.data.counts) {
        // Store the total transaction count
        transactionStats.value.total = historyData.data.total || 0;

        // Update chart options with the labels from the API
        txChartOptions.value = {
          ...txChartOptions.value,
          xaxis: {
            ...txChartOptions.value.xaxis,
            categories: historyData.data.labels as never[],
            labels: {
              ...txChartOptions.value.xaxis.labels,
              formatter: function (value: string) {
                return value;
              }
            }
          }
        };

        // Update the series data with the counts from the API
        txChartSeries.value = [{
          name: 'Transactions',
          data: historyData.data.counts as never[]
        }];
      } else {
        console.error("Invalid history data format:", historyData);
        fallbackToClientSideProcessing();
      }
    } else {
      console.warn("Could not fetch transaction history from API, falling back to client-side processing");
      fallbackToClientSideProcessing();
    }
  } catch (error) {
    console.error("Error loading transaction history:", error);
    fallbackToClientSideProcessing();
  }
}

// Fallback method if the API request fails
function fallbackToClientSideProcessing() {
  const txs = base.allTxs || [];
  const days = 30;
  const now = new Date();
  const labels = [];
  const txsByDay = new Map();

  // Generate labels and initialize counts
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Format date as "MMM D" (e.g., "Feb 3")
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    txsByDay.set(dateKey, 0);
  }

  // Update chart options with generated labels
  txChartOptions.value = {
    ...txChartOptions.value,
    xaxis: {
      ...txChartOptions.value.xaxis,
      categories: labels as never[],
      labels: {
        ...txChartOptions.value.xaxis.labels,
        formatter: function (value: string) {
          return value;
        }
      }
    }
  };

  // Count transactions by day
  for (const tx of txs) {
    let txDate;

    if (tx.timestamp) {
      txDate = new Date(tx.timestamp);
    } else if (tx.height) {
      // Try to get timestamp from block
      const cachedBlock = base._blockCache?.get(tx.height);
      if (cachedBlock && cachedBlock.block.header.time) {
        txDate = new Date(cachedBlock.block.header.time);
      } else {
        const block = base.recents.find(b => b.block.header.height === tx.height);
        if (block && block.block.header.time) {
          txDate = new Date(block.block.header.time);
        }
      }
    }

    if (txDate) {
      const dateKey = txDate.toISOString().split('T')[0];
      if (txsByDay.has(dateKey)) {
        txsByDay.set(dateKey, txsByDay.get(dateKey) + 1);
      }
    }
  }

  // Convert to array for chart
  const txData = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    txData.push(txsByDay.get(dateKey) || 0);
  }

  // Update chart series
  txChartSeries.value = [{
    name: 'Transactions',
    data: txData as never[]
  }];
}

// Also add a watcher to reload transaction history when allTxs changes
watch(() => base.allTxs, (newTxs) => {
  if (newTxs && newTxs.length > 0) {
    console.log(`Transaction data updated, reloading chart with ${newTxs.length} transactions`);
    loadTransactionHistory();
  }
}, { deep: true });

// Add this to clean up event listeners
onBeforeUnmount(() => {
  if (blockTableContainer.value) {
    blockTableContainer.value.removeEventListener('scroll', handleBlockScroll);
  }

  if (txTableContainer.value) {
    txTableContainer.value.removeEventListener('scroll', handleTxScroll);
  }

  if (blockScrollTimeout.value) {
    clearTimeout(blockScrollTimeout.value);
  }

  if (txScrollTimeout.value) {
    clearTimeout(txScrollTimeout.value);
  }

  if (updateNetworkStatsTimeout.value) {
    clearTimeout(updateNetworkStatsTimeout.value);
  }
});

// Add watchers to update virtual lists when data changes
watch(() => base.recents.length, () => {
  updateVisibleBlocks();
});

watch(() => base.allTxs.length, () => {
  updateVisibleTxs();
});

// Add watchers for network status data to trigger updates when dependencies change
watch(() => base.latest?.block?.header?.height, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    debouncedUpdateNetworkStats();
  }
});

watch(() => base.blocktime, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    // Update computed property will automatically update
    console.log("Block time changed, updating network stats");
  }
});

</script>

<template>
  <div class="">
      <div class="bg-base-100 dark:bg-[#00125b] pt-2">
        <!-- Laptop View -->
        <div class="desktop-home flex flex-1 gap-8">
          <div class="w-[45%] py-2">
          <div class="text-lg font-semibold text-main">Network Status</div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 my-2">
            <div
              class="flex flex-col dark:bg-base-100 bg-base-200 px-2 py-4 rounded-xl hover:bg-base-300 items-center justify-center">
              <div class="flex items-center mb-5">
                <Icon icon="mdi:cube-scan" class="text-sm text-[#64748B] mr-1" />
                <span class="text-xs text-secondary">Current Block Height</span>
              </div>
              <div class="text-xl text-main flex items-center justify-center font-medium"> {{ currentBlockHeight }} <a
                  :href="`/${chain}/blocks/${currentBlockHeight}`"
                  class="ml-2 text-xl inline-block text-[#64748B] hover:text-info/70">
                  <Icon icon="mdi:arrow-right-circle" class="text-sm" />
                </a>
              </div>
            </div>
            <div class="flex flex-col dark:bg-base-100 bg-base-200 w-full py-4 px-2 rounded-xl hover:bg-base-300 items-center justify-center">
              <div class="flex mb-5 items-center">
                <Icon icon="mdi:server-network" class="text-sm text-[#64748B] mr-1" />
                <span class="text-xs text-secondary">Consensus Nodes</span>
              </div>
              <div class="text-xl text-main flex items-center justify-center font-medium"> {{paramStore.nodeVersion?.items?.length || '0' }}
              </div>
            </div>
            <div class="flex flex-col dark:bg-base-100 bg-base-200 w-full py-4 rounded-xl hover:bg-base-300 items-center justify-center">
              <div class="flex mb-5 items-center">
                <Icon icon="mdi:timer-outline" class="text-sm text-[#64748B] mr-1" />
                <span class="text-xs text-secondary">Avg Block Time (24h)</span>
              </div>
              <div class="text-xl text-main flex items-center justify-center font-medium"> {{ averageBlockTime }}s
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <div
              class="flex flex-col dark:bg-base-100 bg-base-200 rounded-xl py-4 px-2 hover:bg-base-300 items-center justify-center w-2/3">
              <div class="flex mb-5 items-center">
                <Icon icon="mdi:clock-outline" class="text-sm text-[#64748B] mr-1" />
                <div class="text-xs text-secondary">Latest Block Time</div>
              </div>
              <div class="text-xl text-main flex items-center justify-center font-medium">
                {{ latestBlockTime }}
              </div>
            </div>
            <div
              class="flex flex-col dark:bg-base-100 bg-base-200 rounded-xl py-4 hover:bg-base-300 items-center justify-center w-1/3">
              <div class="flex mb-5 items-center">
                <Icon icon="mdi:chart-box-outline" class="text-sm text-[#64748B] mr-1" />
                <div class="text-xs text-secondary">Avg TX Per Block (24h)</div>
              </div>
              <div class="text-xl text-main flex items-center justify-center font-medium"> {{ averageTxPerBlock }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-[65%] p-2" style="z-index: 1;">
          <div class="text-lg font-semibold text-main">Market Data</div>
          <div class="flex gap-2">
            <div class="w-[90%]">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2 my-2">
                <div
                  class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 items-center justify-center w-full">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:swap-horizontal" class="text-sm mr-1 text-[#64748B]" />
                    <span class="text-xs text-secondary">24h Volume</span>
                  </div>
                  <div class="text-xl text-main flex items-center justify-center font-medium"> ${{format.formatNumber((store.coinInfo?.market_data?.total_volume?.usd || 0), '123,456,789.[00]') }}
                  </div>
                </div>
                <div
                  class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 justify-center items-center w-full">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:chart-pie" class="text-sm mr-1 text-[#64748B]" />
                    <span class="text-xs text-secondary">Market Cap</span>
                  </div>
                  <div class="text-xl text-main flex items-center justify-center font-medium">
                    ${{ format.formatNumber(store.coinInfo?.market_data?.market_cap?.usd || 0, '123,456,789.[00]') }}
                  </div>
                </div>
                <div
                  class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-1 rounded-xl hover:bg-base-300 items-center justify-center w-full">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:coins" class="text-sm mr-1 text-[#64748B]" />
                    <span class="text-[10px] text-secondary">Circulating Supply</span>
                    <span class="text-[10px] text-secondary ml-1">({{ store.coinInfo?.symbol?.toUpperCase() || '' }})</span>
                  </div>
                  <div class="text-xl text-main flex items-center justify-center font-medium"> {{format.formatNumber((store.coinInfo?.market_data?.circulating_supply || 0), '123,456,789.[]') }}
                    <!-- <span class="text-sm font-medium"></span> -->
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div
                  class="flex flex-col dark:bg-base-100 bg-base-200 py-4 rounded-xl hover:bg-base-300 items-center justify-center">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:trophy" class="text-sm mr-1 text-[#64748B]" />
                    <span class="text-xs text-secondary">24h High / Low</span>
                  </div>
                  <div class="text-xs font-medium mt-1 flex gap-1">
                    <span class="text-xs text-[#60BC29]">${{ store.coinInfo?.market_data?.high_24h?.usd?.toFixed(6) || '0.00' }}</span>
                    /
                    <span class="text-xs text-[#EE6161]">${{ store.coinInfo?.market_data?.low_24h?.usd?.toFixed(6) || '0.00'}}</span>
                  </div>
                </div>
                <div
                  class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-1 rounded-xl hover:bg-base-300 items-center justify-center">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:trending-up" class=" text-sm mr-1 text-[#64748B]" />
                    <span class="text-xs text-secondary">All Time High</span>
                    <span class="text-xs ml-2"
                      :class="{ 'text-[#EE6161]': (store.coinInfo?.market_data?.ath_change_percentage?.usd || 0) < 0, 'text-[#60BC29]': (store.coinInfo?.market_data?.ath_change_percentage?.usd || 0) > 0 }">
                      ({{store.coinInfo?.market_data?.ath_change_percentage?.usd?.toFixed(2) || '0.00' }}%)
                    </span>
                  </div>
                  <div class="text-xl text-main flex items-center justify-center font-medium">
                    ${{ store.coinInfo?.market_data?.ath?.usd?.toFixed(6) || '0.00' }}
                  </div>
                </div>
                <div
                  class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-1 rounded-xl hover:bg-base-300 items-center justify-center">
                  <div class="flex mb-5 items-center justify-evenly">
                    <Icon icon="mdi:trending-down" class="text-sm mr-1 text-[#64748B]" />
                    <span class="text-xs text-secondary">All Time Low</span>
                    <span class="text-xs ml-2"
                      :class="{ 'text-[#EE6161]': (store.coinInfo?.market_data?.atl_change_percentage?.usd || 0) < 0, 'text-[#60BC29]': (store.coinInfo?.market_data?.atl_change_percentage?.usd || 0) > 0 }">
                      ({{store.coinInfo?.market_data?.atl_change_percentage?.usd?.toFixed(2) || '0.00' }}%)
                    </span>
                  </div>
                  <div class="text-xl text-main flex items-center justify-center font-medium">
                    ${{ store.coinInfo?.market_data?.atl?.usd?.toFixed(6) || '0.00' }}
                  </div>
                </div>
              </div>
            </div>
            <div
              class="dark:bg-base-100 bg-base-200 p-4 mt-2 rounded-[20px] hover:bg-base-300 grid grid-cols-1 md:grid-cols-1 w-[25%] items-center justify-between">
              <!-- Logo -->
              <img v-if="useBaseStore().theme === 'dark'" src="https://pocket.network/wp-content/uploads/2025/01/logo-white.png" alt="Coin logo" class="w-2/3 justify-self-center" />
              <img v-else src="https://pocket.network/wp-content/uploads/2024/12/logo.png" alt="Coin logo" class="w-2/3 justify-self-center" />

              <!-- Price -->
              <div class="flex flex-col item-center mx-auto">
                <div class="text-xl text-center">
                  ${{ store.coinInfo?.market_data?.current_price?.usd?.toFixed(6) || '0.00' }}
                </div>
                <div class="text-sm text-end"
                  :class="(store.coinInfo?.market_data?.price_change_percentage_24h || 0) > 0 ? 'text-[#60BC29]' : 'text-[#EE6161]'">
                  {{ (store.coinInfo?.market_data?.price_change_percentage_24h || 0) > 0 ? '+' : '' }} {{store.coinInfo?.market_data?.price_change_percentage_24h?.toFixed(2) || '0.00' }}%
                </div>
              </div>

              <!-- Dropdown -->
              <!-- <div class="dropdown dropdown-end w-full border border-[#64748B] rounded-[5px]">
                <label tabindex="0" class="btn btn-sm btn-outline w-full justify-between">
                  {{ ticker?.market?.name || 'Market' }}
                  <Icon icon="mdi:chevron-down" class="ml-1" />
                </label>
                <div tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1"  style="height: 300px; overflow-y: scroll;">
                <ul tabindex="0" class="">
                  <li v-for="(tic, index) in tickers" :key="tic.market.identifier">
                    <a @click="() => { store.selectTicker(index); }" :class="{ 'active': index === store.tickerIndex }">
                      {{ tic.market.name }}
                    </a>
                  </li>
                </ul>
                </div>
              </div> -->

              <!-- Buy Button -->
              <a class="!text-white btn btn-sm w-full !bg-[#09279F] !border-[#09279F]"
                :class="{ '!btn-[#60BC29]': store.trustColor === 'green', '!btn-warning': store.trustColor === 'yellow' }"
                :href="ticker?.trade_url" target="_blank">
                {{ $t('index.buy') }} {{ store.coinInfo?.symbol?.toUpperCase() || 'COIN'}}
              </a>
            </div>
          </div>
        </div>
        </div>  

      </div>  
      <div class="flex mt-4 mb-2 w-full flex-col lg:flex-row gap-4 bg-base-100 dark:bg-[#00125b]">  
        <!-- Mobile / Tablet view -->
        <div class="mobile-home">
          <!-- Network Status -->
          <div class="p-2 w-full lg:w-2/3">
            <div class="text-lg font-semibold text-main">Network Status</div>
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 my-2">
                <!-- Current Block Height -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 items-center justify-center">
                  <div class="flex items-center mb-5">
                    <Icon icon="mdi:cube-scan" class="text-sm max-[1024px]:text-[8px] max-[1024px]:font-bold text-[#64748B] mr-1" />
                    <span class="text-[10px] max-[1024px]:text-[8px] max-[1024px]:font-bold text-secondary">Current Block Height</span>
                  </div>
                  <div class="text-xl max-[1024px]:text-xs text-main flex items-center justify-center font-medium">
                    {{ currentBlockHeight }}
                    <a :href="`/${chain}/blocks/${currentBlockHeight}`" class="ml-2 text-xl max-[1024px]:text-xs inline-block text-[#64748B] hover:text-info/70">
                      <Icon icon="mdi:arrow-right-circle" class="text-sm max-[1024px]:text-xs" />
                    </a>
                  </div>
                </div>

                <!-- Consensus Nodes -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 w-full py-4 px-2 rounded-xl hover:bg-base-300 items-center justify-center">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:server-network" class="text-sm max-[1024px]:text-[8px] max-[1024px]:font-bold text-[#64748B] mr-1" />
                    <span class="text-[10px] max-[1024px]:text-[8px] max-[1024px]:font-bold text-secondary">Consensus Nodes</span>
                  </div>
                  <div class="text-xl max-[1024px]:text-xs text-main flex items-center justify-center font-medium">
                    {{ paramStore.nodeVersion?.items?.length || '0' }}
                  </div>
                </div>

                <!-- Avg Block Time (24) -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 w-full py-4 rounded-xl hover:bg-base-300 items-center justify-center">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:timer-outline" class="text-sm max-[1024px]:text-[8px] max-[1024px]:font-bold text-[#64748B] mr-1" />
                    <span class="text-[10px] max-[1024px]:text-[8px] max-[1024px]:font-bold text-secondary">Avg Block Time (24h)</span>
                  </div>
                  <div class="text-xl max-[1024px]:text-xs text-main flex items-center justify-center font-medium">
                    {{ averageBlockTime }}s
                  </div>
                </div>
              </div>

              <div class="flex gap-2 flex-col md:flex-row">

                <!-- Latest Block Time -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 rounded-xl py-4 px-2 hover:bg-base-300 items-center justify-center w-full md:w-2/3">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:clock-outline" class="text-sm max-[1024px]:text-[8px] max-[1024px]:font-bold text-[#64748B] mr-1" />
                    <div class="text-[10px] max-[1024px]:text-[8px] max-[1024px]:font-bold text-secondary">Latest Block Time</div>
                  </div>
                  <div class="text-xl max-[1024px]:text-xs text-main flex items-center justify-center font-medium">
                    {{ latestBlockTime }}
                  </div>
                </div>

                <!-- Avg TX Per Block (24h) -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 rounded-xl py-4 hover:bg-base-300 items-center justify-center w-full md:w-1/3">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:chart-box-outline" class="text-sm max-[1024px]:text-[8px] max-[1024px]:font-bold text-[#64748B] mr-1" />
                    <div class="text-[10px] max-[1024px]:text-[8px] max-[1024px]:font-bold text-secondary">Avg TX Per Block (24h)</div>
                  </div>
                  <div class="text-xl max-[1024px]:text-xs text-main flex items-center justify-center font-medium">
                    {{ averageTxPerBlock }}
                  </div>
                </div>
            </div>
          </div>
        </div>

        <!-- Mobile / Tablet view -->
        <div class="mobile-home">
          <!-- Market Data -->
          <div class="p-2 w-full lg:w-1/3">
            <div class="text-lg font-semibold text-main">Market Data</div>
            <div class="flex flex-col lg:flex-row gap-2">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 my-2 w-full">
                <!-- 24h Volume -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 items-center justify-center w-full">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:swap-horizontal" class="text-sm mr-1 text-[#64748B]" />
                    <span class="text-[10px] text-secondary">24h Volume</span>
                  </div>
                  <div class="text-xl text-main flex items-center justify-center font-medium">
                    ${{ format.formatNumber((store.coinInfo?.market_data?.total_volume?.usd || 0), '123,456,789.[00]') }}
                  </div>
                </div>

                <!-- Market Cap -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 items-center justify-center w-full">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:chart-pie" class="text-sm mr-1 text-[#64748B]" />
                    <span class="text-[10px] text-secondary">Market Cap</span>
                  </div>
                  <div class="text-xl text-main flex items-center justify-center font-medium">
                    ${{ format.formatNumber(store.coinInfo?.market_data?.market_cap?.usd || 0, '123,456,789.[00]') }}
                  </div>
                </div>

                <!-- Circulating Supply -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 items-center justify-center w-full">
                  <div class="flex mb-5 items-center gap-1">
                    <Icon icon="mdi:coins" class="text-sm mr-1 text-[#64748B]" />
                    <span class="text-[10px] text-secondary">Circulating Supply</span>
                    <span class="text-[10px] text-secondary">({{ store.coinInfo?.symbol?.toUpperCase() || '' }})</span>
                  </div>
                  <div class="text-xl text-main flex flex-col items-center font-medium">
                    {{ format.formatNumber((store.coinInfo?.market_data?.circulating_supply || 0), '123,456,789.[]') }}
                  </div>
                </div>

                <!-- 24h High/Low -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 rounded-xl hover:bg-base-300 items-center justify-center w-full">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:trophy" class="text-sm mr-1 text-[#64748B]" />
                    <span class="text-[10px] text-secondary">24h High / Low</span>
                  </div>
                  <div class="text-xs font-medium mt-1 flex gap-1">
                    <span class="text-xs text-[#60BC29]">${{ store.coinInfo?.market_data?.high_24h?.usd?.toFixed(6) ||'0.00' }}</span> /
                    <span class="text-xs text-[#EE6161]">${{ store.coinInfo?.market_data?.low_24h?.usd?.toFixed(6) || '0.00' }}</span>
                  </div>
                </div>

                <!-- All Time High -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-1 rounded-xl hover:bg-base-300 items-center justify-center w-full">
                  <div class="flex mb-5 items-center">
                    <Icon icon="mdi:trending-up" class=" text-sm mr-1 text-[#64748B]" />
                    <span class="text-[10px] text-secondary">All Time High</span>
                    <span class="text-xs ml-2"
                      :class="{ 'text-[#EE6161]': (store.coinInfo?.market_data?.ath_change_percentage?.usd || 0) < 0, 'text-[#60BC29]': (store.coinInfo?.market_data?.ath_change_percentage?.usd || 0) > 0 }">
                      ({{ store.coinInfo?.market_data?.ath_change_percentage?.usd?.toFixed(2) || '0.00' }}%)
                    </span>
                  </div>
                  <div class="text-xl text-main flex items-center justify-center font-medium">
                    ${{ store.coinInfo?.market_data?.ath?.usd?.toFixed(6) || '0.00' }}
                  </div>
                </div>

                <!-- All Time Low -->
                <div class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-1 rounded-xl hover:bg-base-300 items-center justify-center w-full">
                  <div class="flex mb-5 items-center justify-evenly">
                    <Icon icon="mdi:trending-down" class="text-sm mr-1 text-[#64748B]" />
                    <span class="text-[10px] text-secondary">All Time Low</span>
                    <span class="text-xs ml-2"
                      :class="{ 'text-[#EE6161]': (store.coinInfo?.market_data?.atl_change_percentage?.usd || 0) < 0, 'text-[#60BC29]': (store.coinInfo?.market_data?.atl_change_percentage?.usd || 0) > 0 }">
                      ({{ store.coinInfo?.market_data?.atl_change_percentage?.usd?.toFixed(2) || '0.00' }}%)
                    </span>
                  </div>
                  <div class="text-xl text-main flex items-center justify-center font-medium">
                    ${{ store.coinInfo?.market_data?.atl?.usd?.toFixed(6) || '0.00' }}
                  </div>
                </div>

                <!-- Logo + Price + Buy Button -->
                <div class="flex flex-col items-center gap-2 mt-3 dark:bg-base-100 bg-base-200 p-3 rounded-xl">
                  <img v-if="useBaseStore().theme === 'dark'"
                      src="https://pocket.network/wp-content/uploads/2025/01/logo-white.png"
                      alt="Coin logo" class="w-24" />
                  <img v-else
                      src="https://pocket.network/wp-content/uploads/2024/12/logo.png"
                      alt="Coin logo" class="w-24" />

                  <div class="text-sm text-center">
                    ${{ store.coinInfo?.market_data?.current_price?.usd?.toFixed(6) || '0.00' }}
                  </div>
                  <div class="text-xs"
                      :class="(store.coinInfo?.market_data?.price_change_percentage_24h || 0) > 0 ? 'text-[#60BC29]' : 'text-[#EE6161]'">
                    {{ (store.coinInfo?.market_data?.price_change_percentage_24h || 0) > 0 ? '+' : '' }}
                    {{ store.coinInfo?.market_data?.price_change_percentage_24h?.toFixed(2) || '0.00' }}%
                  </div>

                  <a class="!text-white btn btn-sm w-full !bg-[#09279F] !border-[#09279F]"
                    :href="ticker?.trade_url" target="_blank">
                    {{ $t('index.buy') }} {{ store.coinInfo?.symbol?.toUpperCase() || 'COIN' }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Network Statistics Section -->

    <!-- Network Statistics -->
    <div class="bg-base-100 dark:bg-[#00125b;] px-4 pt-3 pb-4 mt-2">
      <div class="flex items-center mb-4">
        <div class="text-lg font-semibold text-main">Network Statistics</div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        <!-- Total Wallets -->
        <div
          class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center w-full">
          <div class="flex mb-5 items-center">
            <Icon icon="mdi:wallet" class="text-sm mr-1 text-secondary" />
            <span class="text-xs text-secondary">Total Wallets</span>
          </div>
          <div class="text-xl text-main flex items-center justify-center font-medium"> {{ networkStats.wallets.toLocaleString() }}
          </div>
        </div>

        <!-- Applications -->
        <div
          class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center w-full">
          <div class="flex mb-5 items-center">
            <Icon icon="mdi:apps" class="text-sm mr-1 text-secondary" />
            <span class="text-xs text-secondary">Applications</span>
          </div>
          <div class="text-xl text-main flex items-center justify-center font-medium">
            {{ networkStats.applications.toLocaleString() }}
          </div>
        </div>

        <!-- Suppliers -->
        <div
          class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center w-full">
          <div class="flex mb-5 items-center">
            <Icon icon="mdi:package-variant" class="text-sm mr-1 text-secondary" />
            <span class="text-xs text-secondary">Suppliers</span>
          </div>
          <div class="text-xl text-main flex items-center justify-center font-medium">
            {{ networkStats.suppliers.toLocaleString() }}
          </div>
        </div>

        <!-- Gateways -->
        <div
          class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center w-full">
          <div class="flex mb-5 items-center">
            <Icon icon="mdi:gate" class="text-sm mr-1 text-secondary" />
            <span class="text-xs text-secondary">Gateways</span>
          </div>
          <div class="text-xl text-main flex items-center justify-center font-medium">
            {{ networkStats.gateways.toLocaleString() }}
          </div>
        </div>

        <!-- Services -->
        <div
          class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center w-full">
          <div class="flex mb-5 items-center">
            <Icon icon="mdi:handshake" class="text-sm mr-1 text-secondary" />
            <span class="text-xs text-secondary">Services</span>
          </div>
          <div class="text-xl text-main flex items-center justify-center font-medium">
            {{ networkStats.services.toLocaleString() }}
          </div>
        </div>


        <!-- Active Validators -->
        <div
          class="flex flex-col dark:bg-base-100 bg-base-200 py-4 px-2 rounded-xl hover:bg-base-300 transition-all duration-200 items-center justify-center w-full">
          <div class="flex mb-5 items-center">
            <Icon icon="mdi:shield-check" class="text-sm mr-1 text-secondary" />
            <span class="text-xs text-secondary">Active Validators</span>
          </div>
          <div class="text-xl text-main flex items-center justify-center font-medium">
            {{ activeValidatorsCount }}
          </div>
        </div>

      </div>
    </div>

    <!-- Governance Section - Active Proposals -->
    <div v-if="blockchain.supportModule('governance')"
      class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-accent">
      <div class="flex items-center mb-4">
        <Icon icon="mdi:gavel" class="text-2xl text-accent mr-2" />
        <div class="text-lg font-semibold text-main">Active Proposals</div>
      </div>

      <div class="pb-4">
        <ProposalListItem :proposals="store?.proposals" />
      </div>
      <div class="py-8 text-center" v-if="store.proposals?.proposals?.length === 0">
        <Icon icon="mdi:vote-outline" class="text-4xl text-accent/40 mb-2" />
        <div class="text-secondary">No active proposals at this time</div>
      </div>
    </div>


    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
      <!-- Network Growth Chart -->
      <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100">
        <div class="flex items-center mb-4">
          <div class="text-lg font-semibold text-main ml-5">Network Growth (7 Days)</div>
        </div>
        <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md">
          <div class="h-80">
            <ApexCharts type="area" height="280" :options="chartOptions" :series="historicalData.series" />
          </div>
        </div>
      </div>

      <!-- Transaction History Chart -->
      <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100">
        <div class="flex items-center mb-4">
          <!-- <Icon icon="mdi:chart-timeline-variant" class="text-2xl text-warning mr-2" /> -->
          <div class="text-lg font-semibold text-main ml-5">Transaction History</div>
        </div>
        <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md">
          <div class="h-80">
            <ApexCharts type="area" height="280" :options="txChartOptions" :series="txChartSeries" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tables Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
      <!-- Blocks Table -->
      <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg mb-5 border-[3px] border-solid border-base-200 dark:border-base-100">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <!-- <Icon icon="mdi:cube-outline" class="text-2xl text-info mr-2" /> -->
            <div class="text-lg font-semibold text-main ml-5">Latest Blocks</div>
          </div>
          <RouterLink :to="`/${chain}/blocks`"
            class="hover:text-info/70 text-sm flex items-center transition-colors duration-200 mr-5">
            View All
            <Icon icon="mdi:arrow-right" class="ml-1" />
          </RouterLink>
        </div>

        <div class="bg-base-200 rounded-md overflow-auto" style="max-height: 30rem;" ref="blockTableContainer">
          <div class="flex justify-center items-center py-8" v-if="base.fetchingBlocks">
            <div class="loading loading-spinner loading-lg text-info"></div>
          </div>
          <table class="table table-compact w-full bg-base-100" v-else>
            <thead class="bg-base-300 sticky top-0">
              <tr class="border-none">
                <th class="dark:bg-base-200 bg-base-100">{{ $t('block.block_header') }}</th>
                <th class="dark:bg-base-200 bg-base-100">{{ $t('account.hash') }}</th>
                <th class="dark:bg-base-200 bg-base-100">{{ $t('block.proposer') }}</th>
                <th class="dark:bg-base-200 bg-base-100">{{ $t('module.tx') }}</th>
                <th class="dark:bg-base-200 bg-base-100">{{ $t('account.time') }}</th>
              </tr>
            </thead>
            <tbody>
              <!-- Add spacer at the top to push visible content -->
              <tr v-if="visibleBlocks.length > 0" class="h-0 m-0 p-0 border-none">
                <td :style="{ height: `${visibleBlocks[0].index * itemHeight}px`, padding: 0 }" colspan="5"></td>
              </tr>

              <!-- Render only visible blocks -->
              <tr v-for="item in visibleBlocks" :key="item.index"
                class="dark:bg-base-200 bg-base-100 hover:dark:bg-base-100 hover:bg-base-300 transition-colors duration-200 border-none">
                <td class="font-medium">{{ item.item.block.header.height }}</td>
                <td class="truncate text-[#153cd8] dark:text-warning" style="max-width: 18rem; overflow:hidden;">
                  <RouterLink class="truncate hover:underline" :title="item.item.block_id.hash"
                    :to="`/${chain}/blocks/${item.item.block.header.height}`">{{ item.item.block_id.hash }}
                  </RouterLink>
                </td>
                <td>{{ format.validator(item.item.block?.header?.proposer_address) }}</td>
                <td>{{ item.item.block?.data?.txs.length }}</td>
                <td>{{ format.toDay(item.item.block?.header?.time, 'from') }}</td>
              </tr>

              <!-- Add spacer at the bottom to maintain scroll height -->
              <tr v-if="visibleBlocks.length > 0 && base.recents.length > 0" class="h-0 m-0 p-0 border-none">
                <td
                  :style="{ height: `${Math.max(0, base.recents.length - (visibleBlocks[visibleBlocks.length - 1].index + 1)) * itemHeight}px`, padding: 0 }"
                  colspan="5"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg mb-5 border-[3px] border-solid border-base-200 dark:border-base-100">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <!-- <Icon icon="mdi:file-document-outline" class="text-2xl text-black mr-2" /> -->
            <div class="text-lg font-semibold text-main ml-5">{{ $t('module.rtx') }}</div>
          </div>
          <RouterLink :to="`/${chain}/tx`"
            class="hover:text-warning/70 text-sm flex items-center transition-colors duration-200 mr-5">
            View All
            <Icon icon="mdi:arrow-right" class="ml-1" />
          </RouterLink>
        </div>

        <div class="bg-base-200 rounded-md overflow-auto" style="max-height: 30rem;" ref="txTableContainer">
          <table class="table table-compact w-full bg-base-100">
            <thead class="bg-base-300 sticky top-0">
              <tr class="border-none">
                <th class="dark:bg-base-200 bg-base-100">{{ $t('tx.tx_hash') }}</th>
                <th class="dark:bg-base-200 bg-base-100">{{ $t('block.block') }}</th>
                <th class="dark:bg-base-200 bg-base-100">{{ $t('staking.status') }}</th>
                <th class="dark:bg-base-200 bg-base-100">{{ $t('account.type') }}</th>
                <th class="dark:bg-base-200 bg-base-100">{{ $t('block.fees') }}</th>
                <th class="dark:bg-base-200 bg-base-100">{{ $t('account.time') }}</th>
              </tr>
            </thead>
            <tbody>
              <!-- Add spacer at the top to push visible content -->
              <tr v-if="visibleTxs.length > 0" class="h-0 m-0 p-0 border-none">
                <td :style="{ height: `${visibleTxs[0].index * itemHeight}px`, padding: 0 }" colspan="6"></td>
              </tr>

              <!-- Render only visible transactions -->
              <tr v-for="item in visibleTxs" :key="item.index"
                class="dark:bg-base-200 bg-base-100 hover:dark:bg-base-100 hover:bg-base-300 transition-colors duration-200 border-none">
                <td class="truncate text-[#153cd8]" style="max-width:14rem">
                  <RouterLink class="truncate hover:underline" :to="`/${props.chain}/tx/${item.item.hash}`">{{ item.item.hash }}</RouterLink>
                </td>
                <td class="text-sm text-[#153cd8]">
                  <RouterLink :to="`/${props.chain}/blocks/${item.item.block_height}`" class="hover:underline">{{ item.item.block_height }}</RouterLink>
                </td>
                <td>
                  <span class="text-xs truncate py-1 px-3 rounded-full"
                    :class="item.item.status || item.item.tx_response.code === 0 ? 'bg-[#60BC29]/10 text-[#60BC29]' : 'bg-[#E03834]/10 text-[#E03834]'">
                    {{ item.item.status || item.item.tx_response.code === 0 ? 'Success' : 'Failed' }}
                  </span>
                </td>
                <td>{{ item.item.type }}</td>
                <td>{{ format.formatTokens([{ amount: item.item.fee, denom: 'upokt' }]) }} </td>
                <td>{{ format.toDay(item.item.timestamp, 'from') }}</td>
              </tr>

              <!-- Add spacer at the bottom to maintain scroll height -->
              <tr v-if="visibleTxs.length > 0 && base.allTxs.length > 0" class="h-0 m-0 p-0 border-none">
                <td
                  :style="{ height: `${Math.max(0, base.allTxs.length - (visibleTxs[visibleTxs.length - 1].index + 1)) * itemHeight}px`, padding: 0 }"
                  colspan="6"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Node Information Section - Only shown if coingeckoId is not available -->
    <div v-if="!store.coingeckoId"
      class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-accent mt-5">
      <div class="flex items-center mb-4">
        <Icon icon="mdi:server" class="text-2xl text-accent mr-2" />
        <div class="text-lg font-semibold text-main">Node Information</div>
      </div>
      <div class="bg-base-200 rounded-md p-4">
        <ArrayObjectElement :value="paramStore.nodeVersion?.items" :thead="false" />
      </div>
    </div>
  </div>
</template>

<route>
  {
    meta: {
      i18n: 'dashboard',
      order: 1,
    }
  }
</route>

<style scoped>

.desktop-home {
  display: none;
}

.mobile-home {
  display: block;
}

/* Media query for desktop */
@media (min-width: 1024px) {
  .desktop-home {
    display: flex;
  }

  .mobile-home {
    display: none;
  }
}

/* Styles for virtualized tables */
.table tr.h-0 {
  display: table-row;
  line-height: 0;
  height: 0;
}

.table tr.h-0 td {
  padding: 0;
  border: none;
}

/* Optimize table rendering */
.table tbody tr {
  contain: layout style;
}

/* Fix for better scrolling performance */
.bg-base-200 {
  will-change: transform;
  transform: translateZ(0);
}
</style>
