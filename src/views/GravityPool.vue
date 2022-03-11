<template>
  <div class="container-md">
    <b-row class="match-height">
      <b-col
        v-for="(data,index) in pools.pools"
        :key="index"
        md="4"
        sm="6"
      >
        <router-link :to="data.id">
          <b-card
            v-if="data"
            class="earnings-card text-left"
          >
            <b-row>
              <b-col cols="8">
                <b-card-title class="mb-1 text-uppercase">
                  #{{ data.id }} {{ formatDenom(data.reserve_coin_denoms[0]) }} - {{ formatDenom(data.reserve_coin_denoms[1]) }}<small class="font-small-2"> xx</small>
                </b-card-title>
                <div class="font-small-2">
                  Height
                </div>
                <h5 class="mb-1">
                  {{ data.height || '0' }}
                </h5>
                <b-card-text class="text-muted font-small-2">
                  <span class="font-weight-bolder">{{ data.pool_coin_denom || '...' }}</span>
                </b-card-text>
              </b-col>
              <b-col
                cols="4"
              >
                <b-avatar
                  :src="data.logo"
                  class="mt-1 badge-minimal"
                  variant="light-primary"
                  rounded
                  size="82"
                  badge
                  :badge-variant="data.variant"
                /></b-col>
            </b-row>
          </b-card>
        </router-link>
      </b-col>

      <!-- no result found -->
      <b-col
        v-show="!chains"
        cols="12"
        class="text-center"
      >
        <h4 class="mt-4">
          No blockchain found!!
        </h4>
      </b-col>
      <!--/ no result found -->
    </b-row>
  </div>
</template>

<script>
import {
  BCard, BCardTitle, VBTooltip,
} from 'bootstrap-vue'
import { formatTokenDenom } from '@/libs/utils'
// import fetch from 'node-fetch'

export default {
  components: {
    BCard,
    BCardTitle,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      pools: [],
      ibcDenom: {},
    }
  },
  created() {
    this.$http.getGravityPools().then(res => {
      this.pools = res
      res.pools.forEach(x => {
        const denom1 = x.reserve_coin_denoms[0]
        const denom2 = x.reserve_coin_denoms[1]
        if (denom1.startsWith('ibc')) {
          this.$http.getIBCDenomTrace(denom1).then(denom => {
            this.$set(this.ibcDenom, denom1, denom)
          })
        }
        if (denom2.startsWith('ibc')) {
          this.$http.getIBCDenomTrace(denom2).then(denom => {
            this.$set(this.ibcDenom, denom2, denom)
          })
        }
      })
    })
  },
  beforeDestroy() {
    this.islive = false
    clearInterval(this.timer)
  },
  methods: {
    formatDenom(v) {
      // console.log(v, this.ibcDenom[v])
      const denom = (v.startsWith('ibc') ? this.ibcDenom[v].denom_trace.base_denom : v)
      return formatTokenDenom(denom)
    },
    length: v => (Array.isArray(v) ? v.length : 0),
  },
}
</script>
