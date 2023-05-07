<script lang="ts" setup>
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import type {
  ClientStateWithProof,
  Connection,
  ClientState,
  Channel,
} from '@/types';
import { onMounted } from 'vue';
import { ref } from 'vue';

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
  <div>
    <div class="px-4 pt-3 pb-4 bg-base-100 rounded mb-4 shadow py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <dl
          class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3"
        >
          <div class="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt class="text-base leading-7 text-gray-600">
              {{ conn.client_id }} {{ props.connection_id }}
            </dt>
            <dd
              class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
            >
              {{ baseStore.latest?.block?.header?.chain_id }}
            </dd>
          </div>
          <div class="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt class="text-base leading-7 text-gray-600">{{ conn.state }}</dt>
            <dd
              class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
            >
              &lt;&gt;<VProgressLinear class="w-100" color="success" />
            </dd>
          </div>
          <div class="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt class="text-base leading-7 text-gray-600">
              {{ conn.counterparty?.connection_id }} {{ clientState.client_id }}
            </dt>
            <dd
              class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
            >
              {{ clientState.client_state?.chain_id }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title">IBC Client State</h2>
      <div class="text-sm">
        <br />update after expiry:
        {{ clientState.client_state?.allow_update_after_expiry }}
        <br />allow_update_after_misbehaviour:
        {{ clientState.client_state?.allow_update_after_misbehaviour }}
        <br />trust_level:
        {{ clientState.client_state?.trust_level?.numerator }}/{{
          clientState.client_state?.trust_level?.denominator
        }}
        <br />trusting_period: {{ clientState.client_state?.trusting_period }}
        <br />unbonding_period:
        {{ clientState.client_state?.unbonding_period }} <br />frozen_height:
        {{ clientState.client_state?.frozen_height }} <br />latest_height:
        {{ clientState.client_state?.latest_height }} <br />type:
        {{ clientState.client_state?.['@type'] }} <br />upgrade_path:
        {{ clientState.client_state?.upgrade_path }} <br />
        {{ clientState.client_state?.max_clock_drift }}
      </div>
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title">Channels</h2>
      <div class="overflow-x-auto"></div>
      <table class="table w-full mt-4">
        <thead>
          <tr>
            <th style="position: relative">Channel Id</th>
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
              <VChip :color="color(v.state)">{{ v.state }}</VChip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
