<script lang="ts" setup>
import { useBlockchain, useFormatter, useStakingStore, useTxDialog } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import DonutChart from '@/components/charts/DonutChart.vue';
import { computed, ref } from '@vue/reactivity';
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
    <VCard>
      <VList>
        <VListItem>
          <template #prepend>
            <VAvatar rounded variant="tonal" size="45" color="primary">
              <VIcon icon="mdi-qrcode" />
            </VAvatar>
          </template>

          <VListItemTitle class="text-sm font-weight-semibold">
            Address:
          </VListItemTitle>
          <VListItemSubtitle class="text-xs">
            {{ address }}
          </VListItemSubtitle>
        </VListItem>
      </VList>
    </VCard>

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
                <label for="transfer" class="btn btn-primary float-right btn-sm" @click="dialog.open('transfer', {chain_name: blockchain.current?.prettyName})">transfer</label>
                <label for="send" class="btn btn-primary float-right btn-sm" @click="dialog.open('send', {})">Send</label>
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
                  <VChip color="primary">{{
                    format.calculatePercent(v.amount, totalAmount)
                  }}</VChip>
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
                  <VChip color="primary">{{
                    format.calculatePercent(v.balance.amount, totalAmount)
                  }}</VChip>
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
                  <VChip color="primary">{{
                    format.calculatePercent(v.amount, totalAmount)
                  }}</VChip>
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
                  <VChip color="primary">{{
                    format.calculatePercent(unbondingTotal, totalAmount)
                  }}</VChip>
                </template>
              </VListItem>
            </VList>
            <VDivider class="my-2"></VDivider>
            {{ totalAmount }}
          </VCol>
        </VRow>
      </VCardItem>
    </VCard>

    <VCard class="my-5">
      <VCardItem>
        <VCardTitle>
          Delegations
          <div>
            <label for="delegate" class="btn btn-primary float-right btn-sm" @click="dialog.open('delegate', {})">Delegate</label>
            <label for="withdraw" class="btn btn-primary float-right btn-sm" @click="dialog.open('withdraw', {})">Withdraw</label>
          </div>
        </VCardTitle>
        <VTable>
          <thead>
            <tr>
              <th>Validator</th>
              <th>Delegation</th>
              <th>Rewards</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
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
                <label for="delegate" class="btn btn-primary float-right btn-sm" @click="dialog.open('delegate', {validator_address: v.delegation.validator_address})">delegate</label>
                <label for="redelegate" class="btn btn-primary float-right btn-sm" @click="dialog.open('redelegate', {validator_address: v.delegation.validator_address})">Redelegate</label>
                <label for="unbond" class="btn btn-primary float-right btn-sm" @click="dialog.open('unbond', {validator_address: v.delegation.validator_address})">Unbond</label>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardItem>
    </VCard>
    <VCard class="my-5" v-if="unbonding && unbonding.length > 0">
      <VCardItem>
        <VCardTitle>Unbonding Delegations</VCardTitle>
        <VTable>
          <thead>
            <tr>
              <th>Creation Height</th>
              <th>Initial Balance</th>
              <th>Balance</th>
              <th>Completion Time</th>
            </tr>
          </thead>
          <tbody>
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
        </VTable>
      </VCardItem>
    </VCard>
    <VCard class="my-5">
      <VCardItem>
        <VCardTitle>Transactions</VCardTitle>
        <VTable>
          <thead>
            <tr>
              <th>Height</th>
              <th>Hash</th>
              <th>Messages</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
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
        </VTable>
      </VCardItem>
    </VCard>
    <VCard>
      <VCardItem>
        <VCardTitle>Account</VCardTitle>
        <DynamicComponent :value="account" />
      </VCardItem>
    </VCard>
  </div>
  <div v-else>Account does not exists on chain</div>
</template>
<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 5px;
}
</style>
