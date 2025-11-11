<script lang="ts" setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useStakingStore, useBaseStore, useFormatter } from '@/stores'
import { PageRequest } from '@/types'
import { useBlockchain } from '@/stores'

const props = defineProps(['chain'])
const tab = ref('blocks')
const base = useBaseStore()
const stakingStore = useStakingStore();
stakingStore.init()
const format = useFormatter()
const blockchain = useBlockchain()

// ✅ Network Stats
const networkStats = ref({
  wallets: 0,
  applications: 0,
  suppliers: 0,
  gateways: 0,
})

// ✅ Cache control
const networkStatsCacheTime = ref(0)
const CACHE_EXPIRATION_MS = 60000

// ✅ Load network stats
async function loadNetworkStats() {
  const now = Date.now()
  if (now - networkStatsCacheTime.value < CACHE_EXPIRATION_MS && networkStats.value.wallets > 0) {
    return
  }

  const pageRequest = new PageRequest()
  pageRequest.limit = 1

  try {
    const [applicationsData, suppliersData, gatewaysData] = await Promise.all([
      blockchain.rpc.getApplications(pageRequest),
      blockchain.rpc.getSuppliers(pageRequest),
      blockchain.rpc.getGateways(pageRequest),
    ])

    networkStats.value.applications = parseInt(applicationsData.pagination?.total || '0')
    networkStats.value.suppliers = parseInt(suppliersData.pagination?.total || '0')
    networkStats.value.gateways = parseInt(gatewaysData.pagination?.total || '0')
    networkStatsCacheTime.value = now
  } catch (error) {
    console.error('Error loading network stats:', error)
  }
}

// ✅ API blocks interface
interface ApiBlockItem {
  id: string
  height: number
  hash: string
  timestamp: string
  proposer: string
  chain: string
  transaction_count?: number
  // size?: number
  block_production_time?: number
  raw_block_size?: number
}

const getApiChainName = (chainName: string) => {
  const chainMap: Record<string, string> = {
    'pocket-beta': 'pocket-testnet-beta',
    'pocket-alpha': 'pocket-testnet-alpha',
    'pocket-mainnet': 'pocket-mainnet'
  }
  return chainMap[chainName] || chainName || 'pocket-testnet-beta'
}

const chainStore = useBlockchain()
const apiChainName = computed(() =>
  getApiChainName(chainStore.current?.chainName || props.chain || 'pocket-beta')
)

const blocks = ref<ApiBlockItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(25)
const totalBlocks = ref(0)
const totalPages = ref(0)
const pageSizeOptions = [10, 25, 50, 100]

