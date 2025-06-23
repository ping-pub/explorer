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

const totalValue = computed(() => {
  let value = 0;
  delegations.value?.forEach((x) => {
    value += format.tokenValueNumber(x.balance);
  });
  rewards.value?.total?.forEach((x) => {
    value += format.tokenValueNumber(x);
  });
  balances.value?.forEach((x) => {
    value += format.tokenValueNumber(x);
  });
  unbonding.value?.forEach((x) => {
    x.entries?.forEach((y) => {
      value += format.tokenValueNumber({ amount: y.balance, denom: stakingStore.params.bond_denom });
    });
  });
  return format.formatNumber(value, '0,0.00');
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
    }).catch(e => {
      console.error(e)
    })

    blockchain.rpc.getGatewaysInfo(address).then((x) => {
      // @ts-expect-error because delegation is being reused as stake information container, yet keeping the support for delegations
      delegations.value.push({ balance: x.gateway.stake })
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
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <div class="flex items-center">
        <!-- img -->
        <div class="inline-flex relative w-11 h-11 rounded-md">
          <div class="w-11 h-11 absolute rounded-md opacity-10 bg-primary"></div>
          <div class="w-full inline-flex items-center align-middle flex-none justify-center">
            <Icon icon="mdi-qrcode" class="text-primary" style="width: 27px; height: 27px" />
          </div>
        </div>
        <!-- content -->
        <div class="flex flex-1 flex-col truncate pl-4">
          <h2 class="text-sm card-title">{{ $t('account.address') }}:</h2>
          <span class="text-xs truncate" style="width:max-content"> {{ address }} {{ "&nbsp;&nbsp;&nbsp;" }}
            <span class="float-right" style="width:max-content" v-if="copied">&nbsp;&nbsp;Copied!</span>
            <Icon class="float-right" icon="ic:round-content-copy" @click="copy(address)" />
          </span>
        </div>
      </div>
    </div>

    <!-- Assets -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <div class="flex justify-between">
        <h2 class="card-title mb-4">{{ $t('account.assets') }}</h2>
        <!-- button -->
        <!-- <div class="flex justify-end mb-4 pr-5">
          <label for="send" class="btn btn-primary btn-sm mr-2" @click="dialog.open('send', {}, updateEvent)">{{
            $t('account.btn_send') }}</label>
          <label for="transfer" class="btn btn-primary btn-sm" @click="
            dialog.open(
              'transfer',
              {
                chain_name: blockchain.current?.prettyName,
              },
              updateEvent
            )
            ">{{ $t('account.btn_transfer') }}</label>
        </div> -->
      </div>
      <div class="grid md:!grid-cols-3">
        <div class="md:!col-span-1">
          <DonutChart
            :series="totalAmountByCategory.map(x => { return parseFloat(format.formatToken({ amount: `${x}`, denom: 'upokt' }, true)); })"
            :labels="labels" />
        </div>
        <div class="mt-4 md:!col-span-1 md:!mt-0 md:!ml-4">
          <!-- list-->
          <div class="">
            <!--balances  -->
            <div class="flex items-center px-4 mb-2" v-for="(balanceItem, index) in balances" :key="index">
              <div class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4">
                <Icon icon="mdi-account-cash" class="text-balance" size="20" />
                <div class="absolute top-0 bottom-0 left-0 right-0 bg-balance opacity-20"></div>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">
                  {{ format.formatToken(balanceItem) }}
                </div>
                <div class="text-xs">
                  {{ format.calculatePercent(balanceItem.amount, totalAmount) }}
                </div>
              </div>
            </div>
            <!--delegations  -->
            <div class="flex items-center px-4 mb-2" v-for="(delegationItem, index) in delegations" :key="index">
              <div class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4">
                <Icon icon="mdi-user-clock" class="text-staking" size="20" />
                <div class="absolute top-0 bottom-0 left-0 right-0 bg-staking opacity-20"></div>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">
                  {{ format.formatToken(delegationItem?.balance) }}
                </div>
                <div class="text-xs">
                  {{
                    format.calculatePercent(
                      delegationItem?.balance?.amount,
                      totalAmount
                    )
                  }}
                </div>
              </div>
            </div>
            <!-- rewards.total -->
            <div class="flex items-center px-4 mb-2" v-for="(rewardItem, index) in rewards.total" :key="index">
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
            </div>
            <!-- mdi-account-arrow-right -->
          </div>
          <!-- <div class="mt-4 text-lg font-semibold mr-5 pl-5 border-t pt-4 text-right">
            {{ $t('account.total_value') }}: ${{ totalValue }}
          </div> -->
        </div>
        <div class="md:!col-span-1">
          <h2 class="card-title mb-4">Staked Services</h2>
          <table class="table-compact w-full table-fixed hidden lg:!table">
            <thead>
              <tr>
                <th>Service ID</th>
                <th>RPC Endpoint</th>
                <!-- <th>Revenue Share (Owner/Operator)</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(service, index) of suppliers.services">
                <td>{{ service.service_id }}</td>
                <td>{{service.endpoints.map((ep: any) => ep.url).join(',')}}</td>
                <!-- <td>{{ props.address }}</td> -->
                <!-- <td>{{[...service.rev_share].filter((rs: any) => rs.address != props.address)[0]?.rev_share_percentage || '0'}}% / {{
                  [...service.rev_share].filter((rs: any) => rs.address == props.address)[0]?.rev_share_percentage || '0' }}% </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delegations -->

    <!-- Unbonding Delegations -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow" v-if="unbonding && unbonding.length > 0">
      <h2 class="card-title mb-4">{{ $t('account.unbonding_delegations') }}</h2>
      <div class="overflow-x-auto">
        <table class="table text-sm w-full">
          <thead>
            <tr>
              <th class="py-3">{{ $t('account.creation_height') }}</th>
              <th class="py-3">{{ $t('account.initial_balance') }}</th>
              <th class="py-3">{{ $t('account.balance') }}</th>
              <th class="py-3">{{ $t('account.completion_time') }}</th>
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
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">{{ $t('account.transactions') }}</h2>
      <div class="overflow-x-auto">
        <table class="table w-full text-sm">
          <thead>
            <tr>
              <th class="py-3">{{ $t('account.height') }}</th>
              <th class="py-3">{{ $t('account.hash') }}</th>
              <th class="py-3">{{ $t('account.messages') }}</th>
              <th class="py-3">{{ $t('account.amount') }}</th>
              <th class="py-3">{{ $t('tx.fee') }}</th>
              <th class="py-3">{{ $t('account.time') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="txs.length === 0">
              <td colspan="10">
                <div class="text-center">{{ $t('account.no_transactions') }}</div>
              </td>
            </tr>
            <tr v-for="(v, index) in txs" :key="index">
              <td class="text-sm py-3">
                <RouterLink :to="`/${chain}/blocks/${v.height}`" class="text-primary dark:invert">{{
                  v.height
                  }}</RouterLink>
              </td>
              <td class="truncate py-3" style="max-width: 200px">
                <RouterLink :to="`/${chain}/tx/${v.txhash}`" class="text-primary dark:invert">
                  {{ v.txhash }}
                </RouterLink>
              </td>
              <td class="flex items-center py-3">
                <div class="mr-2">
                  {{ format.messages(v.tx.body.messages) }}
                </div>
                <Icon v-if="v.code === 0" icon="mdi-check" class="text-success text-lg" />
                <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
              </td>
              <td>
                <!-- {{v.tx.body?.messages[0]?.amount}} {{ v.tx.body?.messages[0]?.amount ? format.formatToken(v.tx.body?.messages[0]?.amount[0]) : '-'}} -->
                {{ v.tx.body?.messages[0]?.amount ? format.formatToken(v.tx.body?.messages[0]?.amount[0]) : '-' }}
              </td>
              <td>
                {{ v.tx.auth_info.fee.amount ? format.formatToken(v.tx.auth_info.fee.amount[0]) : '-' }}
              </td>
              <td class="py-3">{{ format.toLocaleDate(v.timestamp) }} <span class=" text-xs">({{
                format.toDay(v.timestamp,
                  'from') }})</span> </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Received -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">{{ $t('account.received') }}</h2>
      <div class="overflow-x-auto">
        <table class="table w-full text-sm">
          <thead>
            <tr>
              <th class="py-3">{{ $t('account.height') }}</th>
              <th class="py-3">{{ $t('account.hash') }}</th>
              <th class="py-3">{{ $t('account.messages') }}</th>
              <th class="py-3">{{ $t('account.amount') }}</th>
              <th class="py-3">{{ $t('tx.fee') }}</th>
              <th class="py-3">{{ $t('account.time') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="recentReceived.length === 0">
              <td colspan="10">
                <div class="text-center">{{ $t('account.no_transactions') }}</div>
              </td>
            </tr>
            <tr v-for="(v, index) in recentReceived" :key="index">
              <td class="text-sm py-3">
                <RouterLink :to="`/${chain}/blocks/${v.height}`" class="text-primary dark:invert">{{
                  v.height
                  }}</RouterLink>
              </td>
              <td class="truncate py-3" style="max-width: 200px">
                <RouterLink :to="`/${chain}/tx/${v.txhash}`" class="text-primary dark:invert">
                  {{ v.txhash }}
                </RouterLink>
              </td>

              <td class="flex items-center py-3">
                <div class="mr-2">
                  {{ format.messages(v.tx.body.messages) }}
                </div>
                <Icon v-if="v.code === 0" icon="mdi-check" class="text-success text-lg" />
                <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
              </td>
              <td>
                <div class="mr-2">
                  {{ v.tx.body.messages[0]?.amount && format.formatToken2(v.tx.body.messages[0].amount[0], true) }}
                  {{ v.tx.body.messages[0]?.stake && format.formatToken2(v.tx.body.messages[0].stake, true) }}
                  {{ (!v.tx.body.messages[0]?.stake && !v.tx.body.messages[0]?.amount) ? '-' : '' }}
                </div>
              </td>
              <td>
                {{ v.tx.auth_info.fee.amount ? format.formatToken(v.tx.auth_info.fee.amount[0]) : '-' }}
              </td>
              <td class="py-3">
                {{ format.toLocaleDate(v.timestamp) }}
                <span class=" text-xs">({{ format.toDay(v.timestamp, 'from') }})</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Account -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">{{ $t('account.acc') }}</h2>
      <DynamicComponent :value="account" />
    </div>
  </div>
  <div v-else class="text-no text-sm">{{ $t('account.error') }}</div>
</template>
