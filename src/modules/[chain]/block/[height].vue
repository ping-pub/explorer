<script lang="ts" setup>
import TxsElement from '@/components/dynamic/TxsElement.vue';
import { useBlockModule } from './block'
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed } from '@vue/reactivity';
import { onBeforeRouteUpdate } from 'vue-router';
const props = defineProps(["height", "chain"]);

const store = useBlockModule()
store.fetchBlock(props.height)
const tab = ref('summary')

const height = computed(() => {
    return Number(store.current.block?.header?.height || props.height || 0)
})

onBeforeRouteUpdate(async (to, from, next) => {
    if (from.path !== to.path) {
      store.fetchBlock(Number(to.params.height))
      next()
    }
}) 

</script>
<template>
<div>
    <VCard>
        <VCardTitle class="d-flex justify-space-between">
            <span class="mt-2">#{{ store.current.block?.header?.height }}</span>
            <span v-if="props.height" class="mt-2">
                <VBtn size="32" :to="`/${store.blockchain.chainName}/block/${height - 1}`" class="mr-2"><VIcon icon="mdi-arrow-left"/></VBtn> 
                <VBtn size="32" :to="`/${store.blockchain.chainName}/block/${height + 1}`"><VIcon icon="mdi-arrow-right"/></VBtn>
            </span>
        </VCardTitle>
        <VCardItem class="pt-0">
            <DynamicComponent :value="store.current.blockId"/>
        </VCardItem>
    </VCard>

    <VCard title="Block Header" class="my-5">
        <VCardItem class="pt-0">
            <DynamicComponent :value="store.current.block?.header"/>
        </VCardItem>
    </VCard>

    <VCard title="Transactions">
        <VCardItem class="pt-0">
            <TxsElement :value="store.current.block?.data?.txs"/>
        </VCardItem>
    </VCard>

    <VCard title="Last Commit" class="mt-5">
        <VCardItem class="pt-0">
            <DynamicComponent :value="store.current.block?.lastCommit"/>
        </VCardItem>
    </VCard>
</div>
</template>