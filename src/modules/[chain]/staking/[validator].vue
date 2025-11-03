<script setup lang="ts">
import { parseCoins } from '@cosmjs/stargate';
import {
  useBlockchain,
  useFormatter,
  useMintStore,
  useStakingStore,
  useTxDialog,
} from '@/stores';
import { onMounted, computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import CommissionRate from '@/components/ValidatorCommissionRate.vue';
import {
  consensusPubkeyToHexAddress,
  operatorAddressToAccount,
  pubKeyToValcons,
} from '@/libs';
import { PageRequest, type Coin, type Delegation, type PaginatedDelegations, type PaginatedTxs, type Validator } from '@/types';
import PaginationBar from '@/components/PaginationBar.vue';
import { fromBase64, toBase64 } from '@cosmjs/encoding';
import { stringToUint8Array, uint8ArrayToString } from '@/libs/utils';

const props = defineProps(['validator', 'chain']);

const staking = useStakingStore();
const blockchain = useBlockchain();
const format = useFormatter();
const dialog = useTxDialog();
const page = new PageRequest();

const validator: string = props.validator;

const v = ref({} as Validator);
const cache = JSON.parse(localStorage.getItem('avatars') || '{}');
const avatars = ref(cache || {});
const identity = ref('');
const rewards = ref([] as Coin[] | undefined);
const commission = ref([] as Coin[] | undefined);
const delegations = ref({} as PaginatedDelegations)
const delegationsPage = ref(1)
const eventsPage = ref(1)
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

const logo = (identity?: string) => {
  if (!identity) return '';
  const url = avatars.value[identity] || '';
  return url.startsWith('http')
    ? url
    : `https://s3.amazonaws.com/keybase_processed_uploads/${url}`;
};

const fetchAvatar = (identity: string) => {
  // fetch avatar from keybase
  return new Promise<void>((resolve) => {
    staking
      .keybase(identity)
      .then((d) => {
        if (Array.isArray(d.them) && d.them.length > 0) {
          const uri = String(d.them[0]?.pictures?.primary?.url).replace(
            'https://s3.amazonaws.com/keybase_processed_uploads/',
            ''
          );

          avatars.value[identity] = uri;
          resolve();
        } else throw new Error(`failed to fetch avatar for ${identity}.`);
      })
      .catch((error) => {
        // console.error(error); // uncomment this if you want the user to see if the avatar failed to load.
        resolve();
      });
  });
};

const loadAvatar = (identity: string) => {
  // fetches avatar from keybase and stores it in localStorage
  fetchAvatar(identity).then(() => {
    localStorage.setItem('avatars', JSON.stringify(avatars.value));
  });
};

onMounted(() => {
  if (validator) {
    staking.fetchValidator(validator).then((res) => {
      v.value = res.validator;
      identity.value = res.validator?.description?.identity || '';
      if (identity.value && !avatars.value[identity.value]) loadAvatar(identity.value);

      addresses.value.hex = consensusPubkeyToHexAddress(
        v.value.consensus_pubkey
      );
      addresses.value.valCons = pubKeyToValcons(
        v.value.consensus_pubkey,
        blockchain.current?.bech32ConsensusPrefix || "",
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

    // Disable delegations due to its bad performance
    // Comment out the following code if you want to enable it
    pageload(1)

  }
});
let showCopyToast = ref(0);
const copyWebsite = async (url: string) => {
  if (!url) {
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    showCopyToast.value = 1;
    setTimeout(() => {
      showCopyToast.value = 0;
    }, 1000);
  } catch (err) {
    showCopyToast.value = 2;
    setTimeout(() => {
      showCopyToast.value = 0;
    }, 1000);
  }
};
const tipMsg = computed(() => {
  return showCopyToast.value === 2
    ? { class: 'error', msg: 'Copy Error!' }
    : { class: 'success', msg: 'Copy Success!' };
});

function pageload(p: number) {
  page.setPage(p);
  page.limit = 6;
  delegationsPage.value = p;

  blockchain.rpc.getStakingValidatorsDelegations(validator, page).then(res => {
    delegations.value = res
  })
}

const events = ref({} as PaginatedTxs)

enum EventType {
  Delegate = 'delegate',
  Unbond = 'unbond',
}

const selectedEventType = ref(EventType.Delegate)

function loadPowerEvents(p: number, type: EventType) {
  selectedEventType.value = type
  page.setPage(p);
  page.setPageSize(5);
  blockchain.rpc.getTxs("?order_by=2&query={type}.validator='{validator}'", { type: selectedEventType.value, validator }, page).then(res => {
    events.value = res
  })
  eventsPage.value = p
}

function pagePowerEvents(page: number) {
  loadPowerEvents(page, selectedEventType.value)
}

pagePowerEvents(1)

const totalDelegationsPages = computed(() => {
  const total = Number(delegations.value.pagination?.total || 0)
  return total > 0 ? Math.ceil(total / 6) : 0
})
const totalEventsPages = computed(() => {
  const total = Number(events.value.pagination?.total || 0)
  return total > 0 ? Math.ceil(total / 6) : 0
})

function goToFirstDelegations() { if (delegationsPage.value !== 1) pageload(1) }
function goToLastDelegations() { if (delegationsPage.value !== totalDelegationsPages.value) pageload(totalDelegationsPages.value) }
function prevDelegations() { if (delegationsPage.value > 1) pageload(delegationsPage.value - 1) }
function nextDelegations() { if (delegationsPage.value < totalDelegationsPages.value) pageload(delegationsPage.value + 1) }

function goToFirstEvents() { if (eventsPage.value !== 1) pagePowerEvents(1) }
function goToLastEvents() { if (eventsPage.value !== totalEventsPages.value) pagePowerEvents(totalEventsPages.value) }
function prevEvents() { if (eventsPage.value > 1) pagePowerEvents(eventsPage.value - 1) }
function nextEvents() { if (eventsPage.value < totalEventsPages.value) pagePowerEvents(eventsPage.value + 1) }

function mapEvents(events: { type: string, attributes: { key: string, value: string }[] }[]) {
  const attributes = events
    .filter(x => x.type === selectedEventType.value)
    .filter(x => x.attributes.findIndex(attr => attr.value === validator || attr.value === toBase64(stringToUint8Array(validator))) > -1)
    .map(x => {
      // check if attributes need to decode
      const output = {} as { [key: string]: string }

      if (x.attributes.findIndex(a => a.key === `amount`) > -1) {
        x.attributes.forEach(attr => {
          output[attr.key] = attr.value
        })
      } else {
        x.attributes.forEach(attr => {
          output[uint8ArrayToString(fromBase64(attr.key))] = uint8ArrayToString(fromBase64(attr.value))
        })
      };

      return output;
    });

  const coinsAsString = attributes.map((x: any) => x.amount).join(',');
  const coins = parseCoins(coinsAsString);

  return coins.map(coin => format.formatToken(coin)).join(', ');
}

function mapDelegators(messages: any[]) {
  if (!messages) return []
  return Array.from(new Set(messages.map(x => x.delegator_address || x.grantee)))
}

function getSignerAddress(message: any, item?: any): string {
  // First try different address fields in the message
  if (message && message.delegator_address) {
    return message.delegator_address;
  } else if (message && message.from_address) {
    return message.from_address;
  } else if (message && message.sender) {
    return message.sender;
  }
  
  // If not found in message, check tx events
  if (item && item.events) {
    // Look for sender in message events
    const messageEvents = item.events.filter((event: any) => event.type === 'message');
    for (const event of messageEvents) {
      const senderAttr = event.attributes.find((attr: any) => attr.key === 'sender');
      if (senderAttr && senderAttr.value) {
        return senderAttr.value;
      }
    }
    
    // Look in tx events (fee_payer is typically the signer)
    const txEvents = item.events.filter((event: any) => event.type === 'tx');
    for (const event of txEvents) {
      const feePayerAttr = event.attributes.find((attr: any) => attr.key === 'fee_payer');
      if (feePayerAttr && feePayerAttr.value) {
        return feePayerAttr.value;
      }
    }
  }
  
  return '-';
}

function getTransactionAmount(message: any): string {
  // Check for different amount formats
  if (message && message.value) {
    return format.formatToken(message.value);
  } else if (message && message.amount) {
    return format.formatToken(message.amount);
  } else if (message && message.token) {
    return format.formatToken(message.token);
  } else if (message && message.amount?.length) {
    return format.formatTokens(message.amount);
  }
  
  // If amount isn't in message, check events
  return '-';
}

function getTransactionFee(tx: any): string {
  if (tx?.auth_info?.fee?.amount && tx.auth_info.fee.amount.length > 0) {
    return format.formatTokens(tx.auth_info.fee.amount);
  }
  
  // Check if fee is in gas_wanted (with a default gas price)
  if (tx?.auth_info?.fee?.gas_limit) {
    const gasLimit = parseInt(tx.auth_info.fee.gas_limit);
    if (!isNaN(gasLimit) && gasLimit > 0) {
      // This is a fallback - using a simple calculation if actual fee amount is not available
      return `~${format.formatNumber(gasLimit / 1000000)} ${staking.params.bond_denom || ""}`;
    }
  }
  
  return '-';
}
</script>
<template>
  <div>
    <!-- Updated Validator Header Card -->
    <div class="dark:bg-base-100 bg-[#09279F] rounded-xl space-x-10 p-4 flex items-center mt-4 mb-4">
      <!-- Validator Header with Avatar and Basic Info -->
      <img
                  v-if="v.description?.identity && avatars[v.description.identity] !== 'undefined'"
                  v-lazy="logo(v.description?.identity)"
                  class="object-contain w-16 h-16 rounded-lg"
                  @error="
                    (e) => {
                      loadAvatar(v.description?.identity);
                    }
                  "
                />
                <Icon
                  v-else
                  class="text-4xl"
                  :icon="`mdi-help-circle-outline`"
                />
        <div>
          <h2 class="text-2xl font-bold text-[#FFFFFF]">{{ v.description?.moniker }}</h2>
        </div>

      <!-- Validator Details -->
        <p class="text-sm dark:text-gray-200 text-[#FFFFFF]">{{ v.description?.details }}</p>
    </div>

    <!-- Validator Stats Grid -->
    <div class="grid grid-cols-1 md:!grid-cols-3 gap-4 my-4">
      <!-- Total Bonded Card -->
      <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 dark:bg-base-200 bg-[#5E9AE4] rounded-lg flex items-center justify-center mr-4">
            <Icon icon="mdi-coin" class="text-3xl dark:text-primary text-[#FFFFFF]" />
          </div>
          <div>
            <div class="text-sm font-semibold dark:text-main text-[#64748B]">{{ $t('staking.total_bonded') }}</div>
            <div class="text-3xl font-bold mt-2">{{format.formatToken({amount: v.tokens, denom: selfBonded.balance?.denom, }) }}</div>
          </div>
        </div>
      </div>

      <!-- Self Bonded Card -->
      <div class="dark:bg-base-100 bg-base-200 rounded-xl p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 dark:bg-base-200 bg-[#5E9AE4] rounded-lg flex items-center justify-center mr-4">
            <Icon icon="mdi-percent" class="text-3xl dark:text-primary text-[#FFFFFF]" />
          </div>
          <div>
            <div class="text-sm font-semibold dark:text-main text-[#64748B]">{{ $t('staking.self_bonded') }}</div>
            <div class="text-2xl font-bold mt-2">{{ format.formatToken(selfBonded.balance) }}<span class="text-sm font-normal text-gray-500 ml-1">({{ selfRate }})</span></div>
          </div>
        </div>
      </div>

      <!-- Annual Profit Card -->
      <div class="dark:bg-base-100 bg-base-200 rounded-2xl p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 dark:bg-base-200 bg-[#5E9AE4] rounded-lg flex items-center justify-center mr-4">
            <Icon icon="mdi-finance" class="text-3xl dark:text-success text-[#ffffff]" />
          </div>
          <div>
            <div class="text-sm font-semibold dark:text-main text-[#64748B]">{{ $t('staking.annual_profit') }}</div>
            <div class="text-3xl font-bold mt-2 dark:text-success text-[#171C1F]">{{ apr }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Information Section -->
    <div class="grid grid-cols-1 md:!grid-cols-2 gap-4 my-4">
      <!-- About and Status Information -->
      <div class="bg-base-100 rounded-xl p-4">
        <!-- Validator Status -->
        <div class="text-2xl font-semibold text-main mb-2 mt-4">{{ $t('staking.validator_status') }}</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-base-200 rounded-xl p-3 flex flex-col items-center justify-center gap-4 pb-8">
            <div class="text-sm dark:text-gray-500 text-[#64748B]">{{ $t('staking.status') }}</div>
            <!-- Status pill -->
            <div class="badge text-[#60BC29]" :class="{
              'dark:bg-success bg-[#6AC13633]': v.status === 'BOND_STATUS_BONDED',
              'dark:bg-warning bg-[#6AC13633]': v.status === 'BOND_STATUS_UNBONDED',
              'bg-error': v.status === 'BOND_STATUS_UNBONDING'
            }">
              {{ String(v.status).replace('BOND_STATUS_', '').replace('BONDED', 'Staked').replace('UNBONDING', 'Unstaking').replace('UNBONDED', 'Unstaked') }}
            </div>
            <!-- <div class="text-xl font-bold">
              {{ String(v.status).replace('BOND_STATUS_', '').replace('BONDED', 'STAKED').replace('UNBONDING', 'UNSTAKING').replace('UNBONDED', 'UNSTAKED') }}
            </div> -->
          </div>

          <div class="bg-base-200 rounded-xl p-3 flex flex-col items-center justify-center gap-4 pb-8">
            <div class="text-sm text-[#64748B]">{{ $t('staking.jailed') }}</div>
            <div class="text-xl font-bold">
              {{ v.jailed || '-' }}
            </div>
          </div>

          <div class="bg-base-200 rounded-xl p-3 flex flex-col items-center justify-center gap-4 pb-8">
            <div class="text-sm text-[#64748B]">{{ $t('staking.min_self') }}</div>
            <div class="text-xl font-bold">
              {{ v.min_self_delegation }} {{ staking.params.bond_denom }}
            </div>
          </div>

          <div class="bg-base-200 rounded-xl p-3 flex flex-col items-center justify-center gap-4 pb-8">
            <div class="text-sm text-[#64748B]">{{ $t('staking.unbonding_height') }}</div>
            <div class="text-xl font-bold">
              {{ v.unbonding_height || '-' }}
            </div>
          </div>

          <div class="bg-base-200 rounded-xl p-3 flex flex-col items-center justify-center gap-4 pb-8">
            <div class="text-sm text-[#64748B]">{{ $t('staking.unbonding_time') }}</div>
            <div class="text-xl font-bold">
              <template v-if="v.unbonding_time && !v.unbonding_time.startsWith('1970')">
                {{ format.toDay(v.unbonding_time, 'from') }}
              </template>
              <template v-else>-</template>
            </div>
          </div>
        </div>

        <!-- Liquid Staking Section -->
        <!-- <div class="text-2xl font-semibold text-main mb-4 mt-8">{{ $t('staking.liquid_staking') }}</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-base-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-6 pb-10">
            <div class="text-xs text-gray-500 text-[#64748B;]">{{ $t('staking.validator_bond_share') }}</div>
            <div class="text-2xl font-bold">
              {{ format.formatToken({ amount: v.validator_bond_shares, denom: staking.params.bond_denom }, false) }}
            </div>
          </div>

          <div class="bg-base-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-6 pb-10">
            <div class="text-xs text-gray-500 text-[#64748B;]">{{ $t('staking.liquid_staking_shares') }}</div>
            <div class="text-2xl font-bold">
              {{ format.formatToken({ amount: v.liquid_shares, denom: staking.params.bond_denom }, false) }}
            </div>
          </div>
        </div> -->

        <!-- Commissions & Rewards -->
        <div class="bg-base-100 rounded-xl pt-3">
          <div class="text-2xl font-semibold text-main mb-4 mt-4">
            {{ $t('staking.commissions_&_rewards') }}
          </div> 

          <div class="grid grid-cols-1 md:!grid-cols-2 gap-4">
            <div class="bg-base-200 rounded-xl p-3 flex flex-col items-center justify-center gap-4 pb-8">
              <div class="text-sm text-[#64748B] mb-2">{{ $t('staking.commissions') }}</div>
              <div class="flex flex-wrap">
                <div v-for="(i, k) in commission" :key="`commission-${k}`" class="mr-2 mb-2 text-2xl dark:text-[#ffffff] text-[#153cd8]">
                  {{ format.formatToken2(i) }}
                </div>
              </div>
            </div>

            <div class="bg-base-200 rounded-xl  p-3 flex flex-col items-center justify-center gap-4 pb-8">
              <div class="text-sm text-[#64748B] mb-2">{{ $t('staking.outstanding') }} {{ $t('account.rewards') }}</div>
              <div class="flex flex-wrap">
                <div v-for="(i, k) in rewards" :key="`reward-${k}`"
                  class="mr-2 mb-2 text-2xl dark:text-[#ffffff] text-[#153cd8]">
                  {{ format.formatToken2(i) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Addresses Section -->
      <div class="bg-base-100 rounded-xl p-4 pt-6">
        <div class="text-2xl font-semibold text-main mb-4">{{ $t('staking.addresses') }}</div>

        <div class="grid grid-cols-1 gap-4">
          <div class="bg-base-200 rounded-xl p-3">
            <div class="text-sm text-[#64748B]flex items-center">
              {{ $t('staking.account_addr') }}
            </div>
            <RouterLink class="text-primary font-medium truncate flex flex-row items-center " :to="`/${chain}/account/${addresses.account}`">
              {{ addresses.account }}
              <Icon icon="mdi:content-copy" class="ml-2 cursor-pointer text-[#64748B]" v-show="addresses.account"
                @click="copyWebsite(addresses.account || '')" />
            </RouterLink>
          </div>

          <div class="bg-base-200 rounded-xl p-3">
            <div class="text-sm text-[#64748B] flex items-center">
              {{ $t('staking.operator_addr') }}
            </div>
            <div class="font-medium truncate flex flex-row items-center">
              {{ v.operator_address }}
              <Icon icon="mdi:content-copy" class="ml-2 cursor-pointer text-[#64748B]" v-show="v.operator_address"
                @click="copyWebsite(v.operator_address || '')" />
            </div>
          </div>  

          <div class="bg-base-200 rounded-xl p-3">
            <div class="text-sm text-[#64748B] flex items-center">
              {{ $t('staking.hex_addr') }}
            </div>
            <div class="font-medium truncate flex flex-row items-center">
              {{ addresses.hex }}
              <Icon icon="mdi:content-copy" class="ml-2 cursor-pointer text-[#64748B]" v-show="addresses.hex"
                @click="copyWebsite(addresses.hex || '')" />
            </div>
          </div>

          <div class="bg-base-200 rounded-xl p-3">
            <div class="text-sm text-[#64748B] flex items-center">
              {{ $t('staking.signer_addr') }}
            </div>
            <div class="font-medium truncate flex flex-row items-center">
              {{ addresses.valCons }}
              <Icon icon="mdi:content-copy" class="ml-2 cursor-pointer text-[#64748B]" v-show="addresses.valCons"
                @click="copyWebsite(addresses.valCons || '')" />
            </div>
          </div>

          <div class="bg-base-200 rounded-xl p-3">
            <div class="text-sm text-[#64748B] flex items-center">
              {{ $t('staking.consensus_pub_key') }}
            </div>
            <div class="font-medium truncate text-[10px] flex flex-row items-center">
              {{ v.consensus_pubkey }}
              <Icon icon="mdi:content-copy" class="ml-2 cursor-pointer text-[#64748B]" v-show="v.consensus_pubkey"
                @click="copyWebsite(JSON.stringify(v.consensus_pubkey) || '')" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Commission and Rewards -->
    <div class="grid grid-cols-1 md:!grid-cols-1 gap-4 my-4">
      <!-- Commission Rate -->
      <div>
        <CommissionRate :commission="v.commission"></CommissionRate>
      </div>
    </div>

    <!-- Delegations Table (if enabled) -->
    <div v-if="delegations.delegation_responses" class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-4 rounded-xl shadow-md my-4">
      <div class="text-lg font-semibold text-main dark:bg-base-100 bg-base-200 px-4 py-2">
        <h2 class="text-2xl font-semibold text-[#171C1F] dark:text-[#ffffff]">
          {{ $t('staking.delegations') }}
        </h2>
      </div>
      <div class="validator-table-wrapper validator-table-scroll rounded-xl">
        <table class="table table-compact w-full">
          <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
            <tr class="dark:bg-base-100 bg-base-200 border-b-[0px]">
              <th class="">{{ $t('account.delegator') }}</th>
              <th class="">{{ $t('account.delegation') }}</th>
            </tr>
          </thead>
          <tbody class="bg-base-100 relative">
            <tr v-for="{ balance, delegation } in delegations.delegation_responses" :key="delegation.delegator_address" class="hover:bg-gray-100 dark:hover:bg-[#384059] dark:bg-base-200 bg-white border-0 rounded-xl">
              <td class="py-3">
                <RouterLink :to="`/${props.chain}/account/${delegation.delegator_address}`" class="dark:text-primary text-[#09279F] dark:invert">
                  {{ delegation.delegator_address }}
                </RouterLink>
              </td>
              <td class="py-3">
                {{ format.formatToken(balance) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="Number(delegations.pagination?.total || 0) > 0" class="flex justify-between items-center gap-4 my-6 px-6">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Showing {{ ((delegationsPage - 1) * 6) + 1 }} to {{ Math.min(delegationsPage * 6, Number(delegations.pagination?.total || 0)) }} of {{ Number(delegations.pagination?.total || 0) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="goToFirstDelegations" :disabled="delegationsPage === 1 || totalDelegationsPages === 0">First</button>
          <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="prevDelegations" :disabled="delegationsPage === 1 || totalDelegationsPages === 0">&lt;</button>
          <span class="text-xs px-2">Page {{ delegationsPage }} of {{ totalDelegationsPages }}</span>
          <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="nextDelegations" :disabled="delegationsPage === totalDelegationsPages || totalDelegationsPages === 0">&gt;</button>
          <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="goToLastDelegations" :disabled="delegationsPage === totalDelegationsPages || totalDelegationsPages === 0">Last</button>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-4 rounded-xl shadow-md mb-4">
      <div class="text-lg font-semibold text-main dark:bg-base-100 bg-base-200 px-4 py-2">
        <h2 class="text-2xl font-semibold text-[#171C1F] dark:text-[#ffffff]">
          {{ $t('account.transactions') }}
        </h2>
      </div>
      <div class="validator-table-wrapper validator-table-scroll rounded-xl">
        <table class="table table-compact w-full">
          <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
            <tr class="dark:bg-base-100 bg-base-200 border-b-[0px]">
              <th class="">{{ $t('account.height') }}</th>
              <th class="">{{ $t('account.hash') }}</th>
              <th class="">{{ $t('account.signer') }}</th>
              <th class="">{{ $t('account.amount') }}</th>
              <th class="">{{ $t('block.fees') }}</th>
              <th class="" width="25%">{{ $t('account.messages') }}</th>
              <th class="">{{ $t('account.time') }}</th>
            </tr>
          </thead>
          <tbody class="bg-base-100 relative">
            <tr v-for="(item, i) in txs.tx_responses" :key="i" class="hover:bg-gray-100 dark:hover:bg-[#384059] dark:bg-base-200 bg-white border-0 rounded-xl">
              <td class="text-sm py-3">
                <RouterLink :to="`/${props.chain}/blocks/${item.height}`" class="dark:text-primary text-[#09279F] dark:invert">
                  {{ item.height }}
                </RouterLink>
              </td>
              <td class="truncate py-3" style="max-width: 200px">
                <RouterLink :to="`/${props.chain}/tx/${item.txhash}`" class="dark:text-primary text-[#09279F] dark:invert">
                  {{ item.txhash }}
                </RouterLink>
              </td>
              <td class="truncate py-3" style="max-width: 200px">
                <RouterLink v-if="getSignerAddress(item.tx?.body?.messages?.[0], item) !== '-'"
                  :to="`/${props.chain}/account/${getSignerAddress(item.tx?.body?.messages?.[0], item)}`" class="dark:text-primary text-[#09279F] dark:invert">
                  {{ getSignerAddress(item.tx?.body?.messages?.[0], item) }}
                </RouterLink>
                <span v-else>-</span>
              </td>
              <td class="py-3">
                {{ getTransactionAmount(item.tx?.body?.messages?.[0]) }}
              </td>
              <td class="py-3">
                {{ getTransactionFee(item.tx) }}
              </td>
              <td class="py-3">
                <div class="flex items-center">
                  <span class="mr-2 truncate">{{ format.messages(item.tx.body.messages) }}</span>
                  <Icon v-if="item.code === 0" icon="mdi-check" class="text-[#60BC29] text-lg" />
                  <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
                </div>
              </td>
              <td class="py-3">
                {{ format.toLocaleDate(item.timestamp) }}
                <span class="text-xs">({{ format.toDay(item.timestamp, 'from') }})</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Voting Power Events Table -->
    <div class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-4 rounded-xl shadow-md my-4">
      <div class="text-lg font-semibold text-main dark:bg-base-100 bg-base-200 px-4 py-2">
        <h2 class="text-2xl font-semibold text-[#171C1F] dark:text-[#ffffff]">
          {{ $t('staking.delegations') }}
        </h2>
      </div>
      <div class="validator-table-wrapper validator-table-scroll rounded-xl">
        <table class="table table-compact w-full">
          <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
            <tr class="dark:bg-base-100 bg-base-200 border-b-[0px]">
              <th class="">{{ $t('account.delegator') }}</th>
              <th class="">{{ $t('account.amount') }}</th>
              <th class="">{{ $t('account.height') }}</th>
              <th class="">{{ $t('account.time') }}</th>
            </tr>
          </thead>
          <tbody class="bg-base-100 relative">
            <tr v-for="(item, i) in events.tx_responses" :key="i" class="hover:bg-gray-100 dark:hover:bg-[#384059] dark:bg-base-200 bg-white border-0 rounded-xl">
              <td class="py-3">
                <div class="truncate" style="max-width: 250px">
                  <RouterLink v-for="d in mapDelegators(item.tx?.body?.messages)" :key="d" :to="`/${props.chain}/account/${d}`" class="dark:text-primary text-[#09279F] dark:invert">
                    {{ d }}
                  </RouterLink>
                </div>
              </td>
              <td class="py-3">
                <div class="flex items-center" :class="{ 'text-[#60BC29]': selectedEventType === EventType.Delegate, 'text-error': selectedEventType === EventType.Unbond }">
                  <RouterLink :to="`/${props.chain}/tx/${item.txhash}`" class="dark:text-primary text-inherit">
                    <span class="mr-2">{{ (selectedEventType === EventType.Delegate ? '+' : '-') }} {{ mapEvents(item.events) }}</span>
                  </RouterLink>
                  <Icon v-if="item.code === 0" icon="mdi-check" class="text-[#60BC29] text-lg" />
                  <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
                </div>
              </td>
              <td class="py-3">
                <RouterLink class="dark:text-primary text-[#09279F] dark:invert" :to="`/${props.chain}/blocks/${item.height}`">
                  {{ item.height }}
                </RouterLink>
              </td>
              <td class="py-3">
                {{ format.toLocaleDate(item.timestamp) }}
                <span class="text-xs">({{ format.toDay(item.timestamp, 'from') }})</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="Number(events.pagination?.total || 0) > 0" class="flex justify-between items-center gap-4 my-6 px-6">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Showing {{ ((eventsPage - 1) * 5) + 1 }} to {{ Math.min(eventsPage * 5, Number(events.pagination?.total || 0)) }} of {{ Number(events.pagination?.total || 0) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="goToFirstEvents" :disabled="eventsPage === 1 || totalEventsPages === 0">First</button>
          <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="prevEvents" :disabled="eventsPage === 1 || totalEventsPages === 0">&lt;</button>
          <span class="text-xs px-2">Page {{ eventsPage }} of {{ totalEventsPages }}</span>
          <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="nextEvents" :disabled="eventsPage === totalEventsPages || totalEventsPages === 0">&gt;</button>
          <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="goToLastEvents" :disabled="eventsPage === totalEventsPages || totalEventsPages === 0">Last</button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="toast" v-show="showCopyToast === 1">
      <div class="alert alert-success">
        <div class="text-xs md:!text-sm">
          <span>{{ tipMsg.msg }}</span>
        </div>
      </div>
    </div>
    <div class="toast" v-show="showCopyToast === 2">
      <div class="alert alert-error">
        <div class="text-xs md:!text-sm">
          <span>{{ tipMsg.msg }}</span>
        </div>
      </div>
    </div>
  </div>  
</template>

<style>
.validatore-table.table :where(th, td) {
  padding: 0.6rem 1rem;
  font-size: 14px;
}
.validatore-table.table {
  height: 320px;
  max-height: 320px;
}

/* Fixed-height scrollable table container for validator tables */
.validator-table-wrapper {
  height: 320px;
  max-height: 320px;
  display: flex;
  flex-direction: column;
}
.validator-table-scroll {
  flex: 1 1 auto;
  overflow-y: auto;
}
.validator-table-scroll table {
  margin-bottom: 0;
}
.validator-table-scroll thead {
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 1;
}

</style>
