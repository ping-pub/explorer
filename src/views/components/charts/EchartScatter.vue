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
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  provide: {
    [THEME_KEY]: 'light',
  },
  computed: {
    option() {
      const colors = chartColors()
      const series = this.items.filter(x => x[1] > 0).map((item, index) => ({
        name: item[3],
        data: [item],
        type: 'scatter',
        symbolSize(data) {
          const r = Math.log10(data[2]) * 5
          return r < 10 ? 10 : r
        },
        emphasis: {
          focus: 'series',
          label: {
            show: true,
            formatter(param) {
              return `${param.data[3]}, ${formatNumber(param.data[2], true, 1)}`
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
          left: '5%',
          top: '3%',
        },
        legend: {
          right: '10%',
          top: '3%',
          data: assets,
        },
        xAxis: {
          name: 'Qty',
          nameLocation: 'center',
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          axisLabel: {
            show: false,
            formatter(param) {
              return formatNumber(param, true, 0)
            },
          },
        },
        yAxis: {
          name: 'Price',
          nameLocation: 'center',
          axisLabel: {
            show: false,
            formatter(param) {
              return formatNumber(param, true, 0)
            },
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          scale: true,
        },
        series,
        // series: [
        //   {
        //     name: '',
        //     data: this.items.filter(x => x[1] > 0),
        //     type: 'scatter',
        //     symbolSize(data) {
        //       const r = Math.log10(data[2])
        //       return r * 5
        //     },
        //     emphasis: {
        //       focus: 'series',
        //       label: {
        //         show: true,
        //         formatter(param) {
        //           return `${param.data[3]}, ${formatNumber(param.data[2], true, 0)}`
        //         },
        //         position: 'top',
        //       },
        //     },
        //     itemStyle: {
        //       shadowBlur: 10,
        //       shadowColor: 'rgba(120, 36, 50, 0.5)',
        //       shadowOffsetY: 5,
        //       color: '#28c76f',
        //     },
        //   },
        // ],
      }
    },
  },
}
</script>

<style scoped>
.chart {
  height: 300px;
  width: 100%;
}
</style>
