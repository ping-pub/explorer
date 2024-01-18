<script lang="ts" setup>
import { formatSeconds } from '@/libs/utils';
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import {
  type Connection,
  type ClientState,
  type Channel,
  PageRequest,
  type TxResponse,
  type PaginatedTxs,
} from '@/types';
import { computed, onMounted } from 'vue';
import { ref } from 'vue';
import { useIBCModule } from '../connStore';
import PaginationBar from '@/components/PaginationBar.vue';
import { Icon } from '@iconify/vue';
import type { ConnectionEnd } from 'cosmjs-types/ibc/core/connection/v1/connection';
import type { IdentifiedClientState } from 'cosmjs-types/ibc/core/client/v1/client';
import type { IdentifiedChannel } from 'cosmjs-types/ibc/core/channel/v1/channel';
import {
  ClientState as TendermintClientState,
  ConsensusState as TendermintConsensusState,
} from 'cosmjs-types/ibc/lightclients/tendermint/v1/tendermint';
import { State } from 'cosmjs-types/ibc/core/channel/v1/channel';
import type { TxSearchResponse } from '@cosmjs/tendermint-rpc';
import { toBase64, toHex } from '@cosmjs/encoding';
import type { ExtraTxSearchResponse } from '@/libs/client';

const props = defineProps(['chain', 'connection_id']);
const chainStore = useBlockchain();
const baseStore = useBaseStore();
const format = useFormatter();
const ibcStore = useIBCModule();
const conn = ref({} as ConnectionEnd | undefined);
const clientState = ref(
  {} as (IdentifiedClientState & TendermintClientState) | undefined
);
const channels = ref([] as IdentifiedChannel[]);

const connId = computed(() => {
  return props.connection_id || 0;
});

const loading = ref(false);
const txs = ref({} as ExtraTxSearchResponse);
const direction = ref('');
const channel_id = ref('');
const port_id = ref('');
const page = ref(new PageRequest());
page.value.limit = 5;

