<script lang="ts" setup>
import { CosmosRestClient } from '@/libs/client';
import { useDashboard, useFormatter } from '@/stores';
import type { Coin, Delegation } from '@/types';
import { fromBech32, toBase64, toBech32, toHex } from '@cosmjs/encoding';
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { ref } from 'vue';
import {
  scanLocalKeys,
  type AccountEntry,
  scanCompatibleAccounts,
  type LocalKey,
} from './utils';

const dashboard = useDashboard();
const format = useFormatter();
const editable = ref(false); // to edit addresses
const sourceAddress = ref(''); //
const selectedSource = ref({} as LocalKey); //
function toggleEdit() {
  editable.value = !editable.value;
}

const conf = ref(
  JSON.parse(localStorage.getItem('imported-addresses') || '{}') as Record<
    string,
    AccountEntry[]
  >
);
const balances = ref({} as Record<string, Coin[]>);
const delegations = ref({} as Record<string, Delegation[]>);

// load balances
Object.values(conf.value).forEach((imported) => {
  let promise = Promise.resolve();
  for (let i = 0; i < imported.length; i++) {
    promise = promise.then(
      () =>
        new Promise((resolve) => {
          // continue only if the page is living
          if (imported[i].endpoint) {
            loadBalances(
              imported[i].endpoint || '',
              imported[i].address
            ).finally(() => resolve());
          } else {
            resolve();
          }
        })
    );
  }
});

const accounts = computed(() => {
  let a = [] as AccountEntry[];
  Object.values(conf.value).forEach((x) => {
    x.forEach((entry) => {
      const delegation = delegations.value[entry.address];
      if (delegation && delegation.length > 0) {
        let amount = 0;
        let denom = '';
        delegation.forEach((b) => {
          amount += Number(b.balance.amount);
          denom = b.balance.denom;
        });
        entry.delegation = { amount: String(amount), denom };
      } else {
        entry.delegation = undefined;
      }
      entry.balances = balances.value[entry.address];
    });
    a = a.concat(x);
  });
  return a;
});

const addresses = computed(() => {
  return accounts.value.map((x) => x.address);
});

const sourceOptions = computed(() => {
  // scan all connected wallet
  const keys = scanLocalKeys();
  // all existed keys
  Object.values(conf.value).forEach((x) => {
    const [first] = x;
    if (first) {
      const { data } = fromBech32(first.address);
      const hex = toHex(data);
      if (
        keys.findIndex(
          (k) => toHex(fromBech32(k.cosmosAddress).data) === hex
        ) === -1
      ) {
        keys.push({
          cosmosAddress: first.address,
          hdPath: `m/44/${first.coinType}/0'/0/0`,
        });
      }
    }
  });
  // address
  if (sourceAddress.value) {
    const { prefix, data } = fromBech32(sourceAddress.value);
    const chain = Object.values(dashboard.chains).find(
      (x) => x.bech32Prefix === prefix
    );
    if (chain) {
      keys.push({
        cosmosAddress: sourceAddress.value,
        hdPath: `m/44/${chain.coinType}/0'/0/0`,
      });
    }
  }
  if (!selectedSource.value.cosmosAddress && keys.length > 0) {
    selectedSource.value = keys[0];
  }
  return keys;
});

const availableAccount = computed(() => {
  if (selectedSource.value.cosmosAddress) {
    return scanCompatibleAccounts([selectedSource.value]).filter(
      (x) => !addresses.value.includes(x.address)
    );
  }
  return [];
});

function removeAddress(addr: string) {
  const newConf = {} as Record<string, AccountEntry[]>;
  Object.keys(conf.value).forEach((key) => {
    const acc = conf.value[key].filter((x) => x.address !== addr);
    if (acc.length > 0) newConf[key] = acc;
  });
  conf.value = newConf;
  localStorage.setItem('imported-addresses', JSON.stringify(conf.value));
}

async function addAddress(acc: AccountEntry) {
  const { data } = fromBech32(acc.address);
  const key = toBase64(data);

  if (conf.value[key]) {
    // existed
    if (conf.value[key].findIndex((x) => x.address === acc.address) > -1) {
      return;
    }
    conf.value[key].push(acc);
  } else {
    conf.value[key] = [acc];
  }

  // also add chain to favorite
  if (!dashboard?.favoriteMap?.[acc.chainName]) {
    dashboard.favoriteMap[acc.chainName] = true;
    window.localStorage.setItem(
      'favoriteMap',
      JSON.stringify(dashboard.favoriteMap)
    );
  }

  if (acc.endpoint) {
    loadBalances(acc.endpoint, acc.address);
  }

  localStorage.setItem('imported-addresses', JSON.stringify(conf.value));
}

