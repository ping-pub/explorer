<template>
  <trading-vue
    :data="chart"
    :width="width"
    :height="height"
    :toolbar="false"
    :color-back="colors.colorBack"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText"
  />
</template>

<script>
import TradingVue from 'trading-vue-js'
import Data from './data.json'

export default {
  name: 'App',
  components: { TradingVue },
  props: {
    list: {
      required: true,
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chart: Data,
      width: 700,
      height: 600,
      colors: {
        colorBack: '#283046', // '#fff',
        colorGrid: '#333', // '#eee',
        colorText: '#fff',
      },
    }
  },
  mounted() {
    Data.chart.data = this.list
    this.chart = Data
  },
  // mounted() {
  //   window.addEventListener('resize', this.onResize)
  // },
  // beforeDestroy() {
  //   window.removeEventListener('resize', this.onResize)
  // },
  methods: {
    onResize() {
      this.width = document.getElementById('kline-area')?.offsetWidth
      this.height = window.innerHeight
    },
  },
}
</script>
