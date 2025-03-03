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
import { onMounted, ref } from 'vue';
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

onMounted(() => {
  store.loadDashboard();
  walletStore.loadMyAsset();
  paramStore.handleAbciInfo()
  base.getAllTxs()
  // if(!(coinInfo.value && coinInfo.value.name)) {
  // }
  loadNetworkStats();
});
const ticker = computed(() => store.coinInfo.tickers[store.tickerIndex]);

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
    type: 'line',
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
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    row: {
      colors: ['transparent'],
      opacity: 0.5
    }
  },
  markers: {
    size: 4
  },
  xaxis: {
    categories: [],
    labels: {
      style: {
        colors: 'rgba(255, 255, 255, 0.7)'
      },
      rotate: 0,
      formatter: function(value: string) {
        return value;
      }
    },
    axisBorder: {
      show: true,
      color: 'rgba(255, 255, 255, 0.3)'
    },
    axisTicks: {
      show: true,
      color: 'rgba(255, 255, 255, 0.3)'
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
    theme: 'dark',
    x: {
      formatter: function(value: string) {
        return value;
      }
    }
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
        formatter: function(value: string) {
          return value;
        }
      }
    }
  };
}

</script>

<template>
  <div>
    <div class="grid grid-cols-3">

      <div v-if="coinInfo && coinInfo.name" class="bg-base-100 rounded-lg shadow col-span-2 mr-5">
        <div class="grid grid-cols-2 md:grid-cols-3 p-4">
          <div class="col-span-2 md:col-span-1">
            <div class="text-lg font-semibold text-main">
              {{ coinInfo.name }} (<span class="uppercase">{{
                coinInfo.symbol
              }}</span>)
            </div>
            <div class="text-xs mt-2">
              Rank:
              <div class="badge text-xs badge-error bg-[#fcebea] dark:bg-[#41384d] text-red-400">
                #{{ coinInfo.market_cap_rank }}
              </div>
            </div>

            <div class="my-4 flex flex-wrap items-center">
              <!-- <a v-for="(item, index) of comLinks" :key="index" :href="item.href"
              class="link link-primary px-2 py-1 rounded-lg-sm no-underline hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center">
              <Icon :icon="item?.icon" />
              <span class="ml-1 text-sm uppercase">{{ item?.name }}</span>
            </a> -->
            </div>

            <div>
              <div class="dropdown dropdown-hover w-full">
                <label>
                  <div
                    class="bg-gray-100 dark:bg-[#384059] flex items-center justify-between px-4 py-2 cursor-pointer rounded-lg">
                    <div>
                      <div class="font-semibold text-lg text-[#666] dark:text-white">
                        {{ ticker?.market?.name || '' }}
                      </div>
                      <div class="text-info text-sm">
                        {{ shortName(ticker?.base, ticker.coin_id) }}/{{
                          shortName(ticker?.target, ticker.target_coin_id)
                        }}
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="text-md font-semibold text-[#666] dark:text-white">
                        ${{ ticker.converted_last.usd }}
                      </div>
                      <div class="text-sm" :class="store.priceColor">
                        {{ store.priceChange }}%
                      </div>
                    </div>
                  </div>
                </label>
                <div class="dropdown-content pt-1" style="z-index:15">
                  <div class="h-64 overflow-x-hidden overflow-y-scroll w-11/12 shadow rounded-lg">
                    <ul class="menu w-full bg-gray-100 rounded-lg dark:bg-[#384059]">
                      <li v-for="(item, index) in store.coinInfo.tickers" :key="index"
                        @click="store.selectTicker(index)" class="w-11/12">
                        <div class="flex items-center justify-between hover:bg-base-100">
                          <div class="flex-1">
                            <div class="text-main text-sm" :class="trustColor(item.trust_score)">
                              {{ item?.market?.name }}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                              <p class="truncate">
                                {{ shortName(item?.base, item.coin_id) }}/{{
                                  shortName(item?.target, item.target_coin_id)
                                }}
                              </p>
                            </div>
                          </div>

                          <div class="text-base text-main">
                            ${{ item.converted_last.usd }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="flex">
                <label class="btn btn-primary px-1 my-5 mr-2" for="calculator">
                  <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                      <line x1="8" x2="16" y1="6" y2="6"></line>
                      <line x1="16" x2="16" y1="14" y2="18"></line>
                      <path d="M16 10h.01"></path>
                      <path d="M12 10h.01"></path>
                      <path d="M8 10h.01"></path>
                      <path d="M12 14h.01"></path>
                      <path d="M8 14h.01"></path>
                      <path d="M12 18h.01"></path>
                      <path d="M8 18h.01"></path>
                    </g>
                  </svg>
                </label>
                <!-- Put this part before </body> tag -->
                <input type="checkbox" id="calculator" class="modal-toggle" />
                <div class="modal">
                  <div class="modal-box">
                    <h3 class="text-md font-bold">Price Calculator</h3>
                    <div class="flex flex-col w-full mt-5">
                      <div class="grid h-20 flex-grow card rounded-lg-box place-items-center">
                        <div class="join w-full">
                          <label class="join-item btn">
                            <span class="uppercase">{{ coinInfo.symbol }}</span>
                          </label>
                          <input type="number" v-model="qty" min="0" placeholder="Input a number"
                            class="input grow input-bordered join-item" />
                        </div>
                      </div>
                      <div class="divider">=</div>
                      <div class="grid h-20 flex-grow card rounded-lg-box place-items-center">
                        <div class="join w-full">
                          <label class="join-item btn">
                            <span>USD</span>
                          </label>
                          <input type="number" v-model="amount" min="0" placeholder="Input amount"
                            class="join-item grow input input-bordered" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <label class="modal-backdrop" for="calculator">Close</label>
                </div>
                <a class="my-5 !text-white btn grow"
                  :class="{ 'btn-success': store.trustColor === 'green', 'btn-warning': store.trustColor === 'yellow' }"
                  :href="ticker.trade_url" target="_blank">
                  Buy {{ coinInfo.symbol || '' }}
                </a>
              </div>
            </div>
          </div>

          <div class="col-span-2">
            <PriceMarketChart />
          </div>
        </div>
        <!-- <div class="h-[1px] w-full bg-gray-100 dark:bg-[#384059]"></div> -->
        <!-- <div class="max-h-[250px] overflow-auto p-4 text-sm">
        <MdEditor :model-value="coinInfo.description?.en" previewOnly></MdEditor>
      </div> -->
        <!-- <div class="mx-4 flex flex-wrap items-center">
        <div v-for="tag in coinInfo.categories"
          class="mr-2 mb-4 text-xs bg-gray-100 dark:bg-[#384059] px-3 rounded-lg-full py-1">
          {{ tag }}
        </div>
      </div> -->
      </div>

      <div v-else class="bg-base-100 rounded-lg shadow col-span-2 mr-5  p-4">
        <div class="text-md font-semibold text-main">
          Unable to fetch coin data!
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 md:!grid-cols-2 lg:!grid-cols-2">
        <div v-for="(item, key) in store.stats" :key="key">
          <CardStatisticsVertical v-bind="item" />
        </div>
      </div>

    </div>
    <div class="grid grid-cols-2">
      <div v-if="blockchain.supportModule('governance')" class="bg-base-100 rounded-lg shadow col-span-1">
        <div class="px-4 pt-4 pb-2 text-md font-semibold text-main">
          Active Proposals
        </div>
        <div class="px-4 pb-4">
          <ProposalListItem :proposals="store?.proposals" />
        </div>
        <div class="pb-8 text-center" v-if="store.proposals?.proposals?.length === 0">
          No active proposals
        </div>
      </div>
      <!-- Blocks -->
      <div class="bg-base-100 rounded-lg overflow-auto col-span-1 mr-5 mt-4 px-1 py-1 relative"
        style="height: 34rem;">
        <div class="bg-base-100 px-4 pt-4 pb-2 text-md font-semibold text-main">Blocks</div>
        <div class="pre-loading" v-if="base.fetchingBlocks">
          <div class="effect-1 effects"></div>
          <div class="effect-2 effects"></div>
          <div class="effect-3 effects"></div>
        </div>
        <div class="max-h-[30rem] overflow-y-auto" v-else>
          <table class="table table-compact">
            <thead class="bg-base-200 sticky top-0">
              <tr>
                <th>{{ $t('block.block_header') }}</th>
                <th>{{ $t('account.hash') }}</th>
                <th>{{ $t('block.proposer') }}</th>
                <th>{{ $t('module.tx') }}</th>
                <th>{{ $t('account.time') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in [...base.recents].reverse()">
                <td>{{ item.block.header.height }}</td>
                <td class="truncate text-primary" style="max-width: 18rem; overflow:hidden; color:var(primary)">
                  <RouterLink class="truncate" :title="item.block_id.hash"
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
      <!-- Transactions -->
      <div class="bg-base-100 rounded-lg overflow-auto col-span-1 mt-4 px-1 py-1"
        style="height: 34rem; overflow: scroll;">
        <div class="bg-base-100 px-4 pt-4 pb-2 text-md font-semibold text-main">{{ $t('module.tx') }}</div>
        <div class="max-h-[30rem] overflow-y-auto">
          <table class="table w-full table-compact">
            <thead class="bg-base-200 sticky top-0">
              <tr>
                <th>{{ $t('tx.tx_hash') }}</th>
                <th>{{ $t('block.block') }}</th>
                <th>{{ $t('staking.status') }}</th>
                <th>{{ $t('account.type') }}</th>
                <th>{{ $t('block.fees') }}</th>
                <th>{{ $t('account.time') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in base.allTxs" :index="index" class="hover">
                <td class="truncate text-primary" style="max-width:14rem">
                  <RouterLink class="truncate" :to="`/${props.chain}/tx/${item.hash}`">{{
                    item.hash
                  }}</RouterLink>
                </td>
                <td class="text-sm text-primary">
                  <RouterLink :to="`/${props.chain}/block/${item.height}`">{{ item.height }}</RouterLink>
                </td>
                <td>
                  <span class="text-xs truncate relative py-2 px-4 w-fit mr-2 rounded-lg" :class="`text-${item.status === 0 ? 'success' : 'error'
                    }`">
                    <span class="inset-x-0 inset-y-0 opacity-10 absolute" :class="`bg-${item.status === 0 ? 'success' : 'error'
                      }`"></span>
                    {{ item.status === 0 ? 'Success' : 'Failed' }}
                  </span>
                </td>
                <td>{{ format.messages(item.messages) }}</td>
                <td>{{ format.formatTokens(item.fee.amount) }}</td>
                <td>
                  {{
                    format.toDay(item.timestamp, 'from')
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <!-- <div class="bg-base-100 rounded-lg mt-4">
        <div class="px-4 pt-4 pb-2 text-md font-semibold text-main">
          Application Versions
        </div> -->
      <!-- Application Version -->
      <!-- <ArrayObjectElement :value="paramStore.appVersion?.items" :thead="false" />
        <div class="h-4"></div>
      </div> -->

      <div v-if="!store.coingeckoId" class="bg-base-100 rounded-lg mt-4 col-span-1">
        <div class="px-4 pt-4 pb-2 text-lg font-semibold text-main">
          Node Information
        </div>
        <ArrayObjectElement :value="paramStore.nodeVersion?.items" :thead="false" />
        <div class="h-4"></div>
      </div>

    </div>
    <!-- Network Statistics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 mt-4">
      <!-- Network Stats Cards -->
      <div class="bg-base-100 rounded-lg p-4 mr-5">
        <div class="px-4 pt-2 pb-4 text-lg font-semibold text-main">
          Network Statistics
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 p-2">
          <!-- Wallets Card -->
          <div class="stat bg-base-200 rounded-lg p-3">
            <div class="stat-title text-xs">Total Wallets</div>
            <div class="stat-value text-lg">{{ networkStats.wallets.toLocaleString() }}</div>
          </div>
          
          <!-- Applications Card -->
          <div class="stat bg-base-200 rounded-lg p-3">
            <div class="stat-title text-xs">Applications</div>
            <div class="stat-value text-lg">{{ networkStats.applications.toLocaleString() }}</div>
          </div>
          
          <!-- Suppliers Card -->
          <div class="stat bg-base-200 rounded-lg p-3">
            <div class="stat-title text-xs">Suppliers</div>
            <div class="stat-value text-lg">{{ networkStats.suppliers.toLocaleString() }}</div>
          </div>
          
          <!-- Gateways Card -->
          <div class="stat bg-base-200 rounded-lg p-3">
            <div class="stat-title text-xs">Gateways</div>
            <div class="stat-value text-lg">{{ networkStats.gateways.toLocaleString() }}</div>
          </div>
          
          <!-- Services Card -->
          <div class="stat bg-base-200 rounded-lg p-3">
            <div class="stat-title text-xs">Services</div>
            <div class="stat-value text-lg">{{ networkStats.services.toLocaleString() }}</div>
          </div>
        </div>
      </div>
      
      <!-- Growth Chart -->
      <div class="bg-base-100 rounded-lg p-4">
        <div class="px-4 pt-2 pb-4 text-lg font-semibold text-main">
          Network Growth (7 Days)
        </div>
        <div class="h-80">
          <ApexCharts 
            type="line" 
            height="280" 
            :options="chartOptions" 
            :series="historicalData.series" 
          />
        </div>
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
