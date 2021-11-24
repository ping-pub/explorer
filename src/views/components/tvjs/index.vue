<template>
  <trading-vue
    :data="chart"
    :width="width"
    :height="height"
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
  data() {
    return {
      chart: Data,
      width: document.getElementById('kline-area')?.offsetWidth,
      height: window.innerHeight,
      colors: {
        colorBack: '#fff',
        colorGrid: '#eee',
        colorText: '#333',
      },
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.width = document.getElementById('kline-area')?.offsetWidth
      this.height = window.innerHeight
    },
  },
}
</script>
