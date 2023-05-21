<script lang="ts" setup>
import TwoFactorAuthDialog from '@/plugins/vuetify/@core/components/TwoFactorAuthDialog.vue';
import { PageRequest } from '@/types';
import type { PropType } from 'vue';
import { computed } from 'vue';

const props = defineProps({
    total: { type: Number },
    limit: { type: Number },
    current: { type: Number, default: 1},
    load: { type: Function, required: true },
});
const showSize = 3
const pages = computed(() => {
    const pages: {color: string, page: number}[] = [] 
    if(props.total && props.limit && props.total > props.limit) {
        let page = 0
        while(true) {
            page += 1
            if( page * props.limit > props.total ) break
            if( page > showSize && page < (props.total / props.limit - showSize + 1)) {
                if(!(page >= props.current - 1 && page <= props.current + 1)){
                    continue
                }
            } 
            pages.push({
                color: page === props.current? 'btn-primary': '',
                page: page,
            })
        }
    }
    return pages
})

</script>
<template>
    <div class="my-5 text-center">
        <div v-if="total && limit" class="btn-group">
            <button v-for="{page, color} in pages" class="btn btn-md" :class="color" @click="load(page)">{{ page }}</button>
        </div>
    </div>
</template>
