<script lang="ts" setup>
import { useBlockchain, useFormatter } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed, ref } from '@vue/reactivity';
import type { Tx, TxResponse } from '@/types';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const props = defineProps(['hash', 'chain']);

const blockchain = useBlockchain();
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
  return tx.value.tx?.body?.messages || [];
});
</script>
<template>
  <div>
    <div
      v-if="tx.tx_response"
      class="bg-base-100 px-4 pt-3 pb-4 rounded shadow mb-4"
    >
      <h2 class="card-title truncate mb-2">Summary</h2>
      <div class="overflow-auto-x">
      <table class="table text-sm">
        <tbody>
            <tr>
              <td>Tx Hash</td>
              <td>{{ tx.tx_response.txhash }}</td>
            </tr>
            <tr>
              <td>Height</td>
              <td>
                <RouterLink
                  :to="`/${props.chain}/block/${tx.tx_response.height}`"
                  >{{ tx.tx_response.height }}</RouterLink
                >
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                <VChip v-if="tx.tx_response.code === 0" color="success"
                  >Success</VChip
                >
                <span v-else><VChip color="error">Failded</VChip></span>
              </td>
            </tr>
            <tr>
              <td>Time</td>
              <td>
                {{ tx.tx_response.timestamp }} ({{
                  format.toDay(tx.tx_response.timestamp, 'from')
                }})
              </td>
            </tr>
            <tr>
              <td>Gas</td>
              <td>
                {{ tx.tx_response.gas_used }} / {{ tx.tx_response.gas_wanted }}
              </td>
            </tr>
            <tr>
              <td>Fee</td>
              <td>
                {{
                  format.formatTokens(
                    tx.tx?.auth_info?.fee?.amount,
                    true,
                    '0,0.[00]'
                  )
                }}
              </td>
            </tr>
            <tr>
              <td>Memo</td>
              <td>{{ tx.tx.body.memo }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div
      v-if="tx.tx_response"
      class="bg-base-100 px-4 pt-3 pb-4 rounded shadow mb-4"
    >
      <h2 class="card-title truncate mb-2">Messages: ({{messages.length}})</h2>
      <div class="divider"></div>
      <div v-for="(msg, i) in messages">
        <div><DynamicComponent :value="msg" /></div>
      </div>
      <div v-if="messages.length === 0">No messages</div>
    </div>

    
    <div
      v-if="tx.tx_response"
      class="bg-base-100 px-4 pt-3 pb-4 rounded shadow"
    >
      <h2 class="card-title truncate mb-2">JSON</h2>
      <vue-json-pretty :data="tx" :deep="3" />
    </div>

  </div>
</template>
