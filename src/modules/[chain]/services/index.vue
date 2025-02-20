<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useApplicationStore, useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type AuthAccount, type Pagination, type Service } from '@/types';
import { onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const format = useFormatter();
const chainStore = useBlockchain()

const list = ref([] as Service[])

function showType(v: string) {
  return v.replace("/cosmos.auth.v1beta1.", "")
}

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

onMounted(() => {
  pageloadInit(1)
});

function pageload() {
  const container = document.querySelector('.servicesContainer') as HTMLDivElement;
  // Check if the scroll is at the bottom
  let isAtBottom = container.scrollTop + container.clientHeight + 1 >= container.scrollHeight;
  if (isAtBottom && parseInt(pageResponse.value.total || '0') != list.value.length) {
    pageRequest.value.setPage((pageRequest.value.offset || 0 / pageRequest.value.limit) + 1)
    chainStore.rpc.getServices(pageRequest.value).then(x => {
      list.value = [...list.value, ...x.service]
      pageResponse.value = x.pagination
    });
  }
}

function pageloadInit(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getServices(pageRequest.value).then(x => {
    list.value = x.service
    pageResponse.value = x.pagination
  });
}
</script>
<template>
  <div class="bg-base-100 rounded overflow-auto servicesContainer" @scroll="pageload"
    style="height: 78vh;overflow: scroll;">
    <table class="table table-compact">
      <thead class="bg-base-200">
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Owner</td>
          <td>Compute Units</td>
        </tr>
      </thead>
      <tr v-for="item, index in list" class="hover">
        <td>{{ item.id }}</td>
        <td class="font-bold">{{ item.name }}</td>
        <td>
          <div class="flex flex-col">
            <span class="text-sm text-primary dark:invert whitespace-nowrap overflow-hidden">

              <RouterLink :to="`/${chainStore.chainName}/account/${item?.owner_address}`" class="font-weight-medium">{{
                item.owner_address }}</RouterLink>
            </span>
            <span class="text-xs">{{ item.owner_address }}</span>
          </div>
        </td>
        <td>{{ item.compute_units_per_relay }}</td>
      </tr>
    </table>
  </div>
</template>

<route>
  {
    meta: {
      i18n: 'services',
      order: 6
    }
  }
</route>
