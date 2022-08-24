<template>
  <chartjs-component-doughnut-chart
    :height="height"
    :width="width"
    :data="data"
    :chart-data="data"
    :options="options"
  />
</template>

<script>
import { percent } from '@/libs/utils'
import { $themeColors } from '@themeConfig'

import ChartjsComponentDoughnutChart from './ChartjsComponentDoughnutChart'

export default {
  name: 'ChartDoughnut',
  components: {
    ChartjsComponentDoughnutChart,
  },
  props: {
    height: {
      type: Number,
      default: 235,
    },
    width: {
      type: Number,
      default: 235,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
        cutoutPercentage: 60,
        legend: {
          display: true,
          title: {
            display: true,
          },
        },
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              const label = data.datasets[0].labels[tooltipItem.index] || ''
              const value = data.datasets[0].data[tooltipItem.index]
              const total = data.datasets[0].data.reduce((t, c) => t + c)
              const output = ` ${label} : ${percent(value / total)} %`
              return output
            },
          },
          // Updated default tooltip UI
          shadowOffsetX: 1,
          shadowOffsetY: 1,
          shadowBlur: 8,
          // shadowColor: chartColors.tooltipShadow,
          backgroundColor: $themeColors.light,
          titleFontColor: $themeColors.dark,
          bodyFontColor: $themeColors.dark,
        },
      },
    }
  },
}
</script>
