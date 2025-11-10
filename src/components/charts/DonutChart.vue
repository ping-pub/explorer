<script lang="ts" setup>
import ApexCharts from 'vue3-apexcharts';
import { computed } from 'vue';
import { useBaseStore } from '@/stores';
import { getDonutChartConfig } from './apexChartConfig';

const props = defineProps(['series', 'labels', 'colors']);

const baseStore = useBaseStore();

const expenseRationChartConfig = computed(() => {
  const theme = baseStore.theme;
  const config = getDonutChartConfig(theme, props?.labels);
  // Override colors if provided
  if (props?.colors && props.colors.length > 0) {
    config.colors = props.colors;
  }
  return config;
});
</script>

<template>
  <ApexCharts
    type="donut"
    height="256"
    :options="expenseRationChartConfig"
    :series="series"
  />
</template>

<script lang="ts">
export default {
  name: 'DonetChart',
};
</script>
