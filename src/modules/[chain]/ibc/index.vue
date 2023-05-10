<script lang="ts" setup>
import { useBlockchain, useFormatter } from '@/stores';
import type { Connection } from '@/types';
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps(['chain']);
const chainStore = useBlockchain();
const list = ref([] as Connection[]);
onMounted(() => {
  chainStore.rpc.getIBCConnections().then((x) => {
    list.value = x.connections;
  });
});

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
      <h2 class="card-title">IBC Connections</h2>
      <div class="overflow-x-auto mt-4">
        <table class="table w-full">
          <thead>
            <tr>
              <th style="position: relative">Connection Id</th>
              <th>Connection</th>
              <th>Delay Period</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in list">
              <td>
                <RouterLink :to="`/${chain}/ibc/${v.id}`">{{
                  v.id
                }}</RouterLink>
              </td>
              <td>
                {{ v.client_id }} {{ v.id }} <br />
                {{ v.counterparty.client_id }}
                {{ v.counterparty.connection_id }}
              </td>
              <td>{{ v.delay_period }}</td>
              <td>
                <div 
                  class="text-xs truncate relative py-2 px-4 rounded-full w-fit"
                  :class="`text-${color(v.state)}`"
                >
                  <span 
                    class="inset-x-0 inset-y-0 opacity-10 absolute"
                    :class="`bg-${color(v.state)}`"
                  ></span>
                  {{ v.state }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'ibc',
        order: 8
      }
    }
</route>
