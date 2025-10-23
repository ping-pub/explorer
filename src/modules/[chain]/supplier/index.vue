<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type Pagination, type Supplier } from '@/types';

const props = defineProps(['chain']);

const format = useFormatter();
const chainStore = useBlockchain();

const list = ref<Supplier[]>([]);
const pageRequest = ref(new PageRequest());
const pageResponse = ref<Pagination>({} as Pagination);

// 🔹 Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => Math.ceil(list.value.length / itemsPerPage));

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return list.value.slice(start, end);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function goToFirst() {
  currentPage.value = 1;
}
function goToLast() {
  currentPage.value = totalPages.value;
}

// 🔹 Load data initially
onMounted(() => {
  pageloadInit(1);
});

function pageloadInit(p: number) {
  pageRequest.value.setPage(p);
  chainStore.rpc.getSuppliers(pageRequest.value).then((x) => {
    list.value = x.supplier;
    pageResponse.value = x.pagination;
  });
}

// 🔹 Computed status
const value = ref('stake');
const statusText = computed(() => (value.value === 'stake' ? 'Staked' : 'Unstaked'));
</script>

<template>
  <div class="mb-[2vh]">
    <p
      class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-3 my-4 font-bold text-white"
    >
      Suppliers
    </p>

    <!-- ✅ Scroll hataya gaya -->
    <div
      class="bg-[#EFF2F5] dark:bg-base-100 rounded-xl p-3"
    >
      <table class="table w-full table-compact rounded-xl">
        <thead class="dark:bg-base-100 bg-white sticky top-0">
          <tr>
            <td>Rank</td>
            <td>Address</td>
            <td>Status</td>
            <td>Stake</td>
            <td>Balance</td>
            <td>No. Of Services</td>
            <td>Services</td>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in paginatedList.sort((a: any, b: any) => parseInt(b.stake.amount) - parseInt(a.stake.amount))"
            :key="item.operator_address"
            class="hover dark:bg-base-200 bg-white rounded-xl"
          >
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td>
              <div class="flex flex-col">
                <span class="text-sm text-[#09279F] dark:invert whitespace-nowrap overflow-hidden">
                  <RouterLink
                    :to="`/${chainStore.chainName}/account/${item?.operator_address}`"
                    class="font-weight-medium"
                  >
                    {{ item.operator_address }}
                  </RouterLink>
                </span>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  Owned by: {{ item.owner_address }}
                </span>
              </div>
            </td>
            <td class="text-success">{{ statusText }}</td>
            <td class="font-bold dark:text-secondary">
              {{ format.formatToken(item.stake) }}
            </td>
            <td class="dark:text-secondary">
              {{ format.formatToken(item.balance) }}
            </td>
            <td>{{ item.services?.length || 0 }}</td>
            <td>
              <span v-if="item.services?.length <= 5">
                {{
                  item.services
                    ?.map((sc: any) =>
                      sc.service_name?.length > 0 ? sc.service_name : sc.service_id
                    )
                    .join(', ')
                }}
              </span>
              <span v-else>
                {{
                  item.services
                    .slice(0, 5)
                    .map((sc: any) =>
                      sc.service_name?.length > 0 ? sc.service_name : sc.service_id
                    )
                    .join(', ')
                }}
                <div
                  class="tooltip tooltip-top inline"
                  :data-tip="
                    item.services
                      .slice(5)
                      .map((sc: any) =>
                        sc.service_name?.length > 0 ? sc.service_name : sc.service_id
                      )
                      .join(', ')
                  "
                >
                  <span
                    class="text-blue-500 cursor-pointer hover:text-blue-700"
                  >
                    ,..+{{ item.services.length - 5 }} more
                  </span>
                </div>
              </span>
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
          class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
          @click="goToLast"
          :disabled="currentPage === totalPages"
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
    i18n: 'suppliers',
    order: 5
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
