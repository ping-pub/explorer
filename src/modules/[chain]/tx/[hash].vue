<script lang="ts" setup>
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed, ref } from '@vue/reactivity';
import type { GetTxResponse } from 'cosmjs-types/cosmos/tx/v1beta1/service';

import { JsonViewer } from 'vue3-json-viewer';
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import 'vue3-json-viewer/dist/index.css';
import { TXS_CACHE } from '@/libs/utils';

const props = defineProps(['hash', 'chain']);

const blockchain = useBlockchain();
const baseStore = useBaseStore();
const format = useFormatter();
const tx = ref({} as GetTxResponse);
if (props.hash) {
  blockchain.rpc.getTx(props.hash).then((x) => {
    tx.value = x ?? TXS_CACHE[props.hash];
  });
}
const messages = computed(() => {
  return tx.value.tx?.body?.messages || [];
});
</script>
<template>
  <div>
    <div
      v-if="tx.txResponse"
      class="bg-base-100 px-4 pt-3 pb-4 rounded shadow mb-4"
    >
      <h2 class="card-title truncate mb-2">{{ $t('tx.title') }}</h2>
      <div class="overflow-auto-x">
        <table class="table text-sm">
          <tbody>
            <tr>
              <td>{{ $t('tx.tx_hash') }}</td>
              <td>{{ tx.txResponse.txhash }}</td>
            </tr>
            <tr>
              <td>{{ $t('account.height') }}</td>
              <td>
                <RouterLink
                  :to="`/${props.chain}/block/${tx.txResponse.height}`"
                  class="text-primary dark:invert"
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

    <div
      v-if="tx.txResponse"
      class="bg-base-100 px-4 pt-3 pb-4 rounded shadow mb-4"
    >
      <h2 class="card-title truncate mb-2">
        {{ $t('account.messages') }}: ({{ messages.length }})
      </h2>
      <div v-for="(msg, i) in messages">
        <div class="border border-slate-400 rounded-md mt-4">
          <DynamicComponent :value="msg" />
        </div>
      </div>
      <div v-if="messages.length === 0">{{ $t('tx.no_messages') }}</div>
    </div>

    <div v-if="tx.txResponse" class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title truncate mb-2">JSON</h2>
      <JsonViewer
        :value="tx"
        :theme="baseStore.theme"
        style="background: transparent"
        copyable
        boxed
        sort
        expand-depth="5"
      />
    </div>
  </div>
</template>
