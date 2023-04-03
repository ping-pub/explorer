<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@/plugins/vuetify/@layouts/utils'
import type { PropType } from 'vue';
import { useFormatter } from '@/stores';

const props = defineProps({
  commission: { type: Object as PropType<{
    commissionRates: {
      rate: string,
      maxRate: string,
      maxChangeRate: string,
    },
    updateTime: string,
  }>},
})
console.log('commission:', props)

const zeros = Math.pow(10, 16)
let rate = Number(props.commission?.commissionRates.rate || 0)
let change = Number(props.commission?.commissionRates.maxChangeRate || 10)
let max = Number(props.commission?.commissionRates.maxRate || 100)

if(rate > 100) {
  rate = rate / zeros
}
if(change > 100) {
  change = change / zeros
}
if(max > 100) {
  max = max / zeros
}

// const rate = 15 // props.commision?.commissionRates.rate
// const change = 15
// const max = 20

const left = rate
const right = max - rate

const s1 = left > change ? left - change : 0
const s2 = left > change ? change: left
const s3 = 2
const s4 = right > change? change: right
const s5 = right > change? right - change: 0

const series = [s1, s2, s3, s4, s5]

const vuetifyTheme = useTheme()
const format = useFormatter()

const chartConfig = computed(() => {
  const themeColors = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  const secondaryText = `rgba(${hexToRgb(String(themeColors['on-background']))},${variableTheme['medium-emphasis-opacity']})`
  const primaryText = `rgba(${hexToRgb(String(themeColors['on-background']))},${variableTheme['high-emphasis-opacity']})`

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
    stroke: { width: 3, lineCap: 'round', colors: ['rgba(var(--v-theme-surface), 1)'] },
    labels: ['Available', 'Daily Change', 'Commission Rate', 'Daily Change', 'Available'],
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
              formatter: (value: unknown) => `${rate}%`,
              color: primaryText,
            },
            total: {
              show: true,
              label: 'Commission Rate',
              fontSize: '1rem',
              color: secondaryText,
              formatter: ( ) => `${rate}%`,
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
  }
})

</script>

<template>
  <VCard title="Commission Rate" :subtitle="`Updated at ${format.toDay(props.commision?.updateTime, 'short')}`">
    <VCardText>
      <VueApexCharts
        type="donut"
        height="257"
        :options="chartConfig"
        :series="series"
      />

      <div class="d-flex align-center justify-center flex-wrap mx-2 gap-x-6">
        <div class="d-flex align-center gap-2">
          <VBadge dot color="success"/>
          <span class="mt-1 text-caption">Rate:{{ rate }}%</span>
        </div>
        <div class="d-flex align-center gap-2">
          <VBadge dot color="success" style="opacity:0.2"/>
          <span class="mt-1 text-caption">24h: ±{{ change }}%</span>
        </div>
        <div class="d-flex align-center gap-2">
          <VBadge dot color="secondary"/>
          <span class="mt-1 text-caption">Max:{{ max }}%</span>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>
