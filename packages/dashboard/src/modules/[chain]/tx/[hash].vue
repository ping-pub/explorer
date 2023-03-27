<script lang="ts" setup>
import { useBlockchain, useFormatter } from '@/stores';
import type { GetTxResponse } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed } from '@vue/reactivity';
import { fromBase64, toBase64 } from '@cosmjs/encoding';

const props = defineProps(['hash', 'chain'])

const blockchain = useBlockchain()
const format = useFormatter()
const tx = ref({} as GetTxResponse)
if(props.hash) {
    blockchain.rpc.tx(props.hash).then(x => tx.value = x)
}
const messages = computed(() => {
    return tx.value.tx?.body?.messages||[]
})
</script>
<template>
    <div>
        <VCard v-if="tx.txResponse" title="Summary">
            <VCardItem class="pt-0">
            <VTable>
                <tbody>
                    <tr><td>Tx Hash</td><td>{{ tx.txResponse.txhash }}</td></tr>
                    <tr><td>Height</td><td><RouterLink :to="`/${props.chain}/block/${tx.txResponse.height}`">{{ tx.txResponse.height }}</RouterLink></td></tr>
                    <tr><td>Status</td><td>
                        <VChip v-if="tx.txResponse.code === 0" color="success">Success</VChip>
                        <span v-else><VChip color="error">Failded</VChip></span>
                    </td></tr>
                    <tr><td>Time</td><td>{{ tx.txResponse.timestamp }} ({{ format.toDay(tx.txResponse.timestamp, "from") }})</td></tr>
                    <tr><td>Gas</td><td>{{ tx.txResponse.gasUsed }} / {{ tx.txResponse.gasWanted }}</td></tr>
                    <tr><td>Fee</td><td>{{ format.formatTokens(tx.tx?.authInfo?.fee?.amount, true, '0,0.[00]') }}</td></tr>
                    <tr><td>Memo</td><td>{{ tx.tx.body.memo }}</td></tr>
                </tbody>
            </VTable>
            </VCardItem>
        </VCard>

        <VCard title="Messages" class="my-5">
            <VCardItem>
                <div v-for="(msg, i) in messages">
                    <div><VChip label color="primary">#{{ i+1 }}</VChip>{{ msg.typeUrl }}</div>
                    <div>{{ toBase64(msg.value) }}</div>                  
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
                        <DynamicComponent :value="tx.txResponse" />
                    </v-expansion-panel-text>                
                </VExpansionPanel>
            </VExpansionPanels>
        </VCard>
        
    </div>
</template>