onMounted(() => {
  if (connId.value) {
    chainStore.rpc.getIBCConnectionsById(connId.value).then((x) => {
      conn.value = x.connection;
    });
    chainStore.rpc.getIBCConnectionsClientState(connId.value).then((x) => {
      // @ts-ignore
      clientState.value = x.identifiedClientState;
      if (x.identifiedClientState?.clientState) {
        Object.assign(
          clientState.value!,
          TendermintClientState.decode(
            x.identifiedClientState?.clientState.value
          )
        );
      }
      console.log('getIBCConnectionsClientState', clientState.value);
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

function pageload(pageNum: number) {
  if (direction.value === 'In') {
    fetchSendingTxs(channel_id.value, port_id.value, pageNum - 1);
  } else {
    fetchSendingTxs(channel_id.value, port_id.value, pageNum - 1);
  }
}

function fetchSendingTxs(channel: string, port: string, pageNum = 0) {
  page.value.setPage(pageNum);
  loading.value = true;
  direction.value = 'Out';
  channel_id.value = channel;
  port_id.value = port;
  txs.value = {} as ExtraTxSearchResponse;
  chainStore.rpc
    .getTxs(
      [
        {
          key: 'send_packet.packet_src_channel',
          value: channel,
        },
        {
          key: 'send_packet.packet_src_port',
          value: port,
        },
      ],
      page.value
    )
    .then((res) => {
      txs.value = res;
    })
    .finally(() => (loading.value = false));
}
function fetchRecevingTxs(channel: string, port: string, pageNum = 0) {
  page.value.setPage(pageNum);
  loading.value = true;
  direction.value = 'In';
  channel_id.value = channel;
  port_id.value = port;
  txs.value = {} as ExtraTxSearchResponse;
  chainStore.rpc
    .getTxs(
      [
        {
          key: 'recv_packet.packet_dst_channel',
          value: channel,
        },
        {
          key: 'recv_packet.packet_dst_port',
          value: port,
        },
      ],
      page.value
    )
    .then((res) => {
      txs.value = res;
    })
    .finally(() => (loading.value = false));
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
    <div class="px-4 pt-3 pb-4 bg-base-200 rounded mb-4 shadow">
      <div class="mx-auto max-w-7xl px-6 lg:!px-8">
        <dl class="grid grid-cols-1 gap-x-6 text-center lg:!grid-cols-3">
          <div class="mx-auto flex items-center">
            <div>
              <div
                class="order-first text-3xl font-semibold tracking-tight text-main mb-1"
              >
                {{ baseStore.latest?.block?.header?.chainId }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ conn?.clientId }} {{ props.connection_id }}
              </div>
            </div>
          </div>
          <div class="mx-auto flex items-center">
            <div :class="{ 'text-success': conn?.state === State.STATE_OPEN }">
              <span class="text-lg rounded-full">&#x21cc;</span>
              <div class="text-c">
                {{ conn?.state }}
              </div>
            </div>
          </div>
          <div class="mx-auto">
            <div
              class="order-first text-3xl font-semibold tracking-tight text-main mb-2"
            >
              {{ clientState?.chainId }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ conn?.counterparty?.connectionId }} {{ clientState?.clientId }}
            </div>
          </div>
        </dl>
      </div>
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title mb-4 overflow-hidden">
        {{ $t('ibc.title_2')
        }}<span class="ml-2 text-sm">{{
          clientState?.clientState?.typeUrl
        }}</span>
      </h2>
      <div class="overflow-x-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <table class="table table-sm capitalize">
          <thead class="bg-base-200">
            <tr>
              <td colspan="3">{{ $t('ibc.trust_parameters') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="w-52">{{ $t('ibc.trust_level') }}:</td>
              <td>
                {{ clientState?.trustLevel?.numerator }}/{{
                  clientState?.trustLevel?.denominator
                }}
              </td>
            </tr>
            <tr>
              <td class="w-52">{{ $t('ibc.trusting_period') }}:</td>
              <td>
                {{ formatSeconds(clientState?.trustingPeriod) }}
              </td>
            </tr>
            <tr>
              <td class="w-52">{{ $t('ibc.unbonding_period') }}:</td>
              <td>
                {{ formatSeconds(clientState?.unbondingPeriod) }}
              </td>
            </tr>
            <tr>
              <td class="w-52">{{ $t('ibc.max_clock_drift') }}:</td>
              <td>
                {{ formatSeconds(clientState?.maxClockDrift) }}
              </td>
            </tr>
            <tr>
              <td class="w-52">{{ $t('ibc.frozen_height') }}:</td>
              <td>
                {{ clientState?.frozenHeight?.revisionHeight.toString() }}
              </td>
            </tr>
            <tr>
              <td class="w-52">{{ $t('ibc.latest_height') }}:</td>
              <td>
                {{ clientState?.latestHeight?.revisionHeight.toString() }}
              </td>
            </tr>
          </tbody>
        </table>
        <table class="table table-sm text-sm w-full capitalize">
          <thead class="bg-base-200">
            <tr>
              <td colspan="2">{{ $t('ibc.upgrade_parameters') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="2">
                <div class="flex justify-between">
                  <span>{{ $t('ibc.allow_update_after_expiry') }}:</span>
                  <span>{{ clientState?.allowUpdateAfterExpiry }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="flex justify-between">
                  <span>{{ $t('ibc.allow_update_after_misbehaviour') }}: </span>
                  <span>{{ clientState?.allowUpdateAfterMisbehaviour }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="w-52">{{ $t('ibc.upgrade_path') }}:</td>
              <td class="text-right">
                {{ clientState?.upgradePath?.join(', ') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow overflow-hidden">
      <h2 class="card-title">{{ $t('ibc.channels') }}</h2>
      <div class="overflow-auto">
        <table class="table w-full mt-4">
          <thead>
            <tr>
              <th>{{ $t('ibc.txs') }}</th>
              <th style="position: relative; z-index: 2">
                {{ $t('ibc.channel_id') }}
              </th>
              <th>{{ $t('ibc.port_id') }}</th>
              <th>{{ $t('ibc.state') }}</th>
              <th>{{ $t('ibc.counterparty') }}</th>
              <th>{{ $t('ibc.hops') }}</th>
              <th>{{ $t('ibc.version') }}</th>
              <th>{{ $t('ibc.ordering') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in ibcStore.registryChannels">
              <td>
                <div class="flex gap-1">
                  <button
                    class="btn btn-xs"
                    @click="
                      fetchSendingTxs(
                        v[ibcStore.sourceField].channel_id,
                        v[ibcStore.sourceField].port_id
                      )
                    "
                    :disabled="loading"
                  >
                    <span
                      v-if="loading"
                      class="loading loading-spinner loading-sm"
                    ></span>
                    {{ $t('ibc.btn_out') }}
                  </button>
                  <button
                    class="btn btn-xs"
                    @click="
                      fetchRecevingTxs(
                        v[ibcStore.sourceField].channel_id,
                        v[ibcStore.sourceField].port_id
                      )
                    "
                    :disabled="loading"
                  >
                    <span
                      v-if="loading"
                      class="loading loading-spinner loading-sm"
                    ></span>
                    {{ $t('ibc.btn_in') }}
                  </button>
                </div>
              </td>
              <td>
                <a href="#">{{ v[ibcStore.sourceField].channel_id }}</a>
              </td>
              <td>{{ v[ibcStore.sourceField].port_id }}</td>
            </tr>
            <tr v-for="v in channels">
              <td>
                <div class="flex gap-1">
                  <button
                    class="btn btn-xs"
                    @click="fetchSendingTxs(v.channelId, v.portId)"
                    :disabled="loading"
                  >
                    <span
                      v-if="loading"
                      class="loading loading-spinner loading-sm"
                    ></span>
                    {{ $t('ibc.btn_out') }}
                  </button>
                  <button
                    class="btn btn-xs"
                    @click="fetchRecevingTxs(v.channelId, v.portId)"
                    :disabled="loading"
                  >
                    <span
                      v-if="loading"
                      class="loading loading-spinner loading-sm"
                    ></span>
                    {{ $t('ibc.btn_in') }}
                  </button>
                </div>
              </td>
              <td>
                <a href="#" @click="loadChannel(v.channelId, v.portId)">{{
                  v.channelId
                }}</a>
              </td>
              <td>{{ v.portId }}</td>
              <td>
                <div
                  class="text-xs truncate relative py-2 px-4 rounded-full w-fit"
                  :class="`text-${color(v.state.toString())}`"
                >
                  <span
                    class="inset-x-0 inset-y-0 opacity-10 absolute"
                    :class="`bg-${color(v.state.toString())}`"
                  ></span>
                  {{ v.state }}
                </div>
              </td>
              <td>
                {{ v.counterparty?.portId }}/{{ v.counterparty?.channelId }}
              </td>
              <td>{{ v.connectionHops.join(', ') }}</td>
              <td>{{ v.version }}</td>
              <td>{{ v.ordering }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="channel_id">
      <h3 class="card-title capitalize">
        Transactions ({{ channel_id }} {{ port_id }} {{ direction }})
      </h3>
      <table class="table">
        <thead>
          <tr>
            <td>{{ $t('ibc.height') }}</td>
            <td>{{ $t('ibc.txhash') }}</td>
            <td>{{ $t('ibc.messages') }}</td>
            <td>{{ $t('ibc.time') }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resp in txs?.txs">
            <td>{{ resp.height }}</td>
            <td>
              <div class="text-xs truncate text-primary dark:invert">
                <RouterLink
                  :to="`/${chainStore.chainName}/tx/${toHex(resp.hash)}`"
                  >{{ toBase64(resp.hash) }}</RouterLink
                >
              </div>
            </td>
            <td>
              <div class="flex">
                {{ format.messages(resp.txRaw.body.messages) }}
                <Icon
                  v-if="resp.result.code === 0"
                  icon="mdi-check"
                  class="text-success text-lg"
                />
                <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
              </div>
            </td>
            <td>{{ format.toLocaleDate(resp.timestamp) }}</td>
          </tr>
        </tbody>
      </table>
      <PaginationBar
        :limit="page.limit"
        :total="txs.totalCount.toString()"
        :callback="pageload"
      />
    </div>
  </div>
</template>
