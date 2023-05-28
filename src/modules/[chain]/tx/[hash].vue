<script lang="ts" setup>
import { useBlockchain, useFormatter } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed, ref } from '@vue/reactivity';
import type { Tx, TxResponse } from '@/types';
import JsonPretty from 'vue-json-pretty';
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
        <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 rounded shadow mb-4">
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
                            <td class="text-primary">
                                <RouterLink :to="`/${props.chain}/block/${tx.tx_response.height}`">{{ tx.tx_response.height
                                }}
                                </RouterLink>
                            </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td>
                                <div class="text-xs truncate relative py-2 px-4 w-fit mr-2 rounded" :class="`text-${tx.tx_response.code === 0 ? 'success' : 'error'
                                    }`">
                                    <span class="inset-x-0 inset-y-0 opacity-10 absolute" :class="`bg-${tx.tx_response.code === 0 ? 'success' : 'error'
                                        }`"></span>
                                    {{ tx.tx_response.code === 0 ? 'Success' : 'Failded' }}
                                </div>
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

        <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 rounded shadow mb-4">
            <h2 class="card-title truncate mb-2">
                Messages: ({{ messages.length }})
            </h2>
            <div class="divider"></div>
            <div v-for="(msg, i) in messages">
                <div>
                    <DynamicComponent :value="msg" />
                </div>
            </div>
            <div v-if="messages.length === 0">No messages</div>
        </div>

        <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
            <h2 class="card-title truncate mb-2">JSON</h2>
            <JsonPretty :data="tx" :deep="3" />
        </div>
    </div>
</template>
