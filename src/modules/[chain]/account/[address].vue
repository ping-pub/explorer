<script lang="ts" setup>
import {
  useBlockchain,
  useFormatter,
  useStakingStore,
  useTxDialog,
} from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import DonutChart from '@/components/charts/DonutChart.vue';
import ApexCharts from 'vue3-apexcharts';
import { RouterLink } from 'vue-router';
import { computed, ref } from '@vue/reactivity';
import { onMounted, watch, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

import type {
  AuthAccount,
  Delegation,
  TxResponse,
  DelegatorRewards,
  UnbondingResponses,
  Application,
  Gateway,
  Supplier,
} from '@/types';
import type { Coin } from '@cosmjs/amino';
import Countdown from '@/components/Countdown.vue';
import { fromBase64 } from '@cosmjs/encoding';
import { useClipboard } from '@vueuse/core'

const props = defineProps(['address', 'chain']);

const source = ref(props.address)
const { copy, copied } = useClipboard({ source })

const blockchain = useBlockchain();
const stakingStore = useStakingStore();
const dialog = useTxDialog();
const format = useFormatter();
const account = ref({} as AuthAccount);
const applications = ref({} as Application);
const gateways = ref({} as Gateway);
const suppliers = ref({} as Supplier);
const txs = ref({} as TxResponse[]);
const delegations = ref([] as Delegation[]);
const rewards = ref({} as DelegatorRewards);
const balances = ref([] as Coin[]);
const recentReceived = ref([] as TxResponse[]);
const unbonding = ref([] as UnbondingResponses[]);
const unbondingTotal = ref(0);
const chart = {};
// Cancellation token to avoid updating state from stale requests
let activeLoadToken = 0;
function resetAccountState() {
  account.value = {} as AuthAccount
  applications.value = {} as Application
  gateways.value = {} as Gateway
  suppliers.value = {} as Supplier
  txs.value = [] as unknown as TxResponse[]
  rewards.value = {} as DelegatorRewards
  balances.value = [] as Coin[]
  recentReceived.value = [] as TxResponse[]
  delegations.value = [] as Delegation[]
  unbonding.value = [] as UnbondingResponses[]
  unbondingTotal.value = 0
  performanceRows.value = []
  performanceType.value = 'unknown'
  loadingPerformance.value = false
  performanceError.value = ''
}

async function loadAll(address: string) {
  // Increment token to invalidate any in-flight requests from previous address
  const token = ++activeLoadToken
  resetAccountState()
  // Fire in parallel; each callee checks the token before mutating state
  void loadAccount(address)
  void loadAddressPerformance(address)
}

onMounted(() => {
  loadAll(props.address)
});

onUnmounted(() => {
  // Invalidate any pending updates when component is destroyed
  activeLoadToken++
})

// Add watcher for address prop
watch(
  () => props.address,
  (newAddress: string, oldAddress: string) => {
    if (newAddress !== oldAddress) {
      // Do not await to avoid blocking transitions
      loadAll(newAddress)
    }
  }
);

const totalAmountByCategory = computed(() => {
  let sumDel = 0;
  delegations.value?.forEach((x) => {
    sumDel += Number(x.balance.amount);
  });
  let sumRew = 0;
  rewards.value?.total?.forEach((x) => {
    sumRew += Number(x.amount);
  });
  let sumBal = 0;
  balances.value?.forEach((x) => {
    sumBal += Number(x.amount);
  });
  let sumUn = 0;
  unbonding.value?.forEach((x) => {
    x.entries?.forEach((y) => {
      sumUn += Number(y.balance);
    });
  });
  return [sumBal, sumDel];
});

const labels = ['Balance', 'Staking'];

const totalAmount = computed(() => {
  return totalAmountByCategory.value.reduce((p, c) => c + p, 0);
});

const donutData = computed(() => {
  // Each balance
  const balanceSlices = balances.value.map(b => ({
    label: b.denom.toUpperCase().replace('U', ''),
    amount: parseFloat(format.formatToken(b, true).replace(',', ''))
  }));
  // Each delegation
  const delegationSlices = delegations.value.map((d, i) => ({
    label: `Staking #${i + 1}`,
    amount: parseFloat(format.formatToken(d.balance, true).replace(',', ''))
  }));
  // Optionally, add rewards as slices too
  // const rewardSlices = rewards.value?.total?.map((r, i) => ({
  //   label: `Reward #${i + 1}`,
  //   amount: parseFloat(format.formatToken(r, true))
  // })) || [];
  return [...balanceSlices, ...delegationSlices /*, ...rewardSlices*/];
});

function loadAccount(address: string) {
  blockchain.rpc.getAuthAccount(address).then((x) => {
    account.value = x.account;
  });
  blockchain.rpc.getTxsBySender(address).then((x) => {
    txs.value = x.tx_responses;
  });
  blockchain.rpc.getDistributionDelegatorRewards(address).then((x) => {
    rewards.value = x;
  });
  blockchain.rpc.getStakingDelegations(address).then((x) => {
    const regularDelegations = x.delegation_responses || []

    // Check if address is a supplier, application, or gateway
    // Priority: supplier > application > gateway > regular delegations
    blockchain.rpc.getSuppliersInfo(address).then((supplierData) => {
      suppliers.value = supplierData.supplier
      if (supplierData.supplier?.stake) {
        // If supplier, only show supplier stake, not regular delegations
        // @ts-expect-error because delegation is being reused as stake information container
        delegations.value = [{ balance: supplierData.supplier.stake }]
      } else {
        // Not a supplier, check application
        return blockchain.rpc.getApplicationsInfo(address).then((appData) => {
          applications.value = appData.application
          if (appData.application?.stake) {
            // If application, only show application stake
            // @ts-expect-error because delegation is being reused as stake information container
            delegations.value = [{ balance: appData.application.stake }]
          } else {
            // Not an application, check gateway
            return blockchain.rpc.getGatewaysInfo(address).then((gatewayData) => {
              gateways.value = gatewayData.gateways
              if (gatewayData.gateway?.stake) {
                // If gateway, only show gateway stake
                // @ts-expect-error because delegation is being reused as stake information container
                delegations.value = [{ balance: gatewayData.gateway.stake }]
              } else {
                // Not a gateway either, use regular delegations
                delegations.value = regularDelegations
              }
            }).catch(() => {
              // Gateway check failed, use regular delegations
              delegations.value = regularDelegations
            })
          }
        }).catch(() => {
          // Application check failed, try gateway
          return blockchain.rpc.getGatewaysInfo(address).then((gatewayData) => {
            gateways.value = gatewayData.gateways
            if (gatewayData.gateway?.stake) {
              // @ts-expect-error because delegation is being reused as stake information container
              delegations.value = [{ balance: gatewayData.gateway.stake }]
            } else {
              delegations.value = regularDelegations
            }
          }).catch(() => {
            delegations.value = regularDelegations
          })
        })
      }
    }).catch(() => {
      // Supplier check failed, try application
      blockchain.rpc.getApplicationsInfo(address).then((appData) => {
        applications.value = appData.application
        if (appData.application?.stake) {
          // @ts-expect-error because delegation is being reused as stake information container
          delegations.value = [{ balance: appData.application.stake }]
        } else {
          // Try gateway
          return blockchain.rpc.getGatewaysInfo(address).then((gatewayData) => {
            gateways.value = gatewayData.gateways
            if (gatewayData.gateway?.stake) {
              // @ts-expect-error because delegation is being reused as stake information container
              delegations.value = [{ balance: gatewayData.gateway.stake }]
            } else {
              delegations.value = regularDelegations
            }
          }).catch(() => {
            delegations.value = regularDelegations
          })
        }
      }).catch(() => {
        // Try gateway
        blockchain.rpc.getGatewaysInfo(address).then((gatewayData) => {
          gateways.value = gatewayData.gateways
          if (gatewayData.gateway?.stake) {
            // @ts-expect-error because delegation is being reused as stake information container
            delegations.value = [{ balance: gatewayData.gateway.stake }]
          } else {
            delegations.value = regularDelegations
          }
        }).catch(() => {
          delegations.value = regularDelegations
        })
      })
    }).finally(() => {
      console.error("No info found for address: ", address)
    })
  });
  blockchain.rpc.getBankBalances(address).then((x) => {
    x.balances.forEach((y) => {
      if (y.denom != 'upokt') {
        y.denom = y.denom.toUpperCase();
      }
    });
    balances.value = x.balances;
  });
  blockchain.rpc.getStakingDelegatorUnbonding(address).then((x) => {
    unbonding.value = x.unbonding_responses;
    x.unbonding_responses?.forEach((y) => {
      y.entries.forEach((z) => {
        unbondingTotal.value += Number(z.balance);
      });
    });
  });

  const receivedQuery = `?&pagination.reverse=true&query=coin_received.receiver='${address}'&pagination.limit=5`;
  blockchain.rpc.getTxs(receivedQuery, {}).then((x) => {
    recentReceived.value = x.tx_responses;
  });
}

function updateEvent() {
  loadAccount(props.address);
}

function mapAmount(events: { type: string, attributes: { key: string, value: string }[] }[]) {
  if (!events) return []
  return events.find(x => x.type === 'coin_received')?.attributes
    .filter(x => x.key === 'YW1vdW50' || x.key === `amount`)
    .map(x => x.key === 'amount' ? x.value : String.fromCharCode(...fromBase64(x.value)))
}

// Performance/Usage analytics (Supplier or Application)
type PerformanceRow = {
  day_bucket: string
  total_rewards_upokt: number
  total_relays: number
  avg_efficiency_percent: number
  unique_services?: number
  unique_applications?: number  // For suppliers: number of unique applications served
  unique_suppliers?: number     // For applications: number of unique suppliers
  total_submissions?: number
  avg_reward_per_relay?: number
  total_claimed_compute_units?: number
  total_estimated_compute_units?: number
}

const performanceType = ref<'supplier' | 'application' | 'unknown'>('unknown')
const performanceRows = ref<PerformanceRow[]>([])
const loadingPerformance = ref(false)
const performanceError = ref('')

// Chart data
const rewardsChartSeries = ref([{ name: 'Total Rewards', data: [] as number[] }]);
const relaysChartSeries = ref([{ name: 'Total Relays', data: [] as number[] }]);

const rewardsChartOptions = ref({
  chart: { type: 'area', height: 280, toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#A3E635'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] } },
  grid: { borderColor: 'rgba(255, 255, 255, 0.1)', row: { colors: ['transparent'], opacity: 0.5 } },
  markers: { size: 0 },
  xaxis: { categories: [] as string[], labels: { style: { colors: 'rgb(116, 109, 105)' }, rotate: -45, rotateAlways: false } },
  yaxis: { labels: { style: { colors: 'rgb(116, 109, 105)' }, formatter: (v: number) => (v / 1000000).toFixed(1) + 'M' } },
  tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toLocaleString() + ' upokt' } }
});

