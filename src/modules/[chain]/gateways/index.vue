<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useApplicationStore, useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type AuthAccount, type Pagination, type Gateway } from '@/types';
import { onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const format = useFormatter();
const chainStore = useBlockchain()

const list = ref([] as Gateway[])

function showType(v: string) {
  return v.replace("/cosmos.auth.v1beta1.", "")
}

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

onMounted(() => {
  pageloadInit(1)
});

function pageload() {
  const container = document.querySelector('.gatewaysContainer') as HTMLDivElement;
  // Check if the scroll is at the bottom
  let isAtBottom = container.scrollTop + container.clientHeight + 1 >= container.scrollHeight;
  if (isAtBottom && parseInt(pageResponse.value.total || '0') != list.value.length) {
    pageRequest.value.setPage((list.value.length || 0 / pageRequest.value.limit) + 1)
    chainStore.rpc.getGateways(pageRequest.value).then(x => {
      list.value = [...list.value, ...x.gateways]
      pageResponse.value = x.pagination
    });
  }
}

function pageloadInit(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getGateways(pageRequest.value).then(x => {
    list.value = x.gateways
    pageResponse.value = x.pagination
  });
}
</script>
<template>
  <div>
  <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-4 my-4 font-bold text-[#ffffff]">Gateways</p>
  <div class="bg-[#EFF2F5;] dark:bg-base-100 rounded-xl px-0.5 pt-0.5 pb-0.5 overflow-auto gatewaysContainer" @scroll="pageload"
    style="height: 78vh;overflow: scroll;">
    <table class="table w-full table-compact">
      <thead class="dark:bg-base-100 bg-white sticky top-0">
        <tr>
          <td>Rank</td>
          <td>Address</td>
          <td>Stake</td>
        </tr>
      </thead>
      <tr v-for="item, index in list.sort((a: any, b: any) => {
        return parseInt(b.stake.amount) - parseInt(a.stake.amount);
      })" class="hover dark:bg-base-200 bg-white">
        <td>{{ index + 1 }}</td>
        <td>
          <div class="flex flex-col">
            <span class="text-sm text-[#09279F] dark:invert whitespace-nowrap overflow-hidden">

              <RouterLink :to="`/${chainStore.chainName}/account/${item?.address}`" class="font-weight-medium">{{
                item.address }}</RouterLink>
            </span>
            <span class="text-xs">{{ item.address }}</span>
          </div>
        </td>
        <td class="font-bold">{{ format.formatToken(item.stake) }}</td>
      </tr>
    </table>
  </div>
</div>
</template>

<route>
  {
    meta: {
      i18n: 'gateways',
      order: 6
    }
  }
</route>
