<script lang="ts" setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useBaseStore, useBlockchain, useFormatter } from '@/stores'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { fetchTransactions, type ApiTransaction, type TransactionFilters } from '@/libs/transactions'

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

// 🔹 Filter state
const selectedTypeTab = ref<'all' | 'send' | 'claim' | 'proof' | 'governance' | 'staking'>('all')
const statusFilter = ref<string>('')
const startDate = ref<string>('')
const endDate = ref<string>('')
const minAmount = ref<number | undefined>(undefined)
const maxAmount = ref<number | undefined>(undefined)
const sortBy = ref<'timestamp' | 'amount' | 'fee' | 'block_height' | 'type' | 'status'>('timestamp')
const sortOrder = ref<'asc' | 'desc'>('desc')
const showAdvancedFilters = ref(false)

// 🔹 Type tab mappings
const typeTabMap: Record<string, string[]> = {
  all: [],
  send: ['MsgSend (bank)', 'MsgMultiSend (bank)'],
  claim: ['MsgCreateClaim (proof)'],
  proof: ['MsgSubmitProof (proof)'],
  governance: [
    'MsgSubmitProposal (governance)',
    'MsgVote (governance)',
    'MsgDeposit (governance)',
    'MsgVoteWeighted (governance)'
  ],
  staking: [
    'MsgDelegate (node)',
    'MsgUndelegate (node)',
    'MsgBeginRedelegate (node)',
    'MsgStakeApplication (application)',
    'MsgUnstakeApplication (application)',
    'MsgStakeSupplier (supplier)',
    'MsgUnstakeSupplier (supplier)',
    'MsgStakeGateway (gateway)',
    'MsgUnstakeGateway (gateway)'
  ]
}

// 🔹 Debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  tab.value = String(router.currentRoute.value.query.tab || 'recent')
  await loadTransactions()
})

// 🔹 Load transactions from API
async function loadTransactions() {
  loading.value = true
  try {
    const filters: TransactionFilters = {
      chain: apiChainName,
      page: currentPage.value,
      limit: itemsPerPage.value,
      sort_by: sortBy.value,
      sort_order: sortOrder.value,
    }

    // Add type filter based on selected tab
    const selectedTypes = typeTabMap[selectedTypeTab.value]
    if (selectedTypes.length > 0) {
      // For multiple types, we need to make separate calls or use a different approach
      // For now, we'll use the first type as the API supports single type filter
      // In a real implementation, you might want to handle multiple types differently
      filters.type = selectedTypes[0]
    }

    if (statusFilter.value) {
      filters.status = statusFilter.value === 'success' ? "true" : "false"
    }
    if (startDate.value) {
      // Convert datetime-local to ISO 8601
      filters.start_date = new Date(startDate.value).toISOString()
    }
    if (endDate.value) {
      // Convert datetime-local to ISO 8601
      filters.end_date = new Date(endDate.value).toISOString()
    }
    if (minAmount.value !== undefined) {
      filters.min_amount = minAmount.value
    }
    if (maxAmount.value !== undefined) {
      filters.max_amount = maxAmount.value
    }

    const data = await fetchTransactions(filters)
    
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

// 🔹 Debounced load function
function debouncedLoad() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    loadTransactions()
  }, 300)
}

