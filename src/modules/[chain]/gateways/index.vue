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
  pageload(1)
});

function pageload(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getGateways().then(x => {
    list.value = x.gateways
    pageResponse.value = x.pagination
  });
}

</script>
<template>
  <div class="overflow-auto">
    <table class="table table-compact">
      <thead class=" bg-base-200">
        <tr>
          <td>Rank</td>
          <td>Address</td>
          <td>Stake</td>
        </tr>
      </thead>
      <tr v-for="item, index in list.sort((a:any, b:any) => {
          return parseInt(b.stake.amount) - parseInt(a.stake.amount);
        })" class="hover">
        <td>{{ index }}</td>
        <td>
          <div class="flex flex-col">
            <span class="text-sm text-primary dark:invert whitespace-nowrap overflow-hidden">

              <RouterLink
                :to="`/${chainStore.chainName}/supplier/${item?.address}`"
              class="font-weight-medium">{{ item.address }}</RouterLink>
            </span>
            <span class="text-xs">{{ item.address }}</span>
          </div>
        </td>
        <td>{{ item.stake?.amount }} {{ item.stake?.denom }}</td>
      </tr>
    </table>
    <PaginationBar :limit="pageRequest.limit" :total="pageResponse.total" :callback="pageload" />
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'gateways',
        order: 5
      }
    }
  </route>
