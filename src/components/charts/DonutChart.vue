<script lang="ts" setup>
import ApexCharts from 'vue3-apexcharts';
import { computed } from 'vue';
import { useBaseStore } from '@/stores';
import { getDonutChartConfig } from './apexChartConfig';

const props = defineProps(['series', 'labels']);

const baseStore = useBaseStore();

const expenseRationChartConfig = computed(() => {
  const theme = baseStore.theme;
  return getDonutChartConfig(theme, props?.labels);
});
</script>

<template>
  <ApexCharts
    type="donut"
    height="410"
    :options="expenseRationChartConfig"
    :series="series"
  />
</template>

<script lang="ts">
export default {
  name: 'DonetChart',
};
</script>