// 🔹 Watch for filter changes
watch([selectedTypeTab, statusFilter, startDate, endDate, minAmount, maxAmount, sortBy, sortOrder], () => {
  debouncedLoad()
})

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
    <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-4 my-4 font-bold text-white">Transactions</p>
    <div
      v-show="tab === 'recent'"
      class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-4 rounded-xl shadow-md mb-4"
    >
      <!-- Filter Section - Compact & Modern -->
      <div class="bg-base-200 dark:bg-base-300 rounded-lg border border-base-300 dark:border-base-400 mb-4">
        <!-- Main Filter Bar -->
        <div class="flex flex-wrap items-center gap-3 px-4 py-3">
          <!-- Type Tabs - Compact Horizontal -->
          <div class="flex items-center gap-1 flex-wrap">
            <span class="text-xs font-medium text-base-content/70 mr-1">Type:</span>
            <button
              v-for="typeOption in [
                { value: 'all', label: 'All' },
                { value: 'send', label: 'Send' },
                { value: 'claim', label: 'Claim' },
                { value: 'proof', label: 'Proof' },
                { value: 'governance', label: 'Gov' },
                { value: 'staking', label: 'Stake' }
              ]"
              :key="typeOption.value"
              @click="selectedTypeTab = typeOption.value as any"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
              :class="selectedTypeTab === typeOption.value
                ? 'bg-[#007bff] text-white shadow-sm'
                : 'bg-base-100 dark:bg-base-200 text-base-content hover:bg-base-300 dark:hover:bg-base-100 border border-base-300 dark:border-base-400'"
            >
              {{ typeOption.label }}
            </button>
          </div>

          <!-- Divider -->
          <div class="h-6 w-px bg-base-300 dark:bg-base-500"></div>

          <!-- Quick Filters -->
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Status -->
            <div class="flex items-center gap-1.5">
              <Icon icon="mdi:check-circle-outline" class="text-base-content/60 text-sm" />
              <select v-model="statusFilter" class="select select-bordered select-xs h-8 min-h-8 px-2 text-xs w-24">
                <option value="">All</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <!-- Sort By -->
            <div class="flex items-center gap-1.5">
              <Icon icon="mdi:sort" class="text-base-content/60 text-sm" />
              <select v-model="sortBy" class="select select-bordered select-xs h-8 min-h-8 px-2 text-xs w-28">
                <option value="timestamp">Time</option>
                <option value="amount">Amount</option>
                <option value="fee">Fee</option>
                <option value="block_height">Block</option>
                <option value="type">Type</option>
                <option value="status">Status</option>
              </select>
            </div>

            <!-- Sort Order Toggle -->
            <button
              @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
              class="btn btn-xs h-8 min-h-8 px-2 gap-1"
              :class="sortOrder === 'desc' ? 'btn-primary' : 'btn-ghost'"
              :title="sortOrder === 'desc' ? 'Descending' : 'Ascending'"
            >
              <Icon :icon="sortOrder === 'desc' ? 'mdi:sort-descending' : 'mdi:sort-ascending'" class="text-sm" />
            </button>
          </div>

          <!-- Advanced Filters Toggle -->
          <div class="ml-auto">
            <button
              @click="showAdvancedFilters = !showAdvancedFilters"
              class="btn btn-xs h-8 min-h-8 px-3 gap-1.5"
              :class="showAdvancedFilters ? 'btn-primary' : 'btn-ghost'"
            >
              <Icon :icon="showAdvancedFilters ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-sm" />
              <span class="text-xs">Advanced</span>
            </button>
          </div>
        </div>

        <!-- Advanced Filters - Collapsible -->
        <div v-show="showAdvancedFilters" class="border-t border-base-300 dark:border-base-400 px-4 py-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Date Range -->
            <div>
              <label class="label py-1">
                <span class="label-text text-xs font-medium flex items-center gap-1.5">
                  <Icon icon="mdi:calendar-range" class="text-sm" />
                  Date Range
                </span>
              </label>
              <div class="flex gap-2">
                <input
                  v-model="startDate"
                  type="datetime-local"
                  class="input input-bordered input-xs h-8 text-xs flex-1"
                  placeholder="Start"
                />
                <span class="self-center text-xs text-base-content/50">→</span>
                <input
                  v-model="endDate"
                  type="datetime-local"
                  class="input input-bordered input-xs h-8 text-xs flex-1"
                  placeholder="End"
                />
              </div>
            </div>

            <!-- Amount Range -->
            <div>
              <label class="label py-1">
                <span class="label-text text-xs font-medium flex items-center gap-1.5">
                  <Icon icon="mdi:currency-usd" class="text-sm" />
                  Amount Range
                </span>
              </label>
              <div class="flex gap-2">
                <input
                  v-model.number="minAmount"
                  type="number"
                  class="input input-bordered input-xs h-8 text-xs flex-1"
                  placeholder="Min"
                />
                <span class="self-center text-xs text-base-content/50">-</span>
                <input
                  v-model.number="maxAmount"
                  type="number"
                  class="input input-bordered input-xs h-8 text-xs flex-1"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-base-200 rounded-md overflow-auto">
        <table class="table w-full table-compact">
          <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
            <tr class="border-b-[0px] text-sm font-semibold">
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
