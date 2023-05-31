<script lang="ts" setup>
import PaginationBar from '@/components/PaginationBar.vue';
import { useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type Connection, type Pagination } from '@/types';
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps(['chain']);
const chainStore = useBlockchain();
const list = ref([] as Connection[]);
const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

onMounted(() => {
  pageload(1)
});

function pageload(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getIBCConnections(pageRequest.value).then((x) => {
    list.value = x.connections;
    pageResponse.value = x.pagination
  });
}

function color(v: string) {
  if (v && v.indexOf('_OPEN') > -1) {
    return 'success';
  }
  return 'warning';
}
</script>
<template>
  <div>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title py-4">IBC Connections</h2>
      <div class="flex">
        <div class="">
          <table class="table table-compact w-full table-zebra">
            <thead>
              <tr>
                <th class="py-3">Connection Id</th>
                <th class="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(v, index) in list" :key="index">
                <td class="py-2">
                  <RouterLink :to="`/${chain}/ibc/connection/${v.id}`" class="text-primary">
                    {{ v.id }}
                  </RouterLink>
                </td>
                <td class="py-2">
                  <div class="text-xs truncate relative py-[2px] px-3 rounded-full w-fit"
                    :class="`text-${color(v.state)}`">
                    <span class="inset-x-0 inset-y-0 opacity-10 absolute" :class="`bg-${color(v.state)}`"></span>
                    {{ String(v.state).replace("STATE_", "") }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="grow overflow-auto">
          <router-view :key="$route.fullPath"></router-view>
        </div>
      </div>
      <PaginationBar :limit="pageRequest.limit" :total="pageResponse.total" :callback="pageload" />
    </div>
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'ibc',
        order: 9
      }
    }
</route>