const relaysChartOptions = ref({
  chart: { type: 'line', height: 280, toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#5E9AE4'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  grid: { borderColor: 'rgba(255, 255, 255, 0.1)', row: { colors: ['transparent'], opacity: 0.5 } },
  markers: { size: 0 },
  xaxis: { categories: [] as string[], labels: { style: { colors: 'rgb(116, 109, 105)' }, rotate: -45, rotateAlways: false } },
  yaxis: { labels: { style: { colors: 'rgb(116, 109, 105)' }, formatter: (v: number) => (v / 1000).toFixed(0) + 'K' } },
  tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toLocaleString() + ' relays' } }
});

// Summary metrics
const summaryMetrics = computed(() => {
  if (performanceRows.value.length === 0) return null;
  const totalRewards = performanceRows.value.reduce((sum, r) => sum + r.total_rewards_upokt, 0);
  const totalRelays = performanceRows.value.reduce((sum, r) => sum + r.total_relays, 0);
  const totalSubmissions = performanceRows.value.reduce((sum, r) => sum + (r.total_submissions || 0), 0);
  const avgEfficiency = performanceRows.value.reduce((sum, r) => sum + r.avg_efficiency_percent, 0) / performanceRows.value.length;

  // For suppliers: show unique_applications, for applications: show unique_suppliers
  const uniqueApplications = performanceType.value === 'supplier'
    ? Math.max(...performanceRows.value.map(r => r.unique_applications || 0))
    : undefined;
  const uniqueSuppliers = performanceType.value === 'application'
    ? Math.max(...performanceRows.value.map(r => r.unique_suppliers || 0))
    : undefined;
  const uniqueServices = Math.max(...performanceRows.value.map(r => r.unique_services || 0));

  return {
    totalRewards,
    totalRelays,
    totalSubmissions,
    avgEfficiency,
    uniqueApplications,
    uniqueSuppliers,
    uniqueServices
  };
});