// ✅ Fetch blocks
async function loadBlocks() {
  loading.value = true
  try {
    const url = `/api/v1/blocks?chain=${apiChainName.value}&page=${currentPage.value}&limit=${itemsPerPage.value}`
    const res = await fetch(url)
    const data = await res.json()

    if (res.ok) {
      blocks.value = data.data.map((b: ApiBlockItem) => ({
        ...b,
        size: b.size || (b.transaction_count ? b.transaction_count * 250 : 0)
      }))
      totalBlocks.value = data.meta?.total || 0
      totalPages.value = data.meta?.totalPages || 0
    } else {
      console.error('Error loading blocks:', data)
      blocks.value = []
      totalBlocks.value = 0
      totalPages.value = 0
    }
  } catch (e) {
    console.error('Error loading blocks:', e)
    blocks.value = []
    totalBlocks.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

// ✅ Watchers
watch(itemsPerPage, () => { currentPage.value = 1; loadBlocks() })
watch(currentPage, () => loadBlocks())
watch(apiChainName, (n, o) => { if(n!==o){ currentPage.value=1; loadBlocks() } })

// ✅ Convert bytes → KB
function bytesToKB(bytes?: number) {
  if (!bytes) return '0'
  return (bytes / 1024).toFixed(2)
}


// ✅ Convert seconds → "Xs" or "Xm Ys" without decimal in seconds
function formatBlockTime(secondsStr?: string | number) {
  if (!secondsStr) return '0s'
  const totalSeconds = typeof secondsStr === 'string' ? parseFloat(secondsStr) : secondsStr

  if (totalSeconds < 60) {
    return `${Math.round(totalSeconds)}s` // sirf seconds, rounded
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.round(totalSeconds % 60) // seconds rounded to integer
  return `${minutes}m ${seconds}s` // minutes aur seconds, no decimal
}


// ✅ Pagination
function goToFirst() { if (currentPage.value !== 1) currentPage.value = 1 }
function goToLast() { if (currentPage.value !== totalPages.value) currentPage.value = totalPages.value }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
function prevPage() { if (currentPage.value > 1) currentPage.value-- }

// ✅ Auto-load on mount
onMounted(() => {
  loadNetworkStats()
  loadBlocks()
})
</script>

<template>
  <div>
    <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-4 my-4 font-bold text-white">
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
        :to="`/${props.chain}/blocks/${Number(base.latest?.block?.header.height || 0) + 10000}`"
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
          <thead class="dark:bg-base-100 bg-base-200 sticky top-0 border-0">
            <tr class="border-b-[0px] text-sm font-semibold">
              <th>{{ $t('block.block_header') }}</th>
              <th>{{ $t('account.hash') }}</th>
              <th>{{ $t('block.proposer') }}</th>
              <th>{{ $t('account.no_of_transactions') }}</th>
              <th>{{ $t('account.time') }}</th>
              <th>Applications</th>
              <th>Suppliers</th>
              <th>Gateways</th>
              <th>Relayss</th>
              <th>{{ 'Block Production Time' }}</th>
              <th>{{ $t('block.size') }}</th>
            </tr>
          </thead>

          <tbody class="bg-base-100 relative">
            <tr v-if="loading">
              <td colspan="11" class="py-8">
                <div class="flex justify-center items-center">
                  <div class="loading loading-spinner loading-md"></div>
                  <span class="ml-2">Loading blocks...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="!loading && blocks.length === 0">
              <td colspan="11" class="py-8 text-center text-gray-500">No blocks found</td>
            </tr>
            <tr
              v-else
              v-for="block in blocks"
              :key="block.id"
              class="hover:bg-gray-100 dark:hover:bg-[#384059] dark:bg-base-200 bg-white border-0 rounded-xl"
            >
              <td class="font-medium dark:text-warning text-[#09279F]">{{ block.height }}</td>
              <td
                class="truncate dark:text-warning text-[#09279F]"
                style="max-width: 18rem; overflow: hidden"
              >
                <RouterLink
                  class="truncate hover:underline"
                  :title="block.hash"
                  :to="`/${props.chain}/blocks/${block.height}`"
                >
                  {{ block.hash || block.id.split(':')[1] }}
                </RouterLink>
              </td>
              <td>{{ format.validator(block.proposer) }}</td>
              <td>{{ (block.transaction_count ?? 0).toLocaleString() }}</td>
              <td>{{ format.toDay(block.timestamp, 'from') }}</td>
              <td>{{ networkStats.applications.toLocaleString() }}</td>
              <td>{{ networkStats.suppliers.toLocaleString() }}</td>
              <td>{{ networkStats.gateways.toLocaleString() }}</td>
              <td>{{ 0 }}</td>
              <td>{{ formatBlockTime(block.block_production_time) }}</td>
              <td>{{ bytesToKB(block.raw_block_size) }} KB</td>
            </tr>
          </tbody>
        </table>

        <!-- ✅ Pagination Bar -->
        <div class="flex justify-between items-center gap-4 my-6 px-6">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Show:</span>
            <select v-model="itemsPerPage" class="select select-bordered select-sm w-20">
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
            <span class="text-sm text-gray-600">per page</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">
              Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalBlocks) }} of {{ totalBlocks }} blocks
            </span>
            <div class="flex items-center gap-1">
              <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
                @click="goToFirst" :disabled="currentPage === 1 || totalPages === 0">First</button>
              <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
                @click="prevPage" :disabled="currentPage === 1 || totalPages === 0">&lt;</button>
              <span class="text-xs px-2">Page {{ currentPage }} of {{ totalPages }}</span>
              <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
                @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">&gt;</button>
              <button class="page-btn bg-[#f8f9fa] border border-[#ccc] rounded px-[10px] py-[5px] cursor-pointer text-[#007bff] transition-colors duration-200 hover:bg-[#e9ecef] disabled:opacity-50 disabled:cursor-not-allowed text-[14px]" 
                @click="goToLast" :disabled="currentPage === totalPages || totalPages === 0">Last</button>
            </div>
          </div>
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