async function loadBalances(endpoint: string, address: string) {
  const client = CosmosRestClient.newDefault(endpoint);
  await client.getBankBalances(address).then((res) => {
    balances.value[address] = res.balances.filter((x) => x.denom.length < 10);
  });
  await client.getStakingDelegations(address).then((res) => {
    delegations.value[address] = res.delegation_responses;
  });
}
</script>
<template>
  <div>
    <div class="overflow-x-auto w-full card">
      <div
        class="lg:!flex lg:!items-center lg:!justify-between bg-base-100 p-5"
      >
        <div class="min-w-0 flex-1">
          <h2
            class="text-2xl font-bold leading-7 sm:!truncate sm:!text-3xl sm:!tracking-tight"
          >
            Accounts
          </h2>
          <div
            class="mt-1 flex flex-col sm:!mt-0 sm:!flex-row sm:!flex-wrap sm:!space-x-6"
          >
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg
                class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z"
                  clip-rule="evenodd"
                />
                <path
                  d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z"
                />
              </svg>
              Manage all your assets in one page
            </div>
          </div>
        </div>
        <div class="mt-5 flex lg:!ml-4 lg:!mt-0"></div>
      </div>
      <div class="overflow-x-auto">
        <table class="table table-compact w-full">
          <!-- head -->
          <thead class="rounded-none">
            <tr>
              <th v-if="editable"></th>
              <th>Account</th>
              <th>Delegation</th>
              <th>Balance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="acc in accounts">
              <td v-if="editable">
                <Icon
                  icon="mdi:close-box"
                  class="text-error"
                  @click="removeAddress(acc.address)"
                ></Icon>
              </td>
              <td class="px-4">
                <RouterLink :to="`/${acc.chainName}/account/${acc.address}`">
                  <div class="flex items-center space-x-2">
                    <div class="avatar">
                      <div class="mask mask-squircle w-8 h-8">
                        <img :src="acc.logo" :alt="acc.address" />
                      </div>
                    </div>
                    <div>
                      <div class="font-bold capitalize">
                        {{ acc.chainName }}
                      </div>
                      <div class="text-sm opacity-50 hidden md:!block">
                        {{ acc.address }}
                      </div>
                    </div>
                  </div>
                </RouterLink>
              </td>
              <td>
                <div v-if="acc.delegation">
                  {{
                    format.formatToken(
                      acc.delegation,
                      true,
                      '0,0.[0000]',
                      'all'
                    )
                  }}
                  <div
                    class="text-xs"
                    :class="format.priceColor(acc.delegation.denom)"
                  >
                    ${{ format.tokenValue(acc.delegation) }}
                  </div>
                </div>
              </td>
              <td>
                <div class="flex">
                  <span v-for="b in acc.balances" class="mr-1">
                    {{ format.formatToken(b, true, '0,0.[0000]', 'all') }}
                    <div class="text-xs" :class="format.priceColor(b.denom)">
                      ${{ format.tokenValue(b) }} ({{
                        format.showChanges(format.priceChanges(b.denom))
                      }}%)
                    </div>
                  </span>
                </div>
              </td>
              <th>
                <button class="btn btn-ghost btn-xs hidden">details</button>
              </th>
            </tr>
          </tbody>
          <tfoot>
            <th colspan="10">
              <div class="flex justify-between">
                <span class="hidden sm:!block">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm"
                    @click="toggleEdit"
                  >
                    <svg
                      class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"
                      />
                    </svg>
                    Edit
                  </button>
                  <a
                    href="#address-modal"
                    class="inline-flex items-center ml-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <svg
                      class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"
                      />
                      <path
                        d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"
                      />
                    </svg>
                    Import
                  </a>
                </span>
                <RouterLink to="/wallet/keplr" class="btn btn-sm">
                  Add chain to Keplr
                </RouterLink>
              </div>
            </th>
          </tfoot>
        </table>
      </div>
    </div>
    <!-- Put this part before </body> tag -->
    <div class="modal" id="address-modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-2">Derive Account From Address</h3>

        <div>
          <label class="input-group input-group-sm w-full">
            <span>Connected</span>
            <select
              v-model="selectedSource"
              class="select select-bordered select-sm w-3/4"
            >
              <option v-for="source in sourceOptions" :value="source">
                <span class="overflow-hidden">{{ source.cosmosAddress }}</span>
              </option>
            </select>
          </label>
          <label class="input-group input-group-sm my-2">
            <span>Custom</span>
            <input
              v-model="sourceAddress"
              class="input input-bordered w-full input-sm"
              placeholder="Input an address"
            />
          </label>
        </div>
        <div class="py-4 max-h-72 overflow-y-auto">
          <table class="table table-compact">
            <tr v-for="acc in availableAccount">
              <td>
                <div class="flex items-center space-x-2">
                  <div class="avatar">
                    <div class="mask mask-squircle w-8 h-8">
                      <img :src="acc.logo" :alt="acc.address" />
                    </div>
                  </div>
                  <div>
                    <div
                      class="tooltip"
                      :class="
                        acc.compatiable ? 'tooltip-success' : 'tooltip-error'
                      "
                      :data-tip="`Coin Type: ${acc.coinType}`"
                    >
                      <div
                        class="font-bold capitalize"
                        :class="
                          acc.compatiable ? 'text-green-500' : 'text-red-500'
                        "
                      >
                        {{ acc.chainName }}
                      </div>
                    </div>
                    <div class="text-xs opacity-50 hidden md:!block">
                      {{ acc.address }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="text-right">
                <span
                  class="btn !bg-yes !border-yes btn-xs text-white"
                  @click="addAddress(acc)"
                >
                  <Icon icon="mdi:plus" />
                </span>
              </td>
            </tr>
          </table>
        </div>
        <div class="modal-action mt-2 mb-0">
          <a href="#" class="btn btn-primary btn-sm">Close</a>
        </div>
      </div>
    </div>
  </div>
</template>
