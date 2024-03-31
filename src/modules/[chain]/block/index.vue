<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useBaseStore, useFormatter } from '@/stores';
import TxsInBlocksChart from '@/components/charts/TxsInBlocksChart.vue';

const props = defineProps(['chain']);

const tab = ref('blocks');

const base = useBaseStore()

const format = useFormatter();

const list = computed(() => {
    // const recents = base.recents
    // return recents.sort((a, b) => (Number(b.block.header.height) - Number(a.block.header.height)))
    return base.recents
})
</script>
<template>
    <div>
        <div class="tabs tabs-boxed bg-transparent mb-4">
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'blocks' }"
                @click="tab = 'blocks'">{{ $t('block.recent') }}</a>
            <RouterLink class="tab text-gray-400 uppercase" 
                :to="`/${chain}/block/${Number(base.latest?.block?.header.height||0) + 10000}`"
                >{{ $t('block.future') }}</RouterLink>
        </div>

        <div v-show="tab === 'blocks'">

            <TxsInBlocksChart />

            <div class="grid xl:!grid-cols-6 md:!grid-cols-4 grid-cols-1 gap-3">
            <RouterLink v-for="item in list"
                class="flex flex-col justify-between rounded p-4 shadow bg-base-100"
                :to="`/${chain}/block/${item.block.header.height}`">
                <div class="flex justify-between">
                    <h3 class="text-md font-bold sm:!text-lg">
                        {{ item.block.header.height }}
                    </h3>
                    <span class="rounded text-xs whitespace-nowrap font-medium text-green-600">
                        {{ format.toDay(item.block?.header?.time, 'from') }}
                    </span>
                </div>
                <div class="flex justify-between tooltip" data-tip="Block Proposor">
                    <div class="mt-2 hidden text-sm sm:!block truncate">
                        <span>{{ format.validator(item.block?.header?.proposer_address) }}</span>
                    </div>
                    <span class="text-right mt-1 whitespace-nowrap"> {{ item.block?.data?.txs.length }} txs </span>
                </div>
            </RouterLink>
            </div>
        </div>
    </div>
</template>

<route>
    {
      meta: {
        i18n: 'blocks',
        order: 5
      }
    }
  </route>
