<script lang="ts" setup>
import { useBaseStore, useBlockchain } from '@/stores';
import type { Connection, ClientState, Channel } from '@/types';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps(['chain', 'connection_id']);
const chainStore = useBlockchain();
const baseStore = useBaseStore();
const conn = ref({} as Connection);
const clientState = ref({} as { client_id: string; client_state: ClientState });
const channels = ref([] as Channel[]);

onMounted(() => {
  if (props.connection_id) {
    chainStore.rpc.getIBCConnectionsById(props.connection_id).then((x) => {
      conn.value = x.connection;
    });
    chainStore.rpc
      .getIBCConnectionsClientState(props.connection_id)
      .then((x) => {
        clientState.value = x.identified_client_state;
      });
    chainStore.rpc.getIBCConnectionsChannels(props.connection_id).then((x) => {
      channels.value = x.channels;
    });
  }
});

function loadChannel(channel: string, port: string) {
  chainStore.rpc.getIBCChannelNextSequence(channel, port).then((x) => {
    console.log(x);
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
  <div class="card card-bordered border-primary ml-4 rounded-t-md">
    <div class="px-4 pt-3 pb-4 bg-base-100 rounded mb-4 shadow ">
      <div class="mx-auto max-w-7xl px-6 lg:!px-8">
        <dl class="grid grid-cols-1 gap-x-6 text-center lg:!grid-cols-3">
          <div class="mx-auto flex items-center">
            <div>
              <div class="order-first text-3xl font-semibold tracking-tight text-main mb-1">
                {{ baseStore.latest?.block?.header?.chain_id }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ conn.client_id }} {{ props.connection_id }}
              </div>
            </div>
          </div>
          <div class="mx-auto flex items-center">
            <div>
              <Icon icon="mdi:arrow-left-right" class="text-4xl mx-auto" />
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ conn.state }}
              </div>
            </div>
          </div>
          <div class="mx-auto">
            <div class="order-first text-3xl font-semibold tracking-tight text-main mb-2">
              {{ clientState.client_state?.chain_id }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ conn.counterparty?.connection_id }} {{ clientState.client_id }}
            </div>
          </div>
        </dl>
      </div>
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4">IBC Client State</h2>
      <div class="overflow-x-auto">
        <table class="table table-compact text-sm w-full">
          <tbody>
            <tr>
              <td class="w-52">update after expiry:</td>
              <td>{{ clientState.client_state?.allow_update_after_expiry }}</td>
            </tr>
            <tr>
              <td class="w-52">allow_update_after_misbehaviour:</td>
              <td>
                {{ clientState.client_state?.allow_update_after_misbehaviour }}
              </td>
            </tr>
            <tr>
              <td class="w-52">trust_level:</td>
              <td>
                {{ clientState.client_state?.trust_level?.numerator }}/{{
                  clientState.client_state?.trust_level?.denominator
                }}
              </td>
            </tr>
            <tr>
              <td class="w-52">trusting_period:</td>
              <td>{{ clientState.client_state?.trusting_period }}</td>
            </tr>
            <tr>
              <td class="w-52">unbonding_period:</td>
              <td>{{ clientState.client_state?.unbonding_period }}</td>
            </tr>
            <tr>
              <td class="w-52">frozen_height:</td>
              <td>{{ clientState.client_state?.frozen_height }}</td>
            </tr>
            <tr>
              <td class="w-52">latest_height:</td>
              <td>{{ clientState.client_state?.latest_height }}</td>
            </tr>
            <tr>
              <td class="w-52">type:</td>
              <td>{{ clientState.client_state?.['@type'] }}</td>
            </tr>
            <tr>
              <td class="w-52">upgrade_path:</td>
              <td>{{ clientState.client_state?.upgrade_path }}</td>
            </tr>
            <tr>
              <td class="w-52">max_clock_drift:</td>
              <td>{{ clientState.client_state?.max_clock_drift }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow overflow-hidden">
      <h2 class="card-title">Channels</h2>
      <div class="overflow-auto">
        <table class="table w-full mt-4">
          <thead>
            <tr>
              <th style="position: relative; z-index: 2">Channel Id</th>
              <th>Port Id</th>
              <th>Counterparty</th>
              <th>Hops</th>
              <th>Version</th>
              <th>Ordering</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in channels">
              <td>
                <a href="#" @click="loadChannel(v.channel_id, v.port_id)">{{
                  v.channel_id
                }}</a>
              </td>
              <td>{{ v.port_id }}</td>
              <td>
                {{ v.counterparty?.port_id }}/{{ v.counterparty?.channel_id }}
              </td>
              <td>{{ v.connection_hops.join(', ') }}</td>
              <td>{{ v.version }}</td>
              <td>{{ v.ordering }}</td>
              <td>
                <div class="text-xs truncate relative py-2 px-4 rounded-full w-fit" :class="`text-${color(v.state)}`">
                  <span class="inset-x-0 inset-y-0 opacity-10 absolute" :class="`bg-${color(v.state)}`"></span>
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
