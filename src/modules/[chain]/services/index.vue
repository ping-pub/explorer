<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useBlockchain, useFormatter } from '@/stores';
import {
  PageRequest,
  type Pagination,
  type Service,
  type RelayMiningDifficulty,
  type Supplier,
  type Application
} from '@/types';

const props = defineProps<{ chain: string }>();

const format = useFormatter();
const chainStore = useBlockchain();
const suppliers = ref<Supplier[]>([]);
const applications = ref<Application[]>([]);
const list = ref<Service[]>([]);
const miningDifficulties = ref<RelayMiningDifficulty[]>([]);

const currentPage = ref(1);
const itemsPerPage = ref(10);
const loading = ref(false);

const sortDirection = ref<'asc' | 'desc'>('desc');
const sortField = ref<'computeUnits' | 'miningDifficulty'>('computeUnits');

const isLoadingMiningDifficulties = ref(false);
const hasMiningDifficultyError = ref(false);

// Server-side pagination metadata
const pageRequest = ref(new PageRequest());
const pageResponse = ref({} as Pagination);

const totalPages = computed(() => {
  const total = parseInt(pageResponse.value.total || '0');
  if (total === 0) return 0;
  return Math.ceil(total / itemsPerPage.value);
});

const totalServices = computed(() => parseInt(pageResponse.value.total || '0'));

// Client-side sorting (applied after server returns page data)
const sortedList = computed(() => {
  return [...list.value].sort((a, b) => {
    if (sortField.value === 'computeUnits') {
      const aValue = parseInt(a.compute_units_per_relay as string) || 0;
      const bValue = parseInt(b.compute_units_per_relay as string) || 0;
      return sortDirection.value === 'desc' ? bValue - aValue : aValue - bValue;
    } else {
      const aValue = getMiningDifficultyValue(a.id);
      const bValue = getMiningDifficultyValue(b.id);
      return sortDirection.value === 'desc' ? bValue - aValue : aValue - bValue;
    }
  });
});

// 🔹 Sorting toggle
function toggleSortField(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field as any;
    sortDirection.value = 'asc';
  }
}

// 🔹 Watch for page changes
watch(currentPage, () => {
  loadServices();
});

// 🔹 Watch for page size changes
watch(itemsPerPage, () => {
  currentPage.value = 1;
  loadServices();
});

