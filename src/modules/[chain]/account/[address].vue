<script lang="ts" setup>
import {
  useBlockchain,
  useFormatter,
  useStakingStore,
  useTxDialog,
} from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import DonutChart from '@/components/charts/DonutChart.vue';
import { computed, ref } from '@vue/reactivity';
import { onMounted, watch } from 'vue';
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
onMounted(() => {
  loadAccount(props.address);
});

// Add watcher for address prop
watch(
  () => props.address,
  (newAddress: string, oldAddress: string) => {
    if (newAddress !== oldAddress) {
      loadAccount(newAddress);
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
    delegations.value = x.delegation_responses;
    // No way to decide if an address is an application, gateway or supplier, so using all endpoints to fetch correct information
    blockchain.rpc.getApplicationsInfo(address).then((x) => {
      // @ts-expect-error because delegation is being reused as stake information container, yet keeping the support for delegations
      delegations.value.push({ balance: x.application.stake })
      applications.value = x.application
    }).catch(e => {
      console.error(e)
    })

    blockchain.rpc.getGatewaysInfo(address).then((x) => {
      // @ts-expect-error because delegation is being reused as stake information container, yet keeping the support for delegations
      delegations.value.push({ balance: x.gateway.stake })
      gateways.value = x.gateways
    }).catch(e => {
      console.error(e)
    })

    blockchain.rpc.getSuppliersInfo(address).then((x) => {
      // @ts-expect-error because delegation is being reused as stake information container, yet keeping the support for delegations
      delegations.value.push({ balance: x.supplier.stake })
      suppliers.value = x.supplier
    }).catch(e => {
      console.error(e)
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
        <div class="flex items-center flex-1 space-x-10">
          <h2 class="text-2xl card-title">{{ $t('account.address') }}</h2>
          <span class="text-xs truncate" style="width:max-content"> {{ address }} {{ "&nbsp;&nbsp;&nbsp;" }}
            <span class="float-right" style="width:max-content" v-if="copied">&nbsp;&nbsp;Copied!</span>
            <Icon class="float-right" icon="ic:round-content-copy" @click="copy(address)" />
          </span>
        </div>
      </div>
    </div>

    <!-- Assets -->
    <div class="flex flex-row w-full gap-8">
      <div class="rounded-xl border dark:border-gray-700 border-[#FFB206] mb-4 overflow-auto w-[70%]">
        <div class="flex justify-between text-main mb-4 dark:bg-base-100 bg-base-200 px-4 py-2">
          <h2 class="text-2xl font-semibold text-[#171C1F] dark:text-[#ffffff;]">{{ $t('account.assets') }}</h2>
        </div>
        <div class="grid md:!grid-cols-3">
          <div class="md:!col-span-1">
            <DonutChart :series="donutData.map(x => x.amount)" :labels="donutData.map(x => x.label)" />
          </div>
          <div class="mt-4 md:!col-span-1 md:!mt-0 md:!ml-3">
            <!-- list-->
            <div class="">
              <!--balances  -->
              <div class="flex flex-row gap-8">
                <div class="flex flex-col items-start">
                  <h2 class="text-[#64748B] text-sm px-4 mb-2">Status</h2>
                  <!-- <div class="flex flex-col items-start px-4 mb-2 gap-4" v-for="(balanceItem, index) in balances" :key="index"> -->
                  <div class="flex flex-col items-start px-4 mb-2 gap-4">
                    <div class="flex items-center justify-start text-sm font-semibold whitespace-nowrap gap-1">
                      <span class="w-3 h-3 bg-[#FFB206] inline-block"></span>
                      {{`Available`}}
                    </div>
                    <!--delegations  -->
                    <!-- <div class="flex flex-row items-start mb-2" v-for="(delegationItem, index) in delegations" :key="index"> -->
                      <div class="flex items-center justify-center text-sm font-semibold whitespace-nowrap gap-1">
                        <span class="w-3 h-3 bg-[#09279F] inline-block"></span>
                        {{`Staked`}}
                      </div>
                    <!-- </div> -->
                  <!-- </div> -->
                  </div>   
                </div>
                <div class="flex flex-col">
                  <h2 class="text-[#64748B;] text-sm px-4 mb-2">Amount</h2>
                  <div class="flex flex-col items-start px-4 mb-2 gap-4" v-for="(balanceItem, index) in balances" :key="index">
                    <div class="text-sm font-semibold whitespace-nowrap">
                      {{ format.formatToken(balanceItem) }}
                    </div>
                    <!--delegations  -->
                    <div class="flex flex-row items-start mb-2 gap-4" v-for="(delegationItem, index) in delegations" :key="index">
                      <div class="flex text-sm font-semibold whitespace-nowrap">
                        {{ format.formatToken(delegationItem?.balance) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col">
                  <h2 class="text-[#64748B;] text-sm px-4 mb-2">Percentage</h2>
                  <div class="flex flex-col items-start px-4 mb-2 gap-4" v-for="(balanceItem, index) in balances" :key="index">
                    <div class="text-xs font-semibold">
                      {{ format.calculatePercent(balanceItem.amount, totalAmount) }}
                    </div>
                    <!--delegations  -->
                    <div class="flex flex-row items-start mb-2 gap-4" v-for="(delegationItem, index) in delegations" :key="index">
                      <div class="flex items-start text-xs font-semibold">
                        {{format.calculatePercent(delegationItem?.balance?.amount, totalAmount)}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              <!--delegations  -->
              <!-- <div class="grid grid-rows-3">
                <div class="flex flex-row items-start mb-2 gap-4" v-for="(delegationItem, index) in delegations" :key="index">
                  <div class="flex flex-row gap-[80%]">
                    <div class="flex text-sm font-semibold whitespace-nowrap">
                      {{ format.formatToken(delegationItem?.balance) }}
                    </div>
                    <div class="flex text-sm font-semibold whitespace-nowrap">
                      {{ format.formatToken(delegationItem?.balance) }}
                    </div>
                    <div class="flex items-start text-xs font-semibold">
                      {{format.calculatePercent(delegationItem?.balance?.amount, totalAmount)}}
                    </div>
                  </div>
                </div>
              </div> -->
              
              <!-- rewards.total -->

              <!-- <div class="flex items-center px-4 mb-2" v-for="(rewardItem, index) in rewards.total" :key="index">
                <div class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4">
                  <Icon icon="mdi-account-arrow-up" class="text-success" size="20" />
                  <div class="absolute top-0 bottom-0 left-0 right-0 bg-success opacity-20"></div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-semibold">
                    {{ format.formatToken(rewardItem) }}
                  </div>
                  <div class="text-xs">{{ format.calculatePercent(rewardItem.amount, totalAmount) }}</div>
                </div>
              </div> -->
            </div>
            <!-- <div class="mt-4 text-lg font-semibold mr-5  pl-5 border-t pt-4 text-right">
              {{ $t('account.total_value') }}: ${{ totalValue }}
            </div> -->
          </div>
        </div>

        <div class="md:!col-span-1 services-table-wrapper w-[46%] mb-4 rounded-xl border bg-base-200 dark:border-base-100 dark:bg-base-100 max-h-80 overflow-y-auto overflow-x-auto" v-if="suppliers.services?.length > 0">
          <h2 class="card-title mb-1 px-4 py-2">Services ({{ suppliers.services?.length }})</h2>
          <div class="services-table-scroll bg-[#ffffff] dark:bg-base-200 rounded-xl">
            <table class="min-w-full text-sm divide-none border-spacing-y-1 border-spacing-x-4 mt-2">
              <thead class="sticky dark:bg-base-200">
                <tr class="text-xs mb-4 text-[#64748B]">
                  <th class="px-2 py-2 text-left">Service ID</th>
                  <th class="px-3 py-2 text-left">RPC Endpoint</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(service, index) in suppliers.services" :key="index" class="dark:bg-base-200 rounded-xl">
                  <td class="px-3 py-1">{{ service.service_id }}</td>
                  <td class="px-3 py-1">
                    <a v-for="(ep, i) in service.endpoints" :key="i" :href="ep.url" target="_blank" class="text-[#09279F] hover:underline block truncate">
                      {{ ep.url }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="md:!col-span-1 services-table-wrapper  w-[46%] mb-4 rounded-xl border bg-base-200 dark:border-base-100 dark:bg-base-100 max-h-80 overflow-y-auto overflow-x-auto" v-if="applications.service_configs?.length > 0">
            <h2 class="card-title mb-1 px-4 py-2">Services ({{ applications.service_configs?.length }})</h2>
            <div class="services-table-scroll rounded-xl dark:bg-base-200 bg-[#ffffff]">
              <table class="min-w-full text-sm divide-none mt-2">
                <thead class="">
                  <tr>
                    <th class="text-left px-4 py-2 text-[#64748B]">Service ID</th>
                    <!-- <th>Revenue Share (Owner/Operator)</th> -->
                    
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(service, index) of applications.service_configs">
                    <td class="px-4 py-1">{{ service.service_id }}</td>
                    <td class="px-2 py-2 text-[#09279F]">{{ props.address }}</td>
                    <!-- <td>{{[...service.rev_share].filter((rs: any) => rs.address != props.address)[0]?.rev_share_percentage || '0'}}% / {{
                      [...service.rev_share].filter((rs: any) => rs.address == props.address)[0]?.rev_share_percentage || '0' }}% </td> -->

                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>

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
                <RouterLink :to="`/${chain}/staking/${v.validator_address}`">{{
                  v.validator_address
                }}</RouterLink>
              </td>
            </tr>
            <tr v-for="entry in v.entries">
              <td class="py-3">{{ entry.creation_height }}</td>
              <td class="py-3">
                {{
                  format.formatToken(
                    {
                      amount: entry.initial_balance,
                      denom: stakingStore.params.bond_denom,
                    },
                    true,
                    '0,0.[00]'
                  )
                }}
              </td>
              <td class="py-3">
                {{
                  format.formatToken(
                    {
                      amount: entry.balance,
                      denom: stakingStore.params.bond_denom,
                    },
                    true,
                    '0,0.[00]'
                  )
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
                <RouterLink :to="`/${chain}/blocks/${v.height}`" class="dark:text-primary text-[#09279F] dark:invert">{{
                  v.height
                }}</RouterLink>
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
                format.toDay(v.timestamp,
                  'from') }})</span> </td>
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
                <RouterLink :to="`/${chain}/blocks/${v.height}`" class="text-[#09279F] dark:text-primary dark:invert">{{
                  v.height
                }}</RouterLink>
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
