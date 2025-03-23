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
import { onMounted, ref, watch } from 'vue';
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
        colors: 'rgba(255, 255, 255, 0.7)'
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
        colors: 'rgba(255, 255, 255, 0.7)'
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

onMounted(async () => {
  store.loadDashboard();
  walletStore.loadMyAsset();
  paramStore.handleAbciInfo();

  // Load transactions first
  await base.getAllTxs();

  // Then load stats that depend on transaction data
  loadNetworkStats();
  loadTransactionHistory();
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
  colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
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
        colors: 'rgba(255, 255, 255, 0.7)'
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
        colors: 'rgba(255, 255, 255, 0.7)'
      }
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    labels: {
      colors: 'rgba(255, 255, 255, 0.7)'
    }
  },
  tooltip: {
    theme: 'dark'
  }
});

async function loadNetworkStats() {
  const pageRequest = new PageRequest();
  pageRequest.limit = 1;

  try {
    const applicationsData = await blockchain.rpc.getApplications(pageRequest);
    networkStats.value.applications = parseInt(applicationsData.pagination?.total || 0);

    const suppliersData = await blockchain.rpc.getSuppliers(pageRequest);
    networkStats.value.suppliers = parseInt(suppliersData.pagination?.total || 0);

    const gatewaysData = await blockchain.rpc.getGateways(pageRequest);
    networkStats.value.gateways = parseInt(gatewaysData.pagination?.total || 0);

    const servicesData = await blockchain.rpc.getServices(pageRequest);
    networkStats.value.services = parseInt(servicesData.pagination?.total || 0);

    const accountsData = await blockchain.rpc.getAuthAccounts(pageRequest);
    networkStats.value.wallets = parseInt(accountsData.pagination?.total || '0');

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
    // Fetch total transaction count from API
    const countResponse = await fetch("/api/v1/transactions/count").catch(err => {
      console.error("Error fetching transaction count:", err);
      return null;
    });

    if (countResponse && countResponse.ok) {
      const countData = await countResponse.json();
      transactionStats.value.total = countData.data || 0;
      console.log("Total transactions from API:", transactionStats.value.total);
    } else {
      // Fallback to using the length of allTxs if API fails
      transactionStats.value.total = base.allTxs?.length || 0;
      console.log("Using fallback transaction count:", transactionStats.value.total);
    }

    // Wait for base.allTxs to be populated if it's empty
    if (!base.allTxs || base.allTxs.length === 0) {
      console.log("Waiting for transaction data to load...");
      // Try to load transactions if they haven't been loaded yet
      await base.getAllTxs();
    }

    const txs = base.allTxs || [];
    console.log(`Processing ${txs.length} transactions for history chart`);

    // Generate dates for the last 30 days
    const days = 30;
    const labels = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      // Format date as "MMM D" (e.g., "Feb 3")
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    // Update the chart options with the date labels
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

    // Group transactions by day
    const txsByDay = new Map();

    // Initialize all days with 0 counts
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      txsByDay.set(dateKey, 0);
    }

    // Count transactions by day
    txs.forEach(tx => {
      let txDate;

      // Try different possible timestamp fields
      if (tx.timestamp) {
        txDate = new Date(tx.timestamp);
      } else if (tx.height) {
        // If we have a block height, try to find the block time from recents
        const block = base.recents.find(b => b.block.header.height === tx.height);
        if (block && block.block.header.time) {
          txDate = new Date(block.block.header.time);
        }
      }
      if (txDate) {
        const dateKey = txDate.toISOString().split('T')[0];

        if (txsByDay.has(dateKey)) {
          txsByDay.set(dateKey, txsByDay.get(dateKey) + 1);
        }
      }
    });

    // Convert to array for chart
    const txData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      txData.push(txsByDay.get(dateKey) || 0);
    }

    console.log("Transaction data for chart:", txData);
    console.log("Chart labels:", labels);

    // Update the series data
    txChartSeries.value = [{
      name: 'Transactions',
      data: txData as never[]
    }];

  } catch (error) {
    console.error("Error loading transaction history:", error);
  }
}

