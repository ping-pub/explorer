import type { PluginOptionsByType } from 'chart.js'
import { Chart as ChartJS, Legend, LinearScale, PointElement, Title, Tooltip } from 'chart.js'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { Bubble } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, PointElement, LinearScale)

export default defineComponent({
  name: 'BubbleChart',
  props: {
    chartId: {
      type: String,
      default: 'bubble-chart',
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
      type: Array as PropType<PluginOptionsByType<'bubble'>[]>,
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
      h(h(Bubble), {
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