// 🔹 Data loading
async function loadServices() {
  if (!chainStore.rpc) {
    await waitForRpc();
  }
  
  loading.value = true;
  try {
    pageRequest.value.setPageSize(itemsPerPage.value);
    pageRequest.value.setPage(currentPage.value);
    pageRequest.value.count_total = true;
    
    const response = await chainStore.rpc.getServices(pageRequest.value);
    list.value = response.service || [];
    pageResponse.value = response.pagination || {};
  } catch (error) {
    console.error('Error loading services:', error);
    list.value = [];
    pageResponse.value = {} as Pagination;
  } finally {
    loading.value = false;
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

async function waitForRpc() {
  while (!chainStore.rpc) {
    console.log('⏳ Waiting for chainStore.rpc...');
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

async function loadSuppliers() {
  try {
    await waitForRpc();
    const res = await chainStore.rpc.getSuppliers();
    suppliers.value = res?.suppliers || [];
  } catch {
    suppliers.value = [];
  }
}

async function loadApplications() {
  try {
    await waitForRpc();
    const res = await chainStore.rpc.getApplications();
    applications.value = res?.applications || [];
  } catch {
    applications.value = [];
  }
}

function loadMiningDifficulties() {
  const difficultyRequest = new PageRequest();
  difficultyRequest.count_total = true;
  difficultyRequest.limit = 100;

  isLoadingMiningDifficulties.value = true;
  hasMiningDifficultyError.value = false;

  chainStore.rpc
    .getRelayMiningDifficulty(difficultyRequest)
    .then((x) => {
      miningDifficulties.value = x.relayMiningDifficulty || [];
      isLoadingMiningDifficulties.value = false;
    })
    .catch((error) => {
      console.error('Error loading mining difficulties:', error);
      isLoadingMiningDifficulties.value = false;
      hasMiningDifficultyError.value = true;
    });
}

// 🔹 Difficulty helpers
function getMiningDifficultyForService(serviceId: string) {
  return miningDifficulties.value.find((md) => md.service_id === serviceId);
}

function getMiningDifficultyValue(serviceId: string) {
  const diff = getMiningDifficultyForService(serviceId);
  return diff ? parseInt(diff.num_relays_ema) || 0 : 0;
}

function getDifficultyLevel(numRelaysEma: string) {
  const relays = parseInt(numRelaysEma) || 0;
  if (relays > 1000)
    return { level: 'high', color: 'bg-[#E0383433] text-[#E03834]', label: 'High' };
  if (relays > 100)
    return { level: 'medium', color: 'bg-[#FFB20633] text-[#FFB206]', label: 'Medium' };
  return { level: 'low', color: 'bg-[#60BC2933] text-[#60BC29]', label: 'Low' };
}

function isMaxDifficulty(targetHash: string) {
  return targetHash.includes('////////////////////////////////////////////');
}

onMounted(() => {
  loadServices();
  loadMiningDifficulties();
  loadSuppliers();
  loadApplications();
});
</script>

<template>
  <div class="mb-[2vh]">
    <p class="bg-[#09279F] text-2xl rounded-xl px-4 py-4 my-4 font-bold text-white">
      Services
    </p>

    <div class="bg-[#EFF2F5] dark:bg-base-100 rounded-xl p-2">
      <table class="table w-full table-compact">
        <thead class="dark:bg-base-100 bg-white sticky top-0 z-10 rounded-xl">
          <tr class="text-sm font-semibold rounded-xl">
            <th>ID</th>
            <th>Name</th>
            <th>Owner</th>
            <th class="cursor-pointer" @click="toggleSortField('miningDifficulty')">
              Mining Difficulty
              <span v-if="sortField === 'miningDifficulty' && sortDirection === 'desc'">↓</span>
              <span v-if="sortField === 'miningDifficulty' && sortDirection === 'asc'">↑</span>
            </th>
            <th class="cursor-pointer" @click="toggleSortField('computeUnits')">
              Compute Units
              <span v-if="sortField === 'computeUnits' && sortDirection === 'desc'">↓</span>
              <span v-if="sortField === 'computeUnits' && sortDirection === 'asc'">↑</span>
            </th>
            <th>Suppliers</th>
            <th>Applications</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading" class="text-center">
            <td colspan="7" class="py-8">
              <div class="flex justify-center items-center">
                <div class="loading loading-spinner loading-md"></div>
                <span class="ml-2">Loading services...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="sortedList.length === 0" class="text-center">
            <td colspan="7" class="py-8">
              <div class="text-gray-500">No services found</div>
            </td>
          </tr>
          <tr
            v-else
            v-for="item in sortedList"
            :key="item.id"
            class="hover:bg-gray-100 dark:hover:bg-base-200 transition"
          >
            <td>{{ item.id }}</td>
            <td class="font-bold">{{ item.name }}</td>
            <td>
              <div class="flex flex-col">
                <RouterLink
                  :to="`/${chainStore.chainName}/account/${item?.owner_address}`"
                  class="text-blue-600 dark:text-blue-400 text-sm truncate"
                >
                  {{ item.owner_address }}
                </RouterLink>
                <span class="text-xs text-gray-500 truncate">{{ item.owner_address }}</span>
              </div>
            </td>

            <td>
              <div v-if="isLoadingMiningDifficulties" class="flex items-center">
                <span class="loading loading-spinner loading-xs mr-2"></span> Loading...
              </div>
              <div v-else-if="hasMiningDifficultyError" class="text-error">
                Error
                <button @click="loadMiningDifficulties" class="btn btn-xs btn-outline ml-2">
                  Retry
                </button>
              </div>
              <div v-else-if="getMiningDifficultyForService(item.id)" class="flex flex-col">
                <span class="text-xs">
                  Relays EMA: {{ getMiningDifficultyForService(item.id)?.num_relays_ema }}
                </span>
                <span
                  v-if="isMaxDifficulty(getMiningDifficultyForService(item.id)?.target_hash || '')"
                  class="badge badge-error text-xs"
                >
                  Max Difficulty
                </span>
                <span
                  v-else
                  :class="`badge ${
                    getDifficultyLevel(getMiningDifficultyForService(item.id)?.num_relays_ema || '0')
                      .color
                  } text-[8px]`"
                >
                  {{
                    getDifficultyLevel(getMiningDifficultyForService(item.id)?.num_relays_ema || '0')
                      .label
                  }}
                  Difficulty
                </span>
              </div>
              <span v-else>-</span>
            </td>

            <td>{{ item.compute_units_per_relay }}</td>
            <td>
              {{ suppliers.find((s) => s.owner_address === item.owner_address)?.services || '-' }}
            </td>
            <td>
              {{ applications.find((a) => a.address === item.owner_address)?.service_configs || '-' }}
            </td>
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
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalServices) }} of {{ totalServices }} services
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
    i18n: 'services',
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
