<script lang="ts" setup>
import { fromBase64, toBase64 } from '@cosmjs/encoding';
import { decodeTxRaw } from '@cosmjs/proto-signing'
import { computed } from '@vue/reactivity';
import { hashTx } from '@/libs'
import { useBlockchain, useFormatter } from '@/stores';
const props = defineProps({
  value: { type: Array<Uint8Array>},
});

const txs = computed(() => {
    return props.value?.map(x => ({ hash: hashTx(x) , tx: decodeTxRaw(x) })) || []
})

const format = useFormatter()
const chain = useBlockchain()

</script>
<template>
    <VTable density="compact" v-if="txs.length > 0">
        <thead>
            <tr>
                <th>Hash</th><th>Msgs</th><th>Memo</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in txs">
                <td><RouterLink :to="`/${chain.chainName}/tx/${item.hash}`">{{ item.hash }}</RouterLink></td>
                <td>{{ format.messages(item.tx.body.messages) }}</td>
                <td>{{ item.tx.body.memo }}</td>
            </tr>
        </tbody>
    </VTable>
    <div v-else>[]</div>
</template>