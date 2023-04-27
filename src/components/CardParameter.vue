<script lang="ts" setup>
import type { PropType } from 'vue';
const props = defineProps({
    cardItem: {
        type: Object as PropType<{title: string;items: Array<any>;}>,
    },
})

</script>
<template>
    <div class="bg-card px-4 pt-3 pb-4 rounded-sm mt-6" 
    v-if="props.cardItem?.items && props.cardItem?.items?.length > 0">
        <div class="text-base mb-3 text-main">{{ props.cardItem?.title }}</div>
        <div class="grid grid-cols-5 gap-4">
            <div v-for="(item,index) of props.cardItem?.items" :key="index" class="rounded-sm bg-active px-4 py-2">
                <div class="text-xs mb-2 text-secondary">{{ item?.subtitle }}</div>
                <div class="text-base text-main">{{ item?.value }}</div>
                <!-- {{ item }} -->
            </div>
        </div>
    </div>
</template>