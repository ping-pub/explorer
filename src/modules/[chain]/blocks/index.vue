<script lang="ts" setup>
import { computed, ref, reactive, onMounted, nextTick, onBeforeUnmount, watch } from 'vue';
import { useBaseStore, useFormatter } from '@/stores';
import { PageRequest, type Pagination, type Block } from '@/types';
import { formatDate } from '@vueuse/core';

const props = defineProps(['chain']);
const tab = ref('blocks');
const base = useBaseStore();
const format = useFormatter();

// Server-side blocks fetching (consistent with TX page)
interface ApiBlockItem {
  id: string;
  height: number;
  hash: string;
  timestamp: string;
  proposer: string;
  chain: string;
  transaction_count?: number;
}

const getApiChainName = (chainName: string) => {
  const chainMap: Record<string, string> = {
    'pocket-beta': 'pocket-testnet-beta',
    'pocket-alpha': 'pocket-testnet-alpha',
    'pocket-mainnet': 'pocket-mainnet'
  };
  return chainMap[chainName] || chainName || 'pocket-testnet-beta';
};

import { useBlockchain } from '@/stores';
const chainStore = useBlockchain();
const apiChainName = computed(() => getApiChainName(chainStore.current?.chainName || props.chain || 'pocket-beta'));

const blocks = ref<ApiBlockItem[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(25);
const totalBlocks = ref(0);
const totalPages = ref(0);
const pageSizeOptions = [10, 25, 50, 100];

async function loadBlocks() {
  loading.value = true;
  try {
    const url = `/api/v1/blocks?chain=${apiChainName.value}&page=${currentPage.value}&limit=${itemsPerPage.value}`;
    const res = await fetch(url);
    const data = await res.json();
    if (res.ok) {
      blocks.value = data.data || [];
      totalBlocks.value = data.meta?.total || 0;
      totalPages.value = data.meta?.totalPages || 0;
    } else {
      blocks.value = [];
      totalBlocks.value = 0;
      totalPages.value = 0;
      console.error('Error loading blocks:', data);
    }
  } catch (e) {
    console.error('Error loading blocks:', e);
    blocks.value = [];
    totalBlocks.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
}

watch(itemsPerPage, () => {
  currentPage.value = 1;
  loadBlocks();
});

watch(currentPage, () => {
  loadBlocks();
});

watch(apiChainName, (n, o) => {
  if (n !== o) {
    currentPage.value = 1;
    loadBlocks();
  }
});

onMounted(() => {
  loadBlocks();
});

// ✅ Pagination functions
function goToFirst() {
  if (currentPage.value !== 1) currentPage.value = 1;
}
function goToLast() {
  if (currentPage.value !== totalPages.value) currentPage.value = totalPages.value;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
</script>

<template>
  <div>
    <p class="flex items-center justify-start bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-2 my-4 font-bold text-white">
      Blocks
    </p>

    <div class="tabs tabs-boxed bg-transparent mb-4">
      <a
        class="tab text-gray-400 uppercase"
        :class="{ 'tab-active': tab === 'blocks' }"
        @click="tab = 'blocks'"
      >
        {{ $t('block.recent') }}
      </a>
      <RouterLink
        class="tab text-gray-400 uppercase"
        :to="`/${chain}/blocks/${Number(base.latest?.block?.header.height || 0) + 10000}`"
      >
        {{ $t('block.future') }}
      </RouterLink>
    </div>

    <div
      v-show="tab === 'blocks'"
      class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-4 rounded-xl shadow-md mb-4"
    >
      <div class="bg-base-200 rounded-md overflow-auto">
        <table class="table table-compact w-full">
          <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
            <tr class="border-b-[0px]">
              <th class="">{{ $t('block.block_header') }}</th>
              <th class="">{{ $t('account.hash') }}</th>
              <th class="">{{ $t('block.proposer') }}</th>
              <th class="">{{ $t('account.no_of_transactions') }}</th>
              <th class="">{{ $t('account.time') }}</th>
              <th class="">{{ $t('block.relay') }}</th>
              <th class="">{{ $t('block.size') }}</th>
            </tr>
          </thead>

          <tbody class="bg-base-100 relative">
            <tr v-if="loading">
              <td colspan="7" class="py-8">
                <div class="flex justify-center items-center">
                  <div class="loading loading-spinner loading-md"></div>
                  <span class="ml-2">Loading blocks...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="!loading && blocks.length === 0">
              <td colspan="7" class="py-8 text-center text-gray-500">
                No blocks found
              </td>
            </tr>
            <tr v-else v-for="block in blocks" :key="block.id"
              class="hover:bg-gray-100 dark:hover:bg-[#384059] dark:bg-base-200 bg-white border-0 rounded-xl">
              <td class="font-medium dark:text-warning text-[#09279F]">
                {{ block.height }}
              </td>
              <td class="truncate dark:text-warning text-[#09279F]" style="max-width: 18rem; overflow: hidden">
                <RouterLink class="truncate hover:underline" :title="block.hash" :to="`/${chain}/blocks/${block.height}`">
                  {{ block.hash || block.id.split(':')[1] }}
                </RouterLink>
              </td>
              <td>{{ format.validator(block.proposer) }}</td>
              <td>{{ (block.transaction_count ?? 0).toLocaleString() }}</td>
              <td>{{ format.toDay(block.timestamp, 'from') }}</td>
              <td>{{ 0 }}</td>
              <td>0 bytes</td>
            </tr>
          </tbody>
        </table>

        <!-- ✅ Pagination Bar -->
        <div class="flex justify-between items-center gap-4 my-6 px-6">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Show:</span>
            <select v-model="itemsPerPage" class="select select-bordered select-sm w-20">
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
            <span class="text-sm text-gray-600">per page</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">
              Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalBlocks) }} of {{ totalBlocks }} blocks
            </span>
            <div class="flex items-center gap-1">
              <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
                @click="goToFirst" :disabled="currentPage === 1 || totalPages === 0">First</button>
              <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
                @click="prevPage" :disabled="currentPage === 1 || totalPages === 0">&lt;</button>
              <span class="text-xs px-2">Page {{ currentPage }} of {{ totalPages }}</span>
              <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
                @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">&gt;</button>
              <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
                @click="goToLast" :disabled="currentPage === totalPages || totalPages === 0">Last</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'blocks',
        order: 2
      }
    }
  </route>

<style scoped>
.table tr.h-0 {
    display: table-row;
    line-height: 0;
    height: 0;
}
.table tr.h-0 td {
    padding: 0;
    border: none;
}
.page-btn:hover {
  background-color: #e9ecef;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
