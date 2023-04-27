<script lang="ts" setup>
import { useParamStore } from '@/stores';
import { ref, onMounted } from 'vue'
import CardParameter from '@/components/CardParameter.vue'
import TableParameter from '@/components/TableParameter.vue'
import { sort } from 'semver';
const store = useParamStore()
const chain = ref(store.chain)
onMounted(() => {
    // fetch the data
    store.initial()
})

</script>
<template>
    <div>
        <!-- Chain ID -->
        <div class="bg-card px-4 pt-3 pb-4 rounded">
            <div class="text-base mb-3 text-main">{{ chain.title }}</div>
            <div class="grid grid-cols-5 gap-4">
                <div v-for="(item,index) of chain.items" :key="index" class="rounded-sm bg-active px-4 py-2">
                    <div class="text-xs mb-2 text-secondary">{{ item.subtitle }}</div>
                    <div class="text-base text-main">{{ item.value }}</div>
                </div>
            </div>
        </div>
        <!-- minting Parameters  -->
        <CardParameter :cardItem="store.mint"/> 
        <!-- Staking Parameters  -->
        <CardParameter :cardItem="store.staking"/>
        <!-- Governance Parameters -->
        <CardParameter :cardItem="store.gov"/>
        <!-- Distribution Parameters -->
        <CardParameter :cardItem="store.distribution"/>
        <!-- Slashing Parameters -->
        <CardParameter :cardItem="store.slashing"/>
        <!-- Application Version -->
        <TableParameter :tableItem="store.appVersion"/>
        <!-- Node Information -->
        <TableParameter :tableItem="store.nodeVersion"/>
    </div>

</template>
<route>
{
    meta: {
    i18n: 'parameters'
    }
}
</route>