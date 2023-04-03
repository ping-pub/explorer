<script lang="ts" setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { getAreaChartSplineConfig, getMarketPriceChartConfig } from './apexCharConfig'
import { useIndexModule } from '@/modules/[chain]/indexStore';
import { computed, ref } from '@vue/reactivity';

const store = useIndexModule()
const vuetifyTheme = useTheme()
const chartConfig = computed(() => {
  const labels = store.marketData.prices.map(x => x[0])
  return getMarketPriceChartConfig(vuetifyTheme.current.value, labels)
})
const kind = ref('price')
const series = computed(() => {
  return [{ 
    name: 'Price', 
    data: kind.value ==='price'?store.marketData.prices.map(x => x[1]) : store.marketData.total_volumes.map(x => x[1])}]
})
</script>

<template>
  <VTabs v-model="kind" align-tabs="end"><VTab value="price">Price</VTab><VTab value="volume">Volume</VTab></VTabs>
  <VueApexCharts
    type="area"
    height="261"
    :options="chartConfig"
    :series="series"
  />
</template>