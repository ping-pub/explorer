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
  pageloadInit(1)
});

function pageload() {
  const container = document.querySelector('.applicationsContainer') as HTMLDivElement;
  // Check if the scroll is at the bottom
  let isAtBottom = container.scrollTop + container.clientHeight + 1 >= container.scrollHeight;
  if (isAtBottom && pageResponse.value.next_key != null) {
    pageRequest.value.setPage((pageRequest.value.offset || 0 / pageRequest.value.limit) + 1)
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
  <div class="bg-base-100 rounded overflow-auto applicationsContainer" @scroll="pageload" style="height: 78vh;overflow: scroll;">
    <table class="table table-compact">
      <thead class="bg-base-200">
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
        <td>{{ index + 1 }}</td>
        <td>
          <div class="flex flex-col">
            <span class="text-sm text-primary dark:invert whitespace-nowrap overflow-hidden">

              <RouterLink :to="`/${chainStore.chainName}/account/${item?.address}`" class="font-weight-medium">{{
                item.address }}</RouterLink>
            </span>
            <span class="text-xs">{{ item.address }}</span>
          </div>
        </td>
        <td class="font-bold">{{ format.formatToken(item.stake) }}</td>
        <td>{{ item.service_configs?.length }}</td>
        <td>{{ item.service_configs?.map((sc: any) => sc.service_name?.length > 0 ? sc.service_name :
          sc.service_id).join(", ")
        }}</td>
      </tr>
    </table>
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
