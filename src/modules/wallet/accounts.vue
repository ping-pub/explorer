<script lang="ts" setup>
import { CosmosRestClient } from '@/libs/client';
import { useBlockchain, useDashboard, useFormatter } from '@/stores';
import type { Coin, CoinWithPrice, Delegation } from '@/types';
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
import AdBanner from '@/components/ad/AdBanner.vue';

const dashboard = useDashboard();
const chainStore = useBlockchain()
const format = useFormatter();
const sourceAddress = ref(''); //
const sourceHdPath = ref("m/44/118/0'/0/0"); //
const selectedSource = ref({} as LocalKey); //
const importStep = ref('step1')

const conf = ref(
  JSON.parse(localStorage.getItem('imported-addresses') || '{}') as Record<
    string,
    AccountEntry[]
  >
);
const balances = ref({} as Record<string, CoinWithPrice[]>);
const delegations = ref({} as Record<string, Delegation[]>);

// initial loading queue 
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
              imported[i].chainName,
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
  let a = [] as {
    key: string,
    subaccounts: {
      account: AccountEntry;
      delegation: CoinWithPrice;
      balances: CoinWithPrice[];
    }[]
  }[];
  Object.values(conf.value).forEach((x) => {
    const composition = x.map((entry) => {
      const d = delegations.value[entry.address];
      let delegation = {} as CoinWithPrice
      if (d && d.length > 0) {
        d.forEach((b) => {
          delegation.amount = (Number(b.balance.amount) + Number(delegation.amount || 0)).toFixed()
          delegation.denom = b.balance.denom;
        });
        delegation.value = format.tokenValueNumber(delegation)
        delegation.change24h = format.priceChanges(delegation.denom)
      }
      return {
        account: entry,
        delegation,
        balances: balances.value[entry.address]
          ? balances.value[entry.address].map(x => {
            const value = format.tokenValueNumber(x)
            return {
              amount: x.amount,
              denom: x.denom,
              value,
              change24h: format.priceChanges(x.denom)
            }
          })
          : []
      }
    });
    if (x.at(0)) a.push({ key: x.at(0)?.address || " ", subaccounts: composition });
  });
  return a;
});

const addresses = computed(() => {
  return accounts.value.flatMap(x => x.subaccounts.map(a => a.account.address))
  // const temp = [] as string[]
  // accounts.value.forEach((x) => x.accounts.forEach(a => {
  //   temp.push(a.account.address)
  // }));
  // return temp
});

const totalValue = computed(() => {
  return accounts.value.flatMap(x => x.subaccounts).reduce((s, e) => {
    s += e.delegation.value || 0
    e.balances.forEach(b => {
      s += b.value || 0
    })
    return s
  }, 0)
})

const totalChange = computed(() => {
  return accounts.value.flatMap(x => x.subaccounts).reduce((s, e) => {
    s += (e.delegation.change24h || 0) * (e.delegation.value || 0) / 100
    e.balances.forEach(b => {
      s += (b.change24h || 0) * (b.value || 0) / 100
    })
    return s
  }, 0)
})

// Adding Model Boxes
const availableAccount = computed(() => {
  if (sourceAddress.value) {
    return scanCompatibleAccounts([{cosmosAddress: sourceAddress.value, hdPath: sourceHdPath.value }]).filter(
      (x) => !addresses.value.includes(x.address)
    );
  }
  return [];
});

// helper functions
// remove address from the list
function removeAddress(addr: string) {
  const newConf = {} as Record<string, AccountEntry[]>;
  Object.keys(conf.value).forEach((key) => {
    const acc = conf.value[key].filter((x) => x.address !== addr);
    if (acc.length > 0) newConf[key] = acc;
  });
  conf.value = newConf;
  localStorage.setItem('imported-addresses', JSON.stringify(conf.value));
}

// add address to the local list
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
    loadBalances(acc.chainName, acc.endpoint, acc.address);
  }

  localStorage.setItem('imported-addresses', JSON.stringify(conf.value));
}

