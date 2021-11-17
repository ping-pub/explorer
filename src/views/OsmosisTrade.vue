<template>
  <div class="container-md">
    -------
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
                  #{{ data.id }} {{ formatDenom(data.poolAssets[0].token.denom) }} - {{ formatDenom(data.poolAssets[1].token.denom) }}<small class="font-small-2"> xx</small>
                </b-card-title>
                <div class="font-small-2">
                  Height
                </div>
                <h5 class="mb-1">
                  {{ data.address || '0' }}
                </h5>
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
  BCard, BCardTitle, VBTooltip, BRow, BCol,
} from 'bootstrap-vue'
import { formatTokenDenom } from '@/libs/data'

export default {
  components: {
    BRow,
    BCol,
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
    // 所有方法添加到 $http.osmosis
    this.$http.osmosis.getPools().then(res => {
      this.pools = res
    })
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
