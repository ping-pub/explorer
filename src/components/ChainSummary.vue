<script lang="ts" setup>
import { getLogo, useDashboard,  } from '@/stores/useDashboard';
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const dashboardStore = useDashboard()
const conf = computed(()=> dashboardStore.chains[props.name] || {})

</script>
<template>
    <VCard outlined class="p-1">
        <VList class="card-list">
            <VListItem :to="`/${name}`">
            <template #prepend>
                <VAvatar rounded size="45" variant="tonal" class="me-3">
                <VImg :src="conf.logo" height="22"/>
                </VAvatar>
            </template>

            <VListItemTitle class="font-weight-semibold text-sm mb-1">
                {{ conf?.prettyName || props.name }}
            </VListItemTitle>

            <VListItemSubtitle class="text-xs">
                {{conf?.chainId || ''}}
            </VListItemSubtitle>

            <template #append>
                <VListItemAction @click="(e:Event)=>{e.stopPropagation()}">
                    <VCheckbox
                        v-model="dashboardStore.favorite"
                        true-icon="mdi-star"
                        false-icon="mdi-star"
                        color="warning"
                        :value="props.name"
                    />
                    <VTooltip
                        activator="parent"
                        location="top"
                    >
                        {{ $t('index.add_to_favorite') }}
                    </VTooltip>
                </VListItemAction>
            </template>
            </VListItem>
        </VList>
    </VCard>
</template>