// load balances for an address
async function loadBalances(chainName: string, endpoint: string, address: string) {
  
  const endpointObj = chainStore.randomEndpoint(chainName)
  const client = CosmosRestClient.newDefault(endpointObj?.address || endpoint);
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
    <div class="overflow-x-auto w-full rounded-md">
      <div class="flex flex-wrap justify-between bg-base-100 p-5">
        <div class="min-w-0">
          <h2 class="text-2xl font-bold leading-7 sm:!truncate sm:!text-3xl sm:!tracking-tight">
            Accounts
          </h2>
          <div class="mt-1 flex flex-col sm:!mt-0 sm:!flex-row sm:!flex-wrap sm:!space-x-6">
            <div class="mt-2 items-center text-sm text-gray-500 hidden md:!flex">
              <svg class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z"
                  clip-rule="evenodd" />
                <path
                  d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
              </svg>
              Manage all your assets in one page
            </div>
          </div>
        </div>
        <div class="flex flex-col text-right">
          <span>Total Value</span>
          <span class="text-xl text-success font-bold">${{ format.formatNumber(totalValue, '0,0.[00]') }}</span>
          <span class="text-sm" :class="format.color(totalChange)">{{ format.formatNumber(totalChange, '+0,0.[00]')
          }}</span>
        </div>
      </div>
    </div>

    <AdBanner id="account-banner-ad" unit="banner" width="970px" height="90px" />

    <div class="overflow-x-auto">
      <div v-for="{ key, subaccounts } in accounts" class="bg-base-100 rounded-md my-5 py-5">
        <div class="flex justify-self-center">
          <div class="mx-2 p-2">
            <svg :fill="chainStore.current?.themeColor || '#666CFF'" height="28px" width="28px" version="1.1" id="Capa_1"
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 487.5 487.5"
              xml:space="preserve">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <g>
                    <path
                      d="M437,12.3C437,5.5,431.5,0,424.7,0H126.3C84.4,0,50.4,34.1,50.4,75.9v335.7c0,41.9,34.1,75.9,75.9,75.9h298.5 c6.8,0,12.3-5.5,12.3-12.3V139.6c0-6.8-5.5-12.3-12.3-12.3H126.3c-28.3,0-51.4-23.1-51.4-51.4S98,24.5,126.3,24.5h298.5 C431.5,24.5,437,19,437,12.3z M126.3,151.8h286.2V463H126.3c-28.3,0-51.4-23.1-51.4-51.4V131.7 C88.4,144.2,106.5,151.8,126.3,151.8z">
                    </path>
                    <path
                      d="M130.5,64.8c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.3,12.3,12.3h280.1c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3H130.5z">
                    </path>
                    <path
                      d="M178,397.7c6.3,2.4,13.4-0.7,15.8-7.1l17.9-46.8h62.7c0.5,0,0.9-0.1,1.3-0.1l17.9,46.9c1.9,4.9,6.5,7.9,11.4,7.9 c1.5,0,2.9-0.3,4.4-0.8c6.3-2.4,9.5-9.5,7.1-15.8l-54-141.2c-3-7.9-10.4-13-18.8-13c-8.4,0-15.8,5.1-18.8,13l-54,141.2 C168.5,388.2,171.7,395.2,178,397.7z M243.7,260l22.7,59.3h-45.3L243.7,260z">
                    </path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <div>
            <div class=" max-w-md overflow-hidden"><div class="font-bold">{{ key }}</div></div>
            <div class="dropdown">
              <label tabindex="0" class=" cursor-pointer">{{ subaccounts.length }} addresses</label>
              <ul tabindex="0" class=" -left-14 dropdown-content menu p-2 shadow bg-base-200 rounded-box z-50">
                <li v-for="x in subaccounts">
                <a>
                  <img :src="x.account.logo" class="w-8 h-8 mr-2" />
                  <span class="font-bold capitalize">{{ x.account.chainName }} <br>
                    <span class="text-xs font-normal sm:w-16 sm:overflow-hidden">{{ x.account.address }}</span>
                  </span>
                  <label class=" btn btn-xs !btn-error" @click="removeAddress(x.account.address)">Remove</label>
                </a>
              </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="p-4 bg-base-200 mt-2">Delegations</div>
        <div>
          <ul class="!menu w-full">
            <div v-for="x in subaccounts">
              <li v-if="x.delegation.amount">
                <RouterLink :to="`/${x.account.chainName}/account/${x.account.address}`">
                  <img :src="x.account.logo" class="w-6 h-6 mr-2" />
                  <span class="font-bold">{{ format.formatToken(x.delegation, true, '0,0.[00]', 'all') }} <br><span
                      class="text-xs" :class="format.color(x.delegation.change24h)">{{
                        format.formatNumber(x.delegation.change24h, '+0.[00]') }}%</span></span>
                  <span class="float-right text-right">${{ format.formatNumber(x.delegation.value, '0,0.[00]') }}<br><span
                      class="text-xs" :class="format.color(x.delegation.change24h)">{{
                        format.formatNumber((x.delegation.change24h || 0) * (x.delegation.value || 0) / 100, '+0,0.[00]')
                      }}</span></span>
                </RouterLink>                
              </li>
            </div>
          </ul>
        </div>
        <div class="p-4 bg-base-200">Balances</div>
        <div>
          <ul class="!menu w-full">
            <div v-for="s in subaccounts">
              <li v-for="x in s.balances">
                <RouterLink :to="`/${s.account.chainName}/account/${s.account.address}`">
                  <img :src="s.account.logo" class="w-6 h-6 mr-2" />
                  <span class="font-bold">{{ format.formatToken(x, true, '0,0.[00]', 'all') }} <br><span
                      class="text-xs" :class="format.color(x.change24h)">{{ format.formatNumber(x.change24h, '+0.[00]')
                      }}%</span></span>
                  <span class="float-right text-right">${{ format.formatNumber(x.value, '0,0.[00]') }}<br><span
                      class="text-xs" :class="format.color(x.change24h)">{{ format.formatNumber((x.change24h || 0) *
                        (x.value || 0) / 100, '+0,0.[00]') }}</span></span>
                </RouterLink>
              </li>
            </div>
          </ul>
        </div>
      </div>

      <div class=" text-center bg-base-100 rounded-md my-4 p-4">
        <a href="#address-modal"
          class="inline-flex items-center ml-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <svg class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
            <path
              d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
          </svg>
          Import Address
        </a>
      </div>
    </div>
    <!-- Put this part before </body> tag -->
    <div class="modal" id="address-modal">
      <div class="modal-box">
        <a href="#" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</a>
        <h3 class="font-bold text-lg mb-2">Derive Account From Address</h3>
        <div>
          <label class="my-2">
            <input v-model="sourceAddress" class="input input-bordered w-full input-sm" placeholder="Input an address" @change="importStep = 'step2'" />
            <input v-model="sourceHdPath" class="input input-bordered w-full input-sm" placeholder="m/44/118/0'/0/0" />
          </label>
        </div>
        <div v-show="importStep === 'step2'" class="py-4 max-h-72 overflow-y-auto">
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
                    <div class="tooltip" :class="acc.compatiable ? 'tooltip-success' : 'tooltip-error'
                      " :data-tip="`Coin Type: ${acc.coinType}`">
                      <div class="font-bold capitalize" :class="acc.compatiable ? 'text-green-500' : 'text-red-500'
                        ">
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
                <span class="btn !bg-yes !border-yes btn-xs text-white" @click="addAddress(acc)">
                  <Icon icon="mdi:plus" />
                </span>
              </td>
            </tr>
          </table>
        </div>
        <div class="modal-action mt-2 mb-0">
          <a href="#" class="btn btn-primary btn-sm" @click="importStep = 'step1'">Close</a>
        </div>
      </div>
    </div>
  </div>
</template>
