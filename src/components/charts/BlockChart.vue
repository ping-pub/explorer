<script lang="ts" setup>
import ApexCharts from 'vue3-apexcharts';
import { getMarketPriceChartConfig } from './apexChartConfig';
import { useIndexModule } from '@/modules/[chain]/indexStore';
import { computed, ref } from '@vue/reactivity';
import { useBlock } from '@/stores';

const block = useBlock();
onMounted(async () => {
  await block.fetchChartMock();
});
const chartConfig = computed(() => {
  const theme = 'dark';
  const labels = block?.chartMock?.prices?.map((item: any) => item[0]);
  return getMarketPriceChartConfig(theme, labels);
});
const kind = ref('price');
const series = computed(() => {
  return [
    {
      name: 'Price',
      data:
        kind.value === 'price'
          ? block?.chartMock?.prices?.map((item: any) => item[1])
          : kind.value === 'total_volumes'
          ? block?.chartMock?.total_volumes?.map((item: any) => item[1])
          : kind.value === 'market_caps'
          ? block?.chartMock?.market_caps?.map((item: any) => item[1])
          : block?.chartMock?.prices?.map((item: any) => item[1]),
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
      class="tab text-xs mr-2 text-gray-400 uppercase"
      :class="{ 'tab-active': kind === 'market_caps' }"
      @click="changeChart('market_caps')"
    >
      Market Caps
    </a>
    <a
      class="tab text-xs text-gray-400 uppercase"
      :class="{ 'tab-active': kind === 'total_volumes' }"
      @click="changeChart('total_volumes')"
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
