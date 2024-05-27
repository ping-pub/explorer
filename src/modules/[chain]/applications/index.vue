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
  pageload(1)
});

function pageload(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getApplications(pageRequest.value).then(x => {
    list.value = x.applications
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
          <td>No. Of Services</td>
          <td>Services</td>
        </tr>
      </thead>
      <tr v-for="item, index in list.sort((a, b) => {
          return parseInt(b.stake.amount) - parseInt(a.stake.amount);
        })" class="hover">
        <td>{{ index }}</td>
        <td>
          <div class="flex flex-col">
            <span class="text-sm text-primary dark:invert whitespace-nowrap overflow-hidden">

              <RouterLink
                :to="`/${chainStore.chainName}/account/${item?.address}`"
              class="font-weight-medium">{{ item.address }}</RouterLink>
            </span>
            <span class="text-xs">{{ item.address }}</span>
          </div>
        </td>
        <td class="font-bold">{{ format.formatToken(item.stake) }}</td>
        <td>{{ item.service_configs?.length }}</td>
        <td>{{ item.service_configs?.map((sc:any) => sc.service.name?.length > 0 ? sc.service.name : sc.service.id).join(", ")
        }}</td>
      </tr>
    </table>
    <PaginationBar :limit="pageRequest.limit" :total="pageResponse.total" :callback="pageload" />
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
