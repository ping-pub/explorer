<script lang="ts" setup>
import { formatSeconds } from '@/libs/utils';
import { useBaseStore, useBlockchain } from '@/stores';
import type { Connection, ClientState, Channel } from '@/types';
import { computed, onMounted } from 'vue';
import { ref } from 'vue';
import { useIBCModule } from '../connStore';

const props = defineProps(['chain', 'connection_id']);
const chainStore = useBlockchain();
const baseStore = useBaseStore();
const ibcStore = useIBCModule()
const conn = ref({} as Connection);
const clientState = ref({} as { client_id: string; client_state: ClientState });
const channels = ref([] as Channel[]);

const connId = computed(() => {
  return props.connection_id || 0
})

onMounted(() => {
  if (connId.value) {
    chainStore.rpc.getIBCConnectionsById(connId.value).then((x) => {
      conn.value = x.connection;
    });
    chainStore.rpc
      .getIBCConnectionsClientState(connId.value)
      .then((x) => {
        clientState.value = x.identified_client_state;
      });
    chainStore.rpc.getIBCConnectionsChannels(connId.value).then((x) => {
      channels.value = x.channels;
    });
  }
});

function loadChannel(channel: string, port: string) {
  chainStore.rpc.getIBCChannelNextSequence(channel, port).then((x) => {
    console.log(x);
  });
}

function fetchSendingTxs(channel: string, port: string) {
  chainStore.rpc.getTxs("?&pagination.reverse=true&events=send_packet.packet_src_channel='${channel}'&events=send_packet.packet_src_port='${port}'", { channel, port }).then(res => {
    console.log(res)
  })
}
function fetchRecevingTxs(channel: string, port: string) {
  chainStore.rpc.getTxs("?&pagination.reverse=true&events=recv_packet.packet_dst_channel='${channel}'&events=recv_packet.packet_dst_port='${port}'", { channel, port }).then(res => {
    console.log(res)
  })
}

function color(v: string) {
  if (v && v.indexOf('_OPEN') > -1) {
    return 'success';
  }
  return 'warning';
}
</script>
<template>
  <div class="">
    <div class="px-4 pt-3 pb-4 bg-base-200 rounded mb-4 shadow ">
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
            <div :class="{ 'text-success': conn.state?.indexOf('_OPEN') > -1 }">
              <span class="text-lg rounded-full">&#x21cc;</span>
              <div class=" text-c">
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
      <h2 class="card-title mb-4 overflow-hidden">IBC Client <span class="ml-2 text-sm">{{
        clientState.client_state?.['@type'] }}</span></h2>
      <div class="overflow-x-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <table class="table table-sm capitalize">
          <thead class="bg-base-200">
            <tr>
              <td colspan="3">Trust Parameters</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="w-52">trust level:</td>
              <td>
                {{ clientState.client_state?.trust_level?.numerator }}/{{
                  clientState.client_state?.trust_level?.denominator
                }}
              </td>
            </tr>
            <tr>
              <td class="w-52">trusting period:</td>
              <td>{{ formatSeconds(clientState.client_state?.trusting_period) }}</td>
            </tr>
            <tr>
              <td class="w-52">unbonding period:</td>
              <td>{{ formatSeconds(clientState.client_state?.unbonding_period) }}</td>
            </tr>
            <tr>
              <td class="w-52">max clock drift:</td>
              <td>{{ formatSeconds(clientState.client_state?.max_clock_drift) }}</td>
            </tr>
            <tr>
              <td class="w-52">frozen height:</td>
              <td>{{ clientState.client_state?.frozen_height }}</td>
            </tr>
            <tr>
              <td class="w-52">latest height:</td>
              <td>{{ clientState.client_state?.latest_height }}</td>
            </tr>
          </tbody>
        </table>
        <table class="table table-sm text-sm w-full capitalize">
          <thead class="bg-base-200">
            <tr>
              <td colspan="2">Upgrade Parameters</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="2">
                <div class="flex justify-between"><span>allow update after expiry:</span> <span>{{
                  clientState.client_state?.allow_update_after_expiry }}</span></div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="flex justify-between"><span>allow update after misbehaviour: </span> <span>{{
                  clientState.client_state?.allow_update_after_misbehaviour }}</span></div>
              </td>
            </tr>
            <tr>
              <td class="w-52">upgrade path:</td>
              <td class="text-right">{{ clientState.client_state?.upgrade_path.join(', ') }}</td>
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
              <th>Txs</th>
              <th style="position: relative; z-index: 2">Channel Id</th>
              <th>Port Id</th>
              <th>State</th>
              <th>Counterparty</th>
              <th>Hops</th>
              <th>Version</th>
              <th>Ordering</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in ibcStore.registryChannels">
              <td>
                <div class="flex gap-1">
                <label class="btn btn-xs" @click="fetchSendingTxs(v[ibcStore.sourceField].channel_id, v[ibcStore.sourceField].port_id)">Out</label>
                <label class="btn btn-xs" @click="fetchRecevingTxs(v[ibcStore.sourceField].channel_id, v[ibcStore.sourceField].port_id)">In</label>
                </div>
              </td>
              <td>
                <a href="#">{{
                  v[ibcStore.sourceField].channel_id
                }}</a>
              </td>
              <td>{{ v[ibcStore.sourceField].port_id }}</td>
            </tr>
            <tr v-for="v in channels">
              <td>
                <div class="flex gap-1">
                <label class="btn btn-xs" @click="fetchSendingTxs(v.channel_id, v.port_id)">Out</label>
                <label class="btn btn-xs" @click="fetchRecevingTxs(v.channel_id, v.port_id)">In</label>
                </div>
              </td>
              <td>
                <a href="#" @click="loadChannel(v.channel_id, v.port_id)">{{
                  v.channel_id
                }}</a>
              </td>
              <td>{{ v.port_id }}</td>
              <td>
                <div class="text-xs truncate relative py-2 px-4 rounded-full w-fit" :class="`text-${color(v.state)}`">
                  <span class="inset-x-0 inset-y-0 opacity-10 absolute" :class="`bg-${color(v.state)}`"></span>
                  {{ v.state }}
                </div>
              </td>
              <td>
                {{ v.counterparty?.port_id }}/{{ v.counterparty?.channel_id }}
              </td>
              <td>{{ v.connection_hops.join(', ') }}</td>
              <td>{{ v.version }}</td>
              <td>{{ v.ordering }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
