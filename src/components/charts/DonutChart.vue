<script lang="ts" setup>
import ApexCharts from 'vue3-apexcharts';
import { computed } from 'vue';
import { getDonutChartConfig } from './apexChartConfig';

const props = defineProps(['series', 'labels']);

const expenseRationChartConfig = computed(() =>
  getDonutChartConfig(window.localStorage.getItem('theme') || 'dark', props.labels)
);
</script>

<template>
  <ApexCharts type="donut" height="410" :options="expenseRationChartConfig" :series="series" />
</template>

<script lang="ts">
export default {
  name: 'DonetChart',
};
</script>
