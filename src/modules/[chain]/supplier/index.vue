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
  // Check if the scroll is at the bottom
  let isAtBottom = container.scrollTop + container.clientHeight + 1 >= container.scrollHeight;
  if (isAtBottom && parseInt(pageResponse.value.total || '0') != list.value.length) {
    pageRequest.value.setPage((pageRequest.value.offset || 0 / pageRequest.value.limit) + 1)
    chainStore.rpc.getSuppliers(pageRequest.value).then(x => {
      list.value = [...list.value, ...x.supplier]
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
</script>
<template>
  <div class="bg-base-100 rounded overflow-auto suppliersContainer" @scroll="pageload" style="height: 78vh;overflow: scroll;">
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
      <tr v-for="item, index in list.sort((a: any, b: any) => {
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
        <td>{{ item.services?.length }}</td>
        <td>{{ item.services?.map((sc: any) => sc.service_name?.length > 0 ? sc.service_name : sc.service_id).join(", ")
        }}</td>
      </tr>
    </table>
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'suppliers',
        order: 6
      }
    }
  </route>
