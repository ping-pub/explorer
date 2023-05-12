<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';
import { hexToRgb } from '@/plugins/vuetify/@layouts/utils';
import { computed, type PropType } from 'vue';
import { useFormatter } from '@/stores';
import type { CommissionRate } from '@/types';

const props = defineProps({
  commission: { type: Object as PropType<CommissionRate> },
});

let rate = computed(
  () => Number(props.commission?.commission_rates.rate || 0) * 100
);
let change = computed(
  () => Number(props.commission?.commission_rates.max_change_rate || 0) * 100
);
let max = computed(
  () => Number(props.commission?.commission_rates.max_rate || 1) * 100
);

// const rate = 15 // props.commision?.commissionRates.rate
// const change = 15
// const max = 20

const left = rate;
const right = computed(() => max.value - rate.value);

const s1 = computed(() =>
  left.value > change.value ? left.value - change.value : 0
);
const s2 = computed(() =>
  left.value > change.value ? change.value : left.value
);
const s3 = 2;
const s4 = computed(() =>
  right.value > change.value ? change.value : right.value
);
const s5 = computed(() =>
  right.value > change.value ? right.value - change.value : 0
);

const series = computed(() => [s1.value, s2.value, s3, s4.value, s5.value]);

const vuetifyTheme = useTheme();
const format = useFormatter();

const chartConfig = computed(() => {
  const themeColors = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;

  const secondaryText = `rgba(${hexToRgb(
    String(themeColors['on-background'])
  )},${variableTheme['medium-emphasis-opacity']})`;
  const primaryText = `rgba(${hexToRgb(String(themeColors['on-background']))},${
    variableTheme['high-emphasis-opacity']
  })`;

  return {
    chart: {
      sparkline: { enabled: false },
    },
    colors: [
      `rgba(${hexToRgb(String(themeColors.secondary))},0.2)`,
      `rgba(${hexToRgb(String(themeColors.success))},0.2)`,
      `rgba(${hexToRgb(String(themeColors.success))},1)`,
      `rgba(${hexToRgb(String(themeColors.success))},0.2)`,
      `rgba(${hexToRgb(String(themeColors.secondary))},0.2)`,
    ],
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 3,
      lineCap: 'round',
      colors: ['rgba(var(--v-theme-surface), 1)'],
    },
    labels: [
      'Available',
      'Daily Change',
      'Commission Rate',
      'Daily Change',
      'Available',
    ],
    states: {
      hover: {
        filter: { type: 'none' },
      },
      active: {
        filter: { type: 'none' },
      },
    },
    plotOptions: {
      pie: {
        endAngle: 130,
        startAngle: -130,
        customScale: 0.9,
        donut: {
          size: '83%',
          labels: {
            show: true,
            name: {
              offsetY: 25,
              fontSize: '1rem',
              color: secondaryText,
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              fontSize: '2.125rem',
              formatter: (value: unknown) => `${rate.value}%`,
              color: primaryText,
            },
            total: {
              show: true,
              label: 'Commission Rate',
              fontSize: '1rem',
              color: secondaryText,
              formatter: () => `${rate.value}%`,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 1709,
        options: {
          chart: { height: 237 },
        },
      },
    ],
  };
});
</script>

<template>
  <VCard
    title="Commission Rate"
    :subtitle="`Updated at ${format.toDay(
      props.commission?.update_time,
      'short'
    )}`"
  >
    <VCardText>
      <VueApexCharts
        type="donut"
        height="257"
        :options="chartConfig"
        :series="series"
      />

      <div class="flex items-center justify-center flex-wrap mx-2 gap-x-6">
        <div class="flex items-center gap-2">
          <div class="bg-success w-[6px] h-[6px] rounded-full"></div>
          <span class="text-caption">Rate:{{ rate }}%</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="bg-success w-[6px] h-[6px] rounded-full opacity-60"></div>
          <span class="text-caption">24h: ±{{ change }}%</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="bg-secondary w-[6px] h-[6px] rounded-full"></div>
          <span class="text-caption">Max:{{ max }}%</span>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>
