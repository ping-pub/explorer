<script lang="ts" setup>
import { CosmosRestClient } from '@/libs/client';
import { useDashboard, useFormatter } from '@/stores';
import type { Coin, Delegation } from '@/types';
import { fromBech32, toBase64, toBech32 } from '@cosmjs/encoding';
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { scanLocalKeys, type AccountEntry, scanCompatibleAccounts } from './utils';

const dashboard = useDashboard()
const format = useFormatter()
const editable = ref(false) // to edit addresses
function toggleEdit() {
  editable.value = !editable.value
}

const conf = ref(JSON.parse(localStorage.getItem("imported-addresses") || "{}") as Record<string, AccountEntry[]>)
const balances = ref({} as Record<string, Coin[]>)
const delegations = ref({} as Record<string, Delegation[]>)

scanLocalKeys().forEach(wallet => {
  const { data } = fromBech32(wallet.cosmosAddress)
  const walletKey = toBase64(data)
  let imported = conf.value[walletKey]
  // save the default address to local storage
  if (!imported) {
    imported = []
    dashboard.favorite.forEach(x => {
      const chain = dashboard.chains[x]
      if (chain && wallet.hdPath.indexOf(chain.coinType) === 6) {
        imported.push({
          chainName: chain.chainName,
          logo: chain.logo,
          address: toBech32(chain.bech32Prefix, data),
          coinType: chain.coinType,
          endpoint: chain.endpoints.rest?.at(0)?.address
        })
      }
    })
    conf.value[walletKey] = imported;
    localStorage.setItem("imported-addresses", JSON.stringify(conf.value))
  }
  // load balance & delegations
  imported.forEach(x => {
    if (x.endpoint) {
      const client = CosmosRestClient.newDefault(x.endpoint)
      client.getBankBalances(x.address).then(res => {
        balances.value[x.address] = res.balances.filter(x => x.denom.length < 10)
      })
      client.getStakingDelegations(x.address).then(res => {
        delegations.value[x.address] = res.delegation_responses
      })
    }
  })
})


const accounts = computed(() => {
  let a = [] as AccountEntry[]
  Object.values(conf.value).forEach(x => {
    x.forEach(entry => {
      const delegation = delegations.value[entry.address]
      if (delegation && delegation.length > 0) {
        let amount = 0
        let denom = ""
        delegation.forEach(b => {
          amount += Number(b.balance.amount)
          denom = b.balance.denom
        })
        entry.delegation = { amount: String(amount), denom }
      }
      entry.balances = balances.value[entry.address]
    })
    a = a.concat(x)
  })
  return a
})

const addresses = computed(() => {
  return accounts.value.map(x => (x.address))
})

const availableAccount = computed(() => {
  return scanCompatibleAccounts().filter(x => !addresses.value.includes(x.address))
})

function removeAddress(addr: string) {
  const newConf = {} as Record<string, AccountEntry[]>
  Object.keys(conf.value).forEach(key => {
    newConf[key] = conf.value[key].filter(x => x.address !== addr)
  })
  conf.value = newConf
  localStorage.setItem("imported-addresses", JSON.stringify(conf.value))
}

async function addAddress(acc: AccountEntry) {
  console.log('add', acc)
  const {data} = fromBech32(acc.address)
  const key = toBase64(data)

  if(conf.value[key]) {
    conf.value[key].push(acc)
  } else {
    conf.value[key] = [acc]
  }

  if(acc.endpoint) {
    const client = CosmosRestClient.newDefault(acc.endpoint)
    client.getBankBalances(acc.address).then(res => {
      balances.value[acc.address] = res.balances.filter(x => x.denom.length < 10)
    })
    client.getStakingDelegations(acc.address).then(res => {
      delegations.value[acc.address] = res.delegation_responses
    }) 
  }

  localStorage.setItem("imported-addresses", JSON.stringify(conf.value))
}

</script>
<template>
  <div>
    <div class="overflow-x-auto w-full card ">
      <div class="lg:!flex lg:!items-center lg:!justify-between bg-base-100 p-5">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 sm:!truncate sm:!text-3xl sm:!tracking-tight">Accounts</h2>
          <div class="mt-1 flex flex-col sm:!mt-0 sm:!flex-row sm:!flex-wrap sm:!space-x-6">
            <div class="mt-2 flex items-center text-sm text-gray-500">
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
        <div class="mt-5 flex lg:!ml-4 lg:!mt-0">
          <span class="hidden sm:!block">
            <a href="#address-modal"
              class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <svg class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path
                  d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                <path
                  d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
              </svg>
              Import
            </a>
          </span>

          <span class="ml-3 hidden sm:!block">
            <button type="button"
              class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm"
              @click="toggleEdit">

              <svg class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path
                  d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
              </svg>
              Edit
            </button>
          </span>
        </div>
      </div>
      <table class="table w-full">
        <!-- head -->
        <thead>
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
              <Icon icon="mdi:close-box" class="text-error" @click="removeAddress(acc.address)"></Icon>
            </td>
            <td>
              <RouterLink :to="`/${acc.chainName}/account/${acc.address}`">
                <div class="flex items-center space-x-2">
                  <div class="avatar">
                    <div class="mask mask-squircle w-12 h-12">
                      <img :src="acc.logo" :alt="acc.address" />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold capitalize">{{ acc.chainName }}</div>
                    <div class="text-sm opacity-50 hidden md:!block">{{ acc.address }}</div>
                  </div>
                </div>
              </RouterLink>
            </td>
            <td>
              <div v-if="acc.delegation">
                {{ format.formatToken(acc.delegation, true, '0,0.[0000]', 'all') }}
                <div class="text-xs" :class="format.priceColor(acc.delegation.denom)">${{
                  format.tokenValue(acc.delegation) }}</div>
              </div>
            </td>
            <td>
              <div class="flex">
                <span v-for="b in acc.balances" class="mr-1">
                  {{ format.formatToken(b, true, '0,0.[0000]', 'all') }}
                  <div class="text-xs" :class="format.priceColor(b.denom)">${{ format.tokenValue(b) }} ({{
                    format.showChanges(format.priceChanges(b.denom)) }}%)</div>
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
            <div v-if="editable">

            </div>
          </th>
        </tfoot>
      </table>
    </div>
    <!-- Put this part before </body> tag -->
    <div class="modal" id="address-modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Import Accounts 
          <div class="dropdown dropdown-hover">
          <label tabindex="0" class="btn btn-circle btn-ghost btn-xs text-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </label>
          <div tabindex="0" class="card compact dropdown-content dark:bg-info-content bg-slate-300 shadow rounded-box w-64">
            <div class="card-body">
              <p>Only shows blockchains on your favorite list</p>
            </div>
          </div>
        </div>
      </h3>
      <p class="py-4">
      <table>
        <tr v-for="acc in availableAccount" >
          <td>
            <div class="flex items-center space-x-2">
                  <div class="avatar">
                    <div class="mask mask-squircle w-8 h-8">
                      <img :src="acc.logo" :alt="acc.address" />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold capitalize">{{ acc.chainName }}</div>
                    <div class="text-sm opacity-50 hidden md:!block">{{ acc.address }}</div>
                  </div>
                </div>
          </td>
          <td class="text-right">
            <span class="btn btn-success btn-xs text-white" @click="addAddress(acc)">
              <Icon icon="mdi:plus"/>
            </span>
          </td>
        </tr>
      </table>
      </p>
      <div class="modal-action">
        <a href="#" class="btn">Close</a>
      </div>
    </div>
  </div>
</div></template>