function updateCharts() {
  const sorted = [...performanceRows.value].sort((a, b) =>
    new Date(a.day_bucket).getTime() - new Date(b.day_bucket).getTime()
  );

  const labels = sorted.map(d => {
    const date = new Date(d.day_bucket);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  rewardsChartSeries.value = [{ name: 'Total Rewards (upokt)', data: sorted.map(d => d.total_rewards_upokt) }];
  relaysChartSeries.value = [{ name: 'Total Relays', data: sorted.map(d => d.total_relays) }];

  rewardsChartOptions.value.xaxis = {
    ...rewardsChartOptions.value.xaxis,
    categories: labels
  };

  relaysChartOptions.value.xaxis = {
    ...relaysChartOptions.value.xaxis,
    categories: labels
  };
}

function formatNumber(num: number | string): string {
  return new Intl.NumberFormat().format(typeof num === 'string' ? parseInt(num) : num);
}

// Flatten supplier services data into table rows
interface ServiceTableRow {
  serviceId: string
  jsonRpcUrl: string
  websocketUrl: string
  revenueShareAddress: string
  revenueSharePercentage: string
}

const supplierServiceRows = computed(() => {
  if (!suppliers.value?.services) return []
  const rows: ServiceTableRow[] = []

  suppliers.value.services.forEach((service: any) => {
    // Extract JSON_RPC and WEBSOCKET URLs
    let jsonRpcUrl = ''
    let websocketUrl = ''

    service.endpoints?.forEach((endpoint: any) => {
      if (endpoint.rpc_type === 'JSON_RPC') {
        jsonRpcUrl = endpoint.url || ''
      } else if (endpoint.rpc_type === 'WEBSOCKET') {
        websocketUrl = endpoint.url || ''
      }
    })

    // Create one row per revenue share
    if (service.rev_share && service.rev_share.length > 0) {
      service.rev_share.forEach((share: any) => {
        rows.push({
          serviceId: service.service_id,
          jsonRpcUrl,
          websocketUrl,
          revenueShareAddress: share.address || '',
          revenueSharePercentage: share.rev_share_percentage || '0'
        })
      })
    } else {
      // Even if no revenue share, show the service
      rows.push({
        serviceId: service.service_id,
        jsonRpcUrl,
        websocketUrl,
        revenueShareAddress: '',
        revenueSharePercentage: '0'
      })
    }
  })

  return rows
})

function getServiceRowSpan(serviceId: string): number {
  return supplierServiceRows.value.filter(r => r.serviceId === serviceId).length
}

async function fetchJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`status ${res.status}`)
  return res.json()
}

