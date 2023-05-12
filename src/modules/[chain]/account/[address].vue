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
import { Icon } from '@iconify/vue';
import 'vue-json-pretty/lib/styles.css';
import type {
  AuthAccount,
  Delegation,
  TxResponse,
  DelegatorRewards,
  UnbondingResponses,
} from '@/types';
import type { Coin } from '@cosmjs/amino';

const props = defineProps(['address', 'chain']);

const blockchain = useBlockchain();
const stakingStore = useStakingStore();
const dialog = useTxDialog();
const format = useFormatter();
const account = ref({} as AuthAccount);
const txs = ref({} as TxResponse[]);
const delegations = ref([] as Delegation[]);
const rewards = ref({} as DelegatorRewards);
const balances = ref([] as Coin[]);
const unbonding = ref([] as UnbondingResponses[]);
const unbondingTotal = ref(0);
const chart = {};

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
  });
  blockchain.rpc.getBankBalances(address).then((x) => {
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
}
loadAccount(props.address);
</script>
<template>
  <div v-if="account">
    <!-- address -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <div class="d-flex items-center">
        <!-- img -->
        <div class="inline-flex relative w-11 h-11 rounded-md">
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
        </div>
        <!-- content -->
        <div class="flex flex-1 flex-col truncate pl-4">
          <h2 class="text-sm card-title">Address:</h2>
          <span class="text-xs truncate"> {{ address }}</span>
        </div>
      </div>
    </div>

    <!-- Assets -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">Assets</h2>
      <div class="grid md:grid-cols-3">
        <div class="md:col-span-1">
          <DonutChart :series="totalAmountByCategory" :labels="labels" />
        </div>
        <div class="mt-4 md:col-span-2 md:mt-0 md:ml-4">
          <!-- button -->
          <div class="d-flex justify-end mb-4">
            <label
              for="send"
              class="btn btn-primary btn-sm mr-2"
              @click="dialog.open('send', {})"
              >Send</label
            >
            <label
              for="transfer"
              class="btn btn-primary btn-sm"
              @click="
                dialog.open('transfer', {
                  chain_name: blockchain.current?.prettyName,
                })
              "
              >transfer</label
            >
          </div>
          <!--  -->
          <div class="">
            <VListItem v-for="v in balances">
              <template #prepend>
                <VAvatar rounded variant="tonal" size="35" color="info">
                  <VIcon icon="mdi-account-cash" size="20" />
                </VAvatar>
              </template>
              <VListItemTitle class="text-sm font-weight-semibold">
                {{ format.formatToken(v) }}
              </VListItemTitle>
              <VListItemSubtitle class="text-xs"> ≈${{ 0 }} </VListItemSubtitle>
              <template #append>
                <div
                  class="text-xs truncate relative py-2 px-4 rounded-full w-fit text-primary mr-2"
                >
                  <span
                    class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary"
                  ></span>
                  {{ format.calculatePercent(v.amount, totalAmount) }}
                </div>
              </template>
            </VListItem>
            <VListItem v-for="v in delegations">
              <template #prepend>
                <VAvatar rounded variant="tonal" size="35" color="warning">
                  <VIcon icon="mdi-user-clock" size="20" />
                </VAvatar>
              </template>

              <VListItemTitle class="text-sm font-weight-semibold">
                {{ format.formatToken(v.balance) }}
              </VListItemTitle>
              <VListItemSubtitle class="text-xs"> ≈${{ 0 }} </VListItemSubtitle>
              <template #append>
                <div
                  class="text-xs truncate relative py-2 px-4 rounded-full w-fit text-primary mr-2"
                >
                  <span
                    class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary"
                  ></span>
                  {{ format.calculatePercent(v.balance.amount, totalAmount) }}
                </div>
              </template>
            </VListItem>
            <VListItem v-for="v in rewards.total">
              <template #prepend>
                <VAvatar rounded variant="tonal" size="35" color="success">
                  <VIcon icon="mdi-account-arrow-up" size="20" />
                </VAvatar>
              </template>

              <VListItemTitle class="text-sm font-weight-semibold">
                {{ format.formatToken(v) }}
              </VListItemTitle>
              <VListItemSubtitle class="text-xs"> ≈${{ 0 }} </VListItemSubtitle>
              <template #append>
                <div
                  class="text-xs truncate relative py-2 px-4 rounded-full w-fit text-primary mr-2"
                >
                  <span
                    class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary"
                  ></span>
                  {{ format.calculatePercent(v.amount, totalAmount) }}
                </div>
              </template>
            </VListItem>

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
                <div class="text-base font-semibold">
                  {{
                    format.formatToken({
                      amount: String(unbondingTotal),
                      denom: stakingStore.params.bond_denom,
                    })
                  }}
                </div>
                <div class="text-sm">≈${{ 0 }}</div>
              </div>
              <div
                class="text-xs truncate relative py-2 px-4 rounded-full w-fit text-primary mr-2"
              >
                <span
                  class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary"
                ></span>
                {{ format.calculatePercent(unbondingTotal, totalAmount) }}
              </div>
            </div>
          </div>

          <div class="divider"></div>
          {{ totalAmount }}
        </div>
      </div>
    </div>

    <VCard class="mt-5">
      <VCardTitle>Assets</VCardTitle>
      <VCardItem>
        <VRow>
          <VCol cols="12" md="4">
            <DonutChart :series="totalAmountByCategory" :labels="labels" />
          </VCol>
          <VCol cols="12" md="8">
            <VList class="card-list">
              <VListItem>
                <label
                  for="transfer"
                  class="btn btn-primary float-right btn-sm"
                  @click="
                    dialog.open('transfer', {
                      chain_name: blockchain.current?.prettyName,
                    })
                  "
                  >transfer</label
                >
                <label
                  for="send"
                  class="btn btn-primary float-right btn-sm"
                  @click="dialog.open('send', {})"
                  >Send</label
                >
              </VListItem>
              <VListItem v-for="v in balances">
                <template #prepend>
                  <VAvatar rounded variant="tonal" size="35" color="info">
                    <VIcon icon="mdi-account-cash" size="20" />
                  </VAvatar>
                </template>
                <VListItemTitle class="text-sm font-weight-semibold">
                  {{ format.formatToken(v) }}
                </VListItemTitle>
                <VListItemSubtitle class="text-xs">
                  ≈${{ 0 }}
                </VListItemSubtitle>
                <template #append>
                  <div
                    class="text-xs truncate relative py-2 px-4 rounded-full w-fit text-primary mr-2"
                  >
                    <span
                      class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary"
                    ></span>
                    {{ format.calculatePercent(v.amount, totalAmount) }}
                  </div>
                </template>
              </VListItem>
              <VListItem v-for="v in delegations">
                <template #prepend>
                  <VAvatar rounded variant="tonal" size="35" color="warning">
                    <VIcon icon="mdi-user-clock" size="20" />
                  </VAvatar>
                </template>

                <VListItemTitle class="text-sm font-weight-semibold">
                  {{ format.formatToken(v.balance) }}
                </VListItemTitle>
                <VListItemSubtitle class="text-xs">
                  ≈${{ 0 }}
                </VListItemSubtitle>
                <template #append>
                  <div
                    class="text-xs truncate relative py-2 px-4 rounded-full w-fit text-primary mr-2"
                  >
                    <span
                      class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary"
                    ></span>
                    {{ format.calculatePercent(v.balance.amount, totalAmount) }}
                  </div>
                </template>
              </VListItem>
              <VListItem v-for="v in rewards.total">
                <template #prepend>
                  <VAvatar rounded variant="tonal" size="35" color="success">
                    <VIcon icon="mdi-account-arrow-up" size="20" />
                  </VAvatar>
                </template>

                <VListItemTitle class="text-sm font-weight-semibold">
                  {{ format.formatToken(v) }}
                </VListItemTitle>
                <VListItemSubtitle class="text-xs">
                  ≈${{ 0 }}
                </VListItemSubtitle>
                <template #append>
                  <div
                    class="text-xs truncate relative py-2 px-4 rounded-full w-fit text-primary mr-2"
                  >
                    <span
                      class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary"
                    ></span>
                    {{ format.calculatePercent(v.amount, totalAmount) }}
                  </div>
                </template>
              </VListItem>

              <VListItem>
                <template #prepend>
                  <VAvatar rounded variant="tonal" size="35" color="error">
                    <VIcon icon="mdi-account-arrow-right" size="20" />
                  </VAvatar>
                </template>

                <VListItemTitle class="text-sm font-weight-semibold">
                  {{
                    format.formatToken({
                      amount: String(unbondingTotal),
                      denom: stakingStore.params.bond_denom,
                    })
                  }}
                </VListItemTitle>
                <VListItemSubtitle class="text-xs">
                  ≈${{ 0 }}
                </VListItemSubtitle>
                <template #append>
                  <div
                    class="text-xs truncate relative py-2 px-4 rounded-full w-fit text-primary mr-2"
                  >
                    <span
                      class="inset-x-0 inset-y-0 opacity-10 absolute bg-primary"
                    ></span>
                    {{ format.calculatePercent(unbondingTotal, totalAmount) }}
                  </div>
                </template>
              </VListItem>
            </VList>
            <VDivider class="my-2"></VDivider>
            {{ totalAmount }}
          </VCol>
        </VRow>
      </VCardItem>
    </VCard>

    <!-- Delegations -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">Delegations</h2>
      <div class="d-flex justify-end mb-4">
        <label
          for="delegate"
          class="btn btn-primary btn-sm mr-2"
          @click="dialog.open('delegate', {})"
          >Delegate</label
        >
        <label
          for="withdraw"
          class="btn btn-primary btn-sm"
          @click="dialog.open('withdraw', {})"
          >Withdraw</label
        >
      </div>
      <div class="overdflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th style="position: relative">Validator</th>
              <th>Delegation</th>
              <th>Rewards</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="v in delegations">
              <td class="text-caption text-primary">
                <RouterLink
                  :to="`/${chain}/staking/${v.delegation.validator_address}`"
                  >{{
                    format.validatorFromBech32(v.delegation.validator_address)
                  }}</RouterLink
                >
              </td>
              <td>{{ format.formatToken(v.balance, true, '0,0.[00]') }}</td>
              <td>
                {{
                  format.formatTokens(
                    rewards?.rewards?.find(
                      (x) =>
                        x.validator_address === v.delegation.validator_address
                    )?.reward
                  )
                }}
              </td>
              <td>
                <div class="d-flex justify-end">
                  <label
                    for="delegate"
                    class="btn btn-primary btn-sm mr-2"
                    @click="
                      dialog.open('delegate', {
                        validator_address: v.delegation.validator_address,
                      })
                    "
                    >delegate</label
                  >
                  <label
                    for="redelegate"
                    class="btn btn-primary btn-sm mr-2"
                    @click="
                      dialog.open('redelegate', {
                        validator_address: v.delegation.validator_address,
                      })
                    "
                    >Redelegate</label
                  >
                  <label
                    for="unbond"
                    class="btn btn-primary btn-sm"
                    @click="
                      dialog.open('unbond', {
                        validator_address: v.delegation.validator_address,
                      })
                    "
                    >Unbond</label
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
      class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow"
      v-if="unbonding && unbonding.length > 0"
    >
      <h2 class="card-title mb-4">Unbonding Delegations</h2>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th style="position: relative">Creation Height</th>
              <th>Initial Balance</th>
              <th>Balance</th>
              <th>Completion Time</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <div v-for="v in unbonding">
              <tr>
                <td class="text-caption text-primary">
                  <RouterLink
                    :to="`/${chain}/staking/${v.validator_address}`"
                    >{{
                      format.validatorFromBech32(v.validator_address)
                    }}</RouterLink
                  >
                </td>
              </tr>
              <tr v-for="entry in v.entries">
                <td>{{ entry.creation_height }}</td>
                <td>
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
                <td>
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
                <td>{{ format.toDay(entry.completion_time, 'to') }}</td>
              </tr>
            </div>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Transactions -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">Transactions</h2>
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th style="position: relative">Height</th>
              <th>Hash</th>
              <th>Messages</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="v in txs">
              <td class="text-sm text-primary">
                <RouterLink :to="`/${chain}/block/${v.height}`">{{
                  v.height
                }}</RouterLink>
              </td>
              <td class="text-truncate" style="max-width: 200px">
                {{ v.txhash }}
              </td>
              <td>
                {{ format.messages(v.tx.body.messages) }}
                <VIcon
                  v-if="v.code === 0"
                  icon="mdi-check"
                  color="success"
                ></VIcon>
                <VIcon v-else icon="mdi-multiply" color="error"></VIcon>
              </td>
              <td>{{ format.toDay(v.timestamp, 'from') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Account -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">Account</h2>
      <DynamicComponent :value="account" />
    </div>
  </div>
  <div v-else>Account does not exists on chain</div>
</template>
<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 5px;
}
</style>
