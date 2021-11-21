<template>
  <div className="container-md">
    <b-row>
      <b-col
        cols="8"
        class="trade-left"
      >
        <Ticker />
        <Kline />
      </b-col>
      <b-col cols="4">
        <Place />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import Ticker from '@/components/KlineTrade/Ticker.vue'
import Place from '@/components/KlineTrade/Place.vue'
import Kline from '@/components/kline/index.vue'

export default {
  components: {
    BRow,
    BCol,
    Kline,
    Ticker,
    Place,
  },
}
</script>

<style scoped>
.trade-left {
  background: #283046;
  border-radius: 0.428rem;
  padding: 0.5rem 1.5rem 2rem 1.5rem;
}
</style>
