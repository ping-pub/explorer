<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useApplicationStore, useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type AuthAccount, type Pagination, type Application } from '@/types';
import { onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const format = useFormatter();
const chainStore = useBlockchain()

const list = ref([] as Application[])

function showType(v: string) {
  return v.replace("/cosmos.auth.v1beta1.", "")
}

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

onMounted(() => {
  pageloadInit(0)
});

function pageload() {
  const container = document.querySelector('.applicationsContainer') as HTMLDivElement;
  // Check if the scroll is at the bottom
  let isAtBottom = container.scrollTop + container.clientHeight + 1 >= container.scrollHeight;
  if (isAtBottom && pageResponse.value.next_key != null) {
    pageRequest.value.setPage(((list.value.length || 0) / pageRequest.value.limit) + 1)
    chainStore.rpc.getApplications(pageRequest.value).then(x => {
      list.value = Array.from(new Set([...list.value, ...x.applications]));
      pageResponse.value = x.pagination
    });
  }
}

function pageloadInit(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getApplications(pageRequest.value).then(x => {
    list.value = x.applications
    pageResponse.value = x.pagination
  });
}
</script>
<template>
  <div>
  <p class="bg-[#09279F] dark:bg-base-200 text-2xl rounded-md px-4 py-2 my-4 font-bold text-[#ffffff;]">Applications</p>
  <div class="bg-[#EFF2F5;] dark:bg-base-200 px-0.5 pt-0.5 pb-0.5 rounded-md overflow-x-auto txsContainer" @scroll="pageload" style="height: 78vh;overflow: scroll;">
    <table class="table w-full table-compact">
      <thead class="dark:bg-base-200 bg-white text-[#64748B;] sticky top-0">
        <tr>
          <td>Rank</td>
          <td>Address</td>
          <td>Stake</td>
          <td>No. Of Services</td>
          <td>Services</td>
        </tr>
      </thead>
      <tr v-for="item, index in list.sort((a, b) => {
          return parseInt(b.stake.amount) - parseInt(a.stake.amount);
        })" class="hover">
        <td class="dark:bg-base-200 bg-white">{{ index + 1 }}</td>
        <td class="dark:bg-base-200 bg-white">
          <div class="flex flex-col">
            <span class="text-sm text-primary dark:invert whitespace-nowrap overflow-hidden">

              <RouterLink :to="`/${chainStore.chainName}/account/${item?.address}`" class="font-weight-medium">{{
                item.address }}</RouterLink>
            </span>
            <span class="text-xs">{{ item.address }}</span>
          </div>
        </td>
        <td class="font-bold dark:bg-base-200 bg-white">{{ format.formatToken(item.stake) }}</td>
        <td class="dark:bg-base-200 bg-white">{{ item.service_configs?.length }}</td>
        <td class="dark:bg-base-200 bg-white">{{ item.service_configs?.map((sc: any) => sc.service_name?.length > 0 ? sc.service_name :
          sc.service_id).join(", ")
        }}</td>
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
