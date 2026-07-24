<script lang="ts" setup>
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed, ref } from '@vue/reactivity';
import type { Tx, TxResponse } from '@/types';

import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const props = defineProps(['hash', 'chain']);

const blockchain = useBlockchain();
const baseStore = useBaseStore();
const format = useFormatter();
const tx = ref(
  {} as {
    tx: Tx;
    tx_response: TxResponse;
  }
);
if (props.hash) {
  blockchain.rpc.getTx(props.hash).then((x) => (tx.value = x));
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

// JSON viewer controls. `deep` is reactive, so re-assigning it expands or
// collapses the whole tree; 1 leaves only the top level open.
const JSON_DEFAULT_DEPTH = 2;
const jsonDepth = ref(JSON_DEFAULT_DEPTH);
const jsonExpanded = ref(false);
const copied = ref(false);

function toggleJson() {
  jsonExpanded.value = !jsonExpanded.value;
  jsonDepth.value = jsonExpanded.value ? Number.MAX_SAFE_INTEGER : 1;
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(tx.value, null, 2));
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch (err) {
    console.error('Could not copy JSON to the clipboard:', err);
  }
}

</script>
<template>
  <div>
    <div class="tabs tabs-boxed bg-transparent mb-4">
      <RouterLink class="tab text-gray-400 uppercase" :to="`/${chain}/tx/?tab=recent`">{{
        $t('block.recent')
      }}</RouterLink>
      <RouterLink class="tab text-gray-400 uppercase" :to="`/${chain}/tx/?tab=search`">Search</RouterLink>
      <a class="tab text-gray-400 uppercase tab-active">Transaction</a>
    </div>

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
                <RouterLink :to="`/${props.chain}/block/${tx.tx_response.height}`" class="text-primary dark:invert"
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
      <div class="flex items-center justify-between gap-2 mb-2">
        <h2 class="card-title truncate">JSON</h2>
        <div class="flex items-center gap-1">
          <button class="btn btn-xs btn-ghost" @click="toggleJson">
            {{ jsonExpanded ? $t('tx.collapse_all') : $t('tx.expand_all') }}
          </button>
          <button class="btn btn-xs btn-ghost" @click="copyJson">
            {{ copied ? $t('tx.copied') : $t('tx.copy') }}
          </button>
        </div>
      </div>
      <VueJsonPretty
        :data="tx"
        :deep="jsonDepth"
        :theme="baseStore.theme"
        :height="480"
        :item-height="20"
        show-icon
        show-length
        show-line-number
        virtual
      />
    </div>
  </div>
</template>
