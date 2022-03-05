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
import { formatNumber } from '@/libs/utils'

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
      return {
        title: {
          text: '',
          left: '5%',
          top: '3%',
        },
        // legend: {
        //   right: '10%',
        //   top: '3%',
        //   data: ['1990', '2015'],
        // },
        // grid: {
        //   left: '8%',
        //   top: '10%',
        // },
        xAxis: {
          name: 'Qty',
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          axisLabel: {
            formatter(param) {
              return formatNumber(param, true, 0)
            },
          },
        },
        yAxis: {
          name: 'Value',
          axisLabel: {
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
        series: [
          {
            name: '',
            data: this.items,
            type: 'scatter',
            symbolSize(data) {
              const r = Math.log(data[2]) * 5
              if (r > 50) {
                return 50
              }
              if (r < 10) {
                return 10
              }
              return r
            },
            emphasis: {
              focus: 'series',
              label: {
                show: true,
                formatter(param) {
                  return param.data[3]
                },
                position: 'top',
              },
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              shadowOffsetY: 5,
              color: '#7367F0',
            },
          },
        ],
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