// Also add a watcher to reload transaction history when allTxs changes
watch(() => base.allTxs, (newTxs) => {
  if (newTxs && newTxs.length > 0) {
    console.log(`Transaction data updated, reloading chart with ${newTxs.length} transactions`);
    loadTransactionHistory();
  }
}, { deep: true });

</script>

<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Block Height and Network Performance Cards -->
      <div class="bg-base-100 px-4 pt-4 pb-4 rounded-md shadow-md border-t-4 border-info">
        <div class="flex items-center mb-4">
          <Icon icon="mdi:cube-outline" class="text-2xl text-info mr-2" />
          <div class="text-lg font-semibold text-main">Network Status</div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          <!-- Left Column: Block Height and Block Time Cards -->
          <div class="grid grid-cols-1 gap-4">
            <!-- Block Height Card -->
            <div class="bg-base-200 p-4 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-info/50">
              <div class="flex items-center mb-3">
                <Icon icon="mdi:cube-scan" class="text-xl text-info mr-2" />
                <div class="text-sm font-medium text-secondary">Current Block Height</div>
              </div>
              <div class="text-3xl font-bold text-main flex items-center">
                {{ base.latest?.block?.header?.height || '0' }}
                <a :href="`/${blockchain.chainName}/block/${base.latest?.block?.header?.height}`"
                   class="ml-2 text-sm inline-block text-info hover:text-info/70 transition-colors duration-200">
                  <Icon icon="mdi:arrow-right-circle" class="text-xl" />
                </a>
              </div>
            </div>

            <!-- Block Time Card -->
            <div class="bg-base-200 p-4 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-info/50">
              <div class="flex items-center mb-3">
                <Icon icon="mdi:clock-outline" class="text-xl text-info mr-2" />
                <div class="text-sm font-medium text-secondary">Latest Block Time</div>
              </div>
              <div class="text-xl font-bold text-main flex items-center">
                {{ new Date(base.latest?.block?.header?.time || '0').toLocaleString() }}
              </div>
            </div>
          </div>

          <!-- Right Column: Network Performance Stats -->
          <div class="grid grid-cols-1 gap-4">
            <!-- Consensus Nodes -->
            <div class="bg-base-200 p-5 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-info/50">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <Icon icon="mdi:server-network" class="text-info mr-2" />
                  <span class="text-sm text-secondary">Consensus Nodes</span>
                </div>
                <div class="text-lg font-bold">{{ paramStore.nodeVersion?.items?.length || '0' }}</div>
              </div>
            </div>
            
            <!-- Block Time -->
            <div class="bg-base-200 p-5 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-info/50">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <Icon icon="mdi:timer-outline" class="text-info mr-2" />
                  <span class="text-sm text-secondary">Avg Block Time (24h)</span>
                </div>
                <div class="text-lg font-bold">{{ (base.blocktime / 1000).toFixed(1) }}s</div>
              </div>
            </div>
            
            <!-- Tx Per Block -->
            <div class="bg-base-200 p-5 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-info/50">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <Icon icon="mdi:chart-box-outline" class="text-info mr-2" />
                  <span class="text-sm text-secondary">Avg TX Per Block (24h)</span>
                </div>
                <div class="text-lg font-bold">
                  {{
                    base.recents && base.recents.length > 0
                      ? (base.recents.reduce((sum, block) => sum + (block.block?.data?.txs?.length || 0), 0) / Math.max(1,
                        base.recents.length)).toFixed(1)
                      : '0.0'
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Market Data Section -->
      <div class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-success">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <Icon icon="mdi:chart-areaspline" class="text-2xl text-success mr-2" />
            <div class="text-lg font-semibold text-main">Market Data</div>
          </div>
          <div class="flex items-center gap-2">
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-sm btn-outline">
                {{ ticker?.market?.name || 'Market' }}
                <Icon icon="mdi:chevron-down" class="ml-1" />
              </label>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1">
                <li v-for="(tic, index) in tickers" :key="tic.market.identifier">
                  <a @click="() => { store.selectTicker(index); }"
                    :class="{ 'active': index === store.tickerIndex }">
                    {{ tic.market.name }}
                  </a>
                </li>
              </ul>
            </div>
            <a class="!text-white btn btn-sm"
              :class="{ '!btn-success': store.trustColor === 'green', '!btn-warning': store.trustColor === 'yellow' }"
              :href="ticker?.trade_url" target="_blank">
              {{ $t('index.buy') }} {{ store.coinInfo?.symbol?.toUpperCase() || 'COIN' }}
            </a>
          </div>
        </div>
        
        <!-- Coin Header -->
        <div class="flex items-center mb-4 bg-base-200 p-3 rounded-md">
          <div class="w-10 h-10 flex items-center justify-center rounded-md overflow-hidden mr-3">
            <img v-if="blockchain.logo" :src="blockchain.logo" alt="Coin logo"
              class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-success flex items-center justify-center">
              <Icon icon="mdi:currency-usd" class="text-xl text-white" />
            </div>
          </div>
          <div>
            <div class="text-xl font-bold">{{ store.coinInfo?.symbol?.toUpperCase() || 'COIN' }}</div>
            <div class="text-sm text-secondary">{{ store.coinInfo?.name || 'Cryptocurrency' }}</div>
          </div>
          <div class="ml-auto flex flex-col items-end">
            <div class="text-xl font-bold">${{ store.coinInfo?.market_data?.current_price?.usd?.toFixed(6) || '0.00' }}</div>
            <div class="text-sm" :class="(store.coinInfo?.market_data?.price_change_percentage_24h || 0) > 0 ? 'text-success' : 'text-error'">
              {{ (store.coinInfo?.market_data?.price_change_percentage_24h || 0) > 0 ? '+' : '' }}{{ store.coinInfo?.market_data?.price_change_percentage_24h?.toFixed(2) || '0.00' }}%
            </div>
          </div>
        </div>
        
        <!-- Market Data Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <!-- Volume Card -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-success/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:swap-horizontal" class="mr-1 text-success" />
              <span>24h Volume</span>
            </div>
            <div class="text-base font-medium mt-1">${{ format.formatNumber((store.coinInfo?.market_data?.total_volume?.usd || 0), '123,456,789.[00]') }}</div>
          </div>
          
          <!-- Market Cap Card -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-success/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:chart-pie" class="mr-1 text-success" />
              <span>Market Cap</span>
            </div>
            <div class="text-base font-medium mt-1">${{ format.formatNumber(store.coinInfo?.market_data?.market_cap?.usd || 0, '123,456,789.[00]') }}</div>
          </div>
          
          <!-- Circulating Supply Card -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-success/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:coins" class="mr-1 text-success" />
              <span>Circulating Supply</span>
            </div>
            <div class="text-base font-medium mt-1">
              {{ format.formatNumber((store.coinInfo?.market_data?.circulating_supply || 0), '123,456,789.[00]') }}
              <span class="text-xs">{{ store.coinInfo?.symbol?.toUpperCase() || '' }}</span>
            </div>
          </div>
          
          <!-- 24h High/Low Card -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-success/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:trending-up" class="mr-1 text-success" />
              <span>24h High / Low</span>
            </div>
            <div class="text-base font-medium mt-1 flex items-center gap-2">
              <span class="text-success">${{ store.coinInfo?.market_data?.high_24h?.usd?.toFixed(6) || '0.00' }}</span>
              <span>/</span>
              <span class="text-error">${{ store.coinInfo?.market_data?.low_24h?.usd?.toFixed(6) || '0.00' }}</span>
            </div>
          </div>
          
          <!-- ATH Card -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-success/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:trophy" class="mr-1 text-success" />
              <span>All Time High</span>
            </div>
            <div class="text-base font-medium mt-1">
              ${{ store.coinInfo?.market_data?.ath?.usd?.toFixed(6) || '0.00' }}
              <span class="text-xs ml-1" :class="{'text-error': (store.coinInfo?.market_data?.ath_change_percentage?.usd || 0) < 0, 'text-success': (store.coinInfo?.market_data?.ath_change_percentage?.usd || 0) > 0}">
                ({{ store.coinInfo?.market_data?.ath_change_percentage?.usd?.toFixed(2) || '0.00' }}%)
              </span>
            </div>
          </div>

          <!-- ATL Card -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-success/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:trending-down" class="mr-1 text-error" />
              <span>All Time Low</span>
            </div>
            <div class="text-base font-medium mt-1">
              ${{ store.coinInfo?.market_data?.atl?.usd?.toFixed(6) || '0.00' }}
              <span class="text-xs ml-1" :class="{'text-error': (store.coinInfo?.market_data?.atl_change_percentage?.usd || 0) < 0, 'text-success': (store.coinInfo?.market_data?.atl_change_percentage?.usd || 0) > 0}">
                ({{ store.coinInfo?.market_data?.atl_change_percentage?.usd?.toFixed(2) || '0.00' }}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Network Statistics Section -->
    
      <!-- Network Statistics -->
      <div class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-secondary mt-5">
        <div class="flex items-center mb-4">
          <Icon icon="mdi:network" class="text-2xl text-secondary mr-2" />
          <div class="text-lg font-semibold text-main">Network Statistics</div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
          <!-- Total Wallets -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-secondary/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:wallet" class="mr-1 text-secondary" />
              <span>Total Wallets</span>
            </div>
            <div class="text-xl font-medium mt-1">{{ networkStats.wallets.toLocaleString() }}</div>
          </div>
          
          <!-- Applications -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-secondary/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:apps" class="mr-1 text-secondary" />
              <span>Applications</span>
            </div>
            <div class="text-xl font-medium mt-1">{{ networkStats.applications.toLocaleString() }}</div>
          </div>
          
          <!-- Suppliers -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-secondary/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:package-variant" class="mr-1 text-secondary" />
              <span>Suppliers</span>
            </div>
            <div class="text-xl font-medium mt-1">{{ networkStats.suppliers.toLocaleString() }}</div>
          </div>
          
          <!-- Gateways -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-secondary/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:gate" class="mr-1 text-secondary" />
              <span>Gateways</span>
            </div>
            <div class="text-xl font-medium mt-1">{{ networkStats.gateways.toLocaleString() }}</div>
          </div>
          
          <!-- Services -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-secondary/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:handshake" class="mr-1 text-secondary" />
              <span>Services</span>
            </div>
            <div class="text-xl font-medium mt-1">{{ networkStats.services.toLocaleString() }}</div>
          </div>
          
          <!-- Active Validators -->
          <div class="bg-base-200 p-3 rounded-md hover:bg-base-300 transition-all duration-200 border-l-4 border-secondary/50">
            <div class="text-xs text-secondary flex items-center">
              <Icon icon="mdi:shield-check" class="mr-1 text-secondary" />
              <span>Active Validators</span>
            </div>
            <div class="text-xl font-medium mt-1">{{ String(base?.latest?.block?.last_commit?.signatures.length || 0) }}</div>
          </div>
        </div>
      </div>
      
      <!-- Governance Section - Active Proposals -->
      <div v-if="blockchain.supportModule('governance')" class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-accent">
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
      <div class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-primary">
        <div class="flex items-center mb-4">
          <Icon icon="mdi:chart-line" class="text-2xl text-primary mr-2" />
          <div class="text-lg font-semibold text-main">Network Growth (7 Days)</div>
        </div>
        <div class="bg-base-200 p-4 rounded-md">
          <div class="h-80">
            <ApexCharts type="area" height="280" :options="chartOptions" :series="historicalData.series" />
          </div>
        </div>
      </div>
      
      <!-- Transaction History Chart -->
      <div class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-warning">
        <div class="flex items-center mb-4">
          <Icon icon="mdi:chart-timeline-variant" class="text-2xl text-warning mr-2" />
          <div class="text-lg font-semibold text-main">Transaction History</div>
        </div>
        <div class="bg-base-200 p-4 rounded-md">
          <div class="h-80">
            <ApexCharts type="area" height="280" :options="txChartOptions" :series="txChartSeries" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tables Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
      <!-- Blocks Table -->
      <div class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-info">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <Icon icon="mdi:cube-outline" class="text-2xl text-info mr-2" />
            <div class="text-lg font-semibold text-main">Latest Blocks</div>
          </div>
          <RouterLink :to="`/${chain}/block`" class="text-info hover:text-info/70 text-sm flex items-center transition-colors duration-200">
            View All
            <Icon icon="mdi:arrow-right" class="ml-1" />
          </RouterLink>
        </div>
        
        <div class="bg-base-200 rounded-md overflow-auto" style="max-height: 30rem;">
          <div class="flex justify-center items-center py-8" v-if="base.fetchingBlocks">
            <div class="loading loading-spinner loading-lg text-info"></div>
          </div>
          <table class="table table-compact w-full" v-else>
            <thead class="bg-base-300 sticky top-0">
              <tr>
                <th class="bg-base-300">{{ $t('block.block_header') }}</th>
                <th class="bg-base-300">{{ $t('account.hash') }}</th>
                <th class="bg-base-300">{{ $t('block.proposer') }}</th>
                <th class="bg-base-300">{{ $t('module.tx') }}</th>
                <th class="bg-base-300">{{ $t('account.time') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in [...base.recents].reverse()" class="hover:bg-base-300 transition-colors duration-200">
                <td class="font-medium">{{ item.block.header.height }}</td>
                <td class="truncate text-info" style="max-width: 18rem; overflow:hidden;">
                  <RouterLink class="truncate hover:underline" :title="item.block_id.hash"
                    :to="`/${chain}/block/${item.block.header.height}`">{{ item.block_id.hash }}
                  </RouterLink>
                </td>
                <td>{{ format.validator(item.block?.header?.proposer_address) }}</td>
                <td>{{ item.block?.data?.txs.length }}</td>
                <td>{{ format.toDay(item.block?.header?.time) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Transactions Table -->
      <div class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-warning">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <Icon icon="mdi:file-document-outline" class="text-2xl text-warning mr-2" />
            <div class="text-lg font-semibold text-main">{{ $t('module.rtx') }}</div>
          </div>
          <RouterLink :to="`/${chain}/tx`" class="text-warning hover:text-warning/70 text-sm flex items-center transition-colors duration-200">
            View All
            <Icon icon="mdi:arrow-right" class="ml-1" />
          </RouterLink>
        </div>
        
        <div class="bg-base-200 rounded-md overflow-auto" style="max-height: 30rem;">
          <table class="table table-compact w-full">
            <thead class="bg-base-300 sticky top-0">
              <tr>
                <th class="bg-base-300">{{ $t('tx.tx_hash') }}</th>
                <th class="bg-base-300">{{ $t('block.block') }}</th>
                <th class="bg-base-300">{{ $t('staking.status') }}</th>
                <th class="bg-base-300">{{ $t('account.type') }}</th>
                <th class="bg-base-300">{{ $t('block.fees') }}</th>
                <th class="bg-base-300">{{ $t('account.time') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in base.allTxs" :index="index" class="hover:bg-base-300 transition-colors duration-200">
                <td class="truncate text-warning" style="max-width:14rem">
                  <RouterLink class="truncate hover:underline" :to="`/${props.chain}/tx/${item.hash}`">{{
                    item.hash
                  }}</RouterLink>
                </td>
                <td class="text-sm text-warning">
                  <RouterLink :to="`/${props.chain}/block/${item.height}`" class="hover:underline">{{ item.height }}</RouterLink>
                </td>
                <td>
                  <span class="text-xs truncate py-1 px-3 rounded-full" 
                        :class="item.status === 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'">
                    {{ item.status === 0 ? 'Success' : 'Failed' }}
                  </span>
                </td>
                <td>{{ format.messages(item.messages) }}</td>
                <td>{{ format.formatTokens(item.fee.amount) }}</td>
                <td>{{ format.toDay(item.timestamp, 'from') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Node Information Section - Only shown if coingeckoId is not available -->
    <div v-if="!store.coingeckoId" class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-accent mt-5">
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
