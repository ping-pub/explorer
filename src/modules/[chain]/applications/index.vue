<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useApplicationStore, useBlockchain, useFormatter } from '@/stores'
import { PageRequest, type Pagination, type Application } from '@/types'
import PaginationBar from '@/components/PaginationBar.vue'

const props = defineProps(['chain'])
const balances = ref([] as Coin[]);

const format = useFormatter()
const chainStore = useBlockchain()

const list = ref([] as Application[])

function showType(v: string) {
  return v.replace("/cosmos.auth.v1beta1.", "")
}

// ✅ allValidators ref defined (missing before)
const allValidators = ref<any[]>([])

// ✅ Placeholder for calculateRank (missing before)
function calculateRank(index: number, activeCount: number) {
  return activeCount - index
}

// ✅ Placeholder for logo function (missing before)
function logo(identity: string) {
  return identity || ''
}

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

const delegations = ref<any[]>([])


onMounted(() => {
  pageloadInit(0)
})


onMounted(async () => {
  pageloadInit(0)

  // ye dono calls API se data laengi
  const balanceRes = await chainStore.rpc.getBankBalances(props.chain.bech32_prefix)
  balances.value = balanceRes.balances

  const delegationRes = await chainStore.rpc.getStakingDelegations(props.chain.bech32_prefix)
  delegations.value = delegationRes.delegation_responses
})



function pageload() {
  const container = document.querySelector('.applicationsContainer') as HTMLDivElement
  if (!container) return

  // ✅ Scroll detection fixed
  const isAtBottom = container.scrollTop + container.clientHeight + 1 >= container.scrollHeight
  if (isAtBottom && pageResponse.value.next_key != null) {
    pageRequest.value.setPage(((list.value.length || 0) / pageRequest.value.limit) + 1)
    chainStore.rpc.getApplications(pageRequest.value).then(x => {
      list.value = Array.from(new Set([...list.value, ...x.applications]))
      pageResponse.value = x.pagination
    })
  }
}

function pageloadInit(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getApplications(pageRequest.value).then(x => {
    list.value = x.applications
    pageResponse.value = x.pagination
  })
}

const value = ref('stake')

// Computed property to show text based on value
const statusText = computed(() => {
  if (value.value === 'stake') {
    return 'Staked'
  } else {
    return 'Unstaked'
  }
})
</script>

<template>
  <div class="mb-[2vh]">
    <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-4 my-4 font-bold text-[#ffffff]">Applications</p>
    <div class="bg-[#EFF2F5] dark:bg-base-100 px-0.5 pt-0.5 pb-0.5 rounded-xl overflow-x-auto applicationsContainer" @scroll="pageload" style="height: 78vh; overflow: scroll;">
      <table class="table w-full table-compact rounded-xl">
        <thead class="dark:bg-base-100 bg-white text-[#64748B] sticky top-0">
          <tr>
            <td>Rank</td>
            <td>Address</td>
            <td>Stake</td>
            <td>Balance</td>
            <td>No. Of Services</td>
            <td>Services</td>
            <td>Status</td>
          </tr>
        </thead>
        <!-- ✅ v-for syntax fixed, index now comes from second argument -->
        <tr v-for="item, index in list.sort((a, b) => { return parseInt(b.stake.amount) - parseInt(a.stake.amount); })" class="hover">
          <td class="dark:bg-base-200 bg-white">{{ index + 1 }}</td>
          <td class="dark:bg-base-200 bg-white">
            <div class="flex flex-col">
              <span class="text-sm text-[#09279F] dark:invert whitespace-nowrap overflow-hidden">
                <RouterLink :to="`/${chainStore.chainName}/account/${item?.address}`" class="font-weight-medium">{{ item.address }}</RouterLink>
              </span>
              <span class="text-xs text-[#171C1F] dark:text-secondary">{{ item.address }}</span>
            </div>
          </td>
          <td class="font-bold dark:bg-base-200 bg-white text-[#171C1F] dark:text-secondary">{{ format.formatToken(item.stake) }}</td>
          <td class="dark:bg-base-200 bg-white text-[#171C1F] dark:text-secondary">{{ format.formatToken(item.balance) }}</td>
          <td class="dark:bg-base-200 bg-white text-[#171C1F] dark:text-secondary">{{ item.service_configs?.length }}</td>
          <td class="dark:bg-base-200 bg-white text-[#171C1F] dark:text-secondary">{{ item.service_configs?.map((sc: any) => (sc.service_name?.length > 0 ? sc.service_name : sc.service_id)).join(", ") }}</td>
          <td class="dark:bg-base-200 bg-white text-success">{{ statusText }}</td>
        </tr>
      </table>
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
