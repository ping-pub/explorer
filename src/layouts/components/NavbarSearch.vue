<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { onMounted, ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useBlockchain } from '@/stores';
const vueRouters = useRouter();
const blockStore = useBlockchain();
let searchModalShow = ref(false);
let searchQuery = ref('');
let errorMessage = ref('');
let searchType = ref<string[]>([]);
let loadingType = ref(false);
let searchDetails = ref<Record<string, any>[]>([]);

onMounted(() => { });

function closeSearchModal() {
  searchModalShow.value = false;
}
function openSearchModal() {
  searchModalShow.value = true;
}

function preventClick(event: any) {
  event.preventDefault();
  event.stopPropagation();
}

const height = /^\d+$/;
const txhash = /^[A-Z\d]{64}$/;
const addr = /^[a-z\d]+1[a-z\d]{38,58}$/;

async function detectSearchType(query: string) {
  searchType.value = [];
  searchDetails.value = [];
  if (!query) return;
  if (height.test(query)) {
    searchType.value.push('Block Height');
    searchDetails.value.push({ type: 'Block Height', value: query });
    return;
  }
  if (txhash.test(query)) {
    searchType.value.push('Transaction');
    searchDetails.value.push({ type: 'Transaction', value: query });
    return;
  }
  if (addr.test(query)) {
    loadingType.value = true;
    const types: string[] = [];
    const details: Record<string, any>[] = [];
    // Application
    try {
      const app = await blockStore.rpc.getApplicationsInfo(query);
      if (app && app.application) {
        types.push('Application');
        details.push({ type: 'Application', value: query, data: app.application });
      }
    } catch { }
    // Supplier
    try {
      const supplier = await blockStore.rpc.getSuppliersInfo(query);
      if (supplier && supplier.supplier) {
        types.push('Supplier');
        details.push({ type: 'Supplier', value: query, data: supplier.supplier });
      }
    } catch { }
    // Gateway
    try {
      const gateway = await blockStore.rpc.getGatewaysInfo(query);
      if (gateway && gateway.gateway) {
        types.push('Gateway');
        details.push({ type: 'Gateway', value: query, data: gateway.gateway });
      }
    } catch { }
    // Account (always try to fetch balance)
    let accountData = null;
    try {
      const balances = await blockStore.rpc.getBankBalances(query);
      accountData = balances && balances.balances ? balances.balances : [];
    } catch { }
    if (types.length === 0) {
      types.push('Account');
      details.push({ type: 'Account', value: query, balances: accountData });
    } else {
      // If it's also a regular account, add balances info
      details.push({ type: 'Account', value: query, balances: accountData });
    }
    searchType.value = types;
    searchDetails.value = details;
    loadingType.value = false;
    return;
  }
  searchType.value = [];
  searchDetails.value = [];
}

const mainToken = computed(() => {
  // Try to find the main token denom (e.g. POKT)
  // This can be improved if you have a config for the main denom
  return 'POKT';
});

watch(searchQuery, (val) => {
  searchType.value = [];
  if (!val) return;
  detectSearchType(val);
});

function confirm() {
  errorMessage.value = '';
  const key = searchQuery.value;
  searchQuery.value = ''
  if (!key) {
    errorMessage.value = 'Please enter a value!';
    return;
  }
  const current = blockStore?.current?.chainName || '';
  const routeParams = vueRouters?.currentRoute?.value;

  if (!Object.values(routeParams?.params).includes(key)) {
    if (height.test(key)) {
      vueRouters.push({ path: `/${current}/blocks/${key}` });
      setTimeout(() => {
        closeSearchModal();
      }, 1000);
    } else if (txhash.test(key)) {
      vueRouters.push({ path: `/${current}/tx/${key}` });
      setTimeout(() => {
        closeSearchModal();
      }, 1000);
      //     this.$router.push({ name: 'transaction', params: { chain: c.chain_name, hash: key } })
    } else if (addr.test(key)) {
      vueRouters.push({ path: `/${current}/account/${key}` });
      setTimeout(() => {
        closeSearchModal();
      }, 1000);
    } else {
      errorMessage.value = 'The input not recognized';
    }
  }
}
</script>
<template>
  <div>
    <div class="flex">
      <div class="flex items-center relative bg-white dark:bg-[#2a334c] rounded-xl border-[#64748B80] border-1">
        <button class="btn btn-ghost btn-circle btn-sm" @click="confirm">
          <Icon icon="mdi:magnify" class="text-2xl text-[#64748B80] dark:text-gray-400" />
        </button>
        <input class="input w-[22rem] !p-0 !h-[2rem]" v-model="searchQuery"
          placeholder="Height/Transaction/Account Address" />

        <div v-if="searchQuery && (searchDetails.length > 0 || loadingType)"
          class="absolute left-0 top-full mt-1 w-full z-10">
          <div class="dropdown-content bg-base-100 border rounded shadow p-2 min-w-[22rem]">
            <span v-if="loadingType" class="text-xs text-gray-400 flex items-center">
              <Icon icon="mdi:loading" class="animate-spin mr-1" />Detecting...
            </span>
            <template v-else>
              <div v-for="detail in searchDetails" :key="detail.type"
                class="mb-2 last:mb-0 p-2 rounded hover:bg-base-200 transition" @click="confirm">
                <div class="font-bold text-primary text-xs mb-1">{{ detail.type }}</div>
                <div class="font-mono text-xs break-all mb-1">{{ detail.value }}</div>
                <div v-if="detail.balances && detail.balances.length > 0" class="text-xs text-gray-600">
                  <template v-for="bal in detail.balances">
                    <span v-if="bal.denom && (bal.denom.toUpperCase() === mainToken)">
                      {{ bal.amount }} {{ bal.denom.toUpperCase() }}
                    </span>
                  </template>
                </div>
                <div v-else-if="detail.data && detail.data.stake" class="text-xs text-gray-600">
                  Stake: {{ detail.data.stake.amount }} {{ detail.data.stake.denom &&
                    detail.data.stake.denom.toUpperCase() }}
                </div>
                <div v-else class="text-xs text-gray-400">No balance info</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
input::placeholder {
  font-size: 0.85rem;
}
</style>