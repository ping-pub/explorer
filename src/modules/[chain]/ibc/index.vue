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
        <table class="table table-compact w-full table-zebra">
          <thead>
            <tr>
              <th class="py-3">Connection Id</th>
              <th class="py-3">Connection</th>
              <th class="py-3">Delay Period</th>
              <th class="py-3">State</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, index) in list" :key="index">
              <td class="py-2">
                <RouterLink :to="`/${chain}/ibc/${v.id}`" class="text-primary">
                  {{ v.id }}
                </RouterLink>
              </td>
              <td class="py-2">
                {{ v.client_id }} {{ v.id }} <br />
                {{ v.counterparty.client_id }}
                {{ v.counterparty.connection_id }}
              </td>
              <td class="py-2">{{ v.delay_period }}</td>
              <td class="py-2">
                <div
                  class="text-xs truncate relative py-[2px] px-3 rounded-full w-fit"
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
        order: 9
      }
    }
</route>
