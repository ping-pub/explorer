<script lang="ts" setup>
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed, ref } from '@vue/reactivity';
import type { Tx, TxResponse } from '@/types';

import { JsonViewer } from "vue3-json-viewer"
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import "vue3-json-viewer/dist/index.css";

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
    return tx.value.tx?.body?.messages.map(x=> {
        if(x.packet?.data) {
            // @ts-ignore
            x.message = format.base64ToString(x.packet.data)
        }
        return x
    }) || [];
});

// Format JSON data for viewer to prevent display issues
const formattedTxData = computed(() => {
    if (!tx.value || Object.keys(tx.value).length === 0) {
        return {};
    }
    
    try {
        // Handle potential circular references by using a replacer function
        const cache = new Set();
        const cleanData = JSON.parse(JSON.stringify(tx.value, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.has(value)) {
                    return '[Circular Reference]';
                }
                cache.add(value);
            }
            return value;
        }));
        return cleanData;
    } catch (error) {
        console.error('Error formatting tx data for JSON viewer:', error);
        // If JSON conversion fails, provide a simpler object representation
        return {
            tx_hash: tx.value.tx_response?.txhash || '',
            height: tx.value.tx_response?.height || '',
            status: tx.value.tx_response?.code === 0 ? 'Success' : 'Failed',
            gas: `${tx.value.tx_response?.gas_used || 0} / ${tx.value.tx_response?.gas_wanted || 0}`,
            timestamp: tx.value.tx_response?.timestamp || '',
            memo: tx.value.tx?.body?.memo || ''
        };
    }
});
</script>
<template>
    <div>
        <!-- <div class="tabs tabs-boxed bg-transparent mb-4">
            <RouterLink class="tab text-gray-400 uppercase" 
                :to="`/${chain}/tx/?tab=recent`"
                >{{ $t('block.recent') }}</RouterLink>
            <RouterLink class="tab text-gray-400 uppercase" 
                :to="`/${chain}/tx/?tab=search`"
                >Search</RouterLink>
            <a class="tab text-gray-400 uppercase tab-active">Transaction</a>
        </div> -->
        <h2 class="bg-[#09279F] dark:bg-base-200 text-2xl rounded-2xl px-4 py-2 my-4 font-bold text-[#ffffff;]">{{ $t('tx.title') }}</h2>
        <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 rounded-2xl mb-4 border dark:border-base-200">
            <div class="overflow-hidden">
               <table class="text-sm border-none divide-none w-full">
               <tbody>
                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('tx.tx_hash') }}</td>
                        <td class="py-3 px-2 overflow-hidden dark:text-gray-400 text-[#171C1F]">
                            {{ tx.tx_response.txhash }}
                        </td>
                    </tr>

                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('account.height') }}</td>
                        <td class="py-3 px-2 overflow-hidden dark:text-warning text-[#09279F]">
                            <RouterLink
                                :to="`/${props.chain}/blocks/${tx.tx_response.height}`"
                                class="text-primary dark:invert"
                            >
                                {{ tx.tx_response.height }}
                            </RouterLink>
                        </td>
                    </tr>

                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('staking.status') }}</td>
                        <td class="py-3 px-2">
                            <span
                                class="text-xs truncate relative py-2 px-4 w-fit mr-2 rounded"
                                :class="`text-${tx.tx_response.code === 0 ? '[#60BC29]' : 'error'}`"
                            >
                                <span
                                    class="inset-x-0 inset-y-0 opacity-10 absolute rounded-2xl"
                                    :class="`bg-${tx.tx_response.code === 0 ? '[#6AC13633]' : 'error'}`"
                                >
                                </span>
                                {{ tx.tx_response.code === 0 ? 'Success' : 'Failed' }}
                            </span>
                            <span>
                                {{ tx.tx_response.code === 0 ? '' : tx?.tx_response?.raw_log }}
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('account.time') }}</td>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#171C1F]">
                            {{ format.toLocaleDate(tx.tx_response.timestamp) }}
                            ({{ format.toDay(tx.tx_response.timestamp, 'from') }})
                        </td>
                    </tr>

                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('tx.gas') }}</td>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#171C1F]">
                            {{ tx.tx_response.gas_used }} / {{ tx.tx_response.gas_wanted }}
                        </td>
                    </tr>

                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('tx.fee') }}</td>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#171C1F]">
                            {{format.formatTokens(tx.tx?.auth_info?.fee?.amount, true, '0,0.[00]')
                            }}
                        </td>
                    </tr>
                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('tx.memo') }}</td>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#171C1F]">
                            {{ tx.tx.body.memo }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

        <div v-if="tx.tx_response" class="bg-[#EFF2F5;] dark:bg-base-100 rounded-md border dark:border-base-200 mb-4">
            <h2 class="card-title truncate mt-2 ml-4 mb-2 font-semibold align-middle">
                {{ $t('account.messages') }} ({{ messages.length }})
            </h2>
            <div v-for="(msg, i) in messages">
                <div class="mt-4">
                    <DynamicComponent :value="msg" />
                </div>
            </div>
            <div v-if="messages.length === 0">{{ $t('tx.no_messages') }}</div>
        </div>

        <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
            <h2 class="card-title truncate mb-2">JSON</h2>
            <div v-if="Object.keys(formattedTxData).length > 0" class="bg-base-200 p-4 rounded-md">
                <!-- <JsonViewer 
                    :value="formattedTxData" 
                    :theme="baseStore.theme || 'jv-light'" 
                    style="background: transparent;" 
                    :copyable="true" 
                    :boxed="true" 
                    :sort="true" 
                    :expand-depth="5"
                    :preview-mode="false"
                /> -->
                <pre>{{ formattedTxData }}</pre>
            </div>
            <div v-else class="p-4 text-center text-gray-500">
                Loading transaction data...
            </div>
        </div>
    </div>
</template>
