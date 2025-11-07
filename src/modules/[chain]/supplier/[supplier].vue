<script setup lang="ts">
import { parseCoins } from '@cosmjs/stargate';
import {
  useBlockchain,
  useFormatter,
  useMintStore,
  useStakingStore,
  useTxDialog,
} from '@/stores';
import { onMounted, computed, ref, watch } from 'vue';
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
import { fetchTransactions, type ApiTransaction, type TransactionFilters } from '@/libs/transactions';

const props = defineProps(['supplier', 'chain']);

const staking = useStakingStore();
const blockchain = useBlockchain();
const format = useFormatter();
const dialog = useTxDialog();
const page = new PageRequest();

const supplier: string = props.supplier;

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

addresses.value.account = operatorAddressToAccount(supplier);
// load self bond
staking
  .fetchValidatorDelegation(supplier, addresses.value.account)
  .then((x) => {
    if (x) {
      selfBonded.value = x.delegation_response;
    }
  });

const txs = ref<ApiTransaction[]>([]);
const currentTxPage = ref(1);
const txItemsPerPage = ref(25);
const totalTxPages = ref(0);
const totalTxCount = ref(0);
const loadingTxs = ref(false);
const selectedTypeTab = ref<'all' | 'send' | 'claim' | 'proof' | 'governance' | 'staking'>('all');
const txStatusFilter = ref<string>('');
const txStartDate = ref<string>('');
const txEndDate = ref<string>('');
const txMinAmount = ref<number | undefined>(undefined);
const txMaxAmount = ref<number | undefined>(undefined);
const txSortBy = ref<'timestamp' | 'amount' | 'fee' | 'block_height' | 'type' | 'status'>('timestamp');
const txSortOrder = ref<'asc' | 'desc'>('desc');
const showAdvancedTxFilters = ref(false);

// Map frontend chain names to API chain names
const getApiChainName = (chainName: string) => {
  const chainMap: Record<string, string> = {
    'pocket-beta': 'pocket-testnet-beta',
    'pocket-alpha': 'pocket-testnet-alpha',
    'pocket-mainnet': 'pocket-mainnet'
  };
  return chainMap[chainName] || chainName || 'pocket-testnet-beta';
};

// Type tab mappings
const typeTabMap: Record<string, string[]> = {
  all: [],
  send: ['MsgSend (bank)', 'MsgMultiSend (bank)'],
  claim: ['MsgCreateClaim (proof)'],
  proof: ['MsgSubmitProof (proof)'],
  governance: [
    'MsgSubmitProposal (governance)',
    'MsgVote (governance)',
    'MsgDeposit (governance)',
    'MsgVoteWeighted (governance)'
  ],
  staking: [
    'MsgDelegate (node)',
    'MsgUndelegate (node)',
    'MsgBeginRedelegate (node)',
    'MsgStakeApplication (application)',
    'MsgUnstakeApplication (application)',
    'MsgStakeSupplier (supplier)',
    'MsgUnstakeSupplier (supplier)',
    'MsgStakeGateway (gateway)',
    'MsgUnstakeGateway (gateway)'
  ]
};

let txDebounceTimer: ReturnType<typeof setTimeout> | null = null;

async function loadSupplierTransactions() {
  if (!addresses.value.account) return;
  
  loadingTxs.value = true;
  try {
    const apiChainName = getApiChainName(props.chain || blockchain.current?.chainName || 'pocket-beta');
    const filters: TransactionFilters = {
      address: addresses.value.account,
      chain: apiChainName,
      page: currentTxPage.value,
      limit: txItemsPerPage.value,
      sort_by: txSortBy.value,
      sort_order: txSortOrder.value,
    };

    const selectedTypes = typeTabMap[selectedTypeTab.value];
    if (selectedTypes.length > 0) {
      filters.type = selectedTypes[0];
    }

    if (txStatusFilter.value) filters.status = txStatusFilter.value;
    if (txStartDate.value) {
      // Convert datetime-local to ISO 8601
      filters.start_date = new Date(txStartDate.value).toISOString();
    }
    if (txEndDate.value) {
      // Convert datetime-local to ISO 8601
      filters.end_date = new Date(txEndDate.value).toISOString();
    }
    if (txMinAmount.value !== undefined) filters.min_amount = txMinAmount.value;
    if (txMaxAmount.value !== undefined) filters.max_amount = txMaxAmount.value;

    const data = await fetchTransactions(filters);
    txs.value = data.data || [];
    totalTxCount.value = data.meta?.total || 0;
    totalTxPages.value = data.meta?.totalPages || 0;
  } catch (error) {
    console.error('Error loading transactions:', error);
    txs.value = [];
    totalTxCount.value = 0;
    totalTxPages.value = 0;
  } finally {
    loadingTxs.value = false;
  }
}

