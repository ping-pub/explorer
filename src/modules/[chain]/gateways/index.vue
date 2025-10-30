<script lang="ts" setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useBlockchain, useFormatter } from '@/stores';
  import { PageRequest, type Pagination, type Gateway } from '@/types';

  const props = defineProps<{ chain: string }>();

  const chainStore = useBlockchain();
  const format = useFormatter();

  const list = ref<Gateway[]>([]);
  const loading = ref(false);
  const pageRequest = ref(new PageRequest());
  const pageResponse = ref({} as Pagination);

  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  // 🔹 Server-side pagination logic
  const totalPages = computed(() => {
    const total = parseInt(pageResponse.value.total || '0');
    if (total === 0) return 0;
    return Math.ceil(total / itemsPerPage.value);
  });

  const totalGateways = computed(() => parseInt(pageResponse.value.total || '0'));

  // 🔹 Client-side sorting (applied after server returns page data)
  const sortedList = computed(() => {
    return [...list.value].sort((a, b) => {
      const aValue = parseInt(a.stake.amount || '0');
      const bValue = parseInt(b.stake.amount || '0');
      return bValue - aValue; // descending order
    });
  });

  // 🔹 Watch for page changes
  watch(currentPage, () => {
    loadGateways();
  });

  // 🔹 Watch for page size changes
  watch(itemsPerPage, () => {
    currentPage.value = 1;
    loadGateways();
  });

  // 🔹 Load data from RPC
  async function loadGateways() {
    if (!chainStore.rpc) {
      await waitForRpc();
    }
    
    loading.value = true;
    try {
      pageRequest.value.setPageSize(itemsPerPage.value);
      pageRequest.value.setPage(currentPage.value);
      pageRequest.value.count_total = true;
      
      const response = await chainStore.rpc.getGateways(pageRequest.value);
      list.value = response.gateways || [];
      pageResponse.value = response.pagination || {};
    } catch (error) {
      console.error('Error loading gateways:', error);
      list.value = [];
      pageResponse.value = {} as Pagination;
    } finally {
      loading.value = false;
    }
  }

  async function waitForRpc() {
    while (!chainStore.rpc) {
      console.log('⏳ Waiting for chainStore.rpc...');
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // 🔹 Pagination methods
  function goToFirst() {
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
  }

  function goToLast() {
    if (currentPage.value !== totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }

  // 🔹 Status text
  const value = ref('stake');
  const statusText = computed(() => (value.value === 'stake' ? 'Staked' : 'Unstaked'));

  // 🔹 On mount load first page
  onMounted(() => {
    loadGateways();
  });
</script>

<template>
  <div class="mb-[2vh]">
    <p class="bg-[#09279F] text-2xl rounded-xl px-4 py-4 my-4 font-bold text-white">
      Gateways
    </p>

    <div
      class="bg-base-200 dark:bg-base-100 rounded-xl px-2 pt-2 pb-2 gatewaysContainer"
      style="max-height: 78vh; overflow: auto"
    >
      <table class="table w-full table-compact">
        <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
          <tr class="text-sm font-semibold">
            <th>Rank</th>
            <th>Address</th>
            <th>Status</th>
            <th>Stake</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading" class="text-center">
            <td colspan="5" class="py-8">
              <div class="flex justify-center items-center">
                <div class="loading loading-spinner loading-md"></div>
                <span class="ml-2">Loading gateways...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="sortedList.length === 0" class="text-center">
            <td colspan="5" class="py-8">
              <div class="text-gray-500">No gateways found</div>
            </td>
          </tr>
          <tr
            v-else
            v-for="(item, index) in sortedList"
            :key="item.address"
            class="hover:bg-gray-100 dark:hover:bg-[#384059] dark:bg-base-200 bg-white border-0 rounded-xl"
          >
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>

            <td>
              <div class="flex flex-col">
                <RouterLink
                  :to="`/${chainStore.chainName}/account/${item?.address}`"
                  class="text-sm text-[#09279F] dark:invert font-medium truncate"
                >
                  {{ item.address }}
                </RouterLink>
                <span class="text-xs text-gray-500 truncate">{{ item.address }}</span>
              </div>
            </td>

            <td class="text-success">{{ statusText }}</td>
            <td class="font-bold dark:text-secondary">{{ format.formatToken(item.stake) }}</td>
            <td class="dark:text-secondary">{{ item.balance ? format.formatToken(item.balance) : '-' }}</td>
          </tr>
        </tbody>
      </table>

      <!-- ✅ Pagination -->
      <div class="flex justify-between items-center gap-4 my-6 px-6">
        <!-- Page Size Dropdown -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Show:</span>
          <select 
            v-model="itemsPerPage" 
            class="select select-bordered select-sm w-20"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-sm text-gray-600">per page</span>
        </div>

        <!-- Pagination Info and Controls -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalGateways) }} of {{ totalGateways }} gateways
          </span>
          
          <div class="flex items-center gap-1">
            <button
              class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
              @click="goToFirst"
              :disabled="currentPage === 1 || totalPages === 0"
            >
              First
            </button>
            <button
              class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
              @click="prevPage"
              :disabled="currentPage === 1 || totalPages === 0"
            >
              &lt;
            </button>

            <span class="text-xs px-2">
              Page {{ currentPage }} of {{ totalPages }}
            </span>

            <button
              class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
              @click="nextPage" 
              :disabled="currentPage === totalPages || totalPages === 0"
            >
              &gt;
            </button>
            <button
              class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
              @click="goToLast" 
              :disabled="currentPage === totalPages || totalPages === 0"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<route>
  {
    meta: {
      i18n: 'gateways',
      order: 6
    }
  }
</route>

<style scoped>
.page-btn:hover {
  background-color: #e9ecef;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
