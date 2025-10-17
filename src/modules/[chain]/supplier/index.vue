<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useApplicationStore, useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type AuthAccount, type Pagination, type Supplier } from '@/types';
import { onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const format = useFormatter();
const chainStore = useBlockchain()

const list = ref([] as Supplier[])

function showType(v: string) {
  return v.replace("/cosmos.auth.v1beta1.", "")
}

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

onMounted(() => {
  pageloadInit(1)
});

function pageload() {
  const container = document.querySelector('.suppliersContainer') as HTMLDivElement;
  if (!container) return;
  
  // Check if the scroll is at the bottom
  let isAtBottom = container.scrollTop + container.clientHeight + 1 >= container.scrollHeight;
  if (isAtBottom && parseInt(pageResponse.value.total || '0') > list.value.length) {
    pageRequest.value.setPage(Math.floor(list.value.length / pageRequest.value.limit) + 1)
    chainStore.rpc.getSuppliers(pageRequest.value).then(x => {
      list.value = Array.from(new Set([...list.value, ...x.supplier]));
      pageResponse.value = x.pagination
    });
  }
}

function pageloadInit(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getSuppliers(pageRequest.value).then(x => {
    list.value = x.supplier
    pageResponse.value = x.pagination
  });
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
    <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-2 my-4 font-bold text-[#ffffff;]">Suppliers</p>
    <div class="bg-[#EFF2F5;] dark:bg-base-100 rounded-xl px-0.5 pt-0.5 pb-0.5 overflow-auto suppliersContainer" @scroll="pageload" style="height: 78vh; overflow: scroll;">
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
        <tr v-for="item, index in list.sort((a: any, b: any) => {
            return parseInt(b.stake.amount) - parseInt(a.stake.amount);
          })" class="hover dark:bg-base-200 bg-white rounded-xl">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="flex flex-col">
              <span class="text-sm text-primary dark:invert whitespace-nowrap overflow-hidden">

                <RouterLink :to="`/${chainStore.chainName}/account/${item?.operator_address}`" class="font-weight-medium">{{item.operator_address }}</RouterLink>
              </span>
              <span class="text-xs">Owned by: {{ item.owner_address }}</span>
            </div>
          </td>
          <td class="text-success">{{ statusText }}</td>
          <td class="font-bold dark:text-secondary">{{ format.formatToken(item.stake) }}</td>
          <td class="dark:text-secondary">{{ format.formatToken(item.balance) }}</td>
          <td>{{ item.services?.length }}</td>
          <td>
            <span v-if="item.services?.length <= 5">
              {{ item.services?.map((sc: any) => sc.service_name?.length > 0 ? sc.service_name : sc.service_id).join(", ") }}
            </span>
            <span v-else>
              {{ item.services.slice(0, 5).map((sc: any) => sc.service_name?.length > 0 ? sc.service_name : sc.service_id).join(", ") }}
              <div class="tooltip tooltip-top inline" :data-tip="item.services.slice(5).map((sc: any) => sc.service_name?.length > 0 ? sc.service_name : sc.service_id).join(', ')">
                <span class="text-blue-500 cursor-pointer hover:text-blue-700">,..+{{ item.services.length - 5 }} more</span>
              </div>
            </span>
          </td>
        </tr>
      </table>
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
