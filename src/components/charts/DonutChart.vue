<script lang="ts" setup>
import ApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';
import { getDonutChartConfig } from './apexChartConfig';

const props = defineProps(['series', 'labels']);

const vuetifyTheme = useTheme();

const expenseRationChartConfig = computed(() =>
  getDonutChartConfig(vuetifyTheme.current.value, props.labels)
);
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
