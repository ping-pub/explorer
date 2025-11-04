<script lang="ts" setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useBaseStore, useBlockchain, useFormatter } from '@/stores'
import { useRouter } from 'vue-router'
import type { TxLocal } from '@/types'

// Interface for API response transaction
interface ApiTransaction {
  id: string
  hash: string
  block_id: string
  sender: string
  recipient: string
  amount: string
  fee: string
  memo: string
  type: string
  status: string
  chain: string
  timestamp: string
  block_height: number
  tx_data: any
}

const props = defineProps(['chain'])
const router = useRouter()

const tab = ref('recent')
const base = useBaseStore()
const chainStore = useBlockchain()
const format = useFormatter()

const hashReg = /^[A-Z\d]{64}$/
const hash = ref('')

// Map frontend chain names to API chain names
const getApiChainName = (chainName: string) => {
  const chainMap: Record<string, string> = {
    'pocket-beta': 'pocket-testnet-beta',
    'pocket-alpha': 'pocket-testnet-alpha',
    'pocket-mainnet': 'pocket-mainnet'
  }
  return chainMap[chainName] || chainName || 'pocket-testnet-beta'
}

const current = chainStore?.current?.chainName || props.chain || 'pocket-beta'
const apiChainName = getApiChainName(current)

// 🔹 Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(25)
const totalTransactions = ref(0)
const totalPages = ref(0)
const transactions = ref<ApiTransaction[]>([])
const loading = ref(false)

// 🔹 Page size options
const pageSizeOptions = [10, 25, 50, 100]

onMounted(async () => {
  tab.value = String(router.currentRoute.value.query.tab || 'recent')
  await loadTransactions()
})

// 🔹 Load transactions from API
async function loadTransactions() {
  loading.value = true
  try {
    const url = `/api/v1/transactions?page=${currentPage.value}&limit=${itemsPerPage.value}&chain=${apiChainName}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    transactions.value = data.data || []
    totalTransactions.value = data.meta?.total || 0
    totalPages.value = data.meta?.totalPages || 0
  } catch (error) {
    console.error('Error loading transactions:', error)
    transactions.value = []
    totalTransactions.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

// 🔹 Watch for page size changes
watch(itemsPerPage, () => {
  currentPage.value = 1
  loadTransactions()
})

// 🔹 Watch for page changes
watch(currentPage, () => {
  loadTransactions()
})

// 🔍 Search function
function search() {
  if (hashReg.test(hash.value)) {
    router.push({ path: `/${current}/tx/${hash.value}` })
  }
}

// 🔹 Pagination functions
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function goToFirst() {
  currentPage.value = 1
}
function goToLast() {
  currentPage.value = totalPages.value
}
function changePageSize(newSize: number) {
  itemsPerPage.value = newSize
}
</script>

<template>
  <div>
    <p
      class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-2 my-4 font-bold text-[#ffffff]"
    >
      Transactions
    </p>


    <div
      v-show="tab === 'recent'"
      class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-4 rounded-xl shadow-md mb-4"
    >
      <div class="bg-base-200 rounded-md overflow-auto">
        <table class="table w-full table-compact">
          <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
            <tr class="border-b-[0px]">
              <th>{{ $t('tx.tx_hash') }}</th>
              <th>{{ $t('block.block') }}</th>
              <th>{{ $t('staking.status') }}</th>
              <th>{{ $t('account.amount') }}</th>
              <th>{{ $t('account.type') }}</th>
              <th>{{ $t('block.fees') }}</th>
              <th>{{ $t('account.time') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading" class="text-center">
              <td colspan="7" class="py-8">
                <div class="flex justify-center items-center">
                  <div class="loading loading-spinner loading-md"></div>
                  <span class="ml-2">Loading transactions...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="transactions.length === 0" class="text-center">
              <td colspan="7" class="py-8">
                <div class="text-gray-500">No transactions found</div>
              </td>
            </tr>
            <tr
              v-for="(item, index) in transactions"
              :key="item.hash"
              class="hover:bg-gray-100 dark:hover:bg-[#384059] dark:bg-base-200 bg-white border-0 rounded-xl"
            >
              <td
                class="dark:bg-base-200 bg-white truncate dark:text-warning text-[#153cd8]"
                style="max-width:25vw"
              >
                <RouterLink
                  class="truncate hover:underline"
                  :to="`/${props.chain}/tx/${item.hash}`"
                  >{{ item.hash }}</RouterLink
                >
              </td>
              <td class="dark:bg-base-200 bg-white text-sm dark:text-warning text-[#153cd8]">
                <RouterLink
                  :to="`/${props.chain}/blocks/${item.block_height}`"
                  class="hover:underline"
                  >{{ item.block_height }}</RouterLink
                >
              </td>
              <td class="dark:bg-base-200 bg-white">
                <span
                  class="text-xs truncate py-1 px-3 rounded-full"
                  :class="item.status
                      ? 'bg-[#60BC29]/10 text-[#60BC29]'
                      : 'bg-[#E03834]/10 text-[#E03834]'"
                >
                  {{ item.status ? 'Success' : 'Failed' }}
                </span>
              </td>
              <td class="dark:bg-base-200 bg-white">
                {{ format.formatToken({ denom: 'upokt', amount: item.amount }) }}
              </td>
              <td class="dark:bg-base-200 bg-white">
                {{ item.type }}
              </td>
              <td class="dark:bg-base-200 bg-white">
                {{ format.formatToken({ denom: 'upokt', amount: item.fee }) }}
              </td>
              <td class="dark:bg-base-200 bg-white">
                {{ format.toDay(item.timestamp, 'from') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ✅ Pagination Bar -->
      <div class="flex justify-between items-center gap-4 my-6 px-6">
        <!-- Page Size Dropdown -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Show:</span>
          <select 
            v-model="itemsPerPage" 
            @change="changePageSize(itemsPerPage)"
            class="select select-bordered select-sm w-20"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
          <span class="text-sm text-gray-600">per page</span>
        </div>

        <!-- Pagination Info and Controls -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalTransactions) }} of {{ totalTransactions }} transactions
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

    <!-- 🔍 Search Section -->
    <div
      v-show="tab === 'search'"
      class="bg-base-100 px-4 pt-3 pb-4 mb-4 rounded-md shadow-md border-t-4 border-warning"
    >
      <div class="flex items-center mb-4">
        <Icon icon="mdi:magnify" class="text-2xl text-warning mr-2" />
        <div class="text-lg font-semibold text-main">Search Transactions</div>
      </div>

      <div class="bg-base-200 p-4 rounded-md">
        <div class="form-control">
          <input
            v-model="hash"
            type="text"
            class="input input-bordered"
            placeholder="Search by Tx Hash"
            @blur="search"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-btn:hover {
  background-color: #e9ecef;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<route>
{
  meta: {
    i18n: 'tx',
    order: 3
  }
}
</route>
