<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useBlockchain, useFormatter } from '@/stores';
  import { PageRequest, type Pagination, type Gateway } from '@/types';

  const props = defineProps<{ chain: string }>();

  const chainStore = useBlockchain();
  const format = useFormatter();

  const list = ref<Gateway[]>([]);
  const pageRequest = ref(new PageRequest());
  const pageResponse = ref({} as Pagination);

  const currentPage = ref(1);
  const itemsPerPage = 10;

  // 🔹 total pages calculate
  const totalPages = computed(() =>
    Math.ceil(parseInt(pageResponse.value.total || '0') / itemsPerPage)
  );

  // 🔹 Sorted aur paginated data
  const sortedList = computed(() => {
    return [...list.value].sort((a, b) => {
      const aValue = parseInt(a.stake.amount || '0');
      const bValue = parseInt(b.stake.amount || '0');
      return bValue - aValue; // descending order
    });
  });

  const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedList.value.slice(start, end);
  });

  // 🔹 Pagination methods
  function goToFirst() {
    if (currentPage.value !== 1) {
      currentPage.value = 1;
      pageloadInit(1);
    }
  }

  function goToLast() {
    if (currentPage.value !== totalPages.value) {
      currentPage.value = totalPages.value;
      pageloadInit(totalPages.value);
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      pageloadInit(currentPage.value);
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
      pageloadInit(currentPage.value);
    }
  }

  // 🔹 Load data from RPC
  function pageloadInit(page: number) {
    pageRequest.value.setPage(page);
    chainStore.rpc.getGateways(pageRequest.value).then((x) => {
      list.value = x.gateways;
      pageResponse.value = x.pagination;
    });
  }

  // 🔹 Status text
  const value = ref('stake');
  const statusText = computed(() => (value.value === 'stake' ? 'Staked' : 'Unstaked'));

  // 🔹 On mount load first page
  onMounted(() => {
    pageloadInit(1);
  });
</script>

<template>
  <div class="mb-[2vh]">
    <p class="bg-[#09279F] text-2xl rounded-xl px-4 py-4 my-4 font-bold text-white">
      Gateways
    </p>

    <div
      class="bg-[#EFF2F5] dark:bg-base-100 rounded-xl px-2 pt-2 pb-2 gatewaysContainer"
      style="height: 78vh; overflow: auto"
    >
      <table class="table w-full table-compact">
        <thead class="dark:bg-base-100 bg-white sticky top-0 z-10">
          <tr class="text-sm font-semibold">
            <th>Rank</th>
            <th>Address</th>
            <th>Status</th>
            <th>Stake</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in paginatedList"
            :key="item.address"
            class="hover:bg-gray-100 dark:hover:bg-base-200 transition"
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
      <div class="flex justify-end items-center gap-2 my-6 px-6">
        <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
          @click="goToFirst" :disabled="currentPage === 1"
          >
          First
        </button>
        <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
          @click="prevPage" :disabled="currentPage === 1"
          >
          &lt;
        </button>

        <span class="text-xs">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
          @click="nextPage" :disabled="currentPage === totalPages"
          >
          &gt;
        </button>
        <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
          @click="goToLast" :disabled="currentPage === totalPages"
          >
          Last
        </button>
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
