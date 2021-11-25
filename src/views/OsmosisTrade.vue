<template>
  <div className="container-md">
    <b-row class="match-height">
      <b-col
        md="8"
        sm="12"
      >
        <b-card>
          <div class="d-flex justify-content-begin align-items-center mb-1">
            <b-button
              id="popover-button-3"
              variant="flat-primary"
              class="mr-3"
              @click="show = !show"
            >
              {{ base }} / {{ target }}
            </b-button>

            <b-popover
              :show.sync="show"
              target="popover-button-3"
              placement="bottom"
              triggers="click"
              style="width:300px;"
            >
              <template #title>
                Pairs
              </template>
              <b-table
                striped
                hover
                :small="true"
                :items="pairs"
                class="m-0"
              >

                <template #cell(pair)="data">
                  <router-link
                    :to="`/osmosis/osmosis/trade/${data.item.id}`"
                  >
                    {{ data.item.pair[0] }} / {{ data.item.pair[1] }}
                  </router-link>
                </template>
              </b-table>
            </b-popover>
            <div class="mr-3 text-success font-weight-bolder">
              {{ latestPrice }}
            </div>
            <div class="mr-3">
              <small>24h Change</small>
              <div :class="changesIn24H > 0 ? 'text-success': 'text-danger'">
                {{ changesIn24H }}%
              </div>
            </div>
            <div class="mr-3">
              <small>24h High</small>
              <div>-</div>
            </div>
            <div>
              <small>24h Low</small>
              <div>-</div>
            </div>
          </div>
          <Kline :list="klineData" />
        </b-card>
      </b-col>
      <b-col
        md="4"
        sm="12"
      >
        <b-card>
          <Place
            :pool.sync="current"
            :denom-trace="denomTrace"
          />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BRow, BCol, BCard, BButton, BPopover, BTable,
} from 'bootstrap-vue'
import { getPairName } from '@/libs/osmos'
import Place from './components/KlineTrade/Place.vue'
import Kline from './components/kline/index.vue'

export default {
  components: {
    BRow,
    BCol,
    BButton,
    BPopover,
    BTable,
    Kline,
    Place,
    BCard,
  },
  data() {
    return {
      show: false,
      // pairs: [
      //   { pair: 'ATOM/OSMO' },
      //   { pair: 'IRIS/OSMO' },
      //   { pair: 'AKT/OSMO' },
      //   { pair: 'ATOM/OSMO' },
      //   { pair: 'ATOM/OSMO' },
      // ],
      pools: [],
      current: {},
      denomTrace: [],
      klineData: [],
    }
  },
  computed: {
    base() {
      return getPairName(this.current, this.denomTrace, 'base')
    },
    target() {
      return getPairName(this.current, this.denomTrace, 'target')
    },
    pairs() {
      const pairs = this.pools.map(x => {
        const x2 = {
          id: x.id,
          pair: x.poolAssets.map(t => {
            if (t.token.denom.startsWith('ibc/')) {
              return (this.denomTrace[t.token.denom] ? this.denomTrace[t.token.denom].base_denom : ' ')
            }
            return t.token.denom
          }),
        }
        return x2
      })
      return pairs
    },
    latestPrice() {
      const p1 = this.$store.state.chains.quotes[this.base]
      const p2 = this.$store.state.chains.quotes[this.target]
      return p1 && p2 ? (p1.usd / p2.usd).toFixed(4) : '-'
    },
    changesIn24H() {
      const p1 = this.$store.state.chains.quotes[this.base]
      const p2 = this.$store.state.chains.quotes[this.target]
      return p1 && p2 ? (p1.usd_24h_change / p2.usd_24h_change).toFixed(2) : '-'
    },
  },
  created() {
    const { base, target } = this.$route.params
    this.init(base, target)
    // 所有方法添加到 $http.osmosis
    this.$http.osmosis.getOHCL4Pairs(
      this.$http.osmosis.getCoinGeckoId(base),
      this.$http.osmosis.getCoinGeckoId(target),
    ).then(data => {
      this.klineData = data
    })
    this.$http.osmosis.getDenomTraces().then(x => {
      this.denomTrace = x
    })
    this.$http.osmosis.getPools().then(x => {
      this.pools = x
      const id = this.$route.params.poolid || '1'
      this.current = this.pools.find(p => p.id === id) || this.pools[0]
    })
  },
  beforeRouteUpdate(to, from, next) {
    const { poolid } = to.params
    this.init(poolid)
    next()
    // }
  },
  methods: {
    init(poolid) {
      this.current = this.pools.find(p => p.id === poolid) || this.pools[0]
    },
  },
}
</script>

<style scoped>

</style>
