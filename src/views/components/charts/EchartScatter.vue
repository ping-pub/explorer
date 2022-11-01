<template>
  <div>
    <v-chart
      class="chart"
      autoresize
      :option="option"
    /></div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { chartColors, formatNumber } from '@/libs/utils'

use([
  CanvasRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

export default {
  name: 'AssetScatter',
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'light',
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    option() {
      const colors = chartColors()
      const series = this.items.filter(x => x[1] > 0).map((item, index) => ({
        name: item[3],
        data: [item],
        type: 'scatter',
        symbolSize(data) {
          const r = Math.log(data[2]) * 8
          return r < 15 ? 15 : r
        },
        emphasis: {
          focus: 'series',
          label: {
            show: true,
            formatter(param) {
              return `${param.data[3]}, $${parseFloat(param.data[2]).toFixed(2)}`
            },
            position: 'top',
          },
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(120, 36, 50, 0.5)',
          shadowOffsetY: 5,
          color: index > colors.length ? colors[0] : colors[index],
        },
      }))
      const assets = this.items.filter(x => x[1] > 0).map(x => x[3])
      return {
        title: {
          text: '',
        },
        legend: {
          scroll: 'scroll',
          data: assets,
          textStyle: {
            color: '#aaa',
          },
          top: 'top',
        },
        grid: { top: `${assets.length > 30 ? 30 : assets.length + 20}%` }, // */
        xAxis: {
          name: 'Qty',
          nameLocation: 'center',
          axisLabel: {
            show: false,
            formatter(param) {
              return formatNumber(param, true, 0)
            },
          },
        },
        yAxis: {
          name: 'Value',
          nameLocation: 'center',
          axisLabel: {
            show: false,
            formatter(param) {
              return formatNumber(param, true, 0)
            },
          },
          scale: true,
        },
        series,
      }
    },
  },
}
</script>

<style scoped>
.chart {
  min-height: 300px;
  width: 100%;
}
</style>
