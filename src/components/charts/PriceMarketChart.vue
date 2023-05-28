<script lang="ts" setup>
import ApexCharts from 'vue3-apexcharts';
import { getMarketPriceChartConfig } from './apexChartConfig';
import { useIndexModule } from '@/modules/[chain]/indexStore';
import { computed, ref } from '@vue/reactivity';
import { useBaseStore } from '@/stores';

const store = useIndexModule();
const baseStore = useBaseStore();
const chartConfig = computed(() => {
    const theme = baseStore.theme;
    const labels = store.marketData.prices.map((item: any) => item[0]);
    return getMarketPriceChartConfig(theme, labels);
});
const kind = ref('price');
const series = computed(() => {
    return [
        {
            name: 'Price',
            data:
                kind.value === 'price'
                    ? store.marketData.prices.map((item: any) => item[1])
                    : store.marketData.total_volumes.map(
                          (item: any) => item[1]
                      ),
        },
    ];
});

function changeChart(type: string) {
    kind.value = type;
}
</script>

<template>
    <div class="tabs tabs-boxed bg-transparent justify-end">
        <a
            class="tab text-xs mr-2 text-gray-400 uppercase"
            :class="{ 'tab-active': kind === 'price' }"
            @click="changeChart('price')"
        >
            Price
        </a>
        <a
            class="tab text-xs text-gray-400 uppercase"
            :class="{ 'tab-active': kind === 'volume' }"
            @click="changeChart('volume')"
        >
            Volume
        </a>
    </div>
    <ApexCharts
        type="area"
        height="230"
        :options="chartConfig"
        :series="series"
    />
</template>
