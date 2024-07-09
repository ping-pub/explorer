<script lang="ts" setup>
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed, ref } from '@vue/reactivity';
import type { GetTxResponse } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { logs } from '@cosmjs/stargate';
import { JsonViewer } from 'vue3-json-viewer';
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import 'vue3-json-viewer/dist/index.css';
import { wrapBinary } from '@/libs/utils';

const props = defineProps(['hash', 'chain']);

const blockchain = useBlockchain();
const baseStore = useBaseStore();
const format = useFormatter();
const tx = ref({} as GetTxResponse | undefined);
const tab = ref('msg');

if (props.hash) {
  blockchain.rpc.getTx(props.hash).then((x) => {
    tx.value = x;
  });
}
const messages = computed(() => {
  return tx.value?.tx?.body?.messages || [];
});

const txLogs = computed(() => {
  return (
    tx.value?.txResponse?.logs || logs.parseRawLog(tx.value?.txResponse?.rawLog)
  );
});
</script>
<template>
  <div class="box-content !p-0">
    <div v-if="tx?.txResponse" class="p-4 md:p-6">
      <h2 class="card-title truncate mb-2 text-white">{{ $t('tx.title') }}</h2>
      <div class="overflow-auto-x">
        <table class="table text-sm">
          <tbody>
            <tr>
              <td>{{ $t('tx.tx_hash') }}</td>
              <td>{{ tx?.txResponse.txhash }}</td>
            </tr>
            <tr>
              <td>{{ $t('account.height') }}</td>
              <td>
                <RouterLink
                  :to="`/${props.chain}/block/${tx.txResponse.height}`"
                  class="text-primary dark:text-link"
                  >{{ tx.txResponse.height }}
                </RouterLink>
              </td>
            </tr>
            <tr>
              <td>{{ $t('staking.status') }}</td>
              <td>
                <span
                  class="text-xs truncate relative py-2 px-4 w-fit mr-2 rounded"
                  :class="`text-${
                    tx.txResponse.code === 0 ? 'success' : 'error'
                  }`"
                >
                  <span
                    class="inset-x-0 inset-y-0 opacity-10 absolute"
                    :class="`bg-${
                      tx.txResponse.code === 0 ? 'success' : 'error'
                    }`"
                  ></span>
                  {{ tx.txResponse.code === 0 ? 'Success' : 'Failed' }}
                </span>
                <span>
                  {{ tx.txResponse.code === 0 ? '' : tx?.txResponse?.rawLog }}
                </span>
              </td>
            </tr>
            <tr>
              <td>{{ $t('account.time') }}</td>
              <td>
                {{ format.toLocaleDate(tx.txResponse.timestamp) }} ({{
                  format.toDay(tx.txResponse.timestamp, 'from')
                }})
              </td>
            </tr>
            <tr>
              <td>{{ $t('tx.gas') }}</td>
              <td>
                {{ tx.txResponse.gasUsed }} / {{ tx.txResponse.gasWanted }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('tx.fee') }}</td>
              <td>
                {{
                  format.formatTokens(
                    tx.tx?.authInfo?.fee?.amount,
                    true,
                    '0,0.[00]'
                  )
                }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('tx.memo') }}</td>
              <td>{{ tx.tx?.body?.memo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="border-t border-b border-base-200">
      <div
        class="tabs tabs-boxed customTabV2 bg-transparent mb-4 p-6 pb-0 border-t border-b border-base-300 !rounded-none"
      >
        <a
          class="tab text-gray-400 capitalize !pb-3"
          :class="{ 'tab-active': tab === 'msg' }"
          @click="tab = 'msg'"
          >Messages ({{ messages.length }})</a
        >
        <a
          class="tab text-gray-400 capitalize !pb-2"
          :class="{ 'tab-active': tab === 'log' }"
          @click="tab = 'log'"
          >Logs ({{ txLogs.length }})</a
        >
        <a
          class="tab text-gray-400 capitalize !pb-2"
          :class="{ 'tab-active': tab === 'json' }"
          @click="tab = 'json'"
          >JSON</a
        >
      </div>

      <div v-show="tab === 'msg'">
        <div
          v-if="tx?.txResponse"
          class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4"
        >
          <!-- <h2 class="card-title truncate mb-2">
            {{ $t('account.messages') }}: ({{ messages.length }})
          </h2> -->
          <div v-for="(msg, i) in messages">
            <div class="rounded-md mt-4">
              <DynamicComponent :value="msg" />
            </div>
          </div>
          <div v-if="messages.length === 0">{{ $t('tx.no_messages') }}</div>
        </div>
      </div>

      <div v-show="tab === 'log'">
        <div
          v-if="txLogs"
          class="bg-base-100 px-4 pt-3 pb-4 rounded shadow mb-4"
        >
          <!-- <h2 class="card-title truncate mb-2">
            {{ $t('account.logs') }}: ({{ txLogs.length }})
          </h2> -->
          <div v-for="(msg, i) in txLogs">
            <div class="rounded-md mt-4">
              <DynamicComponent :value="msg" />
            </div>
          </div>
          <div v-if="txLogs.length === 0">{{ $t('tx.no_logs') }}</div>
        </div>
      </div>

      <div v-show="tab === 'json'">
        <div
          v-if="tx?.txResponse"
          class="bg-base-100 px-4 pt-3 pb-4 rounded shadow"
        >
          <!-- <h2 class="card-title truncate mb-2">JSON</h2> -->
          <JsonViewer
            :value="wrapBinary(tx)"
            :theme="baseStore.theme"
            style="background: transparent; border: none"
            copyable
            sort
            expand-depth="5"
            boxed
          />
        </div>
      </div>
    </div>
  </div>
</template>
