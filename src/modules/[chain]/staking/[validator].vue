<script setup lang="ts">
import {
  useBankStore,
  useBlockchain,
  useFormatter,
  useMintStore,
  useStakingStore,
  useTxDialog,
} from '@/stores';
import { onMounted, computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import ValidatorCommissionRate from '@/components/ValidatorCommissionRate.vue';
import {
  consensusPubkeyToHexAddress,
  operatorAddressToAccount,
  pubKeyToValcons,
  valoperToPrefix,
} from '@/libs';
import type { Coin, Delegation, PaginatedTxs, Validator } from '@/types';

const props = defineProps(['validator', 'chain']);

const staking = useStakingStore();
const blockchain = useBlockchain();
const format = useFormatter();
const dialog = useTxDialog();

const validator: string = props.validator;

const v = ref({} as Validator);
const cache = JSON.parse(localStorage.getItem('avatars') || '{}');
const avatars = ref(cache || {});
const identity = ref('');
const rewards = ref([] as Coin[] | undefined);
const commission = ref([] as Coin[] | undefined);
const addresses = ref(
  {} as {
    account: string;
    operAddress: string;
    hex: string;
    valCons: string;
  }
);
const selfBonded = ref({} as Delegation);

addresses.value.account = operatorAddressToAccount(validator);
// load self bond
staking
  .fetchValidatorDelegation(validator, addresses.value.account)
  .then((x) => {
    if (x) {
      selfBonded.value = x.delegation_response;
    }
  });

const txs = ref({} as PaginatedTxs);

blockchain.rpc.getTxsBySender(addresses.value.account).then((x) => {
  console.log('txs', x);
  txs.value = x;
});

const apr = computed(() => {
  const rate = v.value.commission?.commission_rates.rate || 0;
  const inflation = useMintStore().inflation;
  if (Number(inflation)) {
    return format.percent((1 - Number(rate)) * Number(inflation));
  }
  return '-';
});

const selfRate = computed(() => {
  if (selfBonded.value.balance?.amount) {
    return format.calculatePercent(
      selfBonded.value.balance.amount,
      v.value.tokens
    );
  }
  return '-';
});

onMounted(() => {
  if (validator) {
    staking.fetchValidator(validator).then((res) => {
      v.value = res.validator;
      identity.value = res.validator?.description?.identity || '';
      if (identity.value && !avatars.value[identity.value]) {
        console.log(identity.value, avatars);
        staking.keybase(identity.value).then((d) => {
          if (Array.isArray(d.them) && d.them.length > 0) {
            const uri = String(d.them[0]?.pictures?.primary?.url).replace(
              'https://s3.amazonaws.com/keybase_processed_uploads/',
              ''
            );
            if (uri) {
              avatars.value[identity.value] = uri;
              localStorage.setItem('avatars', JSON.stringify(avatars.value));
            }
          }
        });
      }
      const prefix = valoperToPrefix(v.value.operator_address) || '<Invalid>';
      addresses.value.hex = consensusPubkeyToHexAddress(
        v.value.consensus_pubkey
      );
      addresses.value.valCons = pubKeyToValcons(
        v.value.consensus_pubkey,
        prefix
      );
    });
    blockchain.rpc
      .getDistributionValidatorOutstandingRewards(validator)
      .then((res) => {
        rewards.value = res.rewards?.rewards?.sort(
          (a, b) => Number(b.amount) - Number(a.amount)
        );
        res.rewards?.rewards?.forEach((x) => {
          if (x.denom.startsWith('ibc/')) {
            format.fetchDenomTrace(x.denom);
          }
        });
      });
    blockchain.rpc.getDistributionValidatorCommission(validator).then((res) => {
      commission.value = res.commission?.commission?.sort(
        (a, b) => Number(b.amount) - Number(a.amount)
      );
      res.commission?.commission?.forEach((x) => {
        if (x.denom.startsWith('ibc/')) {
          format.fetchDenomTrace(x.denom);
        }
      });
    });
  }
});
</script>
<template>
  <div>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow border-indigo-500">
      <div class="flex flex-col lg:flex-row">
        <div class="flex-1">
          <div class="flex">
            <div class="avatar mr-4 relative w-24 rounded-lg overflow-hidden">
              <div class="w-24 rounded-lg absolute opacity-10"></div>
              <div class="w-24 rounded-lg">
                <img
                  v-if="avatars[identity] !== 'undefined'"
                  v-lazy="
                    `https://s3.amazonaws.com/keybase_processed_uploads/${avatars[identity]}`
                  "
                  class="object-contain"
                />
                <Icon
                  v-else
                  class="text-4xl"
                  :icon="`mdi-help-circle-outline`"
                />
              </div>
            </div>
            <div class="mx-2">
              <h4>{{ v.description?.moniker }}</h4>
              <div class="text-sm mb-2">
                {{ v.description?.identity || '-' }}
              </div>
              <label
                for="delegate"
                class="btn btn-primary btn-sm w-full"
                @click="
                  dialog.open('delegate', {
                    validator_address: v.operator_address,
                  })
                "
                >Delegate</label
              >
            </div>
          </div>
          <div class="m-4 text-sm">
            <p class="text-md">About Us</p>
            <VList class="card-list">
              <VListItem prepend-icon="mdi-web">
                <span>Website: </span
                ><span> {{ v.description?.website || '-' }}</span>
              </VListItem>
              <VListItem prepend-icon="mdi-email-outline">
                <span>Contact: </span
                ><span> {{ v.description?.security_contact }}</span>
              </VListItem>
            </VList>
            <p class="text-md mt-3">Validator Status</p>
            <VList class="card-list">
              <VListItem prepend-icon="mdi-shield-account-outline">
                <span>Status: </span
                ><span>
                  {{ String(v.status).replace('BOND_STATUS_', '') }}
                </span>
              </VListItem>
              <VListItem prepend-icon="mdi-shield-alert-outline">
                <span>Jailed: </span><span> {{ v.jailed || '-' }} </span>
              </VListItem>
            </VList>
          </div>
        </div>
        <div class="flex-1">
          <div class="d-flex flex-column py-3 justify-space-between">
            <div class="d-flex">
              <VAvatar
                color="secondary"
                rounded
                variant="outlined"
                icon="mdi-coin"
              ></VAvatar>
              <div class="ml-3 d-flex flex-column justify-center">
                <h4>
                  {{
                    format.formatToken2({
                      amount: v.tokens,
                      denom: staking.params.bond_denom,
                    })
                  }}
                </h4>
                <span class="text-sm">Total Bonded Tokens</span>
              </div>
            </div>
            <div class="d-flex">
              <VAvatar
                color="secondary"
                rounded
                variant="outlined"
                icon="mdi-percent"
              ></VAvatar>
              <div class="ml-3 d-flex flex-column justify-center">
                <h4>
                  {{ format.formatToken(selfBonded.balance) }} ({{ selfRate }})
                </h4>
                <span class="text-sm">Self Bonded</span>
              </div>
            </div>

            <div class="d-flex">
              <VAvatar
                color="secondary"
                rounded
                variant="outlined"
                icon="mdi-account-tie"
              ></VAvatar>
              <div class="ml-3 d-flex flex-column justify-center">
                <h4>
                  {{ v.min_self_delegation }} {{ staking.params.bond_denom }}
                </h4>
                <span class="text-sm">Min Self Delegation:</span>
              </div>
            </div>
            <div class="d-flex">
              <VAvatar
                color="secondary"
                rounded
                variant="outlined"
                icon="mdi-finance"
              ></VAvatar>
              <div class="ml-3 d-flex flex-column justify-center">
                <h4>{{ apr }}</h4>
                <span class="text-sm">Annual Profit</span>
              </div>
            </div>

            <div class="d-flex">
              <VAvatar
                color="secondary"
                rounded
                variant="outlined"
                icon="mdi-stairs-up"
              ></VAvatar>
              <div class="ml-3 d-flex flex-column justify-center">
                <h4>{{ v.unbonding_height }}</h4>
                <span class="text-sm">Unbonding Height</span>
              </div>
            </div>

            <div class="d-flex">
              <VAvatar
                color="secondary"
                rounded
                variant="outlined"
                icon="mdi-clock"
              ></VAvatar>
              <div class="ml-3 d-flex flex-column justify-center">
                <h4>{{ format.toDay(v.unbonding_time, 'from') }}</h4>
                <span class="text-sm">Unbonding Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="text-sm px-4">{{ v.description?.details }}</div>
    </div>

    <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="h-100">
        <ValidatorCommissionRate
          :commission="v.commission"
        ></ValidatorCommissionRate>
      </div>
      <div>
        <div class="h-100 bg-base-100 rounded shadow">
          <div class="text-lg font-semibold text-main px-4 pt-4">
            Commissions & Rewards
          </div>
          <div class="px-4 mt-1">
            <div class="overflow-auto" style="max-height: 280px">
              <div class="text-sm mb-2">Commissions</div>
              <div
                v-for="(i, k) in commission"
                :key="`reward-${k}`"
                color="info"
                label
                variant="outlined"
                class="mr-1 mb-1 badge text-xs"
              >
                {{ format.formatToken2(i) }}
              </div>
              <div class="text-sm mb-2 mt-2">Outstanding Rewards</div>
              <div
                v-for="(i, k) in rewards"
                :key="`reward-${k}`"
                class="mr-1 mb-1 badge text-xs"
              >
                {{ format.formatToken2(i) }}
              </div>
            </div>
            <label
              for="withdraw_commission"
              class="btn btn-primary mt-4 w-full btn-sm"
              @click="
                dialog.open('withdraw_commission', {
                  validator_address: v.operator_address,
                })
              "
              >Withdraw</label
            >
          </div>
        </div>
      </div>
      <div>
        <div class="h-100 bg-base-100 rounded shadow">
          <div class="px-4 pt-4 mb-2 text-main font-lg font-semibold">
            Addresses
          </div>
          <div class="px-4">
            <div class="mb-3">
              <div class="text-sm">Account</div>
              <RouterLink
                class="text-xs text-primary"
                :to="`/${chain}/account/${addresses.account}`"
              >
                {{ addresses.account }}
              </RouterLink>
            </div>
            <div class="mb-3">
              <div class="text-sm">Operator Address</div>
              <div class="text-xs">
                {{ v.operator_address }}
              </div>
            </div>
            <div class="mb-3">
              <div class="text-sm">Hex Address</div>
              <div class="text-xs">{{ addresses.hex }}</div>
            </div>
            <div>
              <div class="text-sm">Signer Address</div>
              <div class="text-xs">{{ addresses.valCons }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 bg-base-100 shadow rounded p-4">
      <div class="text-lg mb-4 font-semibold">Transactions</div>
      <div class="rounded overflow-auto">
        <table class="table validatore-table w-full">
          <thead>
            <th class="text-left pl-4" style="position: relative; z-index: 2">
              Height
            </th>
            <th class="text-left pl-4">Hash</th>
            <th class="text-left pl-4" width="40%">Messages</th>
            <th class="text-left pl-4">Time</th>
          </thead>
          <tbody>
            <tr v-for="(item, i) in txs.tx_responses">
              <td class="text-sm text-primary">
                <RouterLink :to="`/${props.chain}/block/${item.height}`">{{
                  item.height
                }}</RouterLink>
              </td>
              <td class="text-truncate" style="max-width: 200px">
                {{ item.txhash }}
              </td>
              <td>
                <div class="flex items-center">
                  <span class="mr-2">{{
                    format.messages(item.tx.body.messages)
                  }}</span>
                  <Icon
                    v-if="item.code === 0"
                    icon="mdi-check"
                    class="text-yes"
                  />
                  <Icon v-else icon="mdi-multiply" class="text-no" />
                </div>
              </td>
              <td width="150">{{ format.toDay(item.timestamp, 'from') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
.validatore-table.table :where(th, td) {
  padding: 0.6rem 1rem;
  font-size: 14px;
}
</style>
