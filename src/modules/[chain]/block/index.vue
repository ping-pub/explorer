<script lang="ts" setup>
import TxsElement from '@/components/dynamic/TxsElement.vue';
import { useBlockModule } from './block'
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed } from '@vue/reactivity';
import { toBase64, toHex } from '@cosmjs/encoding';
import { useFormatter } from '@/stores';
const props = defineProps(["height", "chain"]);

const store = useBlockModule()
store.fetchBlock(props.height)
const tab = ref('blocks')

const format = useFormatter()
</script>
<template>
    
    <VCard>
        <VCardTitle class="d-flex justify-space-between">
            <VTabs v-model="tab">
                <VTab value="blocks">Blocks</VTab>
                <VTab value="transactions">Transactions</VTab>
            </VTabs>
        </VCardTitle>
        <VWindow v-model="tab">
            <VWindowItem value="blocks">
                <VTable>
                    <thead>
                        <tr>
                            <th>Height</th><th>Hash</th><th>Proposor</th><th>Txs</th><th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in store.recents">
                            <td><RouterLink :to="`/${props.chain}/block/${item.block?.header?.height}`">{{ item.block?.header?.height }}</RouterLink></td>
                            <td>{{ toBase64(item.blockId?.hash) }}</td>
                            <td>{{ format.validator(item.block?.header?.proposerAddress) }}</td>
                            <td>{{ item.block?.data?.txs.length }}</td>
                            <td>{{ format.toDay(item.block?.header?.time, 'from') }}</td>
                        </tr>
                    </tbody>
                </VTable>
            </VWindowItem>
            <VWindowItem value="transactions">
                <VTable>
                    <thead>
                        <tr>
                            <th>Hash</th><th>Messages</th><th>Fees</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in store.txsInRecents">
                            <td><RouterLink :to="`/${props.chain}/tx/${item.hash}`">{{ item.hash }}</RouterLink></td>
                            <td>{{ format.messages(item.tx.body.messages) }}</td>
                            <td>{{ format.formatTokens(item.tx.authInfo.fee?.amount) }}</td>
                        </tr>
                    </tbody>
                </VTable>

                <VCardItem>
                    <v-alert
                        type="info"
                        text="Only show txs in recent blocks"
                        variant="tonal"
                    ></v-alert>
                </VCardItem>
            </VWindowItem>
        </VWindow>
        <VCardActions>

        </VCardActions>
    </VCard>
 
</template>