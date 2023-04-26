<script lang="ts" setup>
import { useParamStore } from '@/stores';
import { ref, onMounted } from 'vue'

const store = useParamStore()
const chain = ref(store.chain)
onMounted(() => {
    // fetch the data
    // store.handleBaseBlockLatest()
    store.initial()
    console.log(4444)
})

</script>
<template>
    <div>
        <!-- Chain ID -->
        <div class="bg-card px-4 pt-3 pb-4 rounded-sm">
            <div class="text-base mb-3 text-main">{{ chain.title }}</div>
            <div class="grid grid-cols-5 gap-4">
                <div v-for="(item,index) of chain.items" :key="index" class="rounded-sm bg-active px-4 py-2">
                    <div class="text-xs mb-2 text-secondary">{{ item.subtitle }}</div>
                    <div class="text-base text-main">{{ item.value }}</div>
                    {{ item }}
                </div>
            </div>
        </div>
        <div class="h-6"></div>
        <!-- Staking Parameters  -->
        <div class="bg-card px-4 pt-3 pb-4 rounded-sm">
            <div class="text-base mb-3 text-main">{{ store.staking.title }}</div>
            <div class="grid grid-cols-5 gap-4">
                <div v-for="(item,index) of store.staking.items" :key="index" class="rounded-sm bg-active px-4 py-2">
                    <div class="text-xs mb-2 text-secondary">{{ item.subtitle }}</div>
                    <div class="text-base text-main">{{ item.value }}</div>
                    {{ item }}
                </div>
            </div>
        </div>
    </div>

</template>
<route>
{
    meta: {
    i18n: 'parameters'
    }
}
</route>