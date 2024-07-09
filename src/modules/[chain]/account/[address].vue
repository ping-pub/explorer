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
import { onMounted } from 'vue';
import { Icon } from '@iconify/vue';

import {
  type AuthAccount,
  type Delegation,
  type TxResponse,
  type DelegatorRewards,
  type UnbondingResponses,
  PageRequest,
} from '@/types';

import type { Coin } from '@cosmjs/amino';
import Countdown from '@/components/Countdown.vue';
import { fromAscii, fromBase64, toBase64, toHex } from '@cosmjs/encoding';
import type {
  DelegationResponse,
  UnbondingDelegation,
} from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { BaseAccount } from 'cosmjs-types/cosmos/auth/v1beta1/auth';
import type { ExtraTxResponse } from '@/libs/client';
import type { QueryDelegationTotalRewardsResponse } from 'cosmjs-types/cosmos/distribution/v1beta1/query';
import { fromTimestamp } from 'cosmjs-types/helpers';
import type { Event } from 'cosmjs-types/tendermint/abci/types';

const props = defineProps(['address', 'chain']);

const blockchain = useBlockchain();
const stakingStore = useStakingStore();
const dialog = useTxDialog();
const format = useFormatter();
const account = ref({} as BaseAccount | undefined);
const txs = ref({} as ExtraTxResponse[]);
const delegations = ref([] as DelegationResponse[]);
const rewards = ref({} as QueryDelegationTotalRewardsResponse);
const balances = ref([] as Coin[]);
const recentReceived = ref([] as ExtraTxResponse[]);
const unbonding = ref([] as UnbondingDelegation[]);
const unbondingTotal = ref(0);
const chart = {};
onMounted(() => {
  loadAccount(props.address);
});
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
  return [sumBal, sumDel, sumRew, sumUn];
});

const labels = ['Balance', 'Delegation', 'Reward', 'Unbonding'];

const totalAmount = computed(() => {
  return totalAmountByCategory.value.reduce((p, c) => c + p, 0);
});

const totalValue = computed(() => {
  let value = 0;
  delegations.value?.forEach((x) => {
    value += format.tokenValueNumber(x.balance, 1e18);
  });
  rewards.value?.total?.forEach((x) => {
    value += format.tokenValueNumber(x, 1e18);
  });
  balances.value?.forEach((x) => {
    value += format.tokenValueNumber(x, 1e18);
  });
  unbonding.value?.forEach((x) => {
    x.entries?.forEach((y) => {
      value += format.tokenValueNumber(
        {
          amount: y.balance,
          denom: stakingStore.params.bondDenom,
        },
        1e18
      );
    });
  });
  return format.formatNumber(value, '0,0.00');
});

function loadAccount(address: string) {
  blockchain.rpc.getAuthAccount(address).then((x) => {
    account.value = BaseAccount.decode(x?.value!);
  });
  blockchain.rpc.getTxsBySender(address).then((x) => {
    txs.value = x.txs;
  });
  blockchain.rpc.getDistributionDelegatorRewards(address).then((x) => {
    rewards.value = x;
  });
  blockchain.rpc.getStakingDelegations(address).then((x) => {
    delegations.value = x.delegationResponses;
  });
  blockchain.rpc.getBankBalances(address).then((x) => {
    balances.value = x;
  });
  blockchain.rpc.getStakingDelegatorUnbonding(address).then((x) => {
    unbonding.value = x.unbondingResponses;
    x.unbondingResponses?.forEach((y) => {
      y.entries.forEach((z) => {
        unbondingTotal.value += Number(z.balance);
      });
    });
  });

  blockchain.rpc
    .getTxs(
      [
        {
          key: 'coin_received.receiver',
          value: address,
        },
      ],
      new PageRequest(5, true)
    )
    .then((x) => {
      recentReceived.value = x.txs;
    });
}

function updateEvent() {
  loadAccount(props.address);
}