async function loadAddressPerformance(address: string) {
  loadingPerformance.value = true
  performanceError.value = ''
  performanceRows.value = []
  performanceType.value = 'unknown'
  try {
    // Try supplier performance first
    try {
      const data = await fetchJson(`/api/v1/suppliers/${address}/performance?limit=30`)
      const rows = (data?.data || []) as any[]
      if (rows.length > 0) {
        performanceType.value = 'supplier'
        performanceRows.value = rows.map(r => ({
          day_bucket: r.day_bucket,
          total_rewards_upokt: Number(r.total_rewards_upokt || 0),
          total_relays: Number(r.total_relays || 0),
          avg_efficiency_percent: Number(r.avg_efficiency_percent || 0),
          unique_applications: Number(r.unique_applications || 0),
          unique_services: Number(r.unique_services || 0),
          total_submissions: Number(r.total_submissions || 0),
          avg_reward_per_relay: Number(r.avg_reward_per_relay || 0),
          total_claimed_compute_units: Number(r.total_claimed_compute_units || 0),
          total_estimated_compute_units: Number(r.total_estimated_compute_units || 0)
        })).sort((a, b) => new Date(b.day_bucket).getTime() - new Date(a.day_bucket).getTime())
        return
      }
    } catch (e) {
      // fall through to application
    }

    // Fallback: application usage
    try {
      const data = await fetchJson(`/api/v1/applications/${address}/usage?limit=30`)
      const rows = (data?.data || []) as any[]
      if (rows.length > 0) {
        performanceType.value = 'application'
        performanceRows.value = rows.map(r => ({
          day_bucket: r.day_bucket,
          total_rewards_upokt: Number(r.total_rewards_upokt || 0),
          total_relays: Number(r.total_relays || 0),
          avg_efficiency_percent: Number(r.avg_efficiency_percent || 0),
          unique_services: Number(r.unique_services || 0),
          unique_suppliers: Number(r.unique_suppliers || 0),
          total_submissions: Number(r.total_submissions || 0),
          avg_reward_per_relay: Number(r.avg_reward_per_relay || 0),
          total_claimed_compute_units: Number(r.total_claimed_compute_units || 0),
          total_estimated_compute_units: Number(r.total_estimated_compute_units || 0)
        })).sort((a, b) => new Date(b.day_bucket).getTime() - new Date(a.day_bucket).getTime())
        return
      }
    } catch (e) {
      // give up
    }
  } catch (err: any) {
    performanceError.value = String(err?.message || err)
  } finally {
    loadingPerformance.value = false
    if (performanceRows.value.length > 0) {
      updateCharts()
    }
  }
}
</script>
<template>
  <div v-if="account">
    <!-- address -->
    <div class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-4 my-4 font-bold text-[#ffffff]">
      <div class="flex items-center">
        <!-- img -->
        <!-- <div class="inline-flex relative w-11 h-11 rounded-md">
          <div class="w-11 h-11 absolute rounded-md opacity-10 bg-primary"></div>
          <div class="w-full inline-flex items-center align-middle flex-none justify-center">
            <Icon icon="mdi-qrcode" class="text-primary" style="width: 27px; height: 27px" />
          </div>
        </div> -->
        <!-- content -->
        <div class="flex items-center flex-1 space-x-3">
          <h2 class="text-2xl card-title">{{ $t('account.address') }}</h2>
          <span class="text-[10px] truncate flex items-center" style="width:max-content"> {{ address }} {{
            "&nbsp;&nbsp;&nbsp;" }}
            <span class="float-right" style="width:max-content" v-if="copied">&nbsp;&nbsp;Copied!</span>
            <Icon class="float-right" icon="ic:round-content-copy" @click="copy(address)" />
          </span>
        </div>
      </div>
    </div>

    <!-- <div class="bg-base-100 dark:bg-[#00125b] pt-2"> -->
    <!-- Laptop View -->
    <div class="desktop-address flex flex-1 overflow-auto gap-8 mb-4">
      <!-- Assets and Performance Summary -->
      <div class="flex flex-row overflow-auto gap-8 w-full">
        <div class="rounded-xl border dark:border-gray-700 border-[#FFB206] mb-4 overflow-auto flex-1">
          <div class="flex justify-between text-main mb-4 dark:bg-base-100 bg-base-200 px-4 py-2 w-full">
            <h2 class="text-2xl font-semibold text-[#171C1F] dark:text-[#ffffff;]">{{ $t('account.assets') }}</h2>
          </div>
          <div class="grid md:!grid-cols-2">
            <div class="md:!col-span-1">
              <DonutChart :series="donutData.map(x => x.amount)" :labels="donutData.map(x => x.label)" />
            </div>
            <div class="md:!col-span-1 md:!mt-0">
              <!-- list-->
              <div class="">
                <!--balances  -->
                <div class="flex flex-row overflow-auto">
                  <div class="flex flex-col items-start">
                    <h2 class="text-[#64748B] text-sm px-4 mb-2 mt-10">Status</h2>
                    <div class="flex flex-col items-start px-4 mb-2 gap-4">
                      <!-- Available balances -->
                      <div v-for="(balanceItem, index) in balances" :key="`balance-${index}`"
                        class="flex items-center justify-start text-sm font-semibold whitespace-nowrap gap-1">
                        <span class="w-3 h-3 bg-[#09279F] inline-block"></span>
                        {{ `Available` }}
                      </div>
                      <!-- Staked delegations -->
                      <div v-for="(delegationItem, index) in delegations" :key="`delegation-${index}`"
                        class="flex items-center justify-center text-sm font-semibold whitespace-nowrap gap-1">
                        <span class="w-3 h-3 bg-[#FFB206] inline-block"></span>
                        {{ `Staked` }}
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <h2 class="text-[#64748B;] text-sm px-4 mb-2 mt-10">Amount</h2>
                    <div class="flex flex-col items-start px-4 mb-2 gap-4">
                      <!-- Available balances -->
                      <div v-for="(balanceItem, index) in balances" :key="`balance-${index}`"
                        class="text-sm font-semibold whitespace-nowrap">
                        {{ format.formatToken(balanceItem) }}
                      </div>
                      <!-- Staked delegations -->
                      <div v-for="(delegationItem, index) in delegations" :key="`delegation-${index}`"
                        class="flex text-sm font-semibold whitespace-nowrap">
                        {{ format.formatToken(delegationItem?.balance) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <h2 class="text-[#64748B;] text-sm px-4 mb-2 mt-10">Percentage</h2>
                    <div class="flex flex-col items-start px-4 mb-2 gap-4">
                      <!-- Available balances -->
                      <div v-for="(balanceItem, index) in balances" :key="`balance-${index}`"
                        class="text-xs font-semibold">
                        {{ format.calculatePercent(balanceItem.amount, totalAmount) }}
                      </div>
                      <!-- Staked delegations -->
                      <div v-for="(delegationItem, index) in delegations" :key="`delegation-${index}`"
                        class="flex items-start text-xs font-semibold">
                        {{ format.calculatePercent(delegationItem?.balance?.amount, totalAmount) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Summary Cards (next to Assets) -->
        <div class="flex-1 flex flex-col">
          <div v-if="performanceType !== 'unknown' && summaryMetrics"
            class="flex justify-between text-main mb-4 px-4 py-2 w-full">
            <h3 class="text-lg card-title">
              {{ performanceType === 'supplier' ? 'Performance Summary' : 'Usage Summary' }}
            </h3>

            <span class="text-xs text-secondary bg-base-200 dark:bg-base-300 px-3 py-1 rounded-full">
              Last {{ performanceRows.length }} days
            </span>
          </div>
          <div v-if="performanceType !== 'unknown' && summaryMetrics" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#A3E635] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:currency-usd" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Total Rewards</div>
                </div>
                <div class="text-xl font-bold">{{ format.formatToken({
                  denom: 'upokt', amount:
                    String(summaryMetrics.totalRewards) }) }}</div>
              </div>
            </div>
            <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#5E9AE4] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:network" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Total Relays</div>
                </div>
                <div class="text-xl font-bold">{{ formatNumber(summaryMetrics.totalRelays) }}</div>
              </div>
            </div>
            <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#FFB206] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:percent" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Avg Efficiency</div>
                </div>
                <div class="text-xl font-bold">{{ summaryMetrics.avgEfficiency.toFixed(2) }}%</div>
              </div>
            </div>
            <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#60BC29] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:file-document-multiple" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Total Submissions</div>
                </div>
                <div class="text-xl font-bold">{{ formatNumber(summaryMetrics.totalSubmissions) }}</div>
              </div>
            </div>
            <div v-if="performanceType === 'supplier' && summaryMetrics.uniqueApplications"
              class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#09279F] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:apps" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Max Applications/Day</div>
                </div>
                <div class="text-xl font-bold">{{ formatNumber(summaryMetrics.uniqueApplications) }}</div>
              </div>
            </div>
            <div v-if="performanceType === 'application' && summaryMetrics.uniqueSuppliers"
              class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#09279F] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:account-group" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Max Suppliers/Day</div>
                </div>
                <div class="text-xl font-bold">{{ formatNumber(summaryMetrics.uniqueSuppliers) }}</div>
              </div>
            </div>
            <div v-if="summaryMetrics.uniqueServices" class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#A3E635] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:handshake" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Unique Services</div>
                </div>
                <div class="text-xl font-bold">{{ formatNumber(summaryMetrics.uniqueServices) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Mobile / Tablet view -->
    <div class="mobile-address flex flex-col gap-4 w-full lg:hidden">
      <!-- Assets -->
      <div class="w-full">
        <div class="rounded-xl border w-full dark:border-gray-700 border-[#FFB206] mb-4 overflow-auto">
          <div class="flex justify-between text-main mb-4 dark:bg-base-100 bg-base-200 px-4 py-2 w-full">
            <h2 class="text-2xl font-semibold text-[#171C1F] dark:text-[#ffffff;]">{{ $t('account.assets') }}</h2>
          </div>
          <div class="grid md:!grid-cols-2">
            <div class="md:!col-span-1">
              <DonutChart :series="donutData.map(x => x.amount)" :labels="donutData.map(x => x.label)" />
            </div>
            <div class="md:!col-span-1 md:!mt-0">
              <!-- list-->
              <div class="">
                <!--balances  -->
                <div class="flex flex-row overflow-auto">
                  <div class="flex flex-col items-start">
                    <h2 class="text-[#64748B] text-sm px-4 mb-2 mt-10">Status</h2>
                    <div class="flex flex-col items-start px-4 mb-2 gap-4">
                      <!-- Available balances -->
                      <div v-for="(balanceItem, index) in balances" :key="`balance-${index}`"
                        class="flex items-center justify-start text-sm font-semibold whitespace-nowrap gap-1">
                        <span class="w-3 h-3 bg-[#09279F] inline-block"></span>
                        {{ `Available` }}
                      </div>
                      <!-- Staked delegations -->
                      <div v-for="(delegationItem, index) in delegations" :key="`delegation-${index}`"
                        class="flex items-center justify-center text-sm font-semibold whitespace-nowrap gap-1">
                        <span class="w-3 h-3 bg-[#FFB206] inline-block"></span>
                        {{ `Staked` }}
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <h2 class="text-[#64748B;] text-sm px-4 mb-2 mt-10">Amount</h2>
                    <div class="flex flex-col items-start px-4 mb-2 gap-4">
                      <!-- Available balances -->
                      <div v-for="(balanceItem, index) in balances" :key="`balance-${index}`"
                        class="text-sm font-semibold whitespace-nowrap">
                        {{ format.formatToken(balanceItem) }}
                      </div>
                      <!-- Staked delegations -->
                      <div v-for="(delegationItem, index) in delegations" :key="`delegation-${index}`"
                        class="flex text-sm font-semibold whitespace-nowrap">
                        {{ format.formatToken(delegationItem?.balance) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <h2 class="text-[#64748B;] text-sm px-4 mb-2 mt-10">Percentage</h2>
                    <div class="flex flex-col items-start px-4 mb-2 gap-4">
                      <!-- Available balances -->
                      <div v-for="(balanceItem, index) in balances" :key="`balance-${index}`"
                        class="text-xs font-semibold">
                        {{ format.calculatePercent(balanceItem.amount, totalAmount) }}
                      </div>
                      <!-- Staked delegations -->
                      <div v-for="(delegationItem, index) in delegations" :key="`delegation-${index}`"
                        class="flex items-start text-xs font-semibold">
                        {{ format.calculatePercent(delegationItem?.balance?.amount, totalAmount) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Performance Summary Cards (next to Assets) -->
        <div class="flex-1 flex flex-col">
          <div v-if="performanceType !== 'unknown' && summaryMetrics"
            class="flex justify-between text-main mb-4 px-4 py-2 w-full">
            <h3 class="text-lg card-title">
              {{ performanceType === 'supplier' ? 'Performance Summary' : 'Usage Summary' }}
            </h3>

            <span class="text-xs text-secondary bg-base-200 dark:bg-base-300 px-3 py-1 rounded-full">
              Last {{ performanceRows.length }} days
            </span>
          </div>
          <div v-if="performanceType !== 'unknown' && summaryMetrics" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#A3E635] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:currency-usd" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Total Rewards</div>
                </div>
                <div class="text-xl font-bold">{{ format.formatToken({
                  denom: 'upokt', amount:
                    String(summaryMetrics.totalRewards) }) }}</div>
              </div>
            </div>
            <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#5E9AE4] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:network" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Total Relays</div>
                </div>
                <div class="text-xl font-bold">{{ formatNumber(summaryMetrics.totalRelays) }}</div>
              </div>
            </div>
            <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#FFB206] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:percent" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Avg Efficiency</div>
                </div>
                <div class="text-xl font-bold">{{ summaryMetrics.avgEfficiency.toFixed(2) }}%</div>
              </div>
            </div>
            <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#60BC29] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:file-document-multiple" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Total Submissions</div>
                </div>
                <div class="text-xl font-bold">{{ formatNumber(summaryMetrics.totalSubmissions) }}</div>
              </div>
            </div>
            <div v-if="performanceType === 'supplier' && summaryMetrics.uniqueApplications"
              class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#09279F] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:apps" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Max Applications/Day</div>
                </div>
                <div class="text-xl font-bold">{{ formatNumber(summaryMetrics.uniqueApplications) }}</div>
              </div>
            </div>
            <div v-if="performanceType === 'application' && summaryMetrics.uniqueSuppliers"
              class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#09279F] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:account-group" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Max Suppliers/Day</div>
                </div>
                <div class="text-xl font-bold">{{ formatNumber(summaryMetrics.uniqueSuppliers) }}</div>
              </div>
            </div>
            <div v-if="summaryMetrics.uniqueServices" class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 dark:bg-base-200 bg-[#A3E635] rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:handshake" class="text-lg text-white" />
                  </div>
                  <div class="text-sm text-secondary">Unique Services</div>
                </div>
                <div class="text-xl font-bold">{{ formatNumber(summaryMetrics.uniqueServices) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Services Table (for Suppliers) -->
    <div v-if="suppliers.services?.length > 0" class="mb-4 mt-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl card-title">
          Services ({{ suppliers.services?.length }})
        </h2>
      </div>
      <div class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-0.5 rounded-xl shadow-md mb-4">
        <div class="services-table-wrapper services-table-scroll rounded-xl">
          <table class="table table-compact w-full">
            <thead class="sticky top-0 bg-white">
              <tr class="border-b-[0px]">
                <th class="bg-white dark:bg-base-200">Service ID</th>
                <th class="bg-white dark:bg-base-200">JSON_RPC URL</th>
                <th class="bg-white dark:bg-base-200">WEBSOCKET URL</th>
                <th class="bg-white dark:bg-base-200">Revenue Share Address</th>
                <th class="bg-white dark:bg-base-200">Percentage</th>
              </tr>
            </thead>
            <tbody class="bg-base-100 relative">
              <template v-for="(row, index) in supplierServiceRows" :key="index">
                <tr class="hover:bg-base-300 transition-colors rounded-xl duration-200 border-b-[0px]">
                  <td v-if="index === 0 || supplierServiceRows[index - 1].serviceId !== row.serviceId"
                    :rowspan="getServiceRowSpan(row.serviceId)" class="dark:bg-base-200 bg-white align-top font-medium">
                    {{ row.serviceId }}
                  </td>
                  <td v-if="index === 0 || supplierServiceRows[index - 1].serviceId !== row.serviceId"
                    :rowspan="getServiceRowSpan(row.serviceId)" class="dark:bg-base-200 bg-white align-top">
                    <a v-if="row.jsonRpcUrl" :href="row.jsonRpcUrl" target="_blank"
                      class="text-[#09279F] dark:text-warning hover:underline font-mono text-xs"
                      :title="row.jsonRpcUrl">
                      {{ row.jsonRpcUrl }}
                    </a>
                    <span v-else class="text-xs text-gray-500">-</span>
                  </td>
                  <td v-if="index === 0 || supplierServiceRows[index - 1].serviceId !== row.serviceId"
                    :rowspan="getServiceRowSpan(row.serviceId)" class="dark:bg-base-200 bg-white align-top">
                    <a v-if="row.websocketUrl" :href="row.websocketUrl" target="_blank"
                      class="text-[#09279F] dark:text-warning hover:underline font-mono text-xs"
                      :title="row.websocketUrl">
                      {{ row.websocketUrl }}
                    </a>
                    <span v-else class="text-xs text-gray-500">-</span>
                  </td>
                  <td class="dark:bg-base-200 bg-white">
                    <RouterLink v-if="row.revenueShareAddress" :to="`/${chain}/account/${row.revenueShareAddress}`"
                      class="dark:text-warning text-[#153cd8] hover:underline font-mono text-xs"
                      :title="row.revenueShareAddress">
                      {{ row.revenueShareAddress.length > 20 ? row.revenueShareAddress.substring(0, 17) + '...' :
                        row.revenueShareAddress }}
                    </RouterLink>
                    <span v-else class="text-xs text-gray-500">-</span>
                  </td>
                  <td class="dark:bg-base-200 bg-white">
                    <span class="text-xs">{{ row.revenueSharePercentage }}%</span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Service Display (for Applications) -->
    <div v-if="applications.service_configs?.length > 0" class="mb-4  mt-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl card-title">
          Service
        </h2>
      </div>
      <div class="bg-[#EFF2F5] dark:bg-base-100 px-4 py-4 rounded-xl shadow-md mb-4">
        <div class="flex items-center gap-3">
          <span class="text-sm text-[#64748B] dark:text-secondary font-medium">Service ID:</span>
          <span class="badge badge-primary badge-lg font-mono">
            {{ applications.service_configs[0]?.service_id || applications.service_configs[0]?.service_name || 'N/A' }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <!-- </div>     -->

  <!-- Delegations -->

  <!-- Unbonding Delegations -->
  <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow" v-if="unbonding && unbonding.length > 0">
    <h2 class="card-title mb-4">{{ $t('account.unbonding_delegations') }}</h2>
    <div class="overflow-x-auto">
      <table class="table text-sm w-full">
        <thead class="bg-base-200">
          <tr>
            <th class="py-3 bg-base-300">{{ $t('account.creation_height') }}</th>
            <th class="py-3 bg-base-300">{{ $t('account.initial_balance') }}</th>
            <th class="py-3 bg-base-300">{{ $t('account.balance') }}</th>
            <th class="py-3 bg-base-300">{{ $t('account.completion_time') }}</th>
          </tr>
        </thead>
        <tbody class="text-sm" v-for="(v, index) in unbonding" :key="index">
          <tr>
            <td class="text-caption text-primary py-3 bg-slate-200" colspan="10">
              <RouterLink :to="`/${chain}/staking/${v.validator_address}`">{{ v.validator_address }}</RouterLink>
            </td>
          </tr>
          <tr v-for="entry in v.entries">
            <td class="py-3">{{ entry.creation_height }}</td>
            <td class="py-3">
              {{ format.formatToken({ amount: entry.initial_balance, denom: stakingStore.params.bond_denom, }, true,
                '0,0.[00]') }}
            </td>
            <td class="py-3">
              {{ format.formatToken({ amount: entry.balance, denom: stakingStore.params.bond_denom, }, true, '0,0.[00]')
              }}
            </td>
            <td class="py-3">
              <Countdown :time="new Date(entry.completion_time).getTime() - new Date().getTime()" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-if="performanceType !== 'unknown'" class="mb-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl card-title">
        {{ performanceType === 'supplier' ? 'Supplier Performance' : 'Application Usage' }}
      </h2>
      <span class="text-xs text-secondary bg-base-200 dark:bg-base-300 px-3 py-1 rounded-full">
        Last {{ performanceRows.length }} days
      </span>
    </div>


    <!-- Charts -->
    <div v-if="performanceRows.length > 0 && !loadingPerformance" class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
      <div
        class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100">
        <div class="flex items-center mb-4">
          <div class="text-lg font-semibold text-main ml-5">Daily Rewards Trend</div>
        </div>
        <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md">
          <div class="h-80">
            <ApexCharts type="area" height="280" :options="rewardsChartOptions" :series="rewardsChartSeries" />
          </div>
        </div>
      </div>
      <div
        class="dark:bg-base-100 bg-base-200 pt-3 rounded-lg border-[3px] border-solid border-base-200 dark:border-base-100">
        <div class="flex items-center mb-4">
          <div class="text-lg font-semibold text-main ml-5">Daily Relays Trend</div>
        </div>
        <div class="dark:bg-base-200 bg-base-100 p-4 rounded-md">
          <div class="h-80">
            <ApexCharts type="line" height="280" :options="relaysChartOptions" :series="relaysChartSeries" />
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Table -->
    <div v-if="performanceRows.length > 0"
      class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-0.5 rounded-xl shadow-md mb-4">
      <div class="services-table-wrapper services-table-scroll rounded-xl">
        <table class="table table-compact w-full">
          <thead class="sticky top-0 bg-white">
            <tr class="border-b-[0px]">
              <th class="bg-white dark:bg-base-200">Day</th>
              <th class="bg-white dark:bg-base-200">Rewards (POKT)</th>
              <th class="bg-white dark:bg-base-200">Relays</th>
              <th class="bg-white dark:bg-base-200">Submissions</th>
              <th class="bg-white dark:bg-base-200">Avg Efficiency</th>
              <th class="bg-white dark:bg-base-200" v-if="performanceType === 'supplier'">Unique Applications</th>
              <th class="bg-white dark:bg-base-200" v-if="performanceType === 'application'">Unique Suppliers</th>
              <th class="bg-white dark:bg-base-200">Unique Services</th>
              <th class="bg-white dark:bg-base-200">Reward/Relay</th>
            </tr>
          </thead>
          <tbody class="bg-base-100 relative">
            <tr v-if="loadingPerformance">
              <td colspan="10" class="py-8">
                <div class="flex justify-center items-center">
                  <div class="loading loading-spinner loading-md"></div>
                  <span class="ml-2">Loading performance data...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="performanceRows.length === 0">
              <td colspan="10" class="py-8">
                <div class="text-center text-gray-500">No performance data available</div>
              </td>
            </tr>
            <tr v-else v-for="(row, i) in performanceRows" :key="i"
              class="hover:bg-base-300 transition-colors rounded-xl duration-200 border-b-[0px]">
              <td class="dark:bg-base-200 bg-white">{{ format.toLocaleDate(row.day_bucket) }}</td>
              <td class="dark:bg-base-200 bg-white">{{ format.formatToken({
                denom: 'upokt', amount:
                  String(row.total_rewards_upokt)
              }) }}</td>
              <td class="dark:bg-base-200 bg-white">{{ formatNumber(row.total_relays) }}</td>
              <td class="dark:bg-base-200 bg-white">{{ formatNumber(row.total_submissions || 0) }}</td>
              <td class="dark:bg-base-200 bg-white">
                <span
                  :class="row.avg_efficiency_percent >= 95 ? 'text-success' : row.avg_efficiency_percent >= 80 ? 'text-warning' : 'text-error'">
                  {{ Number(row.avg_efficiency_percent || 0).toFixed(2) }}%
                </span>
              </td>
              <td class="dark:bg-base-200 bg-white" v-if="performanceType === 'supplier'">{{
                formatNumber(row.unique_applications || 0) }}</td>
              <td class="dark:bg-base-200 bg-white" v-if="performanceType === 'application'">{{
                formatNumber(row.unique_suppliers || 0) }}</td>
              <td class="dark:bg-base-200 bg-white">{{ formatNumber(row.unique_services || 0) }}</td>
              <td class="dark:bg-base-200 bg-white">{{ (row.avg_reward_per_relay || 0).toFixed(4) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- Transactions -->
  <div class="dark:bg-base-100 bg-base-200  px-0.5 pt-0.5 pb-0.5 rounded-xl mb-4">
    <h2 class="card-title text-2xl px-4 py-2">{{ $t('account.sent') }}</h2>
    <div class="services-table-wrapper services-table-scroll rounded-xl">
      <table class="table w-full text-sm">
        <thead class="bg-base-200 ">
          <tr>
            <th class="dark:bg-base-200 bg-white py-3">{{ $t('account.height') }}</th>
            <th class="dark:bg-base-200 bg-white py-3">{{ $t('account.hash') }}</th>
            <th class="dark:bg-base-200 bg-white py-3">{{ $t('account.messages') }}</th>
            <th class="dark:bg-base-200 bg-white py-3">{{ $t('account.amount') }}</th>
            <th class="dark:bg-base-200 bg-white py-3">{{ $t('tx.fee') }}</th>
            <th class="dark:bg-base-200 bg-white py-3">{{ $t('account.time') }}</th>
          </tr>
        </thead>
        <tbody class="text-md dark:bg-base-200 bg-white">
          <tr v-if="txs?.length === 0">
            <td colspan="10">
              <div class="text-center">{{ $t('account.no_transactions') }}</div>
            </td>
          </tr>
          <tr v-for="(v, index) in txs" :key="index">
            <td class="text-sm py-3 dark:bg-base-200 bg-white">
              <RouterLink :to="`/${chain}/blocks/${v.height}`" class="dark:text-primary text-[#09279F] dark:invert">
                {{ v.height }}</RouterLink>
            </td>
            <td class="truncate py-3 dark:bg-base-200 bg-white" style="max-width: 200px">
              <RouterLink :to="`/${chain}/tx/${v.txhash}`" class="dark:text-primary text-[#09279F] dark:invert">
                {{ v.txhash }}
              </RouterLink>
            </td>
            <td class="flex items-center py-3 dark:bg-base-200 bg-white">
              <div class="mr-2">
                {{ format.messages(v.tx.body.messages) }}
              </div>
              <Icon v-if="v.code === 0" icon="mdi-check" class="text-[#60BC29] text-lg" />
              <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
            </td>
            <td class="dark:bg-base-200 bg-white">
              <!-- {{v.tx.body?.messages[0]?.amount}} {{ v.tx.body?.messages[0]?.amount ? format.formatToken(v.tx.body?.messages[0]?.amount[0]) : '-'}} -->
              {{ v.tx.body?.messages[0]?.amount ? format.formatToken(v.tx.body?.messages[0]?.amount[0]) : '-' }}
            </td>
            <td class="dark:bg-base-200 bg-white">
              {{ v.tx.auth_info.fee.amount ? format.formatToken(v.tx.auth_info.fee.amount[0]) : '-' }}
            </td>
            <td class="py-3 dark:bg-base-200 bg-white">{{ format.toLocaleDate(v.timestamp) }} <span class=" text-xs">({{
              format.toDay(v.timestamp, 'from') }})</span> </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Received -->
  <div class="dark:bg-base-100 bg-base-200 px-0.5 pt-0.5 pb-0.5 rounded-xl mb-4">
    <h2 class="card-title  px-4 py-2 text-2xl">{{ $t('account.received') }}</h2>
    <div class="services-table-wrapper services-table-scroll rounded-xl">
      <table class="table w-full text-sm">
        <thead>
          <tr>
            <th class="py-3 dark:bg-base-200 bg-white">{{ $t('account.height') }}</th>
            <th class="py-3 dark:bg-base-200 bg-white">{{ $t('account.hash') }}</th>
            <th class="py-3 dark:bg-base-200 bg-white">{{ $t('account.messages') }}</th>
            <th class="py-3 dark:bg-base-200 bg-white">{{ $t('account.amount') }}</th>
            <th class="py-3 dark:bg-base-200 bg-white">{{ $t('tx.fee') }}</th>
            <th class="py-3 dark:bg-base-200 bg-white">{{ $t('account.time') }}</th>
          </tr>
        </thead>
        <tbody class="text-sm dark:bg-base-200 bg-white">
          <tr v-if="recentReceived.length === 0">
            <td colspan="10">
              <div class="text-center">{{ $t('account.no_transactions') }}</div>
            </td>
          </tr>
          <tr v-for="(v, index) in recentReceived" :key="index">
            <td class="text-sm py-3 dark:bg-base-200 bg-white">
              <RouterLink :to="`/${chain}/blocks/${v.height}`" class="text-[#09279F] dark:text-primary dark:invert">
                {{ v.height }}</RouterLink>
            </td>
            <td class="truncate py-3 dark:bg-base-200 bg-white" style="max-width: 200px">
              <RouterLink :to="`/${chain}/tx/${v.txhash}`" class="text-[#09279F] dark:text-primary dark:invert">
                {{ v.txhash }}
              </RouterLink>
            </td>

            <td class="flex items-center py-3 dark:bg-base-200 bg-white">
              <div class="mr-2">
                {{ format.messages(v.tx.body.messages) }}
              </div>
              <Icon v-if="v.code === 0" icon="mdi-check" class="text-[#60BC29] text-lg" />
              <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
            </td>
            <td class="dark:bg-base-200 bg-white">
              <div class="mr-2">
                {{ v.tx.body.messages[0]?.amount && format.formatToken2(v.tx.body.messages[0].amount[0], true) }}
                {{ v.tx.body.messages[0]?.stake && format.formatToken2(v.tx.body.messages[0].stake, true) }}
                {{ (!v.tx.body.messages[0]?.stake && !v.tx.body.messages[0]?.amount) ? '-' : '' }}
              </div>
            </td>
            <td class="dark:bg-base-200 bg-white">
              {{ v.tx.auth_info.fee.amount ? format.formatToken(v.tx.auth_info.fee.amount[0]) : '-' }}
            </td>
            <td class="py-3 dark:bg-base-200 bg-white">
              {{ format.toLocaleDate(v.timestamp) }}
              <span class=" text-xs">({{ format.toDay(v.timestamp, 'from') }})</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Performance / Usage (Supplier or Application) -->


  <!-- Account -->
  <div v-if="account" class="dark:bg-base-100 bg-base-200 px-0.5 pt-0.5 pb-0.5 rounded-xl mb-4">
    <h2 class="card-title text-2xl px-4 py-2">{{ $t('account.acc') }}</h2>
    <DynamicComponent :value="account" />
  </div>

  <div v-else class="text-no text-sm">
    {{ $t('account.error') }}
  </div>
</template>

<style scoped>
.desktop-address {
  display: none;
}

.mobile-address {
  display: block;
}

/* Media query for desktop */
@media (min-width: 1024px) {
  .desktop-address {
    display: flex;
  }

  .mobile-address {
    display: none;
  }
}

.services-table-wrapper {
  height: 320px;
  max-height: 320px;
  display: flex;
  flex-direction: column;
}

.services-table-scroll {
  flex: 1 1 auto;
  overflow-y: auto;
}

.services-table-scroll table {
  margin-bottom: 0;
}

.services-table-scroll thead {
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 1;
}
</style>