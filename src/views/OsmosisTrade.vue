<template>
  <div class="container-md">
    -------
    <b-row class="match-height">
      <b-col
        md="4"
        sm="6"
      >
        <router-link to="">
          <b-card
            class="earnings-card text-left"
          >
            <b-row>
              <b-col cols="8">
                x
              </b-col>
            </b-row>
          </b-card>
        </router-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BCard, VBTooltip, BRow, BCol,
} from 'bootstrap-vue'
import { formatTokenDenom } from '@/libs/data'

export default {
  components: {
    BRow,
    BCol,
    BCard,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      trade_pairs: [
        {
          from: {
            denom: 'atom',
            origin_denom: 'atom',
            coingecko_id: 'cosmos',
          },
          to: {
            denom: 'osmo',
            origin_denom: 'osmos',
            coingecko_id: 'osmosis',
          },
        },
      ],
      pools: [],
      ibcDenom: {},
    }
  },
  created() {
    // 所有方法添加到 $http.osmosis
    this.$http.osmosis.getOHCL4Pairs('cosmos', 'osmosis').then(data => {
      console.log(data)
    })
    // this.$http.osmosis.getPools().then(res => {
    //   this.pools = res
    // })
  },
  beforeDestroy() {
    this.islive = false
    clearInterval(this.timer)
  },
  methods: {
    formatDenom(v) {
      return formatTokenDenom(v)
    },
    length: v => (Array.isArray(v) ? v.length : 0),
  },
}
</script>
