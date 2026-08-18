<script lang="ts" setup>
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed, ref, watch } from 'vue';
import type { Tx, TxResponse } from '@/types';

import JsonTree from '@/components/JsonTree.vue';
import { useRouter } from 'vue-router';

const props = defineProps(['hash', 'chain']);
const router = useRouter();
const searchHash = ref('');
const searchError = ref('');
const hashPattern = /^[A-Fa-f\d]{64}$/;

const blockchain = useBlockchain();
const baseStore = useBaseStore();
const format = useFormatter();
const tx = ref(
  {} as {
    tx: Tx;
    tx_response: TxResponse;
  }
);
async function loadTransaction(hash: string) {
  tx.value = {} as { tx: Tx; tx_response: TxResponse };
  tx.value = await blockchain.rpc.getTx(hash);
}
watch(() => props.hash, (hash) => {
  if (hash) void loadTransaction(hash);
}, { immediate: true });
function search() {
  const value = searchHash.value.trim();
  if (!hashPattern.test(value)) {
    searchError.value = 'Enter a valid 64-character transaction hash.';
    return;
  }
  searchError.value = '';
  router.push(`/${props.chain}/tx/${value.toUpperCase()}`);
}
const messages = computed(() => {
  return (
    tx.value.tx?.body?.messages.map((x) => {
      if (x.packet?.data) {
        // @ts-ignore
        x.message = format.base64ToString(x.packet.data);
      }
      return x;
    }) || []
  );
});

</script>
<template>
  <div>
    <form class="mb-4" role="search" @submit.prevent="search">
      <div class="join flex w-full">
        <input v-model="searchHash" type="text" class="input join-item input-sm h-10 min-w-0 flex-1 border border-base-300 bg-base-100 px-4 focus:border-primary" placeholder="Enter transaction hash" aria-label="Transaction hash" @input="searchError = ''" />
        <button type="submit" class="btn btn-primary join-item !h-10 !min-h-10 py-0">Search</button>
      </div>
      <p v-if="searchError" class="mt-2 text-sm text-error">{{ searchError }}</p>
    </form>

    <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 rounded shadow mb-4">
      <h2 class="card-title truncate mb-2">{{ $t('tx.title') }}</h2>
      <div class="overflow-hidden">
        <table class="table text-sm">
          <tbody>
            <tr>
              <td>{{ $t('tx.tx_hash') }}</td>
              <td class="overflow-hidden">{{ tx.tx_response.txhash }}</td>
            </tr>
            <tr>
              <td>{{ $t('account.height') }}</td>
              <td>
                <RouterLink :to="`/${props.chain}/block/${tx.tx_response.height}`" class="text-primary"
                  >{{ tx.tx_response.height }}
                </RouterLink>
              </td>
            </tr>
            <tr>
              <td>{{ $t('staking.status') }}</td>
              <td>
                <span
                  class="text-xs truncate relative py-2 px-4 w-fit mr-2 rounded"
                  :class="`text-${tx.tx_response.code === 0 ? 'success' : 'error'}`"
                >
                  <span
                    class="inset-x-0 inset-y-0 opacity-10 absolute"
                    :class="`bg-${tx.tx_response.code === 0 ? 'success' : 'error'}`"
                  ></span>
                  {{ tx.tx_response.code === 0 ? 'Success' : 'Failed' }}
                </span>
                <span>
                  {{ tx.tx_response.code === 0 ? '' : tx?.tx_response?.raw_log }}
                </span>
              </td>
            </tr>
            <tr>
              <td>{{ $t('account.time') }}</td>
              <td>
                {{ format.toLocaleDate(tx.tx_response.timestamp) }} ({{
                  format.toDay(tx.tx_response.timestamp, 'from')
                }})
              </td>
            </tr>
            <tr>
              <td>{{ $t('tx.gas') }}</td>
              <td>{{ tx.tx_response.gas_used }} / {{ tx.tx_response.gas_wanted }}</td>
            </tr>
            <tr>
              <td>{{ $t('tx.fee') }}</td>
              <td>
                {{ format.formatTokens(tx.tx?.auth_info?.fee?.amount, true, '0,0.[00]') }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('tx.memo') }}</td>
              <td>{{ tx.tx.body.memo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 rounded shadow mb-4">
      <h2 class="card-title truncate mb-2">{{ $t('account.messages') }}: ({{ messages.length }})</h2>
      <div v-for="(msg, i) in messages">
        <div class="border border-slate-400 rounded-md mt-4">
          <DynamicComponent :value="msg" />
        </div>
      </div>
      <div v-if="messages.length === 0">{{ $t('tx.no_messages') }}</div>
    </div>

    <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title truncate mb-2">JSON</h2>
      <JsonTree :data="tx" :deep="2" :height="480" virtual />
    </div>
  </div>
</template>
