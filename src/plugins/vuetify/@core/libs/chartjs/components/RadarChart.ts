import type { PluginOptionsByType } from 'chart.js'
import { Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Title, Tooltip } from 'chart.js'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { Radar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, PointElement, RadialLinearScale, LineElement, Filler)

export default defineComponent({
  name: 'RadarChart',
  props: {
    chartId: {
      type: String,
      default: 'radar-chart',
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: '',
      type: String,
    },
    styles: {
      type: Object as PropType<Partial<CSSStyleDeclaration>>,
      default: () => ({}),
    },
    plugins: {
      type: Array as PropType<PluginOptionsByType<'radar'>[]>,
      default: () => [],
    },
    chartData: {
      type: Object,
      default: () => ({}),
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () =>
      h(h(Radar), {
        data: props.chartData,
        options: props.chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins,
      })
  },
})
