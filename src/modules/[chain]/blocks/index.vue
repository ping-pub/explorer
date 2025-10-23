<script lang="ts" setup>
import { computed, ref, reactive, onMounted, nextTick, onBeforeUnmount, watch } from 'vue';
import { useBaseStore, useFormatter } from '@/stores';
import { PageRequest, type Pagination, type Block } from '@/types';
import { formatDate } from '@vueuse/core';

const props = defineProps(['chain']);
const tab = ref('blocks');
const base = useBaseStore();
const format = useFormatter();

const list = computed(() => base.recents);

const pageRequest = ref(new PageRequest());
const pageResponse = ref({} as Pagination);

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() =>
  Math.ceil(parseInt(pageResponse.value.total || list.value.length.toString()) / itemsPerPage)
);

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return list.value.slice(start, end);
});

function pageload(p: number) {
  pageRequest.value.setPage(p);
}

onMounted(() => {
  pageload(1);
  pageRequest.value.setPageSize(10);
  pageResponse.value = {
    total: base.latest?.block?.header.height
  };
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
          <thead class="sticky top-0 bg-white">
            <tr class="border-b-[0px]">
              <th class="bg-white dark:bg-base-200">{{ $t('block.block_header') }}</th>
              <th class="bg-white dark:bg-base-200">{{ $t('account.hash') }}</th>
              <th class="bg-white dark:bg-base-200">{{ $t('block.proposer') }}</th>
              <th class="bg-white dark:bg-base-200">{{ $t('account.no_of_transactions') }}</th>
              <th class="bg-white dark:bg-base-200">{{ $t('account.time') }}</th>
              <th class="bg-white dark:bg-base-200">{{ $t('block.relay') }}</th>
              <th class="bg-white dark:bg-base-200">{{ $t('block.size') }}</th>
            </tr>
          </thead>

          <tbody class="bg-base-100 relative">
            <tr
              v-for="(item, i) in paginatedList"
              :key="i"
              class="transition-colors duration-200 border-none"
            >
              <td class="font-medium dark:text-warning text-[#09279F]">
                {{ item.block.header.height }}
              </td>
              <td
                class="truncate dark:text-warning text-[#09279F]"
                style="max-width: 18rem; overflow: hidden"
              >
                <RouterLink
                  class="truncate hover:underline"
                  :title="item.block_id.hash"
                  :to="`/${chain}/blocks/${item.block.header.height}`"
                >
                  {{ item.block_id.hash }}
                </RouterLink>
              </td>
              <td>{{ format.validator(item.block?.header?.proposer_address) }}</td>
              <td>{{ item.block?.data?.txs.length }}</td>
              <td>{{ format.toDay(item.block?.header?.time, 'from') }}</td>
              <td>{{ item.block?.header?.extensions?.[0]?.relay_count || 0 }}</td>
              <td>
                {{ item.block?.data?.txs?.length ? item.block.data.txs.join(', ').length : 0 }}
                bytes
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ✅ Pagination Bar -->
        <div class="flex justify-end items-center gap-2 my-6 px-6">
          <button
            class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="goToFirst"
            :disabled="currentPage === 1"
          >
            First
          </button>
          <button
            class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            &lt;
          </button>

          <span class="text-xs">
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <button
            class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            &gt;
          </button>
          <button
            class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"            @click="goToLast"
            :disabled="currentPage === totalPages"
          >
            Last
          </button>
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
