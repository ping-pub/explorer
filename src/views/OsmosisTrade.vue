<template>
  <div className="container-md">
    <b-row class="match-height">
      <b-col
        md="8"
        sm="12"
      >
        <b-card>
          <b-row class="mb-1">
            <b-col
              lg="4"
              md="6"
              sm="12"
              class="d-flex justify-content-begin align-items-center"
            >
              <b-button
                id="popover-trading-pairs"
                variant="gradient-primary"
              >
                <feather-icon
                  icon="ListIcon"
                />
              </b-button>
              <h4 class="text-primary font-weight-bolder text-nowrap ml-1">
                {{ base }} / {{ target }}
              </h4>
              <b-popover
                target="popover-trading-pairs"
                placement="rightbottom"
                triggers="hover"
                boundary="scrollParent"
                boundary-padding="0"
                class="px-0"
              >
                <b-table
                  striped
                  hover
                  :fields="fields"
                  :small="true"
                  :items="pairs"
                  class="ml-0 pl-0"
                >

                  <template #cell(pair)="data">
                    <router-link
                      :to="`/osmosis/osmosis/trade/${data.item.id}`"
                    >
                      {{ data.item.pair[0] }}/{{ data.item.pair[1] }}
                    </router-link>
                  </template>
                  <template #cell(price)="data">
                    <div class="text-right">
                      <small class="">{{ data.item.price }}</small>
                    </div>
                  </template>
                  <template #cell(change)="data">
                    <div class="text-right">
                      <small :class="data.item.change > 0 ? 'text-success': 'text-danger'">{{ data.item.change }}%</small>
                    </div>
                  </template>
                </b-table>
              </b-popover>
            </b-col>
            <b-col class="d-flex justify-content-begin align-items-center">
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
                <div>{{ high24 }}</div>
              </div>
              <div>
                <small>24h Low</small>
                <div>{{ low24 }}</div>
              </div>
            </b-col>
          </b-row>
          <summary-price-chart
            v-if="!loading"
            :chart-data="marketChartData"
            :min-height="150"
          />
          <div
            v-else
            class="d-flex justify-content-center mt-3"
          >
            <b-spinner label="Loading..." /> {{ error }}
          </div>
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
  BRow, BCol, BCard, BButton, BPopover, BTable, BSpinner,
} from 'bootstrap-vue'
import { CoinGeckoMap, getPairName } from '@/libs/osmos'
import { formatTokenDenom } from '@/libs/utils'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import Place from './components/KlineTrade/Place.vue'
// import Kline from './components/kline/index.vue'

export default {
  components: {
    BRow,
    BCol,
    BButton,
    BPopover,
    BTable,
    BSpinner,
    Place,
    BCard,
    FeatherIcon,
  },
  beforeRouteUpdate(to, from, next) {
    const { poolid } = to.params
    this.init(poolid)
    next()
    // }
  },
  data() {
    return {
      loading: true,
      error: '',
      base: '',
      target: '',
      fields: ['pair', 'price', 'change'],
      show: false,
      pools: [],
      current: {},
      denomTrace: [],
      klineData: [],
      marketData: {},
      high24: 0,
      low24: 0,
    }
  },
  computed: {
    pairs() {
      const pairs = this.pools.map(x => {
        const pair = x.poolAssets.map(t => {
          if (t.token.denom.startsWith('ibc/')) {
            return formatTokenDenom(this.denomTrace[t.token.denom] ? this.denomTrace[t.token.denom].base_denom : ' ')
          }
          return formatTokenDenom(t.token.denom)
        })
        return {
          id: x.id,
          pair,
          price: this.getPrice(pair),
          change: this.getChanges(pair),
        }
      })
      return pairs
    },
    latestPrice() {
      return this.getPrice([this.base, this.target])
    },
    changesIn24H() {
      return this.getChanges([this.base, this.target])
    },
    marketChartData() {
      if (this.marketData && this.marketData.prices) {
        const labels = this.marketData.prices.map(x => x[0])
        const data = this.marketData.prices.map(x => x[1])
        return {
          labels,
          datasets: [
            {
              label: 'Price',
              data,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              pointStyle: 'dash',
              barThickness: 15,
            },
          ],
        }
      }
      return { labels: [], datasets: [] }
    },
  },
  created() {
    const { poolid } = this.$route.params
    this.$http.osmosis.getDenomTraces().then(x => {
      this.denomTrace = x
      this.$http.osmosis.getPools().then(pools => {
        this.pools = pools
        this.init(poolid)
      })
    })
  },
  methods: {
    getPrice(symbol) {
      const p1 = this.$store.state.chains.quotes[symbol[0]]
      const p2 = this.$store.state.chains.quotes[symbol[1]]
      return p1 && p2 ? (p1.usd / p2.usd).toFixed(4) : '-'
    },
    getChanges(symbol) {
      const p1 = this.$store.state.chains.quotes[symbol[0]]
      const p2 = this.$store.state.chains.quotes[symbol[1]]
      return p1 && p2 ? (p1.usd_24h_change / p2.usd_24h_change).toFixed(2) : '-'
    },
    init(poolid) {
      this.high24 = 0
      this.low24 = 0
      this.current = this.pools.find(p => p.id === poolid) || this.pools[0]
      this.base = getPairName(this.current, this.denomTrace, 'base')
      this.target = getPairName(this.current, this.denomTrace, 'target')
      this.$http.osmosis.getMarketData(CoinGeckoMap[this.base], CoinGeckoMap[this.target]).then(res => {
        this.marketData = res
        this.loading = false
        const start = Date.now() - 8.64e+7
        res.prices.forEach(x => {
          if (x[0] > start) {
            if (x[1] > this.high24) {
              // eslint-disable-next-line prefer-destructuring
              this.high24 = x[1]
            }
            if (x[1] < this.low24 || this.low24 === 0) {
              // eslint-disable-next-line prefer-destructuring
              this.low24 = x[1]
            }
          }
        })
      }).catch(e => {
        this.error = `This feature is not avalable in your country. \n这个功能尚未对你的国家开放。${e}`
      })
    },
  },
}
</script>

<style scoped>

</style>
