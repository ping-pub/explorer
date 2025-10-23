<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
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
const itemsPerPage = 10;

const sortDirection = ref<'asc' | 'desc'>('desc');
const sortField = ref<'computeUnits' | 'miningDifficulty'>('computeUnits');

const isLoadingMiningDifficulties = ref(false);
const hasMiningDifficultyError = ref(false);

const totalPages = computed(() => Math.ceil(list.value.length / itemsPerPage));

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

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedList.value.slice(start, end);
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

// 🔹 Pagination methods
function goToFirst() {
  currentPage.value = 1;
}

function goToLast() {
  currentPage.value = totalPages.value;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

// 🔹 Data loading
const pageRequest = ref(new PageRequest());
const pageResponse = ref({} as Pagination);

function pageloadInit(p: number) {
  pageRequest.value.setPage(p);
  chainStore.rpc.getServices(pageRequest.value).then((x) => {
    list.value = x.service;
    pageResponse.value = x.pagination;
  });
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
  pageloadInit(1);
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
          <tr
            v-for="item in paginatedList"
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
              {{ applications.find((a) => a.address === item.address)?.service_configs || '-' }}
            </td>
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
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          >
          &gt;
        </button>
        <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
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
