<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useBaseStore, useBlockchain, useFormatter } from '@/stores'
import { useRouter } from 'vue-router'

const props = defineProps(['chain'])
const router = useRouter()

const tab = ref('recent')
const base = useBaseStore()
const chainStore = useBlockchain()
const format = useFormatter()

const hashReg = /^[A-Z\d]{64}$/
const hash = ref('')
const current = chainStore?.current?.chainName || ''

// 🔹 Pagination state
const currentPage = ref(1)
const itemsPerPage = 10

onMounted(async () => {
  tab.value = String(router.currentRoute.value.query.tab || 'recent')
  await base.getAllTxs(chainStore?.current?.transactionService)
})

// 🔍 Search function
function search() {
  if (hashReg.test(hash.value)) {
    router.push({ path: `/${current}/tx/${hash.value}` })
  }
}

// 🔹 Pagination logic
const totalPages = computed(() =>
  Math.ceil(base.allTxs.length / itemsPerPage)
)

const paginatedTxs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return base.allTxs.slice(start, end)
})

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
          <thead class="bg-white sticky top-0">
            <tr class="border-b-[0px]">
              <th>{{ $t('tx.tx_hash') }}</th>
              <th>{{ $t('block.block') }}</th>
              <th>{{ $t('staking.status') }}</th>
              <th>{{ $t('account.amount') }}</th>
              <th>Messages</th>
              <th>{{ $t('account.height') }}</th>
              <th>{{ $t('account.type') }}</th>
              <th>{{ $t('block.fees') }}</th>
              <th>{{ $t('account.time') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in paginatedTxs"
              :key="item.hash"
              class="hover:bg-base-300 transition-colors rounded-xl duration-200 border-b-[0px]"
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
                {{ format.formatTokens(item.messages?.[0]?.amount || [], true, '0,0.[00]') }}
              </td>
              <td class="dark:bg-base-200 bg-white">
                {{ item.messages?.length }}
              </td>
              <td class="dark:bg-base-200 bg-white">
                {{ item.height }}
              </td>
              <td class="dark:bg-base-200 bg-white">
                {{ item.type }}
              </td>
              <td class="dark:bg-base-200 bg-white">
                {{
                  format.formatTokens(
                    typeof item.fee === 'string' ? [] : item.fee?.amount || [],
                    true,
                    '0,0.[00]'
                  )
                }}
              </td>
              <td class="dark:bg-base-200 bg-white">
                {{ format.toDay(item.timestamp, 'from') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ✅ Pagination Bar -->
      <div class="flex justify-end items-center gap-2 my-6 px-6">
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

        <span class="text-xs">
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
