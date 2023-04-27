<script lang="ts" setup>
import type { PropType } from 'vue';
const props = defineProps({
    tableItem: {
        type: Object as PropType<{title: string;items: Object;}>,
    },
})

function formatTitle (name: string){
    return String(name).replaceAll('_', ' ')
}

</script>
<template>
    <div class="bg-card px-4 pt-3 pb-4 rounded mt-6">
        <div class="text-base mb-3 text-main">{{ props.tableItem?.title }}</div>
        <div class="">
                <div class="d-flex flex-nowrap" v-for="(item,index ) of props.tableItem?.items" :key="index">
                    <div class="mr-6">{{ formatTitle(item?.subtitle) }}</div>
                    <div class="flex-1" >{{ item?.value }}</div>
                    <div>{{typeof(item?.value )}}</div>
                    <!-- {{ item }} -->
                </div>
            </div>
    </div>
</template>