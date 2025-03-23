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
    // pageload(1)

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
  page.limit = 10;

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
}

function pagePowerEvents(page: number) {
  loadPowerEvents(page, selectedEventType.value)
}

pagePowerEvents(1)

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
    <div class="bg-base-100 rounded-lg p-4 shadow">
      <!-- Validator Header with Avatar and Basic Info -->
      <div class="flex items-center mb-4">
        <div class="avatar relative w-16 h-16 rounded-lg overflow-hidden mr-4">
          <div class="w-full h-full absolute opacity-10"></div>
          <div class="w-full h-full rounded-lg flex items-center justify-center bg-base-200">
            <img v-if="identity && avatars[identity] !== 'undefined'" v-lazy="logo(identity)"
              class="object-contain w-full h-full" @error="(e) => { loadAvatar(identity); }" />
            <Icon v-else class="text-5xl" :icon="`mdi-help-circle-outline`" />
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-main">{{ v.description?.moniker }}</h2>
          <div class="text-sm text-gray-500 mb-2">
            {{ v.description?.identity || '-' }}
          </div>

        </div>
      </div>

      <!-- Validator Details -->
      <div class="mt-3 border-t pt-3">
        <p class="text-sm">{{ v.description?.details }}</p>
      </div>
    </div>

    <!-- Validator Stats Grid -->
    <div class="grid grid-cols-1 md:!grid-cols-3 gap-4 my-4">
      <!-- Total Bonded Card -->
      <div class="bg-base-100 rounded-lg p-4 shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-base-200 rounded-lg flex items-center justify-center mr-4">
            <Icon icon="mdi-coin" class="text-3xl text-primary" />
          </div>
          <div>
            <div class="text-lg font-semibold text-main">{{ $t('staking.total_bonded') }}</div>
          </div>
        </div>
        <div class="text-3xl font-bold mt-2">
          {{
            format.formatToken2({
              amount: v.tokens,
              denom: staking.params.bond_denom,
            })
          }}
        </div>
      </div>

      <!-- Self Bonded Card -->
      <div class="bg-base-100 rounded-lg p-4 shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-base-200 rounded-lg flex items-center justify-center mr-4">
            <Icon icon="mdi-percent" class="text-3xl text-primary" />
          </div>
          <div>
            <div class="text-lg font-semibold text-main">{{ $t('staking.self_bonded') }}</div>
          </div>
        </div>
        <div class="text-3xl font-bold mt-2">
          {{ format.formatToken(selfBonded.balance) }}
          <span class="text-lg text-gray-500">({{ selfRate }})</span>
        </div>
      </div>

      <!-- Annual Profit Card -->
      <div class="bg-base-100 rounded-lg p-4 shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-base-200 rounded-lg flex items-center justify-center mr-4">
            <Icon icon="mdi-finance" class="text-3xl text-success" />
          </div>
          <div>
            <div class="text-lg font-semibold text-main">{{ $t('staking.annual_profit') }}</div>
          </div>
        </div>
        <div class="text-3xl font-bold mt-2 text-success">
          {{ apr }}
        </div>
      </div>
    </div>

    <!-- Secondary Information Section -->
    <div class="grid grid-cols-1 md:!grid-cols-2 gap-4 my-4">
      <!-- About and Status Information -->
      <div class="bg-base-100 rounded-lg p-4 shadow">
        <div class="text-lg font-semibold text-main mb-4">{{ $t('staking.about_us') }}</div>

        <!-- Website and Contact Info -->
        <div class="grid grid-cols-1 gap-4 mb-4">
          <div class="bg-base-200 rounded-lg p-3">
            <div class="flex items-center">
              <Icon icon="mdi-web" class="text-xl mr-2 text-primary" />
              <span class="font-medium mr-1">{{ $t('staking.website') }}:</span>
              <a :href="v?.description?.website || '#'"
                :class="v?.description?.website ? 'cursor-pointer text-primary' : 'cursor-default'">
                {{ v.description?.website || '-' }}
              </a>
              <Icon v-if="v?.description?.website" icon="mdi:content-copy" class="ml-2 cursor-pointer text-gray-500"
                @click="copyWebsite(v.description?.website || '')" />
            </div>
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="flex items-center">
              <Icon icon="mdi-email-outline" class="text-xl mr-2 text-primary" />
              <span class="font-medium mr-1">{{ $t('staking.contact') }}:</span>
              <a v-if="v.description?.security_contact" :href="'mailto:' + v.description.security_contact || '#'"
                class="cursor-pointer text-primary">
                {{ v.description?.security_contact || '-' }}
              </a>
              <span v-else>-</span>
              <Icon v-if="v.description?.security_contact" icon="mdi:content-copy"
                class="ml-2 cursor-pointer text-gray-500" @click="copyWebsite(v.description?.security_contact || '')" />
            </div>
          </div>
        </div>

        <!-- Validator Status -->
        <div class="text-lg font-semibold text-main mb-2 mt-4">{{ $t('staking.validator_status') }}</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500">{{ $t('staking.status') }}</div>
            <!-- Status pill -->
            <div class="badge text-black" :class="{
              'bg-success': v.status === 'BOND_STATUS_BONDED',
              'bg-warning': v.status === 'BOND_STATUS_UNBONDED',
              'bg-error': v.status === 'BOND_STATUS_UNBONDING'
            }">
              {{ String(v.status).replace('BOND_STATUS_', '').replace('BONDED', 'Staked').replace('UNBONDING', 'Unstaking').replace('UNBONDED', 'Unstaked') }}
            </div>
            <!-- <div class="text-xl font-bold">
              {{ String(v.status).replace('BOND_STATUS_', '').replace('BONDED', 'STAKED').replace('UNBONDING', 'UNSTAKING').replace('UNBONDED', 'UNSTAKED') }}
            </div> -->
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500">{{ $t('staking.jailed') }}</div>
            <div class="text-xl font-bold">
              {{ v.jailed || '-' }}
            </div>
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500">{{ $t('staking.min_self') }}</div>
            <div class="text-xl font-bold">
              {{ v.min_self_delegation }} {{ staking.params.bond_denom }}
            </div>
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500">{{ $t('staking.unbonding_height') }}</div>
            <div class="text-xl font-bold">
              {{ v.unbonding_height || '-' }}
            </div>
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500">{{ $t('staking.unbonding_time') }}</div>
            <div class="text-xl font-bold">
              <template v-if="v.unbonding_time && !v.unbonding_time.startsWith('1970')">
                {{ format.toDay(v.unbonding_time, 'from') }}
              </template>
              <template v-else>-</template>
            </div>
          </div>
        </div>

        <!-- Liquid Staking Section -->
        <div class="text-lg font-semibold text-main mb-2 mt-4">{{ $t('staking.liquid_staking') }}</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500">{{ $t('staking.validator_bond_share') }}</div>
            <div class="text-xl font-bold">
              {{ format.formatToken({ amount: v.validator_bond_shares, denom: staking.params.bond_denom }, false) }}
            </div>
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500">{{ $t('staking.liquid_staking_shares') }}</div>
            <div class="text-xl font-bold">
              {{ format.formatToken({ amount: v.liquid_shares, denom: staking.params.bond_denom }, false) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Addresses Section -->
      <div class="bg-base-100 rounded-lg p-4 shadow">
        <div class="text-lg font-semibold text-main mb-4">{{ $t('staking.addresses') }}</div>

        <div class="grid grid-cols-1 gap-4">
          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500 flex items-center">
              {{ $t('staking.account_addr') }}
              <Icon icon="mdi:content-copy" class="ml-2 cursor-pointer" v-show="addresses.account"
                @click="copyWebsite(addresses.account || '')" />
            </div>
            <RouterLink class="text-primary font-medium truncate block" :to="`/${chain}/account/${addresses.account}`">
              {{ addresses.account }}
            </RouterLink>
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500 flex items-center">
              {{ $t('staking.operator_addr') }}
              <Icon icon="mdi:content-copy" class="ml-2 cursor-pointer" v-show="v.operator_address"
                @click="copyWebsite(v.operator_address || '')" />
            </div>
            <div class="font-medium truncate">
              {{ v.operator_address }}
            </div>
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500 flex items-center">
              {{ $t('staking.hex_addr') }}
              <Icon icon="mdi:content-copy" class="ml-2 cursor-pointer" v-show="addresses.hex"
                @click="copyWebsite(addresses.hex || '')" />
            </div>
            <div class="font-medium truncate">{{ addresses.hex }}</div>
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500 flex items-center">
              {{ $t('staking.signer_addr') }}
              <Icon icon="mdi:content-copy" class="ml-2 cursor-pointer" v-show="addresses.valCons"
                @click="copyWebsite(addresses.valCons || '')" />
            </div>
            <div class="font-medium truncate">{{ addresses.valCons }}</div>
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500 flex items-center">
              {{ $t('staking.consensus_pub_key') }}
              <Icon icon="mdi:content-copy" class="ml-2 cursor-pointer" v-show="v.consensus_pubkey"
                @click="copyWebsite(JSON.stringify(v.consensus_pubkey) || '')" />
            </div>
            <div class="font-medium truncate text-xs">{{ v.consensus_pubkey }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Commission and Rewards -->
    <div class="grid grid-cols-1 md:!grid-cols-2 gap-4 my-4">
      <!-- Commission Rate -->
      <div>
        <CommissionRate :commission="v.commission"></CommissionRate>
      </div>

      <!-- Rewards and Commissions -->
      <div class="bg-base-100 rounded-lg p-4 shadow">
        <div class="text-lg font-semibold text-main mb-4">
          {{ $t('staking.commissions_&_rewards') }}
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500 mb-2">{{ $t('staking.commissions') }}</div>
            <div class="flex flex-wrap">
              <div v-for="(i, k) in commission" :key="`commission-${k}`"
                class="mr-2 mb-2 badge bg-primary text-primary-content">
                {{ format.formatToken2(i) }}
              </div>
            </div>
          </div>

          <div class="bg-base-200 rounded-lg p-3">
            <div class="text-sm text-gray-500 mb-2">{{ $t('staking.outstanding') }} {{ $t('account.rewards') }}</div>
            <div class="flex flex-wrap">
              <div v-for="(i, k) in rewards" :key="`reward-${k}`"
                class="mr-2 mb-2 badge bg-success text-success-content">
                {{ format.formatToken2(i) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delegations Table (if enabled) -->
    <div v-if="delegations.delegation_responses" class="bg-base-100 rounded-lg p-4 shadow my-4">
      <div class="flex items-center justify-between mb-4">
        <div class="text-lg font-semibold text-main">{{ $t('account.delegations') }}</div>
        <div class="text-sm text-gray-500">
          {{ delegations.delegation_responses?.length || 0 }} / {{ delegations.pagination?.total || 0 }}
        </div>
      </div>

      <div class="rounded overflow-auto">
        <table class="table validatore-table w-full">
          <thead>
            <th class="text-left pl-4 bg-base-200" style="position: relative; z-index: 2">
              {{ $t('account.delegator') }}
            </th>
            <th class="text-left pl-4 bg-base-200">{{ $t('account.delegation') }}</th>
          </thead>
          <tbody>
            <tr v-for="{ balance, delegation } in delegations.delegation_responses">
              <td class="text-primary font-medium">
                {{ delegation.delegator_address }}
              </td>
              <td class="truncate text-primary font-bold">
                {{ format.formatToken(balance) }}
              </td>
            </tr>
          </tbody>
        </table>
        <PaginationBar :total="delegations.pagination?.total" :limit="page.limit" :callback="pageload" />
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-base-100 rounded-lg p-4 shadow my-4">
      <div class="text-lg font-semibold text-main mb-4">{{ $t('account.transactions') }}</div>
      <div class="rounded overflow-auto">
        <table class="table validatore-table w-full">
          <thead>
            <th class="text-left pl-4 bg-base-200" style="position: relative; z-index: 2">
              {{ $t('account.height') }}
            </th>
            <th class="text-left pl-4 bg-base-200">{{ $t('account.hash') }}</th>
            <th class="text-left pl-4 bg-base-200">{{ $t('account.signer') }}</th>
            <th class="text-left pl-4 bg-base-200">{{ $t('account.amount') }}</th>
            <th class="text-left pl-4 bg-base-200">{{ $t('block.fees') }}</th>
            <th class="text-left pl-4 bg-base-200" width="25%">{{ $t('account.messages') }}</th>
            <th class="text-left pl-4 bg-base-200">{{ $t('account.time') }}</th>
          </thead>
          <tbody>
            <tr v-for="(item, i) in txs.tx_responses">
              <td class="text-primary font-medium">
                <RouterLink :to="`/${props.chain}/block/${item.height}`">{{
                  item.height
                  }}</RouterLink>
              </td>
              <td class="truncate text-primary" style="max-width: 120px">
                <RouterLink :to="`/${props.chain}/tx/${item.txhash}`">
                  {{ item.txhash }}
                </RouterLink>
              </td>
              <td class="truncate text-primary" style="max-width: 120px">
                <RouterLink v-if="getSignerAddress(item.tx?.body?.messages?.[0], item) !== '-'"
                  :to="`/${props.chain}/account/${getSignerAddress(item.tx?.body?.messages?.[0], item)}`">
                  {{ getSignerAddress(item.tx?.body?.messages?.[0], item) }}
                </RouterLink>
                <span v-else>-</span>
              </td>
              <td class="truncate" style="max-width: 120px">
                {{ getTransactionAmount(item.tx?.body?.messages?.[0]) }}
              </td>
              <td class="truncate" style="max-width: 120px">
                {{ getTransactionFee(item.tx) }}
              </td>
              <td>
                <div class="flex items-center">
                  <span class="mr-2 truncate">{{
                    format.messages(item.tx.body.messages)
                    }}</span>
                  <Icon v-if="item.code === 0" icon="mdi-check" class="text-yes" />
                  <Icon v-else icon="mdi-multiply" class="text-no" />
                </div>
              </td>
              <td>{{ format.toDay(item.timestamp, 'from') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Voting Power Events Table -->
    <div class="bg-base-100 rounded-lg p-4 shadow my-4">
      <div class="rounded overflow-auto">
        <table class="table validatore-table w-full">
          <thead>
            <th class="text-left pl-4 bg-base-200">{{ $t('account.delegator') }}</th>
            <th class="text-left pl-4 bg-base-200">{{ $t('account.amount') }}</th>
            <th class="text-left pl-4 bg-base-200">{{ $t('account.height') }} / {{ $t('account.time') }}</th>
          </thead>
          <tbody>
            <tr v-for="(item, i) in events.tx_responses">
              <td class="pr-2 truncate text-primary" style="max-width: 250px">
                <RouterLink v-for="d in mapDelegators(item.tx?.body?.messages)" :to="`/${props.chain}/account/${d}`">
                  {{ d }}
                </RouterLink>
              </td>
              <td>
                <div class="flex items-center" :class="{
                  'text-yes': selectedEventType === EventType.Delegate,
                  'text-no': selectedEventType === EventType.Unbond,
                }">
                  <RouterLink :to="`/${props.chain}/tx/${item.txhash}`">
                    <span class="mr-2">
                      {{ (selectedEventType === EventType.Delegate ? '+' : '-') }} {{
                        mapEvents(item.events)
                      }}</span>
                  </RouterLink>
                  <Icon v-if="item.code === 0" icon="mdi-check" class="text-yes" />
                  <Icon v-else icon="mdi-multiply" class="text-no" />
                </div>
              </td>
              <td>
                <RouterLink class="text-primary font-medium block" :to="`/${props.chain}/block/${item.height}`">
                  {{ item.height }}
                </RouterLink>
                <span class="text-xs text-gray-500">{{ format.toDay(item.timestamp, 'from') }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <PaginationBar :total="events.pagination?.total" :limit="page.limit" :callback="pagePowerEvents" />
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
</style>
