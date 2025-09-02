<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useApplicationStore, useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type AuthAccount, type Pagination, type Service, type RelayMiningDifficulty } from '@/types';
import { onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const format = useFormatter();
const chainStore = useBlockchain()

const list = ref([] as Service[])
const miningDifficulties = ref([] as RelayMiningDifficulty[])
const sortDirection = ref('desc'); // Add sort direction state
const sortField = ref('computeUnits'); // Default sort field: computeUnits or miningDifficulty
const isLoadingMiningDifficulties = ref(false);
const hasMiningDifficultyError = ref(false);

function showType(v: string) {
  return v.replace("/cosmos.auth.v1beta1.", "")
}

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

onMounted(() => {
  pageloadInit(1)
  loadMiningDifficulties()
});

function pageload() {
  const container = document.querySelector('.servicesContainer') as HTMLDivElement;
  // Check if the scroll is at the bottom
  // let isAtBottom = container.scrollTop + container.clientHeight + 1 >= container.scrollHeight;
  // if (isAtBottom && parseInt(pageResponse.value.total || '0') != list.value.length) {
  //   pageRequest.value.setPage((pageRequest.value.offset || 0 / pageRequest.value.limit) + 1)
  //   chainStore.rpc.getServices(pageRequest.value).then(x => {
  //     list.value = [...list.value, ...x.service]
  //     pageResponse.value = x.pagination
  //   });
  // }
}

function pageloadInit(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getServices(pageRequest.value).then(x => {
    list.value = x.service
    pageResponse.value = x.pagination
  });
}

function loadMiningDifficulties() {
  const difficultyRequest = new PageRequest()
  difficultyRequest.count_total = true
  difficultyRequest.limit = 100 // Set a higher limit to get more data at once
  
  isLoadingMiningDifficulties.value = true;
  hasMiningDifficultyError.value = false;
  
  chainStore.rpc.getRelayMiningDifficulty(difficultyRequest).then(x => {
    miningDifficulties.value = x.relayMiningDifficulty || []
    isLoadingMiningDifficulties.value = false;
  }).catch(error => {
    console.error("Error loading mining difficulties:", error)
    isLoadingMiningDifficulties.value = false;
    hasMiningDifficultyError.value = true;
  })
}

// Toggle sort direction
function toggleSort() {
  sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc';
}

// Toggle sort field and reset direction to desc
function toggleSortField(field: string) {
  if (sortField.value === field) {
    toggleSort();
  } else {
    sortField.value = field;
    sortDirection.value = 'desc';
  }
}

// Get mining difficulty for a service
function getMiningDifficultyForService(serviceId: string) {
  return miningDifficulties.value.find(md => md.service_id === serviceId)
}

// Get mining difficulty value for sorting
function getMiningDifficultyValue(serviceId: string) {
  const diff = getMiningDifficultyForService(serviceId);
  return diff ? parseInt(diff.num_relays_ema) || 0 : 0;
}

// Determine difficulty level based on num_relays_ema
function getDifficultyLevel(numRelaysEma: string) {
  const relays = parseInt(numRelaysEma) || 0
  if (relays > 1000) return { level: 'high', color: 'bg-[#E0383433;] text-[#E03834;]', label: 'High' }
  if (relays > 100) return { level: 'medium', color: 'bg-[#FFB20633;] text-[#FFB206;]', label: 'Medium' }
  return { level: 'low', color: 'bg-[#60BC2933;] text-[#60BC29;]', label: 'Low' }
}

// Check if target hash indicates maximum difficulty
function isMaxDifficulty(targetHash: string) {
  // Check if target hash is all forward slashes, which indicates maximum difficulty
  return targetHash.includes("////////////////////////////////////////////")
}

// Sorted list of services
const sortedList = computed(() => {
  return [...list.value].sort((a, b) => {
    if (sortField.value === 'computeUnits') {
      const aValue = parseInt(a.compute_units_per_relay as string) || 0;
      const bValue = parseInt(b.compute_units_per_relay as string) || 0;
      
      return sortDirection.value === 'desc' 
        ? bValue - aValue 
        : aValue - bValue;
    } else {
      // Sort by mining difficulty
      const aValue = getMiningDifficultyValue(a.id);
      const bValue = getMiningDifficultyValue(b.id);
      
      return sortDirection.value === 'desc' 
        ? bValue - aValue 
        : aValue - bValue;
    }
  });
});
</script>
<template>
  <div>
  <p class="bg-[#09279F] dark:bg-base-200 text-2xl rounded-md px-4 py-2 my-4 font-bold text-[#ffffff;]">Services</p>
  <div class="bg-[#EFF2F5;] dark:bg-base-200 rounded-md px-0.5 pt-0.5 pb-0.5 overflow-auto servicesContainer" @scroll="pageload"
    style="height: 78vh;overflow: scroll;">
    <table class="table w-full table-compact">
      <thead class="dark:bg-base-200 bg-white sticky top-0">
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Owner</td>
          <td class="cursor-pointer" @click="toggleSortField('miningDifficulty')">
            Mining Difficulty
            <span v-if="sortField === 'miningDifficulty' && sortDirection === 'desc'">↓</span>
            <span v-if="sortField === 'miningDifficulty' && sortDirection === 'asc'">↑</span>
          </td>
          <td class="cursor-pointer" @click="toggleSortField('computeUnits')">
            Compute Units
            <span v-if="sortField === 'computeUnits' && sortDirection === 'desc'">↓</span>
            <span v-if="sortField === 'computeUnits' && sortDirection === 'asc'">↑</span>
          </td>
        </tr>
      </thead>
      <tr v-for="item, index in sortedList" class="hover dark-bg-base-200 bg-white">
        <td>{{ item.id }}</td>
        <td class="font-bold">{{ item.name }}</td>
        <td>
          <div class="flex flex-col">
            <span class="text-sm text-primary dark:invert whitespace-nowrap overflow-hidden">

              <RouterLink :to="`/${chainStore.chainName}/account/${item?.owner_address}`" class="font-weight-medium">{{
                item.owner_address }}</RouterLink>
            </span>
            <span class="text-xs">{{ item.owner_address }}</span>
          </div>
        </td>
        
        <td>
          <div v-if="isLoadingMiningDifficulties" class="flex items-center">
            <span class="loading loading-spinner loading-xs mr-2"></span>
            <span>Loading...</span>
          </div>
          <div v-else-if="hasMiningDifficultyError" class="text-error">
            Error loading data
            <button @click="loadMiningDifficulties" class="btn btn-xs btn-outline ml-2">
              Retry
            </button>
          </div>
          <div v-else-if="getMiningDifficultyForService(item.id)" class="flex flex-col">
            <!-- <div class="flex items-center gap-2 text-xs">
              
            </div> -->
            <span class="text-xs">Relays EMA: {{ getMiningDifficultyForService(item.id)?.num_relays_ema }}</span>
            <span v-if="isMaxDifficulty(getMiningDifficultyForService(item.id)?.target_hash || '')" 
                    class="badge badge-error text-xs">Max Difficulty</span>
              <span v-else 
                    :class="`badge ${getDifficultyLevel(getMiningDifficultyForService(item.id)?.num_relays_ema || '0').color} text-[8px]`">
                {{ getDifficultyLevel(getMiningDifficultyForService(item.id)?.num_relays_ema || '0').label }} Difficulty
              </span>
          </div>
          <span v-else>-</span>
        </td>
        <td>{{ item.compute_units_per_relay }}</td>
      </tr>
    </table>
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