function debouncedLoadTransactions() {
  if (txDebounceTimer) clearTimeout(txDebounceTimer);
  txDebounceTimer = setTimeout(() => {
    currentTxPage.value = 1;
    loadSupplierTransactions();
  }, 300);
}

watch([selectedTypeTab, txStatusFilter, txStartDate, txEndDate, txMinAmount, txMaxAmount, txSortBy, txSortOrder], () => {
  debouncedLoadTransactions();
});

watch([currentTxPage, txItemsPerPage], () => {
  loadSupplierTransactions();
});

watch(() => addresses.value.account, () => {
  if (addresses.value.account) {
    loadSupplierTransactions();
  }
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
        if (d.list[0].keybase.picture_url) {
          const uri = String(d.list[0].keybase.picture_url).replace(
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
  if (supplier) {
    staking.fetchValidator(supplier).then((res) => {
      v.value = res.supplier;
      identity.value = res.supplier?.description?.identity || '';
      if (identity.value && !avatars.value[identity.value]) loadAvatar(identity.value);

      addresses.value.hex = consensusPubkeyToHexAddress(
        v.value.consensus_pubkey
      );
      addresses.value.valCons = pubKeyToValcons(
        v.value.consensus_pubkey,
        blockchain.current?.bech32ConsensusPrefix || "",
      );
      
      // Load transactions after addresses are set
      loadSupplierTransactions();
    });
    blockchain.rpc
      .getDistributionValidatorOutstandingRewards(supplier)
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
    blockchain.rpc.getDistributionValidatorCommission(supplier).then((res) => {
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

  blockchain.rpc.getStakingValidatorsDelegations(supplier, page).then(res => {
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
  blockchain.rpc.getTxs("?order_by=2&query={type}.supplier='{supplier}'", { type: selectedEventType.value, supplier }, page).then(res => {
    events.value = res
  })
}

function pagePowerEvents(page: number) {
    loadPowerEvents(page, selectedEventType.value)
}

pagePowerEvents(1)

function mapEvents(events: {type: string, attributes: {key: string, value: string}[]}[]) {
  const attributes = events
    .filter(x => x.type === selectedEventType.value)
    .filter(x => x.attributes.findIndex(attr => attr.value === supplier || attr.value === toBase64(stringToUint8Array(supplier))) > -1)
    .map(x => {
      // check if attributes need to decode
      const output = {} as {[key: string]: string }

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
  if(!messages) return []
  return Array.from(new Set(messages.map(x => x.delegator_address || x.grantee)))
}

</script>
<template>
  <div>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow border-indigo-500">
      <div class="flex flex-col lg:!flex-row pt-2 pb-1">
        <div class="flex-1">
          <div class="flex">
            <div class="avatar mr-4 relative w-24 rounded-lg overflow-hidden">
              <div class="w-24 rounded-lg absolute opacity-10"></div>
              <div class="w-24 rounded-lg">
                <img
                  v-if="identity && avatars[identity] !== 'undefined'"
                  v-lazy="logo(identity)"
                  class="object-contain w-24 h-24 rounded-lg"
                  @error="
                    (e) => {
                      loadAvatar(identity);
                    }
                  "
                />
                <Icon
                  v-else
                  class="text-8xl"
                  :icon="`mdi-help-circle-outline`"
                />
              </div>
            </div>
            <div class="mx-2">
              <h4>{{ v.description?.moniker }}</h4>
              <div class="text-sm mb-4">
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
                >{{ $t('account.btn_delegate') }}</label
              >
            </div>
          </div>
          <div class="m-4 text-sm">
            <p class="text-sm mb-3 font-medium">{{ $t('staking.about_us') }}</p>
            <div class="card-list">
              <div class="flex items-center mb-2">
                <Icon icon="mdi-web" class="text-xl mr-1" />
                <span class="font-bold mr-2">{{ $t('staking.website') }}: </span>
                <a
                  :href="v?.description?.website || '#'"
                  :class="
                    v?.description?.website
                      ? 'cursor-pointer'
                      : 'cursor-default'
                  "
                >
                  {{ v.description?.website || '-' }}
                </a>
              </div>
              <div class="flex items-center">
                <Icon icon="mdi-email-outline" class="text-xl mr-1" />
                <span class="font-bold mr-2">{{ $t('staking.contact') }}: </span>
                <a
                  v-if="v.description?.security_contact"
                  :href="'mailto:' + v.description.security_contact || '#' "
                  class="cursor-pointer"
                >
                  {{ v.description?.security_contact || '-' }}
                </a>
              </div>
            </div>
            <p class="text-sm mt-4 mb-3 font-medium">{{ $t('staking.validator_status') }}</p>
            <div class="card-list">
              <div class="flex items-center mb-2">
                <Icon icon="mdi-shield-account-outline" class="text-xl mr-1" />
                <span class="font-bold mr-2">{{ $t('staking.status') }}: </span
                ><span>
                  {{ String(v.status).replace('BOND_STATUS_', '') }}
                </span>
              </div>
              <div class="flex items-center">
                <Icon icon="mdi-shield-alert-outline" class="text-xl mr-1" />
                <span class="font-bold mr-2">{{ $t('staking.jailed') }}: </span>
                <span> {{ v.jailed || '-' }} </span>
              </div>
            </div>
            <p class="text-sm mt-4 mb-3 font-medium">{{ $t('staking.liquid_staking') }}</p>
            <div class="card-list">
              <div class="flex items-center mb-2">
                <Icon icon="mdi-lock" class="text-xl mr-1" />
                <span class="font-bold mr-2">{{ $t('staking.validator_bond_share') }}: </span>
                <span> {{ format.formatToken( {amount: v.validator_bond_shares, denom: staking.params.bond_denom }, false) }} </span>
              </div>
              <div class="flex items-center">
                <Icon icon="mdi-waves-arrow-right" class="text-xl mr-1" />
                <span class="font-bold mr-2">{{ $t('staking.liquid_staking_shares') }}: </span>
                <span>
                  {{ format.formatToken( {amount: v.liquid_shares, denom: staking.params.bond_denom }, false) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <div class="flex flex-col mt-10">
            <div class="flex mb-2">
              <div
                class="flex items-center justify-center rounded w-10 h-10"
                style="border: 1px solid #666"
              >
                <Icon icon="mdi-coin" class="text-3xl" />
              </div>
              <div class="ml-3 flex flex-col justify-center">
                <h4>
                  {{
                    format.formatToken2({
                      amount: v.tokens,
                      denom: staking.params.bond_denom,
                    })
                  }}
                </h4>
                <span class="text-sm">{{ $t('staking.total_bonded') }}</span>
              </div>
            </div>
            <div class="flex mb-2">
              <div
                class="flex items-center justify-center rounded w-10 h-10"
                style="border: 1px solid #666"
              >
                <Icon icon="mdi-percent" class="text-3xl" />
              </div>
              <div class="ml-3 flex flex-col justify-center">
                <h4>
                  {{ format.formatToken(selfBonded.balance) }} ({{ selfRate }})
                </h4>
                <span class="text-sm">{{ $t('staking.self_bonded') }}</span>
              </div>
            </div>

            <div class="flex mb-2">
              <div
                class="flex items-center justify-center rounded w-10 h-10"
                style="border: 1px solid #666"
              >
                <Icon icon="mdi-account-tie" class="text-3xl" />
              </div>

              <div class="ml-3 flex flex-col">
                <h4>
                  {{ v.min_self_delegation }} {{ staking.params.bond_denom }}
                </h4>
                <span class="text-sm">{{ $t('staking.min_self') }}</span>
              </div>
            </div>
            <div class="flex mb-2">
              <div
                class="flex items-center justify-center rounded w-10 h-10"
                style="border: 1px solid #666"
              >
                <Icon icon="mdi-finance" class="text-3xl" />
              </div>
              <div class="ml-3 flex flex-col justify-center">
                <h4>{{ apr }}</h4>
                <span class="text-sm">{{ $t('staking.annual_profit') }}</span>
              </div>
            </div>

            <div class="flex mb-2">
              <div
                class="flex items-center justify-center rounded w-10 h-10"
                style="border: 1px solid #666"
              >
                <Icon icon="mdi:arrow-down-bold-circle-outline" class="text-3xl" />
              </div>
              <div class="ml-3 flex flex-col justify-center">
                <h4>{{ v.unbonding_height }}</h4>
                <span class="text-sm">{{ $t('staking.unbonding_height') }}</span>
              </div>
            </div>

            <div class="flex mb-2">
              <div
                class="flex items-center justify-center rounded w-10 h-10"
                style="border: 1px solid #666"
              >
                <Icon icon="mdi-clock" class="text-3xl" />
              </div>
              <div class="ml-3 flex flex-col justify-center">
                <h4 v-if="v.unbonding_time && !v.unbonding_time.startsWith('1970')">{{ format.toDay(v.unbonding_time, 'from') }}</h4>
                <h4 v-else>-</h4>
                <span class="text-sm">{{ $t('staking.unbonding_time') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-sm px-4 pt-3 border-t">{{ v.description?.details }}</div>
    </div>

    <div class="mt-3 grid grid-cols-1 md:!grid-cols-3 gap-4">
      <div>
        <CommissionRate :commission="v.commission"></CommissionRate>
      </div>
      <div class="bg-base-100 rounded shadow relative overflow-auto">
        <div class="text-lg font-semibold text-main px-4 pt-4">
          {{ $t('staking.commissions_&_rewards') }}
        </div>
        <div
          class="px-4 mt-1 flex flex-col justify-between pb-4 max-h-72"
          style="height: calc(100% - 50px)"
        >
          <div class="overflow-auto flex-1">
            <div class="text-sm mb-2">{{ $t('staking.commissions') }}</div>
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
            <div class="text-sm mb-2 mt-2">{{ $t('staking.outstanding') }} {{ $t('account.rewards') }}</div>
            <div
              v-for="(i, k) in rewards"
              :key="`reward-${k}`"
              class="mr-1 mb-1 badge text-xs"
            >
              {{ format.formatToken2(i) }}
            </div>
          </div>
          <div class="">
            <label
              for="withdraw_commission"
              class="btn btn-primary w-full"
              @click="
                dialog.open('withdraw_commission', {
                  validator_address: v.operator_address,
                })
              "
              >{{ $t('account.btn_withdraw') }}</label
            >
          </div>
        </div>
      </div>
      <div class="bg-base-100 rounded shadow overflow-x-auto">
        <div class="px-4 pt-4 mb-2 text-main font-lg font-semibold">
          {{ $t('staking.addresses') }}
        </div>
        <div class="px-4 pb-4">
          <div class="mb-3">
            <div class="text-sm flex">{{ $t('staking.account_addr') }} 
              <Icon
                  icon="mdi:content-copy"
                  class="ml-2 cursor-pointer"
                  v-show="addresses.account"
                  @click="copyWebsite(addresses.account || '')"
                />
              </div>
            <RouterLink
              class="text-xs text-primary"
              :to="`/${chain}/account/${addresses.account}`"
            >
              {{ addresses.account }}
            </RouterLink>
          </div>
          <div class="mb-3">
            <div class="text-sm flex">{{ $t('staking.operator_addr') }}
              <Icon
                  icon="mdi:content-copy"
                  class="ml-2 cursor-pointer"
                  v-show="v.operator_address"
                  @click="copyWebsite(v.operator_address || '')"
                /></div>
            <div class="text-xs">
              {{ v.operator_address }}
            </div>
          </div>
          <div class="mb-3">
            <div class="text-sm flex">{{ $t('staking.hex_addr') }}
              <Icon
                  icon="mdi:content-copy"
                  class="ml-2 cursor-pointer"
                  v-show="addresses.hex"
                  @click="copyWebsite(addresses.hex || '')"
                />
              </div>
            <div class="text-xs">{{ addresses.hex }}</div>
          </div>
          <div class="mb-3">
            <div class="text-sm flex">{{ $t('staking.signer_addr') }}
              <Icon
                  icon="mdi:content-copy"
                  class="ml-2 cursor-pointer"
                  v-show="addresses.valCons"
                  @click="copyWebsite(addresses.valCons || '')"
                />
              </div>
            <div class="text-xs">{{ addresses.valCons }}</div>
          </div>
          <div>
            <div class="text-sm flex">{{ $t('staking.consensus_pub_key') }}
              <Icon
                  icon="mdi:content-copy"
                  class="ml-2 cursor-pointer"
                  v-show="v.consensus_pubkey"
                  @click="copyWebsite(JSON.stringify(v.consensus_pubkey) || '')"
                />
              </div>
            <div class="text-xs">{{ v.consensus_pubkey }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="delegations.delegation_responses" class="mt-5 bg-base-100 shadow rounded p-4 ">
      <div class="text-lg mb-4 font-semibold">{{ $t('account.delegations') }}
        <span class="float-right"> {{ delegations.delegation_responses?.length || 0 }} / {{ delegations.pagination?.total || 0 }} </span>
      </div>
      <div class="rounded overflow-auto">
        <table class="table validatore-table w-full">
          <thead>
            <th class="text-left pl-4" style="position: relative; z-index: 2">
              {{ $t('account.delegator') }}
            </th>
            <th class="text-left pl-4">{{ $t('account.delegation') }}</th>
          </thead>
          <tbody>
            <tr v-for="{balance, delegation} in delegations.delegation_responses">
              <td class="text-sm text-primary">
                {{ delegation.delegator_address }}
              </td>
              <td class="truncate text-primary">
                {{ format.formatToken(balance)}}
              </td>
              
            </tr>
          </tbody>
        </table>
        <PaginationBar :total="delegations.pagination?.total" :limit="page.limit" :callback="pageload"/>
      </div>
    </div>

    <div class="mt-5 bg-base-100 shadow rounded p-4">
      <div class="text-lg mb-4 font-semibold">{{ $t('account.transactions') }}</div>
      
      <!-- Filter Section - Compact & Modern -->
      <div class="bg-base-200 dark:bg-base-300 rounded-lg border border-base-300 dark:border-base-400 mb-4">
        <!-- Main Filter Bar -->
        <div class="flex flex-wrap items-center gap-3 px-4 py-3">
          <!-- Type Tabs - Compact Horizontal -->
          <div class="flex items-center gap-1 flex-wrap">
            <span class="text-xs font-medium text-base-content/70 mr-1">Type:</span>
            <button
              v-for="typeOption in [
                { value: 'all', label: 'All' },
                { value: 'send', label: 'Send' },
                { value: 'claim', label: 'Claim' },
                { value: 'proof', label: 'Proof' },
                { value: 'governance', label: 'Gov' },
                { value: 'staking', label: 'Stake' }
              ]"
              :key="typeOption.value"
              @click="selectedTypeTab = typeOption.value as any"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
              :class="selectedTypeTab === typeOption.value
                ? 'bg-[#007bff] text-white shadow-sm'
                : 'bg-base-100 dark:bg-base-200 text-base-content hover:bg-base-300 dark:hover:bg-base-100 border border-base-300 dark:border-base-400'"
            >
              {{ typeOption.label }}
            </button>
          </div>

          <!-- Divider -->
          <div class="h-6 w-px bg-base-300 dark:bg-base-500"></div>

          <!-- Quick Filters -->
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Status -->
            <div class="flex items-center gap-1.5">
              <Icon icon="mdi:check-circle-outline" class="text-base-content/60 text-sm" />
              <select v-model="txStatusFilter" class="select select-bordered select-xs h-8 min-h-8 px-2 text-xs w-24">
                <option value="">All</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <!-- Sort By -->
            <div class="flex items-center gap-1.5">
              <Icon icon="mdi:sort" class="text-base-content/60 text-sm" />
              <select v-model="txSortBy" class="select select-bordered select-xs h-8 min-h-8 px-2 text-xs w-28">
                <option value="timestamp">Time</option>
                <option value="amount">Amount</option>
                <option value="fee">Fee</option>
                <option value="block_height">Block</option>
                <option value="type">Type</option>
                <option value="status">Status</option>
              </select>
            </div>

            <!-- Sort Order Toggle -->
            <button
              @click="txSortOrder = txSortOrder === 'desc' ? 'asc' : 'desc'"
              class="btn btn-xs h-8 min-h-8 px-2 gap-1"
              :class="txSortOrder === 'desc' ? 'btn-primary' : 'btn-ghost'"
              :title="txSortOrder === 'desc' ? 'Descending' : 'Ascending'"
            >
              <Icon :icon="txSortOrder === 'desc' ? 'mdi:sort-descending' : 'mdi:sort-ascending'" class="text-sm" />
            </button>
          </div>

          <!-- Advanced Filters Toggle -->
          <div class="ml-auto">
            <button
              @click="showAdvancedTxFilters = !showAdvancedTxFilters"
              class="btn btn-xs h-8 min-h-8 px-3 gap-1.5"
              :class="showAdvancedTxFilters ? 'btn-primary' : 'btn-ghost'"
            >
              <Icon :icon="showAdvancedTxFilters ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-sm" />
              <span class="text-xs">Advanced</span>
            </button>
          </div>
        </div>

        <!-- Advanced Filters - Collapsible -->
        <div v-show="showAdvancedTxFilters" class="border-t border-base-300 dark:border-base-400 px-4 py-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Date Range -->
            <div>
              <label class="label py-1">
                <span class="label-text text-xs font-medium flex items-center gap-1.5">
                  <Icon icon="mdi:calendar-range" class="text-sm" />
                  Date Range
                </span>
              </label>
              <div class="flex gap-2">
                <input
                  v-model="txStartDate"
                  type="datetime-local"
                  class="input input-bordered input-xs h-8 text-xs flex-1"
                  placeholder="Start"
                />
                <span class="self-center text-xs text-base-content/50">→</span>
                <input
                  v-model="txEndDate"
                  type="datetime-local"
                  class="input input-bordered input-xs h-8 text-xs flex-1"
                  placeholder="End"
                />
              </div>
            </div>

            <!-- Amount Range -->
            <div>
              <label class="label py-1">
                <span class="label-text text-xs font-medium flex items-center gap-1.5">
                  <Icon icon="mdi:currency-usd" class="text-sm" />
                  Amount Range
                </span>
              </label>
              <div class="flex gap-2">
                <input
                  v-model.number="txMinAmount"
                  type="number"
                  class="input input-bordered input-xs h-8 text-xs flex-1"
                  placeholder="Min"
                />
                <span class="self-center text-xs text-base-content/50">-</span>
                <input
                  v-model.number="txMaxAmount"
                  type="number"
                  class="input input-bordered input-xs h-8 text-xs flex-1"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded overflow-auto">
        <table class="table validatore-table w-full">
          <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
            <th class="text-left pl-4" style="position: relative; z-index: 2">
              {{ $t('account.height') }}
            </th>
            <th class="text-left pl-4">{{ $t('account.hash') }}</th>
            <th class="text-left pl-4">{{ $t('account.type') }}</th>
            <th class="text-left pl-4">{{ $t('account.amount') }}</th>
            <th class="text-left pl-4">{{ $t('block.fees') }}</th>
            <th class="text-left pl-4">{{ $t('account.time') }}</th>
          </thead>
          <tbody>
            <tr v-if="loadingTxs" class="text-center">
              <td colspan="6" class="py-8">
                <div class="flex justify-center items-center">
                  <div class="loading loading-spinner loading-md"></div>
                  <span class="ml-2">Loading transactions...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="txs.length === 0">
              <td colspan="6" class="py-8">
                <div class="text-center">No transactions found</div>
              </td>
            </tr>
            <tr v-for="(item, i) in txs" :key="item.hash" class="hover:bg-gray-100 dark:hover:bg-[#384059] dark:bg-base-200 bg-white border-0 rounded-xl">
              <td class="text-sm text-primary">
                <RouterLink :to="`/${props.chain}/blocks/${item.block_height}`">
                  {{ item.block_height }}
                </RouterLink>
              </td>
              <td class="truncate text-primary" style="max-width: 200px">
                <RouterLink :to="`/${props.chain}/tx/${item.hash}`">
                  {{ item.hash }}
                </RouterLink>
              </td>
              <td>
                <div class="flex items-center">
                  <span class="mr-2">{{ item.type }}</span>
                  <Icon
                    v-if="item.status === 'success'"
                    icon="mdi-check"
                    class="text-[#60BC29] text-lg"
                  />
                  <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
                </div>
              </td>
              <td>
                {{ format.formatToken({ denom: 'upokt', amount: item.amount }) }}
              </td>
              <td>
                {{ format.formatToken({ denom: 'upokt', amount: item.fee }) }}
              </td>
              <td width="150">{{ format.toDay(item.timestamp, 'from') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center gap-4 my-6">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Show:</span>
          <select 
            v-model="txItemsPerPage" 
            class="select select-bordered select-sm w-20"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-sm text-gray-600">per page</span>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">
            Showing {{ ((currentTxPage - 1) * txItemsPerPage) + 1 }} to {{ Math.min(currentTxPage * txItemsPerPage, totalTxCount) }} of {{ totalTxCount }} transactions
          </span>
          
          <div class="flex items-center gap-1">
            <button
              class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
              @click="currentTxPage = 1"
              :disabled="currentTxPage === 1 || totalTxPages === 0"
            >
              First
            </button>
            <button
              class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
              @click="currentTxPage--"
              :disabled="currentTxPage === 1 || totalTxPages === 0"
            >
              &lt;
            </button>

            <span class="text-xs px-2">
              Page {{ currentTxPage }} of {{ totalTxPages }}
            </span>

            <button
              class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
              @click="currentTxPage++"
              :disabled="currentTxPage === totalTxPages || totalTxPages === 0"
            >
              &gt;
            </button>
            <button
              class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
              @click="currentTxPage = totalTxPages"
              :disabled="currentTxPage === totalTxPages || totalTxPages === 0"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 bg-base-100 shadow rounded p-4">
      <div class="text-lg mb-4 font-semibold">
        <div class="tabs tabs-boxed bg-transparent">
                
                <span class="mr-10">Voting Power Events: </span>
                <a
                    class="tab text-gray-400"
                    :class="{ 'tab-active': selectedEventType === EventType.Delegate }"
                    @click="loadPowerEvents(1, EventType.Delegate)"
                    >{{ $t('account.btn_delegate') }}</a
                >
                <a
                    class="tab text-gray-400"
                    :class="{ 'tab-active': selectedEventType === EventType.Unbond }"
                    @click="loadPowerEvents(1, EventType.Unbond)"
                    >{{ $t('account.btn_unbond') }}</a
                >
            </div>
      </div>
      <div class="rounded overflow-auto">
        <table class="table validatore-table w-full">
          <thead>
            <th class="text-left pl-4">{{ $t('account.delegator') }}</th>
            <th class="text-left pl-4">{{ $t('account.amount') }}</th>
            <th class="text-left pl-4">{{ $t('account.height') }} / {{ $t('account.time') }}</th>
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
                  'text-yes' : selectedEventType === EventType.Delegate,
                  'text-no' : selectedEventType ===  EventType.Unbond,
                }">
                  <RouterLink :to="`/${props.chain}/tx/${item.txhash}`">
                    <span class="mr-2">
                      {{ (selectedEventType === EventType.Delegate ? '+' : '-')}} {{
                      mapEvents(item.events)
                    }}</span>
                  </RouterLink>
                  <Icon
                    v-if="item.code === 0"
                    icon="mdi-check"
                    class="text-yes"
                  />
                  <Icon v-else icon="mdi-multiply" class="text-no" />
                </div>
              </td>
              <td width="150">
                <RouterLink class="text-primary mb-0" :to="`/${props.chain}/blocks/${item.height}`">{{
                  item.height
                }}</RouterLink><br>
                <span class="text-xs pt-0 mt-0">{{ format.toDay(item.timestamp, 'from') }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <PaginationBar :total="events.pagination?.total" :limit="page.limit" :callback="pagePowerEvents"/>
      </div>
    </div>
    <!-- end -->
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