function mapAmount(events: readonly Event[]) {
  if (!events) return [];
  return events
    .find((x) => x.type === 'coin_received')
    ?.attributes.filter((x) => x.key === 'amount')
    .map((x) => x.value);
}
</script>
<template>
  <div v-if="account">
    <!-- address -->
    <div
      class="m-4 md:m-6 mb-4 p-4 md:p-6 rounded-[16px] shadow bg-[#141416] border border-[#242627]"
    >
      <div class="flex items-center">
        <!-- img -->
        <!-- <div class="inline-flex relative w-11 h-11 rounded-md">
          <div
            class="w-11 h-11 absolute rounded-md opacity-10 bg-primary"
          ></div>
          <div
            class="w-full inline-flex items-center align-middle flex-none justify-center"
          >
            <Icon
              icon="mdi-qrcode"
              class="text-primary"
              style="width: 27px; height: 27px"
            />
          </div>
        </div> -->
        <!-- content -->
        <div class="flex flex-1 flex-col truncate pl-4">
          <h2 class="text-sm card-title">
            {{ $t('account.address') }}
          </h2>
          <span class="truncate text-lg text-white"> {{ address }}</span>
        </div>
        <!-- button -->
        <div class="flex justify-end mb-4 pr-5">
          <label
            for="send"
            class="btn btn-secondary-sm btn-sm mr-2"
            @click="dialog.open('send', {}, updateEvent)"
            >{{ $t('account.btn_send') }}</label
          >
          <label
            for="transfer"
            class="btn btn-secondary-sm btn-sm"
            @click="
              dialog.open(
                'transfer',
                {
                  chain_name: blockchain.current?.prettyName,
                },
                updateEvent
              )
            "
            >{{ $t('account.btn_transfer') }}</label
          >
        </div>
      </div>
    </div>

    <!-- Assets -->
    <div
      class="m-4 md:m-6 mb-4 p-4 md:p-6 rounded-[16px] shadow bg-[#141416] border border-[#242627]"
    >
      <div class="flex text-white justify-between">
        <h2 class="card-title mb-4">{{ $t('account.assets') }}</h2>
      </div>
      <div class="grid md:!grid-cols-3">
        <div class="md:!col-span-1">
          <DonutChart :series="totalAmountByCategory" :labels="labels" />
        </div>
        <div class="mt-4 md:!col-span-2 md:!mt-0 md:!ml-4">
          <!-- list-->
          <div class="">
            <!--balances  -->
            <div
              class="flex items-center px-4 mb-2"
              v-for="(balanceItem, index) in balances"
              :key="index"
            >
              <div
                class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4"
              >
                <Icon icon="mdi-account-cash" class="text-info" size="20" />
                <div
                  class="absolute top-0 bottom-0 left-0 right-0 bg-info opacity-20"
                ></div>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">
                  {{ format.formatToken(balanceItem) }}
                </div>
                <div class="text-xs">
                  {{ format.calculatePercent(balanceItem.amount, totalAmount) }}
                </div>
              </div>
              <div
                class="text-xs truncate relative py-1 px-3 rounded-full w-fit text-primary dark:text-link mr-2"
              >
                <span
                  class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary dark:bg-[rgba(185,153,243,0.2)] text-sm"
                ></span>
                ${{ format.tokenValue(balanceItem) }}
              </div>
            </div>
            <!--delegations  -->
            <div
              class="flex items-center px-4 mb-2"
              v-for="(delegationItem, index) in delegations"
              :key="index"
            >
              <div
                class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4"
              >
                <Icon icon="mdi-user-clock" class="text-warning" size="20" />
                <div
                  class="absolute top-0 bottom-0 left-0 right-0 bg-warning opacity-20"
                ></div>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">
                  {{ format.formatToken2(delegationItem?.balance) }}
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
              <div
                class="text-xs truncate relative py-1 px-3 rounded-full w-fit text-primary dark:text-link mr-2"
              >
                <span
                  class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary dark:bg-[rgba(185,153,243,0.2)] text-sm"
                ></span>
                ${{ format.tokenValue(delegationItem?.balance) }}
              </div>
            </div>
            <!-- rewards.total -->
            <div
              class="flex items-center px-4 mb-2"
              v-for="(rewardItem, index) in rewards.total"
              :key="index"
            >
              <div
                class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4"
              >
                <Icon
                  icon="mdi-account-arrow-up"
                  class="text-success"
                  size="20"
                />
                <div
                  class="absolute top-0 bottom-0 left-0 right-0 bg-success opacity-20"
                ></div>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">
                  {{ format.formatToken2(rewardItem, 1e18) }}
                </div>
                <div class="text-xs">
                  {{ format.calculatePercent(rewardItem.amount, totalAmount) }}
                </div>
              </div>
              <div
                class="text-xs truncate relative py-1 px-3 rounded-full w-fit text-primary dark:text-link mr-2"
              >
                <span
                  class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary dark:bg-[rgba(185,153,243,0.2)] text-sm"
                ></span
                >${{ format.tokenValue(rewardItem, 1e18) }}
              </div>
            </div>
            <!-- mdi-account-arrow-right -->
            <div class="flex items-center px-4">
              <div
                class="w-9 h-9 rounded overflow-hidden flex items-center justify-center relative mr-4"
              >
                <Icon
                  icon="mdi-account-arrow-right"
                  class="text-error"
                  size="20"
                />
                <div
                  class="absolute top-0 bottom-0 left-0 right-0 bg-error opacity-20"
                ></div>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">
                  {{
                    format.formatToken2(
                      {
                        amount: String(unbondingTotal),
                        denom: stakingStore.params.bondDenom,
                      },
                      1e18
                    )
                  }}
                </div>
                <div class="text-xs">
                  {{ format.calculatePercent(unbondingTotal, totalAmount) }}
                </div>
              </div>
              <div
                class="text-xs truncate relative py-1 px-3 rounded-full w-fit text-primary dark:text-link mr-2"
              >
                <span
                  class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary dark:bg-[rgba(185,153,243,0.2)]"
                ></span>
                ${{
                  format.tokenValue(
                    {
                      amount: String(unbondingTotal),
                      denom: stakingStore.params.bondDenom,
                    },
                    1e18
                  )
                }}
              </div>
            </div>
          </div>
          <div
            class="mt-4 text-lg font-semibold mr-5 pl-5 border-t border-base-300 pt-4 text-right"
          >
            {{ $t('account.total_value') }}: ${{
              totalValue && !isNaN(Number(totalValue)) ? totalValue : 0
            }}
          </div>
        </div>
      </div>
    </div>

    <!-- Delegations -->
    <div
      class="m-4 md:m-6 mb-4 p-4 md:p-6 rounded-[16px] shadow bg-[#141416] border border-[#242627]"
    >
      <div class="flex justify-between">
        <h2 class="card-title mb-4 text-white">
          {{ $t('account.delegations') }}
        </h2>
        <div class="flex justify-end mb-4">
          <label
            for="delegate"
            class="btn btn-secondary-sm btn-sm mr-2"
            @click="dialog.open('delegate', {}, updateEvent)"
            >{{ $t('account.btn_delegate') }}</label
          >
          <label
            for="withdraw"
            class="btn btn-secondary-sm btn-sm"
            @click="dialog.open('withdraw', {}, updateEvent)"
            >{{ $t('account.btn_withdraw') }}</label
          >
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table w-full text-sm table-zebra">
          <thead>
            <tr>
              <th class="py-3">{{ $t('account.validator') }}</th>
              <th class="py-3">{{ $t('account.delegation') }}</th>
              <th class="py-3">{{ $t('account.rewards') }}</th>
              <th class="py-3">{{ $t('account.action') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="delegations.length === 0">
              <td colspan="10">
                <div class="text-center">
                  {{ $t('account.no_delegations') }}
                </div>
              </td>
            </tr>
            <tr v-for="(v, index) in delegations" :key="index">
              <td class="text-caption text-link py-3">
                <RouterLink
                  :to="`/${chain}/staking/${v.delegation.validatorAddress}`"
                  >{{
                    format.validatorFromBech32(v.delegation.validatorAddress) ||
                    v.delegation.validatorAddress
                  }}</RouterLink
                >
              </td>
              <td class="py-3">
                {{ format.formatToken(v.balance, true, '0,0.[000000]') }}
              </td>
              <td class="py-3">
                {{
                  format.formatTokens(
                    rewards?.rewards?.find(
                      (x) =>
                        x.validatorAddress === v.delegation.validatorAddress
                    )?.reward,
                    undefined,
                    undefined,
                    undefined,
                    1e18
                  )
                }}
              </td>
              <td class="py-3">
                <div v-if="v.balance" class="flex justify-end">
                  <label
                    for="delegate"
                    class="btn btn-secondary-sm btn-xs mr-2"
                    @click="
                      dialog.open(
                        'delegate',
                        {
                          validator_address: v.delegation.validatorAddress,
                        },
                        updateEvent
                      )
                    "
                    >{{ $t('account.btn_delegate') }}</label
                  >
                  <label
                    for="redelegate"
                    class="btn btn-secondary-sm btn-xs mr-2"
                    @click="
                      dialog.open(
                        'redelegate',
                        {
                          validator_address: v.delegation.validatorAddress,
                        },
                        updateEvent
                      )
                    "
                    >{{ $t('account.btn_redelegate') }}</label
                  >
                  <label
                    for="unbond"
                    class="btn btn-secondary-sm btn-xs"
                    @click="
                      dialog.open(
                        'unbond',
                        {
                          validator_address: v.delegation.validatorAddress,
                        },
                        updateEvent
                      )
                    "
                    >{{ $t('account.btn_unbond') }}</label
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Unbonding Delegations -->
    <div
      class="m-4 md:m-6 mb-4 p-4 md:p-6 rounded-[16px] shadow bg-[#141416] border border-[#242627]"
      v-if="unbonding && unbonding.length > 0"
    >
      <h2 class="card-title mb-4 text-white">
        {{ $t('account.unbonding_delegations') }}
      </h2>
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
              <td
                class="text-caption text-primary py-3 bg-slate-200"
                colspan="10"
              >
                <RouterLink :to="`/${chain}/staking/${v.validatorAddress}`">{{
                  v.validatorAddress
                }}</RouterLink>
              </td>
            </tr>
            <tr v-for="entry in v.entries">
              <td class="py-3">{{ entry.creationHeight }}</td>
              <td class="py-3">
                {{
                  format.formatToken(
                    {
                      amount: entry.initialBalance,
                      denom: stakingStore.params.bondDenom,
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
                      denom: stakingStore.params.bondDenom,
                    },
                    true,
                    '0,0.[00]',
                    undefined,
                    1e18
                  )
                }}
              </td>
              <td class="py-3">
                <Countdown
                  :time="
                    entry.completionTime &&
                    fromTimestamp(entry.completionTime).getTime() -
                      new Date().getTime()
                  "
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Transactions -->
    <div
      class="m-4 md:m-6 mb-4 p-4 md:p-6 rounded-[16px] shadow bg-[#141416] border border-[#242627]"
    >
      <h2 class="card-title mb-4 text-white">
        {{ $t('account.transactions') }}
      </h2>
      <div class="overflow-x-auto">
        <table class="table w-full text-sm">
          <thead>
            <tr>
              <th class="py-3">{{ $t('account.height') }}</th>
              <th class="py-3">{{ $t('account.hash') }}</th>
              <th class="py-3">{{ $t('account.messages') }}</th>
              <th class="py-3">{{ $t('account.time') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="txs.length === 0">
              <td colspan="10">
                <div class="text-center">
                  {{ $t('account.no_transactions') }}
                </div>
              </td>
            </tr>
            <tr v-for="(v, index) in txs" :key="index">
              <td class="text-sm py-3">
                <RouterLink
                  :to="`/${chain}/block/${v.height}`"
                  class="text-primary dark:text-link"
                  >{{ v.height }}</RouterLink
                >
              </td>
              <td class="truncate py-3" style="max-width: 200px">
                <RouterLink
                  :to="`/${chain}/tx/${toHex(v.hash)}`"
                  class="text-primary dark:text-link"
                >
                  {{ toHex(v.hash) }}
                </RouterLink>
              </td>
              <td class="flex items-center py-3">
                <div class="mr-2">
                  {{ format.messages(v.txRaw.body.messages) }}
                </div>
                <Icon
                  v-if="v.result.code === 0"
                  icon="mdi-check"
                  class="text-success text-lg"
                />
                <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
              </td>
              <td class="py-3">
                <span v-if="v.timestamp" class="text-xs"
                  >({{ format.toDay(v.timestamp, 'from') }})</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Received -->
    <div
      class="m-4 md:m-6 mb-4 p-4 md:p-6 rounded-[16px] shadow bg-[#141416] border border-[#242627]"
    >
      <h2 class="card-title mb-4 text-white">{{ $t('account.received') }}</h2>
      <div class="overflow-x-auto">
        <table class="table w-full text-sm">
          <thead>
            <tr>
              <th class="py-3">{{ $t('account.height') }}</th>
              <th class="py-3">{{ $t('account.hash') }}</th>
              <th class="py-3">{{ $t('account.amount') }}</th>
              <th class="py-3">{{ $t('account.time') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="recentReceived.length === 0">
              <td colspan="10">
                <div class="text-center">
                  {{ $t('account.no_transactions') }}
                </div>
              </td>
            </tr>
            <tr v-for="(v, index) in recentReceived" :key="index">
              <td class="text-sm py-3">
                <RouterLink
                  :to="`/${chain}/block/${v.height}`"
                  class="text-primary dark:text-link"
                  >{{ v.height }}</RouterLink
                >
              </td>
              <td class="truncate py-3" style="max-width: 200px">
                <RouterLink
                  :to="`/${chain}/tx/${toHex(v.hash)}`"
                  class="text-primary dark:text-link"
                >
                  {{ toHex(v.hash) }}
                </RouterLink>
              </td>
              <td class="flex items-center py-3">
                <div class="mr-2">
                  {{ mapAmount(v.result.events)?.join(', ') }}
                </div>
                <Icon
                  v-if="v.result.code === 0"
                  icon="mdi-check"
                  class="text-success text-lg"
                />
                <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
              </td>
              <td class="py-3">
                <span v-if="v.timestamp" class="text-xs"
                  >({{ format.toDay(v.timestamp, 'from') }})</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Account -->
    <div
      class="m-4 md:m-6 mb-4 p-4 md:p-6 rounded-[16px] shadow bg-[#141416] border border-[#242627]"
    >
      <h2 class="card-title mb-4 text-white">{{ $t('account.acc') }}</h2>
      <DynamicComponent :value="account" />
    </div>
  </div>
  <div v-else class="text-no text-sm">{{ $t('account.error') }}</div>
</template>
