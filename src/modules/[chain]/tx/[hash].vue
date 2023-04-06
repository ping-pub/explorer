<script lang="ts" setup>
import { useBlockchain, useFormatter } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed, ref } from '@vue/reactivity';
import type { Tx, TxResponse } from '@/types';

const props = defineProps(['hash', 'chain'])

const blockchain = useBlockchain()
const format = useFormatter()
const tx = ref({} as {
    tx: Tx;
    tx_response: TxResponse
})
if(props.hash) {
    blockchain.rpc.getTx(props.hash).then(x => tx.value = x)
}
const messages = computed(() => {
    return tx.value.tx?.body?.messages||[]
})
</script>
<template>
    <div>
        <VCard v-if="tx.tx_response" title="Summary">
            <VCardItem class="pt-0">
            <VTable>
                <tbody>
                    <tr><td>Tx Hash</td><td>{{ tx.tx_response.txhash }}</td></tr>
                    <tr><td>Height</td><td><RouterLink :to="`/${props.chain}/block/${tx.tx_response.height}`">{{ tx.tx_response.height }}</RouterLink></td></tr>
                    <tr><td>Status</td><td>
                        <VChip v-if="tx.tx_response.code === 0" color="success">Success</VChip>
                        <span v-else><VChip color="error">Failded</VChip></span>
                    </td></tr>
                    <tr><td>Time</td><td>{{ tx.tx_response.timestamp }} ({{ format.toDay(tx.tx_response.timestamp, "from") }})</td></tr>
                    <tr><td>Gas</td><td>{{ tx.tx_response.gas_used }} / {{ tx.tx_response.gas_wanted }}</td></tr>
                    <tr><td>Fee</td><td>{{ format.formatTokens(tx.tx?.auth_info?.fee?.amount, true, '0,0.[00]') }}</td></tr>
                    <tr><td>Memo</td><td>{{ tx.tx.body.memo }}</td></tr>
                </tbody>
            </VTable>
            </VCardItem>
        </VCard>

        <VCard title="Messages" class="my-5">
            <VCardItem style="border-top: 2px dotted gray;">
                <div v-for="(msg, i) in messages">
                    <div><DynamicComponent :value="msg" /></div>                  
                </div>
            </VCardItem>
        </VCard>

        <VCard title="Detail">
            <VExpansionPanels>
                <VExpansionPanel title="Transaction">
                    <v-expansion-panel-text>
                        <DynamicComponent :value="tx.tx" />
                    </v-expansion-panel-text>                
                </VExpansionPanel>
                <VExpansionPanel title="Transaction Response">
                    <v-expansion-panel-text>
                        <DynamicComponent :value="tx.tx_response" />
                    </v-expansion-panel-text>                
                </VExpansionPanel>
            </VExpansionPanels>
        </VCard>
        
    </div>
</template>