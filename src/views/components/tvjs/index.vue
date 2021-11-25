<template>
  <trading-vue
    :data="tvData"
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

export default {
  name: 'App',
  components: { TradingVue },
  props: {
    list: [],
  },
  data() {
    return {
      width: 700,
      height: 600,
      colors: {
        colorBack: '#283046', // '#fff',
        colorGrid: '#333', // '#eee',
        colorText: '#fff',
      },
    }
  },

  computed: {
    tvData() {
      return {
        ohlcv: this.list,
      }
    },
  },
}

</script>
