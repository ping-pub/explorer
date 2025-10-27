<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useBlockchain, useFormatter } from '@/stores'
import { PageRequest, type Pagination, type Application } from '@/types'

const props = defineProps<{ chain: string }>()

const chainStore = useBlockchain()
const format = useFormatter()

// ✅ Main data list
const list = ref<Application[]>([])

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

const currentPage = ref(1)
const itemsPerPage = 10

// ✅ Status text
const value = ref('stake')
const statusText = computed(() => (value.value === 'stake' ? 'Staked' : 'Unstaked'))

// ✅ Pagination logic
const totalPages = computed(() =>
  Math.ceil(parseInt(pageResponse.value.total || list.value.length.toString()) / itemsPerPage)
)

// ✅ Sorted and paginated list
const sortedList = computed(() => {
  return [...list.value].sort((a, b) => {
    const aStake = parseInt(a.stake.amount || '0')
    const bStake = parseInt(b.stake.amount || '0')
    return bStake - aStake // high to low
  })
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedList.value.slice(start, end)
})

// ✅ Pagination methods
function goToFirst() {
  if (currentPage.value !== 1) {
    currentPage.value = 1
    pageloadInit(1)
  }
}

function goToLast() {
  if (currentPage.value !== totalPages.value) {
    currentPage.value = totalPages.value
    pageloadInit(totalPages.value)
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    pageloadInit(currentPage.value)
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    pageloadInit(currentPage.value)
  }
}

// ✅ Load data from RPC
function pageloadInit(page: number) {
  pageRequest.value.setPage(page)
  chainStore.rpc.getApplications(pageRequest.value).then((x) => {
    list.value = x.applications
    pageResponse.value = x.pagination
  })
}

// ✅ Mounted
onMounted(() => {
  pageloadInit(1)
})
</script>

<template>
  <div class="mb-[2vh]">
    <p class="bg-[#09279F] text-2xl rounded-xl px-4 py-4 my-4 font-bold text-white">
      Applications
    </p>

    <div class="bg-[#EFF2F5] dark:bg-base-100 rounded-xl p-2">
      <table class="table w-full table-compact rounded-xl">
        <thead class="dark:bg-base-100 bg-white text-[#64748B] sticky top-0">
          <tr class="text-sm font-semibold">
            <th>Rank</th>
            <th>Address</th>
            <th>Stake</th>
            <th>Balance</th>
            <th>No. of Services</th>
            <th>Services</th>
            <th>Status</th>
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
                <span class="text-xs text-[#171C1F] dark:text-secondary truncate">
                  {{ item.address }}
                </span>
              </div>
            </td>

            <td class="font-bold dark:text-secondary">{{ format.formatToken(item.stake) }}</td>
            <td class="dark:text-secondary">{{ item.balance ? format.formatToken(item.balance) : '-' }}</td>
            <td>{{ item.service_configs?.length || 0 }}</td>
            <td>
              {{
                item.service_configs
                  ?.map((sc: any) =>
                    sc.service_name?.length > 0 ? sc.service_name : sc.service_id
                  )
                  .join(', ')
              }}
            </td>
            <td class="text-success">{{ statusText }}</td>
          </tr>
        </tbody>
      </table>

      <!-- ✅ Pagination Bar -->
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
    i18n: 'applications',
    order: 4
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
